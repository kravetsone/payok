export type Currency = "RUB" | "UAH" | "USD" | "EUR" | "RUB2"
export type PaymentMethod = "cd" | "qw" | "ya" | "wm" | "pr" | "pm" | "ad" | "mg" | "bt" | "th" | "lt" | "dg"
export type PayoutMethod = "card" | "card_uah" | "card_foreign" | "qiwi" | "yoomoney" | "payeer" | "advcash" | "perfect_money" | "webmoney" | "bitcoin" | "litecoin" | "tether" | "tron" | "dogecoin"

export interface IGetPaymentLink {
    amount: string,
    desc: string,
    payment?: string,
    currency?: Currency,
    email?: string,
    success_url?: string,
    method?: PaymentMethod,
    lang?: "RU" | "EN",
    custom: Record<string, any>
}
export interface IGetTransaction {
    payment?: string,
    offset?: number,
}
export interface IGetPayout {
    payment_id?: string,
    offset?: number,
}
export interface ICreatePayout {
    amount: string,
    method: PayoutMethod,
    reciever: string,
    comission_type: "balance" | "payment",
    webhook_url?: string,
}
export interface IPaymentHandler {
    payment_id: string,
    shop: number,
    amount: string,
    profit: string,
    desc: string,
    currency: Currency,
    currency_amount: string,
    sign: string,
    email: string,
    date: string,
    method: string,
    custom: any
}