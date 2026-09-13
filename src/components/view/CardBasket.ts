import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct & { index: number }> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;
        this._index = container.querySelector('.basket__item-index')!;
        this._deleteButton = container.querySelector('.basket__item-delete')!;

        this._deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this.container.dataset.id });
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

    set index(value: number) {
        this._index.textContent = String(value);
    }
}