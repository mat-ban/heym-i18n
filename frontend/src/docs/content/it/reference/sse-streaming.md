# SSE Streaming

I Workflows possono trasmettere gli eventi di esecuzione in tempo reale tramite Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Questo endpoint utilizza le stesse regole di autenticazione a livello di workflow, rate limiting e response caching dell'endpoint execute standard, documentato in [Webhooks](./webhooks.md).

## Abilitazione di SSE nella finestra di dialogo cURL

Aprire la finestra di dialogo **Run with cURL** nell'editor e abilitare **SSE Streaming**.

Quando è abilitato, Heym:

- modifica il comando generato da `/execute` a `/execute/stream`
- aggiunge `--no-buffer` affinché gli eventi in streaming vengano visualizzati immediatamente nell'output del terminale
- aggiunge `Accept: text/event-stream`
- consente di configurare i messaggi `node_start` per singolo nodo direttamente nella finestra di dialogo

## Protocollo degli eventi

Ogni frame SSE è un JSON delimitato da newline, preceduto da `data: `.

| Tipo di evento | Quando viene emesso | Campi principali |
|------------|--------------------|------------|
| `queued` | Il workflow ha raggiunto il [limite di concorrenza](./webhooks.md#concurrency-limit-and-queued-runs); inviato nuovamente ogni volta che la posizione dell'esecuzione cambia | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Immediatamente dopo l'accettazione della richiesta, o all'avvio di un'esecuzione in coda | `execution_id`, `server_now_ms` |
| `node_start` | Subito prima che un nodo inizi l'esecuzione | `node_id`, `node_label`, `started_at_ms`, `message` opzionale |
| `node_retry` | Quando un nodo esegue un nuovo tentativo | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Dopo che un nodo ha terminato | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Quando un Nodo Output restituisce un risultato anticipato | `node_label`, `output` |
| `execution_complete` | Dopo la conclusione del workflow | `status`, `outputs`, `execution_time_ms` |

### Esecuzioni in coda

Quando il workflow ha raggiunto il limite di concorrenza, lo stream rimane aperto e invia eventi `queued` mentre l'esecuzione è in attesa. Un'esecuzione in coda viene eseguita nel worker in background, eventualmente in un altro processo, quindi il suo stream trasmette `execution_started` all'avvio dell'esecuzione e `execution_complete` al termine, ma nessun evento `node_start`, `node_complete` o eventi di token intermedi. Il suo `execution_complete` presenta un `node_results` vuoto; aprire l'esecuzione nella [Cronologia esecuzioni](./execution-history.md) per i dettagli sui nodi. La chiusura della connessione non annulla un'esecuzione in coda. Quando la coda è piena, la richiesta riceve una risposta `429` prima dell'apertura dello stream.

## Messaggi di avvio per singolo nodo

La finestra di dialogo cURL memorizza le impostazioni SSE sul workflow stesso:

- **Send start** controlla se un evento `node_start` include un `message`
- **Start message** ha come valore predefinito `[START] {nodeLabel}`
- la cancellazione di un messaggio personalizzato ripristina il testo predefinito
- `node_complete` viene sempre emesso e include sempre l'output del nodo

Esempio di configurazione memorizzata:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Esempio cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Esempio di flusso di eventi:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Note sulla sicurezza

- i workflow `anonymous`, `jwt` e `header_auth` si comportano allo stesso modo dell'endpoint webhook standard
- il response caching si applica comunque quando `cache_ttl_seconds` è configurato
- i rate limit del workflow si applicano comunque quando `rate_limit_requests` e `rate_limit_window_seconds` sono configurati
- `test_run` bypassa sia la cache sia il rate limiting, allo stesso modo in cui avviene per `/execute`

## Correlati

- [Webhooks](./webhooks.md) – Endpoint execute standard e finestra di dialogo cURL
- [Parallel Execution](./parallel-execution.md) – Come lo streaming si integra nello scheduler DAG di Heym
- [Canvas Features](./canvas-features.md) – Controlli dell'editor, inclusa la funzione Run with cURL
- [Security](./security.md) – Autenticazione e gestione dei segreti