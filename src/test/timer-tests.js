import test from 'ava';
;
import * as Sim from '../sim';

import 'babel-core/register';
var entities = 0;
var finalized = 0;

test('testTimerPlain', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(10).done(this.onTimeout);
    }
    onTimeout() {
      this.count = 1;
      t.is(this.time(), 10);
    }
    finalize() {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerCustomDone', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(10).done(this.onTimeout);
    }
    onTimeout() {
      this.count = 1;
      t.is(this.time(), 10);
    }
    finalize() {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerCustomDoneInline', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(10).done(function (){ 
        t.is(this.time(), 10);
        this.count = 1; 
      });
    }
    finalize() {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerRecursive', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    constructor(...args) {
      super(...args);
      this.count = 0;
    }

    start() {
      t.is(this.time(), 10 * this.count);
      this.count ++;
      this.setTimer(10).done(this.start);
    }
    finalize() {
      t.is(this.count, 11);
      t.is(this.time(), 100);
      finalized ++;
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerNoEvent', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {}
    finalize() { 
      finalized ++; 
      t.is(this.time(), 0);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerZero', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(0).done(function () {
        t.is(this.time(), 0);
      });
    }
    finalize() {
      finalized++;
      t.is(this.time(), 0);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});


test('testTimerTimeout1', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(10)
      .done(function () {
        t.fail();
      })
      .waitUntil(5, function () {
        t.is(this.time(), 5);
        this.count = 1;
      });
    }
    finalize() {
      finalized++;
      t.is(this.time(), 10);
      t.is(this.count, 1);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerTimeout2', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(10)
      .done(function () {
        t.is(this.time(), 10);
        this.count = 1;
      })
      .waitUntil(20, function () {
        t.fail();
      });
    }
    finalize() {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 20);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerMultipleTimeouts', (t) => {
  var sim = new Sim.Sim();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(50)
      .done(function () {
        t.fail();
      })
      .waitUntil(20, function () {
        t.fail();
      })
      .waitUntil(10, function () {
        t.is(this.time(), 10);
        this.count = 1;
      });

    }
    finalize() {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 50);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerWaitEvent', (t) => {
  var sim = new Sim.Sim();
  var event = new Sim.Event();

  class MyEntity extends Sim.Entity {
    start() {
      this.setTimer(50)
      .done(function () {
        t.fail();
      })
      .unlessEvent(event, function() {
        t.is(this.time(), 10);
        this.count = 1;
      });

      this.setTimer(10).done(function() {
        event.fire();
      });

    }
    finalize() {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 50);
    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities = 1;
});

