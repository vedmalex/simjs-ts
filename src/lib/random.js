
class Random {
    constructor(seed=(new Date()).getTime()) {
        if (typeof(seed) !== 'number'                             // ARG_CHECK
            || Math.ceil(seed) != Math.floor(seed)) {             // ARG_CHECK
            throw new TypeError("seed value must be an integer"); // ARG_CHECK
        }                                                         // ARG_CHECK


        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;/* constant vector a */
        this.UPPER_MASK = 0x80000000;/* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff;/* least significant r bits */

        this.mt = new Array(this.N);/* the array for the state vector */
        this.mti=this.N+1;/* mti==N+1 means mt[N] is not initialized */

        //this.init_genrand(seed);
        this.init_by_array([seed], 1);
    }

    init_genrand(s) {
        this.mt[0] = s >>> 0;
        for (this.mti=1; this.mti<this.N; this.mti++) {
            var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
            + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    init_by_array(init_key, key_length) {
        let i, j, k;
        this.init_genrand(19650218);
        i=1; j=0;
        k = (this.N>key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
            + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++; j++;
            if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
            if (j>=key_length) j=0;
        }
        for (k=this.N-1; k; k--) {
            var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
            - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }

    genrand_int32() {
        let y;
        const mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            let kk;

            if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */

            for (kk=0;kk<this.N-this.M;kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (;kk<this.N-1;kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
            this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    genrand_int31() {
        return (this.genrand_int32()>>>1);
    }

    genrand_real1() {
        return this.genrand_int32()*(1.0/4294967295.0);
        /* divided by 2^32-1 */
    }

    random() {
        if (this.pythonCompatibility) {
            if (this.skip) {
                this.genrand_int32();
            }
            this.skip = true;
        }
        return this.genrand_int32()*(1.0/4294967296.0);
        /* divided by 2^32 */
    }

    genrand_real3() {
        return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
        /* divided by 2^32 */
    }

    genrand_res53() {
        const a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
        return(a*67108864.0+b)*(1.0/9007199254740992.0);
    }

    exponential(lambda) {
        if (arguments.length != 1) {                         // ARG_CHECK
            throw new SyntaxError(`exponential() must  be called with 'lambda' parameter`); // ARG_CHECK
        }                                                   // ARG_CHECK

        const r = this.random();
        return -Math.log(r) / lambda;
    }

    gamma(alpha, beta) {
        if (arguments.length != 2) {                         // ARG_CHECK
            throw new SyntaxError(`gamma() must be called with alpha and beta parameters`); // ARG_CHECK
        }                                                   // ARG_CHECK

        /* Based on Python 2.6 source code of random.py.
         */

        if (alpha > 1.0) {
            const ainv = Math.sqrt(2.0 * alpha - 1.0);
            const bbb = alpha - this.LOG4;
            const ccc = alpha + ainv;

            while (true) {
                var u1 = this.random();
                if ((u1 < 1e-7) || (u > 0.9999999)) {
                    continue;
                }
                const u2 = 1.0 - this.random();
                const v = Math.log(u1 / (1.0 - u1)) / ainv;
                var x = alpha * Math.exp(v);
                const z = u1 * u1 * u2;
                const r = bbb + ccc * v - x;
                if ((r + this.SG_MAGICCONST - 4.5 * z >= 0.0) || (r >= Math.log(z))) {
                    return x * beta;
                }
            }
        } else if (alpha == 1.0) {
            var u = this.random();
            while (u <= 1e-7) {
                u = this.random();
            }
            return - Math.log(u) * beta;
        } else {
            while (true) {
                var u = this.random();
                const b = (Math.E + alpha) / Math.E;
                const p = b * u;
                if (p <= 1.0) {
                    var x = Math.pow(p, 1.0 / alpha);
                } else {
                    var x = - Math.log((b - p) / alpha);
                }
                var u1 = this.random();
                if (p > 1.0) {
                    if (u1 <= Math.pow(x, (alpha - 1.0))) {
                        break;
                    }
                } else if (u1 <= Math.exp(-x)) {
                    break;
                }
            }
            return x * beta;
        }

    }

    normal(mu, sigma) {
        if (arguments.length != 2) {                          // ARG_CHECK
            throw new SyntaxError(`normal() must be called with mu and sigma parameters`);      // ARG_CHECK
        }                                                    // ARG_CHECK

        let z = this.lastNormal;
        this.lastNormal = NaN;
        if (!z) {
            const a = this.random() * 2 * Math.PI;
            const b = Math.sqrt(-2.0 * Math.log(1.0 - this.random()));
            z = Math.cos(a) * b;
            this.lastNormal = Math.sin(a) * b;
        }
        return mu + z * sigma;
    }

    pareto(alpha) {
        if (arguments.length != 1) {                         // ARG_CHECK
            throw new SyntaxError(`pareto() must be called with alpha parameter`);             // ARG_CHECK
        }                                                   // ARG_CHECK

        const u = this.random();
        return 1.0 / Math.pow((1 - u), 1.0 / alpha);
    }

    triangular(lower, upper, mode) {
        // http://en.wikipedia.org/wiki/Triangular_distribution
        if (arguments.length != 3) {                         // ARG_CHECK
            throw new SyntaxError(`triangular() must be called with lower, upper and mode parameters`);    // ARG_CHECK
        }                                                   // ARG_CHECK

        const c = (mode - lower) / (upper - lower);
        const u = this.random();

        if (u <= c) {
            return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
        } else {
            return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
        }
    }

    uniform(lower, upper) {
        if (arguments.length != 2) {                         // ARG_CHECK
            throw new SyntaxError(`uniform() must be called with lower and upper parameters`);    // ARG_CHECK
        }                                                   // ARG_CHECK
        return lower + this.random() * (upper - lower);
    }

    weibull(alpha, beta) {
        if (arguments.length != 2) {                         // ARG_CHECK
            throw new SyntaxError(`weibull() must be called with alpha and beta parameters`);    // ARG_CHECK
        }                                                   // ARG_CHECK
        const u = 1.0 - this.random();
        return alpha * Math.pow(-Math.log(u), 1.0 / beta);
    }
}

/* These real versions are due to Isaku Wada, 2002/01/09 added */


/**************************************************************************/
Random.prototype.LOG4 = Math.log(4.0);
Random.prototype.SG_MAGICCONST = 1.0 + Math.log(4.5);

export { Random };
