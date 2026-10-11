# Console Log

Uzel **Console Log** zapisuje hodnotu do konzole backendu (serveru). Použijte jej pro ladění a kontrolu během vývoje.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Předává vstup dále |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `logMessage` | expression | Hodnota k zaznamenání. Podporuje [výrazy](../reference/expression-dsl.md). |

## Příklad

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Výstup se zobrazuje v protokolech serveru (např. výstup terminálu při spuštění `uvicorn`).

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Záložka Logs](../tabs/logs-tab.md) – Zobrazení protokolů aplikace
