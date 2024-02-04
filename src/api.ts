import { stringify } from "node:querystring";
import {
	BalanceResponse,
	CreatePayoutResponse,
	ICreatePayout,
	IGetPayout,
	IGetTransactionParams,
	Payout,
	PayoutRawResponse,
	Transaction,
	TransactionRawResponse,
} from "./types";

const BASE_URL = "https://payok.io/api";

export class API {
	apiId: number;
	apiKey: string;
	secretKey: string;
	shop: number;

	constructor(params: {
		apiId: number;
		apiKey: string;
		secretKey: string;
		shop: number;
	}) {
		this.apiId = params.apiId;
		this.apiKey = params.apiKey;
		this.secretKey = params.secretKey;
		this.shop = params.shop;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private async request<T>(path: string, params: Record<string, any> = {}) {
		const res = await fetch(BASE_URL + path, {
			headers: {
				"User-Agent": "kravetsone/payok",
				"Content-type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: stringify({
				...params,
				API_ID: params.apiId,
				API_KEY: params.apiKey,
				shop: params.shop,
			}),
		});

		const data = await res.json();
		if (!res.ok || data.status === "error") throw new Error();

		return data as T;
	}

	/**
	 * [Получение баланса аккаунта.](https://payok.io/cabinet/documentation/doc_api_balance)
	 */
	async getBalance() {
		return this.request<BalanceResponse>("/balance");
	}
	/**
	 * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_transaction)
	 * @param {number} params.payment ID платежа в вашей системе.
	 * @param {number} params.offset Отступ, пропуск указанного количества строк.
	 */
	async getTransactions(params: IGetTransactionParams) {
		const data = await this.request<TransactionRawResponse>(
			"/transaction",
			params,
		);

		// Damn...
		return Object.keys(data)
			.filter((x) => x !== "status")
			.map((x) => ({ ...data[x], id: x })) as Transaction[];
	}
	/**
	 * [Получение списка транзакций.](https://payok.io/cabinet/documentation/doc_api_payout)
	 * @param {number} params.payment_id ID выплаты в системе Payok.
	 * @param {number} params.offset Отступ, пропуск указанного количества строк.
	 */
	async getPayouts(params: IGetPayout) {
		const data = await this.request<PayoutRawResponse>("/payout", params);

		// Damn...
		return Object.keys(data)
			.filter((x) => x !== "status")
			.map((x) => ({ ...data[x], id: x })) as Payout[];
	}
	/**
	 * [Создание выплаты.](https://payok.io/cabinet/documentation/doc_api_payout_create)
	 * @param {number} params.amount Сумма выплаты. Обязателен.
	 * @param {string} params.method [Способ оплаты.](https://payok.io/cabinet/documentation/doc_methods.php) Обязателен.
	 * @param {string} params.reciever Реквезиты на которые придёт выплата. Обязателен.
	 * @param {string} params.comission_type  Комиссия с баланса - `balance`, а если с выплаты - `payment`. Обязателен.
	 * @param {number} params.webhook_url URL вебхука для отправки статуса выплаты.
	 */
	async createPayout(params: ICreatePayout) {
		return this.request<CreatePayoutResponse>("/payout_create", params);
	}
}
