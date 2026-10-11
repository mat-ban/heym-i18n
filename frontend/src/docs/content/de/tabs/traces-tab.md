# Reiter Ausführungen

Der Reiter **Ausführungen** (Traces) bietet tiefgehende Observability für alle Sprachmodell-Aufrufe. Untersuchen Sie Prompt- und Response-Payloads, Ausführungszeiten, Tool-Aufrufe und aggregierte Metriken (Token, Kosten in USD, Latenz, Fehlerraten).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Video-Demo zu Ausführungen ansehen</a></p>

## Statistik-Header

- **KPI-Karten** – Gesamtaufrufe, Gesamttokens, Gesamtkosten (USD), Durchschnittliche Latenz, Fehlerrate (%)
- **Tokens nach Modell** – Donut-Diagramm des Token-Volumens pro Modell
- **Kosten nach Modell** – Ausgabenverteilung in USD; unbepreiste Modelle verlinken direkt auf die [LLM-Kostentabelle](./datatable-tab.md#llm-kostentabelle-systemtabelle)
- **Aufrufe über die Zeit** – Gestapeltes Flächendiagramm erfolgreicher und fehlgeschlagener Modellaufrufe

## Trace-Details

Beim Klick auf eine Trace-Zeile öffnet sich die detaillierte Ablaufanalyse:

- **Schritte-Timeline** – Geordnete Kette aller Interaktionen: `System → User → Assistant → Tool → Answer`. Jeder Schritt ist aufklappbar und zeigt formatierte Nachrichten sowie den vollständigen JSON-Baum
- **Request / Response** – Vollständige API-Payloads mit Umschaltung zwischen formatierter Baumansicht (Tree) und Rohdaten (Raw)
- **Tool-Metriken** – Dauer, Status (`success`, `error`, `timeout`, `cancelled`) und Ein-/Ausgaben jedes Werkzeugaufrufs
- **Zeitaufschlüsselung** – Aufteilung der Gesamtlaufzeit in `llm_ms`, `tools_ms` und Netzwerkzeiten
- **Zum Workflow springen** – Direkte Navigation zum zugehörigen Workflow

## Wartung & Export

- Kopieren Sie vollständige Request- und Response-JSONs zur Fehleranalyse in die Zwischenablage
- Löschen Sie historische Traces bei Bedarf über **Alle löschen** mit Bestätigung

## Verwandte Themen

- [Agent-Knoten](../nodes/agent-node.md) – Agent mit Tool-Calling
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Export von Spans via OTLP
- [Reiter DataTable](./datatable-tab.md) – LLM-Kostentabelle\n