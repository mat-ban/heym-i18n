# Wait

A **Wait** csomópont meghatározott időtartamra szünetelteti a workflow végrehajtását. Használja sebességkorlátozáshoz, késleltetett műveletekhez vagy lekérdezési intervallumokhoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | A bemenetet továbbítja |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `duration` | number | Késleltetés ezredmásodpercben (pl. 1000 = 1 másodperc). A szerkesztő 1 és 900000 (15 perc) közötti értéket fogad el |

## Példa

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Loop csomópont](./loop-node.md) – A Wait használata ciklusokon belül sebességkorlátozáshoz
