# Console Log

Il nodo **Console Log** registra un valore nella console del backend (server). Utilizzarlo per il debug e l'ispezione durante lo sviluppo.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Passa attraverso l'input |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `logMessage` | expression | Valore da registrare. Supporta le [espressioni](../reference/expression-dsl.md). |

## Esempio

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

L'output appare nei log del server (ad esempio nell'output del terminale durante l'esecuzione di `uvicorn`).

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Logs Tab](../tabs/logs-tab.md) – Visualizzare i log dell'applicazione