import type { Argument } from "./Argument";

export type Callback = ((...argument: Array<Argument>) => void) | undefined;
