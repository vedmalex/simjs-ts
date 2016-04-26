import test from 'ava';
import assertFail from '../tests/tester'
import * as Sim from '../src/simi';
import 'babel-core/register';

test('testSimExtendedPrototype', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function () {}
  };

  t.is(Entity.time, undefined);
  var obj = sim.addEntity(Entity);
  t.is(Entity.time instanceof Function, true);
  t.is(obj.time instanceof Function, true);

});

test('testStartArguments', (t) => {
  var sim = new Sim.Sim();

  var Entity = {
    start: function (a, b) {
      t.is(a, 10),
      t.is(b.a, 20);
    }
  };

  sim.addEntity(Entity, 10, {a: 20});
  sim.simulate(100);
});

