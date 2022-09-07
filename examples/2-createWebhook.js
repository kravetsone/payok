const { PAYOK } = require(".."); // require("payok");
const payok = new PAYOK({
    apiId: 1,
    apiKey: "",
    secretKey: "",
    shop: 1,
});
payok.createWebhook(3000, "/amazing-secret-url-path").then(() => {
    console.log("[PAYOK] Вебхук запущен по пути http://localhost:3000/amazing-secret-url-path на 3000 порту!")
    payok.events.on("payment", (payment) => {
        console.log(payment);
        /*{
            payment_id: '51387-77a3-d3724',
            shop: '2000',
            amount: '10',
            profit: '10',
            desc: 'Описание вашего товара',
            currency: 'RUB',
            currency_amount: '10.69',
            sign: 'b7453a35683171d235dfb13a16b61f41',
            email: 'email@gmail.ru',
            date: '11.06.2022 12:13:15',
            method: 'Qiwi', 
            custom: { id: '123456' } 
        }*/
    });
});