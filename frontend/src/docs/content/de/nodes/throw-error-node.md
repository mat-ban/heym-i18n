# Fehler auslösen

Der **Fehler auslösen**-Knoten stoppt die Workflow-Ausführung sofort und gibt eine Fehlerantwort mit einem benutzerdefinierten HTTP-Statuscode zurück. Verwende ihn für Validierungsfehler, unbefugten Zugriff oder andere Fehlerbedingungen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 0 |
| Ausgabe | Workflow wird gestoppt; Fehlerantwort wird an den Aufrufer zurückgegeben |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `errorMessage` | expression | Fehlermeldung (unterstützt Ausdrücke) |
| `httpStatusCode` | number | HTTP-Statuscode (z. B. 400, 401, 403, 404, 429, 500) |

## Häufige Statuscodes

| Code | Anwendungsfall |
|------|----------|
| 400 | Bad Request (ungültige Eingabe) |
| 401 | Unauthorized (Authentifizierung erforderlich) |
| 403 | Forbidden (Zugriff verweigert) |
| 404 | Not Found (Ressource fehlt) |
| 422 | Unprocessable Entity (Validierungsfehler) |
| 429 | Too Many Requests (Rate Limit) |
| 500 | Internal Server Error |

## Beispiel

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Verwende ihn mit [Condition](./condition-node.md), um die Eingabe zu validieren und nur bei Ungültigkeit zu werfen:
- Condition true → weiter zu Output
- Condition false → Fehler werfen

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Condition-Knoten](./condition-node.md) – Vor dem Werfen validieren
- [Error Handler](./error-handler-node.md) – Fehler von anderen Knoten abfangen
