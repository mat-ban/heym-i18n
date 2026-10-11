# Workflow-struktur

Workflows gemmes som JSON med noder og kanter. Se [Node-typer](./node-types.md) for tilgængelige node-typer og [Expression DSL](./expression-dsl.md) for syntaksen i `data`-felter.

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

## Node-objekt

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

### Agent-node `data` (vedvarende hukommelse)

[Agent](../nodes/agent-node.md)-noder understøtter en valgfri vidensgraf pr. canvas-node:

| Felt | Type | Beskrivelse |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Når `true`, indlæses den gemte graf i system-prompten og nye fakta flettes ind efter vellykkede kørsler |
| `memoryShares` | array (valgfri) | Giver andre agenter adgang til denne nodes hukommelsesgraf (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Se [Agent Persistent Memory](./agent-persistent-memory.md). |

Eksempel:

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

Se [Agent Persistent Memory](./agent-persistent-memory.md) for API-stier, editor-adfærd og ekstraktionssemantik.

## Edge-objekt

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Node-typer

Almindelige `type`-værdier: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), og flere. Fuld liste: [Node-typer](./node-types.md). Noder på samme eksekveringsniveau kører [parallelt](./parallel-execution.md).

## Editor-layout

Hver node har `position.x` og `position.y` for desktop-canvas-layoutet. På skærme under 768px erstattes den frie Vue Flow-canvas med et fuldskærms, indrykket workflow-træ. Træet følger forbundne eksekveringsstier, markerer parallelle grene og bruger samme node-etiketter, ikoner og seneste kørselsstatus som desktop-editoren.

Tryk på en node for at vælge den. Hvis den har en registreret eksekveringsresultat, åbnes dens fuldskærmsdetaljer med input-, output- og fejl-faner. Den mobile bundnavigation giver adgang til **Noder**, **Egenskaber**, **Kør** og **Mere**; headeren bevarer gem, historik, søgning, indstillinger og delingshandlinger. Desktop fortsætter med at bruge den frie Vue Flow-canvas og sidepaneler.

Brug **Tilføj node** i den mobile Noder-fane for at søge i nodebiblioteket. En almindelig node åbner en forbindelsesbånd umiddelbart efter tilføjelse: vælg en anker-node og placer den **Efter**, **Før** eller som en **Parallel** gren. I redigeringstilstand trykkes på en eksisterende node for at åbne samme bånd med dens nuværende forbindelse valgt. Trigger-noder forbliver uafhængige, da de ikke accepterer regulært input. Redigeringskontrollen viser også en fjern-handling for den valgte node. Eksekveringsdetaljer inkluderer pile til forrige og næste node, når tilstødende node-resultater er tilgængelige. AI-assistenten åbnes over det mobile træ som en bundbånd uden at ændre den aktive editor-fane.

## Relateret

- [Node-typer](./node-types.md) – Alle node-typer og beskrivelser
- [Canvas-funktioner](./canvas-features.md) – Editor-funktioner (datapin, eksekveringslogs, aktiver/deaktiver, ekstraher til under-workflow)
- [Download & Import](./download-import.md) – Eksport og import af workflows som JSON
- [Agent-node](../nodes/agent-node.md) – Agent-node `data`-struktur
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` og hukommelsesgraf-API
- [Expression DSL](./expression-dsl.md) – Syntaks for `userMessage`, `condition`, `$vars`, `$global` osv.
- [Parallel Execution](./parallel-execution.md) – Hvordan noder kører parallelt
- [Triggers](./triggers.md) – Start-noder og indgangspunkter
- [Workflows-fane](../tabs/workflows-tab.md) – Opret og administrer workflows
