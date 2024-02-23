import { expect, test } from "bun:test";
import * as Sim from "../sim.js";

let finalized = 0;

test("testMessageSendOne", () => {
	const sim = new Sim.Sim();

	let count = 0;

	class MyEntity extends Sim.Entity {
		other: unknown;
		master: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.send("message", 10, this.other);
			}
		}
		onMessage = (source: unknown, message: unknown) => {
			expect(source).toBe(this.other);
			expect(message).toBe("message");
			expect(this.time()).toBe(10);
			expect(typeof this.master).toBe("undefined");
			count++;
		};

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity, true, null);

	const o2 = sim.addEntity(MyEntity, false, o1);

	o1.master = true;
	o1.other = o2;
	o2.other = o1;
	o1.init();
	o2.init();
	sim.simulate(100);
	expect(count).toBe(1);
});

test("testMessageSendAll", () => {
	const sim = new Sim.Sim();

	let count = 0;

	class MyEntity extends Sim.Entity {
		master: unknown;
		other: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.send("message", 10);
			}
		}
		onMessage(source: unknown, message: unknown) {
			expect(source).toBe(this.other);
			expect(message).toBe("message");
			expect(this.time()).toBe(10);
			expect(typeof this.master).toBe("undefined");
			count++;
		}

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity);

	const o2 = sim.addEntity(MyEntity);

	const o3 = sim.addEntity(MyEntity);

	o1.master = true;
	o2.other = o1;
	o3.other = o1;
	o1.init();
	o2.init();

	sim.simulate(100);
	expect(count).toBe(2);
});

test("testMessageSendArray", () => {
	const sim = new Sim.Sim();

	let count = 0;

	class MyEntity extends Sim.Entity {
		master: unknown;
		array: unknown;
		other: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.send("message", 10, this.array);
			}
		}

		onMessage(source: unknown, message: unknown) {
			expect(source).toBe(this.other);
			expect(message).toBe("message");
			expect(this.time()).toBe(10);
			expect(typeof this.master).toBe("undefined");
			count++;
		}

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity);

	const o2 = sim.addEntity(MyEntity);

	const o3 = sim.addEntity(MyEntity);

	o1.master = true;
	o1.array = [o2, o3, o1];
	o2.other = o1;
	o3.other = o1;
	o1.init();
	o2.init();
	o3.init();

	sim.simulate(100);
	expect(count).toBe(2);
});

test("testMessageNoCallback", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		master: unknown;
		other: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.send("message", 10, this.other);
			}
		}

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity);

	const o2 = sim.addEntity(MyEntity);

	o1.master = true;
	o1.other = o2;
	o2.other = o1;
	o1.init();
	o2.init();
	sim.simulate(100);
	expect(sim.time()).toBe(10);
});

test("testMessageDelayedSendOne", () => {
	const sim = new Sim.Sim();

	let count = 0;

	class MyEntity extends Sim.Entity {
		master: unknown;
		other: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.setTimer(10).done(this.send, this, ["message", 10, this.other]);
			}
		}
		onMessage(source: unknown, message: unknown) {
			expect(source).toBe(this.other);
			expect(message).toBe("message");
			expect(this.time()).toBe(20);
			expect(typeof this.master).toBe("undefined");
			count++;
		}

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity);

	const o2 = sim.addEntity(MyEntity);

	o1.master = true;
	o1.other = o2;
	o2.other = o1;
	o1.init();
	o2.init();
	sim.simulate(100);
	expect(count).toBe(1);
});

test("testMessageZeroDelay", () => {
	const sim = new Sim.Sim();

	let count = 0;

	class MyEntity extends Sim.Entity {
		master: unknown;
		other: unknown;
		start() {} // eslint-disable-line no-empty-function

		init() {
			if (this.master) {
				this.setTimer(10).done(this.send, this, ["message", 0, this.other]);
			}
		}
		onMessage(source: unknown, message: unknown) {
			expect(source).toBe(this.other);
			expect(message).toBe("message");
			expect(this.time()).toBe(10);
			expect(typeof this.master).toBe("undefined");
			count++;
		}

		finalize() {
			finalized++;
		}
	}

	const o1 = sim.addEntity(MyEntity);

	const o2 = sim.addEntity(MyEntity);

	o1.master = true;
	o1.other = o2;
	o2.other = o1;
	o1.init();
	o2.init();
	sim.simulate(100);
	expect(count).toBe(1);
});
