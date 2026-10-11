# Supabase

Uzol **Supabase** číta a mení tabuľky sprístupnené prostredníctvom PostgREST API projektu Supabase. Použite ho, keď chcete mať z workflowu prístup k stavu aplikácie podloženému SQL bez ručného písania HTTP požiadaviek.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Supabase |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Supabase z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operácia: `select`, `insert`, `update`, `upsert` alebo `delete` |
| `supabaseSchema` | expression | Názov schémy. Ak je prázdny, uzol použije predvolenú schému prihlasovacích údajov a potom `public`. |
| `supabaseTable` | expression | Jednoduchý názov tabuľky na dotazovanie alebo zmenu. Schému vložte do `supabaseSchema`, nie sem. |
| `supabaseSelectColumns` | expression | Čiarkami oddelený zoznam select pre PostgREST pre `select` (predvolene `*`) |
| `supabaseFilter` | expression | JSON objekt filtra. Podporuje presné zhody, ako aj objekty operátorov a logické skupiny, napr. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` alebo `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maximálny počet riadkov na vrátenie pre `select` (`0` = načítať všetky zodpovedajúce riadky so serverovou stránkovaním, záporné hodnoty sa vrátia k `100`) |
| `supabaseOrderBy` | expression | Voliteľný stĺpec na zoradenie pre `select` |
| `supabaseAscending` | boolean | Zoradiť vzostupne, keď `true`, zostupne, keď `false` |
| `supabaseRowsInputMode` | string | Pre `insert`/`upsert`: režim `raw` JSON poľa alebo `auto` na automatické mapovanie jediného vstupu z predchádzajúceho uzla |
| `supabaseDataInputMode` | string | Pre `update`: režim `raw` JSON objektu alebo `auto` na automatické mapovanie jediného vstupu z predchádzajúceho uzla |
| `supabaseIgnoredInputFields` | string | Voliteľné čiarkami oddelené názvy polí, ktoré sa majú vynechať pri automatickom mapovaní vstupných údajov |
| `supabaseRows` | expression | JSON pole objektov riadkov pre `insert` a `upsert` |
| `supabaseOnConflict` | expression | Voliteľné čiarkami oddelené cieľové stĺpce konfliktu pre `upsert`, napríklad `id` alebo `tenant_id,email` |
| `supabaseData` | expression | JSON objekt aktualizovaných hodnôt stĺpcov pre `update` |

## Nastavenie prihlasovacích údajov

Vytvorte prihlasovacie údaje **Supabase** na karte [Prihlasovacie údaje](../tabs/credentials-tab.md) s:

1. Vašou **Project URL**, napríklad `https://your-project.supabase.co`
2. **API kľúčom** s prístupom k tabuľkám, ktoré má tento workflow používať
3. Voliteľnou **predvolenou schémou** (predvolene `public`)

Uzol komunikuje s endpointom Supabase PostgREST na `/rest/v1/<table>`.
Použite `supabaseTable` iba pre tabuľku, napríklad `users` alebo `profiles`. Nepredávajte sem `schema.table`, `rpc/...` ani iné API cesty.

Keď je vybrané platné prihlasovacie údaje Supabase, editor dokáže objaviť sprístupnené tabuľky a stĺpce tabuliek priamo z metadát PostgREST OpenAPI. Použite rozbaľovací zoznam **discovered tables** na výber tabuľky a **column chips** pod **Select Columns** na rýchle zostavenie zoznamu select.

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Čítať riadky s voliteľnými filtrami presnej zhody, limitom a zoradením |
| `insert` | `supabaseTable`, `supabaseRows` alebo automatické mapovanie vstupu | Vložiť jeden alebo viac riadkov |
| `update` | `supabaseTable`, `supabaseData` alebo automatické mapovanie vstupu, `supabaseFilter` | Aktualizovať riadky zodpovedajúce filtru |
| `upsert` | `supabaseTable`, `supabaseRows` alebo automatické mapovanie vstupu | Vložiť alebo zlúčiť riadky pomocou sémantiky upsert v Supabase. Použite `supabaseOnConflict`, keď potrebujete explicitný cieľ konfliktu. |
| `delete` | `supabaseTable`, `supabaseFilter` | Odstrániť riadky zodpovedajúce filtru |

## Syntax filtra

`supabaseFilter` kompiluje štruktúrovaný JSON do parametrov dotazu PostgREST.

- Presná zhoda: `{"status":"active"}`
- Porovnanie: `{"created_at":{"gte":"2026-01-01"}}`
- Členstvo: `{"status":{"in":["active","paused"]}}`
- Zhoda vzoru: `{"email":{"ilike":"*@example.com"}}`
- Logické OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logické AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Pre viacero operátorov na tom istom poli uprednostnite logickú skupinu:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Stránkovanie

`select` teraz vykonáva skutočné serverové stránkovanie voči PostgREST.

- `supabaseLimit: "0"` načíta všetky zodpovedajúce riadky stránku po stránke
- Hodnoty `supabaseLimit` nad 1000 sa automaticky rozdelia do viacerých požiadaviek
- Výsledky sa zlúčia späť do jedného poľa `.rows` a `.count` zostáva celkový počet zodpovedajúcich riadkov

Pri čítaní veľkých tabuliek nastavte stabilné `supabaseOrderBy`, aby hranice strán zostali predvídateľné.

## Automatické mapovanie vstupu

Pre `insert`, `upsert` a `update` prepnite uzol na **Auto-map input**, keď jediný
predchádzajúci uzol už vracia tvar, ktorý chcete zapísať.

- Jediný objekt sa stane jedným riadkom alebo jedným payloadom aktualizácie
- Pole objektov sa stane mnohými riadkami pre `insert` / `upsert`
- Objekt z predchádzajúceho uzla s poľom `rows` znovu použije toto pole priamo
- `supabaseIgnoredInputFields` vám umožní vynechať polia ako `id`, `created_at` alebo `success`
## Referencia výstupu

| Výstupné pole | Typ | Popis |
|-------------|------|-------------|
| `.rows` | array | Vrátené objekty riadkov |
| `.count` | number | Počet vrátených alebo ovplyvnených riadkov |
| `.success` | boolean | Či operácia prebehla úspešne |

## Príklad – Výber aktívnych používateľov

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Prístup k výstupu: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Príklad – Upsert riadku profilu

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov Supabase
- [Integrácie tretích strán](../reference/integrations.md) – Nastavenie prihlasovacích údajov pre integrácie
