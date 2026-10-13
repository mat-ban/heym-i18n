# Scheda MCP

La scheda **MCP** configura l'integrazione con il Model Context Protocol (MCP). MCP consente ai client IA (Claude, ChatGPT, Gemini, Cursor e qualsiasi strumento compatibile con MCP) di richiamare i workflow di Heym come strumenti.

Heym supporta due modalità: un **server predefinito** che espone tutti i workflow abilitati a MCP sotto un unico endpoint, e **server denominati** che assegnano a ciascun gruppo logico di workflow un URL dedicato e una propria API key.

Entrambe le modalità possono esporre due tipi di strumenti: i singoli **workflow** e lo **strumento chat di Heym** — l'intero motore della [scheda Chat](./chat-tab.md) racchiuso in un unico strumento `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

## Server MCP predefinito

Il server predefinito è sempre disponibile all'indirizzo `{origin}/api/mcp/sse`. Tutti i workflow con MCP attivato compaiono qui come strumenti.

### API Key MCP

- Le chiavi sono memorizzate come digest SHA-256, pertanto Heym non può mostrare una chiave esistente. La scheda indica se una chiave è impostata, non quale sia.
- **Generate** / **Regenerate** – La nuova chiave viene mostrata una sola volta, subito dopo la creazione. Copiarla in quel momento; ricaricando la scheda viene nascosta definitivamente.
- Utilizzare questa chiave per connettere Claude Desktop, Cursor o altri client MCP a Heym
- Chiave smarrita? Rigenerarla. La chiave precedente smette di funzionare immediatamente.

### Metodi di connessione

- **API Key** – Utilizzare l'API key MCP per connessioni programmatiche. La scheda può copiare una configurazione JSON pronta all'uso e include un pulsante **Add to Cursor** per la configurazione di Cursor con un solo clic.
- **Claude** – La scheda mostra l'URL del server MCP e i passaggi di configurazione per Claude. Lasciare vuoti OAuth Client ID e Secret; Claude si registra automaticamente e si autentica tramite OAuth di Heym.
- **ChatGPT** – La scheda mostra l'URL del server MCP e i passaggi di configurazione per un'app ChatGPT. Attivare la modalità sviluppatore, creare un'app con l'URL e scegliere OAuth; ChatGPT si registra automaticamente.
- **Gemini** – La scheda mostra l'URL del server MCP e i passaggi di configurazione per un'app personalizzata Gemini: in gemini.google.com, selezionare **Settings → Connected Apps → Add a custom app**, incollare l'URL e lasciare chiuso **Advanced features**; Gemini si registra automaticamente e si autentica tramite Heym OAuth. Una volta connesso, Heym funziona anche nell'app mobile Gemini.

### Attivazione MCP del workflow

Ogni workflow può essere esposto come strumento MCP:

- **Enable** – Gli strumenti del workflow diventano disponibili a tutti i client connessi al server predefinito
- **Disable** – Il workflow non viene esposto

Le schede dei workflow mostrano la descrizione e un'anteprima dei nomi dei campi di input, così è possibile vedere cosa si aspetta ciascuno strumento prima di attivarlo.

## Strumento chat di Heym

La sezione **Heym Capabilities** trasforma il motore della scheda Chat in un unico strumento MCP denominato `heym_chat`. È possibile attivarlo sul server predefinito, su qualsiasi server denominato o su entrambi — ciascuna superficie mantiene il proprio interruttore e la propria selezione del modello.

Quando è attivo, `heym_chat` compare in `tools/list` insieme agli strumenti dei workflow. Un client MCP invia un singolo messaggio in linguaggio naturale e il motore di Heym se ne occupa, con le stesse capacità della scheda Chat:

- Creare un workflow, eseguirlo in prova con input di esempio, correggerlo e terminare quando un'esecuzione ha esito positivo (vedere [Modalità Build](#build-mode))
- Ispezionare ed eseguire i workflow esistenti
- Riportare analisi, esecuzioni recenti e pianificazioni cron imminenti
- Riportare la cronologia di esecuzione di un workflow: quante volte è stato eseguito, il conteggio per stato, quando è stato eseguito e, su richiesta, gli input, gli output e gli errori per nodo di una singola esecuzione
- Riportare cosa è in esecuzione in questo momento: quante esecuzioni sono attive, i nomi dei relativi workflow, da quanto tempo ciascuna è in esecuzione, il nodo su cui si trova attualmente e un link all'esecuzione in tempo reale
- Elencare le board, creare card e leggere il dettaglio delle card nella [scheda Board](./board-tab.md)
- Elencare le tabelle dati con le relative colonne, crearne di nuove e collegarle ai workflow che costruisce
- Leggere team e variabili globali e cercare nella documentazione
- Approvare, modificare o rifiutare le revisioni human-in-the-loop in sospeso

Le capacità aggiunte successivamente alla scheda Chat diventano automaticamente disponibili tramite `heym_chat` — non esiste alcun interruttore per singola capacità da mantenere sincronizzato.

### Modalità Build

`heym_chat` esegue sempre il motore Chat in modalità build. In una singola chiamata l'assistente può salvare un nuovo workflow, eseguirlo con input di esempio realistici, leggere il report di esecuzione, correggere ciò che non ha funzionato ed eseguirlo di nuovo, fino a cinque esecuzioni di test per chiamata. Quando l'ultima esecuzione dell'ultimo salvataggio ha esito positivo, conclude con un riepilogo di una frase e la risposta termina con `Verified: the latest test run of the saved workflow passed.`

- Le esecuzioni di test sono esecuzioni reali. I relativi effetti collaterali si verificano e compaiono nella cronologia delle esecuzioni del workflow come qualsiasi altra esecuzione.
- I salvataggi seguono il percorso dell'editor: una modifica al grafo mantiene il grafo precedente nella **Edit History** del workflow.
- Per modificare un workflow creato in precedenza, continuare la conversazione con lo stesso `conversation_id`. L'assistente aggiorna quel workflow invece di crearne uno nuovo e modifica solo i workflow che l'utente ha il permesso di modificare.
- Quando le cinque esecuzioni di test sono esaurite, l'assistente si ferma e spiega cosa continua a fallire.

Le credenziali restano nell'interfaccia: `heym_chat` non le elenca, non le sceglie e non le crea mai. Quando costruisce o modifica un workflow, i nuovi nodi che richiedono una credenziale vengono lasciati vuoti e la risposta ne indica i nomi, così è possibile impostarle nell'editor.

Le tabelle dati sono diverse. Una tabella non contiene segreti, quindi `heym_chat` può elencare le tabelle, chiedere quale debba usare un workflow e crearne una nuova con le relative colonne. Non legge né scrive mai righe.

### Credenziale e modello

`heym_chat` esegue il motore sul proprio account Heym, quindi necessita di una credenziale LLM dedicata:

| Campo | Comportamento |
|-------|----------|
| **Credential** | Selezionare qualsiasi credenziale OpenAI, Google o Custom a cui si ha accesso. Precompilata dalla credenziale preferita in [Settings](../reference/user-settings.md) quando non ne è stata scelta una. |
| **Model** | Caricato dalla credenziale selezionata. Precompilato dal modello preferito quando la credenziale corrisponde. |

Se uno dei due è mancante, lo strumento compare comunque in `tools/list` ma ogni chiamata restituisce un errore che invita a completare la configurazione in questa scheda.

### Argomenti e cronologia

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `message` | Sì | L'istruzione o la domanda, in linguaggio naturale. |
| `conversation_id` | No | Un `conversation_id` da un precedente risultato di `heym_chat`, per continuare quella conversazione. |

Ogni chiamata viene scritta nella cronologia della [scheda Chat](./chat-tab.md) come una normale conversazione, contrassegnata da un'icona a spina nell'elenco delle conversazioni. Messaggi, card degli strumenti e pause di chiarimento appaiono esattamente come in una conversazione avviata manualmente, ed è possibile aprire la conversazione e continuare a scrivere nel browser. Ogni risultato restituisce il proprio `conversation_id`, così il client MCP può continuare la stessa conversazione invece di aprirne una nuova a ogni chiamata.

Quando l'assistente necessita di chiarimenti, si mette in pausa e lo segnala; rispondere con le informazioni richieste utilizzando lo stesso `conversation_id`.

## Server MCP con nome

I server con nome consentono di segmentare i workflow in endpoint MCP isolati. Ogni server dispone di un URL e di una API key propri, così client IA, team o casi d'uso differenti possono connettersi esattamente ai workflow di cui necessitano.

### Creazione di un server con nome

1. Digitare un nome nel campo di input in fondo alla scheda MCP (ad es. **CRM Tools**)
2. Fare clic su **Create** — una nuova scheda del server viene visualizzata immediatamente
3. Fare clic sulla scheda per espanderla

### Impostazioni per singolo server

Ogni scheda del server mostra:

| Impostazione | Descrizione |
|---------|-------------|
| **SSE Endpoint** | URL univoco: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Chiave indipendente, mostrata una sola volta al momento della generazione o rigenerazione. Copiarla immediatamente; viene memorizzata con hash e non può essere rivelata successivamente |
| **How to connect** | **Copy JSON** copia la configurazione MCP pronta da incollare; **Add to Cursor** la installa con un solo clic |
| **Heym Capabilities** | Attivare o disattivare lo strumento `heym_chat` per questo server e selezionarne la credenziale e il modello |
| **Assigned Workflows** | Attivare o disattivare quali workflow questo server espone |

### Assegnazione dei workflow

L'assegnazione dei workflow è per singolo server e indipendente dall'interruttore del server predefinito. Un workflow può essere abilitato sul server predefinito e su più server con nome contemporaneamente, oppure su nessuno.

L'attivazione o disattivazione di un workflow lo sposta in cima all'elenco assegnato, così la riga appena modificata rimane visibile invece di scorrere via.

### Autenticazione

I server con nome supportano gli stessi metodi di autenticazione del server predefinito:

- **Header X-MCP-Key** – Trasmettere direttamente la API key del server (client API, Cursor). Solo header: le chiavi non sono accettate come parametro di query `?key=`, poiché gli URL finiscono nei log di accesso, nei log dei proxy e nella cronologia del browser.
- **Claude, ChatGPT e Gemini OAuth** – Aggiungere l'URL del server ai connettori o alle app personalizzate del client; lasciare vuote le credenziali e il client si registra automaticamente tramite OAuth. Il bearer token deve viaggiare nell'header `Authorization`, non come `?token=`.
- **Session token** – Rilasciato durante l'handshake SSE; con ambito limitato al server specifico, così i token di un server con nome non possono accedere a un altro. Questo parametro `?session=` di breve durata non è interessato.

### Eliminazione di un server con nome

Fare clic sull'icona **X** nell'intestazione della scheda del server. L'eliminazione rimuove il server e tutte le sue assegnazioni di workflow; i workflow stessi non sono interessati.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Entrambi gli endpoint supportano il trasporto SSE (GET, MCP spec 2024-11-05) e il trasporto Streamable HTTP (POST, MCP spec 2025-03-26). Claude, ChatGPT e Gemini utilizzano OAuth 2.1 / PKCE per l'accesso sicuro su entrambi.

## Correlati

- [Why Heym](../getting-started/why-heym.md) – MCP come primitiva di primo livello in Heym
- [Agent Node](../nodes/agent-node.md) – Nodo Agent con supporto agli strumenti MCP
- [Agent Architecture](../reference/agent-architecture.md) – Client MCP, dispatch degli strumenti, orchestratore
- [Triggers](../reference/triggers.md) – MCP come punto di ingresso del workflow
- [Chat Tab](./chat-tab.md) – Il motore alla base dello strumento `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Creare e gestire i workflow
- [Node Types](../reference/node-types.md) – Panoramica dei nodi IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alle pagine per le superfici della dashboard
