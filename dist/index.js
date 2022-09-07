"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = exports.PAYOK = void 0;
const fastify_1 = __importDefault(require("fastify"));
const fastify = (0, fastify_1.default)();
const crypto_1 = require("crypto");
const qs_1 = require("qs");
const api_1 = require("./api");
const events_1 = __importDefault(require("events"));
class Emitter extends events_1.default {
}
;
class PAYOK {
    /**
     *
     * @param {number} params.apiId Идентификатор вашего API ключа.
     * @param {number} params.apiKey Ваш API ключ.
     * @param {string} params.secretKey Секретный ключ. Используется для создания и проверки поддписи.
     * @param {number} params.shop Идентификатор вашего проекта.
     *
     */
    constructor(params) {
        this.apiId = params.apiId;
        this.apiKey = params.apiKey;
        this.secretKey = params.secretKey;
        this.shop = params.shop;
        this.events = new Emitter();
        this.cache = new Map();
        this.api = new api_1.API(params);
    }
    generateSignature(params, type) {
        return type == "paymentLink"
            ? (0, crypto_1.createHash)("md5")
                .update(`${params.amount}|${params.payment}|${this.shop}|${params.currency || "RUB"}|${params.desc}|${this.secretKey}`)
                .digest("hex")
            : (0, crypto_1.createHash)("md5")
                .update(`${this.secretKey}|${params.desc}|${params.currency || "RUB"}|${this.shop}|${params.payment_id}|${params.amount}`)
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
    getPaymentLink(params) {
        const paymentId = params.payment || generateUUID();
        return {
            payUrl: `https://payok.io/pay?${(0, qs_1.stringify)(Object.assign({ sign: this.generateSignature(Object.assign({ payment: paymentId }, params), "paymentLink"), shop: this.shop, payment: paymentId, amount: params.amount, desc: params.desc, currency: params.currency, email: params.email, success_url: params.success_url, method: params.method, lang: params.lang }, params.custom))}`,
            paymentId,
        };
    }
    /**
     * Раскрытие сервера (вебхука) и принятие платежей.
     * @param {number} port Порт, на котором создать вебхук. Обязателен
     * @param {string} path Путь, на котором будет доступен вебхук.
     */
    createWebhook(port, path) {
        return __awaiter(this, void 0, void 0, function* () {
            fastify.addContentTypeParser("*", function (req, body, done) {
                var data = "";
                body.on("data", (chunk) => {
                    data += chunk;
                });
                body.on("end", () => {
                    done(null, data);
                });
            });
            fastify.addContentTypeParser("application/x-www-form-urlencoded", { parseAs: "buffer", bodyLimit: 1048576 }, (req, body, done) => {
                done(null, (0, qs_1.parse)(body.toString()));
            });
            fastify.post(path || "/", (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.sign) !== this.generateSignature(req.body))
                    return res.status(400).send("NO");
                res.status(200).send("OK");
                this.events.emit("payment", req.body);
            }));
            return fastify.listen({ port, host: "::" });
        });
    }
}
exports.PAYOK = PAYOK;
__exportStar(require("./types"), exports);
const cache = new Map();
function byteToString(byte) {
    const cached = cache.get(byte);
    if (typeof cached === "string")
        return cached;
    const value = byte.toString(16).padStart(2, "0");
    cache.set(byte, value);
    return value;
}
function generateUUID() {
    const bytes = (0, crypto_1.randomBytes)(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const plain = Array.from(bytes)
        .map((byte) => byteToString(byte))
        .join("");
    return (plain.slice(0, 5) +
        "-" +
        plain.slice(4, 8) +
        "-" +
        plain.slice(8, 13));
}
exports.generateUUID = generateUUID;
;
