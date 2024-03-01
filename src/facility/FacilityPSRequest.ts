import { type PQueueRequest } from "../request/PQueueRequest";
import { Request } from "../request/Request";
import { Entity } from "../sim/Entity";
import { FacilityPS } from "./FacilityPS";

export type FacilityPSRequest = Request &
	PQueueRequest & {
		source: FacilityPS;
		duration: number;
		entity: Entity;
		ro: FacilityPSRequest;
	};
