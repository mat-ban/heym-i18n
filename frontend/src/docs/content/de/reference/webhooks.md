# Webhooks

Workflows können über HTTP-Webhooks ausgelöst werden. Der Standard-Execute-Endpoint gibt JSON zurück, die Streaming-Variante gibt Server-Sent Events (SSE) zurück.

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Ersetze `{workflow_id}` durch die Workflow-UUID. Die Basis-URL ist deine Heym-Instanz (z. B. `https://app.heym.ai`).

## Request-Methode

Jeder Workflow akzeptiert ein HTTP-Verb, das im cURL-Dialog des Editors gewählt wird: `GET`, `POST`, `PUT` oder `DELETE`. **`POST` ist der Standard**, und jeder Workflow, der vor dieser Einstellung erstellt wurde, behält sie bei, sodass sich nichts ändert, was heute funktioniert.

Wird ein Workflow mit einem anderen Verb aufgerufen, gibt er `405 Method Not Allowed` mit einem `Allow`-Header zurück, der das konfigurierte Verb nennt:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Eine Ausnahme: Anfragen mit `?test_run=true` überspringen die Prüfung. Das ist es, was der **Run**-Button des Editors und das Debug-Panel senden, sodass ein auf `GET` gesetzter Workflow aus dem Produkt heraus testbar bleibt.

### Methoden ohne Body

`GET` und `DELETE` tragen keinen Request-Body. Eingaben stammen stattdessen aus dem Query-String und werden mit `$input.query.<name>` gelesen:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Der cURL-Dialog blendet den Request-Body-Editor aus und entfernt den `Content-Type`-Header für diese beiden Methoden.

Kombiniere `GET` mit einem [HTML Output Mapper](../nodes/html-output-mapper-node.md), um eine Seite auszuliefern, die ein Browser direkt öffnen kann.

## Streaming-Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Verwende den Streaming-Endpoint, wenn du inkrementelle Ausführungsereignisse anstelle einer einzelnen JSON-Antwort möchtest. Siehe [SSE Streaming](./sse-streaming.md) für das Ereignisprotokoll und die Konfiguration der Start-Nachricht pro Knoten.

## Request-Format

Der Request-Body wird als `body` an [Input](../nodes/input-node.md)-Knoten übergeben. Heym akzeptiert beide Request-Formen:

- **Raw JSON** – z. B. `{"userId": "123", "action": "create"}`
- **Wrapped-Format** – `{"inputs": {...}, "test_run": false}`

Bei Verwendung des Wrapped-Formats wird `inputs` extrahiert und als `body` übergeben. `test_run` umgeht Rate Limiting und Response-Caching. Du kannst auch `?test_run=true` als Query-Parameter senden, wenn du Raw JSON postest.

## Request-Body-Modi

Jeder Workflow hat eine `webhook_body_mode`-Einstellung, die steuert, wie der Editor Beispielanfragen erstellt:

| Modus | Verhalten |
|------|----------|
| **defined** | Der Editor und der cURL-Dialog formen den Beispiel-Body aus den Feldern des Input-Knotens des Workflows und behalten leere Schlüssel im JSON-Payload bei. Bestehende cURL-Payloads im defined-Stil funktionieren weiterhin. |
| **generic** | Der Editor und der cURL-Dialog verwenden einen freien JSON-Body. Der Request-Body wird unverändert durchgereicht, sodass externe Apps ihre eigene feste Payload-Form senden können. |

Die Ausführungs-API bleibt in beiden Modi abwärtskompatibel. Raw JSON- und Wrapped-`{ "inputs": ... }`-Anfragen werden in beiden Fällen weiterhin akzeptiert.

Header und Query-Parameter sind in Ausdrücken als `$input.headers` und `$input.query` verfügbar. Header-Schlüssel werden in Kleinbuchstaben umgewandelt.

## Authentifizierung

Wird pro Workflow im Editor konfiguriert (Workflow-Einstellungen). Die Authentifizierung wird vor der Ausführung geprüft.

| auth_type | Verhalten |
|-----------|----------|
| **anonymous** | Keine Authentifizierung erforderlich. Jeder kann den Endpoint aufrufen. |
| **jwt** | Bearer-Token erforderlich. Akzeptiert entweder ein Benutzer-Session-Token (der Benutzer muss Workflow-Zugriff haben) oder ein bereichsbezogenes [Execution Token](./execution-tokens.md), das für diesen Workflow erstellt wurde. |
| **header_auth** | Benutzerdefinierter Header muss übereinstimmen. Setze `auth_header_key` (z. B. `X-API-Key`) und `auth_header_value`. |

Bei `header_auth` muss der Wert des Request-Headers exakt mit dem konfigurierten Wert übereinstimmen. JWT-Benutzer mit Workflow-Zugriff können auch ohne den benutzerdefinierten Header aufrufen.

Für `jwt` sind [Ausführungs-Tokens](./execution-tokens.md) der empfohlene Weg, um Workflows aus externen Systemen aufzurufen – sie sind auf einen einzelnen Workflow beschränkt und können unabhängig widerrufen werden.

## Response-Caching

Konfiguriere `cache_ttl_seconds` pro Workflow. Wenn gesetzt und größer als 0:

- **Cache-Schlüssel**: SHA256-Hash aus `workflow_id` + `body` + `query`
- **Cache-Treffer**: Gibt sofort mit `status: "cached"` und zwischengespeicherten Ausgaben zurück
- **Cache-Setzung**: Nur nach einer erfolgreichen Ausführung (`status: "success"`)
- **Speicherung**: Postgres-gestützt und über Backend-Worker hinweg geteilt

| Einstellung | Wirkung |
|---------|--------|
| `cache_ttl_seconds` = 0 oder null | Caching deaktiviert |
| `cache_ttl_seconds` > 0 | Antworten werden für diese Anzahl von Sekunden zwischengespeichert |

`test_run`-Anfragen umgehen den Cache (kein Lesen, kein Schreiben).

Wenn Response-Caching im cURL-Dialog aktiviert ist, entfernt **Clear cache** die zwischengespeicherten Antworten des aktuellen Workflows sofort.

## Rate Limiting

Konfiguriere pro Workflow: `rate_limit_requests` und `rate_limit_window_seconds`.

- **Geltungsbereich**: Pro `workflow_id` + Client-IP (gleitendes Fenster)
- **Überschritten**: HTTP 429 mit `Retry-After`-Header
- **Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Einstellung | Beschreibung |
|---------|-------------|
| `rate_limit_requests` | Maximal erlaubte Anfragen im Fenster |
| `rate_limit_window_seconds` | Fensterdauer in Sekunden |

`test_run`-Anfragen umgehen das Rate Limiting.
<a id="concurrency-limit-and-queued-runs"></a>

## Concurrency-Limit und eingereihte Ausführungen

Ein Workflow kann begrenzen, wie viele Produktionsausführungen gleichzeitig laufen. Aktiviere **Concurrency-Limit** im **Properties**-Panel auf Workflow-Ebene und setze **Max. gleichzeitige Ausführungen**. Eigentümer und Mitwirkende mit Bearbeitungsrechten können dies ändern. Das Limit ist standardmäßig deaktiviert.

Sobald das Limit erreicht ist, warten neue Ausführungen in einer First-In-First-Out-Queue. Dies umfasst jeden Produktions-Einstiegspunkt: diesen Endpoint, den [Streaming-Endpoint](./sse-streaming.md), das [Portal](./portal.md), den [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) und jeden [Trigger](./triggers.md). Testläufe des Editors starten immer sofort und belegen keinen Slot. Das Senden von `test_run=true` ohne eine angemeldete Sitzung, die den Workflow öffnen kann, umgeht die Queue nicht.

| Einstellung | Beschreibung |
|---|---|
| `concurrency_limit` | Gleichzeitig zulässige Produktionsausführungen. `0` schaltet das Limit aus |
| `concurrency_max_queue` | Optional. Anzahl der Ausführungen, die gleichzeitig warten dürfen. Leer bedeutet kein Limit |
| `concurrency_max_wait_seconds` | Optional. Eine Ausführung, die länger wartet, wird als `expired` erfasst. Leer bedeutet unbegrenztes Warten |

### 202 Accepted

Ein Aufruf, der sofort startet, verhält sich exakt wie unter Antwortformat beschrieben. Ein Aufruf, der warten muss, erhält sofort `202 Accepted`, unabhängig von `X-Simple-Response`, mit einem `Location`-Header, der auf seine Status-URL verweist:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Feld | Beschreibung |
|---|---|
| `queue.position` | Platz dieser Ausführung in der Warteschlange, beginnend bei 1 |
| `queue.size` | Aktuell wartende Ausführungen |
| `queue.running` | Ausführungen, die aktuell einen Slot belegen |
| `queue.limit` | Das Concurrency-Limit des Workflows |
| `status_token` | Nur bei anonymen Workflows. Wird einmalig in dieser Antwort zurückgegeben |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` antwortet mit dem Status der Ausführung. Rufe ihn mit denselben Anmeldedaten auf, die die Ausführung gestartet haben: einer Sitzung oder einem JWT, einem [Ausführungs-Token](./execution-tokens.md) oder dem benutzerdefinierten Header des Workflows. Ein anonymer Workflow hat keine zu prüfenden Anmeldedaten; sende daher das `status_token` aus der 202-Antwort im Header `X-Heym-Run-Token`. Das Token wird niemals aus dem Query-String gelesen. Ein falsches oder fehlendes Token erhält `404`, genau wie eine unbekannte Ausführung.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Bedeutung (ein Lauf, der auf einen Concurrency-Slot warten muss, erhält stattdessen die [202-Antwort](#202-accepted)) |
|---|---|
| `queued` | Wartet auf einen Slot; `queue` zeigt den aktuellen Stand |
| `running` | Hat einen Slot und wird ausgeführt |
| `success` / `error` | Abgeschlossen; `outputs` und `error` sind befüllt |
| `pending` | Pausiert für [menschliche Prüfung](./human-in-the-loop.md) |
| `cancelled` | Aus dem [Ausführungsverlauf](./execution-history.md) abgebrochen |
| `expired` | Hat länger als `concurrency_max_wait_seconds` gewartet und wurde nie ausgeführt |

Frage alle paar Sekunden ab, bis der Status weder `queued` noch `running` ist. Eine eingereihte Ausführung wird auch dann ausgeführt, wenn niemand abfragt.

### Queue voll

Wenn `concurrency_max_queue` gesetzt ist und bereits so viele Ausführungen warten, wird der Aufruf mit `429 Concurrency queue is full` und einem `queue_full`-Eintrag im Ausführungsverlauf abgewiesen. Es wird nichts eingereiht.

## Antwortformat

Der Endpoint gibt JSON zurück:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Feld | Beschreibung |
|-------|-------------|
| `workflow_id` | Workflow-UUID |
| `status` | `success`, `error`, `cached` oder `rate_limited` |
| `outputs` | Ausgaben der terminalen Knoten. Wenn ein einzelner [JSON Output Mapper](../nodes/json-output-mapper-node.md) der einzige terminale Knoten ist, ist der Response-Body dieses gemappte Objekt auf der obersten Ebene (Standard bei einfachen JSON-Antworten). Andernfalls enthält es [Output](../nodes/output-node.md) und andere terminale Knoten, verschlüsselt nach Label. |
| `execution_time_ms` | Ausführungszeit in Millisekunden (0 bei cached/rate_limited) |

Bei einem Fehler kann `outputs` Fehlerdetails enthalten. Ein [Throw Error](../nodes/throw-error-node.md)-Knoten kann einen benutzerdefinierten HTTP-Statuscode (4xx/5xx) setzen.

## Dialog „Mit cURL ausführen"

Die Toolbar-Schaltfläche **Mit cURL ausführen** (oben rechts im Editor, `cURL`-Symbol) öffnet einen Dialog, der einen sofort ausführbaren cURL-Befehl für den aktuellen Workflow erstellt und kopiert.

### Was er bewirkt

| Feld | Beschreibung |
|-------|-------------|
| **Request Body Mode** | Wähle **Defined** oder **Generic**. Generic behält den Body als rohes JSON bei, anstatt ihn aus Input-Feldern zu formen. |
| **Authentication** | Wähle Anonymous, JWT Token oder Header Auth. Setzt den korrekten Auth-Header im Befehl. Wenn JWT Token ausgewählt ist, zeigt der Dialog einen [Execution Token](./execution-tokens.md)-Manager — erstelle oder wähle einen Token, um ihn direkt in den Befehl einzubetten. |
| **Header Key / Value** | Sichtbar, wenn Header Auth ausgewählt ist. Vorausgefüllt aus den Auth-Einstellungen des Workflows. |
| **Response Cache** | Minuten, um identische Antworten zu cachen (0 = deaktiviert). Änderungen werden im Workflow gespeichert. Wenn aktiviert, entfernt **Clear cache** gecachte Antworten sofort. |
| **Rate Limit** | Maximale Anfragen pro Zeitfenster. Änderungen werden im Workflow gespeichert. |
| **SSE Streaming** | Wechselt den Befehl zu `/execute/stream`, fügt `--no-buffer` hinzu und legt die `node_start`-Nachrichteneinstellungen pro Knoten offen. |
| **Body** | JSON-Request-Body. Im Defined-Modus wird er aus den [Input](../nodes/input-node.md)-Feldern vorausgefüllt und behält leere Schlüssel. Im Generic-Modus ist es ein roher JSON-Editor. |
| **Command** | Schreibgeschützte Vorschau des vollständigen cURL-Befehls. |

Klicke auf **Copy cURL**, um den Befehl in die Zwischenablage zu kopieren.

### Beispiel

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Im Generic-Modus bleiben verschachtelte Payloads intakt, zum Beispiel:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Der Dialog spiegelt die im Workflow gespeicherten Einstellungen für Authentifizierung, Body-Modus, Caching und Rate-Limit wider — wenn du sie hier bearbeitest, wird der Workflow sofort aktualisiert.

### SSE Streaming im Dialog

Aktiviere **SSE Streaming**, wenn der generierte Befehl die Ausführung in Echtzeit von deinem Terminal aus verfolgen soll.

- Der Endpoint wechselt von `/execute` zu `/execute/stream`
- Der Befehl fügt `--no-buffer` und `Accept: text/event-stream` hinzu
- Jeder nicht-sticky Knoten erscheint in einer Liste, in der du:
  - die `node_start`-Nachricht aktivieren oder deaktivieren kannst
  - den Text der Startnachricht anpassen kannst
- `node_complete`-Events werden immer ausgegeben und enthalten die vollständige Knotenausgabe

Beispiel:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Das vollständige Event-Protokoll und Beispiele findest du unter [SSE Streaming](./sse-streaming.md).

## Trigger Source Tagging

Jede Ausführung speichert ein `trigger_source`-Label, das im [Ausführungsverlauf](./execution-history.md) sichtbar ist. Setze es, indem du den Header `X-Trigger-Source` mit einem beliebigen Wert sendest:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Die Schaltfläche **Copy cURL** im Editor-Dialog fügt automatisch `X-Trigger-Source: API` hinzu. Du kannst `API` durch einen beliebigen aussagekräftigen Wert ersetzen — `scheduler`, `rabbitmq`, `github-actions` usw.

Wenn der Header nicht gesendet wird, ist `trigger_source` standardmäßig `"API"` und der Lauf wird im Verlauf als **API** gekennzeichnet. Überschreibe ihn mit einem beliebigen Wert, der für dein System aussagekräftig ist — `scheduler`, `github-actions`, `rabbitmq` usw.

## Verwandte Themen

- [Ausführungs-Tokens](./execution-tokens.md) – Bereichsgebundene JWTs zum Aufrufen von Workflows aus externen Systemen
- [SSE Streaming](./sse-streaming.md) – Knoten-Events in Echtzeit über Server-Sent Events streamen
- [Triggers](./triggers.md) – Alle Workflow-Einstiegspunkte einschließlich Webhook
- [Workflow-Struktur](./workflow-structure.md) – Knoten und Kanten
- [Ausdrucks-DSL](./expression-dsl.md) – Zugriff auf `$input.body`, `$input.headers`, `$input.query`
