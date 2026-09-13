import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<{
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._price = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(value: HTMLElement[]) {
        this._list.replaceChildren(...value);
    }

    set total(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}