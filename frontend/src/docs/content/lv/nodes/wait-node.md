# Wait

**Wait** mezgls aptur workflow izpildi uz norādīto laiku. Izmantojiet to ātruma ierobežošanai, aizkavētām darbībām vai aptaujas intervāliem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | Nodod tālāk ievadi |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgls identifikators (camelCase) |
| `duration` | number | Aizkave milisekundēs (piem., 1000 = 1 sekunde). Redaktors pieņem no 1 līdz 900000 (15 minūtes) |

## Piemērs

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Loop mezgls](./loop-node.md) – Izmantojiet Wait ciklos ātruma ierobežošanai
