import { type PQueueRequest } from "../request/PQueueRequest";

export type BufferRequest = PQueueRequest & {
	amount: number;
};
