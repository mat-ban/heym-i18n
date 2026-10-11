# Karta Přihlašovací údaje

Karta **Přihlašovací údaje** spravuje API klíče a tajné údaje používané uzly. Zde přidejte přihlašovací údaje a odkazujte na ně podle názvu v uzlech workflow. Přehled o tom, co jsou přihlašovací údaje a jak je uzly používají, najdete v části [Přihlašovací údaje](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Přehrát ukázku Přihlašovacích údajů</a></p>

## Typy přihlašovacích údajů

| Typ | Použití |
|------|----------|
| **OpenAI** | OpenAI API klíč pro uzly LLM, Agent a RAG |
| **Google** | Google AI (Gemini) API klíč |
| **GitHub** | GitHub personal access token (PAT) pro GitHub API, workflow s uzlem GitHub, MCP servery a workflow agentů; volitelná adresa `base_url` pro GitHub Enterprise |
| **Linear** | Linear osobní API klíč nebo OAuth2 pro týmy, projekty, úkoly a komentáře |
| **Notion** | Interní integrační token nebo autorizace pracovního prostoru pomocí OAuth veřejné integrace |
| **Custom** | Vlastní LLM endpointy |
| **Bearer** | Bearer token pro HTTP autentizaci |
| **Header** | Vlastní hlavička key-value pro HTTP požadavky |
| **Telegram** | Telegram bot token a volitelný webhook secret |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Veřejný klíč aplikace Discord |
| **IMAP** | Přihlašovací údaje pro trigger příchozí pošty |
| **SMTP** | Přihlašovací údaje pro odesílání e-mailů |
| **Redis** | Připojení k Redis |
| **RAG: Qdrant + OpenAI** | Vektorové úložiště pro uzly RAG, zajištěné externím serverem Qdrant |
| **RAG: Psql + OpenAI** | Vektorové úložiště pro uzly RAG, zajištěné vlastní databází Postgres v Heym (pgvector) — bez externí služby |
| **RAG: Custom Embeddings** | Vektorové úložiště pro uzly RAG používající jakýkoli embedding endpoint kompatibilní s OpenAI, s Qdrant nebo Postgres (pgvector) jako úložištěm |
| **Cohere** | Cohere API pro embeddingy |

## Přidání přihlašovacích údajů

1. Klikněte na **Přidat přihlašovací údaje**
2. Zvolte typ přihlašovacích údajů
3. Zadejte požadované hodnoty (API klíč, URL atd.)
4. Pojmenujte je pro odkazování v uzlech

Pro GitHub je aktuální postup přihlašovacích údajů založen na PAT. Doporučují se fine-grained PAT. Postupy instalace GitHub App nejsou v současnosti v uživatelském rozhraní plnohodnotně podporovány. Pokud používáte GitHub Enterprise Server, můžete také nastavit volitelnou základní adresu GitHub API, například `https://github.example.com/api/v3`.

Pro Linear zvolte v dialogu **Personal API key** nebo **OAuth2**. Osobní API klíče se vytvářejí
v Linear v části **Settings → Security & Access → Personal API keys**. OAuth2 používá Client ID a
Client Secret aplikace Linear OAuth, s `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrovanou jako redirect URI. Přihlašovací údaje jednají s oprávněními uživatele Linear, který
je vytvořil nebo autorizoval. Před uložením ověřte API klíč nebo OAuth token pomocí **Test Connection**
v dialogu přihlašovacích údajů.

Pro **Notion** zvolte v dialogu **Internal token** nebo **OAuth**. OAuth používá Client ID a
Client Secret z vaší veřejné integrace Notion; Heym je ukládá šifrované v přihlašovacích údajích.
Před uložením workflow ověřte přihlašovací údaje Supabase, Linear nebo Notion pomocí **Test Connection**. Podrobnosti o nastavení Notion najdete v části
[Integrace třetích stran](../reference/integrations.md#notion).

Přihlašovací údaje OAuth otevírají autorizační stránku poskytovatele ve vyskakovacím okně. Pokud je prohlížeč zablokuje, použijte odkaz **Open the authorization page** pod tlačítkem Connect; dialog rozpozná dokončení připojení. Jakmile jsou nové přihlašovací údaje připojeny, tlačítko zobrazí **Connected**.

## Úpravy a mazání

- **Upravit** – Aktualizujte hodnoty přihlašovacích údajů (citlivé hodnoty jsou maskovány)
- **Smazat** – Odstraňte přihlašovací údaje; workflow, které je používají, budou potřebovat náhradu

Při úpravě přihlašovacích údajů **GitHub** na GitHub Enterprise Server ponechání volitelného pole **GitHub
API Base URL** prázdné zachová stávající Enterprise endpoint. Novou URL zadejte pouze tehdy, když
chcete tento endpoint změnit.

## Sdílení

- [Sdílejte přihlašovací údaje](../reference/credentials-sharing.md) s dalšími uživateli e-mailem nebo s [Týmy](../reference/teams.md)
- Sdílené přihlašovací údaje se zobrazují s indikátorem
- Zrušte sdílení z nabídky karty přihlašovacích údajů
## Použití v uzlech

Odkazujte na přihlašovací údaje podle názvu v konfiguraci uzlu. Například:
- [Uzel LLM](../nodes/llm-node.md) – Vyberte přihlašovací údaje pro API modelu
- [Uzel HTTP](../nodes/http-node.md) – Použijte přihlašovací údaje Bearer nebo Header pro autentizaci
- [Uzel Agent](../nodes/agent-node.md) – Předávejte GitHub tokeny do proměnných prostředí MCP serveru, jako je `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Uzel GitHub](../nodes/github-node.md) – Spouštějte nativní operace s repozitáři, uživateli, issues, recenzemi, releases, workflow, provozem a soubory na GitHubu
- [Uzel Linear](../nodes/linear-node.md) – Čtěte metadata pracovního prostoru a automatizujte Linear issues a komentáře
- [Uzel Notion](../nodes/notion-node.md) – Spravujte databáze, zdroje dat, stránky a bloky Notion
- [Uzel RAG](../nodes/rag-node.md) – Použijte přihlašovací údaje Qdrant nebo Postgres (pgvector) pro vektorové úložiště
- [Uzel Telegram Trigger](../nodes/telegram-trigger-node.md) – Přijímejte webhooky Telegram bota
- [Uzel Telegram](../nodes/telegram-node.md) – Odesílejte zprávy Telegram bota
- [Uzel Discord Trigger](../nodes/discord-trigger-node.md) – Přijímejte webhooky interakcí Discord
- [Uzel Discord](../nodes/discord-node.md) – Odesílejte webhookové zprávy Discord
- [Uzel IMAP Trigger](../nodes/imap-trigger-node.md) – Dotazujte sdílenou schránku na nové e-maily

Podívejte se na [Expression DSL](../reference/expression-dsl.md) pro odkazování na hodnoty podložené přihlašovacími údaji ve výrazech.

## Související

- [Integrace třetích stran](../reference/integrations.md) – Podrobný průvodce nastavením pro každý typ přihlašovacích údajů (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack a další)
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md) – Sdílejte přihlašovací údaje s ostatními uživateli
- [Zabezpečení](../reference/security.md) – Šifrování v klidu, správa relací, omezování rychlosti
- [Typy uzlů](../reference/node-types.md) – Uzly, které používají přihlašovací údaje ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Záložka Vectorstores](./vectorstores-tab.md) – Používá přihlašovací údaje Qdrant nebo Postgres (pgvector)
- [Záložka Chat](./chat-tab.md) – Používá přihlašovací údaje OpenAI/Google
- [Kontextová prezentace](../reference/contextual-showcase.md) – Kompaktní průvodce stránkami pro povrchy dashboardu
