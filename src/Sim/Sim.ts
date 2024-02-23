import { PQueue } from "../queues/PQueue.js";

export class Sim {
	constructor() {
		this.simTime = 0;
		this.events = 0;
		this.endTime = 0;
		this.maxEvents = 0;
		this.entities = [];
		this.entitiesByName = {};
		this.queue = new PQueue();
		this.endTime = 0;
		this.entityId = 1;
		this.paused = 0;
		this.running = false;
	}

	time() {
		return this.simTime;
	}

	sendMessage() {
		const sender = this.source;

		const message = this.msg;

		const entities = this.data;

		const sim = sender.sim;

		if (!entities) {
			// send to all entities
			for (let i = sim.entities.length - 1; i >= 0; i--) {
				const entity = sim.entities[i];

				if (entity === sender) continue;
				if (entity.onMessage) entity.onMessage(sender, message);
			}
		} else if (entities instanceof Array) {
			for (let i = entities.length - 1; i >= 0; i--) {
				const entity = entities[i];

				if (entity === sender) continue;
				if (entity.onMessage) entity.onMessage(sender, message);
			}
		} else if (entities.onMessage) {
			entities.onMessage(sender, message);
		}
	}

	addEntity(Klass, name, ...args) {
		if (
			typeof name === "string" &&
			typeof this.entitiesByName[name] !== "undefined"
		) {
			throw new Error(`Entity name ${name} already exists`);
		}

		const entity = new Klass(this, name);

		this.entities.push(entity);
		if (typeof name === "string") {
			this.entitiesByName[name] = entity;
		}

		entity.start(...args);

		return entity;
	}

	simulate(endTime, maxEvents) {
		if (!maxEvents) {
			maxEvents = Math.Infinity;
		}
		this.events = 0;
		this.maxEvents = maxEvents;
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
				if (ro === null) break;

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

			if (ro === null) return false;
			this.simTime = ro.deliverAt;
			if (ro.cancelled) continue;
			ro.deliver();
			break;
		}
		return true;
	}

	finalize() {
		for (let i = 0; i < this.entities.length; i++) {
			if (this.entities[i].finalize) {
				this.entities[i].finalize(this.simTime);
			}
		}
	}

	setLogger(logger) {
		this.logger = logger;
	}

	log(message, entity) {
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
