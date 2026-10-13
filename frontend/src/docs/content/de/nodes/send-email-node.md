# E-Mail senden

Der **E-Mail senden**-Knoten versendet E-Mails über SMTP. Verwende ihn für Benachrichtigungen, Warnungen und transaktionale E-Mails.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `to` | expression | Empfänger. Für mehrere durch Kommas getrennt. |
| `cc` | expression | Carbon-Copy-Empfänger. Für mehrere durch Kommas getrennt. |
| `bcc` | expression | Blind-Carbon-Copy-Empfänger. Für mehrere durch Kommas getrennt. Für andere Empfänger unsichtbar. |
| `subject` | expression | E-Mail-Betreff |
| `emailBody` | expression | Inhalt des E-Mail-Textkörpers |
| `attachments` | expression | Durch Kommas getrennte [Drive](./drive-node.md)-Datei-IDs zum Anhängen. Nur Dateien, die dem Workflow-Eigentümer gehören oder mit einem seiner Teams geteilt wurden, können angehängt werden. |

## Anhänge

Hänge Dateien aus deinem [Drive](./drive-node.md) an, indem du eine oder mehrere Drive-Datei-IDs an das Feld `attachments` übergibst. Verwende einen `$`-Ausdruck, um auf die `id`-Ausgabe eines vorgelagerten Drive-Knotens zu verweisen (zum Beispiel `$drive.id`), oder liste statische IDs durch Kommas getrennt auf. Jede ID wird im Geltungsbereich des Workflow-Eigentümers aufgelöst; eine ungültige oder nicht zugängliche ID lässt den Knoten fehlschlagen, anstatt eine unvollständige E-Mail zu senden.

## Einrichtung

Füge Anmeldedaten für SMTP mit Server, Port, E-Mail und Passwort hinzu. Der sichtbare Absender ist das optionale Feld **From** der Anmeldedaten; bleibt From leer, wird der Benutzername als Absender verwendet. Gängige SMTP-Server:

- Gmail: `smtp.gmail.com`, Port 587 (App-Passwort erforderlich)
- Outlook: `smtp.office365.com`, Port 587

## Beispiel

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Der obige Wert für `attachments` verweist auf einen vorgelagerten [Drive](./drive-node.md)-Knoten mit der Bezeichnung `drive` und hängt die von ihm erzeugte Datei an.

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Fehlerbehandler](./error-handler-node.md) – E-Mail bei Fehler senden
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – SMTP-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md#smtp-email) – Einrichtung von SMTP-Anbietern (Gmail, Outlook, Mailgun, SendGrid)
