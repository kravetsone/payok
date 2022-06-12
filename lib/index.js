const nodeFetch = require("node-fetch");
const fastify = require("fastify")();
const crypto = require("crypto");
const qs = require("qs");
const methods = {
    getBalance: "balance",
    getTransactions: "transaction",
    getPayouts: "payout",
    createPayout: "payout_create",
};
class PAYOK {
    /**
     *
     * @param {number} apiId Идентификатор вашего API ключа.
     * @param {number} apiKey Ваш API ключ.
     * @param {string} secretKey Секретный ключ. Используется для создания и проверки поддписи.
     * @param {number} shop Идентификатор вашего проекта.
     *
     */
    constructor(params) {
        this.apiId = params.apiId;
        this.apiKey = params.apiKey;
        this.secretKey = params.secretKey;
        this.shop = params.shop;
        this.cache = new Map();
        this.api = new Proxy(
            {},
            {
                get:
                    (obj, prop) =>
                    async (params = {}) => {
                        const method = methods[prop];
                        params = Object.assign(
                            {
                                API_ID: this.apiId,
                                API_KEY: this.apiKey,
                                shop: this.shop,
                            },
                            params
                        );
                        const body = qs.stringify(params);
                        const response = await nodeFetch(
                            "https://payok.io/api/" + method,
                            {
                                method: "POST",
                                headers: {
                                    "Content-type":
                                        "application/x-www-form-urlencoded",
                                    Accept: "application/json",
                                },
                                body,
                            }
                        );
                        return response.json();
                    },
            }
        );
    }
    generateSignature(params, type) {
        return type == "paymentLink"
            ? crypto
                  .createHash("md5")
                  .update(
                      `${params.amount}|${params.payment}|${this.shop}|${
                          params.currency || "RUB"
                      }|${params.desc}|${this.secretKey}`
                  )
                  .digest("hex")
            : crypto
                  .createHash("md5")
                  .update(
                      `${this.secretKey}|${params.desc}|${
                          params.currency || "RUB"
                      }|${this.shop}|${params.payment_id}|${params.amount}`
                  )
                  .digest("hex");
    }
    byteToString(byte) {
        const cached = this.cache.get(byte);
        if (typeof cached === "string") return cached;

        const value = byte.toString(16).padStart(2, "0");
        this.cache.set(byte, value);
        return value;
    }
    /**
     * Создание ссылки на форму оплаты
     * @param {float} amount Сумма заказа. Обязателен.
     * @param {string} desc Название или описание товара. Обязателен.
     * @param {string} currency Валюта (RUB - Рубли, UAH - Гривны, USD - Доллары, EUR - Евро, RUB2 - Рубли, но альтернативный шлюз). По умолчанию RUB.
     * @param {string} email Электронна почта покупателя.
     * @param {string} success_url Ссылка для переадресации после оплаты.
     * @param {string} method Способ оплаты
     * @param {string} lang Язык интерфейса. RU или EN (Если не указан, берется язык браузера)
     * @param {any} custom Ваш параметр, который вы хотите передать в уведомлении (любое количество).
     *
     *
     */
    async getPaymentLink(params) {
        const generateUUID = () => {
            const bytes = crypto.randomBytes(16);

            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;

            const plain = Array.from(bytes)
                .map((byte) => this.byteToString(byte))
                .join("");

            return (
                plain.slice(0, 5) +
                "-" +
                plain.slice(4, 8) +
                "-" +
                plain.slice(8, 13)
            );
        };
        params.payment = generateUUID();
        params.shop = this.shop;
        params.sign = this.generateSignature(params, "paymentLink");
        const stringified = qs.stringify(params);
        return {
            payUrl: `https://payok.io/pay?${stringified}`,
            paymentId: params.payment,
        };
    }
    /**
     * Раскрытие сервера (вебхука) и принятие платежей.
     * @param {number} port Порт на котором создать вебхук.
     * @param {function} handler Функция которая выполниться при переводе после проверки подписи.
     */
    async createWebhook(port, handler) {
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
                done(null, qs.parse(body.toString()));
            }
        );
        fastify.post("/", async (req, res) => {
            req.body = Object.assign({}, req.body);
            if (req.body.sign !== this.generateSignature(req.body))
                return res.status(400).send("NO");
            res.status(200).send("OK");
            await handler(req.body);
        });
        return await fastify.listen({ port, host: "::" });
    }
}
exports.PAYOK = PAYOK;
