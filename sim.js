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
          this.entities[i].finalize(this.simTime);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsOEdBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLElBQUksaUJBQUosRUFBYjtBQUpnQjtBQUtqQjs7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQVEsS0FBSyxJQUFMLENBQVUsTUFBWCxHQUFxQixLQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQTdCLENBQXJCLEdBQXVE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LEVBQW1DO0FBQ2pDLFNBQU8sR0FBUCxHQUFhO0FBQ1gsY0FBVSxhQURDO0FBRVgsWUFBUSxXQUZHO0FBR1gsZ0JBQVksaUJBSEQ7QUFJWCxZQUFRLFdBSkc7QUFLWCxXQUFPLFVBTEk7QUFNWCxjQUFVLGFBTkM7QUFPWCxXQUFPLFlBUEk7QUFRWCxZQUFRLGNBUkc7QUFTWCxnQkFBWSxpQkFURDtBQVVYLFdBQU8sYUFWSTtBQVdYLFlBQVEsY0FYRztBQVlYLGFBQVMsZ0JBWkU7QUFhWCxTQUFLLFFBYk07QUFjWCxXQUFPLFVBZEk7QUFlWCxnQkFBWTtBQWZELEdBQWI7QUFpQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgdGhpcy5pZCA9IHRoaXMuY29uc3RydWN0b3IuX25leHRJZCgpO1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ICR7dGhpcy5pZH1gO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCB0b3RhbEluc3RhbmNlcygpIHtcclxuICAgIHJldHVybiAhdGhpcy5fdG90YWxJbnN0YW5jZXMgPyAwIDogdGhpcy5fdG90YWxJbnN0YW5jZXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgX25leHRJZCgpIHtcclxuICAgIHRoaXMuX3RvdGFsSW5zdGFuY2VzID0gdGhpcy50b3RhbEluc3RhbmNlcyArIDE7XHJcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJbnN0YW5jZXM7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBNb2RlbCB9O1xyXG5leHBvcnQgZGVmYXVsdCBNb2RlbDtcclxuIiwiaW1wb3J0IHsgYXJnQ2hlY2sgfSBmcm9tICcuL3NpbS5qcyc7XHJcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcclxuXHJcbmNsYXNzIFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xyXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XHJcbiAgfVxyXG5cclxuICB0b3AoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xyXG4gIH1cclxuXHJcbiAgYmFjaygpIHtcclxuICAgIHJldHVybiAodGhpcy5kYXRhLmxlbmd0aCkgPyB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdIDogbnVsbDtcclxuICB9XHJcblxyXG4gIHB1c2godmFsdWUsIHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcclxuICAgIHRoaXMudGltZXN0YW1wLnB1c2godGltZXN0YW1wKTtcclxuXHJcbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XHJcbiAgfVxyXG5cclxuICB1bnNoaWZ0KHZhbHVlLCB0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcbiAgICB0aGlzLmRhdGEudW5zaGlmdCh2YWx1ZSk7XHJcbiAgICB0aGlzLnRpbWVzdGFtcC51bnNoaWZ0KHRpbWVzdGFtcCk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgc2hpZnQodGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnNoaWZ0KCk7XHJcblxyXG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnNoaWZ0KCk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcG9wKHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5wb3AoKTtcclxuXHJcbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAucG9wKCk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcGFzc2J5KHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICB0aGlzLnN0YXRzLmVudGVyKHRpbWVzdGFtcCk7XHJcbiAgICB0aGlzLnN0YXRzLmxlYXZlKHRpbWVzdGFtcCwgdGltZXN0YW1wKTtcclxuICB9XHJcblxyXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XHJcbiAgfVxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcmVwb3J0KCkge1xyXG4gICAgcmV0dXJuIFt0aGlzLnN0YXRzLnNpemVTZXJpZXMuYXZlcmFnZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0cy5kdXJhdGlvblNlcmllcy5hdmVyYWdlKCldO1xyXG4gIH1cclxuXHJcbiAgZW1wdHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aCA9PT0gMDtcclxuICB9XHJcblxyXG4gIHNpemUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICBzdXBlcihuYW1lKTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5vcmRlciA9IDA7XHJcbiAgfVxyXG5cclxuICBncmVhdGVyKHJvMSwgcm8yKSB7XHJcbiAgICBpZiAocm8xLmRlbGl2ZXJBdCA+IHJvMi5kZWxpdmVyQXQpIHJldHVybiB0cnVlO1xyXG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPT09IHJvMi5kZWxpdmVyQXQpIHJldHVybiBybzEub3JkZXIgPiBybzIub3JkZXI7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpbnNlcnQocm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcbiAgICByby5vcmRlciA9IHRoaXMub3JkZXIgKys7XHJcblxyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLmxlbmd0aDtcclxuXHJcbiAgICB0aGlzLmRhdGEucHVzaChybyk7XHJcblxyXG4gICAgICAgIC8vIGluc2VydCBpbnRvIGRhdGEgYXQgdGhlIGVuZFxyXG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICBjb25zdCBub2RlID0gYVtpbmRleF07XHJcblxyXG4gICAgICAgIC8vIGhlYXAgdXBcclxuICAgIHdoaWxlIChpbmRleCA+IDApIHtcclxuICAgICAgY29uc3QgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XHJcblxyXG4gICAgICBpZiAodGhpcy5ncmVhdGVyKGFbcGFyZW50SW5kZXhdLCBybykpIHtcclxuICAgICAgICBhW2luZGV4XSA9IGFbcGFyZW50SW5kZXhdO1xyXG4gICAgICAgIGluZGV4ID0gcGFyZW50SW5kZXg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGFbaW5kZXhdID0gbm9kZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGNvbnN0IGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xyXG5cclxuICAgIGlmIChsZW4gPD0gMCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGlmIChsZW4gPT09IDEpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wb3AoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRvcCA9IGFbMF07XHJcblxyXG4gICAgICAgIC8vIG1vdmUgdGhlIGxhc3Qgbm9kZSB1cFxyXG4gICAgYVswXSA9IGEucG9wKCk7XHJcbiAgICBsZW4tLTtcclxuXHJcbiAgICAgICAgLy8gaGVhcCBkb3duXHJcbiAgICBsZXQgaW5kZXggPSAwO1xyXG5cclxuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcclxuXHJcbiAgICB3aGlsZSAoaW5kZXggPCBNYXRoLmZsb29yKGxlbiAvIDIpKSB7XHJcbiAgICAgIGNvbnN0IGxlZnRDaGlsZEluZGV4ID0gMiAqIGluZGV4ICsgMTtcclxuXHJcbiAgICAgIGNvbnN0IHJpZ2h0Q2hpbGRJbmRleCA9IDIgKiBpbmRleCArIDI7XHJcblxyXG4gICAgICBjb25zdCBzbWFsbGVyQ2hpbGRJbmRleCA9IHJpZ2h0Q2hpbGRJbmRleCA8IGxlblxyXG4gICAgICAgICAgICAgICYmICF0aGlzLmdyZWF0ZXIoYVtyaWdodENoaWxkSW5kZXhdLCBhW2xlZnRDaGlsZEluZGV4XSlcclxuICAgICAgICAgICAgICAgICAgICA/IHJpZ2h0Q2hpbGRJbmRleCA6IGxlZnRDaGlsZEluZGV4O1xyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JlYXRlcihhW3NtYWxsZXJDaGlsZEluZGV4XSwgbm9kZSkpIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgYVtpbmRleF0gPSBhW3NtYWxsZXJDaGlsZEluZGV4XTtcclxuICAgICAgaW5kZXggPSBzbWFsbGVyQ2hpbGRJbmRleDtcclxuICAgIH1cclxuICAgIGFbaW5kZXhdID0gbm9kZTtcclxuICAgIHJldHVybiB0b3A7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBRdWV1ZSwgUFF1ZXVlIH07XHJcbiIsIlxyXG5jbGFzcyBSYW5kb20ge1xyXG4gIGNvbnN0cnVjdG9yKHNlZWQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSB7XHJcbiAgICBpZiAodHlwZW9mIChzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgICAgICAgIHx8IE1hdGguY2VpbChzZWVkKSAhPT0gTWF0aC5mbG9vcihzZWVkKSkgeyAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlcicpOyAvLyBhcmdDaGVja1xyXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcblxyXG5cclxuICAgICAgICAvKiBQZXJpb2QgcGFyYW1ldGVycyAqL1xyXG4gICAgdGhpcy5OID0gNjI0O1xyXG4gICAgdGhpcy5NID0gMzk3O1xyXG4gICAgdGhpcy5NQVRSSVhfQSA9IDB4OTkwOGIwZGY7LyogY29uc3RhbnQgdmVjdG9yIGEgKi9cclxuICAgIHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7LyogbW9zdCBzaWduaWZpY2FudCB3LXIgYml0cyAqL1xyXG4gICAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cclxuXHJcbiAgICB0aGlzLm10ID0gbmV3IEFycmF5KHRoaXMuTik7LyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXHJcbiAgICB0aGlzLm10aSA9IHRoaXMuTiArIDE7LyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXHJcblxyXG4gICAgICAgIC8vIHRoaXMuaW5pdEdlbnJhbmQoc2VlZCk7XHJcbiAgICB0aGlzLmluaXRCeUFycmF5KFtzZWVkXSwgMSk7XHJcbiAgfVxyXG5cclxuICBpbml0R2VucmFuZChzKSB7XHJcbiAgICB0aGlzLm10WzBdID0gcyA+Pj4gMDtcclxuICAgIGZvciAodGhpcy5tdGkgPSAxOyB0aGlzLm10aSA8IHRoaXMuTjsgdGhpcy5tdGkrKykge1xyXG4gICAgICBzID0gdGhpcy5tdFt0aGlzLm10aSAtIDFdIF4gKHRoaXMubXRbdGhpcy5tdGkgLSAxXSA+Pj4gMzApO1xyXG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1MylcclxuICAgICAgICAgICAgKyB0aGlzLm10aTtcclxuXHJcbiAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xyXG4gICAgICAvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cclxuICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xyXG4gICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xyXG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0QnlBcnJheShpbml0S2V5LCBrZXlMZW5ndGgpIHtcclxuICAgIGxldCBpLCBqLCBrO1xyXG5cclxuICAgIHRoaXMuaW5pdEdlbnJhbmQoMTk2NTAyMTgpO1xyXG4gICAgaSA9IDE7IGogPSAwO1xyXG4gICAgayA9ICh0aGlzLk4gPiBrZXlMZW5ndGggPyB0aGlzLk4gOiBrZXlMZW5ndGgpO1xyXG4gICAgZm9yICg7IGs7IGstLSkge1xyXG4gICAgICBjb25zdCBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcclxuXHJcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNjY0NTI1KSA8PCAxNikgKyAoKHMgJiAweDAwMDBmZmZmKSAqIDE2NjQ1MjUpKSlcclxuICAgICAgICAgICAgKyBpbml0S2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cclxuICAgICAgaSsrOyBqKys7XHJcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cclxuICAgICAgaWYgKGogPj0ga2V5TGVuZ3RoKSBqID0gMDtcclxuICAgIH1cclxuICAgIGZvciAoayA9IHRoaXMuTiAtIDE7IGs7IGstLSkge1xyXG4gICAgICBjb25zdCBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcclxuXHJcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXHJcbiAgICAgICAgICAgIC0gaTsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cclxuICAgICAgaSsrO1xyXG4gICAgICBpZiAoaSA+PSB0aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OIC0gMV07IGkgPSAxOyB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tdFswXSA9IDB4ODAwMDAwMDA7IC8qIE1TQiBpcyAxOyBhc3N1cmluZyBub24temVybyBpbml0aWFsIGFycmF5ICovXHJcbiAgfVxyXG5cclxuICBnZW5yYW5kSW50MzIoKSB7XHJcbiAgICBsZXQgeTtcclxuXHJcbiAgICBjb25zdCBtYWcwMSA9IFsweDAsIHRoaXMuTUFUUklYX0FdO1xyXG5cclxuICAgICAgICAvLyAgbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMVxyXG5cclxuICAgIGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgIC8vIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWVcclxuICAgICAgbGV0IGtrO1xyXG5cclxuICAgICAgaWYgKHRoaXMubXRpID09PSB0aGlzLk4gKyAxKSB7ICAvLyBpZiBpbml0R2VucmFuZCgpIGhhcyBub3QgYmVlbiBjYWxsZWQsXHJcbiAgICAgICAgdGhpcy5pbml0R2VucmFuZCg1NDg5KTsgLy8gYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoa2sgPSAwOyBrayA8IHRoaXMuTiAtIHRoaXMuTTsga2srKykge1xyXG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XHJcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoO2trIDwgdGhpcy5OIC0gMTsga2srKykge1xyXG4gICAgICAgIHkgPSAodGhpcy5tdFtra10gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRba2sgKyAxXSAmIHRoaXMuTE9XRVJfTUFTSyk7XHJcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgKHRoaXMuTSAtIHRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcbiAgICAgIH1cclxuICAgICAgeSA9ICh0aGlzLm10W3RoaXMuTiAtIDFdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10WzBdICYgdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgICAgdGhpcy5tdFt0aGlzLk4gLSAxXSA9IHRoaXMubXRbdGhpcy5NIC0gMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuXHJcbiAgICAgIHRoaXMubXRpID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcclxuXHJcbiAgICAgICAgLyogVGVtcGVyaW5nICovXHJcbiAgICB5IF49ICh5ID4+PiAxMSk7XHJcbiAgICB5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcclxuICAgIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcclxuICAgIHkgXj0gKHkgPj4+IDE4KTtcclxuXHJcbiAgICByZXR1cm4geSA+Pj4gMDtcclxuICB9XHJcblxyXG4gIGdlbnJhbmRJbnQzMSgpIHtcclxuICAgIHJldHVybiAodGhpcy5nZW5yYW5kSW50MzIoKSA+Pj4gMSk7XHJcbiAgfVxyXG5cclxuICBnZW5yYW5kUmVhbDEoKSB7XHJcbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzItMVxyXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZEludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5NS4wKTtcclxuICB9XHJcblxyXG4gIHJhbmRvbSgpIHtcclxuICAgIGlmICh0aGlzLnB5dGhvbkNvbXBhdGliaWxpdHkpIHtcclxuICAgICAgaWYgKHRoaXMuc2tpcCkge1xyXG4gICAgICAgIHRoaXMuZ2VucmFuZEludDMyKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIGRpdmlkZWQgYnkgMl4zMlxyXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZEludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcclxuICB9XHJcblxyXG4gIGdlbnJhbmRSZWFsMygpIHtcclxuICAgIC8vIGRpdmlkZWQgYnkgMl4zMlxyXG4gICAgcmV0dXJuICh0aGlzLmdlbnJhbmRJbnQzMigpICsgMC41KSAqICgxLjAgLyA0Mjk0OTY3Mjk2LjApO1xyXG4gIH1cclxuXHJcbiAgZ2VucmFuZFJlczUzKCkge1xyXG4gICAgY29uc3QgYSA9IHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDU7XHJcbiAgICBjb25zdCBiID0gdGhpcy5nZW5yYW5kSW50MzIoKSA+Pj4gNjtcclxuXHJcbiAgICByZXR1cm4gKGEgKiA2NzEwODg2NC4wICsgYikgKiAoMS4wIC8gOTAwNzE5OTI1NDc0MDk5Mi4wKTtcclxuICB9XHJcblxyXG4gIGV4cG9uZW50aWFsKGxhbWJkYSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdleHBvbmVudGlhbCgpIG11c3QgIGJlIGNhbGxlZCB3aXRoIFxcJ2xhbWJkYVxcJyBwYXJhbWV0ZXInKTsgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG5cclxuICAgIGNvbnN0IHIgPSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgIHJldHVybiAtTWF0aC5sb2cocikgLyBsYW1iZGE7XHJcbiAgfVxyXG5cclxuICBnYW1tYShhbHBoYSwgYmV0YSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdnYW1tYSgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAvLyBhcmdDaGVja1xyXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcblxyXG4gICAgICAgIC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgIGxldCB1O1xyXG5cclxuICAgIGlmIChhbHBoYSA+IDEuMCkge1xyXG4gICAgICBjb25zdCBhaW52ID0gTWF0aC5zcXJ0KDIuMCAqIGFscGhhIC0gMS4wKTtcclxuXHJcbiAgICAgIGNvbnN0IGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xyXG5cclxuICAgICAgY29uc3QgY2NjID0gYWxwaGEgKyBhaW52O1xyXG5cclxuICAgICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXHJcbiAgICAgICAgY29uc3QgdTEgPSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICBpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICBjb25zdCB2ID0gTWF0aC5sb2codTEgLyAoMS4wIC0gdTEpKSAvIGFpbnY7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBhbHBoYSAqIE1hdGguZXhwKHYpO1xyXG5cclxuICAgICAgICBjb25zdCB6ID0gdTEgKiB1MSAqIHUyO1xyXG5cclxuICAgICAgICBjb25zdCByID0gYmJiICsgY2NjICogdiAtIHg7XHJcblxyXG4gICAgICAgIGlmICgociArIHRoaXMuU0dfTUFHSUNDT05TVCAtIDQuNSAqIHogPj0gMC4wKSB8fCAociA+PSBNYXRoLmxvZyh6KSkpIHtcclxuICAgICAgICAgIHJldHVybiB4ICogYmV0YTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYWxwaGEgPT09IDEuMCkge1xyXG4gICAgICB1ID0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICAgIHdoaWxlICh1IDw9IDFlLTcpIHtcclxuICAgICAgICB1ID0gdGhpcy5yYW5kb20oKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gLU1hdGgubG9nKHUpICogYmV0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCB4O1xyXG5cclxuICAgICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXHJcbiAgICAgICAgdSA9IHRoaXMucmFuZG9tKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xyXG5cclxuICAgICAgICBjb25zdCBwID0gYiAqIHU7XHJcblxyXG4gICAgICAgIGlmIChwIDw9IDEuMCkge1xyXG4gICAgICAgICAgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHggPSAtTWF0aC5sb2coKGIgLSBwKSAvIGFscGhhKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHUxID0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgaWYgKHAgPiAxLjApIHtcclxuICAgICAgICAgIGlmICh1MSA8PSBNYXRoLnBvdyh4LCAoYWxwaGEgLSAxLjApKSkge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHUxIDw9IE1hdGguZXhwKC14KSkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB4ICogYmV0YTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBub3JtYWwobXUsIHNpZ21hKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdub3JtYWwoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzJyk7ICAgICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuXHJcbiAgICBsZXQgeiA9IHRoaXMubGFzdE5vcm1hbDtcclxuXHJcbiAgICB0aGlzLmxhc3ROb3JtYWwgPSBOYU47XHJcbiAgICBpZiAoIXopIHtcclxuICAgICAgY29uc3QgYSA9IHRoaXMucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuXHJcbiAgICAgIGNvbnN0IGIgPSBNYXRoLnNxcnQoLTIuMCAqIE1hdGgubG9nKDEuMCAtIHRoaXMucmFuZG9tKCkpKTtcclxuXHJcbiAgICAgIHogPSBNYXRoLmNvcyhhKSAqIGI7XHJcbiAgICAgIHRoaXMubGFzdE5vcm1hbCA9IE1hdGguc2luKGEpICogYjtcclxuICAgIH1cclxuICAgIHJldHVybiBtdSArIHogKiBzaWdtYTtcclxuICB9XHJcblxyXG4gIHBhcmV0byhhbHBoYSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdwYXJldG8oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGFscGhhIHBhcmFtZXRlcicpOyAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcblxyXG4gICAgY29uc3QgdSA9IHRoaXMucmFuZG9tKCk7XHJcblxyXG4gICAgcmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcclxuICB9XHJcblxyXG4gIHRyaWFuZ3VsYXIobG93ZXIsIHVwcGVyLCBtb2RlKSB7XHJcbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcclxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCd0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVycycpOyAgICAvLyBhcmdDaGVja1xyXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcblxyXG4gICAgY29uc3QgYyA9IChtb2RlIC0gbG93ZXIpIC8gKHVwcGVyIC0gbG93ZXIpO1xyXG5cclxuICAgIGNvbnN0IHUgPSB0aGlzLnJhbmRvbSgpO1xyXG5cclxuICAgIGlmICh1IDw9IGMpIHtcclxuICAgICAgcmV0dXJuIGxvd2VyICsgTWF0aC5zcXJ0KHUgKiAodXBwZXIgLSBsb3dlcikgKiAobW9kZSAtIGxvd2VyKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogQWxsIGZsb2F0cyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBhcmUgZXF1YWxseSBsaWtlbHkuIFRoaXMgaXMgdGhlXHJcbiAgKiB0aGVvcmV0aWNhbCBkaXN0cmlidXRpb24gbW9kZWwgZm9yIGEgYmFsYW5jZWQgY29pbiwgYW4gdW5iaWFzZWQgZGllLCBhXHJcbiAgKiBjYXNpbm8gcm91bGV0dGUsIG9yIHRoZSBmaXJzdCBjYXJkIG9mIGEgd2VsbC1zaHVmZmxlZCBkZWNrLlxyXG4gICpcclxuICAqIEBwYXJhbSB7TnVtYmVyfSBsb3dlclxyXG4gICogQHBhcmFtIHtOdW1iZXJ9IHVwcGVyXHJcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICovXHJcbiAgdW5pZm9ybShsb3dlciwgdXBwZXIpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcclxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xyXG4gICAgcmV0dXJuIGxvd2VyICsgdGhpcy5yYW5kb20oKSAqICh1cHBlciAtIGxvd2VyKTtcclxuICB9XHJcblxyXG4gIHdlaWJ1bGwoYWxwaGEsIGJldGEpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignd2VpYnVsbCgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAgICAvLyBhcmdDaGVja1xyXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXHJcbiAgICBjb25zdCB1ID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcclxuXHJcbiAgICByZXR1cm4gYWxwaGEgKiBNYXRoLnBvdygtTWF0aC5sb2codSksIDEuMCAvIGJldGEpO1xyXG4gIH1cclxufVxyXG5cclxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cclxuXHJcblxyXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xyXG5SYW5kb20ucHJvdG90eXBlLlNHX01BR0lDQ09OU1QgPSAxLjAgKyBNYXRoLmxvZyg0LjUpO1xyXG5cclxuZXhwb3J0IHsgUmFuZG9tIH07XHJcbmV4cG9ydCBkZWZhdWx0IFJhbmRvbTtcclxuIiwiaW1wb3J0IHsgYXJnQ2hlY2ssIFN0b3JlLCBCdWZmZXIsIEV2ZW50IH0gZnJvbSAnLi9zaW0uanMnO1xyXG5cclxuY2xhc3MgUmVxdWVzdCB7XHJcbiAgY29uc3RydWN0b3IoZW50aXR5LCBjdXJyZW50VGltZSwgZGVsaXZlckF0KSB7XHJcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuICAgIHRoaXMuc2NoZWR1bGVkQXQgPSBjdXJyZW50VGltZTtcclxuICAgIHRoaXMuZGVsaXZlckF0ID0gZGVsaXZlckF0O1xyXG4gICAgdGhpcy5kZWxpdmVyeVBlbmRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XHJcbiAgICB0aGlzLmNhbmNlbGxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5ncm91cCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjYW5jZWwoKSB7XHJcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxyXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cFswXSAhPT0gdGhpcykge1xyXG4gICAgICByZXR1cm4gdGhpcy5ncm91cFswXS5jYW5jZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLy8gLS0+IHRoaXMgaXMgbWFpbiByZXF1ZXN0XHJcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGlmIGFscmVhZHkgY2FuY2VsbGVkLCBkbyBub3RoaW5nXHJcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gUHJldmVudCBjYW5jZWxsYXRpb24gaWYgcmVxdWVzdCBpcyBhYm91dCB0byBiZSBkZWxpdmVyZWQgYXQgdGhpc1xyXG4gICAgICAgIC8vIGluc3RhbnQuIENvdmVycyBjYXNlIHdoZXJlIGluIGEgYnVmZmVyIG9yIHN0b3JlLCBvYmplY3QgaGFzIGFscmVhZHlcclxuICAgICAgICAvLyBiZWVuIGRlcXVldWVkIGFuZCBkZWxpdmVyeSB3YXMgc2NoZWR1bGVkIGZvciBub3csIGJ1dCB3YWl0VW50aWxcclxuICAgICAgICAvLyB0aW1lcyBvdXQgYXQgdGhlIHNhbWUgdGltZSwgbWFraW5nIHRoZSByZXF1ZXN0IGdldCBjYW5jZWxsZWQgYWZ0ZXJcclxuICAgICAgICAvLyB0aGUgb2JqZWN0IGlzIGRlcXVldWVkIGJ1dCBiZWZvcmUgaXQgaXMgZGVsaXZlcmVkLlxyXG4gICAgaWYgKHRoaXMuZGVsaXZlcnlQZW5kaW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIHNldCBmbGFnXHJcbiAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHRoaXMuZGVsaXZlckF0ID09PSAwKSB7XHJcbiAgICAgIHRoaXMuZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNvdXJjZSkge1xyXG4gICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHx8ICh0aGlzLnNvdXJjZSBpbnN0YW5jZW9mIFN0b3JlKSkge1xyXG4gICAgICAgIHRoaXMuc291cmNlLnByb2dyZXNzUHV0UXVldWUoKTtcclxuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc0dldFF1ZXVlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuZ3JvdXApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XHJcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkb25lKGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAwLCAzLCBGdW5jdGlvbiwgT2JqZWN0KTtcclxuXHJcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgd2FpdFVudGlsKGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCwgbnVsbCwgRnVuY3Rpb24sIE9iamVjdCk7XHJcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KFxyXG4gICAgICB0aGlzLnNjaGVkdWxlZEF0ICsgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XHJcblxyXG4gICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHVubGVzc0V2ZW50KGV2ZW50LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCwgbnVsbCwgRnVuY3Rpb24sIE9iamVjdCk7XHJcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcclxuICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XHJcblxyXG4gICAgICByby5tc2cgPSBldmVudDtcclxuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvID0gdGhpcy5fYWRkUmVxdWVzdCgwLCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xyXG5cclxuICAgICAgICByby5tc2cgPSBldmVudFtpXTtcclxuICAgICAgICBldmVudFtpXS5hZGRXYWl0TGlzdChybyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNldERhdGEoZGF0YSkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgZGVsaXZlcigpIHtcclxuICAgICAgICAvLyBQcmV2ZW50IGRlbGl2ZXJ5IG9mIGNoaWxkIHJlcXVlc3RzIGlmIG1haW4gcmVxdWVzdCBpcyBhYm91dCB0byBiZVxyXG4gICAgICAgIC8vIGRlbGl2ZXJlZCBhdCB0aGlzIGluc3RhbnQuIFNlZSBjb21tZW50IGluIGNhbmNlbCBhYm92ZVxyXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cFswXS5kZWxpdmVyeVBlbmRpbmcgJiYgdGhpcy5ncm91cFswXSAhPT0gdGhpcykgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuZGVsaXZlcnlQZW5kaW5nID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcclxuICAgIHRoaXMuY2FuY2VsKCk7XHJcbiAgICBpZiAoIXRoaXMuY2FsbGJhY2tzKSByZXR1cm47XHJcblxyXG4gICAgaWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cFswXS5kYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjYW5jZWxSZW5lZ2VDbGF1c2VzKCkge1xyXG4gICAgICAgIC8vIHRoaXMuY2FuY2VsID0gdGhpcy5OdWxsO1xyXG4gICAgICAgIC8vIHRoaXMud2FpdFVudGlsID0gdGhpcy5OdWxsO1xyXG4gICAgICAgIC8vIHRoaXMudW5sZXNzRXZlbnQgPSB0aGlzLk51bGw7XHJcbiAgICB0aGlzLm5vUmVuZWdlID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZ3JvdXAgfHwgdGhpcy5ncm91cFswXSAhPT0gdGhpcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XHJcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuZ3JvdXBbaV0uZGVsaXZlckF0ID0gdGhpcy5lbnRpdHkudGltZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBOdWxsKCkge1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfYWRkUmVxdWVzdChkZWxpdmVyQXQsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xyXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdChcclxuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWRBdCxcclxuICAgICAgICAgICAgICAgIGRlbGl2ZXJBdCk7XHJcblxyXG4gICAgcm8uY2FsbGJhY2tzLnB1c2goW2NhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudF0pO1xyXG5cclxuICAgIGlmICh0aGlzLmdyb3VwID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuZ3JvdXAgPSBbdGhpc107XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncm91cC5wdXNoKHJvKTtcclxuICAgIHJvLmdyb3VwID0gdGhpcy5ncm91cDtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIF9kb0NhbGxiYWNrKHNvdXJjZSwgbXNnLCBkYXRhKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2ldWzBdO1xyXG5cclxuICAgICAgaWYgKCFjYWxsYmFjaykgY29udGludWU7XHJcblxyXG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMuY2FsbGJhY2tzW2ldWzFdO1xyXG5cclxuICAgICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gdGhpcy5lbnRpdHk7XHJcblxyXG4gICAgICBjb25zdCBhcmd1bWVudCA9IHRoaXMuY2FsbGJhY2tzW2ldWzJdO1xyXG5cclxuICAgICAgY29udGV4dC5jYWxsYmFja1NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgY29udGV4dC5jYWxsYmFja01lc3NhZ2UgPSBtc2c7XHJcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gZGF0YTtcclxuXHJcbiAgICAgIGlmICghYXJndW1lbnQpIHtcclxuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmd1bWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcmd1bWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBudWxsO1xyXG4gICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG51bGw7XHJcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJlcXVlc3QgfTtcclxuIiwiaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vcXVldWVzLmpzJztcclxuaW1wb3J0IHsgUG9wdWxhdGlvbiB9IGZyb20gJy4vc3RhdHMuanMnO1xyXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnLi9yZXF1ZXN0LmpzJztcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcclxuXHJcbmZ1bmN0aW9uIGFyZ0NoZWNrKGZvdW5kLCBleHBNaW4sIGV4cE1heCkge1xyXG4gIGlmIChmb3VuZC5sZW5ndGggPCBleHBNaW4gfHwgZm91bmQubGVuZ3RoID4gZXhwTWF4KSB7ICAgLy8gYXJnQ2hlY2tcclxuICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMnKTsgICAvLyBhcmdDaGVja1xyXG4gIH0gICAvLyBhcmdDaGVja1xyXG5cclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3VuZC5sZW5ndGg7IGkrKykgeyAgIC8vIGFyZ0NoZWNrXHJcblxyXG4gICAgaWYgKCFhcmd1bWVudHNbaSArIDNdIHx8ICFmb3VuZFtpXSkgY29udGludWU7ICAgLy8gYXJnQ2hlY2tcclxuXHJcbi8vICAgIHByaW50KFwiVEVTVCBcIiArIGZvdW5kW2ldICsgXCIgXCIgKyBhcmd1bWVudHNbaSArIDNdICAgLy8gYXJnQ2hlY2tcclxuLy8gICAgKyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIEV2ZW50KSAgIC8vIGFyZ0NoZWNrXHJcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBhcmd1bWVudHNbaSArIDNdKSAgIC8vIGFyZ0NoZWNrXHJcbi8vICAgICsgXCJcXG5cIik7ICAgLy8gQVJHIENIRUNLXHJcblxyXG5cclxuICAgIGlmICghKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkpIHsgICAvLyBhcmdDaGVja1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHBhcmFtZXRlciAke2kgKyAxfSBpcyBvZiBpbmNvcnJlY3QgdHlwZS5gKTsgICAvLyBhcmdDaGVja1xyXG4gICAgfSAgIC8vIGFyZ0NoZWNrXHJcbiAgfSAgIC8vIGFyZ0NoZWNrXHJcbn0gICAvLyBhcmdDaGVja1xyXG5cclxuY2xhc3MgU2ltIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2ltVGltZSA9IDA7XHJcbiAgICB0aGlzLmV2ZW50cyA9IDA7XHJcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xyXG4gICAgdGhpcy5tYXhFdmVudHMgPSAwO1xyXG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xyXG4gICAgdGhpcy5lbnRpdGllc0J5TmFtZSA9IHt9O1xyXG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBQUXVldWUoKTtcclxuICAgIHRoaXMuZW5kVGltZSA9IDA7XHJcbiAgICB0aGlzLmVudGl0eUlkID0gMTtcclxuICAgIHRoaXMucGF1c2VkID0gMDtcclxuICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdGltZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnNpbVRpbWU7XHJcbiAgfVxyXG5cclxuICBzZW5kTWVzc2FnZSgpIHtcclxuICAgIGNvbnN0IHNlbmRlciA9IHRoaXMuc291cmNlO1xyXG5cclxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLm1zZztcclxuXHJcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICBjb25zdCBzaW0gPSBzZW5kZXIuc2ltO1xyXG5cclxuICAgIGlmICghZW50aXRpZXMpIHtcclxuICAgICAgICAgICAgLy8gc2VuZCB0byBhbGwgZW50aXRpZXNcclxuICAgICAgZm9yIChsZXQgaSA9IHNpbS5lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHNpbS5lbnRpdGllc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcclxuICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGVudGl0aWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IGVudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XHJcblxyXG4gICAgICAgIGlmIChlbnRpdHkgPT09IHNlbmRlcikgY29udGludWU7XHJcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbnRpdGllcy5vbk1lc3NhZ2UpIHtcclxuICAgICAgZW50aXRpZXMub25NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRFbnRpdHkoS2xhc3MsIG5hbWUsIC4uLmFyZ3MpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCBwcm90b3R5cGUgaGFzIHN0YXJ0IGZ1bmN0aW9uXHJcbiAgICBpZiAoIUtsYXNzLnByb3RvdHlwZS5zdGFydCkgeyAgLy8gQVJHIENIRUNLXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IGNsYXNzICR7S2xhc3MubmFtZX0gbXVzdCBoYXZlIHN0YXJ0KCkgZnVuY3Rpb24gZGVmaW5lZGApO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdGhpcy5lbnRpdGllc0J5TmFtZVtuYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbnRpdHkgbmFtZSAke25hbWV9IGFscmVhZHkgZXhpc3RzYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZW50aXR5ID0gbmV3IEtsYXNzKHRoaXMsIG5hbWUpO1xyXG5cclxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmVudGl0aWVzQnlOYW1lW25hbWVdID0gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIGVudGl0eS5zdGFydCguLi5hcmdzKTtcclxuXHJcbiAgICByZXR1cm4gZW50aXR5O1xyXG4gIH1cclxuXHJcbiAgc2ltdWxhdGUoZW5kVGltZSwgbWF4RXZlbnRzKSB7XHJcbiAgICAgICAgLy8gYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyKTtcclxuICAgIGlmICghbWF4RXZlbnRzKSB7IG1heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cclxuICAgIHRoaXMuZXZlbnRzID0gMDtcclxuICAgIHRoaXMubWF4RXZlbnRzID0gbWF4RXZlbnRzO1xyXG4gICAgdGhpcy5lbmRUaW1lID0gZW5kVGltZTtcclxuICAgIHRoaXMucnVubmluZyA9IHRydWU7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcclxuICB9XHJcblxyXG4gIHBhdXNlKCkge1xyXG4gICAgKyt0aGlzLnBhdXNlZDtcclxuICB9XHJcblxyXG4gIHJlc3VtZSgpIHtcclxuICAgIGlmICh0aGlzLnBhdXNlZCA+IDApIHtcclxuICAgICAgLS10aGlzLnBhdXNlZDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnBhdXNlZCA8PSAwICYmIHRoaXMucnVubmluZykge1xyXG4gICAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cclxuICAgICAgICB0aGlzLmV2ZW50cysrO1xyXG4gICAgICAgIGlmICh0aGlzLmV2ZW50cyA+IHRoaXMubWF4RXZlbnRzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgIC8vIEdldCB0aGUgZWFybGllc3QgZXZlbnRcclxuICAgICAgICBjb25zdCBybyA9IHRoaXMucXVldWUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGV2ZW50cywgd2UgYXJlIGRvbmUgd2l0aCBzaW11bGF0aW9uIGhlcmUuXHJcbiAgICAgICAgaWYgKHJvID09PSBudWxsKSBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgLy8gVWggb2guLiB3ZSBhcmUgb3V0IG9mIHRpbWUgbm93XHJcbiAgICAgICAgaWYgKHJvLmRlbGl2ZXJBdCA+IHRoaXMuZW5kVGltZSkgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIC8vIEFkdmFuY2Ugc2ltdWxhdGlvbiB0aW1lXHJcbiAgICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiB0aGlzIGV2ZW50IGlzIGFscmVhZHkgY2FuY2VsbGVkLCBpZ25vcmVcclxuICAgICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgcm8uZGVsaXZlcigpO1xyXG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmZpbmFsaXplKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHN0ZXAoKSB7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cclxuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaWYgKHJvID09PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIHRoaXMuc2ltVGltZSA9IHJvLmRlbGl2ZXJBdDtcclxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkgY29udGludWU7XHJcbiAgICAgIHJvLmRlbGl2ZXIoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZpbmFsaXplKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICBpZiAodGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSkge1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNbaV0uZmluYWxpemUodGhpcy5zaW1UaW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TG9nZ2VyKGxvZ2dlcikge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxLCBGdW5jdGlvbik7XHJcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICB9XHJcblxyXG4gIGxvZyhtZXNzYWdlLCBlbnRpdHkpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMik7XHJcblxyXG4gICAgaWYgKCF0aGlzLmxvZ2dlcikgcmV0dXJuO1xyXG4gICAgbGV0IGVudGl0eU1zZyA9ICcnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgZW50aXR5ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBpZiAoZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICBlbnRpdHlNc2cgPSBgIFske2VudGl0eS5uYW1lfV1gO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5sb2dnZXIoYCR7dGhpcy5zaW1UaW1lLnRvRml4ZWQoNil9JHtlbnRpdHlNc2d9ICAgJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgRmFjaWxpdHkgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSwgZGlzY2lwbGluZSwgc2VydmVycywgbWF4cWxlbikge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDQpO1xyXG5cclxuICAgIHRoaXMuZnJlZSA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcclxuICAgIHRoaXMuc2VydmVycyA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcclxuICAgIHRoaXMubWF4cWxlbiA9ICh0eXBlb2YgbWF4cWxlbiA9PT0gJ3VuZGVmaW5lZCcpID8gLTEgOiAxICogbWF4cWxlbjtcclxuXHJcbiAgICBzd2l0Y2ggKGRpc2NpcGxpbmUpIHtcclxuXHJcbiAgICBjYXNlIEZhY2lsaXR5LkxDRlM6XHJcbiAgICAgIHRoaXMudXNlID0gdGhpcy51c2VMQ0ZTO1xyXG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBGYWNpbGl0eS5QUzpcclxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmc7XHJcbiAgICAgIHRoaXMucXVldWUgPSBbXTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIEZhY2lsaXR5LkZDRlM6XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlRkNGUztcclxuICAgICAgdGhpcy5mcmVlU2VydmVycyA9IG5ldyBBcnJheSh0aGlzLnNlcnZlcnMpO1xyXG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mcmVlU2VydmVycy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdHMgPSBuZXcgUG9wdWxhdGlvbigpO1xyXG4gICAgdGhpcy5idXN5RHVyYXRpb24gPSAwO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnF1ZXVlLnJlc2V0KCk7XHJcbiAgICB0aGlzLnN0YXRzLnJlc2V0KCk7XHJcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XHJcbiAgfVxyXG5cclxuICBzeXN0ZW1TdGF0cygpIHtcclxuICAgIHJldHVybiB0aGlzLnN0YXRzO1xyXG4gIH1cclxuXHJcbiAgcXVldWVTdGF0cygpIHtcclxuICAgIHJldHVybiB0aGlzLnF1ZXVlLnN0YXRzO1xyXG4gIH1cclxuXHJcbiAgdXNhZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5idXN5RHVyYXRpb247XHJcbiAgfVxyXG5cclxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xyXG4gICAgdGhpcy5xdWV1ZS5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcbiAgICBpZiAoKHRoaXMubWF4cWxlbiA9PT0gMCAmJiAhdGhpcy5mcmVlKVxyXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMubWF4cWxlbiA+IDAgJiYgdGhpcy5xdWV1ZS5zaXplKCkgPj0gdGhpcy5tYXhxbGVuKSkge1xyXG4gICAgICByby5tc2cgPSAtMTtcclxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcm8uZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgIGNvbnN0IG5vdyA9IHJvLmVudGl0eS50aW1lKCk7XHJcblxyXG4gICAgdGhpcy5zdGF0cy5lbnRlcihub3cpO1xyXG4gICAgdGhpcy5xdWV1ZS5wdXNoKHJvLCBub3cpO1xyXG4gICAgdGhpcy51c2VGQ0ZTU2NoZWR1bGUobm93KTtcclxuICB9XHJcblxyXG4gIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xyXG4gICAgICBjb25zdCBybyA9IHRoaXMucXVldWUuc2hpZnQodGltZXN0YW1wKTtcclxuXHJcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZnJlZVNlcnZlcnNbaV0pIHtcclxuICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcclxuICAgICAgICAgIHJvLm1zZyA9IGk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZnJlZSAtLTtcclxuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gcm8uZHVyYXRpb247XHJcblxyXG4gICAgICAgICAgICAvLyBjYW5jZWwgYWxsIG90aGVyIHJlbmVnaW5nIHJlcXVlc3RzXHJcbiAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld3JvID0gbmV3IFJlcXVlc3QodGhpcywgdGltZXN0YW1wLCB0aW1lc3RhbXAgKyByby5kdXJhdGlvbik7XHJcblxyXG4gICAgICBuZXdyby5kb25lKHRoaXMudXNlRkNGU0NhbGxiYWNrLCB0aGlzLCBybyk7XHJcblxyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdybyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1c2VGQ0ZTQ2FsbGJhY2socm8pIHtcclxuICAgICAgICAvLyBXZSBoYXZlIG9uZSBtb3JlIGZyZWUgc2VydmVyXHJcbiAgICB0aGlzLmZyZWUgKys7XHJcbiAgICB0aGlzLmZyZWVTZXJ2ZXJzW3JvLm1zZ10gPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc3RhdHMubGVhdmUocm8uc2NoZWR1bGVkQXQsIHJvLmVudGl0eS50aW1lKCkpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBzb21lb25lIHdhaXRpbmcsIHNjaGVkdWxlIGl0IG5vd1xyXG4gICAgdGhpcy51c2VGQ0ZTU2NoZWR1bGUocm8uZW50aXR5LnRpbWUoKSk7XHJcblxyXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXHJcbiAgICByby5kZWxpdmVyKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgdXNlTENGUyhkdXJhdGlvbiwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcblxyXG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJ1bm5pbmcgcmVxdWVzdC4uXHJcbiAgICBpZiAodGhpcy5jdXJyZW50Uk8pIHtcclxuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkgLSB0aGlzLmN1cnJlbnRSTy5sYXN0SXNzdWVkKTtcclxuICAgICAgICAgICAgLy8gY2FsY3VhdGUgdGhlIHJlbWFpbmluZyB0aW1lXHJcbiAgICAgIHRoaXMuY3VycmVudFJPLnJlbWFpbmluZyA9IChcclxuICAgICAgICAgIHRoaXMuY3VycmVudFJPLmRlbGl2ZXJBdCAtIHRoaXMuY3VycmVudFJPLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgICAgICAvLyBwcmVlbXB0IGl0Li5cclxuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRoaXMuY3VycmVudFJPLCByby5lbnRpdHkudGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUuLlxyXG4gICAgaWYgKCFyby5zYXZlZF9kZWxpdmVyKSB7XHJcbiAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcclxuICAgICAgcm8ucmVtYWluaW5nID0gZHVyYXRpb247XHJcbiAgICAgIHJvLnNhdmVkX2RlbGl2ZXIgPSByby5kZWxpdmVyO1xyXG4gICAgICByby5kZWxpdmVyID0gdGhpcy51c2VMQ0ZTQ2FsbGJhY2s7XHJcblxyXG4gICAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJvLmxhc3RJc3N1ZWQgPSByby5lbnRpdHkudGltZSgpO1xyXG5cclxuICAgICAgICAvLyBzY2hlZHVsZSB0aGlzIG5ldyBldmVudFxyXG4gICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKSArIGR1cmF0aW9uO1xyXG4gICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gIH1cclxuXHJcbiAgdXNlTENGU0NhbGxiYWNrKCkge1xyXG4gICAgY29uc3QgZmFjaWxpdHkgPSB0aGlzLnNvdXJjZTtcclxuXHJcbiAgICBpZiAodGhpcyAhPT0gZmFjaWxpdHkuY3VycmVudFJPKSByZXR1cm47XHJcbiAgICBmYWNpbGl0eS5jdXJyZW50Uk8gPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBzdGF0c1xyXG4gICAgZmFjaWxpdHkuYnVzeUR1cmF0aW9uICs9ICh0aGlzLmVudGl0eS50aW1lKCkgLSB0aGlzLmxhc3RJc3N1ZWQpO1xyXG4gICAgZmFjaWxpdHkuc3RhdHMubGVhdmUodGhpcy5zY2hlZHVsZWRBdCwgdGhpcy5lbnRpdHkudGltZSgpKTtcclxuXHJcbiAgICAgICAgLy8gZGVsaXZlciB0aGlzIHJlcXVlc3RcclxuICAgIHRoaXMuZGVsaXZlciA9IHRoaXMuc2F2ZWRfZGVsaXZlcjtcclxuICAgIGRlbGV0ZSB0aGlzLnNhdmVkX2RlbGl2ZXI7XHJcbiAgICB0aGlzLmRlbGl2ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gc2VlIGlmIHRoZXJlIGFyZSBwZW5kaW5nIHJlcXVlc3RzXHJcbiAgICBpZiAoIWZhY2lsaXR5LnF1ZXVlLmVtcHR5KCkpIHtcclxuICAgICAgY29uc3Qgb2JqID0gZmFjaWxpdHkucXVldWUucG9wKHRoaXMuZW50aXR5LnRpbWUoKSk7XHJcblxyXG4gICAgICBmYWNpbGl0eS51c2VMQ0ZTKG9iai5yZW1haW5pbmcsIG9iaik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1c2VQcm9jZXNzb3JTaGFyaW5nKGR1cmF0aW9uLCBybykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBudWxsLCBSZXF1ZXN0KTtcclxuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XHJcbiAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nU2NoZWR1bGUocm8sIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgdXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCBpc0FkZGVkKSB7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuXHJcbiAgICBjb25zdCBzaXplID0gdGhpcy5xdWV1ZS5sZW5ndGg7XHJcblxyXG4gICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XHJcblxyXG4gICAgY29uc3QgbmV3UXVldWUgPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5sYXN0SXNzdWVkID0gY3VycmVudDtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG5cclxuICAgICAgY29uc3QgZXYgPSB0aGlzLnF1ZXVlW2ldO1xyXG5cclxuICAgICAgaWYgKGV2LnJvID09PSBybykge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5ld2V2ID0gbmV3IFJlcXVlc3QoXHJcbiAgICAgICAgICB0aGlzLCBjdXJyZW50LCBjdXJyZW50ICsgKGV2LmRlbGl2ZXJBdCAtIGN1cnJlbnQpICogbXVsdGlwbGllcik7XHJcblxyXG4gICAgICBuZXdldi5ybyA9IGV2LnJvO1xyXG4gICAgICBuZXdldi5zb3VyY2UgPSB0aGlzO1xyXG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XHJcbiAgICAgIG5ld1F1ZXVlLnB1c2gobmV3ZXYpO1xyXG5cclxuICAgICAgZXYuY2FuY2VsKCk7XHJcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcclxuICAgIGlmIChpc0FkZGVkKSB7XHJcbiAgICAgIGNvbnN0IG5ld2V2ID0gbmV3IFJlcXVlc3QoXHJcbiAgICAgICAgICB0aGlzLCBjdXJyZW50LCBjdXJyZW50ICsgcm8uZHVyYXRpb24gKiAoc2l6ZSArIDEpKTtcclxuXHJcbiAgICAgIG5ld2V2LnJvID0gcm87XHJcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XHJcbiAgICAgIG5ld2V2LmRlbGl2ZXIgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaztcclxuICAgICAgbmV3UXVldWUucHVzaChuZXdldik7XHJcblxyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChuZXdldik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5xdWV1ZSA9IG5ld1F1ZXVlO1xyXG5cclxuICAgICAgICAvLyB1c2FnZSBzdGF0aXN0aWNzXHJcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5idXN5RHVyYXRpb24gKz0gKGN1cnJlbnQgLSB0aGlzLmxhc3RJc3N1ZWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrKCkge1xyXG4gICAgY29uc3QgZmFjID0gdGhpcy5zb3VyY2U7XHJcblxyXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XHJcbiAgICBmYWMuc3RhdHMubGVhdmUodGhpcy5yby5zY2hlZHVsZWRBdCwgdGhpcy5yby5lbnRpdHkudGltZSgpKTtcclxuXHJcbiAgICBmYWMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHRoaXMucm8sIGZhbHNlKTtcclxuICAgIHRoaXMucm8uZGVsaXZlcigpO1xyXG4gIH1cclxufVxyXG5cclxuRmFjaWxpdHkuRkNGUyA9IDE7XHJcbkZhY2lsaXR5LkxDRlMgPSAyO1xyXG5GYWNpbGl0eS5QUyA9IDM7XHJcbkZhY2lsaXR5Lk51bURpc2NpcGxpbmVzID0gNDtcclxuXHJcbmNsYXNzIEJ1ZmZlciBleHRlbmRzIE1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lLCBjYXBhY2l0eSwgaW5pdGlhbCkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDMpO1xyXG5cclxuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcclxuICAgIHRoaXMuYXZhaWxhYmxlID0gKHR5cGVvZiBpbml0aWFsID09PSAndW5kZWZpbmVkJykgPyAwIDogaW5pdGlhbDtcclxuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcclxuICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcclxuICB9XHJcblxyXG4gIGN1cnJlbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGU7XHJcbiAgfVxyXG5cclxuICBzaXplKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FwYWNpdHk7XHJcbiAgfVxyXG5cclxuICBnZXQoYW1vdW50LCBybykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuXHJcbiAgICBpZiAodGhpcy5nZXRRdWV1ZS5lbXB0eSgpXHJcbiAgICAgICAgICAgICAgICAmJiBhbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcclxuICAgICAgdGhpcy5hdmFpbGFibGUgLT0gYW1vdW50O1xyXG5cclxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG5cclxuICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcclxuXHJcbiAgICAgIHRoaXMucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xyXG4gICAgdGhpcy5nZXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcclxuICB9XHJcblxyXG4gIHB1dChhbW91bnQsIHJvKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG5cclxuICAgIGlmICh0aGlzLnB1dFF1ZXVlLmVtcHR5KClcclxuICAgICAgICAgICAgICAgICYmIChhbW91bnQgKyB0aGlzLmF2YWlsYWJsZSkgPD0gdGhpcy5jYXBhY2l0eSkge1xyXG4gICAgICB0aGlzLmF2YWlsYWJsZSArPSBhbW91bnQ7XHJcblxyXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xyXG4gICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcblxyXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xyXG5cclxuICAgICAgdGhpcy5wcm9ncmVzc0dldFF1ZXVlKCk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xyXG4gICAgdGhpcy5wdXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcclxuICB9XHJcblxyXG4gIHByb2dyZXNzR2V0UXVldWUoKSB7XHJcbiAgICBsZXQgb2JqO1xyXG5cclxuICAgIHdoaWxlIChvYmogPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXHJcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXHJcbiAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XHJcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxyXG4gICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cclxuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcclxuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtPSBvYmouYW1vdW50O1xyXG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcclxuICAgICAgICBvYmouZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb2dyZXNzUHV0UXVldWUoKSB7XHJcbiAgICBsZXQgb2JqO1xyXG5cclxuICAgIHdoaWxlIChvYmogPSB0aGlzLnB1dFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXHJcbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXHJcbiAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XHJcbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxyXG4gICAgICBpZiAob2JqLmFtb3VudCArIHRoaXMuYXZhaWxhYmxlIDw9IHRoaXMuY2FwYWNpdHkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXHJcbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgKz0gb2JqLmFtb3VudDtcclxuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XHJcbiAgICAgICAgb2JqLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgb2JqLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG9iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXRTdGF0cygpIHtcclxuICAgIHJldHVybiB0aGlzLnB1dFF1ZXVlLnN0YXRzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RhdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFN0b3JlIGV4dGVuZHMgTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKGNhcGFjaXR5LCBuYW1lID0gbnVsbCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyKTtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG5cclxuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcclxuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xyXG4gICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xyXG4gICAgdGhpcy5nZXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xyXG4gIH1cclxuXHJcbiAgY3VycmVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgc2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmNhcGFjaXR5O1xyXG4gIH1cclxuXHJcbiAgZ2V0KGZpbHRlciwgcm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XHJcblxyXG4gICAgaWYgKHRoaXMuZ2V0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA+IDApIHtcclxuICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcblxyXG4gICAgICBsZXQgb2JqO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBjb2RlIG91dFxyXG4gICAgICAgICAgICAvLyBpdCBpcyByZXBlYXRlZCBpbiBwcm9ncmVzc0dldFF1ZXVlXHJcbiAgICAgIGlmIChmaWx0ZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgIG9iaiA9IHRoaXMub2JqZWN0c1tpXTtcclxuICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xyXG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcclxuICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xyXG5cclxuICAgICAgICByby5tc2cgPSBvYmo7XHJcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgICByby5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJvLmZpbHRlciA9IGZpbHRlcjtcclxuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgfVxyXG5cclxuICBwdXQob2JqLCBybykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuXHJcbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpICYmIHRoaXMuY3VycmVudCgpIDwgdGhpcy5jYXBhY2l0eSkge1xyXG4gICAgICB0aGlzLmF2YWlsYWJsZSArKztcclxuXHJcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuXHJcbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XHJcbiAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iaik7XHJcblxyXG4gICAgICB0aGlzLnByb2dyZXNzR2V0UXVldWUoKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICByby5vYmogPSBvYmo7XHJcbiAgICB0aGlzLnB1dFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJvZ3Jlc3NHZXRRdWV1ZSgpIHtcclxuICAgIGxldCBybztcclxuXHJcbiAgICB3aGlsZSAocm8gPSB0aGlzLmdldFF1ZXVlLnRvcCgpKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXHJcbiAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXHJcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcclxuICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcclxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGZpbHRlciA9IHJvLmZpbHRlcjtcclxuXHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBvYmo7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHNbaV07XHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtZGVwdGhcclxuICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcclxuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXHJcbiAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xyXG4gICAgICAgICAgdGhpcy5hdmFpbGFibGUgLS07XHJcblxyXG4gICAgICAgICAgcm8ubXNnID0gb2JqO1xyXG4gICAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcclxuICAgICAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xyXG4gICAgbGV0IHJvO1xyXG5cclxuICAgIHdoaWxlIChybyA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cclxuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cclxuICAgICAgaWYgKHJvLmNhbmNlbGxlZCkge1xyXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50KCkgPCB0aGlzLmNhcGFjaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxyXG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGUgKys7XHJcbiAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gocm8ub2JqKTtcclxuICAgICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xyXG4gICAgICAgIHJvLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRoaXMgcmVxdWVzdCBjYW5ub3QgYmUgc2F0aXNmaWVkXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1dFN0YXRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHV0UXVldWUuc3RhdHM7XHJcbiAgfVxyXG5cclxuICBnZXRTdGF0cygpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFF1ZXVlLnN0YXRzO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgRXZlbnQgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDEpO1xyXG5cclxuICAgIHRoaXMud2FpdExpc3QgPSBbXTtcclxuICAgIHRoaXMucXVldWUgPSBbXTtcclxuICAgIHRoaXMuaXNGaXJlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgYWRkV2FpdExpc3Qocm8pIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xyXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xyXG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMud2FpdExpc3QucHVzaChybyk7XHJcbiAgfVxyXG5cclxuICBhZGRRdWV1ZShybykge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0ZpcmVkKSB7XHJcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XHJcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5xdWV1ZS5wdXNoKHJvKTtcclxuICB9XHJcblxyXG4gIGZpcmUoa2VlcEZpcmVkKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDEpO1xyXG5cclxuICAgIGlmIChrZWVwRmlyZWQpIHtcclxuICAgICAgdGhpcy5pc0ZpcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGlzcGF0Y2ggYWxsIHdhaXRpbmcgZW50aXRpZXNcclxuICAgIGNvbnN0IHRtcExpc3QgPSB0aGlzLndhaXRMaXN0O1xyXG5cclxuICAgIHRoaXMud2FpdExpc3QgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wTGlzdC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgdG1wTGlzdFtpXS5kZWxpdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIERpc3BhdGNoIG9uZSBxdWV1ZWQgZW50aXR5XHJcbiAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcclxuXHJcbiAgICBpZiAobHVja3kpIHtcclxuICAgICAgbHVja3kuZGVsaXZlcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLmlzRmlyZWQgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcihzaW0sIG5hbWUpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgdGhpcy5zaW0gPSBzaW07XHJcbiAgfVxyXG5cclxuICB0aW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2ltLnRpbWUoKTtcclxuICB9XHJcblxyXG4gIHNldFRpbWVyKGR1cmF0aW9uKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QoXHJcbiAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCksXHJcbiAgICAgICAgICAgICAgdGhpcy5zaW0udGltZSgpICsgZHVyYXRpb24pO1xyXG5cclxuICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICB3YWl0RXZlbnQoZXZlbnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBldmVudDtcclxuICAgIGV2ZW50LmFkZFdhaXRMaXN0KHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIHF1ZXVlRXZlbnQoZXZlbnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBldmVudDtcclxuICAgIGV2ZW50LmFkZFF1ZXVlKHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIHVzZUZhY2lsaXR5KGZhY2lsaXR5LCBkdXJhdGlvbikge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBGYWNpbGl0eSk7XHJcblxyXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xyXG5cclxuICAgIHJvLnNvdXJjZSA9IGZhY2lsaXR5O1xyXG4gICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XHJcbiAgICByZXR1cm4gcm87XHJcbiAgfVxyXG5cclxuICBwdXRCdWZmZXIoYnVmZmVyLCBhbW91bnQpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgQnVmZmVyKTtcclxuXHJcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XHJcblxyXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xyXG4gICAgYnVmZmVyLnB1dChhbW91bnQsIHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIGdldEJ1ZmZlcihidWZmZXIsIGFtb3VudCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBidWZmZXI7XHJcbiAgICBidWZmZXIuZ2V0KGFtb3VudCwgcm8pO1xyXG4gICAgcmV0dXJuIHJvO1xyXG4gIH1cclxuXHJcbiAgcHV0U3RvcmUoc3RvcmUsIG9iaikge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBTdG9yZSk7XHJcblxyXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xyXG5cclxuICAgIHJvLnNvdXJjZSA9IHN0b3JlO1xyXG4gICAgc3RvcmUucHV0KG9iaiwgcm8pO1xyXG4gICAgcmV0dXJuIHJvO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RvcmUoc3RvcmUsIGZpbHRlcikge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAyLCBTdG9yZSwgRnVuY3Rpb24pO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcywgdGhpcy5zaW0udGltZSgpLCAwKTtcclxuXHJcbiAgICByby5zb3VyY2UgPSBzdG9yZTtcclxuICAgIHN0b3JlLmdldChmaWx0ZXIsIHJvKTtcclxuICAgIHJldHVybiBybztcclxuICB9XHJcblxyXG4gIHNlbmQobWVzc2FnZSwgZGVsYXksIGVudGl0aWVzKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDMpO1xyXG5cclxuICAgIGNvbnN0IHJvID0gbmV3IFJlcXVlc3QodGhpcy5zaW0sIHRoaXMudGltZSgpLCB0aGlzLnRpbWUoKSArIGRlbGF5KTtcclxuXHJcbiAgICByby5zb3VyY2UgPSB0aGlzO1xyXG4gICAgcm8ubXNnID0gbWVzc2FnZTtcclxuICAgIHJvLmRhdGEgPSBlbnRpdGllcztcclxuICAgIHJvLmRlbGl2ZXIgPSB0aGlzLnNpbS5zZW5kTWVzc2FnZTtcclxuXHJcbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xyXG4gIH1cclxuXHJcbiAgbG9nKG1lc3NhZ2UpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgU2ltLCBGYWNpbGl0eSwgQnVmZmVyLCBTdG9yZSwgRXZlbnQsIEVudGl0eSwgYXJnQ2hlY2sgfTtcclxuIiwiaW1wb3J0IHsgYXJnQ2hlY2sgfSBmcm9tICcuL3NpbS5qcyc7XHJcblxyXG5jbGFzcyBEYXRhU2VyaWVzIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLkNvdW50ID0gMDtcclxuICAgIHRoaXMuVyA9IDAuMDtcclxuICAgIHRoaXMuQSA9IDAuMDtcclxuICAgIHRoaXMuUSA9IDAuMDtcclxuICAgIHRoaXMuTWF4ID0gLUluZmluaXR5O1xyXG4gICAgdGhpcy5NaW4gPSBJbmZpbml0eTtcclxuICAgIHRoaXMuU3VtID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhpc3RvZ3JhbS5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICB0aGlzLmhpc3RvZ3JhbVtpXSA9IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDMsIDMpO1xyXG5cclxuICAgIHRoaXMuaExvd2VyID0gbG93ZXI7XHJcbiAgICB0aGlzLmhVcHBlciA9IHVwcGVyO1xyXG4gICAgdGhpcy5oQnVja2V0U2l6ZSA9ICh1cHBlciAtIGxvd2VyKSAvIG5idWNrZXRzO1xyXG4gICAgdGhpcy5oaXN0b2dyYW0gPSBuZXcgQXJyYXkobmJ1Y2tldHMgKyAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXN0b2dyYW0ubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEhpc3RvZ3JhbSgpIHtcclxuICAgIHJldHVybiB0aGlzLmhpc3RvZ3JhbTtcclxuICB9XHJcblxyXG4gIHJlY29yZCh2YWx1ZSwgd2VpZ2h0KSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xyXG5cclxuICAgIGNvbnN0IHcgPSAodHlwZW9mIHdlaWdodCA9PT0gJ3VuZGVmaW5lZCcpID8gMSA6IHdlaWdodDtcclxuXHJcbiAgICAgICAgLy8gZG9jdW1lbnQud3JpdGUoXCJEYXRhIHNlcmllcyByZWNvcmRpbmcgXCIgKyB2YWx1ZSArIFwiICh3ZWlnaHQgPSBcIiArIHcgKyBcIilcXG5cIik7XHJcblxyXG4gICAgaWYgKHZhbHVlID4gdGhpcy5NYXgpIHRoaXMuTWF4ID0gdmFsdWU7XHJcbiAgICBpZiAodmFsdWUgPCB0aGlzLk1pbikgdGhpcy5NaW4gPSB2YWx1ZTtcclxuICAgIHRoaXMuU3VtICs9IHZhbHVlO1xyXG4gICAgdGhpcy5Db3VudCArKztcclxuICAgIGlmICh0aGlzLmhpc3RvZ3JhbSkge1xyXG4gICAgICBpZiAodmFsdWUgPCB0aGlzLmhMb3dlcikge1xyXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtWzBdICs9IHc7XHJcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiB0aGlzLmhVcHBlcikge1xyXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtW3RoaXMuaGlzdG9ncmFtLmxlbmd0aCAtIDFdICs9IHc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh2YWx1ZSAtIHRoaXMuaExvd2VyKSAvIHRoaXMuaEJ1Y2tldFNpemUpICsgMTtcclxuXHJcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baW5kZXhdICs9IHc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgICAgLy8gV2kgPSBXaS0xICsgd2lcclxuICAgIHRoaXMuVyA9IHRoaXMuVyArIHc7XHJcblxyXG4gICAgaWYgKHRoaXMuVyA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8vIEFpID0gQWktMSArIHdpL1dpICogKHhpIC0gQWktMSlcclxuICAgIGNvbnN0IGxhc3RBID0gdGhpcy5BO1xyXG5cclxuICAgIHRoaXMuQSA9IGxhc3RBICsgKHcgLyB0aGlzLlcpICogKHZhbHVlIC0gbGFzdEEpO1xyXG5cclxuICAgICAgICAvLyBRaSA9IFFpLTEgKyB3aSh4aSAtIEFpLTEpKHhpIC0gQWkpXHJcbiAgICB0aGlzLlEgPSB0aGlzLlEgKyB3ICogKHZhbHVlIC0gbGFzdEEpICogKHZhbHVlIC0gdGhpcy5BKTtcclxuICAgICAgICAvLyBwcmludChcIlxcdFc9XCIgKyB0aGlzLlcgKyBcIiBBPVwiICsgdGhpcy5BICsgXCIgUT1cIiArIHRoaXMuUSArIFwiXFxuXCIpO1xyXG4gIH1cclxuXHJcbiAgY291bnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5Db3VudDtcclxuICB9XHJcblxyXG4gIG1pbigpIHtcclxuICAgIHJldHVybiB0aGlzLk1pbjtcclxuICB9XHJcblxyXG4gIG1heCgpIHtcclxuICAgIHJldHVybiB0aGlzLk1heDtcclxuICB9XHJcblxyXG4gIHJhbmdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuTWF4IC0gdGhpcy5NaW47XHJcbiAgfVxyXG5cclxuICBzdW0oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5TdW07XHJcbiAgfVxyXG5cclxuICBzdW1XZWlnaHRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLkEgKiB0aGlzLlc7XHJcbiAgfVxyXG5cclxuICBhdmVyYWdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuQTtcclxuICB9XHJcblxyXG4gIHZhcmlhbmNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuUSAvIHRoaXMuVztcclxuICB9XHJcblxyXG4gIGRldmlhdGlvbigpIHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy52YXJpYW5jZSgpKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFRpbWVTZXJpZXMge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHRoaXMuZGF0YVNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLmRhdGFTZXJpZXMucmVzZXQoKTtcclxuICAgIHRoaXMubGFzdFZhbHVlID0gTmFOO1xyXG4gICAgdGhpcy5sYXN0VGltZXN0YW1wID0gTmFOO1xyXG4gIH1cclxuXHJcbiAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMywgMyk7XHJcbiAgICB0aGlzLmRhdGFTZXJpZXMuc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGlzdG9ncmFtKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcclxuICB9XHJcblxyXG4gIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XHJcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xyXG5cclxuICAgIGlmICghaXNOYU4odGhpcy5sYXN0VGltZXN0YW1wKSkge1xyXG4gICAgICB0aGlzLmRhdGFTZXJpZXMucmVjb3JkKHRoaXMubGFzdFZhbHVlLCB0aW1lc3RhbXAgLSB0aGlzLmxhc3RUaW1lc3RhbXApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgfVxyXG5cclxuICBmaW5hbGl6ZSh0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5yZWNvcmQoTmFOLCB0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgY291bnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmNvdW50KCk7XHJcbiAgfVxyXG5cclxuICBtaW4oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1pbigpO1xyXG4gIH1cclxuXHJcbiAgbWF4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5tYXgoKTtcclxuICB9XHJcblxyXG4gIHJhbmdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5yYW5nZSgpO1xyXG4gIH1cclxuXHJcbiAgc3VtKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5zdW0oKTtcclxuICB9XHJcblxyXG4gIGF2ZXJhZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmF2ZXJhZ2UoKTtcclxuICB9XHJcblxyXG4gIGRldmlhdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZGV2aWF0aW9uKCk7XHJcbiAgfVxyXG5cclxuICB2YXJpYW5jZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMudmFyaWFuY2UoKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFBvcHVsYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xyXG4gICAgdGhpcy5zaXplU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoKTtcclxuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMgPSBuZXcgRGF0YVNlcmllcygpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNpemVTZXJpZXMucmVzZXQoKTtcclxuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVzZXQoKTtcclxuICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XHJcbiAgfVxyXG5cclxuICBlbnRlcih0aW1lc3RhbXApIHtcclxuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5wb3B1bGF0aW9uICsrO1xyXG4gICAgdGhpcy5zaXplU2VyaWVzLnJlY29yZCh0aGlzLnBvcHVsYXRpb24sIHRpbWVzdGFtcCk7XHJcbiAgfVxyXG5cclxuICBsZWF2ZShhcnJpdmFsQXQsIGxlZnRBdCkge1xyXG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcclxuXHJcbiAgICB0aGlzLnBvcHVsYXRpb24gLS07XHJcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgbGVmdEF0KTtcclxuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVjb3JkKGxlZnRBdCAtIGFycml2YWxBdCk7XHJcbiAgfVxyXG5cclxuICBjdXJyZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbjtcclxuICB9XHJcblxyXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xyXG4gICAgdGhpcy5zaXplU2VyaWVzLmZpbmFsaXplKHRpbWVzdGFtcCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XHJcbiIsImltcG9ydCB7IFNpbSwgRW50aXR5LCBFdmVudCwgQnVmZmVyLCBGYWNpbGl0eSwgU3RvcmUsIGFyZ0NoZWNrIH0gZnJvbSAnLi9saWIvc2ltLmpzJztcclxuaW1wb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9IGZyb20gJy4vbGliL3N0YXRzLmpzJztcclxuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4vbGliL3JlcXVlc3QuanMnO1xyXG5pbXBvcnQgeyBQUXVldWUsIFF1ZXVlIH0gZnJvbSAnLi9saWIvcXVldWVzLmpzJztcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi9saWIvcmFuZG9tLmpzJztcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL2xpYi9tb2RlbC5qcyc7XHJcblxyXG5leHBvcnQgeyBTaW0sIEVudGl0eSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlIH07XHJcbmV4cG9ydCB7IERhdGFTZXJpZXMsIFRpbWVTZXJpZXMsIFBvcHVsYXRpb24gfTtcclxuZXhwb3J0IHsgUmVxdWVzdCB9O1xyXG5leHBvcnQgeyBQUXVldWUsIFF1ZXVlLCBhcmdDaGVjayB9O1xyXG5leHBvcnQgeyBSYW5kb20gfTtcclxuZXhwb3J0IHsgTW9kZWwgfTtcclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gIHdpbmRvdy5TaW0gPSB7XHJcbiAgICBhcmdDaGVjazogYXJnQ2hlY2ssXHJcbiAgICBCdWZmZXI6IEJ1ZmZlcixcclxuICAgIERhdGFTZXJpZXM6IERhdGFTZXJpZXMsXHJcbiAgICBFbnRpdHk6IEVudGl0eSxcclxuICAgIEV2ZW50OiBFdmVudCxcclxuICAgIEZhY2lsaXR5OiBGYWNpbGl0eSxcclxuICAgIE1vZGVsOiBNb2RlbCxcclxuICAgIFBRdWV1ZTogUFF1ZXVlLFxyXG4gICAgUG9wdWxhdGlvbjogUG9wdWxhdGlvbixcclxuICAgIFF1ZXVlOiBRdWV1ZSxcclxuICAgIFJhbmRvbTogUmFuZG9tLFxyXG4gICAgUmVxdWVzdDogUmVxdWVzdCxcclxuICAgIFNpbTogU2ltLFxyXG4gICAgU3RvcmU6IFN0b3JlLFxyXG4gICAgVGltZVNlcmllczogVGltZVNlcmllc1xyXG4gIH07XHJcbn1cclxuIl19
