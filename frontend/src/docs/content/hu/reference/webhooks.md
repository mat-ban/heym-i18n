# Webhookok

A workflow-k HTTP webhookokon keresztül indíthatók. A szabványos execute endpoint JSON-t ad vissza, a streaming változat pedig Server-Sent Events (SSE) formájában.

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

A `{workflow_id}` helyére a workflow UUID-ját írja. A base URL az Ön Heym példánya (pl. `https://app.heym.ai`).

## Kérési metódus

Minden workflow egyetlen HTTP igét fogad el, amelyet a szerkesztő cURL párbeszédpaneljén választ ki: `GET`, `POST`, `PUT` vagy `DELETE`. **A `POST` az alapértelmezett**, és minden olyan workflow, amely e beállítás létezése előtt jött létre, ezt használja, így semmi sem változik a jelenleg működő folyamatokban.

Ha egy workflow-t eltérő igével hív meg, az `405 Method Not Allowed` választ ad vissza egy `Allow` fejléccel, amely megnevezi a beállított igét:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Egy kivétel: a `?test_run=true` paramétert tartalmazó kérések kihagyják az ellenőrzést. Ezt küldi a szerkesztő **Run** gombja és a debug panel, így a `GET`-re beállított workflow a terméken belülről tesztelhető marad.

### Törzs nélküli metódusok

A `GET` és a `DELETE` nem tartalmaz kérési törzset. A bemenetek helyette a query stringből származnak, és a `$input.query.<name>` kifejezéssel olvashatók be:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

A cURL párbeszédpanel e két metódus esetében elrejti a kérési törzs szerkesztőjét, és eltávolítja a `Content-Type` fejlécet.

Párosítsa a `GET` metódust egy [HTML output mapper](../nodes/html-output-mapper-node.md) csomóponttal, hogy egy böngészőből közvetlenül megnyitható oldalt szolgáljon ki.

## Streaming endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

A streaming endpointot akkor használja, ha egyetlen JSON válasz helyett inkrementális végrehajtási eseményeket szeretne. Az eseményprotokollról és a csomópontonkénti start üzenet konfigurációjáról lásd az [SSE Streaming](./sse-streaming.md) oldalt.

## Kérés formátuma

A kérési törzs `body` néven kerül átadásra az [Input](../nodes/input-node.md) csomópontoknak. A Heym mindkét kérési formátumot elfogadja:

- **Nyers JSON** – pl. `{"userId": "123", "action": "create"}`
- **Csomagolt formátum** – `{"inputs": {...}, "test_run": false}`

A csomagolt formátum használatakor az `inputs` kinyerésre és `body` néven átadásra kerül. A `test_run` megkerüli a rate limitinget és a válasz gyorsítótárazást. Nyers JSON küldésekor a `?test_run=true` query paraméterként is megadható.

## Kérési törzs módok

Minden workflow rendelkezik egy `webhook_body_mode` beállítással, amely szabályozza, hogyan építi fel a szerkesztő a minta kéréseket:

| Mód | Viselkedés |
|------|----------|
| **defined** | A szerkesztő és a cURL párbeszédpanel a workflow Input csomópontjának mezőiből alakítja ki a példa törzset, és megtartja az üres kulcsokat a JSON payloadban. A meglévő defined-stílusú cURL payloadok továbbra is működnek. |
| **generic** | A szerkesztő és a cURL párbeszédpanel szabad formátumú JSON törzset használ. A kérési törzs változatlanul kerül átadásra, így a külső alkalmazások a saját rögzített payload formátumukat küldhetik. |

A végrehajtási API mindkét módban visszafelé kompatibilis marad. A nyers JSON és a csomagolt `{ "inputs": ... }` kérések mindkét esetben elfogadottak.

A fejlécek és query paraméterek kifejezésekben `$input.headers` és `$input.query` néven érhetők el. A fejléc kulcsok kisbetűssé alakulnak.

## Hitelesítés

Workflow-nként konfigurálható a szerkesztőben (workflow beállítások). A hitelesítés a végrehajtás előtt kerül ellenőrzésre.

| auth_type | Viselkedés |
|-----------|----------|
| **anonymous** | Nincs szükség hitelesítésre. Bárki hívhatja az endpointot. |
| **jwt** | Bearer token szükséges. Elfogad felhasználói session tokent (a felhasználónak workflow hozzáféréssel kell rendelkeznie) vagy egy erre a workflow-ra létrehozott, hatókörrel rendelkező [Execution Token](./execution-tokens.md)-t. |
| **header_auth** | Egy egyedi fejlécnek egyeznie kell. Állítsa be az `auth_header_key` (pl. `X-API-Key`) és az `auth_header_value` értékeket. |

A `header_auth` esetében a kérési fejléc értékének pontosan meg kell egyeznie a konfigurált értékkel. A workflow hozzáféréssel rendelkező JWT felhasználók az egyedi fejléc nélkül is hívhatják.

A `jwt` esetében az [Execution Tokenek](./execution-tokens.md) jelentik az ajánlott módot a workflow-k külső rendszerekből történő hívására – ezek egyetlen workflow-ra vannak hatókörözve, és egymástól függetlenül visszavonhatók.

## Válasz gyorsítótárazás

Workflow-nként konfigurálható a `cache_ttl_seconds`. Ha be van állítva és nagyobb, mint 0:

- **Cache kulcs**: a `workflow_id` + `body` + `query` SHA256 hash-e
- **Cache találat**: Azonnal visszatér `status: "cached"` állapottal és a gyorsítótárazott kimenetekkel
- **Cache beállítás**: Csak sikeres végrehajtás után (`status: "success"`)
- **Tárolás**: Postgres-alapú, és a backend workerek között megosztott

| Beállítás | Hatás |
|---------|--------|
| `cache_ttl_seconds` = 0 vagy null | Gyorsítótárazás letiltva |
| `cache_ttl_seconds` > 0 | A válaszok ennyi másodpercig gyorsítótárazódnak |

A `test_run` kérések megkerülik a cache-t (nincs olvasás, nincs írás).

Ha a válasz gyorsítótárazás engedélyezett a cURL párbeszédpanelen, a **Clear cache** azonnal törli az aktuális workflow gyorsítótárazott válaszait.

## Rate limiting

Workflow-nként konfigurálható: `rate_limit_requests` és `rate_limit_window_seconds`.

- **Hatókör**: `workflow_id` + kliens IP szerint (csúszó ablak)
- **Túllépés**: HTTP 429 a `Retry-After` fejléccel
- **Fejlécek**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Beállítás | Leírás |
|---------|-------------|
| `rate_limit_requests` | Az ablakban engedélyezett maximális kérésszám |
| `rate_limit_window_seconds` | Az ablak hossza másodpercben |

A `test_run` kérések megkerülik a rate limitinget.
<a id="concurrency-limit-and-queued-runs"></a>

## Konkurencialimit és sorba állított futások

A workflow korlátozhatja az egyszerre végrehajtható éles futások számát. Kapcsolja be a **Konkurencialimit** opciót a workflow szintű **Properties** panelen, és állítsa be a **Max. egyidejű futások** értékét. A tulajdonosok és szerkesztési jogosultsággal rendelkező közreműködők módosíthatják. A limit alapértelmezés szerint ki van kapcsolva.

Amikor a limit elérésre kerül, az új futások egy FIFO (first-in, first-out) sorban várakoznak. Ez minden éles belépési pontra érvényes: erre az endpointra, a [streaming endpointra](./sse-streaming.md), a [Portalra](./portal.md), a [Quick Drawerre](./quick-drawer.md), az [MCP-re](../tabs/mcp-tab.md) és minden [triggerre](./triggers.md). A szerkesztő saját tesztfutásai mindig azonnal elindulnak, és nem foglalnak slotot. A `test_run=true` küldése olyan bejelentkezett munkamenet nélkül, amely megnyithatja a workflow-t, nem kerüli meg a sort.

| Beállítás | Leírás |
|---|---|
| `concurrency_limit` | Egyszerre engedélyezett éles futások száma. `0` kikapcsolja a korlátot |
| `concurrency_max_queue` | Opcionális. Egyszerre várakozni engedélyezett futások. Üresen hagyva korlátlan |
| `concurrency_max_wait_seconds` | Opcionális. A megadott időnél tovább várakozó futás `expired` státuszt kap. Üresen hagyva addig vár, ameddig szükséges |

### 202 Accepted

Az azonnal elinduló hívás pontosan úgy viselkedik, ahogy a Válaszformátum szakaszban le van írva. A várakozásra kényszerülő hívás azonnal `202 Accepted` választ kap, függetlenül az `X-Simple-Response` értékétől, a státusz URL-jére mutató `Location` fejléccel:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Mező | Leírás |
|---|---|
| `queue.position` | A futás sorszáma a sorban, 1-től kezdve |
| `queue.size` | Jelenleg várakozó futások |
| `queue.running` | Jelenleg slotot foglaló futások |
| `queue.limit` | A workflow konkurencialimitje |
| `status_token` | Csak névtelen workflow-k esetén. Egyszer kerül visszaadásra ebben a válaszban |

### Status URL

A `GET /api/workflows/{workflow_id}/executions/{execution_id}/status` végpont a futás állapotával válaszol. Hívja meg ugyanazokkal a hitelesítő adatokkal, amelyekkel a futást elindította: munkamenettel vagy JWT-vel, egy [futtatási tokennel](./execution-tokens.md) vagy a workflow egyéni fejlécével. A névtelen workflow-k nem rendelkeznek ellenőrizendő hitelesítő adatokkal, ezért a 202-es válaszból származó `status_token` értéket küldje az `X-Heym-Run-Token` fejlécben. A tokent a rendszer soha nem olvassa be a lekérdezési karakterláncból. A hibás vagy hiányzó token `404` hibát eredményez, akárcsak egy ismeretlen futás.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Jelentés (a konkurenciaslotra várni kényszerülő futás helyette a [202-es választ](#202-accepted) kapja) |
|---|---|
| `queued` | Helyre vár; a `queue` mutatja a pozíciót |
| `running` | Slotot kapott és éppen fut |
| `success` / `error` | Befejeződött; az `outputs` és az `error` ki van töltve |
| `pending` | Szüneteltetve [emberi felülvizsgálathoz](./human-in-the-loop.md) |
| `cancelled` | Megszakítva a [Futtatási előzményekből](./execution-history.md) |
| `expired` | Tovább várt, mint a `concurrency_max_wait_seconds`, és soha nem futott le |

Néhány másodpercenként kérdezze le az állapotot, amíg az nem `queued` vagy `running`. A sorba állított futás akkor is végrehajtásra kerül, ha senki sem kérdezi le az állapotát.

### Megtelt a sor

Ha a `concurrency_max_queue` be van állítva, és már annyi futás várakozik, a hívás `429 Concurrency queue is full` hibával elutasításra kerül, és egy `queue_full` bejegyzés jön létre a futtatási előzményekben. Semmi sem kerül a sorba.

## Válaszformátum

Az endpoint JSON-t ad vissza:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Mező | Leírás |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` vagy `rate_limited` |
| `outputs` | A terminál csomópontok kimenetei. Ha egyetlen [JSON output mapper](../nodes/json-output-mapper-node.md) az egyetlen terminál, a válasz törzse a legfelső szinten az a leképezett objektum (alapértelmezett egyszerű JSON válaszok). Egyéb esetben tartalmazza az [Output](../nodes/output-node.md) csomópontot és a többi terminált a címkéjük szerint kulcsolva. |
| `execution_time_ms` | Végrehajtási idő milliszekundumban (0 a cached/rate_limited esetén) |

Hiba esetén az `outputs` tartalmazhatja a hiba részleteit. A [Throw Error](../nodes/throw-error-node.md) csomópont egyedi HTTP státuszkódot (4xx/5xx) állíthat be.

## Futtatás cURL-lel párbeszédablak

A **Futtatás cURL-lel** eszköztár gomb (a szerkesztő jobb felső sarkában, `cURL` ikon) megnyit egy párbeszédablakot, amely felépít és a vágólapra másol egy azonnal futtatható cURL parancsot az aktuális workflow-hoz.

### Mit tesz

| Mező | Leírás |
|-------|-------------|
| **Request Body Mode** | Válassza a **Defined** vagy **Generic** lehetőséget. A Generic a törzset nyers JSON-ként tartja meg ahelyett, hogy az Input mezőkből alakítaná ki. |
| **Authentication** | Válassza az Anonymous, JWT Token vagy Header Auth lehetőséget. Beállítja a megfelelő auth fejlécet a parancsban. JWT Token kiválasztásakor a párbeszédablak megjelenít egy [Execution Token](./execution-tokens.md) kezelőt — hozzon létre vagy válasszon egy tokent, hogy közvetlenül a parancsba ágyazza. |
| **Header Key / Value** | Akkor látható, ha a Header Auth van kiválasztva. A workflow auth beállításaiból előre kitöltve. |
| **Response Cache** | Az azonos válaszok gyorsítótárazásának percekben megadott időtartama (0 = letiltva). A módosítások a workflow-ba mentődnek. Ha engedélyezett, a **Clear cache** azonnal törli a gyorsítótárazott válaszokat. |
| **Rate Limit** | A kérések maximális száma időablakonként. A módosítások a workflow-ba mentődnek. |
| **SSE Streaming** | Átváltja a parancsot a `/execute/stream` végpontra, hozzáadja a `--no-buffer` kapcsolót, és elérhetővé teszi a csomópontonkénti `node_start` üzenetbeállításokat. |
| **Body** | JSON kérés törzs. Defined módban az [Input](../nodes/input-node.md) mezőkből előre kitöltve, és megtartja az üres kulcsokat. Generic módban nyers JSON szerkesztő. |
| **Command** | A teljes cURL parancs csak olvasható előnézete. |

Kattintson a **Copy cURL** gombra a parancs vágólapra másolásához.

### Példa

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic módban a beágyazott payloadok érintetlenek maradnak, például:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

A párbeszédablak tükrözi a workflow-n tárolt hitelesítési, body mód, gyorsítótárazási és rate-limit beállításokat — az itteni szerkesztésük azonnal frissíti a workflow-t.

### SSE Streaming a párbeszédablakban

Engedélyezze az **SSE Streaming** lehetőséget, ha azt szeretné, hogy a generált parancs valós időben kövesse a végrehajtást a termináljából.

- Az endpoint `/execute`-ról `/execute/stream`-re változik
- A parancs hozzáadja a `--no-buffer` kapcsolót és az `Accept: text/event-stream` fejlécet
- Minden nem sticky csomópont megjelenik egy listában, ahol Ön:
  - engedélyezheti vagy letilthatja a `node_start` üzenetet
  - testreszabhatja a kezdő üzenet szövegét
- A `node_complete` események mindig kibocsátásra kerülnek, és tartalmazzák a teljes csomópont kimenetet

Példa:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

A teljes eseményprotokollért és példákért lásd: [SSE Streaming](./sse-streaming.md).

## Trigger forrás címkézése

Minden végrehajtás tárol egy `trigger_source` címkét, amely az [Execution History](./execution-history.md) felületen látható. Állítsa be az `X-Trigger-Source` fejléc elküldésével, tetszőleges értékkel:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

A szerkesztő párbeszédablakában a **Copy cURL** gomb automatikusan tartalmazza az `X-Trigger-Source: API` fejlécet. Az `API` értéket bármi értelmesre lecserélheti — `scheduler`, `rabbitmq`, `github-actions` stb.

Ha a fejléc nincs elküldve, a `trigger_source` alapértelmezett értéke `"API"`, és a futtatás az előzményekben **API** címkével jelenik meg. Felülírhatja bármilyen, az Ön rendszere szempontjából értelmes értékkel — `scheduler`, `github-actions`, `rabbitmq` stb.

## Kapcsolódó

- [Execution Tokens](./execution-tokens.md) – Hatókörrel rendelkező JWT-k workflow-k külső rendszerekből történő hívásához
- [SSE Streaming](./sse-streaming.md) – Csomópont események valós idejű streamelése Server-Sent Events segítségével
- [Triggers](./triggers.md) – Minden workflow belépési pont, beleértve a webhookot
- [Workflow Structure](./workflow-structure.md) – Csomópontok és élek
- [Expression DSL](./expression-dsl.md) – A `$input.body`, `$input.headers`, `$input.query` elérése
