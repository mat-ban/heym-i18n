# Error Handler

Uzel **Error Handler** zachytává chyby z libovolného uzlu ve workflow. Pokud je přítomen, spustí se automaticky při selhání jakéhokoli uzlu. Nejsou potřeba žádné příchozí spojení – je spouštěn workflow enginem.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 (spuštěno při chybě) |
| Výstupy | 1 |
| Výstup | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `message` | expression | Volitelné. Výchozí: `$error.message` |

## Kontext chyby

Při spuštění error handleru jsou k dispozici následující pole:

| Pole | Popis |
|-------|-------------|
| `$errorHandler.error` | Řetězec s chybovou zprávou |
| `$errorHandler.errorNode` | Label uzlu, který selhal |
| `$errorHandler.errorNodeType` | Typ selhaného uzlu |
| `$errorHandler.timestamp` | Kdy k chybě došlo |

## Případy použití

- Odesílání oznámení přes [Telegram](./telegram-node.md), [Slack](./slack-node.md) nebo [Send Email](./send-email-node.md) při selhání
- Zaznamenávání chyb do externích systémů
- Vrácení vlastní chybové odpovědi přes [Output](./output-node.md)

Pouze jeden Error Handler na workflow.

## Příklad

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Připojení k Output pro vlastní chybovou odpověď:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Nebo připojení k Slack pro oznámení:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Telegram Node](./telegram-node.md) – Oznámení při chybě
- [Slack Node](./slack-node.md) – Oznámení při chybě
- [Send Email Node](./send-email-node.md) – E-mailové výstrahy
- [Throw Error Node](./throw-error-node.md) – Záměrné chyby
