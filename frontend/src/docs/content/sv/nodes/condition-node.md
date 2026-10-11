# Condition

Noden **Condition** grenar ut workflowet baserat på ett if/else-uttryck. Dirigerar till den sanna eller falska sökvägen beroende på resultatet.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 2 (true, false) |
| Utdata | Skickar vidare indata till den valda grenen |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `condition` | expression | JavaScript-liknande uttryck (t.ex. `$input.text.length > 0`) |

## Edge-handtag

- **Källhandtag `true`** – när villkoret utvärderas till truthy
- **Källhandtag `false`** – när villkoret utvärderas till falsy

## Uttrycksoperatorer

Stöder: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, etc. Se [Expression DSL](../reference/expression-dsl.md).

## Exempel

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Anslut edges med `sourceHandle: "true"` eller `sourceHandle: "false"` för att dirigera till olika grenar.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Switch-nod](./switch-node.md) – Flervägsdirigering efter värde
- [Expression DSL](../reference/expression-dsl.md) – Villkorssyntax
- [Dialog för uttrycksutvärdering](../reference/expression-evaluation-dialog.md) – Expanderbar editor med live-förhandsvisning från backend för villkor
