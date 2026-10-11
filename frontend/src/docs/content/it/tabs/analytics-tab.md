# Scheda Analytics

La scheda **Analytics** mostra metriche di esecuzione e tendenze per i workflow. Monitorare l'utilizzo, le prestazioni e identificare i colli di bottiglia.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Guarda la demo di Analytics</a></p>

## Statistiche di riepilogo

- **Esecuzioni totali** – Conteggio delle esecuzioni dei workflow nel periodo selezionato
- **Tasso di successo** – Percentuale di esecuzioni riuscite
- **Durata media** – Tempo medio di esecuzione
- **Tempo risparmiato** – Tempo totale stimato risparmiato: i minuti risparmiati per esecuzione configurati per ciascun workflow × le sue esecuzioni riuscite, sommati nell'intervallo selezionato
- **Tendenze** – Indicatori di aumento/diminuzione rispetto al periodo precedente

## Intervallo temporale

- **24h** – Ultime 24 ore
- **7d** – Ultimi 7 giorni
- **30d** – Ultimi 30 giorni
- **All** – Intera cronologia disponibile

## Filtro workflow

- Filtrare le metriche per uno specifico workflow
- **Tutti i workflow** – Aggregazione su tutti i workflow

## Tabelle

Due tabelle mostrano l'utilizzo dei workflow: **Più utilizzati** (più ampia) e **Più falliti**.

- **Tempo risparmiato** – La tabella Più utilizzati mostra il tempo risparmiato sommato per ciascun workflow (minuti risparmiati per esecuzione × esecuzioni riuscite). **Non impostato** indica che la stima è mancante; fare clic per aprire quel campo sul workflow.
- **Colonne ordinabili** – Fare clic sull'intestazione di una colonna per ordinare in base a quella colonna. Fare clic di nuovo per alternare ordine crescente/decrescente. Gli indicatori a freccia mostrano la direzione dell'ordinamento.
- **Etichette per dispositivi mobili** – Su schermi piccoli, le etichette delle colonne vengono abbreviate (es. "Executions" → "Runs", "Success" → "OK", "Error" → "Err") in modo che le tabelle si adattino senza scorrimento orizzontale.

## Grafici

- **Volume di esecuzione nel tempo** – Grafico a linee delle esecuzioni per intervallo temporale
- **Tasso di successo vs errore** – Grafico ad area che confronta le esecuzioni riuscite e quelle fallite
- **Latenza media nel tempo** – Grafico a linee che mostra le variazioni dei tempi di risposta
- **Trascinare per selezionare** – Fare clic e trascinare su qualsiasi grafico per focalizzare un intervallo di date personalizzato
- **Modalità di selezione** – Gli intervalli selezionati aggiornano le schede di riepilogo, i grafici e le tabelle dei workflow senza modificare il preset di base
- **Cancella selezione** – Tornare all'intervallo temporale predefinito al termine dell'analisi approfondita

## Aggiornamento automatico

- Abilitare l'aggiornamento automatico per mantenere le metriche aggiornate senza ricaricare manualmente

## Correlati

- [Scheda Workflows](./workflows-tab.md) – Workflow misurati
- [Scheda Traces](./traces-tab.md) – Ispezione dettagliata delle tracce
- [Scheda Logs](./logs-tab.md) – Log di runtime per il debug
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alle pagine per le superfici della dashboard

Quando un grafico mostra una tendenza sulla quale si desidera essere avvisati anziché monitorarla, trasformarla in un [avviso](./alerts-tab.md): conteggio errori, durata dell'esecuzione, spesa LLM e conteggio delle esecuzioni possono tutti ricevere una soglia su una finestra temporale.
