# WebSocket-Trigger

Der **WebSocket Trigger**-Knoten öffnet eine ausgehende Client-Verbindung zu einem externen WebSocket-Server und startet den Workflow, wenn ausgewählte Socket-Ereignisse auftreten. Verwende ihn für Ereignisströme wie Marktfeeds, Telemetrie oder Chat-Backplanes. Die Verbindung zu internen Echtzeitsystemen erfordert das unten beschriebene Opt-out für private URLs.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Wichtiges Verhalten

- Dieser Knoten verbindet **von Heym zu einem anderen WebSocket-Server**.
- Er stellt **keinen** WebSocket-Endpoint auf Heym bereit.
- Es ist keine [Anmeldedaten](../reference/credentials.md) erforderlich. Konfiguriere URL, Header und Subprotokolle direkt am Knoten.
- Der Leader-Worker hält die Verbindung im Hintergrund offen und stellt sie bei Aktivierung erneut her.

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `websocketUrl` | string | Externe `ws://`- oder `wss://`-URL |
| `websocketHeaders` | JSON object string | Optionale Handshake-Header |
| `websocketSubprotocols` | string | Optionale kommagetrennte Subprotokoll-Liste |
| `websocketTriggerEvents` | array | Beliebige von `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Nach einer Trennung erneut verbinden |
| `retryWaitSeconds` | integer | Verzögerung vor dem erneuten Verbinden |

## Ausgegebene Ereignisse

### `onMessage`

Wird ausgelöst, wenn ein Frame vom entfernten Socket eintrifft.

Nützliche Felder:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.message.data` | Geparster JSON-Payload oder roher Nachrichtenwert |
| `$nodeLabel.message.text` | UTF-8-dekodierter Text, sofern verfügbar |
| `$nodeLabel.message.base64` | Binärer Payload als base64 |
| `$nodeLabel.message.sizeBytes` | Payload-Größe |
| `$nodeLabel.message.isJson` | Ob die Nachricht als JSON geparst wurde |

### `onConnected`

Wird ausgelöst, nachdem der Socket erfolgreich geöffnet wurde.

Nützliche Felder:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` bei der ersten Verbindung, `true` bei späteren erneuten Verbindungen |
| `$nodeLabel.connection.subprotocol` | Ausgehandeltes Subprotokoll |

### `onClosed`

Wird ausgelöst, wenn eine bestehende Verbindung geschlossen wird.

Nützliche Felder:

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` oder `unknown` |
| `$nodeLabel.close.code` | WebSocket-Close-Code |
| `$nodeLabel.close.reason` | Schließgrund |
| `$nodeLabel.close.wasClean` | `true` bei normalem `1000`-Close |
| `$nodeLabel.close.reconnecting` | Ob der Knoten versuchen wird, erneut zu verbinden |

## Trigger-Semantik

- Ein aktiver Knoten hält eine langlebige ausgehende Socket-Verbindung.
- Die Verbindung läuft nur auf dem Leader-Worker, ähnlich wie beim [IMAP Trigger](./imap-trigger-node.md) und beim Empfangsmodus von [RabbitMQ](./rabbitmq-node.md).
- Wenn die erneute Verbindung aktiviert ist, wartet Heym `retryWaitSeconds` und öffnet den Socket nach einem Abbruch erneut.
- Jedes ausgegebene Ereignis erzeugt einen separaten Workflow-Lauf mit `trigger_source = "websocket"`.

## Egress-Sicherheit

- Standardmäßig muss die URL `ws://` oder `wss://` verwenden und darf nur in öffentliche Adressen auflösen. Loopback-, private, Link-Local-, Multicast- und Cloud-Metadata-Ziele sind blockiert.
- Heym validiert DNS bei jeder erneuten Verbindung neu, validiert jede aufgelöste Adresse und verbindet direkt zu einer dieser Adressen. Umgebungs-Proxys und WebSocket-Redirects sind deaktiviert, solange der Guard aktiv ist.
- Dauerhafte Richtlinienverstöße stoppen den Trigger, anstatt unbegrenzt erneut zu versuchen. Vorübergehende DNS- oder Netzwerkfehler folgen weiterhin den Retry-Einstellungen des Knotens.
- `Authorization`-, `Origin`-, `User-Agent`- und benutzerdefinierte Daten-Header werden unterstützt. `Origin` wird über die dedizierte Option des WebSocket-Clients gesendet. `Host`-, `Connection`-, `Upgrade`- und `Sec-WebSocket-*`-Header können nicht überschrieben werden.
- Vertrauenswürdige selbstgehostete Deployments, die absichtlich eine Verbindung zu internen Diensten herstellen, können `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` setzen. Behalte den Standard bei gehosteten oder Multi-Tenant-Deployments bei.

**Upgrade-Hinweis für v0.0.105:** Diese instanzweite Richtlinie schützt jetzt auch aus Anmeldedaten abgeleitete Ziele, die von Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, benutzerdefinierter LLM-Ausführung und Modell-Erkennung, dem AI-Assistenten, Guardrails und RAG-Embeddings verwendet werden. Bestehende Anmeldedaten, die auf Loopback-, private oder Link-Local-Adressen verweisen, werden abgelehnt, es sei denn, `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ist auf einer vertrauenswürdigen selbstgehosteten Instanz aktiviert. Solange der Guard aktiv ist, ignorieren geschützte HTTP-Clients `HTTP_PROXY` und `HTTPS_PROXY`; das Aktivieren des Opt-outs stellt sie wieder her. Über `SSL_CERT_FILE` oder `SSL_CERT_DIR` konfigurierte Operator-CA-Bundles werden weiterhin unterstützt. ClickHouse wird vor dem Öffnen der Verbindung geprüft, aber nicht zum Verbindungszeitpunkt gepinnt, da clickhouse-connect einen eigenen urllib3-Transport mitbringt.

## Beispiel-Workflow

**Externer Ereignisstrom → Filter → Benachrichtigung**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger**-Label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack**-Nachricht: `"Realtime alert: $streamEvent.message.data.title"`

## Beispiel-Knoten-JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Verwandte Themen

- [Triggers](../reference/triggers.md) – Hintergrund-Trigger-Architektur und `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Daten aus einem Workflow-Schritt an einen externen Socket pushen
- [Knotentypen](../reference/node-types.md) – Übersicht aller Knoten
- [Drittanbieter-Integrationen](../reference/integrations.md) – Welche Knoten Anmeldedaten verwenden und welche nicht
