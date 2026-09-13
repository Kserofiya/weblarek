import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _phone: string = '';
    private _email: string = '';

    constructor(protected events: IEvents) {}

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('buyer:changed');
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('buyer:changed');
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.events.emit('buyer:changed');
    }

    setEmail(email: string): void {
        this._email = email;
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._phone = '';
        this._email = '';
        this.events.emit('buyer:changed');
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if (!this._payment) errors.payment = 'Не выбран способ оплаты';
        if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this._email.trim()) errors.email = 'Укажите email';
        if (!this._phone.trim()) errors.phone = 'Укажите телефон';
        return errors;
    }
}