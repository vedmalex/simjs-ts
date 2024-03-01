import { type PQueueRequest } from "../request/PQueueRequest";
import { Entity } from "../sim/Entity";
import type { OnMessage } from "./OnMessage";

export type SendMessageRequest = PQueueRequest & {
	source: Entity;
	msg: unknown;
	data: Array<Entity & OnMessage> | (Entity & OnMessage);
	duration: number;
	entity: Entity;
};
