import type { FacilityT } from "../facility/FacilityT";
import { type PQueueRequest } from "../request/PQueueRequest";
import { Request } from "../request/Request";
import type { BufferRequest } from "../types/BufferRequest";
import type { StoreFilter } from "../types/StoreFilter";
import type { StoreRequest } from "../types/StoreRequest";
import { sendMessage } from "../utils/sendMessage";
import { Buffer } from "./Buffer";
import { Event } from "./Event";
import { Model } from "./Model";
import { Sim } from "./Sim";
import { Store } from "./Store";

export class Entity extends Model {
	sim: Sim;
	constructor(sim: Sim, name?: string) {
		super(name);
		this.sim = sim;
	}

	time() {
		return this.sim.time();
	}

	setTimer(duration: number) {
		const ro = new Request(this, this.sim.time(), this.sim.time() + duration) as PQueueRequest;

		this.sim.queue.insert(ro);
		return ro;
	}

	waitEvent(event: Event) {
		const ro = new Request(this, this.sim.time(), 0) as PQueueRequest;

		ro.source = event;
		event.addWaitList(ro);
		return ro;
	}

	queueEvent(event: Event) {
		const ro = new Request(this, this.sim.time(), 0) as PQueueRequest;

		ro.source = event;
		event.addQueue(ro);
		return ro;
	}

	useFacility(facility: FacilityT, duration: number) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = facility;
		facility.use(duration, ro);
		return ro;
	}

	putBuffer(buffer: Buffer, amount: number) {
		const ro = new Request(this, this.sim.time(), 0) as BufferRequest;

		ro.source = buffer;
		buffer.put(amount, ro);
		return ro;
	}

	getBuffer(buffer: Buffer, amount: number) {
		const ro = new Request(this, this.sim.time(), 0) as BufferRequest;

		ro.source = buffer;
		buffer.get(amount, ro);
		return ro;
	}

	putStore<T>(store: Store<T>, obj: T) {
		const ro = new Request(this, this.sim.time(), 0) as StoreRequest<T>;

		ro.source = store;
		store.put(obj, ro);
		return ro;
	}

	getStore<T>(store: Store<T>, filter?: StoreFilter<T> | undefined) {
		const ro = new Request(this, this.sim.time(), 0) as StoreRequest<T>;

		ro.source = store;
		store.get(filter, ro);
		return ro;
	}

	send(message: unknown, delay: number, entities?: Entity | Array<Entity>) {
		const ro = new Request(this.sim, this.time(), this.time() + delay) as PQueueRequest;

		ro.source = this;
		ro.msg = message;
		ro.data = entities;
		ro.deliver = sendMessage;

		this.sim.queue.insert(ro);
	}

	log(message: string) {
		this.sim.log(message, this);
	}
}
