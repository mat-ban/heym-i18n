# Scorciatoie da tastiera

Heym mette a disposizione scorciatoie da tastiera all'interno dell'editor dei workflow e del canvas per velocizzare le azioni più comuni.

## Scorciatoie globali dell'editor

Queste scorciatoie sono attive in qualsiasi punto dell'editor dei workflow.

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Apre la Command Palette |
| `Ctrl + I` / `Cmd + I` | Mostra/nasconde il pannello [AI Assistant](./ai-assistant.md) (funziona anche durante la digitazione) |
| `Ctrl + Enter` / `Cmd + Enter` | Esegue il workflow corrente |
| `Ctrl + S` / `Cmd + S` | Salva il workflow |
| `Ctrl + Z` / `Cmd + Z` | Annulla |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ripristina |
| `Ctrl + Y` / `Cmd + Y` | Ripristina (alternativa) |
| `Escape` | Chiude overlay, finestre di dialogo e pannelli aperti |

## Scorciatoie del canvas

Queste scorciatoie si applicano quando il canvas è attivo (nessun campo di testo è in fase di inserimento).

### Selezione e navigazione

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Seleziona tutti i nodi |
| `Shift` (tenuto premuto) | Trascina per selezionare più nodi |
| `Ctrl` / `Cmd` (tenuto premuto) | Fai clic per aggiungere singoli nodi alla selezione |
| `Escape` | Deseleziona tutti i nodi; chiude la ricerca inline dei nodi |

### Modifica dei nodi

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Copia il nodo o i nodi selezionati |
| `Ctrl + X` / `Cmd + X` | Taglia il nodo o i nodi selezionati |
| `Ctrl + V` / `Cmd + V` | Incolla il nodo o i nodi |
| `Delete` o `Backspace` | Elimina il nodo o i nodi e/o i collegamenti selezionati |
| `D` | Attiva/disattiva il nodo o i nodi selezionati |
| `P` | Attiva/disattiva i dati bloccati sul nodo selezionato |

### Ricerca inline dei nodi

Digitando un qualsiasi carattere stampabile sul canvas (quando nessun campo di testo è attivo) si apre il popup di ricerca inline dei nodi. Il carattere digitato diventa il primo carattere della query di ricerca.

| Scorciatoia | Azione |
|----------|--------|
| Qualsiasi carattere stampabile | Apre la ricerca inline dei nodi e inizia la digitazione |
| `Backspace` | Rimuove l'ultimo carattere dalla query di ricerca |
| `Escape` | Chiude la ricerca inline dei nodi |

## Command Palette (`Ctrl + K`)

La Command Palette è disponibile dall'editor, dalla dashboard, dalla documentazione e dalle viste delle valutazioni. Consente di navigare rapidamente tra workflow, schede e pagine della documentazione senza lasciare la tastiera.

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Apre la Command Palette |
| `↑` / `↓` | Naviga nell'elenco dei risultati |
| `Tab` / `Shift + Tab` | Naviga nell'elenco dei risultati |
| `Enter` | Apre l'elemento selezionato |
| `Escape` | Chiude la palette |

## Scorciatoie della dashboard

Queste scorciatoie sono attive nella scheda Workflows quando nessun altro campo di testo è attivo.

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Porta il focus sulla ricerca dei workflow |
| `Escape` | Cancella la ricerca dei workflow quando contiene del testo |

## Scorciatoie del pannello delle proprietà

Queste scorciatoie sono attive quando un nodo è selezionato e il pannello delle proprietà è aperto.

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Apre il sub-workflow collegato in una nuova scheda (solo Nodo Execute) |

## Scorciatoie della finestra di dialogo Evaluate

Queste scorciatoie sono attive quando la finestra di dialogo Evaluate è aperta.

| Scorciatoia | Azione |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Applica l'espressione e chiude la finestra di dialogo |
| `Ctrl + Z` / `Cmd + Z` | Annulla le modifiche nell'editor delle espressioni |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ripristina le modifiche nell'editor delle espressioni |
| `Ctrl + Y` / `Cmd + Y` | Ripristina le modifiche nell'editor delle espressioni (alternativa) |

## Scorciatoie di Cronologia ed Esecuzioni

Queste scorciatoie sono disponibili nella finestra di dialogo della Cronologia delle esecuzioni e nel pannello delle Esecuzioni.

| Scorciatoia | Azione |
|----------|--------|
| `S` | Mostra/nasconde il campo di ricerca per filtrare le voci |

## Correlati

- [Funzionalità del canvas](./canvas-features.md) – Data pin, attivazione/disattivazione, estrazione in sub-workflow
- [Struttura del workflow](./workflow-structure.md) – Formato di nodi e collegamenti
- [Nodo Execute](../nodes/execute-node.md) – Richiama sub-workflow (`Ctrl + Shift + O`)
- [Guida rapida](../getting-started/quick-start.md) – Crea il Suo primo workflow
- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
