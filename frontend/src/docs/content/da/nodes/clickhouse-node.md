# ClickHouse

**ClickHouse**-noden udfører CRUD-, tælle- og rå SQL-operationer mod en ekstern [ClickHouse](https://clickhouse.com/)-database via dens HTTP-interface. Noden kan anvendes til at skrive events ind i en ClickHouse-tabel fra et workflow, læse eller aggregere analytiske data eller køre vilkårlig SQL – uden manuelt at skrive HTTP-forespørgsler.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | ClickHouse |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operation: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` eller `upsert` |
| `clickhouseTable` | udtryk | Simpelt tabelnavn. Påkrævet for alle operationer undtagen `query`. |
| `clickhouseQuery` | udtryk | Rå SQL for `query`. `SELECT`/`SHOW`/`DESCRIBE` returnerer rækker; andre statements køres som kommandoer. |
| `clickhouseFilter` | udtryk | JSON-objekt med lighedsfiltre, f.eks. `{"status":"active"}`. Anvendes af `find`, `count`, `update` og `remove`. Værdier er parameteriserede. |
| `clickhouseLimit` | string | Maksimalt antal rækker for `find` / `getAll` (`0` = ubegrænset, ingen LIMIT-klausul). Standardværdi `100`. |
| `clickhouseSort` | udtryk | Valgfri `column` eller `column ASC\|DESC` for `find` |
| `clickhouseRowId` | udtryk | Værdi, der matches mod tabellens `id`-kolonne for `getById` |
| `clickhouseInputMode` | string | For `insert`/`upsert`: `raw` JSON array-tilstand eller `selective` nøgle/værdi-felt-tilstand |
| `clickhouseData` | udtryk | JSON-array med rækkeobjekter for `insert`/`upsert`, eller JSON-objekt med kolonneværdier for `update` |
| `clickhouseMappings` | array | `{key, value}`-par, der anvendes, når `clickhouseInputMode` er `selective` |

## Opsætning af legitimationsoplysninger

Opret **ClickHouse**-legitimationsoplysninger i fanen [Legitimationsoplysninger](../tabs/credentials-tab.md) med følgende:

1. **Host** – HTTP-værten uden skema, f.eks. `your-instance.clickhouse.cloud`
2. **Port** – HTTP-interfaceporten (`8443` for HTTPS, `8123` for HTTP)
3. **Brugernavn** / **Adgangskode** – standardværdi er `default` med tom adgangskode
4. **Database** – standardværdi er `default`
5. **Sikker** – aktiver for HTTPS (ClickHouse Cloud)

Noden forbinder via den officielle `clickhouse-connect` HTTP-klient. Anvend **Test forbindelse** i legitimationsdialogboksen for at verificere tilgængelighed før gemning.

## Operationer

| Operation | Påkrævede felter | Beskrivelse |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Kør rå SQL. `SELECT` returnerer `{rows, count}`; andre statements returnerer `{result}`. |
| `find` | `clickhouseTable` | Læs rækker med valgfrie lighedsfiltre, sortering og grænse |
| `getAll` | `clickhouseTable` | Læs rækker op til grænsen uden filter |
| `count` | `clickhouseTable` | Tæl rækker, eventuelt filtreret |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Læs en enkelt række via dens `id`-kolonne |
| `insert` | `clickhouseTable`, `clickhouseData` eller mappings | Indsæt en eller flere rækker |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Opdater matchende rækker via `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Slet matchende rækker via `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` eller mappings | Indsæt rækker (forudsætter en `ReplacingMergeTree`-tabel) |

## Filtersyntaks

`clickhouseFilter` er et fladt JSON-objekt med kolonnelighedstjek. Værdier sendes som bundne forespørgselsparametre, så de er sikre mod injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Dette kompileres til `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Kun lighed understøttes i filterbyggeren – for intervaller, joins eller aggregationer skal `query`-operationen med rå SQL anvendes.

## Input-tilstande (insert / upsert)

- **JSON-array** (`raw`): angiv et JSON-array med rækkeobjekter i `clickhouseData`. Nøgler, der mangler i en given række, indsættes som `NULL`. Kolonnesættet er foreningen af nøgler på tværs af alle rækker.
- **Nøgle-værdi** (`selective`): efter valg af legitimationsoplysninger og tabel opdager editoren tabelkolonnerne og opretter ét værdifelt pr. kolonne. En række indsættes pr. kørsel; hver værdi understøtter udtryk.

## Mutationer og ClickHouse-semantik

ClickHouse er en OLAP-database, så rækkevise skrivninger opfører sig anderledes end en OLTP-database:

- **`update`** udsteder `ALTER TABLE … UPDATE` og **`remove`** udsteder `DELETE FROM`. Begge er **asynkrone mutationer** – de anvendes efterhånden og er relativt omkostningstunge. Foretræk batchede skrivninger frem for hyppige enkelt-rækkemutationer.
- **`upsert`** udfører en `INSERT`. For at opnå merge-on-key-adfærd skal tabellen understøttes af en `ReplacingMergeTree`-motor.
- **`getById`** forudsætter, at tabellen har en `id`-kolonne.
- `update` og `remove` kræver et ikke-tomt `clickhouseFilter` for at undgå fuldtabelmutationer.

## Output-reference

| Output-felt | Type | Beskrivelse |
|-------------|------|-------------|
| `.rows` | array | Returnerede rækkeobjekter (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Rækketælling (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Enkelt række eller `null` (`getById`) |
| `.result` | string | Kommandoresumé for ikke-SELECT `query` |
| `.success` | boolean | Angiver, om operationen lykkedes |
## Eksempel – Indsæt en hændelse

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

## Eksempel – Tæl aktive brugere

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

Adgang til output: `$activeCount.count`.

## Eksempel – Dagsrapportforespørgsel

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

Adgang til output: `$dailyReport.rows`, `$dailyReport.count`.

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj ClickHouse-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md) – Opsætning af integrationslegitimationsoplysninger
