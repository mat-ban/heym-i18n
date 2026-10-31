# Diagramutdata

Noden **Diagramutdata** är slutnoden i ett workflow för en [dashboard-widget](../tabs/dashboard-tab.md). Den tar raderna som produceras av de uppströms noderna och omvandlar dem till en standardiserad diagram-payload som dashboarden renderar.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 0 (slutnod) |
| Utdata | Standardiserad diagram-payload |

Placera denna nod **sist** i ett workflow för en dashboard-widget. För entitetsrelationer producerar noden före den ett grafobjekt (se [Entity relationships](#entity-relationships-db)). Andra datadrivna diagram använder en array av radobjekt, till exempel:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

När endast exempel-/provdata finns tillgänglig (ingen verklig källa) produceras dessa rader med en **Set**-nod med `$array(dict(...), dict(...))` — till exempel `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Använd **inte** `${...}` eller enkla `{...}`-objektliteraler; Heym bygger objekt endast med `dict(key=value)`.

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` eller `hitl` |
| `orientation` | string | `vertical` eller `horizontal` (endast stapeldiagram) |
| `dataPath` | string | Punktseparerad sökväg till radarrayen (eller grafobjekt för `erDiagram`) i den uppströms nodens utdata (t.ex. `data` eller `result.items`). Lämna tom för automatisk identifiering. |
| `labelField` | string | Radnyckel som används som kategorietikett (pie/bar/line) |
| `valueField` | string | Radnyckel som används som numeriskt värde (pie/bar/line/numeric/gauge) |
| `series` | array | Valfri definition för flera serier `[{ "name": "Sent", "field": "sent" }]` för bar/line (åsidosätter `valueField`) |
| `columns` | array | Valfri kolumnlista för `table` (standardvärdet är nycklarna i den första raden) |
| `statusColumn` | string | Valfri `table`-kolumn som renderas som färgade [statusbrickor](#status-chips). Måste vara en av de visade kolumnerna. |, och med `linkColumn` innehåller den länkkolumnen och knapptexten.
| `statusTones` | object | Valfri mappning från ett statusvärde till en ton (`success`, `attention`, `failure`, `waiting`, `neutral`) för värden som inte täcks av standardvärdena |
| `linkColumn` | string | Valfri `table`-kolumn vars celler innehåller en URL och visas som en [länkknapp](#link-buttons) som öppnar den i en ny flik. Den måste vara en av de visade kolumnerna. |
| `linkLabel` | string | Valfri text för länkknappen. Lämnas den tom visar knappen bara en länkikon. |
| `xField` / `yField` | string | Radnycklar för de numeriska X- och Y-axlarna (scatter) |
| `min` / `max` | number | Numeriskt intervall för `gauge` (standard `0` / `100`) |
| `unit` | string | Valfri enhet som visas bredvid ett `numeric`- eller `gauge`-värde |
| `text` | string | Markdown-meddelande för diagramtypen `text`. Lämna tomt och ange `valueField` för att rendera ett dynamiskt meddelande hämtat från uppströms data. |
| `title` | string | Valfri diagramtitel |
| `hitlWorkflowId` | string | Endast `hitl`. Visar bara granskningarna för detta Workflow. Lämnas fältet tomt visar widgeten alla granskningar. |
| `hitlNodeId` | string | Endast `hitl`. Begränsar `hitlWorkflowId` till ett steg: en Agent med mänsklig granskning eller ett Slack-steg för godkännande, knappar eller formulär. |

## Diagramtyper

- **bar / line / area / pie** — kategoriska diagram som styrs av `labelField` + `valueField` (eller `series` för flera serier i bar/line/area). `area` är ett fyllt trenddiagram.
- **table** — råa rader renderade som en rullningsbar tabell med `columns`. En kolumn kan renderas som [statusbrickor](#status-chips) och rader kan öppna en [detaljsida](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — ett enskilt KPI-värde från den första raden, med valfri `unit`.
- **gauge** — ett enskilt värde som visas mot ett `min`–`max`-intervall (t.ex. en procentandel). Använder `valueField`.
- **scatter** — X/Y-punkter från `xField` och `yField` för korrelationsdiagram.
- **proportion** — en enskild horisontell stapel uppdelad i andelar med en procentteckenförklaring (t.ex. en språkfördelning). Använder `labelField` + `valueField`.
- **barGauge** — en horisontell gauge per rad med en röd→grön gradient och ett värde (t.ex. ledigt diskutrymme). Använder `labelField` + `valueField`, valfri `unit` och `max` (standardvärdet är det största radvärdet).
- **gantt** — uppgiftsscheman med datum, förlopp och beroenden; se [Gantt-scheman](#gantt-schedules).
- **erDiagram** — databasentiteter, fält, nycklar och relationer; se [Entity relationships](#entity-relationships-db).
- **text** — ett markdown-meddelande (t.ex. en statusnotis som "Senaste körning kl. 19:47"). Placera markdown-texten i `text` för ett statiskt meddelande, eller lämna `text` tomt och ange `valueField` för att rendera en sträng som producerats uppströms. Stöder rubriker, fetstil/kursiv stil, [listor](../nodes/chart-output-node.md#interactive-task-lists), länkar och inline-kod.
- **hitl** — en karusell med väntande mänskliga granskningar. Rubriken visar `1/n pending`; vänsterpilen är inaktiverad på det första kortet och högerpilen på det sista. Workflow-namnet öppnar den körningen på canvas. **Approve**, **Request changes** och **Reject** löser den, och historikikonen bredvid widgettiteln öppnar den körningen i historikdialogen på samma sida. Denna diagramtyp ignorerar uppströms rader, så widgetens workflow består endast av noden Diagramutdata. Varje inloggad person ser granskningarna för de workflows som personen äger. Välj ett **Workflow** (och **Select agent** när det har flera granskningssteg) i nodens egenskaper eller widgetens inställningar för att i stället visa det Workflowets granskningar för alla som kan öppna det; se [HITL-widgetar](../tabs/dashboard-tab.md#hitl-widgets).

### Gantt-scheman

Välj **Gantt** (`gantt`) för projektscheman och uppgiftstidslinjer. Ange `dataPath` till uppgiftsarrayen, såsom `tasks`. Rader använder fasta fältnamn:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` och `end` accepterar ISO-datum eller datumtider. Värden utan tidszon använder UTC; tidszonsförskjutningar konverteras till UTC. `end` måste vara samma som eller efter `start`. `progress` är valfritt (0–100, standard 0); `dependencies` innehåller befintliga uppgifts-id:n. Id:n måste vara unika. Håll muspekaren över en uppgift för att läsa fullständiga datum, förlopp och beroenden. Stora diagram rullar inuti widgeten. Högst 500 uppgifter accepteras.

För exempeldata kan en Set-mappning med namnet `tasks` använda `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Anslut den till Chart Output med `chartType: "gantt"` och `dataPath: "tasks"`. Mappa källkolumner till dessa fasta namn med en Set-nod; `labelField` och `valueField` används inte.

### Entity relationships (DB)

Välj **Entity relationships (DB)** (`erDiagram`) för databasscheman och entitetskopplingar. Ange `dataPath` till ett graf-**objekt**, såsom `graph`, som innehåller båda arrayerna:

```json
{
  "graph": {
    "entities": [
      { "id": "customers", "label": "Customers", "fields": [{ "name": "id", "type": "uuid", "key": "PK" }] },
      { "id": "orders", "label": "Orders", "fields": [{ "name": "customer_id", "type": "uuid", "key": "FK" }] }
    ],
    "relations": [
      { "source": "customers", "target": "orders", "sourceField": "id", "targetField": "customer_id", "cardinality": "one-to-many", "label": "places" }
    ]
  }
}
```

Fält har ett `name`, valfri `type` och valfri `key` (`PK`, `FK`, `PK/FK` eller tom). Relationer refererar till befintliga entitets-id:n; valfria `sourceField` och `targetField` förankrar kopplingen till namngivna fält. `cardinality` accepterar `one-to-one`, `one-to-many` (standard), `many-to-one` eller `many-to-many`. Entitets-id:n och fältnamn inom varje entitet måste vara unika. Högst 100 entiteter, 100 fält per entitet och 500 relationer accepteras.

Med en Set-nod konstrueras `graph` med `$dict(entities=array(dict(...)), relations=array(dict(...)))`; använd `chartType: "erDiagram"` och `dataPath: "graph"`. Detta är en visualisering av det schema du anger; det inspekterar inte en aktiv databas automatiskt.

Båda typerna visas i **Lägg till widget** med förhandsgranskning och i nodens diagramtypsväljare på canvasen. Heym Work kan föreslå dessa typer när du beskriver ett schema eller ett databasschema, och ritar förhandsgranskningar av de föreslagna uppgifterna eller entiteterna innan du skapar sidan.

### Interaktiva uppgiftslistor

Använd GitHub-flavored markdown-syntax för uppgiftslistor i det statiska `text`-fältet:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

På [Dashboard](../tabs/dashboard-tab.md) renderas kryssrutor som klickbara kontroller (anpassade för mörkt och ljust läge). Att växla en kryssruta uppdaterar widgetens workflow-`text`-fält och bevaras mellan uppdateringar.

**Inline-redigering:** dubbelklicka på etiketten för ett uppgiftsobjekt för att redigera den på plats. Tryck på Enter eller klicka utanför för att spara; tryck på Escape för att avbryta. Rensa etiketten helt för att ta bort objektet från listan.

**Länkar i uppgiftsobjekt:** när en etikett innehåller en markdown-länk (`[title](url)`) öppnas URL:en när länken klickas, utan att kryssrutan växlas. Klicka någon annanstans på raden för att växla.

**Endast statisk text:** interaktivitet kräver GFM-syntax för uppgiftslistor (`- [ ]` / `- [x]`). Vanliga dynamiska statusmeddelanden utan uppgiftsobjekt förblir skrivskyddade. När markdown kommer från `valueField` kopieras den vid första växlingen till det statiska `text`-fältet så att ändringarna bevaras.
### Numrerade listor

Textwidgetar renderar markdown med **explicita radnummer bevarade**. Varje rad prefixas med det nummer som ska visas (t.ex. `9.`, `8.`, `7.`). Heym numrerar inte om raderna automatiskt.

**Varför explicita nummer?** Standardmarkdowns ordnade listor (`1.`, `2.`, `3.`) blir HTML-`<ol>`-listor, som endast räknar **uppåt** från det första numret. En lista skriven som `9.` / `8.` / `7.` skulle visas som `9`, `10`, `11` i en vanlig markdown-renderare. Genom att prefixa varje rad med det avsedda numret undviks detta.

**Fallande listor (t.ex. nyast först):** bygg markdown i en workflow-loop och beräkna visningsnumret per objekt:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typiskt mönster:

1. Hämta eller bygg en array av objekt (t.ex. HTTP → `body.videos`).
2. [Loop](./loop-node.md) över arrayen; använd i body en [Variable](./variable-node.md) med `.add()` för att lägga till en numrerad rad per iteration.
3. Efter loopens **done**-gren, använd [Set](./set-node.md) `join("\n")` på den ackumulerade arrayen (eller motsvarande) till en enda markdown-sträng.
4. Peka **Chart Output** `valueField` mot den strängen (eller ange statisk `text`).

Exempel på raduttryck inuti loopen (etikett `processVideos`, objekt med `title` och `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Resulterande markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

För en enkel stigande lista som börjar på 1, antingen prefixa varje rad (`1.`, `2.`, `3.`) eller använd en loop med `$loop.index + 1`. Använd [punktlistor](#interactive-task-lists) (`- item`) när nummer inte behövs.

## Statusbrickor

En `table` kan visa en kolumn som färgade brickor (chips). Ställ in **Status column** i nodens egenskaper (eller `statusColumn` i DSL) på ett kolumnnamn. Varje värde får en av fem toner, och vanliga ord får en automatiskt utan konfiguration:

| Ton | Standardord |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | allt annat |

Matchningen ignorerar skiftläge, `_` och `-`, så `IN_PROGRESS` och `in-progress` blir båda `waiting`. Lägg till **Status tones** för andra värden; en post åsidosätter standardvärdet för det värdet:

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

Servern omvandlar varje värde till dess ton, så att Heym och Heym Work visar samma färger.

## Detaljsidor: `$page.record`

En dashboard som öppnas med `?record=<value>` kör varje widget-Workflow med det värdet som `$page.record`. En radlänk i en tabell öppnar en sådan sida; se [Detaljsidor](../tabs/dashboard-tab.md#detail-pages). På en dashboard som öppnas utan post och i uttrycksdialogen är `$page.record` `null`. En nod med etiketten `page` har företräde framför det.

Använd det för att hämta den specifika post som sidan handlar om, till exempel i en [HTTP](./http-node.md)-nod:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` är själva värdet från den klickade raden, såsom `V-1002`, inte ett objekt med fält. För att hitta den posten i en [DataTable](./datatable-node.md), filtrera dess postkolumn efter värdet: operationen `find` med filtret `{"vendor_id": "$page.record"}`. En sökväg som `$page.record.id` ger ingenting, så en widget som AI bygger eller finjusterar tar bort sådana fält och läser `$page.record` i stället.

Värdet kommer från en URL som vem som helst kan redigera. Dashboarden accepterar endast värden i sitt postformat (bokstäver, siffror, `-`, `_` och `.` som standard), men behandla det ändå som opålitlig indata: skicka det där noden escapear värden, såsom en HTTP-frågeparameter eller ett filtervärde i [DataTable](./datatable-node.md) eller ClickHouse, och bygg aldrig frågetext genom att slå ihop strängar med det. Widgetar körs fortfarande som dashboardens ägare, oavsett vem som öppnar sidan.

## Hur data löses upp

1. Om `dataPath` är angivet följer noden den punktsökvägen in i uppströmsutdata.
2. Annars letas efter en array: en lista på toppnivå, en `data`-array eller det första listvärderade fältet.
3. Rader direkt från en [Data Table](./datatable-node.md)-nod (`{id, data, created_at}`) läses med sina kolumner på toppnivån bredvid `id`, så `labelField`, `valueField` och `columns` namnger tabellens egna kolumner.
4. För `table` blir varje rad en tabellrad med hjälp av `columns` (eller den första radens nycklar). Med `statusColumn` bär Payloaden även tonen för varje värde i den kolumnen.
5. För `numeric` och `gauge` hämtas värdet från `valueField` på den första raden (eller det första numeriska fältet).
6. För `scatter` blir varje rad en `[xField, yField]`-punkt.
7. För `text` hämtas meddelandet från `valueField` på den första raden när det är angivet, annars från den statiska `text`-konfigurationen (annars det första strängfältet på den första raden).

## Exempel

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

Gauge (ensamt värde mot ett intervall):

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

Proportion (en stapel uppdelad efter andel + procentlegend):

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

Area (fylld trend med flera serier):

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

Bar gauge (gradientmätare per rad med värden):

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

Text (ett statiskt markdown-meddelande — inga uppströmsrader krävs):

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

Text (dynamisk — meddelandesträngen produceras uppströms och hämtas via `valueField`):

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
## Exempel på AI-prompts

Vid generering av en widget med **AI** mappas prompts som dessa direkt till respektive typ:

- **Stapel** — "Visa månatlig intäkt för de senaste 6 månaderna som ett vertikalt stapeldiagram med exempeldata."
- **Linje** — "Rita dagliga aktiva användare över de senaste 14 dagarna som ett linjediagram."
- **Yta** — "Visa minnes- och CPU-användning över de senaste 24 timmarna som ett ytdiagram med två serier. Använd exempeldata."
- **Cirkel** — "Bryt ner körningsstatus (lyckad, fel, avbruten) som ett cirkeldiagram."
- **Tabell** — "Visa de 10 främsta workflowen efter antal körningar som en rullningsbar tabell med kolumnerna namn och körningar. Använd exempeldata."
- **Numerisk** — "Visa dagens totala antal workflow-körningar som ett enskilt KPI med enheten 'runs'. Använd exempeldata."
- **Mätare** — "Visa aktuell CPU-användning som en mätare från 0 till 100 procent."
- **Punktdiagram** — "Rita förfrågans latens mot payload-storlek som ett punktdiagram med exempeldata."
- **Andel** — "Visa mina mest använda språk som en andelsstapel: Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Använd exempeldata."
- **Stapelmätare** — "Visa ledigt diskutrymme per volym (sda1 till sda7) som en stapelmätare i GB. Använd exempeldata."
- **Text** — "Lägg till en textwidget med en markdown-checklista (en markerad post, två omarkerade), eller lista de 5 senaste handledningsvideorna i fallande ordning (5. ner till 1.) med YouTube-länkar — prefixa varje rad med ett explicit nummer (`5. Title`, `4. Title`, …)."

## Relaterat

- [Fliken Dashboard](../tabs/dashboard-tab.md) — bygg och arrangera widgetar
- [Utmatningsnod](output-node.md) — terminalnod för vanliga workflow


## Länkknappar

En `table` kan göra om en kolumn till knappar som öppnar en länk. Ange **Link column** i nodens egenskaper (eller `linkColumn` i DSL:en) till en kolumn vars celler innehåller en URL, och eventuellt **Link button text** (`linkLabel`). Varje cell blir en knapp som öppnar sin URL i en ny flik. Utan knapptext visar knappen bara en länkikon:

| Cellvärde | Öppnar |
| --------- | ------ |
| `https://jira.example.com/browse/T-1` | En annan webbplats, i en ny flik |
| `/dashboards` | En sida i Heym, i en ny flik |

Endast `http://`- och `https://`-adresser samt sökvägar som börjar med ett enda `/` blir knappar. Alla andra värden, till exempel `javascript:` eller `//host`, förblir vanlig text, och en tom cell visar ingenting.

Knappen fungerar tillsammans med en [radlänk](../tabs/dashboard-tab.md#detail-pages): ett klick på knappen öppnar dess länk i en ny flik, och ett klick var som helst annars på raden öppnar fortfarande detaljsidan.
