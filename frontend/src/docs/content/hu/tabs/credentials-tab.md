# Hitelesítési adatok lap

A **Hitelesítési adatok** lap kezeli a csomópontok által használt API-kulcsokat és titkos értékeket. Adjon hozzá hitelesítési adatokat itt, és hivatkozzon rájuk név szerint a workflow-csomópontokban. A hitelesítési adatok fogalmának áttekintéséhez és ahhoz, hogy a csomópontok hogyan használják őket, lásd: [Hitelesítési adatok](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

## Hitelesítési adatok típusai

| Típus | Felhasználási eset |
|------|----------|
| **OpenAI** | OpenAI API-kulcs LLM-, Agent- és RAG-csomópontokhoz |
| **Google** | Google AI (Gemini) API-kulcs |
| **GitHub** | GitHub személyes hozzáférési token (PAT) a GitHub API-hoz, GitHub-csomópont workflow-khoz, MCP-szerverekhez és agent workflow-khoz; opcionális GitHub Enterprise `base_url` |
| **Linear** | Linear személyes API-kulcs vagy OAuth2 csapatokhoz, projektekhez, issue-khoz és hozzászólásokhoz |
| **Notion** | Belső integrációs token vagy nyilvános integrációs OAuth munkaterület-felhatalmazás |
| **Custom** | Egyedi LLM-végpontok |
| **Bearer** | Bearer token HTTP-hitelesítéshez |
| **Header** | Egyedi fejléc kulcs-érték pár HTTP-kérésekhez |
| **Telegram** | Telegram bot token és opcionális webhook secret |
| **Slack** | Slack bejövő webhook URL |
| **Discord** | Discord bejövő webhook URL |
| **Discord Trigger** | Discord alkalmazás nyilvános kulcsa |
| **IMAP** | Bejövő postafiók trigger hitelesítési adatai |
| **SMTP** | E-mail-küldési hitelesítési adatok |
| **Redis** | Redis-kapcsolat |
| **RAG: Qdrant + OpenAI** | Vektortároló RAG-csomópontokhoz, külső Qdrant-szerverrel a háttérben |
| **RAG: Psql + OpenAI** | Vektortároló RAG-csomópontokhoz, a Heym saját Postgres adatbázisával (pgvector) a háttérben — külső szolgáltatás nélkül |
| **RAG: Custom Embeddings** | Vektortároló RAG-csomópontokhoz bármilyen OpenAI-kompatibilis embedding-végponttal, Qdrant vagy Postgres (pgvector) tárolóval |
| **Cohere** | Cohere API embeddingekhez |

## Hitelesítési adatok hozzáadása

1. Kattintson az **Add Credential** gombra
2. Válassza ki a hitelesítési adatok típusát
3. Adja meg a szükséges értékeket (API-kulcs, URL stb.)
4. Adjon neki egy nevet a csomópontokban való hivatkozáshoz

GitHub esetén a jelenlegi hitelesítési folyamat PAT-alapú. A finomhangolt PAT-ok használata javasolt. A GitHub App telepítési folyamatai ma még nem első osztályúak a felületen. Ha GitHub Enterprise Servert használ, beállíthat egy opcionális GitHub API base URL-t is, például `https://github.example.com/api/v3`.

Linear esetén válassza a **Personal API key** vagy az **OAuth2** lehetőséget a párbeszédablakban. A személyes API-kulcsok a Linear **Settings → Security & Access → Personal API keys** menüpontjában hozhatók létre. Az OAuth2 egy Linear OAuth-alkalmazás Client ID-jét és Client Secretjét használja, a `{FRONTEND_URL}/api/credentials/linear/oauth/callback` címet regisztrálva átirányítási URI-ként. A hitelesítési adatok annak a Linear-felhasználónak a jogosultságaival működnek, aki létrehozta vagy engedélyezte azokat. A mentés előtt a hitelesítési adatok párbeszédablakában a **Test Connection** gombbal ellenőrizheti az API-kulcsot vagy az OAuth tokent.

**Notion** esetén válassza az **Internal token** vagy az **OAuth** lehetőséget a párbeszédablakban. Az OAuth a Notion nyilvános integrációjának Client ID-jét és Client Secretjét használja; a Heym ezeket titkosítva tárolja a hitelesítési adatokban. A **Test Connection** gombbal ellenőrizheti a Supabase-, Linear- vagy Notion-hitelesítési adatokat a workflow mentése előtt. A Notion beállításának részleteiért lásd: [Third-Party Integrations](../reference/integrations.md#notion).

Az OAuth-hitelesítési adatok egy felugró ablakban nyitják meg a szolgáltató engedélyezési oldalát. Ha a böngésző blokkolja, használja az **Open the authorization page** hivatkozást a Connect gomb alatt; a párbeszédablak észleli, amikor a kapcsolat létrejön. Amint egy új hitelesítési adat csatlakoztatva van, a gomb a **Connected** feliratot mutatja.

## Szerkesztés és törlés

- **Edit** – A hitelesítési adatok értékeinek frissítése (az érzékeny értékek maszkolva vannak)
- **Delete** – Hitelesítési adatok eltávolítása; a azokat használó workflow-knak helyettesítésre lesz szükségük

Amikor **GitHub**-hitelesítési adatokat szerkeszt GitHub Enterprise Serveren, az opcionális **GitHub API Base URL** üresen hagyása megőrzi a meglévő Enterprise-végpontot. Csak akkor adjon meg új URL-t, ha módosítani szeretné azt a végpontot.

## Megosztás

- [Ossza meg a hitelesítési adatokat](../reference/credentials-sharing.md) más felhasználókkal e-mailben vagy [Teams](../reference/teams.md) segítségével
- A megosztott hitelesítési adatok egy jelzővel jelennek meg
- A megosztás visszavonása a hitelesítési adatok kártyájának menüjéből lehetséges
## Csomópontokban való használat

A hitelesítési adatokat név szerint hivatkozhatja meg a csomópontok konfigurációjában. Például:
- [LLM csomópont](../nodes/llm-node.md) – Válassza ki a modell API-hoz tartozó hitelesítési adatokat
- [HTTP csomópont](../nodes/http-node.md) – Használjon Bearer vagy Header hitelesítési adatokat az auth-hoz
- [Agent csomópont](../nodes/agent-node.md) – Adja át a GitHub tokeneket az MCP szerver környezeti változóiba, például a `GITHUB_PERSONAL_ACCESS_TOKEN` változóba
- [GitHub csomópont](../nodes/github-node.md) – Natív GitHub repository-, felhasználó-, issue-, review-, release-, workflow-, traffic- és fájlműveletek futtatása
- [Linear csomópont](../nodes/linear-node.md) – Munkaterület metaadatainak beolvasása és Linear issue-k és hozzászólások automatizálása
- [Notion csomópont](../nodes/notion-node.md) – Notion adatbázisok, adatforrások, oldalak és blokkok kezelése
- [RAG csomópont](../nodes/rag-node.md) – Használjon Qdrant vagy Postgres (pgvector) hitelesítési adatokat a vektortárolóhoz
- [Telegram Trigger csomópont](../nodes/telegram-trigger-node.md) – Telegram bot webhookok fogadása
- [Telegram csomópont](../nodes/telegram-node.md) – Telegram bot üzenetek küldése
- [Discord Trigger csomópont](../nodes/discord-trigger-node.md) – Discord interakciós webhookok fogadása
- [Discord csomópont](../nodes/discord-node.md) – Discord webhook üzenetek küldése
- [IMAP Trigger csomópont](../nodes/imap-trigger-node.md) – Megosztott postafiók lekérdezése új e-mailek után

A hitelesítési adatokkal támogatott értékek kifejezésekben való hivatkozásáról lásd az [Expression DSL](../reference/expression-dsl.md) oldalt.

## Kapcsolódó tartalmak

- [Third-Party Integrations](../reference/integrations.md) – Részletes beállítási útmutató minden egyes hitelesítési adattípushoz (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack és egyebek)
- [Credentials Sharing](../reference/credentials-sharing.md) – Hitelesítési adatok megosztása más felhasználókkal
- [Security](../reference/security.md) – Titkosítás nyugalmi állapotban, munkamenet-kezelés, sebességkorlátozás
- [Node Types](../reference/node-types.md) – Hitelesítési adatokat használó csomópontok ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Qdrant vagy Postgres (pgvector) hitelesítési adatokat használ
- [Chat Tab](./chat-tab.md) – OpenAI/Google hitelesítési adatokat használ
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
