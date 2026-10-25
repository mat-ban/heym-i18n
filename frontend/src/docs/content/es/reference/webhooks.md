# Webhooks

Los Workflows pueden activarse mediante webhooks HTTP. El endpoint de ejecución estándar devuelve JSON, y la variante de streaming devuelve Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Reemplace `{workflow_id}` con el UUID del workflow. La URL base es su instancia de Heym (por ejemplo, `https://app.heym.ai`).

## Método de la solicitud

Cada workflow acepta un verbo HTTP, elegido en el diálogo cURL del editor: `GET`, `POST`, `PUT` o `DELETE`. **`POST` es el predeterminado**, y todo workflow creado antes de que existiera esta configuración lo conserva, por lo que nada de lo que funciona actualmente cambia.

Llamar a un workflow con un verbo distinto devuelve `405 Method Not Allowed` con una cabecera `Allow` que indica el configurado:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Una excepción: las solicitudes que incluyen `?test_run=true` omiten la comprobación. Eso es lo que envían el botón **Run** del editor y el panel de depuración, por lo que un workflow configurado como `GET` sigue siendo testeable desde dentro del producto.

### Métodos sin cuerpo

`GET` y `DELETE` no llevan cuerpo de solicitud. Las entradas provienen de la cadena de consulta y se leen con `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

El diálogo cURL oculta el editor del cuerpo de la solicitud y elimina la cabecera `Content-Type` para estos dos métodos.

Combine `GET` con un [HTML output mapper](../nodes/html-output-mapper-node.md) para servir una página que un navegador pueda abrir directamente.

## Endpoint de streaming

`POST /api/workflows/{workflow_id}/execute/stream`

Utilice el endpoint de streaming cuando desee eventos de ejecución incrementales en lugar de una única respuesta JSON. Consulte [SSE Streaming](./sse-streaming.md) para el protocolo de eventos y la configuración del mensaje de inicio por nodo.

## Formato de la solicitud

El cuerpo de la solicitud se pasa como `body` a los nodos [Input](../nodes/input-node.md). Heym acepta ambas formas de solicitud:

- **JSON sin formato** – por ejemplo, `{"userId": "123", "action": "create"}`
- **Formato envuelto** – `{"inputs": {...}, "test_run": false}`

Al utilizar el formato envuelto, `inputs` se extrae y se pasa como `body`. `test_run` omite el rate limiting y la caché de respuestas. También puede enviar `?test_run=true` como parámetro de consulta al publicar JSON sin formato.

## Modos del cuerpo de la solicitud

Cada workflow tiene una configuración `webhook_body_mode` que controla cómo el editor construye las solicitudes de ejemplo:

| Modo | Comportamiento |
|------|----------|
| **defined** | El editor y el diálogo cURL dan forma al cuerpo de ejemplo a partir de los campos del nodo Input del workflow y mantienen las claves vacías en el payload JSON. Los payloads cURL existentes de estilo defined siguen funcionando. |
| **generic** | El editor y el diálogo cURL utilizan un cuerpo JSON de forma libre. El cuerpo de la solicitud se pasa tal cual, de modo que las aplicaciones externas pueden enviar su propia forma de payload fija. |

La API de ejecución permanece retrocompatible en ambos modos. Las solicitudes con JSON sin formato y con el formato envuelto `{ "inputs": ... }` se siguen aceptando en cualquiera de los dos casos.

Las cabeceras y los parámetros de consulta están disponibles en las expresiones como `$input.headers` y `$input.query`. Las claves de las cabeceras se convierten a minúsculas.

## Autenticación

Se configura por workflow en el editor (configuración del workflow). La autenticación se comprueba antes de la ejecución.

| auth_type | Comportamiento |
|-----------|----------|
| **anonymous** | No se requiere autenticación. Cualquiera puede llamar al endpoint. |
| **jwt** | Se requiere Bearer token. Acepta tanto un token de sesión de usuario (el usuario debe tener acceso al workflow) como un [Execution Token](./execution-tokens.md) con alcance creado para este workflow. |
| **header_auth** | Una cabecera personalizada debe coincidir. Configure `auth_header_key` (por ejemplo, `X-API-Key`) y `auth_header_value`. |

Para `header_auth`, el valor de la cabecera de la solicitud debe coincidir exactamente con el valor configurado. Los usuarios JWT con acceso al workflow también pueden llamar sin la cabecera personalizada.

Para `jwt`, los [Execution Tokens](./execution-tokens.md) son la forma recomendada de llamar a workflows desde sistemas externos: tienen alcance a un único workflow y pueden revocarse de forma independiente.

## Caché de respuestas

Configure `cache_ttl_seconds` por workflow. Cuando se establece y es mayor que 0:

- **Clave de caché**: hash SHA256 de `workflow_id` + `body` + `query`
- **Acierto de caché**: devuelve inmediatamente con `status: "cached"` y las salidas en caché
- **Establecimiento de caché**: solo tras una ejecución correcta (`status: "success"`)
- **Almacenamiento**: respaldado por Postgres y compartido entre los workers del backend

| Configuración | Efecto |
|---------|--------|
| `cache_ttl_seconds` = 0 o null | Caché deshabilitada |
| `cache_ttl_seconds` > 0 | Las respuestas se almacenan en caché durante este número de segundos |

Las solicitudes con `test_run` omiten la caché (sin lectura, sin escritura).

Cuando la caché de respuestas está habilitada en el diálogo cURL, **Clear cache** desaloja inmediatamente las respuestas en caché del workflow actual.

## Rate Limiting

Configure por workflow: `rate_limit_requests` y `rate_limit_window_seconds`.

- **Alcance**: por `workflow_id` + IP del cliente (ventana deslizante)
- **Excedido**: HTTP 429 con cabecera `Retry-After`
- **Cabeceras**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Configuración | Descripción |
|---------|-------------|
| `rate_limit_requests` | Máximo de solicitudes permitidas en la ventana |
| `rate_limit_window_seconds` | Duración de la ventana en segundos |

Las solicitudes con `test_run` omiten el rate limiting.

<a id="concurrency-limit-and-queued-runs"></a>

## Límite de concurrencia y ejecuciones en cola

Un workflow puede limitar cuántas ejecuciones de producción se ejecutan al mismo tiempo. Active **Límite de concurrencia** en el panel **Properties** a nivel de workflow y configure **Ejecuciones simultáneas máx**. Los propietarios y colaboradores con permisos de edición pueden modificarlo. El límite está desactivado de forma predeterminada.

Mientras se alcance el límite, las nuevas ejecuciones esperan en una cola FIFO (primeras en entrar, primeras en salir). Esto cubre todos los puntos de entrada de producción: este endpoint, el [endpoint de streaming](./sse-streaming.md), el [Portal](./portal.md), el [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) y cada [trigger](./triggers.md). Las ejecuciones de prueba del propio editor siempre se inician de inmediato y no ocupan un slot. Enviar `test_run=true` sin una sesión iniciada que pueda abrir el workflow no omite la cola.

| Configuración | Descripción |
|---|---|
| `concurrency_limit` | Ejecuciones de producción permitidas a la vez. `0` desactiva el límite |
| `concurrency_max_queue` | Opcional. Ejecuciones a las que se les permite esperar a la vez. Vacío significa sin límite |
| `concurrency_max_wait_seconds` | Opcional. Una ejecución que espera más tiempo se registra como `expired`. Vacío significa que espera todo el tiempo necesario |

### 202 Accepted

Una llamada que comienza de inmediato se comporta exactamente como se describe en Formato de respuesta. Una llamada que debe esperar recibe `202 Accepted` de inmediato, sin importar lo que indique `X-Simple-Response`, con un encabezado `Location` que apunta a su URL de estado:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Campo | Descripción |
|---|---|
| `queue.position` | Lugar de esta ejecución en la fila, comenzando en 1 |
| `queue.size` | Ejecuciones esperando en este momento |
| `queue.running` | Ejecuciones que ocupan un slot en este momento |
| `queue.limit` | Límite de concurrencia del workflow |
| `status_token` | Solo workflows anónimos. Devuelto una sola vez, en esta respuesta |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` responde con el estado de la ejecución. Llámelo con las mismas credenciales que iniciaron la ejecución: una sesión o JWT, un [token de ejecución](./execution-tokens.md) o el encabezado personalizado del workflow. Un workflow anónimo no tiene credenciales que verificar, así que envíe el `status_token` del 202 en el encabezado `X-Heym-Run-Token`. El token nunca se lee desde la query string. Un token incorrecto o faltante recibe `404`, al igual que una ejecución desconocida.

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

| `status` | Significado (una ejecución que debe esperar un slot de concurrencia recibe la [respuesta 202](#202-accepted) en su lugar) |
|---|---|
| `queued` | Esperando un slot; `queue` muestra su posición |
| `running` | Tiene un slot y se está ejecutando |
| `success` / `error` | Finalizado; `outputs` y `error` están completados |
| `pending` | Pausado para [revisión humana](./human-in-the-loop.md) |
| `cancelled` | Cancelado desde el [Historial de ejecuciones](./execution-history.md) |
| `expired` | Esperó más tiempo que `concurrency_max_wait_seconds` y nunca se ejecutó |

Consulte cada pocos segundos hasta que el estado no sea `queued` ni `running`. Una ejecución en cola se ejecuta incluso si nadie sondea.

### Cola llena

Cuando se establece `concurrency_max_queue` y ya hay tantas ejecuciones esperando, la llamada es rechazada con `429 Concurrency queue is full` y una entrada `queue_full` en el historial de ejecuciones. No se añade nada a la cola.

## Formato de respuesta

El endpoint devuelve JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Campo | Descripción |
|-------|-------------|
| `workflow_id` | UUID del Workflow |
| `status` | `success`, `error`, `cached` o `rate_limited` |
| `outputs` | Salidas de los nodos terminales. Cuando el único terminal es un [mapeador de salida JSON](../nodes/json-output-mapper-node.md), el cuerpo de la respuesta es ese objeto mapeado en el nivel superior (respuestas JSON simples por defecto). En caso contrario, incluye el nodo [Output](../nodes/output-node.md) y otros terminales indexados por su etiqueta. |
| `execution_time_ms` | Tiempo de ejecución en milisegundos (0 para `cached`/`rate_limited`) |

En caso de error, `outputs` puede contener detalles del error. Un nodo [Throw Error](../nodes/throw-error-node.md) puede establecer un código de estado HTTP personalizado (4xx/5xx).

## Diálogo Run with cURL

El botón **Run with cURL** de la barra de herramientas (esquina superior derecha del editor, icono `cURL`) abre un diálogo que genera y copia un comando cURL listo para ejecutar correspondiente al workflow actual.

### Qué hace

| Campo | Descripción |
|-------|-------------|
| **Request Body Mode** | Seleccione **Defined** o **Generic**. Generic mantiene el cuerpo como JSON sin procesar en lugar de construirlo a partir de los campos de Input. |
| **Authentication** | Seleccione Anonymous, JWT Token o Header Auth. Establece la cabecera de autenticación correcta en el comando. Cuando se selecciona JWT Token, el diálogo muestra un gestor de [Execution Token](./execution-tokens.md): cree o seleccione un token para incrustarlo directamente en el comando. |
| **Header Key / Value** | Visible cuando se selecciona Header Auth. Se rellena previamente desde la configuración de autenticación del workflow. |
| **Response Cache** | Minutos durante los que se almacenan en caché respuestas idénticas (0 = deshabilitado). Los cambios se guardan en el workflow. Cuando está habilitado, **Clear cache** expulsa inmediatamente las respuestas en caché. |
| **Rate Limit** | Número máximo de solicitudes por ventana de tiempo. Los cambios se guardan en el workflow. |
| **SSE Streaming** | Cambia el comando a `/execute/stream`, añade `--no-buffer` y expone la configuración del mensaje `node_start` por nodo. |
| **Body** | Cuerpo JSON de la solicitud. En modo Defined se rellena previamente desde los campos de [Input](../nodes/input-node.md) y conserva las claves vacías. En modo Generic es un editor JSON sin procesar. |
| **Command** | Vista previa de solo lectura del comando cURL completo. |

Haga clic en **Copy cURL** para copiar el comando al portapapeles.

### Ejemplo

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

En modo Generic, los payloads anidados se mantienen intactos, por ejemplo:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

El diálogo refleja la configuración de autenticación, modo de cuerpo, caché y límite de tasa almacenada en el workflow: editarla aquí actualiza el workflow de inmediato.

### SSE Streaming en el diálogo

Habilite **SSE Streaming** cuando desee que el comando generado siga la ejecución en tiempo real desde su terminal.

- El endpoint cambia de `/execute` a `/execute/stream`
- El comando añade `--no-buffer` y `Accept: text/event-stream`
- Cada nodo no sticky aparece en una lista donde puede:
  - habilitar o deshabilitar el mensaje `node_start`
  - personalizar el texto del mensaje de inicio
- Los eventos `node_complete` siempre se emiten e incluyen la salida completa del nodo

Ejemplo:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Para consultar el protocolo completo de eventos y ejemplos, consulte [SSE Streaming](./sse-streaming.md).

## Etiquetado del origen del Trigger

Cada ejecución almacena una etiqueta `trigger_source` visible en el [Historial de ejecuciones](./execution-history.md). Establézcala enviando la cabecera `X-Trigger-Source` con el valor que elija:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

El botón **Copy cURL** del diálogo del editor incluye `X-Trigger-Source: API` automáticamente. Puede reemplazar `API` por cualquier valor significativo: `scheduler`, `rabbitmq`, `github-actions`, etc.

Si no se envía la cabecera, `trigger_source` toma el valor predeterminado `"API"` y la ejecución se etiqueta como **API** en el historial. Sobrescríbala con cualquier valor significativo para su sistema: `scheduler`, `github-actions`, `rabbitmq`, etc.

## Relacionado

- [Execution Tokens](./execution-tokens.md) – JWT con alcance para invocar workflows desde sistemas externos
- [SSE Streaming](./sse-streaming.md) – Transmita eventos de nodos en tiempo real mediante Server-Sent Events
- [Triggers](./triggers.md) – Todos los puntos de entrada del workflow, incluido webhook
- [Workflow Structure](./workflow-structure.md) – Nodos y aristas
- [Expression DSL](./expression-dsl.md) – Acceso a `$input.body`, `$input.headers`, `$input.query`
