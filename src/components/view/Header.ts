import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number }> {
    protected _counter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = container.querySelector('.header__basket-counter')!;
        this._basketButton = container.querySelector('.header__basket')!;

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    render(data?: { counter: number }): HTMLElement {
        if (data) this.counter = data.counter;
        return this.container;
    }
}