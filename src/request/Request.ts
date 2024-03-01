import { Buffer } from "../sim/Buffer";
import { Entity } from "../sim/Entity";
import { Event } from "../sim/Event";
import { Store } from "../sim/Store";
import type { Argument } from "./Argument";
import type { Callback } from "./Callback";
import type { Context } from "./Context";
import type { PQueueRequest } from "./PQueueRequest";
import { RequestBase } from "./RequestBase";
import { doCallback } from "./doCallback";

export class Request extends RequestBase {
	entity: Entity;
	group: Array<Request> | null = null;
	constructor(entity: unknown, currentTime: number, deliverAt: number) {
		super(entity, currentTime, deliverAt);
		this.entity = entity as Entity;
		this.scheduledAt = currentTime;
		this.deliverAt = deliverAt;
	}

	cancel(): Request {
		// Ask the main request to handle cancellation
		if (this.group && this.group[0] !== this) {
			return this.group[0].cancel();
		}

		// --> this is main request
		if (this.noRenege) return this;

		// if already cancelled, do nothing
		if (this.cancelled) return this;

		// Prevent cancellation if request is about to be delivered at this
		// instant. Covers case where in a buffer or store, object has already
		// been dequeued and delivery was scheduled for now, but waitUntil
		// times out at the same time, making the request get cancelled after
		// the object is dequeued but before it is delivered.
		if (this.deliveryPending) return this;

		// set flag
		this.cancelled = true;

		if (this.deliverAt === 0) {
			this.deliverAt = this.entity.time();
		}

		if (this.source) {
			if (this.source instanceof Buffer || this.source instanceof Store) {
				this.source.progressPutQueue();
				this.source.progressGetQueue();
			}
		}

		if (this.group) {
			for (let i = 1; i < this.group.length; i++) {
				this.group[i].cancelled = true;
				if (this.group[i].deliverAt === 0) {
					this.group[i].deliverAt = this.entity.time();
				}
			}
		}
		return this;
	}

	done(callback: unknown, context?: Context, argument?: Argument) {
		this.callbacks.push([callback as Callback, context, argument]);
		return this;
	}

	waitUntil(delay: number, callback?: Callback, context?: Context, argument?: Argument) {
		if (this.noRenege) return this;

		const ro = this._addRequest(this.scheduledAt + delay, callback, context, argument);

		this.entity.sim.queue.insert(ro);
		return this;
	}

	unlessEvent(event: Event | Array<Event>, callback?: Callback, context?: Context, argument?: Argument) {
		if (this.noRenege) return this;

		if (event instanceof Event) {
			const ro = this._addRequest(0, callback, context, argument);

			ro.msg = event;
			event.addWaitList(ro);
		} else if (Array.isArray(event)) {
			for (let i = 0; i < event.length; i++) {
				const ro = this._addRequest(0, callback, context, argument);

				ro.msg = event[i];
				event[i].addWaitList(ro);
			}
		}

		return this;
	}

	setData(data: unknown) {
		this.data = data;
		return this;
	}

	deliver() {
		// Prevent delivery of child requests if main request is about to be
		// delivered at this instant. See comment in cancel above
		if (this.group?.[0].deliveryPending && this.group[0] !== this) return;

		this.deliveryPending = false;
		if (this.cancelled) return;
		this.cancel();
		if (!this.callbacks) return;

		if (this.group && this.group.length > 0) {
			doCallback.call(this, this.group[0].source, this.msg, this.group[0].data);
		} else {
			doCallback.call(this, this.source, this.msg, this.data);
		}
	}

	cancelRenegeClauses() {
		// this.cancel = this.Null;
		// this.waitUntil = this.Null;
		// this.unlessEvent = this.Null;
		this.noRenege = true;

		if (!this.group || this.group[0] !== this) {
			return;
		}

		for (let i = 1; i < this.group.length; i++) {
			this.group[i].cancelled = true;
			if (this.group[i].deliverAt === 0) {
				this.group[i].deliverAt = this.entity.time();
			}
		}
	}

	Null() {
		return this;
	}

	_addRequest(deliverAt: number, callback: Callback, context: Context, argument: Argument) {
		const ro = new Request(this.entity, this.scheduledAt, deliverAt);

		ro.callbacks.push([callback, context, argument]);

		if (this.group === null) {
			this.group = [this];
		}

		this.group.push(ro);
		ro.group = this.group;
		return ro as unknown as PQueueRequest;
	}
}
