export class Model {
	name: string;
	id: number;
	static _totalInstances = 0;

	constructor(name?: string) {
		this.id = Model._nextId();
		this.name = name || `${this.constructor.name} ${this.id}`;
	}

	static get totalInstances() {
		return Model._totalInstances;
	}

	static _nextId() {
		Model._totalInstances += 1;
		return Model._totalInstances;
	}
	// start(...args: Array<unknown>) {
	// 	throw new Error("not implemented");
	// }

	finalize!: (timestamp?: number) => void;
	onMessage!: <T>(source: Model, message: T) => void;
}
