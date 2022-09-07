# PAYOK

> NODE JS модуль, который позволит принимать оплату с помощью платёжного агрегатора [payok.io](https://payok.io/)

<div align='center'>
  <img src="assets/logo.png" alt="PAYOK" /> 
</div>

<div align='center'>
  <a href='https://github.com/kravetsone/payok/tree/main/examples'><b>examples</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#changelog'><b>changelog</b></a>
</div>
<br>

<div align='center'>
  <img src="https://img.shields.io/npm/dt/payok.svg" alt="Downloads" href="https://npmjs.com/package/payok" /> 
  <img src="https://img.shields.io/npm/dm/payok.svg" alt="Downloads/month" href="https://npmjs.com/package/payok" /> 
  <img src="https://img.shields.io/github/last-commit/kravetsone/payok.svg" alt="last commit" href="https://github.com/kravetsone/payok" /> 
  <img src="https://img.shields.io/github/stars/kravetsone/payok.svg" alt="GitHub" href="https://github.com/kravetsone/payok" /> 
  <img src="https://img.shields.io/npm/v/payok.svg" alt="npm" href="https://npmjs.com/package/payok" /> 
</div>

## 📦 Установка

-   **используя `npm`**
    ```shell
    npm i payok
    ```
-   **используя `Yarn`**
    ```shell
    yarn add payok
    ```
-   **используя `pnpm`**
    ```shell
    pnpm add payok
    ```

# 🛠️ Использование

```js
const { PAYOK } = require("payok");
const payok = new PAYOK({
    apiId: 1,
    apiKey: "yourApiKey",
    secretKey: "yourSecretKey",
    shop: 2000,
});
```

| Параметр  | Тип    | Описание                                    | Обязательный |
| --------- | ------ | ------------------------------------------- | ------------ |
| apiId     | number | Ваш идентификатор (ID) API ключа            | +            |
| apiKey    | string | Ваш API ключ                                | +            |
| secretKey | string | Секретный ключ, который принадлежит проекту | +            |
| shop      | number | Идентификатор (ID) проекта                  | +            |

## 💳 [Создание ссылки на форму оплаты](https://payok.io/cabinet/documentation/doc_payform.php)

---

```js
const link = payok
    .getPaymentLink({
        amount: 10,
        desc: "Описание вашего товара",
        success_url: `https://github.com/kravetsone/payok`,
        email: "email@gmail.ru",
        custom: {id: 123456},
    });
console.log(link); // { payUrl: "https://payok.io/pay?...", paymentId: "98dd5-51e1-a0644"}
```

| Параметр    | Тип    | Описание                                                                | Обязательный |
| ----------- | ------ | ----------------------------------------------------------------------- | ------------ |
| amount      | number | Сумма платежа                                                           | +            |
| desc        | string | Название или описание вашего товара                                     | +            |
| success_url | string | Ссылка, на которую переадресует пользователя после успешной оплаты      | -            |
| email       | string | Email пользователя                                                      | -            |
| method      | string | [Способ оплаты](https://payok.io/cabinet/documentation/doc_methods.php) | -            |
| lang        | string | Язык интерфейса (`RU`/`ENG`)                                            | -            |
| custom.\*   | any    | Любой ваш параметр, который придёт к вам на вебхук в случае оплаты      | -            |

## ⚙ [Создание вебхука (обработчик успешной оплаты)](https://payok.io/cabinet/documentation/doc_sendback.php)

---

> 🚧 Параметр sign, приходящий вместе с платежём, уже проверен библиотекой, так что с ним вам взаимодействовать не потребуется.

```js
// Запускаем сам веб-сервер
payok.createWebhook(3000, "/amazing-secret-url-path");
// Слушаем обработанное событие пополнения
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
```

| Параметр | Тип      | Описание                                         | Обязательный |
| -------- | -------- | ------------------------------------------------ | ------------ |
| port     | number   | Порт на котором вы хотите раскрыть вебхук        | +            |
| path     | string   | Путь по которому будет доступен вебхук           | -            |

### 💰 [Получение баланса](https://payok.io/cabinet/documentation/doc_api_balance)

---

```js
payok.api.getBalance().then((res) => {
    console.log(res); //{ balance: "10.00", ref_balance: "0" }
});
```

Без параметров

### 👉 [Получить список транзакций](https://payok.io/cabinet/documentation/doc_api_transaction)

---

```js
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
});
```

| Параметр | Тип    | Описание                          | Обязательный |
| -------- | ------ | --------------------------------- | ------------ |
| payment  | string | Идентификатор (ID) платежа        | -            |
| offset   | number | Пропуск определённого числа строк | -            |

### 👈 [Получить список выплат](https://payok.io/cabinet/documentation/doc_api_payout)

---

```js
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
});
```

| Параметр  | Тип    | Описание                          | Обязательный |
| --------- | ------ | --------------------------------- | ------------ |
| payout_id | string | Идентификатор (ID) выплаты        | -            |
| offset    | number | Пропуск определённого числа строк | -            |

### ✨ [Создание выплаты](https://payok.io/cabinet/documentation/doc_api_payout_create)

---

```js
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
    });
```

| Параметр       | Тип    | Описание                                                                | Обязательный |
| -------------- | ------ | ----------------------------------------------------------------------- | ------------ |
| amount         | number | Сумма выплаты                                                           | +            |
| method         | string | [Способ выплаты](https://payok.io/cabinet/documentation/doc_api_payout_methods) | +            |
| reciever       | string | Реквезиты на которые придёт выплата                                     | +            |
| comission_type | string | Комиссия с баланса - `balance`, а если с выплаты - `payment`            | +            |
| webhook_url    | string | URL вебхука для отправки статуса выплаты                                | -            |

> Если нашли ошибку, то создайте [ISSUES](https://github.com/kravetsone/payok/issues/new)

## Changelog:

**1.0.4** - Breaking Change. Поменяли систему событий. Добавили примеры и множество более скромных деяних. [Подробнее](https://github.com/kravetsone/payok/releases/tag/payok%401.0.4)

**1.0.3** - Поддержка `TypeScript`. Рефакторинг кода. Мелкие изменения в `Readme`. Зависимость `node-fetch` заменена на `axios`.

**1.0.2** - Исправлены проблемы с API запросами (был неверно передан `Content-Type`). Убраны лишние зависимости (7 => 3)

**1.0.1** - Фикс множества ошибок.

**1.0.0** - Релиз библиотеки. Добавлен `Readme`
