# SSE Streaming

Workflows können Ausführungsereignisse in Echtzeit mit Server-Sent Events (SSE) streamen.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Dieser Endpoint verwendet dieselben Workflow-weiten Authentifizierungs-, Rate-Limiting- und Response-Caching-Regeln wie der standardmäßige Execute-Endpoint, der in [Webhooks](./webhooks.md) dokumentiert ist.

## SSE im cURL-Dialog aktivieren

Öffne den Dialog **Run with cURL** im Editor und aktiviere **SSE Streaming**.

Wenn aktiviert, führt Heym Folgendes aus:

- wechselt den generierten Befehl von `/execute` zu `/execute/stream`
- fügt `--no-buffer` hinzu, damit gestreamte Ereignisse sofort in der Terminal-Ausgabe erscheinen
- fügt `Accept: text/event-stream` hinzu
- ermöglicht es dir, pro Knoten `node_start`-Nachrichten direkt im Dialog zu konfigurieren

## Ereignisprotokoll

Jeder SSE-Frame ist durch Zeilenumbrüche getrenntes JSON mit dem Präfix `data: `.

| Ereignistyp | Wann er ausgegeben wird | Wichtige Felder |
|------------|--------------------|------------|
| `queued` | Der Workflow hat sein [Gleichzeitigkeitslimit](./webhooks.md#concurrency-limit-and-queued-runs) erreicht; wird jedes Mal erneut gesendet, wenn sich der Platz des Laufs ändert | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Unmittelbar nachdem die Anfrage akzeptiert wurde oder wenn ein in der Warteschlange befindlicher Lauf startet | `execution_id`, `server_now_ms` |
| `node_start` | Kurz bevor ein Knoten mit der Ausführung beginnt | `node_id`, `node_label`, `started_at_ms`, optional `message` |
| `node_retry` | Wenn ein Knoten erneut versucht wird | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Nachdem ein Knoten abgeschlossen ist | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Wenn ein Output-Knoten vorzeitig zurückkehrt | `node_label`, `output` |
| `execution_complete` | Nachdem der Workflow beendet ist | `status`, `outputs`, `execution_time_ms` |

### In die Warteschlange eingereihte Ausführungen

Wenn der Workflow sein Concurrency Limit erreicht hat, bleibt der Stream geöffnet und sendet `queued`-Ereignisse, während der Lauf wartet. Ein in der Warteschlange befindlicher Lauf wird im Hintergrund-Worker ausgeführt, möglicherweise in einem anderen Prozess, sodass sein Stream `execution_started` beim Start des Laufs und `execution_complete` bei dessen Beendigung überträgt, jedoch keine `node_start`-, `node_complete`- oder Token-Ereignisse dazwischen. Sein `execution_complete` enthält leere `node_results`; öffne den Lauf in der [Ausführungshistorie](./execution-history.md) für Knotendetails. Das Schließen der Verbindung bricht einen eingereihten Lauf nicht ab. Wenn die Warteschlange voll ist, wird die Anfrage mit `429` beantwortet, bevor der Stream geöffnet wird.

## Start-Nachrichten pro Knoten

Der cURL-Dialog speichert SSE-Einstellungen am Workflow selbst:

- **Send start** steuert, ob ein `node_start`-Ereignis eine `message` enthält
- **Start message** ist standardmäßig `[START] {nodeLabel}`
- das Leeren einer benutzerdefinierten Nachricht fällt auf den Standardtext zurück
- `node_complete` wird immer ausgegeben und enthält immer die Knoten-Ausgabe

Beispiel für gespeicherte Konfiguration:

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

## cURL-Beispiel

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Beispiel-Ereignisstream:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Sicherheitshinweise

- `anonymous`-, `jwt`- und `header_auth`-Workflows verhalten sich genauso wie der reguläre Webhook-Endpoint
- Response-Caching gilt weiterhin, wenn `cache_ttl_seconds` konfiguriert ist
- Workflow-Rate-Limits gelten weiterhin, wenn `rate_limit_requests` und `rate_limit_window_seconds` konfiguriert sind
- `test_run` umgeht sowohl Cache als auch Rate-Limiting, genauso wie bei `/execute`

## Verwandte Themen

- [Webhooks](./webhooks.md) – Standard-Execute-Endpoint und cURL-Dialog
- [Parallele Ausführung](./parallel-execution.md) – Wie Streaming in Heyms DAG-Scheduler passt
- [Canvas-Funktionen](./canvas-features.md) – Editor-Steuerelemente einschließlich Run with cURL
- [Security](./security.md) – Authentifizierung und Umgang mit Secrets
