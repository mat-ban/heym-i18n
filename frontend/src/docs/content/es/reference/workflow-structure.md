# Estructura de Workflow

Los Workflows se almacenan como JSON con nodos y edges. Consulte [Tipos de Nodo](./node-types.md) para conocer los tipos de nodo disponibles y [Expression DSL](./expression-dsl.md) para la sintaxis de expresiones en los campos `data`.

## Objeto Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objeto Node

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### `data` del Nodo de agente (memoria persistente)

Los nodos [Agent](../nodes/agent-node.md) admiten un grafo de conocimiento opcional por cada nodo del canvas:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Cuando es `true`, carga el grafo almacenado en el system prompt y fusiona los nuevos hechos tras las ejecuciones exitosas |
| `memoryShares` | array (opcional) | Otorga a otros agentes acceso al grafo de memoria de este nodo (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Consulte [Agent Persistent Memory](./agent-persistent-memory.md). |

Ejemplo:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Consulte [Agent Persistent Memory](./agent-persistent-memory.md) para conocer las rutas de API, el comportamiento del editor y la semántica de extracción.

## Objeto Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipos de Nodo

Valores comunes de `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), y más. Lista completa: [Tipos de Nodo](./node-types.md). Los nodos del mismo nivel de ejecución se ejecutan en [paralelo](./parallel-execution.md).

## Diseño del editor

Cada nodo tiene `position.x` y `position.y` para el diseño del canvas de escritorio. En pantallas por debajo del
breakpoint de 768px, el editor reemplaza el canvas libre de Vue Flow por un árbol de workflow a pantalla completa
con sangría. El árbol sigue las rutas de ejecución conectadas, marca las ramas paralelas y utiliza las mismas
etiquetas de nodo, iconos y estado de la última ejecución que el editor de escritorio.

Toque un nodo para seleccionarlo. Si tiene un resultado de ejecución registrado, se abre su detalle a pantalla completa
con las pestañas de entrada, salida y error. La navegación inferior móvil ofrece **Nodes**, **Properties**,
**Run** y **More**; el encabezado conserva las acciones de guardar, historial, búsqueda, configuración y compartir.
El escritorio continúa utilizando el canvas libre de Vue Flow y los paneles laterales.

Utilice **Add node** en la pestaña Nodes móvil para buscar en la biblioteca de nodos. Un nodo regular abre una
hoja de conexión inmediatamente después de añadirse: elija un nodo ancla y colóquelo **After**,
**Before** o como una rama **Parallel**. En modo de edición, toque un nodo regular existente para abrir la misma
hoja con su conexión actual seleccionada. Los nodos Trigger permanecen independientes porque no aceptan
entrada regular. El control de edición también expone una acción de eliminación para el nodo seleccionado. Los detalles de ejecución
incluyen flechas de anterior y siguiente cuando los resultados de nodos adyacentes
están disponibles. El AI Assistant se abre sobre el árbol móvil como una hoja inferior, sin
cambiar la pestaña activa del editor.

## Relacionado

- [Tipos de Nodo](./node-types.md) – Todos los tipos de nodo y sus descripciones
- [Canvas Features](./canvas-features.md) – Funciones del editor (data pin, registros de ejecución, habilitar/deshabilitar, extraer a sub-workflow)
- [Download & Import](./download-import.md) – Exportar e importar workflows como JSON
- [Agent Node](../nodes/agent-node.md) – Estructura de `data` del Nodo de agente
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` y API del grafo de memoria
- [Expression DSL](./expression-dsl.md) – Sintaxis para `userMessage`, `condition`, `$vars`, `$global`, etc.
- [Parallel Execution](./parallel-execution.md) – Cómo se ejecutan los nodos en paralelo
- [Triggers](./triggers.md) – Nodos de inicio y puntos de entrada
- [Workflows Tab](../tabs/workflows-tab.md) – Crear y gestionar workflows
