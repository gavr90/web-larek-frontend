import { Component } from './base/Component';
import { IBasketView } from '../types';
import { EventEmitter } from './base/Events';
import { ensureElement, createElement } from '../utils/utils';

export class BasketView extends Component<IBasketView> {
	protected _items: HTMLElement[];
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this._items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	setNumbers() {
		const indexList = this.container.querySelectorAll('.basket__item-index');
		let i = 1;
		for (let a = 0; a < indexList.length; a++) {
			indexList[a].textContent = `${i}`;
			i += 1;
		}
	}
}
