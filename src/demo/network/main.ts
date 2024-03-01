import * as Sim from "../../index";

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
	objects: [
		{ type: "source", name: "source_1", out: "monitor_1", model: { lambda: 0.25 } },
		{ type: "monitor", name: "monitor_1", out: "queue_1" },
		{ type: "queue", name: "queue_1", out: "sink_1", model: { nservers: 1, mu: 1, infinite: true, maxqlen: 0 } },
		// { type: "sink", name: "sink_1", model: { nservers: 1, mu: 1, infinite: true, maxqlen: 0 } },
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
	start(random: Sim.Random, nservers: number, mu: number) {
		this.random = random;
		this.mu = mu;
		this.facility = Sim.CreateFacility("queue");
	}

	arrive() {
		var duration = this.random.exponential(this.mu);
		var ro = this.useFacility(this.facility, duration);
		if (this.dest) {
			ro.done(this.dest.arrive, this.dest, this);
		}
	}
}

class ServerModel {
	sim: Sim.Sim;
	random: Sim.Random;
	nservers: number;
	mu: number;
	maxqlen: number;
	infinite: boolean;
	entity!: ServerEntity;
	name: string;

	constructor(sim: Sim.Sim, random: Sim.Random, name: string) {
		this.name = name;
		this.nservers = 1;
		this.mu = 1;
		this.infinite = true;
		this.maxqlen = 0;
		this.sim = sim;
		this.random = random;
	}

	start() {
		this.entity = this.sim.addEntity(ServerEntity, this.name, this.random, this.nservers, this.mu);
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
	lambda!: number;
	dest!: Arrivable;
	start(random: Sim.Random, lambda: number) {
		this.random = random;
		this.lambda = lambda;
		this.setTimer(0).done(this.traffic);
	}

	traffic() {
		if (!this.dest) return;

		var duration = this.random.exponential(this.lambda);

		this.setTimer(duration).done(this.dest.arrive, this.dest, this).done(this.traffic);
	}
}

class SourceModel {
	sim: Sim.Sim;
	random: Sim.Random;
	lambda: number;
	entity!: SourceEntity;
	name: string;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string) {
		this.name = name;
		this.lambda = 0.25;
		this.sim = sim;
		this.random = random;
	}
	start() {
		this.entity = this.sim.addEntity(SourceEntity, this.name, this.random, this.lambda);
	}
	connect(dest: Arrivable) {
		this.entity.dest = dest.entity;
	}
}

/*-------------------------*/
class SplitterEntity extends Sim.Entity {
	random!: Sim.Random;
	prob!: number;
	dest!: [Arrivable, Arrivable];

	start(random: Sim.Random, prob: number) {
		this.random = random;
		this.prob = prob;
	}

	arrive() {
		var r = this.random.uniform(0.0, 1.0);
		if (r < this.prob) {
			if (this.dest[0]) this.dest[0].arrive();
		} else {
			if (this.dest[1]) this.dest[1].arrive();
		}
	}
}

class SplitterModel {
	prob: number;
	sim: Sim.Sim;
	random: Sim.Random;
	name: string;
	entity!: SplitterEntity;
	constructor(sim: Sim.Sim, random: Sim.Random, name: string, prob: number) {
		this.name = name;
		this.prob = prob;
		this.sim = sim;
		this.random = random;
	}
	start() {
		this.entity = this.sim.addEntity(SplitterEntity, this.name, this.random, this.prob);
	}
	connect(dest: Arrivable, channel: 0 | 1) {
		this.entity.dest[channel] = dest.entity;
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
		if (conf.type === "queue") model = new ServerModel(sim, random, conf.name);
		else if (conf.type === "source") model = new SourceModel(sim, random, conf.name);
		else if (conf.type === "monitor") model = new MonitorModel(sim, random, conf.name);
		else if (conf.type === "splitter") model = new SplitterModel(sim, random, conf.name, 0.5);
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

QueueApp(model);
