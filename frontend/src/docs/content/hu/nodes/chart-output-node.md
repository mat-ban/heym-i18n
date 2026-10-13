# Chart Output

A **Chart Output** csomópont egy [dashboard widget](../tabs/dashboard-tab.md) workflow terminális csomópontja. A felfelé kapcsolódó csomópontok által előállított sorokat egy szabványosított chart payload-dá alakítja, amelyet a dashboard megjelenít.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 0 (terminális) |
| Kimenet | Szabványosított chart payload |

Helyezze ezt a csomópontot **utolsóként** egy dashboard-widget workflow-ba. Az előtte lévő csomópontnak sorobjektumok tömbjét kell előállítania, például:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Ha csak példa/mintaadatokkal rendelkezik (valós forrás nélkül), állítsa elő ezeket a sorokat egy **Set** csomóponttal a `$array(dict(...), dict(...))` használatával — például `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Ne** használjon `${...}` vagy csupasz `{...}` objektumliterálokat; a Heym kizárólag a `dict(key=value)` szintaxissal épít objektumokat.

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` vagy `hitl` |
| `orientation` | string | `vertical` vagy `horizontal` (csak bar chartok esetén) |
| `dataPath` | string | Pontozott útvonal a felfelé kapcsolódó kimeneten belüli sorok tömbjéhez (pl. `data` vagy `result.items`). Hagyja üresen az automatikus felismeréshez. |
| `labelField` | string | A kategóriacímkeként használt sorkulcs (pie/bar/line) |
| `valueField` | string | A numerikus értékként használt sorkulcs (pie/bar/line/numeric/gauge) |
| `series` | array | Opcionális többsoros definíció `[{ "name": "Sent", "field": "sent" }]` bar/line esetén (felülírja a `valueField` értékét) |
| `columns` | array | Opcionális oszloplista `table` esetén (alapértelmezésben az első sor kulcsai) |
| `statusColumn` | string | Opcionális `table`-oszlop, amely színes [állapotjelző chipekként](#status-chips) jelenik meg. A megjelenített oszlopok egyikének kell lennie. |
| `statusTones` | object | Opcionális leképezés egy állapotértékről egy színárnyalatra (`success`, `attention`, `failure`, `waiting`, `neutral`) az alapértelmezések által le nem fedett értékekhez |
| `xField` / `yField` | string | Az X és Y numerikus tengelyekhez tartozó sorkulcsok (scatter) |
| `min` / `max` | number | Numerikus tartomány `gauge` esetén (alapértelmezés: `0` / `100`) |
| `unit` | string | Opcionális mértékegység, amely egy `numeric` vagy `gauge` érték mellett jelenik meg |
| `text` | string | Markdown üzenet a `text` chart típushoz. Hagyja üresen, és állítsa be a `valueField` értékét egy felfelé kapcsolódó adatokból származó dinamikus üzenet megjelenítéséhez. |
| `title` | string | Opcionális chart cím |

## Chart típusok

- **bar / line / area / pie** — kategorikus chartok, amelyeket a `labelField` + `valueField` vezérel (vagy `series` többsoros bar/line/area esetén). Az `area` egy kitöltött trendchart.
- **table** — nyers sorok görgethető táblázatként megjelenítve a `columns` használatával. Egy oszlop megjeleníthető [állapotjelző chipekként](#status-chips), a sorok pedig megnyithatnak egy [részletező oldalt](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — egyetlen KPI-érték az első sorból, opcionális `unit` értékkel.
- **gauge** — egyetlen érték egy `min`–`max` tartományhoz viszonyítva megjelenítve (pl. egy százalék). A `valueField` értékét használja.
- **scatter** — X/Y pontok az `xField` és `yField` alapján korrelációs ábrákhoz.
- **proportion** — egyetlen vízszintes sáv részekre osztva, százalékos jelmagyarázattal (pl. nyelvi megoszlás). A `labelField` + `valueField` értékét használja.
- **barGauge** — soronként egy vízszintes gauge piros→zöld színátmenettel és egy értékkel (pl. szabad lemezterület). A `labelField` + `valueField` értékét használja, opcionális `unit` és `max` paraméterrel (alapértelmezésben a legnagyobb sorérték).
- **text** — egy markdown üzenet (pl. egy állapotjelzés, mint „Last execution at 19:47”). Helyezze a markdown szöveget a `text` mezőbe statikus üzenethez, vagy hagyja üresen a `text` mezőt, és állítsa be a `valueField` értékét egy felfelé kapcsolódó adatokból származó string megjelenítéséhez. Támogatja a címsorokat, a félkövér/dőlt szöveget, a [listákat](../nodes/chart-output-node.md#interactive-task-lists), a linkeket és az inline kódot.
- **hitl** — a függőben lévő emberi felülvizsgálatok körhintája. A fejléc `1/n pending` értéket mutat; a bal nyíl az első kártyán, a jobb nyíl az utolsón van letiltva. A workflow neve megnyitja az adott futtatást a vásznon. Az **Approve**, a **Request changes** és a **Reject** gombok lezárják azt, a widget címe melletti előzmények ikon pedig ugyanazon az oldalon nyitja meg az adott futtatást az előzmények párbeszédablakban. Ez a chart típus figyelmen kívül hagyja a felfelé kapcsolódó sorokat, így a widget workflow csak a Chart Output csomópontból áll. Minden bejelentkezett személy az általa birtokolt workflow-khoz tartozó felülvizsgálatokat látja.

### Interaktív feladatlisták

Használjon GitHub-flavored markdown feladatlista szintaxist a statikus `text` mezőben:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

A [Dashboard](../tabs/dashboard-tab.md) felületen a jelölőnégyzetek kattintható vezérlőkként jelennek meg (sötét és világos módban is jól használhatók). A jelölőnégyzet átkapcsolása frissíti a widget workflow `text` mezőjét, és az frissítések között is megmarad.

**Inline szerkesztés:** kattintson duplán egy feladatelem címkéjére a helyben történő szerkesztéshez. Nyomja meg az Entert, vagy kattintson máshová a mentéshez; nyomja meg az Escape-et a megszakításhoz. Törölje teljesen a címkét az adott elem eltávolításához a listáról.

**Linkek a feladatelemekben:** ha egy címke markdown linket tartalmaz (`[title](url)`), a linkre kattintva megnyílik az URL a jelölőnégyzet átkapcsolása nélkül. A sor más részére kattintva lehet átkapcsolni.

**Csak statikus szöveg:** az interaktivitáshoz GFM feladatlista szintaxis szükséges (`- [ ]` / `- [x]`). A feladatelemek nélküli, egyszerű dinamikus állapotüzenetek csak olvashatók maradnak. Ha a markdown a `valueField` mezőből származik, az első átkapcsolás átmásolja azt a statikus `text` mezőbe, hogy a változtatások megmaradjanak.
### Számozott listák

A szöveg widgetek a markdown tartalmat **kifejezetten megőrzött sorszámozással** jelenítik meg. Minden sor elé írja be a megjeleníteni kívánt számot (pl. `9.`, `8.`, `7.`). A Heym nem számozza újra Ön helyett a sorokat.

**Miért van szükség kifejezett számokra?** A szabványos markdown számozott listák (`1.`, `2.`, `3.`) HTML `<ol>` listákká alakulnak, amelyek csak **felfelé** számolnak az első számtól kezdve. Egy `9.` / `8.` / `7.` formában megírt lista egy hagyományos markdown renderelőben `9`, `10`, `11` formában jelenne meg. Ha minden sor elé a szándékolt számot írja, elkerülhető ez a probléma.

**Csökkenő listák (pl. legújabb elöl):** építse fel a markdown tartalmat egy workflow ciklusban, és számítsa ki a megjelenítendő számot tételenként:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tipikus minta:

1. Töltse le vagy építse fel a tételek tömbjét (pl. HTTP → `body.videos`).
2. [Loop](./loop-node.md) a tömbön; a törzsben használjon egy [Variable](./variable-node.md) csomópontot a `.add()` metódussal, hogy minden iterációban hozzáfűzzön egy számozott sort.
3. A ciklus **done** ága után [Set](./set-node.md) segítségével alkalmazza a `join("\n")` műveletet a felhalmozott tömbre (vagy annak megfelelőjére), így egyetlen markdown szövegláncot kap.
4. Irányítsa a **Chart Output** `valueField` mezőjét erre a szövegláncra (vagy állítsa be a statikus `text` értéket).

Példa a cikluson belüli sorexpresszióra (`processVideos` címkével, `title` és `id` mezőkkel rendelkező tételek esetén):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Az eredményül kapott markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Egy egyszerű, 1-től induló növekvő lista esetén vagy írja minden sor elé a számot (`1.`, `2.`, `3.`), vagy használjon ciklust a `$loop.index + 1` kifejezéssel. Használjon [felsoroláslistákat](#interactive-task-lists) (`- item`), amikor nincs szükség számokra.

## Állapotjelző chipek

Egy `table` képes egy oszlopot színes chipekként megjeleníteni. Állítsa a csomópont tulajdonságaiban a **Status column** mezőt (vagy a DSL-ben a `statusColumn` paramétert) egy oszlopnévre. Minden érték öt árnyalat egyikét kapja, a gyakori szavak pedig külön beállítás nélkül is automatikusan besorolódnak:

| Árnyalat | Alapértelmezett szavak |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | bármi más |

Az egyeztetés figyelmen kívül hagyja a kis- és nagybetűket, a `_` és a `-` karaktereket, így az `IN_PROGRESS` és az `in-progress` egyaránt `waiting` lesz. Egyéb értékekhez adjon meg **Status tones** beállítást; egy bejegyzés felülbírálja az adott érték alapértelmezését:

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

A szerver minden értéket felold a megfelelő árnyalatra, így a Heym és a Heym Work ugyanazokat a színeket jeleníti meg.

## Részletező oldalak: `$page.record`

A `?record=<value>` paraméterrel megnyitott irányítópult minden widget-Workflow-t ezzel az értékkel futtat `$page.record` néven. Egy táblázatsor hivatkozása ilyen oldalt nyit meg; lásd: [Részletező oldalak](../tabs/dashboard-tab.md#detail-pages). A rekord nélkül megnyitott irányítópulton és a kifejezés-párbeszédpanelen a `$page.record` értéke `null`. A `page` címkéjű csomópont elsőbbséget élvez vele szemben.

Használja arra, hogy lekérje azt az egyetlen rekordot, amelyről az oldal szól, például egy [HTTP](./http-node.md) csomópontban:

```
https://crm.example.com/api/customers?id=$page.record
```

A `$page.record` maga a kattintott sor értéke, például `V-1002`, nem pedig egy mezőkkel rendelkező objektum. Ha meg szeretné találni ezt a rekordot egy [DataTable](./datatable-node.md)-ben, szűrje a rekordoszlopot az értékre: `find` művelet `{"vendor_id": "$page.record"}` szűrővel. Egy olyan útvonal, mint a `$page.record.id`, nem oldódik fel semmire, ezért az AI által épített vagy finomhangolt widget eldobja ezeket a mezőket, és helyettük a `$page.record` értéket olvassa.

Az érték egy olyan URL-ből származik, amelyet bárki szerkeszthet. Az irányítópult csak a rekordformátumnak megfelelő értékeket fogadja el (alapértelmezés szerint betűk, számjegyek, `-`, `_` és `.`), de ettől függetlenül kezelje nem megbízható bemenetként: ott adja át, ahol a csomópont escape-eli az értékeket, például HTTP lekérdezési paraméterként vagy [DataTable](./datatable-node.md) illetve ClickHouse szűrőértékként, és soha ne építsen lekérdezési szöveget karakterláncok összefűzésével. A widgetek továbbra is az irányítópult tulajdonosaként futnak, bárki nyitja is meg az oldalt.

## Az adatok feloldásának menete

1. Ha a `dataPath` be van állítva, a csomópont követi azt a pontozott útvonalat a felsőbb szintű kimenetbe.
2. Ellenkező esetben egy tömböt keres: egy legfelső szintű listát, egy `data` tömböt, vagy az első listaértékű mezőt.
3. A közvetlenül egy [Data Table](./datatable-node.md) csomópontból (`{id, data, created_at}`) érkező sorok oszlopai a legfelső szinten, az `id` mellett kerülnek beolvasásra, így a `labelField`, a `valueField` és a `columns` közvetlenül a tábla saját oszlopait nevezi meg.
4. `table` esetén minden sor egy táblázatsorrá válik a `columns` (vagy az első sor kulcsai) alapján. A `statusColumn` használatakor a Payload az adott oszlopban szereplő egyes értékek árnyalatát is tartalmazza.
5. `numeric` és `gauge` esetén az érték az első sor `valueField` mezőjéből származik (vagy az első numerikus mezőből).
6. `scatter` esetén minden sor egy `[xField, yField]` ponttá válik.
7. `text` esetén az üzenet az első sor `valueField` mezőjéből származik, ha az be van állítva, ellenkező esetben a statikus `text` konfigurációból (máskülönben az első sor első szöveges mezőjéből).

## Példa

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

Gauge (egyetlen érték egy tartományhoz viszonyítva):

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

Scatter (X/Y pontok):

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

Proportion (egy sáv részesedés szerint felosztva + százalékos jelmagyarázat):

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

Area (kitöltött, több sorozatú trend):

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

Bar gauge (soronkénti színátmenetes gauge értékekkel):

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

Text (statikus markdown üzenet — nincs szükség felsőbb szintű sorokra):

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

Text (dinamikus — az üzenet szöveglánca felsőbb szinten keletkezik, és a `valueField` mezőn keresztül kerül lekérésre):

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
## Példa AI promptok

Amikor **AI** segítségével hoz létre widgetet, az alábbihoz hasonló promptok egyértelműen megfeleltethetők az egyes típusoknak:

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

## Kapcsolódó

- [Irányítópult lap](../tabs/dashboard-tab.md) — widgetek létrehozása és elrendezése
- [Kimeneti csomópont](output-node.md) — terminál csomópont a normál workflow-khoz
