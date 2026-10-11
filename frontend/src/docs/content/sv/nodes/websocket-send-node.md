# WebSocket Send

Noden **WebSocket Send** öppnar en utgående klientanslutning till en extern WebSocket-server, skickar ett meddelande och stänger anslutningen. Den används när ett workflow behöver skicka händelser till ett realtidssystem utan att exponera en socket-endpoint som ägs av Heym.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `websocketUrl` | string / uttryck | Extern `ws://`- eller `wss://`-URL |
| `websocketHeaders` | JSON-objekt som sträng / uttryck | Valfria handshake-headers |
| `websocketSubprotocols` | string | Valfri kommaseparerad lista över subprotokoll |
| `websocketMessage` | uttryck | Payload som ska skickas |

## Regler för meddelandeserialisering

- Om `websocketMessage` utvärderas till en **sträng** skickar Heym en textram.
- Om det utvärderas till ett **objekt**, en **array**, ett **nummer**, ett **booleskt värde** eller `null` serialiserar Heym det som JSON-text.
- Om det utvärderas till **bytes** skickar Heym en binär ram.
- Fullständiga uttryck som `$input` bevarar sina ursprungliga typer före serialisering.

## Utdatafält

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.status` | `"sent"` vid lyckat resultat |
| `$nodeLabel.url` | Upplöst mål-URL |
| `$nodeLabel.message_type` | `text`, `json` eller `binary` |
| `$nodeLabel.size_bytes` | Payloadens storlek i byte |
| `$nodeLabel.subprotocol` | Förhandlat subprotokoll när sådant finns |
| `$nodeLabel.sent_at` | ISO-tidsstämpel |

## Exempel på workflow

**HTTP-begäran → transformering → publicering över WebSocket**

```
input → set → websocketSend → output
```

- **Set** skapar ett payload-objekt som `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** använder `$payloadNode` som `websocketMessage`
- **Output** kan returnera `$socketSend.status`

## Exempel på nod-JSON

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

## Anmärkningar

- Ingen [autentiseringsuppgift](../reference/credentials.md) krävs för denna nod.
- Om fjärrservern förväntar sig autentiserings- eller tenant-headers skickas dessa via `websocketHeaders`.
- Använd [HTTP](./http-node.md) när fjärrsystemet är baserat på begäran/svar i stället för socket.

## Egress-säkerhet

- Som standard måste URL:en använda `ws://` eller `wss://` och endast matcha publika adresser. Loopback-, privata, link-local-, multicast- och molnmetadata-destinationer blockeras.
- Heym validerar varje upplöst adress och ansluter direkt till en av dessa adresser. Miljöproxies och WebSocket-omdirigeringar är inaktiverade medan skyddet är aktivt.
- `Authorization`, `Origin`, `User-Agent` och anpassade data-headers stöds. `Origin` skickas via WebSocket-klientens dedikerade alternativ. `Host`, `Connection`, `Upgrade` och `Sec-WebSocket-*`-headers kan inte åsidosättas.
- Betrodda självhostade distributioner som avsiktligt ansluter till interna tjänster kan sätta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behåll standardvärdet på hostade eller multi-tenant-distributioner.

**Uppgraderingsnotis för v0.0.105:** denna instansövergripande policy skyddar nu även autentiseringshärledda destinationer som används av Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, anpassad LLM-körning och modellupptäckt, AI-assistenten, guardrails och RAG-embeddings. Befintliga autentiseringsuppgifter som pekar på loopback-, privata eller link-local-adresser avvisas om inte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` är aktiverat på en betrodd självhostad instans. Medan skyddet är på ignoreras `HTTP_PROXY` och `HTTPS_PROXY` av skyddade HTTP-klienter; aktivering av opt-out återställer dem. Operatörens CA-paket som konfigurerats via `SSL_CERT_FILE` eller `SSL_CERT_DIR` stöds fortfarande. ClickHouse kontrolleras innan anslutningen öppnas men fästs inte vid uppringningstillfället, eftersom clickhouse-connect har sin egen urllib3-transport.

## Relaterat

- [WebSocket Trigger](./websocket-trigger-node.md) – Lyssna på en extern socket och utlös workflows vid händelser
- [Nodtyper](../reference/node-types.md) – Översikt över integrationsnoder
- [Expression DSL](../reference/expression-dsl.md) – Bygg dynamiska JSON-payloads
- [Tredjepartsintegrationer](../reference/integrations.md) – Integreringar med autentiseringsuppgifter kontra direktkonfiguration
