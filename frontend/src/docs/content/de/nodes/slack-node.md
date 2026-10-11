# Slack

Der **Slack**-Knoten sendet eine Nachricht an einen Slack-Kanal über einen Incoming Webhook. Verwende ihn für Benachrichtigungen, Warnungen und Fehlerberichte.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | Reicht Eingabe durch |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Slack-Anmeldedaten (Webhook-URL) aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `message` | expression | Nachrichtentext. Unterstützt [Ausdrücke](../reference/expression-dsl.md). |

## Einrichtung

1. Erstelle einen Incoming Webhook in deinem Slack-Workspace
2. Füge im Reiter Anmeldedaten eine Slack-Anmeldedaten mit der Webhook-URL hinzu
3. Referenziere die Anmeldedaten im Knoten

## Beispiel

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Verwende ihn mit dem [Error Handler](./error-handler-node.md) für Fehlerbenachrichtigungen:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress-Sicherheit

- Die in den Anmeldedaten gespeicherte Webhook-URL muss `http://` oder `https://` verwenden und darf nur in öffentliche Adressen auflösen. Loopback-, private, Link-Local-, Multicast- und Cloud-Metadata-Ziele werden blockiert.
- Heym validiert die aufgelösten Adressen und fixiert das Verbindungsziel vor dem Senden, sodass eine DNS-Antwort die Anfrage nach der Prüfung nicht auf eine interne Adresse verschieben kann. Umgebungs-Proxies sind deaktiviert, solange der Schutz aktiv ist, und Weiterleitungen werden nicht verfolgt.
- Deployments, die an einen internen Webhook-Empfänger senden, können `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` auf einer vertrauenswürdigen selbst gehosteten Instanz setzen. Behalte die Standardeinstellung bei gehosteten oder Multi-Tenant-Deployments bei.

**Upgrade-Hinweis für v0.0.109:** Diese Prüfung ist neu für Slack. Anmeldedaten, deren Webhook-URL auf Loopback oder eine private Adresse zeigt, werden abgelehnt, sofern die obige Einstellung nicht aktiviert ist.

## Verwandtes

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Error Handler](./error-handler-node.md) – Slack bei Workflow-Fehler senden
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – Slack-Webhook hinzufügen
