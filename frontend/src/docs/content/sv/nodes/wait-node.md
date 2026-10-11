# Vänta

Noden **Vänta** pausar workflow-körningen under en angiven varaktighet. Den används för hastighetsbegränsning, fördröjda åtgärder eller pollningsintervall.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 1 |
| Utmatningar | 1 |
| Utdata | Skickar vidare indata |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `duration` | number | Fördröjning i millisekunder (t.ex. 1000 = 1 sekund). Redigeraren accepterar 1 till 900000 (15 minuter) |

## Exempel

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Loop-nod](./loop-node.md) – Använd Vänta inuti loopar för hastighetsbegränsning
