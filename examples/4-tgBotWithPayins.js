const { PAYOK } = require(".."); // require("payok");
const { Telegram, InlineKeyboardBuilder } = require("puregram")

const payok = new PAYOK({
    apiId: 1,
    apiKey: "",
    secretKey: "",
    shop: 1,
});
const bot = new Telegram({
  token: ""
});
const users = []; // Так как это простенький пример всякие базы данных здесь использоваться не будут
payok.events.on("payment", (payment) => {
    const user = users.find(x => x.id == payment.custom.id);
    user.balance += payment.amount;
    return bot.api.sendMessage({
        chat_id: payment.custom.id,
        text: `✨ Спасибо за пополнение в 10 рублей! Теперь твой баланс составляет - ${user.balance}.`
      });
});
bot.updates.on("message", (message) => {
    message.user = users.find(x => x.id == message.from.id);
    if(!message.user) {
        users.push({
            id: message.from.id,
            balance: 0
        });
        return message.send(`❓ Добро пожаловать в бота с тестовым пополнением баланса с помощью https://github.com/kravetsone/payok. Напишите что-нибудь...`)
    }
    const link = payok.getPaymentLink({
        amount: 10,
        desc: `Пополнение 10 рублей для ${message.from.firstName}`,
        success_url: `https://github.com/kravetsone/payok`,
        custom: {id: message.from.id},
    });
    console.log(link); // { payUrl: "https://payok.io/pay?...", paymentId: "98dd5-51e1-a0644"}
    return message.send(`Привет, ${message.from.firstName}! Твой баланс составляет - ${message.user.balance}.`, {reply_markup: new InlineKeyboardBuilder().urlButton({
        url: link.payUrl,
        text: "Пополнить свой баланс на 10 рублей"
    })});
})

bot.updates.startPolling().then(() => {
    console.log("Бот в телеграмме запущен.");
});
payok.createWebhook(3000, "/amazing-secret-url-path").then(() => {
    console.log("[PAYOK] Вебхук запущен по пути http://localhost:3000/amazing-secret-url-path на 3000 порту!");
});