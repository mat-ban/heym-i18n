# Fliken Credentials

Fliken **Credentials** hanterar API-nycklar och hemligheter som används av noder. Lägg till credentials här och referera till dem med namn i workflow-noder. För en översikt över vad credentials är och hur noder använder dem, se [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

## Credential-typer

| Typ | Användningsområde |
|------|----------|
| **OpenAI** | OpenAI API-nyckel för LLM-, Agent- och RAG-noder |
| **Google** | Google AI (Gemini) API-nyckel |
| **GitHub** | GitHub personal access token (PAT) för GitHub API, GitHub-nod-workflows, MCP-servrar och agent-workflows; valfri GitHub Enterprise `base_url` |
| **Linear** | Linear personal API-nyckel eller OAuth2 för team, projekt, ärenden och kommentarer |
| **Notion** | Intern integration-token eller OAuth-arbetsyta för public-integration |
| **Custom** | Anpassade LLM-endpoints |
| **Bearer** | Bearer-token för HTTP-autentisering |
| **Header** | Anpassad header-nyckel-värde för HTTP-förfrågningar |
| **Telegram** | Telegram bot-token och valfri webhook-hemlighet |
| **Slack** | Slack incoming webhook-URL |
| **Discord** | Discord incoming webhook-URL |
| **Discord Trigger** | Discord-applikationens publika nyckel |
| **IMAP** | Credentials för inkommande mailbox-trigger |
| **SMTP** | Credentials för e-postutskick |
| **Redis** | Redis-anslutning |
| **RAG: Qdrant + OpenAI** | Vektorlagring för RAG-noder, med en extern Qdrant-server som backend |
| **RAG: Psql + OpenAI** | Vektorlagring för RAG-noder, med Heyms egen Postgres-databas (pgvector) som backend — ingen extern tjänst |
| **RAG: Custom Embeddings** | Vektorlagring för RAG-noder med valfri OpenAI-kompatibel embedding-endpoint, med Qdrant eller Postgres (pgvector) som lagring |
| **Cohere** | Cohere API för embeddings |

## Lägga till credentials

1. Klicka på **Add Credential**
2. Välj credential-typ
3. Ange de obligatoriska värdena (API-nyckel, URL, etc.)
4. Ge den ett namn för referens i noder

För GitHub är det nuvarande credential-flödet PAT-baserat. Fine-grained PAT rekommenderas. GitHub App-installationsflöden är inte förstklassiga i gränssnittet i dag. Vid användning av GitHub Enterprise Server går det även att ange en valfri GitHub API-bas-URL, till exempel `https://github.example.com/api/v3`.

För Linear väljs **Personal API key** eller **OAuth2** i dialogrutan. Personal API-nycklar skapas
under **Settings → Security & Access → Personal API keys** i Linear. OAuth2 använder ett Linear OAuth-
programs Client ID och Client Secret, med `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrerad som redirect-URI. Credentialen agerar med behörigheterna för den Linear-användare som
skapade eller auktoriserade den. Använd **Test Connection** i credential-dialogrutan för att verifiera API-nyckeln eller
OAuth-token innan den sparas.

För **Notion** väljs **Internal token** eller **OAuth** i dialogrutan. OAuth använder Client ID och
Client Secret från Notion public integration; Heym lagrar dem krypterade i credentialen.
Använd **Test Connection** för att verifiera Supabase-, Linear- eller Notion-credentials innan en workflow sparas. Se
[Third-Party Integrations](../reference/integrations.md#notion) för information om Notion-konfiguration.

OAuth-credentials öppnar leverantörens auktoriseringssida i en popup. Om webbläsaren blockerar den kan länken **Open the authorization page** under Connect-knappen användas; dialogrutan upptäcker när anslutningen slutförs. När en ny credential har anslutits visar knappen **Connected**.

## Redigera och ta bort

- **Edit** – Uppdatera credential-värden (känsliga värden maskeras)
- **Delete** – Ta bort en credential; workflows som använder den behöver en ersättning

Vid redigering av en **GitHub**-credential på GitHub Enterprise Server bevaras den befintliga Enterprise-endpointen om det valfria fältet **GitHub
API Base URL** lämnas tomt. Ange en ny URL endast när
den endpointen ska ändras.

## Delning

- [Dela credentials](../reference/credentials-sharing.md) med andra användare via e-post eller med [Teams](../reference/teams.md)
- Delade credentials visas med en indikator
- Återkalla delning från credential-kortets meny
## Användning i noder

Referera till autentiseringsuppgifter med namn i nodkonfigurationen. Till exempel:
- [LLM-nod](../nodes/llm-node.md) – Välj autentiseringsuppgifter för modellens API
- [HTTP-nod](../nodes/http-node.md) – Använd Bearer- eller Header-autentiseringsuppgifter för autentisering
- [Agent-nod](../nodes/agent-node.md) – Skicka GitHub-token till MCP-serverns miljövariabler såsom `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub-nod](../nodes/github-node.md) – Kör inbyggda GitHub-åtgärder för repository, användare, issue, review, release, workflow, trafik och filer
- [Linear-nod](../nodes/linear-node.md) – Läs workspace-metadata och automatisera Linear-issues och kommentarer
- [Notion-nod](../nodes/notion-node.md) – Hantera Notion-databaser, datakällor, sidor och block
- [RAG-nod](../nodes/rag-node.md) – Använd Qdrant- eller Postgres-autentiseringsuppgifter (pgvector) för vektorlagret
- [Telegram Trigger-nod](../nodes/telegram-trigger-node.md) – Ta emot Telegram-bot-webhooks
- [Telegram-nod](../nodes/telegram-node.md) – Skicka Telegram-bot-meddelanden
- [Discord Trigger-nod](../nodes/discord-trigger-node.md) – Ta emot Discord-interaktionswebhooks
- [Discord-nod](../nodes/discord-node.md) – Skicka Discord-webhook-meddelanden
- [IMAP Trigger-nod](../nodes/imap-trigger-node.md) – Polla en delad inkorg efter ny e-post

Se [Expression DSL](../reference/expression-dsl.md) för referering av autentiseringsuppgiftsbaserade värden i uttryck.

## Relaterat

- [Tredjepartsintegrationer](../reference/integrations.md) – Detaljerad installationsguide för varje autentiseringstyp (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack med flera)
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md) – Dela autentiseringsuppgifter med andra användare
- [Säkerhet](../reference/security.md) – Kryptering i vila, sessionshantering, hastighetsbegränsning
- [Nodtyper](../reference/node-types.md) – Noder som använder autentiseringsuppgifter ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Fliken Vectorstores](./vectorstores-tab.md) – Använder Qdrant- eller Postgres-autentiseringsuppgifter (pgvector)
- [Fliken Chat](./chat-tab.md) – Använder OpenAI/Google-autentiseringsuppgifter
- [Kontextuell översikt](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
