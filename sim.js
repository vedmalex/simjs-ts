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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEseUZBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLHVCQUFiO0FBSmdCO0FBS2pCOzs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBUSxLQUFLLElBQUwsQ0FBVSxNQUFYLEdBQXFCLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBN0IsQ0FBckIsR0FBdUQsU0FBOUQ7QUFD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QixDQUEyQixTQUFTLFNBQXBDO0FBQ0Q7Ozs4QkFFUztBQUNSLGFBQU8sS0FBSyxVQUFaO0FBQ0Q7Ozs2QkFFUSxTLEVBQVc7QUFDbEIsV0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLFNBQXpCO0FBQ0Q7Ozs7OztRQUdNLFUsR0FBQSxVO1FBQVksVSxHQUFBLFU7UUFBWSxVLEdBQUEsVTs7Ozs7Ozs7OztBQy9OakM7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O1FBRVMsRztRQUFLLE07UUFBUSxLO1FBQU8sTTtRQUFRLFE7UUFBVSxLO1FBQ3RDLFU7UUFBWSxVO1FBQVksVTtRQUN4QixPO1FBQ0EsTTtRQUFRLEs7UUFBTyxTO1FBQ2YsTTtRQUNBLEs7OztBQUVULElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFNBQU8sR0FBUCxHQUFhO0FBQ1gsNkJBRFc7QUFFWCx1QkFGVztBQUdYLGlDQUhXO0FBSVgsdUJBSlc7QUFLWCxxQkFMVztBQU1YLDJCQU5XO0FBT1gsdUJBUFc7QUFRWCwwQkFSVztBQVNYLGlDQVRXO0FBVVgsd0JBVlc7QUFXWCwwQkFYVztBQVlYLDZCQVpXO0FBYVgsaUJBYlc7QUFjWCxxQkFkVztBQWVYO0FBZlcsR0FBYjtBQWlCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25zdHJ1Y3Rvci5fbmV4dElkKCk7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ICR7dGhpcy5pZH1gO1xuICB9XG5cbiAgc3RhdGljIGdldCB0b3RhbEluc3RhbmNlcygpIHtcbiAgICByZXR1cm4gIXRoaXMuX3RvdGFsSW5zdGFuY2VzID8gMCA6IHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xuICB9XG5cbiAgc3RhdGljIF9uZXh0SWQoKSB7XG4gICAgdGhpcy5fdG90YWxJbnN0YW5jZXMgPSB0aGlzLnRvdGFsSW5zdGFuY2VzICsgMTtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJbnN0YW5jZXM7XG4gIH1cbn1cblxuZXhwb3J0IHsgTW9kZWwgfTtcbmV4cG9ydCBkZWZhdWx0IE1vZGVsO1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLIH0gZnJvbSAnLi9zaW0uanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcblxuY2xhc3MgUXVldWUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xuICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xuICB9XG5cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gIH1cblxuICBiYWNrKCkge1xuICAgIHJldHVybiAodGhpcy5kYXRhLmxlbmd0aCkgPyB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVzaCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG4gICAgdGhpcy5kYXRhLnB1c2godmFsdWUpO1xuICAgIHRoaXMudGltZXN0YW1wLnB1c2godGltZXN0YW1wKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgfVxuXG4gIHVuc2hpZnQodmFsdWUsIHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuICAgIHRoaXMuZGF0YS51bnNoaWZ0KHZhbHVlKTtcbiAgICB0aGlzLnRpbWVzdGFtcC51bnNoaWZ0KHRpbWVzdGFtcCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gIH1cblxuICBzaGlmdCh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnNoaWZ0KCk7XG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnNoaWZ0KCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcG9wKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEucG9wKCk7XG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnBvcCgpO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHBhc3NieSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgICB0aGlzLnN0YXRzLmxlYXZlKHRpbWVzdGFtcCwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdGF0cy5yZXNldCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gIH1cblxuICByZXBvcnQoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXRzLnNpemVTZXJpZXMuYXZlcmFnZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHMuZHVyYXRpb25TZXJpZXMuYXZlcmFnZSgpXTtcbiAgfVxuXG4gIGVtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoID09IDA7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xuICB9XG59XG5cbmNsYXNzIFBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMub3JkZXIgPSAwO1xuICB9XG5cbiAgZ3JlYXRlcihybzEsIHJvMikge1xuICAgIGlmIChybzEuZGVsaXZlckF0ID4gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPT0gcm8yLmRlbGl2ZXJBdClcbiAgICAgIHJldHVybiBybzEub3JkZXIgPiBybzIub3JkZXI7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaW5zZXJ0KHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG4gICAgcm8ub3JkZXIgPSB0aGlzLm9yZGVyICsrO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICB0aGlzLmRhdGEucHVzaChybyk7XG5cbiAgICAgICAgLy8gaW5zZXJ0IGludG8gZGF0YSBhdCB0aGUgZW5kXG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgLy8gaGVhcCB1cFxuICAgIHdoaWxlIChpbmRleCA+IDApIHtcbiAgICAgIGNvbnN0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoaW5kZXggLSAxKSAvIDIpO1xuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3BhcmVudEluZGV4XSwgcm8pKSB7XG4gICAgICAgIGFbaW5kZXhdID0gYVtwYXJlbnRJbmRleF07XG4gICAgICAgIGluZGV4ID0gcGFyZW50SW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYVtpbmRleF0gPSBub2RlO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XG4gICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xuICAgIGlmIChsZW4gPD0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGxlbiA9PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCB0b3AgPSBhWzBdO1xuICAgICAgICAvLyBtb3ZlIHRoZSBsYXN0IG5vZGUgdXBcbiAgICBhWzBdID0gYS5wb3AoKTtcbiAgICBsZW4tLTtcblxuICAgICAgICAvLyBoZWFwIGRvd25cbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcblxuICAgIHdoaWxlIChpbmRleCA8IE1hdGguZmxvb3IobGVuIC8gMikpIHtcbiAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMTtcbiAgICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDI7XG5cbiAgICAgIGNvbnN0IHNtYWxsZXJDaGlsZEluZGV4ID0gcmlnaHRDaGlsZEluZGV4IDwgbGVuXG4gICAgICAgICAgICAgICYmICF0aGlzLmdyZWF0ZXIoYVtyaWdodENoaWxkSW5kZXhdLCBhW2xlZnRDaGlsZEluZGV4XSlcbiAgICAgICAgICAgICAgICAgICAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcblxuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3NtYWxsZXJDaGlsZEluZGV4XSwgbm9kZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGFbaW5kZXhdID0gYVtzbWFsbGVyQ2hpbGRJbmRleF07XG4gICAgICBpbmRleCA9IHNtYWxsZXJDaGlsZEluZGV4O1xuICAgIH1cbiAgICBhW2luZGV4XSA9IG5vZGU7XG4gICAgcmV0dXJuIHRvcDtcbiAgfVxufVxuXG5leHBvcnQgeyBRdWV1ZSwgUFF1ZXVlIH07XG4iLCJcbmNsYXNzIFJhbmRvbSB7XG4gIGNvbnN0cnVjdG9yKHNlZWQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSB7XG4gICAgaWYgKHR5cGVvZiAoc2VlZCkgIT09ICdudW1iZXInICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgICAgICAgIHx8IE1hdGguY2VpbChzZWVkKSAhPSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2VlZCB2YWx1ZSBtdXN0IGJlIGFuIGludGVnZXInKTsgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cbiAgICAgICAgLyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cbiAgICB0aGlzLk4gPSA2MjQ7XG4gICAgdGhpcy5NID0gMzk3O1xuICAgIHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOy8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gICAgdGhpcy5VUFBFUl9NQVNLID0gMHg4MDAwMDAwMDsvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG4gICAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cblxuICAgIHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cbiAgICB0aGlzLm10aSA9IHRoaXMuTiArIDE7LyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG5cbiAgICAgICAgLy8gdGhpcy5pbml0X2dlbnJhbmQoc2VlZCk7XG4gICAgdGhpcy5pbml0X2J5X2FycmF5KFtzZWVkXSwgMSk7XG4gIH1cblxuICBpbml0X2dlbnJhbmQocykge1xuICAgIHRoaXMubXRbMF0gPSBzID4+PiAwO1xuICAgIGZvciAodGhpcy5tdGkgPSAxOyB0aGlzLm10aSA8IHRoaXMuTjsgdGhpcy5tdGkrKykge1xuICAgICAgdmFyIHMgPSB0aGlzLm10W3RoaXMubXRpIC0gMV0gXiAodGhpcy5tdFt0aGlzLm10aSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1MylcbiAgICAgICAgICAgICsgdGhpcy5tdGk7XG4gICAgICAgICAgICAvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cbiAgICAgICAgICAgIC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xuICAgICAgICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcbiAgICAgICAgICAgIC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXG4gICAgfVxuICB9XG5cbiAgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkge1xuICAgIGxldCBpLCBqLCBrO1xuICAgIHRoaXMuaW5pdF9nZW5yYW5kKDE5NjUwMjE4KTtcbiAgICBpID0gMTsgaiA9IDA7XG4gICAgayA9ICh0aGlzLk4gPiBrZXlfbGVuZ3RoID8gdGhpcy5OIDoga2V5X2xlbmd0aCk7XG4gICAgZm9yICg7IGs7IGstLSkge1xuICAgICAgdmFyIHMgPSB0aGlzLm10W2kgLSAxXSBeICh0aGlzLm10W2kgLSAxXSA+Pj4gMzApO1xuICAgICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKVxuICAgICAgICAgICAgKyBpbml0X2tleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuICAgICAgaSsrOyBqKys7XG4gICAgICBpZiAoaSA+PSB0aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OIC0gMV07IGkgPSAxOyB9XG4gICAgICBpZiAoaiA+PSBrZXlfbGVuZ3RoKSBqID0gMDtcbiAgICB9XG4gICAgZm9yIChrID0gdGhpcy5OIC0gMTsgazsgay0tKSB7XG4gICAgICB2YXIgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxuICAgICAgICAgICAgLSBpOyAvKiBub24gbGluZWFyICovXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cbiAgICAgIGkrKztcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cbiAgICB9XG5cbiAgICB0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbiAgfVxuXG4gIGdlbnJhbmRfaW50MzIoKSB7XG4gICAgbGV0IHk7XG4gICAgY29uc3QgbWFnMDEgPSBuZXcgQXJyYXkoMHgwLCB0aGlzLk1BVFJJWF9BKTtcbiAgICAgICAgLyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG4gICAgaWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXG4gICAgICBsZXQga2s7XG5cbiAgICAgIGlmICh0aGlzLm10aSA9PSB0aGlzLk4gKyAxKSAgIC8qIGlmIGluaXRfZ2VucmFuZCgpIGhhcyBub3QgYmVlbiBjYWxsZWQsICovXG4gICAgICAgIHRoaXMuaW5pdF9nZW5yYW5kKDU0ODkpOyAvKiBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWQgKi9cblxuICAgICAgZm9yIChrayA9IDA7IGtrIDwgdGhpcy5OIC0gdGhpcy5NOyBraysrKSB7XG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArIHRoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgIH1cbiAgICAgIGZvciAoO2trIDwgdGhpcy5OIC0gMTsga2srKykge1xuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2sgKyAodGhpcy5NIC0gdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgIH1cbiAgICAgIHkgPSAodGhpcy5tdFt0aGlzLk4gLSAxXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFswXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICB0aGlzLm10W3RoaXMuTiAtIDFdID0gdGhpcy5tdFt0aGlzLk0gLSAxXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXG4gICAgICB0aGlzLm10aSA9IDA7XG4gICAgfVxuXG4gICAgeSA9IHRoaXMubXRbdGhpcy5tdGkrK107XG5cbiAgICAgICAgLyogVGVtcGVyaW5nICovXG4gICAgeSBePSAoeSA+Pj4gMTEpO1xuICAgIHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xuICAgIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcbiAgICB5IF49ICh5ID4+PiAxOCk7XG5cbiAgICByZXR1cm4geSA+Pj4gMDtcbiAgfVxuXG4gIGdlbnJhbmRfaW50MzEoKSB7XG4gICAgcmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKSA+Pj4gMSk7XG4gIH1cblxuICBnZW5yYW5kX3JlYWwxKCkge1xuICAgIHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSAqICgxLjAgLyA0Mjk0OTY3Mjk1LjApO1xuICAgICAgICAvKiBkaXZpZGVkIGJ5IDJeMzItMSAqL1xuICB9XG5cbiAgcmFuZG9tKCkge1xuICAgIGlmICh0aGlzLnB5dGhvbkNvbXBhdGliaWxpdHkpIHtcbiAgICAgIGlmICh0aGlzLnNraXApIHtcbiAgICAgICAgdGhpcy5nZW5yYW5kX2ludDMyKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNraXAgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcbiAgICAgICAgLyogZGl2aWRlZCBieSAyXjMyICovXG4gIH1cblxuICBnZW5yYW5kX3JlYWwzKCkge1xuICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgKyAwLjUpICogKDEuMCAvIDQyOTQ5NjcyOTYuMCk7XG4gICAgICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICB9XG5cbiAgZ2VucmFuZF9yZXM1MygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5nZW5yYW5kX2ludDMyKCkgPj4+IDUsIGIgPSB0aGlzLmdlbnJhbmRfaW50MzIoKSA+Pj4gNjtcbiAgICByZXR1cm4gKGEgKiA2NzEwODg2NC4wICsgYikgKiAoMS4wIC8gOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbiAgfVxuXG4gIGV4cG9uZW50aWFsKGxhbWJkYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2V4cG9uZW50aWFsKCkgbXVzdCAgYmUgY2FsbGVkIHdpdGggXFwnbGFtYmRhXFwnIHBhcmFtZXRlcicpOyAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICBjb25zdCByID0gdGhpcy5yYW5kb20oKTtcbiAgICByZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xuICB9XG5cbiAgZ2FtbWEoYWxwaGEsIGJldGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdnYW1tYSgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICAgICAgLyogQmFzZWQgb24gUHl0aG9uIDIuNiBzb3VyY2UgY29kZSBvZiByYW5kb20ucHkuXG4gICAgICAgICAqL1xuXG4gICAgaWYgKGFscGhhID4gMS4wKSB7XG4gICAgICBjb25zdCBhaW52ID0gTWF0aC5zcXJ0KDIuMCAqIGFscGhhIC0gMS4wKTtcbiAgICAgIGNvbnN0IGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuICAgICAgY29uc3QgY2NjID0gYWxwaGEgKyBhaW52O1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgdTEgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICBpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICBjb25zdCB2ID0gTWF0aC5sb2codTEgLyAoMS4wIC0gdTEpKSAvIGFpbnY7XG4gICAgICAgIHZhciB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcbiAgICAgICAgY29uc3QgeiA9IHUxICogdTEgKiB1MjtcbiAgICAgICAgY29uc3QgciA9IGJiYiArIGNjYyAqIHYgLSB4O1xuICAgICAgICBpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XG4gICAgICAgICAgcmV0dXJuIHggKiBiZXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhbHBoYSA9PSAxLjApIHtcbiAgICAgIHZhciB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgIHdoaWxlICh1IDw9IDFlLTcpIHtcbiAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gLU1hdGgubG9nKHUpICogYmV0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgICBjb25zdCBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcbiAgICAgICAgY29uc3QgcCA9IGIgKiB1O1xuICAgICAgICBpZiAocCA8PSAxLjApIHtcbiAgICAgICAgICB2YXIgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgeCA9IC1NYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICAgIGlmIChwID4gMS4wKSB7XG4gICAgICAgICAgaWYgKHUxIDw9IE1hdGgucG93KHgsIChhbHBoYSAtIDEuMCkpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodTEgPD0gTWF0aC5leHAoLXgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICB9XG5cbiAgfVxuXG4gIG5vcm1hbChtdSwgc2lnbWEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignbm9ybWFsKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBtdSBhbmQgc2lnbWEgcGFyYW1ldGVycycpOyAgICAgIC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICBsZXQgeiA9IHRoaXMubGFzdE5vcm1hbDtcbiAgICB0aGlzLmxhc3ROb3JtYWwgPSBOYU47XG4gICAgaWYgKCF6KSB7XG4gICAgICBjb25zdCBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgY29uc3QgYiA9IE1hdGguc3FydCgtMi4wICogTWF0aC5sb2coMS4wIC0gdGhpcy5yYW5kb20oKSkpO1xuICAgICAgeiA9IE1hdGguY29zKGEpICogYjtcbiAgICAgIHRoaXMubGFzdE5vcm1hbCA9IE1hdGguc2luKGEpICogYjtcbiAgICB9XG4gICAgcmV0dXJuIG11ICsgeiAqIHNpZ21hO1xuICB9XG5cbiAgcGFyZXRvKGFscGhhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigncGFyZXRvKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBwYXJhbWV0ZXInKTsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG4gICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgcmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcbiAgfVxuXG4gIHRyaWFuZ3VsYXIobG93ZXIsIHVwcGVyLCBtb2RlKSB7XG4gICAgICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJpYW5ndWxhcl9kaXN0cmlidXRpb25cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCd0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVycycpOyAgICAvLyBBUkdfQ0hFQ0tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cbiAgICBjb25zdCBjID0gKG1vZGUgLSBsb3dlcikgLyAodXBwZXIgLSBsb3dlcik7XG4gICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICBpZiAodSA8PSBjKSB7XG4gICAgICByZXR1cm4gbG93ZXIgKyBNYXRoLnNxcnQodSAqICh1cHBlciAtIGxvd2VyKSAqIChtb2RlIC0gbG93ZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVwcGVyIC0gTWF0aC5zcXJ0KCgxIC0gdSkgKiAodXBwZXIgLSBsb3dlcikgKiAodXBwZXIgLSBtb2RlKSk7XG4gICAgfVxuICB9XG5cbiAgICAvKipcbiAgICAqIEFsbCBmbG9hdHMgYmV0d2VlbiBsb3dlciBhbmQgdXBwZXIgYXJlIGVxdWFsbHkgbGlrZWx5LiBUaGlzIGlzIHRoZVxuICAgICogdGhlb3JldGljYWwgZGlzdHJpYnV0aW9uIG1vZGVsIGZvciBhIGJhbGFuY2VkIGNvaW4sIGFuIHVuYmlhc2VkIGRpZSwgYVxuICAgICogY2FzaW5vIHJvdWxldHRlLCBvciB0aGUgZmlyc3QgY2FyZCBvZiBhIHdlbGwtc2h1ZmZsZWQgZGVjay5cbiAgICAqL1xuICB1bmlmb3JtKGxvd2VyLCB1cHBlcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3VuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzJyk7ICAgIC8vIEFSR19DSEVDS1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcbiAgICByZXR1cm4gbG93ZXIgKyB0aGlzLnJhbmRvbSgpICogKHVwcGVyIC0gbG93ZXIpO1xuICB9XG5cbiAgd2VpYnVsbChhbHBoYSwgYmV0YSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3dlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgICAgLy8gQVJHX0NIRUNLXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuICAgIGNvbnN0IHUgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuICAgIHJldHVybiBhbHBoYSAqIE1hdGgucG93KC1NYXRoLmxvZyh1KSwgMS4wIC8gYmV0YSk7XG4gIH1cbn1cblxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cblxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuUmFuZG9tLnByb3RvdHlwZS5MT0c0ID0gTWF0aC5sb2coNC4wKTtcblJhbmRvbS5wcm90b3R5cGUuU0dfTUFHSUNDT05TVCA9IDEuMCArIE1hdGgubG9nKDQuNSk7XG5cbmV4cG9ydCB7IFJhbmRvbSB9O1xuZXhwb3J0IGRlZmF1bHQgUmFuZG9tO1xuIiwiaW1wb3J0IHsgQVJHX0NIRUNLLCBTdG9yZSwgQnVmZmVyLCBFdmVudCB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eSwgY3VycmVudFRpbWUsIGRlbGl2ZXJBdCkge1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgIHRoaXMuc2NoZWR1bGVkQXQgPSBjdXJyZW50VGltZTtcbiAgICB0aGlzLmRlbGl2ZXJBdCA9IGRlbGl2ZXJBdDtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5ncm91cCA9IG51bGw7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgICAgIC8vIEFzayB0aGUgbWFpbiByZXF1ZXN0IHRvIGhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwWzBdICE9IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgIH1cblxuICAgICAgICAvLyAtLT4gdGhpcyBpcyBtYWluIHJlcXVlc3RcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgLy8gaWYgYWxyZWFkeSBjYW5jZWxsZWQsIGRvIG5vdGhpbmdcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICB0aGlzLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgIGlmICgodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBCdWZmZXIpXG4gICAgICAgICAgICAgICAgICAgIHx8ICh0aGlzLnNvdXJjZSBpbnN0YW5jZW9mIFN0b3JlKSkge1xuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc1B1dFF1ZXVlLmNhbGwodGhpcy5zb3VyY2UpO1xuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc0dldFF1ZXVlLmNhbGwodGhpcy5zb3VyY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5ncm91cCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PSAwKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRvbmUoY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMCwgMywgRnVuY3Rpb24sIE9iamVjdCk7XG5cbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHdhaXRVbnRpbChkZWxheSwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCwgdW5kZWZpbmVkLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBjb25zdCBybyA9IHRoaXMuX2FkZFJlcXVlc3QodGhpcy5zY2hlZHVsZWRBdCArIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuICAgIHRoaXMuZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5sZXNzRXZlbnQoZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDQsIHVuZGVmaW5lZCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcbiAgICAgIHZhciBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIHJvLm1zZyA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuXG4gICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgICAgcm8ubXNnID0gZXZlbnRbaV07XG4gICAgICAgIGV2ZW50W2ldLmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgaWYgKCF0aGlzLmNhbGxiYWNrcykgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuZ3JvdXBbMF0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cFswXS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gIH1cblxuICBjYW5jZWxSZW5lZ2VDbGF1c2VzKCkge1xuICAgICAgICAvLyB0aGlzLmNhbmNlbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy53YWl0VW50aWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vIHRoaXMudW5sZXNzRXZlbnQgPSB0aGlzLk51bGw7XG4gICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXAgfHwgdGhpcy5ncm91cFswXSAhPSB0aGlzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT0gMCkge1xuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBOdWxsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LFxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXQsXG4gICAgICAgICAgICAgICAgZGVsaXZlckF0KTtcblxuICAgIHJvLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcblxuICAgIGlmICh0aGlzLmdyb3VwID09PSBudWxsKSB7XG4gICAgICB0aGlzLmdyb3VwID0gW3RoaXNdO1xuICAgIH1cblxuICAgIHRoaXMuZ3JvdXAucHVzaChybyk7XG4gICAgcm8uZ3JvdXAgPSB0aGlzLmdyb3VwO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIF9kb0NhbGxiYWNrKHNvdXJjZSwgbXNnLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcbiAgICAgIGlmICghY2FsbGJhY2spIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMuY2FsbGJhY2tzW2ldWzFdO1xuICAgICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gdGhpcy5lbnRpdHk7XG5cbiAgICAgIGNvbnN0IGFyZ3VtZW50ID0gdGhpcy5jYWxsYmFja3NbaV1bMl07XG5cbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBzb3VyY2U7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG1zZztcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gZGF0YTtcblxuICAgICAgaWYgKCFhcmd1bWVudCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gbnVsbDtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbnVsbDtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgUmVxdWVzdCB9O1xuIiwiaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vcXVldWVzLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcblxuXG5jbGFzcyBFbnRpdHkgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKHNpbSwgbmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuc2ltID0gc2ltO1xuICB9XG5cbiAgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW0udGltZSgpO1xuICB9XG5cbiAgc2V0VGltZXIoZHVyYXRpb24pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSxcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpICsgZHVyYXRpb24pO1xuXG4gICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICB3YWl0RXZlbnQoZXZlbnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxLCBFdmVudCk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcXVldWVFdmVudChldmVudCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGV2ZW50O1xuICAgIGV2ZW50LmFkZFF1ZXVlKHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICB1c2VGYWNpbGl0eShmYWNpbGl0eSwgZHVyYXRpb24pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBGYWNpbGl0eSk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgcm8uc291cmNlID0gZmFjaWxpdHk7XG4gICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcbiAgICByby5zb3VyY2UgPSBidWZmZXI7XG4gICAgYnVmZmVyLnB1dChhbW91bnQsIHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBnZXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICBidWZmZXIuZ2V0KGFtb3VudCwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHB1dFN0b3JlKHN0b3JlLCBvYmopIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBTdG9yZSk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUucHV0KG9iaiwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyLCBTdG9yZSwgRnVuY3Rpb24pO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xuICAgIHN0b3JlLmdldChmaWx0ZXIsIHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBzZW5kKG1lc3NhZ2UsIGRlbGF5LCBlbnRpdGllcykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLnNpbSwgdGhpcy50aW1lKCksIHRoaXMudGltZSgpICsgZGVsYXkpO1xuICAgIHJvLnNvdXJjZSA9IHRoaXM7XG4gICAgcm8ubXNnID0gbWVzc2FnZTtcbiAgICByby5kYXRhID0gZW50aXRpZXM7XG4gICAgcm8uZGVsaXZlciA9IHRoaXMuc2ltLnNlbmRNZXNzYWdlO1xuXG4gICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnNpbS5sb2cobWVzc2FnZSwgdGhpcyk7XG4gIH1cbn1cblxuY2xhc3MgU2ltIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zaW1UaW1lID0gMDtcbiAgICB0aGlzLmVudGl0aWVzID0gW107XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBQUXVldWUoKTtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgIHRoaXMuZW50aXR5SWQgPSAxO1xuICB9XG5cbiAgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW1UaW1lO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgY29uc3Qgc2VuZGVyID0gdGhpcy5zb3VyY2U7XG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubXNnO1xuICAgIGNvbnN0IGVudGl0aWVzID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHNpbSA9IHNlbmRlci5zaW07XG5cbiAgICBpZiAoIWVudGl0aWVzKSB7XG4gICAgICAgICAgICAvLyBzZW5kIHRvIGFsbCBlbnRpdGllc1xuICAgICAgZm9yICh2YXIgaSA9IHNpbS5lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgZW50aXR5ID0gc2ltLmVudGl0aWVzW2ldO1xuICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZS5jYWxsKGVudGl0eSwgc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVudGl0aWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAodmFyIGkgPSBlbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlLmNhbGwoZW50aXR5LCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZW50aXRpZXMub25NZXNzYWdlKSB7XG4gICAgICAgIGVudGl0aWVzLm9uTWVzc2FnZS5jYWxsKGVudGl0aWVzLCBzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVudGl0eShrbGFzcywgbmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBWZXJpZnkgdGhhdCBwcm90b3R5cGUgaGFzIHN0YXJ0IGZ1bmN0aW9uXG4gICAgaWYgKCFrbGFzcy5wcm90b3R5cGUuc3RhcnQpIHsgIC8vIEFSRyBDSEVDS1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbnRpdHkgY2xhc3MgJHtrbGFzcy5uYW1lfSBtdXN0IGhhdmUgc3RhcnQoKSBmdW5jdGlvbiBkZWZpbmVkYCk7XG4gICAgfVxuXG4gICAgdmFyIGVudGl0eSA9IG5ldyBrbGFzcyh0aGlzLCBuYW1lKTtcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcblxuICAgIGVudGl0eS5zdGFydCguLi5hcmdzKTtcblxuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICBzaW11bGF0ZShlbmRUaW1lLCBtYXhFdmVudHMpIHtcbiAgICAgICAgLy8gQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMik7XG4gICAgaWYgKCFtYXhFdmVudHMpIHsgbWF4RXZlbnRzID0gTWF0aC5JbmZpbml0eTsgfVxuICAgIGxldCBldmVudHMgPSAwO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGV2ZW50cysrO1xuICAgICAgaWYgKGV2ZW50cyA+IG1heEV2ZW50cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGVhcmxpZXN0IGV2ZW50XG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGV2ZW50cywgd2UgYXJlIGRvbmUgd2l0aCBzaW11bGF0aW9uIGhlcmUuXG4gICAgICBpZiAocm8gPT0gdW5kZWZpbmVkKSBicmVhaztcblxuXG4gICAgICAgICAgICAvLyBVaCBvaC4uIHdlIGFyZSBvdXQgb2YgdGltZSBub3dcbiAgICAgIGlmIChyby5kZWxpdmVyQXQgPiBlbmRUaW1lKSBicmVhaztcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBzaW11bGF0aW9uIHRpbWVcbiAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcblxuICAgICAgcm8uZGVsaXZlcigpO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0ZXAoKSB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcbiAgICAgIGlmICghcm8pIHJldHVybiBmYWxzZTtcbiAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuICAgICAgcm8uZGVsaXZlcigpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0TG9nZ2VyKGxvZ2dlcikge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEsIEZ1bmN0aW9uKTtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlLCBlbnRpdHkpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgIGlmICghdGhpcy5sb2dnZXIpIHJldHVybjtcbiAgICBsZXQgZW50aXR5TXNnID0gJyc7XG4gICAgaWYgKGVudGl0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoZW50aXR5Lm5hbWUpIHtcbiAgICAgICAgZW50aXR5TXNnID0gYCBbJHtlbnRpdHkubmFtZX1dYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIoYCR7dGhpcy5zaW1UaW1lLnRvRml4ZWQoNil9JHtlbnRpdHlNc2d9ICAgJHttZXNzYWdlfWApO1xuICB9XG59XG5cbmNsYXNzIEZhY2lsaXR5IGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBkaXNjaXBsaW5lLCBzZXJ2ZXJzLCBtYXhxbGVuKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgNCk7XG5cbiAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5zZXJ2ZXJzID0gc2VydmVycyA/IHNlcnZlcnMgOiAxO1xuICAgIHRoaXMubWF4cWxlbiA9IChtYXhxbGVuID09PSB1bmRlZmluZWQpID8gLTEgOiAxICogbWF4cWxlbjtcblxuICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgY2FzZSBGYWNpbGl0eS5MQ0ZTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUxDRlM7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LlBTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmc7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VGQ0ZTO1xuICAgICAgdGhpcy5mcmVlU2VydmVycyA9IG5ldyBBcnJheSh0aGlzLnNlcnZlcnMpO1xuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xuICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucXVldWUucmVzZXQoKTtcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xuICB9XG5cbiAgc3lzdGVtU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHM7XG4gIH1cblxuICBxdWV1ZVN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgdXNhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVzeUR1cmF0aW9uO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgdGhpcy5xdWV1ZS5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG5cbiAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyKTtcbiAgICBpZiAoKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgdGhpcy5zdGF0cy5lbnRlcihub3cpO1xuICAgIHRoaXMucXVldWUucHVzaChybywgbm93KTtcbiAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShub3cpO1xuICB9XG5cbiAgdXNlRkNGU1NjaGVkdWxlKHRpbWVzdGFtcCkge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7IC8vIFRPRE9cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZnJlZVNlcnZlcnNbaV0pIHtcbiAgICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gZmFsc2U7XG4gICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmZyZWUgLS07XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSByby5kdXJhdGlvbjtcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGFsbCBvdGhlciByZW5lZ2luZyByZXF1ZXN0c1xuICAgICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xuXG4gICAgICBjb25zdCBuZXdybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRpbWVzdGFtcCwgdGltZXN0YW1wICsgcm8uZHVyYXRpb24pO1xuICAgICAgbmV3cm8uZG9uZSh0aGlzLnVzZUZDRlNDYWxsYmFjaywgdGhpcywgcm8pO1xuXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdybyk7XG4gICAgfVxuICB9XG5cbiAgdXNlRkNGU0NhbGxiYWNrKHJvKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgb25lIG1vcmUgZnJlZSBzZXJ2ZXJcbiAgICB0aGlzLmZyZWUgKys7XG4gICAgdGhpcy5mcmVlU2VydmVyc1tyby5tc2ddID0gdHJ1ZTtcblxuICAgIHRoaXMuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIHNvbWVvbmUgd2FpdGluZywgc2NoZWR1bGUgaXQgbm93XG4gICAgdGhpcy51c2VGQ0ZTU2NoZWR1bGUocm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgICAgLy8gcmVzdG9yZSB0aGUgZGVsaXZlciBmdW5jdGlvbiwgYW5kIGRlbGl2ZXJcbiAgICByby5kZWxpdmVyKCk7XG5cbiAgfVxuXG4gIHVzZUxDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgcnVubmluZyByZXF1ZXN0Li5cbiAgICBpZiAodGhpcy5jdXJyZW50Uk8pIHtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9ICh0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpIC0gdGhpcy5jdXJyZW50Uk8ubGFzdElzc3VlZCk7XG4gICAgICAgICAgICAvLyBjYWxjdWF0ZSB0aGUgcmVtYWluaW5nIHRpbWVcbiAgICAgIHRoaXMuY3VycmVudFJPLnJlbWFpbmluZyA9XG4gICAgICAgICAgICAgICAgKHRoaXMuY3VycmVudFJPLmRlbGl2ZXJBdCAtIHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgICAgLy8gcHJlZW1wdCBpdC4uXG4gICAgICB0aGlzLnF1ZXVlLnB1c2godGhpcy5jdXJyZW50Uk8sIHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFJPID0gcm87XG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUuLlxuICAgIGlmICghcm8uc2F2ZWRfZGVsaXZlcikge1xuICAgICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xuICAgICAgcm8ucmVtYWluaW5nID0gZHVyYXRpb247XG4gICAgICByby5zYXZlZF9kZWxpdmVyID0gcm8uZGVsaXZlcjtcbiAgICAgIHJvLmRlbGl2ZXIgPSB0aGlzLnVzZUxDRlNDYWxsYmFjaztcblxuICAgICAgdGhpcy5zdGF0cy5lbnRlcihyby5lbnRpdHkudGltZSgpKTtcbiAgICB9XG5cbiAgICByby5sYXN0SXNzdWVkID0gcm8uZW50aXR5LnRpbWUoKTtcblxuICAgICAgICAvLyBzY2hlZHVsZSB0aGlzIG5ldyBldmVudFxuICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCkgKyBkdXJhdGlvbjtcbiAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gIH1cblxuICB1c2VMQ0ZTQ2FsbGJhY2soKSB7XG4gICAgY29uc3Qgcm8gPSB0aGlzO1xuICAgIGNvbnN0IGZhY2lsaXR5ID0gcm8uc291cmNlO1xuXG4gICAgaWYgKHJvICE9IGZhY2lsaXR5LmN1cnJlbnRSTykgcmV0dXJuO1xuICAgIGZhY2lsaXR5LmN1cnJlbnRSTyA9IG51bGw7XG5cbiAgICAgICAgLy8gc3RhdHNcbiAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHJvLmVudGl0eS50aW1lKCkgLSByby5sYXN0SXNzdWVkKTtcbiAgICBmYWNpbGl0eS5zdGF0cy5sZWF2ZShyby5zY2hlZHVsZWRBdCwgcm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgICAgLy8gZGVsaXZlciB0aGlzIHJlcXVlc3RcbiAgICByby5kZWxpdmVyID0gcm8uc2F2ZWRfZGVsaXZlcjtcbiAgICBkZWxldGUgcm8uc2F2ZWRfZGVsaXZlcjtcbiAgICByby5kZWxpdmVyKCk7XG5cbiAgICAgICAgLy8gc2VlIGlmIHRoZXJlIGFyZSBwZW5kaW5nIHJlcXVlc3RzXG4gICAgaWYgKCFmYWNpbGl0eS5xdWV1ZS5lbXB0eSgpKSB7XG4gICAgICBjb25zdCBvYmogPSBmYWNpbGl0eS5xdWV1ZS5wb3Aocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICBmYWNpbGl0eS51c2VMQ0ZTKG9iai5yZW1haW5pbmcsIG9iaik7XG4gICAgfVxuICB9XG5cbiAgdXNlUHJvY2Vzc29yU2hhcmluZyhkdXJhdGlvbiwgcm8pIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAyLCAyLCBudWxsLCBSZXF1ZXN0KTtcbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcbiAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgaXNBZGRlZCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSByby5lbnRpdHkudGltZSgpO1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gaXNBZGRlZCA/ICgoc2l6ZSArIDEuMCkgLyBzaXplKSA6ICgoc2l6ZSAtIDEuMCkgLyBzaXplKTtcbiAgICBjb25zdCBuZXdRdWV1ZSA9IFtdO1xuXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBldiA9IHRoaXMucXVldWVbaV07XG4gICAgICBpZiAoZXYucm8gPT09IHJvKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIG5ld2V2ID0gbmV3IFJlcXVlc3QodGhpcywgY3VycmVudCwgY3VycmVudCArIChldi5kZWxpdmVyQXQgLSBjdXJyZW50KSAqIG11bHRpcGxpZXIpO1xuICAgICAgbmV3ZXYucm8gPSBldi5ybztcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgZXYuY2FuY2VsKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XG4gICAgfVxuXG4gICAgICAgIC8vIGFkZCB0aGlzIG5ldyByZXF1ZXN0XG4gICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgIHZhciBuZXdldiA9IG5ldyBSZXF1ZXN0KHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyByby5kdXJhdGlvbiAqIChzaXplICsgMSkpO1xuICAgICAgbmV3ZXYucm8gPSBybztcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUgPSBuZXdRdWV1ZTtcblxuICAgICAgICAvLyB1c2FnZSBzdGF0aXN0aWNzXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IChjdXJyZW50IC0gdGhpcy5sYXN0SXNzdWVkKTtcbiAgICB9XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2soKSB7XG4gICAgY29uc3QgZXYgPSB0aGlzO1xuICAgIGNvbnN0IGZhYyA9IGV2LnNvdXJjZTtcblxuICAgIGlmIChldi5jYW5jZWxsZWQpIHJldHVybjtcbiAgICBmYWMuc3RhdHMubGVhdmUoZXYucm8uc2NoZWR1bGVkQXQsIGV2LnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgZmFjLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShldi5ybywgZmFsc2UpO1xuICAgIGV2LnJvLmRlbGl2ZXIoKTtcbiAgfVxufVxuXG5GYWNpbGl0eS5GQ0ZTID0gMTtcbkZhY2lsaXR5LkxDRlMgPSAyO1xuRmFjaWxpdHkuUFMgPSAzO1xuRmFjaWxpdHkuTnVtRGlzY2lwbGluZXMgPSA0O1xuXG5jbGFzcyBCdWZmZXIgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNhcGFjaXR5LCBpbml0aWFsKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgdGhpcy5hdmFpbGFibGUgPSAoaW5pdGlhbCA9PT0gdW5kZWZpbmVkKSA/IDAgOiBpbml0aWFsO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZTtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gIH1cblxuICBnZXQoYW1vdW50LCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIGFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgLT0gYW1vdW50O1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLmdldFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHB1dChhbW91bnQsIHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgKGFtb3VudCArIHRoaXMuYXZhaWxhYmxlKSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSArPSBhbW91bnQ7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwcm9ncmVzc0dldFF1ZXVlKCkge1xuICAgIGxldCBvYmo7XG4gICAgd2hpbGUgKG9iaiA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcbiAgICAgICAgb2JqLmRlbGl2ZXJBdCA9IG9iai5lbnRpdHkudGltZSgpO1xuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuICAgIHdoaWxlIChvYmogPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgaWYgKG9iai5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgIGlmIChvYmouYW1vdW50ICsgdGhpcy5hdmFpbGFibGUgPD0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSArPSBvYmouYW1vdW50O1xuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgfVxuXG4gIGdldFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFF1ZXVlLnN0YXRzO1xuICB9XG59XG5cbmNsYXNzIFN0b3JlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihjYXBhY2l0eSwgbmFtZSA9IG51bGwpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICB0aGlzLnB1dFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgdGhpcy5nZXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vYmplY3RzLmxlbmd0aDtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gIH1cblxuICBnZXQoZmlsdGVyLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgbGV0IG9iajtcbiAgICAgICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgY29kZSBvdXRcbiAgICAgICAgICAgIC8vIGl0IGlzIHJlcGVhdGVkIGluIHByb2dyZXNzR2V0UXVldWVcbiAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XG5cbiAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm8uZmlsdGVyID0gZmlsdGVyO1xuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwdXQob2JqLCBybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuICAgICAgdGhpcy5vYmplY3RzLnB1c2gob2JqKTtcblxuICAgICAgdGhpcy5wcm9ncmVzc0dldFF1ZXVlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5vYmogPSBvYmo7XG4gICAgdGhpcy5wdXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgbGV0IHJvO1xuICAgIHdoaWxlIChybyA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHtcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgICAgY29uc3QgZmlsdGVyID0gcm8uZmlsdGVyO1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG9iajtcblxuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgcm87XG4gICAgd2hpbGUgKHJvID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkge1xuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuICAgICAgICB0aGlzLm9iamVjdHMucHVzaChyby5vYmopO1xuICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgRXZlbnQgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gIH1cblxuICBhZGRXYWl0TGlzdChybykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy53YWl0TGlzdC5wdXNoKHJvKTtcbiAgfVxuXG4gIGFkZFF1ZXVlKHJvKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBpZiAodGhpcy5pc0ZpcmVkKSB7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlLnB1c2gocm8pO1xuICB9XG5cbiAgZmlyZShrZWVwRmlyZWQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAwLCAxKTtcblxuICAgIGlmIChrZWVwRmlyZWQpIHtcbiAgICAgIHRoaXMuaXNGaXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgICAgIC8vIERpc3BhdGNoIGFsbCB3YWl0aW5nIGVudGl0aWVzXG4gICAgY29uc3QgdG1wTGlzdCA9IHRoaXMud2FpdExpc3Q7XG4gICAgdGhpcy53YWl0TGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XG4gICAgfVxuXG4gICAgICAgIC8vIERpc3BhdGNoIG9uZSBxdWV1ZWQgZW50aXR5XG4gICAgY29uc3QgbHVja3kgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGx1Y2t5KSB7XG4gICAgICBsdWNreS5kZWxpdmVyKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBBUkdfQ0hFQ0soZm91bmQsIGV4cE1pbiwgZXhwTWF4KSB7XG4gIGlmIChmb3VuZC5sZW5ndGggPCBleHBNaW4gfHwgZm91bmQubGVuZ3RoID4gZXhwTWF4KSB7ICAgLy8gQVJHX0NIRUNLXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cycpOyAgIC8vIEFSR19DSEVDS1xuICB9ICAgLy8gQVJHX0NIRUNLXG5cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZvdW5kLmxlbmd0aDsgaSsrKSB7ICAgLy8gQVJHX0NIRUNLXG4gICAgaWYgKCFhcmd1bWVudHNbaSArIDNdIHx8ICFmb3VuZFtpXSkgY29udGludWU7ICAgLy8gQVJHX0NIRUNLXG5cbi8vICAgIHByaW50KFwiVEVTVCBcIiArIGZvdW5kW2ldICsgXCIgXCIgKyBhcmd1bWVudHNbaSArIDNdICAgLy8gQVJHX0NIRUNLXG4vLyAgICArIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgRXZlbnQpICAgLy8gQVJHX0NIRUNLXG4vLyAgICArIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkgICAvLyBBUkdfQ0hFQ0tcbi8vICAgICsgXCJcXG5cIik7ICAgLy8gQVJHIENIRUNLXG5cblxuICAgIGlmICghKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkpIHsgICAvLyBBUkdfQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICR7aSArIDF9IGlzIG9mIGluY29ycmVjdCB0eXBlLmApOyAgIC8vIEFSR19DSEVDS1xuICAgIH0gICAvLyBBUkdfQ0hFQ0tcbiAgfSAgIC8vIEFSR19DSEVDS1xufSAgIC8vIEFSR19DSEVDS1xuXG5leHBvcnQgeyBTaW0sIEZhY2lsaXR5LCBCdWZmZXIsIFN0b3JlLCBFdmVudCwgRW50aXR5LCBBUkdfQ0hFQ0sgfTtcbiIsImltcG9ydCB7IEFSR19DSEVDSyB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgRGF0YVNlcmllcyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuQ291bnQgPSAwO1xuICAgIHRoaXMuVyA9IDAuMDtcbiAgICB0aGlzLkEgPSAwLjA7XG4gICAgdGhpcy5RID0gMC4wO1xuICAgIHRoaXMuTWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuTWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5TdW0gPSAwO1xuXG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDMsIDMpO1xuXG4gICAgdGhpcy5oTG93ZXIgPSBsb3dlcjtcbiAgICB0aGlzLmhVcHBlciA9IHVwcGVyO1xuICAgIHRoaXMuaEJ1Y2tldFNpemUgPSAodXBwZXIgLSBsb3dlcikgLyBuYnVja2V0cztcbiAgICB0aGlzLmhpc3RvZ3JhbSA9IG5ldyBBcnJheShuYnVja2V0cyArIDIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9ncmFtO1xuICB9XG5cbiAgcmVjb3JkKHZhbHVlLCB3ZWlnaHQpIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgIGNvbnN0IHcgPSAod2VpZ2h0ID09PSB1bmRlZmluZWQpID8gMSA6IHdlaWdodDtcbiAgICAgICAgLy8gZG9jdW1lbnQud3JpdGUoXCJEYXRhIHNlcmllcyByZWNvcmRpbmcgXCIgKyB2YWx1ZSArIFwiICh3ZWlnaHQgPSBcIiArIHcgKyBcIilcXG5cIik7XG5cbiAgICBpZiAodmFsdWUgPiB0aGlzLk1heCkgdGhpcy5NYXggPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUgPCB0aGlzLk1pbikgdGhpcy5NaW4gPSB2YWx1ZTtcbiAgICB0aGlzLlN1bSArPSB2YWx1ZTtcbiAgICB0aGlzLkNvdW50ICsrO1xuICAgIGlmICh0aGlzLmhpc3RvZ3JhbSkge1xuICAgICAgaWYgKHZhbHVlIDwgdGhpcy5oTG93ZXIpIHtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1bMF0gKz0gdztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHZhbHVlID4gdGhpcy5oVXBwZXIpIHtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1bdGhpcy5oaXN0b2dyYW0ubGVuZ3RoIC0gMV0gKz0gdztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigodmFsdWUgLSB0aGlzLmhMb3dlcikgLyB0aGlzLmhCdWNrZXRTaXplKSArIDE7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW2luZGV4XSArPSB3O1xuICAgICAgfVxuICAgIH1cblxuICAgICAgICAvLyBXaSA9IFdpLTEgKyB3aVxuICAgIHRoaXMuVyA9IHRoaXMuVyArIHc7XG5cbiAgICBpZiAodGhpcy5XID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgICAgIC8vIEFpID0gQWktMSArIHdpL1dpICogKHhpIC0gQWktMSlcbiAgICBjb25zdCBsYXN0QSA9IHRoaXMuQTtcbiAgICB0aGlzLkEgPSBsYXN0QSArICh3IC8gdGhpcy5XKSAqICh2YWx1ZSAtIGxhc3RBKTtcblxuICAgICAgICAvLyBRaSA9IFFpLTEgKyB3aSh4aSAtIEFpLTEpKHhpIC0gQWkpXG4gICAgdGhpcy5RID0gdGhpcy5RICsgdyAqICh2YWx1ZSAtIGxhc3RBKSAqICh2YWx1ZSAtIHRoaXMuQSk7XG4gICAgICAgIC8vIHByaW50KFwiXFx0Vz1cIiArIHRoaXMuVyArIFwiIEE9XCIgKyB0aGlzLkEgKyBcIiBRPVwiICsgdGhpcy5RICsgXCJcXG5cIik7XG4gIH1cblxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5Db3VudDtcbiAgfVxuXG4gIG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5NaW47XG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuTWF4O1xuICB9XG5cbiAgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuTWF4IC0gdGhpcy5NaW47XG4gIH1cblxuICBzdW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuU3VtO1xuICB9XG5cbiAgc3VtV2VpZ2h0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuQSAqIHRoaXMuVztcbiAgfVxuXG4gIGF2ZXJhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuQTtcbiAgfVxuXG4gIHZhcmlhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLlEgLyB0aGlzLlc7XG4gIH1cblxuICBkZXZpYXRpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnZhcmlhbmNlKCkpO1xuICB9XG59XG5cbmNsYXNzIFRpbWVTZXJpZXMge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5kYXRhU2VyaWVzID0gbmV3IERhdGFTZXJpZXMobmFtZSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGFTZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLmxhc3RWYWx1ZSA9IE5hTjtcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSBOYU47XG4gIH1cblxuICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgIEFSR19DSEVDSyhhcmd1bWVudHMsIDMsIDMpO1xuICAgIHRoaXMuZGF0YVNlcmllcy5zZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cyk7XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcbiAgfVxuXG4gIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAoIWlzTmFOKHRoaXMubGFzdFRpbWVzdGFtcCkpIHtcbiAgICAgIHRoaXMuZGF0YVNlcmllcy5yZWNvcmQodGhpcy5sYXN0VmFsdWUsIHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucmVjb3JkKE5hTiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuY291bnQoKTtcbiAgfVxuXG4gIG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1pbigpO1xuICB9XG5cbiAgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWF4KCk7XG4gIH1cblxuICByYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnJhbmdlKCk7XG4gIH1cblxuICBzdW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5zdW0oKTtcbiAgfVxuXG4gIGF2ZXJhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5hdmVyYWdlKCk7XG4gIH1cblxuICBkZXZpYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5kZXZpYXRpb24oKTtcbiAgfVxuXG4gIHZhcmlhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMudmFyaWFuY2UoKTtcbiAgfVxufVxuXG5jbGFzcyBQb3B1bGF0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgICB0aGlzLnNpemVTZXJpZXMgPSBuZXcgVGltZVNlcmllcygpO1xuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMgPSBuZXcgRGF0YVNlcmllcygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gIH1cblxuICBlbnRlcih0aW1lc3RhbXApIHtcbiAgICBBUkdfQ0hFQ0soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiArKztcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGxlYXZlKGFycml2YWxBdCwgbGVmdEF0KSB7XG4gICAgQVJHX0NIRUNLKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICB0aGlzLnBvcHVsYXRpb24gLS07XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIGxlZnRBdCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZWNvcmQobGVmdEF0IC0gYXJyaXZhbEF0KTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIHRoaXMuc2l6ZVNlcmllcy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG59XG5cbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbiIsImltcG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUsIEFSR19DSEVDSyB9IGZyb20gJy4vbGliL3NpbS5qcyc7XG5pbXBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH0gZnJvbSAnLi9saWIvc3RhdHMuanMnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vbGliL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vbGliL3F1ZXVlcy5qcyc7XG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICcuL2xpYi9yYW5kb20uanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL2xpYi9tb2RlbC5qcyc7XG5cbmV4cG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUgfTtcbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbmV4cG9ydCB7IFJlcXVlc3QgfTtcbmV4cG9ydCB7IFBRdWV1ZSwgUXVldWUsIEFSR19DSEVDSyB9O1xuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgeyBNb2RlbCB9O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LlNpbSA9IHtcbiAgICBBUkdfQ0hFQ0s6IEFSR19DSEVDSyxcbiAgICBCdWZmZXI6IEJ1ZmZlcixcbiAgICBEYXRhU2VyaWVzOiBEYXRhU2VyaWVzLFxuICAgIEVudGl0eTogRW50aXR5LFxuICAgIEV2ZW50OiBFdmVudCxcbiAgICBGYWNpbGl0eTogRmFjaWxpdHksXG4gICAgTW9kZWw6IE1vZGVsLFxuICAgIFBRdWV1ZTogUFF1ZXVlLFxuICAgIFBvcHVsYXRpb246IFBvcHVsYXRpb24sXG4gICAgUXVldWU6IFF1ZXVlLFxuICAgIFJhbmRvbTogUmFuZG9tLFxuICAgIFJlcXVlc3Q6IFJlcXVlc3QsXG4gICAgU2ltOiBTaW0sXG4gICAgU3RvcmU6IFN0b3JlLFxuICAgIFRpbWVTZXJpZXM6IFRpbWVTZXJpZXNcbiAgfTtcbn1cbiJdfQ==
