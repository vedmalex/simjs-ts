import test from 'ava';
import assertFail from '../tests/tester'
import * as Sim from '../src/simi';

import 'babel-core/register';
var entities = 0;
var finalized = 0;

test('testStorePut', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 3);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:1}).done(function () {
        assertFail();
      });


    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 3);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGet', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 3);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:10}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 0);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 0);
        this.count++;
        t.is(this.callbackMessage.a, 10);
      });

      this.getStore(store).done(assertFail);

    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 4);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetFilter', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 3);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:10}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.getStore(store, function(obj) {return obj.a == 10;}).done(function () {
        t.is(this.time(), 0);
        this.count++;
        t.is(this.callbackMessage.a, 10);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 0);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });

      this.getStore(store).done(assertFail);

    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 4);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStorePutProgress', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 2);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:2}).done(function () {
        t.is(this.time(), 0);
        this.count++;
      });

      this.putStore(store, {a:3}).done(function () {
        t.is(this.time(), 10);
        this.count++;
      });

      this.putStore(store, {a:4}).done(function () {
        t.is(this.time(), 20);
        this.count++;
      });

      this.putStore(store, {a:5}).done(function () {
        assertFail();
      });

      this.setTimer(10).done(function () {
        this.getStore(store).done(function () {
          t.is(this.time(), 10);
          this.count++;
          t.is(this.callbackMessage.a, 1);
        });
      });


      this.setTimer(20).done(function () {
        this.getStore(store).done(function () {
          t.is(this.time(), 20);
          this.count++;
          t.is(this.callbackMessage.a, 2);
        });
      });

    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 6);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetProgress', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 2);

  var Entity = {
    count: 0,
    start: function () {
      this.getStore(store).done(function () {
        t.is(this.time(), 10);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 20);
        this.count++;
        t.is(this.callbackMessage.a, 2);
      });

      this.setTimer(10).done(function () {
        this.putStore(store, {a:1}).done(function () {
          t.is(this.time(), 10);
          this.count++;
        });
      });

      this.setTimer(20).done(function () {
        this.putStore(store, {a:2}).done(function () {
          t.is(this.time(), 20);
          this.count++;
        });
      });


    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 4);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetCancel', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 2);

  var Entity = {
    count: 0,
    start: function () {
      this.getStore(store).done(assertFail)
      .waitUntil(10, function () {
        t.is(this.time(), 10);
        this.count++;
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 20);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });



      this.setTimer(20).done(function () {
        this.putStore(store, {a:1}).done(function () {
          t.is(this.time(), 20);
          this.count++;
        });
      });


    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 3);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetEventRenege', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 100);
  var event = new Sim.Event('a');

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1});

      // wait, since filter function is false
      this.getStore(store, function () {return false;})
      .done(assertFail)
      .unlessEvent(event);

      this.setTimer(10).done(event.fire, event);


      // wait since there is request is front
      this.getStore(store).done(function () {
        t.is(this.time(), 10);
        this.count++;
      });

    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 1);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetTimeout', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 100);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, {a:1});

      // wait, since filter function is false
      var ro = this.getStore(store, function () {return false;})
      .done(assertFail).
      waitUntil(10);


      // wait since there is request is front
      this.getStore(store).done(function () {
        t.is(this.time(), 10);
        this.count++;
      });

    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 1);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetCancel', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 100, 40);

  var Entity = {
    count: 0,
    start: function () {
      this.putStore(store, 1);

      // wait, since filter function is false
      var ro = this.getStore(store, function (){ return false;})
      .done(function () {
        assertFail;
      });


      // get wait since there is request is front
      this.getStore(store).done(function () {
        t.is(this.time(), 10);
        this.count++;
      });

      this.setTimer(10).done(ro.cancel, ro);
    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 1);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetStillWaits', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 100, 100);

  var Entity = {
    count: 0,
    start: function () {
      // get waits
      this.getStore(store).done(function () {
        t.is(this.time(), 10);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 20);
        this.count++;
        t.is(this.callbackMessage.a, 2);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 30);
        this.count++;
        t.is(this.callbackMessage.a, 3);
      });

      this.getStore(store).done(function () {
        assertFail();
      });

      this.setTimer(10).done(this.putStore, this, [store, {a:1}]);
      this.setTimer(20).done(this.putStore, this, [store, {a:2}]);
      this.setTimer(30).done(this.putStore, this, [store, {a:3}]);
    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 3);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

test('testStoreGetFilterWaits', (t) => {
  var sim = new Sim.Sim();
  var store = new Sim.Store('a', 100, 100);

  var Entity = {
    count: 0,
    start: function () {
      // get waits
      this.getStore(store, function (o) {
        return o.a == 3;
      }).done(function () {
        t.is(this.time(), 30);
        this.count++;
        t.is(this.callbackMessage.a, 3);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 30);
        this.count++;
        t.is(this.callbackMessage.a, 1);
      });

      this.getStore(store).done(function () {
        t.is(this.time(), 30);
        this.count++;
        t.is(this.callbackMessage.a, 2);
      });


      this.setTimer(10).done(this.putStore, this, [store, {a:1}]);
      this.setTimer(20).done(this.putStore, this, [store, {a:2}]);
      this.setTimer(30).done(this.putStore, this, [store, {a:3}]);
    },
    finalize: function () {
      finalized ++;
      t.is(this.count, 3);
    }
  };

  sim.addEntity(Entity);
  sim.simulate(100);
  entities ++;
});

