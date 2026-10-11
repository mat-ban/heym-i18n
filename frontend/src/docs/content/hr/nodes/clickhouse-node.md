# ClickHouse

Čvor **ClickHouse** izvršava CRUD, brojanje i sirove SQL operacije protiv vanjske [ClickHouse](https://clickhouse.com/) baze podataka putem svog HTTP sučelja. Koristite ga za pisanje događaja u ClickHouse tablicu iz workflow-a, čitanje ili agregiranje analitičkih podataka, ili izvođenje proizvoljnog SQL-a — bez potrebe za ručnim pisanjem HTTP zahtjeva.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | ClickHouse |
| Izlaz | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | ClickHouse vjerodajnice iz [Vjerodajnica](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operacija: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` ili `upsert` |
| `clickhouseTable` | izraz | Jednostavno ime tablice. Obavezno za svaku operaciju osim `query`. |
| `clickhouseQuery` | izraz | Sirov SQL za `query`. `SELECT`/`SHOW`/`DESCRIBE` vraćaju redove; druge izjave se izvršavaju kao naredbe. |
| `clickhouseFilter` | izraz | JSON objekt jednakosnih filtara, npr. `{"status":"active"}`. Koristi se za `find`, `count`, `update` i `remove`. Vrijednosti su parametizirane. |
| `clickhouseLimit` | string | Maksimalni redovi za `find` / `getAll` (`0` = neograničeno, bez LIMIT klauzule). Zadano `100`. |
| `clickhouseSort` | izraz | Opcionalno `column` ili `column ASC\|DESC` za `find` |
| `clickhouseRowId` | izraz | Vrijednost koja se uspoređuje s `id` kolumnom tablice za `getById` |
| `clickhouseInputMode` | string | Za `insert`/`upsert`: `raw` JSON niz ili `selective` način ključ/vrijednost |
| `clickhouseData` | izraz | JSON niz objekata redova za `insert`/`upsert`, ili JSON objekt kolumnskih vrijednosti za `update` |
| `clickhouseMappings` | niz | `{key, value}` parovi korišteni kada je `clickhouseInputMode` `selective` |

## Postavljanje Vjerodajnica

Kreirajte **ClickHouse** vjerodajnicu u [kartici Vjerodajnice](../tabs/credentials-tab.md) s:

1. **Host** — HTTP host bez sheme, na primjer `your-instance.clickhouse.cloud`
2. **Port** — port HTTP sučelja (`8443` za HTTPS, `8123` za HTTP)
3. **Korisničko ime** / **Lozinka** — zadano na `default` s praznom lozinkom
4. **Baza podataka** — zadano na `default`
5. **Sigurno** — omogućite za HTTPS (ClickHouse Cloud)

Čvor se povezuje putem službenog `clickhouse-connect` HTTP klijenta. Koristite **Testiraj vezu** u dijalogu vjerodajnica kako biste provjerili dostupnost prije spremanja.

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|----------------|------|
| `query` | `clickhouseQuery` | Izvršava sirovi SQL. `SELECT` vraća `{rows, count}`; druge izjave vraćaju `{result}`. |
| `find` | `clickhouseTable` | Čita redove s opcionalnim jednakosnim filtrima, sortiranjem i limitom |
| `getAll` | `clickhouseTable` | Čita redove do limita bez filtra |
| `count` | `clickhouseTable` | Broji redove, opcionalno filtrirane |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Čita jedan red prema njegovoj `id` kolumni |
| `insert` | `clickhouseTable`, `clickhouseData` ili mappings | Umeće jedan ili više redova |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Ažurira odgovarajuće redove putem `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Briše odgovarajuće redove putem `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` ili mappings | Umeće redove (pretpostavlja tablicu `ReplacingMergeTree`) |

## Sintaksa Filtra

`clickhouseFilter` je ravni JSON objekt provjera jednakosti kolumni. Vrijednosti se šalju kao vezane parametre upita, tako da su sigurne od injekcija.

```json
{ "status": "active", "tenant_id": 42 }
```

Ovo se prevodi u `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Samo jednakost je podržana u graditelju filtra — za raspon, spajanja ili agregacije, koristite `query` operaciju sa sirovim SQL-om.

## Načini Unosa (insert / upsert)

- **JSON niz** (`raw`): pružite JSON niz objekata redova u `clickhouseData`. Ključevi koji nedostaju iz određenog reda umetnut će se kao `NULL`. Skup kolumni je unija ključeva svih redova.
- **Ključ-vrijednost** (`selective`): nakon što odaberete vjerodajnicu i tablicu, uređivač otkriva kolumne tablice i stvara jedno polje vrijednosti po kolumni. Jedan red se umetne po izvršenju; svaka vrijednost podržava izraze.

## Mutacije i Semantika ClickHouse-a

ClickHouse je OLAP baza podataka, tako da ponašanje pisanja na razini redova razlikuje se od OLTP spremnika:

- **`update`** izdaje `ALTER TABLE … UPDATE` i **`remove`** izdaje `DELETE FROM`. Obje su **asinkrone mutacije** — primjenjuju se na kraju i relativno su skupe. Preferirajte grupne upise umjesto čestih mutacija pojedinačnih redova.
- **`upsert`** izvršava `INSERT`. Da biste dobili ponašanje spajanja po ključu, podržite tablicu s motorom `ReplacingMergeTree`.
- **`getById`** pretpostavlja da tablica ima `id` kolumnu.
- `update` i `remove` zahtijevaju ne-prazan `clickhouseFilter` kako bi se izbjegle mutacije cijele tablice.

## Referenca Izlaza

| Izlazno polje | Tip | Opis |
|----------------|-----|------|
| `.rows` | niz | Vraćeni objekti redova (`query` SELECT, `find`, `getAll`) |
| `.count` | broj | Broj redova (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | objekt | Jedan red ili `null` (`getById`) |
| `.result` | string | Sažetak naredbe za ne-SELECT `query` |
| `.success` | boolean | Je li operacija uspjela |
## Primjer – Umetanje Događaja

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

## Primjer – Brojanje Aktivnih Korisnika

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

Pristupite izlazu: `$activeCount.count`.

## Primjer – Upit za Dnevno Izvješće

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

Pristupite izlazu: `$dailyReport.rows`, `$dailyReport.count`.

## Povezano

- [Tipovi Čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Dodavanje ClickHouse vjerodajnica
- [Integracije Trećih Strana](../reference/integrations.md) – Postavljanje vjerodajnica za integraciju
