# Diagrammas izvade

**Diagrammas izvades** mezgls ir [vadības paneļa logrīka](../tabs/dashboard-tab.md) workflow termināļa mezgls. Tas paņem rindas, ko ģenerējuši iepriekšējie mezgli, un pārvērš tās standartizētā diagrammas payload, ko attēlo vadības panelis.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 0 (terminālis) |
| Izvade | Standartizēts diagrammas payload |

Novietojiet šo mezglu **pēdējo** vadības paneļa logrīka workflow. Mezglam pirms tā jāģenerē rindu objektu masīvs, piemēram:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Ja ir pieejami tikai piemēra/parauga dati (bez reāla avota), ģenerējiet šīs rindas ar **Set** mezglu, izmantojot `$array(dict(...), dict(...))` — piemēram, `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Neizmantojiet** `${...}` vai tukšus `{...}` objektu literāļus; Heym veido objektus tikai ar `dict(key=value)`.

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` vai `hitl` |
| `orientation` | string | `vertical` vai `horizontal` (tikai joslu diagrammām) |
| `dataPath` | string | Punktu ceļš uz rindu masīvu iepriekšējā mezgla izvadē (piem., `data` vai `result.items`). Atstājiet tukšu, lai noteiktu automātiski. |
| `labelField` | string | Rindas atslēga, ko izmanto kā kategorijas apzīmējumu (pie/bar/line) |
| `valueField` | string | Rindas atslēga, ko izmanto kā skaitlisko vērtību (pie/bar/line/numeric/gauge) |
| `series` | array | Neobligāta vairāku sēriju definīcija `[{ "name": "Sent", "field": "sent" }]` joslu/līniju diagrammām (aizstāj `valueField`) |
| `columns` | array | Neobligāts kolonnu saraksts `table` tipam (pēc noklusējuma pirmās rindas atslēgas) |
| `statusColumn` | string | Neobligāta `table` kolonna, kas tiek attēlota kā krāsaini [statusa žetoni](#status-chips). Tai jābūt vienai no rādītajām kolonnām. |
| `statusTones` | object | Neobligāts kartējums no statusa vērtības uz toni (`success`, `attention`, `failure`, `waiting`, `neutral`) vērtībām, kuras noklusējuma iestatījumi neaptver |
| `xField` / `yField` | string | Rindas atslēgas X un Y skaitliskajām asīm (scatter) |
| `min` / `max` | number | Skaitliskais diapazons `gauge` tipam (pēc noklusējuma `0` / `100`) |
| `unit` | string | Neobligāta mērvienība, kas parādīta blakus `numeric` vai `gauge` vērtībai |
| `text` | string | Markdown ziņojums `text` diagrammas tipam. Atstājiet tukšu un iestatiet `valueField`, lai attēlotu dinamisku ziņojumu, kas iegūts no iepriekšējiem datiem. |
| `title` | string | Neobligāts diagrammas virsraksts |

## Diagrammu tipi

- **bar / line / area / pie** — kategoriju diagrammas, ko nosaka `labelField` + `valueField` (vai `series` vairāku sēriju joslu/līniju/area diagrammām). `area` ir aizpildīta tendenču diagramma.
- **table** — neapstrādātas rindas, kas attēlotas ritināmā tabulā, izmantojot `columns`. Vienu kolonnu var attēlot kā [statusa žetonus](#status-chips), un rindas var atvērt [detalizētās informācijas lapu](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — viena KPI vērtība no pirmās rindas ar neobligāmu `unit`.
- **gauge** — viena vērtība, kas parādīta pret `min`–`max` diapazonu (piem., procentuālā daļa). Izmanto `valueField`.
- **scatter** — X/Y punkti no `xField` un `yField` korelācijas grafikiem.
- **proportion** — viena horizontāla josla, kas sadalīta daļās ar procentuālo leģendu (piem., valodu sadalījums). Izmanto `labelField` + `valueField`.
- **barGauge** — viens horizontāls mērītājs katrai rindai ar sarkanu→zaļu gradientu un vērtību (piem., brīvā diska vieta). Izmanto `labelField` + `valueField`, neobligāmu `unit` un `max` (pēc noklusējuma lielākā rindas vērtība).
- **text** — markdown ziņojums (piem., statusa piezīme, piemēram, "Last execution at 19:47"). Ievietojiet markdown `text` laukā statiskam ziņojumam vai atstājiet `text` tukšu un iestatiet `valueField`, lai attēlotu virkni, kas ģenerēta iepriekšējos mezglos. Atbalsta virsrakstus, treknrakstu/slīprakstu, [sarakstus](../nodes/chart-output-node.md#interactive-task-lists), saites un iekļauto kodu.
- **hitl** — karuselis ar Jūsu gaidošajām cilvēku pārbaudēm. Galvene rāda `1/n pending`; kreisā bultiņa ir atspējota pirmajā kartītē, bet labā bultiņa — pēdējā. Workflow nosaukums atver šo izpildi kanvā. **Approve**, **Request changes** un **Reject** to atrisina, un vēstures ikona blakus logrīka virsrakstam atver šo izpildi vēstures dialogā tajā pašā lapā. Šis diagrammas tips ignorē iepriekšējās rindas, tāpēc logrīka workflow sastāv tikai no Diagrammas izvades mezgla. Katra pierakstījusies persona redz pārbaudes workflow, kas pieder viņai.

### Interaktīvie uzdevumu saraksti

Izmantojiet GitHub formāta markdown uzdevumu saraksta sintaksi statiskajā `text` laukā:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

[Vadības panelī](../tabs/dashboard-tab.md) izvēles rūtiņas tiek attēlotas kā noklikšķināmas vadīklas (piemērotas tumšajam un gaišajam režīmam). Izvēles rūtiņas pārslēgšana atjaunina logrīka workflow `text` lauku un saglabājas pēc atsvaidzināšanas.

**Iekļautā rediģēšana:** veiciet dubultklikšķi uz uzdevuma vienuma apzīmējuma, lai to rediģētu vietā. Nospiediet Enter vai noklikšķiniet citur, lai saglabātu; nospiediet Escape, lai atceltu. Notīriet apzīmējumu pilnībā, lai noņemtu šo vienumu no saraksta.

**Saites uzdevumu vienumos:** ja apzīmējums satur markdown saiti (`[title](url)`), noklikšķinot uz saites, tiek atvērts URL, nepārslēdzot izvēles rūtiņu. Noklikšķiniet citur rindā, lai pārslēgtu.

**Tikai statisks teksts:** interaktivitātei ir nepieciešama GFM uzdevumu saraksta sintakse (`- [ ]` / `- [x]`). Vienkārši dinamiski statusa ziņojumi bez uzdevumu vienumiem paliek tikai lasāmi. Ja markdown nāk no `valueField`, pirmais pārslēgums to nokopē statiskajā `text` laukā, lai izmaiņas saglabātos.
### Numurēti saraksti

Teksta logrīki atveido markdown ar **saglabātiem skaidri norādītiem rindu numuriem**. Katras rindas sākumā pievienojiet numuru, kuru vēlaties parādīt (piem., `9.`, `8.`, `7.`). Heym nepārnumurē rindas Jūsu vietā.

**Kāpēc skaidri norādīti numuri?** Standarta markdown kārtotie saraksti (`1.`, `2.`, `3.`) kļūst par HTML `<ol>` sarakstiem, kas skaita tikai **uz augšu** no pirmā numura. Saraksts, kas rakstīts kā `9.` / `8.` / `7.`, parastā markdown atveidotājā tiktu parādīts kā `9`, `10`, `11`. Ja katras rindas sākumā tiek pievienots paredzētais numurs, tas tiek novērsts.

**Dilstoši saraksti (piem., jaunākie vispirms):** veidojiet markdown workflow cilpā un aprēķiniet attēlojamo numuru katram elementam:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tipisks modelis:

1. Iegūstiet vai izveidojiet elementu masīvu (piem., HTTP → `body.videos`).
2. [Loop](./loop-node.md) pār masīvu; ķermeņa iekšienē izmantojiet [Variable](./variable-node.md) ar `.add()`, lai katrā iterācijā pievienotu vienu numurētu rindu.
3. Pēc cilpas **done** zara izmantojiet [Set](./set-node.md), lai `join("\n")` uz uzkrātā masīva (vai ekvivalenta) pārvērstu to vienā markdown virknē.
4. Norādiet **Chart Output** `valueField` uz šo virkni (vai iestatiet statisku `text`).

Piemēra rindas izteiksme cilpas iekšienē (apzīmējums `processVideos`, elementi ar `title` un `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Rezultējošais markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Vienkāršam augošam sarakstam, kas sākas ar 1, vai nu pievienojiet katras rindas sākumā numuru (`1.`, `2.`, `3.`), vai izmantojiet cilpu ar `$loop.index + 1`. Izmantojiet [aizzīmju sarakstus](#interactive-task-lists) (`- item`), ja numuri nav nepieciešami.

## Statusa žetoni

`table` var parādīt vienu kolonnu kā krāsainus žetonus (chips). Mezglā iestatiet īpašību **Status column** (vai `statusColumn` DSL) uz kolonnas nosaukumu. Katra vērtība saņem vienu no pieciem toņiem, un izplatītākie vārdi to saņem automātiski bez konfigurēšanas:

| Tonis | Noklusējuma vārdi |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | jebkas cits |

Atbilstības pārbaude ignorē reģistru, `_` un `-`, tāpēc `IN_PROGRESS` un `in-progress` abi ir `waiting`. Pievienojiet **Status tones** citām vērtībām; ieraksts pārraksta noklusējuma toni attiecīgajai vērtībai:

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

Serveris katru vērtību pārvērš tās tonī, tāpēc Heym un Heym Work rāda vienādas krāsas.

## Detalizētās informācijas lapas: `$page.record`

Informācijas panelis, kas atvērts ar `?record=<value>`, palaiž katru logrīka Workflow ar šo vērtību kā `$page.record`. Tabulas rindas saite atver šādu lapu; skatiet [Detalizētās informācijas lapas](../tabs/dashboard-tab.md#detail-pages). Informācijas panelī, kas atvērts bez ieraksta, kā arī izteiksmju dialoglodziņā `$page.record` ir `null`. Mezglam ar iezīmi `page` ir prioritāte pār to.

Izmantojiet to, lai izgūtu konkrēto ierakstu, par kuru ir šī lapa, piemēram, [HTTP](./http-node.md) mezglā:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` ir pašas noklikšķinātās rindas vērtība, piemēram, `V-1002`, nevis objekts ar laukiem. Lai atrastu šo ierakstu [DataTable](./datatable-node.md), filtrējiet tās ieraksta kolonnu pēc vērtības: darbība `find` ar filtru `{"vendor_id": "$page.record"}`. Ceļš, piemēram, `$page.record.id`, neatgriež neko, tāpēc AI izveidots vai pielāgots logrīks šos laukus atmet un tā vietā nolasa `$page.record`.

Vērtība nāk no URL, kuru ikviens var rediģēt. Informācijas panelis pieņem tikai vērtības savā ieraksta formātā (pēc noklusējuma burti, cipari, `-`, `_` un `.`), taču tik un tā izturieties pret to kā pret neuzticamu ievadi: padodiet to vietās, kur mezgls ekranē vērtības, piemēram, kā HTTP vaicājuma parametru vai [DataTable](./datatable-node.md) vai ClickHouse filtra vērtību, un nekad neveidojiet vaicājuma tekstu, savienojot virknes ar to. Logrīki joprojām darbojas informācijas paneļa īpašnieka vārdā neatkarīgi no tā, kurš atver lapu.

## Kā dati tiek atrisināti

1. Ja `dataPath` ir iestatīts, mezgls seko šim punktu ceļam augšupējā izvadē.
2. Pretējā gadījumā tas meklē masīvu: augstākā līmeņa sarakstu, `data` masīvu vai pirmo lauku ar saraksta vērtību.
3. Rindas tieši no [Data Table](./datatable-node.md) mezgla (`{id, data, created_at}`) tiek nolasītas ar to kolonnām augšējā līmenī blakus `id`, tādējādi `labelField`, `valueField` un `columns` norāda pašas tabulas kolonnas.
4. `table` gadījumā katra rinda kļūst par tabulas rindu, izmantojot `columns` (vai pirmās rindas atslēgas). Izmantojot `statusColumn`, Payload satur arī katras šīs kolonnas vērtības toni.
5. `numeric` un `gauge` gadījumā vērtība tiek iegūta no `valueField` pirmajā rindā (vai pirmā skaitliskā lauka).
6. `scatter` gadījumā katra rinda kļūst par `[xField, yField]` punktu.
7. `text` gadījumā ziņojums tiek ņemts no `valueField` pirmajā rindā, ja tas ir iestatīts, pretējā gadījumā no statiskās `text` konfigurācijas (citādi no pirmās rindas pirmā virknes lauka).

## Piemērs

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

Gauge (viena vērtība pret diapazonu):

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

Scatter (X/Y punkti):

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

Proportion (viena josla, kas sadalīta pa daļām + procentuālā leģenda):

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

Area (aizpildīta daudzrindu tendence):

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

Bar gauge (gradienta gauge katrai rindai ar vērtībām):

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

Text (statisks markdown ziņojums — augšupējās rindas nav nepieciešamas):

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

Text (dinamisks — ziņojuma virkne tiek izveidota augšupēji un iegūta ar `valueField`):

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
## Piemēri AI promptiem

Ģenerējot widget ar **AI**, šādi prompti skaidri atbilst katram tipam:

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

## Saistītais

- [Dashboard tab](../tabs/dashboard-tab.md) — veidojiet un kārtojiet widgetus
- [Output node](output-node.md) — termināļa mezgls parastiem workflow
