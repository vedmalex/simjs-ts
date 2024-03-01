import type { CallbackContext } from "./CallbackContext";
import { RequestBase } from "./RequestBase";

export function doCallback(
	this: RequestBase,
	source: unknown,
	msg: unknown,
	data: unknown,
) {
	for (let i = 0; i < this.callbacks.length; i++) {
		const callback = this.callbacks[i][0];

		if (!callback) continue;

		let context = this.callbacks[i][1] as CallbackContext;

		if (!context) context = this.entity as unknown as CallbackContext;

		const argument = this.callbacks[i][2];

		context.callbackSource = source;
		context.callbackMessage = msg;
		context.callbackData = data;

		if (!argument) {
			callback.call(context);
		} else if (Array.isArray(argument)) {
			callback.apply(context, argument);
		} else {
			callback.call(context, argument);
		}

		context.callbackSource = undefined;
		context.callbackMessage = undefined;
		context.callbackData = undefined;
	}
}
