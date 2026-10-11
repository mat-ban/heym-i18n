# Sąlyga

**Sąlygos** mazgas skirsto workflow pagal if/else išraišką. Nukreipia į teigiamą arba neigiamą kelią, priklausomai nuo rezultato.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 2 (teigiamas, neigiamas) |
| Išvestis | Perduoda įvestį pasirinktam šakos keliui |

## Parametrai

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `condition` | expression | JavaScript tipo išraiška (pvz., `$input.text.length > 0`) |

## Kraštinių valdymas

- **Šaltinio rankena `true`** – kai sąlyga įvertinama kaip teigiama
- **Šaltinio rankena `false`** – kai sąlyga įvertinama kaip neigiama

## Išraiškos operatoriai

Palaiko: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, ir kt. Žr. [Išraiškos DSL](../reference/expression-dsl.md).

## Pavyzdys

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Sujunkite kraštines su `sourceHandle: "true"` arba `sourceHandle: "false"`, kad nukreiptumėte į skirtingas šakas.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Perjungimo mazgas](./switch-node.md) – Daugiašakis nukreipimas pagal vertę
- [Išraiškos DSL](../reference/expression-dsl.md) – Sąlygos sintaksė
- [Išraiškos vertinimo dialogas](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su gyvu backend peržiūra sąlygai
