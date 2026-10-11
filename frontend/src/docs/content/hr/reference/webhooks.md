# Webhookovi

Workflows se mogu aktivirati putem HTTP webhookova. Standardni execute endpoint vraća JSON, dok streaming varijanta vraća Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Zamijenite `{workflow_id}` s UUID-om workflowa. Osnovna URL adresa je Vaša Heym instanca (npr. `https://app.heym.ai`).

## Metoda zahtjeva

Svaki workflow prihvaća jedan HTTP glagol, odabran u cURL dijalogu uređivača: `GET`, `POST`, `PUT` ili `DELETE`. **`POST` je zadani**, a svaki workflow stvoren prije nego što je ova postavka uvedena zadržava ga, tako da ništa što danas radi ne mijenja.

Pozivanje workflowa s različitim glagolom vraća `405 Method Not Allowed` s `Allow` zaglavljem koje navodi konfigurirani:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Jedna iznimka: zahtjevi koji sadrže `?test_run=true` preskoče provjeru. To je ono što gumb **Run** uređivača i panel za ispravljanje grešaka šalju, tako da workflow postavljen na `GET` ostaje testabilan iz unutar proizvoda.

### Metode bez tijela

`GET` i `DELETE` ne sadrže tijelo zahtjeva. Ulazi dolaze iz upitnog niza, a čitaju se s `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL dijalog skriva uređivač tijela zahtjeva i uklanja `Content-Type` zaglavlje za ove dvije metode.

Povežite `GET` s [HTML output mapper](../nodes/html-output-mapper-node.md) kako biste poslužili stranicu koju preglednik može izravno otvoriti.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Koristite streaming endpoint kada želite inkrementalne događaje izvršenja umjesto jednog JSON odgovora. Pogledajte [SSE Streaming](./sse-streaming.md) za protokol događaja i konfiguraciju poruka za pokretanje po čvorovima.

## Format zahtjeva

Tijelo zahtjeva se prosljeđuje kao `body` čvorovima [Input](../nodes/input-node.md). Heym prihvaća oba oblika zahtjeva:

- **Siromašni JSON** – npr. `{"userId": "123", "action": "create"}`
- **Obavijen format** – `{"inputs": {...}, "test_run": false}`

Kada koristite obavijen format, `inputs` se izvlači i prosljeđuje kao `body`. `test_run` zaobilazi ograničenja brzine i predmemoriju odgovora. Također možete poslati `?test_run=true` kao upitni parametar kada šaljete siromašni JSON.

## Načini tijela zahtjeva

Svaki workflow ima postavku `webhook_body_mode` koja kontrolira kako uređivač gradi uzorke zahtjeva:

| Način | Ponašanje |
|-------|-----------|
| **definiran** | Uređivač i cURL dijalog oblikuju primjer tijela iz polja čvora Input workflowa i zadržavaju prazne ključeve u JSON payloadu. Postojeći definiranog stila cURL payloadi nastavljaju raditi. |
| **općenit** | Uređivač i cURL dijalog koriste slobodni JSON body. Tijelo zahtjeva se prosljeđuje onako kako jest kako bi vanjske aplikacije mogle slati vlastiti fiksni oblik payloada. |

API za izvršenje ostaje unatrag kompatibilan u oba načina. Siromašni JSON i obavijeni `{ "inputs": ... }` zahtjevi se i dalje prihvaćaju na oba načina.

Zaglavlja i upitni parametri dostupni su u izrazima kao `$input.headers` i `$input.query`. Ključevi zaglavlja su u malim slovima.

## Autentifikacija

Konfigurirajte po workflowu u uređivaču (postavke workflowa). Autentifikacija se provjerava prije izvršenja.

| auth_type | Ponašanje |
|-----------|-----------|
| **anonimno** | Nema potrebne autentifikacije. Svako može pozvati endpoint. |
| **jwt** | Potreban je Bearer token. Prihvaća ili token sesije korisnika (korisnik mora imati pristup workflowu) ili opseg [Execution Token](./execution-tokens.md) stvoren za ovaj workflow. |
| **header_auth** | Prilagođeni zaglavlje mora odgovarati. Postavite `auth_header_key` (npr. `X-API-Key`) i `auth_header_value`. |

Za `header_auth`, vrijednost zaglavlja zahtjeva mora točno odgovarati konfiguriranoj vrijednosti. JWT korisnici s pristupom workflowu također mogu pozvati bez prilagođenog zaglavlja.

Za `jwt`, [Execution Tokens](./execution-tokens.md) su preporučeni način pozivanja workflowa iz vanjskih sustava — oni su ograničeni na jedan workflow i mogu se neovisno opozvati.

## Predmemorija odgovora

Konfigurirajte `cache_ttl_seconds` po workflowu. Kada je postavljeno i veće od 0:

- **Ključ predmemorije**: SHA256 hash `workflow_id` + `body` + `query`
- **Pogodak predmemorije**: Vraća odmah s `status: "cached"` i predmemoriranim izlazima
- **Postavljanje predmemorije**: Samo nakon uspješnog izvršenja (`status: "success"`)
- **Skladištenje**: Postgres podržano i dijeljeno među radnicima na backendu

| Postavka | Učinak |
|----------|--------|
| `cache_ttl_seconds` = 0 ili null | Predmemorija onemogućena |
| `cache_ttl_seconds` > 0 | Odgovori se predmemoriraju na ovaj broj sekundi |

Zahtjevi s `test_run` zaobilaze predmemoriju (nema čitanja, nema pisanja).

Kada je predmemorija odgovora omogućena u cURL dijalogu, **Clear cache** odmah uklanja predmemorirane odgovore trenutnog workflowa.

## Ograničavanje brzine

Konfigurirajte po workflowu: `rate_limit_requests` i `rate_limit_window_seconds`.

- **Opseg**: Po `workflow_id` + IP klijenta (klizni prozor)
- **Prekoračeno**: HTTP 429 s `Retry-After` zaglavljem
- **Zaglavlja**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Postavka | Opis |
|----------|------|
| `rate_limit_requests` | Maksimalan broj zahtjeva dopuštenih u prozoru |
| `rate_limit_window_seconds` | Trajanje prozora u sekundama |

Zahtjevi s `test_run` zaobilaze ograničavanje brzine.
## Format Odgovora

Endpoint vraća JSON:

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
| `workflow_id` | UUID Workflow-a |
| `status` | `success`, `error`, `cached` ili `rate_limited` |
| `outputs` | Izlazi terminalnog čvora. Kada je jedini terminal [JSON output mapper](../nodes/json-output-mapper-node.md), tijelo odgovora je taj mapirani objekt na vrhu (zadani jednostavni JSON odgovori). Inače uključuje [Output](../nodes/output-node.md) i druge terminale označene etiketom. |
| `execution_time_ms` | Vrijeme izvršavanja u milisekundama (0 za cached/rate_limited) |

U slučaju pogreške, `outputs` može sadržavati detalje o pogrešci. [Throw Error](../nodes/throw-error-node.md) čvor može postaviti prilagođeni HTTP status kod (4xx/5xx).

## Pokretanje s cURL Dijalogom

Gumb na alatnoj traci **Run with cURL** (gore desno u uređivaču, ikona `cURL`) otvara dijalog koji gradi i kopira spremnu za pokretanje cURL naredbu za trenutni workflow.

### Što Radi

| Polje | Opis |
|-------|-------------|
| **Način Tijela Zahtjeva** | Odaberite **Defined** ili **Generic**. Generic zadržava tijelo kao sirovi JSON umjesto da ga oblikuje iz Input polja. |
| **Autentifikacija** | Odaberite Anonymous, JWT Token ili Header Auth. Postavlja ispravnu auth zaglavlje u naredbi. Kada je odabran JWT Token, dijalog prikazuje upravitelja [Execution Token](./execution-tokens.md) — kreirajte ili odaberite token za umetanje izravno u naredbu. |
| **Zaglavlje Ključ / Vrijednost** | Vidljivo kada je odabrana Header Auth. Automatski popunjjeno iz postavki autentifikacije workflow-a. |
| **Predmemorija Odgovora** | Minute za predmemoriranje identičnih odgovora (0 = onemogućeno). Promjene se spremaju u workflow. Kada je omogućeno, **Clear cache** odmah uklanja predmemorirane odgovore. |
| **Ograničenje Brzine** | Maksimalni zahtjevi po vremenskom okviru. Promjene se spremaju u workflow. |
| **SSE Streaming** | Prebacuje naredbu na `/execute/stream`, dodaje `--no-buffer` i izlaže postavke poruka `node_start` po čvoru. |
| **Tijelo** | JSON tijelo zahtjeva. U Defined načinu je automatski popunjeno iz [Input](../nodes/input-node.md) polja i zadržava prazne ključeve. U Generic načinu je to uređivač sirovog JSON-a. |
| **Naredba** | Samo za čitanje pregled pune cURL naredbe. |

Kliknite **Copy cURL** za kopiranje naredbe u međuspremnik.

### Primjer

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

U Generic načinu, ugniježđeni payload-i ostaju netaknuti, na primjer:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dijalog odražava postavke autentifikacije, načina tijela, predmemoriranja i ograničenja brzine pohranjenih na workflow-u — uređivanje ovdje odmah ažurira workflow.

### SSE Streaming u Dijalog

Omogućite **SSE Streaming** kada želite da generirana naredba prati izvršavanje u stvarnom vremenu iz Vašeg terminala.

- Endpoint se mijenja iz `/execute` u `/execute/stream`
- Naredba dodaje `--no-buffer` i `Accept: text/event-stream`
- Svaki ne-sticky čvor pojavljuje se na popisu gdje možete:
  - omogućiti ili onemogućiti poruku `node_start`
  - prilagoditi tekst početne poruke
- `node_complete` događaji se uvijek emitiraju i uključuju puni izlaz čvora

Primjer:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Za potpuni protokol događaja i primjere, pogledajte [SSE Streaming](./sse-streaming.md).

## Oznaka Izvora Okidača

Svako izvršavanje pohranjuje oznaku `trigger_source` vidljivu u [Povijesti Izvršavanja](./execution-history.md). Postavite je slanjem zaglavlja `X-Trigger-Source` s bilo kojom vrijednošću koju odaberete:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Gumb **Copy cURL** u dijalogu uređivača automatski uključuje `X-Trigger-Source: API`. Možete zamijeniti `API` s bilo čim značajnim — `scheduler`, `rabbitmq`, `github-actions`, itd.

Ako zaglavlje nije poslano, `trigger_source` prema zadanim postavkama postavlja se na `"API"` i pokretanje je označeno kao **API** u povijesti. Prepišite ga s bilo kojom vrijednošću koja je značajna za Vaš sustav — `scheduler`, `github-actions`, `rabbitmq`, itd.

## Povezano

- [Execution Tokens](./execution-tokens.md) – Scoped JWT-ovi za pozivanje workflow-a iz vanjskih sustava
- [SSE Streaming](./sse-streaming.md) – Stream događaja čvora u stvarnom vremenu putem Server-Sent Events
- [Triggers](./triggers.md) – Svi ulazni točke workflow-a uključujući webhook
- [Workflow Structure](./workflow-structure.md) – Čvorovi i rubovi
- [Expression DSL](./expression-dsl.md) – Pristup `$input.body`, `$input.headers`, `$input.query`
