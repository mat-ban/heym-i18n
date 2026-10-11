# WebSocket Trigger

Вузол **WebSocket Trigger** відкриває вихідне клієнтське з'єднання до зовнішнього WebSocket-сервера та запускає workflow, коли відбуваються вибрані події сокета. Використовуйте його для потоків подій, як-от ринкові фіди, телеметрія або чат-бекплейни. Підключення до внутрішніх систем реального часу потребує відмови від приватних URL, описаної нижче.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Важлива поведінка

- Цей вузол підключається **від Heym до іншого WebSocket-сервера**.
- Він **не** надає WebSocket endpoint на боці Heym.
- [Облікові дані](../reference/credentials.md) не потрібні. Налаштуйте URL, headers і subprotocols безпосередньо на вузлі.
- Лідерний worker утримує з'єднання відкритим у фоновому режимі та повторно підключається, коли це увімкнено.

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `websocketUrl` | string | Зовнішній URL `ws://` або `wss://` |
| `websocketHeaders` | JSON object string | Необов'язкові headers рукостискання |
| `websocketSubprotocols` | string | Необов'язковий список subprotocols, розділених комами |
| `websocketTriggerEvents` | array | Будь-яке з `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Повторне підключення після роз'єднання |
| `retryWaitSeconds` | integer | Затримка перед повторним підключенням |

## Події, що генеруються

### `onMessage`

Спрацьовує, коли від віддаленого сокета надходить кадр.

Корисні поля:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.message.data` | Розібраний JSON payload або необроблене значення повідомлення |
| `$nodeLabel.message.text` | Текст, декодований у UTF-8, коли доступний |
| `$nodeLabel.message.base64` | Бінарний payload у кодуванні base64 |
| `$nodeLabel.message.sizeBytes` | Розмір payload |
| `$nodeLabel.message.isJson` | Чи було повідомлення розібрано як JSON |

### `onConnected`

Спрацьовує після успішного відкриття сокета.

Корисні поля:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` під час першого підключення, `true` під час наступних повторних підключень |
| `$nodeLabel.connection.subprotocol` | Узгоджений subprotocol |

### `onClosed`

Спрацьовує, коли встановлене з'єднання закривається.

Корисні поля:

| Вираз | Опис |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` або `unknown` |
| `$nodeLabel.close.code` | Код закриття WebSocket |
| `$nodeLabel.close.reason` | Причина закриття |
| `$nodeLabel.close.wasClean` | `true` для нормального закриття з кодом `1000` |
| `$nodeLabel.close.reconnecting` | Чи намагатиметься вузол повторно підключитися |

## Семантика Trigger

- Один активний вузол утримує одне довготривале вихідне з'єднання сокета.
- З'єднання працює лише на лідерному worker, подібно до [IMAP Trigger](./imap-trigger-node.md) та режиму отримання [RabbitMQ](./rabbitmq-node.md).
- Якщо повторне підключення увімкнено, Heym очікує `retryWaitSeconds` і знову відкриває сокет після розриву.
- Кожна згенерована подія створює окремий запуск workflow з `trigger_source = "websocket"`.

## Безпека вихідного трафіку

- За замовчуванням URL має використовувати `ws://` або `wss://` і розпізнаватися лише на публічні адреси. Адреси loopback, приватні, link-local, multicast і призначення cloud-metadata заблоковані.
- Heym повторно перевіряє DNS під час кожного повторного підключення, перевіряє кожну розпізнану адресу та підключається безпосередньо до однієї з цих адрес. Проксі середовища та перенаправлення WebSocket вимкнено, поки активний захист.
- Остаточні порушення політики зупиняють trigger, а не повторюють спроби нескінченно. Тимчасові збої DNS або мережі все ще підпадають під налаштування повторних спроб вузла.
- Підтримуються `Authorization`, `Origin`, `User-Agent` і headers користувацьких даних. `Origin` надсилається через спеціальний параметр клієнта WebSocket. Headers `Host`, `Connection`, `Upgrade` і `Sec-WebSocket-*` не можна перевизначити.
- Довірені розгортання на власних серверах, які навмисно підключаються до внутрішніх сервісів, можуть встановити `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Зберігайте значення за замовчуванням на хостованих або мультитенантних розгортаннях.

**Примітка щодо оновлення до v0.0.105:** ця політика на рівні всього інстансу тепер також захищає призначення, похідні від облікових даних, які використовуються Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, користувацьким виконанням LLM і виявленням моделей, AI-асистентом, guardrails і RAG-ембедінгами. Наявні облікові дані, що вказують на адреси loopback, приватні або link-local, відхиляються, якщо `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` не увімкнено на довіреному інстансі, розгорнутому самостійно. Поки захист увімкнено, захищені HTTP-клієнти ігнорують `HTTP_PROXY` і `HTTPS_PROXY`; увімкнення відмови відновлює їх. Пакети CA оператора, налаштовані через `SSL_CERT_FILE` або `SSL_CERT_DIR`, залишаються підтримуваними. ClickHouse перевіряється перед відкриттям з'єднання, але не закріплюється під час встановлення з'єднання, оскільки clickhouse-connect використовує власний транспорт urllib3.

## Приклад Workflow

**Зовнішній потік подій → фільтр → сповіщення**

```
websocketTrigger → condition → slack
```

- Мітка **WebSocket Trigger**: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- Повідомлення **Slack**: `"Realtime alert: $streamEvent.message.data.title"`
## Приклад JSON вузла

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Пов'язані матеріали

- [Тригери](../reference/triggers.md) – Архітектура фонових тригерів та `trigger_source`
- [Надсилання WebSocket](./websocket-send-node.md) – Передавання даних до зовнішнього сокета з кроку workflow
- [Типи вузлів](../reference/node-types.md) – Огляд усіх вузлів
- [Сторонні інтеграції](../reference/integrations.md) – Які вузли використовують облікові дані, а які — ні
