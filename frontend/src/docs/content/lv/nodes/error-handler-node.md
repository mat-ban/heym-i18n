# Error Handler

**Error Handler** mezgls uztver kļūdas no jebkura mezgla workflow. Ja tas ir pievienots, tas tiek palaists automātiski, kad jebkurš mezgls sabojājas. Ienākošie savienojumi nav nepieciešami—to aktivizē workflow dzinējs.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 (aktivizēts kļūdas gadījumā) |
| Izvades | 1 |
| Izvade | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `message` | expression | Nav obligāts. Noklusējums: `$error.message` |

## Kļūdas konteksts

Kad error handler tiek palaists, ir pieejami šie lauki:

| Lauks | Apraksts |
|-------|-------------|
| `$errorHandler.error` | Kļūdas ziņojuma virkne |
| `$errorHandler.errorNode` | Tā mezgla label, kurš sabojājās |
| `$errorHandler.errorNodeType` | Sabojātā mezgla tips |
| `$errorHandler.timestamp` | Kad kļūda notika |

## Lietošanas gadījumi

- Sūtīt [Telegram](./telegram-node.md), [Slack](./slack-node.md) vai [Send Email](./send-email-node.md) paziņojumus kļūdas gadījumā
- Reģistrēt kļūdas ārējās sistēmās
- Atgriezt pielāgotu kļūdas atbildi, izmantojot [Output](./output-node.md)

Tikai viens Error Handler uz vienu workflow.

## Piemērs

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Savienojiet ar Output, lai iegūtu pielāgotu kļūdas atbildi:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Vai savienojiet ar Slack, lai saņemtu paziņojumus:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Saistītie

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Telegram Node](./telegram-node.md) – Paziņot par kļūdu
- [Slack Node](./slack-node.md) – Paziņot par kļūdu
- [Send Email Node](./send-email-node.md) – E-pasta brīdinājumi
- [Throw Error Node](./throw-error-node.md) – Apzinātas kļūdas
