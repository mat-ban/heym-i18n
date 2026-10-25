# SSE Streaming

Workflow-urile pot transmite evenimente de execuție în timp real prin Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Acest endpoint utilizează aceleași reguli de autentificare la nivel de workflow, limitare a ratei și cache-are a răspunsurilor ca endpoint-ul standard de execuție documentat în [Webhooks](./webhooks.md).

## Activarea SSE în dialogul cURL

Deschideți dialogul **Run with cURL** în editor și activați **SSE Streaming**.

Când este activat, Heym:

- comută comanda generată de la `/execute` la `/execute/stream`
- adaugă `--no-buffer` astfel încât evenimentele transmise în flux să apară imediat în ieșirea terminalului
- adaugă `Accept: text/event-stream`
- vă permite să configurați mesajele `node_start` pentru fiecare nod direct în dialog

## Protocolul de evenimente

Fiecare cadru SSE este JSON delimitat prin linii noi, prefixat cu `data: `.

| Tip de eveniment | Când este emis | Câmpuri cheie |
|------------|--------------------|------------|
| `queued` | Workflow-ul a atins [limita de concurență](./webhooks.md#concurrency-limit-and-queued-runs); trimis din nou ori de câte ori se schimbă poziția rulării | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Imediat după ce cererea este acceptată, sau când începe o rulare din coadă | `execution_id`, `server_now_ms` |
| `node_start` | Chiar înainte ca un nod să înceapă execuția | `node_id`, `node_label`, `started_at_ms`, `message` opțional |
| `node_retry` | Când un nod reîncearcă | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | După ce un nod se finalizează | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Când un nod Output returnează mai devreme | `node_label`, `output` |
| `execution_complete` | După ce workflow-ul se încheie | `status`, `outputs`, `execution_time_ms` |

### Rulări în coadă

Când workflow-ul atinge limita de concurență, fluxul rămâne deschis și trimite evenimente `queued` în timp ce rularea așteaptă. O rulare din coadă se execută în procesul worker de fundal, eventual într-un alt proces, astfel încât fluxul său conține `execution_started` la începerea rulării și `execution_complete` la finalizare, dar niciun eveniment `node_start`, `node_complete` sau evenimente de token intermediare. `execution_complete` al său conține un `node_results` gol; deschideți rularea în [Istoricul execuțiilor](./execution-history.md) pentru detaliile nodurilor. Închiderea conexiunii nu anulează o rulare aflată în coadă. Când coada este plină, cererea primește răspunsul `429` înainte de deschiderea fluxului.

## Mesaje de început pentru fiecare nod

Dialogul cURL stochează setările SSE chiar pe workflow:

- **Send start** controlează dacă un eveniment `node_start` include un `message`
- **Start message** are valoarea implicită `[START] {nodeLabel}`
- golirea unui mesaj personalizat revine la textul implicit
- `node_complete` este întotdeauna emis și include întotdeauna ieșirea nodului

Exemplu de configurare stocată:

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

## Exemplu cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Exemplu de flux de evenimente:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Note de securitate

- workflow-urile `anonymous`, `jwt` și `header_auth` se comportă la fel ca endpoint-ul obișnuit de webhook
- cache-area răspunsurilor se aplică în continuare când `cache_ttl_seconds` este configurat
- limitele de rată ale workflow-ului se aplică în continuare când `rate_limit_requests` și `rate_limit_window_seconds` sunt configurate
- `test_run` ocolește atât cache-ul, cât și limitarea ratei, la fel cum face pentru `/execute`

## Resurse conexe

- [Webhooks](./webhooks.md) – Endpoint-ul standard de execuție și dialogul cURL
- [Parallel Execution](./parallel-execution.md) – Cum se integrează streaming-ul în planificatorul DAG al Heym
- [Canvas Features](./canvas-features.md) – Controalele editorului, inclusiv Run with cURL
- [Security](./security.md) – Autentificare și gestionarea secretelor
