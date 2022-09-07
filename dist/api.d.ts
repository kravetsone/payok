import { Axios } from "axios";
import { ICreatePayout, IGetPayout, IGetTransaction } from "./types";
export declare class API {
    apiId: number;
    apiKey: string;
    secretKey: string;
    shop: number;
    request: Axios;
    constructor(params: {
        apiId: number;
        apiKey: string;
        secretKey: string;
        shop: number;
    });
    /**
     * [Получение баланса аккаунта.](https://payok.io/cabinet/documentation/doc_api_balance)
     *
     */
    getBalance(): Promise<any>;
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_transaction)
     * @param {number} params.payment ID платежа в вашей системе.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    getTransactions(params: IGetTransaction): Promise<any>;
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_payout)
     * @param {number} params.payment_id ID выплаты в системе Payok.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    getPayouts(params: IGetPayout): Promise<any>;
    /**
     * [Создание выплаты.](https://payok.io/cabinet/documentation/doc_api_payout_create)
     * @param {number} params.amount Сумма выплаты. Обязателен.
     * @param {string} params.method [Способ оплаты.](https://payok.io/cabinet/documentation/doc_methods.php) Обязателен.
     * @param {string} params.reciever Реквезиты на которые придёт выплата. Обязателен.
     * @param {string} params.comission_type  Комиссия с баланса - `balance`, а если с выплаты - `payment`. Обязателен.
     * @param {number} params.webhook_url URL вебхука для отправки статуса выплаты.
     */
    createPayout(params: ICreatePayout): Promise<any>;
}
