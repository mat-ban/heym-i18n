# Error Handler

De **Error Handler**-node vangt fouten op van elke node in de workflow. Indien aanwezig, wordt deze automatisch uitgevoerd wanneer een node mislukt. Er zijn geen inkomende verbindingen nodig—deze wordt geactiveerd door de workflow-engine.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 (geactiveerd bij fout) |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `message` | expression | Optioneel. Standaard: `$error.message` |

## Foutcontext

Wanneer de error handler wordt uitgevoerd, zijn deze velden beschikbaar:

| Veld | Beschrijving |
|-------|-------------|
| `$errorHandler.error` | Foutmelding als string |
| `$errorHandler.errorNode` | Label van de node die is mislukt |
| `$errorHandler.errorNodeType` | Type van de mislukte node |
| `$errorHandler.timestamp` | Wanneer de fout is opgetreden |

## Gebruiksscenario's

- Verstuur [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- of [Send Email](./send-email-node.md)-meldingen bij een fout
- Log fouten naar externe systemen
- Retourneer een aangepaste foutrespons via [Output](./output-node.md)

Slechts één Error Handler per workflow.

## Voorbeeld

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Verbind met Output voor een aangepaste foutrespons:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Of verbind met Slack voor meldingen:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Telegram Node](./telegram-node.md) – Melding bij fout
- [Slack Node](./slack-node.md) – Melding bij fout
- [Send Email Node](./send-email-node.md) – E-mailwaarschuwingen
- [Throw Error Node](./throw-error-node.md) – Opzettelijke fouten
