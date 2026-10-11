# DataTable

**DataTable**-solmu lukee, kirjoittaa ja hallinnoi tietoja Heymin DataTable-taulukoissa. Sitä voidaan käyttää CRUD-operaatioihin sisäisessä rakenteellisessa tallennustilassa ilman ulkoisia tunnistetietoja.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable [DataTable-välilehdeltä](../tabs/datatable-tab.md) |
| `dataTableOperation` | merkkijono | Operaatio: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | lauseke | Rivin UUID (getById, update, remove -operaatioille) |
| `dataTableData` | JSON-merkkijono | Sarakearvot: `{"sarakkeen_nimi": "arvo"}` |
| `dataTableFilter` | JSON-merkkijono | Suodatin (find/upsert/count). `find` ja `count` tukevat operaattoreita `{"ikä": {"$gt": 18}}`; `upsert` käyttää täsmällistä vastinetta `{"sarakkeen_nimi": "arvo"}` |
| `dataTableSort` | merkkijono | Lajittelusarake, etuliite `-` laskevaan järjestykseen |
| `dataTableLimit` | numero | Palautettavien rivien enimmäismäärä (oletus: 100) |

## Operaatiot

| Operaatio | Pakolliset kentät | Kuvaus |
|-----------|----------------|-------------|
| `find` | dataTableId | Etsii rivejä valinnaisella operaattorisuodattimella ja valinnaisella lajittelulla/rajauksella |
| `getAll` | dataTableId | Hakee kaikki rivit valinnaisella lajittelulla/rajauksella |
| `count` | dataTableId | Laskee suodatinta vastaavat rivit (laskenta tapahtuu tietokannassa; palauttaa vain numeron) |
| `getById` | dataTableId, dataTableRowId | Hakee yhden rivin UUID:n perusteella |
| `insert` | dataTableId, dataTableData | Lisää uuden rivin |
| `update` | dataTableId, dataTableRowId, dataTableData | Päivittää rivin (yhdistää tiedot) |
| `remove` | dataTableId, dataTableRowId | Poistaa rivin |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Päivittää jos vastine löytyy, muuten lisää uuden rivin |

## Esimerkki - Rivien etsiminen

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Esimerkki - Rivin lisääminen

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Esimerkki - Rivien laskeminen

Laske ehdon täyttävät rivit yhdessä solmussa, `getAll` → If/Else → Map -ketjun sijaan.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Tulos on saatavilla muodossa `$activeAdults.count`. Tyhjä tai puuttuva suodatin laskee kaikki rivit.

### Find- ja count-suodatinoperaattorit

`find`- tai `count`-suodattimessa pelkkä arvo tarkoittaa yhtäsuuruutta; objektin arvolla käytetään operaattoria:

| Operaattori | Merkitys |
|----------|---------|
| `$eq` (tai pelkkä arvo) | Yhtä suuri kuin |
| `$ne` | Ei yhtä suuri kuin |
| `$gt`, `$gte`, `$lt`, `$lte` | Suurempi/pienempi kuin vertailut (numeroarvoisille `number`-tyyppisille sarakkeille, muuten tekstivertailu) |
| `$contains` | Kirjainkoosta riippumaton osajonon täsmäys |
| `$in` | Arvo on annetussa taulukossa |

Esimerkki usean operaattorin yhdistelmästä: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Tuntemattomat operaattorit ohitetaan. `upsert`-suodattimet käyttävät edelleen täsmällisiä arvoja päivitettävän rivin löytämiseen.

Voit suodattaa myös rivien metatietojen perusteella - `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` - jotka tallennetaan todellisina sarakkeina eikä datan sisälle. Päivämäärille anna täysi arvo aluevertailuja varten (esim. `{"created_at": {"$gt": "2026-06-04"}}`) tai käytä `$contains`-operaattoria osittaiselle tekstitäsmäykselle (esim. `{"created_at": {"$contains": "2026-06-04"}}`). Jos jokin omista sarakkeistasi on nimetty samaksi kuin metatietokenttä, data-sarake saa etusijan.

## Tulosteen käyttö

- `$nodeLabel.success` - Onnistumisen totuusarvo
- `$nodeLabel.rows` - Rivitaulukko (find, getAll)
- `$nodeLabel.row` - Yksittäinen riviobjekti (getById, insert, update, upsert)
- `$nodeLabel.row.data.sarakkeen_nimi` - Tietyn sarakkeen arvon käyttö
- `$nodeLabel.count` - Rivien määrä (find/getAll -palauttamat rivit; count -operaation vastaavien rivien kokonaismäärä)
- `$nodeLabel.id` - Rivin UUID (insert, update, remove)
- `$nodeLabel.found` - Totuusarvo (getById)
- `$nodeLabel.operation` - Operaation nimi (esim. `count`; `insert`/`update` upsert -operaatiossa)

## Tunnistetietoja ei vaadita

Toisin kuin ulkoisissa integraatioissa, DataTable toimii Heymin sisäisessä tietokannassa. Workflowin omistajan käyttöoikeudet tarkistetaan automaattisesti.

## Tekoälyavustajan luoma

Kun [Tekoälyavustaja](../reference/ai-assistant.md#data-tables) tai [Keskustelu](../tabs/chat-tab.md) luo tämän solmun, se valitsee tai luo taulukon kanssasi ja kirjoittaa taulukon tarkat sarakenimet `dataTableData`- ja `dataTableFilter`-kenttiin.

## Liittyvät toiminnot

- [DataTable-välilehti](../tabs/datatable-tab.md) - Taulukoiden luonti ja hallinta
- [Grist-solmu](./grist-node.md) - Ulkoinen taulukkolaskentaintegraatio
- [Expression DSL](../reference/expression-dsl.md) - Dynaamisten arvojen lausekesyntaksi
