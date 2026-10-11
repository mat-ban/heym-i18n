# Telegram Trigger

Вузол **Telegram Trigger** — це вхідна точка без вхідних даних, яка запускає workflow, коли Ваш Telegram-бот отримує оновлення через webhook. Використовуйте його для чат-ботів, сортування звернень до підтримки, команд у стилі slash або зворотних викликів вбудованих кнопок, які мають передаватися до наступних вузлів AI та інтеграцій.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `telegram`, що містять token бота та необов'язковий секретний token webhook |

## Посібник із налаштування

### 1. Створення облікових даних `telegram`

1. Перейдіть до **Settings → Credentials → New Credential**
2. Виберіть тип **Telegram Bot**
3. Вставте **Bot Token** від BotFather
4. За бажанням задайте **Webhook Secret Token**, якщо потрібно, щоб Telegram надсилав відповідний заголовок перевірки
5. Збережіть облікові дані

### 2. Додавання вузла до Вашого workflow

1. Перетягніть **Telegram Trigger** на canvas
2. Виберіть вузол, щоб відкрити панель властивостей
3. Виберіть свої облікові дані `telegram`
4. Скопіюйте **Webhook URL**, показаний на панелі вузла

### 3. Реєстрація webhook у Telegram

Скористайтеся методом Bot API `setWebhook` із URL із вузла:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Якщо Ви налаштували секретний token у Heym, надішліть те саме значення під час налаштування webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Вихідні поля

Після спрацювання вузла наступні вузли можуть отримати доступ до:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.update` | Повний payload оновлення Telegram |
| `$nodeLabel.message` | Основний об'єкт, подібний до повідомлення, з оновлення |
| `$nodeLabel.message.text` | Текст вхідного повідомлення |
| `$nodeLabel.message.chat.id` | ID чату для відповіді в наступних вузлах |
| `$nodeLabel.message.from.id` | ID користувача Telegram |
| `$nodeLabel.callback_query` | Payload зворотного виклику, коли оновлення надійшло від вбудованої клавіатури |
| `$nodeLabel.headers` | Очищені заголовки webhook |
| `$nodeLabel.triggered_by` | Мітка джерела trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID вузла на canvas, який отримав оновлення Telegram |
| `$nodeLabel.triggered_at` | Мітка часу ISO для цього виконання workflow |

## Приклад workflow

**Повідомлення Telegram → LLM → відповідь Telegram**

```
telegramTrigger → llm → telegram
```

- Мітка **Telegram Trigger**: `telegramEvent`
- Повідомлення користувача для **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId для **Telegram**: `$telegramEvent.message.chat.id`

## Безпека

- Якщо Ваші облікові дані мають `secret_token`, Heym перевіряє `x-telegram-bot-api-secret-token` перед запуском workflow.
- Чутливі заголовки запиту видаляються, перш ніж payload досягне наступних вузлів.
- URL webhook є статичним для ID вузла, тому повторно реєструвати його потрібно лише в разі зміни самого вузла.

## Пов'язані матеріали

- [Telegram Node](./telegram-node.md) – Надсилання відповіді або вихідного сповіщення
- [Triggers](../reference/triggers.md) – Огляд усіх вхідних точок workflow
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними `telegram`
