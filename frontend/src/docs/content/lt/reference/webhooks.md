# Webhook'ai

Workflow'ai gali būti inicijuojami per HTTP webhook'us. Standartinis vykdymo endpoint'as grąžina JSON, o srautinė versija grąžina Server-Sent Events (SSE).

## Endpoint'as

`POST /api/workflows/{workflow_id}/execute`

Pakeiskite `{workflow_id}` su workflow UUID. Pagrindinis URL yra Jūsų Heym instancija (pvz., `https://app.heym.ai`).

## Užklausos metodas

Kiekvienas workflow priima vieną HTTP veiksmą, pasirenkamą redaktoriaus cURL dialoge: `GET`, `POST`, `PUT` arba `DELETE`. **`POST` yra numatytasis**, ir kiekvienas workflow, sukurtas prieš šio nustatymo atsiradimą, jį išlaiko, todėl niekas, kas veikia šiandien, nesikeičia.

Kviečiant workflow su kitu veiksmu grąžinamas `405 Method Not Allowed` su `Allow` antrašte, nurodančia sukonfigūruotą:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Vienas išimtinumas: užklausos, turinčios `?test_run=true`, praleidžia patikrinimą. Tai yra tai, ką redaktoriaus **Vykdyti** mygtukas ir derinimo panelė siunčia, todėl workflow, nustatytas `GET`, išlieka testuojamas iš produkto viduje.

### Be kūno metodai

`GET` ir `DELETE` neturi užklausos kūno. Įvestys gaunamos iš užklausos eilutės, o jos skaitomos su `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL dialogas slepia užklausos kūno redaktorių ir pašalina `Content-Type` antraštę šiems dviem metodams.

Poruokite `GET` su [HTML output mapper](../nodes/html-output-mapper-node.md), kad pateiktumėte puslapį, kurį naršyklė gali atidaryti tiesiogiai.

## Srautinio endpoint'o

`POST /api/workflows/{workflow_id}/execute/stream`

Naudokite srautinį endpoint'ą, kai norite gauti inkrementinius vykdymo įvykius vietoj vieno JSON atsakymo. Daugiau informacijos apie [SSE Streaming](./sse-streaming.md) įvykių protokolą ir kiekvieno mazgo pradžios žinutės konfigūraciją.

## Užklausos formatas

Užklausos kūnas perduodamas kaip `body` [Input](../nodes/input-node.md) mazgams. Heym priima abu užklausos formatus:

- **Žalias JSON** – pvz., `{"userId": "123", "action": "create"}`
- **Apvyniota forma** – `{"inputs": {...}, "test_run": false}`

Naudojant apvyniotą formatą, `inputs` yra išskiriamas ir perduodamas kaip `body`. `test_run` apeina greičio ribojimą ir atsakymų talpinimą. Taip pat galite siųsti `?test_run=true` kaip užklausos parametrą, kai siunčiate žalią JSON.

## Užklausos kūno režimai

Kiekvienas workflow turi `webhook_body_mode` nustatymą, kuris kontroliuoja, kaip redaktorius kuria pavyzdines užklausas:

| Režimas | Elgsena |
|---------|---------|
| **defined** | Redaktorius ir cURL dialogas formuoja pavyzdinį kūną iš workflow Input mazgo laukų ir išlaiko tuščius raktus JSON payload'e. Esami defined stiliaus cURL payload'ai veikia toliau. |
| **generic** | Redaktorius ir cURL dialogas naudoja laisvos formos JSON kūną. Užklausos kūnas perduodamas toks, koks yra, kad išorinės programos galėtų siųsti savo fiksuotą payload formą. |

Vykdymo API išlieka atgal suderinama abiejuose režimuose. Žalias JSON ir apvynioti `{ "inputs": ... }` užklausos vis dar priimamos bet kuriuo atveju.

Antraštės ir užklausos parametrai yra prieinami išraiškose kaip `$input.headers` ir `$input.query`. Antraščių raktai yra mažosiomis raidėmis.

## Autentifikacija

Konfigūruokite kiekvienam workflow redaktoriuje (workflow nustatymai). Autentifikacija tikrinama prieš vykdymą.

| auth_type | Elgsena |
|-----------|---------|
| **anonymous** | Nereikia autentifikacijos. Bet kas gali kviesti endpoint'ą. |
| **jwt** | Reikalingas Bearer token. Priimami arba vartotojo sesijos token (vartotojas turi turėti prieigą prie workflow), arba apibrėžtas [Execution Token](./execution-tokens.md), sukurtas šiam workflow. |
| **header_auth** | Pasirinktinė antraštė turi atitikti. Nustatykite `auth_header_key` (pvz., `X-API-Key`) ir `auth_header_value`. |

Dėl `header_auth` užklausos antraštės vertė turi tiksliai atitikti sukonfigūruotą vertę. JWT vartotojai, turintys prieigą prie workflow, taip pat gali kviesti be pasirinktinių antraščių.

Dėl `jwt`, [Execution Tokens](./execution-tokens.md) yra rekomenduojamas būdas kviesti workflow iš išorinių sistemų — jie yra apibrėžti vienam workflow ir gali būti atšaukti nepriklausomai.

## Atsakymų talpinimas

Konfigūruokite `cache_ttl_seconds` kiekvienam workflow. Kai nustatyta ir didesnė už 0:

- **Talpos raktas**: SHA256 hash iš `workflow_id` + `body` + `query`
- **Talpos pataikymas**: Grąžina iš karto su `status: "cached"` ir talpinamais išėjimais
- **Talpos nustatymas**: Tik po sėkmingo vykdymo (`status: "success"`)
- **Saugojimas**: Postgres pagrindu ir bendrinamas tarp backend darbuotojų

| Nustatymas | Efektas |
|------------|---------|
| `cache_ttl_seconds` = 0 arba null | Talpinimas išjungtas |
| `cache_ttl_seconds` > 0 | Atsakymai talpinami tiek sekundžių |

`test_run` užklausos apeina talpinimą (nėra skaitymo, nėra rašymo).

Kai atsakymų talpinimas yra įjungtas cURL dialoge, **Išvalyti talpą** iš karto pašalina dabartinio workflow talpinamus atsakymus.

## Greičio ribojimas

Konfigūruokite kiekvienam workflow: `rate_limit_requests` ir `rate_limit_window_seconds`.

- **Apimtis**: Pagal `workflow_id` + kliento IP (slankusis langas)
- **Viršyta**: HTTP 429 su `Retry-After` antrašte
- **Antraštės**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Nustatymas | Aprašymas |
|------------|-----------|
| `rate_limit_requests` | Maksimalus užklausų skaičius langelyje |
| `rate_limit_window_seconds` | Langelio trukmė sekundėmis |

`test_run` užklausos apeina greičio ribojimą.
<a id="concurrency-limit-and-queued-runs"></a>

## Lygiagretumo apribojimas ir eilėje laukiantys vykdymai

Workflow gali apriboti, kiek gamybinių vykdymų atliekama vienu metu. Įjunkite **Lygiagretumo apribojimas** workflow lygio skydelyje **Properties** ir nustatykite **Maks. lygiagrečių vykdymų**. Savininkai ir bendradarbiai, turintys redagavimo prieigą, gali tai keisti. Pagal numatytuosius nustatymus apribojimas yra išjungtas.

Pasiekus ribą, nauji vykdymai laukia FIFO (pirmas įeina, pirmas išeina) eilėje. Tai apima kiekvieną gamybinį įėjimo tašką: šį endpoint'ą, [srautinio perdavimo endpoint'ą](./sse-streaming.md), [Portalą](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) ir kiekvieną [triggerį](./triggers.md). Paties redaktoriaus bandomieji vykdymai visada prasideda nedelsiant ir neužima vietos. Parametro `test_run=true` siuntimas be prisijungusios sesijos, galinčios atidaryti workflow, neapeina eilės.

| Nustatymas | Aprašymas |
|---|---|
| `concurrency_limit` | Vienu metu leidžiami gamybiniai vykdymai. `0` išjungia apribojimą |
| `concurrency_max_queue` | Neprivaloma. Vienu metu eilėje leidžiamų vykdymų skaičius. Tuščia reiškia be apribojimų |
| `concurrency_max_wait_seconds` | Neprivaloma. Vykdymas, laukiantis ilgiau, registruojamas kaip `expired`. Tuščia reiškia neribotą laukimą |

### 202 Accepted

Iškart prasidedantis iškvietimas elgiasi tiksliai taip, kaip aprašyta skyriuje Atsakymo Formatavimas. Iškvietimas, kuriam tenka laukti, nedelsiant gauna `202 Accepted`, nepriklausomai nuo antraštės `X-Simple-Response`, su antrašte `Location`, rodančia į jo būsenos URL:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Laukas | Aprašymas |
|---|---|
| `queue.position` | Šio vykdymo vieta eilėje, pradedant nuo 1 |
| `queue.size` | Šiuo metu eilėje laukiantys vykdymai |
| `queue.running` | Šiuo metu vietą užimantys vykdymai |
| `queue.limit` | Darbo eigos lygiagretumo apribojimas |
| `status_token` | Tik anoniminėms workflow. Grąžinama tik vieną kartą šiame atsakyme |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` atsako su vykdymo būsena. Iškvieskite jį su tais pačiais kredencialais, kuriais pradėtas vykdymas: sesija arba JWT, [vykdymo tokenu](./execution-tokens.md) arba individualia workflow antrašte. Anoniminis workflow neturi tikrintinų kredencialų, todėl atsakyme 202 gautą `status_token` siųskite antraštėje `X-Heym-Run-Token`. Tokenas niekada neskaitomas iš užklausos eilutės. Klaidingas arba trūkstamas tokenas gauna `404`, kaip ir nežinomas vykdymas.

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

| `status` | Reikšmė (vykdymas, kuriam tenka laukti lygiagretumo vietos, vietoj to gauna [202 atsakymą](#202-accepted)) |
|---|---|
| `queued` | Laukia laisvos vietos; `queue` rodo poziciją |
| `running` | Turi vietą ir yra vykdomas |
| `success` / `error` | Užbaigtas; laukai `outputs` ir `error` užpildyti |
| `pending` | Pristabdytas [žmogaus peržiūrai](./human-in-the-loop.md) |
| `cancelled` | Atšauktas iš [Vykdymo istorijos](./execution-history.md) |
| `expired` | Laukė ilgiau nei `concurrency_max_wait_seconds` ir niekada nebuvo įvykdytas |

Siųskite užklausą kas kelias sekundes, kol būsena nebėra `queued` arba `running`. Į eilę įtrauktas vykdymas įvykdomas net jei niekas jo būsenos netikrina.

### Eilė pilna

Kai nustatytas `concurrency_max_queue` ir tiek vykdymų jau laukia, iškvietimas atmetamas su klaida `429 Concurrency queue is full` ir įrašu `queue_full` vykdymo istorijoje. Nieko į eilę neįtraukiama.

## Atsakymo Formatavimas

Endpointas grąžina JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Laukas | Aprašymas |
|--------|-----------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` arba `rate_limited` |
| `outputs` | Terminal node išvestys. Jei vienintelis terminalas yra [JSON output mapper](../nodes/json-output-mapper-node.md), atsakymo kūnas yra tas suformuotas objektas aukščiausiame lygyje (numatytosios paprastos JSON išvestys). Priešingu atveju apima [Output](../nodes/output-node.md) ir kitus terminalus, kurių raktai yra etiketės. |
| `execution_time_ms` | Vykdymo laikas milisekundėmis (0, jei cached/rate_limited) |

Klaidos atveju `outputs` gali turėti klaidų detales. [Throw Error](../nodes/throw-error-node.md) mazgas gali nustatyti pasirinktą HTTP statuso kodą (4xx/5xx).

## Vykdyti su cURL Dialogu

**Vykdyti su cURL** įrankių juostos mygtukas (viršutiniame dešiniajame redaktoriaus kampe, `cURL` ikona) atidaro dialogą, kuris sukuria ir kopijuoja paruoštą vykdyti cURL komandą dabartiniam workflow.

### Ką tai daro

| Laukas | Aprašymas |
|--------|-----------|
| **Request Body Mode** | Pasirinkite **Defined** arba **Generic**. Generic išlaiko kūną kaip žalią JSON, o ne formuoja jį iš Įvesties laukų. |
| **Authentication** | Pasirinkite Anonymous, JWT Token arba Header Auth. Nustato teisingą auth antraštę komandoje. Pasirinkus JWT Token, dialoge rodomas [Execution Token](./execution-tokens.md) valdymo įrankis — sukurkite arba pasirinkite tokeną, kad jį tiesiogiai įterptumėte į komandą. |
| **Header Key / Value** | Matomas, kai pasirinkta Header Auth. Iš anksto užpildytas iš workflow auth nustatymų. |
| **Response Cache** | Minutės, per kurias saugomos identiškos atsakymų kopijos (0 = išjungta). Pakeitimai išsaugomi workflow. Kai įjungta, **Clear cache** iš karto pašalina saugomas atsakymų kopijas. |
| **Rate Limit** | Maksimalus užklausų skaičius per laiko intervalą. Pakeitimai išsaugomi workflow. |
| **SSE Streaming** | Pakeičia komandą į `/execute/stream`, prideda `--no-buffer` ir atskleidžia kiekvieno mazgo `node_start` pranešimų nustatymus. |
| **Body** | JSON užklausos kūnas. Defined režimu jis iš anksto užpildomas iš [Input](../nodes/input-node.md) laukų ir išlaiko tuščius raktus. Generic režimu tai yra žalių JSON redaktorius. |
| **Command** | Tik skaitymo peržiūra visos cURL komandos. |

Paspauskite **Copy cURL**, kad nukopijuotumėte komandą į iškarpinę.

### Pavyzdys

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic režimu, įdėtiniai payload išlieka nepakitę, pavyzdžiui:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialogas atspindi autentifikacijos, kūno režimo, talpyklos ir greičio ribojimo nustatymus, saugomus workflow — redaguojant juos čia, workflow atnaujinamas iš karto.

### SSE Streaming dialoge

Įjunkite **SSE Streaming**, kai norite, kad sugeneruota komanda stebėtų vykdymą realiu laiku iš jūsų terminalo.

- Endpointas keičiasi iš `/execute` į `/execute/stream`
- Komanda prideda `--no-buffer` ir `Accept: text/event-stream`
- Kiekvienas nestabilus mazgas pasirodo sąraše, kuriame galite:
  - įjungti arba išjungti `node_start` pranešimą
  - pritaikyti pranešimo pradžios tekstą
- `node_complete` įvykiai visada išmetami ir apima visą mazgo išvestį

Pavyzdys:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Dėl išsamaus įvykio protokolo ir pavyzdžių žr. [SSE Streaming](./sse-streaming.md).

## Trigger Source Tagging

Kiekvienas vykdymas saugo `trigger_source` etiketę, matomą [Execution History](./execution-history.md). Nustatykite ją, siųsdami `X-Trigger-Source` antraštę su bet kokia pasirinkta verte:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

**Copy cURL** mygtukas redaktoriaus dialoge automatiškai apima `X-Trigger-Source: API`. Galite pakeisti `API` į bet ką prasmingo — `scheduler`, `rabbitmq`, `github-actions` ir kt.

Jei antraštė nėra siunčiama, `trigger_source` numatytai yra `"API"` ir vykdymas žymimas kaip **API** istorijoje. Pakeiskite ją bet kokia prasminga jūsų sistemai verte — `scheduler`, `github-actions`, `rabbitmq` ir kt.

## Susiję

- [Execution Tokens](./execution-tokens.md) – Apriboti JWT, skirti workflow iškvietimams iš išorinių sistemų
- [SSE Streaming](./sse-streaming.md) – Srauto mazgų įvykiai realiu laiku per Server-Sent Events
- [Triggers](./triggers.md) – Visi workflow įėjimo taškai, įskaitant webhook
- [Workflow Structure](./workflow-structure.md) – Mazgai ir kraštai
- [Expression DSL](./expression-dsl.md) – Prieiga prie `$input.body`, `$input.headers`, `$input.query`
