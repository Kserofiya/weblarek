import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

type CardPreviewState = Omit<IProduct, 'image'> & {
    image: { src: string; alt: string };
    buttonText: string;
    buttonDisabled: boolean;
};

export class CardPreview extends Card<CardPreviewState> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        this._button.addEventListener('click', () => this.events.emit('card:action'));
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) this._category.classList.add(modifier);
    }

    set image(value: { src: string; alt: string }) {
        this.setImage(this._image, value.src, value.alt);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}