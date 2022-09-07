import Fastify from "fastify";
const fastify = Fastify();
import { createHash, randomBytes } from "crypto";
import { stringify, parse } from "qs";
import { IGetPaymentLink, IPaymentHandler } from "./types";
import { API } from "./api";
import EventEmitter from "events";
class Emitter extends EventEmitter { };
export class PAYOK {
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
        apiId: number,
        apiKey: string,
        secretKey: string,
        shop: number,
    }) {
        this.apiId = params.apiId;
        this.apiKey = params.apiKey;
        this.secretKey = params.secretKey;
        this.shop = params.shop;
        this.events = new Emitter();
        this.cache = new Map();
        this.api = new API(params);
    }
    generateSignature(params: any, type?: "paymentLink") {
        return type == "paymentLink"
            ? createHash("md5")
                .update(
                    `${params.amount}|${params.payment}|${this.shop}|${params.currency || "RUB"
                    }|${params.desc}|${this.secretKey}`
                )
                .digest("hex")
            : createHash("md5")
                .update(
                    `${this.secretKey}|${params.desc}|${params.currency || "RUB"
                    }|${this.shop}|${params.payment_id}|${params.amount}`
                )
                .digest("hex");
    }
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
    getPaymentLink(params: IGetPaymentLink) {
        const paymentId = params.payment || generateUUID();
        return {
            payUrl: `https://payok.io/pay?${stringify({ sign: this.generateSignature(Object.assign({ payment: paymentId }, params), "paymentLink"), shop: this.shop, payment: paymentId, amount: params.amount, desc: params.desc, currency: params.currency, email: params.email, success_url: params.success_url, method: params.method, lang: params.lang, ...params.custom })
                }`,
            paymentId,
        };
    }
    /**
     * Раскрытие сервера (вебхука) и принятие платежей.
     * @param {number} port Порт, на котором создать вебхук. Обязателен
     * @param {string} path Путь, на котором будет доступен вебхук.
     */
    async createWebhook(port: number, path?: string) {
        fastify.addContentTypeParser("*", function (req, body, done) {
            var data = "";
            body.on("data", (chunk) => {
                data += chunk;
            });
            body.on("end", () => {
                done(null, data);
            });
        });
        fastify.addContentTypeParser(
            "application/x-www-form-urlencoded",
            { parseAs: "buffer", bodyLimit: 1048576 },
            (req, body, done) => {
                done(null, parse(body.toString()));
            }
        );
        fastify.post(path || "/", async (req: any, res) => {
            if (req.body?.sign !== this.generateSignature(req.body))
                return res.status(400).send("NO");
            res.status(200).send("OK");
            this.events.emit("payment", req.body);
        });
        return fastify.listen({ port, host: "::" });
    }
}
export * from "./types";
const cache = new Map<number, string>();
function byteToString(byte: number): string {
    const cached = cache.get(byte);
    if (typeof cached === "string") return cached;

    const value = byte.toString(16).padStart(2, "0");
    cache.set(byte, value);
    return value;
}
export function generateUUID(): string {
    const bytes = randomBytes(16);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const plain = Array.from(bytes)
        .map((byte) => byteToString(byte))
        .join("");

    return (
        plain.slice(0, 5) +
        "-" +
        plain.slice(4, 8) +
        "-" +
        plain.slice(8, 13)
    );
};