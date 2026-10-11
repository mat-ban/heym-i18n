# Diagramos Išvestis

**Diagramos Išvestis** mazgas yra terminalinis mazgas [informacijos suvestinės valdiklio](../tabs/dashboard-tab.md) workflow. Jis priima eiles, kurias sukuria aukščiau esantys mazgai, ir paverčia jas į standartizuotą diagramos payload, kurį atvaizduoja informacijos suvestinė.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 0 (terminalinis) |
| Išvestis | Standartizuotas diagramos payload |

Šį mazgą įdėkite **paskutinį** informacijos suvestinės valdiklio workflow. Mazgas prieš jį turėtų sukurti eilučių objektų masyvą, pavyzdžiui:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Kai turite tik pavyzdinius/samples duomenis (be tikro šaltinio), sukurkite šias eiles naudodami **Set** mazgą su `$array(dict(...), dict(...))` — pavyzdžiui, `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nenaudokite** `${...}` arba nuogų `{...}` objektų literalių; Heym kuria objektus tik su `dict(key=value)`.

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, arba `hitl` |
| `orientation` | string | `vertical` arba `horizontal` (tik juostinėms diagramoms) |
| `dataPath` | string | Taško kelias į eilučių masyvą aukščiau esančioje išvestyje (pvz., `data` arba `result.items`). Palikite tuščią, kad automatiškai nustatytų. |
| `labelField` | string | Eilutės raktas, naudojamas kaip kategorijos etiketė (pyrago/juostinės/linijinės) |
| `valueField` | string | Eilutės raktas, naudojamas kaip skaitinė vertė (pyrago/juostinės/linijinės/skaitinės/indikatoriaus) |
| `series` | array | Pasirinktinė daugiasekvenčių apibrėžtis `[{ "name": "Sent", "field": "sent" }]` juostinėms/linijinėms (perrašoma `valueField`) |
| `columns` | array | Pasirinktinė stulpelių sąrašas `table` (numatyta pagal pirmos eilutės raktus) |
| `xField` / `yField` | string | Eilutės raktai X ir Y skaitmeniniams ašims (sklaidos) |
| `min` / `max` | number | Skaitmeninis diapazonas `gauge` (numatyta `0` / `100`) |
| `unit` | string | Pasirinktinė vienetų reikšmė, rodoma šalia `numeric` arba `gauge` vertės |
| `text` | string | Markdown žinutė `text` diagramos tipui. Palikite tuščią ir nustatykite `valueField`, kad atvaizduotumėte dinaminę žinutę, gautą iš aukščiau esančių duomenų. |
| `title` | string | Pasirinktinis diagramos pavadinimas |

## Diagramos tipai

- **juostinė / linijinė / plotinė / pyrago** — kategorinės diagramos, valdomos `labelField` + `valueField` (arba `series` daugiasekvenčių juostinėms/linijinėms/plotinėms). `area` yra užpildyta tendencijų diagrama.
- **lentelė** — žali eilučių duomenys, atvaizduojami kaip slenkama lentelė naudojant `columns`.
- **skaitinė** — vienas KPI vertė iš pirmos eilutės, su pasirinktiniais `unit`.
- **indikatorius** — viena vertė, rodoma prieš `min`–`max` diapazoną (pvz., procentas). Naudoja `valueField`.
- **sklaida** — X/Y taškai iš `xField` ir `yField` koreliacijos diagramoms.
- **proporcija** — viena horizontalioji juosta, padalinta į dalis su procentų legenda (pvz., kalbos pasiskirstymas). Naudoja `labelField` + `valueField`.
- **juostos indikatorius** — viena horizontalioji juosta kiekvienai eilutei su raudona→žalia gradientu ir verte (pvz., laisvos disko vietos). Naudoja `labelField` + `valueField`, pasirinktinį `unit` ir `max` (numatyta pagal didžiausią eilutės vertę).
- **tekstas** — markdown žinutė (pvz., statuso užrašas, pvz., "Paskutinis vykdymas 19:47"). Įdėkite markdown į `text` statinei žinutei, arba palikite `text` tuščią ir nustatykite `valueField`, kad atvaizduotumėte iš aukščiau gautą eilutę. Palaiko antraštes, paryškintą/italiką, [sąrašus](../nodes/chart-output-node.md#interactive-task-lists), nuorodas ir įterptą kodą.
- **hitl** — karuselė laukiančių žmogaus atsiliepimų. Antraštėje rodomas `1/n laukia`; kairysis rodyklė yra neaktyvi pirmame kortelėje, o dešinysis rodyklė paskutinėje. Workflow pavadinimas atidaro tą vykdymą drobėje. **Patvirtinti**, **Prašyti pakeitimų** ir **Atmesti** išsprendžia tai, o istorijos piktograma šalia valdiklio pavadinimo atidaro tą vykdymą istorijos dialoge toje pačioje pusėje. Šis diagramos tipas ignoruoja aukščiau esančias eiles, todėl valdiklio workflow yra tik Diagramos Išvestis mazgas. Kiekvienas prisijungęs asmuo mato atsiliepimus apie workflows, kuriuos jie valdo.

### Interaktyvūs užduočių sąrašai

Naudokite GitHub stiliaus markdown užduočių sąrašo sintaksę statiniame `text` lauke:

```markdown
- [x] Pasirinkimas 1
- [ ] Pasirinkimas 2
- [ ] Pasirinkimas 3
```

Informacijos suvestinėje [Dashboard](../tabs/dashboard-tab.md) žymekliai atvaizduojami kaip spustelėjami valdikliai (tinka tamsiam ir šviesiam režimui). Žymeklio perjungimas atnaujina valdiklio workflow `text` lauką ir išlieka po atnaujinimų.

**Inline redagavimas:** dukart spustelėkite užduoties elemento etiketę, kad redaguotumėte ją vietoje. Paspauskite Enter arba spustelėkite kitur, kad išsaugotumėte; paspauskite Escape, kad atšauktumėte. Išvalykite etiketę visiškai, kad pašalintumėte tą elementą iš sąrašo.

**Nuorodos užduočių elementuose:** kai etiketėje yra markdown nuoroda (`[title](url)`), spustelėjus nuorodą atsidaro URL, nesukeliant žymeklio perjungimo. Spustelėkite kitur eilutėje, kad perjungtumėte.

**Tik statinis tekstas:** interaktyvumas reikalauja GFM užduočių sąrašo sintaksės (`- [ ]` / `- [x]`). Paprastos dinaminės statuso žinutės be užduočių elementų lieka tik skaitymo režimu. Kai markdown gaunamas iš `valueField`, pirmas perjungimas kopijuoja jį į statinį `text` lauką, kad pakeitimai išliktų.
### Numeruoti sąrašai

Teksto valdikliai renderina markdown su **išsaugotais aiškiais linijų numeriais**. Prie kiekvienos eilutės pridėkite norimą rodyti numerį (pvz., `9.`, `8.`, `7.`). Heym nepernumeruoja eilučių už Jus.

**Kodėl aiškūs numeriai?** Standartiniai markdown numeruoti sąrašai (`1.`, `2.`, `3.`) tampa HTML `<ol>` sąrašais, kurie skaičiuoja **tik** nuo pirmo numerio. Sąrašas, parašytas kaip `9.` / `8.` / `7.`, normalioje markdown renderinimo programoje būtų rodomas kaip `9`, `10`, `11`. Pridėjus kiekvienai eilutei numatytą numerį, to išvengiama.

**Mažėjantys sąrašai (pvz., naujausi pirmiausia):** sukurkite markdown workflow cikle ir apskaičiuokite rodomą numerį kiekvienam elementui:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tipiškas modelis:

1. Gaukite arba sukurkite elementų masyvą (pvz., HTTP → `body.videos`).
2. [Ciklas](./loop-node.md) per masyvą; kūno viduje naudokite [Kintamąjį](./variable-node.md) su `.add()`, kad pridėtumėte po vieną numeruotą eilutę kiekvienai iteracijai.
3. Po ciklo **pabaigos** šakos, [Nustatykite](./set-node.md) `join("\n")` sukauptam masyvui (arba ekvivalentui) į vieną markdown eilutę.
4. Nurodykite **Chart Output** `valueField` į tą eilutę (arba nustatykite statinį `text`).

Pavyzdinė eilutės išraiška ciklo viduje (etiketė `processVideos`, elementai su `title` ir `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Gautas markdown:

```markdown
9. [Naujausias vaizdo įrašas](https://www.youtube.com/watch?v=abc)
8. [Ankstesnis vaizdo įrašas](https://www.youtube.com/watch?v=def)
1. [Seniausias vaizdo įrašas](https://www.youtube.com/watch?v=xyz)
```

Norint sukurti paprastą didėjantį sąrašą, pradedant nuo 1, arba pridėkite prie kiekvienos eilutės (`1.`, `2.`, `3.`), arba naudokite ciklą su `$loop.index + 1`. Naudokite [bulinius sąrašus](#interactive-task-lists) (`- item`), kai nereikia numerių.

## Kaip duomenys yra sprendžiami

1. Jei nustatytas `dataPath`, mazgas seka tą taško kelią į aukščiau esančią išvestį.
2. Priešingu atveju jis ieško masyvo: viršutinio lygio sąrašo, `data` masyvo arba pirmo sąrašo lauko.
3. `table` atveju kiekviena eilutė tampa lentelės eile naudojant `columns` (arba pirmos eilutės raktus).
4. `numeric` ir `gauge` atveju vertė gaunama iš `valueField` pirmoje eilutėje (arba pirmo numerinio lauko).
5. `scatter` atveju kiekviena eilutė tampa `[xField, yField]` tašku.
6. `text` atveju žinutė imama iš `valueField` pirmoje eilutėje, kai nustatyta, priešingu atveju iš statinio `text` konfigūracijos (arba pirmo lauko pirmoje eilutėje).

## Pavyzdys

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
    "title": "Mėnesinės pajamos"
  }
}
```

Gauges (viena vertė prieš intervalą):

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

Scatter (X/Y taškai):

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

Proporcija (vienas stulpelis padalintas pagal dalį + procentinė legenda):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Dažniausiai naudojamos kalbos"
  }
}
```

Plotas (užpildyta daugiaserijinė tendencija):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Atmintis", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Atmintis / CPU"
  }
}
```

Baro gauge (kiekvienai eilei gradientinis gauge su vertėmis):

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
    "title": "Laisva disko vieta"
  }
}
```

Tekstas (statinė markdown žinutė — nereikia aukščiau esančių eilučių):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Paskutinis vykdymas** `19:47` — visi patikrinimai praėjo ✅",
    "title": "Būsena"
  }
}
```

Tekstas (dinaminis — žinutės eilutė generuojama aukščiau ir traukiama per `valueField`):

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
## Pavyzdiniai AI promptai

Kuriant valdiklį su **AI**, tokie promptai aiškiai atitinka kiekvieną tipą:

- **Bar** — "Rodyti mėnesines pajamas už paskutinius 6 mėnesius kaip vertikalų stulpelinį diagramą su pavyzdiniais duomenimis."
- **Line** — "Pavaizduoti kasdienių aktyvių vartotojų skaičių per paskutines 14 dienų kaip linijinę diagramą."
- **Area** — "Rodyti atminties ir CPU naudojimą per paskutines 24 valandas kaip plotinę diagramą su dviem serijomis. Naudoti pavyzdinius duomenis."
- **Pie** — "Išskaidyti vykdymo būseną (sėkminga, klaida, atšaukta) kaip pyrago diagramą."
- **Table** — "Rodyti 10 geriausių workflows pagal vykdymo skaičių kaip slenkamąją lentelę su pavadinimo ir vykdymų stulpeliais. Naudoti pavyzdinius duomenis."
- **Numeric** — "Rodyti šiandienos bendrą workflow vykdymų skaičių kaip vieną KPI su vienetu 'vykdymai'. Naudoti pavyzdinius duomenis."
- **Gauge** — "Rodyti dabartinį CPU naudojimą kaip matuoklį nuo 0 iki 100 procentų."
- **Scatter** — "Pavaizduoti užklausų delsą prieš payload dydį kaip taškų diagramą su pavyzdiniais duomenimis."
- **Proportion** — "Rodyti mano dažniausiai naudojamas kalbas kaip proporcijų stulpelį: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Naudoti pavyzdinius duomenis."
- **Bar gauge** — "Rodyti laisvą disko vietą pagal kiekvieną tūrį (sda1 iki sda7) kaip stulpelinį matuoklį GB. Naudoti pavyzdinius duomenis."
- **Text** — "Pridėti teksto valdiklį su markdown kontroliniu sąrašu (vienas pažymėtas elementas, du nepažymėti), arba išvardinti 5 naujausius mokomųjų vaizdo įrašų pavadinimus mažėjančia tvarka (5. iki 1.) su YouTube nuorodomis — kiekvieną eilutę pradėti su aiškiu numeriu (`5. Pavadinimas`, `4. Pavadinimas`, …)."

## Susiję

- [Dashboard tab](../tabs/dashboard-tab.md) — kurti ir išdėstyti valdiklius
- [Output node](output-node.md) — terminalo mazgas įprastiems workflows
