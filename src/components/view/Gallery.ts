import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}