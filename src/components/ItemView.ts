import { Component } from './base/Component';
import { IItemView, ItemCategory, CategoryMap } from '../types';
import { ensureElement } from '../utils/utils';

interface IItemActions {
	onClick: (event: MouseEvent) => void;
}

export class ItemView extends Component<IItemView> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IItemActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
	
	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get unavalable(): void {
		return this.setDisabled(this._button, true);
	}

  setCategoryStyle(category: ItemCategory, map: CategoryMap) {
		const modifier = map[category];
	 	this.replaceClass(this._category, this._category.classList[1], `${this._category.classList[0]}_${modifier}`)
	}
}
