# Integrazioni di Terze Parti

Heym si connette ai servizi esterni tramite **credenziali**. Ogni tipo di credenziale memorizza i dettagli di connessione per un servizio e può essere riutilizzata su più nodi e workflow. Per una panoramica, consultare [Credenziali](./credentials.md).

Aggiungere le credenziali in [Impostazioni → Credenziali](../tabs/credentials-tab.md). Tutti i valori sono cifrati a riposo. Le credenziali possono essere [condivise](./credentials-sharing.md) con altri utenti o [Team](./teams.md).

Alcuni nodi di integrazione **non** richiedono credenziali. [WebSocket Trigger](../nodes/websocket-trigger-node.md) e [WebSocket Send](../nodes/websocket-send-node.md) si connettono a socket esterni utilizzando l'URL, gli header e i subprotocolli configurati direttamente sul nodo.

## Tipi di Credenziali in Sintesi

| Tipo | Utilizzato Da | Campi Principali |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, `base_url` opzionale |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, `base_url` opzionale |
| **Jira** | [Nodo Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, `api_version` opzionale |
| **Linear** | [Nodo Linear](../nodes/linear-node.md) | `api_key`, oppure `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Nodo Sentry](../nodes/sentry-node.md) | `api_token`, `base_url` opzionale |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Valutazioni](../tabs/evals-tab.md) (giudice LLM-as-Judge) | `base_url`, `api_key` opzionale |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | una credenziale di decision model, più le opzioni dei modelli che fanno riferimento alle altre credenziali |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vettori memorizzati nel Postgres di Heym tramite pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, `embedding_api_key` opzionale, più `qdrant_host` quando `db_type` è `qdrant` |
| **Grist** | [Nodo Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Nodo Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consenso OAuth2 |
| **Google Drive** | [Nodo Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consenso OAuth2 (scope completo Drive) |
| **BigQuery** | [Nodo BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consenso OAuth2 |
| **Supabase** | [Nodo Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, `supabase_schema` opzionale |
| **ClickHouse** | [Nodo ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Nodo Notion](../nodes/notion-node.md) | `api_token`, oppure `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Nodo Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Nodo IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Nodo Telegram Trigger](../nodes/telegram-trigger-node.md), [Nodo Telegram](../nodes/telegram-node.md) | `bot_token`, `secret_token` opzionale |
| **Discord** | [Nodo Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Nodo Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Nodo RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Nodo Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Nodo Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Nodo Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Nodo HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Nodo HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Nodo Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---
## GitHub

La credenziale GitHub memorizza un token di accesso personale (PAT) di GitHub, consentendo ai workflow di chiamare la GitHub REST API tramite il [nodo GitHub](../nodes/github-node.md), di passare il token a server MCP quali `@modelcontextprotocol/server-github`, oppure di utilizzarlo dal [nodo HTTP](../nodes/http-node.md) per chiamate REST personalizzate.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `api_key` | Token di accesso personale GitHub (PAT fine-grained `github_pat_...` oppure PAT classico `ghp_...`) |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `base_url` | URL di base della GitHub API per GitHub Enterprise Server (ad esempio `https://github.example.com/api/v3`) |

### Note

- Si raccomanda, ove possibile, l'uso di token di accesso personale fine-grained, poiché consentono di limitarne l'ambito a repository e autorizzazioni specifici.
- Lasciare `base_url` vuoto per GitHub.com. Per GitHub Enterprise Server, utilizzare l'endpoint REST API completo
  includendo `/api/v3` (ad esempio `https://github.example.com/api/v3`), non la
  radice dell'interfaccia web del server, quale `https://github.example.com`.
- Questa credenziale attualmente modella esclusivamente l'autenticazione basata su PAT. Per accedere ai repository dell'organizzazione, utilizzare un PAT a cui siano state concesse le autorizzazioni richieste a livello di organizzazione/repository.
- I token di installazione delle GitHub App e i flussi di configurazione delle GitHub App non sono attualmente supportati nativamente nell'interfaccia di Heym.
- Preferire il [nodo GitHub](../nodes/github-node.md) per le operazioni native su repository, utente, issue, pull request, review, release, workflow di Actions, traffico e file. Utilizzare il [nodo HTTP](../nodes/http-node.md) solo quando occorrono endpoint o payload non coperti dal nodo GitHub.
- Utilizzare il [nodo Agent](../nodes/agent-node.md) con MCP passando `$credentials.YourGitHubCredential` in una variabile d'ambiente di connessione MCP quale `GITHUB_PERSONAL_ACCESS_TOKEN`.
- La REST API di GitHub in genere richiede `Authorization: Bearer <token>` insieme a `Accept: application/vnd.github+json`.
- In fase di modifica di una credenziale GitHub, lasciare vuoto il campo `base_url` di GitHub Enterprise preserva
  l'endpoint esistente. Inserire un nuovo URL solo quando si desidera modificare tale endpoint.

### Utilizzata da

- [nodo GitHub](../nodes/github-node.md)
- [nodo Codex](../nodes/codex-node.md)
- [nodo Agent](../nodes/agent-node.md)
- [nodo HTTP](../nodes/http-node.md)

---

## Decision Model

Un decision model risponde a domande tipizzate su uno stato e restituisce probabilità anziché testo. Il Jev di TypeSafe è l'implementazione di riferimento; qualsiasi endpoint che accetti lo stesso corpo `{model, state, questions}` è idoneo, e il nodo [Decision](../nodes/decision-node.md) può inviare un corpo scritto manualmente per un endpoint che non lo accetti.

### Campi obbligatori

- `base_url` – l'endpoint, ad esempio `https://api.typesafe.ai`. Heym aggiunge `/v1/systemone`.

### Campi opzionali

- `api_key` – inviata come `Authorization: Bearer`. Gli endpoint che non richiedono una chiave possono lasciare questo campo vuoto.

### Note

- **Test Connection** invia una domanda minima per confermare che l'endpoint e la chiave funzionino.
- La modifica di una credenziale conserva la chiave memorizzata quando il campo della chiave viene lasciato vuoto.
- Le richieste in uscita verso indirizzi privati e di loopback sono bloccate per impostazione predefinita, pertanto un endpoint self-hosted su `localhost` o su un intervallo privato richiede `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Questi modelli sono assenti dalle tabelle di prezzo degli LLM sincronizzate da Heym, pertanto la colonna Costo in [Esecuzioni](../tabs/traces-tab.md) rimane vuota. I conteggi dei token vengono comunque registrati.

### Utilizzata da

- [Decision](../nodes/decision-node.md)
- [Valutazioni](../tabs/evals-tab.md) – valuta le risposte `LLM-as-Judge` rispetto all'output atteso

## OpenAI Codex

La credenziale OpenAI Codex autentica il [nodo Codex](../nodes/codex-node.md). È distinta dalla credenziale della chiave API OpenAI utilizzata dai nodi LLM, Agent e RAG.

### Modalità di autenticazione

| Modalità | Descrizione |
|------|-------------|
| **Sign in with ChatGPT** (consigliata) | Accesso OAuth (PKCE) che utilizza l'abbonamento ChatGPT Plus/Pro, evitando così i costi API per token a ogni esecuzione. Heym memorizza e aggiorna automaticamente il bundle del token. |
| **Access token** | Un `access_token` ChatGPT/Codex passato esclusivamente al processo locale della Codex CLI. |

### Note

- Le chiavi API vengono rifiutate per questo tipo di credenziale.
- I token Codex non sono esposti tramite `$credentials.Name`.
- Il nodo Codex richiede inoltre una credenziale GitHub per la clonazione del repository, il push del branch e la creazione della pull request in bozza.

### Utilizzata da

- [nodo Codex](../nodes/codex-node.md)

## OpenCode Go

La credenziale OpenCode Go autentica il [nodo OpenCode Go](../nodes/opencode-go-node.md). Memorizza una chiave API del gateway OpenCode Go (da [opencode.ai/go](https://opencode.ai/go)) e un URL di base del gateway opzionale.

### Campi

| Campo | Descrizione |
|-------|-------------|
| **API Key** | Chiave API del gateway OpenCode Go (obbligatoria). |
| **Gateway Base URL** | Opzionale; il valore predefinito è `https://opencode.ai/zen/go/v1`. Sovrascrivere solo per un gateway self-hosted o con proxy. |
### Note

- La chiave API viene passata esclusivamente al processo OpenCode CLI all'interno di un container hardened.
- Il nodo OpenCode Go necessita inoltre di una credenziale GitHub per la clonazione del repository, il push del branch e la creazione della pull request. Il token GitHub non viene mai inserito all'interno del container sandbox.

### Utilizzato da

- [Nodo OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

La credenziale Linear supporta sia una chiave API personale sia OAuth2 per il
[nodo Linear](../nodes/linear-node.md). Heym invia query GraphQL native a Linear per i metadati del workspace,
i progetti, le issue e i commenti.

### Configurazione

Scegliere una modalità di autenticazione:

**Chiave API personale**

1. In Linear, aprire **Settings → Security & Access → Personal API keys**.
2. Creare una chiave con accesso al workspace che si desidera automatizzare.
3. Incollare la chiave in una credenziale Linear in Heym e utilizzare **Test Connection** per verificarla.

**OAuth2**

1. Creare un'applicazione OAuth Linear.
2. Registrare `{FRONTEND_URL}/api/credentials/linear/oauth/callback` come redirect URI.
3. In Heym Dashboard → **Credentials** → **New** → digitare **Linear**.
4. Scegliere **OAuth2**, inserire il Client ID e il Client Secret, quindi fare clic su **Connect**.

### Campi obbligatori

| Modalità | Campo | Descrizione |
|------|-------|-------------|
| Chiave API personale | `api_key` | Chiave API personale Linear, comunemente con prefisso `lin_api_` |
| OAuth2 | `client_id` | Client ID dell'applicazione OAuth Linear |
| OAuth2 | `client_secret` | Client Secret dell'applicazione OAuth Linear |

I token OAuth (`access_token`, `refresh_token`, `token_expiry`) vengono memorizzati e aggiornati automaticamente.

### Note

- Le chiavi API personali e i token OAuth agiscono come l'utente Linear che li ha creati o autorizzati.
- Linear OAuth utilizza gli scope `read,write,issues:create,comments:create`.
- Utilizzare **Test Connection** nella finestra della credenziale per verificare la chiave API o il token OAuth rispetto all'API Linear.
- Utilizzare List Teams e List Projects nel nodo Linear per individuare gli UUID prima di creare o filtrare le issue.
- Utilizzare List Workflow States e List Team Members per individuare gli UUID di stato e assegnatario per gli aggiornamenti.
- Per ruotare una chiave API, modificare la credenziale e inserire il valore sostitutivo. Se si ruotano i secret dell'applicazione OAuth, riconnettere la credenziale tramite **Connect**.

### Utilizzato da

- [Nodo Linear](../nodes/linear-node.md)

---

## Jira

La credenziale Jira memorizza le credenziali Jira Basic auth, l'URL di base del sito Jira, la modalità di deployment e la versione opzionale dell'API REST per il [nodo Jira](../nodes/jira-node.md). Utilizzare `cloud` per Jira Cloud o `data_center` per Jira Data Center / Server.

### Configurazione

**Jira Cloud**

1. Nelle impostazioni dell'account Atlassian, creare un API token.
2. In Heym Dashboard → **Credentials** → **New** → digitare **Jira**.
3. Inserire l'email Atlassian, l'API token e l'URL del sito Jira, ad esempio `https://your-domain.atlassian.net`.
4. Utilizzare **Test Connection** per verificare la credenziale.

**Jira Data Center / Server**

1. Selezionare **Jira Data Center / Server** come deployment.
2. Inserire il nome utente e la password Jira utilizzati per la Basic auth.
3. Inserire l'URL del sito Jira, ad esempio `https://jira.example.com`.
4. Utilizzare **Test Connection** per verificare la credenziale.

### Campi

| Campo | Descrizione |
| --- | --- |
| `email` | Email dell'account Atlassian Jira Cloud, oppure nome utente Jira Data Center / Server |
| `api_token` | API token Atlassian Jira Cloud, oppure password Jira Data Center / Server per la Basic auth |
| `base_url` | URL di base del sito Jira |
| `deployment` | `cloud` per Jira Cloud o `data_center` per Jira Data Center / Server |
| `api_version` | Versione dell'API REST; il valore predefinito è `3` per Jira Cloud. Data Center / Server utilizza la v2 |

### Note

- Il nodo Jira invia le descrizioni delle issue e i commenti come documenti di testo in Atlassian Document Format
  per Jira Cloud REST API v3. Le credenziali Data Center / Server inviano testo semplice.
- Data Center / Server attualmente supporta solo la Basic auth con nome utente/password. I personal access
  token e la Bearer auth non sono ancora supportati.
- Il caricamento degli allegati accetta contenuti base64 o data URL ed è soggetto al limite di dimensione dei file della piattaforma (predefinito 99 MB). Il download degli allegati può restituire contenuti base64 quando abilitato.
- La creazione e l'eliminazione degli utenti e le notifiche delle issue richiedono che l'account Jira autenticato disponga delle autorizzazioni pertinenti sul sito o sull'organizzazione Jira.
- Utilizzare List Projects, Search Issues e List Transitions per individuare le chiavi dei progetti, le chiavi delle issue e gli ID delle transizioni.
- Per endpoint personalizzati non coperti dal nodo Jira, utilizzare il [nodo HTTP](../nodes/http-node.md) con Jira Basic Auth (`email:api_token` per Cloud o `username:password` per Data Center / Server) nel comando cURL, oppure una credenziale Header con il valore corrispondente `Authorization: Basic <base64(user:secret)>`.

Vedere anche:

- [Nodo Jira](../nodes/jira-node.md)
- [Credenziali](./credentials.md)

---

## Sentry

La credenziale Sentry memorizza un auth token per il [nodo Sentry](../nodes/sentry-node.md). Heym utilizza l'API REST di Sentry per le operazioni su organizzazioni, progetti, team, issue, eventi e release.
### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `api_token` | Token di autenticazione Sentry con accesso alle organizzazioni e ai progetti che si desidera automatizzare |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `base_url` | URL radice opzionale per istanze Sentry self-hosted, ad esempio `https://sentry.example.com` |

### Note

- Lasciare `base_url` vuoto per Sentry SaaS.
- Utilizzare **Test Connection** per verificare che il token possa elencare le organizzazioni visibili.
- Per chiamate REST personalizzate, utilizzare `$credentials.YourSentryCredential` come bearer token.

### Utilizzato da

- [Nodo Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) è un database vettoriale open source utilizzato per la ricerca semantica e la RAG (Retrieval Augmented Generation).

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `qdrant_host` | URL completo dell'istanza Qdrant (ad es. `http://localhost:6333` o un endpoint cloud) |
| `openai_api_key` | Chiave API OpenAI utilizzata per generare gli embedding durante l'indicizzazione e la ricerca dei documenti |

### Note

- Le collezioni Qdrant sono gestite dalla scheda [Archivi vettoriali](../tabs/vectorstores-tab.md). Ogni archivio vettoriale corrisponde a una collezione Qdrant.
- Il [Nodo RAG](../nodes/rag-node.md) utilizza un archivio vettoriale (che fa riferimento a una credenziale Qdrant) — non referenzia direttamente la credenziale.
- Se l'istanza Qdrant richiede una chiave API, includerla nel valore di `qdrant_host` o configurare Qdrant di conseguenza; l'integrazione attuale non dispone di un campo separato per la chiave API Qdrant.
- Qdrant self-hosted: utilizzare l'[immagine Docker ufficiale](https://hub.docker.com/r/qdrant/qdrant) ed esporre la porta `6333`.

### Utilizzato da

- [Nodo RAG](../nodes/rag-node.md) (tramite archivio vettoriale)
- [Scheda Archivi vettoriali](../tabs/vectorstores-tab.md)

## Embedding personalizzati (RAG)

Per impostazione predefinita gli embedding RAG provengono da OpenAI. Una credenziale **RAG: Custom Embeddings** punta invece a qualsiasi endpoint di embedding compatibile con OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together o un gateway ospitato — e specifica l'archivio vettoriale in cui scrive.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `embedding_base_url` | URL dell'endpoint completo del percorso `/v1`, ad es. `http://localhost:11434/v1` |
| `embedding_api_key` | Opzionale. I server locali in genere non richiedono una chiave |
| `embedding_model` | Nome del modello come previsto dall'endpoint, ad es. `nomic-embed-text` |
| `embedding_dimensions` | Ampiezza del vettore restituita dal modello (predefinita `1536`) |
| `embedding_request_dimensions` | Opzionale. Richiede all'endpoint di restituire `embedding_dimensions` invece dell'ampiezza nativa del modello |
| `db_type` | `qdrant` o `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Connessione Qdrant, obbligatoria quando `db_type` è `qdrant` |

### Note

- **Qdrant accetta qualsiasi numero di dimensioni.** Ogni collezione viene creata con l'ampiezza dichiarata da questa credenziale, pertanto il campo Dimensions è liberamente modificabile.
- **Postgres (pgvector) richiede esattamente 1536 dimensioni.** La sua colonna è un `vector(1536)` fisso, quindi il campo Dimensions è bloccato a 1536 e una credenziale che dichiara qualsiasi altra ampiezza viene rifiutata al momento del salvataggio.
- **Riduzione per pgvector.** Quando l'archivio è Postgres, la finestra di dialogo offre *Ask the endpoint to return 1536 dimensions*. Questa opzione invia il parametro di richiesta `dimensions`, che i modelli addestrati con rappresentazioni Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` e simili) rispettano restituendo un vettore ridotto ma ancora significativo. Gli endpoint che non supportano il parametro rifiutano la richiesta, mentre gli endpoint che lo accettano ma lo ignorano producono un errore chiaro che indica l'ampiezza effettivamente restituita. Heym non tronca mai i vettori autonomamente, poiché il taglio dell'output di un modello non Matryoshka degrada silenziosamente la qualità del retrieval. L'opzione non è offerta per Qdrant, che può dimensionare una collezione a qualsiasi ampiezza.
- Utilizzare **Test Connection** nella finestra di dialogo della credenziale per generare l'embedding di una stringa di prova e visualizzare l'ampiezza effettivamente restituita dal modello prima di creare un archivio.
- Il parametro di richiesta `dimensions` viene inviato solo a OpenAI stesso, poiché la maggior parte dei server compatibili con OpenAI rifiuta i parametri sconosciuti. L'ampiezza nativa del modello viene invece validata rispetto alla credenziale.
- Le credenziali esistenti **RAG: Qdrant + OpenAI** e **RAG: Psql + OpenAI** rimangono invariate e continuano a funzionare.

### Utilizzato da

- [Nodo RAG](../nodes/rag-node.md) (tramite archivio vettoriale)
- [Scheda Archivi vettoriali](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym può anche archiviare i vettori **all'interno del proprio database Postgres** utilizzando l'estensione [pgvector](https://github.com/pgvector/pgvector) — senza necessità di un servizio vettoriale esterno. Creare una credenziale **RAG: Psql + OpenAI** e utilizzarla durante la creazione di un archivio vettoriale, quindi selezionare **Postgres (pgvector)** nel menu a discesa Database del Nodo RAG.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `openai_api_key` | Chiave API OpenAI utilizzata per generare gli embedding durante l'indicizzazione e la ricerca dei documenti |
### Note

- Non è necessario specificare host/porta — i vettori vengono scritti nel database di Heym stesso; Heym non si connette mai a un database diverso.
- Ogni funzionalità RAG disponibile con Qdrant (inserimento, ricerca, filtri sui metadati, reranking Cohere, clonazione, condivisione) funziona in modo identico con il backend Postgres.
- Richiede l'estensione `vector`. Heym mantiene invariata l'immagine ufficiale `postgres:16` (così i dati esistenti non vengono mai toccati) e **installa automaticamente il pacchetto `postgresql-16-pgvector` all'avvio** — `run.sh`, `deploy.sh` e `run_e2e.sh` gestiscono tutti questa operazione. L'installazione non è bloccante: se non può essere eseguita (ad esempio in assenza di rete), il RAG Qdrant continua a funzionare e il backend Postgres rimane inattivo (la migrazione salta la tabella in modo controllato).
- Se si esegue l'immagine single-container pubblicata (`ghcr.io/heymrun/heym`) contro **un Postgres esterno di proprietà dell'utente**, quel database deve supportare l'estensione `vector` (Heym non può installarla in un database che non gestisce). In assenza di tale estensione, la creazione o il caricamento verso un archivio vettoriale Postgres restituisce un messaggio chiaro e il RAG Qdrant continua a funzionare.

### Utilizzato da

- [Nodo RAG](../nodes/rag-node.md) (tramite archivio vettoriale)
- [Scheda Archivi vettoriali](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) è un ibrido tra foglio di calcolo e database che supporta dati strutturati e formule. La credenziale Grist consente a Heym di leggere e scrivere documenti Grist.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `api_key` | Chiave API di Grist (disponibile in **Profile → API Key** sulla propria istanza Grist) |
| `server_url` | URL di base del server Grist (ad esempio `https://docs.getgrist.com` per Grist Cloud, oppure l'URL della propria istanza self-hosted) |

### Note

- Il [Nodo Grist](../nodes/grist-node.md) richiede nella propria configurazione il **Document ID** (ricavato dall'URL del documento Grist) e il **Table ID** — questi non fanno parte della credenziale.
- Per Grist self-hosted, impostare `server_url` sul dominio della propria istanza.
- Gli ID delle colonne in Grist utilizzano il carattere di sottolineatura (ad esempio `User_Name`), non le etichette visualizzate. Utilizzare l'operazione `listColumns` per individuarli.

### Utilizzato da

- [Nodo Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

La credenziale Google Sheets connette Heym all'API di Google Sheets utilizzando un modello OAuth2 "Bring Your Own App". Si forniscono un Client ID e un Client Secret OAuth2 di Google Cloud, quindi si autorizza l'accesso tramite un popup del browser. I Token vengono aggiornati automaticamente in background.

### Configurazione

1. Aprire [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cercare e abilitare **Google Sheets API**.
2. Andare in **Credentials** → **Create Credentials** → **OAuth client ID** → tipo di applicazione **Web application**.
3. Alla voce **Authorized redirect URIs** aggiungere: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copiare il **Client ID** e il **Client Secret** generati.
5. In Heym Dashboard → **Credentials** → **New** → tipo **Google Sheets (OAuth2)**.
6. Inserire il Client ID, il Client Secret e un nome, quindi fare clic su **Connect** per aprire il popup di consenso Google e autorizzare l'accesso.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `client_id` | Client ID OAuth2 da Google Cloud Console |
| `client_secret` | Client Secret OAuth2 da Google Cloud Console |

I Token (`access_token`, `refresh_token`, `token_expiry`) vengono memorizzati e aggiornati automaticamente — non è necessario gestirli direttamente.

### Note

- La schermata di consenso OAuth2 richiede lo scope spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym utilizza il refresh token per ottenere nuovi access token prima della loro scadenza (margine di sicurezza di 60 secondi).
- Se si ruota il Client Secret in Google Cloud Console, riconnettere la credenziale tramite il pulsante **Connect**.
- **Produzione:** impostare la variabile backend **`FRONTEND_URL`** sull'URL pubblico esatto che gli utenti aprono nel browser (schema + host, ad esempio `https://heym.example.com`). Heym costruisce l'URI di reindirizzamento OAuth di Google esclusivamente da questo valore — **non** considera attendibili gli header `Origin` o `X-Forwarded-*` (controllabili dal client). Registrare `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` in Google Cloud Console.

### Utilizzato da

- [Nodo Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

La credenziale Google Drive connette Heym all'API di Google Drive utilizzando lo stesso modello OAuth2 "Bring Your Own App" di Google Sheets. Si forniscono un Client ID e un Client Secret OAuth2 di Google Cloud, quindi si autorizza l'accesso tramite un popup del browser. I Token vengono aggiornati automaticamente in background.
### Configurazione

1. Aprire [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cercare e abilitare **Google Drive API**.
2. Accedere a **Credentials** → **Create Credentials** → **OAuth client ID** → tipo di applicazione **Web application**.
3. In **Authorized redirect URIs** aggiungere: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copiare il **Client ID** e il **Client Secret** generati.
5. In Heym Dashboard → **Credentials** → **New** → tipo **Google Drive (OAuth2)**.
6. Inserire il Client ID, il Client Secret e un nome, quindi fare clic su **Connect** per aprire il popup di consenso Google e autorizzare l'accesso.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `client_id` | OAuth2 Client ID da Google Cloud Console |
| `client_secret` | OAuth2 Client Secret da Google Cloud Console |

I Token (`access_token`, `refresh_token`, `token_expiry`) vengono memorizzati e aggiornati automaticamente — non è necessario gestirli direttamente.

### Scope

Google Drive richiede lo **scope completo di Drive** (`https://www.googleapis.com/auth/drive`).

Ciò è necessario poiché il nodo opera su file già di proprietà dell'utente. Lo scope più restrittivo `drive.file` concede l'accesso esclusivamente ai file creati dal client OAuth stesso, il che renderebbe `listFolderFiles`, `updateFile`, `removeFile` e `removeFolder` incapaci di rilevare alcunché del Drive esistente.

Poiché si forniscono Client ID e Secret personali dal proprio progetto Google Cloud, i requisiti di verifica dell'app Google per questo scope si applicano al progetto dell'utente, non a Heym.

### Note

- Heym utilizza il refresh token per ottenere nuovi access token prima della loro scadenza (buffer di sicurezza di 60 secondi).
- Se si ruota il Client Secret in Google Cloud Console, riconnettere la credenziale tramite il pulsante **Connect**.
- I drive condivisi sono supportati — il nodo imposta `supportsAllDrives` su ogni chiamata API.
- **Produzione:** Impostare **`FRONTEND_URL`** del backend sull'URL pubblico esatto che gli utenti aprono nel browser. Heym costruisce l'URI di reindirizzamento OAuth di Google esclusivamente da questo valore — **non** considera attendibili gli header `Origin` o `X-Forwarded-*`. Registrare `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` in Google Cloud Console.
- Consultare [Credential Sharing](./credentials-sharing.md) prima di condividere questa credenziale con un team.

### Utilizzata da

- [Google Drive node](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

La credenziale BigQuery connette Heym all'API Google BigQuery utilizzando un modello OAuth2 "Bring Your Own App". Si forniscono un Client ID e un Client Secret OAuth2 di Google Cloud, quindi si autorizza l'accesso tramite un popup del browser. I Token vengono aggiornati automaticamente in background.

### Configurazione

1. Aprire [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cercare e abilitare **BigQuery API**.
2. Accedere a **Credentials** → **Create Credentials** → **OAuth client ID** → tipo di applicazione **Web application**.
3. In **Authorized redirect URIs** aggiungere: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copiare il **Client ID** e il **Client Secret** generati.
5. In Heym Dashboard → **Credentials** → **New** → tipo **BigQuery (OAuth2)**.
6. Inserire il Client ID, il Client Secret e un nome, quindi fare clic su **Connect** per aprire il popup di consenso Google e autorizzare l'accesso.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `client_id` | OAuth2 Client ID da Google Cloud Console |
| `client_secret` | OAuth2 Client Secret da Google Cloud Console |

I Token (`access_token`, `refresh_token`, `token_expiry`) vengono memorizzati e aggiornati automaticamente.

### Note

- La schermata di consenso OAuth2 richiede lo scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produzione:** Impostare **`FRONTEND_URL`** del backend sull'URL pubblico. Registrare `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` in Google Cloud Console.

### Utilizzata da

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

La credenziale Supabase connette Heym all'API PostgREST di un progetto Supabase, consentendo ai Workflow di interrogare e modificare tabelle basate su Postgres.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `supabase_url` | URL di base del progetto, ad esempio `https://your-project.supabase.co` |
| `supabase_key` | API key con accesso alle tabelle di destinazione |
| `supabase_schema` | Schema predefinito opzionale (predefinito: `public`) |

### Note

- Il [Supabase node](../nodes/supabase-node.md) comunica con `/rest/v1/<table>` e supporta filtri con operatori (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` e operatori PostgREST correlati) oltre a gruppi logici annidati `or` / `and`.
- Per le operazioni di scrittura, preferire una key destinata all'uso server-side attendibile con i permessi minimi necessari sulle tabelle.
- I nodi possono sovrascrivere lo schema per singolo step anche se la credenziale definisce uno schema predefinito.

### Utilizzata da

- [Supabase node](../nodes/supabase-node.md)
## ClickHouse

La credenziale ClickHouse connette Heym a un database ClickHouse esterno tramite la sua interfaccia HTTP, consentendo ai workflow di eseguire operazioni SQL, CRUD e di conteggio su tabelle OLAP.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `host` | Host HTTP senza schema, ad esempio `your-instance.clickhouse.cloud` |
| `port` | Porta dell'interfaccia HTTP (`8443` per HTTPS, `8123` per HTTP) |
| `username` | Utente ClickHouse (predefinito: `default`) |
| `password` | Password dell'utente (opzionale) |
| `database` | Database di destinazione (predefinito: `default`) |
| `secure` | Utilizza HTTPS quando `true` (obbligatorio per ClickHouse Cloud) |

### Note

- Il [nodo ClickHouse](../nodes/clickhouse-node.md) utilizza il client HTTP ufficiale `clickhouse-connect` e parametrizza i binding di filtri e valori.
- `update` e `remove` corrispondono a `ALTER TABLE ... UPDATE` e `DELETE FROM`, che sono mutazioni asincrone di ClickHouse; entrambe richiedono un filtro.
- `upsert` esegue un `INSERT` e presuppone una tabella `ReplacingMergeTree` per il comportamento di merge-on-key.
- Utilizzare **Test connection** nella finestra della credenziale per verificare la raggiungibilità.

### Utilizzato da

- [Nodo ClickHouse](../nodes/clickhouse-node.md)

## Notion

La credenziale Notion supporta sia un token di integrazione interna sia una connessione OAuth
tramite integrazione pubblica. OAuth consente a ciascun utente di autorizzare un workspace Notion
direttamente da Heym, senza dover copiare manualmente un token.

### Campi obbligatori

| Modalità | Campo | Descrizione |
|------|-------|-------------|
| Token interno | `api_token` | Token di integrazione interna (`ntn_...`) |
| OAuth | `client_id` | Client ID dell'integrazione pubblica Notion |
| OAuth | `client_secret` | Client Secret dell'integrazione pubblica Notion |

Il callback OAuth memorizza automaticamente `access_token`, `auth_mode`, `workspace_id`, `workspace_name` e `bot_id`.
Qualsiasi `api_token` interno precedente viene rimosso al completamento dell'OAuth. Registrare questo
redirect URI in Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Flusso di configurazione OAuth

1. Selezionare **OAuth** nella finestra della credenziale, inserire un nome, il Client ID e il Client Secret.
2. Fare clic su **Connect** e autorizzare il workspace nel popup di Notion.
   - Per una credenziale **nuova**, Heym crea il record della credenziale quando si fa clic su **Connect**.
   - Completare l'autorizzazione nel popup, quindi fare clic su **Save** per tornare all'elenco delle credenziali.
3. Una credenziale connessa mostra `connected (Workspace Name)` nell'elenco. Le credenziali OAuth
   in sospeso mostrano `Not connected` finché l'autorizzazione non è completata.

Utilizzare **Test Connection** nella finestra della credenziale per verificare un token interno o
un'autorizzazione OAuth completata. In fase di modifica, lasciare vuoto il campo del token preserva il token interno memorizzato.

Sia i token interni sia gli access token OAuth sono disponibili tramite
`$credentials.CredentialName` per chiamate [HTTP](../nodes/http-node.md) personalizzate che richiedono un
bearer token Notion.

### Note

- Le integrazioni interne richiedono la condivisione delle pagine, dei database e delle origini dati pertinenti.
- Gli utenti OAuth scelgono il workspace e le pagine durante l'autorizzazione Notion.
- Le credenziali dell'applicazione OAuth sono cifrate all'interno della credenziale Notion. Il callback le
  ricarica lato server; il secret non è incorporato nello stato OAuth.
- Le credenziali OAuth connesse mostrano il nome del workspace; le credenziali OAuth in sospeso mostrano
  `Not connected` finché l'autorizzazione non è completata.
- **Produzione:** Impostare **`FRONTEND_URL`** del backend sull'URL pubblico del browser (schema + host, senza
  slash finale). Il redirect URI di Notion deve corrispondere esattamente:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Il nodo utilizza la versione API `2026-03-11` e la terminologia corrente `data_source`. Consultare
  l'articolo [Nodo Notion](../nodes/notion-node.md#api-version-notes) per indicazioni sulla migrazione da
  esempi precedenti basati su `archived`, `after` o query su database.
- I vecchi filtri di ricerca con valore oggetto `database` vengono normalizzati in `data_source`.

### Utilizzato da

- [Nodo Notion](../nodes/notion-node.md)

---

## SMTP (Email)

La credenziale SMTP memorizza i dettagli di connessione al server di posta per l'invio di email in uscita.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `host` | Nome host del server SMTP (es. `smtp.gmail.com`) |
| `port` | Porta SMTP (tipicamente `587` per STARTTLS, `465` per SSL) |
| `email` | Nome utente con cui accede il server SMTP; è anche il mittente visibile quando `from` è vuoto |
| `password` | Password SMTP o App Password |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `from` (`smtp_from`) | Indirizzo mittente (From) visibile. Lasciare vuoto per inviare come `email`. Il server accede comunque come `email`, quindi tale account deve essere autorizzato a inviare da questo indirizzo (in Gmail, un alias verificato **Invia messaggio come**). |

### Provider SMTP comuni

| Provider | Host | Porta | Note |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Richiede una [App Password](https://support.google.com/accounts/answer/185833) (la 2FA deve essere abilitata) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilizzare le credenziali dell'account Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilizzare le credenziali SMTP Mailgun dalle impostazioni del dominio |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilizzare `apikey` come username e una chiave API come password |
| Personalizzato / Self-hosted | il proprio dominio | `587` / `465` | Postfix, Exim, ecc. |
### Note

- Gmail richiede una **App Password** anziché la password abituale quando è abilitata la Verifica in due passaggi.
- La porta `587` utilizza STARTTLS (inizia in chiaro, poi esegue l'upgrade a TLS). La porta `465` utilizza TLS implicito (SSL fin dall'inizio).

### Utilizzato da

- [Nodo Send Email](../nodes/send-email-node.md)

---

## IMAP (Email in entrata)

La credenziale IMAP memorizza i dettagli di connessione per il monitoraggio di una casella di posta con il [Nodo IMAP Trigger](../nodes/imap-trigger-node.md).

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `imap_host` | Nome host del server IMAP (ad esempio `imap.gmail.com`) |
| `imap_port` | Porta IMAP (`993` per SSL/TLS sulla maggior parte dei provider) |
| `imap_username` | Nome utente della casella di posta o indirizzo email completo |
| `imap_password` | Password o app password specifica del provider |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `imap_mailbox` | Cartella della casella di posta da monitorare (predefinita: `INBOX`) |
| `imap_use_ssl` | Abilita SSL/TLS (consigliato; predefinito: `true`) |

### Note

- Il trigger IMAP acquisisce lo stato corrente della casella di posta al primo polling e successivamente elabora solo le email più recenti.
- Gmail, Microsoft 365 e altri provider ospitati richiedono spesso una **app password** o un segreto specifico per IMAP analogo.
- Il contenuto degli allegati non viene scaricato nel payload del workflow; Heym espone esclusivamente i metadati degli allegati.

### Utilizzato da

- [Nodo IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP come trigger di workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) è un message broker open source. La credenziale RabbitMQ memorizza i dettagli di connessione per pubblicare su e consumare da code e exchange.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `rabbitmq_host` | URL di connessione AMQP (ad es. `amqp://localhost:5672`) |
| `rabbitmq_username` | Nome utente RabbitMQ (predefinito: `guest`) |
| `rabbitmq_password` | Password RabbitMQ (predefinita: `guest`) |

### Virtual Host

Per connettersi a uno specifico virtual host, includerlo nell'URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Se si utilizza il vhost predefinito, il percorso `/` può essere omesso.

### Plugin per messaggi ritardati

Il [Nodo RabbitMQ](../nodes/rabbitmq-node.md) supporta il plugin **rabbitmq_delayed_message_exchange**. Quando questo plugin è abilitato sul server RabbitMQ, è possibile impostare un ritardo (in millisecondi) sui messaggi in uscita utilizzando il campo `rabbitmqDelayMs` sul nodo.

Il nodo imposta l'header `x-delay` sul messaggio pubblicato. Il tipo di exchange deve essere `x-delayed-message` affinché i ritardi abbiano effetto.

Per abilitare il plugin su un'istanza RabbitMQ self-hosted:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Quando il plugin non è installato, l'header `x-delay` viene ignorato e i messaggi vengono recapitati immediatamente.

### Utilizzato da

- [Nodo RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ come trigger di workflow)

---

## Amazon S3

La credenziale Amazon S3 connette Heym ad [Amazon S3](https://aws.amazon.com/s3/). Utilizzarla con il [Nodo Amazon S3](../nodes/amazon-s3-node.md) per gestire bucket e cartelle, caricare e scaricare oggetti, copiare chiavi ed elencare o eliminare oggetti dai workflow.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `aws_access_key_id` | ID della chiave di accesso AWS IAM |
| `aws_secret_access_key` | Chiave di accesso segreta associata all'ID della chiave di accesso |
| `aws_region` | Regione AWS in cui risiedono i bucket (ad es. `us-east-1`) |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `aws_session_token` | Token di sessione temporaneo quando si utilizzano credenziali AWS STS |

### Note

- La credenziale utilizza l'autenticazione standard AWS SigV4 tramite boto3.
- Le operazioni di caricamento inviano attualmente contenuto testuale UTF-8; i download possono restituire testo o base64 per oggetti binari.

### Utilizzato da

- [Nodo Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) è un archivio chiave-valore in memoria utilizzato per la cache e l'accesso rapido ai dati.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `host` | Nome host o IP del server Redis (ad es. `localhost`) |
| `port` | Porta Redis (predefinita: `6379`) |
| `password` | Password Redis (lasciare vuoto se non impostata) |

### Utilizzato da

- [Nodo Redis](../nodes/redis-node.md)

---

## Slack

La credenziale Slack memorizza un **Incoming Webhook URL** per pubblicare messaggi sui canali Slack.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `webhook_url` | URL dell'Incoming Webhook di Slack (dalla configurazione dell'app Slack) |

### Note

- Creare un Incoming Webhook su [api.slack.com/apps](https://api.slack.com/apps) → la propria app → **Incoming Webhooks**.
- Ogni webhook è associato a un canale specifico. Creare più credenziali per canali diversi.

### Utilizzato da

- [Nodo Slack](../nodes/slack-node.md)

---

## Telegram

La credenziale Telegram memorizza un **Bot Token** e un **Webhook Secret Token** opzionale per i workflow basati su bot.
### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `bot_token` | Token della Telegram Bot API fornito da BotFather |

### Campi opzionali

| Campo | Descrizione |
|-------|-------------|
| `secret_token` | Segreto condiviso verificato tramite `x-telegram-bot-api-secret-token` sui Webhook in ingresso |

### Note

- Utilizzare la stessa credenziale sia per il [Telegram Trigger](../nodes/telegram-trigger-node.md) sia per il [Telegram](../nodes/telegram-node.md).
- Registrare il Webhook manualmente tramite l'API `setWebhook` di Telegram, utilizzando l'URL mostrato nel pannello del nodo Telegram Trigger.
- Il parametro `chatId` nel nodo Telegram può essere un ID letterale oppure un'espressione come `$telegramEvent.message.chat.id`.

### Utilizzata da

- [Nodo Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Nodo Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer e Header)

Queste credenziali sono utilizzate dal [nodo HTTP](../nodes/http-node.md) per autenticare le richieste in uscita.

### Bearer

Aggiunge un header `Authorization: Bearer <token>` alle richieste HTTP.

| Campo | Descrizione |
|-------|-------------|
| `token` | Il valore del bearer token |

### Header

Aggiunge un header personalizzato alle richieste HTTP.

| Campo | Descrizione |
|-------|-------------|
| `header_key` | Nome dell'header (es. `X-Api-Key`) |
| `header_value` | Valore dell'header |

Entrambe le tipologie possono inoltre essere referenziate tramite `$credentials.CredentialName` nel [DSL delle espressioni](./expression-dsl.md) per un utilizzo dinamico in qualsiasi nodo che accetti espressioni.

### Utilizzate da

- [Nodo HTTP](../nodes/http-node.md)

---

## Provider LLM (OpenAI, Google, Custom, Cohere)

Queste credenziali alimentano i nodi IA.

| Tipo | Descrizione |
|------|-------------|
| **OpenAI** | Chiave API per i modelli GPT e gli embedding OpenAI |
| **Google** | Chiave API per i modelli Gemini |
| **Custom** | Chiave API + URL di base per endpoint compatibili con OpenAI (Ollama, vLLM, LM Studio, ecc.) |
| **Cohere** | Chiave API per gli embedding Cohere |

### Prompt Caching di OpenAI

OpenAI memorizza automaticamente nella cache il prefisso statico (invariato) del prompt di sistema — non è richiesta alcuna configurazione aggiuntiva. Le esecuzioni ripetute di un Workflow che condividono lo stesso prefisso del prompt di sistema beneficiano del prezzo dei token in cache, riducendo sia i costi sia la latenza. Ciò risulta particolarmente utile in presenza di istruzioni lunghe e fisse, in cui tra un'esecuzione e l'altra cambia soltanto il messaggio dell'utente. Monitorare i tassi di cache hit e il risparmio di token nella [scheda Esecuzioni](../tabs/traces-tab.md) o nella dashboard di utilizzo di OpenAI per ottimizzare la struttura del prompt in funzione del massimo riutilizzo della cache.

### Utilizzate da

- [Nodo LLM](../nodes/llm-node.md)
- [Nodo Agent](../nodes/agent-node.md)
- [Nodo RAG](../nodes/rag-node.md) (embedding OpenAI tramite la credenziale Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) è un server proxy per aggirare Cloudflare e analoghe protezioni anti-bot.

### Campi obbligatori

| Campo | Descrizione |
|-------|-------------|
| `flaresolverr_url` | URL dell'istanza FlareSolverr (es. `http://localhost:8191`) |

Gli indirizzi di loopback e privati sono supportati, pertanto l'esecuzione di FlareSolverr accanto a Heym funziona come documentato. L'URL non può risolversi in un indirizzo link-local o di cloud-metadata. Poiché gli indirizzi privati sono consentiti, questo campo può essere indirizzato anche verso un altro servizio interno e la risposta viene restituita nell'output del nodo. Qualsiasi utente autenticato può creare questa credenziale, pertanto il confine è rappresentato da chi può creare Workflow e dalle regole di rete, non dalla condivisione delle credenziali. Vedere [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Utilizzata da

- [Nodo Crawler](../nodes/crawler-node.md)

---

## Correlati

- [Credenziali](./credentials.md) – Panoramica delle credenziali e del loro utilizzo da parte dei nodi
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali
- [Condivisione delle credenziali](./credentials-sharing.md) – Condividere le credenziali con utenti e team
- [Sicurezza](./security.md) – Crittografia a riposo, controllo degli accessi
- [DSL delle espressioni](./expression-dsl.md) – Sintassi `$credentials` per l'accesso dinamico

---

## Model Router (Auto Model)

Instrada ogni richiesta verso una delle credenziali di modello esistenti, utilizzando un modello decisionale per
la scelta. Memorizza riferimenti, mai una chiave propria.

### Campi obbligatori

- `decision_credential_id` – una credenziale **Decision Model** a cui si ha accesso.
- `decision_model` – il modello che effettua la chiamata di routing, ad esempio `jev-latest`.
- `options` – almeno due voci, ciascuna con un nome, una delle credenziali OpenAI/Google/Custom
  disponibili, un modello su di essa e i criteri che ne stabiliscono la prevalenza.

### Campi opzionali

- `routing_instructions` – come ponderare complessivamente le opzioni.
- Una delle opzioni può essere contrassegnata come fallback, utilizzata quando il routing fallisce.

### Note

I nomi delle opzioni sono ciò tra cui il modello decisionale effettua la scelta, pertanto devono essere distinti. Un'opzione
non può puntare a un altro Model Router.
