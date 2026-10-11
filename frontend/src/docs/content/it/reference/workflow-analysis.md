# Analisi del Workflow

**Analisi del Workflow** è un pannello laterale sinistro che contiene un documento Markdown condiviso e modificabile per ciascun workflow. Lo si utilizza per spiegare cosa fa un workflow e per raccogliere idee di miglioramento — lasciando che l'IA generi una prima bozza.

Il documento è condiviso: chiunque abbia accesso al workflow può leggerlo e modificarlo. È memorizzato insieme al workflow ed eliminato automaticamente quando il workflow viene eliminato.

## Apertura del pannello

1. Aprire un workflow nell'editor.
2. Fare clic su **Analyze** (icona Sparkles) nella barra degli strumenti dell'editor.
3. Il pannello si apre a sinistra. La palette dei nodi (pannello sinistro) si comprime mentre il pannello è aperto; riaprendo la palette dei nodi si chiude il pannello di analisi.

Il pannello è disponibile solo per i workflow salvati. Su un workflow nuovo e non ancora salvato, occorre salvarlo prima.

## Il documento

Il pannello mostra un singolo documento Markdown con due viste, commutabili tramite i pulsanti **Edit** (matita) e **Preview** (occhio):

| Vista | Scopo |
|------|---------|
| **Edit** | Editor Markdown semplice (textarea). |
| **Preview** | Markdown renderizzato. |

L'intestazione mostra **chi ha modificato** il documento per ultimo e quando.

### Salvataggio

Fare clic su **Save** per rendere persistenti le modifiche. Il salvataggio è abilitato solo in presenza di modifiche non salvate.

Poiché il documento è condiviso, i salvataggi utilizzano la concorrenza ottimistica:

- Se qualcun altro ha salvato una versione più recente dopo l'apertura del pannello, il salvataggio viene rifiutato e compare un avviso che indica il nome dell'altro editor.
- È quindi possibile scegliere **Reload (discard mine)** per adottare la versione del server, oppure **Overwrite** per forzare il salvataggio della propria versione sovrascrivendo la loro.

## Analisi IA

Selezionare una **Credential** LLM e un **Model** nella parte superiore del pannello (l'elenco dei modelli viene caricato dalla credenziale selezionata — vedere [Credentials](../tabs/credentials-tab.md)). Quindi avviare l'analisi:

- **Analyze my workflow** — mostrato quando il documento è vuoto. Trasmette in streaming un report Markdown generato dall'IA direttamente nell'editor come bozza non salvata. Rivederlo e modificarlo, quindi fare clic su **Save**.
- **Reanalyze** — mostrato quando il documento contiene già del contenuto. Trasmette in streaming un nuovo report in un'**anteprima** separata, lasciando intatto il documento corrente. Scegliere **Accept** per sostituire il contenuto dell'editor con la nuova analisi, oppure **Discard** per mantenere quello esistente.

Entrambe le azioni **eseguono prima il workflow** (quando è valido ed eseguibile) e includono i risultati dell'esecuzione nel prompt di analisi, affinché il report rifletta il comportamento effettivo del workflow. Se il workflow non può essere eseguito, l'analisi procede dalla sua struttura statica.

Il report generato copre tre sezioni, nell'ordine: **Improvement areas** (suggerimenti concreti, inclusa una prospettiva di **security** ogni volta che il workflow tocca credenziali, input utente, richieste esterne o esposizione di dati), lo **Purpose** del workflow e **What it does** (una descrizione dettagliata passo per passo dei nodi).

La sezione **Improvement areas** esegue sempre quattro verifiche esplicite:

1. **Error coverage** — se il canvas non contiene alcun nodo [Error Handler](../nodes/error-handler-node.md) e non è configurato alcun workflow di errore, il report lo segnala e raccomanda di aggiungere una gestione degli errori.
2. **Time saved** — se non è impostato un tempo stimato risparmiato per esecuzione, il report raccomanda di configurarne uno affinché la metrica **Time Saved** di [Analytics](../tabs/analytics-tab.md) possa essere popolata.
3. **Network nodes** — per i nodi che effettuano chiamate di rete (come [HTTP](../nodes/http-node.md) e i nodi di integrazione), il report raccomanda una gestione degli errori specifica per il nodo (retry e/o continue-on-error) su tali nodi.
4. **Alerts** — quando non sono configurati [alerts](../tabs/alerts-tab.md) per il workflow, il report raccomanda di impostare gli avvisi prima del passaggio in produzione.

### Esecuzione dell'Analyzer dalle Properties

Quando un workflow presenta nodi sul canvas ma non ancora un documento di analisi, nella sezione [Properties](./canvas-features.md) a livello di workflow (mostrata quando nessun nodo è selezionato) compare un pulsante **Run Analyzer**. Esso apre questo pannello di Analisi del Workflow, consentendo di selezionare una credenziale e un modello e di generare il report.

Ogni esecuzione dell'analisi viene registrata in [Traces](../tabs/traces-tab.md) sotto la sorgente **Workflow Analysis**.

Se non è configurata alcuna credenziale LLM, il pulsante Analyze è disabilitato — aggiungerne una nella [Credentials Tab](../tabs/credentials-tab.md).

## Correlati

- [AI Assistant](./ai-assistant.md) — genera o modifica i nodi del workflow a partire dal linguaggio naturale.
- [Sticky Note](../nodes/sticky-note-node.md) — per brevi note fissate direttamente sul canvas.