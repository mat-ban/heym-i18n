# IMAP-Trigger

Der **IMAP Trigger**-Knoten fragt in einem festen Intervall ein E-Mail-Postfach ab und startet einen Workflow einmal für jede neu erkannte Nachricht. Es ist ein Trigger-Knoten ohne Eingabe, der für die Automatisierung eingehender E-Mails konzipiert ist, wie z. B. Support-Triage, Überwachung gemeinsamer Postfächer und Genehmigungspostfächer.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `imap`-Anmeldedaten mit Server-, Login-, Postfach- und SSL-Einstellungen |
| `pollIntervalMinutes` | Integer | Wie oft Heym das Postfach auf neue E-Mails überprüft |

## Einrichtungsanleitung

### 1. `imap`-Anmeldedaten erstellen

1. Gehe zu **Einstellungen → Anmeldedaten → Neue Anmeldedaten**
2. Wähle den Typ **IMAP Email Inbox**
3. Gib ein:
   - **IMAP Host** (zum Beispiel `imap.gmail.com`)
   - **IMAP Port** (`993` für SSL/TLS bei den meisten Anbietern)
   - **Benutzername / E-Mail**
   - **Passwort / App-Passwort**
   - Optional **Mailbox** (Standard: `INBOX`)
4. Lasse **Use SSL / TLS** aktiviert, es sei denn, dein Mailserver erfordert ausdrücklich IMAP ohne SSL
5. Speichere die Anmeldedaten

### 2. Den Knoten zu deinem Workflow hinzufügen

1. Ziehe **IMAP Trigger** auf den Canvas
2. Wähle den Knoten aus, um das Eigenschaften-Panel zu öffnen
3. Wähle deine `imap`-Anmeldedaten
4. Setze **Poll Interval (Minutes)** auf einen Integer-Wert wie `1`, `5` oder `15`

## Trigger-Semantik

- Die erste Abfrage legt eine Baseline des aktuellen Postfachinhalts fest und spielt ältere E-Mails **nicht** erneut ab.
- Spätere Abfragen lösen einmal pro Nachricht aus, deren IMAP UID neuer als der gespeicherte Cursor ist.
- Wenn sich die `UIDVALIDITY` des Postfachs ändert, setzt Heym den Cursor zurück und legt erneut eine Baseline fest, um doppelte Verarbeitung zu vermeiden.
- Jede neue E-Mail startet eine separate Workflow-Ausführung mit `trigger_source = "imap"`.

## Ausgabefelder

Nachdem der Knoten ausgelöst wurde, können nachgelagerte Knoten auf Folgendes zugreifen:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.email` | Vollständige geparste E-Mail-Payload |
| `$nodeLabel.email.subject` | Dekodierter Betreff |
| `$nodeLabel.email.from` | Roher `From`-Header |
| `$nodeLabel.email.fromAddresses` | Geparste Absenderliste |
| `$nodeLabel.email.toAddresses` | Geparste Empfängerliste |
| `$nodeLabel.email.ccAddresses` | Geparste CC-Liste |
| `$nodeLabel.email.replyToAddresses` | Geparste Reply-to-Liste |
| `$nodeLabel.email.text` | Plain-Text-Body |
| `$nodeLabel.email.html` | HTML-Body |
| `$nodeLabel.email.attachments` | Array von Anhang-Metadaten (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekodiertes Header-Objekt |
| `$nodeLabel.email.uid` | IMAP UID zur Deduplizierung oder Protokollierung |
| `$nodeLabel.triggered_by` | Trigger-Quellbezeichnung (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Canvas-Knoten-ID, die die E-Mail erkannt hat |
| `$nodeLabel.triggered_at` | ISO-Zeitstempel für die Workflow-Ausführung |

## Beispiel-Workflow

**Eingehende Support-E-Mail → zusammenfassen → weiterleiten**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger**-Label: `supportInbox`
- **LLM**-Benutzernachricht: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Hinweise

- Viele Anbieter erfordern ein **App-Passwort** für den IMAP-Zugriff anstelle deines Hauptkonto-Passworts.
- Anhang-Inhalte werden nicht in die Workflow-Eingabe injiziert; nur Anhang-Metadaten sind enthalten.
- Verwende [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) oder [DataTable](./datatable-node.md) nachgelagert, um neue E-Mails weiterzuleiten oder zu protokollieren.

## Verwandte Themen

- [Triggers](../reference/triggers.md) – Übersicht aller Workflow-Einstiegspunkte
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der IMAP-Anmeldedaten
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – `imap`-Anmeldedaten hinzufügen und verwalten
- [Send Email](./send-email-node.md) – Auf eingehende Nachrichten antworten oder sie weiterleiten
