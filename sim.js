(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.simjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, (Queue.__proto__ || Object.getPrototypeOf(Queue)).call(this, name));

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

    var _this2 = _possibleConstructorReturn(this, (PQueue.__proto__ || Object.getPrototypeOf(PQueue)).call(this, name));

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
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date().getTime();

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
    this.deliveryPending = false;
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

      // Prevent cancellation if request is about to be delivered at this
      // instant. Covers case where in a buffer or store, object has already
      // been dequeued and delivery was scheduled for now, but waitUntil
      // times out at the same time, making the request get cancelled after
      // the object is dequeued but before it is delivered.
      if (this.deliveryPending) return;

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
      // Prevent delivery of child requests if main request is about to be
      // delivered at this instant. See comment in cancel above
      if (this.group && this.group[0].deliveryPending && this.group[0] !== this) return;

      this.deliveryPending = false;
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
    this.events = 0;
    this.endTime = 0;
    this.maxEvents = 0;
    this.entities = [];
    this.entitiesByName = {};
    this.queue = new _queues.PQueue();
    this.endTime = 0;
    this.entityId = 1;
    this.paused = 0;
    this.running = false;
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
      if (typeof name === 'string' && typeof this.entitiesByName[name] !== 'undefined') {
        throw new Error('Entity name ' + name + ' already exists');
      }

      var entity = new Klass(this, name);

      this.entities.push(entity);
      if (typeof name === 'string') {
        this.entitiesByName[name] = entity;
      }

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
      this.events = 0;
      this.maxEvents = maxEvents;
      this.endTime = endTime;
      this.running = true;
      this.pause();
      return this.resume();
    }
  }, {
    key: 'pause',
    value: function pause() {
      ++this.paused;
    }
  }, {
    key: 'resume',
    value: function resume() {
      if (this.paused > 0) {
        --this.paused;
      }
      if (this.paused <= 0 && this.running) {
        while (true) {
          // eslint-disable-line no-constant-condition
          this.events++;
          if (this.events > this.maxEvents) return false;

          // Get the earliest event
          var ro = this.queue.remove();

          // If there are no more events, we are done with simulation here.
          if (ro === null) break;

          // Uh oh.. we are out of time now
          if (ro.deliverAt > this.endTime) break;

          // Advance simulation time
          this.simTime = ro.deliverAt;

          // If this event is already cancelled, ignore
          if (ro.cancelled) continue;

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

    var _this = _possibleConstructorReturn(this, (Facility.__proto__ || Object.getPrototypeOf(Facility)).call(this, name));

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

    var _this2 = _possibleConstructorReturn(this, (Buffer.__proto__ || Object.getPrototypeOf(Buffer)).call(this, name));

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
        ro.deliveryPending = true;
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
        ro.deliveryPending = true;
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
          obj.deliveryPending = true;
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
          obj.deliveryPending = true;
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
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Store);

    argCheck(arguments, 1, 2);

    var _this3 = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this, name));

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
  }, {
    key: 'put',
    value: function put(obj, ro) {
      argCheck(arguments, 2, 2);

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
            ro.deliveryPending = true;
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
          ro.deliveryPending = true;
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

    var _this4 = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this, name));

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

    var _this5 = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this, name));

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

},{"./lib/model.js":1,"./lib/queues.js":2,"./lib/random.js":3,"./lib/request.js":4,"./lib/sim.js":5,"./lib/stats.js":6}]},{},[7])(7)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsOEdBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLElBQUksaUJBQUosRUFBYjtBQUpnQjtBQUtqQjs7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQVEsS0FBSyxJQUFMLENBQVUsTUFBWCxHQUFxQixLQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQTdCLENBQXJCLEdBQXVE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LEdBQVAsR0FBYTtBQUNYLGNBQVUsYUFEQztBQUVYLFlBQVEsV0FGRztBQUdYLGdCQUFZLGlCQUhEO0FBSVgsWUFBUSxXQUpHO0FBS1gsV0FBTyxVQUxJO0FBTVgsY0FBVSxhQU5DO0FBT1gsV0FBTyxZQVBJO0FBUVgsWUFBUSxjQVJHO0FBU1gsZ0JBQVksaUJBVEQ7QUFVWCxXQUFPLGFBVkk7QUFXWCxZQUFRLGNBWEc7QUFZWCxhQUFTLGdCQVpFO0FBYVgsU0FBSyxRQWJNO0FBY1gsV0FBTyxVQWRJO0FBZVgsZ0JBQVk7QUFmRCxHQUFiO0FBaUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLl9uZXh0SWQoKTtcclxuICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAke3RoaXMuaWR9YDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgdG90YWxJbnN0YW5jZXMoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuX3RvdGFsSW5zdGFuY2VzID8gMCA6IHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIF9uZXh0SWQoKSB7XHJcbiAgICB0aGlzLl90b3RhbEluc3RhbmNlcyA9IHRoaXMudG90YWxJbnN0YW5jZXMgKyAxO1xyXG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgTW9kZWwgfTtcclxuZXhwb3J0IGRlZmF1bHQgTW9kZWw7XHJcbiIsImltcG9ydCB7IGFyZ0NoZWNrIH0gZnJvbSAnLi9zaW0uanMnO1xyXG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XHJcblxyXG5jbGFzcyBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICBzdXBlcihuYW1lKTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcclxuICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgdG9wKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcclxuICB9XHJcblxyXG4gIGJhY2soKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuZGF0YS5sZW5ndGgpID8gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXSA6IG51bGw7XHJcbiAgfVxyXG5cclxuICBwdXNoKHZhbHVlLCB0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcbiAgICB0aGlzLmRhdGEucHVzaCh2YWx1ZSk7XHJcbiAgICB0aGlzLnRpbWVzdGFtcC5wdXNoKHRpbWVzdGFtcCk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgdW5zaGlmdCh2YWx1ZSwgdGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG4gICAgdGhpcy5kYXRhLnVuc2hpZnQodmFsdWUpO1xyXG4gICAgdGhpcy50aW1lc3RhbXAudW5zaGlmdCh0aW1lc3RhbXApO1xyXG5cclxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcclxuICB9XHJcblxyXG4gIHNoaWZ0KHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5zaGlmdCgpO1xyXG5cclxuICAgIGNvbnN0IGVucXVldWVkQXQgPSB0aGlzLnRpbWVzdGFtcC5zaGlmdCgpO1xyXG5cclxuICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHBvcCh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGEucG9wKCk7XHJcblxyXG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnBvcCgpO1xyXG5cclxuICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHBhc3NieSh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xyXG4gICAgdGhpcy5zdGF0cy5sZWF2ZSh0aW1lc3RhbXAsIHRpbWVzdGFtcCk7XHJcbiAgfVxyXG5cclxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcclxuICB9XHJcblxyXG4gIHJlcG9ydCgpIHtcclxuICAgIHJldHVybiBbdGhpcy5zdGF0cy5zaXplU2VyaWVzLmF2ZXJhZ2UoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHMuZHVyYXRpb25TZXJpZXMuYXZlcmFnZSgpXTtcclxuICB9XHJcblxyXG4gIGVtcHR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPT09IDA7XHJcbiAgfVxyXG5cclxuICBzaXplKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQUXVldWUgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIHRoaXMub3JkZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgZ3JlYXRlcihybzEsIHJvMikge1xyXG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPiBybzIuZGVsaXZlckF0KSByZXR1cm4gdHJ1ZTtcclxuICAgIGlmIChybzEuZGVsaXZlckF0ID09PSBybzIuZGVsaXZlckF0KSByZXR1cm4gcm8xLm9yZGVyID4gcm8yLm9yZGVyO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0KHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG4gICAgcm8ub3JkZXIgPSB0aGlzLm9yZGVyICsrO1xyXG5cclxuICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgdGhpcy5kYXRhLnB1c2gocm8pO1xyXG5cclxuICAgICAgICAvLyBpbnNlcnQgaW50byBkYXRhIGF0IHRoZSBlbmRcclxuICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xyXG5cclxuICAgICAgICAvLyBoZWFwIHVwXHJcbiAgICB3aGlsZSAoaW5kZXggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoaW5kZXggLSAxKSAvIDIpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3BhcmVudEluZGV4XSwgcm8pKSB7XHJcbiAgICAgICAgYVtpbmRleF0gPSBhW3BhcmVudEluZGV4XTtcclxuICAgICAgICBpbmRleCA9IHBhcmVudEluZGV4O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBhW2luZGV4XSA9IG5vZGU7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgIGxldCBsZW4gPSBhLmxlbmd0aDtcclxuXHJcbiAgICBpZiAobGVuIDw9IDApIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAobGVuID09PSAxKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRhdGEucG9wKCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0b3AgPSBhWzBdO1xyXG5cclxuICAgICAgICAvLyBtb3ZlIHRoZSBsYXN0IG5vZGUgdXBcclxuICAgIGFbMF0gPSBhLnBvcCgpO1xyXG4gICAgbGVuLS07XHJcblxyXG4gICAgICAgIC8vIGhlYXAgZG93blxyXG4gICAgbGV0IGluZGV4ID0gMDtcclxuXHJcbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XHJcblxyXG4gICAgd2hpbGUgKGluZGV4IDwgTWF0aC5mbG9vcihsZW4gLyAyKSkge1xyXG4gICAgICBjb25zdCBsZWZ0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDE7XHJcblxyXG4gICAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAyICogaW5kZXggKyAyO1xyXG5cclxuICAgICAgY29uc3Qgc21hbGxlckNoaWxkSW5kZXggPSByaWdodENoaWxkSW5kZXggPCBsZW5cclxuICAgICAgICAgICAgICAmJiAhdGhpcy5ncmVhdGVyKGFbcmlnaHRDaGlsZEluZGV4XSwgYVtsZWZ0Q2hpbGRJbmRleF0pXHJcbiAgICAgICAgICAgICAgICAgICAgPyByaWdodENoaWxkSW5kZXggOiBsZWZ0Q2hpbGRJbmRleDtcclxuXHJcbiAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtzbWFsbGVyQ2hpbGRJbmRleF0sIG5vZGUpKSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFbaW5kZXhdID0gYVtzbWFsbGVyQ2hpbGRJbmRleF07XHJcbiAgICAgIGluZGV4ID0gc21hbGxlckNoaWxkSW5kZXg7XHJcbiAgICB9XHJcbiAgICBhW2luZGV4XSA9IG5vZGU7XHJcbiAgICByZXR1cm4gdG9wO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgUXVldWUsIFBRdWV1ZSB9O1xyXG4iLCJcclxuY2xhc3MgUmFuZG9tIHtcclxuICBjb25zdHJ1Y3RvcihzZWVkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkge1xyXG4gICAgaWYgKHR5cGVvZiAoc2VlZCkgIT09ICdudW1iZXInICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgICAgICAgICB8fCBNYXRoLmNlaWwoc2VlZCkgIT09IE1hdGguZmxvb3Ioc2VlZCkpIHsgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2VlZCB2YWx1ZSBtdXN0IGJlIGFuIGludGVnZXInKTsgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG5cclxuXHJcbiAgICAgICAgLyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cclxuICAgIHRoaXMuTiA9IDYyNDtcclxuICAgIHRoaXMuTSA9IDM5NztcclxuICAgIHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOy8qIGNvbnN0YW50IHZlY3RvciBhICovXHJcbiAgICB0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOy8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cclxuICAgIHRoaXMuTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7LyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXHJcblxyXG4gICAgdGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOy8qIHRoZSBhcnJheSBmb3IgdGhlIHN0YXRlIHZlY3RvciAqL1xyXG4gICAgdGhpcy5tdGkgPSB0aGlzLk4gKyAxOy8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xyXG5cclxuICAgICAgICAvLyB0aGlzLmluaXRHZW5yYW5kKHNlZWQpO1xyXG4gICAgdGhpcy5pbml0QnlBcnJheShbc2VlZF0sIDEpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEdlbnJhbmQocykge1xyXG4gICAgdGhpcy5tdFswXSA9IHMgPj4+IDA7XHJcbiAgICBmb3IgKHRoaXMubXRpID0gMTsgdGhpcy5tdGkgPCB0aGlzLk47IHRoaXMubXRpKyspIHtcclxuICAgICAgcyA9IHRoaXMubXRbdGhpcy5tdGkgLSAxXSBeICh0aGlzLm10W3RoaXMubXRpIC0gMV0gPj4+IDMwKTtcclxuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXHJcbiAgICAgICAgICAgICsgdGhpcy5tdGk7XHJcblxyXG4gICAgICAvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cclxuICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXHJcbiAgICAgIC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cclxuICAgICAgLyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cclxuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdEJ5QXJyYXkoaW5pdEtleSwga2V5TGVuZ3RoKSB7XHJcbiAgICBsZXQgaSwgaiwgaztcclxuXHJcbiAgICB0aGlzLmluaXRHZW5yYW5kKDE5NjUwMjE4KTtcclxuICAgIGkgPSAxOyBqID0gMDtcclxuICAgIGsgPSAodGhpcy5OID4ga2V5TGVuZ3RoID8gdGhpcy5OIDoga2V5TGVuZ3RoKTtcclxuICAgIGZvciAoOyBrOyBrLS0pIHtcclxuICAgICAgY29uc3QgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XHJcblxyXG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXHJcbiAgICAgICAgICAgICsgaW5pdEtleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cclxuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXHJcbiAgICAgIGkrKzsgaisrO1xyXG4gICAgICBpZiAoaSA+PSB0aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OIC0gMV07IGkgPSAxOyB9XHJcbiAgICAgIGlmIChqID49IGtleUxlbmd0aCkgaiA9IDA7XHJcbiAgICB9XHJcbiAgICBmb3IgKGsgPSB0aGlzLk4gLSAxOyBrOyBrLS0pIHtcclxuICAgICAgY29uc3QgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XHJcblxyXG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxyXG4gICAgICAgICAgICAtIGk7IC8qIG5vbiBsaW5lYXIgKi9cclxuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXHJcbiAgICAgIGkrKztcclxuICAgICAgaWYgKGkgPj0gdGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTiAtIDFdOyBpID0gMTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xyXG4gIH1cclxuXHJcbiAgZ2VucmFuZEludDMyKCkge1xyXG4gICAgbGV0IHk7XHJcblxyXG4gICAgY29uc3QgbWFnMDEgPSBbMHgwLCB0aGlzLk1BVFJJWF9BXTtcclxuXHJcbiAgICAgICAgLy8gIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDFcclxuXHJcbiAgICBpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7ICAvLyBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lXHJcbiAgICAgIGxldCBraztcclxuXHJcbiAgICAgIGlmICh0aGlzLm10aSA9PT0gdGhpcy5OICsgMSkgeyAgLy8gaWYgaW5pdEdlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLFxyXG4gICAgICAgIHRoaXMuaW5pdEdlbnJhbmQoNTQ4OSk7IC8vIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGtrID0gMDsga2sgPCB0aGlzLk4gLSB0aGlzLk07IGtrKyspIHtcclxuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArIHRoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKDtrayA8IHRoaXMuTiAtIDE7IGtrKyspIHtcclxuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArICh0aGlzLk0gLSB0aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG4gICAgICB9XHJcbiAgICAgIHkgPSAodGhpcy5tdFt0aGlzLk4gLSAxXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFswXSAmIHRoaXMuTE9XRVJfTUFTSyk7XHJcbiAgICAgIHRoaXMubXRbdGhpcy5OIC0gMV0gPSB0aGlzLm10W3RoaXMuTSAtIDFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcblxyXG4gICAgICB0aGlzLm10aSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgeSA9IHRoaXMubXRbdGhpcy5tdGkrK107XHJcblxyXG4gICAgICAgIC8qIFRlbXBlcmluZyAqL1xyXG4gICAgeSBePSAoeSA+Pj4gMTEpO1xyXG4gICAgeSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XHJcbiAgICB5IF49ICh5IDw8IDE1KSAmIDB4ZWZjNjAwMDA7XHJcbiAgICB5IF49ICh5ID4+PiAxOCk7XHJcblxyXG4gICAgcmV0dXJuIHkgPj4+IDA7XHJcbiAgfVxyXG5cclxuICBnZW5yYW5kSW50MzEoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDEpO1xyXG4gIH1cclxuXHJcbiAgZ2VucmFuZFJlYWwxKCkge1xyXG4gICAgLy8gZGl2aWRlZCBieSAyXjMyLTFcclxuICAgIHJldHVybiB0aGlzLmdlbnJhbmRJbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTUuMCk7XHJcbiAgfVxyXG5cclxuICByYW5kb20oKSB7XHJcbiAgICBpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XHJcbiAgICAgIGlmICh0aGlzLnNraXApIHtcclxuICAgICAgICB0aGlzLmdlbnJhbmRJbnQzMigpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2tpcCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzJcclxuICAgIHJldHVybiB0aGlzLmdlbnJhbmRJbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTYuMCk7XHJcbiAgfVxyXG5cclxuICBnZW5yYW5kUmVhbDMoKSB7XHJcbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzJcclxuICAgIHJldHVybiAodGhpcy5nZW5yYW5kSW50MzIoKSArIDAuNSkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcclxuICB9XHJcblxyXG4gIGdlbnJhbmRSZXM1MygpIHtcclxuICAgIGNvbnN0IGEgPSB0aGlzLmdlbnJhbmRJbnQzMigpID4+PiA1O1xyXG4gICAgY29uc3QgYiA9IHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDY7XHJcblxyXG4gICAgcmV0dXJuIChhICogNjcxMDg4NjQuMCArIGIpICogKDEuMCAvIDkwMDcxOTkyNTQ3NDA5OTIuMCk7XHJcbiAgfVxyXG5cclxuICBleHBvbmVudGlhbChsYW1iZGEpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZXhwb25lbnRpYWwoKSBtdXN0ICBiZSBjYWxsZWQgd2l0aCBcXCdsYW1iZGFcXCcgcGFyYW1ldGVyJyk7IC8vIGFyZ0NoZWNrXHJcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuXHJcbiAgICBjb25zdCByID0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICByZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xyXG4gIH1cclxuXHJcbiAgZ2FtbWEoYWxwaGEsIGJldGEpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZ2FtbWEoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG5cclxuICAgICAgICAvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cclxuICAgICAgICAgKi9cclxuXHJcbiAgICBsZXQgdTtcclxuXHJcbiAgICBpZiAoYWxwaGEgPiAxLjApIHtcclxuICAgICAgY29uc3QgYWludiA9IE1hdGguc3FydCgyLjAgKiBhbHBoYSAtIDEuMCk7XHJcblxyXG4gICAgICBjb25zdCBiYmIgPSBhbHBoYSAtIHRoaXMuTE9HNDtcclxuXHJcbiAgICAgIGNvbnN0IGNjYyA9IGFscGhhICsgYWludjtcclxuXHJcbiAgICAgIHdoaWxlICh0cnVlKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxyXG4gICAgICAgIGNvbnN0IHUxID0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgaWYgKCh1MSA8IDFlLTcpIHx8ICh1ID4gMC45OTk5OTk5KSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHUyID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgY29uc3QgdiA9IE1hdGgubG9nKHUxIC8gKDEuMCAtIHUxKSkgLyBhaW52O1xyXG5cclxuICAgICAgICBjb25zdCB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcclxuXHJcbiAgICAgICAgY29uc3QgeiA9IHUxICogdTEgKiB1MjtcclxuXHJcbiAgICAgICAgY29uc3QgciA9IGJiYiArIGNjYyAqIHYgLSB4O1xyXG5cclxuICAgICAgICBpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XHJcbiAgICAgICAgICByZXR1cm4geCAqIGJldGE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFscGhhID09PSAxLjApIHtcclxuICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XHJcblxyXG4gICAgICB3aGlsZSAodSA8PSAxZS03KSB7XHJcbiAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIC1NYXRoLmxvZyh1KSAqIGJldGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgeDtcclxuXHJcbiAgICAgIHdoaWxlICh0cnVlKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxyXG4gICAgICAgIHUgPSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICBjb25zdCBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcclxuXHJcbiAgICAgICAgY29uc3QgcCA9IGIgKiB1O1xyXG5cclxuICAgICAgICBpZiAocCA8PSAxLjApIHtcclxuICAgICAgICAgIHggPSBNYXRoLnBvdyhwLCAxLjAgLyBhbHBoYSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ID0gLU1hdGgubG9nKChiIC0gcCkgLyBhbHBoYSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB1MSA9IHRoaXMucmFuZG9tKCk7XHJcblxyXG4gICAgICAgIGlmIChwID4gMS4wKSB7XHJcbiAgICAgICAgICBpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4geCAqIGJldGE7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgbm9ybWFsKG11LCBzaWdtYSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignbm9ybWFsKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBtdSBhbmQgc2lnbWEgcGFyYW1ldGVycycpOyAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcblxyXG4gICAgbGV0IHogPSB0aGlzLmxhc3ROb3JtYWw7XHJcblxyXG4gICAgdGhpcy5sYXN0Tm9ybWFsID0gTmFOO1xyXG4gICAgaWYgKCF6KSB7XHJcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcblxyXG4gICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XHJcblxyXG4gICAgICB6ID0gTWF0aC5jb3MoYSkgKiBiO1xyXG4gICAgICB0aGlzLmxhc3ROb3JtYWwgPSBNYXRoLnNpbihhKSAqIGI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbXUgKyB6ICogc2lnbWE7XHJcbiAgfVxyXG5cclxuICBwYXJldG8oYWxwaGEpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigncGFyZXRvKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBwYXJhbWV0ZXInKTsgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG5cclxuICAgIGNvbnN0IHUgPSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgIHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XHJcbiAgfVxyXG5cclxuICB0cmlhbmd1bGFyKGxvd2VyLCB1cHBlciwgbW9kZSkge1xyXG4gICAgICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJpYW5ndWxhcl9kaXN0cmlidXRpb25cclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndHJpYW5ndWxhcigpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIsIHVwcGVyIGFuZCBtb2RlIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG5cclxuICAgIGNvbnN0IGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcclxuXHJcbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICBpZiAodSA8PSBjKSB7XHJcbiAgICAgIHJldHVybiBsb3dlciArIE1hdGguc3FydCh1ICogKHVwcGVyIC0gbG93ZXIpICogKG1vZGUgLSBsb3dlcikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVwcGVyIC0gTWF0aC5zcXJ0KCgxIC0gdSkgKiAodXBwZXIgLSBsb3dlcikgKiAodXBwZXIgLSBtb2RlKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIEFsbCBmbG9hdHMgYmV0d2VlbiBsb3dlciBhbmQgdXBwZXIgYXJlIGVxdWFsbHkgbGlrZWx5LiBUaGlzIGlzIHRoZVxyXG4gICogdGhlb3JldGljYWwgZGlzdHJpYnV0aW9uIG1vZGVsIGZvciBhIGJhbGFuY2VkIGNvaW4sIGFuIHVuYmlhc2VkIGRpZSwgYVxyXG4gICogY2FzaW5vIHJvdWxldHRlLCBvciB0aGUgZmlyc3QgY2FyZCBvZiBhIHdlbGwtc2h1ZmZsZWQgZGVjay5cclxuICAqXHJcbiAgKiBAcGFyYW0ge051bWJlcn0gbG93ZXJcclxuICAqIEBwYXJhbSB7TnVtYmVyfSB1cHBlclxyXG4gICogQHJldHVybnMge051bWJlcn1cclxuICAqL1xyXG4gIHVuaWZvcm0obG93ZXIsIHVwcGVyKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3VuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzJyk7ICAgIC8vIGFyZ0NoZWNrXHJcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgIHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XHJcbiAgfVxyXG5cclxuICB3ZWlidWxsKGFscGhhLCBiZXRhKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3dlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgY29uc3QgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XHJcblxyXG4gICAgcmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcclxuICB9XHJcbn1cclxuXHJcbi8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXHJcblxyXG5cclxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuUmFuZG9tLnByb3RvdHlwZS5MT0c0ID0gTWF0aC5sb2coNC4wKTtcclxuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcclxuXHJcbmV4cG9ydCB7IFJhbmRvbSB9O1xyXG5leHBvcnQgZGVmYXVsdCBSYW5kb207XHJcbiIsImltcG9ydCB7IGFyZ0NoZWNrLCBTdG9yZSwgQnVmZmVyLCBFdmVudCB9IGZyb20gJy4vc2ltLmpzJztcclxuXHJcbmNsYXNzIFJlcXVlc3Qge1xyXG4gIGNvbnN0cnVjdG9yKGVudGl0eSwgY3VycmVudFRpbWUsIGRlbGl2ZXJBdCkge1xyXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XHJcbiAgICB0aGlzLnNjaGVkdWxlZEF0ID0gY3VycmVudFRpbWU7XHJcbiAgICB0aGlzLmRlbGl2ZXJBdCA9IGRlbGl2ZXJBdDtcclxuICAgIHRoaXMuZGVsaXZlcnlQZW5kaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xyXG4gICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuZ3JvdXAgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsKCkge1xyXG4gICAgICAgIC8vIEFzayB0aGUgbWFpbiByZXF1ZXN0IHRvIGhhbmRsZSBjYW5jZWxsYXRpb25cclxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBbMF0uY2FuY2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIC0tPiB0aGlzIGlzIG1haW4gcmVxdWVzdFxyXG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICAvLyBpZiBhbHJlYWR5IGNhbmNlbGxlZCwgZG8gbm90aGluZ1xyXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFByZXZlbnQgY2FuY2VsbGF0aW9uIGlmIHJlcXVlc3QgaXMgYWJvdXQgdG8gYmUgZGVsaXZlcmVkIGF0IHRoaXNcclxuICAgICAgICAvLyBpbnN0YW50LiBDb3ZlcnMgY2FzZSB3aGVyZSBpbiBhIGJ1ZmZlciBvciBzdG9yZSwgb2JqZWN0IGhhcyBhbHJlYWR5XHJcbiAgICAgICAgLy8gYmVlbiBkZXF1ZXVlZCBhbmQgZGVsaXZlcnkgd2FzIHNjaGVkdWxlZCBmb3Igbm93LCBidXQgd2FpdFVudGlsXHJcbiAgICAgICAgLy8gdGltZXMgb3V0IGF0IHRoZSBzYW1lIHRpbWUsIG1ha2luZyB0aGUgcmVxdWVzdCBnZXQgY2FuY2VsbGVkIGFmdGVyXHJcbiAgICAgICAgLy8gdGhlIG9iamVjdCBpcyBkZXF1ZXVlZCBidXQgYmVmb3JlIGl0IGlzIGRlbGl2ZXJlZC5cclxuICAgIGlmICh0aGlzLmRlbGl2ZXJ5UGVuZGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBzZXQgZmxhZ1xyXG4gICAgdGhpcy5jYW5jZWxsZWQgPSB0cnVlO1xyXG5cclxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcclxuICAgICAgaWYgKCh0aGlzLnNvdXJjZSBpbnN0YW5jZW9mIEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc1B1dFF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmdyb3VwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgdGhpcy5ncm91cFtpXS5jYW5jZWxsZWQgPSB0cnVlO1xyXG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcclxuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9uZShjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMCwgMywgRnVuY3Rpb24sIE9iamVjdCk7XHJcblxyXG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHdhaXRVbnRpbChkZWxheSwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDQsIG51bGwsIEZ1bmN0aW9uLCBPYmplY3QpO1xyXG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdChcclxuICAgICAgdGhpcy5zY2hlZHVsZWRBdCArIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xyXG5cclxuICAgIHRoaXMuZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDQsIG51bGwsIEZ1bmN0aW9uLCBPYmplY3QpO1xyXG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xyXG5cclxuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xyXG5cclxuICAgICAgcm8ubXNnID0gZXZlbnQ7XHJcbiAgICAgIGV2ZW50LmFkZFdhaXRMaXN0KHJvKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBjb25zdCBybyA9IHRoaXMuX2FkZFJlcXVlc3QoMCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KTtcclxuXHJcbiAgICAgICAgcm8ubXNnID0gZXZlbnRbaV07XHJcbiAgICAgICAgZXZlbnRbaV0uYWRkV2FpdExpc3Qocm8pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGRlbGl2ZXIoKSB7XHJcbiAgICAgICAgLy8gUHJldmVudCBkZWxpdmVyeSBvZiBjaGlsZCByZXF1ZXN0cyBpZiBtYWluIHJlcXVlc3QgaXMgYWJvdXQgdG8gYmVcclxuICAgICAgICAvLyBkZWxpdmVyZWQgYXQgdGhpcyBpbnN0YW50LiBTZWUgY29tbWVudCBpbiBjYW5jZWwgYWJvdmVcclxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0uZGVsaXZlcnlQZW5kaW5nICYmIHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmRlbGl2ZXJ5UGVuZGluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XHJcbiAgICB0aGlzLmNhbmNlbCgpO1xyXG4gICAgaWYgKCF0aGlzLmNhbGxiYWNrcykgcmV0dXJuO1xyXG5cclxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuZ3JvdXBbMF0uc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBbMF0uZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2FuY2VsUmVuZWdlQ2xhdXNlcygpIHtcclxuICAgICAgICAvLyB0aGlzLmNhbmNlbCA9IHRoaXMuTnVsbDtcclxuICAgICAgICAvLyB0aGlzLndhaXRVbnRpbCA9IHRoaXMuTnVsbDtcclxuICAgICAgICAvLyB0aGlzLnVubGVzc0V2ZW50ID0gdGhpcy5OdWxsO1xyXG4gICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XHJcblxyXG4gICAgaWYgKCF0aGlzLmdyb3VwIHx8IHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgdGhpcy5ncm91cFtpXS5jYW5jZWxsZWQgPSB0cnVlO1xyXG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcclxuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgTnVsbCgpIHtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXQsXHJcbiAgICAgICAgICAgICAgICBkZWxpdmVyQXQpO1xyXG5cclxuICAgIHJvLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcclxuXHJcbiAgICBpZiAodGhpcy5ncm91cCA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmdyb3VwID0gW3RoaXNdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ3JvdXAucHVzaChybyk7XHJcbiAgICByby5ncm91cCA9IHRoaXMuZ3JvdXA7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICBfZG9DYWxsYmFjayhzb3VyY2UsIG1zZywgZGF0YSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcclxuXHJcbiAgICAgIGlmICghY2FsbGJhY2spIGNvbnRpbnVlO1xyXG5cclxuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLmNhbGxiYWNrc1tpXVsxXTtcclxuXHJcbiAgICAgIGlmICghY29udGV4dCkgY29udGV4dCA9IHRoaXMuZW50aXR5O1xyXG5cclxuICAgICAgY29uc3QgYXJndW1lbnQgPSB0aGlzLmNhbGxiYWNrc1tpXVsyXTtcclxuXHJcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbXNnO1xyXG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICBpZiAoIWFyZ3VtZW50KSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJndW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJndW1lbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gbnVsbDtcclxuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBudWxsO1xyXG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBSZXF1ZXN0IH07XHJcbiIsImltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL3F1ZXVlcy5qcyc7XHJcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcclxuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdC5qcyc7XHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XHJcblxyXG5mdW5jdGlvbiBhcmdDaGVjayhmb3VuZCwgZXhwTWluLCBleHBNYXgpIHtcclxuICBpZiAoZm91bmQubGVuZ3RoIDwgZXhwTWluIHx8IGZvdW5kLmxlbmd0aCA+IGV4cE1heCkgeyAgIC8vIGFyZ0NoZWNrXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzJyk7ICAgLy8gYXJnQ2hlY2tcclxuICB9ICAgLy8gYXJnQ2hlY2tcclxuXHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZm91bmQubGVuZ3RoOyBpKyspIHsgICAvLyBhcmdDaGVja1xyXG5cclxuICAgIGlmICghYXJndW1lbnRzW2kgKyAzXSB8fCAhZm91bmRbaV0pIGNvbnRpbnVlOyAgIC8vIGFyZ0NoZWNrXHJcblxyXG4vLyAgICBwcmludChcIlRFU1QgXCIgKyBmb3VuZFtpXSArIFwiIFwiICsgYXJndW1lbnRzW2kgKyAzXSAgIC8vIGFyZ0NoZWNrXHJcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBFdmVudCkgICAvLyBhcmdDaGVja1xyXG4vLyAgICArIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkgICAvLyBhcmdDaGVja1xyXG4vLyAgICArIFwiXFxuXCIpOyAgIC8vIEFSRyBDSEVDS1xyXG5cclxuXHJcbiAgICBpZiAoIShmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pKSB7ICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAvLyBhcmdDaGVja1xyXG4gIH0gICAvLyBhcmdDaGVja1xyXG59ICAgLy8gYXJnQ2hlY2tcclxuXHJcbmNsYXNzIFNpbSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNpbVRpbWUgPSAwO1xyXG4gICAgdGhpcy5ldmVudHMgPSAwO1xyXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcclxuICAgIHRoaXMubWF4RXZlbnRzID0gMDtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcclxuICAgIHRoaXMuZW50aXRpZXNCeU5hbWUgPSB7fTtcclxuICAgIHRoaXMucXVldWUgPSBuZXcgUFF1ZXVlKCk7XHJcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xyXG4gICAgdGhpcy5lbnRpdHlJZCA9IDE7XHJcbiAgICB0aGlzLnBhdXNlZCA9IDA7XHJcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRpbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zaW1UaW1lO1xyXG4gIH1cclxuXHJcbiAgc2VuZE1lc3NhZ2UoKSB7XHJcbiAgICBjb25zdCBzZW5kZXIgPSB0aGlzLnNvdXJjZTtcclxuXHJcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tc2c7XHJcblxyXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgY29uc3Qgc2ltID0gc2VuZGVyLnNpbTtcclxuXHJcbiAgICBpZiAoIWVudGl0aWVzKSB7XHJcbiAgICAgICAgICAgIC8vIHNlbmQgdG8gYWxsIGVudGl0aWVzXHJcbiAgICAgIGZvciAobGV0IGkgPSBzaW0uZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBzaW0uZW50aXRpZXNbaV07XHJcblxyXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XHJcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbnRpdGllcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBlbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xyXG5cclxuICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xyXG4gICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZW50aXRpZXMub25NZXNzYWdlKSB7XHJcbiAgICAgIGVudGl0aWVzLm9uTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkRW50aXR5KEtsYXNzLCBuYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgcHJvdG90eXBlIGhhcyBzdGFydCBmdW5jdGlvblxyXG4gICAgaWYgKCFLbGFzcy5wcm90b3R5cGUuc3RhcnQpIHsgIC8vIEFSRyBDSEVDS1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSBjbGFzcyAke0tsYXNzLm5hbWV9IG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRgKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHRoaXMuZW50aXRpZXNCeU5hbWVbbmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IG5hbWUgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2ApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVudGl0eSA9IG5ldyBLbGFzcyh0aGlzLCBuYW1lKTtcclxuXHJcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcclxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5lbnRpdGllc0J5TmFtZVtuYW1lXSA9IGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBlbnRpdHkuc3RhcnQoLi4uYXJncyk7XHJcblxyXG4gICAgcmV0dXJuIGVudGl0eTtcclxuICB9XHJcblxyXG4gIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xyXG4gICAgICAgIC8vIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMik7XHJcbiAgICBpZiAoIW1heEV2ZW50cykgeyBtYXhFdmVudHMgPSBNYXRoLkluZmluaXR5OyB9XHJcbiAgICB0aGlzLmV2ZW50cyA9IDA7XHJcbiAgICB0aGlzLm1heEV2ZW50cyA9IG1heEV2ZW50cztcclxuICAgIHRoaXMuZW5kVGltZSA9IGVuZFRpbWU7XHJcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XHJcbiAgfVxyXG5cclxuICBwYXVzZSgpIHtcclxuICAgICsrdGhpcy5wYXVzZWQ7XHJcbiAgfVxyXG5cclxuICByZXN1bWUoKSB7XHJcbiAgICBpZiAodGhpcy5wYXVzZWQgPiAwKSB7XHJcbiAgICAgIC0tdGhpcy5wYXVzZWQ7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5wYXVzZWQgPD0gMCAmJiB0aGlzLnJ1bm5pbmcpIHtcclxuICAgICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXHJcbiAgICAgICAgdGhpcy5ldmVudHMrKztcclxuICAgICAgICBpZiAodGhpcy5ldmVudHMgPiB0aGlzLm1heEV2ZW50cykgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAvLyBHZXQgdGhlIGVhcmxpZXN0IGV2ZW50XHJcbiAgICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBldmVudHMsIHdlIGFyZSBkb25lIHdpdGggc2ltdWxhdGlvbiBoZXJlLlxyXG4gICAgICAgIGlmIChybyA9PT0gbnVsbCkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFVoIG9oLi4gd2UgYXJlIG91dCBvZiB0aW1lIG5vd1xyXG4gICAgICAgIGlmIChyby5kZWxpdmVyQXQgPiB0aGlzLmVuZFRpbWUpIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAvLyBBZHZhbmNlIHNpbXVsYXRpb24gdGltZVxyXG4gICAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXHJcbiAgICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XHJcblxyXG4gICAgICAgIHJvLmRlbGl2ZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5maW5hbGl6ZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzdGVwKCkge1xyXG4gICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXHJcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGlmIChybyA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB0aGlzLnNpbVRpbWUgPSByby5kZWxpdmVyQXQ7XHJcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xyXG4gICAgICByby5kZWxpdmVyKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBmaW5hbGl6ZSgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcclxuICAgICAgICB0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExvZ2dlcihsb2dnZXIpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRnVuY3Rpb24pO1xyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgfVxyXG5cclxuICBsb2cobWVzc2FnZSwgZW50aXR5KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xyXG5cclxuICAgIGlmICghdGhpcy5sb2dnZXIpIHJldHVybjtcclxuICAgIGxldCBlbnRpdHlNc2cgPSAnJztcclxuXHJcbiAgICBpZiAodHlwZW9mIGVudGl0eSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgaWYgKGVudGl0eS5uYW1lKSB7XHJcbiAgICAgICAgZW50aXR5TXNnID0gYCBbJHtlbnRpdHkubmFtZX1dYDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5pZH1dIGA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMubG9nZ2VyKGAke3RoaXMuc2ltVGltZS50b0ZpeGVkKDYpfSR7ZW50aXR5TXNnfSAgICR7bWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEZhY2lsaXR5IGV4dGVuZHMgTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGRpc2NpcGxpbmUsIHNlcnZlcnMsIG1heHFsZW4pIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCA0KTtcclxuXHJcbiAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XHJcbiAgICB0aGlzLnNlcnZlcnMgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XHJcbiAgICB0aGlzLm1heHFsZW4gPSAodHlwZW9mIG1heHFsZW4gPT09ICd1bmRlZmluZWQnKSA/IC0xIDogMSAqIG1heHFsZW47XHJcblxyXG4gICAgc3dpdGNoIChkaXNjaXBsaW5lKSB7XHJcblxyXG4gICAgY2FzZSBGYWNpbGl0eS5MQ0ZTOlxyXG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlTENGUztcclxuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgRmFjaWxpdHkuUFM6XHJcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nO1xyXG4gICAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBGYWNpbGl0eS5GQ0ZTOlxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUZDRlM7XHJcbiAgICAgIHRoaXMuZnJlZVNlcnZlcnMgPSBuZXcgQXJyYXkodGhpcy5zZXJ2ZXJzKTtcclxuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgdGhpcy5mcmVlU2VydmVyc1tpXSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRzID0gbmV3IFBvcHVsYXRpb24oKTtcclxuICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xyXG4gICAgdGhpcy5zdGF0cy5yZXNldCgpO1xyXG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xyXG4gIH1cclxuXHJcbiAgc3lzdGVtU3RhdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcclxuICB9XHJcblxyXG4gIHF1ZXVlU3RhdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5zdGF0cztcclxuICB9XHJcblxyXG4gIHVzYWdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYnVzeUR1cmF0aW9uO1xyXG4gIH1cclxuXHJcbiAgZmluYWxpemUodGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcclxuICAgIHRoaXMucXVldWUuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcclxuICB9XHJcblxyXG4gIHVzZUZDRlMoZHVyYXRpb24sIHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG4gICAgaWYgKCh0aGlzLm1heHFsZW4gPT09IDAgJiYgIXRoaXMuZnJlZSlcclxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcclxuICAgICAgcm8ubXNnID0gLTE7XHJcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICBjb25zdCBub3cgPSByby5lbnRpdHkudGltZSgpO1xyXG5cclxuICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcclxuICAgIHRoaXMucXVldWUucHVzaChybywgbm93KTtcclxuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKG5vdyk7XHJcbiAgfVxyXG5cclxuICB1c2VGQ0ZTU2NoZWR1bGUodGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmZyZWUgPiAwICYmICF0aGlzLnF1ZXVlLmVtcHR5KCkpIHtcclxuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7XHJcblxyXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZyZWVTZXJ2ZXJzW2ldKSB7XHJcbiAgICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gZmFsc2U7XHJcbiAgICAgICAgICByby5tc2cgPSBpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZyZWUgLS07XHJcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IHJvLmR1cmF0aW9uO1xyXG5cclxuICAgICAgICAgICAgLy8gY2FuY2VsIGFsbCBvdGhlciByZW5lZ2luZyByZXF1ZXN0c1xyXG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XHJcblxyXG4gICAgICBjb25zdCBuZXdybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRpbWVzdGFtcCwgdGltZXN0YW1wICsgcm8uZHVyYXRpb24pO1xyXG5cclxuICAgICAgbmV3cm8uZG9uZSh0aGlzLnVzZUZDRlNDYWxsYmFjaywgdGhpcywgcm8pO1xyXG5cclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXNlRkNGU0NhbGxiYWNrKHJvKSB7XHJcbiAgICAgICAgLy8gV2UgaGF2ZSBvbmUgbW9yZSBmcmVlIHNlcnZlclxyXG4gICAgdGhpcy5mcmVlICsrO1xyXG4gICAgdGhpcy5mcmVlU2VydmVyc1tyby5tc2ddID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnN0YXRzLmxlYXZlKHJvLnNjaGVkdWxlZEF0LCByby5lbnRpdHkudGltZSgpKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgc29tZW9uZSB3YWl0aW5nLCBzY2hlZHVsZSBpdCBub3dcclxuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xyXG5cclxuICAgICAgICAvLyByZXN0b3JlIHRoZSBkZWxpdmVyIGZ1bmN0aW9uLCBhbmQgZGVsaXZlclxyXG4gICAgcm8uZGVsaXZlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIHVzZUxDRlMoZHVyYXRpb24sIHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGVyZSB3YXMgYSBydW5uaW5nIHJlcXVlc3QuLlxyXG4gICAgaWYgKHRoaXMuY3VycmVudFJPKSB7XHJcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9ICh0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpIC0gdGhpcy5jdXJyZW50Uk8ubGFzdElzc3VlZCk7XHJcbiAgICAgICAgICAgIC8vIGNhbGN1YXRlIHRoZSByZW1haW5pbmcgdGltZVxyXG4gICAgICB0aGlzLmN1cnJlbnRSTy5yZW1haW5pbmcgPSAoXHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRSTy5kZWxpdmVyQXQgLSB0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpKTtcclxuICAgICAgICAgICAgLy8gcHJlZW1wdCBpdC4uXHJcbiAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50Uk8gPSBybztcclxuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cclxuICAgIGlmICghcm8uc2F2ZWRfZGVsaXZlcikge1xyXG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XHJcbiAgICAgIHJvLnJlbWFpbmluZyA9IGR1cmF0aW9uO1xyXG4gICAgICByby5zYXZlZF9kZWxpdmVyID0gcm8uZGVsaXZlcjtcclxuICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xyXG5cclxuICAgICAgdGhpcy5zdGF0cy5lbnRlcihyby5lbnRpdHkudGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICByby5sYXN0SXNzdWVkID0gcm8uZW50aXR5LnRpbWUoKTtcclxuXHJcbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcclxuICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCkgKyBkdXJhdGlvbjtcclxuICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuICB9XHJcblxyXG4gIHVzZUxDRlNDYWxsYmFjaygpIHtcclxuICAgIGNvbnN0IGZhY2lsaXR5ID0gdGhpcy5zb3VyY2U7XHJcblxyXG4gICAgaWYgKHRoaXMgIT09IGZhY2lsaXR5LmN1cnJlbnRSTykgcmV0dXJuO1xyXG4gICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gc3RhdHNcclxuICAgIGZhY2lsaXR5LmJ1c3lEdXJhdGlvbiArPSAodGhpcy5lbnRpdHkudGltZSgpIC0gdGhpcy5sYXN0SXNzdWVkKTtcclxuICAgIGZhY2lsaXR5LnN0YXRzLmxlYXZlKHRoaXMuc2NoZWR1bGVkQXQsIHRoaXMuZW50aXR5LnRpbWUoKSk7XHJcblxyXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XHJcbiAgICB0aGlzLmRlbGl2ZXIgPSB0aGlzLnNhdmVkX2RlbGl2ZXI7XHJcbiAgICBkZWxldGUgdGhpcy5zYXZlZF9kZWxpdmVyO1xyXG4gICAgdGhpcy5kZWxpdmVyKCk7XHJcblxyXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xyXG4gICAgaWYgKCFmYWNpbGl0eS5xdWV1ZS5lbXB0eSgpKSB7XHJcbiAgICAgIGNvbnN0IG9iaiA9IGZhY2lsaXR5LnF1ZXVlLnBvcCh0aGlzLmVudGl0eS50aW1lKCkpO1xyXG5cclxuICAgICAgZmFjaWxpdHkudXNlTENGUyhvYmoucmVtYWluaW5nLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXNlUHJvY2Vzc29yU2hhcmluZyhkdXJhdGlvbiwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgbnVsbCwgUmVxdWVzdCk7XHJcbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xyXG4gICAgdGhpcy5zdGF0cy5lbnRlcihyby5lbnRpdHkudGltZSgpKTtcclxuICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgaXNBZGRlZCkge1xyXG4gICAgY29uc3QgY3VycmVudCA9IHJvLmVudGl0eS50aW1lKCk7XHJcblxyXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xyXG5cclxuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBpc0FkZGVkID8gKChzaXplICsgMS4wKSAvIHNpemUpIDogKChzaXplIC0gMS4wKSAvIHNpemUpO1xyXG5cclxuICAgIGNvbnN0IG5ld1F1ZXVlID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMubGFzdElzc3VlZCA9IGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuXHJcbiAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcclxuXHJcbiAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBuZXdldiA9IG5ldyBSZXF1ZXN0KFxyXG4gICAgICAgICAgdGhpcywgY3VycmVudCwgY3VycmVudCArIChldi5kZWxpdmVyQXQgLSBjdXJyZW50KSAqIG11bHRpcGxpZXIpO1xyXG5cclxuICAgICAgbmV3ZXYucm8gPSBldi5ybztcclxuICAgICAgbmV3ZXYuc291cmNlID0gdGhpcztcclxuICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xyXG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcclxuXHJcbiAgICAgIGV2LmNhbmNlbCgpO1xyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCB0aGlzIG5ldyByZXF1ZXN0XHJcbiAgICBpZiAoaXNBZGRlZCkge1xyXG4gICAgICBjb25zdCBuZXdldiA9IG5ldyBSZXF1ZXN0KFxyXG4gICAgICAgICAgdGhpcywgY3VycmVudCwgY3VycmVudCArIHJvLmR1cmF0aW9uICogKHNpemUgKyAxKSk7XHJcblxyXG4gICAgICBuZXdldi5ybyA9IHJvO1xyXG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xyXG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XHJcbiAgICAgIG5ld1F1ZXVlLnB1c2gobmV3ZXYpO1xyXG5cclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucXVldWUgPSBuZXdRdWV1ZTtcclxuXHJcbiAgICAgICAgLy8gdXNhZ2Ugc3RhdGlzdGljc1xyXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IChjdXJyZW50IC0gdGhpcy5sYXN0SXNzdWVkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcclxuICAgIGNvbnN0IGZhYyA9IHRoaXMuc291cmNlO1xyXG5cclxuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xyXG4gICAgZmFjLnN0YXRzLmxlYXZlKHRoaXMucm8uc2NoZWR1bGVkQXQsIHRoaXMucm8uZW50aXR5LnRpbWUoKSk7XHJcblxyXG4gICAgZmFjLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZSh0aGlzLnJvLCBmYWxzZSk7XHJcbiAgICB0aGlzLnJvLmRlbGl2ZXIoKTtcclxuICB9XHJcbn1cclxuXHJcbkZhY2lsaXR5LkZDRlMgPSAxO1xyXG5GYWNpbGl0eS5MQ0ZTID0gMjtcclxuRmFjaWxpdHkuUFMgPSAzO1xyXG5GYWNpbGl0eS5OdW1EaXNjaXBsaW5lcyA9IDQ7XHJcblxyXG5jbGFzcyBCdWZmZXIgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSwgY2FwYWNpdHksIGluaXRpYWwpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAzKTtcclxuXHJcbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XHJcbiAgICB0aGlzLmF2YWlsYWJsZSA9ICh0eXBlb2YgaW5pdGlhbCA9PT0gJ3VuZGVmaW5lZCcpID8gMCA6IGluaXRpYWw7XHJcbiAgICB0aGlzLnB1dFF1ZXVlID0gbmV3IFF1ZXVlKCk7XHJcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XHJcbiAgfVxyXG5cclxuICBjdXJyZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlO1xyXG4gIH1cclxuXHJcbiAgc2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xyXG4gIH1cclxuXHJcbiAgZ2V0KGFtb3VudCwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKVxyXG4gICAgICAgICAgICAgICAgJiYgYW1vdW50IDw9IHRoaXMuYXZhaWxhYmxlKSB7XHJcbiAgICAgIHRoaXMuYXZhaWxhYmxlIC09IGFtb3VudDtcclxuXHJcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuXHJcbiAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XHJcblxyXG4gICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcclxuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgfVxyXG5cclxuICBwdXQoYW1vdW50LCBybykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuXHJcbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpXHJcbiAgICAgICAgICAgICAgICAmJiAoYW1vdW50ICsgdGhpcy5hdmFpbGFibGUpIDw9IHRoaXMuY2FwYWNpdHkpIHtcclxuICAgICAgdGhpcy5hdmFpbGFibGUgKz0gYW1vdW50O1xyXG5cclxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG5cclxuICAgICAgdGhpcy5wdXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcclxuXHJcbiAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJvLmFtb3VudCA9IGFtb3VudDtcclxuICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgfVxyXG5cclxuICBwcm9ncmVzc0dldFF1ZXVlKCkge1xyXG4gICAgbGV0IG9iajtcclxuXHJcbiAgICB3aGlsZSAob2JqID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxyXG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxyXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xyXG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcclxuICAgICAgaWYgKG9iai5hbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXHJcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgLT0gb2JqLmFtb3VudDtcclxuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XHJcbiAgICAgICAgb2JqLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xyXG4gICAgbGV0IG9iajtcclxuXHJcbiAgICB3aGlsZSAob2JqID0gdGhpcy5wdXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxyXG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxyXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xyXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcclxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxyXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XHJcbiAgICAgICAgb2JqLmRlbGl2ZXJBdCA9IG9iai5lbnRpdHkudGltZSgpO1xyXG4gICAgICAgIG9iai5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHV0U3RhdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcclxuICB9XHJcblxyXG4gIGdldFN0YXRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBTdG9yZSBleHRlbmRzIE1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcihjYXBhY2l0eSwgbmFtZSA9IG51bGwpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMik7XHJcbiAgICBzdXBlcihuYW1lKTtcclxuXHJcbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XHJcbiAgICB0aGlzLm9iamVjdHMgPSBbXTtcclxuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcclxuICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcclxuICB9XHJcblxyXG4gIGN1cnJlbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vYmplY3RzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHNpemUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcclxuICB9XHJcblxyXG4gIGdldChmaWx0ZXIsIHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG5cclxuICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPiAwKSB7XHJcbiAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG5cclxuICAgICAgbGV0IG9iajtcclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgY29kZSBvdXRcclxuICAgICAgICAgICAgLy8gaXQgaXMgcmVwZWF0ZWQgaW4gcHJvZ3Jlc3NHZXRRdWV1ZVxyXG4gICAgICBpZiAoZmlsdGVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XHJcbiAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHtcclxuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XHJcbiAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcclxuXHJcbiAgICAgICAgcm8ubXNnID0gb2JqO1xyXG4gICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByby5maWx0ZXIgPSBmaWx0ZXI7XHJcbiAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xyXG4gIH1cclxuXHJcbiAgcHV0KG9iaiwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcblxyXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcclxuICAgICAgdGhpcy5hdmFpbGFibGUgKys7XHJcblxyXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xyXG4gICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcblxyXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xyXG4gICAgICB0aGlzLm9iamVjdHMucHVzaChvYmopO1xyXG5cclxuICAgICAgdGhpcy5wcm9ncmVzc0dldFF1ZXVlKCk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcm8ub2JqID0gb2JqO1xyXG4gICAgdGhpcy5wdXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcclxuICB9XHJcblxyXG4gIHByb2dyZXNzR2V0UXVldWUoKSB7XHJcbiAgICBsZXQgcm87XHJcblxyXG4gICAgd2hpbGUgKHJvID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxyXG4gICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxyXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XHJcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA+IDApIHtcclxuICAgICAgICBjb25zdCBmaWx0ZXIgPSByby5maWx0ZXI7XHJcblxyXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgb2JqO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVyKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xyXG4gICAgICAgICAgICBpZiAoZmlsdGVyKG9iaikpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWRlcHRoXHJcbiAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XHJcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxyXG4gICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcclxuICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xyXG5cclxuICAgICAgICAgIHJvLm1zZyA9IG9iajtcclxuICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcclxuICAgIGxldCBybztcclxuXHJcbiAgICB3aGlsZSAocm8gPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXHJcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXHJcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcclxuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcclxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cclxuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xyXG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHJvLm9iaik7XHJcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXRTdGF0cygpIHtcclxuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RhdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEV2ZW50IGV4dGVuZHMgTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAwLCAxKTtcclxuXHJcbiAgICB0aGlzLndhaXRMaXN0ID0gW107XHJcbiAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGFkZFdhaXRMaXN0KHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcclxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLndhaXRMaXN0LnB1c2gocm8pO1xyXG4gIH1cclxuXHJcbiAgYWRkUXVldWUocm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xyXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucXVldWUucHVzaChybyk7XHJcbiAgfVxyXG5cclxuICBmaXJlKGtlZXBGaXJlZCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAwLCAxKTtcclxuXHJcbiAgICBpZiAoa2VlcEZpcmVkKSB7XHJcbiAgICAgIHRoaXMuaXNGaXJlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIERpc3BhdGNoIGFsbCB3YWl0aW5nIGVudGl0aWVzXHJcbiAgICBjb25zdCB0bXBMaXN0ID0gdGhpcy53YWl0TGlzdDtcclxuXHJcbiAgICB0aGlzLndhaXRMaXN0ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcExpc3QubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIHRtcExpc3RbaV0uZGVsaXZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgICAgICAvLyBEaXNwYXRjaCBvbmUgcXVldWVkIGVudGl0eVxyXG4gICAgY29uc3QgbHVja3kgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XHJcblxyXG4gICAgaWYgKGx1Y2t5KSB7XHJcbiAgICAgIGx1Y2t5LmRlbGl2ZXIoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pc0ZpcmVkID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBFbnRpdHkgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XHJcbiAgICBzdXBlcihuYW1lKTtcclxuICAgIHRoaXMuc2ltID0gc2ltO1xyXG4gIH1cclxuXHJcbiAgdGltZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnNpbS50aW1lKCk7XHJcbiAgfVxyXG5cclxuICBzZXRUaW1lcihkdXJhdGlvbikge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxyXG4gICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpLFxyXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcclxuXHJcbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgcmV0dXJuIHJvO1xyXG4gIH1cclxuXHJcbiAgd2FpdEV2ZW50KGV2ZW50KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XHJcblxyXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XHJcbiAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICBxdWV1ZUV2ZW50KGV2ZW50KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XHJcblxyXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XHJcbiAgICBldmVudC5hZGRRdWV1ZShybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICB1c2VGYWNpbGl0eShmYWNpbGl0eSwgZHVyYXRpb24pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBmYWNpbGl0eTtcclxuICAgIGZhY2lsaXR5LnVzZShkdXJhdGlvbiwgcm8pO1xyXG4gICAgcmV0dXJuIHJvO1xyXG4gIH1cclxuXHJcbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIsIEJ1ZmZlcik7XHJcblxyXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xyXG5cclxuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcclxuICAgIGJ1ZmZlci5wdXQoYW1vdW50LCBybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICBnZXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XHJcblxyXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xyXG4gICAgYnVmZmVyLmdldChhbW91bnQsIHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIHB1dFN0b3JlKHN0b3JlLCBvYmopIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBzdG9yZTtcclxuICAgIHN0b3JlLnB1dChvYmosIHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMiwgU3RvcmUsIEZ1bmN0aW9uKTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XHJcblxyXG4gICAgcm8uc291cmNlID0gc3RvcmU7XHJcbiAgICBzdG9yZS5nZXQoZmlsdGVyLCBybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICBzZW5kKG1lc3NhZ2UsIGRlbGF5LCBlbnRpdGllcykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAzKTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMuc2ltLCB0aGlzLnRpbWUoKSwgdGhpcy50aW1lKCkgKyBkZWxheSk7XHJcblxyXG4gICAgcm8uc291cmNlID0gdGhpcztcclxuICAgIHJvLm1zZyA9IG1lc3NhZ2U7XHJcbiAgICByby5kYXRhID0gZW50aXRpZXM7XHJcbiAgICByby5kZWxpdmVyID0gdGhpcy5zaW0uc2VuZE1lc3NhZ2U7XHJcblxyXG4gICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuICB9XHJcblxyXG4gIGxvZyhtZXNzYWdlKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc2ltLmxvZyhtZXNzYWdlLCB0aGlzKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFNpbSwgRmFjaWxpdHksIEJ1ZmZlciwgU3RvcmUsIEV2ZW50LCBFbnRpdHksIGFyZ0NoZWNrIH07XHJcbiIsImltcG9ydCB7IGFyZ0NoZWNrIH0gZnJvbSAnLi9zaW0uanMnO1xyXG5cclxuY2xhc3MgRGF0YVNlcmllcyB7XHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5Db3VudCA9IDA7XHJcbiAgICB0aGlzLlcgPSAwLjA7XHJcbiAgICB0aGlzLkEgPSAwLjA7XHJcbiAgICB0aGlzLlEgPSAwLjA7XHJcbiAgICB0aGlzLk1heCA9IC1JbmZpbml0eTtcclxuICAgIHRoaXMuTWluID0gSW5maW5pdHk7XHJcbiAgICB0aGlzLlN1bSA9IDA7XHJcblxyXG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAzLCAzKTtcclxuXHJcbiAgICB0aGlzLmhMb3dlciA9IGxvd2VyO1xyXG4gICAgdGhpcy5oVXBwZXIgPSB1cHBlcjtcclxuICAgIHRoaXMuaEJ1Y2tldFNpemUgPSAodXBwZXIgLSBsb3dlcikgLyBuYnVja2V0cztcclxuICAgIHRoaXMuaGlzdG9ncmFtID0gbmV3IEFycmF5KG5idWNrZXRzICsgMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRIaXN0b2dyYW0oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oaXN0b2dyYW07XHJcbiAgfVxyXG5cclxuICByZWNvcmQodmFsdWUsIHdlaWdodCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyKTtcclxuXHJcbiAgICBjb25zdCB3ID0gKHR5cGVvZiB3ZWlnaHQgPT09ICd1bmRlZmluZWQnKSA/IDEgOiB3ZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIGRvY3VtZW50LndyaXRlKFwiRGF0YSBzZXJpZXMgcmVjb3JkaW5nIFwiICsgdmFsdWUgKyBcIiAod2VpZ2h0ID0gXCIgKyB3ICsgXCIpXFxuXCIpO1xyXG5cclxuICAgIGlmICh2YWx1ZSA+IHRoaXMuTWF4KSB0aGlzLk1heCA9IHZhbHVlO1xyXG4gICAgaWYgKHZhbHVlIDwgdGhpcy5NaW4pIHRoaXMuTWluID0gdmFsdWU7XHJcbiAgICB0aGlzLlN1bSArPSB2YWx1ZTtcclxuICAgIHRoaXMuQ291bnQgKys7XHJcbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcclxuICAgICAgaWYgKHZhbHVlIDwgdGhpcy5oTG93ZXIpIHtcclxuICAgICAgICB0aGlzLmhpc3RvZ3JhbVswXSArPSB3O1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5oVXBwZXIpIHtcclxuICAgICAgICB0aGlzLmhpc3RvZ3JhbVt0aGlzLmhpc3RvZ3JhbS5sZW5ndGggLSAxXSArPSB3O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigodmFsdWUgLSB0aGlzLmhMb3dlcikgLyB0aGlzLmhCdWNrZXRTaXplKSArIDE7XHJcblxyXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW2luZGV4XSArPSB3O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIFdpID0gV2ktMSArIHdpXHJcbiAgICB0aGlzLlcgPSB0aGlzLlcgKyB3O1xyXG5cclxuICAgIGlmICh0aGlzLlcgPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgICAgICAvLyBBaSA9IEFpLTEgKyB3aS9XaSAqICh4aSAtIEFpLTEpXHJcbiAgICBjb25zdCBsYXN0QSA9IHRoaXMuQTtcclxuXHJcbiAgICB0aGlzLkEgPSBsYXN0QSArICh3IC8gdGhpcy5XKSAqICh2YWx1ZSAtIGxhc3RBKTtcclxuXHJcbiAgICAgICAgLy8gUWkgPSBRaS0xICsgd2koeGkgLSBBaS0xKSh4aSAtIEFpKVxyXG4gICAgdGhpcy5RID0gdGhpcy5RICsgdyAqICh2YWx1ZSAtIGxhc3RBKSAqICh2YWx1ZSAtIHRoaXMuQSk7XHJcbiAgICAgICAgLy8gcHJpbnQoXCJcXHRXPVwiICsgdGhpcy5XICsgXCIgQT1cIiArIHRoaXMuQSArIFwiIFE9XCIgKyB0aGlzLlEgKyBcIlxcblwiKTtcclxuICB9XHJcblxyXG4gIGNvdW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuQ291bnQ7XHJcbiAgfVxyXG5cclxuICBtaW4oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5NaW47XHJcbiAgfVxyXG5cclxuICBtYXgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5NYXg7XHJcbiAgfVxyXG5cclxuICByYW5nZSgpIHtcclxuICAgIHJldHVybiB0aGlzLk1heCAtIHRoaXMuTWluO1xyXG4gIH1cclxuXHJcbiAgc3VtKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuU3VtO1xyXG4gIH1cclxuXHJcbiAgc3VtV2VpZ2h0ZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5BICogdGhpcy5XO1xyXG4gIH1cclxuXHJcbiAgYXZlcmFnZSgpIHtcclxuICAgIHJldHVybiB0aGlzLkE7XHJcbiAgfVxyXG5cclxuICB2YXJpYW5jZSgpIHtcclxuICAgIHJldHVybiB0aGlzLlEgLyB0aGlzLlc7XHJcbiAgfVxyXG5cclxuICBkZXZpYXRpb24oKSB7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMudmFyaWFuY2UoKSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBUaW1lU2VyaWVzIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICB0aGlzLmRhdGFTZXJpZXMgPSBuZXcgRGF0YVNlcmllcyhuYW1lKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5kYXRhU2VyaWVzLnJlc2V0KCk7XHJcbiAgICB0aGlzLmxhc3RWYWx1ZSA9IE5hTjtcclxuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IE5hTjtcclxuICB9XHJcblxyXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDMsIDMpO1xyXG4gICAgdGhpcy5kYXRhU2VyaWVzLnNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKTtcclxuICB9XHJcblxyXG4gIGdldEhpc3RvZ3JhbSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZ2V0SGlzdG9ncmFtKCk7XHJcbiAgfVxyXG5cclxuICByZWNvcmQodmFsdWUsIHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuXHJcbiAgICBpZiAoIWlzTmFOKHRoaXMubGFzdFRpbWVzdGFtcCkpIHtcclxuICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlY29yZCh0aGlzLmxhc3RWYWx1ZSwgdGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZXN0YW1wKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5sYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gIH1cclxuXHJcbiAgZmluYWxpemUodGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMucmVjb3JkKE5hTiwgdGltZXN0YW1wKTtcclxuICB9XHJcblxyXG4gIGNvdW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5jb3VudCgpO1xyXG4gIH1cclxuXHJcbiAgbWluKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5taW4oKTtcclxuICB9XHJcblxyXG4gIG1heCgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWF4KCk7XHJcbiAgfVxyXG5cclxuICByYW5nZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMucmFuZ2UoKTtcclxuICB9XHJcblxyXG4gIHN1bSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuc3VtKCk7XHJcbiAgfVxyXG5cclxuICBhdmVyYWdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5hdmVyYWdlKCk7XHJcbiAgfVxyXG5cclxuICBkZXZpYXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmRldmlhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgdmFyaWFuY2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnZhcmlhbmNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQb3B1bGF0aW9uIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcclxuICAgIHRoaXMuc2l6ZVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKCk7XHJcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzID0gbmV3IERhdGFTZXJpZXMoKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5zaXplU2VyaWVzLnJlc2V0KCk7XHJcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlc2V0KCk7XHJcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xyXG4gIH1cclxuXHJcbiAgZW50ZXIodGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMucG9wdWxhdGlvbiArKztcclxuICAgIHRoaXMuc2l6ZVNlcmllcy5yZWNvcmQodGhpcy5wb3B1bGF0aW9uLCB0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgbGVhdmUoYXJyaXZhbEF0LCBsZWZ0QXQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcblxyXG4gICAgdGhpcy5wb3B1bGF0aW9uIC0tO1xyXG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIGxlZnRBdCk7XHJcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlY29yZChsZWZ0QXQgLSBhcnJpdmFsQXQpO1xyXG4gIH1cclxuXHJcbiAgY3VycmVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnBvcHVsYXRpb247XHJcbiAgfVxyXG5cclxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcclxuICAgIHRoaXMuc2l6ZVNlcmllcy5maW5hbGl6ZSh0aW1lc3RhbXApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xyXG4iLCJpbXBvcnQgeyBTaW0sIEVudGl0eSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlLCBhcmdDaGVjayB9IGZyb20gJy4vbGliL3NpbS5qcyc7XHJcbmltcG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfSBmcm9tICcuL2xpYi9zdGF0cy5qcyc7XHJcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL2xpYi9yZXF1ZXN0LmpzJztcclxuaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vbGliL3F1ZXVlcy5qcyc7XHJcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJy4vbGliL3JhbmRvbS5qcyc7XHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9saWIvbW9kZWwuanMnO1xyXG5cclxuZXhwb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSB9O1xyXG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XHJcbmV4cG9ydCB7IFJlcXVlc3QgfTtcclxuZXhwb3J0IHsgUFF1ZXVlLCBRdWV1ZSwgYXJnQ2hlY2sgfTtcclxuZXhwb3J0IHsgUmFuZG9tIH07XHJcbmV4cG9ydCB7IE1vZGVsIH07XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICB3aW5kb3cuU2ltID0ge1xyXG4gICAgYXJnQ2hlY2s6IGFyZ0NoZWNrLFxyXG4gICAgQnVmZmVyOiBCdWZmZXIsXHJcbiAgICBEYXRhU2VyaWVzOiBEYXRhU2VyaWVzLFxyXG4gICAgRW50aXR5OiBFbnRpdHksXHJcbiAgICBFdmVudDogRXZlbnQsXHJcbiAgICBGYWNpbGl0eTogRmFjaWxpdHksXHJcbiAgICBNb2RlbDogTW9kZWwsXHJcbiAgICBQUXVldWU6IFBRdWV1ZSxcclxuICAgIFBvcHVsYXRpb246IFBvcHVsYXRpb24sXHJcbiAgICBRdWV1ZTogUXVldWUsXHJcbiAgICBSYW5kb206IFJhbmRvbSxcclxuICAgIFJlcXVlc3Q6IFJlcXVlc3QsXHJcbiAgICBTaW06IFNpbSxcclxuICAgIFN0b3JlOiBTdG9yZSxcclxuICAgIFRpbWVTZXJpZXM6IFRpbWVTZXJpZXNcclxuICB9O1xyXG59XHJcbiJdfQ==
