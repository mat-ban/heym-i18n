# Console Log

Noden **Console Log** loggar ett värde till backend-serverns (server) konsol. Den används för felsökning och inspektion under utveckling.

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
| `logMessage` | expression | Värde som ska loggas. Stöder [uttryck](../reference/expression-dsl.md). |

## Exempel

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Utdata visas i serverloggarna (t.ex. terminalutdata vid körning av `uvicorn`).

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Loggar](../tabs/logs-tab.md) – Visa applikationsloggar
