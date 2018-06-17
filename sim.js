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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsOEdBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLElBQUksaUJBQUosRUFBYjtBQUpnQjtBQUtqQjs7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQVEsS0FBSyxJQUFMLENBQVUsTUFBWCxHQUFxQixLQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQTdCLENBQXJCLEdBQXVE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LEdBQVAsR0FBYTtBQUNYLGNBQVUsYUFEQztBQUVYLFlBQVEsV0FGRztBQUdYLGdCQUFZLGlCQUhEO0FBSVgsWUFBUSxXQUpHO0FBS1gsV0FBTyxVQUxJO0FBTVgsY0FBVSxhQU5DO0FBT1gsV0FBTyxZQVBJO0FBUVgsWUFBUSxjQVJHO0FBU1gsZ0JBQVksaUJBVEQ7QUFVWCxXQUFPLGFBVkk7QUFXWCxZQUFRLGNBWEc7QUFZWCxhQUFTLGdCQVpFO0FBYVgsU0FBSyxRQWJNO0FBY1gsV0FBTyxVQWRJO0FBZVgsZ0JBQVk7QUFmRCxHQUFiO0FBaUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uc3RydWN0b3IuX25leHRJZCgpO1xuICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAke3RoaXMuaWR9YDtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgdG90YWxJbnN0YW5jZXMoKSB7XG4gICAgcmV0dXJuICF0aGlzLl90b3RhbEluc3RhbmNlcyA/IDAgOiB0aGlzLl90b3RhbEluc3RhbmNlcztcbiAgfVxuXG4gIHN0YXRpYyBfbmV4dElkKCkge1xuICAgIHRoaXMuX3RvdGFsSW5zdGFuY2VzID0gdGhpcy50b3RhbEluc3RhbmNlcyArIDE7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xuICB9XG59XG5cbmV4cG9ydCB7IE1vZGVsIH07XG5leHBvcnQgZGVmYXVsdCBNb2RlbDtcbiIsImltcG9ydCB7IGFyZ0NoZWNrIH0gZnJvbSAnLi9zaW0uanMnO1xuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcblxuY2xhc3MgUXVldWUgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xuICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xuICB9XG5cbiAgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gIH1cblxuICBiYWNrKCkge1xuICAgIHJldHVybiAodGhpcy5kYXRhLmxlbmd0aCkgPyB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIHB1c2godmFsdWUsIHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG4gICAgdGhpcy5kYXRhLnB1c2godmFsdWUpO1xuICAgIHRoaXMudGltZXN0YW1wLnB1c2godGltZXN0YW1wKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgfVxuXG4gIHVuc2hpZnQodmFsdWUsIHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG4gICAgdGhpcy5kYXRhLnVuc2hpZnQodmFsdWUpO1xuICAgIHRoaXMudGltZXN0YW1wLnVuc2hpZnQodGltZXN0YW1wKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgfVxuXG4gIHNoaWZ0KHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5zaGlmdCgpO1xuXG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnNoaWZ0KCk7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKGVucXVldWVkQXQsIHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcG9wKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5wb3AoKTtcblxuICAgIGNvbnN0IGVucXVldWVkQXQgPSB0aGlzLnRpbWVzdGFtcC5wb3AoKTtcblxuICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwYXNzYnkodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIodGltZXN0YW1wKTtcbiAgICB0aGlzLnN0YXRzLmxlYXZlKHRpbWVzdGFtcCwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy50aW1lc3RhbXAgPSBbXTtcbiAgfVxuXG4gIHJlcG9ydCgpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhdHMuc2l6ZVNlcmllcy5hdmVyYWdlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0cy5kdXJhdGlvblNlcmllcy5hdmVyYWdlKCldO1xuICB9XG5cbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xuICB9XG59XG5cbmNsYXNzIFBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMub3JkZXIgPSAwO1xuICB9XG5cbiAgZ3JlYXRlcihybzEsIHJvMikge1xuICAgIGlmIChybzEuZGVsaXZlckF0ID4gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPT09IHJvMi5kZWxpdmVyQXQpIHJldHVybiBybzEub3JkZXIgPiBybzIub3JkZXI7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaW5zZXJ0KHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcbiAgICByby5vcmRlciA9IHRoaXMub3JkZXIgKys7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEubGVuZ3RoO1xuXG4gICAgdGhpcy5kYXRhLnB1c2gocm8pO1xuXG4gICAgICAgIC8vIGluc2VydCBpbnRvIGRhdGEgYXQgdGhlIGVuZFxuICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XG5cbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XG5cbiAgICAgICAgLy8gaGVhcCB1cFxuICAgIHdoaWxlIChpbmRleCA+IDApIHtcbiAgICAgIGNvbnN0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcigoaW5kZXggLSAxKSAvIDIpO1xuXG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbcGFyZW50SW5kZXhdLCBybykpIHtcbiAgICAgICAgYVtpbmRleF0gPSBhW3BhcmVudEluZGV4XTtcbiAgICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhW2luZGV4XSA9IG5vZGU7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcblxuICAgIGxldCBsZW4gPSBhLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChsZW4gPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEucG9wKCk7XG4gICAgfVxuICAgIGNvbnN0IHRvcCA9IGFbMF07XG5cbiAgICAgICAgLy8gbW92ZSB0aGUgbGFzdCBub2RlIHVwXG4gICAgYVswXSA9IGEucG9wKCk7XG4gICAgbGVuLS07XG5cbiAgICAgICAgLy8gaGVhcCBkb3duXG4gICAgbGV0IGluZGV4ID0gMDtcblxuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcblxuICAgIHdoaWxlIChpbmRleCA8IE1hdGguZmxvb3IobGVuIC8gMikpIHtcbiAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMTtcblxuICAgICAgY29uc3QgcmlnaHRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMjtcblxuICAgICAgY29uc3Qgc21hbGxlckNoaWxkSW5kZXggPSByaWdodENoaWxkSW5kZXggPCBsZW5cbiAgICAgICAgICAgICAgJiYgIXRoaXMuZ3JlYXRlcihhW3JpZ2h0Q2hpbGRJbmRleF0sIGFbbGVmdENoaWxkSW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xuXG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbc21hbGxlckNoaWxkSW5kZXhdLCBub2RlKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYVtpbmRleF0gPSBhW3NtYWxsZXJDaGlsZEluZGV4XTtcbiAgICAgIGluZGV4ID0gc21hbGxlckNoaWxkSW5kZXg7XG4gICAgfVxuICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgICByZXR1cm4gdG9wO1xuICB9XG59XG5cbmV4cG9ydCB7IFF1ZXVlLCBQUXVldWUgfTtcbiIsIlxuY2xhc3MgUmFuZG9tIHtcbiAgY29uc3RydWN0b3Ioc2VlZCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpIHtcbiAgICBpZiAodHlwZW9mIChzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICAgICAgICB8fCBNYXRoLmNlaWwoc2VlZCkgIT09IE1hdGguZmxvb3Ioc2VlZCkpIHsgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NlZWQgdmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7IC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cblxuICAgICAgICAvKiBQZXJpb2QgcGFyYW1ldGVycyAqL1xuICAgIHRoaXMuTiA9IDYyNDtcbiAgICB0aGlzLk0gPSAzOTc7XG4gICAgdGhpcy5NQVRSSVhfQSA9IDB4OTkwOGIwZGY7LyogY29uc3RhbnQgdmVjdG9yIGEgKi9cbiAgICB0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOy8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cbiAgICB0aGlzLkxPV0VSX01BU0sgPSAweDdmZmZmZmZmOy8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG4gICAgdGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOy8qIHRoZSBhcnJheSBmb3IgdGhlIHN0YXRlIHZlY3RvciAqL1xuICAgIHRoaXMubXRpID0gdGhpcy5OICsgMTsvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuICAgICAgICAvLyB0aGlzLmluaXRHZW5yYW5kKHNlZWQpO1xuICAgIHRoaXMuaW5pdEJ5QXJyYXkoW3NlZWRdLCAxKTtcbiAgfVxuXG4gIGluaXRHZW5yYW5kKHMpIHtcbiAgICB0aGlzLm10WzBdID0gcyA+Pj4gMDtcbiAgICBmb3IgKHRoaXMubXRpID0gMTsgdGhpcy5tdGkgPCB0aGlzLk47IHRoaXMubXRpKyspIHtcbiAgICAgIHMgPSB0aGlzLm10W3RoaXMubXRpIC0gMV0gXiAodGhpcy5tdFt0aGlzLm10aSAtIDFdID4+PiAzMCk7XG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1MylcbiAgICAgICAgICAgICsgdGhpcy5tdGk7XG5cbiAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG4gICAgICAvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuICAgICAgLyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcbiAgICB9XG4gIH1cblxuICBpbml0QnlBcnJheShpbml0S2V5LCBrZXlMZW5ndGgpIHtcbiAgICBsZXQgaSwgaiwgaztcblxuICAgIHRoaXMuaW5pdEdlbnJhbmQoMTk2NTAyMTgpO1xuICAgIGkgPSAxOyBqID0gMDtcbiAgICBrID0gKHRoaXMuTiA+IGtleUxlbmd0aCA/IHRoaXMuTiA6IGtleUxlbmd0aCk7XG4gICAgZm9yICg7IGs7IGstLSkge1xuICAgICAgY29uc3QgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XG5cbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNjY0NTI1KSA8PCAxNikgKyAoKHMgJiAweDAwMDBmZmZmKSAqIDE2NjQ1MjUpKSlcbiAgICAgICAgICAgICsgaW5pdEtleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuICAgICAgaSsrOyBqKys7XG4gICAgICBpZiAoaSA+PSB0aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OIC0gMV07IGkgPSAxOyB9XG4gICAgICBpZiAoaiA+PSBrZXlMZW5ndGgpIGogPSAwO1xuICAgIH1cbiAgICBmb3IgKGsgPSB0aGlzLk4gLSAxOyBrOyBrLS0pIHtcbiAgICAgIGNvbnN0IHMgPSB0aGlzLm10W2kgLSAxXSBeICh0aGlzLm10W2kgLSAxXSA+Pj4gMzApO1xuXG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxuICAgICAgICAgICAgLSBpOyAvKiBub24gbGluZWFyICovXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cbiAgICAgIGkrKztcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cbiAgICB9XG5cbiAgICB0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbiAgfVxuXG4gIGdlbnJhbmRJbnQzMigpIHtcbiAgICBsZXQgeTtcblxuICAgIGNvbnN0IG1hZzAxID0gWzB4MCwgdGhpcy5NQVRSSVhfQV07XG5cbiAgICAgICAgLy8gIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDFcblxuICAgIGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgIC8vIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWVcbiAgICAgIGxldCBraztcblxuICAgICAgaWYgKHRoaXMubXRpID09PSB0aGlzLk4gKyAxKSB7ICAvLyBpZiBpbml0R2VucmFuZCgpIGhhcyBub3QgYmVlbiBjYWxsZWQsXG4gICAgICAgIHRoaXMuaW5pdEdlbnJhbmQoNTQ4OSk7IC8vIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZFxuICAgICAgfVxuXG4gICAgICBmb3IgKGtrID0gMDsga2sgPCB0aGlzLk4gLSB0aGlzLk07IGtrKyspIHtcbiAgICAgICAgeSA9ICh0aGlzLm10W2trXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFtrayArIDFdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuICAgICAgfVxuICAgICAgZm9yICg7a2sgPCB0aGlzLk4gLSAxOyBraysrKSB7XG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayArICh0aGlzLk0gLSB0aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuICAgICAgfVxuICAgICAgeSA9ICh0aGlzLm10W3RoaXMuTiAtIDFdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10WzBdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgIHRoaXMubXRbdGhpcy5OIC0gMV0gPSB0aGlzLm10W3RoaXMuTSAtIDFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cbiAgICAgIHRoaXMubXRpID0gMDtcbiAgICB9XG5cbiAgICB5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcblxuICAgICAgICAvKiBUZW1wZXJpbmcgKi9cbiAgICB5IF49ICh5ID4+PiAxMSk7XG4gICAgeSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XG4gICAgeSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuICAgIHkgXj0gKHkgPj4+IDE4KTtcblxuICAgIHJldHVybiB5ID4+PiAwO1xuICB9XG5cbiAgZ2VucmFuZEludDMxKCkge1xuICAgIHJldHVybiAodGhpcy5nZW5yYW5kSW50MzIoKSA+Pj4gMSk7XG4gIH1cblxuICBnZW5yYW5kUmVhbDEoKSB7XG4gICAgLy8gZGl2aWRlZCBieSAyXjMyLTFcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kSW50MzIoKSAqICgxLjAgLyA0Mjk0OTY3Mjk1LjApO1xuICB9XG5cbiAgcmFuZG9tKCkge1xuICAgIGlmICh0aGlzLnB5dGhvbkNvbXBhdGliaWxpdHkpIHtcbiAgICAgIGlmICh0aGlzLnNraXApIHtcbiAgICAgICAgdGhpcy5nZW5yYW5kSW50MzIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2tpcCA9IHRydWU7XG4gICAgfVxuICAgIC8vIGRpdmlkZWQgYnkgMl4zMlxuICAgIHJldHVybiB0aGlzLmdlbnJhbmRJbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTYuMCk7XG4gIH1cblxuICBnZW5yYW5kUmVhbDMoKSB7XG4gICAgLy8gZGl2aWRlZCBieSAyXjMyXG4gICAgcmV0dXJuICh0aGlzLmdlbnJhbmRJbnQzMigpICsgMC41KSAqICgxLjAgLyA0Mjk0OTY3Mjk2LjApO1xuICB9XG5cbiAgZ2VucmFuZFJlczUzKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmdlbnJhbmRJbnQzMigpID4+PiA1O1xuICAgIGNvbnN0IGIgPSB0aGlzLmdlbnJhbmRJbnQzMigpID4+PiA2O1xuXG4gICAgcmV0dXJuIChhICogNjcxMDg4NjQuMCArIGIpICogKDEuMCAvIDkwMDcxOTkyNTQ3NDA5OTIuMCk7XG4gIH1cblxuICBleHBvbmVudGlhbChsYW1iZGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdleHBvbmVudGlhbCgpIG11c3QgIGJlIGNhbGxlZCB3aXRoIFxcJ2xhbWJkYVxcJyBwYXJhbWV0ZXInKTsgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuICAgIGNvbnN0IHIgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgcmV0dXJuIC1NYXRoLmxvZyhyKSAvIGxhbWJkYTtcbiAgfVxuXG4gIGdhbW1hKGFscGhhLCBiZXRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZ2FtbWEoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnMnKTsgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuICAgICAgICAvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cbiAgICAgICAgICovXG5cbiAgICBsZXQgdTtcblxuICAgIGlmIChhbHBoYSA+IDEuMCkge1xuICAgICAgY29uc3QgYWludiA9IE1hdGguc3FydCgyLjAgKiBhbHBoYSAtIDEuMCk7XG5cbiAgICAgIGNvbnN0IGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuXG4gICAgICBjb25zdCBjY2MgPSBhbHBoYSArIGFpbnY7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICBjb25zdCB1MSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICAgICAgaWYgKCh1MSA8IDFlLTcpIHx8ICh1ID4gMC45OTk5OTk5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHUyID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgICBjb25zdCB2ID0gTWF0aC5sb2codTEgLyAoMS4wIC0gdTEpKSAvIGFpbnY7XG5cbiAgICAgICAgY29uc3QgeCA9IGFscGhhICogTWF0aC5leHAodik7XG5cbiAgICAgICAgY29uc3QgeiA9IHUxICogdTEgKiB1MjtcblxuICAgICAgICBjb25zdCByID0gYmJiICsgY2NjICogdiAtIHg7XG5cbiAgICAgICAgaWYgKChyICsgdGhpcy5TR19NQUdJQ0NPTlNUIC0gNC41ICogeiA+PSAwLjApIHx8IChyID49IE1hdGgubG9nKHopKSkge1xuICAgICAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWxwaGEgPT09IDEuMCkge1xuICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICAgIHdoaWxlICh1IDw9IDFlLTcpIHtcbiAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gLU1hdGgubG9nKHUpICogYmV0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHg7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgICBjb25zdCBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcblxuICAgICAgICBjb25zdCBwID0gYiAqIHU7XG5cbiAgICAgICAgaWYgKHAgPD0gMS4wKSB7XG4gICAgICAgICAgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggPSAtTWF0aC5sb2coKGIgLSBwKSAvIGFscGhhKTtcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHUxID0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgICBpZiAocCA+IDEuMCkge1xuICAgICAgICAgIGlmICh1MSA8PSBNYXRoLnBvdyh4LCAoYWxwaGEgLSAxLjApKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHUxIDw9IE1hdGguZXhwKC14KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geCAqIGJldGE7XG4gICAgfVxuXG4gIH1cblxuICBub3JtYWwobXUsIHNpZ21hKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ25vcm1hbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggbXUgYW5kIHNpZ21hIHBhcmFtZXRlcnMnKTsgICAgICAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuICAgIGxldCB6ID0gdGhpcy5sYXN0Tm9ybWFsO1xuXG4gICAgdGhpcy5sYXN0Tm9ybWFsID0gTmFOO1xuICAgIGlmICgheikge1xuICAgICAgY29uc3QgYSA9IHRoaXMucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcblxuICAgICAgY29uc3QgYiA9IE1hdGguc3FydCgtMi4wICogTWF0aC5sb2coMS4wIC0gdGhpcy5yYW5kb20oKSkpO1xuXG4gICAgICB6ID0gTWF0aC5jb3MoYSkgKiBiO1xuICAgICAgdGhpcy5sYXN0Tm9ybWFsID0gTWF0aC5zaW4oYSkgKiBiO1xuICAgIH1cbiAgICByZXR1cm4gbXUgKyB6ICogc2lnbWE7XG4gIH1cblxuICBwYXJldG8oYWxwaGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdwYXJldG8oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIHBhcmFtZXRlcicpOyAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG4gICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICByZXR1cm4gMS4wIC8gTWF0aC5wb3coKDEgLSB1KSwgMS4wIC8gYWxwaGEpO1xuICB9XG5cbiAgdHJpYW5ndWxhcihsb3dlciwgdXBwZXIsIG1vZGUpIHtcbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3RyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyLCB1cHBlciBhbmQgbW9kZSBwYXJhbWV0ZXJzJyk7ICAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cbiAgICBjb25zdCBjID0gKG1vZGUgLSBsb3dlcikgLyAodXBwZXIgLSBsb3dlcik7XG5cbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgIGlmICh1IDw9IGMpIHtcbiAgICAgIHJldHVybiBsb3dlciArIE1hdGguc3FydCh1ICogKHVwcGVyIC0gbG93ZXIpICogKG1vZGUgLSBsb3dlcikpO1xuICAgIH1cbiAgICByZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAqIEFsbCBmbG9hdHMgYmV0d2VlbiBsb3dlciBhbmQgdXBwZXIgYXJlIGVxdWFsbHkgbGlrZWx5LiBUaGlzIGlzIHRoZVxuICAqIHRoZW9yZXRpY2FsIGRpc3RyaWJ1dGlvbiBtb2RlbCBmb3IgYSBiYWxhbmNlZCBjb2luLCBhbiB1bmJpYXNlZCBkaWUsIGFcbiAgKiBjYXNpbm8gcm91bGV0dGUsIG9yIHRoZSBmaXJzdCBjYXJkIG9mIGEgd2VsbC1zaHVmZmxlZCBkZWNrLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxvd2VyXG4gICogQHBhcmFtIHtOdW1iZXJ9IHVwcGVyXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgdW5pZm9ybShsb3dlciwgdXBwZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCd1bmlmb3JtKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBsb3dlciBhbmQgdXBwZXIgcGFyYW1ldGVycycpOyAgICAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgIHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XG4gIH1cblxuICB3ZWlidWxsKGFscGhhLCBiZXRhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignd2VpYnVsbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAgICAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgIGNvbnN0IHUgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgcmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcbiAgfVxufVxuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcblxuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgZGVmYXVsdCBSYW5kb207XG4iLCJpbXBvcnQgeyBhcmdDaGVjaywgU3RvcmUsIEJ1ZmZlciwgRXZlbnQgfSBmcm9tICcuL3NpbS5qcyc7XG5cbmNsYXNzIFJlcXVlc3Qge1xuICBjb25zdHJ1Y3RvcihlbnRpdHksIGN1cnJlbnRUaW1lLCBkZWxpdmVyQXQpIHtcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICB0aGlzLnNjaGVkdWxlZEF0ID0gY3VycmVudFRpbWU7XG4gICAgdGhpcy5kZWxpdmVyQXQgPSBkZWxpdmVyQXQ7XG4gICAgdGhpcy5kZWxpdmVyeVBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5ncm91cCA9IG51bGw7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgICAgIC8vIEFzayB0aGUgbWFpbiByZXF1ZXN0IHRvIGhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwWzBdICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm4gdGhpcy5ncm91cFswXS5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICAgICAgLy8gLS0+IHRoaXMgaXMgbWFpbiByZXF1ZXN0XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIC8vIGlmIGFscmVhZHkgY2FuY2VsbGVkLCBkbyBub3RoaW5nXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gUHJldmVudCBjYW5jZWxsYXRpb24gaWYgcmVxdWVzdCBpcyBhYm91dCB0byBiZSBkZWxpdmVyZWQgYXQgdGhpc1xuICAgICAgICAvLyBpbnN0YW50LiBDb3ZlcnMgY2FzZSB3aGVyZSBpbiBhIGJ1ZmZlciBvciBzdG9yZSwgb2JqZWN0IGhhcyBhbHJlYWR5XG4gICAgICAgIC8vIGJlZW4gZGVxdWV1ZWQgYW5kIGRlbGl2ZXJ5IHdhcyBzY2hlZHVsZWQgZm9yIG5vdywgYnV0IHdhaXRVbnRpbFxuICAgICAgICAvLyB0aW1lcyBvdXQgYXQgdGhlIHNhbWUgdGltZSwgbWFraW5nIHRoZSByZXF1ZXN0IGdldCBjYW5jZWxsZWQgYWZ0ZXJcbiAgICAgICAgLy8gdGhlIG9iamVjdCBpcyBkZXF1ZXVlZCBidXQgYmVmb3JlIGl0IGlzIGRlbGl2ZXJlZC5cbiAgICBpZiAodGhpcy5kZWxpdmVyeVBlbmRpbmcpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgdGhpcy5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc0dldFF1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdyb3VwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9uZShjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDMsIEZ1bmN0aW9uLCBPYmplY3QpO1xuXG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB3YWl0VW50aWwoZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCwgbnVsbCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KFxuICAgICAgdGhpcy5zY2hlZHVsZWRBdCArIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuXG4gICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCA0LCBudWxsLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgIHJvLm1zZyA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuXG4gICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgICAgcm8ubXNnID0gZXZlbnRbaV07XG4gICAgICAgIGV2ZW50W2ldLmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgICAgICAvLyBQcmV2ZW50IGRlbGl2ZXJ5IG9mIGNoaWxkIHJlcXVlc3RzIGlmIG1haW4gcmVxdWVzdCBpcyBhYm91dCB0byBiZVxuICAgICAgICAvLyBkZWxpdmVyZWQgYXQgdGhpcyBpbnN0YW50LiBTZWUgY29tbWVudCBpbiBjYW5jZWwgYWJvdmVcbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwWzBdLmRlbGl2ZXJ5UGVuZGluZyAmJiB0aGlzLmdyb3VwWzBdICE9PSB0aGlzKSByZXR1cm47XG5cbiAgICB0aGlzLmRlbGl2ZXJ5UGVuZGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgaWYgKCF0aGlzLmNhbGxiYWNrcykgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuZ3JvdXBbMF0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cFswXS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZG9DYWxsYmFjayh0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gIH1cblxuICBjYW5jZWxSZW5lZ2VDbGF1c2VzKCkge1xuICAgICAgICAvLyB0aGlzLmNhbmNlbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy53YWl0VW50aWwgPSB0aGlzLk51bGw7XG4gICAgICAgIC8vIHRoaXMudW5sZXNzRXZlbnQgPSB0aGlzLk51bGw7XG4gICAgdGhpcy5ub1JlbmVnZSA9IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXAgfHwgdGhpcy5ncm91cFswXSAhPT0gdGhpcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgTnVsbCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9hZGRSZXF1ZXN0KGRlbGl2ZXJBdCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSxcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEF0LFxuICAgICAgICAgICAgICAgIGRlbGl2ZXJBdCk7XG5cbiAgICByby5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG5cbiAgICBpZiAodGhpcy5ncm91cCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5ncm91cCA9IFt0aGlzXTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwLnB1c2gocm8pO1xuICAgIHJvLmdyb3VwID0gdGhpcy5ncm91cDtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBfZG9DYWxsYmFjayhzb3VyY2UsIG1zZywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1tpXVswXTtcblxuICAgICAgaWYgKCFjYWxsYmFjaykgY29udGludWU7XG5cbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5jYWxsYmFja3NbaV1bMV07XG5cbiAgICAgIGlmICghY29udGV4dCkgY29udGV4dCA9IHRoaXMuZW50aXR5O1xuXG4gICAgICBjb25zdCBhcmd1bWVudCA9IHRoaXMuY2FsbGJhY2tzW2ldWzJdO1xuXG4gICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gc291cmNlO1xuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBtc2c7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IGRhdGE7XG5cbiAgICAgIGlmICghYXJndW1lbnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmd1bWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IG51bGw7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG51bGw7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrRGF0YSA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IFJlcXVlc3QgfTtcbiIsImltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL3F1ZXVlcy5qcyc7XG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnLi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbC5qcyc7XG5cbmZ1bmN0aW9uIGFyZ0NoZWNrKGZvdW5kLCBleHBNaW4sIGV4cE1heCkge1xuICBpZiAoZm91bmQubGVuZ3RoIDwgZXhwTWluIHx8IGZvdW5kLmxlbmd0aCA+IGV4cE1heCkgeyAgIC8vIGFyZ0NoZWNrXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cycpOyAgIC8vIGFyZ0NoZWNrXG4gIH0gICAvLyBhcmdDaGVja1xuXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykgeyAgIC8vIGFyZ0NoZWNrXG5cbiAgICBpZiAoIWFyZ3VtZW50c1tpICsgM10gfHwgIWZvdW5kW2ldKSBjb250aW51ZTsgICAvLyBhcmdDaGVja1xuXG4vLyAgICBwcmludChcIlRFU1QgXCIgKyBmb3VuZFtpXSArIFwiIFwiICsgYXJndW1lbnRzW2kgKyAzXSAgIC8vIGFyZ0NoZWNrXG4vLyAgICArIFwiIFwiICsgKGZvdW5kW2ldIGluc3RhbmNlb2YgRXZlbnQpICAgLy8gYXJnQ2hlY2tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSAgIC8vIGFyZ0NoZWNrXG4vLyAgICArIFwiXFxuXCIpOyAgIC8vIEFSRyBDSEVDS1xuXG5cbiAgICBpZiAoIShmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pKSB7ICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICR7aSArIDF9IGlzIG9mIGluY29ycmVjdCB0eXBlLmApOyAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgIC8vIGFyZ0NoZWNrXG4gIH0gICAvLyBhcmdDaGVja1xufSAgIC8vIGFyZ0NoZWNrXG5cbmNsYXNzIFNpbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2ltVGltZSA9IDA7XG4gICAgdGhpcy5ldmVudHMgPSAwO1xuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gICAgdGhpcy5tYXhFdmVudHMgPSAwO1xuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzQnlOYW1lID0ge307XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBQUXVldWUoKTtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgIHRoaXMuZW50aXR5SWQgPSAxO1xuICAgIHRoaXMucGF1c2VkID0gMDtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltVGltZTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHNlbmRlciA9IHRoaXMuc291cmNlO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubXNnO1xuXG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmRhdGE7XG5cbiAgICBjb25zdCBzaW0gPSBzZW5kZXIuc2ltO1xuXG4gICAgaWYgKCFlbnRpdGllcykge1xuICAgICAgICAgICAgLy8gc2VuZCB0byBhbGwgZW50aXRpZXNcbiAgICAgIGZvciAobGV0IGkgPSBzaW0uZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gc2ltLmVudGl0aWVzW2ldO1xuXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XG4gICAgICAgIGlmIChlbnRpdHkub25NZXNzYWdlKSBlbnRpdHkub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbnRpdGllcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVudGl0aWVzLm9uTWVzc2FnZSkge1xuICAgICAgZW50aXRpZXMub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgYWRkRW50aXR5KEtsYXNzLCBuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHByb3RvdHlwZSBoYXMgc3RhcnQgZnVuY3Rpb25cbiAgICBpZiAoIUtsYXNzLnByb3RvdHlwZS5zdGFydCkgeyAgLy8gQVJHIENIRUNLXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudGl0eSBjbGFzcyAke0tsYXNzLm5hbWV9IG11c3QgaGF2ZSBzdGFydCgpIGZ1bmN0aW9uIGRlZmluZWRgKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdGhpcy5lbnRpdGllc0J5TmFtZVtuYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IG5hbWUgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2ApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IG5ldyBLbGFzcyh0aGlzLCBuYW1lKTtcblxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuZW50aXRpZXNCeU5hbWVbbmFtZV0gPSBlbnRpdHk7XG4gICAgfVxuXG4gICAgZW50aXR5LnN0YXJ0KC4uLmFyZ3MpO1xuXG4gICAgcmV0dXJuIGVudGl0eTtcbiAgfVxuXG4gIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xuICAgICAgICAvLyBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuICAgIGlmICghbWF4RXZlbnRzKSB7IG1heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cbiAgICB0aGlzLmV2ZW50cyA9IDA7XG4gICAgdGhpcy5tYXhFdmVudHMgPSBtYXhFdmVudHM7XG4gICAgdGhpcy5lbmRUaW1lID0gZW5kVGltZTtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMucGF1c2UoKTtcbiAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgICsrdGhpcy5wYXVzZWQ7XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgaWYgKHRoaXMucGF1c2VkID4gMCkge1xuICAgICAgLS10aGlzLnBhdXNlZDtcbiAgICB9XG4gICAgaWYgKHRoaXMucGF1c2VkIDw9IDAgJiYgdGhpcy5ydW5uaW5nKSB7XG4gICAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgdGhpcy5ldmVudHMrKztcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzID4gdGhpcy5tYXhFdmVudHMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAvLyBHZXQgdGhlIGVhcmxpZXN0IGV2ZW50XG4gICAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBldmVudHMsIHdlIGFyZSBkb25lIHdpdGggc2ltdWxhdGlvbiBoZXJlLlxuICAgICAgICBpZiAocm8gPT09IG51bGwpIGJyZWFrO1xuXG4gICAgICAgICAgICAgIC8vIFVoIG9oLi4gd2UgYXJlIG91dCBvZiB0aW1lIG5vd1xuICAgICAgICBpZiAocm8uZGVsaXZlckF0ID4gdGhpcy5lbmRUaW1lKSBicmVhaztcblxuICAgICAgICAgICAgICAvLyBBZHZhbmNlIHNpbXVsYXRpb24gdGltZVxuICAgICAgICB0aGlzLnNpbVRpbWUgPSByby5kZWxpdmVyQXQ7XG5cbiAgICAgICAgICAgICAgLy8gSWYgdGhpcyBldmVudCBpcyBhbHJlYWR5IGNhbmNlbGxlZCwgaWdub3JlXG4gICAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgIHJvLmRlbGl2ZXIoKTtcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0ZXAoKSB7XG4gICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XG5cbiAgICAgIGlmIChybyA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvZ2dlcihsb2dnZXIpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEsIEZ1bmN0aW9uKTtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlLCBlbnRpdHkpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgaWYgKCF0aGlzLmxvZ2dlcikgcmV0dXJuO1xuICAgIGxldCBlbnRpdHlNc2cgPSAnJztcblxuICAgIGlmICh0eXBlb2YgZW50aXR5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGVudGl0eS5uYW1lKSB7XG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5Lm5hbWV9XWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5pZH1dIGA7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyKGAke3RoaXMuc2ltVGltZS50b0ZpeGVkKDYpfSR7ZW50aXR5TXNnfSAgICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG5jbGFzcyBGYWNpbGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSwgZGlzY2lwbGluZSwgc2VydmVycywgbWF4cWxlbikge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCk7XG5cbiAgICB0aGlzLmZyZWUgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5zZXJ2ZXJzID0gc2VydmVycyA/IHNlcnZlcnMgOiAxO1xuICAgIHRoaXMubWF4cWxlbiA9ICh0eXBlb2YgbWF4cWxlbiA9PT0gJ3VuZGVmaW5lZCcpID8gLTEgOiAxICogbWF4cWxlbjtcblxuICAgIHN3aXRjaCAoZGlzY2lwbGluZSkge1xuXG4gICAgY2FzZSBGYWNpbGl0eS5MQ0ZTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUxDRlM7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LlBTOlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmc7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VGQ0ZTO1xuICAgICAgdGhpcy5mcmVlU2VydmVycyA9IG5ldyBBcnJheSh0aGlzLnNlcnZlcnMpO1xuICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5mcmVlU2VydmVyc1tpXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5xdWV1ZS5yZXNldCgpO1xuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XG4gIH1cblxuICBzeXN0ZW1TdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcbiAgfVxuXG4gIHF1ZXVlU3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUuc3RhdHM7XG4gIH1cblxuICB1c2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idXN5RHVyYXRpb247XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICAgIHRoaXMucXVldWUuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgfVxuXG4gIHVzZUZDRlMoZHVyYXRpb24sIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcbiAgICBpZiAoKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLm1heHFsZW4gPiAwICYmIHRoaXMucXVldWUuc2l6ZSgpID49IHRoaXMubWF4cWxlbikpIHtcbiAgICAgIHJvLm1zZyA9IC0xO1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICB0aGlzLnN0YXRzLmVudGVyKG5vdyk7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKG5vdyk7XG4gIH1cblxuICB1c2VGQ0ZTU2NoZWR1bGUodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHdoaWxlICh0aGlzLmZyZWUgPiAwICYmICF0aGlzLnF1ZXVlLmVtcHR5KCkpIHtcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5zaGlmdCh0aW1lc3RhbXApO1xuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyZWVTZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZnJlZVNlcnZlcnNbaV0pIHtcbiAgICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gZmFsc2U7XG4gICAgICAgICAgcm8ubXNnID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmZyZWUgLS07XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSByby5kdXJhdGlvbjtcblxuICAgICAgICAgICAgLy8gY2FuY2VsIGFsbCBvdGhlciByZW5lZ2luZyByZXF1ZXN0c1xuICAgICAgcm8uY2FuY2VsUmVuZWdlQ2xhdXNlcygpO1xuXG4gICAgICBjb25zdCBuZXdybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRpbWVzdGFtcCwgdGltZXN0YW1wICsgcm8uZHVyYXRpb24pO1xuXG4gICAgICBuZXdyby5kb25lKHRoaXMudXNlRkNGU0NhbGxiYWNrLCB0aGlzLCBybyk7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld3JvKTtcbiAgICB9XG4gIH1cblxuICB1c2VGQ0ZTQ2FsbGJhY2socm8pIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBvbmUgbW9yZSBmcmVlIHNlcnZlclxuICAgIHRoaXMuZnJlZSArKztcbiAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShyby5zY2hlZHVsZWRBdCwgcm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgc29tZW9uZSB3YWl0aW5nLCBzY2hlZHVsZSBpdCBub3dcbiAgICB0aGlzLnVzZUZDRlNTY2hlZHVsZShyby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyByZXN0b3JlIHRoZSBkZWxpdmVyIGZ1bmN0aW9uLCBhbmQgZGVsaXZlclxuICAgIHJvLmRlbGl2ZXIoKTtcblxuICB9XG5cbiAgdXNlTENGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXG4gICAgaWYgKHRoaXMuY3VycmVudFJPKSB7XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSAodGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSAtIHRoaXMuY3VycmVudFJPLmxhc3RJc3N1ZWQpO1xuICAgICAgICAgICAgLy8gY2FsY3VhdGUgdGhlIHJlbWFpbmluZyB0aW1lXG4gICAgICB0aGlzLmN1cnJlbnRSTy5yZW1haW5pbmcgPSAoXG4gICAgICAgICAgdGhpcy5jdXJyZW50Uk8uZGVsaXZlckF0IC0gdGhpcy5jdXJyZW50Uk8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cbiAgICAgIHRoaXMucXVldWUucHVzaCh0aGlzLmN1cnJlbnRSTywgcm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Uk8gPSBybztcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZS4uXG4gICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgICByby5yZW1haW5pbmcgPSBkdXJhdGlvbjtcbiAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xuICAgICAgcm8uZGVsaXZlciA9IHRoaXMudXNlTENGU0NhbGxiYWNrO1xuXG4gICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIH1cblxuICAgIHJvLmxhc3RJc3N1ZWQgPSByby5lbnRpdHkudGltZSgpO1xuXG4gICAgICAgIC8vIHNjaGVkdWxlIHRoaXMgbmV3IGV2ZW50XG4gICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xuICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIHVzZUxDRlNDYWxsYmFjaygpIHtcbiAgICBjb25zdCBmYWNpbGl0eSA9IHRoaXMuc291cmNlO1xuXG4gICAgaWYgKHRoaXMgIT09IGZhY2lsaXR5LmN1cnJlbnRSTykgcmV0dXJuO1xuICAgIGZhY2lsaXR5LmN1cnJlbnRSTyA9IG51bGw7XG5cbiAgICAgICAgLy8gc3RhdHNcbiAgICBmYWNpbGl0eS5idXN5RHVyYXRpb24gKz0gKHRoaXMuZW50aXR5LnRpbWUoKSAtIHRoaXMubGFzdElzc3VlZCk7XG4gICAgZmFjaWxpdHkuc3RhdHMubGVhdmUodGhpcy5zY2hlZHVsZWRBdCwgdGhpcy5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyBkZWxpdmVyIHRoaXMgcmVxdWVzdFxuICAgIHRoaXMuZGVsaXZlciA9IHRoaXMuc2F2ZWRfZGVsaXZlcjtcbiAgICBkZWxldGUgdGhpcy5zYXZlZF9kZWxpdmVyO1xuICAgIHRoaXMuZGVsaXZlcigpO1xuXG4gICAgICAgIC8vIHNlZSBpZiB0aGVyZSBhcmUgcGVuZGluZyByZXF1ZXN0c1xuICAgIGlmICghZmFjaWxpdHkucXVldWUuZW1wdHkoKSkge1xuICAgICAgY29uc3Qgb2JqID0gZmFjaWxpdHkucXVldWUucG9wKHRoaXMuZW50aXR5LnRpbWUoKSk7XG5cbiAgICAgIGZhY2lsaXR5LnVzZUxDRlMob2JqLnJlbWFpbmluZywgb2JqKTtcbiAgICB9XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nKGR1cmF0aW9uLCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgbnVsbCwgUmVxdWVzdCk7XG4gICAgcm8uZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG4gICAgdGhpcy5zdGF0cy5lbnRlcihyby5lbnRpdHkudGltZSgpKTtcbiAgICB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgdHJ1ZSk7XG4gIH1cblxuICB1c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIGlzQWRkZWQpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcm8uZW50aXR5LnRpbWUoKTtcblxuICAgIGNvbnN0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcblxuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBpc0FkZGVkID8gKChzaXplICsgMS4wKSAvIHNpemUpIDogKChzaXplIC0gMS4wKSAvIHNpemUpO1xuXG4gICAgY29uc3QgbmV3UXVldWUgPSBbXTtcblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sYXN0SXNzdWVkID0gY3VycmVudDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuXG4gICAgICBjb25zdCBldiA9IHRoaXMucXVldWVbaV07XG5cbiAgICAgIGlmIChldi5ybyA9PT0gcm8pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBuZXdldiA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgIHRoaXMsIGN1cnJlbnQsIGN1cnJlbnQgKyAoZXYuZGVsaXZlckF0IC0gY3VycmVudCkgKiBtdWx0aXBsaWVyKTtcblxuICAgICAgbmV3ZXYucm8gPSBldi5ybztcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgZXYuY2FuY2VsKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XG4gICAgfVxuXG4gICAgICAgIC8vIGFkZCB0aGlzIG5ldyByZXF1ZXN0XG4gICAgaWYgKGlzQWRkZWQpIHtcbiAgICAgIGNvbnN0IG5ld2V2ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgdGhpcywgY3VycmVudCwgY3VycmVudCArIHJvLmR1cmF0aW9uICogKHNpemUgKyAxKSk7XG5cbiAgICAgIG5ld2V2LnJvID0gcm87XG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xuICAgICAgbmV3ZXYuZGVsaXZlciA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrO1xuICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XG5cbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3UXVldWU7XG5cbiAgICAgICAgLy8gdXNhZ2Ugc3RhdGlzdGljc1xuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKGN1cnJlbnQgLSB0aGlzLmxhc3RJc3N1ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaygpIHtcbiAgICBjb25zdCBmYWMgPSB0aGlzLnNvdXJjZTtcblxuICAgIGlmICh0aGlzLmNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIGZhYy5zdGF0cy5sZWF2ZSh0aGlzLnJvLnNjaGVkdWxlZEF0LCB0aGlzLnJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgZmFjLnVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZSh0aGlzLnJvLCBmYWxzZSk7XG4gICAgdGhpcy5yby5kZWxpdmVyKCk7XG4gIH1cbn1cblxuRmFjaWxpdHkuRkNGUyA9IDE7XG5GYWNpbGl0eS5MQ0ZTID0gMjtcbkZhY2lsaXR5LlBTID0gMztcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcblxuY2xhc3MgQnVmZmVyIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMyk7XG5cbiAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgdGhpcy5hdmFpbGFibGUgPSAodHlwZW9mIGluaXRpYWwgPT09ICd1bmRlZmluZWQnKSA/IDAgOiBpbml0aWFsO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZTtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XG4gIH1cblxuICBnZXQoYW1vdW50LCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgYW1vdW50IDw9IHRoaXMuYXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSAtPSBhbW91bnQ7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLmdldFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzUHV0UXVldWUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByby5hbW91bnQgPSBhbW91bnQ7XG4gICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHB1dChhbW91bnQsIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLnB1dFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiAoYW1vdW50ICsgdGhpcy5hdmFpbGFibGUpIDw9IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlICs9IGFtb3VudDtcblxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwcm9ncmVzc0dldFF1ZXVlKCkge1xuICAgIGxldCBvYmo7XG5cbiAgICB3aGlsZSAob2JqID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtPSBvYmouYW1vdW50O1xuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgIG9iai5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgb2JqLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XG4gICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgfVxuXG4gIGdldFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFF1ZXVlLnN0YXRzO1xuICB9XG59XG5cbmNsYXNzIFN0b3JlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihjYXBhY2l0eSwgbmFtZSA9IG51bGwpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuICAgIHN1cGVyKG5hbWUpO1xuXG4gICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChmaWx0ZXIsIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPiAwKSB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgICAgbGV0IG9iajtcblxuICAgICAgICAgICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBjb2RlIG91dFxuICAgICAgICAgICAgLy8gaXQgaXMgcmVwZWF0ZWQgaW4gcHJvZ3Jlc3NHZXRRdWV1ZVxuICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgIHJvLm1zZyA9IG9iajtcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJvLmZpbHRlciA9IGZpbHRlcjtcbiAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHV0KG9iaiwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgdGhpcy5wdXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcbiAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iaik7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcm8ub2JqID0gb2JqO1xuICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwcm9ncmVzc0dldFF1ZXVlKCkge1xuICAgIGxldCBybztcblxuICAgIHdoaWxlIChybyA9IHRoaXMuZ2V0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA+IDApIHtcbiAgICAgICAgY29uc3QgZmlsdGVyID0gcm8uZmlsdGVyO1xuXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBvYmo7XG5cbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtZGVwdGhcbiAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICB0aGlzLm9iamVjdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICB0aGlzLmF2YWlsYWJsZSAtLTtcblxuICAgICAgICAgIHJvLm1zZyA9IG9iajtcbiAgICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XG4gICAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgcm87XG5cbiAgICB3aGlsZSAocm8gPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgICAgICAgICAvLyBpZiBvYmogaXMgY2FuY2VsbGVkLi4gcmVtb3ZlIGl0LlxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAodGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHJvLm9iaik7XG4gICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1dFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xuICB9XG5cbiAgZ2V0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UXVldWUuc3RhdHM7XG4gIH1cbn1cblxuY2xhc3MgRXZlbnQgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDEpO1xuXG4gICAgdGhpcy53YWl0TGlzdCA9IFtdO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGFkZFdhaXRMaXN0KHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMud2FpdExpc3QucHVzaChybyk7XG4gIH1cblxuICBhZGRRdWV1ZShybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBpZiAodGhpcy5pc0ZpcmVkKSB7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlLnB1c2gocm8pO1xuICB9XG5cbiAgZmlyZShrZWVwRmlyZWQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDEpO1xuXG4gICAgaWYgKGtlZXBGaXJlZCkge1xuICAgICAgdGhpcy5pc0ZpcmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcbiAgICBjb25zdCB0bXBMaXN0ID0gdGhpcy53YWl0TGlzdDtcblxuICAgIHRoaXMud2FpdExpc3QgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcExpc3QubGVuZ3RoOyBpKyspIHtcblxuICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XG4gICAgfVxuXG4gICAgICAgIC8vIERpc3BhdGNoIG9uZSBxdWV1ZWQgZW50aXR5XG4gICAgY29uc3QgbHVja3kgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG5cbiAgICBpZiAobHVja3kpIHtcbiAgICAgIGx1Y2t5LmRlbGl2ZXIoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5jbGFzcyBFbnRpdHkgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKHNpbSwgbmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuc2ltID0gc2ltO1xuICB9XG5cbiAgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW0udGltZSgpO1xuICB9XG5cbiAgc2V0VGltZXIoZHVyYXRpb24pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCkgKyBkdXJhdGlvbik7XG5cbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHdhaXRFdmVudChldmVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHF1ZXVlRXZlbnQoZXZlbnQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEsIEV2ZW50KTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGV2ZW50O1xuICAgIGV2ZW50LmFkZFF1ZXVlKHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICB1c2VGYWNpbGl0eShmYWNpbGl0eSwgZHVyYXRpb24pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIsIEZhY2lsaXR5KTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGZhY2lsaXR5O1xuICAgIGZhY2lsaXR5LnVzZShkdXJhdGlvbiwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHB1dEJ1ZmZlcihidWZmZXIsIGFtb3VudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICBidWZmZXIucHV0KGFtb3VudCwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldEJ1ZmZlcihidWZmZXIsIGFtb3VudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IGJ1ZmZlcjtcbiAgICBidWZmZXIuZ2V0KGFtb3VudCwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHB1dFN0b3JlKHN0b3JlLCBvYmopIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIsIFN0b3JlKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcblxuICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xuICAgIHN0b3JlLnB1dChvYmosIHJvKTtcbiAgICByZXR1cm4gcm87XG4gIH1cblxuICBnZXRTdG9yZShzdG9yZSwgZmlsdGVyKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyLCBTdG9yZSwgRnVuY3Rpb24pO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUuZ2V0KGZpbHRlciwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHNlbmQobWVzc2FnZSwgZGVsYXksIGVudGl0aWVzKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcy5zaW0sIHRoaXMudGltZSgpLCB0aGlzLnRpbWUoKSArIGRlbGF5KTtcblxuICAgIHJvLnNvdXJjZSA9IHRoaXM7XG4gICAgcm8ubXNnID0gbWVzc2FnZTtcbiAgICByby5kYXRhID0gZW50aXRpZXM7XG4gICAgcm8uZGVsaXZlciA9IHRoaXMuc2ltLnNlbmRNZXNzYWdlO1xuXG4gICAgdGhpcy5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc2ltLmxvZyhtZXNzYWdlLCB0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTaW0sIEZhY2lsaXR5LCBCdWZmZXIsIFN0b3JlLCBFdmVudCwgRW50aXR5LCBhcmdDaGVjayB9O1xuIiwiaW1wb3J0IHsgYXJnQ2hlY2sgfSBmcm9tICcuL3NpbS5qcyc7XG5cbmNsYXNzIERhdGFTZXJpZXMge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLkNvdW50ID0gMDtcbiAgICB0aGlzLlcgPSAwLjA7XG4gICAgdGhpcy5BID0gMC4wO1xuICAgIHRoaXMuUSA9IDAuMDtcbiAgICB0aGlzLk1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLk1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMuU3VtID0gMDtcblxuICAgIGlmICh0aGlzLmhpc3RvZ3JhbSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMywgMyk7XG5cbiAgICB0aGlzLmhMb3dlciA9IGxvd2VyO1xuICAgIHRoaXMuaFVwcGVyID0gdXBwZXI7XG4gICAgdGhpcy5oQnVja2V0U2l6ZSA9ICh1cHBlciAtIGxvd2VyKSAvIG5idWNrZXRzO1xuICAgIHRoaXMuaGlzdG9ncmFtID0gbmV3IEFycmF5KG5idWNrZXRzICsgMik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZ2V0SGlzdG9ncmFtKCkge1xuICAgIHJldHVybiB0aGlzLmhpc3RvZ3JhbTtcbiAgfVxuXG4gIHJlY29yZCh2YWx1ZSwgd2VpZ2h0KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyKTtcblxuICAgIGNvbnN0IHcgPSAodHlwZW9mIHdlaWdodCA9PT0gJ3VuZGVmaW5lZCcpID8gMSA6IHdlaWdodDtcblxuICAgICAgICAvLyBkb2N1bWVudC53cml0ZShcIkRhdGEgc2VyaWVzIHJlY29yZGluZyBcIiArIHZhbHVlICsgXCIgKHdlaWdodCA9IFwiICsgdyArIFwiKVxcblwiKTtcblxuICAgIGlmICh2YWx1ZSA+IHRoaXMuTWF4KSB0aGlzLk1heCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSA8IHRoaXMuTWluKSB0aGlzLk1pbiA9IHZhbHVlO1xuICAgIHRoaXMuU3VtICs9IHZhbHVlO1xuICAgIHRoaXMuQ291bnQgKys7XG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBpZiAodmFsdWUgPCB0aGlzLmhMb3dlcikge1xuICAgICAgICB0aGlzLmhpc3RvZ3JhbVswXSArPSB3O1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IHRoaXMuaFVwcGVyKSB7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW3RoaXMuaGlzdG9ncmFtLmxlbmd0aCAtIDFdICs9IHc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHZhbHVlIC0gdGhpcy5oTG93ZXIpIC8gdGhpcy5oQnVja2V0U2l6ZSkgKyAxO1xuXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW2luZGV4XSArPSB3O1xuICAgICAgfVxuICAgIH1cblxuICAgICAgICAvLyBXaSA9IFdpLTEgKyB3aVxuICAgIHRoaXMuVyA9IHRoaXMuVyArIHc7XG5cbiAgICBpZiAodGhpcy5XID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgICAgIC8vIEFpID0gQWktMSArIHdpL1dpICogKHhpIC0gQWktMSlcbiAgICBjb25zdCBsYXN0QSA9IHRoaXMuQTtcblxuICAgIHRoaXMuQSA9IGxhc3RBICsgKHcgLyB0aGlzLlcpICogKHZhbHVlIC0gbGFzdEEpO1xuXG4gICAgICAgIC8vIFFpID0gUWktMSArIHdpKHhpIC0gQWktMSkoeGkgLSBBaSlcbiAgICB0aGlzLlEgPSB0aGlzLlEgKyB3ICogKHZhbHVlIC0gbGFzdEEpICogKHZhbHVlIC0gdGhpcy5BKTtcbiAgICAgICAgLy8gcHJpbnQoXCJcXHRXPVwiICsgdGhpcy5XICsgXCIgQT1cIiArIHRoaXMuQSArIFwiIFE9XCIgKyB0aGlzLlEgKyBcIlxcblwiKTtcbiAgfVxuXG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLkNvdW50O1xuICB9XG5cbiAgbWluKCkge1xuICAgIHJldHVybiB0aGlzLk1pbjtcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5NYXg7XG4gIH1cblxuICByYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5NYXggLSB0aGlzLk1pbjtcbiAgfVxuXG4gIHN1bSgpIHtcbiAgICByZXR1cm4gdGhpcy5TdW07XG4gIH1cblxuICBzdW1XZWlnaHRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5BICogdGhpcy5XO1xuICB9XG5cbiAgYXZlcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5BO1xuICB9XG5cbiAgdmFyaWFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuUSAvIHRoaXMuVztcbiAgfVxuXG4gIGRldmlhdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMudmFyaWFuY2UoKSk7XG4gIH1cbn1cblxuY2xhc3MgVGltZVNlcmllcyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLmRhdGFTZXJpZXMgPSBuZXcgRGF0YVNlcmllcyhuYW1lKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGF0YVNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMubGFzdFZhbHVlID0gTmFOO1xuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IE5hTjtcbiAgfVxuXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAzLCAzKTtcbiAgICB0aGlzLmRhdGFTZXJpZXMuc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpO1xuICB9XG5cbiAgZ2V0SGlzdG9ncmFtKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZ2V0SGlzdG9ncmFtKCk7XG4gIH1cblxuICByZWNvcmQodmFsdWUsIHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAoIWlzTmFOKHRoaXMubGFzdFRpbWVzdGFtcCkpIHtcbiAgICAgIHRoaXMuZGF0YVNlcmllcy5yZWNvcmQodGhpcy5sYXN0VmFsdWUsIHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5yZWNvcmQoTmFOLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5jb3VudCgpO1xuICB9XG5cbiAgbWluKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMubWluKCk7XG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5tYXgoKTtcbiAgfVxuXG4gIHJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMucmFuZ2UoKTtcbiAgfVxuXG4gIHN1bSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnN1bSgpO1xuICB9XG5cbiAgYXZlcmFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmF2ZXJhZ2UoKTtcbiAgfVxuXG4gIGRldmlhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmRldmlhdGlvbigpO1xuICB9XG5cbiAgdmFyaWFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy52YXJpYW5jZSgpO1xuICB9XG59XG5cbmNsYXNzIFBvcHVsYXRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICAgIHRoaXMuc2l6ZVNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNpemVTZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5wb3B1bGF0aW9uID0gMDtcbiAgfVxuXG4gIGVudGVyKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnBvcHVsYXRpb24gKys7XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIHRpbWVzdGFtcCk7XG4gIH1cblxuICBsZWF2ZShhcnJpdmFsQXQsIGxlZnRBdCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICB0aGlzLnBvcHVsYXRpb24gLS07XG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIGxlZnRBdCk7XG4gICAgdGhpcy5kdXJhdGlvblNlcmllcy5yZWNvcmQobGVmdEF0IC0gYXJyaXZhbEF0KTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIHRoaXMuc2l6ZVNlcmllcy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG59XG5cbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcbiIsImltcG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUsIGFyZ0NoZWNrIH0gZnJvbSAnLi9saWIvc2ltLmpzJztcbmltcG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfSBmcm9tICcuL2xpYi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnLi9saWIvcmVxdWVzdC5qcyc7XG5pbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9saWIvcXVldWVzLmpzJztcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJy4vbGliL3JhbmRvbS5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbGliL21vZGVsLmpzJztcblxuZXhwb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSB9O1xuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuZXhwb3J0IHsgUmVxdWVzdCB9O1xuZXhwb3J0IHsgUFF1ZXVlLCBRdWV1ZSwgYXJnQ2hlY2sgfTtcbmV4cG9ydCB7IFJhbmRvbSB9O1xuZXhwb3J0IHsgTW9kZWwgfTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5TaW0gPSB7XG4gICAgYXJnQ2hlY2s6IGFyZ0NoZWNrLFxuICAgIEJ1ZmZlcjogQnVmZmVyLFxuICAgIERhdGFTZXJpZXM6IERhdGFTZXJpZXMsXG4gICAgRW50aXR5OiBFbnRpdHksXG4gICAgRXZlbnQ6IEV2ZW50LFxuICAgIEZhY2lsaXR5OiBGYWNpbGl0eSxcbiAgICBNb2RlbDogTW9kZWwsXG4gICAgUFF1ZXVlOiBQUXVldWUsXG4gICAgUG9wdWxhdGlvbjogUG9wdWxhdGlvbixcbiAgICBRdWV1ZTogUXVldWUsXG4gICAgUmFuZG9tOiBSYW5kb20sXG4gICAgUmVxdWVzdDogUmVxdWVzdCxcbiAgICBTaW06IFNpbSxcbiAgICBTdG9yZTogU3RvcmUsXG4gICAgVGltZVNlcmllczogVGltZVNlcmllc1xuICB9O1xufVxuIl19
