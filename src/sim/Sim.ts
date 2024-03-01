import { PQueue } from "../queues/PQueue";
import type { EntityConstructor } from "../types/EntityConstructor";
import type { Finalize } from "../types/Finalize";
import type { Logger } from "../types/Logger";
import type { OnMessage } from "../types/OnMessage";
import type { Start } from "../types/Start";
import { Entity } from "./Entity";

export class Sim {
	simTime = 0;
	events = 0;
	endTime = 0;
	maxEvents = 0;
	entities: Array<Entity & OnMessage & Start & Finalize> = [];
	entitiesByName: Record<string, Entity> = {};
	queue = new PQueue();
	entityId = 1;
	paused = 0;
	running = false;
	logger!: Logger;
	constructor(public name?: string) {}

	time() {
		return this.simTime;
	}

	addEntity<T extends Entity>(Klass: EntityConstructor<T>, name?: string, ...args: Array<unknown>) {
		// Verify that prototype has start function
		if (!Klass.prototype.start) {
			// ARG CHECK
			throw new Error(`Entity class ${Klass.name} must have start() function defined`);
		}
		if (typeof name === "string" && typeof this.entitiesByName[name] !== "undefined") {
			throw new Error(`Entity name ${name} already exists`);
		}

		const entity = new Klass(this, name);

		this.entities.push(entity);
		if (typeof name === "string") {
			this.entitiesByName[name] = entity;
		}

		entity.start?.(...args);

		return entity;
	}

	simulate(endTime: number, maxEvents?: number) {
		this.events = 0;
		this.maxEvents = maxEvents ? maxEvents : Infinity;
		this.endTime = endTime;
		this.running = true;
		this.pause();
		return this.resume();
	}

	pause() {
		++this.paused;
	}

	resume() {
		if (this.paused > 0) {
			--this.paused;
		}
		if (this.paused <= 0 && this.running) {
			while (true) {
				// eslint-disable-line no-constant-condition
				this.events++;
				if (this.events > this.maxEvents) return false;

				// Get the earliest event
				const ro = this.queue.remove();

				// If there are no more events, we are done with simulation here.
				if (!ro) break;

				// Uh oh.. we are out of time now
				if (ro.deliverAt > this.endTime) break;

				// Advance simulation time
				this.simTime = ro.deliverAt;

				// If this event is already cancelled, ignore
				if (ro.cancelled) continue;

				ro.deliver();
				if (this.paused) {
					return true;
				}
			}
			this.running = false;
			this.finalize();
		}
		return true;
	}

	step() {
		while (true) {
			// eslint-disable-line no-constant-condition
			const ro = this.queue.remove();

			if (ro == null) return false;
			this.simTime = ro.deliverAt;
			if (ro.cancelled) continue;
			ro.deliver();
			break;
		}
		return true;
	}

	finalize() {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].finalize?.(this.simTime);
		}
	}

	setLogger(logger: Logger) {
		this.logger = logger;
	}

	log(message: unknown, entity?: Entity) {
		if (!this.logger) return;
		let entityMsg = "";

		if (typeof entity !== "undefined") {
			if (entity.name) {
				entityMsg = ` [${entity.name}]`;
			} else {
				entityMsg = ` [${entity.id}] `;
			}
		}
		this.logger(`${this.simTime.toFixed(6)}${entityMsg}   ${message}`);
	}
}
