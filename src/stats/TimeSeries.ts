import { DataSeries } from "./DataSeries";

export class TimeSeries {
	dataSeries: DataSeries;
	lastValue = NaN;
	lastTimestamp = NaN;
	constructor(name?: string) {
		this.dataSeries = new DataSeries(name);
	}

	reset() {
		this.dataSeries.reset();
		this.lastValue = NaN;
		this.lastTimestamp = NaN;
	}

	setHistogram(lower: number, upper: number, nbuckets: number) {
		this.dataSeries.setHistogram(lower, upper, nbuckets);
	}

	getHistogram() {
		return this.dataSeries.getHistogram();
	}

	record(value: number, timestamp: number) {
		if (!Number.isNaN(this.lastTimestamp)) {
			this.dataSeries.record(this.lastValue, timestamp - this.lastTimestamp);
		}

		this.lastValue = value;
		this.lastTimestamp = timestamp;
	}

	finalize(timestamp: number) {
		this.record(NaN, timestamp);
	}

	count() {
		return this.dataSeries.count();
	}

	min() {
		return this.dataSeries.min();
	}

	max() {
		return this.dataSeries.max();
	}

	range() {
		return this.dataSeries.range();
	}

	sum() {
		return this.dataSeries.sum();
	}

	average() {
		return this.dataSeries.average();
	}

	deviation() {
		return this.dataSeries.deviation();
	}

	variance() {
		return this.dataSeries.variance();
	}
}
