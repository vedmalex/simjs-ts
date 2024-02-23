import { Buffer } from "./Buffer.js";
import type { Entity } from "./Entity.js";
import { Event } from "./Event.js";
import type { Facility } from "./Facility.js";
import type { Sim } from "./Sim.js";
import { Store } from "./Store.js";

export type RequestEntity = Event | Facility | Store | Entity | Buffer;
export type RequestSource = Entity | Sim;

export class Request {
	constructor(entity, currentTime, deliverAt) {
		this.entity = entity;
		this.scheduledAt = currentTime;
		this.deliverAt = deliverAt;
		this.deliveryPending = false;
		this.callbacks = [];
		this.cancelled = false;
		this.group = null;
	}

	cancel() {
		// Ask the main request to handle cancellation
		if (this.group && this.group[0] !== this) {
			return this.group[0].cancel();
		}

		// --> this is main request
		if (this.noRenege) return this;

		// if already cancelled, do nothing
		if (this.cancelled) return;

		// Prevent cancellation if request is about to be delivered at this
		// instant. Covers case where in a buffer or store, object has already
		// been dequeued and delivery was scheduled for now, but waitUntil
		// times out at the same time, making the request get cancelled after
		// the object is dequeued but before it is delivered.
		if (this.deliveryPending) return;

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

		if (!this.group) {
			return;
		}
		for (let i = 1; i < this.group.length; i++) {
			this.group[i].cancelled = true;
			if (this.group[i].deliverAt === 0) {
				this.group[i].deliverAt = this.entity.time();
			}
		}
	}

	done(callback, context, argument) {
		this.callbacks.push([callback, context, argument]);
		return this;
	}

	waitUntil(delay, callback, context, argument) {
		if (this.noRenege) return this;

		const ro = this._addRequest(
			this.scheduledAt + delay,
			callback,
			context,
			argument,
		);

		this.entity.sim.queue.insert(ro);
		return this;
	}

	unlessEvent(event, callback, context, argument) {
		if (this.noRenege) return this;

		if (event instanceof Event) {
			const ro = this._addRequest(0, callback, context, argument);

			ro.msg = event;
			event.addWaitList(ro);
		} else if (event instanceof Array) {
			for (let i = 0; i < event.length; i++) {
				const ro = this._addRequest(0, callback, context, argument);

				ro.msg = event[i];
				event[i].addWaitList(ro);
			}
		}

		return this;
	}

	setData(data) {
		this.data = data;
		return this;
	}

	deliver() {
		// Prevent delivery of child requests if main request is about to be
		// delivered at this instant. See comment in cancel above
		if (this.group && this.group[0].deliveryPending && this.group[0] !== this)
			return;

		this.deliveryPending = false;
		if (this.cancelled) return;
		this.cancel();
		if (!this.callbacks) return;

		if (this.group && this.group.length > 0) {
			this._doCallback(this.group[0].source, this.msg, this.group[0].data);
		} else {
			this._doCallback(this.source, this.msg, this.data);
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

	_addRequest(deliverAt, callback, context, argument) {
		const ro = new Request(this.entity, this.scheduledAt, deliverAt);

		ro.callbacks.push([callback, context, argument]);

		if (this.group === null) {
			this.group = [this];
		}

		this.group.push(ro);
		ro.group = this.group;
		return ro;
	}

	_doCallback(source, msg, data) {
		for (let i = 0; i < this.callbacks.length; i++) {
			const callback = this.callbacks[i][0];

			if (!callback) continue;

			let context = this.callbacks[i][1];

			if (!context) context = this.entity;

			const argument = this.callbacks[i][2];

			context.callbackSource = source;
			context.callbackMessage = msg;
			context.callbackData = data;

			if (!argument) {
				callback.call(context);
			} else if (argument instanceof Array) {
				callback.apply(context, argument);
			} else {
				callback.call(context, argument);
			}

			context.callbackSource = null;
			context.callbackMessage = null;
			context.callbackData = null;
		}
	}
}
