# Scheda Modelli

La scheda Modelli consente di salvare, sfogliare e riutilizzare workflow completi e singoli nodi. Condividere quanto creato una volta e applicarlo a nuovi progetti con un solo clic.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Guarda la demo dei Modelli</a></p>

## Panoramica

Esistono due tipi di modelli:

- **Modelli di workflow** — salvare un workflow completo (tutti i nodi e le connessioni) come punto di partenza riutilizzabile.
- **Modelli di nodo** — salvare un singolo nodo configurato (ad esempio un Nodo LLM ottimizzato o un nodo HTTP personalizzato) per riutilizzarlo in workflow diversi.

Passare da un tipo all'altro utilizzando l'interruttore **Workflows / Nodes** nella parte superiore della scheda.

Utilizzare la barra di ricerca per filtrare i modelli visibili per nome, descrizione, tag o tipo di nodo.

---

## Creazione di un Modello

### Modello di workflow

1. Aprire il workflow da condividere nell'editor.
2. Fare clic su **Share as Template** nella barra degli strumenti superiore.
3. Compilare nome, descrizione e tag opzionali.
4. Scegliere la visibilità: **Everyone** (tutti gli utenti) o **Specific users** (inserire nomi utente e/o selezionare team).
5. Fare clic su **Share**. Una notifica verde conferma l'esito positivo.

### Modello di nodo

1. Fare clic con il tasto destro su un nodo qualsiasi del canvas.
2. Selezionare **Share as Template** dal menu contestuale.
3. Compilare il modulo e fare clic su **Share**.

---

## Utilizzo di un Modello

### Modello di workflow

1. Aprire la scheda **Templates** e assicurarsi che sia selezionato **Workflows**.
2. Fare clic su una scheda per visualizzarne l'anteprima, oppure fare clic direttamente su **Use**.
3. Il workflow viene clonato in un nuovo workflow che si apre nell'editor.

### Modello di nodo

1. Aprire la scheda **Templates** e selezionare **Nodes**.
2. Fare clic su **Use** nella scheda del modello di nodo.
3. Viene visualizzata una finestra di dialogo — scegliere dove aggiungere il nodo:
   - **New workflow** — crea un nuovo workflow contenente solo questo nodo.
   - **Existing workflow** — selezionare dall'elenco dei workflow; il nodo viene inserito automaticamente all'apertura dell'editor.

---

## Anteprima

Fare clic su una scheda di modello qualsiasi per aprire un'anteprima completa:

- **Miniature delle schede** — le schede dei modelli mostrano un'istantanea del canvas in sola lettura, adattata, sia per i workflow che per i modelli di singolo nodo.
- **Modelli di workflow** — un canvas in sola lettura che rispecchia lo stile di anteprima della cronologia di modifica, inclusi pan e zoom.
- **Modelli di nodo** — il nodo salvato si apre sullo stesso canvas in sola lettura come anteprima di singolo nodo.
- **Dettagli del nodo** — fare clic su un nodo qualsiasi nell'anteprima per ispezionarne la configurazione salvata nel pannello laterale.
- Tag, conteggio utilizzi e **owner** sono mostrati per tutti i modelli.

Premere **ESC** o fare clic all'esterno per chiudere l'anteprima.

---

## Gestione dei Modelli

- **Edit** – Se si è il proprietario del modello, passare il cursore sulla scheda e fare clic sull'icona della matita per aggiornarne nome, descrizione, tag o visibilità
- **Delete** – Se si è il proprietario del modello, passare il cursore sulla scheda ed eliminare il modello dopo la richiesta di conferma
- **Azioni riservate al proprietario** – I controlli di modifica ed eliminazione sono mostrati solo per i modelli creati dall'utente

---

## Command Palette (CTRL+K)

I modelli (sia di workflow che di nodo) sono ricercabili dalla command palette **CTRL+K**. Selezionare un modello per utilizzarlo immediatamente — i modelli di workflow si aprono nell'editor, i modelli di nodo richiedono una destinazione.

---

## Modelli in Chat

È possibile porre domande all'IA sui propri modelli — conosce tutti i modelli presenti nel workspace.

---

## Visibilità

| Impostazione | Chi può vederlo |
|---|---|
| Everyone | Tutti gli utenti della piattaforma |
| Specific users | Gli utenti elencati per nome e/o i team selezionati — tutti i membri del team ottengono l'accesso |

Quando si condivide con **Specific users**, è possibile aggiungere sia singoli utenti (per nome) che team. I membri del team vedono il modello nella scheda Templates e possono utilizzarlo.

---

## Correlati

- [Teams](../reference/teams.md) – Condividere modelli con i team
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida breve alle schede della dashboard
