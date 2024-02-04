export type Currency = "RUB" | "UAH" | "USD" | "EUR" | "RUB2";
export type PaymentMethod =
	| "cd"
	| "qw"
	| "ya"
	| "wm"
	| "pr"
	| "pm"
	| "ad"
	| "mg"
	| "bt"
	| "th"
	| "lt"
	| "dg";
export type PayoutMethod =
	| "card"
	| "card_uah"
	| "card_foreign"
	| "qiwi"
	| "yoomoney"
	| "payeer"
	| "advcash"
	| "perfect_money"
	| "webmoney"
	| "bitcoin"
	| "litecoin"
	| "tether"
	| "tron"
	| "dogecoin";

export interface IGetPaymentLink {
	amount: string;
	desc: string;
	payment?: string;
	currency?: Currency;
	email?: string;
	success_url?: string;
	method?: PaymentMethod;
	lang?: "RU" | "EN";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	custom: Record<string, any>;
}
export interface IGetTransactionParams {
	payment?: string;
	offset?: number;
}
export interface IGetPayout {
	payment_id?: string;
	offset?: number;
}
export interface ICreatePayout {
	amount: string;
	method: PayoutMethod;
	reciever: string;
	comission_type: "balance" | "payment";
	webhook_url?: string;
}
export interface IPaymentHandler {
	payment_id: string;
	shop: number;
	amount: string;
	profit: string;
	desc: string;
	currency: Currency;
	currency_amount: string;
	sign: string;
	email: string;
	date: string;
	method: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	custom: any;
}

export interface BalanceResponse {
	balance: string;
	ref_balance: string;
}

export interface TransactionRawResponse {
	[key: string]: Transaction | undefined;
}

export interface Transaction {
	id: string;
	transaction: number;
	email: string;
	amount: number;
	currency: Currency;
	currency_amount: number;
	comission_percent: number;
	comission_fixed: number;
	amount_profit: number;
	method: string;
	payment_id: number;
	description: string;
	date: string;
	pay_date: string;
	transaction_status: 0 | 1;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	custom_fields: any;
	webhook_status: 0 | 1 | 2;
	webhook_amount: number;
}

export type PayoutRawResponse = Record<string, Payout>;

export interface Payout {
	id: string;
	payout: number;
	method: PaymentMethod;
	reciever: string;
	type: string;
	amount: number;
	comission_percent: number;
	comission_fixed: string;
	amount_profit: number;
	date_create: string;
	date_pay: string;
	status: 0 | 1 | 2;
}

export interface CreatePayoutResponse {
	remain_balance: string;
	data: PayoutData;
}

export interface PayoutData {
	payout_id: number;
	method: string;
	reciever: string;
	amount: number;
	comission_percent: number;
	comission_fixed: string;
	amount_profit: number;
	date: string;
	payout_status_code: number;
	payout_status_text: string;
}
