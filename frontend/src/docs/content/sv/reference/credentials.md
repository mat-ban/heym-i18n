# Credentials

Credentials lagrar API-nycklar och hemligheter som används av workflow-noder. De läggs till i [Credentials-fliken](../tabs/credentials-tab.md) och refereras till med namn i nodkonfigurationen.

## Vad Credentials är

- **Lagras per användare** – Varje credential tillhör en användare och kan [delas](./credentials-sharing.md) med andra användare eller [Teams](./teams.md).
- **Krypterade i vila** – Känsliga värden krypteras; gränssnittet maskerar dem efter skapandet.
- **Refereras till med namn** – Noder väljer en credential med namn (eller ID). Exekveringsmotorn löser upp credentialen för workflow-ägaren vid körning.

## Hur noder använder dem

| Nodtyp | Typisk credential | Syfte |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API-nyckel för modellen |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Bas-URL för en decision model-endpoint, plus en valfri API-nyckel |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Väljer vilken av modellerna som hanterar varje begäran, med hjälp av en decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-prenumerationsinloggning (OAuth) eller en Codex access token för runner, plus en GitHub PAT för repository-operationer |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | En OpenCode Go gateway API-nyckel (valfri bas-URL) för runner, plus en GitHub PAT för repository-operationer |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) för GitHub API-anrop, GitHub-nodoperationer och MCP-integrationer |
| [Jira](../nodes/jira-node.md) | Jira | Cloud e-post/API-token, Data Center användarnamn/lösenord eller personlig åtkomsttoken, Jira site bas-URL, distributionsläge och valfri REST API-version |
| [Linear](../nodes/linear-node.md) | Linear | Personlig API-nyckel eller OAuth2 för teams, projekt, ärenden och kommentarer |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentisering för förfrågningar |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot-token och valfri webhook-hemlighet |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook-URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Applikationens publika nyckel för signaturverifiering |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektorlageranslutning (extern Qdrant, eller Heyms egen Postgres via pgvector), med OpenAI eller valfri OpenAI-kompatibel embedding-endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook eller API-token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Anslutning för inkommande brevlåda |
| [Send Email](../nodes/send-email-node.md) | SMTP | E-postserver |
| [Redis](../nodes/redis-node.md) | Redis | Anslutning |
| [Grist](../nodes/grist-node.md) | Grist | API-nyckel + server-URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2-samtycke |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2-samtycke |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2-samtycke |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekt-URL + API-nyckel (+ valfritt standardschema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + användarnamn/lösenord + databas (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Intern integration-token, eller publik integration Client ID + Client Secret + OAuth-samtycke |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth-token plus valfri bas-URL för self-hosted |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP-URL |

För detaljerad konfiguration (hosts, portar, leverantörsspecifika fält), se [Third-Party Integrations](./integrations.md). Det inkluderar Telegram bot-konfiguration, inkommande e-post via IMAP och utgående e-post via SMTP.

GitHub-credentials kan även innehålla en valfri `base_url` när GitHub
Enterprise Server används istället för GitHub.com. Vid redigering av en GitHub-credential för att rotera token,
bevarar ett tomt `base_url` den befintliga Enterprise-endpointen. Ange endast en ny URL när
denna endpoint ska ändras.

Jira-, Linear-, Supabase-, Notion-, Sentry- och ClickHouse-credentials exponerar **Test Connection** i credential-dialogen. För Jira anropar kontrollen Jiras aktuella användar-endpoint. För Linear
anropar kontrollen Linear API med `getViewer` och bekräftar att API-nyckeln eller OAuth-token är giltig.
Vid redigering går det att testa utan att ange API-nyckeln på nytt om den lagrade hemligheten fortfarande finns. För Notion,
välj **Internal token** eller **OAuth** i dialogen; OAuth använder Client ID och Client Secret
från den publika Notion-integrationen. Se [Third-Party Integrations](./integrations.md#notion) för
information om Notion-konfiguration.
## Användning av kodningspaket

Fliken **AI-standardvärden** i [Inställningar](./user-settings.md) visar återstående användning av kodningspaketet för Codex-uppgifter (ägda och delade). För varje Codex-uppgift visas en horisontell stapel per aktivt hastighetsbegränsningsfönster — vanligtvis ett fönster på **5 timmar** och/eller **Veckovis**, beroende på plan — med procentandelen återstående kvot och en nedräkning till återställning. Data hämtas från Codex-backendens svarshuvuden för hastighetsbegränsning, och hämtas vid behov.

OpenCode Go-uppgifter listas också där, men markeras som **"användning ej tillgänglig"**: OpenCode zen-gatewayen exponerar inte data om återstående kvot, så ingen stapel kan visas.

## I uttryck

Vissa noder tillåter uttryck för autentisering. Använd [Expression DSL](./expression-dsl.md) med `$credentials.CredentialName` för att referera till en uppgifts lösta hemlighet i ett uttryck. För den rubrikrad som varje uppgiftstyp behöver i en HTTP-begäran, se [HTTP › Autentisering med uppgifter](../nodes/http-node.md#authenticating-with-credentials).

Codex-uppgifter är avsiktligt uteslutna från `$credentials`. Oavsett om inloggning sker med ChatGPT (prenumeration, ingen kostnad per token för API) eller genom att klistra in en Codex `access_token`, skickas token endast till den lokala Codex-körningsprocessen. ChatGPT-inloggningstoken förnyas automatiskt när de löper ut.

Jira-uppgifter är också uteslutna från `$credentials`. [Jira-noden](../nodes/jira-node.md) laddar uppgiften via `credentialId` vid körning. För anpassade Jira REST-anrop som inte täcks av Jira-noden, använd [HTTP-noden](../nodes/http-node.md) med Jira Basic Auth (`email:api_token` för Jira Cloud eller `username:password` för Data Center / Server), till exempel `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Det går även att använda en [Header](../nodes/http-node.md)-uppgift med `Authorization: Basic <base64(user:secret)>`. För personliga åtkomsttoken för Jira Data Center / Server, skicka `Authorization: Bearer <token>` i stället; Jira-uppgiften stöder detta via sitt **Personal Access Token**-autentiseringsläge.

| Uppgiftstyp | Värde som exponeras för `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Bearer-tokensträng |
| Header | Fullständig rad `header key: header value`, redo att läggas in i ett cURL `-H`-argument |
| GitHub | Personlig åtkomsttoken |
| Notion | Intern `api_token` eller OAuth `access_token` (Bearer-token för Notion API-anrop) |
| Sentry | Sentry-autentiseringstoken |
| Discord / Slack | Webhook-URL |

Exempel:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Använd Notion-**noden** för inbyggda databas-, sida- och blockoperationer. Använd `$credentials` när en anpassad [HTTP](../nodes/http-node.md)-begäran behöver samma Notion bearer-token.

## Skapa uppgifter från chatt

[AI-assistenten](./ai-assistant.md#credentials), [Chat-fliken](../tabs/chat-tab.md) och [Chatta med Heym](./chat-with-heym.md) kan skapa en uppgift när ett workflow behöver en, eller närhelst en sådan efterfrågas. Assistenten föreslår typ och namn, och det vanliga uppgiftsformuläret öppnas i konversationen. Begär en uppdatering av en uppgift som ägs och samma formulär öppnas på den, med dess hemligheter maskerade. Assistenten ser endast namn och typ. `heym_chat` över [MCP](../tabs/mcp-tab.md) kan inte skapa, uppdatera eller välja uppgifter.

## Relaterat

- [Fliken Uppgifter](../tabs/credentials-tab.md) – Lägg till, redigera, ta bort uppgifter
- [GitHub-nod](../nodes/github-node.md) – Inbyggda GitHub REST-operationer
- [Jira-nod](../nodes/jira-node.md) – Automatisering av Jira-projekt, ärenden, kommentarer, bilagor, användare, aviseringar och övergångar
- [Linear-nod](../nodes/linear-node.md) – Automatisering av Linear GraphQL-arbetsyta och ärenden
- [Notion-nod](../nodes/notion-node.md) – Sök och hantera Notion-innehåll
- [Sentry-nod](../nodes/sentry-node.md) – Automatisering av Sentry-organisation, projekt, team, ärenden, händelser och utgåvor
- [Delning av uppgifter](./credentials-sharing.md) – Dela med användare och team
- [Tredjepartsintegrationer](./integrations.md) – Installationsguide per uppgiftstyp
- [Expression DSL](./expression-dsl.md) – `$credentials` i uttryck

## Modellrouter (Auto-modell)

En modellrouter har ingen nyckel. Den har en **beslutsmodelluppgift**, en lista med **modellalternativ** — vart och ett en befintlig OpenAI-, Google- eller Custom-uppgift plus en modell — och, för varje alternativ, fritext som anger när alternativet ska användas.

Den visas i varje väljare som erbjuder en modell: [LLM](../nodes/llm-node.md)- och [Agent](../nodes/agent-node.md)-noderna, Chatt, AI-standardvärden, Dashboards, uttrycksbyggaren och datatabeller. Dess enda modell är **Auto**. Välj den, och beslutsmodellen läser varje begäran och dirigerar den. [Evals](../tabs/evals-tab.md) utelämnar den, eftersom en eval jämför specifika modeller och en router väljer sin egen.

En agent dirigerar om allt eftersom dess verktygsslinga fortskrider, så en billig modell kan ta de tidiga turerna och en starkare den tur som behöver det. Identiska indata återanvänder föregående beslut, så en slinga betalar bara för ett beslut när konversationen faktiskt har förflyttat sig.

### Vad den inte kan göra

Auto-modell kan inte kombineras med **Responses API**, **Batch-läge** eller **bildutdata**. Dessa växlingsknappar inaktiverar sig själva när en router är vald, och var och en anger varför. Guardrail-kontroller och klassificeraren för policyn för mänsklig granskning är fasta anrop med en enda modell och dirigeras aldrig.
### När routing misslyckas

Markera ett alternativ **Använd detta alternativ när routing misslyckas** och ett avbrott i beslutsmodellen stoppar aldrig en körning; reservalternativet används och orsaken registreras på körningen. Utan ett sådant misslyckas noden i stället för att gissa.

### Se vart en begäran tog vägen

Traces visar `Auto Model / GPT-5` i stället för enbart modellen, och kostnaden förblir hänförd till den modell som faktiskt kördes. Canvasens Execution Log och Span View visar samma par, och Span View listar vilken tur som gick vart.
