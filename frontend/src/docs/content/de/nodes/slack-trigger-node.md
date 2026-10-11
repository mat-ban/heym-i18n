# Slack-Trigger

Der **Slack Trigger**-Knoten ist ein Eingabe-freier Einstiegspunkt, der Slack Events API-Webhooks empfängt und einen Workflow automatisch startet. Er verarbeitet die URL-Verifizierungs-Challenge von Slack und verifiziert Anfragesignaturen mit einem Signing Secret.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger`-Anmeldedaten, die das Signing Secret enthalten |

## Einrichtungsanleitung

### 1. `slack_trigger`-Anmeldedaten erstellen

1. Gehe zu **Settings → Credentials → New Credential**
2. Wähle den Typ **Slack Trigger (Signing Secret)**
3. Füge das **Signing Secret** aus deiner Slack-App ein:
   - In Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Speichere die Anmeldedaten

### 2. Den Knoten zu deinem Workflow hinzufügen

1. Öffne den Workflow-Canvas
2. Ziehe **Slack Trigger** aus dem Knoten-Panel auf den Canvas
3. Klicke auf den Knoten, um das Properties-Panel zu öffnen
4. Wähle deine `slack_trigger`-Anmeldedaten aus
5. Kopiere die **Webhook URL**, die im Panel angezeigt wird

### 3. Deine Slack-App konfigurieren

1. Gehe in deinen Slack-App-Einstellungen zu **Event Subscriptions**
2. Aktiviere **Enable Events**
3. Füge die Webhook URL in das Feld **Request URL** ein
4. Slack sendet eine URL-Verifizierungs-Challenge — Heym antwortet automatisch innerhalb von Millisekunden
5. Das Feld wird grün: ✓ Verified
6. Abonniere die **Bot Events**, die du benötigst (z. B. `message.channels`, `reaction_added`)
7. Speichere deine Änderungen und installiere die App bei Aufforderung erneut in deinem Workspace

## Ausgabefelder

Nachdem der Knoten ausgelöst wurde, können nachgelagerte Knoten auf Folgendes zugreifen:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.event` | Vollständiges Slack-Event-Objekt |
| `$nodeLabel.event.type` | Event-Typ (z. B. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Nachrichtentext (falls zutreffend) |
| `$nodeLabel.event.user` | Slack-Benutzer-ID, die das Event ausgelöst hat |
| `$nodeLabel.event.channel` | Kanal-ID |
| `$nodeLabel.event.ts` | Event-Zeitstempel |
| `$nodeLabel.headers` | Bereinigte HTTP-Header von Slack |
| `$nodeLabel.triggered_by` | Trigger-Quellbezeichnung (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Canvas-Knoten-ID, die das Slack-Event empfangen hat |

## Beispiel-Workflow

**Slack-Nachricht → LLM-Antwort → Slack senden:**

```
slackTrigger → llm → slack
```

- **slackTrigger**-Label: `slackEvent`
- **LLM**-Benutzernachricht: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack**-Nachricht: `$llm.text`

## Sicherheit

- Anfragen werden mit **HMAC-SHA256** und deinem Signing Secret verifiziert
- Zeitstempel, die älter als **5 Minuten** sind, werden abgelehnt (Schutz vor Replay-Angriffen)
- Sensible Header (`x-slack-signature`, `authorization` usw.) werden entfernt, bevor sie nachgelagerte Knoten erreichen
- Wenn keine Anmeldedaten gesetzt sind, läuft der Knoten ohne Verifizierung — nur für lokale Tests empfohlen

## Hinweise

- Heym antwortet sofort mit `200 OK` und führt den Workflow im Hintergrund aus — dies erfüllt Slacks 3-Sekunden-Antwortanforderung
- Die Webhook URL wird aus der Knoten-ID abgeleitet und ändert sich nie, auch nicht nach Workflow-Umbenennungen
- Nur ein `slackTrigger`-Knoten pro Workflow ist erforderlich; verwende nachgelagerte **Switch**- oder **Condition**-Knoten, um verschiedene Event-Typen weiterzuleiten
