import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

type CardCatalogState = Omit<IProduct, 'image'> & {
    image: { src: string; alt: string };
};

export class CardCatalog extends Card<CardCatalogState> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, protected onSelect: () => void) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        container.addEventListener('click', () => this.onSelect());
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
}