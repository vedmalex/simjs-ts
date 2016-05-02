(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model(name) {
    _classCallCheck(this, Model);

    this.id = this.constructor._nextId();
    this.name = name || this.constructor.name + " " + this.id;
  }

  _createClass(Model, null, [{
    key: "_nextId",
    value: function _nextId() {
      this._count = this.count + 1;
      return this._count;
    }
  }, {
    key: "count",
    get: function get() {
      return !this._count ? 0 : this._count;
    }
  }]);

  return Model;
}();

exports.Model = Model;
exports.default = Model;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PQueue = exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sim = require('./sim.js');

var _stats = require('./stats.js');

var _model = require('./model.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Queue = function (_Model) {
    _inherits(Queue, _Model);

    function Queue(name) {
        _classCallCheck(this, Queue);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Queue).call(this, name));

        _this.data = [];
        _this.timestamp = [];
        _this.stats = new _stats.Population();
        return _this;
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
}(_model.Model);

var PQueue = function (_Model2) {
    _inherits(PQueue, _Model2);

    function PQueue(name) {
        _classCallCheck(this, PQueue);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PQueue).call(this, name));

        _this2.data = [];
        _this2.order = 0;
        return _this2;
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
}(_model.Model);

exports.Queue = Queue;
exports.PQueue = PQueue;

},{"./model.js":1,"./sim.js":5,"./stats.js":6}],3:[function(require,module,exports){
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
exports.default = Random;

},{}],4:[function(require,module,exports){
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

},{"./sim.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ARG_CHECK = exports.Entity = exports.Event = exports.Store = exports.Buffer = exports.Facility = exports.Sim = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queues = require('./queues.js');

var _stats = require('./stats.js');

var _request = require('./request.js');

var _model = require('./model.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = function (_Model) {
    _inherits(Entity, _Model);

    function Entity(sim, name) {
        _classCallCheck(this, Entity);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Entity).call(this, name));

        _this.sim = sim;
        return _this;
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
}(_model.Model);

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
        value: function addEntity(klass, name) {
            // Verify that prototype has start function
            if (!klass.prototype.start) {
                // ARG CHECK
                throw new Error('Entity class ' + klass.name + ' must have start() function defined');
            }

            var entity = new klass(this, name);
            this.entities.push(entity);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
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

var Facility = function (_Model2) {
    _inherits(Facility, _Model2);

    function Facility(name, discipline, servers, maxqlen) {
        _classCallCheck(this, Facility);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Facility).call(this, name));

        ARG_CHECK(arguments, 1, 4);

        _this2.free = servers ? servers : 1;
        _this2.servers = servers ? servers : 1;
        _this2.maxqlen = maxqlen === undefined ? -1 : 1 * maxqlen;

        switch (discipline) {

            case Facility.LCFS:
                _this2.use = _this2.useLCFS;
                _this2.queue = new _queues.Queue();
                break;
            case Facility.PS:
                _this2.use = _this2.useProcessorSharing;
                _this2.queue = [];
                break;
            case Facility.FCFS:
            default:
                _this2.use = _this2.useFCFS;
                _this2.freeServers = new Array(_this2.servers);
                _this2.queue = new _queues.Queue();
                for (var i = 0; i < _this2.freeServers.length; i++) {
                    _this2.freeServers[i] = true;
                }
        }

        _this2.stats = new _stats.Population();
        _this2.busyDuration = 0;
        return _this2;
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
}(_model.Model);

Facility.FCFS = 1;
Facility.LCFS = 2;
Facility.PS = 3;
Facility.NumDisciplines = 4;

var Buffer = function (_Model3) {
    _inherits(Buffer, _Model3);

    function Buffer(name, capacity, initial) {
        _classCallCheck(this, Buffer);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Buffer).call(this, name));

        ARG_CHECK(arguments, 2, 3);

        _this3.capacity = capacity;
        _this3.available = initial === undefined ? 0 : initial;
        _this3.putQueue = new _queues.Queue();
        _this3.getQueue = new _queues.Queue();
        return _this3;
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
}(_model.Model);

var Store = function (_Model4) {
    _inherits(Store, _Model4);

    function Store(capacity) {
        var name = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, Store);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this, name));

        ARG_CHECK(arguments, 1, 2);

        _this4.capacity = capacity;
        _this4.objects = [];
        _this4.putQueue = new _queues.Queue();
        _this4.getQueue = new _queues.Queue();
        return _this4;
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
}(_model.Model);

var Event = function (_Model5) {
    _inherits(Event, _Model5);

    function Event(name) {
        _classCallCheck(this, Event);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Event).call(this, name));

        ARG_CHECK(arguments, 0, 1);

        _this5.waitList = [];
        _this5.queue = [];
        _this5.isFired = false;
        return _this5;
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
}(_model.Model);

function ARG_CHECK(found, expMin, expMax) {
    var message = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];

    if (found.length < expMin || found.length > expMax) {
        // ARG_CHECK
        throw new Error('Incorrect number of arguments ' + message); // ARG_CHECK
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

},{"./model.js":1,"./queues.js":2,"./request.js":4,"./stats.js":6}],6:[function(require,module,exports){
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

},{"./sim.js":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.Random = exports.ARG_CHECK = exports.Queue = exports.PQueue = exports.Request = exports.Population = exports.TimeSeries = exports.DataSeries = exports.Store = exports.Facility = exports.Buffer = exports.Event = exports.Entity = exports.Sim = undefined;

var _sim = require('./lib/sim.js');

var _stats = require('./lib/stats.js');

var _request = require('./lib/request.js');

var _queues = require('./lib/queues.js');

var _random = require('./lib/random.js');

var _model = require('./lib/model.js');

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
exports.Model = _model.Model;


if (typeof window !== 'undefined') {
  window.Sim = {
    ARG_CHECK: _sim.ARG_CHECK,
    Buffer: _sim.Buffer,
    DataSeries: _stats.DataSeries,
    Entity: _sim.Entity,
    Event: _sim.Event,
    Facility: _sim.Facility,
    Model: _model.Model,
    PQueue: _queues.PQueue,
    Population: _stats.Population,
    Queue: _queues.Queue,
    Random: _random.Random,
    Request: _request.Request,
    Sim: _sim.Sim,
    Store: _sim.Store,
    TimeSeries: _stats.TimeSeries
  };
}

},{"./lib/model.js":1,"./lib/queues.js":2,"./lib/random.js":3,"./lib/request.js":4,"./lib/sim.js":5,"./lib/stats.js":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLEdBQWEsQ0FBM0I7QUFDQSxhQUFPLEtBQUssTUFBWjtBQUNEOzs7d0JBUGtCO0FBQ2pCLGFBQU8sQ0FBQyxLQUFLLE1BQU4sR0FBZSxDQUFmLEdBQW1CLEtBQUssTUFBL0I7QUFDRDs7Ozs7O1FBUU0sSyxHQUFBLEs7a0JBQ00sSzs7Ozs7Ozs7Ozs7O0FDakJmOztBQUNBOztBQUNBOzs7Ozs7OztJQUVNLEs7OztBQUNGLG1CQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSw2RkFDUixJQURROztBQUVkLGNBQUssSUFBTCxHQUFZLEVBQVo7QUFDQSxjQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxjQUFLLEtBQUwsR0FBYSx1QkFBYjtBQUpjO0FBS2pCOzs7OzhCQUVLO0FBQ0YsbUJBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0g7OzsrQkFFTTtBQUNILG1CQUFRLEtBQUssSUFBTCxDQUFVLE1BQVgsR0FBcUIsS0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUE3QixDQUFyQixHQUF1RCxTQUE5RDtBQUNIOzs7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dUJBSlc7QUFLWCxxQkFMVztBQU1YLDJCQU5XO0FBT1gsdUJBUFc7QUFRWCwwQkFSVztBQVNYLGlDQVRXO0FBVVgsd0JBVlc7QUFXWCwwQkFYVztBQVlYLDZCQVpXO0FBYVgsaUJBYlc7QUFjWCxxQkFkVztBQWVYO0FBZlcsR0FBYjtBQWlCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25zdHJ1Y3Rvci5fbmV4dElkKCk7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ICR7dGhpcy5pZH1gO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb3VudCgpIHtcbiAgICByZXR1cm4gIXRoaXMuX2NvdW50ID8gMCA6IHRoaXMuX2NvdW50O1xuICB9XG5cbiAgc3RhdGljIF9uZXh0SWQoKSB7XG4gICAgdGhpcy5fY291bnQgPSB0aGlzLmNvdW50ICsgMTtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH1cbn1cblxuZXhwb3J0IHsgTW9kZWwgfTtcbmV4cG9ydCBkZWZhdWx0IE1vZGVsO1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcblxuY2xhc3MgUXVldWUgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lKTtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gICAgICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xuICAgIH1cblxuICAgIHRvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgICB9XG5cbiAgICBiYWNrKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZGF0YS5sZW5ndGgpID8gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdXNoKHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICAgICAgdGhpcy50aW1lc3RhbXAucHVzaCh0aW1lc3RhbXApO1xuXG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICB1bnNoaWZ0KHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgICAgIHRoaXMuZGF0YS51bnNoaWZ0KHZhbHVlKTtcbiAgICAgICAgdGhpcy50aW1lc3RhbXAudW5zaGlmdCh0aW1lc3RhbXApO1xuXG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBzaGlmdCh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEuc2hpZnQoKTtcbiAgICAgICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnNoaWZ0KCk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcG9wKHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnBvcCgpO1xuXG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHBhc3NieSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgICAgICB0aGlzLnN0YXRzLmxlYXZlKHRpbWVzdGFtcCwgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gICAgfVxuXG4gICAgcmVwb3J0KCkge1xuICAgICAgICByZXR1cm4gW3RoaXMuc3RhdHMuc2l6ZVNlcmllcy5hdmVyYWdlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0cy5kdXJhdGlvblNlcmllcy5hdmVyYWdlKCldO1xuICAgIH1cblxuICAgIGVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aCA9PSAwO1xuICAgIH1cblxuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xuICAgIH1cbn1cblxuY2xhc3MgUFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSk7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLm9yZGVyID0gMDtcbiAgICB9XG5cbiAgICBncmVhdGVyKHJvMSwgcm8yKSB7XG4gICAgICAgIGlmIChybzEuZGVsaXZlckF0ID4gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChybzEuZGVsaXZlckF0ID09IHJvMi5kZWxpdmVyQXQpXG4gICAgICAgICAgICByZXR1cm4gcm8xLm9yZGVyID4gcm8yLm9yZGVyO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5zZXJ0KHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuICAgICAgICByby5vcmRlciA9IHRoaXMub3JkZXIgKys7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2gocm8pO1xuXG4gICAgICAgIC8vIGluc2VydCBpbnRvIGRhdGEgYXQgdGhlIGVuZFxuICAgICAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgLy8gaGVhcCB1cFxuICAgICAgICB3aGlsZSAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoKGluZGV4IC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtwYXJlbnRJbmRleF0sIHJvKSkge1xuICAgICAgICAgICAgICAgIGFbaW5kZXhdID0gYVtwYXJlbnRJbmRleF07XG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYVtpbmRleF0gPSBub2RlO1xuICAgIH1cblxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcbiAgICAgICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xuICAgICAgICBpZiAobGVuIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbiA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvcCA9IGFbMF07XG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxuICAgICAgICBhWzBdID0gYS5wb3AoKTtcbiAgICAgICAgbGVuIC0tO1xuXG4gICAgICAgIC8vIGhlYXAgZG93blxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgTWF0aC5mbG9vcihsZW4gLyAyKSkge1xuICAgICAgICAgICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAyICogaW5kZXggKyAxO1xuICAgICAgICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMjtcblxuICAgICAgICAgICAgY29uc3Qgc21hbGxlckNoaWxkSW5kZXggPSByaWdodENoaWxkSW5kZXggPCBsZW5cbiAgICAgICAgICAgICAgJiYgIXRoaXMuZ3JlYXRlcihhW3JpZ2h0Q2hpbGRJbmRleF0sIGFbbGVmdENoaWxkSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ncmVhdGVyKGFbc21hbGxlckNoaWxkSW5kZXhdLCBub2RlKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhW2luZGV4XSA9IGFbc21hbGxlckNoaWxkSW5kZXhdO1xuICAgICAgICAgICAgaW5kZXggPSBzbWFsbGVyQ2hpbGRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBhW2luZGV4XSA9IG5vZGU7XG4gICAgICAgIHJldHVybiB0b3A7XG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWV1ZSwgUFF1ZXVlIH07XG4iLCJcbmNsYXNzIFJhbmRvbSB7XG4gICAgY29uc3RydWN0b3Ioc2VlZD0obmV3IERhdGUoKSkuZ2V0VGltZSgpKSB7XG4gICAgICAgIGlmICh0eXBlb2Yoc2VlZCkgIT09ICdudW1iZXInICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHx8IE1hdGguY2VpbChzZWVkKSAhPSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInNlZWQgdmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyXCIpOyAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cbiAgICAgICAgLyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cbiAgICAgICAgdGhpcy5OID0gNjI0O1xuICAgICAgICB0aGlzLk0gPSAzOTc7XG4gICAgICAgIHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOy8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gICAgICAgIHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7LyogbW9zdCBzaWduaWZpY2FudCB3LXIgYml0cyAqL1xuICAgICAgICB0aGlzLkxPV0VSX01BU0sgPSAweDdmZmZmZmZmOy8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG4gICAgICAgIHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cbiAgICAgICAgdGhpcy5tdGk9dGhpcy5OKzE7LyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG5cbiAgICAgICAgLy90aGlzLmluaXRfZ2VucmFuZChzZWVkKTtcbiAgICAgICAgdGhpcy5pbml0X2J5X2FycmF5KFtzZWVkXSwgMSk7XG4gICAgfVxuXG4gICAgaW5pdF9nZW5yYW5kKHMpIHtcbiAgICAgICAgdGhpcy5tdFswXSA9IHMgPj4+IDA7XG4gICAgICAgIGZvciAodGhpcy5tdGk9MTsgdGhpcy5tdGk8dGhpcy5OOyB0aGlzLm10aSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMubXRbdGhpcy5tdGktMV0gXiAodGhpcy5tdFt0aGlzLm10aS0xXSA+Pj4gMzApO1xuICAgICAgICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXG4gICAgICAgICAgICArIHRoaXMubXRpO1xuICAgICAgICAgICAgLyogU2VlIEtudXRoIFRBT0NQIFZvbDIuIDNyZCBFZC4gUC4xMDYgZm9yIG11bHRpcGxpZXIuICovXG4gICAgICAgICAgICAvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cbiAgICAgICAgICAgIC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgLyogMjAwMi8wMS8wOSBtb2RpZmllZCBieSBNYWtvdG8gTWF0c3Vtb3RvICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XG4gICAgICAgICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkge1xuICAgICAgICBsZXQgaSwgaiwgaztcbiAgICAgICAgdGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuICAgICAgICBpPTE7IGo9MDtcbiAgICAgICAgayA9ICh0aGlzLk4+a2V5X2xlbmd0aCA/IHRoaXMuTiA6IGtleV9sZW5ndGgpO1xuICAgICAgICBmb3IgKDsgazsgay0tKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcbiAgICAgICAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNjY0NTI1KSA8PCAxNikgKyAoKHMgJiAweDAwMDBmZmZmKSAqIDE2NjQ1MjUpKSlcbiAgICAgICAgICAgICsgaW5pdF9rZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXG4gICAgICAgICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cbiAgICAgICAgICAgIGkrKzsgaisrO1xuICAgICAgICAgICAgaWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxuICAgICAgICAgICAgaWYgKGo+PWtleV9sZW5ndGgpIGo9MDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGs9dGhpcy5OLTE7IGs7IGstLSkge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XG4gICAgICAgICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxuICAgICAgICAgICAgLSBpOyAvKiBub24gbGluZWFyICovXG4gICAgICAgICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xuICAgIH1cblxuICAgIGdlbnJhbmRfaW50MzIoKSB7XG4gICAgICAgIGxldCB5O1xuICAgICAgICBjb25zdCBtYWcwMSA9IG5ldyBBcnJheSgweDAsIHRoaXMuTUFUUklYX0EpO1xuICAgICAgICAvKiBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxICovXG5cbiAgICAgICAgaWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXG4gICAgICAgICAgICBsZXQga2s7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm10aSA9PSB0aGlzLk4rMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdF9nZW5yYW5kKDU0ODkpOyAvKiBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWQgKi9cblxuICAgICAgICAgICAgZm9yIChraz0wO2trPHRoaXMuTi10aGlzLk07a2srKykge1xuICAgICAgICAgICAgICAgIHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICAgICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayt0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKDtrazx0aGlzLk4tMTtraysrKSB7XG4gICAgICAgICAgICAgICAgeSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICAgICAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trKyh0aGlzLk0tdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgPSAodGhpcy5tdFt0aGlzLk4tMV0mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFswXSZ0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICAgICAgdGhpcy5tdFt0aGlzLk4tMV0gPSB0aGlzLm10W3RoaXMuTS0xXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXG4gICAgICAgICAgICB0aGlzLm10aSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcblxuICAgICAgICAvKiBUZW1wZXJpbmcgKi9cbiAgICAgICAgeSBePSAoeSA+Pj4gMTEpO1xuICAgICAgICB5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcbiAgICAgICAgeSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuICAgICAgICB5IF49ICh5ID4+PiAxOCk7XG5cbiAgICAgICAgcmV0dXJuIHkgPj4+IDA7XG4gICAgfVxuXG4gICAgZ2VucmFuZF9pbnQzMSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKT4+PjEpO1xuICAgIH1cblxuICAgIGdlbnJhbmRfcmVhbDEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSooMS4wLzQyOTQ5NjcyOTUuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMi0xICovXG4gICAgfVxuXG4gICAgcmFuZG9tKCkge1xuICAgICAgICBpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5za2lwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZW5yYW5kX2ludDMyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNraXAgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSooMS4wLzQyOTQ5NjcyOTYuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICAgIH1cblxuICAgIGdlbnJhbmRfcmVhbDMoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgKyAwLjUpKigxLjAvNDI5NDk2NzI5Ni4wKTtcbiAgICAgICAgLyogZGl2aWRlZCBieSAyXjMyICovXG4gICAgfVxuXG4gICAgZ2VucmFuZF9yZXM1MygpIHtcbiAgICAgICAgY29uc3QgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42O1xuICAgICAgICByZXR1cm4oYSo2NzEwODg2NC4wK2IpKigxLjAvOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbiAgICB9XG5cbiAgICBleHBvbmVudGlhbChsYW1iZGEpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgZXhwb25lbnRpYWwoKSBtdXN0ICBiZSBjYWxsZWQgd2l0aCAnbGFtYmRhJyBwYXJhbWV0ZXJgKTsgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgICAgICBjb25zdCByID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgcmV0dXJuIC1NYXRoLmxvZyhyKSAvIGxhbWJkYTtcbiAgICB9XG5cbiAgICBnYW1tYShhbHBoYSwgYmV0YSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBnYW1tYSgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVyc2ApOyAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgICAgIC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxuICAgICAgICAgKi9cblxuICAgICAgICBpZiAoYWxwaGEgPiAxLjApIHtcbiAgICAgICAgICAgIGNvbnN0IGFpbnYgPSBNYXRoLnNxcnQoMi4wICogYWxwaGEgLSAxLjApO1xuICAgICAgICAgICAgY29uc3QgYmJiID0gYWxwaGEgLSB0aGlzLkxPRzQ7XG4gICAgICAgICAgICBjb25zdCBjY2MgPSBhbHBoYSArIGFpbnY7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHUxID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB1MiA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IE1hdGgubG9nKHUxIC8gKDEuMCAtIHUxKSkgLyBhaW52O1xuICAgICAgICAgICAgICAgIHZhciB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gdTEgKiB1MSAqIHUyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBiYmIgKyBjY2MgKiB2IC0geDtcbiAgICAgICAgICAgICAgICBpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWxwaGEgPT0gMS4wKSB7XG4gICAgICAgICAgICB2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgICAgICB3aGlsZSAodSA8PSAxZS03KSB7XG4gICAgICAgICAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLSBNYXRoLmxvZyh1KSAqIGJldGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gYiAqIHU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPD0gMS4wKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gTWF0aC5wb3cocCwgMS4wIC8gYWxwaGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gLSBNYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdTEgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIGlmIChwID4gMS4wKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1MSA8PSBNYXRoLnBvdyh4LCAoYWxwaGEgLSAxLjApKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHUxIDw9IE1hdGguZXhwKC14KSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geCAqIGJldGE7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5vcm1hbChtdSwgc2lnbWEpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYG5vcm1hbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggbXUgYW5kIHNpZ21hIHBhcmFtZXRlcnNgKTsgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgICAgICBsZXQgeiA9IHRoaXMubGFzdE5vcm1hbDtcbiAgICAgICAgdGhpcy5sYXN0Tm9ybWFsID0gTmFOO1xuICAgICAgICBpZiAoIXopIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSB0aGlzLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG4gICAgICAgICAgICB6ID0gTWF0aC5jb3MoYSkgKiBiO1xuICAgICAgICAgICAgdGhpcy5sYXN0Tm9ybWFsID0gTWF0aC5zaW4oYSkgKiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtdSArIHogKiBzaWdtYTtcbiAgICB9XG5cbiAgICBwYXJldG8oYWxwaGEpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgcGFyZXRvKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBwYXJhbWV0ZXJgKTsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgICAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgcmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcbiAgICB9XG5cbiAgICB0cmlhbmd1bGFyKGxvd2VyLCB1cHBlciwgbW9kZSkge1xuICAgICAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RyaWFuZ3VsYXJfZGlzdHJpYnV0aW9uXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYHRyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyLCB1cHBlciBhbmQgbW9kZSBwYXJhbWV0ZXJzYCk7ICAgIC8vIEFSR19DSEVDS1xuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICAgICAgY29uc3QgYyA9IChtb2RlIC0gbG93ZXIpIC8gKHVwcGVyIC0gbG93ZXIpO1xuICAgICAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgICBpZiAodSA8PSBjKSB7XG4gICAgICAgICAgICByZXR1cm4gbG93ZXIgKyBNYXRoLnNxcnQodSAqICh1cHBlciAtIGxvd2VyKSAqIChtb2RlIC0gbG93ZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1cHBlciAtIE1hdGguc3FydCgoMSAtIHUpICogKHVwcGVyIC0gbG93ZXIpICogKHVwcGVyIC0gbW9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5pZm9ybShsb3dlciwgdXBwZXIpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgdW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnNgKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgcmV0dXJuIGxvd2VyICsgdGhpcy5yYW5kb20oKSAqICh1cHBlciAtIGxvd2VyKTtcbiAgICB9XG5cbiAgICB3ZWlidWxsKGFscGhhLCBiZXRhKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYHdlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnNgKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgY29uc3QgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiBhbHBoYSAqIE1hdGgucG93KC1NYXRoLmxvZyh1KSwgMS4wIC8gYmV0YSk7XG4gICAgfVxufVxuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblJhbmRvbS5wcm90b3R5cGUuTE9HNCA9IE1hdGgubG9nKDQuMCk7XG5SYW5kb20ucHJvdG90eXBlLlNHX01BR0lDQ09OU1QgPSAxLjAgKyBNYXRoLmxvZyg0LjUpO1xuXG5leHBvcnQgeyBSYW5kb20gfTtcbmV4cG9ydCBkZWZhdWx0IFJhbmRvbTtcbiIsImltcG9ydCB7IEFSR19DSEVDSywgU3RvcmUsIEJ1ZmZlciwgRXZlbnQgfSBmcm9tICcuL3NpbS5qcyc7XG5cbmNsYXNzIFJlcXVlc3Qge1xuICAgIGNvbnN0cnVjdG9yKGVudGl0eSwgY3VycmVudFRpbWUsIGRlbGl2ZXJBdCkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRBdCA9IGN1cnJlbnRUaW1lO1xuICAgICAgICB0aGlzLmRlbGl2ZXJBdCA9IGRlbGl2ZXJBdDtcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ncm91cCA9IG51bGw7XG4gICAgfVxuXG4gICAgY2FuY2VsKCkge1xuICAgICAgICAvLyBBc2sgdGhlIG1haW4gcmVxdWVzdCB0byBoYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT0gdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBbMF0uY2FuY2VsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLT4gdGhpcyBpcyBtYWluIHJlcXVlc3RcbiAgICAgICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIC8vIGlmIGFscmVhZHkgY2FuY2VsbGVkLCBkbyBub3RoaW5nXG4gICAgICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIHNldCBmbGFnXG4gICAgICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5kZWxpdmVyQXQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpXG4gICAgICAgICAgICAgICAgICAgIHx8ICh0aGlzLnNvdXJjZSBpbnN0YW5jZW9mIFN0b3JlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzUHV0UXVldWUuY2FsbCh0aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NHZXRRdWV1ZS5jYWxsKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5ncm91cCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ncm91cFtpXS5jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbmUoY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDAsIDMsIEZ1bmN0aW9uLCBPYmplY3QpO1xuXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWl0VW50aWwoZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0LCB1bmRlZmluZWQsIEZ1bmN0aW9uLCBPYmplY3QpO1xuICAgICAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KHRoaXMuc2NoZWR1bGVkQXQgKyBkZWxheSwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVubGVzc0V2ZW50KGV2ZW50LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCwgdW5kZWZpbmVkLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICAgICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgICAgICByby5tc2cgPSBldmVudDtcbiAgICAgICAgICAgIGV2ZW50LmFkZFdhaXRMaXN0KHJvKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICAgICAgICAgIHJvLm1zZyA9IGV2ZW50W2ldO1xuICAgICAgICAgICAgICAgIGV2ZW50W2ldLmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldERhdGEoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZWxpdmVyKCkge1xuICAgICAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNhbGxiYWNrcykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLmdyb3VwWzBdLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBbMF0uZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2FuY2VsUmVuZWdlQ2xhdXNlcygpIHtcbiAgICAgICAgLy90aGlzLmNhbmNlbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy90aGlzLndhaXRVbnRpbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy90aGlzLnVubGVzc0V2ZW50ID0gdGhpcy5OdWxsO1xuICAgICAgICB0aGlzLm5vUmVuZWdlID0gdHJ1ZTtcblxuICAgICAgICBpZiAoIXRoaXMuZ3JvdXAgfHwgdGhpcy5ncm91cFswXSAhPSB0aGlzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBOdWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfYWRkUmVxdWVzdChkZWxpdmVyQXQsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LFxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXQsXG4gICAgICAgICAgICAgICAgZGVsaXZlckF0KTtcblxuICAgICAgICByby5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JvdXAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAgPSBbdGhpc107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyb3VwLnB1c2gocm8pO1xuICAgICAgICByby5ncm91cCA9IHRoaXMuZ3JvdXA7XG4gICAgICAgIHJldHVybiBybztcbiAgICB9XG5cbiAgICBfZG9DYWxsYmFjayhzb3VyY2UsIG1zZywgZGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2ldWzBdO1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykgY29udGludWU7XG5cbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5jYWxsYmFja3NbaV1bMV07XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIGNvbnRleHQgPSB0aGlzLmVudGl0eTtcblxuICAgICAgICAgICAgY29uc3QgYXJndW1lbnQgPSB0aGlzLmNhbGxiYWNrc1tpXVsyXTtcblxuICAgICAgICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbXNnO1xuICAgICAgICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAoIWFyZ3VtZW50KSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBudWxsO1xuICAgICAgICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBudWxsO1xuICAgICAgICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBSZXF1ZXN0IH07XG4iLCJpbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwuanMnO1xuXG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5zaW0gPSBzaW07XG4gIH1cblxuICB0aW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2ltLnRpbWUoKTtcbiAgfVxuXG4gIHNldFRpbWVyKGR1cmF0aW9uKSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCkgKyBkdXJhdGlvbik7XG5cbiAgICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICByZXR1cm4gcm87XG4gIH1cblxuICB3YWl0RXZlbnQoZXZlbnQpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcblxuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICAgIGV2ZW50LmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgIHJldHVybiBybztcbiAgfVxuXG4gIHF1ZXVlRXZlbnQoZXZlbnQpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcblxuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICAgIGV2ZW50LmFkZFF1ZXVlKHJvKTtcbiAgICAgIHJldHVybiBybztcbiAgfVxuXG4gIHVzZUZhY2lsaXR5KGZhY2lsaXR5LCBkdXJhdGlvbikge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgICByby5zb3VyY2UgPSBmYWNpbGl0eTtcbiAgICAgIGZhY2lsaXR5LnVzZShkdXJhdGlvbiwgcm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgICByby5zb3VyY2UgPSBidWZmZXI7XG4gICAgICBidWZmZXIucHV0KGFtb3VudCwgcm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgZ2V0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgICByby5zb3VyY2UgPSBidWZmZXI7XG4gICAgICBidWZmZXIuZ2V0KGFtb3VudCwgcm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0U3RvcmUoc3RvcmUsIG9iaikge1xuICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgICByby5zb3VyY2UgPSBzdG9yZTtcbiAgICAgIHN0b3JlLnB1dChvYmosIHJvKTtcbiAgICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIsIFN0b3JlLCBGdW5jdGlvbik7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xuICAgICAgc3RvcmUuZ2V0KGZpbHRlciwgcm8pO1xuICAgICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgc2VuZChtZXNzYWdlLCBkZWxheSwgZW50aXRpZXMpIHtcbiAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMuc2ltLCB0aGlzLnRpbWUoKSwgdGhpcy50aW1lKCkgKyBkZWxheSk7XG4gICAgICByby5zb3VyY2UgPSB0aGlzO1xuICAgICAgcm8ubXNnID0gbWVzc2FnZTtcbiAgICAgIHJvLmRhdGEgPSBlbnRpdGllcztcbiAgICAgIHJvLmRlbGl2ZXIgPSB0aGlzLnNpbS5zZW5kTWVzc2FnZTtcblxuICAgICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlKSB7XG4gICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xuICB9XG59XG5cbmNsYXNzIFNpbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc2ltVGltZSA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBQUXVldWUoKTtcbiAgICAgICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IDE7XG4gICAgfVxuXG4gICAgdGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2ltVGltZTtcbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZSgpIHtcbiAgICAgICAgY29uc3Qgc2VuZGVyID0gdGhpcy5zb3VyY2U7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLm1zZztcbiAgICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHNpbSA9IHNlbmRlci5zaW07XG5cbiAgICAgICAgaWYgKCFlbnRpdGllcykge1xuICAgICAgICAgICAgLy8gc2VuZCB0byBhbGwgZW50aXRpZXNcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzaW0uZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgZW50aXR5ID0gc2ltLmVudGl0aWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2UuY2FsbChlbnRpdHksIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZW50aXRpZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGVudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2UuY2FsbChlbnRpdHksIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgZW50aXRpZXMgLm9uTWVzc2FnZS5jYWxsKGVudGl0aWVzLCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRW50aXR5KGtsYXNzLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHByb3RvdHlwZSBoYXMgc3RhcnQgZnVuY3Rpb25cbiAgICAgICAgaWYgKCFrbGFzcy5wcm90b3R5cGUuc3RhcnQpIHsgIC8vIEFSRyBDSEVDS1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbnRpdHkgY2xhc3MgJHtrbGFzcy5uYW1lfSBtdXN0IGhhdmUgc3RhcnQoKSBmdW5jdGlvbiBkZWZpbmVkYCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW50aXR5ID0gbmV3IGtsYXNzKHRoaXMsIG5hbWUpO1xuICAgICAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcblxuICAgICAgICBlbnRpdHkuc3RhcnQoLi4uYXJncyk7XG5cbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICBzaW11bGF0ZShlbmRUaW1lLCBtYXhFdmVudHMpIHtcbiAgICAgICAgLy9BUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcbiAgICAgICAgaWYgKCFtYXhFdmVudHMpIHttYXhFdmVudHMgPSBNYXRoLkluZmluaXR5OyB9XG4gICAgICAgIGxldCBldmVudHMgPSAwO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBldmVudHMgKys7XG4gICAgICAgICAgICBpZiAoZXZlbnRzID4gbWF4RXZlbnRzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZWFybGllc3QgZXZlbnRcbiAgICAgICAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZXZlbnRzLCB3ZSBhcmUgZG9uZSB3aXRoIHNpbXVsYXRpb24gaGVyZS5cbiAgICAgICAgICAgIGlmIChybyA9PSB1bmRlZmluZWQpIGJyZWFrO1xuXG5cbiAgICAgICAgICAgIC8vIFVoIG9oLi4gd2UgYXJlIG91dCBvZiB0aW1lIG5vd1xuICAgICAgICAgICAgaWYgKHJvLmRlbGl2ZXJBdCA+IGVuZFRpbWUpIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBBZHZhbmNlIHNpbXVsYXRpb24gdGltZVxuICAgICAgICAgICAgdGhpcy5zaW1UaW1lID0gIHJvLmRlbGl2ZXJBdDtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXG4gICAgICAgICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcblxuICAgICAgICAgICAgcm8uZGVsaXZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGVwKCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xuICAgICAgICAgICAgaWYgKCFybykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuICAgICAgICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XG4gICAgICAgICAgICByby5kZWxpdmVyKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSgpIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9nZ2VyKGxvZ2dlcikge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxLCBGdW5jdGlvbik7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgIH1cblxuICAgIGxvZyhtZXNzYWdlLCBlbnRpdHkpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMik7XG5cbiAgICAgICAgaWYgKCF0aGlzLmxvZ2dlcikgcmV0dXJuO1xuICAgICAgICBsZXQgZW50aXR5TXNnID0gXCJcIjtcbiAgICAgICAgaWYgKGVudGl0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZW50aXR5Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5uYW1lfV1gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5pZH1dIGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoYCR7dGhpcy5zaW1UaW1lLnRvRml4ZWQoNil9JHtlbnRpdHlNc2d9ICAgJHttZXNzYWdlfWApO1xuICAgIH1cbn1cblxuY2xhc3MgRmFjaWxpdHkgZXh0ZW5kcyBNb2RlbHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkaXNjaXBsaW5lLCBzZXJ2ZXJzLCBtYXhxbGVuKSB7XG4gICAgICAgIHN1cGVyKG5hbWUpO1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0KTtcblxuICAgICAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgICAgIHRoaXMuc2VydmVycyA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcbiAgICAgICAgdGhpcy5tYXhxbGVuID0gKG1heHFsZW4gPT09IHVuZGVmaW5lZCkgPyAtMSA6IDEgKiBtYXhxbGVuO1xuXG4gICAgICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgICAgIGNhc2UgRmFjaWxpdHkuTENGUzpcbiAgICAgICAgICAgIHRoaXMudXNlID0gdGhpcy51c2VMQ0ZTO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRmFjaWxpdHkuUFM6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZztcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLnVzZSA9IHRoaXMudXNlRkNGUztcbiAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnMgPSBuZXcgQXJyYXkodGhpcy5zZXJ2ZXJzKTtcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgICAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICBzeXN0ZW1TdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHM7XG4gICAgfVxuXG4gICAgcXVldWVTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gICAgfVxuXG4gICAgdXNhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1c3lEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgICAgICB0aGlzLnF1ZXVlLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgICAgIGlmICggKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgICAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgICAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShub3cpO1xuICAgIH1cblxuICAgIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7IC8vIFRPRE9cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZyZWVTZXJ2ZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mcmVlIC0tO1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gcm8uZHVyYXRpb247XG5cbiAgICAgICAgICAgIC8vIGNhbmNlbCBhbGwgb3RoZXIgcmVuZWdpbmcgcmVxdWVzdHNcbiAgICAgICAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcblxuICAgICAgICAgICAgY29uc3QgbmV3cm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aW1lc3RhbXAsIHRpbWVzdGFtcCArIHJvLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIG5ld3JvLmRvbmUodGhpcy51c2VGQ0ZTQ2FsbGJhY2ssIHRoaXMsIHJvKTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXNlRkNGU0NhbGxiYWNrKHJvKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgb25lIG1vcmUgZnJlZSBzZXJ2ZXJcbiAgICAgICAgdGhpcy5mcmVlICsrO1xuICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIHNvbWVvbmUgd2FpdGluZywgc2NoZWR1bGUgaXQgbm93XG4gICAgICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXG4gICAgICAgIHJvLmRlbGl2ZXIoKTtcblxuICAgIH1cblxuICAgIHVzZUxDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSTykge1xuICAgICAgICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkgLSB0aGlzLmN1cnJlbnRSTy5sYXN0SXNzdWVkKTtcbiAgICAgICAgICAgIC8vIGNhbGN1YXRlIHRoZSByZW1haW5pbmcgdGltZVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Uk8ucmVtYWluaW5nID1cbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgICAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cbiAgICAgICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8ubGFzdElzc3VlZCA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgfVxuXG4gICAgdXNlTENGU0NhbGxiYWNrKCkge1xuICAgICAgICBjb25zdCBybyA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGZhY2lsaXR5ID0gcm8uc291cmNlO1xuXG4gICAgICAgIGlmIChybyAhPSBmYWNpbGl0eS5jdXJyZW50Uk8pIHJldHVybjtcbiAgICAgICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcblxuICAgICAgICAvLyBzdGF0c1xuICAgICAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHJvLmVudGl0eS50aW1lKCkgLSByby5sYXN0SXNzdWVkKTtcbiAgICAgICAgZmFjaWxpdHkuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XG4gICAgICAgIHJvLmRlbGl2ZXIgPSByby5zYXZlZF9kZWxpdmVyO1xuICAgICAgICBkZWxldGUgcm8uc2F2ZWRfZGVsaXZlcjtcbiAgICAgICAgcm8uZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgICAgICBpZiAoIWZhY2lsaXR5LnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGZhY2lsaXR5LnF1ZXVlLnBvcChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmcoZHVyYXRpb24sIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIG51bGwsIFJlcXVlc3QpO1xuICAgICAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgICB9XG5cbiAgICB1c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIGlzQWRkZWQpIHtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XG4gICAgICAgIGNvbnN0IG5ld1F1ZXVlID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcbiAgICAgICAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcbiAgICAgICAgICAgIG5ld2V2LnJvID0gZXYucm87XG4gICAgICAgICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgICAgICAgIGV2LmNhbmNlbCgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcbiAgICAgICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgICAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyByby5kdXJhdGlvbiAqIChzaXplICsgMSkpO1xuICAgICAgICAgICAgbmV3ZXYucm8gPSBybztcbiAgICAgICAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICAgICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICAgICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ld1F1ZXVlO1xuXG4gICAgICAgIC8vIHVzYWdlIHN0YXRpc3RpY3NcbiAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IChjdXJyZW50IC0gdGhpcy5sYXN0SXNzdWVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICAgICAgY29uc3QgZXYgPSB0aGlzO1xuICAgICAgICBjb25zdCBmYWMgPSBldi5zb3VyY2U7XG5cbiAgICAgICAgaWYgKGV2LmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBmYWMuc3RhdHMubGVhdmUoZXYucm8uc2NoZWR1bGVkQXQsIGV2LnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIGZhYy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUoZXYucm8sIGZhbHNlKTtcbiAgICAgICAgZXYucm8uZGVsaXZlcigpO1xuICAgIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIGV4dGVuZHMgTW9kZWx7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY2FwYWNpdHksIGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIobmFtZSk7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgPSAoaW5pdGlhbCA9PT0gdW5kZWZpbmVkKSA/IDAgOiBpbml0aWFsO1xuICAgICAgICB0aGlzLnB1dFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB9XG5cbiAgICBjdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdmFpbGFibGU7XG4gICAgfVxuXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gICAgfVxuXG4gICAgZ2V0KGFtb3VudCwgcm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIGFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gYW1vdW50O1xuXG4gICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJvLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgICB9XG5cbiAgICBwdXQoYW1vdW50LCBybykge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgICAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgKGFtb3VudCArIHRoaXMuYXZhaWxhYmxlKSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSArPSBhbW91bnQ7XG5cbiAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgICAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICAgICAgbGV0IG9iajtcbiAgICAgICAgd2hpbGUgKG9iaiA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICAgICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgIGlmIChvYmouYW1vdW50IDw9IHRoaXMuYXZhaWxhYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtPSBvYmouYW1vdW50O1xuICAgICAgICAgICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb2dyZXNzUHV0UXVldWUoKSB7XG4gICAgICAgIGxldCBvYmo7XG4gICAgICAgIHdoaWxlIChvYmogPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgaWYgKG9iai5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICBpZiAob2JqLmFtb3VudCArIHRoaXMuYXZhaWxhYmxlIDw9IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgICAgICAgICAgb2JqLmRlbGl2ZXJBdCA9IG9iai5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHV0U3RhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICAgIH1cblxuICAgIGdldFN0YXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcbiAgICB9XG59XG5cbmNsYXNzIFN0b3JlIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNhcGFjaXR5LCBuYW1lPW51bGwpIHtcbiAgICAgICAgc3VwZXIobmFtZSk7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgICAgdGhpcy5nZXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgIH1cblxuICAgIGN1cnJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xuICAgIH1cblxuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xuICAgIH1cblxuICAgIGdldChmaWx0ZXIsIHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPiAwKSB7XG4gICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBvYmo7XG4gICAgICAgICAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGNvZGUgb3V0XG4gICAgICAgICAgICAvLyBpdCBpcyByZXBlYXRlZCBpbiBwcm9ncmVzc0dldFF1ZXVlXG4gICAgICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICAgICAgICAgIHJvLm1zZyA9IG9iajtcbiAgICAgICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJvLmZpbHRlciA9IGZpbHRlcjtcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgICB9XG5cbiAgICBwdXQob2JqLCBybykge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgICAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG5cbiAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgICAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG4gICAgICAgICAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xuXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcm8ub2JqID0gb2JqO1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgICAgIGxldCBybztcbiAgICAgICAgd2hpbGUgKHJvID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgICAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSByby5maWx0ZXI7XG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IG9iajtcblxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XG5cbiAgICAgICAgICAgICAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICAgICAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgICAgICBsZXQgcm87XG4gICAgICAgIHdoaWxlIChybyA9IHRoaXMucHV0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICAgICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuICAgICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHJvLm9iaik7XG4gICAgICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdXRTdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV0UXVldWUuc3RhdHM7XG4gICAgfVxuXG4gICAgZ2V0U3RhdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFF1ZXVlLnN0YXRzO1xuICAgIH1cbn1cblxuY2xhc3MgRXZlbnQgZXh0ZW5kcyBNb2RlbHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUpO1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkV2FpdExpc3Qocm8pIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndhaXRMaXN0LnB1c2gocm8pO1xuICAgIH1cblxuICAgIGFkZFF1ZXVlKHJvKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHJvKTtcbiAgICB9XG5cbiAgICBmaXJlKGtlZXBGaXJlZCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgICAgICBpZiAoa2VlcEZpcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcbiAgICAgICAgY29uc3QgdG1wTGlzdCA9IHRoaXMud2FpdExpc3Q7XG4gICAgICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBMaXN0Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBvbmUgcXVldWVkIGVudGl0eVxuICAgICAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKGx1Y2t5KSB7XG4gICAgICAgICAgICBsdWNreS5kZWxpdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIEFSR19DSEVDSyhmb3VuZCwgZXhwTWluLCBleHBNYXgsIG1lc3NhZ2U9XCJcIikge1xuXHRpZiAoZm91bmQubGVuZ3RoIDwgZXhwTWluIHx8IGZvdW5kLmxlbmd0aCA+IGV4cE1heCkgeyAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMgJHttZXNzYWdlfWApOyAgIC8vIEFSR19DSEVDS1xuXHR9ICAgLy8gQVJHX0NIRUNLXG5cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGZvdW5kLmxlbmd0aDsgaSsrKSB7ICAgLy8gQVJHX0NIRUNLXG5cdFx0aWYgKCFhcmd1bWVudHNbaSArIDNdIHx8ICFmb3VuZFtpXSkgY29udGludWU7ICAgLy8gQVJHX0NIRUNLXG5cbi8vXHRcdHByaW50KFwiVEVTVCBcIiArIGZvdW5kW2ldICsgXCIgXCIgKyBhcmd1bWVudHNbaSArIDNdICAgLy8gQVJHX0NIRUNLXG4vL1x0XHQrIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgRXZlbnQpICAgLy8gQVJHX0NIRUNLXG4vL1x0XHQrIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkgICAvLyBBUkdfQ0hFQ0tcbi8vXHRcdCsgXCJcXG5cIik7ICAgLy8gQVJHIENIRUNLXG5cblxuXHRcdGlmICghIChmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pKSB7ICAgLy8gQVJHX0NIRUNLXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHBhcmFtZXRlciAke2kgKyAxfSBpcyBvZiBpbmNvcnJlY3QgdHlwZS5gKTsgICAvLyBBUkdfQ0hFQ0tcblx0XHR9ICAgLy8gQVJHX0NIRUNLXG5cdH0gICAvLyBBUkdfQ0hFQ0tcbn0gICAvLyBBUkdfQ0hFQ0tcblxuZXhwb3J0IHtTaW0sIEZhY2lsaXR5LCBCdWZmZXIsIFN0b3JlLCBFdmVudCwgRW50aXR5LCBBUkdfQ0hFQ0t9O1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBEYXRhU2VyaWVzIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5Db3VudCA9IDA7XG4gICAgICAgIHRoaXMuVyA9IDAuMDtcbiAgICAgICAgdGhpcy5BID0gMC4wO1xuICAgICAgICB0aGlzLlEgPSAwLjA7XG4gICAgICAgIHRoaXMuTWF4ID0gLUluZmluaXR5O1xuICAgICAgICB0aGlzLk1pbiA9IEluZmluaXR5O1xuICAgICAgICB0aGlzLlN1bSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcbiAgICAgICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMywgMyk7XG5cbiAgICAgICAgdGhpcy5oTG93ZXIgPSBsb3dlcjtcbiAgICAgICAgdGhpcy5oVXBwZXIgPSB1cHBlcjtcbiAgICAgICAgdGhpcy5oQnVja2V0U2l6ZSA9ICh1cHBlciAtIGxvd2VyKSAvIG5idWNrZXRzO1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbSA9IG5ldyBBcnJheShuYnVja2V0cyArIDIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpc3RvZ3JhbTtcbiAgICB9XG5cbiAgICByZWNvcmQodmFsdWUsIHdlaWdodCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgICAgICBjb25zdCB3ID0gKHdlaWdodCA9PT0gdW5kZWZpbmVkKSA/IDEgOiB3ZWlnaHQ7XG4gICAgICAgIC8vZG9jdW1lbnQud3JpdGUoXCJEYXRhIHNlcmllcyByZWNvcmRpbmcgXCIgKyB2YWx1ZSArIFwiICh3ZWlnaHQgPSBcIiArIHcgKyBcIilcXG5cIik7XG5cbiAgICAgICAgaWYgKHZhbHVlID4gdGhpcy5NYXgpIHRoaXMuTWF4ID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA8IHRoaXMuTWluKSB0aGlzLk1pbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLlN1bSArPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5Db3VudCArKztcbiAgICAgICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPCB0aGlzLmhMb3dlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9ncmFtWzBdICs9IHc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA+IHRoaXMuaFVwcGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaXN0b2dyYW1bdGhpcy5oaXN0b2dyYW0ubGVuZ3RoIC0gMV0gKz0gdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh2YWx1ZSAtIHRoaXMuaExvd2VyKSAvIHRoaXMuaEJ1Y2tldFNpemUpICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpbmRleF0gKz0gdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdpID0gV2ktMSArIHdpXG4gICAgICAgIHRoaXMuVyA9IHRoaXMuVyArIHc7XG5cbiAgICAgICAgaWYgKHRoaXMuVyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWkgPSBBaS0xICsgd2kvV2kgKiAoeGkgLSBBaS0xKVxuICAgICAgICBjb25zdCBsYXN0QSA9IHRoaXMuQTtcbiAgICAgICAgdGhpcy5BID0gbGFzdEEgKyAodyAvIHRoaXMuVykgKiAodmFsdWUgLSBsYXN0QSk7XG5cbiAgICAgICAgLy8gUWkgPSBRaS0xICsgd2koeGkgLSBBaS0xKSh4aSAtIEFpKVxuICAgICAgICB0aGlzLlEgPSB0aGlzLlEgKyB3ICogKHZhbHVlIC0gbGFzdEEpICogKHZhbHVlIC0gdGhpcy5BKTtcbiAgICAgICAgLy9wcmludChcIlxcdFc9XCIgKyB0aGlzLlcgKyBcIiBBPVwiICsgdGhpcy5BICsgXCIgUT1cIiArIHRoaXMuUSArIFwiXFxuXCIpO1xuICAgIH1cblxuICAgIGNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5Db3VudDtcbiAgICB9XG5cbiAgICBtaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk1pbjtcbiAgICB9XG5cbiAgICBtYXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLk1heDtcbiAgICB9XG5cbiAgICByYW5nZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTWF4IC0gdGhpcy5NaW47XG4gICAgfVxuXG4gICAgc3VtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5TdW07XG4gICAgfVxuXG4gICAgc3VtV2VpZ2h0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkEgKiB0aGlzLlc7XG4gICAgfVxuXG4gICAgYXZlcmFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQTtcbiAgICB9XG5cbiAgICB2YXJpYW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUSAvIHRoaXMuVztcbiAgICB9XG5cbiAgICBkZXZpYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy52YXJpYW5jZSgpKTtcbiAgICB9XG59XG5cbmNsYXNzIFRpbWVTZXJpZXMge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5kYXRhU2VyaWVzID0gbmV3IERhdGFTZXJpZXMobmFtZSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZGF0YVNlcmllcy5yZXNldCgpO1xuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IE5hTjtcbiAgICAgICAgdGhpcy5sYXN0VGltZXN0YW1wID0gTmFOO1xuICAgIH1cblxuICAgIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDMsIDMpO1xuICAgICAgICB0aGlzLmRhdGFTZXJpZXMuc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpO1xuICAgIH1cblxuICAgIGdldEhpc3RvZ3JhbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcbiAgICB9XG5cbiAgICByZWNvcmQodmFsdWUsIHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgICAgICBpZiAoIWlzTmFOKHRoaXMubGFzdFRpbWVzdGFtcCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNlcmllcy5yZWNvcmQodGhpcy5sYXN0VmFsdWUsIHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpbWVzdGFtcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgfVxuXG4gICAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgICAgIHRoaXMucmVjb3JkKE5hTiwgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5jb3VudCgpO1xuICAgIH1cblxuICAgIG1pbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5taW4oKTtcbiAgICB9XG5cbiAgICBtYXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWF4KCk7XG4gICAgfVxuXG4gICAgcmFuZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMucmFuZ2UoKTtcbiAgICB9XG5cbiAgICBzdW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuc3VtKCk7XG4gICAgfVxuXG4gICAgYXZlcmFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5hdmVyYWdlKCk7XG4gICAgfVxuXG4gICAgZGV2aWF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmRldmlhdGlvbigpO1xuICAgIH1cblxuICAgIHZhcmlhbmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnZhcmlhbmNlKCk7XG4gICAgfVxufVxuXG5jbGFzcyBQb3B1bGF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gICAgICAgIHRoaXMuc2l6ZVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKCk7XG4gICAgICAgIHRoaXMuZHVyYXRpb25TZXJpZXMgPSBuZXcgRGF0YVNlcmllcygpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnNpemVTZXJpZXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZXNldCgpO1xuICAgICAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICAgIH1cblxuICAgIGVudGVyKHRpbWVzdGFtcCkge1xuICAgICAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRpb24gKys7XG4gICAgICAgIHRoaXMuc2l6ZVNlcmllcy5yZWNvcmQodGhpcy5wb3B1bGF0aW9uLCB0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGxlYXZlKGFycml2YWxBdCwgbGVmdEF0KSB7XG4gICAgICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIHRoaXMucG9wdWxhdGlvbiAtLTtcbiAgICAgICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIGxlZnRBdCk7XG4gICAgICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVjb3JkKGxlZnRBdCAtIGFycml2YWxBdCk7XG4gICAgfVxuXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbjtcbiAgICB9XG5cbiAgICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICAgICAgdGhpcy5zaXplU2VyaWVzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XG4iLCJpbXBvcnQgeyBTaW0sIEVudGl0eSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlLCBBUkdfQ0hFQ0sgfSBmcm9tICcuL2xpYi9zaW0uanMnXG5pbXBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH0gZnJvbSAnLi9saWIvc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vbGliL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vbGliL3F1ZXVlcy5qcyc7XG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICcuL2xpYi9yYW5kb20uanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL2xpYi9tb2RlbC5qcyc7XG5cbmV4cG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUgfTtcbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbmV4cG9ydCB7IFJlcXVlc3QgfTtcbmV4cG9ydCB7IFBRdWV1ZSwgUXVldWUsIEFSR19DSEVDS307XG5leHBvcnQgeyBSYW5kb20gfTtcbmV4cG9ydCB7IE1vZGVsIH07XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuU2ltID0ge1xuICAgIEFSR19DSEVDSzogQVJHX0NIRUNLLFxuICAgIEJ1ZmZlcjogQnVmZmVyLFxuICAgIERhdGFTZXJpZXM6IERhdGFTZXJpZXMsXG4gICAgRW50aXR5OiBFbnRpdHksXG4gICAgRXZlbnQ6IEV2ZW50LFxuICAgIEZhY2lsaXR5OiBGYWNpbGl0eSxcbiAgICBNb2RlbDogTW9kZWwsXG4gICAgUFF1ZXVlOiBQUXVldWUsXG4gICAgUG9wdWxhdGlvbjogUG9wdWxhdGlvbixcbiAgICBRdWV1ZTogUXVldWUsXG4gICAgUmFuZG9tOiBSYW5kb20sXG4gICAgUmVxdWVzdDogUmVxdWVzdCxcbiAgICBTaW06IFNpbSxcbiAgICBTdG9yZTogU3RvcmUsXG4gICAgVGltZVNlcmllczogVGltZVNlcmllc1xuICB9O1xufVxuIl19
