import type { SendMessageRequest } from "../types/SendMessageRequest";

export function sendMessage(this: SendMessageRequest) {
	const sender = this.source;

	const message = this.msg;

	const entities = this.data;

	const sim = sender.sim;

	if (!entities) {
		// send to all entities
		for (let i = sim.entities.length - 1; i >= 0; i--) {
			const entity = sim.entities[i];

			if ((entity as unknown) === sender) continue;
			if (entity.onMessage) entity.onMessage(sender, message);
		}
	} else if (Array.isArray(entities)) {
		for (let i = entities.length - 1; i >= 0; i--) {
			const entity = entities[i];

			if (entity === sender) continue;
			if (entity.onMessage) entity.onMessage(sender, message);
		}
	} else if (entities.onMessage) {
		entities.onMessage(sender, message);
	}
}
