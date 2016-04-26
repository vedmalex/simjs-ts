import test from 'ava';
import * as Sim from '../index';

var entities = 0;
var finalized = 0;

test('testEventFlash', (t) => {
	var sim = new Sim.Sim();
	var event = new Sim.Event('event');

	var Entity = {
		count: 0,
		start: function () {
			t.is(event.isFired, false);

			this.waitEvent(event).done(function () {
				t.is(event.isFired, false);
				t.is(this.callbackSource, event);
				t.is(this.time(), 10);
				this.count ++;
			});

			this.setTimer(10).done(function () {
				t.is(event.isFired, false);
				event.fire();
			});

			this.setTimer(20).done(function () {
				t.is(event.isFired, false);
				this.waitEvent(event).done(function (s) {
					t.is(this.callbackSource, event);
					t.is(this.time(), 21);
					this.count ++;
				});
			});
			this.setTimer(21).done(function () {
				t.is(event.isFired, false);
				event.fire();
				t.is(event.isFired, false);
				});
		},
		finalize: function () {
			finalized++;
			t.is(this.time(), 21);
			t.is(this.count, 2);
		}
	};

	sim.addEntity(Entity);
	sim.simulate(100);
	entities = 1;
});

test('testEventSustain', (t) => {
	var sim = new Sim.Sim();
	var event = new Sim.Event('event');

	var Entity = {
		count: 0,
		start: function () {
			t.is(event.isFired, false);

			this.waitEvent(event).done(function (s) {
				t.is(event.isFired, true);
				t.is(this.callbackSource, event);
				t.is(this.time(), 10);
				this.count ++;
			});
			this.setTimer(10).done(function () {
				t.is(event.isFired, false);
				event.fire(true);
				t.is(event.isFired, true);
				});

			this.setTimer(20).done(function () {
				t.is(event.isFired, true);
				this.waitEvent(event).done(function (s) {
					t.is(this.callbackSource, event);
					t.is(this.time(), 20);
					this.count ++;
				});
			});

			this.setTimer(30).done(function () {
				t.is(event.isFired, true);
				event.clear();
				t.is(event.isFired, false);
				});
			this.setTimer(40).done(function () {
				t.is(event.isFired, false);
				this.waitEvent(event).done(function (s) {
					t.is(this.callbackSource, event);
					t.is(this.time(), 41);
					this.count ++;
				});
			});

			this.setTimer(41).done(function () { event.fire(true); });

		},
		finalize: function () {
			finalized++;
			t.is(this.time(), 41);
			t.is(this.count, 3);
		}
	};

	sim.addEntity(Entity);
	sim.simulate(100);
	entities = 1;
});

test('testEventWaitQueue', (t) => {
	var barrier = new Sim.Event('Barrier');
	var funnel = new Sim.Event('Funnel');
	var wcount = 0;
	var qcount = 0;
	var Entity = {
	    start: function (master) {
	        this.waitEvent(barrier).done(function () {
	            wcount++;
	        });

	        this.queueEvent(funnel).done(function () {
	            qcount++;
	        });

	        if (master) {
	            this.setTimer(10)
	            .done(barrier.fire, barrier)
	            .done(funnel.fire, funnel);
	        }
	    },
	    finalize: function () {
	    	finalized ++;
	    }
	};

	var sim = new Sim.Sim();
	var e = [];
	for (var i = 0; i < 100; i++) {
	    e.push(sim.addEntity(Entity, i == 0));
	}
	sim.simulate(100);
	entities = 100;
	t.is(wcount, 100);
	t.is(qcount, 1);
});
