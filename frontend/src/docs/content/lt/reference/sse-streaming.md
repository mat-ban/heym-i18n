# SSE Streaming

Workflow'ai gali transliuoti vykdymo įvykius realiuoju laiku naudojant Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Šis endpoint'as naudoja tas pačias workflow lygio autentifikacijos, greičio ribojimo ir atsakymų talpinimo taisykles kaip standartinis vykdymo endpoint'as, aprašytas [Webhooks](./webhooks.md).

## SSE įgalinimas cURL dialoge

Atidarykite **Run with cURL** dialogą redaktoriuje ir įgalinkite **SSE Streaming**.

Kai įgalinta, Heym:

- pakeičia sugeneruotą komandą iš `/execute` į `/execute/stream`
- prideda `--no-buffer`, kad transliuojami įvykiai pasirodytų iš karto terminalo išvestyje
- prideda `Accept: text/event-stream`
- leidžia konfigūruoti per mazgą `node_start` pranešimus tiesiogiai dialoge

## Įvykių protokolas

Kiekvienas SSE rėmas yra JSON, atskirtas nauja eilute, su prefiksu `data: `.

| Įvykio tipas | Kada jis išmetamas | Pagrindiniai laukai |
|--------------|--------------------|---------------------|
| `execution_started` | Iškart po to, kai užklausa priimama | `execution_id`, `server_now_ms` |
| `node_start` | Tiesiai prieš mazgo vykdymą | `node_id`, `node_label`, `started_at_ms`, neprivalomas `message` |
| `node_retry` | Kai mazgas bando dar kartą | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Po to, kai mazgas baigia | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Kai Output mazgas grąžina anksti | `node_label`, `output` |
| `execution_complete` | Po to, kai workflow baigiasi | `status`, `outputs`, `execution_time_ms` |

## Pranešimai apie mazgo pradžią

cURL dialogas saugo SSE nustatymus pačiame workflow:

- **Send start** kontroliuoja, ar `node_start` įvykis apima `message`
- **Start message** pagal numatytuosius nustatymus yra `[START] {nodeLabel}`
- išvalius pasirinktą pranešimą, grįžtama prie numatytojo teksto
- `node_complete` visada išmetamas ir visada apima mazgo išvestį

Pavyzdinis saugomas konfigūracija:

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

## cURL Pavyzdys

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Pavyzdinė įvykių transliacija:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Saugumo pastabos

- `anonymous`, `jwt`, ir `header_auth` workflow'ai elgiasi taip pat kaip įprastas webhook endpoint'as
- atsakymų talpinimas vis dar taikomas, kai `cache_ttl_seconds` yra sukonfigūruotas
- workflow greičio ribojimai vis dar taikomi, kai `rate_limit_requests` ir `rate_limit_window_seconds` yra sukonfigūruoti
- `test_run` apeina tiek talpinimą, tiek greičio ribojimą, taip pat kaip ir `/execute`

## Susiję

- [Webhooks](./webhooks.md) – Standartinis vykdymo endpoint'as ir cURL dialogas
- [Parallel Execution](./parallel-execution.md) – Kaip transliacija tinka Heym DAG planuotojui
- [Canvas Features](./canvas-features.md) – Redaktoriaus valdikliai, įskaitant Run with cURL
- [Security](./security.md) – Autentifikacija ir slaptažodžių tvarkymas
