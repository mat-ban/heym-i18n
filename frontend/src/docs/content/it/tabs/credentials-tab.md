# Scheda Credenziali

La scheda **Credenziali** gestisce le chiavi API e i segreti utilizzati dai nodi. Aggiungere le credenziali qui e farvi riferimento per nome nei nodi del workflow. Per una panoramica su cosa sono le credenziali e su come i nodi le utilizzano, consultare [Credenziali](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Guarda la demo delle Credenziali</a></p>

## Tipi di Credenziali

| Tipo | Caso d'Uso |
|------|----------|
| **OpenAI** | Chiave API OpenAI per nodi LLM, Agent e RAG |
| **Google** | Chiave API Google AI (Gemini) |
| **GitHub** | Token di accesso personale GitHub (PAT) per API GitHub, workflow con nodo GitHub, server MCP e workflow degli agenti; `base_url` opzionale per GitHub Enterprise |
| **Linear** | Chiave API personale Linear o OAuth2 per team, progetti, issue e commenti |
| **Notion** | Token di integrazione interna o autorizzazione workspace OAuth per integrazione pubblica |
| **Custom** | Endpoint LLM personalizzati |
| **Bearer** | Token Bearer per autenticazione HTTP |
| **Header** | Coppia chiave-valore di header personalizzato per richieste HTTP |
| **Telegram** | Token del bot Telegram e secret webhook opzionale |
| **Slack** | URL del webhook in ingresso di Slack |
| **Discord** | URL del webhook in ingresso di Discord |
| **Discord Trigger** | Chiave pubblica dell'applicazione Discord |
| **IMAP** | Credenziali per trigger di casella di posta in ingresso |
| **SMTP** | Credenziali per l'invio di email |
| **Redis** | Connessione Redis |
| **RAG: Qdrant + OpenAI** | Archivio vettoriale per nodi RAG, supportato da un server Qdrant esterno |
| **RAG: Psql + OpenAI** | Archivio vettoriale per nodi RAG, supportato dal database Postgres di Heym (pgvector) — nessun servizio esterno |
| **RAG: Custom Embeddings** | Archivio vettoriale per nodi RAG che utilizza qualsiasi endpoint di embedding compatibile con OpenAI, con Qdrant o Postgres (pgvector) come archivio |
| **Cohere** | API Cohere per gli embedding |

## Aggiunta di Credenziali

1. Fare clic su **Aggiungi Credenziale**
2. Scegliere il tipo di credenziale
3. Inserire i valori richiesti (chiave API, URL, ecc.)
4. Assegnare un nome per il riferimento nei nodi

Per GitHub, il flusso attuale delle credenziali è basato su PAT. Si consigliano PAT con granularità fine. I flussi di installazione delle GitHub App non sono attualmente di primo livello nell'interfaccia. Se si utilizza GitHub Enterprise Server, è possibile impostare anche un URL di base opzionale dell'API GitHub, ad esempio `https://github.example.com/api/v3`.

Per Linear, scegliere **Chiave API personale** o **OAuth2** nella finestra di dialogo. Le chiavi API personali vengono create
in **Settings → Security & Access → Personal API keys** in Linear. OAuth2 utilizza un Client ID e un Client Secret
di un'applicazione OAuth Linear, con `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrato come URI di reindirizzamento. La credenziale agisce con i permessi dell'utente Linear che
l'ha creata o autorizzata. Utilizzare **Test Connessione** nella finestra di dialogo della credenziale per verificare la chiave API o
il token OAuth prima del salvataggio.

Per **Notion**, scegliere **Token interno** o **OAuth** nella finestra di dialogo. OAuth utilizza il Client ID e
il Client Secret della propria integrazione pubblica Notion; Heym li memorizza cifrati nella credenziale.
Utilizzare **Test Connessione** per verificare le credenziali Supabase, Linear o Notion prima di salvare un workflow. Consultare
[Integrazioni di Terze Parti](../reference/integrations.md#notion) per i dettagli sulla configurazione di Notion.

Le credenziali OAuth aprono la pagina di autorizzazione del provider in un popup. Se il browser la blocca, utilizzare il link **Apri la pagina di autorizzazione** sotto il pulsante Connetti; la finestra di dialogo rileva quando la connessione è completata. Una volta connessa una nuova credenziale, il pulsante mostra **Connesso**.

## Modifica ed Eliminazione

- **Modifica** – Aggiornare i valori della credenziale (i valori sensibili sono mascherati)
- **Elimina** – Rimuovere una credenziale; i workflow che la utilizzano necessiteranno di una sostituzione

Durante la modifica di una credenziale **GitHub** su GitHub Enterprise Server, lasciando vuoto il campo opzionale **GitHub
API Base URL** si preserva l'endpoint Enterprise esistente. Inserire un nuovo URL solo quando si
desidera modificare tale endpoint.

## Condivisione

- [Condividere le credenziali](../reference/credentials-sharing.md) con altri utenti tramite email o con i [Team](../reference/teams.md)
- Le credenziali condivise appaiono con un indicatore
- Revocare la condivisione dal menu della scheda della credenziale

## Utilizzo nei Nodi

Fare riferimento alle credenziali per nome nella configurazione del nodo. Ad esempio:
- [Nodo LLM](../nodes/llm-node.md) – Selezionare la credenziale per l'API del modello
- [Nodo HTTP](../nodes/http-node.md) – Utilizzare credenziali Bearer o Header per l'autenticazione
- [Nodo Agent](../nodes/agent-node.md) – Passare i token GitHub nelle variabili d'ambiente del server MCP come `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nodo GitHub](../nodes/github-node.md) – Eseguire operazioni native su repository, utenti, issue, review, release, workflow, traffico e file di GitHub
- [Nodo Linear](../nodes/linear-node.md) – Leggere i metadati del workspace e automatizzare issue e commenti di Linear
- [Nodo Notion](../nodes/notion-node.md) – Gestire database, origini dati, pagine e blocchi di Notion
- [Nodo RAG](../nodes/rag-node.md) – Utilizzare una credenziale Qdrant o Postgres (pgvector) per l'archivio vettoriale
- [Nodo Telegram Trigger](../nodes/telegram-trigger-node.md) – Ricevere webhook del bot Telegram
- [Nodo Telegram](../nodes/telegram-node.md) – Inviare messaggi del bot Telegram
- [Nodo Discord Trigger](../nodes/discord-trigger-node.md) – Ricevere webhook di interazione Discord
- [Nodo Discord](../nodes/discord-node.md) – Inviare messaggi webhook Discord
- [Nodo IMAP Trigger](../nodes/imap-trigger-node.md) – Effettuare il polling di una casella condivisa per nuove email

Consultare [Expression DSL](../reference/expression-dsl.md) per fare riferimento a valori basati su credenziali nelle espressioni.

## Correlati

- [Integrazioni di terze parti](../reference/integrations.md) – Guida dettagliata alla configurazione per ciascun tipo di credenziale (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack e altro)
- [Condivisione delle credenziali](../reference/credentials-sharing.md) – Condividere le credenziali con altri utenti
- [Sicurezza](../reference/security.md) – Crittografia a riposo, gestione delle sessioni, rate limiting
- [Tipi di Nodo](../reference/node-types.md) – Nodi che utilizzano credenziali ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Scheda Archivi vettoriali](./vectorstores-tab.md) – Utilizza credenziali Qdrant o Postgres (pgvector)
- [Scheda Chat](./chat-tab.md) – Utilizza credenziali OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alla pagina per le superfici della dashboard
