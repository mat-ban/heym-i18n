# Condition

Uzel **Condition** větví workflow na základě výrazu if/else. Podle výsledku směruje na cestu true nebo false.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 2 (true, false) |
| Výstup | Předává vstup do zvolené větve |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `condition` | expression | Výraz podobný JavaScriptu (např. `$input.text.length > 0`) |

## Handly hran

- **Source handle `true`** – když se podmínka vyhodnotí jako truthy
- **Source handle `false`** – když se podmínka vyhodnotí jako falsy

## Operátory výrazů

Podporuje: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` atd. Viz [Expression DSL](../reference/expression-dsl.md).

## Příklad

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Propojte hrany s `sourceHandle: "true"` nebo `sourceHandle: "false"` pro směrování do různých větví.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Switch Node](./switch-node.md) – Vícenásobné směrování podle hodnoty
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe podmínek
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu pro podmínku
