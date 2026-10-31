# Scheda Valutazioni

La scheda **Valutazioni** è una pagina separata disponibile all'indirizzo `/evals`. Consente di creare suite di valutazione, definire casi di test ed eseguire valutazioni sui workflow [Agent](../nodes/agent-node.md). Una [suite di agenti](#agent-suites) esegue un agente o ne legge le esecuzioni reali, controllando gli strumenti chiamati, la latenza, il costo in USD, i token e il numero di chiamate agli strumenti.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Accesso

- Fare clic su **Valutazioni** nella barra delle schede della dashboard
- Oppure navigare verso `/evals`
- Oppure utilizzare **Ctrl+K** (Cmd+K) e selezionare "Evals" dalla palette dei comandi

## Suite di valutazione

- **Nuova suite** – Scelga **Suite di prompt** per testare un prompt di sistema tra più modelli, o **Suite di agenti** per verificare le esecuzioni reali di un agente (vedere [Suite di agenti](#agent-suites))
- **Selettore suite** – Elenca le suite di prompt e di agenti con il tipo accanto a ciascun nome; digiti per cercare
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
- **Impostazioni memorizzate** – Una suite si apre con le impostazioni della sua esecuzione più recente: credenziale, modelli, metodo di punteggio e giudice, temperatura, sforzo di ragionamento ed esecuzioni per test. L'apertura di un'esecuzione passata ne carica le impostazioni, consentendo a **Riesegui valutazioni** di ripeterla
- **Temperature** – Impostare la temperature del modello (`Exact Match` e `Contains`)
- **Sforzo di ragionamento** – Imposti lo sforzo di ragionamento per i modelli di ragionamento, da Basso a Molto alto e Max esattamente come nei nodi LLM e Agent (`Exact Match` e `Contains`)

### LLM-as-Judge

Con un judge, ogni modello risponde all'input di test con il solo prompt della suite, quindi il judge valuta quanto la risposta corrisponda all'output atteso, da 0 a 100:

- **Un judge basato su modello** (OpenAI, OpenAI compatible o Gemini) legge la domanda, l'output atteso e la risposta, e restituisce un punteggio con una motivazione di una riga. Viene eseguito a temperature `0`, oppure a reasoning effort `low` per un modello di reasoning, così la stessa risposta ottiene lo stesso verdetto.
- **Un judge basato su decision model** valuta la risposta secondo una rubrica a cinque livelli, da *Completamente fuori tema* a *Corrispondenza piena*. Il punteggio è la posizione ponderata per probabilità su tale rubrica, quindi deriva da una distribuzione calcolata dal modello anziché da un numero da esso scritto.

La scheda al passaggio del mouse sulla cella mostra la motivazione del giudice oppure, per un modello decisionale, il livello, il punteggio e la relativa confidenza. Latenza e token descrivono il modello testato; le chiamate del giudice stesso compaiono in [Tracce](./traces-tab.md) sotto l'origine **Valutazioni**. Il selettore del giudice esclude le credenziali Model Router, poiché un giudice deve essere un unico modello fisso. La credenziale per i modelli testati può essere un [Model Router](../reference/credentials.md#model-router-auto-model): il suo modello **Auto** seleziona un modello per richiesta, esattamente come all'interno di un workflow.

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

## Agent Suites

Una suite di agenti verifica un nodo [Agent](../nodes/agent-node.md) rispetto alle sue esecuzioni. Le legge da [Tracce](./traces-tab.md), dove ogni esecuzione registra già tempo, token, costo e chiamate agli strumenti, e può inoltre eseguire il workflow al Suo posto.

Ne crei una con **Nuova suite** → **Suite di agenti** seguendo tre passaggi:

1. **Agente** – Scelga il workflow e successivamente il relativo nodo agente. Vengono elencati solo i workflow dotati di un nodo agente; un workflow o un agente non ancora eseguito viene mostrato ma non può essere selezionato. Le impostazioni dell'agente selezionato (modello, istruzioni, strumenti e limiti) compaiono a destra, mentre sotto viene visualizzato un canvas di sola lettura del suo workflow con l'agente evidenziato.
2. **Baseline** – Le ultime 10 esecuzioni dell'agente: latenza p50 e p95, costo per esecuzione, token per esecuzione e chiamate agli strumenti per esecuzione, quali strumenti sono stati chiamati e con quale frequenza, oltre ai valori specifici di ciascuna esecuzione. Le esecuzioni terminate con un errore sono elencate ma escluse dalla baseline.
3. **Controlli** – Contrassegni ciascuno strumento come **Must call**, **Must not call** o **Either**. Ogni genere di chiamata è elencato con il relativo tipo: strumenti Python e di nodo, strumenti **MCP** con il relativo server, **sub-agenti** per etichetta, **sub-workflow** per nome e **skills**. Ne aggiunga uno per tipo e nome qualora non sia stato ancora eseguito e lo rimuova tramite la relativa **X**. Imposti soglie massime per latenza, costo, token totali e chiamate agli strumenti; ciascuna parte dal 20% oltre il p95 della baseline e può essere disattivata.

Una suite salvata si apre su **Risultati**, con **Baseline** e **Modifica controlli** accanto:

- **Esegui il workflow** – Scelga il numero di esecuzioni (fino a 20); ne vengono eseguite quattro contemporaneamente. Gli input vengono precompilati dall'esecuzione più recente del workflow, possono essere modificati e vengono utilizzati da ciascuna esecuzione. Attivi **Genera input** (l'icona a scintilla), quindi scelga una credenziale e un modello affinché il modello generi un input differente per ogni esecuzione. Legge le istruzioni di sistema dell'agente e rimane vicino ai valori digitati: digitando il nome di una città si ottengono altri nomi di città. Ciascuna esecuzione elabora l'intero workflow come ogni normale esecuzione e compare nella Cronologia esecuzioni con il trigger `agent_suite`. Per saltare passaggi successivi, come l'invio di un'e-mail, apra il workflow con **Vai al workflow** nel pannello e disabiliti preventivamente tali nodi. **Interrompi** conclude l'esecuzione della suite: non vengono avviate nuove esecuzioni e quelle in corso vengono annullate. Un'esecuzione di suite il cui server si è arrestato, ad esempio durante un riavvio, viene segnalata come interrotta dopo un minuto anziché rimanere bloccata.
- **Risultati** – Per impostazione predefinita viene valutata l'ultima esecuzione della suite. Ogni esecuzione della suite viene conservata con la relativa data nel selettore delle esecuzioni, da cui è possibile aprirla o eliminarla; oppure passi alle ultime 10, 20 o 50 esecuzioni dell'agente per includere le altre sue esecuzioni. Può visualizzare la percentuale di superamento, la frequenza di successo di ciascun controllo, latenza, costo, token e chiamate agli strumenti accanto alla baseline salvata, nonché ciascuna esecuzione con il motivo del fallimento e un collegamento alla relativa traccia.
- **Vai al workflow** apre il workflow dell'agente in una nuova scheda. Nel campo del nome, **Esc** o la **X** cancella il testo.

Come vengono interpretati i dati:

- La **latenza** corrisponde al tempo del modello sommato al tempo delle chiamate agli strumenti dell'esecuzione.
- Il **costo** applica gli stessi prezzi delle Tracce. L'esecuzione di un modello privo di prezzo salta il controllo del costo anziché fallire.
- Un'esecuzione **supera** il test quando termina senza errori e ogni controllo risulta soddisfatto.
- La suite legge unicamente le Sue tracce, secondo la medesima regola della scheda Tracce.
- **Usa le ultime esecuzioni come baseline** in **Modifica controlli** sostituisce la baseline salvata con le esecuzioni più recenti dell'agente.

La baseline di una suite proviene da una di tre sorgenti. **Modifica controlli** mostra quale sia attiva accanto a **Baseline salvata**:

- le ultime esecuzioni dell'agente (impostazione predefinita, utilizzata da **Usa le ultime esecuzioni come baseline**),
- un'esecuzione di suite completata,
- numeri immessi manualmente.

Le ultime due opzioni si impostano da [Chat](./chat-tab.md#working-with-evals) o tramite API:

- `PATCH /api/evals/agent-suites/{id}` accetta `baseline: {"source": "suite_run", "run_id": "…"}` o `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` accetta `inputs_list`: un oggetto di input per esecuzione, fino a 20.

### Da Chat e MCP

[Chat](./chat-tab.md#working-with-evals) e lo strumento MCP `heym_chat` possono creare, modificare ed eseguire suite di prompt e di agenti:

- Formulano autonomamente casi di test e input di esecuzione.
- Chiedono quale credenziale utilizzare prima di creare una suite di prompt, a meno che una sola non sia idonea.
- Collegano ogni suite menzionata in questa pagina.

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
