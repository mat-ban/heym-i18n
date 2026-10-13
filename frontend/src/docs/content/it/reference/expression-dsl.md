# Expression DSL

Heym utilizza un semplice linguaggio di espressioni per fare riferimento ai dati dei nodi a monte. Utilizzare le espressioni nella configurazione dei nodi, ad esempio in `userMessage` del Nodo LLM, `condition` del Nodo Condition, `message` del Nodo Output, nelle mappature del Nodo Set e nei valori delle Variabili. Utilizzare la [Finestra di valutazione delle espressioni](./expression-evaluation-dialog.md) per un editor più ampio, un'anteprima live basata sul backend e la selezione dei percorsi di output.

## Riferimenti di base

### Nodo Input vs Nodi con nome

- **`$input`** – Utilizzare solo quando è presente un singolo nodo [Input](../nodes/input-node.md) a monte e si desidera fare riferimento al suo output. Esempio: `$input.text`. È una scorciatoia per "i dati provenienti dall'input connesso".
- **`$nodeLabel.field`** – Utilizzare per fare riferimento a qualsiasi nodo a monte tramite la sua **label** (la `label` nei dati del nodo). Preferire questa forma in presenza di più nodi o quando l'AI Assistant / il workflow DSL si aspetta label esplicite. Esempio: `$userInput.body.text`, `$myLLM.text`.

**Quando utilizzare l'una o l'altra:**

| Contesto | Preferire | Esempio |
|--------|--------|---------|
| Singolo nodo input, flusso semplice | `$input.text` | Messaggio di output da un solo Input |
| Più nodi o riferimenti con nome | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Sempre `$nodeLabel.field` | Il workflow builder si aspetta label, non `$input` |

### Nodo Input

Utilizzare `$input` per fare riferimento ai dati del Nodo Input quando è presente un singolo input a monte:

```
$input.text
```

### Nodi con nome

Fare riferimento a qualsiasi nodo a monte tramite la sua label. Quando un nodo ha [dati bloccati](./canvas-features.md#data-pin), il completamento delle espressioni utilizza quelli invece dell'output di esecuzione.

```
$llm.text
$httpResponse.body
$condition
```

### Credenziali

Utilizzare `$credentials.CredentialName` per fare riferimento ai valori delle Credenziali (ad esempio API key, bearer token o token di integrazione Notion) tramite nome. Vedere [Condivisione delle Credenziali](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

I nomi che non sono identificatori semplici (contengono `-`, iniziano con una cifra o sono parole riservate) utilizzano la forma con parentesi: `$credentials["my-api-key"]`.

### Variabili globali

Utilizzare `$global.variableName` per fare riferimento alle [Variabili globali](./global-variables.md) – dati chiave-valore persistenti, con ambito utente, gestiti nella [scheda Variabili](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Campi annidati

Utilizzare la notazione con punto per gli oggetti annidati:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Valori letterali

- **Stringhe**: `"hello"` o `'hello'`
- **Numeri**: `42`, `3.14`
- **Booleani**: `true`, `false`
- **Null**: `null`

## Conservazione del tipo

Quando il valore **intero** è una singola `$expr`, il backend conserva il tipo nativo:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Quando un'espressione fa parte di una stringa più ampia, il risultato finale è sempre una stringa:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Note adesive

I nodi [Sticky Note](../nodes/sticky-note-node.md) sono documentazione del canvas, non campi di espressione eseguibili. Il loro contenuto `note` viene renderizzato come markdown, quindi utilizzare link e immagini markdown normali invece di espressioni `$...`.

Le note adesive supportano un titolo di visualizzazione personalizzato e sei colori di sfondo salvati:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

I valori consentiti per `stickyColor` sono `yellow`, `sky`, `emerald`, `rose`, `violet` e `zinc`.

## Aritmetica

Operatori supportati: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Confronti

Da utilizzare nei nodi [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contesto del Loop

All'interno di un nodo [Loop](../nodes/loop-node.md), utilizzare `item` per fare riferimento all'elemento corrente dell'array:

```
item.name
item.value
```

## Variabili speciali
- `$now` - Data e ora correnti con metodi di formattazione
- `$Date()` - Crea/analizza una data (es. `$Date("2024-01-15")`)
- `$UUID` - Genera un identificatore univoco di 32 caratteri (SENZA parentesi; utilizzare `$UUID` e non `$UUID()`)
- `$workflowName` - Nome del workflow corrente
- `$workflowDescription` - Descrizione del workflow corrente
- `$workflowPath` - Percorso relativo del workflow, es. `/workflows/<id>`
- `$workflowUrl` - URL assoluto del workflow, es. `https://<host>/workflows/<id>`
- `$executionId` - Id dell'esecuzione corrente (coincide con l'id della voce in [Cronologia esecuzioni](./execution-history.md), quindi `/workflows/<id>/<executionId>` apre questa esecuzione sul canvas). **Solo a runtime**: vuoto nella finestra di anteprima delle espressioni; popolato solo durante l'esecuzione di un workflow.
- `$vars` - Variabili locali del workflow (accessibili tramite `$vars.variableName`; aggiornate tramite il nodo `variable`)
- `$global` - Archivio persistente delle variabili globali (accessibile tramite `$global.variableName`)
- `$page.record` - Solo per i workflow dei widget della dashboard: il record della pagina di dettaglio in cui si trova il widget, ottenuto dal parametro `?record=` della dashboard. È nullo in una dashboard aperta senza tale parametro e nella finestra di anteprima delle espressioni. Un nodo etichettato `page` ha la precedenza. Vedi [Pagine di dettaglio](../tabs/dashboard-tab.md#detail-pages).

### Utilizzo di $vars
- `$vars.counter` - Accede a una variabile denominata `counter`
- `$vars.myArray.add("item")` - Aggiunge un elemento a una variabile di tipo array

### Utilizzo di $global
- `$global.environment` - Accede a una variabile globale denominata `environment`
- `$global.settings.baseUrl` - Accede ai campi annidati in una variabile globale di tipo oggetto

## Contesto della Richiesta (Esecuzione API)
Quando un workflow viene eseguito tramite API HTTP, i nodi di input ricevono metadati aggiuntivi della richiesta:
- `$textInputLabel.body` - Oggetto body della richiesta HTTP (payload JSON grezzo)
- `$textInputLabel.headers` - Oggetto headers della richiesta HTTP (tutte le chiavi degli header sono in minuscolo)
- `$textInputLabel.query` - Oggetto dei parametri di query dell'URL

Accesso ai dati della richiesta come:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funzioni di Conversione di Tipo
- `str(value)` - Converte in stringa
- `int(value)` - Converte in intero
- `float(value)` - Converte in float
- `bool(value)` - Converte in booleano
- `list(value)` - Converte in lista
- `dict(key=value, ...)` - Crea un dizionario con argomenti keyword (es. `$dict(name="Ali", age=30)`)

## Funzioni Matematiche
- `len(value)` - Ottiene la lunghezza
- `abs(value)` - Valore assoluto
- `min(a, b)` - Valore minimo
- `max(a, b)` - Valore massimo
- `round(value)` - Arrotonda il numero
- `sum(list)` - Somma della lista
- `sorted(list)` - Ordina la lista
- `randomInt(min, max)` - Intero casuale

## Funzioni per Array
- `$array(a, b, c)` - Crea un array dagli argomenti (es. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Crea un intervallo di interi da `a` a `b` con `b` escluso (es. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Restituisce errore quando `a > b`
- `notNull(list)` - Rimuove i valori null dall'array

## Funzione di Composizione Stringhe (per espressioni map/filter)
- `concat(a, b, c, ...)` - Concatena N argomenti
  - Utilizzare all'interno di `.map()` come stringa di espressione (senza `$` all'interno della stringa)
  - Utilizzare apici singoli all'interno della stringa concat:
    - Corretto: `concat('prefix', 'item.field', 'suffix')`

## Oggetti Letterali / Dizionari
Creare oggetti/dizionari utilizzando la sintassi con parentesi graffe con qualsiasi chiave stringa:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Chiavi Dinamiche
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regole per Oggetti Letterali
- Le chiavi possono essere qualsiasi stringa (inclusi spazi/caratteri speciali)
- Le chiavi DEVONO essere racchiuse tra virgolette doppie (es. `"key"`)
- I valori possono essere stringhe/numeri/booleani/espressioni/oggetti annidati

## Funzioni per Stringhe
- `upper(text)` - Maiuscolo
- `lower(text)` - Minuscolo
- `strip(text)` - Rimuove gli spazi bianchi
- `capitalize(text)` - Rende maiuscola la prima lettera
- `title(text)` - Formato titolo
- `split(text, separator)` - Divide la stringa
- `join(separator, list)` - Unisce la lista
- `replace(text, old, new)` - Sostituisce il testo
- `regexReplace(text, pattern, replacement)` - Sostituisce con pattern regex
- `base64Encode(text)` - Codifica il testo UTF-8 come Base64 standard
- `base64Decode(text)` - Decodifica il Base64 standard in testo UTF-8
- `toJson(text)` - Analizza una stringa JSON in un oggetto, array o valore

## Metodi per Stringhe (su valori stringa)
- `.orEmpty()` - Restituisce il valore stringa, oppure `""` quando il valore è null/mancante
- `.upper()` / `.lower()` - Conversione maiuscolo/minuscolo
- `.strip()` - Rimuove gli spazi bianchi
- `.capitalize()` / `.title()` - Rende maiuscola
- `.length` - Lunghezza della stringa
- `.toString()` - Converte in stringa
- `.substring(start, end)` - Estrae la sottostringa
- `.contains(text)` - Verifica se contiene la sottostringa
- `.startswith(prefix)` / `.endswith(suffix)` - Verifica prefisso/suffisso
- `.indexOf(text)` - Trova la posizione (restituisce -1 se non trovata)
- `.replace(old, new)` - Sostituisce la prima occorrenza
- `.replaceAll(old, new)` - Sostituisce tutte le occorrenze
- `.regexReplace(pattern, replacement)` - Sostituisce con pattern regex
- `.hash()` - Hash MD5 della stringa
- `.base64Encode()` - Codifica il testo UTF-8 come Base64 standard
- `.base64Decode()` - Decodifica il Base64 standard in testo UTF-8
- `.urlEncode()` - Codifica URL della stringa
- `.urlDecode()` - Decodifica URL della stringa
- `.escape()` - Esegue l'escape JSON della stringa (converte i caratteri speciali in formato JSON)
- `.unescape()` - Esegue l'unescape JSON della stringa (converte il formato JSON nella stringa originale)
- `.toJson()` - Analizza una stringa JSON in un oggetto, array o valore

### Esempi di Metodi per Stringhe
- `$profile.nickname.orEmpty()` - Converte testo nullable/mancante in una stringa vuota
- `$text.upper()` - Converte in maiuscolo
- `$text.lower()` - Converte in minuscolo
- `$text.strip()` - Rimuove gli spazi bianchi
- `$text.replace("old", "new")` - Sostituisce il testo
- `$text.replaceAll("a", "b")` - Sostituisce tutte le occorrenze
- `$text.length` - Ottiene la lunghezza della stringa
- `$text.escape()` - Esegue l'escape dei caratteri JSON speciali (es. virgolette, newline)
- `$escapedText.unescape()` - Esegue l'unescape della stringa in formato JSON riportandola all'originale
- `$text.toJson()` - Analizza una stringa JSON di oggetto/array (poi `$text.toJson().repoUrl`)
- `$toJson($text)` - Stessa analisi come funzione
- `$base64Encode("Héym 🌍")` - Restituisce `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Decodifica il Base64 in testo UTF-8
- `$text.urlEncode()` - Codifica URL per parametri API
- `$encodedText.urlDecode()` - Decodifica il testo codificato URL

## Metodi degli Array (sugli array)
- `.first()` - Ottiene il primo elemento
- `.last()` - Ottiene l'ultimo elemento
- `.random()` - Ottiene un elemento casuale
- `.reverse()` - Inverte l'array
- `.flat()` - Appiattisce gli array annidati in un unico array
- `.flat(depth)` - Appiattisce con limite di profondità
- `.distinct()` - Rimuove i duplicati
- `.distinctBy(expr)` - Rimuove i duplicati in base a un'espressione (es. `$array.distinctBy("item.id")`)
- `.notNull()` - Rimuove i valori null
- `.add(item)` - Aggiunge un elemento (restituisce un nuovo array)
- `.contains(item)` - Verifica se l'array contiene l'elemento (restituisce un boolean)
- `.join(separator)` - Unisce gli elementi dell'array in una stringa
- `.filter(expr)` - Filtra l'array utilizzando la variabile `item` (es. `$array.filter("item > 5")`)
- `.map(expr)` - Trasforma ogni elemento utilizzando la variabile `item` (es. `$array.map("item.name")`)
- `.sort(expr, order)` - Ordina in base a un'espressione, order è `"asc"` (predefinito) o `"desc"`
- `.take(n)` - Prende i primi N (positivo) o gli ultimi N (negativo) elementi
- `.length` - Lunghezza dell'array
- `.toString()` - Converte in stringa JSON

### Esempi di Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metodi degli Oggetti/Dizionari (sugli oggetti)
- `.get(key)` - Ottiene il valore tramite chiave (restituisce null se non trovato)
- `.get(key, default)` - Ottiene il valore tramite chiave con fallback predefinito
- `.keys()` - Restituisce un elenco di tutte le chiavi
- `.values()` - Restituisce un elenco di tutti i valori
- `.entries()` - Restituisce un elenco di oggetti `{key, value}` (uno per proprietà)
- `.filter(expr)` - Itera le voci `{key, value}` e restituisce le voci corrispondenti come elenco (utilizzare `item.key` / `item.value` all'interno di `expr`)
- `.map(expr)` - Itera le voci `{key, value}` e restituisce un elenco di valori trasformati (utilizzare `item.key` / `item.value` all'interno di `expr`)
- `.toString()` - Converte in stringa JSON

### Esempi di Iterazione degli Oggetti
Quando si itera un oggetto con `.map()` o `.filter()`, ogni `item` è una coppia `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → elenco dei nomi delle proprietà che non sono null

## Data/Ora
- `$now` - Data/ora corrente
- `$now.format("YYYY-MM-DD")` - Formatta data/ora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Converte i formati
- `$now.addDays(n)` / `.addHours(n)` - Aritmetica sulle date
- `$Date("2024-01-15")` - Analizza una stringa di data

## Operazioni Numeriche
- Matematica di base: `+`, `-`, `*`, `/`, `%`
- Confronti: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operatori booleani: `and`, `or`, `not`

## Condizioni Booleane
Per i boolean, scrivere l'espressione direttamente (non forzare `== true`):
- Errato: `$nodeName.isValid == true`
- Corretto: `$nodeName.isValid`
- Negazione: `not $nodeName.isValid`

## Regole e Whitelist (Critico)
### Regole di Posizionamento del `$`
- Un'espressione autonoma in genere inizia con un `$` iniziale.
- Le stringhe template possono contenere più `$refs`.
- I parametri dei metodi possono anche contenere `$refs` annidati quando si desidera passare il risultato di un'altra espressione (chiave dinamica o risoluzione annidata).
  - Valido: `$node.method(other.field)` — `other` viene risolto dal contesto come un'etichetta di primo livello (nessun `$` all'interno dell'argomento).
  - Valido: `$node.method($other.field)` — il `$` annidato è supportato nell'anteprima della finestra di valutazione e nella valutazione delle condizioni.
  - Valido: `$array($a.x, $b.y)`
  - Il completamento automatico all'interno di `.get(` inserisce percorsi **bare** `label.field` (senza `$` iniziale), come all'interno di `$array(...)` / `$notNull(...)`.
- **API di Valutazione (Run):** Se il valore inviato nella sua interezza è un singolo dot path **senza** un `$` iniziale (ad esempio testo selezionato nell'editor, come `execute.outputs.output.result.today`), il backend lo tratta allo stesso modo di `$execute.outputs.output.result.today`. I valori che contengono un newline o carriage return dopo il trimming non vengono riscritti (per evitare payload multi-riga ambigui). Preferire la scrittura di `$` nei campi del workflow salvati; la riscrittura è principalmente per l'ispezione e gli strumenti.
- Il risultato di `Run` nella finestra di valutazione è la fonte di verità per come si risolve un'espressione concreta.

### Quotatura delle Stringhe negli Array
Quando si creano array con valori stringa, utilizzare SEMPRE le virgolette doppie:
- Corretto: `$array("hello", "world")`
- Errato: `$array('hello', 'world')`

### UTILIZZARE SOLO QUESTE FUNZIONI (Whitelist)
Utilizzare SOLO:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- metodi documentati per stringhe/array/oggetti

Se una funzione non è elencata sopra, non esiste.

### Limiti dei Metodi di Array / Dizionari
- Gli array possono utilizzare SOLO: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Gli Oggetti/Dizionari possono utilizzare SOLO: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Nomi riservati per le etichette dei nodi
Non utilizzare questi nomi come etichette dei nodi: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Esempi

**Condizione**: `$input.text.length > 0`

**Messaggio utente LLM**: `$input.text`

**Messaggio di output**: `$llm.text`

**Valore variabile**: `$input.count + 1`

### Esempio DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Correlati

- [Finestra di valutazione delle espressioni](./expression-evaluation-dialog.md) – Editor espandibile con anteprima live lato backend e completamento automatico
- [Funzionalità del Canvas](./canvas-features.md) – Data pin per testare le espressioni senza rieseguire i nodi
- [Tipi di nodo](./node-types.md) – Nodi che utilizzano le espressioni ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), ecc.)
- [Sticky Note](../nodes/sticky-note-node.md) – Note markdown sul Canvas con titolo modificabile, colore e visualizzazione di immagini
- [Nodo Agent](../nodes/agent-node.md) – Utilizzo delle espressioni nei prompt degli agenti
- [Memoria persistente dell'agente](./agent-persistent-memory.md) – `persistentMemoryEnabled` e `memoryShares` nei `data` dell'agente (non campi espressione)
- [Struttura del workflow](./workflow-structure.md) – Campi `data` dei nodi che accettano espressioni
- [Scheda Credenziali](../tabs/credentials-tab.md) – Credenziali referenziate dai nodi
- [Condivisione delle credenziali](./credentials-sharing.md) – Condividere le credenziali e utilizzare `$credentials` nelle espressioni
- [Variabili globali](./global-variables.md) – Variabili persistenti con `$global`
