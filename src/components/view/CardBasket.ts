import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card<IProduct & { index: number }> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onDelete: () => void) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this._deleteButton.addEventListener('click', () => this.onDelete());
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}