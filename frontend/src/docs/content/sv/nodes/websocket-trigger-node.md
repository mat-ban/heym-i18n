# WebSocket-Trigger

Noden **WebSocket-Trigger** öppnar en utgående klientanslutning till en extern WebSocket-server och startar workflowet när valda socket-händelser inträffar. Den används för händelseströmmar som marknadsflöden, telemetri eller chatt-backends. Anslutning till interna realtidssystem kräver det opt-out för privata URL:er som beskrivs nedan.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Viktigt beteende

- Denna nod ansluter **från Heym till en annan WebSocket-server**.
- Den exponerar **inte** någon WebSocket-endpoint på Heym.
- Ingen [autentiseringsuppgift](../reference/credentials.md) krävs. URL, headers och subprotokoll konfigureras direkt på noden.
- Leader-workern håller anslutningen öppen i bakgrunden och återansluter när detta är aktiverat.

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `websocketUrl` | string | Extern `ws://`- eller `wss://`-URL |
| `websocketHeaders` | JSON object string | Valfria handshake-headers |
| `websocketSubprotocols` | string | Valfri kommaseparerad lista över subprotokoll |
| `websocketTriggerEvents` | array | Någon av `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Återanslut efter en frånkoppling |
| `retryWaitSeconds` | integer | Fördröjning innan återanslutning |

## Utlösta händelser

### `onMessage`

Utlöses när en frame anländer från den externa socketen.

Användbara fält:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.message.data` | Parsad JSON-payload eller rå meddelandevärde |
| `$nodeLabel.message.text` | UTF-8-avkodad text när sådan finns |
| `$nodeLabel.message.base64` | Binär payload som base64 |
| `$nodeLabel.message.sizeBytes` | Payloadens storlek |
| `$nodeLabel.message.isJson` | Huruvida meddelandet parsades som JSON |

### `onConnected`

Utlöses efter att socketen har öppnats framgångsrikt.

Användbara fält:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.connection.reconnected` | `false` vid första anslutningen, `true` vid senare återanslutningar |
| `$nodeLabel.connection.subprotocol` | Förhandlat subprotokoll |

### `onClosed`

Utlöses när en etablerad anslutning stängs.

Användbara fält:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` eller `unknown` |
| `$nodeLabel.close.code` | WebSocket-stängningskod |
| `$nodeLabel.close.reason` | Orsak till stängning |
| `$nodeLabel.close.wasClean` | `true` vid normal stängning med `1000` |
| `$nodeLabel.close.reconnecting` | Huruvida noden kommer att försöka återansluta |

## Trigger-semantik

- En aktiv nod håller en långlivad utgående socket-anslutning.
- Anslutningen körs endast på leader-workern, på samma sätt som [IMAP-Trigger](./imap-trigger-node.md) och [RabbitMQ](./rabbitmq-node.md) i mottagsläge.
- Om återanslutning är aktiverad väntar Heym `retryWaitSeconds` och öppnar socketen igen efter ett avbrott.
- Varje utlöst händelse skapar en separat workflow-körning med `trigger_source = "websocket"`.

## Egress-säkerhet

- Som standard måste URL:en använda `ws://` eller `wss://` och endast matcha publika adresser. Loopback-, privata, link-local-, multicast- och molnmetadata-destinationer blockeras.
- Heym validerar DNS på nytt vid varje återanslutning, validerar varje matchad adress och ansluter direkt till en av dessa adresser. Miljöproxies och WebSocket-omdirigeringar är inaktiverade medan skyddet är aktivt.
- Permanenta policyöverträdelser stoppar triggern istället för att försöka igen i oändlighet. Tillfälliga DNS- eller nätverksfel följer fortfarande nodens återanslutningsinställningar.
- `Authorization`, `Origin`, `User-Agent` och anpassade data-headers stöds. `Origin` skickas via WebSocket-klientens dedikerade alternativ. `Host`, `Connection`, `Upgrade` och `Sec-WebSocket-*`-headers kan inte åsidosättas.
- Betrodda självhostade installationer som avsiktligt ansluter till interna tjänster kan sätta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behåll standardvärdet på hostade eller multi-tenant-installationer.

**Uppgraderingsnotering för v0.0.105:** denna instansövergripande policy skyddar nu även autentiseringsuppgiftshärledda destinationer som används av Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, anpassad LLM-körning och modellupptäckt, AI-assistenten, guardrails och RAG-embeddings. Befintliga autentiseringsuppgifter som pekar på loopback-, privata eller link-local-adresser avvisas om inte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` är aktiverat på en betrodd självhostad instans. Medan skyddet är på ignoreras `HTTP_PROXY` och `HTTPS_PROXY` av skyddade HTTP-klienter; aktivering av opt-out återställer dem. Operatörens CA-paket som konfigurerats via `SSL_CERT_FILE` eller `SSL_CERT_DIR` stöds fortfarande. ClickHouse kontrolleras innan anslutningen öppnas men låses inte vid uppringningstillfället, eftersom clickhouse-connect har sin egen urllib3-transport.

## Exempel på workflow

**Extern händelseström → filter → avisering**

```
websocketTrigger → condition → slack
```

- **WebSocket-Trigger**-etikett: `streamEvent`
- **Villkor**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack**-meddelande: `"Realtime alert: $streamEvent.message.data.title"`
## Exempel på nod-JSON

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

## Relaterat

- [Triggers](../reference/triggers.md) – Arkitektur för bakgrundstriggers och `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Skicka data till en extern socket från ett workflow-steg
- [Nodtyper](../reference/node-types.md) – Översikt över alla noder
- [Tredjepartsintegrationer](../reference/integrations.md) – Vilka noder som använder autentiseringsuppgifter och vilka som inte gör det
