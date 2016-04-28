import test from 'ava';
import * as Sim from '../index';

test('testFCFSQueueSimple', (t) => {
	var q = new Sim.Queue();
	q.push(10, 10);
	q.shift(20);
	q.finalize(10);
	var report = q.report();
	t.is(report[0], 1);
  t.is(report[1], 10);
});
