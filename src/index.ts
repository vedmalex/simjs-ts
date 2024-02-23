import { Random } from "./Random";
import { Buffer } from "./Sim/Buffer";
import { Entity } from "./Sim/Entity";
import { Event } from "./Sim/Event";
import { Facility } from "./Sim/Facility";
import { Model } from "./Sim/Model";
import { Request } from "./Sim/Request";
import { Sim } from "./Sim/Sim";
import { Store } from "./Sim/Store";
import { PQueue } from "./queues/PQueue";
import { Queue } from "./queues/Queue";
import { DataSeries } from "./statictics/DataSeries";
import { Population } from "./statictics/Population";
import { TimeSeries } from "./statictics/TimeSeries";

export { Sim, Entity, Event, Buffer, Facility, Store };
export { DataSeries, TimeSeries, Population };
export { Request };
export { PQueue, Queue };
export { Random };
export { Model };

declare const window: { Sim: Record<string, unknown> };

if (typeof window !== "undefined") {
	window.Sim = {
		Buffer: Buffer,
		DataSeries: DataSeries,
		Entity: Entity,
		Event: Event,
		Facility: Facility,
		Model: Model,
		PQueue: PQueue,
		Population: Population,
		Queue: Queue,
		Random: Random,
		Request: Request,
		Sim: Sim,
		Store: Store,
		TimeSeries: TimeSeries,
	};
}
