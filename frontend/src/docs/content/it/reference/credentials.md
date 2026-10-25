# Credenziali

Le Credenziali memorizzano chiavi API e segreti utilizzati dai nodi del workflow. Vengono aggiunte nella [Scheda Credenziali](../tabs/credentials-tab.md) e referenziate per nome nella configurazione dei nodi.

## Cosa Sono le Credenziali

- **Memorizzate per utente** – Ogni credenziale appartiene a un utente e può essere [condivisa](./credentials-sharing.md) con altri utenti o [Team](./teams.md).
- **Cifrate a riposo** – I valori sensibili sono cifrati; l'interfaccia li maschera dopo la creazione.
- **Referenziate per nome** – I nodi selezionano una credenziale per nome (o ID). Il motore di esecuzione risolve la credenziale per il proprietario del workflow al momento dell'esecuzione.

## Come i Nodi le Utilizzano

| Tipo di nodo | Credenziale tipica | Scopo |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Valutazioni](../tabs/evals-tab.md) | OpenAI, Google, Custom | Chiave API per il modello |
| [Decision](../nodes/decision-node.md), giudice [Valutazioni](../tabs/evals-tab.md) | Decision Model | Base URL di un endpoint di decision model, più una chiave API opzionale |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Seleziona quale dei modelli serve ogni richiesta, utilizzando un decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Accesso tramite abbonamento ChatGPT (OAuth) o un token di accesso Codex per il runner, più un PAT GitHub per le operazioni sui repository |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Una chiave API del gateway OpenCode Go (base URL opzionale) per il runner, più un PAT GitHub per le operazioni sui repository |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Personal access token (PAT) GitHub per chiamate all'API GitHub, operazioni del nodo GitHub e integrazioni MCP |
| [Jira](../nodes/jira-node.md) | Jira | Email/token API Cloud, username/password oppure personal access token Data Center, base URL del sito Jira, modalità di deployment e versione REST API opzionale |
| [Linear](../nodes/linear-node.md) | Linear | Chiave API personale o OAuth2 per team, progetti, issue e commenti |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autenticazione per le richieste |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token del bot e secret webhook opzionale |
| [Discord](../nodes/discord-node.md) | Discord | URL del webhook in ingresso |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Chiave pubblica dell'applicazione per la verifica della firma |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Connessione all'archivio vettoriale (Qdrant esterno, oppure il Postgres di Heym tramite pgvector), con OpenAI o qualsiasi endpoint di embedding compatibile con OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook o token API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Connessione alla casella di posta in ingresso |
| [Send Email](../nodes/send-email-node.md) | SMTP | Server di posta |
| [Redis](../nodes/redis-node.md) | Redis | Connessione |
| [Grist](../nodes/grist-node.md) | Grist | Chiave API + URL del server |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consenso OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consenso OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consenso OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL del progetto + chiave API (+ schema predefinito opzionale) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + porta + username/password + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token di integrazione interna, oppure Client ID + Client Secret + consenso OAuth dell'integrazione pubblica |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token di autenticazione più base URL opzionale per self-hosted |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Per la configurazione dettagliata (host, porte, campi specifici del provider), consultare [Integrazioni di Terze Parti](./integrations.md). Sono inclusi la configurazione del bot Telegram, la posta in ingresso via IMAP e la posta in uscita via SMTP.

Le credenziali GitHub possono anche includere un `base_url` opzionale quando la destinazione è GitHub
Enterprise Server anziché GitHub.com. In fase di modifica di una credenziale GitHub per ruotare il token,
lasciare `base_url` vuoto preserva l'endpoint Enterprise esistente. Inserire un nuovo URL solo quando
si desidera modificare tale endpoint.

Le credenziali Jira, Linear, Supabase, Notion, Sentry e ClickHouse espongono **Test Connection** nella finestra di dialogo della credenziale. Per Jira, il controllo chiama l'endpoint dell'utente corrente di Jira. Per Linear,
il controllo chiama l'API Linear con `getViewer` e conferma che la chiave API o il token OAuth siano validi.
In fase di modifica, è possibile eseguire il test senza reinserire la chiave API se il segreto memorizzato è ancora presente. Per Notion,
scegliere **Internal token** o **OAuth** nella finestra di dialogo; OAuth utilizza il Client ID e il Client Secret
dell'integrazione pubblica Notion. Per i dettagli sulla configurazione di
Notion, consultare [Integrazioni di Terze Parti](./integrations.md#notion).

## Utilizzo del pacchetto di coding

La scheda **AI Defaults** in [Impostazioni](./user-settings.md) mostra l'utilizzo residuo del pacchetto di coding per le credenziali Codex (proprie e condivise). Per ciascuna credenziale Codex viene visualizzata una barra orizzontale per ogni finestra di rate-limit attiva — tipicamente una finestra di **5 ore** e/o **settimanale**, a seconda del piano — con la percentuale di quota residua e un conto alla rovescia per il reset. I dati provengono dagli header di risposta del rate-limit del backend Codex, recuperati su richiesta.

Anche le credenziali OpenCode Go sono elencate, ma contrassegnate come **"utilizzo non disponibile"**: il gateway OpenCode zen non espone i dati sulla quota residua, pertanto non è possibile mostrare alcuna barra.

## Nelle espressioni

Alcuni nodi consentono espressioni per l'autenticazione. Utilizzare [Expression DSL](./expression-dsl.md) con `$credentials.CredentialName` per fare riferimento al segreto risolto di una credenziale all'interno di un'espressione. Per la riga di header necessaria a ciascun tipo di credenziale in una richiesta HTTP, consultare [HTTP › Autenticazione con credenziali](../nodes/http-node.md#authenticating-with-credentials).

Le credenziali Codex sono intenzionalmente escluse da `$credentials`. Sia che si acceda con ChatGPT (abbonamento, nessun costo API per token) sia che si incolli un `access_token` Codex, i token vengono passati esclusivamente al processo locale del runner Codex. I token di accesso ChatGPT vengono aggiornati automaticamente alla scadenza.

Anche le credenziali Jira sono escluse da `$credentials`. Il [nodo Jira](../nodes/jira-node.md) carica la credenziale tramite `credentialId` in fase di esecuzione. Per chiamate REST Jira personalizzate non coperte dal nodo Jira, utilizzare il [nodo HTTP](../nodes/http-node.md) con Jira Basic Auth (`email:api_token` per Jira Cloud oppure `username:password` per Data Center / Server), ad esempio `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. È inoltre possibile utilizzare una credenziale [Header](../nodes/http-node.md) con `Authorization: Basic <base64(user:secret)>`. Per i personal access token di Jira Data Center / Server, inviare invece `Authorization: Bearer <token>`; la credenziale Jira stessa supporta questa modalità tramite la sua modalità di autenticazione **Personal Access Token**.

| Tipo di credenziale | Valore esposto a `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Stringa del token Bearer |
| Header | Riga completa `header key: header value`, pronta per essere inserita in un argomento `-H` di cURL |
| GitHub | Personal access token |
| Notion | `api_token` interno oppure `access_token` OAuth (token Bearer per le chiamate API Notion) |
| Sentry | Token di autenticazione Sentry |
| Discord / Slack | URL del Webhook |

Esempio:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilizzare il **nodo** Notion per le operazioni native su database, pagine e blocchi. Utilizzare `$credentials` quando una richiesta [HTTP](../nodes/http-node.md) personalizzata necessita dello stesso token Bearer Notion.

## Creazione di credenziali dalla Chat

L'[AI Assistant](./ai-assistant.md#credentials), la [scheda Chat](../tabs/chat-tab.md) e [Chat with Heym](./chat-with-heym.md) possono creare una credenziale quando un workflow ne richiede una, oppure ogni volta che se ne fa richiesta. L'assistente propone il tipo e un nome, e il modulo standard della credenziale si apre nella conversazione. Richiedendo l'aggiornamento di una credenziale di propria proprietà, si apre lo stesso modulo su di essa, con i relativi segreti mascherati. L'assistente vede soltanto il nome e il tipo. `heym_chat` tramite [MCP](../tabs/mcp-tab.md) non può creare, aggiornare o scegliere credenziali.

## Correlati

- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere, modificare, eliminare credenziali
- [Nodo GitHub](../nodes/github-node.md) – Operazioni REST native GitHub
- [Nodo Jira](../nodes/jira-node.md) – Automazione di progetti, issue, commenti, allegati, utenti, notifiche e transizioni Jira
- [Nodo Linear](../nodes/linear-node.md) – Automazione di workspace e issue Linear GraphQL
- [Nodo Notion](../nodes/notion-node.md) – Ricerca e gestione dei contenuti Notion
- [Nodo Sentry](../nodes/sentry-node.md) – Automazione di organizzazioni, progetti, team, issue, eventi e release Sentry
- [Condivisione delle credenziali](./credentials-sharing.md) – Condivisione con utenti e team
- [Integrazioni di terze parti](./integrations.md) – Guida alla configurazione per tipo di credenziale
- [Expression DSL](./expression-dsl.md) – `$credentials` nelle espressioni

## Model Router (Auto Model)

Un Model Router non contiene alcuna chiave. Contiene una **credenziale del modello decisionale**, un elenco di **opzioni di modello** — ciascuna costituita da una credenziale OpenAI, Google o Custom esistente più un modello — e, per ogni opzione, un testo libero che indica quando tale opzione deve essere utilizzata.

Compare in ogni selettore che offre un modello: i nodi [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboard, l'editor di espressioni e le Tabelle dati. Il suo unico modello è **Auto**. Selezionandolo, il modello decisionale legge ogni richiesta e la instrada. [Evals](../tabs/evals-tab.md) lo esclude, poiché un eval confronta modelli specifici mentre un router sceglie autonomamente.

Un agent re-instrada man mano che il proprio ciclo di tool progredisce, così un modello economico può gestire i turni iniziali e uno più potente il turno che lo richiede. Input identici riutilizzano la decisione precedente, pertanto un ciclo paga una decisione solo quando la conversazione è effettivamente avanzata.

### Cosa non può fare

Auto Model non può essere combinato con la **Responses API**, la **modalità Batch** o l'**output di immagini**. Tali opzioni si disattivano automaticamente quando viene selezionato un router, e ciascuna ne indica il motivo. I controlli dei guardrail e il classificatore della policy di revisione umana sono chiamate a modello singolo fisse e non vengono mai instradati.

### Quando il routing non riesce

Contrassegnare un'opzione con **Usa questa opzione quando il routing non riesce** e un'interruzione del modello decisionale non bloccherà mai un'esecuzione; viene utilizzato il fallback e il motivo viene registrato sull'esecuzione. In assenza di tale opzione, il nodo fallisce anziché procedere per tentativi.

### Visualizzare dove è stata indirizzata una richiesta

Tracce mostra `Auto Model / GPT-5` anziché il solo modello, e il costo rimane attribuito al modello che ha effettivamente eseguito. Il Log di esecuzione del Canvas e la Vista Span mostrano la stessa coppia, e la Vista Span elenca quale turno è stato indirizzato dove.
