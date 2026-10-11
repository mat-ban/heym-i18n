# ClickHouse

El node **ClickHouse** executa operacions CRUD, de recompte i de SQL en brut contra una base de dades [ClickHouse](https://clickhouse.com/) externa a través de la seva interfície HTTP. Utilitzeu-lo per escriure esdeveniments en una taula de ClickHouse des d'un workflow, llegir o agregar dades analítiques, o executar SQL arbitrari — sense haver d'escriure manualment les peticions HTTP.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | ClickHouse |
| Sortida | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de ClickHouse de [Credencials](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operació: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` o `upsert` |
| `clickhouseTable` | expression | Nom simple de la taula. Obligatori per a totes les operacions excepte `query`. |
| `clickhouseQuery` | expression | SQL en brut per a `query`. `SELECT`/`SHOW`/`DESCRIBE` retornen files; altres sentències s'executen com a ordres. |
| `clickhouseFilter` | expression | Objecte JSON de filtres d'igualtat, p. ex. `{"status":"active"}`. Utilitzat per `find`, `count`, `update` i `remove`. Els valors es parametritzen. |
| `clickhouseLimit` | string | Nombre màxim de files per a `find` / `getAll` (`0` = il·limitat, sense clàusula LIMIT). Per defecte `100`. |
| `clickhouseSort` | expression | `column` opcional o `column ASC\|DESC` per a `find` |
| `clickhouseRowId` | expression | Valor que es compara amb la columna `id` de la taula per a `getById` |
| `clickhouseInputMode` | string | Per a `insert`/`upsert`: mode `raw` d'array JSON o mode `selective` de camp clau/valor |
| `clickhouseData` | expression | Array JSON d'objectes de fila per a `insert`/`upsert`, o objecte JSON de valors de columna per a `update` |
| `clickhouseMappings` | array | Parells `{key, value}` utilitzats quan `clickhouseInputMode` és `selective` |

## Configuració de la credencial

Creeu una credencial **ClickHouse** a la [pestanya Credencials](../tabs/credentials-tab.md) amb:

1. **Host** — l'amfitrió HTTP sense esquema, per exemple `your-instance.clickhouse.cloud`
2. **Port** — el port de la interfície HTTP (`8443` per a HTTPS, `8123` per a HTTP)
3. **Username** / **Password** — per defecte `default` amb contrasenya buida
4. **Database** — per defecte `default`
5. **Secure** — activeu-ho per a HTTPS (ClickHouse Cloud)

El node es connecta a través del client HTTP oficial `clickhouse-connect`. Utilitzeu **Test connection** al diàleg de la credencial per verificar l'accessibilitat abans de desar.

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Executa SQL en brut. `SELECT` retorna `{rows, count}`; altres sentències retornen `{result}`. |
| `find` | `clickhouseTable` | Llegeix files amb filtres d'igualtat, ordenació i límit opcionals |
| `getAll` | `clickhouseTable` | Llegeix files fins al límit sense cap filtre |
| `count` | `clickhouseTable` | Compta files, opcionalment filtrades |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Llegeix una única fila per la seva columna `id` |
| `insert` | `clickhouseTable`, `clickhouseData` o mappings | Insereix una o més files |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Actualitza les files coincidents mitjançant `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Elimina les files coincidents mitjançant `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` o mappings | Insereix files (assumeix una taula `ReplacingMergeTree`) |

## Sintaxi de filtres

`clickhouseFilter` és un objecte JSON pla de comprovacions d'igualtat per columna. Els valors s'envien com a paràmetres de consulta vinculats, de manera que són segurs contra la injecció.

```json
{ "status": "active", "tenant_id": 42 }
```

Això es compila a `WHERE status = {…:String} AND tenant_id = {…:Int64}`. El constructor de filtres només admet igualtat — per a rangs, joins o agregacions, utilitzeu l'operació `query` amb SQL en brut.

## Modes d'entrada (insert / upsert)

- **Array JSON** (`raw`): proporcioneu un array JSON d'objectes de fila a `clickhouseData`. Les claus que falten en una fila determinada s'insereixen com a `NULL`. El conjunt de columnes és la unió de les claus de totes les files.
- **Clau-valor** (`selective`): després de seleccionar una credencial i una taula, l'editor descobreix les columnes de la taula i crea un camp de valor per columna. S'insereix una fila per execució; cada valor admet expressions.
## Mutacions i semàntica de ClickHouse

ClickHouse és una base de dades OLAP, de manera que les escriptures a nivell de fila es comporten de manera diferent respecte d'un magatzem OLTP:

- **`update`** emet `ALTER TABLE … UPDATE` i **`remove`** emet `DELETE FROM`. Tots dos són **mutacions asíncrones** — s'apliquen de manera diferida i són comparativament costoses. Es recomana prioritzar escriptures per lots en lloc de mutacions freqüents d'una sola fila.
- **`upsert`** realitza un `INSERT`. Per obtenir un comportament de fusió per clau, cal configurar la taula amb un motor `ReplacingMergeTree`.
- **`getById`** assumeix que la taula té una columna `id`.
- `update` i `remove` requereixen un `clickhouseFilter` no buit per evitar mutacions de taula completa.

## Referència de sortida

| Camp de sortida | Tipus | Descripció |
|-------------|------|-------------|
| `.rows` | array | Objectes de fila retornats (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Recompte de files (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Fila única o `null` (`getById`) |
| `.result` | string | Resum de l'ordre per a `query` que no sigui SELECT |
| `.success` | boolean | Indica si l'operació s'ha completat correctament |

## Exemple – Inserir un esdeveniment

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

## Exemple – Comptar usuaris actius

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

Accés a la sortida: `$activeCount.count`.

## Exemple – Consulta d'informe diari

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

Accés a la sortida: `$dailyReport.rows`, `$dailyReport.count`.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Credentials Tab](../tabs/credentials-tab.md) – Afegir credencials de ClickHouse
- [Third-Party Integrations](../reference/integrations.md) – Configuració de credencials d'integracions
