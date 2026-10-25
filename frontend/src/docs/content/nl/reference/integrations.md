# Integraties van Derden

Heym maakt verbinding met externe services via **referenties**. Elk referentietype slaat de verbindingsgegevens voor één service op en kan worden hergebruikt in meerdere nodes en workflows. Zie [Referenties](./credentials.md) voor een overzicht.

Voeg referenties toe in [Instellingen → Referenties](../tabs/credentials-tab.md). Alle waarden worden versleuteld opgeslagen. Referenties kunnen worden [gedeeld](./credentials-sharing.md) met andere gebruikers of [Teams](./teams.md).

Sommige integratienodes vereisen **geen** referenties. [WebSocket Trigger](../nodes/websocket-trigger-node.md) en [WebSocket Send](../nodes/websocket-send-node.md) maken verbinding met externe sockets via de URL, headers en subprotocols die direct op de node zijn geconfigureerd.

## Referentietypen in één oogopslag

| Type | Gebruikt door | Belangrijkste velden |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, optioneel `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, optioneel `base_url` |
| **Jira** | [Jira-node](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (alleen Basic-auth), optioneel `api_version` |
| **Linear** | [Linear-node](../nodes/linear-node.md) | `api_key`, of `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry-node](../nodes/sentry-node.md) | `api_token`, optioneel `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluatie](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, optioneel `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI-standaardwaarden | een decision model-referentie, plus modelopties die verwijzen naar uw andere referenties |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vectors opgeslagen in Heym's eigen Postgres via pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, optioneel `embedding_api_key`, plus `qdrant_host` wanneer `db_type` gelijk is aan `qdrant` |
| **Grist** | [Grist-node](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets-node](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2-toestemming |
| **Google Drive** | [Google Drive-node](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2-toestemming (volledige Drive-scope) |
| **BigQuery** | [BigQuery-node](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2-toestemming |
| **Supabase** | [Supabase-node](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, optioneel `supabase_schema` |
| **ClickHouse** | [ClickHouse-node](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion-node](../nodes/notion-node.md) | `api_token`, of `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3-node](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger-node](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger-node](../nodes/telegram-trigger-node.md), [Telegram-node](../nodes/telegram-node.md) | `bot_token`, optioneel `secret_token` |
| **Discord** | [Discord-node](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger-node](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ-node](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis-node](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack-node](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger-node](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP-node](../nodes/http-node.md) | `token` |
| **Header** | [HTTP-node](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler-node](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

De GitHub-referentie slaat een GitHub personal access token (PAT) op, zodat workflows de GitHub REST API kunnen aanroepen via de [GitHub-node](../nodes/github-node.md), het token kunnen doorgeven aan MCP-servers zoals `@modelcontextprotocol/server-github`, of het kunnen gebruiken vanuit de [HTTP-node](../nodes/http-node.md) voor aangepaste REST-aanroepen.

### Vereiste velden

| Veld | Beschrijving |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` fine-grained PAT of klassieke `ghp_...` PAT) |
### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `base_url` | GitHub API base URL voor GitHub Enterprise Server (bijvoorbeeld `https://github.example.com/api/v3`) |

### Opmerkingen

- Fijnmazige personal access tokens verdienen de voorkeur wanneer mogelijk, omdat u deze kunt beperken tot specifieke repositories en machtigingen.
- Laat `base_url` leeg voor GitHub.com. Gebruik voor GitHub Enterprise Server het volledige REST API-
  endpoint inclusief `/api/v3` (bijvoorbeeld `https://github.example.com/api/v3`), niet de
  web UI-root van de server zoals `https://github.example.com`.
- Deze referentie ondersteunt momenteel alleen PAT-gebaseerde authenticatie. Gebruik voor toegang tot organisatie-repositories een PAT waaraan de vereiste organisatie-/repositorymachtigingen zijn toegekend.
- GitHub App-installatietokens en GitHub App-setupflows zijn vandaag de dag geen eersteklas burgers in de Heym UI.
- Geef de voorkeur aan de [GitHub-node](../nodes/github-node.md) voor native repository-, gebruiker-, issue-, pull request-, review-, release-, Actions workflow-, traffic- en bestandsbewerkingen. Gebruik de [HTTP-node](../nodes/http-node.md) alleen wanneer u endpoints of payloads nodig hebt die de GitHub-node niet dekt.
- Gebruik de [Agent-node](../nodes/agent-node.md) met MCP door `$credentials.YourGitHubCredential` door te geven aan een MCP-verbindingsomgevingsvariabele zoals `GITHUB_PERSONAL_ACCESS_TOKEN`.
- De REST API van GitHub verwacht doorgaans `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Bij het bewerken van een GitHub-referentie blijft het bestaande endpoint behouden wanneer het GitHub Enterprise-veld `base_url` leeg wordt gelaten. Voer alleen een nieuwe URL in wanneer u dat endpoint wilt wijzigen.

### Gebruikt door

- [GitHub-node](../nodes/github-node.md)
- [Codex-node](../nodes/codex-node.md)
- [Agent-node](../nodes/agent-node.md)
- [HTTP-node](../nodes/http-node.md)

---

## Decision Model

Een decision model beantwoordt getypeerde vragen over een toestand en retourneert waarschijnlijkheden in plaats van tekst. TypeSafe's Jev is de referentie-implementatie; elk endpoint dat dezelfde `{model, state, questions}`-body accepteert werkt, en de [Decision](../nodes/decision-node.md)-node kan een handgeschreven body verzenden voor een endpoint dat dit niet doet.

### Verplichte velden

- `base_url` – het endpoint, bijvoorbeeld `https://api.typesafe.ai`. Heym voegt `/v1/systemone` toe.

### Optionele velden

- `api_key` – verzonden als `Authorization: Bearer`. Endpoints die geen sleutel nodig hebben kunnen dit leeg laten.

### Opmerkingen

- **Test Connection** verzendt één kleine vraag om te bevestigen dat het endpoint en de sleutel werken.
- Bij het bewerken van een referentie blijft de opgeslagen sleutel behouden wanneer het sleutelveld leeg wordt gelaten.
- Uitgaande verzoeken naar privé- en loopback-adressen zijn standaard geblokkeerd, dus een zelf-gehost endpoint op `localhost` of een privébereik vereist `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Deze modellen ontbreken in de LLM-prijstabellen die Heym synchroniseert, dus de kolom Kosten in [Traces](../tabs/traces-tab.md) blijft leeg. Token-tellingen worden nog steeds geregistreerd.

### Gebruikt door

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – beoordeelt `LLM-as-Judge`-antwoorden tegen de verwachte uitvoer

## OpenAI Codex

De OpenAI Codex-referentie authenticeert de [Codex-node](../nodes/codex-node.md). Deze staat los van de OpenAI API-sleutelreferentie die wordt gebruikt door LLM-, Agent- en RAG-nodes.

### Authenticatiemodi

| Modus | Beschrijving |
|------|-------------|
| **Aanmelden met ChatGPT** (aanbevolen) | OAuth (PKCE)-aanmelding die uw ChatGPT Plus/Pro-abonnement gebruikt, zodat uitvoeringen kosten per token voor de API vermijden. Heym slaat het token-bundel op en vernieuwt dit automatisch. |
| **Access token** | Een ChatGPT/Codex `access_token` die alleen aan het lokale Codex CLI-proces wordt doorgegeven. |

### Opmerkingen

- API-sleutels worden geweigerd voor dit referentietype.
- Codex-tokens worden niet blootgesteld via `$credentials.Name`.
- De Codex-node heeft ook een GitHub-referentie nodig voor het klonen van repositories, het pushen van branches en het aanmaken van concept-PR's.

### Gebruikt door

- [Codex-node](../nodes/codex-node.md)

## OpenCode Go

De OpenCode Go-referentie authenticeert de [OpenCode Go-node](../nodes/opencode-go-node.md). Deze slaat een OpenCode Go gateway API-sleutel op (van [opencode.ai/go](https://opencode.ai/go)) en een optionele gateway base URL.

### Velden

| Veld | Beschrijving |
|-------|-------------|
| **API Key** | OpenCode Go gateway API-sleutel (verplicht). |
| **Gateway Base URL** | Optioneel; standaard `https://opencode.ai/zen/go/v1`. Alleen overschrijven voor een zelf-gehoste of via proxy geleverde gateway. |

### Opmerkingen

- De API-sleutel wordt alleen doorgegeven aan het OpenCode CLI-proces binnen een gehardende container.
- De OpenCode Go-node heeft ook een GitHub-referentie nodig voor het klonen van repositories, het pushen van branches en het aanmaken van pull requests. Het GitHub-token wordt nooit in de sandbox-container geplaatst.

### Gebruikt door

- [OpenCode Go-node](../nodes/opencode-go-node.md)

---

## Linear

De Linear-referentie ondersteunt ofwel een persoonlijke API-sleutel ofwel OAuth2 voor de
[Linear-node](../nodes/linear-node.md). Heym verzendt native GraphQL-query's naar Linear voor workspace-
metadata, projecten, issues en opmerkingen.
### Configuratie

Kies een authenticatiemodus:

**Persoonlijke API-sleutel**

1. Open in Linear **Settings → Security & Access → Personal API keys**.
2. Maak een sleutel aan met toegang tot de workspace die u wilt automatiseren.
3. Plak de sleutel in een Linear-referentie in Heym en gebruik **Test Connection** om deze te verifiëren.

**OAuth2**

1. Maak een Linear OAuth-applicatie aan.
2. Registreer `{FRONTEND_URL}/api/credentials/linear/oauth/callback` als de redirect-URI.
3. Ga in het Heym Dashboard naar **Credentials** → **New** → type **Linear**.
4. Kies **OAuth2**, voer de Client ID en Client Secret in en klik op **Connect**.

### Verplichte velden

| Modus | Veld | Beschrijving |
|------|-------|-------------|
| Persoonlijke API-sleutel | `api_key` | Linear persoonlijke API-sleutel, doorgaans met het voorvoegsel `lin_api_` |
| OAuth2 | `client_id` | Client ID van de Linear OAuth-applicatie |
| OAuth2 | `client_secret` | Client Secret van de Linear OAuth-applicatie |

OAuth-tokens (`access_token`, `refresh_token`, `token_expiry`) worden automatisch opgeslagen en vernieuwd.

### Opmerkingen

- Persoonlijke API-sleutels en OAuth-tokens handelen als de Linear-gebruiker die ze heeft aangemaakt of geautoriseerd.
- Linear OAuth gebruikt de scopes `read,write,issues:create,comments:create`.
- Gebruik **Test Connection** in het referentiedialoogvenster om de API-sleutel of het OAuth-token te verifiëren tegen de Linear API.
- Gebruik List Teams en List Projects in de Linear-node om UUID's te achterhalen voordat u issues aanmaakt of filtert.
- Gebruik List Workflow States en List Team Members om state- en assignee-UUID's te achterhalen voor updates.
- Roteer een API-sleutel door de referentie te bewerken en de vervangende waarde in te voeren. Als u OAuth-app-secrets roteert, verbindt u de referentie opnieuw via **Connect**.

### Gebruikt door

- [Linear-node](../nodes/linear-node.md)

---

## Jira

De Jira-referentie slaat Jira Basic auth-referenties of een Data Center personal access token, de Jira-site-basis-URL, de deployment-modus en een optionele REST API-versie op voor de [Jira-node](../nodes/jira-node.md). Gebruik `cloud` voor Jira Cloud of `data_center` voor Jira Data Center / Server.

### Configuratie

**Jira Cloud**

1. Maak in de Atlassian-accountinstellingen een API-token aan.
2. Ga in het Heym Dashboard naar **Credentials** → **New** → type **Jira**.
3. Voer het Atlassian-e-mailadres, het API-token en de Jira-site-URL in, zoals `https://your-domain.atlassian.net`.
4. Gebruik **Test Connection** om de referentie te verifiëren.

**Jira Data Center / Server**

1. Selecteer **Jira Data Center / Server** als implementatie.
2. Kies een verificatiemethode. **Gebruikersnaam en wachtwoord** gebruikt Basic-auth. **Personal Access Token** gebruikt `Authorization: Bearer <token>` en vereist Jira Data Center / Server 8.14 of nieuwer. Maak het token aan onder **Profiel → Personal Access Tokens** in Jira.
3. Voer de Jira-gebruikersnaam en het wachtwoord in, of plak het personal access token (geen gebruikersnaam vereist).
4. Voer de Jira-site-URL in, bijvoorbeeld `https://jira.example.com`.
5. Gebruik **Test Connection** om de inloggegevens te verifiëren.

### Velden

| Veld | Beschrijving |
| --- | --- |
| `auth_mode` | `basic` (standaard bij ontbreken) of `pat`. `pat` is alleen geldig met `data_center` |
| `email` | E-mailadres van het Jira Cloud Atlassian-account of gebruikersnaam van Jira Data Center / Server. Niet gebruikt in de `pat`-modus |
| `api_token` | Jira Cloud Atlassian API-token, Jira Data Center / Server-wachtwoord voor Basic-auth of het Data Center personal access token in de `pat`-modus |
| `base_url` | Jira-site-basis-URL |
| `deployment` | `cloud` voor Jira Cloud of `data_center` voor Jira Data Center / Server |
| `api_version` | REST API-versie; standaard `3` voor Jira Cloud. Data Center / Server gebruikt v2 |

### Opmerkingen

- De Jira-node verzendt issue-beschrijvingen en opmerkingen als Atlassian Document Format-tekstdocumenten voor Jira Cloud REST API v3. Data Center / Server-referenties verzenden platte tekst.
- Data Center / Server ondersteunt Basic-auth met gebruikersnaam/wachtwoord en verificatie via een personal access token (PAT) met het Bearer-schema. PAT-verificatie vereist Jira Data Center / Server 8.14 of nieuwer.
- Het uploaden van bijlagen accepteert base64- of data-URL-inhoud en is onderhevig aan de bestandsgroottelimiet van het platform (standaard 99 MB). Het downloaden van bijlagen kan base64-inhoud retourneren wanneer dit is ingeschakeld.
- Het aanmaken en verwijderen van gebruikers en het verzenden van issue-meldingen vereisen dat het geauthenticeerde Jira-account de relevante Jira-site- of organisatiemachtigingen heeft.
- Gebruik List Projects, Search Issues en List Transitions om projectkeys, issue-keys en transition-ID's te achterhalen.
- Voor aangepaste endpoints die niet door de Jira-node worden gedekt, gebruikt u de [HTTP-node](../nodes/http-node.md) met Jira Basic Auth (`email:api_token` voor Cloud of `username:password` voor Data Center / Server) of PAT Bearer-auth (`Authorization: Bearer <token>` voor Data Center / Server). Gebruik eventueel een Header-credential met de juiste `Authorization`-header.

Zie ook:

- [Jira-node](../nodes/jira-node.md)
- [Referenties](./credentials.md)

---

## Sentry

De Sentry-referentie slaat een auth-token op voor de [Sentry-node](../nodes/sentry-node.md). Heym gebruikt de REST API van Sentry voor organisatie-, project-, team-, issue-, event- en release-operaties.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `api_token` | Sentry auth-token met toegang tot de organisaties en projecten die u automatiseert |

### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `base_url` | Optionele root-URL voor self-hosted Sentry, bijvoorbeeld `https://sentry.example.com` |

### Opmerkingen

- Laat `base_url` leeg voor Sentry SaaS.
- Gebruik **Test Connection** om te bevestigen dat het token zichtbare organisaties kan weergeven.
- Gebruik voor aangepaste REST-aanroepen `$credentials.YourSentryCredential` als het bearer-token.

### Gebruikt door

- [Sentry-node](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) is een open-source vectordatabase die wordt gebruikt voor semantisch zoeken en RAG (Retrieval Augmented Generation).

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `qdrant_host` | Volledige URL naar uw Qdrant-instantie (bijv. `http://localhost:6333` of een cloud-endpoint) |
| `openai_api_key` | OpenAI API-sleutel die wordt gebruikt om embeddings te genereren bij het indexeren en doorzoeken van documenten |
### Opmerkingen

- Qdrant-collecties worden beheerd via het tabblad [Vectorstores](../tabs/vectorstores-tab.md). Elke vectorstore komt overeen met een Qdrant-collectie.
- De [RAG-node](../nodes/rag-node.md) gebruikt een vectorstore (die verwijst naar een Qdrant-referentie) — de node verwijst niet rechtstreeks naar de referentie.
- Als uw Qdrant-instantie een API-key vereist, neem deze dan op in de waarde van `qdrant_host` of configureer Qdrant dienovereenkomstig; de huidige integratie heeft geen apart veld voor een Qdrant API-key.
- Self-hosted Qdrant: gebruik de [officiële Docker-image](https://hub.docker.com/r/qdrant/qdrant) en stel poort `6333` beschikbaar.

### Gebruikt door

- [RAG-node](../nodes/rag-node.md) (via vectorstore)
- [Vectorstores-tabblad](../tabs/vectorstores-tab.md)

## Aangepaste embeddings (RAG)

Standaard zijn RAG-embeddings afkomstig van OpenAI. Een referentie **RAG: Custom Embeddings** verwijst in plaats daarvan naar elk OpenAI-compatibel embeddings-endpoint — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together of een gehoste gateway — en benoemt de vectorstore waarnaar wordt geschreven.

### Vereiste velden

| Veld | Beschrijving |
|-------|-------------|
| `embedding_base_url` | Endpoint-URL inclusief het pad `/v1`, bijvoorbeeld `http://localhost:11434/v1` |
| `embedding_api_key` | Optioneel. Lokale servers vereisen doorgaans geen key |
| `embedding_model` | Modelnaam zoals het endpoint deze verwacht, bijvoorbeeld `nomic-embed-text` |
| `embedding_dimensions` | Vectorbreedte die het model retourneert (standaard `1536`) |
| `embedding_request_dimensions` | Optioneel. Vraag het endpoint om `embedding_dimensions` te retourneren in plaats van de oorspronkelijke breedte van het model |
| `db_type` | `qdrant` of `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant-verbinding, vereist wanneer `db_type` gelijk is aan `qdrant` |

### Opmerkingen

- **Qdrant accepteert elk aantal dimensies.** Elke collectie wordt aangemaakt met de breedte die deze referentie aangeeft, dus het veld Dimensions is vrij bewerkbaar.
- **Postgres (pgvector) vereist exact 1536 dimensies.** De kolom is een vaste `vector(1536)`, dus het veld Dimensions is vastgezet op 1536 en een referentie die een andere breedte aangeeft, wordt bij opslaan geweigerd.
- **Verkorten voor pgvector.** Wanneer de store Postgres is, biedt het dialoogvenster de optie *Ask the endpoint to return 1536 dimensions*. Hiermee wordt de request-parameter `dimensions` verzonden, die modellen die zijn getraind met Matryoshka-representaties (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` en vergelijkbare) honoreren door een verkorte, nog steeds betekenisvolle vector te retourneren. Endpoints die de parameter niet ondersteunen, weigeren het verzoek, en endpoints die de parameter accepteren maar negeren, produceren een duidelijke foutmelding met de breedte die daadwerkelijk wordt geretourneerd. Heym kapt vectoren nooit zelf af, omdat het slicen van de uitvoer van een niet-Matryoshka-model de retrieval-kwaliteit stilzwijgend verslechtert. De optie wordt niet aangeboden voor Qdrant, dat een collectie op elke breedte kan dimensioneren.
- Gebruik **Test Connection** in het referentiedialoogvenster om een probe-string te embedden en de breedte te zien die het model daadwerkelijk retourneert voordat u een store aanmaakt.
- De request-parameter `dimensions` wordt alleen naar OpenAI zelf verzonden, omdat de meeste OpenAI-compatibele servers onbekende parameters weigeren. De oorspronkelijke breedte van het model wordt in plaats daarvan gevalideerd tegen de referentie.
- De bestaande referenties **RAG: Qdrant + OpenAI** en **RAG: Psql + OpenAI** zijn ongewijzigd en blijven werken.

### Gebruikt door

- [RAG-node](../nodes/rag-node.md) (via vectorstore)
- [Vectorstores-tabblad](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym kan vectoren ook **opslaan in zijn eigen Postgres-database** met behulp van de [pgvector](https://github.com/pgvector/pgvector)-extensie — er is geen externe vectordienst vereist. Maak een referentie **RAG: Psql + OpenAI** aan en gebruik deze bij het aanmaken van een vectorstore, en kies vervolgens **Postgres (pgvector)** in de Database-dropdown van de RAG-node.

### Vereiste velden

| Veld | Beschrijving |
|-------|-------------|
| `openai_api_key` | OpenAI API-key die wordt gebruikt om embeddings te genereren bij het indexeren en doorzoeken van documenten |

### Opmerkingen

- Er is geen host/poort nodig — vectoren worden naar Heyms eigen database geschreven; Heym maakt nooit verbinding met een andere database.
- Elke RAG-functie die beschikbaar is met Qdrant (insert, search, metadatafilters, Cohere-reranking, klonen, delen) werkt identiek met de Postgres-backend.
- Vereist de `vector`-extensie. Heym laat de officiële `postgres:16`-image ongewijzigd (zodat bestaande data nooit wordt aangeraakt) en **installeert het pakket `postgresql-16-pgvector` automatisch bij het opstarten** — `run.sh`, `deploy.sh` en `run_e2e.sh` regelen dit allemaal. De installatie is niet-fataal: als deze niet kan worden uitgevoerd (bijvoorbeeld geen netwerk), blijft Qdrant RAG werken en blijft de Postgres-backend inactief (de migratie slaat de tabel op een correcte manier over).
- Als u de gepubliceerde single-container-image (`ghcr.io/heymrun/heym`) uitvoert tegen **uw eigen externe Postgres**, dan moet die database de `vector`-extensie ondersteunen (Heym kan deze niet installeren in een database die het niet beheert). Zonder deze extensie retourneert het aanmaken van of uploaden naar een Postgres-vectorstore een duidelijke melding en blijft Qdrant RAG werken.

### Gebruikt door

- [RAG-node](../nodes/rag-node.md) (via vectorstore)
- [Vectorstores-tabblad](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) is een hybride van spreadsheet en database die gestructureerde data en formules ondersteunt. Met de Grist-referentie kan Heym Grist-documenten lezen en schrijven.
### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `api_key` | Grist API key (te vinden in **Profile → API Key** op uw Grist-instantie) |
| `server_url` | Basis-URL van uw Grist-server (bijv. `https://docs.getgrist.com` voor Grist Cloud, of uw self-hosted URL) |

### Opmerkingen

- De [Grist-node](../nodes/grist-node.md) vereist het **Document ID** (uit de Grist-document-URL) en **Table ID** in de configuratie — deze maken geen deel uit van de referentie.
- Stel voor self-hosted Grist `server_url` in op het domein van uw instantie.
- Kolom-ID's in Grist gebruiken underscores (bijv. `User_Name`), niet de weergavelabels. Gebruik de `listColumns`-operatie om ze te ontdekken.

### Gebruikt door

- [Grist-node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

De Google Sheets-referentie verbindt Heym met de Google Sheets API via een OAuth2 "Bring Your Own App"-model. U levert een Google Cloud OAuth2 Client ID en Client Secret, en autoriseert vervolgens de toegang via een browserpopup. Tokens worden automatisch op de achtergrond vernieuwd.

### Configuratie

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → zoek en schakel **Google Sheets API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → applicatietype **Web application**.
3. Voeg onder **Authorized redirect URIs** toe: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopieer de gegenereerde **Client ID** en **Client Secret**.
5. Ga in het Heym Dashboard naar **Credentials** → **New** → type **Google Sheets (OAuth2)**.
6. Voer de Client ID, Client Secret en een naam in, en klik vervolgens op **Connect** om de Google-toestemmingspopup te openen en de toegang te autoriseren.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `client_id` | OAuth2 Client ID uit Google Cloud Console |
| `client_secret` | OAuth2 Client Secret uit Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) worden opgeslagen en automatisch vernieuwd — u beheert deze niet rechtstreeks.

### Opmerkingen

- Het OAuth2-toestemmingsscherm vereist de spreadsheets-scope (`https://www.googleapis.com/auth/spreadsheets`).
- Heym gebruikt het refresh token om nieuwe access tokens te verkrijgen voordat ze verlopen (veiligheidsbuffer van 60 seconden).
- Als u het Client Secret roteert in Google Cloud Console, verbindt u de referentie opnieuw via de knop **Connect**.
- **Productie:** Stel de backend **`FRONTEND_URL`** in op de exacte openbare URL die gebruikers in de browser openen (schema + host, bijv. `https://heym.example.com`). Heym bouwt de Google OAuth-redirect-URI uitsluitend op basis van deze waarde — het vertrouwt **niet** op `Origin`- of `X-Forwarded-*`-headers (door de client beheerd). Registreer `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` in Google Cloud Console.

### Gebruikt door

- [Google Sheets-node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

De Google Drive-referentie verbindt Heym met de Google Drive API via hetzelfde OAuth2 "Bring Your Own App"-model als Google Sheets. U levert een Google Cloud OAuth2 Client ID en Client Secret, en autoriseert vervolgens de toegang via een browserpopup. Tokens worden automatisch op de achtergrond vernieuwd.

### Configuratie

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → zoek en schakel **Google Drive API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → applicatietype **Web application**.
3. Voeg onder **Authorized redirect URIs** toe: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopieer de gegenereerde **Client ID** en **Client Secret**.
5. Ga in het Heym Dashboard naar **Credentials** → **New** → type **Google Drive (OAuth2)**.
6. Voer de Client ID, Client Secret en een naam in, en klik vervolgens op **Connect** om de Google-toestemmingspopup te openen en de toegang te autoriseren.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `client_id` | OAuth2 Client ID uit Google Cloud Console |
| `client_secret` | OAuth2 Client Secret uit Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) worden opgeslagen en automatisch vernieuwd — u beheert deze niet rechtstreeks.

### Scope

Google Drive vraagt de **volledige Drive-scope** aan (`https://www.googleapis.com/auth/drive`).

Dit is vereist omdat de node werkt met bestanden die u al bezit. De nauwere `drive.file`-scope verleent alleen toegang tot bestanden die de OAuth-client zelf heeft aangemaakt, waardoor `listFolderFiles`, `updateFile`, `removeFile` en `removeFolder` niets van uw bestaande Drive zouden zien.

Omdat u uw eigen Client ID en Secret uit uw eigen Google Cloud-project levert, gelden de vereisten voor Google-app-verificatie voor deze scope voor uw project, niet voor Heym.

### Opmerkingen

- Heym gebruikt het refresh token om nieuwe access tokens te verkrijgen voordat ze verlopen (veiligheidsbuffer van 60 seconden).
- Als u het Client Secret roteert in Google Cloud Console, verbindt u de referentie opnieuw via de knop **Connect**.
- Gedeelde drives worden ondersteund — de node stelt `supportsAllDrives` in bij elke API-aanroep.
- **Productie:** Stel de backend **`FRONTEND_URL`** in op de exacte openbare URL die gebruikers in de browser openen. Heym bouwt de Google OAuth-redirect-URI uitsluitend op basis van deze waarde — het vertrouwt **niet** op `Origin`- of `X-Forwarded-*`-headers. Registreer `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` in Google Cloud Console.
- Zie [Referenties delen](./credentials-sharing.md) voordat u deze referentie met een team deelt.

### Gebruikt door

- [Google Drive-node](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

De BigQuery-referentie verbindt Heym met de Google BigQuery API via een OAuth2 "Bring Your Own App"-model. U levert een Google Cloud OAuth2 Client ID en Client Secret aan en autoriseert vervolgens de toegang via een browserpopup. Tokens worden automatisch op de achtergrond vernieuwd.

### Configuratie

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → zoek en schakel **BigQuery API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → toepassingstype **Web application**.
3. Voeg onder **Authorized redirect URIs** toe: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopieer de gegenereerde **Client ID** en **Client Secret**.
5. Ga in het Heym Dashboard naar **Credentials** → **New** → type **BigQuery (OAuth2)**.
6. Voer de Client ID, Client Secret en een naam in en klik op **Connect** om de Google-toestemmingspopup te openen en toegang te autoriseren.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `client_id` | OAuth2 Client ID uit Google Cloud Console |
| `client_secret` | OAuth2 Client Secret uit Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) worden opgeslagen en automatisch vernieuwd.

### Opmerkingen

- Het OAuth2-toestemmingsscherm vereist de BigQuery-scope (`https://www.googleapis.com/auth/bigquery`).
- **Productie:** Stel de backend **`FRONTEND_URL`** in op de openbare URL. Registreer `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` in Google Cloud Console.

### Gebruikt door

- [BigQuery-node](../nodes/bigquery-node.md)

---

## Supabase

De Supabase-referentie verbindt Heym met de PostgREST API van een Supabase-project, zodat workflows query's kunnen uitvoeren en gegevens kunnen wijzigen in tabellen die door Postgres worden ondersteund.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `supabase_url` | Basis-URL van het project, bijvoorbeeld `https://your-project.supabase.co` |
| `supabase_key` | API-sleutel met toegang tot de doeltabellen |
| `supabase_schema` | Optioneel standaardschema (standaard `public`) |

### Opmerkingen

- De [Supabase-node](../nodes/supabase-node.md) communiceert met `/rest/v1/<table>` en ondersteunt operatorfilters (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` en gerelateerde PostgREST-operatoren) plus geneste logische groepen `or` / `and`.
- Gebruik voor schrijfbewerkingen bij voorkeur een sleutel die bedoeld is voor vertrouwd server-side gebruik met de minimaal vereiste tabelmachtigingen.
- Nodes kunnen het schema per stap overschrijven, zelfs als de referentie een standaardschema definieert.

### Gebruikt door

- [Supabase-node](../nodes/supabase-node.md)

## ClickHouse

De ClickHouse-referentie verbindt Heym met een externe ClickHouse-database via de HTTP-interface, zodat workflows SQL-, CRUD- en telbewerkingen kunnen uitvoeren op OLAP-tabellen.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `host` | HTTP-host zonder schema, bijvoorbeeld `your-instance.clickhouse.cloud` |
| `port` | Poort van de HTTP-interface (`8443` voor HTTPS, `8123` voor HTTP) |
| `username` | ClickHouse-gebruiker (standaard `default`) |
| `password` | Wachtwoord van de gebruiker (optioneel) |
| `database` | Doeldatabase (standaard `default`) |
| `secure` | Gebruik HTTPS wanneer `true` (vereist voor ClickHouse Cloud) |

### Opmerkingen

- De [ClickHouse-node](../nodes/clickhouse-node.md) gebruikt de officiële `clickhouse-connect` HTTP-client en parameteriseert filter- en waardebindingen.
- `update` en `remove` verwijzen naar `ALTER TABLE ... UPDATE` en `DELETE FROM`, dit zijn asynchrone ClickHouse-mutaties; beide vereisen een filter.
- `upsert` voert een `INSERT` uit en gaat uit van een `ReplacingMergeTree`-tabel voor merge-on-key-gedrag.
- Gebruik **Test connection** in het referentiedialoogvenster om de bereikbaarheid te verifiëren.

### Gebruikt door

- [ClickHouse-node](../nodes/clickhouse-node.md)

## Notion

De Notion-referentie ondersteunt zowel een intern integratietoken als een OAuth-verbinding voor een publieke integratie. Met OAuth kan elke gebruiker een Notion-workspace vanuit Heym autoriseren in plaats van handmatig een token te kopiëren.

### Verplichte velden

| Modus | Veld | Beschrijving |
|------|-------|-------------|
| Intern token | `api_token` | Intern integratietoken (`ntn_...`) |
| OAuth | `client_id` | Client ID van een publieke Notion-integratie |
| OAuth | `client_secret` | Client Secret van de publieke Notion-integratie |

De OAuth-callback slaat `access_token`, `auth_mode`, `workspace_id`, `workspace_name` en `bot_id` automatisch op. Een eerder intern `api_token` wordt verwijderd zodra OAuth is voltooid. Registreer deze redirect-URI in Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth-configuratiestroom

1. Kies **OAuth** in het referentiedialoogvenster en voer een naam, Client ID en Client Secret in.
2. Klik op **Connect** en autoriseer de workspace in de Notion-popup.
   - Voor een **nieuwe** referentie maakt Heym het referentierecord aan wanneer u op **Connect** klikt.
   - Voltooi de autorisatie in de popup en klik vervolgens op **Save** om terug te keren naar de referentielijst.
3. Een verbonden referentie toont `connected (Workspace Name)` in de lijst. Referenties met een lopende OAuth-autorisatie tonen `Not connected` totdat de autorisatie is voltooid.

Gebruik **Test Connection** in het referentiedialoogvenster om een intern token of een voltooide OAuth-autorisatie te verifiëren. Bij het bewerken blijft het opgeslagen interne token behouden wanneer het tokenveld leeg wordt gelaten.

Zowel interne tokens als OAuth-toegangstokens zijn beschikbaar via `$credentials.CredentialName` voor aangepaste [HTTP](../nodes/http-node.md)-aanroepen die een Notion bearer-token nodig hebben.
### Opmerkingen

- Interne integraties vereisen dat de relevante pagina's, databases en gegevensbronnen worden gedeeld.
- OAuth-gebruikers kiezen de workspace/pagina's tijdens de Notion-autorisatie.
- OAuth-applicatiereferenties worden versleuteld binnen de Notion-referentie. De callback laadt
  deze server-side opnieuw; het geheim wordt niet opgenomen in de OAuth-state.
- Verbonden OAuth-referenties tonen de naam van de workspace; openstaande OAuth-referenties tonen
  `Not connected` totdat de autorisatie is voltooid.
- **Productie:** Stel de backend **`FRONTEND_URL`** in op de openbare browser-URL (schema + host, zonder
  afsluitende slash). De Notion-redirect-URI moet exact overeenkomen:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- De node gebruikt API-versie `2026-03-11` en de huidige `data_source`-terminologie. Zie het
  artikel [Notion-node](../nodes/notion-node.md#api-version-notes) voor migratierichtlijnen vanuit
  oudere `archived`-, `after`- of database-query-voorbeelden.
- Oude zoekfilters met objectwaarde `database` worden genormaliseerd naar `data_source`.

### Gebruikt door

- [Notion-node](../nodes/notion-node.md)

---

## SMTP (E-mail)

De SMTP-referentie slaat verbindingsgegevens van de e-mailserver op voor het verzenden van uitgaande mail.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `host` | Hostnaam van de SMTP-server (bijv. `smtp.gmail.com`) |
| `port` | SMTP-poort (doorgaans `587` voor STARTTLS, `465` voor SSL) |
| `email` | Gebruikersnaam waarmee de SMTP-server inlogt; tevens de zichtbare afzender wanneer `from` leeg is |
| `password` | SMTP-wachtwoord of App Password |

### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `from` (`smtp_from`) | Zichtbaar From-adres. Laat leeg om te verzenden als `email`. De server logt nog steeds in als `email`, dus dat account moet gemachtigd zijn om namens dit adres te verzenden (in Gmail een geverifieerde **E-mail verzenden als**-alias). |

### Veelvoorkomende SMTP-providers

| Provider | Host | Poort | Opmerkingen |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Vereist een [App Password](https://support.google.com/accounts/answer/185833) (2FA moet zijn ingeschakeld) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Gebruik uw Microsoft-accountreferenties |
| Mailgun | `smtp.mailgun.org` | `587` | Gebruik Mailgun SMTP-referenties uit uw domeininstellingen |
| SendGrid | `smtp.sendgrid.net` | `587` | Gebruik `apikey` als gebruikersnaam en een API-sleutel als wachtwoord |
| Aangepast / zelf gehost | uw domein | `587` / `465` | Postfix, Exim, enz. |

### Opmerkingen

- Gmail vereist een **App Password** in plaats van uw gewone wachtwoord wanneer tweestapsverificatie is ingeschakeld.
- Poort `587` gebruikt STARTTLS (start als platte tekst, upgrade naar TLS). Poort `465` gebruikt impliciete TLS (SSL vanaf het begin).

### Gebruikt door

- [Send Email-node](../nodes/send-email-node.md)

---

## IMAP (Inkomende e-mail)

De IMAP-referentie slaat verbindingsgegevens op voor het monitoren van een inbox met de [IMAP Trigger-node](../nodes/imap-trigger-node.md).

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `imap_host` | Hostnaam van de IMAP-server (bijvoorbeeld `imap.gmail.com`) |
| `imap_port` | IMAP-poort (`993` voor SSL/TLS bij de meeste providers) |
| `imap_username` | Gebruikersnaam van de mailbox of volledig e-mailadres |
| `imap_password` | Wachtwoord of providerspecifiek app-wachtwoord |

### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `imap_mailbox` | Te monitoren mailboxmap (standaard: `INBOX`) |
| `imap_use_ssl` | SSL/TLS inschakelen (aanbevolen; standaard: `true`) |

### Opmerkingen

- De IMAP-trigger stelt bij de eerste poll een basislijn in voor de huidige mailbox en verwerkt daarna alleen nieuwere e-mail.
- Gmail, Microsoft 365 en andere gehoste providers vereisen vaak een **app-wachtwoord** of een vergelijkbaar IMAP-specifiek geheim.
- Bijlage-inhoud wordt niet gedownload naar de workflow-payload; Heym stelt alleen metadata van bijlagen beschikbaar.

### Gebruikt door

- [IMAP Trigger-node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP als workflow-trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) is een open-source berichtenbroker. De RabbitMQ-referentie slaat verbindingsgegevens op voor het publiceren naar en consumeren van wachtrijen en exchanges.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `rabbitmq_host` | AMQP-verbindings-URL (bijv. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-gebruikersnaam (standaard: `guest`) |
| `rabbitmq_password` | RabbitMQ-wachtwoord (standaard: `guest`) |

### Virtuele hosts

Om verbinding te maken met een specifieke virtuele host, neemt u deze op in de `rabbitmq_host`-URL:

```
amqp://username:password@hostname:5672/vhost
```

Bij gebruik van de standaard-vhost kan het pad `/` worden weggelaten.

### Plugin voor vertraagde berichten

De [RabbitMQ-node](../nodes/rabbitmq-node.md) ondersteunt de **rabbitmq_delayed_message_exchange**-plugin. Wanneer deze plugin is ingeschakeld op uw RabbitMQ-server, kunt u een vertraging (in milliseconden) instellen op uitgaande berichten met behulp van het veld `rabbitmqDelayMs` op de node.

De node stelt de `x-delay`-header in op het gepubliceerde bericht. Het exchange-type moet `x-delayed-message` zijn wil de vertraging van kracht worden.

Om de plugin in te schakelen op een zelf gehoste RabbitMQ-instantie:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Wanneer de plugin niet is geïnstalleerd, wordt de `x-delay`-header genegeerd en worden berichten onmiddellijk afgeleverd.

### Gebruikt door

- [RabbitMQ-node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ als workflow-trigger)

---

## Amazon S3

De Amazon S3-referentie verbindt Heym met [Amazon S3](https://aws.amazon.com/s3/). Gebruik deze met de [Amazon S3-node](../nodes/amazon-s3-node.md) om buckets en mappen te beheren, objecten te uploaden en te downloaden, keys te kopiëren en objecten uit workflows weer te geven of te verwijderen.
### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key ID |
| `aws_secret_access_key` | Secret access key gekoppeld aan de access key ID |
| `aws_region` | AWS-regio waar buckets zich bevinden (bijv. `us-east-1`) |

### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `aws_session_token` | Tijdelijk sessietoken bij gebruik van AWS STS-referenties |

### Opmerkingen

- De referentie gebruikt standaard AWS SigV4-authenticatie via boto3.
- Uploadbewerkingen verzenden momenteel UTF-8 tekstinhoud; downloads kunnen tekst of base64 retourneren voor binaire objecten.

### Gebruikt door

- [Amazon S3-node](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) is een in-memory key-value store die wordt gebruikt voor caching en snelle gegevenstoegang.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `host` | Hostnaam of IP van de Redis-server (bijv. `localhost`) |
| `port` | Redis-poort (standaard: `6379`) |
| `password` | Redis-wachtwoord (laat leeg indien niet ingesteld) |

### Gebruikt door

- [Redis-node](../nodes/redis-node.md)

---

## Slack

De Slack-referentie slaat een **Incoming Webhook URL** op voor het plaatsen van berichten in Slack-kanalen.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (uit de configuratie van uw Slack-app) |

### Opmerkingen

- Maak een Incoming Webhook aan op [api.slack.com/apps](https://api.slack.com/apps) → uw app → **Incoming Webhooks**.
- Elke webhook is gekoppeld aan een specifiek kanaal. Maak meerdere referenties aan voor verschillende kanalen.

### Gebruikt door

- [Slack-node](../nodes/slack-node.md)

---

## Telegram

De Telegram-referentie slaat een **Bot Token** en een optioneel **Webhook Secret Token** op voor op bots gebaseerde workflows.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `bot_token` | Telegram Bot API-token van BotFather |

### Optionele velden

| Veld | Beschrijving |
|-------|-------------|
| `secret_token` | Gedeeld geheim dat wordt geverifieerd tegen `x-telegram-bot-api-secret-token` bij inkomende webhooks |

### Opmerkingen

- Gebruik dezelfde referentie voor zowel [Telegram Trigger](../nodes/telegram-trigger-node.md) als [Telegram](../nodes/telegram-node.md).
- Registreer de webhook handmatig via de `setWebhook` API van Telegram met de URL die wordt weergegeven in het paneel van de Telegram Trigger-node.
- `chatId` in de Telegram-node kan een letterlijke ID zijn of een expressie zoals `$telegramEvent.message.chat.id`.

### Gebruikt door

- [Telegram Trigger-node](../nodes/telegram-trigger-node.md)
- [Telegram-node](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Deze referenties worden gebruikt door de [HTTP-node](../nodes/http-node.md) om uitgaande verzoeken te authenticeren.

### Bearer

Voegt een `Authorization: Bearer <token>`-header toe aan HTTP-verzoeken.

| Veld | Beschrijving |
|-------|-------------|
| `token` | De waarde van het bearer-token |

### Header

Voegt een aangepaste header toe aan HTTP-verzoeken.

| Veld | Beschrijving |
|-------|-------------|
| `header_key` | Naam van de header (bijv. `X-Api-Key`) |
| `header_value` | Waarde van de header |

Beide typen kunnen ook worden gerefereerd via `$credentials.CredentialName` in de [Expression DSL](./expression-dsl.md) voor dynamisch gebruik in elke node die expressies accepteert.

### Gebruikt door

- [HTTP-node](../nodes/http-node.md)

---

## LLM Providers (OpenAI, Google, Custom, Cohere)

Deze referenties voorzien AI-nodes van kracht.

| Type | Beschrijving |
|------|-------------|
| **OpenAI** | API-key voor GPT-modellen en OpenAI-embeddings |
| **Google** | API-key voor Gemini-modellen |
| **Custom** | API-key + base URL voor OpenAI-compatibele endpoints (Ollama, vLLM, LM Studio, enz.) |
| **Cohere** | API-key voor Cohere-embeddings |

### OpenAI Prompt Caching

OpenAI cachet automatisch het statische (onveranderlijke) prefix van uw systeem-prompt — er is geen extra configuratie vereist. Herhaalde workflow-uitvoeringen die hetzelfde systeem-prompt-prefix delen, profiteren van cached token-pricing, wat zowel de kosten als de latentie vermindert. Dit is vooral nuttig wanneer u lange, vaste instructies heeft en alleen het gebruikersbericht tussen uitvoeringen verandert. Monitor cache hit rates en tokenbesparingen in het tabblad [Uitvoeringen](../tabs/traces-tab.md) of het OpenAI-gebruikersdashboard om uw prompt-structuur te optimaliseren voor maximaal hergebruik van de cache.

### Gebruikt door

- [LLM-node](../nodes/llm-node.md)
- [Agent-node](../nodes/agent-node.md)
- [RAG-node](../nodes/rag-node.md) (OpenAI-embeddings via Qdrant-referentie)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) is een proxyserver voor het omzeilen van Cloudflare en vergelijkbare bot-protectie-uitdagingen.

### Verplichte velden

| Veld | Beschrijving |
|-------|-------------|
| `flaresolverr_url` | URL van uw FlareSolverr-instantie (bijv. `http://localhost:8191`) |

Loopback- en privéadressen worden hier ondersteund, dus het naast Heym draaien van FlareSolverr werkt zoals gedocumenteerd. De URL mag niet verwijzen naar een link-local- of cloud-metadata-adres. Omdat privéadressen zijn toegestaan, kan dit veld ook naar een andere interne service worden gericht en komt het antwoord terug in de node-uitvoer. Elke aangemelde gebruiker kan deze referentie aanmaken, dus de grens is wie workflows mag authoreren plus uw netwerkregels, niet het delen van referenties. Zie [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Gebruikt door

- [Crawler-node](../nodes/crawler-node.md)

---
## Gerelateerd

- [Referenties](./credentials.md) – Overzicht van referenties en hoe nodes deze gebruiken
- [Referenties-tab](../tabs/credentials-tab.md) – Referenties toevoegen en beheren
- [Referenties delen](./credentials-sharing.md) – Referenties delen met gebruikers en teams
- [Beveiliging](./security.md) – Versleuteling in rust, toegangsbeheer
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntaxis voor dynamische toegang

---

## Model Router (Auto Model)

Routeert elk verzoek naar een van uw bestaande model-referenties, waarbij een beslissingsmodel
de keuze maakt. Het slaat verwijzingen op, nooit een eigen sleutel.

### Verplichte velden

- `decision_credential_id` – een **Decision Model**-referentie waartoe u toegang heeft.
- `decision_model` – het model dat de routeringsaanroep doet, bijvoorbeeld `jev-latest`.
- `options` – ten minste twee items, elk met een naam, een van uw OpenAI/Google/Custom-
  referenties, een model daarop, en criteria die aangeven wanneer deze moet winnen.

### Optionele velden

- `routing_instructions` – hoe de opties overall moeten worden gewogen.
- Eén optie kan worden gemarkeerd als de fallback die wordt gebruikt wanneer routering mislukt.

### Opmerkingen

De beslissingsmodel kiest tussen de optienamen, dus deze moeten onderscheidend zijn. Een
optie kan niet naar een andere Model Router verwijzen.
