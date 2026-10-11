# Hitelesítési adatok

A hitelesítési adatok tárolják a workflow-csomópontok által használt API-kulcsokat és titkos értékeket. Ezeket a [Hitelesítési adatok fülön](../tabs/credentials-tab.md) adhatja hozzá, és a csomópontok konfigurációjában név szerint hivatkozhat rájuk.

## Mik a hitelesítési adatok

- **Felhasználónként tárolva** – Minden hitelesítési adat egy felhasználóhoz tartozik, és [megosztható](./credentials-sharing.md) más felhasználókkal vagy [Csapatokkal](./teams.md).
- **Titkosítva tárolva** – Az érzékeny értékek titkosítva vannak; a felhasználói felület a létrehozás után elrejti azokat.
- **Név szerint hivatkozva** – A csomópontok név (vagy ID) alapján választják ki a hitelesítési adatot. A futtatási motor futásidőben oldja fel a hitelesítési adatot a workflow tulajdonosa számára.

## Hogyan használják a csomópontok

| Csomópont típusa | Tipikus hitelesítési adat | Cél |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API-kulcs a modellhez |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) bíráló | Decision Model | Egy döntési modell endpointjának alap URL-je, valamint opcionális API-kulcs |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Kiválasztja, hogy az Ön modelljei közül melyik szolgálja ki az egyes kéréseket, döntési modell segítségével |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-előfizetés bejelentkezés (OAuth) vagy Codex hozzáférési token a runnerhez, valamint GitHub PAT a repository-műveletekhez |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | OpenCode Go gateway API-kulcs (opcionális alap URL) a runnerhez, valamint GitHub PAT a repository-műveletekhez |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub személyes hozzáférési token (PAT) GitHub API-hívásokhoz, GitHub csomópont-műveletekhez és MCP-integrációkhoz |
| [Jira](../nodes/jira-node.md) | Jira | Cloud e-mail/API token vagy Data Center felhasználónév/jelszó, Jira site alap URL, telepítési mód, valamint opcionális REST API verzió |
| [Linear](../nodes/linear-node.md) | Linear | Személyes API-kulcs vagy OAuth2 csapatokhoz, projektekhez, issue-khoz és hozzászólásokhoz |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Hitelesítés kérésekhez |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token és opcionális webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Bejövő webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Alkalmazás nyilvános kulcsa az aláírás-ellenőrzéshez |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektortároló kapcsolat (külső Qdrant, vagy a Heym saját Postgres-e pgvector segítségével), OpenAI vagy bármely OpenAI-kompatibilis embedding endpointtal |
| [Slack](../nodes/slack-node.md) | Slack | Webhook vagy API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Bejövő postafiók kapcsolat |
| [Send Email](../nodes/send-email-node.md) | SMTP | Levelezőszerver |
| [Redis](../nodes/redis-node.md) | Redis | Kapcsolat |
| [Grist](../nodes/grist-node.md) | Grist | API-kulcs + szerver URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 hozzájárulás |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 hozzájárulás |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 hozzájárulás |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekt URL + API-kulcs (+ opcionális alapértelmezett séma) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + felhasználónév/jelszó + adatbázis (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Belső integrációs token, vagy nyilvános integráció Client ID + Client Secret + OAuth hozzájárulás |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token, valamint opcionális saját üzemeltetésű alap URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, régió |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

A részletes beállításról (hostok, portok, szolgáltató-specifikus mezők) lásd a [Third-Party Integrations](./integrations.md) oldalt. Ez tartalmazza a Telegram bot beállítását, a bejövő e-mailt IMAP-on keresztül, valamint a kimenő e-mailt SMTP-n keresztül.

A GitHub hitelesítési adatok opcionálisan tartalmazhatnak egy `base_url` mezőt is, ha GitHub.com helyett GitHub
Enterprise Servert céloz meg. Amikor egy GitHub hitelesítési adatot szerkeszt a token rotálásához,
a `base_url` üresen hagyása megőrzi a meglévő Enterprise endpointot. Csak akkor adjon meg új URL-t, ha
meg kívánja változtatni azt az endpointot.

A Jira, Linear, Supabase, Notion, Sentry és ClickHouse hitelesítési adatok **Test Connection** lehetőséget kínálnak a hitelesítési adat párbeszédablakában. Jira esetén az ellenőrzés a Jira aktuális felhasználó endpointját hívja meg. Linear esetén
az ellenőrzés a Linear API-t hívja meg a `getViewer` metódussal, és megerősíti, hogy az API-kulcs vagy OAuth token érvényes.
Szerkesztéskor anélkül tesztelhet, hogy újra megadná az API-kulcsot, ha a tárolt titkos érték még jelen van. Notion esetén
válassza az **Internal token** vagy az **OAuth** lehetőséget a párbeszédablakban; az OAuth a Notion nyilvános integrációjából származó Client ID-t és Client Secretet
használja. A Notion beállítás részleteiről lásd a [Third-Party Integrations](./integrations.md#notion) oldalt.
## Coding-csomag használata

A [Beállítások](./user-settings.md) **AI Defaults** lapja megmutatja a Codex hitelesítési adatokhoz (saját és megosztott) tartozó hátralévő coding-csomag használatot. Minden Codex hitelesítési adathoz vízszintes sávot jelenít meg minden aktív rate-limit ablakhoz — jellemzően egy **5 órás** és/vagy **Heti** ablakhoz, a csomagtól függően —, a hátralévő kvóta százalékával és az újraindítás visszaszámlálásával. Az adatok a Codex backend rate-limit válaszfejlécéből származnak, igény szerint lekérve.

Az OpenCode Go hitelesítési adatok is szerepelnek ott, de **"usage unavailable"** jelöléssel: az OpenCode zen gateway nem teszi közzé a hátralévő kvóta adatait, így sáv nem jeleníthető meg.

## Kifejezésekben

Egyes csomópontok engedélyezik a kifejezéseket a hitelesítéshez. Használja az [Expression DSL](./expression-dsl.md) nyelvet a `$credentials.CredentialName` hivatkozással, hogy egy kifejezésen belül hivatkozzon egy hitelesítési adat feloldott titkos értékére. Az egyes hitelesítési adattípusokhoz szükséges fejlécsorról HTTP kérésben lásd: [HTTP › Hitelesítés hitelesítési adatokkal](../nodes/http-node.md#authenticating-with-credentials).

A Codex hitelesítési adatok szándékosan ki vannak zárva a `$credentials` alól. Akár ChatGPT-vel jelentkezik be (előfizetés, tokenenkénti API-költség nélkül), akár beilleszt egy Codex `access_token`-t, a tokenek csak a helyi Codex runner folyamatnak adódnak át. A ChatGPT bejelentkezési tokenek automatikusan frissülnek, amikor lejárnak.

A Jira hitelesítési adatok szintén ki vannak zárva a `$credentials` alól. A [Jira csomópont](../nodes/jira-node.md) futásidőben tölti be a hitelesítési adatot a `credentialId` alapján. A Jira csomópont által nem lefedett egyedi Jira REST hívásokhoz használja a [HTTP csomópontot](../nodes/http-node.md) Jira Basic Auth-tal (`email:api_token` a Jira Cloud esetén vagy `username:password` a Data Center / Server esetén), például `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Használhat [Header](../nodes/http-node.md) hitelesítési adatot is `Authorization: Basic <base64(user:secret)>` értékkel. A Jira Data Center / Server személyes hozzáférési tokeneket és a Bearer hitelesítést a Jira hitelesítési adat egyelőre nem támogatja.

| Hitelesítési adat típusa | A `$credentials.Name` számára elérhető érték |
|-----------------|--------------------------------------|
| Bearer | Bearer token karakterlánc |
| Header | Teljes `header key: header value` sor, készen a cURL `-H` argumentumába illesztésre |
| GitHub | Személyes hozzáférési token |
| Notion | Belső `api_token` vagy OAuth `access_token` (Bearer token a Notion API hívásokhoz) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Példa:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

A natív adatbázis-, oldal- és blokkműveletekhez használja a Notion **csomópontot**. A `$credentials` akkor használja, amikor egy egyedi [HTTP](../nodes/http-node.md) kérésnek ugyanarra a Notion bearer tokenre van szüksége.

## Hitelesítési adatok létrehozása a Chatből

Az [AI Assistant](./ai-assistant.md#credentials), a [Chat lap](../tabs/chat-tab.md) és a [Chat with Heym](./chat-with-heym.md) létrehozhat egy hitelesítési adatot, amikor egy workflow-nak szüksége van rá, vagy amikor Ön kéri. Az asszisztens javasol egy típust és egy nevet, és a szokásos hitelesítési adat űrlap megnyílik a beszélgetésben. Kérje egy Ön tulajdonában lévő hitelesítési adat frissítését, és ugyanaz az űrlap nyílik meg rajta, a titkos értékek maszkolva. Az asszisztens csak a nevet és a típust látja. A `heym_chat` az [MCP](../tabs/mcp-tab.md) felett nem tud hitelesítési adatot létrehozni, frissíteni vagy kiválasztani.

## Kapcsolódó

- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Hitelesítési adatok hozzáadása, szerkesztése, törlése
- [GitHub csomópont](../nodes/github-node.md) – Natív GitHub REST műveletek
- [Jira csomópont](../nodes/jira-node.md) – Jira projekt, issue, hozzászólás, melléklet, felhasználó, értesítés és átmenet automatizálás
- [Linear csomópont](../nodes/linear-node.md) – Linear GraphQL munkaterület és issue automatizálás
- [Notion csomópont](../nodes/notion-node.md) – Notion tartalom keresése és kezelése
- [Sentry csomópont](../nodes/sentry-node.md) – Sentry szervezet, projekt, csapat, issue, esemény és kiadás automatizálás
- [Hitelesítési adatok megosztása](./credentials-sharing.md) – Megosztás felhasználókkal és csapatokkal
- [Harmadik féltől származó integrációk](./integrations.md) – Beállítási útmutató hitelesítési adat típusonként
- [Expression DSL](./expression-dsl.md) – `$credentials` a kifejezésekben

## Model Router (Auto Model)

A Model Router nem tárol kulcsot. Tartalmaz egy **decision model hitelesítési adatot**, egy listát a **modell opciókról** — mindegyik egy meglévő OpenAI, Google vagy Custom hitelesítési adat plusz egy modell —, és minden opcióhoz egy szabad szöveget arról, hogy mikor kell azt az opciót használni.

Minden modellt kínáló választóban megjelenik: az [LLM](../nodes/llm-node.md) és [Agent](../nodes/agent-node.md) csomópontokban, a Chatben, az AI Defaultsban, a Dashboardokon, a kifejezés-szerkesztőben és az Adattáblákban. Az egyetlen modellje az **Auto**. Válassza ki, és a decision model elolvassa az egyes kéréseket és irányítja azokat. Az [Evals](../tabs/evals-tab.md) kihagyja, mert az eval konkrét modelleket hasonlít össze, a router pedig saját maga választ.

Az agent újrairányít, ahogy a tool loop előrehalad, így egy olcsó modell elvégezheti a korai köröket, egy erősebb pedig azt a kört, amelyiknek szüksége van rá. Az azonos bemenetek újrahasználják az előző döntést, így egy loop csak akkor fizet a döntésért, amikor a beszélgetés ténylegesen továbbhaladt.

### Amit nem tud

Az Auto Model nem kombinálható a **Responses API**-val, a **Batch mode**-dal vagy a **kép kimenettel**. Ezek a kapcsolók letiltják magukat, amikor egy router van kiválasztva, és mindegyik megmondja, miért. A guardrail ellenőrzések és a human-review policy osztályozó rögzített egyetlen modell hívások, és soha nem irányítanak.
### Amikor az útválasztás meghiúsul

Jelöljön meg egy opciót a **Use this option when routing fails** beállítással, és a döntési modell kiesése soha nem állítja le a futtatást; a tartalék (fallback) kerül alkalmazásra, és az ok rögzítésre kerül a futtatásban. Ennek hiányában a csomópont meghiúsul a találgatás helyett.

### Annak megtekintése, hogy egy kérés hová irányult

A Traces az `Auto Model / GPT-5` értéket mutatja a modell helyett, és a költség továbbra is ahhoz a modellhez rendelődik, amely ténylegesen lefutott. A vászon Execution Log és Span View ugyanezt a párt mutatja, a Span View pedig felsorolja, hogy melyik kör hová irányult.
