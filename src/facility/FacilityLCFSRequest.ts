import { type PQueueRequest } from "../request/PQueueRequest";
import { Request } from "../request/Request";
import { Entity } from "../sim/Entity";
import { FacilityLCFS } from "./FacilityLCFS";

export type FacilityLCFSRequest = Request &
	PQueueRequest & {
		source: FacilityLCFS;
		entity: Entity;
		remaining: number;
		lastIssued: number;
		deliverAt: number;
		scheduledAt: number;
		saved_deliver?: () => void;
	};
