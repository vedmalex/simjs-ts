import * as Sim from "../index";

export type AppModel = {
	until: number;
	seed: number;
	objects: Array<{
		type: string;
		name: string;
		out: string | Array<string>;
		model: Record<string, any>;
	}>;
};

const model = {
	until: 25000,
	seed: 1234,
	version: "1.0",
	objects: [
		{ type: "source", name: "source_1", out: "monitor_1", model: { type: "exponential", lambda: 0.25 } },
		{ type: "monitor", name: "monitor_1", out: "queue_1" },
		{ type: "queue", name: "queue_1", out: "sink_1", model: { nservers: 1, mu: 1, infinite: true, maxqlen: 0 } },
		{ type: "sink", name: "sink_1" },
	],
};

const model2 = {
	until: 28800,
	seed: 1234,
	version: "1.0",
	objects: [
		{ x: 78, y: 287, type: "source", name: "source_5", out: "splitter_1", model: { lambda: 0.25 } },
		{ x: 81, y: 224, type: "source", name: "source_4", out: "splitter_1", model: { lambda: 0.25 } },
		{ x: 81, y: 160, type: "source", name: "source_3", out: "splitter_1", model: { lambda: 0.25 } },
		{ x: 81, y: 96, type: "source", name: "source_2", out: "splitter_1", model: { lambda: 0.25 } },
		{ x: 83, y: 30, type: "source", name: "source_1", out: "splitter_1", model: { lambda: 0.25 } },
		{
			x: 190,
			y: 210,
			type: "splitter",
			name: "splitter_1",
			out: ["queue_1", "queue_2", "queue_3"],
			model: { prob: [1, 1, 1] },
		},
		{ x: 500, y: 268, type: "sink", name: "sink_3", model: null },
		{ x: 494, y: 164, type: "sink", name: "sink_2", model: null },
		{ x: 494, y: 55, type: "sink", name: "sink_1", model: null },
		{ x: 286, y: 263, type: "queue", name: "queue_3", out: "sink_3", model: { nservers: 1, mu: "50" } },
		{ x: 282, y: 158, type: "queue", name: "queue_2", out: "sink_2", model: { nservers: 1, mu: "250" } },
		{ x: 282, y: 50, type: "queue", name: "queue_1", out: "sink_1", model: { nservers: 1, mu: "100" } },
	],
};

/***************************************************/

export interface Startable {
	start(...args: Array<any>): void;
}

export interface Arrivable {
	arrive(from?: Arrivable): void;
	entity: Arrivable;
	dest: Arrivable;
	facility: Sim.FacilityT;
}

export interface Connectable {
	connect(dest: Connectable): void;
}

class ServerEntity extends Sim.Entity {
	random!: Sim.Random;
	facility!: Sim.FacilityT;
	mu!: number;
	dest!: Arrivable;
	start(config: { random: Sim.Random } & ServerModelConfig) {
		this.random = config.random;
		this.mu = config.mu;
		this.facility = Sim.CreateFacility("queue", config.discipline, config.nservers, config.maxqlen);
	}

	arrive() {
		var duration = this.random.exponential(this.mu);
		var ro = this.useFacility(this.facility, duration);
		if (this.dest) {
			ro.done(this.dest.arrive, this.dest, this);
		}
	}
}

type ServerModelConfig = {
	nservers: number;
	mu: number;
	infinite: boolean;
	maxqlen: number;
	discipline: Sim.Discipline;
};

class ServerModel {
	sim: Sim.Sim;
	random: Sim.Random;
	entity!: ServerEntity;
	name: string;
	config: ServerModelConfig;

	constructor(sim: Sim.Sim, random: Sim.Random, name: string, model: Partial<ServerModelConfig>) {
		this.config = {
			nservers: 1,
			maxqlen: 0,
			mu: 1,
			infinite: true,
			discipline: model.discipline ?? Sim.Discipline.FCFS,
		};
		this.name = name;
		this.sim = sim;
		this.random = random;
	}

	start() {
		this.entity = this.sim.addEntity(ServerEntity, this.name, { ...this.config, random: this.random });
	}
	connect(dest: Arrivable) {
		this.entity.dest = dest.entity;
	}
	printStats(printf: (s: string) => void) {
		var service = this.entity.facility;
		var qd = service.queueStats().durationSeries;
		var qs = service.queueStats().sizeSeries;
		var sd = service.systemStats().durationSeries;
		var ss = service.systemStats().sizeSeries;
		var usage = (service.usage() / this.sim.time()) * 100;
		printf("Queue " + this.name);
		printf("\tArrival = " + qd.count());
		printf("\tServer Usage = " + usage.toFixed(2) + "%");
		printf("\tTime spent in queue = " + qd.average().toFixed(3));
		printf("\tTime spent in system = " + sd.average().toFixed(3));
		printf("\tSize of queue = " + qs.average().toFixed(3));
		printf("\tCustomers in system = " + ss.average().toFixed(3));
	}
}

/*-------------------------*/

class SourceEntity extends Sim.Entity {
	random!: Sim.Random;
	dest!: Arrivable;
	config!: Sim.RandomConfig;
	start(random: Sim.Random, config: Sim.RandomConfig) {
		this.random = random;
		this.config = config;
		this.setTimer(0).done(this.traffic);
	}

	traffic() {
		if (!this.dest) return;
		var duration = this.random.generate(this.config);
		this.setTimer(duration).done(this.dest.arrive, this.dest, this).done(this.traffic);
	}
}

class SourceModel {
	sim: Sim.Sim;
	random: Sim.Random;
	config!: Sim.RandomConfig;
	entity!: SourceEntity;
	name: string;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string, model?: Sim.RandomConfig) {
		this.name = name;
		this.config = model ?? { type: "exponential", lambda: 0.25 };
		this.sim = sim;
		this.random = random;
	}
	start() {
		this.entity = this.sim.addEntity(SourceEntity, this.name, this.random, this.config);
	}
	connect(dest: Arrivable) {
		this.entity.dest = dest.entity;
	}
}

function cumulativeSum(arr: Array<number>) {
	return arr.map((val, index) => arr.slice(0, index + 1).reduce((a, b) => a + b));
}
// нормализовать массив значений, чтобы он был похож на правильную вилку
function normalizeArray(arr: Array<number>) {
	const sum = arr.reduce((res, cur) => res + cur, 0);
	const normalized = arr.map((x) => x / sum);
	const result = cumulativeSum(normalized);
	result.pop(); // последнее всегда 1
	return result;
}

//
function findNextSmallestIndex(arr: Array<number>, target: number) {
	let left = 0;
	let right = arr.length - 1;
	let index = arr.length;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		if (arr[mid] > target) {
			index = mid;
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}
	return index;
}

/*-------------------------*/
class SplitterEntity extends Sim.Entity {
	random!: Sim.Random;
	config!: SplitterConfig;
	dest!: Array<Arrivable>;

	start(random: Sim.Random, config: SplitterConfig) {
		this.dest = [];
		this.dest.length = config.channels;
		this.random = random;
		this.config = config;
	}

	arrive() {
		const r = this.random.generate(this.config.random);
		const index = findNextSmallestIndex(this.config.prob, r);
		this.dest[index].arrive();
	}
}

export type RouterModel = {
	name: string;
};

export type SplitterConfig = {
	random: Sim.RandomConfig;
	// хранит вероятность попадения между двумя dest на 1 меньше чем общее число
	prob: number[];
	channels: number;
};

class SplitterModel {
	config!: SplitterConfig;
	sim: Sim.Sim;
	random: Sim.Random;
	channels: number;
	name: string;
	entity!: SplitterEntity;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string, model?: Partial<Omit<SplitterConfig, "channels">>) {
		this.name = name;
		this.config = model
			? {
					...model,
					prob: model.prob ? model.prob : [0.5, 0.5],
					random: model.random
						? model.random
						: {
								type: "uniform",
								lower: 0.0,
								upper: 1.0,
						  },
					channels: model.prob?.length ?? 2,
			  }
			: {
					prob: [0.5, 0.5],
					random: {
						type: "uniform",
						lower: 0.0,
						upper: 1.0,
					},
					channels: 2,
			  };

		this.channels = this.config.prob.length;
		this.config.prob = normalizeArray(this.config.prob);
		this.sim = sim;
		this.random = random;
	}
	start() {
		this.entity = this.sim.addEntity(SplitterEntity, this.name, this.random, this.config);
	}
	connect(dest: Arrivable, channel: number) {
		if (channel >= 0 && channel < this.channels) {
			this.entity.dest[channel] = dest.entity;
		} else {
			throw new Error(`Splitter ${this.name} contain only ${this.channels}-channels instead of ${channel}`);
		}
	}
}

/*-------------------------*/

class MonitorEntity extends Sim.Entity {
	monitor!: Sim.TimeSeries;
	dest!: Arrivable;
	start() {
		this.monitor = new Sim.TimeSeries();
	}

	arrive() {
		this.monitor.record(1, this.time());
		if (this.dest) this.dest.arrive();
	}
}

class MonitorModel {
	entity!: MonitorEntity;
	name: string;
	sim: Sim.Sim;
	random: Sim.Random;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string) {
		this.random = random;
		this.name = name;
		this.sim = sim;
	}
	start() {
		this.entity = this.sim.addEntity(MonitorEntity, this.name);
	}
	connect(dest: Arrivable) {
		this.entity.dest = dest.entity;
	}
	printStats(printf: (s: string) => void) {
		var m = this.entity.monitor;

		printf("Monitor " + this.name);
		printf("\tArrivals = " + m.count().toFixed(3));
		printf("\tInterarrival = " + m.average().toFixed(3));
	}
}

class SinkEntity extends Sim.Entity {
	population!: Sim.Population;
	start() {
		this.population = new Sim.Population();
	}

	arrive(stamp?: number) {
		if (!stamp) stamp = 0;
		this.population.enter(stamp);
		this.population.leave(stamp, this.time());
	}
}

class SinkModel {
	entity!: SinkEntity;
	name: string;
	sim: Sim.Sim;
	random: Sim.Random;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string) {
		this.name = name;
		this.random = random;
		this.sim = sim;
	}

	start() {
		this.entity = this.sim.addEntity(SinkEntity);
	}

	printStats(printf: (s: string) => void) {
		const p = this.entity.population;
		printf(`Sink ${this.name}`);
		printf(`\tDepartures = ${p.durationSeries.count()}`);
		printf(`\tPopulation = ${p.sizeSeries.average()}`);
		printf(`\tStay Duration = ${p.durationSeries.average()}`);
	}
}
// -----

function QueueApp(init: AppModel) {
	let until = 5000;
	let seed = 1234;
	if (init.until) until = init.until;
	if (init.seed) seed = init.seed;

	var sim = new Sim.Sim();
	var random = new Sim.Random(seed);

	const ModelList = new Map<string, any>();
	// var ModelFactory = { queue: ServerModel, source: SourceModel, splitter: SplitterModel, monitor: MonitorModel };

	for (const conf of init.objects) {
		let model;
		if (conf.type === "queue") model = new ServerModel(sim, random, conf.name, conf.model);
		else if (conf.type === "source") model = new SourceModel(sim, random, conf.name);
		else if (conf.type === "monitor") model = new MonitorModel(sim, random, conf.name);
		else if (conf.type === "sink") model = new SinkModel(sim, random, conf.name);
		else if (conf.type === "splitter") model = new SplitterModel(sim, random, conf.name, conf.model);
		else throw "Cannot create model for " + conf.name;

		// for (prop in conf.model) model[prop] = conf.model[prop];

		ModelList.set(conf.name, model);
		model.start();
	}

	for (const conf of init.objects) {
		if (!conf.out) continue;

		var from = ModelList.get(conf.name);
		if (!from) continue;

		if (conf.out instanceof Array) {
			debugger;
			for (var j = conf.out.length - 1; j >= 0; j--) {
				var to = ModelList.get(conf.out[j]);
				if (to) from.connect(to, j);
			}
		} else {
			var to = ModelList.get(conf.out);
			if (to) from.connect(to);
		}
	}

	sim.simulate(until);

	for (const init of ModelList.values()) {
		if (init.printStats) init.printStats(console.log);
	}
}

QueueApp(model2);
