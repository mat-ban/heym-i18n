# Discord

**Вузол Discord** надсилає повідомлення до каналу Discord через Incoming Webhook. Використовуйте його для сповіщень, повідомлень про виконання workflow, відповідей у стилі бота та звітування про помилки.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вивід | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані `discord`, що містять URL вхідного webhook |
| `message` | expression | Текст вихідного повідомлення. Підтримує [вирази](../reference/expression-dsl.md). |
| `username` | expression | Необов'язкове перевизначення відображуваного імені для цього повідомлення |
| `avatarUrl` | expression | Необов'язкове перевизначення URL аватара для цього повідомлення |

## Налаштування

1. Створіть [облікові дані Discord Webhook](../reference/integrations.md#discord)
2. Додайте **вузол Discord** до свого workflow
3. Виберіть облікові дані
4. Встановіть `message` як вихідний текст або шаблон, побудований з даних попередніх вузлів
5. За потреби перевизначте відображувані `username` та `avatarUrl`

## Приклад

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Поля виводу

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.status` | Код стану HTTP, повернутий Discord, зазвичай `204` у разі успіху |
| `$nodeLabel.response` | Необроблене тіло відповіді, повернуте webhook Discord |
| `$nodeLabel.message` | Текст повідомлення, надісланого Heym |
| `$nodeLabel.username` | Ім'я користувача, надіслане разом із webhook, якщо вказано |
| `$nodeLabel.avatar_url` | URL аватара, надісланий разом із webhook, якщо вказано |

## Типові сценарії

- Використовуйте його разом із [Discord Trigger](./discord-trigger-node.md), коли потрібне додаткове повідомлення в каналі поза відповіддю на взаємодію
- Надсилайте повідомлення про збої з [Error Handler](./error-handler-node.md)
- Публікуйте зведення, згенеровані [LLM](./llm-node.md) або [Agent](./agent-node.md)

## Безпека вихідних з'єднань

- URL webhook, збережений в облікових даних, має використовувати `http://` або `https://` та розпізнаватися лише на публічні адреси. Адреси зворотного зв'язку (loopback), приватні, локальні (link-local), багатоадресні (multicast) та призначені для хмарних метаданих блокуються.
- Heym перевіряє розпізнані адреси та фіксує цільове з'єднання перед надсиланням, тож відповідь DNS не може перемістити запит на внутрішню адресу після перевірки. Проксі середовища вимикаються, поки активний захист, а переспрямування не виконуються.
- Розгортання, що надсилають запити до внутрішнього отримувача webhook, можуть встановити `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` на довіреному самостійно розміщеному екземплярі. Зберігайте значення за замовчуванням на розміщених або багатокористувацьких розгортаннях.

**Примітка щодо оновлення до v0.0.109:** ця перевірка є новою для Discord. Облікові дані, URL webhook яких вказує на loopback або приватну адресу, відхиляються, якщо не увімкнено наведене вище налаштування.

## Пов'язані розділи

- [Discord Trigger](./discord-trigger-node.md) – Запуск workflow із вхідних взаємодій Discord
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними `discord`
- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
