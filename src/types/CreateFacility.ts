import { FacilityFabric } from "../facility/FacilityFabric";
import { Discipline } from "./Discipline";

export function CreateFacility(
	name: string,
	discipline?: Discipline,
	servers?: number,
	maxqlen?: number,
) {
	return FacilityFabric(name, discipline, servers, maxqlen);
}
