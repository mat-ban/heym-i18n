# ClickHouse

**ClickHouse**-solmu suorittaa CRUD-operaatioita, laskentaa ja raakaa SQL-kyselyitä ulkoiseen [ClickHouse](https://clickhouse.com/)-tietokantaan sen HTTP-rajapinnan kautta. Käytä sitä tapahtumien kirjoittamiseen ClickHouse-tauluun workflowsta, analytiikkadatan lukemiseen tai aggregointiin tai mielivaltaisten SQL-komentojen suorittamiseen ilman manuaalisia HTTP-pyyntöjä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | ClickHouse |
| Tulos | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `clickhouseOperation` | merkkijono | Operaatio: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` tai `upsert` |
| `clickhouseTable` | lauseke | Yksinkertainen taulun nimi. Vaaditaan kaikille operaatioille paitsi `query`. |
| `clickhouseQuery` | lauseke | Raaka SQL `query`-operaatiota varten. `SELECT`/`SHOW`/`DESCRIBE` palauttavat rivejä; muut lauseet suoritetaan komennoina. |
| `clickhouseFilter` | lauseke | JSON-objekti yhtäsuuruussuodattimista, esim. `{"status":"active"}`. Käytetään operaatioissa `find`, `count`, `update` ja `remove`. Arvot parametrisoidaan. |
| `clickhouseLimit` | merkkijono | Enimmäismäärä rivejä operaatioissa `find` / `getAll` (`0` = rajoittamaton, ei LIMIT-lausetta). Oletus `100`. |
| `clickhouseSort` | lauseke | Valinnainen `sarake` tai `sarake ASC\|DESC` operaatiossa `find` |
| `clickhouseRowId` | lauseke | Arvo, jota verrataan taulun `id`-sarakkeeseen operaatiossa `getById` |
| `clickhouseInputMode` | merkkijono | Operaatioissa `insert`/`upsert`: `raw` JSON-taulukkotila tai `selective` avain/arvo-kenttätila |
| `clickhouseData` | lauseke | JSON-taulukko riviolioista operaatioissa `insert`/`upsert` tai JSON-objekti sarakearvoista operaatiossa `update` |
| `clickhouseMappings` | taulukko | `{key, value}`-parit, joita käytetään kun `clickhouseInputMode` on `selective` |

## Tunnistetietojen määrittäminen

Luo **ClickHouse**-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdellä seuraavilla tiedoilla:

1. **Isäntä** — HTTP-isäntä ilman alustaa, esim. `your-instance.clickhouse.cloud`
2. **Portti** — HTTP-rajapinnan portti (`8443` HTTPS:lle, `8123` HTTP:lle)
3. **Käyttäjätunnus** / **Salasana** — oletuksena `default` tyhjällä salasanalla
4. **Tietokanta** — oletuksena `default`
5. **Suojattu** — käytä HTTPS-yhteyttä varten (ClickHouse Cloud)

Solmu muodostaa yhteyden virallisen `clickhouse-connect` HTTP-asiakkaan kautta. Käytä **Testaa yhteys** -toimintoa tunnistetietojen valintaikkunassa varmistaaksesi yhteyden toimivuuden ennen tallennusta.

## Operaatiot

| Operaatio | Vaaditut kentät | Kuvaus |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Suorita raaka SQL. `SELECT` palauttaa `{rows, count}`; muut lauseet palauttavat `{result}`. |
| `find` | `clickhouseTable` | Lue rivejä valinnaisten yhtäsuuruussuodattimien, lajittelun ja rajoituksen kanssa |
| `getAll` | `clickhouseTable` | Lue rivejä rajoituksen mukaan ilman suodatinta |
| `count` | `clickhouseTable` | Laske rivien määrä, mahdollisesti suodatettuna |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lue yksittäinen rivi sen `id`-sarakkeen perusteella |
| `insert` | `clickhouseTable`, `clickhouseData` tai mappings | Lisää yksi tai useampi rivi |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Päivitä vastaavat rivit komennolla `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Poista vastaavat rivit komennolla `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` tai mappings | Lisää rivit (olettaa `ReplacingMergeTree`-taulun) |

## Suodatinsyntaksi

`clickhouseFilter` on tasainen JSON-objekti sarakkeiden yhtäsuuruustarkistuksista. Arvot lähetetään sidottuina kyselyparametreina, joten ne ovat turvallisia injektioita vastaan.

```json
{ "status": "active", "tenant_id": 42 }
```

Tämä kääntyy muotoon `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Suodatinrakentaja tukee vain yhtäsuuruutta - alueille, liitoksille tai aggregaateille käytä `query`-operaatiota raa'an SQL:n kanssa.

## Syöttötavat (insert / upsert)

- **JSON-taulukko** (`raw`): anna JSON-taulukko riviolioista `clickhouseData`:ssa. Avaimet, jotka puuttuvat tietyltä riviltä, lisätään `NULL`:ina. Sarakejoukko on kaikkien rivien avainten yhdistelmä.
- **Avain-arvo** (`selective`): kun tunnistetiedot ja taulu on valittu, editori tunnistaa taulun sarakkeet ja luo yhden arvokentän per sarake. Yksi rivi lisätään per suoritus; jokainen arvo tukee lausekkeita.

## Muutokset ja ClickHouse-semantiikka

ClickHouse on OLAP-tietokanta, joten rivikohtaisten kirjoitusten toiminta eroaa OLTP-varastosta:

- **`update`** suorittaa `ALTER TABLE … UPDATE` ja **`remove`** suorittaa `DELETE FROM`. Molemmat ovat **asynkronisia mutaatioita** - ne sovelletaan lopulta ja ovat suhteellisen kalliita. Suosii eräkirjoituksia useiden yksittäisten rivien muutosten sijaan.
- **`upsert`** suorittaa `INSERT`. Saadakseen yhdistämistoiminnan avaimen perusteella, taulu tulee perustaa `ReplacingMergeTree`-moottorille.
- **`getById`** olettaa, että taulussa on `id`-sarake.
- `update` ja `remove` vaativat ei-tyhjän `clickhouseFilter`:in välttääkseen koko taulun muutoksia.

## Tulosteviite

| Tulostekenttä | Tyyppi | Kuvaus |
|-------------|------|-------------|
| `.rows` | taulukko | Palautetut rivioliot (`query` SELECT, `find`, `getAll`) |
| `.count` | numero | Rivien määrä (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | objekti | Yksittäinen rivi tai `null` (`getById`) |
| `.result` | merkkijono | Komennon yhteenveto ei-SELECT `query`-operaatioissa |
| `.success` | boolean | Onnistuiko operaatio |
## Esimerkki – Lisää Tapahtuma

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Esimerkki – Laske Aktiiviset Käyttäjät

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Tuloksen käyttö: `$activeCount.count`.

## Esimerkki – Päivittäinen Raporttikysely

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Tuloksen käyttö: `$dailyReport.rows`, `$dailyReport.count`.

## Aiheeseen Liittyvää

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ClickHouse-tunnistetiedot
- [Kolmannen Osapuolen Integraatiot](../reference/integrations.md) – Integraatiotunnistetietojen asennus
