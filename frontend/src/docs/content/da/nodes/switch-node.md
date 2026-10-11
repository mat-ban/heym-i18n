# Switch

**Switch**-noden dirigerer kørslen til forskellige stier baseret på sammenligning af en værdi med cases. Understøtter N cases plus en standardsti.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | n (én per case + standard) |
| Output | Videregiver input til den matchende gren |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `expression` | expression | Værdi der evalueres (f.eks. `$input.category`) |
| `cases` | string[] | Case-værdier der matches (f.eks. `["case1", "case2", "case3"]`) |

## Edge Handles

- Hver case får en source handle (index 0, 1, 2, …)
- Standard handle for ikke-matchende værdier

## Eksempel

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

Forbind edges med `sourceHandle` sat til case-index (0, 1, 2) eller standard-handlen for ikke-matchende værdier.

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Condition Node](./condition-node.md) – If/else-forgrening
- [Expression DSL](../reference/expression-dsl.md) – Expressionssyntaks
