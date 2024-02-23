import { expect, test } from "bun:test";
import * as Sim from "../sim.js";

let finalized = 0;

test("testFacilityFCFSOneServer", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("facility", Sim.Facility.FCFS, 1);

	class MyEntity extends Sim.Entity {
		count: number;
		callbackSource: unknown;
		callbackMessage: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			// at time 0 => [0, 10]
			// at time 0 => [10, 20]
			// at time 4 => [20, 30]
			// at time 40 => [40, 50]
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				expect(this.callbackSource).toBe(fac);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				expect(this.callbackSource).toBe(fac);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(30);
					expect(this.callbackSource).toBe(fac);
					expect(this.callbackMessage).toBe(0);
					this.count++;
				});
			});

			this.setTimer(40).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(50);
					expect(this.callbackSource).toBe(fac);
					expect(this.callbackMessage).toBe(0);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(50);
			expect(this.count).toBe(4);
			expect(fac.usage()).toBe(40);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityFCFSOOneServerTwoEntities", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("facility");

	class MyEntity extends Sim.Entity {
		count = 0;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start(first: boolean) {
			// entity 1, at time 0: [0, 10]
			// entity 2, at time 0: [10, 20]
			// entity 1, at time 4: [20, 30]
			// entity 2, at time 4: [30, 40]
			// entity 1, at time 50: [50, 60]
			// entity 2, at time 70: [70, 80]
			if (first) {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(10);
					this.count++;
				});
				this.setTimer(4).done(() => {
					this.useFacility(fac, 10).done(() => {
						expect(this.time()).toBe(30);
						this.count++;
					});
				});
				this.setTimer(50).done(() => {
					this.useFacility(fac, 10).done(() => {
						expect(this.time()).toBe(60);
						this.count++;
					});
				});
			} else {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(20);
					this.count++;
				});

				this.setTimer(4).done(() => {
					this.useFacility(fac, 10).done(() => {
						expect(this.time()).toBe(40);
						this.count++;
					});
				});

				this.setTimer(70).done(() => {
					this.useFacility(fac, 10).done(() => {
						expect(this.time()).toBe(80);
						this.count++;
					});
				});
			}
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(80);
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity, null, true);
	sim.addEntity(MyEntity, null, false);
	sim.simulate(100);
});

test("testFacilityFCFSTwoServers", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("facility", Sim.Facility.FCFS, 2);

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;
		callbackMessage: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			// at time 0: [0, 10] at server 0
			// at time 0: [0, 10] at server 1
			// at time 0: [10, 20] at server 0
			// at time 14: [14, 24] at server 1
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				expect(this.callbackSource).toBe(fac);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				expect(this.callbackSource).toBe(fac);
				expect(this.callbackMessage).toBe(1);
				this.count++;
			});

			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				expect(this.callbackSource).toBe(fac);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.setTimer(14).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(24);
					expect(this.callbackSource).toBe(fac);
					expect(this.callbackMessage).toBe(1);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(24);
			expect(this.count).toBe(4);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityFCFSDrop0", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("fcfs", Sim.Facility.FCFS, 1, 0);

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}

		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(4);
					expect(this.callbackMessage).toBe(-1);
					this.count++;
				});
			});

			this.setTimer(16).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(26);
					expect(this.callbackMessage).toBe(0);
					this.count++;
				});
			});
		}

		finalize() {
			finalized++;
			expect(this.time()).toBe(26);
			expect(this.count).toBe(3);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityFCFSDrop1", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("fcfs", Sim.Facility.FCFS, 1, 1);

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				expect(this.callbackMessage).toBe(0);
				this.count++;
			});

			this.setTimer(1).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(20);
					expect(this.callbackMessage).toBe(0);
					this.count++;
				});
			});

			this.setTimer(2).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(2);
					expect(this.callbackMessage).toBe(-1);
					this.count++;
				});
			});

			this.setTimer(26).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(36);
					expect(this.callbackMessage).toBe(0);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(36);
			expect(this.count).toBe(4);
			expect(fac.usage()).toBe(30);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityLCFSSimple", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("lcfs", Sim.Facility.LCFS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(14);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(20);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityLCFSPreemptTwice", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("lcfs", Sim.Facility.LCFS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(14);
					this.count++;
				});
			});

			this.setTimer(16).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(26);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(30);
			expect(this.count).toBe(3);
			expect(fac.usage()).toBe(30);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityLCFSPreemptTwoLevel", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("lcfs", Sim.Facility.LCFS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(24);
					this.count++;
				});
			});

			this.setTimer(6).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(16);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(30);
			expect(this.count).toBe(3);
			expect(fac.usage()).toBe(30);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityTimeoutDuringUsage", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.FCFS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.useFacility(fac, 10)
					.done(() => {
						throw new Error("fail");
					})
					.waitUntil(4, () => {
						expect(this.time()).toBe(8);
						this.count++;
					});
			});

			this.setTimer(6).done(() => {
				this.useFacility(fac, 10)
					.done(() => {
						expect(this.time()).toBe(20);
						this.count++;
					})
					.waitUntil(5, () => {
						throw new Error("fail");
					});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(20);
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityCancelDuringUsage", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.FCFS);

	class MyEntity extends Sim.Entity {
		count;
		ro!: Sim.Request;
		ro2!: Sim.Request;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.ro = this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.ro2 = this.useFacility(fac, 10).done(() => {
				throw new Error("fail");
			});
			this.setTimer(2).done(this.ro2.cancel, this.ro2);

			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.ro.cancel();
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(20);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityLCFSImmuneToRenege", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.LCFS);

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		count;
		ro!: Sim.Request;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.ro = this.useFacility(fac, 10)
				.done(() => {
					expect(this.time()).toBe(10);
					this.count++;
				})
				.waitUntil(1, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			event.fire(true);

			this.setTimer(4).done(() => {
				this.ro.cancel();
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(10);
			expect(this.count).toBe(1);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSOne", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(10);
			expect(this.count).toBe(1);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTwoIdentical", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(20);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTwoIdenticalLater", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.setTimer(10).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(30);
					this.count++;
				});
			});

			this.setTimer(10).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(30);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(30);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTwoOverlapPartial", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.setTimer(10).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(25);
					this.count++;
				});
			});

			this.setTimer(15).done(() => {
				this.useFacility(fac, 10).done(() => {
					expect(this.time()).toBe(30);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(35);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTwoOverlapFull", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.setTimer(10).done(() => {
				this.useFacility(fac, 20).done(() => {
					expect(this.time()).toBe(35);
					this.count++;
				});
			});

			this.setTimer(15).done(() => {
				this.useFacility(fac, 5).done(() => {
					expect(this.time()).toBe(25);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(45);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(25);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTwoNoOverlap", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.setTimer(0).done(() => {
				this.useFacility(fac, 1).done(() => {
					expect(this.time()).toBe(1);
					this.count++;
				});
			});
			this.setTimer(1).done(() => {
				this.useFacility(fac, 1).done(() => {
					expect(this.time()).toBe(2);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(3);
			expect(this.count).toBe(2);
			expect(fac.usage()).toBe(2);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTenNoOverlap", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		callbackData: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			for (let i = 0; i < 10; i++) {
				this.setTimer(i)
					.done(() => {
						this.useFacility(fac, 1).done(
							(j: number) => {
								expect(this.time()).toBe(j);
								this.count++;
							},
							null,
							this.callbackData,
						);
					})
					.setData(i + 1);
			}
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(11);
			expect(this.count).toBe(10);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTenSmall", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		callbackData: unknown;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			for (let i = 0; i < 10; i++) {
				this.setTimer(2 * i)
					.done(() => {
						this.useFacility(fac, 1).done(
							(j: number) => {
								expect(this.time()).toBe(j);
								this.count++;
							},
							null,
							this.callbackData,
						);
					})
					.setData(2 * i + 2);
			}
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(11);
			expect(fac.usage()).toBe(20);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSTen", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			for (let i = 0; i < 10; i++) {
				this.useFacility(fac, 1).done(() => {
					expect(this.time()).toBe(10);
					this.count++;
				});
			}
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(10);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSRampUpDown", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.setTimer(0).done(() => {
				this.useFacility(fac, 4).done(() => {
					expect(this.time()).toBe(7);
					this.count++;
				});
			});

			this.setTimer(1).done(() => {
				this.useFacility(fac, 2).done(() => {
					expect(this.time()).toBe(6);
					this.count++;
				});
			});

			this.setTimer(2).done(() => {
				this.useFacility(fac, 1).done(() => {
					expect(this.time()).toBe(5);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(3);
			expect(fac.usage()).toBe(7);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSImmuneToRenege", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		count;
		ro!: Sim.Request;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.ro = this.useFacility(fac, 10)
				.done(() => {
					expect(this.time()).toBe(10);
					this.count++;
				})
				.waitUntil(1, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			event.fire(true);

			this.setTimer(4).done(() => {
				this.ro.cancel();
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(10);
			expect(this.count).toBe(1);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSCancelDuringUsage", () => {
	const sim = new Sim.Sim();

	const fac = new Sim.Facility("simple", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		ro!: Sim.Request;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.ro = this.useFacility(fac, 10).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(4).done(() => {
				this.ro.cancel();
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(10);
			expect(this.count).toBe(1);
			expect(fac.usage()).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSDocExample", () => {
	const sim = new Sim.Sim();

	const network = new Sim.Facility("Network Cable", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			// make request at time 0, to use network for 10 sec
			this.useFacility(network, 10).done(() => {
				this.count++;
				expect(this.time()).toBe(11);
			});

			// make request at time 5, to use the network for 1 sec
			this.setTimer(5).done(() => {
				this.useFacility(network, 1).done(() => {
					this.count++;
					expect(this.time()).toBe(7);
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.time()).toBe(15);
			expect(this.count).toBe(2);
			expect(network.usage()).toBe(11);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});

test("testFacilityPSNested", () => {
	const sim = new Sim.Sim();

	const network = new Sim.Facility("abcd", Sim.Facility.PS);

	class MyEntity extends Sim.Entity {
		count;
		constructor(...args: Array<unknown>) {
			super(...args);
			this.count = 0;
		}
		start() {
			this.useFacility(network, 1).done(() => {
				this.count++;
				expect(this.time()).toBe(1);
				this.useFacility(network, 1).done(() => {
					this.count++;
					expect(this.time()).toBe(2);
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(2);
			expect(this.time()).toBe(2);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
});
