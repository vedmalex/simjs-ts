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

},{"./sim.js":4,"./stats.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Random = function () {
    function Random() {
        var seed = arguments.length <= 0 || arguments[0] === undefined ? new Date().getTime() : arguments[0];

        _classCallCheck(this, Random);

        if (typeof seed !== 'number' // ARG_CHECK
         || Math.ceil(seed) != Math.floor(seed)) {
            // ARG_CHECK
            throw new TypeError("seed value must be an integer"); // ARG_CHECK
        } // ARG_CHECK

        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df; /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

        //this.init_genrand(seed);
        this.init_by_array([seed], 1);
    }

    _createClass(Random, [{
        key: "init_genrand",
        value: function init_genrand(s) {
            this.mt[0] = s >>> 0;
            for (this.mti = 1; this.mti < this.N; this.mti++) {
                var s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
                this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
                /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
                /* In the previous versions, MSBs of the seed affect   */
                /* only MSBs of the array mt[].                        */
                /* 2002/01/09 modified by Makoto Matsumoto             */
                this.mt[this.mti] >>>= 0;
                /* for >32 bit machines */
            }
        }
    }, {
        key: "init_by_array",
        value: function init_by_array(init_key, key_length) {
            var i = void 0,
                j = void 0,
                k = void 0;
            this.init_genrand(19650218);
            i = 1;j = 0;
            k = this.N > key_length ? this.N : key_length;
            for (; k; k--) {
                var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
                this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1664525 << 16) + (s & 0x0000ffff) * 1664525) + init_key[j] + j; /* non linear */
                this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
                i++;j++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];i = 1;
                }
                if (j >= key_length) j = 0;
            }
            for (k = this.N - 1; k; k--) {
                var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
                this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1566083941 << 16) + (s & 0x0000ffff) * 1566083941) - i; /* non linear */
                this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
                i++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];i = 1;
                }
            }

            this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
        }
    }, {
        key: "genrand_int32",
        value: function genrand_int32() {
            var y = void 0;
            var mag01 = new Array(0x0, this.MATRIX_A);
            /* mag01[x] = x * MATRIX_A  for x=0,1 */

            if (this.mti >= this.N) {
                /* generate N words at one time */
                var kk = void 0;

                if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
                    this.init_genrand(5489); /* a default initial seed is used */

                for (kk = 0; kk < this.N - this.M; kk++) {
                    y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
                    this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 0x1];
                }
                for (; kk < this.N - 1; kk++) {
                    y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
                    this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 0x1];
                }
                y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
                this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 0x1];

                this.mti = 0;
            }

            y = this.mt[this.mti++];

            /* Tempering */
            y ^= y >>> 11;
            y ^= y << 7 & 0x9d2c5680;
            y ^= y << 15 & 0xefc60000;
            y ^= y >>> 18;

            return y >>> 0;
        }
    }, {
        key: "genrand_int31",
        value: function genrand_int31() {
            return this.genrand_int32() >>> 1;
        }
    }, {
        key: "genrand_real1",
        value: function genrand_real1() {
            return this.genrand_int32() * (1.0 / 4294967295.0);
            /* divided by 2^32-1 */
        }
    }, {
        key: "random",
        value: function random() {
            if (this.pythonCompatibility) {
                if (this.skip) {
                    this.genrand_int32();
                }
                this.skip = true;
            }
            return this.genrand_int32() * (1.0 / 4294967296.0);
            /* divided by 2^32 */
        }
    }, {
        key: "genrand_real3",
        value: function genrand_real3() {
            return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
            /* divided by 2^32 */
        }
    }, {
        key: "genrand_res53",
        value: function genrand_res53() {
            var a = this.genrand_int32() >>> 5,
                b = this.genrand_int32() >>> 6;
            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        }
    }, {
        key: "exponential",
        value: function exponential(lambda) {
            if (arguments.length != 1) {
                // ARG_CHECK
                throw new SyntaxError("exponential() must  be called with 'lambda' parameter"); // ARG_CHECK
            } // ARG_CHECK

            var r = this.random();
            return -Math.log(r) / lambda;
        }
    }, {
        key: "gamma",
        value: function gamma(alpha, beta) {
            if (arguments.length != 2) {
                // ARG_CHECK
                throw new SyntaxError("gamma() must be called with alpha and beta parameters"); // ARG_CHECK
            } // ARG_CHECK

            /* Based on Python 2.6 source code of random.py.
             */

            if (alpha > 1.0) {
                var ainv = Math.sqrt(2.0 * alpha - 1.0);
                var bbb = alpha - this.LOG4;
                var ccc = alpha + ainv;

                while (true) {
                    var u1 = this.random();
                    if (u1 < 1e-7 || u > 0.9999999) {
                        continue;
                    }
                    var u2 = 1.0 - this.random();
                    var v = Math.log(u1 / (1.0 - u1)) / ainv;
                    var x = alpha * Math.exp(v);
                    var z = u1 * u1 * u2;
                    var r = bbb + ccc * v - x;
                    if (r + this.SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
                        return x * beta;
                    }
                }
            } else if (alpha == 1.0) {
                var u = this.random();
                while (u <= 1e-7) {
                    u = this.random();
                }
                return -Math.log(u) * beta;
            } else {
                while (true) {
                    var u = this.random();
                    var b = (Math.E + alpha) / Math.E;
                    var p = b * u;
                    if (p <= 1.0) {
                        var x = Math.pow(p, 1.0 / alpha);
                    } else {
                        var x = -Math.log((b - p) / alpha);
                    }
                    var u1 = this.random();
                    if (p > 1.0) {
                        if (u1 <= Math.pow(x, alpha - 1.0)) {
                            break;
                        }
                    } else if (u1 <= Math.exp(-x)) {
                        break;
                    }
                }
                return x * beta;
            }
        }
    }, {
        key: "normal",
        value: function normal(mu, sigma) {
            if (arguments.length != 2) {
                // ARG_CHECK
                throw new SyntaxError("normal() must be called with mu and sigma parameters"); // ARG_CHECK
            } // ARG_CHECK

            var z = this.lastNormal;
            this.lastNormal = NaN;
            if (!z) {
                var a = this.random() * 2 * Math.PI;
                var b = Math.sqrt(-2.0 * Math.log(1.0 - this.random()));
                z = Math.cos(a) * b;
                this.lastNormal = Math.sin(a) * b;
            }
            return mu + z * sigma;
        }
    }, {
        key: "pareto",
        value: function pareto(alpha) {
            if (arguments.length != 1) {
                // ARG_CHECK
                throw new SyntaxError("pareto() must be called with alpha parameter"); // ARG_CHECK
            } // ARG_CHECK

            var u = this.random();
            return 1.0 / Math.pow(1 - u, 1.0 / alpha);
        }
    }, {
        key: "triangular",
        value: function triangular(lower, upper, mode) {
            // http://en.wikipedia.org/wiki/Triangular_distribution
            if (arguments.length != 3) {
                // ARG_CHECK
                throw new SyntaxError("triangular() must be called with lower, upper and mode parameters"); // ARG_CHECK
            } // ARG_CHECK

            var c = (mode - lower) / (upper - lower);
            var u = this.random();

            if (u <= c) {
                return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
            } else {
                return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
            }
        }
    }, {
        key: "uniform",
        value: function uniform(lower, upper) {
            if (arguments.length != 2) {
                // ARG_CHECK
                throw new SyntaxError("uniform() must be called with lower and upper parameters"); // ARG_CHECK
            } // ARG_CHECK
            return lower + this.random() * (upper - lower);
        }
    }, {
        key: "weibull",
        value: function weibull(alpha, beta) {
            if (arguments.length != 2) {
                // ARG_CHECK
                throw new SyntaxError("weibull() must be called with alpha and beta parameters"); // ARG_CHECK
            } // ARG_CHECK
            var u = 1.0 - this.random();
            return alpha * Math.pow(-Math.log(u), 1.0 / beta);
        }
    }]);

    return Random;
}();

/* These real versions are due to Isaku Wada, 2002/01/09 added */

/**************************************************************************/


Random.prototype.LOG4 = Math.log(4.0);
Random.prototype.SG_MAGICCONST = 1.0 + Math.log(4.5);

exports.Random = Random;

},{}],3:[function(require,module,exports){
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

},{"./sim.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ARG_CHECK = exports.Entity = exports.Event = exports.Store = exports.Buffer = exports.Facility = exports.Sim = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queues = require('./queues.js');

var _stats = require('./stats.js');

var _request = require('./request.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = function () {
    function Entity(sim) {
        _classCallCheck(this, Entity);

        this.sim = sim;
        this.id = sim.entityId++;
    }

    _createClass(Entity, [{
        key: 'time',
        value: function time() {
            return this.sim.time();
        }
    }, {
        key: 'setTimer',
        value: function setTimer(duration) {
            ARG_CHECK(arguments, 1, 1);

            var ro = new _request.Request(this, this.sim.time(), this.sim.time() + duration);

            this.sim.queue.insert(ro);
            return ro;
        }
    }, {
        key: 'waitEvent',
        value: function waitEvent(event) {
            ARG_CHECK(arguments, 1, 1, Event);

            var ro = new _request.Request(this, this.sim.time(), 0);

            ro.source = event;
            event.addWaitList(ro);
            return ro;
        }
    }, {
        key: 'queueEvent',
        value: function queueEvent(event) {
            ARG_CHECK(arguments, 1, 1, Event);

            var ro = new _request.Request(this, this.sim.time(), 0);

            ro.source = event;
            event.addQueue(ro);
            return ro;
        }
    }, {
        key: 'useFacility',
        value: function useFacility(facility, duration) {
            ARG_CHECK(arguments, 2, 2, Facility);

            var ro = new _request.Request(this, this.sim.time(), 0);
            ro.source = facility;
            facility.use(duration, ro);
            return ro;
        }
    }, {
        key: 'putBuffer',
        value: function putBuffer(buffer, amount) {
            ARG_CHECK(arguments, 2, 2, Buffer);

            var ro = new _request.Request(this, this.sim.time(), 0);
            ro.source = buffer;
            buffer.put(amount, ro);
            return ro;
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer(buffer, amount) {
            ARG_CHECK(arguments, 2, 2, Buffer);

            var ro = new _request.Request(this, this.sim.time(), 0);
            ro.source = buffer;
            buffer.get(amount, ro);
            return ro;
        }
    }, {
        key: 'putStore',
        value: function putStore(store, obj) {
            ARG_CHECK(arguments, 2, 2, Store);

            var ro = new _request.Request(this, this.sim.time(), 0);
            ro.source = store;
            store.put(obj, ro);
            return ro;
        }
    }, {
        key: 'getStore',
        value: function getStore(store, filter) {
            ARG_CHECK(arguments, 1, 2, Store, Function);

            var ro = new _request.Request(this, this.sim.time(), 0);
            ro.source = store;
            store.get(filter, ro);
            return ro;
        }
    }, {
        key: 'send',
        value: function send(message, delay, entities) {
            ARG_CHECK(arguments, 2, 3);

            var ro = new _request.Request(this.sim, this.time(), this.time() + delay);
            ro.source = this;
            ro.msg = message;
            ro.data = entities;
            ro.deliver = this.sim.sendMessage;

            this.sim.queue.insert(ro);
        }
    }, {
        key: 'log',
        value: function log(message) {
            ARG_CHECK(arguments, 1, 1);

            this.sim.log(message, this);
        }
    }]);

    return Entity;
}();

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
        value: function addEntity(klass) {
            // Verify that prototype has start function
            if (!klass.prototype.start) {
                // ARG CHECK
                throw new Error('Entity class ' + klass.name + ' must have start() function defined');
            }

            var entity = new klass(this);
            this.entities.push(entity);

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            entity.start.apply(entity, args);

            return entity;
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
exports.Entity = Entity;
exports.ARG_CHECK = ARG_CHECK;

},{"./queues.js":1,"./request.js":3,"./stats.js":5}],5:[function(require,module,exports){
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

},{"./sim.js":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Random = exports.ARG_CHECK = exports.Queue = exports.PQueue = exports.Request = exports.Population = exports.TimeSeries = exports.DataSeries = exports.Store = exports.Facility = exports.Buffer = exports.Event = exports.Entity = exports.Sim = undefined;

var _sim = require('./lib/sim.js');

var _stats = require('./lib/stats.js');

var _request = require('./lib/request.js');

var _queues = require('./lib/queues.js');

var _random = require('./lib/random.js');

exports.Sim = _sim.Sim;
exports.Entity = _sim.Entity;
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
exports.Random = _random.Random;


if (window) {
  window.Sim = {
    Sim: _sim.Sim,
    Event: _sim.Event,
    Entity: _sim.Entity,
    Buffer: _sim.Buffer,
    Facility: _sim.Facility,
    Store: _sim.Store,
    DataSeries: _stats.DataSeries,
    TimeSeries: _stats.TimeSeries,
    Population: _stats.Population,
    Request: _request.Request,
    PQueue: _queues.PQueue,
    Queue: _queues.Queue,
    Random: _random.Random,
    ARG_CHECK: _sim.ARG_CHECK
  };
}

},{"./lib/queues.js":1,"./lib/random.js":2,"./lib/request.js":3,"./lib/sim.js":4,"./lib/stats.js":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3F1ZXVlcy5qcyIsInNyYy9saWIvcmFuZG9tLmpzIiwic3JjL2xpYi9yZXF1ZXN0LmpzIiwic3JjL2xpYi9zaW0uanMiLCJzcmMvbGliL3N0YXRzLmpzIiwic3JjL3NpbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQ0FBOztBQUNBOzs7O0lBRU0sSztBQUNGLG1CQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDZCxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLGFBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUssS0FBTCxHQUFhLHVCQUFiO0FBQ0g7Ozs7OEJBRUs7QUFDRixtQkFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDSDs7OytCQUVNO0FBQ0gsbUJBQVEsS0FBSyxJQUFMLENBQVUsTUFBWCxHQUFxQixLQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQTdCLENBQXJCLEdBQXVELFNBQTlEO0FBQ0g7Ozs2QkFFSSxLLEVBQU8sUyxFQUFXO0FBQ25CLGdDQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFDQSxpQkFBSyxJQUFMLENBQVUsSUFBVixDQUFlLEtBQWY7QUFDQSxpQkFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixTQUFwQjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixTQUFqQjtBQUNIOzs7Z0NBRU8sSyxFQUFPLFMsRUFBVztBQUN0QixnQ0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsS0FBbEI7QUFDQSxpQkFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixTQUF2Qjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixTQUFqQjtBQUNIOzs7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QUFPLEtBQUssVUFBWjtBQUNIOzs7aUNBRVEsUyxFQUFXO0FBQ2hCLGlCQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsU0FBekI7QUFDSDs7Ozs7O1FBR0ksVSxHQUFBLFU7UUFBWSxVLEdBQUEsVTtRQUFZLFUsR0FBQSxVOzs7Ozs7Ozs7O0FDL05qQzs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7UUFFUyxHO1FBQUssTTtRQUFRLEs7UUFBTyxNO1FBQVEsUTtRQUFVLEs7UUFDdEMsVTtRQUFZLFU7UUFBWSxVO1FBQ3hCLE87UUFDQSxNO1FBQVEsSztRQUFPLFM7UUFDZixNOzs7QUFFVCxJQUFJLE1BQUosRUFBWTtBQUNWLFNBQU8sR0FBUCxHQUFhO0FBQ1gsaUJBRFc7QUFFWCxxQkFGVztBQUdYLHVCQUhXO0FBSVgsdUJBSlc7QUFLWCwyQkFMVztBQU1YLHFCQU5XO0FBT1gsaUNBUFc7QUFRWCxpQ0FSVztBQVNYLGlDQVRXO0FBVVgsNkJBVlc7QUFXWCwwQkFYVztBQVlYLHdCQVpXO0FBYVgsMEJBYlc7QUFjWDtBQWRXLEdBQWI7QUFnQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuXG5jbGFzcyBRdWV1ZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgICAgICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgfVxuXG4gICAgdG9wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICAgIH1cblxuICAgIGJhY2soKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5kYXRhLmxlbmd0aCkgPyB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1c2godmFsdWUsIHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2godmFsdWUpO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcC5wdXNoKHRpbWVzdGFtcCk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIHVuc2hpZnQodmFsdWUsIHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcbiAgICAgICAgdGhpcy5kYXRhLnVuc2hpZnQodmFsdWUpO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcC51bnNoaWZ0KHRpbWVzdGFtcCk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIHNoaWZ0KHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5zaGlmdCgpO1xuICAgICAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAuc2hpZnQoKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwb3AodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAucG9wKCk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcGFzc2J5KHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUodGltZXN0YW1wLCB0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgICB9XG5cbiAgICByZXBvcnQoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5zdGF0cy5zaXplU2VyaWVzLmF2ZXJhZ2UoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRzLmR1cmF0aW9uU2VyaWVzLmF2ZXJhZ2UoKV07XG4gICAgfVxuXG4gICAgZW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoID09IDA7XG4gICAgfVxuXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgfVxufVxuXG5jbGFzcyBQUXVldWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy5vcmRlciA9IDA7XG4gICAgfVxuXG4gICAgZ3JlYXRlcihybzEsIHJvMikge1xuICAgICAgICBpZiAocm8xLmRlbGl2ZXJBdCA+IHJvMi5kZWxpdmVyQXQpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAocm8xLmRlbGl2ZXJBdCA9PSBybzIuZGVsaXZlckF0KVxuICAgICAgICAgICAgcmV0dXJuIHJvMS5vcmRlciA+IHJvMi5vcmRlcjtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGluc2VydChybykge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcbiAgICAgICAgcm8ub3JkZXIgPSB0aGlzLm9yZGVyICsrO1xuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKHJvKTtcblxuICAgICAgICAvLyBpbnNlcnQgaW50byBkYXRhIGF0IHRoZSBlbmRcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xuXG4gICAgICAgIC8vIGhlYXAgdXBcbiAgICAgICAgd2hpbGUgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmVhdGVyKGFbcGFyZW50SW5kZXhdLCBybykpIHtcbiAgICAgICAgICAgICAgICBhW2luZGV4XSA9IGFbcGFyZW50SW5kZXhdO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gcGFyZW50SW5kZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XG4gICAgICAgIGxldCBsZW4gPSBhLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZW4gPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0b3AgPSBhWzBdO1xuICAgICAgICAvLyBtb3ZlIHRoZSBsYXN0IG5vZGUgdXBcbiAgICAgICAgYVswXSA9IGEucG9wKCk7XG4gICAgICAgIGxlbiAtLTtcblxuICAgICAgICAvLyBoZWFwIGRvd25cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IE1hdGguZmxvb3IobGVuIC8gMikpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMTtcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDI7XG5cbiAgICAgICAgICAgIGNvbnN0IHNtYWxsZXJDaGlsZEluZGV4ID0gcmlnaHRDaGlsZEluZGV4IDwgbGVuXG4gICAgICAgICAgICAgICYmICF0aGlzLmdyZWF0ZXIoYVtyaWdodENoaWxkSW5kZXhdLCBhW2xlZnRDaGlsZEluZGV4XSlcbiAgICAgICAgICAgICAgICAgICAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3NtYWxsZXJDaGlsZEluZGV4XSwgbm9kZSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYVtpbmRleF0gPSBhW3NtYWxsZXJDaGlsZEluZGV4XTtcbiAgICAgICAgICAgIGluZGV4ID0gc21hbGxlckNoaWxkSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgYVtpbmRleF0gPSBub2RlO1xuICAgICAgICByZXR1cm4gdG9wO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVldWUsIFBRdWV1ZSB9O1xuIiwiXG5jbGFzcyBSYW5kb20ge1xuICAgIGNvbnN0cnVjdG9yKHNlZWQ9KG5ldyBEYXRlKCkpLmdldFRpbWUoKSkge1xuICAgICAgICBpZiAodHlwZW9mKHNlZWQpICE9PSAnbnVtYmVyJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB8fCBNYXRoLmNlaWwoc2VlZCkgIT0gTWF0aC5mbG9vcihzZWVkKSkgeyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlclwiKTsgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXG4gICAgICAgIC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG4gICAgICAgIHRoaXMuTiA9IDYyNDtcbiAgICAgICAgdGhpcy5NID0gMzk3O1xuICAgICAgICB0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xuICAgICAgICB0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOy8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cbiAgICAgICAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cblxuICAgICAgICB0aGlzLm10ID0gbmV3IEFycmF5KHRoaXMuTik7LyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXG4gICAgICAgIHRoaXMubXRpPXRoaXMuTisxOy8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xuXG4gICAgICAgIC8vdGhpcy5pbml0X2dlbnJhbmQoc2VlZCk7XG4gICAgICAgIHRoaXMuaW5pdF9ieV9hcnJheShbc2VlZF0sIDEpO1xuICAgIH1cblxuICAgIGluaXRfZ2VucmFuZChzKSB7XG4gICAgICAgIHRoaXMubXRbMF0gPSBzID4+PiAwO1xuICAgICAgICBmb3IgKHRoaXMubXRpPTE7IHRoaXMubXRpPHRoaXMuTjsgdGhpcy5tdGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLm10W3RoaXMubXRpLTFdIF4gKHRoaXMubXRbdGhpcy5tdGktMV0gPj4+IDMwKTtcbiAgICAgICAgICAgIHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKVxuICAgICAgICAgICAgKyB0aGlzLm10aTtcbiAgICAgICAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuICAgICAgICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG4gICAgICAgICAgICAvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xuICAgICAgICAgICAgLyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRfYnlfYXJyYXkoaW5pdF9rZXksIGtleV9sZW5ndGgpIHtcbiAgICAgICAgbGV0IGksIGosIGs7XG4gICAgICAgIHRoaXMuaW5pdF9nZW5yYW5kKDE5NjUwMjE4KTtcbiAgICAgICAgaT0xOyBqPTA7XG4gICAgICAgIGsgPSAodGhpcy5OPmtleV9sZW5ndGggPyB0aGlzLk4gOiBrZXlfbGVuZ3RoKTtcbiAgICAgICAgZm9yICg7IGs7IGstLSkge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XG4gICAgICAgICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG4gICAgICAgICAgICArIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICAgICAgICBpKys7IGorKztcbiAgICAgICAgICAgIGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cbiAgICAgICAgICAgIGlmIChqPj1rZXlfbGVuZ3RoKSBqPTA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrPXRoaXMuTi0xOyBrOyBrLS0pIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xuICAgICAgICAgICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE1NjYwODM5NDEpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxNTY2MDgzOTQxKSlcbiAgICAgICAgICAgIC0gaTsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbiAgICB9XG5cbiAgICBnZW5yYW5kX2ludDMyKCkge1xuICAgICAgICBsZXQgeTtcbiAgICAgICAgY29uc3QgbWFnMDEgPSBuZXcgQXJyYXkoMHgwLCB0aGlzLk1BVFJJWF9BKTtcbiAgICAgICAgLyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG4gICAgICAgIGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgLyogZ2VuZXJhdGUgTiB3b3JkcyBhdCBvbmUgdGltZSAqL1xuICAgICAgICAgICAgbGV0IGtrO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tdGkgPT0gdGhpcy5OKzEpICAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRfZ2VucmFuZCg1NDg5KTsgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXG5cbiAgICAgICAgICAgIGZvciAoa2s9MDtrazx0aGlzLk4tdGhpcy5NO2trKyspIHtcbiAgICAgICAgICAgICAgICB5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2srdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICg7a2s8dGhpcy5OLTE7a2srKykge1xuICAgICAgICAgICAgICAgIHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICAgICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtraysodGhpcy5NLXRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKHRoaXMubXRbdGhpcy5OLTFdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRbMF0mdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgICAgIHRoaXMubXRbdGhpcy5OLTFdID0gdGhpcy5tdFt0aGlzLk0tMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblxuICAgICAgICAgICAgdGhpcy5tdGkgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgeSA9IHRoaXMubXRbdGhpcy5tdGkrK107XG5cbiAgICAgICAgLyogVGVtcGVyaW5nICovXG4gICAgICAgIHkgXj0gKHkgPj4+IDExKTtcbiAgICAgICAgeSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XG4gICAgICAgIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcbiAgICAgICAgeSBePSAoeSA+Pj4gMTgpO1xuXG4gICAgICAgIHJldHVybiB5ID4+PiAwO1xuICAgIH1cblxuICAgIGdlbnJhbmRfaW50MzEoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCk+Pj4xKTtcbiAgICB9XG5cbiAgICBnZW5yYW5kX3JlYWwxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApO1xuICAgICAgICAvKiBkaXZpZGVkIGJ5IDJeMzItMSAqL1xuICAgIH1cblxuICAgIHJhbmRvbSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHl0aG9uQ29tcGF0aWJpbGl0eSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2tpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2VucmFuZF9pbnQzMigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuICAgICAgICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbiAgICB9XG5cbiAgICBnZW5yYW5kX3JlYWwzKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSooMS4wLzQyOTQ5NjcyOTYuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICAgIH1cblxuICAgIGdlbnJhbmRfcmVzNTMoKSB7XG4gICAgICAgIGNvbnN0IGE9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj41LCBiPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+NjtcbiAgICAgICAgcmV0dXJuKGEqNjcxMDg4NjQuMCtiKSooMS4wLzkwMDcxOTkyNTQ3NDA5OTIuMCk7XG4gICAgfVxuXG4gICAgZXhwb25lbnRpYWwobGFtYmRhKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYGV4cG9uZW50aWFsKCkgbXVzdCAgYmUgY2FsbGVkIHdpdGggJ2xhbWJkYScgcGFyYW1ldGVyYCk7IC8vIEFSR19DSEVDS1xuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICAgICAgY29uc3QgciA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiAtTWF0aC5sb2cocikgLyBsYW1iZGE7XG4gICAgfVxuXG4gICAgZ2FtbWEoYWxwaGEsIGJldGEpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgZ2FtbWEoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnNgKTsgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgICAgICAvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cbiAgICAgICAgICovXG5cbiAgICAgICAgaWYgKGFscGhhID4gMS4wKSB7XG4gICAgICAgICAgICBjb25zdCBhaW52ID0gTWF0aC5zcXJ0KDIuMCAqIGFscGhhIC0gMS4wKTtcbiAgICAgICAgICAgIGNvbnN0IGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuICAgICAgICAgICAgY29uc3QgY2NjID0gYWxwaGEgKyBhaW52O1xuXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgaWYgKCh1MSA8IDFlLTcpIHx8ICh1ID4gMC45OTk5OTk5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBNYXRoLmxvZyh1MSAvICgxLjAgLSB1MSkpIC8gYWludjtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGFscGhhICogTWF0aC5leHAodik7XG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IHUxICogdTEgKiB1MjtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYmJiICsgY2NjICogdiAtIHg7XG4gICAgICAgICAgICAgICAgaWYgKChyICsgdGhpcy5TR19NQUdJQ0NPTlNUIC0gNC41ICogeiA+PSAwLjApIHx8IChyID49IE1hdGgubG9nKHopKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCAqIGJldGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFscGhhID09IDEuMCkge1xuICAgICAgICAgICAgdmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICAgICAgd2hpbGUgKHUgPD0gMWUtNykge1xuICAgICAgICAgICAgICAgIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0gTWF0aC5sb2codSkgKiBiZXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IChNYXRoLkUgKyBhbHBoYSkgLyBNYXRoLkU7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IGIgKiB1O1xuICAgICAgICAgICAgICAgIGlmIChwIDw9IDEuMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IC0gTWF0aC5sb2coKGIgLSBwKSAvIGFscGhhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHUxID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBpZiAocCA+IDEuMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHggKiBiZXRhO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBub3JtYWwobXUsIHNpZ21hKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBub3JtYWwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzYCk7ICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICAgICAgbGV0IHogPSB0aGlzLmxhc3ROb3JtYWw7XG4gICAgICAgIHRoaXMubGFzdE5vcm1hbCA9IE5hTjtcbiAgICAgICAgaWYgKCF6KSB7XG4gICAgICAgICAgICBjb25zdCBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgY29uc3QgYiA9IE1hdGguc3FydCgtMi4wICogTWF0aC5sb2coMS4wIC0gdGhpcy5yYW5kb20oKSkpO1xuICAgICAgICAgICAgeiA9IE1hdGguY29zKGEpICogYjtcbiAgICAgICAgICAgIHRoaXMubGFzdE5vcm1hbCA9IE1hdGguc2luKGEpICogYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXUgKyB6ICogc2lnbWE7XG4gICAgfVxuXG4gICAgcGFyZXRvKGFscGhhKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYHBhcmV0bygpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgcGFyYW1ldGVyYCk7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICAgICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XG4gICAgfVxuXG4gICAgdHJpYW5ndWxhcihsb3dlciwgdXBwZXIsIG1vZGUpIHtcbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGB0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVyc2ApOyAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgICAgIGNvbnN0IGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcbiAgICAgICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgaWYgKHUgPD0gYykge1xuICAgICAgICAgICAgcmV0dXJuIGxvd2VyICsgTWF0aC5zcXJ0KHUgKiAodXBwZXIgLSBsb3dlcikgKiAobW9kZSAtIGxvd2VyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuaWZvcm0obG93ZXIsIHVwcGVyKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYHVuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzYCk7ICAgIC8vIEFSR19DSEVDS1xuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XG4gICAgfVxuXG4gICAgd2VpYnVsbChhbHBoYSwgYmV0YSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGB3ZWlidWxsKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzYCk7ICAgIC8vIEFSR19DSEVDS1xuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIGNvbnN0IHUgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICByZXR1cm4gYWxwaGEgKiBNYXRoLnBvdygtTWF0aC5sb2codSksIDEuMCAvIGJldGEpO1xuICAgIH1cbn1cblxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcblxuZXhwb3J0IHsgUmFuZG9tIH07XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgICBjb25zdHJ1Y3RvcihlbnRpdHksIGN1cnJlbnRUaW1lLCBkZWxpdmVyQXQpIHtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXQgPSBjdXJyZW50VGltZTtcbiAgICAgICAgdGhpcy5kZWxpdmVyQXQgPSBkZWxpdmVyQXQ7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwWzBdICE9IHRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0+IHRoaXMgaXMgbWFpbiByZXF1ZXN0XG4gICAgICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgICAgICAvLyBpZiBhbHJlYWR5IGNhbmNlbGxlZCwgZG8gbm90aGluZ1xuICAgICAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVsaXZlckF0ID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc1B1dFF1ZXVlLmNhbGwodGhpcy5zb3VyY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzR2V0UXVldWUuY2FsbCh0aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb25lKGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAzLCBGdW5jdGlvbiwgT2JqZWN0KTtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2FpdFVudGlsKGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCwgdW5kZWZpbmVkLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICAgICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdCh0aGlzLnNjaGVkdWxlZEF0ICsgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgIHRoaXMuZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDQsIHVuZGVmaW5lZCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICAgICAgcm8ubXNnID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgICAgIHZhciBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgICAgICAgICAgICByby5tc2cgPSBldmVudFtpXTtcbiAgICAgICAgICAgICAgICBldmVudFtpXS5hZGRXYWl0TGlzdChybyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXREYXRhKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsaXZlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIGlmICghdGhpcy5jYWxsYmFja3MpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwWzBdLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNhbmNlbFJlbmVnZUNsYXVzZXMoKSB7XG4gICAgICAgIC8vdGhpcy5jYW5jZWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vdGhpcy53YWl0VW50aWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vdGhpcy51bmxlc3NFdmVudCA9IHRoaXMuTnVsbDtcbiAgICAgICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XG5cbiAgICAgICAgaWYgKCF0aGlzLmdyb3VwIHx8IHRoaXMuZ3JvdXBbMF0gIT0gdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgTnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSxcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEF0LFxuICAgICAgICAgICAgICAgIGRlbGl2ZXJBdCk7XG5cbiAgICAgICAgcm8uY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuXG4gICAgICAgIGlmICh0aGlzLmdyb3VwID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwID0gW3RoaXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncm91cC5wdXNoKHJvKTtcbiAgICAgICAgcm8uZ3JvdXAgPSB0aGlzLmdyb3VwO1xuICAgICAgICByZXR1cm4gcm87XG4gICAgfVxuXG4gICAgX2RvQ2FsbGJhY2soc291cmNlLCBtc2csIGRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMuY2FsbGJhY2tzW2ldWzFdO1xuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gdGhpcy5lbnRpdHk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFyZ3VtZW50ID0gdGhpcy5jYWxsYmFja3NbaV1bMl07XG5cbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG1zZztcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gZGF0YTtcblxuICAgICAgICAgICAgaWYgKCFhcmd1bWVudCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUmVxdWVzdCB9O1xuIiwiaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vcXVldWVzLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuXG5cbmNsYXNzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKHNpbSkge1xuICAgIHRoaXMuc2ltID0gc2ltO1xuICAgIHRoaXMuaWQgPSBzaW0uZW50aXR5SWQrKztcbiAgfVxuXG4gIHRpbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW0udGltZSgpO1xuICB9XG5cbiAgc2V0VGltZXIoZHVyYXRpb24pIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCksXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcblxuICAgICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybiBybztcbiAgfVxuXG4gIHdhaXRFdmVudChldmVudCkge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICAgIHJvLnNvdXJjZSA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcXVldWVFdmVudChldmVudCkge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICAgIHJvLnNvdXJjZSA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkUXVldWUocm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgdXNlRmFjaWxpdHkoZmFjaWxpdHksIGR1cmF0aW9uKSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBGYWNpbGl0eSk7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgIHJvLnNvdXJjZSA9IGZhY2lsaXR5O1xuICAgICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XG4gICAgICByZXR1cm4gcm87XG4gIH1cblxuICBwdXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICAgIGJ1ZmZlci5wdXQoYW1vdW50LCBybyk7XG4gICAgICByZXR1cm4gcm87XG4gIH1cblxuICBnZXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICAgIGJ1ZmZlci5nZXQoYW1vdW50LCBybyk7XG4gICAgICByZXR1cm4gcm87XG4gIH1cblxuICBwdXRTdG9yZShzdG9yZSwgb2JqKSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBTdG9yZSk7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xuICAgICAgc3RvcmUucHV0KG9iaiwgcm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgZ2V0U3RvcmUoc3RvcmUsIGZpbHRlcikge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMiwgU3RvcmUsIEZ1bmN0aW9uKTtcblxuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgICBzdG9yZS5nZXQoZmlsdGVyLCBybyk7XG4gICAgICByZXR1cm4gcm87XG4gIH1cblxuICBzZW5kKG1lc3NhZ2UsIGRlbGF5LCBlbnRpdGllcykge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcy5zaW0sIHRoaXMudGltZSgpLCB0aGlzLnRpbWUoKSArIGRlbGF5KTtcbiAgICAgIHJvLnNvdXJjZSA9IHRoaXM7XG4gICAgICByby5tc2cgPSBtZXNzYWdlO1xuICAgICAgcm8uZGF0YSA9IGVudGl0aWVzO1xuICAgICAgcm8uZGVsaXZlciA9IHRoaXMuc2ltLnNlbmRNZXNzYWdlO1xuXG4gICAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICB0aGlzLnNpbS5sb2cobWVzc2FnZSwgdGhpcyk7XG4gIH1cbn1cblxuY2xhc3MgU2ltIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zaW1UaW1lID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXVlID0gbmV3IFBRdWV1ZSgpO1xuICAgICAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLmVudGl0eUlkID0gMTtcbiAgICB9XG5cbiAgICB0aW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1UaW1lO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKCkge1xuICAgICAgICBjb25zdCBzZW5kZXIgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubXNnO1xuICAgICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3Qgc2ltID0gc2VuZGVyLnNpbTtcblxuICAgICAgICBpZiAoIWVudGl0aWVzKSB7XG4gICAgICAgICAgICAvLyBzZW5kIHRvIGFsbCBlbnRpdGllc1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNpbS5lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRpdHkgPSBzaW0uZW50aXRpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZS5jYWxsKGVudGl0eSwgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlbnRpdGllcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZS5jYWxsKGVudGl0eSwgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBlbnRpdGllcyAub25NZXNzYWdlLmNhbGwoZW50aXRpZXMsIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRFbnRpdHkoa2xhc3MsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgcHJvdG90eXBlIGhhcyBzdGFydCBmdW5jdGlvblxuICAgICAgICBpZiAoIWtsYXNzLnByb3RvdHlwZS5zdGFydCkgeyAgLy8gQVJHIENIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSBjbGFzcyAke2tsYXNzLm5hbWV9IG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbnRpdHkgPSBuZXcga2xhc3ModGhpcyk7XG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuXG4gICAgICAgIGVudGl0eS5zdGFydCguLi5hcmdzKTtcblxuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cblxuICAgIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xuICAgICAgICAvL0FSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuICAgICAgICBpZiAoIW1heEV2ZW50cykge21heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cbiAgICAgICAgbGV0IGV2ZW50cyA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGV2ZW50cyArKztcbiAgICAgICAgICAgIGlmIChldmVudHMgPiBtYXhFdmVudHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBlYXJsaWVzdCBldmVudFxuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBldmVudHMsIHdlIGFyZSBkb25lIHdpdGggc2ltdWxhdGlvbiBoZXJlLlxuICAgICAgICAgICAgaWYgKHJvID09IHVuZGVmaW5lZCkgYnJlYWs7XG5cblxuICAgICAgICAgICAgLy8gVWggb2guLiB3ZSBhcmUgb3V0IG9mIHRpbWUgbm93XG4gICAgICAgICAgICBpZiAocm8uZGVsaXZlckF0ID4gZW5kVGltZSkgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIEFkdmFuY2Ugc2ltdWxhdGlvbiB0aW1lXG4gICAgICAgICAgICB0aGlzLnNpbVRpbWUgPSAgcm8uZGVsaXZlckF0O1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGV2ZW50IGlzIGFscmVhZHkgY2FuY2VsbGVkLCBpZ25vcmVcbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICByby5kZWxpdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0ZXAoKSB7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoIXJvKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNpbVRpbWUgPSByby5kZWxpdmVyQXQ7XG4gICAgICAgICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJvLmRlbGl2ZXIoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZpbmFsaXplKCkge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2dnZXIobG9nZ2VyKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgfVxuXG4gICAgbG9nKG1lc3NhZ2UsIGVudGl0eSkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgICAgICBpZiAoIXRoaXMubG9nZ2VyKSByZXR1cm47XG4gICAgICAgIGxldCBlbnRpdHlNc2cgPSBcIlwiO1xuICAgICAgICBpZiAoZW50aXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChlbnRpdHkubmFtZSkge1xuICAgICAgICAgICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5Lm5hbWV9XWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihgJHt0aGlzLnNpbVRpbWUudG9GaXhlZCg2KX0ke2VudGl0eU1zZ30gICAke21lc3NhZ2V9YCk7XG4gICAgfVxufVxuXG5jbGFzcyBGYWNpbGl0eSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGlzY2lwbGluZSwgc2VydmVycywgbWF4cWxlbikge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0KTtcblxuICAgICAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgICAgIHRoaXMuc2VydmVycyA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcbiAgICAgICAgdGhpcy5tYXhxbGVuID0gKG1heHFsZW4gPT09IHVuZGVmaW5lZCkgPyAtMSA6IDEgKiBtYXhxbGVuO1xuXG4gICAgICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgICAgIGNhc2UgRmFjaWxpdHkuTENGUzpcbiAgICAgICAgICAgIHRoaXMudXNlID0gdGhpcy51c2VMQ0ZTO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRmFjaWxpdHkuUFM6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZztcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlRkNGUztcbiAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnMgPSBuZXcgQXJyYXkodGhpcy5zZXJ2ZXJzKTtcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgICAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICBzeXN0ZW1TdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHM7XG4gICAgfVxuXG4gICAgcXVldWVTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gICAgfVxuXG4gICAgdXNhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1c3lEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgICAgICB0aGlzLnF1ZXVlLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgICAgIGlmICggKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgICAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgICAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShub3cpO1xuICAgIH1cblxuICAgIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7IC8vIFRPRE9cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZyZWVTZXJ2ZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mcmVlIC0tO1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gcm8uZHVyYXRpb247XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBhbGwgb3RoZXIgcmVuZWdpbmcgcmVxdWVzdHNcbiAgICAgICAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcblxuICAgICAgICAgICAgY29uc3QgbmV3cm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aW1lc3RhbXAsIHRpbWVzdGFtcCArIHJvLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIG5ld3JvLmRvbmUodGhpcy51c2VGQ0ZTQ2FsbGJhY2ssIHRoaXMsIHJvKTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXNlRkNGU0NhbGxiYWNrKHJvKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgb25lIG1vcmUgZnJlZSBzZXJ2ZXJcbiAgICAgICAgdGhpcy5mcmVlICsrO1xuICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIHNvbWVvbmUgd2FpdGluZywgc2NoZWR1bGUgaXQgbm93XG4gICAgICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXG4gICAgICAgIHJvLmRlbGl2ZXIoKTtcblxuICAgIH1cblxuICAgIHVzZUxDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSTykge1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkgLSB0aGlzLmN1cnJlbnRSTy5sYXN0SXNzdWVkKTtcbiAgICAgICAgICAgIC8vIGNhbGN1YXRlIHRoZSByZW1haW5pbmcgdGltZVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Uk8ucmVtYWluaW5nID1cbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgICAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cbiAgICAgICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8ubGFzdElzc3VlZCA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgfVxuXG4gICAgdXNlTENGU0NhbGxiYWNrKCkge1xuICAgICAgICBjb25zdCBybyA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGZhY2lsaXR5ID0gcm8uc291cmNlO1xuXG4gICAgICAgIGlmIChybyAhPSBmYWNpbGl0eS5jdXJyZW50Uk8pIHJldHVybjtcbiAgICAgICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcblxuICAgICAgICAvLyBzdGF0c1xuICAgICAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHJvLmVudGl0eS50aW1lKCkgLSByby5sYXN0SXNzdWVkKTtcbiAgICAgICAgZmFjaWxpdHkuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XG4gICAgICAgIHJvLmRlbGl2ZXIgPSByby5zYXZlZF9kZWxpdmVyO1xuICAgICAgICBkZWxldGUgcm8uc2F2ZWRfZGVsaXZlcjtcbiAgICAgICAgcm8uZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgICAgICBpZiAoIWZhY2lsaXR5LnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGZhY2lsaXR5LnF1ZXVlLnBvcChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmcoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIG51bGwsIFJlcXVlc3QpO1xuICAgICAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgICB9XG5cbiAgICB1c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIGlzQWRkZWQpIHtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XG4gICAgICAgIGNvbnN0IG5ld1F1ZXVlID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcbiAgICAgICAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcbiAgICAgICAgICAgIG5ld2V2LnJvID0gZXYucm87XG4gICAgICAgICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgICAgICAgIGV2LmNhbmNlbCgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcbiAgICAgICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyByby5kdXJhdGlvbiAqIChzaXplICsgMSkpO1xuICAgICAgICAgICAgbmV3ZXYucm8gPSBybztcbiAgICAgICAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICAgICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICAgICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ld1F1ZXVlO1xuXG4gICAgICAgIC8vIHVzYWdlIHN0YXRpc3RpY3NcbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IChjdXJyZW50IC0gdGhpcy5sYXN0SXNzdWVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICAgICAgY29uc3QgZXYgPSB0aGlzO1xuICAgICAgICBjb25zdCBmYWMgPSBldi5zb3VyY2U7XG5cbiAgICAgICAgaWYgKGV2LmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBmYWMuc3RhdHMubGVhdmUoZXYucm8uc2NoZWR1bGVkQXQsIGV2LnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIGZhYy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUoZXYucm8sIGZhbHNlKTtcbiAgICAgICAgZXYucm8uZGVsaXZlcigpO1xuICAgIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gKGluaXRpYWwgPT09IHVuZGVmaW5lZCkgPyAwIDogaW5pdGlhbDtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgfVxuXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlO1xuICAgIH1cblxuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xuICAgIH1cblxuICAgIGdldChhbW91bnQsIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiBhbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC09IGFtb3VudDtcblxuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcHV0KGFtb3VudCwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIChhbW91bnQgKyB0aGlzLmF2YWlsYWJsZSkgPD0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgKz0gYW1vdW50O1xuXG4gICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgICAgIGxldCBvYmo7XG4gICAgICAgIHdoaWxlIChvYmogPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgaWYgKG9iai5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcbiAgICAgICAgICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgICAgICBsZXQgb2JqO1xuICAgICAgICB3aGlsZSAob2JqID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSArPSBvYmouYW1vdW50O1xuICAgICAgICAgICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dFN0YXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgICB9XG5cbiAgICBnZXRTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gICAgfVxufVxuXG5jbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY2FwYWNpdHkpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgfVxuXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cy5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gICAgfVxuXG4gICAgZ2V0KGZpbHRlciwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IG9iajtcbiAgICAgICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgY29kZSBvdXRcbiAgICAgICAgICAgIC8vIGl0IGlzIHJlcGVhdGVkIGluIHByb2dyZXNzR2V0UXVldWVcbiAgICAgICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgICAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcm8uZmlsdGVyID0gZmlsdGVyO1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHB1dChvYmosIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLnB1dFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSArKztcblxuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICAgICAgdGhpcy5wdXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iaik7XG5cbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByby5vYmogPSBvYmo7XG4gICAgICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICAgICAgbGV0IHJvO1xuICAgICAgICB3aGlsZSAocm8gPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHJvLmZpbHRlcjtcbiAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICAgICAgICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb2dyZXNzUHV0UXVldWUoKSB7XG4gICAgICAgIGxldCBybztcbiAgICAgICAgd2hpbGUgKHJvID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gocm8ub2JqKTtcbiAgICAgICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dFN0YXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgICB9XG5cbiAgICBnZXRTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gICAgfVxufVxuXG5jbGFzcyBFdmVudCB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkV2FpdExpc3Qocm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndhaXRMaXN0LnB1c2gocm8pO1xuICAgIH1cblxuICAgIGFkZFF1ZXVlKHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvKTtcbiAgICB9XG5cbiAgICBmaXJlKGtlZXBGaXJlZCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICBpZiAoa2VlcEZpcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcbiAgICAgICAgY29uc3QgdG1wTGlzdCA9IHRoaXMud2FpdExpc3Q7XG4gICAgICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBMaXN0Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBvbmUgcXVldWVkIGVudGl0eVxuICAgICAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKGx1Y2t5KSB7XG4gICAgICAgICAgICBsdWNreS5kZWxpdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIEFSR19DSEVDSyhmb3VuZCwgZXhwTWluLCBleHBNYXgpIHtcblx0aWYgKGZvdW5kLmxlbmd0aCA8IGV4cE1pbiB8fCBmb3VuZC5sZW5ndGggPiBleHBNYXgpIHsgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTsgICAvLyBBUkdfQ0hFQ0tcblx0fSAgIC8vIEFSR19DSEVDS1xuXG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykgeyAgIC8vIEFSR19DSEVDS1xuXHRcdGlmICghYXJndW1lbnRzW2kgKyAzXSB8fCAhZm91bmRbaV0pIGNvbnRpbnVlOyAgIC8vIEFSR19DSEVDS1xuXG4vL1x0XHRwcmludChcIlRFU1QgXCIgKyBmb3VuZFtpXSArIFwiIFwiICsgYXJndW1lbnRzW2kgKyAzXSAgIC8vIEFSR19DSEVDS1xuLy9cdFx0KyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIEV2ZW50KSAgIC8vIEFSR19DSEVDS1xuLy9cdFx0KyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pICAgLy8gQVJHX0NIRUNLXG4vL1x0XHQrIFwiXFxuXCIpOyAgIC8vIEFSRyBDSEVDS1xuXG5cblx0XHRpZiAoISAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSkgeyAgIC8vIEFSR19DSEVDS1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gQVJHX0NIRUNLXG5cdFx0fSAgIC8vIEFSR19DSEVDS1xuXHR9ICAgLy8gQVJHX0NIRUNLXG59ICAgLy8gQVJHX0NIRUNLXG5cbmV4cG9ydCB7U2ltLCBGYWNpbGl0eSwgQnVmZmVyLCBTdG9yZSwgRXZlbnQsIEVudGl0eSwgQVJHX0NIRUNLfTtcbiIsImltcG9ydCB7IEFSR19DSEVDSyB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgRGF0YVNlcmllcyB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuQ291bnQgPSAwO1xuICAgICAgICB0aGlzLlcgPSAwLjA7XG4gICAgICAgIHRoaXMuQSA9IDAuMDtcbiAgICAgICAgdGhpcy5RID0gMC4wO1xuICAgICAgICB0aGlzLk1heCA9IC1JbmZpbml0eTtcbiAgICAgICAgdGhpcy5NaW4gPSBJbmZpbml0eTtcbiAgICAgICAgdGhpcy5TdW0gPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmhpc3RvZ3JhbSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDMsIDMpO1xuXG4gICAgICAgIHRoaXMuaExvd2VyID0gbG93ZXI7XG4gICAgICAgIHRoaXMuaFVwcGVyID0gdXBwZXI7XG4gICAgICAgIHRoaXMuaEJ1Y2tldFNpemUgPSAodXBwZXIgLSBsb3dlcikgLyBuYnVja2V0cztcbiAgICAgICAgdGhpcy5oaXN0b2dyYW0gPSBuZXcgQXJyYXkobmJ1Y2tldHMgKyAyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9ncmFtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXN0b2dyYW07XG4gICAgfVxuXG4gICAgcmVjb3JkKHZhbHVlLCB3ZWlnaHQpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMik7XG5cbiAgICAgICAgY29uc3QgdyA9ICh3ZWlnaHQgPT09IHVuZGVmaW5lZCkgPyAxIDogd2VpZ2h0O1xuICAgICAgICAvL2RvY3VtZW50LndyaXRlKFwiRGF0YSBzZXJpZXMgcmVjb3JkaW5nIFwiICsgdmFsdWUgKyBcIiAod2VpZ2h0ID0gXCIgKyB3ICsgXCIpXFxuXCIpO1xuXG4gICAgICAgIGlmICh2YWx1ZSA+IHRoaXMuTWF4KSB0aGlzLk1heCA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPCB0aGlzLk1pbikgdGhpcy5NaW4gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5TdW0gKz0gdmFsdWU7XG4gICAgICAgIHRoaXMuQ291bnQgKys7XG4gICAgICAgIGlmICh0aGlzLmhpc3RvZ3JhbSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIDwgdGhpcy5oTG93ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbVswXSArPSB3O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPiB0aGlzLmhVcHBlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9ncmFtW3RoaXMuaGlzdG9ncmFtLmxlbmd0aCAtIDFdICs9IHc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigodmFsdWUgLSB0aGlzLmhMb3dlcikgLyB0aGlzLmhCdWNrZXRTaXplKSArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5oaXN0b2dyYW1baW5kZXhdICs9IHc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaSA9IFdpLTEgKyB3aVxuICAgICAgICB0aGlzLlcgPSB0aGlzLlcgKyB3O1xuXG4gICAgICAgIGlmICh0aGlzLlcgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFpID0gQWktMSArIHdpL1dpICogKHhpIC0gQWktMSlcbiAgICAgICAgY29uc3QgbGFzdEEgPSB0aGlzLkE7XG4gICAgICAgIHRoaXMuQSA9IGxhc3RBICsgKHcgLyB0aGlzLlcpICogKHZhbHVlIC0gbGFzdEEpO1xuXG4gICAgICAgIC8vIFFpID0gUWktMSArIHdpKHhpIC0gQWktMSkoeGkgLSBBaSlcbiAgICAgICAgdGhpcy5RID0gdGhpcy5RICsgdyAqICh2YWx1ZSAtIGxhc3RBKSAqICh2YWx1ZSAtIHRoaXMuQSk7XG4gICAgICAgIC8vcHJpbnQoXCJcXHRXPVwiICsgdGhpcy5XICsgXCIgQT1cIiArIHRoaXMuQSArIFwiIFE9XCIgKyB0aGlzLlEgKyBcIlxcblwiKTtcbiAgICB9XG5cbiAgICBjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ291bnQ7XG4gICAgfVxuXG4gICAgbWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5NaW47XG4gICAgfVxuXG4gICAgbWF4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5NYXg7XG4gICAgfVxuXG4gICAgcmFuZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk1heCAtIHRoaXMuTWluO1xuICAgIH1cblxuICAgIHN1bSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuU3VtO1xuICAgIH1cblxuICAgIHN1bVdlaWdodGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5BICogdGhpcy5XO1xuICAgIH1cblxuICAgIGF2ZXJhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkE7XG4gICAgfVxuXG4gICAgdmFyaWFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlEgLyB0aGlzLlc7XG4gICAgfVxuXG4gICAgZGV2aWF0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMudmFyaWFuY2UoKSk7XG4gICAgfVxufVxuXG5jbGFzcyBUaW1lU2VyaWVzIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMuZGF0YVNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKG5hbWUpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmRhdGFTZXJpZXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSBOYU47XG4gICAgICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IE5hTjtcbiAgICB9XG5cbiAgICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAzLCAzKTtcbiAgICAgICAgdGhpcy5kYXRhU2VyaWVzLnNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKTtcbiAgICB9XG5cbiAgICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZ2V0SGlzdG9ncmFtKCk7XG4gICAgfVxuXG4gICAgcmVjb3JkKHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKCFpc05hTih0aGlzLmxhc3RUaW1lc3RhbXApKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJpZXMucmVjb3JkKHRoaXMubGFzdFZhbHVlLCB0aW1lc3RhbXAgLSB0aGlzLmxhc3RUaW1lc3RhbXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5sYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cblxuICAgIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICB0aGlzLnJlY29yZChOYU4sIHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgY291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuY291bnQoKTtcbiAgICB9XG5cbiAgICBtaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWluKCk7XG4gICAgfVxuXG4gICAgbWF4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1heCgpO1xuICAgIH1cblxuICAgIHJhbmdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnJhbmdlKCk7XG4gICAgfVxuXG4gICAgc3VtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnN1bSgpO1xuICAgIH1cblxuICAgIGF2ZXJhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuYXZlcmFnZSgpO1xuICAgIH1cblxuICAgIGRldmlhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5kZXZpYXRpb24oKTtcbiAgICB9XG5cbiAgICB2YXJpYW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy52YXJpYW5jZSgpO1xuICAgIH1cbn1cblxuY2xhc3MgUG9wdWxhdGlvbiB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICAgICAgICB0aGlzLnNpemVTZXJpZXMgPSBuZXcgVGltZVNlcmllcygpO1xuICAgICAgICB0aGlzLmR1cmF0aW9uU2VyaWVzID0gbmV3IERhdGFTZXJpZXMoKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zaXplU2VyaWVzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgICB9XG5cbiAgICBlbnRlcih0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uICsrO1xuICAgICAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBsZWF2ZShhcnJpdmFsQXQsIGxlZnRBdCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRpb24gLS07XG4gICAgICAgIHRoaXMuc2l6ZVNlcmllcy5yZWNvcmQodGhpcy5wb3B1bGF0aW9uLCBsZWZ0QXQpO1xuICAgICAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlY29yZChsZWZ0QXQgLSBhcnJpdmFsQXQpO1xuICAgIH1cblxuICAgIGN1cnJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcHVsYXRpb247XG4gICAgfVxuXG4gICAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgICAgIHRoaXMuc2l6ZVNlcmllcy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuIiwiaW1wb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSwgQVJHX0NIRUNLIH0gZnJvbSAnLi9saWIvc2ltLmpzJ1xuaW1wb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9IGZyb20gJy4vbGliL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL2xpYi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL2xpYi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi9saWIvcmFuZG9tLmpzJztcblxuZXhwb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSB9O1xuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuZXhwb3J0IHsgUmVxdWVzdCB9O1xuZXhwb3J0IHsgUFF1ZXVlLCBRdWV1ZSwgQVJHX0NIRUNLfTtcbmV4cG9ydCB7IFJhbmRvbSB9O1xuXG5pZiAod2luZG93KSB7XG4gIHdpbmRvdy5TaW0gPSB7XG4gICAgU2ltOiBTaW0sXG4gICAgRXZlbnQ6IEV2ZW50LFxuICAgIEVudGl0eTogRW50aXR5LFxuICAgIEJ1ZmZlcjogQnVmZmVyLFxuICAgIEZhY2lsaXR5OiBGYWNpbGl0eSxcbiAgICBTdG9yZTogU3RvcmUsXG4gICAgRGF0YVNlcmllczogRGF0YVNlcmllcyxcbiAgICBUaW1lU2VyaWVzOiBUaW1lU2VyaWVzLFxuICAgIFBvcHVsYXRpb246IFBvcHVsYXRpb24sXG4gICAgUmVxdWVzdDogUmVxdWVzdCxcbiAgICBQUXVldWU6IFBRdWV1ZSxcbiAgICBRdWV1ZTogUXVldWUsXG4gICAgUmFuZG9tOiBSYW5kb20sXG4gICAgQVJHX0NIRUNLOiBBUkdfQ0hFQ0tcbiAgfTtcbn1cbiJdfQ==
