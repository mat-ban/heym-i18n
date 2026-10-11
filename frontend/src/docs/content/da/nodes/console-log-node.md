# Console Log

**Console Log**-noden logger en værdi til backend-serverens konsol. Den anvendes til fejlfinding og inspektion under udvikling.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Gennemfører input |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `logMessage` | expression | Værdi der skal logges. Understøtter [udtryk](../reference/expression-dsl.md). |

## Eksempel

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Output vises i serverloggene (f.eks. terminaloutput ved kørsel af `uvicorn`).

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Logs-fane](../tabs/logs-tab.md) – Vis applikationslogge
