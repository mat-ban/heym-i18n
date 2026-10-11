# Slack Trigger

Вузол **Slack Trigger** — це вхідна точка без входів, яка приймає webhook-запити Slack Events API та автоматично запускає workflow. Він обробляє перевірку URL від Slack та верифікує підписи запитів за допомогою signing secret.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `slack_trigger`, що містять signing secret |

## Інструкція з налаштування

### 1. Створення облікових даних `slack_trigger`

1. Перейдіть до **Settings → Credentials → New Credential**
2. Виберіть тип **Slack Trigger (Signing Secret)**
3. Вставте **Signing Secret** з Вашого Slack App:
   - У Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Збережіть облікові дані

### 2. Додавання вузла до Вашого workflow

1. Відкрийте canvas workflow
2. Перетягніть **Slack Trigger** з панелі вузлів на canvas
3. Клацніть на вузол, щоб відкрити панель властивостей
4. Виберіть Ваші облікові дані `slack_trigger`
5. Скопіюйте **Webhook URL**, показаний на панелі

### 3. Налаштування Вашого Slack App

1. У налаштуваннях Вашого Slack App перейдіть до **Event Subscriptions**
2. Увімкніть перемикач **Enable Events**
3. Вставте Webhook URL у поле **Request URL**
4. Slack надсилає перевірку URL — Heym відповідає автоматично за мілісекунди
5. Поле стає зеленим: ✓ Verified
6. Підпишіться на потрібні Вам **Bot Events** (наприклад, `message.channels`, `reaction_added`)
7. Збережіть зміни та перевстановіть застосунок у Вашому workspace, якщо з'явиться відповідний запит

## Поля виходу

Після спрацювання вузла downstream-вузли можуть отримати доступ до:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.event` | Повний об'єкт події Slack |
| `$nodeLabel.event.type` | Тип події (наприклад, `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Текст повідомлення (за наявності) |
| `$nodeLabel.event.user` | Ідентифікатор користувача Slack, який ініціював подію |
| `$nodeLabel.event.channel` | Ідентифікатор каналу |
| `$nodeLabel.event.ts` | Часова мітка події |
| `$nodeLabel.headers` | Очищені HTTP-заголовки від Slack |
| `$nodeLabel.triggered_by` | Мітка джерела trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Ідентифікатор вузла на canvas, який отримав подію Slack |

## Приклад workflow

**Повідомлення Slack → відповідь LLM → надсилання в Slack:**

```
slackTrigger → llm → slack
```

- Мітка **slackTrigger**: `slackEvent`
- Повідомлення користувача **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Повідомлення **Slack**: `$llm.text`

## Безпека

- Запити верифікуються за допомогою **HMAC-SHA256** з Вашим signing secret
- Часові мітки, старші за **5 хвилин**, відхиляються (запобігання replay-атакам)
- Чутливі заголовки (`x-slack-signature`, `authorization` тощо) видаляються, перш ніж вони досягнуть downstream-вузлів
- Якщо облікові дані не встановлено, вузол працює без верифікації — рекомендується лише для локального тестування

## Примітки

- Heym негайно відповідає `200 OK` і запускає workflow у фоновому режимі — це задовольняє вимогу Slack щодо відповіді протягом 3 секунд
- Webhook URL формується на основі ідентифікатора вузла і ніколи не змінюється, навіть після перейменування workflow
- Потрібен лише один вузол `slackTrigger` на workflow; використовуйте downstream-вузли **Switch** або **Condition** для маршрутизації різних типів подій
