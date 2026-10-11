# Execute

**Execute** mezgls izsauc citu workflow (apakš-workflow) un nodod tam ievadi. Izmantojiet to atkārtoti lietojamai loģikai, nevis datu transformācijai — šim nolūkam izmantojiet [Set](./set-node.md).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `executeWorkflowId` | UUID | Izpildāmā workflow ID |
| `executeInput` | expression | Viena ievade (workflow ar vienu ievades lauku) |
| `executeInputMappings` | array | `{ key, value }` vairākām ievadēm. `key` = mērķa workflow ievades lauka nosaukums. |
| `executeDoNotWait` | boolean | Ja `true`, apakš-workflow tiek nosūtīts fona pavedienā, negaidot. Izvade: `{ "status": "dispatched", "workflow_id": "..." }`. Noklusējums: `false`. |

## Atbildes formāts

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

## Negaidīt

Kad `executeDoNotWait: true`, mezgls nosūta apakš-workflow uz fona pavedienu un nekavējoties atgriež:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Vecāku workflow turpina uz nākamo mezglu, negaidot. Apakš-workflow izpildes ieraksts tiek asinhroni ierakstīts trace, kad tas pabeidzas. Izmantojiet to, ja apakš-workflow rezultāts nav nepieciešams tālākajā plūsmā.

## Viena ievade

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

## Vairākas ievades

Kad mērķa workflow ir vairāki ievades lauki, izmantojiet `executeInputMappings`:
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

`key` ir jāatbilst mērķa workflow [Input](./input-node.md) `inputFields` atslēgām.

## Saistītie

- [Canvas Features](../reference/canvas-features.md) – Extract to Sub-Workflow, lai izveidotu Execute mezglus no atlasītajiem mezgliem
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Input Node](./input-node.md) – Mērķa workflow ievades lauki
- [Set Node](./set-node.md) – Datu transformācija (nevis workflow izsaukumi)
