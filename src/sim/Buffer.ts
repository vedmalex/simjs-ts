import { Queue } from "../queues/Queue";
import type { BufferRequest } from "../types/BufferRequest";
import { Model } from "./Model";

export class Buffer extends Model {
	capacity: number;
	available: number;
	putQueue: Queue<BufferRequest>;
	getQueue: Queue<BufferRequest>;
	constructor(name: string, capacity: number, initial?: number) {
		super(name);
		this.capacity = capacity;
		this.available = typeof initial === "undefined" ? 0 : initial;
		this.putQueue = new Queue();
		this.getQueue = new Queue();
	}

	current() {
		return this.available;
	}

	size() {
		return this.capacity;
	}

	get(amount: number, ro: BufferRequest) {
		if (this.getQueue.empty() && amount <= this.available) {
			this.available -= amount;

			ro.deliverAt = ro.entity.time();
			ro.deliveryPending = true;
			ro.entity.sim.queue.insert(ro);

			this.getQueue.passby(ro.deliverAt);

			this.progressPutQueue();

			return;
		}
		ro.amount = amount;
		this.getQueue.push(ro, ro.entity.time());
	}

	put(amount: number, ro: BufferRequest) {
		if (this.putQueue.empty() && amount + this.available <= this.capacity) {
			this.available += amount;

			ro.deliverAt = ro.entity.time();
			ro.deliveryPending = true;
			ro.entity.sim.queue.insert(ro);

			this.putQueue.passby(ro.deliverAt);

			this.progressGetQueue();

			return;
		}

		ro.amount = amount;
		this.putQueue.push(ro, ro.entity.time());
	}

	progressGetQueue() {
		let obj: BufferRequest;

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((obj = this.getQueue.top())) {
			// eslint-disable-line no-cond-assign
			// if obj is cancelled.. remove it.
			if (obj.cancelled) {
				this.getQueue.shift(obj.entity.time());
				continue;
			}

			// see if this request can be satisfied
			if (obj.amount <= this.available) {
				// remove it..
				this.getQueue.shift(obj.entity.time());
				this.available -= obj.amount;
				obj.deliverAt = obj.entity.time();
				obj.deliveryPending = true;
				obj.entity.sim.queue.insert(obj);
			} else {
				// this request cannot be satisfied
				break;
			}
		}
	}

	progressPutQueue() {
		let obj: BufferRequest;

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((obj = this.putQueue.top())) {
			// eslint-disable-line no-cond-assign
			// if obj is cancelled.. remove it.
			if (obj.cancelled) {
				this.putQueue.shift(obj.entity.time());
				continue;
			}

			// see if this request can be satisfied
			if (obj.amount + this.available <= this.capacity) {
				// remove it..
				this.putQueue.shift(obj.entity.time());
				this.available += obj.amount;
				obj.deliverAt = obj.entity.time();
				obj.deliveryPending = true;
				obj.entity.sim.queue.insert(obj);
			} else {
				// this request cannot be satisfied
				break;
			}
		}
	}

	putStats() {
		return this.putQueue.stats;
	}

	getStats() {
		return this.getQueue.stats;
	}
}
