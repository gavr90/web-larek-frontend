import { IItemData, IItemCatalogData } from '../types';
import { IEvents } from '../components/base/Events';

export class ItemData implements IItemCatalogData {
	catalog: IItemData[];

	constructor(data: Partial<IItemData>, protected events: IEvents) {
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
