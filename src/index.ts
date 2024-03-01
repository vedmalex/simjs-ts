import { FacilityBase } from "./facility/FacilityBase";
import { FacilityFCFS } from "./facility/FacilityFCFS";
import { FacilityFabric } from "./facility/FacilityFabric";
import { FacilityLCFS } from "./facility/FacilityLCFS";
import { FacilityPS } from "./facility/FacilityPS";
import type { FacilityT } from "./facility/FacilityT";
import { PQueue } from "./queues/PQueue";
import { Queue } from "./queues/Queue";
import { Request } from "./request/Request";
import { Buffer } from "./sim/Buffer";
import { Entity } from "./sim/Entity";
import { Event } from "./sim/Event";
import { Model } from "./sim/Model";
import { Sim } from "./sim/Sim";
import { Store } from "./sim/Store";
import { DataSeries } from "./stats/DataSeries";
import { Population } from "./stats/Population";
import { TimeSeries } from "./stats/TimeSeries";
import { CreateFacility } from "./types/CreateFacility";
import { Discipline } from "./types/Discipline";
import { Random } from "./utils/Random";

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
export type { FacilityT };
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
