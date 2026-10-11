# Estructura del Workflow

Els Workflows s'emmagatzemen com a JSON amb nodes i arestes. Consulteu [Node Types](./node-types.md) per als tipus de Node disponibles i [Expression DSL](./expression-dsl.md) per a la sintaxi d'expressions als camps `data`.

## Objecte Workflow

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

## Objecte Node

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

### `data` del Node Agent (memòria persistent)

Els Nodes [Agent](../nodes/agent-node.md) admeten un graf de coneixement opcional per node del canvas:

| Camp | Tipus | Descripció |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Quan és `true`, carrega el graf emmagatzemat al system prompt i fusiona els fets nous després d'execucions correctes |
| `memoryShares` | array (opcional) | Concedeix a altres agents accés al graf de memòria d'aquest node (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Consulteu [Agent Persistent Memory](./agent-persistent-memory.md). |

Exemple:

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

Consulteu [Agent Persistent Memory](./agent-persistent-memory.md) per als camins de l'API, el comportament de l'editor i la semàntica d'extracció.

## Objecte Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipus de Node

Valors comuns de `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), i més. Llista completa: [Node Types](./node-types.md). Els Nodes del mateix nivell d'execució s'executen en [paral·lel](./parallel-execution.md).

## Disposició de l'editor

Cada node té `position.x` i `position.y` per a la disposició del canvas d'escriptori. En pantalles per sota del breakpoint de 768px, l'editor substitueix el canvas Vue Flow de forma lliure per un arbre de workflow indentat a pantalla completa. L'arbre segueix els camins d'execució connectats, marca les branques paral·leles i utilitza les mateixes etiquetes de node, icones i estat de l'última execució que l'editor d'escriptori.

Toqueu un node per seleccionar-lo. Si té un resultat d'execució registrat, el seu detall a pantalla completa s'obre amb pestanyes d'entrada, sortida i error. La navegació inferior mòbil proporciona **Nodes**, **Properties**, **Run** i **More**; la capçalera conserva les accions de desar, historial, cerca, configuració i compartir. L'escriptori continua utilitzant el canvas Vue Flow de forma lliure i els panells laterals.

Utilitzeu **Add node** a la pestanya Nodes mòbil per cercar a la biblioteca de nodes. Un node regular obre un full de connexió immediatament després d'afegir-lo: trieu un node d'ancoratge i col·loqueu-lo **After**, **Before** o com a branca **Parallel**. En mode d'edició, toqueu un node regular existent per obrir el mateix full amb la seva connexió actual seleccionada. Els Nodes Trigger es mantenen independents perquè no accepten entrada regular. El control d'edició també exposa una acció d'eliminació per al node seleccionat. Els detalls d'execució inclouen fletxes anterior i següent quan els resultats dels nodes adjacents estan disponibles. L'AI Assistant s'obre per sobre de l'arbre mòbil com un full inferior, sense canviar la pestanya activa de l'editor.

## Relacionat

- [Node Types](./node-types.md) – Tots els tipus de Node i descripcions
- [Canvas Features](./canvas-features.md) – Funcions de l'editor (data pin, registres d'execució, habilitar/deshabilitar, extreure a sub-workflow)
- [Download & Import](./download-import.md) – Exportar i importar workflows com a JSON
- [Agent Node](../nodes/agent-node.md) – Estructura `data` del Node Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` i API del graf de memòria
- [Expression DSL](./expression-dsl.md) – Sintaxi per a `userMessage`, `condition`, `$vars`, `$global`, etc.
- [Parallel Execution](./parallel-execution.md) – Com s'executen els nodes en paral·lel
- [Triggers](./triggers.md) – Nodes d'inici i punts d'entrada
- [Workflows Tab](../tabs/workflows-tab.md) – Crear i gestionar workflows
