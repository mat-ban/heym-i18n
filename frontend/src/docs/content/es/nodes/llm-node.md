# LLM

El nodo **LLM** procesa texto con un modelo de lenguaje o genera imágenes. Admite generación de texto, visión (entrada de imagen), generación de imágenes, salida JSON estructurada y ejecución mediante **Batch API** nativa del proveedor para los modelos de texto compatibles.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1, más un `batchStatus` opcional cuando el modo batch está habilitado |
| Salida | `$nodeLabel.text` (texto), `$nodeLabel.image` (imagen) o campos de resultado del batch como `$nodeLabel.results` |

## Parámetros

### Credencial y modelo

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM de [Credenciales](../tabs/credentials-tab.md) |
| `model` | string | Nombre del modelo (p. ej. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` para imágenes) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de respaldo cuando la principal falla |
| `fallbackModel` | string (opcional) | Modelo de respaldo cuando el principal falla |

Si la credencial o el modelo principal devuelve un error, el nodo reintenta automáticamente con la credencial y el modelo de respaldo antes de fallar.

Heym también verifica la **capacidad de batch** de la credencial y el modelo seleccionados. El modo batch está disponible para:

- Credenciales de OpenAI
- Credenciales personalizadas o compatibles con OpenAI cuyo endpoint exponga las API `/v1/files` y `/v1/batches` requeridas

Si el proveedor o el modelo seleccionados no admiten la ejecución por batch, el panel de Propiedades lo indica directamente y deshabilita el interruptor.

### Prompts (modo texto)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt del sistema. Admite [expresiones](../reference/expression-dsl.md). |
| `userMessage` | string | Mensaje del usuario. Valor predeterminado: `$input.text` |
| `temperature` | number | 0.0–2.0 (predeterminado: 0.7) |
| `maxTokens` | number | Tokens máximos de respuesta (opcional) |
| `requestTimeoutSeconds` | number | Segundos máximos de espera para la respuesta del modelo antes de agotar el tiempo de espera (predeterminado: 60). Auméntelo para proveedores lentos o autoalojados (LiteLLM, vLLM, modelos locales). |

### Imagen y salida

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generación de texto o de imagen |
| `imageInputEnabled` | boolean | Incluir imagen con el mensaje del usuario (visión) |
| `imageInput` | expression | URL de datos Base64 o URL de imagen |
| `jsonOutputEnabled` | boolean | Salida JSON estructurada |
| `jsonOutputSchema` | string | JSON Schema para la salida estructurada |
| `extraBodyEnabled` | boolean | Enviar parámetros de solicitud específicos del proveedor (predeterminado: `false`) |
| `extraBody` | string | Objeto JSON combinado en el cuerpo de la solicitud a la API |

### Modelos de razonamiento (o1, o3)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Habilitar para modelos de razonamiento |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profundidad del razonamiento |

### Modo batch

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Usar la Batch API nativa del proveedor en lugar de la ejecución de solicitud única |

El modo batch está disponible únicamente en el nodo **LLM**. **No** se aplica al [Nodo Agent](./agent-node.md).

Cuando el modo batch está habilitado:

- `outputType` debe permanecer como `text`
- `imageInputEnabled` debe permanecer como `false`
- `userMessage` debe resolverse en un **array**
- cada elemento del array debe resolverse en una cadena o un valor primitivo

Ejemplos típicos:

- `$input.items.map("item.text")`
- `$vars.promptList`

Si la expresión se resuelve en una sola cadena en lugar de un array, la ejecución falla con un error de validación antes de que comience la llamada al proveedor.

## Rama de estado del batch

Cuando el modo batch está habilitado, el nodo LLM expone un segundo conector de salida: `batchStatus`.

Utilice esa rama para notificaciones, registro, mensajes de Slack o efectos secundarios mientras el batch aún se está ejecutando. La rama se activa cada vez que el estado del proveedor cambia de forma significativa, incluidos estados normalizados como:

- `pending`
- `processing`
- `completed`
- `failed`

El payload de la rama de estado está disponible como `$input` dentro de los nodos posteriores e incluye:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Ejemplo de arista:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Ejemplo de asignador de estado:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```
## Estructura del resultado por lotes

Al completarse correctamente, la salida principal del LLM contiene:

- `$nodeLabel.text` – textos exitosos concatenados
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – resultados por elemento en el orden original
- `$nodeLabel.usage`

Cada elemento de `$nodeLabel.results` incluye campos como:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Cuando la **salida JSON** está habilitada junto con el modo por lotes, Heym analiza cada elemento exitoso por separado. Los objetos analizados se exponen por elemento y se recopilan en `parsedResults`.

## API de Responses

Una casilla **Use Responses API** enruta la llamada del nodo a través de la
[API de Responses](https://platform.openai.com/docs/api-reference/responses) en lugar de Chat
Completions. Está desactivada de forma predeterminada, y el nodo se comporta igual en ambos casos: los mismos prompts,
el mismo esquema de salida JSON, la misma estructura de resultado.

Funciona con una credencial de OpenAI, y con una credencial personalizada cuyo gateway admita el
endpoint, por lo que una configuración autoalojada o con proxy también puede utilizarla. Con una credencial de Google permanece
deshabilitada, y no se puede combinar con el [modo por lotes](#batch-status-branch) - el panel del nodo indica
la situación de una credencial determinada antes de ejecutar nada.

Si el endpoint resulta no estar disponible en tiempo de ejecución, el nodo falla con un mensaje que indica la
causa en lugar de recurrir silenciosamente a otra opción, por lo que un nodo configurado para la API de Responses siempre
se ejecuta sobre ella. Para recurrir deliberadamente a otra credencial o modelo, utilice los campos **Fallback
Credential** y **Fallback Model**; estos heredan esta casilla, por lo que una credencial de fallback
también debe admitir el endpoint.

## Generación de imágenes

- **Modelos:** `nanobanana`, `gemini-2.0-flash-exp`
- **Salida:** `$nodeLabel.image` (URL de datos en base64)
- Al utilizar [Input](./input-node.md) para el prompt, use `$userPrompt.body.text` en `userMessage`

## Salida JSON

Cuando `jsonOutputEnabled` es true, el LLM devuelve JSON que coincide con el esquema. Acceda a los campos mediante `$nodeLabel.fieldName`.

## Extra Body

Algunos proveedores aceptan parámetros de solicitud que los campos estándar compatibles con OpenAI no
cubren, como deshabilitar el modo de razonamiento de un modelo. Marque **Send extra request body** en las
propiedades del nodo e introduzca un objeto JSON. Se fusiona en cada solicitud a la API que realiza este nodo.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Deshabilitado de forma predeterminada.** Con la casilla desmarcada, no se envía nada adicional.
- Debe ser un **objeto** JSON. Un array, un escalar o un texto mal formado hacen fallar el nodo con
  `Invalid extra body JSON` en lugar de descartarse silenciosamente.
- El botón **Format** junto a la casilla reformatea el JSON, y se vuelve rojo mostrando
  `Invalid` cuando el texto no se puede analizar.
- Se aplica a la completion principal, al intento con el modelo de fallback y a las solicitudes del modo por lotes.
  **No** se aplica a la generación de imágenes ni a las comprobaciones de guardrail, que utilizan una estructura de solicitud
  diferente y un modelo aparte.
- Las expresiones `$` se resuelven antes del análisis, por lo que `{"max_tokens": $prev.limit}` funciona. Dado que
  esto es una sustitución textual, un valor resuelto que contenga una comilla doble o un salto de línea
  produce un JSON no válido y hace fallar el nodo.

## Ejemplo – Texto

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```
## Ejemplo – Texto por lotes

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Ejemplo – Generación de imágenes

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Habilite **Guardrails** en las propiedades del nodo para bloquear mensajes de usuario no seguros antes de la llamada al LLM. Consulte [Guardrails](../reference/guardrails.md) para obtener la referencia completa.

## Relacionado

- [Nodo Agent](./agent-node.md) – LLM con llamada a herramientas
- [Por qué Heym](../getting-started/why-heym.md) – Dónde encajan los pasos de LLM en el ciclo de vida del agente
- [Guardrails](../reference/guardrails.md) – Bloquee categorías de contenido no seguro
- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [DSL de expresiones](../reference/expression-dsl.md) – Cómo referenciar datos en los prompts
- [Diálogo de evaluación de expresiones](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend para prompts
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Agregue claves de API de LLM
- [Inicio rápido](../getting-started/quick-start.md) – Workflow básico con LLM
