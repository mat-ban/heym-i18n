# Webhooky

Workflowy je možné spúšťať prostredníctvom HTTP webhookov. Štandardný execute endpoint vracia JSON a jeho streamingová varianta vracia Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Nahraďte `{workflow_id}` identifikátorom UUID daného workflow. Základnou URL je Vaša inštancia Heym (napr. `https://app.heym.ai`).

## Metóda požiadavky

Každý workflow akceptuje jeden HTTP verb, ktorý sa volí v dialógu cURL v editore: `GET`, `POST`, `PUT` alebo `DELETE`. **Predvolenou metódou je `POST`** a každý workflow vytvorený pred zavedením tohto nastavenia si ju zachováva, takže nič, čo dnes funguje, sa nemení.

Volanie workflow s iným verbom vráti `405 Method Not Allowed` s hlavičkou `Allow`, ktorá uvádza nakonfigurovaný verb:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Jedna výnimka: požiadavky obsahujúce `?test_run=true` kontrolu preskočia. Práve také odosiela tlačidlo **Run** v editore a debug panel, takže workflow nastavený na `GET` zostáva testovateľný priamo z produktu.

### Metódy bez tela požiadavky

`GET` a `DELETE` neobsahujú telo požiadavky. Vstupy sa namiesto toho preberajú z query stringu a čítajú sa pomocou `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Dialóg cURL pre tieto dve metódy skryje editor tela požiadavky a vynechá hlavičku `Content-Type`.

Skombinujte `GET` s [HTML output mapperom](../nodes/html-output-mapper-node.md), aby ste poskytli stránku, ktorú môže prehliadač otvoriť priamo.

## Streamingový endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Streamingový endpoint použite vtedy, keď chcete inkrementálne udalosti vykonávania namiesto jednej odpovede JSON. Protokol udalostí a konfiguráciu správy o spustení jednotlivých uzlov nájdete v časti [SSE Streaming](./sse-streaming.md).

## Formát požiadavky

Telo požiadavky sa odovzdáva ako `body` do uzlov [Input](../nodes/input-node.md). Heym akceptuje oba tvary požiadavky:

- **Raw JSON** – napr. `{"userId": "123", "action": "create"}`
- **Zabalený formát** – `{"inputs": {...}, "test_run": false}`

Pri použití zabaleného formátu sa `inputs` extrahuje a odovzdá ako `body`. Parameter `test_run` obchádza rate limiting a cache odpovedí. Pri odosielaní raw JSON môžete tiež poslať `?test_run=true` ako query parameter.

## Režimy tela požiadavky

Každý workflow má nastavenie `webhook_body_mode`, ktoré určuje, ako editor zostavuje vzorové požiadavky:

| Režim | Správanie |
|------|----------|
| **defined** | Editor a dialóg cURL vytvárajú vzorové telo z polí uzla Input daného workflow a zachovávajú prázdne kľúče v JSON payload. Existujúce cURL payloady v štýle defined fungujú naďalej. |
| **generic** | Editor a dialóg cURL používajú voľne formulované telo JSON. Telo požiadavky sa odovzdáva tak, ako je, aby externé aplikácie mohli posielať vlastný pevný tvar payloadu. |

Execution API zostáva v oboch režimoch spätne kompatibilné. Raw JSON aj zabalené požiadavky `{ "inputs": ... }` sú akceptované v oboch prípadoch.

Hlavičky a query parametre sú dostupné vo výrazoch ako `$input.headers` a `$input.query`. Kľúče hlavičiek sú prevedené na malé písmená.

## Autentifikácia

Konfiguruje sa pre jednotlivé workflowy v editore (nastavenia workflow). Autentifikácia sa overuje pred vykonaním.

| auth_type | Správanie |
|-----------|----------|
| **anonymous** | Nevyžaduje sa autentifikácia. Endpoint môže zavolať ktokoľvek. |
| **jwt** | Vyžaduje sa bearer token. Akceptuje buď token používateľskej session (používateľ musí mať prístup k workflow), alebo scoped [Execution Token](./execution-tokens.md) vytvorený pre tento workflow. |
| **header_auth** | Vlastná hlavička sa musí zhodovať. Nastavte `auth_header_key` (napr. `X-API-Key`) a `auth_header_value`. |

Pri `header_auth` sa hodnota hlavičky požiadavky musí presne zhodovať s nakonfigurovanou hodnotou. Používatelia s JWT a prístupom k workflow môžu tiež volať bez vlastnej hlavičky.

Pri `jwt` sú [Execution Tokens](./execution-tokens.md) odporúčaným spôsobom volania workflowov z externých systémov – sú scoped na jediný workflow a možno ich nezávisle odvolať.

## Cache odpovedí

Konfiguruje sa pomocou `cache_ttl_seconds` pre jednotlivé workflowy. Ak je nastavená a väčšia ako 0:

- **Kľúč cache**: SHA256 hash z `workflow_id` + `body` + `query`
- **Cache hit**: Vráti sa okamžite so `status: "cached"` a cachovanými výstupmi
- **Cache set**: Až po úspešnom vykonaní (`status: "success"`)
- **Úložisko**: Postgres-backed a zdieľané medzi backendovými workermi

| Nastavenie | Účinok |
|---------|--------|
| `cache_ttl_seconds` = 0 alebo null | Cachovanie vypnuté |
| `cache_ttl_seconds` > 0 | Odpovede sa cachujú po tento počet sekúnd |

Požiadavky `test_run` obchádzajú cache (žiadne čítanie, žiadny zápis).

Keď je v dialógu cURL zapnuté cachovanie odpovedí, tlačidlo **Clear cache** okamžite odstráni cachované odpovede aktuálneho workflow.

## Rate limiting

Konfiguruje sa pre jednotlivé workflowy: `rate_limit_requests` a `rate_limit_window_seconds`.

- **Rozsah**: Podľa `workflow_id` + IP klienta (sliding window)
- **Prekročenie**: HTTP 429 s hlavičkou `Retry-After`
- **Hlavičky**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Nastavenie | Popis |
|---------|-------------|
| `rate_limit_requests` | Maximálny počet povolených požiadaviek v okne |
| `rate_limit_window_seconds` | Trvanie okna v sekundách |

Požiadavky `test_run` obchádzajú rate limiting.
<a id="concurrency-limit-and-queued-runs"></a>

## Limit súbehu a zaradené behy

Workflow môže obmedziť počet produkčných behov vykonávaných súčasne. Zapnite **Limit súbehu** v paneli **Properties** na úrovni workflow a nastavte **Maximálny počet súbežných behov**. Vlastníci a spolupracovníci s právami na úpravu ho môžu meniť. Predvolene je limit vypnutý.

Po dosiahnutí limitu nové behy čakajú vo fronte FIFO (prvý dnu, prvý von). Pokrýva to každý produkčný vstupný bod: tento endpoint, [streamingový endpoint](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) a každý [trigger](./triggers.md). Vlastné testovacie behy editora sa vždy spúšťajú okamžite a neobsadzujú slot. Odoslanie `test_run=true` bez prihlásenej relácie schopnej otvoriť workflow front neobíde.

| Nastavenie | Popis |
|---|---|
| `concurrency_limit` | Povolené produkčné behy súčasne. `0` limit vypína |
| `concurrency_max_queue` | Voliteľné. Povolený počet čakajúcich behov súčasne. Prázdne znamená bez limitu |
| `concurrency_max_wait_seconds` | Voliteľné. Beh čakajúci dlhšie sa zaznamená ako `expired`. Prázdne znamená neobmedzené čakanie |

### 202 Accepted

Volanie, ktoré sa spustí okamžite, sa správa presne tak, ako je popísané v časti Formát odpovede. Volanie, ktoré musí čakať, okamžite dostane `202 Accepted`, bez ohľadu na hlavičku `X-Simple-Response`, s hlavičkou `Location` odkazujúcou na URL stavu:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Pole | Popis |
|---|---|
| `queue.position` | Miesto tohto behu v rade, začínajúc od 1 |
| `queue.size` | Behy aktuálne čakajúce v rade |
| `queue.running` | Behy aktuálne obsadzujúce slot |
| `queue.limit` | Limit súbehu daného workflow |
| `status_token` | Iba anonymné workflowy. Vrátené iba raz v tejto odpovedi |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` odpovedá stavom behu. Volajte ho s rovnakými povereniami, ktoré beh spustili: reláciou alebo JWT, [tokenom vykonania](./execution-tokens.md) alebo vlastnou hlavičkou workflowu. Anonymný workflow neoveruje prihlasovacie údaje, preto odošlite `status_token` z odpovede 202 v hlavičke `X-Heym-Run-Token`. Token sa nikdy nečíta z query stringu. Nesprávny alebo chýbajúci token dostane `404`, rovnako ako neznáma exekúcia.

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

| `status` | Význam (beh, ktorý musí čakať na slot súbehu, dostane namiesto toho [odpoveď 202](#202-accepted)) |
|---|---|
| `queued` | Čaká na voľný slot; objekt `queue` zobrazuje stav |
| `running` | Má pridelený slot a vykonáva sa |
| `success` / `error` | Dokončené; polia `outputs` a `error` sú vyplnené |
| `pending` | Pozastavené pre [ľudskú kontrolu](./human-in-the-loop.md) |
| `cancelled` | Zrušené z [Histórie spustení](./execution-history.md) |
| `expired` | Čakalo dlhšie ako `concurrency_max_wait_seconds` a nikdy sa nespustilo |

Dopytujte sa každých niekoľko sekúnd, kým stav nie je iný ako `queued` alebo `running`. Zaradený beh sa vykoná aj vtedy, ak sa naň nikto nedopytuje.

### Plný front

Ak je nastavené `concurrency_max_queue` a toľko behov už čaká, volanie je odmietnuté s `429 Concurrency queue is full` a záznamom `queue_full` v histórii behov. Nič sa do frontu nezaradí.

## Formát odpovede

Endpoint vracia JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Pole | Popis |
|-------|-------------|
| `workflow_id` | UUID workflowu |
| `status` | `success`, `error`, `cached` alebo `rate_limited` |
| `outputs` | Výstupy koncových uzlov. Ak je jediným koncovým uzlom jediný [JSON output mapper](../nodes/json-output-mapper-node.md), telo odpovede tvorí tento mapovaný objekt na najvyššej úrovni (predvolené jednoduché JSON odpovede). V opačnom prípade obsahuje [Output](../nodes/output-node.md) a ďalšie koncové uzly kľúčované podľa označenia. |
| `execution_time_ms` | Čas vykonania v milisekundách (0 pre cached/rate_limited) |

V prípade chyby môže `outputs` obsahovať podrobnosti o chybe. Uzol [Throw Error](../nodes/throw-error-node.md) môže nastaviť vlastný HTTP stavový kód (4xx/5xx).

## Dialóg Run with cURL

Tlačidlo **Run with cURL** na paneli nástrojov (v pravom hornom rohu editora, ikona `cURL`) otvára dialóg, ktorý zostaví a skopíruje pripravený cURL príkaz pre aktuálny workflow.

### Čo robí

| Pole | Popis |
|-------|-------------|
| **Request Body Mode** | Vyberte **Defined** alebo **Generic**. Generic zachováva telo ako surový JSON namiesto jeho formovania z polí Input. |
| **Authentication** | Vyberte Anonymous, JWT Token alebo Header Auth. Nastaví správnu autentifikačnú hlavičku v príkaze. Pri výbere JWT Token dialóg zobrazí správcu [Execution Token](./execution-tokens.md) — vytvorte alebo vyberte token, ktorý sa vloží priamo do príkazu. |
| **Header Key / Value** | Zobrazí sa pri výbere Header Auth. Predvyplnené z nastavení autentifikácie workflowu. |
| **Response Cache** | Počet minút pre cachovanie identických odpovedí (0 = vypnuté). Zmeny sa ukladajú do workflowu. Ak je zapnuté, **Clear cache** okamžite odstráni cachované odpovede. |
| **Rate Limit** | Maximálny počet požiadaviek za časové okno. Zmeny sa ukladajú do workflowu. |
| **SSE Streaming** | Prepne príkaz na `/execute/stream`, pridá `--no-buffer` a sprístupní nastavenia správy `node_start` pre jednotlivé uzly. |
| **Body** | Telo JSON požiadavky. V režime Defined je predvyplnené z polí [Input](../nodes/input-node.md) a zachováva prázdne kľúče. V režime Generic ide o editor surového JSON. |
| **Command** | Náhľad celého cURL príkazu iba na čítanie. |

Kliknutím na **Copy cURL** skopírujete príkaz do schránky.

### Príklad

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

V režime Generic zostávajú vnorené payloady nedotknuté, napríklad:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialóg zrkadlí nastavenia autentifikácie, režimu tela, cachovania a rate-limitu uložené vo workflowe — ich úprava tu okamžite aktualizuje workflow.

### SSE Streaming v dialógu

Zapnite **SSE Streaming**, ak chcete, aby vygenerovaný príkaz sledoval vykonávanie v reálnom čase z vášho terminálu.

- Endpoint sa zmení z `/execute` na `/execute/stream`
- Príkaz pridá `--no-buffer` a `Accept: text/event-stream`
- Každý non-sticky uzol sa zobrazí v zozname, kde môžete:
  - zapnúť alebo vypnúť správu `node_start`
  - prispôsobiť text úvodnej správy
- Udalosti `node_complete` sa odosielajú vždy a obsahujú úplný výstup uzla

Príklad:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Kompletný protokol udalostí a príklady nájdete v [SSE Streaming](./sse-streaming.md).

## Označovanie zdroja triggera

Každé vykonanie ukladá označenie `trigger_source` viditeľné v [Execution History](./execution-history.md). Nastavte ho odoslaním hlavičky `X-Trigger-Source` s ľubovoľnou hodnotou, ktorú si zvolíte:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Tlačidlo **Copy cURL** v dialógu editora automaticky obsahuje `X-Trigger-Source: API`. Hodnotu `API` môžete nahradiť čímkoľvek zmysluplným — `scheduler`, `rabbitmq`, `github-actions` atď.

Ak hlavička nie je odoslaná, `trigger_source` má predvolenú hodnotu `"API"` a spustenie je v histórii označené ako **API**. Prepíšte ju ľubovoľnou hodnotou zmysluplnou pre váš systém — `scheduler`, `github-actions`, `rabbitmq` atď.

## Súvisiace

- [Execution Tokens](./execution-tokens.md) – Scoped JWT pre volanie workflowov z externých systémov
- [SSE Streaming](./sse-streaming.md) – Streamovanie udalostí uzlov v reálnom čase cez Server-Sent Events
- [Triggers](./triggers.md) – Všetky vstupné body workflowu vrátane webhooku
- [Workflow Structure](./workflow-structure.md) – Uzly a hrany
- [Expression DSL](./expression-dsl.md) – Prístup k `$input.body`, `$input.headers`, `$input.query`
