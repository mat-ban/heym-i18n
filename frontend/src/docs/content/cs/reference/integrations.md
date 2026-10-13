# Integrace třetích stran

Heym se připojuje k externím službám prostřednictvím **přihlašovacích údajů**. Každý typ přihlašovacích údajů ukládá podrobnosti o připojení k jedné službě a lze jej opakovaně použít napříč více uzly a workflow. Přehled naleznete v části [Přihlašovací údaje](./credentials.md).

Přihlašovací údaje přidávejte v části [Nastavení → Přihlašovací údaje](../tabs/credentials-tab.md). Všechny hodnoty jsou v klidovém stavu šifrovány. Přihlašovací údaje lze [sdílet](./credentials-sharing.md) s dalšími uživateli nebo s [týmy](./teams.md).

Některé integrační uzly **nevyžadují** přihlašovací údaje. [WebSocket Trigger](../nodes/websocket-trigger-node.md) a [WebSocket Send](../nodes/websocket-send-node.md) se připojují k externím socketům pomocí URL, hlaviček a subprotokolů nakonfigurovaných přímo na uzlu.

## Přehled typů přihlašovacích údajů

| Typ | Používáno v | Klíčová pole |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, volitelně `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, volitelně `base_url` |
| **Jira** | [Uzel Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, volitelně `api_version` |
| **Linear** | [Uzel Linear](../nodes/linear-node.md) | `api_key`, nebo `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Uzel Sentry](../nodes/sentry-node.md) | `api_token`, volitelně `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluace](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, volitelně `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, výchozí nastavení AI | přihlašovací údaje rozhodovacího modelu plus volby modelu odkazující na Vaše další přihlašovací údaje |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorová úložiště | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorová úložiště | `openai_api_key` (vektory uložené ve vlastním Postgresu Heymu prostřednictvím pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorová úložiště | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, volitelně `embedding_api_key`, plus `qdrant_host` pokud je `db_type` nastaveno na `qdrant` |
| **Grist** | [Uzel Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Uzel Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + souhlas OAuth2 |
| **Google Drive** | [Uzel Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + souhlas OAuth2 (plný rozsah Drive) |
| **BigQuery** | [Uzel BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + souhlas OAuth2 |
| **Supabase** | [Uzel Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, volitelně `supabase_schema` |
| **ClickHouse** | [Uzel ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Uzel Notion](../nodes/notion-node.md) | `api_token`, nebo `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Uzel Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Uzel IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Uzel Telegram Trigger](../nodes/telegram-trigger-node.md), [Uzel Telegram](../nodes/telegram-node.md) | `bot_token`, volitelně `secret_token` |
| **Discord** | [Uzel Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Uzel Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Uzel RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Uzel Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Uzel Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Uzel Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Uzel HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Uzel HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Uzel Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Přihlašovací údaje GitHub ukládají osobní přístupový token GitHubu (PAT), aby workflow mohly volat GitHub REST API prostřednictvím [uzlu GitHub](../nodes/github-node.md), předávat token do MCP serverů, jako je `@modelcontextprotocol/server-github`, nebo jej používat z [uzlu HTTP](../nodes/http-node.md) pro vlastní REST volání.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `api_key` | Osobní přístupový token GitHubu (jemně zrnitý PAT `github_pat_...` nebo klasický PAT `ghp_...`) |
### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `base_url` | Základní URL adresa GitHub API pro GitHub Enterprise Server (například `https://github.example.com/api/v3`) |

### Poznámky

- Pokud je to možné, doporučujeme používat fine-grained personal access tokeny, protože je lze omezit na konkrétní repozitáře a oprávnění.
- Pro GitHub.com ponechte `base_url` prázdné. Pro GitHub Enterprise Server použijte úplný REST API
  endpoint včetně `/api/v3` (například `https://github.example.com/api/v3`), nikoli
  kořen webového rozhraní serveru, jako je `https://github.example.com`.
- Tento přihlašovací údaj aktuálně modeluje pouze autentizaci založenou na PAT. Pro přístup k repozitářům organizace použijte PAT, kterému byla udělena požadovaná oprávnění organizace/repozitáře.
- Instalační tokeny GitHub App a procesy nastavení GitHub App nejsou v současnosti v rozhraní Heym plnohodnotně podporovány.
- Pro nativní operace s repozitáři, uživateli, issues, pull requesty, revizemi, releases, Actions workflow, provozem a soubory preferujte [Uzel GitHub](../nodes/github-node.md). [Uzel HTTP](../nodes/http-node.md) použijte pouze tehdy, když potřebujete endpointy nebo payloady, které uzel GitHub nepokrývá.
- Použijte [Uzel Agent](../nodes/agent-node.md) s MCP předáním `$credentials.YourGitHubCredential` do proměnné prostředí MCP připojení, jako je `GITHUB_PERSONAL_ACCESS_TOKEN`.
- REST API GitHubu obvykle očekává `Authorization: Bearer <token>` spolu s `Accept: application/vnd.github+json`.
- Při úpravě přihlašovacího údaje GitHub ponechání prázdného pole `base_url` pro GitHub Enterprise zachová
  stávající endpoint. Novou URL adresu zadejte pouze tehdy, když chcete tento endpoint změnit.

### Používáno

- [Uzel GitHub](../nodes/github-node.md)
- [Uzel Codex](../nodes/codex-node.md)
- [Uzel Agent](../nodes/agent-node.md)
- [Uzel HTTP](../nodes/http-node.md)

---

## Rozhodovací model

Rozhodovací model odpovídá na typované otázky o stavu a vrací pravděpodobnosti namísto textu. Referenční implementací je Jev od TypeSafe; funguje jakýkoli endpoint, který přijímá stejné tělo `{model, state, questions}`, a [Uzel Decision](../nodes/decision-node.md) může odeslat ručně napsané tělo pro ten, který jej nepřijímá.

### Povinná pole

- `base_url` – endpoint, například `https://api.typesafe.ai`. Heym připojuje `/v1/systemone`.

### Volitelná pole

- `api_key` – odesílán jako `Authorization: Bearer`. Endpointy, které klíč nevyžadují, mohou toto pole ponechat prázdné.

### Poznámky

- **Test Connection** odešle jednu drobnou otázku pro ověření, že endpoint a klíč fungují.
- Při úpravě přihlašovacího údaje zůstane uložený klíč zachován, pokud pole pro klíč ponecháte prázdné.
- Odchozí požadavky na privátní a loopback adresy jsou ve výchozím nastavení blokovány, takže self-hosted endpoint na `localhost` nebo v privátním rozsahu vyžaduje `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Tyto modely nejsou uvedeny v cenových tabulkách LLM, které Heym synchronizuje, takže sloupec Cost v [Spuštěních](../tabs/traces-tab.md) zůstává prázdný. Počty tokenů se však stále zaznamenávají.

### Používáno

- [Decision](../nodes/decision-node.md)
- [Evaluace](../tabs/evals-tab.md) – vyhodnocuje odpovědi `LLM-as-Judge` proti očekávanému výstupu

## OpenAI Codex

Přihlašovací údaj OpenAI Codex autentizuje [Uzel Codex](../nodes/codex-node.md). Je oddělený od přihlašovacího údaje OpenAI API key používaného uzly LLM, Agent a RAG.

### Režimy autentizace

| Režim | Popis |
|------|-------------|
| **Sign in with ChatGPT** (doporučeno) | Přihlášení OAuth (PKCE), které využívá vaše předplatné ChatGPT Plus/Pro, takže spuštění se vyhýbají nákladům na API za token. Heym ukládá a automaticky obnovuje sadu tokenů. |
| **Access token** | ChatGPT/Codex `access_token` předávaný pouze lokálnímu procesu Codex CLI. |

### Poznámky

- API klíče jsou pro tento typ přihlašovacího údaje odmítnuty.
- Tokeny Codex nejsou vystaveny prostřednictvím `$credentials.Name`.
- Uzel Codex také vyžaduje přihlašovací údaj GitHub pro klonování repozitáře, push větve a vytvoření draft PR.

### Používáno

- [Uzel Codex](../nodes/codex-node.md)

## OpenCode Go

Přihlašovací údaj OpenCode Go autentizuje [Uzel OpenCode Go](../nodes/opencode-go-node.md). Ukládá API klíč brány OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) a volitelnou základní URL adresu brány.

### Pole

| Pole | Popis |
|-------|-------------|
| **API Key** | API klíč brány OpenCode Go (povinné). |
| **Gateway Base URL** | Volitelné; výchozí hodnota je `https://opencode.ai/zen/go/v1`. Přepište pouze pro self-hosted nebo proxy bránu. |

### Poznámky

- API klíč je předán pouze procesu OpenCode CLI uvnitř zabezpečeného kontejneru.
- Uzel OpenCode Go také vyžaduje přihlašovací údaj GitHub pro klonování repozitáře, push větve a vytvoření pull requestu. Token GitHub není nikdy umístěn uvnitř sandbox kontejneru.

### Používáno

- [Uzel OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Přihlašovací údaj Linear podporuje buď osobní API klíč, nebo OAuth2 pro
[Uzel Linear](../nodes/linear-node.md). Heym odesílá nativní GraphQL dotazy do Linear pro metadata pracovního prostoru,
projekty, issues a komentáře.
### Nastavení

Zvolte jeden režim autentizace:

**Osobní API klíč**

1. V Linearu otevřete **Settings → Security & Access → Personal API keys**.
2. Vytvořte klíč s přístupem k pracovnímu prostoru, který chcete automatizovat.
3. Vložte klíč do přihlašovacích údajů Linear v Heymu a pomocí **Test Connection** jej ověřte.

**OAuth2**

1. Vytvořte aplikaci Linear OAuth.
2. Zaregistrujte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` jako redirect URI.
3. V Heym Dashboard → **Credentials** → **New** → typ **Linear**.
4. Zvolte **OAuth2**, zadejte Client ID a Client Secret a klikněte na **Connect**.

### Povinná pole

| Režim | Pole | Popis |
|------|-------|-------------|
| Osobní API klíč | `api_key` | Osobní API klíč Linear, obvykle s předponou `lin_api_` |
| OAuth2 | `client_id` | Client ID z aplikace Linear OAuth |
| OAuth2 | `client_secret` | Client Secret z aplikace Linear OAuth |

OAuth tokeny (`access_token`, `refresh_token`, `token_expiry`) se ukládají a obnovují automaticky.

### Poznámky

- Osobní API klíče a OAuth tokeny jednají jako uživatel Linear, který je vytvořil nebo autorizoval.
- Linear OAuth používá scopes `read,write,issues:create,comments:create`.
- Pomocí **Test Connection** v dialogu přihlašovacích údajů ověřte API klíč nebo OAuth token proti Linear API.
- Pomocí List Teams a List Projects v uzlu Linear zjistěte UUID před vytvářením nebo filtrováním issues.
- Pomocí List Workflow States a List Team Members zjistěte UUID stavů a přiřazených osob pro aktualizace.
- API klíč rotujte úpravou přihlašovacích údajů a zadáním nové hodnoty. Pokud rotujete secrets aplikace OAuth, znovu připojte přihlašovací údaje pomocí **Connect**.

### Používá

- [Uzel Linear](../nodes/linear-node.md)

---

## Jira

Přihlašovací údaje Jira ukládají přihlašovací údaje Jira Basic auth, základní URL Jira site, režim nasazení a volitelnou verzi REST API pro [uzel Jira](../nodes/jira-node.md). Použijte `cloud` pro Jira Cloud nebo `data_center` pro Jira Data Center / Server.

### Nastavení

**Jira Cloud**

1. V nastavení účtu Atlassian vytvořte API token.
2. V Heym Dashboard → **Credentials** → **New** → typ **Jira**.
3. Zadejte e-mail Atlassian, API token a URL Jira site, například `https://your-domain.atlassian.net`.
4. Pomocí **Test Connection** ověřte přihlašovací údaje.

**Jira Data Center / Server**

1. Jako nasazení zvolte **Jira Data Center / Server**.
2. Zadejte uživatelské jméno a heslo Jira používané pro Basic auth.
3. Zadejte URL Jira site, například `https://jira.example.com`.
4. Pomocí **Test Connection** ověřte přihlašovací údaje.

### Pole

| Pole | Popis |
| --- | --- |
| `email` | E-mail účtu Atlassian pro Jira Cloud nebo uživatelské jméno pro Jira Data Center / Server |
| `api_token` | API token Atlassian pro Jira Cloud nebo heslo pro Basic auth pro Jira Data Center / Server |
| `base_url` | Základní URL Jira site |
| `deployment` | `cloud` pro Jira Cloud nebo `data_center` pro Jira Data Center / Server |
| `api_version` | Verze REST API; výchozí hodnota je `3` pro Jira Cloud. Data Center / Server používá v2 |

### Poznámky

- Uzel Jira odesílá popisy issues a komentáře jako textové dokumenty Atlassian Document Format
  pro Jira Cloud REST API v3. Přihlašovací údaje Data Center / Server odesílají prostý text.
- Data Center / Server aktuálně podporuje pouze Basic auth s uživatelským jménem a heslem. Osobní přístupové
  tokeny a Bearer auth zatím nejsou podporovány.
- Nahrávání příloh přijímá obsah ve formátu base64 nebo data URL a podléhá limitu velikosti souboru platformy (výchozí 99 MB). Stahování příloh může při povolení vracet obsah base64.
- Vytváření a mazání uživatelů a oznámení o issues vyžadují, aby měl ověřený účet Jira příslušná oprávnění k Jira site nebo organizaci.
- Pomocí List Projects, Search Issues a List Transitions zjistěte klíče projektů, klíče issues a ID přechodů.
- Pro vlastní endpointy, které uzel Jira nepokrývá, použijte [uzel HTTP](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` pro Cloud nebo `username:password` pro Data Center / Server) v příkazu cURL, nebo přihlašovací údaje typu Header s odpovídající hodnotou `Authorization: Basic <base64(user:secret)>`.

Viz také:

- [Uzel Jira](../nodes/jira-node.md)
- [Přihlašovací údaje](./credentials.md)

---

## Sentry

Přihlašovací údaje Sentry ukládají auth token pro [uzel Sentry](../nodes/sentry-node.md). Heym používá REST API Sentry pro operace s organizacemi, projekty, týmy, issues, událostmi a releases.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `api_token` | Auth token Sentry s přístupem k organizacím a projektům, které automatizujete |

### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `base_url` | Volitelná kořenová URL pro self-hosted Sentry, například `https://sentry.example.com` |

### Poznámky

- Pro Sentry SaaS ponechte `base_url` prázdné.
- Pomocí **Test Connection** ověřte, že token dokáže vypsat viditelné organizace.
- Pro vlastní REST volání použijte `$credentials.YourSentryCredential` jako bearer token.

### Používá

- [Uzel Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) je open-source vektorová databáze používaná pro sémantické vyhledávání a RAG (Retrieval Augmented Generation).

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `qdrant_host` | Úplná URL k vaší instanci Qdrant (např. `http://localhost:6333` nebo cloudový endpoint) |
| `openai_api_key` | API klíč OpenAI používaný ke generování embeddings při indexování a vyhledávání dokumentů |
### Poznámky

- Kolekce Qdrant se spravují na kartě [Vektorová úložiště](../tabs/vectorstores-tab.md). Každé vektorové úložiště odpovídá jedné kolekci Qdrant.
- [Uzel RAG](../nodes/rag-node.md) používá vektorové úložiště (které odkazuje na přihlašovací údaje Qdrant) — neodkazuje na přihlašovací údaje přímo.
- Pokud vaše instance Qdrant vyžaduje API klíč, zahrňte jej do hodnoty `qdrant_host` nebo Qdrant odpovídajícím způsobem nakonfigurujte; současná integrace nemá samostatné pole pro API klíč Qdrant.
- Vlastní instance Qdrant: použijte [oficiální Docker image](https://hub.docker.com/r/qdrant/qdrant) a zpřístupněte port `6333`.

### Používáno

- [Uzel RAG](../nodes/rag-node.md) (prostřednictvím vektorového úložiště)
- [Karta Vektorová úložiště](../tabs/vectorstores-tab.md)

## Vlastní embeddings (RAG)

Ve výchozím nastavení pocházejí embeddings pro RAG z OpenAI. Přihlašovací údaje **RAG: Custom Embeddings** místo toho odkazují na jakýkoli endpoint kompatibilní s OpenAI pro embeddings — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together nebo hostovanou bránu — a určují vektorové úložiště, do kterého se zapisuje.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `embedding_base_url` | URL endpointu včetně cesty `/v1`, např. `http://localhost:11434/v1` |
| `embedding_api_key` | Volitelné. Lokální servery obvykle klíč nevyžadují |
| `embedding_model` | Název modelu tak, jak jej endpoint očekává, např. `nomic-embed-text` |
| `embedding_dimensions` | Šířka vektoru, kterou model vrací (výchozí `1536`) |
| `embedding_request_dimensions` | Volitelné. Požádejte endpoint, aby vrátil `embedding_dimensions` místo nativní šířky modelu |
| `db_type` | `qdrant` nebo `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Připojení k Qdrant, povinné, když je `db_type` nastaveno na `qdrant` |

### Poznámky

- **Qdrant přijímá libovolný počet dimenzí.** Každá kolekce se vytváří s šířkou, kterou tyto přihlašovací údaje deklarují, takže pole Dimensions lze libovolně upravovat.
- **Postgres (pgvector) vyžaduje přesně 1536 dimenzí.** Jeho sloupec je pevně nastaven na `vector(1536)`, takže pole Dimensions je uzamčeno na 1536 a přihlašovací údaje deklarující jinou šířku jsou při ukládání odmítnuty.
- **Zkrácení pro pgvector.** Pokud je úložištěm Postgres, dialog nabízí možnost *Ask the endpoint to return 1536 dimensions*. Tím se odešle požadovaný parametr `dimensions`, který modely trénované s reprezentacemi Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` a podobné) respektují a vracejí zkrácený, stále smysluplný vektor. Endpointy, které tento parametr nepodporují, požadavek odmítnou, a endpointy, které jej přijmou, ale ignorují, vyprodukují jasnou chybu s uvedením skutečně vrácené šířky. Heym sám vektory nikdy nezkracuje, protože ořezávání výstupu modelu, který není typu Matryoshka, tiše zhoršuje kvalitu vyhledávání. Tato možnost se u Qdrant nenabízí, protože ten dokáže kolekci nastavit na libovolnou šířku.
- Pomocí **Test Connection** v dialogu přihlašovacích údajů vložte zkušební řetězec a podívejte se, jakou šířku model skutečně vrací, než vytvoříte úložiště.
- Parametr požadavku `dimensions` se odesílá pouze samotnému OpenAI, protože většina serverů kompatibilních s OpenAI neznámé parametry odmítá. Nativní šířka modelu se místo toho validuje proti přihlašovacím údajům.
- Stávající přihlašovací údaje **RAG: Qdrant + OpenAI** a **RAG: Psql + OpenAI** zůstávají nezměněny a nadále fungují.

### Používáno

- [Uzel RAG](../nodes/rag-node.md) (prostřednictvím vektorového úložiště)
- [Karta Vektorová úložiště](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym může také ukládat vektory **přímo ve své vlastní databázi Postgres** pomocí rozšíření [pgvector](https://github.com/pgvector/pgvector) — není vyžadována žádná externí vektorová služba. Vytvořte přihlašovací údaje **RAG: Psql + OpenAI** a použijte je při vytváření vektorového úložiště, poté v rozbalovacím seznamu Database v uzlu RAG zvolte **Postgres (pgvector)**.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `openai_api_key` | API klíč OpenAI používaný ke generování embeddings při indexování a vyhledávání dokumentů |

### Poznámky

- Není potřeba žádný host/port — vektory se zapisují do vlastní databáze Heymu; Heym se nikdy nepřipojuje k jiné databázi.
- Všechny funkce RAG dostupné s Qdrant (vkládání, vyhledávání, filtry metadat, přehodnocování Cohere, klonování, sdílení) fungují s backendem Postgres identicky.
- Vyžaduje rozšíření `vector`. Heym ponechává oficiální image `postgres:16` nezměněný (takže stávající data nejsou nikdy dotčena) a **při spuštění automaticky nainstaluje balíček `postgresql-16-pgvector`** — `run.sh`, `deploy.sh` i `run_e2e.sh` to řeší. Instalace není fatální: pokud ji nelze spustit (např. žádná síť), RAG s Qdrant funguje dál a backend Postgres zůstává neaktivní (migrace tabulku elegantně přeskočí).
- Pokud spouštíte publikovaný image s jedním kontejnerem (`ghcr.io/heymrun/heym`) proti **vlastnímu externímu Postgresu**, musí tato databáze podporovat rozšíření `vector` (Heym jej nemůže nainstalovat do databáze, kterou nespravuje). Bez něj vytvoření nebo nahrání do vektorového úložiště Postgres vrátí jasnou zprávu a RAG s Qdrant funguje dál.

### Používáno

- [Uzel RAG](../nodes/rag-node.md) (prostřednictvím vektorového úložiště)
- [Karta Vektorová úložiště](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) je hybrid tabulky a databáze, který podporuje strukturovaná data a vzorce. Přihlašovací údaje Grist umožňují Heymu číst a zapisovat dokumenty Grist.
### Povinná pole

| Pole | Popis |
|-------|-------------|
| `api_key` | Grist API klíč (naleznete v **Profile → API Key** ve své instanci Grist) |
| `server_url` | Základní URL vašeho serveru Grist (např. `https://docs.getgrist.com` pro Grist Cloud nebo URL vaší vlastní instance) |

### Poznámky

- [Uzel Grist](../nodes/grist-node.md) vyžaduje ve své konfiguraci **Document ID** (z URL dokumentu Grist) a **Table ID** — tyto údaje nejsou součástí přihlašovacích údajů.
- Pro vlastní instanci Grist nastavte `server_url` na doménu vaší instance.
- ID sloupců v Gristu používají podtržítka (např. `User_Name`), nikoli zobrazované popisky. Pro jejich zjištění použijte operaci `listColumns`.

### Používáno

- [Uzel Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Přihlašovací údaje Google Sheets propojují Heym s Google Sheets API pomocí modelu OAuth2 „Bring Your Own App". Poskytnete OAuth2 Client ID a Client Secret z Google Cloud a poté autorizujete přístup prostřednictvím popupu v prohlížeči. Tokeny jsou automaticky obnovovány na pozadí.

### Nastavení

1. Otevřete [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhledejte a povolte **Google Sheets API**.
2. Přejděte na **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikace **Web application**.
3. V části **Authorized redirect URIs** přidejte: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Zkopírujte vygenerované **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Přihlašovací údaje** → **New** → typ **Google Sheets (OAuth2)**.
6. Zadejte Client ID, Client Secret a název, poté klikněte na **Connect** pro otevření popupu se souhlasem Google a autorizujte přístup.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) jsou ukládány a obnovovány automaticky — nespravujete je přímo.

### Poznámky

- Obrazovka souhlasu OAuth2 vyžaduje scope pro tabulky (`https://www.googleapis.com/auth/spreadsheets`).
- Heym používá refresh token k získání nových access tokenů před jejich vypršením (60sekundová bezpečnostní rezerva).
- Pokud v Google Cloud Console provedete rotaci Client Secret, znovu propojte přihlašovací údaje tlačítkem **Connect**.
- **Produkce:** Nastavte backendovou proměnnou **`FRONTEND_URL`** na přesnou veřejnou URL, kterou uživatelé otevírají v prohlížeči (schéma + hostitel, např. `https://heym.example.com`). Heym sestavuje Google OAuth redirect URI pouze z této hodnoty — **nedůvěřuje** hlavičkám `Origin` ani `X-Forwarded-*` (ovládaným klientem). Zaregistrujte `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` v Google Cloud Console.

### Používáno

- [Uzel Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Přihlašovací údaje Google Drive propojují Heym s Google Drive API pomocí stejného modelu OAuth2 „Bring Your Own App" jako Google Sheets. Poskytnete OAuth2 Client ID a Client Secret z Google Cloud a poté autorizujete přístup prostřednictvím popupu v prohlížeči. Tokeny jsou automaticky obnovovány na pozadí.

### Nastavení

1. Otevřete [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhledejte a povolte **Google Drive API**.
2. Přejděte na **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikace **Web application**.
3. V části **Authorized redirect URIs** přidejte: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Zkopírujte vygenerované **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Přihlašovací údaje** → **New** → typ **Google Drive (OAuth2)**.
6. Zadejte Client ID, Client Secret a název, poté klikněte na **Connect** pro otevření popupu se souhlasem Google a autorizujte přístup.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) jsou ukládány a obnovovány automaticky — nespravujete je přímo.

### Scope

Google Drive vyžaduje **plný Drive scope** (`https://www.googleapis.com/auth/drive`).

To je nutné, protože uzel pracuje se soubory, které již vlastníte. Užší scope `drive.file` uděluje přístup pouze k souborům vytvořeným samotným OAuth klientem, což by způsobilo, že operace `listFolderFiles`, `updateFile`, `removeFile` a `removeFolder` by neviděly nic z vašeho stávajícího Drive.

Protože poskytujete vlastní Client ID a Secret ze svého projektu Google Cloud, požadavky na ověření aplikace Google pro tento scope se vztahují na váš projekt, nikoli na Heym.

### Poznámky

- Heym používá refresh token k získání nových access tokenů před jejich vypršením (60sekundová bezpečnostní rezerva).
- Pokud v Google Cloud Console provedete rotaci Client Secret, znovu propojte přihlašovací údaje tlačítkem **Connect**.
- Sdílené disky jsou podporovány — uzel nastavuje `supportsAllDrives` při každém volání API.
- **Produkce:** Nastavte backendovou proměnnou **`FRONTEND_URL`** na přesnou veřejnou URL, kterou uživatelé otevírají v prohlížeči. Heym sestavuje Google OAuth redirect URI pouze z této hodnoty — **nedůvěřuje** hlavičkám `Origin` ani `X-Forwarded-*`. Zaregistrujte `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` v Google Cloud Console.
- Před sdílením těchto přihlašovacích údajů s týmem si přečtěte [Sdílení přihlašovacích údajů](./credentials-sharing.md).

### Používáno

- [Uzel Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Přihlašovací údaj BigQuery propojuje Heym s Google BigQuery API pomocí modelu OAuth2 "Bring Your Own App". Poskytnete Google Cloud OAuth2 Client ID a Client Secret a poté autorizujete přístup prostřednictvím popupu v prohlížeči. Tokeny jsou automaticky obnovovány na pozadí.

### Nastavení

1. Otevřete [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → vyhledejte a povolte **BigQuery API**.
2. Přejděte do **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikace **Web application**.
3. V části **Authorized redirect URIs** přidejte: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Zkopírujte vygenerovaný **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Přihlašovací údaje** → **Nový** → typ **BigQuery (OAuth2)**.
6. Zadejte Client ID, Client Secret a název, poté klikněte na **Connect** pro otevření popupu souhlasu Google a autorizujte přístup.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) jsou ukládány a automaticky obnovovány.

### Poznámky

- Obrazovka souhlasu OAuth2 vyžaduje scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produkce:** Nastavte backendovou proměnnou **`FRONTEND_URL`** na veřejnou URL. Zaregistrujte `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` v Google Cloud Console.

### Používáno v

- [Uzel BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Přihlašovací údaj Supabase propojuje Heym s PostgREST API projektu Supabase, takže workflow mohou dotazovat a upravovat tabulky postavené na Postgres.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `supabase_url` | Základní URL projektu, například `https://your-project.supabase.co` |
| `supabase_key` | API klíč s přístupem k cílovým tabulkám |
| `supabase_schema` | Volitelné výchozí schéma (výchozí je `public`) |

### Poznámky

- [Uzel Supabase](../nodes/supabase-node.md) komunikuje s `/rest/v1/<table>` a podporuje operátorové filtry (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` a související operátory PostgREST) plus vnořené logické skupiny `or` / `and`.
- Pro operace zápisu preferujte klíč určený pro důvěryhodné serverové použití s minimálními potřebnými oprávněními k tabulkám.
- Uzly mohou přepsat schéma pro každý krok, i když přihlašovací údaj definuje výchozí schéma.

### Používáno v

- [Uzel Supabase](../nodes/supabase-node.md)

## ClickHouse

Přihlašovací údaj ClickHouse propojuje Heym s externí databází ClickHouse přes její HTTP rozhraní, takže workflow mohou spouštět SQL, CRUD a operace počítání nad OLAP tabulkami.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `host` | HTTP host bez schématu, například `your-instance.clickhouse.cloud` |
| `port` | Port HTTP rozhraní (`8443` pro HTTPS, `8123` pro HTTP) |
| `username` | Uživatel ClickHouse (výchozí je `default`) |
| `password` | Heslo uživatele (volitelné) |
| `database` | Cílová databáze (výchozí je `default`) |
| `secure` | Použít HTTPS, pokud je `true` (vyžadováno pro ClickHouse Cloud) |

### Poznámky

- [Uzel ClickHouse](../nodes/clickhouse-node.md) používá oficiální HTTP klient `clickhouse-connect` a parametrizuje vazby filtrů a hodnot.
- `update` a `remove` se mapují na `ALTER TABLE ... UPDATE` a `DELETE FROM`, což jsou asynchronní mutace ClickHouse; obě vyžadují filtr.
- `upsert` provádí `INSERT` a předpokládá tabulku `ReplacingMergeTree` pro chování merge-on-key.
- Pomocí **Test connection** v dialogu přihlašovacích údajů ověřte dostupnost.

### Používáno v

- [Uzel ClickHouse](../nodes/clickhouse-node.md)

## Notion

Přihlašovací údaj Notion podporuje buď interní integrační token, nebo OAuth připojení veřejné integrace. OAuth umožňuje každému uživateli autorizovat pracovní prostor Notion z Heym namísto ručního kopírování tokenu.

### Povinná pole

| Režim | Pole | Popis |
|------|-------|-------------|
| Interní token | `api_token` | Interní integrační token (`ntn_...`) |
| OAuth | `client_id` | Client ID z veřejné integrace Notion |
| OAuth | `client_secret` | Client Secret z veřejné integrace Notion |

Callback OAuth automaticky ukládá `access_token`, `auth_mode`, `workspace_id`, `workspace_name` a `bot_id`. Jakýkoli předchozí interní `api_token` je při dokončení OAuth odstraněn. Zaregistrujte tuto redirect URI v Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Postup nastavení OAuth

1. V dialogu přihlašovacích údajů zvolte **OAuth**, zadejte název, Client ID a Client Secret.
2. Klikněte na **Connect** a autorizujte pracovní prostor v popupu Notion.
   - Pro **nový** přihlašovací údaj Heym vytvoří záznam přihlašovacích údajů, když kliknete na **Connect**.
   - Dokončete autorizaci v popupu a poté klikněte na **Save** pro návrat do seznamu přihlašovacích údajů.
3. Připojený přihlašovací údaj zobrazuje v seznamu `connected (Workspace Name)`. Nevyřízené OAuth přihlašovací údaje zobrazují `Not connected`, dokud autorizace neskončí.

Pomocí **Test Connection** v dialogu přihlašovacích údajů ověřte buď interní token, nebo dokončenou autorizaci OAuth. Při úpravách ponechání pole tokenu prázdné zachová uložený interní token.

Interní tokeny i přístupové tokeny OAuth jsou dostupné prostřednictvím `$credentials.CredentialName` pro vlastní volání [HTTP](../nodes/http-node.md), která vyžadují bearer token Notion.
### Poznámky

- Interní integrace vyžadují sdílení příslušných stránek, databází a zdrojů dat.
- Uživatelé OAuth volí pracovní prostor/stránky během autorizace Notion.
- Přihlašovací údaje aplikace OAuth jsou šifrovány uvnitř přihlašovacích údajů Notion. Callback je znovu načte
  na straně serveru; tajný klíč není vložen do stavu OAuth.
- Připojené přihlašovací údaje OAuth zobrazují název pracovního prostoru; čekající přihlašovací údaje OAuth zobrazují
  `Not connected`, dokud autorizace neskončí.
- **Produkce:** Nastavte backendovou proměnnou **`FRONTEND_URL`** na veřejnou URL prohlížeče (schéma + hostitel, bez
  koncového lomítka). URI pro přesměrování Notion musí odpovídat přesně:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Uzel používá verzi API `2026-03-11` a aktuální terminologii `data_source`. Pokyny pro migraci ze
  starších příkladů s `archived`, `after` nebo databázovým dotazem naleznete v článku
  [Uzel Notion](../nodes/notion-node.md#api-version-notes).
- Staré filtry vyhledávání s hodnotou objektu `database` jsou normalizovány na `data_source`.

### Používáno v

- [Uzel Notion](../nodes/notion-node.md)

---

## SMTP (e-mail)

Přihlašovací údaje SMTP ukládají podrobnosti připojení k e-mailovému serveru pro odesílání odchozí pošty.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `host` | Název hostitele serveru SMTP (např. `smtp.gmail.com`) |
| `port` | Port SMTP (obvykle `587` pro STARTTLS, `465` pro SSL) |
| `email` | Uživatelské jméno, kterým se server SMTP přihlašuje; zároveň viditelný odesílatel, pokud je pole `from` prázdné |
| `password` | Heslo SMTP nebo App Password |

### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `from` (`smtp_from`) | Viditelná adresa odesílatele (From). Ponechte prázdné pro odesílání jako `email`. Server se nadále přihlašuje jako `email`, takže tento účet musí mít oprávnění odesílat z této adresy (v Gmailu ověřený alias **Odesílat poštu jako**). |

### Běžní poskytovatelé SMTP

| Poskytovatel | Hostitel | Port | Poznámky |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Vyžaduje [App Password](https://support.google.com/accounts/answer/185833) (musí být zapnuto 2FA) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Použijte přihlašovací údaje svého účtu Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Použijte přihlašovací údaje SMTP Mailgun z nastavení své domény |
| SendGrid | `smtp.sendgrid.net` | `587` | Použijte `apikey` jako uživatelské jméno a API klíč jako heslo |
| Vlastní / Self-hosted | vaše doména | `587` / `465` | Postfix, Exim atd. |

### Poznámky

- Gmail vyžaduje **App Password** namísto běžného hesla, pokud je zapnuto dvoufázové ověření.
- Port `587` používá STARTTLS (začíná v nešifrované podobě, přechází na TLS). Port `465` používá implicitní TLS (SSL od začátku).

### Používáno v

- [Uzel Send Email](../nodes/send-email-node.md)

---

## IMAP (příchozí e-mail)

Přihlašovací údaje IMAP ukládají podrobnosti připojení pro sledování schránky pomocí [uzlu IMAP Trigger](../nodes/imap-trigger-node.md).

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `imap_host` | Název hostitele serveru IMAP (například `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` pro SSL/TLS u většiny poskytovatelů) |
| `imap_username` | Uživatelské jméno schránky nebo úplná e-mailová adresa |
| `imap_password` | Heslo nebo specifické heslo aplikace daného poskytovatele |

### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `imap_mailbox` | Složka schránky ke sledování (výchozí: `INBOX`) |
| `imap_use_ssl` | Zapnout SSL/TLS (doporučeno; výchozí: `true`) |

### Poznámky

- Trigger IMAP při prvním dotazu zaznamená aktuální stav schránky a poté zpracovává pouze novější e-maily.
- Gmail, Microsoft 365 a další hostovaní poskytovatelé často vyžadují **heslo aplikace** nebo podobný tajný klíč specifický pro IMAP.
- Obsah příloh se nestahuje do payloadu workflow; Heym zpřístupňuje pouze metadata příloh.

### Používáno v

- [Uzel IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggery](./triggers.md) (IMAP jako trigger workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) je open-source message broker. Přihlašovací údaje RabbitMQ ukládají podrobnosti připojení pro publikování do front a exchangeů a jejich konzumaci.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `rabbitmq_host` | URL připojení AMQP (např. `amqp://localhost:5672`) |
| `rabbitmq_username` | Uživatelské jméno RabbitMQ (výchozí: `guest`) |
| `rabbitmq_password` | Heslo RabbitMQ (výchozí: `guest`) |

### Virtuální hostitelé

Pro připojení ke konkrétnímu virtuálnímu hostiteli jej zahrňte do URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Pokud používáte výchozí vhost, lze cestu `/` vynechat.

### Plugin pro zpožděné zprávy

[Uzel RabbitMQ](../nodes/rabbitmq-node.md) podporuje plugin **rabbitmq_delayed_message_exchange**. Pokud je tento plugin na vašem serveru RabbitMQ zapnutý, můžete nastavit zpoždění (v milisekundách) u odchozích zpráv pomocí pole `rabbitmqDelayMs` na uzlu.

Uzel nastaví hlavičku `x-delay` na publikované zprávě. Aby zpoždění nabylo účinku, musí být typ exchange `x-delayed-message`.

Pro zapnutí pluginu na self-hosted instanci RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Pokud plugin není nainstalován, je hlavička `x-delay` ignorována a zprávy jsou doručeny okamžitě.

### Používáno v

- [Uzel RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggery](./triggers.md) (RabbitMQ jako trigger workflow)

---

## Amazon S3

Přihlašovací údaje Amazon S3 připojují Heym k [Amazon S3](https://aws.amazon.com/s3/). Použijte je s [uzlem Amazon S3](../nodes/amazon-s3-node.md) ke správě bucketů a složek, nahrávání a stahování objektů, kopírování klíčů a výpisu nebo mazání objektů z workflow.
### Povinná pole

| Pole | Popis |
|-------|-------------|
| `aws_access_key_id` | ID přístupového klíče AWS IAM |
| `aws_secret_access_key` | Tajný přístupový klíč spárovaný s ID přístupového klíče |
| `aws_region` | Region AWS, ve kterém se nacházejí buckety (např. `us-east-1`) |

### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `aws_session_token` | Dočasný session token při použití přihlašovacích údajů AWS STS |

### Poznámky

- Přihlašovací údaj používá standardní autentizaci AWS SigV4 prostřednictvím boto3.
- Operace nahrávání aktuálně odesílají textový obsah ve formátu UTF-8; stahování může vracet text nebo base64 pro binární objekty.

### Používáno v

- [Uzel Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) je in-memory key-value úložiště používané pro cachování a rychlý přístup k datům.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `host` | Hostname nebo IP adresa serveru Redis (např. `localhost`) |
| `port` | Port Redis (výchozí: `6379`) |
| `password` | Heslo Redis (ponechte prázdné, pokud není nastaveno) |

### Používáno v

- [Uzel Redis](../nodes/redis-node.md)

---

## Slack

Přihlašovací údaj Slack ukládá **Incoming Webhook URL** pro odesílání zpráv do kanálů Slack.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `webhook_url` | URL Incoming Webhook služby Slack (z konfigurace Vaší aplikace Slack) |

### Poznámky

- Vytvořte Incoming Webhook na [api.slack.com/apps](https://api.slack.com/apps) → Vaše aplikace → **Incoming Webhooks**.
- Každý webhook je vázán na konkrétní kanál. Pro různé kanály vytvořte více přihlašovacích údajů.

### Používáno v

- [Uzel Slack](../nodes/slack-node.md)

---

## Telegram

Přihlašovací údaj Telegram ukládá **Bot Token** a volitelný **Webhook Secret Token** pro workflow založené na botovi.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `bot_token` | Token Telegram Bot API z BotFather |

### Volitelná pole

| Pole | Popis |
|-------|-------------|
| `secret_token` | Sdílené tajemství ověřované proti `x-telegram-bot-api-secret-token` u příchozích webhooků |

### Poznámky

- Použijte stejný přihlašovací údaj pro [Telegram Trigger](../nodes/telegram-trigger-node.md) i [Telegram](../nodes/telegram-node.md).
- Zaregistrujte webhook ručně pomocí API `setWebhook` služby Telegram s URL zobrazenou v panelu uzlu Telegram Trigger.
- `chatId` v uzlu Telegram může být doslovné ID nebo výraz jako `$telegramEvent.message.chat.id`.

### Používáno v

- [Uzel Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Uzel Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Tyto přihlašovací údaje používá [uzel HTTP](../nodes/http-node.md) k autentizaci odchozích požadavků.

### Bearer

Připojuje k požadavkům HTTP hlavičku `Authorization: Bearer <token>`.

| Pole | Popis |
|-------|-------------|
| `token` | Hodnota bearer tokenu |

### Header

Připojuje k požadavkům HTTP vlastní hlavičku.

| Pole | Popis |
|-------|-------------|
| `header_key` | Název hlavičky (např. `X-Api-Key`) |
| `header_value` | Hodnota hlavičky |

Oba typy lze také odkazovat prostřednictvím `$credentials.CredentialName` v [Expression DSL](./expression-dsl.md) pro dynamické použití v jakémkoli uzlu, který přijímá výrazy.

### Používáno v

- [Uzel HTTP](../nodes/http-node.md)

---

## Poskytovatelé LLM (OpenAI, Google, Custom, Cohere)

Tyto přihlašovací údaje pohánějí AI uzly.

| Typ | Popis |
|------|-------------|
| **OpenAI** | API klíč pro modely GPT a embeddingy OpenAI |
| **Google** | API klíč pro modely Gemini |
| **Custom** | API klíč + base URL pro endpointy kompatibilní s OpenAI (Ollama, vLLM, LM Studio atd.) |
| **Cohere** | API klíč pro embeddingy Cohere |

### Prompt Caching OpenAI

OpenAI automaticky cachuje statický (neměnný) prefix Vašeho systémového promptu — není vyžadována žádná další konfigurace. Opakovaná spuštění workflow, která sdílejí stejný prefix systémového promptu, těží z cen za cachované tokeny, což snižuje jak náklady, tak latenci. To je obzvláště užitečné, když máte dlouhé, pevné instrukce a mezi spuštěními se mění pouze zpráva uživatele. Sledujte míru zásahů do cache a úspory tokenů v [kartě Spuštění](../tabs/traces-tab.md) nebo v dashboardu využití OpenAI a optimalizujte strukturu promptu pro maximální opětovné využití cache.

### Používáno v

- [Uzel LLM](../nodes/llm-node.md)
- [Uzel Agent](../nodes/agent-node.md)
- [Uzel RAG](../nodes/rag-node.md) (embeddingy OpenAI prostřednictvím přihlašovacích údajů Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) je proxy server pro obcházení výzev Cloudflare a podobných ochran proti botům.

### Povinná pole

| Pole | Popis |
|-------|-------------|
| `flaresolverr_url` | URL Vaší instance FlareSolverr (např. `http://localhost:8191`) |

Zde jsou podporovány loopback a privátní adresy, takže provoz FlareSolverr vedle Heym funguje dle dokumentace. URL nesmí být přeložitelná na link-local nebo cloud-metadata adresu. Protože jsou privátní adresy povoleny, může toto pole také směřovat na jinou interní službu a odpověď se vrátí ve výstupu uzlu. Tento přihlašovací údaj může vytvořit jakýkoli přihlášený uživatel, takže hranicí je to, kdo smí vytvářet workflow, plus Vaše síťová pravidla, nikoli sdílení přihlašovacích údajů. Viz [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Používáno v

- [Uzel Crawler](../nodes/crawler-node.md)

---
## Související

- [Přihlašovací údaje](./credentials.md) – Přehled přihlašovacích údajů a způsobu jejich použití v uzlech
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů
- [Sdílení přihlašovacích údajů](./credentials-sharing.md) – Sdílení přihlašovacích údajů s uživateli a týmy
- [Zabezpečení](./security.md) – Šifrování v klidovém stavu, řízení přístupu
- [Expression DSL](./expression-dsl.md) – Syntaxe `$credentials` pro dynamický přístup

---

## Model Router (Auto Model)

Směruje každý požadavek na jeden z Vašich stávajících přihlašovacích údajů k modelu a k rozhodnutí využívá decision model. Ukládá pouze reference, nikdy nevlastní žádný klíč.

### Povinná pole

- `decision_credential_id` – přihlašovací údaj typu **Decision Model**, ke kterému máte přístup.
- `decision_model` – model, který provádí směrovací volání, například `jev-latest`.
- `options` – alespoň dvě položky, každá s názvem, jedním z Vašich přihlašovacích údajů OpenAI/Google/Custom, modelem na něm a kritérii určujícími, kdy má zvítězit.

### Volitelná pole

- `routing_instructions` – jak celkově vážit jednotlivé možnosti.
- Jedna možnost může být označena jako fallback použitý v případě selhání směrování.

### Poznámky

Názvy možností jsou to, mezi čím decision model volí, proto musí být jedinečné. Možnost nemůže odkazovat na jiný Model Router.
