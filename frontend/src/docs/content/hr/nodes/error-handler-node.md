# Error Handler

Čvor **Error Handler** hvata greške iz bilo kojeg čvora u workflowu. Kada je prisutan, automatski se pokreće kada bilo koji čvor ne uspije. Dolazne veze nisu potrebne—pokreće ga workflow engine.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 (pokreće se pri grešci) |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `message` | expression | Neobavezno. Zadano: `$error.message` |

## Kontekst greške

Kada se error handler pokrene, dostupna su sljedeća polja:

| Polje | Opis |
|-------|-------------|
| `$errorHandler.error` | Tekst poruke greške |
| `$errorHandler.errorNode` | Oznaka čvora koji nije uspio |
| `$errorHandler.errorNodeType` | Tip neuspjelog čvora |
| `$errorHandler.timestamp` | Kada je greška nastala |

## Primjeri upotrebe

- Pošaljite [Telegram](./telegram-node.md), [Slack](./slack-node.md) ili [Send Email](./send-email-node.md) obavijesti pri neuspjehu
- Zabilježite greške u vanjske sustave
- Vratite prilagođeni odgovor o grešci putem [Output](./output-node.md)

Samo jedan Error Handler po workflowu.

## Primjer

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Povežite s Output za prilagođeni odgovor o grešci:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Ili povežite sa Slack za obavijesti:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Telegram Node](./telegram-node.md) – Obavijest pri grešci
- [Slack Node](./slack-node.md) – Obavijest pri grešci
- [Send Email Node](./send-email-node.md) – Email upozorenja
- [Throw Error Node](./throw-error-node.md) – Namjerne greške
