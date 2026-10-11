# Wait

De **Wait**-node pauzeert de uitvoering van de workflow gedurende een opgegeven tijdsduur. Gebruik deze voor rate limiting, vertraagde acties of polling-intervallen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | Geeft invoer door |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `duration` | number | Vertraging in milliseconden (bijv. 1000 = 1 seconde). De editor accepteert 1 tot 900000 (15 minuten) |

## Voorbeeld

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Loop Node](./loop-node.md) – Gebruik Wait binnen loops voor rate limiting
