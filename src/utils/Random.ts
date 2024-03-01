export class Random {
	M: number;
	N: number;
	MATRIX_A: number;
	UPPER_MASK: number;
	LOWER_MASK: number;
	mt: Array<number>;
	mti: number;
	pythonCompatibility = false;
	skip = false;
	LOG4 = Math.log(4.0);
	SG_MAGICCONST = 1.0 + Math.log(4.5);
	lastNormal = NaN;
	constructor(seed = new Date().getTime()) {
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

	initGenrand(_s: number) {
		let s = _s;
		this.mt[0] = s >>> 0;
		for (this.mti = 1; this.mti < this.N; this.mti++) {
			s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
			this.mt[this.mti] =
				((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
				(s & 0x0000ffff) * 1812433253 +
				this.mti;

			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			/* 2002/01/09 modified by Makoto Matsumoto             */
			/* for >32 bit machines */
			this.mt[this.mti] >>>= 0;
		}
	}

	initByArray(initKey: Array<number>, keyLength: number) {
		let i: number;
		let j: number;
		let k: number;

		this.initGenrand(19650218);
		i = 1;
		j = 0;
		k = this.N > keyLength ? this.N : keyLength;
		for (; k; k--) {
			const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

			this.mt[i] =
				(this.mt[i] ^
					(((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
						(s & 0x0000ffff) * 1664525)) +
				initKey[j] +
				j; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;
			j++;
			if (i >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				i = 1;
			}
			if (j >= keyLength) j = 0;
		}
		for (k = this.N - 1; k; k--) {
			const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

			this.mt[i] =
				(this.mt[i] ^
					(((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
						(s & 0x0000ffff) * 1566083941)) -
				i; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;
			if (i >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				i = 1;
			}
		}

		this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
	}

	genrandInt32() {
		let y: number;

		const mag01 = [0x0, this.MATRIX_A];

		//  mag01[x] = x * MATRIX_A  for x=0,1

		if (this.mti >= this.N) {
			// generate N words at one time
			let kk: number;

			if (this.mti === this.N + 1) {
				// if initGenrand() has not been called,
				this.initGenrand(5489); // a default initial seed is used
			}

			for (kk = 0; kk < this.N - this.M; kk++) {
				y =
					(this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (; kk < this.N - 1; kk++) {
				y =
					(this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] =
					this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y =
				(this.mt[this.N - 1] & this.UPPER_MASK) |
				(this.mt[0] & this.LOWER_MASK);
			this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		/* Tempering */
		y ^= y >>> 11;
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= y >>> 18;

		return y >>> 0;
	}

	genrandInt31() {
		return this.genrandInt32() >>> 1;
	}

	genrandReal1() {
		// divided by 2^32-1
		return this.genrandInt32() * (1.0 / 4294967295.0);
	}

	random() {
		if (this.pythonCompatibility) {
			if (this.skip) {
				this.genrandInt32();
			}
			this.skip = true;
		}
		// divided by 2^32
		return this.genrandInt32() * (1.0 / 4294967296.0);
	}

	genrandReal3() {
		// divided by 2^32
		return (this.genrandInt32() + 0.5) * (1.0 / 4294967296.0);
	}

	genrandRes53() {
		const a = this.genrandInt32() >>> 5;
		const b = this.genrandInt32() >>> 6;

		return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
	}

	exponential(lambda: number) {
		const r = this.random();

		return -Math.log(r) / lambda;
	}

	gamma(alpha: number, beta: number) {
		let u = NaN;

		if (alpha > 1.0) {
			const ainv = Math.sqrt(2.0 * alpha - 1.0);

			const bbb = alpha - this.LOG4;

			const ccc = alpha + ainv;

			while (true) {
				// eslint-disable-line no-constant-condition
				const u1 = this.random();

				if (u1 < 1e-7 || u > 0.9999999) {
					continue;
				}
				const u2 = 1.0 - this.random();

				const v = Math.log(u1 / (1.0 - u1)) / ainv;

				const x = alpha * Math.exp(v);

				const z = u1 * u1 * u2;

				const r = bbb + ccc * v - x;

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
			let x = NaN;

			while (true) {
				// eslint-disable-line no-constant-condition
				u = this.random();

				const b = (Math.E + alpha) / Math.E;

				const p = b * u;

				if (p <= 1.0) {
					x = p ** (1.0 / alpha);
				} else {
					x = -Math.log((b - p) / alpha);
				}
				const u1 = this.random();

				if (p > 1.0) {
					if (u1 <= x ** (alpha - 1.0)) {
						break;
					}
				} else if (u1 <= Math.exp(-x)) {
					break;
				}
			}
			return x * beta;
		}
	}

	normal(mu: number, sigma: number) {
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

	pareto(alpha: number) {
		const u = this.random();

		return 1.0 / (1 - u) ** (1.0 / alpha);
	}

	triangular(lower: number, upper: number, mode: number) {
		const c = (mode - lower) / (upper - lower);

		const u = this.random();

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
	uniform(lower: number, upper: number) {
		return lower + this.random() * (upper - lower);
	}

	weibull(alpha: number, beta: number) {
		const u = 1.0 - this.random();

		return alpha * (-Math.log(u)) ** (1.0 / beta);
	}
}
