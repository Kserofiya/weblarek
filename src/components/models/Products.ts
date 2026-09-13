import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('products:changed');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('product:selected');
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}