# Webhookid

Workflow'sid saab käivitada HTTP webhookide kaudu. Standardne execute endpoint tagastab JSON-i ja streaming-variant tagastab Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Asendage `{workflow_id}` workflow UUID-ga. Baas-URL on Teie Heymi instants (nt `https://app.heym.ai`).

## Päringu meetod

Iga workflow aktsepteerib ühte HTTP-verbi, mis valitakse redaktori cURL-dialoogis: `GET`, `POST`, `PUT` või `DELETE`. **`POST` on vaikeväärtus** ja iga workflow, mis loodi enne selle seade olemasolu, säilitab selle, seega miski, mis täna töötab, ei muutu.

Workflow kutsumine erineva verbiga tagastab `405 Method Not Allowed` koos `Allow` päisega, mis nimetab konfigureeritud verbi:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Üks erand: päringud, mis sisaldavad `?test_run=true`, jätavad kontrolli vahele. Seda saadab redaktori **Run** nupp ja debug-paneel, seega `GET`-ile seatud workflow jääb toote sees testitavaks.

### Kehata meetodid

`GET` ja `DELETE` ei sisalda päringu keha. Sisendid tulevad query-stringist ja neid loetakse `$input.query.<name>` kaudu:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL-dialoog peidab nende kahe meetodi puhul päringu keha redaktori ja eemaldab `Content-Type` päise.

Siduge `GET` [HTML output mapperiga](../nodes/html-output-mapper-node.md), et serveerida lehte, mille brauser saab otse avada.

## Streaming endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Kasutage streaming-endpointi, kui soovite üksiku JSON-vastuse asemel järkjärgulisi käivitussündmusi. Vaadake [SSE Streaming](./sse-streaming.md), et tutvuda sündmuste protokolli ja iga sõlme algussõnumi konfiguratsiooniga.

## Päringu formaat

Päringu keha edastatakse `body`-na [Input](../nodes/input-node.md) sõlmedele. Heym aktsepteerib mõlemat päringu kuju:

- **Toores JSON** – nt `{"userId": "123", "action": "create"}`
- **Mähitud formaat** – `{"inputs": {...}, "test_run": false}`

Mähitud formaadi kasutamisel eraldatakse `inputs` ja edastatakse `body`-na. `test_run` möödub rate limitingust ja vastuse vahemällu salvestamisest. Toore JSON-i postitamisel võite saata ka `?test_run=true` query-parameetrina.

## Päringu keha režiimid

Igal workflow'l on `webhook_body_mode` seade, mis kontrollib, kuidas redaktor näidispäringuid koostab:

| Režiim | Käitumine |
|------|----------|
| **defined** | Redaktor ja cURL-dialoog kujundavad näidiskeha workflow Input sõlme väljadest ja säilitavad tühjad võtmed JSON payloadis. Olemasolevad defined-stiilis cURL payloadid töötavad edasi. |
| **generic** | Redaktor ja cURL-dialoog kasutavad vaba vormiga JSON-keha. Päringu keha edastatakse muutmata kujul, et välised rakendused saaksid saata oma fikseeritud payloadi kuju. |

Käivituse API jääb mõlemas režiimis tagasiühilduvaks. Toores JSON ja mähitud `{ "inputs": ... }` päringud on endiselt mõlemal viisil aktsepteeritud.

Päised ja query-parameetrid on avaldistes saadaval kui `$input.headers` ja `$input.query`. Päise võtmed on väiketähtedeks teisendatud.

## Autentimine

Konfigureeritakse iga workflow jaoks redaktoris (workflow seaded). Autentimist kontrollitakse enne käivitamist.

| auth_type | Käitumine |
|-----------|----------|
| **anonymous** | Autentimist ei nõuta. Igaüks saab endpointi kutsuda. |
| **jwt** | Bearer token on nõutud. Aktsepteerib kas kasutaja sessiooni tokenit (kasutajal peab olema workflow'le juurdepääs) või selle workflow jaoks loodud skoobitud [Execution Tokenit](./execution-tokens.md). |
| **header_auth** | Kohandatud päis peab ühtima. Määrake `auth_header_key` (nt `X-API-Key`) ja `auth_header_value`. |

`header_auth` puhul peab päringu päise väärtus täpselt ühtima konfigureeritud väärtusega. JWT-kasutajad, kellel on workflow'le juurdepääs, saavad samuti kutsuda ilma kohandatud päiseta.

`jwt` puhul on [Execution Tokenid](./execution-tokens.md) soovitatav viis workflow'de kutsumiseks välistest süsteemidest — need on skoobitud üksikule workflow'le ja neid saab iseseisvalt tühistada.

## Vastuse vahemällu salvestamine

Konfigureerige `cache_ttl_seconds` iga workflow jaoks. Kui see on seatud ja suurem kui 0:

- **Vahemälu võti**: `workflow_id` + `body` + `query` SHA256 räsi
- **Vahemälu tabamus**: Tagastab koheselt staatusega `status: "cached"` ja vahemällu salvestatud väljunditega
- **Vahemälu seadmine**: Ainult pärast edukat käivitust (`status: "success"`)
- **Salvestus**: Postgres-põhine ja jagatud backend-töötajate vahel

| Seade | Mõju |
|---------|--------|
| `cache_ttl_seconds` = 0 või null | Vahemällu salvestamine on keelatud |
| `cache_ttl_seconds` > 0 | Vastused salvestatakse vahemällu selle arvu sekundite jooksul |

`test_run` päringud mööduvad vahemälust (ei lugemist, ei kirjutamist).

Kui vastuse vahemällu salvestamine on cURL-dialoogis lubatud, eemaldab **Clear cache** koheselt praeguse workflow vahemällu salvestatud vastused.

## Rate limiting

Konfigureerige iga workflow jaoks: `rate_limit_requests` ja `rate_limit_window_seconds`.

- **Ulatus**: Iga `workflow_id` + kliendi IP kohta (libisev aken)
- **Ületatud**: HTTP 429 koos `Retry-After` päisega
- **Päised**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Seade | Kirjeldus |
|---------|-------------|
| `rate_limit_requests` | Maksimaalne lubatud päringute arv aknas |
| `rate_limit_window_seconds` | Akna kestus sekundites |

`test_run` päringud mööduvad rate limitingust.
## Vastuse formaat

Endpoint tagastab JSON-i:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Väli | Kirjeldus |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` või `rate_limited` |
| `outputs` | Terminalse sõlme väljundid. Kui ainsaks terminaliks on üks [JSON output mapper](../nodes/json-output-mapper-node.md), on vastuse kehaks see mapitud objekt ülemisel tasemel (vaikimisi lihtsad JSON-vastused). Vastasel juhul sisaldab [Output](../nodes/output-node.md) ja teisi terminale, mis on tähistatud sildiga. |
| `execution_time_ms` | Käivituse aeg millisekundites (0 cached/rate_limited puhul) |

Vea korral võib `outputs` sisaldada vea üksikasju. [Throw Error](../nodes/throw-error-node.md) sõlm saab määrata kohandatud HTTP olekukoodi (4xx/5xx).

## Dialoog "Run with cURL"

Tööriistariba nupp **Run with cURL** (redaktori ülanurgas, `cURL` ikoon) avab dialoogi, mis koostab ja kopeerib valmis cURL-käsu praeguse workflow jaoks.

### Mida see teeb

| Väli | Kirjeldus |
|-------|-------------|
| **Request Body Mode** | Valige **Defined** või **Generic**. Generic hoiab keha töötlemata JSON-ina, selle asemel et seda Input väljadest kujundada. |
| **Authentication** | Valige Anonymous, JWT Token või Header Auth. Määrab käsu jaoks õige autentimispäise. Kui on valitud JWT Token, kuvab dialoog [Execution Token](./execution-tokens.md) haldurit — looge või valige token, et see otse käsusse lisada. |
| **Header Key / Value** | Kuvatakse, kui on valitud Header Auth. Eeltäidetud workflow autentimisseadetest. |
| **Response Cache** | Minutid identsete vastuste vahemällu salvestamiseks (0 = keelatud). Muudatused salvestatakse workflow'sse. Kui see on lubatud, eemaldab **Clear cache** vahemällu salvestatud vastused kohe. |
| **Rate Limit** | Maksimaalne päringute arv ajaakna kohta. Muudatused salvestatakse workflow'sse. |
| **SSE Streaming** | Lülitab käsu ümber `/execute/stream`-ile, lisab `--no-buffer` ja võimaldab sõlmede kaupa `node_start` sõnumi seadeid. |
| **Body** | JSON-päringu keha. Defined režiimis on see eeltäidetud [Input](../nodes/input-node.md) väljadest ja säilitab tühjad võtmed. Generic režiimis on see töötlemata JSON-redaktor. |
| **Command** | Täieliku cURL-käsu kirjutuskaitstud eelvaade. |

Klõpsake **Copy cURL**, et käsk lõikelauale kopeerida.

### Näide

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic režiimis jäävad pesastatud payloadid puutumata, näiteks:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialoog peegeldab workflow'sse salvestatud autentimise, keha režiimi, vahemällu salvestamise ja rate-limit seadeid — nende muutmine siin uuendab workflow'd kohe.

### SSE Streaming dialoogis

Lubage **SSE Streaming**, kui soovite, et loodud käsk jälgiks käivitust terminalist reaalajas.

- Endpoint muutub `/execute`-lt `/execute/stream`-ile
- Käsk lisab `--no-buffer` ja `Accept: text/event-stream`
- Iga mitte-püsiv sõlm kuvatakse loendis, kus saate:
  - lubada või keelata `node_start` sõnumi
  - kohandada algussõnumi teksti
- `node_complete` sündmused emiteeritakse alati ja sisaldavad täielikku sõlme väljundit

Näide:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Täieliku sündmuste protokolli ja näidete kohta vaadake [SSE Streaming](./sse-streaming.md).

## Triggeri allika märgistamine

Iga käivitus salvestab `trigger_source` sildi, mis on nähtav jaotises [Execution History](./execution-history.md). Määrake see, saates `X-Trigger-Source` päise mis tahes soovitud väärtusega:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Redaktori dialoogis olev nupp **Copy cURL** sisaldab automaatselt `X-Trigger-Source: API`. Võite asendada `API` millegi tähenduslikuga — `scheduler`, `rabbitmq`, `github-actions` jne.

Kui päist ei saadeta, on `trigger_source` vaikimisi `"API"` ja käivitus märgistatakse ajaloos tähisega **API**. Alistage see mis tahes teie süsteemi jaoks tähendusliku väärtusega — `scheduler`, `github-actions`, `rabbitmq` jne.

## Seotud

- [Execution Tokens](./execution-tokens.md) – Skopeeritud JWT-d workflow'de kutsumiseks välistest süsteemidest
- [SSE Streaming](./sse-streaming.md) – Sõlme sündmuste voogedastus reaalajas Server-Sent Events kaudu
- [Triggers](./triggers.md) – Kõik workflow sisendpunktid, sealhulgas webhook
- [Workflow Structure](./workflow-structure.md) – Sõlmed ja servad
- [Expression DSL](./expression-dsl.md) – Juurdepääs `$input.body`, `$input.headers`, `$input.query`
