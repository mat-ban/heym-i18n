# Discord Trigger

Вузол **Discord Trigger** — це вхідна точка без входів, яка приймає webhook-запити Discord Interactions API та автоматично запускає workflow. Використовуйте його для slash-команд, кнопок, модальних вікон та інших взаємодій застосунку Discord, які мають передаватися до наступних вузлів AI або інтеграцій.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `discord_trigger`, що містять публічний ключ застосунку Discord |

## Посібник із налаштування

### 1. Створення облікових даних `discord_trigger`

1. Перейдіть до **Settings → Credentials → New Credential**
2. Виберіть тип **Discord Trigger (Public Key)**
3. Вставте **Application Public Key** з Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Збережіть облікові дані

### 2. Додавання вузла до workflow

1. Перетягніть **Discord Trigger** на canvas
2. Виберіть вузол, щоб відкрити панель властивостей
3. Виберіть свої облікові дані `discord_trigger`
4. Скопіюйте **Interactions URL**, показаний на панелі вузла

### 3. Реєстрація Interactions Endpoint у Discord

1. Відкрийте [Discord Developer Portal](https://discord.com/developers/applications)
2. Виберіть свій застосунок
3. Перейдіть до **General Information** або **Interactions**
4. Вставте **Interactions Endpoint URL** вузла в поле endpoint
5. Discord надсилає запит `PING` для перевірки endpoint, і Heym відповідає автоматично після перевірки підпису
6. Збережіть зміни

## Вихідні поля

Після спрацювання вузла наступні вузли можуть отримати доступ до:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.interaction` | Повний payload взаємодії Discord |
| `$nodeLabel.type` | Тип взаємодії |
| `$nodeLabel.data` | Payload команди, кнопки або модального вікна |
| `$nodeLabel.data.name` | Назва slash-команди, якщо застосовно |
| `$nodeLabel.data.options` | Масив опцій slash-команди |
| `$nodeLabel.headers` | Очищені заголовки webhook |
| `$nodeLabel.triggered_by` | Мітка джерела trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID вузла на canvas, який отримав взаємодію Discord |
| `$nodeLabel.triggered_at` | Мітка часу ISO для цього виконання workflow |

## Приклад workflow

**Slash-команда Discord → LLM → Output**

```
discordTrigger → llm → output
```

- Мітка **Discord Trigger**: `discordEvent`
- Повідомлення користувача **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Повідомлення **Output**: `$llm.text`

## Безпека

- Запити перевіряються за допомогою **Ed25519** з використанням публічного ключа вашого застосунку
- Мітки часу, старші за **5 хвилин**, відхиляються для зменшення ризику replay-атак
- Чутливі заголовки (`x-signature-ed25519`, `authorization` тощо) видаляються, перш ніж дані досягнуть наступних вузлів
- Trigger вимагає дійсних облікових даних `discord_trigger`; запити відхиляються, якщо облікові дані відсутні або недійсні

## Примітки

- Heym негайно повертає відкладену відповідь Discord, запускає workflow у фоновому режимі та публікує фінальний вивід workflow як follow-up у Discord, коли вузол `Output` створює вміст
- URL взаємодій формується на основі ID вузла та залишається стабільним, навіть якщо workflow перейменовано
- Використовуйте звичайний [Discord Node](./discord-node.md) лише тоді, коли вам також потрібне окреме надсилання webhook на додачу до follow-up взаємодії
- Зазвичай достатньо одного вузла `discordTrigger`; використовуйте **Switch** або **Condition** далі, щоб маршрутизувати різні типи взаємодій

## Пов'язане

- [Discord Node](./discord-node.md) – Надсилання вихідних повідомлень Discord
- [Triggers](../reference/triggers.md) – Огляд усіх вхідних точок workflow
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними `discord_trigger`
