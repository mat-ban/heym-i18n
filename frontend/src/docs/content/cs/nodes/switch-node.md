# Switch

Uzel **Switch** směruje spuštění do různých cest na základě porovnání hodnoty s případy. Podporuje N případů plus výchozí větev.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | n (jeden pro každý případ + výchozí) |
| Výstup | Předává vstup do odpovídající větve |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `expression` | expression | Hodnota k vyhodnocení (např. `$input.category`) |
| `cases` | string[] | Hodnoty případů k porovnání (např. `["case1", "case2", "case3"]`) |

## Handly hran

- Každý případ získá zdrojový handle (index 0, 1, 2, …)
- Výchozí handle pro neodpovídající hodnoty

## Příklad

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

Propojte hrany s `sourceHandle` nastaveným na index případu (0, 1, 2) nebo na výchozí handle pro neodpovídající hodnoty.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Uzel Condition](./condition-node.md) – Větvení if/else
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe výrazů
