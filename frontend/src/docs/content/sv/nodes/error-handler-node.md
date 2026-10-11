# Felhanterare

**Felhanterare**-noden fångar fel från valfri nod i workflowet. När den finns körs den automatiskt när en nod misslyckas. Inga inkommande anslutningar behövs—den utlöses av workflow-motorn.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Ingångar | 0 (utlöses vid fel) |
| Utgångar | 1 |
| Utdata | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `message` | expression | Valfri. Standard: `$error.message` |

## Felkontext

När felhanteraren körs är följande fält tillgängliga:

| Fält | Beskrivning |
|------|-------------|
| `$errorHandler.error` | Felmeddelandesträng |
| `$errorHandler.errorNode` | Etiketten för noden som misslyckades |
| `$errorHandler.errorNodeType` | Typen av den misslyckade noden |
| `$errorHandler.timestamp` | När felet inträffade |

## Användningsområden

- Skicka aviseringar via [Telegram](./telegram-node.md), [Slack](./slack-node.md) eller [Send Email](./send-email-node.md) vid fel
- Logga fel till externa system
- Returnera ett anpassat felmeddelande via [Output](./output-node.md)

Endast en felhanterare per workflow.

## Exempel

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Anslut till Output för anpassat felsvar:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Eller anslut till Slack för aviseringar:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Telegram-nod](./telegram-node.md) – Avisera vid fel
- [Slack-nod](./slack-node.md) – Avisera vid fel
- [Send Email-nod](./send-email-node.md) – E-postaviseringar
- [Throw Error-nod](./throw-error-node.md) – Avsiktliga fel
