# Finestra di Valutazione delle Espressioni

La Finestra di Valutazione delle Espressioni è l'editor espanso per i campi che supportano le espressioni. Si apre dal pulsante di espansione accanto a un campo di espressione e mette a disposizione uno spazio di lavoro più ampio, il completamento automatico, l'anteprima live del backend e la consultazione dell'output in un unico ambiente.

## Apertura della Finestra

- Fare clic sul pulsante di espansione accanto a un campo di espressione nel pannello Properties.
- Nei campi multi-riga il pulsante è visualizzato all'interno del campo di input.
- Nei campi a riga singola il pulsante è visualizzato a destra del campo di input.

## Struttura della Finestra

- La finestra si apre come modale centrata a circa **80vw × 80vh**.
- L'intestazione mostra **Evaluate — {field name}** quando l'etichetta del campo è nota.
- L'editor mantiene il completamento automatico, la navigazione da campo a campo e le consuete azioni **Apply** / **Cancel**.
- L'anteprima si aggiorna automaticamente circa **300 ms** dopo aver interrotto la digitazione.
- Premere `Ctrl` / `Cmd` + `Enter` per applicare il testo corrente al campo e chiudere la finestra (equivale a **Apply**).

## Sezione Output

L'area Output si aggiorna automaticamente dopo aver interrotto la digitazione nell'editor.

### Valutazione

| Tipo di espressione | Risultato |
|---|---|
| Singolo `$expr` (intero campo) | Il valore nativo viene preservato |
| Singolo percorso puntato nudo (intero campo, senza `$`, senza newline incorporati) | Equivale a `$` + quel percorso (il backend normalizza per la valutazione) |
| Testo con `$refs` incorporati | Il risultato finale è sempre una stringa |
| Testo letterale (senza `$`, non un singolo percorso puntato) | Restituito così com'è |

**Esempi**

| Input | Risultato |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (equivale a `$input.items` quando l'intero valore è questo percorso) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Il contesto di valutazione viene costruito in questo ordine:

- **Dati bloccati** sui nodi a monte
- **Output dell'ultima esecuzione** dal canvas
- `null` quando nessun dato a monte è disponibile

Se il nodo corrente ha dipendenze a monte ma nessuna di esse dispone di dati bloccati o di un risultato di esecuzione recente, la finestra esegue prima un'esecuzione di test per costruire il contesto e successivamente valuta il testo corrente.

### Selettore del Percorso di Output

Quando il risultato del backend è un oggetto o un array, l'area Output può mostrare un selettore di percorso interattivo al posto del JSON grezzo.

- Fare doppio clic su una riga per aggiungere quel percorso al riferimento `$node.path` corrente.
- Fare clic singolo sulle righe espandibili per aprire o chiudere i rami.
- Utilizzare la casella di ricerca integrata per cercare chiavi, valori e stringhe di percorso.

## Completamento Automatico

- Digitare `$` per aprire i suggerimenti relativi ai nodi a monte, ai built-in e ai metodi.
- Premere `Tab` o `Enter` per inserire il suggerimento selezionato.
- Utilizzare `↑` / `↓` per scorrere l'elenco dei suggerimenti.

### Risposte di Esempio

Quando si continua un riferimento `$…` con un punto, ogni riga di suggerimento mostra la risposta che quel suggerimento produrrebbe, in grassetto a destra della riga.

- Digitando `$set.listItems.first().toString().u` vengono elencati `upper`, `urlEncode`, `urlDecode` e `unescape`, ciascuno con il proprio risultato valutato — in modo da poter scegliere in base al risultato anziché al nome.
- Digitando `$node.text.toJson()` si analizza una stringa JSON in un oggetto o array. Dopo `.toJson()`, il completamento automatico può proporre le chiavi analizzate (ad esempio `repoUrl`) quando l'output dell'ultima esecuzione o i dati bloccati sono disponibili.
- I risultati vengono valutati sul backend rispetto agli stessi dati bloccati e output dell'ultima esecuzione utilizzati dall'anteprima della finestra, così da corrispondere a ciò che il campo produrrà.
- Vengono valutati solo i suggerimenti che sono autonomi: metodi senza argomenti (`upper()`, `first()`, `keys()`, `toJson()`) e proprietà semplici (`length`, `year`). I suggerimenti che richiedono prima degli argomenti — `map`, `filter`, `sort`, `replace` — vengono lasciati vuoti.
- Una riga rimane vuota quando il candidato non produce alcuna risposta: un errore, un `null` o un metodo che non si applica a quel valore.
- Le risposte vengono abbreviate su una sola riga. Passare il mouse su una risposta abbreviata per visualizzarne una porzione maggiore.

## Build with AI

Il pulsante **Build with AI** compare nell'angolo in alto a destra della finestra di valutazione quando un workflow è caricato. Apre una modale annidata in cui è possibile descrivere a testo libero l'espressione desiderata e farla generare da un LLM.

### Come funziona

1. Fare clic su **Build with AI** nella barra degli strumenti della finestra di valutazione.
2. Selezionare una credenziale LLM e un modello dai menu a discesa.
3. Digitare una descrizione in testo libero di ciò che si desidera — ad esempio, *"Get the customer name from the API response"*.
4. Fare clic su **Generate**. La modale chiama il backend, che utilizza il system prompt dell'[Expression DSL](./expression-dsl.md) insieme agli output dell'ultima esecuzione del workflow come contesto, e restituisce una singola stringa di espressione.
5. L'espressione generata viene immediatamente valutata rispetto agli stessi dati del canvas, così da poterne vedere il risultato prima di applicarla.
6. Fare clic su **Apply** per sostituire il contenuto dell'editor con l'espressione generata, oppure su **Regenerate** per riprovare.

### Contesto utilizzato

Il generatore riceve gli output dei nodi dall'ultima esecuzione di test sul canvas. Se il workflow non è ancora stato eseguito, l'LLM genera un'espressione best-effort basata sulle etichette dei nodi e sulle convenzioni del DSL.
### Requisiti

- Una credenziale LLM (OpenAI, Google o Custom) deve essere configurata nella scheda [Credenziali](./credentials.md).
- Il workflow deve essere aperto nell'editor.

## Scorciatoie da tastiera

| Scorciatoia | Azione |
|---|---|
| Pausa di digitazione (~300 ms) | Aggiorna l'anteprima del backend |
| `Ctrl` / `Cmd` + `Enter` | Applica e chiude la finestra di dialogo |
| `Escape` | Chiude prima il completamento automatico, altrimenti chiude la finestra di dialogo |

## `$` annidati negli argomenti dei metodi

Per la valutazione nella finestra di dialogo / nel backend, è possibile passare un altro riferimento con un `$` annidato all'interno di chiamate come `.get($other.field)` quando occorre una chiave dinamica. È inoltre possibile utilizzare un percorso semplice all'interno di `.get(...)` (ad esempio `other.field`); il backend lo risolve allo stesso modo. I campi salvati del workflow devono comunque seguire le regole dell'[Expression DSL](./expression-dsl.md); l'API di valutazione accetta altresì, per comodità, un percorso puntato semplice sull'intera riga (si veda la tabella precedente).

## Navigazione

Gli editor di mappatura Set ed Execute possono mostrare i pulsanti **Prev** / **Next** per consentire di spostarsi tra i campi senza chiudere la finestra di dialogo.

## Correlati

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credenziali](./credentials.md) — richieste per la funzionalità Build with AI
- [Nodo LLM](../nodes/llm-node.md)
- [Nodo Output](../nodes/output-node.md)
- [Nodo Condition](../nodes/condition-node.md)
