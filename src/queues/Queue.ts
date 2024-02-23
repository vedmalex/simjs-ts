import type { Entity } from "../Sim/Entity.js";
import { Model } from "../Sim/Model.js";
import { Population } from "../statictics/Population.js";

export class Queue<T = Entity> extends Model {
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

	finalize = (timestamp?: number) => {
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
