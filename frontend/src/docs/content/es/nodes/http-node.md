# HTTP

El nodo **HTTP** realiza solicitudes HTTP utilizando la sintaxis de cURL. Puede ser un punto de inicio del workflow (sin arista entrante) o recibir entrada de nodos anteriores.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 o 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `curl` | string | Comando cURL (ej. `curl -X GET https://api.example.com`) |

## Formato de respuesta

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Acceso a la respuesta

- `$httpNode.status` – Código de estado HTTP
- `$httpNode.body` – Cuerpo de la respuesta (string o JSON analizado)
- `$httpNode.body.fieldName` – Acceso a campos JSON
- `$httpNode.headers` – Encabezados de la respuesta

## Ejemplo

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Utilice la sintaxis de cURL con `-H` para encabezados, `-d` para el cuerpo de POST, etc. Las expresiones pueden utilizarse en cualquier parte de la cadena curl, incluida la URL, un encabezado o una línea de encabezado completa. Una [credencial](../reference/credentials.md) de tipo Header se resuelve como `key: value`, por lo que `-H "$credentials.MyApiKey"` envía el encabezado completo:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Las comillas y los espacios dentro de una expresión pertenecen a la expresión, no al comando cURL, por lo que los métodos que aceptan argumentos de tipo string funcionan en línea:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autenticación con credenciales

`$credentials.Name` se resuelve en un valor diferente para cada tipo de [credencial](../reference/credentials.md), por lo que la línea de encabezado depende del tipo:

| Tipo de credencial | `$credentials.Name` se resuelve como | Encabezado |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | La clave de API sin procesar | `-H "Authorization: Bearer $credentials.Name"` |
| Google | La clave de API sin procesar | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | La clave de API sin procesar | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Un token de acceso OAuth nuevo, renovado cuando expira | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | El token | `-H "Authorization: Bearer $credentials.Name"` |

Una credencial Bearer ya incluye el prefijo `Bearer `, por lo que añadir otro envía `Bearer Bearer …`. Las credenciales de Google Sheets y Google Drive permiten llamar a las API de Google que su nodo no cubre, como añadir una pestaña a una hoja de cálculo, dentro de los alcances otorgados a la credencial. Cuando un nombre no es un identificador simple (contiene `-`, comienza con un dígito o es una palabra reservada), utilice la forma con corchetes: `-H "Authorization: $credentials["my-api-key"]"`.

Cuando el [Asistente de IA](../reference/ai-assistant.md) o el [Chat](../tabs/chat-tab.md) construye una solicitud HTTP que requiere autenticación y ningún nodo dedicado cubre el servicio, pregunta qué credencial utilizar. Seleccione una, cambie el nombre del encabezado predefinido si la API espera uno diferente, y el asistente escribirá la línea de encabezado por usted. El asistente ve los nombres y tipos de las credenciales, nunca sus valores. Si no dispone de una credencial adecuada, la pregunta ofrece crear una. Los secretos que llegan a la salida del nodo, como el `request.headers` enviado, se enmascaran en los resultados de la ejecución.
## Seguridad de egreso

- De forma predeterminada, la URL debe usar `http://` o `https://` y resolverse únicamente a direcciones públicas. Los destinos de loopback, privados, link-local, multicast y de metadatos en la nube están bloqueados.
- Heym valida las direcciones resueltas y fija el destino de la conexión para evitar el DNS rebinding. Los proxies del entorno se deshabilitan mientras el guard está activo. Los redireccionamientos no se siguen de forma predeterminada; agregue la opción `-L` de cURL para seguirlos. Cuando se habilitan, cada salto de redireccionamiento se verifica contra la misma política de direcciones públicas y se fija antes de conectar.
- Las implementaciones autoalojadas de confianza que se conectan intencionalmente a servicios internos pueden establecer `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenga el valor predeterminado en implementaciones alojadas o multiinquilino.

**Nota de actualización para v0.0.105:** esta política de alcance de instancia ahora también protege los destinos derivados de Credenciales utilizados por Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, la ejecución personalizada de LLM y el descubrimiento de modelos, el asistente de IA, los guardrails y los embeddings de RAG. Las Credenciales existentes que apuntan a direcciones de loopback, privadas o link-local se rechazan a menos que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` esté habilitado en una instancia autoalojada de confianza. Mientras el guard está activo, los clientes HTTP protegidos ignoran `HTTP_PROXY` y `HTTPS_PROXY`; habilitar la exclusión los restaura. Los paquetes de CA del operador configurados mediante `SSL_CERT_FILE` o `SSL_CERT_DIR` siguen siendo compatibles. ClickHouse se verifica antes de que se abra la conexión, pero no se fija en el momento del dial, porque clickhouse-connect trae su propio transporte urllib3.

## Relacionado

- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Triggers](../reference/triggers.md) – HTTP como punto de entrada del workflow
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Agregar claves de API para solicitudes autenticadas
