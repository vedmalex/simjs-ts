import { type PQueueRequest } from "../request/PQueueRequest";
import { Model } from "./Model";

export class Event extends Model {
	waitList: Array<PQueueRequest> = [];
	queue: Array<PQueueRequest> = [];
	isFired = false;

	addWaitList(ro: PQueueRequest) {
		if (this.isFired) {
			ro.deliverAt = ro.entity.time();
			ro.entity.sim.queue.insert(ro);
			return;
		}
		this.waitList.push(ro);
	}

	addQueue(ro: PQueueRequest) {
		if (this.isFired) {
			ro.deliverAt = ro.entity.time();
			ro.entity.sim.queue.insert(ro);
			return;
		}
		this.queue.push(ro);
	}

	fire(keepFired?: boolean) {
		if (keepFired) {
			this.isFired = true;
		}

		// Dispatch all waiting entities
		const tmpList = this.waitList;

		this.waitList = [];
		for (let i = 0; i < tmpList.length; i++) {
			tmpList[i].deliver();
		}

		// Dispatch one queued entity
		const lucky = this.queue.shift();

		if (lucky) {
			lucky.deliver();
		}
	}

	clear() {
		this.isFired = false;
	}
}
