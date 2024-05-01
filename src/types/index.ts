import { IEvents } from '../components/base/Events';

// DATA - модель данных

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface ILarekApi {
	readonly cdn: string;
	getItemsList(): Promise<IItemData[]>;
	sendOrder(data: IOrderData): Promise<ISuccessData>;
}

export interface IItemData extends IEvents {
	id: string;
	image: string;
	title: string;
	category: ItemCategory;
	price: number | null;
	description: string;
	getItem(id: string): IItemData;
}

export enum ItemCategory {
	Soft = "софт-скил",
	Hard = "хард-скил",
	Button = "кнопка",
	Other = "другое",
	Additional = "дополнительное"
}

export type CategoryMap = {
  [key in ItemCategory]: string;
};

export interface IBasketData {
	itemList: IItemData[];
	totalPrice: number | undefined;
	itemsIdList: string[];
  addItem(item: IItemData): number;
	removeItem(id: string): void;
	clearBasket(): void;
}

export interface IPaymentData {
	payment: string;
	address: string;
}

export interface IContactsData {
	email: string;
	phone: string;
}

export type IFormData = IPaymentData & IContactsData;

export interface IOrderData extends IFormData {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IOrderModel {
	order: IOrderData;
	formErrors: FormErrors;	
	addItems(idList: string[]): string[];
	addTotal(total: number): number;
	setOrderField(field: keyof IFormData, value: string): void;
	validateOrder(): boolean;
}

export type ISuccessData = {
	id: string;
	total: number;
};

// VIEW - отображение

export interface IItemView extends IEvents, IItemData {
	_title: HTMLElement;
	_price: HTMLElement;
	_image?: HTMLImageElement;
	_category?: HTMLElement;
	_description: HTMLElement;
	_button: HTMLButtonElement;
	setUnavalable(): void;
	setCategoryStyle(category: ItemCategory, map: CategoryMap): void;
}

export interface IPageView extends IEvents {
	_counter: HTMLElement;
	_catalog: HTMLElement;
	_wrapper: HTMLElement;
	_basket: HTMLElement;
}

export interface IModalContent {
	content: HTMLElement;
}

export interface IModalView extends IEvents, IModalContent {
	_content: HTMLElement;
	_closeButton: HTMLButtonElement;
	open(): void;
	close(): void;
	render(content: HTMLElement): HTMLElement;
}

export interface IBasketView extends IEvents, IBasketData {
	_items: HTMLElement[];
	_list: HTMLElement;
	_total: HTMLElement;
	_button: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IFormView<T> {
	_submit: HTMLButtonElement;
	_errors: HTMLElement;
	onInputChange(field: keyof T, value: string): void;
	render(state: Partial<T> & IFormState): HTMLFormElement;
}

export interface ISuccessView extends IEvents, ISuccessData {
	_total: HTMLElement;
	_button: HTMLButtonElement;
}
