export class Model {
	id: number;
	name: string;
	static _totalInstances = 0;

	constructor(name?: string) {
		this.id = (this.constructor as typeof Model)._nextId();
		this.name = name || `${this.constructor.name} ${this.id}`;
	}

	static get totalInstances() {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return !this._totalInstances ? 0 : this._totalInstances;
	}

	static _nextId() {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		this._totalInstances = Model.totalInstances + 1;
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return this._totalInstances;
	}
}
