# Fehlerbehandlung

Der **Fehlerbehandlung**-Knoten fängt Fehler von jedem Knoten im Workflow ab. Wenn er vorhanden ist, wird er automatisch ausgeführt, wenn ein beliebiger Knoten fehlschlägt. Es sind keine eingehenden Verbindungen erforderlich – er wird von der Workflow-Engine ausgelöst.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 (wird bei Fehler ausgelöst) |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `message` | expression | Optional. Standard: `$error.message` |

## Fehlerkontext

Wenn der Error Handler ausgeführt wird, sind diese Felder verfügbar:

| Feld | Beschreibung |
|-------|-------------|
| `$errorHandler.error` | Fehlermeldungs-String |
| `$errorHandler.errorNode` | Label des Knotens, der fehlgeschlagen ist |
| `$errorHandler.errorNodeType` | Typ des fehlgeschlagenen Knotens |
| `$errorHandler.timestamp` | Zeitpunkt, an dem der Fehler aufgetreten ist |

## Anwendungsfälle

- Senden von [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- oder [Send Email](./send-email-node.md)-Benachrichtigungen bei Fehlschlag
- Fehler in externe Systeme protokollieren
- Zurückgeben einer benutzerdefinierten Fehlerantwort über [Output](./output-node.md)

Nur ein Error Handler pro Workflow.

## Beispiel

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Mit Output für benutzerdefinierte Fehlerantwort verbinden:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Oder mit Slack für Benachrichtigungen verbinden:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Telegram-Knoten](./telegram-node.md) – Bei Fehler benachrichtigen
- [Slack-Knoten](./slack-node.md) – Bei Fehler benachrichtigen
- [E-Mail senden](./send-email-node.md) – E-Mail-Warnungen
- [Fehler auslösen](./throw-error-node.md) – Absichtliche Fehler
