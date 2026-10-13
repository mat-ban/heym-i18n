# Drittanbieter-Integrationen

Heym verbindet sich über **Anmeldedaten** mit externen Diensten. Jeder Anmeldedaten-Typ speichert die Verbindungsdetails für einen Dienst und kann über mehrere Knoten und Workflows hinweg wiederverwendet werden. Eine Übersicht findest du unter [Anmeldedaten](./credentials.md).

Füge Anmeldedaten unter [Einstellungen → Anmeldedaten](../tabs/credentials-tab.md) hinzu. Alle Werte werden im Ruhezustand verschlüsselt. Anmeldedaten können mit anderen Benutzern oder [Teams](./teams.md) [geteilt](./credentials-sharing.md) werden.

Einige Integrations-Knoten erfordern **keine** Anmeldedaten. [WebSocket Trigger](../nodes/websocket-trigger-node.md) und [WebSocket Send](../nodes/websocket-send-node.md) verbinden sich mit externen Sockets über die URL, Header und Subprotokolle, die direkt am Knoten konfiguriert werden.

## Anmeldedaten-Typen auf einen Blick

| Typ | Verwendet von | Schlüsselfelder |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, optional `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, optional `base_url` |
| **Jira** | [Jira-Knoten](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, optional `api_version` |
| **Linear** | [Linear-Knoten](../nodes/linear-node.md) | `api_key`, oder `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry-Knoten](../nodes/sentry-node.md) | `api_token`, optional `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluierung](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, optional `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | eine Decision-Model-Anmeldedaten, plus Modelloptionen, die auf deine anderen Anmeldedaten verweisen |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorspeicher | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorspeicher | `openai_api_key` (Vektoren werden in Heyms eigenem Postgres über pgvector gespeichert) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorspeicher | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, optional `embedding_api_key`, plus `qdrant_host`, wenn `db_type` gleich `qdrant` ist |
| **Grist** | [Grist-Knoten](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets-Knoten](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2-Zustimmung |
| **Google Drive** | [Google Drive-Knoten](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2-Zustimmung (vollständiger Drive-Scope) |
| **BigQuery** | [BigQuery-Knoten](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2-Zustimmung |
| **Supabase** | [Supabase-Knoten](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, optional `supabase_schema` |
| **ClickHouse** | [ClickHouse-Knoten](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion-Knoten](../nodes/notion-node.md) | `api_token`, oder `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3-Knoten](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP-Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram-Trigger](../nodes/telegram-trigger-node.md), [Telegram-Knoten](../nodes/telegram-node.md) | `bot_token`, optional `secret_token` |
| **Discord** | [Discord-Knoten](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord-Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ-Knoten](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis-Knoten](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack-Knoten](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack-Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP-Knoten](../nodes/http-node.md) | `token` |
| **Header** | [HTTP-Knoten](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler-Knoten](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Die GitHub-Anmeldedaten speichern ein GitHub Personal Access Token (PAT), damit Workflows die GitHub REST API über den [GitHub-Knoten](../nodes/github-node.md) aufrufen, das Token an MCP-Server wie `@modelcontextprotocol/server-github` übergeben oder es vom [HTTP-Knoten](../nodes/http-node.md) für benutzerdefinierte REST-Aufrufe verwenden können.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `api_key` | GitHub Personal Access Token (`github_pat_...` fein abgestuftes PAT oder klassisches `ghp_...` PAT) |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `base_url` | GitHub API-Basis-URL für GitHub Enterprise Server (zum Beispiel `https://github.example.com/api/v3`) |
### Hinweise

- Feingranulare persönliche Zugriffstoken (fine-grained personal access tokens) werden nach Möglichkeit empfohlen, da du sie auf bestimmte Repositories und Berechtigungen beschränken kannst.
- Lasse `base_url` für GitHub.com leer. Verwende für GitHub Enterprise Server den vollständigen REST API
  Endpoint einschließlich `/api/v3` (zum Beispiel `https://github.example.com/api/v3`), nicht das
  Web-UI-Stammverzeichnis des Servers wie `https://github.example.com`.
- Diese Anmeldedaten modellieren derzeit nur PAT-basierte Authentifizierung. Um auf Organisations-Repositories zuzugreifen, verwende ein PAT, dem die erforderlichen Organisations-/Repository-Berechtigungen gewährt wurden.
- GitHub App-Installationstoken und GitHub App-Setup-Flows sind derzeit in der Heym UI nicht erstklassig unterstützt.
- Bevorzuge den [GitHub-Knoten](../nodes/github-node.md) für native Repository-, Benutzer-, Issue-, Pull-Request-, Review-, Release-, Actions-Workflow-, Traffic- und Dateioperationen. Verwende den [HTTP-Knoten](../nodes/http-node.md) nur, wenn du Endpoints oder Payloads benötigst, die der GitHub-Knoten nicht abdeckt.
- Verwende den [Agent-Knoten](../nodes/agent-node.md) mit MCP, indem du `$credentials.YourGitHubCredential` in eine MCP-Verbindungsumgebungsvariable wie `GITHUB_PERSONAL_ACCESS_TOKEN` übergibst.
- Die GitHub-REST-API erwartet üblicherweise `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Wenn du eine GitHub-Anmeldedaten bearbeitest, bleibt der vorhandene Endpoint erhalten, wenn du die GitHub Enterprise `base_url` leer lässt. Gib nur dann eine neue URL ein, wenn du diesen Endpoint ändern möchtest.

### Verwendet von

- [GitHub-Knoten](../nodes/github-node.md)
- [Codex-Knoten](../nodes/codex-node.md)
- [Agent-Knoten](../nodes/agent-node.md)
- [HTTP-Knoten](../nodes/http-node.md)

---

## Decision Model

Ein Decision Model beantwortet typisierte Fragen zu einem Zustand und gibt Wahrscheinlichkeiten statt Text zurück. TypeSafe's Jev ist die Referenzimplementierung; jeder Endpoint, der denselben `{model, state, questions}`-Body akzeptiert, funktioniert, und der [Decision](../nodes/decision-node.md)-Knoten kann einen handgeschriebenen Body für einen senden, der dies nicht tut.

### Erforderliche Felder

- `base_url` – der Endpoint, zum Beispiel `https://api.typesafe.ai`. Heym hängt `/v1/systemone` an.

### Optionale Felder

- `api_key` – gesendet als `Authorization: Bearer`. Endpoints, die keinen Schlüssel benötigen, können dies leer lassen.

### Hinweise

- **Test Connection** sendet eine winzige Frage, um zu bestätigen, dass der Endpoint und der Schlüssel funktionieren.
- Beim Bearbeiten einer Anmeldedaten bleibt der gespeicherte Schlüssel erhalten, wenn das Schlüsselfeld leer gelassen wird.
- Ausgehende Anfragen an private und Loopback-Adressen sind standardmäßig blockiert, daher benötigt ein selbst gehosteter Endpoint auf `localhost` oder in einem privaten Bereich `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Diese Modelle fehlen in den LLM-Preistabellen, die Heym synchronisiert, daher bleibt die Spalte Cost in [Traces](../tabs/traces-tab.md) leer. Token-Zahlen werden dennoch aufgezeichnet.

### Verwendet von

- [Decision](../nodes/decision-node.md)
- [Evaluierung](../tabs/evals-tab.md) – bewertet `LLM-as-Judge`-Antworten gegen die erwartete Ausgabe

## OpenAI Codex

Die OpenAI Codex-Anmeldedaten authentifizieren den [Codex-Knoten](../nodes/codex-node.md). Sie sind getrennt von den OpenAI API-Schlüssel-Anmeldedaten, die von LLM-, Agent- und RAG-Knoten verwendet werden.

### Authentifizierungsmodi

| Modus | Beschreibung |
|------|-------------|
| **Mit ChatGPT anmelden** (empfohlen) | OAuth (PKCE)-Anmeldung, die dein ChatGPT Plus/Pro-Abonnement verwendet, sodass Ausführungen Kosten pro Token vermeiden. Heym speichert und aktualisiert das Token-Bundle automatisch. |
| **Access token** | Ein ChatGPT/Codex `access_token`, das nur an den lokalen Codex CLI-Prozess übergeben wird. |

### Hinweise

- API-Schlüssel werden für diesen Anmeldedaten-Typ abgelehnt.
- Codex-Token werden nicht über `$credentials.Name` offengelegt.
- Der Codex-Knoten benötigt außerdem GitHub-Anmeldedaten für Repository-Klon, Branch-Push und Draft-PR-Erstellung.

### Verwendet von

- [Codex-Knoten](../nodes/codex-node.md)

## OpenCode Go

Die OpenCode Go-Anmeldedaten authentifizieren den [OpenCode Go-Knoten](../nodes/opencode-go-node.md). Sie speichern einen OpenCode Go Gateway-API-Schlüssel (von [opencode.ai/go](https://opencode.ai/go)) und eine optionale Gateway-Basis-URL.

### Felder

| Feld | Beschreibung |
|-------|-------------|
| **API Key** | OpenCode Go Gateway-API-Schlüssel (erforderlich). |
| **Gateway Base URL** | Optional; standardmäßig `https://opencode.ai/zen/go/v1`. Nur für ein selbst gehostetes oder über einen Proxy laufendes Gateway überschreiben. |

### Hinweise

- Der API-Schlüssel wird nur an den OpenCode CLI-Prozess innerhalb eines gehärteten Containers übergeben.
- Der OpenCode Go-Knoten benötigt außerdem GitHub-Anmeldedaten für Repository-Klon, Branch-Push und Pull-Request-Erstellung. Das GitHub-Token wird niemals in den Sandbox-Container gelegt.

### Verwendet von

- [OpenCode Go-Knoten](../nodes/opencode-go-node.md)

---

## Linear

Die Linear-Anmeldedaten unterstützen entweder einen persönlichen API-Schlüssel oder OAuth2 für den
[Linear-Knoten](../nodes/linear-node.md). Heym sendet native GraphQL-Abfragen an Linear für Workspace-
Metadaten, Projekte, Issues und Kommentare.

### Einrichtung

Wähle einen Authentifizierungsmodus:

**Persönlicher API-Schlüssel**

1. Öffne in Linear **Settings → Security & Access → Personal API keys**.
2. Erstelle einen Schlüssel mit Zugriff auf den Workspace, den du automatisieren möchtest.
3. Füge den Schlüssel in eine Linear-Anmeldedaten in Heym ein und verwende **Test Connection**, um ihn zu überprüfen.

**OAuth2**

1. Erstelle eine Linear OAuth-Anwendung.
2. Registriere `{FRONTEND_URL}/api/credentials/linear/oauth/callback` als Redirect-URI.
3. In Heym Dashboard → **Credentials** → **New** → Typ **Linear**.
4. Wähle **OAuth2**, gib die Client ID und das Client Secret ein und klicke dann auf **Connect**.

### Erforderliche Felder

| Modus | Feld | Beschreibung |
|------|-------|-------------|
| Persönlicher API-Schlüssel | `api_key` | Linear persönlicher API-Schlüssel, üblicherweise mit `lin_api_` präfixiert |
| OAuth2 | `client_id` | Client ID aus der Linear OAuth-Anwendung |
| OAuth2 | `client_secret` | Client Secret aus der Linear OAuth-Anwendung |

OAuth-Token (`access_token`, `refresh_token`, `token_expiry`) werden automatisch gespeichert und aktualisiert.
### Hinweise

- Persönliche API-Schlüssel und OAuth-Token agieren als der Linear-Benutzer, der sie erstellt oder autorisiert hat.
- Linear OAuth verwendet die Scopes `read,write,issues:create,comments:create`.
- Verwende **Verbindung testen** im Anmeldedaten-Dialog, um den API-Schlüssel oder das OAuth-Token gegen die Linear API zu verifizieren.
- Verwende List Teams und List Projects im Linear-Knoten, um UUIDs zu ermitteln, bevor du Issues erstellst oder filterst.
- Verwende List Workflow States und List Team Members, um State- und Assignee-UUIDs für Aktualisierungen zu ermitteln.
- Rotiere einen API-Schlüssel, indem du die Anmeldedaten bearbeitest und den Ersatzwert eingibst. Wenn du OAuth-App-Secrets rotierst, verbinde die Anmeldedaten über **Verbinden** erneut.

### Verwendet von

- [Linear-Knoten](../nodes/linear-node.md)

---

## Jira

Die Jira-Anmeldedaten speichern Jira Basic-Auth-Anmeldedaten, die Jira-Site-Basis-URL, den Deployment-Modus und eine optionale REST-API-Version für den [Jira-Knoten](../nodes/jira-node.md). Verwende `cloud` für Jira Cloud oder `data_center` für Jira Data Center / Server.

### Einrichtung

**Jira Cloud**

1. Erstelle in den Atlassian-Kontoeinstellungen ein API-Token.
2. In Heym Dashboard → **Anmeldedaten** → **Neu** → Typ **Jira**.
3. Gib die Atlassian-E-Mail, das API-Token und die Jira-Site-URL wie `https://your-domain.atlassian.net` ein.
4. Verwende **Verbindung testen**, um die Anmeldedaten zu verifizieren.

**Jira Data Center / Server**

1. Wähle **Jira Data Center / Server** als Deployment.
2. Gib den Jira-Benutzernamen und das Passwort für die Basic-Auth ein.
3. Gib die Jira-Site-URL ein, zum Beispiel `https://jira.example.com`.
4. Verwende **Verbindung testen**, um die Anmeldedaten zu verifizieren.

### Felder

| Feld | Beschreibung |
| --- | --- |
| `email` | Jira Cloud Atlassian-Konto-E-Mail oder Jira Data Center / Server-Benutzername |
| `api_token` | Jira Cloud Atlassian-API-Token oder Jira Data Center / Server-Passwort für Basic-Auth |
| `base_url` | Jira-Site-Basis-URL |
| `deployment` | `cloud` für Jira Cloud oder `data_center` für Jira Data Center / Server |
| `api_version` | REST-API-Version; Standard ist `3` für Jira Cloud. Data Center / Server verwendet v2 |

### Hinweise

- Der Jira-Knoten sendet Issue-Beschreibungen und Kommentare als Atlassian Document Format Text
  Documents für Jira Cloud REST API v3. Data Center / Server-Anmeldedaten senden Klartext.
- Data Center / Server unterstützt derzeit nur Benutzername/Passwort-Basic-Auth. Persönliche Access-
  Token und Bearer-Auth werden noch nicht unterstützt.
- Der Anhang-Upload akzeptiert base64- oder Data-URL-Inhalte und unterliegt dem Dateigrößenlimit der Plattform (Standard 99 MB). Der Anhang-Download kann base64-Inhalte zurückgeben, wenn aktiviert.
- Das Erstellen, Löschen und Benachrichtigen von Benutzern bei Issues erfordert, dass das authentifizierte Jira-Konto die entsprechenden Jira-Site- oder Organisationsberechtigungen besitzt.
- Verwende List Projects, Search Issues und List Transitions, um Projekt-Keys, Issue-Keys und Transition-IDs zu ermitteln.
- Für benutzerdefinierte Endpoints, die nicht vom Jira-Knoten abgedeckt werden, verwende den [HTTP-Knoten](../nodes/http-node.md) mit Jira Basic Auth (`email:api_token` für Cloud oder `username:password` für Data Center / Server) im cURL-Befehl oder eine Header-Anmeldedaten mit dem passenden `Authorization: Basic <base64(user:secret)>`-Wert.

Siehe auch:

- [Jira-Knoten](../nodes/jira-node.md)
- [Anmeldedaten](./credentials.md)

---

## Sentry

Die Sentry-Anmeldedaten speichern ein Auth-Token für den [Sentry-Knoten](../nodes/sentry-node.md). Heym verwendet die REST API von Sentry für Operationen an Organisationen, Projekten, Teams, Issues, Events und Releases.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `api_token` | Sentry-Auth-Token mit Zugriff auf die Organisationen und Projekte, die du automatisierst |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `base_url` | Optionale Root-URL für selbst gehostetes Sentry, zum Beispiel `https://sentry.example.com` |

### Hinweise

- Lasse `base_url` für Sentry SaaS leer.
- Verwende **Verbindung testen**, um zu bestätigen, dass das Token sichtbare Organisationen auflisten kann.
- Für benutzerdefinierte REST-Aufrufe verwende `$credentials.YourSentryCredential` als Bearer-Token.

### Verwendet von

- [Sentry-Knoten](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) ist eine Open-Source-Vektordatenbank, die für semantische Suche und RAG (Retrieval Augmented Generation) verwendet wird.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `qdrant_host` | Vollständige URL zu deiner Qdrant-Instanz (z. B. `http://localhost:6333` oder ein Cloud-Endpoint) |
| `openai_api_key` | OpenAI-API-Schlüssel, der zum Generieren von Embeddings beim Indexieren und Suchen von Dokumenten verwendet wird |

### Hinweise

- Qdrant-Collections werden im Reiter [Vektorspeicher](../tabs/vectorstores-tab.md) verwaltet. Jeder Vektorspeicher wird einer Qdrant-Collection zugeordnet.
- Der [RAG-Knoten](../nodes/rag-node.md) verwendet einen Vektorspeicher (der auf eine Qdrant-Anmeldedaten verweist) — er referenziert die Anmeldedaten nicht direkt.
- Wenn deine Qdrant-Instanz einen API-Schlüssel erfordert, füge ihn in den `qdrant_host`-Wert ein oder konfiguriere Qdrant entsprechend; die aktuelle Integration hat kein separates Qdrant-API-Schlüsselfeld.
- Selbst gehostetes Qdrant: Verwende das [offizielle Docker-Image](https://hub.docker.com/r/qdrant/qdrant) und stelle Port `6333` bereit.

### Verwendet von

- [RAG-Knoten](../nodes/rag-node.md) (über Vektorspeicher)
- [Vektorspeicher-Reiter](../tabs/vectorstores-tab.md)

## Benutzerdefinierte Embeddings (RAG)

Standardmäßig stammen RAG-Embeddings von OpenAI. Eine **RAG: Custom Embeddings**-Anmeldedaten
verweist stattdessen auf einen beliebigen OpenAI-kompatiblen Embeddings-Endpoint — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together oder ein gehostetes Gateway — und benennt den Vektorspeicher,
in den geschrieben wird.
### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `embedding_base_url` | Endpoint-URL einschließlich des Pfads `/v1`, z. B. `http://localhost:11434/v1` |
| `embedding_api_key` | Optional. Lokale Server benötigen normalerweise keinen Schlüssel |
| `embedding_model` | Modellname, wie ihn der Endpoint erwartet, z. B. `nomic-embed-text` |
| `embedding_dimensions` | Vektorbreite, die das Modell zurückgibt (Standard `1536`) |
| `embedding_request_dimensions` | Optional. Den Endpoint auffordern, `embedding_dimensions` statt der nativen Breite des Modells zurückzugeben |
| `db_type` | `qdrant` oder `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant-Verbindung, erforderlich, wenn `db_type` gleich `qdrant` ist |

### Hinweise

- **Qdrant akzeptiert jede Dimensionsanzahl.** Jede Collection wird mit der Breite erstellt, die diese Anmeldedaten deklarieren, sodass das Feld Dimensions frei bearbeitbar ist.
- **Postgres (pgvector) erfordert exakt 1536 Dimensionen.** Seine Spalte ist ein festes
  `vector(1536)`, sodass das Feld Dimensions auf 1536 festgelegt ist und Anmeldedaten, die
  eine andere Breite deklarieren, beim Speichern abgelehnt werden.
- **Verkürzung für pgvector.** Wenn der Speicher Postgres ist, bietet der Dialog *Den
  Endpoint auffordern, 1536 Dimensionen zurückzugeben* an. Dies sendet den Anfrageparameter `dimensions`,
  den Modelle, die mit Matryoshka-Repräsentationen trainiert wurden (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` und ähnliche), beachten, indem sie einen verkürzten,
  weiterhin aussagekräftigen Vektor zurückgeben. Endpoints, die den Parameter nicht unterstützen, lehnen die
  Anfrage ab, und Endpoints, die ihn akzeptieren, aber ignorieren, erzeugen einen klaren Fehler, der die
  tatsächlich zurückgegebene Breite nennt. Heym kürzt Vektoren niemals selbst, da das Abschneiden der
  Ausgabe eines Nicht-Matryoshka-Modells die Retrieval-Qualität stillschweigend verschlechtert. Die Option wird
  für Qdrant nicht angeboten, da dieses eine Collection auf jede beliebige Breite dimensionieren kann.
- Verwenden Sie **Verbindung testen** im Anmeldedaten-Dialog, um eine Testzeichenfolge einzubetten und die
  Breite zu sehen, die das Modell tatsächlich zurückgibt, bevor Sie einen Speicher erstellen.
- Der Anfrageparameter `dimensions` wird nur an OpenAI selbst gesendet, da die meisten
  OpenAI-kompatiblen Server unbekannte Parameter ablehnen. Die native Breite des Modells wird
  stattdessen gegen die Anmeldedaten validiert.
- Die bestehenden Anmeldedaten **RAG: Qdrant + OpenAI** und **RAG: Psql + OpenAI** sind
  unverändert und funktionieren weiterhin.

### Verwendet von

- [RAG-Knoten](../nodes/rag-node.md) (über Vektorspeicher)
- [Reiter „Vektorspeicher“](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym kann Vektoren auch **in seiner eigenen Postgres-Datenbank** speichern, indem es die
[pgvector](https://github.com/pgvector/pgvector)-Erweiterung verwendet — kein externer Vektordienst
erforderlich. Erstellen Sie Anmeldedaten vom Typ **RAG: Psql + OpenAI** und verwenden Sie diese beim Erstellen eines Vektor-
speichers, wählen Sie dann **Postgres (pgvector)** im Dropdown „Database“ des RAG-Knotens.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `openai_api_key` | OpenAI-API-Schlüssel, der zum Generieren von Embeddings beim Indexieren und Durchsuchen von Dokumenten verwendet wird |

### Hinweise

- Es wird kein Host/Port benötigt — Vektoren werden in Heyms eigene Datenbank geschrieben; Heym verbindet sich niemals mit einer anderen Datenbank.
- Jede RAG-Funktion, die mit Qdrant verfügbar ist (Einfügen, Suchen, Metadatenfilter, Cohere-Reranking, Klonen, Teilen), funktioniert mit dem Postgres-Backend identisch.
- Erfordert die Erweiterung `vector`. Heym lässt das offizielle Image `postgres:16` unverändert (sodass vorhandene Daten niemals berührt werden) und **installiert das Paket `postgresql-16-pgvector` beim Start automatisch** — `run.sh`, `deploy.sh` und `run_e2e.sh` handhaben dies alle. Die Installation ist nicht fatal: Wenn sie nicht ausgeführt werden kann (z. B. kein Netzwerk), funktioniert Qdrant RAG weiter und das Postgres-Backend bleibt inaktiv (die Migration überspringt die Tabelle ordnungsgemäß).
- Wenn Sie das veröffentlichte Single-Container-Image (`ghcr.io/heymrun/heym`) gegen **Ihr eigenes externes Postgres** ausführen, muss diese Datenbank die Erweiterung `vector` unterstützen (Heym kann sie nicht in eine Datenbank installieren, die es nicht verwaltet). Ohne sie gibt das Erstellen oder Hochladen in einen Postgres-Vektorspeicher eine klare Meldung zurück und Qdrant RAG funktioniert weiterhin.

### Verwendet von

- [RAG-Knoten](../nodes/rag-node.md) (über Vektorspeicher)
- [Reiter „Vektorspeicher“](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) ist ein Hybrid aus Tabellenkalkulation und Datenbank, der strukturierte Daten und Formeln unterstützt. Die Grist-Anmeldedaten ermöglichen es Heym, Grist-Dokumente zu lesen und zu schreiben.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `api_key` | Grist-API-Schlüssel (zu finden unter **Profile → API Key** in Ihrer Grist-Instanz) |
| `server_url` | Basis-URL Ihres Grist-Servers (z. B. `https://docs.getgrist.com` für Grist Cloud oder Ihre selbst gehostete URL) |

### Hinweise

- Der [Grist-Knoten](../nodes/grist-node.md) erfordert die **Document ID** (aus der URL des Grist-Dokuments) und die **Table ID** in seiner Konfiguration — diese sind nicht Teil der Anmeldedaten.
- Legen Sie für selbst gehostetes Grist `server_url` auf die Domain Ihrer Instanz fest.
- Spalten-IDs in Grist verwenden Unterstriche (z. B. `User_Name`), nicht Anzeigebezeichnungen. Verwenden Sie die Operation `listColumns`, um sie zu ermitteln.

### Verwendet von

- [Grist-Knoten](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Die Google Sheets-Anmeldedaten verbinden Heym über ein OAuth2-„Bring Your Own App“-Modell mit der Google Sheets API. Sie stellen eine Google Cloud OAuth2 Client ID und ein Client Secret bereit und autorisieren dann den Zugriff über ein Browser-Popup. Tokens werden im Hintergrund automatisch aktualisiert.

### Einrichtung

1. Öffnen Sie die [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → suchen Sie nach **Google Sheets API** und aktivieren Sie sie.
2. Gehen Sie zu **Credentials** → **Create Credentials** → **OAuth client ID** → Anwendungstyp **Web application**.
3. Fügen Sie unter **Authorized redirect URIs** hinzu: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopieren Sie die generierte **Client ID** und das **Client Secret**.
5. Im Heym Dashboard → **Credentials** → **New** → Typ **Google Sheets (OAuth2)**.
6. Geben Sie die Client ID, das Client Secret und einen Namen ein und klicken Sie dann auf **Connect**, um das Google-Einwilligungs-Popup zu öffnen und den Zugriff zu autorisieren.
### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `client_id` | OAuth2 Client ID aus der Google Cloud Console |
| `client_secret` | OAuth2 Client Secret aus der Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) werden automatisch gespeichert und erneuert — du verwaltest sie nicht direkt.

### Hinweise

- Der OAuth2-Zustimmungsbildschirm erfordert den Spreadsheets-Scope (`https://www.googleapis.com/auth/spreadsheets`).
- Heym verwendet das Refresh-Token, um neue Access-Tokens zu erhalten, bevor sie ablaufen (60-Sekunden-Sicherheitspuffer).
- Wenn du das Client Secret in der Google Cloud Console rotierst, verbinde die Anmeldedaten über die Schaltfläche **Connect** erneut.
- **Produktion:** Setze das Backend **`FRONTEND_URL`** auf die exakte öffentliche URL, die Benutzer im Browser öffnen (Schema + Host, z. B. `https://heym.example.com`). Heym erstellt die Google OAuth Redirect-URI ausschließlich aus diesem Wert — es vertraut **nicht** auf `Origin`- oder `X-Forwarded-*`-Header (client-kontrolliert). Registriere `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` in der Google Cloud Console.

### Verwendet von

- [Google Sheets-Knoten](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Die Google Drive-Anmeldedaten verbinden Heym über dasselbe OAuth2-"Bring Your Own App"-Modell wie bei Google Sheets mit der Google Drive API. Du gibst eine Google Cloud OAuth2 Client ID und ein Client Secret an und autorisierst dann den Zugriff über ein Browser-Popup. Tokens werden im Hintergrund automatisch erneuert.

### Einrichtung

1. Öffne die [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → suche nach **Google Drive API** und aktiviere sie.
2. Gehe zu **Credentials** → **Create Credentials** → **OAuth client ID** → Anwendungstyp **Web application**.
3. Füge unter **Authorized redirect URIs** hinzu: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopiere die generierte **Client ID** und das **Client Secret**.
5. Im Heym Dashboard → **Credentials** → **New** → Typ **Google Drive (OAuth2)**.
6. Gib die Client ID, das Client Secret und einen Namen ein und klicke dann auf **Connect**, um das Google-Zustimmungs-Popup zu öffnen und den Zugriff zu autorisieren.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `client_id` | OAuth2 Client ID aus der Google Cloud Console |
| `client_secret` | OAuth2 Client Secret aus der Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) werden automatisch gespeichert und erneuert — du verwaltest sie nicht direkt.

### Scope

Google Drive fordert den **vollständigen Drive-Scope** an (`https://www.googleapis.com/auth/drive`).

Dies ist erforderlich, weil der Knoten auf Dateien arbeitet, die dir bereits gehören. Der engere `drive.file`-Scope gewährt nur Zugriff auf Dateien, die der OAuth-Client selbst erstellt hat, wodurch `listFolderFiles`, `updateFile`, `removeFile` und `removeFolder` nichts von deinem bestehenden Drive sehen würden.

Da du deine eigene Client ID und dein eigenes Client Secret aus deinem eigenen Google Cloud-Projekt bereitstellst, gelten die Google-App-Verifizierungsanforderungen für diesen Scope für dein Projekt, nicht für Heym.

### Hinweise

- Heym verwendet das Refresh-Token, um neue Access-Tokens zu erhalten, bevor sie ablaufen (60-Sekunden-Sicherheitspuffer).
- Wenn du das Client Secret in der Google Cloud Console rotierst, verbinde die Anmeldedaten über die Schaltfläche **Connect** erneut.
- Geteilte Laufwerke werden unterstützt — der Knoten setzt `supportsAllDrives` bei jedem API-Aufruf.
- **Produktion:** Setze das Backend **`FRONTEND_URL`** auf die exakte öffentliche URL, die Benutzer im Browser öffnen. Heym erstellt die Google OAuth Redirect-URI ausschließlich aus diesem Wert — es vertraut **nicht** auf `Origin`- oder `X-Forwarded-*`-Header. Registriere `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` in der Google Cloud Console.
- Siehe [Credential Sharing](./credentials-sharing.md), bevor du diese Anmeldedaten mit einem Team teilst.

### Verwendet von

- [Google Drive-Knoten](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

Die BigQuery-Anmeldedaten verbinden Heym über ein OAuth2-"Bring Your Own App"-Modell mit der Google BigQuery API. Du gibst eine Google Cloud OAuth2 Client ID und ein Client Secret an und autorisierst dann den Zugriff über ein Browser-Popup. Tokens werden im Hintergrund automatisch erneuert.

### Einrichtung

1. Öffne die [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → suche nach **BigQuery API** und aktiviere sie.
2. Gehe zu **Credentials** → **Create Credentials** → **OAuth client ID** → Anwendungstyp **Web application**.
3. Füge unter **Authorized redirect URIs** hinzu: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopiere die generierte **Client ID** und das **Client Secret**.
5. Im Heym Dashboard → **Credentials** → **New** → Typ **BigQuery (OAuth2)**.
6. Gib die Client ID, das Client Secret und einen Namen ein und klicke dann auf **Connect**, um das Google-Zustimmungs-Popup zu öffnen und den Zugriff zu autorisieren.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `client_id` | OAuth2 Client ID aus der Google Cloud Console |
| `client_secret` | OAuth2 Client Secret aus der Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) werden automatisch gespeichert und erneuert.

### Hinweise

- Der OAuth2-Zustimmungsbildschirm erfordert den BigQuery-Scope (`https://www.googleapis.com/auth/bigquery`).
- **Produktion:** Setze das Backend **`FRONTEND_URL`** auf die öffentliche URL. Registriere `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` in der Google Cloud Console.

### Verwendet von

- [BigQuery-Knoten](../nodes/bigquery-node.md)

---

## Supabase

Die Supabase-Anmeldedaten verbinden Heym mit der PostgREST API eines Supabase-Projekts, sodass Workflows Postgres-gestützte Tabellen abfragen und verändern können.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `supabase_url` | Basis-URL des Projekts, zum Beispiel `https://your-project.supabase.co` |
| `supabase_key` | API-Schlüssel mit Zugriff auf die Zieltabellen |
| `supabase_schema` | Optionales Standard-Schema (Standard ist `public`) |
### Hinweise

- Der [Supabase-Knoten](../nodes/supabase-node.md) kommuniziert mit `/rest/v1/<table>` und unterstützt Operator-Filter (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` und verwandte PostgREST-Operatoren) sowie verschachtelte logische `or` / `and`-Gruppen.
- Für Schreiboperationen bevorzuge einen Schlüssel, der für die vertrauenswürdige serverseitige Nutzung mit den minimal erforderlichen Tabellenberechtigungen vorgesehen ist.
- Knoten können das Schema pro Schritt überschreiben, selbst wenn die Anmeldedaten ein Standard-Schema definieren.

### Verwendet von

- [Supabase-Knoten](../nodes/supabase-node.md)

## ClickHouse

Die ClickHouse-Anmeldedaten verbinden Heym über dessen HTTP-Schnittstelle mit einer externen ClickHouse-Datenbank, sodass Workflows SQL-, CRUD- und Zähloperationen gegen OLAP-Tabellen ausführen können.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `host` | HTTP-Host ohne Schema, zum Beispiel `your-instance.clickhouse.cloud` |
| `port` | Port der HTTP-Schnittstelle (`8443` für HTTPS, `8123` für HTTP) |
| `username` | ClickHouse-Benutzer (Standard ist `default`) |
| `password` | Benutzerpasswort (optional) |
| `database` | Zieldatenbank (Standard ist `default`) |
| `secure` | HTTPS verwenden, wenn `true` (erforderlich für ClickHouse Cloud) |

### Hinweise

- Der [ClickHouse-Knoten](../nodes/clickhouse-node.md) verwendet den offiziellen `clickhouse-connect` HTTP-Client und parametrisiert Filter- und Wert-Bindings.
- `update` und `remove` werden auf `ALTER TABLE ... UPDATE` und `DELETE FROM` abgebildet, bei denen es sich um asynchrone ClickHouse-Mutationen handelt; beide erfordern einen Filter.
- `upsert` führt ein `INSERT` aus und setzt eine `ReplacingMergeTree`-Tabelle für das Merge-on-Key-Verhalten voraus.
- Verwende **Test connection** im Anmeldedaten-Dialog, um die Erreichbarkeit zu überprüfen.

### Verwendet von

- [ClickHouse-Knoten](../nodes/clickhouse-node.md)

## Notion

Die Notion-Anmeldedaten unterstützen entweder ein internes Integrationstoken oder eine OAuth-Verbindung
einer öffentlichen Integration. OAuth ermöglicht es jedem Benutzer, einen Notion-Workspace von Heym aus
zu autorisieren, anstatt manuell ein Token zu kopieren.

### Erforderliche Felder

| Modus | Feld | Beschreibung |
|------|-------|-------------|
| Internes Token | `api_token` | Internes Integrationstoken (`ntn_...`) |
| OAuth | `client_id` | Client-ID aus einer öffentlichen Notion-Integration |
| OAuth | `client_secret` | Client Secret aus der öffentlichen Notion-Integration |

Der OAuth-Callback speichert `access_token`, `auth_mode`, `workspace_id`, `workspace_name` und `bot_id`
automatisch. Ein zuvor vorhandenes internes `api_token` wird entfernt, wenn OAuth abgeschlossen wird. Registriere diese
Redirect-URI in Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth-Einrichtungsablauf

1. Wähle **OAuth** im Anmeldedaten-Dialog, gib einen Namen, eine Client-ID und ein Client Secret ein.
2. Klicke auf **Connect** und autorisiere den Workspace im Notion-Popup.
   - Für neue Anmeldedaten erstellt Heym den Anmeldedaten-Datensatz, wenn du auf **Connect** klickst.
   - Schließe die Autorisierung im Popup ab und klicke dann auf **Save**, um zur Anmeldedaten-Liste zurückzukehren.
3. Verbundene Anmeldedaten zeigen `connected (Workspace Name)` in der Liste an. Ausstehende OAuth-
   Anmeldedaten zeigen `Not connected`, bis die Autorisierung abgeschlossen ist.

Verwende **Test Connection** im Anmeldedaten-Dialog, um entweder ein internes Token oder eine abgeschlossene
OAuth-Autorisierung zu überprüfen. Beim Bearbeiten bleibt das gespeicherte interne Token erhalten, wenn das Token-Feld leer gelassen wird.

Sowohl interne Tokens als auch OAuth-Zugriffstokens sind über
`$credentials.CredentialName` für benutzerdefinierte [HTTP](../nodes/http-node.md)-Aufrufe verfügbar, die ein Notion-
Bearer-Token benötigen.

### Hinweise

- Interne Integrationen erfordern, dass die relevanten Seiten, Datenbanken und Datenquellen freigegeben werden.
- OAuth-Benutzer wählen den Workspace/die Seiten während der Notion-Autorisierung aus.
- OAuth-Anwendungsanmeldedaten werden innerhalb der Notion-Anmeldedaten verschlüsselt. Der Callback lädt
  sie serverseitig neu; das Secret ist nicht im OAuth-State eingebettet.
- Verbundene OAuth-Anmeldedaten zeigen den Workspace-Namen an; ausstehende OAuth-Anmeldedaten zeigen
  `Not connected`, bis die Autorisierung abgeschlossen ist.
- **Produktion:** Setze das Backend **`FRONTEND_URL`** auf die öffentliche Browser-URL (Schema + Host, ohne
  abschließenden Schrägstrich). Die Notion-Redirect-URI muss exakt übereinstimmen:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Der Knoten verwendet die API-Version `2026-03-11` und die aktuelle `data_source`-Terminologie. Siehe den
  [Notion-Knoten](../nodes/notion-node.md#api-version-notes)-Artikel für Migrationshinweise von
  älteren `archived`-, `after`- oder Datenbankabfrage-Beispielen.
- Alte Suchfilter mit dem Objektwert `database` werden zu `data_source` normalisiert.

### Verwendet von

- [Notion-Knoten](../nodes/notion-node.md)

---

## SMTP (E-Mail)

Die SMTP-Anmeldedaten speichern Verbindungsdetails zum E-Mail-Server für das Senden ausgehender E-Mails.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `host` | SMTP-Server-Hostname (z. B. `smtp.gmail.com`) |
| `port` | SMTP-Port (typischerweise `587` für STARTTLS, `465` für SSL) |
| `email` | Benutzername, mit dem sich der SMTP-Server anmeldet; zugleich der sichtbare Absender, wenn `from` leer ist |
| `password` | SMTP-Passwort oder App-Passwort |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `from` (`smtp_from`) | Sichtbare Absenderadresse (From). Leer lassen, um als `email` zu senden. Der Server meldet sich weiterhin als `email` an, sodass dieses Konto berechtigt sein muss, unter dieser Adresse zu senden (in Gmail ein bestätigter **Senden als**-Alias). |

### Häufige SMTP-Anbieter

| Anbieter | Host | Port | Hinweise |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Erfordert ein [App-Passwort](https://support.google.com/accounts/answer/185833) (2FA muss aktiviert sein) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Verwende deine Microsoft-Konto-Anmeldedaten |
| Mailgun | `smtp.mailgun.org` | `587` | Verwende die Mailgun-SMTP-Anmeldedaten aus deinen Domain-Einstellungen |
| SendGrid | `smtp.sendgrid.net` | `587` | Verwende `apikey` als Benutzername und einen API-Schlüssel als Passwort |
| Benutzerdefiniert / Selbst gehostet | deine Domain | `587` / `465` | Postfix, Exim usw. |

### Hinweise

- Gmail erfordert ein **App-Passwort** anstelle deines regulären Passworts, wenn die Bestätigung in zwei Schritten aktiviert ist.
- Port `587` verwendet STARTTLS (beginnt im Klartext, wird auf TLS hochgestuft). Port `465` verwendet implizites TLS (SSL von Anfang an).

### Verwendet von

- [Send Email-Knoten](../nodes/send-email-node.md)

---

## IMAP (Eingehende E-Mail)

Die IMAP-Anmeldedaten speichern Verbindungsdetails zum Überwachen eines Posteingangs mit dem [IMAP Trigger-Knoten](../nodes/imap-trigger-node.md).
### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `imap_host` | IMAP-Server-Hostname (zum Beispiel `imap.gmail.com`) |
| `imap_port` | IMAP-Port (`993` für SSL/TLS bei den meisten Anbietern) |
| `imap_username` | Postfach-Benutzername oder vollständige E-Mail-Adresse |
| `imap_password` | Passwort oder anbieterspezifisches App-Passwort |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `imap_mailbox` | Zu überwachender Postfachordner (Standard: `INBOX`) |
| `imap_use_ssl` | SSL/TLS aktivieren (empfohlen; Standard: `true`) |

### Hinweise

- Der IMAP-Trigger legt beim ersten Polling den aktuellen Stand des Postfachs als Basis fest und verarbeitet danach nur neuere E-Mails.
- Gmail, Microsoft 365 und andere gehostete Anbieter erfordern häufig ein **App-Passwort** oder ein ähnliches IMAP-spezifisches Secret.
- Anhangsinhalte werden nicht in die Workflow-Payload heruntergeladen; Heym stellt nur Anhangs-Metadaten bereit.

### Verwendet von

- [IMAP Trigger-Knoten](../nodes/imap-trigger-node.md)
- [Trigger](./triggers.md) (IMAP als Workflow-Trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) ist ein Open-Source-Message-Broker. Die RabbitMQ-Anmeldedaten speichern Verbindungsdetails zum Veröffentlichen in und Konsumieren aus Queues und Exchanges.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `rabbitmq_host` | AMQP-Verbindungs-URL (z. B. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-Benutzername (Standard: `guest`) |
| `rabbitmq_password` | RabbitMQ-Passwort (Standard: `guest`) |

### Virtuelle Hosts

Um eine Verbindung zu einem bestimmten virtuellen Host herzustellen, füge ihn in die `rabbitmq_host`-URL ein:

```
amqp://username:password@hostname:5672/vhost
```

Bei Verwendung des Standard-vhost kann der Pfad `/` weggelassen werden.

### Plugin für verzögerte Nachrichten

Der [RabbitMQ-Knoten](../nodes/rabbitmq-node.md) unterstützt das Plugin **rabbitmq_delayed_message_exchange**. Wenn dieses Plugin auf deinem RabbitMQ-Server aktiviert ist, kannst du eine Verzögerung (in Millisekunden) für ausgehende Nachrichten über das Feld `rabbitmqDelayMs` am Knoten festlegen.

Der Knoten setzt den Header `x-delay` auf der veröffentlichten Nachricht. Der Exchange-Typ muss `x-delayed-message` sein, damit Verzögerungen wirksam werden.

Um das Plugin auf einer selbst gehosteten RabbitMQ-Instanz zu aktivieren:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Wenn das Plugin nicht installiert ist, wird der Header `x-delay` ignoriert und Nachrichten werden sofort zugestellt.

### Verwendet von

- [RabbitMQ-Knoten](../nodes/rabbitmq-node.md)
- [Trigger](./triggers.md) (RabbitMQ als Workflow-Trigger)

---

## Amazon S3

Die Amazon S3-Anmeldedaten verbinden Heym mit [Amazon S3](https://aws.amazon.com/s3/). Verwende sie mit dem [Amazon S3-Knoten](../nodes/amazon-s3-node.md), um Buckets und Ordner zu verwalten, Objekte hoch- und herunterzuladen, Keys zu kopieren sowie Objekte aus Workflows aufzulisten oder zu löschen.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `aws_access_key_id` | AWS IAM Access Key ID |
| `aws_secret_access_key` | Secret Access Key, der mit der Access Key ID kombiniert wird |
| `aws_region` | AWS-Region, in der sich die Buckets befinden (z. B. `us-east-1`) |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `aws_session_token` | Temporäres Session-Token bei Verwendung von AWS STS-Anmeldedaten |

### Hinweise

- Die Anmeldedaten verwenden die standardmäßige AWS SigV4-Authentifizierung über boto3.
- Upload-Vorgänge senden derzeit UTF-8-Textinhalte; Downloads können Text oder base64 für binäre Objekte zurückgeben.

### Verwendet von

- [Amazon S3-Knoten](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) ist ein In-Memory-Key-Value-Speicher, der für Caching und schnellen Datenzugriff verwendet wird.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `host` | Redis-Server-Hostname oder IP (z. B. `localhost`) |
| `port` | Redis-Port (Standard: `6379`) |
| `password` | Redis-Passwort (leer lassen, wenn nicht gesetzt) |

### Verwendet von

- [Redis-Knoten](../nodes/redis-node.md)

---

## Slack

Die Slack-Anmeldedaten speichern eine **Incoming Webhook URL** zum Posten von Nachrichten in Slack-Kanäle.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (aus deiner Slack-App-Konfiguration) |

### Hinweise

- Erstelle einen Incoming Webhook unter [api.slack.com/apps](https://api.slack.com/apps) → deine App → **Incoming Webhooks**.
- Jeder Webhook ist auf einen bestimmten Kanal beschränkt. Erstelle mehrere Anmeldedaten für verschiedene Kanäle.

### Verwendet von

- [Slack-Knoten](../nodes/slack-node.md)

---

## Telegram

Die Telegram-Anmeldedaten speichern ein **Bot Token** und ein optionales **Webhook Secret Token** für botbasierte Workflows.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `bot_token` | Telegram Bot API-Token von BotFather |

### Optionale Felder

| Feld | Beschreibung |
|-------|-------------|
| `secret_token` | Gemeinsames Secret, das bei eingehenden Webhooks gegen `x-telegram-bot-api-secret-token` verifiziert wird |

### Hinweise

- Verwende dieselben Anmeldedaten sowohl für den [Telegram Trigger](../nodes/telegram-trigger-node.md) als auch für [Telegram](../nodes/telegram-node.md).
- Registriere den Webhook manuell über die `setWebhook`-API von Telegram unter Verwendung der URL, die im Panel des Telegram Trigger-Knotens angezeigt wird.
- `chatId` im Telegram-Knoten kann eine wörtliche ID oder ein Ausdruck wie `$telegramEvent.message.chat.id` sein.

### Verwendet von

- [Telegram Trigger-Knoten](../nodes/telegram-trigger-node.md)
- [Telegram-Knoten](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Diese Anmeldedaten werden vom [HTTP-Knoten](../nodes/http-node.md) verwendet, um ausgehende Anfragen zu authentifizieren.

### Bearer

Fügt HTTP-Anfragen einen Header `Authorization: Bearer <token>` hinzu.

| Feld | Beschreibung |
|-------|-------------|
| `token` | Der Wert des Bearer-Tokens |

### Header

Fügt HTTP-Anfragen einen benutzerdefinierten Header hinzu.

| Feld | Beschreibung |
|-------|-------------|
| `header_key` | Header-Name (z. B. `X-Api-Key`) |
| `header_value` | Header-Wert |

Beide Typen können auch über `$credentials.CredentialName` in der [Ausdrucks-DSL](./expression-dsl.md) referenziert werden, um sie dynamisch in jedem Knoten zu verwenden, der Ausdrücke akzeptiert.

### Verwendet von

- [HTTP-Knoten](../nodes/http-node.md)

---
## LLM-Anbieter (OpenAI, Google, Custom, Cohere)

Diese Anmeldedaten versorgen AI-Knoten.

| Typ | Beschreibung |
|------|-------------|
| **OpenAI** | API-Schlüssel für GPT-Modelle und OpenAI-Embeddings |
| **Google** | API-Schlüssel für Gemini-Modelle |
| **Custom** | API-Schlüssel + Basis-URL für OpenAI-kompatible Endpoints (Ollama, vLLM, LM Studio usw.) |
| **Cohere** | API-Schlüssel für Cohere-Embeddings |

### OpenAI Prompt-Caching

OpenAI speichert das statische (unveränderliche) Präfix deines System-Prompts automatisch zwischen — keine zusätzliche Konfiguration erforderlich. Wiederholte Workflow-Ausführungen, die dasselbe System-Prompt-Präfix teilen, profitieren vom Preis für zwischengespeicherte Token, was sowohl Kosten als auch Latenz reduziert. Dies ist besonders nützlich, wenn du lange, feste Anweisungen hast und sich zwischen den Ausführungen nur die Benutzernachricht ändert. Überwache Cache-Trefferraten und Token-Einsparungen im [Reiter „Ausführungen“](../tabs/traces-tab.md) oder im OpenAI-Nutzungsdashboard, um deine Prompt-Struktur für maximale Cache-Wiederverwendung zu optimieren.

### Verwendet von

- [LLM-Knoten](../nodes/llm-node.md)
- [Agent-Knoten](../nodes/agent-node.md)
- [RAG-Knoten](../nodes/rag-node.md) (OpenAI-Embeddings über Qdrant-Anmeldedaten)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) ist ein Proxy-Server zum Umgehen von Cloudflare- und ähnlichen Bot-Schutz-Herausforderungen.

### Erforderliche Felder

| Feld | Beschreibung |
|-------|-------------|
| `flaresolverr_url` | URL deiner FlareSolverr-Instanz (z. B. `http://localhost:8191`) |

Loopback- und private Adressen werden hier unterstützt, sodass der Betrieb von FlareSolverr neben Heym wie dokumentiert funktioniert. Die URL darf nicht zu einer Link-Local- oder Cloud-Metadata-Adresse auflösen. Da private Adressen erlaubt sind, kann dieses Feld auch auf einen anderen internen Dienst zeigen, und die Antwort kommt in der Ausgabe des Knotens zurück. Jeder angemeldete Benutzer kann diese Anmeldedaten erstellen, daher liegt die Grenze bei dem, wer Workflows erstellen darf, plus deinen Netzwerkregeln, nicht beim Teilen von Anmeldedaten. Siehe [Egress-Sicherheit](../nodes/crawler-node.md#egress-safety).

### Verwendet von

- [Crawler-Knoten](../nodes/crawler-node.md)

---

## Verwandtes

- [Anmeldedaten](./credentials.md) – Überblick über Anmeldedaten und wie Knoten sie verwenden
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – Anmeldedaten hinzufügen und verwalten
- [Anmeldedaten teilen](./credentials-sharing.md) – Anmeldedaten mit Benutzern und Teams teilen
- [Sicherheit](./security.md) – Verschlüsselung im Ruhezustand, Zugriffskontrolle
- [Ausdrucks-DSL](./expression-dsl.md) – `$credentials`-Syntax für dynamischen Zugriff

---

## Model Router (Auto Model)

Leitet jede Anfrage an eine deiner vorhandenen Modell-Anmeldedaten weiter und verwendet dabei ein Entscheidungsmodell, um auszuwählen. Es speichert Referenzen, niemals einen eigenen Schlüssel.

### Erforderliche Felder

- `decision_credential_id` – eine **Decision Model**-Anmeldedaten, auf die du zugreifen kannst.
- `decision_model` – das Modell, das den Routing-Aufruf durchführt, zum Beispiel `jev-latest`.
- `options` – mindestens zwei Einträge, jeder mit einem Namen, einer deiner OpenAI/Google/Custom-Anmeldedaten, einem Modell darauf und Kriterien, die angeben, wann er gewinnen soll.

### Optionale Felder

- `routing_instructions` – wie die Optionen insgesamt gewichtet werden sollen.
- Eine Option kann als Fallback markiert werden, der verwendet wird, wenn das Routing fehlschlägt.

### Hinweise

Optionsnamen sind das, worunter das Entscheidungsmodell auswählt, daher müssen sie eindeutig sein. Eine Option kann nicht auf einen anderen Model Router zeigen.
