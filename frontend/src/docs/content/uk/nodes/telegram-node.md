# Telegram

Вузол **Telegram** надсилає повідомлення через Telegram Bot API. Використовуйте його для відповідей у чаті, оперативних сповіщень, оновлень статусу workflow або будь-якого наступного кроку, який має надіслати повідомлення користувачеві, групі чи каналу Telegram.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вивід | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `telegram`, що містять token бота |
| `chatId` | expression | Ідентифікатор чату, групи або каналу призначення |
| `message` | expression | Текст вихідного повідомлення. Підтримує [expressions](../reference/expression-dsl.md). |

## Налаштування

1. Створіть [облікові дані Telegram Bot](../reference/integrations.md#telegram)
2. Додайте вузол **Telegram** до свого workflow
3. Виберіть облікові дані
4. Встановіть `chatId` як статичний ідентифікатор чату або expression, наприклад `$telegramEvent.message.chat.id`
5. Встановіть `message` як вихідний текст або шаблон, побудований з даних попередніх вузлів

## Приклад

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Поля виводу

| Expression | Опис |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` у разі успіху |
| `$nodeLabel.ok` | Прапорець успіху Telegram API |
| `$nodeLabel.result` | Необроблений об'єкт результату `sendMessage` від Telegram |
| `$nodeLabel.result.message_id` | Ідентифікатор повідомлення Telegram |
| `$nodeLabel.result.chat.id` | Ідентифікатор чату призначення, повернутий Telegram |

## Типові шаблони

- Поєднуйте з [Telegram Trigger](./telegram-trigger-node.md) для створення розмовних ботів
- Надсилайте повідомлення про помилки з [Error Handler](./error-handler-node.md)
- Публікуйте підсумки, згенеровані [LLM](./llm-node.md) або [Agent](./agent-node.md)

## Пов'язане

- [Telegram Trigger](./telegram-trigger-node.md) – Запуск workflow з вхідних повідомлень бота
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними `telegram`
- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
