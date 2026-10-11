# Switch

De **Switch**-node routeert de uitvoering naar verschillende paden op basis van het matchen van een waarde tegen cases. Ondersteunt N cases plus een standaardoptie.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | n (één per case + standaard) |
| Uitvoer | Geeft invoer door aan de gematchte vertakking |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `expression` | expression | Waarde om te evalueren (bijv. `$input.category`) |
| `cases` | string[] | Case-waarden om te matchen (bijv. `["case1", "case2", "case3"]`) |

## Edge-handles

- Elke case krijgt een source-handle (index 0, 1, 2, …)
- Standaard-handle voor niet-overeenkomende waarden

## Voorbeeld

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Verbind edges met `sourceHandle` ingesteld op de case-index (0, 1, 2) of de standaard-handle voor niet-overeenkomende waarden.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Condition-node](./condition-node.md) – If/else-vertakking
- [Expression DSL](../reference/expression-dsl.md) – Expressiesyntaxis
