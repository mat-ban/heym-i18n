# Webhooks

Workflow var palaist, izmantojot HTTP webhook. Standarta izpildes endpoint atgriež JSON, bet straumēšanas variants atgriež Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Aizstājiet `{workflow_id}` ar workflow UUID. Bāzes URL ir Jūsu Heym instancē (piem., `https://app.heym.ai`).

## Pieprasījuma metode

Katrs workflow pieņem vienu HTTP verbu, kas tiek izvēlēts redaktora cURL dialogā: `GET`, `POST`, `PUT` vai `DELETE`. **`POST` ir noklusējuma vērtība**, un katrs workflow, kas izveidots pirms šī iestatījuma pastāvēšanas, to saglabā, tāpēc nekas, kas šobrīd darbojas, nemainās.

Ja workflow tiek izsaukts ar citu verbu, tiek atgriezts `405 Method Not Allowed` ar `Allow` header, kurā norādīts konfigurētais verbs:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Viens izņēmums: pieprasījumi ar `?test_run=true` izlaiž pārbaudi. To nosūta redaktora poga **Run** un atkļūdošanas panelis, tāpēc workflow, kas iestatīts uz `GET`, joprojām ir testējams produkta ietvaros.

### Metodes bez request body

`GET` un `DELETE` nepārnes request body. Ievades tiek iegūtas no query string un tiek nolasītas ar `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL dialogs šīm divām metodēm paslēpj request-body redaktoru un noņem `Content-Type` header.

Savienojiet `GET` ar [HTML output mapper](../nodes/html-output-mapper-node.md), lai nodrošinātu lapu, ko pārlūks var atvērt tieši.

## Straumēšanas endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Izmantojiet straumēšanas endpoint, ja vēlaties pakāpeniskus izpildes notikumus, nevis vienu JSON atbildi. Skatiet [SSE Streaming](./sse-streaming.md) par notikumu protokolu un katra mezgla sākuma ziņojuma konfigurāciju.

## Pieprasījuma formāts

Request body tiek nodots kā `body` uz [Input](../nodes/input-node.md) mezgliem. Heym pieņem abas pieprasījuma formas:

- **Raw JSON** – piem., `{"userId": "123", "action": "create"}`
- **Ietīts formāts** – `{"inputs": {...}, "test_run": false}`

Izmantojot ietīto formātu, `inputs` tiek izvilkts un nodots kā `body`. `test_run` apiet rate limiting un atbilžu kešošanu. Varat arī nosūtīt `?test_run=true` kā query parametru, sūtot raw JSON.

## Request Body režīmi

Katram workflow ir `webhook_body_mode` iestatījums, kas kontrolē, kā redaktors veido parauga pieprasījumus:

| Režīms | Darbība |
|------|----------|
| **defined** | Redaktors un cURL dialogs veido piemēra body no workflow Input mezgla laukiem un saglabā tukšas atslēgas JSON payload. Esošie defined-stila cURL payload turpina darboties. |
| **generic** | Redaktors un cURL dialogs izmanto brīvas formas JSON body. Request body tiek nodots tāds, kāds tas ir, lai ārējās lietotnes varētu nosūtīt savu fiksēto payload formu. |

Izpildes API abos režīmos saglabā atpakaļsaderību. Raw JSON un ietītie `{ "inputs": ... }` pieprasījumi joprojām tiek pieņemti abos gadījumos.

Headers un query params ir pieejami izteiksmēs kā `$input.headers` un `$input.query`. Header atslēgas tiek pārveidotas uz mazajiem burtiem.

## Autentifikācija

Tiek konfigurēta katram workflow redaktorā (workflow iestatījumi). Autentifikācija tiek pārbaudīta pirms izpildes.

| auth_type | Darbība |
|-----------|----------|
| **anonymous** | Autentifikācija nav nepieciešama. Jebkurš var izsaukt endpoint. |
| **jwt** | Nepieciešams Bearer token. Pieņem gan lietotāja sesijas token (lietotājam ir jābūt workflow piekļuvei), gan šim workflow izveidotu ierobežotas piekļuves [Execution Token](./execution-tokens.md). |
| **header_auth** | Pielāgotam header ir jāsakrīt. Iestatiet `auth_header_key` (piem., `X-API-Key`) un `auth_header_value`. |

Attiecībā uz `header_auth` pieprasījuma header vērtībai ir precīzi jāatbilst konfigurētajai vērtībai. JWT lietotāji ar workflow piekļuvi var arī izsaukt bez pielāgotā header.

Attiecībā uz `jwt` [Execution Tokens](./execution-tokens.md) ir ieteicamais veids, kā izsaukt workflow no ārējām sistēmām — tie ir ierobežoti ar vienu workflow un tos var neatkarīgi atsaukt.

## Atbilžu kešošana

Konfigurējiet `cache_ttl_seconds` katram workflow. Ja tas ir iestatīts un lielāks par 0:

- **Kešatslēga**: `workflow_id` + `body` + `query` SHA256 hash
- **Keša trāpījums**: Nekavējoties atgriež ar `status: "cached"` un kešotajiem izvadiem
- **Keša ierakstīšana**: Tikai pēc veiksmīgas izpildes (`status: "success"`)
- **Glabāšana**: Postgres-backed un koplietota starp backend workers

| Iestatījums | Ietekme |
|---------|--------|
| `cache_ttl_seconds` = 0 vai null | Kešošana atspējota |
| `cache_ttl_seconds` > 0 | Atbildes tiek kešotas šo sekunžu skaitu |

`test_run` pieprasījumi apiet kešu (nav nolasīšanas, nav rakstīšanas).

Kad atbilžu kešošana ir iespējota cURL dialogā, **Clear cache** nekavējoties iztīra pašreizējā workflow kešotās atbildes.

## Rate Limiting

Konfigurējiet katram workflow: `rate_limit_requests` un `rate_limit_window_seconds`.

- **Tvērums**: Uz `workflow_id` + klienta IP (slīdošs logs)
- **Pārsniegts**: HTTP 429 ar `Retry-After` header
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Iestatījums | Apraksts |
|---------|-------------|
| `rate_limit_requests` | Maksimālais atļauto pieprasījumu skaits logā |
| `rate_limit_window_seconds` | Loga ilgums sekundēs |

`test_run` pieprasījumi apiet rate limiting.
## Atbildes formāts

Endpoint atgriež JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Lauks | Apraksts |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` vai `rate_limited` |
| `outputs` | Terminālo mezglu izvades. Ja vienīgais terminālais mezgls ir viens [JSON output mapper](../nodes/json-output-mapper-node.md), atbildes pamatteksts ir šis kartētais objekts augšējā līmenī (noklusējuma vienkāršās JSON atbildes). Pretējā gadījumā ietver [Output](../nodes/output-node.md) un citus terminālos mezglus, kas atslēgoti pēc label. |
| `execution_time_ms` | Izpildes laiks milisekundēs (0 kešatmiņā saglabātām/rate_limited) |

Kļūdas gadījumā `outputs` var saturēt kļūdas detaļas. [Throw Error](../nodes/throw-error-node.md) mezgls var iestatīt pielāgotu HTTP statusa kodu (4xx/5xx).

## Dialogs "Run with cURL"

Rīkjoslas poga **Run with cURL** (redaktora augšējā labajā stūrī, `cURL` ikona) atver dialogu, kas izveido un nokopē gatavu cURL komandu pašreizējam workflow.

### Ko tas dara

| Lauks | Apraksts |
|-------|-------------|
| **Request Body Mode** | Izvēlieties **Defined** vai **Generic**. Generic saglabā pamattekstu kā neapstrādātu JSON, nevis veido to no Input laukiem. |
| **Authentication** | Izvēlieties Anonymous, JWT Token vai Header Auth. Iestata pareizo autentifikācijas header komandā. Kad ir izvēlēts JWT Token, dialogs parāda [Execution Token](./execution-tokens.md) pārvaldnieku — izveidojiet vai izvēlieties token, lai to tieši iegultu komandā. |
| **Header Key / Value** | Redzams, kad ir izvēlēts Header Auth. Iepriekš aizpildīts no workflow autentifikācijas iestatījumiem. |
| **Response Cache** | Minūtes, cik ilgi kešot identiskas atbildes (0 = atspējots). Izmaiņas tiek saglabātas workflow. Kad iespējots, **Clear cache** nekavējoties iztīra kešotās atbildes. |
| **Rate Limit** | Maksimālais pieprasījumu skaits laika logā. Izmaiņas tiek saglabātas workflow. |
| **SSE Streaming** | Pārslēdz komandu uz `/execute/stream`, pievieno `--no-buffer` un atklāj katra mezgla `node_start` ziņojuma iestatījumus. |
| **Body** | JSON pieprasījuma pamatteksts. Defined režīmā tas ir iepriekš aizpildīts no [Input](../nodes/input-node.md) laukiem un saglabā tukšas atslēgas. Generic režīmā tas ir neapstrādāta JSON redaktors. |
| **Command** | Tikai lasāms pilnās cURL komandas priekšskatījums. |

Noklikšķiniet uz **Copy cURL**, lai nokopētu komandu starpliktuvē.

### Piemērs

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic režīmā ligzdotie payload paliek neskarti, piemēram:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialogs atspoguļo autentifikācijas, pamatteksta režīma, kešošanas un rate-limit iestatījumus, kas saglabāti workflow — to rediģēšana šeit nekavējoties atjaunina workflow.

### SSE Streaming dialogā

Iespējojiet **SSE Streaming**, ja vēlaties, lai ģenerētā komanda sekotu izpildei reāllaikā no jūsu termināļa.

- Endpoint mainās no `/execute` uz `/execute/stream`
- Komanda pievieno `--no-buffer` un `Accept: text/event-stream`
- Katrs mezgls, kas nav sticky, parādās sarakstā, kur varat:
  - iespējot vai atspējot `node_start` ziņojumu
  - pielāgot sākuma ziņojuma tekstu
- `node_complete` notikumi vienmēr tiek emitēti un ietver pilnu mezgla izvadi

Piemērs:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Pilnu notikumu protokolu un piemērus skatiet sadaļā [SSE Streaming](./sse-streaming.md).

## Trigger avota atzīmēšana

Katra izpilde saglabā `trigger_source` label, kas redzams [Execution History](./execution-history.md). Iestatiet to, nosūtot `X-Trigger-Source` header ar jebkuru izvēlētu vērtību:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Poga **Copy cURL** redaktora dialogā automātiski iekļauj `X-Trigger-Source: API`. Varat aizstāt `API` ar jebko nozīmīgu — `scheduler`, `rabbitmq`, `github-actions` utt.

Ja header netiek nosūtīts, `trigger_source` pēc noklusējuma ir `"API"` un izpilde vēsturē tiek atzīmēta kā **API**. Aizstājiet to ar jebkuru vērtību, kas ir nozīmīga jūsu sistēmai — `scheduler`, `github-actions`, `rabbitmq` utt.

## Saistītie

- [Execution Tokens](./execution-tokens.md) – Ierobežotas JWTs workflow izsaukšanai no ārējām sistēmām
- [SSE Streaming](./sse-streaming.md) – Straumējiet mezglu notikumus reāllaikā, izmantojot Server-Sent Events
- [Triggers](./triggers.md) – Visi workflow ieejas punkti, tostarp webhook
- [Workflow Structure](./workflow-structure.md) – Mezgli un šķautnes
- [Expression DSL](./expression-dsl.md) – Piekļuve `$input.body`, `$input.headers`, `$input.query`
