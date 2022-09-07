/// <reference types="node" />
import { IGetPaymentLink } from "./types";
import { API } from "./api";
import EventEmitter from "events";
declare class Emitter extends EventEmitter {
}
export declare class PAYOK {
    apiId: number;
    apiKey: string;
    secretKey: string;
    shop: number;
    cache: Map<any, any>;
    api: API;
    events: Emitter;
    /**
     *
     * @param {number} params.apiId Идентификатор вашего API ключа.
     * @param {number} params.apiKey Ваш API ключ.
     * @param {string} params.secretKey Секретный ключ. Используется для создания и проверки поддписи.
     * @param {number} params.shop Идентификатор вашего проекта.
     *
     */
    constructor(params: {
        apiId: number;
        apiKey: string;
        secretKey: string;
        shop: number;
    });
    generateSignature(params: any, type?: "paymentLink"): string;
    /**
     * Создание ссылки на форму оплаты
     * @param {float} params.amount Сумма заказа. Обязателен.
     * @param {string} params.desc Название или описание товара. Обязателен.
     * @param {any} params.custom.* Ваш параметр, который вы хотите передать в уведомлении (любое количество).
     * @param {string} params.payment Номер заказа, уникальный в вашей системе (если не укажите, то он заполнится автоматически), до 16 символов. (a-z0-9-_)
     * @param {string} params.currency Валюта (RUB - Рубли, UAH - Гривны, USD - Доллары, EUR - Евро, RUB2 - Рубли, но альтернативный шлюз). По умолчанию RUB.
     * @param {string} params.email Электронна почта покупателя.
     * @param {string} params.success_url Ссылка для переадресации после оплаты.
     * @param {string} params.method Способ оплаты
     * @param {string} params.lang Язык интерфейса. RU или EN (Если не указан, берется язык браузера)
     *
     *
     */
    getPaymentLink(params: IGetPaymentLink): {
        payUrl: string;
        paymentId: string;
    };
    /**
     * Раскрытие сервера (вебхука) и принятие платежей.
     * @param {number} port Порт, на котором создать вебхук. Обязателен
     * @param {string} path Путь, на котором будет доступен вебхук.
     */
    createWebhook(port: number, path?: string): Promise<string>;
}
export * from "./types";
export declare function generateUUID(): string;
