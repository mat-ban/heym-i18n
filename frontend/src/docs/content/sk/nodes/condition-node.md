# Podmienka

Uzol **Podmienka** vetví workflow na základe výrazu if/else. Smeruje na cestu true alebo false v závislosti od výsledku.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 2 (true, false) |
| Výstup | Prechádza vstup do zvolenej vetvy |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `condition` | expression | Výraz podobný JavaScriptu (napr. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – keď sa podmienka vyhodnotí ako truthy
- **Source handle `false`** – keď sa podmienka vyhodnotí ako falsy

## Operátory výrazov

Podporuje: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` atď. Pozrite si [Expression DSL](../reference/expression-dsl.md).

## Príklad

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Prepojte hrany s `sourceHandle: "true"` alebo `sourceHandle: "false"` na smerovanie do rôznych vetiev.

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Switch Node](./switch-node.md) – Viacsmerné smerovanie podľa hodnoty
- [Expression DSL](../reference/expression-dsl.md) – Syntax podmienok
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor s live náhľadom backendu pre podmienku
