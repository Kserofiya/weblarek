import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._content = container.querySelector('.modal__content')!;
        this._closeButton = container.querySelector('.modal__close')!;

        this._closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.events.emit('modal:close');
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
    }

    render(data?: { content: HTMLElement }): HTMLElement {
        if (data) {
            this._content.replaceChildren(data.content);
        }
        return this.container;
    }
}