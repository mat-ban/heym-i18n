# ClickHouse

Uzel **ClickHouse** provádí operace CRUD, počítání a surové SQL operace vůči externí databázi [ClickHouse](https://clickhouse.com/) prostřednictvím jejího HTTP rozhraní. Použijte jej k zápisu událostí do tabulky ClickHouse z workflow, ke čtení nebo agregaci analytických dat, případně ke spuštění libovolného SQL — bez ručního sestavování HTTP požadavků.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | ClickHouse |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje ClickHouse z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operace: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` nebo `upsert` |
| `clickhouseTable` | expression | Jednoduchý název tabulky. Vyžadováno pro všechny operace kromě `query`. |
| `clickhouseQuery` | expression | Surové SQL pro `query`. `SELECT`/`SHOW`/`DESCRIBE` vrací řádky; ostatní příkazy se spouští jako commandy. |
| `clickhouseFilter` | expression | JSON objekt s filtry rovnosti, např. `{"status":"active"}`. Používá se u `find`, `count`, `update` a `remove`. Hodnoty jsou parametrizované. |
| `clickhouseLimit` | string | Maximální počet řádků pro `find` / `getAll` (`0` = neomezeno, bez klauzule LIMIT). Výchozí `100`. |
| `clickhouseSort` | expression | Volitelné `column` nebo `column ASC\|DESC` pro `find` |
| `clickhouseRowId` | expression | Hodnota porovnávaná se sloupcem `id` tabulky pro `getById` |
| `clickhouseInputMode` | string | Pro `insert`/`upsert`: režim `raw` (JSON pole) nebo `selective` (režim klíč/hodnota) |
| `clickhouseData` | expression | JSON pole objektů řádků pro `insert`/`upsert` nebo JSON objekt hodnot sloupců pro `update` |
| `clickhouseMappings` | array | Páry `{key, value}` používané, když je `clickhouseInputMode` nastaven na `selective` |

## Nastavení přihlašovacích údajů

Vytvořte přihlašovací údaje **ClickHouse** v [záložce Přihlašovací údaje](../tabs/credentials-tab.md) s následujícím:

1. **Host** — HTTP host bez schématu, například `your-instance.clickhouse.cloud`
2. **Port** — port HTTP rozhraní (`8443` pro HTTPS, `8123` pro HTTP)
3. **Username** / **Password** — výchozí je `default` s prázdným heslem
4. **Database** — výchozí je `default`
5. **Secure** — zapněte pro HTTPS (ClickHouse Cloud)

Uzel se připojuje přes oficiální HTTP klient `clickhouse-connect`. Před uložením ověřte dostupnost pomocí tlačítka **Test connection** v dialogu přihlašovacích údajů.

## Operace

| Operace | Povinná pole | Popis |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Spustí surové SQL. `SELECT` vrací `{rows, count}`; ostatní příkazy vrací `{result}`. |
| `find` | `clickhouseTable` | Čte řádky s volitelnými filtry rovnosti, řazením a limitem |
| `getAll` | `clickhouseTable` | Čte řádky do limitu bez filtru |
| `count` | `clickhouseTable` | Počítá řádky, volitelně s filtrem |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Čte jeden řádek podle jeho sloupce `id` |
| `insert` | `clickhouseTable`, `clickhouseData` nebo mappings | Vloží jeden nebo více řádků |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Aktualizuje odpovídající řádky přes `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Odstraní odpovídající řádky přes `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` nebo mappings | Vloží řádky (předpokládá tabulku `ReplacingMergeTree`) |

## Syntaxe filtru

`clickhouseFilter` je plochý JSON objekt s kontrolami rovnosti sloupců. Hodnoty jsou odesílány jako vázané parametry dotazu, takže jsou chráněny proti injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Toto se přeloží na `WHERE status = {…:String} AND tenant_id = {…:Int64}`. V tvůrci filtrů je podporována pouze rovnost — pro rozsahy, joiny nebo agregace použijte operaci `query` se surovým SQL.

## Režimy vstupu (insert / upsert)

- **JSON pole** (`raw`): zadejte JSON pole objektů řádků v `clickhouseData`. Klíče, které v daném řádku chybí, se vloží jako `NULL`. Množina sloupců je sjednocením klíčů napříč všemi řádky.
- **Klíč-hodnota** (`selective`): po výběru přihlašovacích údajů a tabulky editor rozpozná sloupce tabulky a vytvoří jedno pole hodnoty pro každý sloupec. Na jedno spuštění se vloží jeden řádek; každá hodnota podporuje výrazy.

## Mutace a sémantika ClickHouse

ClickHouse je OLAP databáze, takže zápisy na úrovni řádků se chovají odlišně od OLTP úložiště:

- **`update`** vydává `ALTER TABLE … UPDATE` a **`remove`** vydává `DELETE FROM`. Obě jsou **asynchronní mutace** — aplikují se postupně a jsou poměrně nákladné. Upřednostněte dávkové zápisy před častými mutacemi jednotlivých řádků.
- **`upsert`** provádí `INSERT`. Chcete-li dosáhnout chování merge-on-key, použijte pro tabulku engine `ReplacingMergeTree`.
- **`getById`** předpokládá, že tabulka má sloupec `id`.
- `update` a `remove` vyžadují neprázdný `clickhouseFilter`, aby se zabránilo mutacím celé tabulky.

## Reference výstupu

| Výstupní pole | Typ | Popis |
|-------------|------|-------------|
| `.rows` | array | Vrácené objekty řádků (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Počet řádků (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Jeden řádek nebo `null` (`getById`) |
| `.result` | string | Souhrn commandu pro `query` bez SELECT |
| `.success` | boolean | Zda operace proběhla úspěšně |
## Příklad – Vložení události

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

## Příklad – Počet aktivních uživatelů

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

Přístup k výstupu: `$activeCount.count`.

## Příklad – Dotaz pro denní přehled

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

Přístup k výstupu: `$dailyReport.rows`, `$dailyReport.count`.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů ClickHouse
- [Integrace třetích stran](../reference/integrations.md) – Nastavení přihlašovacích údajů pro integrace
