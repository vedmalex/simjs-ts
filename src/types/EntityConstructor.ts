import { Entity } from "../sim/Entity";
import { Sim } from "../sim/Sim";
import { type Finalize } from "./Finalize";
import { type OnMessage } from "./OnMessage";
import { type Start } from "./Start";

export type EntityConstructor<T> = {
	new (sim: Sim, name?: string): T & Entity & OnMessage & Start & Finalize;
};
