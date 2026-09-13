import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T & { valid: boolean; errors: string[] }> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errors = container.querySelector('.form__errors')!;

        container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('form:change', { field: target.name, value: target.value });
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string[]) {
        this._errors.textContent = value.join(', ');
    }
}