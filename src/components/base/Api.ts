type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json();
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText))
                .catch(() => Promise.reject(response.statusText));
        }
    }

    get<T extends object>(uri: string) {
        const fullUrl = this.baseUrl + uri;
        return fetch(fullUrl, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        const fullUrl = this.baseUrl + uri;
        return fetch(fullUrl, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}