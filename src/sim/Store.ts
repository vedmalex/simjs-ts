import { Queue } from "../queues/Queue";
import type { StoreFilter } from "../types/StoreFilter";
import type { StoreRequest } from "../types/StoreRequest";
import { Model } from "./Model";

export class Store<T> extends Model {
	capacity: number;
	objects: Array<T> = [];
	putQueue = new Queue<StoreRequest<T>>();
	getQueue = new Queue<StoreRequest<T>>();
	available = 0;
	constructor(capacity: number, name: string) {
		super(name);
		this.capacity = capacity;
	}

	current() {
		return this.objects.length;
	}

	size() {
		return this.capacity;
	}

	get(filter: StoreFilter<T> | undefined, ro: StoreRequest<T>) {
		if (this.getQueue.empty() && this.current() > 0) {
			let found = false;

			let obj: T | undefined = undefined;

			// TODO: refactor this code out
			// it is repeated in progressGetQueue
			if (filter) {
				for (let i = 0; i < this.objects.length; i++) {
					obj = this.objects[i];
					if (filter(obj)) {
						found = true;
						this.objects.splice(i, 1);
						break;
					}
				}
			} else {
				obj = this.objects.shift() as T;
				found = true;
			}

			if (found) {
				this.available--;

				ro.msg = obj;
				ro.deliverAt = ro.entity.time();
				ro.deliveryPending = true;
				ro.entity.sim.queue.insert(ro);

				this.getQueue.passby(ro.deliverAt);

				this.progressPutQueue();

				return;
			}
		}

		ro.filter = filter as StoreFilter<unknown>;
		this.getQueue.push(ro, ro.entity.time());
	}

	put(obj: T, ro: StoreRequest<T>) {
		if (this.putQueue.empty() && this.current() < this.capacity) {
			this.available++;

			ro.deliverAt = ro.entity.time();
			ro.deliveryPending = true;
			ro.entity.sim.queue.insert(ro);

			this.putQueue.passby(ro.deliverAt);
			this.objects.push(obj);

			this.progressGetQueue();

			return;
		}

		ro.obj = obj;
		this.putQueue.push(ro, ro.entity.time());
	}

	progressGetQueue() {
		let ro: StoreRequest<T>;

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((ro = this.getQueue.top())) {
			// eslint-disable-line no-cond-assign
			// if obj is cancelled.. remove it.
			if (ro.cancelled) {
				this.getQueue.shift(ro.entity.time());
				continue;
			}

			// see if this request can be satisfied
			if (this.current() > 0) {
				const filter = ro.filter;

				let found = false;

				let obj: T | undefined = undefined;

				if (filter) {
					for (let i = 0; i < this.objects.length; i++) {
						obj = this.objects[i];
						if (filter(obj)) {
							// eslint-disable-line max-depth
							found = true;
							this.objects.splice(i, 1);
							break;
						}
					}
				} else {
					obj = this.objects.shift();
					found = true;
				}

				if (found) {
					// remove it..
					this.getQueue.shift(ro.entity.time());
					this.available--;

					ro.msg = obj;
					ro.deliverAt = ro.entity.time();
					ro.deliveryPending = true;
					ro.entity.sim.queue.insert(ro);
				} else {
					break;
				}
			} else {
				// this request cannot be satisfied
				break;
			}
		}
	}

	progressPutQueue() {
		let ro: StoreRequest<T>;

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((ro = this.putQueue.top())) {
			// eslint-disable-line no-cond-assign
			// if obj is cancelled.. remove it.
			if (ro.cancelled) {
				this.putQueue.shift(ro.entity.time());
				continue;
			}

			// see if this request can be satisfied
			if (this.current() < this.capacity) {
				// remove it..
				this.putQueue.shift(ro.entity.time());
				this.available++;
				this.objects.push(ro.obj);
				ro.deliverAt = ro.entity.time();
				ro.deliveryPending = true;
				ro.entity.sim.queue.insert(ro);
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
