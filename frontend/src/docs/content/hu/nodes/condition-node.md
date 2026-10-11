# Condition

A **Condition** csomópont egy if/else kifejezés alapján ágaztatja el a workflow-t. Az eredménytől függően a true vagy false útvonalra irányít.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 2 (true, false) |
| Kimenet | A bemenetet a kiválasztott ágba továbbítja |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `condition` | expression | JavaScript-szerű kifejezés (pl. `$input.text.length > 0`) |

## Élkezelők

- **Forrás kezelő `true`** – amikor a condition kiértékelése truthy
- **Forrás kezelő `false`** – amikor a condition kiértékelése falsy

## Kifejezés-operátorok

Támogatott: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` stb. Lásd: [Expression DSL](../reference/expression-dsl.md).

## Példa

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Kapcsolja össze az éleket `sourceHandle: "true"` vagy `sourceHandle: "false"` értékkel, hogy a különböző ágakra irányítson.

## Kapcsolódó

- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Switch Node](./switch-node.md) – Többirányú útválasztás érték alapján
- [Expression DSL](../reference/expression-dsl.md) – Condition szintaxis
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel a condition számára
