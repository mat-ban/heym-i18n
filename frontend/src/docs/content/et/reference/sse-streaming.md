# SSE Streaming

Workflow'd saavad reaalajas käivitussündmusi edastada Server-Sent Events (SSE) abil.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

See endpoint kasutab samu workflow-tasemel autentimise, rate limiting'u ja vastuse vahemällu salvestamise reegleid nagu standardne execute endpoint, mis on dokumenteeritud jaotises [Webhooks](./webhooks.md).

## SSE lubamine cURL dialoogis

Avage redaktoris dialoog **Run with cURL** ja lubage **SSE Streaming**.

Kui see on lubatud, siis Heym:

- vahetab genereeritud käsu `/execute` asemel `/execute/stream` vastu
- lisab `--no-buffer`, et edastatavad sündmused ilmuksid terminali väljundis kohe
- lisab `Accept: text/event-stream`
- võimaldab konfigureerida iga sõlme `node_start` sõnumeid otse dialoogis

## Sündmuste protokoll

Iga SSE kaader on reavahedega eraldatud JSON, millele eelneb `data: `.

| Sündmuse tüüp | Millal see saadetakse | Põhiväljad |
|------------|--------------------|------------|
| `execution_started` | Kohe pärast päringu vastuvõtmist | `execution_id`, `server_now_ms` |
| `node_start` | Vahetult enne, kui sõlm alustab täitmist | `node_id`, `node_label`, `started_at_ms`, valikuline `message` |
| `node_retry` | Kui sõlm teeb uuesti katse | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Pärast seda, kui sõlm on lõpetanud | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Kui Output sõlm tagastab varakult | `node_label`, `output` |
| `execution_complete` | Pärast workflow lõppemist | `status`, `outputs`, `execution_time_ms` |

## Sõlmede kaupa algussõnumid

cURL dialoog salvestab SSE seaded workflow'i enda külge:

- **Send start** juhib, kas `node_start` sündmus sisaldab `message` välja
- **Start message** vaikeväärtus on `[START] {nodeLabel}`
- kohandatud sõnumi tühjendamisel taastub vaiketekst
- `node_complete` saadetakse alati ja sisaldab alati sõlme väljundit

Näide salvestatud konfiguratsioonist:

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

## cURL näide

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Näidis sündmustevoog:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Turvamärkused

- `anonymous`, `jwt` ja `header_auth` workflow'd käituvad samamoodi nagu tavaline webhook endpoint
- vastuse vahemällu salvestamine kehtib endiselt, kui `cache_ttl_seconds` on konfigureeritud
- workflow rate limit'ud kehtivad endiselt, kui `rate_limit_requests` ja `rate_limit_window_seconds` on konfigureeritud
- `test_run` möödub nii vahemälust kui ka rate limiting'ust samamoodi nagu `/execute` puhul

## Seotud

- [Webhooks](./webhooks.md) – Standardne execute endpoint ja cURL dialoog
- [Parallel Execution](./parallel-execution.md) – Kuidas streaming sobib Heym'i DAG-ajastajasse
- [Canvas Features](./canvas-features.md) – Redaktori juhtelemendid, sealhulgas Run with cURL
- [Security](./security.md) – Autentimine ja saladuste käsitlemine
