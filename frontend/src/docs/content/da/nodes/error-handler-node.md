# Error Handler

**Error Handler**-noden fanger fejl fra enhver node i workflowet. Når den er til stede, køres den automatisk, når en node fejler. Der kræves ingen indgående forbindelser - den trigges af workflow-motoren.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 (trigges ved fejl) |
| Outputs | 1 |
| Output | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `message` | expression | Valgfri. Standard: `$error.message` |

## Fejlkontekst

Når error handler kører, er disse felter tilgængelige:

| Felt | Beskrivelse |
|-------|-------------|
| `$errorHandler.error` | Fejlmeddelelse som streng |
| `$errorHandler.errorNode` | Label på den node, der fejlede |
| `$errorHandler.errorNodeType` | Type af den fejlende node |
| `$errorHandler.timestamp` | Tidspunkt for fejlen |

## Anvendelsestilfælde

- Send notifikationer ved fejl via [Telegram](./telegram-node.md), [Slack](./slack-node.md) eller [Send Email](./send-email-node.md)
- Log fejl til eksterne systemer
- Returner en tilpasset fejlrespons via [Output](./output-node.md)

Kun én Error Handler pr. workflow.

## Eksempel

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Forbind til Output for tilpasset fejlrespons:
```json
{"message": "Fejl: $errorHandler.error i $errorHandler.errorNode"}
```

Eller forbind til Slack for notifikationer:
```json
{"message": "Workflow fejlede: $errorHandler.error i $errorHandler.errorNode"}
```

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Telegram Node](./telegram-node.md) – Notifikation ved fejl
- [Slack Node](./slack-node.md) – Notifikation ved fejl
- [Send Email Node](./send-email-node.md) – Email-advarsler
- [Throw Error Node](./throw-error-node.md) – Bevidst udløste fejl
