import { IProduct } from '../../types';

export class Basket {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.isProductInBasket(product.id)) {
            this._items.push(product);
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
    }

    clear(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    isProductInBasket(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}