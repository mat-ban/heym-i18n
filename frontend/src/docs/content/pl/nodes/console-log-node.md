# Console Log

Węzeł **Console Log** zapisuje wartość w konsoli backendu (serwera). Służy do debugowania i inspekcji podczas tworzenia.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | Przekazuje dane wejściowe dalej |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `logMessage` | expression | Wartość do zalogowania. Obsługuje [wyrażenia](../reference/expression-dsl.md). |

## Przykład

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Dane wyjściowe pojawiają się w logach serwera (np. w danych wyjściowych terminala podczas uruchamiania `uvicorn`).

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Karta Logs](../tabs/logs-tab.md) – Przeglądanie logów aplikacji
