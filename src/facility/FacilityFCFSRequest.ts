import { type PQueueRequest } from "../request/PQueueRequest";
import { Request } from "../request/Request";

export type FacilityFCFSRequest = Request &
	PQueueRequest & {
		msg: number;
		duration: number;
	};
