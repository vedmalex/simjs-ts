import { expect, test } from "bun:test";
import * as Sim from "../sim.js";

let entities = 0;
let finalized = 0;

test("testBufferBlockedPuts", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 60 units -- succeed
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 15).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(this.getBuffer, this, [buffer, 60]);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(4);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testBufferBlockedGet", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100, 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 60 units -- succeed
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 15).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(this.putBuffer, this, [buffer, 60]);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(4);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferPutStillWaits", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 60 units -- succeed
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.putBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
			});

			this.setTimer(10).done(this.getBuffer, this, [buffer, 60]);
			this.setTimer(20).done(this.getBuffer, this, [buffer, 60]);
			this.setTimer(30).done(this.getBuffer, this, [buffer, 60]);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(4);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferGetStillWaits", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100, 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 60 units -- succeed
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			// put 60 units -- wait, since not enough space
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			// put 60 units -- wait, since there is a request already waiting
			this.getBuffer(buffer, 60).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
			});

			this.setTimer(10).done(this.putBuffer, this, [buffer, 60]);
			this.setTimer(20).done(this.putBuffer, this, [buffer, 60]);
			this.setTimer(30).done(this.putBuffer, this, [buffer, 60]);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(4);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferGetCancel", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100, 40);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, get 60 units -- waits
			const ro = this.getBuffer(buffer, 60).done(() => {
				throw new Error();
			});

			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(ro.cancel, ro);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferPutCancel", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 110 units -- waits
			const ro = this.putBuffer(buffer, 110).done(() => {
				throw new Error();
			});

			// put 30, wait since there is request is front
			this.putBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(ro.cancel, ro);
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferPutTimeout", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 110 units -- waits
			this.putBuffer(buffer, 110)
				.done(() => {
					throw new Error();
				})
				.waitUntil(10);

			// put 30, wait since there is request in front
			this.putBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferPutEventRenege", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, put 110 units -- waits
			this.putBuffer(buffer, 110)
				.done(() => {
					throw new Error();
				})
				.unlessEvent(event);

			this.setTimer(10).done(event.fire, event);

			// put 30, wait since there is request is front
			this.putBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferGetTimeout", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100, 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, get 110 units -- waits
			this.getBuffer(buffer, 110)
				.done(() => {
					throw new Error();
				})
				.waitUntil(10);

			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("BufferGetEventRenege", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100, 100);

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			// at time 0, get 110 units -- waits
			this.getBuffer(buffer, 110)
				.done(() => {
					throw new Error();
				})
				.unlessEvent(event);

			this.setTimer(10).done(event.fire, event);

			// get 30, wait since there is request is front
			this.getBuffer(buffer, 30).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});
