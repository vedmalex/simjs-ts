import type { Population } from "../stats/Population";

export type FacilityT = {
	use(duration: number, ro: unknown): void;
	usage(): number;
	queueStats(): Population;
	systemStats(): Population;
};
