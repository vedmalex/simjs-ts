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
     || Math.ceil(seed) != Math.floor(seed)) {
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
      if (arguments.length != 1) {
        // ARG_CHECK
        throw new SyntaxError('exponential() must  be called with \'lambda\' parameter'); // ARG_CHECK
      } // ARG_CHECK

      var r = this.random();
      return -Math.log(r) / lambda;
    }
  }, {
    key: 'gamma',
    value: function gamma(alpha, beta) {
      if (arguments.length != 2) {
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
    key: 'normal',
    value: function normal(mu, sigma) {
      if (arguments.length != 2) {
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
      if (arguments.length != 1) {
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
      if (arguments.length != 3) {
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
      if (arguments.length != 2) {
        // ARG_CHECK
        throw new SyntaxError('uniform() must be called with lower and upper parameters'); // ARG_CHECK
      } // ARG_CHECK
      return lower + this.random() * (upper - lower);
    }
  }, {
    key: 'weibull',
    value: function weibull(alpha, beta) {
      if (arguments.length != 2) {
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
      // this.cancel = this.Null;
      // this.waitUntil = this.Null;
      // this.unlessEvent = this.Null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEseUZBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLHVCQUFiO0FBSmdCO0FBS2pCOzs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBUSxLQUFLLElBQUwsQ0FBVSxNQUFYLEdBQXFCLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBN0IsQ0FBckIsR0FBdUQsU0FBOUQ7QUFDRDs7O3lCQUVJLEssRUFBTyxTLEVBQVc7QUFDckIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLFdBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxLQUFmO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixTQUFwQjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCO0FBQ0Q7Ozs0QkFFTyxLLEVBQU8sUyxFQUFXO0FBQ3hCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFDQSxXQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEtBQWxCO0FBQ0EsV0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixTQUF2Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCO0FBQ0Q7OzswQkFFSyxTLEVBQVc7QUFDZiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxLQUFWLEVBQWQ7QUFDQSxVQUFNLGFBQWEsS0FBSyxTQUFMLENBQWUsS0FBZixFQUFuQjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLEVBQTZCLFNBQTdCO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7Ozt3QkFFRyxTLEVBQVc7QUFDYiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWQ7QUFDQSxVQUFNLGFBQWEsS0FBSyxTQUFMLENBQWUsR0FBZixFQUFuQjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLEVBQTZCLFNBQTdCO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7OzsyQkFFTSxTLEVBQVc7QUFDaEIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFNBQWpCO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixTQUFqQixFQUE0QixTQUE1QjtBQUNEOzs7NkJBRVEsUyxFQUFXO0FBQ2xCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsV0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixTQUFwQjtBQUNEOzs7NEJBRU87QUFDTixXQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0Q7Ozs0QkFFTztBQUNOLFdBQUssS0FBTDtBQUNBLFdBQUssSUFBTCxHQUFZLEVBQVo7QUFDQSxXQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7OzZCQUVRO0FBQ1AsYUFBTyxDQUFDLEtBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsT0FBdEIsRUFBRCxFQUNLLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsT0FBMUIsRUFETCxDQUFQO0FBRUQ7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxJQUFMLENBQVUsTUFBVixJQUFvQixDQUEzQjtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEtBQUssSUFBTCxDQUFVLE1BQWpCO0FBQ0Q7Ozs7OztJQUdHLE07OztBQUNKLGtCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSwyRkFDVixJQURVOztBQUVoQixXQUFLLElBQUwsR0FBWSxFQUFaO0FBQ0EsV0FBSyxLQUFMLEdBQWEsQ0FBYjtBQUhnQjtBQUlqQjs7Ozs0QkFFTyxHLEVBQUssRyxFQUFLO0FBQ2hCLFVBQUksSUFBSSxTQUFKLEdBQWdCLElBQUksU0FBeEIsRUFBbUMsT0FBTyxJQUFQO0FBQ25DLFVBQUksSUFBSSxTQUFKLElBQWlCLElBQUksU0FBekIsRUFDRSxPQUFPLElBQUksS0FBSixHQUFZLElBQUksS0FBdkI7QUFDRixhQUFPLEtBQVA7QUFDRDs7OzJCQUVNLEUsRUFBSTtBQUNULDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFDQSxTQUFHLEtBQUgsR0FBVyxLQUFLLEtBQUwsRUFBWDs7QUFFQSxVQUFJLFFBQVEsS0FBSyxJQUFMLENBQVUsTUFBdEI7QUFDQSxXQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsRUFBZjs7O0FBR0EsVUFBTSxJQUFJLEtBQUssSUFBZjtBQUNBLFVBQU0sT0FBTyxFQUFFLEtBQUYsQ0FBYjs7O0FBR0EsYUFBTyxRQUFRLENBQWYsRUFBa0I7QUFDaEIsWUFBTSxjQUFjLEtBQUssS0FBTCxDQUFXLENBQUMsUUFBUSxDQUFULElBQWMsQ0FBekIsQ0FBcEI7QUFDQSxZQUFJLEtBQUssT0FBTCxDQUFhLEVBQUUsV0FBRixDQUFiLEVBQTZCLEVBQTdCLENBQUosRUFBc0M7QUFDcEMsWUFBRSxLQUFGLElBQVcsRUFBRSxXQUFGLENBQVg7QUFDQSxrQkFBUSxXQUFSO0FBQ0QsU0FIRCxNQUdPO0FBQ0w7QUFDRDtBQUNGO0FBQ0QsUUFBRSxLQUFGLElBQVcsSUFBWDtBQUNEOzs7NkJBRVE7QUFDUCxVQUFNLElBQUksS0FBSyxJQUFmO0FBQ0EsVUFBSSxNQUFNLEVBQUUsTUFBWjtBQUNBLFVBQUksT0FBTyxDQUFYLEVBQWM7QUFDWixlQUFPLFNBQVA7QUFDRDtBQUNELFVBQUksT0FBTyxDQUFYLEVBQWM7QUFDWixlQUFPLEtBQUssSUFBTCxDQUFVLEdBQVYsRUFBUDtBQUNEO0FBQ0QsVUFBTSxNQUFNLEVBQUUsQ0FBRixDQUFaOztBQUVBLFFBQUUsQ0FBRixJQUFPLEVBQUUsR0FBRixFQUFQO0FBQ0E7OztBQUdBLFVBQUksUUFBUSxDQUFaO0FBQ0EsVUFBTSxPQUFPLEVBQUUsS0FBRixDQUFiOztBQUVBLGFBQU8sUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFNLENBQWpCLENBQWYsRUFBb0M7QUFDbEMsWUFBTSxpQkFBaUIsSUFBSSxLQUFKLEdBQVksQ0FBbkM7QUFDQSxZQUFNLGtCQUFrQixJQUFJLEtBQUosR0FBWSxDQUFwQzs7QUFFQSxZQUFNLG9CQUFvQixrQkFBa0IsR0FBbEIsSUFDZixDQUFDLEtBQUssT0FBTCxDQUFhLEVBQUUsZUFBRixDQUFiLEVBQWlDLEVBQUUsY0FBRixDQUFqQyxDQURjLEdBRVYsZUFGVSxHQUVRLGNBRmxDOztBQUlBLFlBQUksS0FBSyxPQUFMLENBQWEsRUFBRSxpQkFBRixDQUFiLEVBQW1DLElBQW5DLENBQUosRUFBOEM7QUFDNUM7QUFDRDs7QUFFRCxVQUFFLEtBQUYsSUFBVyxFQUFFLGlCQUFGLENBQVg7QUFDQSxnQkFBUSxpQkFBUjtBQUNEO0FBQ0QsUUFBRSxLQUFGLElBQVcsSUFBWDtBQUNBLGFBQU8sR0FBUDtBQUNEOzs7Ozs7UUFHTSxLLEdBQUEsSztRQUFPLE0sR0FBQSxNOzs7Ozs7Ozs7Ozs7O0lDeEtWLE07QUFDSixvQkFBMkM7QUFBQSxRQUEvQixJQUErQix5REFBdkIsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiLEVBQXdCOztBQUFBOztBQUN6QyxRQUFJLE9BQVEsSUFBUixLQUFrQixRO0FBQWxCLFFBQ08sS0FBSyxJQUFMLENBQVUsSUFBVixLQUFtQixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBRDlCLEVBQ2dEOztBQUM5QyxZQUFNLElBQUksU0FBSixDQUFjLCtCQUFkLENBQU4sQztBQUNELEs7OztBQUlELFNBQUssQ0FBTCxHQUFTLEdBQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxHQUFUO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLFVBQWhCLEM7QUFDQSxTQUFLLFVBQUwsR0FBa0IsVUFBbEIsQztBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQixDOztBQUVBLFNBQUssRUFBTCxHQUFVLElBQUksS0FBSixDQUFVLEtBQUssQ0FBZixDQUFWLEM7QUFDQSxTQUFLLEdBQUwsR0FBVyxLQUFLLENBQUwsR0FBUyxDQUFwQixDOzs7QUFHQSxTQUFLLGFBQUwsQ0FBbUIsQ0FBQyxJQUFELENBQW5CLEVBQTJCLENBQTNCO0FBQ0Q7Ozs7aUNBRVksQyxFQUFHO0FBQ2QsV0FBSyxFQUFMLENBQVEsQ0FBUixJQUFhLE1BQU0sQ0FBbkI7QUFDQSxXQUFLLEtBQUssR0FBTCxHQUFXLENBQWhCLEVBQW1CLEtBQUssR0FBTCxHQUFXLEtBQUssQ0FBbkMsRUFBc0MsS0FBSyxHQUFMLEVBQXRDLEVBQWtEO0FBQ2hELFlBQUksSUFBSSxLQUFLLEVBQUwsQ0FBUSxLQUFLLEdBQUwsR0FBVyxDQUFuQixJQUF5QixLQUFLLEVBQUwsQ0FBUSxLQUFLLEdBQUwsR0FBVyxDQUFuQixNQUEwQixFQUEzRDtBQUNBLGFBQUssRUFBTCxDQUFRLEtBQUssR0FBYixJQUFxQixDQUFFLENBQUMsQ0FBQyxJQUFJLFVBQUwsTUFBcUIsRUFBdEIsSUFBNEIsVUFBN0IsSUFBNEMsRUFBN0MsSUFBbUQsQ0FBQyxJQUFJLFVBQUwsSUFBbUIsVUFBdkUsR0FDWixLQUFLLEdBRGI7Ozs7O0FBTUEsYUFBSyxFQUFMLENBQVEsS0FBSyxHQUFiLE9BQXVCLENBQXZCOztBQUVEO0FBQ0Y7OztrQ0FFYSxRLEVBQVUsVSxFQUFZO0FBQ2xDLFVBQUksVUFBSjtVQUFPLFVBQVA7VUFBVSxVQUFWO0FBQ0EsV0FBSyxZQUFMLENBQWtCLFFBQWxCO0FBQ0EsVUFBSSxDQUFKLENBQU8sSUFBSSxDQUFKO0FBQ1AsVUFBSyxLQUFLLENBQUwsR0FBUyxVQUFULEdBQXNCLEtBQUssQ0FBM0IsR0FBK0IsVUFBcEM7QUFDQSxhQUFPLENBQVAsRUFBVSxHQUFWLEVBQWU7QUFDYixZQUFJLElBQUksS0FBSyxFQUFMLENBQVEsSUFBSSxDQUFaLElBQWtCLEtBQUssRUFBTCxDQUFRLElBQUksQ0FBWixNQUFtQixFQUE3QztBQUNBLGFBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxDQUFDLEtBQUssRUFBTCxDQUFRLENBQVIsSUFBYyxDQUFFLENBQUMsQ0FBQyxJQUFJLFVBQUwsTUFBcUIsRUFBdEIsSUFBNEIsT0FBN0IsSUFBeUMsRUFBMUMsSUFBaUQsQ0FBQyxJQUFJLFVBQUwsSUFBbUIsT0FBbkYsSUFDTCxTQUFTLENBQVQsQ0FESyxHQUNTLENBRHRCLEM7QUFFQSxhQUFLLEVBQUwsQ0FBUSxDQUFSLE9BQWdCLENBQWhCLEM7QUFDQSxZQUFLO0FBQ0wsWUFBSSxLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUFFLGVBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQUwsR0FBUyxDQUFqQixDQUFiLENBQWtDLElBQUksQ0FBSjtBQUFRO0FBQzdELFlBQUksS0FBSyxVQUFULEVBQXFCLElBQUksQ0FBSjtBQUN0QjtBQUNELFdBQUssSUFBSSxLQUFLLENBQUwsR0FBUyxDQUFsQixFQUFxQixDQUFyQixFQUF3QixHQUF4QixFQUE2QjtBQUMzQixZQUFJLElBQUksS0FBSyxFQUFMLENBQVEsSUFBSSxDQUFaLElBQWtCLEtBQUssRUFBTCxDQUFRLElBQUksQ0FBWixNQUFtQixFQUE3QztBQUNBLGFBQUssRUFBTCxDQUFRLENBQVIsSUFBYSxDQUFDLEtBQUssRUFBTCxDQUFRLENBQVIsSUFBYyxDQUFFLENBQUMsQ0FBQyxJQUFJLFVBQUwsTUFBcUIsRUFBdEIsSUFBNEIsVUFBN0IsSUFBNEMsRUFBN0MsSUFBbUQsQ0FBQyxJQUFJLFVBQUwsSUFBbUIsVUFBckYsSUFDTCxDQURSLEM7QUFFQSxhQUFLLEVBQUwsQ0FBUSxDQUFSLE9BQWdCLENBQWhCLEM7QUFDQTtBQUNBLFlBQUksS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFBRSxlQUFLLEVBQUwsQ0FBUSxDQUFSLElBQWEsS0FBSyxFQUFMLENBQVEsS0FBSyxDQUFMLEdBQVMsQ0FBakIsQ0FBYixDQUFrQyxJQUFJLENBQUo7QUFBUTtBQUM5RDs7QUFFRCxXQUFLLEVBQUwsQ0FBUSxDQUFSLElBQWEsVUFBYixDO0FBQ0Q7OztvQ0FFZTtBQUNkLFVBQUksVUFBSjtBQUNBLFVBQU0sUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsS0FBSyxRQUFwQixDQUFkOzs7QUFHQSxVQUFJLEtBQUssR0FBTCxJQUFZLEtBQUssQ0FBckIsRUFBd0I7O0FBQ3RCLFlBQUksV0FBSjs7QUFFQSxZQUFJLEtBQUssR0FBTCxJQUFZLEtBQUssQ0FBTCxHQUFTLENBQXpCLEU7QUFDRSxlQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRTs7QUFFRixhQUFLLEtBQUssQ0FBVixFQUFhLEtBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFoQyxFQUFtQyxJQUFuQyxFQUF5QztBQUN2QyxjQUFLLEtBQUssRUFBTCxDQUFRLEVBQVIsSUFBYyxLQUFLLFVBQXBCLEdBQW1DLEtBQUssRUFBTCxDQUFRLEtBQUssQ0FBYixJQUFrQixLQUFLLFVBQTlEO0FBQ0EsZUFBSyxFQUFMLENBQVEsRUFBUixJQUFjLEtBQUssRUFBTCxDQUFRLEtBQUssS0FBSyxDQUFsQixJQUF3QixNQUFNLENBQTlCLEdBQW1DLE1BQU0sSUFBSSxHQUFWLENBQWpEO0FBQ0Q7QUFDRCxlQUFNLEtBQUssS0FBSyxDQUFMLEdBQVMsQ0FBcEIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDM0IsY0FBSyxLQUFLLEVBQUwsQ0FBUSxFQUFSLElBQWMsS0FBSyxVQUFwQixHQUFtQyxLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQWIsSUFBa0IsS0FBSyxVQUE5RDtBQUNBLGVBQUssRUFBTCxDQUFRLEVBQVIsSUFBYyxLQUFLLEVBQUwsQ0FBUSxNQUFNLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBcEIsQ0FBUixJQUFtQyxNQUFNLENBQXpDLEdBQThDLE1BQU0sSUFBSSxHQUFWLENBQTVEO0FBQ0Q7QUFDRCxZQUFLLEtBQUssRUFBTCxDQUFRLEtBQUssQ0FBTCxHQUFTLENBQWpCLElBQXNCLEtBQUssVUFBNUIsR0FBMkMsS0FBSyxFQUFMLENBQVEsQ0FBUixJQUFhLEtBQUssVUFBakU7QUFDQSxhQUFLLEVBQUwsQ0FBUSxLQUFLLENBQUwsR0FBUyxDQUFqQixJQUFzQixLQUFLLEVBQUwsQ0FBUSxLQUFLLENBQUwsR0FBUyxDQUFqQixJQUF1QixNQUFNLENBQTdCLEdBQWtDLE1BQU0sSUFBSSxHQUFWLENBQXhEOztBQUVBLGFBQUssR0FBTCxHQUFXLENBQVg7QUFDRDs7QUFFRCxVQUFJLEtBQUssRUFBTCxDQUFRLEtBQUssR0FBTCxFQUFSLENBQUo7OztBQUdBLFdBQU0sTUFBTSxFQUFaO0FBQ0EsV0FBTSxLQUFLLENBQU4sR0FBVyxVQUFoQjtBQUNBLFdBQU0sS0FBSyxFQUFOLEdBQVksVUFBakI7QUFDQSxXQUFNLE1BQU0sRUFBWjs7QUFFQSxhQUFPLE1BQU0sQ0FBYjtBQUNEOzs7b0NBRWU7QUFDZCxhQUFRLEtBQUssYUFBTCxPQUF5QixDQUFqQztBQUNEOzs7b0NBRWU7QUFDZCxhQUFPLEtBQUssYUFBTCxNQUF3QixNQUFNLFlBQTlCLENBQVA7O0FBRUQ7Ozs2QkFFUTtBQUNQLFVBQUksS0FBSyxtQkFBVCxFQUE4QjtBQUM1QixZQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2IsZUFBSyxhQUFMO0FBQ0Q7QUFDRCxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7QUFDRCxhQUFPLEtBQUssYUFBTCxNQUF3QixNQUFNLFlBQTlCLENBQVA7O0FBRUQ7OztvQ0FFZTtBQUNkLGFBQU8sQ0FBQyxLQUFLLGFBQUwsS0FBdUIsR0FBeEIsS0FBZ0MsTUFBTSxZQUF0QyxDQUFQOztBQUVEOzs7b0NBRWU7QUFDZCxVQUFNLElBQUksS0FBSyxhQUFMLE9BQXlCLENBQW5DO1VBQXNDLElBQUksS0FBSyxhQUFMLE9BQXlCLENBQW5FO0FBQ0EsYUFBTyxDQUFDLElBQUksVUFBSixHQUFpQixDQUFsQixLQUF3QixNQUFNLGtCQUE5QixDQUFQO0FBQ0Q7OztnQ0FFVyxNLEVBQVE7QUFDbEIsVUFBSSxVQUFVLE1BQVYsSUFBb0IsQ0FBeEIsRUFBMkI7O0FBQ3pCLGNBQU0sSUFBSSxXQUFKLENBQWdCLHlEQUFoQixDQUFOLEM7QUFDRCxPOztBQUVELFVBQU0sSUFBSSxLQUFLLE1BQUwsRUFBVjtBQUNBLGFBQU8sQ0FBQyxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUQsR0FBZSxNQUF0QjtBQUNEOzs7MEJBRUssSyxFQUFPLEksRUFBTTtBQUNqQixVQUFJLFVBQVUsTUFBVixJQUFvQixDQUF4QixFQUEyQjs7QUFDekIsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsdURBQWhCLENBQU4sQztBQUNELE87Ozs7O0FBS0QsVUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixZQUFNLE9BQU8sS0FBSyxJQUFMLENBQVUsTUFBTSxLQUFOLEdBQWMsR0FBeEIsQ0FBYjtBQUNBLFlBQU0sTUFBTSxRQUFRLEtBQUssSUFBekI7QUFDQSxZQUFNLE1BQU0sUUFBUSxJQUFwQjs7QUFFQSxlQUFPLElBQVAsRUFBYTtBQUNYLGNBQUksS0FBSyxLQUFLLE1BQUwsRUFBVDtBQUNBLGNBQUssS0FBSyxJQUFOLElBQWdCLElBQUksU0FBeEIsRUFBb0M7QUFDbEM7QUFDRDtBQUNELGNBQU0sS0FBSyxNQUFNLEtBQUssTUFBTCxFQUFqQjtBQUNBLGNBQU0sSUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFNLE1BQU0sRUFBWixDQUFULElBQTRCLElBQXRDO0FBQ0EsY0FBSSxJQUFJLFFBQVEsS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFoQjtBQUNBLGNBQU0sSUFBSSxLQUFLLEVBQUwsR0FBVSxFQUFwQjtBQUNBLGNBQU0sSUFBSSxNQUFNLE1BQU0sQ0FBWixHQUFnQixDQUExQjtBQUNBLGNBQUssSUFBSSxLQUFLLGFBQVQsR0FBeUIsTUFBTSxDQUEvQixJQUFvQyxHQUFyQyxJQUE4QyxLQUFLLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBdkQsRUFBcUU7QUFDbkUsbUJBQU8sSUFBSSxJQUFYO0FBQ0Q7QUFDRjtBQUNGLE9BbkJELE1BbUJPLElBQUksU0FBUyxHQUFiLEVBQWtCO0FBQ3ZCLFlBQUksSUFBSSxLQUFLLE1BQUwsRUFBUjtBQUNBLGVBQU8sS0FBSyxJQUFaLEVBQWtCO0FBQ2hCLGNBQUksS0FBSyxNQUFMLEVBQUo7QUFDRDtBQUNELGVBQU8sQ0FBQyxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQUQsR0FBZSxJQUF0QjtBQUNELE9BTk0sTUFNQTtBQUNMLGVBQU8sSUFBUCxFQUFhO0FBQ1gsY0FBSSxJQUFJLEtBQUssTUFBTCxFQUFSO0FBQ0EsY0FBTSxJQUFJLENBQUMsS0FBSyxDQUFMLEdBQVMsS0FBVixJQUFtQixLQUFLLENBQWxDO0FBQ0EsY0FBTSxJQUFJLElBQUksQ0FBZDtBQUNBLGNBQUksS0FBSyxHQUFULEVBQWM7QUFDWixnQkFBSSxJQUFJLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLEtBQWxCLENBQVI7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSSxJQUFJLENBQUMsS0FBSyxHQUFMLENBQVMsQ0FBQyxJQUFJLENBQUwsSUFBVSxLQUFuQixDQUFUO0FBQ0Q7QUFDRCxjQUFJLEtBQUssS0FBSyxNQUFMLEVBQVQ7QUFDQSxjQUFJLElBQUksR0FBUixFQUFhO0FBQ1gsZ0JBQUksTUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQWEsUUFBUSxHQUFyQixDQUFWLEVBQXNDO0FBQ3BDO0FBQ0Q7QUFDRixXQUpELE1BSU8sSUFBSSxNQUFNLEtBQUssR0FBTCxDQUFTLENBQUMsQ0FBVixDQUFWLEVBQXdCO0FBQzdCO0FBQ0Q7QUFDRjtBQUNELGVBQU8sSUFBSSxJQUFYO0FBQ0Q7QUFFRjs7OzJCQUVNLEUsRUFBSSxLLEVBQU87QUFDaEIsVUFBSSxVQUFVLE1BQVYsSUFBb0IsQ0FBeEIsRUFBMkI7O0FBQ3pCLGNBQU0sSUFBSSxXQUFKLENBQWdCLHNEQUFoQixDQUFOLEM7QUFDRCxPOztBQUVELFVBQUksSUFBSSxLQUFLLFVBQWI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxVQUFJLENBQUMsQ0FBTCxFQUFRO0FBQ04sWUFBTSxJQUFJLEtBQUssTUFBTCxLQUFnQixDQUFoQixHQUFvQixLQUFLLEVBQW5DO0FBQ0EsWUFBTSxJQUFJLEtBQUssSUFBTCxDQUFVLENBQUMsR0FBRCxHQUFPLEtBQUssR0FBTCxDQUFTLE1BQU0sS0FBSyxNQUFMLEVBQWYsQ0FBakIsQ0FBVjtBQUNBLFlBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxJQUFjLENBQWxCO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLEtBQUssR0FBTCxDQUFTLENBQVQsSUFBYyxDQUFoQztBQUNEO0FBQ0QsYUFBTyxLQUFLLElBQUksS0FBaEI7QUFDRDs7OzJCQUVNLEssRUFBTztBQUNaLFVBQUksVUFBVSxNQUFWLElBQW9CLENBQXhCLEVBQTJCOztBQUN6QixjQUFNLElBQUksV0FBSixDQUFnQiw4Q0FBaEIsQ0FBTixDO0FBQ0QsTzs7QUFFRCxVQUFNLElBQUksS0FBSyxNQUFMLEVBQVY7QUFDQSxhQUFPLE1BQU0sS0FBSyxHQUFMLENBQVUsSUFBSSxDQUFkLEVBQWtCLE1BQU0sS0FBeEIsQ0FBYjtBQUNEOzs7K0JBRVUsSyxFQUFPLEssRUFBTyxJLEVBQU07O0FBRTdCLFVBQUksVUFBVSxNQUFWLElBQW9CLENBQXhCLEVBQTJCOztBQUN6QixjQUFNLElBQUksV0FBSixDQUFnQixtRUFBaEIsQ0FBTixDO0FBQ0QsTzs7QUFFRCxVQUFNLElBQUksQ0FBQyxPQUFPLEtBQVIsS0FBa0IsUUFBUSxLQUExQixDQUFWO0FBQ0EsVUFBTSxJQUFJLEtBQUssTUFBTCxFQUFWOztBQUVBLFVBQUksS0FBSyxDQUFULEVBQVk7QUFDVixlQUFPLFFBQVEsS0FBSyxJQUFMLENBQVUsS0FBSyxRQUFRLEtBQWIsS0FBdUIsT0FBTyxLQUE5QixDQUFWLENBQWY7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLFFBQVEsS0FBSyxJQUFMLENBQVUsQ0FBQyxJQUFJLENBQUwsS0FBVyxRQUFRLEtBQW5CLEtBQTZCLFFBQVEsSUFBckMsQ0FBVixDQUFmO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs0QkFPTyxLLEVBQU8sSyxFQUFPO0FBQ3BCLFVBQUksVUFBVSxNQUFWLElBQW9CLENBQXhCLEVBQTJCOztBQUN6QixjQUFNLElBQUksV0FBSixDQUFnQiwwREFBaEIsQ0FBTixDO0FBQ0QsTztBQUNELGFBQU8sUUFBUSxLQUFLLE1BQUwsTUFBaUIsUUFBUSxLQUF6QixDQUFmO0FBQ0Q7Ozs0QkFFTyxLLEVBQU8sSSxFQUFNO0FBQ25CLFVBQUksVUFBVSxNQUFWLElBQW9CLENBQXhCLEVBQTJCOztBQUN6QixjQUFNLElBQUksV0FBSixDQUFnQix5REFBaEIsQ0FBTixDO0FBQ0QsTztBQUNELFVBQU0sSUFBSSxNQUFNLEtBQUssTUFBTCxFQUFoQjtBQUNBLGFBQU8sUUFBUSxLQUFLLEdBQUwsQ0FBUyxDQUFDLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBVixFQUF1QixNQUFNLElBQTdCLENBQWY7QUFDRDs7Ozs7Ozs7Ozs7QUFPSCxPQUFPLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsS0FBSyxHQUFMLENBQVMsR0FBVCxDQUF4QjtBQUNBLE9BQU8sU0FBUCxDQUFpQixhQUFqQixHQUFpQyxNQUFNLEtBQUssR0FBTCxDQUFTLEdBQVQsQ0FBdkM7O1FBRVMsTSxHQUFBLE07a0JBQ00sTTs7Ozs7Ozs7Ozs7O0FDMVFmOzs7O0lBRU0sTztBQUNKLG1CQUFZLE1BQVosRUFBb0IsV0FBcEIsRUFBaUMsU0FBakMsRUFBNEM7QUFBQTs7QUFDMUMsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUssS0FBTCxHQUFhLElBQWI7QUFDRDs7Ozs2QkFFUTs7QUFFUCxVQUFJLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBTCxDQUFXLENBQVgsS0FBaUIsSUFBbkMsRUFBeUM7QUFDdkMsZUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxFQUFQO0FBQ0Q7OztBQUdELFVBQUksS0FBSyxRQUFULEVBQW1CLE9BQU8sSUFBUDs7O0FBR25CLFVBQUksS0FBSyxTQUFULEVBQW9COzs7QUFHcEIsV0FBSyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFVBQUksS0FBSyxTQUFMLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGFBQUssU0FBTCxHQUFpQixLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWpCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLE1BQVQsRUFBaUI7QUFDZixZQUFLLEtBQUssTUFBTCx1QkFBRCxJQUNjLEtBQUssTUFBTCxzQkFEbEIsRUFDaUQ7QUFDL0MsZUFBSyxNQUFMLENBQVksZ0JBQVosQ0FBNkIsSUFBN0IsQ0FBa0MsS0FBSyxNQUF2QztBQUNBLGVBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLElBQTdCLENBQWtDLEtBQUssTUFBdkM7QUFDRDtBQUNGOztBQUVELFVBQUksQ0FBQyxLQUFLLEtBQVYsRUFBaUI7QUFDZjtBQUNEO0FBQ0QsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssS0FBTCxDQUFXLE1BQS9CLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzFDLGFBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxTQUFkLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxJQUEyQixDQUEvQixFQUFrQztBQUNoQyxlQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxHQUEwQixLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQTFCO0FBQ0Q7QUFDRjtBQUNGOzs7eUJBRUksUSxFQUFVLE8sRUFBUyxRLEVBQVU7QUFDaEMsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixRQUEzQixFQUFxQyxNQUFyQzs7QUFFQSxXQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0IsUUFBcEIsQ0FBcEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzhCQUVTLEssRUFBTyxRLEVBQVUsTyxFQUFTLFEsRUFBVTtBQUM1QywwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLFNBQTNCLEVBQXNDLFFBQXRDLEVBQWdELE1BQWhEO0FBQ0EsVUFBSSxLQUFLLFFBQVQsRUFBbUIsT0FBTyxJQUFQOztBQUVuQixVQUFNLEtBQUssS0FBSyxXQUFMLENBQWlCLEtBQUssV0FBTCxHQUFtQixLQUFwQyxFQUEyQyxRQUEzQyxFQUFxRCxPQUFyRCxFQUE4RCxRQUE5RCxDQUFYO0FBQ0EsV0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixLQUFoQixDQUFzQixNQUF0QixDQUE2QixFQUE3QjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Z0NBRVcsSyxFQUFPLFEsRUFBVSxPLEVBQVMsUSxFQUFVO0FBQzlDLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsU0FBM0IsRUFBc0MsUUFBdEMsRUFBZ0QsTUFBaEQ7QUFDQSxVQUFJLEtBQUssUUFBVCxFQUFtQixPQUFPLElBQVA7O0FBRW5CLFVBQUksMkJBQUosRUFBNEI7QUFDMUIsWUFBSSxLQUFLLEtBQUssV0FBTCxDQUFpQixDQUFqQixFQUFvQixRQUFwQixFQUE4QixPQUE5QixFQUF1QyxRQUF2QyxDQUFUO0FBQ0EsV0FBRyxHQUFILEdBQVMsS0FBVDtBQUNBLGNBQU0sV0FBTixDQUFrQixFQUFsQjtBQUVELE9BTEQsTUFLTyxJQUFJLGlCQUFpQixLQUFyQixFQUE0QjtBQUNqQyxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxjQUFJLEtBQUssS0FBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLFFBQXBCLEVBQThCLE9BQTlCLEVBQXVDLFFBQXZDLENBQVQ7QUFDQSxhQUFHLEdBQUgsR0FBUyxNQUFNLENBQU4sQ0FBVDtBQUNBLGdCQUFNLENBQU4sRUFBUyxXQUFULENBQXFCLEVBQXJCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OzRCQUVPLEksRUFBTTtBQUNaLFdBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzhCQUVTO0FBQ1IsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDcEIsV0FBSyxNQUFMO0FBQ0EsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjs7QUFFckIsVUFBSSxLQUFLLEtBQUwsSUFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQXRDLEVBQXlDO0FBQ3ZDLGFBQUssV0FBTCxDQUFpQixLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBL0IsRUFDYyxLQUFLLEdBRG5CLEVBRWMsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLElBRjVCO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBSyxXQUFMLENBQWlCLEtBQUssTUFBdEIsRUFDYyxLQUFLLEdBRG5CLEVBRWMsS0FBSyxJQUZuQjtBQUdEO0FBRUY7OzswQ0FFcUI7Ozs7QUFJcEIsV0FBSyxRQUFMLEdBQWdCLElBQWhCOztBQUVBLFVBQUksQ0FBQyxLQUFLLEtBQU4sSUFBZSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEtBQWlCLElBQXBDLEVBQTBDO0FBQ3hDO0FBQ0Q7O0FBRUQsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssS0FBTCxDQUFXLE1BQS9CLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzFDLGFBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxTQUFkLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxJQUEyQixDQUEvQixFQUFrQztBQUNoQyxlQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBZCxHQUEwQixLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQTFCO0FBQ0Q7QUFDRjtBQUNGOzs7MkJBRU07QUFDTCxhQUFPLElBQVA7QUFDRDs7O2dDQUVXLFMsRUFBVyxRLEVBQVUsTyxFQUFTLFEsRUFBVTtBQUNsRCxVQUFNLEtBQUssSUFBSSxPQUFKLENBQ0MsS0FBSyxNQUROLEVBRUMsS0FBSyxXQUZOLEVBR0MsU0FIRCxDQUFYOztBQUtBLFNBQUcsU0FBSCxDQUFhLElBQWIsQ0FBa0IsQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixRQUFwQixDQUFsQjs7QUFFQSxVQUFJLEtBQUssS0FBTCxLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLGFBQUssS0FBTCxHQUFhLENBQUMsSUFBRCxDQUFiO0FBQ0Q7O0FBRUQsV0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixFQUFoQjtBQUNBLFNBQUcsS0FBSCxHQUFXLEtBQUssS0FBaEI7QUFDQSxhQUFPLEVBQVA7QUFDRDs7O2dDQUVXLE0sRUFBUSxHLEVBQUssSSxFQUFNO0FBQzdCLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM5QyxZQUFNLFdBQVcsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFsQixDQUFqQjtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7O0FBRWYsWUFBSSxVQUFVLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBZDtBQUNBLFlBQUksQ0FBQyxPQUFMLEVBQWMsVUFBVSxLQUFLLE1BQWY7O0FBRWQsWUFBTSxXQUFXLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBakI7O0FBRUEsZ0JBQVEsY0FBUixHQUF5QixNQUF6QjtBQUNBLGdCQUFRLGVBQVIsR0FBMEIsR0FBMUI7QUFDQSxnQkFBUSxZQUFSLEdBQXVCLElBQXZCOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixtQkFBUyxJQUFULENBQWMsT0FBZDtBQUNELFNBRkQsTUFFTyxJQUFJLG9CQUFvQixLQUF4QixFQUErQjtBQUNwQyxtQkFBUyxLQUFULENBQWUsT0FBZixFQUF3QixRQUF4QjtBQUNELFNBRk0sTUFFQTtBQUNMLG1CQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLFFBQXZCO0FBQ0Q7O0FBRUQsZ0JBQVEsY0FBUixHQUF5QixJQUF6QjtBQUNBLGdCQUFRLGVBQVIsR0FBMEIsSUFBMUI7QUFDQSxnQkFBUSxZQUFSLEdBQXVCLElBQXZCO0FBQ0Q7QUFDRjs7Ozs7O1FBR00sTyxHQUFBLE87Ozs7Ozs7Ozs7OztBQ2hMVDs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFHTSxNOzs7QUFDSixrQkFBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCO0FBQUE7O0FBQUEsMEZBQ2YsSUFEZTs7QUFFckIsVUFBSyxHQUFMLEdBQVcsR0FBWDtBQUZxQjtBQUd0Qjs7OzsyQkFFTTtBQUNMLGFBQU8sS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFQO0FBQ0Q7Ozs2QkFFUSxRLEVBQVU7QUFDakIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFNLEtBQUsscUJBQ0QsSUFEQyxFQUVELEtBQUssR0FBTCxDQUFTLElBQVQsRUFGQyxFQUdELEtBQUssR0FBTCxDQUFTLElBQVQsS0FBa0IsUUFIakIsQ0FBWDs7QUFLQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsTUFBZixDQUFzQixFQUF0QjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7OEJBRVMsSyxFQUFPO0FBQ2YsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixLQUEzQjs7QUFFQSxVQUFNLEtBQUsscUJBQVksSUFBWixFQUFrQixLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWxCLEVBQW1DLENBQW5DLENBQVg7O0FBRUEsU0FBRyxNQUFILEdBQVksS0FBWjtBQUNBLFlBQU0sV0FBTixDQUFrQixFQUFsQjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7K0JBRVUsSyxFQUFPO0FBQ2hCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYOztBQUVBLFNBQUcsTUFBSCxHQUFZLEtBQVo7QUFDQSxZQUFNLFFBQU4sQ0FBZSxFQUFmO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7OztnQ0FFVyxRLEVBQVUsUSxFQUFVO0FBQzlCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsUUFBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYO0FBQ0EsU0FBRyxNQUFILEdBQVksUUFBWjtBQUNBLGVBQVMsR0FBVCxDQUFhLFFBQWIsRUFBdUIsRUFBdkI7QUFDQSxhQUFPLEVBQVA7QUFDRDs7OzhCQUVTLE0sRUFBUSxNLEVBQVE7QUFDeEIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixNQUEzQjs7QUFFQSxVQUFNLEtBQUsscUJBQVksSUFBWixFQUFrQixLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWxCLEVBQW1DLENBQW5DLENBQVg7QUFDQSxTQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsYUFBTyxHQUFQLENBQVcsTUFBWCxFQUFtQixFQUFuQjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7OEJBRVMsTSxFQUFRLE0sRUFBUTtBQUN4QixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLE1BQTNCOztBQUVBLFVBQU0sS0FBSyxxQkFBWSxJQUFaLEVBQWtCLEtBQUssR0FBTCxDQUFTLElBQVQsRUFBbEIsRUFBbUMsQ0FBbkMsQ0FBWDtBQUNBLFNBQUcsTUFBSCxHQUFZLE1BQVo7QUFDQSxhQUFPLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLEVBQW5CO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7Ozs2QkFFUSxLLEVBQU8sRyxFQUFLO0FBQ25CLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYO0FBQ0EsU0FBRyxNQUFILEdBQVksS0FBWjtBQUNBLFlBQU0sR0FBTixDQUFVLEdBQVYsRUFBZSxFQUFmO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7Ozs2QkFFUSxLLEVBQU8sTSxFQUFRO0FBQ3RCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0IsRUFBa0MsUUFBbEM7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLElBQVosRUFBa0IsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFsQixFQUFtQyxDQUFuQyxDQUFYO0FBQ0EsU0FBRyxNQUFILEdBQVksS0FBWjtBQUNBLFlBQU0sR0FBTixDQUFVLE1BQVYsRUFBa0IsRUFBbEI7QUFDQSxhQUFPLEVBQVA7QUFDRDs7O3lCQUVJLE8sRUFBUyxLLEVBQU8sUSxFQUFVO0FBQzdCLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBTSxLQUFLLHFCQUFZLEtBQUssR0FBakIsRUFBc0IsS0FBSyxJQUFMLEVBQXRCLEVBQW1DLEtBQUssSUFBTCxLQUFjLEtBQWpELENBQVg7QUFDQSxTQUFHLE1BQUgsR0FBWSxJQUFaO0FBQ0EsU0FBRyxHQUFILEdBQVMsT0FBVDtBQUNBLFNBQUcsSUFBSCxHQUFVLFFBQVY7QUFDQSxTQUFHLE9BQUgsR0FBYSxLQUFLLEdBQUwsQ0FBUyxXQUF0Qjs7QUFFQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsTUFBZixDQUFzQixFQUF0QjtBQUNEOzs7d0JBRUcsTyxFQUFTO0FBQ1gsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsT0FBYixFQUFzQixJQUF0QjtBQUNEOzs7Ozs7SUFHRyxHO0FBQ0osaUJBQWM7QUFBQTs7QUFDWixTQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsb0JBQWI7QUFDQSxTQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0Q7Ozs7MkJBRU07QUFDTCxhQUFPLEtBQUssT0FBWjtBQUNEOzs7a0NBRWE7QUFDWixVQUFNLFNBQVMsS0FBSyxNQUFwQjtBQUNBLFVBQU0sVUFBVSxLQUFLLEdBQXJCO0FBQ0EsVUFBTSxXQUFXLEtBQUssSUFBdEI7QUFDQSxVQUFNLE1BQU0sT0FBTyxHQUFuQjs7QUFFQSxVQUFJLENBQUMsUUFBTCxFQUFlOztBQUViLGFBQUssSUFBSSxJQUFJLElBQUksUUFBSixDQUFhLE1BQWIsR0FBc0IsQ0FBbkMsRUFBc0MsS0FBSyxDQUEzQyxFQUE4QyxHQUE5QyxFQUFtRDtBQUNqRCxjQUFJLFNBQVMsSUFBSSxRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsY0FBSSxXQUFXLE1BQWYsRUFBdUI7QUFDdkIsY0FBSSxPQUFPLFNBQVgsRUFBc0IsT0FBTyxTQUFQLENBQWlCLElBQWpCLENBQXNCLE1BQXRCLEVBQThCLE1BQTlCLEVBQXNDLE9BQXRDO0FBQ3ZCO0FBQ0YsT0FQRCxNQU9PLElBQUksb0JBQW9CLEtBQXhCLEVBQStCO0FBQ3BDLGFBQUssSUFBSSxJQUFJLFNBQVMsTUFBVCxHQUFrQixDQUEvQixFQUFrQyxLQUFLLENBQXZDLEVBQTBDLEdBQTFDLEVBQStDO0FBQzdDLGNBQUksU0FBUyxTQUFTLENBQVQsQ0FBYjtBQUNBLGNBQUksV0FBVyxNQUFmLEVBQXVCO0FBQ3ZCLGNBQUksT0FBTyxTQUFYLEVBQXNCLE9BQU8sU0FBUCxDQUFpQixJQUFqQixDQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxPQUF0QztBQUN2QjtBQUNGLE9BTk0sTUFNQTtBQUNMLFlBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCLG1CQUFTLFNBQVQsQ0FBbUIsSUFBbkIsQ0FBd0IsUUFBeEIsRUFBa0MsTUFBbEMsRUFBMEMsT0FBMUM7QUFDRDtBQUNGO0FBQ0Y7Ozs4QkFFUyxLLEVBQU8sSSxFQUFlOztBQUU5QixVQUFJLENBQUMsTUFBTSxTQUFOLENBQWdCLEtBQXJCLEVBQTRCOztBQUMxQixjQUFNLElBQUksS0FBSixtQkFBMEIsTUFBTSxJQUFoQyx5Q0FBTjtBQUNEOztBQUVELFVBQUksU0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBQWdCLElBQWhCLENBQWI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE1BQW5COztBQVA4Qix3Q0FBTixJQUFNO0FBQU4sWUFBTTtBQUFBOztBQVM5QixhQUFPLEtBQVAsZUFBZ0IsSUFBaEI7O0FBRUEsYUFBTyxNQUFQO0FBQ0Q7Ozs2QkFFUSxPLEVBQVMsUyxFQUFXOztBQUUzQixVQUFJLENBQUMsU0FBTCxFQUFnQjtBQUFFLG9CQUFZLEtBQUssUUFBakI7QUFBNEI7QUFDOUMsVUFBSSxTQUFTLENBQWI7O0FBRUEsYUFBTyxJQUFQLEVBQWE7QUFDWDtBQUNBLFlBQUksU0FBUyxTQUFiLEVBQXdCLE9BQU8sS0FBUDs7O0FBR3hCLFlBQU0sS0FBSyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQVg7OztBQUdBLFlBQUksTUFBTSxTQUFWLEVBQXFCOzs7QUFJckIsWUFBSSxHQUFHLFNBQUgsR0FBZSxPQUFuQixFQUE0Qjs7O0FBRzVCLGFBQUssT0FBTCxHQUFlLEdBQUcsU0FBbEI7OztBQUdBLFlBQUksR0FBRyxTQUFQLEVBQWtCOztBQUVsQixXQUFHLE9BQUg7QUFDRDs7QUFFRCxXQUFLLFFBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBTyxJQUFQLEVBQWE7QUFDWCxZQUFNLEtBQUssS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFYO0FBQ0EsWUFBSSxDQUFDLEVBQUwsRUFBUyxPQUFPLEtBQVA7QUFDVCxhQUFLLE9BQUwsR0FBZSxHQUFHLFNBQWxCO0FBQ0EsWUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDbEIsV0FBRyxPQUFIO0FBQ0E7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEOzs7K0JBRVU7QUFDVCxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxRQUFMLENBQWMsTUFBbEMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsWUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLFFBQXJCLEVBQStCO0FBQzdCLGVBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsUUFBakI7QUFDRDtBQUNGO0FBQ0Y7Ozs4QkFFUyxNLEVBQVE7QUFDaEIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixRQUEzQjtBQUNBLFdBQUssTUFBTCxHQUFjLE1BQWQ7QUFDRDs7O3dCQUVHLE8sRUFBUyxNLEVBQVE7QUFDbkIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2xCLFVBQUksWUFBWSxFQUFoQjtBQUNBLFVBQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLFlBQUksT0FBTyxJQUFYLEVBQWlCO0FBQ2YsNkJBQWlCLE9BQU8sSUFBeEI7QUFDRCxTQUZELE1BRU87QUFDTCw2QkFBaUIsT0FBTyxFQUF4QjtBQUNEO0FBQ0Y7QUFDRCxXQUFLLE1BQUwsTUFBZSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLENBQXJCLENBQWYsR0FBeUMsU0FBekMsV0FBd0QsT0FBeEQ7QUFDRDs7Ozs7O0lBR0csUTs7O0FBQ0osb0JBQVksSUFBWixFQUFrQixVQUFsQixFQUE4QixPQUE5QixFQUF1QyxPQUF2QyxFQUFnRDtBQUFBOztBQUFBLDZGQUN4QyxJQUR3Qzs7QUFFOUMsY0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssSUFBTCxHQUFZLFVBQVUsT0FBVixHQUFvQixDQUFoQztBQUNBLFdBQUssT0FBTCxHQUFlLFVBQVUsT0FBVixHQUFvQixDQUFuQztBQUNBLFdBQUssT0FBTCxHQUFnQixZQUFZLFNBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixJQUFJLE9BQWxEOztBQUVBLFlBQVEsVUFBUjs7QUFFQSxXQUFLLFNBQVMsSUFBZDtBQUNFLGVBQUssR0FBTCxHQUFXLE9BQUssT0FBaEI7QUFDQSxlQUFLLEtBQUwsR0FBYSxtQkFBYjtBQUNBO0FBQ0YsV0FBSyxTQUFTLEVBQWQ7QUFDRSxlQUFLLEdBQUwsR0FBVyxPQUFLLG1CQUFoQjtBQUNBLGVBQUssS0FBTCxHQUFhLEVBQWI7QUFDQTtBQUNGLFdBQUssU0FBUyxJQUFkO0FBQ0E7QUFDRSxlQUFLLEdBQUwsR0FBVyxPQUFLLE9BQWhCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLElBQUksS0FBSixDQUFVLE9BQUssT0FBZixDQUFuQjtBQUNBLGVBQUssS0FBTCxHQUFhLG1CQUFiO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQUssV0FBTCxDQUFpQixNQUFyQyxFQUE2QyxHQUE3QyxFQUFrRDtBQUNoRCxpQkFBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLElBQXRCO0FBQ0Q7QUFqQkg7O0FBb0JBLFdBQUssS0FBTCxHQUFhLHVCQUFiO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBN0I4QztBQThCL0M7Ozs7NEJBRU87QUFDTixXQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWDtBQUNBLFdBQUssWUFBTCxHQUFvQixDQUFwQjtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUssS0FBWjtBQUNEOzs7aUNBRVk7QUFDWCxhQUFPLEtBQUssS0FBTCxDQUFXLEtBQWxCO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxZQUFaO0FBQ0Q7Ozs2QkFFUSxTLEVBQVc7QUFDbEIsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFNBQXBCO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixRQUFqQixDQUEwQixTQUExQjtBQUNEOzs7NEJBRU8sUSxFQUFVLEUsRUFBSTtBQUNwQixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0EsVUFBSyxLQUFLLE9BQUwsS0FBaUIsQ0FBakIsSUFBc0IsQ0FBQyxLQUFLLElBQTdCLElBQ1ksS0FBSyxPQUFMLEdBQWUsQ0FBZixJQUFvQixLQUFLLEtBQUwsQ0FBVyxJQUFYLE1BQXFCLEtBQUssT0FEOUQsRUFDd0U7QUFDdEUsV0FBRyxHQUFILEdBQVMsQ0FBQyxDQUFWO0FBQ0EsV0FBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixFQUFmO0FBQ0EsV0FBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsRUFBM0I7QUFDQTtBQUNEOztBQUVELFNBQUcsUUFBSCxHQUFjLFFBQWQ7QUFDQSxVQUFNLE1BQU0sR0FBRyxNQUFILENBQVUsSUFBVixFQUFaO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQjtBQUNBLFdBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsRUFBaEIsRUFBb0IsR0FBcEI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsR0FBckI7QUFDRDs7O29DQUVlLFMsRUFBVztBQUN6QixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLGFBQU8sS0FBSyxJQUFMLEdBQVksQ0FBWixJQUFpQixDQUFDLEtBQUssS0FBTCxDQUFXLEtBQVgsRUFBekIsRUFBNkM7QUFDM0MsWUFBTSxLQUFLLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBakIsQ0FBWCxDO0FBQ0EsWUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEI7QUFDRDtBQUNELGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBckMsRUFBNkMsR0FBN0MsRUFBa0Q7QUFDaEQsY0FBSSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBSixFQUF5QjtBQUN2QixpQkFBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLEtBQXRCO0FBQ0EsZUFBRyxHQUFILEdBQVMsQ0FBVDtBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxhQUFLLElBQUw7QUFDQSxhQUFLLFlBQUwsSUFBcUIsR0FBRyxRQUF4Qjs7O0FBR0EsV0FBRyxtQkFBSDs7QUFFQSxZQUFNLFFBQVEscUJBQVksSUFBWixFQUFrQixTQUFsQixFQUE2QixZQUFZLEdBQUcsUUFBNUMsQ0FBZDtBQUNBLGNBQU0sSUFBTixDQUFXLEtBQUssZUFBaEIsRUFBaUMsSUFBakMsRUFBdUMsRUFBdkM7O0FBRUEsV0FBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsS0FBM0I7QUFDRDtBQUNGOzs7b0NBRWUsRSxFQUFJOztBQUVsQixXQUFLLElBQUw7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsR0FBRyxHQUFwQixJQUEyQixJQUEzQjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQUcsV0FBcEIsRUFBaUMsR0FBRyxNQUFILENBQVUsSUFBVixFQUFqQzs7O0FBR0EsV0FBSyxlQUFMLENBQXFCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBckI7OztBQUdBLFNBQUcsT0FBSDtBQUVEOzs7NEJBRU8sUSxFQUFVLEUsRUFBSTtBQUNwQixnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOzs7QUFHQSxVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixhQUFLLFlBQUwsSUFBc0IsS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixJQUF0QixLQUErQixLQUFLLFNBQUwsQ0FBZSxVQUFwRTs7QUFFQSxhQUFLLFNBQUwsQ0FBZSxTQUFmLEdBQ1csS0FBSyxTQUFMLENBQWUsU0FBZixHQUEyQixLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLElBQXRCLEVBRHRDOztBQUdBLGFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBSyxTQUFyQixFQUFnQyxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWhDO0FBQ0Q7O0FBRUQsV0FBSyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBLFVBQUksQ0FBQyxHQUFHLGFBQVIsRUFBdUI7QUFDckIsV0FBRyxtQkFBSDtBQUNBLFdBQUcsU0FBSCxHQUFlLFFBQWY7QUFDQSxXQUFHLGFBQUgsR0FBbUIsR0FBRyxPQUF0QjtBQUNBLFdBQUcsT0FBSCxHQUFhLEtBQUssZUFBbEI7O0FBRUEsYUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWpCO0FBQ0Q7O0FBRUQsU0FBRyxVQUFILEdBQWdCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBaEI7OztBQUdBLFNBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsS0FBbUIsUUFBbEM7QUFDQSxTQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjtBQUNEOzs7c0NBRWlCO0FBQ2hCLFVBQU0sS0FBSyxJQUFYO0FBQ0EsVUFBTSxXQUFXLEdBQUcsTUFBcEI7O0FBRUEsVUFBSSxNQUFNLFNBQVMsU0FBbkIsRUFBOEI7QUFDOUIsZUFBUyxTQUFULEdBQXFCLElBQXJCOzs7QUFHQSxlQUFTLFlBQVQsSUFBMEIsR0FBRyxNQUFILENBQVUsSUFBVixLQUFtQixHQUFHLFVBQWhEO0FBQ0EsZUFBUyxLQUFULENBQWUsS0FBZixDQUFxQixHQUFHLFdBQXhCLEVBQXFDLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBckM7OztBQUdBLFNBQUcsT0FBSCxHQUFhLEdBQUcsYUFBaEI7QUFDQSxhQUFPLEdBQUcsYUFBVjtBQUNBLFNBQUcsT0FBSDs7O0FBR0EsVUFBSSxDQUFDLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBTCxFQUE2QjtBQUMzQixZQUFNLE1BQU0sU0FBUyxLQUFULENBQWUsR0FBZixDQUFtQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQW5CLENBQVo7QUFDQSxpQkFBUyxPQUFULENBQWlCLElBQUksU0FBckIsRUFBZ0MsR0FBaEM7QUFDRDtBQUNGOzs7d0NBRW1CLFEsRUFBVSxFLEVBQUk7QUFDaEMsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixJQUEzQjtBQUNBLFNBQUcsUUFBSCxHQUFjLFFBQWQ7QUFDQSxTQUFHLG1CQUFIO0FBQ0EsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWpCO0FBQ0EsV0FBSywyQkFBTCxDQUFpQyxFQUFqQyxFQUFxQyxJQUFyQztBQUNEOzs7Z0RBRTJCLEUsRUFBSSxPLEVBQVM7QUFDdkMsVUFBTSxVQUFVLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBaEI7QUFDQSxVQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBeEI7QUFDQSxVQUFNLGFBQWEsVUFBVyxDQUFDLE9BQU8sR0FBUixJQUFlLElBQTFCLEdBQW1DLENBQUMsT0FBTyxHQUFSLElBQWUsSUFBckU7QUFDQSxVQUFNLFdBQVcsRUFBakI7O0FBRUEsVUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGFBQUssVUFBTCxHQUFrQixPQUFsQjtBQUNEOztBQUVELFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFwQixFQUEwQixHQUExQixFQUErQjtBQUM3QixZQUFNLEtBQUssS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFYO0FBQ0EsWUFBSSxHQUFHLEVBQUgsS0FBVSxFQUFkLEVBQWtCO0FBQ2hCO0FBQ0Q7QUFDRCxZQUFJLFFBQVEscUJBQVksSUFBWixFQUFrQixPQUFsQixFQUEyQixVQUFVLENBQUMsR0FBRyxTQUFILEdBQWUsT0FBaEIsSUFBMkIsVUFBaEUsQ0FBWjtBQUNBLGNBQU0sRUFBTixHQUFXLEdBQUcsRUFBZDtBQUNBLGNBQU0sTUFBTixHQUFlLElBQWY7QUFDQSxjQUFNLE9BQU4sR0FBZ0IsS0FBSywyQkFBckI7QUFDQSxpQkFBUyxJQUFULENBQWMsS0FBZDs7QUFFQSxXQUFHLE1BQUg7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEOzs7QUFHRCxVQUFJLE9BQUosRUFBYTtBQUNYLFlBQUksUUFBUSxxQkFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCLFVBQVUsR0FBRyxRQUFILElBQWUsT0FBTyxDQUF0QixDQUFyQyxDQUFaO0FBQ0EsY0FBTSxFQUFOLEdBQVcsRUFBWDtBQUNBLGNBQU0sTUFBTixHQUFlLElBQWY7QUFDQSxjQUFNLE9BQU4sR0FBZ0IsS0FBSywyQkFBckI7QUFDQSxpQkFBUyxJQUFULENBQWMsS0FBZDs7QUFFQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEOztBQUVELFdBQUssS0FBTCxHQUFhLFFBQWI7OztBQUdBLFVBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxJQUFxQixDQUF6QixFQUE0QjtBQUMxQixhQUFLLFlBQUwsSUFBc0IsVUFBVSxLQUFLLFVBQXJDO0FBQ0Q7QUFDRjs7O2tEQUU2QjtBQUM1QixVQUFNLEtBQUssSUFBWDtBQUNBLFVBQU0sTUFBTSxHQUFHLE1BQWY7O0FBRUEsVUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDbEIsVUFBSSxLQUFKLENBQVUsS0FBVixDQUFnQixHQUFHLEVBQUgsQ0FBTSxXQUF0QixFQUFtQyxHQUFHLEVBQUgsQ0FBTSxNQUFOLENBQWEsSUFBYixFQUFuQzs7QUFFQSxVQUFJLDJCQUFKLENBQWdDLEdBQUcsRUFBbkMsRUFBdUMsS0FBdkM7QUFDQSxTQUFHLEVBQUgsQ0FBTSxPQUFOO0FBQ0Q7Ozs7OztBQUdILFNBQVMsSUFBVCxHQUFnQixDQUFoQjtBQUNBLFNBQVMsSUFBVCxHQUFnQixDQUFoQjtBQUNBLFNBQVMsRUFBVCxHQUFjLENBQWQ7QUFDQSxTQUFTLGNBQVQsR0FBMEIsQ0FBMUI7O0lBRU0sTTs7O0FBQ0osa0JBQVksSUFBWixFQUFrQixRQUFsQixFQUE0QixPQUE1QixFQUFxQztBQUFBOztBQUFBLDJGQUM3QixJQUQ2Qjs7QUFFbkMsY0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLFdBQUssU0FBTCxHQUFrQixZQUFZLFNBQWIsR0FBMEIsQ0FBMUIsR0FBOEIsT0FBL0M7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsbUJBQWhCO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLG1CQUFoQjtBQVBtQztBQVFwQzs7Ozs4QkFFUztBQUNSLGFBQU8sS0FBSyxTQUFaO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQU8sS0FBSyxRQUFaO0FBQ0Q7Ozt3QkFFRyxNLEVBQVEsRSxFQUFJO0FBQ2QsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLEtBQWQsTUFDVyxVQUFVLEtBQUssU0FEOUIsRUFDeUM7QUFDdkMsYUFBSyxTQUFMLElBQWtCLE1BQWxCOztBQUVBLFdBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLFdBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCOztBQUVBLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsR0FBRyxTQUF4Qjs7QUFFQSxhQUFLLGdCQUFMOztBQUVBO0FBQ0Q7QUFDRCxTQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixFQUFuQixFQUF1QixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXZCO0FBQ0Q7Ozt3QkFFRyxNLEVBQVEsRSxFQUFJO0FBQ2QsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLEtBQWQsTUFDWSxTQUFTLEtBQUssU0FBZixJQUE2QixLQUFLLFFBRGpELEVBQzJEO0FBQ3pELGFBQUssU0FBTCxJQUFrQixNQUFsQjs7QUFFQSxXQUFHLFNBQUgsR0FBZSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWY7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEdBQUcsU0FBeEI7O0FBRUEsYUFBSyxnQkFBTDs7QUFFQTtBQUNEOztBQUVELFNBQUcsTUFBSCxHQUFZLE1BQVo7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEVBQW5CLEVBQXVCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBdkI7QUFDRDs7O3VDQUVrQjtBQUNqQixVQUFJLFlBQUo7QUFDQSxhQUFPLE1BQU0sS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFiLEVBQWtDOztBQUVoQyxZQUFJLElBQUksU0FBUixFQUFtQjtBQUNqQixlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLElBQUksTUFBSixDQUFXLElBQVgsRUFBcEI7QUFDQTtBQUNEOzs7QUFHRCxZQUFJLElBQUksTUFBSixJQUFjLEtBQUssU0FBdkIsRUFBa0M7O0FBRWhDLGVBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFwQjtBQUNBLGVBQUssU0FBTCxJQUFrQixJQUFJLE1BQXRCO0FBQ0EsY0FBSSxTQUFKLEdBQWdCLElBQUksTUFBSixDQUFXLElBQVgsRUFBaEI7QUFDQSxjQUFJLE1BQUosQ0FBVyxHQUFYLENBQWUsS0FBZixDQUFxQixNQUFyQixDQUE0QixHQUE1QjtBQUNELFNBTkQsTUFNTzs7QUFFTDtBQUNEO0FBQ0Y7QUFDRjs7O3VDQUVrQjtBQUNqQixVQUFJLFlBQUo7QUFDQSxhQUFPLE1BQU0sS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFiLEVBQWtDOztBQUVoQyxZQUFJLElBQUksU0FBUixFQUFtQjtBQUNqQixlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLElBQUksTUFBSixDQUFXLElBQVgsRUFBcEI7QUFDQTtBQUNEOzs7QUFHRCxZQUFJLElBQUksTUFBSixHQUFhLEtBQUssU0FBbEIsSUFBK0IsS0FBSyxRQUF4QyxFQUFrRDs7QUFFaEQsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQXBCO0FBQ0EsZUFBSyxTQUFMLElBQWtCLElBQUksTUFBdEI7QUFDQSxjQUFJLFNBQUosR0FBZ0IsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFoQjtBQUNBLGNBQUksTUFBSixDQUFXLEdBQVgsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLENBQTRCLEdBQTVCO0FBQ0QsU0FORCxNQU1POztBQUVMO0FBQ0Q7QUFDRjtBQUNGOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUssUUFBTCxDQUFjLEtBQXJCO0FBQ0Q7OzsrQkFFVTtBQUNULGFBQU8sS0FBSyxRQUFMLENBQWMsS0FBckI7QUFDRDs7Ozs7O0lBR0csSzs7O0FBQ0osaUJBQVksUUFBWixFQUFtQztBQUFBLFFBQWIsSUFBYSx5REFBTixJQUFNOztBQUFBOztBQUNqQyxjQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRGlDLDBGQUUzQixJQUYyQjs7QUFJakMsV0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsV0FBSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFdBQUssUUFBTCxHQUFnQixtQkFBaEI7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsbUJBQWhCO0FBUGlDO0FBUWxDOzs7OzhCQUVTO0FBQ1IsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEtBQUssUUFBWjtBQUNEOzs7d0JBRUcsTSxFQUFRLEUsRUFBSTtBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxLQUFkLE1BQXlCLEtBQUssT0FBTCxLQUFpQixDQUE5QyxFQUFpRDtBQUMvQyxZQUFJLFFBQVEsS0FBWjtBQUNBLFlBQUksWUFBSjs7O0FBR0EsWUFBSSxNQUFKLEVBQVk7QUFDVixlQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxPQUFMLENBQWEsTUFBakMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsa0JBQU0sS0FBSyxPQUFMLENBQWEsQ0FBYixDQUFOO0FBQ0EsZ0JBQUksT0FBTyxHQUFQLENBQUosRUFBaUI7QUFDZixzQkFBUSxJQUFSO0FBQ0EsbUJBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDQTtBQUNEO0FBQ0Y7QUFDRixTQVRELE1BU087QUFDTCxnQkFBTSxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQU47QUFDQSxrQkFBUSxJQUFSO0FBQ0Q7O0FBRUQsWUFBSSxLQUFKLEVBQVc7QUFDVCxlQUFLLFNBQUw7O0FBRUEsYUFBRyxHQUFILEdBQVMsR0FBVDtBQUNBLGFBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLGFBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCOztBQUVBLGVBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsR0FBRyxTQUF4Qjs7QUFFQSxlQUFLLGdCQUFMOztBQUVBO0FBQ0Q7QUFDRjs7QUFFRCxTQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixFQUFuQixFQUF1QixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXZCO0FBQ0Q7Ozt3QkFFRyxHLEVBQUssRSxFQUFJO0FBQ1gsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLEtBQWQsTUFBeUIsS0FBSyxPQUFMLEtBQWlCLEtBQUssUUFBbkQsRUFBNkQ7QUFDM0QsYUFBSyxTQUFMOztBQUVBLFdBQUcsU0FBSCxHQUFlLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBZjtBQUNBLFdBQUcsTUFBSCxDQUFVLEdBQVYsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLENBQTJCLEVBQTNCOztBQUVBLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsR0FBRyxTQUF4QjtBQUNBLGFBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEI7O0FBRUEsYUFBSyxnQkFBTDs7QUFFQTtBQUNEOztBQUVELFNBQUcsR0FBSCxHQUFTLEdBQVQ7QUFDQSxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEVBQW5CLEVBQXVCLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBdkI7QUFDRDs7O3VDQUVrQjtBQUNqQixVQUFJLFdBQUo7QUFDQSxhQUFPLEtBQUssS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFaLEVBQWlDOztBQUUvQixZQUFJLEdBQUcsU0FBUCxFQUFrQjtBQUNoQixlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEdBQUcsTUFBSCxDQUFVLElBQVYsRUFBcEI7QUFDQTtBQUNEOzs7QUFHRCxZQUFJLEtBQUssT0FBTCxLQUFpQixDQUFyQixFQUF3QjtBQUN0QixjQUFNLFNBQVMsR0FBRyxNQUFsQjtBQUNBLGNBQUksUUFBUSxLQUFaO0FBQ0EsY0FBSSxZQUFKOztBQUVBLGNBQUksTUFBSixFQUFZO0FBQ1YsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxvQkFBTSxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQU47QUFDQSxrQkFBSSxPQUFPLEdBQVAsQ0FBSixFQUFpQjtBQUNmLHdCQUFRLElBQVI7QUFDQSxxQkFBSyxPQUFMLENBQWEsTUFBYixDQUFvQixDQUFwQixFQUF1QixDQUF2QjtBQUNBO0FBQ0Q7QUFDRjtBQUNGLFdBVEQsTUFTTztBQUNMLGtCQUFNLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBTjtBQUNBLG9CQUFRLElBQVI7QUFDRDs7QUFFRCxjQUFJLEtBQUosRUFBVzs7QUFFVCxpQkFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXBCO0FBQ0EsaUJBQUssU0FBTDs7QUFFQSxlQUFHLEdBQUgsR0FBUyxHQUFUO0FBQ0EsZUFBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixFQUFmO0FBQ0EsZUFBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsRUFBM0I7QUFDRCxXQVJELE1BUU87QUFDTDtBQUNEO0FBRUYsU0EvQkQsTUErQk87O0FBRUw7QUFDRDtBQUNGO0FBQ0Y7Ozt1Q0FFa0I7QUFDakIsVUFBSSxXQUFKO0FBQ0EsYUFBTyxLQUFLLEtBQUssUUFBTCxDQUFjLEdBQWQsRUFBWixFQUFpQzs7QUFFL0IsWUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEIsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXBCO0FBQ0E7QUFDRDs7O0FBR0QsWUFBSSxLQUFLLE9BQUwsS0FBaUIsS0FBSyxRQUExQixFQUFvQzs7QUFFbEMsZUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQXBCO0FBQ0EsZUFBSyxTQUFMO0FBQ0EsZUFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixHQUFHLEdBQXJCO0FBQ0EsYUFBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixFQUFmO0FBQ0EsYUFBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsRUFBM0I7QUFDRCxTQVBELE1BT087O0FBRUw7QUFDRDtBQUNGO0FBQ0Y7OzsrQkFFVTtBQUNULGFBQU8sS0FBSyxRQUFMLENBQWMsS0FBckI7QUFDRDs7OytCQUVVO0FBQ1QsYUFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFyQjtBQUNEOzs7Ozs7SUFHRyxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsMEZBQ1YsSUFEVTs7QUFFaEIsY0FBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFdBQUssS0FBTCxHQUFhLEVBQWI7QUFDQSxXQUFLLE9BQUwsR0FBZSxLQUFmO0FBTmdCO0FBT2pCOzs7O2dDQUVXLEUsRUFBSTtBQUNkLGdCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsV0FBRyxTQUFILEdBQWUsR0FBRyxNQUFILENBQVUsSUFBVixFQUFmO0FBQ0EsV0FBRyxNQUFILENBQVUsR0FBVixDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBMkIsRUFBM0I7QUFDQTtBQUNEO0FBQ0QsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixFQUFuQjtBQUNEOzs7NkJBRVEsRSxFQUFJO0FBQ1gsZ0JBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixXQUFHLFNBQUgsR0FBZSxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWY7QUFDQSxXQUFHLE1BQUgsQ0FBVSxHQUFWLENBQWMsS0FBZCxDQUFvQixNQUFwQixDQUEyQixFQUEzQjtBQUNBO0FBQ0Q7QUFDRCxXQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEVBQWhCO0FBQ0Q7Ozt5QkFFSSxTLEVBQVc7QUFDZCxnQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFVBQUksU0FBSixFQUFlO0FBQ2IsYUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNEOzs7QUFHRCxVQUFNLFVBQVUsS0FBSyxRQUFyQjtBQUNBLFdBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLGdCQUFRLENBQVIsRUFBVyxPQUFYO0FBQ0Q7OztBQUdELFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEVBQWQ7QUFDQSxVQUFJLEtBQUosRUFBVztBQUNULGNBQU0sT0FBTjtBQUNEO0FBQ0Y7Ozs0QkFFTztBQUNOLFdBQUssT0FBTCxHQUFlLEtBQWY7QUFDRDs7Ozs7O0FBSUgsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDLE1BQWxDLEVBQTBDO0FBQ3hDLE1BQUksTUFBTSxNQUFOLEdBQWUsTUFBZixJQUF5QixNQUFNLE1BQU4sR0FBZSxNQUE1QyxFQUFvRDs7QUFDbEQsVUFBTSxJQUFJLEtBQUosQ0FBVSwrQkFBVixDQUFOLEM7QUFDRCxHOztBQUdELE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDOztBQUNyQyxRQUFJLENBQUMsVUFBVSxJQUFJLENBQWQsQ0FBRCxJQUFxQixDQUFDLE1BQU0sQ0FBTixDQUExQixFQUFvQyxTOzs7Ozs7O0FBUXBDLFFBQUksRUFBRSxNQUFNLENBQU4sYUFBb0IsVUFBVSxJQUFJLENBQWQsQ0FBdEIsQ0FBSixFQUE2Qzs7QUFDM0MsWUFBTSxJQUFJLEtBQUosaUJBQXVCLElBQUksQ0FBM0IsNkJBQU4sQztBQUNELEs7QUFDRixHO0FBQ0YsQzs7UUFFUSxHLEdBQUEsRztRQUFLLFEsR0FBQSxRO1FBQVUsTSxHQUFBLE07UUFBUSxLLEdBQUEsSztRQUFPLEssR0FBQSxLO1FBQU8sTSxHQUFBLE07UUFBUSxTLEdBQUEsUzs7Ozs7Ozs7Ozs7O0FDcjBCdEQ7Ozs7SUFFTSxVO0FBQ0osc0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUNoQixTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxLQUFMO0FBQ0Q7Ozs7NEJBRU87QUFDTixXQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsV0FBSyxDQUFMLEdBQVMsR0FBVDtBQUNBLFdBQUssQ0FBTCxHQUFTLEdBQVQ7QUFDQSxXQUFLLENBQUwsR0FBUyxHQUFUO0FBQ0EsV0FBSyxHQUFMLEdBQVcsQ0FBQyxRQUFaO0FBQ0EsV0FBSyxHQUFMLEdBQVcsUUFBWDtBQUNBLFdBQUssR0FBTCxHQUFXLENBQVg7O0FBRUEsVUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLE1BQW5DLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLGVBQUssU0FBTCxDQUFlLENBQWYsSUFBb0IsQ0FBcEI7QUFDRDtBQUNGO0FBQ0Y7OztpQ0FFWSxLLEVBQU8sSyxFQUFPLFEsRUFBVTtBQUNuQywwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxXQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsV0FBSyxXQUFMLEdBQW1CLENBQUMsUUFBUSxLQUFULElBQWtCLFFBQXJDO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLElBQUksS0FBSixDQUFVLFdBQVcsQ0FBckIsQ0FBakI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxTQUFMLENBQWUsTUFBbkMsRUFBMkMsR0FBM0MsRUFBZ0Q7QUFDOUMsYUFBSyxTQUFMLENBQWUsQ0FBZixJQUFvQixDQUFwQjtBQUNEO0FBQ0Y7OzttQ0FFYztBQUNiLGFBQU8sS0FBSyxTQUFaO0FBQ0Q7OzsyQkFFTSxLLEVBQU8sTSxFQUFRO0FBQ3BCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBTSxJQUFLLFdBQVcsU0FBWixHQUF5QixDQUF6QixHQUE2QixNQUF2Qzs7O0FBR0EsVUFBSSxRQUFRLEtBQUssR0FBakIsRUFBc0IsS0FBSyxHQUFMLEdBQVcsS0FBWDtBQUN0QixVQUFJLFFBQVEsS0FBSyxHQUFqQixFQUFzQixLQUFLLEdBQUwsR0FBVyxLQUFYO0FBQ3RCLFdBQUssR0FBTCxJQUFZLEtBQVo7QUFDQSxXQUFLLEtBQUw7QUFDQSxVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixZQUFJLFFBQVEsS0FBSyxNQUFqQixFQUF5QjtBQUN2QixlQUFLLFNBQUwsQ0FBZSxDQUFmLEtBQXFCLENBQXJCO0FBQ0QsU0FGRCxNQUdLLElBQUksUUFBUSxLQUFLLE1BQWpCLEVBQXlCO0FBQzVCLGVBQUssU0FBTCxDQUFlLEtBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsQ0FBdkMsS0FBNkMsQ0FBN0M7QUFDRCxTQUZJLE1BRUU7QUFDTCxjQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsQ0FBQyxRQUFRLEtBQUssTUFBZCxJQUF3QixLQUFLLFdBQXhDLElBQXVELENBQXJFO0FBQ0EsZUFBSyxTQUFMLENBQWUsS0FBZixLQUF5QixDQUF6QjtBQUNEO0FBQ0Y7OztBQUdELFdBQUssQ0FBTCxHQUFTLEtBQUssQ0FBTCxHQUFTLENBQWxCOztBQUVBLFVBQUksS0FBSyxDQUFMLEtBQVcsQ0FBZixFQUFrQjtBQUNoQjtBQUNEOzs7QUFHRCxVQUFNLFFBQVEsS0FBSyxDQUFuQjtBQUNBLFdBQUssQ0FBTCxHQUFTLFFBQVMsSUFBSSxLQUFLLENBQVYsSUFBZ0IsUUFBUSxLQUF4QixDQUFqQjs7O0FBR0EsV0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFMLEdBQVMsS0FBSyxRQUFRLEtBQWIsS0FBdUIsUUFBUSxLQUFLLENBQXBDLENBQWxCOztBQUVEOzs7NEJBRU87QUFDTixhQUFPLEtBQUssS0FBWjtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssR0FBWjtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssR0FBWjtBQUNEOzs7NEJBRU87QUFDTixhQUFPLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBdkI7QUFDRDs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLEdBQVo7QUFDRDs7O2tDQUVhO0FBQ1osYUFBTyxLQUFLLENBQUwsR0FBUyxLQUFLLENBQXJCO0FBQ0Q7Ozs4QkFFUztBQUNSLGFBQU8sS0FBSyxDQUFaO0FBQ0Q7OzsrQkFFVTtBQUNULGFBQU8sS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFyQjtBQUNEOzs7Z0NBRVc7QUFDVixhQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssUUFBTCxFQUFWLENBQVA7QUFDRDs7Ozs7O0lBR0csVTtBQUNKLHNCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxVQUFMLEdBQWtCLElBQUksVUFBSixDQUFlLElBQWYsQ0FBbEI7QUFDRDs7Ozs0QkFFTztBQUNOLFdBQUssVUFBTCxDQUFnQixLQUFoQjtBQUNBLFdBQUssU0FBTCxHQUFpQixHQUFqQjtBQUNBLFdBQUssYUFBTCxHQUFxQixHQUFyQjtBQUNEOzs7aUNBRVksSyxFQUFPLEssRUFBTyxRLEVBQVU7QUFDbkMsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNBLFdBQUssVUFBTCxDQUFnQixZQUFoQixDQUE2QixLQUE3QixFQUFvQyxLQUFwQyxFQUEyQyxRQUEzQztBQUNEOzs7bUNBRWM7QUFDYixhQUFPLEtBQUssVUFBTCxDQUFnQixZQUFoQixFQUFQO0FBQ0Q7OzsyQkFFTSxLLEVBQU8sUyxFQUFXO0FBQ3ZCLDBCQUFVLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7O0FBRUEsVUFBSSxDQUFDLE1BQU0sS0FBSyxhQUFYLENBQUwsRUFBZ0M7QUFDOUIsYUFBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLEtBQUssU0FBNUIsRUFBdUMsWUFBWSxLQUFLLGFBQXhEO0FBQ0Q7O0FBRUQsV0FBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLFNBQXJCO0FBQ0Q7Ozs2QkFFUSxTLEVBQVc7QUFDbEIsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLE1BQUwsQ0FBWSxHQUFaLEVBQWlCLFNBQWpCO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQVA7QUFDRDs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsRUFBUDtBQUNEOzs7MEJBRUs7QUFDSixhQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFQO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQVA7QUFDRDs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsRUFBUDtBQUNEOzs7OEJBRVM7QUFDUixhQUFPLEtBQUssVUFBTCxDQUFnQixPQUFoQixFQUFQO0FBQ0Q7OztnQ0FFVztBQUNWLGFBQU8sS0FBSyxVQUFMLENBQWdCLFNBQWhCLEVBQVA7QUFDRDs7OytCQUVVO0FBQ1QsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBUDtBQUNEOzs7Ozs7SUFHRyxVO0FBQ0osc0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUNoQixTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLElBQUksVUFBSixFQUFsQjtBQUNBLFNBQUssY0FBTCxHQUFzQixJQUFJLFVBQUosRUFBdEI7QUFDRDs7Ozs0QkFFTztBQUNOLFdBQUssVUFBTCxDQUFnQixLQUFoQjtBQUNBLFdBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNBLFdBQUssVUFBTCxHQUFrQixDQUFsQjtBQUNEOzs7MEJBRUssUyxFQUFXO0FBQ2YsMEJBQVUsU0FBVixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFFQSxXQUFLLFVBQUw7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBdUIsS0FBSyxVQUE1QixFQUF3QyxTQUF4QztBQUNEOzs7MEJBRUssUyxFQUFXLE0sRUFBUTtBQUN2QiwwQkFBVSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCOztBQUVBLFdBQUssVUFBTDtBQUNBLFdBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixLQUFLLFVBQTVCLEVBQXdDLE1BQXhDO0FBQ0EsV0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLFNBQVMsU0FBcEM7QUFDRDs7OzhCQUVTO0FBQ1IsYUFBTyxLQUFLLFVBQVo7QUFDRDs7OzZCQUVRLFMsRUFBVztBQUNsQixXQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsU0FBekI7QUFDRDs7Ozs7O1FBR00sVSxHQUFBLFU7UUFBWSxVLEdBQUEsVTtRQUFZLFUsR0FBQSxVOzs7Ozs7Ozs7O0FDL05qQzs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7UUFFUyxHO1FBQUssTTtRQUFRLEs7UUFBTyxNO1FBQVEsUTtRQUFVLEs7UUFDdEMsVTtRQUFZLFU7UUFBWSxVO1FBQ3hCLE87UUFDQSxNO1FBQVEsSztRQUFPLFM7UUFDZixNO1FBQ0EsSzs7O0FBRVQsSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsU0FBTyxHQUFQLEdBQWE7QUFDWCw2QkFEVztBQUVYLHVCQUZXO0FBR1gsaUNBSFc7QUFJWCx1QkFKVztBQUtYLHFCQUxXO0FBTVgsMkJBTlc7QUFPWCx1QkFQVztBQVFYLDBCQVJXO0FBU1gsaUNBVFc7QUFVWCx3QkFWVztBQVdYLDBCQVhXO0FBWVgsNkJBWlc7QUFhWCxpQkFiVztBQWNYLHFCQWRXO0FBZVg7QUFmVyxHQUFiO0FBaUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLl9uZXh0SWQoKTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8IGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gJHt0aGlzLmlkfWA7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRvdGFsSW5zdGFuY2VzKCkge1xuICAgIHJldHVybiAhdGhpcy5fdG90YWxJbnN0YW5jZXMgPyAwIDogdGhpcy5fdG90YWxJbnN0YW5jZXM7XG4gIH1cblxuICBzdGF0aWMgX25leHRJZCgpIHtcbiAgICB0aGlzLl90b3RhbEluc3RhbmNlcyA9IHRoaXMudG90YWxJbnN0YW5jZXMgKyAxO1xuICAgIHJldHVybiB0aGlzLl90b3RhbEluc3RhbmNlcztcbiAgfVxufVxuXG5leHBvcnQgeyBNb2RlbCB9O1xuZXhwb3J0IGRlZmF1bHQgTW9kZWw7XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0sgfSBmcm9tICcuL3NpbS5qcyc7XG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwuanMnO1xuXG5jbGFzcyBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gIH1cblxuICB0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgfVxuXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuICh0aGlzLmRhdGEubGVuZ3RoKSA/IHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdXNoKHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcbiAgICB0aGlzLmRhdGEucHVzaCh2YWx1ZSk7XG4gICAgdGhpcy50aW1lc3RhbXAucHVzaCh0aW1lc3RhbXApO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICB9XG5cbiAgdW5zaGlmdCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgdGhpcy5kYXRhLnVuc2hpZnQodmFsdWUpO1xuICAgIHRoaXMudGltZXN0YW1wLnVuc2hpZnQodGltZXN0YW1wKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgfVxuXG4gIHNoaWZ0KHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEuc2hpZnQoKTtcbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAuc2hpZnQoKTtcblxuICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwb3AodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5wb3AoKTtcbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAucG9wKCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcGFzc2J5KHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgIHRoaXMuc3RhdHMubGVhdmUodGltZXN0YW1wLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgfVxuXG4gIHJlcG9ydCgpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhdHMuc2l6ZVNlcmllcy5hdmVyYWdlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0cy5kdXJhdGlvblNlcmllcy5hdmVyYWdlKCldO1xuICB9XG5cbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPT0gMDtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gIH1cbn1cblxuY2xhc3MgUFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy5vcmRlciA9IDA7XG4gIH1cblxuICBncmVhdGVyKHJvMSwgcm8yKSB7XG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPiBybzIuZGVsaXZlckF0KSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAocm8xLmRlbGl2ZXJBdCA9PSBybzIuZGVsaXZlckF0KVxuICAgICAgcmV0dXJuIHJvMS5vcmRlciA+IHJvMi5vcmRlcjtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpbnNlcnQocm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcbiAgICByby5vcmRlciA9IHRoaXMub3JkZXIgKys7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgIHRoaXMuZGF0YS5wdXNoKHJvKTtcblxuICAgICAgICAvLyBpbnNlcnQgaW50byBkYXRhIGF0IHRoZSBlbmRcbiAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcblxuICAgICAgICAvLyBoZWFwIHVwXG4gICAgd2hpbGUgKGluZGV4ID4gMCkge1xuICAgICAgY29uc3QgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbcGFyZW50SW5kZXhdLCBybykpIHtcbiAgICAgICAgYVtpbmRleF0gPSBhW3BhcmVudEluZGV4XTtcbiAgICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhW2luZGV4XSA9IG5vZGU7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcbiAgICBsZXQgbGVuID0gYS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAobGVuID09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEucG9wKCk7XG4gICAgfVxuICAgIGNvbnN0IHRvcCA9IGFbMF07XG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxuICAgIGFbMF0gPSBhLnBvcCgpO1xuICAgIGxlbi0tO1xuXG4gICAgICAgIC8vIGhlYXAgZG93blxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgTWF0aC5mbG9vcihsZW4gLyAyKSkge1xuICAgICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAyICogaW5kZXggKyAxO1xuICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMjtcblxuICAgICAgY29uc3Qgc21hbGxlckNoaWxkSW5kZXggPSByaWdodENoaWxkSW5kZXggPCBsZW5cbiAgICAgICAgICAgICAgJiYgIXRoaXMuZ3JlYXRlcihhW3JpZ2h0Q2hpbGRJbmRleF0sIGFbbGVmdENoaWxkSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xuXG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbc21hbGxlckNoaWxkSW5kZXhdLCBub2RlKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYVtpbmRleF0gPSBhW3NtYWxsZXJDaGlsZEluZGV4XTtcbiAgICAgIGluZGV4ID0gc21hbGxlckNoaWxkSW5kZXg7XG4gICAgfVxuICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgICByZXR1cm4gdG9wO1xuICB9XG59XG5cbmV4cG9ydCB7IFF1ZXVlLCBQUXVldWUgfTtcbiIsIlxuY2xhc3MgUmFuZG9tIHtcbiAgY29uc3RydWN0b3Ioc2VlZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpIHtcbiAgICBpZiAodHlwZW9mIChzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgICAgICAgfHwgTWF0aC5jZWlsKHNlZWQpICE9IE1hdGguZmxvb3Ioc2VlZCkpIHsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlcicpOyAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblxuICAgICAgICAvKiBQZXJpb2QgcGFyYW1ldGVycyAqL1xuICAgIHRoaXMuTiA9IDYyNDtcbiAgICB0aGlzLk0gPSAzOTc7XG4gICAgdGhpcy5NQVRSSVhfQSA9IDB4OTkwOGIwZGY7LyogY29uc3RhbnQgdmVjdG9yIGEgKi9cbiAgICB0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOy8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cbiAgICB0aGlzLkxPV0VSX01BU0sgPSAweDdmZmZmZmZmOy8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG4gICAgdGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOy8qIHRoZSBhcnJheSBmb3IgdGhlIHN0YXRlIHZlY3RvciAqL1xuICAgIHRoaXMubXRpID0gdGhpcy5OICsgMTsvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuICAgICAgICAvLyB0aGlzLmluaXRfZ2VucmFuZChzZWVkKTtcbiAgICB0aGlzLmluaXRfYnlfYXJyYXkoW3NlZWRdLCAxKTtcbiAgfVxuXG4gIGluaXRfZ2VucmFuZChzKSB7XG4gICAgdGhpcy5tdFswXSA9IHMgPj4+IDA7XG4gICAgZm9yICh0aGlzLm10aSA9IDE7IHRoaXMubXRpIDwgdGhpcy5OOyB0aGlzLm10aSsrKSB7XG4gICAgICB2YXIgcyA9IHRoaXMubXRbdGhpcy5tdGkgLSAxXSBeICh0aGlzLm10W3RoaXMubXRpIC0gMV0gPj4+IDMwKTtcbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKVxuICAgICAgICAgICAgKyB0aGlzLm10aTtcbiAgICAgICAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuICAgICAgICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG4gICAgICAgICAgICAvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xuICAgICAgICAgICAgLyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cbiAgICB9XG4gIH1cblxuICBpbml0X2J5X2FycmF5KGluaXRfa2V5LCBrZXlfbGVuZ3RoKSB7XG4gICAgbGV0IGksIGosIGs7XG4gICAgdGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuICAgIGkgPSAxOyBqID0gMDtcbiAgICBrID0gKHRoaXMuTiA+IGtleV9sZW5ndGggPyB0aGlzLk4gOiBrZXlfbGVuZ3RoKTtcbiAgICBmb3IgKDsgazsgay0tKSB7XG4gICAgICB2YXIgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG4gICAgICAgICAgICArIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICBpKys7IGorKztcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cbiAgICAgIGlmIChqID49IGtleV9sZW5ndGgpIGogPSAwO1xuICAgIH1cbiAgICBmb3IgKGsgPSB0aGlzLk4gLSAxOyBrOyBrLS0pIHtcbiAgICAgIHZhciBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG4gICAgICAgICAgICAtIGk7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuICAgICAgaSsrO1xuICAgICAgaWYgKGkgPj0gdGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTiAtIDFdOyBpID0gMTsgfVxuICAgIH1cblxuICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xuICB9XG5cbiAgZ2VucmFuZF9pbnQzMigpIHtcbiAgICBsZXQgeTtcbiAgICBjb25zdCBtYWcwMSA9IG5ldyBBcnJheSgweDAsIHRoaXMuTUFUUklYX0EpO1xuICAgICAgICAvKiBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxICovXG5cbiAgICBpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cbiAgICAgIGxldCBraztcblxuICAgICAgaWYgKHRoaXMubXRpID09IHRoaXMuTiArIDEpICAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cbiAgICAgICAgdGhpcy5pbml0X2dlbnJhbmQoNTQ4OSk7IC8qIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZCAqL1xuXG4gICAgICBmb3IgKGtrID0gMDsga2sgPCB0aGlzLk4gLSB0aGlzLk07IGtrKyspIHtcbiAgICAgICAgeSA9ICh0aGlzLm10W2trXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFtrayArIDFdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuICAgICAgfVxuICAgICAgZm9yICg7a2sgPCB0aGlzLk4gLSAxOyBraysrKSB7XG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArICh0aGlzLk0gLSB0aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuICAgICAgfVxuICAgICAgeSA9ICh0aGlzLm10W3RoaXMuTiAtIDFdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10WzBdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgIHRoaXMubXRbdGhpcy5OIC0gMV0gPSB0aGlzLm10W3RoaXMuTSAtIDFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cbiAgICAgIHRoaXMubXRpID0gMDtcbiAgICB9XG5cbiAgICB5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcblxuICAgICAgICAvKiBUZW1wZXJpbmcgKi9cbiAgICB5IF49ICh5ID4+PiAxMSk7XG4gICAgeSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XG4gICAgeSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuICAgIHkgXj0gKHkgPj4+IDE4KTtcblxuICAgIHJldHVybiB5ID4+PiAwO1xuICB9XG5cbiAgZ2VucmFuZF9pbnQzMSgpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpID4+PiAxKTtcbiAgfVxuXG4gIGdlbnJhbmRfcmVhbDEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTUuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMi0xICovXG4gIH1cblxuICByYW5kb20oKSB7XG4gICAgaWYgKHRoaXMucHl0aG9uQ29tcGF0aWJpbGl0eSkge1xuICAgICAgaWYgKHRoaXMuc2tpcCkge1xuICAgICAgICB0aGlzLmdlbnJhbmRfaW50MzIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2tpcCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSAqICgxLjAgLyA0Mjk0OTY3Mjk2LjApO1xuICAgICAgICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbiAgfVxuXG4gIGdlbnJhbmRfcmVhbDMoKSB7XG4gICAgcmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKSArIDAuNSkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcbiAgICAgICAgLyogZGl2aWRlZCBieSAyXjMyICovXG4gIH1cblxuICBnZW5yYW5kX3JlczUzKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmdlbnJhbmRfaW50MzIoKSA+Pj4gNSwgYiA9IHRoaXMuZ2VucmFuZF9pbnQzMigpID4+PiA2O1xuICAgIHJldHVybiAoYSAqIDY3MTA4ODY0LjAgKyBiKSAqICgxLjAgLyA5MDA3MTk5MjU0NzQwOTkyLjApO1xuICB9XG5cbiAgZXhwb25lbnRpYWwobGFtYmRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZXhwb25lbnRpYWwoKSBtdXN0ICBiZSBjYWxsZWQgd2l0aCBcXCdsYW1iZGFcXCcgcGFyYW1ldGVyJyk7IC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgIGNvbnN0IHIgPSB0aGlzLnJhbmRvbSgpO1xuICAgIHJldHVybiAtTWF0aC5sb2cocikgLyBsYW1iZGE7XG4gIH1cblxuICBnYW1tYShhbHBoYSwgYmV0YSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2dhbW1hKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzJyk7IC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgICAgICAvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cbiAgICAgICAgICovXG5cbiAgICBpZiAoYWxwaGEgPiAxLjApIHtcbiAgICAgIGNvbnN0IGFpbnYgPSBNYXRoLnNxcnQoMi4wICogYWxwaGEgLSAxLjApO1xuICAgICAgY29uc3QgYmJiID0gYWxwaGEgLSB0aGlzLkxPRzQ7XG4gICAgICBjb25zdCBjY2MgPSBhbHBoYSArIGFpbnY7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGlmICgodTEgPCAxZS03KSB8fCAodSA+IDAuOTk5OTk5OSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1MiA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGNvbnN0IHYgPSBNYXRoLmxvZyh1MSAvICgxLjAgLSB1MSkpIC8gYWludjtcbiAgICAgICAgdmFyIHggPSBhbHBoYSAqIE1hdGguZXhwKHYpO1xuICAgICAgICBjb25zdCB6ID0gdTEgKiB1MSAqIHUyO1xuICAgICAgICBjb25zdCByID0gYmJiICsgY2NjICogdiAtIHg7XG4gICAgICAgIGlmICgociArIHRoaXMuU0dfTUFHSUNDT05TVCAtIDQuNSAqIHogPj0gMC4wKSB8fCAociA+PSBNYXRoLmxvZyh6KSkpIHtcbiAgICAgICAgICByZXR1cm4geCAqIGJldGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFscGhhID09IDEuMCkge1xuICAgICAgdmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgd2hpbGUgKHUgPD0gMWUtNykge1xuICAgICAgICB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtTWF0aC5sb2codSkgKiBiZXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGNvbnN0IGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xuICAgICAgICBjb25zdCBwID0gYiAqIHU7XG4gICAgICAgIGlmIChwIDw9IDEuMCkge1xuICAgICAgICAgIHZhciB4ID0gTWF0aC5wb3cocCwgMS4wIC8gYWxwaGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB4ID0gLU1hdGgubG9nKChiIC0gcCkgLyBhbHBoYSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHUxID0gdGhpcy5yYW5kb20oKTtcbiAgICAgICAgaWYgKHAgPiAxLjApIHtcbiAgICAgICAgICBpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHggKiBiZXRhO1xuICAgIH1cblxuICB9XG5cbiAgbm9ybWFsKG11LCBzaWdtYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdub3JtYWwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzJyk7ICAgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgIGxldCB6ID0gdGhpcy5sYXN0Tm9ybWFsO1xuICAgIHRoaXMubGFzdE5vcm1hbCA9IE5hTjtcbiAgICBpZiAoIXopIHtcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG4gICAgICB6ID0gTWF0aC5jb3MoYSkgKiBiO1xuICAgICAgdGhpcy5sYXN0Tm9ybWFsID0gTWF0aC5zaW4oYSkgKiBiO1xuICAgIH1cbiAgICByZXR1cm4gbXUgKyB6ICogc2lnbWE7XG4gIH1cblxuICBwYXJldG8oYWxwaGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdwYXJldG8oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIHBhcmFtZXRlcicpOyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICByZXR1cm4gMS4wIC8gTWF0aC5wb3coKDEgLSB1KSwgMS4wIC8gYWxwaGEpO1xuICB9XG5cbiAgdHJpYW5ndWxhcihsb3dlciwgdXBwZXIsIG1vZGUpIHtcbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3RyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyLCB1cHBlciBhbmQgbW9kZSBwYXJhbWV0ZXJzJyk7ICAgIC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuICAgIGNvbnN0IGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgIGlmICh1IDw9IGMpIHtcbiAgICAgIHJldHVybiBsb3dlciArIE1hdGguc3FydCh1ICogKHVwcGVyIC0gbG93ZXIpICogKG1vZGUgLSBsb3dlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcbiAgICB9XG4gIH1cblxuICAgIC8qKlxuICAgICogQWxsIGZsb2F0cyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBhcmUgZXF1YWxseSBsaWtlbHkuIFRoaXMgaXMgdGhlXG4gICAgKiB0aGVvcmV0aWNhbCBkaXN0cmlidXRpb24gbW9kZWwgZm9yIGEgYmFsYW5jZWQgY29pbiwgYW4gdW5iaWFzZWQgZGllLCBhXG4gICAgKiBjYXNpbm8gcm91bGV0dGUsIG9yIHRoZSBmaXJzdCBjYXJkIG9mIGEgd2VsbC1zaHVmZmxlZCBkZWNrLlxuICAgICovXG4gIHVuaWZvcm0obG93ZXIsIHVwcGVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnMnKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgIHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XG4gIH1cblxuICB3ZWlidWxsKGFscGhhLCBiZXRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignd2VpYnVsbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAgICAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgY29uc3QgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG4gICAgcmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcbiAgfVxufVxuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcblxuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgZGVmYXVsdCBSYW5kb207XG4iLCJpbXBvcnQgeyBBUkdfQ0hFQ0ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3IoZW50aXR5LCBjdXJyZW50VGltZSwgZGVsaXZlckF0KSB7XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgdGhpcy5zY2hlZHVsZWRBdCA9IGN1cnJlbnRUaW1lO1xuICAgIHRoaXMuZGVsaXZlckF0ID0gZGVsaXZlckF0O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT0gdGhpcykge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBbMF0uY2FuY2VsKCk7XG4gICAgfVxuXG4gICAgICAgIC8vIC0tPiB0aGlzIGlzIG1haW4gcmVxdWVzdFxuICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgICAgICAvLyBpZiBhbHJlYWR5IGNhbmNlbGxlZCwgZG8gbm90aGluZ1xuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIHNldCBmbGFnXG4gICAgdGhpcy5jYW5jZWxsZWQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuZGVsaXZlckF0ID09IDApIHtcbiAgICAgIHRoaXMuZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgaWYgKCh0aGlzLnNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcilcbiAgICAgICAgICAgICAgICAgICAgfHwgKHRoaXMuc291cmNlIGluc3RhbmNlb2YgU3RvcmUpKSB7XG4gICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzUHV0UXVldWUuY2FsbCh0aGlzLnNvdXJjZSk7XG4gICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzR2V0UXVldWUuY2FsbCh0aGlzLnNvdXJjZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdyb3VwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5ncm91cFtpXS5jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9uZShjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAzLCBGdW5jdGlvbiwgT2JqZWN0KTtcblxuICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2FpdFVudGlsKGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0LCB1bmRlZmluZWQsIEZ1bmN0aW9uLCBPYmplY3QpO1xuICAgIGlmICh0aGlzLm5vUmVuZWdlKSByZXR1cm4gdGhpcztcblxuICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdCh0aGlzLnNjaGVkdWxlZEF0ICsgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCwgdW5kZWZpbmVkLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgcm8ubXNnID0gZXZlbnQ7XG4gICAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG5cbiAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgICByby5tc2cgPSBldmVudFtpXTtcbiAgICAgICAgZXZlbnRbaV0uYWRkV2FpdExpc3Qocm8pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGl2ZXIoKSB7XG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICBpZiAoIXRoaXMuY2FsbGJhY2tzKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwWzBdLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgfVxuXG4gIGNhbmNlbFJlbmVnZUNsYXVzZXMoKSB7XG4gICAgICAgIC8vIHRoaXMuY2FuY2VsID0gdGhpcy5OdWxsO1xuICAgICAgICAvLyB0aGlzLndhaXRVbnRpbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy51bmxlc3NFdmVudCA9IHRoaXMuTnVsbDtcbiAgICB0aGlzLm5vUmVuZWdlID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5ncm91cCB8fCB0aGlzLmdyb3VwWzBdICE9IHRoaXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIE51bGwoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfYWRkUmVxdWVzdChkZWxpdmVyQXQsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHksXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWRBdCxcbiAgICAgICAgICAgICAgICBkZWxpdmVyQXQpO1xuXG4gICAgcm8uY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xuXG4gICAgaWYgKHRoaXMuZ3JvdXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JvdXAgPSBbdGhpc107XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cC5wdXNoKHJvKTtcbiAgICByby5ncm91cCA9IHRoaXMuZ3JvdXA7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgX2RvQ2FsbGJhY2soc291cmNlLCBtc2csIGRhdGEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2ldWzBdO1xuICAgICAgaWYgKCFjYWxsYmFjaykgY29udGludWU7XG5cbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5jYWxsYmFja3NbaV1bMV07XG4gICAgICBpZiAoIWNvbnRleHQpIGNvbnRleHQgPSB0aGlzLmVudGl0eTtcblxuICAgICAgY29uc3QgYXJndW1lbnQgPSB0aGlzLmNhbGxiYWNrc1tpXVsyXTtcblxuICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IHNvdXJjZTtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbXNnO1xuICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBkYXRhO1xuXG4gICAgICBpZiAoIWFyZ3VtZW50KSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBudWxsO1xuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBudWxsO1xuICAgICAgY29udGV4dC5jYWxsYmFja0RhdGEgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBSZXF1ZXN0IH07XG4iLCJpbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwuanMnO1xuXG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5zaW0gPSBzaW07XG4gIH1cblxuICB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbS50aW1lKCk7XG4gIH1cblxuICBzZXRUaW1lcihkdXJhdGlvbikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCkgKyBkdXJhdGlvbik7XG5cbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHdhaXRFdmVudChldmVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGV2ZW50O1xuICAgIGV2ZW50LmFkZFdhaXRMaXN0KHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBxdWV1ZUV2ZW50KGV2ZW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgZXZlbnQuYWRkUXVldWUocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHVzZUZhY2lsaXR5KGZhY2lsaXR5LCBkdXJhdGlvbikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEZhY2lsaXR5KTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICByby5zb3VyY2UgPSBmYWNpbGl0eTtcbiAgICBmYWNpbGl0eS51c2UoZHVyYXRpb24sIHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBwdXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICBidWZmZXIucHV0KGFtb3VudCwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldEJ1ZmZlcihidWZmZXIsIGFtb3VudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgIGJ1ZmZlci5nZXQoYW1vdW50LCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0U3RvcmUoc3RvcmUsIG9iaikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIFN0b3JlKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICByby5zb3VyY2UgPSBzdG9yZTtcbiAgICBzdG9yZS5wdXQob2JqLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgZ2V0U3RvcmUoc3RvcmUsIGZpbHRlcikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIsIFN0b3JlLCBGdW5jdGlvbik7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUuZ2V0KGZpbHRlciwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHNlbmQobWVzc2FnZSwgZGVsYXksIGVudGl0aWVzKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMuc2ltLCB0aGlzLnRpbWUoKSwgdGhpcy50aW1lKCkgKyBkZWxheSk7XG4gICAgcm8uc291cmNlID0gdGhpcztcbiAgICByby5tc2cgPSBtZXNzYWdlO1xuICAgIHJvLmRhdGEgPSBlbnRpdGllcztcbiAgICByby5kZWxpdmVyID0gdGhpcy5zaW0uc2VuZE1lc3NhZ2U7XG5cbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc2ltLmxvZyhtZXNzYWdlLCB0aGlzKTtcbiAgfVxufVxuXG5jbGFzcyBTaW0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNpbVRpbWUgPSAwO1xuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlID0gbmV3IFBRdWV1ZSgpO1xuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gICAgdGhpcy5lbnRpdHlJZCA9IDE7XG4gIH1cblxuICB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbVRpbWU7XG4gIH1cblxuICBzZW5kTWVzc2FnZSgpIHtcbiAgICBjb25zdCBzZW5kZXIgPSB0aGlzLnNvdXJjZTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tc2c7XG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XG4gICAgY29uc3Qgc2ltID0gc2VuZGVyLnNpbTtcblxuICAgIGlmICghZW50aXRpZXMpIHtcbiAgICAgICAgICAgIC8vIHNlbmQgdG8gYWxsIGVudGl0aWVzXG4gICAgICBmb3IgKHZhciBpID0gc2ltLmVudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBlbnRpdHkgPSBzaW0uZW50aXRpZXNbaV07XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlLmNhbGwoZW50aXR5LCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZW50aXRpZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZm9yICh2YXIgaSA9IGVudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2UuY2FsbChlbnRpdHksIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbnRpdGllcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgZW50aXRpZXMub25NZXNzYWdlLmNhbGwoZW50aXRpZXMsIHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkRW50aXR5KGtsYXNzLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHByb3RvdHlwZSBoYXMgc3RhcnQgZnVuY3Rpb25cbiAgICBpZiAoIWtsYXNzLnByb3RvdHlwZS5zdGFydCkgeyAgLy8gQVJHIENIRUNLXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSBjbGFzcyAke2tsYXNzLm5hbWV9IG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRgKTtcbiAgICB9XG5cbiAgICB2YXIgZW50aXR5ID0gbmV3IGtsYXNzKHRoaXMsIG5hbWUpO1xuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuXG4gICAgZW50aXR5LnN0YXJ0KC4uLmFyZ3MpO1xuXG4gICAgcmV0dXJuIGVudGl0eTtcbiAgfVxuXG4gIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xuICAgICAgICAvLyBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcbiAgICBpZiAoIW1heEV2ZW50cykgeyBtYXhFdmVudHMgPSBNYXRoLkluZmluaXR5OyB9XG4gICAgbGV0IGV2ZW50cyA9IDA7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgZXZlbnRzKys7XG4gICAgICBpZiAoZXZlbnRzID4gbWF4RXZlbnRzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZWFybGllc3QgZXZlbnRcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZXZlbnRzLCB3ZSBhcmUgZG9uZSB3aXRoIHNpbXVsYXRpb24gaGVyZS5cbiAgICAgIGlmIChybyA9PSB1bmRlZmluZWQpIGJyZWFrO1xuXG5cbiAgICAgICAgICAgIC8vIFVoIG9oLi4gd2UgYXJlIG91dCBvZiB0aW1lIG5vd1xuICAgICAgaWYgKHJvLmRlbGl2ZXJBdCA+IGVuZFRpbWUpIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBBZHZhbmNlIHNpbXVsYXRpb24gdGltZVxuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGV2ZW50IGlzIGFscmVhZHkgY2FuY2VsbGVkLCBpZ25vcmVcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuXG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RlcCgpIHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xuICAgICAgaWYgKCFybykgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRMb2dnZXIobG9nZ2VyKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSwgRnVuY3Rpb24pO1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UsIGVudGl0eSkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgaWYgKCF0aGlzLmxvZ2dlcikgcmV0dXJuO1xuICAgIGxldCBlbnRpdHlNc2cgPSAnJztcbiAgICBpZiAoZW50aXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChlbnRpdHkubmFtZSkge1xuICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5uYW1lfV1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXR5TXNnID0gYCBbJHtlbnRpdHkuaWR9XSBgO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvZ2dlcihgJHt0aGlzLnNpbVRpbWUudG9GaXhlZCg2KX0ke2VudGl0eU1zZ30gICAke21lc3NhZ2V9YCk7XG4gIH1cbn1cblxuY2xhc3MgRmFjaWxpdHkgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGRpc2NpcGxpbmUsIHNlcnZlcnMsIG1heHFsZW4pIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCA0KTtcblxuICAgIHRoaXMuZnJlZSA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcbiAgICB0aGlzLnNlcnZlcnMgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5tYXhxbGVuID0gKG1heHFsZW4gPT09IHVuZGVmaW5lZCkgPyAtMSA6IDEgKiBtYXhxbGVuO1xuXG4gICAgc3dpdGNoIChkaXNjaXBsaW5lKSB7XG5cbiAgICBjYXNlIEZhY2lsaXR5LkxDRlM6XG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlTENGUztcbiAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRmFjaWxpdHkuUFM6XG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZztcbiAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRmFjaWxpdHkuRkNGUzpcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUZDRlM7XG4gICAgICB0aGlzLmZyZWVTZXJ2ZXJzID0gbmV3IEFycmF5KHRoaXMuc2VydmVycyk7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5mcmVlU2VydmVyc1tpXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XG4gIH1cblxuICBzeXN0ZW1TdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcbiAgfVxuXG4gIHF1ZXVlU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gIH1cblxuICB1c2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idXN5RHVyYXRpb247XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgICB0aGlzLnF1ZXVlLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cblxuICB1c2VGQ0ZTKGR1cmF0aW9uLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgIGlmICgodGhpcy5tYXhxbGVuID09PSAwICYmICF0aGlzLmZyZWUpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMubWF4cWxlbiA+IDAgJiYgdGhpcy5xdWV1ZS5zaXplKCkgPj0gdGhpcy5tYXhxbGVuKSkge1xuICAgICAgcm8ubXNnID0gLTE7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgY29uc3Qgbm93ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICB0aGlzLnN0YXRzLmVudGVyKG5vdyk7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKG5vdyk7XG4gIH1cblxuICB1c2VGQ0ZTU2NoZWR1bGUodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB3aGlsZSAodGhpcy5mcmVlID4gMCAmJiAhdGhpcy5xdWV1ZS5lbXB0eSgpKSB7XG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUuc2hpZnQodGltZXN0YW1wKTsgLy8gVE9ET1xuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5mcmVlU2VydmVyc1tpXSkge1xuICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICByby5tc2cgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnJlZSAtLTtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IHJvLmR1cmF0aW9uO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgYWxsIG90aGVyIHJlbmVnaW5nIHJlcXVlc3RzXG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG5cbiAgICAgIGNvbnN0IG5ld3JvID0gbmV3IFJlcXVlc3QodGhpcywgdGltZXN0YW1wLCB0aW1lc3RhbXAgKyByby5kdXJhdGlvbik7XG4gICAgICBuZXdyby5kb25lKHRoaXMudXNlRkNGU0NhbGxiYWNrLCB0aGlzLCBybyk7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld3JvKTtcbiAgICB9XG4gIH1cblxuICB1c2VGQ0ZTQ2FsbGJhY2socm8pIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBvbmUgbW9yZSBmcmVlIHNlcnZlclxuICAgIHRoaXMuZnJlZSArKztcbiAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShyby5zY2hlZHVsZWRBdCwgcm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgc29tZW9uZSB3YWl0aW5nLCBzY2hlZHVsZSBpdCBub3dcbiAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShyby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyByZXN0b3JlIHRoZSBkZWxpdmVyIGZ1bmN0aW9uLCBhbmQgZGVsaXZlclxuICAgIHJvLmRlbGl2ZXIoKTtcblxuICB9XG5cbiAgdXNlTENGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSB3YXMgYSBydW5uaW5nIHJlcXVlc3QuLlxuICAgIGlmICh0aGlzLmN1cnJlbnRSTykge1xuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkgLSB0aGlzLmN1cnJlbnRSTy5sYXN0SXNzdWVkKTtcbiAgICAgICAgICAgIC8vIGNhbGN1YXRlIHRoZSByZW1haW5pbmcgdGltZVxuICAgICAgdGhpcy5jdXJyZW50Uk8ucmVtYWluaW5nID1cbiAgICAgICAgICAgICAgICAodGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Uk8gPSBybztcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZS4uXG4gICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHJvLmxhc3RJc3N1ZWQgPSByby5lbnRpdHkudGltZSgpO1xuXG4gICAgICAgIC8vIHNjaGVkdWxlIHRoaXMgbmV3IGV2ZW50XG4gICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIHVzZUxDRlNDYWxsYmFjaygpIHtcbiAgICBjb25zdCBybyA9IHRoaXM7XG4gICAgY29uc3QgZmFjaWxpdHkgPSByby5zb3VyY2U7XG5cbiAgICBpZiAocm8gIT0gZmFjaWxpdHkuY3VycmVudFJPKSByZXR1cm47XG4gICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcblxuICAgICAgICAvLyBzdGF0c1xuICAgIGZhY2lsaXR5LmJ1c3lEdXJhdGlvbiArPSAocm8uZW50aXR5LnRpbWUoKSAtIHJvLmxhc3RJc3N1ZWQpO1xuICAgIGZhY2lsaXR5LnN0YXRzLmxlYXZlKHJvLnNjaGVkdWxlZEF0LCByby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyBkZWxpdmVyIHRoaXMgcmVxdWVzdFxuICAgIHJvLmRlbGl2ZXIgPSByby5zYXZlZF9kZWxpdmVyO1xuICAgIGRlbGV0ZSByby5zYXZlZF9kZWxpdmVyO1xuICAgIHJvLmRlbGl2ZXIoKTtcblxuICAgICAgICAvLyBzZWUgaWYgdGhlcmUgYXJlIHBlbmRpbmcgcmVxdWVzdHNcbiAgICBpZiAoIWZhY2lsaXR5LnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgIGNvbnN0IG9iaiA9IGZhY2lsaXR5LnF1ZXVlLnBvcChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICB9XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nKGR1cmF0aW9uLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIsIG51bGwsIFJlcXVlc3QpO1xuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xuICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIHRydWUpO1xuICB9XG5cbiAgdXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCBpc0FkZGVkKSB7XG4gICAgY29uc3QgY3VycmVudCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBpc0FkZGVkID8gKChzaXplICsgMS4wKSAvIHNpemUpIDogKChzaXplIC0gMS4wKSAvIHNpemUpO1xuICAgIGNvbnN0IG5ld1F1ZXVlID0gW107XG5cbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMubGFzdElzc3VlZCA9IGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcbiAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgbmV3ZXYgPSBuZXcgUmVxdWVzdCh0aGlzLCBjdXJyZW50LCBjdXJyZW50ICsgKGV2LmRlbGl2ZXJBdCAtIGN1cnJlbnQpICogbXVsdGlwbGllcik7XG4gICAgICBuZXdldi5ybyA9IGV2LnJvO1xuICAgICAgbmV3ZXYuc291cmNlID0gdGhpcztcbiAgICAgIG5ld2V2LmRlbGl2ZXIgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaztcbiAgICAgIG5ld1F1ZXVlLnB1c2gobmV3ZXYpO1xuXG4gICAgICBldi5jYW5jZWwoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcbiAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcbiAgICBpZiAoaXNBZGRlZCkge1xuICAgICAgdmFyIG5ld2V2ID0gbmV3IFJlcXVlc3QodGhpcywgY3VycmVudCwgY3VycmVudCArIHJvLmR1cmF0aW9uICogKHNpemUgKyAxKSk7XG4gICAgICBuZXdldi5ybyA9IHJvO1xuICAgICAgbmV3ZXYuc291cmNlID0gdGhpcztcbiAgICAgIG5ld2V2LmRlbGl2ZXIgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaztcbiAgICAgIG5ld1F1ZXVlLnB1c2gobmV3ZXYpO1xuXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZSA9IG5ld1F1ZXVlO1xuXG4gICAgICAgIC8vIHVzYWdlIHN0YXRpc3RpY3NcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKGN1cnJlbnQgLSB0aGlzLmxhc3RJc3N1ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICBjb25zdCBldiA9IHRoaXM7XG4gICAgY29uc3QgZmFjID0gZXYuc291cmNlO1xuXG4gICAgaWYgKGV2LmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIGZhYy5zdGF0cy5sZWF2ZShldi5yby5zY2hlZHVsZWRBdCwgZXYucm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICBmYWMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKGV2LnJvLCBmYWxzZSk7XG4gICAgZXYucm8uZGVsaXZlcigpO1xuICB9XG59XG5cbkZhY2lsaXR5LkZDRlMgPSAxO1xuRmFjaWxpdHkuTENGUyA9IDI7XG5GYWNpbGl0eS5QUyA9IDM7XG5GYWNpbGl0eS5OdW1EaXNjaXBsaW5lcyA9IDQ7XG5cbmNsYXNzIEJ1ZmZlciBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSwgY2FwYWNpdHksIGluaXRpYWwpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLmF2YWlsYWJsZSA9IChpbml0aWFsID09PSB1bmRlZmluZWQpID8gMCA6IGluaXRpYWw7XG4gICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChhbW91bnQsIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgYW1vdW50IDw9IHRoaXMuYXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSAtPSBhbW91bnQ7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHV0KGFtb3VudCwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLnB1dFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiAoYW1vdW50ICsgdGhpcy5hdmFpbGFibGUpIDw9IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlICs9IGFtb3VudDtcblxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgdGhpcy5wdXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgdGhpcy5wcm9ncmVzc0dldFF1ZXVlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgdGhpcy5wdXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgbGV0IG9iajtcbiAgICB3aGlsZSAob2JqID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtPSBvYmouYW1vdW50O1xuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgIGxldCBvYmo7XG4gICAgd2hpbGUgKG9iaiA9IHRoaXMucHV0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgU3RvcmUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKGNhcGFjaXR5LCBuYW1lID0gbnVsbCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuICAgIHN1cGVyKG5hbWUpO1xuXG4gICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChmaWx0ZXIsIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICBsZXQgb2JqO1xuICAgICAgICAgICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBjb2RlIG91dFxuICAgICAgICAgICAgLy8gaXQgaXMgcmVwZWF0ZWQgaW4gcHJvZ3Jlc3NHZXRRdWV1ZVxuICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcbiAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iaiA9IHRoaXMub2JqZWN0cy5zaGlmdCgpO1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgICB0aGlzLmdldFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByby5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHB1dChvYmosIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG4gICAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xuXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLm9iaiA9IG9iajtcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICBsZXQgcm87XG4gICAgd2hpbGUgKHJvID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSByby5maWx0ZXI7XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBsZXQgb2JqO1xuXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7XG4gICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0cy5zaGlmdCgpO1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XG5cbiAgICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgIGxldCBybztcbiAgICB3aGlsZSAocm8gPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAodGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHJvLm9iaik7XG4gICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHV0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHV0UXVldWUuc3RhdHM7XG4gIH1cblxuICBnZXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcbiAgfVxufVxuXG5jbGFzcyBFdmVudCBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDAsIDEpO1xuXG4gICAgdGhpcy53YWl0TGlzdCA9IFtdO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGFkZFdhaXRMaXN0KHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBpZiAodGhpcy5pc0ZpcmVkKSB7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLndhaXRMaXN0LnB1c2gocm8pO1xuICB9XG5cbiAgYWRkUXVldWUocm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVldWUucHVzaChybyk7XG4gIH1cblxuICBmaXJlKGtlZXBGaXJlZCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDAsIDEpO1xuXG4gICAgaWYgKGtlZXBGaXJlZCkge1xuICAgICAgdGhpcy5pc0ZpcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcbiAgICBjb25zdCB0bXBMaXN0ID0gdGhpcy53YWl0TGlzdDtcbiAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0bXBMaXN0W2ldLmRlbGl2ZXIoKTtcbiAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggb25lIHF1ZXVlZCBlbnRpdHlcbiAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICBpZiAobHVja3kpIHtcbiAgICAgIGx1Y2t5LmRlbGl2ZXIoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIEFSR19DSEVDSyhmb3VuZCwgZXhwTWluLCBleHBNYXgpIHtcbiAgaWYgKGZvdW5kLmxlbmd0aCA8IGV4cE1pbiB8fCBmb3VuZC5sZW5ndGggPiBleHBNYXgpIHsgICAvLyBBUkdfQ0hFQ0tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzJyk7ICAgLy8gQVJHX0NIRUNLXG4gIH0gICAvLyBBUkdfQ0hFQ0tcblxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZm91bmQubGVuZ3RoOyBpKyspIHsgICAvLyBBUkdfQ0hFQ0tcbiAgICBpZiAoIWFyZ3VtZW50c1tpICsgM10gfHwgIWZvdW5kW2ldKSBjb250aW51ZTsgICAvLyBBUkdfQ0hFQ0tcblxuLy8gICAgcHJpbnQoXCJURVNUIFwiICsgZm91bmRbaV0gKyBcIiBcIiArIGFyZ3VtZW50c1tpICsgM10gICAvLyBBUkdfQ0hFQ0tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBFdmVudCkgICAvLyBBUkdfQ0hFQ0tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSAgIC8vIEFSR19DSEVDS1xuLy8gICAgKyBcIlxcblwiKTsgICAvLyBBUkcgQ0hFQ0tcblxuXG4gICAgaWYgKCEoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSkgeyAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgIC8vIEFSR19DSEVDS1xuICB9ICAgLy8gQVJHX0NIRUNLXG59ICAgLy8gQVJHX0NIRUNLXG5cbmV4cG9ydCB7IFNpbSwgRmFjaWxpdHksIEJ1ZmZlciwgU3RvcmUsIEV2ZW50LCBFbnRpdHksIEFSR19DSEVDSyB9O1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBEYXRhU2VyaWVzIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5Db3VudCA9IDA7XG4gICAgdGhpcy5XID0gMC4wO1xuICAgIHRoaXMuQSA9IDAuMDtcbiAgICB0aGlzLlEgPSAwLjA7XG4gICAgdGhpcy5NYXggPSAtSW5maW5pdHk7XG4gICAgdGhpcy5NaW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLlN1bSA9IDA7XG5cbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMywgMyk7XG5cbiAgICB0aGlzLmhMb3dlciA9IGxvd2VyO1xuICAgIHRoaXMuaFVwcGVyID0gdXBwZXI7XG4gICAgdGhpcy5oQnVja2V0U2l6ZSA9ICh1cHBlciAtIGxvd2VyKSAvIG5idWNrZXRzO1xuICAgIHRoaXMuaGlzdG9ncmFtID0gbmV3IEFycmF5KG5idWNrZXRzICsgMik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIGdldEhpc3RvZ3JhbSgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b2dyYW07XG4gIH1cblxuICByZWNvcmQodmFsdWUsIHdlaWdodCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgY29uc3QgdyA9ICh3ZWlnaHQgPT09IHVuZGVmaW5lZCkgPyAxIDogd2VpZ2h0O1xuICAgICAgICAvLyBkb2N1bWVudC53cml0ZShcIkRhdGEgc2VyaWVzIHJlY29yZGluZyBcIiArIHZhbHVlICsgXCIgKHdlaWdodCA9IFwiICsgdyArIFwiKVxcblwiKTtcblxuICAgIGlmICh2YWx1ZSA+IHRoaXMuTWF4KSB0aGlzLk1heCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSA8IHRoaXMuTWluKSB0aGlzLk1pbiA9IHZhbHVlO1xuICAgIHRoaXMuU3VtICs9IHZhbHVlO1xuICAgIHRoaXMuQ291bnQgKys7XG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBpZiAodmFsdWUgPCB0aGlzLmhMb3dlcikge1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbVswXSArPSB3O1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodmFsdWUgPiB0aGlzLmhVcHBlcikge1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbVt0aGlzLmhpc3RvZ3JhbS5sZW5ndGggLSAxXSArPSB3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh2YWx1ZSAtIHRoaXMuaExvd2VyKSAvIHRoaXMuaEJ1Y2tldFNpemUpICsgMTtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baW5kZXhdICs9IHc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgICAgIC8vIFdpID0gV2ktMSArIHdpXG4gICAgdGhpcy5XID0gdGhpcy5XICsgdztcblxuICAgIGlmICh0aGlzLlcgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAgICAgLy8gQWkgPSBBaS0xICsgd2kvV2kgKiAoeGkgLSBBaS0xKVxuICAgIGNvbnN0IGxhc3RBID0gdGhpcy5BO1xuICAgIHRoaXMuQSA9IGxhc3RBICsgKHcgLyB0aGlzLlcpICogKHZhbHVlIC0gbGFzdEEpO1xuXG4gICAgICAgIC8vIFFpID0gUWktMSArIHdpKHhpIC0gQWktMSkoeGkgLSBBaSlcbiAgICB0aGlzLlEgPSB0aGlzLlEgKyB3ICogKHZhbHVlIC0gbGFzdEEpICogKHZhbHVlIC0gdGhpcy5BKTtcbiAgICAgICAgLy8gcHJpbnQoXCJcXHRXPVwiICsgdGhpcy5XICsgXCIgQT1cIiArIHRoaXMuQSArIFwiIFE9XCIgKyB0aGlzLlEgKyBcIlxcblwiKTtcbiAgfVxuXG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLkNvdW50O1xuICB9XG5cbiAgbWluKCkge1xuICAgIHJldHVybiB0aGlzLk1pbjtcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5NYXg7XG4gIH1cblxuICByYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5NYXggLSB0aGlzLk1pbjtcbiAgfVxuXG4gIHN1bSgpIHtcbiAgICByZXR1cm4gdGhpcy5TdW07XG4gIH1cblxuICBzdW1XZWlnaHRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5BICogdGhpcy5XO1xuICB9XG5cbiAgYXZlcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5BO1xuICB9XG5cbiAgdmFyaWFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuUSAvIHRoaXMuVztcbiAgfVxuXG4gIGRldmlhdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMudmFyaWFuY2UoKSk7XG4gIH1cbn1cblxuY2xhc3MgVGltZVNlcmllcyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLmRhdGFTZXJpZXMgPSBuZXcgRGF0YVNlcmllcyhuYW1lKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGF0YVNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMubGFzdFZhbHVlID0gTmFOO1xuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IE5hTjtcbiAgfVxuXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMywgMyk7XG4gICAgdGhpcy5kYXRhU2VyaWVzLnNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKTtcbiAgfVxuXG4gIGdldEhpc3RvZ3JhbSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmdldEhpc3RvZ3JhbSgpO1xuICB9XG5cbiAgcmVjb3JkKHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICghaXNOYU4odGhpcy5sYXN0VGltZXN0YW1wKSkge1xuICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlY29yZCh0aGlzLmxhc3RWYWx1ZSwgdGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5yZWNvcmQoTmFOLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5jb3VudCgpO1xuICB9XG5cbiAgbWluKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWluKCk7XG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5tYXgoKTtcbiAgfVxuXG4gIHJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMucmFuZ2UoKTtcbiAgfVxuXG4gIHN1bSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnN1bSgpO1xuICB9XG5cbiAgYXZlcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmF2ZXJhZ2UoKTtcbiAgfVxuXG4gIGRldmlhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmRldmlhdGlvbigpO1xuICB9XG5cbiAgdmFyaWFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy52YXJpYW5jZSgpO1xuICB9XG59XG5cbmNsYXNzIFBvcHVsYXRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICAgIHRoaXMuc2l6ZVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNpemVTZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgfVxuXG4gIGVudGVyKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5wb3B1bGF0aW9uICsrO1xuICAgIHRoaXMuc2l6ZVNlcmllcy5yZWNvcmQodGhpcy5wb3B1bGF0aW9uLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgbGVhdmUoYXJyaXZhbEF0LCBsZWZ0QXQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiAtLTtcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgbGVmdEF0KTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlY29yZChsZWZ0QXQgLSBhcnJpdmFsQXQpO1xuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0aW9uO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgdGhpcy5zaXplU2VyaWVzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuIiwiaW1wb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSwgQVJHX0NIRUNLIH0gZnJvbSAnLi9saWIvc2ltLmpzJztcbmltcG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfSBmcm9tICcuL2xpYi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnLi9saWIvcmVxdWVzdC5qcyc7XG5pbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9saWIvcXVldWVzLmpzJztcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJy4vbGliL3JhbmRvbS5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbGliL21vZGVsLmpzJztcblxuZXhwb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSB9O1xuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuZXhwb3J0IHsgUmVxdWVzdCB9O1xuZXhwb3J0IHsgUFF1ZXVlLCBRdWV1ZSwgQVJHX0NIRUNLIH07XG5leHBvcnQgeyBSYW5kb20gfTtcbmV4cG9ydCB7IE1vZGVsIH07XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuU2ltID0ge1xuICAgIEFSR19DSEVDSzogQVJHX0NIRUNLLFxuICAgIEJ1ZmZlcjogQnVmZmVyLFxuICAgIERhdGFTZXJpZXM6IERhdGFTZXJpZXMsXG4gICAgRW50aXR5OiBFbnRpdHksXG4gICAgRXZlbnQ6IEV2ZW50LFxuICAgIEZhY2lsaXR5OiBGYWNpbGl0eSxcbiAgICBNb2RlbDogTW9kZWwsXG4gICAgUFF1ZXVlOiBQUXVldWUsXG4gICAgUG9wdWxhdGlvbjogUG9wdWxhdGlvbixcbiAgICBRdWV1ZTogUXVldWUsXG4gICAgUmFuZG9tOiBSYW5kb20sXG4gICAgUmVxdWVzdDogUmVxdWVzdCxcbiAgICBTaW06IFNpbSxcbiAgICBTdG9yZTogU3RvcmUsXG4gICAgVGltZVNlcmllczogVGltZVNlcmllc1xuICB9O1xufVxuIl19
