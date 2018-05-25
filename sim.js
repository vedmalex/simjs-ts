(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

      // prevent cancellation if request is about to be delivered at this
      // instant covers case where in a buffer or store, object has already
      // been dequeued and delivery was scheduled for now, but waitUntil
      // times out at the same time, making the request get cancelled after
      // the object is dequeued but before it is delivered
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

},{"./lib/model.js":1,"./lib/queues.js":2,"./lib/random.js":3,"./lib/request.js":4,"./lib/sim.js":5,"./lib/stats.js":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL21vZGVsLmpzIiwic3JjL2xpYi9xdWV1ZXMuanMiLCJzcmMvbGliL3JhbmRvbS5qcyIsInNyYy9saWIvcmVxdWVzdC5qcyIsInNyYy9saWIvc2ltLmpzIiwic3JjL2xpYi9zdGF0cy5qcyIsInNyYy9zaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sSztBQUNKLGlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxRQUFXLEtBQUssV0FBTCxDQUFpQixJQUE1QixTQUFvQyxLQUFLLEVBQXJEO0FBQ0Q7Ozs7OEJBTWdCO0FBQ2YsV0FBSyxlQUFMLEdBQXVCLEtBQUssY0FBTCxHQUFzQixDQUE3QztBQUNBLGFBQU8sS0FBSyxlQUFaO0FBQ0Q7Ozt3QkFQMkI7QUFDMUIsYUFBTyxDQUFDLEtBQUssZUFBTixHQUF3QixDQUF4QixHQUE0QixLQUFLLGVBQXhDO0FBQ0Q7Ozs7OztRQVFNLEssR0FBQSxLO2tCQUNNLEs7Ozs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFTSxLOzs7QUFDSixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsOEdBQ1YsSUFEVTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUssS0FBTCxHQUFhLElBQUksaUJBQUosRUFBYjtBQUpnQjtBQUtqQjs7OzswQkFFSztBQUNKLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQVEsS0FBSyxJQUFMLENBQVUsTUFBWCxHQUFxQixLQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQTdCLENBQXJCLEdBQXVE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LFVBTEk7QUFNWCxjQUFVLGFBTkM7QUFPWCxXQUFPLFlBUEk7QUFRWCxZQUFRLGNBUkc7QUFTWCxnQkFBWSxpQkFURDtBQVVYLFdBQU8sYUFWSTtBQVdYLFlBQVEsY0FYRztBQVlYLGFBQVMsZ0JBWkU7QUFhWCxTQUFLLFFBYk07QUFjWCxXQUFPLFVBZEk7QUFlWCxnQkFBWTtBQWZELEdBQWI7QUFpQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25zdHJ1Y3Rvci5fbmV4dElkKCk7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ICR7dGhpcy5pZH1gO1xuICB9XG5cbiAgc3RhdGljIGdldCB0b3RhbEluc3RhbmNlcygpIHtcbiAgICByZXR1cm4gIXRoaXMuX3RvdGFsSW5zdGFuY2VzID8gMCA6IHRoaXMuX3RvdGFsSW5zdGFuY2VzO1xuICB9XG5cbiAgc3RhdGljIF9uZXh0SWQoKSB7XG4gICAgdGhpcy5fdG90YWxJbnN0YW5jZXMgPSB0aGlzLnRvdGFsSW5zdGFuY2VzICsgMTtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJbnN0YW5jZXM7XG4gIH1cbn1cblxuZXhwb3J0IHsgTW9kZWwgfTtcbmV4cG9ydCBkZWZhdWx0IE1vZGVsO1xuIiwiaW1wb3J0IHsgYXJnQ2hlY2sgfSBmcm9tICcuL3NpbS5qcyc7XG5pbXBvcnQgeyBQb3B1bGF0aW9uIH0gZnJvbSAnLi9zdGF0cy5qcyc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwuanMnO1xuXG5jbGFzcyBRdWV1ZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMudGltZXN0YW1wID0gW107XG4gICAgdGhpcy5zdGF0cyA9IG5ldyBQb3B1bGF0aW9uKCk7XG4gIH1cblxuICB0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgfVxuXG4gIGJhY2soKSB7XG4gICAgcmV0dXJuICh0aGlzLmRhdGEubGVuZ3RoKSA/IHRoaXMuZGF0YVt0aGlzLmRhdGEubGVuZ3RoIC0gMV0gOiBudWxsO1xuICB9XG5cbiAgcHVzaCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcbiAgICB0aGlzLmRhdGEucHVzaCh2YWx1ZSk7XG4gICAgdGhpcy50aW1lc3RhbXAucHVzaCh0aW1lc3RhbXApO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICB9XG5cbiAgdW5zaGlmdCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcbiAgICB0aGlzLmRhdGEudW5zaGlmdCh2YWx1ZSk7XG4gICAgdGhpcy50aW1lc3RhbXAudW5zaGlmdCh0aW1lc3RhbXApO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICB9XG5cbiAgc2hpZnQodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnNoaWZ0KCk7XG5cbiAgICBjb25zdCBlbnF1ZXVlZEF0ID0gdGhpcy50aW1lc3RhbXAuc2hpZnQoKTtcblxuICAgIHRoaXMuc3RhdHMubGVhdmUoZW5xdWV1ZWRBdCwgdGltZXN0YW1wKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwb3AodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRhLnBvcCgpO1xuXG4gICAgY29uc3QgZW5xdWV1ZWRBdCA9IHRoaXMudGltZXN0YW1wLnBvcCgpO1xuXG4gICAgdGhpcy5zdGF0cy5sZWF2ZShlbnF1ZXVlZEF0LCB0aW1lc3RhbXApO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHBhc3NieSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zdGF0cy5lbnRlcih0aW1lc3RhbXApO1xuICAgIHRoaXMuc3RhdHMubGVhdmUodGltZXN0YW1wLCB0aW1lc3RhbXApO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMuc3RhdHMuZmluYWxpemUodGltZXN0YW1wKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc3RhdHMucmVzZXQoKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IFtdO1xuICB9XG5cbiAgcmVwb3J0KCkge1xuICAgIHJldHVybiBbdGhpcy5zdGF0cy5zaXplU2VyaWVzLmF2ZXJhZ2UoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRzLmR1cmF0aW9uU2VyaWVzLmF2ZXJhZ2UoKV07XG4gIH1cblxuICBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gIH1cbn1cblxuY2xhc3MgUFF1ZXVlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy5vcmRlciA9IDA7XG4gIH1cblxuICBncmVhdGVyKHJvMSwgcm8yKSB7XG4gICAgaWYgKHJvMS5kZWxpdmVyQXQgPiBybzIuZGVsaXZlckF0KSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAocm8xLmRlbGl2ZXJBdCA9PT0gcm8yLmRlbGl2ZXJBdCkgcmV0dXJuIHJvMS5vcmRlciA+IHJvMi5vcmRlcjtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpbnNlcnQocm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuICAgIHJvLm9yZGVyID0gdGhpcy5vcmRlciArKztcblxuICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICB0aGlzLmRhdGEucHVzaChybyk7XG5cbiAgICAgICAgLy8gaW5zZXJ0IGludG8gZGF0YSBhdCB0aGUgZW5kXG4gICAgY29uc3QgYSA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IG5vZGUgPSBhW2luZGV4XTtcblxuICAgICAgICAvLyBoZWFwIHVwXG4gICAgd2hpbGUgKGluZGV4ID4gMCkge1xuICAgICAgY29uc3QgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKChpbmRleCAtIDEpIC8gMik7XG5cbiAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtwYXJlbnRJbmRleF0sIHJvKSkge1xuICAgICAgICBhW2luZGV4XSA9IGFbcGFyZW50SW5kZXhdO1xuICAgICAgICBpbmRleCA9IHBhcmVudEluZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGFbaW5kZXhdID0gbm9kZTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBjb25zdCBhID0gdGhpcy5kYXRhO1xuXG4gICAgbGV0IGxlbiA9IGEubGVuZ3RoO1xuXG4gICAgaWYgKGxlbiA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGxlbiA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wb3AoKTtcbiAgICB9XG4gICAgY29uc3QgdG9wID0gYVswXTtcblxuICAgICAgICAvLyBtb3ZlIHRoZSBsYXN0IG5vZGUgdXBcbiAgICBhWzBdID0gYS5wb3AoKTtcbiAgICBsZW4tLTtcblxuICAgICAgICAvLyBoZWFwIGRvd25cbiAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgY29uc3Qgbm9kZSA9IGFbaW5kZXhdO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgTWF0aC5mbG9vcihsZW4gLyAyKSkge1xuICAgICAgY29uc3QgbGVmdENoaWxkSW5kZXggPSAyICogaW5kZXggKyAxO1xuXG4gICAgICBjb25zdCByaWdodENoaWxkSW5kZXggPSAyICogaW5kZXggKyAyO1xuXG4gICAgICBjb25zdCBzbWFsbGVyQ2hpbGRJbmRleCA9IHJpZ2h0Q2hpbGRJbmRleCA8IGxlblxuICAgICAgICAgICAgICAmJiAhdGhpcy5ncmVhdGVyKGFbcmlnaHRDaGlsZEluZGV4XSwgYVtsZWZ0Q2hpbGRJbmRleF0pXG4gICAgICAgICAgICAgICAgICAgID8gcmlnaHRDaGlsZEluZGV4IDogbGVmdENoaWxkSW5kZXg7XG5cbiAgICAgIGlmICh0aGlzLmdyZWF0ZXIoYVtzbWFsbGVyQ2hpbGRJbmRleF0sIG5vZGUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhW2luZGV4XSA9IGFbc21hbGxlckNoaWxkSW5kZXhdO1xuICAgICAgaW5kZXggPSBzbWFsbGVyQ2hpbGRJbmRleDtcbiAgICB9XG4gICAgYVtpbmRleF0gPSBub2RlO1xuICAgIHJldHVybiB0b3A7XG4gIH1cbn1cblxuZXhwb3J0IHsgUXVldWUsIFBRdWV1ZSB9O1xuIiwiXG5jbGFzcyBSYW5kb20ge1xuICBjb25zdHJ1Y3RvcihzZWVkID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkge1xuICAgIGlmICh0eXBlb2YgKHNlZWQpICE9PSAnbnVtYmVyJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgICAgICAgIHx8IE1hdGguY2VpbChzZWVkKSAhPT0gTWF0aC5mbG9vcihzZWVkKSkgeyAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc2VlZCB2YWx1ZSBtdXN0IGJlIGFuIGludGVnZXInKTsgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuXG4gICAgICAgIC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG4gICAgdGhpcy5OID0gNjI0O1xuICAgIHRoaXMuTSA9IDM5NztcbiAgICB0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xuICAgIHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7LyogbW9zdCBzaWduaWZpY2FudCB3LXIgYml0cyAqL1xuICAgIHRoaXMuTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7LyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXG5cbiAgICB0aGlzLm10ID0gbmV3IEFycmF5KHRoaXMuTik7LyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXG4gICAgdGhpcy5tdGkgPSB0aGlzLk4gKyAxOy8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xuXG4gICAgICAgIC8vIHRoaXMuaW5pdEdlbnJhbmQoc2VlZCk7XG4gICAgdGhpcy5pbml0QnlBcnJheShbc2VlZF0sIDEpO1xuICB9XG5cbiAgaW5pdEdlbnJhbmQocykge1xuICAgIHRoaXMubXRbMF0gPSBzID4+PiAwO1xuICAgIGZvciAodGhpcy5tdGkgPSAxOyB0aGlzLm10aSA8IHRoaXMuTjsgdGhpcy5tdGkrKykge1xuICAgICAgcyA9IHRoaXMubXRbdGhpcy5tdGkgLSAxXSBeICh0aGlzLm10W3RoaXMubXRpIC0gMV0gPj4+IDMwKTtcbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKVxuICAgICAgICAgICAgKyB0aGlzLm10aTtcblxuICAgICAgLyogU2VlIEtudXRoIFRBT0NQIFZvbDIuIDNyZCBFZC4gUC4xMDYgZm9yIG11bHRpcGxpZXIuICovXG4gICAgICAvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cbiAgICAgIC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgLyogMjAwMi8wMS8wOSBtb2RpZmllZCBieSBNYWtvdG8gTWF0c3Vtb3RvICAgICAgICAgICAgICovXG4gICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xuICAgIH1cbiAgfVxuXG4gIGluaXRCeUFycmF5KGluaXRLZXksIGtleUxlbmd0aCkge1xuICAgIGxldCBpLCBqLCBrO1xuXG4gICAgdGhpcy5pbml0R2VucmFuZCgxOTY1MDIxOCk7XG4gICAgaSA9IDE7IGogPSAwO1xuICAgIGsgPSAodGhpcy5OID4ga2V5TGVuZ3RoID8gdGhpcy5OIDoga2V5TGVuZ3RoKTtcbiAgICBmb3IgKDsgazsgay0tKSB7XG4gICAgICBjb25zdCBzID0gdGhpcy5tdFtpIC0gMV0gXiAodGhpcy5tdFtpIC0gMV0gPj4+IDMwKTtcblxuICAgICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKVxuICAgICAgICAgICAgKyBpbml0S2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xuICAgICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICBpKys7IGorKztcbiAgICAgIGlmIChpID49IHRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4gLSAxXTsgaSA9IDE7IH1cbiAgICAgIGlmIChqID49IGtleUxlbmd0aCkgaiA9IDA7XG4gICAgfVxuICAgIGZvciAoayA9IHRoaXMuTiAtIDE7IGs7IGstLSkge1xuICAgICAgY29uc3QgcyA9IHRoaXMubXRbaSAtIDFdIF4gKHRoaXMubXRbaSAtIDFdID4+PiAzMCk7XG5cbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG4gICAgICAgICAgICAtIGk7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuICAgICAgaSsrO1xuICAgICAgaWYgKGkgPj0gdGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTiAtIDFdOyBpID0gMTsgfVxuICAgIH1cblxuICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xuICB9XG5cbiAgZ2VucmFuZEludDMyKCkge1xuICAgIGxldCB5O1xuXG4gICAgY29uc3QgbWFnMDEgPSBbMHgwLCB0aGlzLk1BVFJJWF9BXTtcblxuICAgICAgICAvLyAgbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMVxuXG4gICAgaWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAgLy8gZ2VuZXJhdGUgTiB3b3JkcyBhdCBvbmUgdGltZVxuICAgICAgbGV0IGtrO1xuXG4gICAgICBpZiAodGhpcy5tdGkgPT09IHRoaXMuTiArIDEpIHsgIC8vIGlmIGluaXRHZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCxcbiAgICAgICAgdGhpcy5pbml0R2VucmFuZCg1NDg5KTsgLy8gYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkXG4gICAgICB9XG5cbiAgICAgIGZvciAoa2sgPSAwOyBrayA8IHRoaXMuTiAtIHRoaXMuTTsga2srKykge1xuICAgICAgICB5ID0gKHRoaXMubXRba2tdICYgdGhpcy5VUFBFUl9NQVNLKSB8ICh0aGlzLm10W2trICsgMV0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2sgKyB0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICB9XG4gICAgICBmb3IgKDtrayA8IHRoaXMuTiAtIDE7IGtrKyspIHtcbiAgICAgICAgeSA9ICh0aGlzLm10W2trXSAmIHRoaXMuVVBQRVJfTUFTSykgfCAodGhpcy5tdFtrayArIDFdICYgdGhpcy5MT1dFUl9NQVNLKTtcbiAgICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trICsgKHRoaXMuTSAtIHRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICB9XG4gICAgICB5ID0gKHRoaXMubXRbdGhpcy5OIC0gMV0gJiB0aGlzLlVQUEVSX01BU0spIHwgKHRoaXMubXRbMF0gJiB0aGlzLkxPV0VSX01BU0spO1xuICAgICAgdGhpcy5tdFt0aGlzLk4gLSAxXSA9IHRoaXMubXRbdGhpcy5NIC0gMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblxuICAgICAgdGhpcy5tdGkgPSAwO1xuICAgIH1cblxuICAgIHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xuXG4gICAgICAgIC8qIFRlbXBlcmluZyAqL1xuICAgIHkgXj0gKHkgPj4+IDExKTtcbiAgICB5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcbiAgICB5IF49ICh5IDw8IDE1KSAmIDB4ZWZjNjAwMDA7XG4gICAgeSBePSAoeSA+Pj4gMTgpO1xuXG4gICAgcmV0dXJuIHkgPj4+IDA7XG4gIH1cblxuICBnZW5yYW5kSW50MzEoKSB7XG4gICAgcmV0dXJuICh0aGlzLmdlbnJhbmRJbnQzMigpID4+PiAxKTtcbiAgfVxuXG4gIGdlbnJhbmRSZWFsMSgpIHtcbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzItMVxuICAgIHJldHVybiB0aGlzLmdlbnJhbmRJbnQzMigpICogKDEuMCAvIDQyOTQ5NjcyOTUuMCk7XG4gIH1cblxuICByYW5kb20oKSB7XG4gICAgaWYgKHRoaXMucHl0aG9uQ29tcGF0aWJpbGl0eSkge1xuICAgICAgaWYgKHRoaXMuc2tpcCkge1xuICAgICAgICB0aGlzLmdlbnJhbmRJbnQzMigpO1xuICAgICAgfVxuICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gZGl2aWRlZCBieSAyXjMyXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZEludDMyKCkgKiAoMS4wIC8gNDI5NDk2NzI5Ni4wKTtcbiAgfVxuXG4gIGdlbnJhbmRSZWFsMygpIHtcbiAgICAvLyBkaXZpZGVkIGJ5IDJeMzJcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZEludDMyKCkgKyAwLjUpICogKDEuMCAvIDQyOTQ5NjcyOTYuMCk7XG4gIH1cblxuICBnZW5yYW5kUmVzNTMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDU7XG4gICAgY29uc3QgYiA9IHRoaXMuZ2VucmFuZEludDMyKCkgPj4+IDY7XG5cbiAgICByZXR1cm4gKGEgKiA2NzEwODg2NC4wICsgYikgKiAoMS4wIC8gOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbiAgfVxuXG4gIGV4cG9uZW50aWFsKGxhbWJkYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2V4cG9uZW50aWFsKCkgbXVzdCAgYmUgY2FsbGVkIHdpdGggXFwnbGFtYmRhXFwnIHBhcmFtZXRlcicpOyAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG4gICAgY29uc3QgciA9IHRoaXMucmFuZG9tKCk7XG5cbiAgICByZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xuICB9XG5cbiAgZ2FtbWEoYWxwaGEsIGJldGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdnYW1tYSgpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVycycpOyAvLyBhcmdDaGVja1xuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG4gICAgICAgIC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxuICAgICAgICAgKi9cblxuICAgIGxldCB1O1xuXG4gICAgaWYgKGFscGhhID4gMS4wKSB7XG4gICAgICBjb25zdCBhaW52ID0gTWF0aC5zcXJ0KDIuMCAqIGFscGhhIC0gMS4wKTtcblxuICAgICAgY29uc3QgYmJiID0gYWxwaGEgLSB0aGlzLkxPRzQ7XG5cbiAgICAgIGNvbnN0IGNjYyA9IGFscGhhICsgYWludjtcblxuICAgICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIGNvbnN0IHUxID0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgICBpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgICAgIGNvbnN0IHYgPSBNYXRoLmxvZyh1MSAvICgxLjAgLSB1MSkpIC8gYWludjtcblxuICAgICAgICBjb25zdCB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcblxuICAgICAgICBjb25zdCB6ID0gdTEgKiB1MSAqIHUyO1xuXG4gICAgICAgIGNvbnN0IHIgPSBiYmIgKyBjY2MgKiB2IC0geDtcblxuICAgICAgICBpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XG4gICAgICAgICAgcmV0dXJuIHggKiBiZXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhbHBoYSA9PT0gMS4wKSB7XG4gICAgICB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgICAgd2hpbGUgKHUgPD0gMWUtNykge1xuICAgICAgICB1ID0gdGhpcy5yYW5kb20oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtTWF0aC5sb2codSkgKiBiZXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgeDtcblxuICAgICAgd2hpbGUgKHRydWUpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICAgIHUgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgICAgIGNvbnN0IGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xuXG4gICAgICAgIGNvbnN0IHAgPSBiICogdTtcblxuICAgICAgICBpZiAocCA8PSAxLjApIHtcbiAgICAgICAgICB4ID0gTWF0aC5wb3cocCwgMS4wIC8gYWxwaGEpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeCA9IC1NYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdTEgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgICAgIGlmIChwID4gMS4wKSB7XG4gICAgICAgICAgaWYgKHUxIDw9IE1hdGgucG93KHgsIChhbHBoYSAtIDEuMCkpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodTEgPD0gTWF0aC5leHAoLXgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB4ICogYmV0YTtcbiAgICB9XG5cbiAgfVxuXG4gIG5vcm1hbChtdSwgc2lnbWEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignbm9ybWFsKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBtdSBhbmQgc2lnbWEgcGFyYW1ldGVycycpOyAgICAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuXG4gICAgbGV0IHogPSB0aGlzLmxhc3ROb3JtYWw7XG5cbiAgICB0aGlzLmxhc3ROb3JtYWwgPSBOYU47XG4gICAgaWYgKCF6KSB7XG4gICAgICBjb25zdCBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuXG4gICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG5cbiAgICAgIHogPSBNYXRoLmNvcyhhKSAqIGI7XG4gICAgICB0aGlzLmxhc3ROb3JtYWwgPSBNYXRoLnNpbihhKSAqIGI7XG4gICAgfVxuICAgIHJldHVybiBtdSArIHogKiBzaWdtYTtcbiAgfVxuXG4gIHBhcmV0byhhbHBoYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3BhcmV0bygpIG11c3QgYmUgY2FsbGVkIHdpdGggYWxwaGEgcGFyYW1ldGVyJyk7ICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG5cbiAgICBjb25zdCB1ID0gdGhpcy5yYW5kb20oKTtcblxuICAgIHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XG4gIH1cblxuICB0cmlhbmd1bGFyKGxvd2VyLCB1cHBlciwgbW9kZSkge1xuICAgICAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RyaWFuZ3VsYXJfZGlzdHJpYnV0aW9uXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigndHJpYW5ndWxhcigpIG11c3QgYmUgY2FsbGVkIHdpdGggbG93ZXIsIHVwcGVyIGFuZCBtb2RlIHBhcmFtZXRlcnMnKTsgICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJnQ2hlY2tcblxuICAgIGNvbnN0IGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcblxuICAgIGNvbnN0IHUgPSB0aGlzLnJhbmRvbSgpO1xuXG4gICAgaWYgKHUgPD0gYykge1xuICAgICAgcmV0dXJuIGxvd2VyICsgTWF0aC5zcXJ0KHUgKiAodXBwZXIgLSBsb3dlcikgKiAobW9kZSAtIGxvd2VyKSk7XG4gICAgfVxuICAgIHJldHVybiB1cHBlciAtIE1hdGguc3FydCgoMSAtIHUpICogKHVwcGVyIC0gbG93ZXIpICogKHVwcGVyIC0gbW9kZSkpO1xuICB9XG5cbiAgLyoqXG4gICogQWxsIGZsb2F0cyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBhcmUgZXF1YWxseSBsaWtlbHkuIFRoaXMgaXMgdGhlXG4gICogdGhlb3JldGljYWwgZGlzdHJpYnV0aW9uIG1vZGVsIGZvciBhIGJhbGFuY2VkIGNvaW4sIGFuIHVuYmlhc2VkIGRpZSwgYVxuICAqIGNhc2lubyByb3VsZXR0ZSwgb3IgdGhlIGZpcnN0IGNhcmQgb2YgYSB3ZWxsLXNodWZmbGVkIGRlY2suXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbG93ZXJcbiAgKiBAcGFyYW0ge051bWJlcn0gdXBwZXJcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICB1bmlmb3JtKGxvd2VyLCB1cHBlcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ3VuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzJyk7ICAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgcmV0dXJuIGxvd2VyICsgdGhpcy5yYW5kb20oKSAqICh1cHBlciAtIGxvd2VyKTtcbiAgfVxuXG4gIHdlaWJ1bGwoYWxwaGEsIGJldGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCd3ZWlidWxsKCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzJyk7ICAgIC8vIGFyZ0NoZWNrXG4gICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ0NoZWNrXG4gICAgY29uc3QgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cbiAgICByZXR1cm4gYWxwaGEgKiBNYXRoLnBvdygtTWF0aC5sb2codSksIDEuMCAvIGJldGEpO1xuICB9XG59XG5cbi8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXG5cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblJhbmRvbS5wcm90b3R5cGUuTE9HNCA9IE1hdGgubG9nKDQuMCk7XG5SYW5kb20ucHJvdG90eXBlLlNHX01BR0lDQ09OU1QgPSAxLjAgKyBNYXRoLmxvZyg0LjUpO1xuXG5leHBvcnQgeyBSYW5kb20gfTtcbmV4cG9ydCBkZWZhdWx0IFJhbmRvbTtcbiIsImltcG9ydCB7IGFyZ0NoZWNrLCBTdG9yZSwgQnVmZmVyLCBFdmVudCB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eSwgY3VycmVudFRpbWUsIGRlbGl2ZXJBdCkge1xuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgIHRoaXMuc2NoZWR1bGVkQXQgPSBjdXJyZW50VGltZTtcbiAgICB0aGlzLmRlbGl2ZXJBdCA9IGRlbGl2ZXJBdDtcbiAgICB0aGlzLmRlbGl2ZXJ5UGVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICAgICAgLy8gQXNrIHRoZSBtYWluIHJlcXVlc3QgdG8gaGFuZGxlIGNhbmNlbGxhdGlvblxuICAgIGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXBbMF0gIT09IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwWzBdLmNhbmNlbCgpO1xuICAgIH1cblxuICAgICAgICAvLyAtLT4gdGhpcyBpcyBtYWluIHJlcXVlc3RcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgLy8gaWYgYWxyZWFkeSBjYW5jZWxsZWQsIGRvIG5vdGhpbmdcbiAgICBpZiAodGhpcy5jYW5jZWxsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBwcmV2ZW50IGNhbmNlbGxhdGlvbiBpZiByZXF1ZXN0IGlzIGFib3V0IHRvIGJlIGRlbGl2ZXJlZCBhdCB0aGlzXG4gICAgICAgIC8vIGluc3RhbnQgY292ZXJzIGNhc2Ugd2hlcmUgaW4gYSBidWZmZXIgb3Igc3RvcmUsIG9iamVjdCBoYXMgYWxyZWFkeVxuICAgICAgICAvLyBiZWVuIGRlcXVldWVkIGFuZCBkZWxpdmVyeSB3YXMgc2NoZWR1bGVkIGZvciBub3csIGJ1dCB3YWl0VW50aWxcbiAgICAgICAgLy8gdGltZXMgb3V0IGF0IHRoZSBzYW1lIHRpbWUsIG1ha2luZyB0aGUgcmVxdWVzdCBnZXQgY2FuY2VsbGVkIGFmdGVyXG4gICAgICAgIC8vIHRoZSBvYmplY3QgaXMgZGVxdWV1ZWQgYnV0IGJlZm9yZSBpdCBpcyBkZWxpdmVyZWRcbiAgICBpZiAodGhpcy5kZWxpdmVyeVBlbmRpbmcpIHJldHVybjtcblxuICAgICAgICAvLyBzZXQgZmxhZ1xuICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgdGhpcy5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICBpZiAoKHRoaXMuc291cmNlIGluc3RhbmNlb2YgQnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICB8fCAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBTdG9yZSkpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJvZ3Jlc3NQdXRRdWV1ZSgpO1xuICAgICAgICB0aGlzLnNvdXJjZS5wcm9ncmVzc0dldFF1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdyb3VwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0aGlzLmdyb3VwW2ldLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPT09IDApIHtcbiAgICAgICAgdGhpcy5ncm91cFtpXS5kZWxpdmVyQXQgPSB0aGlzLmVudGl0eS50aW1lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9uZShjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDAsIDMsIEZ1bmN0aW9uLCBPYmplY3QpO1xuXG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChbY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50XSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB3YWl0VW50aWwoZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgNCwgbnVsbCwgRnVuY3Rpb24sIE9iamVjdCk7XG4gICAgaWYgKHRoaXMubm9SZW5lZ2UpIHJldHVybiB0aGlzO1xuXG4gICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KFxuICAgICAgdGhpcy5zY2hlZHVsZWRBdCArIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpO1xuXG4gICAgdGhpcy5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmxlc3NFdmVudChldmVudCwgY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3VtZW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCA0LCBudWxsLCBGdW5jdGlvbiwgT2JqZWN0KTtcbiAgICBpZiAodGhpcy5ub1JlbmVnZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgIHJvLm1zZyA9IGV2ZW50O1xuICAgICAgZXZlbnQuYWRkV2FpdExpc3Qocm8pO1xuXG4gICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgY29uc3Qgcm8gPSB0aGlzLl9hZGRSZXF1ZXN0KDAsIGNhbGxiYWNrLCBjb250ZXh0LCBhcmd1bWVudCk7XG5cbiAgICAgICAgcm8ubXNnID0gZXZlbnRbaV07XG4gICAgICAgIGV2ZW50W2ldLmFkZFdhaXRMaXN0KHJvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgIHRoaXMuZGVsaXZlcnlQZW5kaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICBpZiAoIXRoaXMuY2FsbGJhY2tzKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2RvQ2FsbGJhY2sodGhpcy5ncm91cFswXS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXNnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwWzBdLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kb0NhbGxiYWNrKHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgfVxuXG4gIGNhbmNlbFJlbmVnZUNsYXVzZXMoKSB7XG4gICAgICAgIC8vIHRoaXMuY2FuY2VsID0gdGhpcy5OdWxsO1xuICAgICAgICAvLyB0aGlzLndhaXRVbnRpbCA9IHRoaXMuTnVsbDtcbiAgICAgICAgLy8gdGhpcy51bmxlc3NFdmVudCA9IHRoaXMuTnVsbDtcbiAgICB0aGlzLm5vUmVuZWdlID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5ncm91cCB8fCB0aGlzLmdyb3VwWzBdICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuZ3JvdXBbaV0uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9PT0gMCkge1xuICAgICAgICB0aGlzLmdyb3VwW2ldLmRlbGl2ZXJBdCA9IHRoaXMuZW50aXR5LnRpbWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBOdWxsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2FkZFJlcXVlc3QoZGVsaXZlckF0LCBjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnQpIHtcbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LFxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXQsXG4gICAgICAgICAgICAgICAgZGVsaXZlckF0KTtcblxuICAgIHJvLmNhbGxiYWNrcy5wdXNoKFtjYWxsYmFjaywgY29udGV4dCwgYXJndW1lbnRdKTtcblxuICAgIGlmICh0aGlzLmdyb3VwID09PSBudWxsKSB7XG4gICAgICB0aGlzLmdyb3VwID0gW3RoaXNdO1xuICAgIH1cblxuICAgIHRoaXMuZ3JvdXAucHVzaChybyk7XG4gICAgcm8uZ3JvdXAgPSB0aGlzLmdyb3VwO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIF9kb0NhbGxiYWNrKHNvdXJjZSwgbXNnLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2ldWzBdO1xuXG4gICAgICBpZiAoIWNhbGxiYWNrKSBjb250aW51ZTtcblxuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLmNhbGxiYWNrc1tpXVsxXTtcblxuICAgICAgaWYgKCFjb250ZXh0KSBjb250ZXh0ID0gdGhpcy5lbnRpdHk7XG5cbiAgICAgIGNvbnN0IGFyZ3VtZW50ID0gdGhpcy5jYWxsYmFja3NbaV1bMl07XG5cbiAgICAgIGNvbnRleHQuY2FsbGJhY2tTb3VyY2UgPSBzb3VyY2U7XG4gICAgICBjb250ZXh0LmNhbGxiYWNrTWVzc2FnZSA9IG1zZztcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gZGF0YTtcblxuICAgICAgaWYgKCFhcmd1bWVudCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJndW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0LmNhbGxiYWNrU291cmNlID0gbnVsbDtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tNZXNzYWdlID0gbnVsbDtcbiAgICAgIGNvbnRleHQuY2FsbGJhY2tEYXRhID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgUmVxdWVzdCB9O1xuIiwiaW1wb3J0IHsgUFF1ZXVlLCBRdWV1ZSB9IGZyb20gJy4vcXVldWVzLmpzJztcbmltcG9ydCB7IFBvcHVsYXRpb24gfSBmcm9tICcuL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsLmpzJztcblxuZnVuY3Rpb24gYXJnQ2hlY2soZm91bmQsIGV4cE1pbiwgZXhwTWF4KSB7XG4gIGlmIChmb3VuZC5sZW5ndGggPCBleHBNaW4gfHwgZm91bmQubGVuZ3RoID4gZXhwTWF4KSB7ICAgLy8gYXJnQ2hlY2tcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzJyk7ICAgLy8gYXJnQ2hlY2tcbiAgfSAgIC8vIGFyZ0NoZWNrXG5cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZvdW5kLmxlbmd0aDsgaSsrKSB7ICAgLy8gYXJnQ2hlY2tcblxuICAgIGlmICghYXJndW1lbnRzW2kgKyAzXSB8fCAhZm91bmRbaV0pIGNvbnRpbnVlOyAgIC8vIGFyZ0NoZWNrXG5cbi8vICAgIHByaW50KFwiVEVTVCBcIiArIGZvdW5kW2ldICsgXCIgXCIgKyBhcmd1bWVudHNbaSArIDNdICAgLy8gYXJnQ2hlY2tcbi8vICAgICsgXCIgXCIgKyAoZm91bmRbaV0gaW5zdGFuY2VvZiBFdmVudCkgICAvLyBhcmdDaGVja1xuLy8gICAgKyBcIiBcIiArIChmb3VuZFtpXSBpbnN0YW5jZW9mIGFyZ3VtZW50c1tpICsgM10pICAgLy8gYXJnQ2hlY2tcbi8vICAgICsgXCJcXG5cIik7ICAgLy8gQVJHIENIRUNLXG5cblxuICAgIGlmICghKGZvdW5kW2ldIGluc3RhbmNlb2YgYXJndW1lbnRzW2kgKyAzXSkpIHsgICAvLyBhcmdDaGVja1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBwYXJhbWV0ZXIgJHtpICsgMX0gaXMgb2YgaW5jb3JyZWN0IHR5cGUuYCk7ICAgLy8gYXJnQ2hlY2tcbiAgICB9ICAgLy8gYXJnQ2hlY2tcbiAgfSAgIC8vIGFyZ0NoZWNrXG59ICAgLy8gYXJnQ2hlY2tcblxuY2xhc3MgU2ltIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zaW1UaW1lID0gMDtcbiAgICB0aGlzLmVudGl0aWVzID0gW107XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBQUXVldWUoKTtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgIHRoaXMuZW50aXR5SWQgPSAxO1xuICB9XG5cbiAgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW1UaW1lO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgY29uc3Qgc2VuZGVyID0gdGhpcy5zb3VyY2U7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tc2c7XG5cbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZGF0YTtcblxuICAgIGNvbnN0IHNpbSA9IHNlbmRlci5zaW07XG5cbiAgICBpZiAoIWVudGl0aWVzKSB7XG4gICAgICAgICAgICAvLyBzZW5kIHRvIGFsbCBlbnRpdGllc1xuICAgICAgZm9yIChsZXQgaSA9IHNpbS5lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBzaW0uZW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGVudGl0eSA9PT0gc2VuZGVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGVudGl0eS5vbk1lc3NhZ2UpIGVudGl0eS5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVudGl0aWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAobGV0IGkgPSBlbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgICBpZiAoZW50aXR5ID09PSBzZW5kZXIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoZW50aXR5Lm9uTWVzc2FnZSkgZW50aXR5Lm9uTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZW50aXRpZXMub25NZXNzYWdlKSB7XG4gICAgICBlbnRpdGllcy5vbk1lc3NhZ2Uoc2VuZGVyLCBtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBhZGRFbnRpdHkoS2xhc3MsIG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgcHJvdG90eXBlIGhhcyBzdGFydCBmdW5jdGlvblxuICAgIGlmICghS2xhc3MucHJvdG90eXBlLnN0YXJ0KSB7ICAvLyBBUkcgQ0hFQ0tcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW50aXR5IGNsYXNzICR7S2xhc3MubmFtZX0gbXVzdCBoYXZlIHN0YXJ0KCkgZnVuY3Rpb24gZGVmaW5lZGApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IG5ldyBLbGFzcyh0aGlzLCBuYW1lKTtcblxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuXG4gICAgZW50aXR5LnN0YXJ0KC4uLmFyZ3MpO1xuXG4gICAgcmV0dXJuIGVudGl0eTtcbiAgfVxuXG4gIHNpbXVsYXRlKGVuZFRpbWUsIG1heEV2ZW50cykge1xuICAgICAgICAvLyBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuICAgIGlmICghbWF4RXZlbnRzKSB7IG1heEV2ZW50cyA9IE1hdGguSW5maW5pdHk7IH1cbiAgICBsZXQgZXZlbnRzID0gMDtcblxuICAgIHdoaWxlICh0cnVlKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgZXZlbnRzKys7XG4gICAgICBpZiAoZXZlbnRzID4gbWF4RXZlbnRzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZWFybGllc3QgZXZlbnRcbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgZXZlbnRzLCB3ZSBhcmUgZG9uZSB3aXRoIHNpbXVsYXRpb24gaGVyZS5cbiAgICAgIGlmIChybyA9PT0gbnVsbCkgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIFVoIG9oLi4gd2UgYXJlIG91dCBvZiB0aW1lIG5vd1xuICAgICAgaWYgKHJvLmRlbGl2ZXJBdCA+IGVuZFRpbWUpIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBBZHZhbmNlIHNpbXVsYXRpb24gdGltZVxuICAgICAgdGhpcy5zaW1UaW1lID0gcm8uZGVsaXZlckF0O1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGV2ZW50IGlzIGFscmVhZHkgY2FuY2VsbGVkLCBpZ25vcmVcbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIGNvbnRpbnVlO1xuXG4gICAgICByby5kZWxpdmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RlcCgpIHtcbiAgICB3aGlsZSAodHJ1ZSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgIGNvbnN0IHJvID0gdGhpcy5xdWV1ZS5yZW1vdmUoKTtcblxuICAgICAgaWYgKHJvID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICB0aGlzLnNpbVRpbWUgPSByby5kZWxpdmVyQXQ7XG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSBjb250aW51ZTtcbiAgICAgIHJvLmRlbGl2ZXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZpbmFsaXplKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAodGhpcy5lbnRpdGllc1tpXS5maW5hbGl6ZSkge1xuICAgICAgICB0aGlzLmVudGl0aWVzW2ldLmZpbmFsaXplKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0TG9nZ2VyKGxvZ2dlcikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRnVuY3Rpb24pO1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UsIGVudGl0eSkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMik7XG5cbiAgICBpZiAoIXRoaXMubG9nZ2VyKSByZXR1cm47XG4gICAgbGV0IGVudGl0eU1zZyA9ICcnO1xuXG4gICAgaWYgKHR5cGVvZiBlbnRpdHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoZW50aXR5Lm5hbWUpIHtcbiAgICAgICAgZW50aXR5TXNnID0gYCBbJHtlbnRpdHkubmFtZX1dYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudGl0eU1zZyA9IGAgWyR7ZW50aXR5LmlkfV0gYDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIoYCR7dGhpcy5zaW1UaW1lLnRvRml4ZWQoNil9JHtlbnRpdHlNc2d9ICAgJHttZXNzYWdlfWApO1xuICB9XG59XG5cbmNsYXNzIEZhY2lsaXR5IGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBkaXNjaXBsaW5lLCBzZXJ2ZXJzLCBtYXhxbGVuKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCA0KTtcblxuICAgIHRoaXMuZnJlZSA9IHNlcnZlcnMgPyBzZXJ2ZXJzIDogMTtcbiAgICB0aGlzLnNlcnZlcnMgPSBzZXJ2ZXJzID8gc2VydmVycyA6IDE7XG4gICAgdGhpcy5tYXhxbGVuID0gKHR5cGVvZiBtYXhxbGVuID09PSAndW5kZWZpbmVkJykgPyAtMSA6IDEgKiBtYXhxbGVuO1xuXG4gICAgc3dpdGNoIChkaXNjaXBsaW5lKSB7XG5cbiAgICBjYXNlIEZhY2lsaXR5LkxDRlM6XG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlTENGUztcbiAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRmFjaWxpdHkuUFM6XG4gICAgICB0aGlzLnVzZSA9IHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZztcbiAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRmFjaWxpdHkuRkNGUzpcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy51c2UgPSB0aGlzLnVzZUZDRlM7XG4gICAgICB0aGlzLmZyZWVTZXJ2ZXJzID0gbmV3IEFycmF5KHRoaXMuc2VydmVycyk7XG4gICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB0aGlzLmZyZWVTZXJ2ZXJzW2ldID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN0YXRzID0gbmV3IFBvcHVsYXRpb24oKTtcbiAgICB0aGlzLmJ1c3lEdXJhdGlvbiA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnF1ZXVlLnJlc2V0KCk7XG4gICAgdGhpcy5zdGF0cy5yZXNldCgpO1xuICAgIHRoaXMuYnVzeUR1cmF0aW9uID0gMDtcbiAgfVxuXG4gIHN5c3RlbVN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRzO1xuICB9XG5cbiAgcXVldWVTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5zdGF0cztcbiAgfVxuXG4gIHVzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1c3lEdXJhdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnN0YXRzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gICAgdGhpcy5xdWV1ZS5zdGF0cy5maW5hbGl6ZSh0aW1lc3RhbXApO1xuICB9XG5cbiAgdXNlRkNGUyhkdXJhdGlvbiwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuICAgIGlmICgodGhpcy5tYXhxbGVuID09PSAwICYmICF0aGlzLmZyZWUpXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMubWF4cWxlbiA+IDAgJiYgdGhpcy5xdWV1ZS5zaXplKCkgPj0gdGhpcy5tYXhxbGVuKSkge1xuICAgICAgcm8ubXNnID0gLTE7XG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJvLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgY29uc3Qgbm93ID0gcm8uZW50aXR5LnRpbWUoKTtcblxuICAgIHRoaXMuc3RhdHMuZW50ZXIobm93KTtcbiAgICB0aGlzLnF1ZXVlLnB1c2gocm8sIG5vdyk7XG4gICAgdGhpcy51c2VGQ0ZTU2NoZWR1bGUobm93KTtcbiAgfVxuXG4gIHVzZUZDRlNTY2hlZHVsZSh0aW1lc3RhbXApIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgd2hpbGUgKHRoaXMuZnJlZSA+IDAgJiYgIXRoaXMucXVldWUuZW1wdHkoKSkge1xuICAgICAgY29uc3Qgcm8gPSB0aGlzLnF1ZXVlLnNoaWZ0KHRpbWVzdGFtcCk7XG5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJlZVNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBpZiAodGhpcy5mcmVlU2VydmVyc1tpXSkge1xuICAgICAgICAgIHRoaXMuZnJlZVNlcnZlcnNbaV0gPSBmYWxzZTtcbiAgICAgICAgICByby5tc2cgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnJlZSAtLTtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9IHJvLmR1cmF0aW9uO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgYWxsIG90aGVyIHJlbmVnaW5nIHJlcXVlc3RzXG4gICAgICByby5jYW5jZWxSZW5lZ2VDbGF1c2VzKCk7XG5cbiAgICAgIGNvbnN0IG5ld3JvID0gbmV3IFJlcXVlc3QodGhpcywgdGltZXN0YW1wLCB0aW1lc3RhbXAgKyByby5kdXJhdGlvbik7XG5cbiAgICAgIG5ld3JvLmRvbmUodGhpcy51c2VGQ0ZTQ2FsbGJhY2ssIHRoaXMsIHJvKTtcblxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3cm8pO1xuICAgIH1cbiAgfVxuXG4gIHVzZUZDRlNDYWxsYmFjayhybykge1xuICAgICAgICAvLyBXZSBoYXZlIG9uZSBtb3JlIGZyZWUgc2VydmVyXG4gICAgdGhpcy5mcmVlICsrO1xuICAgIHRoaXMuZnJlZVNlcnZlcnNbcm8ubXNnXSA9IHRydWU7XG5cbiAgICB0aGlzLnN0YXRzLmxlYXZlKHJvLnNjaGVkdWxlZEF0LCByby5lbnRpdHkudGltZSgpKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBzb21lb25lIHdhaXRpbmcsIHNjaGVkdWxlIGl0IG5vd1xuICAgIHRoaXMudXNlRkNGU1NjaGVkdWxlKHJvLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIHJlc3RvcmUgdGhlIGRlbGl2ZXIgZnVuY3Rpb24sIGFuZCBkZWxpdmVyXG4gICAgcm8uZGVsaXZlcigpO1xuXG4gIH1cblxuICB1c2VMQ0ZTKGR1cmF0aW9uLCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgcnVubmluZyByZXF1ZXN0Li5cbiAgICBpZiAodGhpcy5jdXJyZW50Uk8pIHtcbiAgICAgIHRoaXMuYnVzeUR1cmF0aW9uICs9ICh0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpIC0gdGhpcy5jdXJyZW50Uk8ubGFzdElzc3VlZCk7XG4gICAgICAgICAgICAvLyBjYWxjdWF0ZSB0aGUgcmVtYWluaW5nIHRpbWVcbiAgICAgIHRoaXMuY3VycmVudFJPLnJlbWFpbmluZyA9IChcbiAgICAgICAgICB0aGlzLmN1cnJlbnRSTy5kZWxpdmVyQXQgLSB0aGlzLmN1cnJlbnRSTy5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgICAgIC8vIHByZWVtcHQgaXQuLlxuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRoaXMuY3VycmVudFJPLCByby5lbnRpdHkudGltZSgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRSTyA9IHJvO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lLi5cbiAgICBpZiAoIXJvLnNhdmVkX2RlbGl2ZXIpIHtcbiAgICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcbiAgICAgIHJvLnJlbWFpbmluZyA9IGR1cmF0aW9uO1xuICAgICAgcm8uc2F2ZWRfZGVsaXZlciA9IHJvLmRlbGl2ZXI7XG4gICAgICByby5kZWxpdmVyID0gdGhpcy51c2VMQ0ZTQ2FsbGJhY2s7XG5cbiAgICAgIHRoaXMuc3RhdHMuZW50ZXIocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgfVxuXG4gICAgcm8ubGFzdElzc3VlZCA9IHJvLmVudGl0eS50aW1lKCk7XG5cbiAgICAgICAgLy8gc2NoZWR1bGUgdGhpcyBuZXcgZXZlbnRcbiAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpICsgZHVyYXRpb247XG4gICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgdXNlTENGU0NhbGxiYWNrKCkge1xuICAgIGNvbnN0IGZhY2lsaXR5ID0gdGhpcy5zb3VyY2U7XG5cbiAgICBpZiAodGhpcyAhPT0gZmFjaWxpdHkuY3VycmVudFJPKSByZXR1cm47XG4gICAgZmFjaWxpdHkuY3VycmVudFJPID0gbnVsbDtcblxuICAgICAgICAvLyBzdGF0c1xuICAgIGZhY2lsaXR5LmJ1c3lEdXJhdGlvbiArPSAodGhpcy5lbnRpdHkudGltZSgpIC0gdGhpcy5sYXN0SXNzdWVkKTtcbiAgICBmYWNpbGl0eS5zdGF0cy5sZWF2ZSh0aGlzLnNjaGVkdWxlZEF0LCB0aGlzLmVudGl0eS50aW1lKCkpO1xuXG4gICAgICAgIC8vIGRlbGl2ZXIgdGhpcyByZXF1ZXN0XG4gICAgdGhpcy5kZWxpdmVyID0gdGhpcy5zYXZlZF9kZWxpdmVyO1xuICAgIGRlbGV0ZSB0aGlzLnNhdmVkX2RlbGl2ZXI7XG4gICAgdGhpcy5kZWxpdmVyKCk7XG5cbiAgICAgICAgLy8gc2VlIGlmIHRoZXJlIGFyZSBwZW5kaW5nIHJlcXVlc3RzXG4gICAgaWYgKCFmYWNpbGl0eS5xdWV1ZS5lbXB0eSgpKSB7XG4gICAgICBjb25zdCBvYmogPSBmYWNpbGl0eS5xdWV1ZS5wb3AodGhpcy5lbnRpdHkudGltZSgpKTtcblxuICAgICAgZmFjaWxpdHkudXNlTENGUyhvYmoucmVtYWluaW5nLCBvYmopO1xuICAgIH1cbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmcoZHVyYXRpb24sIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBudWxsLCBSZXF1ZXN0KTtcbiAgICByby5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIHJvLmNhbmNlbFJlbmVnZUNsYXVzZXMoKTtcbiAgICB0aGlzLnN0YXRzLmVudGVyKHJvLmVudGl0eS50aW1lKCkpO1xuICAgIHRoaXMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHJvLCB0cnVlKTtcbiAgfVxuXG4gIHVzZVByb2Nlc3NvclNoYXJpbmdTY2hlZHVsZShybywgaXNBZGRlZCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSByby5lbnRpdHkudGltZSgpO1xuXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuXG4gICAgY29uc3QgbXVsdGlwbGllciA9IGlzQWRkZWQgPyAoKHNpemUgKyAxLjApIC8gc2l6ZSkgOiAoKHNpemUgLSAxLjApIC8gc2l6ZSk7XG5cbiAgICBjb25zdCBuZXdRdWV1ZSA9IFtdO1xuXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxhc3RJc3N1ZWQgPSBjdXJyZW50O1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG5cbiAgICAgIGNvbnN0IGV2ID0gdGhpcy5xdWV1ZVtpXTtcblxuICAgICAgaWYgKGV2LnJvID09PSBybykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5ld2V2ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgdGhpcywgY3VycmVudCwgY3VycmVudCArIChldi5kZWxpdmVyQXQgLSBjdXJyZW50KSAqIG11bHRpcGxpZXIpO1xuXG4gICAgICBuZXdldi5ybyA9IGV2LnJvO1xuICAgICAgbmV3ZXYuc291cmNlID0gdGhpcztcbiAgICAgIG5ld2V2LmRlbGl2ZXIgPSB0aGlzLnVzZVByb2Nlc3NvclNoYXJpbmdDYWxsYmFjaztcbiAgICAgIG5ld1F1ZXVlLnB1c2gobmV3ZXYpO1xuXG4gICAgICBldi5jYW5jZWwoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KG5ld2V2KTtcbiAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgbmV3IHJlcXVlc3RcbiAgICBpZiAoaXNBZGRlZCkge1xuICAgICAgY29uc3QgbmV3ZXYgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICB0aGlzLCBjdXJyZW50LCBjdXJyZW50ICsgcm8uZHVyYXRpb24gKiAoc2l6ZSArIDEpKTtcblxuICAgICAgbmV3ZXYucm8gPSBybztcbiAgICAgIG5ld2V2LnNvdXJjZSA9IHRoaXM7XG4gICAgICBuZXdldi5kZWxpdmVyID0gdGhpcy51c2VQcm9jZXNzb3JTaGFyaW5nQ2FsbGJhY2s7XG4gICAgICBuZXdRdWV1ZS5wdXNoKG5ld2V2KTtcblxuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQobmV3ZXYpO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUgPSBuZXdRdWV1ZTtcblxuICAgICAgICAvLyB1c2FnZSBzdGF0aXN0aWNzXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmJ1c3lEdXJhdGlvbiArPSAoY3VycmVudCAtIHRoaXMubGFzdElzc3VlZCk7XG4gICAgfVxuICB9XG5cbiAgdXNlUHJvY2Vzc29yU2hhcmluZ0NhbGxiYWNrKCkge1xuICAgIGNvbnN0IGZhYyA9IHRoaXMuc291cmNlO1xuXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkKSByZXR1cm47XG4gICAgZmFjLnN0YXRzLmxlYXZlKHRoaXMucm8uc2NoZWR1bGVkQXQsIHRoaXMucm8uZW50aXR5LnRpbWUoKSk7XG5cbiAgICBmYWMudXNlUHJvY2Vzc29yU2hhcmluZ1NjaGVkdWxlKHRoaXMucm8sIGZhbHNlKTtcbiAgICB0aGlzLnJvLmRlbGl2ZXIoKTtcbiAgfVxufVxuXG5GYWNpbGl0eS5GQ0ZTID0gMTtcbkZhY2lsaXR5LkxDRlMgPSAyO1xuRmFjaWxpdHkuUFMgPSAzO1xuRmFjaWxpdHkuTnVtRGlzY2lwbGluZXMgPSA0O1xuXG5jbGFzcyBCdWZmZXIgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNhcGFjaXR5LCBpbml0aWFsKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAzKTtcblxuICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICB0aGlzLmF2YWlsYWJsZSA9ICh0eXBlb2YgaW5pdGlhbCA9PT0gJ3VuZGVmaW5lZCcpID8gMCA6IGluaXRpYWw7XG4gICAgdGhpcy5wdXRRdWV1ZSA9IG5ldyBRdWV1ZSgpO1xuICAgIHRoaXMuZ2V0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChhbW91bnQsIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KClcbiAgICAgICAgICAgICAgICAmJiBhbW91bnQgPD0gdGhpcy5hdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlIC09IGFtb3VudDtcblxuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcblxuICAgICAgdGhpcy5nZXRRdWV1ZS5wYXNzYnkocm8uZGVsaXZlckF0KTtcblxuICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMuZ2V0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwdXQoYW1vdW50LCBybykge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMik7XG5cbiAgICBpZiAodGhpcy5wdXRRdWV1ZS5lbXB0eSgpXG4gICAgICAgICAgICAgICAgJiYgKGFtb3VudCArIHRoaXMuYXZhaWxhYmxlKSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSArPSBhbW91bnQ7XG5cbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG5cbiAgICAgIHRoaXMucHV0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NHZXRRdWV1ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcm8uYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMucHV0UXVldWUucHVzaChybywgcm8uZW50aXR5LnRpbWUoKSk7XG4gIH1cblxuICBwcm9ncmVzc0dldFF1ZXVlKCkge1xuICAgIGxldCBvYmo7XG5cbiAgICB3aGlsZSAob2JqID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChvYmouY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHRoaXMgcmVxdWVzdCBjYW4gYmUgc2F0aXNmaWVkXG4gICAgICBpZiAob2JqLmFtb3VudCA8PSB0aGlzLmF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdC4uXG4gICAgICAgIHRoaXMuZ2V0UXVldWUuc2hpZnQob2JqLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSAtPSBvYmouYW1vdW50O1xuICAgICAgICBvYmouZGVsaXZlckF0ID0gb2JqLmVudGl0eS50aW1lKCk7XG4gICAgICAgIG9iai5kZWxpdmVyeVBlbmRpbmcgPSB0cnVlO1xuICAgICAgICBvYmouZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3NQdXRRdWV1ZSgpIHtcbiAgICBsZXQgb2JqO1xuXG4gICAgd2hpbGUgKG9iaiA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAob2JqLmNhbmNlbGxlZCkge1xuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KG9iai5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKG9iai5hbW91bnQgKyB0aGlzLmF2YWlsYWJsZSA8PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgdGhpcy5wdXRRdWV1ZS5zaGlmdChvYmouZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlICs9IG9iai5hbW91bnQ7XG4gICAgICAgIG9iai5kZWxpdmVyQXQgPSBvYmouZW50aXR5LnRpbWUoKTtcbiAgICAgICAgb2JqLmRlbGl2ZXJ5UGVuZGluZyA9IHRydWU7XG4gICAgICAgIG9iai5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wdXRRdWV1ZS5zdGF0cztcbiAgfVxuXG4gIGdldFN0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFF1ZXVlLnN0YXRzO1xuICB9XG59XG5cbmNsYXNzIFN0b3JlIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihjYXBhY2l0eSwgbmFtZSA9IG51bGwpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuICAgIHN1cGVyKG5hbWUpO1xuXG4gICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMucHV0UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICB0aGlzLmdldFF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIH1cblxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9iamVjdHMubGVuZ3RoO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIGdldChmaWx0ZXIsIHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICh0aGlzLmdldFF1ZXVlLmVtcHR5KCkgJiYgdGhpcy5jdXJyZW50KCkgPiAwKSB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgICAgbGV0IG9iajtcblxuICAgICAgICAgICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBjb2RlIG91dFxuICAgICAgICAgICAgLy8gaXQgaXMgcmVwZWF0ZWQgaW4gcHJvZ3Jlc3NHZXRRdWV1ZVxuICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgIGlmIChmaWx0ZXIob2JqKSkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vYmplY3RzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzLnNoaWZ0KCk7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgIHJvLm1zZyA9IG9iajtcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICAgIHRoaXMuZ2V0UXVldWUucGFzc2J5KHJvLmRlbGl2ZXJBdCk7XG5cbiAgICAgICAgdGhpcy5wcm9ncmVzc1B1dFF1ZXVlKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJvLmZpbHRlciA9IGZpbHRlcjtcbiAgICB0aGlzLmdldFF1ZXVlLnB1c2gocm8sIHJvLmVudGl0eS50aW1lKCkpO1xuICB9XG5cbiAgcHV0KG9iaiwgcm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDIpO1xuXG4gICAgaWYgKHRoaXMucHV0UXVldWUuZW1wdHkoKSAmJiB0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlICsrO1xuXG4gICAgICByby5kZWxpdmVyQXQgPSByby5lbnRpdHkudGltZSgpO1xuICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuXG4gICAgICB0aGlzLnB1dFF1ZXVlLnBhc3NieShyby5kZWxpdmVyQXQpO1xuICAgICAgdGhpcy5vYmplY3RzLnB1c2gob2JqKTtcblxuICAgICAgdGhpcy5wcm9ncmVzc0dldFF1ZXVlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByby5vYmogPSBvYmo7XG4gICAgdGhpcy5wdXRRdWV1ZS5wdXNoKHJvLCByby5lbnRpdHkudGltZSgpKTtcbiAgfVxuXG4gIHByb2dyZXNzR2V0UXVldWUoKSB7XG4gICAgbGV0IHJvO1xuXG4gICAgd2hpbGUgKHJvID0gdGhpcy5nZXRRdWV1ZS50b3AoKSkgeyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgLy8gaWYgb2JqIGlzIGNhbmNlbGxlZC4uIHJlbW92ZSBpdC5cbiAgICAgIGlmIChyby5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhpcy5nZXRRdWV1ZS5zaGlmdChyby5lbnRpdHkudGltZSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHNlZSBpZiB0aGlzIHJlcXVlc3QgY2FuIGJlIHNhdGlzZmllZFxuICAgICAgaWYgKHRoaXMuY3VycmVudCgpID4gMCkge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSByby5maWx0ZXI7XG5cbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IG9iajtcblxuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgb2JqID0gdGhpcy5vYmplY3RzW2ldO1xuICAgICAgICAgICAgaWYgKGZpbHRlcihvYmopKSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1kZXB0aFxuICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRoaXMub2JqZWN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmogPSB0aGlzLm9iamVjdHMuc2hpZnQoKTtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0Li5cbiAgICAgICAgICB0aGlzLmdldFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICAgIHRoaXMuYXZhaWxhYmxlIC0tO1xuXG4gICAgICAgICAgcm8ubXNnID0gb2JqO1xuICAgICAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHJlcXVlc3QgY2Fubm90IGJlIHNhdGlzZmllZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9ncmVzc1B1dFF1ZXVlKCkge1xuICAgIGxldCBybztcblxuICAgIHdoaWxlIChybyA9IHRoaXMucHV0UXVldWUudG9wKCkpIHsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgICAgICAgIC8vIGlmIG9iaiBpcyBjYW5jZWxsZWQuLiByZW1vdmUgaXQuXG4gICAgICBpZiAocm8uY2FuY2VsbGVkKSB7XG4gICAgICAgIHRoaXMucHV0UXVldWUuc2hpZnQocm8uZW50aXR5LnRpbWUoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgdGhpcyByZXF1ZXN0IGNhbiBiZSBzYXRpc2ZpZWRcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQuLlxuICAgICAgICB0aGlzLnB1dFF1ZXVlLnNoaWZ0KHJvLmVudGl0eS50aW1lKCkpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZSArKztcbiAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gocm8ub2JqKTtcbiAgICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgICAgcm8uZGVsaXZlcnlQZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgcm8uZW50aXR5LnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGhpcyByZXF1ZXN0IGNhbm5vdCBiZSBzYXRpc2ZpZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHV0U3RhdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHV0UXVldWUuc3RhdHM7XG4gIH1cblxuICBnZXRTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRRdWV1ZS5zdGF0cztcbiAgfVxufVxuXG5jbGFzcyBFdmVudCBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKG5hbWUpO1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMCwgMSk7XG5cbiAgICB0aGlzLndhaXRMaXN0ID0gW107XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuaXNGaXJlZCA9IGZhbHNlO1xuICB9XG5cbiAgYWRkV2FpdExpc3Qocm8pIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgaWYgKHRoaXMuaXNGaXJlZCkge1xuICAgICAgcm8uZGVsaXZlckF0ID0gcm8uZW50aXR5LnRpbWUoKTtcbiAgICAgIHJvLmVudGl0eS5zaW0ucXVldWUuaW5zZXJ0KHJvKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy53YWl0TGlzdC5wdXNoKHJvKTtcbiAgfVxuXG4gIGFkZFF1ZXVlKHJvKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIGlmICh0aGlzLmlzRmlyZWQpIHtcbiAgICAgIHJvLmRlbGl2ZXJBdCA9IHJvLmVudGl0eS50aW1lKCk7XG4gICAgICByby5lbnRpdHkuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVldWUucHVzaChybyk7XG4gIH1cblxuICBmaXJlKGtlZXBGaXJlZCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMCwgMSk7XG5cbiAgICBpZiAoa2VlcEZpcmVkKSB7XG4gICAgICB0aGlzLmlzRmlyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgICAgICAvLyBEaXNwYXRjaCBhbGwgd2FpdGluZyBlbnRpdGllc1xuICAgIGNvbnN0IHRtcExpc3QgPSB0aGlzLndhaXRMaXN0O1xuXG4gICAgdGhpcy53YWl0TGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wTGlzdC5sZW5ndGg7IGkrKykge1xuXG4gICAgICB0bXBMaXN0W2ldLmRlbGl2ZXIoKTtcbiAgICB9XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggb25lIHF1ZXVlZCBlbnRpdHlcbiAgICBjb25zdCBsdWNreSA9IHRoaXMucXVldWUuc2hpZnQoKTtcblxuICAgIGlmIChsdWNreSkge1xuICAgICAgbHVja3kuZGVsaXZlcigpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaXNGaXJlZCA9IGZhbHNlO1xuICB9XG59XG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc2ltLCBuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5zaW0gPSBzaW07XG4gIH1cblxuICB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbS50aW1lKCk7XG4gIH1cblxuICBzZXRUaW1lcihkdXJhdGlvbikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICB0aGlzLnNpbS50aW1lKCksXG4gICAgICAgICAgICAgIHRoaXMuc2ltLnRpbWUoKSArIGR1cmF0aW9uKTtcblxuICAgIHRoaXMuc2ltLnF1ZXVlLmluc2VydChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgd2FpdEV2ZW50KGV2ZW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxLCBFdmVudCk7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBldmVudDtcbiAgICBldmVudC5hZGRXYWl0TGlzdChybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcXVldWVFdmVudChldmVudCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSwgRXZlbnQpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZXZlbnQ7XG4gICAgZXZlbnQuYWRkUXVldWUocm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIHVzZUZhY2lsaXR5KGZhY2lsaXR5LCBkdXJhdGlvbikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgRmFjaWxpdHkpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gZmFjaWxpdHk7XG4gICAgZmFjaWxpdHkudXNlKGR1cmF0aW9uLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgIGJ1ZmZlci5wdXQoYW1vdW50LCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgZ2V0QnVmZmVyKGJ1ZmZlciwgYW1vdW50KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyLCBCdWZmZXIpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gYnVmZmVyO1xuICAgIGJ1ZmZlci5nZXQoYW1vdW50LCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgcHV0U3RvcmUoc3RvcmUsIG9iaikge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMiwgMiwgU3RvcmUpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLCB0aGlzLnNpbS50aW1lKCksIDApO1xuXG4gICAgcm8uc291cmNlID0gc3RvcmU7XG4gICAgc3RvcmUucHV0KG9iaiwgcm8pO1xuICAgIHJldHVybiBybztcbiAgfVxuXG4gIGdldFN0b3JlKHN0b3JlLCBmaWx0ZXIpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIsIFN0b3JlLCBGdW5jdGlvbik7XG5cbiAgICBjb25zdCBybyA9IG5ldyBSZXF1ZXN0KHRoaXMsIHRoaXMuc2ltLnRpbWUoKSwgMCk7XG5cbiAgICByby5zb3VyY2UgPSBzdG9yZTtcbiAgICBzdG9yZS5nZXQoZmlsdGVyLCBybyk7XG4gICAgcmV0dXJuIHJvO1xuICB9XG5cbiAgc2VuZChtZXNzYWdlLCBkZWxheSwgZW50aXRpZXMpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDIsIDMpO1xuXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVxdWVzdCh0aGlzLnNpbSwgdGhpcy50aW1lKCksIHRoaXMudGltZSgpICsgZGVsYXkpO1xuXG4gICAgcm8uc291cmNlID0gdGhpcztcbiAgICByby5tc2cgPSBtZXNzYWdlO1xuICAgIHJvLmRhdGEgPSBlbnRpdGllcztcbiAgICByby5kZWxpdmVyID0gdGhpcy5zaW0uc2VuZE1lc3NhZ2U7XG5cbiAgICB0aGlzLnNpbS5xdWV1ZS5pbnNlcnQocm8pO1xuICB9XG5cbiAgbG9nKG1lc3NhZ2UpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDEpO1xuXG4gICAgdGhpcy5zaW0ubG9nKG1lc3NhZ2UsIHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCB7IFNpbSwgRmFjaWxpdHksIEJ1ZmZlciwgU3RvcmUsIEV2ZW50LCBFbnRpdHksIGFyZ0NoZWNrIH07XG4iLCJpbXBvcnQgeyBhcmdDaGVjayB9IGZyb20gJy4vc2ltLmpzJztcblxuY2xhc3MgRGF0YVNlcmllcyB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuQ291bnQgPSAwO1xuICAgIHRoaXMuVyA9IDAuMDtcbiAgICB0aGlzLkEgPSAwLjA7XG4gICAgdGhpcy5RID0gMC4wO1xuICAgIHRoaXMuTWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuTWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5TdW0gPSAwO1xuXG4gICAgaWYgKHRoaXMuaGlzdG9ncmFtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baV0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEhpc3RvZ3JhbShsb3dlciwgdXBwZXIsIG5idWNrZXRzKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAzLCAzKTtcblxuICAgIHRoaXMuaExvd2VyID0gbG93ZXI7XG4gICAgdGhpcy5oVXBwZXIgPSB1cHBlcjtcbiAgICB0aGlzLmhCdWNrZXRTaXplID0gKHVwcGVyIC0gbG93ZXIpIC8gbmJ1Y2tldHM7XG4gICAgdGhpcy5oaXN0b2dyYW0gPSBuZXcgQXJyYXkobmJ1Y2tldHMgKyAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGlzdG9ncmFtLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIHRoaXMuaGlzdG9ncmFtW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9ncmFtO1xuICB9XG5cbiAgcmVjb3JkKHZhbHVlLCB3ZWlnaHQpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDEsIDIpO1xuXG4gICAgY29uc3QgdyA9ICh0eXBlb2Ygd2VpZ2h0ID09PSAndW5kZWZpbmVkJykgPyAxIDogd2VpZ2h0O1xuXG4gICAgICAgIC8vIGRvY3VtZW50LndyaXRlKFwiRGF0YSBzZXJpZXMgcmVjb3JkaW5nIFwiICsgdmFsdWUgKyBcIiAod2VpZ2h0ID0gXCIgKyB3ICsgXCIpXFxuXCIpO1xuXG4gICAgaWYgKHZhbHVlID4gdGhpcy5NYXgpIHRoaXMuTWF4ID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5NaW4pIHRoaXMuTWluID0gdmFsdWU7XG4gICAgdGhpcy5TdW0gKz0gdmFsdWU7XG4gICAgdGhpcy5Db3VudCArKztcbiAgICBpZiAodGhpcy5oaXN0b2dyYW0pIHtcbiAgICAgIGlmICh2YWx1ZSA8IHRoaXMuaExvd2VyKSB7XG4gICAgICAgIHRoaXMuaGlzdG9ncmFtWzBdICs9IHc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5oVXBwZXIpIHtcbiAgICAgICAgdGhpcy5oaXN0b2dyYW1bdGhpcy5oaXN0b2dyYW0ubGVuZ3RoIC0gMV0gKz0gdztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcigodmFsdWUgLSB0aGlzLmhMb3dlcikgLyB0aGlzLmhCdWNrZXRTaXplKSArIDE7XG5cbiAgICAgICAgdGhpcy5oaXN0b2dyYW1baW5kZXhdICs9IHc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgICAgIC8vIFdpID0gV2ktMSArIHdpXG4gICAgdGhpcy5XID0gdGhpcy5XICsgdztcblxuICAgIGlmICh0aGlzLlcgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAgICAgLy8gQWkgPSBBaS0xICsgd2kvV2kgKiAoeGkgLSBBaS0xKVxuICAgIGNvbnN0IGxhc3RBID0gdGhpcy5BO1xuXG4gICAgdGhpcy5BID0gbGFzdEEgKyAodyAvIHRoaXMuVykgKiAodmFsdWUgLSBsYXN0QSk7XG5cbiAgICAgICAgLy8gUWkgPSBRaS0xICsgd2koeGkgLSBBaS0xKSh4aSAtIEFpKVxuICAgIHRoaXMuUSA9IHRoaXMuUSArIHcgKiAodmFsdWUgLSBsYXN0QSkgKiAodmFsdWUgLSB0aGlzLkEpO1xuICAgICAgICAvLyBwcmludChcIlxcdFc9XCIgKyB0aGlzLlcgKyBcIiBBPVwiICsgdGhpcy5BICsgXCIgUT1cIiArIHRoaXMuUSArIFwiXFxuXCIpO1xuICB9XG5cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuQ291bnQ7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuTWluO1xuICB9XG5cbiAgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLk1heDtcbiAgfVxuXG4gIHJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLk1heCAtIHRoaXMuTWluO1xuICB9XG5cbiAgc3VtKCkge1xuICAgIHJldHVybiB0aGlzLlN1bTtcbiAgfVxuXG4gIHN1bVdlaWdodGVkKCkge1xuICAgIHJldHVybiB0aGlzLkEgKiB0aGlzLlc7XG4gIH1cblxuICBhdmVyYWdlKCkge1xuICAgIHJldHVybiB0aGlzLkE7XG4gIH1cblxuICB2YXJpYW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5RIC8gdGhpcy5XO1xuICB9XG5cbiAgZGV2aWF0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy52YXJpYW5jZSgpKTtcbiAgfVxufVxuXG5jbGFzcyBUaW1lU2VyaWVzIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuZGF0YVNlcmllcyA9IG5ldyBEYXRhU2VyaWVzKG5hbWUpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kYXRhU2VyaWVzLnJlc2V0KCk7XG4gICAgdGhpcy5sYXN0VmFsdWUgPSBOYU47XG4gICAgdGhpcy5sYXN0VGltZXN0YW1wID0gTmFOO1xuICB9XG5cbiAgc2V0SGlzdG9ncmFtKGxvd2VyLCB1cHBlciwgbmJ1Y2tldHMpIHtcbiAgICBhcmdDaGVjayhhcmd1bWVudHMsIDMsIDMpO1xuICAgIHRoaXMuZGF0YVNlcmllcy5zZXRIaXN0b2dyYW0obG93ZXIsIHVwcGVyLCBuYnVja2V0cyk7XG4gIH1cblxuICBnZXRIaXN0b2dyYW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5nZXRIaXN0b2dyYW0oKTtcbiAgfVxuXG4gIHJlY29yZCh2YWx1ZSwgdGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIGlmICghaXNOYU4odGhpcy5sYXN0VGltZXN0YW1wKSkge1xuICAgICAgdGhpcy5kYXRhU2VyaWVzLnJlY29yZCh0aGlzLmxhc3RWYWx1ZSwgdGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWVzdGFtcCkge1xuICAgIGFyZ0NoZWNrKGFyZ3VtZW50cywgMSwgMSk7XG5cbiAgICB0aGlzLnJlY29yZChOYU4sIHRpbWVzdGFtcCk7XG4gIH1cblxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLmNvdW50KCk7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5taW4oKTtcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLm1heCgpO1xuICB9XG5cbiAgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcmllcy5yYW5nZSgpO1xuICB9XG5cbiAgc3VtKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuc3VtKCk7XG4gIH1cblxuICBhdmVyYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuYXZlcmFnZSgpO1xuICB9XG5cbiAgZGV2aWF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXJpZXMuZGV2aWF0aW9uKCk7XG4gIH1cblxuICB2YXJpYW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VyaWVzLnZhcmlhbmNlKCk7XG4gIH1cbn1cblxuY2xhc3MgUG9wdWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9wdWxhdGlvbiA9IDA7XG4gICAgdGhpcy5zaXplU2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoKTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzID0gbmV3IERhdGFTZXJpZXMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2l6ZVNlcmllcy5yZXNldCgpO1xuICAgIHRoaXMuZHVyYXRpb25TZXJpZXMucmVzZXQoKTtcbiAgICB0aGlzLnBvcHVsYXRpb24gPSAwO1xuICB9XG5cbiAgZW50ZXIodGltZXN0YW1wKSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAxLCAxKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiArKztcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGxlYXZlKGFycml2YWxBdCwgbGVmdEF0KSB7XG4gICAgYXJnQ2hlY2soYXJndW1lbnRzLCAyLCAyKTtcblxuICAgIHRoaXMucG9wdWxhdGlvbiAtLTtcbiAgICB0aGlzLnNpemVTZXJpZXMucmVjb3JkKHRoaXMucG9wdWxhdGlvbiwgbGVmdEF0KTtcbiAgICB0aGlzLmR1cmF0aW9uU2VyaWVzLnJlY29yZChsZWZ0QXQgLSBhcnJpdmFsQXQpO1xuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0aW9uO1xuICB9XG5cbiAgZmluYWxpemUodGltZXN0YW1wKSB7XG4gICAgdGhpcy5zaXplU2VyaWVzLmZpbmFsaXplKHRpbWVzdGFtcCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9O1xuIiwiaW1wb3J0IHsgU2ltLCBFbnRpdHksIEV2ZW50LCBCdWZmZXIsIEZhY2lsaXR5LCBTdG9yZSwgYXJnQ2hlY2sgfSBmcm9tICcuL2xpYi9zaW0uanMnO1xuaW1wb3J0IHsgRGF0YVNlcmllcywgVGltZVNlcmllcywgUG9wdWxhdGlvbiB9IGZyb20gJy4vbGliL3N0YXRzLmpzJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICcuL2xpYi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7IFBRdWV1ZSwgUXVldWUgfSBmcm9tICcuL2xpYi9xdWV1ZXMuanMnO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi9saWIvcmFuZG9tLmpzJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9saWIvbW9kZWwuanMnO1xuXG5leHBvcnQgeyBTaW0sIEVudGl0eSwgRXZlbnQsIEJ1ZmZlciwgRmFjaWxpdHksIFN0b3JlIH07XG5leHBvcnQgeyBEYXRhU2VyaWVzLCBUaW1lU2VyaWVzLCBQb3B1bGF0aW9uIH07XG5leHBvcnQgeyBSZXF1ZXN0IH07XG5leHBvcnQgeyBQUXVldWUsIFF1ZXVlLCBhcmdDaGVjayB9O1xuZXhwb3J0IHsgUmFuZG9tIH07XG5leHBvcnQgeyBNb2RlbCB9O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LlNpbSA9IHtcbiAgICBhcmdDaGVjazogYXJnQ2hlY2ssXG4gICAgQnVmZmVyOiBCdWZmZXIsXG4gICAgRGF0YVNlcmllczogRGF0YVNlcmllcyxcbiAgICBFbnRpdHk6IEVudGl0eSxcbiAgICBFdmVudDogRXZlbnQsXG4gICAgRmFjaWxpdHk6IEZhY2lsaXR5LFxuICAgIE1vZGVsOiBNb2RlbCxcbiAgICBQUXVldWU6IFBRdWV1ZSxcbiAgICBQb3B1bGF0aW9uOiBQb3B1bGF0aW9uLFxuICAgIFF1ZXVlOiBRdWV1ZSxcbiAgICBSYW5kb206IFJhbmRvbSxcbiAgICBSZXF1ZXN0OiBSZXF1ZXN0LFxuICAgIFNpbTogU2ltLFxuICAgIFN0b3JlOiBTdG9yZSxcbiAgICBUaW1lU2VyaWVzOiBUaW1lU2VyaWVzXG4gIH07XG59XG4iXX0=
