# Telegram

Der **Telegram**-Knoten sendet eine Nachricht über die Telegram Bot API. Verwende ihn für Chat-Antworten, betriebliche Warnungen, Workflow-Statusaktualisierungen oder jeden nachgelagerten Schritt, der eine Nachricht an einen Telegram-Benutzer, eine Gruppe oder einen Kanal senden soll.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-Anmeldedaten, die das Bot-Token enthalten |
| `chatId` | expression | Ziel-Chat-, Gruppen- oder Kanal-ID |
| `message` | expression | Ausgehender Nachrichtentext. Unterstützt [Ausdrücke](../reference/expression-dsl.md). |

## Einrichtung

1. Erstelle Telegram Bot-Anmeldedaten ([Telegram Bot credential](../reference/integrations.md#telegram))
2. Füge den **Telegram**-Knoten zu deinem Workflow hinzu
3. Wähle die Anmeldedaten aus
4. Setze `chatId` auf eine statische Chat-ID oder einen Ausdruck wie `$telegramEvent.message.chat.id`
5. Setze `message` auf den ausgehenden Text oder eine aus vorgelagerten Daten erstellte Vorlage

## Beispiel

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` bei Erfolg |
| `$nodeLabel.ok` | Erfolgs-Flag der Telegram API |
| `$nodeLabel.result` | Rohes `sendMessage`-Ergebnisobjekt von Telegram |
| `$nodeLabel.result.message_id` | Telegram-Nachrichten-ID |
| `$nodeLabel.result.chat.id` | Von Telegram zurückgegebene Ziel-Chat-ID |

## Häufige Muster

- Kombiniere ihn mit dem [Telegram Trigger](./telegram-trigger-node.md) für konversationelle Bots
- Sende Fehlerbenachrichtigungen aus dem [Error Handler](./error-handler-node.md)
- Veröffentliche Zusammenfassungen, die von [LLM](./llm-node.md) oder [Agent](./agent-node.md) generiert wurden

## Verwandtes

- [Telegram Trigger](./telegram-trigger-node.md) – Starte einen Workflow aus eingehenden Bot-Nachrichten
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der Telegram-Anmeldedaten
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – `telegram`-Anmeldedaten hinzufügen und verwalten
- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
