# Assistente IA

L'**Assistente IA** è un pannello di chat che si apre dal pannello Debug e si posiziona in basso a destra nell'editor. Trascinare l'intestazione per spostarlo, oppure trascinare un bordo o un angolo per modificarne larghezza o altezza. Non si riduce al di sotto di 360×480 pixel. La posizione e le dimensioni vengono memorizzate in questo browser. **Reimposta posizione e dimensioni** nell'intestazione riporta il pannello in basso a destra. Utilizzare il linguaggio naturale per creare o modificare i workflow: descrivere ciò che si desidera e l'IA genera nodi e connessioni che vengono applicati al canvas.

Per domande sulla documentazione al di fuori dell'editor, utilizzare [Chat with Heym](./chat-with-heym.md). Tale interfaccia è ottimizzata per l'assistenza prodotto contestuale alla pagina, anziché per la generazione di workflow.

## Apertura del pannello

1. Aprire un workflow nell'editor
2. Individuare il **pannello Debug** in basso (area dei risultati di esecuzione)
3. Fare clic sul pulsante **AI** (icona Sparkles) nella barra degli strumenti del pannello
4. Il pannello dell'Assistente IA si apre in basso a destra. Trascinare l'intestazione per spostarlo, oppure trascinare un bordo o un angolo per modificarne larghezza e altezza.

Premere `Ctrl + I` / `Cmd + I` in qualsiasi punto dell'editor per aprire o chiudere il pannello: la scorciatoia funziona anche quando un campo di testo è attivo. Consultare [Scorciatoie da tastiera](./keyboard-shortcuts.md).

Per lavorare su un singolo nodo, passaci sopra con il mouse sul canvas e fai clic su **AI** sopra di esso. Il pannello si apre focalizzato su quel nodo. Vedi [Modifica di un singolo nodo](#changing-one-node).

## Chiusura del pannello

Fare clic sul pulsante **X**, premere `Ctrl + I` / `Cmd + I`, oppure attivare/disattivare il pulsante **AI** nella barra degli strumenti del pannello Debug. L'intestazione serve a trascinare il pannello, non a chiuderlo.

## Configurazione

Prima di inviare messaggi, selezionare:

| Impostazione | Descrizione |
|---------|-------------|
| **Credenziale** | Credenziale LLM (chiave API) da [Credenziali](../tabs/credentials-tab.md) |
| **Modello** | Nome del modello (es. `gpt-4o`, `gemini-2.5-flash`) |

Aggiungere le credenziali nella [Scheda Credenziali](../tabs/credentials-tab.md). L'elenco dei modelli viene caricato dalla credenziale selezionata.

## Modalità Agent e modalità Ask

Il pannello dispone di due modalità, attivabili tramite il chip **Agent / Ask** nell'intestazione del pannello.

| Modalità | Predefinita | Comportamento |
|------|---------|-----------|
| **Agent** | ✓ | Crea e modifica il canvas. L'IA genera un blocco JSON del workflow che viene applicato automaticamente al canvas al termine della risposta. |
| **Ask** | | Risponde solo a domande. Il canvas non viene mai modificato. Utilizzare questa modalità per porre domande sul proprio workflow, sulle funzionalità di Heym o per ottenere consigli senza attivare un aggiornamento del canvas. |

È possibile cambiare modalità in qualsiasi momento. La modifica della modalità non cancella la conversazione.

In modalità Agent, la casella **YOLO mode** sotto il campo del messaggio fa sì che l'assistente esegua e corregga ciò che costruisce. Consultare [Modalità YOLO](#yolo-mode).

## Utilizzo della chat

- Digitare la richiesta nel campo di input (es. "Crea un workflow che riceve input dall'utente e li invia a un LLM")
- Premere **Invio** per inviare (Shift+Invio per andare a capo)
- L'IA trasmette la risposta in streaming. In modalità **Agent**, se la risposta include un workflow in un blocco di codice \`\`\`json, questo viene analizzato automaticamente e applicato al canvas. In modalità **Ask** il canvas non viene mai modificato.
- Utilizzare **Clear** per reimpostare la conversazione
- Passare il cursore su un messaggio e fare clic sulla relativa icona di copia per copiare il testo visualizzato, incluso l'eventuale JSON del workflow
- Trascinare la linea sopra la casella del messaggio per aumentarne l'altezza. L'area di input può espandersi fino al 60% del pannello e torna all'altezza predefinita al ricaricamento della pagina

## Applicazione automatica del workflow

Quando la risposta dell'IA contiene un blocco JSON valido di un workflow (con `nodes` e, facoltativamente, `edges`) all'interno di un blocco di codice \`\`\`json, Heym:

1. Analizza il JSON dalla risposta
2. Sostituisce il canvas corrente con i nuovi nodi e le nuove connessioni
3. Riordina la disposizione dei nodi
4. Contrassegna il workflow come non salvato

Se l'analisi non riesce, viene visualizzato un pulsante **Retry** per rigenerare la risposta.
## Modifica di un singolo nodo

Passa con il mouse su un nodo sul canvas e fai clic su **AI** sopra di esso. Il pannello si apre in modalità Agent, focalizzato su quel nodo, e mostra quale nodo sta modificando:

| Il nodo ha... | Il pannello mostra |
|---|---|
| Nessun risultato nell'esecuzione corrente | **Modifying Node:** in una riga compatta con l'icona e il nome del nodo. L'assistente modifica solo dalla configurazione del nodo; esegui prima il nodo se deve vedere l'output |
| Un risultato nell'esecuzione corrente | **Modifying Node: (Has Node Output)** sopra il nodo stesso: icona, nome e tipo, ultimo stato e durata, e l'errore se fallito. L'assistente vede quell'output e l'errore quando modifica il nodo |

Passa il mouse sull'etichetta per vedere in quale stato si trova il pannello.

In qualunque stato si trovi il pannello, l'assistente legge anche la pagina di documentazione del nodo, quella dietro l'icona del libro nell'intestazione del nodo. La usa per comprendere le opzioni del nodo e per rispondere a domande su di esse.

Sotto i messaggi, tre opzioni avviano la richiesta:

| Opzione | Cosa fa |
|---|---|
| **Change this node as ...** | Riempie la casella di messaggio con *Cambia questo nodo in* per completare la frase |
| **Fix error in this node ...** | Riempie *Correggi l'errore in questo nodo.* L'assistente legge l'errore di questo nodo dall'ultima esecuzione |
| **Other** | Focalizza una casella di messaggio vuota |

Modifica il testo e premi **Send**. L'assistente restituisce solo questo nodo e Heym lo aggiorna sul posto: il nodo mantiene id, tipo e nome, in modo che espressioni come `$checkLinkedIn.result` in altri nodi continuino a funzionare. Altri nodi, connessioni e layout non cambiano, e **Undo** ripristina la configurazione precedente.

Se la richiesta non rientra nel nodo, ad esempio se richiede un altro tipo di nodo o un nuovo nodo, l'assistente indica cosa dovrebbe cambiare invece di modificare. Chiudi il focus del nodo con la **X** sulla scheda del nodo per modificare nuovamente l'intero workflow. Anche la chiusura del pannello cancella il focus.

La [modalità YOLO](#yolo-mode) funziona con un nodo focalizzato: l'assistente modifica il nodo, esegue il workflow e corregge il nodo finché l'esecuzione non ha esito positivo. In modalità **Ask** il focus indica all'assistente su quale nodo verte la domanda e il canvas non viene modificato.

## Modalità YOLO

La **modalità YOLO** consente all'assistente di testare ciò che costruisce. Selezionare la casella **Modalità YOLO** sotto il campo del messaggio, quindi inviare la richiesta. La casella compare esclusivamente in modalità Agent. È disattivata per impostazione predefinita e viene reimpostata su disattivata al ricaricamento della pagina. Passare il cursore sull'icona informativa accanto per visualizzare un breve riepilogo.

Con la modalità YOLO attiva, l'assistente non si arresta dopo aver applicato un workflow:

1. Applica il workflow al canvas.
2. Prima della prima esecuzione richiede gli input di test. La scheda elenca i campi di input del workflow, compilati con i valori suggeriti dall'assistente. Modificarli e premere **Esegui**. Le esecuzioni successive riutilizzano questi valori. La scheda ricompare solo quando i campi di input cambiano o l'assistente necessita di dati di test differenti.
3. Esegue il workflow sul canvas esattamente come il pulsante **Esegui**: le modifiche non salvate vengono salvate prima, i nodi si illuminano e l'esecuzione compare nel pannello Debug e nella [Cronologia esecuzioni](./execution-history.md).
4. Legge il risultato. Se l'esecuzione ha prodotto quanto richiesto, termina con **Verified** e un breve riepilogo. In caso contrario, corregge il workflow e lo esegue nuovamente.

Esegue al massimo **5 esecuzioni** per messaggio. Premere **Stop** in qualsiasi momento per terminare il ciclo e interrompere un'esecuzione in corso.

Ogni risposta mostra i propri passaggi man mano che si verificano:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, con una riga `Executing <node>` per ciascun nodo;
- il verdetto finale.

Dopo ogni esecuzione, una breve riga come *Attempt 1 result sent · error in 1.2s* indica che il risultato è stato restituito all'assistente.

### Esecuzione degli altri workflow

In modalità YOLO l'assistente può anche eseguire gli altri workflow quando necessita del loro risultato. Ad esempio, può verificare cosa restituisce un workflow prima di richiamarlo da un nodo [Execute](../nodes/execute-node.md). Tali esecuzioni compaiono come passaggi `Running workflow "<name>"...` e vengono registrate nella Cronologia esecuzioni con l'origine del trigger `ai_assistant`. Il workflow in fase di modifica viene sempre testato sul canvas.

### Interruzioni anticipate

| Situazione | Comportamento |
|---|---|
| L'assistente necessita di una decisione, di informazioni, di una credenziale o di una tabella dati | Richiede tramite la consueta scheda di domanda. La risposta prosegue il ciclo. |
| L'esecuzione attende una [revisione umana](./human-in-the-loop.md) | Il ciclo si arresta. Approvare la revisione, quindi inviare un messaggio. |
| Il workflow attende il caricamento di un file | Il ciclo si arresta. La modalità YOLO non può testare esecuzioni attivate da caricamento file. |
| Una versione più recente del workflow è stata salvata altrove | Il ciclo si arresta. Risolvere il conflitto di salvataggio, quindi inviare un messaggio. |

> **Le esecuzioni sono reali.** Email, messaggi e chiamate API nel workflow vengono effettivamente inviati a ogni tentativo, e i nodi DataTable scrivono righe reali. Ogni esecuzione salva il workflow, pertanto le versioni precedenti restano nella [Cronologia modifiche](./edit-history.md).

## Input vocale

Sui browser supportati, un pulsante **Voce** abilita la sintesi vocale in testo. Fare clic per avviare la registrazione, fare nuovamente clic per arrestarla. Il testo trascritto viene inviato all'IA per la correzione grammaticale prima dell'invio.

## Nodo Agent e Assistente IA

| | Nodo Agent | Assistente IA |
|---|------------|---------------|
| **Scopo** | Nodo LLM all'interno di un workflow; viene eseguito durante l'esecuzione | Interfaccia Chat per costruire workflow con linguaggio naturale |
| **Posizione** | Nodo sul canvas | Pannello Debug → pannello flottante |
| **Quando** | In fase di esecuzione | Durante la modifica |

Consultare [Nodo Agent](../nodes/agent-node.md) per il nodo del workflow che esegue chiamate LLM con strumenti e MCP.

## Funzionamento (AI Builder DSL)

L'Assistente IA è basato su un **workflow DSL** (linguaggio specifico del dominio) che descrive nodi, archi ed espressioni. Quando si invia un messaggio:

1. Il messaggio, insieme alle [Regole utente](./user-settings.md) e al workflow corrente (se presente), viene inviato al backend.
2. Il backend costruisce un **system prompt** che include:
   - Il workflow DSL completo (tipi di nodo, sintassi delle espressioni, regole, esempi)
   - Le Regole utente aggiunte come "User Custom Rules"
   - Il JSON del workflow corrente quando si modifica un workflow esistente
   - L'elenco dei workflow disponibili se si utilizza il nodo Execute
   - I nomi, i tipi e gli id delle credenziali possedute o condivise con l'utente (mai i relativi valori)
   - I nomi, gli id, le descrizioni e le colonne delle tabelle dati utilizzabili (mai le relative righe)
3. Il modello restituisce un singolo blocco JSON di workflow (con `nodes` ed `edges`). Il frontend lo analizza e lo applica al canvas.
### Credenziali

Quando un workflow necessita di una credenziale, l'assistente lo chiede prima di procedere alla sua creazione. Se sono disponibili credenziali di tipo idoneo, le elenca insieme all'opzione **Create a new credential**; in caso contrario, chiede se si desidera crearne una. Ogni domanda consente inoltre di proseguire senza alcuna credenziale.

Scegliendo di crearne una, si apre il modulo della credenziale nel pannello, preimpostato sul tipo corretto e su un nome suggerito. I valori vengono inviati direttamente a Heym; l'assistente apprende esclusivamente il nome e il tipo. Le credenziali OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) si connettono tramite popup, e qualora il popup venga bloccato compare un link alla pagina di autorizzazione. Una volta salvata la credenziale, la scheda ne mostra il nome e il pulsante di creazione si disattiva; premere **Submit answers** e l'assistente assegna la nuova credenziale al nodo.

È inoltre possibile richiedere una credenziale singolarmente ("create a GitHub credential") oppure chiedere di modificarne una esistente ("update my sheet credential", "reconnect my Google Sheets"). L'assistente risponde con la medesima scheda: la creazione apre un modulo vuoto, la modifica apre il modulo su quella credenziale con i relativi segreti mascherati.

L'assistente predilige un nodo dedicato. Quando nessun nodo copre un'operazione, come l'aggiunta di una scheda a un Google Sheet, ricorre a una richiesta HTTP e scrive la riga di intestazione per la credenziale scelta. Si veda [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Le domande di chiarimento di cui il workflow può fare a meno riportano **Optional** nel rispettivo input e possono essere saltate.

Il DSL impone etichette in camelCase, regole di espressione unificate e campi specifici per ciascun nodo. Se il valore di un campo è un singolo `$expr`, il backend preserva il tipo nativo; se il valore combina prosa e `$refs`, il risultato è una stringa. Rimane valida la regola del singolo `$`: nessun `$` all'interno delle parentesi. Le User Rules in [Settings](./user-settings.md) vengono iniettate in questo system prompt, affinché le preferenze dell'utente si applichino a ogni workflow generato dall'IA.

Se il workflow corrente contiene Agent skills, l'AI Assistant include nel contesto di quel workflow esclusivamente il `SKILL.md` di ciascuna skill. I file `.py` allegati e gli asset binari delle skill vengono rimossi prima della richiesta, affinché il builder rimanga entro i limiti di contesto del modello anche quando le skill contengono implementazioni di grandi dimensioni.

### Tabelle dati

Quando un workflow salva, memorizza o cerca record e non è stato indicato un altro archivio, l'assistente utilizza un nodo [DataTable](../nodes/datatable-node.md). Se si indica una delle proprie tabelle e questa dispone delle colonne necessarie al workflow, l'assistente la utilizza. In caso contrario, chiede quale tabella adottare. La scheda elenca le tabelle idonee, ciascuna con la propria descrizione e i tipi di colonna, oltre a **Create a new table** con un nome e delle colonne proposti. Vengono offerte anche le tabelle condivise con l'utente; una tabella di sola lettura viene offerta esclusivamente per la lettura.

Selezionare la nuova tabella e premere **Submit answers**: la scheda crea la tabella e l'assistente ne assegna l'id al nodo e utilizza i nomi esatti delle sue colonne. È inoltre possibile richiedere una tabella singolarmente, ad esempio "create a table for my leads".

L'assistente vede i nomi delle tabelle, le descrizioni e le colonne, mai le righe. Non modifica mai le colonne di una tabella esistente: se a una tabella manca una colonna necessaria al workflow, ne indica il nome e propone invece una nuova tabella. Le colonne si aggiungono nella [DataTable tab](../tabs/datatable-tab.md).

## Related

- [Why Heym](../getting-started/why-heym.md) – Natural-language building as the first stage of the agent lifecycle
- [Quick Start](../getting-started/quick-start.md) – Build your first workflow
- [Settings](./user-settings.md) – User Rules injected into AI Assistant system prompt
- [Chat with Heym](./chat-with-heym.md) – Page-aware assistant inside the documentation area
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes, and execution flow
- [Agent Node](../nodes/agent-node.md) – LLM node with tools and MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Add API keys for the AI Assistant
- [Workflow Structure](./workflow-structure.md) – JSON format for workflows
