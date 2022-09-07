const { PAYOK } = require(".."); // require("payok");
const payok = new PAYOK({
    apiId: 1,
    apiKey: "",
    secretKey: "",
    shop: 1,
});
const link = payok
    .getPaymentLink({
        amount: 10,
        desc: "Описание вашего товара",
        success_url: `https://github.com/kravetsone/payok`,
        email: "email@gmail.ru",
        custom: {id: 123456},
    });
console.log(link); // { payUrl: "https://payok.io/pay?...", paymentId: "98dd5-51e1-a0644"}