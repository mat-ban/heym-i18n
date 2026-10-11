# Warum Heym

Heym ist die Infrastruktur für den produktiven Betrieb und die Steuerung von KI-Agenten. Eine einzige selbst gehostete Laufzeitumgebung deckt jede Phase des Agenten-Lebenszyklus ab.

Ein Prototyp-Agent benötigt lediglich ein Modell, einen Prompt und ein paar Tools. Ein produktionsreifer Agent erfordert jedoch weit mehr: Trigger und automatische Wiederholungsversuche, persistierte Zustände bei Pausen für menschliche Freigaben, eine lückenlose Aufzeichnung jedes Modell- und Tool-Aufrufs, transparente Kosten pro Ausführung, automatisierte Tests vor dem Deployment und klare Leitplanken für autonome Aktionen. Heym vereint all diese Anforderungen an einem zentralen Ort. Das System, das Sie auf dem Canvas entwerfen, ist exakt das System, das ausgeführt wird. Erstellen Sie agentenbasierte Systeme und betreiben Sie sie mit Zuverlässigkeit.

## Eine Laufzeitumgebung für den Agenten-Lebenszyklus

| Phase | Was Heym Ihnen bietet |
|---|---|
| **Erstellen** | Kombinieren Sie Agenten und deterministische Schritte auf dem Canvas, generieren Sie Workflows mit dem [KI-Assistenten](../reference/ai-assistant.md) oder starten Sie mit [Vorlagen](../tabs/templates-tab.md) und portablen Skills. |
| **Orchestrieren** | Koordinieren Sie Agenten, [Sub-Agenten](../reference/agent-architecture.md), Coding-Agenten, RAG, Browser-Automatisierung und Tools mit explizitem Datenfluss und [paralleler Ausführung](../reference/parallel-execution.md). |
| **Ausführen** | Starten Sie Workflows über [Webhooks](../reference/webhooks.md), Zeitpläne und Event-[Trigger](../reference/triggers.md) mit Wiederholungsversuchen pro Knoten, [Fehlerbehandlung](../nodes/error-handler-node.md) und [Lastverteilung](../reference/cluster.md) über Instanzen. |
| **Beobachten** | Analysieren Sie jede Ausführung im [Verlauf](../reference/execution-history.md), untersuchen Sie [LLM-Traces](../tabs/traces-tab.md), USD-Kosten pro Lauf, Live-Visualisierungen auf dem Canvas, [Analysen](../tabs/analytics-tab.md), [Warnungen](../tabs/alerts-tab.md) und [OpenTelemetry](../reference/opentelemetry.md)-Exporte. |
| **Evaluieren** | Testen Sie Prompts und Modelle gegen erwartete Ergebnisse im Reiter [Evaluierung](../tabs/evals-tab.md) mittels LLM-as-Judge-Scoring und direktem Modellvergleich. |
| **Steuern** | Behalten Sie die menschliche Kontrolle über [Review-Checkpoints (HITL)](../reference/human-in-the-loop.md) und [Guardrails](../reference/guardrails.md). Sichern Sie Zugriffe über verschlüsselte [Anmeldedaten](../reference/credentials.md), [Teams](../reference/teams.md), [Single Sign-On](../reference/sso.md) und ein [Audit-Protokoll](../reference/audit.md). |
| **Bereitstellen** | Stellen Sie Workflows über REST und [SSE Streaming](../reference/sse-streaming.md), als [MCP](../tabs/mcp-tab.md)-Tools, als [Portal](../reference/portal.md)-Chat-UIs und als [Dashboard](../tabs/dashboard-tab.md)-Widgets bereit. |

## Erstellen (Build)

### KI-Assistent: Workflows in natürlicher Sprache erstellen

Der [KI-Assistent](../reference/ai-assistant.md) ist ein Chat-Panel direkt im Workflow-Editor. Beschreiben Sie Ihre Anforderungen, z. B. *„Erstelle einen Workflow, der Benutzereingaben entgegennimmt, meine Wissensdatenbank durchsucht und mit GPT-4o antwortet“*, und der Assistent generiert Knoten und Kanten, die sofort auf den Canvas angewendet werden.

- Verwendet Ihre eigenen hinterlegten LLM-Anmeldedaten (jedes unterstützte Modell)
- Unterstützt **Spracheingabe** für freihändiges Workflow-Design
- Wendet valides Workflow-JSON aus der KI-Antwort automatisch auf den Canvas an
- Streamt Antworten und Änderungen in Echtzeit

Der Assistent arbeitet direkt im Editor und platziert Knoten in Echtzeit auf dem Canvas. Alle generierten Elemente bleiben vollständig editierbar, genau wie manuell erstellte Knoten.

### Skills-System

Skills sind portable Funktionspakete, bestehend aus einer `SKILL.md`-Instruktionsdatei und optionalen Python-Skripten, die per Drag & Drop auf jeden Agent-Knoten gezogen werden können.

- Die Anweisungen des Skills werden dem System-Prompt des Agenten vorangestellt
- Im Skill enthaltene Python-Dateien werden zu aufrufbaren Tools
- Skills sind über Workflows hinweg wiederverwendbar und als `.zip`-Archive teilbar

Dies entspricht der Übergabe einer klaren Stellenbeschreibung zusammen mit einem maßgeschneiderten Werkzeugkasten an Ihren Agenten.

### Workflow-Analyse: Ausführungsbezogenes Feedback

Das Panel zur [Workflow-Analyse](../reference/workflow-analysis.md) ist ein integriertes Dokumentations- und Feedback-Tool im Editor. Klicken Sie auf **Analysieren**, wählen Sie Anmeldedaten und Modell, und Heym generiert einen editierbaren Markdown-Bericht für den aktuellen Workflow.

Im Gegensatz zu statischen Notizen führt das Analysetool den Workflow nach Möglichkeit zuerst aus und bezieht das reale Ausführungsergebnis in den Prompt ein. Der Bericht hebt Optimierungspotenziale hervor, beschreibt den Zweck des Workflows und erklärt Schritt für Schritt, was die einzelnen Knoten tun. Existiert bereits ein Bericht, streamt **Erneut analysieren** eine Vorschau, sodass Sie die neue Version übernehmen oder das bisherige Dokument beibehalten können.

## Orchestrieren (Orchestrate)

### Integrierte LLM- und Agent-Knoten

Der [Agent-Knoten](../nodes/agent-node.md) von Heym führt eine eng integrierte Tool-Calling-Schleife mit Inline-Python-Tools, MCP-Verbindungen und einem portablen Skills-System aus – maßgeschneidert für produktive Agenten.

Auch der Standard-[LLM-Knoten](../nodes/llm-node.md) geht weit über einen simplen Prompt-Response-Schritt hinaus. Für unterstützte OpenAI- und kompatible Endpoints kann er in den **Batch-API-Modus** wechseln, sodass ein einzelner Knoten ein Array von Prompts in einer kostengünstigeren Provider-Batch-Anfrage übermittelt. Der Canvas stellt hierfür einen dedizierten `batchStatus`-Zweig bereit, der ausgelöst wird, wenn der Batch Status wie `pending`, `processing` und `completed` durchläuft.

Dadurch kann der LLM-Knoten zwei Aufgaben gleichzeitig bewältigen:

- Die Haupt-Batch-Anfrage ausführen und die finalen Einzelergebnisse über den regulären Zweig zurückgeben
- Benachrichtigungs- oder Protokolllogik bei jedem Status-Update anstoßen, ohne dass Sie eine eigene Polling-Schleife bauen müssen

Die Batch-Ausführung ist ein erstklassiges primitives Element im Workflow, inklusive Modell- und Provider-Validierung direkt in der Benutzeroberfläche.

Der **Agent-Knoten** bildet das Herzstück der Orchestrierung:

- **Tool-Calling** – Der Agent iteriert in einer Schleife über Tool-Aufrufe, bis er eine finale Antwort formuliert
- **Python-Tools** – Definieren Sie benutzerdefinierte Tools direkt inline mit vollem Python; der Agent ruft sie zur Laufzeit auf
- **MCP-Verbindungen** – Verbinden Sie sich mit beliebigen [Model Context Protocol](https://modelcontextprotocol.io/)-Servern (stdio oder SSE), und der Agent erhält automatisch Zugriff auf alle verfügbaren Tools
- **Skills** – Ziehen Sie eine `.zip`- oder `.md`-Datei auf einen Agenten, um dessen Systemkontext zu erweitern und Python-Tools hinzuzufügen
- **Sub-Workflow-Aufrufe** – Der Agent kann andere Heym-Workflows als Tools aufrufen und so komplexe Verhaltensweisen ohne benutzerdefinierten Code zusammensetzen

Siehe [Agent-Knoten](../nodes/agent-node.md) und [Agenten-Architektur](../reference/agent-architecture.md) für die vollständige Referenz.

### Multi-Agenten-Orchestrierung

Heym unterstützt das **Orchestrator-Muster** mit nativen visuellen Primitiven:

- Ein Agent fungiert als **Orchestrator** (`isOrchestrator: true`) und erhält das Tool `call_sub_agent`
- Er delegiert Teilaufgaben an benannte **Sub-Agenten** auf demselben Canvas
- Sub-Agenten können ihrerseits weitere Agenten oder Sub-Workflows aufrufen (maximale Schachtelungstiefe: 5)
- **Parallele Ausführung**: Ruft der Orchestrator mehrere Sub-Agenten in einem Schritt auf, werden diese für schnellere Ergebnisse parallel ausgeführt

Dies ermöglicht Architekturen wie einen Planungs-Agenten, der Aufgaben an einen Rechercheur, einen Programmierer und einen Zusammenfasser verteilt – alles visuell verdrahtet ohne Orchestrierungscode.

### Coding-Agenten als Workflow-Knoten

Heym bietet zwei Knoten, die vollwertige Coding-Agenten als Workflow-Schritte ausführen:

- **[Codex-Knoten](../nodes/codex-node.md)** – Führt die OpenAI Codex CLI in einem isolierten Arbeitsbereich gegen ein GitHub-Repository aus. Unterstützt **Sign in with ChatGPT** (PKCE OAuth über Ihr Plus/Pro-Abonnement ohne Token-API-Kosten) oder ein Personal Access Token, klont das Repository, lässt Codex Code editieren und gibt `summary`, `diff`, `changedFiles` sowie eine Entwurfs-`pullRequestUrl` zurück.
- **[OpenCode Go-Knoten](../nodes/opencode-go-node.md)** – Derselbe Repository-Workflow über das providerunabhängige OpenCode-Gateway (Kimi, DeepSeek, Qwen u. a.), ausgeführt in einem **gehärteten Einweg-Container**: alle Linux-Capabilities entzogen, Read-Only-Root-Dateisystem, strenge PID-, Speicher- und CPU-Limits. Das GitHub-Token verbleibt außerhalb der Sandbox: Heym führt alle Git- und GitHub-Operationen auf Host-Ebene aus, sodass generierter Code keine Push-Berechtigungen abgreifen kann.

So kann ein Workflow ein Bug-Ticket aus einem Webhook analysieren, das Repository an einen Coding-Agenten übergeben, auf den Pull-Request-Entwurf warten und den Link vollautomatisch in Slack posten.

### Integrierte RAG-Pipeline

Heym enthält einen [RAG- / Vektorspeicher-Knoten](../nodes/rag-node.md) und einen verwalteten Reiter [Vektorspeicher](../tabs/vectorstores-tab.md):

- Wählen Sie Ihr Vektor-Backend: **Qdrant** (externer Server) oder **Postgres (pgvector)**, das Vektoren direkt in Heyms eigener Datenbank speichert – ohne zusätzliche Dienste
- Fügen Sie Dokumente direkt über einen Workflow-Knoten in einen Vektorspeicher ein
- Durchsuchen Sie Sammlungen mit semantischer Ähnlichkeitssuche und übergeben Sie relevante Abschnitte an LLMs
- Erstellen und verwalten Sie Sammlungen visuell im Reiter Vektorspeicher

### Browser-Automatisierung mit Playwright

Der [Playwright-Knoten](../nodes/playwright-node.md) ermöglicht Web-Scraping und Browser-Automatisierung mit echtem Chromium:

- **Visueller Schritt-Modus** – Aktionen wie Navigieren, Klicken, Ausfüllen, Warten und Extrahieren visuell zusammenstellen
- **KI-Schritte** – Beschreiben Sie Browser-Aktionen in natürlicher Sprache; Heym übersetzt sie in Playwright-Aktionen
- **Code-Modus** – Schreiben Sie vollständige Playwright-Python-Skripte für komplexe Abläufe
- **Screenshots & PDF-Export** – Erfassen Sie Bildschirminhalte und verarbeiten Sie sie in nachfolgenden Schritten

### Natives MCP (Model Context Protocol)

Heym implementiert MCP auf beiden Seiten:

- **Client-Modus**: Verbinden Sie Agenten mit externen MCP-Servern über stdio oder SSE. Werkzeuge werden dynamisch erkannt und dem Agenten zur Verfügung gestellt.
- **Server-Modus**: Veröffentlichen Sie Heym-Workflows als MCP-Tools unter `/api/mcp/sse`. Claude Desktop, Cursor und andere MCP-Clients können Ihre Workflows direkt aufrufen.

### Human-in-the-Loop (HITL)

Fügen Sie Freigabe-Checkpoints in Workflows ein, an denen ein Agent vor sicherheitskritischen Aktionen stoppen muss.

- Der Agent ruft `request_human_review` auf und pausiert die Ausführung
- Heym generiert einen sicheren Einmal-Link (`/review/{token}`)
- Prüfer können den Vorschlag annehmen, im Markdown-Editor bearbeiten oder ablehnen
- Nach Freigabe setzt Heym die Ausführung nahtlos ab dem Snapshot fort

### Parallele DAG-Ausführung

Heyms Ausführungs-Engine analysiert Knoten-Abhängigkeiten und führt unabhängige Zweige im gerichteten azyklischen Graphen (DAG) automatisch parallel aus. Verwenden Sie den [Zusammenführungs-Knoten](../nodes/merge-node.md), um parallele Pfade wieder zu synchronisieren.

## Ausführen (Run)

### Vielseitige Trigger

Starten Sie Workflows über flexible Eingangskanäle:

- **[Webhooks](../reference/webhooks.md)** – Eingehende HTTP-POST/GET-Aufrufe mit Authentifizierung und Payload-Validierung
- **[Cron-Zeitpläne](../nodes/cron-node.md)** – Zeitgesteuerte Ausführungen mit Zeitzonenunterstützung
- **Event-Trigger** – Telegram-, Discord-, Slack-, IMAP- und WebSocket-Trigger reagieren unmittelbar auf externe Ereignisse
- **Chat-Portal** – Interaktive Ausführung über Endbenutzer-Chatinterfaces

### Robuste Ausführungs-Engine

- **Wiederholungsversuche pro Knoten** – Konfigurieren Sie Backoff-Strategien und maximale Versuche bei Netzwerk- oder API-Fehlern
- **[Fehlerbehandlung](../nodes/error-handler-node.md)** – Fangen Sie Fehler ab und leiten Sie alternative Bereinigungs- oder Benachrichtigungspfade ein
- **State-Snapshots** – Jeder Schritt wird in PostgreSQL persistiert, sodass langlaufende Workflows Systemneustarts überstehen

### Lastverteilung & Cluster

Betreiben Sie mehrere Heym-Instanzen gegen dieselbe PostgreSQL-Datenbank. Hintergrundläufe (Cron, Webhooks, MCP-Aufrufe) werden prozentual auf die Worker-Instanzen verteilt, während Dateioperationen und Editor-Zugriffe auf der Hauptinstanz verbleiben. Siehe [Lastverteilung](../reference/cluster.md).

## Beobachten (Observe)

### Lückenloser Ausführungsverlauf

Untersuchen Sie jeden Lauf im Detail:

- Vollständige Ein- und Ausgaben jedes Knotens
- Ausführungszeiten, Token-Verbrauch und berechnete Kosten in USD
- Visuelle Hervorhebung des Ausführungspfads auf dem Canvas

### OpenTelemetry Distributed Tracing

Heym bietet native OpenTelemetry-Instrumentierung ohne zusätzlichen Code:

- Exportiert Workflow-, Knoten- und Agent-Tool-Spans über OTLP/HTTP an Backends wie Jaeger
- Unterstützt W3C Trace Context Propagation über Webhooks und HTTP-Knoten hinweg
- Konfigurierbar über `HEYM_OTEL_*`-Umgebungsvariablen

### Warnungen & Monitoring

Im Reiter [Warnungen](../tabs/alerts-tab.md) definieren Sie Schwellenwerte für Fehlerraten, Laufzeiten, Token-Kosten und Ausführungsvolumen über gleitende Zeitfenster. Bei Überschreitung wird automatisch ein Benachrichtigungs-Workflow ausgelöst.

## Evaluieren (Evaluate)

Im Reiter [Evaluierung](../tabs/evals-tab.md) testen Sie Ihre KI-Prompts systematisch:

- Definieren Sie Testfälle mit Eingabedaten und Soll-Kriterien
- Nutzen Sie LLM-as-Judge für automatisierte semantische Qualitätsbewertungen
- Vergleichen Sie Modelle und Prompt-Iterationen nebeneinander bezüglich Genauigkeit, Latenz und Kosten

## Steuern (Control)

- **Single Sign-On (SSO)** – Nahtlose OIDC-Anbindung an Keycloak, Okta, Google oder Authentik
- **Teamverwaltung** – Rollenbasierte Zugriffssteuerung (RBAC) für Workflows, Anmeldedaten und Tabellen
- **Tresor für Anmeldedaten** – AES-256-verschlüsselte Ablage für API-Keys mit granularer Freigabe
- **Audit-Protokollierung** – Revisionssichere Aufzeichnung aller administrativen und sicherheitsrelevanten Aktionen
- **Guardrails** – Prüfung von Eingaben und Modellantworten zur Einhaltung von Sicherheitsrichtlinien

## Bereitstellen (Expose)

### APIs und Streaming

Workflows sind über HTTP aufrufbar:
- `/api/workflows/{workflow_id}/execute` – Synchrone JSON-Antwort
- `/api/workflows/{workflow_id}/execute/stream` – Server-Sent Events (SSE) mit Live-Knoten-Updates

### Chat-Portale

Verwandeln Sie jeden Workflow mit dem [Portal](../reference/portal.md)-Feature in eine eigenständige Chat-Webseite unter `/chat/{slug}` für Kunden oder interne Teams – ohne eine einzige Zeile Frontend-Code zu schreiben.

### Workflow-gestützte Dashboards

Im Reiter [Dashboard](../tabs/dashboard-tab.md) erstellen Sie visuelle Kennzahlen-Dashboards. Jedes Diagramm-Widget wird im Hintergrund von einem eigenen Heym-Workflow angetrieben, der Daten aus APIs, Datenbanken oder Tabellen abruft und aufbereitet.

## Vergleich mit Workflow-Automatisierungs-Tools

Viele Teams kommen von klassischen Automatisierungsplattformen zu Heym. Die folgende Tabelle vergleicht Heym mit n8n, Zapier und Make.com hinsichtlich der Kernfunktionen für produktive KI-Agenten:

| Funktion | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Integrierter LLM-Knoten | ✓ | ✓ | ✓ | ✓ |
| LLM-Batch-API + Status-Zweige | ✓ | eingeschränkt¹¹ | –¹¹ | eingeschränkt¹¹ |
| Integrierter Agent-Knoten (Tool-Calling) | ✓ | ✓ | ✓ | ✓ |
| Multi-Agenten-Orchestrierung | ✓ | ✓ | eingeschränkt | eingeschränkt |
| Coding-Agent-Knoten (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Integrierter RAG- / Vektorspeicher | ✓ | ✓ | eingeschränkt¹ | Plugin² |
| WebSocket lesen / schreiben | ✓ | eingeschränkt¹² | –¹³ | –¹⁴ |
| Workflow-Erstellung in natürlicher Sprache | ✓ | eingeschränkt³ | ✓ | ✓ |
| Workflow-Analyse & Feedback | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Laufenden Prozess live auf dem Canvas öffnen | ✓ | eingeschränkt¹⁹ | eingeschränkt¹⁹ | –¹⁹ |
| Workflow-gestützte Dashboards | ✓ | eingeschränkt¹⁷ | eingeschränkt¹⁷ | eingeschränkt¹⁷ |
| Agentenbasiertes Kanban-Board | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Skills-System für Agenten | ✓ | – | – | – |
| Integrierter Dateispeicher (Drive, Freigaben) | ✓ | eingeschränkt²² | eingeschränkt²² | –²² |
| Browser-Automatisierungsknoten (Playwright) | ✓ | eingeschränkt²³ | eingeschränkt²³ | –²³ |
| LLM-Trace-Inspektion | ✓ | eingeschränkt⁴ | – | ✓ |
| OpenTelemetry-Export | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM-Token-Kostenverfolgung (USD) | ✓ | –¹⁵ | –¹⁵ | eingeschränkt¹⁵ |
| Integrierte Evals für KI-Workflows | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) Checkpoints | ✓ | ✓⁵ | eingeschränkt⁶ | eingeschränkt⁷ |
| LLM-Guardrails | ✓ | ✓⁸ | ✓⁸ | eingeschränkt⁸ |
| Automatische Kontext-Kompression | ✓ | – | – | – |
| Parallele DAG-Ausführung | ✓ | eingeschränkt⁹ | – | – |
| Selbst hostbar, Source-Available | ✓ MIT + Commons Clause | ✓ Fair-Code¹⁰ | – | – |
| Ausdrucks-DSL für dynamische Daten | ✓ | ✓ | eingeschränkt | ✓ |

> **Fußnoten:**
> ¹ Zapier Knowledge Sources – kein direkter Zugriff auf Vektorspeicher oder Embedding-Konfiguration.
> ² Make.com bietet Pinecone/Qdrant-Module, jedoch keinen nativen RAG-Knoten.
> ³ n8n AI Workflow Builder ist eine Cloud-only Beta mit Credit-Limits.
> ⁴ n8n zeigt Zwischenschritte; vollständiges Tracing erfordert Drittanbieter-Tools.
> ⁵ n8n unterstützt Freigaben über Chat und E-Mail, pausiert und persistiert jedoch nicht die gesamte Ausführung als Snapshot wie Heym.
> ⁶ Zapier Human-in-the-Loop unterstützt einfache Genehmigungen, bietet jedoch kein Snapshot-Resume-Checkpoint-System.
> ⁷ Make.com bietet HITL nur im Enterprise-Tarif an.
> ⁸ n8n bietet einen Guardrails-Knoten, Zapier AI Guardrails; Make.com bietet keine vergleichbare Standalone-Funktion.
> ⁹ n8n führt standardmäßig sequenziell aus; Parallelität erfordert Sub-Workflow-Workarounds.
> ¹⁰ Sustainable Use License – kostenfrei für interne Nutzung, kommerzielle Weiterverbreitung eingeschränkt.
> ¹¹ n8n und Make unterstützen HTTP-Batching, bieten jedoch keine native LLM-Batch-Status-Zweiglogik.
> ¹² n8n bietet Webhooks, jedoch keine nativen WebSocket-Trigger/Sendeknoten ohne Custom Code.
> ¹³ Zapier unterstützt Webhooks nur über HTTP, keine persistenten WebSockets.
> ¹⁴ Make.com bietet HTTP/Webhooks, aber keine nativen WebSocket-Knoten.
> ¹⁵ n8n bietet keine native USD-Token-Kostenverfolgung. Zapier zählt nur Tasks. Make zeigt Credits, aber keine USD-Aufschlüsselung nach Modell.
> ¹⁶ Heym sendet standardmäßig native W3C-Spans über OTLP/HTTP. n8n unterstützt OTel; Zapier und Make dokumentieren keinen OTel-Export.
> ¹⁷ n8n, Zapier und Make bieten Monitoring-Seiten, jedoch keine freien Widgets, die von beliebigen Workflows gespeist werden.
> ¹⁸ Heyms Workflow-Analyse führt den Workflow aus und erzeugt editierbare Markdown-Berichte; Mitbewerber bieten keine vergleichbare run-aware Dokumentation.
> ¹⁹ Heym erlaubt das direkte Einklinken in laufende Hintergrundprozesse auf dem Canvas mit Live-Animation und Debug-Logs.
> ²⁰ Kein Mitbewerber bietet vollwertige Coding-Agent-Knoten, die Repositories klonen, Branches erstellen und PRs einreichen.
> ²¹ Heym bietet ein integriertes Kanban-Board mit Workflow-ausführenden Spalten. Andere Tools binden lediglich externe Boards an.
> ²² Heym bietet ein persistentes internes Drive mit Team-Freigabelinks.
> ²³ Heyms Playwright-Knoten bietet KI-Schritte, visuelle Aktionen und Code-Modus direkt out-of-the-box.

## Verwandte Themen

- [Einführung](./introduction.md) – Plattformübersicht
- [Schnellstart](./quick-start.md) – Ersten Workflow erstellen
- [Workflow-Analyse](../reference/workflow-analysis.md) – Berichte und Verbesserungsvorschläge
- [Reiter Dashboard](../tabs/dashboard-tab.md) – Diagramm-Widgets mit Workflows erstellen
- [Agent-Knoten](../nodes/agent-node.md) – LLM-Knoten mit Tool-Calling, MCP und Skills
- [Agenten-Architektur](../reference/agent-architecture.md) – Sub-Agenten und Orchestrierung
- [Reiter Board](../tabs/board-tab.md) – Kanban-Board mit Workflow-Automation
- [Codex-Knoten](../nodes/codex-node.md) – OpenAI Codex im Workflow ausführen
- [OpenCode Go-Knoten](../nodes/opencode-go-node.md) – Providerunabhängiger Coding-Agent
- [Reiter Drive](../tabs/drive-tab.md) – Integrierter Dateispeicher
- [Playwright-Knoten](../nodes/playwright-node.md) – Browser-Automatisierung
- [RAG- / Vektorspeicher-Knoten](../nodes/rag-node.md) – Semantische Vektorsuche
- [KI-Assistent](../reference/ai-assistant.md) – Workflows per Spracheingabe entwerfen
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Freigabe-Checkpoints
- [Guardrails](../reference/guardrails.md) – Prompt-Sicherheitsprüfungen
- [Reiter Ausführungen](../tabs/traces-tab.md) – LLM-Observability und Kosten
- [Reiter Evaluierung](../tabs/evals-tab.md) – Test-Suiten für Prompts
- [Reiter Warnungen](../tabs/alerts-tab.md) – Schwellenwert-Alarme
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – OTLP-Span-Export
- [Lastverteilung](../reference/cluster.md) – Multi-Instanz-Cluster
- [Single Sign-On](../reference/sso.md) – OIDC-Authentifizierung
- [Audit-Protokollierung](../reference/audit.md) – Revisionssichere Logs
- [Portal](../reference/portal.md) – Chat-UIs veröffentlichen
- [Parallele Ausführung](../reference/parallel-execution.md) – DAG-Parallelität
- [Reiter MCP](../tabs/mcp-tab.md) – MCP-Server und -Clients konfigurieren\n