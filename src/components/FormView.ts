import {
	IPaymentData,
	IContactsData,
	IFormState,
	IPaymentFormView,
} from '../types';
import { Component } from './base/Component';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

type SelectActions = {
	onClick: (value: string) => void;
};

abstract class FormView<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:fieldChange`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export class PaymentFormView
	extends FormView<IPaymentData>
	implements SelectActions, IPaymentFormView
{
	protected _buttons: HTMLButtonElement[];
	onClick: (value: string) => void;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions?: SelectActions
	) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				actions?.onClick?.(button.name);
			});
		});
	}

	set selected(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	removeSelection() {
		this._buttons.forEach((button) => {
			this.removeClass(button, 'button_alt-active');
		});
	}
}

export class ContactsFormView extends FormView<IContactsData> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
