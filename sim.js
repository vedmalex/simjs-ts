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
      return this.data.length ? this.data[this.data.length - 1] : null;
    }
  }, {
    key: 'push',
    value: function push(value, timestamp) {
      (0, _sim.argCheck)(arguments, 2, 2);
      this.data.push(value);
      this.timestamp.push(timestamp);

      this.stats.enter(timestamp);
    }
  }, {
    key: 'unshift',
    value: function unshift(value, timestamp) {
      (0, _sim.argCheck)(arguments, 2, 2);
      this.data.unshift(value);
      this.timestamp.unshift(timestamp);

      this.stats.enter(timestamp);
    }
  }, {
    key: 'shift',
    value: function shift(timestamp) {
      (0, _sim.argCheck)(arguments, 1, 1);

      var value = this.data.shift();

      var enqueuedAt = this.timestamp.shift();

      this.stats.leave(enqueuedAt, timestamp);
      return value;
    }
  }, {
    key: 'pop',
    value: function pop(timestamp) {
      (0, _sim.argCheck)(arguments, 1, 1);

      var value = this.data.pop();

      var enqueuedAt = this.timestamp.pop();

      this.stats.leave(enqueuedAt, timestamp);
      return value;
    }
  }, {
    key: 'passby',
    value: function passby(timestamp) {
      (0, _sim.argCheck)(arguments, 1, 1);

      this.stats.enter(timestamp);
      this.stats.leave(timestamp, timestamp);
    }
  }, {
    key: 'finalize',
    value: function finalize(timestamp) {
      (0, _sim.argCheck)(arguments, 1, 1);

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
      (0, _sim.argCheck)(arguments, 1, 1);
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
        return null;
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

    if (typeof seed !== 'number' // argCheck
     || Math.ceil(seed) !== Math.floor(seed)) {
      // argCheck
      throw new TypeError('seed value must be an integer'); // argCheck
    } // argCheck

    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df; /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

    // this.initGenrand(seed);
    this.initByArray([seed], 1);
  }

  _createClass(Random, [{
    key: 'initGenrand',
    value: function initGenrand(s) {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
        this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;

        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
        /* In the previous versions, MSBs of the seed affect   */
        /* only MSBs of the array mt[].                        */
        /* 2002/01/09 modified by Makoto Matsumoto             */
        /* for >32 bit machines */
        this.mt[this.mti] >>>= 0;
      }
    }
  }, {
    key: 'initByArray',
    value: function initByArray(initKey, keyLength) {
      var i = void 0,
          j = void 0,
          k = void 0;

      this.initGenrand(19650218);
      i = 1;j = 0;
      k = this.N > keyLength ? this.N : keyLength;
      for (; k; k--) {
        var s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;

        this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1664525 << 16) + (s & 0x0000ffff) * 1664525) + initKey[j] + j; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++;j++;
        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];i = 1;
        }
        if (j >= keyLength) j = 0;
      }
      for (k = this.N - 1; k; k--) {
        var _s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;

        this.mt[i] = (this.mt[i] ^ (((_s & 0xffff0000) >>> 16) * 1566083941 << 16) + (_s & 0x0000ffff) * 1566083941) - i; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++;
        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];i = 1;
        }
      }

      this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }
  }, {
    key: 'genrandInt32',
    value: function genrandInt32() {
      var y = void 0;

      var mag01 = [0x0, this.MATRIX_A];

      //  mag01[x] = x * MATRIX_A  for x=0,1

      if (this.mti >= this.N) {
        // generate N words at one time
        var kk = void 0;

        if (this.mti === this.N + 1) {
          // if initGenrand() has not been called,
          this.initGenrand(5489); // a default initial seed is used
        }

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
    key: 'genrandInt31',
    value: function genrandInt31() {
      return this.genrandInt32() >>> 1;
    }
  }, {
    key: 'genrandReal1',
    value: function genrandReal1() {
      // divided by 2^32-1
      return this.genrandInt32() * (1.0 / 4294967295.0);
    }
  }, {
    key: 'random',
    value: function random() {
      if (this.pythonCompatibility) {
        if (this.skip) {
          this.genrandInt32();
        }
        this.skip = true;
      }
      // divided by 2^32
      return this.genrandInt32() * (1.0 / 4294967296.0);
    }
  }, {
    key: 'genrandReal3',
    value: function genrandReal3() {
      // divided by 2^32
      return (this.genrandInt32() + 0.5) * (1.0 / 4294967296.0);
    }
  }, {
    key: 'genrandRes53',
    value: function genrandRes53() {
      var a = this.genrandInt32() >>> 5;
      var b = this.genrandInt32() >>> 6;

      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
  }, {
    key: 'exponential',
    value: function exponential(lambda) {
      if (arguments.length !== 1) {
        // argCheck
        throw new SyntaxError('exponential() must  be called with \'lambda\' parameter'); // argCheck
      } // argCheck

      var r = this.random();

      return -Math.log(r) / lambda;
    }
  }, {
    key: 'gamma',
    value: function gamma(alpha, beta) {
      if (arguments.length !== 2) {
        // argCheck
        throw new SyntaxError('gamma() must be called with alpha and beta parameters'); // argCheck
      } // argCheck

      /* Based on Python 2.6 source code of random.py.
       */

      var u = void 0;

      if (alpha > 1.0) {
        var ainv = Math.sqrt(2.0 * alpha - 1.0);

        var bbb = alpha - this.LOG4;

        var ccc = alpha + ainv;

        while (true) {
          // eslint-disable-line no-constant-condition
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
        u = this.random();

        while (u <= 1e-7) {
          u = this.random();
        }
        return -Math.log(u) * beta;
      } else {
        var _x2 = void 0;

        while (true) {
          // eslint-disable-line no-constant-condition
          u = this.random();

          var b = (Math.E + alpha) / Math.E;

          var p = b * u;

          if (p <= 1.0) {
            _x2 = Math.pow(p, 1.0 / alpha);
          } else {
            _x2 = -Math.log((b - p) / alpha);
          }
          var _u = this.random();

          if (p > 1.0) {
            if (_u <= Math.pow(_x2, alpha - 1.0)) {
              break;
            }
          } else if (_u <= Math.exp(-_x2)) {
            break;
          }
        }
        return _x2 * beta;
      }
    }
  }, {
    key: 'normal',
    value: function normal(mu, sigma) {
      if (arguments.length !== 2) {
        // argCheck
        throw new SyntaxError('normal() must be called with mu and sigma parameters'); // argCheck
      } // argCheck

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
        // argCheck
        throw new SyntaxError('pareto() must be called with alpha parameter'); // argCheck
      } // argCheck

      var u = this.random();

      return 1.0 / Math.pow(1 - u, 1.0 / alpha);
    }
  }, {
    key: 'triangular',
    value: function triangular(lower, upper, mode) {
      // http://en.wikipedia.org/wiki/Triangular_distribution
      if (arguments.length !== 3) {
        // argCheck
        throw new SyntaxError('triangular() must be called with lower, upper and mode parameters'); // argCheck
      } // argCheck

      var c = (mode - lower) / (upper - lower);

      var u = this.random();

      if (u <= c) {
        return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
      }
      return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
    }

    /**
    * All floats between lower and upper are equally likely. This is the
    * theoretical distribution model for a balanced coin, an unbiased die, a
    * casino roulette, or the first card of a well-shuffled deck.
    *
    * @param {Number} lower
    * @param {Number} upper
    * @returns {Number}
    */

  }, {
    key: 'uniform',
    value: function uniform(lower, upper) {
      if (arguments.length !== 2) {
        // argCheck
        throw new SyntaxError('uniform() must be called with lower and upper parameters'); // argCheck
      } // argCheck
      return lower + this.random() * (upper - lower);
    }
  }, {
    key: 'weibull',
    value: function weibull(alpha, beta) {
      if (arguments.length !== 2) {
        // argCheck
        throw new SyntaxError('weibull() must be called with alpha and beta parameters'); // argCheck
      } // argCheck
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
          this.source.progressPutQueue();
          this.source.progressGetQueue();
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
      (0, _sim.argCheck)(arguments, 0, 3, Function, Object);

      this.callbacks.push([callback, context, argument]);
      return this;
    }
  }, {
    key: 'waitUntil',
    value: function waitUntil(delay, callback, context, argument) {
      (0, _sim.argCheck)(arguments, 1, 4, null, Function, Object);
      if (this.noRenege) return this;

      var ro = this._addRequest(this.scheduledAt + delay, callback, context, argument);

      this.entity.sim.queue.insert(ro);
      return this;
    }
  }, {
    key: 'unlessEvent',
    value: function unlessEvent(event, callback, context, argument) {
      (0, _sim.argCheck)(arguments, 1, 4, null, Function, Object);
      if (this.noRenege) return this;

      if (event instanceof _sim.Event) {
        var ro = this._addRequest(0, callback, context, argument);

        ro.msg = event;
        event.addWaitList(ro);
      } else if (event instanceof Array) {
        for (var i = 0; i < event.length; i++) {

          var _ro = this._addRequest(0, callback, context, argument);

          _ro.msg = event[i];
          event[i].addWaitList(_ro);
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
exports.argCheck = exports.Entity = exports.Event = exports.Store = exports.Buffer = exports.Facility = exports.Sim = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queues = require('./queues.js');

var _stats = require('./stats.js');

var _request = require('./request.js');

var _model = require('./model.js');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function argCheck(found, expMin, expMax) {
  if (found.length < expMin || found.length > expMax) {
    // argCheck
    throw new Error('Incorrect number of arguments'); // argCheck
  } // argCheck

  for (var i = 0; i < found.length; i++) {
    // argCheck

    if (!arguments[i + 3] || !found[i]) continue; // argCheck

    //    print("TEST " + found[i] + " " + arguments[i + 3]   // argCheck
    //    + " " + (found[i] instanceof Event)   // argCheck
    //    + " " + (found[i] instanceof arguments[i + 3])   // argCheck
    //    + "\n");   // ARG CHECK

    if (!(found[i] instanceof arguments[i + 3])) {
      // argCheck
      throw new Error('parameter ' + (i + 1) + ' is of incorrect type.'); // argCheck
    } // argCheck
  } // argCheck
} // argCheck

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
          if (entity.onMessage) entity.onMessage(sender, message);
        }
      } else if (entities instanceof Array) {
        for (var _i = entities.length - 1; _i >= 0; _i--) {
          var _entity = entities[_i];

          if (_entity === sender) continue;
          if (_entity.onMessage) _entity.onMessage(sender, message);
        }
      } else if (entities.onMessage) {
        entities.onMessage(sender, message);
      }
    }
  }, {
    key: 'addEntity',
    value: function addEntity(Klass, name) {
      // Verify that prototype has start function
      if (!Klass.prototype.start) {
        // ARG CHECK
        throw new Error('Entity class ' + Klass.name + ' must have start() function defined');
      }

      var entity = new Klass(this, name);

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
      // argCheck(arguments, 1, 2);
      if (!maxEvents) {
        maxEvents = Math.Infinity;
      }
      var events = 0;

      while (true) {
        // eslint-disable-line no-constant-condition
        events++;
        if (events > maxEvents) return false;

        // Get the earliest event
        var ro = this.queue.remove();

        // If there are no more events, we are done with simulation here.
        if (ro === null) break;

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
        // eslint-disable-line no-constant-condition
        var ro = this.queue.remove();

        if (ro === null) return false;
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
      argCheck(arguments, 1, 1, Function);
      this.logger = logger;
    }
  }, {
    key: 'log',
    value: function log(message, entity) {
      argCheck(arguments, 1, 2);

      if (!this.logger) return;
      var entityMsg = '';

      if (typeof entity !== 'undefined') {
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

var Facility = function (_Model) {
  _inherits(Facility, _Model);

  function Facility(name, discipline, servers, maxqlen) {
    _classCallCheck(this, Facility);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Facility).call(this, name));

    argCheck(arguments, 1, 4);

    _this.free = servers ? servers : 1;
    _this.servers = servers ? servers : 1;
    _this.maxqlen = typeof maxqlen === 'undefined' ? -1 : 1 * maxqlen;

    switch (discipline) {

      case Facility.LCFS:
        _this.use = _this.useLCFS;
        _this.queue = new _queues.Queue();
        break;
      case Facility.PS:
        _this.use = _this.useProcessorSharing;
        _this.queue = [];
        break;
      case Facility.FCFS:
      default:
        _this.use = _this.useFCFS;
        _this.freeServers = new Array(_this.servers);
        _this.queue = new _queues.Queue();
        for (var i = 0; i < _this.freeServers.length; i++) {

          _this.freeServers[i] = true;
        }
    }

    _this.stats = new _stats.Population();
    _this.busyDuration = 0;
    return _this;
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
      argCheck(arguments, 1, 1);

      this.stats.finalize(timestamp);
      this.queue.stats.finalize(timestamp);
    }
  }, {
    key: 'useFCFS',
    value: function useFCFS(duration, ro) {
      argCheck(arguments, 2, 2);
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
      argCheck(arguments, 1, 1);

      while (this.free > 0 && !this.queue.empty()) {
        var ro = this.queue.shift(timestamp);

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
      argCheck(arguments, 2, 2);

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
      var facility = this.source;

      if (this !== facility.currentRO) return;
      facility.currentRO = null;

      // stats
      facility.busyDuration += this.entity.time() - this.lastIssued;
      facility.stats.leave(this.scheduledAt, this.entity.time());

      // deliver this request
      this.deliver = this.saved_deliver;
      delete this.saved_deliver;
      this.deliver();

      // see if there are pending requests
      if (!facility.queue.empty()) {
        var obj = facility.queue.pop(this.entity.time());

        facility.useLCFS(obj.remaining, obj);
      }
    }
  }, {
    key: 'useProcessorSharing',
    value: function useProcessorSharing(duration, ro) {
      argCheck(arguments, 2, 2, null, _request.Request);
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
        var _newev = new _request.Request(this, current, current + ro.duration * (size + 1));

        _newev.ro = ro;
        _newev.source = this;
        _newev.deliver = this.useProcessorSharingCallback;
        newQueue.push(_newev);

        ro.entity.sim.queue.insert(_newev);
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
      var fac = this.source;

      if (this.cancelled) return;
      fac.stats.leave(this.ro.scheduledAt, this.ro.entity.time());

      fac.useProcessorSharingSchedule(this.ro, false);
      this.ro.deliver();
    }
  }]);

  return Facility;
}(_model.Model);

Facility.FCFS = 1;
Facility.LCFS = 2;
Facility.PS = 3;
Facility.NumDisciplines = 4;

var Buffer = function (_Model2) {
  _inherits(Buffer, _Model2);

  function Buffer(name, capacity, initial) {
    _classCallCheck(this, Buffer);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Buffer).call(this, name));

    argCheck(arguments, 2, 3);

    _this2.capacity = capacity;
    _this2.available = typeof initial === 'undefined' ? 0 : initial;
    _this2.putQueue = new _queues.Queue();
    _this2.getQueue = new _queues.Queue();
    return _this2;
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
      argCheck(arguments, 2, 2);

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
      argCheck(arguments, 2, 2);

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
        // eslint-disable-line no-cond-assign
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
        // eslint-disable-line no-cond-assign
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

var Store = function (_Model3) {
  _inherits(Store, _Model3);

  function Store(capacity) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, Store);

    argCheck(arguments, 1, 2);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this, name));

    _this3.capacity = capacity;
    _this3.objects = [];
    _this3.putQueue = new _queues.Queue();
    _this3.getQueue = new _queues.Queue();
    return _this3;
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
      argCheck(arguments, 2, 2);

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
      argCheck(arguments, 2, 2);

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
        // eslint-disable-line no-cond-assign
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
                // eslint-disable-line max-depth
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
        // eslint-disable-line no-cond-assign
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

var Event = function (_Model4) {
  _inherits(Event, _Model4);

  function Event(name) {
    _classCallCheck(this, Event);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Event).call(this, name));

    argCheck(arguments, 0, 1);

    _this4.waitList = [];
    _this4.queue = [];
    _this4.isFired = false;
    return _this4;
  }

  _createClass(Event, [{
    key: 'addWaitList',
    value: function addWaitList(ro) {
      argCheck(arguments, 1, 1);

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
      argCheck(arguments, 1, 1);

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
      argCheck(arguments, 0, 1);

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

var Entity = function (_Model5) {
  _inherits(Entity, _Model5);

  function Entity(sim, name) {
    _classCallCheck(this, Entity);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Entity).call(this, name));

    _this5.sim = sim;
    return _this5;
  }

  _createClass(Entity, [{
    key: 'time',
    value: function time() {
      return this.sim.time();
    }
  }, {
    key: 'setTimer',
    value: function setTimer(duration) {
      argCheck(arguments, 1, 1);

      var ro = new _request.Request(this, this.sim.time(), this.sim.time() + duration);

      this.sim.queue.insert(ro);
      return ro;
    }
  }, {
    key: 'waitEvent',
    value: function waitEvent(event) {
      argCheck(arguments, 1, 1, Event);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = event;
      event.addWaitList(ro);
      return ro;
    }
  }, {
    key: 'queueEvent',
    value: function queueEvent(event) {
      argCheck(arguments, 1, 1, Event);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = event;
      event.addQueue(ro);
      return ro;
    }
  }, {
    key: 'useFacility',
    value: function useFacility(facility, duration) {
      argCheck(arguments, 2, 2, Facility);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = facility;
      facility.use(duration, ro);
      return ro;
    }
  }, {
    key: 'putBuffer',
    value: function putBuffer(buffer, amount) {
      argCheck(arguments, 2, 2, Buffer);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = buffer;
      buffer.put(amount, ro);
      return ro;
    }
  }, {
    key: 'getBuffer',
    value: function getBuffer(buffer, amount) {
      argCheck(arguments, 2, 2, Buffer);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = buffer;
      buffer.get(amount, ro);
      return ro;
    }
  }, {
    key: 'putStore',
    value: function putStore(store, obj) {
      argCheck(arguments, 2, 2, Store);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = store;
      store.put(obj, ro);
      return ro;
    }
  }, {
    key: 'getStore',
    value: function getStore(store, filter) {
      argCheck(arguments, 1, 2, Store, Function);

      var ro = new _request.Request(this, this.sim.time(), 0);

      ro.source = store;
      store.get(filter, ro);
      return ro;
    }
  }, {
    key: 'send',
    value: function send(message, delay, entities) {
      argCheck(arguments, 2, 3);

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
      argCheck(arguments, 1, 1);

      this.sim.log(message, this);
    }
  }]);

  return Entity;
}(_model.Model);

exports.Sim = Sim;
exports.Facility = Facility;
exports.Buffer = Buffer;
exports.Store = Store;
exports.Event = Event;
exports.Entity = Entity;
exports.argCheck = argCheck;

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
      (0, _sim.argCheck)(arguments, 3, 3);

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
      (0, _sim.argCheck)(arguments, 1, 2);

      var w = typeof weight === 'undefined' ? 1 : weight;

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
      (0, _sim.argCheck)(arguments, 3, 3);
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
      (0, _sim.argCheck)(arguments, 2, 2);

      if (!isNaN(this.lastTimestamp)) {
        this.dataSeries.record(this.lastValue, timestamp - this.lastTimestamp);
      }

      this.lastValue = value;
      this.lastTimestamp = timestamp;
    }
  }, {
    key: 'finalize',
    value: function finalize(timestamp) {
      (0, _sim.argCheck)(arguments, 1, 1);

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
      (0, _sim.argCheck)(arguments, 1, 1);

      this.population++;
      this.sizeSeries.record(this.population, timestamp);
    }
  }, {
    key: 'leave',
    value: function leave(arrivalAt, leftAt) {
      (0, _sim.argCheck)(arguments, 2, 2);

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
exports.Model = exports.Random = exports.argCheck = exports.Queue = exports.PQueue = exports.Request = exports.Population = exports.TimeSeries = exports.DataSeries = exports.Store = exports.Facility = exports.Buffer = exports.Event = exports.Entity = exports.Sim = undefined;

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
exports.argCheck = _sim.argCheck;
exports.Random = _random.Random;
exports.Model = _model.Model;


if (typeof window !== 'undefined') {
  window.Sim = {
    argCheck: _sim.argCheck,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEseUZBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLHVCQUFiO0FBSmdCO0FBS2pCOzs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsYUFBUSxLQUFLLElBQUwsQ0FBVSxNQUFYLEdBQXFCLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FB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Q1IsYUFBTyxLQUFLLFVBQVo7QUFDRDs7OzZCQUVRLFMsRUFBVztBQUNsQixXQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsU0FBekI7QUFDRDs7Ozs7O1FBR00sVSxHQUFBLFU7UUFBWSxVLEdBQUEsVTtRQUFZLFUsR0FBQSxVOzs7Ozs7Ozs7O0FDbk9qQzs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7UUFFUyxHO1FBQUssTTtRQUFRLEs7UUFBTyxNO1FBQVEsUTtRQUFVLEs7UUFDdEMsVTtRQUFZLFU7UUFBWSxVO1FBQ3hCLE87UUFDQSxNO1FBQVEsSztRQUFPLFE7UUFDZixNO1FBQ0EsSzs7O0FBRVQsSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsU0FBTyxHQUFQLEdBQWE7QUFDWCwyQkFEVztBQUVYLHVCQUZXO0FBR1gsaUNBSFc7QUFJWCx1QkFKVztBQUtYLHFCQUxXO0FBTVgsMkJBTlc7QUFPWCx1QkFQVztBQVFYLDBCQVJXO0FBU1gsaUNBVFc7QUFVWCx3QkFWVztBQVdYLDBCQVhXO0FBWVgsNkJBWlc7QUFhWCxpQkFiVztBQWNYLHFCQWRXO0FBZVg7QUFmVyxHQUFiO0FBaUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLl9uZXh0SWQoKTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8IGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gJHt0aGlzLmlkfWA7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRvdGFsSW5zdGFuY2VzKCkge1xuICAgIHJldHVybiAhdGhpcy5fdG90YWxJbnN0YW5jZXMgPyAwIDogdGhpcy5fdG90YWxJbnN0YW5jZXM7XG4gIH1cblxuICBzdGF0aWMgX25leHRJZCgpIHtcbiAgICB0aGlzLl90b3RhbEluc3RhbmNlcyA9IHRoaXMudG90YWxJbnN0YW5jZXMgKyAxO1xuICAgIHJldHVybiB0aGlzLl90b3RhbEluc3RhbmNlcztcbiAgfVxufVxuXG5leHBvcnQgeyBNb2RlbCB9O1xuZXhwb3J0IGRlZmF1bHQgTW9kZWw7XG4iLCJpbXBvcnQgeyBhcmdDaGVjayB9IGZyb20gJy4vc2ltLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XG5cbmNsYXNzIFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgICB0aGlzLnN0YXRzID0gbmV3IFBvcHVsYXRpb24oKTtcbiAgfVxuXG4gIHRvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICB9XG5cbiAgYmFjaygpIHtcbiAgICByZXR1cm4gKHRoaXMuZGF0YS5sZW5ndGgpID8gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXSA6IG51bGw7XG4gIH1cblxuICBwdXNoKHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLnRpbWVzdGFtcC5wdXNoKHRpbWVzdGFtcCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gIH1cblxuICB1bnNoaWZ0KHZhbHVlLCB0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuICAgIHRoaXMuZGF0YS51bnNoaWZ0KHZhbHVlKTtcbiAgICB0aGlzLnRpbWVzdGFtcC51bnNoaWZ0KHRpbWVzdGFtcCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gIH1cblxuICBzaGlmdCh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEuc2hpZnQoKTtcblxuICAgIGNvbnN0IGVucXVldWVkQXQgPSB0aGlzLnRpbWVzdGFtcC5zaGlmdCgpO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHBvcCh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEucG9wKCk7XG5cbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAucG9wKCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcGFzc2J5KHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XG4gICAgdGhpcy5zdGF0cy5sZWF2ZSh0aW1lc3RhbXAsIHRpbWVzdGFtcCk7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdGF0cy5yZXNldCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gIH1cblxuICByZXBvcnQoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXRzLnNpemVTZXJpZXMuYXZlcmFnZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHMuZHVyYXRpb25TZXJpZXMuYXZlcmFnZSgpXTtcbiAgfVxuXG4gIGVtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aDtcbiAgfVxufVxuXG5jbGFzcyBQUXVldWUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLm9yZGVyID0gMDtcbiAgfVxuXG4gIGdyZWF0ZXIocm8xLCBybzIpIHtcbiAgICBpZiAocm8xLmRlbGl2ZXJBdCA+IHJvMi5kZWxpdmVyQXQpIHJldHVybiB0cnVlO1xuICAgIGlmIChybzEuZGVsaXZlckF0ID09PSBybzIuZGVsaXZlckF0KSByZXR1cm4gcm8xLm9yZGVyID4gcm8yLm9yZGVyO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGluc2VydChybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG4gICAgcm8ub3JkZXIgPSB0aGlzLm9yZGVyICsrO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLmxlbmd0aDtcblxuICAgIHRoaXMuZGF0YS5wdXNoKHJvKTtcblxuICAgICAgICAvLyBpbnNlcnQgaW50byBkYXRhIGF0IHRoZSBlbmRcbiAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuXG4gICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xuXG4gICAgICAgIC8vIGhlYXAgdXBcbiAgICB3aGlsZSAoaW5kZXggPiAwKSB7XG4gICAgICBjb25zdCBwYXJlbnRJbmRleCA9IE1hdGguZmxvb3IoKGluZGV4IC0gMSkgLyAyKTtcblxuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3BhcmVudEluZGV4XSwgcm8pKSB7XG4gICAgICAgIGFbaW5kZXhdID0gYVtwYXJlbnRJbmRleF07XG4gICAgICAgIGluZGV4ID0gcGFyZW50SW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYVtpbmRleF0gPSBub2RlO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XG5cbiAgICBsZXQgbGVuID0gYS5sZW5ndGg7XG5cbiAgICBpZiAobGVuIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAobGVuID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCB0b3AgPSBhWzBdO1xuXG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxuICAgIGFbMF0gPSBhLnBvcCgpO1xuICAgIGxlbi0tO1xuXG4gICAgICAgIC8vIGhlYXAgZG93blxuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICB3aGlsZSAoaW5kZXggPCBNYXRoLmZsb29yKGxlbiAvIDIpKSB7XG4gICAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDE7XG5cbiAgICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDI7XG5cbiAgICAgIGNvbnN0IHNtYWxsZXJDaGlsZEluZGV4ID0gcmlnaHRDaGlsZEluZGV4IDwgbGVuXG4gICAgICAgICAgICAgICYmICF0aGlzLmdyZWF0ZXIoYVtyaWdodENoaWxkSW5kZXhdLCBhW2xlZnRDaGlsZEluZGV4XSlcbiAgICAgICAgICAgICAgICAgICAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcblxuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3NtYWxsZXJDaGlsZEluZGV4XSwgbm9kZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGFbaW5kZXhdID0gYVtzbWFsbGVyQ2hpbGRJbmRleF07XG4gICAgICBpbmRleCA9IHNtYWxsZXJDaGlsZEluZGV4O1xuICAgIH1cbiAgICBhW2luZGV4XSA9IG5vZGU7XG4gICAgcmV0dXJuIHRvcDtcbiAgfVxufVxuXG5leHBvcnQgeyBRdWV1ZSwgUFF1ZXVlIH07XG4iLCJcbmNsYXNzIFJhbmRvbSB7XG4gIGNvbnN0cnVjdG9yKHNlZWQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSB7XG4gICAgaWYgKHR5cGVvZiAoc2VlZCkgIT09ICdudW1iZXInICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgICAgICAgfHwgTWF0aC5jZWlsKHNlZWQpICE9PSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlcicpOyAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG5cbiAgICAgICAgLyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cbiAgICB0aGlzLk4gPSA2MjQ7XG4gICAgdGhpcy5NID0gMzk3O1xuICAgIHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOy8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gICAgdGhpcy5VUFBFUl9NQVNLID0gMHg4MDAwMDAwMDsvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG4gICAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cblxuICAgIHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cbiAgICB0aGlzLm10aSA9IHRoaXMuTiArIDE7LyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG5cbiAgICAgICAgLy8gdGhpcy5pbml0R2VucmFuZChzZWVkKTtcbiAgICB0aGlzLmluaXRCeUFycmF5KFtzZWVkXSwgMSk7XG4gIH1cblxuICBpbml0R2VucmFuZChzKSB7XG4gICAgdGhpcy5tdFswXSA9IHMgPj4+IDA7XG4gICAgZm9yICh0aGlzLm10aSA9IDE7IHRoaXMubXRpIDwgdGhpcy5OOyB0aGlzLm10aSsrKSB7XG4gICAgICBzID0gdGhpcy5tdFt0aGlzLm10aSAtIDFdIF4gKHRoaXMubXRbdGhpcy5tdGkgLSAxXSA+Pj4gMzApO1xuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXG4gICAgICAgICAgICArIHRoaXMubXRpO1xuXG4gICAgICAvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cbiAgICAgIC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xuICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cbiAgICAgIC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XG4gICAgfVxuICB9XG5cbiAgaW5pdEJ5QXJyYXkoaW5pdEtleSwga2V5TGVuZ3RoKSB7XG4gICAgbGV0IGksIGosIGs7XG5cbiAgICB0aGlzLmluaXRHZW5yYW5kKDE5NjUwMjE4KTtcbiAgICBpID0gMTsgaiA9IDA7XG4gICAgayA9ICh0aGlzLk4gPiBrZXlMZW5ndGggPyB0aGlzLk4gOiBrZXlMZW5ndGgpO1xuICAgIGZvciAoOyBrOyBrLS0pIHtcbiAgICAgIGNvbnN0IHMgPSB0aGlzLm10W2kgLSAxXSBeICh0aGlzLm10W2kgLSAxXSA+Pj4gMzApO1xuXG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG4gICAgICAgICAgICArIGluaXRLZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cbiAgICAgIGkrKzsgaisrO1xuICAgICAgaWYgKGkgPj0gdGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTiAtIDFdOyBpID0gMTsgfVxuICAgICAgaWYgKGogPj0ga2V5TGVuZ3RoKSBqID0gMDtcbiAgICB9XG4gICAgZm9yIChrID0gdGhpcy5OIC0gMTsgazsgay0tKSB7XG4gICAgICBjb25zdCBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcblxuICAgICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE1NjYwODM5NDEpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxNTY2MDgzOTQxKSlcbiAgICAgICAgICAgIC0gaTsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICBpKys7XG4gICAgICBpZiAoaSA+PSB0aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OIC0gMV07IGkgPSAxOyB9XG4gICAgfVxuXG4gICAgdGhpcy5tdFswXSA9IDB4ODAwMDAwMDA7IC8qIE1TQiBpcyAxOyBhc3N1cmluZyBub24temVybyBpbml0aWFsIGFycmF5ICovXG4gIH1cblxuICBnZW5yYW5kSW50MzIoKSB7XG4gICAgbGV0IHk7XG5cbiAgICBjb25zdCBtYWcwMSA9IFsweDAsIHRoaXMuTUFUUklYX0FdO1xuXG4gICAgICAgIC8vICBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxXG5cbiAgICBpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7ICAvLyBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lXG4gICAgICBsZXQga2s7XG5cbiAgICAgIGlmICh0aGlzLm10aSA9PT0gdGhpcy5OICsgMSkgeyAgLy8gaWYgaW5pdEdlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLFxuICAgICAgICB0aGlzLmluaXRHZW5yYW5kKDU0ODkpOyAvLyBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWRcbiAgICAgIH1cblxuICAgICAgZm9yIChrayA9IDA7IGtrIDwgdGhpcy5OIC0gdGhpcy5NOyBraysrKSB7XG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArIHRoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgIH1cbiAgICAgIGZvciAoO2trIDwgdGhpcy5OIC0gMTsga2srKykge1xuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2sgKyAodGhpcy5NIC0gdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgIH1cbiAgICAgIHkgPSAodGhpcy5tdFt0aGlzLk4gLSAxXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFswXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICB0aGlzLm10W3RoaXMuTiAtIDFdID0gdGhpcy5tdFt0aGlzLk0gLSAxXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXG4gICAgICB0aGlzLm10aSA9IDA7XG4gICAgfVxuXG4gICAgeSA9IHRoaXMubXRbdGhpcy5tdGkrK107XG5cbiAgICAgICAgLyogVGVtcGVyaW5nICovXG4gICAgeSBePSAoeSA+Pj4gMTEpO1xuICAgIHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xuICAgIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcbiAgICB5IF49ICh5ID4+PiAxOCk7XG5cbiAgICByZXR1cm4geSA+Pj4gMDtcbiAgfVxuXG4gIGdlbnJhbmRJbnQzMSgpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDEpO1xuICB9XG5cbiAgZ2VucmFuZFJlYWwxKCkge1xuICAgIC8vIGRpdmlkZWQgYnkgMl4zMi0xXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZEludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5NS4wKTtcbiAgfVxuXG4gIHJhbmRvbSgpIHtcbiAgICBpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XG4gICAgICBpZiAodGhpcy5za2lwKSB7XG4gICAgICAgIHRoaXMuZ2VucmFuZEludDMyKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNraXAgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzJcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kSW50MzIoKSAqICgxLjAgLyA0Mjk0OTY3Mjk2LjApO1xuICB9XG5cbiAgZ2VucmFuZFJlYWwzKCkge1xuICAgIC8vIGRpdmlkZWQgYnkgMl4zMlxuICAgIHJldHVybiAodGhpcy5nZW5yYW5kSW50MzIoKSArIDAuNSkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcbiAgfVxuXG4gIGdlbnJhbmRSZXM1MygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5nZW5yYW5kSW50MzIoKSA+Pj4gNTtcbiAgICBjb25zdCBiID0gdGhpcy5nZW5yYW5kSW50MzIoKSA+Pj4gNjtcblxuICAgIHJldHVybiAoYSAqIDY3MTA4ODY0LjAgKyBiKSAqICgxLjAgLyA5MDA3MTk5MjU0NzQwOTkyLjApO1xuICB9XG5cbiAgZXhwb25lbnRpYWwobGFtYmRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZXhwb25lbnRpYWwoKSBtdXN0ICBiZSBjYWxsZWQgd2l0aCBcXCdsYW1iZGFcXCcgcGFyYW1ldGVyJyk7IC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cbiAgICBjb25zdCByID0gdGhpcy5yYW5kb20oKTtcblxuICAgIHJldHVybiAtTWF0aC5sb2cocikgLyBsYW1iZGE7XG4gIH1cblxuICBnYW1tYShhbHBoYSwgYmV0YSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2dhbW1hKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzJyk7IC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cbiAgICAgICAgLyogQmFzZWQgb24gUHl0aG9uIDIuNiBzb3VyY2UgY29kZSBvZiByYW5kb20ucHkuXG4gICAgICAgICAqL1xuXG4gICAgbGV0IHU7XG5cbiAgICBpZiAoYWxwaGEgPiAxLjApIHtcbiAgICAgIGNvbnN0IGFpbnYgPSBNYXRoLnNxcnQoMi4wICogYWxwaGEgLSAxLjApO1xuXG4gICAgICBjb25zdCBiYmIgPSBhbHBoYSAtIHRoaXMuTE9HNDtcblxuICAgICAgY29uc3QgY2NjID0gYWxwaGEgKyBhaW52O1xuXG4gICAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgY29uc3QgdTEgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgICAgIGlmICgodTEgPCAxZS03KSB8fCAodSA+IDAuOTk5OTk5OSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1MiA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgY29uc3QgdiA9IE1hdGgubG9nKHUxIC8gKDEuMCAtIHUxKSkgLyBhaW52O1xuXG4gICAgICAgIGNvbnN0IHggPSBhbHBoYSAqIE1hdGguZXhwKHYpO1xuXG4gICAgICAgIGNvbnN0IHogPSB1MSAqIHUxICogdTI7XG5cbiAgICAgICAgY29uc3QgciA9IGJiYiArIGNjYyAqIHYgLSB4O1xuXG4gICAgICAgIGlmICgociArIHRoaXMuU0dfTUFHSUNDT05TVCAtIDQuNSAqIHogPj0gMC4wKSB8fCAociA+PSBNYXRoLmxvZyh6KSkpIHtcbiAgICAgICAgICByZXR1cm4geCAqIGJldGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFscGhhID09PSAxLjApIHtcbiAgICAgIHUgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgICB3aGlsZSAodSA8PSAxZS03KSB7XG4gICAgICAgIHUgPSB0aGlzLnJhbmRvbSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC1NYXRoLmxvZyh1KSAqIGJldGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB4O1xuXG4gICAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgY29uc3QgYiA9IChNYXRoLkUgKyBhbHBoYSkgLyBNYXRoLkU7XG5cbiAgICAgICAgY29uc3QgcCA9IGIgKiB1O1xuXG4gICAgICAgIGlmIChwIDw9IDEuMCkge1xuICAgICAgICAgIHggPSBNYXRoLnBvdyhwLCAxLjAgLyBhbHBoYSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4ID0gLU1hdGgubG9nKChiIC0gcCkgLyBhbHBoYSk7XG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1MSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgaWYgKHAgPiAxLjApIHtcbiAgICAgICAgICBpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHggKiBiZXRhO1xuICAgIH1cblxuICB9XG5cbiAgbm9ybWFsKG11LCBzaWdtYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdub3JtYWwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzJyk7ICAgICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cbiAgICBsZXQgeiA9IHRoaXMubGFzdE5vcm1hbDtcblxuICAgIHRoaXMubGFzdE5vcm1hbCA9IE5hTjtcbiAgICBpZiAoIXopIHtcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG5cbiAgICAgIGNvbnN0IGIgPSBNYXRoLnNxcnQoLTIuMCAqIE1hdGgubG9nKDEuMCAtIHRoaXMucmFuZG9tKCkpKTtcblxuICAgICAgeiA9IE1hdGguY29zKGEpICogYjtcbiAgICAgIHRoaXMubGFzdE5vcm1hbCA9IE1hdGguc2luKGEpICogYjtcbiAgICB9XG4gICAgcmV0dXJuIG11ICsgeiAqIHNpZ21hO1xuICB9XG5cbiAgcGFyZXRvKGFscGhhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigncGFyZXRvKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBwYXJhbWV0ZXInKTsgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuICAgIGNvbnN0IHUgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgcmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcbiAgfVxuXG4gIHRyaWFuZ3VsYXIobG93ZXIsIHVwcGVyLCBtb2RlKSB7XG4gICAgICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJpYW5ndWxhcl9kaXN0cmlidXRpb25cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMykgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCd0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVycycpOyAgICAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG4gICAgY29uc3QgYyA9IChtb2RlIC0gbG93ZXIpIC8gKHVwcGVyIC0gbG93ZXIpO1xuXG4gICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICBpZiAodSA8PSBjKSB7XG4gICAgICByZXR1cm4gbG93ZXIgKyBNYXRoLnNxcnQodSAqICh1cHBlciAtIGxvd2VyKSAqIChtb2RlIC0gbG93ZXIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVwcGVyIC0gTWF0aC5zcXJ0KCgxIC0gdSkgKiAodXBwZXIgLSBsb3dlcikgKiAodXBwZXIgLSBtb2RlKSk7XG4gIH1cblxuICAvKipcbiAgKiBBbGwgZmxvYXRzIGJldHdlZW4gbG93ZXIgYW5kIHVwcGVyIGFyZSBlcXVhbGx5IGxpa2VseS4gVGhpcyBpcyB0aGVcbiAgKiB0aGVvcmV0aWNhbCBkaXN0cmlidXRpb24gbW9kZWwgZm9yIGEgYmFsYW5jZWQgY29pbiwgYW4gdW5iaWFzZWQgZGllLCBhXG4gICogY2FzaW5vIHJvdWxldHRlLCBvciB0aGUgZmlyc3QgY2FyZCBvZiBhIHdlbGwtc2h1ZmZsZWQgZGVjay5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsb3dlclxuICAqIEBwYXJhbSB7TnVtYmVyfSB1cHBlclxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHVuaWZvcm0obG93ZXIsIHVwcGVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICByZXR1cm4gbG93ZXIgKyB0aGlzLnJhbmRvbSgpICogKHVwcGVyIC0gbG93ZXIpO1xuICB9XG5cbiAgd2VpYnVsbChhbHBoYSwgYmV0YSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3dlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICBjb25zdCB1ID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblxuICAgIHJldHVybiBhbHBoYSAqIE1hdGgucG93KC1NYXRoLmxvZyh1KSwgMS4wIC8gYmV0YSk7XG4gIH1cbn1cblxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cblxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuUmFuZG9tLnByb3RvdHlwZS5MT0c0ID0gTWF0aC5sb2coNC4wKTtcblJhbmRvbS5wcm90b3R5cGUuU0dfTUFHSUNDT05TVCA9IDEuMCArIE1hdGgubG9nKDQuNSk7XG5cbmV4cG9ydCB7IFJhbmRvbSB9O1xuZXhwb3J0IGRlZmF1bHQgUmFuZG9tO1xuIiwiaW1wb3J0IHsgYXJnQ2hlY2ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xuXG5jbGFzcyBSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3IoZW50aXR5LCBjdXJyZW50VGltZSwgZGVsaXZlckF0KSB7XG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgdGhpcy5zY2hlZHVsZWRBdCA9IGN1cnJlbnRUaW1lO1xuICAgIHRoaXMuZGVsaXZlckF0ID0gZGVsaXZlckF0O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgIH1cblxuICAgICAgICAvLyAtLT4gdGhpcyBpcyBtYWluIHJlcXVlc3RcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgLy8gaWYgYWxyZWFkeSBjYW5jZWxsZWQsIGRvIG5vdGhpbmdcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgdGhpcy5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc0dldFF1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdyb3VwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9uZShjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDMsIEZ1bmN0aW9uLCBPYmplY3QpO1xuXG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB3YWl0VW50aWwoZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCwgbnVsbCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KFxuICAgICAgdGhpcy5zY2hlZHVsZWRBdCArIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuXG4gICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCA0LCBudWxsLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgIHJvLm1zZyA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuXG4gICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgICAgcm8ubXNnID0gZXZlbnRbaV07XG4gICAgICAgIGV2ZW50W2ldLmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgaWYgKCF0aGlzLmNhbGxiYWNrcykgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuZ3JvdXBbMF0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cFswXS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gIH1cblxuICBjYW5jZWxSZW5lZ2VDbGF1c2VzKCkge1xuICAgICAgICAvLyB0aGlzLmNhbmNlbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy53YWl0VW50aWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vIHRoaXMudW5sZXNzRXZlbnQgPSB0aGlzLk51bGw7XG4gICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXAgfHwgdGhpcy5ncm91cFswXSAhPT0gdGhpcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgTnVsbCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9hZGRSZXF1ZXN0KGRlbGl2ZXJBdCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSxcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEF0LFxuICAgICAgICAgICAgICAgIGRlbGl2ZXJBdCk7XG5cbiAgICByby5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG5cbiAgICBpZiAodGhpcy5ncm91cCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5ncm91cCA9IFt0aGlzXTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwLnB1c2gocm8pO1xuICAgIHJvLmdyb3VwID0gdGhpcy5ncm91cDtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBfZG9DYWxsYmFjayhzb3VyY2UsIG1zZywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcblxuICAgICAgaWYgKCFjYWxsYmFjaykgY29udGludWU7XG5cbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5jYWxsYmFja3NbaV1bMV07XG5cbiAgICAgIGlmICghY29udGV4dCkgY29udGV4dCA9IHRoaXMuZW50aXR5O1xuXG4gICAgICBjb25zdCBhcmd1bWVudCA9IHRoaXMuY2FsbGJhY2tzW2ldWzJdO1xuXG4gICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gc291cmNlO1xuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBtc2c7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IGRhdGE7XG5cbiAgICAgIGlmICghYXJndW1lbnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IG51bGw7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG51bGw7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IFJlcXVlc3QgfTtcbiIsImltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL3F1ZXVlcy5qcyc7XG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnLi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XG5cbmZ1bmN0aW9uIGFyZ0NoZWNrKGZvdW5kLCBleHBNaW4sIGV4cE1heCkge1xuICBpZiAoZm91bmQubGVuZ3RoIDwgZXhwTWluIHx8IGZvdW5kLmxlbmd0aCA+IGV4cE1heCkgeyAgIC8vIGFyZ0NoZWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cycpOyAgIC8vIGFyZ0NoZWNrXG4gIH0gICAvLyBhcmdDaGVja1xuXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykgeyAgIC8vIGFyZ0NoZWNrXG5cbiAgICBpZiAoIWFyZ3VtZW50c1tpICsgM10gfHwgIWZvdW5kW2ldKSBjb250aW51ZTsgICAvLyBhcmdDaGVja1xuXG4vLyAgICBwcmludChcIlRFU1QgXCIgKyBmb3VuZFtpXSArIFwiIFwiICsgYXJndW1lbnRzW2kgKyAzXSAgIC8vIGFyZ0NoZWNrXG4vLyAgICArIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgRXZlbnQpICAgLy8gYXJnQ2hlY2tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSAgIC8vIGFyZ0NoZWNrXG4vLyAgICArIFwiXFxuXCIpOyAgIC8vIEFSRyBDSEVDS1xuXG5cbiAgICBpZiAoIShmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pKSB7ICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICR7aSArIDF9IGlzIG9mIGluY29ycmVjdCB0eXBlLmApOyAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgIC8vIGFyZ0NoZWNrXG4gIH0gICAvLyBhcmdDaGVja1xufSAgIC8vIGFyZ0NoZWNrXG5cbmNsYXNzIFNpbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2ltVGltZSA9IDA7XG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xuICAgIHRoaXMucXVldWUgPSBuZXcgUFF1ZXVlKCk7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgICB0aGlzLmVudGl0eUlkID0gMTtcbiAgfVxuXG4gIHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltVGltZTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHNlbmRlciA9IHRoaXMuc291cmNlO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubXNnO1xuXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XG5cbiAgICBjb25zdCBzaW0gPSBzZW5kZXIuc2ltO1xuXG4gICAgaWYgKCFlbnRpdGllcykge1xuICAgICAgICAgICAgLy8gc2VuZCB0byBhbGwgZW50aXRpZXNcbiAgICAgIGZvciAobGV0IGkgPSBzaW0uZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gc2ltLmVudGl0aWVzW2ldO1xuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbnRpdGllcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVudGl0aWVzLm9uTWVzc2FnZSkge1xuICAgICAgZW50aXRpZXMub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgYWRkRW50aXR5KEtsYXNzLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHByb3RvdHlwZSBoYXMgc3RhcnQgZnVuY3Rpb25cbiAgICBpZiAoIUtsYXNzLnByb3RvdHlwZS5zdGFydCkgeyAgLy8gQVJHIENIRUNLXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSBjbGFzcyAke0tsYXNzLm5hbWV9IG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRpdHkgPSBuZXcgS2xhc3ModGhpcywgbmFtZSk7XG5cbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcblxuICAgIGVudGl0eS5zdGFydCguLi5hcmdzKTtcblxuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICBzaW11bGF0ZShlbmRUaW1lLCBtYXhFdmVudHMpIHtcbiAgICAgICAgLy8gYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyKTtcbiAgICBpZiAoIW1heEV2ZW50cykgeyBtYXhFdmVudHMgPSBNYXRoLkluZmluaXR5OyB9XG4gICAgbGV0IGV2ZW50cyA9IDA7XG5cbiAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgIGV2ZW50cysrO1xuICAgICAgaWYgKGV2ZW50cyA+IG1heEV2ZW50cykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGVhcmxpZXN0IGV2ZW50XG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGV2ZW50cywgd2UgYXJlIGRvbmUgd2l0aCBzaW11bGF0aW9uIGhlcmUuXG4gICAgICBpZiAocm8gPT09IG51bGwpIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBVaCBvaC4uIHdlIGFyZSBvdXQgb2YgdGltZSBub3dcbiAgICAgIGlmIChyby5kZWxpdmVyQXQgPiBlbmRUaW1lKSBicmVhaztcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBzaW11bGF0aW9uIHRpbWVcbiAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcblxuICAgICAgcm8uZGVsaXZlcigpO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0ZXAoKSB7XG4gICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG5cbiAgICAgIGlmIChybyA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvZ2dlcihsb2dnZXIpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEsIEZ1bmN0aW9uKTtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlLCBlbnRpdHkpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgaWYgKCF0aGlzLmxvZ2dlcikgcmV0dXJuO1xuICAgIGxldCBlbnRpdHlNc2cgPSAnJztcblxuICAgIGlmICh0eXBlb2YgZW50aXR5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGVudGl0eS5uYW1lKSB7XG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5Lm5hbWV9XWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5pZH1dIGA7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyKGAke3RoaXMuc2ltVGltZS50b0ZpeGVkKDYpfSR7ZW50aXR5TXNnfSAgICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG5jbGFzcyBGYWNpbGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSwgZGlzY2lwbGluZSwgc2VydmVycywgbWF4cWxlbikge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCk7XG5cbiAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5zZXJ2ZXJzID0gc2VydmVycyA/IHNlcnZlcnMgOiAxO1xuICAgIHRoaXMubWF4cWxlbiA9ICh0eXBlb2YgbWF4cWxlbiA9PT0gJ3VuZGVmaW5lZCcpID8gLTEgOiAxICogbWF4cWxlbjtcblxuICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgY2FzZSBGYWNpbGl0eS5MQ0ZTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUxDRlM7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LlBTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmc7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VGQ0ZTO1xuICAgICAgdGhpcy5mcmVlU2VydmVycyA9IG5ldyBBcnJheSh0aGlzLnNlcnZlcnMpO1xuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5mcmVlU2VydmVyc1tpXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XG4gIH1cblxuICBzeXN0ZW1TdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcbiAgfVxuXG4gIHF1ZXVlU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gIH1cblxuICB1c2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idXN5RHVyYXRpb247XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgIHRoaXMucXVldWUuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgfVxuXG4gIHVzZUZDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcbiAgICBpZiAoKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKG5vdyk7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKG5vdyk7XG4gIH1cblxuICB1c2VGQ0ZTU2NoZWR1bGUodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHdoaWxlICh0aGlzLmZyZWUgPiAwICYmICF0aGlzLnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5zaGlmdCh0aW1lc3RhbXApO1xuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZnJlZVNlcnZlcnNbaV0pIHtcbiAgICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gZmFsc2U7XG4gICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmZyZWUgLS07XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSByby5kdXJhdGlvbjtcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGFsbCBvdGhlciByZW5lZ2luZyByZXF1ZXN0c1xuICAgICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xuXG4gICAgICBjb25zdCBuZXdybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRpbWVzdGFtcCwgdGltZXN0YW1wICsgcm8uZHVyYXRpb24pO1xuXG4gICAgICBuZXdyby5kb25lKHRoaXMudXNlRkNGU0NhbGxiYWNrLCB0aGlzLCBybyk7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld3JvKTtcbiAgICB9XG4gIH1cblxuICB1c2VGQ0ZTQ2FsbGJhY2socm8pIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBvbmUgbW9yZSBmcmVlIHNlcnZlclxuICAgIHRoaXMuZnJlZSArKztcbiAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShyby5zY2hlZHVsZWRBdCwgcm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgc29tZW9uZSB3YWl0aW5nLCBzY2hlZHVsZSBpdCBub3dcbiAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShyby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyByZXN0b3JlIHRoZSBkZWxpdmVyIGZ1bmN0aW9uLCBhbmQgZGVsaXZlclxuICAgIHJvLmRlbGl2ZXIoKTtcblxuICB9XG5cbiAgdXNlTENGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgaWYgKHRoaXMuY3VycmVudFJPKSB7XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSAodGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSAtIHRoaXMuY3VycmVudFJPLmxhc3RJc3N1ZWQpO1xuICAgICAgICAgICAgLy8gY2FsY3VhdGUgdGhlIHJlbWFpbmluZyB0aW1lXG4gICAgICB0aGlzLmN1cnJlbnRSTy5yZW1haW5pbmcgPSAoXG4gICAgICAgICAgdGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Uk8gPSBybztcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZS4uXG4gICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHJvLmxhc3RJc3N1ZWQgPSByby5lbnRpdHkudGltZSgpO1xuXG4gICAgICAgIC8vIHNjaGVkdWxlIHRoaXMgbmV3IGV2ZW50XG4gICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIHVzZUxDRlNDYWxsYmFjaygpIHtcbiAgICBjb25zdCBmYWNpbGl0eSA9IHRoaXMuc291cmNlO1xuXG4gICAgaWYgKHRoaXMgIT09IGZhY2lsaXR5LmN1cnJlbnRSTykgcmV0dXJuO1xuICAgIGZhY2lsaXR5LmN1cnJlbnRSTyA9IG51bGw7XG5cbiAgICAgICAgLy8gc3RhdHNcbiAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHRoaXMuZW50aXR5LnRpbWUoKSAtIHRoaXMubGFzdElzc3VlZCk7XG4gICAgZmFjaWxpdHkuc3RhdHMubGVhdmUodGhpcy5zY2hlZHVsZWRBdCwgdGhpcy5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyBkZWxpdmVyIHRoaXMgcmVxdWVzdFxuICAgIHRoaXMuZGVsaXZlciA9IHRoaXMuc2F2ZWRfZGVsaXZlcjtcbiAgICBkZWxldGUgdGhpcy5zYXZlZF9kZWxpdmVyO1xuICAgIHRoaXMuZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgIGlmICghZmFjaWxpdHkucXVldWUuZW1wdHkoKSkge1xuICAgICAgY29uc3Qgb2JqID0gZmFjaWxpdHkucXVldWUucG9wKHRoaXMuZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICB9XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nKGR1cmF0aW9uLCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgbnVsbCwgUmVxdWVzdCk7XG4gICAgcm8uZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgdGhpcy5zdGF0cy5lbnRlcihyby5lbnRpdHkudGltZSgpKTtcbiAgICB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgdHJ1ZSk7XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIGlzQWRkZWQpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcm8uZW50aXR5LnRpbWUoKTtcblxuICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcblxuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBpc0FkZGVkID8gKChzaXplICsgMS4wKSAvIHNpemUpIDogKChzaXplIC0gMS4wKSAvIHNpemUpO1xuXG4gICAgY29uc3QgbmV3UXVldWUgPSBbXTtcblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sYXN0SXNzdWVkID0gY3VycmVudDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG4gICAgICBjb25zdCBldiA9IHRoaXMucXVldWVbaV07XG5cbiAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBuZXdldiA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgIHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcblxuICAgICAgbmV3ZXYucm8gPSBldi5ybztcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgZXYuY2FuY2VsKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XG4gICAgfVxuXG4gICAgICAgIC8vIGFkZCB0aGlzIG5ldyByZXF1ZXN0XG4gICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgIGNvbnN0IG5ld2V2ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgdGhpcywgY3VycmVudCwgY3VycmVudCArIHJvLmR1cmF0aW9uICogKHNpemUgKyAxKSk7XG5cbiAgICAgIG5ld2V2LnJvID0gcm87XG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3UXVldWU7XG5cbiAgICAgICAgLy8gdXNhZ2Ugc3RhdGlzdGljc1xuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKGN1cnJlbnQgLSB0aGlzLmxhc3RJc3N1ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICBjb25zdCBmYWMgPSB0aGlzLnNvdXJjZTtcblxuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIGZhYy5zdGF0cy5sZWF2ZSh0aGlzLnJvLnNjaGVkdWxlZEF0LCB0aGlzLnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgZmFjLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZSh0aGlzLnJvLCBmYWxzZSk7XG4gICAgdGhpcy5yby5kZWxpdmVyKCk7XG4gIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgdGhpcy5hdmFpbGFibGUgPSAodHlwZW9mIGluaXRpYWwgPT09ICd1bmRlZmluZWQnKSA/IDAgOiBpbml0aWFsO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZTtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gIH1cblxuICBnZXQoYW1vdW50LCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgYW1vdW50IDw9IHRoaXMuYXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSAtPSBhbW91bnQ7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHV0KGFtb3VudCwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKVxuICAgICAgICAgICAgICAgICYmIChhbW91bnQgKyB0aGlzLmF2YWlsYWJsZSkgPD0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgKz0gYW1vdW50O1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcbiAgICAgICAgb2JqLmRlbGl2ZXJBdCA9IG9iai5lbnRpdHkudGltZSgpO1xuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgU3RvcmUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKGNhcGFjaXR5LCBuYW1lID0gbnVsbCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMik7XG4gICAgc3VwZXIobmFtZSk7XG5cbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMub2JqZWN0cy5sZW5ndGg7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xuICB9XG5cbiAgZ2V0KGZpbHRlciwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICBsZXQgb2JqO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGNvZGUgb3V0XG4gICAgICAgICAgICAvLyBpdCBpcyByZXBlYXRlZCBpbiBwcm9ncmVzc0dldFF1ZXVlXG4gICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XG5cbiAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm8uZmlsdGVyID0gZmlsdGVyO1xuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwdXQob2JqLCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG4gICAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xuXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLm9iaiA9IG9iajtcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcbiAgICBsZXQgcm87XG5cbiAgICB3aGlsZSAocm8gPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAodGhpcy5jdXJyZW50KCkgPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IHJvLmZpbHRlcjtcblxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgICAgICBsZXQgb2JqO1xuXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XG4gICAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWRlcHRoXG4gICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0cy5zaGlmdCgpO1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XG5cbiAgICAgICAgICByby5tc2cgPSBvYmo7XG4gICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgIGxldCBybztcblxuICAgIHdoaWxlIChybyA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSArKztcbiAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gocm8ub2JqKTtcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHV0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHV0UXVldWUuc3RhdHM7XG4gIH1cblxuICBnZXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcbiAgfVxufVxuXG5jbGFzcyBFdmVudCBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMCwgMSk7XG5cbiAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuaXNGaXJlZCA9IGZhbHNlO1xuICB9XG5cbiAgYWRkV2FpdExpc3Qocm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy53YWl0TGlzdC5wdXNoKHJvKTtcbiAgfVxuXG4gIGFkZFF1ZXVlKHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVldWUucHVzaChybyk7XG4gIH1cblxuICBmaXJlKGtlZXBGaXJlZCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMCwgMSk7XG5cbiAgICBpZiAoa2VlcEZpcmVkKSB7XG4gICAgICB0aGlzLmlzRmlyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBhbGwgd2FpdGluZyBlbnRpdGllc1xuICAgIGNvbnN0IHRtcExpc3QgPSB0aGlzLndhaXRMaXN0O1xuXG4gICAgdGhpcy53YWl0TGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wTGlzdC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0bXBMaXN0W2ldLmRlbGl2ZXIoKTtcbiAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggb25lIHF1ZXVlZCBlbnRpdHlcbiAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcblxuICAgIGlmIChsdWNreSkge1xuICAgICAgbHVja3kuZGVsaXZlcigpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaXNGaXJlZCA9IGZhbHNlO1xuICB9XG59XG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5zaW0gPSBzaW07XG4gIH1cblxuICB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbS50aW1lKCk7XG4gIH1cblxuICBzZXRUaW1lcihkdXJhdGlvbikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCksXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcblxuICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgd2FpdEV2ZW50KGV2ZW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxLCBFdmVudCk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcXVldWVFdmVudChldmVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgZXZlbnQuYWRkUXVldWUocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHVzZUZhY2lsaXR5KGZhY2lsaXR5LCBkdXJhdGlvbikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZmFjaWxpdHk7XG4gICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgIGJ1ZmZlci5wdXQoYW1vdW50LCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgZ2V0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgIGJ1ZmZlci5nZXQoYW1vdW50LCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0U3RvcmUoc3RvcmUsIG9iaikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUucHV0KG9iaiwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIsIFN0b3JlLCBGdW5jdGlvbik7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBzdG9yZTtcbiAgICBzdG9yZS5nZXQoZmlsdGVyLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgc2VuZChtZXNzYWdlLCBkZWxheSwgZW50aXRpZXMpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLnNpbSwgdGhpcy50aW1lKCksIHRoaXMudGltZSgpICsgZGVsYXkpO1xuXG4gICAgcm8uc291cmNlID0gdGhpcztcbiAgICByby5tc2cgPSBtZXNzYWdlO1xuICAgIHJvLmRhdGEgPSBlbnRpdGllcztcbiAgICByby5kZWxpdmVyID0gdGhpcy5zaW0uc2VuZE1lc3NhZ2U7XG5cbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCB7IFNpbSwgRmFjaWxpdHksIEJ1ZmZlciwgU3RvcmUsIEV2ZW50LCBFbnRpdHksIGFyZ0NoZWNrIH07XG4iLCJpbXBvcnQgeyBhcmdDaGVjayB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgRGF0YVNlcmllcyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuQ291bnQgPSAwO1xuICAgIHRoaXMuVyA9IDAuMDtcbiAgICB0aGlzLkEgPSAwLjA7XG4gICAgdGhpcy5RID0gMC4wO1xuICAgIHRoaXMuTWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuTWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5TdW0gPSAwO1xuXG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAzLCAzKTtcblxuICAgIHRoaXMuaExvd2VyID0gbG93ZXI7XG4gICAgdGhpcy5oVXBwZXIgPSB1cHBlcjtcbiAgICB0aGlzLmhCdWNrZXRTaXplID0gKHVwcGVyIC0gbG93ZXIpIC8gbmJ1Y2tldHM7XG4gICAgdGhpcy5oaXN0b2dyYW0gPSBuZXcgQXJyYXkobmJ1Y2tldHMgKyAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9ncmFtO1xuICB9XG5cbiAgcmVjb3JkKHZhbHVlLCB3ZWlnaHQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgY29uc3QgdyA9ICh0eXBlb2Ygd2VpZ2h0ID09PSAndW5kZWZpbmVkJykgPyAxIDogd2VpZ2h0O1xuXG4gICAgICAgIC8vIGRvY3VtZW50LndyaXRlKFwiRGF0YSBzZXJpZXMgcmVjb3JkaW5nIFwiICsgdmFsdWUgKyBcIiAod2VpZ2h0ID0gXCIgKyB3ICsgXCIpXFxuXCIpO1xuXG4gICAgaWYgKHZhbHVlID4gdGhpcy5NYXgpIHRoaXMuTWF4ID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5NaW4pIHRoaXMuTWluID0gdmFsdWU7XG4gICAgdGhpcy5TdW0gKz0gdmFsdWU7XG4gICAgdGhpcy5Db3VudCArKztcbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgIGlmICh2YWx1ZSA8IHRoaXMuaExvd2VyKSB7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtWzBdICs9IHc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5oVXBwZXIpIHtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1bdGhpcy5oaXN0b2dyYW0ubGVuZ3RoIC0gMV0gKz0gdztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigodmFsdWUgLSB0aGlzLmhMb3dlcikgLyB0aGlzLmhCdWNrZXRTaXplKSArIDE7XG5cbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baW5kZXhdICs9IHc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgICAgIC8vIFdpID0gV2ktMSArIHdpXG4gICAgdGhpcy5XID0gdGhpcy5XICsgdztcblxuICAgIGlmICh0aGlzLlcgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAgICAgLy8gQWkgPSBBaS0xICsgd2kvV2kgKiAoeGkgLSBBaS0xKVxuICAgIGNvbnN0IGxhc3RBID0gdGhpcy5BO1xuXG4gICAgdGhpcy5BID0gbGFzdEEgKyAodyAvIHRoaXMuVykgKiAodmFsdWUgLSBsYXN0QSk7XG5cbiAgICAgICAgLy8gUWkgPSBRaS0xICsgd2koeGkgLSBBaS0xKSh4aSAtIEFpKVxuICAgIHRoaXMuUSA9IHRoaXMuUSArIHcgKiAodmFsdWUgLSBsYXN0QSkgKiAodmFsdWUgLSB0aGlzLkEpO1xuICAgICAgICAvLyBwcmludChcIlxcdFc9XCIgKyB0aGlzLlcgKyBcIiBBPVwiICsgdGhpcy5BICsgXCIgUT1cIiArIHRoaXMuUSArIFwiXFxuXCIpO1xuICB9XG5cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuQ291bnQ7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuTWluO1xuICB9XG5cbiAgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLk1heDtcbiAgfVxuXG4gIHJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLk1heCAtIHRoaXMuTWluO1xuICB9XG5cbiAgc3VtKCkge1xuICAgIHJldHVybiB0aGlzLlN1bTtcbiAgfVxuXG4gIHN1bVdlaWdodGVkKCkge1xuICAgIHJldHVybiB0aGlzLkEgKiB0aGlzLlc7XG4gIH1cblxuICBhdmVyYWdlKCkge1xuICAgIHJldHVybiB0aGlzLkE7XG4gIH1cblxuICB2YXJpYW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5RIC8gdGhpcy5XO1xuICB9XG5cbiAgZGV2aWF0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy52YXJpYW5jZSgpKTtcbiAgfVxufVxuXG5jbGFzcyBUaW1lU2VyaWVzIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuZGF0YVNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKG5hbWUpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kYXRhU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5sYXN0VmFsdWUgPSBOYU47XG4gICAgdGhpcy5sYXN0VGltZXN0YW1wID0gTmFOO1xuICB9XG5cbiAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDMsIDMpO1xuICAgIHRoaXMuZGF0YVNlcmllcy5zZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cyk7XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcbiAgfVxuXG4gIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICghaXNOYU4odGhpcy5sYXN0VGltZXN0YW1wKSkge1xuICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlY29yZCh0aGlzLmxhc3RWYWx1ZSwgdGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnJlY29yZChOYU4sIHRpbWVzdGFtcCk7XG4gIH1cblxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmNvdW50KCk7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5taW4oKTtcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1heCgpO1xuICB9XG5cbiAgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5yYW5nZSgpO1xuICB9XG5cbiAgc3VtKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuc3VtKCk7XG4gIH1cblxuICBhdmVyYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuYXZlcmFnZSgpO1xuICB9XG5cbiAgZGV2aWF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZGV2aWF0aW9uKCk7XG4gIH1cblxuICB2YXJpYW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnZhcmlhbmNlKCk7XG4gIH1cbn1cblxuY2xhc3MgUG9wdWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gICAgdGhpcy5zaXplU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoKTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzID0gbmV3IERhdGFTZXJpZXMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2l6ZVNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICB9XG5cbiAgZW50ZXIodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiArKztcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGxlYXZlKGFycml2YWxBdCwgbGVmdEF0KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiAtLTtcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgbGVmdEF0KTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlY29yZChsZWZ0QXQgLSBhcnJpdmFsQXQpO1xuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0aW9uO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgdGhpcy5zaXplU2VyaWVzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuIiwiaW1wb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSwgYXJnQ2hlY2sgfSBmcm9tICcuL2xpYi9zaW0uanMnO1xuaW1wb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9IGZyb20gJy4vbGliL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL2xpYi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL2xpYi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi9saWIvcmFuZG9tLmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9saWIvbW9kZWwuanMnO1xuXG5leHBvcnQgeyBTaW0sIEVudGl0eSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlIH07XG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XG5leHBvcnQgeyBSZXF1ZXN0IH07XG5leHBvcnQgeyBQUXVldWUsIFF1ZXVlLCBhcmdDaGVjayB9O1xuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgeyBNb2RlbCB9O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LlNpbSA9IHtcbiAgICBhcmdDaGVjazogYXJnQ2hlY2ssXG4gICAgQnVmZmVyOiBCdWZmZXIsXG4gICAgRGF0YVNlcmllczogRGF0YVNlcmllcyxcbiAgICBFbnRpdHk6IEVudGl0eSxcbiAgICBFdmVudDogRXZlbnQsXG4gICAgRmFjaWxpdHk6IEZhY2lsaXR5LFxuICAgIE1vZGVsOiBNb2RlbCxcbiAgICBQUXVldWU6IFBRdWV1ZSxcbiAgICBQb3B1bGF0aW9uOiBQb3B1bGF0aW9uLFxuICAgIFF1ZXVlOiBRdWV1ZSxcbiAgICBSYW5kb206IFJhbmRvbSxcbiAgICBSZXF1ZXN0OiBSZXF1ZXN0LFxuICAgIFNpbTogU2ltLFxuICAgIFN0b3JlOiBTdG9yZSxcbiAgICBUaW1lU2VyaWVzOiBUaW1lU2VyaWVzXG4gIH07XG59XG4iXX0=
