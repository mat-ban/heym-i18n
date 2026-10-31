# Diagramos Išvestis

**Diagramos Išvestis** mazgas yra terminalinis mazgas [informacijos suvestinės valdiklio](../tabs/dashboard-tab.md) workflow. Jis priima eiles, kurias sukuria aukščiau esantys mazgai, ir paverčia jas į standartizuotą diagramos payload, kurį atvaizduoja informacijos suvestinė.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 0 (terminalinis) |
| Išvestis | Standartizuotas diagramos payload |

Šį mazgą įdėkite **paskutinį** informacijos suvestinės valdiklio workflow. Esybių ryšiams mazgas prieš jį sukuria grafo objektą (žr. [Entity relationships](#entity-relationships-db)). Kitos duomenimis pagrįstos diagramos naudoja eilučių objektų masyvą, pavyzdžiui:

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
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text`, arba `hitl` |
| `orientation` | string | `vertical` arba `horizontal` (tik juostinėms diagramoms) |
| `dataPath` | string | Taško kelias į eilučių masyvą (arba grafo objektą `erDiagram`) aukščiau esančioje išvestyje (pvz., `data` arba `result.items`). Palikite tuščią, kad automatiškai nustatytų. |
| `labelField` | string | Eilutės raktas, naudojamas kaip kategorijos etiketė (pyrago/juostinės/linijinės) |
| `valueField` | string | Eilutės raktas, naudojamas kaip skaitinė vertė (pyrago/juostinės/linijinės/skaitinės/indikatoriaus) |
| `series` | array | Pasirinktinė daugiasekvenčių apibrėžtis `[{ "name": "Sent", "field": "sent" }]` juostinėms/linijinėms (perrašoma `valueField`) |
| `columns` | array | Pasirinktinė stulpelių sąrašas `table` (numatyta pagal pirmos eilutės raktus) |
| `statusColumn` | string | Pasirenkamas `table` stulpelis, atvaizduojamas kaip spalvoti [būsenos žetonai](#status-chips). Turi būti vienas iš rodomų stulpelių. |, o su `linkColumn` joje yra ir nuorodos stulpelis, ir mygtuko tekstas.
| `statusTones` | object | Pasirenkamas būsenos reikšmės susiejimas su atspalviu (`success`, `attention`, `failure`, `waiting`, `neutral`) reikšmėms, kurių numatytieji nustatymai neapima |
| `linkColumn` | string | Pasirenkamas `table` stulpelis, kurio langeliuose yra URL ir kuris rodomas kaip [nuorodos mygtukas](#link-buttons), atidarantis jį naujame skirtuke. Tai turi būti vienas iš rodomų stulpelių. |
| `linkLabel` | string | Pasirenkamas nuorodos mygtuko tekstas. Palikus tuščią, mygtukas rodo tik nuorodos piktogramą. |
| `xField` / `yField` | string | Eilutės raktai X ir Y skaitmeniniams ašims (sklaidos) |
| `min` / `max` | number | Skaitmeninis diapazonas `gauge` (numatyta `0` / `100`) |
| `unit` | string | Pasirinktinė vienetų reikšmė, rodoma šalia `numeric` arba `gauge` vertės |
| `text` | string | Markdown žinutė `text` diagramos tipui. Palikite tuščią ir nustatykite `valueField`, kad atvaizduotumėte dinaminę žinutę, gautą iš aukščiau esančių duomenų. |
| `title` | string | Pasirinktinis diagramos pavadinimas |
| `hitlWorkflowId` | string | Tik `hitl`. Rodo tik šio Workflow peržiūras. Palikus tuščią, valdiklis rodo visas peržiūras. |
| `hitlNodeId` | string | Tik `hitl`. Susiaurina `hitlWorkflowId` iki vieno žingsnio: Agent su žmogaus peržiūra arba Slack patvirtinimo, mygtukų ar formos žingsnis. |

## Diagramos tipai

- **juostinė / linijinė / plotinė / pyrago** — kategorinės diagramos, valdomos `labelField` + `valueField` (arba `series` daugiasekvenčių juostinėms/linijinėms/plotinėms). `area` yra užpildyta tendencijų diagrama.
- **lentelė** — žali eilučių duomenys, atvaizduojami kaip slenkama lentelė naudojant `columns`. Vienas stulpelis gali būti atvaizduojamas kaip [būsenos žetonai](#status-chips), o eilutės gali atverti [išsamios informacijos puslapį](../tabs/dashboard-tab.md#detail-pages).
- **skaitinė** — vienas KPI vertė iš pirmos eilutės, su pasirinktiniais `unit`.
- **indikatorius** — viena vertė, rodoma prieš `min`–`max` diapazoną (pvz., procentas). Naudoja `valueField`.
- **sklaida** — X/Y taškai iš `xField` ir `yField` koreliacijos diagramoms.
- **proporcija** — viena horizontalioji juosta, padalinta į dalis su procentų legenda (pvz., kalbos pasiskirstymas). Naudoja `labelField` + `valueField`.
- **juostos indikatorius** — viena horizontalioji juosta kiekvienai eilutei su raudona→žalia gradientu ir verte (pvz., laisvos disko vietos). Naudoja `labelField` + `valueField`, pasirinktinį `unit` ir `max` (numatyta pagal didžiausią eilutės vertę).
- **gantt** — užduočių tvarkaraščiai su datomis, eiga ir priklausomybėmis; žr. [Gantt schedules](#gantt-schedules).
- **erDiagram** — duomenų bazės esybės, laukai, raktai ir ryšiai; žr. [Entity relationships](#entity-relationships-db).
- **tekstas** — markdown žinutė (pvz., statuso užrašas, pvz., "Paskutinis vykdymas 19:47"). Įdėkite markdown į `text` statinei žinutei, arba palikite `text` tuščią ir nustatykite `valueField`, kad atvaizduotumėte iš aukščiau gautą eilutę. Palaiko antraštes, paryškintą/italiką, [sąrašus](../nodes/chart-output-node.md#interactive-task-lists), nuorodas ir įterptą kodą.
- **hitl** — karuselė laukiančių žmogaus atsiliepimų. Antraštėje rodomas `1/n laukia`; kairysis rodyklė yra neaktyvi pirmame kortelėje, o dešinysis rodyklė paskutinėje. Workflow pavadinimas atidaro tą vykdymą drobėje. **Patvirtinti**, **Prašyti pakeitimų** ir **Atmesti** išsprendžia tai, o istorijos piktograma šalia valdiklio pavadinimo atidaro tą vykdymą istorijos dialoge toje pačioje pusėje. Šis diagramos tipas ignoruoja aukščiau esančias eiles, todėl valdiklio workflow yra tik Diagramos Išvestis mazgas. Kiekvienas prisijungęs asmuo mato atsiliepimus apie workflows, kuriuos jie valdo. Mazgo savybėse arba valdiklio nustatymuose pasirinkite **Workflow** (ir **Select agent**, kai jis turi kelis peržiūros žingsnius), kad vietoj to būtų rodomos to Workflow peržiūros visiems, kurie gali jį atidaryti; žr. [HITL valdikliai](../tabs/dashboard-tab.md#hitl-widgets).

### Gantt schedules

Pasirinkite **Gantt** (`gantt`) projektų grafikams ir užduočių laiko juostoms. Nustatykite `dataPath` į užduočių masyvą, pvz., `tasks`. Eilutėse naudojami fiksuoti laukų pavadinimai:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` ir `end` priima ISO datas arba datos ir laiko reikšmes. Reikšmės be laiko juostos naudoja UTC; laiko juostų poslinkiai konvertuojami į UTC. `end` turi sutapti su `start` arba būti vėlesnė. `progress` yra neprivalomas (0–100, numatytoji reikšmė 0); `dependencies` pateikia esamų užduočių ID. ID turi būti unikalūs. Užveskite pelės žymeklį virš užduoties, kad pamatytumėte visas datas, eigą ir priklausomybes. Didelės diagramos slenkamos valdiklio viduje. Priimama ne daugiau kaip 500 užduočių.

Pavyzdiniams duomenims Set susiejimas pavadinimu `tasks` gali naudoti `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Prijunkite jį prie Chart Output naudodami `chartType: "gantt"` ir `dataPath: "tasks"`. Šaltinio stulpelius susiekite su šiais fiksuotais pavadinimais per Set mazgą; `labelField` ir `valueField` nenaudojami.

### Entity relationships (DB)

Pasirinkite **Entity relationships (DB)** (`erDiagram`) duomenų bazių schemoms ir esybių ryšiams. Nustatykite `dataPath` į grafo **objektą**, pvz., `graph`, kuriame yra abu masyvai:

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

Laukai turi `name`, neprivalomą `type` ir neprivalomą `key` (`PK`, `FK`, `PK/FK` arba tuščias). Ryšiai nurodo esamų esybių ID; neprivalomi laukai `sourceField` ir `targetField` susieja ryšį su nurodytais laukais. `cardinality` priima `one-to-one`, `one-to-many` (numatytasis), `many-to-one` arba `many-to-many`. Esybių ID ir laukų pavadinimai kiekvienoje esybėje turi būti unikalūs. Priimama ne daugiau kaip 100 esybių, 100 laukų vienai esybei ir 500 ryšių.

Naudodami Set mazgą sukonstruokite `graph` per `$dict(entities=array(dict(...)), relations=array(dict(...)))`; naudokite `chartType: "erDiagram"` ir `dataPath: "graph"`. Tai pateiktos schemos vizualizacija; ji automatiškai netikrina veikiančios duomenų bazės.

Abu tipai rodomi skiltyje **Pridėti valdiklį** su peržiūra ir mazgo diagramos tipo pasirinkime drobėje. Heym Work gali siūlyti šiuos tipus aprašant grafiką ar duomenų bazės schemą, nubraižydama siūlomų užduočių ar esybių peržiūras prieš sukuriant puslapį.

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

## Būsenos žetonai

`table` gali rodyti vieną stulpelį kaip spalvotus žetonus (chips). Mazgo savybėse nustatykite **Status column** (arba `statusColumn` DSL) į stulpelio pavadinimą. Kiekviena reikšmė gauna vieną iš penkių atspalvių, o įprasti žodžiai jį gauna automatiškai be konfigūravimo:

| Atspalvis | Numatytieji žodžiai |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | visa kita |

Atitikimas ignoruoja raidžių dydį, `_` ir `-`, todėl `IN_PROGRESS` ir `in-progress` abu tampa `waiting`. Kitoms reikšmėms pridėkite **Status tones**; įrašas pakeičia numatytąjį tos reikšmės atspalvį:

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

Serveris kiekvieną reikšmę susieja su jos atspalviu, todėl Heym ir Heym Work rodo tas pačias spalvas.

## Išsamios informacijos puslapiai: `$page.record`

Prietaisų skydelis, atidarytas su `?record=<value>`, paleidžia kiekvieno valdiklio Workflow su ta reikšme kaip `$page.record`. Lentelės eilutės nuoroda atveria tokį puslapį; žr. [Išsamios informacijos puslapiai](../tabs/dashboard-tab.md#detail-pages). Prietaisų skydelyje, atidarytame be įrašo, ir išraiškų dialoge `$page.record` yra `null`. Mazgas su žyma `page` turi pirmenybę prieš jį.

Naudokite jį norėdami gauti konkretų įrašą, apie kurį yra puslapis, pavyzdžiui, [HTTP](./http-node.md) mazge:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` yra paties spustelėto eilutės elemento reikšmė, pvz., `V-1002`, o ne objektas su laukais. Norėdami rasti tą įrašą [DataTable](./datatable-node.md) mazge, filtruokite jo įrašo stulpelį pagal reikšmę: operacija `find` su filtru `{"vendor_id": "$page.record"}`. Toks kelias kaip `$page.record.id` nieko negrąžina, todėl AI sukurtas ar patobulintas valdiklis tuos laukus pašalina ir vietoj jų skaito `$page.record`.

Reikšmė gaunama iš URL, kurį bet kas gali redaguoti. Prietaisų skydelis priima tik jo įrašo formatą atitinkančias reikšmes (pagal numatytuosius nustatymus raides, skaitmenis, `-`, `_` ir `.`), tačiau vis tiek vertinkite ją kaip nepatikimą įvestį: perduokite ją ten, kur mazgas ekranuoja reikšmes, pavyzdžiui, kaip HTTP užklausos parametrą arba [DataTable](./datatable-node.md) ar ClickHouse filtro reikšmę, ir niekada nekonstravokite užklausos teksto jungdami eilutes su ja. Valdikliai vis tiek vykdomi prietaisų skydelio savininko vardu, kad ir kas atidarytų puslapį.

## Kaip duomenys yra sprendžiami

1. Jei nustatytas `dataPath`, mazgas seka tą taško kelią į aukščiau esančią išvestį.
2. Priešingu atveju jis ieško masyvo: viršutinio lygio sąrašo, `data` masyvo arba pirmo sąrašo lauko.
3. Eilutės tiesiai iš [Data Table](./datatable-node.md) mazgo (`{id, data, created_at}`) skaitomos su jų stulpeliais aukščiausiame lygyje šalia `id`, todėl `labelField`, `valueField` ir `columns` įvardija pačios lentelės stulpelius.
4. `table` atveju kiekviena eilutė tampa lentelės eile naudojant `columns` (arba pirmos eilutės raktus). Naudojant `statusColumn`, Payload taip pat perduoda kiekvienos to stulpelio reikšmės atspalvį.
5. `numeric` ir `gauge` atveju vertė gaunama iš `valueField` pirmoje eilutėje (arba pirmo numerinio lauko).
6. `scatter` atveju kiekviena eilutė tampa `[xField, yField]` tašku.
7. `text` atveju žinutė imama iš `valueField` pirmoje eilutėje, kai nustatyta, priešingu atveju iš statinio `text` konfigūracijos (arba pirmo lauko pirmoje eilutėje).

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


## Nuorodų mygtukai

`table` gali paversti vieną stulpelį mygtukais, atidarančiais nuorodą. Mazgo savybėse nustatykite **Link column** (arba `linkColumn` DSL) į stulpelį, kurio langeliuose yra URL, ir, jei norite, **Link button text** (`linkLabel`). Kiekvienas langelis tampa mygtuku, atidarančiu savo URL naujame skirtuke. Be mygtuko teksto mygtukas rodo tik nuorodos piktogramą:

| Langelio reikšmė | Atidaro |
| ---------------- | ------- |
| `https://jira.example.com/browse/T-1` | Kitą svetainę naujame skirtuke |
| `/dashboards` | Puslapį Heym viduje naujame skirtuke |

Mygtukais tampa tik `http://` ir `https://` adresai bei keliai, prasidedantys vienu `/`. Bet kuri kita reikšmė, pavyzdžiui, `javascript:` ar `//host`, lieka paprastu tekstu, o tuščias langelis nieko nerodo.

Mygtukas veikia šalia [eilutės nuorodos](../tabs/dashboard-tab.md#detail-pages): spustelėjus mygtuką jo nuoroda atidaroma naujame skirtuke, o spustelėjus bet kur kitur eilutėje vis tiek atidaromas išsamios informacijos puslapis.
