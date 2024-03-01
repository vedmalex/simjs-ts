import { expect, test } from "bun:test";
import * as Sim from "../index";
import type { Callback } from "../request/Callback";

let entities = 0;
let finalized = 0;

test("testRequestZeroDelayTimeout", () => {
	const sim = new Sim.Sim();

	class MyEntity extends Sim.Entity {
		string = "start";

		start() {
			this.setTimer(0).done(() => {
				this.string += "-second";
			});
			this.string += "-first";
		}

		finalize() {
			finalized++;
			expect(this.string).toBe("start-first-second");
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestZeroDelayPutBuffer", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		string = "start";
		start() {
			this.putBuffer(buffer, 10).done(() => {
				this.string += "-second";
			});
			this.string += "-first";
		}

		finalize() {
			finalized++;
			expect(this.string).toBe("start-first-second");
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestZeroDelayEventWait", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		string = "start";

		start() {
			event.fire(true);

			this.waitEvent(event).done(() => {
				this.string += "-second";
			});
			this.string += "-first";
		}

		finalize() {
			finalized++;
			expect(this.string).toBe("start-first-second");
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestZeroDelayEventQueue", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("a");

	class MyEntity extends Sim.Entity {
		string = "start";

		start() {
			event.fire(true);

			this.queueEvent(event).done(() => {
				this.string += "-second";
			});
			this.string += "-first";
		}

		finalize() {
			finalized++;
			expect(this.string).toBe("start-first-second");
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestZeroDelayFacility", () => {
	const sim = new Sim.Sim();

	const fac = Sim.FacilityFabric("a");

	class MyEntity extends Sim.Entity {
		string = "start";
		start() {
			this.useFacility(fac, 10).done(() => {
				this.string += "-second";
			});
			this.string += "-first";
		}

		finalize() {
			finalized++;
			expect(this.string).toBe("start-first-second");
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestCallbackData", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("buffer", 100);

	const event = new Sim.Event("event");

	class MyEntity extends Sim.Entity {
		count;
		callbackData: unknown;
		callbackMessage: unknown;
		callbackSource: unknown;
		constructor(simInstance: Sim.Sim) {
			super(simInstance);
			this.count = 0;
		}

		start() {
			this.putBuffer(buffer, 10)
				.done(this.fn1, null, 1)
				.unlessEvent(event, this.fn2 as Callback, null, 2)
				.waitUntil(10, this.fn1 as Callback, null, 3)
				.setData("my data");

			this.putBuffer(buffer, 110)
				.done(this.fn1, null, 1)
				.waitUntil(10, this.fn2 as Callback, null, 3)
				.setData("my data");

			this.putBuffer(buffer, 110)
				.done(this.fn1, this, 1)
				.unlessEvent(event, this.fn1 as Callback, this, 2)
				.waitUntil(
					10,
					() => {
						throw new Error("fail");
					},
					this,
					3,
				)
				.setData("my data");

			this.setTimer(5).done(event.fire, event);

			// this.userData is undefined outside the callback functions
			expect(typeof this.callbackData).toBe("undefined");
		}

		fn1(v: number) {
			if (this.time() === 0) {
				expect(v).toBe(1);
				expect(typeof this.callbackMessage).toBe("undefined");
			} else {
				expect(v).toBe(2);
				expect(this.callbackMessage).toBe(event);
			}
			expect(this.callbackSource).toBe(buffer);
			expect(this.callbackData).toBe("my data");
			this.count++;
		}

		fn2(v: number) {
			// this.userData is visible in all callback functions
			expect(v).toBe(3);
			expect(this.callbackSource).toBe(buffer);
			expect(typeof this.callbackMessage).toBe("undefined");
			expect(this.callbackData).toBe("my data");
			this.count++;
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

test("testRequestSetTimer", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("event");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;
		callbackMessage: unknown;
		callbackData: unknown;
		obj: unknown;
		start() {
			let clock = 1;

			// basic timers.. testing set data function
			this.setTimer(clock++)
				.setData(1)
				.done((d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(typeof this.callbackMessage).toBe("undefined");
					expect(this.callbackData).toBe(1);
					expect(typeof d).toBe("undefined");
					this.count++;
				});

			this.setTimer(clock++)
				.done((d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(typeof this.callbackMessage).toBe("undefined");
					expect(this.callbackData).toBe(1);
					expect(typeof d).toBe("undefined");
					this.count++;
				})
				.setData(1);

			this.obj = { a: 1, b: 2 };
			this.setTimer(clock++)
				.setData(this.obj)
				.done((r: unknown, m: unknown, d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(typeof this.callbackMessage).toBe("undefined");
					expect(this.callbackData).toBe(this.obj);
					expect(typeof d).toBe("undefined");
					this.count++;
				});

			this.setTimer(clock++)
				.setData("overwritten")
				.done((d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(typeof this.callbackMessage).toBe("undefined");
					expect(this.callbackData).toBe("final");
					expect(typeof d).toBe("undefined");
					this.count++;
				})
				.setData("final");

			// testing callback argument data
			this.setTimer(clock++)
				.setData("overwritten")
				.done(
					(d: unknown) => {
						expect(typeof this.callbackSource).toBe("undefined");
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("final");
						expect(d).toBe(101);
						this.count++;
					},
					null,
					101,
				)
				.setData("final");

			this.setTimer(clock++)
				.setData("overwritten")
				.done((d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(typeof this.callbackMessage).toBe("undefined");
					expect(this.callbackData).toBe("final");
					expect(typeof d).toBe("undefined");
					this.count++;
				}, null)
				.setData("final");

			this.setTimer(clock++)
				.setData("overwritten")
				.done(
					(d: unknown) => {
						expect(typeof this.callbackSource).toBe("undefined");
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("final");
						expect(d).toBe(this.obj);
						this.count++;
					},
					null,
					this.obj,
				)
				.setData("final");

			this.setTimer(clock++)
				.setData("overwritten")
				.done(
					(d: unknown, e: unknown) => {
						expect(typeof this.callbackSource).toBe("undefined");
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("final");
						expect(d).toBe(101);
						expect(e).toBe(102);
						this.count++;
					},
					null,
					[101, 102],
				)
				.setData("final");

			// timers bailed out on event
			this.setTimer(clock++)
				.setData("event")
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent(event, (d: unknown) => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(this.callbackMessage).toBe(event);
					expect(this.callbackData).toBe("event");
					expect(typeof d).toBe("undefined");
					this.count++;
				});

			event.fire(true);

			this.setTimer(clock++)
				.setData("event")
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent(
					event,
					(d: unknown) => {
						expect(typeof this.callbackSource).toBe("undefined");
						expect(this.callbackMessage).toBe(event);
						expect(this.callbackData).toBe("event");
						expect(d).toBe(101);
						this.count++;
					},
					null,
					101,
				);

			this.setTimer(clock++)
				.setData("event")
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent(
					event,
					(d: unknown, e: unknown) => {
						expect(typeof this.callbackSource).toBe("undefined");
						expect(this.callbackMessage).toBe(event);
						expect(this.callbackData).toBe("event");
						expect(d).toBe(101);
						expect(e).toBe(102);
						this.count++;
					},
					null,
					[101, 102],
				);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(11);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

/*
test('testRequestPool', () => {
  const sim = new Sim.Sim();

  let pool = new Sim.Pool("pool", 100);

  const event = new Sim.Event('event');

  class MyEntity extends Sim.Entity {
    constructor(...args: Array<unknown>) {
      super(...args);
      this.count = 0;
    }

    start() {
      // simple alloc -- always succeeds
      this.allocPool(pool, 10).setData('abcd').done((d) => {
        expect(this.callbackSource).toBe( pool);
        expect(typeof this.callbackMessage).toBe( 'undefined');
        expect(this.callbackData).toBe( 'abcd');
        expect(d).toBe( 101);
        this.count ++;
        this.freePool(pool, 10);
      }, this, 101);

      this.allocPool(pool, 10).done((d, e) => {
        expect(this.callbackSource).toBe( pool);
        expect(typeof this.callbackMessage).toBe( 'undefined');
        expect(this.callbackData).toBe( 'abcde');
        expect(d).toBe( 101);
        expect(e).toBe( 102);
        this.count ++;
        this.freePool(pool, 10);
      }, undefined, [101, 102]).setData('abcde');

      // alloc request times out
      this.allocPool(pool, 200).done(() => { throw new Error('fail'); })
      .waitUntil(1, (d) => {
        expect(this.callbackSource).toBe( pool);
        expect(typeof this.callbackMessage).toBe( 'undefined');
        expect(this.callbackData).toBe( 'waituntil');
        expect(d).toBe( 101);
        this.count ++;
      }, this, 101).setData("waituntil");

      // alloc request bails out on event
      this.allocPool(pool, 200).done(() => { throw new Error('fail'); })
      .unlessEvent(event, (d) => {
        expect(this.callbackSource).toBe( pool);
        expect(this.callbackMessage).toBe( event);
        expect(this.callbackData).toBe( 'unlessevent');
        expect(typeof d).toBe( 'undefined');
        this.count ++;
      }).setData("unlessevent");

      this.setTimer(1).done(event.fire, event);

      // alloc request is satisfied later by free request
      this.allocPool(pool, 50); // will be accepted

      this.allocPool(pool, 80)
      .setData('1234')
      .done((d) => {
        expect(this.callbackSource).toBe( pool);
        expect(typeof this.callbackMessage).toBe( 'undefined');
        expect(this.callbackData).toBe( '1234');
        this.count ++;
        this.freePool(pool, 80);
      });

      this.setTimer(1).done(() => {this.freePool(pool, 50); });

      if (this.time() === 0) {
        this.setTimer(10).done(this.start);
      }

    }
    finalize() {
      finalized ++;
      expect(pool.available).toBe( 100);
      expect(this.count).toBe( 10);

    }
  }

  sim.addEntity(MyEntity);
  sim.simulate(100);
  entities ++;
});
*/

test("testRequestBuffer", () => {
	const sim = new Sim.Sim();

	const buffer = new Sim.Buffer("buffer", 100);

	const event = new Sim.Event("event");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;
		callbackMessage: unknown;
		callbackData: unknown;
		start() {
			// Basic put and get -- requests are immediately successful
			// put
			this.setTimer(10).done(() => {
				expect(buffer.available).toBe(0);
				this.putBuffer(buffer, 10)
					.setData("abcd")
					.done((d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("abcd");
						expect(typeof d).toBe("undefined");
						this.count++; // 1
						this.getBuffer(buffer, 10);
						expect(buffer.getQueue.size()).toBe(0);
						expect(buffer.putQueue.size()).toBe(0);
					});
			});

			// put
			this.setTimer(20).done(() => {
				expect(buffer.available).toBe(0);
				this.putBuffer(buffer, 10)
					.done(
						(d: unknown) => {
							expect(this.callbackSource).toBe(buffer);
							expect(typeof this.callbackMessage).toBe("undefined");
							expect(this.callbackData).toBe("abcde");
							expect(d).toBe(101);
							this.count++; // 2
							this.getBuffer(buffer, 10);
							expect(buffer.getQueue.size()).toBe(0);
							expect(buffer.putQueue.size()).toBe(0);
						},
						this,
						101,
					)
					.setData("abcde");
			});

			// get
			this.setTimer(30).done(this.putBuffer, this, [buffer, 10]);

			this.setTimer(31).done(() => {
				expect(buffer.available).toBe(10);
				this.getBuffer(buffer, 10)
					.setData("abcd")
					.done(
						(d: unknown, e: unknown) => {
							expect(this.callbackSource).toBe(buffer);
							expect(typeof this.callbackMessage).toBe("undefined");
							expect(this.callbackData).toBe("abcd");
							expect(d).toBe(101);
							expect(e).toBe(102);
							this.count++; // 3
							expect(buffer.getQueue.size()).toBe(0);
							expect(buffer.putQueue.size()).toBe(0);
						},
						false,
						[101, 102],
					);
			});

			// get
			this.setTimer(40).done(this.putBuffer, this, [buffer, 10]);

			this.setTimer(41).done(() => {
				expect(buffer.available).toBe(10);
				this.getBuffer(buffer, 10)
					.done((d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("abcde");
						expect(typeof d).toBe("undefined");
						this.count++; // 4
						expect(buffer.getQueue.size()).toBe(0);
						expect(buffer.putQueue.size()).toBe(0);
					})
					.setData("abcde");
			});

			// Put and get requests are timed out
			this.setTimer(50).done(() => {
				expect(buffer.available).toBe(0);
				this.getBuffer(buffer, 10)
					.done(() => {
						throw new Error("fail");
					})
					.waitUntil(1, (d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("abcde");
						expect(typeof d).toBe("undefined");
						this.count++; // 5
						expect(buffer.available).toBe(0);
						expect(buffer.getQueue.size()).toBe(0);
						expect(buffer.putQueue.size()).toBe(0);
					})
					.setData("abcde");
			});

			this.setTimer(60).done(() => {
				expect(buffer.available).toBe(0);
				this.putBuffer(buffer, 1000)
					.done(() => {
						throw new Error("fail");
					})
					.waitUntil(1, (d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("abcde");
						expect(typeof d).toBe("undefined");
						this.count++; // 6
						expect(buffer.available).toBe(0);
					})
					.setData("abcde");
			});

			// put and get requests are bailed out on event
			this.setTimer(70).done(() => {
				expect(buffer.available).toBe(0);
				event.clear();
				this.getBuffer(buffer, 10)
					.done(() => {
						throw new Error("fail");
					})
					.unlessEvent(event, (d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(this.callbackMessage).toBe(event);
						expect(this.callbackData).toBe("abcde");
						expect(typeof d).toBe("undefined");
						this.count++; // 7
						expect(this.time()).toBe(71);
						expect(buffer.available).toBe(0);
					})
					.setData("abcde");
			});
			this.setTimer(71).done(() => {
				event.fire();
			});

			this.setTimer(80).done(() => {
				expect(buffer.available).toBe(0);
				event.clear();
				this.putBuffer(buffer, 1000)
					.done(() => {
						throw new Error("fail");
					})
					.unlessEvent(event, (d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(this.callbackMessage).toBe(event);
						expect(this.callbackData).toBe("abcde");
						expect(typeof d).toBe("undefined");
						this.count++; // 8
						expect(this.time()).toBe(81);
						expect(buffer.available).toBe(0);
					})
					.setData("abcde");
			});
			this.setTimer(81).done(event.fire, event);

			// put request is satisfied later by get
			this.setTimer(90).done(() => {
				expect(buffer.available).toBe(0);
				this.putBuffer(buffer, 80);
				expect(buffer.available).toBe(80);
			});
			this.setTimer(91).done(() => {
				expect(buffer.available).toBe(80);
				this.putBuffer(buffer, 50)
					.done((d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("1234");
						expect(typeof d).toBe("undefined");
						this.count++;
						expect(this.time()).toBe(92);
						this.getBuffer(buffer, 50);
					}, this)
					.setData("1234");
			});
			this.setTimer(92).done(() => {
				expect(buffer.available).toBe(80);
				this.getBuffer(buffer, 80);
			});

			// get request is satisfied later by put
			this.setTimer(100).done(() => {
				expect(buffer.available).toBe(0);
				this.getBuffer(buffer, 50)
					.done((d: unknown) => {
						expect(this.callbackSource).toBe(buffer);
						expect(typeof this.callbackMessage).toBe("undefined");
						expect(this.callbackData).toBe("4321");
						expect(typeof d).toBe("undefined");
						this.count++;
						expect(this.time()).toBe(101);
					})
					.setData("4321");
			});
			this.setTimer(101).done(this.putBuffer, this, [buffer, 50]);
		}
		finalize() {
			finalized++;
			expect(buffer.available).toBe(0);
			expect(this.count).toBe(10);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(300);
	entities++;
});

test("testRequestEvents", () => {
	const sim = new Sim.Sim();

	const event1 = new Sim.Event("event1");

	const event2 = new Sim.Event("event2");

	class MyEntity extends Sim.Entity {
		count = 0;
		callbackSource: unknown;
		callbackMessage: unknown;
		callbackData: unknown;
		start() {
			this.setTimer(10)
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent([event1, event2], () => {
					expect(typeof this.callbackSource).toBe("undefined");
					expect(this.callbackMessage).toBe(event1);
					expect(typeof this.callbackData).toBe("undefined");
					this.count++;
				});

			this.setTimer(15).done(() => {
				this.waitEvent(event1)
					.done(() => {
						throw new Error("fail");
					})
					.unlessEvent(
						event2,
						(d: unknown) => {
							expect(this.callbackSource).toBe(event1);
							expect(this.callbackMessage).toBe(event2);
							expect(this.callbackData).toBe("abcd");
							expect(d).toBe(101);
							this.count++;
						},
						this,
						101,
					)
					.setData("abcd");
			});

			this.setTimer(5).done(event1.fire, event1);
			this.setTimer(20).done(event2.fire, event2);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(2);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

test("testRequestEventRepeat", () => {
	const sim = new Sim.Sim();

	const event1 = new Sim.Event("event1");

	const event2 = new Sim.Event("event2");

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			this.setTimer(10)
				.done(() => {
					throw new Error("fail");
				})
				.unlessEvent([event1, event2], this.inc)
				.unlessEvent([event1, event2], this.inc);

			this.setTimer(5).done(event1.fire, event1);
		}
		inc() {
			this.count++;
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

test("testRequestCancel", () => {
	const sim = new Sim.Sim();

	const event = new Sim.Event("event1");

	const fac = Sim.FacilityFabric("facility");

	const buffer = new Sim.Buffer("a", 100);

	class MyEntity extends Sim.Entity {
		count = 0;
		start() {
			const ro1 = this.setTimer(50)

				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(20, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			const ro2 = this.waitEvent(event)

				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(20, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			const ro3 = this.putBuffer(buffer, 110)

				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(20, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			this.useFacility(fac, 20);

			const ro4 = this.useFacility(fac, 10)

				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(20, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			const ro5 = this.getBuffer(buffer, 110)

				.done(() => {
					throw new Error("fail");
				})
				.waitUntil(20, () => {
					throw new Error("fail");
				})
				.unlessEvent(event, () => {
					throw new Error("fail");
				});

			this.setTimer(10).done(ro1.cancel, ro1);
			this.setTimer(10).done(ro2.cancel, ro2);
			this.setTimer(10).done(ro3.cancel, ro3);
			this.setTimer(10).done(ro4.cancel, ro4);
			this.setTimer(10).done(ro5.cancel, ro5);
		}
		finalize() {
			finalized++;
			expect(this.count).toBe(0);
		}
	}

	sim.addEntity(MyEntity);
	sim.simulate(100);
	entities++;
});

// unlessEvent(e1).unlessEvent(e1)
// unlessEvent([e1, e1])
