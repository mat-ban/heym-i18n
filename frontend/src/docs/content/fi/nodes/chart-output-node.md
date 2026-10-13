# Kaaviotuloste

**Kaaviotuloste**-solmu on [dashboard-widget](../tabs/dashboard-tab.md) -workflown päätesolmu. Se muuntaa ylävirran solmujen tuottamat rivit standardoiduksi kaavioksi, jonka dashboard renderöi.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 0 (päätesolmu) |
| Tuloste | Standardoitu kaaviodata |

Sijoita tämä solmu **viimeiseksi** dashboard-widgetin workflowssa. Sen edeltävän solmun tulisi tuottaa riviobjekteja sisältävä taulukko, esimerkiksi:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Kun käytössä on vain esimerkkidataa (ei todellista lähdettä), nämä rivit voidaan tuottaa **Set**-solmulla käyttämällä `$array(dict(...), dict(...))` -syntaksia — esimerkiksi `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Älä käytä `${...}` - tai pelkkiä `{...}` -objektikirjaimellisia; Heym rakentaa objektit vain `dict(key=value)` -syntaksilla.

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `chartType` | merkkijono | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` tai `hitl` |
| `orientation` | merkkijono | `vertical` tai `horizontal` (vain pylväskaavioille) |
| `dataPath` | merkkijono | Pistepolku rivitaulukkoon ylävirran tulosteessa (esim. `data` tai `result.items`). Jätä tyhjäksi automaattista tunnistusta varten. |
| `labelField` | merkkijono | Rivin avain, jota käytetään kategorian nimikkeenä (pie/bar/line) |
| `valueField` | merkkijono | Rivin avain, jota käytetään numeerisena arvona (pie/bar/line/numeric/gauge) |
| `series` | taulukko | Valinnainen monisarjainen määrittely `[{ "name": "Sent", "field": "sent" }]` pylväs-/viivakaavioille (korvaa `valueField`) |
| `columns` | taulukko | Valinnainen sarakeluettelo `table`-tyypille (oletusarvoisesti käytetään ensimmäisen rivin avaimia) |
| `statusColumn` | string | Valinnainen `table`-sarake, joka esitetään värillisinä [tilamerkkeinä](#status-chips). Sen on oltava yksi näytettävistä sarakkeista. |
| `statusTones` | object | Valinnainen kuvaus tila-arvosta sävyyn (`success`, `attention`, `failure`, `waiting`, `neutral`) arvoille, joita oletukset eivät kata |
| `xField` / `yField` | merkkijono | Rivin avaimet X- ja Y-numeerisille akseleille (scatter) |
| `min` / `max` | numero | Numeerinen alue `gauge`-tyypille (oletus `0` / `100`) |
| `unit` | merkkijono | Valinnainen yksikkö, joka näytetään `numeric`- tai `gauge`-arvon vieressä |
| `text` | merkkijono | Markdown-viesti `text`-kaaviotyypille. Jätä tyhjäksi ja aseta `valueField` renderöitäväksi dynaamiseksi viestiksi, joka haetaan ylävirran datasta. |
| `title` | merkkijono | Valinnainen kaavion otsikko |

## Kaaviotyypit

- **bar / line / area / pie** — kategoriset kaaviot, joita ohjaavat `labelField` + `valueField` (tai `series` monisarjaisille pylväs-/viivakaavioille). `area` on täytetty trendikaavio.
- **table** — raakaa dataa esitetään skrollattavana taulukkona käyttäen `columns`-parametria. Yksi sarake voidaan esittää [tilamerkkeinä](#status-chips), ja rivit voivat avata [tietosivun](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — yksi KPI-arvo ensimmäiseltä riviltä, valinnaisella `unit`-yksiköllä.
- **gauge** — yksi arvo esitettynä `min`–`max` -alueella (esim. prosentti). Käyttää `valueField`-parametria.
- **scatter** — X/Y-pisteet `xField`- ja `yField`-kentistä korrelaatioiden visualisointiin.
- **proportion** — yksi vaakasuora palkki, joka on jaettu osuuksiin prosenttilegendin kanssa (esim. kielijakauma). Käyttää `labelField` + `valueField` -parametreja.
- **barGauge** — yksi vaakasuora mittari per rivi punaisesta→vihreään gradientilla ja arvolla (esim. vapaana oleva levytila). Käyttää `labelField` + `valueField` -parametreja, valinnaisesti `unit` ja `max` (oletusarvoisesti suurin riviarvo).
- **text** — Markdown-viesti (esim. tilanneilmoitus kuten "Viimeisin suoritus klo 19:47"). Aseta markdown `text`-kenttään staattista viestiä varten tai jätä `text` tyhjäksi ja aseta `valueField` renderöitäväksi ylävirran tuottamaksi merkkijonoksi. Tukee otsikoita, lihavoitua/kursivoitua, [listoja](../nodes/chart-output-node.md#interactive-task-lists), linkkejä ja inline-koodia.
- **hitl** — katseltavien odottavien ihmisten arvioiden karuselli. Otsikko näyttää `1/n odottaa`; vasen nuoli on pois käytöstä ensimmäisellä kortilla ja oikea nuoli viimeisellä. Workflown nimi avaa kyseisen suorituksen canvasilla. **Hyväksy**, **Pyydä muutoksia** ja **Hylkää** ratkaisevat arvioinnin, ja widgetin otsikon vieressä oleva historia-ikoni avaa kyseisen suorituksen historian dialogissa samalla sivulla. Tämä kaaviotyyppi ohittaa ylävirran rivit, joten widgetin workflow koostuu vain Chart Output -solmusta. Jokainen kirjautunut käyttäjä näkee omistamiensa workflowjen arvioinnit.

### Interaktiiviset tehtävälistat

Käytä GitHub-flavored markdown -tehtävälistojen syntaksia staattisessa `text`-kentässä:

```markdown
- [x] Vaihtoehto 1
- [ ] Vaihtoehto 2
- [ ] Vaihtoehto 3
```

[Dashboardissa](../tabs/dashboard-tab.md) valintaruudut renderöityvät klikattaviksi kontrolliksi (sopii sekä tummaan että vaaleaan tilaan). Valintaruudun vaihtaminen päivittää widgetin workflowssa olevan `text`-kentän arvon, ja muutokset säilyvät päivitysten välillä.

**Inline-muokkaus:** kaksoisnapsauta tehtävän nimikettä muokataksesi sitä paikan päällä. Paina Enter tai napsauta muualle tallentaaksesi; paina Escape peruuttaaksesi. Tyhjennä nimike kokonaan poistaaksesi kyseisen kohteen listasta.

**Linkit tehtävissä:** kun nimike sisältää markdown-linkin (`[otsikko](url)`), linkin napsauttaminen avaa URL-osoitteen ilman valintaruudun vaihtamista. Napsauta rivin muualta vaihtaaksesi valintaruutua.

**Vain staattinen teksti:** interaktiivisuus vaatii GFM-tehtävälistojen syntaksin (`- [ ]` / `- [x]`). Pelkät dynaamiset tilaviestit ilman tehtäväkohteita pysyvät vain luettavina. Kun markdown tulee `valueField`-kentästä, ensimmäinen valintaruudun vaihto kopioi sen staattiseen `text`-kenttään, jotta muutokset säilyvät.
### Numeroitujen listojen muodostaminen

Tekstiwidgetit renderöivät Markdownia **säilyttäen rivinumeroinnin**. Aloita jokainen rivi haluamallasi numerolla (esim. `9.`, `8.`, `7.`). Heym ei numeroida rivejä automaattisesti.

**Miksi eksplisiittiset numerot?** Vakiomuotoiset numeroimattomat listat (`1.`, `2.`, `3.`) muuttuvat HTML:ssä `<ol>`-listoiksi, jotka numeroidaan **nousevasti** ensimmäisestä numerosta lähtien. Lista, joka on kirjoitettu muodossa `9.` / `8.` / `7.`, näkyisi normaalissa Markdown-renderöijässä muodossa `9`, `10`, `11`. Käyttämällä jokaisella rivillä haluttua numeroa vältetään tämä ongelma.

**Laskevat listat (esim. uusin ensin):** Muodosta Markdown-loopissa ja laske näytettävä numero kullekin riville:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tyypillinen käyttötapa:

1. Hae tai muodosta taulukko kohteista (esim. HTTP → `body.videos`).
2. [Loop](./loop-node.md) taulukon yli; käytä loopin sisällä [Muuttuja](./variable-node.md)-solmua `.add()`-metodilla lisätäksesi yhden numeroitun rivin per iteraatio.
3. Loopin **valmis**-haaran jälkeen yhdistä [Aseta](./set-node.md) `join("\n")` kertyneeseen taulukkoon (tai vastaavaan) muodostaaksesi yhden Markdown-merkkijonon.
4. Ohjaa **Kaaviotulosteen** `valueField` kyseiseen merkkijonoon (tai aseta staattinen `text`).

Esimerkki rivilausekkeesta loopin sisällä (label `processVideos`, kohteet kentillä `title` ja `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Tuloksena syntyvä Markdown:

```markdown
9. [Uusin video](https://www.youtube.com/watch?v=abc)
8. [Edellinen video](https://www.youtube.com/watch?v=def)
1. [Vanhin video](https://www.youtube.com/watch?v=xyz)
```

Yksinkertaiselle nousevalle listalle, joka alkaa numerosta 1, joko aloita jokainen rivi numerolla (`1.`, `2.`, `3.`) tai käytä loopia lausekkeella `$loop.index + 1`. Käytä [pistelistoja](#interactive-task-lists) (`- kohde`), jos numerointeja ei tarvita.

## Tilamerkit

`table` voi näyttää yhden sarakkeen värillisinä merkkeinä (chips). Aseta solmun ominaisuuksissa **Status column** (tai DSL:ssä `statusColumn`) sarakkeen nimeksi. Jokainen arvo saa yhden viidestä sävystä, ja yleiset sanat saavat sävyn automaattisesti ilman määritystä:

| Sävy | Oletussanat |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | mikä tahansa muu |

Täsmäytys ohittaa kirjainkoon sekä merkit `_` ja `-`, joten `IN_PROGRESS` ja `in-progress` ovat molemmat `waiting`. Lisää **Status tones** muille arvoille; määritys ohittaa kyseisen arvon oletuksen:

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

Palvelin ratkaisee jokaisen arvon sävyn, joten Heym ja Heym Work näyttävät samat värit.

## Tietosivut: `$page.record`

Kojelauta, joka avataan parametrilla `?record=<value>`, suorittaa jokaisen widgetin Workflow'n kyseisellä arvolla muuttujassa `$page.record`. Taulukon rivilinkki avaa tällaisen sivun; katso [Tietosivut](../tabs/dashboard-tab.md#detail-pages). Ilman tietuetta avatussa kojelaudassa ja lausekeikkunassa `$page.record` on `null`. Solmu, jonka tunniste on `page`, menee sen edelle.

Käytä sitä hakeaksesi juuri sen tietueen, jota sivu koskee, esimerkiksi [HTTP](./http-node.md)-solmussa:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` on napsautetun rivin arvo sellaisenaan, kuten `V-1002`, ei kenttiä sisältävä objekti. Löytääksesi kyseisen tietueen [DataTable](./datatable-node.md)-solmusta suodata sen tietuesarake arvolla: toiminto `find` suodattimella `{"vendor_id": "$page.record"}`. Polku kuten `$page.record.id` ei ratkea mihinkään, joten tekoälyn rakentama tai hienosäätämä widget jättää tällaiset kentät pois ja lukee sen sijaan arvon `$page.record`.

Arvo tulee URL-osoitteesta, jota kuka tahansa voi muokata. Kojelauta hyväksyy vain tietuemuotonsa mukaiset arvot (oletuksena kirjaimet, numerot, `-`, `_` ja `.`), mutta käsittele sitä silti epäluotettavana syötteenä: välitä se paikkoihin, joissa solmu suojaa arvot, kuten HTTP-kyselyparametriin tai [DataTable](./datatable-node.md)- tai ClickHouse-suodatinarvoon, äläkä koskaan rakenna kyselytekstiä yhdistämällä merkkijonoja sen kanssa. Widgetit suoritetaan silti kojelaudan omistajana riippumatta siitä, kuka sivun avaa.

## Tietojen käsittely

1. Jos `dataPath` on määritetty, solmu seuraa kyseistä polkua ylävirran tulostuksessa.
2. Muussa tapauksessa se etsii taulukon: ylimmän tason listan, `data`-taulukon tai ensimmäisen listamuotoisen kentän.
3. Suoraan [Data Table](./datatable-node.md)-solmusta (`{id, data, created_at}`) tulevat rivit luetaan siten, että niiden sarakkeet ovat ylimmällä tasolla `id`-kentän rinnalla, jolloin `labelField`, `valueField` ja `columns` viittaavat suoraan taulun omiin sarakkeisiin.
4. `table`-tyypissä jokainen rivi muuttuu taulukkoriviksi käyttäen `columns`-kenttää (tai ensimmäisen rivin avaimia). `statusColumn`-asetuksen kanssa Payload sisältää myös kyseisen sarakkeen jokaisen arvon sävyn.
5. `numeric`- ja `gauge`-tyypeissä arvo haetaan `valueField`-kentästä ensimmäiseltä riviltä (tai ensimmäisestä numeerisesta kentästä).
6. `scatter`-tyypissä jokainen rivi muuttuu `[xField, yField]`-pisteeksi.
7. `text`-tyypissä viesti haetaan `valueField`-kentästä ensimmäiseltä riviltä, jos se on määritetty, muuten staattisesta `text`-asetuksesta (tai ensimmäisen rivin ensimmäisestä merkkijonokentästä).

## Esimerkkejä

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
    "title": "Kuukausittaiset tulot"
  }
}
```

Mittari (yksi arvo verrattuna alueeseen):

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

Pistekuviot (X/Y-pisteet):

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

Osuudet (yksi pylväs jaettuna osuuksilla + prosenttilegenda):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Käytetyimmät kielet"
  }
}
```

Alue (täytetty monisarjainen trendi):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Muisti", "field": "memory" },
      { "name": "Suoritin", "field": "cpu" }
    ],
    "title": "Muisti / suoritin"
  }
}
```

Pylväsmittari (gradienttimittari arvoineen per rivi):

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
    "title": "Vapaa levytila"
  }
}
```

Teksti (staattinen Markdown-viesti – ei vaadi ylävirran rivejä):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Viimeisin suoritus** kello `19:47` – kaikki tarkistukset läpäisty ✅",
    "title": "Tila"
  }
}
```

Teksti (dynaaminen – viestimerkkijono tuotetaan ylävirrassa ja haetaan `valueField`-kentän kautta):

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
## Esimerkkejä tekoälykehotuksista

Kun luot widgetin **tekoälyllä**, seuraavat kehotukset vastaavat siististi jokaista tyyppiä:

- **Pylväsdiagrammi** — "Näytä kuukausittaiset tulot viimeisiltä 6 kuukaudelta pystysuorana pylväsdiagrammina esimerkkidatalla."
- **Viivadiagrammi** — "Piirrä päivittäiset aktiiviset käyttäjät viimeiseltä 14 päivältä viivadiagrammina."
- **Aluekaavio** — "Näytä muistin ja suorittimen käyttö viimeisen 24 tunnin ajalta aluekaaviona kahdella sarjalla. Käytä esimerkkidataa."
- **Ympyräkaavio** — "Jaa suoritustilat (onnistunut, virhe, peruutettu) ympyräkaaviona."
- **Taulukko** — "Näytä 10 suosituinta workflowta suoritusmäärän mukaan skrollattavassa taulukossa, jossa on sarakkeet nimi ja suoritukset. Käytä esimerkkidataa."
- **Numeerinen** — "Näytä tämän päivän workflow-suoritukset yhtenä KPI-arvona, jonka yksikkö on 'suoritukset'. Käytä esimerkkidataa."
- **Mittari** — "Näytä nykyinen suorittimen käyttöaste mittarina 0–100 prosenttia."
- **Hajontakaavio** — "Piirrä pyyntöjen viive ja datan koko suhteessa toisiinsa hajontakaaviona esimerkkidatalla."
- **Suhteellinen pylväs** — "Näytä eniten käytetyt ohjelmointikielet suhteellisena pylväänä: Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Käytä esimerkkidataa."
- **Pylväsmittari** — "Näytä vapaana oleva levytila jokaisella volyymilla (sda1–sda7) pylväsmittarina gigatavuina. Käytä esimerkkidataa."
- **Teksti** — "Lisää tekstiwidgetti, jossa on Markdown-muotoinen tehtävälista (yksi valittu kohta, kaksi valitsematonta), tai listaa 5 uusinta opetusvideota laskevassa järjestyksessä (5. ... 1.) YouTube-linkkein — aloita jokainen rivi eksplisiittisellä numerolla (`5. Otsikko`, `4. Otsikko`, ...)."

## Aiheeseen liittyvää

- [Dashboard-välilehti](../tabs/dashboard-tab.md) — widgettien rakentaminen ja järjestely
- [Output-solmu](output-node.md) — workflown päätesolmu
