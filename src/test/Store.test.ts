import { expect, test } from "bun:test";

import * as Sim from "../index";

let entities = 0;
let finalized = 0;

test("testStorePut", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(3, "a");

	class MyEntity extends Sim.Entity {
		count = 0;

		start() {
			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 1 }).done(() => {
				throw new Error("fail");
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGet", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(3, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };

		start() {
			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 10 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
				expect(this.callbackMessage.a).toBe(10);
			});

			this.getStore(store).done(() => {
				throw new Error("fail");
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(4);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetFilter", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store<{ a: number }>(3, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };

		start() {
			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 10 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.getStore(store, (obj: { a: number }) => {
				return obj.a === 10;
			}).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
				expect(this.callbackMessage.a).toBe(10);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.getStore(store).done(() => {
				throw new Error("fail");
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(4);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStorePutProgress", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(2, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };

		start() {
			this.putStore(store, { a: 1 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 2 }).done(() => {
				expect(this.time()).toBe(0);
				this.count++;
			});

			this.putStore(store, { a: 3 }).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.putStore(store, { a: 4 }).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
			});

			this.putStore(store, { a: 5 }).done(() => {
				throw new Error("fail");
			});

			this.setTimer(10).done(() => {
				this.getStore(store).done(() => {
					expect(this.time()).toBe(10);
					this.count++;
					expect(this.callbackMessage.a).toBe(1);
				});
			});

			this.setTimer(20).done(() => {
				this.getStore(store).done(() => {
					expect(this.time()).toBe(20);
					this.count++;
					expect(this.callbackMessage.a).toBe(2);
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(6);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetProgress", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(2, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };
		start() {
			this.getStore(store).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
				expect(this.callbackMessage.a).toBe(2);
			});

			this.setTimer(10).done(() => {
				this.putStore(store, { a: 1 }).done(() => {
					expect(this.time()).toBe(10);
					this.count++;
				});
			});

			this.setTimer(20).done(() => {
				this.putStore(store, { a: 2 }).done(() => {
					expect(this.time()).toBe(20);
					this.count++;
				});
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(4);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetCancel", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(2, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };

		start() {
			this.getStore(store)
				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(10, () => {
					expect(this.time()).toBe(10);
					this.count++;
				});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.setTimer(20).done(() => {
				this.putStore(store, { a: 1 }).done(() => {
					expect(this.time()).toBe(20);
					this.count++;
				});
			});
		}

		finalize() {
			finalized++;
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetEventRenege", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(100, "a");

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		count = 0;

		start() {
			this.putStore(store, { a: 1 });

			// wait, since filter function is false
			this.getStore(store, () => {
				return false;
			})
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent(event);

			this.setTimer(10).done(event.fire, event);

			// wait since there is request is front
			this.getStore(store).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(1);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetTimeout", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(100, "a");

	class MyEntity extends Sim.Entity {
		count = 0;

		start() {
			this.putStore(store, { a: 1 });

			// wait, since filter function is false
			this.getStore(store, () => {
				return false;
			})
				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(10);

			// wait since there is request is front
			this.getStore(store).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});
		}

		finalize() {
			finalized++;
			expect(this.count).toBe(1);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetCancel", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(100, "a");

	class MyEntity extends Sim.Entity {
		count = 0;

		start() {
			this.putStore(store, 1);

			// wait, since filter function is false
			const ro = this.getStore(store, () => false).done(() => () => {
				throw new Error("fail");
			});

			// get wait since there is request is front
			this.getStore(store).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
			});

			this.setTimer(10).done(ro.cancel, ro);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(1);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetStillWaits", () => {
	const sim = new Sim.Sim();

	const store = new Sim.Store(100, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };

		start() {
			// get waits
			this.getStore(store).done(() => {
				expect(this.time()).toBe(10);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(20);
				this.count++;
				expect(this.callbackMessage.a).toBe(2);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
				expect(this.callbackMessage.a).toBe(3);
			});

			this.getStore(store).done(() => {
				throw new Error("fail");
			});

			this.setTimer(10).done(this.putStore, this, [store, { a: 1 }]);
			this.setTimer(20).done(this.putStore, this, [store, { a: 2 }]);
			this.setTimer(30).done(this.putStore, this, [store, { a: 3 }]);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testStoreGetFilterWaits", () => {
	const sim = new Sim.Sim();
	type Payload = { a: number };
	const store = new Sim.Store<Payload>(100, "a");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackMessage!: { a: number };
		start() {
			// get waits
			this.getStore(store, (o: { a: number }) => {
				return o.a === 3;
			}).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
				expect(this.callbackMessage.a).toBe(3);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
				expect(this.callbackMessage.a).toBe(1);
			});

			this.getStore(store).done(() => {
				expect(this.time()).toBe(30);
				this.count++;
				expect(this.callbackMessage.a).toBe(2);
			});

			this.setTimer(10).done(this.putStore, this, [store, { a: 1 }]);
			this.setTimer(20).done(this.putStore, this, [store, { a: 2 }]);
			this.setTimer(30).done(this.putStore, this, [store, { a: 3 }]);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(3);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});
