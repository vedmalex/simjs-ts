import test from 'ava';
import assertFail from '../tests/tester';
import * as Sim from '../src/simi';

import 'babel-core/register';
var entities = 0;
var finalized = 0;

test('testTimerPlain', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(10).done(this.onTimeout);
    },
    onTimeout: function () {
      this.count = 1;
      t.is(this.time(), 10);
    },
    finalize: function () {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerCustomDone', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(10).done(this.onTimeout);
    },
    onTimeout: function () {
      this.count = 1;
      t.is(this.time(), 10);
    },
    finalize: function () {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerCustomDoneInline', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(10).done(function (){ 
        t.is(this.time(), 10);
        this.count = 1; 
      });
    },
    finalize: function () {
      t.is(this.count, 1);
      t.is(this.time(), 10);
      finalized ++;
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerRecursive', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    count: 0,
    start: function () {
      t.is(this.time(), 10 * this.count);
      this.count ++;
      this.setTimer(10).done(this.start);
    },
    finalize: function () {
      t.is(this.count, 11);
      t.is(this.time(), 100);
      finalized ++;
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerNoEvent', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {},
    finalize: function () { 
      finalized ++; 
      t.is(this.time(), 0);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerZero', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(0).done(function () {
        t.is(this.time(), 0);
      });
    },
    finalize: function () {
      finalized++;
      t.is(this.time(), 0);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});


test('testTimerTimeout1', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(10)
      .done(function () {
        assertFail();
      })
      .waitUntil(5, function () {
        t.is(this.time(), 5);
        this.count = 1;
      });
    },
    finalize: function () {
      finalized++;
      t.is(this.time(), 10);
      t.is(this.count, 1);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerTimeout2', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(10)
      .done(function () {
        t.is(this.time(), 10);
        this.count = 1;
      })
      .waitUntil(20, function () {
        assertFail();
      });
    },
    finalize: function () {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 20);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerMultipleTimeouts', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {
      this.setTimer(50)
      .done(function () {
        assertFail();
      })
      .waitUntil(20, function () {
        assertFail();
      })
      .waitUntil(10, function () {
        t.is(this.time(), 10);
        this.count = 1;
      });

    },
    finalize: function () {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 50);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

test('testTimerWaitEvent', (t) => {
  var sim = new Sim.Sim();
  var event = new Sim.Event();

  var Entity = {
    start: function () {
      this.setTimer(50)
      .done(function () {
        assertFail();
      })
      .unlessEvent(event, function() {
        t.is(this.time(), 10);
        this.count = 1;
      });

      this.setTimer(10).done(function() {
        event.fire();
      });

    },
    finalize: function () {
      finalized++;
      t.is(this.count, 1);
      t.is(this.time(), 50);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities = 1;
});

