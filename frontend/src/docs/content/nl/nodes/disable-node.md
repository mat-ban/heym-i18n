# Node uitschakelen

De node **Node uitschakelen** schakelt een andere node in de workflow permanent uit. Bij uitvoering wordt de `active`-eigenschap van de doelnode op `false` gezet en wordt de wijziging persistent opgeslagen. Gebruik deze node voor eenmalige bewerkingen, zoals het stoppen van een cron-trigger nadat aan een voorwaarde is voldaan.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `targetNodeLabel` | string | Label van de node die moet worden uitgeschakeld (bijv. `hourlyCheck`) |

## Gebruiksscenario

Schakel een [Cron](./cron-node.md)-trigger uit nadat aan een voorwaarde is voldaan, zodat deze niet meer wordt uitgevoerd bij toekomstige workflow-uitvoeringen. Schakel de trigger later weer in met [Node inschakelen](./enable-node.md).

## Voorbeeld

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Stroom: Cron → HTTP-controle → Voorwaarde (status voltooid?) → indien waar: Node uitschakelen (doel: cron) → Uitvoer.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Node inschakelen](./enable-node.md) – Een uitgeschakelde node weer inschakelen
- [Cron-node](./cron-node.md) – Trigger om uit te schakelen
- [Voorwaarde-node](./condition-node.md) – Vertakking vóór het uitschakelen
