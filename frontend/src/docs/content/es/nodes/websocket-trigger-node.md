# WebSocket Trigger

El nodo **WebSocket Trigger** abre una conexión de cliente saliente hacia un servidor WebSocket externo e inicia el workflow cuando ocurren los eventos de socket seleccionados. Úselo para flujos de eventos como feeds de mercado, telemetría o backplanes de chat. La conexión a sistemas internos en tiempo real requiere la desactivación de la restricción de URL privadas que se describe a continuación.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportamiento importante

- Este nodo se conecta **desde Heym hacia otro servidor WebSocket**.
- **No** expone un endpoint WebSocket en Heym.
- No se requiere ninguna [credencial](../reference/credentials.md). Configure la URL, los headers y los subprotocolos directamente en el nodo.
- El worker líder mantiene la conexión abierta en segundo plano y se reconecta cuando está habilitado.

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `websocketUrl` | string | URL externa `ws://` o `wss://` |
| `websocketHeaders` | JSON object string | Headers de handshake opcionales |
| `websocketSubprotocols` | string | Lista opcional de subprotocolos separados por comas |
| `websocketTriggerEvents` | array | Cualquiera de `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Reconectar tras una desconexión |
| `retryWaitSeconds` | integer | Retardo antes de reconectar |

## Eventos emitidos

### `onMessage`

Se dispara cuando llega un frame desde el socket remoto.

Campos útiles:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON parseado o valor del mensaje en bruto |
| `$nodeLabel.message.text` | Texto decodificado en UTF-8 cuando está disponible |
| `$nodeLabel.message.base64` | Payload binario en base64 |
| `$nodeLabel.message.sizeBytes` | Tamaño del payload |
| `$nodeLabel.message.isJson` | Indica si el mensaje se parseó como JSON |

### `onConnected`

Se dispara después de que el socket se abre correctamente.

Campos útiles:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` en la primera conexión, `true` en reconexiones posteriores |
| `$nodeLabel.connection.subprotocol` | Subprotocolo negociado |

### `onClosed`

Se dispara cuando se cierra una conexión establecida.

Campos útiles:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` o `unknown` |
| `$nodeLabel.close.code` | Código de cierre de WebSocket |
| `$nodeLabel.close.reason` | Motivo del cierre |
| `$nodeLabel.close.wasClean` | `true` para un cierre normal `1000` |
| `$nodeLabel.close.reconnecting` | Indica si el nodo intentará reconectarse |

## Semántica del Trigger

- Un nodo activo mantiene una única conexión de socket saliente de larga duración.
- La conexión se ejecuta únicamente en el worker líder, de forma similar al modo de recepción de [IMAP Trigger](./imap-trigger-node.md) y [RabbitMQ](./rabbitmq-node.md).
- Si la reconexión está habilitada, Heym espera `retryWaitSeconds` y abre el socket de nuevo tras una caída.
- Cada evento emitido crea una ejecución de workflow independiente con `trigger_source = "websocket"`.

## Seguridad de egreso

- De forma predeterminada, la URL debe usar `ws://` o `wss://` y resolverse únicamente a direcciones públicas. Los destinos de loopback, privados, link-local, multicast y de metadatos en la nube están bloqueados.
- Heym revalida el DNS en cada reconexión, valida cada dirección resuelta y se conecta directamente a una de esas direcciones. Los proxies del entorno y las redirecciones de WebSocket se deshabilitan mientras el guard está activo.
- Las violaciones de política permanentes detienen el trigger en lugar de reintentar indefinidamente. Los fallos temporales de DNS o de red siguen las configuraciones de reintento del nodo.
- Se admiten los headers `Authorization`, `Origin`, `User-Agent` y headers de datos personalizados. `Origin` se envía a través de la opción dedicada del cliente WebSocket. Los headers `Host`, `Connection`, `Upgrade` y `Sec-WebSocket-*` no se pueden sobrescribir.
- Los despliegues autoalojados de confianza que se conectan intencionalmente a servicios internos pueden establecer `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenga el valor predeterminado en despliegues alojados o multiinquilino.

**Nota de actualización para v0.0.105:** esta política a nivel de instancia ahora también protege los destinos derivados de credenciales utilizados por Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, la ejecución personalizada de LLM y el descubrimiento de modelos, el asistente de IA, los guardrails y los embeddings de RAG. Las credenciales existentes que apuntan a direcciones de loopback, privadas o link-local se rechazan a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esté habilitado en una instancia autoalojada de confianza. Mientras el guard está activo, los clientes HTTP protegidos ignoran `HTTP_PROXY` y `HTTPS_PROXY`; habilitar la desactivación de la restricción los restaura. Los bundles de CA del operador configurados mediante `SSL_CERT_FILE` o `SSL_CERT_DIR` siguen siendo compatibles. ClickHouse se verifica antes de que se abra la conexión, pero no se fija en el momento del dial, porque clickhouse-connect trae su propio transporte urllib3.
## Workflow de ejemplo

**Flujo de eventos externos → filtro → notificación**

```
websocketTrigger → condition → slack
```

- Etiqueta del **WebSocket Trigger**: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- Mensaje de **Slack**: `"Realtime alert: $streamEvent.message.data.title"`

## JSON de Nodo de ejemplo

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Relacionado

- [Triggers](../reference/triggers.md) – Arquitectura de trigger en segundo plano y `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Envíe datos a un socket externo desde un paso del workflow
- [Tipos de Nodo](../reference/node-types.md) – Descripción general de todos los nodos
- [Integraciones de terceros](../reference/integrations.md) – Qué nodos utilizan credenciales y cuáles no
