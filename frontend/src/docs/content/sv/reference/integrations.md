# Tredjepartsintegrationer

Heym ansluter till externa tjänster via **autentiseringsuppgifter**. Varje typ av autentiseringsuppgift lagrar anslutningsinformationen för en tjänst och kan återanvändas i flera noder och workflows. Se [Autentiseringsuppgifter](./credentials.md) för en översikt.

Autentiseringsuppgifter läggs till i [Inställningar → Autentiseringsuppgifter](../tabs/credentials-tab.md). Alla värden krypteras i vila. Autentiseringsuppgifter kan [delas](./credentials-sharing.md) med andra användare eller [Team](./teams.md).

Vissa integrationsnoder kräver **inte** autentiseringsuppgifter. [WebSocket Trigger](../nodes/websocket-trigger-node.md) och [WebSocket Send](../nodes/websocket-send-node.md) ansluter till externa sockets med hjälp av URL, headers och subprotokoll som konfigureras direkt på noden.

## Typer av autentiseringsuppgifter i korthet

| Typ | Används av | Nyckelfält |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, valfritt `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, valfritt `base_url` |
| **Jira** | [Jira-nod](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (endast Basic auth), valfritt `api_version` |
| **Linear** | [Linear-nod](../nodes/linear-node.md) | `api_key`, eller `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry-nod](../nodes/sentry-node.md) | `api_token`, valfritt `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Utvärdering](../tabs/evals-tab.md) (LLM-as-Judge-domare) | `base_url`, valfritt `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI-standardvärden | en Decision Model-autentiseringsuppgift, plus modellalternativ som refererar till övriga autentiseringsuppgifter |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorlager | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorlager | `openai_api_key` (vektorer lagras i Heyms egen Postgres via pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorlager | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, valfritt `embedding_api_key`, samt `qdrant_host` när `db_type` är `qdrant` |
| **Grist** | [Grist-nod](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets-nod](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2-samtycke |
| **Google Drive** | [Google Drive-nod](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2-samtycke (full Drive-behörighet) |
| **BigQuery** | [BigQuery-nod](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2-samtycke |
| **Supabase** | [Supabase-nod](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, valfritt `supabase_schema` |
| **ClickHouse** | [ClickHouse-nod](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion-nod](../nodes/notion-node.md) | `api_token`, eller `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3-nod](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger-nod](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger-nod](../nodes/telegram-trigger-node.md), [Telegram-nod](../nodes/telegram-node.md) | `bot_token`, valfritt `secret_token` |
| **Discord** | [Discord-nod](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger-nod](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ-nod](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis-nod](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack-nod](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger-nod](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP-nod](../nodes/http-node.md) | `token` |
| **Header** | [HTTP-nod](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler-nod](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub-autentiseringsuppgiften lagrar en GitHub personal access token (PAT) så att workflows kan anropa GitHub REST API via [GitHub-noden](../nodes/github-node.md), skicka token till MCP-servrar som `@modelcontextprotocol/server-github`, eller använda den från [HTTP-noden](../nodes/http-node.md) för anpassade REST-anrop.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` fine-grained PAT eller klassisk `ghp_...` PAT) |
### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `base_url` | GitHub API-bas-URL för GitHub Enterprise Server (till exempel `https://github.example.com/api/v3`) |

### Anmärkningar

- Finkorniga personliga åtkomsttoken rekommenderas när det är möjligt, eftersom de kan begränsas till specifika repon och behörigheter.
- Lämna `base_url` tomt för GitHub.com. För GitHub Enterprise Server används den fullständiga REST API-
  endpointen inklusive `/api/v3` (till exempel `https://github.example.com/api/v3`), inte
  serverns webbgränssnittsrot såsom `https://github.example.com`.
- Denna autentiseringsuppgift modellerar för närvarande endast PAT-baserad autentisering. För att komma åt organisationsrepon används en PAT som har beviljats de nödvändiga organisation-/repobehörigheterna.
- Installationstoken för GitHub App och installationsflöden för GitHub App är inte förstklassiga i Heym-gränssnittet i dag.
- Föredra [GitHub-noden](../nodes/github-node.md) för inbyggda repo-, användar-, ärende-, pull request-, gransknings-, release-, Actions workflow-, trafik- och filoperationer. Använd [HTTP-noden](../nodes/http-node.md) endast när endpoints eller payloads behövs som GitHub-noden inte täcker.
- Använd [Agent-noden](../nodes/agent-node.md) med MCP genom att skicka `$credentials.YourGitHubCredential` till en MCP-anslutningsmiljövariabel såsom `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHubs REST API förväntar sig vanligtvis `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Vid redigering av en GitHub-autentiseringsuppgift bevarar ett tomt GitHub Enterprise `base_url` den
  befintliga endpointen. Ange en ny URL endast när denna endpoint ska ändras.

### Används av

- [GitHub-noden](../nodes/github-node.md)
- [Codex-noden](../nodes/codex-node.md)
- [Agent-noden](../nodes/agent-node.md)
- [HTTP-noden](../nodes/http-node.md)

---

## Decision Model

En decision model besvarar typade frågor om ett tillstånd och returnerar sannolikheter istället för text. TypeSafe's Jev är referensimplementationen; vilken endpoint som helst som accepterar samma `{model, state, questions}`-body fungerar, och [Decision](../nodes/decision-node.md)-noden kan skicka en handskriven body för en som inte gör det.

### Obligatoriska fält

- `base_url` – endpointen, till exempel `https://api.typesafe.ai`. Heym lägger till `/v1/systemone`.

### Valfria fält

- `api_key` – skickas som `Authorization: Bearer`. Endpoints som inte behöver någon nyckel kan lämna detta tomt.

### Anmärkningar

- **Test Connection** skickar en liten fråga för att bekräfta att endpointen och nyckeln fungerar.
- Vid redigering av en autentiseringsuppgift bevaras den lagrade nyckeln när nyckelfältet lämnas tomt.
- Utgående förfrågningar till privata och loopback-adresser blockeras som standard, så en självhostad endpoint på `localhost` eller ett privat intervall kräver `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Dessa modeller saknas i de LLM-pristabeller som Heym synkroniserar, så kolumnen Kostnad i [Körningar](../tabs/traces-tab.md) förblir tom. Tokenantal registreras fortfarande.

### Används av

- [Decision](../nodes/decision-node.md)
- [Utvärdering](../tabs/evals-tab.md) – poängsätter `LLM-as-Judge`-svar mot förväntad utdata

## OpenAI Codex

Autentiseringsuppgiften OpenAI Codex autentiserar [Codex-noden](../nodes/codex-node.md). Den är separat från autentiseringsuppgiften för OpenAI API-nyckeln som används av LLM-, Agent- och RAG-noder.

### Autentiseringslägen

| Läge | Beskrivning |
|------|-------------|
| **Sign in with ChatGPT** (rekommenderas) | OAuth (PKCE)-inloggning som använder ChatGPT Plus/Pro-prenumerationen, så körningar undviker kostnader per token via API. Heym lagrar och uppdaterar automatiskt token-paketet. |
| **Access token** | En ChatGPT/Codex `access_token` som endast skickas till den lokala Codex CLI-processen. |

### Anmärkningar

- API-nycklar avvisas för denna autentiseringsuppgiftstyp.
- Codex-token exponeras inte via `$credentials.Name`.
- Codex-noden behöver också en GitHub-autentiseringsuppgift för repo-kloning, branch-push och skapande av draft PR.

### Används av

- [Codex-noden](../nodes/codex-node.md)

## OpenCode Go

Autentiseringsuppgiften OpenCode Go autentiserar [OpenCode Go-noden](../nodes/opencode-go-node.md). Den lagrar en API-nyckel för OpenCode Go-gatewayen (från [opencode.ai/go](https://opencode.ai/go)) och en valfri bas-URL för gatewayen.

### Fält

| Fält | Beskrivning |
|-------|-------------|
| **API Key** | API-nyckel för OpenCode Go-gatewayen (obligatorisk). |
| **Gateway Base URL** | Valfri; standardvärdet är `https://opencode.ai/zen/go/v1`. Åsidosätt endast för en självhostad eller proxad gateway. |

### Anmärkningar

- API-nyckeln skickas endast till OpenCode CLI-processen inuti en härdad container.
- OpenCode Go-noden behöver också en GitHub-autentiseringsuppgift för repo-kloning, branch-push och skapande av pull request. GitHub-token placeras aldrig inuti sandbox-containern.

### Används av

- [OpenCode Go-noden](../nodes/opencode-go-node.md)

---

## Linear

Autentiseringsuppgiften Linear stöder antingen en personlig API-nyckel eller OAuth2 för
[Linear-noden](../nodes/linear-node.md). Heym skickar inbyggda GraphQL-frågor till Linear för workspace-
metadata, projekt, ärenden och kommentarer.
### Konfiguration

Välj ett autentiseringsläge:

**Personlig API-nyckel**

1. Öppna **Settings → Security & Access → Personal API keys** i Linear.
2. Skapa en nyckel med åtkomst till den workspace som ska automatiseras.
3. Klistra in nyckeln i en Linear-autentiseringsuppgift i Heym och använd **Test Connection** för att verifiera den.

**OAuth2**

1. Skapa ett Linear OAuth-program.
2. Registrera `{FRONTEND_URL}/api/credentials/linear/oauth/callback` som redirect-URI.
3. I Heym Dashboard → **Credentials** → **New** → typ **Linear**.
4. Välj **OAuth2**, ange Client ID och Client Secret och klicka sedan på **Connect**.

### Obligatoriska fält

| Läge | Fält | Beskrivning |
|------|-------|-------------|
| Personlig API-nyckel | `api_key` | Personlig API-nyckel för Linear, vanligtvis med prefixet `lin_api_` |
| OAuth2 | `client_id` | Client ID från Linear OAuth-programmet |
| OAuth2 | `client_secret` | Client Secret från Linear OAuth-programmet |

OAuth-token (`access_token`, `refresh_token`, `token_expiry`) lagras och förnyas automatiskt.

### Anmärkningar

- Personliga API-nycklar och OAuth-token agerar som den Linear-användare som skapade eller auktoriserade dem.
- Linear OAuth använder scope `read,write,issues:create,comments:create`.
- Använd **Test Connection** i autentiseringsdialogen för att verifiera API-nyckeln eller OAuth-token mot Linear API.
- Använd List Teams och List Projects i Linear-noden för att hitta UUID:er innan ärenden skapas eller filtreras.
- Använd List Workflow States och List Team Members för att hitta UUID:er för status och tilldelad person vid uppdateringar.
- Rotera en API-nyckel genom att redigera autentiseringsuppgiften och ange det nya värdet. Om OAuth-appens hemligheter roteras måste autentiseringsuppgiften återanslutas via **Connect**.

### Används av

- [Linear-nod](../nodes/linear-node.md)

---

## Jira

Jira-autentiseringsuppgiften lagrar Jira Basic auth-uppgifter eller en personlig åtkomsttoken för Data Center, bas-URL för Jira-sajten, distributionsläge och valfri REST API-version för [Jira-noden](../nodes/jira-node.md). Använd `cloud` för Jira Cloud eller `data_center` för Jira Data Center / Server.

### Konfiguration

**Jira Cloud**

1. Skapa en API-token i Atlassians kontoinställningar.
2. I Heym Dashboard → **Credentials** → **New** → typ **Jira**.
3. Ange Atlassian-e-postadress, API-token och Jira-sajtens URL, till exempel `https://your-domain.atlassian.net`.
4. Använd **Test Connection** för att verifiera autentiseringsuppgiften.

**Jira Data Center / Server**

1. Välj **Jira Data Center / Server** som distribution.
2. Välj en autentiseringsmetod. **Användarnamn och lösenord** använder Basic auth. **Personal Access Token** använder `Authorization: Bearer <token>` och kräver Jira Data Center / Server 8.14 eller senare. Skapa token under **Profil → Personal Access Tokens** i Jira.
3. Ange användarnamn och lösenord för Jira, eller klistra in personlig åtkomsttoken (inget användarnamn krävs).
4. Ange webbadressen till Jira-webbplatsen, till exempel `https://jira.example.com`.
5. Använd **Test Connection** för att verifiera autentiseringsuppgiften.

### Fält

| Fält | Beskrivning |
| --- | --- |
| `auth_mode` | `basic` (standard om det saknas) eller `pat`. `pat` är endast giltigt med `data_center` |
| `email` | E-post för Jira Cloud Atlassian-konto eller användarnamn för Jira Data Center / Server. Används inte i läget `pat` |
| `api_token` | Jira Cloud Atlassian API-token, lösenord för Jira Data Center / Server för Basic auth eller personlig åtkomsttoken för Data Center i `pat`-läget |
| `base_url` | Bas-URL för Jira-sajten |
| `deployment` | `cloud` för Jira Cloud eller `data_center` för Jira Data Center / Server |
| `api_version` | REST API-version; standardvärdet är `3` för Jira Cloud. Data Center / Server använder v2 |

### Anmärkningar

- Jira-noden skickar ärendebeskrivningar och kommentarer som Atlassian Document Format-textdokument
  för Jira Cloud REST API v3. Autentiseringsuppgifter för Data Center / Server skickar vanlig text.
- Data Center / Server stöder Basic auth med användarnamn/lösenord och autentisering med personlig åtkomsttoken (PAT) med Bearer-schemat. PAT-autentisering kräver Jira Data Center / Server 8.14 eller senare.
- Uppladdning av bilagor accepterar base64- eller data URL-innehåll och omfattas av plattformens filstorleksgräns (standard 99 MB). Nedladdning av bilagor kan returnera base64-innehåll när det är aktiverat.
- Skapande och borttagning av användare samt ärendenotifieringar kräver att det autentiserade Jira-kontot har relevanta behörigheter för Jira-sajten eller organisationen.
- Använd List Projects, Search Issues och List Transitions för att hitta projektnycklar, ärendenycklar och övergångs-ID:n.
- För anpassade endpoints som inte täcks av Jira-noden använder du [HTTP-noden](../nodes/http-node.md) med Jira Basic Auth (`email:api_token` för Cloud eller `username:password` för Data Center / Server) eller PAT Bearer auth (`Authorization: Bearer <token>` för Data Center / Server). Alternativt kan du använda en Header-autentiseringsuppgift med lämplig `Authorization`-header.

Se även:

- [Jira-nod](../nodes/jira-node.md)
- [Autentiseringsuppgifter](./credentials.md)

---

## Sentry

Sentry-autentiseringsuppgiften lagrar en auth-token för [Sentry-noden](../nodes/sentry-node.md). Heym använder Sentrys REST API för operationer som rör organisationer, projekt, team, ärenden, händelser och releaser.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `api_token` | Sentry auth-token med åtkomst till de organisationer och projekt som automatiseras |

### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `base_url` | Valfri rot-URL för självhostad Sentry, till exempel `https://sentry.example.com` |

### Anmärkningar

- Lämna `base_url` tomt för Sentry SaaS.
- Använd **Test Connection** för att bekräfta att token kan lista synliga organisationer.
- För anpassade REST-anrop används `$credentials.YourSentryCredential` som bearer-token.

### Används av

- [Sentry-nod](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) är en öppen källkodsbaserad vektordatabas som används för semantisk sökning och RAG (Retrieval Augmented Generation).

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `qdrant_host` | Fullständig URL till Qdrant-instansen (t.ex. `http://localhost:6333` eller en cloud-endpoint) |
| `openai_api_key` | OpenAI API-nyckel som används för att generera embeddings vid indexering och sökning av dokument |
### Anmärkningar

- Qdrant-samlingar hanteras från fliken [Vektorlager](../tabs/vectorstores-tab.md). Varje vektorlager mappas till en Qdrant-samling.
- [RAG-noden](../nodes/rag-node.md) använder ett vektorlager (som refererar till en Qdrant-autentiseringsuppgift) — den refererar inte till autentiseringsuppgiften direkt.
- Om Qdrant-instansen kräver en API-nyckel inkluderas den i värdet för `qdrant_host` eller så konfigureras Qdrant i enlighet med detta; den nuvarande integrationen har inget separat fält för Qdrant API-nyckel.
- Självhostad Qdrant: använd den [officiella Docker-avbildningen](https://hub.docker.com/r/qdrant/qdrant) och exponera port `6333`.

### Används av

- [RAG-noden](../nodes/rag-node.md) (via vektorlager)
- [Fliken Vektorlager](../tabs/vectorstores-tab.md)

## Anpassade inbäddningar (RAG)

Som standard kommer RAG-inbäddningar från OpenAI. En autentiseringsuppgift av typen **RAG: Custom Embeddings** pekar i stället mot valfri OpenAI-kompatibel inbäddnings-endpoint — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together eller en hostad gateway — och anger vilket vektorlager den skriver till.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `embedding_base_url` | Endpoint-URL inklusive sökvägen `/v1`, t.ex. `http://localhost:11434/v1` |
| `embedding_api_key` | Valfritt. Lokala servrar kräver vanligtvis ingen nyckel |
| `embedding_model` | Modellnamn så som endpointen förväntar sig det, t.ex. `nomic-embed-text` |
| `embedding_dimensions` | Vektorbredd som modellen returnerar (standard `1536`) |
| `embedding_request_dimensions` | Valfritt. Begär att endpointen returnerar `embedding_dimensions` i stället för modellens ursprungliga bredd |
| `db_type` | `qdrant` eller `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant-anslutning, krävs när `db_type` är `qdrant` |

### Anmärkningar

- **Qdrant accepterar valfritt antal dimensioner.** Varje samling skapas med den bredd som denna autentiseringsuppgift anger, så fältet Dimensions är fritt redigerbart.
- **Postgres (pgvector) kräver exakt 1536 dimensioner.** Dess kolumn är en fast `vector(1536)`, så fältet Dimensions är låst till 1536 och en autentiseringsuppgift som anger någon annan bredd avvisas vid sparande.
- **Förkortning för pgvector.** När lagret är Postgres erbjuder dialogen *Ask the endpoint to return 1536 dimensions*. Detta skickar begärandeparametern `dimensions`, vilket modeller tränade med Matryoshka-representationer (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` och liknande) följer genom att returnera en förkortad, fortfarande meningsfull vektor. Endpoints som inte stöder parametern avvisar begäran, och endpoints som accepterar men ignorerar den producerar ett tydligt fel som anger den bredd som faktiskt returnerades. Heym trunkerar aldrig vektorer själv, eftersom en beskärning av utdata från en icke-Matryoshka-modell försämrar sökkvaliteten tyst. Alternativet erbjuds inte för Qdrant, som kan dimensionera en samling till valfri bredd.
- Använd **Test Connection** i autentiseringsdialogen för att bädda in en teststräng och se vilken bredd modellen faktiskt returnerar innan ett lager skapas.
- Begärandeparametern `dimensions` skickas endast till OpenAI självt, eftersom de flesta OpenAI-kompatibla servrar avvisar okända parametrar. Modellens ursprungliga bredd valideras i stället mot autentiseringsuppgiften.
- De befintliga autentiseringsuppgifterna **RAG: Qdrant + OpenAI** och **RAG: Psql + OpenAI** är oförändrade och fortsätter att fungera.

### Används av

- [RAG-noden](../nodes/rag-node.md) (via vektorlager)
- [Fliken Vektorlager](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym kan även lagra vektorer **i sin egen Postgres-databas** med hjälp av tillägget [pgvector](https://github.com/pgvector/pgvector) — ingen extern vektortjänst krävs. Skapa en autentiseringsuppgift av typen **RAG: Psql + OpenAI** och använd den när ett vektorlager skapas, välj sedan **Postgres (pgvector)** i RAG-nodens rullgardinsmeny Database.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `openai_api_key` | OpenAI API-nyckel som används för att generera inbäddningar vid indexering och sökning av dokument |

### Anmärkningar

- Ingen host/port behövs — vektorer skrivs till Heyms egen databas; Heym ansluter aldrig till en annan databas.
- Alla RAG-funktioner som är tillgängliga med Qdrant (infogning, sökning, metadatafilter, Cohere-omrankning, kloning, delning) fungerar identiskt med Postgres-backenden.
- Kräver tillägget `vector`. Heym håller den officiella avbildningen `postgres:16` oförändrad (så befintlig data berörs aldrig) och **installerar automatiskt paketet `postgresql-16-pgvector` vid start** — `run.sh`, `deploy.sh` och `run_e2e.sh` hanterar alla detta. Installationen är icke-fatal: om den inte kan köras (t.ex. utan nätverk) fortsätter Qdrant RAG att fungera och Postgres-backenden förblir inaktiv (migreringen hoppar över tabellen på ett smidigt sätt).
- Om den publicerade enkelcontainer-avbildningen (`ghcr.io/heymrun/heym`) körs mot **en egen extern Postgres** måste den databasen stödja tillägget `vector` (Heym kan inte installera det i en databas som det inte hanterar). Utan det returnerar skapande av eller uppladdning till ett Postgres-vektorlager ett tydligt meddelande och Qdrant RAG fortsätter att fungera.

### Används av

- [RAG-noden](../nodes/rag-node.md) (via vektorlager)
- [Fliken Vektorlager](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) är en hybrid av kalkylblad och databas som stöder strukturerad data och formler. Med Grist-autentiseringsuppgiften kan Heym läsa och skriva Grist-dokument.
### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `api_key` | Grist API-nyckel (finns under **Profile → API Key** i Grist-instansen) |
| `server_url` | Bas-URL till Grist-servern (t.ex. `https://docs.getgrist.com` för Grist Cloud, eller den egna URL:en för självhostad Grist) |

### Anmärkningar

- [Grist-noden](../nodes/grist-node.md) kräver **Document ID** (från Grist-dokumentets URL) och **Table ID** i sin konfiguration — dessa ingår inte i autentiseringsuppgifterna.
- För självhostad Grist anges `server_url` till instansens domän.
- Kolumn-ID:n i Grist använder understreck (t.ex. `User_Name`), inte visningsetiketter. Använd operationen `listColumns` för att hitta dem.

### Används av

- [Grist-noden](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Autentiseringsuppgifterna för Google Sheets ansluter Heym till Google Sheets API med hjälp av OAuth2-modellen "Bring Your Own App". En Google Cloud OAuth2 Client ID och Client Secret anges, varefter åtkomst auktoriseras via en webbläsar-popup. Tokens förnyas automatiskt i bakgrunden.

### Konfiguration

1. Öppna [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → sök efter och aktivera **Google Sheets API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstyp **Web application**.
3. Under **Authorized redirect URIs** läggs följande till: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopiera den genererade **Client ID** och **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → typ **Google Sheets (OAuth2)**.
6. Ange Client ID, Client Secret och ett namn, klicka sedan på **Connect** för att öppna Googles samtyckes-popup och auktorisera åtkomst.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `client_id` | OAuth2 Client ID från Google Cloud Console |
| `client_secret` | OAuth2 Client Secret från Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) lagras och förnyas automatiskt — de hanteras inte manuellt.

### Anmärkningar

- Googles OAuth2-samtyckesskärm kräver scopet för spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym använder refresh-token för att hämta nya access-tokens innan de löper ut (60 sekunders säkerhetsmarginal).
- Om Client Secret roteras i Google Cloud Console måste autentiseringsuppgifterna återanslutas via knappen **Connect**.
- **Produktion:** Ange backend-**`FRONTEND_URL`** till den exakta publika URL som användare öppnar i webbläsaren (scheme + host, t.ex. `https://heym.example.com`). Heym bygger Googles OAuth-redirect-URI enbart från detta värde — `Origin` eller `X-Forwarded-*`-huvuden (som kontrolleras av klienten) används **inte**. Registrera `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` i Google Cloud Console.

### Används av

- [Google Sheets-noden](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Autentiseringsuppgifterna för Google Drive ansluter Heym till Google Drive API med samma OAuth2-modell "Bring Your Own App" som för Google Sheets. En Google Cloud OAuth2 Client ID och Client Secret anges, varefter åtkomst auktoriseras via en webbläsar-popup. Tokens förnyas automatiskt i bakgrunden.

### Konfiguration

1. Öppna [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → sök efter och aktivera **Google Drive API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstyp **Web application**.
3. Under **Authorized redirect URIs** läggs följande till: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopiera den genererade **Client ID** och **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → typ **Google Drive (OAuth2)**.
6. Ange Client ID, Client Secret och ett namn, klicka sedan på **Connect** för att öppna Googles samtyckes-popup och auktorisera åtkomst.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `client_id` | OAuth2 Client ID från Google Cloud Console |
| `client_secret` | OAuth2 Client Secret från Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) lagras och förnyas automatiskt — de hanteras inte manuellt.

### Scope

Google Drive begär **full Drive-scope** (`https://www.googleapis.com/auth/drive`).

Detta krävs eftersom noden arbetar med filer som redan ägs av användaren. Det snävare scopet `drive.file` ger endast åtkomst till filer som OAuth-klienten själv har skapat, vilket skulle innebära att `listFolderFiles`, `updateFile`, `removeFile` och `removeFolder` inte ser något av det befintliga Drive-innehållet.

Eftersom Client ID och Client Secret tillhandahålls från ett eget Google Cloud-projekt gäller Googles appverifieringskrav för detta scope det egna projektet, inte Heym.

### Anmärkningar

- Heym använder refresh-token för att hämta nya access-tokens innan de löper ut (60 sekunders säkerhetsmarginal).
- Om Client Secret roteras i Google Cloud Console måste autentiseringsuppgifterna återanslutas via knappen **Connect**.
- Delade enheter (shared drives) stöds — noden anger `supportsAllDrives` vid varje API-anrop.
- **Produktion:** Ange backend-**`FRONTEND_URL`** till den exakta publika URL som användare öppnar i webbläsaren. Heym bygger Googles OAuth-redirect-URI enbart från detta värde — `Origin` eller `X-Forwarded-*`-huvuden används **inte**. Registrera `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` i Google Cloud Console.
- Se [Credential Sharing](./credentials-sharing.md) innan dessa autentiseringsuppgifter delas med ett team.

### Används av

- [Google Drive-noden](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Autentiseringsuppgiften för BigQuery ansluter Heym till Google BigQuery API med hjälp av en OAuth2-modell av typen "Bring Your Own App". En Google Cloud OAuth2 Client ID och Client Secret anges, varefter åtkomst auktoriseras via en webbläsar-popup. Tokens uppdateras automatiskt i bakgrunden.

### Konfiguration

1. Öppna [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → sök efter och aktivera **BigQuery API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → applikationstyp **Web application**.
3. Under **Authorized redirect URIs**, lägg till: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopiera den genererade **Client ID** och **Client Secret**.
5. I Heym Dashboard → **Credentials** → **New** → typ **BigQuery (OAuth2)**.
6. Ange Client ID, Client Secret och ett namn, klicka sedan på **Connect** för att öppna Googles samtyckes-popup och auktorisera åtkomst.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `client_id` | OAuth2 Client ID från Google Cloud Console |
| `client_secret` | OAuth2 Client Secret från Google Cloud Console |

Tokens (`access_token`, `refresh_token`, `token_expiry`) lagras och uppdateras automatiskt.

### Anmärkningar

- OAuth2-samtyckesskärmen kräver BigQuery-scope (`https://www.googleapis.com/auth/bigquery`).
- **Produktion:** Ange backend-**`FRONTEND_URL`** till den publika URL:en. Registrera `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` i Google Cloud Console.

### Används av

- [BigQuery-nod](../nodes/bigquery-node.md)

---

## Supabase

Autentiseringsuppgiften för Supabase ansluter Heym till ett Supabase-projekts PostgREST API så att workflows kan fråga och ändra Postgres-baserade tabeller.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `supabase_url` | Projektets bas-URL, till exempel `https://your-project.supabase.co` |
| `supabase_key` | API-nyckel med åtkomst till måltabellerna |
| `supabase_schema` | Valfritt standardschema (standard är `public`) |

### Anmärkningar

- [Supabase-noden](../nodes/supabase-node.md) kommunicerar med `/rest/v1/<table>` och stöder operatorfilter (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` och relaterade PostgREST-operatorer) samt nästlade logiska grupper av typen `or` / `and`.
- För skrivoperationer bör en nyckel avsedd för betrodd server-side-användning med minsta nödvändiga tabellbehörigheter föredras.
- Noder kan åsidosätta schemat per steg även om autentiseringsuppgiften definierar ett standardschema.

### Används av

- [Supabase-nod](../nodes/supabase-node.md)

## ClickHouse

Autentiseringsuppgiften för ClickHouse ansluter Heym till en extern ClickHouse-databas via dess HTTP-gränssnitt så att workflows kan köra SQL-, CRUD- och count-operationer mot OLAP-tabeller.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `host` | HTTP-host utan schema, till exempel `your-instance.clickhouse.cloud` |
| `port` | HTTP-gränssnittets port (`8443` för HTTPS, `8123` för HTTP) |
| `username` | ClickHouse-användare (standard är `default`) |
| `password` | Användarlösenord (valfritt) |
| `database` | Måldatabas (standard är `default`) |
| `secure` | Använd HTTPS när `true` (krävs för ClickHouse Cloud) |

### Anmärkningar

- [ClickHouse-noden](../nodes/clickhouse-node.md) använder den officiella HTTP-klienten `clickhouse-connect` och parametriserar filter- och värdebindningar.
- `update` och `remove` mappas till `ALTER TABLE ... UPDATE` och `DELETE FROM`, vilka är asynkrona ClickHouse-mutationer; båda kräver ett filter.
- `upsert` utför en `INSERT` och förutsätter en `ReplacingMergeTree`-tabell för merge-on-key-beteende.
- Använd **Test connection** i autentiseringsdialogen för att verifiera nåbarhet.

### Används av

- [ClickHouse-nod](../nodes/clickhouse-node.md)

## Notion

Autentiseringsuppgiften för Notion stöder antingen en intern integration-token eller en OAuth-anslutning för publik integration. OAuth gör att varje användare kan auktorisera en Notion-arbetsyta från Heym i stället för att manuellt kopiera en token.

### Obligatoriska fält

| Läge | Fält | Beskrivning |
|------|-------|-------------|
| Intern token | `api_token` | Intern integration-token (`ntn_...`) |
| OAuth | `client_id` | Client ID från en publik Notion-integration |
| OAuth | `client_secret` | Client Secret från den publika Notion-integrationen |

OAuth-callbacken lagrar `access_token`, `auth_mode`, `workspace_id`, `workspace_name` och `bot_id` automatiskt. En tidigare intern `api_token` tas bort när OAuth slutförs. Registrera denna redirect-URI i Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth-konfigurationsflöde

1. Välj **OAuth** i autentiseringsdialogen, ange ett namn, Client ID och Client Secret.
2. Klicka på **Connect** och auktorisera arbetsytan i Notion-popupen.
   - För en **ny** autentiseringsuppgift skapar Heym posten när **Connect** klickas.
   - Slutför auktoriseringen i popupen och klicka sedan på **Save** för att återgå till listan över autentiseringsuppgifter.
3. En ansluten autentiseringsuppgift visas som `connected (Workspace Name)` i listan. Väntande OAuth-autentiseringsuppgifter visas som `Not connected` tills auktoriseringen slutförs.

Använd **Test Connection** i autentiseringsdialogen för att verifiera antingen en intern token eller en slutförd OAuth-auktorisering. Vid redigering bevaras den lagrade interna token om tokenfältet lämnas tomt.

Både interna tokens och OAuth-åtkomsttokens är tillgängliga via `$credentials.CredentialName` för anpassade [HTTP](../nodes/http-node.md)-anrop som behöver en Notion bearer-token.
### Anteckningar

- Interna integrationer kräver att relevanta sidor, databaser och datakällor delas.
- OAuth-användare väljer arbetsyta/sidor under Notion-auktoriseringen.
- OAuth-applikationens autentiseringsuppgifter krypteras inuti Notion-autentiseringsuppgiften. Callback-funktionen laddar om
  dem på serversidan; hemligheten bäddas inte in i OAuth-state.
- Anslutna OAuth-autentiseringsuppgifter visar arbetsytans namn; väntande OAuth-autentiseringsuppgifter visar
  `Not connected` tills auktoriseringen slutförs.
- **Produktion:** Ange backend-**`FRONTEND_URL`** till den publika webbläsar-URL:en (schema + värd, utan
  avslutande snedstreck). Notion-omdirigerings-URI:n måste matcha exakt:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Noden använder API-version `2026-03-11` och aktuell `data_source`-terminologi. Se
  [Notion-noden](../nodes/notion-node.md#api-version-notes)-artikeln för migreringsvägledning från
  äldre `archived`-, `after`- eller databasfrågeexempel.
- Gamla sökfilter med objektvärdet `database` normaliseras till `data_source`.

### Används av

- [Notion-noden](../nodes/notion-node.md)

---

## SMTP (E-post)

SMTP-autentiseringsuppgiften lagrar anslutningsinformation för e-postservern för att skicka utgående e-post.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `host` | SMTP-serverns värdnamn (t.ex. `smtp.gmail.com`) |
| `port` | SMTP-port (vanligtvis `587` för STARTTLS, `465` för SSL) |
| `email` | Användarnamn som SMTP-servern loggar in med; även den synliga avsändaren när `from` är tomt |
| `password` | SMTP-lösenord eller App Password |

### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `from` (`smtp_from`) | Synlig Från-adress (From). Lämna tomt för att skicka som `email`. Servern loggar fortfarande in som `email`, så det kontot måste ha tillåtelse att skicka som denna adress (i Gmail, ett verifierat **Skicka e-post som**-alias). |

### Vanliga SMTP-leverantörer

| Leverantör | Värd | Port | Anteckningar |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Kräver ett [App Password](https://support.google.com/accounts/answer/185833) (2FA måste vara aktiverat) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Använd autentiseringsuppgifterna för Microsoft-kontot |
| Mailgun | `smtp.mailgun.org` | `587` | Använd Mailgun SMTP-autentiseringsuppgifter från domäninställningarna |
| SendGrid | `smtp.sendgrid.net` | `587` | Använd `apikey` som användarnamn och en API-nyckel som lösenord |
| Anpassad / egenhostad | egen domän | `587` / `465` | Postfix, Exim, etc. |

### Anteckningar

- Gmail kräver ett **App Password** istället för det vanliga lösenordet när tvåstegsverifiering är aktiverat.
- Port `587` använder STARTTLS (startar i klartext, uppgraderas till TLS). Port `465` använder implicit TLS (SSL från början).

### Används av

- [Send Email-noden](../nodes/send-email-node.md)

---

## IMAP (Inkommande e-post)

IMAP-autentiseringsuppgiften lagrar anslutningsinformation för att övervaka en inkorg med [IMAP Trigger-noden](../nodes/imap-trigger-node.md).

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `imap_host` | IMAP-serverns värdnamn (till exempel `imap.gmail.com`) |
| `imap_port` | IMAP-port (`993` för SSL/TLS hos de flesta leverantörer) |
| `imap_username` | Brevlådans användarnamn eller fullständiga e-postadress |
| `imap_password` | Lösenord eller leverantörsspecifikt app-lösenord |

### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `imap_mailbox` | Brevlådemapp att övervaka (standard: `INBOX`) |
| `imap_use_ssl` | Aktivera SSL/TLS (rekommenderas; standard: `true`) |

### Anteckningar

- IMAP-triggern baslinjerar den aktuella brevlådan vid första avläsningen och bearbetar därefter endast nyare e-post.
- Gmail, Microsoft 365 och andra hostade leverantörer kräver ofta ett **app-lösenord** eller liknande IMAP-specifik hemlighet.
- Bilagors innehåll laddas inte ned i workflow-payloaden; Heym exponerar endast bilagors metadata.

### Används av

- [IMAP Trigger-noden](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP som workflow-trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) är en meddelandeförmedlare med öppen källkod. RabbitMQ-autentiseringsuppgiften lagrar anslutningsinformation för att publicera till och konsumera från köer och exchanges.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `rabbitmq_host` | AMQP-anslutnings-URL (t.ex. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-användarnamn (standard: `guest`) |
| `rabbitmq_password` | RabbitMQ-lösenord (standard: `guest`) |

### Virtuella värdar

För att ansluta till en specifik virtuell värd inkluderas den i `rabbitmq_host`-URL:en:

```
amqp://username:password@hostname:5672/vhost
```

Om standardvärden används kan sökvägen `/` utelämnas.

### Plugin för fördröjda meddelanden

[RabbitMQ-noden](../nodes/rabbitmq-node.md) stöder pluginet **rabbitmq_delayed_message_exchange**. När detta plugin är aktiverat på RabbitMQ-servern kan en fördröjning (i millisekunder) anges för utgående meddelanden med hjälp av fältet `rabbitmqDelayMs` på noden.

Noden sätter headern `x-delay` på det publicerade meddelandet. Exchange-typen måste vara `x-delayed-message` för att fördröjningar ska träda i kraft.

För att aktivera pluginet på en egenhostad RabbitMQ-instans:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

När pluginet inte är installerat ignoreras headern `x-delay` och meddelanden levereras omedelbart.

### Används av

- [RabbitMQ-noden](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ som workflow-trigger)

---

## Amazon S3

Amazon S3-autentiseringsuppgiften ansluter Heym till [Amazon S3](https://aws.amazon.com/s3/). Den används med [Amazon S3-noden](../nodes/amazon-s3-node.md) för att hantera buckets och mappar, ladda upp och ladda ned objekt, kopiera nycklar samt lista eller ta bort objekt från workflows.
### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key-ID |
| `aws_secret_access_key` | Hemlig access key som hör ihop med access key-ID:t |
| `aws_region` | AWS-region där buckets finns (t.ex. `us-east-1`) |

### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `aws_session_token` | Tillfällig session token vid användning av AWS STS-autentiseringsuppgifter |

### Anmärkningar

- Autentiseringsuppgiften använder standardiserad AWS SigV4-autentisering via boto3.
- Uppladdningsåtgärder skickar för närvarande UTF-8-textinnehåll; nedladdningar kan returnera text eller base64 för binära objekt.

### Används av

- [Amazon S3-nod](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) är ett minnesbaserat nyckel-värde-lager som används för cachelagring och snabb dataåtkomst.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `host` | Redis-serverns värdnamn eller IP (t.ex. `localhost`) |
| `port` | Redis-port (standard: `6379`) |
| `password` | Redis-lösenord (lämna tomt om det inte är angett) |

### Används av

- [Redis-nod](../nodes/redis-node.md)

---

## Slack

Slack-autentiseringsuppgiften lagrar en **Incoming Webhook URL** för att publicera meddelanden till Slack-kanaler.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (från Slack-appens konfiguration) |

### Anmärkningar

- Skapa en Incoming Webhook på [api.slack.com/apps](https://api.slack.com/apps) → appen → **Incoming Webhooks**.
- Varje webhook är begränsad till en specifik kanal. Skapa flera autentiseringsuppgifter för olika kanaler.

### Används av

- [Slack-nod](../nodes/slack-node.md)

---

## Telegram

Telegram-autentiseringsuppgiften lagrar en **Bot Token** och en valfri **Webhook Secret Token** för botbaserade workflows.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `bot_token` | Telegram Bot API-token från BotFather |

### Valfria fält

| Fält | Beskrivning |
|-------|-------------|
| `secret_token` | Delad hemlighet som verifieras mot `x-telegram-bot-api-secret-token` vid inkommande webhooks |

### Anmärkningar

- Använd samma autentiseringsuppgift för både [Telegram Trigger](../nodes/telegram-trigger-node.md) och [Telegram](../nodes/telegram-node.md).
- Registrera webhooken manuellt med Telegrams `setWebhook`-API med den URL som visas i panelen för Telegram Trigger-noden.
- `chatId` i Telegram-noden kan vara ett litteralt ID eller ett uttryck som `$telegramEvent.message.chat.id`.

### Används av

- [Telegram Trigger-nod](../nodes/telegram-trigger-node.md)
- [Telegram-nod](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Dessa autentiseringsuppgifter används av [HTTP-noden](../nodes/http-node.md) för att autentisera utgående förfrågningar.

### Bearer

Bifogar en `Authorization: Bearer <token>`-header till HTTP-förfrågningar.

| Fält | Beskrivning |
|-------|-------------|
| `token` | Värdet för bearer-token |

### Header

Bifogar en anpassad header till HTTP-förfrågningar.

| Fält | Beskrivning |
|-------|-------------|
| `header_key` | Headerns namn (t.ex. `X-Api-Key`) |
| `header_value` | Headerns värde |

Båda typerna kan även refereras via `$credentials.CredentialName` i [Expression DSL](./expression-dsl.md) för dynamisk användning i valfri nod som accepterar uttryck.

### Används av

- [HTTP-nod](../nodes/http-node.md)

---

## LLM-leverantörer (OpenAI, Google, Custom, Cohere)

Dessa autentiseringsuppgifter driver AI-noder.

| Typ | Beskrivning |
|------|-------------|
| **OpenAI** | API-nyckel för GPT-modeller och OpenAI-embeddings |
| **Google** | API-nyckel för Gemini-modeller |
| **Custom** | API-nyckel + bas-URL för OpenAI-kompatibla endpoints (Ollama, vLLM, LM Studio m.fl.) |
| **Cohere** | API-nyckel för Cohere-embeddings |

### OpenAI Prompt-cachelagring

OpenAI cachelagrar automatiskt det statiska (oföränderliga) prefixet i system-prompten — ingen extra konfiguration krävs. Upprepade workflow-körningar som delar samma system-prompt-prefix drar nytta av cachelagrad token-prissättning, vilket minskar både kostnad och latens. Detta är särskilt användbart vid långa, fasta instruktioner där endast användarmeddelandet ändras mellan körningar. Övervaka cache-träffrekvens och token-besparingar i [fliken Körningar](../tabs/traces-tab.md) eller OpenAI:s användningsdashboard för att optimera promptstrukturen för maximal cache-återanvändning.

### Används av

- [LLM-nod](../nodes/llm-node.md)
- [Agent-nod](../nodes/agent-node.md)
- [RAG-nod](../nodes/rag-node.md) (OpenAI-embeddings via Qdrant-autentiseringsuppgift)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) är en proxyserver för att kringgå Cloudflare och liknande bot-skyddsutmaningar.

### Obligatoriska fält

| Fält | Beskrivning |
|-------|-------------|
| `flaresolverr_url` | URL till FlareSolverr-instansen (t.ex. `http://localhost:8191`) |

Loopback- och privata adresser stöds här, så att köra FlareSolverr bredvid Heym fungerar enligt dokumentationen. URL:en får inte peka på en link-local- eller molnmetadata-adress. Eftersom privata adresser tillåts kan detta fält även riktas mot en annan intern tjänst, och svaret returneras i nodens utdata. Alla inloggade användare kan skapa denna autentiseringsuppgift, så gränsen utgörs av vem som får skapa workflows samt nätverksregler, inte av delning av autentiseringsuppgifter. Se [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Används av

- [Crawler-nod](../nodes/crawler-node.md)

---
## Relaterat

- [Autentiseringsuppgifter](./credentials.md) – Översikt över autentiseringsuppgifter och hur noder använder dem
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till och hantera autentiseringsuppgifter
- [Delning av autentiseringsuppgifter](./credentials-sharing.md) – Dela autentiseringsuppgifter med användare och team
- [Säkerhet](./security.md) – Kryptering i vila, åtkomstkontroll
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntax för dynamisk åtkomst

---

## Model Router (Auto Model)

Dirigerar varje begäran till en av befintliga modellautentiseringsuppgifter med hjälp av en
beslutsmodell för att välja. Den lagrar referenser, aldrig en egen nyckel.

### Obligatoriska fält

- `decision_credential_id` – en autentiseringsuppgift av typen **Decision Model** som är åtkomlig.
- `decision_model` – modellen som utför dirigeringsanropet, till exempel `jev-latest`.
- `options` – minst två poster, var och en med ett namn, en av autentiseringsuppgifterna för
  OpenAI/Google/Custom, en modell på den samt kriterier som anger när den ska väljas.

### Valfria fält

- `routing_instructions` – hur alternativen ska vägas sammantaget.
- En post kan markeras som den fallback som används när dirigeringen misslyckas.

### Noteringar

Det är mellan alternativens namn som beslutsmodellen väljer, så de måste vara distinkta. En
post kan inte peka på en annan Model Router.
