# Chart Output

**Chart Output**-noden er den terminale node i et [dashboard-widget](../tabs/dashboard-tab.md)-workflow. Den tager de rækker, der produceres af de opstrøms noder, og omdanner dem til en standardiseret chart-payload, som dashboardet gengiver.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 0 (terminal) |
| Output | Standardiseret chart-payload |

Placer denne node **sidst** i et dashboard-widget-workflow. Noden før den bør producere et array af rækkeobjekter, for eksempel:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Når der kun er eksempel-/prøvedata (ingen reel kilde), kan disse rækker produceres med en **Set**-node ved hjælp af `$array(dict(...), dict(...))` — for eksempel `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Brug **ikke** `${...}` eller bare `{...}` objektliteraler; Heym bygger objekter kun med `dict(key=value)`.

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, eller `hitl` |
| `orientation` | string | `vertical` eller `horizontal` (kun til bar charts) |
| `dataPath` | string | Dot-path til række-arrayet i det opstrøms output (f.eks. `data` eller `result.items`). Lad være tom for automatisk detektering. |
| `labelField` | string | Rækkekey, der bruges som kategorilabel (pie/bar/line) |
| `valueField` | string | Rækkekey, der bruges som numerisk værdi (pie/bar/line/numeric/gauge) |
| `series` | array | Valgfri multi-serie-definition `[{ "name": "Sent", "field": "sent" }]` for bar/line (tilsidesætter `valueField`) |
| `columns` | array | Valgfri kolonneliste til `table` (standard er keys fra den første række) |
| `xField` / `yField` | string | Rækkekeys til X- og Y-numeriske akser (scatter) |
| `min` / `max` | number | Numerisk interval til `gauge` (standard `0` / `100`) |
| `unit` | string | Valgfri enhed vist ved siden af en `numeric`- eller `gauge`-værdi |
| `text` | string | Markdown-besked til `text`-charttypen. Lad være tom og indstil `valueField` for at gengive en dynamisk besked hentet fra opstrøms data. |
| `title` | string | Valgfri charttitel |

## Charttyper

- **bar / line / area / pie** — kategoriske charts drevet af `labelField` + `valueField` (eller `series` til multi-serie bar/line/area). `area` er et fyldt trendchart.
- **table** — rå rækker gengivet som et scrollbart tabel ved hjælp af `columns`.
- **numeric** — en enkelt KPI-værdi fra den første række, med en valgfri `unit`.
- **gauge** — en enkelt værdi vist mod et `min`–`max`-interval (f.eks. en procentdel). Bruger `valueField`.
- **scatter** — X/Y-punkter fra `xField` og `yField` til korrelationsplot.
- **proportion** — en enkelt vandret bar opdelt i andele med en procentdel-legende (f.eks. et sprogfordeling). Bruger `labelField` + `valueField`.
- **barGauge** — en vandret gauge pr. række med en rød→grøn gradient og en værdi (f.eks. ledig diskplads). Bruger `labelField` + `valueField`, valgfri `unit` og `max` (standard er den største rækkeværdi).
- **text** — en markdown-besked (f.eks. en statusnote som "Sidste kørsel kl. 19:47"). Indsæt markdown i `text` til en statisk besked, eller lad `text` være tom og indstil `valueField` for at gengive en streng produceret opstrøms. Understøtter overskrifter, fed/kursiv, [lister](../nodes/chart-output-node.md#interactive-task-lists), links og inline-kode.
- **hitl** — et karussel af afventende menneskelige gennemgange. Overskriften viser `1/n pending`; venstre pil er deaktiveret på det første kort og højre pil på det sidste. Workflow-navnet åbner den pågældende kørsel på canvas. **Approve**, **Request changes**, og **Reject** afslutter den, og historikikonet ved siden af widgettitlen åbner den pågældende kørsel i historikdialogen på samme side. Denne charttype ignorerer opstrøms rækker, så widget-workflowet kun består af Chart Output-noden. Hver logget ind person ser gennemgange på workflows, de ejer.

### Interaktive opgavelister

Brug GitHub-flavored markdown-opgavelistesyntaks i det statiske `text`-felt:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

På [Dashboard](../tabs/dashboard-tab.md) gengives afkrydsningsfelter som klikbare kontroller (venlige til både mørk og lys tilstand). Ved at skifte et afkrydsningsfelt opdateres widget-workflowets `text`-felt, og ændringerne bevares ved opfriskning.

**Inline-redigering:** dobbeltklik på en opgavelabels tekst for at redigere den på stedet. Tryk Enter eller klik væk for at gemme; tryk Escape for at annullere. Fjern teksten helt for at fjerne det pågældende element fra listen.

**Links i opgaveelementer:** når en label indeholder et markdown-link (`[title](url)`), åbnes URL'en ved klik på linket uden at skifte afkrydsningsfeltet. Klik andetsteds på rækken for at skifte.

**Statisk tekst kun:** interaktivitet kræver GFM-opgavelistesyntaks (`- [ ]` / `- [x]`). Almindelige dynamiske statusbeskeder uden opgaveelementer forbliver skrivebeskyttede. Når markdown kommer fra `valueField`, kopieres den første skiftning ind i det statiske `text`-felt, så ændringerne bevares.
### Nummererede lister

Text-widgets gengiver markdown med **eksplicitte linjenumre bevaret**. Præfiks hver linje med det ønskede nummer (f.eks. `9.`, `8.`, `7.`). Heym omnummererer ikke linjer automatisk.

**Hvorfor eksplicitte numre?** Standard markdown-nummererede lister (`1.`, `2.`, `3.`) bliver til HTML `<ol>`-lister, som kun tæller **opad** fra det første nummer. En liste skrevet som `9.` / `8.` / `7.` ville blive vist som `9`, `10`, `11` i en normal markdown-gengivelse. Ved at præfikse hver linje med det tilsigtede nummer undgås dette.

**Faldende lister (f.eks. nyeste først):** byg markdown'en i en workflow-loop og beregn visningsnummeret per element:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typisk mønster:

1. Hent eller byg et array af elementer (f.eks. HTTP → `body.videos`).
2. [Loop](./loop-node.md) over arrayet; brug en [Variabel](./variable-node.md) med `.add()` i loop-kroppen til at tilføje én nummereret linje per iteration.
3. Efter loop'ets **done**-gren, [Sæt](./set-node.md) `join("\n")` på det akkumulerede array (eller tilsvarende) til en enkelt markdown-streng.
4. Peg **Chart Output** `valueField` på denne streng (eller indstil statisk `text`).

Eksempel på linjeudtryk inde i loop'et (label `processVideos`, elementer med `title` og `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Resulterende markdown:

```markdown
9. [Seneste video](https://www.youtube.com/watch?v=abc)
8. [Forrige video](https://www.youtube.com/watch?v=def)
1. [Ældste video](https://www.youtube.com/watch?v=xyz)
```

For en simpel stigende liste startende ved 1 kan man enten præfikse hver linje (`1.`, `2.`, `3.`) eller bruge en loop med `$loop.index + 1`. Brug [punktopstillinger](#interactive-task-lists) (`- element`) når numre ikke er nødvendige.

## Sådan løses data

1. Hvis `dataPath` er angivet, følger noden denne sti i den opstrøms output.
2. Ellers ledes der efter et array: en topniveau-liste, et `data`-array eller det første felt med listeværdi.
3. For `table` bliver hver række til en tabelrække ved brug af `columns` (eller første rækkes nøgler).
4. For `numeric` og `gauge` hentes værdien fra `valueField` på første række (eller det første numeriske felt).
5. For `scatter` bliver hver række til et `[xField, yField]`-punkt.
6. For `text` hentes beskeden fra `valueField` på første række hvis angivet, ellers fra den statiske `text`-konfiguration (ellers det første strengfelt i første række).

## Eksempel

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

Gauge (enkeltværdi vs. interval):

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

Scatter (X/Y-punkter):

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

Proportion (én søjle opdelt i andele + procentvis signatur):

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

Area (udfyldt multi-serie trend):

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

Bar gauge (gradient-gauge per række med værdier):

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

Text (statisk markdown-besked - kræver ingen opstrøms rækker):

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

Text (dynamisk - beskedstrengen produceres opstrøms og hentes via `valueField`):

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
## Eksempel på AI-prompts

Når der genereres en widget med **AI**, kan prompts som disse bruges til hver type:

- **Søjle** — "Vis månedlig omsætning for de sidste 6 måneder som en lodret søjlediagram med eksempeldata."
- **Linje** — "Plot daglige aktive brugere over de sidste 14 dage som en linjegraf."
- **Areal** — "Vis hukommelses- og CPU-forbrug over de sidste 24 timer som et arealdiagram med to serier. Brug eksempeldata."
- **Cirkel** — "Opdel udførelsestilstande (succes, fejl, annulleret) som et cirkeldiagram."
- **Tabel** — "Vis de 10 mest brugte workflows efter antal udførelser som en rullebar tabel med kolonner for navn og kørsler. Brug eksempeldata."
- **Numerisk** — "Vis dagens totale workflow-udførelser som en enkelt KPI med enheden 'kørsler'. Brug eksempeldata."
- **Måler** — "Vis nuværende CPU-forbrug som en måler fra 0 til 100 procent."
- **Punkt** — "Plot forespørgselslatens mod payload-størrelse som et punktdiagram med eksempeldata."
- **Proportion** — "Vis de mest brugte programmeringssprog som en proportionalitetslinje: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Brug eksempeldata."
- **Søjlemåler** — "Vis ledig diskplads pr. volumen (sda1 til sda7) som en søjlemåler i GB. Brug eksempeldata."
- **Tekst** — "Tilføj en tekstwidget med en markdown-checkliste (én afkrydset post, to ikke-afkrydsede), eller list de 5 nyeste tutorialvideoer i faldende rækkefølge (5. ned til 1.) med YouTube-links — præfiks hver linje med et eksplicit nummer (`5. Titel`, `4. Titel`, …)."

## Relateret

- [Dashboard-fane](../tabs/dashboard-tab.md) — byg og arranger widgets
- [Output-node](output-node.md) — terminalnode for almindelige workflows
