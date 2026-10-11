# ClickHouse

A **ClickHouse** csomópont CRUD-, count- és nyers SQL-műveleteket futtat egy külső [ClickHouse](https://clickhouse.com/) adatbázis ellen annak HTTP interfészén keresztül. Használja események ClickHouse-táblába írásához egy workflow-ból, analitikai adatok olvasásához vagy aggregálásához, illetve tetszőleges SQL futtatásához — HTTP-kérések kézi megírása nélkül.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adat | ClickHouse |
| Kimenet | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `clickhouseOperation` | string | Művelet: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` vagy `upsert` |
| `clickhouseTable` | expression | Egyszerű táblanév. Minden művelethez kötelező a `query` kivételével. |
| `clickhouseQuery` | expression | Nyers SQL a `query` művelethez. A `SELECT`/`SHOW`/`DESCRIBE` sorokat ad vissza; más utasítások parancsként futnak. |
| `clickhouseFilter` | expression | Egyenlőségi szűrők JSON-objektuma, pl. `{"status":"active"}`. A `find`, `count`, `update` és `remove` műveletek használják. Az értékek paraméterezettek. |
| `clickhouseLimit` | string | A `find` / `getAll` műveletek maximális sorszáma (`0` = korlátlan, nincs LIMIT záradék). Alapértelmezés: `100`. |
| `clickhouseSort` | expression | Opcionális `column` vagy `column ASC\|DESC` a `find` művelethez |
| `clickhouseRowId` | expression | A tábla `id` oszlopával egyeztetett érték a `getById` művelethez |
| `clickhouseInputMode` | string | Az `insert`/`upsert` műveletekhez: `raw` JSON-tömb mód vagy `selective` kulcs/érték mezőmód |
| `clickhouseData` | expression | Sorobjektumok JSON-tömbje az `insert`/`upsert` művelethez, vagy oszlopértékek JSON-objektuma az `update` művelethez |
| `clickhouseMappings` | array | `{key, value}` párok, amelyeket a `clickhouseInputMode` `selective` értéke esetén használ a rendszer |

## Hitelesítési adat beállítása

Hozzon létre egy **ClickHouse** hitelesítési adatot a [Hitelesítési adatok lapon](../tabs/credentials-tab.md) az alábbiakkal:

1. **Host** — a HTTP hoszt séma nélkül, például `your-instance.clickhouse.cloud`
2. **Port** — a HTTP interfész portja (`8443` HTTPS-hez, `8123` HTTP-hez)
3. **Username** / **Password** — alapértelmezésben `default` üres jelszóval
4. **Database** — alapértelmezésben `default`
5. **Secure** — engedélyezze HTTPS-hez (ClickHouse Cloud)

A csomópont a hivatalos `clickhouse-connect` HTTP kliensen keresztül csatlakozik. A mentés előtt a hitelesítési adat párbeszédablakában a **Test connection** gombbal ellenőrizheti az elérhetőséget.

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Nyers SQL futtatása. A `SELECT` `{rows, count}` értéket ad vissza; más utasítások `{result}` értéket. |
| `find` | `clickhouseTable` | Sorok olvasása opcionális egyenlőségi szűrőkkel, rendezéssel és korláttal |
| `getAll` | `clickhouseTable` | Sorok olvasása a korlátig szűrő nélkül |
| `count` | `clickhouseTable` | Sorok számlálása, opcionálisan szűrve |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Egyetlen sor olvasása az `id` oszlopa alapján |
| `insert` | `clickhouseTable`, `clickhouseData` vagy mappings | Egy vagy több sor beszúrása |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Egyező sorok frissítése `ALTER TABLE ... UPDATE` segítségével |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Egyező sorok törlése `DELETE FROM` segítségével |
| `upsert` | `clickhouseTable`, `clickhouseData` vagy mappings | Sorok beszúrása (feltételezi a `ReplacingMergeTree` táblát) |

## Szűrő szintaxis

A `clickhouseFilter` egy lapos JSON-objektum, amely oszlopok egyenlőség-ellenőrzéseit tartalmazza. Az értékek kötött lekérdezési paraméterekként kerülnek elküldésre, így biztonságosak az injekció ellen.

```json
{ "status": "active", "tenant_id": 42 }
```

Ez a következővé fordul: `WHERE status = {…:String} AND tenant_id = {…:Int64}`. A szűrőépítő csak az egyenlőséget támogatja — tartományokhoz, joinokhoz vagy aggregációkhoz használja a `query` műveletet nyers SQL-lel.

## Bemeneti módok (insert / upsert)

- **JSON-tömb** (`raw`): adjon meg egy JSON-tömböt sorobjektumokkal a `clickhouseData` mezőben. Az adott sorból hiányzó kulcsok `NULL` értékkel kerülnek beszúrásra. Az oszlopkészlet az összes sor kulcsainak uniója.
- **Kulcs-érték** (`selective`): miután kiválaszt egy hitelesítési adatot és táblát, a szerkesztő felderíti a tábla oszlopait, és minden oszlophoz létrehoz egy értékmezőt. Futtatásonként egy sor kerül beszúrásra; minden érték támogatja a kifejezéseket.

## Mutációk és ClickHouse szemantika

A ClickHouse egy OLAP adatbázis, ezért a sor szintű írások másképp viselkednek, mint egy OLTP tárolóban:

- Az **`update`** az `ALTER TABLE … UPDATE`, a **`remove`** pedig a `DELETE FROM` utasítást adja ki. Mindkettő **aszinkron mutáció** — késleltetve kerül alkalmazásra, és viszonylag költséges. A gyakori egyedi soros mutációk helyett részesítse előnyben a kötegelt írásokat.
- Az **`upsert`** egy `INSERT` műveletet hajt végre. A kulcs szerinti összevonás eléréséhez a táblát `ReplacingMergeTree` motorral kell alátámasztani.
- A **`getById`** feltételezi, hogy a táblának van `id` oszlopa.
- Az `update` és `remove` műveletekhez nem üres `clickhouseFilter` szükséges a teljes táblát érintő mutációk elkerülése érdekében.

## Kimenet referenciája

| Kimeneti mező | Típus | Leírás |
|-------------|------|-------------|
| `.rows` | array | Visszaadott sorobjektumok (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Sorok száma (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Egyetlen sor vagy `null` (`getById`) |
| `.result` | string | Parancs összegzése nem SELECT típusú `query` esetén |
| `.success` | boolean | A művelet sikeres volt-e |
## Példa – Esemény beszúrása

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

## Példa – Aktív felhasználók számolása

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

A kimenet elérése: `$activeCount.count`.

## Példa – Napi jelentés lekérdezése

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

A kimenet elérése: `$dailyReport.rows`, `$dailyReport.count`.

## Kapcsolódó tartalmak

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – ClickHouse hitelesítési adatok hozzáadása
- [Külső integrációk](../reference/integrations.md) – Integrációs hitelesítési adatok beállítása
