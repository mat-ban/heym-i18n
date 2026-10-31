# DataTable

La scheda **DataTable** consente di creare e gestire tabelle di dati strutturate direttamente in Heym. Le tabelle possono essere utilizzate nei workflow tramite il [nodo DataTable](../nodes/datatable-node.md) per operazioni CRUD programmatiche.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Guarda la demo di DataTable</a></p>

## Creazione di una tabella

1. Accedere alla scheda DataTable dalla dashboard
2. Fare clic su **Create DataTable**
3. Inserire un nome e una descrizione opzionale
4. Aggiungere colonne tramite l'editor delle colonne

## Colonne

Ogni colonna presenta:

| Proprietà | Descrizione |
|----------|-------------|
| Name | Nome visualizzato della colonna |
| Type | `string`, `number`, `boolean`, `date` o `json` |
| Required | Indica se le nuove righe devono includere questa colonna |
| Unique | Indica se i valori devono essere univoci tra le righe |
| Default Value | Compilato automaticamente quando una riga omette questa colonna |

Le colonne possono essere aggiunte, modificate o rimosse dall'intestazione della vista di dettaglio della tabella.

## Generazione delle colonne con l'IA

Anziché aggiungere le colonne manualmente, è possibile descrivere la tabella in linguaggio naturale (oppure incollare un JSON di esempio) e lasciare che un LLM proponga lo schema. Entrambi i punti di accesso aprono la stessa finestra di dialogo:

- **Generate with AI** (intestazione dell'elenco DataTable) — crea una tabella completamente nuova a partire dalla descrizione fornita.
- **AI columns** (vista di dettaglio della tabella, accanto ai controlli delle colonne) — propone *nuove* colonne da aggiungere alla tabella attualmente aperta.

### Come funziona

1. Selezionare una **credenziale LLM** e un **modello** (per impostazione predefinita vengono utilizzati la prima credenziale LLM disponibile e il relativo modello più recente).
2. Digitare una descrizione — ad esempio *"Una tabella di libri con titolo, autore, numero di pagine e se li ho letti"* — oppure incollare un esempio o uno schema JSON.
3. Fare clic su **Generate**. Il modello restituisce uno schema suggerito.
4. Rivedere le colonne generate in un modulo modificabile: modificare **name**, **type**, **default**, **unique** e **notEmpty** (obbligatorio) per ciascuna, eliminare le colonne indesiderate oppure utilizzare **Add column** per aggiungerne manualmente. Per una nuova tabella è inoltre possibile modificare **name** e **description** suggeriti dall'IA.
5. Fare clic su **Create Table** (nuova tabella) o **Add Columns** (tabella esistente) per salvare. Premere **Esc** per chiudere la finestra di dialogo in qualsiasi momento.

### Solo aggiunta per le tabelle esistenti

Quando si generano colonne per una tabella esistente, il modello visualizza le colonne correnti come contesto e propone **solo nuove** colonne. Le colonne esistenti e i relativi dati non vengono mai modificati né rimossi — le colonne generate vengono aggiunte in coda. I nomi duplicati (senza distinzione tra maiuscole e minuscole) vengono eliminati automaticamente.

> È necessaria una credenziale LLM (OpenAI, Google o Custom). In assenza di credenziali, aggiungerne una in Settings.

## Gestione delle righe

- **Aggiunta riga**: fare clic sul pulsante di aggiunta per creare una nuova riga
- **Modifica in linea**: fare doppio clic su una cella per modificarne il valore. Premere Invio o fare clic altrove per salvare, Esc per annullare
- **Eliminazione riga**: utilizzare il menu delle azioni di riga per rimuovere una riga
- **Paginazione**: le righe vengono visualizzate in gruppi di 25 per pagina con navigazione tra le pagine

## Importazione/Esportazione CSV

### Importazione
1. Fare clic su **Import CSV** nella vista di dettaglio della tabella
2. Selezionare un file CSV da caricare
3. Visualizzare l'anteprima delle prime 5 righe e della mappatura delle colonne
4. Le colonne verdi sono associate a colonne esistenti della tabella; quelle gialle non sono associate
5. Fare clic su Import per inserire le righe in blocco

### Esportazione
Fare clic su **Export CSV** per scaricare tutte le righe come file CSV.

## Condivisione

Condividere le tabelle con altri utenti o team:

1. Aprire la finestra di dialogo di condivisione dalla vista di dettaglio della tabella
2. Aggiungere utenti tramite email con permesso di **lettura** o **scrittura**
3. Aggiungere team con permesso di **lettura** o **scrittura**
4. Gli utenti di sola lettura possono visualizzare i dati; gli utenti con accesso in scrittura possono modificare righe e colonne. Rinominare la tabella, modificarne la descrizione e gestire le condivisioni rimangono operazioni riservate al proprietario.

## Creazione di tabelle dall'Assistente IA

L'[Assistente AI](../reference/ai-assistant.md#data-tables) del canvas, la [Chat](./chat-tab.md) e lo strumento `heym_chat` nella [scheda MCP](./mcp-tab.md) possono scegliere una delle tabelle per un workflow creato o crearne una nuova. Propongono un nome e le colonne, creando la tabella quando si invia la scheda della domanda. L'assistente del canvas configura i nodi del workflow dai metadati della tabella. La Chat e `heym_chat` possono anche ispezionare le righe, aggiungere o rimuovere colonne e inserire, aggiornare o eliminare righe direttamente. Basta fornire il nome di una tabella o il link di questa scheda. La scrittura richiede la proprietà o l'accesso in **scrittura** diretto o di team. L'aggiunta di colonne conserva i dati esistenti; la rimozione di colonne ne cancella i valori da ogni riga. La rimozione di colonne e la cancellazione di tutte le righe richiedono conferma, esattamente come in questa scheda.

## Utilizzo nei workflow

Il [nodo DataTable](../nodes/datatable-node.md) collega le tabelle ai workflow. Le operazioni disponibili includono find, getAll, getById, insert, update, remove e upsert. Non sono richieste credenziali.

## Tabella dei costi LLM (tabella di sistema)

Una sezione **System tables** fissata in alto appare sopra le tabelle create dall'utente con una singola voce: **LLM Cost Table**. Si tratta di una vista a schema fisso, modificabile per singolo utente, dei prezzi per modello utilizzati dai grafici dei costi delle [Tracce](./traces-tab.md).

### Provenienza dei dati

Heym mantiene una tabella globale dei prezzi per modello, inizializzata dall'endpoint pubblico dei prezzi di Helicone (`https://www.helicone.ai/api/llm-costs`). La sincronizzazione viene eseguita in background la prima volta che si apre la tabella o le Tracce ed è limitata a un recupero ogni 24 ore. Premere **Refresh** per forzare una nuova sincronizzazione immediata. Le voci rimosse dall'elenco upstream di Helicone non vengono eliminate localmente, in modo che le ricerche storiche dei costi rimangano stabili.

### Schema (colonne di sola lettura)

| Colonna | Significato |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativo, utilizzato da Helicone) |
| Model | Identificatore del modello confrontato con `trace.model` |
| Op | Operatore di corrispondenza: `equals`, `startsWith` o `includes` |
| Input $/1M | USD per 1 milione di token di prompt |
| Output $/1M | USD per 1 milione di token di completamento |
| Source | `helicone`, `seed` o `user` |

### Personalizzazione dei prezzi

- **Modificare una riga** per sovrascrivere i relativi prezzi. La sovrascrittura è per utente ed è contrassegnata da un badge `Customized`; le future sincronizzazioni di Helicone non la modificano.
- **Ripristinare i valori predefiniti** rimuove la sovrascrittura e ripristina il valore globale per quella riga.
- **Aggiungi modello personalizzato** apre una finestra di dialogo per creare una riga riservata all'utente (ad esempio, un modello fine-tuned privato non elencato da Helicone). Le righe personalizzate sono contrassegnate come `User added` e la loro eliminazione le rimuove completamente.

### Corrispondenza con le tracce

Quando la dashboard Tracce calcola il costo, confronta ciascun `trace.model` con:

1. Le sovrascritture dell'utente (corrispondenza esatta sul nome del modello) per prime
2. In caso contrario, la tabella globale — la corrispondenza esatta `equals` ha priorità su `startsWith`/`includes`; i conflitti all'interno dello stesso operatore vengono risolti in base al prefisso/sottostringa di modello corrispondente più lungo

Se nessuna riga corrisponde, il modello viene elencato nella notifica **Modelli senza prezzo** nella pagina Tracce; il suo contributo al costo è pari a zero finché non si aggiunge una riga personalizzata o non se ne sovrascrive una.

## Correlati

- [Nodo DataTable](../nodes/datatable-node.md) - Riferimento del nodo Workflow
- [Scheda Tracce](./traces-tab.md) - Utilizza la tabella dei costi LLM per il grafico a ciambella dei costi e le schede KPI
- [Nodo Grist](../nodes/grist-node.md) - Alternativa con foglio di calcolo esterno
- [Scheda Variabili](./global-variables-tab.md) - Alternativa di archiviazione chiave-valore