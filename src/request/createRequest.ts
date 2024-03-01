import { Request } from "./Request";
import { RequestBase } from "./RequestBase";

export const Requests = {
	Entity: Request,
} as const;

export function createRequest<T extends keyof typeof Requests>(
	source: T,
	entity: (typeof Requests)[T],
	currentTime: number,
	deliverAt: number,
): RequestBase {
	switch (source) {
		case "Entity":
			return new Requests[source](entity, currentTime, deliverAt);
		default:
			return new RequestBase(entity, currentTime, deliverAt);
	}
}
