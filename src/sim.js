import { Model } from "./lib/model.js";
import { PQueue, Queue } from "./lib/queues.js";
import { Random } from "./lib/random.js";
import { Request } from "./lib/request.js";
import { Buffer, Entity, Event, Facility, Sim, Store } from "./lib/sim.js";
import { DataSeries, Population, TimeSeries } from "./lib/stats.js";

export { Sim, Entity, Event, Buffer, Facility, Store };
export { DataSeries, TimeSeries, Population };
export { Request };
export { PQueue, Queue };
export { Random };
export { Model };

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
