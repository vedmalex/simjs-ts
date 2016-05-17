class ServerModel {
  constructor(sim, random) {
    this.nservers = 1;
    this.mu = 1;
    this.infinite = true;
    this.maxqlen = 0;
    this.sim = sim;
    this.random = random;
  }

  start() {
    this.entity = this.sim.addEntity(ServerEntity, this.random, this.nservers, this.mu);
  }

  connect(dest) {
    this.entity.dest = dest.entity;
  }

  printStats(printf) {
    const service = this.entity.facility;
    const qd = service.queueStats().durationSeries;
    const qs = service.queueStats().sizeSeries;
    const sd = service.systemStats().durationSeries;
    const ss = service.systemStats().sizeSeries;
    const usage = service.usage() / this.sim.time() * 100;
    printf(`Queue ${this.name}`);
    printf(`\tArrival = ${qd.count()}`);
    printf(`\tServer Usage = ${usage.toFixed(2)}%`);
    printf(`\tTime spent in queue = ${qd.average().toFixed(3)}`);
    printf(`\tTime spent in system = ${sd.average().toFixed(3)}`);
    printf(`\tSize of queue = ${qs.average().toFixed(3)}`);
    printf(`\tCustomers in system = ${ss.average().toFixed(3)}`);
  }
}

class SourceModel {
  constructor(sim, random) {
    this.lambda = 0.25;
    this.sim = sim;
    this.random = random;
  }

  start() {
    this.entity = this.sim.addEntity(SourceEntity, this.random, this.lambda);
  }

  connect(dest) {
    this.entity.dest = dest.entity;
  }
}

class SplitterModel {
  constructor(sim, random) {
    this.prob = 0.5;
    this.sim = sim;
    this.random = random;
  }

  start() {
    this.entity = this.sim.addEntity(SplitterEntity, this.random, this.prob);
  }

  connect(dest, channel) {
    this.entity.dest[channel] = dest.entity;
  }
}

class SinkModel {
  constructor(sim, random) {
    this.entity = null;
    this.sim = sim;
  }

  start() {
    this.entity = this.sim.addEntity(SinkEntity);

  }

  printStats(printf) {
    const p = this.entity.population;
    printf(`Sink ${this.name}`);
    printf(`\tDepartures = ${p.durationSeries.count()}`);
    printf(`\tPopulation = ${p.sizeSeries.average()}`);
    printf(`\tStay Duration = ${p.durationSeries.average()}`);
  }
}

/***************************************************/

class ServerEntity extends Sim.Entity {
  start(random, nservers, mu) {
    this.random = random;
    this.mu = mu;
    this.facility = new Sim.Facility('queue');
  }

  arrive(stamp) {
    const duration = this.random.exponential(this.mu);
    const ro = this.useFacility(this.facility, duration);
    if (this.dest) {
      ro.done(this.dest.arrive, this.dest, stamp);
    }
  }
}

/*-------------------------*/
class SourceEntity extends Sim.Entity {
  start(random, lambda) {
    this.random = random;
    this.lambda = lambda;
    this.setTimer(0).done(this.traffic);
  }

  traffic() {
    if (!this.dest) return;
    this.dest.arrive(this.time());

    this.generated ++;

    const duration = this.random.exponential(this.lambda);

    this.setTimer(duration).done(this.traffic);
  }
}

/*-------------------------*/

class SinkEntity extends Sim.Entity {
  start() {
    this.population = new Sim.Population();
  }

  arrive(stamp) {
    if (!stamp) stamp = 0;
    this.population.enter(stamp);
    this.population.leave(stamp, this.time());
  }
}

/*-------------------------*/
class SplitterEntity extends Sim.Entity{
  start(random, prob) {
    this.random = random;
    this.prob = prob;
  }

  arrive(stamp) {
    const r = this.random.uniform(0.0, 1.0);
    if (r < this.prob) {
      if (this.dest[0]) this.dest[0].arrive(stamp);
    } else {
      if (this.dest[1]) this.dest[1].arrive(stamp);
    }
  }
}

/***************************************/
function QueueSimulator(jsontext) {
  const json = JSON.parse(jsontext);

  let until = 5000, seed = 1234;
  if (json.until) until = json.until;
  if (json.seed) seed = json.seed;

  const sim = new Sim();
  const random = new Random(seed);

  const len = json.objects.length;
  const dict = {};
  const ModelFactory = {queue: ServerModel, source: SourceModel,
            splitter: SplitterModel, sink: SinkModel};

  for (var i = len - 1; i >= 0; i--) {
    var conf = json.objects[i];
    var model;
    if (conf.type === 'queue') model = new ServerModel(sim, random);
    else if (conf.type === 'source') model = new SourceModel(sim, random);
    else if (conf.type === 'sink') model = new SinkModel(sim, random);
    else if (conf.type === 'splitter') model = new SplitterModel(sim, random);
    else throw `Cannot create model for ${conf.name}`;

    model.name = conf.name;
//    for (prop in conf.model) model[prop] = conf.model[prop];
    dict[conf.name] = model;
    model.start();
  }

  for (var i = len - 1; i >= 0; i--) {
    var conf = json.objects[i];
    if (!conf.out) continue;

    const from = dict[conf.name];
    if (!from) continue;

    if (conf.out instanceof Array) {
      for (let j = conf.out.length - 1; j >= 0; j--) {
        var to = dict[conf.out[j]];
        if (to) from.connect(to, j);
      }
    } else {
      var to = dict[conf.out];
      if (to) from.connect(to);
    }
  }

  sim.simulate(until);

  for (modelname in dict) {
    var model = dict[modelname];
    if (model.printStats) model.printStats(print);
  }
}
