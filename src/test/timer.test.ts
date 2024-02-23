import { expect, test } from "bun:test";
import * as Sim from "../sim.js";

let finalized = 0;

test("testTimerPlain", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10).done(this.onTimeout);
		}
		onTimeout() {
			this.count = 1;
			expect(this.time()).toBe(10);
		}
		finalize = () => {
			expect(this.count).toBe(1);
			expect(this.time()).toBe(10);
			finalized++;
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerCustomDone", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10).done(this.onTimeout);
		}
		onTimeout() {
			this.count = 1;
			expect(this.time()).toBe(10);
		}
		finalize = () => {
			expect(this.count).toBe(1);
			expect(this.time()).toBe(10);
			finalized++;
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerCustomDoneInline", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10).done(() => {
				expect(this.time()).toBe(10);
				this.count = 1;
			});
		}
		finalize = () => {
			expect(this.count).toBe(1);
			expect(this.time()).toBe(10);
			finalized++;
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerRecursive", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			expect(this.time()).toBe(10 * this.count);
			this.count++;
			this.setTimer(10).done(this.start);
		}
		finalize = () => {
			expect(this.count).toBe(11);
			expect(this.time()).toBe(100);
			finalized++;
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerNoEvent", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		start() {} // eslint-disable-line no-empty-function
		finalize = () => {
			finalized++;
			expect(this.time()).toBe(0);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerZero", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		start() {
			this.setTimer(0).done(() => {
				expect(this.time()).toBe(0);
			});
		}
		finalize = () => {
			finalized++;
			expect(this.time()).toBe(0);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerTimeout1", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10)
				.done(() => {
					throw new Error();
				})
				.waitUntil(5, () => {
					expect(this.time()).toBe(5);
					this.count = 1;
				});
		}
		finalize = () => {
			finalized++;
			expect(this.time()).toBe(10);
			expect(this.count).toBe(1);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerTimeout2", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10)
				.done(() => {
					expect(this.time()).toBe(10);
					this.count = 1;
				})
				.waitUntil(20, () => {
					throw new Error();
				});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
			expect(this.time()).toBe(20);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerMultipleTimeouts", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(50)
				.done(() => {
					throw new Error();
				})
				.waitUntil(20, () => {
					throw new Error();
				})
				.waitUntil(10, () => {
					expect(this.time()).toBe(10);
					this.count = 1;
				});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
			expect(this.time()).toBe(50);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testTimerWaitEvent", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event();

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(50)
				.done(() => {
					throw new Error();
				})
				.unlessEvent(event, () => {
					expect(this.time()).toBe(10);
					this.count = 1;
				});

			this.setTimer(10).done(() => {
				event.fire();
			});
		}
		finalize = () => {
			finalized++;
			expect(this.count).toBe(1);
			expect(this.time()).toBe(50);
		};
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});
