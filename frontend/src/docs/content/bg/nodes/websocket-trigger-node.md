# WebSocket Trigger

**WebSocket Trigger** node отваря изходяща клиентска връзка към външен WebSocket сървър и стартира workflow, когато настъпят избрани събития на socket. Използвайте го за потоци от събития като пазарни feeds, телеметрия или chat backplanes. Свързването към вътрешни realtime системи изисква отказа от private-URL защитата, описан по-долу.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Важно поведение

- Този node се свързва **от Heym към друг WebSocket сървър**.
- Той **не** предоставя WebSocket endpoint на Heym.
- Не се изисква [credential](../reference/credentials.md). Конфигурирайте URL, headers и subprotocols директно на node.
- Leader worker поддържа връзката отворена във фонов режим и се свързва отново, когато е разрешено.

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `websocketUrl` | string | Външен `ws://` или `wss://` URL |
| `websocketHeaders` | JSON object string | Опционални handshake headers |
| `websocketSubprotocols` | string | Опционален списък с subprotocols, разделени със запетая |
| `websocketTriggerEvents` | array | Всяко от `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Повторно свързване след прекъсване |
| `retryWaitSeconds` | integer | Забавяне преди повторно свързване |

## Излъчвани събития

### `onMessage`

Задейства се, когато пристигне frame от отдалечения socket.

Полезни полета:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.message.data` | Парснат JSON payload или сурова стойност на съобщението |
| `$nodeLabel.message.text` | UTF-8 декодиран текст, когато е наличен |
| `$nodeLabel.message.base64` | Двоичен payload като base64 |
| `$nodeLabel.message.sizeBytes` | Размер на payload |
| `$nodeLabel.message.isJson` | Дали съобщението е парснато като JSON |

### `onConnected`

Задейства се след успешно отваряне на socket.

Полезни полета:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` при първо свързване, `true` при следващи повторни свързвания |
| `$nodeLabel.connection.subprotocol` | Договорен subprotocol |

### `onClosed`

Задейства се, когато установена връзка се затвори.

Полезни полета:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` или `unknown` |
| `$nodeLabel.close.code` | WebSocket код за затваряне |
| `$nodeLabel.close.reason` | Причина за затваряне |
| `$nodeLabel.close.wasClean` | `true` при нормално затваряне с `1000` |
| `$nodeLabel.close.reconnecting` | Дали node ще се опита да се свърже отново |

## Семантика на Trigger

- Един активен node поддържа една дълготрайна изходяща socket връзка.
- Връзката работи само на leader worker, подобно на [IMAP Trigger](./imap-trigger-node.md) и режима за получаване на [RabbitMQ](./rabbitmq-node.md).
- Ако повторното свързване е разрешено, Heym изчаква `retryWaitSeconds` и отваря socket отново след прекъсване.
- Всяко излъчено събитие създава отделно изпълнение на workflow с `trigger_source = "websocket"`.

## Egress безопасност

- По подразбиране URL трябва да използва `ws://` или `wss://` и да се разрешава само до публични адреси. Loopback, private, link-local, multicast и cloud-metadata дестинации са блокирани.
- Heym валидира отново DNS при всяко повторно свързване, проверява всеки разрешен адрес и се свързва директно към един от тези адреси. Environment proxies и WebSocket redirects са забранени, докато защитата е активна.
- Постоянните нарушения на политиката спират trigger вместо да се опитват да се свържат отново безкрайно. Временните DNS или мрежови грешки все още следват настройките за повторен опит на node.
- `Authorization`, `Origin`, `User-Agent` и custom data headers се поддържат. `Origin` се изпраща чрез специалната опция на WebSocket клиента. `Host`, `Connection`, `Upgrade` и `Sec-WebSocket-*` headers не могат да бъдат заменяни.
- Доверени self-hosted deployment-и, които умишлено се свързват към вътрешни услуги, могат да зададат `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Запазете стойността по подразбиране при hosted или multi-tenant deployment-и.

**Бележка за надграждане до v0.0.105:** тази политика за цялата инстанция вече защитава и дестинации, произлизащи от credentials, използвани от Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, custom LLM execution и model discovery, AI assistant, guardrails и RAG embeddings. Съществуващи credentials, които сочат към loopback, private или link-local адреси, се отхвърлят, освен ако `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` не е разрешено на доверена self-hosted инстанция. Докато защитата е включена, guarded HTTP клиентите игнорират `HTTP_PROXY` и `HTTPS_PROXY`; разрешаването на отказа ги възстановява. Operator CA bundles, конфигурирани чрез `SSL_CERT_FILE` или `SSL_CERT_DIR`, остават поддържани. ClickHouse се проверява преди отваряне на връзката, но не се pin-ва по време на dial, тъй като clickhouse-connect носи собствен urllib3 транспорт.

## Примерен Workflow

**Външен поток от събития → филтър → известие**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** съобщение: `"Realtime alert: $streamEvent.message.data.title"`
## Примерен JSON за node

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

## Свързани

- [Triggers](../reference/triggers.md) – Архитектура на фоновите trigger-и и `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Изпращане на данни към външен socket от стъпка на workflow
- [Node Types](../reference/node-types.md) – Преглед на всички nodes
- [Third-Party Integrations](../reference/integrations.md) – Кои nodes използват удостоверения и кои не
