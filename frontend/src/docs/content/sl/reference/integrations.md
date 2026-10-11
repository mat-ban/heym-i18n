# Integracije Tretjih Oseb

Heym se povezuje z zunanjimi storitvami preko **poverilnic**. Vsaka vrsta poverilnice shranjuje podrobnosti o povezavi za eno storitev in se lahko ponovno uporabi v več vozliščih in workflows. Oglejte si [Poverilnice](./credentials.md) za pregled.

Dodajte poverilnice v [Nastavitve → Poverilnice](../tabs/credentials-tab.md). Vse vrednosti so šifrirane v mirovanju. Poverilnice je mogoče [deliti](./credentials-sharing.md) z drugimi uporabniki ali [Timom](./teams.md).

Nekatera vozlišča integracij **ne** zahtevajo poverilnic. [WebSocket Trigger](../nodes/websocket-trigger-node.md) in [WebSocket Send](../nodes/websocket-send-node.md) se povezujejo z zunanjimi vtičnicami z uporabo URL-ja, glav in podprotokolov, ki so konfigurirani neposredno na vozlišču.

## Vrste Poverilnic na En Pogledu

| Vrsta | Uporablja | Ključna Polja |
|-------|-----------|----------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opcijsko `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opcijsko `base_url` |
| **Jira** | [Jira vozlišče](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, opcijsko `api_version` |
| **Linear** | [Linear vozlišče](../nodes/linear-node.md) | `api_key`, ali `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry vozlišče](../nodes/sentry-node.md) | `api_token`, opcijsko `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Vrednotenja](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, opcijsko `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | poverilnica modela odločanja, plus možnosti modela, ki se sklicujejo na vaše druge poverilnice |
| **Cohere** | Vektorske shrambe | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorske shrambe | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorske shrambe | `openai_api_key` (vektorji shranjeni v Heym-ovem lastnem Postgres preko pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorske shrambe | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opcijsko `embedding_api_key`, plus `qdrant_host`, ko je `db_type` `qdrant` |
| **Grist** | [Grist vozlišče](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets vozlišče](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + soglasje OAuth2 |
| **Google Drive** | [Google Drive vozlišče](../nodes/google-drive-node.md) | `client_id`, `client_secret` + soglasje OAuth2 (polno obseg Drive) |
| **BigQuery** | [BigQuery vozlišče](../nodes/bigquery-node.md) | `client_id`, `client_secret` + soglasje OAuth2 |
| **Supabase** | [Supabase vozlišče](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opcijsko `supabase_schema` |
| **ClickHouse** | [ClickHouse vozlišče](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion vozlišče](../nodes/notion-node.md) | `api_token`, ali `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 vozlišče](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Pošlji e-pošto](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger vozlišče](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger vozlišče](../nodes/telegram-trigger-node.md), [Telegram vozlišče](../nodes/telegram-node.md) | `bot_token`, opcijsko `secret_token` |
| **Discord** | [Discord vozlišče](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger vozlišče](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ vozlišče](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis vozlišče](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack vozlišče](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger vozlišče](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP vozlišče](../nodes/http-node.md) | `token` |
| **Header** | [HTTP vozlišče](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler vozlišče](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Poverilnica GitHub shranjuje osebni dostopni žeton (PAT) GitHub, tako da lahko workflows kličejo GitHub REST API preko [GitHub vozlišča](../nodes/github-node.md), prenesejo žeton v MCP strežnike, kot je `@modelcontextprotocol/server-github`, ali ga uporabijo iz [HTTP vozlišča](../nodes/http-node.md) za prilagojene REST klice.

### Obvezna Polja

| Polje | Opis |
|-------|-------|
| `api_key` | Osebni dostopni žeton GitHub (`github_pat_...` natančno PAT ali klasični `ghp_...` PAT) |
### Neobvezna Polja

| Polje | Opis |
|-------|-------------|
| `base_url` | Osnovni URL GitHub API za GitHub Enterprise Server (na primer `https://github.example.com/api/v3`) |

### Opombe

- Priporočamo uporabo natančnih osebnih dostopnih žetonov (PAT), kadar je to mogoče, saj jih lahko omejite na specifične repozitorije in dovoljenja.
- Pustite `base_url` prazno za GitHub.com. Za GitHub Enterprise Server uporabite celoten REST API
  endpoint, vključno z `/api/v3` (na primer `https://github.example.com/api/v3`), ne pa korenskega URL-ja spletnega vmesnika strežnika, kot je `https://github.example.com`.
- Ta poverilnica trenutno podpira le avtentikacijo na osnovi PAT. Za dostop do repozitorijev organizacije uporabite PAT, ki ima dodeljena potrebna dovoljenja za organizacijo/repozitorij.
- Žetoni za namestitev GitHub aplikacij in postopki nastavitve GitHub aplikacij trenutno niso v prvem razredu v uporabniškem vmesniku Heym.
- Prednost dajte [GitHub vozlišču](../nodes/github-node.md) za operacije z repozitoriji, uporabniki, težavami, zahtevki za združitev, pregledi, izdaje, delovne tokove Actions, prometom in datotekami. Uporabite [HTTP vozlišče](../nodes/http-node.md) le, kadar potrebujete endpoint ali payload, ki ga GitHub vozlišče ne pokriva.
- Uporabite [Agent vozlišče](../nodes/agent-node.md) z MCP tako, da v okoljsko spremenljivko povezave MCP posredujete `$credentials.YourGitHubCredential`, kot je `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHubov REST API običajno pričakuje `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Ko urejate GitHub poverilnico, pustite `base_url` za GitHub Enterprise prazno, da ohranite obstoječi endpoint. Vnesite nov URL le, kadar želite spremeniti ta endpoint.

### Uporablja

- [GitHub vozlišče](../nodes/github-node.md)
- [Codex vozlišče](../nodes/codex-node.md)
- [Agent vozlišče](../nodes/agent-node.md)
- [HTTP vozlišče](../nodes/http-node.md)

---

## Model Odločanja

Model odločanja odgovarja na tipizirana vprašanja o stanju in vrača verjetnosti namesto besedila. TypeSafe-ov Jev je referenčna implementacija; vsak endpoint, ki sprejema enako `{model, state, questions}` telo, deluje, in [Decision](../nodes/decision-node.md) vozlišče lahko pošlje ročno napisano telo za tistega, ki tega ne podpira.

### Obvezna Polja

- `base_url` – endpoint, na primer `https://api.typesafe.ai`. Heym doda `/v1/systemone`.

### Neobvezna Polja

- `api_key` – poslan kot `Authorization: Bearer`. Endpointi, ki ne potrebujejo ključa, lahko to pustijo prazno.

### Opombe

- **Preizkus povezave** pošlje eno majhno vprašanje za potrditev delovanja endpointa in ključa.
- Urejanje poverilnice ohrani shranjeni ključ, ko je polje za ključ pusteno prazno.
- Odhodni zahtevki na zasebne in povratne naslove so privzeto blokirani, zato potrebuje samostojni endpoint na `localhost` ali v zasebnem razponu `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Ti modeli niso prisotni v tabelah cen LLM, ki jih sinhronizira Heym, zato ostane stolpec Stroški v [Izvršitvah](../tabs/traces-tab.md) prazen. Število žetonov se še vedno beleži.

### Uporablja

- [Decision](../nodes/decision-node.md)
- [Vrednotenja](../tabs/evals-tab.md) – ocenjuje odgovore `LLM-as-Judge` v primerjavi s pričakovanim izhodom

## OpenAI Codex

Poverilnica OpenAI Codex avtenticira [Codex vozlišče](../nodes/codex-node.md). Je ločena od poverilnice API ključa OpenAI, ki jo uporabljajo LLM, Agent in RAG vozlišča.

### Načini Avtentikacije

| Način | Opis |
|------|-------------|
| **Prijava z ChatGPT** (priporočeno) | OAuth (PKCE) prijava, ki uporablja vašo naročnino ChatGPT Plus/Pro, tako da se izognete stroškom API na osnovi žetona. Heym shranjuje in samodejno osvežuje paket žetonov. |
| **Dostopni žeton** | `access_token` ChatGPT/Codex, poslan le lokalnemu procesu Codex CLI. |

### Opombe

- API ključi so zavrnjeni za to vrsto poverilnice.
- Žetoni Codex niso izpostavljeni preko `$credentials.Name`.
- Codex vozlišče prav tako potrebuje GitHub poverilnico za kloniranje repozitorija, potiskanje vej in ustvarjanje osnutkov PR.

### Uporablja

- [Codex vozlišče](../nodes/codex-node.md)

## OpenCode Go

Poverilnica OpenCode Go avtenticira [OpenCode Go vozlišče](../nodes/opencode-go-node.md). Shranjuje API ključ OpenCode Go gateway (iz [opencode.ai/go](https://opencode.ai/go)) in neobvezni osnovni URL gateway.

### Polja

| Polje | Opis |
|-------|-------------|
| **API Ključ** | API ključ OpenCode Go gateway (obvezno). |
| **Osnovni URL Gateway** | Neobvezno; privzeto na `https://opencode.ai/zen/go/v1`. Prekličite le za samostojni ali posredovani gateway. |

### Opombe

- API ključ se pošlje le procesu OpenCode CLI znotraj utrjenega kontejnerja.
- OpenCode Go vozlišče prav tako potrebuje GitHub poverilnico za kloniranje repozitorija, potiskanje vej in ustvarjanje zahtevkov za združitev. GitHub žeton nikoli ni postavljen znotraj kontejnerja peskovnika.

### Uporablja

- [OpenCode Go vozlišče](../nodes/opencode-go-node.md)

---

## Linear

Poverilnica Linear podpira bodisi osebni API ključ bodisi OAuth2 za [Linear vozlišče](../nodes/linear-node.md). Heym pošilja nativne GraphQL poizvedbe Linear za metapodatke delovnega prostora, projekte, težave in komentarje.
### Nastavitev

Izberite en način avtentikacije:

**Osebni API ključ**

1. V Linearju odprite **Nastavitve → Varnost in dostop → Osebni API ključi**.
2. Ustvarite ključ z dostopom do delovnega prostora, ki ga želite avtomatizirati.
3. Prilepite ključ v Linear poverilnico v Heym in uporabite **Preizkusi povezavo**, da ga preverite.

**OAuth2**

1. Ustvarite Linear OAuth aplikacijo.
2. Registrirajte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kot preusmeritveno URI.
3. V Heym nadzorni plošči → **Poverilnice** → **Novo** → vpišite **Linear**.
4. Izberite **OAuth2**, vnesite Client ID in Client Secret, nato kliknite **Poveži**.

### Obvezna polja

| Način | Polje | Opis |
|-------|-------|-------------|
| Osebni API ključ | `api_key` | Osebni API ključ Linear, običajno predhodno označen z `lin_api_` |
| OAuth2 | `client_id` | Client ID iz Linear OAuth aplikacije |
| OAuth2 | `client_secret` | Client Secret iz Linear OAuth aplikacije |

OAuth žetoni (`access_token`, `refresh_token`, `token_expiry`) se shranijo in osvežijo samodejno.

### Opombe

- Osebni API ključi in OAuth žetoni delujejo kot Linear uporabnik, ki jih je ustvaril ali avtoriziral.
- Linear OAuth uporablja obsege `read,write,issues:create,comments:create`.
- Uporabite **Preizkusi povezavo** v pogovoru o poverilnicah, da preverite API ključ ali OAuth žeton proti Linear API.
- Uporabite Seznam ekip in Seznam projektov v Linear vozlišču, da odkrijete UUID-je, preden ustvarite ali filtrirate težave.
- Uporabite Seznam stanj delovnega toka in Seznam članov ekipe, da odkrijete UUID-je stanja in dodeljenega za posodobitve.
- Zamenjajte API ključ tako, da uredite poverilnico in vnesete nadomestno vrednost. Če zamenjate skrivnosti OAuth aplikacije, ponovno povežite poverilnico preko **Poveži**.

### Uporablja

- [Linear vozlišče](../nodes/linear-node.md)

---

## Jira

Poverilnica Jira shranjuje poverilnice za osnovno avtentikacijo Jira, osnovni URL spletnega mesta Jira, način nameščanja in neobvezno različico REST API za [Jira vozlišče](../nodes/jira-node.md). Uporabite `cloud` za Jira Cloud ali `data_center` za Jira Data Center / Server.

### Nastavitev

**Jira Cloud**

1. V nastavitvah računa Atlassian ustvarite API žeton.
2. V Heym nadzorni plošči → **Poverilnice** → **Novo** → vpišite **Jira**.
3. Vnesite Atlassian e-pošto, API žeton in URL spletnega mesta Jira, kot je `https://your-domain.atlassian.net`.
4. Uporabite **Preizkusi povezavo**, da preverite poverilnico.

**Jira Data Center / Server**

1. Izberite **Jira Data Center / Server** kot način nameščanja.
2. Vnesite uporabniško ime Jira in geslo, uporabljeno za osnovno avtentikacijo.
3. Vnesite URL spletnega mesta Jira, na primer `https://jira.example.com`.
4. Uporabite **Preizkusi povezavo**, da preverite poverilnico.

### Polja

| Polje | Opis |
| --- | --- |
| `email` | E-pošta Atlassian računa Jira Cloud ali uporabniško ime Jira Data Center / Server |
| `api_token` | API žeton Atlassian za Jira Cloud ali geslo za osnovno avtentikacijo za Jira Data Center / Server |
| `base_url` | Osnovni URL spletnega mesta Jira |
| `deployment` | `cloud` za Jira Cloud ali `data_center` za Jira Data Center / Server |
| `api_version` | Različica REST API; privzeto `3` za Jira Cloud. Data Center / Server uporablja v2 |

### Opombe

- Jira vozlišče pošilja opise težav in komentarje kot dokumente v formatu Atlassian Document Format za Jira Cloud REST API v3. Poverilnice Data Center / Server pošiljajo navadno besedilo.
- Data Center / Server trenutno podpira samo osnovno avtentikacijo z uporabniškim imenom/geslom. Osebni dostopni žetoni in Bearer avtentikacija še niso podprti.
- Naložitev priponk sprejema vsebino v formatu base64 ali URL vsebine in je predmet omejitve velikosti datoteke platforme (privzeto 99 MB). Prenos priponk lahko vrne vsebino v formatu base64, ko je omogočeno.
- Ustvarjanje, brisanje uporabnikov in obvestila o težavah zahtevajo, da ima potrjen račun Jira ustrezna dovoljenja za spletno mesto ali organizacijo Jira.
- Uporabite Seznam projektov, Iskanje težav in Seznam prehodov, da odkrijete ključe projektov, ključe težav in ID-je prehodov.
- Za prilagojene končne točke, ki jih ne pokriva Jira vozlišče, uporabite [HTTP vozlišče](../nodes/http-node.md) z osnovno avtentikacijo Jira (`email:api_token` za Cloud ali `username:password` za Data Center / Server) v cURL ukazu, ali pa poverilnico z glavo z ustrezno vrednostjo `Authorization: Basic <base64(user:secret)>`.

Oglejte si tudi:

- [Jira vozlišče](../nodes/jira-node.md)
- [Poverilnice](./credentials.md)

---

## Sentry

Poverilnica Sentry shranjuje avtentikacijski žeton za [Sentry vozlišče](../nodes/sentry-node.md). Heym uporablja Sentry REST API za operacije organizacije, projekta, ekipe, težave, dogodka in izdaje.

### Obvezna polja

| Polje | Opis |
|-------|-------------|
| `api_token` | Avtentikacijski žeton Sentry z dostopom do organizacij in projektov, ki jih avtomatizirate |

### Neobvezna polja

| Polje | Opis |
|-------|-------------|
| `base_url` | Neobvezni osnovni URL za samostojni Sentry, na primer `https://sentry.example.com` |

### Opombe

- Pustite `base_url` prazno za Sentry SaaS.
- Uporabite **Preizkusi povezavo**, da potrdite, da žeton lahko našteje vidne organizacije.
- Za prilagojene REST klice uporabite `$credentials.YourSentryCredential` kot žeton nosilca.

### Uporablja

- [Sentry vozlišče](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) je odprtokodna vektorska baza podatkov, uporabljena za semantično iskanje in RAG (Retrieval Augmented Generation).

### Obvezna polja

| Polje | Opis |
|-------|-------------|
| `qdrant_host` | Poln URL do vaše instance Qdrant (npr. `http://localhost:6333` ali oblačna končna točka) |
| `openai_api_key` | OpenAI API ključ, uporabljen za generiranje vektorskih predstavitev pri indeksiranju in iskanju dokumentov |
### Opombe

- Qdrant zbirke se upravljajo iz zavihka [Vektorske shrambe](../tabs/vectorstores-tab.md). Vsaka vektorska shramba se preslika na Qdrant zbirko.
- [RAG vozlišče](../nodes/rag-node.md) uporablja vektorsko shrambo (ki se sklicuje na Qdrant poverilnico) — ne sklicuje se neposredno na poverilnico.
- Če vaša Qdrant instanca zahteva API ključ, ga vključite v vrednost `qdrant_host` ali ustrezno konfigurirajte Qdrant; trenutna integracija nima ločenega polja za Qdrant API ključ.
- Samo-gostovan Qdrant: uporabite [uradno Docker sliko](https://hub.docker.com/r/qdrant/qdrant) in izpostavite vrata `6333`.

### Uporablja

- [RAG vozlišče](../nodes/rag-node.md) (prek vektorske shrambe)
- [Zavihek Vektorske shrambe](../tabs/vectorstores-tab.md)

## Prilagojeni Vektorski Vnos (RAG)

Privzeto RAG vektorski vnosi prihajajo iz OpenAI. Poverilnica **RAG: Prilagojeni Vektorski Vnosi** se sklicuje na katerikoli OpenAI-združljiv vektorski endpoint — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together ali gostovani prehod — in imenuje vektorsko shrambo, v katero zapisuje.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `embedding_base_url` | URL endpointa, vključno s potjo `/v1`, npr. `http://localhost:11434/v1` |
| `embedding_api_key` | Neobvezno. Lokalni strežniki običajno ne potrebujejo ključa |
| `embedding_model` | Ime modela, kot ga endpoint pričakuje, npr. `nomic-embed-text` |
| `embedding_dimensions` | Širina vektorja, ki ga model vrne (privzeto `1536`) |
| `embedding_request_dimensions` | Neobvezno. Zahtevajte od endpointa, da vrne `embedding_dimensions` namesto naravne širine modela |
| `db_type` | `qdrant` ali `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Povezava do Qdranta, obvezna, ko je `db_type` `qdrant` |

### Opombe

- **Qdrant sprejema katerokoli število dimenzij.** Vsaka zbirka se ustvari pri širini, ki jo ta poverilnica razglaša, zato je polje Dimenzije prosto urejevanje.
- **Postgres (pgvector) zahteva natančno 1536 dimenzij.** Njegova kolona je fiksna `vector(1536)`, zato je polje Dimenzije pritrjeno na 1536 in poverilnica, ki razglaša katerokoli drugo širino, je zavrnjena ob shranjevanju.
- **Krajšanje za pgvector.** Ko je shramba Postgres, dialog ponudi *Zahtevajte od endpointa, da vrne 1536 dimenzij*. To pošlje parameter `dimensions`, ki ga modeli, usposobljeni z Matryoshka predstavitvami (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` in podobno), upoštevajo z vračanjem skrajšanega, še vedno smiselnega vektorja. Endpoints, ki ne podpirajo parametra, zavrnejo zahtevo, endpoints, ki ga sprejmejo, a ignorirajo, pa proizvedejo jasno napako, ki navaja širino, ki je dejansko vrnjena. Heym nikoli ne skrajšuje vektorjev sam, ker rezanje izhoda modela, ki ni Matryoshka, tiho poslabša kakovost iskanja. Možnost ni ponujena za Qdrant, ki lahko prilagodi zbirko katerikoli širini.
- Uporabite **Preizkus Povezave** v dialogu poverilnice, da vstavite preizkusno besedilo in vidite širino, ki jo model dejansko vrne, preden ustvarite shrambo.
- Parameter `dimensions` se pošlje samo OpenAI-ju, saj večina OpenAI-združljivih strežnikov zavrne neznane parametre. Naravna širina modela se potrdi proti poverilnici.
- Obstoječe poverilnice **RAG: Qdrant + OpenAI** in **RAG: Psql + OpenAI** ostajajo nespremenjene in še naprej delujejo.

### Uporablja

- [RAG vozlišče](../nodes/rag-node.md) (prek vektorske shrambe)
- [Zavihek Vektorske shrambe](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym lahko tudi shranjuje vektorje **v svoji lastni Postgres bazi** z uporabo razširitve [pgvector](https://github.com/pgvector/pgvector) — brez potrebe po zunanji vektorski storitvi. Ustvarite poverilnico **RAG: Psql + OpenAI** in jo uporabite pri ustvarjanju vektorske shrambe, nato izberite **Postgres (pgvector)** v spustnem meniju baze podatkov RAG vozlišča.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `openai_api_key` | OpenAI API ključ, uporabljen za generiranje vnosov pri indeksiranju in iskanju dokumentov |

### Opombe

- Ni potrebna povezava/vrata — vektorji se zapisujejo v Heymovo lastno bazo; Heym se nikoli ne povezuje na drugo bazo.
- Vsaka RAG funkcija, ki je na voljo z Qdrantom (vstavljanje, iskanje, filtri metapodatkov, Cohere ponovna razvrstitev, kloniranje, deljenje), deluje enako z backendom Postgres.
- Zahteva razširitev `vector`. Heym ohranja uradno sliko `postgres:16` nespremenjeno (tako da obstoječi podatki nikoli niso dotaknjeni) in **samodejno namesti paket `postgresql-16-pgvector` ob zagonu** — `run.sh`, `deploy.sh` in `run_e2e.sh` vse to obravnavajo. Namestitev ni usodna: če ne more teči (npr. brez omrežja), Qdrant RAG še naprej deluje, backend Postgres pa ostane neaktiven (migracija se elegantno preskoči).
- Če zaženete objavljeno sliko enega kontejnerja (`ghcr.io/heymrun/heym`) proti **vaši lastni zunanji Postgres**, ta baza podatkov mora podpirati razširitev `vector` (Heym je ne more namestiti v bazo, ki je ne upravlja). Brez tega se ob ustvarjanju ali nalaganju v Postgres vektorsko shrambo vrne jasna sporočila, Qdrant RAG pa še naprej deluje.

### Uporablja

- [RAG vozlišče](../nodes/rag-node.md) (prek vektorske shrambe)
- [Zavihek Vektorske shrambe](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) je hibrid preglednice/baze podatkov, ki podpira strukturirane podatke in formule. Poverilnica Grist omogoča Heym-u branje in pisanje Grist dokumentov.
### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `api_key` | Grist API ključ (najdete ga v **Profil → API ključ** na vaši Grist instanci) |
| `server_url` | Osnovni URL vašega Grist strežnika (npr. `https://docs.getgrist.com` za Grist Cloud ali vaš URL za samostojno gostovanje) |

### Opombe

- [Grist vozlišče](../nodes/grist-node.md) zahteva **ID dokumenta** (iz URL-ja Grist dokumenta) in **ID tabele** v svoji konfiguraciji — ti nista del poverilnice.
- Za samostojno gostovanje Grist nastavite `server_url` na domeno vaše instance.
- ID-ji stolpcev v Grist uporabljajo podčrtaje (npr. `User_Name`), ne prikaznih oznak. Uporabite operacijo `listColumns`, da jih odkrijete.

### Uporablja

- [Grist vozlišče](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Poverilnica Google Sheets povezuje Heym z Google Sheets API z uporabo modela OAuth2 "Prinesite svojo aplikacijo". Predložite Google Cloud OAuth2 Client ID in Client Secret, nato pa avtorizirate dostop prek pojavnega okna brskalnika. Tokene se samodejno osvežujejo v ozadju.

### Nastavitev

1. Odprite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → poiščite in omogočite **Google Sheets API**.
2. Pojdite na **Credentials** → **Create Credentials** → **OAuth client ID** → vrsta aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopirajte ustvarjeni **Client ID** in **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → vnesite **Google Sheets (OAuth2)**.
6. Vnesite Client ID, Client Secret in ime, nato kliknite **Connect**, da odprete pojavna okna za Google soglasje in avtorizirate dostop.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se shranjujejo in samodejno osvežujejo — ne upravljate jih neposredno.

### Opombe

- Soglasna stran OAuth2 zahteva obseg za preglednice (`https://www.googleapis.com/auth/spreadsheets`).
- Heym uporablja osvežitveni token za pridobitev novih dostopnih tokenov, preden potečejo (60-sekundni varnostni rez).
- Če spremenite Client Secret v Google Cloud Console, ponovno povežite poverilnico prek gumba **Connect**.
- **Proizvodnja:** Nastavite backend **`FRONTEND_URL`** na natančen javni URL, ki ga uporabniki odprejo v brskalniku (shema + gostitelj, npr. `https://heym.example.com`). Heym gradi Google OAuth preusmeritveni URI samo iz te vrednosti — ne zaupa `Origin` ali `X-Forwarded-*` glavam (nadzorovano s strani odjemalca). Registrirajte `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` v Google Cloud Console.

### Uporablja

- [Google Sheets vozlišče](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Poverilnica Google Drive povezuje Heym z Google Drive API z uporabo istega modela OAuth2 "Prinesite svojo aplikacijo" kot Google Sheets. Predložite Google Cloud OAuth2 Client ID in Client Secret, nato pa avtorizirate dostop prek pojavnega okna brskalnika. Tokene se samodejno osvežujejo v ozadju.

### Nastavitev

1. Odprite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → poiščite in omogočite **Google Drive API**.
2. Pojdite na **Credentials** → **Create Credentials** → **OAuth client ID** → vrsta aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopirajte ustvarjeni **Client ID** in **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → vnesite **Google Drive (OAuth2)**.
6. Vnesite Client ID, Client Secret in ime, nato kliknite **Connect**, da odprete pojavna okna za Google soglasje in avtorizirate dostop.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se shranjujejo in samodejno osvežujejo — ne upravljate jih neposredno.

### Obseg

Google Drive zahteva **celoten obseg Drive** (`https://www.googleapis.com/auth/drive`).

To je potrebno, ker vozlišče deluje na datotekah, ki jih že imate. Ožji obseg `drive.file` omogoča dostop le do datotek, ki jih je ustvaril sam OAuth odjemalec, kar bi povzročilo, da `listFolderFiles`, `updateFile`, `removeFile` in `removeFolder` ne bi videli ničesar iz vašega obstoječega Drive.

Ker predložite svoj Client ID in Secret iz svojega Google Cloud projekta, se zahteve za preverjanje aplikacij Google za ta obseg nanašajo na vaš projekt, ne na Heym.

### Opombe

- Heym uporablja osvežitveni token za pridobitev novih dostopnih tokenov, preden potečejo (60-sekundni varnostni rez).
- Če spremenite Client Secret v Google Cloud Console, ponovno povežite poverilnico prek gumba **Connect**.
- Deljene enote so podprte — vozlišče nastavi `supportsAllDrives` pri vsakem klicu API.
- **Proizvodnja:** Nastavite backend **`FRONTEND_URL`** na natančen javni URL, ki ga uporabniki odprejo v brskalniku. Heym gradi Google OAuth preusmeritveni URI samo iz te vrednosti — ne zaupa `Origin` ali `X-Forwarded-*` glavam. Registrirajte `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` v Google Cloud Console.
- Oglejte si [Deli poverilnice](./credentials-sharing.md) pred deljenjem te poverilnice s skupino.

### Uporablja

- [Google Drive vozlišče](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Poverilnica BigQuery povezuje Heym z Google BigQuery API preko modela OAuth2 "Bring Your Own App". Vnesete Google Cloud OAuth2 Client ID in Client Secret, nato pa avtorizirate dostop preko pojavnega okna brskalnika. Tokene se samodejno osvežujejo v ozadju.

### Nastavitev

1. Odprite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → poiščite in omogočite **BigQuery API**.
2. Pojdite na **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopirajte ustvarjeni **Client ID** in **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → vnesite **BigQuery (OAuth2)**.
6. Vnesite Client ID, Client Secret in ime, nato kliknite **Connect**, da odprete pojavna okna za Google soglasje in avtorizirate dostop.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se shranijo in samodejno osvežijo.

### Opombe

- Zaslon za soglasje OAuth2 zahteva obseg BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Proizvodnja:** Nastavite backend **`FRONTEND_URL`** na javni URL. Registrirajte `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` v Google Cloud Console.

### Uporablja

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Poverilnica Supabase povezuje Heym s PostgREST API Supabase projekta, tako da lahko workflows poizvedujejo in spreminjajo tabele, podprte s Postgresom.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `supabase_url` | Osnovni URL projekta, na primer `https://your-project.supabase.co` |
| `supabase_key` | API ključ z dostopom do ciljnih tabel |
| `supabase_schema` | Neobvezni privzeti shema (privzeto `public`) |

### Opombe

- [Supabase node](../nodes/supabase-node.md) komunicira z `/rest/v1/<table>` in podpira operatorje filtriranja (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` in sorodni PostgREST operatorji) ter gnezdene logične skupine `or` / `and`.
- Za operacije pisanja raje uporabite ključ, namenjen zaupanju na strežniški strani, z minimalnimi potrebnimi dovoljenji za tabele.
- Vozlišča lahko preglasijo shemo na koraku, tudi če poverilnica določa privzeto shemo.

### Uporablja

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

Poverilnica ClickHouse povezuje Heym z zunanjim ClickHouse podatkovnim bazam preko njegovega HTTP vmesnika, tako da lahko workflows izvajajo SQL, CRUD in štetja operacije proti OLAP tabelam.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `host` | HTTP gostitelj brez sheme, na primer `your-instance.clickhouse.cloud` |
| `port` | HTTP vmesniška vrata (`8443` za HTTPS, `8123` za HTTP) |
| `username` | ClickHouse uporabnik (privzeto `default`) |
| `password` | Geslo uporabnika (neobvezno) |
| `database` | Ciljna baza podatkov (privzeto `default`) |
| `secure` | Uporabite HTTPS, ko je `true` (zahtevano za ClickHouse Cloud) |

### Opombe

- [ClickHouse node](../nodes/clickhouse-node.md) uporablja uradnega `clickhouse-connect` HTTP odjemalca in parametizira filtriranje in vrednosti.
- `update` in `remove` se preslikata na `ALTER TABLE ... UPDATE` in `DELETE FROM`, kar so asinhrone mutacije ClickHouse; obe zahtevata filter.
- `upsert` izvede `INSERT` in predpostavlja tabelo `ReplacingMergeTree` za obnašanje združevanja po ključu.
- Uporabite **Test connection** v pogovornem oknu poverilnice za preverjanje dosegljivosti.

### Uporablja

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Poverilnica Notion podpira bodisi notranji integracijski žeton bodisi javno integracijo OAuth povezavo. OAuth omogoča vsakemu uporabniku, da avtorizira Notion delovno okolje iz Heym, namesto da bi ročno kopiral žeton.

### Obvezna Polja

| Način | Polje | Opis |
|------|-------|-------------|
| Notranji žeton | `api_token` | Notranji integracijski žeton (`ntn_...`) |
| OAuth | `client_id` | Client ID iz javne integracije Notion |
| OAuth | `client_secret` | Client Secret iz javne integracije Notion |

OAuth povratni URI samodejno shrani `access_token`, `auth_mode`, `workspace_id`, `workspace_name` in `bot_id`. Vsak prejšnji notranji `api_token` se odstrani, ko se OAuth zaključi. Registrirajte ta preusmeritveni URI v Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Potek nastavitve OAuth

1. Izberite **OAuth** v pogovornem oknu poverilnice, vnesite ime, Client ID in Client Secret.
2. Kliknite **Connect** in avtorizirajte delovno okolje v pojavnem oknu Notion.
   - Za **novo** poverilnico Heym ustvari zapis poverilnice, ko kliknete **Connect**.
   - Dokončajte avtorizacijo v pojavnem oknu, nato kliknite **Save**, da se vrnete na seznam poverilnic.
3. Povezana poverilnica prikazuje `connected (Ime delovnega okolja)` na seznamu. Čakajoče OAuth poverilnice prikazujejo `Not connected`, dokler avtorizacija ne konča.

Uporabite **Test Connection** v pogovornem oknu poverilnice za preverjanje bodisi notranjega žetona bodisi dokončane avtorizacije OAuth. Ko urejate, pustitev polja žetona praznega ohrani shranjeni notranji žeton.

Tako notranji žetoni kot OAuth dostopni žetoni so na voljo preko `$credentials.CredentialName` za prilagojene [HTTP](../nodes/http-node.md) klice, ki potrebujejo Notion bearer žeton.
### Opombe

- Notranje integracije zahtevajo, da so ustrezne strani, baze podatkov in podatkovni viri deljeni.
- Uporabniki OAuth izberejo delovno okolje/strani med avtorizacijo v Notion.
- Poverilnice aplikacije OAuth so šifrirane znotraj poverilnice Notion. Povratni klic jih naloži na strežniški strani; skrivnost ni vgrajena v stanje OAuth.
- Povezane poverilnice OAuth prikazujejo ime delovnega okolja; čakajoče poverilnice OAuth prikazujejo `Not connected`, dokler avtorizacija ne zaključi.
- **Proizvodnja:** Nastavite backend **`FRONTEND_URL`** na javni URL brskalnika (shema + gostitelj, brez končne poševnice). URI za preusmeritev Notion mora natančno ustrezati:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Vozlišče uporablja različico API `2026-03-11` in trenutno terminologijo `data_source`. Oglejte si članek o [Notion vozlišču](../nodes/notion-node.md#api-version-notes) za smernice o migraciji iz starejših primerov `archived`, `after` ali poizvedb po bazi podatkov.
- Stari iskalni filtri z vrednostjo objekta `database` so normalizirani na `data_source`.

### Uporablja

- [Notion vozlišče](../nodes/notion-node.md)

---

## SMTP (Email)

Poverilnica SMTP shranjuje podrobnosti o povezavi z e-poštnim strežnikom za pošiljanje odhodne pošte.

### Obvezna polja

| Polje | Opis |
|-------|-------------|
| `host` | Ime gostitelja SMTP strežnika (npr. `smtp.gmail.com`) |
| `port` | SMTP vrata (običajno `587` za STARTTLS, `465` za SSL) |
| `email` | E-poštni naslov pošiljatelja |
| `password` | SMTP geslo ali geslo aplikacije |

### Pogosti ponudniki SMTP

| Ponudnik | Gostitelj | Vrata | Opombe |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Zahteva [geslo aplikacije](https://support.google.com/accounts/answer/185833) (2FA mora biti omogočen) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Uporabite poverilnice svojega Microsoftovega računa |
| Mailgun | `smtp.mailgun.org` | `587` | Uporabite Mailgun SMTP poverilnice iz nastavitev domene |
| SendGrid | `smtp.sendgrid.net` | `587` | Uporabite `apikey` kot uporabniško ime in API ključ kot geslo |
| Po meri / Samostojno gostovanje | vaša domena | `587` / `465` | Postfix, Exim itd. |

### Opombe

- Gmail zahteva **geslo aplikacije** namesto vašega običajnega gesla, ko je omogočena 2-stopenjska preveritev.
- Vrata `587` uporabljajo STARTTLS (začnejo v besedilu, nadgradijo na TLS). Vrata `465` uporabljajo implicitni TLS (SSL od začetka).

### Uporablja

- [Pošlji e-pošto vozlišče](../nodes/send-email-node.md)

---

## IMAP (Vhodna e-pošta)

Poverilnica IMAP shranjuje podrobnosti o povezavi za spremljanje nabiralnika z [IMAP Trigger vozliščem](../nodes/imap-trigger-node.md).

### Obvezna polja

| Polje | Opis |
|-------|-------------|
| `imap_host` | Ime gostitelja IMAP strežnika (na primer `imap.gmail.com`) |
| `imap_port` | IMAP vrata (`993` za SSL/TLS pri večini ponudnikov) |
| `imap_username` | Uporabniško ime nabiralnika ali celoten e-poštni naslov |
| `imap_password` | Geslo ali geslo aplikacije specifično za ponudnika |

### Neobvezna polja

| Polje | Opis |
|-------|-------------|
| `imap_mailbox` | Mapo nabiralnika, ki jo je treba spremljati (privzeto: `INBOX`) |
| `imap_use_ssl` | Omogočite SSL/TLS (priporočljivo; privzeto: `true`) |

### Opombe

- IMAP sprožilec določi trenutno stanje nabiralnika ob prvem preverjanju in nato obdeluje le novejše e-pošte.
- Gmail, Microsoft 365 in drugi gostovani ponudniki pogosto zahtevajo **geslo aplikacije** ali podobno skrivnost specifično za IMAP.
- Vsebina priponk ni prenesena v payload delovnega toka; Heym izpostavi le metapodatke o priponkah.

### Uporablja

- [IMAP Trigger vozlišče](../nodes/imap-trigger-node.md)
- [Sprožilci](./triggers.md) (IMAP kot sprožilec delovnega toka)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) je odprtokodni posrednik sporočil. Poverilnica RabbitMQ shranjuje podrobnosti o povezavi za objavljanje in porabo iz vrst in izmenjav.

### Obvezna polja

| Polje | Opis |
|-------|-------------|
| `rabbitmq_host` | AMQP povezovalni URL (npr. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ uporabniško ime (privzeto: `guest`) |
| `rabbitmq_password` | RabbitMQ geslo (privzeto: `guest`) |

### Virtualni gostitelji

Za povezavo s specifičnim virtualnim gostiteljem ga vključite v URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Če uporabljate privzeti vhost, lahko pot `/` izpustite.

### Vtičnik za zamudo sporočil

[RabbitMQ vozlišče](../nodes/rabbitmq-node.md) podpira vtičnik **rabbitmq_delayed_message_exchange**. Ko je ta vtičnik omogočen na vašem RabbitMQ strežniku, lahko nastavite zamudo (v milisekundah) na odhodnih sporočilih z uporabo polja `rabbitmqDelayMs` na vozlišču.

Vozlišče nastavi glavo `x-delay` na objavljenem sporočilu. Tip izmenjave mora biti `x-delayed-message`, da zamude začnejo veljati.

Za omogočanje vtičnika na samostojnem RabbitMQ primeru:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Ko vtičnik ni nameščen, se glava `x-delay` ignorira in sporočila se dostavijo takoj.

### Uporablja

- [RabbitMQ vozlišče](../nodes/rabbitmq-node.md)
- [Sprožilci](./triggers.md) (RabbitMQ kot sprožilec delovnega toka)

---

## Amazon S3

Poverilnica Amazon S3 povezuje Heym z [Amazon S3](https://aws.amazon.com/s3/). Uporabite jo z [Amazon S3 vozliščem](../nodes/amazon-s3-node.md) za upravljanje s koši in mapami, nalaganje in prenašanje objektov, kopiranje ključev ter seznam ali brisanje objektov iz delovnih tokov.
### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `aws_access_key_id` | AWS IAM identifikator dostopnega ključa |
| `aws_secret_access_key` | Tajni dostopni ključ, povezan z identifikatorjem dostopnega ključa |
| `aws_region` | AWS regija, kjer se nahajajo vedra (npr. `us-east-1`) |

### Neobvezna Polja

| Polje | Opis |
|-------|-------------|
| `aws_session_token` | Začasni sejni žeton pri uporabi AWS STS poverilnic |

### Opombe

- Poverilnica uporablja standardno AWS SigV4 avtentikacijo preko boto3.
- Operacije nalaganja trenutno pošiljajo UTF-8 besedilno vsebino; prenosi lahko vrnejo besedilo ali base64 za binarne objekte.

### Uporablja

- [Amazon S3 vozlišče](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) je shramba ključ-vrednost v pomnilniku, ki se uporablja za predpomnjenje in hiter dostop do podatkov.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `host` | Ime gostitelja ali IP naslov Redis strežnika (npr. `localhost`) |
| `port` | Redis vrata (privzeto: `6379`) |
| `password` | Redis geslo (pustite prazno, če ni nastavljeno) |

### Uporablja

- [Redis vozlišče](../nodes/redis-node.md)

---

## Slack

Poverilnica Slack shranjuje **URL za prihajajoči Webhook** za pošiljanje sporočil v Slack kanale.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `webhook_url` | Slack URL za prihajajoči Webhook (iz konfiguracije vaše Slack aplikacije) |

### Opombe

- Ustvarite prihajajoči Webhook na [api.slack.com/apps](https://api.slack.com/apps) → vaša aplikacija → **Incoming Webhooks**.
- Vsak webhook je omejen na določen kanal. Ustvarite več poverilnic za različne kanale.

### Uporablja

- [Slack vozlišče](../nodes/slack-node.md)

---

## Telegram

Poverilnica Telegram shranjuje **Bot Token** in neobvezni **Webhook Secret Token** za delovne tokove, ki temeljijo na botih.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `bot_token` | Telegram Bot API žeton iz BotFather |

### Neobvezna Polja

| Polje | Opis |
|-------|-------------|
| `secret_token` | Skriti žeton, preverjen proti `x-telegram-bot-api-secret-token` na prihajajočih webhookih |

### Opombe

- Uporabite isto poverilnico za [Telegram Trigger](../nodes/telegram-trigger-node.md) in [Telegram](../nodes/telegram-node.md).
- Registrirajte webhook ročno z Telegramovim `setWebhook` API, pri čemer uporabite URL, prikazan v nadzorni plošči Telegram Trigger vozlišča.
- `chatId` v Telegram vozlišču je lahko dobesedna ID številka ali izraz, kot je `$telegramEvent.message.chat.id`.

### Uporablja

- [Telegram Trigger vozlišče](../nodes/telegram-trigger-node.md)
- [Telegram vozlišče](../nodes/telegram-node.md)

---

## HTTP Avtentikacija (Bearer & Header)

Te poverilnice se uporabljajo z [HTTP vozliščem](../nodes/http-node.md) za avtentikacijo odhodnih zahtev.

### Bearer

Pripne `Authorization: Bearer <token>` glavo k HTTP zahtevam.

| Polje | Opis |
|-------|-------------|
| `token` | Vrednost bearer žetona |

### Header

Pripne po meri glavo k HTTP zahtevam.

| Polje | Opis |
|-------|-------------|
| `header_key` | Ime glave (npr. `X-Api-Key`) |
| `header_value` | Vrednost glave |

Obe vrsti se lahko prav tako sklicujeta preko `$credentials.CredentialName` v [Expression DSL](./expression-dsl.md) za dinamično uporabo v katerem koli vozlišču, ki sprejema izraze.

### Uporablja

- [HTTP vozlišče](../nodes/http-node.md)

---

## LLM Poverilnice (OpenAI, Google, Custom, Cohere)

Te poverilnice napajajo AI vozlišča.

| Tip | Opis |
|------|-------------|
| **OpenAI** | API ključ za GPT modele in OpenAI vektorske shrambe |
| **Google** | API ključ za Gemini modele |
| **Custom** | API ključ + osnovni URL za OpenAI-kompatibilne končne točke (Ollama, vLLM, LM Studio itd.) |
| **Cohere** | API ključ za Cohere vektorske shrambe |

### OpenAI Predpomnjenje Pozivov

OpenAI samodejno predpomni statični (ne spreminjajoči se) predpon vašega sistemskega poziva — dodatna konfiguracija ni potrebna. Ponovljeni zagon delovnih tokov, ki delijo isto predpono sistemskega poziva, koristi od predpomnjenega cenovnega modela žetonov, kar zmanjšuje tako stroške kot latenco. To je še posebej koristno, kadar imate dolga, fiksna navodila in se med zagonoma spreminja le uporabniško sporočilo. Spremljajte stopnje zadetkov predpomnilnika in prihranke žetonov na [Traces zavihku](../tabs/traces-tab.md) ali na nadzorni plošči OpenAI za optimizacijo strukture vaših pozivov za največjo ponovno uporabo predpomnilnika.

### Uporablja

- [LLM vozlišče](../nodes/llm-node.md)
- [Agent vozlišče](../nodes/agent-node.md)
- [RAG vozlišče](../nodes/rag-node.md) (OpenAI vektorske shrambe preko Qdrant poverilnice)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) je proxy strežnik za obvladovanje Cloudflare in podobnih izzivov zaščite pred boti.

### Obvezna Polja

| Polje | Opis |
|-------|-------------|
| `flaresolverr_url` | URL vaše instance FlareSolverr (npr. `http://localhost:8191`) |

Podprti so povratni in zasebni naslovi, zato delovanje FlareSolverr ob Heym deluje, kot je dokumentirano. URL morda ne bo reševal na povezavo lokalnega ali oblačnega metapodatkovnega naslova. Ker so dovoljeni zasebni naslovi, se to polje lahko usmeri tudi na drugo interno storitev, odgovor pa se vrne v izhodu vozlišča. Vsak prijavljen uporabnik lahko ustvari to poverilnico, zato je meja, kdo lahko avtorizira delovne tokove, skupaj z vašimi omrežnimi pravili, ne pa deljenje poverilnic. Oglejte si [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Uporablja

- [Crawler vozlišče](../nodes/crawler-node.md)

---
## Sorodno

- [Poverilnice](./credentials.md) – Pregled poverilnic in kako jih uporabljajo vozlišča
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajanje in upravljanje poverilnic
- [Deljenje Poverilnic](./credentials-sharing.md) – Delite poverilnice z uporabniki in ekipami
- [Varnost](./security.md) – Šifriranje v mirovanju, nadzor dostopa
- [Izrazni DSL](./expression-dsl.md) – Sintaksa `$credentials` za dinamičen dostop

---

## Model Router (Avtomatski model)

Usmerja vsako zahtevo na eno od vaših obstoječih poverilnic modela, pri čemer uporablja odločilni model za izbiro. Shranjuje reference, nikoli pa svojega ključa.

### Obvezna polja

- `decision_credential_id` – **Poverilnica odločilnega modela**, do katere imate dostop.
- `decision_model` – model, ki izvede usmerjanje, na primer `jev-latest`.
- `options` – vsaj dva vnosa, vsak z imenom, ena od vaših OpenAI/Google/Custom poverilnic, model na njej in kriteriji, ki določajo, kdaj naj zmagajo.

### Neobvezna polja

- `routing_instructions` – kako oceniti možnosti na splošno.
- Ena možnost je lahko označena kot rezervna, ki se uporabi, ko usmerjanje ne uspe.

### Opombe

Imena možnosti so tiste, med katerimi se odloča odločilni model, zato morajo biti edinstvena. Možnost ne more kazati na drugega Model Router.
