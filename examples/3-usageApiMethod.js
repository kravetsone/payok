const { PAYOK } = require(".."); // require("payok");
const payok = new PAYOK({
    apiId: 1,
    apiKey: "",
    secretKey: "",
    shop: 1,
});
payok.api.getBalance().then((res) => {
    console.log(res); //{ balance: "10.00", ref_balance: "0" }
}).catch(console.error);
payok.api.getTransactions({ offset: 1 }).then((res) => {
    console.log(res);
    /*{
        {
            "status": "success"
            "1": {
                "transaction": 10000,
                "email": "example@ex.com",
                "amount": "1065",
                "currency": "USD",
                "currency_amount": "14.26",
                "comission_percent": 5 ,
                "comission_fixed": "15",
                "amount_profit": "1000",
                "method": Visa/Mastercard,
                "payment_id": "10500",
                "description": "Описание транзакции",
                "date": "26.09.2021 20:40:07",
                "pay_date": "26.09.2021 21:00:00"
                "transaction_status": 0
                "custom_fields": null
                "webhook_status": 1
                "webhook_amount": 1
            }
        }
    }*/
}).catch(console.error);
payok.api.getPayouts({ offset: 1 }).then((res) => {
    console.log(res);
    /*{
        {
            "status": "success"
            "1": {
                "payout": 10000,
                "method": "card",
                "reciever": "5000400030002000",
                "type": "main",
                "amount": "1000",
                "comission_percent": 2 ,
                "comission_fixed": "50",
                "amount_profit": 930,
                "date_create": "26.09.2021 20:40:07",
                "date_pay": "26.09.2021 20:55:01",
                "status": 0
            }
        }
    }*/
}).catch(console.error);
payok.api
    .createPayout({
        amount: 10,
        method: "qiwi",
        reciever: "+79851628442",
        comission_type: "balance",
    })
    .then((res) => {
        console.log(res);
        /*{
            {
                "status":"success",
                "remain_balance":"229.44",
                "data": {
                    "payout_id": 100,
                    "method": "card",
                    "reciever": "5000400030002000",
                    "amount": 1000,
                    "comission_percent": 2 ,
                    "comission_fixed": "50",
                    "amount_profit": 930,
                    "date": "26.09.2021 20:40:07",
                    "payout_status_code": 0,
                    "payout_status_text": "WAIT"
                }
            }
        }*/
    }).catch(console.error);