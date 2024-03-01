import type { Argument } from "./Argument";
import type { Callback } from "./Callback";
import type { Context } from "./Context";

export class RequestBase {
	entity: unknown;
	scheduledAt: number;
	deliverAt: number;
	deliveryPending = false;
	callbacks: Array<[Callback, Context, Argument]> = [];
	cancelled = false;
	group: Array<RequestBase> | null = null;
	source: unknown;
	noRenege = false;
	data: unknown;
	msg: unknown;

	constructor(entity: unknown, currentTime: number, deliverAt: number) {
		this.entity = entity;
		this.scheduledAt = currentTime;
		this.deliverAt = deliverAt;
	}

	done(callback: unknown, context: Context, argument: Argument) {
		this.callbacks.push([callback as Callback, context, argument]);
		return this;
	}

	setData(data: unknown) {
		this.data = data;
		return this;
	}

	Null() {
		return this;
	}
}
