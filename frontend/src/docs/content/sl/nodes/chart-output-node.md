# Izhod Grafikon

Vozlišče **Izhod Grafikon** je terminalno vozlišče [widgeta nadzorne plošče](../tabs/dashboard-tab.md) workflow-a. Prevzame vrstice, ki jih proizvedejo zgornja vozlišča, in jih pretvori v standardiziran grafični payload, ki ga nadzorna plošča prikaže.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 0 (terminal) |
| Izhod | Standardiziran grafični payload |

To vozlišče postavite **na konec** workflow-a widgeta nadzorne plošče. Vozlišče pred njim mora proizvesti tabelo objektov vrstic, na primer:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Ko imate samo primer/sample podatke (brez pravega vira), proizvedite te vrstice z **Set** vozliščem z uporabo `$array(dict(...), dict(...))` — na primer `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Ne uporabljajte `${...}` ali golih `{...}` objektnih literali; Heym gradi objekte samo z `dict(key=value)`.

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `chartType` | niz | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, ali `hitl` |
| `orientation` | niz | `vertical` ali `horizontal` (samo za stolpčne grafikone) |
| `dataPath` | niz | Dot pot do tabele vrstic znotraj zgornjega izhoda (npr. `data` ali `result.items`). Pustite prazno za samodejno zaznavanje. |
| `labelField` | niz | Ključ vrstice, ki se uporablja kot oznaka kategorije (pie/bar/line) |
| `valueField` | niz | Ključ vrstice, ki se uporablja kot numerična vrednost (pie/bar/line/numeric/gauge) |
| `series` | tabela | Neobvezna definicija več serij `[{ "name": "Sent", "field": "sent" }]` za bar/line (prepisuje `valueField`) |
| `columns` | tabela | Neobvezna seznam stolpcev za `table` (privzeto na ključe prve vrstice) |
| `statusColumn` | string | Izbirni stolpec `table`, prikazan kot barvne [oznake stanja](#status-chips). Biti mora eden izmed prikazanih stolpcev. |
| `statusTones` | object | Izbirna preslikava vrednosti stanja v odtenek (`success`, `attention`, `failure`, `waiting`, `neutral`) za vrednosti, ki jih privzete nastavitve ne pokrivajo |
| `xField` / `yField` | niz | Ključi vrstice za X in Y numerične osi (scatter) |
| `min` / `max` | število | Numerični razpon za `gauge` (privzeto `0` / `100`) |
| `unit` | niz | Neobvezna enota, prikazana poleg `numeric` ali `gauge` vrednosti |
| `text` | niz | Markdown sporočilo za tip grafikona `text`. Pustite prazno in nastavite `valueField`, da prikažete dinamično sporočilo, pridobljeno iz zgornjih podatkov. |
| `title` | niz | Neobvezni naslov grafikona |

## Tipi grafikona

- **bar / line / area / pie** — kategorni grafikoni, ki jih poganjata `labelField` + `valueField` (ali `series` za več serij bar/line/area). `area` je zapolnjen trendni grafikon.
- **table** — surove vrstice, prikazane kot pomična tabela z uporabo `columns`. En stolpec se lahko prikaže kot [oznake stanja](#status-chips), vrstice pa lahko odprejo [stran s podrobnostmi](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — ena KPI vrednost iz prve vrstice, z neobvezno `unit`.
- **gauge** — ena vrednost, prikazana v razponu `min`–`max` (npr. odstotek). Uporablja `valueField`.
- **scatter** — X/Y točke iz `xField` in `yField` za korelacijske diagrame.
- **proportion** — ena horizontalna vrstica razdeljena na dele z legendami odstotkov (npr. razčlenitev po jeziku). Uporablja `labelField` + `valueField`.
- **barGauge** — ena horizontalna merilna naprava na vrstico z rdeče→zelena gradientom in vrednostjo (npr. prosti prostor na disku). Uporablja `labelField` + `valueField`, neobvezno `unit` in `max` (privzeto na največjo vrednost vrstice).
- **text** — markdown sporočilo (npr. statusna opomba, kot je "Zadnje izvajanje ob 19:47"). Vstavite markdown v `text` za statično sporočilo ali pustite `text` prazno in nastavite `valueField`, da prikažete niz, ki ga proizvedejo zgornji podatki. Podpira naslove, krepko/poševno, [seznami](../nodes/chart-output-node.md#interactive-task-lists), povezave in vgrajeno kodo.
- **hitl** — karusel vaših čakajočih človeških pregledov. Glava prikazuje `1/n pending`; leva puščica je onemogočena na prvi kartici in desna puščica na zadnji. Ime workflow-a odpre to izvajanje na platnu. **Odobri**, **Zahtevaj spremembe** in **Zavrni** ga rešijo, ikona zgodovine poleg naslova widgeta pa odpre to izvajanje v pogovornem oknu zgodovine na isti strani. Ta tip grafikona ignorira zgornje vrstice, zato je workflow widgeta samo vozlišče Izhod Grafikon. Vsaka prijavljena oseba vidi preglede na workflow-ih, ki jih ima v lasti.

### Interaktivni seznami nalog

Uporabite sintakso seznama nalog v slogu GitHub-flavored markdown v statičnem polju `text`:

```markdown
- [x] Možnost 1
- [ ] Možnost 2
- [ ] Možnost 3
```

Na [Nadzorni plošči](../tabs/dashboard-tab.md) se potrditvena polja prikažejo kot klikljive kontrole (prijazne za temno in svetlo temo). Preklapljanje potrditvenega polja posodobi polje `text` workflow-a widgeta in se ohrani med osvežitvami.

**Inline urejanje:** dvokliknite na oznako naloge, da jo uredite na mestu. Pritisnite Enter ali kliknite stran, da shranite; pritisnite Escape, da prekličete. Čisto oznako popolnoma, da odstranite to postavko s seznama.

**Povezave v nalogah:** ko oznaka vsebuje markdown povezavo (`[title](url)`), klik na povezavo odpre URL brez preklapljanja potrditvenega polja. Kliknite drugje na vrstici, da preklopite.

**Samo statična besedila:** interaktivnost zahteva sintakso seznama nalog GFM (`- [ ]` / `- [x]`). Navodila za dinamična statusna sporočila brez nalog ostanejo samo za branje. Ko markdown prihaja iz `valueField`, prvi preklop kopira v statično polje `text`, tako da spremembe ostanejo.
### Oštevilčeni seznami

Besedilni pripomočki upodabljajo markdown z **ohranjenimi eksplicitnimi številkami vrstic**. Vsako vrstico predhodno označite s številko, ki jo želite prikazati (npr. `9.`, `8.`, `7.`). Heym ne prešteva vrstic namesto vas.

**Zakaj eksplicitne številke?** Standardni markdown oštevilčeni seznami (`1.`, `2.`, `3.`) postanejo HTML `<ol>` seznami, ki štejejo **samo navzgor** od prve številke. Seznam, napisan kot `9.` / `8.` / `7.`, bi se v običajnem markdown upodabljal kot `9`, `10`, `11`. Predhodno označevanje vsake vrstice z želeno številko to preprečuje.

**Padajoči seznami (npr. najnovejši najprej):** zgradite markdown v zanki workflow in izračunajte prikazano številko za vsak element:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tipičen vzorec:

1. Pridobite ali zgradite tabelo elementov (npr. HTTP → `body.videos`).
2. [Zanka](./loop-node.md) nad tabelo; znotraj telesa uporabite [Spremenljivko](./variable-node.md) z `.add()`, da dodate eno oštevilčeno vrstico na iteracijo.
3. Po veji **končano** zanke, [Nastavite](./set-node.md) `join("\n")` na nabrano tabelo (ali ekvivalent) v en sam markdown niz.
4. Usmerite **Izhod grafikona** `valueField` na ta niz (ali nastavite statični `text`).

Primer izraza vrstice znotraj zanke (oznaka `processVideos`, elementi z `title` in `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Rezultantni markdown:

```markdown
9. [Zadnji video](https://www.youtube.com/watch?v=abc)
8. [Prejšnji video](https://www.youtube.com/watch?v=def)
1. [Najstarejši video](https://www.youtube.com/watch?v=xyz)
```

Za preprost naraščajoči seznam, ki se začne pri 1, bodisi predhodno označite vsako vrstico (`1.`, `2.`, `3.`) ali uporabite zanko z `$loop.index + 1`. Uporabite [bullet seznami](#interactive-task-lists) (`- element`), kadar ne potrebujete številk.

## Oznake stanja

Tabela (`table`) lahko prikaže en stolpec kot barvne oznake (chips). Nastavite **Status column** v lastnostih vozlišča (ali `statusColumn` v DSL) na ime stolpca. Vsaka vrednost dobi enega od petih odtenkov, pogoste besede pa ga dobijo samodejno brez nastavitve:

| Odtenek | Privzete besede |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | karkoli drugega |

Ujemanje ne upošteva velikosti črk, `_` in `-`, zato sta `IN_PROGRESS` in `in-progress` oba `waiting`. Dodajte **Status tones** za druge vrednosti; vnos prepiše privzeto nastavitev za to vrednost:

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

Strežnik razreši vsako vrednost v njen odtenek, tako da Heym in Heym Work prikazujeta enake barve.

## Strani s podrobnostmi: `$page.record`

Nadzorna plošča, odprta z `?record=<value>`, zažene vsak Workflow gradnika s to vrednostjo kot `$page.record`. Povezava v vrstici tabele odpre takšno stran; glejte [Strani s podrobnostmi](../tabs/dashboard-tab.md#detail-pages). Na nadzorni plošči, odprti brez zapisa, in v pogovornem oknu izrazov je `$page.record` enako `null`. Vozlišče z oznako `page` ima prednost pred njim.

Uporabite ga za pridobitev tistega zapisa, na katerega se stran nanaša, na primer v vozlišču [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` je sama vrednost kliknjene vrstice, na primer `V-1002`, in ne objekt s polji. Če želite najti ta zapis v [DataTable](./datatable-node.md), filtrirajte njen stolpec zapisa po vrednosti: operacija `find` s filtrom `{"vendor_id": "$page.record"}`. Pot, kot je `$page.record.id`, se ne razreši v nič, zato gradnik, ki ga zgradi ali prilagodi AI, ta polja opusti in namesto tega prebere `$page.record`.

Vrednost prihaja iz URL-ja, ki ga lahko uredi vsakdo. Nadzorna plošča sprejema samo vrednosti v svojem zapisnem formatu (privzeto črke, števke, `-`, `_` in `.`), vendar jo kljub temu obravnavajte kot nezaupanja vreden vnos: posredujte jo tja, kjer vozlišče ubežno kodira vrednosti, kot je parameter poizvedbe HTTP ali vrednost filtra v [DataTable](./datatable-node.md) ali ClickHouse, in nikoli ne sestavljajte besedila poizvedbe z združevanjem nizov z njo. Gradniki se še vedno izvajajo kot lastnik nadzorne plošče, ne glede na to, kdo odpre stran.

## Kako se podatki rešujejo

1. Če je `dataPath` nastavljen, vozlišče sledi tej piko poti v zgornji izhod.
2. V nasprotnem primeru išče tabelo: seznam na vrhnji ravni, `data` tabela ali prvo polje z vrednostmi seznama.
3. Vrstice neposredno iz vozlišča [Data Table](./datatable-node.md) (`{id, data, created_at}`) se berejo s svojimi stolpci na najvišji ravni poleg `id`, tako da `labelField`, `valueField` in `columns` poimenujejo lastne stolpce tabele.
4. Za `table` vsaka vrstica postane vrstica tabele z uporabo `columns` (ali ključev prve vrstice). S `statusColumn` Payload nosi tudi odtenek vsake vrednosti v tem stolpcu.
5. Za `numeric` in `gauge` vrednost prihaja iz `valueField` na prvi vrstici (ali prvega numeričnega polja).
6. Za `scatter` vsaka vrstica postane točka `[xField, yField]`.
7. Za `text` se sporočilo vzame iz `valueField` na prvi vrstici, ko je nastavljeno, sicer iz statične konfiguracije `text` (drugače iz prvega niza prve vrstice).

## Primer

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
    "title": "Mesečni prihodki"
  }
}
```

Gauge (ena vrednost proti razponu):

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

Proporcija (ena vrstica razdeljena po deležu + legenda odstotkov):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Najbolj uporabljeni jeziki"
  }
}
```

Območje (izpolnjena večserijska trendna linija):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Pomnilnik", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Pomnilnik / CPU"
  }
}
```

Bar gauge (gradientni gauge na vrstico z vrednostmi):

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
    "title": "Prostor na disku"
  }
}
```

Text (statično markdown sporočilo — brez zgornjih vrstic):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Zadnje izvajanje** ob `19:47` — vsi pregledi so bili uspešni ✅",
    "title": "Status"
  }
}
```

Text (dinamično — niz sporočila se ustvari zgoraj in se pridobi preko `valueField`):

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
## Primeri AI pozivov

Pri generiranju pripomočka z **AI** se pozivi, kot so ti, jasno preslikajo na vsako vrsto:

- **Bar** — "Prikažite mesečne prihodke za zadnjih 6 mesecev kot vertikalni stolpični diagram z vzorčnimi podatki."
- **Line** — "Narišite dnevne aktivne uporabnike v zadnjih 14 dneh kot linijski diagram."
- **Area** — "Prikažite uporabo pomnilnika in CPU v zadnjih 24 urah kot območni diagram z dvema serijama. Uporabite vzorčne podatke."
- **Pie** — "Razdelite status izvajanja (uspeh, napaka, preklicano) kot tortni diagram."
- **Table** — "Prikažite 10 najboljših workflows po številu izvajanj kot pomični podatkovni tabeli s stolpci za ime in izvajanja. Uporabite vzorčne podatke."
- **Numeric** — "Prikažite skupno število današnjih izvajanj workflows kot enotni KPI z enoto 'izvajanja'. Uporabite vzorčne podatke."
- **Gauge** — "Prikažite trenutno uporabo CPU kot merilnik od 0 do 100 odstotkov."
- **Scatter** — "Narišite zakasnitev zahtevka v primerjavi z velikostjo payloada kot razpršen diagram z vzorčnimi podatki."
- **Proportion** — "Prikažite moje najbolj uporabljene jezike kot proporcijski stolpec: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Uporabite vzorčne podatke."
- **Bar gauge** — "Prikažite prosti prostor na disku po volumnu (sda1 do sda7) kot stolpčni merilnik v GB. Uporabite vzorčne podatke."
- **Text** — "Dodajte besedilni pripomoček z markdown seznamom opravil (ena označena postavka, dve neoznačeni), ali naštejte 5 najnovejših video tutorialov v padajočem vrstnem redu (5. do 1.) z YouTube povezavami — vsaki vrstici dodajte eksplicitno številko (`5. Naslov`, `4. Naslov`, …)."

## Sorodno

- [Zavihek nadzorne plošče](../tabs/dashboard-tab.md) — ustvarjanje in razporejanje pripomočkov
- [Izhodni vozlišče](output-node.md) — terminalno vozlišče za redne workflows
