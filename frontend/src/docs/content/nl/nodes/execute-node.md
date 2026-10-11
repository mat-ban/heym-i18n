# Execute

De **Execute**-node roept een andere workflow (sub-workflow) aan en geeft invoer door. Gebruik deze voor herbruikbare logica, niet voor datatransformatie—gebruik hiervoor [Set](./set-node.md).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `executeWorkflowId` | UUID | ID van de workflow die moet worden uitgevoerd |
| `executeInput` | expression | Enkele invoer (voor workflows met één invoerveld) |
| `executeInputMappings` | array | `{ key, value }` voor meerdere invoerwaarden. `key` = naam van het invoerveld van de doelworkflow. |
| `executeDoNotWait` | boolean | Wanneer `true`, wordt de sub-workflow op de achtergrond uitgevoerd zonder te wachten. Uitvoer: `{ "status": "dispatched", "workflow_id": "..." }`. Standaard: `false`. |

## Antwoordformaat

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

## Niet wachten

Wanneer `executeDoNotWait: true`, stuurt de node de sub-workflow naar een achtergrondthread en retourneert onmiddellijk:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

De bovenliggende workflow gaat verder naar de volgende node zonder te wachten. Het uitvoeringsrecord van de sub-workflow wordt asynchroon naar de trace geschreven zodra deze is voltooid. Gebruik dit wanneer het resultaat van de sub-workflow niet verderop nodig is.

## Enkele invoer

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

## Meerdere invoerwaarden

Wanneer de doelworkflow meerdere invoervelden heeft, gebruik `executeInputMappings`:
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

De `key` moet overeenkomen met de `inputFields`-keys van de [Input](./input-node.md) van de doelworkflow.

## Gerelateerd

- [Canvas-functies](../reference/canvas-features.md) – Extract to Sub-Workflow om Execute-nodes te maken van geselecteerde nodes
- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Input-node](./input-node.md) – Invoervelden van de doelworkflow
- [Set-node](./set-node.md) – Datatransformatie (geen workflowaanroepen)
