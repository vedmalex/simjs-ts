import { Request } from "./Request";

export type PQueueRequest = Request & {
	order: number;
};
