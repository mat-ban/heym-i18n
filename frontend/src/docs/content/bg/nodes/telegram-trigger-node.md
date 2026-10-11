# Telegram Trigger

**Telegram Trigger** node е входна точка с нулев вход, която стартира workflow, когато Вашият Telegram бот получи webhook update. Използвайте го за чатботове, сортиране на запитвания за поддръжка, команди от тип slash или callback-и от inline бутони, които трябва да се разклонят към downstream AI и интеграционни nodes.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` удостоверение, съдържащо bot token и незадължителен webhook secret token |

## Ръководство за настройка

### 1. Създайте `telegram` удостоверение

1. Отворете **Settings → Credentials → New Credential**
2. Изберете тип **Telegram Bot**
3. Поставете **Bot Token** от BotFather
4. По желание задайте **Webhook Secret Token**, ако искате Telegram да изпраща съответстващ header за верификация
5. Запазете удостоверението

### 2. Добавете node-а към Вашия workflow

1. Плъзнете **Telegram Trigger** върху canvas-а
2. Изберете node-а, за да отворите панела Properties
3. Изберете Вашето `telegram` удостоверение
4. Копирайте **Webhook URL**, показан в панела на node-а

### 3. Регистрирайте webhook-а в Telegram

Използвайте метода `setWebhook` на Bot API с URL от node-а:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Ако сте конфигурирали secret token в Heym, изпратете същата стойност при настройката на webhook-а:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Изходни полета

След като node-ът се задейства, downstream nodes могат да достъпят:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.update` | Пълен Telegram update payload |
| `$nodeLabel.message` | Основен обект от тип съобщение от update-а |
| `$nodeLabel.message.text` | Текст на входящото съобщение |
| `$nodeLabel.message.chat.id` | Chat ID за отговор downstream |
| `$nodeLabel.message.from.id` | Telegram потребителски ID |
| `$nodeLabel.callback_query` | Callback payload, когато update-ът идва от inline клавиатура |
| `$nodeLabel.headers` | Санитизирани webhook headers |
| `$nodeLabel.triggered_by` | Етикет на източника на trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID на canvas node-а, получил Telegram update-а |
| `$nodeLabel.triggered_at` | ISO timestamp за това изпълнение на workflow |

## Примерен workflow

**Telegram съобщение → LLM → Telegram отговор**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** етикет: `telegramEvent`
- **LLM** потребителско съобщение: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Сигурност

- Ако Вашето удостоверение има `secret_token`, Heym верифицира `x-telegram-bot-api-secret-token` преди да стартира workflow-а.
- Чувствителните request headers се премахват, преди payload-ът да достигне до downstream nodes.
- Webhook URL е статичен за ID на node-а, така че е необходимо да го регистрирате отново само когато самият node се промени.

## Свързани

- [Telegram Node](./telegram-node.md) – Изпращане на отговор или изходяща нотификация
- [Triggers](../reference/triggers.md) – Преглед на всички входни точки на workflow
- [Third-Party Integrations](../reference/integrations.md) – Настройка на Telegram удостоверение
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на `telegram` удостоверения
