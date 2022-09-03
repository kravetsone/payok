export interface IgetPaymentLink {
    amount: number,
    payment?: string,
    desc: string,
    currency?: "RUB" | "UAH" | "USD" | "EUR" | "RUB2",
    email?: string,
    success_url?: string,
    method?: "cd" | "qw" | "ya" | "wm" | "pr" | "pm" | "ad" | "mg" | "bt" | "th" | "lt" | "dg",
    lang?: "RU" | "EN",
    custom?: any
};
export interface IgetTransaction {
    payment?: string,
    offset?: number,
}
export interface IgetPayout {
    payment_id?: string,
    offset?: number,
}
export interface IcreatePayout {
    amount: number,
    method: "card" | "card_uah" | "card_foreign" | "qiwi" | "yoomoney" | "payeer" | "advcash" | "perfect_money" | "webmoney" | "bitcoin" | "litecoin" | "tether" | "tron" | "dogecoin",
    reciever: string,
    comission_type: "balance" | "payment",
    webhook_url?: string,
}