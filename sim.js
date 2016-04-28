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
exports.Random = exports.ARG_CHECK = exports.Queue = exports.PQueue = exports.Request = exports.Population = exports.TimeSeries = exports.DataSeries = exports.Store = exports.Facility = exports.Buffer = exports.Event = exports.Sim = undefined;

var _sim = require('./lib/sim.js');

var _stats = require('./lib/stats.js');

var _request = require('./lib/request.js');

var _queues = require('./lib/queues.js');

var _random = require('./lib/random.js');

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
exports.Random = _random.Random;


if (window) {
  window.Sim = {
    Sim: _sim.Sim,
    Event: _sim.Event,
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

},{"./lib/queues.js":1,"./lib/random.js":2,"./lib/request.js":3,"./lib/sim.js":4,"./lib/stats.js":5}]},{},[6]);
