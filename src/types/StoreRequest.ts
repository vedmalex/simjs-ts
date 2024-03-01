import { type PQueueRequest } from "../request/PQueueRequest";
import type { StoreFilter } from "./StoreFilter";

export type StoreRequest<T> = PQueueRequest & {
	filter: StoreFilter<T>;
	obj: T;
};
