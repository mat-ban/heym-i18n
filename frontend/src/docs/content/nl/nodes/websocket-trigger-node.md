# WebSocket Trigger

De **WebSocket Trigger**-node opent een uitgaande clientverbinding naar een externe WebSocket-server en start de workflow wanneer geselecteerde socket-events plaatsvinden. Gebruik deze voor eventstromen zoals marktfeeds, telemetrie of chat-backplanes. Voor het verbinden met interne realtime-systemen is de hieronder beschreven opt-out voor private URL's vereist.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Belangrijk gedrag

- Deze node maakt **vanuit Heym verbinding met een andere WebSocket-server**.
- De node biedt **geen** WebSocket-endpoint aan op Heym.
- Er is geen [referentie](../reference/credentials.md) vereist. Configureer URL, headers en subprotocollen rechtstreeks op de node.
- De leader worker houdt de verbinding op de achtergrond open en maakt opnieuw verbinding wanneer dit is ingeschakeld.

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `websocketUrl` | string | Externe `ws://`- of `wss://`-URL |
| `websocketHeaders` | JSON object string | Optionele handshake-headers |
| `websocketSubprotocols` | string | Optionele kommagescheiden lijst met subprotocollen |
| `websocketTriggerEvents` | array | Een van `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Opnieuw verbinden na een verbreking |
| `retryWaitSeconds` | integer | Vertraging voordat opnieuw verbinding wordt gemaakt |

## Uitgezonden events

### `onMessage`

Wordt geactiveerd wanneer een frame van de externe socket binnenkomt.

Nuttige velden:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.message.data` | Geparseerde JSON-payload of ruwe berichtwaarde |
| `$nodeLabel.message.text` | UTF-8-gedecodeerde tekst indien beschikbaar |
| `$nodeLabel.message.base64` | Binaire payload als base64 |
| `$nodeLabel.message.sizeBytes` | Grootte van de payload |
| `$nodeLabel.message.isJson` | Of het bericht als JSON is geparseerd |

### `onConnected`

Wordt geactiveerd nadat de socket succesvol is geopend.

Nuttige velden:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` bij de eerste verbinding, `true` bij latere herverbindingen |
| `$nodeLabel.connection.subprotocol` | Onderhandeld subprotocol |

### `onClosed`

Wordt geactiveerd wanneer een tot stand gebrachte verbinding wordt gesloten.

Nuttige velden:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` of `unknown` |
| `$nodeLabel.close.code` | WebSocket-sluitingscode |
| `$nodeLabel.close.reason` | Reden van sluiting |
| `$nodeLabel.close.wasClean` | `true` bij een normale `1000`-sluiting |
| `$nodeLabel.close.reconnecting` | Of de node zal proberen opnieuw verbinding te maken |

## Trigger-semantiek

- Eén actieve node houdt één langdurige uitgaande socketverbinding in stand.
- De verbinding draait alleen op de leader worker, vergelijkbaar met [IMAP Trigger](./imap-trigger-node.md) en de ontvangstmodus van [RabbitMQ](./rabbitmq-node.md).
- Als opnieuw verbinden is ingeschakeld, wacht Heym `retryWaitSeconds` en opent de socket opnieuw na een verbreking.
- Elk uitgezonden event creëert een afzonderlijke workflow-run met `trigger_source = "websocket"`.

## Egress-beveiliging

- Standaard moet de URL `ws://` of `wss://` gebruiken en alleen naar openbare adressen verwijzen. Loopback-, private, link-local, multicast- en cloud-metadata-bestemmingen zijn geblokkeerd.
- Heym valideert DNS opnieuw bij elke herverbinding, valideert elk opgelost adres en maakt rechtstreeks verbinding met een van die adressen. Omgevingsproxies en WebSocket-redirects zijn uitgeschakeld zolang de guard actief is.
- Permanente schendingen van het beleid stoppen de trigger in plaats van oneindig opnieuw te proberen. Tijdelijke DNS- of netwerkstoringen volgen nog steeds de retry-instellingen van de node.
- `Authorization`-, `Origin`-, `User-Agent`- en aangepaste data-headers worden ondersteund. `Origin` wordt verzonden via de speciale optie van de WebSocket-client. `Host`-, `Connection`-, `Upgrade`- en `Sec-WebSocket-*`-headers kunnen niet worden overschreven.
- Vertrouwde self-hosted implementaties die bewust verbinding maken met interne services kunnen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` instellen. Behoud de standaardwaarde op gehoste of multi-tenant implementaties.

**Upgrade-opmerking voor v0.0.105:** dit instance-brede beleid beschermt nu ook bestemmingen die zijn afgeleid van referenties en die worden gebruikt door Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, aangepaste LLM-uitvoering en modeldiscovery, de AI-assistent, guardrails en RAG-embeddings. Bestaande referenties die naar loopback-, private of link-local adressen verwijzen, worden geweigerd, tenzij `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` is ingeschakeld op een vertrouwde self-hosted instance. Zolang de guard actief is, negeren beveiligde HTTP-clients `HTTP_PROXY` en `HTTPS_PROXY`; het inschakelen van de opt-out herstelt deze. Operator-CA-bundels die zijn geconfigureerd via `SSL_CERT_FILE` of `SSL_CERT_DIR` blijven ondersteund. ClickHouse wordt gecontroleerd voordat de verbinding wordt geopend, maar wordt niet vastgezet op het moment van verbinden, omdat clickhouse-connect zijn eigen urllib3-transport meebrengt.

## Voorbeeldworkflow

**Externe eventstroom → filter → melding**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger**-label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack**-bericht: `"Realtime alert: $streamEvent.message.data.title"`
## Voorbeeld Node JSON

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

## Gerelateerd

- [Triggers](../reference/triggers.md) – Architectuur van achtergrondtriggers en `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Gegevens naar een externe socket pushen vanuit een workflowstap
- [Node Types](../reference/node-types.md) – Overzicht van alle nodes
- [Third-Party Integrations](../reference/integrations.md) – Welke nodes referenties gebruiken en welke niet
