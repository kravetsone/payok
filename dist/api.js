"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const axios_1 = require("axios");
const qs_1 = require("qs");
class API {
    constructor(params) {
        this.apiId = params.apiId;
        this.apiKey = params.apiKey;
        this.secretKey = params.secretKey;
        this.shop = params.shop;
        this.request = new axios_1.Axios({
            baseURL: "https://payok.io/api",
            headers: {
                "User-Agent": "kravetsone/payok",
                "Content-type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            transformRequest: [function (data, headers) {
                    return (0, qs_1.stringify)(Object.assign({
                        API_ID: params.apiId,
                        API_KEY: params.apiKey,
                        shop: params.shop,
                    }, Object.assign({}, data || {})));
                }],
        });
        this.request.interceptors.response.use((response) => {
            if (response.data.status == "error")
                return Promise.reject(response.data);
            return response;
        });
    }
    /**
     * [Получение баланса аккаунта.](https://payok.io/cabinet/documentation/doc_api_balance)
     *
     */
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request.post("/balance").then(response => response.data);
        });
    }
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_transaction)
     * @param {number} params.payment ID платежа в вашей системе.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    getTransactions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request.post("/transaction", params).then(response => response.data);
        });
    }
    /**
     * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_payout)
     * @param {number} params.payment_id ID выплаты в системе Payok.
     * @param {number} params.offset Отступ, пропуск указанного количества строк.
     */
    getPayouts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request.post("/payout", params).then(response => response.data);
        });
    }
    /**
     * [Создание выплаты.](https://payok.io/cabinet/documentation/doc_api_payout_create)
     * @param {number} params.amount Сумма выплаты. Обязателен.
     * @param {string} params.method [Способ оплаты.](https://payok.io/cabinet/documentation/doc_methods.php) Обязателен.
     * @param {string} params.reciever Реквезиты на которые придёт выплата. Обязателен.
     * @param {string} params.comission_type  Комиссия с баланса - `balance`, а если с выплаты - `payment`. Обязателен.
     * @param {number} params.webhook_url URL вебхука для отправки статуса выплаты.
     */
    createPayout(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request.post("/payout_create", params).then(response => response.data);
        });
    }
}
exports.API = API;
