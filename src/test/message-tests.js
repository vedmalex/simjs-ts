import test from 'ava';
import * as Sim from '../sim';

var entities = 0;
var finalized = 0;


test('testMessageSendOne', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {

    }
    init() {
      if (this.master) {
        this.send('message', 10, this.other);
      }
    }
    onMessage(source, message) {
      t.is(source, this.other);
      t.is(message, 'message');
      t.is(this.time(), 10);
      t.is(this.master, undefined);
      count++;
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity, true, null);
  var o2 = sim.addEntity(MyEntity, false, o1);
  o1.master = true;
  o1.other = o2;
  o2.other = o1;
  o1.init();
  o2.init();
  sim.simulate(100);
  entities = 2;
  t.is(count, 1);
});

test('testMessageSendAll', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {}
    init() {
      if (this.master) {
        this.send('message', 10);
      }
    }
    onMessage(source, message) {
      t.is(source, this.other);
      t.is(message, 'message');
      t.is(this.time(), 10);
      t.is(this.master, undefined);
      count++;
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity);
  var o2 = sim.addEntity(MyEntity);
  var o3 = sim.addEntity(MyEntity);
  o1.master = true;
  o2.other = o1;
  o3.other = o1;
  o1.init(); o2.init();

  sim.simulate(100);
  entities = 3;
  t.is(count, 2);
});

test('testMessageSendArray', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {}
    init() {
      if (this.master) {
        this.send('message', 10, this.array);
      }
    }
    onMessage(source, message) {
      t.is(source, this.other);
      t.is(message, 'message');
      t.is(this.time(), 10);
      t.is(this.master, undefined);
      count++;
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity);
  var o2 = sim.addEntity(MyEntity);
  var o3 = sim.addEntity(MyEntity);
  o1.master = true;
  o1.array = [o2, o3, o1];
  o2.other = o1;
  o3.other = o1;
  o1.init(); o2.init(); o3.init();

  sim.simulate(100);
  entities = 3;
  t.is(count, 2);
});

test('testMessageNoCallback', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {}
    init() {
      if (this.master) {
        this.send('message', 10, this.other);
      }
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity);
  var o2 = sim.addEntity(MyEntity);
  o1.master = true;
  o1.other = o2;
  o2.other = o1;
  o1.init(); o2.init();
  sim.simulate(100);
  entities = 2;
  t.is(sim.time(), 10);
});

test('testMessageDelayedSendOne', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {}
    init() {
      if (this.master) {
        this.setTimer(10).done(this.send, this, ['message', 10, this.other]);
      }
    }
    onMessage(source, message) {
      t.is(source, this.other);
      t.is(message, 'message');
      t.is(this.time(), 20);
      t.is(this.master, undefined);
      count++;
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity);
  var o2 = sim.addEntity(MyEntity);
  o1.master = true;
  o1.other = o2;
  o2.other = o1;
  o1.init(); o2.init();
  sim.simulate(100);
  entities = 2;
  t.is(count, 1);
});

test('testMessageZeroDelay', (t) => {
  var sim = new Sim.Sim();
  var count = 0;

  class MyEntity extends Sim.Entity {
    start() {}
    init() {
      if (this.master) {
        this.setTimer(10).done(this.send, this, ['message', 0, this.other]);
      }
    }
    onMessage(source, message) {
      t.is(source, this.other);
      t.is(message, 'message');
      t.is(this.time(), 10);
      t.is(this.master, undefined);
      count++;
    }

    finalize() {
      finalized++;
    }
  }

  var o1 = sim.addEntity(MyEntity);
  var o2 = sim.addEntity(MyEntity);
  o1.master = true;
  o1.other = o2;
  o2.other = o1;
  o1.init(); o2.init();
  sim.simulate(100);
  entities = 2;
  t.is(count, 1);
});
