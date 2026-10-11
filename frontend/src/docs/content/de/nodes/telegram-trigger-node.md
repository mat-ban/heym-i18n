# Telegram-Trigger

Der **Telegram Trigger**-Knoten ist ein Einstiegspunkt ohne Eingabe, der einen Workflow startet, wenn dein Telegram-Bot ein Webhook-Update empfängt. Verwende ihn für Chatbots, Support-Triage, Slash-ähnliche Befehle oder Inline-Button-Callbacks, die in nachgelagerte AI- und Integrations-Knoten einfließen sollen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-Anmeldedaten, die das Bot-Token und optional das Webhook-Secret-Token enthalten |

## Einrichtungsanleitung

### 1. `telegram`-Anmeldedaten erstellen

1. Gehe zu **Einstellungen → Anmeldedaten → Neue Anmeldedaten**
2. Wähle den Typ **Telegram Bot**
3. Füge das **Bot-Token** von BotFather ein
4. Setze optional ein **Webhook-Secret-Token**, wenn Telegram einen passenden Verifizierungs-Header senden soll
5. Speichere die Anmeldedaten

### 2. Den Knoten zu deinem Workflow hinzufügen

1. Ziehe **Telegram Trigger** auf den Canvas
2. Wähle den Knoten aus, um das Eigenschaften-Panel zu öffnen
3. Wähle deine `telegram`-Anmeldedaten
4. Kopiere die **Webhook-URL**, die im Knoten-Panel angezeigt wird

### 3. Den Webhook in Telegram registrieren

Verwende die Bot-API-Methode `setWebhook` mit der URL aus dem Knoten:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Wenn du ein Secret-Token in Heym konfiguriert hast, sende denselben Wert beim Setzen des Webhooks:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Ausgabefelder

Nachdem der Knoten ausgelöst wurde, können nachgelagerte Knoten auf Folgendes zugreifen:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.update` | Vollständige Telegram-Update-Payload |
| `$nodeLabel.message` | Primäres nachrichtenähnliches Objekt aus dem Update |
| `$nodeLabel.message.text` | Eingehender Nachrichtentext |
| `$nodeLabel.message.chat.id` | Chat-ID zum Antworten in nachgelagerten Knoten |
| `$nodeLabel.message.from.id` | Telegram-Benutzer-ID |
| `$nodeLabel.callback_query` | Callback-Payload, wenn das Update von einer Inline-Tastatur stammt |
| `$nodeLabel.headers` | Bereinigte Webhook-Header |
| `$nodeLabel.triggered_by` | Bezeichnung der Trigger-Quelle (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas-Knoten-ID, die das Telegram-Update empfangen hat |
| `$nodeLabel.triggered_at` | ISO-Zeitstempel für diese Workflow-Ausführung |

## Beispiel-Workflow

**Telegram-Nachricht → LLM → Telegram-Antwort**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger**-Label: `telegramEvent`
- **LLM**-Benutzernachricht: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Sicherheit

- Wenn deine Anmeldedaten ein `secret_token` enthalten, verifiziert Heym `x-telegram-bot-api-secret-token`, bevor der Workflow ausgeführt wird.
- Sensible Request-Header werden entfernt, bevor die Payload die nachgelagerten Knoten erreicht.
- Die Webhook-URL ist statisch für die Knoten-ID, sodass du sie nur neu registrieren musst, wenn sich der Knoten selbst ändert.

## Verwandte Themen

- [Telegram-Knoten](./telegram-node.md) – Eine Antwort oder ausgehende Benachrichtigung senden
- [Trigger](../reference/triggers.md) – Übersicht aller Workflow-Einstiegspunkte
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der Telegram-Anmeldedaten
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – `telegram`-Anmeldedaten hinzufügen und verwalten
