import { expect, test } from "bun:test";
import type { PQueueRequest } from "../lib/request.js";
import * as Sim from "../sim.js";

test("testPQueue", () => {
	const dataset = [
		[],

		[0],
		[1],
		[1, 2],
		[2, 1],
		[1, 2, 3],
		[3, 2, 1],
		[3, 1, 2],
		[1, 2, 3, 4],
		[4, 3, 1, 2],
		[1, 1, 1, 1],
		[1, 1, 3, 1, 1],
		[9, 8, 7, 6, 5, 4, 3, 2, 1],
		[9, 8, 7, 6, 5, 4, 3, 2, 1, 10],
	];

	for (let i = 0; i < dataset.length; i++) {
		const arr = dataset[i];

		// insert
		const pq = new Sim.PQueue();

		for (let j = 0; j < arr.length; j++) {
			pq.insert(new Sim.Request(0, 0, arr[j]) as PQueueRequest);
		}

		const out = [];

		while (true) {
			const a = pq.remove();
			if (!a) break;
			out.push(a.deliverAt);
		}

		expect(
			arr.sort((a, b) => {
				return a - b;
			}),
		).toMatchObject(out);
	}
});
