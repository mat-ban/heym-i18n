# A2A

Heym надає доступ до **Heym Agent** через протокол Agent2Agent (A2A 1.0, прив'язка JSON-RPC). Heym Agent є рушієм за [вкладці Chat](../tabs/chat-tab.md); MCP-клієнти взаємодіють із тим самим агентом як з інструментом `heym_chat` (див. [вкладці MCP / A2A](../tabs/mcp-tab.md)). Коли A2A увімкнено, інший агент може надіслати йому Task природною мовою та отримати відповідь із тими самими можливостями, які має Chat.

## Увімкнення

1. Відкрийте вкладку **MCP / A2A**.
2. Увімкніть **Heym Agent** на сервері за замовчуванням або на іменованому сервері та оберіть його облікові дані й модель.
3. Позначте прапорець **Увімкнути A2A**. Картка відобразить URL-адресу **Agent Card** та **JSON-RPC Endpoint**.

A2A базується на Heym Agent: вимкнення агента також вимикає A2A.

## Endpoints

| | Сервер за замовчуванням | Іменований сервер |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card не вимагає облікових даних і не вказує користувача, сервер чи Workflow. Вона існує лише тоді, коли A2A увімкнено: картка домену, доки принаймні один користувач має увімкнений A2A для сервера за замовчуванням; картка іменованого сервера, доки A2A цього сервера активний. В іншому випадку адреса відповідає кодом 404.

## Автентифікація

Надсилайте ті самі облікові дані, що й для MCP, виключно у заголовках:

- `X-MCP-Key: <key>`: ключ сервера за замовчуванням або ключ іменованого сервера
- `Authorization: Bearer <token>`: OAuth Token від OAuth-сервера Heym

Облікові дані в URL відхиляються. Agent Card декларує обидві схеми, дозволяючи клієнту A2A зчитувати їх безпосередньо з картки.

## Методи

| Метод | Опис дії |
|---|---|
| `SendMessage` | Запускає Task або продовжує ту, яка очікує на введення. Очікує на відповідь, якщо `configuration.returnImmediately` не має значення `true`. |
| `SendStreamingMessage` | Те саме у вигляді потоку Server-Sent Events із перебігом і результатом Task. |
| `GetTask` | Стан, відповідь та історія Task (`historyLength` обмежує розмір історії). |
| `ListTasks` | Ваші Tasks на цьому сервері, спочатку найновіші, відфільтровані за `contextId` або `status`, з параметрами `pageSize` та `pageToken`. |
| `CancelTask` | Зупиняє Task, яка ще виконується або очікує. |
| `SubscribeToTask` | Відстежує Task, яка все ще виконується. |
| `GetExtendedAgentCard` | Картка з назвою сервера та призначеними йому Workflows як навичками. |

Push-сповіщення не пропонуються: картка зазначає `pushNotifications: false`, а push-методи відповідають помилкою `PushNotificationNotSupportedError`. Запити використовують A2A 1.0; надсилайте заголовок `A2A-Version: 1.0`. Назви методів з A2A 0.3, такі як `message/send`, повертають `VersionNotSupportedError`.

## Tasks та бесіди

Кожна Task є бесідою у вкладці Chat, позначеною мережевою піктограмою. Параметр `contextId` завдання відповідає цій бесіді: надішліть нове повідомлення з тим самим `contextId` і без `taskId`, щоб продовжити її.

| Дія агента | Стан Task |
|---|---|
| Відповів | `TASK_STATE_COMPLETED`, із відповіддю у формі тексту та, якщо збережено, посиланнями на Workflows і набори оцінювання як даними |
| Поставив уточнювальне запитання | `TASK_STATE_INPUT_REQUIRED`: надайте відповідь із тим самим `taskId` |
| Потрібні облікові дані | `TASK_STATE_AUTH_REQUIRED`: повідомлення про стан містить посилання на сторінку облікових даних Heym. Користувач відкриває його у браузері з активним входом у Heym; значення ніколи не передається через іншого агента. Потім надішліть повідомлення в межах тієї ж Task, щоб продовжити. |
| Завершилося помилкою | `TASK_STATE_FAILED`, із зазначенням причини |
| Скасовано | `TASK_STATE_CANCELED` |

Повідомлення до завершеної Task або до такої, що все ще виконується, відхиляється з помилкою `UnsupportedOperationError`. Повідомлення приймають частини `text` і `data`, загальним обсягом до 20 000 символів; файлові частини відхиляються, тому передавайте файли як посилання.

## Перебіг

Поки Task виконується, потік надсилає оновлення стану для кожного кроку, використовуючи формулювання з вкладки Chat, наприклад `Running workflow "Invoice Parser"` або `Testing the workflow · attempt 2/5`. Клієнти MCP отримують ті самі кроки як `notifications/progress` від `heym_chat`.

## Приклад

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Обмеження

- `CancelTask` миттєво зупиняє поточний хід на інстанції Heym, яка його виконує, аналогічно до кнопки Stop у вкладці Chat. В інших місцях Task позначається як скасована, а запізнілий результат ходу не зберігається.
- Відсутні push-сповіщення, відсутня прив'язка REST або gRPC, відсутні підписані картки Agent Cards.

## Пов'язані теми

- [Вкладці MCP / A2A](../tabs/mcp-tab.md): увімкнення Heym Agent та A2A
- [Вкладці Chat](../tabs/chat-tab.md): рушій за агентом
- [Безпека](./security.md): спосіб зберігання ключів
