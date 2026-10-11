# SSE-streaming

Workflows kunnen uitvoeringsgebeurtenissen in realtime streamen met Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Dit endpoint gebruikt dezelfde workflow-authenticatie, snelheidsbeperking en regels voor response-caching als het standaard execute-endpoint dat is gedocumenteerd in [Webhooks](./webhooks.md).

## SSE inschakelen in het cURL-dialoogvenster

Open het dialoogvenster **Run with cURL** in de editor en schakel **SSE Streaming** in.

Indien ingeschakeld, doet Heym het volgende:

- schakelt het gegenereerde commando van `/execute` over naar `/execute/stream`
- voegt `--no-buffer` toe zodat gestreamde gebeurtenissen onmiddellijk in de terminaluitvoer verschijnen
- voegt `Accept: text/event-stream` toe
- laat u per node `node_start`-berichten direct in het dialoogvenster configureren

## Gebeurtenisprotocol

Elk SSE-frame is newline-gescheiden JSON met het voorvoegsel `data: `.

| Gebeurtenistype | Wanneer het wordt verzonden | Belangrijkste velden |
|------------|--------------------|------------|
| `execution_started` | Onmiddellijk nadat het verzoek is geaccepteerd | `execution_id`, `server_now_ms` |
| `node_start` | Vlak voordat een node met de uitvoering begint | `node_id`, `node_label`, `started_at_ms`, optioneel `message` |
| `node_retry` | Wanneer een node opnieuw probeert | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Nadat een node is voltooid | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Wanneer een Output-node vroegtijdig terugkeert | `node_label`, `output` |
| `execution_complete` | Nadat de workflow is beëindigd | `status`, `outputs`, `execution_time_ms` |

## Startberichten per node

Het cURL-dialoogvenster slaat SSE-instellingen op de workflow zelf op:

- **Send start** bepaalt of een `node_start`-gebeurtenis een `message` bevat
- **Start message** is standaard `[START] {nodeLabel}`
- het wissen van een aangepast bericht valt terug op de standaardtekst
- `node_complete` wordt altijd verzonden en bevat altijd de node-uitvoer

Voorbeeld van opgeslagen configuratie:

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

## cURL-voorbeeld

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Voorbeeld van een gebeurtenisstroom:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Beveiligingsopmerkingen

- `anonymous`-, `jwt`- en `header_auth`-workflows gedragen zich hetzelfde als het reguliere webhook-endpoint
- response-caching is nog steeds van toepassing wanneer `cache_ttl_seconds` is geconfigureerd
- workflow-snelheidslimieten zijn nog steeds van toepassing wanneer `rate_limit_requests` en `rate_limit_window_seconds` zijn geconfigureerd
- `test_run` omzeilt zowel de cache als de snelheidsbeperking, op dezelfde manier als voor `/execute`

## Gerelateerd

- [Webhooks](./webhooks.md) – Standaard execute-endpoint en cURL-dialoogvenster
- [Parallel Execution](./parallel-execution.md) – Hoe streaming past in de DAG-scheduler van Heym
- [Canvas Features](./canvas-features.md) – Editor-besturingselementen waaronder Run with cURL
- [Security](./security.md) – Authenticatie en omgang met secrets
