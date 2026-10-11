# Надсилання електронної пошти

Вузол **Надсилання електронної пошти** надсилає листи через SMTP. Використовуйте його для сповіщень, оповіщень та транзакційних листів.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані SMTP з [Облікових даних](../tabs/credentials-tab.md) |
| `to` | expression | Отримувач(і). Для кількох — через кому. |
| `cc` | expression | Отримувач(і) копії. Для кількох — через кому. |
| `bcc` | expression | Отримувач(і) прихованої копії. Для кількох — через кому. Приховані від інших отримувачів. |
| `subject` | expression | Тема листа |
| `emailBody` | expression | Вміст тіла листа |
| `attachments` | expression | Ідентифікатори файлів [Drive](./drive-node.md), розділені комами, для прикріплення. Прикріпити можна лише файли, що належать власнику workflow або надані одній з його команд. |

## Вкладення

Прикріплюйте файли зі свого [Drive](./drive-node.md), передаючи один або кілька ідентифікаторів файлів Drive у поле `attachments`. Використовуйте вираз `$` для посилання на вихід `id` вузла Drive вище за потоком (наприклад, `$drive.id`) або перелічіть статичні ідентифікатори, розділені комами. Кожен ідентифікатор визначається в області власника workflow; недійсний або недоступний ідентифікатор призводить до помилки вузла, а не до надсилання часткового листа.

## Налаштування

Додайте облікові дані SMTP із зазначенням сервера, порту, електронної пошти та пароля. Поширені SMTP-сервери:

- Gmail: `smtp.gmail.com`, порт 587 (потрібен пароль застосунку)
- Outlook: `smtp.office365.com`, порт 587

## Приклад

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

Значення `attachments` вище посилається на вузол [Drive](./drive-node.md) вище за потоком із міткою `drive`, прикріплюючи створений ним файл.

## Пов'язане

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Обробник помилок](./error-handler-node.md) – Надсилання листа в разі збою
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних SMTP
- [Сторонні інтеграції](../reference/integrations.md#smtp-email) – Налаштування SMTP-провайдера (Gmail, Outlook, Mailgun, SendGrid)
