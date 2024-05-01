import { Component } from './base/Component';
import { ISuccessView } from '../types';
import { ensureElement } from '../utils/utils';

interface ISuccessActions {
	onClick: () => void;
}

export class SuccessView extends Component<ISuccessView> {
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
