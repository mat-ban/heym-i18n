# ClickHouse

De **ClickHouse**-node voert CRUD-, count- en raw SQL-operaties uit op een externe [ClickHouse](https://clickhouse.com/)-database via de HTTP-interface. Gebruik deze om events vanuit een workflow naar een ClickHouse-tabel te schrijven, analysedata te lezen of te aggregeren, of willekeurige SQL uit te voeren — zonder handmatig HTTP-verzoeken te schrijven.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | ClickHouse |
| Uitvoer | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operatie: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` of `upsert` |
| `clickhouseTable` | expression | Eenvoudige tabelnaam. Vereist voor elke operatie behalve `query`. |
| `clickhouseQuery` | expression | Raw SQL voor `query`. `SELECT`/`SHOW`/`DESCRIBE` retourneren rijen; andere statements worden als commando's uitgevoerd. |
| `clickhouseFilter` | expression | JSON-object met gelijkheidsfilters, bijvoorbeeld `{"status":"active"}`. Wordt gebruikt door `find`, `count`, `update` en `remove`. Waarden worden geparameteriseerd. |
| `clickhouseLimit` | string | Maximaal aantal rijen voor `find` / `getAll` (`0` = onbeperkt, geen LIMIT-clausule). Standaard `100`. |
| `clickhouseSort` | expression | Optionele `column` of `column ASC\|DESC` voor `find` |
| `clickhouseRowId` | expression | Waarde die wordt gematcht tegen de `id`-kolom van de tabel voor `getById` |
| `clickhouseInputMode` | string | Voor `insert`/`upsert`: `raw` JSON-array-modus of `selective` key/value-veldmodus |
| `clickhouseData` | expression | JSON-array met rij-objecten voor `insert`/`upsert`, of JSON-object met kolomwaarden voor `update` |
| `clickhouseMappings` | array | `{key, value}`-paren die worden gebruikt wanneer `clickhouseInputMode` gelijk is aan `selective` |

## Referentie instellen

Maak een **ClickHouse**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md) met:

1. **Host** — de HTTP-host zonder schema, bijvoorbeeld `your-instance.clickhouse.cloud`
2. **Port** — de poort van de HTTP-interface (`8443` voor HTTPS, `8123` voor HTTP)
3. **Username** / **Password** — standaard `default` met een leeg wachtwoord
4. **Database** — standaard `default`
5. **Secure** — inschakelen voor HTTPS (ClickHouse Cloud)

De node maakt verbinding via de officiële `clickhouse-connect` HTTP-client. Gebruik **Test connection** in het referentiedialoogvenster om de bereikbaarheid te verifiëren voordat u opslaat.

## Operaties

| Operatie | Vereiste velden | Beschrijving |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Voer raw SQL uit. `SELECT` retourneert `{rows, count}`; andere statements retourneren `{result}`. |
| `find` | `clickhouseTable` | Lees rijen met optionele gelijkheidsfilters, sortering en limiet |
| `getAll` | `clickhouseTable` | Lees rijen tot aan de limiet zonder filter |
| `count` | `clickhouseTable` | Tel rijen, optioneel gefilterd |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lees één rij op basis van de `id`-kolom |
| `insert` | `clickhouseTable`, `clickhouseData` of mappings | Voeg één of meer rijen in |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Werk overeenkomende rijen bij via `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Verwijder overeenkomende rijen via `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` of mappings | Voeg rijen in (veronderstelt een `ReplacingMergeTree`-tabel) |

## Filtersyntaxis

`clickhouseFilter` is een vlak JSON-object met gelijkheidscontroles op kolommen. Waarden worden verzonden als gebonden queryparameters, zodat ze veilig zijn tegen injectie.

```json
{ "status": "active", "tenant_id": 42 }
```

Dit compileert naar `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Alleen gelijkheid wordt ondersteund in de filterbuilder — gebruik voor bereiken, joins of aggregaties de `query`-operatie met raw SQL.

## Invoermodi (insert / upsert)

- **JSON-array** (`raw`): geef een JSON-array met rij-objecten op in `clickhouseData`. Sleutels die ontbreken in een bepaalde rij worden ingevoegd als `NULL`. De kolomset is de vereniging van sleutels over alle rijen.
- **Key-value** (`selective`): nadat u een referentie en tabel hebt geselecteerd, ontdekt de editor de tabelkolommen en maakt één waardevak per kolom aan. Per uitvoering wordt één rij ingevoegd; elke waarde ondersteunt expressies.

## Mutaties en ClickHouse-semantiek

ClickHouse is een OLAP-database, dus schrijfacties op rijniveau gedragen zich anders dan bij een OLTP-opslag:

- **`update`** voert `ALTER TABLE … UPDATE` uit en **`remove`** voert `DELETE FROM` uit. Beide zijn **asynchrone mutaties** — ze worden uiteindelijk toegepast en zijn relatief kostbaar. Geef de voorkeur aan gebatchte schrijfacties boven frequente mutaties op één rij.
- **`upsert`** voert een `INSERT` uit. Voor merge-on-key-gedrag moet de tabel worden ondersteund door een `ReplacingMergeTree`-engine.
- **`getById`** veronderstelt dat de tabel een `id`-kolom heeft.
- `update` en `remove` vereisen een niet-lege `clickhouseFilter` om mutaties op de volledige tabel te voorkomen.

## Uitvoerreferentie

| Uitvoerveld | Type | Beschrijving |
|-------------|------|-------------|
| `.rows` | array | Geretourneerde rij-objecten (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Aantal rijen (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Enkele rij of `null` (`getById`) |
| `.result` | string | Commando-samenvatting voor niet-SELECT `query` |
| `.success` | boolean | Of de operatie is geslaagd |
## Voorbeeld – Een gebeurtenis invoegen

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

## Voorbeeld – Actieve gebruikers tellen

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

Uitvoer openen: `$activeCount.count`.

## Voorbeeld – Query voor dagelijks rapport

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

Uitvoer openen: `$dailyReport.rows`, `$dailyReport.count`.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Credentials Tab](../tabs/credentials-tab.md) – ClickHouse-referenties toevoegen
- [Third-Party Integrations](../reference/integrations.md) – Referenties voor integraties configureren
