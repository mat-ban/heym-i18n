# Workflow-struktur

Workflows lagras som JSON med noder och kanter. Se [Nodtyper](./node-types.md) för tillgängliga nodtyper och [Expression DSL](./expression-dsl.md) för uttryckssyntax i `data`-fält.

## Workflow-objekt

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

## Nod-objekt

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

### Agent-nodens `data` (beständigt minne)

[Agent](../nodes/agent-node.md)-noder stöder en valfri kunskapsgraf per canvas-nod:

| Fält | Typ | Beskrivning |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | När `true` laddas den lagrade grafen in i system-prompten och nya fakta sammanfogas efter lyckade körningar |
| `memoryShares` | array (valfritt) | Ger andra agenter åtkomst till denna nods minnesgraf (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Se [Agent Persistent Memory](./agent-persistent-memory.md). |

Exempel:

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

Se [Agent Persistent Memory](./agent-persistent-memory.md) för API-sökvägar, redigeringsbeteende och extraheringssemantik.

## Kant-objekt

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Nodtyper

Vanliga `type`-värden: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) och fler. Fullständig lista: [Nodtyper](./node-types.md). Noder på samma körningsnivå körs [parallellt](./parallel-execution.md).

## Redigerarens layout

Varje nod har `position.x` och `position.y` för layouten på skrivbords-canvasen. På skärmar under
brytpunkten 768px ersätter redigeraren den fria Vue Flow-canvasen med ett fullskärmsträd för
workflow med indrag. Trädet följer anslutna körningsvägar, markerar parallella grenar och använder
samma nodetiketter, ikoner och senaste körningsstatus som skrivbordsredigeraren.

Tryck på en nod för att markera den. Om den har ett registrerat körningsresultat öppnas dess
fullskärmsdetalj med flikarna input, output och error. Den mobila bottennavigeringen tillhandahåller **Nodes**, **Properties**,
**Run** och **More**; sidhuvudet behåller åtgärderna för spara, historik, sökning, inställningar och delning.
Skrivbordet fortsätter att använda den fria Vue Flow-canvasen och sidopaneler.

Använd **Add node** i den mobila fliken Nodes för att söka i nodbiblioteket. En vanlig nod öppnar ett
anslutningsblad direkt efter att den har lagts till: välj en ankarnod och placera den **After**,
**Before** eller som en **Parallel**-gren. I redigeringsläge öppnar ett tryck på en befintlig vanlig nod samma
blad med dess nuvarande anslutning vald. Trigger-noder förblir oberoende eftersom de inte accepterar
vanlig input. Redigeringskontrollen exponerar även en borttagningsåtgärd för den valda noden. Körningsdetaljer
inkluderar föregående och nästa pilar när intilliggande
nodresultat är tillgängliga. AI Assistant öppnas ovanför det mobila trädet som ett bottenblad, utan
att ändra den aktiva redigeringsfliken.

## Relaterat

- [Nodtyper](./node-types.md) – Alla nodtyper och beskrivningar
- [Canvas-funktioner](./canvas-features.md) – Redigeringsfunktioner (data pin, körningsloggar, aktivera/inaktivera, extrahera till sub-workflow)
- [Download & Import](./download-import.md) – Exportera och importera workflows som JSON
- [Agent-nod](../nodes/agent-node.md) – Agent-nodens `data`-struktur
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` och minnesgraf-API
- [Expression DSL](./expression-dsl.md) – Syntax för `userMessage`, `condition`, `$vars`, `$global` etc.
- [Parallell körning](./parallel-execution.md) – Hur noder körs parallellt
- [Triggers](./triggers.md) – Startnoder och ingångspunkter
- [Fliken Workflows](../tabs/workflows-tab.md) – Skapa och hantera workflows
