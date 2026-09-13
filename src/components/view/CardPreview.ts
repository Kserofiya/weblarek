import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CardPreview extends Component<IProduct & { inBasket: boolean }> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;
        this._category = container.querySelector('.card__category')!;
        this._image = container.querySelector('.card__image')!;
        this._description = container.querySelector('.card__text')!;
        this._button = container.querySelector('.card__button')!;

        this._button.addEventListener('click', () => {
            if (this._button.disabled) return;
            const event = this._button.textContent === 'Удалить из корзины'
                ? 'card:remove'
                : 'card:buy';
            this.events.emit(event, { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
        
        if (value === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        } else {
            this._button.disabled = false;
        }
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) this._category.classList.add(modifier);
    }

    set image(value: string) {
        const fullUrl = `${CDN_URL}${value}`;
        this.setImage(this._image, fullUrl, this._title.textContent || '');
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set inBasket(value: boolean) {
        if (this._button.disabled) return;
        this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
    }
}