import * as Sim from "../index";

function trafficLightSimulation(GREEN_TIME: number, MEAN_ARRIVAL: number, SEED: number, SIMTIME: number) {
	var sim = new Sim.Sim();
	var random = new Sim.Random(SEED);
	var trafficLights = [new Sim.Event("North-South Light"), new Sim.Event("East-West Light")];
	var stats = new Sim.Population("Waiting at Intersection");

	class LightController extends Sim.Entity {
		currentLight = 0;
		start() {
			sim.log(
				trafficLights[this.currentLight].name + " OFF" + ", " + trafficLights[1 - this.currentLight].name + " ON",
			);
			sim.log("------------------------------------------");
			// turn off the current light
			trafficLights[this.currentLight].clear();

			// turn on the other light.
			// Note the true parameter: the event must "sustain"
			trafficLights[1 - this.currentLight].fire(true);

			// update the currentLight variable
			this.currentLight = 1 - this.currentLight;

			// Repeat every GREEN_TIME interval
			this.setTimer(GREEN_TIME).done(this.start);
		}
	}

	class Traffic extends Sim.Entity {
		callbackData!: number;
		start() {
			this.generateTraffic("North", trafficLights[0]); // traffic for North -> South
			this.generateTraffic("South", trafficLights[0]); // traffic for South -> North
			this.generateTraffic("East", trafficLights[1]); // traffic for East -> West
			this.generateTraffic("West", trafficLights[1]); // traffic for West -> East
		}
		generateTraffic(direction: string, light: Sim.Event) {
			// STATS: record that vehicle as entered the intersection
			stats.enter(this.time());
			sim.log("Arrive for " + direction);

			// wait on the light.
			// The done() function will be called when the event fires
			// (i.e. the light turns green).
			this.waitEvent(light)
				.done(() => {
					var arrivedAt = this.callbackData;
					// STATS: record that vehicle has left the intersection
					stats.leave(arrivedAt, this.time());
					sim.log("Leave for " + direction + " (arrived at " + arrivedAt.toFixed(6) + ")");
				})
				.setData(this.time());

			// Repeat for the next car. Call this function again.
			var nextArrivalAt = random.exponential(1.0 / MEAN_ARRIVAL);
			this.setTimer(nextArrivalAt).done(this.generateTraffic, this, [direction, light]);
		}
	}

	sim.addEntity(LightController);
	sim.addEntity(Traffic);

	// sim.setLogger((msg) => {
	// 	console.log(msg);
	// });

	// simulate for SIMTIME time
	sim.simulate(SIMTIME);

	return [
		stats.durationSeries.average(),
		stats.durationSeries.deviation(),
		stats.sizeSeries.average(),
		stats.sizeSeries.deviation(),
	];
}

var green_time = 45;
var mean_arrival = 3;
var seed = 1234;
var simtime = 250000;

var results = trafficLightSimulation(green_time, mean_arrival, seed, simtime);
var msg = `Simulation Results for [
    Green Time = ${green_time}
    Mean Arrival = ${mean_arrival}
    Seed = ${seed}
    Simulation time = ${simtime}
  ]
Average time waiting at intersection (sec) = ${results[0].toFixed(4)}
Average number of vehicles waiting at intersection = ${results[2].toFixed(4)}`;

console.log(msg);
