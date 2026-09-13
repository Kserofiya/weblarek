import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;

        this._emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email', { email: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone', { phone: this._phoneInput.value });
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}