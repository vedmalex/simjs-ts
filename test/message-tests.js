import test from 'ava';
import assertFail from '../tests/tester'
import * as Sim from '../src/simi';

var entities = 0;
var finalized = 0;


test('testMessageSendOne', (t) => {
	var sim = new Sim.Sim();
	var count = 0;

	var Entity = {
		start: function () {

		},
		init: function () {
			if (this.master) {
				this.send("message", 10, this.other);
			}
		},
		onMessage: function (source, message) {
			t.is(source, this.other);
			t.is(message, "message");
			t.is(this.time(), 10);
			t.is(this.master, undefined);
			count ++;
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity, true, null);
	var o2 = sim.addEntity(Entity, false, o1);
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

	var Entity = {
		start: function () {},
		init: function () {
			if (this.master) {
				this.send("message", 10);
			}
		},
		onMessage: function (source, message) {
			t.is(source, this.other);
			t.is(message, "message");
			t.is(this.time(), 10);
			t.is(this.master, undefined);
			count ++;
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity);
	var o2 = sim.addEntity(Entity);
	var o3 = sim.addEntity(Entity);
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

	var Entity = {
		start: function () {},
		init: function () {
			if (this.master) {
				this.send("message", 10, this.array);
			}
		},
		onMessage: function (source, message) {
			t.is(source, this.other);
			t.is(message, "message");
			t.is(this.time(), 10);
			t.is(this.master, undefined);
			count ++;
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity);
	var o2 = sim.addEntity(Entity);
	var o3 = sim.addEntity(Entity);
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

	var Entity = {
		start: function (){},
		init: function () {
			if (this.master) {
				this.send("message", 10, this.other);
			}
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity);
	var o2 = sim.addEntity(Entity);
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

	var Entity = {
		start: function () {},
		init: function () {
			if (this.master) {
				this.setTimer(10).done(this.send, this, ["message", 10, this.other]);
			}
		},
		onMessage: function (source, message) {
			t.is(source, this.other);
			t.is(message, "message");
			t.is(this.time(), 20);
			t.is(this.master, undefined);
			count ++;
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity);
	var o2 = sim.addEntity(Entity);
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

	var Entity = {
		start: function () {},
		init: function () {
			if (this.master) {
				this.setTimer(10).done(this.send, this, ["message", 0, this.other]);
			}
		},
		onMessage: function (source, message) {
			t.is(source, this.other);
			t.is(message, "message");
			t.is(this.time(), 10);
			t.is(this.master, undefined);
			count ++;
		},

		finalize: function () {
			finalized ++;
		}
	};

	var o1 = sim.addEntity(Entity);
	var o2 = sim.addEntity(Entity);
	o1.master = true;
	o1.other = o2;
	o2.other = o1;
	o1.init(); o2.init();
	sim.simulate(100);
	entities = 2;
	t.is(count, 1);
});