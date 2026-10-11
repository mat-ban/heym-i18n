# Webhook

I Workflow possono essere attivati tramite webhook HTTP. L'endpoint di esecuzione standard restituisce JSON, mentre la variante in streaming restituisce Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Sostituire `{workflow_id}` con l'UUID del workflow. L'URL di base è l'istanza Heym in uso (ad esempio `https://app.heym.ai`).

## Metodo della richiesta

Ogni workflow accetta un solo verbo HTTP, scelto nella finestra cURL dell'editor: `GET`, `POST`, `PUT` o `DELETE`. **`POST` è il valore predefinito**, e ogni workflow creato prima dell'introduzione di questa impostazione lo mantiene, quindi nulla di ciò che funziona oggi cambia.

Chiamare un workflow con un verbo diverso restituisce `405 Method Not Allowed` con un header `Allow` che indica quello configurato:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Un'eccezione: le richieste che contengono `?test_run=true` saltano il controllo. È ciò che inviano il pulsante **Run** dell'editor e il pannello di debug, quindi un workflow impostato su `GET` resta testabile dall'interno del prodotto.

### Metodi senza body

`GET` e `DELETE` non trasportano alcun body di richiesta. Gli input provengono invece dalla query string e vengono letti con `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

La finestra cURL nasconde l'editor del body di richiesta e rimuove l'header `Content-Type` per questi due metodi.

Abbinare `GET` a un [HTML output mapper](../nodes/html-output-mapper-node.md) per servire una pagina che un browser possa aprire direttamente.

## Endpoint di streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilizzare l'endpoint di streaming quando si desiderano eventi di esecuzione incrementali invece di una singola risposta JSON. Consultare [SSE Streaming](./sse-streaming.md) per il protocollo degli eventi e la configurazione del messaggio di avvio per ciascun nodo.

## Formato della richiesta

Il body della richiesta viene passato come `body` ai nodi [Input](../nodes/input-node.md). Heym accetta entrambe le forme di richiesta:

- **JSON raw** – ad esempio `{"userId": "123", "action": "create"}`
- **Formato wrapped** – `{"inputs": {...}, "test_run": false}`

Quando si utilizza il formato wrapped, `inputs` viene estratto e passato come `body`. `test_run` aggira il rate limiting e la cache delle risposte. È inoltre possibile inviare `?test_run=true` come parametro di query quando si effettua il POST di JSON raw.

## Modalità del body di richiesta

Ogni workflow dispone di un'impostazione `webhook_body_mode` che controlla come l'editor costruisce le richieste di esempio:

| Modalità | Comportamento |
|------|----------|
| **defined** | L'editor e la finestra cURL costruiscono il body di esempio a partire dai campi del nodo Input del workflow e mantengono le chiavi vuote nel payload JSON. I payload cURL esistenti in stile defined continuano a funzionare. |
| **generic** | L'editor e la finestra cURL utilizzano un body JSON libero. Il body della richiesta viene passato così com'è, in modo che le app esterne possano inviare la propria forma di payload fissa. |

L'API di esecuzione resta retrocompatibile in entrambe le modalità. Le richieste JSON raw e wrapped `{ "inputs": ... }` sono comunque accettate in entrambi i casi.

Gli header e i query param sono disponibili nelle espressioni come `$input.headers` e `$input.query`. Le chiavi degli header sono convertite in minuscolo.

## Autenticazione

Configurabile per ciascun workflow nell'editor (impostazioni del workflow). L'autenticazione viene verificata prima dell'esecuzione.

| auth_type | Comportamento |
|-----------|----------|
| **anonymous** | Nessuna autenticazione richiesta. Chiunque può chiamare l'endpoint. |
| **jwt** | Token Bearer richiesto. Accetta sia un token di sessione utente (l'utente deve avere accesso al workflow) sia un [Execution Token](./execution-tokens.md) con scope creato per questo workflow. |
| **header_auth** | Un header personalizzato deve corrispondere. Impostare `auth_header_key` (ad esempio `X-API-Key`) e `auth_header_value`. |

Per `header_auth`, il valore dell'header della richiesta deve corrispondere esattamente al valore configurato. Gli utenti JWT con accesso al workflow possono comunque chiamare senza l'header personalizzato.

Per `jwt`, gli [Execution Token](./execution-tokens.md) sono il modo consigliato per chiamare i workflow da sistemi esterni — hanno scope limitato a un singolo workflow e possono essere revocati in modo indipendente.

## Cache delle risposte

Configurare `cache_ttl_seconds` per ciascun workflow. Quando impostato e maggiore di 0:

- **Chiave di cache**: hash SHA256 di `workflow_id` + `body` + `query`
- **Cache hit**: restituisce immediatamente con `status: "cached"` e gli output in cache
- **Cache set**: solo dopo un'esecuzione riuscita (`status: "success"`)
- **Archiviazione**: supportata da Postgres e condivisa tra i worker del backend

| Impostazione | Effetto |
|---------|--------|
| `cache_ttl_seconds` = 0 o null | Cache disabilitata |
| `cache_ttl_seconds` > 0 | Risposte in cache per questo numero di secondi |

Le richieste `test_run` aggirano la cache (nessuna lettura, nessuna scrittura).

Quando la cache delle risposte è abilitata nella finestra cURL, **Clear cache** rimuove immediatamente le risposte in cache del workflow corrente.

## Rate Limiting

Configurabile per ciascun workflow: `rate_limit_requests` e `rate_limit_window_seconds`.

- **Ambito**: per `workflow_id` + IP del client (sliding window)
- **Superamento**: HTTP 429 con header `Retry-After`
- **Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Impostazione | Descrizione |
|---------|-------------|
| `rate_limit_requests` | Numero massimo di richieste consentite nella finestra |
| `rate_limit_window_seconds` | Durata della finestra in secondi |

Le richieste `test_run` aggirano il rate limiting.

## Formato della Risposta

L'endpoint restituisce JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Campo | Descrizione |
|-------|-------------|
| `workflow_id` | UUID del Workflow |
| `status` | `success`, `error`, `cached` o `rate_limited` |
| `outputs` | Output dei nodi terminali. Con un singolo [JSON output mapper](../nodes/json-output-mapper-node.md) come unico terminale, il corpo della risposta è quell'oggetto mappato al livello superiore (risposte JSON semplici predefinite). In caso contrario, include [Output](../nodes/output-node.md) e altri terminali identificati tramite label. |
| `execution_time_ms` | Tempo di esecuzione in millisecondi (0 per cached/rate_limited) |

In caso di errore, `outputs` può contenere i dettagli dell'errore. Un nodo [Throw Error](../nodes/throw-error-node.md) può impostare un codice di stato HTTP personalizzato (4xx/5xx).

## Dialogo Run with cURL

Il pulsante della barra degli strumenti **Run with cURL** (in alto a destra nell'editor, icona `cURL`) apre un dialogo che genera e copia un comando cURL pronto all'uso per il workflow corrente.

### Funzionalità

| Campo | Descrizione |
|-------|-------------|
| **Request Body Mode** | Scegliere **Defined** o **Generic**. Generic mantiene il body come JSON grezzo invece di modellarlo a partire dai campi Input. |
| **Authentication** | Scegliere Anonymous, JWT Token o Header Auth. Imposta l'header di autenticazione corretto nel comando. Quando è selezionato JWT Token, il dialogo mostra un gestore di [Execution Token](./execution-tokens.md) — creare o selezionare un token per incorporarlo direttamente nel comando. |
| **Header Key / Value** | Visibile quando è selezionato Header Auth. Precompilato dalle impostazioni di autenticazione del workflow. |
| **Response Cache** | Minuti di cache per risposte identiche (0 = disabilitato). Le modifiche vengono salvate nel workflow. Quando abilitato, **Clear cache** elimina immediatamente le risposte in cache. |
| **Rate Limit** | Numero massimo di richieste per finestra temporale. Le modifiche vengono salvate nel workflow. |
| **SSE Streaming** | Cambia il comando in `/execute/stream`, aggiunge `--no-buffer` ed espone le impostazioni del messaggio `node_start` per ciascun nodo. |
| **Body** | Body JSON della richiesta. In modalità Defined è precompilato dai campi [Input](../nodes/input-node.md) e mantiene le chiavi vuote. In modalità Generic è un editor JSON grezzo. |
| **Command** | Anteprima in sola lettura del comando cURL completo. |

Fare clic su **Copy cURL** per copiare il comando negli appunti.

### Esempio

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

In modalità Generic, i payload annidati rimangono intatti, ad esempio:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Il dialogo rispecchia le impostazioni di autenticazione, modalità body, caching e rate-limit memorizzate nel workflow — modificarle qui aggiorna immediatamente il workflow.

### SSE Streaming nel Dialogo

Abilitare **SSE Streaming** quando si desidera che il comando generato segua l'esecuzione in tempo reale dal terminale.

- L'endpoint cambia da `/execute` a `/execute/stream`
- Il comando aggiunge `--no-buffer` e `Accept: text/event-stream`
- Ogni nodo non-sticky appare in un elenco dove è possibile:
  - abilitare o disabilitare il messaggio `node_start`
  - personalizzare il testo del messaggio di avvio
- Gli eventi `node_complete` vengono sempre emessi e includono l'output completo del nodo

Esempio:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Per il protocollo completo degli eventi e gli esempi, consultare [SSE Streaming](./sse-streaming.md).

## Tagging dell'Origine del Trigger

Ogni esecuzione memorizza un'etichetta `trigger_source` visibile nella [Cronologia delle Esecuzioni](./execution-history.md). Impostarla inviando l'header `X-Trigger-Source` con qualsiasi valore desiderato:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Il pulsante **Copy cURL** nel dialogo dell'editor include automaticamente `X-Trigger-Source: API`. È possibile sostituire `API` con qualsiasi valore significativo — `scheduler`, `rabbitmq`, `github-actions`, ecc.

Se l'header non viene inviato, `trigger_source` assume il valore predefinito `"API"` e l'esecuzione viene etichettata come **API** nella cronologia. Sovrascriverlo con qualsiasi valore significativo per il proprio sistema — `scheduler`, `github-actions`, `rabbitmq`, ecc.

## Correlati

- [Execution Tokens](./execution-tokens.md) – JWT con ambito limitato per richiamare i workflow da sistemi esterni
- [SSE Streaming](./sse-streaming.md) – Trasmettere gli eventi dei nodi in tempo reale tramite Server-Sent Events
- [Triggers](./triggers.md) – Tutti i punti di ingresso del workflow, incluso webhook
- [Workflow Structure](./workflow-structure.md) – Nodi e archi
- [Expression DSL](./expression-dsl.md) – Accedere a `$input.body`, `$input.headers`, `$input.query`
