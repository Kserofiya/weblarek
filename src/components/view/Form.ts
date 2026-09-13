import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T & { valid: boolean; errors: string[] }> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string[]) {
        this._errors.textContent = value.join(', ');
    }
}