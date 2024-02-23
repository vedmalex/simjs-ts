import { Model } from "./model.js";
import type { PQueueRequest } from "./request.js";
import { Population } from "./stats.js";

export class Queue<T> extends Model {
	data: Array<T>;
	timestamp: Array<number>;
	stats: Population;
	constructor(name?: string) {
		super(name);
		this.data = [];
		this.timestamp = [];
		this.stats = new Population(name);
	}

	top() {
		return this.data[0];
	}

	back() {
		return this.data.length ? this.data[this.data.length - 1] : null;
	}

	push(value: T, timestamp: number) {
		this.data.push(value);
		this.timestamp.push(timestamp);

		this.stats.enter(timestamp);
	}

	unshift(value: T, timestamp: number) {
		this.data.unshift(value);
		this.timestamp.unshift(timestamp);
		this.stats.enter(timestamp);
	}

	shift(timestamp: number) {
		const value = this.data.shift();

		const enqueuedAt = this.timestamp.shift();

		if (enqueuedAt) this.stats.leave(enqueuedAt, timestamp);
		return value;
	}

	pop(timestamp: number) {
		const value = this.data.pop();

		const enqueuedAt = this.timestamp.pop();

		if (enqueuedAt) this.stats.leave(enqueuedAt, timestamp);
		return value;
	}

	passby(timestamp: number) {
		this.stats.enter(timestamp);
		this.stats.leave(timestamp, timestamp);
	}

	finalize = (timestamp: number) => {
		this.stats.finalize(timestamp);
	};

	reset() {
		this.stats.reset();
	}

	clear() {
		this.reset();
		this.data = [];
		this.timestamp = [];
	}

	report() {
		return [
			this.stats.sizeSeries.average(),
			this.stats.durationSeries.average(),
		];
	}

	empty() {
		return this.data.length === 0;
	}

	size() {
		return this.data.length;
	}
}

export class PQueue extends Model {
	data: Array<PQueueRequest>;
	order = 0;
	constructor(name?: string) {
		super(name);
		this.data = [];
		this.order = 0;
	}

	greater(ro1: PQueueRequest, ro2: PQueueRequest) {
		if (ro1.deliverAt > ro2.deliverAt) return true;
		if (ro1.deliverAt === ro2.deliverAt) return ro1.order > ro2.order;
		return false;
	}

	insert(ro: PQueueRequest) {
		ro.order = this.order++;

		let index = this.data.length;

		this.data.push(ro);

		// insert into data at the end
		const a = this.data as Array<PQueueRequest>;

		const node = a[index];

		// heap up
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);

			if (this.greater(a[parentIndex], ro)) {
				a[index] = a[parentIndex];
				index = parentIndex;
			} else {
				break;
			}
		}
		a[index] = node;
	}

	remove() {
		const a = this.data as Array<PQueueRequest>;

		let len = a.length;

		if (len <= 0) {
			return null;
		}
		if (len === 1) {
			return this.data.pop();
		}
		const top = a[0];

		// move the last node up
		// biome-ignore lint/style/noNonNullAssertion: by condition there is more than one items
		a[0] = a.pop()!;
		len--;

		// heap down
		let index = 0;

		const node = a[index];

		while (index < Math.floor(len / 2)) {
			const leftChildIndex = 2 * index + 1;

			const rightChildIndex = 2 * index + 2;

			const smallerChildIndex =
				rightChildIndex < len &&
				!this.greater(a[rightChildIndex], a[leftChildIndex])
					? rightChildIndex
					: leftChildIndex;

			if (this.greater(a[smallerChildIndex], node)) {
				break;
			}

			a[index] = a[smallerChildIndex];
			index = smallerChildIndex;
		}
		a[index] = node;
		return top;
	}
}
