# Execute

Noden **Execute** anropar ett annat workflow (sub-workflow) och skickar indata till det. Använd den för återanvändbar logik, inte för datatransformering—använd [Set](./set-node.md) för det.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `executeWorkflowId` | UUID | ID för workflowet som ska köras |
| `executeInput` | expression | Enkel indata (för workflows med ett indatafält) |
| `executeInputMappings` | array | `{ key, value }` för flera indata. `key` = målworkflowets indatafältnamn. |
| `executeDoNotWait` | boolean | När `true` skickas sub-workflowet i bakgrunden utan att vänta. Utdata: `{ "status": "dispatched", "workflow_id": "..." }`. Standard: `false`. |

## Svarsformat

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

## Vänta inte

När `executeDoNotWait: true` skickar noden sub-workflowet till en bakgrundstråd och returnerar omedelbart:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Det överordnade workflowet fortsätter till nästa nod utan att vänta. Sub-workflowets körningspost skrivs till spårningen asynkront när det slutförs. Använd detta när sub-workflowets resultat inte behövs nedströms.

## Enkel indata

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

## Flera indata

När målworkflowet har flera indatafält används `executeInputMappings`:
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

`key` måste matcha målworkflowets [Input](./input-node.md) `inputFields`-nycklar.

## Relaterat

- [Canvas-funktioner](../reference/canvas-features.md) – Extrahera till sub-workflow för att skapa Execute-noder från valda noder
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Input-nod](./input-node.md) – Målworkflowets indatafält
- [Set-nod](./set-node.md) – Datatransformering (inte workflow-anrop)
