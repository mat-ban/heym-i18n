# Výstup grafu

Uzel **Výstup grafu** je koncovým uzlem workflow [widgetu dashboardu](../tabs/dashboard-tab.md). Přijímá řádky vytvořené předchozími uzly a převádí je na standardizovaný payload grafu, který dashboard vykresluje.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 (koncový) |
| Výstup | Standardizovaný payload grafu |

Umístěte tento uzel **jako poslední** ve workflow widgetu dashboardu. Pro entity relationships uzel před ním vytváří objekt grafu (viz [Entity relationships](#entity-relationships-db)). Ostatní grafy řízené daty používají pole objektů řádků, například:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Pokud máte k dispozici pouze ukázková data (bez skutečného zdroje), vytvořte tyto řádky pomocí uzlu **Set** s výrazem `$array(dict(...), dict(...))` — například `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nepoužívejte** `${...}` ani holé objektové literály `{...}`; Heym vytváří objekty pouze pomocí `dict(key=value)`.

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` nebo `hitl` |
| `orientation` | string | `vertical` nebo `horizontal` (pouze pro sloupcové grafy) |
| `dataPath` | string | Tečkovaná cesta k poli řádků (nebo objektu grafu pro `erDiagram`) uvnitř výstupu předchozího uzlu (např. `data` nebo `result.items`). Ponechte prázdné pro automatickou detekci. |
| `labelField` | string | Klíč řádku použitý jako popisek kategorie (pie/bar/line) |
| `valueField` | string | Klíč řádku použitý jako číselná hodnota (pie/bar/line/numeric/gauge) |
| `series` | array | Volitelná definice více sérií `[{ "name": "Sent", "field": "sent" }]` pro bar/line (přebíjí `valueField`) |
| `columns` | array | Volitelný seznam sloupců pro `table` (výchozí jsou klíče prvního řádku) |
| `statusColumn` | string | Volitelný sloupec `table` vykreslený jako barevné [stavové štítky](#status-chips). Musí jít o jeden ze zobrazených sloupců. |, a s `linkColumn` obsahuje také sloupec odkazu a text tlačítka.
| `statusTones` | object | Volitelné mapování stavové hodnoty na odstín (`success`, `attention`, `failure`, `waiting`, `neutral`) pro hodnoty, které výchozí nastavení nepokrývá |
| `linkColumn` | string | Volitelný sloupec `table`, jehož buňky obsahují URL, zobrazený jako [tlačítko odkazu](#link-buttons), které jej otevře v nové kartě. Musí to být jeden ze zobrazených sloupců. |
| `linkLabel` | string | Volitelný text tlačítka odkazu. Pokud zůstane prázdný, tlačítko zobrazí pouze ikonu odkazu. |
| `xField` / `yField` | string | Klíče řádků pro číselné osy X a Y (scatter) |
| `min` / `max` | number | Číselný rozsah pro `gauge` (výchozí `0` / `100`) |
| `unit` | string | Volitelná jednotka zobrazená vedle hodnoty `numeric` nebo `gauge` |
| `text` | string | Zpráva ve formátu Markdown pro typ grafu `text`. Ponechte prázdné a nastavte `valueField` pro vykreslení dynamické zprávy převzaté z dat předchozího uzlu. |
| `title` | string | Volitelný název grafu |
| `hitlWorkflowId` | string | Pouze `hitl`. Zobrazí jen recenze tohoto Workflow. Pokud zůstane prázdné, widget zobrazí všechny recenze. |
| `hitlNodeId` | string | Pouze `hitl`. Zúží `hitlWorkflowId` na jeden krok: Agent s lidskou recenzí nebo krok Slack se schválením, tlačítky či formulářem. |

## Typy grafů

- **bar / line / area / pie** — kategoriální grafy řízené pomocí `labelField` + `valueField` (nebo `series` pro vícesériové bar/line/area). `area` je vyplněný trendový graf.
- **table** — surové řádky vykreslené jako posuvná tabulka pomocí `columns`. Jeden sloupec lze vykreslit jako [stavové štítky](#status-chips) a řádky mohou otevírat [stránku detailu](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — jediná hodnota KPI z prvního řádku s volitelnou `unit`.
- **gauge** — jediná hodnota zobrazená vůči rozsahu `min`–`max` (např. procento). Používá `valueField`.
- **scatter** — body X/Y z `xField` a `yField` pro korelační grafy.
- **proportion** — jediný horizontální pruh rozdělený na podíly s procentuální legendou (např. rozložení jazyků). Používá `labelField` + `valueField`.
- **barGauge** — jeden horizontální gauge na řádek s přechodem červená→zelená a hodnotou (např. volné místo na disku). Používá `labelField` + `valueField`, volitelnou `unit` a `max` (výchozí je největší hodnota řádku).
- **gantt** — časové plány úkolů s daty, průběhem a závislostmi; viz [Ganttovy diagramy](#gantt-schedules).
- **erDiagram** — databázové entity, pole, klíče a relace; viz [Entity relationships](#entity-relationships-db).
- **text** — zpráva ve formátu markdown (např. stavová poznámka jako „Poslední spuštění v 19:47"). Pro statickou zprávu vložte markdown do `text`, nebo ponechte `text` prázdné a nastavte `valueField` pro vykreslení řetězce vytvořeného předchozím uzlem. Podporuje nadpisy, tučné/kurzíva, [seznamy](../nodes/chart-output-node.md#interactive-task-lists), odkazy a inline kód.
- **hitl** — karusel vašich čekajících lidských revizí. Hlavička zobrazuje `1/n pending`; levá šipka je zakázána na první kartě a pravá na poslední. Název workflow otevře dané spuštění na canvasu. Tlačítka **Approve**, **Request changes** a **Reject** jej vyřeší a ikona historie vedle názvu widgetu otevře dané spuštění v dialogu historie na stejné stránce. Tento typ grafu ignoruje řádky z předchozích uzlů, takže workflow widgetu tvoří pouze uzel Výstup grafu. Každá přihlášená osoba vidí revize u workflow, která vlastní. Vyberte **Workflow** (a **Select agent**, pokud má více kroků recenze) ve vlastnostech uzlu nebo v nastavení widgetu, aby se místo toho zobrazily recenze tohoto Workflow všem, kdo jej mohou otevřít; viz [widgety HITL](../tabs/dashboard-tab.md#hitl-widgets).

### Ganttovy diagramy

Zvolte **Gantt** (`gantt`) pro projektové plány a časové osy úkolů. Nastavte `dataPath` na pole úkolů, například `tasks`. Řádky používají pevné názvy polí:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` a `end` přijímají data nebo časová razítka ISO. Hodnoty bez časového pásma používají UTC; posuny časových pásem jsou převedeny na UTC. `end` musí být ve stejný den nebo po `start`. Pole `progress` je volitelné (0–100, výchozí 0); `dependencies` obsahuje identifikátory existujících úkolů. Identifikátory musí být jedinečné. Přejetím myší nad úkolem zobrazíte úplná data, průběh a závislosti. Velké grafy se v rámci widgetu posouvají. Přijímá se maximálně 500 úkolů.

Pro ukázková data může mapování Set s názvem `tasks` použít `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Propojte jej s Chart Output s `chartType: "gantt"` a `dataPath: "tasks"`. Namapujte zdrojové sloupce na tyto pevné názvy pomocí uzlu Set; `labelField` a `valueField` se nepoužívají.

### Entity relationships (DB)

Zvolte **Entity relationships (DB)** (`erDiagram`) pro databázová schémata a propojení entit. Nastavte `dataPath` na **objekt** grafu, například `graph`, obsahující obě pole:

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

Pole mají `name`, volitelný `type` a volitelný `key` (`PK`, `FK`, `PK/FK` nebo prázdné). Relace odkazují na existující identifikátory entit; volitelná pole `sourceField` a `targetField` ukotvují propojení k pojmenovaným polím. `cardinality` přijímá `one-to-one`, `one-to-many` (výchozí), `many-to-one` nebo `many-to-many`. Identifikátory entit a názvy polí v rámci každé entity musí být jedinečné. Přijímá se maximálně 100 entit, 100 polí na entitu a 500 relací.

Pomocí uzlu Set sestavte `graph` přes `$dict(entities=array(dict(...)), relations=array(dict(...)))`; použijte `chartType: "erDiagram"` a `dataPath: "graph"`. Jedná se o vizualizaci dodaného schématu; neprovádí automatickou kontrolu živé databáze.

Oba typy se zobrazují v **Přidat widget** s náhledem a ve výběru typu grafu uzlu na plátně. Heym Work může tyto typy navrhnout při popisu časového plánu nebo databázového schématu a vykreslit náhledy navržených úkolů či entit ještě před vytvořením stránky.

### Interaktivní seznamy úkolů

Použijte syntaxi seznamu úkolů v markdownu ve stylu GitHubu ve statickém poli `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Na [Dashboardu](../tabs/dashboard-tab.md) se zaškrtávací políčka vykreslují jako klikatelné ovládací prvky (vhodné pro tmavý i světlý režim). Přepnutí zaškrtávacího políčka aktualizuje pole `text` workflow widgetu a přetrvává i po obnovení stránky.

**Inline úpravy:** dvojklikem na popisek položky úkolu jej upravíte přímo na místě. Stisknutím Enter nebo kliknutím mimo položku změny uložíte; stisknutím Escape je zrušíte. Úplným vymazáním popisku položku ze seznamu odstraníte.

**Odkazy v položkách úkolů:** pokud popisek obsahuje markdown odkaz (`[title](url)`), kliknutím na odkaz se otevře URL bez přepnutí zaškrtávacího políčka. Pro přepnutí klikněte kamkoli jinam na řádek.

**Pouze statický text:** interaktivita vyžaduje syntaxi seznamu úkolů GFM (`- [ ]` / `- [x]`). Prosté dynamické stavové zprávy bez položek úkolů zůstávají pouze pro čtení. Pokud markdown pochází z `valueField`, první přepnutí jej zkopíruje do statického pole `text`, aby změny přetrvaly.
### Číslované seznamy

Textové widgety vykreslují markdown s **explicitně zachovanými čísly řádků**. Každý řádek opatřete číslem, které chcete zobrazit (např. `9.`, `8.`, `7.`). Heym řádky za Vás nepřečíslovává.

**Proč explicitní čísla?** Standardní číslované seznamy v markdownu (`1.`, `2.`, `3.`) se převádějí na HTML seznamy `<ol>`, které čítají pouze **vzestupně** od prvního čísla. Seznam zapsaný jako `9.` / `8.` / `7.` by se v běžném markdown rendereru zobrazil jako `9`, `10`, `11`. Pokud každý řádek opatříte zamýšleným číslem, tomuto problému se vyhnete.

**Sestupné seznamy (např. od nejnovějšího):** sestavte markdown ve smyčce workflow a vypočítejte zobrazované číslo pro každou položku:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typický postup:

1. Načtěte nebo sestavte pole položek (např. HTTP → `body.videos`).
2. Projděte pole pomocí [Loop](./loop-node.md); uvnitř těla použijte [Variable](./variable-node.md) s `.add()` pro přidání jednoho očíslovaného řádku při každé iteraci.
3. Za větví **done** smyčky použijte [Set](./set-node.md) s `join("\n")` na akumulované pole (nebo ekvivalent) do jediného markdown řetězce.
4. Nasměrujte **Chart Output** `valueField` na tento řetězec (nebo nastavte statický `text`).

Příklad výrazu řádku uvnitř smyčky (label `processVideos`, položky s `title` a `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Výsledný markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Pro jednoduchý vzestupný seznam začínající od 1 buď opatřete každý řádek číslem (`1.`, `2.`, `3.`), nebo použijte smyčku s `$loop.index + 1`. Pokud čísla nepotřebujete, použijte [seznamy s odrážkami](#interactive-task-lists) (`- item`).

## Stavové štítky

Tabulka (`table`) může jeden sloupec zobrazit jako barevné štítky (chips). Nastavte **Status column** ve vlastnostech uzlu (nebo `statusColumn` v DSL) na název sloupce. Každá hodnota dostane jeden z pěti odstínů a běžná slova jej získají automaticky bez konfigurace:

| Odstín | Výchozí slova |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | cokoliv jiného |

Porovnávání ignoruje velikost písmen, `_` a `-`, takže `IN_PROGRESS` i `in-progress` odpovídají `waiting`. Pro další hodnoty přidejte **Status tones**; položka přepíše výchozí nastavení pro danou hodnotu:

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

Server vyhodnotí každou hodnotu na její odstín, takže Heym a Heym Work zobrazují stejné barvy.

## Stránky detailu: `$page.record`

Dashboard otevřený s parametrem `?record=<value>` spustí každý Workflow widgetu s touto hodnotou jako `$page.record`. Odkaz v řádku tabulky takovou stránku otevře; viz [Stránky detailu](../tabs/dashboard-tab.md#detail-pages). Na dashboardu otevřeném bez záznamu a v dialogu výrazů je `$page.record` rovno `null`. Uzel označený `page` má před touto hodnotou přednost.

Použijte ji k načtení konkrétního záznamu, kterého se stránka týká, například v uzlu [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` je samotná hodnota kliknutého řádku, například `V-1002`, nikoli objekt s poli. Chcete-li tento záznam najít v uzlu [DataTable](./datatable-node.md), vyfiltrujte sloupec záznamu podle této hodnoty: operace `find` s filtrem `{"vendor_id": "$page.record"}`. Cesta jako `$page.record.id` se nevyhodnotí na nic, takže widget vytvořený nebo upravený pomocí AI tato pole zahodí a čte místo nich `$page.record`.

Hodnota pochází z URL, kterou může kdokoliv upravit. Dashboard sice přijímá pouze hodnoty ve formátu záznamu (ve výchozím nastavení písmena, číslice, `-`, `_` a `.`), přesto s ní ale zacházejte jako s nedůvěryhodným vstupem: předávejte ji tam, kde uzel hodnoty escapuje, například jako parametr HTTP dotazu nebo hodnotu filtru v [DataTable](./datatable-node.md) či ClickHouse, a nikdy nesestavujte text dotazu spojováním řetězců. Widgety se vždy spouštějí pod vlastníkem dashboardu bez ohledu na to, kdo stránku otevře.

## Jak se data zpracovávají

1. Pokud je nastaven `dataPath`, uzel sleduje tuto tečkovou cestu do výstupu předchozího uzlu.
2. V opačném případě hledá pole: seznam na nejvyšší úrovni, pole `data`, nebo první pole obsahující seznam.
3. Řádky přímo z uzlu [Data Table](./datatable-node.md) (`{id, data, created_at}`) se čtou se svými sloupci na nejvyšší úrovni vedle `id`, takže `labelField`, `valueField` a `columns` pojmenovávají vlastní sloupce tabulky.
4. Pro `table` se každý řádek stane řádkem tabulky pomocí `columns` (nebo klíčů prvního řádku). Při použití `statusColumn` nese Payload také odstín každé hodnoty v tomto sloupci.
5. Pro `numeric` a `gauge` pochází hodnota z `valueField` na prvním řádku (nebo z prvního číselného pole).
6. Pro `scatter` se každý řádek stane bodem `[xField, yField]`.
7. Pro `text` se zpráva převezme z `valueField` na prvním řádku, pokud je nastaven, jinak ze statické konfigurace `text` (v opačném případě z prvního řetězcového pole prvního řádku).

## Příklad

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

Gauge (jedna hodnota vs. rozsah):

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

Scatter (body X/Y):

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

Proportion (jeden pruh rozdělený podle podílu + procentuální legenda):

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

Area (vyplněný trend s více sériemi):

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

Bar gauge (gradientový gauge pro každý řádek s hodnotami):

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

Text (statická markdown zpráva — nevyžaduje řádky z předchozích uzlů):

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

Text (dynamický — řetězec zprávy je vytvořen v předchozím uzlu a převzat přes `valueField`):

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
## Ukázkové AI prompty

Při generování widgetu pomocí **AI** se prompty, jako jsou tyto, čistě mapují na jednotlivé typy:

- **Bar** — „Zobraz měsíční příjmy za posledních 6 měsíců jako svislý sloupcový graf s ukázkovými daty."
- **Line** — „Vykresli denní aktivní uživatele za posledních 14 dní jako čárový graf."
- **Area** — „Zobraz využití paměti a CPU za posledních 24 hodin jako plošný graf se dvěma sériemi. Použij ukázková data."
- **Pie** — „Rozlož stav spuštění (úspěch, chyba, zrušeno) jako koláčový graf."
- **Table** — „Zobraz top 10 workflow podle počtu spuštění jako posuvnou tabulku se sloupci název a spuštění. Použij ukázková data."
- **Numeric** — „Zobraz dnešní celkový počet spuštění workflow jako jediný KPI s jednotkou 'runs'. Použij ukázková data."
- **Gauge** — „Zobraz aktuální využití CPU jako gauge od 0 do 100 procent."
- **Scatter** — „Vykresli latenci požadavku vůči velikosti payloadu jako bodový graf s ukázkovými daty."
- **Proportion** — „Zobraz mé nejpoužívanější jazyky jako pruh proporcí: Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Použij ukázková data."
- **Bar gauge** — „Zobraz volné místo na disku pro každý svazek (sda1 až sda7) jako sloupcový gauge v GB. Použij ukázková data."
- **Text** — „Přidej textový widget s markdownovým kontrolním seznamem (jedna zaškrtnutá položka, dvě nezaškrtnuté), nebo vypiš 5 nejnovějších výukových videí v sestupném pořadí (5. až 1.) s odkazy na YouTube — každý řádek uveď explicitním číslem (`5. Title`, `4. Title`, …)."

## Související

- [Karta Dashboard](../tabs/dashboard-tab.md) — sestavujte a uspořádejte widgety
- [Výstupní uzel](output-node.md) — koncový uzel pro běžné workflow


## Tlačítka odkazů

Sloupec v `table` lze změnit na tlačítka, která otevírají odkaz. Nastavte **Link column** ve vlastnostech uzlu (nebo `linkColumn` v DSL) na sloupec, jehož buňky obsahují URL, a volitelně **Link button text** (`linkLabel`). Každá buňka se stane tlačítkem, které otevře svou URL v nové kartě. Bez textu tlačítka zobrazí tlačítko pouze ikonu odkazu:

| Hodnota buňky | Otevře |
| ------------- | ------ |
| `https://jira.example.com/browse/T-1` | Jiný web v nové kartě |
| `/dashboards` | Stránku uvnitř Heym v nové kartě |

Tlačítky se stanou pouze adresy `http://` a `https://` a cesty začínající jedním `/`. Jakákoli jiná hodnota, například `javascript:` nebo `//host`, zůstane prostým textem a prázdná buňka nezobrazí nic.

Tlačítko funguje vedle [odkazu řádku](../tabs/dashboard-tab.md#detail-pages): kliknutí na tlačítko otevře jeho odkaz v nové kartě a kliknutí kamkoli jinam na řádku stále otevře stránku s detaily.
