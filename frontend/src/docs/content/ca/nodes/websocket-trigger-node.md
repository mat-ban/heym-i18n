# Trigger de WebSocket

El node **Trigger de WebSocket** obre una connexió de client sortint cap a un servidor WebSocket extern i inicia el workflow quan es produeixen els esdeveniments de socket seleccionats. Utilitzeu-lo per a fluxos d'esdeveniments com ara feeds de mercat, telemetria o backplanes de xat. La connexió a sistemes en temps real interns requereix l'exclusió d'URL privades que es descriu a continuació.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportament important

- Aquest node es connecta **des de Heym cap a un altre servidor WebSocket**.
- **No** exposa cap endpoint de WebSocket a Heym.
- No cal cap [credencial](../reference/credentials.md). Configureu l'URL, les capçaleres i els subprotocols directament al node.
- El worker líder manté la connexió oberta en segon pla i es torna a connectar quan està habilitat.

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `websocketUrl` | string | URL externa `ws://` o `wss://` |
| `websocketHeaders` | JSON object string | Capçaleres d'handshake opcionals |
| `websocketSubprotocols` | string | Llista opcional de subprotocols separats per comes |
| `websocketTriggerEvents` | array | Qualsevol de `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Tornar a connectar després d'una desconnexió |
| `retryWaitSeconds` | integer | Retard abans de tornar a connectar |

## Esdeveniments emesos

### `onMessage`

S'activa quan arriba un frame des del socket remot.

Camps útils:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON analitzat o valor del missatge en cru |
| `$nodeLabel.message.text` | Text decodificat en UTF-8 quan està disponible |
| `$nodeLabel.message.base64` | Payload binari en base64 |
| `$nodeLabel.message.sizeBytes` | Mida del payload |
| `$nodeLabel.message.isJson` | Indica si el missatge s'ha analitzat com a JSON |

### `onConnected`

S'activa després que el socket s'obri correctament.

Camps útils:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` a la primera connexió, `true` a les reconnexions posteriors |
| `$nodeLabel.connection.subprotocol` | Subprotocol negociat |

### `onClosed`

S'activa quan es tanca una connexió establerta.

Camps útils:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` o `unknown` |
| `$nodeLabel.close.code` | Codi de tancament de WebSocket |
| `$nodeLabel.close.reason` | Motiu de tancament |
| `$nodeLabel.close.wasClean` | `true` per a un tancament normal `1000` |
| `$nodeLabel.close.reconnecting` | Indica si el node intentarà tornar a connectar-se |

## Semàntica del Trigger

- Un node actiu manté una única connexió de socket sortint de llarga durada.
- La connexió s'executa només al worker líder, de manera similar al mode de recepció de [IMAP Trigger](./imap-trigger-node.md) i [RabbitMQ](./rabbitmq-node.md).
- Si la reconnexió està habilitada, Heym espera `retryWaitSeconds` i torna a obrir el socket després d'una caiguda.
- Cada esdeveniment emès crea una execució de workflow independent amb `trigger_source = "websocket"`.

## Seguretat de sortida

- Per defecte, l'URL ha d'utilitzar `ws://` o `wss://` i resoldre's només a adreces públiques. Les destinacions de loopback, privades, link-local, multicast i de metadades del núvol estan bloquejades.
- Heym revalida el DNS a cada reconnexió, valida cada adreça resolta i es connecta directament a una d'aquestes adreces. Els proxys d'entorn i les redireccions de WebSocket estan desactivats mentre la protecció està activa.
- Les violacions permanents de la política aturen el trigger en lloc de reintentar indefinidament. Els errors temporals de DNS o de xarxa segueixen la configuració de reintents del node.
- Les capçaleres `Authorization`, `Origin`, `User-Agent` i de dades personalitzades són compatibles. `Origin` s'envia mitjançant l'opció dedicada del client de WebSocket. Les capçaleres `Host`, `Connection`, `Upgrade` i `Sec-WebSocket-*` no es poden sobreescriure.
- Els desplegaments autoallotjats de confiança que es connecten intencionadament a serveis interns poden establir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Manteniu el valor per defecte en desplegaments allotjats o multi-tenant.

**Nota d'actualització per a la v0.0.105:** aquesta política a nivell d'instància ara també protegeix les destinacions derivades de credencials utilitzades per Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'execució personalitzada de LLM i el descobriment de models, l'assistent d'IA, els guardrails i els embeddings de RAG. Les credencials existents que apunten a adreces de loopback, privades o link-local es rebutgen tret que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` estigui habilitat en una instància autoallotjada de confiança. Mentre la protecció està activa, els clients HTTP protegits ignoren `HTTP_PROXY` i `HTTPS_PROXY`; habilitar l'exclusió els restaura. Els paquets de CA d'operador configurats mitjançant `SSL_CERT_FILE` o `SSL_CERT_DIR` segueixen sent compatibles. ClickHouse es comprova abans que s'obri la connexió, però no es fixa en el moment de la marcació, perquè clickhouse-connect aporta el seu propi transport urllib3.
## Workflow d'exemple

**Flux d'esdeveniments extern → filtre → notificació**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** message: `"Realtime alert: $streamEvent.message.data.title"`

## Node JSON d'exemple

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

## Relacionat

- [Triggers](../reference/triggers.md) – Arquitectura de triggers en segon pla i `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Enviar dades a un socket extern des d'un pas del workflow
- [Node Types](../reference/node-types.md) – Visió general de tots els nodes
- [Third-Party Integrations](../reference/integrations.md) – Quins nodes utilitzen credencials i quins no
