# SSE Streaming

Workflows kan streame udførelseshændelser i realtid ved hjælp af Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Denne endpoint anvender samme workflow-niveau autentificering, rate limiting og response caching-regler som standard execute-endpoint dokumenteret i [Webhooks](./webhooks.md).

## Aktivering af SSE i cURL-dialogen

Åbn **Kør med cURL**-dialogen i editoren og aktiver **SSE Streaming**.

Når aktiveret, foretager Heym følgende:

- skifter det genererede kommando fra `/execute` til `/execute/stream`
- tilføjer `--no-buffer` så streamede hændelser vises umiddelbart i terminaloutput
- tilføjer `Accept: text/event-stream`
- giver mulighed for at konfigurere per-node `node_start`-beskeder direkte i dialogen

## Event-protokol

Hver SSE-frame er newline-delimited JSON præfikset med `data: `.

| Hændelsestype | Udsendelsestidspunkt | Nøglefelter |
|------------|--------------------|------------|
| `execution_started` | Umiddelbart efter anmodningen er accepteret | `execution_id`, `server_now_ms` |
| `node_start` | Lige før en node påbegynder udførelse | `node_id`, `node_label`, `started_at_ms`, valgfri `message` |
| `node_retry` | Når en node prøver igen | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Efter en node er færdig | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Når en Output-node returnerer tidligt | `node_label`, `output` |
| `execution_complete` | Efter workflowet er afsluttet | `status`, `outputs`, `execution_time_ms` |

## Per-Node Start-beskeder

cURL-dialogen gemmer SSE-indstillinger på workflowet selv:

- **Send start** styrer om en `node_start`-hændelse inkluderer en `message`
- **Start message** standardværdi er `[START] {nodeLabel}`
- ved fjernelse af en brugerdefineret besked faldes der tilbage til standardteksten
- `node_complete` udsendes altid og inkluderer altid node-outputtet

Eksempel på gemt konfiguration:

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

## cURL-eksempel

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Eksempel på event-stream:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Sikkerhedsnoter

- `anonymous`, `jwt` og `header_auth`-workflows opfører sig på samme måde som den almindelige webhook-endpoint
- response caching gælder stadig når `cache_ttl_seconds` er konfigureret
- workflow rate limits gælder stadig når `rate_limit_requests` og `rate_limit_window_seconds` er konfigureret
- `test_run` omgår både cache og rate limiting, på samme måde som for `/execute`

## Relateret

- [Webhooks](./webhooks.md) – Standard execute-endpoint og cURL-dialog
- [Parallel Execution](./parallel-execution.md) – Hvordan streaming passer ind i Heyms DAG-scheduler
- [Canvas Features](./canvas-features.md) – Editor-kontrol inklusive Kør med cURL
- [Security](./security.md) – Autentificering og håndtering af hemmeligheder
