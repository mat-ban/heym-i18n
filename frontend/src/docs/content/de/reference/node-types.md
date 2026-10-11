# Knotentypen

Heym bietet eine Vielzahl von Knotentypen zum Erstellen von Workflows. Verwende [Ausdrücke](./expression-dsl.md) wie `$input.text` und `$nodeLabel.field` in der Knotenkonfiguration.

## Trigger-Knoten

| Knoten | Beschreibung | Ausgaben |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Texteingangspunkt für den Workflow (HTTP/[Webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger nach Zeitplan (Cron-Ausdruck) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger, wenn ein Telegram-Bot-Webhook-Update eintrifft | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger, wenn Slack einen Events-API-Webhook sendet | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger, wenn Discord einen Application-Interaction-Webhook sendet | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger, wenn eine neue E-Mail in einem IMAP-Postfach eintrifft | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger, wenn Heym ein Plattform-Ereignis veröffentlicht (gebündeltes Array) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger aus einer ausgehenden Verbindung zu einem externen WebSocket-Server | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Erzeugt einen einmalig verwendbaren Upload-Link und startet, wenn eine große Datei hochgeladen wird | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger, wenn eine Nachricht aus einer Queue empfangen wird | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Wird ausgeführt, wenn ein Knoten einen Fehler wirft (keine eingehende Kante) | 1 |

Siehe [Trigger](./triggers.md) für alle Einstiegspunkte.

## KI-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Text mit einem Sprachmodell verarbeiten | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Ein Entscheidungsmodell typisierte Fragen stellen und anhand der zurückgegebenen Wahrscheinlichkeiten verzweigen | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM mit Tool-Aufrufen, Skills, MCP, optionaler [menschlicher Prüfung](./human-in-the-loop.md) und optionalem [persistentem Speichergraphen](./agent-persistent-memory.md). Siehe [Agent-Architektur](./agent-architecture.md). | 1 | 1, plus optionale `review`-Ausgabe |
| [Codex](../nodes/codex-node.md) | Die lokale Codex CLI gegen ein GitHub-Repository mit einem ChatGPT/Codex-Zugriffstoken ausführen | 1 | 1, plus `question`-Ausgabe |
| [OpenCode Go](../nodes/opencode-go-node.md) | Die OpenCode CLI gegen ein GitHub-Repository in einem gehärteten Container mit einem OpenCode-Go-Gateway-API-Schlüssel ausführen | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Ein bestimmtes MCP-Tool direkt aufrufen, ohne dass ein LLM es auswählt | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Einfügen, Upsert, Löschen oder Suchen in einem Qdrant- oder Postgres- (pgvector-) [Vektorspeicher](../tabs/vectorstores-tab.md) für RAG | 1 | 1 |

## Logik-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Verzweigung basierend auf if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Weiterleiten durch Abgleichen eines Werts mit Fällen | 1 | n |
| [Merge](../nodes/merge-node.md) | Auf mehrere Eingaben warten und zusammenführen | n | 1 |
| [Loop](../nodes/loop-node.md) | Über ein Array iterieren | 1 | 2 (loop/done) |

## Daten-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Daten transformieren und zuordnen | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Daten zwischen Formaten konvertieren (CSV, JSON, XML) und Bilder oder PDFs per OCR in Text umwandeln | 1 | 1 |
| [Code](../nodes/code-node.md) | Python in einer wegwerfbaren, netzwerkisolierten Sandbox mit eigener requirements.txt ausführen | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Eine Variable setzen oder abrufen (workflow-lokal oder [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Einen anderen Workflow aufrufen | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heym-Workflows und Ausführungsverlauf lesen | 1 | 1 |
## Integrations-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP-Anfragen stellen (cURL) | 0 oder 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Mit einem externen WebSocket verbinden und eine Nachricht senden | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegram-Bot-Nachrichten senden | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slack-Nachrichten senden | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord-Webhook-Nachrichten senden | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | E-Mails über SMTP senden | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-Operationen (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Grist-Tabellen lesen/schreiben | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Repositories, Benutzer, Issues, Pull Requests, Reviews, Releases, Actions-Workflows und Dateien über die GitHub REST API verwalten | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira-Projekte, Issues, Kommentare, Anhänge, Benutzer, Benachrichtigungen und Workflow-Übergänge über die Jira REST API verwalten | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Linear-Teams, Projekte, Issues, Workflow-Status und Kommentare über GraphQL verwalten | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets über OAuth2 lesen/schreiben | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive-Dateien über OAuth2 auflisten, herunterladen, aktualisieren und löschen | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | SQL-Abfragen in BigQuery ausführen und Zeilen einfügen | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Supabase-Tabellen über PostgREST abfragen und verändern | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | SQL-, CRUD- und Count-Operationen gegen ClickHouse ausführen | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notion-Datenbanken, Datenquellen, Seiten und Blöcke verwalten | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry-Organisationen, Projekte, Teams, Issues, Events und Releases verwalten | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Buckets und Ordner verwalten; Objekte auflisten, hochladen, herunterladen, kopieren und löschen | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym-Datentabellen lesen/schreiben (First-Party-Speicher) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive-Dateien verwalten: löschen, Passwort setzen, TTL, maximale Downloads, Team-Freigabe/Aufhebung der Freigabe | 1 | 1 |

## Automatisierungs-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Webseiten mit FlareSolverr scrapen | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Browser-Automatisierung mit AI-Schritt und Auto Heal | 1 | 1 |

## Utility-Knoten

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Ausführung verzögern | 1 | 1 |
| [Output](../nodes/output-node.md) | Output-Endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Felder einem JSON-Objekt zuordnen; alleiniger Terminal-Knoten = Body auf oberster Ebene von Webhook/Run | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Eine HTML-Seite rendern; alleiniger Terminal-Knoten = Webhook antwortet mit text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminal-Dashboard-Widget-Ausgabe, die vorgelagerte Zeilen in Chart-Payloads abbildet | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Markdown-Notizen zum Canvas hinzufügen (wird nicht ausgeführt) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | In der Backend-Konsole protokollieren | 1 | 1 |
| [Knoten deaktivieren](../nodes/disable-node.md) | Einen anderen Knoten im Workflow deaktivieren | 1 | 1 |
| [Knoten aktivieren](../nodes/enable-node.md) | Einen deaktivierten Knoten im Workflow aktivieren | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Workflow mit Fehlerantwort stoppen | 1 | 0 |

## Plugin-Knoten

Plugin-Knoten werden von Plugins bereitgestellt, die auf der Instanz installiert sind. Jedes installierte
Plugin erscheint in der Palette unter **Plugins** mit seinem eigenen Namen; unter der Haube
wird es einem dieser beiden Knotentypen zugeordnet.

| Knoten | Beschreibung | Eingaben | Ausgaben |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Benutzerdefinierte Aktion, die von einem installierten Plugin bereitgestellt wird | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Benutzerdefinierter Trigger, der von einem installierten Plugin bereitgestellt wird | 0 | 1 |

## Verwandte Themen

- [Canvas-Funktionen](./canvas-features.md) – Data pin, Ausführungsprotokolle, Aktivieren/Deaktivieren, in Sub-Workflow extrahieren
- [Agent-Knoten](../nodes/agent-node.md) – Detaillierte Referenz für den AI Agent-Knoten
- [Agent-Architektur](./agent-architecture.md) – Sub-Agents, Orchestrator, Skills, MCP, Tool-Aufrufe
- [Persistentes Agent-Gedächtnis](./agent-persistent-memory.md) – Wissensgraph pro Knoten, Freigabe und Hintergrund-Extraktion
- [Human-in-the-Loop](./human-in-the-loop.md) – Agent-Ausgabe für menschliche Genehmigung pausieren
- [Ausdrucks-DSL](./expression-dsl.md) – Referenzieren von Daten in der Knotenkonfiguration
- [Ausdrucksauswertungs-Dialog](./expression-evaluation-dialog.md) – Erweiterbarer Editor mit Live-Backend-Vorschau
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Große Multipart-Uploads über Einmal-Links akzeptieren
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Echtzeit-Outbound-Socket-Trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Nachrichten an externe Sockets pushen
- [Workflow-Struktur](./workflow-structure.md) – JSON-Format für Knoten und Kanten
- [Trigger](./triggers.md) – Alle Workflow-Einstiegspunkte
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – API-Schlüssel für LLM, HTTP und andere Knoten hinzufügen
- [Anmeldedaten-Freigabe](./credentials-sharing.md) – Anmeldedaten mit anderen Benutzern teilen
- [Portal](./portal.md) – Workflows als öffentliche Chat-UIs bereitstellen
- [Reiter „Vektorspeicher“](../tabs/vectorstores-tab.md) – Vektorspeicher für RAG-Knoten erstellen
