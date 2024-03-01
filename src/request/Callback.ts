import type { Argument } from "./Argument";
import type { CallbackContext } from "./CallbackContext";

export type Callback = ((this: CallbackContext, ...argument: Array<Argument>) => void) | undefined;
