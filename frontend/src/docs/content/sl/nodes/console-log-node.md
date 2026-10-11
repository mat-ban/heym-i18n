# Console Log

Vozlišče **Console Log** beleži vrednost v konzolo backend strežnika. Uporabite ga za odpravljanje napak in pregledovanje med razvojem.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | Prehaja skozi vhod |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `logMessage` | izraz | Vrednost za beleženje. Podpira [izraze](../reference/expression-dsl.md). |

## Primer

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Izhod se prikaže v strežniških dnevnikih (npr. izhod terminala pri zagonu `uvicorn`).

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Dnevnikov](../tabs/logs-tab.md) – Ogled dnevnikov aplikacije
