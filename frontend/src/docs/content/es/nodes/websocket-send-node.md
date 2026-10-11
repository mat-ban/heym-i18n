# WebSocket Send

El nodo **WebSocket Send** abre una conexión de cliente saliente hacia un servidor WebSocket externo, envía un mensaje y cierra la conexión. Úselo cuando un workflow necesite enviar eventos a un sistema en tiempo real sin exponer un endpoint de socket propiedad de Heym.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL externa `ws://` o `wss://` |
| `websocketHeaders` | JSON object string / expression | Encabezados de handshake opcionales |
| `websocketSubprotocols` | string | Lista opcional de subprotocolos separados por comas |
| `websocketMessage` | expression | Payload a enviar |

## Reglas de serialización de mensajes

- Si `websocketMessage` se resuelve como una **string**, Heym envía un frame de texto.
- Si se resuelve como un **object**, **array**, **number**, **boolean** o `null`, Heym lo serializa como texto JSON.
- Si se resuelve como **bytes**, Heym envía un frame binario.
- Las expresiones completas como `$input` conservan los tipos nativos antes de la serialización.

## Campos de salida

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en caso de éxito |
| `$nodeLabel.url` | URL de destino resuelta |
| `$nodeLabel.message_type` | `text`, `json` o `binary` |
| `$nodeLabel.size_bytes` | Tamaño del payload en bytes |
| `$nodeLabel.subprotocol` | Subprotocolo negociado cuando está presente |
| `$nodeLabel.sent_at` | Marca de tiempo ISO |

## Workflow de ejemplo

**Solicitud HTTP → transformación → publicación mediante WebSocket**

```
input → set → websocketSend → output
```

- **Set** crea un objeto payload como `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** utiliza `$payloadNode` como `websocketMessage`
- **Output** puede devolver `$socketSend.status`

## JSON de nodo de ejemplo

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Notas

- No se requiere ninguna [credencial](../reference/credentials.md) para este nodo.
- Si el servidor remoto espera encabezados de autenticación o de tenant, páselos mediante `websocketHeaders`.
- Utilice [HTTP](./http-node.md) cuando el sistema remoto esté basado en solicitud/respuesta en lugar de sockets.

## Seguridad de egreso

- De forma predeterminada, la URL debe usar `ws://` o `wss://` y resolverse únicamente a direcciones públicas. Los destinos de loopback, privados, link-local, multicast y de metadatos en la nube están bloqueados.
- Heym valida cada dirección resuelta y se conecta directamente a una de esas direcciones. Los proxies del entorno y las redirecciones de WebSocket se deshabilitan mientras el guard esté activo.
- Se admiten los encabezados `Authorization`, `Origin`, `User-Agent` y encabezados de datos personalizados. `Origin` se envía a través de la opción dedicada del cliente WebSocket. Los encabezados `Host`, `Connection`, `Upgrade` y `Sec-WebSocket-*` no se pueden sobrescribir.
- Las implementaciones autoalojadas de confianza que se conecten intencionalmente a servicios internos pueden establecer `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenga el valor predeterminado en implementaciones alojadas o multiinquilino.

**Nota de actualización para v0.0.105:** esta política de alcance de instancia ahora también protege los destinos derivados de credenciales utilizados por Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, la ejecución personalizada de LLM y el descubrimiento de modelos, el asistente de IA, los guardrails y los embeddings de RAG. Las credenciales existentes que apunten a direcciones de loopback, privadas o link-local se rechazan a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esté habilitado en una instancia autoalojada de confianza. Mientras el guard esté activo, los clientes HTTP protegidos ignoran `HTTP_PROXY` y `HTTPS_PROXY`; habilitar la exclusión voluntaria los restaura. Los paquetes de CA del operador configurados mediante `SSL_CERT_FILE` o `SSL_CERT_DIR` siguen siendo compatibles. ClickHouse se verifica antes de que se abra la conexión, pero no se fija en el momento del dial, porque clickhouse-connect aporta su propio transporte urllib3.

## Relacionado

- [WebSocket Trigger](./websocket-trigger-node.md) – Escuche un socket externo y active workflows ante eventos
- [Tipos de nodo](../reference/node-types.md) – Descripción general de los nodos de integración
- [Expression DSL](../reference/expression-dsl.md) – Cree payloads JSON dinámicos
- [Integraciones de terceros](../reference/integrations.md) – Integraciones respaldadas por credenciales frente a configuraciones directas