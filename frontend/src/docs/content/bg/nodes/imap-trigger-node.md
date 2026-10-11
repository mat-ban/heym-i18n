# IMAP Trigger

**IMAP Trigger** node периодично проверява имейл кутия на фиксиран интервал и стартира workflow веднъж за всяко новооткрито съобщение. Това е trigger node с нулев вход, предназначен за автоматизация на входяща имейл кореспонденция като сортиране на заявки за поддръжка, наблюдение на споделени пощенски кутии и кутии за одобрения.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` удостоверение, съдържащо сървър, логин, пощенска кутия и SSL настройки |
| `pollIntervalMinutes` | Integer | Колко често Heym проверява пощенската кутия за нови имейли |

## Ръководство за настройка

### 1. Създаване на `imap` удостоверение

1. Отидете на **Settings → Credentials → New Credential**
2. Изберете тип **IMAP Email Inbox**
3. Въведете:
   - **IMAP Host** (например `imap.gmail.com`)
   - **IMAP Port** (`993` за SSL/TLS при повечето доставчици)
   - **Username / Email**
   - **Password / App Password**
   - По избор **Mailbox** (по подразбиране: `INBOX`)
4. Оставете **Use SSL / TLS** включено, освен ако Вашият имейл сървър изрично не изисква IMAP без SSL
5. Запазете удостоверението

### 2. Добавяне на node към Вашия workflow

1. Плъзнете **IMAP Trigger** върху canvas
2. Изберете node, за да отворите панела Properties
3. Изберете Вашето `imap` удостоверение
4. Задайте **Poll Interval (Minutes)** с цяло число като `1`, `5` или `15`

## Семантика на trigger

- Първата проверка установява базова линия на текущото съдържание на пощенската кутия и **не** възпроизвежда по-стари имейли.
- Следващите проверки задействат веднъж за всяко съобщение, чието IMAP UID е по-ново от запазения курсор.
- Ако `UIDVALIDITY` на пощенската кутия се промени, Heym нулира курсора и установява базова линия отново, за да избегне дублирано обработване.
- Всеки нов имейл стартира отделно изпълнение на workflow с `trigger_source = "imap"`.

## Изходни полета

След като node се задейства, следващите nodes могат да достъпят:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.email` | Пълен анализиран payload на имейла |
| `$nodeLabel.email.subject` | Декодирана тема |
| `$nodeLabel.email.from` | Суров `From` header |
| `$nodeLabel.email.fromAddresses` | Анализиран списък с податели |
| `$nodeLabel.email.toAddresses` | Анализиран списък с получатели |
| `$nodeLabel.email.ccAddresses` | Анализиран CC списък |
| `$nodeLabel.email.replyToAddresses` | Анализиран reply-to списък |
| `$nodeLabel.email.text` | Тяло в plain-text |
| `$nodeLabel.email.html` | HTML тяло |
| `$nodeLabel.email.attachments` | Масив от метаданни за прикачени файлове (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Декодиран header обект |
| `$nodeLabel.email.uid` | IMAP UID за дедупликация или логване |
| `$nodeLabel.triggered_by` | Етикет на източника на trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID на node в canvas, който е открил имейла |
| `$nodeLabel.triggered_at` | ISO timestamp за изпълнението на workflow |

## Примерен workflow

**Входящ имейл за поддръжка → обобщаване → маршрутизиране**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** етикет: `supportInbox`
- **LLM** потребителско съобщение: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Бележки

- Много доставчици изискват **app password** за IMAP достъп вместо паролата на основния Ви акаунт.
- Съдържанието на прикачените файлове не се инжектира във входа на workflow; включват се само метаданните на прикачените файлове.
- Използвайте [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) или [DataTable](./datatable-node.md) надолу по веригата, за да маршрутизирате или логвате нови имейли.

## Свързани

- [Triggers](../reference/triggers.md) – Преглед на всички входни точки на workflow
- [Third-Party Integrations](../reference/integrations.md) – Настройка на IMAP удостоверение
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на `imap` удостоверения
- [Send Email](./send-email-node.md) – Отговор или препращане на входящи съобщения
