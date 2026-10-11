# Quick Drawer

Il **Quick Drawer** è un pannello laterale destro per l'esecuzione rapida dei workflow. Compare sulle pagine autenticate quali la scheda [Workflows](../tabs/workflows-tab.md) della dashboard, la documentazione e le Valutazioni.

## Accesso

- Fare clic sul trigger fisso **Quick / Workflows** sul bordo centrale destro dello schermo
- Quando è disponibile anche il [Contextual Showcase](./contextual-showcase.md), il relativo trigger **Page Guide** si trova sopra Quick Workflows
- Il drawer si apre da destra e sposta la pagina corrente verso sinistra con un leggero ridimensionamento
- Su mobile, il Quick Drawer è nascosto
- Il drawer non viene mostrato nell'editor dei workflow, nelle pagine di login/registrazione, nel portale o nelle pagine di revisione HITL

## Ricerca dei Workflow

Utilizzare il campo filtro nella parte superiore del drawer per cercare i workflow per:

- Nome del workflow
- Descrizione del workflow

La ricerca non distingue tra maiuscole e minuscole e aggiorna l'elenco immediatamente.

## Workflow Aggiunti ai Preferiti

Aggiungere i workflow ai preferiti per mantenerli in cima al drawer.

- I workflow aggiunti ai preferiti compaiono in una sezione dedicata sopra l'elenco completo
- I nuovi preferiti vengono aggiunti in cima
- L'ordine dei preferiti viene preservato tra i ricaricamenti nella memoria del browser

## Esecuzione dei Workflow

Selezionare un workflow per aprire il relativo modulo di input.

- I campi di input sono mostrati verticalmente nell'ordine del drawer
- Fare clic su **Run Workflow** per eseguire il workflow selezionato
- Fare clic su **Stop Workflow** per annullare un'esecuzione in corso dal drawer
- I workflow privi di campi di Input possono comunque essere eseguiti direttamente

Il drawer utilizza la stessa API di esecuzione dei workflow delle altre superfici di esecuzione di Heym, pertanto gli output e il comportamento di runtime rimangono coerenti.

L'arresto di un'esecuzione dal drawer annulla anche l'esecuzione attiva sul backend, incluso qualsiasi job Playwright in corso per quella determinata esecuzione del workflow.

## Avanzamento e Risultati

Dopo aver avviato un'esecuzione, il drawer mostra:

- L'avanzamento in streaming dei passaggi dei nodi man mano che vengono avviati e completati
- Lo stato finale: `success`, `error` o `pending`
- Gli output finali in un pannello JSON compatto
- Le voci della Cronologia contrassegnate con `Quick Drawer`

`pending` indica che il workflow è in attesa di un'azione successiva, come una revisione umana.

## Memoria del Browser

Il Quick Drawer memorizza le preferenze personali in `localStorage`:

- Gli ID dei workflow aggiunti ai preferiti
- L'ultimo workflow selezionato

In questa versione, il drawer **non** persiste i valori di input.

## Ambito

Il Quick Drawer è intenzionalmente una superficie di esecuzione leggera.

- Incluso: ricerca, aggiunta ai preferiti, selezione, input, esecuzione, avanzamento, risultato
- Escluso: creazione di workflow, modifica, gestione delle cartelle e azioni sul canvas

## Correlati

- [Scheda Workflows](../tabs/workflows-tab.md) – Elenco principale dei workflow, cartelle e gestione
- [Quick Start](../getting-started/quick-start.md) – Creare ed eseguire il primo workflow
- [Cronologia delle Esecuzioni](./execution-history.md) – Consultare le esecuzioni passate
- [Webhooks](./webhooks.md) – Attivare i workflow tramite HTTP
- [Contextual Showcase](./contextual-showcase.md) – Barra di guida a livello di pagina che integra il Quick Drawer