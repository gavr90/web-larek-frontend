import { IItemData, ItemCategory } from '../types';
import { IEvents, EventEmitter } from '../components/base/Events';

export class ItemData extends EventEmitter implements IItemData {
	id: string;
	image: string;
	title: string;
	category: ItemCategory;
	price: number | null;
	description: string;
	catalog: IItemData[];

	constructor(data: Partial<IItemData>, protected events: IEvents) {
		super();
		Object.assign(this, data);
	}

	getItem(id: string) {
		return this.catalog.find((item) => item.id === id);
	}

	setCatalog(items: IItemData[]) {
		this.catalog = items;
		this.events.emit('items:change');
	}
}
