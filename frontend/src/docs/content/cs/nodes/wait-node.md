# Wait

Uzel **Wait** pozastaví provádění workflow na zadanou dobu. Použijte jej pro omezení rychlosti (rate limiting), zpožděné akce nebo intervaly dotazování (polling).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Předává vstup dále |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `duration` | number | Zpoždění v milisekundách (např. 1000 = 1 sekunda). Editor přijímá hodnoty 1 až 900000 (15 minut) |

## Příklad

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Loop Node](./loop-node.md) – Použití uzlu Wait uvnitř smyček pro omezení rychlosti
