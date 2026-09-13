import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<IProduct & { buttonText: string; buttonDisabled: boolean }> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected onAction: () => void) {
        super(container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        this._button.addEventListener('click', () => {
            if (this._button.disabled) return;
            this.onAction();
        });
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