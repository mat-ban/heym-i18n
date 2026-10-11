# Chart Output

**Chart Output** čvor je završni čvor workflowa [dashboard widgeta](../tabs/dashboard-tab.md). Preuzima retke koje su proizveli prethodni čvorovi i pretvara ih u standardizirani chart payload koji dashboard renderira.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 0 (završni) |
| Izlaz | Standardizirani chart payload |

Postavite ovaj čvor **posljednji** u workflowu dashboard widgeta. Čvor prije njega trebao bi proizvesti array objekata redaka, na primjer:

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
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` ili `hitl` |
| `orientation` | string | `vertical` ili `horizontal` (samo za bar chartove) |
| `dataPath` | string | Dot putanja do arraya redaka unutar izlaza prethodnog čvora (npr. `data` ili `result.items`). Ostavite prazno za automatsko prepoznavanje. |
| `labelField` | string | Ključ retka koji se koristi kao oznaka kategorije (pie/bar/line) |
| `valueField` | string | Ključ retka koji se koristi kao numerička vrijednost (pie/bar/line/numeric/gauge) |
| `series` | array | Neobavezna definicija više serija `[{ "name": "Sent", "field": "sent" }]` za bar/line (nadjačava `valueField`) |
| `columns` | array | Neobavezan popis stupaca za `table` (zadano su ključevi prvog retka) |
| `xField` / `yField` | string | Ključevi redaka za X i Y numeričke osi (scatter) |
| `min` / `max` | number | Numerički raspon za `gauge` (zadano `0` / `100`) |
| `unit` | string | Neobavezna jedinica prikazana uz `numeric` ili `gauge` vrijednost |
| `text` | string | Markdown poruka za `text` chart type. Ostavite prazno i postavite `valueField` za renderiranje dinamičke poruke preuzete iz podataka prethodnog čvora. |
| `title` | string | Neobavezan naslov charta |

## Chart types

- **bar / line / area / pie** — kategorijski chartovi vođeni poljima `labelField` + `valueField` (ili `series` za višeserijske bar/line/area). `area` je ispunjeni trend chart.
- **table** — sirovi retci renderirani kao tablica s pomicanjem pomoću `columns`.
- **numeric** — jedna KPI vrijednost iz prvog retka, s neobaveznom `unit`.
- **gauge** — jedna vrijednost prikazana u rasponu `min`–`max` (npr. postotak). Koristi `valueField`.
- **scatter** — X/Y točke iz `xField` i `yField` za prikaze korelacije.
- **proportion** — jedna horizontalna traka podijeljena na udjele s postotnom legendom (npr. raspodjela jezika). Koristi `labelField` + `valueField`.
- **barGauge** — jedan horizontalni gauge po retku s gradijentom crveno→zeleno i vrijednošću (npr. slobodan prostor na disku). Koristi `labelField` + `valueField`, neobavezne `unit` i `max` (zadano je najveća vrijednost retka).
- **text** — markdown poruka (npr. statusna napomena poput "Last execution at 19:47"). Stavite markdown u `text` za statičnu poruku ili ostavite `text` prazno i postavite `valueField` za renderiranje stringa proizvedenog na prethodnom čvoru. Podržava naslove, podebljano/kurziv, [popise](../nodes/chart-output-node.md#interactive-task-lists), poveznice i inline kod.
- **hitl** — carousel vaših recenzija koje čekaju ljudsku obradu. Zaglavlje prikazuje `1/n pending`; lijeva strelica onemogućena je na prvoj kartici, a desna na posljednjoj. Naziv workflowa otvara to izvršavanje na canvasu. **Approve**, **Request changes** i **Reject** rješavaju recenziju, a ikona povijesti pokraj naslova widgeta otvara to izvršavanje u dijalogu povijesti na istoj stranici. Ovaj chart type zanemaruje retke prethodnog čvora, pa je workflow widgeta samo Chart Output čvor. Svaka prijavljena osoba vidi recenzije na workflowima koje posjeduje.

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

## Kako se podaci razrješavaju

1. Ako je `dataPath` postavljen, čvor slijedi tu točkastu putanju u izlaz uzvodnog čvora.
2. U suprotnom traži polje: popis na najvišoj razini, polje `data` ili prvo polje s vrijednošću popisa.
3. Za `table`, svaki redak postaje redak tablice koristeći `columns` (ili ključeve prvog retka).
4. Za `numeric` i `gauge`, vrijednost dolazi iz `valueField` na prvom retku (ili prvog numeričkog polja).
5. Za `scatter`, svaki redak postaje točka `[xField, yField]`.
6. Za `text`, poruka se preuzima iz `valueField` na prvom retku kada je postavljen, inače iz statične konfiguracije `text` (u suprotnom iz prvog string polja prvog retka).

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
