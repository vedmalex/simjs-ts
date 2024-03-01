import { expect, test } from "bun:test";
import * as Sim from "../index";

let finalized = 0;

test("testEventFlash", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("event");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;

		start() {
			expect(event.isFired).toBe(false);

			this.waitEvent(event).done(() => {
				expect(event.isFired).toBe(false);
				expect(this.callbackSource).toBe(event);
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(() => {
				expect(event.isFired).toBe(false);
				event.fire();
			});

			this.setTimer(20).done(() => {
				expect(event.isFired).toBe(false);
				this.waitEvent(event).done(() => {
					expect(this.callbackSource).toBe(event);
					expect(this.time()).toBe(21);
					this.count++;
				});
			});
			this.setTimer(21).done(() => {
				expect(event.isFired).toBe(false);
				event.fire();
				expect(event.isFired).toBe(false);
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(21);
			expect(this.count).toBe(2);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testEventSustain", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("event");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;
		start() {
			expect(event.isFired).toBe(false);

			this.waitEvent(event).done(() => {
				expect(event.isFired).toBe(true);
				expect(this.callbackSource).toBe(event);
				expect(this.time()).toBe(10);
				this.count++;
			});
			this.setTimer(10).done(() => {
				expect(event.isFired).toBe(false);
				event.fire(true);
				expect(event.isFired).toBe(true);
			});

			this.setTimer(20).done(() => {
				expect(event.isFired).toBe(true);
				this.waitEvent(event).done(() => {
					expect(this.callbackSource).toBe(event);
					expect(this.time()).toBe(20);
					this.count++;
				});
			});

			this.setTimer(30).done(() => {
				expect(event.isFired).toBe(true);
				event.clear();
				expect(event.isFired).toBe(false);
			});
			this.setTimer(40).done(() => {
				expect(event.isFired).toBe(false);
				this.waitEvent(event).done(() => {
					expect(this.callbackSource).toBe(event);
					expect(this.time()).toBe(41);
					this.count++;
				});
			});

			this.setTimer(41).done(() => {
				event.fire(true);
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(41);
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testEventWaitQueue", () => {
	const barrier = new Sim.Event("Barrier");

	const funnel = new Sim.Event("Funnel");

	let wcount = 0;

	let qcount = 0;

	class MyEntity extends Sim.Entity {
		start(master: boolean) {
			this.waitEvent(barrier).done(() => {
				wcount++;
			});

			this.queueEvent(funnel).done(() => {
				qcount++;
			});

			if (master) {
				this.setTimer(10).done(barrier.fire, barrier).done(funnel.fire, funnel);
			}
		}
		finalize() {
			finalized++;
		}
	}

	const sim = new Sim.Sim();

	const e = [];

	for (let i = 0; i < 100; i++) {
		e.push(sim.addEntity(MyEntity, undefined, i === 0));
	}
	sim.simulate(100);
	expect(wcount).toBe(100);
	expect(qcount).toBe(1);
});
