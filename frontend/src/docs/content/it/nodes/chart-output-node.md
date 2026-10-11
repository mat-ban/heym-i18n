# Output Grafico

Il nodo **Output Grafico** è il nodo terminale di un workflow di [widget della dashboard](../tabs/dashboard-tab.md). Riceve le righe prodotte dai nodi a monte e le converte in un payload grafico standardizzato che la dashboard utilizza per il rendering.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 0 (terminale) |
| Output | Payload grafico standardizzato |

Posizionare questo nodo **per ultimo** in un workflow di widget della dashboard. Il nodo che lo precede deve produrre un array di oggetti riga, ad esempio:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Quando si dispone unicamente di dati di esempio (senza una sorgente reale), produrre queste righe con un nodo **Set** utilizzando `$array(dict(...), dict(...))` — ad esempio `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Non** utilizzare `${...}` né oggetti letterali `{...}`; Heym costruisce gli oggetti esclusivamente con `dict(key=value)`.

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` o `hitl` |
| `orientation` | string | `vertical` o `horizontal` (solo per grafici a barre) |
| `dataPath` | string | Percorso puntato all'array di righe all'interno dell'output a monte (ad es. `data` o `result.items`). Lasciare vuoto per il rilevamento automatico. |
| `labelField` | string | Chiave di riga utilizzata come etichetta di categoria (pie/bar/line) |
| `valueField` | string | Chiave di riga utilizzata come valore numerico (pie/bar/line/numeric/gauge) |
| `series` | array | Definizione opzionale multi-serie `[{ "name": "Sent", "field": "sent" }]` per bar/line (sostituisce `valueField`) |
| `columns` | array | Elenco opzionale di colonne per `table` (per impostazione predefinita le chiavi della prima riga) |
| `xField` / `yField` | string | Chiavi di riga per gli assi numerici X e Y (scatter) |
| `min` / `max` | number | Intervallo numerico per `gauge` (predefinito `0` / `100`) |
| `unit` | string | Unità opzionale mostrata accanto a un valore `numeric` o `gauge` |
| `text` | string | Messaggio Markdown per il tipo di grafico `text`. Lasciare vuoto e impostare `valueField` per visualizzare un messaggio dinamico ricavato dai dati a monte. |
| `title` | string | Titolo opzionale del grafico |

## Tipi di grafico

- **bar / line / area / pie** — grafici categorici guidati da `labelField` + `valueField` (o `series` per bar/line/area multi-serie). `area` è un grafico di tendenza con riempimento.
- **table** — righe grezze visualizzate come tabella scorrevole utilizzando `columns`.
- **numeric** — un singolo valore KPI ricavato dalla prima riga, con `unit` opzionale.
- **gauge** — un singolo valore mostrato rispetto a un intervallo `min`–`max` (ad es. una percentuale). Utilizza `valueField`.
- **scatter** — punti X/Y ricavati da `xField` e `yField` per grafici di correlazione.
- **proportion** — una singola barra orizzontale suddivisa in quote con legenda percentuale (ad es. una ripartizione per lingua). Utilizza `labelField` + `valueField`.
- **barGauge** — un indicatore orizzontale per riga con gradiente dal rosso al verde e un valore (ad es. spazio su disco libero). Utilizza `labelField` + `valueField`, con `unit` e `max` opzionali (per impostazione predefinita il valore di riga più elevato).
- **text** — un messaggio markdown (ad es. una nota di stato come "Ultima esecuzione alle 19:47"). Inserire il markdown in `text` per un messaggio statico, oppure lasciare `text` vuoto e impostare `valueField` per visualizzare una stringa prodotta a monte. Supporta intestazioni, grassetto/corsivo, [elenchi](../nodes/chart-output-node.md#interactive-task-lists), link e codice inline.
- **hitl** — un carosello delle revisioni umane in sospeso. L'intestazione mostra `1/n pending`; la freccia sinistra è disabilitata sulla prima scheda e la freccia destra sull'ultima. Il nome del workflow apre tale esecuzione sul canvas. **Approve**, **Request changes** e **Reject** la risolvono, e l'icona della cronologia accanto al titolo del widget apre tale esecuzione nella finestra di dialogo della cronologia sulla stessa pagina. Questo tipo di grafico ignora le righe a monte, pertanto il workflow del widget è costituito unicamente dal nodo Output Grafico. Ogni persona autenticata visualizza le revisioni relative ai workflow di cui è proprietaria.
### Liste di attività interattive

Utilizzare la sintassi delle liste di attività Markdown in stile GitHub nel campo statico `text`:

```markdown
- [x] Opzione 1
- [ ] Opzione 2
- [ ] Opzione 3
```

Nella [Dashboard](../tabs/dashboard-tab.md), le caselle di controllo vengono visualizzate come controlli cliccabili (compatibili con modalità chiara e scura). L'attivazione o disattivazione di una casella di controllo aggiorna il campo `text` del workflow del widget e persiste tra i vari aggiornamenti.

**Modifica in linea:** fare doppio clic sull'etichetta di un elemento dell'attività per modificarla sul posto. Premere Invio o fare clic altrove per salvare; premere Esc per annullare. Cancellare completamente l'etichetta per rimuovere tale elemento dalla lista.

**Link negli elementi dell'attività:** quando un'etichetta contiene un link Markdown (`[titolo](url)`), fare clic sul link apre l'URL senza attivare o disattivare la casella di controllo. Fare clic altrove sulla riga per attivare o disattivare.

**Solo testo statico:** l'interattività richiede la sintassi delle liste di attività GFM (`- [ ]` / `- [x]`). I messaggi di stato dinamici semplici, privi di elementi di attività, rimangono di sola lettura. Quando il Markdown proviene da `valueField`, la prima attivazione o disattivazione lo copia nel campo statico `text` affinché le modifiche persistano.

### Liste numerate

I widget di testo visualizzano il Markdown con i **numeri di riga espliciti preservati**. Anteporre a ciascuna riga il numero che si desidera visualizzare (ad esempio `9.`, `8.`, `7.`). Heym non rinumerà le righe automaticamente.

**Perché numeri espliciti?** Le liste ordinate Markdown standard (`1.`, `2.`, `3.`) diventano liste HTML `<ol>`, che contano solo **in aumento** a partire dal primo numero. Una lista scritta come `9.` / `8.` / `7.` verrebbe visualizzata come `9`, `10`, `11` in un normale renderer Markdown. Anteporre a ciascuna riga il numero desiderato evita questo problema.

**Liste decrescenti (ad esempio, dal più recente):** costruire il Markdown in un ciclo del workflow e calcolare il numero visualizzato per ciascun elemento:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Schema tipico:

1. Recuperare o costruire un array di elementi (ad esempio HTTP → `body.videos`).
2. Eseguire un [Loop](./loop-node.md) sull'array; all'interno del corpo, utilizzare una [Variabile](./variable-node.md) con `.add()` per aggiungere una riga numerata per ogni iterazione.
3. Dopo il ramo **done** del loop, utilizzare [Set](./set-node.md) con `join("\n")` sull'array accumulato (o equivalente) in un'unica stringa Markdown.
4. Puntare il `valueField` di **Chart Output** a tale stringa (oppure impostare il campo statico `text`).

Espressione di riga di esempio all'interno del loop (etichetta `processVideos`, elementi con `title` e `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown risultante:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Per una semplice lista crescente che inizia da 1, anteporre a ciascuna riga (`1.`, `2.`, `3.`) oppure utilizzare un loop con `$loop.index + 1`. Utilizzare le [liste puntate](#interactive-task-lists) (`- elemento`) quando non sono necessari i numeri.

## Come vengono risolti i dati

1. Se `dataPath` è impostato, il nodo segue quel percorso puntato all'interno dell'output a monte.
2. In caso contrario, cerca un array: una lista di primo livello, un array `data` o il primo campo con valore di tipo lista.
3. Per `table`, ciascuna riga diventa una riga di tabella utilizzando `columns` (o le chiavi della prima riga).
4. Per `numeric` e `gauge`, il valore proviene da `valueField` sulla prima riga (o dal primo campo numerico).
5. Per `scatter`, ciascuna riga diventa un punto `[xField, yField]`.
6. Per `text`, il messaggio viene preso da `valueField` sulla prima riga quando impostato, altrimenti dalla configurazione statica `text` (in caso contrario, dal primo campo stringa della prima riga).
## Esempio

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (valore singolo rispetto a un intervallo):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (punti X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (una barra suddivisa per quota + legenda percentuale):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (andamento multi-serie con riempimento):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge con gradiente per riga e relativi valori):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (messaggio markdown statico — non richiede righe a monte):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinamico — la stringa del messaggio viene prodotta a monte e recuperata tramite `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```

## Esempi di prompt AI

Quando si genera un widget con l'**AI**, prompt come questi si mappano in modo diretto su ciascun tipo:

- **Bar** — "Show monthly revenue for the last 6 months as a vertical bar chart with example data."
- **Line** — "Plot daily active users over the last 14 days as a line chart."
- **Area** — "Show memory and CPU usage over the last 24 hours as an area chart with two series. Use example data."
- **Pie** — "Break down execution status (success, error, cancelled) as a pie chart."
- **Table** — "Show the top 10 workflows by execution count as a scrollable table with name and runs columns. Use example data."
- **Numeric** — "Show today's total workflow executions as a single KPI with unit 'runs'. Use example data."
- **Gauge** — "Show current CPU usage as a gauge from 0 to 100 percent."
- **Scatter** — "Plot request latency versus payload size as a scatter chart with example data."
- **Proportion** — "Show my most used languages as a proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Use example data."
- **Bar gauge** — "Show free disk space per volume (sda1 to sda7) as a bar gauge in GB. Use example data."
- **Text** — "Add a text widget with a markdown checklist (one checked item, two unchecked), or list the 5 newest tutorial videos in descending order (5. down to 1.) with YouTube links — prefix each line with an explicit number (`5. Title`, `4. Title`, …)."

## Correlati

- [Scheda Dashboard](../tabs/dashboard-tab.md) — creare e organizzare i widget
- [Nodo Output](output-node.md) — nodo terminale per i workflow standard
