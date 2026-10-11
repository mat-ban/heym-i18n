# Wait

**Wait**-sõlm peatab workflow täitmise määratud aja jooksul. Kasutage seda päringusageduse piiramiseks, viivitatud toimingute tegemiseks või küsitlusintervallide jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | Edastab sisendi muutmata kujul |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `duration` | number | Viivitus millisekundites (nt 1000 = 1 sekund). Redaktor lubab väärtusi vahemikus 1 kuni 900000 (15 minutit) |

## Näide

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Loop-sõlm](./loop-node.md) – Kasutage Wait-sõlme tsüklite sees päringusageduse piiramiseks
