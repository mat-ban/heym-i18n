# Workflow-structuur

Workflows worden opgeslagen als JSON met knooppunten en randen. Zie [Node Types](./node-types.md) voor de beschikbare knooppunttypen en [Expression DSL](./expression-dsl.md) voor de expressiesyntaxis in `data`-velden.

## Workflow-object

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

## Knooppuntobject

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

### Agent-knooppunt `data` (persistent geheugen)

[Agent](../nodes/agent-node.md)-knooppunten ondersteunen een optionele knowledge graph per canvas-knooppunt:

| Veld | Type | Beschrijving |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Wanneer `true`, wordt de opgeslagen graph in de system prompt geladen en worden nieuwe feiten na succesvolle uitvoeringen samengevoegd |
| `memoryShares` | array (optioneel) | Verleent andere agenten toegang tot de memory graph van dit knooppunt (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Zie [Agent Persistent Memory](./agent-persistent-memory.md). |

Voorbeeld:

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

Zie [Agent Persistent Memory](./agent-persistent-memory.md) voor API-paden, editor-gedrag en extractiesemantiek.

## Edge-object

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Knooppunttypen

Veelvoorkomende `type`-waarden: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), en meer. Volledige lijst: [Node Types](./node-types.md). Knooppunten op hetzelfde uitvoeringsniveau worden [parallel](./parallel-execution.md) uitgevoerd.

## Editor-indeling

Elk knooppunt heeft `position.x` en `position.y` voor de indeling van het desktop-canvas. Op schermen onder het breekpunt van 768px vervangt de editor het vrije Vue Flow-canvas door een volledig scherm met een ingesprongen workflow-boomstructuur. De boomstructuur volgt verbonden uitvoeringspaden, markeert parallelle vertakkingen en gebruikt dezelfde knooppuntlabels, pictogrammen en de status van de laatste uitvoering als de desktop-editor.

Tik op een knooppunt om het te selecteren. Als er een opgenomen uitvoeringsresultaat is, wordt de volledige schermdetailweergave geopend met tabbladen voor invoer, uitvoer en fouten. De mobiele navigatie onderaan biedt **Nodes**, **Properties**, **Run** en **More**; de koptekst behoudt de acties voor opslaan, geschiedenis, zoeken, instellingen en delen. Op desktop wordt het vrije Vue Flow-canvas met zijpanelen gebruikt.

Gebruik **Add node** op het mobiele tabblad Nodes om de knooppuntbibliotheek te doorzoeken. Een regulier knooppunt opent direct na toevoeging een verbindingsvenster: kies een ankerknooppunt en plaats het **After**, **Before** of als een **Parallel**-vertakking. In de bewerkingsmodus opent een tik op een bestaand regulier knooppunt hetzelfde venster met de huidige verbinding geselecteerd. Trigger-knooppunten blijven onafhankelijk omdat ze geen reguliere invoer accepteren. Het bewerkingselement biedt ook een verwijderactie voor het geselecteerde knooppunt. Uitvoeringsdetails bevatten pijlen voor vorige en volgende wanneer aangrenzende knooppuntresultaten beschikbaar zijn. De AI Assistant opent boven de mobiele boomstructuur als een bottom sheet, zonder het actieve editor-tabblad te wijzigen.

## Gerelateerd

- [Node Types](./node-types.md) – Alle knooppunttypen en beschrijvingen
- [Canvas Features](./canvas-features.md) – Editor-functies (data pin, uitvoeringslogboeken, in-/uitschakelen, extraheren naar sub-workflow)
- [Download & Import](./download-import.md) – Workflows exporteren en importeren als JSON
- [Agent Node](../nodes/agent-node.md) – `data`-structuur van Agent-knooppunt
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` en memory graph API
- [Expression DSL](./expression-dsl.md) – Syntaxis voor `userMessage`, `condition`, `$vars`, `$global`, enz.
- [Parallel Execution](./parallel-execution.md) – Hoe knooppunten parallel worden uitgevoerd
- [Triggers](./triggers.md) – Startknooppunten en toegangspunten
- [Workflows Tab](../tabs/workflows-tab.md) – Workflows aanmaken en beheren
