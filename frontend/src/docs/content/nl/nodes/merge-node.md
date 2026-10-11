# Merge

De **Merge**-node wacht op meerdere parallelle invoeren en combineert deze tot één enkele uitvoer. Gebruik deze wanneer u resultaten van parallelle vertakkingen wilt samenvoegen voordat u verdergaat.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoeren | n (configureerbaar) |
| Uitvoeren | 1 |
| Uitvoer | `$nodeLabel.merged` – object met invoeren van elke vertakking |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `inputCount` | number | Aantal invoeren om op te wachten (standaard: 2) |

## Wanneer te gebruiken

- Gebruik deze wanneer u resultaten van parallelle vertakkingen wilt **combineren** of **samenvoegen**
- Gebruik deze **niet** voor parallelle workflows die eindigen met afzonderlijke [Output](./output-node.md)-nodes
- Elke invoervertakking draagt bij aan de samengevoegde uitvoer

## Voorbeeld

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Verbind meerdere vertakkingen met de merge-node. De node wacht op alle invoeren voordat uitvoer wordt geproduceerd.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Parallel Execution](../reference/parallel-execution.md) – Hoe parallelle vertakkingen worden uitgevoerd
- [Workflow Structure](../reference/workflow-structure.md) – Edges en handles
