# Telegram

**Telegram** node изпраща съобщение чрез Telegram Bot API. Използвайте го за отговори в Chat, оперативни известия, актуализации на статуса на Workflow или всяка следваща стъпка, която трябва да изпрати съобщение до потребител, група или канал в Telegram.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` удостоверение, съдържащо bot token |
| `chatId` | expression | ID на целевия Chat, група или канал |
| `message` | expression | Текст на изходящото съобщение. Поддържа [expressions](../reference/expression-dsl.md). |

## Настройка

1. Създайте [Telegram Bot удостоверение](../reference/integrations.md#telegram)
2. Добавете **Telegram** node към Вашия Workflow
3. Изберете удостоверението
4. Задайте `chatId` на статичен chat ID или на expression като `$telegramEvent.message.chat.id`
5. Задайте `message` на изходящия текст или на шаблон, изграден от данни от предходни стъпки

## Пример

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

## Изходни полета

| Expression | Описание |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` при успех |
| `$nodeLabel.ok` | Флаг за успех на Telegram API |
| `$nodeLabel.result` | Суров обект с резултат от `sendMessage` от Telegram |
| `$nodeLabel.result.message_id` | ID на съобщението в Telegram |
| `$nodeLabel.result.chat.id` | ID на целевия Chat, върнат от Telegram |

## Чести модели

- Комбинирайте го с [Telegram Trigger](./telegram-trigger-node.md) за разговорни ботове
- Изпращайте известия за грешки от [Error Handler](./error-handler-node.md)
- Публикувайте резюмета, генерирани от [LLM](./llm-node.md) или [Agent](./agent-node.md)

## Свързани

- [Telegram Trigger](./telegram-trigger-node.md) – Стартирайте Workflow от входящи съобщения на бота
- [Third-Party Integrations](../reference/integrations.md) – Настройка на Telegram удостоверение
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на `telegram` удостоверения
- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
