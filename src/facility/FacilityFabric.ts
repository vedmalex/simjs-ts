import { Discipline } from "../types/Discipline";
import { FacilityFCFS } from "./FacilityFCFS";
import { FacilityLCFS } from "./FacilityLCFS";
import { FacilityPS } from "./FacilityPS";
import { type FacilityT } from "./FacilityT";

export function FacilityFabric(
	name?: string,
	discipline?: Discipline,
	servers?: number,
	maxqlen?: number,
): FacilityT {
	switch (discipline) {
		case Discipline.LCFS:
			return new FacilityLCFS(name, servers, maxqlen);
		case Discipline.PS:
			return new FacilityPS(name, servers, maxqlen);
		// case Discipline.FCFS:
		default:
			return new FacilityFCFS(name, servers, maxqlen);
	}
}
