# Kolmandate osapoolte integratsioonid

Heym ühendub välisteenustega **mandaatide** kaudu. Iga mandaadi tüüp salvestab ühe teenuse ühenduse üksikasjad ja seda saab uuesti kasutada mitmes sõlmes ja workflow's. Ülevaate saamiseks vaadake jaotist [Mandaadid](./credentials.md).

Lisage mandaadid jaotises [Seaded → Mandaadid](../tabs/credentials-tab.md). Kõik väärtused on salvestamisel krüpteeritud. Mandaate saab [jagada](./credentials-sharing.md) teiste kasutajatega või [Tühmadega](./teams.md).

Mõned integratsioonisõlmed **ei** vaja mandaate. [WebSocket Trigger](../nodes/websocket-trigger-node.md) ja [WebSocket Send](../nodes/websocket-send-node.md) ühenduvad väliste socketitega, kasutades otse sõlmel konfigureeritud URL-i, päiseid ja alamp rotokolle.

## Mandaatide tüübid ülevaatlikult

| Tüüp | Kasutaja | Põhiväljad |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, valikuline `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, valikuline `base_url` |
| **Jira** | [Jira node](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (ainult Basic auth), valikuline `api_version` |
| **Linear** | [Linear node](../nodes/linear-node.md) | `api_key` või `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry node](../nodes/sentry-node.md) | `api_token`, valikuline `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Hindamised](../tabs/evals-tab.md) (LLM-as-Judge kohtunik) | `base_url`, valikuline `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI vaikeväärtused | decision model mandaat, millele lisanduvad mudelivalikud, mis viitavad teie teistele mandaatidele |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorhoidlad | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorhoidlad | `openai_api_key` (vektorid salvestatakse Heymi enda Postgresi pgvectori kaudu) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorhoidlad | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, valikuline `embedding_api_key`, lisaks `qdrant_host`, kui `db_type` on `qdrant` |
| **Grist** | [Grist node](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets node](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 nõusolek |
| **Google Drive** | [Google Drive node](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 nõusolek (täielik Drive'i ulatus) |
| **BigQuery** | [BigQuery node](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 nõusolek |
| **Supabase** | [Supabase node](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, valikuline `supabase_schema` |
| **ClickHouse** | [ClickHouse node](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion node](../nodes/notion-node.md) | `api_token` või `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 node](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger node](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger node](../nodes/telegram-trigger-node.md), [Telegram node](../nodes/telegram-node.md) | `bot_token`, valikuline `secret_token` |
| **Discord** | [Discord node](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger node](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ node](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis node](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack node](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger node](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP node](../nodes/http-node.md) | `token` |
| **Header** | [HTTP node](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler node](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHubi mandaat salvestab GitHubi isikliku juurdepääsutokeni (PAT), et workflow'd saaksid GitHubi REST API-t kutsuda [GitHub node'i](../nodes/github-node.md) kaudu, edastada tokeni MCP-serveritele nagu `@modelcontextprotocol/server-github` või kasutada seda [HTTP node'ist](../nodes/http-node.md) kohandatud REST-kutsete jaoks.

### Nõutavad väljad

| Väli | Kirjeldus |
|------|-----------|
| `api_key` | GitHubi isiklik juurdepääsutoken (peeneteraline PAT `github_pat_...` või klassikaline PAT `ghp_...`) |
### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `base_url` | GitHub API baas-URL GitHub Enterprise Serveri jaoks (näiteks `https://github.example.com/api/v3`) |

### Märkused

- Peeneteralisi isiklikke juurdepääsu-tokeneid (fine-grained personal access tokens) soovitatakse võimaluse korral, sest neid saab piirata konkreetsete hoidlate ja õigustega.
- Jätke `base_url` tühjaks GitHub.comi jaoks. GitHub Enterprise Serveri puhul kasutage täielikku REST API
  endpointi, sealhulgas `/api/v3` (näiteks `https://github.example.com/api/v3`), mitte
  serveri veebiliidese juurt, nagu `https://github.example.com`.
- See mandaat modelleerib praegu ainult PAT-põhist autentimist. Organisatsiooni hoidlatele juurdepääsuks kasutage PAT-i, millele on antud vajalikud organisatsiooni/hoidla õigused.
- GitHub App installatsiooni-tokenid ja GitHub App seadistamise voogud ei ole Heymi UI-s praegu esmaklassilised.
- Eelistage [GitHub node'i](../nodes/github-node.md) natiivsete hoidla-, kasutaja-, issue'de, pull request'ide, ülevaatuste, release'ide, Actions workflow'de, liikluse ja failitoimingute jaoks. Kasutage [HTTP node'i](../nodes/http-node.md) ainult siis, kui vajate endpointe või payload'e, mida GitHub node ei kata.
- Kasutage [Agent node'i](../nodes/agent-node.md) koos MCP-ga, edastades `$credentials.YourGitHubCredential` MCP-ühenduse keskkonnamuutujasse, nagu `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHubi REST API eeldab tavaliselt `Authorization: Bearer <token>` pluss `Accept: application/vnd.github+json`.
- GitHubi mandaadi muutmisel säilitab GitHub Enterprise `base_url` tühjaks jätmine
  olemasoleva endpointi. Sisestage uus URL ainult siis, kui soovite seda endpointi muuta.

### Kasutavad

- [GitHub node](../nodes/github-node.md)
- [Codex node](../nodes/codex-node.md)
- [Agent node](../nodes/agent-node.md)
- [HTTP node](../nodes/http-node.md)

---

## Otsustusmudel

Otsustusmudel vastab oleku kohta esitatud tüübistatud küsimustele ja tagastab teksti asemel tõenäosused. TypeSafe'i Jev on referentsimplementatsioon; iga endpoint, mis võtab vastu sama `{model, state, questions}` keha, töötab, ja [Decision](../nodes/decision-node.md) node saab saata käsitsi kirjutatud keha sellise jaoks, mis ei tööta.

### Nõutud väljad

- `base_url` – endpoint, näiteks `https://api.typesafe.ai`. Heym lisab juurde `/v1/systemone`.

### Valikulised väljad

- `api_key` – saadetakse kujul `Authorization: Bearer`. Endpointid, mis võtit ei vaja, võivad selle tühjaks jätta.

### Märkused

- **Test Connection** saadab ühe väikese küsimuse, et kinnitada endpointi ja võtme toimimist.
- Mandaadi muutmisel säilib salvestatud võti, kui võtmeväli jäetakse tühjaks.
- Väljuvad päringud privaatsetele ja loopback-aadressidele on vaikimisi blokeeritud, seega isemajutatud endpoint `localhost`-il või privaatses vahemikus vajab `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Need mudelid puuduvad LLM-i hinnatabelitest, mida Heym sünkroonib, seega Cost-veerg [Traces](../tabs/traces-tab.md) jääb tühjaks. Tokenite arvud registreeritakse siiski.

### Kasutavad

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – hindab `LLM-as-Judge` vastuseid oodatud väljundi suhtes

## OpenAI Codex

OpenAI Codex mandaat autendib [Codex node'i](../nodes/codex-node.md). See on eraldiseisev OpenAI API võtme mandaadist, mida kasutavad LLM-, Agent- ja RAG-noded.

### Autentimisrežiimid

| Režiim | Kirjeldus |
|------|-------------|
| **Sign in with ChatGPT** (soovitatav) | OAuth (PKCE) sisselogimine, mis kasutab Teie ChatGPT Plus/Pro tellimust, nii et käivitused väldivad tokenipõhiseid API kulusid. Heym salvestab ja värskendab automaatselt tokeni komplekti. |
| **Access token** | ChatGPT/Codex `access_token`, mis edastatakse ainult kohalikule Codex CLI protsessile. |

### Märkused

- API võtmed lükatakse selle mandaadi tüübi puhul tagasi.
- Codex tokenid ei ole kättesaadavad `$credentials.Name` kaudu.
- Codex node vajab lisaks GitHubi mandaati hoidla kloonimiseks, haru push'imiseks ja draft PR-i loomiseks.

### Kasutavad

- [Codex node](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go mandaat autendib [OpenCode Go node'i](../nodes/opencode-go-node.md). See salvestab OpenCode Go gateway API võtme (aadressilt [opencode.ai/go](https://opencode.ai/go)) ja valikulise gateway baas-URL-i.

### Väljad

| Väli | Kirjeldus |
|-------|-------------|
| **API Key** | OpenCode Go gateway API võti (nõutud). |
| **Gateway Base URL** | Valikuline; vaikimisi `https://opencode.ai/zen/go/v1`. Alistage ainult isemajutatud või puhverserveri kaudu käitatava gateway puhul. |

### Märkused

- API võti edastatakse ainult OpenCode CLI protsessile kõvistatud konteineri sees.
- OpenCode Go node vajab lisaks GitHubi mandaati hoidla kloonimiseks, haru push'imiseks ja pull request'i loomiseks. GitHubi tokenit ei asetata kunagi sandbox-konteineri sisse.

### Kasutavad

- [OpenCode Go node](../nodes/opencode-go-node.md)

---

## Linear

Linear mandaat toetab kas isiklikku API võtit või OAuth2-t
[Linear node'i](../nodes/linear-node.md) jaoks. Heym saadab Linearile natiivseid GraphQL-päringuid tööruumi
metaandmete, projektide, issue'de ja kommentaaride jaoks.
### Seadistamine

Valige üks autentimisviis:

**Isiklik API-võti**

1. Avage Linearis **Settings → Security & Access → Personal API keys**.
2. Looge võti, millel on juurdepääs tööruumile, mida soovite automatiseerida.
3. Kleepige võti Heymis asuvasse Linear mandaati ja kasutage kinnitamiseks **Test Connection**.

**OAuth2**

1. Looge Linear OAuth rakendus.
2. Registreerige ümbersuunamise URI-na `{FRONTEND_URL}/api/credentials/linear/oauth/callback`.
3. Heym Dashboard → **Mandaadid** → **Uus** → tüüp **Linear**.
4. Valige **OAuth2**, sisestage Client ID ja Client Secret, seejärel klõpsake **Connect**.

### Kohustuslikud väljad

| Viis | Väli | Kirjeldus |
|------|-------|-------------|
| Isiklik API-võti | `api_key` | Linear isiklik API-võti, tavaliselt eesliitega `lin_api_` |
| OAuth2 | `client_id` | Client ID Linear OAuth rakendusest |
| OAuth2 | `client_secret` | Client Secret Linear OAuth rakendusest |

OAuth tokenid (`access_token`, `refresh_token`, `token_expiry`) salvestatakse ja värskendatakse automaatselt.

### Märkused

- Isiklikud API-võtmed ja OAuth tokenid toimivad selle Linear kasutajana, kes need lõi või volitas.
- Linear OAuth kasutab skoope `read,write,issues:create,comments:create`.
- Kasutage mandaadi dialoogis **Test Connection**, et kinnitada API-võtit või OAuth tokenit Linear API vastu.
- Kasutage Linear node'is List Teams ja List Projects, et avastada UUID-sid enne issue'de loomist või filtreerimist.
- Kasutage List Workflow States ja List Team Members, et avastada state ja assignee UUID-sid uuenduste jaoks.
- API-võtme vahetamiseks muutke mandaati ja sisestage asendusväärtus. Kui vahetate OAuth rakenduse saladusi, ühendage mandaat uuesti **Connect** kaudu.

### Kasutab

- [Linear node](../nodes/linear-node.md)

---

## Jira

Jira mandaat salvestab Jira Basic auth mandaadid või Data Centeri isikliku juurdepääsutokeni, Jira saidi baas-URL-i, juurutusviisi ja valikulise REST API versiooni [Jira node](../nodes/jira-node.md) jaoks. Kasutage `cloud` Jira Cloudi jaoks või `data_center` Jira Data Center / Serveri jaoks.

### Seadistamine

**Jira Cloud**

1. Looge Atlassiani konto seadetes API token.
2. Heym Dashboard → **Mandaadid** → **Uus** → tüüp **Jira**.
3. Sisestage Atlassiani e-posti aadress, API token ja Jira saidi URL, näiteks `https://your-domain.atlassian.net`.
4. Kasutage mandaadi kinnitamiseks **Test Connection**.

**Jira Data Center / Server**

1. Valige juurutuseks **Jira Data Center / Server**.
2. Valige autentimismeetod. **Kasutajanimi ja parool** kasutab Basic authi. **Personal Access Token** kasutab vormingut `Authorization: Bearer <token>` ja nõuab versiooni Jira Data Center / Server 8.14 või uuemat. Looge token Jiras jaotises **Profiil → Personal Access Tokens**.
3. Sisestage Jira kasutajanimi ja parool või kleepige isiklik juurdepääsutoken (kasutajanime pole vaja).
4. Sisestage Jira saidi URL, näiteks `https://jira.example.com`.
5. Kasutage mandaadi kinnitamiseks nuppu **Test Connection**.

### Väljad

| Väli | Kirjeldus |
| --- | --- |
| `auth_mode` | `basic` (vaikimisi puudumisel) või `pat`. `pat` on kehtiv ainult koos `data_center` |
| `email` | Jira Cloud Atlassiani konto e-posti aadress või Jira Data Center / Server kasutajanimi. Režiimis `pat` ei kasutata |
| `api_token` | Jira Cloud Atlassiani API token, Jira Data Center / Server parool Basic authi jaoks või Data Centeri isiklik juurdepääsutoken režiimis `pat` |
| `base_url` | Jira saidi baas-URL |
| `deployment` | `cloud` Jira Cloudi jaoks või `data_center` Jira Data Center / Serveri jaoks |
| `api_version` | REST API versioon; vaikimisi `3` Jira Cloudi jaoks. Data Center / Server kasutab v2 |
| `email` | Jira Cloud Atlassiani konto e-posti aadress või Jira Data Center / Serveri kasutajanimi |

### Märkused

- Jira node saadab issue kirjeldused ja kommentaarid Atlassian Document Format tekstidokumentidena Jira Cloud REST API v3 jaoks. Data Center / Serveri mandaadid saadavad lihtteksti.
- Data Center / Server toetab kasutajanime/parooliga Basic authi ja isikliku juurdepääsutokeniga (PAT) autentimist skeemiga Bearer. PAT-autentimine nõuab versiooni Jira Data Center / Server 8.14 või uuemat.
- Manuse üleslaadimine aktsepteerib base64 või data URL sisu ja selle suhtes kehtib platvormi failisuuruse piirang (vaikimisi 99 MB). Manuse allalaadimine võib tagastada base64 sisu, kui see on lubatud.
- Kasutaja loomine, kustutamine ja issue teavitused nõuavad, et autenditud Jira kontol oleksid asjakohased Jira saidi või organisatsiooni õigused.
- Kasutage List Projects, Search Issues ja List Transitions, et avastada projekti võtmeid, issue võtmeid ja ülemineku ID-sid.
- Kohandatud endpointide puhul, mida Jira node ei kata, kasutage [HTTP node'i](../nodes/http-node.md) koos Jira Basic Authiga (`email:api_token` Cloudi jaoks või `username:password` Data Center / Serveri jaoks) või PAT Bearer authiga (`Authorization: Bearer <token>` Data Center / Serveri jaoks). Teise võimalusena kasutage Header mandaati koos sobiva `Authorization` päisega.

Vaata ka:

- [Jira node](../nodes/jira-node.md)
- [Mandaadid](./credentials.md)

---

## Sentry

Sentry mandaat salvestab auth tokeni [Sentry node](../nodes/sentry-node.md) jaoks. Heym kasutab Sentry REST API-t organisatsiooni, projekti, meeskonna, issue, sündmuse ja väljalaske toimingute jaoks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `api_token` | Sentry auth token, millel on juurdepääs organisatsioonidele ja projektidele, mida automatiseerite |

### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `base_url` | Valikuline juur-URL isemajutatud Sentry jaoks, näiteks `https://sentry.example.com` |

### Märkused

- Jätke `base_url` tühjaks Sentry SaaS jaoks.
- Kasutage **Test Connection**, et kinnitada, et token suudab loetleda nähtavaid organisatsioone.
- Kohandatud REST päringute jaoks kasutage bearer tokenina `$credentials.YourSentryCredential`.

### Kasutab

- [Sentry node](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) on avatud lähtekoodiga vektorandmebaas, mida kasutatakse semantiliseks otsinguks ja RAG (Retrieval Augmented Generation) jaoks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `qdrant_host` | Täielik URL teie Qdrant instantsile (nt `http://localhost:6333` või cloud endpoint) |
| `openai_api_key` | OpenAI API-võti, mida kasutatakse embeddings'ide genereerimiseks dokumentide indekseerimisel ja otsimisel |
### Märkused

- Qdranti kollektsioone hallatakse vahekaardil [Vektorhoidlad](../tabs/vectorstores-tab.md). Iga vektorhoidla vastab ühele Qdranti kollektsioonile.
- [RAG node](../nodes/rag-node.md) kasutab vektorhoidlat (mis viitab Qdranti mandaadile) — see ei viita mandaadile otse.
- Kui Teie Qdranti instants nõuab API-võtit, lisage see väärtusesse `qdrant_host` või konfigureerige Qdranti vastavalt; praegusel integratsioonil puudub eraldi Qdranti API-võtme väli.
- Isehostitud Qdrant: kasutage [ametlikku Dockeri image'it](https://hub.docker.com/r/qdrant/qdrant) ja avage port `6333`.

### Kasutavad

- [RAG node](../nodes/rag-node.md) (vektorhoidla kaudu)
- [Vektorhoidlate vahekaart](../tabs/vectorstores-tab.md)

## Kohandatud embeddings'id (RAG)

Vaikimisi pärinevad RAG embeddings'id OpenAI-lt. Mandaat **RAG: Custom Embeddings**
osutab hoopis mis tahes OpenAI-ga ühilduvale embeddings'ite endpoint'ile — Ollama, vLLM,
Text Embeddings Inference, LM Studio, Together või hostitud gateway — ja määrab
vektorhoidla, kuhu see kirjutab.

### Nõutavad väljad

| Väli | Kirjeldus |
|-------|-------------|
| `embedding_base_url` | Endpoint'i URL koos `/v1` teega, nt `http://localhost:11434/v1` |
| `embedding_api_key` | Valikuline. Kohalikud serverid tavaliselt võtit ei vaja |
| `embedding_model` | Mudeli nimi nii, nagu endpoint seda ootab, nt `nomic-embed-text` |
| `embedding_dimensions` | Mudeli tagastatav vektori laius (vaikimisi `1536`) |
| `embedding_request_dimensions` | Valikuline. Paluge endpoint'il tagastada `embedding_dimensions` mudeli loomuliku laiuse asemel |
| `db_type` | `qdrant` või `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdranti ühendus, nõutav, kui `db_type` on `qdrant` |

### Märkused

- **Qdrant aktsepteerib mis tahes dimensioonide arvu.** Iga kollektsioon luuakse selle
  laiusega, mille see mandaat deklareerib, seega on Dimensioonide väli vabalt muudetav.
- **Postgres (pgvector) nõuab täpselt 1536 dimensiooni.** Selle veerg on fikseeritud
  `vector(1536)`, seega on Dimensioonide väli kinnitatud 1536-le ja mis tahes muu laiust
  deklareeriv mandaat lükatakse salvestamise ajal tagasi.
- **Lühendamine pgvectori jaoks.** Kui hoidla on Postgres, pakub dialoog *Ask the
  endpoint to return 1536 dimensions*. See saadab `dimensions` päringu parameetri,
  mida Matryoshka esitustega treenitud mudelid (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` ja sarnased) järgivad, tagastades lühendatud,
  kuid endiselt tähendusliku vektori. Endpoint'id, mis seda parameetrit ei toeta,
  lükkavad päringu tagasi, ja endpoint'id, mis selle vastu võtavad, kuid eiravad,
  tekitavad selge vea, milles on nimetatud tegelikult tagastatud laius. Heym ei
  kärbi vektoreid kunagi ise, sest mitte-Matryoshka mudeli väljundi lõikamine
  halvendab otsingu kvaliteeti märkamatult. Seda valikut Qdranti jaoks ei pakuta,
  kuna see suudab kollektsiooni mõõta mis tahes laiusele.
- Kasutage mandaadi dialoogis **Test Connection**, et embeddida proovistring ja näha
  laiust, mille mudel tegelikult tagastab, enne hoidla loomist.
- `dimensions` päringu parameeter saadetakse ainult OpenAI-le endale, kuna enamik
  OpenAI-ga ühilduvaid servereid lükkab tundmatud parameetrid tagasi. Mudeli loomulikku
  laiust valideeritakse seevastu mandaadi vastu.
- Olemasolevad mandaadid **RAG: Qdrant + OpenAI** ja **RAG: Psql + OpenAI** on
  muutumatud ja töötavad edasi.

### Kasutavad

- [RAG node](../nodes/rag-node.md) (vektorhoidla kaudu)
- [Vektorhoidlate vahekaart](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym saab vektoreid salvestada ka **oma Postgres andmebaasi**,
kasutades [pgvector](https://github.com/pgvector/pgvector) laiendust — välist
vektoriteenust pole vaja. Looge mandaat **RAG: Psql + OpenAI** ja kasutage seda
vektorhoidla loomisel, seejärel valige RAG node'i Database rippmenüüs
**Postgres (pgvector)**.

### Nõutavad väljad

| Väli | Kirjeldus |
|-------|-------------|
| `openai_api_key` | OpenAI API-võti, mida kasutatakse embeddings'ite genereerimiseks dokumentide indekseerimisel ja otsimisel |

### Märkused

- Host'i/port'i pole vaja — vektorid kirjutatakse Heymi enda andmebaasi; Heym ei ühendu kunagi teise andmebaasiga.
- Kõik Qdrantiga saadaolevad RAG funktsioonid (sisestamine, otsing, metaandmete filtrid, Cohere ümberjärjestamine, kloonimine, jagamine) töötavad Postgresi taustaprogrammiga identselt.
- Nõuab `vector` laiendust. Heym hoiab ametlikku `postgres:16` image'it muutumatuna (nii et olemasolevaid andmeid ei puudutata kunagi) ja **installib automaatselt `postgresql-16-pgvector` paketi käivitumisel** — `run.sh`, `deploy.sh` ja `run_e2e.sh` käsitlevad seda kõik. Installimine ei ole fataalne: kui seda ei saa käivitada (nt võrgu puudumisel), jätkab Qdrant RAG töötamist ja Postgresi taustaprogramm jääb mitteaktiivseks (migratsioon jätab tabeli sujuvalt vahele).
- Kui käitate avaldatud ühe konteineri image'it (`ghcr.io/heymrun/heym`) **oma välise Postgresi** vastu, peab see andmebaas toetama `vector` laiendust (Heym ei saa seda installida andmebaasi, mida ta ei halda). Ilma selleta tagastab Postgresi vektorhoidlasse loomine või üleslaadimine selge sõnumi ja Qdrant RAG jätkab töötamist.

### Kasutavad

- [RAG node](../nodes/rag-node.md) (vektorhoidla kaudu)
- [Vektorhoidlate vahekaart](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) on arvutustabeli/andmebaasi hübriid, mis toetab struktureeritud andmeid ja valemeid. Gristi mandaat võimaldab Heymil Gristi dokumente lugeda ja kirjutada.
### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `api_key` | Grist API võti (leiate oma Gristi instantsi vahekaardilt **Profile → API Key**) |
| `server_url` | Teie Gristi serveri baas-URL (nt `https://docs.getgrist.com` Grist Cloudi puhul või teie isemajutatud URL) |

### Märkused

- [Grist node](../nodes/grist-node.md) nõuab oma konfiguratsioonis **Document ID**-d (Gristi dokumendi URL-ist) ja **Table ID**-d — need ei ole mandaadi osa.
- Isemajutatud Gristi puhul määrake `server_url` oma instantsi domeeniks.
- Gristi veeru ID-d kasutavad alljooni (nt `User_Name`), mitte kuvatavaid silte. Nende avastamiseks kasutage toimingut `listColumns`.

### Kasutab

- [Grist node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheetsi mandaat ühendab Heymi Google Sheetsi API-ga, kasutades OAuth2 "Bring Your Own App" mudelit. Te esitate Google Cloudi OAuth2 Client ID ja Client Secreti ning seejärel autoriseerite juurdepääsu brauseri hüpikakna kaudu. Tokenid uuendatakse taustal automaatselt.

### Seadistamine

1. Avage [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → otsige ja lubage **Google Sheets API**.
2. Minge jaotisse **Credentials** → **Create Credentials** → **OAuth client ID** → rakenduse tüüp **Web application**.
3. Jaotises **Authorized redirect URIs** lisage: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopeerige loodud **Client ID** ja **Client Secret**.
5. Heymi juhtpaneelil → **Credentials** → **New** → tüüp **Google Sheets (OAuth2)**.
6. Sisestage Client ID, Client Secret ja nimi, seejärel klõpsake nupul **Connect**, et avada Google'i nõusoleku hüpikaken ja autoriseerida juurdepääs.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `client_id` | OAuth2 Client ID Google Cloud Console'ist |
| `client_secret` | OAuth2 Client Secret Google Cloud Console'ist |

Tokenid (`access_token`, `refresh_token`, `token_expiry`) salvestatakse ja uuendatakse automaatselt — te ei halda neid otseselt.

### Märkused

- OAuth2 nõusoleku ekraan nõuab spreadsheetsi skoopi (`https://www.googleapis.com/auth/spreadsheets`).
- Heym kasutab refresh tokenit uute access tokenite hankimiseks enne nende aegumist (60-sekundiline turvapuhver).
- Kui pöörate Client Secreti Google Cloud Console'is, ühendage mandaat uuesti nupu **Connect** kaudu.
- **Tootmine:** Määrake backend'i **`FRONTEND_URL`** täpseks avalikuks URL-iks, mille kasutajad brauseris avavad (skeem + host, nt `https://heym.example.com`). Heym koostab Google'i OAuthi ümbersuunamise URI ainult selle väärtuse põhjal — see **ei** usalda `Origin` ega `X-Forwarded-*` päiseid (kliendi poolt juhitavad). Registreerige `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` Google Cloud Console'is.

### Kasutab

- [Google Sheets node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive'i mandaat ühendab Heymi Google Drive'i API-ga, kasutades sama OAuth2 "Bring Your Own App" mudelit nagu Google Sheetsi puhul. Te esitate Google Cloudi OAuth2 Client ID ja Client Secreti ning seejärel autoriseerite juurdepääsu brauseri hüpikakna kaudu. Tokenid uuendatakse taustal automaatselt.

### Seadistamine

1. Avage [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → otsige ja lubage **Google Drive API**.
2. Minge jaotisse **Credentials** → **Create Credentials** → **OAuth client ID** → rakenduse tüüp **Web application**.
3. Jaotises **Authorized redirect URIs** lisage: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopeerige loodud **Client ID** ja **Client Secret**.
5. Heymi juhtpaneelil → **Credentials** → **New** → tüüp **Google Drive (OAuth2)**.
6. Sisestage Client ID, Client Secret ja nimi, seejärel klõpsake nupul **Connect**, et avada Google'i nõusoleku hüpikaken ja autoriseerida juurdepääs.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `client_id` | OAuth2 Client ID Google Cloud Console'ist |
| `client_secret` | OAuth2 Client Secret Google Cloud Console'ist |

Tokenid (`access_token`, `refresh_token`, `token_expiry`) salvestatakse ja uuendatakse automaatselt — te ei halda neid otseselt.

### Skoop

Google Drive taotleb **täielikku Drive'i skoopi** (`https://www.googleapis.com/auth/drive`).

See on vajalik, kuna node töötab failidega, mis on juba teie omanduses. Kitsam skoop `drive.file` annab juurdepääsu ainult failidele, mille on loonud OAuthi klient ise, mistõttu näeksid `listFolderFiles`, `updateFile`, `removeFile` ja `removeFolder` teie olemasolevast Drive'ist mitte midagi.

Kuna te esitate oma Client ID ja Secreti oma Google Cloudi projektist, kehtivad selle skoobi Google'i rakenduse kinnitamise nõuded teie projektile, mitte Heymile.

### Märkused

- Heym kasutab refresh tokenit uute access tokenite hankimiseks enne nende aegumist (60-sekundiline turvapuhver).
- Kui pöörate Client Secreti Google Cloud Console'is, ühendage mandaat uuesti nupu **Connect** kaudu.
- Jagatud draivid on toetatud — node määrab `supportsAllDrives` igal API-kutsel.
- **Tootmine:** Määrake backend'i **`FRONTEND_URL`** täpseks avalikuks URL-iks, mille kasutajad brauseris avavad. Heym koostab Google'i OAuthi ümbersuunamise URI ainult selle väärtuse põhjal — see **ei** usalda `Origin` ega `X-Forwarded-*` päiseid. Registreerige `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` Google Cloud Console'is.
- Enne selle mandaadi meeskonnaga jagamist vaadake jaotist [Credential Sharing](./credentials-sharing.md).

### Kasutab

- [Google Drive node](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery mandaat ühendab Heymi Google BigQuery API-ga, kasutades OAuth2 "Bring Your Own App" mudelit. Te esitate Google Cloud OAuth2 Client ID ja Client Secret, seejärel autoriseerite juurdepääsu brauseri hüpikakna kaudu. Tokenid uuendatakse automaatselt taustal.

### Seadistamine

1. Avage [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → otsige ja lubage **BigQuery API**.
2. Minge jaotisse **Credentials** → **Create Credentials** → **OAuth client ID** → rakenduse tüüp **Web application**.
3. Jaotises **Authorized redirect URIs** lisage: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopeerige loodud **Client ID** ja **Client Secret**.
5. Heymi töölaual → **Mandaadid** → **Uus** → tüüp **BigQuery (OAuth2)**.
6. Sisestage Client ID, Client Secret ja nimi, seejärel klõpsake **Connect**, et avada Google'i nõusoleku hüpikaken ja autoriseerida juurdepääs.

### Nõutavad väljad

| Väli | Kirjeldus |
|-------|-------------|
| `client_id` | OAuth2 Client ID Google Cloud Console'ist |
| `client_secret` | OAuth2 Client Secret Google Cloud Console'ist |

Tokenid (`access_token`, `refresh_token`, `token_expiry`) salvestatakse ja uuendatakse automaatselt.

### Märkused

- OAuth2 nõusoleku ekraan nõuab BigQuery skoopi (`https://www.googleapis.com/auth/bigquery`).
- **Tootmine:** määrake backend'i **`FRONTEND_URL`** avalikule URL-ile. Registreerige `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` Google Cloud Console'is.

### Kasutab

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Supabase'i mandaat ühendab Heymi Supabase'i projekti PostgREST API-ga, et workflow'd saaksid pärida ja muuta Postgresi-põhiseid tabeleid.

### Nõutavad väljad

| Väli | Kirjeldus |
|-------|-------------|
| `supabase_url` | Projekti baas-URL, näiteks `https://your-project.supabase.co` |
| `supabase_key` | API võti juurdepääsuga sihttabelitele |
| `supabase_schema` | Valikuline vaikimisi skeem (vaikimisi `public`) |

### Märkused

- [Supabase node](../nodes/supabase-node.md) suhtleb aadressiga `/rest/v1/<table>` ja toetab operaatorfiltreid (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` ja seotud PostgREST operaatoreid) ning pesastatud `or` / `and` loogilisi gruppe.
- Kirjutustoimingute puhul eelistage võtit, mis on mõeldud usaldusväärseks serveripoolseks kasutuseks minimaalsete vajalike tabeliõigustega.
- Sõlmed saavad skeemi sammu kaupa üle kirjutada isegi siis, kui mandaat määratleb vaikimisi skeemi.

### Kasutab

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

ClickHouse'i mandaat ühendab Heymi välise ClickHouse'i andmebaasiga selle HTTP-liidese kaudu, et workflow'd saaksid käitada SQL-, CRUD- ja loendustoiminguid OLAP-tabelite vastu.

### Nõutavad väljad

| Väli | Kirjeldus |
|-------|-------------|
| `host` | HTTP host ilma skeemita, näiteks `your-instance.clickhouse.cloud` |
| `port` | HTTP-liidese port (`8443` HTTPS-i jaoks, `8123` HTTP jaoks) |
| `username` | ClickHouse'i kasutaja (vaikimisi `default`) |
| `password` | Kasutaja parool (valikuline) |
| `database` | Sihtandmebaas (vaikimisi `default`) |
| `secure` | Kasuta HTTPS-i, kui `true` (nõutav ClickHouse Cloudi jaoks) |

### Märkused

- [ClickHouse node](../nodes/clickhouse-node.md) kasutab ametlikku `clickhouse-connect` HTTP klienti ning parameteriseerib filtrite ja väärtuste sidumised.
- `update` ja `remove` vastenduvad `ALTER TABLE ... UPDATE` ja `DELETE FROM`-iga, mis on asünkroonsed ClickHouse'i mutatsioonid; mõlemad nõuavad filtrit.
- `upsert` teostab `INSERT`-i ja eeldab `ReplacingMergeTree` tabelit võtme järgi liitmise käitumiseks.
- Kasutage mandaadi dialoogis **Test connection**, et kontrollida kättesaadavust.

### Kasutab

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Notioni mandaat toetab kas sisemise integratsiooni tokenit või avaliku integratsiooni OAuth-ühendust. OAuth võimaldab igal kasutajal autoriseerida Notioni tööruumi Heymist, selle asemel et tokenit käsitsi kopeerida.

### Nõutavad väljad

| Režiim | Väli | Kirjeldus |
|------|-------|-------------|
| Sisemine token | `api_token` | Sisemise integratsiooni token (`ntn_...`) |
| OAuth | `client_id` | Client ID Notioni avalikust integratsioonist |
| OAuth | `client_secret` | Client Secret Notioni avalikust integratsioonist |

OAuthi callback salvestab automaatselt `access_token`, `auth_mode`, `workspace_id`, `workspace_name` ja `bot_id`. Kui OAuth lõpetatakse, eemaldatakse eelmine sisemine `api_token`. Registreerige see ümbersuunamise URI Notionis:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuthi seadistamise voog

1. Valige mandaadi dialoogis **OAuth**, sisestage nimi, Client ID ja Client Secret.
2. Klõpsake **Connect** ja autoriseerige tööruum Notioni hüpikaknas.
   - **Uue** mandaadi puhul loob Heym mandaadi kirje, kui klõpsate **Connect**.
   - Lõpetage autoriseerimine hüpikaknas, seejärel klõpsake **Save**, et naasta mandaatide loendisse.
3. Ühendatud mandaat kuvab loendis `connected (Workspace Name)`. Ootel OAuth-mandaadid kuvavad `Not connected`, kuni autoriseerimine lõpeb.

Kasutage mandaadi dialoogis **Test Connection**, et kontrollida kas sisemist tokenit või lõpetatud OAuth-autoriseerimist. Muutmisel jätab tokeni välja tühjaks jätmine salvestatud sisemise tokeni alles.

Nii sisemised tokenid kui ka OAuthi juurdepääsu tokenid on kättesaadavad `$credentials.CredentialName` kaudu kohandatud [HTTP](../nodes/http-node.md) päringute jaoks, mis vajavad Notioni bearer-tokenit.
### Märkused

- Sisemised integratsioonid nõuavad asjakohaste lehtede, andmebaaside ja andmeallikate jagamist.
- OAuth-kasutajad valivad tööruumi/lehed Notioni autoriseerimise käigus.
- OAuth-rakenduse mandaadid krüptitakse Notioni mandaadi sees. Callback laeb need serveripoolselt uuesti; saladus ei ole OAuthi olekusse kaasatud.
- Ühendatud OAuth-mandaadid kuvavad tööruumi nime; ootel OAuth-mandaadid näitavad `Not connected`, kuni autoriseerimine on lõpule viidud.
- **Tootmine:** Määrake backend'i **`FRONTEND_URL`** avalikule brauseri URL-ile (skeem + host, ilma lõpus oleva kaldkriipsuta). Notioni redirect URI peab täpselt vastama:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Sõlm kasutab API versiooni `2026-03-11` ja kehtivat `data_source` terminoloogiat. Vt [Notioni sõlme](../nodes/notion-node.md#api-version-notes) artiklit migreerimisjuhiste saamiseks vanematest `archived`, `after` või andmebaasi-päringu näidetest.
- Vanad otsingufiltrid objektiväärtusega `database` normaliseeritakse väärtuseks `data_source`.

### Kasutavad

- [Notioni sõlm](../nodes/notion-node.md)

---

## SMTP (e-post)

SMTP-mandaat salvestab e-posti serveri ühenduse üksikasjad väljuvate kirjade saatmiseks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `host` | SMTP serveri hostinimi (nt `smtp.gmail.com`) |
| `port` | SMTP port (tavaliselt `587` STARTTLS jaoks, `465` SSL jaoks) |
| `email` | Kasutajanimi, millega SMTP-server sisse logib; ühtlasi nähtav saatja, kui `from` on tühi |
| `password` | SMTP parool või rakenduse parool |

### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `from` (`smtp_from`) | Nähtav saatja (From) aadress. Jätke tühjaks, et saata kui `email`. Server logib endiselt sisse kui `email`, seega peab sellel kontol olema luba sellelt aadressilt saata (Gmailis kinnitatud **Saada kiri nimega** alias). |

### Levinumad SMTP-teenusepakkujad

| Teenusepakkuja | Host | Port | Märkused |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Nõuab [rakenduse parooli](https://support.google.com/accounts/answer/185833) (2FA peab olema lubatud) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Kasutage oma Microsofti konto mandaate |
| Mailgun | `smtp.mailgun.org` | `587` | Kasutage Mailguni SMTP mandaate oma domeeni seadetest |
| SendGrid | `smtp.sendgrid.net` | `587` | Kasutage kasutajanimeks `apikey` ja parooliks API võtit |
| Kohandatud / isemajutatud | teie domeen | `587` / `465` | Postfix, Exim jne |

### Märkused

- Gmail nõuab **rakenduse parooli** tavalise parooli asemel, kui kaheastmeline kinnitamine on lubatud.
- Port `587` kasutab STARTTLS-i (algab avatekstina, uuendatakse TLS-ile). Port `465` kasutab kaudset TLS-i (SSL algusest peale).

### Kasutavad

- [E-kirja saatmise sõlm](../nodes/send-email-node.md)

---

## IMAP (sissetulev e-post)

IMAP-mandaat salvestab ühenduse üksikasjad postkasti jälgimiseks [IMAP Triggeri sõlmega](../nodes/imap-trigger-node.md).

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `imap_host` | IMAP serveri hostinimi (näiteks `imap.gmail.com`) |
| `imap_port` | IMAP port (`993` SSL/TLS jaoks enamikel teenusepakkujatel) |
| `imap_username` | Postkasti kasutajanimi või täielik e-posti aadress |
| `imap_password` | Parool või teenusepakkuja-spetsiifiline rakenduse parool |

### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `imap_mailbox` | Jälgitav postkasti kaust (vaikimisi: `INBOX`) |
| `imap_use_ssl` | Lubage SSL/TLS (soovitatav; vaikimisi: `true`) |

### Märkused

- IMAP trigger loob esimesel päringul praeguse postkasti baasjoone ja töötleb seejärel ainult uuemaid e-kirju.
- Gmail, Microsoft 365 ja teised majutatud teenusepakkujad nõuavad sageli **rakenduse parooli** või sarnast IMAP-spetsiifilist saladust.
- Manuste sisu ei laadita workflow payload'i; Heym avaldab ainult manuste metaandmed.

### Kasutavad

- [IMAP Triggeri sõlm](../nodes/imap-trigger-node.md)
- [Triggerid](./triggers.md) (IMAP workflow triggerina)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) on avatud lähtekoodiga sõnumivahendaja. RabbitMQ mandaat salvestab ühenduse üksikasjad järjekordadesse ja exchange'idesse avaldamiseks ning nendest tarbimiseks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `rabbitmq_host` | AMQP ühenduse URL (nt `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ kasutajanimi (vaikimisi: `guest`) |
| `rabbitmq_password` | RabbitMQ parool (vaikimisi: `guest`) |

### Virtuaalsed hostid

Konkreetse virtuaalse hostiga ühenduse loomiseks lisage see `rabbitmq_host` URL-ile:

```
amqp://username:password@hostname:5672/vhost
```

Vaikimisi vhosti kasutamisel võib tee `/` ära jätta.

### Viivitatud sõnumite plugin

[RabbitMQ sõlm](../nodes/rabbitmq-node.md) toetab **rabbitmq_delayed_message_exchange** pluginat. Kui see plugin on teie RabbitMQ serveris lubatud, saate määrata väljuvatele sõnumitele viivituse (millisekundites), kasutades sõlme välja `rabbitmqDelayMs`.

Sõlm määrab avaldatud sõnumile päise `x-delay`. Viivituste jõustumiseks peab exchange'i tüüp olema `x-delayed-message`.

Plugina lubamiseks isemajutatud RabbitMQ instantsil:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Kui plugin ei ole installitud, eiratakse päist `x-delay` ja sõnumid toimetatakse kohe kohale.

### Kasutavad

- [RabbitMQ sõlm](../nodes/rabbitmq-node.md)
- [Triggerid](./triggers.md) (RabbitMQ workflow triggerina)

---

## Amazon S3

Amazon S3 mandaat ühendab Heymi [Amazon S3-ga](https://aws.amazon.com/s3/). Kasutage seda [Amazon S3 sõlmega](../nodes/amazon-s3-node.md), et hallata bucketeid ja kaustu, üles laadida ja alla laadida objekte, kopeerida võtmeid ning loetleda või kustutada objekte workflow'dest.
### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key ID |
| `aws_secret_access_key` | Salajane access key, mis on paaris access key ID-ga |
| `aws_region` | AWS regioon, kus bucketid asuvad (nt `us-east-1`) |

### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `aws_session_token` | Ajutine session token AWS STS mandaatide kasutamisel |

### Märkused

- Mandaat kasutab standardset AWS SigV4 autentimist boto3 kaudu.
- Üleslaadimise toimingud saadavad praegu UTF-8 tekstisisu; allalaadimised võivad binaarsete objektide puhul tagastada teksti või base64.

### Kasutab

- [Amazon S3 node](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) on mälusisene võti-väärtus salvestus, mida kasutatakse vahemällu salvestamiseks ja kiireks andmetele ligipääsuks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `host` | Redis serveri hostinimi või IP (nt `localhost`) |
| `port` | Redis port (vaikimisi: `6379`) |
| `password` | Redis parool (jätke tühjaks, kui pole määratud) |

### Kasutab

- [Redis node](../nodes/redis-node.md)

---

## Slack

Slack mandaat salvestab **Incoming Webhook URL-i** sõnumite postitamiseks Slacki kanalitesse.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (teie Slacki rakenduse konfiguratsioonist) |

### Märkused

- Looge Incoming Webhook aadressil [api.slack.com/apps](https://api.slack.com/apps) → teie rakendus → **Incoming Webhooks**.
- Iga webhook on seotud kindla kanaliga. Looge erinevate kanalite jaoks mitu mandaati.

### Kasutab

- [Slack node](../nodes/slack-node.md)

---

## Telegram

Telegram mandaat salvestab **Bot Tokeni** ja valikulise **Webhook Secret Tokeni** botipõhiste workflow'de jaoks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `bot_token` | Telegram Bot API token BotFatherilt |

### Valikulised väljad

| Väli | Kirjeldus |
|-------|-------------|
| `secret_token` | Jagatud saladus, mida kontrollitakse saabuvate webhookide puhul `x-telegram-bot-api-secret-token` vastu |

### Märkused

- Kasutage sama mandaati nii [Telegram Triggeri](../nodes/telegram-trigger-node.md) kui ka [Telegrami](../nodes/telegram-node.md) jaoks.
- Registreerige webhook käsitsi Telegrami `setWebhook` API kaudu, kasutades URL-i, mis on näidatud Telegram Triggeri node'i paneelil.
- `chatId` Telegram node'is võib olla literaalne ID või avaldis nagu `$telegramEvent.message.chat.id`.

### Kasutab

- [Telegram Trigger node](../nodes/telegram-trigger-node.md)
- [Telegram node](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Neid mandaate kasutab [HTTP node](../nodes/http-node.md) väljuvate päringute autentimiseks.

### Bearer

Lisab HTTP päringutele `Authorization: Bearer <token>` päise.

| Väli | Kirjeldus |
|-------|-------------|
| `token` | Bearer tokeni väärtus |

### Header

Lisab HTTP päringutele kohandatud päise.

| Väli | Kirjeldus |
|-------|-------------|
| `header_key` | Päise nimi (nt `X-Api-Key`) |
| `header_value` | Päise väärtus |

Mõlemale tüübile saab viidata ka `$credentials.CredentialName` kaudu [Expression DSL-is](./expression-dsl.md) dünaamiliseks kasutamiseks mis tahes node'is, mis aktsepteerib avaldisi.

### Kasutab

- [HTTP node](../nodes/http-node.md)

---

## LLM Pakkujad (OpenAI, Google, Custom, Cohere)

Need mandaadid toidavad AI node'e.

| Tüüp | Kirjeldus |
|------|-------------|
| **OpenAI** | API võti GPT mudelite ja OpenAI embeddingute jaoks |
| **Google** | API võti Gemini mudelite jaoks |
| **Custom** | API võti + baas-URL OpenAI-ga ühilduvate endpointide jaoks (Ollama, vLLM, LM Studio jne) |
| **Cohere** | API võti Cohere embeddingute jaoks |

### OpenAI Prompt Caching

OpenAI salvestab automaatselt vahemällu teie süsteemi prompti staatilise (muutumatu) prefiksi — täiendavat konfiguratsiooni pole vaja. Korduvad workflow'de käivitused, mis jagavad sama süsteemi prompti prefiksit, saavad kasu vahemällu salvestatud tokenite hinnastusest, mis vähendab nii kulu kui ka latentsust. See on eriti kasulik, kui teil on pikad, fikseeritud juhised ja käivituste vahel muutub ainult kasutaja sõnum. Jälgige cache hit määrasid ja tokenite kokkuhoidu [Traces tabis](../tabs/traces-tab.md) või OpenAI kasutuse armatuurlaual, et optimeerida oma prompti struktuuri maksimaalse cache'i taaskasutuse jaoks.

### Kasutab

- [LLM node](../nodes/llm-node.md)
- [Agent node](../nodes/agent-node.md)
- [RAG node](../nodes/rag-node.md) (OpenAI embeddingud Qdrant mandaadi kaudu)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) on puhverserver Cloudflare'i ja sarnaste botikaitse väljakutsete mööramiseks.

### Kohustuslikud väljad

| Väli | Kirjeldus |
|-------|-------------|
| `flaresolverr_url` | Teie FlareSolverr instantsi URL (nt `http://localhost:8191`) |

Loopback ja privaatseid aadresse toetatakse siin, seega FlareSolverri käitamine Heymi kõrval töötab nii, nagu dokumenteeritud. URL ei tohi laheneda link-local ega cloud-metadata aadressile. Kuna privaatsed aadressid on lubatud, saab seda välja suunata ka teisele sisemisele teenusele ja vastus tuleb tagasi node'i väljundis. Iga sisselogitud kasutaja saab seda mandaati luua, seega piiriks on see, kes võib workflow'sid autoriseerida, pluss teie võrgureeglid, mitte mandaadi jagamine. Vt [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Kasutab

- [Crawler node](../nodes/crawler-node.md)

---
## Seotud

- [Mandaadid](./credentials.md) – Ülevaade mandaatidest ja sellest, kuidas sõlmed neid kasutavad
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Mandaatide lisamine ja haldamine
- [Mandaatide jagamine](./credentials-sharing.md) – Mandaatide jagamine kasutajate ja tiimidega
- [Turvalisus](./security.md) – Krüpteerimine salvestamisel, juurdepääsukontroll
- [Avaldise DSL](./expression-dsl.md) – `$credentials` süntaks dünaamiliseks juurdepääsuks

---

## Mudeli marsruuter (automaatne mudel)

Suunab iga päringu ühele olemasolevale mudeli mandaadile, kasutades valiku tegemiseks
otsustusmudelit. See hoiab viiteid, mitte kunagi oma võtit.

### Kohustuslikud väljad

- `decision_credential_id` – **Otsustusmudeli** mandaat, millele Teil on juurdepääs.
- `decision_model` – mudel, mis teeb marsruutimispäringu, näiteks `jev-latest`.
- `options` – vähemalt kaks kirjet, millest igaühel on nimi, üks Teie OpenAI/Google/Custom
  mandaatidest, sellel olev mudel ja kriteeriumid, mis ütlevad, millal see peaks võitma.

### Valikulised väljad

- `routing_instructions` – kuidas valikuid üldiselt kaaluda.
- Ühe valiku võib märkida varuvariandiks, mida kasutatakse marsruutimise ebaõnnestumisel.

### Märkused

Valikute nimed on need, mille vahel otsustusmudel valib, seega peavad need olema eristatavad. Üks
valik ei saa osutada teisele mudeli marsruuterile.
