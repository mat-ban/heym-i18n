# SSE Streaming

Workflows lahko v realnem času prenašajo dogodke izvajanja s pomočjo Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Ta endpoint uporablja enake pravila avtentikacije na ravni workflow, omejevanja hitrosti in predpomnjenja odgovorov kot standardni execute endpoint, dokumentiran v [Webhooks](./webhooks.md).

## Omogočanje SSE v cURL Dialogu

Odprite pogovor **Run with cURL** v urejevalniku in omogočite **SSE Streaming**.

Ko je omogočeno, Heym:

- spremeni generirano ukazno vrstico iz `/execute` v `/execute/stream`
- doda `--no-buffer`, da se preneseni dogodki takoj prikažejo v izhodu terminala
- doda `Accept: text/event-stream`
- omogoči konfiguracijo sporočil `node_start` za posamezna vozlišča neposredno v pogovoru

## Protokol dogodkov

Vsak SSE okvir je JSON, ločen z novimi vrsticami, s predpono `data: `.

| Tip dogodka | Kdaj je oddan | Ključna polja |
|-------------|---------------|----------------|
| `queued` | Workflow je dosegel svojo [omejitev sočasnosti](./webhooks.md#concurrency-limit-and-queued-runs); ponovno poslan vsakič, ko se spremeni mesto zagona | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Takoj po sprejemu zahteve ali ko se začne zagon v čakalni vrsti | `execution_id`, `server_now_ms` |
| `node_start` | Tik pred začetkom izvajanja vozlišča | `node_id`, `node_label`, `started_at_ms`, opcijsko `message` |
| `node_retry` | Ko vozlišče ponovi poskus | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Po končanem izvajanju vozlišča | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Ko vozlišče Output vrne zgodaj | `node_label`, `output` |
| `execution_complete` | Po končanju workflow | `status`, `outputs`, `execution_time_ms` |

### Zagoni v čakalni vrsti

Ko workflow doseže svojo omejitev sočasnosti, pretok ostane odprt in med čakanjem zagona pošilja dogodke `queued`. Zagon v čakalni vrsti se izvede v ozadju v delavcu (background worker), morda v drugem procesu, zato njegov pretok prenaša `execution_started`, ko se zagon začne, in `execution_complete`, ko se zaključi, vmes pa ni nobenih dogodkov `node_start`, `node_complete` ali dogodkov tokenov. Njegov `execution_complete` ima prazen `node_results`; odprite zagon v [Zgodovini izvajanja](./execution-history.md) za podrobnosti o vozliščih. Zaprtje povezave ne prekliče zagona v čakalni vrsti. Ko je čakalna vrsta polna, je na zahtevo odgovorjeno s `429`, preden se pretok odpre.

## Sporočila o začetku za posamezna vozlišča

cURL dialog shranjuje nastavitve SSE na samem workflow:

- **Send start** nadzira, ali dogodek `node_start` vključuje `message`
- **Start message** privzeto nastavi na `[START] {nodeLabel}`
- izbris prilagojenega sporočila se vrne na privzeto besedilo
- `node_complete` je vedno oddan in vedno vključuje izhod vozlišča

Primer shranjene konfiguracije:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Osnutek odgovora"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL Primer

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Pozdravljen"}'
```

Primer toka dogodkov:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Pozdravljen svet"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Pozdravljen svet"}},"execution_time_ms":315}
```

## Varnostne Opombe

- `anonymous`, `jwt` in `header_auth` workflows se obnašajo enako kot običajen webhook endpoint
- predpomnjenje odgovorov še vedno velja, ko je konfiguriran `cache_ttl_seconds`
- omejitve hitrosti workflow še vedno veljajo, ko sta konfigurirana `rate_limit_requests` in `rate_limit_window_seconds`
- `test_run` obide tako predpomnjenje kot omejevanje hitrosti, na enak način kot za `/execute`

## Sorodno

- [Webhooks](./webhooks.md) – Standardni execute endpoint in cURL dialog
- [Parallel Execution](./parallel-execution.md) – Kako se streaming prilega Heym-ovemu DAG schedulerju
- [Canvas Features](./canvas-features.md) – Kontrole urejevalnika, vključno z Run with cURL
- [Security](./security.md) – Avtentikacija in ravnanje s skrivnostmi
