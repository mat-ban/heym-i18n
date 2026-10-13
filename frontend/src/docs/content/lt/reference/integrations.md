# Trečiųjų Šalių Integracijos

Heym jungiasi prie išorinių paslaugų per **kredencialus**. Kiekvieno kredencialo tipo saugo prisijungimo duomenis vienai paslaugai ir gali būti naudojamas keliuose mazguose ir workflows. Daugiau informacijos rasite [Kredencialai](./credentials.md).

Pridėkite kredencialus [Nustatymai → Kredencialai](../tabs/credentials-tab.md). Visi duomenys yra šifruojami. Kredencialai gali būti [dalijami](./credentials-sharing.md) su kitais vartotojais arba [Komandomis](./teams.md).

Kai kurie integracijos mazgai **nereikalauja** kredencialų. [WebSocket Trigger](../nodes/websocket-trigger-node.md) ir [WebSocket Send](../nodes/websocket-send-node.md) jungiasi prie išorinių socket'ų naudodami URL, antraštes ir subprotokolus, kurie yra sukonfigūruoti tiesiogiai mazge.

## Kredencialų Tipai

| Tipas | Naudojamas | Pagrindiniai Laukai |
|-------|------------|---------------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, pasirenkamas `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, pasirenkamas `base_url` |
| **Jira** | [Jira mazgas](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, pasirenkamas `api_version` |
| **Linear** | [Linear mazgas](../nodes/linear-node.md) | `api_key`, arba `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry mazgas](../nodes/sentry-node.md) | `api_token`, pasirenkamas `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge teisėjas) | `base_url`, pasirenkamas `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | kredencialas sprendimų modeliui, plius modelio parinktys, nurodančios Jūsų kitus kredencialus |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorių saugyklos | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorių saugyklos | `openai_api_key` (vektoriai saugomi Heym nuosavame Postgres per pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorių saugyklos | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, pasirenkamas `embedding_api_key`, plius `qdrant_host`, kai `db_type` yra `qdrant` |
| **Grist** | [Grist mazgas](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets mazgas](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 sutikimas |
| **Google Drive** | [Google Drive mazgas](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 sutikimas (pilnas Drive apimtis) |
| **BigQuery** | [BigQuery mazgas](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 sutikimas |
| **Supabase** | [Supabase mazgas](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, pasirenkamas `supabase_schema` |
| **ClickHouse** | [ClickHouse mazgas](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion mazgas](../nodes/notion-node.md) | `api_token`, arba `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 mazgas](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Siųsti El. Laišką](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger mazgas](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger mazgas](../nodes/telegram-trigger-node.md), [Telegram mazgas](../nodes/telegram-node.md) | `bot_token`, pasirenkamas `secret_token` |
| **Discord** | [Discord mazgas](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger mazgas](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ mazgas](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis mazgas](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack mazgas](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger mazgas](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP mazgas](../nodes/http-node.md) | `token` |
| **Header** | [HTTP mazgas](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler mazgas](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub kredencialas saugo GitHub asmeninį prieigos tokeną (PAT), kad workflows galėtų kviesti GitHub REST API per [GitHub mazgą](../nodes/github-node.md), perduoti tokeną į MCP serverius, tokius kaip `@modelcontextprotocol/server-github`, arba naudoti jį iš [HTTP mazgo](../nodes/http-node.md) pritaikytoms REST užklausoms.

### Reikalingi Laukai

| Laukas | Aprašymas |
|--------|-----------|
| `api_key` | GitHub asmeninis prieigos tokenas (`github_pat_...` smulkiai sukonfigūruotas PAT arba klasikinis `ghp_...` PAT) |
### Pasirinktiniai Laukai

| Laukas | Aprašymas |
|--------|-----------|
| `base_url` | GitHub API pagrindinis URL GitHub Enterprise Server (pavyzdžiui, `https://github.example.com/api/v3`) |

### Pastabos

- Rekomenduojama naudoti smulkiai apibrėžtus asmeninius prieigos žetonus, kai tai įmanoma, nes juos galima pritaikyti konkretiems saugykloms ir leidimams.
- Palikite `base_url` tuščią GitHub.com. GitHub Enterprise Server atveju naudokite pilną REST API
  galinį tašką, įskaitant `/api/v3` (pavyzdžiui, `https://github.example.com/api/v3`), o ne
  serverio žiniatinklio UI šaknį, tokią kaip `https://github.example.com`.
- Šis kredencialas šiuo metu modeliuoja tik PAT pagrįstą autentifikavimą. Norint pasiekti organizacijos saugyklas, naudokite PAT, kuriam suteikti reikiami organizacijos/saugyklos leidimai.
- GitHub App diegimo žetonai ir GitHub App nustatymo srautai šiuo metu nėra pirmos klasės Heym UI.
- Rekomenduojama naudoti [GitHub mazgą](../nodes/github-node.md) natūraliems saugyklų, vartotojų, problemų, užklausų, apžvalgų, leidimų, veiksmų darbo eigų, srauto ir failų operacijoms. Naudokite [HTTP mazgą](../nodes/http-node.md) tik tada, kai reikia galinių taškų ar payload, kurių GitHub mazgas neapima.
- Naudokite [Agent mazgą](../nodes/agent-node.md) su MCP, perduodami `$credentials.YourGitHubCredential` į MCP ryšio aplinkos kintamąjį, pvz., `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHub REST API paprastai tikisi `Authorization: Bearer <token>` plius `Accept: application/vnd.github+json`.
- Redaguojant GitHub kredencialą, palikus GitHub Enterprise `base_url` tuščią, išsaugomas
  esamas galinis taškas. Naują URL įveskite tik tada, kai norite pakeisti tą galinį tašką.

### Naudojama

- [GitHub mazgas](../nodes/github-node.md)
- [Codex mazgas](../nodes/codex-node.md)
- [Agent mazgas](../nodes/agent-node.md)
- [HTTP mazgas](../nodes/http-node.md)

---

## Sprendimų Modelis

Sprendimų modelis atsako į tipizuotus klausimus apie būseną ir grąžina tikimybes, o ne tekstą. TypeSafe Jev yra nuorodinis įgyvendinimas; bet kuris galinis taškas, priimantis tą patį `{model, state, questions}` kūną, veikia, o [Decision](../nodes/decision-node.md) mazgas gali siųsti rankiniu būdu paruoštą kūną tiems, kurie to nedaro.

### Privalomi Laukai

- `base_url` – galinis taškas, pavyzdžiui, `https://api.typesafe.ai`. Heym pridės `/v1/systemone`.

### Pasirinktiniai Laukai

- `api_key` – siunčiamas kaip `Authorization: Bearer`. Galiniai taškai, kuriems nereikia rakto, gali palikti šį lauką tuščią.

### Pastabos

- **Testuoti Ryšį** siunčia vieną mažą klausimą, kad patvirtintų galinio taško ir rakto veikimą.
- Redaguojant kredencialą, saugomas raktas, kai raktų laukas paliekamas tuščias.
- Išoriniai užklausimai į privačius ir loopback adresus pagal numatytuosius nustatymus yra blokuojami, todėl savarankiškai talpinamas galinis taškas `localhost` arba privačiame diapazone reikalauja `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Šie modeliai nėra įtraukti į LLM kainodaros lenteles, kurias sinchronizuoja Heym, todėl Kainos stulpelis [Vykdymuose](../tabs/traces-tab.md) lieka tuščias. Žetonų skaičiai vis tiek yra registruojami.

### Naudojama

- [Decision](../nodes/decision-node.md)
- [Vertinimai](../tabs/evals-tab.md) – vertina `LLM-as-Judge` atsakymus pagal tikėtiną išvestį

## OpenAI Codex

OpenAI Codex kredencialas autentifikuoja [Codex mazgą](../nodes/codex-node.md). Jis yra atskiras nuo OpenAI API rakto kredencialo, naudojamo LLM, Agent ir RAG mazgams.

### Autentifikavimo Režimai

| Režimas | Aprašymas |
|---------|-----------|
| **Prisijungti su ChatGPT** (rekomenduojama) | OAuth (PKCE) prisijungimas, kuris naudoja Jūsų ChatGPT Plus/Pro prenumeratą, todėl vykdymai išvengia mokėjimų už kiekvieną žetoną. Heym saugo ir automatiškai atnaujina rakto paketą. |
| **Prieigos raktas** | ChatGPT/Codex `access_token`, perduodamas tik vietiniam Codex CLI procesui. |

### Pastabos

- API raktai yra atmetami šio tipo kredencialams.
- Codex žetonai nėra atskleidžiami per `$credentials.Name`.
- Codex mazgas taip pat reikalauja GitHub kredencialo saugyklos klonavimui, šakos stūmimui ir juodraščio PR kūrimui.

### Naudojama

- [Codex mazgas](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go kredencialas autentifikuoja [OpenCode Go mazgą](../nodes/opencode-go-node.md). Jis saugo OpenCode Go vartotojo API raktą (iš [opencode.ai/go](https://opencode.ai/go)) ir pasirinktinius vartotojo galinio taško URL.

### Laukai

| Laukas | Aprašymas |
|--------|-----------|
| **API Raktas** | OpenCode Go vartotojo API raktas (privalomas). |
| **Vartotojo Galinio Taško URL** | Pasirinktinis; numatytasis yra `https://opencode.ai/zen/go/v1`. Pakeiskite tik savarankiškai talpinamam arba per proxy vartotojo galiniam taškui. |

### Pastabos

- API raktas perduodamas tik OpenCode CLI procesui, esančiam sustiprintoje talpykloje.
- OpenCode Go mazgas taip pat reikalauja GitHub kredencialo saugyklos klonavimui, šakos stūmimui ir užklausos kūrimui. GitHub žetonas niekada nėra dedamas į smėlio dėžės talpyklą.

### Naudojama

- [OpenCode Go mazgas](../nodes/opencode-go-node.md)

---

## Linear

Linear kredencialas palaiko arba asmeninį API raktą, arba OAuth2 [Linear mazgui](../nodes/linear-node.md). Heym siunčia natūralius GraphQL užklausimus į Linear darbo erdvės
metaduomenims, projektams, problemoms ir komentarams.
### Nustatymas

Pasirinkite vieną autentifikavimo režimą:

**Asmeninis API raktas**

1. Linear programoje atidarykite **Nustatymai → Saugumas ir prieiga → Asmeniniai API raktai**.
2. Sukurkite raktą, kuris turėtų prieigą prie darbo erdvės, kurią norite automatizuoti.
3. Įklijuokite raktą į Linear kredencialą Heym programoje ir naudokite **Išbandyti ryšį**, kad jį patvirtintumėte.

**OAuth2**

1. Sukurkite Linear OAuth programą.
2. Užregistruokite `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kaip peradresavimo URI.
3. Heym valdymo skydelyje → **Kredencialai** → **Naujas** → įveskite **Linear**.
4. Pasirinkite **OAuth2**, įveskite Kliento ID ir Kliento Slaptažodį, tada spustelėkite **Prisijungti**.

### Privalomi laukai

| Režimas | Laukas | Aprašymas |
|---------|--------|-----------|
| Asmeninis API raktas | `api_key` | Linear asmeninis API raktas, dažniausiai pradedamas `lin_api_` |
| OAuth2 | `client_id` | Kliento ID iš Linear OAuth programos |
| OAuth2 | `client_secret` | Kliento Slaptažodis iš Linear OAuth programos |

OAuth žetonai (`access_token`, `refresh_token`, `token_expiry`) saugomi ir atnaujinami automatiškai.

### Pastabos

- Asmeniniai API raktai ir OAuth žetonai veikia kaip Linear vartotojas, kuris juos sukūrė arba autorizavo.
- Linear OAuth naudoja apimtis `read,write,issues:create,comments:create`.
- Naudokite **Išbandyti ryšį** kredencialų dialoge, kad patvirtintumėte API raktą arba OAuth žetoną prieš Linear API.
- Naudokite List Teams ir List Projects Linear mazge, kad atrastumėte UUID prieš kuriant ar filtruojant problemas.
- Naudokite List Workflow States ir List Team Members, kad atrastumėte būsenų ir atsakingų asmenų UUID atnaujinimams.
- Atnaujinkite API raktą redaguodami kredencialą ir įvesdami pakeitimo vertę. Jei atnaujinate OAuth programos slaptažodžius, vėl prisijunkite prie kredencialo per **Prisijungti**.

### Naudojama

- [Linear mazgas](../nodes/linear-node.md)

---

## Jira

Jira kredencialas saugo Jira Basic auth kredencialus, Jira svetainės pagrindinį URL, diegimo režimą ir pasirinktą REST API versiją [Jira mazgui](../nodes/jira-node.md). Naudokite `cloud` Jira Cloud arba `data_center` Jira Data Center / Server.

### Nustatymas

**Jira Cloud**

1. Atlassian paskyros nustatymuose sukurkite API raktą.
2. Heym valdymo skydelyje → **Kredencialai** → **Naujas** → įveskite **Jira**.
3. Įveskite Atlassian el. paštą, API raktą ir Jira svetainės URL, pavyzdžiui, `https://your-domain.atlassian.net`.
4. Naudokite **Išbandyti ryšį**, kad patvirtintumėte kredencialą.

**Jira Data Center / Server**

1. Pasirinkite **Jira Data Center / Server** kaip diegimą.
2. Įveskite Jira vartotojo vardą ir slaptažodį, naudojamus Basic auth.
3. Įveskite Jira svetainės URL, pavyzdžiui, `https://jira.example.com`.
4. Naudokite **Išbandyti ryšį**, kad patvirtintumėte kredencialą.

### Laukai

| Laukas | Aprašymas |
|--------|-----------|
| `email` | Jira Cloud Atlassian paskyros el. paštas arba Jira Data Center / Server vartotojo vardas |
| `api_token` | Jira Cloud Atlassian API raktas arba Jira Data Center / Server slaptažodis Basic auth |
| `base_url` | Jira svetainės pagrindinis URL |
| `deployment` | `cloud` Jira Cloud arba `data_center` Jira Data Center / Server |
| `api_version` | REST API versija; numatytoji `3` Jira Cloud. Data Center / Server naudoja v2 |

### Pastabos

- Jira mazgas siunčia problemų aprašymus ir komentarus kaip Atlassian dokumentų formato tekstinius dokumentus Jira Cloud REST API v3. Data Center / Server kredencialai siunčia paprastą tekstą.
- Data Center / Server šiuo metu palaiko tik vartotojo vardo/slaptažodžio Basic auth. Asmeniniai prieigos raktai ir Bearer auth dar nepalaikomi.
- Prikabintų failų įkėlimas priima base64 arba duomenų URL turinį ir yra ribojamas platformos failo dydžio limito (numatytas 99 MB). Prikabintų failų atsisiuntimas gali grąžinti base64 turinį, kai tai leidžiama.
- Vartotojų kūrimas, naikinimas ir problemų pranešimai reikalauja, kad autentifikuota Jira paskyra turėtų atitinkamas Jira svetainės ar organizacijos teises.
- Naudokite List Projects, Search Issues ir List Transitions, kad atrastumėte projekto raktus, problemų raktus ir perėjimo ID.
- Norint naudoti pasirinktinius endpoint'us, kurie nėra aprašyti Jira mazge, naudokite [HTTP mazgą](../nodes/http-node.md) su Jira Basic Auth (`email:api_token` Cloud arba `username:password` Data Center / Server) cURL komandoje, arba Header kredencialą su atitinkamu `Authorization: Basic <base64(user:secret)>` vertės.

Taip pat žr.:

- [Jira mazgas](../nodes/jira-node.md)
- [Kredencialai](./credentials.md)

---

## Sentry

Sentry kredencialas saugo autentifikavimo raktą [Sentry mazgui](../nodes/sentry-node.md). Heym naudoja Sentry REST API organizacijos, projekto, komandos, problemų, įvykių ir leidimų operacijoms.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `api_token` | Sentry autentifikavimo raktas, turintis prieigą prie organizacijų ir projektų, kuriuos automatizuojate |

### Pasirinktiniai laukai

| Laukas | Aprašymas |
|--------|-----------|
| `base_url` | Pasirinktinė šakninė URL savarankiškai talpinamam Sentry, pavyzdžiui, `https://sentry.example.com` |

### Pastabos

- Palikite `base_url` tuščią Sentry SaaS.
- Naudokite **Išbandyti ryšį**, kad patvirtintumėte, jog raktas gali išvardyti matomas organizacijas.
- Norint atlikti pasirinktinius REST skambučius, naudokite `$credentials.YourSentryCredential` kaip bearer token.

### Naudojama

- [Sentry mazgas](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) yra atvirojo kodo vektorinė duomenų bazė, naudojama semantiniam paieškai ir RAG (Retrieval Augmented Generation).

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `qdrant_host` | Pilnas URL į jūsų Qdrant instanciją (pvz., `http://localhost:6333` arba debesų endpoint) |
| `openai_api_key` | OpenAI API raktas, naudojamas generuoti embedding'us indeksuojant ir ieškant dokumentų |
### Pastabos

- Qdrant kolekcijos valdomos iš [Vektorių saugyklos](../tabs/vectorstores-tab.md) skilties. Kiekviena vektorių saugykla atitinka Qdrant kolekciją.
- [RAG mazgas](../nodes/rag-node.md) naudoja vektorių saugyklą (kuri nurodo Qdrant kredencialą) — jis tiesiogiai nenurodo kredencialo.
- Jei Jūsų Qdrant instancija reikalauja API rakto, įtraukite jį į `qdrant_host` reikšmę arba atitinkamai sukonfigūruokite Qdrant; dabartinė integracija neturi atskiro Qdrant API rakto lauko.
- Savarankiškai talpinamas Qdrant: naudokite [oficialų Docker vaizdą](https://hub.docker.com/r/qdrant/qdrant) ir atidarykite prievadą `6333`.

### Naudojama

- [RAG mazgas](../nodes/rag-node.md) (per vektorių saugyklą)
- [Vektorių saugyklos skiltis](../tabs/vectorstores-tab.md)

## Pasirinktinis įterpimas (RAG)

Pagal numatytuosius nustatymus RAG įterpimai gaunami iš OpenAI. **RAG: Pasirinktinis įterpimas** kredencialas nurodo bet kurį OpenAI suderinamą įterpimo endpoint'ą — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together arba talpinamą vartotojo sąsają — ir pavadina vektorių saugyklą, į kurią rašo.

### Reikalingi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `embedding_base_url` | Endpoint URL, įskaitant `/v1` kelią, pvz., `http://localhost:11434/v1` |
| `embedding_api_key` | Pasirinktinai. Vietiniai serveriai paprastai nereikalauja rakto |
| `embedding_model` | Modelio pavadinimas, kaip tikisi endpoint'as, pvz., `nomic-embed-text` |
| `embedding_dimensions` | Vektoriaus plotis, kurį modelis grąžina (numatytasis `1536`) |
| `embedding_request_dimensions` | Pasirinktinai. Paprašykite endpoint'o grąžinti `embedding_dimensions` vietoj modelio natūralaus pločio |
| `db_type` | `qdrant` arba `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant prisijungimas, reikalingas, kai `db_type` yra `qdrant` |

### Pastabos

- **Qdrant priima bet kokį dimensijų skaičių.** Kiekviena kolekcija kuriama pagal šio kredencialo nurodytą plotį, todėl Dimensijų laukas yra laisvai redaguojamas.
- **Postgres (pgvector) reikalauja tiksliai 1536 dimensijų.** Jo stulpelis yra fiksuotas `vector(1536)`, todėl Dimensijų laukas yra pririštas prie 1536, o kredencialas, nurodantis bet kokį kitą plotį, bus atmestas išsaugant.
- **Trumpinimas pgvector.** Kai saugykla yra Postgres, dialoge siūloma *Paprašykite endpoint'o grąžinti 1536 dimensijų*. Tai siunčia `dimensions` užklausos parametrą, kurį modeliai, apmokyti su Matryoshka atvaizdais (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` ir panašiai), gerbia grąžindami sutrumpintą, vis dar prasmingą vektorių. Endpoint'ai, kurie nepalaiko parametro, atmeta užklausą, o endpoint'ai, kurie priima, bet ignoruoja jį, pateikia aiškią klaidą, nurodančią tikrąjį grąžintą plotį. Heym niekada nesutrumpina vektorių, nes pjovimas iš ne-Matryoshka modelio tyliai pablogina paieškos kokybę. Ši parinktis nėra siūloma Qdrant, kuris gali pritaikyti kolekciją bet kokiam plotui.
- Naudokite **Test Connection** kredencialų dialoge, kad įterptumėte bandomąją eilutę ir pamatytumėte, kokį plotį modelis iš tikrųjų grąžina prieš kuriant saugyklą.
- `dimensions` užklausos parametras siunčiamas tik OpenAI, kadangi dauguma OpenAI suderinamų serverių atmeta nežinomus parametrus. Modelio natūralus plotis tikrinamas pagal kredencialą.
- Esamos **RAG: Qdrant + OpenAI** ir **RAG: Psql + OpenAI** kredencialai lieka nepakitę ir toliau veikia.

### Naudojama

- [RAG mazgas](../nodes/rag-node.md) (per vektorių saugyklą)
- [Vektorių saugyklos skiltis](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym taip pat gali saugoti vektorius **savo Postgres duomenų bazėje** naudodamas [pgvector](https://github.com/pgvector/pgvector) plėtinį — nereikia išorinio vektorių paslaugos. Sukurkite **RAG: Psql + OpenAI** kredencialą ir naudokite jį kuriant vektorių saugyklą, tada pasirinkite **Postgres (pgvector)** RAG mazgo Duomenų bazės išskleidžiamajame sąraše.

### Reikalingi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `openai_api_key` | OpenAI API raktas, naudojamas generuojant įterpimus indeksuojant ir ieškant dokumentų |

### Pastabos

- Nereikia jokio host/port — vektoriai rašomi į Heym'ą pačią duomenų bazę; Heym niekada nesijungia prie kitos duomenų bazės.
- Kiekviena RAG funkcija, prieinama su Qdrant (įterpimas, paieška, metaduomenų filtrai, Cohere pergrupavimas, klonavimas, dalinimasis), veikia identiškai su Postgres backend'u.
- Reikalingas `vector` plėtinys. Heym išlaiko oficialų `postgres:16` vaizdą nepakitusį (taigi esami duomenys niekada nėra liečiami) ir **automatiškai įdiegia `postgresql-16-pgvector` paketą paleidimo metu** — `run.sh`, `deploy.sh` ir `run_e2e.sh` visi tai tvarko. Įdiegimas nėra mirtinas: jei jis negali būti vykdomas (pvz., nėra tinklo), Qdrant RAG toliau veikia, o Postgres backend'as lieka neaktyvus (migracija praleidžia lentelę sklandžiai).
- Jei paleidžiate paskelbtą vieno konteinerio vaizdą (`ghcr.io/heymrun/heym`) prieš **savo išorinį Postgres**, ta duomenų bazė turi palaikyti `vector` plėtinį (Heym negali jo įdiegti į duomenų bazę, kurios nevaldo). Be jo, kuriant ar įkeliant į Postgres vektorių saugyklą grąžinama aiški žinutė, o Qdrant RAG toliau veikia.

### Naudojama

- [RAG mazgas](../nodes/rag-node.md) (per vektorių saugyklą)
- [Vektorių saugyklos skiltis](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) yra skaičiuoklės/duomenų bazės hibridas, palaikantis struktūrizuotus duomenis ir formules. Grist kredencialas leidžia Heym skaityti ir rašyti Grist dokumentus.
### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `api_key` | Grist API raktas (randamas **Profilis → API raktas** Jūsų Grist instancijoje) |
| `server_url` | Jūsų Grist serverio pagrindinis URL (pvz., `https://docs.getgrist.com` Grist Cloud, arba Jūsų savarankiškai talpinamas URL) |

### Pastabos

- [Grist mazgas](../nodes/grist-node.md) reikalauja **Dokumento ID** (iš Grist dokumento URL) ir **Lentelės ID** savo konfigūracijoje — tai nėra dalis kredencialo.
- Savarankiškai talpinamam Grist, nustatykite `server_url` į Jūsų instancijos domeną.
- Grist stulpelių ID naudoja pabraukimus (pvz., `User_Name`), o ne rodymo etiketes. Naudokite `listColumns` operaciją, kad juos atrastumėte.

### Naudojama

- [Grist mazgas](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets kredencialas jungia Heym su Google Sheets API naudodamas OAuth2 "Bring Your Own App" modelį. Jūs pateikiate Google Cloud OAuth2 Kliento ID ir Kliento Slaptažodį, tada leidžiate prieigą per naršyklės iššokantį langą. Tokenai automatiškai atnaujinami fone.

### Nustatymas

1. Atidarykite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → ieškokite ir įgalinkite **Google Sheets API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → programos tipas **Web application**.
3. Po **Authorized redirect URIs** pridėkite: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Nukopijuokite sugeneruotą **Kliento ID** ir **Kliento Slaptažodį**.
5. Heym Dashboard → **Credentials** → **New** → įveskite **Google Sheets (OAuth2)**.
6. Įveskite Kliento ID, Kliento Slaptažodį ir pavadinimą, tada spustelėkite **Connect**, kad atidarytumėte Google sutikimo iššokantį langą ir leistumėte prieigą.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `client_id` | OAuth2 Kliento ID iš Google Cloud Console |
| `client_secret` | OAuth2 Kliento Slaptažodis iš Google Cloud Console |

Tokenai (`access_token`, `refresh_token`, `token_expiry`) yra saugomi ir automatiškai atnaujinami — Jūs jų tiesiogiai nevaldote.

### Pastabos

- OAuth2 sutikimo ekranas reikalauja skaičiuoklių srities (`https://www.googleapis.com/auth/spreadsheets`).
- Heym naudoja atnaujinimo tokeną, kad gautų naujus prieigos tokenus prieš jiems pasibaigiant (60 sekundžių saugumo buferis).
- Jei pakeičiate Kliento Slaptažodį Google Cloud Console, vėl prijunkite kredencialą per **Connect** mygtuką.
- **Produkcija:** Nustatykite backend **`FRONTEND_URL`** į tikslų viešą URL, kurį vartotojai atidaro naršyklėje (schemos + host, pvz., `https://heym.example.com`). Heym sukuria Google OAuth nukreipimo URI tik iš šios vertės — jis **nepasitiki** `Origin` ar `X-Forwarded-*` antraštėmis (kliento valdomomis). Registruokite `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` Google Cloud Console.

### Naudojama

- [Google Sheets mazgas](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive kredencialas jungia Heym su Google Drive API naudodamas tą patį OAuth2 "Bring Your Own App" modelį kaip ir Google Sheets. Jūs pateikiate Google Cloud OAuth2 Kliento ID ir Kliento Slaptažodį, tada leidžiate prieigą per naršyklės iššokantį langą. Tokenai automatiškai atnaujinami fone.

### Nustatymas

1. Atidarykite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → ieškokite ir įgalinkite **Google Drive API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → programos tipas **Web application**.
3. Po **Authorized redirect URIs** pridėkite: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Nukopijuokite sugeneruotą **Kliento ID** ir **Kliento Slaptažodį**.
5. Heym Dashboard → **Credentials** → **New** → įveskite **Google Drive (OAuth2)**.
6. Įveskite Kliento ID, Kliento Slaptažodį ir pavadinimą, tada spustelėkite **Connect**, kad atidarytumėte Google sutikimo iššokantį langą ir leistumėte prieigą.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `client_id` | OAuth2 Kliento ID iš Google Cloud Console |
| `client_secret` | OAuth2 Kliento Slaptažodis iš Google Cloud Console |

Tokenai (`access_token`, `refresh_token`, `token_expiry`) yra saugomi ir automatiškai atnaujinami — Jūs jų tiesiogiai nevaldote.

### Sritis

Google Drive reikalauja **pilnos Drive srities** (`https://www.googleapis.com/auth/drive`).

Tai būtina, nes mazgas veikia su failais, kuriuos jau turite. Siauresnė `drive.file` sritis suteikia prieigą tik prie failų, kuriuos sukūrė pats OAuth klientas, todėl `listFolderFiles`, `updateFile`, `removeFile` ir `removeFolder` nematys nieko iš Jūsų esamo Drive.

Kadangi Jūs pateikiate savo Kliento ID ir Slaptažodį iš savo Google Cloud projekto, Google programos patvirtinimo reikalavimai šiai sričiai taikomi Jūsų projektui, o ne Heym.

### Pastabos

- Heym naudoja atnaujinimo tokeną, kad gautų naujus prieigos tokenus prieš jiems pasibaigiant (60 sekundžių saugumo buferis).
- Jei pakeičiate Kliento Slaptažodį Google Cloud Console, vėl prijunkite kredencialą per **Connect** mygtuką.
- Bendrinami diskai yra palaikomi — mazgas nustato `supportsAllDrives` kiekviename API kvietime.
- **Produkcija:** Nustatykite backend **`FRONTEND_URL`** į tikslų viešą URL, kurį vartotojai atidaro naršyklėje. Heym sukuria Google OAuth nukreipimo URI tik iš šios vertės — jis **nepasitiki** `Origin` ar `X-Forwarded-*` antraštėmis. Registruokite `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` Google Cloud Console.
- Žiūrėkite [Credential Sharing](./credentials-sharing.md) prieš dalindamiesi šiuo kredencialu su komanda.

### Naudojama

- [Google Drive mazgas](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery kredencialas sujungia Heym su Google BigQuery API naudojant OAuth2 "Bring Your Own App" modelį. Jūs pateikiate Google Cloud OAuth2 Kliento ID ir Kliento Slaptažodį, tada leidžiate prieigą per naršyklės iššokantį langą. Tokenai automatiškai atnaujinami fone.

### Nustatymas

1. Atidarykite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → ieškokite ir įgalinkite **BigQuery API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → programos tipas **Web application**.
3. Po **Authorized redirect URIs** pridėkite: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Nukopijuokite sugeneruotą **Kliento ID** ir **Kliento Slaptažodį**.
5. Heym Dashboard → **Credentials** → **New** → įveskite **BigQuery (OAuth2)**.
6. Įveskite Kliento ID, Kliento Slaptažodį ir pavadinimą, tada spustelėkite **Connect**, kad atidarytumėte Google sutikimo iššokantį langą ir leistumėte prieigą.

### Reikalingi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `client_id` | OAuth2 Kliento ID iš Google Cloud Console |
| `client_secret` | OAuth2 Kliento Slaptažodis iš Google Cloud Console |

Tokenai (`access_token`, `refresh_token`, `token_expiry`) saugomi ir automatiškai atnaujinami.

### Pastabos

- OAuth2 sutikimo ekranas reikalauja BigQuery srities (`https://www.googleapis.com/auth/bigquery`).
- **Produkcija:** Nustatykite backend **`FRONTEND_URL`** į viešą URL. Registruokite `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` Google Cloud Console.

### Naudojama

- [BigQuery mazgas](../nodes/bigquery-node.md)

---

## Supabase

Supabase kredencialas sujungia Heym su Supabase projekto PostgREST API, kad workflows galėtų užklausti ir keisti Postgres pagrindu veikiančias lenteles.

### Reikalingi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `supabase_url` | Projekto bazinis URL, pavyzdžiui, `https://your-project.supabase.co` |
| `supabase_key` | API raktas, turintis prieigą prie tikslinių lentelių |
| `supabase_schema` | Pasirinktinė numatytoji schema (numatyta `public`) |

### Pastabos

- [Supabase mazgas](../nodes/supabase-node.md) bendrauja su `/rest/v1/<table>` ir palaiko operatorių filtrus (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` ir susijusius PostgREST operatorius), taip pat įnertus `or` / `and` loginės grupes.
- Rašymo operacijoms rekomenduojama naudoti raktą, skirtą patikimam serverio naudojimui su minimaliomis reikiamomis lentelių teisėmis.
- Mazgai gali perrašyti schemą kiekviename žingsnyje, net jei kredencialas apibrėžia numatytąją schemą.

### Naudojama

- [Supabase mazgas](../nodes/supabase-node.md)

## ClickHouse

ClickHouse kredencialas sujungia Heym su išorine ClickHouse duomenų baze per jos HTTP sąsają, kad workflows galėtų vykdyti SQL, CRUD ir skaičiavimo operacijas prieš OLAP lenteles.

### Reikalingi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `host` | HTTP host be schemos, pavyzdžiui, `your-instance.clickhouse.cloud` |
| `port` | HTTP sąsajos prievadas (`8443` HTTPS, `8123` HTTP) |
| `username` | ClickHouse vartotojas (numatyta `default`) |
| `password` | Vartotojo slaptažodis (pasirinktinai) |
| `database` | Tikslinė duomenų bazė (numatyta `default`) |
| `secure` | Naudoti HTTPS, kai `true` (reikalinga ClickHouse Cloud) |

### Pastabos

- [ClickHouse mazgas](../nodes/clickhouse-node.md) naudoja oficialų `clickhouse-connect` HTTP klientą ir parametrizuoja filtrus bei reikšmių ryšius.
- `update` ir `remove` atitinka `ALTER TABLE ... UPDATE` ir `DELETE FROM`, kurie yra asinchroninės ClickHouse mutacijos; abu reikalauja filtro.
- `upsert` atlieka `INSERT` ir numato `ReplacingMergeTree` lentelę, kad būtų galima sujungti pagal raktą.
- Naudokite **Test connection** kredencialų dialoge, kad patvirtintumėte pasiekiamumą.

### Naudojama

- [ClickHouse mazgas](../nodes/clickhouse-node.md)

## Notion

Notion kredencialas palaiko arba vidinį integracijos tokeną, arba viešą integracijos OAuth ryšį. OAuth leidžia kiekvienam vartotojui leisti Notion darbo erdvę iš Heym, o ne rankiniu būdu kopijuoti tokeną.

### Reikalingi laukai

| Režimas | Laukas | Aprašymas |
|---------|--------|-----------|
| Vidinis tokenas | `api_token` | Vidinis integracijos tokenas (`ntn_...`) |
| OAuth | `client_id` | Kliento ID iš Notion viešos integracijos |
| OAuth | `client_secret` | Kliento Slaptažodis iš Notion viešos integracijos |

OAuth atgalinis ryšys automatiškai saugo `access_token`, `auth_mode`, `workspace_id`, `workspace_name` ir `bot_id`. Bet koks ankstesnis vidinis `api_token` pašalinamas, kai OAuth baigiasi. Registruokite šį nukreipimo URI Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth nustatymo srautas

1. Pasirinkite **OAuth** kredencialų dialoge, įveskite pavadinimą, Kliento ID ir Kliento Slaptažodį.
2. Spustelėkite **Connect** ir leiskite darbo erdvę Notion iššokančiame lange.
   - Naujam kredencialui Heym sukuria kredencialų įrašą, kai spustelite **Connect**.
   - Užbaikite autorizaciją iššokančiame lange, tada spustelėkite **Save**, kad grįžtumėte į kredencialų sąrašą.
3. Sujungtas kredencialas rodo `connected (Workspace Name)` sąraše. Laukiantys OAuth kredencialai rodo `Not connected`, kol autorizacija nesibaigia.

Naudokite **Test Connection** kredencialų dialoge, kad patvirtintumėte arba vidinį tokeną, arba užbaigtą OAuth autorizaciją. Redaguojant, palikus tokeno lauką tuščią, išsaugomas saugomas vidinis tokenas.

T tanto vidiniai tokenai, tiek OAuth prieigos tokenai yra prieinami per `$credentials.CredentialName` individualiems [HTTP](../nodes/http-node.md) skambučiams, kuriems reikia Notion bearer tokeno.
### Pastabos

- Vidinės integracijos reikalauja, kad atitinkamos puslapiai, duomenų bazės ir duomenų šaltiniai būtų bendrinami.
- OAuth vartotojai pasirenka darbo erdvę/puslapius Notion autorizacijos metu.
- OAuth programos kredencialai yra užšifruoti Notion kredenciale. Atsakymas atnaujina juos serverio pusėje; slaptažodis nėra įterptas į OAuth būseną.
- Prijungti OAuth kredencialai rodo darbo erdvės pavadinimą; laukiančių OAuth kredencialų būsena rodo `Not connected` iki autorizacijos užbaigimo.
- **Gamyba:** Nustatykite backend **`FRONTEND_URL`** į viešą naršyklės URL (schemos + host, be pabaigos brūkšnio). Notion nukreipimo URI turi tiksliai atitikti:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Mazgas naudoja API versiją `2026-03-11` ir dabartinę `data_source` terminologiją. Dėl migracijos iš senesnių `archived`, `after` ar duomenų užklausų pavyzdžių žr. [Notion node](../nodes/notion-node.md#api-version-notes) straipsnį.
- Seni paieškos filtrai su objekto reikšme `database` yra normalizuoti į `data_source`.

### Naudojama

- [Notion node](../nodes/notion-node.md)

---

## SMTP (El. paštas)

SMTP kredencialas saugo el. pašto serverio prisijungimo duomenis, skirtus išsiųsti išeinančiam paštui.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `host` | SMTP serverio pavadinimas (pvz., `smtp.gmail.com`) |
| `port` | SMTP prievadas (paprastai `587` STARTTLS, `465` SSL) |
| `email` | Naudotojo vardas, kuriuo prisijungia SMTP serveris; taip pat matomas siuntėjas, kai `from` yra tuščias |
| `password` | SMTP slaptažodis arba programos slaptažodis |

### Pasirinktiniai laukai

| Laukas | Aprašymas |
|--------|-----------|
| `from` (`smtp_from`) | Matomas siuntėjo (From) adresas. Palikite tuščią, kad būtų siunčiama kaip `email`. Serveris vis tiek prisijungia kaip `email`, todėl šiai paskyrai turi būti leista siųsti iš šio adreso („Gmail“ – patvirtintas **Siųsti laiškus kaip** pseudonimas). |

### Dažniausiai naudojami SMTP tiekėjai

| Tiekėjas | Host | Port | Pastabos |
|----------|------|------|----------|
| Gmail | `smtp.gmail.com` | `587` | Reikalauja [programos slaptažodžio](https://support.google.com/accounts/answer/185833) (2FA turi būti įjungtas) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Naudokite savo Microsoft paskyros kredencialus |
| Mailgun | `smtp.mailgun.org` | `587` | Naudokite Mailgun SMTP kredencialus iš savo domeno nustatymų |
| SendGrid | `smtp.sendgrid.net` | `587` | Naudokite `apikey` kaip vartotojo vardą ir API raktą kaip slaptažodį |
| Pasirinktinis / Savarankiškai talpinamas | jūsų domenas | `587` / `465` | Postfix, Exim ir kt. |

### Pastabos

- Gmail reikalauja **programos slaptažodžio** vietoj įprasto slaptažodžio, kai įjungta 2 žingsnių patikra.
- Prievadas `587` naudoja STARTTLS (pradedamas kaip paprastas tekstas, atnaujinamas į TLS). Prievadas `465` naudoja implicit TLS (SSL nuo pat pradžių).

### Naudojama

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Įeinantis el. paštas)

IMAP kredencialas saugo prisijungimo duomenis, skirtus stebėti pašto dėžutę su [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `imap_host` | IMAP serverio pavadinimas (pvz., `imap.gmail.com`) |
| `imap_port` | IMAP prievadas (`993` SSL/TLS daugumoje tiekėjų) |
| `imap_username` | Pašto dėžutės vartotojo vardas arba visas el. pašto adresas |
| `imap_password` | Slaptažodis arba tiekėjo specifinis programos slaptažodis |

### Pasirinktiniai laukai

| Laukas | Aprašymas |
|--------|-----------|
| `imap_mailbox` | Pašto dėžutės aplankas, kurį reikia stebėti (numatytas: `INBOX`) |
| `imap_use_ssl` | Įjungti SSL/TLS (rekomenduojama; numatyta: `true`) |

### Pastabos

- IMAP trigger pirmo užklausimo metu nustato dabartinę pašto dėžutę ir tada apdoroja tik naujesnį el. paštą.
- Gmail, Microsoft 365 ir kiti talpinami tiekėjai dažnai reikalauja **programos slaptažodžio** arba panašaus IMAP specifinio slaptažodžio.
- Prisegto turinio neatsisiunčiama į workflow payload; Heym teikia tik prisegto turinio metaduomenis.

### Naudojama

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP kaip workflow trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) yra atvirojo kodo žinučių tarpininkas. RabbitMQ kredencialas saugo prisijungimo duomenis, skirtus publikavimui ir vartojimui iš eilių ir mainų.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `rabbitmq_host` | AMQP prisijungimo URL (pvz., `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ vartotojo vardas (numatytas: `guest`) |
| `rabbitmq_password` | RabbitMQ slaptažodis (numatytas: `guest`) |

### Virtualūs hostai

Norint prisijungti prie konkretaus virtualaus hosto, įtraukite jį į `rabbitmq_host` URL:

```
amqp://username:password@hostname:5672/vhost
```

Naudojant numatytąjį vhost, kelią `/` galima praleisti.

### Atidėto pranešimo papildinys

[RabbitMQ node](../nodes/rabbitmq-node.md) palaiko **rabbitmq_delayed_message_exchange** papildinį. Kai šis papildinys yra įjungtas jūsų RabbitMQ serveryje, galite nustatyti atidėjimą (milisekundėmis) išeinantiems pranešimams naudodami `rabbitmqDelayMs` lauką mazge.

Mazgas nustato `x-delay` antraštę paskelbtame pranešime. Mainų tipas turi būti `x-delayed-message`, kad atidėjimai įsigaliotų.

Norėdami įjungti papildinį savarankiškai talpinamame RabbitMQ instance:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Kai papildinys nėra įdiegtas, `x-delay` antraštė ignoruojama ir pranešimai pristatomi iš karto.

### Naudojama

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ kaip workflow trigger)

---

## Amazon S3

Amazon S3 kredencialas jungia Heym su [Amazon S3](https://aws.amazon.com/s3/). Naudokite jį su [Amazon S3 node](../nodes/amazon-s3-node.md), kad valdytumėte kibirus ir aplankus, įkeltumėte ir atsisiųstumėte objektus, kopijuotumėte raktus ir sąrašą arba ištrintumėte objektus iš workflow.
### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `aws_access_key_id` | AWS IAM prieigos rakto ID |
| `aws_secret_access_key` | Slaptas prieigos rakto ID poros rakto |
| `aws_region` | AWS regionas, kuriame yra kibirai (pvz., `us-east-1`) |

### Pasirinktiniai laukai

| Laukas | Aprašymas |
|--------|-----------|
| `aws_session_token` | Laikinas sesijos raktas naudojant AWS STS kredencialus |

### Pastabos

- Kredencialai naudoja standartinę AWS SigV4 autentifikaciją per boto3.
- Įkėlimo operacijos šiuo metu siunčia UTF-8 teksto turinį; atsisiuntimai gali grąžinti tekstą arba base64 binariniams objektams.

### Naudojama

- [Amazon S3 mazgas](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) yra atmintyje veikianti raktų-vertybių saugykla, naudojama talpinimui ir greitam duomenų prieigai.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `host` | Redis serverio pavadinimas arba IP (pvz., `localhost`) |
| `port` | Redis prievadas (numatytasis: `6379`) |
| `password` | Redis slaptažodis (palikite tuščią, jei nenustatytas) |

### Naudojama

- [Redis mazgas](../nodes/redis-node.md)

---

## Slack

Slack kredencialai saugo **Incoming Webhook URL**, skirtą žinučių siuntimui į Slack kanalus.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `webhook_url` | Slack Incoming Webhook URL (iš Jūsų Slack programos konfigūracijos) |

### Pastabos

- Sukurkite Incoming Webhook adresu [api.slack.com/apps](https://api.slack.com/apps) → Jūsų programa → **Incoming Webhooks**.
- Kiekvienas webhook yra priskirtas konkrečiam kanalui. Sukurkite kelias kredencialus skirtingiems kanalams.

### Naudojama

- [Slack mazgas](../nodes/slack-node.md)

---

## Telegram

Telegram kredencialai saugo **Bot Token** ir pasirinktinius **Webhook Secret Token** botų pagrindu veikiančioms darbo eigoms.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `bot_token` | Telegram Bot API raktas iš BotFather |

### Pasirinktiniai laukai

| Laukas | Aprašymas |
|--------|-----------|
| `secret_token` | Bendras slaptas raktas, patvirtintas pagal `x-telegram-bot-api-secret-token` atvykstantiems webhook'ams |

### Pastabos

- Naudokite tuos pačius kredencialus tiek [Telegram Trigger](../nodes/telegram-trigger-node.md), tiek [Telegram](../nodes/telegram-node.md).
- Registruokite webhook rankiniu būdu su Telegram `setWebhook` API, naudodami URL, rodomą Telegram Trigger mazgo skydelyje.
- `chatId` Telegram mazge gali būti literalus ID arba išraiška, tokia kaip `$telegramEvent.message.chat.id`.

### Naudojama

- [Telegram Trigger mazgas](../nodes/telegram-trigger-node.md)
- [Telegram mazgas](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Šios kredencialai naudojami [HTTP mazge](../nodes/http-node.md) autentifikuojant išėjimo užklausas.

### Bearer

Prideda `Authorization: Bearer <token>` antraštę prie HTTP užklausų.

| Laukas | Aprašymas |
|--------|-----------|
| `token` | Bearer token vertė |

### Header

Prideda pasirinktą antraštę prie HTTP užklausų.

| Laukas | Aprašymas |
|--------|-----------|
| `header_key` | Antraštės pavadinimas (pvz., `X-Api-Key`) |
| `header_value` | Antraštės vertė |

Abu tipai taip pat gali būti nurodyti per `$credentials.CredentialName` [Expression DSL](./expression-dsl.md) dinamiškam naudojimui bet kuriame mazge, kuris priima išraiškas.

### Naudojama

- [HTTP mazgas](../nodes/http-node.md)

---

## LLM teikėjai (OpenAI, Google, Custom, Cohere)

Šios kredencialai suteikia energijos AI mazgams.

| Tipas | Aprašymas |
|-------|-----------|
| **OpenAI** | API raktas GPT modeliams ir OpenAI įterpimams |
| **Google** | API raktas Gemini modeliams |
| **Custom** | API raktas + bazinis URL OpenAI suderinamiems galiniams taškams (Ollama, vLLM, LM Studio ir kt.) |
| **Cohere** | API raktas Cohere įterpimams |

### OpenAI Prompt Caching

OpenAI automatiškai talpina statinį (nepakitusį) Jūsų sistemos užklausos prefiksą — papildoma konfigūracija nereikalinga. Pakartotiniai darbo eigų vykdymai, kurie dalijasi tuo pačiu sistemos užklausos prefiksu, gauna naudos iš talpinimo tokenų kainodaros, kuri sumažina tiek išlaidas, tiek vėlavimą. Tai ypač naudinga, kai turite ilgus, fiksuotus nurodymus, o tik vartotojo žinutė keičiasi tarp vykdymų. Stebėkite talpinimo hitų rodiklius ir tokenų taupymą [Vykdymų skirtuke](../tabs/traces-tab.md) arba OpenAI naudojimo skydelyje, kad optimizuotumėte savo užklausos struktūrą maksimaliam talpinimo pakartotiniam naudojimui.

### Naudojama

- [LLM mazgas](../nodes/llm-node.md)
- [Agent mazgas](../nodes/agent-node.md)
- [RAG mazgas](../nodes/rag-node.md) (OpenAI įterpimai per Qdrant kredencialą)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) yra proxy serveris, skirtas apeiti Cloudflare ir panašius botų apsaugos iššūkius.

### Privalomi laukai

| Laukas | Aprašymas |
|--------|-----------|
| `flaresolverr_url` | Jūsų FlareSolverr instancijos URL (pvz., `http://localhost:8191`) |

Loopback ir privatūs adresai čia yra palaikomi, todėl FlareSolverr veikimas šalia Heym veikia kaip dokumentuota. URL gali nesusieti su link-local arba cloud-metadata adresu. Kadangi privatūs adresai yra leidžiami, šis laukas taip pat gali būti nukreiptas į kitą vidinę paslaugą, o atsakymas grįžta mazgo išvestyje. Bet kuris prisijungęs vartotojas gali sukurti šią kredencialą, todėl riba yra tai, kas gali autorizuoti darbo eigas, taip pat Jūsų tinklo taisyklės, o ne kredencialų dalijimasis. Žr. [Išėjimo saugumas](../nodes/crawler-node.md#egress-safety).

### Naudojama

- [Crawler mazgas](../nodes/crawler-node.md)

---
## Susiję

- [Kredencialai](./credentials.md) – Kredencialų apžvalga ir kaip mazgai juos naudoja
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Kredencialų pridėjimas ir valdymas
- [Kredencialų dalijimasis](./credentials-sharing.md) – Kredencialų dalijimasis su vartotojais ir komandomis
- [Saugumas](./security.md) – Šifravimas neveikiant, prieigos kontrolė
- [Išraiškų DSL](./expression-dsl.md) – `$credentials` sintaksė dinamiškam prieigai

---

## Modelių maršrutizatorius (Auto Model)

Maršrutizuoja kiekvieną užklausą į vieną iš Jūsų esamų modelių kredencialų, naudodamas sprendimų modelį pasirinkimui. Jis saugo nuorodas, niekada savo rakto.

### Privalomi laukai

- `decision_credential_id` – **Sprendimų modelio** kredencialas, prie kurio galite prisijungti.
- `decision_model` – modelis, kuris atlieka maršrutizavimo užklausą, pavyzdžiui, `jev-latest`.
- `options` – bent du įrašai, kiekvienas su pavadinimu, vienas iš Jūsų OpenAI/Google/Custom kredencialų, modelis ant jo ir kriterijai, nurodantys, kada jis turėtų laimėti.

### Pasirinktiniai laukai

- `routing_instructions` – kaip bendrai įvertinti pasirinkimus.
- Vienas pasirinkimas gali būti pažymėtas kaip atsarginis, naudojamas, kai maršrutizavimas nepavyksta.

### Pastabos

Pasirinkimų pavadinimai yra tai, ką sprendimų modelis pasirenka, todėl jie turi būti skirtingi. Pasirinkimas negali rodyti į kitą modelių maršrutizatorių.
