# Harmadik féltől származó integrációk

A Heym **hitelesítési adatokon** keresztül csatlakozik külső szolgáltatásokhoz. Minden hitelesítési adat típus egy szolgáltatás kapcsolódási részleteit tárolja, és több csomópontban és workflow-ban is újra felhasználható. Az áttekintésért lásd a [Hitelesítési adatok](./credentials.md) oldalt.

Hitelesítési adatokat a [Beállítások → Hitelesítési adatok](../tabs/credentials-tab.md) menüpontban adhat hozzá. Minden érték titkosítva van tárolás közben. A hitelesítési adatok [megoszthatók](./credentials-sharing.md) más felhasználókkal vagy [Csapatokkal](./teams.md).

Egyes integrációs csomópontok **nem** igényelnek hitelesítési adatokat. A [WebSocket Trigger](../nodes/websocket-trigger-node.md) és a [WebSocket Send](../nodes/websocket-send-node.md) a csomóponton közvetlenül beállított URL, fejlécek és alprotokollok használatával csatlakozik külső socketekhez.

## Hitelesítési adat típusok áttekintése

| Típus | Felhasználja | Kulcsmezők |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opcionális `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opcionális `base_url` |
| **Jira** | [Jira csomópont](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, opcionális `api_version` |
| **Linear** | [Linear csomópont](../nodes/linear-node.md) | `api_key`, vagy `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry csomópont](../nodes/sentry-node.md) | `api_token`, opcionális `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge bíráló) | `base_url`, opcionális `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | egy decision model hitelesítési adat, valamint a többi hitelesítési adatra hivatkozó modellopciók |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektortárolók | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektortárolók | `openai_api_key` (a vektorok a Heym saját Postgres adatbázisában tárolódnak pgvector segítségével) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektortárolók | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opcionális `embedding_api_key`, valamint `qdrant_host`, ha a `db_type` értéke `qdrant` |
| **Grist** | [Grist csomópont](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets csomópont](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 hozzájárulás |
| **Google Drive** | [Google Drive csomópont](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 hozzájárulás (teljes Drive hatókör) |
| **BigQuery** | [BigQuery csomópont](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 hozzájárulás |
| **Supabase** | [Supabase csomópont](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opcionális `supabase_schema` |
| **ClickHouse** | [ClickHouse csomópont](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion csomópont](../nodes/notion-node.md) | `api_token`, vagy `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 csomópont](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger csomópont](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger csomópont](../nodes/telegram-trigger-node.md), [Telegram csomópont](../nodes/telegram-node.md) | `bot_token`, opcionális `secret_token` |
| **Discord** | [Discord csomópont](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger csomópont](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ csomópont](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis csomópont](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack csomópont](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger csomópont](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP csomópont](../nodes/http-node.md) | `token` |
| **Header** | [HTTP csomópont](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler csomópont](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

A GitHub hitelesítési adat egy GitHub személyes hozzáférési tokent (PAT) tárol, hogy a workflow-k a GitHub REST API-t a [GitHub csomóponton](../nodes/github-node.md) keresztül hívhassák, a tokent átadhassák olyan MCP szervereknek, mint a `@modelcontextprotocol/server-github`, vagy a [HTTP csomópontból](../nodes/http-node.md) egyedi REST hívásokhoz használhassák.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `api_key` | GitHub személyes hozzáférési token (`github_pat_...` finomhangolt PAT vagy klasszikus `ghp_...` PAT) |
### Opcionális mezők

| Mező | Leírás |
|-------|-------------|
| `base_url` | GitHub API base URL GitHub Enterprise Server esetén (például `https://github.example.com/api/v3`) |

### Megjegyzések

- A finomhangolt személyes hozzáférési tokenek (fine-grained personal access tokens) használata javasolt, amikor lehetséges, mivel ezek adott tárolókra és jogosultságokra szűkíthetők.
- A GitHub.com esetén hagyja üresen a `base_url` mezőt. GitHub Enterprise Server esetén a teljes REST API
  endpointot adja meg a `/api/v3` résszel együtt (például `https://github.example.com/api/v3`), ne a
  szerver webes felületének gyökerét, például `https://github.example.com`.
- Ez a hitelesítési adat jelenleg kizárólag a PAT-alapú hitelesítést modellezi. Szervezeti tárolók eléréséhez olyan PAT-t használjon, amely megkapta a szükséges szervezeti/tároló jogosultságokat.
- A GitHub App telepítési tokenek és a GitHub App beállítási folyamatok jelenleg nem első osztályú elemek a Heym felületén.
- A natív tároló-, felhasználó-, issue-, pull request-, review-, release-, Actions workflow-, forgalmi és fájlműveletekhez részesítse előnyben a [GitHub csomópontot](../nodes/github-node.md). Az [HTTP csomópontot](../nodes/http-node.md) csak akkor használja, ha olyan endpointokra vagy payloadokra van szüksége, amelyeket a GitHub csomópont nem fed le.
- Használja az [Agent csomópontot](../nodes/agent-node.md) MCP-vel úgy, hogy a `$credentials.YourGitHubCredential` értéket egy MCP kapcsolati környezeti változóba, például `GITHUB_PERSONAL_ACCESS_TOKEN`-be adja át.
- A GitHub REST API-ja általában az `Authorization: Bearer <token>` fejlécet várja az `Accept: application/vnd.github+json` fejléccel együtt.
- GitHub hitelesítési adat szerkesztésekor a GitHub Enterprise `base_url` mező üresen hagyása megőrzi
  a meglévő endpointot. Új URL-t csak akkor adjon meg, ha módosítani kívánja azt az endpointot.

### Felhasználja

- [GitHub csomópont](../nodes/github-node.md)
- [Codex csomópont](../nodes/codex-node.md)
- [Agent csomópont](../nodes/agent-node.md)
- [HTTP csomópont](../nodes/http-node.md)

---

## Döntési modell

A döntési modell egy állapotra vonatkozó típusos kérdésekre válaszol, és szöveg helyett valószínűségeket ad vissza. A TypeSafe Jev a referencia-implementáció; bármely endpoint, amely ugyanazt a `{model, state, questions}` törzset fogadja, működik, és a [Decision](../nodes/decision-node.md) csomópont kézzel írt törzset is küldhet olyan endpoint számára, amely ezt nem támogatja.

### Kötelező mezők

- `base_url` – az endpoint, például `https://api.typesafe.ai`. A Heym hozzáfűzi a `/v1/systemone` részt.

### Opcionális mezők

- `api_key` – `Authorization: Bearer` formában kerül elküldésre. Azok az endpointok, amelyek nem igényelnek kulcsot, üresen hagyhatják ezt a mezőt.

### Megjegyzések

- A **Test Connection** egy apró kérdést küld annak megerősítésére, hogy az endpoint és a kulcs működik.
- Hitelesítési adat szerkesztésekor a tárolt kulcs megmarad, ha a kulcs mezőt üresen hagyja.
- A privát és loopback címekre irányuló kimenő kérések alapértelmezés szerint blokkolva vannak, így a `localhost`-on vagy privát tartományban futó saját üzemeltetésű endpointhoz a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` beállítás szükséges.
- Ezek a modellek nem szerepelnek a Heym által szinkronizált LLM árazási táblázatokban, ezért a [Futtatások](../tabs/traces-tab.md) nézet Cost oszlopa üresen marad. A tokenek száma ettől függetlenül rögzítésre kerül.

### Felhasználja

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – az `LLM-as-Judge` válaszokat értékeli a várt kimenethez képest

## OpenAI Codex

Az OpenAI Codex hitelesítési adat a [Codex csomópont](../nodes/codex-node.md) hitelesítését látja el. Ez elkülönül az LLM-, Agent- és RAG-csomópontok által használt OpenAI API kulcs hitelesítési adattól.

### Hitelesítési módok

| Mód | Leírás |
|------|-------------|
| **Sign in with ChatGPT** (ajánlott) | OAuth (PKCE) bejelentkezés, amely a ChatGPT Plus/Pro előfizetését használja, így a futtatások elkerülik a tokenenkénti API-költségeket. A Heym tárolja és automatikusan frissíti a token csomagot. |
| **Access token** | Egy ChatGPT/Codex `access_token`, amelyet kizárólag a helyi Codex CLI folyamatnak ad át. |

### Megjegyzések

- Az API kulcsok elutasításra kerülnek ennél a hitelesítési adat típusnál.
- A Codex tokenek nem érhetők el a `$credentials.Name` útvonalon keresztül.
- A Codex csomópontnak emellett GitHub hitelesítési adatra is szüksége van a tároló klónozásához, az ág pusholásához és a draft PR létrehozásához.

### Felhasználja

- [Codex csomópont](../nodes/codex-node.md)

## OpenCode Go

Az OpenCode Go hitelesítési adat az [OpenCode Go csomópont](../nodes/opencode-go-node.md) hitelesítését látja el. Egy OpenCode Go gateway API kulcsot tárol (az [opencode.ai/go](https://opencode.ai/go) oldalról) és egy opcionális gateway base URL-t.

### Mezők

| Mező | Leírás |
|-------|-------------|
| **API Key** | OpenCode Go gateway API kulcs (kötelező). |
| **Gateway Base URL** | Opcionális; alapértelmezett értéke `https://opencode.ai/zen/go/v1`. Csak saját üzemeltetésű vagy proxyn keresztüli gateway esetén írja felül. |

### Megjegyzések

- Az API kulcs kizárólag az OpenCode CLI folyamatnak kerül átadásra egy megerősített konténeren belül.
- Az OpenCode Go csomópontnak emellett GitHub hitelesítési adatra is szüksége van a tároló klónozásához, az ág pusholásához és a pull request létrehozásához. A GitHub token soha nem kerül a sandbox konténerbe.

### Felhasználja

- [OpenCode Go csomópont](../nodes/opencode-go-node.md)

---

## Linear

A Linear hitelesítési adat vagy személyes API kulcsot, vagy OAuth2-t támogat a
[Linear csomópont](../nodes/linear-node.md) számára. A Heym natív GraphQL lekérdezéseket küld a Linear felé a munkaterület
metaadataiért, projektjeiért, issue-ért és hozzászólásaiért.
### Beállítás

Válasszon egy hitelesítési módot:

**Személyes API-kulcs**

1. A Linear felületén nyissa meg a **Settings → Security & Access → Personal API keys** menüpontot.
2. Hozzon létre egy kulcsot azon munkaterület eléréséhez, amelyet automatizálni kíván.
3. Illessze be a kulcsot egy Linear hitelesítési adatba a Heym felületén, majd a **Test Connection** funkcióval ellenőrizze azt.

**OAuth2**

1. Hozzon létre egy Linear OAuth alkalmazást.
2. Regisztrálja a `{FRONTEND_URL}/api/credentials/linear/oauth/callback` címet átirányítási URI-ként.
3. A Heym Dashboard → **Credentials** → **New** → **Linear** típus kiválasztásával.
4. Válassza az **OAuth2** lehetőséget, adja meg a Client ID és Client Secret értékeket, majd kattintson a **Connect** gombra.

### Kötelező mezők

| Mód | Mező | Leírás |
|------|-------|-------------|
| Személyes API-kulcs | `api_key` | Linear személyes API-kulcs, általában `lin_api_` előtaggal |
| OAuth2 | `client_id` | A Linear OAuth alkalmazás Client ID értéke |
| OAuth2 | `client_secret` | A Linear OAuth alkalmazás Client Secret értéke |

Az OAuth tokenek (`access_token`, `refresh_token`, `token_expiry`) automatikusan tárolódnak és frissülnek.

### Megjegyzések

- A személyes API-kulcsok és az OAuth tokenek annak a Linear felhasználónak a nevében járnak el, aki létrehozta vagy engedélyezte azokat.
- A Linear OAuth a `read,write,issues:create,comments:create` scope-okat használja.
- A **Test Connection** funkcióval a hitelesítési adat párbeszédablakában ellenőrizheti az API-kulcsot vagy az OAuth tokent a Linear API-val szemben.
- A Linear csomópont List Teams és List Projects funkcióival fedezheti fel a UUID-kat az issue-k létrehozása vagy szűrése előtt.
- A List Workflow States és List Team Members funkciókkal fedezheti fel az állapot- és felelős-UUID-kat a frissítésekhez.
- API-kulcs rotálásához szerkessze a hitelesítési adatot, és adja meg a csereértéket. Ha az OAuth alkalmazás titkos kulcsait rotálja, a **Connect** gombbal csatlakoztassa újra a hitelesítési adatot.

### Felhasználja

- [Linear csomópont](../nodes/linear-node.md)

---

## Jira

A Jira hitelesítési adat a Jira Basic auth hitelesítési adatait, a Jira webhely alap URL-címét, a telepítési módot és az opcionális REST API verziót tárolja a [Jira csomópont](../nodes/jira-node.md) számára. Jira Cloud esetén a `cloud`, Jira Data Center / Server esetén a `data_center` értéket használja.

### Beállítás

**Jira Cloud**

1. Az Atlassian fiókbeállításokban hozzon létre egy API tokent.
2. A Heym Dashboard → **Credentials** → **New** → **Jira** típus kiválasztásával.
3. Adja meg az Atlassian e-mail-címét, az API tokent és a Jira webhely URL-címét, például `https://your-domain.atlassian.net`.
4. A **Test Connection** funkcióval ellenőrizze a hitelesítési adatot.

**Jira Data Center / Server**

1. Válassza a **Jira Data Center / Server** telepítési módot.
2. Adja meg a Basic auth-hoz használt Jira felhasználónevet és jelszót.
3. Adja meg a Jira webhely URL-címét, például `https://jira.example.com`.
4. A **Test Connection** funkcióval ellenőrizze a hitelesítési adatot.

### Mezők

| Mező | Leírás |
| --- | --- |
| `email` | Jira Cloud Atlassian fiók e-mail-címe, vagy Jira Data Center / Server felhasználónév |
| `api_token` | Jira Cloud Atlassian API token, vagy Jira Data Center / Server jelszó a Basic auth-hoz |
| `base_url` | Jira webhely alap URL-címe |
| `deployment` | `cloud` a Jira Cloud vagy `data_center` a Jira Data Center / Server esetén |
| `api_version` | REST API verzió; Jira Cloud esetén alapértelmezés szerint `3`. A Data Center / Server a v2-t használja |

### Megjegyzések

- A Jira csomópont az issue-leírásokat és hozzászólásokat Atlassian Document Format szöveges
  dokumentumként küldi a Jira Cloud REST API v3 esetén. A Data Center / Server hitelesítési adatok egyszerű szöveget küldenek.
- A Data Center / Server jelenleg csak felhasználónév/jelszó alapú Basic auth-ot támogat. A személyes hozzáférési
  tokenek és a Bearer auth még nem támogatottak.
- A mellékletfeltöltés base64 vagy data URL tartalmat fogad el, és a platform fájlméret-korlátja vonatkozik rá (alapértelmezés szerint 99 MB). A mellékletletöltés engedélyezés esetén base64 tartalmat adhat vissza.
- A felhasználó létrehozásához, törléséhez és az issue-értesítéshez a hitelesített Jira fióknak rendelkeznie kell a megfelelő Jira webhely- vagy szervezeti jogosultságokkal.
- A List Projects, Search Issues és List Transitions funkciókkal fedezheti fel a projektkulcsokat, issue-kulcsokat és átmenet-azonosítókat.
- A Jira csomópont által nem lefedett egyedi endpointok esetén használja a [HTTP csomópontot](../nodes/http-node.md) Jira Basic Auth-tal (`email:api_token` Cloud esetén vagy `username:password` Data Center / Server esetén) a cURL parancsban, vagy egy Header hitelesítési adatot a megfelelő `Authorization: Basic <base64(user:secret)>` értékkel.

Lásd még:

- [Jira csomópont](../nodes/jira-node.md)
- [Hitelesítési adatok](./credentials.md)

---

## Sentry

A Sentry hitelesítési adat egy auth tokent tárol a [Sentry csomópont](../nodes/sentry-node.md) számára. A Heym a Sentry REST API-ját használja a szervezeti, projekt-, csapat-, issue-, esemény- és kiadási műveletekhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `api_token` | Sentry auth token, amely hozzáféréssel rendelkezik az automatizálni kívánt szervezetekhez és projektekhez |

### Opcionális mezők

| Mező | Leírás |
|-------|-------------|
| `base_url` | Opcionális gyökér URL-cím saját üzemeltetésű Sentry esetén, például `https://sentry.example.com` |

### Megjegyzések

- Sentry SaaS esetén hagyja üresen a `base_url` mezőt.
- A **Test Connection** funkcióval ellenőrizheti, hogy a token képes-e listázni a látható szervezeteket.
- Egyedi REST hívásokhoz használja a `$credentials.YourSentryCredential` értéket bearer tokenként.

### Felhasználja

- [Sentry csomópont](../nodes/sentry-node.md)

---

## Qdrant

A [Qdrant](https://qdrant.tech) egy nyílt forráskódú vektoradatbázis, amelyet szemantikus kereséshez és RAG-hoz (Retrieval Augmented Generation) használnak.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `qdrant_host` | A Qdrant példány teljes URL-címe (pl. `http://localhost:6333` vagy egy cloud endpoint) |
| `openai_api_key` | OpenAI API-kulcs, amelyet a dokumentumok indexelésekor és keresésekor a beágyazások (embeddings) generálásához használnak |
### Megjegyzések

- A Qdrant gyűjtemények a [Vektortárolók](../tabs/vectorstores-tab.md) fülről kezelhetők. Minden vektortároló egy Qdrant gyűjteményhez rendelődik.
- A [RAG csomópont](../nodes/rag-node.md) egy vektortárolót használ (amely egy Qdrant hitelesítési adatra hivatkozik) — közvetlenül nem hivatkozik a hitelesítési adatra.
- Ha a Qdrant példány API kulcsot igényel, adja meg azt a `qdrant_host` értékben, vagy konfigurálja a Qdrantot ennek megfelelően; a jelenlegi integráció nem rendelkezik külön Qdrant API kulcs mezővel.
- Saját üzemeltetésű Qdrant: használja a [hivatalos Docker image-et](https://hub.docker.com/r/qdrant/qdrant), és tegye elérhetővé a `6333` portot.

### Felhasználja

- [RAG csomópont](../nodes/rag-node.md) (vektortárolón keresztül)
- [Vektortárolók fül](../tabs/vectorstores-tab.md)

## Egyedi beágyazások (RAG)

Alapértelmezés szerint a RAG beágyazások az OpenAI-tól származnak. A **RAG: Custom Embeddings** hitelesítési adat ehelyett bármely OpenAI-kompatibilis beágyazási endpointra mutat — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together vagy egy hosztolt átjáró —, és megnevezi azt a vektortárolót, amelybe ír.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `embedding_base_url` | Endpoint URL a `/v1` útvonalat is beleértve, pl. `http://localhost:11434/v1` |
| `embedding_api_key` | Opcionális. A helyi szerverek általában nem igényelnek kulcsot |
| `embedding_model` | Modellnév, ahogyan az endpoint elvárja, pl. `nomic-embed-text` |
| `embedding_dimensions` | A modell által visszaadott vektor szélessége (alapértelmezés: `1536`) |
| `embedding_request_dimensions` | Opcionális. Kérje meg az endpointot, hogy a modell natív szélessége helyett az `embedding_dimensions` értéket adja vissza |
| `db_type` | `qdrant` vagy `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant kapcsolat, kötelező, ha a `db_type` értéke `qdrant` |

### Megjegyzések

- **A Qdrant bármilyen dimenziószámot elfogad.** Minden gyűjtemény az ezen hitelesítési adat által megadott szélességgel jön létre, így a Dimensions mező szabadon szerkeszthető.
- **A Postgres (pgvector) pontosan 1536 dimenziót igényel.** Az oszlopa egy rögzített `vector(1536)`, így a Dimensions mező 1536-ra van rögzítve, és a mentés során minden más szélességet megadó hitelesítési adat elutasításra kerül.
- **Rövidítés pgvector esetén.** Ha a tároló Postgres, a párbeszédpanel felkínálja az *Ask the endpoint to return 1536 dimensions* lehetőséget. Ez elküldi a `dimensions` kérési paramétert, amelyet a Matryoshka reprezentációkkal betanított modellek (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` és hasonlók) tiszteletben tartanak azáltal, hogy egy rövidített, de továbbra is jelentéssel bíró vektort adnak vissza. Azok az endpointok, amelyek nem támogatják a paramétert, elutasítják a kérést, azok pedig, amelyek elfogadják, de figyelmen kívül hagyják, egyértelmű hibát adnak, megnevezve a ténylegesen visszaadott szélességet. A Heym soha nem csonkítja maga a vektorokat, mert egy nem Matryoshka modell kimenetének szeletelése csendben rontja a visszakeresés minőségét. A lehetőség Qdrant esetén nem érhető el, mivel az bármilyen szélességre méretezheti a gyűjteményt.
- Használja a **Test Connection** lehetőséget a hitelesítési adat párbeszédpaneljén egy próba szöveg beágyazásához, és nézze meg, milyen szélességet ad vissza ténylegesen a modell, mielőtt létrehozna egy tárolót.
- A `dimensions` kérési paraméter csak magának az OpenAI-nak kerül elküldésre, mivel a legtöbb OpenAI-kompatibilis szerver elutasítja az ismeretlen paramétereket. A modell natív szélessége helyette a hitelesítési adathoz kerül ellenőrzésre.
- A meglévő **RAG: Qdrant + OpenAI** és **RAG: Psql + OpenAI** hitelesítési adatok változatlanok, és továbbra is működnek.

### Felhasználja

- [RAG csomópont](../nodes/rag-node.md) (vektortárolón keresztül)
- [Vektortárolók fül](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

A Heym a vektorokat **a saját Postgres adatbázisában** is tárolhatja a [pgvector](https://github.com/pgvector/pgvector) kiterjesztés használatával — nincs szükség külső vektor szolgáltatásra. Hozzon létre egy **RAG: Psql + OpenAI** hitelesítési adatot, és használja azt vektortároló létrehozásakor, majd válassza a **Postgres (pgvector)** lehetőséget a RAG csomópont Database legördülő menüjében.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `openai_api_key` | OpenAI API kulcs, amelyet a dokumentumok indexelésekor és keresésekor a beágyazások előállításához használ |

### Megjegyzések

- Nincs szükség host/port megadására — a vektorok a Heym saját adatbázisába íródnak; a Heym soha nem csatlakozik más adatbázishoz.
- A Qdranttal elérhető összes RAG funkció (beszúrás, keresés, metaadat szűrők, Cohere újrarangsorolás, klónozás, megosztás) ugyanúgy működik a Postgres háttérrel is.
- Igényli a `vector` kiterjesztést. A Heym a hivatalos `postgres:16` image-et változatlanul hagyja (így a meglévő adatok soha nem sérülnek), és **indításkor automatikusan telepíti a `postgresql-16-pgvector` csomagot** — a `run.sh`, `deploy.sh` és `run_e2e.sh` mind kezeli ezt. A telepítés nem végzetes hiba: ha nem futtatható (pl. nincs hálózat), a Qdrant RAG továbbra is működik, és a Postgres háttér inaktív marad (a migráció kecsesen kihagyja a táblát).
- Ha a közzétett egykonténeres image-et (`ghcr.io/heymrun/heym`) **a saját külső Postgres-ével** futtatja, annak az adatbázisnak támogatnia kell a `vector` kiterjesztést (a Heym nem tudja telepíteni egy olyan adatbázisba, amelyet nem ő kezel). Enélkül a Postgres vektortároló létrehozása vagy feltöltése egyértelmű üzenetet ad vissza, és a Qdrant RAG továbbra is működik.

### Felhasználja

- [RAG csomópont](../nodes/rag-node.md) (vektortárolón keresztül)
- [Vektortárolók fül](../tabs/vectorstores-tab.md)

---

## Grist

A [Grist](https://www.getgrist.com) egy táblázatkezelő/adatbázis hibrid, amely támogatja a strukturált adatokat és a képleteket. A Grist hitelesítési adat lehetővé teszi a Heym számára, hogy Grist dokumentumokat olvasson és írjon.
### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `api_key` | Grist API kulcs (a Grist példányán a **Profile → API Key** menüpontban található) |
| `server_url` | A Grist szerver alap URL-je (pl. `https://docs.getgrist.com` a Grist Cloud esetén, vagy az Ön által üzemeltetett URL) |

### Megjegyzések

- A [Grist csomópont](../nodes/grist-node.md) konfigurációjában a **Document ID** (a Grist dokumentum URL-jéből) és a **Table ID** megadása szükséges — ezek nem részei a hitelesítési adatoknak.
- Saját üzemeltetésű Grist esetén állítsa a `server_url` értékét a példány domainjére.
- A Grist oszlopazonosítói alulvonást használnak (pl. `User_Name`), nem megjelenítési címkéket. A `listColumns` művelettel derítheti fel őket.

### Felhasználja

- [Grist csomópont](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

A Google Sheets hitelesítési adatok OAuth2 "Bring Your Own App" modell segítségével kapcsolják össze a Heymet a Google Sheets API-val. Meg kell adnia egy Google Cloud OAuth2 Client ID-t és Client Secretet, majd böngészős felugró ablakon keresztül engedélyeznie kell a hozzáférést. A tokenek automatikusan frissülnek a háttérben.

### Beállítás

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Library** → keresse meg és engedélyezze a **Google Sheets API**-t.
2. Lépjen a **Credentials** → **Create Credentials** → **OAuth client ID** menüpontra → alkalmazástípus: **Web application**.
3. Az **Authorized redirect URIs** alatt adja hozzá: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Másolja ki a generált **Client ID**-t és **Client Secretet**.
5. A Heym Dashboardon → **Credentials** → **New** → típus: **Google Sheets (OAuth2)**.
6. Adja meg a Client ID-t, a Client Secretet és egy nevet, majd kattintson a **Connect** gombra a Google hozzájárulási felugró ablak megnyitásához és a hozzáférés engedélyezéséhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `client_id` | OAuth2 Client ID a Google Cloud Console-ból |
| `client_secret` | OAuth2 Client Secret a Google Cloud Console-ból |

A tokenek (`access_token`, `refresh_token`, `token_expiry`) tárolása és frissítése automatikusan történik — ezeket Önnek nem kell közvetlenül kezelnie.

### Megjegyzések

- Az OAuth2 hozzájárulási képernyő megköveteli a spreadsheets hatókört (`https://www.googleapis.com/auth/spreadsheets`).
- A Heym a refresh tokent használja új access tokenek beszerzéséhez, mielőtt azok lejárnának (60 másodperces biztonsági ráhagyással).
- Ha a Client Secretet rotálja a Google Cloud Console-ban, kapcsolja újra össze a hitelesítési adatokat a **Connect** gombbal.
- **Éles környezet:** Állítsa a backend **`FRONTEND_URL`** értékét pontosan arra a nyilvános URL-re, amelyet a felhasználók a böngészőben megnyitnak (séma + host, pl. `https://heym.example.com`). A Heym kizárólag ebből az értékből építi fel a Google OAuth átirányítási URI-t — **nem** bízik meg az `Origin` vagy `X-Forwarded-*` fejlécekben (amelyeket a kliens szabályozhat). Regisztrálja a `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` címet a Google Cloud Console-ban.

### Felhasználja

- [Google Sheets csomópont](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

A Google Drive hitelesítési adatok ugyanazzal az OAuth2 "Bring Your Own App" modellel kapcsolják össze a Heymet a Google Drive API-val, mint a Google Sheets esetében. Meg kell adnia egy Google Cloud OAuth2 Client ID-t és Client Secretet, majd böngészős felugró ablakon keresztül engedélyeznie kell a hozzáférést. A tokenek automatikusan frissülnek a háttérben.

### Beállítás

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Library** → keresse meg és engedélyezze a **Google Drive API**-t.
2. Lépjen a **Credentials** → **Create Credentials** → **OAuth client ID** menüpontra → alkalmazástípus: **Web application**.
3. Az **Authorized redirect URIs** alatt adja hozzá: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Másolja ki a generált **Client ID**-t és **Client Secretet**.
5. A Heym Dashboardon → **Credentials** → **New** → típus: **Google Drive (OAuth2)**.
6. Adja meg a Client ID-t, a Client Secretet és egy nevet, majd kattintson a **Connect** gombra a Google hozzájárulási felugró ablak megnyitásához és a hozzáférés engedélyezéséhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `client_id` | OAuth2 Client ID a Google Cloud Console-ból |
| `client_secret` | OAuth2 Client Secret a Google Cloud Console-ból |

A tokenek (`access_token`, `refresh_token`, `token_expiry`) tárolása és frissítése automatikusan történik — ezeket Önnek nem kell közvetlenül kezelnie.

### Hatókör

A Google Drive a **teljes Drive hatókört** kéri (`https://www.googleapis.com/auth/drive`).

Erre azért van szükség, mert a csomópont az Ön által már birtokolt fájlokon működik. A szűkebb `drive.file` hatókör csak azokhoz a fájlokhoz biztosít hozzáférést, amelyeket maga az OAuth kliens hozott létre, így a `listFolderFiles`, `updateFile`, `removeFile` és `removeFolder` műveletek semmit sem látnának a meglévő Drive tartalmából.

Mivel a Client ID-t és a Secretet a saját Google Cloud projektjéből biztosítja, az ehhez a hatókörhöz kapcsolódó Google alkalmazás-ellenőrzési követelmények az Ön projektjére vonatkoznak, nem a Heymre.

### Megjegyzések

- A Heym a refresh tokent használja új access tokenek beszerzéséhez, mielőtt azok lejárnának (60 másodperces biztonsági ráhagyással).
- Ha a Client Secretet rotálja a Google Cloud Console-ban, kapcsolja újra össze a hitelesítési adatokat a **Connect** gombbal.
- A megosztott meghajtók támogatottak — a csomópont minden API-hívásnál beállítja a `supportsAllDrives` paramétert.
- **Éles környezet:** Állítsa a backend **`FRONTEND_URL`** értékét pontosan arra a nyilvános URL-re, amelyet a felhasználók a böngészőben megnyitnak. A Heym kizárólag ebből az értékből építi fel a Google OAuth átirányítási URI-t — **nem** bízik meg az `Origin` vagy `X-Forwarded-*` fejlécekben. Regisztrálja a `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` címet a Google Cloud Console-ban.
- Mielőtt ezeket a hitelesítési adatokat megosztaná egy csapattal, olvassa el a [Hitelesítési adatok megosztása](./credentials-sharing.md) részt.

### Felhasználja

- [Google Drive csomópont](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

A BigQuery hitelesítési adatok OAuth2 "Bring Your Own App" modell segítségével kapcsolják össze a Heymet a Google BigQuery API-val. Ön megad egy Google Cloud OAuth2 Client ID-t és Client Secretet, majd böngésző felugró ablakon keresztül engedélyezi a hozzáférést. A tokenek automatikusan frissülnek a háttérben.

### Beállítás

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Library** → keresse meg és engedélyezze a **BigQuery API**-t.
2. Lépjen a **Credentials** → **Create Credentials** → **OAuth client ID** menüpontra → alkalmazástípus: **Web application**.
3. Az **Authorized redirect URIs** alatt adja hozzá: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Másolja ki a generált **Client ID**-t és **Client Secretet**.
5. A Heym Dashboardon → **Hitelesítési adatok** → **New** → típus: **BigQuery (OAuth2)**.
6. Adja meg a Client ID-t, a Client Secretet és egy nevet, majd kattintson a **Connect** gombra a Google hozzájárulási felugró ablak megnyitásához és a hozzáférés engedélyezéséhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `client_id` | OAuth2 Client ID a Google Cloud Console-ból |
| `client_secret` | OAuth2 Client Secret a Google Cloud Console-ból |

A tokenek (`access_token`, `refresh_token`, `token_expiry`) automatikusan tárolódnak és frissülnek.

### Megjegyzések

- Az OAuth2 hozzájárulási képernyő megköveteli a BigQuery scope-ot (`https://www.googleapis.com/auth/bigquery`).
- **Éles környezet:** Állítsa be a backend **`FRONTEND_URL`** értékét a nyilvános URL-re. Regisztrálja a `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` címet a Google Cloud Console-ban.

### Felhasználja

- [BigQuery csomópont](../nodes/bigquery-node.md)

---

## Supabase

A Supabase hitelesítési adatok összekapcsolják a Heymet egy Supabase projekt PostgREST API-jával, így a workflow-k lekérdezhetik és módosíthatják a Postgres-alapú táblákat.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `supabase_url` | A projekt alap URL-je, például `https://your-project.supabase.co` |
| `supabase_key` | API-kulcs a célzott táblákhoz való hozzáféréssel |
| `supabase_schema` | Opcionális alapértelmezett séma (alapértelmezés: `public`) |

### Megjegyzések

- A [Supabase csomópont](../nodes/supabase-node.md) a `/rest/v1/<table>` végponttal kommunikál, és támogatja az operátorszűrőket (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` és a kapcsolódó PostgREST operátorokat), valamint a beágyazott `or` / `and` logikai csoportokat.
- Írási műveletekhez részesítse előnyben a megbízható szerveroldali használatra szánt kulcsot, a minimálisan szükséges táblajogosultságokkal.
- A csomópontok lépésenként felülírhatják a sémát akkor is, ha a hitelesítési adatok alapértelmezett sémát definiálnak.

### Felhasználja

- [Supabase csomópont](../nodes/supabase-node.md)

## ClickHouse

A ClickHouse hitelesítési adatok a HTTP interfészen keresztül összekapcsolják a Heymet egy külső ClickHouse adatbázissal, így a workflow-k SQL-, CRUD- és count műveleteket futtathatnak OLAP-táblákon.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `host` | HTTP host séma nélkül, például `your-instance.clickhouse.cloud` |
| `port` | HTTP interfész port (`8443` HTTPS-hez, `8123` HTTP-hez) |
| `username` | ClickHouse felhasználó (alapértelmezés: `default`) |
| `password` | Felhasználói jelszó (opcionális) |
| `database` | Cél adatbázis (alapértelmezés: `default`) |
| `secure` | HTTPS használata `true` esetén (a ClickHouse Cloud esetében kötelező) |

### Megjegyzések

- A [ClickHouse csomópont](../nodes/clickhouse-node.md) a hivatalos `clickhouse-connect` HTTP klienst használja, és paraméterezve köti a szűrőket és értékeket.
- Az `update` és `remove` műveletek az `ALTER TABLE ... UPDATE` és `DELETE FROM` utasításokra képeződnek le, amelyek aszinkron ClickHouse mutációk; mindkettő szűrőt igényel.
- Az `upsert` egy `INSERT` műveletet hajt végre, és `ReplacingMergeTree` táblát feltételez a kulcs szerinti összevonás viselkedéséhez.
- A hitelesítési adatok párbeszédpanelén a **Test connection** gombbal ellenőrizheti az elérhetőséget.

### Felhasználja

- [ClickHouse csomópont](../nodes/clickhouse-node.md)

## Notion

A Notion hitelesítési adatok vagy egy belső integrációs tokent, vagy egy nyilvános integrációs OAuth-kapcsolatot támogatnak. Az OAuth lehetővé teszi, hogy minden felhasználó a Heymből engedélyezzen egy Notion munkaterületet a token manuális másolása helyett.

### Kötelező mezők

| Mód | Mező | Leírás |
|------|-------|-------------|
| Belső token | `api_token` | Belső integrációs token (`ntn_...`) |
| OAuth | `client_id` | Client ID egy Notion nyilvános integrációból |
| OAuth | `client_secret` | Client Secret a Notion nyilvános integrációból |

Az OAuth visszahívás automatikusan tárolja az `access_token`, `auth_mode`, `workspace_id`, `workspace_name` és `bot_id` értékeket. Az OAuth befejezésekor minden korábbi belső `api_token` eltávolításra kerül. Regisztrálja ezt a visszairányítási URI-t a Notionban:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth beállítási folyamat

1. Válassza az **OAuth** lehetőséget a hitelesítési adatok párbeszédpanelén, adja meg a nevet, a Client ID-t és a Client Secretet.
2. Kattintson a **Connect** gombra, és engedélyezze a munkaterületet a Notion felugró ablakában.
   - **Új** hitelesítési adatok esetén a Heym a **Connect** gombra kattintva hozza létre a hitelesítési adatok rekordját.
   - Fejezze be az engedélyezést a felugró ablakban, majd kattintson a **Save** gombra a hitelesítési adatok listájához való visszatéréshez.
3. A csatlakoztatott hitelesítési adatok a listában `connected (Workspace Name)` formában jelennek meg. A függőben lévő OAuth hitelesítési adatok `Not connected` állapotot mutatnak, amíg az engedélyezés be nem fejeződik.

A hitelesítési adatok párbeszédpanelén a **Test Connection** gombbal ellenőrizheti akár a belső tokent, akár a befejezett OAuth engedélyezést. Szerkesztéskor a token mező üresen hagyása megőrzi a tárolt belső tokent.

Mind a belső tokenek, mind az OAuth hozzáférési tokenek elérhetők a `$credentials.CredentialName` útvonalon olyan egyedi [HTTP](../nodes/http-node.md) hívásokhoz, amelyek Notion bearer tokent igényelnek.
### Megjegyzések

- A belső integrációkhoz a kapcsolódó oldalakat, adatbázisokat és adatforrásokat meg kell osztani.
- Az OAuth-felhasználók a Notion-hitelesítés során választják ki a munkaterületet/oldalakat.
- Az OAuth-alkalmazás hitelesítési adatai a Notion hitelesítési adatain belül titkosítva vannak. A callback szerveroldalon tölti be
  őket; a titok nem kerül be az OAuth state-be.
- A csatlakoztatott OAuth-hitelesítési adatok a munkaterület nevét jelenítik meg; a függőben lévő OAuth-hitelesítési adatok
  `Not connected` állapotot mutatnak, amíg az engedélyezés be nem fejeződik.
- **Éles környezet:** Állítsa be a backend **`FRONTEND_URL`** értékét a nyilvános böngésző URL-címére (séma + host, záró
  perjel nélkül). A Notion átirányítási URI-nak pontosan egyeznie kell:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- A csomópont a `2026-03-11` API-verziót és a jelenlegi `data_source` terminológiát használja. A régebbi
  `archived`, `after` vagy adatbázis-lekérdezési példákról való migrációval kapcsolatban lásd a
  [Notion csomópont](../nodes/notion-node.md#api-version-notes) cikket.
- A `database` objektumértékkel rendelkező régi keresési szűrők `data_source` értékre normalizálódnak.

### Felhasználja

- [Notion csomópont](../nodes/notion-node.md)

---

## SMTP (E-mail)

Az SMTP hitelesítési adatok az e-mail-kiszolgáló kapcsolati adatait tárolják a kimenő levelek küldéséhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `host` | SMTP-kiszolgáló hosztneve (pl. `smtp.gmail.com`) |
| `port` | SMTP-port (jellemzően `587` STARTTLS-hez, `465` SSL-hez) |
| `email` | Feladó e-mail-címe |
| `password` | SMTP-jelszó vagy alkalmazásjelszó |

### Gyakori SMTP-szolgáltatók

| Szolgáltató | Host | Port | Megjegyzések |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | [Alkalmazásjelszót](https://support.google.com/accounts/answer/185833) igényel (a 2FA-nak engedélyezve kell lennie) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Használja a Microsoft-fiókja hitelesítési adatait |
| Mailgun | `smtp.mailgun.org` | `587` | Használja a Mailgun SMTP-hitelesítési adatait a domain beállításaiból |
| SendGrid | `smtp.sendgrid.net` | `587` | Használja az `apikey` értéket felhasználónévként és egy API-kulcsot jelszóként |
| Egyéni / saját üzemeltetésű | az Ön domainje | `587` / `465` | Postfix, Exim stb. |

### Megjegyzések

- A Gmail **alkalmazásjelszót** igényel a szokásos jelszava helyett, ha a kétlépcsős hitelesítés engedélyezve van.
- Az `587` port STARTTLS-t használ (sima szövegként indul, TLS-re vált). A `465` port implicit TLS-t használ (SSL az elejétől).

### Felhasználja

- [E-mail küldése csomópont](../nodes/send-email-node.md)

---

## IMAP (Bejövő e-mail)

Az IMAP hitelesítési adatok a beérkező postaláda [IMAP Trigger csomóponttal](../nodes/imap-trigger-node.md) történő figyeléséhez szükséges kapcsolati adatokat tárolják.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `imap_host` | IMAP-kiszolgáló hosztneve (például `imap.gmail.com`) |
| `imap_port` | IMAP-port (`993` SSL/TLS-hez a legtöbb szolgáltatónál) |
| `imap_username` | Postaláda felhasználóneve vagy teljes e-mail-címe |
| `imap_password` | Jelszó vagy szolgáltatóspecifikus alkalmazásjelszó |

### Opcionális mezők

| Mező | Leírás |
|-------|-------------|
| `imap_mailbox` | Figyelendő postaláda-mappa (alapértelmezett: `INBOX`) |
| `imap_use_ssl` | SSL/TLS engedélyezése (ajánlott; alapértelmezett: `true`) |

### Megjegyzések

- Az IMAP trigger az első lekérdezéskor beállítja az aktuális postaláda bázisvonalát, majd csak az újabb e-maileket dolgozza fel.
- A Gmail, a Microsoft 365 és más hosztolt szolgáltatók gyakran **alkalmazásjelszót** vagy hasonló IMAP-specifikus titkot igényelnek.
- A mellékletek tartalma nem kerül letöltésre a workflow payloadba; a Heym csak a mellékletek metaadatait teszi elérhetővé.

### Felhasználja

- [IMAP Trigger csomópont](../nodes/imap-trigger-node.md)
- [Triggerek](./triggers.md) (IMAP mint workflow-trigger)

---

## RabbitMQ

A [RabbitMQ](https://www.rabbitmq.com) egy nyílt forráskódú üzenetközvetítő. A RabbitMQ hitelesítési adatok a sorokba és exchange-ekbe történő közzétételhez és az onnan való fogyasztáshoz szükséges kapcsolati adatokat tárolják.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `rabbitmq_host` | AMQP-kapcsolati URL (pl. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-felhasználónév (alapértelmezett: `guest`) |
| `rabbitmq_password` | RabbitMQ-jelszó (alapértelmezett: `guest`) |

### Virtuális hosztok

Egy adott virtuális hoszthoz való csatlakozáshoz adja meg azt a `rabbitmq_host` URL-ben:

```
amqp://username:password@hostname:5672/vhost
```

Az alapértelmezett vhost használata esetén a `/` útvonal elhagyható.

### Késleltetett üzenetek plugin

A [RabbitMQ csomópont](../nodes/rabbitmq-node.md) támogatja a **rabbitmq_delayed_message_exchange** plugint. Ha ez a plugin engedélyezve van a RabbitMQ-kiszolgálóján, a kimenő üzenetekre késleltetést (milliszekundumban) állíthat be a csomópont `rabbitmqDelayMs` mezőjével.

A csomópont beállítja az `x-delay` fejlécet a közzétett üzeneten. A késleltetések érvényesüléséhez az exchange típusának `x-delayed-message` értékűnek kell lennie.

A plugin engedélyezése saját üzemeltetésű RabbitMQ-példányon:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Ha a plugin nincs telepítve, az `x-delay` fejléc figyelmen kívül marad, és az üzenetek azonnal kézbesítésre kerülnek.

### Felhasználja

- [RabbitMQ csomópont](../nodes/rabbitmq-node.md)
- [Triggerek](./triggers.md) (RabbitMQ mint workflow-trigger)

---

## Amazon S3

Az Amazon S3 hitelesítési adatok összekapcsolják a Heymet az [Amazon S3](https://aws.amazon.com/s3/) szolgáltatással. Használja az [Amazon S3 csomóponttal](../nodes/amazon-s3-node.md) bucketek és mappák kezeléséhez, objektumok feltöltéséhez és letöltéséhez, kulcsok másolásához, valamint objektumok listázásához vagy törléséhez a workflow-kból.
### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `aws_access_key_id` | AWS IAM hozzáférési kulcs azonosító |
| `aws_secret_access_key` | A hozzáférési kulcs azonosítóhoz tartozó titkos hozzáférési kulcs |
| `aws_region` | AWS régió, ahol a bucketek találhatók (pl. `us-east-1`) |

### Opcionális mezők

| Mező | Leírás |
|-------|-------------|
| `aws_session_token` | Ideiglenes session token AWS STS hitelesítési adatok használatakor |

### Megjegyzések

- A hitelesítési adatok a szabványos AWS SigV4 hitelesítést használják a boto3-on keresztül.
- A feltöltési műveletek jelenleg UTF-8 szöveges tartalmat küldenek; a letöltések szöveget vagy bináris objektumok esetén base64-et adhatnak vissza.

### Felhasználja

- [Amazon S3 csomópont](../nodes/amazon-s3-node.md)

---

## Redis

A [Redis](https://redis.io) egy memóriabeli kulcs-érték tároló, amelyet gyorsítótárazáshoz és gyors adateléréshez használnak.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `host` | A Redis szerver hosztneve vagy IP-címe (pl. `localhost`) |
| `port` | Redis port (alapértelmezett: `6379`) |
| `password` | Redis jelszó (hagyja üresen, ha nincs beállítva) |

### Felhasználja

- [Redis csomópont](../nodes/redis-node.md)

---

## Slack

A Slack hitelesítési adatok egy **Incoming Webhook URL**-t tárolnak, amely üzenetek Slack csatornákra történő közzétételére szolgál.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (a Slack alkalmazás konfigurációjából) |

### Megjegyzések

- Hozzon létre egy Incoming Webhookot az [api.slack.com/apps](https://api.slack.com/apps) oldalon → az Ön alkalmazása → **Incoming Webhooks**.
- Minden webhook egy adott csatornára van korlátozva. Hozzon létre több hitelesítési adatot a különböző csatornákhoz.

### Felhasználja

- [Slack csomópont](../nodes/slack-node.md)

---

## Telegram

A Telegram hitelesítési adatok egy **Bot Token**-t és egy opcionális **Webhook Secret Token**-t tárolnak a bot-alapú workflow-khoz.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `bot_token` | Telegram Bot API token a BotFather-től |

### Opcionális mezők

| Mező | Leírás |
|-------|-------------|
| `secret_token` | Megosztott titok, amelyet a bejövő webhookokon az `x-telegram-bot-api-secret-token` fejléccel ellenőriznek |

### Megjegyzések

- Ugyanazt a hitelesítési adatot használja mind a [Telegram Trigger](../nodes/telegram-trigger-node.md), mind a [Telegram](../nodes/telegram-node.md) esetében.
- Regisztrálja a webhookot manuálisan a Telegram `setWebhook` API-jával, a Telegram Trigger csomópont paneljén megjelenő URL használatával.
- A `chatId` a Telegram csomópontban lehet literál azonosító vagy kifejezés, például `$telegramEvent.message.chat.id`.

### Felhasználja

- [Telegram Trigger csomópont](../nodes/telegram-trigger-node.md)
- [Telegram csomópont](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer és Header)

Ezeket a hitelesítési adatokat a [HTTP csomópont](../nodes/http-node.md) használja a kimenő kérések hitelesítéséhez.

### Bearer

Egy `Authorization: Bearer <token>` fejlécet csatol a HTTP kérésekhez.

| Mező | Leírás |
|-------|-------------|
| `token` | A bearer token értéke |

### Header

Egy egyéni fejlécet csatol a HTTP kérésekhez.

| Mező | Leírás |
|-------|-------------|
| `header_key` | Fejléc neve (pl. `X-Api-Key`) |
| `header_value` | Fejléc értéke |

Mindkét típus hivatkozható a `$credentials.CredentialName` segítségével az [Expression DSL](./expression-dsl.md) nyelvben is, dinamikus használatra bármely olyan csomópontban, amely elfogad kifejezéseket.

### Felhasználja

- [HTTP csomópont](../nodes/http-node.md)

---

## LLM szolgáltatók (OpenAI, Google, Custom, Cohere)

Ezek a hitelesítési adatok működtetik az AI csomópontokat.

| Típus | Leírás |
|------|-------------|
| **OpenAI** | API kulcs GPT modellekhez és OpenAI beágyazásokhoz |
| **Google** | API kulcs Gemini modellekhez |
| **Custom** | API kulcs + base URL OpenAI-kompatibilis endpointokhoz (Ollama, vLLM, LM Studio stb.) |
| **Cohere** | API kulcs Cohere beágyazásokhoz |

### OpenAI Prompt gyorsítótárazás

Az OpenAI automatikusan gyorsítótárazza a rendszer prompt statikus (változatlan) előtagját — ehhez nincs szükség további konfigurációra. Az ismételt workflow-futtatások, amelyek ugyanazt a rendszer prompt előtagot használják, a gyorsítótárazott token árazás előnyeit élvezik, ami csökkenti mind a költségeket, mind a késleltetést. Ez különösen hasznos, ha hosszú, rögzített utasításai vannak, és csak a felhasználói üzenet változik a futtatások között. Figyelje a gyorsítótár-találati arányokat és a token megtakarításokat a [Futtatások fülön](../tabs/traces-tab.md) vagy az OpenAI használati irányítópulton, hogy optimalizálja a prompt szerkezetét a maximális gyorsítótár-újrafelhasználás érdekében.

### Felhasználja

- [LLM csomópont](../nodes/llm-node.md)
- [Agent csomópont](../nodes/agent-node.md)
- [RAG csomópont](../nodes/rag-node.md) (OpenAI beágyazások Qdrant hitelesítési adatokon keresztül)

---

## FlareSolverr

A [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) egy proxy szerver a Cloudflare és hasonló bot-védelmi kihívások megkerüléséhez.

### Kötelező mezők

| Mező | Leírás |
|-------|-------------|
| `flaresolverr_url` | Az Ön FlareSolverr példányának URL-je (pl. `http://localhost:8191`) |

A loopback és privát címek itt támogatottak, így a FlareSolverr a Heym mellett futtatva a dokumentáció szerint működik. Az URL nem oldódhat fel link-local vagy cloud-metadata címre. Mivel a privát címek engedélyezettek, ez a mező egy másik belső szolgáltatásra is irányítható, és a válasz a csomópont kimenetében érkezik vissza. Bármely bejelentkezett felhasználó létrehozhatja ezt a hitelesítési adatot, így a határt az szabja meg, hogy ki szerkeszthet workflow-kat, valamint az Ön hálózati szabályai, nem pedig a hitelesítési adatok megosztása. Lásd: [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Felhasználja

- [Crawler csomópont](../nodes/crawler-node.md)

---
## Kapcsolódó témák

- [Hitelesítési adatok](./credentials.md) – A hitelesítési adatok áttekintése és hogyan használják őket a csomópontok
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Hitelesítési adatok hozzáadása és kezelése
- [Hitelesítési adatok megosztása](./credentials-sharing.md) – Hitelesítési adatok megosztása felhasználókkal és csapatokkal
- [Biztonság](./security.md) – Titkosítás tároláskor, hozzáférés-vezérlés
- [Expression DSL](./expression-dsl.md) – `$credentials` szintaxis a dinamikus hozzáféréshez

---

## Model Router (Auto Model)

Minden kérést az Ön meglévő modell-hitelesítési adatai közül az egyikhez irányít, egy döntési modell segítségével választva. Csak hivatkozásokat tárol, soha nem saját kulcsot.

### Kötelező mezők

- `decision_credential_id` – egy **Decision Model** hitelesítési adat, amelyhez Ön hozzáfér.
- `decision_model` – az a modell, amely az útválasztási hívást végzi, például `jev-latest`.
- `options` – legalább két bejegyzés, mindegyik tartalmaz egy nevet, az Ön egyik OpenAI/Google/Custom hitelesítési adatát, egy modellt rajta, valamint kritériumokat arra vonatkozóan, hogy mikor nyerjen.

### Opcionális mezők

- `routing_instructions` – hogyan súlyozza a lehetőségeket összességében.
- Egy lehetőség megjelölhető tartalékként, amelyet útválasztási hiba esetén használ a rendszer.

### Megjegyzések

A lehetőségek nevei azok, amelyek között a döntési modell választ, ezért ezeknek különbözőeknek kell lenniük. Egy lehetőség nem mutathat egy másik Model Routerre.
