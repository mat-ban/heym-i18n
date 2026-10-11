# Condition

De **Condition**-node vertakt de workflow op basis van een if/else-expressie. Routeert naar het true- of false-pad, afhankelijk van het resultaat.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 2 (true, false) |
| Uitvoer | Geeft invoer door aan de gekozen vertakking |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `condition` | expression | JavaScript-achtige expressie (bijv. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – wanneer de conditie waarheidsgetrouw evalueert
- **Source handle `false`** – wanneer de conditie onwaar evalueert

## Expressie-operatoren

Ondersteunt: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, enz. Zie [Expression DSL](../reference/expression-dsl.md).

## Voorbeeld

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Verbind edges met `sourceHandle: "true"` of `sourceHandle: "false"` om naar verschillende vertakkingen te routeren.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Switch Node](./switch-node.md) – Meerwegroutering op waarde
- [Expression DSL](../reference/expression-dsl.md) – Conditiesyntaxis
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview voor conditie
