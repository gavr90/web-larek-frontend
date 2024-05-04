import './scss/styles.scss';
import { API_URL, CDN_URL, categoryMap } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { LarekApi } from './data/LarekApi';
import { BasketData, OrderData } from './data/OrderData';
import { ItemData } from './data/ItemData';
import { PageView } from './components/PageView';
import { ItemView } from './components/ItemView';
import { ModalView } from './components/ModalView';
import { BasketView } from './components/BasketView';
import { ContactsFormView, PaymentFormView } from './components/FormView';
import { SuccessView } from './components/SuccessView';

import { IItemData, IFormData } from './types';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const itemData = new ItemData({}, events);
const basketData = new BasketData();
const orderData = new OrderData({}, events);

// Глобальные контейнеры
const page = new PageView(document.body, events);
const modal = new ModalView(
	ensureElement<HTMLElement>('#modal-container'),
	events
);

// Части интерфейса
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentFormView(
	cloneTemplate(paymentTemplate),
	events,
	{
		onClick: (name) => {
			paymentForm.selected = name;
			orderData.setOrderField('payment', name);
		},
	}
);
const contactsForm = new ContactsFormView(
	cloneTemplate(contactsTemplate),
	events
);
const success = new SuccessView(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

// Блокировать прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокировать
events.on('modal:close', () => {
	page.locked = false;
});

// Получение лотов с сервера
api
	.getItemsList()
	.then(itemData.setCatalog.bind(itemData))
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on('items:change', () => {
	page.catalog = itemData.catalog.map((item) => {
		const card = new ItemView(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('item:select', item),
		});
		card.setCategoryStyle(item.category, categoryMap);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
	page.counter = basketData.itemList.length;
});

// Открыть карточку товара
events.on('item:select', (item: IItemData) => {
	const showItem = (item: IItemData) => {
		const card = new ItemView(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('item:buy', item),
		});
		card.setCategoryStyle(item.category, categoryMap);
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
			}),
		});
		if (basketData.itemList.includes(item)) {
			card.unavalable;
		}
	};
	showItem(item);
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// Изменились элементы корзины
events.on('basket:change', () => {
	basket.items = basketData.itemList.map((item) => {
		const itemInCart = new ItemView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('item:delete', item),
		});
		return itemInCart.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.setNumbers();
	basket.total = basketData.totalPrice;
	events.emit('items:change');
});

// Положить товар в корзину
events.on('item:buy', (item: IItemData) => {
	const selectedItem = itemData.getItem(item.id);
	basketData.addItem(selectedItem);
	events.emit('basket:change');
	modal.close();
});

// Удалить товар из корзины
events.on('item:delete', (item: IItemData) => {
	basketData.removeItem(item.id);
	events.emit('basket:change');
});

// Открыть форму оплаты
events.on('order:open', () => {
	orderData.addItems(basketData.itemsIdList);
	orderData.addTotal(basketData.totalPrice);
	modal.render({
		content: paymentForm.render({
			address: orderData.order.address,
			valid: !!orderData.order.payment && !!orderData.order.address,
			errors: [],
		}),
	});
});

// Открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: orderData.order.phone,
			email: orderData.order.email,
			valid: !!orderData.order.phone && !!orderData.order.email,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IFormData>) => {
	const { payment, address, email, phone } = errors;
	paymentForm.valid = !payment && !address;
	paymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/\..*:fieldChange/,
	(data: { field: keyof IFormData; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

// Заказ отправлен
events.on('contacts:submit', () => {
	api
		.sendOrder(orderData.order)
		.then((result) => {
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			basketData.clearBasket();
			events.emit('basket:change');
			orderData.clearForm();
			paymentForm.removeSelection();
		})
		.catch((err) => {
			console.error(err);
		});
});
