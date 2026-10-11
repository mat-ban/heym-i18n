# ClickHouse

**ClickHouse** node täidab CRUD-, loendus- ja toor-SQL-operatsioone välise [ClickHouse](https://clickhouse.com/) andmebaasi vastu selle HTTP-liidese kaudu. Kasutage seda sündmuste kirjutamiseks ClickHouse'i tabelisse workflow'st, analüütikaandmete lugemiseks või agregeerimiseks või suvalise SQL-i käivitamiseks — ilma käsitsi HTTP-päringute kirjutamiseta.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | ClickHouse |
| Väljund | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse'i mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operatsioon: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` või `upsert` |
| `clickhouseTable` | expression | Lihtne tabeli nimi. Nõutav iga operatsiooni jaoks, välja arvatud `query`. |
| `clickhouseQuery` | expression | Toor-SQL operatsiooni `query` jaoks. `SELECT`/`SHOW`/`DESCRIBE` tagastavad read; muud laused käivitatakse käskudena. |
| `clickhouseFilter` | expression | Võrdsusfiltrite JSON-objekt, nt `{"status":"active"}`. Kasutavad `find`, `count`, `update` ja `remove`. Väärtused on parameteriseeritud. |
| `clickhouseLimit` | string | Maksimaalne ridade arv operatsioonidele `find` / `getAll` (`0` = piiramatu, ilma LIMIT-lauseta). Vaikeväärtus `100`. |
| `clickhouseSort` | expression | Valikuline `column` või `column ASC\|DESC` operatsiooni `find` jaoks |
| `clickhouseRowId` | expression | Väärtus, mida võrreldakse tabeli `id` veeruga operatsiooni `getById` jaoks |
| `clickhouseInputMode` | string | Operatsioonidele `insert`/`upsert`: `raw` JSON-massiivi režiim või `selective` võti/väärtus väljarežiim |
| `clickhouseData` | expression | Reaobjektide JSON-massiiv operatsioonidele `insert`/`upsert` või veeruväärtuste JSON-objekt operatsioonile `update` |
| `clickhouseMappings` | array | `{key, value}` paarid, mida kasutatakse, kui `clickhouseInputMode` on `selective` |

## Mandaadi seadistamine

Looge **ClickHouse**'i mandaat jaotises [Mandaatide vahekaart](../tabs/credentials-tab.md) järgmiste andmetega:

1. **Host** — HTTP-host ilma skeemita, näiteks `your-instance.clickhouse.cloud`
2. **Port** — HTTP-liidese port (`8443` HTTPS-i jaoks, `8123` HTTP jaoks)
3. **Username** / **Password** — vaikeväärtus on `default` tühja parooliga
4. **Database** — vaikeväärtus on `default`
5. **Secure** — lubage HTTPS-i jaoks (ClickHouse Cloud)

Node ühendub ametliku `clickhouse-connect` HTTP-kliendi kaudu. Kasutage mandaadi dialoogis **Test connection**, et kontrollida kättesaadavust enne salvestamist.

## Operatsioonid

| Operatsioon | Nõutavad väljad | Kirjeldus |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Käivita toor-SQL. `SELECT` tagastab `{rows, count}`; muud laused tagastavad `{result}`. |
| `find` | `clickhouseTable` | Loe ridu valikuliste võrdsusfiltrite, sorteerimise ja limiidiga |
| `getAll` | `clickhouseTable` | Loe ridu kuni limiidini ilma filtrite |
| `count` | `clickhouseTable` | Loenda ridu, valikuliselt filtreeritult |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Loe üks rida selle `id` veeru järgi |
| `insert` | `clickhouseTable`, `clickhouseData` või mappings | Sisesta üks või mitu rida |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Uuenda vastavaid ridu `ALTER TABLE ... UPDATE` kaudu |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Kustuta vastavad read `DELETE FROM` kaudu |
| `upsert` | `clickhouseTable`, `clickhouseData` või mappings | Sisesta read (eeldab `ReplacingMergeTree` tabelit) |

## Filtrite süntaks

`clickhouseFilter` on lame JSON-objekt veergude võrdsuskontrollidega. Väärtused saadetakse seotud päringuparameetritena, seega on need kaitstud süstimise vastu.

```json
{ "status": "active", "tenant_id": 42 }
```

See koostatakse kujule `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Filtrite koostajas on toetatud ainult võrdsus — vahemike, liitumiste või agregeerimiste jaoks kasutage operatsiooni `query` toor-SQL-iga.

## Sisendrežiimid (insert / upsert)

- **JSON-massiiv** (`raw`): esitage reaobjektide JSON-massiiv väljal `clickhouseData`. Puuduvad võtmed antud real sisestatakse kui `NULL`. Veergude hulk on kõigi ridade võtmete ühend.
- **Võti-väärtus** (`selective`): pärast mandaadi ja tabeli valimist avastab redaktor tabeli veerud ja loob iga veeru jaoks ühe väärtusevälja. Üks rida sisestatakse käivituse kohta; iga väärtus toetab avaldisi.

## Mutatsioonid ja ClickHouse'i semantika

ClickHouse on OLAP-andmebaas, seega reatasemel kirjutamised käituvad erinevalt OLTP-salvestusest:

- **`update`** väljastab `ALTER TABLE … UPDATE` ja **`remove`** väljastab `DELETE FROM`. Mõlemad on **asünkroonsed mutatsioonid** — need rakendatakse lõpuks ja on suhteliselt kulukad. Eelistage pakettkirjutamist sagedaste üksikute ridade mutatsioonide asemel.
- **`upsert`** teostab `INSERT`. Ühendamise-võtme-järgi käitumise saamiseks kasutage tabeli aluseks `ReplacingMergeTree` mootorit.
- **`getById`** eeldab, et tabelil on `id` veerg.
- `update` ja `remove` nõuavad mittetühja `clickhouseFilter`, et vältida kogu tabeli mutatsioone.

## Väljundi viide

| Väljundi väli | Tüüp | Kirjeldus |
|-------------|------|-------------|
| `.rows` | array | Tagastatud reaobjektid (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Ridade arv (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Üks rida või `null` (`getById`) |
| `.result` | string | Käsu kokkuvõte mitte-SELECT operatsiooni `query` jaoks |
| `.success` | boolean | Kas operatsioon õnnestus |
## Näide – Sündmuse lisamine

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

## Näide – Aktiivsete kasutajate loendamine

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

Väljundi kasutamine: `$activeCount.count`.

## Näide – Päevase aruande päring

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

Väljundi kasutamine: `$dailyReport.rows`, `$dailyReport.count`.

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Credentials Tab](../tabs/credentials-tab.md) – ClickHouse'i mandaatide lisamine
- [Third-Party Integrations](../reference/integrations.md) – Integratsiooni mandaatide seadistamine
