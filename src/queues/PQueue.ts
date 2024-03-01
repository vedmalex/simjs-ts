import type { PQueueRequest } from "../request/PQueueRequest";
import { Model } from "../sim/Model";

export class PQueue extends Model {
	data: Array<PQueueRequest>;
	order = 0;
	constructor(name?: string) {
		super(name);
		this.data = [];
		this.order = 0;
	}

	greater(ro1: PQueueRequest, ro2: PQueueRequest) {
		if (ro1.deliverAt > ro2.deliverAt) return true;
		if (ro1.deliverAt === ro2.deliverAt) return ro1.order > ro2.order;
		return false;
	}

	insert(ro: PQueueRequest) {
		ro.order = this.order++;

		let index = this.data.length;

		this.data.push(ro);

		// insert into data at the end
		const a = this.data as Array<PQueueRequest>;

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
		const a = this.data as Array<PQueueRequest>;

		let len = a.length;

		if (len <= 0) {
			return null;
		}
		if (len === 1) {
			return this.data.pop();
		}
		const top = a[0];

		// move the last node up
		// biome-ignore lint/style/noNonNullAssertion: by condition there is more than one items
		a[0] = a.pop()!;
		len--;

		// heap down
		let index = 0;

		const node = a[index];

		while (index < Math.floor(len / 2)) {
			const leftChildIndex = 2 * index + 1;

			const rightChildIndex = 2 * index + 2;

			const smallerChildIndex =
				rightChildIndex < len &&
				!this.greater(a[rightChildIndex], a[leftChildIndex])
					? rightChildIndex
					: leftChildIndex;

			if (this.greater(a[smallerChildIndex], node)) {
				break;
			}

			a[index] = a[smallerChildIndex];
			index = smallerChildIndex;
		}
		a[index] = node;
		return top;
	}
}
