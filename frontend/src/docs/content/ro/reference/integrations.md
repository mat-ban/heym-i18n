# Integrări terțe

Heym se conectează la servicii externe prin intermediul **acreditărilor**. Fiecare tip de acreditare stochează detaliile de conexiune pentru un serviciu și poate fi reutilizată în mai multe noduri și workflow-uri. Consultați [Acreditări](./credentials.md) pentru o prezentare generală.

Adăugați acreditări în [Setări → Acreditări](../tabs/credentials-tab.md). Toate valorile sunt criptate în repaus. Acreditările pot fi [partajate](./credentials-sharing.md) cu alți utilizatori sau cu [Echipe](./teams.md).

Unele noduri de integrare **nu** necesită acreditări. [WebSocket Trigger](../nodes/websocket-trigger-node.md) și [WebSocket Send](../nodes/websocket-send-node.md) se conectează la socket-uri externe folosind URL-ul, anteturile și subprotocoalele configurate direct pe nod.

## Tipuri de acreditări pe scurt

| Tip | Utilizat de | Câmpuri cheie |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opțional `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opțional `base_url` |
| **Jira** | [Nodul Jira](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (doar autentificare Basic), opțional `api_version` |
| **Linear** | [Nodul Linear](../nodes/linear-node.md) | `api_key`, sau `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Nodul Sentry](../nodes/sentry-node.md) | `api_token`, opțional `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluare](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, opțional `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | o acreditare de tip decision model, plus opțiuni de model care fac referire la celelalte acreditări ale dvs. |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Depozite vectoriale | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Depozite vectoriale | `openai_api_key` (vectorii sunt stocați în Postgres-ul propriu al Heym prin pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Depozite vectoriale | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opțional `embedding_api_key`, plus `qdrant_host` când `db_type` este `qdrant` |
| **Grist** | [Nodul Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Nodul Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consimțământ OAuth2 |
| **Google Drive** | [Nodul Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consimțământ OAuth2 (domeniu complet Drive) |
| **BigQuery** | [Nodul BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consimțământ OAuth2 |
| **Supabase** | [Nodul Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opțional `supabase_schema` |
| **ClickHouse** | [Nodul ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Nodul Notion](../nodes/notion-node.md) | `api_token`, sau `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Nodul Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Nodul IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Nodul Telegram Trigger](../nodes/telegram-trigger-node.md), [Nodul Telegram](../nodes/telegram-node.md) | `bot_token`, opțional `secret_token` |
| **Discord** | [Nodul Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Nodul Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Nodul RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Nodul Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Nodul Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Nodul Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Nodul HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Nodul HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Nodul Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Acreditarea GitHub stochează un token de acces personal GitHub (PAT) astfel încât workflow-urile să poată apela API-ul REST GitHub prin [Nodul GitHub](../nodes/github-node.md), să transmită token-ul către servere MCP precum `@modelcontextprotocol/server-github` sau să îl utilizeze din [Nodul HTTP](../nodes/http-node.md) pentru apeluri REST personalizate.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `api_key` | Token de acces personal GitHub (PAT cu granularitate fină `github_pat_...` sau PAT clasic `ghp_...`) |
### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `base_url` | URL-ul de bază al API-ului GitHub pentru GitHub Enterprise Server (de exemplu `https://github.example.com/api/v3`) |

### Note

- Token-urile de acces personal cu granularitate fină sunt recomandate atunci când este posibil, deoarece pot fi limitate la depozite și permisiuni specifice.
- Lăsați `base_url` gol pentru GitHub.com. Pentru GitHub Enterprise Server, utilizați endpoint-ul complet al API-ului REST
  incluzând `/api/v3` (de exemplu `https://github.example.com/api/v3`), nu rădăcina interfeței web
  a serverului, precum `https://github.example.com`.
- Această acreditare modelează în prezent doar autentificarea bazată pe PAT. Pentru a accesa depozitele organizației, utilizați un PAT căruia i-au fost acordate permisiunile necesare la nivel de organizație/depozit.
- Token-urile de instalare GitHub App și fluxurile de configurare GitHub App nu sunt de prim rang în interfața Heym în prezent.
- Preferați [nodul GitHub](../nodes/github-node.md) pentru operațiuni native asupra depozitelor, utilizatorilor, problemelor, pull request-urilor, recenziilor, versiunilor, workflow-urilor Actions, traficului și fișierelor. Utilizați [nodul HTTP](../nodes/http-node.md) doar atunci când aveți nevoie de endpoint-uri sau payload-uri pe care nodul GitHub nu le acoperă.
- Utilizați [nodul Agent](../nodes/agent-node.md) cu MCP prin transmiterea `$credentials.YourGitHubCredential` într-o variabilă de mediu de conexiune MCP, precum `GITHUB_PERSONAL_ACCESS_TOKEN`.
- API-ul REST al GitHub așteaptă în mod obișnuit `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- La editarea unei acreditări GitHub, lăsarea `base_url` pentru GitHub Enterprise gol păstrează
  endpoint-ul existent. Introduceți o nouă adresă URL doar atunci când doriți să modificați acel endpoint.

### Utilizat de

- [Nodul GitHub](../nodes/github-node.md)
- [Nodul Codex](../nodes/codex-node.md)
- [Nodul Agent](../nodes/agent-node.md)
- [Nodul HTTP](../nodes/http-node.md)

---

## Model de decizie

Un model de decizie răspunde la întrebări tipizate despre o stare și returnează probabilități în loc de text. Jev de la TypeSafe este implementarea de referință; orice endpoint care acceptă același corp `{model, state, questions}` funcționează, iar nodul [Decision](../nodes/decision-node.md) poate trimite un corp scris manual pentru unul care nu o face.

### Câmpuri obligatorii

- `base_url` – endpoint-ul, de exemplu `https://api.typesafe.ai`. Heym adaugă `/v1/systemone`.

### Câmpuri opționale

- `api_key` – trimis ca `Authorization: Bearer`. Endpoint-urile care nu necesită o cheie pot lăsa acest câmp gol.

### Note

- **Test Connection** trimite o întrebare minusculă pentru a confirma că endpoint-ul și cheia funcționează.
- Editarea unei acreditări păstrează cheia stocată atunci când câmpul cheii este lăsat gol.
- Cererile de ieșire către adrese private și de loopback sunt blocate în mod implicit, astfel încât un endpoint auto-găzduit pe `localhost` sau într-un interval privat necesită `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Aceste modele sunt absente din tabelele de prețuri LLM pe care Heym le sincronizează, astfel încât coloana Cost din [Execuții](../tabs/traces-tab.md) rămâne goală. Numărătorile de token-uri sunt totuși înregistrate.

### Utilizat de

- [Decision](../nodes/decision-node.md)
- [Evaluare](../tabs/evals-tab.md) – punctează răspunsurile `LLM-as-Judge` față de rezultatul așteptat

## OpenAI Codex

Acreditarea OpenAI Codex autentifică [nodul Codex](../nodes/codex-node.md). Este separată de acreditarea cheii API OpenAI utilizată de nodurile LLM, Agent și RAG.

### Moduri de autentificare

| Mod | Descriere |
|------|-------------|
| **Sign in with ChatGPT** (recomandat) | Autentificare OAuth (PKCE) care utilizează abonamentul dvs. ChatGPT Plus/Pro, astfel încât execuțiile evită costurile API per token. Heym stochează și reîmprospătează automat pachetul de token-uri. |
| **Access token** | Un `access_token` ChatGPT/Codex transmis doar procesului local Codex CLI. |

### Note

- Cheile API sunt respinse pentru acest tip de acreditare.
- Token-urile Codex nu sunt expuse prin `$credentials.Name`.
- Nodul Codex necesită, de asemenea, o acreditare GitHub pentru clonarea depozitului, trimiterea ramurilor și crearea de pull request-uri draft.

### Utilizat de

- [Nodul Codex](../nodes/codex-node.md)

## OpenCode Go

Acreditarea OpenCode Go autentifică [nodul OpenCode Go](../nodes/opencode-go-node.md). Aceasta stochează o cheie API a gateway-ului OpenCode Go (de la [opencode.ai/go](https://opencode.ai/go)) și o adresă URL de bază opțională a gateway-ului.

### Câmpuri

| Câmp | Descriere |
|-------|-------------|
| **API Key** | Cheia API a gateway-ului OpenCode Go (obligatorie). |
| **Gateway Base URL** | Opțional; implicit `https://opencode.ai/zen/go/v1`. Suprascrieți doar pentru un gateway auto-găzduit sau proxy. |

### Note

- Cheia API este transmisă doar procesului OpenCode CLI din interiorul unui container securizat.
- Nodul OpenCode Go necesită, de asemenea, o acreditare GitHub pentru clonarea depozitului, trimiterea ramurilor și crearea de pull request-uri. Token-ul GitHub nu este niciodată plasat în interiorul containerului sandbox.

### Utilizat de

- [Nodul OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Acreditarea Linear acceptă fie o cheie API personală, fie OAuth2 pentru
[nodul Linear](../nodes/linear-node.md). Heym trimite interogări GraphQL native către Linear pentru metadatele spațiului de lucru,
proiecte, probleme și comentarii.
### Configurare

Alegeți un mod de autentificare:

**Cheie API personală**

1. În Linear, deschideți **Settings → Security & Access → Personal API keys**.
2. Creați o cheie cu acces la workspace-ul pe care doriți să îl automatizați.
3. Lipiți cheia într-o acreditare Linear în Heym și utilizați **Test Connection** pentru a o verifica.

**OAuth2**

1. Creați o aplicație Linear OAuth.
2. Înregistrați `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ca URI de redirecționare.
3. În Heym Dashboard → **Credentials** → **New** → tip **Linear**.
4. Alegeți **OAuth2**, introduceți Client ID și Client Secret, apoi faceți clic pe **Connect**.

### Câmpuri obligatorii

| Mod | Câmp | Descriere |
|------|-------|-------------|
| Cheie API personală | `api_key` | Cheie API personală Linear, de obicei prefixată cu `lin_api_` |
| OAuth2 | `client_id` | Client ID din aplicația Linear OAuth |
| OAuth2 | `client_secret` | Client Secret din aplicația Linear OAuth |

Token-urile OAuth (`access_token`, `refresh_token`, `token_expiry`) sunt stocate și reîmprospătate automat.

### Note

- Cheile API personale și token-urile OAuth acționează ca utilizatorul Linear care le-a creat sau autorizat.
- Linear OAuth utilizează scope-urile `read,write,issues:create,comments:create`.
- Utilizați **Test Connection** în dialogul de acreditare pentru a verifica cheia API sau token-ul OAuth împotriva API-ului Linear.
- Utilizați List Teams și List Projects în nodul Linear pentru a descoperi UUID-urile înainte de a crea sau filtra probleme.
- Utilizați List Workflow States și List Team Members pentru a descoperi UUID-urile de stare și de persoană atribuită pentru actualizări.
- Rotați o cheie API editând acreditarea și introducând valoarea de înlocuire. Dacă rotiți secretele aplicației OAuth, reconectați acreditarea prin **Connect**.

### Utilizat de

- [Nodul Linear](../nodes/linear-node.md)

---

## Jira

Acreditarea Jira stochează acreditările Jira Basic auth sau un token de acces personal Data Center, URL-ul de bază al site-ului Jira, modul de implementare și versiunea opțională a API-ului REST pentru [nodul Jira](../nodes/jira-node.md). Utilizați `cloud` pentru Jira Cloud sau `data_center` pentru Jira Data Center / Server.

### Configurare

**Jira Cloud**

1. În setările contului Atlassian, creați un token API.
2. În Heym Dashboard → **Credentials** → **New** → tip **Jira**.
3. Introduceți email-ul Atlassian, token-ul API și URL-ul site-ului Jira, cum ar fi `https://your-domain.atlassian.net`.
4. Utilizați **Test Connection** pentru a verifica acreditarea.

**Jira Data Center / Server**

1. Selectați **Jira Data Center / Server** ca implementare.
2. Alegeți o metodă de autentificare. **Nume de utilizator și parolă** utilizează autentificarea Basic. **Personal Access Token** utilizează `Authorization: Bearer <token>` și necesită Jira Data Center / Server 8.14 sau o versiune ulterioară. Creați tokenul în **Profil → Personal Access Tokens** în Jira.
3. Introduceți numele de utilizator și parola Jira sau inserați tokenul de acces personal (nu este necesar un nume de utilizator).
4. Introduceți URL-ul site-ului Jira, de exemplu `https://jira.example.com`.
5. Utilizați **Test Connection** pentru a verifica acreditarea.

### Câmpuri

| Câmp | Descriere |
| --- | --- |
| `auth_mode` | `basic` (implicit dacă lipsește) sau `pat`. `pat` este valid numai cu `data_center` |
| `email` | E-mailul contului Atlassian Jira Cloud sau numele de utilizator Jira Data Center / Server. Neutilizat în modul `pat` |
| `api_token` | Tokenul de API Atlassian Jira Cloud, parola Jira Data Center / Server pentru autentificarea Basic sau tokenul de acces personal Data Center în modul `pat` |
| `base_url` | URL-ul de bază al site-ului Jira |
| `deployment` | `cloud` pentru Jira Cloud sau `data_center` pentru Jira Data Center / Server |
| `api_version` | Versiunea API-ului REST; implicit `3` pentru Jira Cloud. Data Center / Server utilizează v2 |

### Note

- Nodul Jira trimite descrierile problemelor și comentariile ca documente text în format Atlassian Document Format pentru Jira Cloud REST API v3. Acreditările Data Center / Server trimit text simplu.
- Data Center / Server acceptă autentificarea Basic prin nume de utilizator/parolă și autentificarea cu token de acces personal (PAT) folosind schema Bearer. Autentificarea PAT necesită Jira Data Center / Server 8.14 sau o versiune ulterioară.
- Încărcarea atașamentelor acceptă conținut base64 sau data URL și este supusă limitei de dimensiune a fișierului din platformă (implicit 99 MB). Descărcarea atașamentelor poate returna conținut base64 atunci când este activată.
- Crearea, ștergerea utilizatorilor și notificarea problemelor necesită ca contul Jira autentificat să aibă permisiunile relevante pentru site-ul sau organizația Jira.
- Utilizați List Projects, Search Issues și List Transitions pentru a descoperi cheile de proiect, cheile de probleme și ID-urile de tranziție.
- Pentru endpointuri personalizate care nu sunt acoperite de nodul Jira, utilizați [nodul HTTP](../nodes/http-node.md) cu Jira Basic Auth (`email:api_token` pentru Cloud sau `username:password` pentru Data Center / Server) sau PAT Bearer auth (`Authorization: Bearer <token>` pentru Data Center / Server). Alternativ, utilizați o acreditare Header cu antetul `Authorization` corespunzător.

Vezi și:

- [Nodul Jira](../nodes/jira-node.md)
- [Acreditări](./credentials.md)

---

## Sentry

Acreditarea Sentry stochează un token de autentificare pentru [nodul Sentry](../nodes/sentry-node.md). Heym utilizează API-ul REST al Sentry pentru operațiuni asupra organizațiilor, proiectelor, echipelor, problemelor, evenimentelor și versiunilor.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `api_token` | Token de autentificare Sentry cu acces la organizațiile și proiectele pe care le automatizați |

### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `base_url` | URL rădăcină opțional pentru Sentry self-hosted, de exemplu `https://sentry.example.com` |

### Note

- Lăsați `base_url` gol pentru Sentry SaaS.
- Utilizați **Test Connection** pentru a confirma că token-ul poate lista organizațiile vizibile.
- Pentru apeluri REST personalizate, utilizați `$credentials.YourSentryCredential` ca token bearer.

### Utilizat de

- [Nodul Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) este o bază de date vectorială open-source utilizată pentru căutare semantică și RAG (Retrieval Augmented Generation).

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `qdrant_host` | URL complet către instanța dvs. Qdrant (de ex. `http://localhost:6333` sau un endpoint cloud) |
| `openai_api_key` | Cheie API OpenAI utilizată pentru a genera embeddings la indexarea și căutarea documentelor |
### Note

- Colecțiile Qdrant sunt gestionate din fila [Depozite vectoriale](../tabs/vectorstores-tab.md). Fiecare depozit vectorial corespunde unei colecții Qdrant.
- [Nodul RAG](../nodes/rag-node.md) utilizează un depozit vectorial (care referențiază o acreditare Qdrant) — nu referențiază acreditarea direct.
- Dacă instanța dvs. Qdrant necesită o cheie API, includeți-o în valoarea `qdrant_host` sau configurați Qdrant în consecință; integrarea actuală nu dispune de un câmp separat pentru cheia API Qdrant.
- Qdrant găzduit local: utilizați [imaginea Docker oficială](https://hub.docker.com/r/qdrant/qdrant) și expuneți portul `6333`.

### Utilizat de

- [Nodul RAG](../nodes/rag-node.md) (prin intermediul depozitului vectorial)
- [Fila Depozite vectoriale](../tabs/vectorstores-tab.md)

## Embeddings personalizate (RAG)

În mod implicit, embeddings-urile RAG provin de la OpenAI. O acreditare **RAG: Custom Embeddings**
indică în schimb orice endpoint de embeddings compatibil cu OpenAI — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together sau un gateway găzduit — și specifică depozitul
vectorial în care scrie.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `embedding_base_url` | URL-ul endpoint-ului incluzând calea `/v1`, de ex. `http://localhost:11434/v1` |
| `embedding_api_key` | Opțional. Serverele locale de obicei nu necesită cheie |
| `embedding_model` | Numele modelului așa cum îl așteaptă endpoint-ul, de ex. `nomic-embed-text` |
| `embedding_dimensions` | Lățimea vectorului returnat de model (implicit `1536`) |
| `embedding_request_dimensions` | Opțional. Solicitați endpoint-ului să returneze `embedding_dimensions` în locul lățimii native a modelului |
| `db_type` | `qdrant` sau `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Conexiunea Qdrant, obligatorie când `db_type` este `qdrant` |

### Note

- **Qdrant acceptă orice număr de dimensiuni.** Fiecare colecție este creată la lățimea declarată
  de această acreditare, astfel încât câmpul Dimensions este liber editabil.
- **Postgres (pgvector) necesită exact 1536 de dimensiuni.** Coloana sa este un
  `vector(1536)` fix, astfel încât câmpul Dimensions este fixat la 1536, iar o acreditare care declară
  orice altă lățime este respinsă la salvare.
- **Scurtarea pentru pgvector.** Când depozitul este Postgres, dialogul oferă opțiunea *Ask the
  endpoint to return 1536 dimensions*. Aceasta trimite parametrul de cerere `dimensions`,
  pe care modelele antrenate cu reprezentări Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` și similare) îl respectă returnând un vector scurtat,
  dar încă semnificativ. Endpoint-urile care nu suportă parametrul resping cererea,
  iar endpoint-urile care îl acceptă dar îl ignoră produc o eroare clară care indică
  lățimea returnată efectiv. Heym nu trunchiază niciodată vectorii singur, deoarece secționarea
  rezultatului unui model non-Matryoshka degradează silențios calitatea regăsirii. Opțiunea nu este
  oferită pentru Qdrant, care poate dimensiona o colecție la orice lățime.
- Utilizați **Test Connection** în dialogul de acreditare pentru a genera un embedding pentru un șir de test și a vedea
  lățimea returnată efectiv de model înainte de a crea un depozit.
- Parametrul de cerere `dimensions` este trimis doar către OpenAI însuși, deoarece majoritatea
  serverelor compatibile cu OpenAI resping parametrii necunoscuți. Lățimea nativă a modelului este
  validată în schimb față de acreditare.
- Acreditările existente **RAG: Qdrant + OpenAI** și **RAG: Psql + OpenAI** sunt
  neschimbate și continuă să funcționeze.

### Utilizat de

- [Nodul RAG](../nodes/rag-node.md) (prin intermediul depozitului vectorial)
- [Fila Depozite vectoriale](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym poate stoca de asemenea vectori **în propria sa bază de date Postgres** folosind
extensia [pgvector](https://github.com/pgvector/pgvector) — nu este necesar niciun serviciu vectorial
extern. Creați o acreditare **RAG: Psql + OpenAI** și utilizați-o la crearea unui depozit
vectorial, apoi selectați **Postgres (pgvector)** în meniul derulant Database al nodului RAG.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `openai_api_key` | Cheia API OpenAI utilizată pentru a genera embeddings la indexarea și căutarea documentelor |

### Note

- Nu este necesar niciun host/port — vectorii sunt scriși în propria bază de date a Heym; Heym nu se conectează niciodată la o altă bază de date.
- Fiecare funcționalitate RAG disponibilă cu Qdrant (inserare, căutare, filtre de metadate, reranking Cohere, clonare, partajare) funcționează identic cu backend-ul Postgres.
- Necesită extensia `vector`. Heym păstrează imaginea oficială `postgres:16` neschimbată (astfel încât datele existente nu sunt niciodată afectate) și **instalează automat pachetul `postgresql-16-pgvector` la pornire** — `run.sh`, `deploy.sh` și `run_e2e.sh` gestionează toate acest lucru. Instalarea nu este fatală: dacă nu poate rula (de ex. fără rețea), RAG-ul Qdrant continuă să funcționeze, iar backend-ul Postgres rămâne inactiv (migrarea omite tabelul cu grație).
- Dacă rulați imaginea publicată într-un singur container (`ghcr.io/heymrun/heym`) împotriva **propriei baze de date Postgres externe**, acea bază de date trebuie să suporte extensia `vector` (Heym nu o poate instala într-o bază de date pe care nu o administrează). Fără aceasta, crearea sau încărcarea într-un depozit vectorial Postgres returnează un mesaj clar, iar RAG-ul Qdrant continuă să funcționeze.

### Utilizat de

- [Nodul RAG](../nodes/rag-node.md) (prin intermediul depozitului vectorial)
- [Fila Depozite vectoriale](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) este un hibrid de foaie de calcul și bază de date care suportă date structurate și formule. Acreditarea Grist permite Heym să citească și să scrie documente Grist.
### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `api_key` | Cheia API Grist (disponibilă în **Profile → API Key** pe instanța dvs. Grist) |
| `server_url` | URL-ul de bază al serverului dvs. Grist (de ex. `https://docs.getgrist.com` pentru Grist Cloud sau URL-ul instanței self-hosted) |

### Note

- [Nodul Grist](../nodes/grist-node.md) necesită **Document ID** (din URL-ul documentului Grist) și **Table ID** în configurația sa — acestea nu fac parte din acreditare.
- Pentru Grist self-hosted, setați `server_url` la domeniul instanței dvs.
- ID-urile coloanelor din Grist folosesc underscore (de ex. `User_Name`), nu etichetele afișate. Folosiți operația `listColumns` pentru a le descoperi.

### Utilizat de

- [Nodul Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Acreditarea Google Sheets conectează Heym la API-ul Google Sheets folosind un model OAuth2 „Bring Your Own App". Furnizați un Client ID și un Client Secret OAuth2 din Google Cloud, apoi autorizați accesul printr-un popup de browser. Token-urile sunt reînnoite automat în fundal.

### Configurare

1. Deschideți [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → căutați și activați **Google Sheets API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplicație **Web application**.
3. La **Authorized redirect URIs** adăugați: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copiați **Client ID** și **Client Secret** generate.
5. În Heym Dashboard → **Credentials** → **New** → tip **Google Sheets (OAuth2)**.
6. Introduceți Client ID, Client Secret și un nume, apoi faceți clic pe **Connect** pentru a deschide popup-ul de consimțământ Google și a autoriza accesul.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `client_id` | Client ID OAuth2 din Google Cloud Console |
| `client_secret` | Client Secret OAuth2 din Google Cloud Console |

Token-urile (`access_token`, `refresh_token`, `token_expiry`) sunt stocate și reînnoite automat — nu le gestionați direct.

### Note

- Ecranul de consimțământ OAuth2 necesită scope-ul spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym folosește refresh token-ul pentru a obține token-uri de acces noi înainte de expirare (buffer de siguranță de 60 de secunde).
- Dacă rotiți Client Secret în Google Cloud Console, reconectați acreditarea prin butonul **Connect**.
- **Producție:** Setați **`FRONTEND_URL`** în backend la URL-ul public exact pe care utilizatorii îl deschid în browser (schemă + host, de ex. `https://heym.example.com`). Heym construiește URI-ul de redirect Google OAuth exclusiv din această valoare — **nu** are încredere în antetele `Origin` sau `X-Forwarded-*` (controlate de client). Înregistrați `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` în Google Cloud Console.

### Utilizat de

- [Nodul Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Acreditarea Google Drive conectează Heym la API-ul Google Drive folosind același model OAuth2 „Bring Your Own App" ca la Google Sheets. Furnizați un Client ID și un Client Secret OAuth2 din Google Cloud, apoi autorizați accesul printr-un popup de browser. Token-urile sunt reînnoite automat în fundal.

### Configurare

1. Deschideți [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → căutați și activați **Google Drive API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplicație **Web application**.
3. La **Authorized redirect URIs** adăugați: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copiați **Client ID** și **Client Secret** generate.
5. În Heym Dashboard → **Credentials** → **New** → tip **Google Drive (OAuth2)**.
6. Introduceți Client ID, Client Secret și un nume, apoi faceți clic pe **Connect** pentru a deschide popup-ul de consimțământ Google și a autoriza accesul.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `client_id` | Client ID OAuth2 din Google Cloud Console |
| `client_secret` | Client Secret OAuth2 din Google Cloud Console |

Token-urile (`access_token`, `refresh_token`, `token_expiry`) sunt stocate și reînnoite automat — nu le gestionați direct.

### Scope

Google Drive solicită **scope-ul complet Drive** (`https://www.googleapis.com/auth/drive`).

Acest lucru este necesar deoarece nodul operează pe fișierele pe care le dețineți deja. Scope-ul mai restrâns `drive.file` acordă acces doar fișierelor create de clientul OAuth însuși, ceea ce ar face ca `listFolderFiles`, `updateFile`, `removeFile` și `removeFolder` să nu vadă nimic din Drive-ul dvs. existent.

Deoarece furnizați propriul Client ID și Client Secret din propriul proiect Google Cloud, cerințele de verificare a aplicației Google pentru acest scope se aplică proiectului dvs., nu Heym.

### Note

- Heym folosește refresh token-ul pentru a obține token-uri de acces noi înainte de expirare (buffer de siguranță de 60 de secunde).
- Dacă rotiți Client Secret în Google Cloud Console, reconectați acreditarea prin butonul **Connect**.
- Drive-urile partajate sunt acceptate — nodul setează `supportsAllDrives` la fiecare apel API.
- **Producție:** Setați **`FRONTEND_URL`** în backend la URL-ul public exact pe care utilizatorii îl deschid în browser. Heym construiește URI-ul de redirect Google OAuth exclusiv din această valoare — **nu** are încredere în antetele `Origin` sau `X-Forwarded-*`. Înregistrați `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` în Google Cloud Console.
- Consultați [Credential Sharing](./credentials-sharing.md) înainte de a partaja această acreditare cu o echipă.

### Utilizat de

- [Nodul Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Acreditarea BigQuery conectează Heym la API-ul Google BigQuery utilizând un model OAuth2 „Bring Your Own App". Furnizați un Client ID și un Client Secret OAuth2 din Google Cloud, apoi autorizați accesul printr-o fereastră popup în browser. Token-urile sunt reîmprospătate automat în fundal.

### Configurare

1. Deschideți [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → căutați și activați **BigQuery API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → tip aplicație **Web application**.
3. La **Authorized redirect URIs** adăugați: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copiați **Client ID** și **Client Secret** generate.
5. În Heym Dashboard → **Credentials** → **New** → tip **BigQuery (OAuth2)**.
6. Introduceți Client ID, Client Secret și un nume, apoi faceți clic pe **Connect** pentru a deschide fereastra popup de consimțământ Google și a autoriza accesul.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `client_id` | Client ID OAuth2 din Google Cloud Console |
| `client_secret` | Client Secret OAuth2 din Google Cloud Console |

Token-urile (`access_token`, `refresh_token`, `token_expiry`) sunt stocate și reîmprospătate automat.

### Note

- Ecranul de consimțământ OAuth2 necesită scope-ul BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Producție:** Setați **`FRONTEND_URL`** în backend la URL-ul public. Înregistrați `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` în Google Cloud Console.

### Utilizat de

- [Nodul BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Acreditarea Supabase conectează Heym la API-ul PostgREST al unui proiect Supabase, astfel încât workflow-urile să poată interoga și modifica tabelele bazate pe Postgres.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `supabase_url` | URL-ul de bază al proiectului, de exemplu `https://your-project.supabase.co` |
| `supabase_key` | Cheie API cu acces la tabelele țintă |
| `supabase_schema` | Schemă implicită opțională (implicit `public`) |

### Note

- [Nodul Supabase](../nodes/supabase-node.md) comunică cu `/rest/v1/<table>` și acceptă filtre cu operatori (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` și operatori PostgREST similari), precum și grupuri logice imbricate `or` / `and`.
- Pentru operațiunile de scriere, preferați o cheie destinată utilizării sigure pe partea de server, cu permisiunile minime necesare asupra tabelelor.
- Nodurile pot suprascrie schema pentru fiecare pas, chiar dacă acreditarea definește o schemă implicită.

### Utilizat de

- [Nodul Supabase](../nodes/supabase-node.md)

## ClickHouse

Acreditarea ClickHouse conectează Heym la o bază de date ClickHouse externă prin interfața sa HTTP, astfel încât workflow-urile să poată executa operațiuni SQL, CRUD și de numărare asupra tabelelor OLAP.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `host` | Gazdă HTTP fără schemă, de exemplu `your-instance.clickhouse.cloud` |
| `port` | Portul interfeței HTTP (`8443` pentru HTTPS, `8123` pentru HTTP) |
| `username` | Utilizator ClickHouse (implicit `default`) |
| `password` | Parola utilizatorului (opțională) |
| `database` | Baza de date țintă (implicit `default`) |
| `secure` | Utilizează HTTPS când este `true` (obligatoriu pentru ClickHouse Cloud) |

### Note

- [Nodul ClickHouse](../nodes/clickhouse-node.md) utilizează clientul HTTP oficial `clickhouse-connect` și parametrizează legăturile pentru filtre și valori.
- `update` și `remove` corespund operațiunilor `ALTER TABLE ... UPDATE` și `DELETE FROM`, care sunt mutații ClickHouse asincrone; ambele necesită un filtru.
- `upsert` efectuează un `INSERT` și presupune un tabel `ReplacingMergeTree` pentru comportamentul de merge-on-key.
- Utilizați **Test connection** în dialogul de acreditare pentru a verifica accesibilitatea.

### Utilizat de

- [Nodul ClickHouse](../nodes/clickhouse-node.md)

## Notion

Acreditarea Notion acceptă fie un token de integrare internă, fie o conexiune OAuth de integrare publică. OAuth permite fiecărui utilizator să autorizeze un workspace Notion din Heym, în loc să copieze manual un token.

### Câmpuri obligatorii

| Mod | Câmp | Descriere |
|------|-------|-------------|
| Token intern | `api_token` | Token de integrare internă (`ntn_...`) |
| OAuth | `client_id` | Client ID dintr-o integrare publică Notion |
| OAuth | `client_secret` | Client Secret din integrarea publică Notion |

Callback-ul OAuth stochează automat `access_token`, `auth_mode`, `workspace_id`, `workspace_name` și `bot_id`. Orice `api_token` intern anterior este eliminat la finalizarea OAuth. Înregistrați acest URI de redirecționare în Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Fluxul de configurare OAuth

1. Alegeți **OAuth** în dialogul de acreditare, introduceți un nume, Client ID și Client Secret.
2. Faceți clic pe **Connect** și autorizați workspace-ul în fereastra popup Notion.
   - Pentru o acreditare **nouă**, Heym creează înregistrarea acreditării când faceți clic pe **Connect**.
   - Finalizați autorizarea în fereastra popup, apoi faceți clic pe **Save** pentru a reveni la lista de acreditări.
3. O acreditare conectată afișează `connected (Workspace Name)` în listă. Acreditările OAuth în așteptare afișează `Not connected` până la finalizarea autorizării.

Utilizați **Test Connection** în dialogul de acreditare pentru a verifica fie un token intern, fie o autorizare OAuth finalizată. La editare, lăsarea câmpului de token gol păstrează token-ul intern stocat.

Atât token-urile interne, cât și token-urile de acces OAuth sunt disponibile prin `$credentials.CredentialName` pentru apeluri [HTTP](../nodes/http-node.md) personalizate care necesită un bearer token Notion.
### Note

- Integrările interne necesită partajarea paginilor, bazelor de date și surselor de date relevante.
- Utilizatorii OAuth aleg spațiul de lucru/paginile în timpul autorizării Notion.
- Acreditările aplicației OAuth sunt criptate în interiorul acreditării Notion. Callback-ul le reîncarcă pe partea de server; secretul nu este inclus în starea OAuth.
- Acreditările OAuth conectate afișează numele spațiului de lucru; acreditările OAuth în așteptare afișează `Not connected` până la finalizarea autorizării.
- **Producție:** Setați **`FRONTEND_URL`** în backend la URL-ul public al browserului (schemă + host, fără bară oblică finală). URI-ul de redirecționare Notion trebuie să corespundă exact:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Nodul utilizează versiunea API `2026-03-11` și terminologia curentă `data_source`. Consultați articolul [Nodul Notion](../nodes/notion-node.md#api-version-notes) pentru îndrumări privind migrarea de la exemplele mai vechi cu `archived`, `after` sau interogări de baze de date.
- Filtrele vechi de căutare cu valoarea obiectului `database` sunt normalizate la `data_source`.

### Utilizat de

- [Nodul Notion](../nodes/notion-node.md)

---

## SMTP (Email)

Acreditarea SMTP stochează detaliile de conectare la serverul de email pentru trimiterea de mesaje.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `host` | Numele de host al serverului SMTP (de ex. `smtp.gmail.com`) |
| `port` | Portul SMTP (de obicei `587` pentru STARTTLS, `465` pentru SSL) |
| `email` | Numele de utilizator cu care se autentifică serverul SMTP; de asemenea, expeditorul vizibil atunci când `from` este necompletat |
| `password` | Parola SMTP sau App Password |

### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `from` (`smtp_from`) | Adresa From vizibilă. Lăsați necompletat pentru a trimite ca `email`. Serverul se autentifică în continuare ca `email`, deci acel cont trebuie să aibă permisiunea de a trimite de pe această adresă (în Gmail, un alias verificat **Trimiteți e-mailuri ca**). |

### Furnizori SMTP comuni

| Furnizor | Host | Port | Note |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Necesită o [App Password](https://support.google.com/accounts/answer/185833) (2FA trebuie activat) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilizați acreditările contului Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilizați acreditările SMTP Mailgun din setările domeniului dvs. |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilizați `apikey` ca nume de utilizator și o cheie API ca parolă |
| Personalizat / Auto-găzduit | domeniul dvs. | `587` / `465` | Postfix, Exim etc. |

### Note

- Gmail necesită o **App Password** în locul parolei obișnuite atunci când verificarea în doi pași este activată.
- Portul `587` utilizează STARTTLS (începe în text simplu, trece la TLS). Portul `465` utilizează TLS implicit (SSL de la început).

### Utilizat de

- [Nodul Send Email](../nodes/send-email-node.md)

---

## IMAP (Email de intrare)

Acreditarea IMAP stochează detaliile de conectare pentru monitorizarea unei căsuțe poștale cu [Nodul IMAP Trigger](../nodes/imap-trigger-node.md).

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `imap_host` | Numele de host al serverului IMAP (de exemplu `imap.gmail.com`) |
| `imap_port` | Portul IMAP (`993` pentru SSL/TLS la majoritatea furnizorilor) |
| `imap_username` | Numele de utilizator al căsuței poștale sau adresa de email completă |
| `imap_password` | Parola sau parola de aplicație specifică furnizorului |

### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `imap_mailbox` | Folderul căsuței poștale de monitorizat (implicit: `INBOX`) |
| `imap_use_ssl` | Activează SSL/TLS (recomandat; implicit: `true`) |

### Note

- Trigger-ul IMAP stabilește linia de bază a căsuței poștale curente la prima verificare și apoi procesează doar emailurile mai noi.
- Gmail, Microsoft 365 și alți furnizori găzduiți necesită adesea o **parolă de aplicație** sau un secret similar specific IMAP.
- Conținutul atașamentelor nu este descărcat în payload-ul workflow-ului; Heym expune doar metadatele atașamentelor.

### Utilizat de

- [Nodul IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP ca trigger de workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) este un broker de mesaje open-source. Acreditarea RabbitMQ stochează detaliile de conectare pentru publicarea către și consumul din cozi și exchange-uri.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `rabbitmq_host` | URL-ul de conectare AMQP (de ex. `amqp://localhost:5672`) |
| `rabbitmq_username` | Numele de utilizator RabbitMQ (implicit: `guest`) |
| `rabbitmq_password` | Parola RabbitMQ (implicit: `guest`) |

### Virtual Hosts

Pentru a vă conecta la un virtual host specific, includeți-l în URL-ul `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Dacă utilizați vhost-ul implicit, calea `/` poate fi omisă.

### Plugin-ul pentru mesaje întârziate

[Nodul RabbitMQ](../nodes/rabbitmq-node.md) acceptă plugin-ul **rabbitmq_delayed_message_exchange**. Când acest plugin este activat pe serverul dvs. RabbitMQ, puteți seta o întârziere (în milisecunde) pentru mesajele de ieșire utilizând câmpul `rabbitmqDelayMs` de pe nod.

Nodul setează header-ul `x-delay` pe mesajul publicat. Tipul de exchange trebuie să fie `x-delayed-message` pentru ca întârzierile să aibă efect.

Pentru a activa plugin-ul pe o instanță RabbitMQ auto-găzduită:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Când plugin-ul nu este instalat, header-ul `x-delay` este ignorat și mesajele sunt livrate imediat.

### Utilizat de

- [Nodul RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ ca trigger de workflow)

---

## Amazon S3

Acreditarea Amazon S3 conectează Heym la [Amazon S3](https://aws.amazon.com/s3/). Utilizați-o cu [Nodul Amazon S3](../nodes/amazon-s3-node.md) pentru a gestiona bucket-uri și foldere, a încărca și descărca obiecte, a copia chei și a lista sau șterge obiecte din workflow-uri.
### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `aws_access_key_id` | ID-ul cheii de acces AWS IAM |
| `aws_secret_access_key` | Cheia de acces secretă asociată cu ID-ul cheii de acces |
| `aws_region` | Regiunea AWS în care se află bucket-urile (de ex. `us-east-1`) |

### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `aws_session_token` | Token de sesiune temporar atunci când se utilizează acreditări AWS STS |

### Note

- Acreditarea utilizează autentificarea standard AWS SigV4 prin boto3.
- Operațiunile de încărcare trimit în prezent conținut text UTF-8; descărcările pot returna text sau base64 pentru obiecte binare.

### Utilizat de

- [Nodul Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) este un depozit cheie-valoare în memorie utilizat pentru caching și acces rapid la date.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `host` | Numele de gazdă sau IP-ul serverului Redis (de ex. `localhost`) |
| `port` | Portul Redis (implicit: `6379`) |
| `password` | Parola Redis (lăsați gol dacă nu este setată) |

### Utilizat de

- [Nodul Redis](../nodes/redis-node.md)

---

## Slack

Acreditarea Slack stochează un **URL de Webhook de intrare** pentru publicarea mesajelor în canalele Slack.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `webhook_url` | URL-ul Webhook-ului de intrare Slack (din configurația aplicației dvs. Slack) |

### Note

- Creați un Webhook de intrare la [api.slack.com/apps](https://api.slack.com/apps) → aplicația dvs. → **Incoming Webhooks**.
- Fiecare Webhook este limitat la un canal specific. Creați mai multe acreditări pentru canale diferite.

### Utilizat de

- [Nodul Slack](../nodes/slack-node.md)

---

## Telegram

Acreditarea Telegram stochează un **Token de Bot** și un **Token secret de Webhook** opțional pentru workflow-uri bazate pe bot.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `bot_token` | Token-ul Telegram Bot API de la BotFather |

### Câmpuri opționale

| Câmp | Descriere |
|-------|-------------|
| `secret_token` | Secret partajat verificat față de `x-telegram-bot-api-secret-token` la Webhook-urile de intrare |

### Note

- Utilizați aceeași acreditare atât pentru [Telegram Trigger](../nodes/telegram-trigger-node.md), cât și pentru [Telegram](../nodes/telegram-node.md).
- Înregistrați Webhook-ul manual cu API-ul `setWebhook` al Telegram utilizând URL-ul afișat în panoul nodului Telegram Trigger.
- `chatId` din nodul Telegram poate fi un ID literal sau o expresie precum `$telegramEvent.message.chat.id`.

### Utilizat de

- [Nodul Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Nodul Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Aceste acreditări sunt utilizate de [Nodul HTTP](../nodes/http-node.md) pentru a autentifica cererile de ieșire.

### Bearer

Atașează un antet `Authorization: Bearer <token>` la cererile HTTP.

| Câmp | Descriere |
|-------|-------------|
| `token` | Valoarea token-ului bearer |

### Header

Atașează un antet personalizat la cererile HTTP.

| Câmp | Descriere |
|-------|-------------|
| `header_key` | Numele antetului (de ex. `X-Api-Key`) |
| `header_value` | Valoarea antetului |

Ambele tipuri pot fi, de asemenea, referite prin `$credentials.CredentialName` în [Expression DSL](./expression-dsl.md) pentru utilizare dinamică în orice nod care acceptă expresii.

### Utilizat de

- [Nodul HTTP](../nodes/http-node.md)

---

## Furnizori LLM (OpenAI, Google, Custom, Cohere)

Aceste acreditări alimentează nodurile AI.

| Tip | Descriere |
|------|-------------|
| **OpenAI** | Cheie API pentru modelele GPT și embeddings OpenAI |
| **Google** | Cheie API pentru modelele Gemini |
| **Custom** | Cheie API + URL de bază pentru endpoint-uri compatibile cu OpenAI (Ollama, vLLM, LM Studio etc.) |
| **Cohere** | Cheie API pentru embeddings Cohere |

### Cache-ul de Prompt OpenAI

OpenAI memorează automat în cache prefixul static (neschimbător) al prompt-ului dvs. de sistem — nu este necesară nicio configurare suplimentară. Execuțiile repetate ale workflow-ului care partajează același prefix de prompt de sistem beneficiază de prețul token-urilor din cache, ceea ce reduce atât costul, cât și latența. Acest lucru este deosebit de util atunci când aveți instrucțiuni lungi și fixe și doar mesajul utilizatorului se schimbă între execuții. Monitorizați ratele de hit ale cache-ului și economiile de token-uri în [fila Execuții](../tabs/traces-tab.md) sau în panoul de utilizare OpenAI pentru a optimiza structura prompt-ului pentru reutilizarea maximă a cache-ului.

### Utilizat de

- [Nodul LLM](../nodes/llm-node.md)
- [Nodul Agent](../nodes/agent-node.md)
- [Nodul RAG](../nodes/rag-node.md) (embeddings OpenAI prin acreditarea Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) este un server proxy pentru ocolirea Cloudflare și a provocărilor similare de protecție împotriva boților.

### Câmpuri obligatorii

| Câmp | Descriere |
|-------|-------------|
| `flaresolverr_url` | URL-ul instanței dvs. FlareSolverr (de ex. `http://localhost:8191`) |

Adresele de tip loopback și private sunt acceptate aici, astfel încât rularea FlareSolverr alături de Heym funcționează conform documentației. URL-ul nu poate fi rezolvat către o adresă link-local sau de metadate cloud. Deoarece adresele private sunt permise, acest câmp poate fi direcționat și către un alt serviciu intern, iar răspunsul este returnat în ieșirea nodului. Orice utilizator autentificat poate crea această acreditare, astfel încât limita este dată de cine poate autoriza workflow-uri plus regulile dvs. de rețea, nu de partajarea acreditărilor. Consultați [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Utilizat de

- [Nodul Crawler](../nodes/crawler-node.md)

---
## Related

- [Acreditări](./credentials.md) – Prezentare generală a acreditărilor și modul în care acestea sunt utilizate de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugarea și gestionarea acreditărilor
- [Partajarea acreditărilor](./credentials-sharing.md) – Partajarea acreditărilor cu utilizatori și echipe
- [Securitate](./security.md) – Criptare în repaus, controlul accesului
- [Expression DSL](./expression-dsl.md) – Sintaxa `$credentials` pentru acces dinamic

---

## Model Router (Auto Model)

Direcționează fiecare cerere către una dintre acreditările de model existente, utilizând un model de decizie pentru
a alege. Stochează referințe, niciodată o cheie proprie.

### Câmpuri obligatorii

- `decision_credential_id` – o acreditare de **Decision Model** la care aveți acces.
- `decision_model` – modelul care efectuează apelul de rutare, de exemplu `jev-latest`.
- `options` – cel puțin două intrări, fiecare cu un nume, una dintre acreditările dvs. OpenAI/Google/Custom,
  un model pe aceasta și criterii care specifică când ar trebui să câștige.

### Câmpuri opționale

- `routing_instructions` – modul de ponderare a opțiunilor în ansamblu.
- O opțiune poate fi marcată ca fallback utilizat atunci când rutarea eșuează.

### Note

Numele opțiunilor sunt cele între care alege modelul de decizie, prin urmare trebuie să fie distincte. O
opțiune nu poate indica un alt Model Router.
