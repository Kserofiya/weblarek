import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = container.querySelector('.card__category') ?? undefined;
        this._image = container.querySelector('.card__image') ?? undefined;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    set category(value: string) {
        if (!this._category) return;
        this._category.textContent = value;
        this._category.className = 'card__category';
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) this._category.classList.add(modifier);
    }

    set image(value: string) {
        if (!this._image) return;
        this.setImage(this._image, value, this._title.textContent || '');
    }
}