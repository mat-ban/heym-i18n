# WebSocket Trigger

**WebSocket Trigger**-noden etablerer en udgående klientforbindelse til en ekstern WebSocket-server og starter workflowet ved valgte socket-hændelser. Anvend den til event-streams som markedsdatafeed, telemetri eller chat-backplanes. Forbindelse til interne realtidssystemer kræver fravalg af privat-URL-beskyttelse som beskrevet nedenfor.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Vigtig adfærd

- Denne node opretter forbindelse **fra Heym til en anden WebSocket-server**.
- Den eksponerer **ikke** et WebSocket-endpoint på Heym.
- Ingen [legitimationsoplysninger](../reference/credentials.md) kræves. URL, headers og subprotokoller konfigureres direkte på noden.
- Leader-worker'en vedligeholder forbindelsen i baggrunden og genopretter den, når den er aktiveret.

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `websocketUrl` | string | Ekstern `ws://` eller `wss://` URL |
| `websocketHeaders` | JSON-objektstreng | Valgfrie håndtryks-headers |
| `websocketSubprotocols` | string | Valgfri kommasepareret subprotokol-liste |
| `websocketTriggerEvents` | array | En af `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Genopret forbindelse efter afbrydelse |
| `retryWaitSeconds` | integer | Ventetid før genoprettelse |

## Udstedte hændelser

### `onMessage`

Udløses, når en frame ankommer fra den eksterne socket.

Brugbare felter:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.message.data` | Parset JSON-payload eller rå meddelelsesværdi |
| `$nodeLabel.message.text` | UTF-8-dekodet tekst, når tilgængelig |
| `$nodeLabel.message.base64` | Binær payload som base64 |
| `$nodeLabel.message.sizeBytes` | Payload-størrelse |
| `$nodeLabel.message.isJson` | Om meddelelsen blev parset som JSON |

### `onConnected`

Udløses efter succesfuld åbning af socket.

Brugbare felter:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` ved første forbindelse, `true` ved senere genoprettelser |
| `$nodeLabel.connection.subprotocol` | Forhandlet subprotokol |

### `onClosed`

Udløses ved lukning af en etableret forbindelse.

Brugbare felter:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` eller `unknown` |
| `$nodeLabel.close.code` | WebSocket-lukkekode |
| `$nodeLabel.close.reason` | Lukningsårsag |
| `$nodeLabel.close.wasClean` | `true` for normal `1000`-lukning |
| `$nodeLabel.close.reconnecting` | Om noden vil forsøge genoprettelse |

## Trigger-semantik

- En aktiv node vedligeholder én langvarig udgående socket-forbindelse.
- Forbindelsen kører kun på leader-worker'en, svarende til [IMAP Trigger](./imap-trigger-node.md) og [RabbitMQ](./rabbitmq-node.md) modtagelsestilstand.
- Hvis genoprettelse er aktiveret, venter Heym `retryWaitSeconds` og åbner socket'en igen efter afbrydelse.
- Hver udløst hændelse skaber en separat workflow-kørsel med `trigger_source = "websocket"`.

## Egress-sikkerhed

- Som standard skal URL'en bruge `ws://` eller `wss://` og kun opløse til offentlige adresser. Loopback, private, link-local, multicast og cloud-metadata-destinationer blokeres.
- Heym validerer DNS ved hver genoprettelse, validerer hver opløst adresse og forbinder direkte til en af disse adresser. Miljøproxier og WebSocket-omdirigeringer deaktiveres, mens beskyttelsen er aktiv.
- Permanente politikbrud stopper triggeren i stedet for at forsøge uendeligt. Midlertidige DNS- eller netværksfejl følger stadig nodens genopretningsindstillinger.
- `Authorization`, `Origin`, `User-Agent` og brugerdefinerede data-headers understøttes. `Origin` sendes gennem WebSocket-klientens dedikerede option. `Host`, `Connection`, `Upgrade` og `Sec-WebSocket-*`-headers kan ikke tilsidesættes.
- Selvhostede installationer, der med vilje forbinder til interne tjenester, kan sætte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Bevar standardindstillingen på hostede eller multi-tenant-installationer.

**Opgraderingsnote for v0.0.105:** Denne instansvide politik beskytter nu også credential-afledte destinationer brugt af Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, brugerdefineret LLM-udførelse og modeldiscovery, AI-assistenten, guardrails og RAG-embeddings. Eksisterende legitimationsoplysninger, der peger på loopback-, private eller link-local-adresser, afvises, medmindre `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` er aktiveret på en pålidelig selvhostet instans. Mens beskyttelsen er aktiv, ignorerer beskyttede HTTP-klienter `HTTP_PROXY` og `HTTPS_PROXY`; aktivering af fravalget gendanner dem. Operatør-CA-bundles konfigureret via `SSL_CERT_FILE` eller `SSL_CERT_DIR` understøttes stadig. ClickHouse kontrolleres før forbindelsen åbnes, men er ikke pinned ved dial-tid, da clickhouse-connect medbringer sin egen urllib3-transport.

## Eksempel-workflow

**Ekstern event-stream → filter → notifikation**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack**-meddelelse: `"Realtime alert: $streamEvent.message.data.title"`
## Eksempel på Node JSON

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

## Relateret

- [Triggers](../reference/triggers.md) – Baggrundsarkitektur for triggers og `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Sender data til en ekstern socket fra et workflow-trins
- [Node-typer](../reference/node-types.md) – Oversigt over alle noder
- [Tredjepartsintegrationer](../reference/integrations.md) – Hvilke noder anvender legitimationsoplysninger og hvilke gør ikke
