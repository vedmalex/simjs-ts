import { Model } from "./Model";
import { Request } from "./Request";

export class Entity extends Model {
	constructor(sim, name) {
		super(name);
		this.sim = sim;
	}

	time() {
		return this.sim.time();
	}

	setTimer(duration) {
		const ro = new Request(this, this.sim.time(), this.sim.time() + duration);

		this.sim.queue.insert(ro);
		return ro;
	}

	waitEvent(event) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = event;
		event.addWaitList(ro);
		return ro;
	}

	queueEvent(event) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = event;
		event.addQueue(ro);
		return ro;
	}

	useFacility(facility, duration) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = facility;
		facility.use(duration, ro);
		return ro;
	}

	putBuffer(buffer, amount) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = buffer;
		buffer.put(amount, ro);
		return ro;
	}

	getBuffer(buffer, amount) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = buffer;
		buffer.get(amount, ro);
		return ro;
	}

	putStore(store, obj) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = store;
		store.put(obj, ro);
		return ro;
	}

	getStore(store, filter) {
		const ro = new Request(this, this.sim.time(), 0);

		ro.source = store;
		store.get(filter, ro);
		return ro;
	}

	send(message, delay, entities) {
		const ro = new Request(this.sim, this.time(), this.time() + delay);

		ro.source = this;
		ro.msg = message;
		ro.data = entities;
		ro.deliver = this.sim.sendMessage;

		this.sim.queue.insert(ro);
	}

	log(message) {
		this.sim.log(message, this);
	}
}
