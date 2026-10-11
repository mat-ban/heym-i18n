# WebSocket-Senden

Der **WebSocket-Senden**-Knoten öffnet eine ausgehende Client-Verbindung zu einem externen WebSocket-Server, sendet eine Nachricht und schließt die Verbindung. Verwende ihn, wenn ein Workflow Ereignisse an ein Echtzeitsystem pushen muss, ohne einen von Heym verwalteten Socket-Endpoint bereitzustellen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Externe `ws://`- oder `wss://`-URL |
| `websocketHeaders` | JSON object string / expression | Optionale Handshake-Header |
| `websocketSubprotocols` | string | Optionale kommagetrennte Subprotokoll-Liste |
| `websocketMessage` | expression | Zu sendende Payload |

## Regeln zur Nachrichten-Serialisierung

- Wenn `websocketMessage` zu einem **String** aufgelöst wird, sendet Heym einen Text-Frame.
- Wenn es zu einem **Objekt**, **Array**, **number**, **boolean** oder `null` aufgelöst wird, serialisiert Heym es als JSON-Text.
- Wenn es zu **bytes** aufgelöst wird, sendet Heym einen binären Frame.
- Vollständige Ausdrücke wie `$input` bewahren native Typen vor der Serialisierung.

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` bei Erfolg |
| `$nodeLabel.url` | Aufgelöste Ziel-URL |
| `$nodeLabel.message_type` | `text`, `json` oder `binary` |
| `$nodeLabel.size_bytes` | Payload-Größe in Bytes |
| `$nodeLabel.subprotocol` | Ausgehandeltes Subprotokoll, falls vorhanden |
| `$nodeLabel.sent_at` | ISO-Zeitstempel |

## Beispiel-Workflow

**HTTP-Anfrage → transformieren → über WebSocket veröffentlichen**

```
input → set → websocketSend → output
```

- **Set** erstellt ein Payload-Objekt wie `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** verwendet `$payloadNode` als `websocketMessage`
- **Output** kann `$socketSend.status` zurückgeben

## Beispiel-Knoten-JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Hinweise

- Für diesen Knoten ist keine [Anmeldedaten](../reference/credentials.md) erforderlich.
- Wenn der Remote-Server Auth- oder Tenant-Header erwartet, übergib sie über `websocketHeaders`.
- Verwende [HTTP](./http-node.md), wenn das Remote-System auf Anfrage/Antwort basiert statt auf Sockets.

## Egress-Sicherheit

- Standardmäßig muss die URL `ws://` oder `wss://` verwenden und nur zu öffentlichen Adressen auflösen. Loopback-, private, Link-Local-, Multicast- und Cloud-Metadata-Ziele werden blockiert.
- Heym validiert jede aufgelöste Adresse und verbindet sich direkt mit einer dieser Adressen. Umgebungs-Proxys und WebSocket-Redirects sind deaktiviert, solange der Guard aktiv ist.
- `Authorization`, `Origin`, `User-Agent` und benutzerdefinierte Daten-Header werden unterstützt. `Origin` wird über die dedizierte Option des WebSocket-Clients gesendet. `Host`, `Connection`, `Upgrade` und `Sec-WebSocket-*`-Header können nicht überschrieben werden.
- Vertrauenswürdige selbst gehostete Deployments, die absichtlich eine Verbindung zu internen Diensten herstellen, können `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` setzen. Behalte den Standard bei gehosteten oder Multi-Tenant-Deployments bei.

**Upgrade-Hinweis für v0.0.105:** Diese instanzweite Richtlinie schützt nun auch aus Anmeldedaten abgeleitete Ziele, die von Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, benutzerdefinierter LLM-Ausführung und Modell-Erkennung, dem AI-Assistenten, Guardrails und RAG-Embeddings verwendet werden. Bestehende Anmeldedaten, die auf Loopback-, private oder Link-Local-Adressen verweisen, werden abgelehnt, es sei denn, `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ist auf einer vertrauenswürdigen selbst gehosteten Instanz aktiviert. Solange der Guard aktiv ist, ignorieren geschützte HTTP-Clients `HTTP_PROXY` und `HTTPS_PROXY`; das Aktivieren des Opt-outs stellt sie wieder her. Über `SSL_CERT_FILE` oder `SSL_CERT_DIR` konfigurierte Operator-CA-Bundles werden weiterhin unterstützt. ClickHouse wird vor dem Öffnen der Verbindung geprüft, aber nicht zum Verbindungszeitpunkt gepinnt, da clickhouse-connect einen eigenen urllib3-Transport mitbringt.

## Verwandte Themen

- [WebSocket Trigger](./websocket-trigger-node.md) – Auf einen externen Socket hören und Workflows bei Ereignissen auslösen
- [Knotentypen](../reference/node-types.md) – Übersicht der Integrations-Knoten
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Dynamische JSON-Payloads erstellen
- [Third-Party-Integrationen](../reference/integrations.md) – Anmeldedaten-gestützte vs. direkt konfigurierte Integrationen
