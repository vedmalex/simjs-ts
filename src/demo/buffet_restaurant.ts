import * as Sim from "../index";

function buffetRestaurantSimulation(
	BuffetCapacity: number,
	PreparationTime: number,
	MeanArrival: number,
	CashierTime: number,
	Seed: number,
	Simtime: number,
) {
	var sim = new Sim.Sim();
	var stats = new Sim.Population();
	var cashier = Sim.CreateFacility("Cashier");
	var buffet = new Sim.Buffer("Buffet", BuffetCapacity);
	var random = new Sim.Random(Seed);

	class Customer extends Sim.Entity {
		callbackData!: number;
		start() {
			this.order();

			var nextCustomerAt = random.exponential(1.0 / MeanArrival);
			this.setTimer(nextCustomerAt).done(this.start);
		}

		order() {
			sim.log("Customer ENTER at " + this.time());
			stats.enter(this.time());
			debugger;
			this.getBuffer(buffet, 1)
				.done(() => {
					sim.log("Customer at CASHIER " + this.time() + " (entered at " + this.callbackData + ")");
					var serviceTime = random.exponential(1.0 / CashierTime);
					this.useFacility(cashier, serviceTime)
						.done(() => {
							sim.log("Customer LEAVE at " + this.time() + " (entered at " + this.callbackData + ")");
							stats.leave(this.callbackData, this.time());
						})
						.setData(this.callbackData);
				})
				.setData(this.time());
		}
	}

	class Chef extends Sim.Entity {
		start() {
			this.putBuffer(buffet, BuffetCapacity - buffet.current());
			this.setTimer(PreparationTime).done(this.start);
		}
	}

	sim.addEntity(Customer);
	sim.addEntity(Chef);

	// sim.setLogger((msg) => {
	// 	console.log(msg);
	// });

	sim.simulate(Simtime);

	return [
		stats.durationSeries.average(),
		stats.durationSeries.deviation(),
		stats.sizeSeries.average(),
		stats.sizeSeries.deviation(),
	];
}

var BuffetCapacity = 20;
var PreparationTime = 4;
var MeanArrival = 6;
var CashierTime = 1;
var Seed = 1234;
var Simtime = 60;

var results = buffetRestaurantSimulation(BuffetCapacity, PreparationTime, MeanArrival, CashierTime, Seed, Simtime);

var msg = `Simulation Results for [
  Buffet Capacity = ${BuffetCapacity}
  Preparation Time = ${PreparationTime}
  Mean Arrival = ${MeanArrival}
  Mean Cashier time = ${CashierTime}
  Seed = ${Seed}
  Sim time = ${Simtime}
]
Average time spent at restaurant (min) = ${results[0].toFixed(4)}
Average number of customers in restaurant = ${results[2].toFixed(4)}`;
console.log(msg);
