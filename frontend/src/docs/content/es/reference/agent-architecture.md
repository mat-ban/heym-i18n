# Arquitectura de agentes

El [Nodo de agente](../nodes/agent-node.md) admite sub-agentes, sub-workflows, herramientas de nodos del canvas, un patrón de orquestador, skills, conexiones MCP, llamadas a herramientas, [memoria persistente](./agent-persistent-memory.md) opcional (por nodo del canvas, con posibilidad de compartirla con otros agentes) y [revisión humana](./human-in-the-loop.md) opcional. Esta página describe la arquitectura.

## Sub-agentes

Los sub-agentes son nodos de agente que un orquestador puede invocar mediante la herramienta `call_sub_agent`.

- **Orquestador**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agentes**: deben usar `$input.text` en su User Message para recibir el prompt del orquestador
- **Herramienta**: `call_sub_agent` con `sub_agent_label` (enum) y `prompt`
- **Límite de profundidad**: máximo 5 llamadas anidadas a sub-agentes

### Flujo de ejecución

1. El orquestador decide invocar un sub-agente
2. `_execute_sub_agent_tool` localiza el agente de destino por su label
3. Construye `synthetic_inputs = {"input": {"text": prompt}}`
4. Ejecuta `_execute_agent_node` para el sub-agente
5. El resultado se devuelve al orquestador

### Ejecución paralela de sub-agentes

Cuando el orquestador devuelve varias llamadas a la herramienta `call_sub_agent` en un mismo turno, estas se ejecutan **en paralelo**. Por ejemplo, si el usuario pregunta por "París" y el orquestador invoca tanto `distanceAgent` como `foodAgent`, ambos se ejecutan de forma concurrente en lugar de secuencial.

- **Beneficio**: el tiempo total se aproxima al del sub-agente más lento, no a la suma de todos.
- **Recomendación**: incentive al orquestador a invocar varios sub-agentes en un mismo turno cuando la tarea lo requiera.

## Sub-workflows

Cuando se configura `subWorkflowIds`, el agente puede invocar otros workflows mediante la herramienta `call_sub_workflow`.

- **Configuración**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Herramienta**: `call_sub_workflow` con `workflow_id` (enum) e `inputs` (object)
- **Límite de profundidad**: máximo 5 llamadas anidadas a sub-workflows

### Flujo de ejecución

1. El agente decide invocar un sub-workflow
2. `_execute_sub_workflow_tool` obtiene el workflow desde `workflow_cache`
3. Construye `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Ejecuta `WorkflowExecutor.execute()` para el sub-workflow
5. El resultado se devuelve al agente

Los sub-workflows no pueden pausarse para HITL en la v1. Si un sub-workflow anidado intenta entrar en un estado de revisión pendiente, la ejecución falla en lugar de suspenderse dentro de la llamada anidada.

## Herramientas de nodos del canvas

Las herramientas de nodos del canvas son nodos de workflow conectados a un agente a través del handle `tool-input`. Durante la configuración del agente, `_build_node_tool_schemas` examina esas conexiones y añade un esquema de herramienta compatible con OpenAI por cada nodo conectado.

- **Origen de la herramienta**: `_source: "node_tool"`
- **Nombre de la herramienta**: derivado del label del nodo conectado, con sufijos añadidos en caso de duplicados
- **Parámetros de la herramienta**: construidos a partir de los `agentProvidedFields` del nodo
- **Campos fijos**: todos los campos del nodo que no aparezcan en `agentProvidedFields` permanecen en la configuración del nodo

### Flujo de ejecución

1. El agente decide invocar una herramienta de nodo conectada
2. `_execute_node_tool` copia los datos del nodo
3. Los argumentos proporcionados por el agente se fusionan con los campos configurados del nodo
4. `execute_node` ejecuta ese nodo una vez con la programación de ramas deshabilitada
5. Se restauran los datos originales del nodo
6. La salida del nodo se devuelve al agente como resultado de la herramienta

Los nodos de herramienta se excluyen de la programación normal del workflow para que no se ejecuten dos veces. Se ejecutan únicamente a través de la ruta de llamada a herramientas del agente.

## Human-in-the-Loop

Cuando se establece `hitlEnabled` en un agente, este recibe una herramienta `request_human_review` que puede invocar en puntos de aprobación específicos.

1. El system prompt y las directrices HITL del nodo indican al agente qué acciones requieren aprobación
2. Cuando el agente alcanza uno de esos pasos, invoca `request_human_review`
3. Heym almacena una instantánea de la ejecución del workflow y crea una solicitud de revisión pública
4. El resultado del nodo se marca como `pending` con una URL de revisión
5. El handle de salida `review` del agente se programa de inmediato para que las ramas de notificación puedan ejecutarse con el payload pendiente
6. La programación de la ejecución principal se detiene hasta que el revisor responde
7. Ante `accept`, `edit` o `refuse`, el ejecutor se reconstruye a partir de la instantánea almacenada
8. El agente pausado continúa con el contexto de revisión aprobado, o finaliza de inmediato ante `refuse`
9. Los nodos posteriores continúan una vez que el agente reanudado finaliza, sin volver a ejecutar la rama `review`
10. Si una acción posterior también requiere aprobación, el agente puede crear otro checkpoint HITL en la misma ejecución

El resumen dirigido al revisor se genera a partir de la propia solicitud de revisión, de modo que el campo del nodo puede mantenerse centrado en la política de aprobación y el momento de aplicación.

Esto permite que los workflows de agentes esperen una aprobación externa mientras conservan el historial de conversación, las salidas de nodos ya completados, el estado de los bucles y otro contexto de ejecución.

## Ejecutor de herramientas del orquestador

El ejecutor de herramientas personalizado enruta:

- **Llamadas a sub-agentes** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Llamadas a sub-workflows** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Herramientas de nodos del canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revisión humana** (`_source == "hitl"`) → crea un checkpoint HITL pendiente
- **Otras herramientas** → `_unified_tool_executor` (herramientas de Python, MCP y skills)

Se utiliza cuando HITL está habilitado, cuando se configura `isOrchestrator` con `subAgentLabels`, o cuando se configura `subWorkflowIds`.

## Skills

Los Skills amplían el contexto del sistema del agente y pueden añadir herramientas de Python.

- **Estructura**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Contenido**: Se antepone a la instrucción del sistema (unido con `---`)
- **Herramientas de Python**: Para cada skill con archivos `.py`, se añade una herramienta `skill_{skill_name}`
- **Ejecución**: `skill_python_executor.py` ejecuta los scripts con `uv run python` en un directorio temporal; los argumentos se pasan como JSON por stdin y el resultado se devuelve como JSON por stdout

Los Skills pueden añadirse arrastrando un archivo `.zip` o `.md` sobre el área de Skills en la configuración del [Nodo de agente](../nodes/agent-node.md).

## MCP Client

El cliente MCP (Model Context Protocol) se conecta a servidores de herramientas externos.

- **Transportes**: `stdio` (comando + argumentos) o `sse` (url + headers)
- **Listar herramientas**: `list_mcp_tools` → `ClientSession.list_tools()` → convertido al formato de función de OpenAI con `_source: "mcp"`
- **Ejecutar**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultado mediante `_extract_tool_result`

Configure las conexiones MCP en la [Pestaña MCP](../tabs/mcp-tab.md) o en las `mcpConnections` del nodo de agente.

## Tool Calling

El servicio LLM ejecuta un bucle `execute_with_tools`:

1. **Comprobación de compresión de contexto** — antes de cada iteración, se estima el uso de tokens y se comprime si es necesario (véase más abajo)
2. Se llama al modelo con `tools` y `tool_choice: "auto"`
3. Si existen `tool_calls`: para cada llamada, se ejecuta `tool_executor(tool_def, name, args, timeout)`
4. Se añade el resultado de la herramienta a los mensajes y se repite
5. Se detiene cuando no hay más llamadas a herramientas o se alcanza `max_tool_iterations`

### Tool Dispatch

`_unified_tool_executor` enruta según `_source`:

| Origen | Manejador |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (predeterminado) | `execute_tool` (herramientas de código Python) |

Las herramientas utilizan el formato de function-calling de OpenAI: `name`, `description`, `parameters` (esquema JSON).

## Context Compression

Para evitar el desbordamiento de contexto en agentes de larga duración, Heym comprime automáticamente la lista acumulada de `messages` antes de cada iteración de herramientas.

### Algoritmo

1. **Estimar tokens**: `total_chars / 4` en todos los mensajes (rápido, sin necesidad de tokenizer)
2. **Comprobación de umbral**: si `estimated_tokens < context_limit × 0.80`, se omite la compresión
3. **Límite de contexto**: se intenta `client.models.retrieve(model).context_window`; en su defecto, se recurre a una tabla integrada (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.); valor predeterminado 128K
4. **Preservación de anclas**: se conservan siempre
   - El primer mensaje `system` (identidad e instrucciones del agente)
   - El primer mensaje `user` (tarea original)
   - El último mensaje `user` (instrucción más reciente)
5. **Resumir el intermedio**: todo lo que hay entre el primer y el último mensaje de usuario se serializa y se envía al mismo modelo con un prompt de resumen
6. **Reconstruir**: `[system, first_user, assistant(summary), last_user]`

La compresión se omite si hay menos de 2 mensajes de usuario distintos (no hay intermedio que resumir) o si la llamada de resumen al LLM falla (respaldo seguro: se devuelven los mensajes originales).

### Observabilidad

Cada evento de compresión se registra como:
- Una entrada `_context_compression` en `tool_calls_collected` → visible en el detalle de ejecución del Historial de ejecuciones
- Un evento `on_tool_call` con `phase: "compression"` → representado en el panel de Debug como `Context compressed (N messages → summary)`
- Una entrada de traza LLM `context.compression` → visible en la pestaña Trazas con estimaciones de tokens antes/después

Las llamadas a herramientas del agente también emiten una observabilidad más rica:

- Campos de ciclo de vida por llamada en `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregados en el resultado del agente (recuentos por estado más duración total/máxima); las entradas `_context_compression` se excluyen de esos recuentos
- Spans hijos de OpenTelemetry opcionales denominados `heym.agent.tool.execute` (véase [OpenTelemetry Tracing](./opentelemetry.md))
- Las cargas útiles de `tool_calls` persistidas en la traza LLM / historial de ejecuciones se redactan y se limitan en tamaño; el estado de reanudación HITL en vivo conserva los originales para el emparejamiento

## Relacionado

- [Por qué Heym](../getting-started/why-heym.md) – Orquestación multiagente a lo largo del ciclo de vida del agente
- [Nodo de agente](../nodes/agent-node.md) – Configuración y parámetros
- [Memoria persistente del agente](./agent-persistent-memory.md) – Grafo de conocimiento por nodo de agente y compartición entre pares
- [Human-in-the-Loop](./human-in-the-loop.md) – Enlaces de revisión, cargas útiles pendientes y comportamiento de reanudación
- [OpenTelemetry Tracing](./opentelemetry.md) – Spans de workflow, nodo y herramientas del agente
- [Tipos de nodo](./node-types.md) – Agente y nodos relacionados
- [Ejecución en paralelo](./parallel-execution.md) – Ejecución en paralelo basada en DAG y subagentes
- [Pestaña MCP](../tabs/mcp-tab.md) – Configurar conexiones MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` para subagentes
