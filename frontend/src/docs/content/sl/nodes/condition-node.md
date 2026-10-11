# Pogoji

**Pogoji** vozlišče razveja workflow na podlagi izraza if/else. Usmerja na pot true ali false, odvisno od rezultata.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 2 (true, false) |
| Izhod | Preusmeri vhod na izbrano vejo |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `condition` | izraz | Izraz podoben JavaScriptu (npr. `$input.text.length > 0`) |

## Robni ročaji

- **Izvorni ročaj `true`** – ko se pogoj oceni kot resničen
- **Izvorni ročaj `false`** – ko se pogoj oceni kot neresničen

## Operatorji izrazov

Podpira: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, itd. Oglejte si [Expression DSL](../reference/expression-dsl.md).

## Primer

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Povežite robove z `sourceHandle: "true"` ali `sourceHandle: "false"` za usmerjanje na različne veje.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Switch vozlišče](./switch-node.md) – Večpotno usmerjanje po vrednosti
- [Expression DSL](../reference/expression-dsl.md) – Sintaksa pogojev
- [Dialog za oceno izrazov](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprejšnjim ogledom backend za pogoje
