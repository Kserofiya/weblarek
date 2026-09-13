import { IApi } from '../types';
import { IProductListResponse, IOrder, IOrderResponse } from '../types';

export class AppApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProducts(): Promise<IProductListResponse> {
        return this._api.get<IProductListResponse>('/product');
    }

    postOrder(order: IOrder): Promise<IOrderResponse> {
        return this._api.post<IOrderResponse>('/order', order);
    }
}