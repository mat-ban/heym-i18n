# Konsolen-Protokoll

Der **Konsolen-Protokoll**-Knoten protokolliert einen Wert in der Backend-Konsole (Server-Konsole). Verwende ihn zum Debuggen und Inspizieren während der Entwicklung.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | Reicht die Eingabe durch |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `logMessage` | expression | Wert zum Protokollieren. Unterstützt [Ausdrücke](../reference/expression-dsl.md). |

## Beispiel

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Die Ausgabe erscheint in den Server-Logs (z. B. Terminal-Ausgabe beim Ausführen von `uvicorn`).

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Reiter „Logs“](../tabs/logs-tab.md) – Anwendungsprotokolle anzeigen
