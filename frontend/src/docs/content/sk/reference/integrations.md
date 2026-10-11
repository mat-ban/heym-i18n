# Integrácie tretích strán

Heym sa pripája k externým službám prostredníctvom **prihlasovacích údajov**. Každý typ prihlasovacích údajov ukladá podrobnosti o pripojení k jednej službe a možno ho opakovane použiť vo viacerých uzloch a workflowoch. Prehľad nájdete v časti [Prihlasovacie údaje](./credentials.md).

Prihlasovacie údaje pridáte v časti [Nastavenia → Prihlasovacie údaje](../tabs/credentials-tab.md). Všetky hodnoty sú v pokoji šifrované. Prihlasovacie údaje možno [zdieľať](./credentials-sharing.md) s inými používateľmi alebo [Tímami](./teams.md).

Niektoré integračné uzly **nevyžadujú** prihlasovacie údaje. [WebSocket Trigger](../nodes/websocket-trigger-node.md) a [WebSocket Send](../nodes/websocket-send-node.md) sa pripájajú k externým socketom pomocou URL, hlavičiek a subprotokolov nakonfigurovaných priamo na uzle.

## Prehľad typov prihlasovacích údajov

| Typ | Používa | Kľúčové polia |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, voliteľné `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, voliteľné `base_url` |
| **Jira** | [Uzol Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, voliteľné `api_version` |
| **Linear** | [Uzol Linear](../nodes/linear-node.md) | `api_key`, alebo `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Uzol Sentry](../nodes/sentry-node.md) | `api_token`, voliteľné `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, voliteľné `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | prihlasovacie údaje rozhodovacieho modelu plus možnosti modelu odkazujúce na Vaše ostatné prihlasovacie údaje |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vektory uložené vo vlastnom Postgrese systému Heym prostredníctvom pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, voliteľné `embedding_api_key`, plus `qdrant_host`, ak je `db_type` nastavené na `qdrant` |
| **Grist** | [Uzol Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Uzol Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + súhlas OAuth2 |
| **Google Drive** | [Uzol Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + súhlas OAuth2 (plný rozsah Drive) |
| **BigQuery** | [Uzol BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + súhlas OAuth2 |
| **Supabase** | [Uzol Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, voliteľné `supabase_schema` |
| **ClickHouse** | [Uzol ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Uzol Notion](../nodes/notion-node.md) | `api_token`, alebo `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Uzol Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Uzol IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Uzol Telegram Trigger](../nodes/telegram-trigger-node.md), [Uzol Telegram](../nodes/telegram-node.md) | `bot_token`, voliteľné `secret_token` |
| **Discord** | [Uzol Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Uzol Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Uzol RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Uzol Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Uzol Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Uzol Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Uzol HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Uzol HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Uzol Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Prihlasovacie údaje GitHub ukladajú osobný prístupový token GitHub (PAT), aby workflowy mohli volať GitHub REST API prostredníctvom [uzla GitHub](../nodes/github-node.md), odovzdať token do MCP serverov, ako je `@modelcontextprotocol/server-github`, alebo ho použiť z [uzla HTTP](../nodes/http-node.md) na vlastné REST volania.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `api_key` | Osobný prístupový token GitHub (jemnozrnný PAT `github_pat_...` alebo klasický PAT `ghp_...`) |
### Voliteľné polia

| Pole | Popis |
|-------|-------------|
| `base_url` | Základná URL adresa GitHub API pre GitHub Enterprise Server (napríklad `https://github.example.com/api/v3`) |

### Poznámky

- Ak je to možné, odporúčajú sa jemnozrnné osobné prístupové tokeny, pretože ich možno obmedziť na konkrétne repozitáre a oprávnenia.
- Pre GitHub.com ponechajte `base_url` prázdne. Pre GitHub Enterprise Server použite úplný REST API
  endpoint vrátane `/api/v3` (napríklad `https://github.example.com/api/v3`), nie
  koreň webového rozhrania servera, ako napríklad `https://github.example.com`.
- Tento prihlasovací údaj v súčasnosti modeluje iba autentifikáciu založenú na PAT. Na prístup k repozitárom organizácie použite PAT, ktorému boli udelené požadované oprávnenia organizácie/repozitára.
- Inštalačné tokeny GitHub App a procesy nastavenia GitHub App nie sú v súčasnosti v rozhraní Heym prvotriedne podporované.
- Pre natívne operácie s repozitármi, používateľmi, issue, pull requestmi, recenziami, vydaniami, Actions workflowmi, prevádzkou a súbormi uprednostnite [uzol GitHub](../nodes/github-node.md). [Uzol HTTP](../nodes/http-node.md) použite len vtedy, keď potrebujete endpointy alebo payloady, ktoré uzol GitHub nepokrýva.
- Použite [uzol Agent](../nodes/agent-node.md) s MCP tak, že do premennej prostredia MCP spojenia, ako napríklad `GITHUB_PERSONAL_ACCESS_TOKEN`, odovzdáte `$credentials.YourGitHubCredential`.
- GitHub REST API zvyčajne očakáva `Authorization: Bearer <token>` plus `Accept: application/vnd.github+json`.
- Pri úprave prihlasovacieho údaja GitHub ponechanie prázdneho poľa `base_url` pre GitHub Enterprise
  zachová existujúci endpoint. Novú URL adresu zadajte len vtedy, keď chcete tento endpoint zmeniť.

### Používa sa v

- [uzol GitHub](../nodes/github-node.md)
- [uzol Codex](../nodes/codex-node.md)
- [uzol Agent](../nodes/agent-node.md)
- [uzol HTTP](../nodes/http-node.md)

---

## Rozhodovací model

Rozhodovací model odpovedá na typované otázky o stave a namiesto textu vracia pravdepodobnosti. Referenčnou implementáciou je Jev od TypeSafe; funguje akýkoľvek endpoint, ktorý prijíma rovnaké telo `{model, state, questions}`, a [uzol Decision](../nodes/decision-node.md) môže odoslať ručne napísané telo pre ten, ktorý ho nepodporuje.

### Povinné polia

- `base_url` – endpoint, napríklad `https://api.typesafe.ai`. Heym pripája `/v1/systemone`.

### Voliteľné polia

- `api_key` – odosiela sa ako `Authorization: Bearer`. Endpointy, ktoré nepotrebujú kľúč, môžu toto pole ponechať prázdne.

### Poznámky

- **Test Connection** odošle jednu drobnú otázku na potvrdenie, že endpoint a kľúč fungujú.
- Pri úprave prihlasovacieho údaja sa uložený kľúč zachová, ak pole pre kľúč zostane prázdne.
- Odchádzajúce požiadavky na súkromné a loopback adresy sú predvolene blokované, takže self-hosted endpoint na `localhost` alebo v súkromnom rozsahu vyžaduje `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Tieto modely sa nenachádzajú v cenových tabuľkách LLM, ktoré Heym synchronizuje, takže stĺpec Cost v [Spusteniach](../tabs/traces-tab.md) zostáva prázdny. Počty tokenov sa však stále zaznamenávajú.

### Používa sa v

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – hodnotí odpovede `LLM-as-Judge` voči očakávanému výstupu

## OpenAI Codex

Prihlasovací údaj OpenAI Codex autentifikuje [uzol Codex](../nodes/codex-node.md). Je oddelený od prihlasovacieho údaja s kľúčom OpenAI API, ktorý používajú uzly LLM, Agent a RAG.

### Režimy autentifikácie

| Režim | Popis |
|------|-------------|
| **Sign in with ChatGPT** (odporúčané) | Prihlásenie cez OAuth (PKCE), ktoré využíva vaše predplatné ChatGPT Plus/Pro, takže spustenia sa vyhýbajú nákladom na API za token. Heym ukladá a automaticky obnovuje balík tokenov. |
| **Access token** | ChatGPT/Codex `access_token` odovzdaný iba lokálnemu procesu Codex CLI. |

### Poznámky

- Pre tento typ prihlasovacieho údaja sú kľúče API odmietnuté.
- Tokeny Codex nie sú sprístupnené prostredníctvom `$credentials.Name`.
- Uzol Codex tiež potrebuje prihlasovací údaj GitHub na klonovanie repozitára, push vetvy a vytvorenie konceptu PR.

### Používa sa v

- [uzol Codex](../nodes/codex-node.md)

## OpenCode Go

Prihlasovací údaj OpenCode Go autentifikuje [uzol OpenCode Go](../nodes/opencode-go-node.md). Ukladá kľúč API brány OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) a voliteľnú základnú URL adresu brány.

### Polia

| Pole | Popis |
|-------|-------------|
| **API Key** | Kľúč API brány OpenCode Go (povinné). |
| **Gateway Base URL** | Voliteľné; predvolene `https://opencode.ai/zen/go/v1`. Prepíšte len pre self-hosted alebo proxy bránu. |

### Poznámky

- Kľúč API sa odovzdáva iba procesu OpenCode CLI vnútri zabezpečeného kontajnera.
- Uzol OpenCode Go tiež potrebuje prihlasovací údaj GitHub na klonovanie repozitára, push vetvy a vytvorenie pull requestu. Token GitHub sa nikdy neumiestňuje dovnútra sandbox kontajnera.

### Používa sa v

- [uzol OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Prihlasovací údaj Linear podporuje buď osobný kľúč API, alebo OAuth2 pre
[uzol Linear](../nodes/linear-node.md). Heym odosiela natívne GraphQL dotazy do Linear pre metadata pracovného priestoru, projekty, issue a komentáre.
### Nastavenie

Vyberte jeden režim autentifikácie:

**Osobný API kľúč**

1. V Linear otvorte **Settings → Security & Access → Personal API keys**.
2. Vytvorte kľúč s prístupom do pracovného priestoru, ktorý chcete automatizovať.
3. Vložte kľúč do prihlasovacích údajov Linear v Hey m a pomocou **Test Connection** overte jeho funkčnosť.

**OAuth2**

1. Vytvorte OAuth aplikáciu Linear.
2. Zaregistrujte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ako redirect URI.
3. V Heym Dashboard → **Credentials** → **New** → typ **Linear**.
4. Zvoľte **OAuth2**, zadajte Client ID a Client Secret a kliknite na **Connect**.

### Povinné polia

| Režim | Pole | Popis |
|------|-------|-------------|
| Osobný API kľúč | `api_key` | Osobný API kľúč Linear, zvyčajne s predponou `lin_api_` |
| OAuth2 | `client_id` | Client ID z OAuth aplikácie Linear |
| OAuth2 | `client_secret` | Client Secret z OAuth aplikácie Linear |

OAuth tokeny (`access_token`, `refresh_token`, `token_expiry`) sa ukladajú a obnovujú automaticky.

### Poznámky

- Osobné API kľúče a OAuth tokeny konajú ako používateľ Linear, ktorý ich vytvoril alebo autorizoval.
- Linear OAuth používa scopes `read,write,issues:create,comments:create`.
- Pomocou **Test Connection** v dialógu prihlasovacích údajov overte API kľúč alebo OAuth token voči Linear API.
- Pomocou List Teams a List Projects v uzle Linear zistite UUID pred vytváraním alebo filtrovaním issues.
- Pomocou List Workflow States a List Team Members zistite UUID stavov a riešiteľov pre aktualizácie.
- API kľúč rotujte úpravou prihlasovacích údajov a zadaním nového kľúča. Ak rotujete tajné údaje OAuth aplikácie, znovu pripojte prihlasovacie údaje pomocou **Connect**.

### Používa

- [Uzol Linear](../nodes/linear-node.md)

---

## Jira

Prihlasovacie údaje Jira ukladajú Basic auth údaje Jira, základnú URL adresu Jira lokality, režim nasadenia a voliteľnú verziu REST API pre [uzol Jira](../nodes/jira-node.md). Použite `cloud` pre Jira Cloud alebo `data_center` pre Jira Data Center / Server.

### Nastavenie

**Jira Cloud**

1. V nastaveniach účtu Atlassian vytvorte API token.
2. V Heym Dashboard → **Credentials** → **New** → typ **Jira**.
3. Zadajte e-mail Atlassian, API token a URL adresu lokality Jira, napríklad `https://your-domain.atlassian.net`.
4. Pomocou **Test Connection** overte prihlasovacie údaje.

**Jira Data Center / Server**

1. Ako režim nasadenia vyberte **Jira Data Center / Server**.
2. Zadajte používateľské meno a heslo Jira používané na Basic auth.
3. Zadajte URL adresu lokality Jira, napríklad `https://jira.example.com`.
4. Pomocou **Test Connection** overte prihlasovacie údaje.

### Polia

| Pole | Popis |
| --- | --- |
| `email` | E-mail účtu Atlassian pre Jira Cloud alebo používateľské meno pre Jira Data Center / Server |
| `api_token` | API token Atlassian pre Jira Cloud alebo heslo pre Basic auth pre Jira Data Center / Server |
| `base_url` | Základná URL adresa lokality Jira |
| `deployment` | `cloud` pre Jira Cloud alebo `data_center` pre Jira Data Center / Server |
| `api_version` | Verzia REST API; predvolene `3` pre Jira Cloud. Data Center / Server používa v2 |

### Poznámky

- Uzol Jira odosiela popisy issues a komentáre ako textové dokumenty Atlassian Document Format
  pre Jira Cloud REST API v3. Prihlasovacie údaje Data Center / Server odosielajú čistý text.
- Data Center / Server momentálne podporuje iba Basic auth s používateľským menom a heslom. Osobné prístupové
  tokeny a Bearer auth zatiaľ nie sú podporované.
- Nahrávanie príloh akceptuje obsah vo formáte base64 alebo data URL a podlieha limitu veľkosti súboru platformy (predvolene 99 MB). Sťahovanie príloh môže vrátiť obsah base64, ak je povolené.
- Vytváranie a mazanie používateľov a upozornenia na issues vyžadujú, aby autentifikovaný účet Jira mal príslušné povolenia lokality alebo organizácie Jira.
- Pomocou List Projects, Search Issues a List Transitions zistite kľúče projektov, kľúče issues a ID prechodov.
- Pre vlastné endpointy, ktoré uzol Jira nepokrýva, použite [uzol HTTP](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` pre Cloud alebo `username:password` pre Data Center / Server) v príkaze cURL, alebo prihlasovacie údaje typu Header s príslušnou hodnotou `Authorization: Basic <base64(user:secret)>`.

Pozri tiež:

- [Uzol Jira](../nodes/jira-node.md)
- [Prihlasovacie údaje](./credentials.md)

---

## Sentry

Prihlasovacie údaje Sentry ukladajú auth token pre [uzol Sentry](../nodes/sentry-node.md). Heym používa REST API Sentry na operácie s organizáciami, projektmi, tímami, issues, udalosťami a vydaniami.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `api_token` | Auth token Sentry s prístupom k organizáciám a projektom, ktoré automatizujete |

### Voliteľné polia

| Pole | Popis |
|-------|-------------|
| `base_url` | Voliteľná koreňová URL adresa pre self-hosted Sentry, napríklad `https://sentry.example.com` |

### Poznámky

- Pre Sentry SaaS ponechajte `base_url` prázdne.
- Pomocou **Test Connection** overte, že token dokáže zobraziť viditeľné organizácie.
- Pre vlastné REST volania použite `$credentials.YourSentryCredential` ako bearer token.

### Používa

- [Uzol Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) je open-source vektorová databáza používaná na sémantické vyhľadávanie a RAG (Retrieval Augmented Generation).

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `qdrant_host` | Úplná URL adresa vašej inštancie Qdrant (napr. `http://localhost:6333` alebo cloudový endpoint) |
| `openai_api_key` | API kľúč OpenAI používaný na generovanie embeddings pri indexovaní a vyhľadávaní dokumentov |
### Poznámky

- Kolekcie Qdrant sa spravujú na karte [Vektorové úložiská](../tabs/vectorstores-tab.md). Každé vektorové úložisko sa mapuje na kolekciu Qdrant.
- [Uzol RAG](../nodes/rag-node.md) používa vektorové úložisko (ktoré odkazuje na prihlasovacie údaje Qdrant) — neodkazuje priamo na prihlasovacie údaje.
- Ak vaša inštancia Qdrant vyžaduje API kľúč, uveďte ho v hodnote `qdrant_host` alebo Qdrant nakonfigurujte príslušným spôsobom; aktuálna integrácia neobsahuje samostatné pole pre API kľúč Qdrant.
- Vlastný hosting Qdrant: použite [oficiálny Docker image](https://hub.docker.com/r/qdrant/qdrant) a sprístupnite port `6333`.

### Používa sa v

- [Uzol RAG](../nodes/rag-node.md) (prostredníctvom vektorového úložiska)
- [Karta Vektorové úložiská](../tabs/vectorstores-tab.md)

## Vlastné embeddingy (RAG)

Predvolene embeddingy RAG pochádzajú z OpenAI. Prihlasovacie údaje **RAG: Custom Embeddings** však namiesto toho odkazujú na akýkoľvek endpoint embeddingov kompatibilný s OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together alebo hostovanú bránu — a určujú vektorové úložisko, do ktorého sa zapisuje.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `embedding_base_url` | URL endpointu vrátane cesty `/v1`, napr. `http://localhost:11434/v1` |
| `embedding_api_key` | Voliteľné. Lokálne servery zvyčajne nevyžadujú kľúč |
| `embedding_model` | Názov modelu tak, ako ho očakáva endpoint, napr. `nomic-embed-text` |
| `embedding_dimensions` | Šírka vektora, ktorú model vracia (predvolene `1536`) |
| `embedding_request_dimensions` | Voliteľné. Požiada endpoint, aby vrátil `embedding_dimensions` namiesto natívnej šírky modelu |
| `db_type` | `qdrant` alebo `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Pripojenie k Qdrant, povinné, ak je `db_type` nastavené na `qdrant` |

### Poznámky

- **Qdrant akceptuje ľubovoľný počet dimenzií.** Každá kolekcia sa vytvára so šírkou, ktorú deklarujú tieto prihlasovacie údaje, takže pole Dimensions je voľne upraviteľné.
- **Postgres (pgvector) vyžaduje presne 1536 dimenzií.** Jeho stĺpec je pevne daný ako `vector(1536)`, takže pole Dimensions je uzamknuté na 1536 a prihlasovacie údaje deklarujúce inú šírku sú pri ukladaní odmietnuté.
- **Skracovanie pre pgvector.** Ak je úložisko Postgres, dialóg ponúka možnosť *Požiadať endpoint, aby vrátil 1536 dimenzií*. Tá odošle parameter požiadavky `dimensions`, ktorý modely trénované s reprezentáciami Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` a podobné) rešpektujú a vrátia skrátený, no stále zmysluplný vektor. Endpointy, ktoré tento parameter nepodporujú, požiadavku odmietnu a endpointy, ktoré ho akceptujú, ale ignorujú, vrátia jasnú chybu s uvedením skutočne vrátenej šírky. Heym nikdy neskracuje vektory sám, pretože orezanie výstupu modelu, ktorý nie je typu Matryoshka, ticho zhoršuje kvalitu vyhľadávania. Táto možnosť sa neponúka pre Qdrant, ktorý dokáže nastaviť veľkosť kolekcie na ľubovoľnú šírku.
- Pomocou **Test Connection** v dialógu prihlasovacích údajov vložte testovací reťazec a pred vytvorením úložiska zistite, akú šírku model skutočne vracia.
- Parameter požiadavky `dimensions` sa odosiela iba samotnému OpenAI, pretože väčšina serverov kompatibilných s OpenAI odmieta neznáme parametre. Namiesto toho sa natívna šírka modelu overuje voči prihlasovacím údajom.
- Existujúce prihlasovacie údaje **RAG: Qdrant + OpenAI** a **RAG: Psql + OpenAI** zostávajú nezmenené a naďalej fungujú.

### Používa sa v

- [Uzol RAG](../nodes/rag-node.md) (prostredníctvom vektorového úložiska)
- [Karta Vektorové úložiská](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym dokáže ukladať vektory aj **vo vlastnej databáze Postgres** pomocou rozšírenia
[pgvector](https://github.com/pgvector/pgvector) — bez potreby externej vektorovej služby. Vytvorte prihlasovacie údaje **RAG: Psql + OpenAI** a použite ich pri vytváraní vektorového úložiska, potom v rozbaľovacom zozname Database uzla RAG vyberte možnosť **Postgres (pgvector)**.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `openai_api_key` | API kľúč OpenAI používaný na generovanie embeddingov pri indexovaní a vyhľadávaní dokumentov |

### Poznámky

- Host/port nie je potrebný — vektory sa zapisujú do vlastnej databázy Heym; Heym sa nikdy nepripája k inej databáze.
- Každá funkcia RAG dostupná s Qdrant (vkladanie, vyhľadávanie, filtre metadát, preradenie Cohere, klonovanie, zdieľanie) funguje identicky aj s backendom Postgres.
- Vyžaduje rozšírenie `vector`. Heym ponecháva oficiálny image `postgres:16` nezmenený (aby sa existujúce dáta nikdy nedotkli) a **pri štarte automaticky nainštaluje balík `postgresql-16-pgvector`** — `run.sh`, `deploy.sh` aj `run_e2e.sh` to riešia. Inštalácia nie je fatálna: ak sa nedá spustiť (napr. bez siete), RAG s Qdrant funguje ďalej a backend Postgres zostáva neaktívny (migrácia tabuľku elegantne preskočí).
- Ak spúšťate publikovaný single-container image (`ghcr.io/heymrun/heym`) proti **vlastnému externému Postgres**, táto databáza musí podporovať rozšírenie `vector` (Heym ho nedokáže nainštalovať do databázy, ktorú nespravuje). Bez neho vytvorenie alebo nahrávanie do vektorového úložiska Postgres vráti jasnú správu a RAG s Qdrant funguje ďalej.

### Používa sa v

- [Uzol RAG](../nodes/rag-node.md) (prostredníctvom vektorového úložiska)
- [Karta Vektorové úložiská](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) je hybrid tabuľky a databázy, ktorý podporuje štruktúrované dáta a vzorce. Prihlasovacie údaje Grist umožňujú Heymu čítať a zapisovať dokumenty Grist.
### Povinné polia

| Pole | Popis |
|-------|-------------|
| `api_key` | Grist API kľúč (nájdete v **Profile → API Key** na svojej inštancii Grist) |
| `server_url` | Základná URL adresa Vášho Grist servera (napr. `https://docs.getgrist.com` pre Grist Cloud alebo URL adresa Vášho self-hosted servera) |

### Poznámky

- [Uzol Grist](../nodes/grist-node.md) vyžaduje vo svojej konfigurácii **Document ID** (z URL adresy dokumentu Grist) a **Table ID** — tieto nie sú súčasťou prihlasovacích údajov.
- Pre self-hosted Grist nastavte `server_url` na doménu Vašej inštancie.
- ID stĺpcov v Grist používajú podčiarkovníky (napr. `User_Name`), nie zobrazované názvy. Na ich zistenie použite operáciu `listColumns`.

### Používa

- [Uzol Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Prihlasovacie údaje Google Sheets prepájajú Heym s Google Sheets API pomocou modelu OAuth2 „Bring Your Own App". Poskytnete Google Cloud OAuth2 Client ID a Client Secret, následne autorizujete prístup prostredníctvom popup okna v prehliadači. Tokeny sa automaticky obnovujú na pozadí.

### Nastavenie

1. Otvorte [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhľadajte a povoľte **Google Sheets API**.
2. Prejdite na **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikácie **Web application**.
3. V časti **Authorized redirect URIs** pridajte: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Skopírujte vygenerovaný **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → typ **Google Sheets (OAuth2)**.
6. Zadajte Client ID, Client Secret a názov, potom kliknite na **Connect** na otvorenie súhlasového popup okna Google a autorizujte prístup.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) sa ukladajú a obnovujú automaticky — nespravujete ich priamo.

### Poznámky

- Súhlasová obrazovka OAuth2 vyžaduje scope pre tabuľky (`https://www.googleapis.com/auth/spreadsheets`).
- Heym používa refresh token na získanie nových access tokenov pred ich vypršaním (60-sekundová bezpečnostná rezerva).
- Ak v Google Cloud Console obmeníte Client Secret, znovu pripojte prihlasovacie údaje prostredníctvom tlačidla **Connect**.
- **Produkcia:** Nastavte backend **`FRONTEND_URL`** na presnú verejnú URL adresu, ktorú používatelia otvárajú v prehliadači (schéma + host, napr. `https://heym.example.com`). Heym zostavuje Google OAuth redirect URI iba z tejto hodnoty — **nedôveruje** hlavičkám `Origin` ani `X-Forwarded-*` (kontrolovaným klientom). Zaregistrujte `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` v Google Cloud Console.

### Používa

- [Uzol Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Prihlasovacie údaje Google Drive prepájajú Heym s Google Drive API pomocou rovnakého modelu OAuth2 „Bring Your Own App" ako Google Sheets. Poskytnete Google Cloud OAuth2 Client ID a Client Secret, následne autorizujete prístup prostredníctvom popup okna v prehliadači. Tokeny sa automaticky obnovujú na pozadí.

### Nastavenie

1. Otvorte [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhľadajte a povoľte **Google Drive API**.
2. Prejdite na **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikácie **Web application**.
3. V časti **Authorized redirect URIs** pridajte: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Skopírujte vygenerovaný **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → typ **Google Drive (OAuth2)**.
6. Zadajte Client ID, Client Secret a názov, potom kliknite na **Connect** na otvorenie súhlasového popup okna Google a autorizujte prístup.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) sa ukladajú a obnovujú automaticky — nespravujete ich priamo.

### Scope

Google Drive vyžaduje **plný Drive scope** (`https://www.googleapis.com/auth/drive`).

Je to potrebné, pretože uzol pracuje so súbormi, ktoré už vlastníte. Užší scope `drive.file` poskytuje prístup iba k súborom, ktoré vytvoril samotný OAuth klient, čo by spôsobilo, že operácie `listFolderFiles`, `updateFile`, `removeFile` a `removeFolder` by nevideli nič z Vášho existujúceho Drive.

Keďže poskytujete vlastný Client ID a Secret z vlastného projektu Google Cloud, požiadavky na overenie aplikácie Google pre tento scope sa vzťahujú na Váš projekt, nie na Heym.

### Poznámky

- Heym používa refresh token na získanie nových access tokenov pred ich vypršaním (60-sekundová bezpečnostná rezerva).
- Ak v Google Cloud Console obmeníte Client Secret, znovu pripojte prihlasovacie údaje prostredníctvom tlačidla **Connect**.
- Zdieľané disky sú podporované — uzol nastavuje `supportsAllDrives` pri každom volaní API.
- **Produkcia:** Nastavte backend **`FRONTEND_URL`** na presnú verejnú URL adresu, ktorú používatelia otvárajú v prehliadači. Heym zostavuje Google OAuth redirect URI iba z tejto hodnoty — **nedôveruje** hlavičkám `Origin` ani `X-Forwarded-*`. Zaregistrujte `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` v Google Cloud Console.
- Pred zdieľaním týchto prihlasovacích údajov s tímom si pozrite [Credential Sharing](./credentials-sharing.md).

### Používa

- [Uzol Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Prihlasovacie údaje BigQuery prepájajú Heym s Google BigQuery API pomocou modelu OAuth2 „Bring Your Own App". Poskytnete Google Cloud OAuth2 Client ID a Client Secret, následne autorizujete prístup prostredníctvom popup okna v prehliadači. Tokeny sa automaticky obnovujú na pozadí.

### Nastavenie

1. Otvorte [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhľadajte a povoľte **BigQuery API**.
2. Prejdite do **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikácie **Web application**.
3. V časti **Authorized redirect URIs** pridajte: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Skopírujte vygenerovaný **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Prihlasovacie údaje** → **New** → typ **BigQuery (OAuth2)**.
6. Zadajte Client ID, Client Secret a názov, potom kliknite na **Connect** na otvorenie Google consent popup okna a autorizujte prístup.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) sa ukladajú a obnovujú automaticky.

### Poznámky

- Obrazovka OAuth2 consent vyžaduje scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produkcia:** Nastavte backend **`FRONTEND_URL`** na verejnú URL. Zaregistrujte `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` v Google Cloud Console.

### Používa

- [Uzol BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Prihlasovacie údaje Supabase prepájajú Heym s PostgREST API projektu Supabase, aby workflowy mohli vykonávať dotazy a meniť tabuľky podporované Postgresom.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `supabase_url` | Základná URL projektu, napríklad `https://your-project.supabase.co` |
| `supabase_key` | API kľúč s prístupom k cieľovým tabuľkám |
| `supabase_schema` | Voliteľná predvolená schéma (predvolene `public`) |

### Poznámky

- [Uzol Supabase](../nodes/supabase-node.md) komunikuje s `/rest/v1/<table>` a podporuje operátorové filtre (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` a súvisiace operátory PostgREST) plus vnorené logické skupiny `or` / `and`.
- Pri operáciách zápisu uprednostnite kľúč určený na dôveryhodné serverové použitie s minimálnymi potrebnými oprávneniami k tabuľkám.
- Uzly môžu prepísať schému pre jednotlivý krok, aj keď prihlasovacie údaje definujú predvolenú schému.

### Používa

- [Uzol Supabase](../nodes/supabase-node.md)

## ClickHouse

Prihlasovacie údaje ClickHouse prepájajú Heym s externou databázou ClickHouse prostredníctvom jej HTTP rozhrania, aby workflowy mohli spúšťať SQL, CRUD a count operácie nad OLAP tabuľkami.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `host` | HTTP host bez schémy, napríklad `your-instance.clickhouse.cloud` |
| `port` | Port HTTP rozhrania (`8443` pre HTTPS, `8123` pre HTTP) |
| `username` | Používateľ ClickHouse (predvolene `default`) |
| `password` | Heslo používateľa (voliteľné) |
| `database` | Cieľová databáza (predvolene `default`) |
| `secure` | Použiť HTTPS, ak `true` (vyžadované pre ClickHouse Cloud) |

### Poznámky

- [Uzol ClickHouse](../nodes/clickhouse-node.md) používa oficiálny HTTP klient `clickhouse-connect` a parameterizuje väzby filtrov a hodnôt.
- `update` a `remove` sa mapujú na `ALTER TABLE ... UPDATE` a `DELETE FROM`, čo sú asynchrónne mutácie ClickHouse; obe vyžadujú filter.
- `upsert` vykonáva `INSERT` a predpokladá tabuľku `ReplacingMergeTree` pre správanie merge-on-key.
- Použite **Test connection** v dialógu prihlasovacích údajov na overenie dostupnosti.

### Používa

- [Uzol ClickHouse](../nodes/clickhouse-node.md)

## Notion

Prihlasovacie údaje Notion podporujú buď interný integračný token, alebo OAuth
pripojenie verejnej integrácie. OAuth umožňuje každému používateľovi autorizovať pracovný priestor Notion priamo z Heym namiesto manuálneho kopírovania
tokenu.

### Povinné polia

| Režim | Pole | Popis |
|------|-------|-------------|
| Interný token | `api_token` | Interný integračný token (`ntn_...`) |
| OAuth | `client_id` | Client ID z verejnej integrácie Notion |
| OAuth | `client_secret` | Client Secret z verejnej integrácie Notion |

OAuth callback automaticky ukladá `access_token`, `auth_mode`, `workspace_id`, `workspace_name` a `bot_id`.
Akýkoľvek predchádzajúci interný `api_token` sa pri dokončení OAuth odstráni. Zaregistrujte túto
redirect URI v Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Postup nastavenia OAuth

1. V dialógu prihlasovacích údajov zvoľte **OAuth**, zadajte názov, Client ID a Client Secret.
2. Kliknite na **Connect** a autorizujte pracovný priestor v popup okne Notion.
   - Pre **nové** prihlasovacie údaje Heym vytvorí záznam prihlasovacích údajov po kliknutí na **Connect**.
   - Dokončite autorizáciu v popup okne a potom kliknite na **Save** na návrat do zoznamu prihlasovacích údajov.
3. Pripojené prihlasovacie údaje zobrazujú v zozname `connected (Workspace Name)`. Čakajúce OAuth
   prihlasovacie údaje zobrazujú `Not connected`, kým sa autorizácia nedokončí.

Použite **Test Connection** v dialógu prihlasovacích údajov na overenie buď interného tokenu, alebo dokončenej
OAuth autorizácie. Pri úprave ponechanie poľa tokenu prázdneho zachová uložený interný token.

Interné tokeny aj OAuth access tokeny sú dostupné prostredníctvom
`$credentials.CredentialName` pre vlastné [HTTP](../nodes/http-node.md) volania, ktoré vyžadujú Notion
bearer token.
### Poznámky

- Interné integrácie vyžadujú zdieľanie príslušných stránok, databáz a zdrojov údajov.
- Používatelia OAuth si počas autorizácie v Notion vyberajú pracovný priestor/stránky.
- Prihlasovacie údaje aplikácie OAuth sú zašifrované v rámci prihlasovacích údajov Notion. Callback ich opätovne načíta na strane servera; tajný kľúč nie je vložený v stave OAuth.
- Pripojené prihlasovacie údaje OAuth zobrazujú názov pracovného priestoru; čakajúce prihlasovacie údaje OAuth zobrazujú `Not connected`, kým sa autorizácia nedokončí.
- **Produkcia:** Nastavte backend **`FRONTEND_URL`** na verejnú URL adresu prehliadača (schéma + hostiteľ, bez koncového lomítka). URI presmerovania Notion sa musí presne zhodovať:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Uzol používa verziu API `2026-03-11` a aktuálnu terminológiu `data_source`. Pokyny na migráciu zo starších príkladov s `archived`, `after` alebo databázovým dotazom nájdete v článku [uzol Notion](../nodes/notion-node.md#api-version-notes).
- Staré filtre vyhľadávania s hodnotou objektu `database` sa normalizujú na `data_source`.

### Používa sa v

- [uzol Notion](../nodes/notion-node.md)

---

## SMTP (e-mail)

Prihlasovacie údaje SMTP uchovávajú podrobnosti o pripojení k e-mailovému serveru na odosielanie odchádzajúcej pošty.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `host` | Názov hostiteľa servera SMTP (napr. `smtp.gmail.com`) |
| `port` | Port SMTP (zvyčajne `587` pre STARTTLS, `465` pre SSL) |
| `email` | E-mailová adresa odosielateľa |
| `password` | Heslo SMTP alebo App Password |

### Bežní poskytovatelia SMTP

| Poskytovateľ | Hostiteľ | Port | Poznámky |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Vyžaduje [App Password](https://support.google.com/accounts/answer/185833) (musí byť zapnuté 2FA) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Použite prihlasovacie údaje svojho konta Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Použite prihlasovacie údaje SMTP Mailgun z nastavení svojej domény |
| SendGrid | `smtp.sendgrid.net` | `587` | Použite `apikey` ako používateľské meno a API kľúč ako heslo |
| Vlastný / samostatne hostovaný | vaša doména | `587` / `465` | Postfix, Exim atď. |

### Poznámky

- Gmail vyžaduje **App Password** namiesto bežného hesla, keď je zapnuté dvojstupňové overenie.
- Port `587` používa STARTTLS (začína ako nešifrovaný, neskôr sa povýši na TLS). Port `465` používa implicitné TLS (SSL od začiatku).

### Používa sa v

- [uzol Send Email](../nodes/send-email-node.md)

---

## IMAP (prichádzajúca pošta)

Prihlasovacie údaje IMAP uchovávajú podrobnosti o pripojení na monitorovanie schránky pomocou [uzla IMAP Trigger](../nodes/imap-trigger-node.md).

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `imap_host` | Názov hostiteľa servera IMAP (napríklad `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` pre SSL/TLS u väčšiny poskytovateľov) |
| `imap_username` | Používateľské meno schránky alebo úplná e-mailová adresa |
| `imap_password` | Heslo alebo špecifické heslo aplikácie poskytovateľa |

### Voliteľné polia

| Pole | Popis |
|-------|-------------|
| `imap_mailbox` | Priečinok schránky na monitorovanie (predvolené: `INBOX`) |
| `imap_use_ssl` | Zapnúť SSL/TLS (odporúčané; predvolené: `true`) |

### Poznámky

- Trigger IMAP pri prvom cykle zisťovania nastaví východiskový stav aktuálnej schránky a potom spracúva iba novšie e-maily.
- Gmail, Microsoft 365 a ďalší hostovaní poskytovatelia často vyžadujú **heslo aplikácie** alebo podobný tajný kľúč špecifický pre IMAP.
- Obsah príloh sa nestiahne do payloadu workflowu; Heym sprístupňuje iba metadáta príloh.

### Používa sa v

- [uzol IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP ako trigger workflowu)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) je open-source message broker. Prihlasovacie údaje RabbitMQ uchovávajú podrobnosti o pripojení na publikovanie do frontov a výmen a ich odber.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `rabbitmq_host` | URL adresa pripojenia AMQP (napr. `amqp://localhost:5672`) |
| `rabbitmq_username` | Používateľské meno RabbitMQ (predvolené: `guest`) |
| `rabbitmq_password` | Heslo RabbitMQ (predvolené: `guest`) |

### Virtuálne hostitelia

Ak sa chcete pripojiť ku konkrétnemu virtuálnemu hostiteľovi, uveďte ho v URL adrese `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Ak používate predvoleného virtuálneho hostiteľa, cestu `/` možno vynechať.

### Plugin pre oneskorené správy

[Uzol RabbitMQ](../nodes/rabbitmq-node.md) podporuje plugin **rabbitmq_delayed_message_exchange**. Keď je tento plugin na vašom serveri RabbitMQ zapnutý, môžete na odchádzajúcich správach nastaviť oneskorenie (v milisekundách) pomocou poľa `rabbitmqDelayMs` na uzle.

Uzol nastaví hlavičku `x-delay` na publikovanej správe. Aby oneskorenia nadobudli účinnosť, typ výmeny musí byť `x-delayed-message`.

Zapnutie pluginu na samostatne hostovanej inštancii RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Keď plugin nie je nainštalovaný, hlavička `x-delay` sa ignoruje a správy sa doručia okamžite.

### Používa sa v

- [uzol RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ ako trigger workflowu)

---

## Amazon S3

Prihlasovacie údaje Amazon S3 pripájajú Heym k [Amazon S3](https://aws.amazon.com/s3/). Použite ich s [uzlom Amazon S3](../nodes/amazon-s3-node.md) na správu bucketov a priečinkov, nahrávanie a sťahovanie objektov, kopírovanie kľúčov a zobrazovanie alebo odstraňovanie objektov z workflowov.
### Povinné polia

| Pole | Popis |
|-------|-------------|
| `aws_access_key_id` | ID prístupového kľúča AWS IAM |
| `aws_secret_access_key` | Tajný prístupový kľúč spárovaný s ID prístupového kľúča |
| `aws_region` | Región AWS, v ktorom sa nachádzajú buckety (napr. `us-east-1`) |

### Voliteľné polia

| Pole | Popis |
|-------|-------------|
| `aws_session_token` | Dočasný session token pri používaní prihlasovacích údajov AWS STS |

### Poznámky

- Prihlasovacie údaje používajú štandardnú autentifikáciu AWS SigV4 prostredníctvom boto3.
- Operácie nahrávania v súčasnosti odosielajú textový obsah vo formáte UTF-8; sťahovanie môže vrátiť text alebo base64 pre binárne objekty.

### Používa

- [Uzol Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) je úložisko kľúč-hodnota v pamäti používané na cachovanie a rýchly prístup k údajom.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `host` | Názov hostiteľa alebo IP adresa servera Redis (napr. `localhost`) |
| `port` | Port Redis (predvolené: `6379`) |
| `password` | Heslo Redis (ponechajte prázdne, ak nie je nastavené) |

### Používa

- [Uzol Redis](../nodes/redis-node.md)

---

## Slack

Prihlasovacie údaje Slack ukladajú **Incoming Webhook URL** na odosielanie správ do kanálov Slack.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (z konfigurácie vašej aplikácie Slack) |

### Poznámky

- Vytvorte Incoming Webhook na [api.slack.com/apps](https://api.slack.com/apps) → vaša aplikácia → **Incoming Webhooks**.
- Každý webhook je viazaný na konkrétny kanál. Pre rôzne kanály vytvorte viacero prihlasovacích údajov.

### Používa

- [Uzol Slack](../nodes/slack-node.md)

---

## Telegram

Prihlasovacie údaje Telegram ukladajú **Bot Token** a voliteľný **Webhook Secret Token** pre workflowy založené na botoch.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `bot_token` | Token Telegram Bot API z BotFather |

### Voliteľné polia

| Pole | Popis |
|-------|-------------|
| `secret_token` | Zdieľané tajomstvo overované voči `x-telegram-bot-api-secret-token` pri prichádzajúcich webhookoch |

### Poznámky

- Použite rovnaké prihlasovacie údaje pre [Telegram Trigger](../nodes/telegram-trigger-node.md) aj [Telegram](../nodes/telegram-node.md).
- Zaregistrujte webhook manuálne pomocou Telegram API `setWebhook` s URL zobrazenou v paneli uzla Telegram Trigger.
- `chatId` v uzle Telegram môže byť doslovné ID alebo výraz ako `$telegramEvent.message.chat.id`.

### Používa

- [Uzol Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Uzol Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Tieto prihlasovacie údaje používa [uzol HTTP](../nodes/http-node.md) na autentifikáciu odchádzajúcich požiadaviek.

### Bearer

Pripojí hlavičku `Authorization: Bearer <token>` k HTTP požiadavkám.

| Pole | Popis |
|-------|-------------|
| `token` | Hodnota bearer tokenu |

### Header

Pripojí vlastnú hlavičku k HTTP požiadavkám.

| Pole | Popis |
|-------|-------------|
| `header_key` | Názov hlavičky (napr. `X-Api-Key`) |
| `header_value` | Hodnota hlavičky |

Oba typy je možné tiež referencovať prostredníctvom `$credentials.CredentialName` v [Expression DSL](./expression-dsl.md) na dynamické použitie v ktoromkoľvek uzle, ktorý akceptuje výrazy.

### Používa

- [Uzol HTTP](../nodes/http-node.md)

---

## Poskytovatelia LLM (OpenAI, Google, Custom, Cohere)

Tieto prihlasovacie údaje poháňajú AI uzly.

| Typ | Popis |
|------|-------------|
| **OpenAI** | API kľúč pre modely GPT a OpenAI embeddings |
| **Google** | API kľúč pre modely Gemini |
| **Custom** | API kľúč + base URL pre endpointy kompatibilné s OpenAI (Ollama, vLLM, LM Studio atď.) |
| **Cohere** | API kľúč pre Cohere embeddings |

### OpenAI Prompt Caching

OpenAI automaticky cachuje statickú (nemennú) predponu vášho systémového promptu — nie je potrebná žiadna dodatočná konfigurácia. Opakované spustenia workflowu, ktoré zdieľajú rovnakú predponu systémového promptu, profitujú z cien za cachované tokeny, čo znižuje náklady aj latenciu. Je to obzvlášť užitočné, keď máte dlhé, pevné inštrukcie a medzi spusteniami sa mení iba používateľská správa. Sledujte mieru zásahov do cache a úspory tokenov na karte [Spustenia](../tabs/traces-tab.md) alebo v dashboarde využitia OpenAI, aby ste optimalizovali štruktúru promptu pre maximálne opätovné využitie cache.

### Používa

- [Uzol LLM](../nodes/llm-node.md)
- [Uzol Agent](../nodes/agent-node.md)
- [Uzol RAG](../nodes/rag-node.md) (OpenAI embeddings prostredníctvom prihlasovacích údajov Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) je proxy server na obchádzanie Cloudflare a podobných bot-protection výziev.

### Povinné polia

| Pole | Popis |
|-------|-------------|
| `flaresolverr_url` | URL vašej inštancie FlareSolverr (napr. `http://localhost:8191`) |

Loopback a privátne adresy sú tu podporované, takže spustenie FlareSolverr vedľa Heym funguje podľa dokumentácie. URL sa nesmie prekladať na link-local alebo cloud-metadata adresu. Keďže sú privátne adresy povolené, toto pole je možné nasmerovať aj na inú internú službu a odpoveď sa vráti vo výstupe uzla. Tieto prihlasovacie údaje môže vytvoriť ktorýkoľvek prihlásený používateľ, takže hranicou je to, kto môže vytvárať workflowy, plus vaše sieťové pravidlá, nie zdieľanie prihlasovacích údajov. Pozrite si [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Používa

- [Uzol Crawler](../nodes/crawler-node.md)

---
## Súvisiace

- [Prihlasovacie údaje](./credentials.md) – Prehľad prihlasovacích údajov a ich používania v uzloch
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľanie prihlasovacích údajov s používateľmi a tímami
- [Zabezpečenie](./security.md) – Šifrovanie v pokoji, riadenie prístupu
- [Expression DSL](./expression-dsl.md) – Syntax `$credentials` pre dynamický prístup

---

## Model Router (Auto Model)

Smeruje každú požiadavku na jeden z Vašich existujúcich prihlasovacích údajov modelu, pričom
na výber používa rozhodovací model. Ukladá iba referencie, nikdy vlastný kľúč.

### Povinné polia

- `decision_credential_id` – prihlasovacie údaje **Decision Model**, ku ktorým máte prístup.
- `decision_model` – model, ktorý vykonáva smerovacie volanie, napríklad `jev-latest`.
- `options` – aspoň dve položky, každá s názvom, jednými z Vašich prihlasovacích údajov OpenAI/Google/Custom,
  modelom na nich a kritériami určujúcimi, kedy by mali zvíťaziť.

### Voliteľné polia

- `routing_instructions` – ako celkovo vyhodnocovať jednotlivé možnosti.
- Jedna možnosť môže byť označená ako fallback použitý v prípade zlyhania smerovania.

### Poznámky

Názvy možností sú to, medzi čím rozhodovací model vyberá, preto musia byť jedinečné. Možnosť
nemôže odkazovať na iný Model Router.
