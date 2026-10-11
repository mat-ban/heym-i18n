# ClickHouse

Uzol **ClickHouse** vykonáva operácie CRUD, počítania a surového SQL proti externej databáze [ClickHouse](https://clickhouse.com/) prostredníctvom jej HTTP rozhrania. Použite ho na zápis udalostí do tabuľky ClickHouse z workflowu, čítanie alebo agregáciu analytických dát, prípadne na spustenie ľubovoľného SQL — bez ručného písania HTTP požiadaviek.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | ClickHouse |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje ClickHouse z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operácia: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` alebo `upsert` |
| `clickhouseTable` | expression | Jednoduchý názov tabuľky. Vyžaduje sa pre každú operáciu okrem `query`. |
| `clickhouseQuery` | expression | Surové SQL pre `query`. `SELECT`/`SHOW`/`DESCRIBE` vracajú riadky; ostatné príkazy sa spúšťajú ako commandy. |
| `clickhouseFilter` | expression | JSON objekt s filtrami rovnosti, napr. `{"status":"active"}`. Používajú ho operácie `find`, `count`, `update` a `remove`. Hodnoty sú parametrizované. |
| `clickhouseLimit` | string | Maximálny počet riadkov pre `find` / `getAll` (`0` = neobmedzene, bez klauzuly LIMIT). Predvolené `100`. |
| `clickhouseSort` | expression | Voliteľné `column` alebo `column ASC\|DESC` pre `find` |
| `clickhouseRowId` | expression | Hodnota porovnávaná so stĺpcom `id` tabuľky pre `getById` |
| `clickhouseInputMode` | string | Pre `insert`/`upsert`: režim `raw` s JSON poľom alebo režim `selective` s pármi kľúč/hodnota |
| `clickhouseData` | expression | JSON pole objektov riadkov pre `insert`/`upsert` alebo JSON objekt hodnôt stĺpcov pre `update` |
| `clickhouseMappings` | array | Páry `{key, value}` používané, keď je `clickhouseInputMode` nastavený na `selective` |

## Nastavenie prihlasovacích údajov

Vytvorte prihlasovacie údaje typu **ClickHouse** v [karte Prihlasovacie údaje](../tabs/credentials-tab.md) s týmito hodnotami:

1. **Host** — HTTP host bez schémy, napríklad `your-instance.clickhouse.cloud`
2. **Port** — port HTTP rozhrania (`8443` pre HTTPS, `8123` pre HTTP)
3. **Username** / **Password** — predvolene `default` s prázdnym heslom
4. **Database** — predvolene `default`
5. **Secure** — zapnite pre HTTPS (ClickHouse Cloud)

Uzol sa pripája prostredníctvom oficiálneho HTTP klienta `clickhouse-connect`. Pred uložením overte dostupnosť pomocou tlačidla **Test connection** v dialógu prihlasovacích údajov.

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Spustí surové SQL. `SELECT` vracia `{rows, count}`; ostatné príkazy vracajú `{result}`. |
| `find` | `clickhouseTable` | Načíta riadky s voliteľnými filtrami rovnosti, zoradením a limitom |
| `getAll` | `clickhouseTable` | Načíta riadky do limitu bez filtra |
| `count` | `clickhouseTable` | Spočíta riadky, voliteľne s filtrom |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Načíta jeden riadok podľa jeho stĺpca `id` |
| `insert` | `clickhouseTable`, `clickhouseData` alebo mappings | Vloží jeden alebo viac riadkov |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Aktualizuje zodpovedajúce riadky cez `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Vymaže zodpovedajúce riadky cez `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` alebo mappings | Vloží riadky (predpokladá tabuľku `ReplacingMergeTree`) |

## Syntax filtra

`clickhouseFilter` je plochý JSON objekt s kontrolami rovnosti stĺpcov. Hodnoty sa odosielajú ako viazané parametre dotazu, takže sú chránené proti injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Toto sa skompiluje na `WHERE status = {…:String} AND tenant_id = {…:Int64}`. V nástroji na tvorbu filtrov je podporovaná iba rovnosť — pre rozsahy, joins alebo agregácie použite operáciu `query` so surovým SQL.

## Režimy vstupu (insert / upsert)

- **JSON pole** (`raw`): zadajte JSON pole objektov riadkov do `clickhouseData`. Kľúče, ktoré v danom riadku chýbajú, sa vložia ako `NULL`. Množina stĺpcov je zjednotením kľúčov zo všetkých riadkov.
- **Kľúč-hodnota** (`selective`): po výbere prihlasovacích údajov a tabuľky editor objaví stĺpce tabuľky a vytvorí jedno pole hodnoty pre každý stĺpec. Pri každom spustení sa vloží jeden riadok; každá hodnota podporuje výrazy.

## Mutácie a sémantika ClickHouse

ClickHouse je OLAP databáza, takže zápisy na úrovni riadkov sa správajú inak ako v OLTP úložisku:

- **`update`** vydáva `ALTER TABLE … UPDATE` a **`remove`** vydáva `DELETE FROM`. Obe sú **asynchrónne mutácie** — aplikujú sa postupne a sú pomerne nákladné. Uprednostnite dávkové zápisy pred častými mutáciami jednotlivých riadkov.
- **`upsert`** vykonáva `INSERT`. Ak chcete správanie typu merge-on-key, použite pre tabuľku engine `ReplacingMergeTree`.
- **`getById`** predpokladá, že tabuľka má stĺpec `id`.
- `update` a `remove` vyžadujú neprázdny `clickhouseFilter`, aby sa predišlo mutáciám celej tabuľky.

## Referencia výstupu

| Výstupné pole | Typ | Popis |
|-------------|------|-------------|
| `.rows` | array | Vrátené objekty riadkov (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Počet riadkov (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Jeden riadok alebo `null` (`getById`) |
| `.result` | string | Súhrn príkazu pre `query` bez SELECT |
| `.success` | boolean | Či operácia prebehla úspešne |
## Príklad – Vloženie udalosti

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

## Príklad – Počet aktívnych používateľov

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

Prístup k výstupu: `$activeCount.count`.

## Príklad – Dopyt na denný report

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

Prístup k výstupu: `$dailyReport.rows`, `$dailyReport.count`.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov ClickHouse
- [Integrácie tretích strán](../reference/integrations.md) – Nastavenie prihlasovacích údajov pre integrácie
