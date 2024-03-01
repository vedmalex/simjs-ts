// src/sim/Model.ts
class Model {
  id;
  name;
  static _totalInstances = 0;
  constructor(name) {
    this.id = this.constructor._nextId();
    this.name = name || `${this.constructor.name} ${this.id}`;
  }
  static get totalInstances() {
    return !this._totalInstances ? 0 : this._totalInstances;
  }
  static _nextId() {
    this._totalInstances = Model.totalInstances + 1;
    return this._totalInstances;
  }
}

// src/stats/DataSeries.ts
class DataSeries {
  name;
  Count;
  W;
  A;
  Q;
  Max;
  Min;
  Sum;
  hLower;
  hUpper;
  hBucketSize;
  histogram;
  constructor(name) {
    this.name = name;
    this.reset();
  }
  reset() {
    this.Count = 0;
    this.W = 0;
    this.A = 0;
    this.Q = 0;
    this.Max = (-Infinity);
    this.Min = Infinity;
    this.Sum = 0;
    if (this.histogram) {
      for (let i = 0;i < this.histogram.length; i++) {
        this.histogram[i] = 0;
      }
    }
  }
  setHistogram(lower, upper, nbuckets) {
    this.hLower = lower;
    this.hUpper = upper;
    this.hBucketSize = (upper - lower) / nbuckets;
    this.histogram = new Array(nbuckets + 2);
    for (let i = 0;i < this.histogram.length; i++) {
      this.histogram[i] = 0;
    }
  }
  getHistogram() {
    return this.histogram;
  }
  record(value, weight = 1) {
    if (value > this.Max)
      this.Max = value;
    if (value < this.Min)
      this.Min = value;
    this.Sum += value;
    this.Count++;
    if (this.histogram) {
      if (value < this.hLower) {
        this.histogram[0] += weight;
      } else if (value > this.hUpper) {
        this.histogram[this.histogram.length - 1] += weight;
      } else {
        const index = Math.floor((value - this.hLower) / this.hBucketSize) + 1;
        this.histogram[index] += weight;
      }
    }
    this.W = this.W + weight;
    if (this.W === 0) {
      return;
    }
    const lastA = this.A;
    this.A = lastA + weight / this.W * (value - lastA);
    this.Q = this.Q + weight * (value - lastA) * (value - this.A);
  }
  count() {
    return this.Count;
  }
  min() {
    return this.Min;
  }
  max() {
    return this.Max;
  }
  range() {
    return this.Max - this.Min;
  }
  sum() {
    return this.Sum;
  }
  sumWeighted() {
    return this.A * this.W;
  }
  average() {
    return this.A;
  }
  variance() {
    return this.Q / this.W;
  }
  deviation() {
    return Math.sqrt(this.variance());
  }
}

// src/stats/TimeSeries.ts
class TimeSeries {
  dataSeries;
  lastValue = NaN;
  lastTimestamp = NaN;
  constructor(name) {
    this.dataSeries = new DataSeries(name);
  }
  reset() {
    this.dataSeries.reset();
    this.lastValue = NaN;
    this.lastTimestamp = NaN;
  }
  setHistogram(lower, upper, nbuckets) {
    this.dataSeries.setHistogram(lower, upper, nbuckets);
  }
  getHistogram() {
    return this.dataSeries.getHistogram();
  }
  record(value, timestamp) {
    if (!Number.isNaN(this.lastTimestamp)) {
      this.dataSeries.record(this.lastValue, timestamp - this.lastTimestamp);
    }
    this.lastValue = value;
    this.lastTimestamp = timestamp;
  }
  finalize(timestamp) {
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

// src/stats/Population.ts
class Population {
  name;
  population;
  sizeSeries;
  durationSeries;
  constructor(name) {
    this.name = name;
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
  enter(timestamp) {
    this.population++;
    this.sizeSeries.record(this.population, timestamp);
  }
  leave(arrivalAt, leftAt) {
    this.population--;
    this.sizeSeries.record(this.population, leftAt);
    this.durationSeries.record(leftAt - arrivalAt);
  }
  current() {
    return this.population;
  }
  finalize(timestamp) {
    this.sizeSeries.finalize(timestamp);
  }
}

// src/facility/FacilityBase.ts
class FacilityBase extends Model {
  free;
  servers;
  maxqlen;
  stats = new Population;
  busyDuration = 0;
  constructor(name, servers, maxqlen) {
    super(name);
    this.free = servers ? servers : 1;
    this.servers = servers ? servers : 1;
    this.maxqlen = typeof maxqlen === "undefined" ? -1 : 1 * maxqlen;
  }
  reset() {
    this.stats.reset();
    this.busyDuration = 0;
  }
  systemStats() {
    return this.stats;
  }
  usage() {
    return this.busyDuration;
  }
  finalize(timestamp) {
    this.stats.finalize(timestamp);
  }
  use(duration, ro) {
    throw new Error("not implemented");
  }
}

// src/queues/Queue.ts
class Queue extends Model {
  data;
  timestamp;
  stats;
  constructor(name) {
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
  push(value, timestamp) {
    this.data.push(value);
    this.timestamp.push(timestamp);
    this.stats.enter(timestamp);
  }
  unshift(value, timestamp) {
    this.data.unshift(value);
    this.timestamp.unshift(timestamp);
    this.stats.enter(timestamp);
  }
  shift(timestamp) {
    const value = this.data.shift();
    const enqueuedAt = this.timestamp.shift();
    if (enqueuedAt)
      this.stats.leave(enqueuedAt, timestamp);
    return value;
  }
  pop(timestamp) {
    const value = this.data.pop();
    const enqueuedAt = this.timestamp.pop();
    if (enqueuedAt)
      this.stats.leave(enqueuedAt, timestamp);
    return value;
  }
  passby(timestamp) {
    this.stats.enter(timestamp);
    this.stats.leave(timestamp, timestamp);
  }
  finalize = (timestamp) => {
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
      this.stats.durationSeries.average()
    ];
  }
  empty() {
    return this.data.length === 0;
  }
  size() {
    return this.data.length;
  }
}

// src/sim/Buffer.ts
class Buffer extends Model {
  capacity;
  available;
  putQueue;
  getQueue;
  constructor(name, capacity, initial) {
    super(name);
    this.capacity = capacity;
    this.available = typeof initial === "undefined" ? 0 : initial;
    this.putQueue = new Queue;
    this.getQueue = new Queue;
  }
  current() {
    return this.available;
  }
  size() {
    return this.capacity;
  }
  get(amount, ro) {
    if (this.getQueue.empty() && amount <= this.available) {
      this.available -= amount;
      ro.deliverAt = ro.entity.time();
      ro.deliveryPending = true;
      ro.entity.sim.queue.insert(ro);
      this.getQueue.passby(ro.deliverAt);
      this.progressPutQueue();
      return;
    }
    ro.amount = amount;
    this.getQueue.push(ro, ro.entity.time());
  }
  put(amount, ro) {
    if (this.putQueue.empty() && amount + this.available <= this.capacity) {
      this.available += amount;
      ro.deliverAt = ro.entity.time();
      ro.deliveryPending = true;
      ro.entity.sim.queue.insert(ro);
      this.putQueue.passby(ro.deliverAt);
      this.progressGetQueue();
      return;
    }
    ro.amount = amount;
    this.putQueue.push(ro, ro.entity.time());
  }
  progressGetQueue() {
    let obj;
    while (obj = this.getQueue.top()) {
      if (obj.cancelled) {
        this.getQueue.shift(obj.entity.time());
        continue;
      }
      if (obj.amount <= this.available) {
        this.getQueue.shift(obj.entity.time());
        this.available -= obj.amount;
        obj.deliverAt = obj.entity.time();
        obj.deliveryPending = true;
        obj.entity.sim.queue.insert(obj);
      } else {
        break;
      }
    }
  }
  progressPutQueue() {
    let obj;
    while (obj = this.putQueue.top()) {
      if (obj.cancelled) {
        this.putQueue.shift(obj.entity.time());
        continue;
      }
      if (obj.amount + this.available <= this.capacity) {
        this.putQueue.shift(obj.entity.time());
        this.available += obj.amount;
        obj.deliverAt = obj.entity.time();
        obj.deliveryPending = true;
        obj.entity.sim.queue.insert(obj);
      } else {
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

// src/sim/Event.ts
class Event extends Model {
  constructor() {
    super(...arguments);
  }
  waitList = [];
  queue = [];
  isFired = false;
  addWaitList(ro) {
    if (this.isFired) {
      ro.deliverAt = ro.entity.time();
      ro.entity.sim.queue.insert(ro);
      return;
    }
    this.waitList.push(ro);
  }
  addQueue(ro) {
    if (this.isFired) {
      ro.deliverAt = ro.entity.time();
      ro.entity.sim.queue.insert(ro);
      return;
    }
    this.queue.push(ro);
  }
  fire(keepFired) {
    if (keepFired) {
      this.isFired = true;
    }
    const tmpList = this.waitList;
    this.waitList = [];
    for (let i = 0;i < tmpList.length; i++) {
      tmpList[i].deliver();
    }
    const lucky = this.queue.shift();
    if (lucky) {
      lucky.deliver();
    }
  }
  clear() {
    this.isFired = false;
  }
}

// src/sim/Store.ts
class Store extends Model {
  capacity;
  objects = [];
  putQueue = new Queue;
  getQueue = new Queue;
  available = 0;
  constructor(capacity, name) {
    super(name);
    this.capacity = capacity;
  }
  current() {
    return this.objects.length;
  }
  size() {
    return this.capacity;
  }
  get(filter, ro) {
    if (this.getQueue.empty() && this.current() > 0) {
      let found = false;
      let obj = undefined;
      if (filter) {
        for (let i = 0;i < this.objects.length; i++) {
          obj = this.objects[i];
          if (filter(obj)) {
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
    ro.filter = filter;
    this.getQueue.push(ro, ro.entity.time());
  }
  put(obj, ro) {
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
    let ro;
    while (ro = this.getQueue.top()) {
      if (ro.cancelled) {
        this.getQueue.shift(ro.entity.time());
        continue;
      }
      if (this.current() > 0) {
        const filter = ro.filter;
        let found = false;
        let obj = undefined;
        if (filter) {
          for (let i = 0;i < this.objects.length; i++) {
            obj = this.objects[i];
            if (filter(obj)) {
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
        break;
      }
    }
  }
  progressPutQueue() {
    let ro;
    while (ro = this.putQueue.top()) {
      if (ro.cancelled) {
        this.putQueue.shift(ro.entity.time());
        continue;
      }
      if (this.current() < this.capacity) {
        this.putQueue.shift(ro.entity.time());
        this.available++;
        this.objects.push(ro.obj);
        ro.deliverAt = ro.entity.time();
        ro.deliveryPending = true;
        ro.entity.sim.queue.insert(ro);
      } else {
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

// src/request/RequestBase.ts
class RequestBase {
  entity;
  scheduledAt;
  deliverAt;
  deliveryPending = false;
  callbacks = [];
  cancelled = false;
  group = null;
  source;
  noRenege = false;
  data;
  msg;
  constructor(entity, currentTime, deliverAt) {
    this.entity = entity;
    this.scheduledAt = currentTime;
    this.deliverAt = deliverAt;
  }
  done(callback, context, argument) {
    this.callbacks.push([callback, context, argument]);
    return this;
  }
  setData(data) {
    this.data = data;
    return this;
  }
  Null() {
    return this;
  }
}

// src/request/doCallback.ts
function doCallback(source, msg, data) {
  for (let i = 0;i < this.callbacks.length; i++) {
    const callback = this.callbacks[i][0];
    if (!callback)
      continue;
    let context = this.callbacks[i][1];
    if (!context)
      context = this.entity;
    const argument = this.callbacks[i][2];
    context.callbackSource = source;
    context.callbackMessage = msg;
    context.callbackData = data;
    if (!argument) {
      callback.call(context);
    } else if (Array.isArray(argument)) {
      callback.apply(context, argument);
    } else {
      callback.call(context, argument);
    }
    context.callbackSource = undefined;
    context.callbackMessage = undefined;
    context.callbackData = undefined;
  }
}

// src/request/Request.ts
class Request extends RequestBase {
  entity;
  group = null;
  constructor(entity, currentTime, deliverAt) {
    super(entity, currentTime, deliverAt);
    this.entity = entity;
    this.scheduledAt = currentTime;
    this.deliverAt = deliverAt;
  }
  cancel() {
    if (this.group && this.group[0] !== this) {
      return this.group[0].cancel();
    }
    if (this.noRenege)
      return this;
    if (this.cancelled)
      return this;
    if (this.deliveryPending)
      return this;
    this.cancelled = true;
    if (this.deliverAt === 0) {
      this.deliverAt = this.entity.time();
    }
    if (this.source) {
      if (this.source instanceof Buffer || this.source instanceof Store) {
        this.source.progressPutQueue();
        this.source.progressGetQueue();
      }
    }
    if (this.group) {
      for (let i = 1;i < this.group.length; i++) {
        this.group[i].cancelled = true;
        if (this.group[i].deliverAt === 0) {
          this.group[i].deliverAt = this.entity.time();
        }
      }
    }
    return this;
  }
  done(callback, context, argument) {
    this.callbacks.push([callback, context, argument]);
    return this;
  }
  waitUntil(delay, callback, context, argument) {
    if (this.noRenege)
      return this;
    const ro = this._addRequest(this.scheduledAt + delay, callback, context, argument);
    this.entity.sim.queue.insert(ro);
    return this;
  }
  unlessEvent(event, callback, context, argument) {
    if (this.noRenege)
      return this;
    if (event instanceof Event) {
      const ro = this._addRequest(0, callback, context, argument);
      ro.msg = event;
      event.addWaitList(ro);
    } else if (Array.isArray(event)) {
      for (let i = 0;i < event.length; i++) {
        const ro = this._addRequest(0, callback, context, argument);
        ro.msg = event[i];
        event[i].addWaitList(ro);
      }
    }
    return this;
  }
  setData(data) {
    this.data = data;
    return this;
  }
  deliver() {
    if (this.group?.[0].deliveryPending && this.group[0] !== this)
      return;
    this.deliveryPending = false;
    if (this.cancelled)
      return;
    this.cancel();
    if (!this.callbacks)
      return;
    if (this.group && this.group.length > 0) {
      doCallback.call(this, this.group[0].source, this.msg, this.group[0].data);
    } else {
      doCallback.call(this, this.source, this.msg, this.data);
    }
  }
  cancelRenegeClauses() {
    this.noRenege = true;
    if (!this.group || this.group[0] !== this) {
      return;
    }
    for (let i = 1;i < this.group.length; i++) {
      this.group[i].cancelled = true;
      if (this.group[i].deliverAt === 0) {
        this.group[i].deliverAt = this.entity.time();
      }
    }
  }
  Null() {
    return this;
  }
  _addRequest(deliverAt, callback, context, argument) {
    const ro = new Request(this.entity, this.scheduledAt, deliverAt);
    ro.callbacks.push([callback, context, argument]);
    if (this.group === null) {
      this.group = [this];
    }
    this.group.push(ro);
    ro.group = this.group;
    return ro;
  }
}

// src/types/useFCFSCallback.ts
function useFCFSCallback(ro) {
  this.free++;
  this.freeServers[ro.msg] = true;
  this.stats.leave(ro.scheduledAt, ro.entity.time());
  this.useFCFSSchedule(ro.entity.time());
  ro.deliver();
}

// src/facility/FacilityFCFS.ts
class FacilityFCFS extends FacilityBase {
  freeServers;
  constructor(name, servers, maxqlen) {
    super(name, servers, maxqlen);
    this.freeServers = new Array(this.servers);
    for (let i = 0;i < this.freeServers.length; i++) {
      this.freeServers[i] = true;
    }
  }
  queue = new Queue;
  use(duration, ro) {
    if (this.maxqlen === 0 && !this.free || this.maxqlen > 0 && this.queue.size() >= this.maxqlen) {
      ro.msg = -1;
      ro.deliverAt = ro.entity.time();
      ro.entity.sim.queue.insert(ro);
      return;
    }
    ro.duration = duration;
    const now = ro.entity.time();
    this.stats.enter(now);
    this.queue.push(ro, now);
    this.useFCFSSchedule(now);
  }
  useFCFSSchedule(timestamp) {
    while (this.free > 0 && !this.queue.empty()) {
      const ro = this.queue.shift(timestamp);
      if (ro.cancelled) {
        continue;
      }
      for (let i = 0;i < this.freeServers.length; i++) {
        if (this.freeServers[i]) {
          this.freeServers[i] = false;
          ro.msg = i;
          break;
        }
      }
      this.free--;
      this.busyDuration += ro.duration;
      ro.cancelRenegeClauses();
      const newro = new Request(this, timestamp, timestamp + ro.duration);
      newro.done(useFCFSCallback, this, ro);
      ro.entity.sim.queue.insert(newro);
    }
  }
  reset() {
    super.reset();
    this.queue.reset();
  }
  finalize(timestamp) {
    super.finalize(timestamp);
    this.queue.stats.finalize(timestamp);
  }
  queueStats() {
    return this.queue.stats;
  }
}

// src/types/Discipline.ts
var Discipline;
(function(Discipline2) {
  Discipline2[Discipline2["FCFS"] = 1] = "FCFS";
  Discipline2[Discipline2["LCFS"] = 2] = "LCFS";
  Discipline2[Discipline2["PS"] = 3] = "PS";
  Discipline2[Discipline2["NumDisciplines"] = 4] = "NumDisciplines";
})(Discipline || (Discipline = {}));

// src/facility/FacilityLCFS.ts
class FacilityLCFS extends FacilityBase {
  constructor() {
    super(...arguments);
  }
  queue = new Queue;
  currentRO;
  use(duration, ro) {
    if (this.currentRO) {
      this.busyDuration += this.currentRO.entity.time() - this.currentRO.lastIssued;
      this.currentRO.remaining = this.currentRO.deliverAt - this.currentRO.entity.time();
      this.queue.push(this.currentRO, ro.entity.time());
    }
    this.currentRO = ro;
    if (!ro.saved_deliver) {
      ro.cancelRenegeClauses();
      ro.remaining = duration;
      ro.saved_deliver = ro.deliver;
      ro.deliver = this.useLCFSCallback;
      this.stats.enter(ro.entity.time());
    }
    ro.lastIssued = ro.entity.time();
    ro.deliverAt = ro.entity.time() + duration;
    ro.entity.sim.queue.insert(ro);
  }
  useLCFSCallback() {
    const facility = this.source;
    if (this !== facility.currentRO)
      return;
    facility.currentRO = undefined;
    facility.busyDuration += this.entity.time() - this.lastIssued;
    facility.stats.leave(this.scheduledAt, this.entity.time());
    this.deliver = this.saved_deliver;
    this.saved_deliver = undefined;
    this.deliver();
    if (!facility.queue.empty()) {
      const obj = facility.queue.pop(this.entity.time());
      facility.use(obj.remaining, obj);
    }
  }
  reset() {
    super.reset();
    this.queue.reset();
  }
  queueStats() {
    return this.queue.stats;
  }
  finalize(timestamp) {
    super.finalize(timestamp);
    this.queue.stats.finalize(timestamp);
  }
}

// src/facility/FacilityPS.ts
class FacilityPS extends FacilityBase {
  constructor() {
    super(...arguments);
  }
  queue = [];
  lastIssued;
  use(duration, ro) {
    ro.duration = duration;
    ro.cancelRenegeClauses();
    this.stats.enter(ro.entity.time());
    this.useProcessorSharingSchedule(ro, true);
  }
  useProcessorSharingSchedule(ro, isAdded) {
    const current = ro.entity.time();
    const size = this.queue.length;
    const multiplier = isAdded ? (size + 1) / size : (size - 1) / size;
    const newQueue = [];
    if (this.queue.length === 0) {
      this.lastIssued = current;
    }
    for (let i = 0;i < size; i++) {
      const ev = this.queue[i];
      if (ev.ro === ro) {
        continue;
      }
      const newev = new Request(this, current, current + (ev.deliverAt - current) * multiplier);
      newev.ro = ev.ro;
      newev.source = this;
      newev.deliver = this.useProcessorSharingCallback;
      newQueue.push(newev);
      ev.cancel();
      ro.entity.sim.queue.insert(newev);
    }
    if (isAdded) {
      const newev = new Request(this, current, current + ro.duration * (size + 1));
      newev.ro = ro;
      newev.source = this;
      newev.deliver = this.useProcessorSharingCallback;
      newQueue.push(newev);
      ro.entity.sim.queue.insert(newev);
    }
    this.queue = newQueue;
    if (this.queue.length === 0) {
      this.busyDuration += current - this.lastIssued;
    }
  }
  useProcessorSharingCallback() {
    const fac = this.source;
    if (this.cancelled)
      return;
    fac.stats.leave(this.ro.scheduledAt, this.ro.entity.time());
    fac.useProcessorSharingSchedule(this.ro, false);
    this.ro.deliver();
  }
}

// src/facility/FacilityFabric.ts
function FacilityFabric(name, discipline, servers, maxqlen) {
  switch (discipline) {
    case Discipline.LCFS:
      return new FacilityLCFS(name, servers, maxqlen);
    case Discipline.PS:
      return new FacilityPS(name, servers, maxqlen);
    default:
      return new FacilityFCFS(name, servers, maxqlen);
  }
}

// src/queues/PQueue.ts
class PQueue extends Model {
  data;
  order = 0;
  constructor(name) {
    super(name);
    this.data = [];
    this.order = 0;
  }
  greater(ro1, ro2) {
    if (ro1.deliverAt > ro2.deliverAt)
      return true;
    if (ro1.deliverAt === ro2.deliverAt)
      return ro1.order > ro2.order;
    return false;
  }
  insert(ro) {
    ro.order = this.order++;
    let index = this.data.length;
    this.data.push(ro);
    const a = this.data;
    const node = a[index];
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
    const a = this.data;
    let len = a.length;
    if (len <= 0) {
      return null;
    }
    if (len === 1) {
      return this.data.pop();
    }
    const top = a[0];
    a[0] = a.pop();
    len--;
    let index = 0;
    const node = a[index];
    while (index < Math.floor(len / 2)) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      const smallerChildIndex = rightChildIndex < len && !this.greater(a[rightChildIndex], a[leftChildIndex]) ? rightChildIndex : leftChildIndex;
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

// src/utils/sendMessage.ts
function sendMessage() {
  const sender = this.source;
  const message = this.msg;
  const entities = this.data;
  const sim = sender.sim;
  if (!entities) {
    for (let i = sim.entities.length - 1;i >= 0; i--) {
      const entity = sim.entities[i];
      if (entity === sender)
        continue;
      if (entity.onMessage)
        entity.onMessage(sender, message);
    }
  } else if (Array.isArray(entities)) {
    for (let i = entities.length - 1;i >= 0; i--) {
      const entity = entities[i];
      if (entity === sender)
        continue;
      if (entity.onMessage)
        entity.onMessage(sender, message);
    }
  } else if (entities.onMessage) {
    entities.onMessage(sender, message);
  }
}

// src/sim/Entity.ts
class Entity extends Model {
  sim;
  constructor(sim, name) {
    super(name);
    this.sim = sim;
  }
  time() {
    return this.sim.time();
  }
  setTimer(duration) {
    const ro = new Request(this, this.sim.time(), this.sim.time() + duration);
    this.sim.queue.insert(ro);
    return ro;
  }
  waitEvent(event) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = event;
    event.addWaitList(ro);
    return ro;
  }
  queueEvent(event) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = event;
    event.addQueue(ro);
    return ro;
  }
  useFacility(facility, duration) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = facility;
    facility.use(duration, ro);
    return ro;
  }
  putBuffer(buffer, amount) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = buffer;
    buffer.put(amount, ro);
    return ro;
  }
  getBuffer(buffer, amount) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = buffer;
    buffer.get(amount, ro);
    return ro;
  }
  putStore(store, obj) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = store;
    store.put(obj, ro);
    return ro;
  }
  getStore(store, filter) {
    const ro = new Request(this, this.sim.time(), 0);
    ro.source = store;
    store.get(filter, ro);
    return ro;
  }
  send(message, delay, entities) {
    const ro = new Request(this.sim, this.time(), this.time() + delay);
    ro.source = this;
    ro.msg = message;
    ro.data = entities;
    ro.deliver = sendMessage;
    this.sim.queue.insert(ro);
  }
  log(message) {
    this.sim.log(message, this);
  }
}

// src/sim/Sim.ts
class Sim {
  name;
  simTime = 0;
  events = 0;
  endTime = 0;
  maxEvents = 0;
  entities = [];
  entitiesByName = {};
  queue = new PQueue;
  entityId = 1;
  paused = 0;
  running = false;
  logger;
  constructor(name) {
    this.name = name;
  }
  time() {
    return this.simTime;
  }
  addEntity(Klass, name, ...args) {
    if (!Klass.prototype.start) {
      throw new Error(`Entity class ${Klass.name} must have start() function defined`);
    }
    if (typeof name === "string" && typeof this.entitiesByName[name] !== "undefined") {
      throw new Error(`Entity name ${name} already exists`);
    }
    const entity = new Klass(this, name);
    this.entities.push(entity);
    if (typeof name === "string") {
      this.entitiesByName[name] = entity;
    }
    entity.start(...args);
    return entity;
  }
  simulate(endTime, maxEvents) {
    this.events = 0;
    this.maxEvents = maxEvents ? maxEvents : Infinity;
    this.endTime = endTime;
    this.running = true;
    this.pause();
    return this.resume();
  }
  pause() {
    ++this.paused;
  }
  resume() {
    if (this.paused > 0) {
      --this.paused;
    }
    if (this.paused <= 0 && this.running) {
      while (true) {
        this.events++;
        if (this.events > this.maxEvents)
          return false;
        const ro = this.queue.remove();
        if (!ro)
          break;
        if (ro.deliverAt > this.endTime)
          break;
        this.simTime = ro.deliverAt;
        if (ro.cancelled)
          continue;
        ro.deliver();
        if (this.paused) {
          return true;
        }
      }
      this.running = false;
      this.finalize();
    }
    return true;
  }
  step() {
    while (true) {
      const ro = this.queue.remove();
      if (ro == null)
        return false;
      this.simTime = ro.deliverAt;
      if (ro.cancelled)
        continue;
      ro.deliver();
      break;
    }
    return true;
  }
  finalize() {
    for (let i = 0;i < this.entities.length; i++) {
      this.entities[i].finalize?.(this.simTime);
    }
  }
  setLogger(logger) {
    this.logger = logger;
  }
  log(message, entity) {
    if (!this.logger)
      return;
    let entityMsg = "";
    if (typeof entity !== "undefined") {
      if (entity.name) {
        entityMsg = ` [${entity.name}]`;
      } else {
        entityMsg = ` [${entity.id}] `;
      }
    }
    this.logger(`${this.simTime.toFixed(6)}${entityMsg}   ${message}`);
  }
}

// src/types/CreateFacility.ts
function CreateFacility(name, discipline, servers, maxqlen) {
  return FacilityFabric(name, discipline, servers, maxqlen);
}

// src/utils/Random.ts
class Random {
  M;
  N;
  MATRIX_A;
  UPPER_MASK;
  LOWER_MASK;
  mt;
  mti;
  pythonCompatibility = false;
  skip = false;
  LOG4 = Math.log(4);
  SG_MAGICCONST = 1 + Math.log(4.5);
  lastNormal = NaN;
  constructor(seed = new Date().getTime()) {
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 2567483615;
    this.UPPER_MASK = 2147483648;
    this.LOWER_MASK = 2147483647;
    this.mt = new Array(this.N);
    this.mti = this.N + 1;
    this.initByArray([seed], 1);
  }
  initGenrand(_s) {
    let s = _s;
    this.mt[0] = s >>> 0;
    for (this.mti = 1;this.mti < this.N; this.mti++) {
      s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  initByArray(initKey, keyLength) {
    let i;
    let j;
    let k;
    this.initGenrand(19650218);
    i = 1;
    j = 0;
    k = this.N > keyLength ? this.N : keyLength;
    for (;k; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + initKey[j] + j;
      this.mt[i] >>>= 0;
      i++;
      j++;
      if (i >= this.N) {
        this.mt[0] = this.mt[this.N - 1];
        i = 1;
      }
      if (j >= keyLength)
        j = 0;
    }
    for (k = this.N - 1;k; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
      this.mt[i] >>>= 0;
      i++;
      if (i >= this.N) {
        this.mt[0] = this.mt[this.N - 1];
        i = 1;
      }
    }
    this.mt[0] = 2147483648;
  }
  genrandInt32() {
    let y;
    const mag01 = [0, this.MATRIX_A];
    if (this.mti >= this.N) {
      let kk;
      if (this.mti === this.N + 1) {
        this.initGenrand(5489);
      }
      for (kk = 0;kk < this.N - this.M; kk++) {
        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
        this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 1];
      }
      for (;kk < this.N - 1; kk++) {
        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
        this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 1];
      }
      y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= y << 7 & 2636928640;
    y ^= y << 15 & 4022730752;
    y ^= y >>> 18;
    return y >>> 0;
  }
  genrandInt31() {
    return this.genrandInt32() >>> 1;
  }
  genrandReal1() {
    return this.genrandInt32() * 0.00000000023283064370807974;
  }
  random() {
    if (this.pythonCompatibility) {
      if (this.skip) {
        this.genrandInt32();
      }
      this.skip = true;
    }
    return this.genrandInt32() * 0.00000000023283064365386964;
  }
  genrandReal3() {
    return (this.genrandInt32() + 0.5) * 0.00000000023283064365386964;
  }
  genrandRes53() {
    const a = this.genrandInt32() >>> 5;
    const b = this.genrandInt32() >>> 6;
    return (a * 67108864 + b) * 0.00000000000000011102230246251566;
  }
  exponential(lambda) {
    const r = this.random();
    return -Math.log(r) / lambda;
  }
  gamma(alpha, beta) {
    let u = NaN;
    if (alpha > 1) {
      const ainv = Math.sqrt(2 * alpha - 1);
      const bbb = alpha - this.LOG4;
      const ccc = alpha + ainv;
      while (true) {
        const u1 = this.random();
        if (u1 < 0.0000001 || u > 0.9999999) {
          continue;
        }
        const u2 = 1 - this.random();
        const v = Math.log(u1 / (1 - u1)) / ainv;
        const x = alpha * Math.exp(v);
        const z = u1 * u1 * u2;
        const r = bbb + ccc * v - x;
        if (r + this.SG_MAGICCONST - 4.5 * z >= 0 || r >= Math.log(z)) {
          return x * beta;
        }
      }
    } else if (alpha === 1) {
      u = this.random();
      while (u <= 0.0000001) {
        u = this.random();
      }
      return -Math.log(u) * beta;
    } else {
      let x = NaN;
      while (true) {
        u = this.random();
        const b = (Math.E + alpha) / Math.E;
        const p = b * u;
        if (p <= 1) {
          x = p ** (1 / alpha);
        } else {
          x = -Math.log((b - p) / alpha);
        }
        const u1 = this.random();
        if (p > 1) {
          if (u1 <= x ** (alpha - 1)) {
            break;
          }
        } else if (u1 <= Math.exp(-x)) {
          break;
        }
      }
      return x * beta;
    }
  }
  normal(mu, sigma) {
    let z = this.lastNormal;
    this.lastNormal = NaN;
    if (!z) {
      const a = this.random() * 2 * Math.PI;
      const b = Math.sqrt(-2 * Math.log(1 - this.random()));
      z = Math.cos(a) * b;
      this.lastNormal = Math.sin(a) * b;
    }
    return mu + z * sigma;
  }
  pareto(alpha) {
    const u = this.random();
    return 1 / (1 - u) ** (1 / alpha);
  }
  triangular(lower, upper, mode) {
    const c = (mode - lower) / (upper - lower);
    const u = this.random();
    if (u <= c) {
      return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
    }
    return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
  }
  uniform(lower, upper) {
    return lower + this.random() * (upper - lower);
  }
  weibull(alpha, beta) {
    const u = 1 - this.random();
    return alpha * (-Math.log(u)) ** (1 / beta);
  }
}

// src/index.ts
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
    TimeSeries
  };