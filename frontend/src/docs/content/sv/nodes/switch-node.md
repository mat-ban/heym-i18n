# Switch

Noden **Switch** dirigerar körning till olika vägar baserat på matchning av ett värde mot olika fall. Stöder N antal fall plus en standardväg.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 1 |
| Utmatningar | n (en per fall + standard) |
| Utmatning | Skickar vidare inmatning till den matchade grenen |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `expression` | expression | Värde som ska utvärderas (t.ex. `$input.category`) |
| `cases` | string[] | Fallvärden att matcha (t.ex. `["case1", "case2", "case3"]`) |

## Kantreferenser

- Varje fall tilldelas en källreferens (index 0, 1, 2, …)
- Standardreferens för värden som inte matchar

## Exempel

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

Anslut kanter med `sourceHandle` satt till fallindexet (0, 1, 2) eller standardreferensen för värden som inte matchar.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Condition-nod](./condition-node.md) – If/else-förgrening
- [Expression DSL](../reference/expression-dsl.md) – Syntax för uttryck
