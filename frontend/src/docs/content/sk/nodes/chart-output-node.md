# Výstup grafu

Uzol **Výstup grafu** je koncový uzol workflowu [widgetu dashboardu](../tabs/dashboard-tab.md). Preberá riadky vytvorené predchádzajúcimi uzlami a mení ich na štandardizovaný payload grafu, ktorý dashboard vykresľuje.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 (koncový) |
| Výstup | Štandardizovaný payload grafu |

Umiestnite tento uzol **ako posledný** vo workflowe widgetu dashboardu. Pri entity relationships uzol pred ním vytvára objekt grafu (pozrite [Entity relationships](#entity-relationships-db)). Ostatné dátami riadené grafy používajú pole objektov riadkov, napríklad:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Ak máte k dispozícii iba ukážkové/vzorové údaje (žiadny skutočný zdroj), vytvorte tieto riadky pomocou uzla **Set** s `$array(dict(...), dict(...))` — napríklad `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nepoužívajte** `${...}` ani holé objektové literály `{...}`; Heym vytvára objekty iba pomocou `dict(key=value)`.

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` alebo `hitl` |
| `orientation` | string | `vertical` alebo `horizontal` (iba pre stĺpcové grafy) |
| `dataPath` | string | Bodková cesta k poľu riadkov (alebo objektu grafu pre `erDiagram`) vo výstupe predchádzajúceho uzla (napr. `data` alebo `result.items`). Ponechajte prázdne pre automatickú detekciu. |
| `labelField` | string | Kľúč riadka použitý ako označenie kategórie (pie/bar/line) |
| `valueField` | string | Kľúč riadka použitý ako číselná hodnota (pie/bar/line/numeric/gauge) |
| `series` | array | Voliteľná definícia viacerých sérií `[{ "name": "Sent", "field": "sent" }]` pre bar/line (nahrádza `valueField`) |
| `columns` | array | Voliteľný zoznam stĺpcov pre `table` (predvolene kľúče prvého riadka) |
| `statusColumn` | string | Voliteľný stĺpec `table` vykreslený ako farebné [stavové štítky](#status-chips). Musí ísť o jeden zo zobrazených stĺpcov. |, a s `linkColumn` obsahuje aj stĺpec odkazu a text tlačidla.
| `statusTones` | object | Voliteľné mapovanie stavovej hodnoty na odtieň (`success`, `attention`, `failure`, `waiting`, `neutral`) pre hodnoty, ktoré predvolené nastavenia nepokrývajú |
| `linkColumn` | string | Voliteľný stĺpec `table`, ktorého bunky obsahujú URL, zobrazený ako [tlačidlo odkazu](#link-buttons), ktoré ho otvorí v novej karte. Musí to byť jeden zo zobrazených stĺpcov. |
| `linkLabel` | string | Voliteľný text tlačidla odkazu. Ak zostane prázdny, tlačidlo zobrazí iba ikonu odkazu. |
| `xField` / `yField` | string | Kľúče riadkov pre číselné osi X a Y (scatter) |
| `min` / `max` | number | Číselný rozsah pre `gauge` (predvolene `0` / `100`) |
| `unit` | string | Voliteľná jednotka zobrazená vedľa hodnoty `numeric` alebo `gauge` |
| `text` | string | Markdown správa pre typ grafu `text`. Ponechajte prázdne a nastavte `valueField` na vykreslenie dynamickej správy prevzatej z údajov predchádzajúceho uzla. |
| `title` | string | Voliteľný názov grafu |
| `hitlWorkflowId` | string | Iba `hitl`. Zobrazí len recenzie tohto Workflow. Ak zostane prázdne, widget zobrazí všetky recenzie. |
| `hitlNodeId` | string | Iba `hitl`. Zúži `hitlWorkflowId` na jeden krok: Agent s ľudskou recenziou alebo krok Slack so schválením, tlačidlami či formulárom. |

## Typy grafov

- **bar / line / area / pie** — kategorické grafy riadené pomocou `labelField` + `valueField` (alebo `series` pre viacsériové bar/line/area). `area` je vyplnený trendový graf.
- **table** — surové riadky vykreslené ako posúvateľná tabuľka pomocou `columns`. Jeden stĺpec sa môže vykresliť ako [stavové štítky](#status-chips) a riadky môžu otvoriť [stránku detailu](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — jedna hodnota KPI z prvého riadka s voliteľnou `unit`.
- **gauge** — jedna hodnota zobrazená v rozsahu `min`–`max` (napr. percento). Používa `valueField`.
- **scatter** — body X/Y z `xField` a `yField` pre korelačné grafy.
- **proportion** — jeden horizontálny pruh rozdelený na podiely s percentuálnou legendou (napr. rozpis jazykov). Používa `labelField` + `valueField`.
- **barGauge** — jeden horizontálny gauge na riadok s prechodom od červenej po zelenú a hodnotou (napr. voľné miesto na disku). Používa `labelField` + `valueField`, voliteľné `unit` a `max` (predvolene najväčšia hodnota riadka).
- **gantt** — časové plány úloh s dátumami, priebehom a závislosťami; pozrite [Ganttove diagramy](#gantt-schedules).
- **erDiagram** — databázové entity, polia, kľúče a relácie; pozrite [Entity relationships](#entity-relationships-db).
- **text** — markdown správa (napr. stavová poznámka ako „Posledné spustenie o 19:47"). Pre statickú správu vložte markdown do `text`, alebo ponechajte `text` prázdne a nastavte `valueField` na vykreslenie reťazca vytvoreného v predchádzajúcom uzle. Podporuje nadpisy, tučné/kurzíva, [zoznamy](../nodes/chart-output-node.md#interactive-task-lists), odkazy a inline kód.
- **hitl** — karusel vašich čakajúcich ľudských recenzií. Hlavička zobrazuje `1/n pending`; ľavá šípka je zakázaná na prvej karte a pravá na poslednej. Názov workflowu otvorí dané spustenie na plátne. **Approve**, **Request changes** a **Reject** ho vyriešia a ikona histórie vedľa názvu widgetu otvorí dané spustenie v dialógu histórie na tej istej stránke. Tento typ grafu ignoruje riadky z predchádzajúcich uzlov, takže workflow widgetu pozostáva iba z uzla Výstup grafu. Každá prihlásená osoba vidí recenzie na workflowoch, ktoré vlastní. Vyberte **Workflow** (a **Select agent**, ak má viac krokov recenzie) vo vlastnostiach uzla alebo v nastaveniach widgetu, aby sa namiesto toho zobrazili recenzie tohto Workflow všetkým, ktorí ho môžu otvoriť; pozrite [widgety HITL](../tabs/dashboard-tab.md#hitl-widgets).

### Ganttove diagramy

Zvoľte **Gantt** (`gantt`) pre harmonogramy projektov a časové osi úloh. Nastavte `dataPath` na pole úloh, napríklad `tasks`. Riadky používajú pevné názvy polí:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` a `end` prijímajú dátumy alebo časové pečiatky ISO. Hodnoty bez časového pásma používajú UTC; posuny časových pásiem sa konvertujú na UTC. `end` musí byť v rovnaký deň alebo po `start`. Pole `progress` je voliteľné (0–100, predvolené 0); `dependencies` obsahuje identifikátory existujúcich úloh. Identifikátory musia byť jedinečné. Prejdením myšou nad úlohou zobrazíte úplné dátumy, priebeh a závislosti. Veľké grafy sa v rámci widgetu posúvajú. Prijíma sa maximálne 500 úloh.

Pre ukážkové dáta môže mapovanie Set s názvom `tasks` použiť `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Prepojte ho s Chart Output s `chartType: "gantt"` a `dataPath: "tasks"`. Namapujte zdrojové stĺpce na tieto pevné názvy pomocou uzla Set; `labelField` a `valueField` sa nepoužívajú.

### Entity relationships (DB)

Zvoľte **Entity relationships (DB)** (`erDiagram`) pre databázové schémy a prepojenia entít. Nastavte `dataPath` na **objekt** grafu, napríklad `graph`, obsahujúci obe polia:

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

Polia majú `name`, voliteľný `type` a voliteľný `key` (`PK`, `FK`, `PK/FK` alebo prázdne). Relácie odkazujú na existujúce identifikátory entít; voliteľné polia `sourceField` a `targetField` ukotvujú spojenie k pomenovaným poliam. `cardinality` prijíma `one-to-one`, `one-to-many` (predvolené), `many-to-one` alebo `many-to-many`. Identifikátory entít a názvy polí v rámci každej entity musia byť jedinečné. Prijíma sa maximálne 100 entít, 100 polí na entitu a 500 relácií.

Pomocou uzla Set zostavte `graph` cez `$dict(entities=array(dict(...)), relations=array(dict(...)))`; použite `chartType: "erDiagram"` a `dataPath: "graph"`. Ide o vizualizáciu poskytnutej schémy; nevykonáva automatickú kontrolu živej databázy.

Oba typy sa zobrazujú v **Pridať widget** s ukážkou a vo výbere typu grafu uzla na plátne. Heym Work môže tieto typy navrhnúť pri popise časového plánu alebo databázovej schémy a vykresliť ukážky navrhovaných úloh či entít ešte pred vytvorením stránky.

### Interaktívne zoznamy úloh

Použite syntax zoznamu úloh v štýle GitHub-flavored markdown v statickom poli `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Na [Dashboarde](../tabs/dashboard-tab.md) sa zaškrtávacie políčka vykresľujú ako klikateľné ovládacie prvky (vhodné pre tmavý aj svetlý režim). Prepnutie zaškrtávacieho políčka aktualizuje pole `text` workflowu widgetu a pretrváva aj po obnovení.

**Inline úpravy:** dvojkliknutím na označenie položky úlohy ju upravíte priamo na mieste. Stlačením Enter alebo kliknutím mimo uložíte; stlačením Escape zrušíte. Úplným vymazaním označenia odstránite danú položku zo zoznamu.

**Odkazy v položkách úloh:** ak označenie obsahuje markdown odkaz (`[title](url)`), kliknutím na odkaz sa otvorí URL bez prepnutia zaškrtávacieho políčka. Pre prepnutie kliknite kamkoľvek inam na riadok.

**Iba statický text:** interaktivita vyžaduje syntax zoznamu úloh GFM (`- [ ]` / `- [x]`). Obyčajné dynamické stavové správy bez položiek úloh zostávajú iba na čítanie. Ak markdown pochádza z `valueField`, prvé prepnutie ho skopíruje do statického poľa `text`, aby sa zmeny zachovali.
### Číslované zoznamy

Textové widgety vykresľujú markdown so **zachovanými explicitnými číslami riadkov**. Každý riadok uveďte číslom, ktoré chcete zobraziť (napr. `9.`, `8.`, `7.`). Heym riadky automaticky neprečísluje.

**Prečo explicitné čísla?** Štandardné usporiadané zoznamy v markdowne (`1.`, `2.`, `3.`) sa menia na HTML zoznamy `<ol>`, ktoré počítajú iba **nahor** od prvého čísla. Zoznam napísaný ako `9.` / `8.` / `7.` by sa v bežnom markdown rendereri zobrazil ako `9`, `10`, `11`. Uvedenie zamýšľaného čísla na začiatku každého riadku tomu zabráni.

**Zostupné zoznamy (napr. najnovšie ako prvé):** zostavte markdown v slučke workflowu a vypočítajte zobrazované číslo pre každú položku:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typický postup:

1. Načítajte alebo zostavte pole položiek (napr. HTTP → `body.videos`).
2. Prejdite pole pomocou [Loop](./loop-node.md); v tele použite [Variable](./variable-node.md) s `.add()` na pridanie jedného očíslovaného riadku pri každej iterácii.
3. Po vetve **done** slučky použite [Set](./set-node.md) s `join("\n")` na akumulované pole (alebo ekvivalent) do jedného markdown reťazca.
4. Nasmerujte **Chart Output** `valueField` na tento reťazec (alebo nastavte statický `text`).

Príklad výrazu riadku vnútri slučky (label `processVideos`, položky s `title` a `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Výsledný markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Pre jednoduchý vzostupný zoznam začínajúci od 1 buď uveďte číslo na začiatku každého riadku (`1.`, `2.`, `3.`), alebo použite slučku s `$loop.index + 1`. Použite [zoznamy s odrážkami](#interactive-task-lists) (`- item`), keď čísla nepotrebujete.

## Stavové štítky

Tabuľka (`table`) môže zobraziť jeden stĺpec ako farebné štítky (chips). Nastavte **Status column** vo vlastnostiach uzla (alebo `statusColumn` v DSL) na názov stĺpca. Každá hodnota dostane jeden z piatich odtieňov a bežné slová ho získajú automaticky bez konfigurácie:

| Odtieň | Predvolené slová |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | čokoľvek iné |

Porovnávanie ignoruje veľkosť písmen, `_` a `-`, takže `IN_PROGRESS` aj `in-progress` zodpovedajú `waiting`. Pre ďalšie hodnoty pridajte **Status tones**; položka prepíše predvolené nastavenie pre danú hodnotu:

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

Server vyhodnotí každú hodnotu na jej odtieň, takže Heym a Heym Work zobrazujú rovnaké farby.

## Stránky detailu: `$page.record`

Dashboard otvorený s parametrom `?record=<value>` spustí každý Workflow widgetu s touto hodnotou ako `$page.record`. Odkaz v riadku tabuľky takúto stránku otvorí; pozri [Stránky detailu](../tabs/dashboard-tab.md#detail-pages). Na dashboarde otvorenom bez záznamu a v dialógu výrazov je `$page.record` rovné `null`. Uzol označený `page` má pred ním prednosť.

Použite ho na načítanie konkrétneho záznamu, ktorého sa stránka týka, napríklad v uzle [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` je samotná hodnota kliknutého riadka, napríklad `V-1002`, nie objekt s poľami. Ak chcete tento záznam nájsť v uzle [DataTable](./datatable-node.md), vyfiltrujte stĺpec záznamu podľa tejto hodnoty: operácia `find` s filtrom `{"vendor_id": "$page.record"}`. Cesta ako `$page.record.id` sa nevyhodnotí na nič, takže widget vytvorený alebo upravený pomocou AI tieto polia zahodí a číta namiesto nich `$page.record`.

Hodnota pochádza z URL, ktorú môže ktokoľvek upraviť. Dashboard síce prijíma iba hodnoty vo formáte záznamu (predvolene písmená, číslice, `-`, `_` a `.`), napriek tomu s ňou zaobchádzajte ako s nedôveryhodným vstupom: odovzdávajte ju tam, kde uzol hodnoty escapuje, napríklad ako parameter HTTP dopytu alebo hodnotu filtra v [DataTable](./datatable-node.md) či ClickHouse, a nikdy nevytvárajte text dopytu spájaním reťazcov. Widgety sa stále spúšťajú pod vlastníkom dashboardu bez ohľadu na to, kto stránku otvorí.

## Ako sa údaje spracúvajú

1. Ak je nastavené `dataPath`, uzol nasleduje túto bodkovú cestu do výstupu predchádzajúceho uzla.
2. V opačnom prípade hľadá pole: zoznam na najvyššej úrovni, pole `data` alebo prvé pole s hodnotou typu zoznam.
3. Riadky priamo z uzla [Data Table](./datatable-node.md) (`{id, data, created_at}`) sa čítajú so svojimi stĺpcami na najvyššej úrovni vedľa `id`, takže `labelField`, `valueField` a `columns` pomenúvajú vlastné stĺpce tabuľky.
4. Pre `table` sa každý riadok stane riadkom tabuľky pomocou `columns` (alebo kľúčov prvého riadku). Pri použití `statusColumn` nesie Payload aj odtieň každej hodnoty v tomto stĺpci.
5. Pre `numeric` a `gauge` hodnota pochádza z `valueField` v prvom riadku (alebo z prvého číselného poľa).
6. Pre `scatter` sa každý riadok stane bodom `[xField, yField]`.
7. Pre `text` sa správa prevezme z `valueField` v prvom riadku, ak je nastavené, inak zo statickej konfigurácie `text` (v opačnom prípade z prvého reťazcového poľa prvého riadku).

## Príklad

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

Gauge (jedna hodnota voči rozsahu):

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

Proportion (jeden pruh rozdelený podľa podielu + percentuálna legenda):

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

Area (vyplnený trend s viacerými sériami):

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

Bar gauge (gradientový gauge pre každý riadok s hodnotami):

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

Text (statická markdown správa — nevyžaduje riadky z predchádzajúceho uzla):

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

Text (dynamický — reťazec správy sa vytvorí v predchádzajúcom uzle a prevezme sa cez `valueField`):

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
## Príklady AI promptov

Pri generovaní widgetu pomocou **AI** sa prompty ako tieto čisto mapujú na jednotlivé typy:

- **Bar** — „Zobraz mesačný obrat za posledných 6 mesiacov ako zvislý stĺpcový graf s ukážkovými údajmi."
- **Line** — „Vykresli denných aktívnych používateľov za posledných 14 dní ako čiarový graf."
- **Area** — „Zobraz využitie pamäte a CPU za posledných 24 hodín ako plošný graf s dvomi sériami. Použi ukážkové údaje."
- **Pie** — „Rozdeľ stav spustení (úspech, chyba, zrušené) ako koláčový graf."
- **Table** — „Zobraz 10 najlepších workflowov podľa počtu spustení ako posúvateľnú tabuľku so stĺpcami name a runs. Použi ukážkové údaje."
- **Numeric** — „Zobraz dnešný celkový počet spustení workflowov ako jediný KPI s jednotkou 'runs'. Použi ukážkové údaje."
- **Gauge** — „Zobraz aktuálne využitie CPU ako gauge od 0 do 100 percent."
- **Scatter** — „Vykresli latenciu požiadaviek voči veľkosti payloadu ako bodový graf s ukážkovými údajmi."
- **Proportion** — „Zobraz moje najpoužívanejšie jazyky ako proporčný pruh: Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Použi ukážkové údaje."
- **Bar gauge** — „Zobraz voľné miesto na disku pre každý zväzok (sda1 až sda7) ako bar gauge v GB. Použi ukážkové údaje."
- **Text** — „Pridaj textový widget s markdown kontrolným zoznamom (jedna zaškrtnutá položka, dve nezaškrtnuté) alebo vypíš 5 najnovších výukových videí v zostupnom poradí (od 5. po 1.) s odkazmi na YouTube — každý riadok uveď explicitným číslom (`5. Title`, `4. Title`, …)."

## Súvisiace

- [Karta Dashboard](../tabs/dashboard-tab.md) — vytvárajte a usporadúvajte widgety
- [Uzol Output](output-node.md) — koncový uzol pre bežné workflowy


## Tlačidlá odkazov

Stĺpec v `table` možno zmeniť na tlačidlá, ktoré otvárajú odkaz. Nastavte **Link column** vo vlastnostiach uzla (alebo `linkColumn` v DSL) na stĺpec, ktorého bunky obsahujú URL, a voliteľne **Link button text** (`linkLabel`). Každá bunka sa stane tlačidlom, ktoré otvorí svoju URL v novej karte. Bez textu tlačidla zobrazí tlačidlo iba ikonu odkazu:

| Hodnota bunky | Otvorí |
| ------------- | ------ |
| `https://jira.example.com/browse/T-1` | Iný web v novej karte |
| `/dashboards` | Stránku v rámci Heym v novej karte |

Tlačidlami sa stanú iba adresy `http://` a `https://` a cesty začínajúce jedným `/`. Akákoľvek iná hodnota, napríklad `javascript:` alebo `//host`, zostane obyčajným textom a prázdna bunka nezobrazí nič.

Tlačidlo funguje vedľa [odkazu riadka](../tabs/dashboard-tab.md#detail-pages): kliknutie na tlačidlo otvorí jeho odkaz v novej karte a kliknutie kdekoľvek inde na riadku stále otvorí stránku s detailmi.
