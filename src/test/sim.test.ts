import { expect, test } from "bun:test";

import * as Sim from "../index";

test("testStartArguments", () => {
	const sim = new Sim.Sim("simple");
	class MyEntity extends Sim.Entity {
		start(a: number, b: { a: number }) {
			expect(a).toBe(10);
			expect(b.a).toBe(20);
		}
		finalize() {}
	}

	sim.addEntity(MyEntity, undefined, 10, { a: 20 });
	sim.simulate(100);
});

test("testFinalize", () => {
	const sim = new Sim.Sim();
	let count = 0;
	class MyQueue extends Sim.Entity {
		capacity = 0;
		start() {
			this.capacity = 0;
		}
		finalize() {
			count += 1;
		}
	}
	sim.addEntity(MyQueue);
	sim.simulate(100);
	expect(count).toBe(1);
});
