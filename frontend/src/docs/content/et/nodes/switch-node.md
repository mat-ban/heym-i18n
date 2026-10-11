# Switch

**Switch**-sõlm suunab käivituse erinevatele teedele, lähtudes väärtuse sobitamisest juhtumitega. Toetab N juhtumit ja vaikeväärtust.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | n (üks iga juhtumi kohta + vaikeväärtus) |
| Väljund | Edastab sisendi sobitatud harule |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `expression` | expression | Hinnatav väärtus (nt `$input.category`) |
| `cases` | string[] | Sobitatavad juhtumi väärtused (nt `["case1", "case2", "case3"]`) |

## Serva käepidemed

- Iga juhtum saab allika käepideme (indeks 0, 1, 2, …)
- Vaikekäepide mittevastavate väärtuste jaoks

## Näide

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

Ühendage servad, määrates `sourceHandle` väärtuseks juhtumi indeksi (0, 1, 2) või vaikekäepideme mittevastavate väärtuste jaoks.

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Condition-sõlm](./condition-node.md) – If/else harustamine
- [Expression DSL](../reference/expression-dsl.md) – Avaldise süntaks
