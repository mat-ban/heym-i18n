# Legitimationsoplysninger

Legitimationsoplysninger lagrer API-nøgler og hemmeligheder, der bruges af workflow-noder. De tilføjes under [fanen Legitimationsoplysninger](../tabs/credentials-tab.md) og refereres til ved navn i nodekonfigurationen.

## Hvad legitimationsoplysninger er

- **Lagret per bruger** – Hver legitimationsoplysning tilhører en bruger og kan [deles](./credentials-sharing.md) med andre brugere eller [Teams](./teams.md).
- **Krypteret i hvile** – Følsomme værdier er krypteret; brugergrænsefladen maskerer dem efter oprettelse.
- **Refereret ved navn** – Noder vælger en legitimationsoplysning ved navn (eller ID). Workflow-motoren løser legitimationsoplysningen for workflow-ejeren under kørsel.

## Hvordan noder bruger dem

| Nodetype | Typisk legitimationsoplysning | Formål |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evalueringer](../tabs/evals-tab.md) | OpenAI, Google, Tilpasset | API-nøgle til modellen |
| [Beslutning](../nodes/decision-node.md), [Evalueringer](../tabs/evals-tab.md) judge | Beslutningsmodel | Basis-URL for en beslutningsmodels endpoint, plus en valgfri API-nøgle |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI-standardindstillinger | Modelrouter (Auto Model) | Vælger hvilken af modellerne der skal servicere hver anmodning ved hjælp af en beslutningsmodel |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-abonnementslogin (OAuth) eller en Codex-adgangstoken til kørslen, plus en GitHub PAT til repository-operationer |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | En OpenCode Go gateway API-nøgle (valgfri basis-URL) til kørslen, plus en GitHub PAT til repository-operationer |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) til GitHub API-kald, GitHub-nodeoperationer og MCP-integrationer |
| [Jira](../nodes/jira-node.md) | Jira | Cloud-e-mail/API-token, Data Center brugernavn/adgangskode eller personlig adgangstoken, Jira-site basis-URL, implementeringstilstand og valgfri REST API-version |
| [Linear](../nodes/linear-node.md) | Linear | Personlig API-nøgle eller OAuth2 til teams, projekter, issues og kommentarer |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Godkendelse til anmodninger |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot-token og valgfri webhook-hemmelighed |
| [Discord](../nodes/discord-node.md) | Discord | Indgående webhook-URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Applikations offentlige nøgle til signaturverifikation |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektorlagerforbindelse (ekstern Qdrant, eller Heyms egen Postgres via pgvector), med OpenAI eller ethvert OpenAI-kompatibelt embedding-endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook eller API-token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Indgående mailboksforbindelse |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mailserver |
| [Redis](../nodes/redis-node.md) | Redis | Forbindelse |
| [Grist](../nodes/grist-node.md) | Grist | API-nøgle + server-URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2-samtykke |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2-samtykke |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2-samtykke |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekt-URL + API-nøgle (+ valgfri standardskema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Vært + port + brugernavn/adgangskode + database (+ sikker) |
| [Notion](../nodes/notion-node.md) | Notion | Intern integrationstoken, eller offentlig integration Client ID + Client Secret + OAuth-samtykke |
| [Sentry](../nodes/sentry-node.md) | Sentry | Godkendelsestoken plus valgfri selvhostet basis-URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Adgangsnøgle, hemmelig nøgle, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP-URL |

For detaljeret opsætning (værter, porte, providerspecifikke felter) se [Tredjepartsintegrationer](./integrations.md). Dette omfatter Telegram-botopsætning, indgående e-mail via IMAP og udgående e-mail via SMTP.

GitHub-legitimationsoplysninger kan også inkludere en valgfri `base_url`, når der arbejdes med GitHub Enterprise Server i stedet for GitHub.com. Ved redigering af en GitHub-legitimationsoplysning for at rotere tokenet, bevares den eksisterende Enterprise-endpoint, hvis `base_url` efterlades tom. Indtast kun en ny URL, hvis der ønskes at ændre denne endpoint.

Jira, Linear, Supabase, Notion, Sentry og ClickHouse-legitimationsoplysninger tilbyder **Testforbindelse** i legitimationsdialogen. For Jira kalder testen Jiras nuværende brugerendpoint. For Linear kalder testen Linear API med `getViewer` og bekræfter, at API-nøglen eller OAuth-tokenet er gyldigt. Ved redigering er det muligt at teste uden at indtaste API-nøglen igen, hvis den gemte hemmelighed stadig er til stede. For Notion vælges **Intern token** eller **OAuth** i dialogen; OAuth bruger Client ID og Client Secret fra den offentlige Notion-integration. Se [Tredjepartsintegrationer](./integrations.md#notion) for detaljer om Notion-opsætning.
## Brug af kodepakke

Fanebladet **AI Standardindstillinger** i [Indstillinger](./user-settings.md) viser den resterende brug af kodepakken for Codex-legitimationsoplysninger (ejet og delt). For hver Codex-legitimationsoplysning vises en vandret søjle per aktiv rate-limit-vindue – typisk et **5-timers** og/eller **Ugentligt** vindue, afhængigt af abonnementet – med den tilbageværende kvote i procent og en nedtælling til nulstilling. Dataene kommer fra Codex-backendens rate-limit-response-headers, som hentes ved behov.

OpenCode Go-legitimationsoplysninger er også listet, men markeret som **"brug ikke tilgængelig"**: OpenCode zen-gatewayen eksponerer ikke data om resterende kvote, så der kan ikke vises nogen søjle.

## I udtryk

Visse noder tillader udtryk for godkendelse. Brug [Expression DSL](./expression-dsl.md) med `$credentials.CredentialName` for at henvise til en legitimationsoplysnings løste hemmelighed i et udtryk. For header-linjen, som hver legitimationsoplysningstype har brug for i en HTTP-anmodning, se [HTTP › Godkendelse med legitimationsoplysninger](../nodes/http-node.md#authenticating-with-credentials).

Codex-legitimationsoplysninger er bevidst udelukket fra `$credentials`. Uanset om der logges ind med ChatGPT (abonnement, ingen API-omkostninger per token) eller indsættes et Codex `access_token`, sendes tokens kun til den lokale Codex-kørerproces. ChatGPT-login-tokens opdateres automatisk, når de udløber.

Jira-legitimationsoplysninger er også udelukket fra `$credentials`. [Jira-noden](../nodes/jira-node.md) indlæser legitimationsoplysningen ved `credentialId` under kørsel. For brugerdefinerede Jira REST-kald, som ikke dækkes af Jira-noden, kan [HTTP-noden](../nodes/http-node.md) bruges med Jira Basic Auth (`email:api_token` for Jira Cloud eller `username:password` for Data Center/Server), f.eks. `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Det er også muligt at bruge en [Header](../nodes/http-node.md)-legitimationsoplysning med `Authorization: Basic <base64(user:secret)>`. For personlige adgangstokens til Jira Data Center / Server sendes i stedet `Authorization: Bearer <token>`; selve Jira-legitimationsoplysningen understøtter dette via godkendelsestilstanden **Personal Access Token**.

| Legitimationsoplysningstype | Værdi eksponeret til `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Bearer-tokenstreng |
| Header | Komplet `header key: header value`-linje, klar til brug i et cURL `-H`-argument |
| GitHub | Personligt adgangstoken |
| Notion | Internt `api_token` eller OAuth `access_token` (Bearer-token til Notion API-kald) |
| Sentry | Sentry-godkendelsestoken |
| Discord / Slack | Webhook-URL |

Eksempel:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Brug Notion-**noden** til native database-, side- og blokoperationer. Brug `$credentials`, når en brugerdefineret [HTTP](../nodes/http-node.md)-anmodning har brug for det samme Notion Bearer-token.

## Oprettelse af legitimationsoplysninger fra Chat

[AI-assistenten](./ai-assistant.md#credentials), [Chat-fanebladet](../tabs/chat-tab.md) og [Chat med Heym](./chat-with-heym.md) kan oprette en legitimationsoplysning, når et workflow har brug for en, eller når der bedes om det. Assistenten foreslår typen og et navn, og den almindelige legitimationsoplysningsformular åbnes i samtalen. Hvis der bedes om at opdatere en legitimationsoplysning, åbnes samme formular med dens hemmeligheder maskerede. Assistenten ser kun navnet og typen. `heym_chat` over [MCP](../tabs/mcp-tab.md) kan ikke oprette, opdatere eller vælge legitimationsoplysninger.

## Relateret

- [Legitimationsoplysningsfanebladet](../tabs/credentials-tab.md) – Tilføj, rediger, slet legitimationsoplysninger
- [GitHub-node](../nodes/github-node.md) – Native GitHub REST-operationer
- [Jira-node](../nodes/jira-node.md) – Automatisering af Jira-projekter, -sager, -kommentarer, -vedhæftninger, -brugere, -notifikationer og -overgange
- [Linear-node](../nodes/linear-node.md) – Automatisering af Linear GraphQL-arbejdsområder og -sager
- [Notion-node](../nodes/notion-node.md) – Søg og håndter Notion-indhold
- [Sentry-node](../nodes/sentry-node.md) – Automatisering af Sentry-organisationer, -projekter, -teams, -sager, -begivenheder og -udgivelser
- [Deling af legitimationsoplysninger](./credentials-sharing.md) – Del med brugere og teams
- [Tredjepartsintegrationer](./integrations.md) – Opsætningsvejledning per legitimationsoplysningstype
- [Expression DSL](./expression-dsl.md) – `$credentials` i udtryk

## Model Router (Auto Model)

En Model Router indeholder ingen nøgle. Den indeholder en **beslutningsmodel-legitimationsoplysning**, en liste over **modelmuligheder** – hver en eksisterende OpenAI-, Google- eller brugerdefineret legitimationsoplysning plus en model – og for hver mulighed fri tekst, der beskriver, hvornår denne mulighed skal bruges.

Den vises i hver vælger, der tilbyder en model: [LLM](../nodes/llm-node.md)- og [Agent](../nodes/agent-node.md)-noderne, Chat, AI Standardindstillinger, Dashboards, udtryksbyggeren og Datatabeller. Dens eneste model er **Auto**. Ved valg læser beslutningsmodellen hver anmodning og dirigerer den. [Evalueringer](../tabs/evals-tab.md) udelader den, fordi en evaluering sammenligner specifikke modeller, og en router vælger selv.

En agent omdirigerer, efterhånden som dens værktøjsløb skrider frem, så en billig model kan håndtere de tidlige omgange, og en stærkere model den omgang, der har brug for det. Identiske input genbruger den tidligere beslutning, så et løb kun betaler for en beslutning, når samtalen faktisk har bevæget sig.

### Begrænsninger

Auto Model kan ikke kombineres med **Responses API**, **Batch-tilstand** eller **billedoutput**. Disse til/fra-funktioner deaktiverer sig selv, når en router er valgt, og hver angiver årsagen. Guardrail-tjek og den menneskelige gennemgangspolitiks klassifikator er faste enkeltmodelkald og dirigeres aldrig.
### Ved fejl i routing

Ved at markere indstillingen **Brug denne indstilling ved fejl i routing** sikres det, at en afbrydelse i beslutningsmodellen aldrig stopper en kørsel; fallback'en anvendes, og årsagen registreres på kørslen. Uden denne indstilling fejler noden i stedet for at gætte.

### Sporing af en anmodnings vej

Kørsler viser `Auto Model / GPT-5` i stedet for kun modellen, og omkostningerne tilskrives den model, der faktisk blev kørt. Canvas Execution Log og Span View viser det samme par, og Span View angiver, hvilken tur gik hvorhen.
