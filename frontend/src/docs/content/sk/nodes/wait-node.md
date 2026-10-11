# Wait

Uzol **Wait** pozastaví vykonávanie workflowu na zadanú dobu. Použite ho na obmedzovanie rýchlosti (rate limiting), oneskorené akcie alebo intervaly opakovania (polling).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Prechádza vstupom |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `duration` | number | Oneskorenie v milisekundách (napr. 1000 = 1 sekunda). Editor akceptuje hodnoty od 1 do 900000 (15 minút) |

## Príklad

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Uzol Loop](./loop-node.md) – Použite Wait v rámci slučiek na obmedzovanie rýchlosti
