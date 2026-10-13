# Trešo Pušu Integrācijas

Heym savienojas ar ārējiem pakalpojumiem, izmantojot **akreditācijas datus**. Katrs akreditācijas datu veids glabā savienojuma detaļas vienam pakalpojumam un var tikt atkārtoti izmantots vairākos mezglos un workflows. Skatiet [Akreditācijas dati](./credentials.md) pārskata nolūkos.

Pievienojiet akreditācijas datus [Iestatījumi → Akreditācijas dati](../tabs/credentials-tab.md). Visi dati tiek šifrēti atpūtā. Akreditācijas datus var [dalīt](./credentials-sharing.md) ar citiem lietotājiem vai [Komandām](./teams.md).

Daži integrācijas mezgli **neprasa** akreditācijas datus. [WebSocket Trigger](../nodes/websocket-trigger-node.md) un [WebSocket Send](../nodes/websocket-send-node.md) savienojas ar ārējiem soketiem, izmantojot URL, galvenes un apakšprotokolus, kas konfigurēti tieši mezglā.

## Akreditācijas Datu Veidi Pārskatā

| Veids | Izmanto | Galvenie lauki |
|-------|---------|----------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Aģents](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opcional `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Aģents](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Aģents](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opcional `base_url` |
| **Jira** | [Jira mezgls](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, opcional `api_version` |
| **Linear** | [Linear mezgls](../nodes/linear-node.md) | `api_key`, vai `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry mezgls](../nodes/sentry-node.md) | `api_token`, opcional `base_url` |
| **Pielāgots** | [LLM](../nodes/llm-node.md), [Aģents](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Lēmumu Modelis** | [Lēmums](../nodes/decision-node.md), [Novērtējumi](../tabs/evals-tab.md) (LLM-as-Judge tiesnesis) | `base_url`, opcional `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Aģents](../nodes/agent-node.md), Chat, AI Defaults | lēmumu modeļa akreditācijas dati, plus modeļa opcijas, kas atsaucas uz Jūsu citām akreditācijām |
| **Cohere** | Iegultās | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektoru krātuves | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektoru krātuves | `openai_api_key` (vektori glabāti Heym paša Postgres caur pgvector) |
| **RAG: Pielāgotas Iegultās** | [RAG](../nodes/rag-node.md), Vektoru krātuves | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opcional `embedding_api_key`, plus `qdrant_host`, kad `db_type` ir `qdrant` |
| **Grist** | [Grist mezgls](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets mezgls](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 piekrišana |
| **Google Drive** | [Google Drive mezgls](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 piekrišana (pilna Drive piekļuve) |
| **BigQuery** | [BigQuery mezgls](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 piekrišana |
| **Supabase** | [Supabase mezgls](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opcional `supabase_schema` |
| **ClickHouse** | [ClickHouse mezgls](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion mezgls](../nodes/notion-node.md) | `api_token`, vai `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 mezgls](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Sūtīt e-pastu](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger mezgls](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger mezgls](../nodes/telegram-trigger-node.md), [Telegram mezgls](../nodes/telegram-node.md) | `bot_token`, opcional `secret_token` |
| **Discord** | [Discord mezgls](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger mezgls](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ mezgls](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis mezgls](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack mezgls](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger mezgls](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP mezgls](../nodes/http-node.md) | `token` |
| **Header** | [HTTP mezgls](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler mezgls](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub akreditācijas dati glabā GitHub personīgo piekļuves tokenu (PAT), lai workflows varētu izsaukt GitHub REST API caur [GitHub mezglu](../nodes/github-node.md), nodot tokenu MCP serveriem, piemēram, `@modelcontextprotocol/server-github`, vai izmantot to no [HTTP mezgla](../nodes/http-node.md) pielāgotām REST izsaukumiem.

### Nepieciešamie Lauki

| Lauks | Apraksts |
|-------|----------|
| `api_key` | GitHub personīgais piekļuves tokens (`github_pat_...` smalki regulēts PAT vai klasiskā `ghp_...` PAT) |
### Papildus lauki

| Lauks | Apraksts |
|-------|----------|
| `base_url` | GitHub API bāzes URL GitHub Enterprise Server (piemēram, `https://github.example.com/api/v3`) |

### Piezīmes

- Ieteicams izmantot precīzi definētus personiskos piekļuves tokenus, kad tas ir iespējams, jo tos var ierobežot uz konkrētām repozitorijām un atļaujām.
- Atstājiet `base_url` tukšu GitHub.com. GitHub Enterprise Server gadījumā izmantojiet pilnu REST API
  galapunktu, ieskaitot `/api/v3` (piemēram, `https://github.example.com/api/v3`), nevis servera tīmekļa UI sakni, piemēram, `https://github.example.com`.
- Šī akreditācija pašlaik modelē tikai PAT balstītu autentifikāciju. Lai piekļūtu organizācijas repozitorijām, izmantojiet PAT, kuram ir piešķirtas nepieciešamās organizācijas/repozitorijas atļaujas.
- GitHub App instalācijas tokeni un GitHub App iestatīšanas plūsmas šodien nav pirmās klases Heym UI.
- Dodiet priekšroku [GitHub mezglam](../nodes/github-node.md) vietējām repozitoriju, lietotāju, problēmu, pieprasījumu, pārskatu, izlaidumu, darbplūsmu, satiksmes un failu operācijām. Izmantojiet [HTTP mezglu](../nodes/http-node.md) tikai tad, ja nepieciešami galapunkti vai payload, ko GitHub mezgls nesedz.
- Izmantojiet [Aģenta mezglu](../nodes/agent-node.md) ar MCP, nododot `$credentials.YourGitHubCredential` MCP savienojuma vides mainīgajā, piemēram, `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHub REST API parasti sagaida `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Rediģējot GitHub akreditāciju, atstājot GitHub Enterprise `base_url` tukšu, tiek saglabāts esošais galapunkts. Ievadiet jaunu URL tikai tad, ja vēlaties mainīt šo galapunktu.

### Izmanto

- [GitHub mezgls](../nodes/github-node.md)
- [Codex mezgls](../nodes/codex-node.md)
- [Aģenta mezgls](../nodes/agent-node.md)
- [HTTP mezgls](../nodes/http-node.md)

---

## Lēmumu modelis

Lēmumu modelis atbild uz tipizētiem jautājumiem par stāvokli un atgriež varbūtības, nevis tekstu. TypeSafe's Jev ir atsauces īstenojums; jebkurš galapunkts, kas pieņem to pašu `{model, state, questions}` ķermeni, darbojas, un [Lēmumu](../nodes/decision-node.md) mezgls var nosūtīt roku rakstītu ķermeni tam, kas to nedara.

### Nepieciešamie lauki

- `base_url` – galapunkts, piemēram, `https://api.typesafe.ai`. Heym pievieno `/v1/systemone`.

### Papildus lauki

- `api_key` – nosūtīts kā `Authorization: Bearer`. Galapunkti, kuriem nav nepieciešams atslēga, var atstāt šo lauku tukšu.

### Piezīmes

- **Testēt savienojumu** nosūta vienu mazu jautājumu, lai apstiprinātu, ka galapunkts un atslēga darbojas.
- Rediģējot akreditāciju, tiek saglabāta uzglabātā atslēga, ja atslēgas lauks tiek atstāts tukšs.
- Izsūtījumi uz privātām un lokālām adresēm pēc noklusējuma tiek bloķēti, tāpēc pašizvietots galapunkts uz `localhost` vai privātā diapazonā prasa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Šie modeļi nav iekļauti LLM cenu tabulās, ko sinhronizē Heym, tāpēc izmaksu kolonna [Izpildes](../tabs/traces-tab.md) paliek tukša. Tokenu skaits joprojām tiek reģistrēts.

### Izmanto

- [Lēmumu](../nodes/decision-node.md)
- [Novērtējumi](../tabs/evals-tab.md) – vērtē `LLM-as-Judge` atbildes pret gaidāmo rezultātu

## OpenAI Codex

OpenAI Codex akreditācija autentificē [Codex mezglu](../nodes/codex-node.md). Tā ir atsevišķa no OpenAI API atslēgas akreditācijas, ko izmanto LLM, Aģenta un RAG mezgli.

### Autentifikācijas režīmi

| Režīms | Apraksts |
|--------|----------|
| **Pieteikšanās ar ChatGPT** (ieteicams) | OAuth (PKCE) pieteikšanās, kas izmanto Jūsu ChatGPT Plus/Pro abonementu, tādējādi izvairoties no izmaksām par katru tokenu. Heym uzglabā un automātiski atsvaidzina tokenu komplektu. |
| **Piekļuves token** | ChatGPT/Codex `access_token`, kas tiek nodots tikai vietējai Codex CLI procesam. |

### Piezīmes

- API atslēgas tiek noraidītas šī akreditācijas veida gadījumā.
- Codex tokeni nav atklāti caur `$credentials.Name`.
- Codex mezglam arī nepieciešama GitHub akreditācija repozitorija klonēšanai, zara nosūtīšanai un melnā PR izveidei.

### Izmanto

- [Codex mezgls](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go akreditācija autentificē [OpenCode Go mezglu](../nodes/opencode-go-node.md). Tā uzglabā OpenCode Go vārtejas API atslēgu (no [opencode.ai/go](https://opencode.ai/go)) un opciju vārtejas bāzes URL.

### Lauki

| Lauks | Apraksts |
|-------|----------|
| **API atslēga** | OpenCode Go vārtejas API atslēga (nepieciešama). |
| **Vārtejas bāzes URL** | Opcija; noklusējuma vērtība ir `https://opencode.ai/zen/go/v1`. Pārrakstiet tikai pašizvietotai vai proksētai vārtejai. |

### Piezīmes

- API atslēga tiek nodota tikai OpenCode CLI procesam iekšā nostiprinātā konteinerā.
- OpenCode Go mezglam arī nepieciešama GitHub akreditācija repozitorija klonēšanai, zara nosūtīšanai un pieprasījuma izveidei. GitHub token nekad netiek ievietots smilšu konteinerā.

### Izmanto

- [OpenCode Go mezgls](../nodes/opencode-go-node.md)

---

## Linear

Linear akreditācija atbalsta vai nu personisko API atslēgu, vai OAuth2 [Linear mezglam](../nodes/linear-node.md). Heym nosūta vietējās GraphQL vaicājumus uz Linear, lai iegūtu darba telpas metadatus, projektus, problēmas un komentārus.
### Iestatīšana

Izvēlieties vienu autentifikācijas režīmu:

**Personīgais API atslēga**

1. Linear atveriet **Iestatījumi → Drošība un piekļuve → Personīgās API atslēgas**.
2. Izveidojiet atslēgu ar piekļuvi darba telpai, kuru vēlaties automatizēt.
3. Ielīmējiet atslēgu Linear akreditācijas datos Heym un izmantojiet **Pārbaudīt savienojumu**, lai to pārbaudītu.

**OAuth2**

1. Izveidojiet Linear OAuth lietojumprogrammu.
2. Reģistrējiet `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kā pāradresācijas URI.
3. Heym Dashboard → **Akreditācijas dati** → **Jauns** → ierakstiet **Linear**.
4. Izvēlieties **OAuth2**, ievadiet Klienta ID un Klienta slepeno kodu, pēc tam noklikšķiniet uz **Savienot**.

### Nepieciešamie lauki

| Režīms | Lauks | Apraksts |
|--------|-------|----------|
| Personīgais API atslēga | `api_key` | Linear personīgā API atslēga, parasti sākas ar `lin_api_` |
| OAuth2 | `client_id` | Klienta ID no Linear OAuth lietojumprogrammas |
| OAuth2 | `client_secret` | Klienta slepenais kods no Linear OAuth lietojumprogrammas |

OAuth žetoni (`access_token`, `refresh_token`, `token_expiry`) tiek glabāti un atjaunoti automātiski.

### Piezīmes

- Personīgās API atslēgas un OAuth žetoni darbojas kā Linear lietotājs, kurš tās izveidoja vai autorizēja.
- Linear OAuth izmanto apjomus `read,write,issues:create,comments:create`.
- Izmantojiet **Pārbaudīt savienojumu** akreditācijas dialogā, lai pārbaudītu API atslēgu vai OAuth žetonu pret Linear API.
- Izmantojiet List Teams un List Projects Linear mezglā, lai atklātu UUID pirms problēmu izveides vai filtrēšanas.
- Izmantojiet List Workflow States un List Team Members, lai atklātu stāvokļa un piešķirtā UUID atjauninājumiem.
- Mainiet API atslēgu, rediģējot akreditācijas datus un ievadot aizvietošanas vērtību. Ja maināt OAuth lietojumprogrammas slepenos kodus, atkārtoti savienojiet akreditācijas datus, izmantojot **Savienot**.

### Izmanto

- [Linear mezgls](../nodes/linear-node.md)

---

## Jira

Jira akreditācijas dati glabā Jira pamata autentifikācijas akreditācijas datus, Jira vietnes bāzes URL, izvietošanas režīmu un opciju REST API versiju [Jira mezglam](../nodes/jira-node.md). Izmantojiet `cloud` Jira Cloud vai `data_center` Jira Data Center / Server.

### Iestatīšana

**Jira Cloud**

1. Atlassian konta iestatījumos izveidojiet API žetonu.
2. Heym Dashboard → **Akreditācijas dati** → **Jauns** → ierakstiet **Jira**.
3. Ievadiet Atlassian e-pastu, API žetonu un Jira vietnes URL, piemēram, `https://your-domain.atlassian.net`.
4. Izmantojiet **Pārbaudīt savienojumu**, lai pārbaudītu akreditācijas datus.

**Jira Data Center / Server**

1. Izvēlieties **Jira Data Center / Server** kā izvietošanas režīmu.
2. Ievadiet Jira lietotājvārdu un paroli, kas izmantota pamata autentifikācijai.
3. Ievadiet Jira vietnes URL, piemēram, `https://jira.example.com`.
4. Izmantojiet **Pārbaudīt savienojumu**, lai pārbaudītu akreditācijas datus.

### Lauki

| Lauks | Apraksts |
|-------|----------|
| `email` | Jira Cloud Atlassian konta e-pasts vai Jira Data Center / Server lietotājvārds |
| `api_token` | Jira Cloud Atlassian API žetons vai Jira Data Center / Server parole pamata autentifikācijai |
| `base_url` | Jira vietnes bāzes URL |
| `deployment` | `cloud` Jira Cloud vai `data_center` Jira Data Center / Server |
| `api_version` | REST API versija; noklusējuma vērtība ir `3` Jira Cloud. Data Center / Server izmanto v2 |

### Piezīmes

- Jira mezgls nosūta problēmu aprakstus un komentārus kā Atlassian dokumentu formāta tekstus Jira Cloud REST API v3. Data Center / Server akreditācijas dati nosūta vienkāršu tekstu.
- Data Center / Server pašlaik atbalsta tikai lietotājvārda/paroles pamata autentifikāciju. Personīgās piekļuves atslēgas un Bearer autentifikācija vēl nav atbalstīta.
- Pielikumu augšupielāde pieņem base64 vai datu URL saturu un ir pakļauta platformas faila lieluma ierobežojumam (noklusējums 99 MB). Pielikumu lejupielāde var atgriezt base64 saturu, kad tas ir iespējots.
- Lietotāju izveide, dzēšana un problēmu paziņojumi prasa, lai autentificētajam Jira kontam būtu attiecīgās Jira vietnes vai organizācijas atļaujas.
- Izmantojiet List Projects, Search Issues un List Transitions, lai atklātu projekta atslēgas, problēmu atslēgas un pārejas ID.
- Pielāgotām galapunktiem, kas nav iekļauti Jira mezglā, izmantojiet [HTTP mezglu](../nodes/http-node.md) ar Jira pamata autentifikāciju (`email:api_token` Cloud vai `username:password` Data Center / Server) cURL komandā vai galvenes akreditāciju ar atbilstošo `Authorization: Basic <base64(user:secret)>` vērtību.

Skatiet arī:

- [Jira mezgls](../nodes/jira-node.md)
- [Akreditācijas dati](./credentials.md)

---

## Sentry

Sentry akreditācijas dati glabā autentifikācijas žetonu [Sentry mezglam](../nodes/sentry-node.md). Heym izmanto Sentry REST API organizācijas, projekta, komandas, problēmu, notikumu un izlaišanas operācijām.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|----------|
| `api_token` | Sentry autentifikācijas žetons ar piekļuvi organizācijām un projektiem, kurus automatizējat |

### Opciju lauki

| Lauks | Apraksts |
|-------|----------|
| `base_url` | Opcionāls saknes URL pašizvietotam Sentry, piemēram, `https://sentry.example.com` |

### Piezīmes

- Atstājiet `base_url` tukšu Sentry SaaS.
- Izmantojiet **Pārbaudīt savienojumu**, lai apstiprinātu, ka žetons var uzskaitīt redzamās organizācijas.
- Pielāgotām REST izsaukumiem izmantojiet `$credentials.YourSentryCredential` kā nesēju žetonu.

### Izmanto

- [Sentry mezgls](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) ir atvērtā koda vektoru datubāze, ko izmanto semantiskai meklēšanai un RAG (Retrieval Augmented Generation).

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|----------|
| `qdrant_host` | Pilns URL uz Jūsu Qdrant instance (piemēram, `http://localhost:6333` vai mākoņa galapunkts) |
| `openai_api_key` | OpenAI API atslēga, ko izmanto, lai ģenerētu iekapsulējumus, indeksējot un meklējot dokumentus |
### Piezīmes

- Qdrant kolekcijas tiek pārvaldītas no [Vektoru krātuves](../tabs/vectorstores-tab.md) cilnes. Katrs vektoru krātuve atbilst Qdrant kolekcijai.
- [RAG mezgls](../nodes/rag-node.md) izmanto vektoru krātuvi (kas atsaucas uz Qdrant akreditācijas datiem) — tas tieši neatsaucas uz akreditācijas datiem.
- Ja Jūsu Qdrant instances prasa API atslēgu, iekļaujiet to `qdrant_host` vērtībā vai konfigurējiet Qdrant attiecīgi; pašreizējā integrācija nesatur atsevišķu Qdrant API atslēgas lauku.
- Pašuzņēmuma Qdrant: izmantojiet [oficiālo Docker attēlu](https://hub.docker.com/r/qdrant/qdrant) un atveriet portu `6333`.

### Izmanto

- [RAG mezgls](../nodes/rag-node.md) (caur vektoru krātuvi)
- [Vektoru krātuves cilne](../tabs/vectorstores-tab.md)

## Pielāgotie Ieguldījumi (RAG)

Pēc noklusējuma RAG ieguldījumi nāk no OpenAI. **RAG: Pielāgotie ieguldījumi** akreditācijas dati norāda uz jebkuru OpenAI saderīgu ieguldījumu endpoint — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together vai mitinātu vārteju — un nosaka vektoru krātuvi, kurā tie tiek ierakstīti.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `embedding_base_url` | Endpoint URL, kas ietver `/v1` ceļu, piemēram, `http://localhost:11434/v1` |
| `embedding_api_key` | Nepieciešams. Vietējie serveri parasti neprasa atslēgu |
| `embedding_model` | Modeļa nosaukums, kā to sagaida endpoint, piemēram, `nomic-embed-text` |
| `embedding_dimensions` | Vektora platums, ko modelis atgriež (noklusējums `1536`) |
| `embedding_request_dimensions` | Nepieciešams. Lūdziet endpoint atgriezt `embedding_dimensions` vietā, nevis modeļa dabisko platumu |
| `db_type` | `qdrant` vai `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant savienojums, nepieciešams, kad `db_type` ir `qdrant` |

### Piezīmes

- **Qdrant pieņem jebkuru dimensiju skaitu.** Katrs kolekcija tiek izveidota ar platumu, ko šie akreditācijas dati deklarē, tāpēc Dimensiju lauks ir brīvi rediģējams.
- **Postgres (pgvector) prasa precīzi 1536 dimensijas.** Tās kolonna ir fiksēta `vector(1536)`, tāpēc Dimensiju lauks ir piesaistīts 1536 un akreditācijas dati, kas deklarē jebkuru citu platumu, tiek noraidīti saglabāšanas laikā.
- **Saīsināšana pgvector.** Kad krātuve ir Postgres, dialogs piedāvā *Lūdziet endpoint atgriezt 1536 dimensijas*. Tas nosūta `dimensions` pieprasījuma parametru, kuru modeļi, kas apmācīti ar Matryoshka reprezentācijām (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` un līdzīgi), ievēro, atgriežot saīsinātu, jēgpilnu vektoru. Endpoints, kas neatbalsta parametru, noraida pieprasījumu, un endpoints, kas pieņem, bet ignorē to, rada skaidru kļūdu, norādot faktisko atgriezto platumu. Heym nekad neapgriež vektorus pats, jo nepareiza modeļa izvades sagriešana klusi pasliktina meklēšanas kvalitāti. Šī opcija netiek piedāvāta Qdrant, kas var pielāgot kolekcijas platumu.
- Izmantojiet **Test Connection** akreditācijas datu dialogā, lai iekļautu pārbaudes virkni un redzētu platumu, ko modelis faktiski atgriež pirms krātuves izveides.
- `dimensions` pieprasījuma parametrs tiek nosūtīts tikai uz OpenAI, jo lielākā daļa OpenAI saderīgu serveru noraida nezināmus parametrus. Modeļa dabiskā platuma validācija tiek veikta pret akreditācijas datiem.
- Esošie **RAG: Qdrant + OpenAI** un **RAG: Psql + OpenAI** akreditācijas dati paliek nemainīgi un turpina darboties.

### Izmanto

- [RAG mezgls](../nodes/rag-node.md) (caur vektoru krātuvi)
- [Vektoru krātuves cilne](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym var arī glabāt vektorus **savas Postgres datu bāzes iekšienē**, izmantojot [pgvector](https://github.com/pgvector/pgvector) paplašinājumu — nav nepieciešama ārēja vektoru pakalpojuma. Izveidojiet **RAG: Psql + OpenAI** akreditācijas datus un izmantojiet tos, veidojot vektoru krātuvi, pēc tam izvēlieties **Postgres (pgvector)** RAG mezgla datu bāzes nolaižamajā sarakstā.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `openai_api_key` | OpenAI API atslēga, kas tiek izmantota ieguldījumu ģenerēšanai, indeksējot un meklējot dokumentus |

### Piezīmes

- Nav nepieciešams host/port — vektori tiek ierakstīti Heym pašu datu bāzē; Heym nekad nesavienojas ar citu datu bāzi.
- Katrs RAG funkcionalitāte, kas pieejama ar Qdrant (ievietošana, meklēšana, metadatu filtri, Cohere atkārtota rangēšana, klonēšana, koplietošana), darbojas identiski ar Postgres aizmuguri.
- Nepieciešams `vector` paplašinājums. Heym saglabā oficiālo `postgres:16` attēlu nemainīgu (tādējādi esošie dati nekad netiek skarti) un **automātiski instalē `postgresql-16-pgvector` pakotni palaišanas laikā** — `run.sh`, `deploy.sh` un `run_e2e.sh` to visu apstrādā. Instalācija nav fatāla: ja tā nevar tikt izpildīta (piemēram, nav tīkla), Qdrant RAG turpina darboties un Postgres aizmugure paliek neaktīva (migrācija iziet cauri tabulai bez problēmām).
- Ja Jūs palaidīsiet publicēto vienas konteineru attēlu (`ghcr.io/heymrun/heym`) pret **savu ārējo Postgres**, šai datu bāzei jāatbalsta `vector` paplašinājums (Heym to nevar instalēt datu bāzē, kuru tas neuzrauga). Bez tā, veidojot vai augšupielādējot uz Postgres vektoru krātuvi, tiek atgriezta skaidra ziņa un Qdrant RAG turpina darboties.

### Izmanto

- [RAG mezgls](../nodes/rag-node.md) (caur vektoru krātuvi)
- [Vektoru krātuves cilne](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) ir izklājlapu/datu bāzes hibrīds, kas atbalsta strukturētus datus un formulas. Grist akreditācijas dati ļauj Heym lasīt un rakstīt Grist dokumentus.
### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `api_key` | Grist API atslēga (atrodama **Profils → API atslēga** Jūsu Grist instancē) |
| `server_url` | Jūsu Grist servera bāzes URL (piem., `https://docs.getgrist.com` Grist Cloud, vai Jūsu pašizvietotais URL) |

### Piezīmes

- [Grist node](../nodes/grist-node.md) konfigurācijā ir nepieciešams **Dokumenta ID** (no Grist dokumenta URL) un **Tabulas ID** — tie nav daļa no akreditācijas datiem.
- Pašizvietotam Grist, iestatiet `server_url` uz Jūsu instances domēnu.
- Kolonnu ID Grist izmanto zemsvītras (piem., `User_Name`), nevis attēlošanas etiķetes. Izmantojiet `listColumns` operāciju, lai tās atklātu.

### Izmanto

- [Grist node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets akreditācijas dati savieno Heym ar Google Sheets API, izmantojot OAuth2 "Piedāvājiet savu lietotni" modeli. Jūs nodrošināt Google Cloud OAuth2 Klienta ID un Klienta slepeno atslēgu, pēc tam autorizējat piekļuvi, izmantojot pārlūkprogrammas uznirstošo logu. Tokeni tiek automātiski atjaunoti fona režīmā.

### Iestatīšana

1. Atveriet [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → meklējiet un iespējot **Google Sheets API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → lietojumprogrammas veids **Web application**.
3. Zem **Authorized redirect URIs** pievienojiet: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Nokopējiet ģenerēto **Klienta ID** un **Klienta slepeno atslēgu**.
5. Heym Dashboard → **Credentials** → **New** → ierakstiet **Google Sheets (OAuth2)**.
6. Ievadiet Klienta ID, Klienta slepeno atslēgu un nosaukumu, pēc tam noklikšķiniet uz **Connect**, lai atvērtu Google piekrišanas uznirstošo logu un autorizētu piekļuvi.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `client_id` | OAuth2 Klienta ID no Google Cloud Console |
| `client_secret` | OAuth2 Klienta slepenā atslēga no Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) tiek uzglabāti un automātiski atjaunoti — Jūs tos tieši neadministrējat.

### Piezīmes

- OAuth2 piekrišanas ekrānam ir nepieciešama izklājlapu joma (`https://www.googleapis.com/auth/spreadsheets`).
- Heym izmanto atsvaidzināšanas tokenu, lai iegūtu jaunus piekļuves tokenus pirms to derīguma termiņa beigām (60 sekunžu drošības buferis).
- Ja Jūs maināt Klienta slepeno atslēgu Google Cloud Console, atkārtoti savienojiet akreditācijas datus, izmantojot **Connect** pogu.
- **Ražošana:** Iestatiet backend **`FRONTEND_URL`** uz precīzu publisko URL, ko lietotāji atver pārlūkā (shēma + host, piemēram, `https://heym.example.com`). Heym veido Google OAuth pāradresācijas URI tikai no šīs vērtības — tas **neuzticas** `Origin` vai `X-Forwarded-*` galviņām (klienta kontrolē). Reģistrējiet `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` Google Cloud Console.

### Izmanto

- [Google Sheets node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive akreditācijas dati savieno Heym ar Google Drive API, izmantojot to pašu OAuth2 "Piedāvājiet savu lietotni" modeli kā Google Sheets. Jūs nodrošināt Google Cloud OAuth2 Klienta ID un Klienta slepeno atslēgu, pēc tam autorizējat piekļuvi, izmantojot pārlūkprogrammas uznirstošo logu. Tokeni tiek automātiski atjaunoti fona režīmā.

### Iestatīšana

1. Atveriet [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → meklējiet un iespējot **Google Drive API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → lietojumprogrammas veids **Web application**.
3. Zem **Authorized redirect URIs** pievienojiet: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Nokopējiet ģenerēto **Klienta ID** un **Klienta slepeno atslēgu**.
5. Heym Dashboard → **Credentials** → **New** → ierakstiet **Google Drive (OAuth2)**.
6. Ievadiet Klienta ID, Klienta slepeno atslēgu un nosaukumu, pēc tam noklikšķiniet uz **Connect**, lai atvērtu Google piekrišanas uznirstošo logu un autorizētu piekļuvi.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `client_id` | OAuth2 Klienta ID no Google Cloud Console |
| `client_secret` | OAuth2 Klienta slepenā atslēga no Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) tiek uzglabāti un automātiski atjaunoti — Jūs tos tieši neadministrējat.

### Joma

Google Drive pieprasa **pilnu Drive jomu** (`https://www.googleapis.com/auth/drive`).

Tas ir nepieciešams, jo mezgls darbojas ar failiem, kas Jums jau pieder. Šaurāka `drive.file` joma piešķir piekļuvi tikai failiem, kurus OAuth klients pats izveidojis, kas padarītu `listFolderFiles`, `updateFile`, `removeFile` un `removeFolder` neredzamus Jūsu esošajam Drive.

Tā kā Jūs nodrošināt savu Klienta ID un Slepeno atslēgu no sava Google Cloud projekta, Google lietotnes verifikācijas prasības šai jomai attiecas uz Jūsu projektu, nevis uz Heym.

### Piezīmes

- Heym izmanto atsvaidzināšanas tokenu, lai iegūtu jaunus piekļuves tokenus pirms to derīguma termiņa beigām (60 sekunžu drošības buferis).
- Ja Jūs maināt Klienta slepeno atslēgu Google Cloud Console, atkārtoti savienojiet akreditācijas datus, izmantojot **Connect** pogu.
- Koplietotie diski tiek atbalstīti — mezgls katrā API izsaukumā iestata `supportsAllDrives`.
- **Ražošana:** Iestatiet backend **`FRONTEND_URL`** uz precīzu publisko URL, ko lietotāji atver pārlūkā. Heym veido Google OAuth pāradresācijas URI tikai no šīs vērtības — tas **neuzticas** `Origin` vai `X-Forwarded-*` galviņām. Reģistrējiet `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` Google Cloud Console.
- Pirms šīs akreditācijas datu koplietošanas ar komandu, skatiet [Akreditācijas datu koplietošana](./credentials-sharing.md).

### Izmanto

- [Google Drive node](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery akreditācijas dati savieno Heym ar Google BigQuery API, izmantojot OAuth2 "Bring Your Own App" modeli. Jūs norādāt Google Cloud OAuth2 Klienta ID un Klienta slepeno kodu, pēc tam autorizējat piekļuvi, izmantojot pārlūkprogrammas uznirstošo logu. Tokeni tiek automātiski atjaunoti fona režīmā.

### Iestatīšana

1. Atveriet [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → meklējiet un iespējot **BigQuery API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → lietojumprogrammas veids **Web application**.
3. Zem **Authorized redirect URIs** pievienojiet: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Nokopējiet ģenerēto **Client ID** un **Client Secret**.
5. Heym Dashboard → **Credentials** → **New** → ierakstiet **BigQuery (OAuth2)**.
6. Ievadiet Klienta ID, Klienta slepeno kodu un nosaukumu, pēc tam noklikšķiniet uz **Connect**, lai atvērtu Google piekrišanas uznirstošo logu un autorizētu piekļuvi.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `client_id` | OAuth2 Klienta ID no Google Cloud Console |
| `client_secret` | OAuth2 Klienta slepenais kods no Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) tiek uzglabāti un automātiski atjaunoti.

### Piezīmes

- OAuth2 piekrišanas ekrānam ir nepieciešama BigQuery joma (`https://www.googleapis.com/auth/bigquery`).
- **Produkcija:** Iestatiet backend **`FRONTEND_URL`** uz publisko URL. Reģistrējiet `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` Google Cloud Console.

### Izmanto

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Supabase akreditācijas dati savieno Heym ar Supabase projekta PostgREST API, lai darbplūsmas varētu vaicāt un mainīt Postgres atbalstītās tabulas.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `supabase_url` | Projekta bāzes URL, piemēram, `https://your-project.supabase.co` |
| `supabase_key` | API atslēga ar piekļuvi mērķa tabulām |
| `supabase_schema` | Opcionāls noklusējuma shēma (noklusējuma ir `public`) |

### Piezīmes

- [Supabase node](../nodes/supabase-node.md) sazinās ar `/rest/v1/<table>` un atbalsta operatoru filtrus (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` un saistītie PostgREST operatori), kā arī ligzdotus `or` / `and` loģiskos grupējumus.
- Rakstīšanas operācijām dodiet priekšroku atslēgai, kas paredzēta uzticamai servera puses izmantošanai ar minimālajām nepieciešamajām tabulu atļaujām.
- Mezgli var pārsniegt shēmu katrā solī, pat ja akreditācijas dati nosaka noklusējuma shēmu.

### Izmanto

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

ClickHouse akreditācijas dati savieno Heym ar ārēju ClickHouse datubāzi, izmantojot tās HTTP saskarni, lai darbplūsmas varētu veikt SQL, CRUD un skaitīšanas operācijas pret OLAP tabulām.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `host` | HTTP host bez shēmas, piemēram, `your-instance.clickhouse.cloud` |
| `port` | HTTP saskarnes ports (`8443` HTTPS, `8123` HTTP) |
| `username` | ClickHouse lietotājs (noklusējuma ir `default`) |
| `password` | Lietotāja parole (opcijonāli) |
| `database` | Mērķa datubāze (noklusējuma ir `default`) |
| `secure` | Izmantojiet HTTPS, kad ir `true` (prasa ClickHouse Cloud) |

### Piezīmes

- [ClickHouse node](../nodes/clickhouse-node.md) izmanto oficiālo `clickhouse-connect` HTTP klientu un parametrizē filtrus un vērtību saistīšanu.
- `update` un `remove` atbilst `ALTER TABLE ... UPDATE` un `DELETE FROM`, kas ir asinkronas ClickHouse mutācijas; abām ir nepieciešams filtrs.
- `upsert` veic `INSERT` un pieņem, ka ir `ReplacingMergeTree` tabula, lai nodrošinātu apvienošanu pēc atslēgas.
- Izmantojiet **Test connection** akreditācijas dialogā, lai pārbaudītu sasniedzamību.

### Izmanto

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Notion akreditācijas dati atbalsta vai nu iekšējo integrācijas tokenu, vai publiskās integrācijas OAuth savienojumu. OAuth ļauj katram lietotājam autorizēt Notion darba telpu no Heym, nevis manuāli kopējot tokenu.

### Nepieciešamie lauki

| Režīms | Lauks | Apraksts |
|------|-------|-------------|
| Iekšējais token | `api_token` | Iekšējais integrācijas token (`ntn_...`) |
| OAuth | `client_id` | Klienta ID no Notion publiskās integrācijas |
| OAuth | `client_secret` | Klienta slepenais kods no Notion publiskās integrācijas |

OAuth atgriešanas URI automātiski uzglabā `access_token`, `auth_mode`, `workspace_id`, `workspace_name` un `bot_id`. Jebkurš iepriekšējais iekšējais `api_token` tiek noņemts, kad OAuth tiek pabeigts. Reģistrējiet šo pāradresācijas URI Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth iestatīšanas plūsma

1. Izvēlieties **OAuth** akreditācijas dialogā, ievadiet nosaukumu, Klienta ID un Klienta slepeno kodu.
2. Noklikšķiniet uz **Connect** un autorizējiet darba telpu Notion uznirstošajā logā.
   - Ja tas ir **jauns** akreditācijas datu ieraksts, Heym izveido akreditācijas datu ierakstu, kad noklikšķināt uz **Connect**.
   - Pabeidziet autorizāciju uznirstošajā logā, pēc tam noklikšķiniet uz **Save**, lai atgrieztos pie akreditācijas datu saraksta.
3. Savienotā akreditācija sarakstā parādās kā `connected (Workspace Name)`. Gaidošās OAuth akreditācijas parādās kā `Not connected`, līdz autorizācija tiek pabeigta.

Izmantojiet **Test Connection** akreditācijas dialogā, lai pārbaudītu vai nu iekšējo tokenu, vai pabeigtu OAuth autorizāciju. Rediģējot, atstājot tokena lauku tukšu, tiek saglabāts uzglabātais iekšējais token. 

Gan iekšējie tokeni, gan OAuth piekļuves tokeni ir pieejami caur `$credentials.CredentialName` pielāgotām [HTTP](../nodes/http-node.md) izsaukumiem, kuriem nepieciešams Notion nesēja token.
### Piezīmes

- Iekšējām integrācijām ir nepieciešams, lai attiecīgās lapas, datu bāzes un datu avoti tiktu kopīgoti.
- OAuth lietotāji izvēlas darba vietu/lapas Notion autorizācijas laikā.
- OAuth lietojumprogrammas akreditācijas dati tiek šifrēti iekš Notion akreditācijas datos. Atgriešanās notiek servera pusē; slepenais kods nav iekļauts OAuth stāvoklī.
- Savienotie OAuth akreditācijas dati parāda darba vietas nosaukumu; gaidošie OAuth akreditācijas dati rāda `Not connected` līdz autorizācija tiek pabeigta.
- **Ražošana:** Iestatiet backend **`FRONTEND_URL`** uz publisko pārlūkprogrammas URL (shēma + host, bez pēdējā slīpsvītra). Notion pāradresācijas URI ir jāatbilst precīzi:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Mezgls izmanto API versiju `2026-03-11` un pašreizējo `data_source` terminoloģiju. Skatiet [Notion node](../nodes/notion-node.md#api-version-notes) rakstu migrācijas vadlīnijām no vecākām `archived`, `after` vai datu bāzes vaicājumu piemēriem.
- Vecie meklēšanas filtri ar objekta vērtību `database` tiek normalizēti uz `data_source`.

### Izmanto

- [Notion node](../nodes/notion-node.md)

---

## SMTP (E-pasts)

SMTP akreditācijas dati glabā e-pasta servera savienojuma detaļas izejošā pasta sūtīšanai.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `host` | SMTP servera hostname (piemēram, `smtp.gmail.com`) |
| `port` | SMTP ports (parasti `587` STARTTLS, `465` SSL) |
| `email` | Lietotājvārds, ar kuru SMTP serveris pierakstās; arī redzamais sūtītājs, ja `from` ir tukšs |
| `password` | SMTP parole vai lietotnes parole |

### Papildus lauki

| Lauks | Apraksts |
|-------|-------------|
| `from` (`smtp_from`) | Redzamā sūtītāja (From) adrese. Atstājiet tukšu, lai sūtītu kā `email`. Serveris joprojām pierakstās kā `email`, tāpēc šim kontam ir jābūt atļaujai sūtīt no šīs adreses (Gmail — verificēts **Sūtīt pastu kā** aizstājvārds). |

### Biežākie SMTP pakalpojumu sniedzēji

| Pakalpojumu sniedzējs | Host | Ports | Piezīmes |
|-----------------------|------|-------|---------|
| Gmail | `smtp.gmail.com` | `587` | Nepieciešama [Lietotnes parole](https://support.google.com/accounts/answer/185833) (2FA ir jāieslēdz) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Izmantojiet savus Microsoft konta akreditācijas datus |
| Mailgun | `smtp.mailgun.org` | `587` | Izmantojiet Mailgun SMTP akreditācijas datus no jūsu domēna iestatījumiem |
| SendGrid | `smtp.sendgrid.net` | `587` | Izmantojiet `apikey` kā lietotājvārdu un API atslēgu kā paroli |
| Pielāgots / Pašhostēts | jūsu domēns | `587` / `465` | Postfix, Exim utt. |

### Piezīmes

- Gmail prasa **Lietotnes paroli** vietā jūsu parastās paroles, kad ir iespējota 2-soļu verifikācija.
- Ports `587` izmanto STARTTLS (sākas kā plaintext, uzlabojas uz TLS). Ports `465` izmanto implicit TLS (SSL no paša sākuma).

### Izmanto

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Ienākošais e-pasts)

IMAP akreditācijas dati glabā savienojuma detaļas, lai uzraudzītu iesūtnes ar [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `imap_host` | IMAP servera hostname (piemēram, `imap.gmail.com`) |
| `imap_port` | IMAP ports (`993` SSL/TLS lielākajā daļā pakalpojumu sniedzēju) |
| `imap_username` | Pasta kastes lietotājvārds vai pilna e-pasta adrese |
| `imap_password` | Parole vai pakalpojumu sniedzēja specifiska lietotnes parole |

### Papildus lauki

| Lauks | Apraksts |
|-------|-------------|
| `imap_mailbox` | Pasta kastes mape, ko uzraudzīt (noklusējums: `INBOX`) |
| `imap_use_ssl` | Iespējot SSL/TLS (ieteicams; noklusējums: `true`) |

### Piezīmes

- IMAP triggers pirmo reizi nosaka pašreizējo pasta kasti un pēc tam apstrādā tikai jaunākos e-pastus.
- Gmail, Microsoft 365 un citi mitinātie pakalpojumu sniedzēji bieži prasa **lietotnes paroli** vai līdzīgu IMAP specifisku noslēpumu.
- Pielikumu saturs netiek lejupielādēts darba plūsmas payload; Heym izsaka tikai pielikumu metadatus.

### Izmanto

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP kā darba plūsmas triggers)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) ir atvērtā koda ziņojumu starpnieks. RabbitMQ akreditācijas dati glabā savienojuma detaļas publicēšanai un patēriņam no rindām un apmaiņām.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `rabbitmq_host` | AMQP savienojuma URL (piemēram, `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ lietotājvārds (noklusējums: `guest`) |
| `rabbitmq_password` | RabbitMQ parole (noklusējums: `guest`) |

### Virtuālie hosti

Lai savienotos ar konkrētu virtuālo hostu, iekļaujiet to `rabbitmq_host` URL:

```
amqp://username:password@hostname:5672/vhost
```

Ja izmantojat noklusējuma vhost, ceļu `/` var izlaist.

### Aizkavētā ziņojuma spraudnis

[RabbitMQ node](../nodes/rabbitmq-node.md) atbalsta **rabbitmq_delayed_message_exchange** spraudni. Kad šis spraudnis ir iespējots jūsu RabbitMQ serverī, jūs varat iestatīt aizkavi (milisekundēs) izejošajiem ziņojumiem, izmantojot `rabbitmqDelayMs` lauku uz mezgla.

Mezgls iestata `x-delay` virsrakstu publicētajam ziņojumam. Apmaiņas tips ir jābūt `x-delayed-message`, lai aizkaves darbotos.

Lai iespējotu spraudni pašhostētā RabbitMQ instance:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Kad spraudnis nav instalēts, `x-delay` virsraksts tiek ignorēts un ziņojumi tiek piegādāti nekavējoties.

### Izmanto

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ kā darba plūsmas triggers)

---

## Amazon S3

Amazon S3 akreditācijas dati savieno Heym ar [Amazon S3](https://aws.amazon.com/s3/). Izmantojiet to ar [Amazon S3 node](../nodes/amazon-s3-node.md), lai pārvaldītu kausus un mapes, augšupielādētu un lejupielādētu objektus, kopētu atslēgas un uzskaitītu vai dzēstu objektus no darba plūsmām.
### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `aws_access_key_id` | AWS IAM piekļuves atslēgas ID |
| `aws_secret_access_key` | Slepenā piekļuves atslēga, kas saistīta ar piekļuves atslēgas ID |
| `aws_region` | AWS reģions, kur atrodas tvertnes (piem., `us-east-1`) |

### Papildu lauki

| Lauks | Apraksts |
|-------|-------------|
| `aws_session_token` | Pagaidu sesijas tokens, izmantojot AWS STS akreditācijas datus |

### Piezīmes

- Akreditācijas dati izmanto standarta AWS SigV4 autentifikāciju, izmantojot boto3.
- Augšupielādes operācijas pašlaik nosūta UTF-8 teksta saturu; lejupielādes var atgriezt tekstu vai base64 bināriem objektiem.

### Izmanto

- [Amazon S3 mezgls](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) ir atmiņā balstīta atslēga-vērtība krātuve, kas tiek izmantota kešatmiņai un ātrai datu piekļuvei.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `host` | Redis servera hostname vai IP (piem., `localhost`) |
| `port` | Redis ports (noklusējums: `6379`) |
| `password` | Redis parole (atstājiet tukšu, ja nav iestatīta) |

### Izmanto

- [Redis mezgls](../nodes/redis-node.md)

---

## Slack

Slack akreditācijas dati glabā **Ienākošā Webhook URL**, lai publicētu ziņas Slack kanālos.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `webhook_url` | Slack Ienākošā Webhook URL (no Jūsu Slack lietotnes konfigurācijas) |

### Piezīmes

- Izveidojiet Ienākošo Webhook pie [api.slack.com/apps](https://api.slack.com/apps) → Jūsu lietotne → **Ienākošie Webhook**.
- Katrs webhook ir saistīts ar konkrētu kanālu. Izveidojiet vairākas akreditācijas datu kopas dažādiem kanāliem.

### Izmanto

- [Slack mezgls](../nodes/slack-node.md)

---

## Telegram

Telegram akreditācijas dati glabā **Bot Token** un opciju **Webhook Secret Token** botu balstītām darbplūsmām.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `bot_token` | Telegram Bot API tokens no BotFather |

### Papildu lauki

| Lauks | Apraksts |
|-------|-------------|
| `secret_token` | Kopīgais noslēpums, kas tiek pārbaudīts pret `x-telegram-bot-api-secret-token` ienākošajos webhook |

### Piezīmes

- Izmantojiet tos pašus akreditācijas datus gan [Telegram Trigger](../nodes/telegram-trigger-node.md), gan [Telegram](../nodes/telegram-node.md).
- Reģistrējiet webhook manuāli, izmantojot Telegram `setWebhook` API, izmantojot URL, kas parādīts Telegram Trigger mezgla panelī.
- `chatId` Telegram mezglā var būt burtiska ID vai izteiksme, piemēram, `$telegramEvent.message.chat.id`.

### Izmanto

- [Telegram Trigger mezgls](../nodes/telegram-trigger-node.md)
- [Telegram mezgls](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Šie akreditācijas dati tiek izmantoti [HTTP mezglā](../nodes/http-node.md), lai autentificētu izejošos pieprasījumus.

### Bearer

Pievieno `Authorization: Bearer <token>` galveni HTTP pieprasījumiem.

| Lauks | Apraksts |
|-------|-------------|
| `token` | Bearer token vērtība |

### Header

Pievieno pielāgotu galveni HTTP pieprasījumiem.

| Lauks | Apraksts |
|-------|-------------|
| `header_key` | Galvenes nosaukums (piem., `X-Api-Key`) |
| `header_value` | Galvenes vērtība |

Abus veidus var arī atsaukties, izmantojot `$credentials.CredentialName` [Expression DSL](./expression-dsl.md) dinamiski lietošanai jebkurā mezglā, kas pieņem izteiksmes.

### Izmanto

- [HTTP mezgls](../nodes/http-node.md)

---

## LLM nodrošinātāji (OpenAI, Google, Custom, Cohere)

Šie akreditācijas dati nodrošina AI mezglus.

| Tips | Apraksts |
|------|-------------|
| **OpenAI** | API atslēga GPT modeļiem un OpenAI iekļaušanai |
| **Google** | API atslēga Gemini modeļiem |
| **Custom** | API atslēga + bāzes URL OpenAI saderīgiem galapunktiem (Ollama, vLLM, LM Studio utt.) |
| **Cohere** | API atslēga Cohere iekļaušanai |

### OpenAI Prompt kešatmiņa

OpenAI automātiski kešē statisko (nemainīgo) Jūsu sistēmas pieprasījuma prefiksu — nav nepieciešama papildu konfigurācija. Atkārtotas darbplūsmas izpildes, kas dalās tajā pašā sistēmas pieprasījuma prefiksā, gūst labumu no kešētā tokenu cenu, kas samazina gan izmaksas, gan latentumu. Tas ir īpaši noderīgi, ja Jums ir garas, fiksētas instrukcijas un tikai lietotāja ziņa mainās starp izpildēm. Uzraugiet kešēšanas hitu rādītājus un tokenu ietaupījumus [Izpildes tabulā](../tabs/traces-tab.md) vai OpenAI lietošanas informācijas panelī, lai optimizētu Jūsu pieprasījuma struktūru maksimālai kešēšanas atkārtotai izmantošanai.

### Izmanto

- [LLM mezgls](../nodes/llm-node.md)
- [Aģenta mezgls](../nodes/agent-node.md)
- [RAG mezgls](../nodes/rag-node.md) (OpenAI iekļaušana, izmantojot Qdrant akreditācijas datus)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) ir starpniekserveris, lai apietu Cloudflare un līdzīgas botu aizsardzības problēmas.

### Nepieciešamie lauki

| Lauks | Apraksts |
|-------|-------------|
| `flaresolverr_url` | Jūsu FlareSolverr instances URL (piem., `http://localhost:8191`) |

Šeit tiek atbalstītas atgriezeniskās un privātās adreses, tādēļ FlareSolverr palaišana blakus Heym darbojas, kā dokumentēts. URL var neatrisināt uz saistīto vai mākoņu metadatu adresi. Tā kā privātās adreses ir atļautas, šo lauku var arī norādīt uz citu iekšēju pakalpojumu, un atbilde tiek atgriezta mezgla izejā. Ikviens, kas ir pierakstījies, var izveidot šos akreditācijas datus, tādēļ robeža ir tā, kas var autorēt darbplūsmas, kā arī Jūsu tīkla noteikumi, nevis akreditācijas datu koplietošana. Skatiet [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Izmanto

- [Crawler mezgls](../nodes/crawler-node.md)

---
## Saistītie

- [Akreditācijas dati](./credentials.md) – Akreditācijas datu pārskats un to izmantošana mezglos
- [Akreditāciju cilne](../tabs/credentials-tab.md) – Akreditāciju pievienošana un pārvaldība
- [Akreditāciju koplietošana](./credentials-sharing.md) – Akreditāciju koplietošana ar lietotājiem un komandām
- [Drošība](./security.md) – Šifrēšana miera stāvoklī, piekļuves kontrole
- [Izteikumu DSL](./expression-dsl.md) – `$credentials` sintakse dinamiskai piekļuvei

---

## Modeļu maršrutētājs (Auto Model)

Maršrutē katru pieprasījumu uz vienu no Jūsu esošajiem modeļu akreditācijas datiem, izmantojot lēmumu modeli izvēlei. Tas glabā atsauces, nekad neizmantojot savu atslēgu.

### Nepieciešamie lauki

- `decision_credential_id` – **Lēmumu modeļa** akreditācijas dati, kuriem Jūs varat piekļūt.
- `decision_model` – modelis, kas veic maršrutēšanas izsaukumu, piemēram, `jev-latest`.
- `options` – vismaz divas ieraksti, katrs ar nosaukumu, viens no Jūsu OpenAI/Google/Custom akreditācijas datiem, modelis uz tā un kritēriji, kas nosaka, kad tam jāuzvar.

### Papildus lauki

- `routing_instructions` – kā kopumā novērtēt iespējas.
- Viena iespēja var tikt atzīmēta kā rezerves variants, kas tiek izmantots, kad maršrutēšana neizdodas.

### Piezīmes

Iespēju nosaukumi ir tie, starp kuriem lēmumu modelis izvēlas, tāpēc tiem jābūt atšķirīgiem. Iespēja nevar norādīt uz citu modeļu maršrutētāju.
