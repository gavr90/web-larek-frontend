import { IEvents } from "../components/base/events";

// DATA

export interface IItemData {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  description: string;
  getItem(id: string): Promise<IItemData>;
  getItemsList(): Promise<IItemData[]>;
}

export interface ICartData {
  items: IItemData[];
  _totalPrice: number | null;
  _totalItems: number | null;
  addItem(id: string): IItemData[];
  removeItem(id: string): void;   
}

export interface ICustomerData {
  paymentMethod: "Онлайн" | "При получении";
  adress: string;
  email: string;
  phone: string;
}

export interface IOrderData extends ICartData, ICustomerData{
  sendOrder(data: IOrderData): Promise<IOrderResultData>;
}

export interface IOrderResultData {
  id: string;
  total: number;
}

interface IFormState {
  valid: boolean;
  errors: string[];
}

// VIEW 

export interface IItemView extends IEvents{
  id: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
  description?: string;
  render(item: IItemData): HTMLElement;
}

export interface IPageView {
  counter: number;
  catalog: HTMLElement[];
}

export interface IModalView {
  content: HTMLElement;
  open(): void;
  close(): void;
  render(content: HTMLElement): HTMLElement;
}

export interface ICartView extends IEvents{
	title: string;
  buttonText: string;
  items: IItemData[];
  total: number;
}

export interface IFormView extends IEvents{
	buttonText?: string;
  paymentMethod?: ICustomerData; 
  fieldTitle?: string | string[];
  placeholder?: string | string[];
  selectValue(selectedElement: HTMLElement): ICustomerData;
	setValue(data: ICustomerData): void;
	getValue(): ICustomerData;
	clearValue(): void;
}

export interface IOrderResultView {
	buttonText: string;
  messageResult: string;
  image: string;
  _total: number;
}
