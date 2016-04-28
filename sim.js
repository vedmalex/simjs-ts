(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PQueue = exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sim = require('./sim.js');

var _stats = require('./stats.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
    function Queue(name) {
        _classCallCheck(this, Queue);

        this.name = name;
        this.data = [];
        this.timestamp = [];
        this.stats = new _stats.Population();
    }

    _createClass(Queue, [{
        key: 'top',
        value: function top() {
            return this.data[0];
        }
    }, {
        key: 'back',
        value: function back() {
            return this.data.length ? this.data[this.data.length - 1] : undefined;
        }
    }, {
        key: 'push',
        value: function push(value, timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 2, 2);
            this.data.push(value);
            this.timestamp.push(timestamp);

            this.stats.enter(timestamp);
        }
    }, {
        key: 'unshift',
        value: function unshift(value, timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 2, 2);
            this.data.unshift(value);
            this.timestamp.unshift(timestamp);

            this.stats.enter(timestamp);
        }
    }, {
        key: 'shift',
        value: function shift(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            var value = this.data.shift();
            var enqueuedAt = this.timestamp.shift();

            this.stats.leave(enqueuedAt, timestamp);
            return value;
        }
    }, {
        key: 'pop',
        value: function pop(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            var value = this.data.pop();
            var enqueuedAt = this.timestamp.pop();

            this.stats.leave(enqueuedAt, timestamp);
            return value;
        }
    }, {
        key: 'passby',
        value: function passby(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            this.stats.enter(timestamp);
            this.stats.leave(timestamp, timestamp);
        }
    }, {
        key: 'finalize',
        value: function finalize(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            this.stats.finalize(timestamp);
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.stats.reset();
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.reset();
            this.data = [];
            this.timestamp = [];
        }
    }, {
        key: 'report',
        value: function report() {
            return [this.stats.sizeSeries.average(), this.stats.durationSeries.average()];
        }
    }, {
        key: 'empty',
        value: function empty() {
            return this.data.length == 0;
        }
    }, {
        key: 'size',
        value: function size() {
            return this.data.length;
        }
    }]);

    return Queue;
}();

var PQueue = function () {
    function PQueue() {
        _classCallCheck(this, PQueue);

        this.data = [];
        this.order = 0;
    }

    _createClass(PQueue, [{
        key: 'greater',
        value: function greater(ro1, ro2) {
            if (ro1.deliverAt > ro2.deliverAt) return true;
            if (ro1.deliverAt == ro2.deliverAt) return ro1.order > ro2.order;
            return false;
        }
    }, {
        key: 'insert',
        value: function insert(ro) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);
            ro.order = this.order++;

            var index = this.data.length;
            this.data.push(ro);

            // insert into data at the end
            var a = this.data;
            var node = a[index];

            // heap up
            while (index > 0) {
                var parentIndex = Math.floor((index - 1) / 2);
                if (this.greater(a[parentIndex], ro)) {
                    a[index] = a[parentIndex];
                    index = parentIndex;
                } else {
                    break;
                }
            }
            a[index] = node;
        }
    }, {
        key: 'remove',
        value: function remove() {
            var a = this.data;
            var len = a.length;
            if (len <= 0) {
                return undefined;
            }
            if (len == 1) {
                return this.data.pop();
            }
            var top = a[0];
            // move the last node up
            a[0] = a.pop();
            len--;

            // heap down
            var index = 0;
            var node = a[index];

            while (index < Math.floor(len / 2)) {
                var leftChildIndex = 2 * index + 1;
                var rightChildIndex = 2 * index + 2;

                var smallerChildIndex = rightChildIndex < len && !this.greater(a[rightChildIndex], a[leftChildIndex]) ? rightChildIndex : leftChildIndex;

                if (this.greater(a[smallerChildIndex], node)) {
                    break;
                }

                a[index] = a[smallerChildIndex];
                index = smallerChildIndex;
            }
            a[index] = node;
            return top;
        }
    }]);

    return PQueue;
}();

exports.Queue = Queue;
exports.PQueue = PQueue;

},{"./sim.js":3,"./stats.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Request = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sim = require('./sim.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
    function Request(entity, currentTime, deliverAt) {
        _classCallCheck(this, Request);

        this.entity = entity;
        this.scheduledAt = currentTime;
        this.deliverAt = deliverAt;
        this.callbacks = [];
        this.cancelled = false;
        this.group = null;
    }

    _createClass(Request, [{
        key: 'cancel',
        value: function cancel() {
            // Ask the main request to handle cancellation
            if (this.group && this.group[0] != this) {
                return this.group[0].cancel();
            }

            // --> this is main request
            if (this.noRenege) return this;

            // if already cancelled, do nothing
            if (this.cancelled) return;

            // set flag
            this.cancelled = true;

            if (this.deliverAt == 0) {
                this.deliverAt = this.entity.time();
            }

            if (this.source) {
                if (this.source instanceof _sim.Buffer || this.source instanceof _sim.Store) {
                    this.source.progressPutQueue.call(this.source);
                    this.source.progressGetQueue.call(this.source);
                }
            }

            if (!this.group) {
                return;
            }
            for (var i = 1; i < this.group.length; i++) {
                this.group[i].cancelled = true;
                if (this.group[i].deliverAt == 0) {
                    this.group[i].deliverAt = this.entity.time();
                }
            }
        }
    }, {
        key: 'done',
        value: function done(callback, context, argument) {
            (0, _sim.ARG_CHECK)(arguments, 0, 3, Function, Object);

            this.callbacks.push([callback, context, argument]);
            return this;
        }
    }, {
        key: 'waitUntil',
        value: function waitUntil(delay, callback, context, argument) {
            (0, _sim.ARG_CHECK)(arguments, 1, 4, undefined, Function, Object);
            if (this.noRenege) return this;

            var ro = this._addRequest(this.scheduledAt + delay, callback, context, argument);
            this.entity.sim.queue.insert(ro);
            return this;
        }
    }, {
        key: 'unlessEvent',
        value: function unlessEvent(event, callback, context, argument) {
            (0, _sim.ARG_CHECK)(arguments, 1, 4, undefined, Function, Object);
            if (this.noRenege) return this;

            if (event instanceof _sim.Event) {
                var ro = this._addRequest(0, callback, context, argument);
                ro.msg = event;
                event.addWaitList(ro);
            } else if (event instanceof Array) {
                for (var i = 0; i < event.length; i++) {
                    var ro = this._addRequest(0, callback, context, argument);
                    ro.msg = event[i];
                    event[i].addWaitList(ro);
                }
            }

            return this;
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            this.data = data;
            return this;
        }
    }, {
        key: 'deliver',
        value: function deliver() {
            if (this.cancelled) return;
            this.cancel();
            if (!this.callbacks) return;

            if (this.group && this.group.length > 0) {
                this._doCallback(this.group[0].source, this.msg, this.group[0].data);
            } else {
                this._doCallback(this.source, this.msg, this.data);
            }
        }
    }, {
        key: 'cancelRenegeClauses',
        value: function cancelRenegeClauses() {
            //this.cancel = this.Null;
            //this.waitUntil = this.Null;
            //this.unlessEvent = this.Null;
            this.noRenege = true;

            if (!this.group || this.group[0] != this) {
                return;
            }

            for (var i = 1; i < this.group.length; i++) {
                this.group[i].cancelled = true;
                if (this.group[i].deliverAt == 0) {
                    this.group[i].deliverAt = this.entity.time();
                }
            }
        }
    }, {
        key: 'Null',
        value: function Null() {
            return this;
        }
    }, {
        key: '_addRequest',
        value: function _addRequest(deliverAt, callback, context, argument) {
            var ro = new Request(this.entity, this.scheduledAt, deliverAt);

            ro.callbacks.push([callback, context, argument]);

            if (this.group === null) {
                this.group = [this];
            }

            this.group.push(ro);
            ro.group = this.group;
            return ro;
        }
    }, {
        key: '_doCallback',
        value: function _doCallback(source, msg, data) {
            for (var i = 0; i < this.callbacks.length; i++) {
                var callback = this.callbacks[i][0];
                if (!callback) continue;

                var context = this.callbacks[i][1];
                if (!context) context = this.entity;

                var argument = this.callbacks[i][2];

                context.callbackSource = source;
                context.callbackMessage = msg;
                context.callbackData = data;

                if (!argument) {
                    callback.call(context);
                } else if (argument instanceof Array) {
                    callback.apply(context, argument);
                } else {
                    callback.call(context, argument);
                }

                context.callbackSource = null;
                context.callbackMessage = null;
                context.callbackData = null;
            }
        }
    }]);

    return Request;
}();

exports.Request = Request;

},{"./sim.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ARG_CHECK = exports.Event = exports.Store = exports.Buffer = exports.Facility = exports.Sim = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queues = require('./queues.js');

var _stats = require('./stats.js');

var _request = require('./request.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sim = function () {
    function Sim() {
        _classCallCheck(this, Sim);

        this.simTime = 0;
        this.entities = [];
        this.queue = new _queues.PQueue();
        this.endTime = 0;
        this.entityId = 1;
    }

    _createClass(Sim, [{
        key: 'time',
        value: function time() {
            return this.simTime;
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage() {
            var sender = this.source;
            var message = this.msg;
            var entities = this.data;
            var sim = sender.sim;

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
                    entities.onMessage.call(entities, sender, message);
                }
            }
        }
    }, {
        key: 'addEntity',
        value: function addEntity(proto) {
            //ARG_CHECK(arguments, 1, 1, Object);
            // Verify that prototype has start function
            if (!proto.start) {
                // ARG CHECK
                throw new Error("Entity prototype must have start() function defined"); // ARG CHECK
            } // ARG CHECK

            if (!proto.time) {
                proto.time = function () {
                    return this.sim.time();
                };

                proto.setTimer = function (duration) {
                    ARG_CHECK(arguments, 1, 1);

                    var ro = new _request.Request(this, this.sim.time(), this.sim.time() + duration);

                    this.sim.queue.insert(ro);
                    return ro;
                };

                proto.waitEvent = function (event) {
                    ARG_CHECK(arguments, 1, 1, Event);

                    var ro = new _request.Request(this, this.sim.time(), 0);

                    ro.source = event;
                    event.addWaitList(ro);
                    return ro;
                };

                proto.queueEvent = function (event) {
                    ARG_CHECK(arguments, 1, 1, Event);

                    var ro = new _request.Request(this, this.sim.time(), 0);

                    ro.source = event;
                    event.addQueue(ro);
                    return ro;
                };

                proto.useFacility = function (facility, duration) {
                    ARG_CHECK(arguments, 2, 2, Facility);

                    var ro = new _request.Request(this, this.sim.time(), 0);
                    ro.source = facility;
                    facility.use(duration, ro);
                    return ro;
                };

                proto.putBuffer = function (buffer, amount) {
                    ARG_CHECK(arguments, 2, 2, Buffer);

                    var ro = new _request.Request(this, this.sim.time(), 0);
                    ro.source = buffer;
                    buffer.put(amount, ro);
                    return ro;
                };

                proto.getBuffer = function (buffer, amount) {
                    ARG_CHECK(arguments, 2, 2, Buffer);

                    var ro = new _request.Request(this, this.sim.time(), 0);
                    ro.source = buffer;
                    buffer.get(amount, ro);
                    return ro;
                };

                proto.putStore = function (store, obj) {
                    ARG_CHECK(arguments, 2, 2, Store);

                    var ro = new _request.Request(this, this.sim.time(), 0);
                    ro.source = store;
                    store.put(obj, ro);
                    return ro;
                };

                proto.getStore = function (store, filter) {
                    ARG_CHECK(arguments, 1, 2, Store, Function);

                    var ro = new _request.Request(this, this.sim.time(), 0);
                    ro.source = store;
                    store.get(filter, ro);
                    return ro;
                };

                proto.send = function (message, delay, entities) {
                    ARG_CHECK(arguments, 2, 3);

                    var ro = new _request.Request(this.sim, this.time(), this.time() + delay);
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

            var obj = function (p) {
                if (p == null) throw TypeError();
                if (Object.create) return Object.create(p);
                var t = typeof p === 'undefined' ? 'undefined' : _typeof(p);
                if (t !== "object" && t !== "function") throw TypeError();

                function f() {};
                f.prototype = p;
                return new f();
            }(proto);

            obj.sim = this;
            obj.id = this.entityId++;
            this.entities.push(obj);

            if (arguments.length > 1) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                obj.start.apply(obj, args);
            } else {
                obj.start();
            }

            return obj;
        }
    }, {
        key: 'simulate',
        value: function simulate(endTime, maxEvents) {
            //ARG_CHECK(arguments, 1, 2);
            if (!maxEvents) {
                maxEvents = Math.Infinity;
            }
            var events = 0;

            while (true) {
                events++;
                if (events > maxEvents) return false;

                // Get the earliest event
                var ro = this.queue.remove();

                // If there are no more events, we are done with simulation here.
                if (ro == undefined) break;

                // Uh oh.. we are out of time now
                if (ro.deliverAt > endTime) break;

                // Advance simulation time
                this.simTime = ro.deliverAt;

                // If this event is already cancelled, ignore
                if (ro.cancelled) continue;

                ro.deliver();
            }

            this.finalize();
            return true;
        }
    }, {
        key: 'step',
        value: function step() {
            while (true) {
                var ro = this.queue.remove();
                if (!ro) return false;
                this.simTime = ro.deliverAt;
                if (ro.cancelled) continue;
                ro.deliver();
                break;
            }
            return true;
        }
    }, {
        key: 'finalize',
        value: function finalize() {
            for (var i = 0; i < this.entities.length; i++) {
                if (this.entities[i].finalize) {
                    this.entities[i].finalize();
                }
            }
        }
    }, {
        key: 'setLogger',
        value: function setLogger(logger) {
            ARG_CHECK(arguments, 1, 1, Function);
            this.logger = logger;
        }
    }, {
        key: 'log',
        value: function log(message, entity) {
            ARG_CHECK(arguments, 1, 2);

            if (!this.logger) return;
            var entityMsg = "";
            if (entity !== undefined) {
                if (entity.name) {
                    entityMsg = ' [' + entity.name + ']';
                } else {
                    entityMsg = ' [' + entity.id + '] ';
                }
            }
            this.logger('' + this.simTime.toFixed(6) + entityMsg + '   ' + message);
        }
    }]);

    return Sim;
}();

var Facility = function () {
    function Facility(name, discipline, servers, maxqlen) {
        _classCallCheck(this, Facility);

        ARG_CHECK(arguments, 1, 4);

        this.free = servers ? servers : 1;
        this.servers = servers ? servers : 1;
        this.maxqlen = maxqlen === undefined ? -1 : 1 * maxqlen;

        switch (discipline) {

            case Facility.LCFS:
                this.use = this.useLCFS;
                this.queue = new _queues.Queue();
                break;
            case Facility.PS:
                this.use = this.useProcessorSharing;
                this.queue = [];
                break;
            case Facility.FCFS:
            default:
                this.use = this.useFCFS;
                this.freeServers = new Array(this.servers);
                this.queue = new _queues.Queue();
                for (var i = 0; i < this.freeServers.length; i++) {
                    this.freeServers[i] = true;
                }
        }

        this.stats = new _stats.Population();
        this.busyDuration = 0;
    }

    _createClass(Facility, [{
        key: 'reset',
        value: function reset() {
            this.queue.reset();
            this.stats.reset();
            this.busyDuration = 0;
        }
    }, {
        key: 'systemStats',
        value: function systemStats() {
            return this.stats;
        }
    }, {
        key: 'queueStats',
        value: function queueStats() {
            return this.queue.stats;
        }
    }, {
        key: 'usage',
        value: function usage() {
            return this.busyDuration;
        }
    }, {
        key: 'finalize',
        value: function finalize(timestamp) {
            ARG_CHECK(arguments, 1, 1);

            this.stats.finalize(timestamp);
            this.queue.stats.finalize(timestamp);
        }
    }, {
        key: 'useFCFS',
        value: function useFCFS(duration, ro) {
            ARG_CHECK(arguments, 2, 2);
            if (this.maxqlen === 0 && !this.free || this.maxqlen > 0 && this.queue.size() >= this.maxqlen) {
                ro.msg = -1;
                ro.deliverAt = ro.entity.time();
                ro.entity.sim.queue.insert(ro);
                return;
            }

            ro.duration = duration;
            var now = ro.entity.time();
            this.stats.enter(now);
            this.queue.push(ro, now);
            this.useFCFSSchedule(now);
        }
    }, {
        key: 'useFCFSSchedule',
        value: function useFCFSSchedule(timestamp) {
            ARG_CHECK(arguments, 1, 1);

            while (this.free > 0 && !this.queue.empty()) {
                var ro = this.queue.shift(timestamp); // TODO
                if (ro.cancelled) {
                    continue;
                }
                for (var i = 0; i < this.freeServers.length; i++) {
                    if (this.freeServers[i]) {
                        this.freeServers[i] = false;
                        ro.msg = i;
                        break;
                    };
                }

                this.free--;
                this.busyDuration += ro.duration;

                // cancel all other reneging requests
                ro.cancelRenegeClauses();

                var newro = new _request.Request(this, timestamp, timestamp + ro.duration);
                newro.done(this.useFCFSCallback, this, ro);

                ro.entity.sim.queue.insert(newro);
            }
        }
    }, {
        key: 'useFCFSCallback',
        value: function useFCFSCallback(ro) {
            // We have one more free server
            this.free++;
            this.freeServers[ro.msg] = true;

            this.stats.leave(ro.scheduledAt, ro.entity.time());

            // if there is someone waiting, schedule it now
            this.useFCFSSchedule(ro.entity.time());

            // restore the deliver function, and deliver
            ro.deliver();
        }
    }, {
        key: 'useLCFS',
        value: function useLCFS(duration, ro) {
            ARG_CHECK(arguments, 2, 2);

            // if there was a running request..
            if (this.currentRO) {
                this.busyDuration += this.currentRO.entity.time() - this.currentRO.lastIssued;
                // calcuate the remaining time
                this.currentRO.remaining = this.currentRO.deliverAt - this.currentRO.entity.time();
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
    }, {
        key: 'useLCFSCallback',
        value: function useLCFSCallback() {
            var ro = this;
            var facility = ro.source;

            if (ro != facility.currentRO) return;
            facility.currentRO = null;

            // stats
            facility.busyDuration += ro.entity.time() - ro.lastIssued;
            facility.stats.leave(ro.scheduledAt, ro.entity.time());

            // deliver this request
            ro.deliver = ro.saved_deliver;
            delete ro.saved_deliver;
            ro.deliver();

            // see if there are pending requests
            if (!facility.queue.empty()) {
                var obj = facility.queue.pop(ro.entity.time());
                facility.useLCFS(obj.remaining, obj);
            }
        }
    }, {
        key: 'useProcessorSharing',
        value: function useProcessorSharing(duration, ro) {
            ARG_CHECK(arguments, 2, 2, null, _request.Request);
            ro.duration = duration;
            ro.cancelRenegeClauses();
            this.stats.enter(ro.entity.time());
            this.useProcessorSharingSchedule(ro, true);
        }
    }, {
        key: 'useProcessorSharingSchedule',
        value: function useProcessorSharingSchedule(ro, isAdded) {
            var current = ro.entity.time();
            var size = this.queue.length;
            var multiplier = isAdded ? (size + 1.0) / size : (size - 1.0) / size;
            var newQueue = [];

            if (this.queue.length === 0) {
                this.lastIssued = current;
            }

            for (var i = 0; i < size; i++) {
                var ev = this.queue[i];
                if (ev.ro === ro) {
                    continue;
                }
                var newev = new _request.Request(this, current, current + (ev.deliverAt - current) * multiplier);
                newev.ro = ev.ro;
                newev.source = this;
                newev.deliver = this.useProcessorSharingCallback;
                newQueue.push(newev);

                ev.cancel();
                ro.entity.sim.queue.insert(newev);
            }

            // add this new request
            if (isAdded) {
                var newev = new _request.Request(this, current, current + ro.duration * (size + 1));
                newev.ro = ro;
                newev.source = this;
                newev.deliver = this.useProcessorSharingCallback;
                newQueue.push(newev);

                ro.entity.sim.queue.insert(newev);
            }

            this.queue = newQueue;

            // usage statistics
            if (this.queue.length == 0) {
                this.busyDuration += current - this.lastIssued;
            }
        }
    }, {
        key: 'useProcessorSharingCallback',
        value: function useProcessorSharingCallback() {
            var ev = this;
            var fac = ev.source;

            if (ev.cancelled) return;
            fac.stats.leave(ev.ro.scheduledAt, ev.ro.entity.time());

            fac.useProcessorSharingSchedule(ev.ro, false);
            ev.ro.deliver();
        }
    }]);

    return Facility;
}();

Facility.FCFS = 1;
Facility.LCFS = 2;
Facility.PS = 3;
Facility.NumDisciplines = 4;

var Buffer = function () {
    function Buffer(name, capacity, initial) {
        _classCallCheck(this, Buffer);

        ARG_CHECK(arguments, 2, 3);

        this.name = name;
        this.capacity = capacity;
        this.available = initial === undefined ? 0 : initial;
        this.putQueue = new _queues.Queue();
        this.getQueue = new _queues.Queue();
    }

    _createClass(Buffer, [{
        key: 'current',
        value: function current() {
            return this.available;
        }
    }, {
        key: 'size',
        value: function size() {
            return this.capacity;
        }
    }, {
        key: 'get',
        value: function get(amount, ro) {
            ARG_CHECK(arguments, 2, 2);

            if (this.getQueue.empty() && amount <= this.available) {
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
    }, {
        key: 'put',
        value: function put(amount, ro) {
            ARG_CHECK(arguments, 2, 2);

            if (this.putQueue.empty() && amount + this.available <= this.capacity) {
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
    }, {
        key: 'progressGetQueue',
        value: function progressGetQueue() {
            var obj = void 0;
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
    }, {
        key: 'progressPutQueue',
        value: function progressPutQueue() {
            var obj = void 0;
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
    }, {
        key: 'putStats',
        value: function putStats() {
            return this.putQueue.stats;
        }
    }, {
        key: 'getStats',
        value: function getStats() {
            return this.getQueue.stats;
        }
    }]);

    return Buffer;
}();

var Store = function () {
    function Store(name, capacity) {
        _classCallCheck(this, Store);

        ARG_CHECK(arguments, 2, 3);

        this.name = name;
        this.capacity = capacity;
        this.objects = [];
        this.putQueue = new _queues.Queue();
        this.getQueue = new _queues.Queue();
    }

    _createClass(Store, [{
        key: 'current',
        value: function current() {
            return this.objects.length;
        }
    }, {
        key: 'size',
        value: function size() {
            return this.capacity;
        }
    }, {
        key: 'get',
        value: function get(filter, ro) {
            ARG_CHECK(arguments, 2, 2);

            if (this.getQueue.empty() && this.current() > 0) {
                var found = false;
                var obj = void 0;
                // TODO: refactor this code out
                // it is repeated in progressGetQueue
                if (filter) {
                    for (var i = 0; i < this.objects.length; i++) {
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
                    ro.entity.sim.queue.insert(ro);

                    this.getQueue.passby(ro.deliverAt);

                    this.progressPutQueue();

                    return;
                }
            }

            ro.filter = filter;
            this.getQueue.push(ro, ro.entity.time());
        }
    }, {
        key: 'put',
        value: function put(obj, ro) {
            ARG_CHECK(arguments, 2, 2);

            if (this.putQueue.empty() && this.current() < this.capacity) {
                this.available++;

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
    }, {
        key: 'progressGetQueue',
        value: function progressGetQueue() {
            var ro = void 0;
            while (ro = this.getQueue.top()) {
                // if obj is cancelled.. remove it.
                if (ro.cancelled) {
                    this.getQueue.shift(ro.entity.time());
                    continue;
                }

                // see if this request can be satisfied
                if (this.current() > 0) {
                    var filter = ro.filter;
                    var found = false;
                    var obj = void 0;

                    if (filter) {
                        for (var i = 0; i < this.objects.length; i++) {
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
                        this.available--;

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
    }, {
        key: 'progressPutQueue',
        value: function progressPutQueue() {
            var ro = void 0;
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
                    this.available++;
                    this.objects.push(ro.obj);
                    ro.deliverAt = ro.entity.time();
                    ro.entity.sim.queue.insert(ro);
                } else {
                    // this request cannot be satisfied
                    break;
                }
            }
        }
    }, {
        key: 'putStats',
        value: function putStats() {
            return this.putQueue.stats;
        }
    }, {
        key: 'getStats',
        value: function getStats() {
            return this.getQueue.stats;
        }
    }]);

    return Store;
}();

var Event = function () {
    function Event(name) {
        _classCallCheck(this, Event);

        ARG_CHECK(arguments, 0, 1);

        this.name = name;
        this.waitList = [];
        this.queue = [];
        this.isFired = false;
    }

    _createClass(Event, [{
        key: 'addWaitList',
        value: function addWaitList(ro) {
            ARG_CHECK(arguments, 1, 1);

            if (this.isFired) {
                ro.deliverAt = ro.entity.time();
                ro.entity.sim.queue.insert(ro);
                return;
            }
            this.waitList.push(ro);
        }
    }, {
        key: 'addQueue',
        value: function addQueue(ro) {
            ARG_CHECK(arguments, 1, 1);

            if (this.isFired) {
                ro.deliverAt = ro.entity.time();
                ro.entity.sim.queue.insert(ro);
                return;
            }
            this.queue.push(ro);
        }
    }, {
        key: 'fire',
        value: function fire(keepFired) {
            ARG_CHECK(arguments, 0, 1);

            if (keepFired) {
                this.isFired = true;
            }

            // Dispatch all waiting entities
            var tmpList = this.waitList;
            this.waitList = [];
            for (var i = 0; i < tmpList.length; i++) {
                tmpList[i].deliver();
            }

            // Dispatch one queued entity
            var lucky = this.queue.shift();
            if (lucky) {
                lucky.deliver();
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.isFired = false;
        }
    }]);

    return Event;
}();

function ARG_CHECK(found, expMin, expMax) {
    if (found.length < expMin || found.length > expMax) {
        // ARG_CHECK
        throw new Error("Incorrect number of arguments"); // ARG_CHECK
    } // ARG_CHECK

    for (var i = 0; i < found.length; i++) {
        // ARG_CHECK
        if (!arguments[i + 3] || !found[i]) continue; // ARG_CHECK

        //		print("TEST " + found[i] + " " + arguments[i + 3]   // ARG_CHECK
        //		+ " " + (found[i] instanceof Event)   // ARG_CHECK
        //		+ " " + (found[i] instanceof arguments[i + 3])   // ARG_CHECK
        //		+ "\n");   // ARG CHECK

        if (!(found[i] instanceof arguments[i + 3])) {
            // ARG_CHECK
            throw new Error('parameter ' + (i + 1) + ' is of incorrect type.'); // ARG_CHECK
        } // ARG_CHECK
    } // ARG_CHECK
} // ARG_CHECK

exports.Sim = Sim;
exports.Facility = Facility;
exports.Buffer = Buffer;
exports.Store = Store;
exports.Event = Event;
exports.ARG_CHECK = ARG_CHECK;

},{"./queues.js":1,"./request.js":2,"./stats.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Population = exports.TimeSeries = exports.DataSeries = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sim = require('./sim.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataSeries = function () {
    function DataSeries(name) {
        _classCallCheck(this, DataSeries);

        this.name = name;
        this.reset();
    }

    _createClass(DataSeries, [{
        key: 'reset',
        value: function reset() {
            this.Count = 0;
            this.W = 0.0;
            this.A = 0.0;
            this.Q = 0.0;
            this.Max = -Infinity;
            this.Min = Infinity;
            this.Sum = 0;

            if (this.histogram) {
                for (var i = 0; i < this.histogram.length; i++) {
                    this.histogram[i] = 0;
                }
            }
        }
    }, {
        key: 'setHistogram',
        value: function setHistogram(lower, upper, nbuckets) {
            (0, _sim.ARG_CHECK)(arguments, 3, 3);

            this.hLower = lower;
            this.hUpper = upper;
            this.hBucketSize = (upper - lower) / nbuckets;
            this.histogram = new Array(nbuckets + 2);
            for (var i = 0; i < this.histogram.length; i++) {
                this.histogram[i] = 0;
            }
        }
    }, {
        key: 'getHistogram',
        value: function getHistogram() {
            return this.histogram;
        }
    }, {
        key: 'record',
        value: function record(value, weight) {
            (0, _sim.ARG_CHECK)(arguments, 1, 2);

            var w = weight === undefined ? 1 : weight;
            //document.write("Data series recording " + value + " (weight = " + w + ")\n");

            if (value > this.Max) this.Max = value;
            if (value < this.Min) this.Min = value;
            this.Sum += value;
            this.Count++;
            if (this.histogram) {
                if (value < this.hLower) {
                    this.histogram[0] += w;
                } else if (value > this.hUpper) {
                    this.histogram[this.histogram.length - 1] += w;
                } else {
                    var index = Math.floor((value - this.hLower) / this.hBucketSize) + 1;
                    this.histogram[index] += w;
                }
            }

            // Wi = Wi-1 + wi
            this.W = this.W + w;

            if (this.W === 0) {
                return;
            }

            // Ai = Ai-1 + wi/Wi * (xi - Ai-1)
            var lastA = this.A;
            this.A = lastA + w / this.W * (value - lastA);

            // Qi = Qi-1 + wi(xi - Ai-1)(xi - Ai)
            this.Q = this.Q + w * (value - lastA) * (value - this.A);
            //print("\tW=" + this.W + " A=" + this.A + " Q=" + this.Q + "\n");
        }
    }, {
        key: 'count',
        value: function count() {
            return this.Count;
        }
    }, {
        key: 'min',
        value: function min() {
            return this.Min;
        }
    }, {
        key: 'max',
        value: function max() {
            return this.Max;
        }
    }, {
        key: 'range',
        value: function range() {
            return this.Max - this.Min;
        }
    }, {
        key: 'sum',
        value: function sum() {
            return this.Sum;
        }
    }, {
        key: 'sumWeighted',
        value: function sumWeighted() {
            return this.A * this.W;
        }
    }, {
        key: 'average',
        value: function average() {
            return this.A;
        }
    }, {
        key: 'variance',
        value: function variance() {
            return this.Q / this.W;
        }
    }, {
        key: 'deviation',
        value: function deviation() {
            return Math.sqrt(this.variance());
        }
    }]);

    return DataSeries;
}();

var TimeSeries = function () {
    function TimeSeries(name) {
        _classCallCheck(this, TimeSeries);

        this.dataSeries = new DataSeries(name);
    }

    _createClass(TimeSeries, [{
        key: 'reset',
        value: function reset() {
            this.dataSeries.reset();
            this.lastValue = NaN;
            this.lastTimestamp = NaN;
        }
    }, {
        key: 'setHistogram',
        value: function setHistogram(lower, upper, nbuckets) {
            (0, _sim.ARG_CHECK)(arguments, 3, 3);
            this.dataSeries.setHistogram(lower, upper, nbuckets);
        }
    }, {
        key: 'getHistogram',
        value: function getHistogram() {
            return this.dataSeries.getHistogram();
        }
    }, {
        key: 'record',
        value: function record(value, timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 2, 2);

            if (!isNaN(this.lastTimestamp)) {
                this.dataSeries.record(this.lastValue, timestamp - this.lastTimestamp);
            }

            this.lastValue = value;
            this.lastTimestamp = timestamp;
        }
    }, {
        key: 'finalize',
        value: function finalize(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            this.record(NaN, timestamp);
        }
    }, {
        key: 'count',
        value: function count() {
            return this.dataSeries.count();
        }
    }, {
        key: 'min',
        value: function min() {
            return this.dataSeries.min();
        }
    }, {
        key: 'max',
        value: function max() {
            return this.dataSeries.max();
        }
    }, {
        key: 'range',
        value: function range() {
            return this.dataSeries.range();
        }
    }, {
        key: 'sum',
        value: function sum() {
            return this.dataSeries.sum();
        }
    }, {
        key: 'average',
        value: function average() {
            return this.dataSeries.average();
        }
    }, {
        key: 'deviation',
        value: function deviation() {
            return this.dataSeries.deviation();
        }
    }, {
        key: 'variance',
        value: function variance() {
            return this.dataSeries.variance();
        }
    }]);

    return TimeSeries;
}();

var Population = function () {
    function Population(name) {
        _classCallCheck(this, Population);

        this.name = name;
        this.population = 0;
        this.sizeSeries = new TimeSeries();
        this.durationSeries = new DataSeries();
    }

    _createClass(Population, [{
        key: 'reset',
        value: function reset() {
            this.sizeSeries.reset();
            this.durationSeries.reset();
            this.population = 0;
        }
    }, {
        key: 'enter',
        value: function enter(timestamp) {
            (0, _sim.ARG_CHECK)(arguments, 1, 1);

            this.population++;
            this.sizeSeries.record(this.population, timestamp);
        }
    }, {
        key: 'leave',
        value: function leave(arrivalAt, leftAt) {
            (0, _sim.ARG_CHECK)(arguments, 2, 2);

            this.population--;
            this.sizeSeries.record(this.population, leftAt);
            this.durationSeries.record(leftAt - arrivalAt);
        }
    }, {
        key: 'current',
        value: function current() {
            return this.population;
        }
    }, {
        key: 'finalize',
        value: function finalize(timestamp) {
            this.sizeSeries.finalize(timestamp);
        }
    }]);

    return Population;
}();

exports.DataSeries = DataSeries;
exports.TimeSeries = TimeSeries;
exports.Population = Population;

},{"./sim.js":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ARG_CHECK = exports.Queue = exports.PQueue = exports.Request = exports.Population = exports.TimeSeries = exports.DataSeries = exports.Store = exports.Facility = exports.Buffer = exports.Event = exports.Sim = undefined;

var _sim = require('./lib/sim.js');

var _stats = require('./lib/stats.js');

var _request = require('./lib/request.js');

var _queues = require('./lib/queues.js');

exports.Sim = _sim.Sim;
exports.Event = _sim.Event;
exports.Buffer = _sim.Buffer;
exports.Facility = _sim.Facility;
exports.Store = _sim.Store;
exports.DataSeries = _stats.DataSeries;
exports.TimeSeries = _stats.TimeSeries;
exports.Population = _stats.Population;
exports.Request = _request.Request;
exports.PQueue = _queues.PQueue;
exports.Queue = _queues.Queue;
exports.ARG_CHECK = _sim.ARG_CHECK;

},{"./lib/queues.js":1,"./lib/request.js":2,"./lib/sim.js":3,"./lib/stats.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3F1ZXVlcy5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztJQUVNLEs7QUFDRixtQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2QsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssSUFBTCxHQUFZLEVBQVo7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLLEtBQUwsR0FBYSx1QkFBYjtBQUNIOzs7OzhCQUVLO0FBQ0YsbUJBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0g7OzsrQkFFTTtBQUNILG1CQUFRLEtBQUssSUFBTCxDQUFVLE1BQVgsR0FBcUIsS0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUE3QixDQUFyQixHQUF1RCxTQUE5RDtBQUNIOzs7NkJBRUksSyxFQUFPLFMsRUFBVztBQUNuQixnQ0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxLQUFmO0FBQ0EsaUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsU0FBcEI7O0FBRUEsaUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBakI7QUFDSDs7O2dDQUVPLEssRUFBTyxTLEVBQVc7QUFDdEIsZ0NBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEtBQWxCO0FBQ0EsaUJBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsU0FBdkI7O0FBRUEsaUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBakI7QUFDSDs7OzhCQUVLLFMsRUFBVztBQUNiLGdD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R0ksVSxHQUFBLFU7UUFBWSxVLEdBQUEsVTtRQUFZLFUsR0FBQSxVOzs7Ozs7Ozs7O0FDL05qQzs7QUFDQTs7QUFDQTs7QUFDQTs7UUFFUyxHO1FBQUssSztRQUFPLE07UUFBUSxRO1FBQVUsSztRQUM5QixVO1FBQVksVTtRQUFZLFU7UUFDeEIsTztRQUNBLE07UUFBUSxLO1FBQU8sUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBBUkdfQ0hFQ0sgfSBmcm9tICcuL3NpbS5qcyc7XG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XG5cbmNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xuICAgICAgICB0aGlzLnN0YXRzID0gbmV3IFBvcHVsYXRpb24oKTtcbiAgICB9XG5cbiAgICB0b3AoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gICAgfVxuXG4gICAgYmFjaygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmRhdGEubGVuZ3RoKSA/IHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVzaCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgICAgICB0aGlzLmRhdGEucHVzaCh2YWx1ZSk7XG4gICAgICAgIHRoaXMudGltZXN0YW1wLnB1c2godGltZXN0YW1wKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdW5zaGlmdCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgICAgICB0aGlzLmRhdGEudW5zaGlmdCh2YWx1ZSk7XG4gICAgICAgIHRoaXMudGltZXN0YW1wLnVuc2hpZnQodGltZXN0YW1wKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgc2hpZnQodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGVucXVldWVkQXQgPSB0aGlzLnRpbWVzdGFtcC5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHBvcCh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEucG9wKCk7XG4gICAgICAgIGNvbnN0IGVucXVldWVkQXQgPSB0aGlzLnRpbWVzdGFtcC5wb3AoKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwYXNzYnkodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgICAgICAgdGhpcy5zdGF0cy5sZWF2ZSh0aW1lc3RhbXAsIHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIHRoaXMuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zdGF0cy5yZXNldCgpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xuICAgIH1cblxuICAgIHJlcG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnN0YXRzLnNpemVTZXJpZXMuYXZlcmFnZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHMuZHVyYXRpb25TZXJpZXMuYXZlcmFnZSgpXTtcbiAgICB9XG5cbiAgICBlbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPT0gMDtcbiAgICB9XG5cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICB9XG59XG5cbmNsYXNzIFBRdWV1ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLm9yZGVyID0gMDtcbiAgICB9XG5cbiAgICBncmVhdGVyKHJvMSwgcm8yKSB7XG4gICAgICAgIGlmIChybzEuZGVsaXZlckF0ID4gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChybzEuZGVsaXZlckF0ID09IHJvMi5kZWxpdmVyQXQpXG4gICAgICAgICAgICByZXR1cm4gcm8xLm9yZGVyID4gcm8yLm9yZGVyO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5zZXJ0KHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuICAgICAgICByby5vcmRlciA9IHRoaXMub3JkZXIgKys7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2gocm8pO1xuXG4gICAgICAgIC8vIGluc2VydCBpbnRvIGRhdGEgYXQgdGhlIGVuZFxuICAgICAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgLy8gaGVhcCB1cFxuICAgICAgICB3aGlsZSAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoKGluZGV4IC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtwYXJlbnRJbmRleF0sIHJvKSkge1xuICAgICAgICAgICAgICAgIGFbaW5kZXhdID0gYVtwYXJlbnRJbmRleF07XG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYVtpbmRleF0gPSBub2RlO1xuICAgIH1cblxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcbiAgICAgICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xuICAgICAgICBpZiAobGVuIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbiA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvcCA9IGFbMF07XG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxuICAgICAgICBhWzBdID0gYS5wb3AoKTtcbiAgICAgICAgbGVuIC0tO1xuXG4gICAgICAgIC8vIGhlYXAgZG93blxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgTWF0aC5mbG9vcihsZW4gLyAyKSkge1xuICAgICAgICAgICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAyICogaW5kZXggKyAxO1xuICAgICAgICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMjtcblxuICAgICAgICAgICAgY29uc3Qgc21hbGxlckNoaWxkSW5kZXggPSByaWdodENoaWxkSW5kZXggPCBsZW5cbiAgICAgICAgICAgICAgJiYgIXRoaXMuZ3JlYXRlcihhW3JpZ2h0Q2hpbGRJbmRleF0sIGFbbGVmdENoaWxkSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ncmVhdGVyKGFbc21hbGxlckNoaWxkSW5kZXhdLCBub2RlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhW2luZGV4XSA9IGFbc21hbGxlckNoaWxkSW5kZXhdO1xuICAgICAgICAgICAgaW5kZXggPSBzbWFsbGVyQ2hpbGRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBhW2luZGV4XSA9IG5vZGU7XG4gICAgICAgIHJldHVybiB0b3A7XG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWV1ZSwgUFF1ZXVlIH07XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgICBjb25zdHJ1Y3RvcihlbnRpdHksIGN1cnJlbnRUaW1lLCBkZWxpdmVyQXQpIHtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXQgPSBjdXJyZW50VGltZTtcbiAgICAgICAgdGhpcy5kZWxpdmVyQXQgPSBkZWxpdmVyQXQ7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwWzBdICE9IHRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0+IHRoaXMgaXMgbWFpbiByZXF1ZXN0XG4gICAgICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgICAgICAvLyBpZiBhbHJlYWR5IGNhbmNlbGxlZCwgZG8gbm90aGluZ1xuICAgICAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVsaXZlckF0ID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc1B1dFF1ZXVlLmNhbGwodGhpcy5zb3VyY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzR2V0UXVldWUuY2FsbCh0aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb25lKGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAzLCBGdW5jdGlvbiwgT2JqZWN0KTtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2FpdFVudGlsKGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCwgdW5kZWZpbmVkLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICAgICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdCh0aGlzLnNjaGVkdWxlZEF0ICsgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgIHRoaXMuZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDQsIHVuZGVmaW5lZCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICAgICAgcm8ubXNnID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgICAgIHZhciBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgICAgICAgICAgICByby5tc2cgPSBldmVudFtpXTtcbiAgICAgICAgICAgICAgICBldmVudFtpXS5hZGRXYWl0TGlzdChybyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXREYXRhKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsaXZlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIGlmICghdGhpcy5jYWxsYmFja3MpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwWzBdLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNhbmNlbFJlbmVnZUNsYXVzZXMoKSB7XG4gICAgICAgIC8vdGhpcy5jYW5jZWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vdGhpcy53YWl0VW50aWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vdGhpcy51bmxlc3NFdmVudCA9IHRoaXMuTnVsbDtcbiAgICAgICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XG5cbiAgICAgICAgaWYgKCF0aGlzLmdyb3VwIHx8IHRoaXMuZ3JvdXBbMF0gIT0gdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgTnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSxcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEF0LFxuICAgICAgICAgICAgICAgIGRlbGl2ZXJBdCk7XG5cbiAgICAgICAgcm8uY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuXG4gICAgICAgIGlmICh0aGlzLmdyb3VwID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwID0gW3RoaXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncm91cC5wdXNoKHJvKTtcbiAgICAgICAgcm8uZ3JvdXAgPSB0aGlzLmdyb3VwO1xuICAgICAgICByZXR1cm4gcm87XG4gICAgfVxuXG4gICAgX2RvQ2FsbGJhY2soc291cmNlLCBtc2csIGRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMuY2FsbGJhY2tzW2ldWzFdO1xuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gdGhpcy5lbnRpdHk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFyZ3VtZW50ID0gdGhpcy5jYWxsYmFja3NbaV1bMl07XG5cbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG1zZztcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gZGF0YTtcblxuICAgICAgICAgICAgaWYgKCFhcmd1bWVudCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUmVxdWVzdCB9O1xuIiwiaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vcXVldWVzLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuXG5jbGFzcyBTaW0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNpbVRpbWUgPSAwO1xuICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XG4gICAgICAgIHRoaXMucXVldWUgPSBuZXcgUFF1ZXVlKCk7XG4gICAgICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSAxO1xuICAgIH1cblxuICAgIHRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbVRpbWU7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgICAgIGNvbnN0IHNlbmRlciA9IHRoaXMuc291cmNlO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tc2c7XG4gICAgICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBzaW0gPSBzZW5kZXIuc2ltO1xuXG4gICAgICAgIGlmICghZW50aXRpZXMpIHtcbiAgICAgICAgICAgIC8vIHNlbmQgdG8gYWxsIGVudGl0aWVzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc2ltLmVudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVudGl0eSA9IHNpbS5lbnRpdGllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlLmNhbGwoZW50aXR5LCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVudGl0aWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBlbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlLmNhbGwoZW50aXR5LCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGVudGl0aWVzIC5vbk1lc3NhZ2UuY2FsbChlbnRpdGllcywgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZEVudGl0eShwcm90bykge1xuICAgICAgICAvL0FSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIE9iamVjdCk7XG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHByb3RvdHlwZSBoYXMgc3RhcnQgZnVuY3Rpb25cbiAgICAgICAgaWYgKCFwcm90by5zdGFydCkgeyAgLy8gQVJHIENIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgcHJvdG90eXBlIG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRcIik7IC8vIEFSRyBDSEVDS1xuICAgICAgICB9ICAvLyBBUkcgQ0hFQ0tcblxuICAgICAgICBpZiAoIXByb3RvLnRpbWUpIHtcbiAgICAgICAgICAgIHByb3RvLnRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltLnRpbWUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByb3RvLnNldFRpbWVyID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8ud2FpdEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgICAgICAgICAgICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgICAgICAgICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuICAgICAgICAgICAgICAgIHJldHVybiBybztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByb3RvLnF1ZXVlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxLCBFdmVudCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICAgICAgICAgICAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICAgICAgICAgICAgICBldmVudC5hZGRRdWV1ZShybyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8udXNlRmFjaWxpdHkgPSBmdW5jdGlvbiAoZmFjaWxpdHksIGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgICAgICAgICAgICAgIHJvLnNvdXJjZSA9IGZhY2lsaXR5O1xuICAgICAgICAgICAgICAgIGZhY2lsaXR5LnVzZShkdXJhdGlvbiwgcm8pO1xuICAgICAgICAgICAgICAgIHJldHVybiBybztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByb3RvLnB1dEJ1ZmZlciA9IGZ1bmN0aW9uIChidWZmZXIsIGFtb3VudCkge1xuICAgICAgICAgICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgICAgICAgICAgICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXQoYW1vdW50LCBybyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8uZ2V0QnVmZmVyID0gZnVuY3Rpb24gKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgICAgICAgICAgICByby5zb3VyY2UgPSBidWZmZXI7XG4gICAgICAgICAgICAgICAgYnVmZmVyLmdldChhbW91bnQsIHJvKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm87XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBwcm90by5wdXRTdG9yZSA9IGZ1bmN0aW9uIChzdG9yZSwgb2JqKSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgICAgICAgICAgICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xuICAgICAgICAgICAgICAgIHN0b3JlLnB1dChvYmosIHJvKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm87XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBwcm90by5nZXRTdG9yZSA9IGZ1bmN0aW9uIChzdG9yZSwgZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMiwgU3RvcmUsIEZ1bmN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgICAgICAgICAgICByby5zb3VyY2UgPSBzdG9yZTtcbiAgICAgICAgICAgICAgICBzdG9yZS5nZXQoZmlsdGVyLCBybyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8uc2VuZCA9IGZ1bmN0aW9uIChtZXNzYWdlLCBkZWxheSwgZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcy5zaW0sIHRoaXMudGltZSgpLCB0aGlzLnRpbWUoKSArIGRlbGF5KTtcbiAgICAgICAgICAgICAgICByby5zb3VyY2UgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHJvLm1zZyA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgcm8uZGF0YSA9IGVudGl0aWVzO1xuICAgICAgICAgICAgICAgIHJvLmRlbGl2ZXIgPSB0aGlzLnNpbS5zZW5kTWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBwcm90by5sb2cgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9iaiA9ICgocCA9PiB7XG4gICAgICAgICAgICBpZiAocCA9PSBudWxsKSB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QuY3JlYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKHApO1xuICAgICAgICAgICAgY29uc3QgdCA9IHR5cGVvZiBwO1xuICAgICAgICAgICAgaWYgKHQgIT09IFwib2JqZWN0XCIgJiYgdCAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBUeXBlRXJyb3IoKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZigpIHt9O1xuICAgICAgICAgICAgZi5wcm90b3R5cGUgPSBwO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBmKCk7XG4gICAgICAgIH0pKHByb3RvKSk7XG5cbiAgICAgICAgb2JqLnNpbSA9IHRoaXM7XG4gICAgICAgIG9iai5pZCA9IHRoaXMuZW50aXR5SWQgKys7XG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChvYmopO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmouc3RhcnQuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9iai5zdGFydCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xuICAgICAgICAvL0FSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuICAgICAgICBpZiAoIW1heEV2ZW50cykge21heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cbiAgICAgICAgbGV0IGV2ZW50cyA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGV2ZW50cyArKztcbiAgICAgICAgICAgIGlmIChldmVudHMgPiBtYXhFdmVudHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBlYXJsaWVzdCBldmVudFxuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBldmVudHMsIHdlIGFyZSBkb25lIHdpdGggc2ltdWxhdGlvbiBoZXJlLlxuICAgICAgICAgICAgaWYgKHJvID09IHVuZGVmaW5lZCkgYnJlYWs7XG5cblxuICAgICAgICAgICAgLy8gVWggb2guLiB3ZSBhcmUgb3V0IG9mIHRpbWUgbm93XG4gICAgICAgICAgICBpZiAocm8uZGVsaXZlckF0ID4gZW5kVGltZSkgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIEFkdmFuY2Ugc2ltdWxhdGlvbiB0aW1lXG4gICAgICAgICAgICB0aGlzLnNpbVRpbWUgPSAgcm8uZGVsaXZlckF0O1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGV2ZW50IGlzIGFscmVhZHkgY2FuY2VsbGVkLCBpZ25vcmVcbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICByby5kZWxpdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0ZXAoKSB7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoIXJvKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNpbVRpbWUgPSByby5kZWxpdmVyQXQ7XG4gICAgICAgICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJvLmRlbGl2ZXIoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZpbmFsaXplKCkge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2dnZXIobG9nZ2VyKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgfVxuXG4gICAgbG9nKG1lc3NhZ2UsIGVudGl0eSkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgICAgICBpZiAoIXRoaXMubG9nZ2VyKSByZXR1cm47XG4gICAgICAgIGxldCBlbnRpdHlNc2cgPSBcIlwiO1xuICAgICAgICBpZiAoZW50aXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkubmFtZSkge1xuICAgICAgICAgICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5Lm5hbWV9XWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihgJHt0aGlzLnNpbVRpbWUudG9GaXhlZCg2KX0ke2VudGl0eU1zZ30gICAke21lc3NhZ2V9YCk7XG4gICAgfVxufVxuXG5jbGFzcyBGYWNpbGl0eSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGlzY2lwbGluZSwgc2VydmVycywgbWF4cWxlbikge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0KTtcblxuICAgICAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgICAgIHRoaXMuc2VydmVycyA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcbiAgICAgICAgdGhpcy5tYXhxbGVuID0gKG1heHFsZW4gPT09IHVuZGVmaW5lZCkgPyAtMSA6IDEgKiBtYXhxbGVuO1xuXG4gICAgICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgICAgIGNhc2UgRmFjaWxpdHkuTENGUzpcbiAgICAgICAgICAgIHRoaXMudXNlID0gdGhpcy51c2VMQ0ZTO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRmFjaWxpdHkuUFM6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZztcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlRkNGUztcbiAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnMgPSBuZXcgQXJyYXkodGhpcy5zZXJ2ZXJzKTtcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgICAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICBzeXN0ZW1TdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHM7XG4gICAgfVxuXG4gICAgcXVldWVTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gICAgfVxuXG4gICAgdXNhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1c3lEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgICAgICB0aGlzLnF1ZXVlLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgICAgIGlmICggKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgICAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgICAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShub3cpO1xuICAgIH1cblxuICAgIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7IC8vIFRPRE9cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZyZWVTZXJ2ZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mcmVlIC0tO1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gcm8uZHVyYXRpb247XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBhbGwgb3RoZXIgcmVuZWdpbmcgcmVxdWVzdHNcbiAgICAgICAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcblxuICAgICAgICAgICAgY29uc3QgbmV3cm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aW1lc3RhbXAsIHRpbWVzdGFtcCArIHJvLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIG5ld3JvLmRvbmUodGhpcy51c2VGQ0ZTQ2FsbGJhY2ssIHRoaXMsIHJvKTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXNlRkNGU0NhbGxiYWNrKHJvKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgb25lIG1vcmUgZnJlZSBzZXJ2ZXJcbiAgICAgICAgdGhpcy5mcmVlICsrO1xuICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIHNvbWVvbmUgd2FpdGluZywgc2NoZWR1bGUgaXQgbm93XG4gICAgICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXG4gICAgICAgIHJvLmRlbGl2ZXIoKTtcblxuICAgIH1cblxuICAgIHVzZUxDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSTykge1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkgLSB0aGlzLmN1cnJlbnRSTy5sYXN0SXNzdWVkKTtcbiAgICAgICAgICAgIC8vIGNhbGN1YXRlIHRoZSByZW1haW5pbmcgdGltZVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Uk8ucmVtYWluaW5nID1cbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgICAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cbiAgICAgICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8ubGFzdElzc3VlZCA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgfVxuXG4gICAgdXNlTENGU0NhbGxiYWNrKCkge1xuICAgICAgICBjb25zdCBybyA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGZhY2lsaXR5ID0gcm8uc291cmNlO1xuXG4gICAgICAgIGlmIChybyAhPSBmYWNpbGl0eS5jdXJyZW50Uk8pIHJldHVybjtcbiAgICAgICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcblxuICAgICAgICAvLyBzdGF0c1xuICAgICAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHJvLmVudGl0eS50aW1lKCkgLSByby5sYXN0SXNzdWVkKTtcbiAgICAgICAgZmFjaWxpdHkuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XG4gICAgICAgIHJvLmRlbGl2ZXIgPSByby5zYXZlZF9kZWxpdmVyO1xuICAgICAgICBkZWxldGUgcm8uc2F2ZWRfZGVsaXZlcjtcbiAgICAgICAgcm8uZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgICAgICBpZiAoIWZhY2lsaXR5LnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGZhY2lsaXR5LnF1ZXVlLnBvcChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmcoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIG51bGwsIFJlcXVlc3QpO1xuICAgICAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgICB9XG5cbiAgICB1c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIGlzQWRkZWQpIHtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XG4gICAgICAgIGNvbnN0IG5ld1F1ZXVlID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcbiAgICAgICAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcbiAgICAgICAgICAgIG5ld2V2LnJvID0gZXYucm87XG4gICAgICAgICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgICAgICAgIGV2LmNhbmNlbCgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcbiAgICAgICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyByby5kdXJhdGlvbiAqIChzaXplICsgMSkpO1xuICAgICAgICAgICAgbmV3ZXYucm8gPSBybztcbiAgICAgICAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICAgICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICAgICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ld1F1ZXVlO1xuXG4gICAgICAgIC8vIHVzYWdlIHN0YXRpc3RpY3NcbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IChjdXJyZW50IC0gdGhpcy5sYXN0SXNzdWVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICAgICAgY29uc3QgZXYgPSB0aGlzO1xuICAgICAgICBjb25zdCBmYWMgPSBldi5zb3VyY2U7XG5cbiAgICAgICAgaWYgKGV2LmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBmYWMuc3RhdHMubGVhdmUoZXYucm8uc2NoZWR1bGVkQXQsIGV2LnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIGZhYy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUoZXYucm8sIGZhbHNlKTtcbiAgICAgICAgZXYucm8uZGVsaXZlcigpO1xuICAgIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gKGluaXRpYWwgPT09IHVuZGVmaW5lZCkgPyAwIDogaW5pdGlhbDtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgfVxuXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlO1xuICAgIH1cblxuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xuICAgIH1cblxuICAgIGdldChhbW91bnQsIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiBhbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC09IGFtb3VudDtcblxuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcHV0KGFtb3VudCwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIChhbW91bnQgKyB0aGlzLmF2YWlsYWJsZSkgPD0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgKz0gYW1vdW50O1xuXG4gICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgICAgIGxldCBvYmo7XG4gICAgICAgIHdoaWxlIChvYmogPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgaWYgKG9iai5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcbiAgICAgICAgICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgICAgICBsZXQgb2JqO1xuICAgICAgICB3aGlsZSAob2JqID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSArPSBvYmouYW1vdW50O1xuICAgICAgICAgICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dFN0YXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgICB9XG5cbiAgICBnZXRTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gICAgfVxufVxuXG5jbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY2FwYWNpdHkpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgfVxuXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cy5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gICAgfVxuXG4gICAgZ2V0KGZpbHRlciwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IG9iajtcbiAgICAgICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgY29kZSBvdXRcbiAgICAgICAgICAgIC8vIGl0IGlzIHJlcGVhdGVkIGluIHByb2dyZXNzR2V0UXVldWVcbiAgICAgICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgICAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcm8uZmlsdGVyID0gZmlsdGVyO1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHB1dChvYmosIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLnB1dFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSArKztcblxuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICAgICAgdGhpcy5wdXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iaik7XG5cbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByby5vYmogPSBvYmo7XG4gICAgICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICAgICAgbGV0IHJvO1xuICAgICAgICB3aGlsZSAocm8gPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHJvLmZpbHRlcjtcbiAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICAgICAgICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb2dyZXNzUHV0UXVldWUoKSB7XG4gICAgICAgIGxldCBybztcbiAgICAgICAgd2hpbGUgKHJvID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gocm8ub2JqKTtcbiAgICAgICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dFN0YXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgICB9XG5cbiAgICBnZXRTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gICAgfVxufVxuXG5jbGFzcyBFdmVudCB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkV2FpdExpc3Qocm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndhaXRMaXN0LnB1c2gocm8pO1xuICAgIH1cblxuICAgIGFkZFF1ZXVlKHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvKTtcbiAgICB9XG5cbiAgICBmaXJlKGtlZXBGaXJlZCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICBpZiAoa2VlcEZpcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcbiAgICAgICAgY29uc3QgdG1wTGlzdCA9IHRoaXMud2FpdExpc3Q7XG4gICAgICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBMaXN0Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBvbmUgcXVldWVkIGVudGl0eVxuICAgICAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKGx1Y2t5KSB7XG4gICAgICAgICAgICBsdWNreS5kZWxpdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIEFSR19DSEVDSyhmb3VuZCwgZXhwTWluLCBleHBNYXgpIHtcblx0aWYgKGZvdW5kLmxlbmd0aCA8IGV4cE1pbiB8fCBmb3VuZC5sZW5ndGggPiBleHBNYXgpIHsgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTsgICAvLyBBUkdfQ0hFQ0tcblx0fSAgIC8vIEFSR19DSEVDS1xuXG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykgeyAgIC8vIEFSR19DSEVDS1xuXHRcdGlmICghYXJndW1lbnRzW2kgKyAzXSB8fCAhZm91bmRbaV0pIGNvbnRpbnVlOyAgIC8vIEFSR19DSEVDS1xuXG4vL1x0XHRwcmludChcIlRFU1QgXCIgKyBmb3VuZFtpXSArIFwiIFwiICsgYXJndW1lbnRzW2kgKyAzXSAgIC8vIEFSR19DSEVDS1xuLy9cdFx0KyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIEV2ZW50KSAgIC8vIEFSR19DSEVDS1xuLy9cdFx0KyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pICAgLy8gQVJHX0NIRUNLXG4vL1x0XHQrIFwiXFxuXCIpOyAgIC8vIEFSRyBDSEVDS1xuXG5cblx0XHRpZiAoISAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSkgeyAgIC8vIEFSR19DSEVDS1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gQVJHX0NIRUNLXG5cdFx0fSAgIC8vIEFSR19DSEVDS1xuXHR9ICAgLy8gQVJHX0NIRUNLXG59ICAgLy8gQVJHX0NIRUNLXG5cbmV4cG9ydCB7U2ltLCBGYWNpbGl0eSwgQnVmZmVyLCBTdG9yZSwgRXZlbnQsIEFSR19DSEVDS307XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0sgfSBmcm9tICcuL3NpbS5qcyc7XG5cbmNsYXNzIERhdGFTZXJpZXMge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLkNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5XID0gMC4wO1xuICAgICAgICB0aGlzLkEgPSAwLjA7XG4gICAgICAgIHRoaXMuUSA9IDAuMDtcbiAgICAgICAgdGhpcy5NYXggPSAtSW5maW5pdHk7XG4gICAgICAgIHRoaXMuTWluID0gSW5maW5pdHk7XG4gICAgICAgIHRoaXMuU3VtID0gMDtcblxuICAgICAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAzLCAzKTtcblxuICAgICAgICB0aGlzLmhMb3dlciA9IGxvd2VyO1xuICAgICAgICB0aGlzLmhVcHBlciA9IHVwcGVyO1xuICAgICAgICB0aGlzLmhCdWNrZXRTaXplID0gKHVwcGVyIC0gbG93ZXIpIC8gbmJ1Y2tldHM7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtID0gbmV3IEFycmF5KG5idWNrZXRzICsgMik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEhpc3RvZ3JhbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlzdG9ncmFtO1xuICAgIH1cblxuICAgIHJlY29yZCh2YWx1ZSwgd2VpZ2h0KSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgICAgIGNvbnN0IHcgPSAod2VpZ2h0ID09PSB1bmRlZmluZWQpID8gMSA6IHdlaWdodDtcbiAgICAgICAgLy9kb2N1bWVudC53cml0ZShcIkRhdGEgc2VyaWVzIHJlY29yZGluZyBcIiArIHZhbHVlICsgXCIgKHdlaWdodCA9IFwiICsgdyArIFwiKVxcblwiKTtcblxuICAgICAgICBpZiAodmFsdWUgPiB0aGlzLk1heCkgdGhpcy5NYXggPSB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlIDwgdGhpcy5NaW4pIHRoaXMuTWluID0gdmFsdWU7XG4gICAgICAgIHRoaXMuU3VtICs9IHZhbHVlO1xuICAgICAgICB0aGlzLkNvdW50ICsrO1xuICAgICAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IHRoaXMuaExvd2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaXN0b2dyYW1bMF0gKz0gdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID4gdGhpcy5oVXBwZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbVt0aGlzLmhpc3RvZ3JhbS5sZW5ndGggLSAxXSArPSB3O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHZhbHVlIC0gdGhpcy5oTG93ZXIpIC8gdGhpcy5oQnVja2V0U2l6ZSkgKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9ncmFtW2luZGV4XSArPSB3O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2kgPSBXaS0xICsgd2lcbiAgICAgICAgdGhpcy5XID0gdGhpcy5XICsgdztcblxuICAgICAgICBpZiAodGhpcy5XID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBaSA9IEFpLTEgKyB3aS9XaSAqICh4aSAtIEFpLTEpXG4gICAgICAgIGNvbnN0IGxhc3RBID0gdGhpcy5BO1xuICAgICAgICB0aGlzLkEgPSBsYXN0QSArICh3IC8gdGhpcy5XKSAqICh2YWx1ZSAtIGxhc3RBKTtcblxuICAgICAgICAvLyBRaSA9IFFpLTEgKyB3aSh4aSAtIEFpLTEpKHhpIC0gQWkpXG4gICAgICAgIHRoaXMuUSA9IHRoaXMuUSArIHcgKiAodmFsdWUgLSBsYXN0QSkgKiAodmFsdWUgLSB0aGlzLkEpO1xuICAgICAgICAvL3ByaW50KFwiXFx0Vz1cIiArIHRoaXMuVyArIFwiIEE9XCIgKyB0aGlzLkEgKyBcIiBRPVwiICsgdGhpcy5RICsgXCJcXG5cIik7XG4gICAgfVxuXG4gICAgY291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkNvdW50O1xuICAgIH1cblxuICAgIG1pbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTWluO1xuICAgIH1cblxuICAgIG1heCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTWF4O1xuICAgIH1cblxuICAgIHJhbmdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5NYXggLSB0aGlzLk1pbjtcbiAgICB9XG5cbiAgICBzdW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlN1bTtcbiAgICB9XG5cbiAgICBzdW1XZWlnaHRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQSAqIHRoaXMuVztcbiAgICB9XG5cbiAgICBhdmVyYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BO1xuICAgIH1cblxuICAgIHZhcmlhbmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5RIC8gdGhpcy5XO1xuICAgIH1cblxuICAgIGRldmlhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnZhcmlhbmNlKCkpO1xuICAgIH1cbn1cblxuY2xhc3MgVGltZVNlcmllcyB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLmRhdGFTZXJpZXMgPSBuZXcgRGF0YVNlcmllcyhuYW1lKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gTmFOO1xuICAgICAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSBOYU47XG4gICAgfVxuXG4gICAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMywgMyk7XG4gICAgICAgIHRoaXMuZGF0YVNlcmllcy5zZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cyk7XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9ncmFtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmdldEhpc3RvZ3JhbSgpO1xuICAgIH1cblxuICAgIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5sYXN0VGltZXN0YW1wKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlY29yZCh0aGlzLmxhc3RWYWx1ZSwgdGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZXN0YW1wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5yZWNvcmQoTmFOLCB0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmNvdW50KCk7XG4gICAgfVxuXG4gICAgbWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1pbigpO1xuICAgIH1cblxuICAgIG1heCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5tYXgoKTtcbiAgICB9XG5cbiAgICByYW5nZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5yYW5nZSgpO1xuICAgIH1cblxuICAgIHN1bSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5zdW0oKTtcbiAgICB9XG5cbiAgICBhdmVyYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmF2ZXJhZ2UoKTtcbiAgICB9XG5cbiAgICBkZXZpYXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZGV2aWF0aW9uKCk7XG4gICAgfVxuXG4gICAgdmFyaWFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMudmFyaWFuY2UoKTtcbiAgICB9XG59XG5cbmNsYXNzIFBvcHVsYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgICAgICAgdGhpcy5zaXplU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoKTtcbiAgICAgICAgdGhpcy5kdXJhdGlvblNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2l6ZVNlcmllcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gICAgfVxuXG4gICAgZW50ZXIodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIHRoaXMucG9wdWxhdGlvbiArKztcbiAgICAgICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgbGVhdmUoYXJyaXZhbEF0LCBsZWZ0QXQpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uIC0tO1xuICAgICAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgbGVmdEF0KTtcbiAgICAgICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZWNvcmQobGVmdEF0IC0gYXJyaXZhbEF0KTtcbiAgICB9XG5cbiAgICBjdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3B1bGF0aW9uO1xuICAgIH1cblxuICAgIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgICAgICB0aGlzLnNpemVTZXJpZXMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbiIsImltcG9ydCB7IFNpbSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlLCBBUkdfQ0hFQ0sgfSBmcm9tICcuL2xpYi9zaW0uanMnXG5pbXBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH0gZnJvbSAnLi9saWIvc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vbGliL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vbGliL3F1ZXVlcy5qcyc7XG5cbmV4cG9ydCB7IFNpbSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlIH07XG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XG5leHBvcnQgeyBSZXF1ZXN0IH07XG5leHBvcnQgeyBQUXVldWUsIFF1ZXVlLCBBUkdfQ0hFQ0t9OyJdfQ==
