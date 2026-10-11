# WebSocket Send

Вузол **WebSocket Send** відкриває вихідне клієнтське з'єднання із зовнішнім WebSocket-сервером, надсилає одне повідомлення та закриває з'єднання. Використовуйте його, коли workflow потрібно передати події до системи реального часу, не відкриваючи власний socket endpoint, яким керує Heym.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Зовнішня URL-адреса `ws://` або `wss://` |
| `websocketHeaders` | JSON object string / expression | Необов'язкові заголовки handshake |
| `websocketSubprotocols` | string | Необов'язковий список subprotocol, розділений комами |
| `websocketMessage` | expression | Payload для надсилання |

## Правила серіалізації повідомлень

- Якщо `websocketMessage` обчислюється у **string**, Heym надсилає текстове повідомлення (text frame).
- Якщо воно обчислюється у **object**, **array**, **number**, **boolean** або `null`, Heym серіалізує його як текст JSON.
- Якщо воно обчислюється у **bytes**, Heym надсилає бінарне повідомлення (binary frame).
- Повні вирази, як-от `$input`, зберігають нативні типи до серіалізації.

## Поля виходу

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` у разі успіху |
| `$nodeLabel.url` | Обчислена URL-адреса призначення |
| `$nodeLabel.message_type` | `text`, `json` або `binary` |
| `$nodeLabel.size_bytes` | Розмір payload у байтах |
| `$nodeLabel.subprotocol` | Узгоджений subprotocol, якщо наявний |
| `$nodeLabel.sent_at` | Мітка часу у форматі ISO |

## Приклад workflow

**HTTP-запит → перетворення → публікація через WebSocket**

```
input → set → websocketSend → output
```

- **Set** створює об'єкт payload, наприклад `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** використовує `$payloadNode` як `websocketMessage`
- **Output** може повертати `$socketSend.status`

## Приклад JSON вузла

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Примітки

- Для цього вузла не потрібні [облікові дані](../reference/credentials.md).
- Якщо віддалений сервер очікує заголовки автентифікації або заголовки тенанта, передайте їх через `websocketHeaders`.
- Використовуйте [HTTP](./http-node.md), коли віддалена система працює за принципом запит/відповідь, а не на основі сокетів.

## Безпека вихідного трафіку

- За замовчуванням URL-адреса має використовувати `ws://` або `wss://` і розпізнаватися лише на публічні адреси. Адреси loopback, приватні, link-local, multicast та адреси хмарних метаданих заблоковано.
- Heym перевіряє кожну розпізнану адресу та підключається безпосередньо до однієї з них. Проксі середовища та WebSocket-перенаправлення вимкнено, поки активний захист.
- Підтримуються заголовки `Authorization`, `Origin`, `User-Agent` і користувацькі заголовки даних. `Origin` надсилається через спеціальний параметр WebSocket-клієнта. Заголовки `Host`, `Connection`, `Upgrade` та `Sec-WebSocket-*` перевизначити неможливо.
- Довірені self-hosted розгортання, які навмисно підключаються до внутрішніх сервісів, можуть встановити `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Залишайте значення за замовчуванням на hosted або multi-tenant розгортаннях.

**Примітка щодо оновлення до v0.0.105:** ця політика на рівні інстансу тепер також захищає призначення, похідні від облікових даних, які використовуються Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, користувацьким виконанням LLM і виявленням моделей, AI-асистентом, guardrails та RAG-ембедінгами. Наявні облікові дані, що вказують на адреси loopback, приватні або link-local, відхиляються, якщо `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` не увімкнено на довіреному self-hosted інстансі. Поки захист увімкнено, захищені HTTP-клієнти ігнорують `HTTP_PROXY` та `HTTPS_PROXY`; увімкнення відмови від захисту відновлює їх. Набори CA оператора, налаштовані через `SSL_CERT_FILE` або `SSL_CERT_DIR`, залишаються підтримуваними. ClickHouse перевіряється до відкриття з'єднання, але не закріплюється в момент встановлення з'єднання, оскільки clickhouse-connect використовує власний транспорт urllib3.

## Пов'язане

- [WebSocket Trigger](./websocket-trigger-node.md) – Прослуховування зовнішнього сокета та запуск workflow за подіями
- [Node Types](../reference/node-types.md) – Огляд інтеграційних вузлів
- [Expression DSL](../reference/expression-dsl.md) – Створення динамічних JSON payload
- [Third-Party Integrations](../reference/integrations.md) – Інтеграції на основі облікових даних проти інтеграцій із прямим налаштуванням
