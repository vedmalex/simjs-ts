import { expect, test } from "bun:test";
import * as Sim from "../sim.js";

test("testFCFSQueueSimple", () => {
	const q = new Sim.Queue();

	q.push(10, 10);
	q.shift(20);
	q.finalize(10);
	const report = q.report();

	expect(report[0]).toBe(1);
	expect(report[1]).toBe(10);
});
