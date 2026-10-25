# SSE Streaming

A workflow-k valós időben streamelhetik a végrehajtási eseményeket Server-Sent Events (SSE) segítségével.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Ez az endpoint ugyanazokat a workflow-szintű hitelesítési, rate limiting és válasz-gyorsítótárazási szabályokat használja, mint a standard execute endpoint, amely a [Webhooks](./webhooks.md) dokumentációban található.

## Az SSE engedélyezése a cURL párbeszédablakban

Nyissa meg a **Run with cURL** párbeszédablakot a szerkesztőben, és engedélyezze az **SSE Streaming** opciót.

Ha engedélyezve van, a Heym:

- a generált parancsot `/execute`-ról `/execute/stream`-re váltja
- hozzáadja a `--no-buffer` kapcsolót, hogy a streamelt események azonnal megjelenjenek a terminál kimenetében
- hozzáadja az `Accept: text/event-stream` fejlécet
- lehetővé teszi a csomópontonkénti `node_start` üzenetek közvetlen konfigurálását a párbeszédablakban

## Eseményprotokoll

Minden SSE frame újsorral elválasztott JSON, amely `data: ` előtaggal kezdődik.

| Eseménytípus | Mikor kerül kibocsátásra | Kulcsfontosságú mezők |
|------------|--------------------|------------|
| `queued` | A workflow elérte a [párhuzamossági korlátját](./webhooks.md#concurrency-limit-and-queued-runs); újra elküldésre kerül, valahányszor megváltozik a futtatás helye | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Közvetlenül a kérés elfogadása után, vagy amikor egy sorba állított futtatás elindul | `execution_id`, `server_now_ms` |
| `node_start` | Közvetlenül azelőtt, hogy egy csomópont megkezdi a végrehajtást | `node_id`, `node_label`, `started_at_ms`, opcionális `message` |
| `node_retry` | Amikor egy csomópont újrapróbálkozik | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Miután egy csomópont befejeződik | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Amikor egy Output csomópont korán visszatér | `node_label`, `output` |
| `execution_complete` | Miután a workflow befejeződik | `status`, `outputs`, `execution_time_ms` |

### Sorba állított futtatások

Amikor a workflow eléri a párhuzamossági korlátját, a stream nyitva marad, és `queued` eseményeket küld, miközben a futtatás várakozik. A sorba állított futtatás a háttér-feldolgozóban (background worker) hajtódik végre, esetleg egy másik folyamatban, így a stream az `execution_started` eseményt hordozza a futtatás indulásakor és az `execution_complete` eseményt a befejezésekor, de a kettő között nincsenek `node_start`, `node_complete` vagy token események. Az `execution_complete` eseménye üres `node_results` mezőt tartalmaz; nyissa meg a futtatást a [Végrehajtási előzményekben](./execution-history.md) a csomópontok részleteiért. A kapcsolat bezárása nem szakítja meg a sorba állított futtatást. Ha a sor megtelt, a kérésre `429`-es válasz érkezik a stream megnyitása előtt.

## Csomópontonkénti kezdő üzenetek

A cURL párbeszédablak az SSE beállításokat magán a workflow-n tárolja:

- A **Send start** szabályozza, hogy egy `node_start` esemény tartalmazzon-e `message` mezőt
- A **Start message** alapértelmezett értéke `[START] {nodeLabel}`
- egy egyéni üzenet törlése visszaáll az alapértelmezett szövegre
- a `node_complete` mindig kibocsátásra kerül, és mindig tartalmazza a csomópont kimenetét

Példa tárolt konfigurációra:

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

## cURL példa

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Példa eseménystream:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Biztonsági megjegyzések

- az `anonymous`, `jwt` és `header_auth` workflow-k ugyanúgy viselkednek, mint a normál webhook endpoint
- a válasz-gyorsítótárazás továbbra is érvényes, ha a `cache_ttl_seconds` konfigurálva van
- a workflow rate limitek továbbra is érvényesek, ha a `rate_limit_requests` és a `rate_limit_window_seconds` konfigurálva vannak
- a `test_run` megkerüli mind a gyorsítótárat, mind a rate limitinget, ugyanúgy, ahogy a `/execute` esetében is teszi

## Kapcsolódó

- [Webhooks](./webhooks.md) – Standard execute endpoint és cURL párbeszédablak
- [Parallel Execution](./parallel-execution.md) – Hogyan illeszkedik a streaming a Heym DAG ütemezőjébe
- [Canvas Features](./canvas-features.md) – Szerkesztő vezérlők, beleértve a Run with cURL opciót
- [Security](./security.md) – Hitelesítés és titkok kezelése
