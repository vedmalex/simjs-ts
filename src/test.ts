import * as Sim from "./index";

const sim = new Sim.Sim();

const store = new Sim.Store(3, "a");

class MyEntity extends Sim.Entity {
	count = 0;
	constructor(...args) {
		super(...args);
		this.count = 0;
	}

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
