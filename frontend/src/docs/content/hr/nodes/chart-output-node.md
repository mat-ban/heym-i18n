# Chart Output

**Chart Output** čvor je završni čvor workflowa [dashboard widgeta](../tabs/dashboard-tab.md). Preuzima retke koje su proizveli prethodni čvorovi i pretvara ih u standardizirani chart payload koji dashboard renderira.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 0 (završni) |
| Izlaz | Standardizirani chart payload |

Postavite ovaj čvor **posljednji** u workflowu dashboard widgeta. Za entity relationships čvor prije njega proizvodi objekt grafa (pogledajte [Entity relationships](#entity-relationships-db)). Ostali grafikoni temeljeni na podacima koriste array objekata redaka, na primjer:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Kada imate samo primjerene/testne podatke (bez stvarnog izvora), proizvedite te retke pomoću **Set** čvora koristeći `$array(dict(...), dict(...))` — na primjer `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nemojte** koristiti `${...}` ni gole literale objekata `{...}`; Heym gradi objekte isključivo pomoću `dict(key=value)`.

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` ili `hitl` |
| `orientation` | string | `vertical` ili `horizontal` (samo za bar chartove) |
| `dataPath` | string | Dot putanja do arraya redaka (ili objekta grafa za `erDiagram`) unutar izlaza prethodnog čvora (npr. `data` ili `result.items`). Ostavite prazno za automatsko prepoznavanje. |
| `labelField` | string | Ključ retka koji se koristi kao oznaka kategorije (pie/bar/line) |
| `valueField` | string | Ključ retka koji se koristi kao numerička vrijednost (pie/bar/line/numeric/gauge) |
| `series` | array | Neobavezna definicija više serija `[{ "name": "Sent", "field": "sent" }]` za bar/line (nadjačava `valueField`) |
| `columns` | array | Neobavezan popis stupaca za `table` (zadano su ključevi prvog retka) |
| `statusColumn` | string | Neobavezni stupac `table` prikazan kao obojene [statusne oznake](#status-chips). Mora biti jedan od prikazanih stupaca. |, a s `linkColumn` sadrži i stupac poveznice i tekst gumba.
| `statusTones` | object | Neobavezno mapiranje vrijednosti statusa u ton (`success`, `attention`, `failure`, `waiting`, `neutral`) za vrijednosti koje zadane postavke ne pokrivaju |
| `linkColumn` | string | Neobavezni stupac `table` čije ćelije sadrže URL, prikazan kao [gumb poveznice](#link-buttons) koji ga otvara u novoj kartici. Mora biti jedan od prikazanih stupaca. |
| `linkLabel` | string | Neobavezni tekst gumba poveznice. Ako ostane prazno, gumb prikazuje samo ikonu poveznice. |
| `xField` / `yField` | string | Ključevi redaka za X i Y numeričke osi (scatter) |
| `min` / `max` | number | Numerički raspon za `gauge` (zadano `0` / `100`) |
| `unit` | string | Neobavezna jedinica prikazana uz `numeric` ili `gauge` vrijednost |
| `text` | string | Markdown poruka za `text` chart type. Ostavite prazno i postavite `valueField` za renderiranje dinamičke poruke preuzete iz podataka prethodnog čvora. |
| `title` | string | Neobavezan naslov charta |
| `hitlWorkflowId` | string | Samo `hitl`. Prikazuje samo recenzije ovog Workflowa. Ako ostane prazno, widget prikazuje sve recenzije. |
| `hitlNodeId` | string | Samo `hitl`. Sužava `hitlWorkflowId` na jedan korak: Agent s ljudskom recenzijom ili Slack korak odobrenja, gumba ili obrasca. |

## Chart types

- **bar / line / area / pie** — kategorijski chartovi vođeni poljima `labelField` + `valueField` (ili `series` za višeserijske bar/line/area). `area` je ispunjeni trend chart.
- **table** — sirovi retci renderirani kao tablica s pomicanjem pomoću `columns`. Jedan se stupac može prikazati kao [statusne oznake](#status-chips), a retci mogu otvoriti [stranicu s pojedinostima](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — jedna KPI vrijednost iz prvog retka, s neobaveznom `unit`.
- **gauge** — jedna vrijednost prikazana u rasponu `min`–`max` (npr. postotak). Koristi `valueField`.
- **scatter** — X/Y točke iz `xField` i `yField` za prikaze korelacije.
- **proportion** — jedna horizontalna traka podijeljena na udjele s postotnom legendom (npr. raspodjela jezika). Koristi `labelField` + `valueField`.
- **barGauge** — jedan horizontalni gauge po retku s gradijentom crveno→zeleno i vrijednošću (npr. slobodan prostor na disku). Koristi `labelField` + `valueField`, neobavezne `unit` i `max` (zadano je najveća vrijednost retka).
- **gantt** — rasporedi zadataka s datumima, napretkom i ovisnostima; pogledajte [Gantt rasporedi](#gantt-schedules).
- **erDiagram** — entiteti baze podataka, polja, ključevi i relacije; pogledajte [Entity relationships](#entity-relationships-db).
- **text** — markdown poruka (npr. statusna napomena poput "Last execution at 19:47"). Stavite markdown u `text` za statičnu poruku ili ostavite `text` prazno i postavite `valueField` za renderiranje stringa proizvedenog na prethodnom čvoru. Podržava naslove, podebljano/kurziv, [popise](../nodes/chart-output-node.md#interactive-task-lists), poveznice i inline kod.
- **hitl** — carousel vaših recenzija koje čekaju ljudsku obradu. Zaglavlje prikazuje `1/n pending`; lijeva strelica onemogućena je na prvoj kartici, a desna na posljednjoj. Naziv workflowa otvara to izvršavanje na canvasu. **Approve**, **Request changes** i **Reject** rješavaju recenziju, a ikona povijesti pokraj naslova widgeta otvara to izvršavanje u dijalogu povijesti na istoj stranici. Ovaj chart type zanemaruje retke prethodnog čvora, pa je workflow widgeta samo Chart Output čvor. Svaka prijavljena osoba vidi recenzije na workflowima koje posjeduje. Odaberite **Workflow** (i **Select agent** kada ima više koraka recenzije) u svojstvima čvora ili postavkama widgeta kako bi se umjesto toga prikazale recenzije tog Workflowa svima koji ga mogu otvoriti; pogledajte [HITL widgete](../tabs/dashboard-tab.md#hitl-widgets).

### Gantt rasporedi

Odaberite **Gantt** (`gantt`) za rasporede projekata i vremenske crte zadataka. Postavite `dataPath` na array zadataka, kao što je `tasks`. Redci koriste fiksna imena polja:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` i `end` prihvaćaju ISO datume ili datetimes. Vrijednosti bez vremenske zone koriste UTC; pomaci vremenskih zona pretvaraju se u UTC. `end` mora biti na ili nakon `start`. `progress` je neobavezan (0–100, zadano 0); `dependencies` sadrži identifikatore postojećih zadataka. Identifikatori moraju biti jedinstveni. Prijeđite pokazivačem miša preko zadatka kako biste pročitali pune datume, napredak i ovisnosti. Veliki grafikoni se pomiču unutar widgeta. Prihvaća se najviše 500 zadataka.

Za ogledne podatke Set mapiranje pod nazivom `tasks` može koristiti `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Spojite ga na Chart Output s `chartType: "gantt"` i `dataPath: "tasks"`. Mapirajte izvorne stupce u ova fiksna imena pomoću Set čvora; `labelField` i `valueField` se ne koriste.

### Entity relationships (DB)

Odaberite **Entity relationships (DB)** (`erDiagram`) za sheme baza podataka i veze entiteta. Postavite `dataPath` na **objekt** grafa, kao što je `graph`, koji sadrži oba arraya:

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

Polja imaju `name`, neobavezni `type` i neobavezni `key` (`PK`, `FK`, `PK/FK` ili prazno). Relacije referenciraju postojeće identifikatore entiteta; neobavezni `sourceField` i `targetField` sidre vezu na imenovana polja. `cardinality` prihvaća `one-to-one`, `one-to-many` (zadano), `many-to-one` ili `many-to-many`. Identifikatori entiteta i imena polja unutar svakog entiteta moraju biti jedinstveni. Prihvaća se najviše 100 entiteta, 100 polja po entitetu i 500 relacija.

Pomoću Set čvora konstruirajte `graph` s `$dict(entities=array(dict(...)), relations=array(dict(...)))`; koristite `chartType: "erDiagram"` i `dataPath: "graph"`. Ovo je vizualizacija sheme koju navedete; ne pregledava automatski aktivnu bazu podataka.

Oba tipa pojavljuju se u **Dodaj widget** s pregledom i u biraču tipa grafikona čvora na canvasu. Heym Work može predložiti ove tipove kada opisujete raspored ili shemu baze podataka, iscrtavajući preglede predloženih zadataka ili entiteta prije izrade stranice.

### Interaktivni popisi zadataka

Koristite GitHub-flavored markdown sintaksu popisa zadataka u statičnom polju `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Na [Dashboardu](../tabs/dashboard-tab.md) potvrdni okviri renderiraju se kao klikabilne kontrole (prikladne za tamni i svijetli način rada). Promjena potvrdnog okvira ažurira polje `text` workflowa widgeta i ostaje spremljena nakon osvježavanja.

**Inline uređivanje:** dvaput kliknite oznaku stavke zadatka za uređivanje na mjestu. Pritisnite Enter ili kliknite izvan za spremanje; pritisnite Escape za odustajanje. Potpuno obrišite oznaku kako biste uklonili tu stavku s popisa.

**Poveznice u stavkama zadataka:** kada oznaka sadrži markdown poveznicu (`[title](url)`), klik na poveznicu otvara URL bez promjene potvrdnog okvira. Kliknite bilo gdje drugdje u retku za promjenu.

**Samo statični tekst:** interaktivnost zahtijeva GFM sintaksu popisa zadataka (`- [ ]` / `- [x]`). Obične dinamičke statusne poruke bez stavki zadataka ostaju samo za čitanje. Kada markdown dolazi iz `valueField`, prva promjena kopira ga u statično polje `text` kako bi promjene ostale spremljene.
### Numerirani popisi

Tekstualni widgeti renderiraju markdown s **eksplicitno zadržanim brojevima redaka**. Svaki redak započnite brojem koji želite prikazati (npr. `9.`, `8.`, `7.`). Heym ne numerira retke umjesto Vas.

**Zašto eksplicitni brojevi?** Standardni markdown numerirani popisi (`1.`, `2.`, `3.`) postaju HTML `<ol>` popisi, koji broje **samo prema gore** od prvog broja. Popis napisan kao `9.` / `8.` / `7.` prikazao bi se kao `9`, `10`, `11` u uobičajenom markdown rendereru. Ako svaki redak započnete željenim brojem, to se izbjegava.

**Silazni popisi (npr. najnovije prvo):** izgradite markdown u petlji workflowa i izračunajte broj za prikaz po stavci:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Uobičajeni obrazac:

1. Dohvatite ili izgradite polje stavki (npr. HTTP → `body.videos`).
2. [Loop](./loop-node.md) kroz polje; unutar tijela upotrijebite [Variable](./variable-node.md) s `.add()` za dodavanje jednog numeriranog retka po iteraciji.
3. Nakon **done** grane petlje, [Set](./set-node.md) `join("\n")` na akumuliranom polju (ili ekvivalentu) u jedan markdown string.
4. Usmjerite **Chart Output** `valueField` na taj string (ili postavite statični `text`).

Primjer izraza retka unutar petlje (oznaka `processVideos`, stavke s `title` i `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Rezultirajući markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Za jednostavan uzlazni popis koji započinje od 1, ili započnite svaki redak brojem (`1.`, `2.`, `3.`) ili upotrijebite petlju s `$loop.index + 1`. Upotrijebite [bullet lists](#interactive-task-lists) (`- item`) kada Vam brojevi nisu potrebni.

## Statusne oznake

Tablica (`table`) može prikazati jedan stupac kao obojene oznake (chips). Postavite **Status column** u svojstvima čvora (ili `statusColumn` u DSL-u) na naziv stupca. Svaka vrijednost dobiva jedan od pet tonova, a uobičajene riječi dobivaju ga automatski bez konfiguracije:

| Ton | Zadane riječi |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | sve ostalo |

Podudaranje zanemaruje velika i mala slova, `_` i `-`, pa su `IN_PROGRESS` i `in-progress` oboje `waiting`. Dodajte **Status tones** za ostale vrijednosti; unos nadjačava zadanu vrijednost za taj status:

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

Poslužitelj pretvara svaku vrijednost u njezin ton, tako da Heym i Heym Work prikazuju iste boje.

## Stranice s pojedinostima: `$page.record`

Nadzorna ploča otvorena s `?record=<value>` pokreće svaki Workflow widgeta s tom vrijednošću kao `$page.record`. Poveznica retka tablice otvara takvu stranicu; pogledajte [Stranice s pojedinostima](../tabs/dashboard-tab.md#detail-pages). Na nadzornoj ploči otvorenoj bez zapisa i u dijaloškom okviru izraza, `$page.record` je `null`. Čvor s oznakom `page` ima prednost nad njim.

Upotrijebite ga za dohvaćanje točno onog zapisa na koji se stranica odnosi, primjerice u čvoru [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` je sama vrijednost kliknutog retka, primjerice `V-1002`, a ne objekt s poljima. Da biste pronašli taj zapis u čvoru [DataTable](./datatable-node.md), filtrirajte njegov stupac zapisa prema vrijednosti: operacija `find` s filtrom `{"vendor_id": "$page.record"}`. Putanja poput `$page.record.id` ne rješava se ni u što, pa widget koji AI izgradi ili prilagodi odbacuje ta polja i umjesto toga čita `$page.record`.

Vrijednost dolazi iz URL-a koji svatko može urediti. Nadzorna ploča prihvaća samo vrijednosti u svom formatu zapisa (prema zadanim postavkama slova, znamenke, `-`, `_` i `.`), ali je svejedno tretirajte kao nepouzdan unos: proslijedite je ondje gdje čvor escapira vrijednosti, kao što je HTTP query parametar ili vrijednost filtra u [DataTable](./datatable-node.md) ili ClickHouseu, i nikada nemojte graditi tekst upita spajanjem stringova s njom. Widgeti se i dalje izvršavaju kao vlasnik nadzorne ploče, bez obzira na to tko otvori stranicu.

## Kako se podaci razrješavaju

1. Ako je `dataPath` postavljen, čvor slijedi tu točkastu putanju u izlaz uzvodnog čvora.
2. U suprotnom traži polje: popis na najvišoj razini, polje `data` ili prvo polje s vrijednošću popisa.
3. Retci izravno iz čvora [Data Table](./datatable-node.md) (`{id, data, created_at}`) čitaju se sa svojim stupcima na najvišoj razini pokraj `id`, tako da `labelField`, `valueField` i `columns` imenuju vlastite stupce tablice.
4. Za `table`, svaki redak postaje redak tablice koristeći `columns` (ili ključeve prvog retka). Uz `statusColumn`, Payload također nosi ton svake vrijednosti u tom stupcu.
5. Za `numeric` i `gauge`, vrijednost dolazi iz `valueField` na prvom retku (ili prvog numeričkog polja).
6. Za `scatter`, svaki redak postaje točka `[xField, yField]`.
7. Za `text`, poruka se preuzima iz `valueField` na prvom retku kada je postavljen, inače iz statične konfiguracije `text` (u suprotnom iz prvog string polja prvog retka).

## Primjer

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

Gauge (pojedinačna vrijednost prema rasponu):

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

Scatter (X/Y točke):

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

Proportion (jedna traka podijeljena po udjelu + legenda s postocima):

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

Area (ispunjeni trend s više serija):

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

Bar gauge (gradijentni gauge po retku s vrijednostima):

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

Text (statična markdown poruka — nisu potrebni uzvodni retci):

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

Text (dinamički — string poruke nastaje uzvodno i dohvaća se putem `valueField`):

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
## Primjeri AI promptova

Prilikom generiranja widgeta pomoću **AI**, promptovi poput ovih jasno se mapiraju na svaki tip:

- **Bar** — "Prikaži mjesečni prihod za posljednjih 6 mjeseci kao vertikalni stupčasti grafikon s primjerom podataka."
- **Line** — "Prikaži dnevne aktivne korisnike tijekom posljednjih 14 dana kao linijski grafikon."
- **Area** — "Prikaži potrošnju memorije i CPU-a tijekom posljednja 24 sata kao površinski grafikon s dvije serije. Koristi primjer podataka."
- **Pie** — "Razloži status izvršavanja (uspjeh, greška, otkazano) kao kružni grafikon."
- **Table** — "Prikaži top 10 workflowa prema broju izvršavanja kao tablicu s pomicanjem sa stupcima naziva i pokretanja. Koristi primjer podataka."
- **Numeric** — "Prikaži današnja ukupna izvršavanja workflowa kao jedan KPI s jedinicom 'runs'. Koristi primjer podataka."
- **Gauge** — "Prikaži trenutnu potrošnju CPU-a kao mjerač od 0 do 100 posto."
- **Scatter** — "Prikaži latenciju zahtjeva u odnosu na veličinu payloada kao dijagram raspršenosti s primjerom podataka."
- **Proportion** — "Prikaži moje najkorištenije jezike kao traku proporcija: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Koristi primjer podataka."
- **Bar gauge** — "Prikaži slobodan prostor na disku po volumenu (sda1 do sda7) kao trakasti mjerač u GB. Koristi primjer podataka."
- **Text** — "Dodaj tekstualni widget s markdown kontrolnim popisom (jedna označena stavka, dvije neoznačene) ili prikaži 5 najnovijih tutorial videa u silaznom redoslijedu (5. do 1.) s YouTube poveznicama — svaki redak započni eksplicitnim brojem (`5. Title`, `4. Title`, …)."

## Povezano

- [Kartica nadzorne ploče](../tabs/dashboard-tab.md) — izradite i rasporedite widgete
- [Izlazni čvor](output-node.md) — završni čvor za redovne workflowe


## Gumbi poveznica

`table` može pretvoriti jedan stupac u gumbe koji otvaraju poveznicu. Postavite **Link column** u svojstvima čvora (ili `linkColumn` u DSL-u) na stupac čije ćelije sadrže URL te po želji **Link button text** (`linkLabel`). Svaka ćelija postaje gumb koji svoj URL otvara u novoj kartici. Bez teksta gumba, gumb prikazuje samo ikonu poveznice:

| Vrijednost ćelije | Otvara |
| ----------------- | ------ |
| `https://jira.example.com/browse/T-1` | Drugo web-mjesto, u novoj kartici |
| `/dashboards` | Stranicu unutar Heyma, u novoj kartici |

Gumbima postaju samo adrese `http://` i `https://` te putanje koje počinju jednom kosom crtom `/`. Svaka druga vrijednost, poput `javascript:` ili `//host`, ostaje običan tekst, a prazna ćelija ne prikazuje ništa.

Gumb radi uz [poveznicu retka](../tabs/dashboard-tab.md#detail-pages): klik na gumb otvara njegovu poveznicu u novoj kartici, a klik bilo gdje drugdje u retku i dalje otvara stranicu s detaljima.
