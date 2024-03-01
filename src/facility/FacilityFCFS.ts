import { Queue } from "../queues/Queue";
import { type PQueueRequest } from "../request/PQueueRequest";
import { Request } from "../request/Request";
import { useFCFSCallback } from "../types/useFCFSCallback";
import { FacilityBase } from "./FacilityBase";
import { type FacilityFCFSRequest } from "./FacilityFCFSRequest";

export class FacilityFCFS extends FacilityBase {
	freeServers: Array<boolean>;
	constructor(name?: string, servers?: number, maxqlen?: number) {
		super(name, servers, maxqlen);
		this.freeServers = new Array<boolean>(this.servers);
		for (let i = 0; i < this.freeServers.length; i++) {
			this.freeServers[i] = true;
		}
	}
	queue = new Queue<FacilityFCFSRequest>();
	override use(duration: number, ro: FacilityFCFSRequest) {
		if ((this.maxqlen === 0 && !this.free) || (this.maxqlen > 0 && this.queue.size() >= this.maxqlen)) {
			ro.msg = -1;
			ro.deliverAt = ro.entity.time();
			ro.entity.sim.queue.insert(ro);
			return;
		}

		ro.duration = duration;
		const now = ro.entity.time();

		this.stats.enter(now);
		this.queue.push(ro, now);
		this.useFCFSSchedule(now);
	}

	useFCFSSchedule(timestamp: number) {
		while (this.free > 0 && !this.queue.empty()) {
			// biome-ignore lint/style/noNonNullAssertion: должны быть элементы
			const ro = this.queue.shift(timestamp)!;

			if (ro.cancelled) {
				continue;
			}
			for (let i = 0; i < this.freeServers.length; i++) {
				if (this.freeServers[i]) {
					this.freeServers[i] = false;
					ro.msg = i;
					break;
				}
			}

			this.free--;
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			this.busyDuration += ro.duration!;

			// cancel all other reneging requests
			ro.cancelRenegeClauses();

			const newro = new Request(this, timestamp, timestamp + ro.duration) as PQueueRequest;

			newro.done(useFCFSCallback, this, ro);

			ro.entity.sim.queue.insert(newro);
		}
	}
	override reset(): void {
		super.reset();
		this.queue.reset();
	}
	override finalize(timestamp: number): void {
		super.finalize(timestamp);
		this.queue.stats.finalize(timestamp);
	}
	override queueStats() {
		return this.queue.stats;
	}
}
