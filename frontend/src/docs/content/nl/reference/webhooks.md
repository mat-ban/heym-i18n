# Webhooks

Workflows kunnen worden geactiveerd via HTTP-webhooks. Het standaard execute-endpoint retourneert JSON en de streaming-variant retourneert Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Vervang `{workflow_id}` door de workflow-UUID. De basis-URL is uw Heym-instantie (bijv. `https://app.heym.ai`).

## Request Method

Elke workflow accepteert één HTTP-werkwoord, gekozen in de cURL-dialoog van de editor: `GET`, `POST`, `PUT` of `DELETE`. **`POST` is de standaard**, en elke workflow die vóór het bestaan van deze instelling is aangemaakt, behoudt deze, zodat niets dat vandaag werkt verandert.

Het aanroepen van een workflow met een ander werkwoord retourneert `405 Method Not Allowed` met een `Allow`-header die het geconfigureerde werkwoord vermeldt:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Eén uitzondering: verzoeken met `?test_run=true` slaan de controle over. Dat is wat de **Run**-knop en het debug-paneel van de editor verzenden, zodat een workflow die op `GET` is ingesteld, testbaar blijft vanuit het product zelf.

### Bodyless methods

`GET` en `DELETE` bevatten geen request-body. Invoer komt in plaats daarvan uit de query string en wordt gelezen met `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

De cURL-dialoog verbergt de request-body-editor en laat de `Content-Type`-header weg voor deze twee methoden.

Combineer `GET` met een [HTML output mapper](../nodes/html-output-mapper-node.md) om een pagina te serveren die een browser direct kan openen.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Gebruik het streaming-endpoint wanneer u incrementele uitvoeringsgebeurtenissen wilt in plaats van één enkele JSON-respons. Zie [SSE Streaming](./sse-streaming.md) voor het gebeurtenisprotocol en de configuratie van het startbericht per knooppunt.

## Request Format

De request-body wordt doorgegeven als `body` aan [Input](../nodes/input-node.md)-knooppunten. Heym accepteert beide request-vormen:

- **Raw JSON** – bijv. `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

Bij gebruik van het wrapped-formaat wordt `inputs` geëxtraheerd en doorgegeven als `body`. `test_run` omzeilt rate limiting en response caching. U kunt ook `?test_run=true` als query-parameter verzenden bij het posten van raw JSON.

## Request Body Modes

Elke workflow heeft een `webhook_body_mode`-instelling die bepaalt hoe de editor voorbeeldverzoeken opbouwt:

| Mode | Gedrag |
|------|----------|
| **defined** | De editor en cURL-dialoog vormen de voorbeeld-body op basis van de velden van het Input-knooppunt van de workflow en behouden lege sleutels in de JSON-payload. Bestaande defined-style cURL-payloads blijven werken. |
| **generic** | De editor en cURL-dialoog gebruiken een vrije JSON-body. De request-body wordt ongewijzigd doorgegeven, zodat externe apps hun eigen vaste payload-vorm kunnen verzenden. |

De execution-API blijft in beide modi achterwaarts compatibel. Raw JSON en wrapped `{ "inputs": ... }`-verzoeken worden in beide gevallen nog steeds geaccepteerd.

Headers en query params zijn beschikbaar in expressies als `$input.headers` en `$input.query`. Header-sleutels worden omgezet naar kleine letters.

## Authentication

Configureer per workflow in de editor (workflow-instellingen). Auth wordt gecontroleerd vóór uitvoering.

| auth_type | Gedrag |
|-----------|----------|
| **anonymous** | Geen auth vereist. Iedereen kan het endpoint aanroepen. |
| **jwt** | Bearer-token vereist. Accepteert een user session token (gebruiker moet workflow-toegang hebben) of een scoped [Execution Token](./execution-tokens.md) die voor deze workflow is aangemaakt. |
| **header_auth** | Aangepaste header moet overeenkomen. Stel `auth_header_key` (bijv. `X-API-Key`) en `auth_header_value` in. |

Voor `header_auth` moet de waarde van de request-header exact overeenkomen met de geconfigureerde waarde. JWT-gebruikers met workflow-toegang kunnen ook aanroepen zonder de aangepaste header.

Voor `jwt` zijn [Execution Tokens](./execution-tokens.md) de aanbevolen manier om workflows vanuit externe systemen aan te roepen — ze zijn scoped op één workflow en kunnen onafhankelijk worden ingetrokken.

## Response Caching

Configureer `cache_ttl_seconds` per workflow. Indien ingesteld en groter dan 0:

- **Cache key**: SHA256-hash van `workflow_id` + `body` + `query`
- **Cache hit**: Retourneert onmiddellijk met `status: "cached"` en gecachte outputs
- **Cache set**: Alleen na een succesvolle uitvoering (`status: "success"`)
- **Storage**: Postgres-backed en gedeeld over backend-workers

| Instelling | Effect |
|---------|--------|
| `cache_ttl_seconds` = 0 of null | Caching uitgeschakeld |
| `cache_ttl_seconds` > 0 | Responses worden gedurende dit aantal seconden gecacht |

`test_run`-verzoeken omzeilen de cache (geen read, geen write).

Wanneer response caching is ingeschakeld in de cURL-dialoog, verwijdert **Clear cache** onmiddellijk de gecachte responses van de huidige workflow.

## Rate Limiting

Configureer per workflow: `rate_limit_requests` en `rate_limit_window_seconds`.

- **Scope**: Per `workflow_id` + client-IP (sliding window)
- **Overschreden**: HTTP 429 met `Retry-After`-header
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Instelling | Beschrijving |
|---------|-------------|
| `rate_limit_requests` | Maximaal toegestane verzoeken binnen het venster |
| `rate_limit_window_seconds` | Duur van het venster in seconden |

`test_run`-verzoeken omzeilen rate limiting.

<a id="concurrency-limit-and-queued-runs"></a>

## Concurrency-limiet en uitvoeringen in de wachtrij

Een workflow kan het aantal gelijktijdige productie-uitvoeringen beperken. Schakel **Concurrency-limiet** in via het **Properties**-paneel op workflow-niveau en stel **Max. gelijktijdige uitvoeringen** in. Eigenaren en bijdragers met bewerkingstoegang kunnen dit wijzigen. De limiet is standaard uitgeschakeld.

Zodra de limiet is bereikt, wachten nieuwe uitvoeringen in een first-in, first-out wachtrij. Dit geldt voor elk productie-invalspunt: dit endpoint, het [streaming-endpoint](./sse-streaming.md), het [Portal](./portal.md), de [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) en elke [trigger](./triggers.md). Testuitvoeringen van de editor starten altijd direct en nemen geen slot in beslag. Het verzenden van `test_run=true` zonder een aangemelde sessie die de workflow mag openen, omzeilt de wachtrij niet.

| Instelling | Beschrijving |
|---|---|
| `concurrency_limit` | Productie-uitvoeringen tegelijk toegestaan. `0` schakelt de limiet uit |
| `concurrency_max_queue` | Optioneel. Uitvoeringen die tegelijk mogen wachten. Leeg betekent geen limiet |
| `concurrency_max_wait_seconds` | Optioneel. Een uitvoering die langer wacht, wordt geregistreerd als `expired`. Leeg betekent dat deze zolang wacht als nodig |

### 202 Accepted

Een aanroep die direct start, gedraagt zich exact zoals beschreven onder Antwoordformaat. Een aanroep die moet wachten, ontvangt direct `202 Accepted`, ongeacht `X-Simple-Response`, met een `Location`-header die verwijst naar de status-URL:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Veld | Beschrijving |
|---|---|
| `queue.position` | Positie van deze uitvoering in de rij, beginnend bij 1 |
| `queue.size` | Uitvoeringen die momenteel wachten |
| `queue.running` | Uitvoeringen die momenteel een slot bezet houden |
| `queue.limit` | De concurrency-limiet van de workflow |
| `status_token` | Alleen voor anonieme workflows. Eenmalig geretourneerd in dit antwoord |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` beantwoordt met de status van de uitvoering. Roep dit aan met dezelfde inloggegevens waarmee de uitvoering is gestart: een sessie of JWT, een [uitvoeringstoken](./execution-tokens.md) of de aangepaste header van de workflow. Een anonieme workflow heeft geen inloggegevens om te controleren; stuur daarom het `status_token` van de 202 mee in de `X-Heym-Run-Token`-header. Het token wordt nooit uit de query-string gelezen. Een onjuist of ontbrekend token krijgt `404`, net als een onbekende uitvoering.

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

| `status` | Betekenis (een uitvoering die moet wachten op een concurrency-slot ontvangt in plaats daarvan het [202-antwoord](#202-accepted)) |
|---|---|
| `queued` | Wachten op een slot; `queue` toont de positie |
| `running` | Beschikt over een slot en wordt uitgevoerd |
| `success` / `error` | Voltooid; `outputs` en `error` zijn ingevuld |
| `pending` | Gepauzeerd voor [menselijke beoordeling](./human-in-the-loop.md) |
| `cancelled` | Geannuleerd vanuit de [Uitvoeringsgeschiedenis](./execution-history.md) |
| `expired` | Heeft langer gewacht dan `concurrency_max_wait_seconds` en is nooit uitgevoerd |

Poll om de paar seconden totdat de status niet langer `queued` of `running` is. Een uitvoering in de wachtrij wordt uitgevoerd, zelfs als niemand pollt.

### Wachtrij vol

Wanneer `concurrency_max_queue` is ingesteld en dat aantal uitvoeringen al wacht, wordt de aanroep geweigerd met `429 Concurrency queue is full` en een `queue_full`-vermelding in de geschiedenis. Er wordt niets in de wachtrij geplaatst.

## Antwoordformaat

Het endpoint retourneert JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Veld | Beschrijving |
|-------|-------------|
| `workflow_id` | Workflow-UUID |
| `status` | `success`, `error`, `cached` of `rate_limited` |
| `outputs` | Uitvoer van eindknooppunten. Wanneer een enkele [JSON-uitvoermapper](../nodes/json-output-mapper-node.md) het enige eindknooppunt is, is de response body dat gemapte object op het hoogste niveau (standaard eenvoudige JSON-responses). Anders bevat het [Output](../nodes/output-node.md) en andere eindknooppunten, gesleuteld op label. |
| `execution_time_ms` | Uitvoeringstijd in milliseconden (0 voor cached/rate_limited) |

Bij een fout kan `outputs` foutdetails bevatten. Een [Throw Error](../nodes/throw-error-node.md)-knooppunt kan een aangepaste HTTP-statuscode instellen (4xx/5xx).

## Dialoogvenster Uitvoeren met cURL

De werkbalkknop **Uitvoeren met cURL** (rechtsboven in de editor, `cURL`-pictogram) opent een dialoogvenster dat een direct uitvoerbaar cURL-commando voor de huidige workflow samenstelt en kopieert.

### Wat het doet

| Veld | Beschrijving |
|-------|-------------|
| **Request Body-modus** | Kies **Defined** of **Generic**. Generic behoudt de body als ruwe JSON in plaats van deze vorm te geven op basis van Input-velden. |
| **Authenticatie** | Kies Anonymous, JWT Token of Header Auth. Stelt de juiste auth-header in het commando in. Wanneer JWT Token is geselecteerd, toont het dialoogvenster een [Execution Token](./execution-tokens.md)-beheerder — maak een token aan of selecteer er een om deze direct in het commando op te nemen. |
| **Header Key / Value** | Zichtbaar wanneer Header Auth is geselecteerd. Vooraf ingevuld op basis van de auth-instellingen van de workflow. |
| **Response Cache** | Aantal minuten om identieke responses te cachen (0 = uitgeschakeld). Wijzigingen worden opgeslagen in de workflow. Indien ingeschakeld, verwijdert **Clear cache** gecachte responses onmiddellijk. |
| **Rate Limit** | Maximaal aantal requests per tijdvenster. Wijzigingen worden opgeslagen in de workflow. |
| **SSE Streaming** | Schakelt het commando om naar `/execute/stream`, voegt `--no-buffer` toe en toont instellingen voor `node_start`-berichten per knooppunt. |
| **Body** | JSON-request body. In de modus Defined wordt deze vooraf ingevuld op basis van [Input](../nodes/input-node.md)-velden en blijven lege sleutels behouden. In de modus Generic is het een ruwe JSON-editor. |
| **Command** | Alleen-lezen voorbeeld van het volledige cURL-commando. |

Klik op **Copy cURL** om het commando naar het klembord te kopiëren.

### Voorbeeld

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

In de modus Generic blijven geneste payloads intact, bijvoorbeeld:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Het dialoogvenster weerspiegelt de authenticatie-, body-modus-, caching- en rate-limit-instellingen die in de workflow zijn opgeslagen — het bewerken hiervan werkt de workflow onmiddellijk bij.

### SSE Streaming in het dialoogvenster

Schakel **SSE Streaming** in wanneer u wilt dat het gegenereerde commando de uitvoering in realtime volgt vanuit uw terminal.

- Het endpoint verandert van `/execute` naar `/execute/stream`
- Het commando voegt `--no-buffer` en `Accept: text/event-stream` toe
- Elk niet-sticky knooppunt verschijnt in een lijst waar u het volgende kunt doen:
  - het `node_start`-bericht in- of uitschakelen
  - de tekst van het startbericht aanpassen
- `node_complete`-events worden altijd verzonden en bevatten de volledige uitvoer van het knooppunt

Voorbeeld:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Zie [SSE Streaming](./sse-streaming.md) voor het volledige event-protocol en voorbeelden.

## Trigger Source-tagging

Elke uitvoering slaat een `trigger_source`-label op dat zichtbaar is in [Execution History](./execution-history.md). Stel dit in door de header `X-Trigger-Source` met een waarde naar keuze mee te sturen:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

De knop **Copy cURL** in het editor-dialoogvenster voegt automatisch `X-Trigger-Source: API` toe. U kunt `API` vervangen door elke betekenisvolle waarde — `scheduler`, `rabbitmq`, `github-actions`, enz.

Als de header niet wordt verzonden, is `trigger_source` standaard `"API"` en wordt de uitvoering in de geschiedenis aangeduid als **API**. Overschrijf dit met elke waarde die betekenisvol is voor uw systeem — `scheduler`, `github-actions`, `rabbitmq`, enz.

## Gerelateerd

- [Execution Tokens](./execution-tokens.md) – Afgebakende JWT's voor het aanroepen van workflows vanuit externe systemen
- [SSE Streaming](./sse-streaming.md) – Stream knooppunt-events in realtime via Server-Sent Events
- [Triggers](./triggers.md) – Alle workflow-entrypoints, inclusief webhook
- [Workflow Structure](./workflow-structure.md) – Knooppunten en edges
- [Expression DSL](./expression-dsl.md) – Toegang tot `$input.body`, `$input.headers`, `$input.query`
