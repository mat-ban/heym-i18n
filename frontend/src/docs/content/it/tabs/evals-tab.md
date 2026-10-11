# Scheda Valutazioni

La scheda **Valutazioni** è una pagina separata disponibile all'indirizzo `/evals`. Consente di creare suite di valutazione, definire casi di test ed eseguire valutazioni sui workflow [Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Accesso

- Fare clic su **Valutazioni** nella barra delle schede della dashboard
- Oppure navigare verso `/evals`
- Oppure utilizzare **Ctrl+K** (Cmd+K) e selezionare "Evals" dalla palette dei comandi

## Suite di valutazione

- **Crea suite** – Definire una suite con nome e descrizione
- **Seleziona workflow** – Scegliere il workflow da valutare
- **Seleziona credenziale** – Chiave API per l'esecuzione del workflow
- **System prompt** – Modificare il system prompt a livello di suite direttamente nel pannello sinistro
- **Optimize Prompt** – Richiedere a un LLM di migliorare il system prompt corrente

## Casi di test

- Aggiungere casi di test con prompt di input e output attesi
- Ogni caso può avere un valore atteso personalizzato per il confronto
- Modificare o eliminare i casi dalla suite
- **Generate Test Data** – Utilizzare la credenziale/modello selezionato per creare automaticamente casi di test a partire dal prompt della suite

## Esecuzione delle valutazioni

- **Seleziona uno o più modelli** – Eseguire la stessa suite su più modelli in un'unica valutazione
- **Metodo di scoring** – Scegliere `Exact Match`, `Contains` o `LLM-as-Judge`
- **Judge** – Per `LLM-as-Judge`, selezionare facoltativamente una credenziale OpenAI, OpenAI compatible (Custom), Gemini (Google) o [Decision Model](../nodes/decision-node.md) e digitare il modello del judge (ad esempio `gpt-4o-mini` o `jev-latest`) per eseguire lo scoring con un judge indipendente
- **Esecuzioni per test** – Ripetere ogni caso di test più volte in un'unica esecuzione
- **Temperature** – Impostare la temperature del modello (`Exact Match` e `Contains`)
- **Reasoning effort** – Impostare il reasoning effort per i modelli di reasoning (`Exact Match` e `Contains`)

### LLM-as-Judge

Con un judge, ogni modello risponde all'input di test con il solo prompt della suite, quindi il judge valuta quanto la risposta corrisponda all'output atteso, da 0 a 100:

- **Un judge basato su modello** (OpenAI, OpenAI compatible o Gemini) legge la domanda, l'output atteso e la risposta, e restituisce un punteggio con una motivazione di una riga. Viene eseguito a temperature `0`, oppure a reasoning effort `low` per un modello di reasoning, così la stessa risposta ottiene lo stesso verdetto.
- **Un judge basato su decision model** valuta la risposta secondo una rubrica a cinque livelli, da *Completamente fuori tema* a *Corrispondenza piena*. Il punteggio è la posizione ponderata per probabilità su tale rubrica, quindi deriva da una distribuzione calcolata dal modello anziché da un numero da esso scritto.

La scheda di hover della cella mostra la motivazione del judge oppure, per un decision model, il livello, il punteggio e la relativa confidenza. Latenza e token descrivono il modello in esame; le chiamate del judge stesso compaiono in [Tracce](./traces-tab.md) sotto la sorgente **Evals**. Il selettore dei modelli esclude le credenziali Model Router, poiché una valutazione confronta modelli specifici.

In assenza di un judge, ogni modello risponde e valuta la propria risposta in un'unica richiesta.

In questa modalità Temperature e reasoning effort sono nascosti e l'esecuzione utilizza impostazioni fisse: temperature `0.7` per i modelli standard e reasoning effort `medium` per i modelli di reasoning (`low` quando valutano le proprie risposte).

## Risultati

- Visualizzare superato/non superato per ogni caso di test
- Ispezionare gli output effettivi rispetto a quelli attesi
- Confrontare gli output per modello affiancati quando un'esecuzione include più modelli
- Consultare la cronologia delle esecuzioni per le valutazioni passate; un'esecuzione `LLM-as-Judge` mostra il proprio modello judge nell'elenco della cronologia
- Aprire le esecuzioni storiche dal pannello dei risultati e ispezionare gli snapshot salvati di prompt/input/output
- L'apertura di un'esecuzione passata carica il relativo metodo di scoring e judge nel pannello sinistro, così **Re-Run Evals** ripete la stessa valutazione
- **Export** scarica l'esecuzione in formato JSON, inclusi `judge_credential_id` e `judge_model`

## Idee per la matrice di benchmark

Quando si costruisce una matrice di benchmark per workflow di agenti, includere gli scenari HITL come casi di prima classe anziché trattarli come casi limite.

- Coprire tutte e tre le decisioni di revisione: `accepted`, `edited` e `refused`
- Includere più sorgenti di trigger quali esecuzioni dall'editor, portale, curl/webhook ed esecuzioni attivate da cron
- Aggiungere scenari di revisione ripetuta in cui un'esecuzione dell'agente si mette in pausa più di una volta
- Verificare i rami di notifica collegati all'output `review` dell'agente
- Verificare il comportamento a valle dopo un rifiuto, soprattutto se i nodi successivi diramano su `$agent.decision`

## Correlati

- [Why Heym](../getting-started/why-heym.md) – Le Valutazioni come fase di test del ciclo di vita dell'agente
- [Agent Node](../nodes/agent-node.md) – Workflow oggetto di valutazione
- [Scheda Credenziali](./credentials-tab.md) – Credenziali per le esecuzioni di valutazione
- [Scheda Tracce](./traces-tab.md) – Ispezione dettagliata delle tracce
- [Scheda Workflows](./workflows-tab.md) – Creare workflow da valutare
- [Cronologia esecuzioni](../reference/execution-history.md) – Visualizzare le esecuzioni passate (pulsante History nell'intestazione)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta della pagina disponibile nella pagina delle valutazioni
