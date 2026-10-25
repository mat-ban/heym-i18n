# Webhooks

Els Workflows es poden activar mitjançant webhooks HTTP. L'endpoint d'execució estàndard retorna JSON, i la variant de streaming retorna Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Substituïu `{workflow_id}` pel UUID del workflow. La URL base és la vostra instància de Heym (per exemple, `https://app.heym.ai`).

## Mètode de la sol·licitud

Cada workflow accepta un verb HTTP, triat al diàleg cURL de l'editor: `GET`, `POST`, `PUT` o `DELETE`. **`POST` és el valor per defecte**, i tots els workflows creats abans que existís aquesta configuració el mantenen, de manera que res del que funciona actualment canvia.

Cridar un workflow amb un verb diferent retorna `405 Method Not Allowed` amb una capçalera `Allow` que indica el verb configurat:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Una excepció: les sol·licituds que porten `?test_run=true` ometen la comprovació. És el que envien el botó **Run** de l'editor i el panell de depuració, de manera que un workflow configurat com a `GET` continua sent provable des de dins del producte.

### Mètodes sense cos

`GET` i `DELETE` no porten cos de sol·licitud. Les entrades provenen de la cadena de consulta i es llegeixen amb `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

El diàleg cURL amaga l'editor del cos de la sol·licitud i elimina la capçalera `Content-Type` per a aquests dos mètodes.

Combineu `GET` amb un [HTML output mapper](../nodes/html-output-mapper-node.md) per servir una pàgina que un navegador pugui obrir directament.

## Endpoint de streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilitzeu l'endpoint de streaming quan vulgueu esdeveniments d'execució incrementals en lloc d'una única resposta JSON. Consulteu [SSE Streaming](./sse-streaming.md) per al protocol d'esdeveniments i la configuració del missatge d'inici per Node.

## Format de la sol·licitud

El cos de la sol·licitud es passa com a `body` als Nodes [Input](../nodes/input-node.md). Heym accepta ambdues formes de sol·licitud:

- **JSON en cru** – per exemple, `{"userId": "123", "action": "create"}`
- **Format embolcallat** – `{"inputs": {...}, "test_run": false}`

Quan s'utilitza el format embolcallat, `inputs` s'extreu i es passa com a `body`. `test_run` omet la limitació de velocitat i la memòria cau de respostes. També podeu enviar `?test_run=true` com a paràmetre de consulta quan publiqueu JSON en cru.

## Modes del cos de la sol·licitud

Cada workflow té una configuració `webhook_body_mode` que controla com l'editor construeix les sol·licituds d'exemple:

| Mode | Comportament |
|------|----------|
| **defined** | L'editor i el diàleg cURL donen forma al cos d'exemple a partir dels camps del Node Input del workflow i mantenen les claus buides al payload JSON. Els payloads cURL existents d'estil definit continuen funcionant. |
| **generic** | L'editor i el diàleg cURL utilitzen un cos JSON de forma lliure. El cos de la sol·licitud es passa tal qual, de manera que les aplicacions externes poden enviar la seva pròpia forma de payload fixa. |

L'API d'execució es manté compatible enrere en ambdós modes. Les sol·licituds de JSON en cru i les embolcallades `{ "inputs": ... }` encara s'accepten en tots dos casos.

Les capçaleres i els paràmetres de consulta estan disponibles a les expressions com a `$input.headers` i `$input.query`. Les claus de les capçaleres es converteixen a minúscules.

## Autenticació

Es configura per workflow a l'editor (configuració del workflow). L'autenticació es comprova abans de l'execució.

| auth_type | Comportament |
|-----------|----------|
| **anonymous** | No requereix autenticació. Qualsevol pot cridar l'endpoint. |
| **jwt** | Requereix un Bearer token. Accepta tant un token de sessió d'usuari (l'usuari ha de tenir accés al workflow) com un [Execution Token](./execution-tokens.md) amb abast creat per a aquest workflow. |
| **header_auth** | Una capçalera personalitzada ha de coincidir. Configureu `auth_header_key` (per exemple, `X-API-Key`) i `auth_header_value`. |

Per a `header_auth`, el valor de la capçalera de la sol·licitud ha de coincidir exactament amb el valor configurat. Els usuaris JWT amb accés al workflow també poden cridar sense la capçalera personalitzada.

Per a `jwt`, els [Execution Tokens](./execution-tokens.md) són la manera recomanada de cridar workflows des de sistemes externs — tenen abast a un únic workflow i es poden revocar de manera independent.

## Memòria cau de respostes

Configureu `cache_ttl_seconds` per workflow. Quan està definit i és més gran que 0:

- **Clau de la memòria cau**: hash SHA256 de `workflow_id` + `body` + `query`
- **Encert de la memòria cau**: Retorna immediatament amb `status: "cached"` i les sortides emmagatzemades
- **Establiment de la memòria cau**: Només després d'una execució correcta (`status: "success"`)
- **Emmagatzematge**: Amb suport de Postgres i compartit entre els workers del backend

| Configuració | Efecte |
|---------|--------|
| `cache_ttl_seconds` = 0 o null | Memòria cau desactivada |
| `cache_ttl_seconds` > 0 | Respostes emmagatzemades durant aquest nombre de segons |

Les sol·licituds `test_run` ometen la memòria cau (sense lectura ni escriptura).

Quan la memòria cau de respostes està activada al diàleg cURL, **Clear cache** expulsa immediatament les respostes emmagatzemades del workflow actual.

## Limitació de velocitat

Es configura per workflow: `rate_limit_requests` i `rate_limit_window_seconds`.

- **Abast**: Per `workflow_id` + IP del client (finestra lliscant)
- **Superat**: HTTP 429 amb capçalera `Retry-After`
- **Capçaleres**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Configuració | Descripció |
|---------|-------------|
| `rate_limit_requests` | Nombre màxim de sol·licituds permeses a la finestra |
| `rate_limit_window_seconds` | Durada de la finestra en segons |

Les sol·licituds `test_run` ometen la limitació de velocitat.
<a id="concurrency-limit-and-queued-runs"></a>

## Límit de concurrència i execucions en cua

Un workflow pot limitar quantes execucions de producció s'executen alhora. Activeu **Límit de concurrència** al panell **Properties** a nivell de workflow i configureu **Execucions simultànies màx**. Els propietaris i col·laboradors amb permís d'edició poden modificar-ho. El límit està desactivat per defecte.

Mentre s'arriba al límit, les noves execucions esperen en una cua FIFO (primer a entrar, primer a sortir). Això cobreix tots els punts d'entrada de producció: aquest endpoint, l'[endpoint de streaming](./sse-streaming.md), el [Portal](./portal.md), el [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) i cada [trigger](./triggers.md). Les execucions de prova del propi editor sempre s'inicien immediatament i no consumeixen un slot. Enviar `test_run=true` sense una sessió iniciada que pugui obrir el workflow no omet la cua.

| Configuració | Descripció |
|---|---|
| `concurrency_limit` | Execucions de producció permeses alhora. `0` desactiva el límit |
| `concurrency_max_queue` | Opcional. Execucions autoritzades a esperar alhora. Buit significa sense límit |
| `concurrency_max_wait_seconds` | Opcional. Una execució que espera més temps es registra com a `expired`. Buit significa que espera tot el temps necessari |

### 202 Accepted

Una crida que s'inicia immediatament es comporta exactament com es descriu a Format de la resposta. Una crida que ha d'esperar rep `202 Accepted` immediatament, sigui quin sigui el valor de `X-Simple-Response`, amb una capçalera `Location` que apunta al seu URL d'estat:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Camp | Descripció |
|---|---|
| `queue.position` | Lloc d'aquesta execució a la cua, començant a 1 |
| `queue.size` | Execucions esperant en aquest moment |
| `queue.running` | Execucions que ocupen un slot en aquest moment |
| `queue.limit` | Límit de concurrència del workflow |
| `status_token` | Només per a workflows anònims. Es retorna un sol cop, en aquesta resposta |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` respon amb l'estat de l'execució. Crideu-lo amb les mateixes credencials que han iniciat l'execució: una sessió o JWT, un [token d'execució](./execution-tokens.md) o la capçalera personalitzada del workflow. Un workflow anònim no té credencials per verificar; envieu el `status_token` del 202 a la capçalera `X-Heym-Run-Token`. El token no es llegeix mai de la query string. Un token incorrecte o absent rep `404`, igual que una execució desconeguda.

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

| `status` | Significat (una execució que ha d'esperar per un slot de concurrència rep la [resposta 202](#202-accepted) en el seu lloc) |
|---|---|
| `queued` | Esperant un slot; `queue` indica la seva posició |
| `running` | Disposa d'un slot i s'està executant |
| `success` / `error` | Finalitzat; `outputs` i `error` estan emplenats |
| `pending` | En pausa per a [revisió humana](./human-in-the-loop.md) |
| `cancelled` | Cancel·lat des de l'[Historial d'execucions](./execution-history.md) |
| `expired` | Ha esperat més de `concurrency_max_wait_seconds` i mai no s'ha executat |

Consulteu cada pocs segons fins que l'estat no sigui `queued` ni `running`. Una execució en cua s'executa encara que ningú faci sondeig.

### Cua plena

Quan `concurrency_max_queue` està establert i ja hi ha aquest nombre d'execucions esperant, la crida és rebutjada amb `429 Concurrency queue is full` i una entrada `queue_full` a l'historial d'execucions. No s'afegeix res a la cua.

## Format de la resposta

L'endpoint retorna JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Camp | Descripció |
|-------|-------------|
| `workflow_id` | UUID del Workflow |
| `status` | `success`, `error`, `cached` o `rate_limited` |
| `outputs` | Sortides dels Nodes terminals. Amb un únic [JSON output mapper](../nodes/json-output-mapper-node.md) com a únic terminal, el cos de la resposta és aquest objecte mapejat al nivell superior (respostes JSON simples per defecte). En cas contrari, inclou [Output](../nodes/output-node.md) i altres terminals indexats per etiqueta. |
| `execution_time_ms` | Temps d'execució en mil·lisegons (0 per a cached/rate_limited) |

En cas d'error, `outputs` pot contenir detalls de l'error. Un Node [Throw Error](../nodes/throw-error-node.md) pot establir un codi d'estat HTTP personalitzat (4xx/5xx).

## Diàleg Run with cURL

El botó de la barra d'eines **Run with cURL** (a la part superior dreta de l'editor, icona `cURL`) obre un diàleg que construeix i copia una comanda cURL a punt per executar per al Workflow actual.

### Què fa

| Camp | Descripció |
|-------|-------------|
| **Request Body Mode** | Trieu **Defined** o **Generic**. Generic manté el cos com a JSON en brut en lloc de donar-li forma a partir dels camps d'Input. |
| **Authentication** | Trieu Anonymous, JWT Token o Header Auth. Estableix la capçalera d'autenticació correcta a la comanda. Quan se selecciona JWT Token, el diàleg mostra un gestor d'[Execution Token](./execution-tokens.md) — creeu o seleccioneu un Token per incrustar-lo directament a la comanda. |
| **Header Key / Value** | Visible quan se selecciona Header Auth. Preomplert a partir de la configuració d'autenticació del Workflow. |
| **Response Cache** | Minuts per emmagatzemar en caché respostes idèntiques (0 = desactivat). Els canvis es desen al Workflow. Quan està activat, **Clear cache** expulsa les respostes en caché immediatament. |
| **Rate Limit** | Nombre màxim de sol·licituds per finestra de temps. Els canvis es desen al Workflow. |
| **SSE Streaming** | Canvia la comanda a `/execute/stream`, afegeix `--no-buffer` i exposa la configuració del missatge `node_start` per Node. |
| **Body** | Cos de la sol·licitud en JSON. En mode Defined es preomple a partir dels camps d'[Input](../nodes/input-node.md) i manté les claus buides. En mode Generic és un editor JSON en brut. |
| **Command** | Previsualització de només lectura de la comanda cURL completa. |

Feu clic a **Copy cURL** per copiar la comanda al porta-retalls.

### Exemple

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

En mode Generic, els payloads niats es mantenen intactes, per exemple:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

El diàleg reflecteix la configuració d'autenticació, mode de cos, caché i límit de velocitat emmagatzemada al Workflow — editar-los aquí actualitza el Workflow immediatament.

### SSE Streaming al diàleg

Activeu **SSE Streaming** quan vulgueu que la comanda generada segueixi l'execució en temps real des del vostre terminal.

- L'endpoint canvia de `/execute` a `/execute/stream`
- La comanda afegeix `--no-buffer` i `Accept: text/event-stream`
- Cada Node no sticky apareix en una llista on podeu:
  - activar o desactivar el missatge `node_start`
  - personalitzar el text del missatge d'inici
- Els esdeveniments `node_complete` sempre s'emeten i inclouen la sortida completa del Node

Exemple:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Per al protocol complet d'esdeveniments i exemples, consulteu [SSE Streaming](./sse-streaming.md).

## Etiquetatge d'origen del Trigger

Cada execució emmagatzema una etiqueta `trigger_source` visible a l'[Execution History](./execution-history.md). Establiu-la enviant la capçalera `X-Trigger-Source` amb qualsevol valor que trieu:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

El botó **Copy cURL** del diàleg de l'editor inclou `X-Trigger-Source: API` automàticament. Podeu substituir `API` per qualsevol valor significatiu — `scheduler`, `rabbitmq`, `github-actions`, etc.

Si no s'envia la capçalera, `trigger_source` pren el valor per defecte `"API"` i l'execució s'etiqueta com a **API** a l'historial. Substituïu-lo per qualsevol valor significatiu per al vostre sistema — `scheduler`, `github-actions`, `rabbitmq`, etc.

## Relacionat

- [Execution Tokens](./execution-tokens.md) – JWT amb abast per cridar Workflows des de sistemes externs
- [SSE Streaming](./sse-streaming.md) – Transmetre esdeveniments de Nodes en temps real mitjançant Server-Sent Events
- [Triggers](./triggers.md) – Tots els punts d'entrada del Workflow, inclòs el Webhook
- [Workflow Structure](./workflow-structure.md) – Nodes i arestes
- [Expression DSL](./expression-dsl.md) – Accedir a `$input.body`, `$input.headers`, `$input.query`
