# Board

La scheda **Board** è una kanban board agentica. Il lavoro avanza attraverso le colonne e ciascuna
colonna può eseguire workflow Heym. Una card non è soltanto un'attività — è un job agentico persistente
che trasporta contesto, cronologia della conversazione, stato di esecuzione, output
ed esecuzioni dei workflow.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Board e colonne

- È possibile creare tutte le board necessarie. Una nuova board viene inizializzata con le colonne
  predefinite **Backlog → Planning → Development → Done**.
- Ogni board richiede un **Agentic Kanban Model** (una credenziale più un modello). È
  obbligatorio — la finestra di creazione di una nuova board non consente di crearla senza, e una board
  che ne è priva mantiene le proprie azioni disabilitate — poiché è il modello che mappa ciascuna
  card negli input dei workflow eseguiti e riconverte il loro output in
  testo leggibile.
- L'icona a ingranaggio nell'intestazione della board apre le impostazioni della board: nome, descrizione
  (visualizzata sotto l'intestazione) e l'Agentic Kanban Model.
- Le colonne sono completamente modificabili: aggiungere, rinominare, ricolorare, riordinare o eliminare dal
  pannello delle impostazioni della colonna (una colonna deve essere vuota prima di poter essere eliminata).
- Le card sono ordinate verticalmente per priorità — trascinare per riordinare.
- È inoltre possibile creare una card dalla [scheda Chat](./chat-tab.md) con una richiesta
  in linguaggio naturale. La Chat richiede di selezionare una board quando necessario e aggiunge sempre la card alla
  prima colonna di quella board.

## Condivisione di una board

Le impostazioni della board consentono anche di condividerla con **utenti** (tramite email) e con
**team**, con permesso `read` o `write`:

- **read** — la board e le sue card sono visibili, ma nulla può essere modificato: nessuna nuova
  card, nessuno spostamento, nessun commento, nessuna esecuzione.
- **write** — utilizzo completo della board: card, spostamenti, commenti ed esecuzioni.
- Solo il **proprietario** visualizza l'ingranaggio e i pulsanti di eliminazione, e solo il proprietario può modificare
  le impostazioni della board, il suo Agentic Kanban Model o le sue condivisioni.

Le catene su una board condivisa vengono sempre eseguite con le credenziali e l'Agentic Kanban
Model del **proprietario**, quindi i collaboratori non necessitano mai dei propri.

## Allegati delle card

Aprire una card e utilizzare **Attach file** per aggiungere file — trascinarli nel riquadro o selezionarli
con il pulsante, e rimuoverli dallo stesso elenco. Gli allegati sono archiviati in
[Drive](./drive-tab.md).

Ogni esecuzione **risolve gli allegati prima dell'avvio dei workflow**, in base al tipo:

- **Documenti** (pdf, markdown, csv, json, testo) vengono estratti in testo, con un limite di 20.000
  caratteri per file, nel campo `text` dell'allegato.
- **Immagini** vengono passate come `url` che il percorso vision carica direttamente (l'input immagine di un Nodo LLM
  lo accetta così com'è).
- **Qualsiasi altro elemento** viene passato come riferimento semplice (`name`, `url`, `mime_type`).

I workflow li leggono in `$input.card.attachments` (e sempre in `$input.board.attachments`,
indipendentemente da ciò che il mapper ha mappato). L'Agentic Kanban Model visualizza anche il testo estratto e gli URL
delle immagini, così può mappare un allegato direttamente nel campo previsto da un workflow.

## Catene di workflow delle colonne

Ciascuna colonna può essere configurata con un **elenco ordinato di workflow** (la catena).
Quando una card si sposta in una colonna che ha una catena:

1. La catena si avvia automaticamente in background — lo spostamento stesso non attende mai.
2. I workflow vengono eseguiti **in sequenza**. L'output di ciascun workflow viene aggiunto al contesto
   della card prima dell'avvio del successivo.
3. Se un workflow fallisce, la catena si interrompe: i collegamenti rimanenti vengono saltati e la
   card diventa **rossa**.
4. Quando ogni collegamento ha successo, la card diventa **verde**. Mentre la catena è in esecuzione
   la card pulsa in **ambra**; un'esecuzione in pausa per revisione umana mostra uno stato ambra
   statico.

Le esecuzioni sono registrate in [Execution History](../reference/execution-history.md) con
l'origine del trigger `board`, e ciascuna card mantiene il proprio elenco di esecuzioni con output ed errori
per singolo workflow. Aprire una card mentre un workflow è in esecuzione e scegliere **Open live** accanto
all'esecuzione per collegare l'editor a quella specifica esecuzione. La stessa animazione del canvas, i log di Debug
incrementali e il risultato finale vengono visualizzati senza avviare una seconda esecuzione.

## Cosa ricevono i workflow

La catena passa un payload standard come input del workflow. Leggerlo con normali
[espressioni](../reference/expression-dsl.md) quali `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — ogni commento sulla card, dal più vecchio al più recente.
- `history` — la cronologia completa delle attività (commenti, spostamenti, output), limitata
  alle 200 voci più recenti.
- `previous_outputs` — gli output delle esecuzioni completate in precedenza (colonne precedenti e
  round di follow-up).
- `chain.previous_workflow_outputs` — gli output dei collegamenti precedenti nella *corrente*
  catena.
- Nei round di follow-up `move` è `null` e `rerun` è `true`.

## Il ciclo di pianificazione (round di follow-up)

Un pattern comune consiste nel collocare un workflow di pianificazione sulla **seconda colonna** (per
impostazione predefinita denominata Planning — il nome non ha importanza; lo slot sì). Tale workflow arricchisce la
card e pone domande di follow-up:

1. Spostare una card nella seconda colonna — il workflow scrive un piano arricchito e le relative
   domande sulla card come output.
2. Rispondere nel thread dei commenti della card. La risposta rilascia la card: essa passa
   alla colonna successiva, che la preleva con la risposta nel contesto. La catena della seconda colonna
   non viene eseguita nuovamente.
3. Per migliorare il piano sul posto, premere **Run follow-up round**. La stessa
   catena viene eseguita nuovamente con tutto il contesto accumulato, quindi la card attende in quella colonna
   finché non si aggiunge un commento per rilasciarla.

Il gate di pianificazione è posizionale, non basato sul nome: la colonna più a sinistra e la colonna
immediatamente alla sua destra non avanzano mai da sole — eseguono la propria catena e attendono
lì (un commento rilascia la seconda colonna). Dalla terza colonna in poi, una
catena completata con successo fa avanzare la card verso destra autonomamente, fino all'ultima
colonna. Rinominare o rimuovere l'etichetta predefinita "Planning" non cambia quale slot
sia il gate. Una card può avere una sola esecuzione attiva alla volta.

## Human-in-the-loop e domande di Codex

Se un workflow della catena si mette in pausa — su un nodo [Human-in-the-Loop](../reference/human-in-the-loop.md),
su uno strumento HITL di un agent, o perché un nodo [Codex](../nodes/codex-node.md) necessita
di maggiori informazioni — l'esecuzione viene persistita come in sospeso e la card mostra lo stato
in sospeso ambra. Ogni pausa mantiene la propria superficie di risposta: un link di revisione HITL per HITL, la schermata
di follow-up di Codex per Codex.

Una volta fornita la risposta, la catena riprende autonomamente: il workflow in pausa termina, il suo output
si deposita sulla card, il resto della catena di quella colonna viene eseguito e la card avanza come di consueto.
Se l'esecuzione ripresa fallisce, la card diventa rossa e i collegamenti rimanenti vengono saltati.

## Correlati

- [Workflows](./workflows-tab.md)
- [Cronologia delle esecuzioni](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
