# SSE Streaming

Workflow mohou streamovat události spuštění v reálném čase pomocí Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Tento endpoint používá stejná pravidla pro autentizaci na úrovni workflow, rate limiting a cachování odpovědí jako standardní endpoint pro spuštění dokumentovaný v části [Webhooks](./webhooks.md).

## Povolení SSE v dialogu cURL

Otevřete v editoru dialog **Run with cURL** a povolte **SSE Streaming**.

Pokud je tato možnost povolena, Heym:

- přepne generovaný příkaz z `/execute` na `/execute/stream`
- přidá `--no-buffer`, aby se streamované události zobrazovaly ve výstupu terminálu okamžitě
- přidá `Accept: text/event-stream`
- umožní vám konfigurovat zprávy `node_start` pro jednotlivé uzly přímo v dialogu

## Protokol událostí

Každý SSE rámec je JSON oddělený novým řádkem s prefixem `data: `.

| Typ události | Kdy je vygenerována | Klíčová pole |
|------------|--------------------|------------|
| `queued` | Workflow dosáhl svého [limitu souběhu](./webhooks.md#concurrency-limit-and-queued-runs); odesílá se znovu při každé změně pozice běhu | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Ihned po přijetí požadavku nebo když se spustí běh ve frontě | `execution_id`, `server_now_ms` |
| `node_start` | Těsně před zahájením spuštění uzlu | `node_id`, `node_label`, `started_at_ms`, volitelné `message` |
| `node_retry` | Když uzel opakuje pokus | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Po dokončení uzlu | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Když výstupní uzel vrátí výsledek předčasně | `node_label`, `output` |
| `execution_complete` | Po ukončení workflow | `status`, `outputs`, `execution_time_ms` |

### Běhy ve frontě

Když workflow dosáhne svého limitu souběhu, stream zůstává otevřený a během čekání běhu odesílá události `queued`. Běh zařazený do fronty se provádí na pozadí ve workeru, případně v jiném procesu, takže jeho stream nese `execution_started` při spuštění běhu a `execution_complete` při jeho dokončení, ale žádné události `node_start`, `node_complete` nebo události tokenů mezi tím. Jeho `execution_complete` má prázdné `node_results`; otevřete běh v [Historii spuštění](./execution-history.md) pro podrobnosti o uzlech. Uzavření spojení nezruší běh ve frontě. Když je fronta plná, požadavek je zodpovězen kódem `429` ještě před otevřením streamu.

## Zprávy při spuštění jednotlivých uzlů

Dialog cURL ukládá nastavení SSE přímo do samotného workflow:

- **Send start** určuje, zda událost `node_start` obsahuje `message`
- **Start message** má výchozí hodnotu `[START] {nodeLabel}`
- vymazání vlastní zprávy se vrátí k výchozímu textu
- `node_complete` je generována vždy a vždy obsahuje výstup uzlu

Příklad uložené konfigurace:

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

## Příklad cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Ukázkový stream událostí:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Bezpečnostní poznámky

- workflow typu `anonymous`, `jwt` a `header_auth` se chovají stejně jako běžný webhook endpoint
- cachování odpovědí se stále uplatňuje, pokud je nakonfigurováno `cache_ttl_seconds`
- limity rychlosti workflow se stále uplatňují, pokud jsou nakonfigurovány `rate_limit_requests` a `rate_limit_window_seconds`
- `test_run` obchází jak cache, tak rate limiting, stejně jako u `/execute`

## Související

- [Webhooks](./webhooks.md) – Standardní endpoint pro spuštění a dialog cURL
- [Parallel Execution](./parallel-execution.md) – Jak streaming zapadá do plánovače DAG v Heymu
- [Canvas Features](./canvas-features.md) – Ovládací prvky editoru včetně Run with cURL
- [Security](./security.md) – Autentizace a práce s tajnými údaji
