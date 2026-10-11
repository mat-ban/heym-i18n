# SSE Streaming

Los Workflows pueden transmitir eventos de ejecución en tiempo real con Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Este endpoint utiliza las mismas reglas de autenticación a nivel de workflow, limitación de velocidad y caché de respuestas que el endpoint de ejecución estándar documentado en [Webhooks](./webhooks.md).

## Habilitar SSE en el diálogo de cURL

Abra el diálogo **Run with cURL** en el editor y habilite **SSE Streaming**.

Cuando está habilitado, Heym:

- cambia el comando generado de `/execute` a `/execute/stream`
- añade `--no-buffer` para que los eventos transmitidos aparezcan inmediatamente en la salida de la terminal
- añade `Accept: text/event-stream`
- permite configurar mensajes `node_start` por nodo directamente en el diálogo

## Protocolo de eventos

Cada trama SSE es JSON delimitado por saltos de línea con el prefijo `data: `.

| Tipo de evento | Cuándo se emite | Campos clave |
|------------|--------------------|------------|
| `execution_started` | Inmediatamente después de que se acepta la solicitud | `execution_id`, `server_now_ms` |
| `node_start` | Justo antes de que un nodo comience su ejecución | `node_id`, `node_label`, `started_at_ms`, `message` opcional |
| `node_retry` | Cuando un nodo reintenta | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Después de que un nodo finaliza | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Cuando un Nodo Output retorna anticipadamente | `node_label`, `output` |
| `execution_complete` | Después de que el workflow finaliza | `status`, `outputs`, `execution_time_ms` |

## Mensajes de inicio por Nodo

El diálogo de cURL almacena la configuración de SSE en el propio workflow:

- **Send start** controla si un evento `node_start` incluye un `message`
- **Start message** tiene como valor predeterminado `[START] {nodeLabel}`
- al borrar un mensaje personalizado, se vuelve al texto predeterminado
- `node_complete` siempre se emite y siempre incluye la salida del nodo

Ejemplo de configuración almacenada:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Ejemplo de cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Ejemplo de flujo de eventos:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Notas de seguridad

- los workflows `anonymous`, `jwt` y `header_auth` se comportan igual que el endpoint de webhook habitual
- el almacenamiento en caché de respuestas sigue aplicándose cuando `cache_ttl_seconds` está configurado
- los límites de velocidad del workflow siguen aplicándose cuando `rate_limit_requests` y `rate_limit_window_seconds` están configurados
- `test_run` omite tanto la caché como la limitación de velocidad, del mismo modo que lo hace para `/execute`

## Relacionado

- [Webhooks](./webhooks.md) – Endpoint de ejecución estándar y diálogo de cURL
- [Parallel Execution](./parallel-execution.md) – Cómo encaja el streaming en el planificador DAG de Heym
- [Canvas Features](./canvas-features.md) – Controles del editor, incluido Run with cURL
- [Security](./security.md) – Autenticación y gestión de secretos