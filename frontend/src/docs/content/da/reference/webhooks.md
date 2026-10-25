# Webhooks

Workflows kan udløses via HTTP-webhooks. Det standard execute-endpoint returnerer JSON, mens streaming-varianten returnerer Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Erstat `{workflow_id}` med workflow-UUID'en. Basis-URL'en er Heym-instansen (f.eks. `https://app.heym.ai`).

## Request-metode

Hvert workflow accepterer én HTTP-verb, valgt i editorens cURL-dialog: `GET`, `POST`, `PUT` eller `DELETE`. **`POST` er standard**, og alle workflows oprettet før denne indstilling eksisterede, beholder den, så eksisterende funktionalitet forbliver uændret.

Hvis et workflow kaldes med en anden verb, returneres `405 Method Not Allowed` med en `Allow`-header, der angiver den konfigurerede:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Én undtagelse: requests med `?test_run=true` springer checken over. Dette er, hvad editorens **Run**-knap og debug-panelet sender, så et workflow sat til `GET` forbliver testbart fra produktet.

### Bodyless-metoder

`GET` og `DELETE` har ingen request-body. Input kommer i stedet fra query-strengen og læses med `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL-dialogen skjuler request-body-editoren og fjerner `Content-Type`-headeren for disse to metoder.

Kombiner `GET` med en [HTML-output-mapper](../nodes/html-output-mapper-node.md) for at servere en side, som en browser kan åbne direkte.

## Streaming-endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Brug streaming-endpoint'et, når der ønskes inkrementelle execution-events i stedet for et enkelt JSON-svar. Se [SSE Streaming](./sse-streaming.md) for event-protokollen og konfiguration af startbeskeder per node.

## Request-format

Request-body'en sendes som `body` til [Input](../nodes/input-node.md)-noder. Heym accepterer begge request-former:

- **Rå JSON** – f.eks. `{"userId": "123", "action": "create"}`
- **Wrapped-format** – `{"inputs": {...}, "test_run": false}`

Ved brug af wrapped-format ekstraheres `inputs` og sendes som `body`. `test_run` omgår rate limiting og response-caching. Det er også muligt at sende `?test_run=true` som query-parameter, når der postes rå JSON.

## Request-body-tilstande

Hvert workflow har en `webhook_body_mode`-indstilling, der styrer, hvordan editoren bygger eksempel-requests:

| Tilstand | Adfærd |
|------|----------|
| **defined** | Editoren og cURL-dialogen former eksempel-body'en fra workflowets Input-node-felter og beholder tomme nøgler i JSON-payload'en. Eksisterende defined-style cURL-payloads fortsætter med at virke. |
| **generic** | Editoren og cURL-dialogen bruger en fri-form JSON-body. Request-body'en sendes gennem uændret, så eksterne apps kan sende deres egne faste payload-former. |

Execution-API'en forbliver bagudkompatibel i begge tilstande. Rå JSON og wrapped `{ "inputs": ... }`-requests accepteres begge veje.

Headers og query-params er tilgængelige i udtryk som `$input.headers` og `$input.query`. Header-nøgler konverteres til små bogstaver.

## Autentificering

Konfigureres per workflow i editoren (workflow-indstillinger). Autentificering tjekkes før execution.

| auth_type | Adfærd |
|-----------|----------|
| **anonymous** | Ingen autentificering krævet. Alle kan kalde endpoint'et. |
| **jwt** | Bearer-token kræves. Accepterer enten en brugersessionstoken (brugeren skal have workflow-adgang) eller et scoped [Execution Token](./execution-tokens.md) oprettet til dette workflow. |
| **header_auth** | Brugerdefineret header skal matche. Indstil `auth_header_key` (f.eks. `X-API-Key`) og `auth_header_value`. |

For `header_auth` skal request-headerværdien matche den konfigurerede værdi nøjagtigt. JWT-brugere med workflow-adgang kan også kalde uden den brugerdefinerede header.

For `jwt` er [Execution Tokens](./execution-tokens.md) den anbefalede måde at kalde workflows fra eksterne systemer på - de er scoped til et enkelt workflow og kan tilbagekaldes uafhængigt.

## Response-caching

Konfigurer `cache_ttl_seconds` per workflow. Når sat og større end 0:

- **Cache-nøgle**: SHA256-hash af `workflow_id` + `body` + `query`
- **Cache-hit**: Returnerer straks med `status: "cached"` og cachelagrede outputs
- **Cache-set**: Kun efter en succesfuld execution (`status: "success"`)
- **Lager**: Postgres-baseret og delt på tværs af backend-workers

| Indstilling | Effekt |
|---------|--------|
| `cache_ttl_seconds` = 0 eller null | Caching deaktiveret |
| `cache_ttl_seconds` > 0 | Responses cachelagres i dette antal sekunder |

`test_run`-requests springer cachen over (ingen læsning, ingen skrivning).

Når response-caching er aktiveret i cURL-dialogen, fjerner **Clear cache** workflowets cachelagrede responses med det samme.

## Rate Limiting

Konfigureres per workflow: `rate_limit_requests` og `rate_limit_window_seconds`.

- **Scope**: Per `workflow_id` + client-IP (glidende vindue)
- **Overskredet**: HTTP 429 med `Retry-After`-header
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Indstilling | Beskrivelse |
|---------|-------------|
| `rate_limit_requests` | Maksimalt antal tilladte requests i vinduet |
| `rate_limit_window_seconds` | Vindueslængde i sekunder |

`test_run`-requests springer rate limiting over.
<a id="concurrency-limit-and-queued-runs"></a>

## Concurrency-grænse og køede kørsler

Et workflow kan begrænse, hvor mange produktionskørsler der udføres samtidigt. Slå **Concurrency-grænse** til i panelet **Properties** på workflow-niveau og indstil **Maks. samtidige kørsler**. Ejere og bidragydere med redigeringsadgang kan ændre det. Grænsen er slået fra som standard.

Når grænsen nås, venter nye kørsler i en FIFO-kø (først ind, først ud). Dette dækker ethvert produktionsindgangspunkt: dette endpoint, [streaming-endpointet](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) og hver [trigger](./triggers.md). Editorens egne testkørsler starter altid med det samme og optager ikke en plads. Afsendelse af `test_run=true` uden en logget ind session, der kan åbne workflowet, omgår ikke køen.

| Indstilling | Beskrivelse |
|---|---|
| `concurrency_limit` | Tilladte produktionskørsler samtidigt. `0` deaktiverer grænsen |
| `concurrency_max_queue` | Valgfrit. Tilladt antal kørsler, der venter samtidigt. Tomt betyder ingen grænse |
| `concurrency_max_wait_seconds` | Valgfrit. En kørsel, der venter længere, registreres som `expired`. Tomt betyder ubegrænset ventetid |

### 202 Accepted

Et kald, der starter med det samme, opfører sig nøjagtigt som beskrevet under Svarformat. Et kald, der skal vente, modtager straks `202 Accepted`, uanset hvad `X-Simple-Response` angiver, med en `Location`-header, der peger på dens status-URL:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Felt | Beskrivelse |
|---|---|
| `queue.position` | Denne kørsels placering i køen, startende ved 1 |
| `queue.size` | Kørsler, der venter i øjeblikket |
| `queue.running` | Kørsler, der optager en plads i øjeblikket |
| `queue.limit` | Workflowets concurrency-grænse |
| `status_token` | Kun anonyme workflows. Returneres kun én gang i dette svar |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` svarer med kørslens tilstand. Kald det med de samme legitimationsoplysninger, der startede kørslen: en session eller JWT, et [kørselstoken](./execution-tokens.md) eller workflowets brugerdefinerede header. Et anonymt workflow har ingen legitimationsoplysninger at kontrollere; send derfor `status_token` fra 202-svaret i `X-Heym-Run-Token`-headeren. Tokenet læses aldrig fra forespørgselsstrengen. Et forkert eller manglende token modtager `404`, ligesom en ukendt eksekvering.

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

| `status` | Betydning (en kørsel, der skal vente på en concurrency-plads, modtager i stedet [202-svaret](#202-accepted)) |
|---|---|
| `queued` | Venter på en plads; `queue` viser positionen |
| `running` | Har en plads og afvikles i øjeblikket |
| `success` / `error` | Fuldført; `outputs` og `error` er udfyldt |
| `pending` | Sat på pause til [menneskelig gennemgang](./human-in-the-loop.md) |
| `cancelled` | Annulleret fra [Kørselshistorik](./execution-history.md) |
| `expired` | Ventede længere end `concurrency_max_wait_seconds` og kørte aldrig |

Foretag forespørgsler med få sekunders mellemrum, indtil statussen hverken er `queued` eller `running`. En kørsel i kø udføres, selvom ingen spørger efter status.

### Køen er fuld

Når `concurrency_max_queue` er indstillet, og der allerede venter så mange kørsler, afvises kaldet med `429 Concurrency queue is full` og en `queue_full`-post i kørselshistorikken. Intet sættes i kø.

## Svarformat

Endpointen returnerer JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Felt | Beskrivelse |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` eller `rate_limited` |
| `outputs` | Output fra terminalnoder. Hvis der kun er en enkelt [JSON-outputmapper](../nodes/json-output-mapper-node.md) som terminal, er svaret det mappede objekt på øverste niveau (standard simple JSON-svar). Ellers inkluderer det [Output](../nodes/output-node.md) og andre terminaler nøglet efter label. |
| `execution_time_ms` | Eksekveringstid i millisekunder (0 for cached/rate_limited) |

Ved fejl kan `outputs` indeholde fejldetaljer. En [Throw Error](../nodes/throw-error-node.md)-node kan angive en brugerdefineret HTTP-statuskode (4xx/5xx).

## Kør med cURL-dialog

Knappen **Kør med cURL** i værktøjslinjen (øverst til højre i editoren, `cURL`-ikon) åbner en dialog, der genererer og kopierer en klar til brug cURL-kommando for det aktuelle workflow.

### Funktionalitet

| Felt | Beskrivelse |
|-------|-------------|
| **Request Body Mode** | Vælg **Defined** eller **Generic**. Generic bevarer body som rå JSON i stedet for at forme den fra Input-felter. |
| **Authentication** | Vælg Anonymous, JWT Token eller Header Auth. Indstiller den korrekte auth-header i kommandoen. Når JWT Token er valgt, viser dialogen en [Execution Token](./execution-tokens.md)-manager - opret eller vælg et token for at indlejre det direkte i kommandoen. |
| **Header Key / Value** | Synlig når Header Auth er valgt. Forududfyldt fra workflowets auth-indstillinger. |
| **Response Cache** | Minutter at cache identiske svar (0 = deaktiveret). Ændringer gemmes i workflowet. Når aktiveret, fjerner **Clear cache** cachelagrede svar med det samme. |
| **Rate Limit** | Maksimalt antal requests pr. tidsvindue. Ændringer gemmes i workflowet. |
| **SSE Streaming** | Skifter kommandoen til `/execute/stream`, tilføjer `--no-buffer` og eksponerer indstillinger for `node_start`-beskeder pr. node. |
| **Body** | JSON request body. I Defined mode er den forududfyldt fra [Input](../nodes/input-node.md)-felter og bevarer tomme nøgler. I Generic mode er det en rå JSON-editor. |
| **Command** | Skrivebeskyttet forhåndsvisning af den fulde cURL-kommando. |

Klik på **Copy cURL** for at kopiere kommandoen til udklipsholderen.

### Eksempel

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

I Generic mode forbliver nestede payloads intakte, f.eks.:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialogen afspejler de autentifikations-, body mode-, cache- og rate limit-indstillinger, der er gemt på workflowet - redigering her opdaterer workflowet med det samme.

### SSE Streaming i dialogen

Aktivér **SSE Streaming** når der ønskes at følge eksekveringen i realtid fra terminalen.

- Endpoint ændres fra `/execute` til `/execute/stream`
- Kommandoen tilføjer `--no-buffer` og `Accept: text/event-stream`
- Hver ikke-sticky node vises i en liste hvor det er muligt at:
  - aktivere eller deaktivere `node_start`-beskeden
  - tilpasse startbeskedens tekst
- `node_complete`-events sendes altid og inkluderer nodens fulde output

Eksempel:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

For den fulde event-protokol og eksempler, se [SSE Streaming](./sse-streaming.md).

## Trigger Source Tagging

Hver eksekvering gemmer en `trigger_source`-label synlig i [Execution History](./execution-history.md). Angiv den ved at sende `X-Trigger-Source`-headeren med en valgfri værdi:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

**Copy cURL**-knappen i editordialogen inkluderer automatisk `X-Trigger-Source: API`. Det er muligt at erstatte `API` med en meningsfuld værdi - `scheduler`, `rabbitmq`, `github-actions` osv.

Hvis headeren ikke sendes, sættes `trigger_source` som standard til `"API"`, og kørslen mærkes som **API** i historikken. Det kan tilsidesættes med enhver meningsfuld værdi for systemet - `scheduler`, `github-actions`, `rabbitmq` osv.

## Relateret

- [Execution Tokens](./execution-tokens.md) – Scopede JWTs til at kalde workflows fra eksterne systemer
- [SSE Streaming](./sse-streaming.md) – Stream node-events i realtid via Server-Sent Events
- [Triggers](./triggers.md) – Alle workflow-indgangspunkter inklusive webhook
- [Workflow Structure](./workflow-structure.md) – Noder og kanter
- [Expression DSL](./expression-dsl.md) – Adgang til `$input.body`, `$input.headers`, `$input.query`
