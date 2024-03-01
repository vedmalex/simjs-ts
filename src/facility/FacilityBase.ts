import { Model } from "../sim/Model";
import { Population } from "../stats/Population";

export class FacilityBase extends Model {
	free;
	servers;
	maxqlen;
	stats = new Population();
	busyDuration = 0;
	constructor(name?: string, servers?: number, maxqlen?: number) {
		super(name);
		this.free = servers ? servers : 1;
		this.servers = servers ? servers : 1;
		this.maxqlen = typeof maxqlen === "undefined" ? -1 : 1 * maxqlen;
	}

	reset() {
		this.stats.reset();
		this.busyDuration = 0;
	}

	systemStats() {
		return this.stats;
	}

	usage() {
		return this.busyDuration;
	}

	finalize(timestamp: number) {
		this.stats.finalize(timestamp);
	}
	use(duration: number, ro: unknown) {
		throw new Error("not implemented");
	}
	queueStats(): Population {
		throw new Error("not implemented");
	}
}
