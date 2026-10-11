# Console Log

A **Console Log** csomópont egy értéket naplóz a backend (szerver) konzoljára. Fejlesztés során hibakereséshez és vizsgálathoz használható.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | A bemenetet továbbítja |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | A csomópont azonosítója (camelCase) |
| `logMessage` | expression | A naplózandó érték. Támogatja az [expressions](../reference/expression-dsl.md) szintaxist. |

## Példa

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

A kimenet a szerver naplóiban jelenik meg (például a terminál kimenetén `uvicorn` futtatásakor).

## Kapcsolódó

- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Logs Tab](../tabs/logs-tab.md) – Az alkalmazás naplóinak megtekintése
