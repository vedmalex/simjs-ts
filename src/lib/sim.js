import { PQueue, Queue } from './queues.js';
import { Population } from './stats.js';
import { Request } from './request.js';

class Sim {
    constructor() {
        this.simTime = 0;
        this.entities = [];
        this.queue = new PQueue();
        this.endTime = 0;
        this.entityId = 1;
    }

    time() {
        return this.simTime;
    }

    sendMessage() {
        const sender = this.source;
        const message = this.msg;
        const entities = this.data;
        const sim = sender.sim;

        if (!entities) {
            // send to all entities
            for (var i = sim.entities.length - 1; i >= 0; i--) {
                var entity = sim.entities[i];
                if (entity === sender) continue;
                if (entity.onMessage) entity.onMessage.call(entity, sender, message);
            }
        } else if (entities instanceof Array) {
            for (var i = entities.length - 1; i >= 0; i--) {
                var entity = entities[i];
                if (entity === sender) continue;
                if (entity.onMessage) entity.onMessage.call(entity, sender, message);
            }
        } else {
            if (entities.onMessage) {
                entities .onMessage.call(entities, sender, message);
            }
        }
    }

    addEntity(proto) {
        //ARG_CHECK(arguments, 1, 1, Object);
        // Verify that prototype has start function
        if (!proto.start) {  // ARG CHECK
            throw new Error("Entity prototype must have start() function defined"); // ARG CHECK
        }  // ARG CHECK

        if (!proto.time) {
            proto.time = function () {
                return this.sim.time();
            };

            proto.setTimer = function (duration) {
                ARG_CHECK(arguments, 1, 1);

                const ro = new Request(
                        this,
                        this.sim.time(),
                        this.sim.time() + duration);

                this.sim.queue.insert(ro);
                return ro;
            };

            proto.waitEvent = function (event) {
                ARG_CHECK(arguments, 1, 1, Event);

                const ro = new Request(this, this.sim.time(), 0);

                ro.source = event;
                event.addWaitList(ro);
                return ro;
            };

            proto.queueEvent = function (event) {
                ARG_CHECK(arguments, 1, 1, Event);

                const ro = new Request(this, this.sim.time(), 0);

                ro.source = event;
                event.addQueue(ro);
                return ro;
            };

            proto.useFacility = function (facility, duration) {
                ARG_CHECK(arguments, 2, 2, Facility);

                const ro = new Request(this, this.sim.time(), 0);
                ro.source = facility;
                facility.use(duration, ro);
                return ro;
            };

            proto.putBuffer = function (buffer, amount) {
                ARG_CHECK(arguments, 2, 2, Buffer);

                const ro = new Request(this, this.sim.time(), 0);
                ro.source = buffer;
                buffer.put(amount, ro);
                return ro;
            };

            proto.getBuffer = function (buffer, amount) {
                ARG_CHECK(arguments, 2, 2, Buffer);

                const ro = new Request(this, this.sim.time(), 0);
                ro.source = buffer;
                buffer.get(amount, ro);
                return ro;
            };

            proto.putStore = function (store, obj) {
                ARG_CHECK(arguments, 2, 2, Store);

                const ro = new Request(this, this.sim.time(), 0);
                ro.source = store;
                store.put(obj, ro);
                return ro;
            };

            proto.getStore = function (store, filter) {
                ARG_CHECK(arguments, 1, 2, Store, Function);

                const ro = new Request(this, this.sim.time(), 0);
                ro.source = store;
                store.get(filter, ro);
                return ro;
            };

            proto.send = function (message, delay, entities) {
                ARG_CHECK(arguments, 2, 3);

                const ro = new Request(this.sim, this.time(), this.time() + delay);
                ro.source = this;
                ro.msg = message;
                ro.data = entities;
                ro.deliver = this.sim.sendMessage;

                this.sim.queue.insert(ro);
            };

            proto.log = function (message) {
                ARG_CHECK(arguments, 1, 1);

                this.sim.log(message, this);
            };
        }

        const obj = ((p => {
            if (p == null) throw TypeError();
            if (Object.create)
                return Object.create(p);
            const t = typeof p;
            if (t !== "object" && t !== "function") throw TypeError();

            function f() {};
            f.prototype = p;
            return new f();
        })(proto));

        obj.sim = this;
        obj.id = this.entityId ++;
        this.entities.push(obj);

        if (arguments.length > 1) {
            const args = [];
            for (let i = 1; i < arguments.length; i ++) {
                args.push(arguments[i]);
            }
            obj.start.apply(obj, args);
        }
        else {
            obj.start();
        }


        return obj;
    }

    simulate(endTime, maxEvents) {
        //ARG_CHECK(arguments, 1, 2);
        if (!maxEvents) {maxEvents = Math.Infinity; }
        let events = 0;

        while (true) {
            events ++;
            if (events > maxEvents) return false;

            // Get the earliest event
            const ro = this.queue.remove();

            // If there are no more events, we are done with simulation here.
            if (ro == undefined) break;


            // Uh oh.. we are out of time now
            if (ro.deliverAt > endTime) break;

            // Advance simulation time
            this.simTime =  ro.deliverAt;

            // If this event is already cancelled, ignore
            if (ro.cancelled) continue;

            ro.deliver();
        }

        this.finalize();
        return true;
    }

    step() {
        while (true) {
            const ro = this.queue.remove();
            if (!ro) return false;
            this.simTime = ro.deliverAt;
            if (ro.cancelled) continue;
            ro.deliver();
            break;
        }
        return true;
    }

    finalize() {
        for(let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].finalize) {
                this.entities[i].finalize();
            }
        }
    }

    setLogger(logger) {
        ARG_CHECK(arguments, 1, 1, Function);
        this.logger = logger;
    }

    log(message, entity) {
        ARG_CHECK(arguments, 1, 2);

        if (!this.logger) return;
        let entityMsg = "";
        if (entity !== undefined) {
            if (entity.name) {
                entityMsg = ` [${entity.name}]`;
            } else {
                entityMsg = ` [${entity.id}] `;
            }
        }
        this.logger(`${this.simTime.toFixed(6)}${entityMsg}   ${message}`);
    }
}

class Facility {
    constructor(name, discipline, servers, maxqlen) {
        ARG_CHECK(arguments, 1, 4);

        this.free = servers ? servers : 1;
        this.servers = servers ? servers : 1;
        this.maxqlen = (maxqlen === undefined) ? -1 : 1 * maxqlen;

        switch (discipline) {

        case Facility.LCFS:
            this.use = this.useLCFS;
            this.queue = new Queue();
            break;
        case Facility.PS:
            this.use = this.useProcessorSharing;
            this.queue = [];
            break;
        case Facility.FCFS:
        default:
            this.use = this.useFCFS;
            this.freeServers = new Array(this.servers);
            this.queue = new Queue();
            for (let i = 0; i < this.freeServers.length; i++) {
                this.freeServers[i] = true;
            }
        }

        this.stats = new Population();
        this.busyDuration = 0;
    }

    reset() {
        this.queue.reset();
        this.stats.reset();
        this.busyDuration = 0;
    }

    systemStats() {
        return this.stats;
    }

    queueStats() {
        return this.queue.stats;
    }

    usage() {
        return this.busyDuration;
    }

    finalize(timestamp) {
        ARG_CHECK(arguments, 1, 1);

        this.stats.finalize(timestamp);
        this.queue.stats.finalize(timestamp);
    }

    useFCFS(duration, ro) {
        ARG_CHECK(arguments, 2, 2);
        if ( (this.maxqlen === 0 && !this.free)
                || (this.maxqlen > 0 && this.queue.size() >= this.maxqlen)) {
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
        ARG_CHECK(arguments, 1, 1);

        while (this.free > 0 && !this.queue.empty()) {
            const ro = this.queue.shift(timestamp); // TODO
            if (ro.cancelled) {
                continue;
            }
            for (let i = 0; i < this.freeServers.length; i++) {
                if (this.freeServers[i]) {
                    this.freeServers[i] = false;
                    ro.msg = i;
                    break;
                };
            }

            this.free --;
            this.busyDuration += ro.duration;

            // cancel all other reneging requests
            ro.cancelRenegeClauses();

            const newro = new Request(this, timestamp, timestamp + ro.duration);
            newro.done(this.useFCFSCallback, this, ro);

            ro.entity.sim.queue.insert(newro);
        }
    }

    useFCFSCallback(ro) {
        // We have one more free server
        this.free ++;
        this.freeServers[ro.msg] = true;

        this.stats.leave(ro.scheduledAt, ro.entity.time());

        // if there is someone waiting, schedule it now
        this.useFCFSSchedule(ro.entity.time());

        // restore the deliver function, and deliver
        ro.deliver();

    }

    useLCFS(duration, ro) {
        ARG_CHECK(arguments, 2, 2);

        // if there was a running request..
        if (this.currentRO) {
            this.busyDuration += (this.currentRO.entity.time() - this.currentRO.lastIssued);
            // calcuate the remaining time
            this.currentRO.remaining =
                (this.currentRO.deliverAt - this.currentRO.entity.time());
            // preempt it..
            this.queue.push(this.currentRO, ro.entity.time());
        }

        this.currentRO = ro;
        // If this is the first time..
        if (!ro.saved_deliver) {
            ro.cancelRenegeClauses();
            ro.remaining = duration;
            ro.saved_deliver = ro.deliver;
            ro.deliver = this.useLCFSCallback;

            this.stats.enter(ro.entity.time());
        }

        ro.lastIssued = ro.entity.time();

        // schedule this new event
        ro.deliverAt = ro.entity.time() + duration;
        ro.entity.sim.queue.insert(ro);
    }

    useLCFSCallback() {
        const ro = this;
        const facility = ro.source;

        if (ro != facility.currentRO) return;
        facility.currentRO = null;

        // stats
        facility.busyDuration += (ro.entity.time() - ro.lastIssued);
        facility.stats.leave(ro.scheduledAt, ro.entity.time());

        // deliver this request
        ro.deliver = ro.saved_deliver;
        delete ro.saved_deliver;
        ro.deliver();

        // see if there are pending requests
        if (!facility.queue.empty()) {
            const obj = facility.queue.pop(ro.entity.time());
            facility.useLCFS(obj.remaining, obj);
        }
    }

    useProcessorSharing(duration, ro) {
        ARG_CHECK(arguments, 2, 2, null, Request);
        ro.duration = duration;
        ro.cancelRenegeClauses();
        this.stats.enter(ro.entity.time());
        this.useProcessorSharingSchedule(ro, true);
    }

    useProcessorSharingSchedule(ro, isAdded) {
        const current = ro.entity.time();
        const size = this.queue.length;
        const multiplier = isAdded ? ((size + 1.0) / size) : ((size - 1.0) / size);
        const newQueue = [];

        if (this.queue.length === 0) {
            this.lastIssued = current;
        }

        for (let i = 0; i < size; i++) {
            const ev = this.queue[i];
            if (ev.ro === ro) {
                continue;
            }
            var newev = new Request(this, current, current + (ev.deliverAt - current) * multiplier);
            newev.ro = ev.ro;
            newev.source = this;
            newev.deliver = this.useProcessorSharingCallback;
            newQueue.push(newev);

            ev.cancel();
            ro.entity.sim.queue.insert(newev);
        }

        // add this new request
        if (isAdded) {
            var newev = new Request(this, current, current + ro.duration * (size + 1));
            newev.ro = ro;
            newev.source = this;
            newev.deliver = this.useProcessorSharingCallback;
            newQueue.push(newev);

            ro.entity.sim.queue.insert(newev);
        }

        this.queue = newQueue;

        // usage statistics
        if (this.queue.length == 0) {
            this.busyDuration += (current - this.lastIssued);
        }
    }

    useProcessorSharingCallback() {
        const ev = this;
        const fac = ev.source;

        if (ev.cancelled) return;
        fac.stats.leave(ev.ro.scheduledAt, ev.ro.entity.time());

        fac.useProcessorSharingSchedule(ev.ro, false);
        ev.ro.deliver();
    }
}

Facility.FCFS = 1;
Facility.LCFS = 2;
Facility.PS = 3;
Facility.NumDisciplines = 4;

class Buffer {
    constructor(name, capacity, initial) {
        ARG_CHECK(arguments, 2, 3);

        this.name = name;
        this.capacity = capacity;
        this.available = (initial === undefined) ? 0 : initial;
        this.putQueue = new Queue();
        this.getQueue = new Queue();
    }

    current() {
        return this.available;
    }

    size() {
        return this.capacity;
    }

    get(amount, ro) {
        ARG_CHECK(arguments, 2, 2);

        if (this.getQueue.empty()
                && amount <= this.available) {
            this.available -= amount;

            ro.deliverAt = ro.entity.time();
            ro.entity.sim.queue.insert(ro);

            this.getQueue.passby(ro.deliverAt);

            this.progressPutQueue();

            return;
        }
        ro.amount = amount;
        this.getQueue.push(ro, ro.entity.time());
    }

    put(amount, ro) {
        ARG_CHECK(arguments, 2, 2);

        if (this.putQueue.empty()
                && (amount + this.available) <= this.capacity) {
            this.available += amount;

            ro.deliverAt = ro.entity.time();
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
            // if obj is cancelled.. remove it.
            if (obj.cancelled) {
                this.getQueue.shift(obj.entity.time());
                continue;
            }

            // see if this request can be satisfied
            if (obj.amount <= this.available) {
                // remove it..
                this.getQueue.shift(obj.entity.time());
                this.available -= obj.amount;
                obj.deliverAt = obj.entity.time();
                obj.entity.sim.queue.insert(obj);
            } else {
                // this request cannot be satisfied
                break;
            }
        }
    }

    progressPutQueue() {
        let obj;
        while (obj = this.putQueue.top()) {
            // if obj is cancelled.. remove it.
            if (obj.cancelled) {
                this.putQueue.shift(obj.entity.time());
                continue;
            }

            // see if this request can be satisfied
            if (obj.amount + this.available <= this.capacity) {
                // remove it..
                this.putQueue.shift(obj.entity.time());
                this.available += obj.amount;
                obj.deliverAt = obj.entity.time();
                obj.entity.sim.queue.insert(obj);
            } else {
                // this request cannot be satisfied
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

class Store {
    constructor(name, capacity) {
        ARG_CHECK(arguments, 2, 3);

        this.name = name;
        this.capacity = capacity;
        this.objects = [];
        this.putQueue = new Queue();
        this.getQueue = new Queue();
    }

    current() {
        return this.objects.length;
    }

    size() {
        return this.capacity;
    }

    get(filter, ro) {
        ARG_CHECK(arguments, 2, 2);

        if (this.getQueue.empty() && this.current() > 0) {
            let found = false;
            let obj;
            // TODO: refactor this code out
            // it is repeated in progressGetQueue
            if (filter) {
                for (let i = 0; i < this.objects.length; i++) {
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
                this.available --;

                ro.msg = obj;
                ro.deliverAt = ro.entity.time();
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
        ARG_CHECK(arguments, 2, 2);

        if (this.putQueue.empty() && this.current() < this.capacity) {
            this.available ++;

            ro.deliverAt = ro.entity.time();
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
            // if obj is cancelled.. remove it.
            if (ro.cancelled) {
                this.getQueue.shift(ro.entity.time());
                continue;
            }

            // see if this request can be satisfied
            if (this.current() > 0) {
                const filter = ro.filter;
                let found = false;
                let obj;

                if (filter) {
                    for (let i = 0; i < this.objects.length; i++) {
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
                    // remove it..
                    this.getQueue.shift(ro.entity.time());
                    this.available --;

                    ro.msg = obj;
                    ro.deliverAt = ro.entity.time();
                    ro.entity.sim.queue.insert(ro);
                } else {
                    break;
                }

            } else {
                // this request cannot be satisfied
                break;
            }
        }
    }

    progressPutQueue() {
        let ro;
        while (ro = this.putQueue.top()) {
            // if obj is cancelled.. remove it.
            if (ro.cancelled) {
                this.putQueue.shift(ro.entity.time());
                continue;
            }

            // see if this request can be satisfied
            if (this.current() < this.capacity) {
                // remove it..
                this.putQueue.shift(ro.entity.time());
                this.available ++;
                this.objects.push(ro.obj);
                ro.deliverAt = ro.entity.time();
                ro.entity.sim.queue.insert(ro);
            } else {
                // this request cannot be satisfied
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

class Event {
    constructor(name) {
        ARG_CHECK(arguments, 0, 1);

        this.name = name;
        this.waitList = [];
        this.queue = [];
        this.isFired = false;
    }

    addWaitList(ro) {
        ARG_CHECK(arguments, 1, 1);

        if (this.isFired) {
            ro.deliverAt = ro.entity.time();
            ro.entity.sim.queue.insert(ro);
            return;
        }
        this.waitList.push(ro);
    }

    addQueue(ro) {
        ARG_CHECK(arguments, 1, 1);

        if (this.isFired) {
            ro.deliverAt = ro.entity.time();
            ro.entity.sim.queue.insert(ro);
            return;
        }
        this.queue.push(ro);
    }

    fire(keepFired) {
        ARG_CHECK(arguments, 0, 1);

        if (keepFired) {
            this.isFired = true;
        }

        // Dispatch all waiting entities
        const tmpList = this.waitList;
        this.waitList = [];
        for (let i = 0; i < tmpList.length; i ++) {
            tmpList[i].deliver();
        }

        // Dispatch one queued entity
        const lucky = this.queue.shift();
        if (lucky) {
            lucky.deliver();
        }
    }

    clear() {
        this.isFired = false;
    }
}


function ARG_CHECK(found, expMin, expMax) {
	if (found.length < expMin || found.length > expMax) {   // ARG_CHECK
		throw new Error("Incorrect number of arguments");   // ARG_CHECK
	}   // ARG_CHECK


	for (let i = 0; i < found.length; i++) {   // ARG_CHECK
		if (!arguments[i + 3] || !found[i]) continue;   // ARG_CHECK

//		print("TEST " + found[i] + " " + arguments[i + 3]   // ARG_CHECK
//		+ " " + (found[i] instanceof Event)   // ARG_CHECK
//		+ " " + (found[i] instanceof arguments[i + 3])   // ARG_CHECK
//		+ "\n");   // ARG CHECK


		if (! (found[i] instanceof arguments[i + 3])) {   // ARG_CHECK
			throw new Error(`parameter ${i + 1} is of incorrect type.`);   // ARG_CHECK
		}   // ARG_CHECK
	}   // ARG_CHECK
}   // ARG_CHECK

export {Sim, Facility, Buffer, Store, Event, ARG_CHECK};