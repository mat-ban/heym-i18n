# ClickHouse

**ClickHouse** mezgls veic CRUD, skaitīšanas un neapstrādātu SQL operāciju izpildi pret ārēju [ClickHouse](https://clickhouse.com/) datubāzi, izmantojot tās HTTP saskarni. Izmantojiet to, lai no workflow ierakstītu notikumus ClickHouse tabulā, lasītu vai agregētu analītikas datus vai izpildītu patvaļīgu SQL — bez nepieciešamības manuāli rakstīt HTTP pieprasījumus.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | ClickHouse |
| Izvade | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operācija: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` vai `upsert` |
| `clickhouseTable` | expression | Vienkāršs tabulas nosaukums. Nepieciešams katrai operācijai, izņemot `query`. |
| `clickhouseQuery` | expression | Neapstrādāts SQL priekš `query`. `SELECT`/`SHOW`/`DESCRIBE` atgriež rindas; citi priekšraksti tiek izpildīti kā komandas. |
| `clickhouseFilter` | expression | JSON objekts ar vienādības filtriem, piem., `{"status":"active"}`. Izmanto `find`, `count`, `update` un `remove`. Vērtības tiek parametrizētas. |
| `clickhouseLimit` | string | Maksimālais rindu skaits priekš `find` / `getAll` (`0` = neierobežots, bez LIMIT klauzulas). Noklusējums `100`. |
| `clickhouseSort` | expression | Neobligāts `column` vai `column ASC\|DESC` priekš `find` |
| `clickhouseRowId` | expression | Vērtība, kas tiek saskaņota ar tabulas `id` kolonnu priekš `getById` |
| `clickhouseInputMode` | string | Priekš `insert`/`upsert`: `raw` JSON masīva režīms vai `selective` atslēgas/vērtības lauku režīms |
| `clickhouseData` | expression | JSON masīvs ar rindas objektiem priekš `insert`/`upsert` vai JSON objekts ar kolonnu vērtībām priekš `update` |
| `clickhouseMappings` | array | `{key, value}` pāri, kas tiek izmantoti, kad `clickhouseInputMode` ir `selective` |

## Akreditācijas datu iestatīšana

Izveidojiet **ClickHouse** akreditācijas datus cilnē [Akreditācijas dati](../tabs/credentials-tab.md) ar:

1. **Host** — HTTP host bez shēmas, piemēram, `your-instance.clickhouse.cloud`
2. **Port** — HTTP saskarnes ports (`8443` priekš HTTPS, `8123` priekš HTTP)
3. **Username** / **Password** — pēc noklusējuma `default` ar tukšu paroli
4. **Database** — pēc noklusējuma `default`
5. **Secure** — iespējojiet priekš HTTPS (ClickHouse Cloud)

Mezgls izveido savienojumu, izmantojot oficiālo `clickhouse-connect` HTTP klientu. Pirms saglabāšanas izmantojiet **Test connection** akreditācijas datu dialogā, lai pārbaudītu sasniedzamību.

## Operācijas

| Operācija | Nepieciešamie lauki | Apraksts |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Izpildīt neapstrādātu SQL. `SELECT` atgriež `{rows, count}`; citi priekšraksti atgriež `{result}`. |
| `find` | `clickhouseTable` | Lasīt rindas ar neobligātiem vienādības filtriem, kārtošanu un ierobežojumu |
| `getAll` | `clickhouseTable` | Lasīt rindas līdz ierobežojumam bez filtra |
| `count` | `clickhouseTable` | Skaitīt rindas, neobligāti filtrējot |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lasīt vienu rindu pēc tās `id` kolonnas |
| `insert` | `clickhouseTable`, `clickhouseData` vai mappings | Ievietot vienu vai vairākas rindas |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Atjaunināt atbilstošās rindas, izmantojot `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Dzēst atbilstošās rindas, izmantojot `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` vai mappings | Ievietot rindas (pieņem, ka tabula ir `ReplacingMergeTree`) |

## Filtra sintakse

`clickhouseFilter` ir plakans JSON objekts ar kolonnu vienādības pārbaudēm. Vērtības tiek nosūtītas kā piesaistīti vaicājuma parametri, tāpēc tās ir drošas pret injekcijām.

```json
{ "status": "active", "tenant_id": 42 }
```

Tas tiek kompilēts uz `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Filtra veidotājā tiek atbalstīta tikai vienādība — diapazoniem, savienojumiem vai agregācijām izmantojiet `query` operāciju ar neapstrādātu SQL.

## Ievades režīmi (insert / upsert)

- **JSON masīvs** (`raw`): norādiet JSON masīvu ar rindas objektiem `clickhouseData`. Atslēgas, kas trūkst konkrētai rindai, tiek ievietotas kā `NULL`. Kolonnu kopa ir visu rindu atslēgu apvienojums.
- **Atslēga-vērtība** (`selective`): pēc akreditācijas datu un tabulas izvēles redaktors atklāj tabulas kolonnas un izveido vienu vērtības lauku katrai kolonnai. Vienā izpildē tiek ievietota viena rinda; katra vērtība atbalsta izteiksmes.

## Mutācijas un ClickHouse semantika

ClickHouse ir OLAP datubāze, tāpēc rindu līmeņa rakstīšana darbojas citādi nekā OLTP krātuvē:

- **`update`** izdod `ALTER TABLE … UPDATE` un **`remove`** izdod `DELETE FROM`. Abas ir **asinhronas mutācijas** — tās tiek piemērotas ar laiku un ir salīdzinoši dārgas. Dodiet priekšroku pakešu rakstīšanai, nevis biežām vienas rindas mutācijām.
- **`upsert`** veic `INSERT`. Lai iegūtu sapludināšanas pēc atslēgas uzvedību, tabulai jāizmanto `ReplacingMergeTree` dzinējs.
- **`getById`** pieņem, ka tabulai ir `id` kolonna.
- `update` un `remove` prasa ne tukšu `clickhouseFilter`, lai izvairītos no visas tabulas mutācijām.

## Izvades atsauce

| Izvades lauks | Tips | Apraksts |
|-------------|------|-------------|
| `.rows` | array | Atgrieztie rindas objekti (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Rindu skaits (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Viena rinda vai `null` (`getById`) |
| `.result` | string | Komandas kopsavilkums priekš `query`, kas nav SELECT |
| `.success` | boolean | Vai operācija tika veiksmīgi izpildīta |
## Piemērs – Notikuma ievietošana

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

## Piemērs – Aktīvo lietotāju skaitīšana

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

Izvesmes piekļuve: `$activeCount.count`.

## Piemērs – Dienas atskaites vaicājums

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

Izvesmes piekļuve: `$dailyReport.rows`, `$dailyReport.count`.

## Saistītais

- [Node Types](../reference/node-types.md) – Visu node tipu pārskats
- [Credentials Tab](../tabs/credentials-tab.md) – ClickHouse akreditācijas datu pievienošana
- [Third-Party Integrations](../reference/integrations.md) – Integrācijas akreditācijas datu iestatīšana
