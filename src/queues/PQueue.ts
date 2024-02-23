import { Model } from "../Sim/Model.js";
import { Request } from "../Sim/Request.js";

export class PQueue extends Model {
	data: Array<Request>;
	order = 0;
	constructor(name?: string) {
		super(name);
		this.data = [];
		this.order = 0;
	}

	private greater(ro1: Request, ro2: Request) {
		if (ro1.deliverAt > ro2.deliverAt) return true;
		// biome-ignore lint/style/noNonNullAssertion: it is private function and used internally
		if (ro1.deliverAt === ro2.deliverAt) return ro1.order! > ro2.order!;
		return false;
	}

	insert(ro: Request) {
		ro.order = this.order++;

		let index = this.data.length;

		this.data.push(ro);

		// insert into data at the end
		const a = this.data;

		const node = a[index];

		// heap up
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.greater(a[parentIndex], ro)) {
				a[index] = a[parentIndex];
				index = parentIndex;
			} else {
				break;
			}
		}
		a[index] = node;
	}

	remove() {
		if (this.data.length <= 0) {
			return;
		}
		if (this.data.length === 1) {
			return this.data.pop();
		}
		const top = this.data[0];

		// move the last node up
		const last = this.data.pop();

		if (last) this.data[0] = last;

		// heap down
		let index = 0;

		const node = this.data[index];

		while (index < Math.floor(this.data.length / 2)) {
			const leftChildIndex = 2 * index + 1;

			const rightChildIndex = 2 * index + 2;

			const smallerChildIndex =
				rightChildIndex < this.data.length &&
				!this.greater(this.data[rightChildIndex], this.data[leftChildIndex])
					? rightChildIndex
					: leftChildIndex;

			if (this.greater(this.data[smallerChildIndex], node)) {
				break;
			}

			this.data[index] = this.data[smallerChildIndex];
			index = smallerChildIndex;
		}
		this.data[index] = node;
		return top;
	}
}
