# SSE Streaming

Workflowy môžu streamovať udalosti spustenia v reálnom čase pomocou Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Tento endpoint používa rovnaké pravidlá autentifikácie na úrovni workflow, obmedzenia rýchlosti a cachovania odpovedí ako štandardný endpoint na spustenie zdokumentovaný v [Webhooks](./webhooks.md).

## Zapnutie SSE v dialógu cURL

V editore otvorte dialóg **Run with cURL** a zapnite **SSE Streaming**.

Po zapnutí Heym:

- prepne generovaný príkaz z `/execute` na `/execute/stream`
- pridá `--no-buffer`, aby sa streamované udalosti zobrazovali v termináli okamžite
- pridá `Accept: text/event-stream`
- umožní vám nakonfigurovať správy `node_start` pre jednotlivé uzly priamo v dialógu

## Protokol udalostí

Každý SSE rámec je JSON oddeľovaný novými riadkami s predponou `data: `.

| Typ udalosti | Kedy sa vysiela | Kľúčové polia |
|------------|--------------------|------------|
| `queued` | Workflow dosiahol svoj [limit súbehu](./webhooks.md#concurrency-limit-and-queued-runs); odosiela sa znova pri každej zmene pozície spustenia | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Ihneď po prijatí požiadavky alebo pri spustení behu v rade | `execution_id`, `server_now_ms` |
| `node_start` | Tesne predtým, než uzol začne vykonávanie | `node_id`, `node_label`, `started_at_ms`, voliteľné `message` |
| `node_retry` | Keď uzol opakuje pokus | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Po dokončení uzla | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Keď výstupný uzol vráti výsledok predčasne | `node_label`, `output` |
| `execution_complete` | Po skončení workflow | `status`, `outputs`, `execution_time_ms` |

### Spustenia v rade

Keď workflow dosiahne svoj limit súbehu, stream zostáva otvorený a počas čakania spustenia odosiela udalosti `queued`. Spustenie zaradené do radu sa vykonáva na pozadí vo workeri, prípadne v inom procese, takže jeho stream nesie `execution_started` pri začiatku spustenia a `execution_complete` pri jeho dokončení, ale žiadne udalosti `node_start`, `node_complete` ani udalosti tokenov medzi tým. Jeho `execution_complete` má prázdne `node_results`; otvorte spustenie v [Histórii spustení](./execution-history.md) pre podrobnosti o uzloch. Uzatvorenie spojenia nezruší spustenie v rade. Keď je rad plný, požiadavka je zodpovedaná kódom `429` ešte pred otvorením streamu.

## Správy o spustení pre jednotlivé uzly

Dialóg cURL ukladá nastavenia SSE priamo na workflow:

- **Send start** ovláda, či udalosť `node_start` obsahuje `message`
- **Start message** má predvolenú hodnotu `[START] {nodeLabel}`
- vymazaním vlastnej správy sa obnoví predvolený text
- `node_complete` sa vysiela vždy a vždy obsahuje výstup uzla

Príklad uloženej konfigurácie:

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

## Príklad cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Ukážka streamu udalostí:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Bezpečnostné poznámky

- Workflowy typu `anonymous`, `jwt` a `header_auth` sa správajú rovnako ako bežný webhook endpoint
- cachovanie odpovedí stále platí, ak je nakonfigurované `cache_ttl_seconds`
- obmedzenia rýchlosti workflow stále platia, ak sú nakonfigurované `rate_limit_requests` a `rate_limit_window_seconds`
- `test_run` obchádza cache aj obmedzenie rýchlosti, rovnako ako pri `/execute`

## Súvisiace

- [Webhooks](./webhooks.md) – Štandardný endpoint na spustenie a dialóg cURL
- [Parallel Execution](./parallel-execution.md) – Ako streamovanie zapadá do plánovača DAG v Heym
- [Canvas Features](./canvas-features.md) – Ovládacie prvky editora vrátane Run with cURL
- [Security](./security.md) – Autentifikácia a správa tajných údajov
