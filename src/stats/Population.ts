import { DataSeries } from "./DataSeries";
import { TimeSeries } from "./TimeSeries";

export class Population {
	population: number;
	sizeSeries: TimeSeries;
	durationSeries: DataSeries;
	constructor(public name?: string) {
		this.name = name;
		this.population = 0;
		this.sizeSeries = new TimeSeries(name);
		this.durationSeries = new DataSeries(name);
	}

	reset() {
		this.sizeSeries.reset();
		this.durationSeries.reset();
		this.population = 0;
	}

	enter(timestamp: number) {
		this.population++;
		this.sizeSeries.record(this.population, timestamp);
	}

	leave(arrivalAt: number, leftAt: number) {
		this.population--;
		this.sizeSeries.record(this.population, leftAt);
		this.durationSeries.record(leftAt - arrivalAt);
	}

	current() {
		return this.population;
	}

	finalize(timestamp: number) {
		this.sizeSeries.finalize(timestamp);
	}
}
