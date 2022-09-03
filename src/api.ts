import axios, { AxiosInstance } from "axios";
import { IcreatePayout, IgetPayout, IgetTransaction } from "./types";
export class API {
    apiId: number;
    apiKey: string;
    secretKey: string;
    shop: number;
    request: AxiosInstance;
    constructor(params: {
        apiId: number,
        apiKey: string,
        secretKey: string,
        shop: number,
    }) {
        this.apiId = params.apiId;
        this.apiKey = params.apiKey;
        this.secretKey = params.secretKey;
        this.shop = params.shop;
        this.request = axios.create({
            baseURL: "https://payok.io/api",
            timeout: 1000,
            headers: {
                "User-Agent": "kravetsone/payok",
                "Content-type":
                    "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            data: {
                API_ID: this.apiId,
                API_KEY: this.apiKey,
                shop: this.shop,
            },
        });
        this.request.interceptors.response.use(function (response) {
            if (response.data.status == "error") return Promise.reject(response.data);
            return response;
        });
    }
    /**
     * [Получение баланса аккаунта.](https://payok.io/cabinet/documentation/doc_api_balance)
     *
     */
    async getBalance() {
        return await this.request.post("/balance").then(response => response.data);
    }
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_transaction)
     * @param {number} params.payment ID платежа в вашей системе.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    async getTransaction(params: IgetTransaction) {
        return await this.request.post("/transaction", params).then(response => response.data);
    }
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_payout)
     * @param {number} params.payment_id ID выплаты в системе Payok.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    async getPayout(params: IgetPayout) {
        return await this.request.post("/payout", params).then(response => response.data);
    }
    /**
     * [Создание выплаты.](https://payok.io/cabinet/documentation/doc_api_payout_create)
     * @param {number} params.amount Сумма выплаты. Обязателен.
     * @param {string} params.method [Способ оплаты.](https://payok.io/cabinet/documentation/doc_methods.php) Обязателен.
     * @param {string} params.reciever Реквезиты на которые придёт выплата. Обязателен.
     * @param {string} params.comission_type  Комиссия с баланса - `balance`, а если с выплаты - `payment`. Обязателен.
     * @param {number} params.webhook_url URL вебхука для отправки статуса выплаты.
     */
    async createPayout(params: IcreatePayout) {
        return await this.request.post("/payout_create", params).then(response => response.data);
    }
}