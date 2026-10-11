# ClickHouse

Vozlišče **ClickHouse** izvaja CRUD, štetje in surove SQL operacije proti zunanji [ClickHouse](https://clickhouse.com/) bazi podatkov preko njenega HTTP vmesnika. Uporabite ga za pisanje dogodkov v ClickHouse tabelo iz workflowa, branje ali agregacijo analitičnih podatkov ali izvajanje poljubnega SQL — brez ročnega pisanja HTTP zahtevkov.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | ClickHouse |
| Izhod | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | ClickHouse poverilnica iz [Poverilnic](../tabs/credentials-tab.md) |
| `clickhouseOperation` | niz | Operacija: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` ali `upsert` |
| `clickhouseTable` | izraz | Preprosto ime tabele. Obvezno za vsako operacijo razen `query`. |
| `clickhouseQuery` | izraz | Surov SQL za `query`. `SELECT`/`SHOW`/`DESCRIBE` vrne vrstice; druge izjave se izvajajo kot ukazi. |
| `clickhouseFilter` | izraz | JSON objekt enakostnih filtrov, npr. `{"status":"active"}`. Uporablja se pri `find`, `count`, `update` in `remove`. Vrednosti so parametizirane. |
| `clickhouseLimit` | niz | Maksimalno število vrstic za `find` / `getAll` (`0` = neomejeno, brez LIMIT klavzule). Privzeto `100`. |
| `clickhouseSort` | izraz | Neobvezno `column` ali `column ASC|DESC` za `find` |
| `clickhouseRowId` | izraz | Vrednost, ki se ujema s stolpcem `id` tabele za `getById` |
| `clickhouseInputMode` | niz | Za `insert`/`upsert`: `raw` JSON array način ali `selective` način ključ/vrednost |
| `clickhouseData` | izraz | JSON array objektov vrstic za `insert`/`upsert`, ali JSON objekt vrednosti stolpcev za `update` |
| `clickhouseMappings` | array | `{key, value}` pari, ki se uporabljajo, ko je `clickhouseInputMode` `selective` |

## Nastavitev poverilnice

Ustvarite **ClickHouse** poverilnico v [zavihku Poverilnice](../tabs/credentials-tab.md) z:

1. **Gostitelj** — HTTP gostitelj brez sheme, na primer `your-instance.clickhouse.cloud`
2. **Port** — port HTTP vmesnika (`8443` za HTTPS, `8123` za HTTP)
3. **Uporabniško ime** / **Geslo** — privzeto `default` z praznim geslom
4. **Baza podatkov** — privzeto `default`
5. **Zavarovano** — omogočite za HTTPS (ClickHouse Cloud)

Vozlišče se povezuje preko uradnega `clickhouse-connect` HTTP odjemalca. Uporabite **Preizkus povezave** v pogovornem oknu poverilnice za preverjanje dosegljivosti pred shranjevanjem.

## Operacije

| Operacija | Obvezna polja | Opis |
|-----------|----------------|------|
| `query` | `clickhouseQuery` | Izvedite surov SQL. `SELECT` vrne `{rows, count}`; druge izjave vrnejo `{result}`. |
| `find` | `clickhouseTable` | Preberite vrstice z neobveznimi filtri enakosti, razvrščanjem in omejitvijo |
| `getAll` | `clickhouseTable` | Preberite vrstice do omejitve brez filtra |
| `count` | `clickhouseTable` | Preštejte vrstice, po potrebi filtrirane |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Preberite eno vrstico po njenem stolpcu `id` |
| `insert` | `clickhouseTable`, `clickhouseData` ali mappings | Vstavite eno ali več vrstic |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Posodobite ujemajoče se vrstice preko `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Izbrišite ujemajoče se vrstice preko `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` ali mappings | Vstavite vrstice (predpostavlja tabelo `ReplacingMergeTree`) |

## Sintaksa filtra

`clickhouseFilter` je raven JSON objekt enakostnih preverjanj stolpcev. Vrednosti se pošljejo kot vezane poizvedbene parametre, zato so varne pred injekcijami.

```json
{ "status": "active", "tenant_id": 42 }
```

To se prevede v `WHERE status = {…:String} AND tenant_id = {…:Int64}`. V filtru so podprte le enakosti — za obsege, povezave ali agregacije uporabite operacijo `query` s surovim SQL.

## Načini vnosa (insert / upsert)

- **JSON array** (`raw`): zagotovite JSON array objektov vrstic v `clickhouseData`. Ključi, ki manjkajo v dani vrstici, se vstavijo kot `NULL`. Nabor stolpcev je unija ključev vseh vrstic.
- **Ključ-vrednost** (`selective`): po izbiri poverilnice in tabele, urejevalnik odkrije stolpce tabele in ustvari eno polje vrednosti za vsak stolpec. Ena vrstica se vstavi na izvedbo; vsaka vrednost podpira izraze.

## Mutacije in ClickHouse semantika

ClickHouse je OLAP baza podatkov, zato se pisanje na ravni vrstic obnaša drugače kot v OLTP skladišču:

- **`update`** izda `ALTER TABLE … UPDATE` in **`remove`** izda `DELETE FROM`. Obe sta **asinkroni mutaciji** — uporabljeni bodo sčasoma in so relativno drage. Raje uporabite serijske vnose namesto pogostih mutacij posameznih vrstic.
- **`upsert`** izvede `INSERT`. Da bi dosegli obnašanje združevanja po ključu, podprite tabelo z motorjem `ReplacingMergeTree`.
- **`getById`** predpostavlja, da tabela vsebuje stolpec `id`.
- `update` in `remove` zahtevata neprazno `clickhouseFilter`, da se izognejo mutacijam celotne tabele.

## Referenca izhoda

| Izhodno polje | Tip | Opis |
|----------------|-----|------|
| `.rows` | array | Vrniti objekti vrstic (`query` SELECT, `find`, `getAll`) |
| `.count` | število | Število vrstic (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | objekt | Ena vrstica ali `null` (`getById`) |
| `.result` | niz | Povzetek ukaza za ne-SELECT `query` |
| `.success` | boolean | Ali je operacija uspela |
## Primer – Vstavljanje dogodka

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

## Primer – Štetje aktivnih uporabnikov

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

Dostop do izhoda: `$activeCount.count`.

## Primer – Poizvedba dnevnega poročila

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

Dostop do izhoda: `$dailyReport.rows`, `$dailyReport.count`.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek poverilnic](../tabs/credentials-tab.md) – Dodajanje ClickHouse poverilnic
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev poverilnic za integracijo
