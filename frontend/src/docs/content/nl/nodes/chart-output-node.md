# Chart Output

De **Chart Output**-node is de terminale node van een [dashboardwidget](../tabs/dashboard-tab.md)-workflow. De node neemt de rijen die door de upstream-nodes zijn geproduceerd en zet deze om in een gestandaardiseerde chart-payload die het dashboard rendert.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 0 (terminaal) |
| Uitvoer | Gestandaardiseerde chart-payload |

Plaats deze node **als laatste** in een dashboardwidget-workflow. De node ervoor dient een array van rij-objecten te produceren, bijvoorbeeld:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Wanneer uitsluitend voorbeeld-/samplegegevens beschikbaar zijn (geen echte bron), produceer deze rijen dan met een **Set**-node met behulp van `$array(dict(...), dict(...))` — bijvoorbeeld `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Gebruik **geen** `${...}` of kale `{...}` object-literals; Heym bouwt objecten uitsluitend met `dict(key=value)`.

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` of `hitl` |
| `orientation` | string | `vertical` of `horizontal` (alleen voor staafdiagrammen) |
| `dataPath` | string | Dot-pad naar de rijen-array binnen de upstream-uitvoer (bijv. `data` of `result.items`). Laat leeg voor automatische detectie. |
| `labelField` | string | Rijsleutel die als categorielabel wordt gebruikt (pie/bar/line) |
| `valueField` | string | Rijsleutel die als numerieke waarde wordt gebruikt (pie/bar/line/numeric/gauge) |
| `series` | array | Optionele multi-series-definitie `[{ "name": "Sent", "field": "sent" }]` voor bar/line (overschrijft `valueField`) |
| `columns` | array | Optionele kolomlijst voor `table` (standaard de sleutels van de eerste rij) |
| `statusColumn` | string | Optionele `table`-kolom die wordt weergegeven als gekleurde [statuschips](#status-chips). Dit moet een van de getoonde kolommen zijn. |
| `statusTones` | object | Optionele koppeling van een statuswaarde aan een tint (`success`, `attention`, `failure`, `waiting`, `neutral`) voor waarden die niet onder de standaardwaarden vallen |
| `xField` / `yField` | string | Rijsleutels voor de X- en Y-numerieke assen (scatter) |
| `min` / `max` | number | Numeriek bereik voor `gauge` (standaard `0` / `100`) |
| `unit` | string | Optionele eenheid die naast een `numeric`- of `gauge`-waarde wordt weergegeven |
| `text` | string | Markdown-bericht voor het `text`-charttype. Laat leeg en stel `valueField` in om een dynamisch bericht te renderen dat uit upstream-gegevens wordt gehaald. |
| `title` | string | Optionele charttitel |

## Charttypen

- **bar / line / area / pie** — categorische charts aangestuurd door `labelField` + `valueField` (of `series` voor multi-series bar/line/area). `area` is een gevulde trendgrafiek.
- **table** — ruwe rijen gerenderd als een scrollbare tabel met behulp van `columns`. Eén kolom kan worden weergegeven als [statuschips](#status-chips) en rijen kunnen een [detailpagina](../tabs/dashboard-tab.md#detail-pages) openen.
- **numeric** — een enkele KPI-waarde uit de eerste rij, met een optionele `unit`.
- **gauge** — een enkele waarde weergegeven tegen een `min`–`max`-bereik (bijv. een percentage). Gebruikt `valueField`.
- **scatter** — X/Y-punten uit `xField` en `yField` voor correlatieplots.
- **proportion** — een enkele horizontale balk opgesplitst in aandelen met een percentagelegenda (bijv. een taalverdeling). Gebruikt `labelField` + `valueField`.
- **barGauge** — één horizontale gauge per rij met een rood→groen verloop en een waarde (bijv. vrije schijfruimte). Gebruikt `labelField` + `valueField`, optionele `unit` en `max` (standaard de grootste rijwaarde).
- **text** — een markdown-bericht (bijv. een statusnotitie zoals "Last execution at 19:47"). Plaats de markdown in `text` voor een statisch bericht, of laat `text` leeg en stel `valueField` in om een string te renderen die upstream wordt geproduceerd. Ondersteunt koppen, vet/cursief, [lijsten](../nodes/chart-output-node.md#interactive-task-lists), links en inline code.
- **hitl** — een carrousel van uw openstaande human reviews. De kop toont `1/n pending`; de linkpijl is uitgeschakeld op de eerste kaart en de rechterpijl op de laatste. De workflownaam opent die uitvoering op het canvas. **Approve**, **Request changes** en **Reject** lossen deze op, en het geschiedenis-pictogram naast de widgettitel opent die uitvoering in het geschiedenis-dialoogvenster op dezelfde pagina. Dit charttype negeert upstream-rijen, dus de widget-workflow bestaat alleen uit de Chart Output-node. Elke aangemelde persoon ziet de reviews van workflows die hij of zij bezit.

### Interactieve takenlijsten

Gebruik GitHub-flavored markdown-syntaxis voor takenlijsten in het statische `text`-veld:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Op het [Dashboard](../tabs/dashboard-tab.md) worden selectievakjes gerenderd als klikbare bedieningselementen (geschikt voor donkere en lichte modus). Het omzetten van een selectievakje werkt het `text`-veld van de widget-workflow bij en blijft behouden na verversen.

**Inline bewerken:** dubbelklik op het label van een taakitem om het ter plaatse te bewerken. Druk op Enter of klik weg om op te slaan; druk op Escape om te annuleren. Maak het label volledig leeg om dat item uit de lijst te verwijderen.

**Links in taakitems:** wanneer een label een markdown-link bevat (`[title](url)`), opent een klik op de link de URL zonder het selectievakje om te zetten. Klik elders op de rij om om te zetten.

**Alleen statische tekst:** interactiviteit vereist GFM-syntaxis voor takenlijsten (`- [ ]` / `- [x]`). Gewone dynamische statusberichten zonder taakitems blijven alleen-lezen. Wanneer markdown afkomstig is uit `valueField`, kopieert de eerste omzetting deze naar het statische `text`-veld zodat wijzigingen behouden blijven.
### Genummerde lijsten

Text-widgets renderen markdown met **expliciete regelnummers behouden**. Zet het gewenste nummer als prefix voor elke regel (bijv. `9.`, `8.`, `7.`). Heym hernummert de regels niet voor u.

**Waarom expliciete nummers?** Standaard markdown geordende lijsten (`1.`, `2.`, `3.`) worden HTML `<ol>`-lijsten, die alleen **omhoog** tellen vanaf het eerste nummer. Een lijst geschreven als `9.` / `8.` / `7.` zou in een normale markdown-renderer worden weergegeven als `9`, `10`, `11`. Door elke regel van het beoogde nummer te voorzien, wordt dat voorkomen.

**Aflopende lijsten (bijv. nieuwste eerst):** bouw de markdown in een workflow-lus en bereken het weergavenummer per item:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typisch patroon:

1. Haal een array van items op of bouw deze op (bijv. HTTP → `body.videos`).
2. [Loop](./loop-node.md) over de array; gebruik binnen de body een [Variable](./variable-node.md) met `.add()` om één genummerde regel per iteratie toe te voegen.
3. Na de **done**-branch van de lus, [Set](./set-node.md) `join("\n")` op de verzamelde array (of equivalent) naar één markdown-string.
4. Richt **Chart Output** `valueField` op die string (of stel statische `text` in).

Voorbeeld van een regel-expressie binnen de lus (label `processVideos`, items met `title` en `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Resulterende markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Voor een eenvoudige oplopende lijst die bij 1 begint, zet u een prefix voor elke regel (`1.`, `2.`, `3.`) of gebruikt u een lus met `$loop.index + 1`. Gebruik [bullet lists](#interactive-task-lists) (`- item`) wanneer u geen nummers nodig hebt.

## Statuschips

Een `table` kan één kolom weergeven als gekleurde chips. Stel **Status column** in de eigenschappen van de node (of `statusColumn` in de DSL) in op een kolomnaam. Elke waarde krijgt een van de vijf tinten, en veelvoorkomende woorden krijgen er automatisch een zonder configuratie:

| Tint | Standaardwoorden |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | al het overige |

Het vergelijken negeert hoofdletters/kleine letters, `_` en `-`, zodat `IN_PROGRESS` en `in-progress` beide `waiting` zijn. Voeg **Status tones** toe voor andere waarden; een item overschrijft de standaardwaarde voor die waarde:

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

De server zet elke waarde om naar de bijbehorende tint, zodat Heym en Heym Work dezelfde kleuren tonen.

## Detailpagina's: `$page.record`

Een dashboard dat wordt geopend met `?record=<value>` voert elke widget-Workflow uit met die waarde als `$page.record`. Een rijlink in een tabel opent zo'n pagina; zie [Detailpagina's](../tabs/dashboard-tab.md#detail-pages). Op een dashboard dat zonder record is geopend en in het expressiedialoogvenster is `$page.record` gelijk aan `null`. Een node met het label `page` heeft voorrang.

Gebruik dit om het specifieke record op te halen waar de pagina over gaat, bijvoorbeeld in een [HTTP](./http-node.md)-node:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` is de waarde van de aangeklikte rij zelf, zoals `V-1002`, en geen object met velden. Om dat record in een [DataTable](./datatable-node.md) te vinden, filter je de recordkolom op die waarde: bewerking `find` met het filter `{"vendor_id": "$page.record"}`. Een pad zoals `$page.record.id` levert niets op, dus een widget die door AI wordt gebouwd of verfijnd laat zulke velden vallen en leest in plaats daarvan `$page.record`.

De waarde komt uit een URL die iedereen kan aanpassen. Het dashboard accepteert alleen waarden in het ingestelde recordformaat (standaard letters, cijfers, `-`, `_` en `.`), maar behandel deze desondanks als onvertrouwde invoer: geef de waarde door op plekken waar de node waarden escapet, zoals een HTTP-queryparameter of een filterwaarde voor [DataTable](./datatable-node.md) of ClickHouse, en bouw nooit querytekst op door strings ermee samen te voegen. Widgets worden altijd uitgevoerd als de eigenaar van het dashboard, ongeacht wie de pagina opent.

## Hoe gegevens worden geresolveerd

1. Als `dataPath` is ingesteld, volgt de node dat dot-pad in de upstream-uitvoer.
2. Anders wordt er gezocht naar een array: een top-level lijst, een `data`-array, of het eerste veld met een lijstwaarde.
3. Rijen die rechtstreeks afkomstig zijn van een [Data Table](./datatable-node.md)-node (`{id, data, created_at}`) worden gelezen met hun kolommen op het hoogste niveau naast `id`, zodat `labelField`, `valueField` en `columns` direct naar de eigen kolommen van de tabel verwijzen.
4. Voor `table` wordt elke rij een tabelrij met behulp van `columns` (of de keys van de eerste rij). Met `statusColumn` bevat de Payload ook de tint van elke waarde in die kolom.
5. Voor `numeric` en `gauge` komt de waarde uit `valueField` op de eerste rij (of het eerste numerieke veld).
6. Voor `scatter` wordt elke rij een `[xField, yField]`-punt.
7. Voor `text` wordt het bericht overgenomen uit `valueField` op de eerste rij indien ingesteld, anders uit de statische `text`-configuratie (anders het eerste stringveld van de eerste rij).

## Voorbeeld

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

Gauge (één waarde versus een bereik):

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

Scatter (X/Y-punten):

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

Proportie (één balk opgesplitst naar aandeel + percentagelegenda):

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

Area (gevulde multi-serie trend):

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

Bar gauge (gradient-gauge per rij met waarden):

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

Text (een statisch markdown-bericht — geen upstream-rijen vereist):

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

Text (dynamisch — de berichtstring wordt upstream geproduceerd en opgehaald via `valueField`):

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
## Voorbeeld AI-prompts

Bij het genereren van een widget met **AI** sluiten prompts zoals deze naadloos aan op elk type:

- **Bar** — "Toon de maandelijkse omzet voor de laatste 6 maanden als een verticale staafdiagram met voorbeeldgegevens."
- **Line** — "Plot dagelijkse actieve gebruikers over de laatste 14 dagen als een lijndiagram."
- **Area** — "Toon geheugen- en CPU-gebruik over de laatste 24 uur als een vlakdiagram met twee reeksen. Gebruik voorbeeldgegevens."
- **Pie** — "Splits de uitvoeringsstatus (geslaagd, fout, geannuleerd) uit als een cirkeldiagram."
- **Table** — "Toon de top 10 workflows op basis van uitvoeringsaantal als een scrollbare tabel met kolommen voor naam en uitvoeringen. Gebruik voorbeeldgegevens."
- **Numeric** — "Toon het totale aantal workflow-uitvoeringen van vandaag als één KPI met eenheid 'runs'. Gebruik voorbeeldgegevens."
- **Gauge** — "Toon het huidige CPU-gebruik als een gauge van 0 tot 100 procent."
- **Scatter** — "Plot de aanvraaglatentie tegenover de payload-grootte als een spreidingsdiagram met voorbeeldgegevens."
- **Proportion** — "Toon mijn meest gebruikte talen als een proportiebalk: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Gebruik voorbeeldgegevens."
- **Bar gauge** — "Toon de vrije schijfruimte per volume (sda1 tot sda7) als een staafgauge in GB. Gebruik voorbeeldgegevens."
- **Text** — "Voeg een tekstwidget toe met een markdown-checklist (één aangevinkt item, twee niet-aangevinkte), of vermeld de 5 nieuwste tutorialvideo's in aflopende volgorde (5. tot 1.) met YouTube-links — zet een expliciet nummer voor elke regel (`5. Titel`, `4. Titel`, …)."

## Gerelateerd

- [Dashboard-tab](../tabs/dashboard-tab.md) — bouw en rangschik widgets
- [Uitvoer-node](output-node.md) — eind-node voor reguliere workflows
