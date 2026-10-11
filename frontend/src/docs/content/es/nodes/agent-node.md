# Nodo Agent

El nodo **AI Agent** es un nodo LLM con llamada a herramientas. Puede ejecutar herramientas Python, invocar nodos conectados del canvas como herramientas, conectarse a servidores MCP, utilizar skills, actuar opcionalmente como orquestador que delega en otros nodos agent, llamar a otros workflows como herramientas y pausarse para [revisión humana](../reference/human-in-the-loop.md).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1, más un `review` opcional cuando HITL está habilitado |
| Salida | `$nodeLabel.text`, `$nodeLabel.fieldName` (cuando la salida JSON está habilitada), o un payload HITL pendiente mientras espera la revisión |

## Parámetros principales

### Credencial y modelo

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM (API key) desde Settings |
| `model` | string | Nombre del modelo (ej. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de respaldo cuando la principal falla |
| `fallbackModel` | string (opcional) | Modelo de respaldo cuando el principal falla |

Añada credenciales en la pestaña [Credenciales](../tabs/credentials-tab.md). La lista de modelos se carga desde la credencial seleccionada. Si la credencial o el modelo principal devuelven un error, el nodo reintenta automáticamente con la credencial y el modelo de respaldo antes de fallar.

### Prompts

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema para la IA. Admite [expresiones](../reference/expression-dsl.md). |
| `userMessage` | string | Mensaje/prompt del usuario. Predeterminado: `$input.text` |
| `jsonOutputEnabled` | boolean | Salida JSON estructurada |
| `jsonOutputSchema` | string | JSON Schema para la salida estructurada |
| `extraBodyEnabled` | boolean | Enviar parámetros de solicitud específicos del proveedor (predeterminado: `false`) |
| `extraBody` | string | Objeto JSON combinado en cada solicitud a la API que realiza el agente |

Utilice `$input.text`, `$nodeName.field` y otra sintaxis del [Expression DSL](../reference/expression-dsl.md).

### Modelos de razonamiento (o1, o3)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (predeterminado: 0.7), para modelos estándar |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profundidad de razonamiento para modelos de razonamiento |

Cuando utilice un modelo de razonamiento (ej. o1, o3), la UI muestra **Reasoning Effort** en lugar de Temperature. Para modelos estándar, **Temperature** controla la creatividad.

**Ejemplo de salida JSON:** Cuando necesite datos estructurados del agente (ej. clasificación, extracción), habilite la salida JSON y proporcione un esquema. El agente devuelve JSON que coincide con el esquema; acceda a los campos por nombre en la salida del nodo:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Los nodos posteriores pueden utilizar `$agentLabel.status`, `$agentLabel.reason`, etc. Mismo comportamiento que la salida JSON del [nodo LLM](../nodes/llm-node.md).
## Revisión humana (HITL)

Utilice HITL cuando un agente pueda necesitar aprobación en momentos específicos antes de acciones importantes.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Añade puntos de control de revisión humana al agente |
| `hitlSummary` | string | Directrices de aprobación que indican al agente cuándo se necesita revisión humana |

Cuando HITL está habilitado, el agente recibe una herramienta `request_human_review`. Utilice el system prompt y este campo de directrices para explicar qué llamadas a herramientas, sub-agentes, sub-workflows, acciones MCP, skills o efectos secundarios requieren aprobación. El agente puede llamar a esa herramienta solo cuando sea necesario, incluso varias veces en una misma ejecución.

El resumen que se muestra al revisor en la página pública se genera a partir de la solicitud de revisión del agente en tiempo de ejecución. Si el agente no proporciona un resumen explícitamente, Heym lo deriva del cuerpo de revisión en Markdown.

Para las herramientas MCP, Heym solicita al modelo que interprete sus instrucciones HITL escritas como uno de tres ámbitos: `always`, `once` o `never`. Esto significa que expresiones de formato libre como "for each call", "only one time" o "never ask" se normalizan antes de aplicar el gating en tiempo de ejecución.

Cada punto de control HITL crea un enlace de revisión público de un solo uso en `/review/{token}`. Un revisor puede:

- **Accept** el texto de revisión original en Markdown
- **Edit & Continue** con el Markdown modificado
- **Refuse** y continuar con `text: ""`

Cuando HITL está habilitado, el nodo también expone un handle de salida `review` en el canvas. Conecte esa rama a Slack, correo electrónico u otros nodos de notificación si desea difundir la URL de revisión y el resumen en cuanto la ejecución se pause.

La ejecución pasa a estado `pending` hasta que un revisor responda. El texto de revisión es un único cuerpo en Markdown, y el payload pendiente también incluye el texto del enlace compartible para el traspaso externo. Los nodos de la rama `review` se ejecutan inmediatamente cuando se crea la pausa; la ruta de salida normal continúa solo tras la aprobación. Después de la aprobación, Heym reanuda desde la instantánea de ejecución almacenada y el agente continúa con el contexto aprobado. Si un paso posterior también necesita aprobación, el agente puede crear otro punto de control HITL. Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para conocer la forma del payload, el comportamiento de la URL de revisión y la semántica de reanudación.

HITL está disponible únicamente para la salida del agente en modo texto. En la v1 no puede combinarse con `jsonOutputEnabled`.


## Modo Orchestrator

Cuando está habilitado, el agente puede delegar tareas a otros nodos de agente en el workflow. Si el **modo Orchestrator está deshabilitado**, el agente **no puede crear conexiones agente→agente** en el canvas.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Cuando es `true`, el agente obtiene una herramienta `call_sub_agent` |
| `subAgentLabels` | string[] | Etiquetas de los nodos de agente que este orquestador puede llamar |

Los **sub-agentes** deben usar `$input.text` en su User Message para recibir el prompt del orquestador.

Cuando el orquestador llama a varios sub-agentes en un mismo turno, estos se ejecutan en paralelo. Consulte [Agent Architecture](../reference/agent-architecture.md) para más detalles.

## Sub-Workflows

Cuando está configurado, el agente recibe una herramienta `call_sub_workflow` para ejecutar otros workflows.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | IDs de los workflows que este agente puede llamar como herramientas |

Seleccione workflows en la sección Sub-Workflows de la configuración del agente. El agente los llamará con `workflow_id` e `inputs` (objeto que coincide con los campos de entrada del workflow de destino). Profundidad máxima: 5 llamadas anidadas a sub-workflows.

## Herramientas de nodos del canvas

Puede conectar un nodo de workflow compatible al handle de **tools** de un agente para que este pueda llamar a ese nodo en tiempo de ejecución. Esto convierte acciones y transformaciones existentes del canvas en herramientas invocables sin escribir Python.

Utilice las herramientas de nodos del canvas cuando desee que el agente decida cuándo ejecutar un nodo configurado, manteniendo al mismo tiempo las credenciales, los campos estáticos y la configuración específica del workflow en la interfaz del nodo.

### Campos proporcionados por el agente

Los campos de un nodo de herramienta conectado pueden marcarse con el icono del bot. Los campos marcados se convierten en parámetros obligatorios de la herramienta que el agente debe proporcionar cuando llama al nodo. Los campos no marcados permanecen fijos y se leen de la configuración del nodo.

Por ejemplo:

- Conecte un nodo de Slack a un agente como herramienta
- Mantenga la credencial fija en el nodo de Slack
- Marque `message` como proporcionado por el agente
- El agente recibe una herramienta de Slack en la que solo proporciona el mensaje en tiempo de ejecución

Si el nodo no está conectado a un agente como herramienta, el icono del bot se oculta y el nodo se comporta como un paso normal del workflow.
### Comportamiento en tiempo de ejecución

Cuando el agente invoca una herramienta de nodo del canvas, Heym fusiona temporalmente los argumentos proporcionados por el agente en los datos de dicho nodo, ejecuta el nodo, devuelve la salida del nodo al agente y, a continuación, restaura la configuración original del nodo. Los nodos de herramienta no se ejecutan como pasos regulares del workflow mediante la programación normal; se ejecutan únicamente cuando el agente los invoca.

Las herramientas de nodo del canvas resultan útiles con nodos de integración como Slack, Telegram, HTTP, Send Email y nodos de transformación de datos como [Set](./set-node.md). Los nodos Trigger, los nodos de control de flujo y los mapeadores de salida terminal ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) no pueden utilizarse como herramientas del agente.

## Herramientas de Python

Defina herramientas personalizadas que el agente pueda invocar. Cada herramienta dispone de:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | string | Nombre de la herramienta (ej.: `count_characters`) |
| `description` | string | Descripción para el LLM |
| `parameters` | JSON Schema | Esquema de function-calling de OpenAI (formato de objeto) |
| `code` | string | Código de la función Python |

**Parameters** debe ser un objeto JSON, no una cadena:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Herramienta de ejemplo:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Las herramientas de Python se ejecutan como código no confiable en un contenedor Docker aislado y reforzado de forma predeterminada (sin red, sin socket de Docker, sistema de archivos de solo lectura, sin privilegios de root). Las importaciones están limitadas a una lista de permitidos de módulos seguros de la biblioteca estándar. Consulte [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) para la configuración (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Segundos máximos por ejecución de herramienta (predeterminado: 30) |
| `requestTimeoutSeconds` | number | Segundos máximos de espera para cada respuesta del modelo antes de agotar el tiempo de espera (predeterminado: 60). Auméntelo para proveedores lentos o autoalojados (LiteLLM, vLLM, modelos locales) y para ejecuciones largas de varios pasos. |
## Conexiones MCP

Conecte con servidores de [Model Context Protocol](https://modelcontextprotocol.io/) para exponer sus herramientas al agente.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipo de conexión |
| `timeoutSeconds` | number | Tiempo de espera para esta conexión (predeterminado: 30) |
| `label` | string | Nombre para mostrar opcional |

**stdio** (proceso local):

| Campo | Descripción |
|-------|-------------|
| `command` | Comando a ejecutar (ej.: `npx`) |
| `args` | Array JSON (ej.: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Objeto JSON de variables de entorno inyectadas en el proceso (ej.: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

La mayoría de los servidores stdio basados en API key se autentican mediante variables de entorno en lugar de argumentos de comando. Configure `env` por conexión para que cada nodo Agent pueda usar una credencial distinta sin modificar el entorno del host.

Los valores de `env` admiten [Expression DSL](../reference/expression-dsl.md), por lo que puede pasar entradas del workflow como credenciales en lugar de codificar secretos de forma fija:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

La expresión `$userInput.pat` se resuelve en tiempo de ejecución contra los datos de entrada del workflow antes de que se inicie el proceso MCP. Esto permite aceptar tokens desde un trigger o un nodo de entrada en lugar de incrustarlos en la definición del workflow.

Ejemplo — GitHub MCP con token codificado de forma fija:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Ejemplo — GitHub MCP con token dinámico desde la entrada del workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Ejemplo — GitHub MCP con una credencial de GitHub de Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

La credencial de GitHub integrada actualmente está orientada a la autenticación basada en PAT. Si necesita acceso a nivel de organización, utilice un PAT con los permisos de organización/repositorio requeridos.

Ejemplo — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (servidor remoto):

| Campo | Descripción |
|-------|-------------|
| `url` | URL del endpoint SSE. Admite expresiones (ej.: `$userInput.serverUrl`). |
| `headers` | Objeto JSON para autenticación/encabezados personalizados. Los valores admiten expresiones. |

**Streamable HTTP** (servidor remoto):

| Campo | Descripción |
|-------|-------------|
| `url` | URL del endpoint MCP (ej.: `https://example.com/mcp`). Admite expresiones. |
| `headers` | Objeto JSON para autenticación/encabezados personalizados. Los valores admiten expresiones. |

## Skills

Los Skills son instrucciones SKILL.md más archivos Python opcionales y recursos incluidos. Extienden el contexto del sistema del agente y pueden añadir herramientas Python.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `name` | string | Nombre del Skill |
| `content` | string | Contenido de SKILL.md (instrucciones) |
| `timeoutSeconds` | number | Tiempo de espera para la ejecución de Python del Skill (predeterminado: 30) |
| `driveFilesEnabled` | boolean | Habilita el helper `heym_drive` en tiempo de ejecución para este Skill (predeterminado: false) |
| `files` | array | Entradas opcionales `{ path, content, encoding, mimeType }` (ej.: scripts `.py` o recursos binarios almacenados como base64) |

Los Skills se pueden añadir arrastrando un archivo `.zip` o `.md` al área de Skills.
Después de expandir una tarjeta de Skill, arrastre cualquier archivo a ese Skill para adjuntar o reemplazar un archivo incluido, incluidos recursos binarios como PDFs e imágenes.
Utilice el botón de descarga en una tarjeta de Skill para exportar ese Skill como un archivo `.zip` para respaldo o reutilización en otro workflow.

Habilite **Drive files** en un Skill solo cuando su código Python necesite leer archivos desde Heym Drive. Los Skills habilitados reciben un helper `heym_drive.py` generado en tiempo de ejecución y pueden llamar a `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` o `read_drive_base64` con un id de archivo de Drive o un nombre de archivo exacto. La búsqueda por nombre de archivo utiliza la coincidencia accesible más reciente. Los Skills deshabilitados no reciben el helper.

Cada tarjeta de Skill tiene cuatro acciones en la fila debajo del título:

| Botón | Descripción |
|--------|-------------|
| **Edit with AI** | Abre Skill Builder para revisar el Skill desde un prompt de Chat |
| **Download** | Exporta el Skill como un archivo `.zip` |
| **Remove** | Elimina el Skill de este nodo Agent |
| **History** | Abre el historial del Skill derivado del [Historial de edición](../reference/edit-history.md) |
### Historial de Skills

El historial de Skills **no** se almacena por separado. Se deriva de las instantáneas del Historial de edición del workflow: cada versión guardada del workflow incluye el array completo `skills` del Nodo Agent.

Desde el diálogo Historial puede:

- **Previsualizar** una instantánea anterior (SKILL.md y lista de archivos)
- **Editar** — cargar una instantánea en el editor de skills sin revertir el workflow completo
- **AI Fine-tune** — abrir Skill Builder con esa instantánea como punto de partida
- **Revertir** — restaurar únicamente este skill desde una versión anterior (los demás nodos permanecen como están)

El Historial sigue la misma retención de 7 días que el Historial de edición del workflow. Guardar el workflow después de editar skills crea nuevas entradas en el historial.

La sección Skills también incluye **AI Build**:

- Haga clic en **AI Build** para crear un nuevo skill desde un prompt de chat
- Haga clic en el botón de destello sobre un skill existente para revisarlo con IA
- Arrastre archivos al compositor del prompt para adjuntarlos al comentario de fine-tune; esos archivos también se guardan como assets empaquetados del skill
- El modal transmite el texto del asistente mientras muestra previsualizaciones en vivo de los archivos `SKILL.md` y `.py`
- **Download ZIP** exporta la previsualización actual sin añadirla al nodo
- **Save & Add** guarda los archivos generados a través del mismo flujo de análisis ZIP que utilizan las cargas manuales

Al editar con IA, Heym solo envía archivos de skill de texto `.md` y `.py` al builder. Los adjuntos binarios y otros no editables se conservan y se comparten con el builder como metadatos de ruta para que el código Python generado pueda mantener correctas las referencias relativas a archivos.
Seleccione un archivo adjunto en el panel derecho y habilite **Include this file in AI context** cuando la IA necesite inspeccionar una plantilla empaquetada. Los archivos de texto, PDF y DOCX se extraen al contexto del prompt cuando es posible; Heym no aplica un límite de tamaño de adjunto específico de Skill Builder más allá del límite del cuerpo de la solicitud de la plataforma.

## Extra Body

Algunos proveedores aceptan parámetros de solicitud que los campos estándar compatibles con OpenAI no
cubren, como deshabilitar el modo de pensamiento de un modelo. Marque **Send extra request body** en las propiedades del nodo
e introduzca un objeto JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Deshabilitado por defecto.** Con la casilla desmarcada, no se envía nada adicional.
- Se aplica a **cada** solicitud en el bucle de llamadas a herramientas, no solo al primer turno, además del
  intento con el modelo de respaldo. No se aplica a las comprobaciones de guardrails, que utilizan un modelo separado.
- Debe ser un **objeto** JSON. Un array, un escalar o texto mal formado hacen fallar el nodo con
  `Invalid extra body JSON` en lugar de descartarse silenciosamente.
- Las expresiones `$` se resuelven antes del análisis. Dado que se trata de una sustitución textual, un valor resuelto
  que contenga una comilla doble o un salto de línea produce JSON no válido y hace fallar el nodo.

Mismo campo y comportamiento que el extra body del [Nodo LLM](./llm-node.md).

## Guardrails

Habilite **Guardrails** en las propiedades del nodo para bloquear mensajes de usuario no seguros antes de que se ejecute el agente. Consulte [Guardrails](../reference/guardrails.md) para la referencia completa.

## Memoria persistente (grafo)

Grafo de conocimiento opcional **por Nodo Agent** almacenado en la base de datos. Cuando está habilitado, Heym añade un resumen en Markdown de las entidades y relaciones recordadas a la **instrucción del sistema** antes de cada ejecución (solo si el grafo no está vacío). Tras una finalización **exitosa** del agente, un trabajo en segundo plano extrae nuevos hechos duraderos de la conversación y los fusiona en el grafo.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Habilitar la carga + extracción en segundo plano para este nodo del canvas |

Los **sub-agentes** mantienen su **propio** grafo (indexado por su id de nodo), separado del orquestador.

Utilice el control rosa de **cerebro** en el nodo (cuando la memoria está activada o se muestra la fila del modelo) para abrir el editor del grafo y el **uso compartido de memoria** opcional (otros workflows/agentes). Comportamiento completo, rutas REST y detalles de exportación JSON: [Memoria persistente del agente](../reference/agent-persistent-memory.md).
## API de Responses y continuidad del razonamiento

Una casilla de verificación **Use Responses API** enruta las llamadas al modelo del agente a través de la
[API de Responses](https://platform.openai.com/docs/api-reference/responses) en lugar de Chat
Completions. Está desactivada de forma predeterminada.

Resulta especialmente relevante en un modelo de razonamiento como `gpt-5` o la serie `o`. La API de Responses devuelve
el razonamiento del modelo junto con cada llamada a herramienta, y el agente reinyecta esos elementos de razonamiento en
el siguiente turno, de modo que el modelo conserva su cadena de pensamiento a lo largo de un bucle de herramientas de varios pasos en lugar de
recalcularla tras cada resultado de herramienta. Todo el bucle se ejecuta sobre la misma ruta, incluida la
pausa y reanudación de la [revisión humana](#human-review-hitl), la [compresión de contexto](#context-compression)
y la respuesta final.

La conversación en sí permanece en Heym. Heym envía la entrada completa en cada turno y transporta el
razonamiento como un blob cifrado, de modo que no se retiene nada del lado del proveedor entre llamadas.
Los elementos de razonamiento dentro de un span que la compresión de contexto resume se descartan junto con él, ya que
un blob cifrado no se puede resumir.

Funciona con una credencial de OpenAI, y con una credencial personalizada cuyo gateway admita el
endpoint. Con una credencial de Google permanece deshabilitada.

## Compresión de contexto

Cuando un agente ejecuta muchas iteraciones de herramientas con resultados grandes (web scraping, lectura de documentos, salidas de sub-workflows), el historial de mensajes acumulado puede acercarse al límite de la ventana de contexto del modelo. Heym comprime automáticamente el historial de la conversación durante la ejecución para evitar el desbordamiento de contexto.

**Cómo funciona:**

1. Antes de cada iteración de herramienta, Heym estima el recuento actual de tokens (~4 caracteres por token).
2. Si la estimación supera el **80%** de la ventana de contexto del modelo, se activa la compresión.
3. El historial de mensajes se divide en secciones preservadas y comprimidas:
   - **Preservadas**: prompt del sistema, primer mensaje del usuario, mensaje del usuario más reciente
   - **Comprimidas**: todo lo intermedio (turnos de razonamiento del asistente, llamadas a herramientas, resultados de herramientas)
4. La sección intermedia se resume utilizando el **mismo modelo y credencial** — no se necesita configuración adicional.
5. El resumen comprimido reemplaza la sección intermedia como un único mensaje del asistente.

**Observabilidad:**

Los eventos de compresión aparecen como entradas `Context compressed (N messages → summary)` en:
- La lista de llamadas a herramientas del **Debug panel** durante la ejecución en vivo
- La vista de detalle de ejecución del **Execution history**
- La **Traces tab** como una entrada de traza `context.compression`

La compresión es automática y siempre está activa para los Nodos Agent. **No** se aplica a los Nodos LLM, a la pestaña Chat ni a las sesiones del AI Assistant.

## Relacionado

- [Por qué Heym](../getting-started/why-heym.md) – Cómo se ejecutan los agentes y se mantienen gobernados en producción
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Grafo de conocimiento por Nodo Agent, uso compartido opcional, API, editor
- [Agent Architecture](../reference/agent-architecture.md) – Sub-agentes, orquestador, skills, MCP, llamada a herramientas
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Páginas de revisión públicas, ejecuciones pendientes, flujo de aprobar/editar/rechazar
- [Guardrails](../reference/guardrails.md) – Bloquear categorías de contenido no seguro
- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [AI Assistant](../reference/ai-assistant.md) – Interfaz de Chat para construir workflows con lenguaje natural (distinta del Nodo Agent)
- [Expression DSL](../reference/expression-dsl.md) – Referenciar datos en prompts
- [Workflow Structure](../reference/workflow-structure.md) – Nodos, aristas y formato DSL
- [Quick Start](../getting-started/quick-start.md) – Workflow básico con LLM y expresiones
- [Credentials Tab](../tabs/credentials-tab.md) – Añadir claves de API para el agente
- [MCP Tab](../tabs/mcp-tab.md) – Configurar MCP para herramientas de workflow
