# Sortida de gràfic

El node **Sortida de gràfic** és el node terminal d'un workflow de [giny de tauler](../tabs/dashboard-tab.md). Pren les files produïdes pels nodes upstream i les converteix en un payload de gràfic estandarditzat que el tauler renderitza.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 0 (terminal) |
| Sortida | Payload de gràfic estandarditzat |

Col·loqueu aquest node **al final** d'un workflow de giny de tauler. El node anterior hauria de produir un array d'objectes de fila, per exemple:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Quan només disposeu de dades d'exemple (sense cap font real), produïu aquestes files amb un node **Set** utilitzant `$array(dict(...), dict(...))` — per exemple `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **No** utilitzeu `${...}` ni literals d'objecte `{...}` sense més; Heym construeix objectes només amb `dict(key=value)`.

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` o `hitl` |
| `orientation` | string | `vertical` o `horizontal` (només per a gràfics de barres) |
| `dataPath` | string | Camí amb punts fins a l'array de files dins de la sortida upstream (per exemple `data` o `result.items`). Deixeu-lo buit per detectar-lo automàticament. |
| `labelField` | string | Clau de fila utilitzada com a etiqueta de categoria (pie/bar/line) |
| `valueField` | string | Clau de fila utilitzada com a valor numèric (pie/bar/line/numeric/gauge) |
| `series` | array | Definició opcional de múltiples sèries `[{ "name": "Sent", "field": "sent" }]` per a bar/line (substitueix `valueField`) |
| `columns` | array | Llista opcional de columnes per a `table` (per defecte, les claus de la primera fila) |
| `statusColumn` | string | Columna opcional de `table` renderitzada com a [xips d'estat](#status-chips) de colors. Ha de ser una de les columnes mostrades. |
| `statusTones` | object | Mapa opcional d'un valor d'estat a un to (`success`, `attention`, `failure`, `waiting`, `neutral`) per als valors que els predeterminats no cobreixen |
| `xField` / `yField` | string | Claus de fila per als eixos numèrics X i Y (scatter) |
| `min` / `max` | number | Rang numèric per a `gauge` (per defecte `0` / `100`) |
| `unit` | string | Unitat opcional mostrada al costat d'un valor `numeric` o `gauge` |
| `text` | string | Missatge Markdown per al tipus de gràfic `text`. Deixeu-lo buit i establiu `valueField` per renderitzar un missatge dinàmic extret de les dades upstream. |
| `title` | string | Títol opcional del gràfic |

## Tipus de gràfic

- **bar / line / area / pie** — gràfics categòrics controlats per `labelField` + `valueField` (o `series` per a bar/line/area de múltiples sèries). `area` és un gràfic de tendència amb farciment.
- **table** — files en brut renderitzades com una taula desplaçable utilitzant `columns`. Una columna es pot renderitzar com a [xips d'estat](#status-chips) i les files poden obrir una [pàgina de detall](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — un únic valor KPI de la primera fila, amb una `unit` opcional.
- **gauge** — un únic valor mostrat dins d'un rang `min`–`max` (per exemple, un percentatge). Utilitza `valueField`.
- **scatter** — punts X/Y a partir de `xField` i `yField` per a gràfics de correlació.
- **proportion** — una única barra horitzontal dividida en porcions amb una llegenda de percentatges (per exemple, un desglossament per idioma). Utilitza `labelField` + `valueField`.
- **barGauge** — un gauge horitzontal per fila amb un gradient de vermell a verd i un valor (per exemple, espai lliure de disc). Utilitza `labelField` + `valueField`, `unit` i `max` opcionals (per defecte, el valor de fila més gran).
- **text** — un missatge markdown (per exemple, una nota d'estat com "Last execution at 19:47"). Poseu el markdown a `text` per a un missatge estàtic, o deixeu `text` buit i establiu `valueField` per renderitzar una cadena produïda upstream. Admet encapçalaments, negreta/cursiva, [llistes](../nodes/chart-output-node.md#interactive-task-lists), enllaços i codi en línia.
- **hitl** — un carrusel de les vostres revisions humanes pendents. L'encapçalament mostra `1/n pending`; la fletxa esquerra està desactivada a la primera targeta i la fletxa dreta a l'última. El nom del workflow obre aquesta execució al canvas. **Approve**, **Request changes** i **Reject** la resolen, i la icona d'historial al costat del títol del giny obre aquesta execució al diàleg d'historial de la mateixa pàgina. Aquest tipus de gràfic ignora les files upstream, de manera que el workflow del giny és només el node Sortida de gràfic. Cada persona autenticada veu les revisions dels workflows que posseeix.
### Llistes de tasques interactives

Utilitzeu la sintaxi de llistes de tasques Markdown de GitHub al camp estàtic `text`:

```markdown
- [x] Opció 1
- [ ] Opció 2
- [ ] Opció 3
```

Al [Tauler](../tabs/dashboard-tab.md), les caselles de selecció es mostren com a controls clicables (compatibles amb mode fosc i clar). En activar o desactivar una casella, s'actualitza el camp `text` del workflow del widget i es conserva entre actualitzacions.

**Edició en línia:** feu doble clic a l'etiqueta d'un element de tasca per editar-lo in situ. Premeu Enter o feu clic fora per desar; premeu Escape per cancel·lar. Esborreu completament l'etiqueta per eliminar aquest element de la llista.

**Enllaços als elements de tasca:** quan una etiqueta conté un enllaç Markdown (`[títol](url)`), fer clic a l'enllaç obre la URL sense activar o desactivar la casella de selecció. Feu clic a qualsevol altre lloc de la fila per activar-la o desactivar-la.

**Només text estàtic:** la interactivitat requereix la sintaxi de llistes de tasques GFM (`- [ ]` / `- [x]`). Els missatges d'estat dinàmics sense elements de tasca romanen de només lectura. Quan el Markdown prové de `valueField`, la primera activació o desactivació el copia al camp estàtic `text` perquè els canvis es conservin.

### Llistes numerades

Els widgets de text renderitzen el Markdown amb els **números de línia explícits conservats**. Prefixeu cada línia amb el número que voleu mostrar (p. ex. `9.`, `8.`, `7.`). Heym no renumera les línies per vosaltres.

**Per què números explícits?** Les llistes ordenades estàndard de Markdown (`1.`, `2.`, `3.`) es converteixen en llistes HTML `<ol>`, que només compten **cap amunt** a partir del primer número. Una llista escrita com `9.` / `8.` / `7.` es mostraria com `9`, `10`, `11` en un renderitzador de Markdown normal. Prefixar cada línia amb el número desitjat ho evita.

**Llistes descendents (p. ex. les més recents primer):** construïu el Markdown en un bucle de workflow i calculeu el número de visualització per a cada element:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Patró típic:

1. Obteniu o construïu una matriu d'elements (p. ex. HTTP → `body.videos`).
2. [Bucle](./loop-node.md) sobre la matriu; dins del cos, utilitzeu una [Variable](./variable-node.md) amb `.add()` per afegir una línia numerada per iteració.
3. Després de la branca **done** del bucle, [Definiu](./set-node.md) `join("\n")` sobre la matriu acumulada (o equivalent) en una única cadena Markdown.
4. Apunteu **Chart Output** `valueField` a aquesta cadena (o definiu `text` estàtic).

Expressió de línia d'exemple dins del bucle (etiqueta `processVideos`, elements amb `title` i `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown resultant:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Per a una llista ascendent simple que comenci per 1, prefixeu cada línia (`1.`, `2.`, `3.`) o utilitzeu un bucle amb `$loop.index + 1`. Utilitzeu [llistes de pics](#interactive-task-lists) (`- item`) quan no necessiteu números.

## Xips d'estat

Una `table` pot mostrar una columna com a xips de colors. Establiu **Status column** a les propietats del node (o `statusColumn` al DSL) amb el nom d'una columna. Cada valor rep un dels cinc tons, i les paraules habituals en reben un sense configuració:

| To | Paraules predeterminades |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | qualsevol altre valor |

La coincidència ignora majúscules/minúscules, `_` i `-`, de manera que `IN_PROGRESS` i `in-progress` són tots dos `waiting`. Afegiu **Status tones** per a altres valors; una entrada substitueix el valor predeterminat per a aquest valor:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

El servidor resol cada valor al seu to, de manera que Heym i Heym Work mostren els mateixos colors.

## Pàgines de detall: `$page.record`

Un tauler obert amb `?record=<value>` executa cada Workflow de giny amb aquest valor com a `$page.record`. Un enllaç de fila de taula obre una pàgina d'aquest tipus; vegeu [Pàgines de detall](../tabs/dashboard-tab.md#detail-pages). Al tauler obert sense cap registre i al diàleg d'expressions, `$page.record` és `null`. Un node etiquetat com a `page` té prioritat sobre ell.

Utilitzeu-lo per obtenir l'únic registre sobre el qual tracta la pàgina, per exemple en un node [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` és el propi valor de la fila clicada, com ara `V-1002`, no un objecte amb camps. Per trobar aquest registre en una [DataTable](./datatable-node.md), filtreu la seva columna de registre pel valor: operació `find` amb el filtre `{"vendor_id": "$page.record"}`. Un camí com ara `$page.record.id` no es resol en res, de manera que un giny que la IA construeixi o afini descarta aquests camps i llegeix `$page.record` en lloc seu.

El valor prové d'un URL que qualsevol pot editar. El tauler només accepta valors en el seu format de registre (lletres, dígits, `-`, `_` i `.` per defecte), però tracteu-lo igualment com una entrada no fiable: passeu-lo on el node escapi valors, com ara un paràmetre de consulta HTTP o un valor de filtre de [DataTable](./datatable-node.md) o ClickHouse, i no construïu mai text de consulta concatenant-hi cadenes. Els ginys continuen executant-se com a propietari del tauler, sigui qui sigui qui obri la pàgina.

## Com es resolen les dades

1. Si `dataPath` està definit, el node segueix aquest camí de punts dins la sortida ascendent.
2. En cas contrari, busca una matriu: una llista de nivell superior, una matriu `data`, o el primer camp amb valor de llista.
3. Les files que provenen directament d'un node [Data Table](./datatable-node.md) (`{id, data, created_at}`) es llegeixen amb les seves columnes al nivell superior al costat d'`id`, de manera que `labelField`, `valueField` i `columns` anomenen les pròpies columnes de la taula.
4. Per a `table`, cada fila es converteix en una fila de taula utilitzant `columns` (o les claus de la primera fila). Amb `statusColumn`, el Payload també inclou el to de cada valor d'aquesta columna.
5. Per a `numeric` i `gauge`, el valor prové de `valueField` a la primera fila (o del primer camp numèric).
6. Per a `scatter`, cada fila es converteix en un punt `[xField, yField]`.
7. Per a `text`, el missatge s'obté de `valueField` a la primera fila quan està definit; en cas contrari, de la configuració estàtica `text` (o, si no, del primer camp de cadena de la primera fila).
## Exemple

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

Gauge (valor únic versus un interval):

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

Scatter (punts X/Y):

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

Proportion (una barra dividida per quota + llegenda de percentatges):

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

Area (tendència multifil·la amb farciment):

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

Bar gauge (gauge de degradat per fila amb valors):

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

Text (un missatge markdown estàtic — no requereix files d'origen):

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

Text (dinàmic — la cadena del missatge es genera aigües amunt i s'obté mitjançant `valueField`):

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

## Exemples de prompts d'IA

En generar un widget amb **IA**, prompts com aquests es corresponen clarament amb cada tipus:

- **Bar** — "Mostra els ingressos mensuals dels últims 6 mesos com un gràfic de barres vertical amb dades d'exemple."
- **Line** — "Representa els usuaris actius diaris durant els últims 14 dies com un gràfic de línies."
- **Area** — "Mostra l'ús de memòria i CPU durant les últimes 24 hores com un gràfic d'àrea amb dues sèries. Utilitza dades d'exemple."
- **Pie** — "Desglossa l'estat d'execució (èxit, error, cancel·lat) com un gràfic circular."
- **Table** — "Mostra els 10 workflows principals per nombre d'execucions com una taula desplaçable amb les columnes name i runs. Utilitza dades d'exemple."
- **Numeric** — "Mostra el total d'execucions de workflows d'avui com un únic KPI amb unitat 'runs'. Utilitza dades d'exemple."
- **Gauge** — "Mostra l'ús actual de CPU com un gauge de 0 a 100 per cent."
- **Scatter** — "Representa la latència de les peticions enfront de la mida del payload com un gràfic de dispersió amb dades d'exemple."
- **Proportion** — "Mostra els meus llenguatges més utilitzats com una barra de proporció: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Utilitza dades d'exemple."
- **Bar gauge** — "Mostra l'espai lliure de disc per volum (sda1 a sda7) com un bar gauge en GB. Utilitza dades d'exemple."
- **Text** — "Afegeix un widget de text amb una llista de verificació markdown (un element marcat, dos sense marcar), o llista els 5 vídeos de tutorial més recents en ordre descendent (5. fins a 1.) amb enllaços de YouTube — prefixeu cada línia amb un número explícit (`5. Title`, `4. Title`, …)."

## Relacionat

- [Dashboard tab](../tabs/dashboard-tab.md) — creeu i organitzeu widgets
- [Output node](output-node.md) — node terminal per a workflows habituals
