# WebSocket Send

De node **WebSocket Send** opent een uitgaande clientverbinding naar een externe WebSocket-server, verzendt één bericht en sluit de verbinding. Gebruik deze wanneer een workflow gebeurtenissen naar een realtime systeem moet pushen zonder een door Heym beheerd socket-endpoint beschikbaar te stellen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `websocketUrl` | string / expressie | Externe `ws://` of `wss://` URL |
| `websocketHeaders` | JSON-object string / expressie | Optionele handshake-headers |
| `websocketSubprotocols` | string | Optionele kommagescheiden lijst van subprotocollen |
| `websocketMessage` | expressie | Te verzenden payload |

## Regels voor berichtserialisatie

- Als `websocketMessage` resulteert in een **string**, verzendt Heym een tekstframe.
- Als het resulteert in een **object**, **array**, **getal**, **boolean** of `null`, serialiseert Heym het als JSON-tekst.
- Als het resulteert in **bytes**, verzendt Heym een binair frame.
- Volledige expressies zoals `$input` behouden hun oorspronkelijke types vóór serialisatie.

## Uitvoervelden

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` bij succes |
| `$nodeLabel.url` | Opgeloste bestemmings-URL |
| `$nodeLabel.message_type` | `text`, `json` of `binary` |
| `$nodeLabel.size_bytes` | Payload-grootte in bytes |
| `$nodeLabel.subprotocol` | Onderhandeld subprotocol indien aanwezig |
| `$nodeLabel.sent_at` | ISO-tijdstempel |

## Voorbeeldworkflow

**HTTP-verzoek → transformeren → publiceren via WebSocket**

```
input → set → websocketSend → output
```

- **Set** maakt een payload-object zoals `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** gebruikt `$payloadNode` als `websocketMessage`
- **Output** kan `$socketSend.status` retourneren

## Voorbeeld node-JSON

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

## Opmerkingen

- Er is geen [referentie](../reference/credentials.md) vereist voor deze node.
- Als de externe server auth- of tenant-headers verwacht, geef deze dan door via `websocketHeaders`.
- Gebruik [HTTP](./http-node.md) wanneer het externe systeem op request/response is gebaseerd in plaats van op sockets.

## Egress-beveiliging

- Standaard moet de URL `ws://` of `wss://` gebruiken en alleen naar openbare adressen verwijzen. Loopback-, private-, link-local-, multicast- en cloud-metadata-bestemmingen zijn geblokkeerd.
- Heym valideert elk opgelost adres en verbindt rechtstreeks met één van die adressen. Omgevingsproxies en WebSocket-redirects zijn uitgeschakeld zolang de beveiliging actief is.
- `Authorization`-, `Origin`-, `User-Agent`- en aangepaste data-headers worden ondersteund. `Origin` wordt verzonden via de speciale optie van de WebSocket-client. `Host`-, `Connection`-, `Upgrade`- en `Sec-WebSocket-*`-headers kunnen niet worden overschreven.
- Vertrouwde self-hosted implementaties die bewust verbinding maken met interne services kunnen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` instellen. Behoud de standaardwaarde op gehoste of multi-tenant implementaties.

**Upgrade-opmerking voor v0.0.105:** dit instance-brede beleid beschermt nu ook bestemmingen die zijn afgeleid van referenties en die worden gebruikt door Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, aangepaste LLM-uitvoering en modeldiscovery, de AI-assistent, guardrails en RAG-embeddings. Bestaande referenties die naar loopback-, private- of link-local-adressen verwijzen, worden geweigerd, tenzij `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` is ingeschakeld op een vertrouwde self-hosted instantie. Zolang de beveiliging actief is, negeren beveiligde HTTP-clients `HTTP_PROXY` en `HTTPS_PROXY`; het inschakelen van de opt-out herstelt deze. Operator-CA-bundels die zijn geconfigureerd via `SSL_CERT_FILE` of `SSL_CERT_DIR` blijven ondersteund. ClickHouse wordt gecontroleerd voordat de verbinding wordt geopend, maar wordt niet vastgezet op het moment van dialen, omdat clickhouse-connect zijn eigen urllib3-transport meebrengt.

## Gerelateerd

- [WebSocket Trigger](./websocket-trigger-node.md) – Luister naar een externe socket en activeer workflows op gebeurtenissen
- [Node Types](../reference/node-types.md) – Overzicht van integratienodes
- [Expression DSL](../reference/expression-dsl.md) – Bouw dynamische JSON-payloads
- [Third-Party Integrations](../reference/integrations.md) – Integraties met referenties versus directe configuratie
