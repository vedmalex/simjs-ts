export class DataSeries {
	protected Count!: number;
	protected W!: number;
	protected A!: number;
	protected Q!: number;
	protected Max!: number;
	protected Min!: number;
	protected Sum!: number;
	protected hLower!: number;
	protected hUpper!: number;
	protected hBucketSize!: number;

	histogram!: Array<number>;
	constructor(public name?: string) {
		this.reset();
	}

	reset() {
		this.Count = 0;
		this.W = 0.0;
		this.A = 0.0;
		this.Q = 0.0;
		this.Max = -Infinity;
		this.Min = Infinity;
		this.Sum = 0;

		if (this.histogram) {
			for (let i = 0; i < this.histogram.length; i++) {
				this.histogram[i] = 0;
			}
		}
	}

	setHistogram(lower: number, upper: number, nbuckets: number) {
		this.hLower = lower;
		this.hUpper = upper;
		this.hBucketSize = (upper - lower) / nbuckets;
		this.histogram = new Array(nbuckets + 2);
		for (let i = 0; i < this.histogram.length; i++) {
			this.histogram[i] = 0;
		}
	}

	getHistogram() {
		return this.histogram;
	}

	record(value: number, weight = 1) {
		if (value > this.Max) this.Max = value;
		if (value < this.Min) this.Min = value;
		this.Sum += value;
		this.Count++;
		if (this.histogram) {
			if (value < this.hLower) {
				this.histogram[0] += weight;
			} else if (value > this.hUpper) {
				this.histogram[this.histogram.length - 1] += weight;
			} else {
				const index = Math.floor((value - this.hLower) / this.hBucketSize) + 1;

				this.histogram[index] += weight;
			}
		}

		// Wi = Wi-1 + wi
		this.W = this.W + weight;

		if (this.W === 0) {
			return;
		}

		// Ai = Ai-1 + wi/Wi * (xi - Ai-1)
		const lastA = this.A;

		this.A = lastA + (weight / this.W) * (value - lastA);

		// Qi = Qi-1 + wi(xi - Ai-1)(xi - Ai)
		this.Q = this.Q + weight * (value - lastA) * (value - this.A);
		// print("\tW=" + this.W + " A=" + this.A + " Q=" + this.Q + "\n");
	}

	count() {
		return this.Count;
	}

	min() {
		return this.Min;
	}

	max() {
		return this.Max;
	}

	range() {
		return this.Max - this.Min;
	}

	sum() {
		return this.Sum;
	}

	sumWeighted() {
		return this.A * this.W;
	}

	average() {
		return this.A;
	}

	variance() {
		return this.Q / this.W;
	}

	deviation() {
		return Math.sqrt(this.variance());
	}
}
