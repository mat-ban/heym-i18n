# Diagrammi väljund

**Chart Output** node on [armatuurlaud vidina](../tabs/dashboard-tab.md) workflow' terminalne node. See võtab ülesvoolu node'ide poolt toodetud read ja muudab need standardiseeritud diagrammi payload'iks, mille armatuurlaud renderdab.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 0 (terminalne) |
| Väljund | Standardiseeritud diagrammi payload |

Paigutage see node **viimasena** armatuurlaud-vidina workflow's. Selle eelnev node peaks tootma rea-objektide massiivi, näiteks:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Kui teil on ainult näidis/example-andmed (päris allikat pole), tootke need read **Set** node'iga, kasutades `$array(dict(...), dict(...))` — näiteks `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Ärge** kasutage `${...}` ega paljast `{...}` objektiliteraali; Heym ehitab objekte ainult `dict(key=value)` abil.

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` või `hitl` |
| `orientation` | string | `vertical` või `horizontal` (ainult tulpdiagrammide puhul) |
| `dataPath` | string | Punktteega tee rea-massiivini ülesvoolu väljundis (nt `data` või `result.items`). Jätke tühjaks automaatseks tuvastamiseks. |
| `labelField` | string | Rea võti, mida kasutatakse kategooria sildina (pie/bar/line) |
| `valueField` | string | Rea võti, mida kasutatakse numbrilise väärtusena (pie/bar/line/numeric/gauge) |
| `series` | array | Valikuline mitme seeria definitsioon `[{ "name": "Sent", "field": "sent" }]` bar/line jaoks (alistab `valueField`) |
| `columns` | array | Valikuline veergude loend `table` jaoks (vaikimisi esimese rea võtmed) |
| `xField` / `yField` | string | Rea võtmed X- ja Y-numbriliste telgede jaoks (scatter) |
| `min` / `max` | number | Numbriline vahemik `gauge` jaoks (vaikimisi `0` / `100`) |
| `unit` | string | Valikuline ühik, mis kuvatakse `numeric` või `gauge` väärtuse kõrval |
| `text` | string | Markdown-sõnum `text` diagrammi tüübi jaoks. Jätke tühjaks ja määrake `valueField`, et renderdada dünaamilist sõnumit, mis on tõmmatud ülesvoolu andmetest. |
| `title` | string | Valikuline diagrammi pealkiri |

## Diagrammi tüübid

- **bar / line / area / pie** — kategoorilised diagrammid, mida juhivad `labelField` + `valueField` (või `series` mitme seeria bar/line/area jaoks). `area` on täidetud trendidiagramm.
- **table** — töötlemata read, mis on renderdatud keritava tabelina, kasutades `columns`.
- **numeric** — üksik KPI väärtus esimesest reast, valikulise `unit`-iga.
- **gauge** — üksik väärtus, mis on kuvatud `min`–`max` vahemiku suhtes (nt protsent). Kasutab `valueField`.
- **scatter** — X/Y punktid `xField`-ist ja `yField`-ist korrelatsiooni graafikute jaoks.
- **proportion** — üksik horisontaalne tulp, mis on jaotatud osadeks protsentuaalse legendiga (nt keelte jaotus). Kasutab `labelField` + `valueField`.
- **barGauge** — üks horisontaalne gauge iga rea kohta punasest roheliseks gradiendiga ja väärtusega (nt vaba kettaruum). Kasutab `labelField` + `valueField`, valikuline `unit` ja `max` (vaikimisi suurim rea väärtus).
- **text** — markdown-sõnum (nt oleku märkus nagu "Viimane käivitus kell 19:47"). Pange markdown `text`-i staatilise sõnumi jaoks või jätke `text` tühjaks ja määrake `valueField`, et renderdada ülesvoolu toodetud stringi. Toetab pealkirju, paksu/kaldkirja, [loendeid](../nodes/chart-output-node.md#interactive-task-lists), linke ja reasisest koodi.
- **hitl** — karussell teie ootel inimülevaatustest. Päis näitab `1/n pending`; vasak nool on esimesel kaardil keelatud ja parem nool viimasel. Workflow nimi avab selle käivituse lõuendil. **Approve**, **Request changes** ja **Reject** lahendavad selle ning vidina pealkirja kõrval olev ajaloo ikoon avab selle käivituse ajaloo dialoogis samal lehel. See diagrammi tüüp eirab ülesvoolu ridu, seega vidina workflow on ainult Chart Output node. Iga sisselogitud isik näeb ülevaatusi workflow'del, mille omanik ta on.

### Interaktiivsed ülesannete loendid

Kasutage GitHub-flavored markdown ülesannete loendi süntaksit staatilises `text` väljas:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

[Armatuurlaual](../tabs/dashboard-tab.md) renderdatakse märkeruudud klikitavate juhtelementidena (tume ja hele režiim sõbralikud). Märkeruu märkimine uuendab vidina workflow' `text` välja ja püsib üle värskenduste.

**Reasiseselt redigeerimine:** topeltklõpsake ülesande üksuse silti, et seda kohapeal redigeerida. Vajutage Enter või klõpsake eemale, et salvestada; vajutage Escape, et tühistada. Tühjendage silt täielikult, et see üksus loendist eemaldada.

**Lingid ülesande üksustes:** kui silt sisaldab markdown-linki (`[title](url)`), avab lingile klõpsamine URL-i ilma märkeruutu märkimata. Märkimiseks klõpsake mujal real.

**Ainult staatiline tekst:** interaktiivsus nõuab GFM ülesannete loendi süntaksit (`- [ ]` / `- [x]`). Tavalised dünaamilised olekusõnumid ilma ülesande üksusteta jäävad ainult lugemiseks. Kui markdown pärineb `valueField`-ist, kopeerib esimene märkimine selle staatilisse `text` välja, et muudatused püsiksid.
### Nummerdatud loendid

Teksti vidinad renderdavad markdowni **selgesõnaliselt säilitatud reanumbritega**. Lisage iga rea ette number, mida soovite kuvada (nt `9.`, `8.`, `7.`). Heym ei nummerda ridu teie eest ümber.

**Miks selgesõnalised numbrid?** Standardsed markdowni järjestatud loendid (`1.`, `2.`, `3.`) muutuvad HTML `<ol>` loenditeks, mis loendavad ainult **ülespoole** alates esimesest numbrist. Loend, mis on kirjutatud kujul `9.` / `8.` / `7.`, kuvataks tavalises markdown-renderdajas kujul `9`, `10`, `11`. Iga rea ette kavandatud numbri lisamine väldib seda.

**Kahanevad loendid (nt uusim enne):** koostage markdown workflow'd silmuses ja arvutage iga elemendi kuvamisnumber:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tüüpiline muster:

1. Hankige või koostage elementide massiiv (nt HTTP → `body.videos`).
2. Käivitage massiivi peal [Loop](./loop-node.md); kehas kasutage [Variable](./variable-node.md) `.add()`-iga, et lisada iga iteratsiooni kohta üks nummerdatud rida.
3. Pärast silmuse **done** haru kasutage [Set](./set-node.md) `join("\n")` kogutud massiivil (või samaväärsel) üheks markdown-stringiks.
4. Suunake **Chart Output** `valueField` sellele stringile (või määrake staatiline `text`).

Näidisrea avaldis silmuse sees (silt `processVideos`, elemendid väljadega `title` ja `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Tulemuseks olev markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Lihtsa kasvava loendi jaoks, mis algab 1-st, lisage kas iga rea ette number (`1.`, `2.`, `3.`) või kasutage silmust `$loop.index + 1`-ga. Kasutage [täpploendeid](#interactive-task-lists) (`- item`), kui numbreid pole vaja.

## Kuidas andmeid lahendatakse

1. Kui `dataPath` on määratud, järgib sõlm seda punktteed ülesvoolu väljundisse.
2. Vastasel juhul otsitakse massiivi: ülatasemel loend, `data` massiiv või esimene loendi väärtusega väli.
3. `table` puhul saab igast reast tabelirida, kasutades `columns` (või esimese rea võtmeid).
4. `numeric` ja `gauge` puhul tuleb väärtus `valueField`-ist esimesel real (või esimesest numbrilisest väljast).
5. `scatter` puhul saab igast reast `[xField, yField]` punkt.
6. `text` puhul võetakse sõnum `valueField`-ist esimesel real, kui see on määratud, vastasel juhul staatilisest `text` konfiguratsioonist (muidu esimese rea esimesest stringiväljast).

## Näide

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

Gauge (üksikväärtus vs. vahemik):

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

Scatter (X/Y punktid):

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

Proportion (üks riba, mis on jaotatud osakaalu järgi + protsendiline legend):

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

Area (täidetud mitme seeria trend):

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

Bar gauge (rea kohta gradient-gauge väärtustega):

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

Text (staatiline markdown-sõnum — ülesvoolu ridu pole vaja):

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

Text (dünaamiline — sõnumi string luuakse ülesvoolu ja tõmmatakse `valueField`-i kaudu):

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
## Näidis-AI-promptid

Kui genereerite vidinat **AI** abil, vastavad sellised promptid selgelt igale tüübile:

- **Tulp** — "Kuva viimase 6 kuu igakuine tulu vertikaalse tulpdiagrammina koos näidisandmetega."
- **Joon** — "Joonista viimase 14 päeva päevased aktiivsed kasutajad joondiagrammina."
- **Ala** — "Kuva mälu ja CPU kasutus viimase 24 tunni jooksul aladiagrammina kahe seeriaga. Kasuta näidisandmeid."
- **Ring** — "Jaota käivituste olek (õnnestunud, viga, tühistatud) ringdiagrammina."
- **Tabel** — "Kuva 10 enim käivitatud workflow'd keritava tabelina veergudega nimi ja käivitused. Kasuta näidisandmeid."
- **Numbriline** — "Kuva tänased workflow'de käivituste koguarv üksiku KPI-na ühikuga 'runs'. Kasuta näidisandmeid."
- **Mõõdik** — "Kuva praegune CPU kasutus mõõdikuna vahemikus 0 kuni 100 protsenti."
- **Hajuvus** — "Joonista päringu latentsus versus payload'i suurus hajuvusdiagrammina koos näidisandmetega."
- **Proportsioon** — "Kuva minu enim kasutatud keeled proportsiooniribana: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Kasuta näidisandmeid."
- **Tulpmõõdik** — "Kuva vaba kettaruumi iga köite kohta (sda1 kuni sda7) tulpmõõdikuna GB-des. Kasuta näidisandmeid."
- **Tekst** — "Lisa tekstividin markdown-kontrollnimekirjaga (üks märgitud üksus, kaks märkimata) või loetle 5 uusimat õpetusvideot kahanevas järjekorras (5. kuni 1.) YouTube'i linkidega — lisa iga rea ette selgesõnaline number (`5. Pealkiri`, `4. Pealkiri`, …)."

## Seotud

- [Töölaua vahekaart](../tabs/dashboard-tab.md) — vidinate loomine ja korraldamine
- [Väljundsõlm](output-node.md) — tavaliste workflow'de lõppsõlm
