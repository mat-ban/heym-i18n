# WebSocket Trigger

Il nodo **WebSocket Trigger** apre una connessione client in uscita verso un server WebSocket esterno e avvia il workflow quando si verificano gli eventi socket selezionati. Utilizzarlo per flussi di eventi quali feed di mercato, telemetria o backplane di chat. La connessione a sistemi realtime interni richiede l'opt-out per URL privati descritto di seguito.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportamento importante

- Questo nodo si connette **da Heym verso un altro server WebSocket**.
- **Non** espone un endpoint WebSocket su Heym.
- Non è richiesta alcuna [credenziale](../reference/credentials.md). Configurare URL, header e subprotocolli direttamente sul nodo.
- Il leader worker mantiene la connessione aperta in background e si riconnette quando abilitato.

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `websocketUrl` | string | URL esterno `ws://` o `wss://` |
| `websocketHeaders` | stringa oggetto JSON | Header di handshake opzionali |
| `websocketSubprotocols` | string | Elenco opzionale di subprotocolli separati da virgola |
| `websocketTriggerEvents` | array | Uno qualsiasi tra `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Riconnessione dopo una disconnessione |
| `retryWaitSeconds` | integer | Attesa prima della riconnessione |

## Eventi emessi

### `onMessage`

Si attiva quando arriva un frame dal socket remoto.

Campi utili:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON analizzato o valore del messaggio grezzo |
| `$nodeLabel.message.text` | Testo decodificato UTF-8 quando disponibile |
| `$nodeLabel.message.base64` | Payload binario in base64 |
| `$nodeLabel.message.sizeBytes` | Dimensione del payload |
| `$nodeLabel.message.isJson` | Indica se il messaggio è stato analizzato come JSON |

### `onConnected`

Si attiva dopo l'apertura riuscita del socket.

Campi utili:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` alla prima connessione, `true` alle riconnessioni successive |
| `$nodeLabel.connection.subprotocol` | Subprotocollo negoziato |

### `onClosed`

Si attiva quando una connessione stabilita viene chiusa.

Campi utili:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` o `unknown` |
| `$nodeLabel.close.code` | Codice di chiusura WebSocket |
| `$nodeLabel.close.reason` | Motivo della chiusura |
| `$nodeLabel.close.wasClean` | `true` per una chiusura normale `1000` |
| `$nodeLabel.close.reconnecting` | Indica se il nodo tenterà la riconnessione |

## Semantica del Trigger

- Un nodo attivo mantiene una connessione socket in uscita a lunga durata.
- La connessione viene eseguita solo sul leader worker, in modo analogo a [IMAP Trigger](./imap-trigger-node.md) e alla modalità di ricezione di [RabbitMQ](./rabbitmq-node.md).
- Se la riconnessione è abilitata, Heym attende `retryWaitSeconds` e riapre il socket dopo una caduta.
- Ogni evento emesso crea un'esecuzione del workflow separata con `trigger_source = "websocket"`.

## Sicurezza in uscita

- Per impostazione predefinita, l'URL deve utilizzare `ws://` o `wss://` e risolversi esclusivamente verso indirizzi pubblici. Le destinazioni loopback, private, link-local, multicast e cloud-metadata sono bloccate.
- Heym rivalida il DNS a ogni riconnessione, convalida ogni indirizzo risolto e si connette direttamente a uno di tali indirizzi. I proxy di ambiente e i redirect WebSocket sono disabilitati mentre la protezione è attiva.
- Le violazioni permanenti delle policy arrestano il trigger anziché ritentare all'infinito. I guasti DNS o di rete temporanei seguono comunque le impostazioni di retry del nodo.
- Sono supportati gli header `Authorization`, `Origin`, `User-Agent` e gli header dati personalizzati. `Origin` viene inviato tramite l'opzione dedicata del client WebSocket. Gli header `Host`, `Connection`, `Upgrade` e `Sec-WebSocket-*` non possono essere sovrascritti.
- Le distribuzioni self-hosted attendibili che si connettono intenzionalmente a servizi interni possono impostare `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenere il valore predefinito sulle distribuzioni hosted o multi-tenant.

**Nota di aggiornamento per la v0.0.105:** questa policy a livello di istanza ora protegge anche le destinazioni derivate dalle credenziali utilizzate da Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'esecuzione di LLM personalizzati e il rilevamento dei modelli, l'assistente IA, i guardrail e gli embedding RAG. Le credenziali esistenti che puntano a indirizzi loopback, privati o link-local vengono rifiutate a meno che `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` non sia abilitato su un'istanza self-hosted attendibile. Mentre la protezione è attiva, i client HTTP protetti ignorano `HTTP_PROXY` e `HTTPS_PROXY`; abilitando l'opt-out questi vengono ripristinati. I bundle CA dell'operatore configurati tramite `SSL_CERT_FILE` o `SSL_CERT_DIR` restano supportati. ClickHouse viene verificato prima dell'apertura della connessione ma non viene bloccato al momento della connessione, poiché clickhouse-connect utilizza il proprio trasporto urllib3.
## Workflow di esempio

**Stream di eventi esterni → filtro → notifica**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** message: `"Realtime alert: $streamEvent.message.data.title"`

## JSON del Nodo di esempio

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

## Correlati

- [Trigger](../reference/triggers.md) – Architettura dei trigger in background e `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Inviare dati a un socket esterno da uno step del workflow
- [Tipi di Nodo](../reference/node-types.md) – Panoramica di tutti i nodi
- [Integrazioni di terze parti](../reference/integrations.md) – Quali nodi utilizzano le credenziali e quali no
