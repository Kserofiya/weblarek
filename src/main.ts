import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/Events';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Modal } from './components/view/Modal';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { BasketView } from './components/view/BasketView';
import { SuccessView } from './components/view/SuccessView';
import { IProduct, TPayment } from './types';

// ============================================
// 1. НАСТРОЙКА API И СОЗДАНИЕ МОДЕЛЕЙ
// ============================================

const api = new Api(API_URL);
const appApi = new AppApi(api);
const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Приводим модели в исходное состояние
basketModel.clear();
buyerModel.clear();

// ============================================
// 2. ПОИСК ЭЛЕМЕНТОВ РАЗМЕТКИ
// ============================================

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

// ============================================
// 3. СОЗДАНИЕ КОМПОНЕНТОВ ПРЕДСТАВЛЕНИЯ
// ============================================

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

// Статичные компоненты — создаются один раз
const cardPreview = new CardPreview(
    cloneTemplate<HTMLElement>('#card-preview'),
    () => events.emit('card:action')
);

const basketView = new BasketView(
    cloneTemplate<HTMLElement>('#basket'),
    events
);

const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>('#order'),
    events
);

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>('#contacts'),
    events
);

const successView = new SuccessView(
    cloneTemplate<HTMLElement>('#success'),
    events
);

// ============================================
// 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function createCardCatalog(product: IProduct): HTMLElement {
    const card = new CardCatalog(
        cloneTemplate<HTMLElement>('#card-catalog'),
        () => events.emit('card:select', { id: product.id })
    );
    return card.render({
        ...product,
        image: `${CDN_URL}${product.image}`
    });
}

function createCardBasket(product: IProduct, index: number): HTMLElement {
    const card = new CardBasket(
        cloneTemplate<HTMLElement>('#card-basket'),
        () => events.emit('basket:remove', { id: product.id })
    );
    return card.render({
        ...product,
        index,
        image: `${CDN_URL}${product.image}`
    });
}

// Получение ошибок по ключам
function getOrderErrors(): string[] {
    const errors = buyerModel.validate();
    const result: string[] = [];
    if (errors.payment) result.push(errors.payment);
    if (errors.address) result.push(errors.address);
    return result;
}

function getContactsErrors(): string[] {
    const errors = buyerModel.validate();
    const result: string[] = [];
    if (errors.email) result.push(errors.email);
    if (errors.phone) result.push(errors.phone);
    return result;
}

// ============================================
// 5. ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ
// ============================================

events.on('products:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(createCardCatalog);
    gallery.render({ items: cards });
});

events.on('product:selected', () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    const inBasket = basketModel.isProductInBasket(product.id);
    const buttonText = product.price === null
        ? 'Недоступно'
        : inBasket
            ? 'Удалить из корзины'
            : 'Купить';
    const buttonDisabled = product.price === null;

    modal.render({
        content: cardPreview.render({
            ...product,
            image: `${CDN_URL}${product.image}`,
            buttonText,
            buttonDisabled
        })
    });
    modal.open();
});

events.on('basket:changed', () => {
    const items = basketModel.getItems();
    const cards = items.map((item, index) => createCardBasket(item, index + 1));
    header.render({ counter: basketModel.getCount() });
    basketView.render({
        items: cards,
        total: basketModel.getTotalPrice(),
        buttonDisabled: basketModel.getCount() === 0
    });
});

events.on('buyer:changed', () => {
    const data = buyerModel.getData();
    const orderErrors = getOrderErrors();
    const contactsErrors = getContactsErrors();

    orderForm.render({
        payment: data.payment,
        address: data.address,
        valid: orderErrors.length === 0,
        errors: orderErrors
    });

    contactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: contactsErrors.length === 0,
        errors: contactsErrors
    });
});

// ============================================
// 6. ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
// ============================================

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) productsModel.setSelectedProduct(product);
});

events.on('card:action', () => {
    const product = productsModel.getSelectedProduct();
    if (!product || product.price === null) return;

    if (basketModel.isProductInBasket(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    modal.close();
});

events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
    modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('order:open', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
});

events.on('order:address', (data: { address: string }) => {
    buyerModel.setAddress(data.address);
});

events.on('contacts:email', (data: { email: string }) => {
    buyerModel.setEmail(data.email);
});

events.on('contacts:phone', (data: { phone: string }) => {
    buyerModel.setPhone(data.phone);
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
});

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderData = {
        ...buyerData,
        payment: buyerData.payment!,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };

    appApi.postOrder(orderData)
        .then((response) => {
            basketModel.clear();
            buyerModel.clear();
            modal.render({ content: successView.render({ total: response.total }) });
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
        });
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
    modal.close();
});

// ============================================
// 7. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
// ============================================

appApi.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });