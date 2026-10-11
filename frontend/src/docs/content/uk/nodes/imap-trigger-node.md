# IMAP Trigger

Вузол **IMAP Trigger** періодично опитує поштову скриньку із фіксованим інтервалом і запускає workflow один раз для кожного нововиявленого повідомлення. Це trigger-вузол із нульовим входом, призначений для автоматизації вхідної електронної пошти, як-от сортування звернень до підтримки, моніторинг спільних поштових скриньок і скриньок для затверджень.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `imap`, що містять сервер, логін, поштову скриньку та налаштування SSL |
| `pollIntervalMinutes` | Integer | Як часто Heym перевіряє поштову скриньку на наявність нових листів |

## Інструкція з налаштування

### 1. Створення облікових даних `imap`

1. Перейдіть до **Settings → Credentials → New Credential**
2. Виберіть тип **IMAP Email Inbox**
3. Введіть:
   - **IMAP Host** (наприклад, `imap.gmail.com`)
   - **IMAP Port** (`993` для SSL/TLS у більшості провайдерів)
   - **Username / Email**
   - **Password / App Password**
   - Необов'язково **Mailbox** (типово: `INBOX`)
4. Залиште **Use SSL / TLS** увімкненим, якщо Ваш поштовий сервер явно не вимагає IMAP без SSL
5. Збережіть облікові дані

### 2. Додавання вузла до workflow

1. Перетягніть **IMAP Trigger** на canvas
2. Виберіть вузол, щоб відкрити панель властивостей
3. Виберіть свої облікові дані `imap`
4. Встановіть **Poll Interval (Minutes)** цілим значенням, наприклад `1`, `5` або `15`

## Семантика trigger

- Перше опитування встановлює базовий рівень поточного вмісту поштової скриньки та **не** відтворює старі листи.
- Наступні опитування запускають trigger один раз для кожного повідомлення, чий IMAP UID новіший за збережений курсор.
- Якщо `UIDVALIDITY` поштової скриньки змінюється, Heym скидає курсор і знову встановлює базовий рівень, щоб уникнути повторної обробки.
- Кожен новий лист запускає окреме виконання workflow з `trigger_source = "imap"`.

## Вихідні поля

Після спрацювання вузла наступні вузли можуть отримати доступ до:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.email` | Повний розібраний payload листа |
| `$nodeLabel.email.subject` | Декодована тема |
| `$nodeLabel.email.from` | Необроблений заголовок `From` |
| `$nodeLabel.email.fromAddresses` | Розібраний список відправників |
| `$nodeLabel.email.toAddresses` | Розібраний список одержувачів |
| `$nodeLabel.email.ccAddresses` | Розібраний список CC |
| `$nodeLabel.email.replyToAddresses` | Розібраний список reply-to |
| `$nodeLabel.email.text` | Тіло у форматі plain-text |
| `$nodeLabel.email.html` | Тіло у форматі HTML |
| `$nodeLabel.email.attachments` | Масив метаданих вкладень (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Декодований об'єкт заголовків |
| `$nodeLabel.email.uid` | IMAP UID для дедуплікації або журналювання |
| `$nodeLabel.triggered_by` | Мітка джерела trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID вузла на canvas, який виявив лист |
| `$nodeLabel.triggered_at` | Мітка часу ISO для виконання workflow |

## Приклад workflow

**Вхідний лист до підтримки → підсумувати → маршрутизувати**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Мітка **IMAP Trigger**: `supportInbox`
- Повідомлення користувача **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Примітки

- Багато провайдерів вимагають **app password** для доступу через IMAP замість пароля від основного облікового запису.
- Вміст вкладень не додається до входу workflow; включаються лише метадані вкладень.
- Використовуйте [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) або [DataTable](./datatable-node.md) далі за потоком для маршрутизації чи журналювання нових листів.

## Пов'язане

- [Triggers](../reference/triggers.md) – Огляд усіх точок входу workflow
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними `imap`
- [Send Email](./send-email-node.md) – Відповідь або пересилання вхідних повідомлень
