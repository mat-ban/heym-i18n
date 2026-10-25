# SSE Streaming

Workflows mogu streamati događaje izvršavanja u stvarnom vremenu pomoću Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Ovaj endpoint koristi iste pravila autentifikacije na razini workflow-a, ograničenja brzine i predmemoriranja odgovora kao standardni execute endpoint dokumentiran u [Webhooks](./webhooks.md).

## Omogućavanje SSE u cURL dijalogu

Otvorite dijalog **Run with cURL** u uređivaču i omogućite **SSE Streaming**.

Kada je omogućeno, Heym:

- mijenja generiranu naredbu s `/execute` na `/execute/stream`
- dodaje `--no-buffer` kako bi streamani događaji odmah bili vidljivi u izlazu terminala
- dodaje `Accept: text/event-stream`
- omogućuje vam konfiguriranje poruka `node_start` po čvorovima izravno u dijalogu

## Protokol događaja

Svaki SSE okvir je JSON odvojen novim redom s prefiksom `data: `.

| Tip događaja | Kada se emitira | Ključna polja |
|--------------|------------------|----------------|
| `queued` | Workflow je dosegao svoje [ograničenje istovremenosti](./webhooks.md#concurrency-limit-and-queued-runs); šalje se ponovno kad god se promijeni mjesto pokretanja | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Odmah nakon što je zahtjev prihvaćen ili kada započne pokretanje u redu čekanja | `execution_id`, `server_now_ms` |
| `node_start` | Prije nego što čvor započne izvršavanje | `node_id`, `node_label`, `started_at_ms`, opcionalno `message` |
| `node_retry` | Kada čvor ponavlja pokušaj | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Nakon što čvor završi | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Kada Output čvor ranije vraća | `node_label`, `output` |
| `execution_complete` | Nakon završetka workflow-a | `status`, `outputs`, `execution_time_ms` |

### Pokretanja u redu čekanja

Kada workflow dosegne svoje ograničenje istovremenosti, stream ostaje otvoren i šalje događaje `queued` dok pokretanje čeka. Pokretanje u redu čekanja izvršava se u pozadinskom radniku (background worker), moguće u drugom procesu, tako da njegov stream nosi `execution_started` kada pokretanje započne i `execution_complete` kada završi, ali bez događaja `node_start`, `node_complete` ili događaja tokena između njih. Njegov `execution_complete` ima prazan `node_results`; otvorite pokretanje u [Povijesti izvršavanja](./execution-history.md) za pojedinosti o čvoru. Zatvaranje veze ne otkazuje pokretanje u redu čekanja. Kada je red pun, na zahtjev se odgovara s `429` prije nego što se stream otvori.

## Poruke o početku po čvorovima

cURL dijalog pohranjuje SSE postavke na samom workflow-u:

- **Send start** kontrolira uključuje li `node_start` događaj `message`
- **Start message** prema zadanim postavkama je `[START] {nodeLabel}`
- brisanje prilagođene poruke vraća se na zadani tekst
- `node_complete` se uvijek emitira i uvijek uključuje izlaz čvora

Primjer pohranjene konfiguracije:

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

## cURL primjer

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Primjer streama događaja:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Napomene o sigurnosti

- `anonymous`, `jwt` i `header_auth` workflows ponašaju se isto kao redovni webhook endpoint
- predmemoriranje odgovora i dalje vrijedi kada je `cache_ttl_seconds` konfiguriran
- ograničenja brzine workflow-a i dalje vrijede kada su `rate_limit_requests` i `rate_limit_window_seconds` konfigurirani
- `test_run` zaobilazi i predmemoriju i ograničenja brzine, na isti način kao za `/execute`

## Povezano

- [Webhooks](./webhooks.md) – Standardni execute endpoint i cURL dijalog
- [Parallel Execution](./parallel-execution.md) – Kako streaming odgovara Heym-ovom DAG scheduleru
- [Canvas Features](./canvas-features.md) – Kontrole uređivača uključujući Run with cURL
- [Security](./security.md) – Autentifikacija i upravljanje tajnama
