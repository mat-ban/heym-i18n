# SSE Streaming

Workflows var straumēt izpildes notikumus reāllaikā, izmantojot Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Šis endpoint izmanto tos pašus workflow līmeņa autentifikācijas, pieprasījumu ierobežošanas un atbilžu kešatmiņas noteikumus kā standarta execute endpoint, kas dokumentēts sadaļā [Webhooks](./webhooks.md).

## SSE iespējošana cURL dialogā

Atveriet **Run with cURL** dialogu redaktorā un iespējojiet **SSE Streaming**.

Kad tas ir iespējots, Heym:

- nomaina ģenerēto komandu no `/execute` uz `/execute/stream`
- pievieno `--no-buffer`, lai straumētie notikumi termināļa izvadē parādītos nekavējoties
- pievieno `Accept: text/event-stream`
- ļauj konfigurēt katra node `node_start` ziņojumus tieši dialogā

## Notikumu protokols

Katrs SSE kadrs ir ar jaunu rindu atdalīts JSON ar prefiksu `data: `.

| Notikuma tips | Kad tas tiek emitēts | Galvenie lauki |
|------------|--------------------|------------|
| `execution_started` | Nekavējoties pēc pieprasījuma pieņemšanas | `execution_id`, `server_now_ms` |
| `node_start` | Tieši pirms node sāk izpildi | `node_id`, `node_label`, `started_at_ms`, neobligāts `message` |
| `node_retry` | Kad node veic atkārtotu mēģinājumu | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Pēc tam, kad node ir pabeigts | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Kad Output node atgriežas pirms laika | `node_label`, `output` |
| `execution_complete` | Pēc workflow beigām | `status`, `outputs`, `execution_time_ms` |

## Katra node sākuma ziņojumi

cURL dialogs saglabā SSE iestatījumus pašā workflow:

- **Send start** kontrolē, vai `node_start` notikums ietver `message`
- **Start message** pēc noklusējuma ir `[START] {nodeLabel}`
- notīrot pielāgoto ziņojumu, tiek atgriezts noklusējuma teksts
- `node_complete` vienmēr tiek emitēts un vienmēr ietver node izvadi

Saglabātās konfigurācijas piemērs:

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

## cURL piemērs

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Notikumu straumes paraugs:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Drošības piezīmes

- `anonymous`, `jwt` un `header_auth` workflow darbojas tāpat kā parastais webhook endpoint
- atbilžu kešatmiņa joprojām tiek piemērota, ja ir konfigurēts `cache_ttl_seconds`
- workflow pieprasījumu ierobežojumi joprojām tiek piemēroti, ja ir konfigurēti `rate_limit_requests` un `rate_limit_window_seconds`
- `test_run` apiet gan kešatmiņu, gan pieprasījumu ierobežošanu tāpat kā tas dara attiecībā uz `/execute`

## Saistītie resursi

- [Webhooks](./webhooks.md) – Standarta execute endpoint un cURL dialogs
- [Parallel Execution](./parallel-execution.md) – Kā straumēšana iekļaujas Heym DAG plānotājā
- [Canvas Features](./canvas-features.md) – Redaktora vadīklas, tostarp Run with cURL
- [Security](./security.md) – Autentifikācija un noslēpumu apstrāde
