# Anmeldedaten

Anmeldedaten speichern API-Schlüssel und Secrets, die von Workflow-Knoten verwendet werden. Du fügst sie im [Reiter „Anmeldedaten"](../tabs/credentials-tab.md) hinzu und referenzierst sie in der Knotenkonfiguration über ihren Namen.

## Was Anmeldedaten sind

- **Pro Benutzer gespeichert** – Jede Anmeldedaten gehört einem Benutzer und kann mit anderen Benutzern oder [Teams](./teams.md) [geteilt](./credentials-sharing.md) werden.
- **Verschlüsselt im Ruhezustand** – Sensible Werte werden verschlüsselt; die UI maskiert sie nach der Erstellung.
- **Über den Namen referenziert** – Knoten wählen eine Anmeldedaten über den Namen (oder die ID) aus. Die Ausführungs-Engine löst die Anmeldedaten zur Laufzeit für den Workflow-Eigentümer auf.

## Wie Knoten sie verwenden

| Knotentyp | Typische Anmeldedaten | Zweck |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evaluierung](../tabs/evals-tab.md) | OpenAI, Google, Custom | API-Schlüssel für das Modell |
| [Decision](../nodes/decision-node.md), [Evaluierung](../tabs/evals-tab.md) Judge | Decision Model | Basis-URL eines Decision-Model-Endpoints, plus ein optionaler API-Schlüssel |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Wählt aus, welches deiner Modelle jede Anfrage bedient, unter Verwendung eines Decision-Models |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-Abonnement-Anmeldung (OAuth) oder ein Codex-Zugriffstoken für den Runner, plus ein GitHub-PAT für Repository-Operationen |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Ein OpenCode Go Gateway-API-Schlüssel (optionale Basis-URL) für den Runner, plus ein GitHub-PAT für Repository-Operationen |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub Personal Access Token (PAT) für GitHub-API-Aufrufe, GitHub-Knotenoperationen und MCP-Integrationen |
| [Jira](../nodes/jira-node.md) | Jira | Cloud-E-Mail/API-Token oder Data-Center-Benutzername/Passwort, Jira-Site-Basis-URL, Deployment-Modus und optionale REST-API-Version |
| [Linear](../nodes/linear-node.md) | Linear | Persönlicher API-Schlüssel oder OAuth2 für Teams, Projekte, Issues und Kommentare |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Authentifizierung für Anfragen |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot-Token und optionales Webhook-Secret |
| [Discord](../nodes/discord-node.md) | Discord | Eingehende Webhook-URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Anwendungs-Public-Key für die Signaturverifizierung |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektorspeicher-Verbindung (externes Qdrant oder Heyms eigenes Postgres via pgvector), mit OpenAI oder einem beliebigen OpenAI-kompatiblen Embedding-Endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook oder API-Token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Verbindung zum Posteingang |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mailserver |
| [Redis](../nodes/redis-node.md) | Redis | Verbindung |
| [Grist](../nodes/grist-node.md) | Grist | API-Schlüssel + Server-URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client-ID + Client-Secret + OAuth2-Zustimmung |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client-ID + Client-Secret + OAuth2-Zustimmung |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client-ID + Client-Secret + OAuth2-Zustimmung |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekt-URL + API-Schlüssel (+ optionales Standard-Schema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + Port + Benutzername/Passwort + Datenbank (+ Secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internes Integrationstoken oder öffentliche Integration mit Client-ID + Client-Secret + OAuth-Zustimmung |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth-Token plus optionale selbst gehostete Basis-URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access Key, Secret Key, Region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP-URL |

Für die detaillierte Einrichtung (Hosts, Ports, anbieterspezifische Felder) siehe [Drittanbieter-Integrationen](./integrations.md). Das umfasst die Telegram-Bot-Einrichtung, eingehende E-Mails via IMAP und ausgehende E-Mails via SMTP.

GitHub-Anmeldedaten können auch eine optionale `base_url` enthalten, wenn du statt GitHub.com einen GitHub
Enterprise Server ansprechen möchtest. Wenn du eine GitHub-Anmeldedaten bearbeitest, um das Token zu rotieren,
bleibt der bestehende Enterprise-Endpoint erhalten, wenn du `base_url` leer lässt. Gib nur dann eine neue URL ein,
wenn du diesen Endpoint ändern möchtest.

Jira-, Linear-, Supabase-, Notion-, Sentry- und ClickHouse-Anmeldedaten bieten **Test Connection** im Anmeldedaten-Dialog. Bei Jira ruft die Prüfung Jiras aktuellen Benutzer-Endpoint auf. Bei Linear
ruft die Prüfung die Linear-API mit `getViewer` auf und bestätigt, dass der API-Schlüssel oder das OAuth-Token gültig ist.
Beim Bearbeiten kannst du testen, ohne den API-Schlüssel erneut einzugeben, wenn das gespeicherte Secret noch vorhanden ist. Bei Notion
wähle im Dialog **Internal token** oder **OAuth**; OAuth verwendet die Client-ID und das Client-Secret
aus deiner öffentlichen Notion-Integration. Siehe [Drittanbieter-Integrationen](./integrations.md#notion) für
Details zur Notion-Einrichtung.

## Nutzung des Coding-Pakets

Der Reiter **AI Defaults** in den [Einstellungen](./user-settings.md) zeigt die verbleibende Nutzung des Coding-Pakets für deine Codex-Anmeldedaten (eigene und geteilte). Für jede Codex-Anmeldedaten wird ein horizontaler Balken pro aktivem Rate-Limit-Fenster angezeigt – typischerweise ein **5 Stunden**- und/oder **Wöchentliches** Fenster, abhängig von deinem Plan – mit dem verbleibenden Quota-Prozentsatz und einem Countdown bis zum Reset. Die Daten stammen aus den Rate-Limit-Response-Headern des Codex-Backends, die bei Bedarf abgerufen werden.

OpenCode Go-Anmeldedaten werden dort ebenfalls aufgelistet, aber als **„Nutzung nicht verfügbar"** gekennzeichnet: Das OpenCode zen Gateway stellt keine Daten zum verbleibenden Quota bereit, sodass kein Balken angezeigt werden kann.
## In Expressions

Einige Knoten erlauben Expressions für die Authentifizierung. Verwende [Ausdrucks-DSL](./expression-dsl.md) mit `$credentials.CredentialName`, um das aufgelöste Secret einer Anmeldedaten innerhalb einer Expression zu referenzieren. Welche Header-Zeile jeder Anmeldedaten-Typ in einer HTTP-Anfrage benötigt, siehe [HTTP › Authentifizierung mit Anmeldedaten](../nodes/http-node.md#authenticating-with-credentials).

Codex-Anmeldedaten sind absichtlich von `$credentials` ausgeschlossen. Ob du dich mit ChatGPT anmeldest (Abonnement, keine API-Kosten pro Token) oder ein Codex `access_token` einfügst, die Token werden nur an den lokalen Codex-Runner-Prozess übergeben. ChatGPT-Anmelde-Token werden automatisch erneuert, wenn sie ablaufen.

Jira-Anmeldedaten sind ebenfalls von `$credentials` ausgeschlossen. Der [Jira-Knoten](../nodes/jira-node.md) lädt die Anmeldedaten zur Laufzeit über `credentialId`. Für benutzerdefinierte Jira-REST-Aufrufe, die nicht vom Jira-Knoten abgedeckt werden, verwende den [HTTP-Knoten](../nodes/http-node.md) mit Jira Basic Auth (`email:api_token` für Jira Cloud oder `username:password` für Data Center / Server), zum Beispiel `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Du kannst auch eine [Header](../nodes/http-node.md)-Anmeldedaten mit `Authorization: Basic <base64(user:secret)>` verwenden. Jira Data Center / Server Personal Access Tokens und Bearer Auth werden von der Jira-Anmeldedaten noch nicht unterstützt.

| Anmeldedaten-Typ | Wert, der für `$credentials.Name` bereitgestellt wird |
|-----------------|--------------------------------------|
| Bearer | Bearer-Token-String |
| Header | Vollständige `header key: header value`-Zeile, bereit zur Verwendung in einem cURL `-H`-Argument |
| GitHub | Personal Access Token |
| Notion | Internes `api_token` oder OAuth `access_token` (Bearer-Token für Notion-API-Aufrufe) |
| Sentry | Sentry Auth Token |
| Discord / Slack | Webhook-URL |

Beispiel:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Verwende den Notion-**Knoten** für native Datenbank-, Seiten- und Block-Operationen. Verwende `$credentials`, wenn eine benutzerdefinierte [HTTP](../nodes/http-node.md)-Anfrage dasselbe Notion-Bearer-Token benötigt.

## Anmeldedaten aus dem Chat erstellen

Der [KI-Assistent](./ai-assistant.md#credentials), der [Chat-Reiter](../tabs/chat-tab.md) und [Chat mit Heym](./chat-with-heym.md) können eine Anmeldedaten erstellen, wenn ein Workflow eine benötigt, oder wann immer du danach fragst. Der Assistant schlägt den Typ und einen Namen vor, und das reguläre Anmeldedaten-Formular öffnet sich in der Konversation. Bitte darum, eine Anmeldedaten zu aktualisieren, die dir gehört, und dasselbe Formular öffnet sich dafür, mit maskierten Secrets. Der Assistant sieht nur den Namen und Typ. `heym_chat` über [MCP](../tabs/mcp-tab.md) kann keine Anmeldedaten erstellen, aktualisieren oder auswählen.

## Verwandte Themen

- [Anmeldedaten-Reiter](../tabs/credentials-tab.md) – Anmeldedaten hinzufügen, bearbeiten, löschen
- [GitHub-Knoten](../nodes/github-node.md) – Native GitHub-REST-Operationen
- [Jira-Knoten](../nodes/jira-node.md) – Jira-Projekt-, Issue-, Kommentar-, Anhang-, Benutzer-, Benachrichtigungs- und Transition-Automatisierung
- [Linear-Knoten](../nodes/linear-node.md) – Linear GraphQL Workspace- und Issue-Automatisierung
- [Notion-Knoten](../nodes/notion-node.md) – Notion-Inhalte suchen und verwalten
- [Sentry-Knoten](../nodes/sentry-node.md) – Sentry-Organisations-, Projekt-, Team-, Issue-, Event- und Release-Automatisierung
- [Anmeldedaten teilen](./credentials-sharing.md) – Mit Benutzern und Teams teilen
- [Drittanbieter-Integrationen](./integrations.md) – Einrichtungsanleitung pro Anmeldedaten-Typ
- [Ausdrucks-DSL](./expression-dsl.md) – `$credentials` in Expressions

## Model Router (Auto Model)

Ein Model Router enthält keinen Key. Er enthält eine **Decision-Model-Anmeldedaten**, eine Liste von **Modelloptionen** — jeweils eine bestehende OpenAI-, Google- oder Custom-Anmeldedaten plus ein Modell — und für jede Option einen Freitext, der angibt, wann diese Option verwendet werden soll.

Er erscheint in jedem Picker, der ein Modell anbietet: die [LLM](../nodes/llm-node.md)- und [Agent](../nodes/agent-node.md)-Knoten, Chat, AI Defaults, Dashboards, der Expression-Builder und Datentabellen. Sein einziges Modell ist **Auto**. Wähle es aus, und das Decision-Model liest jede Anfrage und leitet sie weiter. [Evaluierung](../tabs/evals-tab.md) lässt es aus, weil eine Evaluierung bestimmte Modelle vergleicht und ein Router seine eigene Wahl trifft.

Ein Agent leitet neu weiter, während seine Tool-Schleife fortschreitet, sodass ein günstiges Modell die frühen Turns übernehmen kann und ein stärkeres den Turn, der es benötigt. Identische Eingaben verwenden die vorherige Entscheidung erneut, sodass eine Schleife nur dann für eine Entscheidung bezahlt, wenn sich die Konversation tatsächlich bewegt hat.

### Was er nicht kann

Auto Model kann nicht mit der **Responses API**, dem **Batch-Modus** oder der **Bildausgabe** kombiniert werden. Diese Schalter deaktivieren sich selbst, wenn ein Router ausgewählt ist, und jeder gibt an, warum. Guardrail-Prüfungen und der Klassifizierer der Human-Review-Policy sind feste Single-Model-Aufrufe und werden niemals weitergeleitet.

### Wenn das Routing fehlschlägt

Markiere eine Option mit **Diese Option verwenden, wenn das Routing fehlschlägt**, und ein Ausfall des Decision-Models stoppt niemals einen Lauf; der Fallback wird verwendet und der Grund wird am Lauf aufgezeichnet. Ohne einen solchen schlägt der Knoten fehl, anstatt zu raten.

### Sehen, wohin eine Anfrage ging

Traces zeigt `Auto Model / GPT-5` statt nur das Modell, und die Kosten bleiben dem Modell zugeordnet, das tatsächlich ausgeführt wurde. Das Canvas Execution Log und die Span View zeigen dasselbe Paar, und die Span View listet auf, welcher Turn wohin ging.
