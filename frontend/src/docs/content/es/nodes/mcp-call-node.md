# Nodo MCP Call

El nodo **MCP Call** invoca directamente una herramienta específica del [Model Context Protocol (MCP)](https://modelcontextprotocol.io), sin que un LLM decida qué herramienta invocar. Utilícelo cuando sepa exactamente qué herramienta llamar y desee una ejecución determinista de un solo paso.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.result` |

## Cuándo utilizarlo

Utilice el nodo MCP Call cuando:
- Sepa exactamente qué herramienta MCP llamar en tiempo de diseño
- No necesite un LLM para elegir entre herramientas
- Desee una alternativa ligera y determinista a un nodo Agent para una única invocación de herramienta

Utilice el [Nodo Agent](./agent-node.md) en su lugar cuando un LLM deba decidir qué herramientas llamar o cuando necesite razonamiento de varios pasos.

> El nodo MCP Call **no** se puede conectar a un nodo Agent como herramienta.

## Configuración de la conexión

El nodo se conecta a un único servidor MCP. Elija un transporte y complete los campos correspondientes.

### SSE / Streamable HTTP

| Campo | Descripción |
|-------|-------------|
| `transport` | `sse` o `streamable_http` |
| `url` | URL completa del servidor MCP (p. ej. `https://mcp.example.com/sse`). Admite expresiones DSL. |
| `headers` | Objeto JSON de encabezados HTTP (p. ej. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Tiempo de espera por conexión en segundos (predeterminado: 30) |

### stdio

| Campo | Descripción |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Ejecutable a ejecutar (p. ej. `npx`) |
| `args` | Array JSON de argumentos (p. ej. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Objeto JSON de variables de entorno (p. ej. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Tiempo de espera por conexión en segundos (predeterminado: 30) |

## Selección de herramienta

1. Complete los campos de conexión.
2. Haga clic en **Fetch Tools** — el nodo se conecta al servidor MCP y lista las herramientas disponibles.
3. Seleccione una herramienta en el menú desplegable.

**La selección de herramienta es obligatoria.** El nodo no se ejecutará sin una herramienta seleccionada.

## Argumentos

Después de seleccionar una herramienta, el nodo muestra un campo de entrada por cada argumento definido en el esquema de entrada de la herramienta. Cada campo acepta:
- Un valor estático: `10`
- Una expresión DSL: `$userInput.body.text`

Los argumentos obligatorios se marcan con `*`.

## Salida

| Campo | Descripción |
|-------|-------------|
| `$nodeLabel.result` | Resultado de la herramienta. Si la respuesta es JSON válido, se trata de un objeto analizado. En caso contrario, es una cadena de texto. |

## Ejemplo

Invocar una herramienta `search` en un servidor MCP con SSE, pasando la consulta del usuario:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Acceder al resultado en pasos posteriores:

```
$searchCall.result.items   ← si el resultado es un objeto JSON
$searchCall.result         ← si el resultado es una cadena de texto simple
```

## Notas

- El nodo resuelve las expresiones DSL en `url`, `headers`, `env` y todos los valores de `toolArguments` antes de llamar a la herramienta.
- El `timeoutSeconds` a nivel del nodo se aplica a la ejecución general; el `connection.timeoutSeconds` se aplica a la propia sesión MCP.
- Si el servidor MCP no está disponible o devuelve un error, el nodo falla y el mensaje de error queda disponible en la traza del workflow.