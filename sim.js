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
      this._totalInstances = this.totalInstances + 1;
      return this._totalInstances;
    }
  }, {
    key: "totalInstances",
    get: function get() {
      return !this._totalInstances ? 0 : this._totalInstances;
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
      return this.data.length === 0;
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
      if (ro1.deliverAt === ro2.deliverAt) return ro1.order > ro2.order;
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
      if (len === 1) {
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
'use strict';

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
     || Math.ceil(seed) !== Math.floor(seed)) {
      // ARG_CHECK
      throw new TypeError('seed value must be an integer'); // ARG_CHECK
    } // ARG_CHECK

    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df; /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

    // this.init_genrand(seed);
    this.init_by_array([seed], 1);
  }

  _createClass(Random, [{
    key: 'init_genrand',
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
    key: 'init_by_array',
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
    key: 'genrand_int32',
    value: function genrand_int32() {
      var y = void 0;

      var mag01 = new Array(0x0, this.MATRIX_A);

      /* mag01[x] = x * MATRIX_A  for x=0,1 */

      if (this.mti >= this.N) {
        /* generate N words at one time */
        var kk = void 0;

        if (this.mti === this.N + 1) /* if init_genrand() has not been called, */
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
    key: 'genrand_int31',
    value: function genrand_int31() {
      return this.genrand_int32() >>> 1;
    }
  }, {
    key: 'genrand_real1',
    value: function genrand_real1() {
      return this.genrand_int32() * (1.0 / 4294967295.0);
      /* divided by 2^32-1 */
    }
  }, {
    key: 'random',
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
    key: 'genrand_real3',
    value: function genrand_real3() {
      return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
      /* divided by 2^32 */
    }
  }, {
    key: 'genrand_res53',
    value: function genrand_res53() {
      var a = this.genrand_int32() >>> 5,
          b = this.genrand_int32() >>> 6;

      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
  }, {
    key: 'exponential',
    value: function exponential(lambda) {
      if (arguments.length !== 1) {
        // ARG_CHECK
        throw new SyntaxError('exponential() must  be called with \'lambda\' parameter'); // ARG_CHECK
      } // ARG_CHECK

      var r = this.random();

      return -Math.log(r) / lambda;
    }
  }, {
    key: 'gamma',
    value: function gamma(alpha, beta) {
      if (arguments.length !== 2) {
        // ARG_CHECK
        throw new SyntaxError('gamma() must be called with alpha and beta parameters'); // ARG_CHECK
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
      } else if (alpha === 1.0) {
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
    key: 'normal',
    value: function normal(mu, sigma) {
      if (arguments.length !== 2) {
        // ARG_CHECK
        throw new SyntaxError('normal() must be called with mu and sigma parameters'); // ARG_CHECK
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
    key: 'pareto',
    value: function pareto(alpha) {
      if (arguments.length !== 1) {
        // ARG_CHECK
        throw new SyntaxError('pareto() must be called with alpha parameter'); // ARG_CHECK
      } // ARG_CHECK

      var u = this.random();

      return 1.0 / Math.pow(1 - u, 1.0 / alpha);
    }
  }, {
    key: 'triangular',
    value: function triangular(lower, upper, mode) {
      // http://en.wikipedia.org/wiki/Triangular_distribution
      if (arguments.length !== 3) {
        // ARG_CHECK
        throw new SyntaxError('triangular() must be called with lower, upper and mode parameters'); // ARG_CHECK
      } // ARG_CHECK

      var c = (mode - lower) / (upper - lower);

      var u = this.random();

      if (u <= c) {
        return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
      } else {
        return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
      }
    }

    /**
    * All floats between lower and upper are equally likely. This is the
    * theoretical distribution model for a balanced coin, an unbiased die, a
    * casino roulette, or the first card of a well-shuffled deck.
    */

  }, {
    key: 'uniform',
    value: function uniform(lower, upper) {
      if (arguments.length !== 2) {
        // ARG_CHECK
        throw new SyntaxError('uniform() must be called with lower and upper parameters'); // ARG_CHECK
      } // ARG_CHECK
      return lower + this.random() * (upper - lower);
    }
  }, {
    key: 'weibull',
    value: function weibull(alpha, beta) {
      if (arguments.length !== 2) {
        // ARG_CHECK
        throw new SyntaxError('weibull() must be called with alpha and beta parameters'); // ARG_CHECK
      } // ARG_CHECK
      var u = 1.0 - this.random();

      return alpha * Math.pow(-Math.log(u), 1.0 / beta);
    }
  }]);

  return Random;
}();

/* These real versions are due to Isaku Wada, 2002/01/09 added */

/** ************************************************************************/


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
      if (this.group && this.group[0] !== this) {
        return this.group[0].cancel();
      }

      // --> this is main request
      if (this.noRenege) return this;

      // if already cancelled, do nothing
      if (this.cancelled) return;

      // set flag
      this.cancelled = true;

      if (this.deliverAt === 0) {
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
        if (this.group[i].deliverAt === 0) {
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
      // this.cancel = this.Null;
      // this.waitUntil = this.Null;
      // this.unlessEvent = this.Null;
      this.noRenege = true;

      if (!this.group || this.group[0] !== this) {
        return;
      }

      for (var i = 1; i < this.group.length; i++) {

        this.group[i].cancelled = true;
        if (this.group[i].deliverAt === 0) {
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
      // ARG_CHECK(arguments, 1, 2);
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
        if (ro === undefined) break;

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
      var entityMsg = '';

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
          }
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

      if (ro !== facility.currentRO) return;
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
      if (this.queue.length === 0) {
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

    ARG_CHECK(arguments, 1, 2);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this, name));

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
  if (found.length < expMin || found.length > expMax) {
    // ARG_CHECK
    throw new Error('Incorrect number of arguments'); // ARG_CHECK
  } // ARG_CHECK

  for (var i = 0; i < found.length; i++) {
    // ARG_CHECK

    if (!arguments[i + 3] || !found[i]) continue; // ARG_CHECK

    //    print("TEST " + found[i] + " " + arguments[i + 3]   // ARG_CHECK
    //    + " " + (found[i] instanceof Event)   // ARG_CHECK
    //    + " " + (found[i] instanceof arguments[i + 3])   // ARG_CHECK
    //    + "\n");   // ARG CHECK

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

      // document.write("Data series recording " + value + " (weight = " + w + ")\n");

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
      // print("\tW=" + this.W + " A=" + this.A + " Q=" + this.Q + "\n");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEseUZBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLHVCQUFiO0FBSmdCO0FBS2pCOzs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBUSxLQUFLLElBQUwsQ0FBVSxNQUFYLEdBQXFCLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBN0IsQ0FBckIsR0FBdUQsU0FBOUQ7QUFDRDs7O3lCQUVJLEssRUFBTyxTLEVBQVc7QUFDckIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLFdBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxLQUFmO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixTQUFwQjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCO0FBQ0Q7Ozs0QkFFTyxLLEVBQU8sUyxFQUFXO0FBQ3hCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFDQSxXQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEtBQWxCO0FBQ0EsV0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixTQUF2Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCO0FBQ0Q7OzswQkFFSyxTLEVBQVc7QUFDZiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxLQUFWLEVBQWQ7O0FBRUEsVUFBTSxhQUFhLEtBQUssU0FBTCxDQUFlLEtBQWYsRUFBbkI7O0FBRUEsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixVQUFqQixFQUE2QixTQUE3QjtBQUNBLGFBQU8sS0FBUDtBQUNEOzs7d0JBRUcsUyxFQUFXO0FBQ2IsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFNLFFBQVEsS0FBSyxJQUFMLENBQVUsR0FBVixFQUFkOztBQUVBLFVBQU0sYUFBYSxLQUFLLFNBQUwsQ0FBZSxHQUFmLEVBQW5COztBQUVBLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsRUFBNkIsU0FBN0I7QUFDQSxhQUFPLEtBQVA7QUFDRDs7OzJCQUVNLFMsRUFBVztBQUNoQiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBakI7QUFDQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCLEVBQTRCLFNBQTVCO0FBQ0Q7Ozs2QkFFUSxTLEVBQVc7QUFDbEIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFNBQXBCO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUssS0FBTCxDQUFXLEtBQVg7QUFDRDs7OzRCQUVPO0FBQ04sV0FBSyxLQUFMO0FBQ0EsV0FBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFdBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNEOzs7NkJBRVE7QUFDUCxhQUFPLENBQUMsS0FBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixPQUF0QixFQUFELEVBQ0ssS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixPQUExQixFQURMLENBQVA7QUFFRDs7OzRCQUVPO0FBQ04sYUFBTyxLQUFLLElBQUwsQ0FBVSxNQUFWLEtBQXFCLENBQTVCO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQU8sS0FBSyxJQUFMLENBQVUsTUFBakI7QUFDRDs7Ozs7O0lBR0csTTs7O0FBQ0osa0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUFBLDJGQUNWLElBRFU7O0FBRWhCLFdBQUssSUFBTCxHQUFZLEVBQVo7QUFDQSxXQUFLLEtBQUwsR0FBYSxDQUFiO0FBSGdCO0FBSWpCOzs7OzRCQUVPLEcsRUFBSyxHLEVBQUs7QUFDaEIsVUFBSSxJQUFJLFNBQUosR0FBZ0IsSUFBSSxTQUF4QixFQUFtQyxPQUFPLElBQVA7QUFDbkMsVUFBSSxJQUFJLFNBQUosS0FBa0IsSUFBSSxTQUExQixFQUNFLE9BQU8sSUFBSSxLQUFKLEdBQVksSUFBSSxLQUF2QjtBQUNGLGFBQU8sS0FBUDtBQUNEOzs7MkJBRU0sRSxFQUFJO0FBQ1QsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLFNBQUcsS0FBSCxHQUFXLEtBQUssS0FBTCxFQUFYOztBQUVBLFVBQUksUUFBUSxLQUFLLElBQUwsQ0FBVSxNQUF0Qjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsRUFBZjs7O0FBR0EsVUFBTSxJQUFJLEtBQUssSUFBZjs7QUFFQSxVQUFNLE9BQU8sRUFBRSxLQUFGLENBQWI7OztBQUdBLGFBQU8sUUFBUSxDQUFmLEVBQWtCO0FBQ2hCLFlBQU0sY0FBYyxLQUFLLEtBQUwsQ0FBVyxDQUFDLFFBQVEsQ0FBVCxJQUFjLENBQXpCLENBQXBCOztBQUVBLFlBQUksS0FBSyxPQUFMLENBQWEsRUFBRSxXQUFGLENBQWIsRUFBNkIsRUFBN0IsQ0FBSixFQUFzQztBQUNwQyxZQUFFLEtBQUYsSUFBVyxFQUFFLFdBQUYsQ0FBWDtBQUNBLGtCQUFRLFdBQVI7QUFDRCxTQUhELE1BR087QUFDTDtBQUNEO0FBQ0Y7QUFDRCxRQUFFLEtBQUYsSUFBVyxJQUFYO0FBQ0Q7Ozs2QkFFUTtBQUNQLFVBQU0sSUFBSSxLQUFLLElBQWY7O0FBRUEsVUFBSSxNQUFNLEVBQUUsTUFBWjs7QUFFQSxVQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBTyxTQUFQO0FBQ0Q7QUFDRCxVQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsZUFBTyxLQUFLLElBQUwsQ0FBVSxHQUFWLEVBQVA7QUFDRDtBQUNELFVBQU0sTUFBTSxFQUFFLENBQUYsQ0FBWjs7O0FBR0EsUUFBRSxDQUFGLElBQU8sRUFBRSxHQUFGLEVBQVA7QUFDQTs7O0FBR0EsVUFBSSxRQUFRLENBQVo7O0FBRUEsVUFBTSxPQUFPLEVBQUUsS0FBRixDQUFiOztBQUVBLGFBQU8sUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFNLENBQWpCLENBQWYsRUFBb0M7QUFDbEMsWUFBTSxpQkFBaUIsSUFBSSxLQUFKLEdBQVksQ0FBbkM7O0FBRUEsWUFBTSxrQkFBa0IsSUFBSSxLQUFKLEdBQVksQ0FBcEM7O0FBRUEsWUFBTSxvQkFBb0Isa0JBQWtCLEdBQWxCLElBRWYsQ0FBQyxLQUFLLE9BQUwsQ0FBYSxFQUFFLGVBQUYsQ0FBYixFQUFpQyxFQUFFLGNBQUYsQ0FBakMsQ0FGYyxHQUdWLGVBSFUsR0FHUSxjQUhsQzs7QUFLQSxZQUFJLEtBQUssT0FBTCxDQUFhLEVBQUUsaUJBQUYsQ0FBYixFQUFtQyxJQUFuQyxDQUFKLEVBQThDO0FBQzVDO0FBQ0Q7O0FBRUQsVUFBRSxLQUFGLElBQVcsRUFBRSxpQkFBRixDQUFYO0FBQ0EsZ0JBQVEsaUJBQVI7QUFDRDtBQUNELFFBQUUsS0FBRixJQUFXLElBQVg7QUFDQSxhQUFPLEdBQVA7QUFDRDs7Ozs7O1FBR00sSyxHQUFBLEs7UUFBTyxNLEdBQUEsTTs7Ozs7Ozs7Ozs7OztJQ25MVixNO0FBQ0osb0JBQTJDO0FBQUEsUUFBL0IsSUFBK0IseURBQXZCLElBQUksSUFBSixFQUFELENBQWEsT0FBYixFQUF3Qjs7QUFBQTs7QUFDekMsUUFBSSxPQUFRLElBQVIsS0FBa0IsUTtBQUFsQixRQUNPLEtBQUssSUFBTCxDQUFVLElBQVYsTUFBb0IsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUQvQixFQUNpRDs7QUFDL0MsWUFBTSxJQUFJLFNBQUosQ0FBYywrQkFBZCxDQUFOLEM7QUFDRCxLOzs7QUFJRCxTQUFLLENBQUwsR0FBUyxHQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsR0FBVDtBQUNBLFNBQUssUUFBTCxHQUFnQixVQUFoQixDO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLFVBQWxCLEM7QUFDQSxTQUFLLFVBQUwsR0FBa0IsVUFBbEIsQzs7QUFFQSxTQUFLLEVBQUwsR0FBVSxJQUFJLEtBQUosQ0FBVSxLQUFLLENBQWYsQ0FBVixDO0FBQ0EsU0FBSyxHQUFMLEdBQVcsS0FBSyxDQUFMLEdBQVMsQ0FBcEIsQzs7O0FBR0EsU0FBSyxhQUFMLENBQW1CLENBQUMsSUFBRCxDQUFuQixFQUEyQixDQUEzQjtBQUNEOzs7O2lDQUVZLEMsRUFBRztBQUNkLFdBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxNQUFNLENBQW5CO0FBQ0EsV0FBSyxLQUFLLEdBQUwsR0FBVyxDQUFoQixFQUFtQixLQUFLLEdBQUwsR0FBVyxLQUFLLENBQW5DLEVBQXNDLEtBQUssR0FBTCxFQUF0QyxFQUFrRDtBQUNoRCxZQUFJLElBQUksS0FBSyxFQUFMLENBQVEsS0FBSyxHQUFMLEdBQVcsQ0FBbkIsSUFBeUIsS0FBSyxFQUFMLENBQVEsS0FBSyxHQUFMLEdBQVcsQ0FBbkIsTUFBMEIsRUFBM0Q7QUFDQSxhQUFLLEVBQUwsQ0FBUSxLQUFLLEdBQWIsSUFBcUIsQ0FBRSxDQUFDLENBQUMsSUFBSSxVQUFMLE1BQXFCLEVBQXRCLElBQTRCLFVBQTdCLElBQTRDLEVBQTdDLElBQW1ELENBQUMsSUFBSSxVQUFMLElBQW1CLFVBQXZFLEdBQ1osS0FBSyxHQURiOzs7OztBQU1BLGFBQUssRUFBTCxDQUFRLEtBQUssR0FBYixPQUF1QixDQUF2Qjs7QUFFRDtBQUNGOzs7a0NBRWEsUSxFQUFVLFUsRUFBWTtBQUNsQyxVQUFJLFVBQUo7VUFBTyxVQUFQO1VBQVUsVUFBVjs7QUFFQSxXQUFLLFlBQUwsQ0FBa0IsUUFBbEI7QUFDQSxVQUFJLENBQUosQ0FBTyxJQUFJLENBQUo7QUFDUCxVQUFLLEtBQUssQ0FBTCxHQUFTLFVBQVQsR0FBc0IsS0FBSyxDQUEzQixHQUErQixVQUFwQztBQUNBLGFBQU8sQ0FBUCxFQUFVLEdBQVYsRUFBZTtBQUNiLFlBQUksSUFBSSxLQUFLLEVBQUwsQ0FBUSxJQUFJLENBQVosSUFBa0IsS0FBSyxFQUFMLENBQVEsSUFBSSxDQUFaLE1BQW1CLEVBQTdDO0FBQ0EsYUFBSyxFQUFMLENBQVEsQ0FBUixJQUFhLENBQUMsS0FBSyxFQUFMLENBQVEsQ0FBUixJQUFjLENBQUUsQ0FBQyxDQUFDLElBQUksVUFBTCxNQUFxQixFQUF0QixJQUE0QixPQUE3QixJQUF5QyxFQUExQyxJQUFpRCxDQUFDLElBQUksVUFBTCxJQUFtQixPQUFuRixJQUNMLFNBQVMsQ0FBVCxDQURLLEdBQ1MsQ0FEdEIsQztBQUVBLGFBQUssRUFBTCxDQUFRLENBQVIsT0FBZ0IsQ0FBaEIsQztBQUNBLFlBQUs7QUFDTCxZQUFJLEtBQUssS0FBSyxDQUFkLEVBQWlCO0FBQUUsZUFBSyxFQUFMLENBQVEsQ0FBUixJQUFhLEtBQUssRUFBTCxDQUFRLEtBQUssQ0FBTCxHQUFTLENBQWpCLENBQWIsQ0FBa0MsSUFBSSxDQUFKO0FBQVE7QUFDN0QsWUFBSSxLQUFLLFVBQVQsRUFBcUIsSUFBSSxDQUFKO0FBQ3RCO0FBQ0QsV0FBSyxJQUFJLEtBQUssQ0FBTCxHQUFTLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLFlBQUksSUFBSSxLQUFLLEVBQUwsQ0FBUSxJQUFJLENBQVosSUFBa0IsS0FBSyxFQUFMLENBQVEsSUFBSSxDQUFaLE1BQW1CLEVBQTdDO0FBQ0EsYUFBSyxFQUFMLENBQVEsQ0FBUixJQUFhLENBQUMsS0FBSyxFQUFMLENBQVEsQ0FBUixJQUFjLENBQUUsQ0FBQyxDQUFDLElBQUksVUFBTCxNQUFxQixFQUF0QixJQUE0QixVQUE3QixJQUE0QyxFQUE3QyxJQUFtRCxDQUFDLElBQUksVUFBTCxJQUFtQixVQUFyRixJQUNMLENBRFIsQztBQUVBLGFBQUssRUFBTCxDQUFRLENBQVIsT0FBZ0IsQ0FBaEIsQztBQUNBO0FBQ0EsWUFBSSxLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUFFLGVBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQUwsR0FBUyxDQUFqQixDQUFiLENBQWtDLElBQUksQ0FBSjtBQUFRO0FBQzlEOztBQUVELFdBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxVQUFiLEM7QUFDRDs7O29DQUVlO0FBQ2QsVUFBSSxVQUFKOztBQUVBLFVBQU0sUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsS0FBSyxRQUFwQixDQUFkOzs7O0FBSUEsVUFBSSxLQUFLLEdBQUwsSUFBWSxLQUFLLENBQXJCLEVBQXdCOztBQUN0QixZQUFJLFdBQUo7O0FBRUEsWUFBSSxLQUFLLEdBQUwsS0FBYSxLQUFLLENBQUwsR0FBUyxDQUExQixFO0FBQ0UsZUFBSyxZQUFMLENBQWtCLElBQWxCLEU7O0FBRUYsYUFBSyxLQUFLLENBQVYsRUFBYSxLQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBaEMsRUFBbUMsSUFBbkMsRUFBeUM7QUFDdkMsY0FBSyxLQUFLLEVBQUwsQ0FBUSxFQUFSLElBQWMsS0FBSyxVQUFwQixHQUFtQyxLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQWIsSUFBa0IsS0FBSyxVQUE5RDtBQUNBLGVBQUssRUFBTCxDQUFRLEVBQVIsSUFBYyxLQUFLLEVBQUwsQ0FBUSxLQUFLLEtBQUssQ0FBbEIsSUFBd0IsTUFBTSxDQUE5QixHQUFtQyxNQUFNLElBQUksR0FBVixDQUFqRDtBQUNEO0FBQ0QsZUFBTSxLQUFLLEtBQUssQ0FBTCxHQUFTLENBQXBCLEVBQXVCLElBQXZCLEVBQTZCO0FBQzNCLGNBQUssS0FBSyxFQUFMLENBQVEsRUFBUixJQUFjLEtBQUssVUFBcEIsR0FBbUMsS0FBSyxFQUFMLENBQVEsS0FBSyxDQUFiLElBQWtCLEtBQUssVUFBOUQ7QUFDQSxlQUFLLEVBQUwsQ0FBUSxFQUFSLElBQWMsS0FBSyxFQUFMLENBQVEsTUFBTSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQXBCLENBQVIsSUFBbUMsTUFBTSxDQUF6QyxHQUE4QyxNQUFNLElBQUksR0FBVixDQUE1RDtBQUNEO0FBQ0QsWUFBSyxLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQUwsR0FBUyxDQUFqQixJQUFzQixLQUFLLFVBQTVCLEdBQTJDLEtBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxLQUFLLFVBQWpFO0FBQ0EsYUFBSyxFQUFMLENBQVEsS0FBSyxDQUFMLEdBQVMsQ0FBakIsSUFBc0IsS0FBSyxFQUFMLENBQVEsS0FBSyxDQUFMLEdBQVMsQ0FBakIsSUFBdUIsTUFBTSxDQUE3QixHQUFrQyxNQUFNLElBQUksR0FBVixDQUF4RDs7QUFFQSxhQUFLLEdBQUwsR0FBVyxDQUFYO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEVBQUwsQ0FBUSxLQUFLLEdBQUwsRUFBUixDQUFKOzs7QUFHQSxXQUFNLE1BQU0sRUFBWjtBQUNBLFdBQU0sS0FBSyxDQUFOLEdBQVcsVUFBaEI7QUFDQSxXQUFNLEtBQUssRUFBTixHQUFZLFVBQWpCO0FBQ0EsV0FBTSxNQUFNLEVBQVo7O0FBRUEsYUFBTyxNQUFNLENBQWI7QUFDRDs7O29DQUVlO0FBQ2QsYUFBUSxLQUFLLGFBQUwsT0FBeUIsQ0FBakM7QUFDRDs7O29DQUVlO0FBQ2QsYUFBTyxLQUFLLGFBQUwsTUFBd0IsTUFBTSxZQUE5QixDQUFQOztBQUVEOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssbUJBQVQsRUFBOEI7QUFDNUIsWUFBSSxLQUFLLElBQVQsRUFBZTtBQUNiLGVBQUssYUFBTDtBQUNEO0FBQ0QsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNEO0FBQ0QsYUFBTyxLQUFLLGFBQUwsTUFBd0IsTUFBTSxZQUE5QixDQUFQOztBQUVEOzs7b0NBRWU7QUFDZCxhQUFPLENBQUMsS0FBSyxhQUFMLEtBQXVCLEdBQXhCLEtBQWdDLE1BQU0sWUFBdEMsQ0FBUDs7QUFFRDs7O29DQUVlO0FBQ2QsVUFBTSxJQUFJLEtBQUssYUFBTCxPQUF5QixDQUFuQztVQUFzQyxJQUFJLEtBQUssYUFBTCxPQUF5QixDQUFuRTs7QUFFQSxhQUFPLENBQUMsSUFBSSxVQUFKLEdBQWlCLENBQWxCLEtBQXdCLE1BQU0sa0JBQTlCLENBQVA7QUFDRDs7O2dDQUVXLE0sRUFBUTtBQUNsQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0Qjs7QUFDMUIsY0FBTSxJQUFJLFdBQUosQ0FBZ0IseURBQWhCLENBQU4sQztBQUNELE87O0FBRUQsVUFBTSxJQUFJLEtBQUssTUFBTCxFQUFWOztBQUVBLGFBQU8sQ0FBQyxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUQsR0FBZSxNQUF0QjtBQUNEOzs7MEJBRUssSyxFQUFPLEksRUFBTTtBQUNqQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0Qjs7QUFDMUIsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsdURBQWhCLENBQU4sQztBQUNELE87Ozs7O0FBS0QsVUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixZQUFNLE9BQU8sS0FBSyxJQUFMLENBQVUsTUFBTSxLQUFOLEdBQWMsR0FBeEIsQ0FBYjs7QUFFQSxZQUFNLE1BQU0sUUFBUSxLQUFLLElBQXpCOztBQUVBLFlBQU0sTUFBTSxRQUFRLElBQXBCOztBQUVBLGVBQU8sSUFBUCxFQUFhO0FBQ1gsY0FBSSxLQUFLLEtBQUssTUFBTCxFQUFUO0FBQ0EsY0FBSyxLQUFLLElBQU4sSUFBZ0IsSUFBSSxTQUF4QixFQUFvQztBQUNsQztBQUNEO0FBQ0QsY0FBTSxLQUFLLE1BQU0sS0FBSyxNQUFMLEVBQWpCOztBQUVBLGNBQU0sSUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFNLE1BQU0sRUFBWixDQUFULElBQTRCLElBQXRDOztBQUVBLGNBQUksSUFBSSxRQUFRLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBaEI7QUFDQSxjQUFNLElBQUksS0FBSyxFQUFMLEdBQVUsRUFBcEI7O0FBRUEsY0FBTSxJQUFJLE1BQU0sTUFBTSxDQUFaLEdBQWdCLENBQTFCOztBQUVBLGNBQUssSUFBSSxLQUFLLGFBQVQsR0FBeUIsTUFBTSxDQUEvQixJQUFvQyxHQUFyQyxJQUE4QyxLQUFLLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBdkQsRUFBcUU7QUFDbkUsbUJBQU8sSUFBSSxJQUFYO0FBQ0Q7QUFDRjtBQUNGLE9BekJELE1BeUJPLElBQUksVUFBVSxHQUFkLEVBQW1CO0FBQ3hCLFlBQUksSUFBSSxLQUFLLE1BQUwsRUFBUjtBQUNBLGVBQU8sS0FBSyxJQUFaLEVBQWtCO0FBQ2hCLGNBQUksS0FBSyxNQUFMLEVBQUo7QUFDRDtBQUNELGVBQU8sQ0FBQyxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUQsR0FBZSxJQUF0QjtBQUNELE9BTk0sTUFNQTtBQUNMLGVBQU8sSUFBUCxFQUFhO0FBQ1gsY0FBSSxJQUFJLEtBQUssTUFBTCxFQUFSO0FBQ0EsY0FBTSxJQUFJLENBQUMsS0FBSyxDQUFMLEdBQVMsS0FBVixJQUFtQixLQUFLLENBQWxDOztBQUVBLGNBQU0sSUFBSSxJQUFJLENBQWQ7O0FBRUEsY0FBSSxLQUFLLEdBQVQsRUFBYztBQUNaLGdCQUFJLElBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sS0FBbEIsQ0FBUjtBQUNELFdBRkQsTUFFTztBQUNMLGdCQUFJLElBQUksQ0FBQyxLQUFLLEdBQUwsQ0FBUyxDQUFDLElBQUksQ0FBTCxJQUFVLEtBQW5CLENBQVQ7QUFDRDtBQUNELGNBQUksS0FBSyxLQUFLLE1BQUwsRUFBVDtBQUNBLGNBQUksSUFBSSxHQUFSLEVBQWE7QUFDWCxnQkFBSSxNQUFNLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBYSxRQUFRLEdBQXJCLENBQVYsRUFBc0M7QUFDcEM7QUFDRDtBQUNGLFdBSkQsTUFJTyxJQUFJLE1BQU0sS0FBSyxHQUFMLENBQVMsQ0FBQyxDQUFWLENBQVYsRUFBd0I7QUFDN0I7QUFDRDtBQUNGO0FBQ0QsZUFBTyxJQUFJLElBQVg7QUFDRDtBQUVGOzs7MkJBRU0sRSxFQUFJLEssRUFBTztBQUNoQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0Qjs7QUFDMUIsY0FBTSxJQUFJLFdBQUosQ0FBZ0Isc0RBQWhCLENBQU4sQztBQUNELE87O0FBRUQsVUFBSSxJQUFJLEtBQUssVUFBYjs7QUFFQSxXQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxVQUFJLENBQUMsQ0FBTCxFQUFRO0FBQ04sWUFBTSxJQUFJLEtBQUssTUFBTCxLQUFnQixDQUFoQixHQUFvQixLQUFLLEVBQW5DOztBQUVBLFlBQU0sSUFBSSxLQUFLLElBQUwsQ0FBVSxDQUFDLEdBQUQsR0FBTyxLQUFLLEdBQUwsQ0FBUyxNQUFNLEtBQUssTUFBTCxFQUFmLENBQWpCLENBQVY7O0FBRUEsWUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFULElBQWMsQ0FBbEI7QUFDQSxhQUFLLFVBQUwsR0FBa0IsS0FBSyxHQUFMLENBQVMsQ0FBVCxJQUFjLENBQWhDO0FBQ0Q7QUFDRCxhQUFPLEtBQUssSUFBSSxLQUFoQjtBQUNEOzs7MkJBRU0sSyxFQUFPO0FBQ1osVUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7O0FBQzFCLGNBQU0sSUFBSSxXQUFKLENBQWdCLDhDQUFoQixDQUFOLEM7QUFDRCxPOztBQUVELFVBQU0sSUFBSSxLQUFLLE1BQUwsRUFBVjs7QUFFQSxhQUFPLE1BQU0sS0FBSyxHQUFMLENBQVUsSUFBSSxDQUFkLEVBQWtCLE1BQU0sS0FBeEIsQ0FBYjtBQUNEOzs7K0JBRVUsSyxFQUFPLEssRUFBTyxJLEVBQU07O0FBRTdCLFVBQUksVUFBVSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCOztBQUMxQixjQUFNLElBQUksV0FBSixDQUFnQixtRUFBaEIsQ0FBTixDO0FBQ0QsTzs7QUFFRCxVQUFNLElBQUksQ0FBQyxPQUFPLEtBQVIsS0FBa0IsUUFBUSxLQUExQixDQUFWOztBQUVBLFVBQU0sSUFBSSxLQUFLLE1BQUwsRUFBVjs7QUFFQSxVQUFJLEtBQUssQ0FBVCxFQUFZO0FBQ1YsZUFBTyxRQUFRLEtBQUssSUFBTCxDQUFVLEtBQUssUUFBUSxLQUFiLEtBQXVCLE9BQU8sS0FBOUIsQ0FBVixDQUFmO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxRQUFRLEtBQUssSUFBTCxDQUFVLENBQUMsSUFBSSxDQUFMLEtBQVcsUUFBUSxLQUFuQixLQUE2QixRQUFRLElBQXJDLENBQVYsQ0FBZjtBQUNEO0FBQ0Y7Ozs7Ozs7Ozs7NEJBT08sSyxFQUFPLEssRUFBTztBQUNwQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0Qjs7QUFDMUIsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsMERBQWhCLENBQU4sQztBQUNELE87QUFDRCxhQUFPLFFBQVEsS0FBSyxNQUFMLE1BQWlCLFFBQVEsS0FBekIsQ0FBZjtBQUNEOzs7NEJBRU8sSyxFQUFPLEksRUFBTTtBQUNuQixVQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0Qjs7QUFDMUIsY0FBTSxJQUFJLFdBQUosQ0FBZ0IseURBQWhCLENBQU4sQztBQUNELE87QUFDRCxVQUFNLElBQUksTUFBTSxLQUFLLE1BQUwsRUFBaEI7O0FBRUEsYUFBTyxRQUFRLEtBQUssR0FBTCxDQUFTLENBQUMsS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFWLEVBQXVCLE1BQU0sSUFBN0IsQ0FBZjtBQUNEOzs7Ozs7Ozs7OztBQU9ILE9BQU8sU0FBUCxDQUFpQixJQUFqQixHQUF3QixLQUFLLEdBQUwsQ0FBUyxHQUFULENBQXhCO0FBQ0EsT0FBTyxTQUFQLENBQWlCLGFBQWpCLEdBQWlDLE1BQU0sS0FBSyxHQUFMLENBQVMsR0FBVCxDQUF2Qzs7UUFFUyxNLEdBQUEsTTtrQkFDTSxNOzs7Ozs7Ozs7Ozs7QUM3UmY7Ozs7SUFFTSxPO0FBQ0osbUJBQVksTUFBWixFQUFvQixXQUFwQixFQUFpQyxTQUFqQyxFQUE0QztBQUFBOztBQUMxQyxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNEOzs7OzZCQUVROztBQUVQLFVBQUksS0FBSyxLQUFMLElBQWMsS0FBSyxLQUFMLENBQVcsQ0FBWCxNQUFrQixJQUFwQyxFQUEwQztBQUN4QyxlQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxNQUFkLEVBQVA7QUFDRDs7O0FBR0QsVUFBSSxLQUFLLFFBQVQsRUFBbUIsT0FBTyxJQUFQOzs7QUFHbkIsVUFBSSxLQUFLLFNBQVQsRUFBb0I7OztBQUdwQixXQUFLLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEsVUFBSSxLQUFLLFNBQUwsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsYUFBSyxTQUFMLEdBQWlCLEtBQUssTUFBTCxDQUFZLElBQVosRUFBakI7QUFDRDs7QUFFRCxVQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFlBQUssS0FBSyxNQUFMLHVCQUFELElBQ2MsS0FBSyxNQUFMLHNCQURsQixFQUNpRDtBQUMvQyxlQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixJQUE3QixDQUFrQyxLQUFLLE1BQXZDO0FBQ0EsZUFBSyxNQUFMLENBQVksZ0JBQVosQ0FBNkIsSUFBN0IsQ0FBa0MsS0FBSyxNQUF2QztBQUNEO0FBQ0Y7O0FBRUQsVUFBSSxDQUFDLEtBQUssS0FBVixFQUFpQjtBQUNmO0FBQ0Q7QUFDRCxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEM7O0FBRTFDLGFBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxTQUFkLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxLQUE0QixDQUFoQyxFQUFtQztBQUNqQyxlQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxHQUEwQixLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQTFCO0FBQ0Q7QUFDRjtBQUNGOzs7eUJBRUksUSxFQUFVLE8sRUFBUyxRLEVBQVU7QUFDaEMsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixRQUEzQixFQUFxQyxNQUFyQzs7QUFFQSxXQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0IsUUFBcEIsQ0FBcEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzhCQUVTLEssRUFBTyxRLEVBQVUsTyxFQUFTLFEsRUFBVTtBQUM1QywwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLFNBQTNCLEVBQXNDLFFBQXRDLEVBQWdELE1BQWhEO0FBQ0EsVUFBSSxLQUFLLFFBQVQsRUFBbUIsT0FBTyxJQUFQOztBQUVuQixVQUFNLEtBQUssS0FBSyxXQUFMLENBQWlCLEtBQUssV0FBTCxHQUFtQixLQUFwQyxFQUEyQyxRQUEzQyxFQUFxRCxPQUFyRCxFQUE4RCxRQUE5RCxDQUFYOztBQUVBLFdBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsQ0FBNkIsRUFBN0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2dDQUVXLEssRUFBTyxRLEVBQVUsTyxFQUFTLFEsRUFBVTtBQUM5QywwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLFNBQTNCLEVBQXNDLFFBQXRDLEVBQWdELE1BQWhEO0FBQ0EsVUFBSSxLQUFLLFFBQVQsRUFBbUIsT0FBTyxJQUFQOztBQUVuQixVQUFJLDJCQUFKLEVBQTRCO0FBQzFCLFlBQUksS0FBSyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsUUFBcEIsRUFBOEIsT0FBOUIsRUFBdUMsUUFBdkMsQ0FBVDtBQUNBLFdBQUcsR0FBSCxHQUFTLEtBQVQ7QUFDQSxjQUFNLFdBQU4sQ0FBa0IsRUFBbEI7QUFFRCxPQUxELE1BS08sSUFBSSxpQkFBaUIsS0FBckIsRUFBNEI7QUFDakMsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7O0FBRXJDLGNBQUksS0FBSyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsUUFBcEIsRUFBOEIsT0FBOUIsRUFBdUMsUUFBdkMsQ0FBVDtBQUNBLGFBQUcsR0FBSCxHQUFTLE1BQU0sQ0FBTixDQUFUO0FBQ0EsZ0JBQU0sQ0FBTixFQUFTLFdBQVQsQ0FBcUIsRUFBckI7QUFDRDtBQUNGOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7NEJBRU8sSSxFQUFNO0FBQ1osV0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7OEJBRVM7QUFDUixVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNwQixXQUFLLE1BQUw7QUFDQSxVQUFJLENBQUMsS0FBSyxTQUFWLEVBQXFCOztBQUVyQixVQUFJLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBdEMsRUFBeUM7QUFDdkMsYUFBSyxXQUFMLENBQWlCLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxNQUEvQixFQUNjLEtBQUssR0FEbkIsRUFFYyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsSUFGNUI7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLLFdBQUwsQ0FBaUIsS0FBSyxNQUF0QixFQUNjLEtBQUssR0FEbkIsRUFFYyxLQUFLLElBRm5CO0FBR0Q7QUFFRjs7OzBDQUVxQjs7OztBQUlwQixXQUFLLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUEsVUFBSSxDQUFDLEtBQUssS0FBTixJQUFlLEtBQUssS0FBTCxDQUFXLENBQVgsTUFBa0IsSUFBckMsRUFBMkM7QUFDekM7QUFDRDs7QUFFRCxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEM7O0FBRTFDLGFBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxTQUFkLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxLQUE0QixDQUFoQyxFQUFtQztBQUNqQyxlQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxHQUEwQixLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQTFCO0FBQ0Q7QUFDRjtBQUNGOzs7MkJBRU07QUFDTCxhQUFPLElBQVA7QUFDRDs7O2dDQUVXLFMsRUFBVyxRLEVBQVUsTyxFQUFTLFEsRUFBVTtBQUNsRCxVQUFNLEtBQUssSUFBSSxPQUFKLENBRUMsS0FBSyxNQUZOLEVBR0MsS0FBSyxXQUhOLEVBSUMsU0FKRCxDQUFYOztBQU1BLFNBQUcsU0FBSCxDQUFhLElBQWIsQ0FBa0IsQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixRQUFwQixDQUFsQjs7QUFFQSxVQUFJLEtBQUssS0FBTCxLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLGFBQUssS0FBTCxHQUFhLENBQUMsSUFBRCxDQUFiO0FBQ0Q7O0FBRUQsV0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixFQUFoQjtBQUNBLFNBQUcsS0FBSCxHQUFXLEtBQUssS0FBaEI7QUFDQSxhQUFPLEVBQVA7QUFDRDs7O2dDQUVXLE0sRUFBUSxHLEVBQUssSSxFQUFNO0FBQzdCLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDs7QUFFOUMsWUFBTSxXQUFXLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBakI7O0FBRUEsWUFBSSxDQUFDLFFBQUwsRUFBZTs7QUFFZixZQUFJLFVBQVUsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFsQixDQUFkOztBQUVBLFlBQUksQ0FBQyxPQUFMLEVBQWMsVUFBVSxLQUFLLE1BQWY7O0FBRWQsWUFBTSxXQUFXLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBakI7O0FBRUEsZ0JBQVEsY0FBUixHQUF5QixNQUF6QjtBQUNBLGdCQUFRLGVBQVIsR0FBMEIsR0FBMUI7QUFDQSxnQkFBUSxZQUFSLEdBQXVCLElBQXZCOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixtQkFBUyxJQUFULENBQWMsT0FBZDtBQUNELFNBRkQsTUFFTyxJQUFJLG9CQUFvQixLQUF4QixFQUErQjtBQUNwQyxtQkFBUyxLQUFULENBQWUsT0FBZixFQUF3QixRQUF4QjtBQUNELFNBRk0sTUFFQTtBQUNMLG1CQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLFFBQXZCO0FBQ0Q7O0FBRUQsZ0JBQVEsY0FBUixHQUF5QixJQUF6QjtBQUNBLGdCQUFRLGVBQVIsR0FBMEIsSUFBMUI7QUFDQSxnQkFBUSxZQUFSLEdBQXVCLElBQXZCO0FBQ0Q7QUFDRjs7Ozs7O1FBR00sTyxHQUFBLE87Ozs7Ozs7Ozs7OztBQ3hMVDs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFHTSxNOzs7QUFDSixrQkFBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCO0FBQUE7O0FBQUEsMEZBQ2YsSUFEZTs7QUFFckIsVUFBSyxHQUFMLEdBQVcsR0FBWDtBQUZxQjtBQUd0Qjs7OzsyQkFFTTtBQUNMLGFBQU8sS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFQO0FBQ0Q7Ozs2QkFFUSxRLEVBQVU7QUFDakIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFNLEtBQUsscUJBRUQsSUFGQyxFQUdELEtBQUssR0FBTCxDQUFTLElBQVQsRUFIQyxFQUlELEtBQUssR0FBTCxDQUFTLElBQVQsS0FBa0IsUUFKakIsQ0FBWDs7QUFNQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsTUFBZixDQUFzQixFQUF0QjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7OEJBRVMsSyxFQUFPO0FBQ2YsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixLQUEzQjs7QUFFQSxVQUFNLEtBQUsscUJBQVksSUFBWixFQUFrQixLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWxCLEVBQW1DLENBQW5DLENBQVg7O0FBRUEsU0FBRyxNQUFILEdBQVksS0FBWjtBQUNBLFlBQU0sV0FBTixDQUFrQixFQUFsQjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7K0JBRVUsSyxFQUFPO0FBQ2hCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLEtBQVo7QUFDQSxZQUFNLFFBQU4sQ0FBZSxFQUFmO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7OztnQ0FFVyxRLEVBQVUsUSxFQUFVO0FBQzlCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsUUFBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLFFBQVo7QUFDQSxlQUFTLEdBQVQsQ0FBYSxRQUFiLEVBQXVCLEVBQXZCO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7Ozs4QkFFUyxNLEVBQVEsTSxFQUFRO0FBQ3hCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsTUFBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLE1BQVo7QUFDQSxhQUFPLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLEVBQW5CO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7Ozs4QkFFUyxNLEVBQVEsTSxFQUFRO0FBQ3hCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsTUFBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLE1BQVo7QUFDQSxhQUFPLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLEVBQW5CO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7Ozs2QkFFUSxLLEVBQU8sRyxFQUFLO0FBQ25CLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLEtBQVo7QUFDQSxZQUFNLEdBQU4sQ0FBVSxHQUFWLEVBQWUsRUFBZjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7NkJBRVEsSyxFQUFPLE0sRUFBUTtBQUN0QixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLEtBQTNCLEVBQWtDLFFBQWxDOztBQUVBLFVBQU0sS0FBSyxxQkFBWSxJQUFaLEVBQWtCLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBbEIsRUFBbUMsQ0FBbkMsQ0FBWDs7QUFFQSxTQUFHLE1BQUgsR0FBWSxLQUFaO0FBQ0EsWUFBTSxHQUFOLENBQVUsTUFBVixFQUFrQixFQUFsQjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7eUJBRUksTyxFQUFTLEssRUFBTyxRLEVBQVU7QUFDN0IsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFNLEtBQUsscUJBQVksS0FBSyxHQUFqQixFQUFzQixLQUFLLElBQUwsRUFBdEIsRUFBbUMsS0FBSyxJQUFMLEtBQWMsS0FBakQsQ0FBWDs7QUFFQSxTQUFHLE1BQUgsR0FBWSxJQUFaO0FBQ0EsU0FBRyxHQUFILEdBQVMsT0FBVDtBQUNBLFNBQUcsSUFBSCxHQUFVLFFBQVY7QUFDQSxTQUFHLE9BQUgsR0FBYSxLQUFLLEdBQUwsQ0FBUyxXQUF0Qjs7QUFFQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsTUFBZixDQUFzQixFQUF0QjtBQUNEOzs7d0JBRUcsTyxFQUFTO0FBQ1gsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsT0FBYixFQUFzQixJQUF0QjtBQUNEOzs7Ozs7SUFHRyxHO0FBQ0osaUJBQWM7QUFBQTs7QUFDWixTQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsb0JBQWI7QUFDQSxTQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0Q7Ozs7MkJBRU07QUFDTCxhQUFPLEtBQUssT0FBWjtBQUNEOzs7a0NBRWE7QUFDWixVQUFNLFNBQVMsS0FBSyxNQUFwQjs7QUFFQSxVQUFNLFVBQVUsS0FBSyxHQUFyQjs7QUFFQSxVQUFNLFdBQVcsS0FBSyxJQUF0Qjs7QUFFQSxVQUFNLE1BQU0sT0FBTyxHQUFuQjs7QUFFQSxVQUFJLENBQUMsUUFBTCxFQUFlOztBQUViLGFBQUssSUFBSSxJQUFJLElBQUksUUFBSixDQUFhLE1BQWIsR0FBc0IsQ0FBbkMsRUFBc0MsS0FBSyxDQUEzQyxFQUE4QyxHQUE5QyxFQUFtRDtBQUNqRCxjQUFJLFNBQVMsSUFBSSxRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsY0FBSSxXQUFXLE1BQWYsRUFBdUI7QUFDdkIsY0FBSSxPQUFPLFNBQVgsRUFBc0IsT0FBTyxTQUFQLENBQWlCLElBQWpCLENBQXNCLE1BQXRCLEVBQThCLE1BQTlCLEVBQXNDLE9BQXRDO0FBQ3ZCO0FBQ0YsT0FQRCxNQU9PLElBQUksb0JBQW9CLEtBQXhCLEVBQStCO0FBQ3BDLGFBQUssSUFBSSxJQUFJLFNBQVMsTUFBVCxHQUFrQixDQUEvQixFQUFrQyxLQUFLLENBQXZDLEVBQTBDLEdBQTFDLEVBQStDO0FBQzdDLGNBQUksU0FBUyxTQUFTLENBQVQsQ0FBYjtBQUNBLGNBQUksV0FBVyxNQUFmLEVBQXVCO0FBQ3ZCLGNBQUksT0FBTyxTQUFYLEVBQXNCLE9BQU8sU0FBUCxDQUFpQixJQUFqQixDQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxPQUF0QztBQUN2QjtBQUNGLE9BTk0sTUFNQTtBQUNMLFlBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCLG1CQUFTLFNBQVQsQ0FBbUIsSUFBbkIsQ0FBd0IsUUFBeEIsRUFBa0MsTUFBbEMsRUFBMEMsT0FBMUM7QUFDRDtBQUNGO0FBQ0Y7Ozs4QkFFUyxLLEVBQU8sSSxFQUFlOztBQUU5QixVQUFJLENBQUMsTUFBTSxTQUFOLENBQWdCLEtBQXJCLEVBQTRCOztBQUMxQixjQUFNLElBQUksS0FBSixtQkFBMEIsTUFBTSxJQUFoQyx5Q0FBTjtBQUNEOztBQUVELFVBQUksU0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBQWdCLElBQWhCLENBQWI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE1BQW5COztBQVA4Qix3Q0FBTixJQUFNO0FBQU4sWUFBTTtBQUFBOztBQVM5QixhQUFPLEtBQVAsZUFBZ0IsSUFBaEI7O0FBRUEsYUFBTyxNQUFQO0FBQ0Q7Ozs2QkFFUSxPLEVBQVMsUyxFQUFXOztBQUUzQixVQUFJLENBQUMsU0FBTCxFQUFnQjtBQUFFLG9CQUFZLEtBQUssUUFBakI7QUFBNEI7QUFDOUMsVUFBSSxTQUFTLENBQWI7O0FBRUEsYUFBTyxJQUFQLEVBQWE7QUFDWDtBQUNBLFlBQUksU0FBUyxTQUFiLEVBQXdCLE9BQU8sS0FBUDs7O0FBR3hCLFlBQU0sS0FBSyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQVg7OztBQUdBLFlBQUksT0FBTyxTQUFYLEVBQXNCOzs7QUFHdEIsWUFBSSxHQUFHLFNBQUgsR0FBZSxPQUFuQixFQUE0Qjs7O0FBRzVCLGFBQUssT0FBTCxHQUFlLEdBQUcsU0FBbEI7OztBQUdBLFlBQUksR0FBRyxTQUFQLEVBQWtCOztBQUVsQixXQUFHLE9BQUg7QUFDRDs7QUFFRCxXQUFLLFFBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBTyxJQUFQLEVBQWE7QUFDWCxZQUFNLEtBQUssS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFYOztBQUVBLFlBQUksQ0FBQyxFQUFMLEVBQVMsT0FBTyxLQUFQO0FBQ1QsYUFBSyxPQUFMLEdBQWUsR0FBRyxTQUFsQjtBQUNBLFlBQUksR0FBRyxTQUFQLEVBQWtCO0FBQ2xCLFdBQUcsT0FBSDtBQUNBO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRDs7OytCQUVVO0FBQ1QsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssUUFBTCxDQUFjLE1BQWxDLEVBQTBDLEdBQTFDLEVBQStDOztBQUU3QyxZQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsUUFBckIsRUFBK0I7QUFDN0IsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixRQUFqQjtBQUNEO0FBQ0Y7QUFDRjs7OzhCQUVTLE0sRUFBUTtBQUNoQixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLFFBQTNCO0FBQ0EsV0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNEOzs7d0JBRUcsTyxFQUFTLE0sRUFBUTtBQUNuQixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQUksQ0FBQyxLQUFLLE1BQVYsRUFBa0I7QUFDbEIsVUFBSSxZQUFZLEVBQWhCOztBQUVBLFVBQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLFlBQUksT0FBTyxJQUFYLEVBQWlCO0FBQ2YsNkJBQWlCLE9BQU8sSUFBeEI7QUFDRCxTQUZELE1BRU87QUFDTCw2QkFBaUIsT0FBTyxFQUF4QjtBQUNEO0FBQ0Y7QUFDRCxXQUFLLE1BQUwsTUFBZSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLENBQXJCLENBQWYsR0FBeUMsU0FBekMsV0FBd0QsT0FBeEQ7QUFDRDs7Ozs7O0lBR0csUTs7O0FBQ0osb0JBQVksSUFBWixFQUFrQixVQUFsQixFQUE4QixPQUE5QixFQUF1QyxPQUF2QyxFQUFnRDtBQUFBOztBQUFBLDZGQUN4QyxJQUR3Qzs7QUFFOUMsY0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssSUFBTCxHQUFZLFVBQVUsT0FBVixHQUFvQixDQUFoQztBQUNBLFdBQUssT0FBTCxHQUFlLFVBQVUsT0FBVixHQUFvQixDQUFuQztBQUNBLFdBQUssT0FBTCxHQUFnQixZQUFZLFNBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixJQUFJLE9BQWxEOztBQUVBLFlBQVEsVUFBUjs7QUFFQSxXQUFLLFNBQVMsSUFBZDtBQUNFLGVBQUssR0FBTCxHQUFXLE9BQUssT0FBaEI7QUFDQSxlQUFLLEtBQUwsR0FBYSxtQkFBYjtBQUNBO0FBQ0YsV0FBSyxTQUFTLEVBQWQ7QUFDRSxlQUFLLEdBQUwsR0FBVyxPQUFLLG1CQUFoQjtBQUNBLGVBQUssS0FBTCxHQUFhLEVBQWI7QUFDQTtBQUNGLFdBQUssU0FBUyxJQUFkO0FBQ0E7QUFDRSxlQUFLLEdBQUwsR0FBVyxPQUFLLE9BQWhCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLElBQUksS0FBSixDQUFVLE9BQUssT0FBZixDQUFuQjtBQUNBLGVBQUssS0FBTCxHQUFhLG1CQUFiO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQUssV0FBTCxDQUFpQixNQUFyQyxFQUE2QyxHQUE3QyxFQUFrRDs7QUFFaEQsaUJBQUssV0FBTCxDQUFpQixDQUFqQixJQUFzQixJQUF0QjtBQUNEO0FBbEJIOztBQXFCQSxXQUFLLEtBQUwsR0FBYSx1QkFBYjtBQUNBLFdBQUssWUFBTCxHQUFvQixDQUFwQjtBQTlCOEM7QUErQi9DOzs7OzRCQUVPO0FBQ04sV0FBSyxLQUFMLENBQVcsS0FBWDtBQUNBLFdBQUssS0FBTCxDQUFXLEtBQVg7QUFDQSxXQUFLLFlBQUwsR0FBb0IsQ0FBcEI7QUFDRDs7O2tDQUVhO0FBQ1osYUFBTyxLQUFLLEtBQVo7QUFDRDs7O2lDQUVZO0FBQ1gsYUFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFsQjtBQUNEOzs7NEJBRU87QUFDTixhQUFPLEtBQUssWUFBWjtBQUNEOzs7NkJBRVEsUyxFQUFXO0FBQ2xCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsV0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixTQUFwQjtBQUNBLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsUUFBakIsQ0FBMEIsU0FBMUI7QUFDRDs7OzRCQUVPLFEsRUFBVSxFLEVBQUk7QUFDcEIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLFVBQUssS0FBSyxPQUFMLEtBQWlCLENBQWpCLElBQXNCLENBQUMsS0FBSyxJQUE3QixJQUNZLEtBQUssT0FBTCxHQUFlLENBQWYsSUFBb0IsS0FBSyxLQUFMLENBQVcsSUFBWCxNQUFxQixLQUFLLE9BRDlELEVBQ3dFO0FBQ3RFLFdBQUcsR0FBSCxHQUFTLENBQUMsQ0FBVjtBQUNBLFdBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLFdBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCO0FBQ0E7QUFDRDs7QUFFRCxTQUFHLFFBQUgsR0FBYyxRQUFkO0FBQ0EsVUFBTSxNQUFNLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBWjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQWpCO0FBQ0EsV0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixFQUFoQixFQUFvQixHQUFwQjtBQUNBLFdBQUssZUFBTCxDQUFxQixHQUFyQjtBQUNEOzs7b0NBRWUsUyxFQUFXO0FBQ3pCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsYUFBTyxLQUFLLElBQUwsR0FBWSxDQUFaLElBQWlCLENBQUMsS0FBSyxLQUFMLENBQVcsS0FBWCxFQUF6QixFQUE2QztBQUMzQyxZQUFNLEtBQUssS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixTQUFqQixDQUFYLEM7O0FBRUEsWUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEI7QUFDRDtBQUNELGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBckMsRUFBNkMsR0FBN0MsRUFBa0Q7O0FBRWhELGNBQUksS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQUosRUFBeUI7QUFDdkIsaUJBQUssV0FBTCxDQUFpQixDQUFqQixJQUFzQixLQUF0QjtBQUNBLGVBQUcsR0FBSCxHQUFTLENBQVQ7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQsYUFBSyxJQUFMO0FBQ0EsYUFBSyxZQUFMLElBQXFCLEdBQUcsUUFBeEI7OztBQUdBLFdBQUcsbUJBQUg7O0FBRUEsWUFBTSxRQUFRLHFCQUFZLElBQVosRUFBa0IsU0FBbEIsRUFBNkIsWUFBWSxHQUFHLFFBQTVDLENBQWQ7O0FBRUEsY0FBTSxJQUFOLENBQVcsS0FBSyxlQUFoQixFQUFpQyxJQUFqQyxFQUF1QyxFQUF2Qzs7QUFFQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEO0FBQ0Y7OztvQ0FFZSxFLEVBQUk7O0FBRWxCLFdBQUssSUFBTDtBQUNBLFdBQUssV0FBTCxDQUFpQixHQUFHLEdBQXBCLElBQTJCLElBQTNCOztBQUVBLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBRyxXQUFwQixFQUFpQyxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWpDOzs7QUFHQSxXQUFLLGVBQUwsQ0FBcUIsR0FBRyxNQUFILENBQVUsSUFBVixFQUFyQjs7O0FBR0EsU0FBRyxPQUFIO0FBRUQ7Ozs0QkFFTyxRLEVBQVUsRSxFQUFJO0FBQ3BCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7OztBQUdBLFVBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLGFBQUssWUFBTCxJQUFzQixLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLElBQXRCLEtBQStCLEtBQUssU0FBTCxDQUFlLFVBQXBFOztBQUVBLGFBQUssU0FBTCxDQUFlLFNBQWYsR0FDVyxLQUFLLFNBQUwsQ0FBZSxTQUFmLEdBQTJCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsSUFBdEIsRUFEdEM7O0FBR0EsYUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFLLFNBQXJCLEVBQWdDLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBaEM7QUFDRDs7QUFFRCxXQUFLLFNBQUwsR0FBaUIsRUFBakI7O0FBRUEsVUFBSSxDQUFDLEdBQUcsYUFBUixFQUF1QjtBQUNyQixXQUFHLG1CQUFIO0FBQ0EsV0FBRyxTQUFILEdBQWUsUUFBZjtBQUNBLFdBQUcsYUFBSCxHQUFtQixHQUFHLE9BQXRCO0FBQ0EsV0FBRyxPQUFILEdBQWEsS0FBSyxlQUFsQjs7QUFFQSxhQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBakI7QUFDRDs7QUFFRCxTQUFHLFVBQUgsR0FBZ0IsR0FBRyxNQUFILENBQVUsSUFBVixFQUFoQjs7O0FBR0EsU0FBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixLQUFtQixRQUFsQztBQUNBLFNBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCO0FBQ0Q7OztzQ0FFaUI7QUFDaEIsVUFBTSxLQUFLLElBQVg7O0FBRUEsVUFBTSxXQUFXLEdBQUcsTUFBcEI7O0FBRUEsVUFBSSxPQUFPLFNBQVMsU0FBcEIsRUFBK0I7QUFDL0IsZUFBUyxTQUFULEdBQXFCLElBQXJCOzs7QUFHQSxlQUFTLFlBQVQsSUFBMEIsR0FBRyxNQUFILENBQVUsSUFBVixLQUFtQixHQUFHLFVBQWhEO0FBQ0EsZUFBUyxLQUFULENBQWUsS0FBZixDQUFxQixHQUFHLFdBQXhCLEVBQXFDLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBckM7OztBQUdBLFNBQUcsT0FBSCxHQUFhLEdBQUcsYUFBaEI7QUFDQSxhQUFPLEdBQUcsYUFBVjtBQUNBLFNBQUcsT0FBSDs7O0FBR0EsVUFBSSxDQUFDLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBTCxFQUE2QjtBQUMzQixZQUFNLE1BQU0sU0FBUyxLQUFULENBQWUsR0FBZixDQUFtQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQW5CLENBQVo7O0FBRUEsaUJBQVMsT0FBVCxDQUFpQixJQUFJLFNBQXJCLEVBQWdDLEdBQWhDO0FBQ0Q7QUFDRjs7O3dDQUVtQixRLEVBQVUsRSxFQUFJO0FBQ2hDLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsSUFBM0I7QUFDQSxTQUFHLFFBQUgsR0FBYyxRQUFkO0FBQ0EsU0FBRyxtQkFBSDtBQUNBLFdBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBRyxNQUFILENBQVUsSUFBVixFQUFqQjtBQUNBLFdBQUssMkJBQUwsQ0FBaUMsRUFBakMsRUFBcUMsSUFBckM7QUFDRDs7O2dEQUUyQixFLEVBQUksTyxFQUFTO0FBQ3ZDLFVBQU0sVUFBVSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWhCOztBQUVBLFVBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUF4Qjs7QUFFQSxVQUFNLGFBQWEsVUFBVyxDQUFDLE9BQU8sR0FBUixJQUFlLElBQTFCLEdBQW1DLENBQUMsT0FBTyxHQUFSLElBQWUsSUFBckU7O0FBRUEsVUFBTSxXQUFXLEVBQWpCOztBQUVBLFVBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUMzQixhQUFLLFVBQUwsR0FBa0IsT0FBbEI7QUFDRDs7QUFFRCxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBcEIsRUFBMEIsR0FBMUIsRUFBK0I7O0FBRTdCLFlBQU0sS0FBSyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVg7O0FBRUEsWUFBSSxHQUFHLEVBQUgsS0FBVSxFQUFkLEVBQWtCO0FBQ2hCO0FBQ0Q7QUFDRCxZQUFJLFFBQVEscUJBQVksSUFBWixFQUFrQixPQUFsQixFQUEyQixVQUFVLENBQUMsR0FBRyxTQUFILEdBQWUsT0FBaEIsSUFBMkIsVUFBaEUsQ0FBWjtBQUNBLGNBQU0sRUFBTixHQUFXLEdBQUcsRUFBZDtBQUNBLGNBQU0sTUFBTixHQUFlLElBQWY7QUFDQSxjQUFNLE9BQU4sR0FBZ0IsS0FBSywyQkFBckI7QUFDQSxpQkFBUyxJQUFULENBQWMsS0FBZDs7QUFFQSxXQUFHLE1BQUg7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEOzs7QUFHRCxVQUFJLE9BQUosRUFBYTtBQUNYLFlBQUksUUFBUSxxQkFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCLFVBQVUsR0FBRyxRQUFILElBQWUsT0FBTyxDQUF0QixDQUFyQyxDQUFaO0FBQ0EsY0FBTSxFQUFOLEdBQVcsRUFBWDtBQUNBLGNBQU0sTUFBTixHQUFlLElBQWY7QUFDQSxjQUFNLE9BQU4sR0FBZ0IsS0FBSywyQkFBckI7QUFDQSxpQkFBUyxJQUFULENBQWMsS0FBZDs7QUFFQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEOztBQUVELFdBQUssS0FBTCxHQUFhLFFBQWI7OztBQUdBLFVBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUMzQixhQUFLLFlBQUwsSUFBc0IsVUFBVSxLQUFLLFVBQXJDO0FBQ0Q7QUFDRjs7O2tEQUU2QjtBQUM1QixVQUFNLEtBQUssSUFBWDs7QUFFQSxVQUFNLE1BQU0sR0FBRyxNQUFmOztBQUVBLFVBQUksR0FBRyxTQUFQLEVBQWtCO0FBQ2xCLFVBQUksS0FBSixDQUFVLEtBQVYsQ0FBZ0IsR0FBRyxFQUFILENBQU0sV0FBdEIsRUFBbUMsR0FBRyxFQUFILENBQU0sTUFBTixDQUFhLElBQWIsRUFBbkM7O0FBRUEsVUFBSSwyQkFBSixDQUFnQyxHQUFHLEVBQW5DLEVBQXVDLEtBQXZDO0FBQ0EsU0FBRyxFQUFILENBQU0sT0FBTjtBQUNEOzs7Ozs7QUFHSCxTQUFTLElBQVQsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFTLElBQVQsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFTLEVBQVQsR0FBYyxDQUFkO0FBQ0EsU0FBUyxjQUFULEdBQTBCLENBQTFCOztJQUVNLE07OztBQUNKLGtCQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsRUFBcUM7QUFBQTs7QUFBQSwyRkFDN0IsSUFENkI7O0FBRW5DLGNBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxXQUFLLFNBQUwsR0FBa0IsWUFBWSxTQUFiLEdBQTBCLENBQTFCLEdBQThCLE9BQS9DO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLG1CQUFoQjtBQUNBLFdBQUssUUFBTCxHQUFnQixtQkFBaEI7QUFQbUM7QUFRcEM7Ozs7OEJBRVM7QUFDUixhQUFPLEtBQUssU0FBWjtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEtBQUssUUFBWjtBQUNEOzs7d0JBRUcsTSxFQUFRLEUsRUFBSTtBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxLQUFkLE1BQ1csVUFBVSxLQUFLLFNBRDlCLEVBQ3lDO0FBQ3ZDLGFBQUssU0FBTCxJQUFrQixNQUFsQjs7QUFFQSxXQUFHLFNBQUgsR0FBZSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWY7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEdBQUcsU0FBeEI7O0FBRUEsYUFBSyxnQkFBTDs7QUFFQTtBQUNEO0FBQ0QsU0FBRyxNQUFILEdBQVksTUFBWjtBQUNBLFdBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsRUFBbkIsRUFBdUIsR0FBRyxNQUFILENBQVUsSUFBVixFQUF2QjtBQUNEOzs7d0JBRUcsTSxFQUFRLEUsRUFBSTtBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxLQUFkLE1BQ1ksU0FBUyxLQUFLLFNBQWYsSUFBNkIsS0FBSyxRQURqRCxFQUMyRDtBQUN6RCxhQUFLLFNBQUwsSUFBa0IsTUFBbEI7O0FBRUEsV0FBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixFQUFmO0FBQ0EsV0FBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsRUFBM0I7O0FBRUEsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixHQUFHLFNBQXhCOztBQUVBLGFBQUssZ0JBQUw7O0FBRUE7QUFDRDs7QUFFRCxTQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixFQUFuQixFQUF1QixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXZCO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsVUFBSSxZQUFKOztBQUVBLGFBQU8sTUFBTSxLQUFLLFFBQUwsQ0FBYyxHQUFkLEVBQWIsRUFBa0M7O0FBRWhDLFlBQUksSUFBSSxTQUFSLEVBQW1CO0FBQ2pCLGVBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFwQjtBQUNBO0FBQ0Q7OztBQUdELFlBQUksSUFBSSxNQUFKLElBQWMsS0FBSyxTQUF2QixFQUFrQzs7QUFFaEMsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQXBCO0FBQ0EsZUFBSyxTQUFMLElBQWtCLElBQUksTUFBdEI7QUFDQSxjQUFJLFNBQUosR0FBZ0IsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFoQjtBQUNBLGNBQUksTUFBSixDQUFXLEdBQVgsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLENBQTRCLEdBQTVCO0FBQ0QsU0FORCxNQU1POztBQUVMO0FBQ0Q7QUFDRjtBQUNGOzs7dUNBRWtCO0FBQ2pCLFVBQUksWUFBSjs7QUFFQSxhQUFPLE1BQU0sS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFiLEVBQWtDOztBQUVoQyxZQUFJLElBQUksU0FBUixFQUFtQjtBQUNqQixlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLElBQUksTUFBSixDQUFXLElBQVgsRUFBcEI7QUFDQTtBQUNEOzs7QUFHRCxZQUFJLElBQUksTUFBSixHQUFhLEtBQUssU0FBbEIsSUFBK0IsS0FBSyxRQUF4QyxFQUFrRDs7QUFFaEQsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQXBCO0FBQ0EsZUFBSyxTQUFMLElBQWtCLElBQUksTUFBdEI7QUFDQSxjQUFJLFNBQUosR0FBZ0IsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFoQjtBQUNBLGNBQUksTUFBSixDQUFXLEdBQVgsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLENBQTRCLEdBQTVCO0FBQ0QsU0FORCxNQU1POztBQUVMO0FBQ0Q7QUFDRjtBQUNGOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUssUUFBTCxDQUFjLEtBQXJCO0FBQ0Q7OzsrQkFFVTtBQUNULGFBQU8sS0FBSyxRQUFMLENBQWMsS0FBckI7QUFDRDs7Ozs7O0lBR0csSzs7O0FBQ0osaUJBQVksUUFBWixFQUFtQztBQUFBLFFBQWIsSUFBYSx5REFBTixJQUFNOztBQUFBOztBQUNqQyxjQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRGlDLDBGQUUzQixJQUYyQjs7QUFJakMsV0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsV0FBSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFdBQUssUUFBTCxHQUFnQixtQkFBaEI7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsbUJBQWhCO0FBUGlDO0FBUWxDOzs7OzhCQUVTO0FBQ1IsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEtBQUssUUFBWjtBQUNEOzs7d0JBRUcsTSxFQUFRLEUsRUFBSTtBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxLQUFkLE1BQXlCLEtBQUssT0FBTCxLQUFpQixDQUE5QyxFQUFpRDtBQUMvQyxZQUFJLFFBQVEsS0FBWjs7QUFFQSxZQUFJLFlBQUo7Ozs7QUFJQSxZQUFJLE1BQUosRUFBWTtBQUNWLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4Qzs7QUFFNUMsa0JBQU0sS0FBSyxPQUFMLENBQWEsQ0FBYixDQUFOO0FBQ0EsZ0JBQUksT0FBTyxHQUFQLENBQUosRUFBaUI7QUFDZixzQkFBUSxJQUFSO0FBQ0EsbUJBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDQTtBQUNEO0FBQ0Y7QUFDRixTQVZELE1BVU87QUFDTCxnQkFBTSxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQU47QUFDQSxrQkFBUSxJQUFSO0FBQ0Q7O0FBRUQsWUFBSSxLQUFKLEVBQVc7QUFDVCxlQUFLLFNBQUw7O0FBRUEsYUFBRyxHQUFILEdBQVMsR0FBVDtBQUNBLGFBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLGFBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCOztBQUVBLGVBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsR0FBRyxTQUF4Qjs7QUFFQSxlQUFLLGdCQUFMOztBQUVBO0FBQ0Q7QUFDRjs7QUFFRCxTQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixFQUFuQixFQUF1QixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXZCO0FBQ0Q7Ozt3QkFFRyxHLEVBQUssRSxFQUFJO0FBQ1gsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLEtBQWQsTUFBeUIsS0FBSyxPQUFMLEtBQWlCLEtBQUssUUFBbkQsRUFBNkQ7QUFDM0QsYUFBSyxTQUFMOztBQUVBLFdBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLFdBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCOztBQUVBLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsR0FBRyxTQUF4QjtBQUNBLGFBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEI7O0FBRUEsYUFBSyxnQkFBTDs7QUFFQTtBQUNEOztBQUVELFNBQUcsR0FBSCxHQUFTLEdBQVQ7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEVBQW5CLEVBQXVCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBdkI7QUFDRDs7O3VDQUVrQjtBQUNqQixVQUFJLFdBQUo7O0FBRUEsYUFBTyxLQUFLLEtBQUssUUFBTCxDQUFjLEdBQWQsRUFBWixFQUFpQzs7QUFFL0IsWUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEIsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXBCO0FBQ0E7QUFDRDs7O0FBR0QsWUFBSSxLQUFLLE9BQUwsS0FBaUIsQ0FBckIsRUFBd0I7QUFDdEIsY0FBTSxTQUFTLEdBQUcsTUFBbEI7O0FBRUEsY0FBSSxRQUFRLEtBQVo7O0FBRUEsY0FBSSxZQUFKOztBQUVBLGNBQUksTUFBSixFQUFZO0FBQ1YsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4Qzs7QUFFNUMsb0JBQU0sS0FBSyxPQUFMLENBQWEsQ0FBYixDQUFOO0FBQ0Esa0JBQUksT0FBTyxHQUFQLENBQUosRUFBaUI7QUFDZix3QkFBUSxJQUFSO0FBQ0EscUJBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDQTtBQUNEO0FBQ0Y7QUFDRixXQVZELE1BVU87QUFDTCxrQkFBTSxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQU47QUFDQSxvQkFBUSxJQUFSO0FBQ0Q7O0FBRUQsY0FBSSxLQUFKLEVBQVc7O0FBRVQsaUJBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsR0FBRyxNQUFILENBQVUsSUFBVixFQUFwQjtBQUNBLGlCQUFLLFNBQUw7O0FBRUEsZUFBRyxHQUFILEdBQVMsR0FBVDtBQUNBLGVBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLGVBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCO0FBQ0QsV0FSRCxNQVFPO0FBQ0w7QUFDRDtBQUVGLFNBbENELE1Ba0NPOztBQUVMO0FBQ0Q7QUFDRjtBQUNGOzs7dUNBRWtCO0FBQ2pCLFVBQUksV0FBSjs7QUFFQSxhQUFPLEtBQUssS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFaLEVBQWlDOztBQUUvQixZQUFJLEdBQUcsU0FBUCxFQUFrQjtBQUNoQixlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBcEI7QUFDQTtBQUNEOzs7QUFHRCxZQUFJLEtBQUssT0FBTCxLQUFpQixLQUFLLFFBQTFCLEVBQW9DOztBQUVsQyxlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBcEI7QUFDQSxlQUFLLFNBQUw7QUFDQSxlQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEdBQUcsR0FBckI7QUFDQSxhQUFHLFNBQUgsR0FBZSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWY7QUFDQSxhQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjtBQUNELFNBUEQsTUFPTzs7QUFFTDtBQUNEO0FBQ0Y7QUFDRjs7OytCQUVVO0FBQ1QsYUFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFyQjtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUssUUFBTCxDQUFjLEtBQXJCO0FBQ0Q7Ozs7OztJQUdHLEs7OztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSwwRkFDVixJQURVOztBQUVoQixjQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsV0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsV0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFdBQUssT0FBTCxHQUFlLEtBQWY7QUFOZ0I7QUFPakI7Ozs7Z0NBRVcsRSxFQUFJO0FBQ2QsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixXQUFHLFNBQUgsR0FBZSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWY7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjtBQUNBO0FBQ0Q7QUFDRCxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEVBQW5CO0FBQ0Q7Ozs2QkFFUSxFLEVBQUk7QUFDWCxnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLFdBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLFdBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCO0FBQ0E7QUFDRDtBQUNELFdBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsRUFBaEI7QUFDRDs7O3lCQUVJLFMsRUFBVztBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxTQUFKLEVBQWU7QUFDYixhQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0Q7OztBQUdELFVBQU0sVUFBVSxLQUFLLFFBQXJCOztBQUVBLFdBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDOztBQUV2QyxnQkFBUSxDQUFSLEVBQVcsT0FBWDtBQUNEOzs7QUFHRCxVQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxFQUFkOztBQUVBLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBTSxPQUFOO0FBQ0Q7QUFDRjs7OzRCQUVPO0FBQ04sV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNEOzs7Ozs7QUFJSCxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsTUFBMUIsRUFBa0MsTUFBbEMsRUFBMEM7QUFDeEMsTUFBSSxNQUFNLE1BQU4sR0FBZSxNQUFmLElBQXlCLE1BQU0sTUFBTixHQUFlLE1BQTVDLEVBQW9EOztBQUNsRCxVQUFNLElBQUksS0FBSixDQUFVLCtCQUFWLENBQU4sQztBQUNELEc7O0FBR0QsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7OztBQUVyQyxRQUFJLENBQUMsVUFBVSxJQUFJLENBQWQsQ0FBRCxJQUFxQixDQUFDLE1BQU0sQ0FBTixDQUExQixFQUFvQyxTOzs7Ozs7O0FBUXBDLFFBQUksRUFBRSxNQUFNLENBQU4sYUFBb0IsVUFBVSxJQUFJLENBQWQsQ0FBdEIsQ0FBSixFQUE2Qzs7QUFDM0MsWUFBTSxJQUFJLEtBQUosaUJBQXVCLElBQUksQ0FBM0IsNkJBQU4sQztBQUNELEs7QUFDRixHO0FBQ0YsQzs7UUFFUSxHLEdBQUEsRztRQUFLLFEsR0FBQSxRO1FBQVUsTSxHQUFBLE07UUFBUSxLLEdBQUEsSztRQUFPLEssR0FBQSxLO1FBQU8sTSxHQUFBLE07UUFBUSxTLEdBQUEsUzs7Ozs7Ozs7Ozs7O0FDNTJCdEQ7Ozs7SUFFTSxVO0FBQ0osc0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUNoQixTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxLQUFMO0FBQ0Q7Ozs7NEJBRU87QUFDTixXQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsV0FBSyxDQUFMLEdBQVMsR0FBVDtBQUNBLFdBQUssQ0FBTCxHQUFTLEdBQVQ7QUFDQSxXQUFLLENBQUwsR0FBUyxHQUFUO0FBQ0EsV0FBSyxHQUFMLEdBQVcsQ0FBQyxRQUFaO0FBQ0EsV0FBSyxHQUFMLEdBQVcsUUFBWDtBQUNBLFdBQUssR0FBTCxHQUFXLENBQVg7O0FBRUEsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLE1BQW5DLEVBQTJDLEdBQTNDLEVBQWdEOztBQUU5QyxlQUFLLFNBQUwsQ0FBZSxDQUFmLElBQW9CLENBQXBCO0FBQ0Q7QUFDRjtBQUNGOzs7aUNBRVksSyxFQUFPLEssRUFBTyxRLEVBQVU7QUFDbkMsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsV0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFdBQUssV0FBTCxHQUFtQixDQUFDLFFBQVEsS0FBVCxJQUFrQixRQUFyQztBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFJLEtBQUosQ0FBVSxXQUFXLENBQXJCLENBQWpCO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLE1BQW5DLEVBQTJDLEdBQTNDLEVBQWdEOztBQUU5QyxhQUFLLFNBQUwsQ0FBZSxDQUFmLElBQW9CLENBQXBCO0FBQ0Q7QUFDRjs7O21DQUVjO0FBQ2IsYUFBTyxLQUFLLFNBQVo7QUFDRDs7OzJCQUVNLEssRUFBTyxNLEVBQVE7QUFDcEIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFNLElBQUssV0FBVyxTQUFaLEdBQXlCLENBQXpCLEdBQTZCLE1BQXZDOzs7O0FBSUEsVUFBSSxRQUFRLEtBQUssR0FBakIsRUFBc0IsS0FBSyxHQUFMLEdBQVcsS0FBWDtBQUN0QixVQUFJLFFBQVEsS0FBSyxHQUFqQixFQUFzQixLQUFLLEdBQUwsR0FBVyxLQUFYO0FBQ3RCLFdBQUssR0FBTCxJQUFZLEtBQVo7QUFDQSxXQUFLLEtBQUw7QUFDQSxVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixZQUFJLFFBQVEsS0FBSyxNQUFqQixFQUF5QjtBQUN2QixlQUFLLFNBQUwsQ0FBZSxDQUFmLEtBQXFCLENBQXJCO0FBQ0QsU0FGRCxNQUdLLElBQUksUUFBUSxLQUFLLE1BQWpCLEVBQXlCO0FBQzVCLGVBQUssU0FBTCxDQUFlLEtBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsQ0FBdkMsS0FBNkMsQ0FBN0M7QUFDRCxTQUZJLE1BRUU7QUFDTCxjQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsQ0FBQyxRQUFRLEtBQUssTUFBZCxJQUF3QixLQUFLLFdBQXhDLElBQXVELENBQXJFOztBQUVBLGVBQUssU0FBTCxDQUFlLEtBQWYsS0FBeUIsQ0FBekI7QUFDRDtBQUNGOzs7QUFHRCxXQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxDQUFsQjs7QUFFQSxVQUFJLEtBQUssQ0FBTCxLQUFXLENBQWYsRUFBa0I7QUFDaEI7QUFDRDs7O0FBR0QsVUFBTSxRQUFRLEtBQUssQ0FBbkI7O0FBRUEsV0FBSyxDQUFMLEdBQVMsUUFBUyxJQUFJLEtBQUssQ0FBVixJQUFnQixRQUFRLEtBQXhCLENBQWpCOzs7QUFHQSxXQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxLQUFLLFFBQVEsS0FBYixLQUF1QixRQUFRLEtBQUssQ0FBcEMsQ0FBbEI7O0FBRUQ7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxLQUFaO0FBQ0Q7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxHQUFMLEdBQVcsS0FBSyxHQUF2QjtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssR0FBWjtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBckI7QUFDRDs7OzhCQUVTO0FBQ1IsYUFBTyxLQUFLLENBQVo7QUFDRDs7OytCQUVVO0FBQ1QsYUFBTyxLQUFLLENBQUwsR0FBUyxLQUFLLENBQXJCO0FBQ0Q7OztnQ0FFVztBQUNWLGFBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxRQUFMLEVBQVYsQ0FBUDtBQUNEOzs7Ozs7SUFHRyxVO0FBQ0osc0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUNoQixTQUFLLFVBQUwsR0FBa0IsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFsQjtBQUNEOzs7OzRCQUVPO0FBQ04sV0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLEdBQWpCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLEdBQXJCO0FBQ0Q7OztpQ0FFWSxLLEVBQU8sSyxFQUFPLFEsRUFBVTtBQUNuQywwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0EsV0FBSyxVQUFMLENBQWdCLFlBQWhCLENBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLFFBQTNDO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU8sS0FBSyxVQUFMLENBQWdCLFlBQWhCLEVBQVA7QUFDRDs7OzJCQUVNLEssRUFBTyxTLEVBQVc7QUFDdkIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLENBQUMsTUFBTSxLQUFLLGFBQVgsQ0FBTCxFQUFnQztBQUM5QixhQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBdUIsS0FBSyxTQUE1QixFQUF1QyxZQUFZLEtBQUssYUFBeEQ7QUFDRDs7QUFFRCxXQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxXQUFLLGFBQUwsR0FBcUIsU0FBckI7QUFDRDs7OzZCQUVRLFMsRUFBVztBQUNsQiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsU0FBakI7QUFDRDs7OzRCQUVPO0FBQ04sYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBUDtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFQO0FBQ0Q7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxVQUFMLENBQWdCLEdBQWhCLEVBQVA7QUFDRDs7OzRCQUVPO0FBQ04sYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBUDtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFQO0FBQ0Q7Ozs4QkFFUztBQUNSLGFBQU8sS0FBSyxVQUFMLENBQWdCLE9BQWhCLEVBQVA7QUFDRDs7O2dDQUVXO0FBQ1YsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBUDtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUssVUFBTCxDQUFnQixRQUFoQixFQUFQO0FBQ0Q7Ozs7OztJQUdHLFU7QUFDSixzQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsSUFBSSxVQUFKLEVBQWxCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLElBQUksVUFBSixFQUF0QjtBQUNEOzs7OzRCQUVPO0FBQ04sV0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ0EsV0FBSyxjQUFMLENBQW9CLEtBQXBCO0FBQ0EsV0FBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0Q7OzswQkFFSyxTLEVBQVc7QUFDZiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssVUFBTDtBQUNBLFdBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixLQUFLLFVBQTVCLEVBQXdDLFNBQXhDO0FBQ0Q7OzswQkFFSyxTLEVBQVcsTSxFQUFRO0FBQ3ZCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsV0FBSyxVQUFMO0FBQ0EsV0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLEtBQUssVUFBNUIsRUFBd0MsTUFBeEM7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsU0FBUyxTQUFwQztBQUNEOzs7OEJBRVM7QUFDUixhQUFPLEtBQUssVUFBWjtBQUNEOzs7NkJBRVEsUyxFQUFXO0FBQ2xCLFdBQUssVUFBTCxDQUFnQixRQUFoQixDQUF5QixTQUF6QjtBQUNEOzs7Ozs7UUFHTSxVLEdBQUEsVTtRQUFZLFUsR0FBQSxVO1FBQVksVSxHQUFBLFU7Ozs7Ozs7Ozs7QUNwT2pDOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztRQUVTLEc7UUFBSyxNO1FBQVEsSztRQUFPLE07UUFBUSxRO1FBQVUsSztRQUN0QyxVO1FBQVksVTtRQUFZLFU7UUFDeEIsTztRQUNBLE07UUFBUSxLO1FBQU8sUztRQUNmLE07UUFDQSxLOzs7QUFFVCxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxTQUFPLEdBQVAsR0FBYTtBQUNYLDZCQURXO0FBRVgsdUJBRlc7QUFHWCxpQ0FIVztBQUlYLHVCQUpXO0FBS1gscUJBTFc7QUFNWCwyQkFOVztBQU9YLHVCQVBXO0FBUVgsMEJBUlc7QUFTWCxpQ0FUVztBQVVYLHdCQVZXO0FBV1gsMEJBWFc7QUFZWCw2QkFaVztBQWFYLGlCQWJXO0FBY1gscUJBZFc7QUFlWDtBQWZXLEdBQWI7QUFpQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uc3RydWN0b3IuX25leHRJZCgpO1xuICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAke3RoaXMuaWR9YDtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgdG90YWxJbnN0YW5jZXMoKSB7XG4gICAgcmV0dXJuICF0aGlzLl90b3RhbEluc3RhbmNlcyA/IDAgOiB0aGlzLl90b3RhbEluc3RhbmNlcztcbiAgfVxuXG4gIHN0YXRpYyBfbmV4dElkKCkge1xuICAgIHRoaXMuX3RvdGFsSW5zdGFuY2VzID0gdGhpcy50b3RhbEluc3RhbmNlcyArIDE7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xuICB9XG59XG5cbmV4cG9ydCB7IE1vZGVsIH07XG5leHBvcnQgZGVmYXVsdCBNb2RlbDtcbiIsImltcG9ydCB7IEFSR19DSEVDSyB9IGZyb20gJy4vc2ltLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XG5cbmNsYXNzIFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgICB0aGlzLnN0YXRzID0gbmV3IFBvcHVsYXRpb24oKTtcbiAgfVxuXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICB9XG5cbiAgYmFjaygpIHtcbiAgICByZXR1cm4gKHRoaXMuZGF0YS5sZW5ndGgpID8gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1c2godmFsdWUsIHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLnRpbWVzdGFtcC5wdXNoKHRpbWVzdGFtcCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gIH1cblxuICB1bnNoaWZ0KHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcbiAgICB0aGlzLmRhdGEudW5zaGlmdCh2YWx1ZSk7XG4gICAgdGhpcy50aW1lc3RhbXAudW5zaGlmdCh0aW1lc3RhbXApO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICB9XG5cbiAgc2hpZnQodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5zaGlmdCgpO1xuXG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnNoaWZ0KCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcG9wKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEucG9wKCk7XG5cbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAucG9wKCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcGFzc2J5KHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgIHRoaXMuc3RhdHMubGVhdmUodGltZXN0YW1wLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgfVxuXG4gIHJlcG9ydCgpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhdHMuc2l6ZVNlcmllcy5hdmVyYWdlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0cy5kdXJhdGlvblNlcmllcy5hdmVyYWdlKCldO1xuICB9XG5cbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xuICB9XG59XG5cbmNsYXNzIFBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMub3JkZXIgPSAwO1xuICB9XG5cbiAgZ3JlYXRlcihybzEsIHJvMikge1xuICAgIGlmIChybzEuZGVsaXZlckF0ID4gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPT09IHJvMi5kZWxpdmVyQXQpXG4gICAgICByZXR1cm4gcm8xLm9yZGVyID4gcm8yLm9yZGVyO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGluc2VydChybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuICAgIHJvLm9yZGVyID0gdGhpcy5vcmRlciArKztcblxuICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICB0aGlzLmRhdGEucHVzaChybyk7XG5cbiAgICAgICAgLy8gaW5zZXJ0IGludG8gZGF0YSBhdCB0aGUgZW5kXG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcblxuICAgICAgICAvLyBoZWFwIHVwXG4gICAgd2hpbGUgKGluZGV4ID4gMCkge1xuICAgICAgY29uc3QgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XG5cbiAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtwYXJlbnRJbmRleF0sIHJvKSkge1xuICAgICAgICBhW2luZGV4XSA9IGFbcGFyZW50SW5kZXhdO1xuICAgICAgICBpbmRleCA9IHBhcmVudEluZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuXG4gICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xuXG4gICAgaWYgKGxlbiA8PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAobGVuID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCB0b3AgPSBhWzBdO1xuXG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxuICAgIGFbMF0gPSBhLnBvcCgpO1xuICAgIGxlbi0tO1xuXG4gICAgICAgIC8vIGhlYXAgZG93blxuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICB3aGlsZSAoaW5kZXggPCBNYXRoLmZsb29yKGxlbiAvIDIpKSB7XG4gICAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDE7XG5cbiAgICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDI7XG5cbiAgICAgIGNvbnN0IHNtYWxsZXJDaGlsZEluZGV4ID0gcmlnaHRDaGlsZEluZGV4IDwgbGVuXG5cbiAgICAgICAgICAgICAgJiYgIXRoaXMuZ3JlYXRlcihhW3JpZ2h0Q2hpbGRJbmRleF0sIGFbbGVmdENoaWxkSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xuXG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbc21hbGxlckNoaWxkSW5kZXhdLCBub2RlKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYVtpbmRleF0gPSBhW3NtYWxsZXJDaGlsZEluZGV4XTtcbiAgICAgIGluZGV4ID0gc21hbGxlckNoaWxkSW5kZXg7XG4gICAgfVxuICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgICByZXR1cm4gdG9wO1xuICB9XG59XG5cbmV4cG9ydCB7IFF1ZXVlLCBQUXVldWUgfTtcbiIsIlxuY2xhc3MgUmFuZG9tIHtcbiAgY29uc3RydWN0b3Ioc2VlZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpIHtcbiAgICBpZiAodHlwZW9mIChzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgfHwgTWF0aC5jZWlsKHNlZWQpICE9PSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2VlZCB2YWx1ZSBtdXN0IGJlIGFuIGludGVnZXInKTsgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cbiAgICAgICAgLyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cbiAgICB0aGlzLk4gPSA2MjQ7XG4gICAgdGhpcy5NID0gMzk3O1xuICAgIHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOy8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gICAgdGhpcy5VUFBFUl9NQVNLID0gMHg4MDAwMDAwMDsvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG4gICAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cblxuICAgIHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cbiAgICB0aGlzLm10aSA9IHRoaXMuTiArIDE7LyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG5cbiAgICAgICAgLy8gdGhpcy5pbml0X2dlbnJhbmQoc2VlZCk7XG4gICAgdGhpcy5pbml0X2J5X2FycmF5KFtzZWVkXSwgMSk7XG4gIH1cblxuICBpbml0X2dlbnJhbmQocykge1xuICAgIHRoaXMubXRbMF0gPSBzID4+PiAwO1xuICAgIGZvciAodGhpcy5tdGkgPSAxOyB0aGlzLm10aSA8IHRoaXMuTjsgdGhpcy5tdGkrKykge1xuICAgICAgdmFyIHMgPSB0aGlzLm10W3RoaXMubXRpIC0gMV0gXiAodGhpcy5tdFt0aGlzLm10aSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1MylcbiAgICAgICAgICAgICsgdGhpcy5tdGk7XG4gICAgICAgICAgICAvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cbiAgICAgICAgICAgIC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xuICAgICAgICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcbiAgICAgICAgICAgIC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXG4gICAgfVxuICB9XG5cbiAgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkge1xuICAgIGxldCBpLCBqLCBrO1xuXG4gICAgdGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuICAgIGkgPSAxOyBqID0gMDtcbiAgICBrID0gKHRoaXMuTiA+IGtleV9sZW5ndGggPyB0aGlzLk4gOiBrZXlfbGVuZ3RoKTtcbiAgICBmb3IgKDsgazsgay0tKSB7XG4gICAgICB2YXIgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG4gICAgICAgICAgICArIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICBpKys7IGorKztcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cbiAgICAgIGlmIChqID49IGtleV9sZW5ndGgpIGogPSAwO1xuICAgIH1cbiAgICBmb3IgKGsgPSB0aGlzLk4gLSAxOyBrOyBrLS0pIHtcbiAgICAgIHZhciBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG4gICAgICAgICAgICAtIGk7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuICAgICAgaSsrO1xuICAgICAgaWYgKGkgPj0gdGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTiAtIDFdOyBpID0gMTsgfVxuICAgIH1cblxuICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xuICB9XG5cbiAgZ2VucmFuZF9pbnQzMigpIHtcbiAgICBsZXQgeTtcblxuICAgIGNvbnN0IG1hZzAxID0gbmV3IEFycmF5KDB4MCwgdGhpcy5NQVRSSVhfQSk7XG5cbiAgICAgICAgLyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG4gICAgaWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXG4gICAgICBsZXQga2s7XG5cbiAgICAgIGlmICh0aGlzLm10aSA9PT0gdGhpcy5OICsgMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xuICAgICAgICB0aGlzLmluaXRfZ2VucmFuZCg1NDg5KTsgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXG5cbiAgICAgIGZvciAoa2sgPSAwOyBrayA8IHRoaXMuTiAtIHRoaXMuTTsga2srKykge1xuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2sgKyB0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICB9XG4gICAgICBmb3IgKDtrayA8IHRoaXMuTiAtIDE7IGtrKyspIHtcbiAgICAgICAgeSA9ICh0aGlzLm10W2trXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFtrayArIDFdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgKHRoaXMuTSAtIHRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICB9XG4gICAgICB5ID0gKHRoaXMubXRbdGhpcy5OIC0gMV0gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRbMF0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgdGhpcy5tdFt0aGlzLk4gLSAxXSA9IHRoaXMubXRbdGhpcy5NIC0gMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblxuICAgICAgdGhpcy5tdGkgPSAwO1xuICAgIH1cblxuICAgIHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xuXG4gICAgICAgIC8qIFRlbXBlcmluZyAqL1xuICAgIHkgXj0gKHkgPj4+IDExKTtcbiAgICB5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcbiAgICB5IF49ICh5IDw8IDE1KSAmIDB4ZWZjNjAwMDA7XG4gICAgeSBePSAoeSA+Pj4gMTgpO1xuXG4gICAgcmV0dXJuIHkgPj4+IDA7XG4gIH1cblxuICBnZW5yYW5kX2ludDMxKCkge1xuICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgPj4+IDEpO1xuICB9XG5cbiAgZ2VucmFuZF9yZWFsMSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5NS4wKTtcbiAgICAgICAgLyogZGl2aWRlZCBieSAyXjMyLTEgKi9cbiAgfVxuXG4gIHJhbmRvbSgpIHtcbiAgICBpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XG4gICAgICBpZiAodGhpcy5za2lwKSB7XG4gICAgICAgIHRoaXMuZ2VucmFuZF9pbnQzMigpO1xuICAgICAgfVxuICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTYuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICB9XG5cbiAgZ2VucmFuZF9yZWFsMygpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSAqICgxLjAgLyA0Mjk0OTY3Mjk2LjApO1xuICAgICAgICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbiAgfVxuXG4gIGdlbnJhbmRfcmVzNTMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuZ2VucmFuZF9pbnQzMigpID4+PiA1LCBiID0gdGhpcy5nZW5yYW5kX2ludDMyKCkgPj4+IDY7XG5cbiAgICByZXR1cm4gKGEgKiA2NzEwODg2NC4wICsgYikgKiAoMS4wIC8gOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbiAgfVxuXG4gIGV4cG9uZW50aWFsKGxhbWJkYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdleHBvbmVudGlhbCgpIG11c3QgIGJlIGNhbGxlZCB3aXRoIFxcJ2xhbWJkYVxcJyBwYXJhbWV0ZXInKTsgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgY29uc3QgciA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICByZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xuICB9XG5cbiAgZ2FtbWEoYWxwaGEsIGJldGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZ2FtbWEoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgICAgIC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxuICAgICAgICAgKi9cblxuICAgIGlmIChhbHBoYSA+IDEuMCkge1xuICAgICAgY29uc3QgYWludiA9IE1hdGguc3FydCgyLjAgKiBhbHBoYSAtIDEuMCk7XG5cbiAgICAgIGNvbnN0IGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuXG4gICAgICBjb25zdCBjY2MgPSBhbHBoYSArIGFpbnY7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGlmICgodTEgPCAxZS03KSB8fCAodSA+IDAuOTk5OTk5OSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1MiA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgY29uc3QgdiA9IE1hdGgubG9nKHUxIC8gKDEuMCAtIHUxKSkgLyBhaW52O1xuXG4gICAgICAgIHZhciB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcbiAgICAgICAgY29uc3QgeiA9IHUxICogdTEgKiB1MjtcblxuICAgICAgICBjb25zdCByID0gYmJiICsgY2NjICogdiAtIHg7XG5cbiAgICAgICAgaWYgKChyICsgdGhpcy5TR19NQUdJQ0NPTlNUIC0gNC41ICogeiA+PSAwLjApIHx8IChyID49IE1hdGgubG9nKHopKSkge1xuICAgICAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWxwaGEgPT09IDEuMCkge1xuICAgICAgdmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgd2hpbGUgKHUgPD0gMWUtNykge1xuICAgICAgICB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtTWF0aC5sb2codSkgKiBiZXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGNvbnN0IGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xuXG4gICAgICAgIGNvbnN0IHAgPSBiICogdTtcblxuICAgICAgICBpZiAocCA8PSAxLjApIHtcbiAgICAgICAgICB2YXIgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgeCA9IC1NYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGlmIChwID4gMS4wKSB7XG4gICAgICAgICAgaWYgKHUxIDw9IE1hdGgucG93KHgsIChhbHBoYSAtIDEuMCkpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodTEgPD0gTWF0aC5leHAoLXgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICB9XG5cbiAgfVxuXG4gIG5vcm1hbChtdSwgc2lnbWEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ25vcm1hbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggbXUgYW5kIHNpZ21hIHBhcmFtZXRlcnMnKTsgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgbGV0IHogPSB0aGlzLmxhc3ROb3JtYWw7XG5cbiAgICB0aGlzLmxhc3ROb3JtYWwgPSBOYU47XG4gICAgaWYgKCF6KSB7XG4gICAgICBjb25zdCBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuXG4gICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG5cbiAgICAgIHogPSBNYXRoLmNvcyhhKSAqIGI7XG4gICAgICB0aGlzLmxhc3ROb3JtYWwgPSBNYXRoLnNpbihhKSAqIGI7XG4gICAgfVxuICAgIHJldHVybiBtdSArIHogKiBzaWdtYTtcbiAgfVxuXG4gIHBhcmV0byhhbHBoYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdwYXJldG8oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIHBhcmFtZXRlcicpOyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgIHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XG4gIH1cblxuICB0cmlhbmd1bGFyKGxvd2VyLCB1cHBlciwgbW9kZSkge1xuICAgICAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RyaWFuZ3VsYXJfZGlzdHJpYnV0aW9uXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3RyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyLCB1cHBlciBhbmQgbW9kZSBwYXJhbWV0ZXJzJyk7ICAgIC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgIGNvbnN0IGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcblxuICAgIGNvbnN0IHUgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgaWYgKHUgPD0gYykge1xuICAgICAgcmV0dXJuIGxvd2VyICsgTWF0aC5zcXJ0KHUgKiAodXBwZXIgLSBsb3dlcikgKiAobW9kZSAtIGxvd2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1cHBlciAtIE1hdGguc3FydCgoMSAtIHUpICogKHVwcGVyIC0gbG93ZXIpICogKHVwcGVyIC0gbW9kZSkpO1xuICAgIH1cbiAgfVxuXG4gICAgLyoqXG4gICAgKiBBbGwgZmxvYXRzIGJldHdlZW4gbG93ZXIgYW5kIHVwcGVyIGFyZSBlcXVhbGx5IGxpa2VseS4gVGhpcyBpcyB0aGVcbiAgICAqIHRoZW9yZXRpY2FsIGRpc3RyaWJ1dGlvbiBtb2RlbCBmb3IgYSBiYWxhbmNlZCBjb2luLCBhbiB1bmJpYXNlZCBkaWUsIGFcbiAgICAqIGNhc2lubyByb3VsZXR0ZSwgb3IgdGhlIGZpcnN0IGNhcmQgb2YgYSB3ZWxsLXNodWZmbGVkIGRlY2suXG4gICAgKi9cbiAgdW5pZm9ybShsb3dlciwgdXBwZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnMnKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgIHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XG4gIH1cblxuICB3ZWlidWxsKGFscGhhLCBiZXRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3dlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgIGNvbnN0IHUgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgcmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcbiAgfVxufVxuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcblxuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgZGVmYXVsdCBSYW5kb207XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3IoZW50aXR5LCBjdXJyZW50VGltZSwgZGVsaXZlckF0KSB7XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgdGhpcy5zY2hlZHVsZWRBdCA9IGN1cnJlbnRUaW1lO1xuICAgIHRoaXMuZGVsaXZlckF0ID0gZGVsaXZlckF0O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgIH1cblxuICAgICAgICAvLyAtLT4gdGhpcyBpcyBtYWluIHJlcXVlc3RcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgLy8gaWYgYWxyZWFkeSBjYW5jZWxsZWQsIGRvIG5vdGhpbmdcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgdGhpcy5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NQdXRRdWV1ZS5jYWxsKHRoaXMuc291cmNlKTtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NHZXRRdWV1ZS5jYWxsKHRoaXMuc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkb25lKGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDAsIDMsIEZ1bmN0aW9uLCBPYmplY3QpO1xuXG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB3YWl0VW50aWwoZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDQsIHVuZGVmaW5lZCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KHRoaXMuc2NoZWR1bGVkQXQgKyBkZWxheSwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcblxuICAgIHRoaXMuZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5sZXNzRXZlbnQoZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDQsIHVuZGVmaW5lZCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcbiAgICAgIHZhciBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIHJvLm1zZyA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuXG4gICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICByby5tc2cgPSBldmVudFtpXTtcbiAgICAgICAgZXZlbnRbaV0uYWRkV2FpdExpc3Qocm8pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGl2ZXIoKSB7XG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICBpZiAoIXRoaXMuY2FsbGJhY2tzKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwWzBdLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgfVxuXG4gIGNhbmNlbFJlbmVnZUNsYXVzZXMoKSB7XG4gICAgICAgIC8vIHRoaXMuY2FuY2VsID0gdGhpcy5OdWxsO1xuICAgICAgICAvLyB0aGlzLndhaXRVbnRpbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy51bmxlc3NFdmVudCA9IHRoaXMuTnVsbDtcbiAgICB0aGlzLm5vUmVuZWdlID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5ncm91cCB8fCB0aGlzLmdyb3VwWzBdICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBOdWxsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuXG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHksXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWRBdCxcbiAgICAgICAgICAgICAgICBkZWxpdmVyQXQpO1xuXG4gICAgcm8uY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuXG4gICAgaWYgKHRoaXMuZ3JvdXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JvdXAgPSBbdGhpc107XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cC5wdXNoKHJvKTtcbiAgICByby5ncm91cCA9IHRoaXMuZ3JvdXA7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgX2RvQ2FsbGJhY2soc291cmNlLCBtc2csIGRhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jYWxsYmFja3NbaV1bMF07XG5cbiAgICAgIGlmICghY2FsbGJhY2spIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMuY2FsbGJhY2tzW2ldWzFdO1xuXG4gICAgICBpZiAoIWNvbnRleHQpIGNvbnRleHQgPSB0aGlzLmVudGl0eTtcblxuICAgICAgY29uc3QgYXJndW1lbnQgPSB0aGlzLmNhbGxiYWNrc1tpXVsyXTtcblxuICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IHNvdXJjZTtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbXNnO1xuICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBkYXRhO1xuXG4gICAgICBpZiAoIWFyZ3VtZW50KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBudWxsO1xuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBudWxsO1xuICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBSZXF1ZXN0IH07XG4iLCJpbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwuanMnO1xuXG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5zaW0gPSBzaW07XG4gIH1cblxuICB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbS50aW1lKCk7XG4gIH1cblxuICBzZXRUaW1lcihkdXJhdGlvbikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcblxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCksXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcblxuICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgd2FpdEV2ZW50KGV2ZW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHF1ZXVlRXZlbnQoZXZlbnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxLCBFdmVudCk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICBldmVudC5hZGRRdWV1ZShybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgdXNlRmFjaWxpdHkoZmFjaWxpdHksIGR1cmF0aW9uKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZmFjaWxpdHk7XG4gICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICBidWZmZXIucHV0KGFtb3VudCwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldEJ1ZmZlcihidWZmZXIsIGFtb3VudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBidWZmZXI7XG4gICAgYnVmZmVyLmdldChhbW91bnQsIHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBwdXRTdG9yZShzdG9yZSwgb2JqKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUucHV0KG9iaiwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyLCBTdG9yZSwgRnVuY3Rpb24pO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUuZ2V0KGZpbHRlciwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHNlbmQobWVzc2FnZSwgZGVsYXksIGVudGl0aWVzKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMuc2ltLCB0aGlzLnRpbWUoKSwgdGhpcy50aW1lKCkgKyBkZWxheSk7XG5cbiAgICByby5zb3VyY2UgPSB0aGlzO1xuICAgIHJvLm1zZyA9IG1lc3NhZ2U7XG4gICAgcm8uZGF0YSA9IGVudGl0aWVzO1xuICAgIHJvLmRlbGl2ZXIgPSB0aGlzLnNpbS5zZW5kTWVzc2FnZTtcblxuICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gIH1cblxuICBsb2cobWVzc2FnZSkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xuICB9XG59XG5cbmNsYXNzIFNpbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2ltVGltZSA9IDA7XG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xuICAgIHRoaXMucXVldWUgPSBuZXcgUFF1ZXVlKCk7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgICB0aGlzLmVudGl0eUlkID0gMTtcbiAgfVxuXG4gIHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltVGltZTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHNlbmRlciA9IHRoaXMuc291cmNlO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubXNnO1xuXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XG5cbiAgICBjb25zdCBzaW0gPSBzZW5kZXIuc2ltO1xuXG4gICAgaWYgKCFlbnRpdGllcykge1xuICAgICAgICAgICAgLy8gc2VuZCB0byBhbGwgZW50aXRpZXNcbiAgICAgIGZvciAodmFyIGkgPSBzaW0uZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGVudGl0eSA9IHNpbS5lbnRpdGllc1tpXTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2UuY2FsbChlbnRpdHksIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbnRpdGllcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKHZhciBpID0gZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZS5jYWxsKGVudGl0eSwgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVudGl0aWVzLm9uTWVzc2FnZSkge1xuICAgICAgICBlbnRpdGllcy5vbk1lc3NhZ2UuY2FsbChlbnRpdGllcywgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbnRpdHkoa2xhc3MsIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgcHJvdG90eXBlIGhhcyBzdGFydCBmdW5jdGlvblxuICAgIGlmICgha2xhc3MucHJvdG90eXBlLnN0YXJ0KSB7ICAvLyBBUkcgQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IGNsYXNzICR7a2xhc3MubmFtZX0gbXVzdCBoYXZlIHN0YXJ0KCkgZnVuY3Rpb24gZGVmaW5lZGApO1xuICAgIH1cblxuICAgIHZhciBlbnRpdHkgPSBuZXcga2xhc3ModGhpcywgbmFtZSk7XG4gICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG5cbiAgICBlbnRpdHkuc3RhcnQoLi4uYXJncyk7XG5cbiAgICByZXR1cm4gZW50aXR5O1xuICB9XG5cbiAgc2ltdWxhdGUoZW5kVGltZSwgbWF4RXZlbnRzKSB7XG4gICAgICAgIC8vIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuICAgIGlmICghbWF4RXZlbnRzKSB7IG1heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cbiAgICBsZXQgZXZlbnRzID0gMDtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBldmVudHMrKztcbiAgICAgIGlmIChldmVudHMgPiBtYXhFdmVudHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBlYXJsaWVzdCBldmVudFxuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBldmVudHMsIHdlIGFyZSBkb25lIHdpdGggc2ltdWxhdGlvbiBoZXJlLlxuICAgICAgaWYgKHJvID09PSB1bmRlZmluZWQpIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBVaCBvaC4uIHdlIGFyZSBvdXQgb2YgdGltZSBub3dcbiAgICAgIGlmIChyby5kZWxpdmVyQXQgPiBlbmRUaW1lKSBicmVhaztcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBzaW11bGF0aW9uIHRpbWVcbiAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcblxuICAgICAgcm8uZGVsaXZlcigpO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0ZXAoKSB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgaWYgKCFybykgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvZ2dlcihsb2dnZXIpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxLCBGdW5jdGlvbik7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gIH1cblxuICBsb2cobWVzc2FnZSwgZW50aXR5KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMik7XG5cbiAgICBpZiAoIXRoaXMubG9nZ2VyKSByZXR1cm47XG4gICAgbGV0IGVudGl0eU1zZyA9ICcnO1xuXG4gICAgaWYgKGVudGl0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoZW50aXR5Lm5hbWUpIHtcbiAgICAgICAgZW50aXR5TXNnID0gYCBbJHtlbnRpdHkubmFtZX1dYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIoYCR7dGhpcy5zaW1UaW1lLnRvRml4ZWQoNil9JHtlbnRpdHlNc2d9ICAgJHttZXNzYWdlfWApO1xuICB9XG59XG5cbmNsYXNzIEZhY2lsaXR5IGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBkaXNjaXBsaW5lLCBzZXJ2ZXJzLCBtYXhxbGVuKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCk7XG5cbiAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5zZXJ2ZXJzID0gc2VydmVycyA/IHNlcnZlcnMgOiAxO1xuICAgIHRoaXMubWF4cWxlbiA9IChtYXhxbGVuID09PSB1bmRlZmluZWQpID8gLTEgOiAxICogbWF4cWxlbjtcblxuICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgY2FzZSBGYWNpbGl0eS5MQ0ZTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUxDRlM7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LlBTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmc7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VGQ0ZTO1xuICAgICAgdGhpcy5mcmVlU2VydmVycyA9IG5ldyBBcnJheSh0aGlzLnNlcnZlcnMpO1xuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5mcmVlU2VydmVyc1tpXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XG4gIH1cblxuICBzeXN0ZW1TdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcbiAgfVxuXG4gIHF1ZXVlU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gIH1cblxuICB1c2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idXN5RHVyYXRpb247XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgICB0aGlzLnF1ZXVlLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cblxuICB1c2VGQ0ZTKGR1cmF0aW9uLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgIGlmICgodGhpcy5tYXhxbGVuID09PSAwICYmICF0aGlzLmZyZWUpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMubWF4cWxlbiA+IDAgJiYgdGhpcy5xdWV1ZS5zaXplKCkgPj0gdGhpcy5tYXhxbGVuKSkge1xuICAgICAgcm8ubXNnID0gLTE7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgY29uc3Qgbm93ID0gcm8uZW50aXR5LnRpbWUoKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcbiAgICB0aGlzLnF1ZXVlLnB1c2gocm8sIG5vdyk7XG4gICAgdGhpcy51c2VGQ0ZTU2NoZWR1bGUobm93KTtcbiAgfVxuXG4gIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHdoaWxlICh0aGlzLmZyZWUgPiAwICYmICF0aGlzLnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5zaGlmdCh0aW1lc3RhbXApOyAvLyBUT0RPXG5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpZiAodGhpcy5mcmVlU2VydmVyc1tpXSkge1xuICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICByby5tc2cgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnJlZSAtLTtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IHJvLmR1cmF0aW9uO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgYWxsIG90aGVyIHJlbmVnaW5nIHJlcXVlc3RzXG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG5cbiAgICAgIGNvbnN0IG5ld3JvID0gbmV3IFJlcXVlc3QodGhpcywgdGltZXN0YW1wLCB0aW1lc3RhbXAgKyByby5kdXJhdGlvbik7XG5cbiAgICAgIG5ld3JvLmRvbmUodGhpcy51c2VGQ0ZTQ2FsbGJhY2ssIHRoaXMsIHJvKTtcblxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xuICAgIH1cbiAgfVxuXG4gIHVzZUZDRlNDYWxsYmFjayhybykge1xuICAgICAgICAvLyBXZSBoYXZlIG9uZSBtb3JlIGZyZWUgc2VydmVyXG4gICAgdGhpcy5mcmVlICsrO1xuICAgIHRoaXMuZnJlZVNlcnZlcnNbcm8ubXNnXSA9IHRydWU7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKHJvLnNjaGVkdWxlZEF0LCByby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBzb21lb25lIHdhaXRpbmcsIHNjaGVkdWxlIGl0IG5vd1xuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXG4gICAgcm8uZGVsaXZlcigpO1xuXG4gIH1cblxuICB1c2VMQ0ZTKGR1cmF0aW9uLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgaWYgKHRoaXMuY3VycmVudFJPKSB7XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSAodGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSAtIHRoaXMuY3VycmVudFJPLmxhc3RJc3N1ZWQpO1xuICAgICAgICAgICAgLy8gY2FsY3VhdGUgdGhlIHJlbWFpbmluZyB0aW1lXG4gICAgICB0aGlzLmN1cnJlbnRSTy5yZW1haW5pbmcgPVxuICAgICAgICAgICAgICAgICh0aGlzLmN1cnJlbnRSTy5kZWxpdmVyQXQgLSB0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgIC8vIHByZWVtcHQgaXQuLlxuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRoaXMuY3VycmVudFJPLCByby5lbnRpdHkudGltZSgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cbiAgICBpZiAoIXJvLnNhdmVkX2RlbGl2ZXIpIHtcbiAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcbiAgICAgIHJvLnJlbWFpbmluZyA9IGR1cmF0aW9uO1xuICAgICAgcm8uc2F2ZWRfZGVsaXZlciA9IHJvLmRlbGl2ZXI7XG4gICAgICByby5kZWxpdmVyID0gdGhpcy51c2VMQ0ZTQ2FsbGJhY2s7XG5cbiAgICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcm8ubGFzdElzc3VlZCA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcbiAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpICsgZHVyYXRpb247XG4gICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgdXNlTENGU0NhbGxiYWNrKCkge1xuICAgIGNvbnN0IHJvID0gdGhpcztcblxuICAgIGNvbnN0IGZhY2lsaXR5ID0gcm8uc291cmNlO1xuXG4gICAgaWYgKHJvICE9PSBmYWNpbGl0eS5jdXJyZW50Uk8pIHJldHVybjtcbiAgICBmYWNpbGl0eS5jdXJyZW50Uk8gPSBudWxsO1xuXG4gICAgICAgIC8vIHN0YXRzXG4gICAgZmFjaWxpdHkuYnVzeUR1cmF0aW9uICs9IChyby5lbnRpdHkudGltZSgpIC0gcm8ubGFzdElzc3VlZCk7XG4gICAgZmFjaWxpdHkuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XG4gICAgcm8uZGVsaXZlciA9IHJvLnNhdmVkX2RlbGl2ZXI7XG4gICAgZGVsZXRlIHJvLnNhdmVkX2RlbGl2ZXI7XG4gICAgcm8uZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgIGlmICghZmFjaWxpdHkucXVldWUuZW1wdHkoKSkge1xuICAgICAgY29uc3Qgb2JqID0gZmFjaWxpdHkucXVldWUucG9wKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICBmYWNpbGl0eS51c2VMQ0ZTKG9iai5yZW1haW5pbmcsIG9iaik7XG4gICAgfVxuICB9XG5cbiAgdXNlUHJvY2Vzc29yU2hhcmluZyhkdXJhdGlvbiwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBudWxsLCBSZXF1ZXN0KTtcbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcbiAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgaXNBZGRlZCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSByby5lbnRpdHkudGltZSgpO1xuXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuXG4gICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XG5cbiAgICBjb25zdCBuZXdRdWV1ZSA9IFtdO1xuXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cbiAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcblxuICAgICAgaWYgKGV2LnJvID09PSBybykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcbiAgICAgIG5ld2V2LnJvID0gZXYucm87XG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgIGV2LmNhbmNlbCgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgIH1cblxuICAgICAgICAvLyBhZGQgdGhpcyBuZXcgcmVxdWVzdFxuICAgIGlmIChpc0FkZGVkKSB7XG4gICAgICB2YXIgbmV3ZXYgPSBuZXcgUmVxdWVzdCh0aGlzLCBjdXJyZW50LCBjdXJyZW50ICsgcm8uZHVyYXRpb24gKiAoc2l6ZSArIDEpKTtcbiAgICAgIG5ld2V2LnJvID0gcm87XG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3UXVldWU7XG5cbiAgICAgICAgLy8gdXNhZ2Ugc3RhdGlzdGljc1xuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKGN1cnJlbnQgLSB0aGlzLmxhc3RJc3N1ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICBjb25zdCBldiA9IHRoaXM7XG5cbiAgICBjb25zdCBmYWMgPSBldi5zb3VyY2U7XG5cbiAgICBpZiAoZXYuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgZmFjLnN0YXRzLmxlYXZlKGV2LnJvLnNjaGVkdWxlZEF0LCBldi5yby5lbnRpdHkudGltZSgpKTtcblxuICAgIGZhYy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUoZXYucm8sIGZhbHNlKTtcbiAgICBldi5yby5kZWxpdmVyKCk7XG4gIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIHRoaXMuYXZhaWxhYmxlID0gKGluaXRpYWwgPT09IHVuZGVmaW5lZCkgPyAwIDogaW5pdGlhbDtcbiAgICB0aGlzLnB1dFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgdGhpcy5nZXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGU7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xuICB9XG5cbiAgZ2V0KGFtb3VudCwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiBhbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlIC09IGFtb3VudDtcblxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwdXQoYW1vdW50LCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIChhbW91bnQgKyB0aGlzLmF2YWlsYWJsZSkgPD0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgKz0gYW1vdW50O1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcbiAgICAgICAgb2JqLmRlbGl2ZXJBdCA9IG9iai5lbnRpdHkudGltZSgpO1xuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMucHV0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgU3RvcmUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKGNhcGFjaXR5LCBuYW1lID0gbnVsbCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuICAgIHN1cGVyKG5hbWUpO1xuXG4gICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChmaWx0ZXIsIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICAgIGxldCBvYmo7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgY29kZSBvdXRcbiAgICAgICAgICAgIC8vIGl0IGlzIHJlcGVhdGVkIGluIHByb2dyZXNzR2V0UXVldWVcbiAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcbiAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iaiA9IHRoaXMub2JqZWN0cy5zaGlmdCgpO1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICB0aGlzLmdldFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByby5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHB1dChvYmosIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG4gICAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xuXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLm9iaiA9IG9iajtcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICBsZXQgcm87XG5cbiAgICB3aGlsZSAocm8gPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAodGhpcy5jdXJyZW50KCkgPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IHJvLmZpbHRlcjtcblxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgICAgICBsZXQgb2JqO1xuXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHtcbiAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICAgIHJvLm1zZyA9IG9iajtcbiAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2dyZXNzUHV0UXVldWUoKSB7XG4gICAgbGV0IHJvO1xuXG4gICAgd2hpbGUgKHJvID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuICAgICAgICB0aGlzLm9iamVjdHMucHVzaChyby5vYmopO1xuICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgRXZlbnQgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gIH1cblxuICBhZGRXYWl0TGlzdChybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy53YWl0TGlzdC5wdXNoKHJvKTtcbiAgfVxuXG4gIGFkZFF1ZXVlKHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBpZiAodGhpcy5pc0ZpcmVkKSB7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlLnB1c2gocm8pO1xuICB9XG5cbiAgZmlyZShrZWVwRmlyZWQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgIGlmIChrZWVwRmlyZWQpIHtcbiAgICAgIHRoaXMuaXNGaXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgICAgIC8vIERpc3BhdGNoIGFsbCB3YWl0aW5nIGVudGl0aWVzXG4gICAgY29uc3QgdG1wTGlzdCA9IHRoaXMud2FpdExpc3Q7XG5cbiAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRtcExpc3RbaV0uZGVsaXZlcigpO1xuICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBvbmUgcXVldWVkIGVudGl0eVxuICAgIGNvbnN0IGx1Y2t5ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgaWYgKGx1Y2t5KSB7XG4gICAgICBsdWNreS5kZWxpdmVyKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBBUkdfQ0hFQ0soZm91bmQsIGV4cE1pbiwgZXhwTWF4KSB7XG4gIGlmIChmb3VuZC5sZW5ndGggPCBleHBNaW4gfHwgZm91bmQubGVuZ3RoID4gZXhwTWF4KSB7ICAgLy8gQVJHX0NIRUNLXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cycpOyAgIC8vIEFSR19DSEVDS1xuICB9ICAgLy8gQVJHX0NIRUNLXG5cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZvdW5kLmxlbmd0aDsgaSsrKSB7ICAgLy8gQVJHX0NIRUNLXG5cbiAgICBpZiAoIWFyZ3VtZW50c1tpICsgM10gfHwgIWZvdW5kW2ldKSBjb250aW51ZTsgICAvLyBBUkdfQ0hFQ0tcblxuLy8gICAgcHJpbnQoXCJURVNUIFwiICsgZm91bmRbaV0gKyBcIiBcIiArIGFyZ3VtZW50c1tpICsgM10gICAvLyBBUkdfQ0hFQ0tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBFdmVudCkgICAvLyBBUkdfQ0hFQ0tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSAgIC8vIEFSR19DSEVDS1xuLy8gICAgKyBcIlxcblwiKTsgICAvLyBBUkcgQ0hFQ0tcblxuXG4gICAgaWYgKCEoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSkgeyAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgIC8vIEFSR19DSEVDS1xuICB9ICAgLy8gQVJHX0NIRUNLXG59ICAgLy8gQVJHX0NIRUNLXG5cbmV4cG9ydCB7IFNpbSwgRmFjaWxpdHksIEJ1ZmZlciwgU3RvcmUsIEV2ZW50LCBFbnRpdHksIEFSR19DSEVDSyB9O1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBEYXRhU2VyaWVzIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5Db3VudCA9IDA7XG4gICAgdGhpcy5XID0gMC4wO1xuICAgIHRoaXMuQSA9IDAuMDtcbiAgICB0aGlzLlEgPSAwLjA7XG4gICAgdGhpcy5NYXggPSAtSW5maW5pdHk7XG4gICAgdGhpcy5NaW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLlN1bSA9IDA7XG5cbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAzLCAzKTtcblxuICAgIHRoaXMuaExvd2VyID0gbG93ZXI7XG4gICAgdGhpcy5oVXBwZXIgPSB1cHBlcjtcbiAgICB0aGlzLmhCdWNrZXRTaXplID0gKHVwcGVyIC0gbG93ZXIpIC8gbmJ1Y2tldHM7XG4gICAgdGhpcy5oaXN0b2dyYW0gPSBuZXcgQXJyYXkobmJ1Y2tldHMgKyAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9ncmFtO1xuICB9XG5cbiAgcmVjb3JkKHZhbHVlLCB3ZWlnaHQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgIGNvbnN0IHcgPSAod2VpZ2h0ID09PSB1bmRlZmluZWQpID8gMSA6IHdlaWdodDtcblxuICAgICAgICAvLyBkb2N1bWVudC53cml0ZShcIkRhdGEgc2VyaWVzIHJlY29yZGluZyBcIiArIHZhbHVlICsgXCIgKHdlaWdodCA9IFwiICsgdyArIFwiKVxcblwiKTtcblxuICAgIGlmICh2YWx1ZSA+IHRoaXMuTWF4KSB0aGlzLk1heCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSA8IHRoaXMuTWluKSB0aGlzLk1pbiA9IHZhbHVlO1xuICAgIHRoaXMuU3VtICs9IHZhbHVlO1xuICAgIHRoaXMuQ291bnQgKys7XG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBpZiAodmFsdWUgPCB0aGlzLmhMb3dlcikge1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbVswXSArPSB3O1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodmFsdWUgPiB0aGlzLmhVcHBlcikge1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbVt0aGlzLmhpc3RvZ3JhbS5sZW5ndGggLSAxXSArPSB3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh2YWx1ZSAtIHRoaXMuaExvd2VyKSAvIHRoaXMuaEJ1Y2tldFNpemUpICsgMTtcblxuICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpbmRleF0gKz0gdztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAgICAgLy8gV2kgPSBXaS0xICsgd2lcbiAgICB0aGlzLlcgPSB0aGlzLlcgKyB3O1xuXG4gICAgaWYgKHRoaXMuVyA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICAgICAvLyBBaSA9IEFpLTEgKyB3aS9XaSAqICh4aSAtIEFpLTEpXG4gICAgY29uc3QgbGFzdEEgPSB0aGlzLkE7XG5cbiAgICB0aGlzLkEgPSBsYXN0QSArICh3IC8gdGhpcy5XKSAqICh2YWx1ZSAtIGxhc3RBKTtcblxuICAgICAgICAvLyBRaSA9IFFpLTEgKyB3aSh4aSAtIEFpLTEpKHhpIC0gQWkpXG4gICAgdGhpcy5RID0gdGhpcy5RICsgdyAqICh2YWx1ZSAtIGxhc3RBKSAqICh2YWx1ZSAtIHRoaXMuQSk7XG4gICAgICAgIC8vIHByaW50KFwiXFx0Vz1cIiArIHRoaXMuVyArIFwiIEE9XCIgKyB0aGlzLkEgKyBcIiBRPVwiICsgdGhpcy5RICsgXCJcXG5cIik7XG4gIH1cblxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5Db3VudDtcbiAgfVxuXG4gIG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5NaW47XG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuTWF4O1xuICB9XG5cbiAgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuTWF4IC0gdGhpcy5NaW47XG4gIH1cblxuICBzdW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuU3VtO1xuICB9XG5cbiAgc3VtV2VpZ2h0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuQSAqIHRoaXMuVztcbiAgfVxuXG4gIGF2ZXJhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuQTtcbiAgfVxuXG4gIHZhcmlhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLlEgLyB0aGlzLlc7XG4gIH1cblxuICBkZXZpYXRpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnZhcmlhbmNlKCkpO1xuICB9XG59XG5cbmNsYXNzIFRpbWVTZXJpZXMge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5kYXRhU2VyaWVzID0gbmV3IERhdGFTZXJpZXMobmFtZSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGFTZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLmxhc3RWYWx1ZSA9IE5hTjtcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSBOYU47XG4gIH1cblxuICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDMsIDMpO1xuICAgIHRoaXMuZGF0YVNlcmllcy5zZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cyk7XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcbiAgfVxuXG4gIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAoIWlzTmFOKHRoaXMubGFzdFRpbWVzdGFtcCkpIHtcbiAgICAgIHRoaXMuZGF0YVNlcmllcy5yZWNvcmQodGhpcy5sYXN0VmFsdWUsIHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucmVjb3JkKE5hTiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuY291bnQoKTtcbiAgfVxuXG4gIG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1pbigpO1xuICB9XG5cbiAgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWF4KCk7XG4gIH1cblxuICByYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnJhbmdlKCk7XG4gIH1cblxuICBzdW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5zdW0oKTtcbiAgfVxuXG4gIGF2ZXJhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5hdmVyYWdlKCk7XG4gIH1cblxuICBkZXZpYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5kZXZpYXRpb24oKTtcbiAgfVxuXG4gIHZhcmlhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMudmFyaWFuY2UoKTtcbiAgfVxufVxuXG5jbGFzcyBQb3B1bGF0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgICB0aGlzLnNpemVTZXJpZXMgPSBuZXcgVGltZVNlcmllcygpO1xuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMgPSBuZXcgRGF0YVNlcmllcygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gIH1cblxuICBlbnRlcih0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiArKztcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGxlYXZlKGFycml2YWxBdCwgbGVmdEF0KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICB0aGlzLnBvcHVsYXRpb24gLS07XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIGxlZnRBdCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZWNvcmQobGVmdEF0IC0gYXJyaXZhbEF0KTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIHRoaXMuc2l6ZVNlcmllcy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG59XG5cbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbiIsImltcG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUsIEFSR19DSEVDSyB9IGZyb20gJy4vbGliL3NpbS5qcyc7XG5pbXBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH0gZnJvbSAnLi9saWIvc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vbGliL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vbGliL3F1ZXVlcy5qcyc7XG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICcuL2xpYi9yYW5kb20uanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL2xpYi9tb2RlbC5qcyc7XG5cbmV4cG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUgfTtcbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbmV4cG9ydCB7IFJlcXVlc3QgfTtcbmV4cG9ydCB7IFBRdWV1ZSwgUXVldWUsIEFSR19DSEVDSyB9O1xuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgeyBNb2RlbCB9O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LlNpbSA9IHtcbiAgICBBUkdfQ0hFQ0s6IEFSR19DSEVDSyxcbiAgICBCdWZmZXI6IEJ1ZmZlcixcbiAgICBEYXRhU2VyaWVzOiBEYXRhU2VyaWVzLFxuICAgIEVudGl0eTogRW50aXR5LFxuICAgIEV2ZW50OiBFdmVudCxcbiAgICBGYWNpbGl0eTogRmFjaWxpdHksXG4gICAgTW9kZWw6IE1vZGVsLFxuICAgIFBRdWV1ZTogUFF1ZXVlLFxuICAgIFBvcHVsYXRpb246IFBvcHVsYXRpb24sXG4gICAgUXVldWU6IFF1ZXVlLFxuICAgIFJhbmRvbTogUmFuZG9tLFxuICAgIFJlcXVlc3Q6IFJlcXVlc3QsXG4gICAgU2ltOiBTaW0sXG4gICAgU3RvcmU6IFN0b3JlLFxuICAgIFRpbWVTZXJpZXM6IFRpbWVTZXJpZXNcbiAgfTtcbn1cbiJdfQ==
