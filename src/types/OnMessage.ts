import { Entity } from "../sim/Entity";

export type OnMessage = {
	onMessage?(sender: Entity, message: unknown): void;
};
