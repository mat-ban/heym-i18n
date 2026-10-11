# WebSocket Send

Il nodo **WebSocket Send** apre una connessione client in uscita verso un server WebSocket esterno, invia un messaggio e chiude la connessione. Utilizzarlo quando un workflow deve propagare eventi verso un sistema realtime senza esporre un endpoint socket di proprietà di Heym.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL esterno `ws://` o `wss://` |
| `websocketHeaders` | stringa oggetto JSON / expression | Header di handshake opzionali |
| `websocketSubprotocols` | string | Elenco opzionale di subprotocolli separati da virgola |
| `websocketMessage` | expression | Payload da inviare |

## Regole di serializzazione dei messaggi

- Se `websocketMessage` si risolve in una **stringa**, Heym invia un frame di testo.
- Se si risolve in un **oggetto**, **array**, **numero**, **booleano** o `null`, Heym lo serializza come testo JSON.
- Se si risolve in **bytes**, Heym invia un frame binario.
- Le espressioni complete come `$input` preservano i tipi nativi prima della serializzazione.

## Campi di output

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` in caso di successo |
| `$nodeLabel.url` | URL di destinazione risolto |
| `$nodeLabel.message_type` | `text`, `json` o `binary` |
| `$nodeLabel.size_bytes` | Dimensione del payload in byte |
| `$nodeLabel.subprotocol` | Subprotocollo negoziato, se presente |
| `$nodeLabel.sent_at` | Timestamp ISO |

## Workflow di esempio

**Richiesta HTTP → trasformazione → pubblicazione su WebSocket**

```
input → set → websocketSend → output
```

- **Set** crea un oggetto payload come `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** utilizza `$payloadNode` come `websocketMessage`
- **Output** può restituire `$socketSend.status`

## JSON del nodo di esempio

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

## Note

- Per questo nodo non è richiesta alcuna [credenziale](../reference/credentials.md).
- Se il server remoto prevede header di autenticazione o di tenant, passarli tramite `websocketHeaders`.
- Utilizzare [HTTP](./http-node.md) quando il sistema remoto è basato su request/response anziché su socket.

## Sicurezza in uscita

- Per impostazione predefinita, l'URL deve utilizzare `ws://` o `wss://` e risolversi esclusivamente verso indirizzi pubblici. Le destinazioni loopback, private, link-local, multicast e cloud-metadata sono bloccate.
- Heym convalida ogni indirizzo risolto e si connette direttamente a uno di tali indirizzi. I proxy di ambiente e i redirect WebSocket sono disabilitati mentre la protezione è attiva.
- Sono supportati gli header `Authorization`, `Origin`, `User-Agent` e header dati personalizzati. `Origin` viene inviato tramite l'opzione dedicata del client WebSocket. Gli header `Host`, `Connection`, `Upgrade` e `Sec-WebSocket-*` non possono essere sovrascritti.
- Le distribuzioni self-hosted affidabili che si connettono intenzionalmente a servizi interni possono impostare `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenere il valore predefinito nelle distribuzioni hosted o multi-tenant.

**Nota di aggiornamento per la v0.0.105:** questa policy a livello di istanza ora protegge anche le destinazioni derivate da credenziali utilizzate da Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'esecuzione di LLM personalizzati e il rilevamento dei modelli, l'assistente IA, i guardrail e gli embedding RAG. Le credenziali esistenti che puntano a indirizzi loopback, privati o link-local vengono rifiutate a meno che `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` non sia abilitato su un'istanza self-hosted affidabile. Mentre la protezione è attiva, i client HTTP protetti ignorano `HTTP_PROXY` e `HTTPS_PROXY`; l'abilitazione dell'opt-out li ripristina. I bundle CA dell'operatore configurati tramite `SSL_CERT_FILE` o `SSL_CERT_DIR` restano supportati. ClickHouse viene verificato prima dell'apertura della connessione ma non viene bloccato al momento della connessione, poiché clickhouse-connect utilizza un proprio trasporto urllib3.

## Correlati

- [WebSocket Trigger](./websocket-trigger-node.md) – Ascoltare un socket esterno e attivare i workflow sugli eventi
- [Tipi di nodo](../reference/node-types.md) – Panoramica dei nodi di integrazione
- [Expression DSL](../reference/expression-dsl.md) – Creare payload JSON dinamici
- [Integrazioni di terze parti](../reference/integrations.md) – Integrazioni basate su credenziali vs configurazione diretta