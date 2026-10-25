# Referenties

Referenties (Credentials) slaan API keys en secrets op die door workflow-knooppunten worden gebruikt. U voegt ze toe in het [tabblad Referenties](../tabs/credentials-tab.md) en verwijst ernaar op naam in de knooppuntconfiguratie.

## Wat Referenties Zijn

- **Per gebruiker opgeslagen** – Elke referentie behoort toe aan een gebruiker en kan worden [gedeeld](./credentials-sharing.md) met andere gebruikers of [Teams](./teams.md).
- **Versleuteld in rust** – Gevoelige waarden worden versleuteld; de UI maskeert ze na aanmaak.
- **Op naam gerefereerd** – Knooppunten selecteren een referentie op naam (of ID). De uitvoeringsengine resolveert de referentie voor de workflow-eigenaar tijdens de uitvoering.

## Hoe Knooppunten Ze Gebruiken

| Knooppunttype | Typische referentie | Doel |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API key voor het model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Base URL van een decision model endpoint, plus een optionele API key |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Kiest welk van uw modellen elke aanvraag bedient, met behulp van een decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-abonnement aanmelding (OAuth) of een Codex access token voor de runner, plus een GitHub PAT voor repository-operaties |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Een OpenCode Go gateway API key (optionele base URL) voor de runner, plus een GitHub PAT voor repository-operaties |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) voor GitHub API-aanroepen, GitHub-knooppuntoperaties en MCP-integraties |
| [Jira](../nodes/jira-node.md) | Jira | Cloud e-mail/API token, Data Center gebruikersnaam/wachtwoord of personal access token, Jira site base URL, deployment mode en optionele REST API-versie |
| [Linear](../nodes/linear-node.md) | Linear | Persoonlijke API key of OAuth2 voor teams, projecten, issues en opmerkingen |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Auth voor aanvragen |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token en optioneel webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Applicatie public key voor signature-verificatie |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vectoropslag-verbinding (externe Qdrant, of Heym's eigen Postgres via pgvector), met OpenAI of een OpenAI-compatibel embedding endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook of API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Inbound mailbox-verbinding |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mailserver |
| [Redis](../nodes/redis-node.md) | Redis | Verbinding |
| [Grist](../nodes/grist-node.md) | Grist | API key + server URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2-toestemming |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2-toestemming |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2-toestemming |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key (+ optioneel standaardschema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + poort + gebruikersnaam/wachtwoord + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token, of publieke integratie Client ID + Client Secret + OAuth-toestemming |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token plus optionele self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, regio |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Voor gedetailleerde configuratie (hosts, poorten, providerspecifieke velden), zie [Third-Party Integrations](./integrations.md). Dat omvat Telegram bot-configuratie, inbound e-mail via IMAP en outbound e-mail via SMTP.

GitHub-referenties kunnen ook een optionele `base_url` bevatten wanneer u GitHub
Enterprise Server in plaats van GitHub.com als doel heeft. Wanneer u een GitHub-referentie bewerkt om het token te roteren,
blijft het bestaande Enterprise-endpoint behouden als `base_url` leeg wordt gelaten. Voer alleen een nieuwe URL in wanneer
u dat endpoint wilt wijzigen.

Jira-, Linear-, Supabase-, Notion-, Sentry- en ClickHouse-referenties bieden **Test Connection** in het referentiedialoogvenster. Voor Jira roept de controle Jira's current user endpoint aan. Voor Linear
roept de controle de Linear API aan met `getViewer` en bevestigt dat de API key of OAuth token geldig is.
Bij het bewerken kunt u testen zonder de API key opnieuw in te voeren als het opgeslagen secret nog aanwezig is. Voor Notion
kiest u **Internal token** of **OAuth** in het dialoogvenster; OAuth gebruikt de Client ID en Client Secret
van uw Notion publieke integratie. Zie [Third-Party Integrations](./integrations.md#notion) voor
details over de Notion-configuratie.

## Gebruik van het coding-package

Het tabblad **AI Defaults** in [Instellingen](./user-settings.md) toont het resterende gebruik van het coding-package voor uw Codex-referenties (eigen en gedeelde). Voor elke Codex-referentie wordt een horizontale balk weergegeven per actief rate-limit-venster — doorgaans een venster van **5 uur** en/of **Wekelijks**, afhankelijk van uw abonnement — met het resterende quotumpercentage en een aftellende timer voor de reset. De gegevens zijn afkomstig uit de rate-limit-responseheaders van de Codex-backend en worden op aanvraag opgehaald.

OpenCode Go-referenties worden daar ook vermeld, maar gemarkeerd als **"gebruik niet beschikbaar"**: de OpenCode zen-gateway stelt geen gegevens over het resterende quotum beschikbaar, waardoor er geen balk kan worden weergegeven.

## In Expressies

Sommige knooppunten ondersteunen expressies voor authenticatie. Gebruik [Expression DSL](./expression-dsl.md) met `$credentials.CredentialName` om binnen een expressie te verwijzen naar het opgeloste geheim van een referentie. Voor de headerregel die elk referentietype nodig heeft in een HTTP-verzoek, zie [HTTP › Authenticeren met Referenties](../nodes/http-node.md#authenticating-with-credentials).

Codex-referenties zijn bewust uitgesloten van `$credentials`. Of u nu inlogt met ChatGPT (abonnement, geen API-kosten per token) of een Codex `access_token` plakt, de tokens worden uitsluitend doorgegeven aan het lokale Codex-runnerproces. ChatGPT-inlogtokens worden automatisch vernieuwd wanneer ze verlopen.

Jira-referenties zijn eveneens uitgesloten van `$credentials`. Het [Jira-knooppunt](../nodes/jira-node.md) laadt de referentie tijdens de uitvoering via `credentialId`. Voor aangepaste Jira REST-aanroepen die niet door het Jira-knooppunt worden ondersteund, gebruikt u het [HTTP-knooppunt](../nodes/http-node.md) met Jira Basic Auth (`email:api_token` voor Jira Cloud of `username:password` voor Data Center / Server), bijvoorbeeld `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. U kunt ook een [Header](../nodes/http-node.md)-referentie gebruiken met `Authorization: Basic <base64(user:secret)>`. Stuur voor Jira Data Center / Server personal access tokens in plaats daarvan `Authorization: Bearer <token>`; de Jira-referentie zelf ondersteunt dit via de **Personal Access Token** authenticatiemodus.

| Referentietype | Waarde die wordt blootgesteld aan `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Bearer-tokenstring |
| Header | Volledige regel `header key: header value`, klaar om in een cURL `-H`-argument te worden geplaatst |
| GitHub | Personal access token |
| Notion | Interne `api_token` of OAuth `access_token` (Bearer-token voor Notion API-aanroepen) |
| Sentry | Sentry auth-token |
| Discord / Slack | Webhook-URL |

Voorbeeld:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Gebruik het Notion-**knooppunt** voor native database-, pagina- en blokbewerkingen. Gebruik `$credentials` wanneer een aangepast [HTTP](../nodes/http-node.md)-verzoek hetzelfde Notion bearer-token nodig heeft.

## Referenties aanmaken vanuit Chat

De [AI Assistant](./ai-assistant.md#credentials), het [Chat-tabblad](../tabs/chat-tab.md) en [Chat with Heym](./chat-with-heym.md) kunnen een referentie aanmaken wanneer een workflow er een nodig heeft, of wanneer u er zelf een aanvraagt. De assistent stelt het type en een naam voor, en het reguliere referentieformulier wordt in het gesprek geopend. Vraag om een referentie die u bezit bij te werken en hetzelfde formulier wordt geopend, met de geheimen gemaskeerd. De assistent ziet alleen de naam en het type. `heym_chat` via [MCP](../tabs/mcp-tab.md) kan geen referenties aanmaken, bijwerken of kiezen.

## Gerelateerd

- [Credentials Tab](../tabs/credentials-tab.md) – Referenties toevoegen, bewerken, verwijderen
- [GitHub Node](../nodes/github-node.md) – Native GitHub REST-bewerkingen
- [Jira Node](../nodes/jira-node.md) – Automatisering van Jira-projecten, issues, opmerkingen, bijlagen, gebruikers, meldingen en transities
- [Linear Node](../nodes/linear-node.md) – Automatisering van Linear GraphQL-workspace en issues
- [Notion Node](../nodes/notion-node.md) – Notion-inhoud zoeken en beheren
- [Sentry Node](../nodes/sentry-node.md) – Automatisering van Sentry-organisaties, projecten, teams, issues, gebeurtenissen en releases
- [Credentials Sharing](./credentials-sharing.md) – Delen met gebruikers en teams
- [Third-Party Integrations](./integrations.md) – Installatiehandleiding per referentietype
- [Expression DSL](./expression-dsl.md) – `$credentials` in expressies

## Model Router (Auto Model)

Een Model Router bevat geen sleutel. Het bevat een **decision model credential**, een lijst met **modelopties** — elk een bestaande OpenAI-, Google- of Custom-referentie plus een model — en, voor elke optie, vrije tekst die aangeeft wanneer die optie moet worden gebruikt.

Het verschijnt in elke kiezer die een model aanbiedt: de [LLM](../nodes/llm-node.md)- en [Agent](../nodes/agent-node.md)-knooppunten, Chat, AI Defaults, Dashboards, de expressiebouwer en Data Tables. Het enige model is **Auto**. Selecteer het, en het decision model leest elk verzoek en routeert het. [Evals](../tabs/evals-tab.md) laat het buiten beschouwing, omdat een eval specifieke modellen vergelijkt en een router zijn eigen keuze maakt.

Een agent herrouteert naarmate de tool-loop vordert, zodat een goedkoop model de vroege beurten kan nemen en een sterker model de beurt die het nodig heeft. Identieke invoer hergebruikt de vorige beslissing, zodat een loop alleen betaalt voor een beslissing wanneer het gesprek daadwerkelijk is gewijzigd.

### Wat het niet kan

Auto Model kan niet worden gecombineerd met de **Responses API**, **Batch mode** of **image output**. Die schakelaars schakelen zichzelf uit wanneer een router is geselecteerd, en elke schakelaar vermeldt waarom. Guardrail-controles en de classifier voor het human-review-beleid zijn vaste single-model-aanroepen en routeren nooit.

### Wanneer routering mislukt

Markeer één optie **Gebruik deze optie wanneer routering mislukt** en een storing van het beslissingsmodel stopt nooit een uitvoering; de fallback wordt gebruikt en de reden wordt vastgelegd bij de uitvoering. Zonder deze optie mislukt het knooppunt in plaats van te gokken.

### Zien waar een aanvraag naartoe ging

Traces toont `Auto Model / GPT-5` in plaats van alleen het model, en de kosten blijven toegewezen aan het model dat daadwerkelijk heeft gedraaid. Het Execution Log en de Span View op het canvas tonen hetzelfde paar, en de Span View vermeldt welke beurt waar naartoe ging.
