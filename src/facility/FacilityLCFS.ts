import { Queue } from "../queues/Queue";
import { FacilityBase } from "./FacilityBase";
import { type FacilityLCFSRequest } from "./FacilityLCFSRequest";

export class FacilityLCFS extends FacilityBase {
	queue = new Queue<FacilityLCFSRequest>();
	currentRO?: FacilityLCFSRequest;
	override use(duration: number, ro: FacilityLCFSRequest) {
		// if there was a running request..
		if (this.currentRO) {
			this.busyDuration += this.currentRO.entity.time() - this.currentRO.lastIssued;
			// calcuate the remaining time
			this.currentRO.remaining = this.currentRO.deliverAt - this.currentRO.entity.time();
			// preempt it..
			this.queue.push(this.currentRO, ro.entity.time());
		}

		this.currentRO = ro;
		// If this is the first time..
		if (!ro.saved_deliver) {
			ro.cancelRenegeClauses();
			ro.remaining = duration;
			ro.saved_deliver = ro.deliver;
			ro.deliver = this.useLCFSCallback;

			this.stats.enter(ro.entity.time());
		}

		ro.lastIssued = ro.entity.time();

		// schedule this new event
		ro.deliverAt = ro.entity.time() + duration;
		ro.entity.sim.queue.insert(ro);
	}
	useLCFSCallback(this: FacilityLCFSRequest) {
		const facility = this.source;

		if (this !== facility.currentRO) return;
		facility.currentRO = undefined;

		// stats
		facility.busyDuration += this.entity.time() - this.lastIssued;
		facility.stats.leave(this.scheduledAt, this.entity.time());

		// deliver this request
		// biome-ignore lint/style/noNonNullAssertion: уже назначен в use
		this.deliver = this.saved_deliver!;
		this.saved_deliver = undefined;
		this.deliver();

		// see if there are pending requests
		if (!facility.queue.empty()) {
			// biome-ignore lint/style/noNonNullAssertion: по условию уже не пустое
			const obj = facility.queue.pop(this.entity.time())!;

			facility.use(obj.remaining, obj);
		}
	}
	override reset(): void {
		super.reset();
		this.queue.reset();
	}
	override queueStats() {
		return this.queue.stats;
	}
	override finalize(timestamp: number): void {
		super.finalize(timestamp);
		this.queue.stats.finalize(timestamp);
	}
}
