# ClickHouse

**ClickHouse**-noden kör CRUD-, count- och råa SQL-operationer mot en extern [ClickHouse](https://clickhouse.com/)-databas via dess HTTP-gränssnitt. Använd den för att skriva händelser till en ClickHouse-tabell från ett workflow, läsa eller aggregera analysdata, eller köra godtycklig SQL — utan att handskriva HTTP-förfrågningar.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | ClickHouse |
| Utdata | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operation: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` eller `upsert` |
| `clickhouseTable` | expression | Enkelt tabellnamn. Krävs för alla operationer utom `query`. |
| `clickhouseQuery` | expression | Rå SQL för `query`. `SELECT`/`SHOW`/`DESCRIBE` returnerar rader; andra satser körs som kommandon. |
| `clickhouseFilter` | expression | JSON-objekt med likhetsfilter, t.ex. `{"status":"active"}`. Används av `find`, `count`, `update` och `remove`. Värden parameteriseras. |
| `clickhouseLimit` | string | Maximalt antal rader för `find` / `getAll` (`0` = obegränsat, ingen LIMIT-sats). Standard `100`. |
| `clickhouseSort` | expression | Valfri `column` eller `column ASC\|DESC` för `find` |
| `clickhouseRowId` | expression | Värde som matchas mot tabellens `id`-kolumn för `getById` |
| `clickhouseInputMode` | string | För `insert`/`upsert`: `raw` JSON-array-läge eller `selective` nyckel/värde-fältläge |
| `clickhouseData` | expression | JSON-array med radobjekt för `insert`/`upsert`, eller JSON-objekt med kolumnvärden för `update` |
| `clickhouseMappings` | array | `{key, value}`-par som används när `clickhouseInputMode` är `selective` |

## Konfiguration av autentiseringsuppgifter

Skapa en **ClickHouse**-autentiseringsuppgift i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) med:

1. **Host** — HTTP-värden utan schema, till exempel `your-instance.clickhouse.cloud`
2. **Port** — HTTP-gränssnittets port (`8443` för HTTPS, `8123` för HTTP)
3. **Username** / **Password** — standardvärdet är `default` med tomt lösenord
4. **Database** — standardvärdet är `default`
5. **Secure** — aktivera för HTTPS (ClickHouse Cloud)

Noden ansluter via den officiella HTTP-klienten `clickhouse-connect`. Använd **Test connection** i dialogen för autentiseringsuppgifter för att verifiera åtkomsten innan den sparas.

## Operationer

| Operation | Obligatoriska fält | Beskrivning |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Kör rå SQL. `SELECT` returnerar `{rows, count}`; andra satser returnerar `{result}`. |
| `find` | `clickhouseTable` | Läs rader med valfria likhetsfilter, sortering och begränsning |
| `getAll` | `clickhouseTable` | Läs rader upp till gränsen utan filter |
| `count` | `clickhouseTable` | Räkna rader, valfritt filtrerat |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Läs en enskild rad via dess `id`-kolumn |
| `insert` | `clickhouseTable`, `clickhouseData` eller mappningar | Infoga en eller flera rader |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Uppdatera matchande rader via `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Ta bort matchande rader via `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` eller mappningar | Infoga rader (förutsätter en `ReplacingMergeTree`-tabell) |

## Filtersyntax

`clickhouseFilter` är ett platt JSON-objekt med likhetskontroller per kolumn. Värden skickas som bundna frågeparametrar, vilket gör dem säkra mot injektion.

```json
{ "status": "active", "tenant_id": 42 }
```

Detta kompileras till `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Endast likhet stöds i filterbyggaren — för intervall, joins eller aggregeringar används operationen `query` med rå SQL.

## Inmatningslägen (insert / upsert)

- **JSON-array** (`raw`): ange en JSON-array med radobjekt i `clickhouseData`. Nycklar som saknas i en given rad infogas som `NULL`. Kolumnuppsättningen är unionen av nycklar över alla rader.
- **Nyckel-värde** (`selective`): efter att en autentiseringsuppgift och tabell har valts identifierar editorn tabellens kolumner och skapar ett värdefält per kolumn. En rad infogas per körning; varje värde stöder uttryck.

## Mutationer och ClickHouse-semantik

ClickHouse är en OLAP-databas, så skrivningar på radnivå beter sig annorlunda än i ett OLTP-lager:

- **`update`** utfärdar `ALTER TABLE … UPDATE` och **`remove`** utfärdar `DELETE FROM`. Båda är **asynkrona mutationer** — de tillämpas så småningom och är förhållandevis kostsamma. Föredra batchade skrivningar framför frekventa mutationer av enskilda rader.
- **`upsert`** utför en `INSERT`. För att få merge-on-key-beteende krävs att tabellen backas av en `ReplacingMergeTree`-motor.
- **`getById`** förutsätter att tabellen har en `id`-kolumn.
- `update` och `remove` kräver ett icke-tomt `clickhouseFilter` för att undvika mutationer av hela tabellen.

## Utdata-referens

| Utdatafält | Typ | Beskrivning |
|-------------|------|-------------|
| `.rows` | array | Returnerade radobjekt (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Antal rader (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Enskild rad eller `null` (`getById`) |
| `.result` | string | Kommandosammanfattning för icke-SELECT `query` |
| `.success` | boolean | Huruvida operationen lyckades |
## Exempel – Infoga en händelse

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

## Exempel – Räkna aktiva användare

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

Åtkomst till utdata: `$activeCount.count`.

## Exempel – Daglig rapportfråga

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

Åtkomst till utdata: `$dailyReport.rows`, `$dailyReport.count`.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till ClickHouse-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfiguration av autentiseringsuppgifter för integrationer
