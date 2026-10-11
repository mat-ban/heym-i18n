# Error Handler

Węzeł **Error Handler** przechwytuje błędy z dowolnego węzła w workflow. Gdy jest obecny, uruchamia się automatycznie, gdy dowolny węzeł zakończy się niepowodzeniem. Nie są wymagane połączenia przychodzące — jest wyzwalany przez silnik workflow.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 (wyzwalane przy błędzie) |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `message` | expression | Opcjonalny. Domyślnie: `$error.message` |

## Kontekst błędu

Gdy uruchamia się error handler, dostępne są następujące pola:

| Pole | Opis |
|-------|-------------|
| `$errorHandler.error` | Ciąg komunikatu błędu |
| `$errorHandler.errorNode` | Etykieta węzła, który zakończył się niepowodzeniem |
| `$errorHandler.errorNodeType` | Typ węzła, który zakończył się niepowodzeniem |
| `$errorHandler.timestamp` | Czas wystąpienia błędu |

## Przypadki użycia

- Wysyłanie powiadomień [Telegram](./telegram-node.md), [Slack](./slack-node.md) lub [Send Email](./send-email-node.md) przy niepowodzeniu
- Rejestrowanie błędów w systemach zewnętrznych
- Zwracanie niestandardowej odpowiedzi błędu przez [Output](./output-node.md)

Tylko jeden Error Handler na workflow.

## Przykład

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Połączenie z Output dla niestandardowej odpowiedzi błędu:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Lub połączenie z Slack dla powiadomień:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Powiązane

- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Telegram Node](./telegram-node.md) – Powiadomienie przy błędzie
- [Slack Node](./slack-node.md) – Powiadomienie przy błędzie
- [Send Email Node](./send-email-node.md) – Alerty e-mail
- [Throw Error Node](./throw-error-node.md) – Zamierzone błędy
