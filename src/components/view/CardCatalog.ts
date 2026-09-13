import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CardCatalog extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;
        this._category = container.querySelector('.card__category')!;
        this._image = container.querySelector('.card__image')!;

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
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
}