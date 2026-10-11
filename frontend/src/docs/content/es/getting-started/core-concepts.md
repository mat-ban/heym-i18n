# Conceptos Básicos

## Workflows

Un workflow es un grafo dirigido de [**nodos**](../reference/node-types.md) conectados por **aristas**. Gestione los workflows en la pestaña [Workflows](../tabs/workflows-tab.md). Organícelos en [carpetas](../reference/workflow-organization.md). La ejecución fluye desde los [nodos trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) a través de los nodos de procesamiento hasta los nodos de [salida](../nodes/output-node.md). Consulte [Workflow Structure](../reference/workflow-structure.md) para conocer el formato JSON. Guarde y comparta workflows como [Plantillas](../tabs/templates-tab.md) para reutilizarlos entre proyectos. Los workflows también pueden ejecutarse desde el [Board](../tabs/board-tab.md), donde las tarjetas kanban activan la cadena de workflows de una columna con el contexto completo de la tarjeta.

## Nodos

Cada nodo tiene:

- **Type** – Determina el comportamiento (p. ej. `llm`, `condition`, `http`)
- **Data** – Configuración (modelo, prompt, URL, etc.)
- **Inputs/Outputs** – Conectores para enlazar con otros nodos

Consulte [Node Types](../reference/node-types.md) para ver la lista completa.

## Aristas

Las aristas conectan el conector de salida de un nodo origen con el conector de entrada de un nodo destino. Los datos fluyen a lo largo de las aristas durante la ejecución.

## Flujo de Ejecución

1. **Trigger** – Un nodo Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger o [WebSocket Trigger](../nodes/websocket-trigger-node.md) inicia la ejecución (consulte [Triggers](../reference/triggers.md))
2. **Downstream** – Cada nodo recibe la salida de los nodos upstream conectados; la [ejecución en paralelo](../reference/parallel-execution.md) ejecuta nodos independientes de forma concurrente
3. **Expresiones** – Los nodos referencian datos upstream mediante `$nodeLabel.field`. Consulte [Expression DSL](../reference/expression-dsl.md).
4. **Salida** – El nodo [Output](../nodes/output-node.md) produce el resultado final

## Referencias de Expresiones

Utilice `$input` para los datos del nodo Input y `$nodeLabel.field` para cualquier nodo upstream. Ejemplo: `$llm.text` referencia el campo `text` de un nodo etiquetado como "llm". Sintaxis completa: [Expression DSL](../reference/expression-dsl.md). Utilice el [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) para disponer de un editor más amplio con vista previa en vivo del backend al editar expresiones.

## Relacionado

- [Quick Start](./quick-start.md) – Cree su primer workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, registros de ejecución, habilitar/deshabilitar, extraer a sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Cree workflows con lenguaje natural
- [Node Types](../reference/node-types.md) – Todos los nodos disponibles
- [Expression DSL](../reference/expression-dsl.md) – Referenciar datos en expresiones
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend
- [Workflows Tab](../tabs/workflows-tab.md) – Gestione workflows y carpetas
- [Workflow Organization](../reference/workflow-organization.md) – Carpetas y eliminación programada
- [Triggers](../reference/triggers.md) – Puntos de entrada para los workflows
- [Webhooks](../reference/webhooks.md) – Trigger de webhook HTTP (TTL, caché, límite de tasa)
- [Parallel Execution](../reference/parallel-execution.md) – Cómo se ejecutan los nodos en paralelo
