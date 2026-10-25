# Webhook-uri

Workflow-urile pot fi declanșate prin webhook-uri HTTP. Endpoint-ul standard de execuție returnează JSON, iar varianta de streaming returnează Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Înlocuiți `{workflow_id}` cu UUID-ul workflow-ului. URL-ul de bază este instanța dumneavoastră Heym (de ex. `https://app.heym.ai`).

## Metoda de cerere

Fiecare workflow acceptă un singur verb HTTP, ales în dialogul cURL al editorului: `GET`, `POST`, `PUT` sau `DELETE`. **`POST` este valoarea implicită**, iar fiecare workflow creat înainte de existența acestei setări o păstrează, astfel încât nimic din ceea ce funcționează în prezent nu se modifică.

Apelarea unui workflow cu un verb diferit returnează `405 Method Not Allowed` cu un header `Allow` care indică verbul configurat:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

O excepție: cererile care conțin `?test_run=true` omit verificarea. Acesta este formatul trimis de butonul **Run** din editor și de panoul de depanare, astfel încât un workflow setat pe `GET` rămâne testabil din interiorul produsului.

### Metode fără corp de cerere

`GET` și `DELETE` nu transportă un corp de cerere. Intrările provin din query string și sunt citite cu `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Dialogul cURL ascunde editorul de corp de cerere și elimină header-ul `Content-Type` pentru aceste două metode.

Asociați `GET` cu un [HTML output mapper](../nodes/html-output-mapper-node.md) pentru a servi o pagină pe care un browser o poate deschide direct.

## Endpoint de streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilizați endpoint-ul de streaming atunci când doriți evenimente de execuție incrementale în locul unui singur răspuns JSON. Consultați [SSE Streaming](./sse-streaming.md) pentru protocolul de evenimente și configurarea mesajului de început pentru fiecare nod.

## Formatul cererii

Corpul cererii este transmis ca `body` către nodurile [Input](../nodes/input-node.md). Heym acceptă ambele forme de cerere:

- **JSON brut** – de ex. `{"userId": "123", "action": "create"}`
- **Format împachetat** – `{"inputs": {...}, "test_run": false}`

La utilizarea formatului împachetat, `inputs` este extras și transmis ca `body`. `test_run` ocolește limitarea ratei și cache-ul de răspunsuri. De asemenea, puteți trimite `?test_run=true` ca parametru de query atunci când postați JSON brut.

## Moduri de corp de cerere

Fiecare workflow are o setare `webhook_body_mode` care controlează modul în care editorul construiește cererile exemplu:

| Mod | Comportament |
|------|----------|
| **defined** | Editorul și dialogul cURL modelează corpul exemplu pe baza câmpurilor nodului Input al workflow-ului și păstrează cheile goale în payload-ul JSON. Payload-urile cURL de tip defined existente continuă să funcționeze. |
| **generic** | Editorul și dialogul cURL utilizează un corp JSON liber. Corpul cererii este transmis ca atare, astfel încât aplicațiile externe pot trimite propria formă fixă de payload. |

API-ul de execuție rămâne compatibil retroactiv în ambele moduri. Cererile JSON brut și cele împachetate `{ "inputs": ... }` sunt acceptate în ambele cazuri.

Header-ele și parametrii de query sunt disponibili în expresii ca `$input.headers` și `$input.query`. Cheile de header sunt convertite la litere mici.

## Autentificare

Se configurează per workflow în editor (setările workflow-ului). Autentificarea este verificată înainte de execuție.

| auth_type | Comportament |
|-----------|----------|
| **anonymous** | Nu este necesară autentificarea. Oricine poate apela endpoint-ul. |
| **jwt** | Este necesar un Bearer token. Acceptă fie un token de sesiune de utilizator (utilizatorul trebuie să aibă acces la workflow), fie un [Execution Token](./execution-tokens.md) cu domeniu de aplicare creat pentru acest workflow. |
| **header_auth** | Un header personalizat trebuie să corespundă. Setați `auth_header_key` (de ex. `X-API-Key`) și `auth_header_value`. |

Pentru `header_auth`, valoarea header-ului cererii trebuie să corespundă exact valorii configurate. Utilizatorii JWT cu acces la workflow pot apela și fără header-ul personalizat.

Pentru `jwt`, [Execution Tokens](./execution-tokens.md) reprezintă modalitatea recomandată de a apela workflow-uri din sisteme externe — acestea sunt limitate la un singur workflow și pot fi revocate independent.

## Cache-ul de răspunsuri

Configurați `cache_ttl_seconds` per workflow. Când este setat și mai mare decât 0:

- **Cheie de cache**: hash SHA256 din `workflow_id` + `body` + `query`
- **Cache hit**: Returnează imediat cu `status: "cached"` și ieșirile din cache
- **Cache set**: Doar după o execuție reușită (`status: "success"`)
- **Stocare**: Bazată pe Postgres și partajată între worker-ele de backend

| Setare | Efect |
|---------|--------|
| `cache_ttl_seconds` = 0 sau null | Cache dezactivat |
| `cache_ttl_seconds` > 0 | Răspunsurile sunt stocate în cache pentru acest număr de secunde |

Cererile `test_run` ocolesc cache-ul (fără citire, fără scriere).

Când cache-ul de răspunsuri este activat în dialogul cURL, **Clear cache** elimină imediat răspunsurile din cache ale workflow-ului curent.

## Limitarea ratei

Se configurează per workflow: `rate_limit_requests` și `rate_limit_window_seconds`.

- **Domeniu de aplicare**: Per `workflow_id` + IP-ul clientului (fereastră glisantă)
- **Depășire**: HTTP 429 cu header `Retry-After`
- **Header-e**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Setare | Descriere |
|---------|-------------|
| `rate_limit_requests` | Numărul maxim de cereri permise în fereastră |
| `rate_limit_window_seconds` | Durata ferestrei în secunde |

Cererile `test_run` ocolesc limitarea ratei.
<a id="concurrency-limit-and-queued-runs"></a>

## Limita de concurență și rulările în coadă

Un workflow poate limita numărul de execuții de producție care se desfășoară simultan. Activați **Limita de concurență** în panoul **Properties** la nivel de workflow și setați **Rulări simultane maxime**. Proprietarii și colaboratorii cu acces de editare pot modifica această valoare. Limita este dezactivată în mod implicit.

Când limita este atinsă, noile rulări așteaptă într-o coadă FIFO (primul intrat, primul ieșit). Aceasta acoperă fiecare punct de intrare în producție: acest endpoint, [endpointul de streaming](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) și fiecare [trigger](./triggers.md). Rulările de test din editor pornesc întotdeauna imediat și nu ocupă un slot. Trimiterea parametrului `test_run=true` fără o sesiune autentificată care poate deschide workflow-ul nu ocolește coada.

| Setare | Descriere |
|---|---|
| `concurrency_limit` | Execuții de producție permise simultan. `0` dezactivează limita |
| `concurrency_max_queue` | Opțional. Rulări permise să aștepte în același timp. Gol înseamnă fără limită |
| `concurrency_max_wait_seconds` | Opțional. O rulare care așteaptă mai mult este înregistrată ca `expired`. Gol înseamnă că așteaptă oricât este necesar |

### 202 Accepted

Un apel care pornește imediat se comportă exact așa cum este descris în Formatul răspunsului. Un apel care trebuie să aștepte primește imediat `202 Accepted`, indiferent de ce indică `X-Simple-Response`, cu un antet `Location` care indică spre URL-ul său de stare:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Câmp | Descriere |
|---|---|
| `queue.position` | Poziția acestei rulări în rând, începând de la 1 |
| `queue.size` | Rulări care așteaptă în acest moment |
| `queue.running` | Rulări care ocupă un slot în acest moment |
| `queue.limit` | Limita de concurență a workflow-ului |
| `status_token` | Doar pentru workflow-uri anonime. Returnat o singură dată, în acest răspuns |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` răspunde cu starea rulării. Apelați-l cu aceleași acreditări care au inițiat rularea: o sesiune sau JWT, un [token de execuție](./execution-tokens.md) sau antetul personalizat al workflow-ului. Un workflow anonim nu are acreditări de verificat, prin urmare trimiteți `status_token` din răspunsul 202 în antetul `X-Heym-Run-Token`. Tokenul nu este citit niciodată din query string. Un token greșit sau lipsă primește `404`, la fel ca o execuție necunoscută.

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

| `status` | Semnificație (o rulare care trebuie să aștepte un slot de concurență primește în schimb [răspunsul 202](#202-accepted)) |
|---|---|
| `queued` | Așteaptă un slot; `queue` indică poziția |
| `running` | Are un slot și este în execuție |
| `success` / `error` | Finalizat; `outputs` și `error` sunt populate |
| `pending` | Întrerupt pentru [revizuire umană](./human-in-the-loop.md) |
| `cancelled` | Anulat din [Istoricul execuțiilor](./execution-history.md) |
| `expired` | A așteptat mai mult de `concurrency_max_wait_seconds` și nu a rulat niciodată |

Interogați la fiecare câteva secunde până când starea nu mai este `queued` sau `running`. O rulare în coadă se execută chiar dacă nimeni nu o interoghează.

### Coadă plină

Când este setat `concurrency_max_queue` și numărul respectiv de rulări așteaptă deja, apelul este respins cu `429 Concurrency queue is full` și o intrare `queue_full` în istoricul rulărilor. Nimic nu este plasat în coadă.

## Formatul răspunsului

Endpoint-ul returnează JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Câmp | Descriere |
|-------|-------------|
| `workflow_id` | UUID-ul Workflow-ului |
| `status` | `success`, `error`, `cached` sau `rate_limited` |
| `outputs` | Ieșirile nodurilor terminale. Cu un singur [JSON output mapper](../nodes/json-output-mapper-node.md) ca unic terminal, corpul răspunsului este acel obiect mapat la nivel superior (răspunsuri JSON simple implicite). În caz contrar, include [Output](../nodes/output-node.md) și alte terminale indexate după etichetă. |
| `execution_time_ms` | Timpul de execuție în milisecunde (0 pentru cached/rate_limited) |

În caz de eroare, `outputs` poate conține detalii despre eroare. Un nod [Throw Error](../nodes/throw-error-node.md) poate seta un cod de stare HTTP personalizat (4xx/5xx).

## Dialogul Run with cURL

Butonul din bara de instrumente **Run with cURL** (sus-dreapta editorului, pictograma `cURL`) deschide un dialog care construiește și copiază o comandă cURL gata de rulare pentru Workflow-ul curent.

### Ce face

| Câmp | Descriere |
|-------|-------------|
| **Request Body Mode** | Alegeți **Defined** sau **Generic**. Generic păstrează corpul ca JSON brut în loc să îl modeleze din câmpurile Input. |
| **Authentication** | Alegeți Anonymous, JWT Token sau Header Auth. Setează header-ul de autentificare corect în comandă. Când este selectat JWT Token, dialogul afișează un manager de [Execution Token](./execution-tokens.md) — creați sau selectați un token pentru a-l încorpora direct în comandă. |
| **Header Key / Value** | Vizibil când este selectat Header Auth. Pre-completat din setările de autentificare ale Workflow-ului. |
| **Response Cache** | Minute pentru a stoca în cache răspunsuri identice (0 = dezactivat). Modificările sunt salvate în Workflow. Când este activat, **Clear cache** elimină imediat răspunsurile din cache. |
| **Rate Limit** | Numărul maxim de cereri per fereastră de timp. Modificările sunt salvate în Workflow. |
| **SSE Streaming** | Comută comanda către `/execute/stream`, adaugă `--no-buffer` și expune setările pentru mesajul `node_start` per nod. |
| **Body** | Corpul cererii JSON. În modul Defined este pre-completat din câmpurile [Input](../nodes/input-node.md) și păstrează cheile goale. În modul Generic este un editor JSON brut. |
| **Command** | Previzualizare read-only a comenzii cURL complete. |

Faceți clic pe **Copy cURL** pentru a copia comanda în clipboard.

### Exemplu

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

În modul Generic, payload-urile imbricate rămân intacte, de exemplu:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialogul reflectă setările de autentificare, modul corpului, cache-ul și limita de rată stocate în Workflow — editarea lor aici actualizează imediat Workflow-ul.

### SSE Streaming în dialog

Activați **SSE Streaming** când doriți ca comanda generată să urmărească execuția în timp real din terminalul dumneavoastră.

- Endpoint-ul se schimbă din `/execute` în `/execute/stream`
- Comanda adaugă `--no-buffer` și `Accept: text/event-stream`
- Fiecare nod non-sticky apare într-o listă unde puteți:
  - activa sau dezactiva mesajul `node_start`
  - personaliza textul mesajului de start
- Evenimentele `node_complete` sunt întotdeauna emise și includ ieșirea completă a nodului

Exemplu:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Pentru protocolul complet al evenimentelor și exemple, consultați [SSE Streaming](./sse-streaming.md).

## Etichetarea sursei Trigger

Fiecare execuție stochează o etichetă `trigger_source` vizibilă în [Execution History](./execution-history.md). Setați-o trimițând header-ul `X-Trigger-Source` cu orice valoare doriți:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Butonul **Copy cURL** din dialogul editorului include automat `X-Trigger-Source: API`. Puteți înlocui `API` cu orice valoare semnificativă — `scheduler`, `rabbitmq`, `github-actions` etc.

Dacă header-ul nu este trimis, `trigger_source` are valoarea implicită `"API"` și rularea este etichetată **API** în istoric. Suprascrieți-o cu orice valoare semnificativă pentru sistemul dumneavoastră — `scheduler`, `github-actions`, `rabbitmq` etc.

## Resurse conexe

- [Execution Tokens](./execution-tokens.md) – JWT-uri cu domeniu de aplicare pentru apelarea Workflow-urilor din sisteme externe
- [SSE Streaming](./sse-streaming.md) – Transmiteți evenimente ale nodurilor în timp real prin Server-Sent Events
- [Triggers](./triggers.md) – Toate punctele de intrare ale Workflow-ului, inclusiv Webhook
- [Workflow Structure](./workflow-structure.md) – Noduri și muchii
- [Expression DSL](./expression-dsl.md) – Accesați `$input.body`, `$input.headers`, `$input.query`
