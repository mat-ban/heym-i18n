# ClickHouse

**ClickHouse** mazgas vykdo CRUD, skaičiavimo ir žalius SQL veiksmus prieš išorinę [ClickHouse](https://clickhouse.com/) duomenų bazę per jos HTTP sąsają. Naudokite jį įvykiams rašyti į ClickHouse lentelę iš workflow, analitinių duomenų skaitymui ar agregavimui, arba vykdyti savavališką SQL — be rankiniu būdu rašomų HTTP užklausų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | ClickHouse |
| Išvestis | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | ClickHouse kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Veiksmas: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, arba `upsert` |
| `clickhouseTable` | expression | Paprastas lentelės pavadinimas. Reikalingas kiekvienam veiksmui, išskyrus `query`. |
| `clickhouseQuery` | expression | Žalias SQL `query` veiksmui. `SELECT`/`SHOW`/`DESCRIBE` grąžina eilutes; kiti teiginiai vykdomi kaip komandos. |
| `clickhouseFilter` | expression | JSON objektas su lygybės filtrais, pvz., `{"status":"active"}`. Naudojamas `find`, `count`, `update`, ir `remove`. Vertės parametrizuotos. |
| `clickhouseLimit` | string | Maksimalus eilučių skaičius `find` / `getAll` (`0` = neribotas, be LIMIT sąlygos). Numatytoji `100`. |
| `clickhouseSort` | expression | Pasirinktinė `column` arba `column ASC\|DESC` `find` veiksmui |
| `clickhouseRowId` | expression | Vertė, palyginama su lentelės `id` stulpeliu `getById` veiksmui |
| `clickhouseInputMode` | string | `insert`/`upsert`: `raw` JSON masyvo režimas arba `selective` raktas/vertė lauko režimas |
| `clickhouseData` | expression | JSON masyvas su eilučių objektais `insert`/`upsert`, arba JSON objektas su stulpelių vertėmis `update` veiksmui |
| `clickhouseMappings` | array | `{key, value}` poros, naudojamos kai `clickhouseInputMode` yra `selective` |

## Kredencialų Nustatymas

Sukurkite **ClickHouse** kredencialą [Kredencialų skiltyje](../tabs/credentials-tab.md) su:

1. **Host** — HTTP hostas be schemos, pavyzdžiui, `your-instance.clickhouse.cloud`
2. **Port** — HTTP sąsajos prievadas (`8443` HTTPS, `8123` HTTP)
3. **Vartotojo vardas** / **Slaptažodis** — numatytoji `default` su tuščiu slaptažodžiu
4. **Duomenų bazė** — numatytoji `default`
5. **Saugus** — įgalinti HTTPS (ClickHouse Cloud)

Mazgas jungiasi per oficialų `clickhouse-connect` HTTP klientą. Naudokite **Test connection** kredencialų dialoge, kad patikrintumėte pasiekiamumą prieš išsaugodami.

## Veiksmai

| Veiksmas | Reikalingi laukai | Aprašymas |
|----------|-------------------|-----------|
| `query` | `clickhouseQuery` | Vykdyti žalią SQL. `SELECT` grąžina `{rows, count}`; kiti teiginiai grąžina `{result}`. |
| `find` | `clickhouseTable` | Skaityti eilutes su pasirenkamais lygybės filtrais, rūšiavimu ir limitu |
| `getAll` | `clickhouseTable` | Skaityti eilutes iki limito be filtro |
| `count` | `clickhouseTable` | Skaičiuoti eilutes, pasirenkamai filtruojant |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Skaityti vieną eilutę pagal jos `id` stulpelį |
| `insert` | `clickhouseTable`, `clickhouseData` arba mappings | Įterpti vieną ar daugiau eilučių |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Atnaulinti atitinkančias eilutes per `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Ištrinti atitinkančias eilutes per `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` arba mappings | Įterpti eilutes (turi būti `ReplacingMergeTree` lentelė) |

## Filtrų Sintaksė

`clickhouseFilter` yra plokščias JSON objektas su stulpelių lygybės patikromis. Vertės siunčiamos kaip susieti užklausų parametrai, todėl jos yra saugios nuo injekcijų.

```json
{ "status": "active", "tenant_id": 42 }
```

Tai kompiliuojama į `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Tik lygybė palaikoma filtrų kūrimo įrankyje — norint naudoti intervalus, jungtis ar agregacijas, naudokite `query` veiksmą su žaliu SQL.

## Įvesties Režimai (insert / upsert)

- **JSON masyvas** (`raw`): pateikite JSON masyvą su eilučių objektais `clickhouseData`. Raktai, kurie trūksta iš tam tikros eilutės, įterpiami kaip `NULL`. Stulpelių rinkinys yra visų raktų, esančių visose eilutėse, sąjunga.
- **Raktas-vertė** (`selective`): pasirinkus kredencialą ir lentelę, redaktorius atranda lentelės stulpelius ir sukuria po vieną vertės lauką kiekvienam stulpeliui. Kiekvienam vykdymui įterpiama po vieną eilutę; kiekviena vertė palaiko išraiškas.

## Mutacijos ir ClickHouse Semantika

ClickHouse yra OLAP duomenų bazė, todėl eilučių lygio įrašai elgiasi kitaip nei OLTP saugykloje:

- **`update`** vykdo `ALTER TABLE … UPDATE`, o **`remove`** vykdo `DELETE FROM`. Abu yra **asinchroninės mutacijos** — jos taikomos galiausiai ir yra palyginti brangios. Teikite pirmenybę grupiniams įrašams, o ne dažniems vieno įrašo mutacijoms.
- **`upsert`** vykdo `INSERT`. Norint gauti sujungimo pagal raktą elgseną, lentelė turi būti paremta `ReplacingMergeTree` varikliu.
- **`getById`** daro prielaidą, kad lentelėje yra `id` stulpelis.
- `update` ir `remove` reikalauja, kad `clickhouseFilter` nebūtų tuščias, kad būtų išvengta visos lentelės mutacijų.

## Išvesties Nuoroda

| Išvesties laukas | Tipas | Aprašymas |
|------------------|-------|-----------|
| `.rows` | array | Grąžinti eilučių objektai (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Eilučių skaičius (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Viena eilutė arba `null` (`getById`) |
| `.result` | string | Komandos santrauka ne-SELECT `query` |
| `.success` | boolean | Ar veiksmas pavyko |
## Pavyzdys – Įvykio Įterpimas

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

## Pavyzdys – Aktyvių Vartotojų Skaičius

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

Prieiga prie išvesties: `$activeCount.count`.

## Pavyzdys – Dienos Ataskaitos Užklausa

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

Prieiga prie išvesties: `$dailyReport.rows`, `$dailyReport.count`.

## Susiję

- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti ClickHouse kredencialus
- [Third-Party Integrations](../reference/integrations.md) – Trečiųjų šalių integracijų kredencialų nustatymas
