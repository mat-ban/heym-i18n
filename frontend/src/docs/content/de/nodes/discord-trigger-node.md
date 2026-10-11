# Discord-Trigger

Der **Discord Trigger**-Knoten ist ein Eingangspunkt ohne Eingabe, der Discord Interactions API-Webhooks empfängt und einen Workflow automatisch startet. Verwende ihn für Slash-Befehle, Buttons, Modals und andere Discord-Anwendungsinteraktionen, die in nachgelagerte AI- oder Integrations-Knoten fließen sollen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger`-Anmeldedaten, die den öffentlichen Schlüssel der Discord-Anwendung enthalten |

## Einrichtungsanleitung

### 1. `discord_trigger`-Anmeldedaten erstellen

1. Gehe zu **Einstellungen → Anmeldedaten → Neue Anmeldedaten**
2. Wähle den Typ **Discord Trigger (Public Key)**
3. Füge den **Application Public Key** aus dem Discord Developer Portal ein:
   - **Deine Anwendung → General Information → Public Key**
4. Speichere die Anmeldedaten

### 2. Den Knoten zu deinem Workflow hinzufügen

1. Ziehe **Discord Trigger** auf den Canvas
2. Wähle den Knoten aus, um das Eigenschaften-Panel zu öffnen
3. Wähle deine `discord_trigger`-Anmeldedaten
4. Kopiere die **Interactions URL**, die im Knoten-Panel angezeigt wird

### 3. Den Interactions-Endpoint in Discord registrieren

1. Öffne das [Discord Developer Portal](https://discord.com/developers/applications)
2. Wähle deine Anwendung aus
3. Gehe zu **General Information** oder **Interactions**
4. Füge die **Interactions Endpoint URL** des Knotens in das Endpoint-Feld ein
5. Discord sendet eine `PING`-Anfrage, um den Endpoint zu validieren, und Heym antwortet automatisch nach der Verifizierung der Signatur
6. Speichere deine Änderungen

## Ausgabefelder

Nachdem der Knoten ausgelöst wurde, können nachgelagerte Knoten auf Folgendes zugreifen:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.interaction` | Vollständige Discord-Interaktions-Payload |
| `$nodeLabel.type` | Interaktionstyp |
| `$nodeLabel.data` | Befehl-, Button- oder Modal-Payload |
| `$nodeLabel.data.name` | Name des Slash-Befehls, sofern zutreffend |
| `$nodeLabel.data.options` | Options-Array des Slash-Befehls |
| `$nodeLabel.headers` | Bereinigte Webhook-Header |
| `$nodeLabel.triggered_by` | Bezeichnung der Trigger-Quelle (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Canvas-Knoten-ID, die die Discord-Interaktion empfangen hat |
| `$nodeLabel.triggered_at` | ISO-Zeitstempel für diese Workflow-Ausführung |

## Beispiel-Workflow

**Discord-Slash-Befehl → LLM → Ausgabe**

```
discordTrigger → llm → output
```

- **Discord Trigger**-Bezeichnung: `discordEvent`
- **LLM**-Benutzernachricht: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output**-Nachricht: `$llm.text`

## Sicherheit

- Anfragen werden mit **Ed25519** unter Verwendung des öffentlichen Schlüssels deiner Anwendung verifiziert
- Zeitstempel, die älter als **5 Minuten** sind, werden abgelehnt, um Replay-Angriffe zu reduzieren
- Sensible Header (`x-signature-ed25519`, `authorization` usw.) werden entfernt, bevor die Daten nachgelagerte Knoten erreichen
- Der Trigger erfordert gültige `discord_trigger`-Anmeldedaten; Anfragen werden abgelehnt, wenn die Anmeldedaten fehlen oder ungültig sind

## Hinweise

- Heym gibt sofort eine verzögerte Discord-Antwort zurück, führt den Workflow im Hintergrund aus und postet die endgültige Workflow-Ausgabe als Discord-Follow-up, wenn ein `Output`-Knoten Inhalt erzeugt
- Die Interactions-URL wird aus der Knoten-ID abgeleitet und bleibt stabil, selbst wenn der Workflow umbenannt wird
- Verwende einen regulären [Discord-Knoten](./discord-node.md) nur dann, wenn du zusätzlich zum Interaktions-Follow-up auch einen separaten Webhook-Post möchtest
- Ein `discordTrigger`-Knoten ist normalerweise ausreichend; verwende nachgelagert **Switch** oder **Condition**, um verschiedene Interaktionstypen weiterzuleiten

## Verwandte Themen

- [Discord-Knoten](./discord-node.md) – Ausgehende Discord-Nachrichten senden
- [Trigger](../reference/triggers.md) – Übersicht aller Workflow-Eingangspunkte
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung der Discord-Anmeldedaten
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – `discord_trigger`-Anmeldedaten hinzufügen und verwalten
