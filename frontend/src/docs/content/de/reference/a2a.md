# A2A

Heym stellt den **Heym Agent** über das Agent2Agent-Protokoll (A2A 1.0, JSON-RPC-Binding) bereit. Der Heym Agent ist die Engine hinter dem [Reiter Chat](../tabs/chat-tab.md); MCP-Clients erreichen denselben Agent als `heym_chat`-Tool (siehe [Reiter MCP / A2A](../tabs/mcp-tab.md)). Bei aktivem A2A kann ein anderer Agent ihm eine Task in natürlicher Sprache senden und die Antwort erhalten – mit denselben Fähigkeiten wie im Chat.

## Aktivieren

1. Öffnen Sie den Reiter **MCP / A2A**.
2. Aktivieren Sie den **Heym Agent** auf dem Standard-Server oder auf einem benannten Server und wählen Sie dessen Anmeldedaten und Modell aus.
3. Aktivieren Sie das Kontrollkästchen **A2A aktivieren**. Die Karte zeigt die URL der **Agent Card** und den **JSON-RPC-Endpoint**.

A2A setzt auf dem Heym Agent auf: Das Deaktivieren des Agenten deaktiviert auch A2A.

## Endpoints

| | Standard-Server | Benannter Server |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Die Agent Card erfordert keine Anmeldedaten und nennt weder Benutzer, Server noch Workflow. Sie existiert nur, solange A2A aktiv ist: die Domain-Karte, solange mindestens ein Benutzer A2A für den Standard-Server aktiviert hat; die Karte eines benannten Servers, solange das A2A dieses Servers aktiv ist. Andernfalls antwortet die Adresse mit 404.

## Authentifizierung

Senden Sie dieselben Anmeldedaten wie für MCP, ausschließlich in den Headern:

- `X-MCP-Key: <key>`: der Schlüssel des Standard-Servers oder der Schlüssel des benannten Servers
- `Authorization: Bearer <token>`: ein OAuth-Token vom Heym OAuth-Server

Anmeldedaten in der URL werden abgelehnt. Die Agent Card deklariert beide Schemata, sodass ein A2A-Client sie aus der Card auslesen kann.

## Methoden

| Methode | Beschreibung |
|---|---|
| `SendMessage` | Startet eine Task oder setzt eine auf Eingabe wartende fort. Wartet auf die Antwort, sofern `configuration.returnImmediately` nicht `true` ist. |
| `SendStreamingMessage` | Dasselbe als Server-Sent Events-Stream des Task-Fortschritts und dessen Ergebnisses. |
| `GetTask` | Status, Antwort und Verlauf einer Task (`historyLength` begrenzt den Verlauf). |
| `ListTasks` | Ihre Tasks auf diesem Server, die neuesten zuerst, gefiltert nach `contextId` oder `status`, mit `pageSize` und `pageToken`. |
| `CancelTask` | Bricht eine Task ab, die noch in Bearbeitung ist oder wartet. |
| `SubscribeToTask` | Verfolgt eine Task, die noch in Bearbeitung ist. |
| `GetExtendedAgentCard` | Die Card mit dem Namen des Servers und den ihm zugewiesenen Workflows als Skills. |

Push-Benachrichtigungen werden nicht angeboten: Die Card meldet `pushNotifications: false`, und die Push-Methoden antworten mit `PushNotificationNotSupportedError`. Anfragen nutzen A2A 1.0; senden Sie `A2A-Version: 1.0`. Methodennamen aus A2A 0.3 wie `message/send` antworten mit `VersionNotSupportedError`.

## Tasks und Konversationen

Jede Task ist eine Konversation im Reiter Chat, gekennzeichnet mit einem Netzwerk-Symbol. Die `contextId` der Task entspricht dieser Konversation: Senden Sie eine neue Nachricht mit derselben `contextId` und ohne `taskId`, um sie fortzusetzen.

| Was der Agent getan hat | Task-Status |
|---|---|
| Geantwortet | `TASK_STATE_COMPLETED`, mit der Antwort als Text und, falls gespeichert, den Links zu Workflows und Eval-Suites als Daten |
| Eine klärende Frage gestellt | `TASK_STATE_INPUT_REQUIRED`: mit derselben `taskId` antworten |
| Benötigt Anmeldedaten | `TASK_STATE_AUTH_REQUIRED`: Die Statusmeldung enthält einen Link zur Anmeldedatenseite von Heym. Der Benutzer öffnet ihn in einem bei Heym angemeldeten Browser; der Wert gelangt niemals über den anderen Agenten. Senden Sie anschließend eine Nachricht für dieselbe Task, um fortzufahren. |
| Fehlgeschlagen | `TASK_STATE_FAILED`, mit dem Grund |
| Wurde abgebrochen | `TASK_STATE_CANCELED` |

Eine Nachricht an eine abgeschlossene Task oder an eine noch aktive Task wird mit `UnsupportedOperationError` abgelehnt. Nachrichten akzeptieren `text`- und `data`-Teile mit zusammen bis zu 20.000 Zeichen; Dateiteile werden abgelehnt, senden Sie Dateien daher als Links.

## Fortschritt

Während eine Task ausgeführt wird, sendet der Stream eine Statusaktualisierung für jeden Schritt im Wortlaut des Reiters Chat, zum Beispiel `Running workflow "Invoice Parser"` oder `Testing the workflow · attempt 2/5`. MCP-Clients erhalten dieselben Schritte als `notifications/progress` von `heym_chat`.

## Beispiel

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Einschränkungen

- `CancelTask` bricht einen laufenden Durchlauf auf der ausführenden Heym-Instanz sofort ab, genau wie die Stop-Schaltfläche im Reiter Chat. Anderswo wird die Task als abgebrochen markiert und das verspätete Ergebnis des Durchlaufs wird nicht erfasst.
- Keine Push-Benachrichtigungen, kein REST- oder gRPC-Binding, keine signierten Agent Cards.

## Verwandte Themen

- [Reiter MCP / A2A](../tabs/mcp-tab.md): Heym Agent und A2A aktivieren
- [Reiter Chat](../tabs/chat-tab.md): Die Engine hinter dem Agenten
- [Sicherheit](./security.md): Wie Schlüssel gespeichert werden
