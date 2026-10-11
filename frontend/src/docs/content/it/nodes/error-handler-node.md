# Error Handler

Il nodo **Error Handler** intercetta gli errori provenienti da qualsiasi nodo del workflow. Quando è presente, viene eseguito automaticamente non appena un nodo fallisce. Non sono necessarie connessioni in ingresso: viene attivato dal motore del workflow.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 (attivato in caso di errore) |
| Output | 1 |
| Output | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `message` | expression | Opzionale. Predefinito: `$error.message` |

## Contesto dell'errore

Quando l'error handler viene eseguito, sono disponibili i seguenti campi:

| Campo | Descrizione |
|-------|-------------|
| `$errorHandler.error` | Stringa del messaggio di errore |
| `$errorHandler.errorNode` | Label del nodo che ha fallito |
| `$errorHandler.errorNodeType` | Tipo del nodo che ha fallito |
| `$errorHandler.timestamp` | Momento in cui si è verificato l'errore |

## Casi d'uso

- Inviare notifiche tramite [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [Send Email](./send-email-node.md) in caso di errore
- Registrare gli errori su sistemi esterni
- Restituire una risposta di errore personalizzata tramite [Output](./output-node.md)

È possibile configurare un solo Error Handler per workflow.

## Esempio

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Collegare a Output per una risposta di errore personalizzata:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Oppure collegare a Slack per le notifiche:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Telegram Node](./telegram-node.md) – Notifica in caso di errore
- [Slack Node](./slack-node.md) – Notifica in caso di errore
- [Send Email Node](./send-email-node.md) – Avvisi via email
- [Throw Error Node](./throw-error-node.md) – Errori intenzionali