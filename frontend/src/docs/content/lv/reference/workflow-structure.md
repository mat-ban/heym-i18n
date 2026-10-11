# Workflow struktūra

Workflows tiek glabāti kā JSON ar nodes un edges. Skatiet [Node Types](./node-types.md), lai uzzinātu pieejamos node tipus, un [Expression DSL](./expression-dsl.md), lai uzzinātu izteiksmju sintaksi `data` laukos.

## Workflow objekts

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

## Node objekts

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

### Agent node `data` (pastāvīgā atmiņa)

[Agent](../nodes/agent-node.md) nodes atbalsta neobligātu zināšanu grafu katram kanvas node:

| Lauks | Tips | Apraksts |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kad `true`, ielādē saglabāto grafu sistēmas prompt un apvieno jaunus faktus pēc veiksmīgām izpildēm |
| `memoryShares` | array (neobligāts) | Piešķir citiem agentiem piekļuvi šī node atmiņas grafam (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Skatiet [Agent Persistent Memory](./agent-persistent-memory.md). |

Piemērs:

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

Skatiet [Agent Persistent Memory](./agent-persistent-memory.md), lai uzzinātu par API ceļiem, redaktora darbību un ekstrakcijas semantiku.

## Edge objekts

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Node tipi

Biežākās `type` vērtības: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) un citi. Pilns saraksts: [Node Types](./node-types.md). Nodes vienā izpildes līmenī darbojas [paralēli](./parallel-execution.md).

## Redaktora izkārtojums

Katram node ir `position.x` un `position.y` darbvirsmas kanvas izkārtojumam. Ekrānos, kas ir šaurāki par
768px pārtraukuma punktu, redaktors aizstāj brīvformas Vue Flow kanvu ar pilnekrāna, atkāpēm veidotu
workflow koku. Koks seko savienotajiem izpildes ceļiem, atzīmē paralēlos zarus un izmanto
tos pašus node apzīmējumus, ikonas un jaunākā izpildes statusu kā darbvirsmas redaktors.

Pieskarieties node, lai to atlasītu. Ja tam ir reģistrēts izpildes rezultāts, tā pilnekrāna detaļas tiek atvērtas ar
ievades, izvades un kļūdu cilnēm. Mobilā apakšējā navigācija nodrošina **Nodes**, **Properties**,
**Run** un **More**; galvenē joprojām ir saglabāšanas, vēstures, meklēšanas, iestatījumu un kopīgošanas darbības.
Darbvirsma turpina izmantot brīvformas Vue Flow kanvu un sānu panel̦us.

Izmantojiet **Add node** mobilajā Nodes cilnē, lai meklētu node bibliotēkā. Parasts node atver
savienojuma lapu uzreiz pēc tā pievienošanas: izvēlieties enkursakarību node un novietojiet to **After**,
**Before** vai kā **Parallel** zaru. Rediģēšanas režīmā pieskarieties esošam parastam node, lai atvērtu to pašu
lapu ar tā pašreizējo savienojumu atlasītu. Trigger nodes paliek neatkarīgi, jo tie nepieņem
parastu ievadi. Rediģēšanas vadīkla arī piedāvā noņemšanas darbību atlasītajam node. Izpildes detaļas
ietver iepriekšējās un nākamās bultiņas, kad blakus esošo
node rezultāti ir pieejami. AI Assistant tiek atvērts virs mobilā koka kā apakšējā lapa, nemainot aktīvo redaktora cilni.

## Saistītie

- [Node Types](./node-types.md) – Visi node tipi un apraksti
- [Canvas Features](./canvas-features.md) – Redaktora funkcijas (data pin, izpildes žurnāli, iespējot/atspējot, izvilkt apakš-workflow)
- [Download & Import](./download-import.md) – Eksportēt un importēt workflows kā JSON
- [Agent Node](../nodes/agent-node.md) – Agent node `data` struktūra
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` un atmiņas grafa API
- [Expression DSL](./expression-dsl.md) – Sintakse `userMessage`, `condition`, `$vars`, `$global` utt.
- [Parallel Execution](./parallel-execution.md) – Kā nodes darbojas paralēli
- [Triggers](./triggers.md) – Sākuma nodes un ieejas punkti
- [Workflows Tab](../tabs/workflows-tab.md) – Izveidot un pārvaldīt workflows
