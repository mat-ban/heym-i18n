# Karta Prihlasovacích údajov

Karta **Prihlasovacie údaje** spravuje API kľúče a tajné údaje používané uzlami. Pridajte prihlasovacie údaje tu a odkazujte na ne podľa názvu v uzloch workflowu. Pre prehľad o tom, čo sú prihlasovacie údaje a ako ich uzly používajú, pozrite si [Prihlasovacie údaje](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Pozrite si ukážku Prihlasovacích údajov</a></p>

## Typy prihlasovacích údajov

| Typ | Použitie |
|------|----------|
| **OpenAI** | OpenAI API kľúč pre uzly LLM, Agent a RAG |
| **Google** | Google AI (Gemini) API kľúč |
| **GitHub** | GitHub personal access token (PAT) pre GitHub API, workflowy s uzlom GitHub, MCP servery a workflowy agentov; voliteľná `base_url` pre GitHub Enterprise |
| **Linear** | Linear personal API kľúč alebo OAuth2 pre tímy, projekty, úlohy a komentáre |
| **Notion** | Interný integračný token alebo autorizácia pracovného priestoru cez OAuth verejnej integrácie |
| **Custom** | Vlastné LLM endpointy |
| **Bearer** | Bearer token pre HTTP autentifikáciu |
| **Header** | Vlastný header kľúč-hodnota pre HTTP požiadavky |
| **Telegram** | Telegram bot token a voliteľný webhook secret |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Verejný kľúč Discord aplikácie |
| **IMAP** | Prihlasovacie údaje pre trigger prichádzajúcej pošty |
| **SMTP** | Prihlasovacie údaje pre odosielanie e-mailov |
| **Redis** | Redis pripojenie |
| **RAG: Qdrant + OpenAI** | Vektorové úložisko pre uzly RAG, podporované externým Qdrant serverom |
| **RAG: Psql + OpenAI** | Vektorové úložisko pre uzly RAG, podporované vlastnou Postgres databázou Heym (pgvector) — bez externej služby |
| **RAG: Custom Embeddings** | Vektorové úložisko pre uzly RAG používajúce akýkoľvek OpenAI-kompatibilný embedding endpoint, s Qdrant alebo Postgres (pgvector) ako úložiskom |
| **Cohere** | Cohere API pre embeddingy |

## Pridávanie prihlasovacích údajov

1. Kliknite na **Pridať prihlasovacie údaje**
2. Vyberte typ prihlasovacích údajov
3. Zadajte požadované hodnoty (API kľúč, URL atď.)
4. Priraďte im názov pre odkazovanie v uzloch

Pre GitHub je aktuálny postup prihlasovacích údajov založený na PAT. Odporúčajú sa fine-grained PAT. Postupy inštalácie GitHub App dnes nie sú v UI plnohodnotne podporované. Ak používate GitHub Enterprise Server, môžete tiež nastaviť voliteľnú základnú URL GitHub API, napríklad `https://github.example.com/api/v3`.

Pre Linear vyberte v dialógovom okne **Personal API key** alebo **OAuth2**. Personal API kľúče sa vytvárajú
v Linear pod **Settings → Security & Access → Personal API keys**. OAuth2 používa Client ID a Client Secret
aplikácie Linear OAuth, s `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrovanou ako redirect URI. Prihlasovacie údaje konajú s oprávneniami používateľa Linear, ktorý
ich vytvoril alebo autorizoval. Pred uložením overte API kľúč alebo
OAuth token pomocou **Test Connection** v dialógovom okne prihlasovacích údajov.

Pre **Notion** vyberte v dialógovom okne **Internal token** alebo **OAuth**. OAuth používa Client ID a
Client Secret z vašej verejnej integrácie Notion; Heym ich ukladá šifrované v prihlasovacích údajoch.
Pred uložením workflowu overte prihlasovacie údaje Supabase, Linear alebo Notion pomocou **Test Connection**. Podrobnosti o nastavení Notion nájdete v
[Third-Party Integrations](../reference/integrations.md#notion).

Prihlasovacie údaje OAuth otvárajú autorizačnú stránku poskytovateľa v popupe. Ak ju prehliadač zablokuje, použite odkaz **Open the authorization page** pod tlačidlom Connect; dialógové okno rozpozná, keď sa pripojenie dokončí. Po pripojení nových prihlasovacích údajov tlačidlo zobrazuje **Connected**.

## Úprava a odstraňovanie

- **Edit** – Aktualizujte hodnoty prihlasovacích údajov (citlivé hodnoty sú maskované)
- **Delete** – Odstráňte prihlasovacie údaje; workflowy, ktoré ich používajú, budú potrebovať náhradu

Pri úprave prihlasovacích údajov **GitHub** na GitHub Enterprise Server ponechanie voliteľného poľa **GitHub
API Base URL** prázdneho zachová existujúci Enterprise endpoint. Novú URL zadajte len vtedy, keď
chcete tento endpoint zmeniť.

## Zdieľanie

- [Zdieľajte prihlasovacie údaje](../reference/credentials-sharing.md) s ostatnými používateľmi e-mailom alebo s [Tímami](../reference/teams.md)
- Zdieľané prihlasovacie údaje sa zobrazujú s indikátorom
- Zrušte zdieľanie z ponuky karty prihlasovacích údajov
## Používanie v uzloch

Referenčné prihlasovacie údaje podľa názvu v konfigurácii uzla. Napríklad:
- [Uzol LLM](../nodes/llm-node.md) – Vyberte prihlasovacie údaje pre API modelu
- [Uzol HTTP](../nodes/http-node.md) – Použite Bearer alebo Header prihlasovacie údaje na autentifikáciu
- [Uzol Agent](../nodes/agent-node.md) – Odovzdajte GitHub tokeny do premenných prostredia MCP servera, ako napríklad `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Uzol GitHub](../nodes/github-node.md) – Spúšťajte natívne operácie s GitHub repozitármi, používateľmi, issue, recenziami, vydaniami, workflowmi, návštevnosťou a súbormi
- [Uzol Linear](../nodes/linear-node.md) – Čítajte metadáta pracovného priestoru a automatizujte Linear issue a komentáre
- [Uzol Notion](../nodes/notion-node.md) – Spravujte Notion databázy, dátové zdroje, stránky a bloky
- [Uzol RAG](../nodes/rag-node.md) – Použite prihlasovacie údaje Qdrant alebo Postgres (pgvector) pre vektorové úložisko
- [Uzol Telegram Trigger](../nodes/telegram-trigger-node.md) – Prijímajte Telegram bot webhooky
- [Uzol Telegram](../nodes/telegram-node.md) – Odosielajte Telegram bot správy
- [Uzol Discord Trigger](../nodes/discord-trigger-node.md) – Prijímajte Discord interaction webhooky
- [Uzol Discord](../nodes/discord-node.md) – Odosielajte Discord webhook správy
- [Uzol IMAP Trigger](../nodes/imap-trigger-node.md) – Pravidelne kontrolujte zdieľanú schránku na nové e-maily

Pozrite si [Expression DSL](../reference/expression-dsl.md) pre referencovanie hodnôt podporovaných prihlasovacími údajmi vo výrazoch.

## Súvisiace

- [Third-Party Integrations](../reference/integrations.md) – Podrobný sprievodca nastavením pre každý typ prihlasovacích údajov (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack a ďalšie)
- [Credentials Sharing](../reference/credentials-sharing.md) – Zdieľajte prihlasovacie údaje s ostatnými používateľmi
- [Security](../reference/security.md) – Šifrovanie v pokoji, správa relácií, obmedzovanie rýchlosti
- [Node Types](../reference/node-types.md) – Uzly, ktoré používajú prihlasovacie údaje ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Používa prihlasovacie údaje Qdrant alebo Postgres (pgvector)
- [Chat Tab](./chat-tab.md) – Používa prihlasovacie údaje OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
