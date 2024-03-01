import { FacilityFCFS } from "../facility/FacilityFCFS";
import type { FacilityFCFSRequest } from "../facility/FacilityFCFSRequest";

export function useFCFSCallback(this: FacilityFCFS, ro: FacilityFCFSRequest) {
	// We have one more free server
	this.free++;
	this.freeServers[ro.msg] = true;

	this.stats.leave(ro.scheduledAt, ro.entity.time());

	// if there is someone waiting, schedule it now
	this.useFCFSSchedule(ro.entity.time());

	// restore the deliver function, and deliver
	ro.deliver();
}
