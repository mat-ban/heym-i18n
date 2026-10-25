# Integracije s Trećim Stranama

Heym se povezuje s vanjskim uslugama putem **vjerodajnica**. Svaka vrsta vjerodajnice pohranjuje detalje veze za jednu uslugu i može se ponovno koristiti u više čvorova i workflows-a. Pogledajte [Vjerodajnice](./credentials.md) za pregled.

Dodajte vjerodajnice u [Postavke → Vjerodajnice](../tabs/credentials-tab.md). Sve vrijednosti su šifrirane u mirovanju. Vjerodajnice se mogu [dijeliti](./credentials-sharing.md) s drugim korisnicima ili [Timovima](./teams.md).

Neki čvorovi integracije **ne** zahtijevaju vjerodajnice. [WebSocket Trigger](../nodes/websocket-trigger-node.md) i [WebSocket Send](../nodes/websocket-send-node.md) povezuju se s vanjskim socketima koristeći URL, zaglavlja i podprotokole konfigurirane izravno na čvoru.

## Pregled Vrsta Vjerodajnica

| Vrsta | Koriste | Ključna Polja |
|-------|---------|---------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opcionalno `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opcionalno `base_url` |
| **Jira** | [Jira čvor](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (samo Basic auth), opcionalno `api_version` |
| **Linear** | [Linear čvor](../nodes/linear-node.md) | `api_key`, ili `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry čvor](../nodes/sentry-node.md) | `api_token`, opcionalno `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluacije](../tabs/evals-tab.md) (LLM-as-Judge sudac) | `base_url`, opcionalno `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | vjerodajnica modela odluke, plus opcije modela koje upućuju na Vaše druge vjerodajnice |
| **Cohere** | Ugradnje | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorska spremišta | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorska spremišta | `openai_api_key` (vektori pohranjeni u Heym-ovom vlastitom Postgresu putem pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorska spremišta | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opcionalno `embedding_api_key`, plus `qdrant_host` kada je `db_type` `qdrant` |
| **Grist** | [Grist čvor](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets čvor](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 suglasnost |
| **Google Drive** | [Google Drive čvor](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 suglasnost (cjelokupni opseg Drive-a) |
| **BigQuery** | [BigQuery čvor](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 suglasnost |
| **Supabase** | [Supabase čvor](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opcionalno `supabase_schema` |
| **ClickHouse** | [ClickHouse čvor](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion čvor](../nodes/notion-node.md) | `api_token`, ili `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 čvor](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Pošalji Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger čvor](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger čvor](../nodes/telegram-trigger-node.md), [Telegram čvor](../nodes/telegram-node.md) | `bot_token`, opcionalno `secret_token` |
| **Discord** | [Discord čvor](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger čvor](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ čvor](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis čvor](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack čvor](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger čvor](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP čvor](../nodes/http-node.md) | `token` |
| **Header** | [HTTP čvor](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler čvor](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Vjerodajnica za GitHub pohranjuje osobni pristupni token (PAT) za GitHub kako bi workflows mogli pozivati GitHub REST API putem [GitHub čvora](../nodes/github-node.md), proslijediti token u MCP servere kao što su `@modelcontextprotocol/server-github`, ili ga koristiti iz [HTTP čvora](../nodes/http-node.md) za prilagođene REST pozive.

### Obavezna Polja

| Polje | Opis |
|-------|------|
| `api_key` | Osobni pristupni token za GitHub (`github_pat_...` fine-grained PAT ili klasični `ghp_...` PAT) |
### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `base_url` | Osnovni URL GitHub API-ja za GitHub Enterprise Server (na primjer `https://github.example.com/api/v3`) |

### Napomene

- Preporučuju se fine-grained personal access tokens kada je to moguće jer ih možete ograničiti na specifične repozitorije i dozvole.
- Ostavite `base_url` praznim za GitHub.com. Za GitHub Enterprise Server, koristite puni REST API
  endpoint uključujući `/api/v3` (na primjer `https://github.example.com/api/v3`), a ne korijenski URL web sučelja servera poput `https://github.example.com`.
- Ova vjerodajnica trenutno modelira samo autentifikaciju temeljenu na PAT-u. Za pristup repozitorijima organizacije, koristite PAT koji ima dodijeljene potrebne dozvole za organizaciju/repozitorij.
- Tokeni za instalaciju GitHub aplikacija i tokovi postavljanja GitHub aplikacija nisu u prvom planu u Heym UI-u danas.
- Preferirajte [GitHub čvor](../nodes/github-node.md) za operacije s repozitorijima, korisnicima, problemima, zahtjevima za povlačenje, recenzijama, izdanjima, Actions workflow-ima, prometom i datotekama. Koristite [HTTP čvor](../nodes/http-node.md) samo kada su potrebni endpointi ili payloadi koje GitHub čvor ne pokriva.
- Koristite [Agent čvor](../nodes/agent-node.md) s MCP-om prosljeđujući `$credentials.YourGitHubCredential` u varijablu okruženja za MCP vezu poput `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHubov REST API obično očekuje `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Kada uređujete GitHub vjerodajnicu, ostavljanje praznog `base_url` za GitHub Enterprise čuva postojeći endpoint. Unesite novu URL adresu samo kada želite promijeniti taj endpoint.

### Koriste

- [GitHub čvor](../nodes/github-node.md)
- [Codex čvor](../nodes/codex-node.md)
- [Agent čvor](../nodes/agent-node.md)
- [HTTP čvor](../nodes/http-node.md)

---

## Model Odluke

Model odluke odgovara na tipizirana pitanja o stanju i vraća vjerojatnosti umjesto teksta. TypeSafe-ov Jev je referentna implementacija; svaki endpoint koji prihvaća isti `{model, state, questions}` tijelo radi, a [Decision](../nodes/decision-node.md) čvor može poslati ručno napisano tijelo za onaj koji ne radi.

### Obavezna Polja

- `base_url` – endpoint, na primjer `https://api.typesafe.ai`. Heym dodaje `/v1/systemone`.

### Opcionalna Polja

- `api_key` – šalje se kao `Authorization: Bearer`. Endpointi kojima nije potreban ključ mogu ostaviti ovo prazno.

### Napomene

- **Testiraj vezu** šalje jedno malo pitanje kako bi potvrdio da endpoint i ključ rade.
- Uređivanje vjerodajnice zadržava pohranjeni ključ kada je polje za ključ ostavljeno prazno.
- Odlazni zahtjevi na privatne i loopback adrese su prema zadanim postavkama blokirani, pa self-hosted endpoint na `localhost` ili privatnom rasponu treba `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Ovi modeli su odsutni iz tablica cijena LLM-a koje Heym sinkronizira, pa kolona Trošak u [Izvršavanjima](../tabs/traces-tab.md) ostaje prazna. Brojevi tokena se i dalje bilježe.

### Koriste

- [Decision](../nodes/decision-node.md)
- [Evaluacije](../tabs/evals-tab.md) – ocjenjuje odgovore `LLM-as-Judge` u odnosu na očekivani ishod

## OpenAI Codex

Vjerodajnica OpenAI Codex autentificira [Codex čvor](../nodes/codex-node.md). Ona je odvojena od vjerodajnice OpenAI API ključa koja se koristi za LLM, Agent i RAG čvorove.

### Načini Autentifikacije

| Način | Opis |
|------|-------------|
| **Prijava s ChatGPT** (preporučeno) | OAuth (PKCE) prijava koja koristi Vašu ChatGPT Plus/Pro pretplatu, tako da izbjegavate troškove po tokenu. Heym pohranjuje i automatski osvježava paket tokena. |
| **Pristupni token** | ChatGPT/Codex `access_token` proslijeđen samo lokalnom Codex CLI procesu. |

### Napomene

- API ključevi se odbacuju za ovu vrstu vjerodajnice.
- Codex tokeni nisu izloženi kroz `$credentials.Name`.
- Codex čvor također treba GitHub vjerodajnicu za kloniranje repozitorija, slanje grana i kreiranje nacrta PR-a.

### Koriste

- [Codex čvor](../nodes/codex-node.md)

## OpenCode Go

Vjerodajnica OpenCode Go autentificira [OpenCode Go čvor](../nodes/opencode-go-node.md). Pohranjuje OpenCode Go gateway API ključ (s [opencode.ai/go](https://opencode.ai/go)) i opcionalni gateway osnovni URL.

### Polja

| Polje | Opis |
|-------|-------------|
| **API Ključ** | OpenCode Go gateway API ključ (obavezan). |
| **Gateway Osnovni URL** | Opcionalno; prema zadanim postavkama `https://opencode.ai/zen/go/v1`. Prepišite samo za self-hosted ili proksirane gateway-e. |

### Napomene

- API ključ se prosljeđuje samo OpenCode CLI procesu unutar zaštićenog kontejnera.
- OpenCode Go čvor također treba GitHub vjerodajnicu za kloniranje repozitorija, slanje grana i kreiranje zahtjeva za povlačenje. GitHub token nikada se ne stavlja unutar sandbox kontejnera.

### Koriste

- [OpenCode Go čvor](../nodes/opencode-go-node.md)

---

## Linear

Vjerodajnica Linear podržava ili osobni API ključ ili OAuth2 za [Linear čvor](../nodes/linear-node.md). Heym šalje izvorne GraphQL upite Linear-u za metapodatke radnog prostora, projekte, probleme i komentare.
### Postavke

Odaberite jedan način autentifikacije:

**Osobni API ključ**

1. U Linearu, otvorite **Postavke → Sigurnost i pristup → Osobni API ključevi**.
2. Kreirajte ključ s pristupom radnom prostoru koji želite automatizirati.
3. Zalijepite ključ u Linear vjerodajnicu u Heymu i koristite **Testiraj vezu** za provjeru.

**OAuth2**

1. Kreirajte Linear OAuth aplikaciju.
2. Registrirajte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kao URI za preusmjeravanje.
3. U Heym nadzornoj ploči → **Vjerodajnice** → **Novi** → upišite **Linear**.
4. Odaberite **OAuth2**, unesite Client ID i Client Secret, a zatim kliknite **Poveži**.

### Obavezna Polja

| Način | Polje | Opis |
|-------|-------|-------------|
| Osobni API ključ | `api_key` | Linear osobni API ključ, obično s prefiksom `lin_api_` |
| OAuth2 | `client_id` | Client ID iz Linear OAuth aplikacije |
| OAuth2 | `client_secret` | Client Secret iz Linear OAuth aplikacije |

OAuth tokeni (`access_token`, `refresh_token`, `token_expiry`) se pohranjuju i automatski osvježavaju.

### Napomene

- Osobni API ključevi i OAuth tokeni djeluju kao Linear korisnik koji ih je stvorio ili autorizirao.
- Linear OAuth koristi opsege `read,write,issues:create,comments:create`.
- Koristite **Testiraj vezu** u dijalogu vjerodajnica za provjeru API ključa ili OAuth tokena prema Linear API-ju.
- Koristite List Teams i List Projects u Linear čvoru za otkrivanje UUID-ova prije stvaranja ili filtriranja problema.
- Koristite List Workflow States i List Team Members za otkrivanje UUID-ova stanja i dodijeljenih osoba za ažuriranja.
- Rotirajte API ključ uređivanjem vjerodajnice i unosom zamjenske vrijednosti. Ako rotirate OAuth tajne aplikacije, ponovno povežite vjerodajnicu putem **Poveži**.

### Koriste

- [Linear čvor](../nodes/linear-node.md)

---

## Jira

Jira vjerodajnica pohranjuje Jira Basic auth vjerodajnice ili osobni token za pristup Data Center, osnovnu URL adresu Jira stranice, način implementacije i opcionalnu verziju REST API-ja za [Jira čvor](../nodes/jira-node.md). Koristite `cloud` za Jira Cloud ili `data_center` za Jira Data Center / Server.

### Postavke

**Jira Cloud**

1. U postavkama Atlassian računa, kreirajte API token.
2. U Heym nadzornoj ploči → **Vjerodajnice** → **Novi** → upišite **Jira**.
3. Unesite Atlassian email, API token i URL adresu Jira stranice kao što je `https://your-domain.atlassian.net`.
4. Koristite **Testiraj vezu** za provjeru vjerodajnice.

**Jira Data Center / Server**

1. Odaberite **Jira Data Center / Server** kao implementaciju.
2. Odaberite metodu provjere autentičnosti. **Korisničko ime i lozinka** koristi Basic auth. **Personal Access Token** koristi `Authorization: Bearer <token>` i zahtijeva Jira Data Center / Server 8.14 ili noviji. Stvorite token pod **Profil → Personal Access Tokens** u Jiri.
3. Unesite korisničko ime i lozinku za Jiru ili zalijepite osobni token za pristup (korisničko ime nije potrebno).
4. Unesite URL web-mjesta Jira, na primjer `https://jira.example.com`.
5. Koristite **Test Connection** za provjeru vjerodajnice.

### Polja

| Polje | Opis |
| --- | --- |
| `auth_mode` | `basic` (zadano ako nedostaje) ili `pat`. `pat` vrijedi samo uz `data_center` |
| `email` | E-pošta Atlassian računa Jira Cloud ili korisničko ime za Jira Data Center / Server. Ne koristi se u načinu `pat` |
| `api_token` | API token Atlassian Jira Cloud, lozinka za Jira Data Center / Server za Basic auth ili osobni token za pristup Data Center u načinu `pat` |
| `base_url` | Osnovna URL adresa Jira stranice |
| `deployment` | `cloud` za Jira Cloud ili `data_center` za Jira Data Center / Server |
| `api_version` | Verzija REST API-ja; prema zadanim postavkama `3` za Jira Cloud. Data Center / Server koristi v2 |

### Napomene

- Jira čvor šalje opise problema i komentare kao Atlassian Document Format tekstualne dokumente za Jira Cloud REST API v3. Vjerodajnice Data Center / Server šalju običan tekst.
- Data Center / Server podržava Basic auth putem korisničkog imena/lozinke i provjeru autentičnosti osobnim pristupnim tokenom (PAT) pomoću sheme Bearer. Provjera autentičnosti PAT zahtijeva Jira Data Center / Server 8.14 ili noviji.
- Učitavanje privitaka prihvaća base64 ili sadržaj URL-a podataka i podložno je ograničenju veličine datoteke platforme (zadano 99 MB). Preuzimanje privitaka može vratiti base64 sadržaj kada je omogućeno.
- Stvaranje, brisanje korisnika i obavijesti o problemima zahtijevaju da ovlašteni Jira račun ima relevantne dozvole za Jira stranicu ili organizaciju.
- Koristite List Projects, Search Issues i List Transitions za otkrivanje ključeva projekata, ključeva problema i ID-eva prijelaza.
- Za prilagođene endpointe koje ne pokriva čvor Jira, koristite [čvor HTTP](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` za Cloud ili `username:password` za Data Center / Server) ili PAT Bearer auth (`Authorization: Bearer <token>` za Data Center / Server). Alternativno, upotrijebite vjerodajnicu Header s odgovarajućim zaglavljem `Authorization`.

- [Jira čvor](../nodes/jira-node.md)
- [Vjerodajnice](./credentials.md)

---

## Sentry

Sentry vjerodajnica pohranjuje auth token za [Sentry čvor](../nodes/sentry-node.md). Heym koristi Sentry REST API za operacije s organizacijama, projektima, timovima, problemima, događajima i izdanjima.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `api_token` | Sentry auth token s pristupom organizacijama i projektima koje automatizirate |

### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `base_url` | Opcionalna osnovna URL adresa za samostalno hostani Sentry, na primjer `https://sentry.example.com` |

### Napomene

- Ostavite `base_url` praznim za Sentry SaaS.
- Koristite **Testiraj vezu** za potvrdu da token može navesti vidljive organizacije.
- Za prilagođene REST pozive, koristite `$credentials.YourSentryCredential` kao bearer token.

### Koriste

- [Sentry čvor](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) je open-source vektorska baza podataka koja se koristi za semantičko pretraživanje i RAG (Retrieval Augmented Generation).

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `qdrant_host` | Puna URL adresa vaše Qdrant instance (npr. `http://localhost:6333` ili cloud endpoint) |
| `openai_api_key` | OpenAI API ključ korišten za generiranje embeddinga prilikom indeksiranja i pretraživanja dokumenata |
### Napomene

- Qdrant kolekcije upravljaju se s [Vektorska spremišta](../tabs/vectorstores-tab.md) kartice. Svako vektorsko spremište odgovara Qdrant kolekciji.
- [RAG čvor](../nodes/rag-node.md) koristi vektorsko spremište (koje se referencira na Qdrant vjerodajnicu) — ne referencira izravno vjerodajnicu.
- Ako Vaša Qdrant instanca zahtijeva API ključ, uključite ga u `qdrant_host` vrijednost ili konfigurirajte Qdrant prema tome; trenutna integracija nema zasebno polje za Qdrant API ključ.
- Samostalno hostani Qdrant: koristite [službenu Docker sliku](https://hub.docker.com/r/qdrant/qdrant) i izložite port `6333`.

### Koristi

- [RAG čvor](../nodes/rag-node.md) (putem vektorskog spremišta)
- [Vektorska spremišta](../tabs/vectorstores-tab.md)

## Prilagođeni Ugradnje (RAG)

Prema zadanim postavkama, RAG ugradnje dolaze iz OpenAI. **RAG: Prilagođene Ugradnje** vjerodajnica
upućuje na bilo koji OpenAI-kompatibilni endpoint za ugradnje — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together ili hostani gateway — i imenuje vektorsko
spremište u koje se zapisuje.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `embedding_base_url` | URL endpointa uključujući `/v1` putanju, npr. `http://localhost:11434/v1` |
| `embedding_api_key` | Opcionalno. Lokalni poslužitelji obično ne trebaju ključ |
| `embedding_model` | Ime modela kako ga endpoint očekuje, npr. `nomic-embed-text` |
| `embedding_dimensions` | Širina vektora koju model vraća (zadano `1536`) |
| `embedding_request_dimensions` | Opcionalno. Zatražite od endpointa da vrati `embedding_dimensions` umjesto izvorne širine modela |
| `db_type` | `qdrant` ili `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant veza, obavezna kada je `db_type` `qdrant` |

### Napomene

- **Qdrant prihvaća bilo koji broj dimenzija.** Svaka kolekcija se stvara na širini koju
  ova vjerodajnica deklarira, tako da je polje Dimenzije slobodno uređivo.
- **Postgres (pgvector) zahtijeva točno 1536 dimenzija.** Njegov stupac je fiksni
  `vector(1536)`, tako da je polje Dimenzije fiksirano na 1536, a vjerodajnica koja
  deklarira bilo koju drugu širinu odbija se prilikom spremanja.
- **Smanjenje za pgvector.** Kada je spremište Postgres, dijalog nudi *Zatraži
  od endpointa da vrati 1536 dimenzija*. Ovo šalje `dimensions` parametar zahtjeva,
  koji modeli obučeni s Matryoshka reprezentacijama (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` i slični) poštuju vraćanjem skraćenog,
  još uvijek smislenog vektora. Endpoints koji ne podržavaju parametar odbijaju
  zahtjev, a endpoints koji ga prihvaćaju ali ignoriraju proizvode jasnu grešku
  koja navodi širinu koja je zapravo vraćena. Heym nikada ne skraćuje vektore sam,
  jer rezanje izlaza modela koji nije Matryoshka tiho degradira kvalitetu pretraživanja. Opcija se ne nudi za Qdrant, koji može prilagoditi kolekciju bilo kojoj širini.
- Koristite **Testiraj vezu** u dijalogu vjerodajnica za umetanje probnog niza i
  provjeru širine koju model zapravo vraća prije nego što kreirate spremište.
- Parametar zahtjeva `dimensions` šalje se samo OpenAI-u, budući da većina
  OpenAI-kompatibilnih poslužitelja odbija nepoznate parametre. Izvorna širina modela
  validira se prema vjerodajnici.
- Postojeće **RAG: Qdrant + OpenAI** i **RAG: Psql + OpenAI** vjerodajnice
  ostaju nepromijenjene i nastavljaju raditi.

### Koristi

- [RAG čvor](../nodes/rag-node.md) (putem vektorskog spremišta)
- [Vektorska spremišta](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym također može pohranjivati vektore **unutar vlastite Postgres baze podataka**
koristeći [pgvector](https://github.com/pgvector/pgvector) ekstenziju — nije potreban
vanjski vektorski servis. Kreirajte **RAG: Psql + OpenAI** vjerodajnicu i koristite je
prilikom kreiranja vektorskog spremišta, zatim odaberite **Postgres (pgvector)** u
dropdownu Baze podataka RAG čvora.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `openai_api_key` | OpenAI API ključ koji se koristi za generiranje ugradnji prilikom indeksiranja i pretraživanja dokumenata |

### Napomene

- Nema potrebe za hostom/portom — vektori se zapisuje u Heym-ovu vlastitu bazu podataka; Heym nikada ne povezuje na drugu bazu podataka.
- Sve RAG značajke dostupne s Qdrantom (umetanje, pretraživanje, filtri metapodataka, Cohere ponovna rangiranja, kloniranje, dijeljenje) rade identično s Postgres backendom.
- Potrebna je `vector` ekstenzija. Heym održava službenu `postgres:16` sliku nepromijenjenom (tako da postojeći podaci nikada nisu dodirnuti) i **automatski instalira `postgresql-16-pgvector` paket pri pokretanju** — `run.sh`, `deploy.sh` i `run_e2e.sh` svi to obrađuju. Instalacija nije fatalna: ako se ne može izvršiti (npr. nema mreže), Qdrant RAG nastavlja raditi, a Postgres backend ostaje neaktivan (migracija se bez problema preskoči).
- Ako pokrenete objavljenu sliku s jednim kontejnerom (`ghcr.io/heymrun/heym`) protiv **Vašeg vlastitog vanjskog Postgres**, ta baza podataka mora podržavati `vector` ekstenziju (Heym je ne može instalirati u bazu podataka koju ne upravlja). Bez nje, kreiranje ili učitavanje u Postgres vektorsko spremište vraća jasnu poruku, a Qdrant RAG nastavlja raditi.

### Koristi

- [RAG čvor](../nodes/rag-node.md) (putem vektorskog spremišta)
- [Vektorska spremišta](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) je hibrid između proračunske tablice i baze podataka koji podržava strukturirane podatke i formule. Grist vjerodajnica omogućuje Heym-u da čita i piše Grist dokumente.
### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `api_key` | Grist API ključ (pronađen u **Profil → API ključ** na Vašoj Grist instanci) |
| `server_url` | Osnovna URL adresa Vašeg Grist poslužitelja (npr. `https://docs.getgrist.com` za Grist Cloud, ili Vaša samostalno hostana URL adresa) |

### Napomene

- [Grist čvor](../nodes/grist-node.md) zahtijeva **ID dokumenta** (iz URL-a Grist dokumenta) i **ID tablice** u svojoj konfiguraciji — ovo nije dio vjerodajnice.
- Za samostalno hostani Grist, postavite `server_url` na domenu Vaše instance.
- ID-ovi stupaca u Gristu koriste donje crte (npr. `User_Name`), a ne prikazane oznake. Koristite operaciju `listColumns` za njihovo otkrivanje.

### Koristi

- [Grist čvor](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Vjerodajnica za Google Sheets povezuje Heym s Google Sheets API-jem koristeći OAuth2 model "Donosite svoju aplikaciju". Vi pružate Google Cloud OAuth2 Client ID i Client Secret, a zatim autorizirate pristup putem iskačućeg prozora preglednika. Tokeni se automatski osvježavaju u pozadini.

### Postavljanje

1. Otvorite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pretražite i omogućite **Google Sheets API**.
2. Idite na **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopirajte generirani **Client ID** i **Client Secret**.
5. U Heym Dashboard → **Credentials** → **New** → upišite **Google Sheets (OAuth2)**.
6. Unesite Client ID, Client Secret i naziv, a zatim kliknite **Connect** da otvorite Google prozor za suglasnost i autorizirate pristup.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se pohranjuju i automatski osvježavaju — ne upravljate njima izravno.

### Napomene

- Ekran suglasnosti OAuth2 zahtijeva opseg za proračunske tablice (`https://www.googleapis.com/auth/spreadsheets`).
- Heym koristi refresh token za dobivanje novih access tokena prije nego što isteknu (60-sekundna sigurnosna margina).
- Ako promijenite Client Secret u Google Cloud Console, ponovno povežite vjerodajnicu putem gumba **Connect**.
- **Proizvodnja:** Postavite backend **`FRONTEND_URL`** na točnu javnu URL adresu koju korisnici otvaraju u pregledniku (shema + host, npr. `https://heym.example.com`). Heym gradi Google OAuth redirect URI samo iz ove vrijednosti — ne vjeruje `Origin` ili `X-Forwarded-*` zaglavljima (koja kontrolira klijent). Registrirajte `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` u Google Cloud Console.

### Koristi

- [Google Sheets čvor](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Vjerodajnica za Google Drive povezuje Heym s Google Drive API-jem koristeći isti OAuth2 model "Donosite svoju aplikaciju" kao i Google Sheets. Vi pružate Google Cloud OAuth2 Client ID i Client Secret, a zatim autorizirate pristup putem iskačućeg prozora preglednika. Tokeni se automatski osvježavaju u pozadini.

### Postavljanje

1. Otvorite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pretražite i omogućite **Google Drive API**.
2. Idite na **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopirajte generirani **Client ID** i **Client Secret**.
5. U Heym Dashboard → **Credentials** → **New** → upišite **Google Drive (OAuth2)**.
6. Unesite Client ID, Client Secret i naziv, a zatim kliknite **Connect** da otvorite Google prozor za suglasnost i autorizirate pristup.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se pohranjuju i automatski osvježavaju — ne upravljate njima izravno.

### Opseg

Google Drive zahtijeva **punu Drive dozvolu** (`https://www.googleapis.com/auth/drive`).

To je potrebno jer čvor djeluje na datotekama koje već posjedujete. Uži opseg `drive.file` daje pristup samo datotekama koje je sama OAuth klijent stvorio, što bi značilo da `listFolderFiles`, `updateFile`, `removeFile` i `removeFolder` ne bi vidjeli ništa od Vašeg postojećeg Drive-a.

Budući da Vi pružate vlastiti Client ID i Secret iz vlastitog Google Cloud projekta, zahtjevi za verifikaciju Google aplikacije za ovaj opseg primjenjuju se na Vaš projekt, a ne na Heym.

### Napomene

- Heym koristi refresh token za dobivanje novih access tokena prije nego što isteknu (60-sekundna sigurnosna margina).
- Ako promijenite Client Secret u Google Cloud Console, ponovno povežite vjerodajnicu putem gumba **Connect**.
- Dijeljeni pogoni su podržani — čvor postavlja `supportsAllDrives` na svaki API poziv.
- **Proizvodnja:** Postavite backend **`FRONTEND_URL`** na točnu javnu URL adresu koju korisnici otvaraju u pregledniku. Heym gradi Google OAuth redirect URI samo iz ove vrijednosti — ne vjeruje `Origin` ili `X-Forwarded-*` zaglavljima. Registrirajte `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` u Google Cloud Console.
- Pogledajte [Dijeljenje vjerodajnica](./credentials-sharing.md) prije dijeljenja ove vjerodajnice s timom.

### Koristi

- [Google Drive čvor](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Vjerodajnica za BigQuery povezuje Heym s Google BigQuery API-jem koristeći OAuth2 model "Bring Your Own App". Vi dostavljate Google Cloud OAuth2 Client ID i Client Secret, a zatim autorizirate pristup putem iskačućeg prozora u pregledniku. Tokeni se automatski osvježavaju u pozadini.

### Postavljanje

1. Otvorite [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → pretražite i omogućite **BigQuery API**.
2. Idite na **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplikacije **Web application**.
3. Pod **Authorized redirect URIs** dodajte: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopirajte generirani **Client ID** i **Client Secret**.
5. U Heym Dashboard → **Credentials** → **New** → upišite **BigQuery (OAuth2)**.
6. Unesite Client ID, Client Secret i naziv, a zatim kliknite **Connect** kako biste otvorili Google prozor za suglasnost i autorizirali pristup.

### Obavezna polja

| Polje | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID iz Google Cloud Console |
| `client_secret` | OAuth2 Client Secret iz Google Cloud Console |

Tokeni (`access_token`, `refresh_token`, `token_expiry`) se pohranjuju i automatski osvježavaju.

### Napomene

- Ekran za suglasnost OAuth2 zahtijeva BigQuery opseg (`https://www.googleapis.com/auth/bigquery`).
- **Proizvodnja:** Postavite backend **`FRONTEND_URL`** na javnu URL adresu. Registrirajte `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` u Google Cloud Console.

### Koristi

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Vjerodajnica za Supabase povezuje Heym s PostgREST API-jem Supabase projekta kako bi workflows mogli upititi i mijenjati tablice temeljene na Postgresu.

### Obavezna polja

| Polje | Opis |
|-------|-------------|
| `supabase_url` | Osnovna URL adresa projekta, na primjer `https://your-project.supabase.co` |
| `supabase_key` | API ključ s pristupom ciljnim tablicama |
| `supabase_schema` | Opcionalni zadani shema (zadano `public`) |

### Napomene

- [Supabase node](../nodes/supabase-node.md) komunicira s `/rest/v1/<table>` i podržava operatore filtriranja (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` i povezane PostgREST operatore) te ugniježdene `or` / `and` logičke grupe.
- Za operacije pisanja, preporučuje se ključ namijenjen pouzdanoj upotrebi na strani poslužitelja s minimalnim potrebnim dozvolama za tablice.
- Čvorovi mogu nadjačati shemu po koraku čak i ako vjerodajnica definira zadanu shemu.

### Koristi

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

Vjerodajnica za ClickHouse povezuje Heym s vanjskom ClickHouse bazom podataka putem HTTP sučelja kako bi workflows mogli izvršavati SQL, CRUD i operacije brojanja protiv OLAP tablica.

### Obavezna polja

| Polje | Opis |
|-------|-------------|
| `host` | HTTP domaćin bez sheme, na primjer `your-instance.clickhouse.cloud` |
| `port` | Port HTTP sučelja (`8443` za HTTPS, `8123` za HTTP) |
| `username` | ClickHouse korisnik (zadano `default`) |
| `password` | Lozinka korisnika (opcionalno) |
| `database` | Ciljna baza podataka (zadano `default`) |
| `secure` | Koristite HTTPS kada je `true` (obavezno za ClickHouse Cloud) |

### Napomene

- [ClickHouse node](../nodes/clickhouse-node.md) koristi službeni `clickhouse-connect` HTTP klijent i parametarizira filtriranje i vezivanje vrijednosti.
- `update` i `remove` mapiraju se na `ALTER TABLE ... UPDATE` i `DELETE FROM`, što su asinkrone ClickHouse mutacije; obje zahtijevaju filtriranje.
- `upsert` izvršava `INSERT` i pretpostavlja `ReplacingMergeTree` tablicu za ponašanje spajanja po ključu.
- Koristite **Test connection** u dijalogu s vjerodajnicama za provjeru dostupnosti.

### Koristi

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Vjerodajnica za Notion podržava ili internu integracijsku oznaku ili javnu OAuth vezu. OAuth omogućuje svakom korisniku da autorizira Notion radni prostor iz Heyma umjesto da ručno kopira oznaku.

### Obavezna polja

| Način | Polje | Opis |
|------|-------|-------------|
| Interna oznaka | `api_token` | Interna integracijska oznaka (`ntn_...`) |
| OAuth | `client_id` | Client ID iz javne integracije Notion |
| OAuth | `client_secret` | Client Secret iz javne integracije Notion |

OAuth povratni poziv automatski pohranjuje `access_token`, `auth_mode`, `workspace_id`, `workspace_name` i `bot_id`. Svaka prethodna interna `api_token` se uklanja kada OAuth završi. Registrirajte ovu URI za preusmjeravanje u Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth postupak postavljanja

1. Odaberite **OAuth** u dijalogu s vjerodajnicama, unesite naziv, Client ID i Client Secret.
2. Kliknite **Connect** i autorizirajte radni prostor u Notion iskačućem prozoru.
   - Za **novu** vjerodajnicu, Heym stvara zapis vjerodajnice kada kliknete **Connect**.
   - Završite autorizaciju u iskačućem prozoru, a zatim kliknite **Save** da se vratite na popis vjerodajnica.
3. Povezana vjerodajnica prikazuje `connected (Naziv radnog prostora)` na popisu. Vjerodajnice koje čekaju OAuth prikazuju `Not connected` dok autorizacija ne završi.

Koristite **Test Connection** u dijalogu s vjerodajnicama za provjeru ili interne oznake ili dovršene OAuth autorizacije. Kada uređujete, ostavljanje polja za oznaku praznim čuva pohranjenu internu oznaku.

I interne oznake i OAuth pristupni tokeni dostupni su putem `$credentials.CredentialName` za prilagođene [HTTP](../nodes/http-node.md) pozive koji trebaju Notion bearer token.
### Napomene

- Interna integracija zahtijeva dijeljenje relevantnih stranica, baza podataka i izvora podataka.
- OAuth korisnici biraju radni prostor/stranice tijekom autorizacije u Notionu.
- Vjerodajnice OAuth aplikacije su šifrirane unutar Notion vjerodajnice. Povratni poziv ih ponovno učitava na strani poslužitelja; tajna nije ugrađena u OAuth stanje.
- Povezane OAuth vjerodajnice prikazuju naziv radnog prostora; čekajuće OAuth vjerodajnice prikazuju `Nije povezano` dok autorizacija ne završi.
- **Proizvodnja:** Postavite backend **`FRONTEND_URL`** na javnu URL adresu preglednika (shema + host, bez završnog kosa). Notion URI za preusmjeravanje mora se točno podudarati:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Čvor koristi API verziju `2026-03-11` i trenutnu terminologiju `data_source`. Pogledajte članak o [Notion čvoru](../nodes/notion-node.md#api-version-notes) za smjernice o migraciji s starijih `archived`, `after` ili primjera upita baza podataka.
- Stari filtri pretraživanja s objektom vrijednosti `database` normalizirani su na `data_source`.

### Koristi

- [Notion čvor](../nodes/notion-node.md)

---

## SMTP (Email)

SMTP vjerodajnica pohranjuje detalje veze s email poslužiteljem za slanje odlazne pošte.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `host` | SMTP poslužiteljski naziv (npr. `smtp.gmail.com`) |
| `port` | SMTP port (obično `587` za STARTTLS, `465` za SSL) |
| `email` | Korisničko ime kojim se SMTP poslužitelj prijavljuje; također vidljivi pošiljatelj kada je `from` prazno |
| `password` | SMTP lozinka ili App Password |

### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `from` (`smtp_from`) | Vidljiva adresa pošiljatelja (From). Ostavite prazno za slanje kao `email`. Poslužitelj se i dalje prijavljuje kao `email`, pa taj račun mora imati dopuštenje za slanje s ove adrese (u Gmailu, potvrđeni alias **Šalji poštu kao**). |

### Uobičajeni SMTP Pružatelji

| Pružatelj | Host | Port | Napomene |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Zahtijeva [App Password](https://support.google.com/accounts/answer/185833) (2FA mora biti omogućena) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Koristite vjerodajnice svog Microsoft računa |
| Mailgun | `smtp.mailgun.org` | `587` | Koristite Mailgun SMTP vjerodajnice iz postavki domene |
| SendGrid | `smtp.sendgrid.net` | `587` | Koristite `apikey` kao korisničko ime i API ključ kao lozinku |
| Prilagođeno / Samo-hostano | vaša domena | `587` / `465` | Postfix, Exim, itd. |

### Napomene

- Gmail zahtijeva **App Password** umjesto vaše redovne lozinke kada je omogućena dvofaktorska provjera.
- Port `587` koristi STARTTLS (zapocinje u običnom tekstu, nadogradnja na TLS). Port `465` koristi implicitni TLS (SSL od samog početka).

### Koristi

- [Send Email čvor](../nodes/send-email-node.md)

---

## IMAP (Ulazna E-pošta)

IMAP vjerodajnica pohranjuje detalje veze za praćenje ulazne pošte s [IMAP Trigger čvora](../nodes/imap-trigger-node.md).

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `imap_host` | IMAP poslužiteljski naziv (na primjer `imap.gmail.com`) |
| `imap_port` | IMAP port (`993` za SSL/TLS kod većine pružatelja) |
| `imap_username` | Korisničko ime poštanskog sandučića ili puna adresa e-pošte |
| `imap_password` | Lozinka ili lozinka specifična za pružatelja |

### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `imap_mailbox` | Folder poštanskog sandučića za praćenje (zadano: `INBOX`) |
| `imap_use_ssl` | Omogućite SSL/TLS (preporučeno; zadano: `true`) |

### Napomene

- IMAP trigger postavlja trenutni poštanski sandučić pri prvom pretraživanju i zatim obrađuje samo noviju e-poštu.
- Gmail, Microsoft 365 i drugi hostani pružatelji često zahtijevaju **app password** ili sličnu tajnu specifičnu za IMAP.
- Sadržaj privitaka se ne preuzima u payload workflow-a; Heym izlaže samo metapodatke privitaka.

### Koristi

- [IMAP Trigger čvor](../nodes/imap-trigger-node.md)
- [Okidači](./triggers.md) (IMAP kao okidač workflow-a)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) je open-source posrednik poruka. RabbitMQ vjerodajnica pohranjuje detalje veze za objavljivanje i konzumiranje iz redova i razmjena.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `rabbitmq_host` | AMQP URL veze (npr. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ korisničko ime (zadano: `guest`) |
| `rabbitmq_password` | RabbitMQ lozinka (zadano: `guest`) |

### Virtualni Hostovi

Za povezivanje na određeni virtualni host, uključite ga u `rabbitmq_host` URL:

```
amqp://username:password@hostname:5672/vhost
```

Ako koristite zadani vhost, putanja `/` se može izostaviti.

### Plugin za Odgođene Poruke

[RabbitMQ čvor](../nodes/rabbitmq-node.md) podržava **rabbitmq_delayed_message_exchange** plugin. Kada je ovaj plugin omogućen na vašem RabbitMQ poslužitelju, možete postaviti odgodu (u milisekundama) na odlazne poruke koristeći `rabbitmqDelayMs` polje na čvoru.

Čvor postavlja `x-delay` zaglavlje na objavljenoj poruci. Tip razmjene mora biti `x-delayed-message` da bi odgode stupile na snagu.

Da biste omogućili plugin na samostalno hostanom RabbitMQ instance:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Kada plugin nije instaliran, `x-delay` zaglavlje se ignorira i poruke se isporučuju odmah.

### Koristi

- [RabbitMQ čvor](../nodes/rabbitmq-node.md)
- [Okidači](./triggers.md) (RabbitMQ kao okidač workflow-a)

---

## Amazon S3

Amazon S3 vjerodajnica povezuje Heym s [Amazon S3](https://aws.amazon.com/s3/). Koristite je s [Amazon S3 čvorom](../nodes/amazon-s3-node.md) za upravljanje spremnicima i mapama, učitavanje i preuzimanje objekata, kopiranje ključeva te popisivanje ili brisanje objekata iz workflow-a.
### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `aws_access_key_id` | AWS IAM pristupni ključ ID |
| `aws_secret_access_key` | Tajni pristupni ključ povezan s pristupnim ključem ID |
| `aws_region` | AWS regija u kojoj se nalaze bucketi (npr. `us-east-1`) |

### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `aws_session_token` | Privremeni sesijski token kada se koriste AWS STS vjerodajnice |

### Napomene

- Vjerodajnice koriste standardnu AWS SigV4 autentifikaciju putem boto3.
- Operacije prijenosa trenutno šalju UTF-8 tekstualni sadržaj; preuzimanja mogu vraćati tekst ili base64 za binarne objekte.

### Koristi

- [Amazon S3 čvor](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) je pohrana ključ-vrijednost u memoriji koja se koristi za keširanje i brzi pristup podacima.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `host` | Hostname ili IP adresa Redis poslužitelja (npr. `localhost`) |
| `port` | Redis port (zadano: `6379`) |
| `password` | Redis lozinka (ostavite prazno ako nije postavljena) |

### Koristi

- [Redis čvor](../nodes/redis-node.md)

---

## Slack

Vjerodajnice za Slack pohranjuju **Incoming Webhook URL** za slanje poruka u Slack kanale.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (iz konfiguracije vaše Slack aplikacije) |

### Napomene

- Kreirajte Incoming Webhook na [api.slack.com/apps](https://api.slack.com/apps) → vaša aplikacija → **Incoming Webhooks**.
- Svaki webhook je ograničen na određeni kanal. Kreirajte više vjerodajnica za različite kanale.

### Koristi

- [Slack čvor](../nodes/slack-node.md)

---

## Telegram

Vjerodajnice za Telegram pohranjuju **Bot Token** i opcionalni **Webhook Secret Token** za workflow-e temeljene na botovima.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `bot_token` | Telegram Bot API token iz BotFather-a |

### Opcionalna Polja

| Polje | Opis |
|-------|-------------|
| `secret_token` | Dijeljeni tajni ključ koji se provjerava protiv `x-telegram-bot-api-secret-token` na dolaznim webhook-ovima |

### Napomene

- Koristite iste vjerodajnice za [Telegram Trigger](../nodes/telegram-trigger-node.md) i [Telegram](../nodes/telegram-node.md).
- Ručno registrirajte webhook putem Telegramovog `setWebhook` API-ja koristeći URL prikazan u panelu Telegram Trigger čvora.
- `chatId` u Telegram čvoru može biti doslovni ID ili izraz poput `$telegramEvent.message.chat.id`.

### Koristi

- [Telegram Trigger čvor](../nodes/telegram-trigger-node.md)
- [Telegram čvor](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Ove vjerodajnice koristi [HTTP čvor](../nodes/http-node.md) za autentifikaciju odlaznih zahtjeva.

### Bearer

Pridružuje `Authorization: Bearer <token>` zaglavlje HTTP zahtjevima.

| Polje | Opis |
|-------|-------------|
| `token` | Vrijednost bearer tokena |

### Header

Pridružuje prilagođeno zaglavlje HTTP zahtjevima.

| Polje | Opis |
|-------|-------------|
| `header_key` | Ime zaglavlja (npr. `X-Api-Key`) |
| `header_value` | Vrijednost zaglavlja |

Oba tipa također se mogu referencirati putem `$credentials.CredentialName` u [Expression DSL](./expression-dsl.md) za dinamičku upotrebu u bilo kojem čvoru koji prihvaća izraze.

### Koristi

- [HTTP čvor](../nodes/http-node.md)

---

## LLM Pružatelji (OpenAI, Google, Prilagođeno, Cohere)

Ove vjerodajnice pokreću AI čvorove.

| Tip | Opis |
|------|-------------|
| **OpenAI** | API ključ za GPT modele i OpenAI ugradnje |
| **Google** | API ključ za Gemini modele |
| **Prilagođeno** | API ključ + osnovni URL za OpenAI-kompatibilne krajnje točke (Ollama, vLLM, LM Studio itd.) |
| **Cohere** | API ključ za Cohere ugradnje |

### OpenAI Prompt Caching

OpenAI automatski kešira statični (nepromjenjivi) prefiks vašeg sistemskog prompta — nije potrebna dodatna konfiguracija. Ponovljeni radovi koji dijele isti prefiks sistemskog prompta koriste prednosti keširanja cijena tokena, što smanjuje troškove i latenciju. Ovo je posebno korisno kada imate duge, fiksne upute, a samo se korisnička poruka mijenja između radova. Pratite stope pogodaka u kešu i uštede tokena na [Traces tabu](../tabs/traces-tab.md) ili na OpenAI nadzornoj ploči za korištenje kako biste optimizirali strukturu svog prompta za maksimalnu ponovnu upotrebu keša.

### Koristi

- [LLM čvor](../nodes/llm-node.md)
- [Agent čvor](../nodes/agent-node.md)
- [RAG čvor](../nodes/rag-node.md) (OpenAI ugradnje putem Qdrant vjerodajnice)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) je proxy poslužitelj za zaobilaženje Cloudflare-a i sličnih izazova zaštite od botova.

### Obavezna Polja

| Polje | Opis |
|-------|-------------|
| `flaresolverr_url` | URL vaše FlareSolverr instance (npr. `http://localhost:8191`) |

Loopback i privatne adrese su ovdje podržane, tako da pokretanje FlareSolverr-a pored Heym-a funkcionira kako je dokumentirano. URL možda neće rješavati na link-lokalnu ili cloud-metadata adresu. Budući da su privatne adrese dopuštene, ovo polje se također može usmjeriti na drugu internu uslugu, a odgovor se vraća u izlazu čvora. Svaki prijavljeni korisnik može kreirati ovu vjerodajnicu, tako da je granica tko može autorirati workflow-e plus vaša mrežna pravila, a ne dijeljenje vjerodajnica. Pogledajte [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Koristi

- [Crawler čvor](../nodes/crawler-node.md)
## Povezano

- [Vjerodajnice](./credentials.md) – Pregled vjerodajnica i kako ih čvorovi koriste
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Dodavanje i upravljanje vjerodajnicama
- [Dijeljenje Vjerodajnica](./credentials-sharing.md) – Dijelite vjerodajnice s korisnicima i timovima
- [Sigurnost](./security.md) – Enkripcija u mirovanju, kontrola pristupa
- [Expression DSL](./expression-dsl.md) – `$credentials` sintaksa za dinamički pristup

---

## Model Router (Auto Model)

Usmjerava svaki zahtjev na jednu od vaših postojećih model vjerodajnica, koristeći model odluke za odabir. Pohranjuje reference, nikada vlastiti ključ.

### Obavezna Polja

- `decision_credential_id` – **Decision Model** vjerodajnica kojoj možete pristupiti.
- `decision_model` – model koji donosi odluku o usmjeravanju, na primjer `jev-latest`.
- `options` – najmanje dva unosa, svaki s imenom, jednom od vaših OpenAI/Google/Custom vjerodajnica, modelom na njemu i kriterijima koji govore kada bi trebao pobijediti.

### Opcionalna Polja

- `routing_instructions` – kako ukupno ocijeniti opcije.
- Jedna opcija može biti označena kao rezervna koja se koristi kada usmjeravanje ne uspije.

### Napomene

Imena opcija su ono između čega model odluke bira, stoga moraju biti različita. Opcija ne može upućivati na drugi Model Router.
