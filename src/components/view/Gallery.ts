import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data?: { items: HTMLElement[] }): HTMLElement {
        if (data) {
            this.container.replaceChildren(...data.items);
        }
        return this.container;
    }
}