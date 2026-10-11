# Tingimus

**Tingimuse** sõlm (node) hargneb workflow'd lähtuvalt if/else-avaldisest. Suunab tõesele või väärale harule sõltuvalt tulemusest.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 2 (true, false) |
| Väljund | Edastab sisendi valitud harule |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `condition` | expression | JavaScripti-laadne avaldis (nt `$input.text.length > 0`) |

## Serva käepidemed (Edge Handles)

- **Allika käepide `true`** – kui tingimus hindab tõeseks (truthy)
- **Allika käepide `false`** – kui tingimus hindab väärale (falsy)

## Avaldise operaatorid

Toetab: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` jne. Vt [Expression DSL](../reference/expression-dsl.md).

## Näide

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Ühendage servad (edges) `sourceHandle: "true"` või `sourceHandle: "false"` abil, et suunata erinevatele harudele.

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Switch-sõlm](./switch-node.md) – Mitmesuunaline suunamine väärtuse järgi
- [Expression DSL](../reference/expression-dsl.md) – Tingimuse süntaks
- [Avaldise hindamise dialoog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor, millel on tingimuse jaoks reaalajas backend'i eelvaade
