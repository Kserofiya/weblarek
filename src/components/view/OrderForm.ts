import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<{ payment: TPayment | null; address: string }> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:payment', { payment: 'card' });
        });

        this._cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:payment', { payment: 'cash' });
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:address', { address: this._addressInput.value });
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set payment(value: TPayment | null) {
        this._cardButton.classList.remove('button_alt-active');
        this._cashButton.classList.remove('button_alt-active');
        if (value === 'card') this._cardButton.classList.add('button_alt-active');
        if (value === 'cash') this._cashButton.classList.add('button_alt-active');
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}