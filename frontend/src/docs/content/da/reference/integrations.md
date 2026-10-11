# Third-Party Integrations

Heym forbinder til eksterne tjenester via **legitimationsoplysninger**. Hver legitimationsoplysningstype gemmer forbindelsesdetaljerne for én tjeneste og kan genbruges på tværs af flere noder og workflows. Se [Legitimationsoplysninger](./credentials.md) for en oversigt.

Legitimationsoplysninger tilføjes i [Indstillinger → Legitimationsoplysninger](../tabs/credentials-tab.md). Alle værdier er krypteret ved opbevaring. Legitimationsoplysninger kan [deles](./credentials-sharing.md) med andre brugere eller [Teams](./teams.md).

Nogle integrationsnoder kræver **ikke** legitimationsoplysninger. [WebSocket Trigger](../nodes/websocket-trigger-node.md) og [WebSocket Send](../nodes/websocket-send-node.md) forbinder til eksterne sockets ved hjælp af URL'en, headers og subprotokoller, der er konfigureret direkte på noden.

## Oversigt over Legitimationsoplysningstyper

| Type | Brugt Af | Nøglefelter |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, valgfri `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, valgfri `base_url` |
| **Jira** | [Jira node](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, valgfri `api_version` |
| **Linear** | [Linear node](../nodes/linear-node.md) | `api_key`, eller `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry node](../nodes/sentry-node.md) | `api_token`, valgfri `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evalueringer](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, valgfri `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | en beslutningsmodel-legitimationsoplysning plus modelmuligheder, der refererer til andre legitimationsoplysninger |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorlagre | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorlagre | `openai_api_key` (vektorer gemt i Heyms egen Postgres via pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorlagre | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, valgfri `embedding_api_key`, plus `qdrant_host` når `db_type` er `qdrant` |
| **Grist** | [Grist node](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets node](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 samtykke |
| **Google Drive** | [Google Drive node](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 samtykke (fuld Drive-scope) |
| **BigQuery** | [BigQuery node](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 samtykke |
| **Supabase** | [Supabase node](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, valgfri `supabase_schema` |
| **ClickHouse** | [ClickHouse node](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion node](../nodes/notion-node.md) | `api_token`, eller `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 node](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger node](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger node](../nodes/telegram-trigger-node.md), [Telegram node](../nodes/telegram-node.md) | `bot_token`, valgfri `secret_token` |
| **Discord** | [Discord node](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger node](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ node](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis node](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack node](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger node](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP node](../nodes/http-node.md) | `token` |
| **Header** | [HTTP node](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler node](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub-legitimationsoplysningen gemmer en GitHub personal access token (PAT), så workflows kan kalde GitHub REST API'en gennem [GitHub-node](../nodes/github-node.md), videregive tokenet til MCP-servere som `@modelcontextprotocol/server-github`, eller bruge det fra [HTTP-node](../nodes/http-node.md) til brugerdefinerede REST-kald.

### Påkrævede Felter

| Felt | Beskrivelse |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` fine-grained PAT eller klassisk `ghp_...` PAT) |
### Valgfrie felter

| Felt | Beskrivelse |
|-------|-------------|
| `base_url` | GitHub API base URL for GitHub Enterprise Server (f.eks. `https://github.example.com/api/v3`) |

### Bemærkninger

- Fine-grained personal access tokens anbefales, når det er muligt, da de kan scopes til specifikke repositories og tilladelser.
- Lad `base_url` være tom for GitHub.com. For GitHub Enterprise Server anvendes den fulde REST API-endpoint inklusive `/api/v3` (f.eks. `https://github.example.com/api/v3`), ikke serverens web UI-rod som `https://github.example.com`.
- Denne credential understøtter i øjeblikket kun PAT-baseret autentificering. For at få adgang til organisationers repositories anvendes en PAT, der er tildelt de nødvendige organisation/repository-tilladelser.
- GitHub App installation tokens og GitHub App setup flows understøttes ikke fuldt i Heym UI i dag.
- Foretræk [GitHub-node](../nodes/github-node.md) til native repository-, bruger-, issue-, pull request-, review-, release-, Actions workflow-, traffic- og filoperationer. Anvend [HTTP-node](../nodes/http-node.md) kun, når der er behov for endpoints eller payloads, som GitHub-noden ikke dækker.
- Anvend [Agent-node](../nodes/agent-node.md) med MCP ved at videregive `$credentials.YourGitHubCredential` til en MCP-forbindelsesmiljøvariabel som `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHub's REST API forventer typisk `Authorization: Bearer <token>` samt `Accept: application/vnd.github+json`.
- Ved redigering af en GitHub-credential bevares den eksisterende endpoint, hvis GitHub Enterprise `base_url` efterlades tom. Indtast kun en ny URL, hvis der ønskes at ændre denne endpoint.

### Anvendt af

- [GitHub-node](../nodes/github-node.md)
- [Codex-node](../nodes/codex-node.md)
- [Agent-node](../nodes/agent-node.md)
- [HTTP-node](../nodes/http-node.md)

---

## Beslutningsmodel

En beslutningsmodel besvarer typiserede spørgsmål om en tilstand og returnerer sandsynligheder i stedet for tekst. TypeSafe's Jev er referenceimplementeringen; ethvert endpoint, der accepterer den samme `{model, state, questions}`-krop, virker, og [Decision-node](../nodes/decision-node.md) kan sende en håndskrevet krop for et, der ikke gør.

### Påkrævede felter

- `base_url` – endpointet, f.eks. `https://api.typesafe.ai`. Heym tilføjer `/v1/systemone`.

### Valgfrie felter

- `api_key` – sendes som `Authorization: Bearer`. Endpoints, der ikke kræver en nøgle, kan efterlade dette tomt.

### Bemærkninger

- **Testforbindelse** sender ét lille spørgsmål for at bekræfte, at endpointet og nøglen virker.
- Redigering af en credential bevarer den gemte nøgle, når nøglefeltet efterlades tomt.
- Udgående anmodninger til private og loopback-adresser blokeres som standard, så et selvhostet endpoint på `localhost` eller et privat område kræver `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Disse modeller mangler i Heyms synkroniserede LLM-pristabeller, så Cost-kolonnen i [Traces](../tabs/traces-tab.md) forbliver tom. Token-tæller registreres dog stadig.

### Anvendt af

- [Decision-node](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – scorer `LLM-as-Judge`-svar mod det forventede output

## OpenAI Codex

OpenAI Codex-credentialen autentificerer [Codex-node](../nodes/codex-node.md). Den er adskilt fra OpenAI API-nøgle-credentialen, der anvendes af LLM-, Agent- og RAG-noder.

### Autentificeringstilstande

| Tilstand | Beskrivelse |
|------|-------------|
| **Log ind med ChatGPT** (anbefales) | OAuth (PKCE)-login, der anvender ChatGPT Plus/Pro-abonnement, så kørsler undgår API-omkostninger pr. token. Heym gemmer og opdaterer automatisk token-bundtet. |
| **Access token** | Et ChatGPT/Codex `access_token`, der kun videregives til den lokale Codex CLI-proces. |

### Bemærkninger

- API-nøgler afvises for denne credential-type.
- Codex-tokens eksponeres ikke gennem `$credentials.Name`.
- Codex-noden kræver også en GitHub-credential til repository-klon, branch-push og draft PR-oprettelse.

### Anvendt af

- [Codex-node](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go-credentialen autentificerer [OpenCode Go-node](../nodes/opencode-go-node.md). Den gemmer en OpenCode Go gateway API-nøgle (fra [opencode.ai/go](https://opencode.ai/go)) og en valgfri gateway base URL.

### Felter

| Felt | Beskrivelse |
|-------|-------------|
| **API-nøgle** | OpenCode Go gateway API-nøgle (påkrævet). |
| **Gateway Base URL** | Valgfri; standard er `https://opencode.ai/zen/go/v1`. Overstyr kun for en selvhostet eller proxy'ed gateway. |

### Bemærkninger

- API-nøglen videregives kun til OpenCode CLI-processen inde i en hærdet container.
- OpenCode Go-noden kræver også en GitHub-credential til repository-klon, branch-push og pull request-oprettelse. GitHub-tokenet placeres aldrig i sandkasse-containeren.

### Anvendt af

- [OpenCode Go-node](../nodes/opencode-go-node.md)

---

## Linear

Linear-credentialen understøtter enten en personlig API-nøgle eller OAuth2 til [Linear-node](../nodes/linear-node.md). Heym sender native GraphQL-forespørgsler til Linear for workspace-metadata, projekter, issues og kommentarer.
### Opsætning

Vælg en godkendelsesmetode:

**Personlig API-nøgle**

1. I Linear skal der navigeres til **Settings → Security & Access → Personal API keys**.
2. Opret en nøgle med adgang til det ønskede workspace.
3. Indsæt nøglen i en Linear-legitimationsoplysning i Heym og brug **Test Connection** for at verificere den.

**OAuth2**

1. Opret en Linear OAuth-applikation.
2. Registrer `{FRONTEND_URL}/api/credentials/linear/oauth/callback` som omdirigerings-URI.
3. I Heym Dashboard → **Credentials** → **New** → vælg **Linear**.
4. Vælg **OAuth2**, indtast Client ID og Client Secret, og klik på **Connect**.

### Påkrævede felter

| Metode | Felt | Beskrivelse |
|------|-------|-------------|
| Personlig API-nøgle | `api_key` | Linear personlig API-nøgle, typisk med præfikset `lin_api_` |
| OAuth2 | `client_id` | Client ID fra Linear OAuth-applikationen |
| OAuth2 | `client_secret` | Client Secret fra Linear OAuth-applikationen |

OAuth-tokens (`access_token`, `refresh_token`, `token_expiry`) gemmes og opdateres automatisk.

### Bemærkninger

- Personlige API-nøgler og OAuth-tokens fungerer som den Linear-bruger, der oprettede eller godkendte dem.
- Linear OAuth bruger scopes `read,write,issues:create,comments:create`.
- Brug **Test Connection** i legitimationsdialogen for at verificere API-nøglen eller OAuth-token mod Linear API.
- Brug List Teams og List Projects i Linear-node til at finde UUID'er før oprettelse eller filtrering af issues.
- Brug List Workflow States og List Team Members til at finde state- og assignee-UUID'er til opdateringer.
- En API-nøgle roteres ved at redigere legitimationsoplysningen og indtaste den nye værdi. Ved rotation af OAuth app-secrets skal legitimationsoplysningen genoprettes via **Connect**.

### Brugt af

- [Linear-node](../nodes/linear-node.md)

---

## Jira

Jira-legitimationsoplysningen gemmer Jira Basic auth-legitimationsoplysninger, Jira site base URL, deployment-mode og valgfri REST API-version til [Jira-node](../nodes/jira-node.md). Brug `cloud` til Jira Cloud eller `data_center` til Jira Data Center / Server.

### Opsætning

**Jira Cloud**

1. I Atlassian-kontoindstillinger oprettes en API-token.
2. I Heym Dashboard → **Credentials** → **New** → vælg **Jira**.
3. Indtast Atlassian-email, API-token og Jira site URL som f.eks. `https://your-domain.atlassian.net`.
4. Brug **Test Connection** til at verificere legitimationsoplysningen.

**Jira Data Center / Server**

1. Vælg **Jira Data Center / Server** som deployment.
2. Indtast Jira-brugernavn og -adgangskode til Basic auth.
3. Indtast Jira site URL, f.eks. `https://jira.example.com`.
4. Brug **Test Connection** til at verificere legitimationsoplysningen.

### Felter

| Felt | Beskrivelse |
| --- | --- |
| `email` | Jira Cloud Atlassian-konto email eller Jira Data Center / Server brugernavn |
| `api_token` | Jira Cloud Atlassian API-token eller Jira Data Center / Server adgangskode til Basic auth |
| `base_url` | Jira site base URL |
| `deployment` | `cloud` til Jira Cloud eller `data_center` til Jira Data Center / Server |
| `api_version` | REST API-version; standard er `3` til Jira Cloud. Data Center / Server bruger v2 |

### Bemærkninger

- Jira-node sender issue-beskrivelser og kommentarer som Atlassian Document Format-tekst
  dokumenter til Jira Cloud REST API v3. Data Center / Server-legitimationsoplysninger sender almindelig tekst.
- Data Center / Server understøtter i øjeblikket kun Basic auth med brugernavn/adgangskode. Personlige adgangstokens og Bearer auth understøttes endnu ikke.
- Vedhæftningsupload accepterer base64 eller data URL-indhold og er underlagt platformens filstørrelsesgrænse (standard 99 MB). Vedhæftningsdownload kan returnere base64-indhold, når det er aktiveret.
- Brugeroprettelse, -sletning og issue-notifikationer kræver, at den autentificerede Jira-konto har de relevante Jira site- eller organisationsrettigheder.
- Brug List Projects, Search Issues og List Transitions til at finde projektnøgler, issue-nøgler og transition-ID'er.
- Til brugerdefinerede endpoints, der ikke dækkes af Jira-node, kan [HTTP-node](../nodes/http-node.md) bruges med Jira Basic Auth (`email:api_token` til Cloud eller `username:password` til Data Center / Server) i cURL-kommandoen, eller en Header-legitimationsoplysning med den tilsvarende `Authorization: Basic <base64(user:secret)>`-værdi.

Se også:

- [Jira-node](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Sentry-legitimationsoplysningen gemmer en auth-token til [Sentry-node](../nodes/sentry-node.md). Heym bruger Sentry's REST API til organisation-, projekt-, team-, issue-, event- og release-operationer.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `api_token` | Sentry auth-token med adgang til de organisationer og projekter, der skal automatiseres |

### Valgfrie felter

| Felt | Beskrivelse |
|-------|-------------|
| `base_url` | Valgfri root URL til selvhostet Sentry, f.eks. `https://sentry.example.com` |

### Bemærkninger

- Lad `base_url` være tom til Sentry SaaS.
- Brug **Test Connection** til at bekræfte, at token kan liste synlige organisationer.
- Til brugerdefinerede REST-kald kan `$credentials.YourSentryCredential` bruges som bearer-token.

### Brugt af

- [Sentry-node](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) er en open-source vektordatabase til semantisk søgning og RAG (Retrieval Augmented Generation).

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `qdrant_host` | Fulde URL til Qdrant-instansen (f.eks. `http://localhost:6333` eller et cloud-endpoint) |
| `openai_api_key` | OpenAI API-nøgle til generering af embeddings ved indeksering og søgning i dokumenter |
### Noter

- Qdrant-collectioner administreres fra fanen [Vektorlagre](../tabs/vectorstores-tab.md). Hvert vektorlager svarer til en Qdrant-collection.
- [RAG-node](../nodes/rag-node.md) anvender et vektorlager (som refererer til en Qdrant-legitimationsoplysning) - den refererer ikke direkte til legitimationsoplysningen.
- Hvis Qdrant-instansen kræver en API-nøgle, skal den inkluderes i `qdrant_host`-værdien eller Qdrant skal konfigureres i overensstemmelse hermed; den nuværende integration har ikke et separat felt til Qdrant API-nøgle.
- Selvhostet Qdrant: brug den [officielle Docker-image](https://hub.docker.com/r/qdrant/qdrant) og eksponer port `6333`.

### Anvendt af

- [RAG-node](../nodes/rag-node.md) (via vektorlager)
- [Vektorlager-fanen](../tabs/vectorstores-tab.md)

## Brugerdefinerede indlejringer (RAG)

Som standard kommer RAG-indlejringer fra OpenAI. En **RAG: Brugerdefinerede indlejringer**-legitimationsoplysning peger på enhver OpenAI-kompatibel indlejrings-endpoint i stedet - Ollama, vLLM, Text Embeddings Inference, LM Studio, Together eller en hostet gateway - og angiver det vektorlager, den skriver til.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `embedding_base_url` | Endpoint-URL inklusive `/v1`-stien, f.eks. `http://localhost:11434/v1` |
| `embedding_api_key` | Valgfri. Lokale servere kræver typisk ingen nøgle |
| `embedding_model` | Modelnavn som endpoint forventer, f.eks. `nomic-embed-text` |
| `embedding_dimensions` | Vektorbredde som modellen returnerer (standard `1536`) |
| `embedding_request_dimensions` | Valgfri. Anmod endpoint om at returnere `embedding_dimensions` i stedet for modellens native bredde |
| `db_type` | `qdrant` eller `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant-forbindelse, påkrævet når `db_type` er `qdrant` |

### Noter

- **Qdrant accepterer ethvert dimensionsantal.** Hver collection oprettes med den bredde, denne legitimationsoplysning deklarerer, så Dimensions-feltet kan frit redigeres.
- **Postgres (pgvector) kræver præcis 1536 dimensioner.** Dens kolonne er en fast `vector(1536)`, så Dimensions-feltet er låst til 1536, og en legitimationsoplysning, der angiver en anden bredde, afvises ved gemning.
- **Forkortelse for pgvector.** Når lagret er Postgres, tilbyder dialogen *Anmod endpoint om at returnere 1536 dimensioner*. Dette sender `dimensions`-anmodningsparameteren, som modeller trænet med Matryoshka-repræsentationer (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` og lignende) respekterer ved at returnere en forkortet, men stadig meningsfuld vektor. Endpoints, der ikke understøtter parameteren, afviser anmodningen, og endpoints, der accepterer men ignorerer den, producerer en klar fejl, der angiver den faktisk returnerede bredde. Heym afkorter aldrig vektorer selv, da beskæring af output fra en ikke-Matryoshka-model forringer søgekvaliteten stille. Valget tilbydes ikke for Qdrant, som kan tilpasse en collection til enhver bredde.
- Brug **Test forbindelse** i legitimationsoplysningsdialogen til at indlejre en teststreng og se den bredde, modellen faktisk returnerer, før der oprettes et lager.
- `dimensions`-anmodningsparameteren sendes kun til OpenAI selv, da de fleste OpenAI-kompatible servere afviser ukendte parametre. Modellens native bredde valideres i stedet mod legitimationsoplysningen.
- De eksisterende **RAG: Qdrant + OpenAI** og **RAG: Psql + OpenAI**-legitimationsoplysninger forbliver uændrede og fortsætter med at virke.

### Anvendt af

- [RAG-node](../nodes/rag-node.md) (via vektorlager)
- [Vektorlager-fanen](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym kan også lagre vektorer **i sin egen Postgres-database** ved hjælp af [pgvector](https://github.com/pgvector/pgvector)-udvidelsen - ingen ekstern vektortjeneste kræves. Opret en **RAG: Psql + OpenAI**-legitimationsoplysning og brug den ved oprettelse af et vektorlager, vælg derefter **Postgres (pgvector)** i RAG-nodens Database-dropdown.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `openai_api_key` | OpenAI API-nøgle, der bruges til at generere indlejringer ved indeksering og søgning i dokumenter |

### Noter

- Ingen host/port er nødvendig - vektorer skrives til Heyms egen database; Heym forbinder aldrig til en anden database.
- Alle RAG-funktioner, der er tilgængelige med Qdrant (indsættelse, søgning, metadatalfiltre, Cohere-reranking, kloning, deling), fungerer identisk med Postgres-backend.
- Kræver `vector`-udvidelsen. Heym bevarer den officielle `postgres:16`-image uændret (så eksisterende data aldrig ændres) og **installerer automatisk `postgresql-16-pgvector`-pakken ved opstart** - `run.sh`, `deploy.sh` og `run_e2e.sh` håndterer alle dette. Installationen er ikke fatal: hvis den ikke kan køre (f.eks. ingen netværk), fortsætter Qdrant RAG med at virke, og Postgres-backend forbliver inaktiv (migrationen springer tabellen elegant over).
- Hvis den publicerede enkeltcontainer-image (`ghcr.io/heymrun/heym`) køres mod **en egen ekstern Postgres**, skal denne database understøtte `vector`-udvidelsen (Heym kan ikke installere den i en database, den ikke administrerer). Uden den returnerer oprettelse eller upload til et Postgres-vektorlager en klar besked, og Qdrant RAG fortsætter med at virke.

### Anvendt af

- [RAG-node](../nodes/rag-node.md) (via vektorlager)
- [Vektorlager-fanen](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) er en hybrid mellem regneark og database, der understøtter struktureret data og formler. Grist-legitimationsoplysningen gør det muligt for Heym at læse og skrive Grist-dokumenter.
### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `api_key` | Grist API-nøgle (findes under **Profil → API-nøgle** i Grist-instansen) |
| `server_url` | Basis-URL for Grist-serveren (f.eks. `https://docs.getgrist.com` for Grist Cloud, eller den selvhostede URL) |

### Bemærkninger

- [Grist-node](../nodes/grist-node.md) kræver **Document ID** (fra Grist-dokumentets URL) og **Table ID** i konfigurationen - disse er ikke en del af legitimationsoplysningerne.
- For selvhostet Grist skal `server_url` angives til instansens domæne.
- Kolonne-ID'er i Grist bruger understregninger (f.eks. `User_Name`), ikke visningsetiketter. Brug `listColumns`-operationen til at finde dem.

### Anvendt af

- [Grist-node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets-legitimationsoplysninger forbinder Heym til Google Sheets API ved hjælp af en OAuth2 "Bring Your Own App"-model. Der angives en Google Cloud OAuth2 Client ID og Client Secret, hvorefter adgang autoriseres via en browserpopup. Tokens opdateres automatisk i baggrunden.

### Opsætning

1. Åbn [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → søg efter og aktiver **Google Sheets API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstype **Web application**.
3. Tilføj under **Authorized redirect URIs**: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopier den genererede **Client ID** og **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → type **Google Sheets (OAuth2)**.
6. Indtast Client ID, Client Secret og et navn, klik derefter på **Connect** for at åbne Google-godkendelsespopup og autorisere adgang.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `client_id` | OAuth2 Client ID fra Google Cloud Console |
| `client_secret` | OAuth2 Client Secret fra Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) gemmes og opdateres automatisk - disse håndteres ikke direkte.

### Bemærkninger

- OAuth2-godkendelsesskærmen kræver spreadsheets-scope (`https://www.googleapis.com/auth/spreadsheets`).
- Heym bruger refresh-token til at hente nye access-tokens før de udløber (60-sekunders sikkerhedsmargin).
- Hvis Client Secret roteres i Google Cloud Console, skal legitimationsoplysningerne genoprettes via **Connect**-knappen.
- **Produktion:** Angiv backend **`FRONTEND_URL`** til den eksakte offentlige URL, som brugerne åbner i browseren (skema + host, f.eks. `https://heym.example.com`). Heym konstruerer Google OAuth-omdirigerings-URI'en udelukkende fra denne værdi - den stoler **ikke** på `Origin` eller `X-Forwarded-*`-headers (klientstyrede). Registrer `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` i Google Cloud Console.

### Anvendt af

- [Google Sheets-node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive-legitimationsoplysninger forbinder Heym til Google Drive API ved hjælp af samme OAuth2 "Bring Your Own App"-model som Google Sheets. Der angives en Google Cloud OAuth2 Client ID og Client Secret, hvorefter adgang autoriseres via en browserpopup. Tokens opdateres automatisk i baggrunden.

### Opsætning

1. Åbn [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → søg efter og aktiver **Google Drive API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstype **Web application**.
3. Tilføj under **Authorized redirect URIs**: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopier den genererede **Client ID** og **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → type **Google Drive (OAuth2)**.
6. Indtast Client ID, Client Secret og et navn, klik derefter på **Connect** for at åbne Google-godkendelsespopup og autorisere adgang.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `client_id` | OAuth2 Client ID fra Google Cloud Console |
| `client_secret` | OAuth2 Client Secret fra Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) gemmes og opdateres automatisk - disse håndteres ikke direkte.

### Scope

Google Drive anmoder om **fuld Drive-scope** (`https://www.googleapis.com/auth/drive`).

Dette er nødvendigt, fordi noden opererer på filer, der allerede ejes. Det smallere `drive.file`-scope giver kun adgang til filer, som OAuth-klienten selv har oprettet, hvilket ville gøre `listFolderFiles`, `updateFile`, `removeFile` og `removeFolder` blinde for eksisterende Drive-indhold.

Da der angives egen Client ID og Secret fra eget Google Cloud-projekt, gælder Googles app-verifikationskrav for dette scope for projektet, ikke for Heym.

### Bemærkninger

- Heym bruger refresh-token til at hente nye access-tokens før de udløber (60-sekunders sikkerhedsmargin).
- Hvis Client Secret roteres i Google Cloud Console, skal legitimationsoplysningerne genoprettes via **Connect**-knappen.
- Delte drev understøttes - noden angiver `supportsAllDrives` på hvert API-kald.
- **Produktion:** Angiv backend **`FRONTEND_URL`** til den eksakte offentlige URL, som brugerne åbner i browseren. Heym konstruerer Google OAuth-omdirigerings-URI'en udelukkende fra denne værdi - den stoler **ikke** på `Origin` eller `X-Forwarded-*`-headers. Registrer `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` i Google Cloud Console.
- Se [Credential Sharing](./credentials-sharing.md) før deling af disse legitimationsoplysninger med et team.

### Anvendt af

- [Google Drive-node](../nodes/google-drive-node.md)
## BigQuery (OAuth2)

BigQuery-legitimationsoplysningen forbinder Heym til Google BigQuery API'en ved brug af en OAuth2 "Bring Your Own App"-model. Der angives en Google Cloud OAuth2 Client ID og Client Secret, hvorefter adgang autoriseres via en browserpopup. Tokens opdateres automatisk i baggrunden.

### Opsætning

1. Åbn [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → søg efter og aktiver **BigQuery API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstype **Web application**.
3. Under **Authorized redirect URIs** tilføjes: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopier den genererede **Client ID** og **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → vælg **BigQuery (OAuth2)**.
6. Indtast Client ID, Client Secret og et navn, klik derefter på **Connect** for at åbne Google-godkendelsespopup'en og autorisere adgang.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `client_id` | OAuth2 Client ID fra Google Cloud Console |
| `client_secret` | OAuth2 Client Secret fra Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) gemmes og opdateres automatisk.

### Bemærkninger

- OAuth2-godkendelsesskærmen kræver BigQuery-scope (`https://www.googleapis.com/auth/bigquery`).
- **Produktion:** Angiv backend **`FRONTEND_URL`** til den offentlige URL. Registrer `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` i Google Cloud Console.

### Anvendt af

- [BigQuery-node](../nodes/bigquery-node.md)

---

## Supabase

Supabase-legitimationsoplysningen forbinder Heym til et Supabase-projekts PostgREST API, så workflows kan forespørge og ændre Postgres-understøttede tabeller.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `supabase_url` | Projektets basis-URL, f.eks. `https://your-project.supabase.co` |
| `supabase_key` | API-nøgle med adgang til måltabellerne |
| `supabase_schema` | Valgfrit standardskema (standard er `public`) |

### Bemærkninger

- [Supabase-node](../nodes/supabase-node.md) kommunikerer med `/rest/v1/<table>` og understøtter operatorfiltre (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in`, samt relaterede PostgREST-operatorer) plus nestede `or` / `and` logiske grupper.
- Ved skriveoperationer anbefales det at bruge en nøgle beregnet til serverbrug med de mindst nødvendige tabelrettigheder.
- Noder kan tilsidesætte skemaet pr. trin, selvom legitimationsoplysningen definerer et standardskema.

### Anvendt af

- [Supabase-node](../nodes/supabase-node.md)

## ClickHouse

ClickHouse-legitimationsoplysningen forbinder Heym til en ekstern ClickHouse-database via dens HTTP-grænseflade, så workflows kan køre SQL-, CRUD- og tælleoperationer mod OLAP-tabeller.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `host` | HTTP-værtsnavn uden skema, f.eks. `your-instance.clickhouse.cloud` |
| `port` | HTTP-grænsefladeport (`8443` for HTTPS, `8123` for HTTP) |
| `username` | ClickHouse-bruger (standard er `default`) |
| `password` | Brugeradgangskode (valgfri) |
| `database` | Måldatabase (standard er `default`) |
| `secure` | Brug HTTPS når `true` (påkrævet for ClickHouse Cloud) |

### Bemærkninger

- [ClickHouse-node](../nodes/clickhouse-node.md) bruger den officielle `clickhouse-connect` HTTP-klient og parametriserer filter- og værdibindinger.
- `update` og `remove` mappes til `ALTER TABLE ... UPDATE` og `DELETE FROM`, som er asynkrone ClickHouse-mutationer; begge kræver et filter.
- `upsert` udfører en `INSERT` og forudsætter en `ReplacingMergeTree`-tabel for merge-on-key-adfærd.
- Brug **Test connection** i legitimationsdialogboksen for at verificere rækkevidde.

### Anvendt af

- [ClickHouse-node](../nodes/clickhouse-node.md)

## Notion

Notion-legitimationsoplysningen understøtter enten et intern integrationstoken eller en OAuth-forbindelse til en offentlig integration. OAuth gør det muligt for hver bruger at autorisere en Notion-workspace fra Heym i stedet for manuelt at kopiere et token.

### Påkrævede felter

| Tilstand | Felt | Beskrivelse |
|------|-------|-------------|
| Internt token | `api_token` | Internt integrationstoken (`ntn_...`) |
| OAuth | `client_id` | Client ID fra en Notion-offentlig integration |
| OAuth | `client_secret` | Client Secret fra Notion-offentlig integration |

OAuth-callback'en gemmer `access_token`, `auth_mode`, `workspace_id`, `workspace_name` og `bot_id` automatisk. Ethvert tidligere internt `api_token` fjernes, når OAuth fuldføres. Registrer denne omdirigerings-URI i Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth-opsætningsflow

1. Vælg **OAuth** i legitimationsdialogboksen, indtast et navn, Client ID og Client Secret.
2. Klik på **Connect** og autoriser workspacet i Notion-popup'en.
   - For en **ny** legitimationsoplysning oprettes legitimationsposten, når der klikkes på **Connect**.
   - Fuldfør godkendelsen i popup'en, klik derefter på **Save** for at vende tilbage til legitimationslisten.
3. En forbundet legitimationsoplysning viser `connected (Workspace Name)` i listen. Afventende OAuth-legitimationsoplysninger viser `Not connected`, indtil godkendelsen er fuldført.

Brug **Test Connection** i legitimationsdialogboksen for at verificere enten et internt token eller en fuldført OAuth-godkendelse. Ved redigering bevares det gemte interne token, hvis tokenfeltet efterlades tomt.

Både interne tokens og OAuth-access-tokens er tilgængelige via `$credentials.CredentialName` til brugerdefinerede [HTTP](../nodes/http-node.md)-kald, der kræver et Notion-bærertoken.
### Noter

- Interne integrationer kræver, at de relevante sider, databaser og datakilder er delt.
- OAuth-brugere vælger workspace/sider under Notion-godkendelse.
- OAuth-applikationslegitimationsoplysninger krypteres i Notion-legitimationsoplysningerne. Callback'en genindlæser dem server-side; secret'en er ikke indlejret i OAuth-tilstanden.
- Tilsluttede OAuth-legitimationsoplysninger viser workspace-navnet; afventende OAuth-legitimationsoplysninger viser `Not connected`, indtil godkendelsen er fuldført.
- **Produktion:** Angiv backend **`FRONTEND_URL`** til den offentlige browser-URL (skema + host, ingen efterfølgende skråstreg). Notion-omdirigerings-URI'en skal matche nøjagtigt:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Noden anvender API-version `2026-03-11` og den aktuelle `data_source`-terminologi. Se [Notion-node](../nodes/notion-node.md#api-version-notes)-artiklen for vejledning til migrering fra ældre `archived`, `after` eller databaseforespørgselseksempler.
- Gamle søgefiltre med objektværdi `database` normaliseres til `data_source`.

### Anvendt af

- [Notion-node](../nodes/notion-node.md)

---

## SMTP (E-mail)

SMTP-legitimationsoplysningerne gemmer forbindelsesdetaljer til e-mailserveren for at sende udgående post.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `host` | SMTP-serverens hostname (f.eks. `smtp.gmail.com`) |
| `port` | SMTP-port (typisk `587` for STARTTLS, `465` for SSL) |
| `email` | Afsenderens e-mailadresse |
| `password` | SMTP-adgangskode eller App Password |

### Almindelige SMTP-udbydere

| Ubyder | Host | Port | Noter |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Kræver en [App Password](https://support.google.com/accounts/answer/185833) (2FA skal være aktiveret) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Brug Microsoft-kontooplysningerne |
| Mailgun | `smtp.mailgun.org` | `587` | Brug Mailgun SMTP-legitimationsoplysninger fra domæneindstillingerne |
| SendGrid | `smtp.sendgrid.net` | `587` | Brug `apikey` som brugernavn og en API-nøgle som adgangskode |
| Brugerdefineret / Selv-hostet | det relevante domæne | `587` / `465` | Postfix, Exim, osv. |

### Noter

- Gmail kræver en **App Password** i stedet for den almindelige adgangskode, når 2-trins-bekræftelse er aktiveret.
- Port `587` bruger STARTTLS (starter som ren tekst, opgraderer til TLS). Port `465` bruger implicit TLS (SSL fra starten).

### Anvendt af

- [Send Email-node](../nodes/send-email-node.md)

---

## IMAP (Indgående e-mail)

IMAP-legitimationsoplysningerne gemmer forbindelsesdetaljer for overvågning af en indbakke med [IMAP Trigger-node](../nodes/imap-trigger-node.md).

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `imap_host` | IMAP-serverens hostname (f.eks. `imap.gmail.com`) |
| `imap_port` | IMAP-port (`993` for SSL/TLS hos de fleste udbydere) |
| `imap_username` | Mailbox-brugernavn eller fuld e-mailadresse |
| `imap_password` | Adgangskode eller udbyder-specifik app-adgangskode |

### Valgfrie felter

| Felt | Beskrivelse |
|-------|-------------|
| `imap_mailbox` | Mailbox-mappe, der skal overvåges (standard: `INBOX`) |
| `imap_use_ssl` | Aktivér SSL/TLS (anbefales; standard: `true`) |

### Noter

- IMAP-triggeren baseliner den aktuelle mailbox ved første afstemning og behandler derefter kun nyere e-mails.
- Gmail, Microsoft 365 og andre hostede udbydere kræver ofte en **app-adgangskode** eller lignende IMAP-specifik secret.
- Vedhæftningsindhold hentes ikke ned i workflow-payload'en; Heym eksponerer kun vedhæftningsmetadata.

### Anvendt af

- [IMAP Trigger-node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP som workflow-trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) er en open source-messagebroker. RabbitMQ-legitimationsoplysningerne gemmer forbindelsesdetaljer til publicering og forbrug af køer og exchanges.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `rabbitmq_host` | AMQP-forbindelses-URL (f.eks. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-brugernavn (standard: `guest`) |
| `rabbitmq_password` | RabbitMQ-adgangskode (standard: `guest`) |

### Virtuelle hosts

For at forbinde til en specifik virtuel host skal den inkluderes i `rabbitmq_host`-URL'en:

```
amqp://username:password@hostname:5672/vhost
```

Hvis den standard vhost bruges, kan stien `/` udelades.

### Delayed Message Plugin

[RabbitMQ-node](../nodes/rabbitmq-node.md) understøtter **rabbitmq_delayed_message_exchange**-pluginet. Når dette plugin er aktiveret på RabbitMQ-serveren, kan der angives en forsinkelse (i millisekunder) på udgående beskeder ved at bruge `rabbitmqDelayMs`-feltet på noden.

Noden sætter `x-delay`-headeren på den publicerede besked. Exchange-typen skal være `x-delayed-message` for at forsinkelser træder i kraft.

For at aktivere pluginet på en selv-hostet RabbitMQ-instans:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Når pluginet ikke er installeret, ignoreres `x-delay`-headeren, og beskeder leveres med det samme.

### Anvendt af

- [RabbitMQ-node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ som workflow-trigger)

---

## Amazon S3

Amazon S3-legitimationsoplysningerne forbinder Heym til [Amazon S3](https://aws.amazon.com/s3/). Brug dem med [Amazon S3-node](../nodes/amazon-s3-node.md) til at administrere buckets og mapper, uploade og downloade objekter, kopiere nøgler samt liste eller slette objekter fra workflows.
### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key ID |
| `aws_secret_access_key` | Hemmelig access key der parres med access key ID |
| `aws_region` | AWS-region hvor buckets er placeret (f.eks. `us-east-1`) |

### Valgfrie felter

| Felt | Beskrivelse |
|-------|-------------|
| `aws_session_token` | Midlertidig session token ved brug af AWS STS-legitimationsoplysninger |

### Bemærkninger

- Legitimationsoplysningerne bruger standard AWS SigV4-autentificering via boto3.
- Upload-operationer sender i øjeblikket UTF-8-tekstindhold; downloads kan returnere tekst eller base64 for binære objekter.

### Anvendt af

- [Amazon S3-node](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) er en in-memory nøgle-værdi-database brugt til caching og hurtig dataadgang.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `host` | Redis-serverens hostname eller IP (f.eks. `localhost`) |
| `port` | Redis-port (standard: `6379`) |
| `password` | Redis-adgangskode (lad være tom, hvis ikke angivet) |

### Anvendt af

- [Redis-node](../nodes/redis-node.md)

---

## Slack

Slack-legitimationsoplysningerne gemmer en **Incoming Webhook URL** til at poste beskeder til Slack-kanaler.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (fra Slack-appkonfigurationen) |

### Bemærkninger

- Opret en Incoming Webhook på [api.slack.com/apps](https://api.slack.com/apps) → den relevante app → **Incoming Webhooks**.
- Hver webhook er begrænset til en specifik kanal. Opret flere legitimationsoplysninger for forskellige kanaler.

### Anvendt af

- [Slack-node](../nodes/slack-node.md)

---

## Telegram

Telegram-legitimationsoplysningerne gemmer en **Bot Token** og en valgfri **Webhook Secret Token** til bot-baserede workflows.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `bot_token` | Telegram Bot API token fra BotFather |

### Valgfrie felter

| Felt | Beskrivelse |
|-------|-------------|
| `secret_token` | Delt hemmelighed der verificeres mod `x-telegram-bot-api-secret-token` på indgående webhooks |

### Bemærkninger

- Brug de samme legitimationsoplysninger til både [Telegram Trigger](../nodes/telegram-trigger-node.md) og [Telegram](../nodes/telegram-node.md).
- Registrer webhook manuelt med Telegrams `setWebhook` API ved hjælp af URL'en vist i Telegram Trigger-node-panelet.
- `chatId` i Telegram-noden kan være en direkte ID eller et udtryk som `$telegramEvent.message.chat.id`.

### Anvendt af

- [Telegram Trigger-node](../nodes/telegram-trigger-node.md)
- [Telegram-node](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Disse legitimationsoplysninger bruges af [HTTP-node](../nodes/http-node.md) til at autentificere udgående anmodninger.

### Bearer

Tilføjer en `Authorization: Bearer <token>` header til HTTP-anmodninger.

| Felt | Beskrivelse |
|-------|-------------|
| `token` | Bearer token-værdien |

### Header

Tilføjer en brugerdefineret header til HTTP-anmodninger.

| Felt | Beskrivelse |
|-------|-------------|
| `header_key` | Header-navn (f.eks. `X-Api-Key`) |
| `header_value` | Header-værdi |

Begge typer kan også refereres via `$credentials.CredentialName` i [Expression DSL](./expression-dsl.md) til dynamisk brug i enhver node, der accepterer udtryk.

### Anvendt af

- [HTTP-node](../nodes/http-node.md)

---

## LLM-leverandører (OpenAI, Google, Custom, Cohere)

Disse legitimationsoplysninger bruges af AI-noder.

| Type | Beskrivelse |
|------|-------------|
| **OpenAI** | API-nøgle til GPT-modeller og OpenAI-embeddings |
| **Google** | API-nøgle til Gemini-modeller |
| **Custom** | API-nøgle + base URL til OpenAI-kompatible endpoints (Ollama, vLLM, LM Studio osv.) |
| **Cohere** | API-nøgle til Cohere-embeddings |

### OpenAI Prompt-caching

OpenAI cacher automatisk den statiske (uændrede) præfiks af system-prompten - ingen ekstra konfiguration nødvendig. Gentagne workflow-kørsler, der deler den samme system-prompt-præfiks, drager fordel af cached token-priser, hvilket reducerer både omkostninger og ventetid. Dette er særligt nyttigt, når der er lange, faste instruktioner, og kun brugerbeskeden ændres mellem kørsler. Overvåg cache-hit-rater og token-besparelser i [Kørsler-fanen](../tabs/traces-tab.md) eller OpenAI's brugsdashboard for at optimere prompt-strukturen for maksimal cache-genbrug.

### Anvendt af

- [LLM-node](../nodes/llm-node.md)
- [Agent-node](../nodes/agent-node.md)
- [RAG-node](../nodes/rag-node.md) (OpenAI-embeddings via Qdrant-legitimationsoplysninger)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) er en proxy-server til at omgå Cloudflare og lignende bot-beskyttelsesudfordringer.

### Påkrævede felter

| Felt | Beskrivelse |
|-------|-------------|
| `flaresolverr_url` | URL til FlareSolverr-instansen (f.eks. `http://localhost:8191`) |

Loopback- og private adresser understøttes her, så kørsel af FlareSolverr ved siden af Heym fungerer som dokumenteret. URL'en må ikke pege på en link-lokal eller cloud-metadata-adresse. Da private adresser er tilladt, kan dette felt også pege på en anden intern tjeneste, og svaret returneres i node-outputtet. Enhver bruger, der er logget ind, kan oprette denne legitimationsoplysning, så grænsen er, hvem der må redigere workflows plus netværksreglerne, ikke deling af legitimationsoplysninger. Se [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Anvendt af

- [Crawler-node](../nodes/crawler-node.md)
## Relateret

- [Legitimationsoplysninger](./credentials.md) – Oversigt over legitimationsoplysninger og hvordan noder anvender dem  
- [Faneblad for legitimationsoplysninger](../tabs/credentials-tab.md) – Tilføj og administrer legitimationsoplysninger  
- [Deling af legitimationsoplysninger](./credentials-sharing.md) – Del legitimationsoplysninger med brugere og teams  
- [Sikkerhed](./security.md) – Kryptering ved opbevaring, adgangskontrol  
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntaks til dynamisk adgang  

---

## Model Router (Auto Model)

Dirigerer hver anmodning til en af de eksisterende model-legitimationsoplysninger ved at anvende en beslutningsmodel til valg. Den lagrer referencer, aldrig en egen nøgle.

### Påkrævede felter

- `decision_credential_id` – En **Decision Model**-legitimationsoplysning, der er tilgængelig.  
- `decision_model` – Modellen, der foretager routing-opkaldet, f.eks. `jev-latest`.  
- `options` – Mindst to indgange, hver med et navn, en af OpenAI/Google/Custom-legitimationsoplysningerne, en model på den og kriterier for, hvornår den skal vælges.  

### Valgfrie felter

- `routing_instructions` – Hvordan optionerne skal vægtes samlet set.  
- En option kan markeres som fallback, der anvendes, hvis routing fejler.  

### Bemærkninger

Option-navne er, hvad beslutningsmodellen vælger imellem, så de skal være unikke. En option kan ikke pege på en anden Model Router.
