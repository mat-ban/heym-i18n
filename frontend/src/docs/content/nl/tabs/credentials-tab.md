# Tabblad Referenties

Het tabblad **Referenties** beheert API-sleutels en secrets die door knooppunten worden gebruikt. Voeg hier referenties toe en verwijs ernaar op naam in workflow-knooppunten. Voor een overzicht van wat referenties zijn en hoe knooppunten deze gebruiken, zie [Referenties](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Bekijk de demo van Referenties</a></p>

## Typen referenties

| Type | Gebruiksscenario |
|------|----------|
| **OpenAI** | OpenAI API-sleutel voor LLM-, Agent- en RAG-knooppunten |
| **Google** | Google AI (Gemini) API-sleutel |
| **GitHub** | GitHub personal access token (PAT) voor GitHub API, GitHub-knooppuntworkflows, MCP-servers en agent-workflows; optionele GitHub Enterprise `base_url` |
| **Linear** | Linear personal API-sleutel of OAuth2 voor teams, projecten, issues en opmerkingen |
| **Notion** | Internal integration token of OAuth-werkruimteautorisatie voor publieke integraties |
| **Custom** | Aangepaste LLM-endpoints |
| **Bearer** | Bearer-token voor HTTP-authenticatie |
| **Header** | Aangepaste header key-value voor HTTP-verzoeken |
| **Telegram** | Telegram bot-token en optioneel webhook-secret |
| **Slack** | Slack incoming webhook-URL |
| **Discord** | Discord incoming webhook-URL |
| **Discord Trigger** | Discord applicatie public key |
| **IMAP** | Referenties voor inkomende mailbox-trigger |
| **SMTP** | Referenties voor e-mailverzending |
| **Redis** | Redis-verbinding |
| **RAG: Qdrant + OpenAI** | Vectoropslag voor RAG-knooppunten, ondersteund door een externe Qdrant-server |
| **RAG: Psql + OpenAI** | Vectoropslag voor RAG-knooppunten, ondersteund door Heyms eigen Postgres-database (pgvector) — geen externe service |
| **RAG: Custom Embeddings** | Vectoropslag voor RAG-knooppunten met elk OpenAI-compatibel embedding-endpoint, met Qdrant of Postgres (pgvector) als opslag |
| **Cohere** | Cohere API voor embeddings |

## Referenties toevoegen

1. Klik op **Referentie toevoegen**
2. Kies het type referentie
3. Voer de vereiste waarden in (API-sleutel, URL, enz.)
4. Geef de referentie een naam voor verwijzing in knooppunten

Voor GitHub is de huidige referentiestroom gebaseerd op PAT. Fine-grained PAT's worden aanbevolen. GitHub App-installatiestromen zijn vandaag de dag niet first-class in de UI. Bij gebruik van GitHub Enterprise Server kan ook een optionele GitHub API base URL worden ingesteld, zoals `https://github.example.com/api/v3`.

Kies voor Linear **Personal API key** of **OAuth2** in het dialoogvenster. Personal API-sleutels worden aangemaakt
onder **Settings → Security & Access → Personal API keys** in Linear. OAuth2 gebruikt een Linear OAuth-
applicatie Client ID en Client Secret, met `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
geregistreerd als redirect-URI. De referentie handelt met de machtigingen van de Linear-gebruiker die
deze heeft aangemaakt of geautoriseerd. Gebruik **Test Connection** in het referentiedialoogvenster om de API-sleutel of
OAuth-token te verifiëren voordat u opslaat.

Kies voor **Notion** **Internal token** of **OAuth** in het dialoogvenster. OAuth gebruikt de Client ID en
Client Secret van uw Notion publieke integratie; Heym slaat deze versleuteld op in de referentie.
Gebruik **Test Connection** om Supabase-, Linear- of Notion-referenties te verifiëren voordat u een workflow opslaat. Zie
[Third-Party Integrations](../reference/integrations.md#notion) voor details over de Notion-configuratie.

OAuth-referenties openen de autorisatiepagina van de provider in een popup. Als de browser deze blokkeert, gebruik dan de link **Open the authorization page** onder de Connect-knop; het dialoogvenster merkt op wanneer de verbinding is voltooid. Zodra een nieuwe referentie is verbonden, toont de knop **Connected**.

## Bewerken en verwijderen

- **Bewerken** – Referentiewaarden bijwerken (gevoelige waarden worden gemaskeerd)
- **Verwijderen** – Een referentie verwijderen; workflows die deze gebruiken hebben een vervanging nodig

Bij het bewerken van een **GitHub**-referentie op GitHub Enterprise Server blijft het bestaande Enterprise-endpoint behouden wanneer het optionele veld **GitHub
API Base URL** leeg wordt gelaten. Voer alleen een nieuwe URL in wanneer u
dat endpoint wilt wijzigen.

## Delen

- [Deel referenties](../reference/credentials-sharing.md) met andere gebruikers via e-mail of met [Teams](../reference/teams.md)
- Gedeelde referenties verschijnen met een indicator
- Trek het delen in via het menu van de referentiekaart

## Gebruik in Nodes

Verwijs naar inloggegevens op naam in de node-configuratie. Bijvoorbeeld:
- [LLM-node](../nodes/llm-node.md) – Selecteer inloggegevens voor de model-API
- [HTTP-node](../nodes/http-node.md) – Gebruik Bearer- of Header-inloggegevens voor authenticatie
- [Agent-node](../nodes/agent-node.md) – Geef GitHub-tokens door aan MCP-server env-variabelen zoals `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub-node](../nodes/github-node.md) – Voer native GitHub-repository-, gebruiker-, issue-, review-, release-, workflow-, traffic- en bestandsbewerkingen uit
- [Linear-node](../nodes/linear-node.md) – Lees workspace-metadata en automatiseer Linear-issues en -opmerkingen
- [Notion-node](../nodes/notion-node.md) – Beheer Notion-databases, databronnen, pagina's en blokken
- [RAG-node](../nodes/rag-node.md) – Gebruik een Qdrant- of Postgres (pgvector)-inloggegeven voor de vectoropslag
- [Telegram Trigger-node](../nodes/telegram-trigger-node.md) – Ontvang Telegram-bot-webhooks
- [Telegram-node](../nodes/telegram-node.md) – Verzend Telegram-bot-berichten
- [Discord Trigger-node](../nodes/discord-trigger-node.md) – Ontvang Discord-interactie-webhooks
- [Discord-node](../nodes/discord-node.md) – Verzend Discord-webhook-berichten
- [IMAP Trigger-node](../nodes/imap-trigger-node.md) – Poll een gedeelde inbox voor nieuwe e-mail

Zie [Expression DSL](../reference/expression-dsl.md) voor het verwijzen naar waarden die door inloggegevens worden ondersteund in expressies.

## Gerelateerd

- [Integraties van derden](../reference/integrations.md) – Gedetailleerde installatiehandleiding voor elk type inloggegeven (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack en meer)
- [Inloggegevens delen](../reference/credentials-sharing.md) – Deel inloggegevens met andere gebruikers
- [Beveiliging](../reference/security.md) – Versleuteling in rust, sessiebeheer, rate limiting
- [Node-typen](../reference/node-types.md) – Nodes die inloggegevens gebruiken ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Tabblad Vectoropslag](./vectorstores-tab.md) – Gebruikt Qdrant- of Postgres (pgvector)-inloggegevens
- [Tabblad Chat](./chat-tab.md) – Gebruikt OpenAI/Google-inloggegevens
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboard-oppervlakken
