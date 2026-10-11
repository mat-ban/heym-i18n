# Scheda Tracce

La scheda **Tracce** mostra le tracce di esecuzione LLM. Consente di ispezionare i payload di richiesta/risposta, i tempi, le chiamate agli strumenti e di eseguire il debug del comportamento dei nodi [Agent](../nodes/agent-node.md) e [LLM](../reference/node-types.md), oltre a metriche aggregate (chiamate, token, costo, latenza, tasso di errore) su qualsiasi intervallo temporale.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>

## Intestazione statistiche

La pagina si apre con un riepilogo statistico sopra l'elenco delle tracce, calcolato sull'intervallo temporale selezionato e sugli altri filtri attivi:

- **Schede KPI** – Chiamate totali, Token totali, Costo totale (USD), Latenza media, % errori
- **Token per modello** – Grafico a ciambella del volume di token per modello
- **Costo per modello** – Grafico a ciambella della spesa in USD per modello. I modelli privi di prezzi mostrano un link "Configure pricing" alla [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Chiamate nel tempo** – Grafico ad area in pila delle chiamate riuscite rispetto a quelle fallite per intervallo (5 min / 1 h / 6 h / 1 giorno, scelto automaticamente in base all'intervallo)
- **Avviso modelli senza prezzi** – Compare sotto i grafici quando alcuni modelli tracciati non hanno una riga di prezzo, con link alla LLM Cost Table

## Intervallo temporale

Un unico selettore **Time range** nella parte superiore della barra dei filtri controlla sia l'intestazione statistiche sia l'elenco delle tracce. Opzioni: Ultima 1 ora, Ultime 24 ore, Ultimi 7 giorni (predefinito), Ultimi 30 giorni, Tutto il periodo. La modifica dell'intervallo reimposta la paginazione e ricarica insieme grafici ed elenco.

## Elenco tracce

- Elenco paginato delle tracce recenti all'interno dell'intervallo temporale selezionato
- Ogni traccia mostra: workflow, nodo, credenziale, timestamp, durata
- Fare clic su una traccia per aprire la vista di dettaglio
- Usare **Prev / Next** all'interno della finestra di dettaglio per spostarsi tra le tracce senza chiuderla

## Filtraggio

- **Time range** – 1h / 24h / 7d / 30d / Tutto; filtra insieme grafici ed elenco
- **Credential** – Filtra per credenziale (API key) utilizzata
- **Source** – Filtra per workflow o origine dell'esecuzione
- **Search** – Cerca per modello, workflow, credenziale o etichetta del nodo
- **Refresh** – Ricarica la pagina corrente delle tracce

## Dettaglio traccia

All'apertura di una traccia:

- **Steps** – Una timeline dall'alto verso il basso che legge la traccia come una catena ordinata: System → User → Assistant → Tool → Answer. Ogni step è comprimibile; espandendone uno si mostra un dettaglio leggibile (testo del messaggio, oppure argomenti e risultato di uno strumento) seguito dal JSON di quello step. Il contenuto JSON in ogni tipo di evento—incluse le chiamate MCP e i payload JSON-RPC—si apre per impostazione predefinita in un albero espandibile, con il primo livello espanso. Usare **Tree / Raw** per passare tra la struttura formattata e il testo originale. Il JSON malformato rimane visibile come testo semplice. Gli step degli strumenti mostrano la loro durata e un badge MCP/Skill ove applicabile, oltre ai badge pending / timeout / cancelled quando lo stato della chiamata allo strumento è impostato. Lo step Answer può mostrare badge aggregati `tool_metrics` (conteggi delle chiamate per stato e durata totale degli strumenti). Quando una traccia registra ogni chiamata al modello, come fanno un messaggio di Dashboard Chat e un agente instradato, uno step **LLM** si colloca prima degli strumenti richiesti dalla chiamata, e il **Duration Breakdown** dispone ogni chiamata al modello, strumento e decisione di instradamento su un'unica timeline. Un messaggio di Dashboard Chat è una singola traccia, indipendentemente dal numero di round di strumenti necessari. Le tracce prive di catena di messaggi (ad esempio la generazione di immagini) mostrano una timeline minimale Request → Response.
- **Request** – Payload completo della richiesta inviata all'LLM, con viste JSON **Tree / Raw**
- **Response** – Risposta del modello, incluse eventuali chiamate agli strumenti, con viste JSON **Tree / Raw**
- **Tool metrics** – Quando presenti sulla risposta, un riepilogo compatto dei conteggi delle chiamate agli strumenti (`success` / `error` / `pending` / `timeout` / `cancelled`) e della durata totale degli strumenti
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` per l'analisi delle prestazioni
- **Tool calls** – Nome dello strumento, argomenti, risultato, stato e tempo trascorso
- **Skills included** – Skills passate al modello nella richiesta
- **Go to Workflow** – Passa direttamente al workflow correlato dalla finestra di dettaglio della traccia

## Copia ed esportazione

- Copiare il JSON di richiesta o risposta negli appunti; la copia utilizza sempre il payload raw completo indipendentemente dalla vista attiva
- Utile per il debug o la condivisione con il supporto

## Manutenzione

- **Clear All** – Elimina tutte le tracce salvate dopo conferma
- I controlli di paginazione mostrano l'intervallo attualmente visibile (ad esempio `1-25 of 240`)

## Correlati

- [Why Heym](../getting-started/why-heym.md) – Osservabilità LLM lungo il ciclo di vita dell'agente
- [Agent Node](../nodes/agent-node.md) – Nodo Agent con chiamata agli strumenti
- [Node Types](../reference/node-types.md) – Nodi LLM e Agent
- [Credentials Tab](./credentials-tab.md) – Credenziali utilizzate nelle tracce
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Esportazione OTel opt-in per span di workflow, nodi e strumenti dell'Agent
- [DataTable Tab](./datatable-tab.md) – Ospita la LLM Cost Table utilizzata dal grafico dei costi
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alla pagina per le superfici della dashboard
