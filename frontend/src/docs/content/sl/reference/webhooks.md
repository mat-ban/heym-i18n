# Webhooki

Workflows lahko sprožite prek HTTP webhookov. Standardni izvršilni endpoint vrne JSON, medtem ko streaming različica vrača Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Zamenjajte `{workflow_id}` z UUID workflowa. Osnovni URL je vaša instanca Heym (npr. `https://app.heym.ai`).

## Metoda zahteve

Vsak workflow sprejema eno HTTP metodo, izbrano v cURL dialogu urejevalnika: `GET`, `POST`, `PUT` ali `DELETE`. **`POST` je privzeta**, in vsak workflow, ustvarjen pred to nastavitvijo, jo ohrani, tako da se nič, kar deluje danes, ne spremeni.

Klic workflowa z drugo metodo vrne `405 Method Not Allowed` z `Allow` glavo, ki navaja konfigurirano metodo:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Ena izjema: zahteve, ki vsebujejo `?test_run=true`, preskočijo preverjanje. To je tisto, kar gumb **Run** v urejevalniku in debug panel pošiljata, tako da ostane workflow nastavljen na `GET` testabilen znotraj produkta.

### Metode brez telesa

`GET` in `DELETE` ne prenašata telesa zahteve. Vhodni podatki prihajajo iz poizvedbenega niza in se berejo z `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

CURL dialog skriva urejevalnik telesa zahteve in odstrani `Content-Type` glavo za ti dve metodi.

Povežite `GET` z [HTML output mapper](../nodes/html-output-mapper-node.md), da postrežete stran, ki jo lahko brskalnik odpre neposredno.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Uporabite streaming endpoint, ko želite inkrementalne dogodke izvršitve namesto enega samega JSON odgovora. Oglejte si [SSE Streaming](./sse-streaming.md) za protokol dogodkov in konfiguracijo sporočila za zagon po vozliščih.

## Oblika zahteve

Telo zahteve se prenese kot `body` do [Input](../nodes/input-node.md) vozlišč. Heym sprejema obe obliki zahtev:

- **Surov JSON** – npr. `{"userId": "123", "action": "create"}`
- **Oviti format** – `{"inputs": {...}, "test_run": false}`

Ko uporabljate oviti format, se `inputs` izloči in prenese kot `body`. `test_run` obide omejevanje hitrosti in predpomnjenje odgovorov. Prav tako lahko pošljete `?test_run=true` kot poizvedbeni parameter pri pošiljanju surovega JSON.

## Načini telesa zahteve

Vsak workflow ima nastavitev `webhook_body_mode`, ki nadzira, kako urejevalnik gradi vzorčne zahteve:

| Način | Obnašanje |
|-------|-----------|
| **defined** | Urejevalnik in cURL dialog oblikujeta vzorčno telo iz polj Input vozlišča workflowa in ohranjata prazne ključe v JSON payloadu. Obstoječi cURL payloadi v definiranem slogu še naprej delujejo. |
| **generic** | Urejevalnik in cURL dialog uporabljata prosto oblikovano JSON telo. Telo zahteve se prenese nespremenjeno, tako da lahko zunanje aplikacije pošljejo svojo lastno fiksno obliko payloada. |

API za izvrševanje ostaja združljiv z obema načinoma. Surov JSON in ovite `{ "inputs": ... }` zahteve so še vedno sprejete na obeh načinov.

Glave in poizvedbeni parametri so na voljo v izrazih kot `$input.headers` in `$input.query`. Ključi glav so zapisani z malimi črkami.

## Avtentikacija

Konfigurirajte za vsak workflow v urejevalniku (nastavitve workflowa). Avtentikacija se preveri pred izvršitvijo.

| auth_type | Obnašanje |
|-----------|-----------|
| **anonymous** | Avtentikacija ni potrebna. Kdor koli lahko pokliče endpoint. |
| **jwt** | Zahteva se Bearer token. Sprejme bodisi token seje uporabnika (uporabnik mora imeti dostop do workflowa) ali obsežen [Execution Token](./execution-tokens.md), ustvarjen za ta workflow. |
| **header_auth** | Prilagojena glava se mora ujemati. Nastavite `auth_header_key` (npr. `X-API-Key`) in `auth_header_value`. |

Za `header_auth` se mora vrednost glave zahteve natančno ujemati z nastavljeno vrednostjo. Uporabniki JWT z dostopom do workflowa lahko prav tako kličejo brez prilagojene glave.

Za `jwt` so [Execution Tokens](./execution-tokens.md) priporočeni način klicanja workflowov iz zunanjih sistemov — so omejeni na en workflow in jih je mogoče neodvisno preklicati.

## Predpomnjenje odgovorov

Konfigurirajte `cache_ttl_seconds` za vsak workflow. Ko je nastavljeno in večje od 0:

- **Ključ predpomnjenja**: SHA256 hash `workflow_id` + `body` + `query`
- **Zadetek predpomnjenja**: Takoj vrne z `status: "cached"` in predpomnjenimi izhodi
- **Nastavitev predpomnjenja**: Le po uspešni izvršitvi (`status: "success"`)
- **Shranjevanje**: Podpora za Postgres in deljena med backend delavci

| Nastavitev | Učinek |
|------------|--------|
| `cache_ttl_seconds` = 0 ali null | Predpomnjenje onemogočeno |
| `cache_ttl_seconds` > 0 | Odgovori so predpomnjeni za to število sekund |

Zahteve `test_run` obidejo predpomnjenje (brez branja, brez pisanja).

Ko je predpomnjenje odgovorov omogočeno v cURL dialogu, **Clear cache** takoj izbriše predpomnjene odgovore trenutnega workflowa.

## Omejevanje hitrosti

Konfigurirajte za vsak workflow: `rate_limit_requests` in `rate_limit_window_seconds`.

- **Obseg**: Po `workflow_id` + IP stranke (drseče okno)
- **Prekoračeno**: HTTP 429 z `Retry-After` glavo
- **Glave**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Nastavitev | Opis |
|------------|------|
| `rate_limit_requests` | Največje število dovoljenih zahtev v oknu |
| `rate_limit_window_seconds` | Trajanje okna v sekundah |

Zahteve `test_run` obidejo omejevanje hitrosti.
<a id="concurrency-limit-and-queued-runs"></a>

## Omejitev sočasnosti in izvajanja v čakalni vrsti

Workflow lahko omeji število produkcijskih izvajanj, ki se izvajajo hkrati. Vklopite **Omejitev sočasnosti** v plošči **Properties** na ravni workflowa in nastavite **Največ sočasnih izvajanj**. Lastniki in sodelavci z dostopom za urejanje lahko to spremenijo. Omejitev je privzeto izklopljena.

Ko je omejitev dosežena, nova izvajanja čakajo v čakalni vrsti FIFO (prvi noter, prvi ven). To pokriva vsako produkcijsko vstopno točko: ta endpoint, [streaming endpoint](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) in vsak [trigger](./triggers.md). Lastna preizkusna izvajanja urejevalnika se vedno začnejo takoj in ne zasedejo reže. Pošiljanje `test_run=true` brez prijavljene seje z dovoljenjem za odpiranje workflowa ne zaobide čakalne vrste.

| Nastavitev | Opis |
|---|---|
| `concurrency_limit` | Dovoljena produkcijska izvajanja hkrati. `0` izklopi omejitev |
| `concurrency_max_queue` | Izbirno. Dovoljeno število čakajočih izvajanj hkrati. Prazno pomeni brez omejitve |
| `concurrency_max_wait_seconds` | Izbirno. Izvajanje, ki čaka dlje, se zabeleži kot `expired`. Prazno pomeni neomejeno čakanje |

### 202 Accepted

Klic, ki se začne takoj, se obnaša natanko tako, kot je opisano v poglavju Oblika Odgovora. Klic, ki mora počakati, takoj prejme `202 Accepted`, ne glede na glavo `X-Simple-Response`, z glavo `Location`, ki kaže na URL njegovega stanja:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Polje | Opis |
|---|---|
| `queue.position` | Mesto tega izvajanja v vrsti, začenši z 1 |
| `queue.size` | Izvajanja, ki trenutno čakajo |
| `queue.running` | Izvajanja, ki trenutno zasedajo režo |
| `queue.limit` | Omejitev sočasnosti workflowa |
| `status_token` | Samo za anonimne workflowe. Vrne se enkrat v tem odgovoru |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` odgovarja s stanjem izvajanja. Pokličite ga z istimi poverilnicami, s katerimi se je izvajanje začelo: sejo ali JWT, [žetonom izvajanja](./execution-tokens.md) ali prilagojeno glavo workflowa. Anonimni workflow nima poverilnic za preverjanje, zato pošljite `status_token` iz odgovora 202 v glavi `X-Heym-Run-Token`. Žeton se nikoli ne bere iz poizvedovalnega niza. Napačen ali manjkajoči žeton prejme `404`, enako kot neznano izvajanje.

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

| `status` | Pomen (izvajanje, ki mora počakati na režo sočasnosti, namesto tega prejme [odgovor 202](#202-accepted)) |
|---|---|
| `queued` | Čaka na režo; `queue` prikazuje položaj |
| `running` | Ima dodeljeno režo in se izvaja |
| `success` / `error` | Zaključeno; polji `outputs` in `error` sta izpolnjeni |
| `pending` | Zaustavljeno za [človeški pregled](./human-in-the-loop.md) |
| `cancelled` | Preklicano iz [Zgodovine izvajanja](./execution-history.md) |
| `expired` | Čakalo je dlje kot `concurrency_max_wait_seconds` in se nikoli ni izvedlo |

Poizvedujte vsakih nekaj sekund, dokler stanje ni več `queued` ali `running`. Izvajanje v čakalni vrsti se izvede tudi, če nihče ne poizveduje.

### Polna čakalna vrsta

Ko je nastavljen `concurrency_max_queue` in že čaka toliko izvajanj, se klic zavrne z `429 Concurrency queue is full` in vnosom `queue_full` v zgodovini izvajanja. Nič se ne postavi v čakalno vrsto.

## Oblika Odgovora

Endpoint vrne JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Polje | Opis |
|-------|-------------|
| `workflow_id` | UUID delovnega toka |
| `status` | `success`, `error`, `cached` ali `rate_limited` |
| `outputs` | Izhodi terminalnega vozlišča. Če je edini terminal [JSON output mapper](../nodes/json-output-mapper-node.md), je telo odgovora to preslikano objekt na vrhnji ravni (privzeti preprosti JSON odgovori). V nasprotnem primeru vključuje [Output](../nodes/output-node.md) in druga terminalna vozlišča, ključna po oznaki. |
| `execution_time_ms` | Čas izvajanja v milisekundah (0 za cached/rate_limited) |

V primeru napake lahko `outputs` vsebuje podrobnosti o napaki. Vozlišče [Throw Error](../nodes/throw-error-node.md) lahko nastavi po meri HTTP statusno kodo (4xx/5xx).

## Izvedba z cURL Dialogom

Gumb **Izvedi z cURL** (zgoraj desno v urejevalniku, ikona `cURL`) odpre dialog, ki ustvari in kopira pripravljeno cURL ukaz za trenutni delovni tok.

### Kaj to počne

| Polje | Opis |
|-------|-------------|
| **Način telesa zahteve** | Izberite **Določeno** ali **Splošno**. Splošno ohrani telo kot surov JSON namesto da bi ga oblikovalo iz vhodnih polj. |
| **Avtentikacija** | Izberite Anonymous, JWT Token ali Header Auth. Nastavi pravilen avtentikacijski glavi v ukazu. Ko je izbran JWT Token, dialog prikaže upravljalnik [Execution Token](./execution-tokens.md) — ustvarite ali izberite token, da ga neposredno vstavite v ukaz. |
| **Glavni ključ / vrednost** | Vidno, ko je izbrana Header Auth. Predizpolnjeno iz nastavitev avtentikacije delovnega toka. |
| **Predpomnjenje odgovorov** | Minute za predpomnjenje identičnih odgovorov (0 = onemogočeno). Spremembe se shranijo v delovni tok. Ko je omogočeno, **Počisti predpomnilnik** takoj izbriše predpomnjene odgovore. |
| **Omejitev hitrosti** | Maksimalno število zahtev na časovno okno. Spremembe se shranijo v delovni tok. |
| **SSE Streaming** | Preklopi ukaz na `/execute/stream`, doda `--no-buffer` in izpostavi nastavitve sporočil `node_start` za vsako vozlišče. |
| **Telo** | JSON telo zahteve. V Določenem načinu je predizpolnjeno iz [Input](../nodes/input-node.md) polj in ohranja prazne ključe. V Splošnem načinu je to surov urejevalnik JSON. |
| **Ukaz** | Samo za branje predogled celotnega cURL ukaza. |

Kliknite **Kopiraj cURL**, da kopirate ukaz v odložišče.

### Primer

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

V Splošnem načinu ostanejo gnezdeni payloadi nedotaknjeni, na primer:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialog odraža nastavitve avtentikacije, načina telesa, predpomnjenja in omejitve hitrosti, shranjene v delovnem toku — urejanje tukaj takoj posodobi delovni tok.

### SSE Streaming v Dialogu

Omogočite **SSE Streaming**, ko želite, da generirani ukaz sledi izvajanju v realnem času iz vašega terminala.

- Endpoint se spremeni iz `/execute` v `/execute/stream`
- Ukaz doda `--no-buffer` in `Accept: text/event-stream`
- Vsako nestabilno vozlišče se prikaže na seznamu, kjer lahko:
  - omogočite ali onemogočite sporočilo `node_start`
  - prilagodite besedilo začetnega sporočila
- Dogodki `node_complete` se vedno oddajajo in vključujejo celoten izhod vozlišča

Primer:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Za celoten protokol dogodkov in primere si oglejte [SSE Streaming](./sse-streaming.md).

## Oznaka Izvor Trigerja

Vsaka izvedba shrani oznako `trigger_source`, vidno v [Zgodovina izvajanja](./execution-history.md). Nastavite jo tako, da pošljete glavo `X-Trigger-Source` z vrednostjo po vaši izbiri:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Gumb **Kopiraj cURL** v dialogu urejevalnika samodejno vključuje `X-Trigger-Source: API`. Lahko zamenjate `API` z nečim smiselnega — `scheduler`, `rabbitmq`, `github-actions`, itd.

Če glava ni poslana, `trigger_source` privzeto nastavi na `"API"` in se izvajanje označi kot **API** v zgodovini. Prekličite ga z vrednostjo, ki je smiselna za vaš sistem — `scheduler`, `github-actions`, `rabbitmq`, itd.

## Sorodno

- [Execution Tokens](./execution-tokens.md) – Obsegani JWT-ji za klicanje delovnih tokov iz zunanjih sistemov
- [SSE Streaming](./sse-streaming.md) – Pretakanje dogodkov vozlišč v realnem času prek dogodkov, ki jih pošlje strežnik
- [Triggers](./triggers.md) – Vsi vstopni točki delovnega toka, vključno z webhook
- [Workflow Structure](./workflow-structure.md) – Vozlišča in robovi
- [Expression DSL](./expression-dsl.md) – Dostop do `$input.body`, `$input.headers`, `$input.query`
