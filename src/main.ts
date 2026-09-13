import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/Events';

import { API_URL } from './utils/constants';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Modal } from './components/view/Modal';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
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

// ============================================
// 2. ПОИСК ЭЛЕМЕНТОВ РАЗМЕТКИ
// ============================================

const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// ============================================
// 3. СОЗДАНИЕ КОМПОНЕНТОВ ПРЕДСТАВЛЕНИЯ
// ============================================

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

// Храним текущие формы, чтобы обновлять их
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// ============================================
// 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function createCardCatalog(product: IProduct): HTMLElement {
    const fragment = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
    const container = fragment.firstElementChild as HTMLElement;
    const card = new CardCatalog(container, events);
    return card.render(product);
}

function createCardPreview(product: IProduct, inBasket: boolean): HTMLElement {
    const fragment = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    const container = fragment.firstElementChild as HTMLElement;
    const card = new CardPreview(container, events);
    return card.render({ ...product, inBasket });
}

function createCardBasket(product: IProduct, index: number): HTMLElement {
    const fragment = cardBasketTemplate.content.cloneNode(true) as DocumentFragment;
    const container = fragment.firstElementChild as HTMLElement;
    const card = new CardBasket(container, events);
    return card.render({ ...product, index });
}

// Обновление формы заказа
function updateOrderForm() {
    if (!currentOrderForm) return;
    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    const errorMessages = Object.values(errors).filter(Boolean) as string[];

    // Для первой формы валидны только payment и address
    const orderErrors = errorMessages.filter(msg => 
        msg.includes('оплат') || msg.includes('адрес')
    );

    currentOrderForm.render({
        payment: data.payment,
        address: data.address,
        valid: orderErrors.length === 0,
        errors: orderErrors
    });
}

// Обновление формы контактов
function updateContactsForm() {
    if (!currentContactsForm) return;
    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    const errorMessages = Object.values(errors).filter(Boolean) as string[];

    // Для второй формы валидны только email и phone
    const contactsErrors = errorMessages.filter(msg => 
        msg.includes('email') || msg.includes('телефон')
    );

    currentContactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: contactsErrors.length === 0,
        errors: contactsErrors
    });
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
    const card = createCardPreview(product, inBasket);
    modal.render({ content: card });
    modal.open();
});

events.on('basket:changed', () => {
    header.render({ counter: basketModel.getCount() });
});

// ============================================
// 6. ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
// ============================================

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) productsModel.setSelectedProduct(product);
});

events.on('card:buy', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product && product.price !== null) {
        basketModel.addItem(product);
        modal.close();
    }
});

events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
    const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketList = basketElement.querySelector('.basket__list') as HTMLElement;
    const basketPrice = basketElement.querySelector('.basket__price') as HTMLElement;
    const basketButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;

    const items = basketModel.getItems();
    const cards = items.map((item, index) => createCardBasket(item, index + 1));

    if (cards.length > 0) {
        basketList.append(...cards);
        basketPrice.textContent = `${basketModel.getTotalPrice()} синапсов`;
        basketButton.disabled = false;
    } else {
        basketList.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        basketPrice.textContent = '0 синапсов';
        basketButton.disabled = true;
    }

    basketButton.addEventListener('click', () => {
        events.emit('order:open');
    });

    modal.render({ content: basketElement });
    modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    events.emit('basket:open');
});

// Открытие формы заказа
events.on('order:open', () => {
    const orderElement = orderTemplate.content.cloneNode(true) as HTMLElement;
    const formElement = orderElement.querySelector('.form') as HTMLFormElement;
    currentOrderForm = new OrderForm(formElement, events);
    currentContactsForm = null;

    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    const errorMessages = Object.values(errors).filter(Boolean) as string[];
    const orderErrors = errorMessages.filter(msg => 
        msg.includes('оплат') || msg.includes('адрес')
    );

    modal.render({ 
        content: currentOrderForm.render({
            payment: data.payment,
            address: data.address,
            valid: orderErrors.length === 0,
            errors: orderErrors
        })
    });
    modal.open();
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
    updateOrderForm();
    updateContactsForm();
});

// Выбор способа оплаты
events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
});

// Ввод адреса
events.on('order:address', (data: { address: string }) => {
    buyerModel.setAddress(data.address);
});

// Ввод email
events.on('contacts:email', (data: { email: string }) => {
    buyerModel.setEmail(data.email);
});

// Ввод телефона
events.on('contacts:phone', (data: { phone: string }) => {
    buyerModel.setPhone(data.phone);
});

// Отправка формы заказа (первый шаг)
events.on('order:submit', () => {
    const contactsElement = contactsTemplate.content.cloneNode(true) as HTMLElement;
    const formElement = contactsElement.querySelector('.form') as HTMLFormElement;
    currentContactsForm = new ContactsForm(formElement, events);

    const data = buyerModel.getData();
    const errors = buyerModel.validate();
    const errorMessages = Object.values(errors).filter(Boolean) as string[];
    const contactsErrors = errorMessages.filter(msg => 
        msg.includes('email') || msg.includes('телефон')
    );

    modal.render({ 
        content: currentContactsForm.render({
            email: data.email,
            phone: data.phone,
            valid: contactsErrors.length === 0,
            errors: contactsErrors
        })
    });
});

// Отправка формы контактов (второй шаг)
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderData = {
        ...buyerData,
        payment: buyerData.payment!,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };

    appApi.postOrder(orderData)
        .then(() => {
            basketModel.clear();
            buyerModel.clear();
            currentOrderForm = null;
            currentContactsForm = null;
            modal.close();
            
            const successElement = successTemplate.content.cloneNode(true) as HTMLElement;
            const successPrice = successElement.querySelector('.order-success__description') as HTMLElement;
            successPrice.textContent = `Списано ${orderData.total} синапсов`;
            
            const successButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
            successButton.addEventListener('click', () => {
                modal.close();
            });

            modal.render({ content: successElement });
            modal.open();
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
        });
});

events.on('modal:close', () => {
    modal.close();
    currentOrderForm = null;
    currentContactsForm = null;
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