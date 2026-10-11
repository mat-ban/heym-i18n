# Integracions de tercers

Heym es connecta a serveis externs mitjançant **credencials**. Cada tipus de credencial emmagatzema els detalls de connexió d'un servei i es pot reutilitzar en múltiples nodes i workflows. Consulteu [Credencials](./credentials.md) per a una visió general.

Afegiu credencials a [Configuració → Credencials](../tabs/credentials-tab.md). Tots els valors s'encripten en repòs. Les credencials es poden [compartir](./credentials-sharing.md) amb altres usuaris o [Equips](./teams.md).

Alguns nodes d'integració **no** requereixen credencials. [WebSocket Trigger](../nodes/websocket-trigger-node.md) i [WebSocket Send](../nodes/websocket-send-node.md) es connecten a sockets externs utilitzant la URL, les capçaleres i els subprotocols configurats directament al node.

## Tipus de credencials d'un cop d'ull

| Tipus | Utilitzat per | Camps clau |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, `base_url` opcional |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, `base_url` opcional |
| **Jira** | [Node Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, `api_version` opcional |
| **Linear** | [Node Linear](../nodes/linear-node.md) | `api_key`, o `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Node Sentry](../nodes/sentry-node.md) | `api_token`, `base_url` opcional |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Avaluacions](../tabs/evals-tab.md) (jutge LLM-as-Judge) | `base_url`, `api_key` opcional |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | una credencial de model de decisió, més opcions de model que fan referència a les vostres altres credencials |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Magatzems vectorials | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Magatzems vectorials | `openai_api_key` (vectors emmagatzemats al propi Postgres de Heym mitjançant pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Magatzems vectorials | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, `embedding_api_key` opcional, més `qdrant_host` quan `db_type` és `qdrant` |
| **Grist** | [Node Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Node Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consentiment OAuth2 |
| **Google Drive** | [Node Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consentiment OAuth2 (abast complet de Drive) |
| **BigQuery** | [Node BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consentiment OAuth2 |
| **Supabase** | [Node Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, `supabase_schema` opcional |
| **ClickHouse** | [Node ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Node Notion](../nodes/notion-node.md) | `api_token`, o `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Node Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Node IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Node Telegram Trigger](../nodes/telegram-trigger-node.md), [Node Telegram](../nodes/telegram-node.md) | `bot_token`, `secret_token` opcional |
| **Discord** | [Node Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Node Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Node RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Node Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Node Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Node Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Node HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Node HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Node Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---
## GitHub

La credencial de GitHub emmagatzema un token d'accés personal (PAT) de GitHub perquè els workflows puguin cridar l'API REST de GitHub mitjançant el [node de GitHub](../nodes/github-node.md), passar el token a servidors MCP com ara `@modelcontextprotocol/server-github`, o utilitzar-lo des del [node HTTP](../nodes/http-node.md) per a crides REST personalitzades.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `api_key` | Token d'accés personal de GitHub (PAT de gra fi `github_pat_...` o PAT clàssic `ghp_...`) |

### Camps opcionals

| Camp | Descripció |
|-------|-------------|
| `base_url` | URL base de l'API de GitHub per a GitHub Enterprise Server (per exemple, `https://github.example.com/api/v3`) |

### Notes

- Es recomana utilitzar tokens d'accés personal de gra fi sempre que sigui possible, ja que es poden limitar a repositoris i permisos concrets.
- Deixeu `base_url` buit per a GitHub.com. Per a GitHub Enterprise Server, utilitzeu l'endpoint complet de l'API REST
  incloent-hi `/api/v3` (per exemple, `https://github.example.com/api/v3`), no l'arrel de la interfície web
  del servidor com ara `https://github.example.com`.
- Actualment, aquesta credencial només modela l'autenticació basada en PAT. Per accedir a repositoris d'organització, utilitzeu un PAT al qual s'hagin concedit els permisos d'organització/repositori necessaris.
- Els tokens d'instal·lació de GitHub App i els fluxos de configuració de GitHub App no són de primera classe a la interfície de Heym actualment.
- Preferiu el [node de GitHub](../nodes/github-node.md) per a operacions natives de repositoris, usuaris, incidències, pull requests, revisions, releases, workflows d'Actions, trànsit i fitxers. Utilitzeu el [node HTTP](../nodes/http-node.md) només quan necessiteu endpoints o payloads que el node de GitHub no cobreix.
- Utilitzeu el [node Agent](../nodes/agent-node.md) amb MCP passant `$credentials.YourGitHubCredential` a una variable d'entorn de connexió MCP com ara `GITHUB_PERSONAL_ACCESS_TOKEN`.
- L'API REST de GitHub normalment espera `Authorization: Bearer <token>` més `Accept: application/vnd.github+json`.
- En editar una credencial de GitHub, deixar buit el `base_url` de GitHub Enterprise preserva
  l'endpoint existent. Introduïu una URL nova només quan vulgueu canviar aquest endpoint.

### Utilitzada per

- [Node de GitHub](../nodes/github-node.md)
- [Node Codex](../nodes/codex-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Node HTTP](../nodes/http-node.md)

---

## Model de decisió

Un model de decisió respon preguntes tipades sobre un estat i retorna probabilitats en lloc de text. El Jev de TypeSafe és la implementació de referència; qualsevol endpoint que accepti el mateix cos `{model, state, questions}` funciona, i el node [Decision](../nodes/decision-node.md) pot enviar un cos escrit manualment per a un que no ho faci.

### Camps obligatoris

- `base_url` – l'endpoint, per exemple `https://api.typesafe.ai`. Heym hi afegeix `/v1/systemone`.

### Camps opcionals

- `api_key` – s'envia com a `Authorization: Bearer`. Els endpoints que no necessiten cap clau poden deixar aquest camp buit.

### Notes

- **Test Connection** envia una pregunta molt petita per confirmar que l'endpoint i la clau funcionen.
- En editar una credencial, es conserva la clau emmagatzemada quan el camp de la clau es deixa buit.
- Les sol·licituds sortints a adreces privades i de loopback estan bloquejades per defecte, de manera que un endpoint autoallotjat a `localhost` o en un rang privat necessita `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Aquests models són absents de les taules de preus d'LLM que Heym sincronitza, de manera que la columna Cost a [Execucions](../tabs/traces-tab.md) queda buida. Els recomptes de tokens sí que es registren.

### Utilitzat per

- [Decision](../nodes/decision-node.md)
- [Avaluacions](../tabs/evals-tab.md) – puntua les respostes `LLM-as-Judge` contra la sortida esperada

## OpenAI Codex

La credencial d'OpenAI Codex autentica el [node Codex](../nodes/codex-node.md). És independent de la credencial de clau d'API d'OpenAI utilitzada pels nodes LLM, Agent i RAG.

### Modes d'autenticació

| Mode | Descripció |
|------|-------------|
| **Inicia sessió amb ChatGPT** (recomanat) | Inici de sessió OAuth (PKCE) que utilitza la vostra subscripció ChatGPT Plus/Pro, de manera que les execucions eviten els costos d'API per token. Heym emmagatzema i actualitza automàticament el paquet de tokens. |
| **Token d'accés** | Un `access_token` de ChatGPT/Codex passat només al procés local de la CLI de Codex. |

### Notes

- Les claus d'API es rebutgen per a aquest tipus de credencial.
- Els tokens de Codex no s'exposen mitjançant `$credentials.Name`.
- El node Codex també necessita una credencial de GitHub per al clonatge de repositoris, el push de branques i la creació de PR esborrany.

### Utilitzat per

- [Node Codex](../nodes/codex-node.md)

## OpenCode Go

La credencial d'OpenCode Go autentica el [node OpenCode Go](../nodes/opencode-go-node.md). Emmagatzema una clau d'API de la passarel·la d'OpenCode Go (de [opencode.ai/go](https://opencode.ai/go)) i una URL base de passarel·la opcional.

### Camps

| Camp | Descripció |
|-------|-------------|
| **API Key** | Clau d'API de la passarel·la d'OpenCode Go (obligatori). |
| **Gateway Base URL** | Opcional; per defecte `https://opencode.ai/zen/go/v1`. Substituïu-la només per a una passarel·la autoallotjada o amb proxy. |
### Notes

- L'API key es passa només al procés de l'OpenCode CLI dins d'un contenidor endurit.
- El node OpenCode Go també necessita una credencial de GitHub per al clonatge de repositoris, el push de branques i la creació de pull requests. El token de GitHub no es col·loca mai dins del contenidor sandbox.

### Utilitzat per

- [Node OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

La credencial de Linear admet tant una API key personal com OAuth2 per al
[node Linear](../nodes/linear-node.md). Heym envia consultes GraphQL natives a Linear per a les metadades de l'espai de treball, els projectes, les incidències i els comentaris.

### Configuració

Trieu un mode d'autenticació:

**API key personal**

1. A Linear, obriu **Settings → Security & Access → Personal API keys**.
2. Creeu una key amb accés a l'espai de treball que voleu automatitzar.
3. Enganxeu la key en una credencial de Linear a Heym i utilitzeu **Test Connection** per verificar-la.

**OAuth2**

1. Creeu una aplicació OAuth de Linear.
2. Registreu `{FRONTEND_URL}/api/credentials/linear/oauth/callback` com a redirect URI.
3. A Heym Dashboard → **Credentials** → **New** → tipus **Linear**.
4. Trieu **OAuth2**, introduïu el Client ID i el Client Secret i feu clic a **Connect**.

### Camps obligatoris

| Mode | Camp | Descripció |
|------|-------|-------------|
| API key personal | `api_key` | API key personal de Linear, habitualment amb el prefix `lin_api_` |
| OAuth2 | `client_id` | Client ID de l'aplicació OAuth de Linear |
| OAuth2 | `client_secret` | Client Secret de l'aplicació OAuth de Linear |

Els tokens OAuth (`access_token`, `refresh_token`, `token_expiry`) s'emmagatzemen i es refresquen automàticament.

### Notes

- Les API keys personals i els tokens OAuth actuen com l'usuari de Linear que els ha creat o autoritzat.
- L'OAuth de Linear utilitza els àmbits `read,write,issues:create,comments:create`.
- Utilitzeu **Test Connection** al diàleg de credencials per verificar l'API key o el token OAuth contra l'API de Linear.
- Utilitzeu List Teams i List Projects al node Linear per descobrir UUIDs abans de crear o filtrar incidències.
- Utilitzeu List Workflow States i List Team Members per descobrir els UUIDs d'estat i d'assignat per a les actualitzacions.
- Per rotar una API key, editeu la credencial i introduïu el valor de substitució. Si roteu els secrets de l'aplicació OAuth, torneu a connectar la credencial mitjançant **Connect**.

### Utilitzat per

- [Node Linear](../nodes/linear-node.md)

---

## Jira

La credencial de Jira emmagatzema les credencials d'autenticació bàsica de Jira, l'URL base del lloc de Jira, el mode de desplegament i la versió opcional de l'API REST per al [node Jira](../nodes/jira-node.md). Utilitzeu `cloud` per a Jira Cloud o `data_center` per a Jira Data Center / Server.

### Configuració

**Jira Cloud**

1. Als paràmetres del compte d'Atlassian, creeu un API token.
2. A Heym Dashboard → **Credentials** → **New** → tipus **Jira**.
3. Introduïu el correu electrònic d'Atlassian, l'API token i l'URL del lloc de Jira, com ara `https://your-domain.atlassian.net`.
4. Utilitzeu **Test Connection** per verificar la credencial.

**Jira Data Center / Server**

1. Seleccioneu **Jira Data Center / Server** com a desplegament.
2. Introduïu el nom d'usuari i la contrasenya de Jira emprats per a l'autenticació bàsica.
3. Introduïu l'URL del lloc de Jira, per exemple `https://jira.example.com`.
4. Utilitzeu **Test Connection** per verificar la credencial.

### Camps

| Camp | Descripció |
| --- | --- |
| `email` | Correu electrònic del compte d'Atlassian de Jira Cloud, o nom d'usuari de Jira Data Center / Server |
| `api_token` | API token d'Atlassian de Jira Cloud, o contrasenya de Jira Data Center / Server per a l'autenticació bàsica |
| `base_url` | URL base del lloc de Jira |
| `deployment` | `cloud` per a Jira Cloud o `data_center` per a Jira Data Center / Server |
| `api_version` | Versió de l'API REST; per defecte `3` per a Jira Cloud. Data Center / Server utilitza la v2 |

### Notes

- El node Jira envia les descripcions i els comentaris de les incidències com a documents de text en format Atlassian Document Format per a l'API REST v3 de Jira Cloud. Les credencials de Data Center / Server envien text pla.
- Data Center / Server actualment només admet autenticació bàsica amb nom d'usuari i contrasenya. Els personal access tokens i l'autenticació Bearer encara no són compatibles.
- La càrrega d'adjunts accepta contingut en base64 o data URL i està subjecta al límit de mida de fitxer de la plataforma (99 MB per defecte). La descàrrega d'adjunts pot retornar contingut en base64 quan està habilitada.
- La creació i eliminació d'usuaris i les notificacions d'incidències requereixen que el compte de Jira autenticat tingui els permisos rellevants del lloc o de l'organització de Jira.
- Utilitzeu List Projects, Search Issues i List Transitions per descobrir claus de projecte, claus d'incidència i IDs de transició.
- Per als endpoints personalitzats no coberts pel node Jira, utilitzeu el [node HTTP](../nodes/http-node.md) amb Jira Basic Auth (`email:api_token` per a Cloud o `username:password` per a Data Center / Server) a l'ordre cURL, o una credencial de Header amb el valor `Authorization: Basic <base64(user:secret)>` corresponent.

Vegeu també:

- [Node Jira](../nodes/jira-node.md)
- [Credencials](./credentials.md)

---

## Sentry

La credencial de Sentry emmagatzema un auth token per al [node Sentry](../nodes/sentry-node.md). Heym utilitza l'API REST de Sentry per a operacions d'organització, projecte, equip, incidència, esdeveniment i versió.
### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `api_token` | Token d'autenticació de Sentry amb accés a les organitzacions i projectes que automatitzeu |

### Camps opcionals

| Camp | Descripció |
|-------|-------------|
| `base_url` | URL arrel opcional per a Sentry autoallotjat, per exemple `https://sentry.example.com` |

### Notes

- Deixeu `base_url` buit per a Sentry SaaS.
- Utilitzeu **Test Connection** per confirmar que el token pot llistar les organitzacions visibles.
- Per a crides REST personalitzades, utilitzeu `$credentials.YourSentryCredential` com a bearer token.

### Utilitzat per

- [Node Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) és una base de dades vectorial de codi obert utilitzada per a la cerca semàntica i RAG (Retrieval Augmented Generation).

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `qdrant_host` | URL completa de la vostra instància de Qdrant (p. ex. `http://localhost:6333` o un endpoint al núvol) |
| `openai_api_key` | Clau API d'OpenAI utilitzada per generar embeddings en indexar i cercar documents |

### Notes

- Les col·leccions de Qdrant es gestionen des de la pestanya [Magatzems vectorials](../tabs/vectorstores-tab.md). Cada magatzem vectorial s'assigna a una col·lecció de Qdrant.
- El [node RAG](../nodes/rag-node.md) utilitza un magatzem vectorial (que referencia una credencial de Qdrant) — no referencia la credencial directament.
- Si la vostra instància de Qdrant requereix una clau API, incloeu-la al valor de `qdrant_host` o configureu Qdrant en conseqüència; la integració actual no disposa d'un camp separat per a la clau API de Qdrant.
- Qdrant autoallotjat: utilitzeu la [imatge Docker oficial](https://hub.docker.com/r/qdrant/qdrant) i exposeu el port `6333`.

### Utilitzat per

- [Node RAG](../nodes/rag-node.md) (a través del magatzem vectorial)
- [Pestanya Magatzems vectorials](../tabs/vectorstores-tab.md)

## Embeddings personalitzats (RAG)

Per defecte, els embeddings de RAG provenen d'OpenAI. Una credencial **RAG: Custom Embeddings** apunta en el seu lloc a qualsevol endpoint d'embeddings compatible amb OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together o una passarel·la allotjada — i anomena el magatzem vectorial on escriu.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `embedding_base_url` | URL de l'endpoint incloent-hi la ruta `/v1`, p. ex. `http://localhost:11434/v1` |
| `embedding_api_key` | Opcional. Els servidors locals normalment no necessiten clau |
| `embedding_model` | Nom del model tal com l'espera l'endpoint, p. ex. `nomic-embed-text` |
| `embedding_dimensions` | Amplada del vector que retorna el model (per defecte `1536`) |
| `embedding_request_dimensions` | Opcional. Demana a l'endpoint que retorni `embedding_dimensions` en lloc de l'amplada nativa del model |
| `db_type` | `qdrant` o `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Connexió a Qdrant, obligatòria quan `db_type` és `qdrant` |

### Notes

- **Qdrant accepta qualsevol nombre de dimensions.** Cada col·lecció es crea amb l'amplada que declara aquesta credencial, de manera que el camp Dimensions és lliurement editable.
- **Postgres (pgvector) requereix exactament 1536 dimensions.** La seva columna és un `vector(1536)` fix, de manera que el camp Dimensions està fixat a 1536 i una credencial que declari qualsevol altra amplada es rebutja en desar.
- **Escurçament per a pgvector.** Quan el magatzem és Postgres, el diàleg ofereix *Ask the endpoint to return 1536 dimensions*. Això envia el paràmetre de sol·licitud `dimensions`, que els models entrenats amb representacions Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` i similars) respecten retornant un vector escurçat però encara significatiu. Els endpoints que no admeten el paràmetre rebutgen la sol·licitud, i els endpoints que l'accepten però l'ignoren produeixen un error clar que indica l'amplada realment retornada. Heym mai trunca vectors per si mateix, perquè tallar la sortida d'un model que no és Matryoshka degrada la qualitat de recuperació de manera silenciosa. L'opció no s'ofereix per a Qdrant, que pot dimensionar una col·lecció a qualsevol amplada.
- Utilitzeu **Test Connection** al diàleg de credencials per incrustar una cadena de prova i veure l'amplada que el model retorna realment abans de crear un magatzem.
- El paràmetre de sol·licitud `dimensions` només s'envia a OpenAI mateix, ja que la majoria de servidors compatibles amb OpenAI rebutgen paràmetres desconeguts. L'amplada nativa del model es valida en canvi contra la credencial.
- Les credencials existents **RAG: Qdrant + OpenAI** i **RAG: Psql + OpenAI** no canvien i continuen funcionant.

### Utilitzat per

- [Node RAG](../nodes/rag-node.md) (a través del magatzem vectorial)
- [Pestanya Magatzems vectorials](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym també pot emmagatzemar vectors **dins de la seva pròpia base de dades Postgres** mitjançant l'extensió [pgvector](https://github.com/pgvector/pgvector) — no cal cap servei vectorial extern. Creeu una credencial **RAG: Psql + OpenAI** i utilitzeu-la en crear un magatzem vectorial, i després seleccioneu **Postgres (pgvector)** al desplegable Database del node RAG.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `openai_api_key` | Clau API d'OpenAI utilitzada per generar embeddings en indexar i cercar documents |
### Notes

- No cal cap host ni port — els vectors s'escriuen a la base de dades pròpia de Heym; Heym no es connecta mai a una altra base de dades.
- Totes les funcionalitats de RAG disponibles amb Qdrant (inserció, cerca, filtres de metadades, reranking de Cohere, clonació, compartició) funcionen de manera idèntica amb el backend de Postgres.
- Requereix l'extensió `vector`. Heym manté la imatge oficial `postgres:16` sense modificar (de manera que les dades existents no es toquen mai) i **instal·la automàticament el paquet `postgresql-16-pgvector` a l'inici** — `run.sh`, `deploy.sh` i `run_e2e.sh` ho gestionen tots. La instal·lació no és fatal: si no es pot executar (per exemple, sense xarxa), el RAG de Qdrant continua funcionant i el backend de Postgres roman inactiu (la migració omet la taula de manera controlada).
- Si executeu la imatge publicada d'un sol contenidor (`ghcr.io/heymrun/heym`) contra **el vostre propi Postgres extern**, aquesta base de dades ha de suportar l'extensió `vector` (Heym no la pot instal·lar en una base de dades que no gestiona). Sense aquesta extensió, crear o pujar a un magatzem vectorial de Postgres retorna un missatge clar i el RAG de Qdrant continua funcionant.

### Utilitzat per

- [Node RAG](../nodes/rag-node.md) (a través del magatzem vectorial)
- [Pestanya Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) és un híbrid de full de càlcul i base de dades que admet dades estructurades i fórmules. La credencial de Grist permet a Heym llegir i escriure documents de Grist.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `api_key` | Clau API de Grist (es troba a **Profile → API Key** a la vostra instància de Grist) |
| `server_url` | URL base del vostre servidor de Grist (per exemple, `https://docs.getgrist.com` per a Grist Cloud, o la vostra URL autoallotjada) |

### Notes

- El [node Grist](../nodes/grist-node.md) requereix el **Document ID** (de la URL del document de Grist) i el **Table ID** a la seva configuració — aquests no formen part de la credencial.
- Per a Grist autoallotjat, establiu `server_url` al domini de la vostra instància.
- Els IDs de columna a Grist utilitzen guions baixos (per exemple, `User_Name`), no etiquetes de visualització. Utilitzeu l'operació `listColumns` per descobrir-los.

### Utilitzat per

- [Node Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

La credencial de Google Sheets connecta Heym a l'API de Google Sheets utilitzant un model OAuth2 "Bring Your Own App". Proporcioneu un Client ID i un Client Secret d'OAuth2 de Google Cloud, i després autoritzeu l'accés mitjançant una finestra emergent del navegador. Els tokens es renoven automàticament en segon pla.

### Configuració

1. Obriu [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cerqueu i activeu **Google Sheets API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → tipus d'aplicació **Web application**.
3. A **Authorized redirect URIs** afegiu: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copieu el **Client ID** i el **Client Secret** generats.
5. Al Tauler de Heym → **Credentials** → **New** → tipus **Google Sheets (OAuth2)**.
6. Introduïu el Client ID, el Client Secret i un nom, i després feu clic a **Connect** per obrir la finestra emergent de consentiment de Google i autoritzar l'accés.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `client_id` | Client ID d'OAuth2 de Google Cloud Console |
| `client_secret` | Client Secret d'OAuth2 de Google Cloud Console |

Els tokens (`access_token`, `refresh_token`, `token_expiry`) s'emmagatzemen i es renoven automàticament — no els gestioneu directament.

### Notes

- La pantalla de consentiment d'OAuth2 requereix l'abast de spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym utilitza el refresh token per obtenir nous access tokens abans que expirin (marge de seguretat de 60 segons).
- Si rotateu el Client Secret a Google Cloud Console, torneu a connectar la credencial mitjançant el botó **Connect**.
- **Producció:** Establiu **`FRONTEND_URL`** del backend a l'URL pública exacta que els usuaris obren al navegador (esquema + host, per exemple, `https://heym.example.com`). Heym construeix l'URI de redirecció d'OAuth de Google només a partir d'aquest valor — **no** confia en les capçaleres `Origin` ni `X-Forwarded-*` (controlades pel client). Registreu `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` a Google Cloud Console.

### Utilitzat per

- [Node Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

La credencial de Google Drive connecta Heym a l'API de Google Drive utilitzant el mateix model OAuth2 "Bring Your Own App" que Google Sheets. Proporcioneu un Client ID i un Client Secret d'OAuth2 de Google Cloud, i després autoritzeu l'accés mitjançant una finestra emergent del navegador. Els tokens es renoven automàticament en segon pla.
### Configuració

1. Obriu la [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cerqueu i activeu **Google Drive API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → tipus d'aplicació **Web application**.
3. A **Authorized redirect URIs** afegiu: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copieu el **Client ID** i el **Client Secret** generats.
5. Al Heym Dashboard → **Credentials** → **New** → tipus **Google Drive (OAuth2)**.
6. Introduïu el Client ID, el Client Secret i un nom, i feu clic a **Connect** per obrir la finestra emergent de consentiment de Google i autoritzar l'accés.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `client_id` | OAuth2 Client ID de la Google Cloud Console |
| `client_secret` | OAuth2 Client Secret de la Google Cloud Console |

Els tokens (`access_token`, `refresh_token`, `token_expiry`) s'emmagatzemen i es refresquen automàticament — no els gestioneu directament.

### Abast

Google Drive sol·licita l'**abast complet de Drive** (`https://www.googleapis.com/auth/drive`).

Això és necessari perquè el node opera sobre fitxers que ja posseïu. L'abast més restringit `drive.file` només concedeix accés als fitxers que el propi client OAuth ha creat, cosa que faria que `listFolderFiles`, `updateFile`, `removeFile` i `removeFolder` no veiessin res del vostre Drive existent.

Com que proporcioneu el vostre propi Client ID i Secret des del vostre propi projecte de Google Cloud, els requisits de verificació d'aplicacions de Google per a aquest abast s'apliquen al vostre projecte, no a Heym.

### Notes

- Heym utilitza el refresh token per obtenir nous access tokens abans que caduquin (marge de seguretat de 60 segons).
- Si rotateu el Client Secret a la Google Cloud Console, torneu a connectar la credencial mitjançant el botó **Connect**.
- Els discs compartits són compatibles — el node estableix `supportsAllDrives` a cada crida a l'API.
- **Producció:** Establiu el **`FRONTEND_URL`** del backend a l'URL pública exacta que els usuaris obren al navegador. Heym construeix l'URI de redirecció d'OAuth de Google només a partir d'aquest valor — **no** confia en les capçaleres `Origin` ni `X-Forwarded-*`. Registreu `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` a la Google Cloud Console.
- Consulteu [Credential Sharing](./credentials-sharing.md) abans de compartir aquesta credencial amb un equip.

### Utilitzat per

- [Node Google Drive](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

La credencial de BigQuery connecta Heym a l'API de Google BigQuery mitjançant un model OAuth2 "Bring Your Own App". Proporcioneu un Client ID i un Client Secret d'OAuth2 de Google Cloud, i després autoritzeu l'accés mitjançant una finestra emergent del navegador. Els tokens es refresquen automàticament en segon pla.

### Configuració

1. Obriu la [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cerqueu i activeu **BigQuery API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → tipus d'aplicació **Web application**.
3. A **Authorized redirect URIs** afegiu: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copieu el **Client ID** i el **Client Secret** generats.
5. Al Heym Dashboard → **Credentials** → **New** → tipus **BigQuery (OAuth2)**.
6. Introduïu el Client ID, el Client Secret i un nom, i feu clic a **Connect** per obrir la finestra emergent de consentiment de Google i autoritzar l'accés.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `client_id` | OAuth2 Client ID de la Google Cloud Console |
| `client_secret` | OAuth2 Client Secret de la Google Cloud Console |

Els tokens (`access_token`, `refresh_token`, `token_expiry`) s'emmagatzemen i es refresquen automàticament.

### Notes

- La pantalla de consentiment d'OAuth2 requereix l'abast de BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Producció:** Establiu el **`FRONTEND_URL`** del backend a l'URL pública. Registreu `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` a la Google Cloud Console.

### Utilitzat per

- [Node BigQuery](../nodes/bigquery-node.md)

---

## Supabase

La credencial de Supabase connecta Heym a l'API PostgREST d'un projecte de Supabase per tal que els workflows puguin consultar i modificar taules basades en Postgres.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `supabase_url` | URL base del projecte, per exemple `https://your-project.supabase.co` |
| `supabase_key` | Clau d'API amb accés a les taules de destinació |
| `supabase_schema` | Esquema predeterminat opcional (per defecte, `public`) |

### Notes

- El [node Supabase](../nodes/supabase-node.md) es comunica amb `/rest/v1/<table>` i admet filtres d'operadors (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` i operadors PostgREST relacionats) així com grups lògics imbricats `or` / `and`.
- Per a operacions d'escriptura, preferiu una clau destinada a ús fiable del costat del servidor amb els permisos de taula mínims necessaris.
- Els nodes poden sobreescriure l'esquema per pas encara que la credencial defineixi un esquema predeterminat.

### Utilitzat per

- [Node Supabase](../nodes/supabase-node.md)
## ClickHouse

La credencial de ClickHouse connecta Heym a una base de dades ClickHouse externa a través de la seva interfície HTTP, de manera que els workflows poden executar operacions SQL, CRUD i de recompte sobre taules OLAP.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `host` | Host HTTP sense esquema, per exemple `your-instance.clickhouse.cloud` |
| `port` | Port de la interfície HTTP (`8443` per a HTTPS, `8123` per a HTTP) |
| `username` | Usuari de ClickHouse (per defecte, `default`) |
| `password` | Contrasenya de l'usuari (opcional) |
| `database` | Base de dades de destinació (per defecte, `default`) |
| `secure` | Utilitza HTTPS quan és `true` (obligatori per a ClickHouse Cloud) |

### Notes

- El [node ClickHouse](../nodes/clickhouse-node.md) utilitza el client HTTP oficial `clickhouse-connect` i parametritza les vinculacions de filtres i valors.
- `update` i `remove` s'assignen a `ALTER TABLE ... UPDATE` i `DELETE FROM`, que són mutacions asíncrones de ClickHouse; ambdues requereixen un filtre.
- `upsert` realitza un `INSERT` i assumeix una taula `ReplacingMergeTree` per al comportament de fusió per clau.
- Utilitzeu **Test connection** al diàleg de credencials per verificar l'accessibilitat.

### Utilitzat per

- [Node ClickHouse](../nodes/clickhouse-node.md)

## Notion

La credencial de Notion admet tant un token d'integració interna com una connexió OAuth
d'integració pública. OAuth permet que cada usuari autoritzi un espai de treball de Notion des de Heym en lloc de copiar manualment
un token.

### Camps obligatoris

| Mode | Camp | Descripció |
|------|-------|-------------|
| Token intern | `api_token` | Token d'integració interna (`ntn_...`) |
| OAuth | `client_id` | Client ID d'una integració pública de Notion |
| OAuth | `client_secret` | Client Secret de la integració pública de Notion |

La devolució de trucada d'OAuth emmagatzema `access_token`, `auth_mode`, `workspace_id`, `workspace_name` i `bot_id`
automàticament. Qualsevol `api_token` intern anterior s'elimina quan es completa l'OAuth. Registreu aquesta
URI de redirecció a Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Flux de configuració d'OAuth

1. Trieu **OAuth** al diàleg de credencials, introduïu un nom, el Client ID i el Client Secret.
2. Feu clic a **Connect** i autoritzeu l'espai de treball a la finestra emergent de Notion.
   - Per a una credencial **nova**, Heym crea el registre de la credencial quan feu clic a **Connect**.
   - Completeu l'autorització a la finestra emergent i, a continuació, feu clic a **Save** per tornar a la llista de credencials.
3. Una credencial connectada mostra `connected (Workspace Name)` a la llista. Les credencials OAuth pendents
   mostren `Not connected` fins que finalitza l'autorització.

Utilitzeu **Test Connection** al diàleg de credencials per verificar tant un token intern com una autorització
OAuth completada. En editar, deixar el camp del token en blanc conserva el token intern emmagatzemat.

Tant els tokens interns com els tokens d'accés OAuth estan disponibles mitjançant
`$credentials.CredentialName` per a crides [HTTP](../nodes/http-node.md) personalitzades que necessitin un token
de portador de Notion.

### Notes

- Les integracions internes requereixen que les pàgines, bases de dades i fonts de dades rellevants es comparteixin.
- Els usuaris d'OAuth trien l'espai de treball i les pàgines durant l'autorització de Notion.
- Les credencials de l'aplicació OAuth s'encripten dins de la credencial de Notion. La devolució de trucada les recarrega
  al costat del servidor; el secret no s'incrusta a l'estat d'OAuth.
- Les credencials OAuth connectades mostren el nom de l'espai de treball; les credencials OAuth pendents mostren
  `Not connected` fins que finalitza l'autorització.
- **Producció:** Establiu el **`FRONTEND_URL`** del backend a l'URL pública del navegador (esquema + host, sense
  barra final). L'URI de redirecció de Notion ha de coincidir exactament:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- El node utilitza la versió d'API `2026-03-11` i la terminologia actual de `data_source`. Consulteu
  l'article del [node Notion](../nodes/notion-node.md#api-version-notes) per obtenir orientació sobre la migració des
  d'exemples antics de `archived`, `after` o consultes de base de dades.
- Els filtres de cerca antics amb valor d'objecte `database` es normalitzen a `data_source`.

### Utilitzat per

- [Node Notion](../nodes/notion-node.md)

---

## SMTP (Correu electrònic)

La credencial SMTP emmagatzema els detalls de connexió del servidor de correu per enviar correu sortint.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `host` | Nom d'amfitrió del servidor SMTP (p. ex. `smtp.gmail.com`) |
| `port` | Port SMTP (normalment `587` per a STARTTLS, `465` per a SSL) |
| `email` | Adreça de correu del remitent |
| `password` | Contrasenya SMTP o App Password |

### Proveïdors SMTP habituals

| Proveïdor | Host | Port | Notes |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Requereix una [App Password](https://support.google.com/accounts/answer/185833) (cal activar el 2FA) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilitzeu les credencials del vostre compte de Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilitzeu les credencials SMTP de Mailgun de la configuració del vostre domini |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilitzeu `apikey` com a nom d'usuari i una clau API com a contrasenya |
| Personalitzat / autoallotjat | el vostre domini | `587` / `465` | Postfix, Exim, etc. |
### Notes

- Gmail requereix una **Contrasenya d'aplicació** en lloc de la contrasenya habitual quan la verificació en dos passos està activada.
- El port `587` utilitza STARTTLS (comença en text pla i s'actualitza a TLS). El port `465` utilitza TLS implícit (SSL des de l'inici).

### Utilitzat per

- [Node Send Email](../nodes/send-email-node.md)

---

## IMAP (correu electrònic entrant)

La credencial IMAP emmagatzema els detalls de connexió per monitorar una bústia d'entrada amb el [Node IMAP Trigger](../nodes/imap-trigger-node.md).

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `imap_host` | Nom d'amfitrió del servidor IMAP (per exemple, `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` per a SSL/TLS a la majoria de proveïdors) |
| `imap_username` | Nom d'usuari de la bústia o adreça de correu electrònic completa |
| `imap_password` | Contrasenya o contrasenya d'aplicació específica del proveïdor |

### Camps opcionals

| Camp | Descripció |
|-------|-------------|
| `imap_mailbox` | Carpeta de la bústia a monitorar (per defecte: `INBOX`) |
| `imap_use_ssl` | Activa SSL/TLS (recomanat; per defecte: `true`) |

### Notes

- El Trigger IMAP estableix una línia base de la bústia actual en la primera consulta i, a continuació, només processa el correu electrònic més recent.
- Gmail, Microsoft 365 i altres proveïdors allotjats sovint requereixen una **contrasenya d'aplicació** o un secret específic d'IMAP similar.
- El contingut dels fitxers adjunts no es descarrega al payload del workflow; Heym només exposa les metadades dels fitxers adjunts.

### Utilitzat per

- [Node IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP com a Trigger de workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) és un broker de missatges de codi obert. La credencial RabbitMQ emmagatzema els detalls de connexió per publicar i consumir de cues i intercanvis.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `rabbitmq_host` | URL de connexió AMQP (p. ex. `amqp://localhost:5672`) |
| `rabbitmq_username` | Nom d'usuari de RabbitMQ (per defecte: `guest`) |
| `rabbitmq_password` | Contrasenya de RabbitMQ (per defecte: `guest`) |

### Amfitrions virtuals

Per connectar-se a un amfitrió virtual específic, inclogueu-lo a l'URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Si utilitzeu l'amfitrió virtual per defecte, es pot ometre la ruta `/`.

### Plugin de missatges retardats

El [Node RabbitMQ](../nodes/rabbitmq-node.md) admet el plugin **rabbitmq_delayed_message_exchange**. Quan aquest plugin està activat al vostre servidor RabbitMQ, podeu establir un retard (en mil·lisegons) als missatges sortints utilitzant el camp `rabbitmqDelayMs` del node.

El node estableix la capçalera `x-delay` al missatge publicat. El tipus d'intercanvi ha de ser `x-delayed-message` perquè els retards tinguin efecte.

Per activar el plugin en una instància de RabbitMQ autoallotjada:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Quan el plugin no està instal·lat, la capçalera `x-delay` s'ignora i els missatges es lliuren immediatament.

### Utilitzat per

- [Node RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ com a Trigger de workflow)

---

## Amazon S3

La credencial Amazon S3 connecta Heym amb [Amazon S3](https://aws.amazon.com/s3/). Utilitzeu-la amb el [Node Amazon S3](../nodes/amazon-s3-node.md) per gestionar buckets i carpetes, carregar i descarregar objectes, copiar claus i llistar o eliminar objectes des dels workflows.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `aws_access_key_id` | ID de clau d'accés d'AWS IAM |
| `aws_secret_access_key` | Clau d'accés secreta associada a l'ID de clau d'accés |
| `aws_region` | Regió d'AWS on es troben els buckets (p. ex. `us-east-1`) |

### Camps opcionals

| Camp | Descripció |
|-------|-------------|
| `aws_session_token` | Token de sessió temporal quan s'utilitzen credencials d'AWS STS |

### Notes

- La credencial utilitza l'autenticació estàndard AWS SigV4 mitjançant boto3.
- Les operacions de càrrega actualment envien contingut de text UTF-8; les descàrregues poden retornar text o base64 per a objectes binaris.

### Utilitzat per

- [Node Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) és un magatzem de clau-valor en memòria utilitzat per a l'emmagatzematge en memòria cau i l'accés ràpid a les dades.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `host` | Nom d'amfitrió o IP del servidor Redis (p. ex. `localhost`) |
| `port` | Port de Redis (per defecte: `6379`) |
| `password` | Contrasenya de Redis (deixeu-ho buit si no n'hi ha) |

### Utilitzat per

- [Node Redis](../nodes/redis-node.md)

---

## Slack

La credencial Slack emmagatzema una **URL de Webhook entrant** per publicar missatges als canals de Slack.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `webhook_url` | URL del Webhook entrant de Slack (de la configuració de la vostra aplicació de Slack) |

### Notes

- Creeu un Webhook entrant a [api.slack.com/apps](https://api.slack.com/apps) → la vostra aplicació → **Incoming Webhooks**.
- Cada Webhook està limitat a un canal específic. Creeu múltiples credencials per a diferents canals.

### Utilitzat per

- [Node Slack](../nodes/slack-node.md)

---

## Telegram

La credencial Telegram emmagatzema un **Token de bot** i un **Token secret de Webhook** opcional per a workflows basats en bots.
### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `bot_token` | Token de l'API de Telegram Bot obtingut de BotFather |

### Camps opcionals

| Camp | Descripció |
|-------|-------------|
| `secret_token` | Secret compartit verificat contra `x-telegram-bot-api-secret-token` als webhooks entrants |

### Notes

- Utilitzeu la mateixa credencial tant per al [Telegram Trigger](../nodes/telegram-trigger-node.md) com per al [Telegram](../nodes/telegram-node.md).
- Registreu el webhook manualment amb l'API `setWebhook` de Telegram utilitzant l'URL que es mostra al panell del node Telegram Trigger.
- El `chatId` del node Telegram pot ser un ID literal o una expressió com `$telegramEvent.message.chat.id`.

### Utilitzat per

- [Node Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Node Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer i Header)

Aquestes credencials les utilitza el [node HTTP](../nodes/http-node.md) per autenticar les sol·licituds sortints.

### Bearer

Adjunta una capçalera `Authorization: Bearer <token>` a les sol·licituds HTTP.

| Camp | Descripció |
|-------|-------------|
| `token` | El valor del token bearer |

### Header

Adjunta una capçalera personalitzada a les sol·licituds HTTP.

| Camp | Descripció |
|-------|-------------|
| `header_key` | Nom de la capçalera (p. ex. `X-Api-Key`) |
| `header_value` | Valor de la capçalera |

Tots dos tipus també es poden referenciar mitjançant `$credentials.CredentialName` al [Expression DSL](./expression-dsl.md) per a un ús dinàmic a qualsevol node que accepti expressions.

### Utilitzat per

- [Node HTTP](../nodes/http-node.md)

---

## Proveïdors d'LLM (OpenAI, Google, Custom, Cohere)

Aquestes credencials alimenten els nodes d'IA.

| Tipus | Descripció |
|------|-------------|
| **OpenAI** | Clau d'API per als models GPT i els embeddings d'OpenAI |
| **Google** | Clau d'API per als models Gemini |
| **Custom** | Clau d'API + URL base per a endpoints compatibles amb OpenAI (Ollama, vLLM, LM Studio, etc.) |
| **Cohere** | Clau d'API per als embeddings de Cohere |

### Memòria cau de prompt d'OpenAI

OpenAI emmagatzema automàticament a la memòria cau el prefix estàtic (invariable) del vostre prompt de sistema — no cal cap configuració addicional. Les execucions repetides del workflow que comparteixen el mateix prefix de prompt de sistema es beneficien del preu de tokens en memòria cau, cosa que redueix tant el cost com la latència. Això és especialment útil quan teniu instruccions llargues i fixes i només canvia el missatge de l'usuari entre execucions. Superviseu les taxes d'encerts de memòria cau i l'estalvi de tokens a la [pestanya Execucions](../tabs/traces-tab.md) o al tauler d'ús d'OpenAI per optimitzar l'estructura del vostre prompt i maximitzar la reutilització de la memòria cau.

### Utilitzat per

- [Node LLM](../nodes/llm-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Node RAG](../nodes/rag-node.md) (embeddings d'OpenAI mitjançant la credencial de Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) és un servidor intermediari per eludir Cloudflare i desafiaments similars de protecció contra bots.

### Camps obligatoris

| Camp | Descripció |
|-------|-------------|
| `flaresolverr_url` | URL de la vostra instància de FlareSolverr (p. ex. `http://localhost:8191`) |

Aquí s'admeten adreces de bucle de retorn i privades, de manera que executar FlareSolverr al costat de Heym funciona tal com es documenta. L'URL no pot resoldre's a una adreça link-local ni de metadades del núvol. Com que s'admeten adreces privades, aquest camp també es pot apuntar a un altre servei intern i la resposta torna a la sortida del node. Qualsevol usuari autenticat pot crear aquesta credencial, de manera que el límit és qui pot crear workflows més les vostres regles de xarxa, no la compartició de credencials. Vegeu [Seguretat de sortida](../nodes/crawler-node.md#egress-safety).

### Utilitzat per

- [Node Crawler](../nodes/crawler-node.md)

---

## Relacionat

- [Credencials](./credentials.md) – Visió general de les credencials i com les utilitzen els nodes
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu i gestioneu credencials
- [Compartició de credencials](./credentials-sharing.md) – Compartiu credencials amb usuaris i equips
- [Seguretat](./security.md) – Xifratge en repòs, control d'accés
- [Expression DSL](./expression-dsl.md) – Sintaxi `$credentials` per a accés dinàmic

---

## Model Router (Auto Model)

Encamina cada sol·licitud a una de les vostres credencials de model existents, utilitzant un model de decisió per
triar-ne una. Emmagatzema referències, mai una clau pròpia.

### Camps obligatoris

- `decision_credential_id` – una credencial de **Decision Model** a la qual tingueu accés.
- `decision_model` – el model que fa la crida d'encaminament, per exemple `jev-latest`.
- `options` – com a mínim dues entrades, cadascuna amb un nom, una de les vostres credencials OpenAI/Google/Custom,
  un model sobre aquesta, i criteris que indiquin quan hauria de guanyar.

### Camps opcionals

- `routing_instructions` – com ponderar les opcions en conjunt.
- Una opció es pot marcar com la de reserva utilitzada quan l'encaminament falla.

### Notes

Els noms de les opcions són allò entre què tria el model de decisió, de manera que han de ser diferents. Una
opció no pot apuntar a un altre Model Router.
