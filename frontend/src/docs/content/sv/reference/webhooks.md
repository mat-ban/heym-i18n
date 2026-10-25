# Webhooks

Workflows kan utlösas via HTTP-webhooks. Standard-endpointen för körning returnerar JSON, och streaming-varianten returnerar Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Ersätt `{workflow_id}` med workflowens UUID. Bas-URL:en är den egna Heym-instansen (t.ex. `https://app.heym.ai`).

## Request-metod

Varje workflow accepterar ett HTTP-verb, vilket väljs i editorns cURL-dialog: `GET`, `POST`, `PUT` eller `DELETE`. **`POST` är standard**, och varje workflow som skapades innan denna inställning fanns behåller den, så inget som fungerar idag förändras.

Anrop av en workflow med ett annat verb returnerar `405 Method Not Allowed` med en `Allow`-header som anger det konfigurerade verbet:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Ett undantag: förfrågningar med `?test_run=true` hoppar över kontrollen. Det är vad editorns **Run**-knapp och debug-panelen skickar, så en workflow inställd på `GET` förblir testbar inifrån produkten.

### Metoder utan body

`GET` och `DELETE` har ingen request-body. Indata hämtas istället från query-strängen och läses med `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL-dialogen döljer redigeraren för request-body och tar bort `Content-Type`-headern för dessa två metoder.

Kombinera `GET` med en [HTML output mapper](../nodes/html-output-mapper-node.md) för att visa en sida som en webbläsare kan öppna direkt.

## Streaming-endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Använd streaming-endpointen när inkrementella körningshändelser önskas istället för ett enda JSON-svar. Se [SSE Streaming](./sse-streaming.md) för event-protokollet och konfiguration av startmeddelanden per nod.

## Request-format

Request-body skickas som `body` till [Input](../nodes/input-node.md)-noder. Heym accepterar båda request-formerna:

- **Rå JSON** – t.ex. `{"userId": "123", "action": "create"}`
- **Inpackat format** – `{"inputs": {...}, "test_run": false}`

Vid användning av det inpackade formatet extraheras `inputs` och skickas som `body`. `test_run` kringgår rate limiting och response-cachning. Det går även att skicka `?test_run=true` som query-parameter vid postning av rå JSON.

## Request Body-lägen

Varje workflow har en inställning `webhook_body_mode` som styr hur editorn bygger exempel-förfrågningar:

| Läge | Beteende |
|------|----------|
| **defined** | Editorn och cURL-dialogen formar exempel-body från workflowens Input-nodfält och behåller tomma nycklar i JSON-payloaden. Befintliga cURL-payloads av defined-typ fortsätter fungera. |
| **generic** | Editorn och cURL-dialogen använder en fritt formad JSON-body. Request-body skickas vidare som den är så att externa appar kan skicka sin egen fasta payload-form. |

Körnings-API:et förblir bakåtkompatibelt i båda lägena. Rå JSON och inpackade `{ "inputs": ... }`-förfrågningar accepteras fortfarande i båda fallen.

Headers och query-parametrar är tillgängliga i uttryck som `$input.headers` och `$input.query`. Header-nycklar görs om till gemener.

## Autentisering

Konfigureras per workflow i editorn (workflow-inställningar). Autentisering kontrolleras före körning.

| auth_type | Beteende |
|-----------|----------|
| **anonymous** | Ingen autentisering krävs. Vem som helst kan anropa endpointen. |
| **jwt** | Bearer-token krävs. Accepterar antingen en användarsessionstoken (användaren måste ha åtkomst till workflowen) eller en scopad [Execution Token](./execution-tokens.md) skapad för denna workflow. |
| **header_auth** | Anpassad header måste matcha. Ange `auth_header_key` (t.ex. `X-API-Key`) och `auth_header_value`. |

För `header_auth` måste request-headerns värde exakt matcha det konfigurerade värdet. JWT-användare med åtkomst till workflowen kan även anropa utan den anpassade headern.

För `jwt` är [Execution Tokens](./execution-tokens.md) det rekommenderade sättet att anropa workflows från externa system — de är scopade till en enskild workflow och kan återkallas oberoende av varandra.

## Response-cachning

Konfigurera `cache_ttl_seconds` per workflow. När den är satt och större än 0:

- **Cache-nyckel**: SHA256-hash av `workflow_id` + `body` + `query`
- **Cache-träff**: Returnerar omedelbart med `status: "cached"` och cachade utdata
- **Cache-skrivning**: Endast efter en lyckad körning (`status: "success"`)
- **Lagring**: Postgres-baserad och delad mellan backend-arbetare

| Inställning | Effekt |
|---------|--------|
| `cache_ttl_seconds` = 0 eller null | Cachning inaktiverad |
| `cache_ttl_seconds` > 0 | Svar cachas i detta antal sekunder |

`test_run`-förfrågningar kringgår cachen (ingen läsning, ingen skrivning).

När response-cachning är aktiverad i cURL-dialogen rensar **Clear cache** omedelbart den aktuella workflowens cachade svar.

## Rate Limiting

Konfigureras per workflow: `rate_limit_requests` och `rate_limit_window_seconds`.

- **Omfattning**: Per `workflow_id` + klient-IP (glidande fönster)
- **Överskriden**: HTTP 429 med `Retry-After`-header
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Inställning | Beskrivning |
|---------|-------------|
| `rate_limit_requests` | Max antal förfrågningar som tillåts i fönstret |
| `rate_limit_window_seconds` | Fönstrets varaktighet i sekunder |

`test_run`-förfrågningar kringgår rate limiting.
<a id="concurrency-limit-and-queued-runs"></a>

## Concurrency-gräns och köade körningar

Ett workflow kan begränsa hur många produktionskörningar som utförs samtidigt. Aktivera **Concurrency-gräns** i panelen **Properties** på workflow-nivå och ställ in **Max samtidiga körningar**. Ägare och medarbetare med redigeringsbehörighet kan ändra detta. Gränsen är avstängd som standard.

När gränsen nås väntar nya körningar i en FIFO-kö (först in, först ut). Detta omfattar alla startpunkter i produktion: denna endpoint, [streaming-endpointen](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) och varje [trigger](./triggers.md). Editorns egna testkörningar startar alltid omedelbart och tar ingen plats. Att skicka `test_run=true` utan en inloggad session med behörighet att öppna workflowet kringgår inte kön.

| Inställning | Beskrivning |
|---|---|
| `concurrency_limit` | Tillåtna produktionskörningar samtidigt. `0` stänger av gränsen |
| `concurrency_max_queue` | Valfritt. Antal körningar som tillåts vänta samtidigt. Tomt innebär ingen gräns |
| `concurrency_max_wait_seconds` | Valfritt. En körning som väntar längre registreras som `expired`. Tomt innebär obegränsad väntetid |

### 202 Accepted

Ett anrop som startar direkt fungerar precis som beskrivs under Svarsformat. Ett anrop som måste vänta får omedelbart `202 Accepted`, oavsett vad `X-Simple-Response` anger, med ett `Location`-huvud som pekar på dess status-URL:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Fält | Beskrivning |
|---|---|
| `queue.position` | Denna körnings plats i kön, med början på 1 |
| `queue.size` | Körningar som väntar just nu |
| `queue.running` | Körningar som upptar en plats just nu |
| `queue.limit` | Workflowets concurrency-gräns |
| `status_token` | Endast anonyma workflows. Returneras endast en gång i detta svar |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` svarar med körningens tillstånd. Anropa det med samma autentiseringsuppgifter som startade körningen: en session eller JWT, en [körningstoken](./execution-tokens.md) eller workflowets anpassade header. Ett anonymt workflow har inga autentiseringsuppgifter att validera; skicka därför `status_token` från 202-svaret i `X-Heym-Run-Token`-headern. Token läses aldrig från frågesträngen. En felaktig eller saknad token får `404`, precis som en okänd körning.

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

| `status` | Betydelse (en körning som måste vänta på en concurrency-plats får [202-svaret](#202-accepted) i stället) |
|---|---|
| `queued` | Väntar på en plats; `queue` visar positionen |
| `running` | Innehar en plats och körs för närvarande |
| `success` / `error` | Klar; `outputs` och `error` är ifyllda |
| `pending` | Pausad för [mänsklig granskning](./human-in-the-loop.md) |
| `cancelled` | Avbruten från [Körningshistorik](./execution-history.md) |
| `expired` | Väntade längre än `concurrency_max_wait_seconds` och kördes aldrig |

Fråga med några sekunders mellanrum tills statusen inte längre är `queued` eller `running`. En köad körning utförs även om ingen frågar efter status.

### Kön är full

När `concurrency_max_queue` är inställt och så många körningar redan väntar avvisas anropet med `429 Concurrency queue is full` och en `queue_full`-post i körningshistoriken. Inget läggs i kön.

## Svarsformat

Endpointen returnerar JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Fält | Beskrivning |
|-------|-------------|
| `workflow_id` | Workflow-UUID |
| `status` | `success`, `error`, `cached` eller `rate_limited` |
| `outputs` | Utdata från terminalnoder. Med en enda [JSON output mapper](../nodes/json-output-mapper-node.md) som enda terminal utgörs svarskroppen av det mappade objektet på toppnivå (standard för enkla JSON-svar). Annars inkluderas [Output](../nodes/output-node.md) och andra terminaler med label som nyckel. |
| `execution_time_ms` | Körtid i millisekunder (0 för cached/rate_limited) |

Vid fel kan `outputs` innehålla felinformation. En [Throw Error](../nodes/throw-error-node.md)-nod kan ange en anpassad HTTP-statuskod (4xx/5xx).

## Dialog för Run with cURL

Verktygsfältsknappen **Run with cURL** (uppe till höger i editorn, `cURL`-ikonen) öppnar en dialog som bygger och kopierar ett färdigt cURL-kommando för den aktuella workflown.

### Vad den gör

| Fält | Beskrivning |
|-------|-------------|
| **Request Body Mode** | Välj **Defined** eller **Generic**. Generic behåller body som rå JSON istället för att forma den från Input-fält. |
| **Authentication** | Välj Anonymous, JWT Token eller Header Auth. Anger korrekt auth-header i kommandot. När JWT Token väljs visar dialogen en [Execution Token](./execution-tokens.md)-hanterare — skapa eller välj en token för att bädda in den direkt i kommandot. |
| **Header Key / Value** | Visas när Header Auth är valt. Förifylls från workflowns auth-inställningar. |
| **Response Cache** | Antal minuter att cacha identiska svar (0 = inaktiverat). Ändringar sparas till workflown. När aktiverat rensar **Clear cache** cachade svar omedelbart. |
| **Rate Limit** | Max antal förfrågningar per tidsfönster. Ändringar sparas till workflown. |
| **SSE Streaming** | Växlar kommandot till `/execute/stream`, lägger till `--no-buffer` och exponerar inställningar för `node_start`-meddelanden per nod. |
| **Body** | JSON-request body. I Defined-läge förifylls den från [Input](../nodes/input-node.md)-fält och behåller tomma nycklar. I Generic-läge är den en rå JSON-editor. |
| **Command** | Skrivskyddad förhandsvisning av hela cURL-kommandot. |

Klicka på **Copy cURL** för att kopiera kommandot till urklipp.

### Exempel

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

I Generic-läge förblir nästlade payloads intakta, till exempel:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialogen speglar autentiserings-, body-läge-, cachelagrings- och rate limit-inställningarna som är sparade på workflown — redigering här uppdaterar workflown omedelbart.

### SSE Streaming i dialogen

Aktivera **SSE Streaming** när det genererade kommandot ska följa körningen i realtid från terminalen.

- Endpointen ändras från `/execute` till `/execute/stream`
- Kommandot lägger till `--no-buffer` och `Accept: text/event-stream`
- Varje icke-sticky nod visas i en lista där det går att:
  - aktivera eller inaktivera `node_start`-meddelandet
  - anpassa startmeddelandets text
- `node_complete`-händelser sänds alltid och inkluderar nodens fullständiga utdata

Exempel:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

För det kompletta händelseprotokollet och exempel, se [SSE Streaming](./sse-streaming.md).

## Taggning av Trigger-källa

Varje körning lagrar en `trigger_source`-label som visas i [Execution History](./execution-history.md). Ange den genom att skicka headern `X-Trigger-Source` med valfritt värde:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Knappen **Copy cURL** i editordialoggen inkluderar `X-Trigger-Source: API` automatiskt. `API` kan ersättas med något meningsfullt — `scheduler`, `rabbitmq`, `github-actions` etc.

Om headern inte skickas får `trigger_source` standardvärdet `"API"` och körningen märks som **API** i historiken. Det går att åsidosätta med valfritt värde som är meningsfullt för systemet — `scheduler`, `github-actions`, `rabbitmq` etc.

## Relaterat

- [Execution Tokens](./execution-tokens.md) – Scopade JWT:er för att anropa workflows från externa system
- [SSE Streaming](./sse-streaming.md) – Strömma nodhändelser i realtid via Server-Sent Events
- [Triggers](./triggers.md) – Alla workflow-ingångspunkter inklusive webhook
- [Workflow Structure](./workflow-structure.md) – Noder och kanter
- [Expression DSL](./expression-dsl.md) – Åtkomst till `$input.body`, `$input.headers`, `$input.query`
