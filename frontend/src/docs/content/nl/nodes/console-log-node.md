# Console Log

De **Console Log**-node logt een waarde naar de backend-console (serverconsole). Gebruik deze voor foutopsporing en inspectie tijdens de ontwikkeling.

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
| `logMessage` | expression | Waarde om te loggen. Ondersteunt [expressies](../reference/expression-dsl.md). |

## Voorbeeld

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

De uitvoer verschijnt in de serverlogs (bijv. terminaluitvoer bij het draaien van `uvicorn`).

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Logs Tab](../tabs/logs-tab.md) – Bekijk applicatielogs
