# Fanen Legitimationsoplysninger

Fanen **Legitimationsoplysninger** håndterer API-nøgler og hemmeligheder, der bruges af noder. Her kan der tilføjes legitimationsoplysninger, som derefter refereres til ved navn i workflow-noder. For en oversigt over, hvad legitimationsoplysninger er, og hvordan noder bruger dem, se [Legitimationsoplysninger](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Se demo af Legitimationsoplysninger</a></p>

## Typer af legitimationsoplysninger

| Type | Anvendelsestilfælde |
|------|----------|
| **OpenAI** | OpenAI API-nøgle til LLM-, Agent- og RAG-noder |
| **Google** | Google AI (Gemini) API-nøgle |
| **GitHub** | GitHub personal access token (PAT) til GitHub API, GitHub-node-workflows, MCP-servere og agent-workflows; valgfri GitHub Enterprise `base_url` |
| **Linear** | Linear personlig API-nøgle eller OAuth2 til teams, projekter, issues og kommentarer |
| **Notion** | Intern integrationstoken eller OAuth-arbejdsområdegodkendelse til offentlig integration |
| **Custom** | Brugerdefinerede LLM-endpoints |
| **Bearer** | Bearer-token til HTTP-godkendelse |
| **Header** | Brugerdefineret header key-value til HTTP-forespørgsler |
| **Telegram** | Telegram-bottoken og valgfri webhook-hemmelighed |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Discord-applikations offentlige nøgle |
| **IMAP** | Legitimationsoplysninger til indgående mailbokstriggers |
| **SMTP** | Legitimationsoplysninger til e-mailafsendelse |
| **Redis** | Redis-forbindelse |
| **RAG: Qdrant + OpenAI** | Vektorlagring til RAG-noder, understøttet af en ekstern Qdrant-server |
| **RAG: Psql + OpenAI** | Vektorlagring til RAG-noder, understøttet af Heyms egen Postgres-database (pgvector) – ingen ekstern tjeneste |
| **RAG: Custom Embeddings** | Vektorlagring til RAG-noder ved brug af ethvert OpenAI-kompatibelt embedding-endpoint, med Qdrant eller Postgres (pgvector) som lagring |
| **Cohere** | Cohere API til embeddings |

## Tilføjelse af legitimationsoplysninger

1. Klik på **Tilføj legitimationsoplysninger**
2. Vælg typen af legitimationsoplysninger
3. Indtast de påkrævede værdier (API-nøgle, URL osv.)
4. Giv dem et navn til reference i noder

For GitHub er den nuværende flow PAT-baseret. Fine-grained PATs anbefales. GitHub App-installationsflows er ikke førsteklasses i brugergrænsefladen i dag. Hvis der bruges GitHub Enterprise Server, kan der også indstilles en valgfri GitHub API base URL såsom `https://github.example.com/api/v3`.

For Linear vælges **Personal API key** eller **OAuth2** i dialogen. Personlige API-nøgler oprettes under **Settings → Security & Access → Personal API keys** i Linear. OAuth2 bruger en Linear OAuth-applikations Client ID og Client Secret, med `{FRONTEND_URL}/api/credentials/linear/oauth/callback` registreret som redirect-URI. Legitimationsoplysningerne virker med de tilladelser, som den Linear-bruger har, der oprettede eller godkendte dem. Brug **Test Connection** i legitimationsdialogen til at verificere API-nøglen eller OAuth-tokenet før gemning.

For **Notion** vælges **Internal token** eller **OAuth** i dialogen. OAuth bruger Client ID og Client Secret fra den offentlige Notion-integration; Heym gemmer dem krypteret i legitimationsoplysningerne. Brug **Test Connection** til at verificere Supabase-, Linear- eller Notion-legitimationsoplysninger før gemning af et workflow. Se [Tredjepartsintegrationer](../reference/integrations.md#notion) for detaljer om Notion-opsætning.

OAuth-legitimationsoplysninger åbner udbyderens godkendelsesside i en popup. Hvis browseren blokerer den, skal der bruges linket **Open the authorization page** under Connect-knappen; dialogen registrerer, når forbindelsen er fuldført. Når nye legitimationsoplysninger er forbundet, viser knappen **Connected**.

## Redigering og sletning

- **Rediger** – Opdater værdier for legitimationsoplysninger (følsomme værdier er maskerede)
- **Slet** – Fjern legitimationsoplysninger; workflows, der bruger dem, vil kræve en erstatning

Ved redigering af **GitHub**-legitimationsoplysninger på GitHub Enterprise Server bevares det eksisterende Enterprise-endpoint, hvis det valgfrie **GitHub API Base URL** efterlades tomt. Indtast kun en ny URL, hvis der ønskes at ændre dette endpoint.

## Deling

- [Del legitimationsoplysninger](../reference/credentials-sharing.md) med andre brugere via e-mail eller med [Teams](../reference/teams.md)
- Delte legitimationsoplysninger vises med en indikator
- Tilbagekald deling fra menuen på legitimationskortet
## Brug i Noder

Referer til legitimationsoplysninger ved navn i nodekonfigurationen. For eksempel:
- [LLM-node](../nodes/llm-node.md) – Vælg legitimationsoplysninger til model-API'en
- [HTTP-node](../nodes/http-node.md) – Brug Bearer- eller Header-legitimationsoplysninger til autentifikation
- [Agent-node](../nodes/agent-node.md) – Overfør GitHub-tokens til MCP-serverens miljøvariabler såsom `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub-node](../nodes/github-node.md) – Udfør native GitHub-operationer for repository, bruger, issue, review, release, workflow, trafik og filer
- [Linear-node](../nodes/linear-node.md) – Læs workspace-metadata og automatiser Linear-issues og kommentarer
- [Notion-node](../nodes/notion-node.md) – Håndter Notion-databaser, datakilder, sider og blokke
- [RAG-node](../nodes/rag-node.md) – Brug en Qdrant- eller Postgres (pgvector)-legitimationsoplysning til vektorlagret
- [Telegram Trigger-node](../nodes/telegram-trigger-node.md) – Modtag Telegram-bot-webhooks
- [Telegram-node](../nodes/telegram-node.md) – Send Telegram-botbeskeder
- [Discord Trigger-node](../nodes/discord-trigger-node.md) – Modtag Discord-interaktionswebhooks
- [Discord-node](../nodes/discord-node.md) – Send Discord-webhookbeskeder
- [IMAP Trigger-node](../nodes/imap-trigger-node.md) – Afsøg en delt indbakke for nye emails

Se [Expression DSL](../reference/expression-dsl.md) for at referere til værdier baseret på legitimationsoplysninger i udtryk.

## Relateret

- [Tredjepartsintegrationer](../reference/integrations.md) – Detaljeret opsætningsvejledning for hver legitimationsoplysningstype (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack med flere)
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md) – Del legitimationsoplysninger med andre brugere
- [Sikkerhed](../reference/security.md) – Kryptering i hvile, sessionhåndtering, rate limiting
- [Nodetyper](../reference/node-types.md) – Noder, der bruger legitimationsoplysninger ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vektorlagre-fane](./vectorstores-tab.md) – Bruger Qdrant- eller Postgres (pgvector)-legitimationsoplysninger
- [Chat-fane](./chat-tab.md) – Bruger OpenAI/Google-legitimationsoplysninger
- [Kontekstuel visning](../reference/contextual-showcase.md) – Kompakt sidevejledning til dashboard-overflader
