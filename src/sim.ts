import { Model } from "./lib/model";
import { PQueue, Queue } from "./lib/queues";
import { Random } from "./lib/random";
import { Request } from "./lib/request";
import {
	Buffer,
	CreateFacility,
	Discipline,
	Entity,
	Event,
	FacilityBase,
	FacilityFCFS,
	FacilityFabric,
	FacilityLCFS,
	FacilityPS,
	Sim,
	Store,
} from "./lib/sim";
import { DataSeries, Population, TimeSeries } from "./lib/stats";

export {
	Sim,
	Entity,
	Event,
	Buffer,
	FacilityBase,
	FacilityFCFS,
	FacilityFabric,
	FacilityLCFS,
	FacilityPS,
	CreateFacility,
	Store,
	Discipline,
};
export { DataSeries, TimeSeries, Population };
export { Request };
export { PQueue, Queue };
export { Random };
export { Model };

declare const window: { Sim: Record<string, unknown> };
if (typeof window !== "undefined") {
	window.Sim = {
		Buffer,
		DataSeries,
		Entity,
		Event,
		FacilityBase,
		FacilityFCFS,
		FacilityFabric,
		FacilityLCFS,
		FacilityPS,
		CreateFacility,
		Model,
		PQueue,
		Population,
		Queue,
		Random,
		Request,
		Sim,
		Store,
		TimeSeries,
	};
}
