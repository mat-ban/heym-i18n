# Discord

Der **Discord**-Knoten sendet eine Nachricht über einen Incoming Webhook an einen Discord-Kanal. Verwende ihn für Warnungen, Workflow-Benachrichtigungen, bot-ähnliche Antworten und Fehlerberichte.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `discord`-Anmeldedaten, die die Incoming-Webhook-URL enthalten |
| `message` | expression | Ausgehender Nachrichtentext. Unterstützt [Ausdrücke](../reference/expression-dsl.md). |
| `username` | expression | Optionale Überschreibung des Anzeigenamens für diese Nachricht |
| `avatarUrl` | expression | Optionale Überschreibung der Avatar-URL für diese Nachricht |

## Einrichtung

1. Erstelle [Discord-Webhook-Anmeldedaten](../reference/integrations.md#discord)
2. Füge den **Discord**-Knoten zu deinem Workflow hinzu
3. Wähle die Anmeldedaten aus
4. Setze `message` auf den ausgehenden Text oder eine Vorlage, die aus vorgelagerten Daten erstellt wurde
5. Überschreibe optional den Anzeigenamen `username` und die `avatarUrl`

## Beispiel

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.status` | Von Discord zurückgegebener HTTP-Statuscode, bei Erfolg üblicherweise `204` |
| `$nodeLabel.response` | Vom Discord-Webhook zurückgegebener roher Antwort-Body |
| `$nodeLabel.message` | Nachrichtentext, den Heym gesendet hat |
| `$nodeLabel.username` | Mit dem Webhook gesendeter Benutzername, falls angegeben |
| `$nodeLabel.avatar_url` | Mit dem Webhook gesendete Avatar-URL, falls angegeben |

## Häufige Muster

- Verwende ihn zusammen mit [Discord Trigger](./discord-trigger-node.md), wenn du zusätzlich zur Interaktionsantwort einen weiteren Kanalbeitrag senden möchtest
- Sende Fehlerbenachrichtigungen aus dem [Error Handler](./error-handler-node.md)
- Veröffentliche Zusammenfassungen, die von [LLM](./llm-node.md) oder [Agent](./agent-node.md) generiert wurden

## Egress-Sicherheit

- Die in den Anmeldedaten gespeicherte Webhook-URL muss `http://` oder `https://` verwenden und darf nur zu öffentlichen Adressen auflösen. Loopback-, private, Link-Local-, Multicast- und Cloud-Metadata-Ziele werden blockiert.
- Heym validiert die aufgelösten Adressen und fixiert das Verbindungsziel vor dem Senden, sodass eine DNS-Antwort die Anfrage nach der Prüfung nicht auf eine interne Adresse verschieben kann. Umgebungs-Proxies sind deaktiviert, solange der Schutz aktiv ist, und Weiterleitungen werden nicht verfolgt.
- Deployments, die an einen internen Webhook-Empfänger senden, können `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` auf einer vertrauenswürdigen selbst gehosteten Instanz setzen. Behalte die Standardeinstellung bei gehosteten oder mandantenfähigen Deployments bei.

**Upgrade-Hinweis für v0.0.109:** Diese Prüfung ist neu für Discord. Anmeldedaten, deren Webhook-URL auf Loopback oder eine private Adresse zeigt, werden abgelehnt, sofern die obige Einstellung nicht aktiviert ist.

## Verwandte Themen

- [Discord Trigger](./discord-trigger-node.md) – Starte einen Workflow aus eingehenden Discord-Interaktionen
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der Discord-Anmeldedaten
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – `discord`-Anmeldedaten hinzufügen und verwalten
- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
