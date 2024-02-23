import { expect, test } from "bun:test";

import * as Sim from "../sim.js";

test("testStartArguments", () => {
	const sim = new Sim.Sim("simple");
	class MyEntity extends Sim.Entity {
		start(a: number, b: { a: number }) {
			expect(a).toBe(10);
			expect(b.a).toBe(20);
		}
	}

	sim.addEntity(MyEntity, null, 10, { a: 20 });
	sim.simulate(100);
});

test("testFinalize", () => {
	const sim = new Sim.Sim();

	class MyQueue extends Sim.Queue {
		start() {
			this.capacity = 0;
		}
	}
	sim.addEntity(MyQueue);
	sim.simulate(100);
});
