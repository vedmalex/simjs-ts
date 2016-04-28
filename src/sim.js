import { Sim, Event, Buffer, Facility, Store, ARG_CHECK } from './lib/sim.js'
import { DataSeries, TimeSeries, Population } from './lib/stats.js';
import { Request } from './lib/request.js';
import { PQueue, Queue } from './lib/queues.js';
import { Random } from './lib/random.js';

export { Sim, Event, Buffer, Facility, Store };
export { DataSeries, TimeSeries, Population };
export { Request };
export { PQueue, Queue, ARG_CHECK};
export { Random };

if (window) {
  window.Sim = {
    Sim: Sim,
    Event: Event,
    Buffer: Buffer,
    Facility: Facility,
    Store: Store,
    DataSeries: DataSeries,
    TimeSeries: TimeSeries,
    Population: Population,
    Request: Request,
    PQueue: PQueue,
    Queue: Queue,
    Random: Random,
    ARG_CHECK: ARG_CHECK
  };
}
