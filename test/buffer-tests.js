import test from 'ava';
import * as Sim from '../index';

import 'babel-core/register';
var entities = 0;
var finalized = 0;

test('testBufferBlockedPuts', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100);

	var Entity = {
		count: 0,
		start() {
			// at time 0, put 60 units -- succeed
			this.putBuffer(buffer, 60).done(function () {
				t.is(this.time(), 0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.putBuffer(buffer, 60).done(function () {
        t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 15).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 10).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			this.setTimer(10).done(this.getBuffer, this, [buffer, 60]);
		},
		finalize() {
			finalized ++;
			t.is(this.count, 4);
		}
	};

	sim.addEntity(Entity);
	sim.simulate(100);
	entities ++;
});

test('testBufferBlockedGet', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100, 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 60 units -- succeed
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 15).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 10).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			this.setTimer(10).done(this.putBuffer, this, [buffer, 60]);
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

test('BufferPutStillWaits', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 60 units -- succeed
			this.putBuffer(buffer, 60).done(function () {
				t.is(this.time(), 0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.putBuffer(buffer, 60).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 60).done(function () {
				t.is(this.time(), 20);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 60).done(function () {
				t.is(this.time(), 30);
				this.count++;
			});

			this.setTimer(10).done(this.getBuffer, this, [buffer, 60]);
			this.setTimer(20).done(this.getBuffer, this, [buffer, 60]);
			this.setTimer(30).done(this.getBuffer, this, [buffer, 60]);
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

test('BufferGetStillWaits', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100, 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 60 units -- succeed
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 20);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 60).done(function () {
				t.is(this.time(), 30);
				this.count++;
			});

			this.setTimer(10).done(this.putBuffer, this, [buffer, 60]);
			this.setTimer(20).done(this.putBuffer, this, [buffer, 60]);
			this.setTimer(30).done(this.putBuffer, this, [buffer, 60]);
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


test('BufferGetCancel', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100, 40);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, get 60 units -- waits
			var ro = this.getBuffer(buffer, 60).done(function () {
				t.fail;
			});


			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(function () {
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

test('BufferPutCancel', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 110 units -- waits
			var ro = this.putBuffer(buffer, 110).done(function () {
				t.fail;
			});


			// put 30, wait since there is request is front
			this.putBuffer(buffer, 30).done(function () {
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

test('BufferPutTimeout', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 110 units -- waits
			var ro = this.putBuffer(buffer, 110)
			.done(t.fail).
			waitUntil(10);


			// put 30, wait since there is request in front
			this.putBuffer(buffer, 30).done(function () {
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

test('BufferPutEventRenege', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100);
	var event = new Sim.Event('a');

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, put 110 units -- waits
			var ro = this.putBuffer(buffer, 110)
			.done(t.fail)
			.unlessEvent(event);

			this.setTimer(10).done(event.fire, event);


			// put 30, wait since there is request is front
			this.putBuffer(buffer, 30).done(function () {
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

test('BufferGetTimeout', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100, 100);

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, get 110 units -- waits
			var ro = this.getBuffer(buffer, 110)
			.done(t.fail).
			waitUntil(10);


			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(function () {
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

test('BufferGetEventRenege', (t) => {
	var sim = new Sim.Sim();
	var buffer = new Sim.Buffer('a', 100, 100);
	var event = new Sim.Event('a');

	var Entity = {
		count: 0,
		start: function () {
			// at time 0, get 110 units -- waits
			var ro = this.getBuffer(buffer, 110)
			.done(t.fail)
			.unlessEvent(event);

			this.setTimer(10).done(event.fire, event);


			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(function () {
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
