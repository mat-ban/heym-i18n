# SSE-strömning

Workflows kan strömma körningshändelser i realtid med Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Denna endpoint använder samma autentisering på workflow-nivå, hastighetsbegränsning och regler för cachelagring av svar som den vanliga execute-endpointen som dokumenteras i [Webhooks](./webhooks.md).

## Aktivera SSE i cURL-dialogen

Öppna dialogen **Run with cURL** i editorn och aktivera **SSE Streaming**.

När detta är aktiverat gör Heym följande:

- byter det genererade kommandot från `/execute` till `/execute/stream`
- lägger till `--no-buffer` så att strömmade händelser visas omedelbart i terminalutdata
- lägger till `Accept: text/event-stream`
- gör det möjligt att konfigurera `node_start`-meddelanden per nod direkt i dialogen

## Händelseprotokoll

Varje SSE-frame är radavgränsad JSON med prefixet `data: `.

| Händelsetyp | När den sänds ut | Viktiga fält |
|------------|--------------------|------------|
| `queued` | Workflowen har nått sin [samtidighetsgräns](./webhooks.md#concurrency-limit-and-queued-runs); skickas igen när körningens plats ändras | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Omedelbart efter att begäran har accepterats, eller när en köad körning startar | `execution_id`, `server_now_ms` |
| `node_start` | Precis innan en nod börjar köras | `node_id`, `node_label`, `started_at_ms`, valfritt `message` |
| `node_retry` | När en nod gör ett nytt försök | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Efter att en nod har slutförts | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | När en Output-nod returnerar i förtid | `node_label`, `output` |
| `execution_complete` | Efter att workflowen har avslutats | `status`, `outputs`, `execution_time_ms` |

### Köade körningar

När workflowen har nått sin samtidighetsgräns hålls strömmen öppen och skickar `queued`-händelser medan körningen väntar. En köad körning körs i bakgrundsworkern, eventuellt i en annan process, så dess ström bär `execution_started` när körningen startar och `execution_complete` när den avslutas, men inga `node_start`-, `node_complete`- eller token-händelser däremellan. Dess `execution_complete` har en tom `node_results`; öppna körningen i [Exekveringshistorik](./execution-history.md) för noddetaljer. Att stänga anslutningen avbryter inte en köad körning. När kön är full besvaras begäran med `429` innan strömmen öppnas.

## Startmeddelanden per nod

cURL-dialogen lagrar SSE-inställningar på själva workflowen:

- **Send start** styr huruvida en `node_start`-händelse innehåller ett `message`
- **Start message** har standardvärdet `[START] {nodeLabel}`
- om ett anpassat meddelande rensas återgår det till standardtexten
- `node_complete` sänds alltid ut och innehåller alltid nodens utdata

Exempel på lagrad konfiguration:

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

## cURL-exempel

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Exempel på händelseström:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Säkerhetsanmärkningar

- workflows med `anonymous`, `jwt` och `header_auth` beter sig på samma sätt som den vanliga webhook-endpointen
- cachelagring av svar tillämpas fortfarande när `cache_ttl_seconds` är konfigurerat
- hastighetsbegränsningar för workflowen tillämpas fortfarande när `rate_limit_requests` och `rate_limit_window_seconds` är konfigurerade
- `test_run` kringgår både cache och hastighetsbegränsning, på samma sätt som för `/execute`

## Relaterat

- [Webhooks](./webhooks.md) – Standard execute-endpoint och cURL-dialog
- [Parallel Execution](./parallel-execution.md) – Hur strömning passar in i Heyms DAG-schemaläggare
- [Canvas Features](./canvas-features.md) – Editor-kontroller inklusive Run with cURL
- [Security](./security.md) – Autentisering och hantering av hemligheter
