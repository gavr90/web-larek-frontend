import { IEvents } from '../components/base/Events';
import {
	IBasketData,
	IFormData,
	IItemData,
	IOrderData,
	IOrderModel,
	FormErrors,
} from '../types';

export class BasketData implements IBasketData {
	itemList: IItemData[];

	constructor() {
		this.itemList = [];
	}

	get totalPrice(): number | undefined {
		return this.itemList.reduce(
			(a, c) => a + this.itemList.find((it) => it.id === c.id).price,
			0
		);
	}

	get itemsIdList(): string[] {
		return this.itemList.map(({ id }) => id);
	}

	addItem(item: IItemData) {
		return this.itemList.push(item);
	}

	removeItem(id: string) {
		this.itemList = this.itemList.filter((item) => item.id !== id);
	}

	clearBasket() {
		this.itemList.forEach((item) => {
			this.removeItem(item.id);
		});
	}
}

export class OrderData implements IOrderModel {
	order: IOrderData = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};

	constructor(data: Partial<IOrderData>, protected events: IEvents) {
		Object.assign(this, data);
	}

	addItems(idList: string[]) {
		return (this.order.items = idList);
	}

	addTotal(total: number) {
		return (this.order.total = total);
	}

	setOrderField(field: keyof IFormData, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearForm() {
		this.order.payment = '';
		this.order.address = '';
		this.order.email = '';
		this.order.phone = '';
	}
}
