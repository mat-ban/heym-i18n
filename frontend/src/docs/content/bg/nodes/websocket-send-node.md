# WebSocket Send

Възелът **WebSocket Send** отваря изходяща клиентска връзка към външен WebSocket сървър, изпраща едно съобщение и затваря връзката. Използвайте го, когато даден workflow трябва да изпраща събития към система в реално време, без да expose-ва WebSocket endpoint, притежаван от Heym.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Външен `ws://` или `wss://` URL |
| `websocketHeaders` | JSON object string / expression | Опционални handshake headers |
| `websocketSubprotocols` | string | Опционален списък с subprotocols, разделени със запетая |
| `websocketMessage` | expression | Payload за изпращане |

## Правила за сериализация на съобщения

- Ако `websocketMessage` се resolve-не до **string**, Heym изпраща текстов frame.
- Ако се resolve-не до **object**, **array**, **number**, **boolean** или `null`, Heym го сериализира като JSON текст.
- Ако се resolve-не до **bytes**, Heym изпраща бинарен frame.
- Пълни изрази като `$input` запазват native типовете преди сериализация.

## Полета на изхода

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` при успех |
| `$nodeLabel.url` | Resolve-нат URL на дестинацията |
| `$nodeLabel.message_type` | `text`, `json` или `binary` |
| `$nodeLabel.size_bytes` | Размер на payload-а в байтове |
| `$nodeLabel.subprotocol` | Договорен subprotocol, когато е наличен |
| `$nodeLabel.sent_at` | ISO timestamp |

## Примерен workflow

**HTTP заявка → трансформация → публикуване през WebSocket**

```
input → set → websocketSend → output
```

- **Set** създава payload обект като `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** използва `$payloadNode` като `websocketMessage`
- **Output** може да върне `$socketSend.status`

## Примерен JSON на възел

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

## Бележки

- Не се изисква [credential](../reference/credentials.md) за този възел.
- Ако отдалеченият сървър очаква auth или tenant headers, подайте ги чрез `websocketHeaders`.
- Използвайте [HTTP](./http-node.md), когато отдалечената система е базирана на заявка/отговор, а не на socket.

## Egress Safety

- По подразбиране URL-ът трябва да използва `ws://` или `wss://` и да resolve-ва само до публични адреси. Loopback, private, link-local, multicast и cloud-metadata дестинации са блокирани.
- Heym валидира всеки resolve-нат адрес и се свързва директно към един от тези адреси. Environment proxies и WebSocket redirects са деактивирани, докато guard-ът е активен.
- `Authorization`, `Origin`, `User-Agent` и custom data headers се поддържат. `Origin` се изпраща чрез специалната опция на WebSocket клиента. `Host`, `Connection`, `Upgrade` и `Sec-WebSocket-*` headers не могат да бъдат override-вани.
- Trusted self-hosted deployment-и, които умишлено се свързват към вътрешни услуги, могат да зададат `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Запазете стойността по подразбиране при hosted или multi-tenant deployment-и.

**Бележка за upgrade към v0.0.105:** тази instance-wide политика вече защитава и дестинации, произлизащи от credentials, използвани от Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, custom LLM execution и model discovery, AI assistant, guardrails и RAG embeddings. Съществуващи credentials, които сочат към loopback, private или link-local адреси, се отхвърлят, освен ако `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` не е разрешено на trusted self-hosted instance. Докато guard-ът е включен, guarded HTTP клиентите игнорират `HTTP_PROXY` и `HTTPS_PROXY`; разрешаването на opt-out ги възстановява. Operator CA bundles, конфигурирани чрез `SSL_CERT_FILE` или `SSL_CERT_DIR`, остават поддържани. ClickHouse се проверява преди отваряне на връзката, но не се pin-ва към момента на dial, тъй като clickhouse-connect носи собствен urllib3 транспорт.

## Свързани

- [WebSocket Trigger](./websocket-trigger-node.md) – Слушане на външен socket и trigger-ване на workflows при събития
- [Node Types](../reference/node-types.md) – Преглед на integration възлите
- [Expression DSL](../reference/expression-dsl.md) – Създаване на динамични JSON payload-и
- [Third-Party Integrations](../reference/integrations.md) – Credential-backed спрямо direct-config интеграции
