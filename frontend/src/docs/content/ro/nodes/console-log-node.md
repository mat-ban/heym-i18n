# Console Log

Nodul **Console Log** înregistrează o valoare în consola backend-ului (serverului). Utilizați-l pentru depanare și inspectare în timpul dezvoltării.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | Transmite intrarea mai departe |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `logMessage` | expression | Valoarea de înregistrat. Suportă [expresii](../reference/expression-dsl.md). |

## Exemplu

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Ieșirea apare în logurile serverului (de ex. ieșirea terminalului la rularea `uvicorn`).

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Logs](../tabs/logs-tab.md) – Vizualizați logurile aplicației
