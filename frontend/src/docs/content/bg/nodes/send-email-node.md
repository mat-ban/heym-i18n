# Изпращане на имейл

**Send Email** node изпраща имейли чрез SMTP. Използвайте го за нотификации, известия и транзакционни имейли.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `to` | expression | Получател(и). Разделени със запетая за няколко получатели. |
| `cc` | expression | Получател(и) в копие. Разделени със запетая за няколко получатели. |
| `bcc` | expression | Скрити получател(и) в копие. Разделени със запетая за няколко получатели. Скрити от останалите получатели. |
| `subject` | expression | Тема на имейла |
| `emailBody` | expression | Съдържание на тялото на имейла |
| `attachments` | expression | Разделени със запетая ID-та на файлове от [Drive](./drive-node.md) за прикачване. Могат да бъдат прикачени само файлове, собственост на притежателя на workflow или споделени с един от неговите екипи. |

## Прикачени файлове

Прикачете файлове от Вашия [Drive](./drive-node.md), като подадете едно или повече ID-та на файлове от Drive към полето `attachments`. Използвайте `$` expression, за да реферирате изхода `id` на предходен Drive node (например `$drive.id`), или избройте статични ID-та, разделени със запетаи. Всяко ID се разрешава в обхвата на притежателя на workflow; невалидно или недостъпно ID води до неуспех на node вместо изпращане на частичен имейл.

## Настройка

Добавете SMTP удостоверение със сървър, порт, имейл и парола. Видимият подател е незадължителното поле **From** на удостоверението; при празно From изпращането става от името на потребителското име. Често използвани SMTP сървъри:

- Gmail: `smtp.gmail.com`, порт 587 (изисква се App Password)
- Outlook: `smtp.office365.com`, порт 587

## Пример

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Стойността на `attachments` по-горе реферира предходен [Drive](./drive-node.md) node с етикет `drive`, прикачвайки файла, който той е създал.

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Error Handler](./error-handler-node.md) – Изпращане на имейл при грешка
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на SMTP удостоверения
- [Интеграции с трети страни](../reference/integrations.md#smtp-email) – Настройка на SMTP доставчик (Gmail, Outlook, Mailgun, SendGrid)
