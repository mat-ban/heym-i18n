# Strumieniowanie SSE

Workflows mogą strumieniować zdarzenia wykonania w czasie rzeczywistym za pomocą Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Ten endpoint wykorzystuje te same zasady uwierzytelniania na poziomie workflow, limitowania szybkości oraz buforowania odpowiedzi, co standardowy endpoint execute opisany w sekcji [Webhooks](./webhooks.md).

## Włączanie SSE w oknie dialogowym cURL

Należy otworzyć okno dialogowe **Run with cURL** w edytorze i włączyć opcję **SSE Streaming**.

Po włączeniu Heym:

- przełącza wygenerowane polecenie z `/execute` na `/execute/stream`
- dodaje `--no-buffer`, aby strumieniowane zdarzenia pojawiały się natychmiast w danych wyjściowych terminala
- dodaje `Accept: text/event-stream`
- umożliwia konfigurację komunikatów `node_start` dla poszczególnych węzłów bezpośrednio w oknie dialogowym

## Protokół zdarzeń

Każda ramka SSE to JSON rozdzielany znakami nowej linii, poprzedzony prefiksem `data: `.

| Typ zdarzenia | Moment emisji | Kluczowe pola |
|------------|--------------------|------------|
| `execution_started` | Natychmiast po zaakceptowaniu żądania | `execution_id`, `server_now_ms` |
| `node_start` | Tuż przed rozpoczęciem wykonania węzła | `node_id`, `node_label`, `started_at_ms`, opcjonalnie `message` |
| `node_retry` | Gdy węzeł ponawia próbę | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Po zakończeniu pracy węzła | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Gdy węzeł Output zwraca wynik wcześniej | `node_label`, `output` |
| `execution_complete` | Po zakończeniu workflow | `status`, `outputs`, `execution_time_ms` |

## Komunikaty startowe dla poszczególnych węzłów

Okno dialogowe cURL przechowuje ustawienia SSE w samym workflow:

- **Send start** kontroluje, czy zdarzenie `node_start` zawiera pole `message`
- **Start message** domyślnie przyjmuje wartość `[START] {nodeLabel}`
- wyczyszczenie niestandardowego komunikatu powoduje powrót do tekstu domyślnego
- `node_complete` jest zawsze emitowane i zawsze zawiera dane wyjściowe węzła

Przykładowa zapisana konfiguracja:

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

## Przykład cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Przykładowy strumień zdarzeń:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Uwagi dotyczące bezpieczeństwa

- workflows typu `anonymous`, `jwt` oraz `header_auth` działają tak samo jak w przypadku zwykłego endpointu webhook
- buforowanie odpowiedzi nadal obowiązuje, gdy skonfigurowano `cache_ttl_seconds`
- limity szybkości workflow nadal obowiązują, gdy skonfigurowano `rate_limit_requests` oraz `rate_limit_window_seconds`
- `test_run` pomija zarówno pamięć podręczną, jak i limitowanie szybkości, tak samo jak w przypadku `/execute`

## Powiązane

- [Webhooks](./webhooks.md) – Standardowy endpoint execute oraz okno dialogowe cURL
- [Parallel Execution](./parallel-execution.md) – Jak strumieniowanie wpisuje się w scheduler DAG Heym
- [Canvas Features](./canvas-features.md) – Elementy sterujące edytora, w tym Run with cURL
- [Security](./security.md) – Uwierzytelnianie i obsługa sekretów
