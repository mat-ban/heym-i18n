# Console Log

Uzol **Console Log** zaznamenáva hodnotu do konzoly backendu (servera). Použite ho na ladenie a kontrolu počas vývoja.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Prechádza vstupom |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `logMessage` | expression | Hodnota na zaznamenanie. Podporuje [expressions](../reference/expression-dsl.md). |

## Príklad

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Výstup sa zobrazuje v logoch servera (napr. výstup terminálu pri spustení `uvicorn`).

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Logs Tab](../tabs/logs-tab.md) – Zobrazenie logov aplikácie
