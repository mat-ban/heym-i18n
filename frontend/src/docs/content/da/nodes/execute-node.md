# Execute

**Execute**-noden kalder et andet workflow (underordnet workflow) og sender input til det. Den anvendes til genanvendelig logik, ikke til datatransformation - til dette formål kan [Set](./set-node.md)-noden bruges.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `executeWorkflowId` | UUID | ID på det workflow der skal eksekveres |
| `executeInput` | expression | Enkelt input (til workflows med ét inputfelt) |
| `executeInputMappings` | array | `{ key, value }` til flere inputs. `key` = målets inputfeltnavn i workflowet. |
| `executeDoNotWait` | boolean | Når `true`, afsendes det underordnede workflow i baggrunden uden afventning. Output: `{ "status": "dispatched", "workflow_id": "..." }`. Standard: `false`. |

## Svarformat

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Vent ikke

Når `executeDoNotWait: true`, sender noden det underordnede workflow til en baggrundstråd og returnerer umiddelbart:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Det overordnede workflow fortsætter til den næste node uden afventning. Det underordnede workflows kørselsrecord skrives asynkront til historikken, når det er fuldført. Anvend denne funktion, når resultatet fra det underordnede workflow ikke skal bruges nedstrøms.

## Enkelt input

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Flere inputs

Når målets workflow har flere inputfelter, anvendes `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` skal matche målets workflows [Input](./input-node.md) `inputFields`-nøgler.

## Relateret

- [Canvas-funktioner](../reference/canvas-features.md) – Ekstraher til underordnet workflow for at oprette Execute-noder fra valgte noder
- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Input-node](./input-node.md) – Målworkflowets inputfelter
- [Set-node](./set-node.md) – Datatransformation (ikke workflowkald)
