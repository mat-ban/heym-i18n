# OpenTelemetry Tracing

Heym kann [OpenTelemetry](https://opentelemetry.io/)-Traces für jeden Workflow-Lauf, jede Knoten-Ausführung und jeden Agent-Tool-Aufruf ausgeben. Jeder Lauf erzeugt einen Root-Span mit Child-Spans pro Knoten und Agent-Tool, sodass du sehen kannst, welcher Schritt fehlgeschlagen ist, wie lange er gedauert hat, was er aufgerufen hat und was zurückgekommen ist. Spans werden über OTLP/HTTP an jedes kompatible Backend exportiert, wie zum Beispiel Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic oder Grafana Cloud.

Tracing ist **standardmäßig deaktiviert**. Wenn es ausgeschaltet ist, gibt es keinen messbaren Overhead und es werden keine Spans erzeugt.

## Tracing aktivieren

Setze die folgenden Umgebungsvariablen auf dem Backend und starte es anschließend neu:

Die vollständige Liste der Umgebungsvariablen findest du unter [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Standardwert | Beschreibung |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Hauptschalter. Auf `true` setzen, um Tracing einzuschalten. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP-Basis-Endpoint, zum Beispiel `http://collector:4318`. Heym sendet Spans an `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Kommagetrennte `key=value`-Header für die Exporter-Authentifizierung, zum Beispiel `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Das `service.name`-Resource-Attribut. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Head-Sampling-Ratio zwischen `0.0` und `1.0`, angewendet mit einem parent-based Sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Wenn `true`, werden gekürzte Knoten-Eingabe- und Ausgabe-Payloads an Knoten-Spans angehängt. Standardmäßig aus, um die Privatsphäre zu wahren. |

Minimales Beispiel:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Du kannst die aktive Konfiguration in der App unter **Settings → Observability** bestätigen (öffne sie über deinen Avatar in der Kopfzeile). Dieses Panel ist schreibgeschützt und zeigt niemals Exporter-Secrets an.

## Was getraced wird

### Workflow-Root-Span

Name: `heym.workflow.execute`

| Attribut | Beschreibung |
|-----------|-------------|
| `heym.workflow.id` | Die Workflow-UUID. |
| `heym.node.count` | Anzahl der Knoten im Workflow. |
| `heym.workflow.test_mode` | `true` für Testläufe. |
| `heym.sub_workflow.depth` | Verschachtelungstiefe bei Aufruf als Sub-Workflow. |
| `heym.workflow.status` | Endstatus des Laufs. Ein fehlgeschlagener Lauf setzt den Span-Status auf `ERROR`. |

### Knoten-Span

Name: `heym.node.execute`, erzeugt als Child des Workflow-Spans.

| Attribut | Beschreibung |
|-----------|-------------|
| `heym.node.id` | Die Knoten-ID. |
| `heym.node.type` | Der Knotentyp, zum Beispiel `agent`, `llm`, `http`. |
| `heym.node.label` | Das auf dem Canvas angezeigte Knoten-Label. |
| `heym.node.status` | `success` oder `error`. Fehler setzen den Span-Status auf `ERROR`. |
| `heym.node.duration_ms` | Knoten-Ausführungszeit in Millisekunden. |
| `heym.llm.model` | Modellname für LLM- und Agent-Knoten, sofern verfügbar. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token-Nutzung für LLM- und Agent-Knoten, sofern verfügbar. |

Knoten-Spans verschachteln sich korrekt unter dem Workflow-Span, auch wenn Knoten parallel laufen, da der Workflow-Kontext in Worker-Threads weitergegeben wird.

### Agent-Tool-Span

Name: `heym.agent.tool.execute`, erzeugt unter dem aktiven Agent-Knoten-Span.

| Attribut | Beschreibung |
|-----------|-------------|
| `heym.agent.tool.name` | Vom Modell ausgewählter Tool-Name. |
| `heym.agent.tool.call_id` | Provider-Tool-Call-ID, sofern verfügbar. |
| `heym.agent.tool.source` | Tool-Quelle wie `node_tool`, `mcp`, `skill` oder `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-Server-Label, sofern zutreffend. |
| `heym.agent.tool.iteration` | Iteration der Agent-Tool-Schleife. |
| `heym.agent.tool.args_bytes` | UTF-8-Größe der serialisierten Tool-Argumente. |
| `heym.agent.tool.result_bytes` | UTF-8-Größe des serialisierten Tool-Ergebnisses. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` oder `cancelled`. Tool-Fehler setzen den Span-Status auf `ERROR`. |

Rohe Tool-Argumente und -Ergebnisse werden standardmäßig nicht an Spans angehängt.

## Sicherheit von Agent-Tool-Payloads

Persistierte Agent-Observability-Payloads werden im Code redigiert und gekürzt (`4096` Zeichen pro String, Tiefe `6`, `32768` Gesamtzeichen pro LLM-Trace-Schreibvorgang). Das Gesamt-Trace-Budget wird über Tool-Datensätze aufgeteilt, damit ein frühes großes Ergebnis nicht die Identität und den Lifecycle-Status späterer Aufrufe verbergen kann. Begrenzte `_generated_files`-Download-Metadaten werden separat von umfangreicher Skill-Ausgabe reserviert:

- LLM-Trace-`request`- / `response`-Tool-Abschnitte, einschließlich `_hitl_pending`-Kopien, die in den Trace-Store geschrieben werden
- Agent-Ergebnis-`tool_calls`-Datensätze, die im Ausführungsverlauf angezeigt werden
- Live-Debug-Panel-Tool-Ergebnis-Events, die denselben begrenzten, bereinigten Datensatz wiederverwenden

Live-Tool-Ausführung, modellgebundene Tool-Nachrichten und der In-Memory-HITL-Resume-Zustand (`_hitl_pending.agent_state.messages` / `tool_arguments`) behalten die Originalwerte, damit Resume und exaktes Arg-Matching weiterhin funktionieren. Nur gespeicherte Observability-Kopien werden bereinigt.

## Trace-Kontext-Propagierung

Heym folgt dem [W3C Trace Context](https://www.w3.org/TR/trace-context/)-Standard, damit Traces über Service-Grenzen hinweg verbunden bleiben.

- **Eingehende Webhooks:** Wenn eine eingehende Anfrage einen `traceparent`-Header trägt, wird der Workflow-Lauf als Child dieses Traces aufgezeichnet. Dadurch werden Heym-Läufe mit dem vorgelagerten System verknüpft, das sie ausgelöst hat.
- **Ausgehendes HTTP:** Der HTTP-Knoten fügt `traceparent` in die von ihm ausgeführten Anfragen ein, sodass nachgelagerte Services denselben Trace fortsetzen können.
- **Sub-Workflows:** Ein Sub-Workflow-Lauf wird dem Knoten untergeordnet, der ihn aufgerufen hat, wodurch die Aufrufhierarchie in einem Trace erhalten bleibt.

Trigger ohne eingehenden Kontext (wie Cron, IMAP, RabbitMQ und WebSocket) starten pro Lauf einen frischen Trace.
## Zuverlässigkeit

- Ein langsamer oder nicht erreichbarer Collector blockiert niemals die Workflow-Ausführung. Spans werden gebündelt und im Hintergrund exportiert.
- Wenn die Initialisierung des Tracings fehlschlägt (zum Beispiel aufgrund eines fehlerhaften Endpoints), protokolliert das Backend den Fehler und fährt mit deaktiviertem Tracing fort, anstatt beim Start zu scheitern.
- OTLP-Auth-Header werden ausschließlich aus der Umgebung gelesen. Sie werden niemals in der Datenbank gespeichert und niemals von der Status-API zurückgegeben.

## Verwandte Themen

- [Einstellungen](./user-settings.md) – Der Reiter Observability, der den Tracing-Status anzeigt
- [Umgebungsvariablen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Vollständige Konfigurationsreferenz
- [Trigger](./triggers.md) – Wie Workflows starten, einschließlich Webhooks
- [Ausführungsverlauf](./execution-history.md) – Heyms integrierte Verlaufsansicht pro Ausführung
- [HTTP](../nodes/http-node.md) – Der Knoten, der den Trace-Kontext an nachgelagerte Aufrufe weitergibt
