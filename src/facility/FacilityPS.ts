import { Request } from "../request/Request";
import type { Population } from "../stats/Population";
import { FacilityBase } from "./FacilityBase";
import { type FacilityPSRequest } from "./FacilityPSRequest";

export class FacilityPS extends FacilityBase {
	queue: Array<FacilityPSRequest> = [];
	lastIssued?: number;
	override use(duration: number, ro: FacilityPSRequest) {
		ro.duration = duration;
		ro.cancelRenegeClauses();
		this.stats.enter(ro.entity.time());
		this.useProcessorSharingSchedule(ro, true);
	}

	useProcessorSharingSchedule(ro: FacilityPSRequest, isAdded: boolean) {
		const current = ro.entity.time();

		const size = this.queue.length;

		const multiplier = isAdded ? (size + 1) / size : (size - 1) / size;

		const newQueue = [];

		if (this.queue.length === 0) {
			this.lastIssued = current;
		}

		for (let i = 0; i < size; i++) {
			const ev = this.queue[i];

			if (ev.ro === ro) {
				continue;
			}
			const newev = new Request(this, current, current + (ev.deliverAt - current) * multiplier) as FacilityPSRequest;

			newev.ro = ev.ro;
			newev.source = this;
			newev.deliver = this.useProcessorSharingCallback;
			newQueue.push(newev);

			ev.cancel();
			ro.entity.sim.queue.insert(newev);
		}

		// add this new request
		if (isAdded) {
			const newev = new Request(this, current, current + ro.duration * (size + 1)) as FacilityPSRequest;

			newev.ro = ro;
			newev.source = this;
			newev.deliver = this.useProcessorSharingCallback;
			newQueue.push(newev);

			ro.entity.sim.queue.insert(newev);
		}

		this.queue = newQueue;

		// usage statistics
		if (this.queue.length === 0) {
			// biome-ignore lint/style/noNonNullAssertion: при инициализации всегда не пустой
			this.busyDuration += current - this.lastIssued!;
		}
	}

	useProcessorSharingCallback(this: FacilityPSRequest) {
		const fac = this.source;

		if (this.cancelled) return;
		fac.stats.leave(this.ro.scheduledAt, this.ro.entity.time());

		fac.useProcessorSharingSchedule(this.ro, false);
		this.ro.deliver();
	}
}
