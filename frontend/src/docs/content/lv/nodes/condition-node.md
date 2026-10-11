# Condition

**Condition** mezgls sazaro workflow, pamatojoties uz if/else izteiksmi. Novirza uz true vai false ceļu atkarībā no rezultāta.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 2 (true, false) |
| Izvade | Nodod ievadi tālāk uz izvēlēto zaru |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `condition` | expression | JavaScript līdzīga izteiksme (piem., `$input.text.length > 0`) |

## Malu rokturi

- **Avota rokturis `true`** – kad nosacījums tiek novērtēts kā patiess (truthy)
- **Avota rokturis `false`** – kad nosacījums tiek novērtēts kā nepatiess (falsy)

## Izteiksmes operatori

Atbalsta: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` u.c. Skatiet [Expression DSL](../reference/expression-dsl.md).

## Piemērs

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Savienojiet malas ar `sourceHandle: "true"` vai `sourceHandle: "false"`, lai novirzītu uz dažādiem zariem.

## Saistītais

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Switch Node](./switch-node.md) – Daudzvirzienu novirzīšana pēc vērtības
- [Expression DSL](../reference/expression-dsl.md) – Nosacījumu sintakse
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu nosacījumam
