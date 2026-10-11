# Supabase

A **Supabase** csomópont egy Supabase-projekt PostgREST API-ja által közzétett táblákat olvas és módosít. Akkor használja, ha a workflow számára SQL-alapú alkalmazásállapothoz szeretne hozzáférni kézzel írt HTTP-kérések nélkül.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | Supabase |
| Kimenet | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase hitelesítési adatok a [Hitelesítési adatok](../tabs/credentials-tab.md) lapról |
| `supabaseOperation` | string | Művelet: `select`, `insert`, `update`, `upsert` vagy `delete` |
| `supabaseSchema` | expression | Séma neve. Ha üres, a csomópont a hitelesítési adatok alapértelmezett sémáját használja, majd a `public` sémát. |
| `supabaseTable` | expression | A lekérdezendő vagy módosítandó egyszerű táblanév. A sémát a `supabaseSchema` paraméterben adja meg, ne itt. |
| `supabaseSelectColumns` | expression | Vesszővel elválasztott PostgREST select lista a `select` művelethez (alapértelmezés: `*`) |
| `supabaseFilter` | expression | JSON szűrőobjektum. Támogatja a pontos egyezéseket, valamint az operátorobjektumokat és logikai csoportokat, például `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` vagy `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | A `select` műveletnél visszaadandó sorok maximális száma (`0` = az összes egyező sor lekérése szerveroldali lapozással, a negatív értékek `100`-ra esnek vissza) |
| `supabaseOrderBy` | expression | Opcionális oszlop, amely szerint a `select` művelet rendez |
| `supabaseAscending` | boolean | Növekvő rendezés, ha `true`, csökkenő, ha `false` |
| `supabaseRowsInputMode` | string | Az `insert`/`upsert` művelethez: `raw` JSON-tömb mód, vagy `auto` az egyetlen bemeneti csomópont automatikus leképezéséhez |
| `supabaseDataInputMode` | string | Az `update` művelethez: `raw` JSON-objektum mód, vagy `auto` az egyetlen bemeneti csomópont automatikus leképezéséhez |
| `supabaseIgnoredInputFields` | string | Opcionális, vesszővel elválasztott mezőnevek, amelyeket a rendszer kihagy a bemeneti adatok automatikus leképezése során |
| `supabaseRows` | expression | Sorobjektumok JSON-tömbje az `insert` és `upsert` művelethez |
| `supabaseOnConflict` | expression | Opcionális, vesszővel elválasztott ütközési céloszlopok az `upsert` művelethez, például `id` vagy `tenant_id,email` |
| `supabaseData` | expression | A frissített oszlopértékek JSON-objektuma az `update` művelethez |

## Hitelesítési adatok beállítása

Hozzon létre egy **Supabase** hitelesítési adatot a [Hitelesítési adatok lapon](../tabs/credentials-tab.md) a következőkkel:

1. A **Project URL** címe, például `https://your-project.supabase.co`
2. Egy **API key**, amely hozzáféréssel rendelkezik azokhoz a táblákhoz, amelyeket ez a workflow használhat
3. Egy opcionális **alapértelmezett séma** (alapértelmezés: `public`)

A csomópont a Supabase PostgREST endpointtal kommunikál a `/rest/v1/<table>` útvonalon.
A `supabaseTable` paraméterben csak a táblanevet adja meg, például `users` vagy `profiles`. Ne adjon át ott `schema.table`, `rpc/...` vagy más API-útvonalat.

Ha érvényes Supabase hitelesítési adatok vannak kiválasztva, a szerkesztő közvetlenül a PostgREST OpenAPI metaadatokból tudja felderíteni a közzétett táblákat és táblaoszlopokat. A **felderített táblák** legördülő menü segítségével válasszon táblát, a **Select Columns** alatti **oszlopchipek** segítségével pedig gyorsan összeállíthat egy select listát.

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Sorok olvasása opcionális pontos egyezésű szűrőkkel, limittel és rendezéssel |
| `insert` | `supabaseTable`, `supabaseRows` vagy automatikus leképezés a bemenetről | Egy vagy több sor beszúrása |
| `update` | `supabaseTable`, `supabaseData` vagy automatikus leképezés a bemenetről, `supabaseFilter` | A szűrőnek megfelelő sorok frissítése |
| `upsert` | `supabaseTable`, `supabaseRows` vagy automatikus leképezés a bemenetről | Sorok beszúrása vagy összefésülése a Supabase upsert szemantikája szerint. Használja a `supabaseOnConflict` paramétert, ha explicit ütközési célra van szüksége. |
| `delete` | `supabaseTable`, `supabaseFilter` | A szűrőnek megfelelő sorok törlése |

## Szűrőszintaxis

A `supabaseFilter` strukturált JSON-t fordít PostgREST lekérdezési paraméterekké.

- Pontos egyezés: `{"status":"active"}`
- Összehasonlítás: `{"created_at":{"gte":"2026-01-01"}}`
- Tagság: `{"status":{"in":["active","paused"]}}`
- Mintázategyezés: `{"email":{"ilike":"*@example.com"}}`
- Logikai VAGY: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logikai ÉS: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Ha ugyanazon a mezőn több operátort szeretne használni, részesítse előnyben a logikai csoportot:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Lapozás

A `select` most valódi szerveroldali lapozást végez a PostgREST ellen.

- A `supabaseLimit: "0"` az összes egyező sort lekéri oldalról oldalra
- Az 1000 feletti `supabaseLimit` értékek automatikusan több kérésre bomlanak fel
- Az eredmények egyetlen `.rows` tömbben egyesülnek vissza, és a `.count` az egyező sorok teljes számát mutatja

Nagy táblák olvasásakor állítson be stabil `supabaseOrderBy` értéket, hogy az oldalhatárok kiszámíthatóak maradjanak.

## Bemenet automatikus leképezése

Az `insert`, `upsert` és `update` műveletnél váltsa a csomópontot **Auto-map input** módra, ha az egyetlen bemeneti csomópont már a kívánt formában adja ki az írni kívánt adatokat.

- Egyetlen objektum egyetlen sorrá vagy egyetlen update payloaddá válik
- Objektumok tömbje több sorrá válik az `insert` / `upsert` műveletnél
- Egy `rows` tömböt tartalmazó bemeneti objektum közvetlenül felhasználja azt a tömböt
- A `supabaseIgnoredInputFields` segítségével elhagyhat olyan mezőket, mint az `id`, a `created_at` vagy a `success`
## Kimeneti referencia

| Kimeneti mező | Típus | Leírás |
|-------------|------|-------------|
| `.rows` | array | A visszaadott sorelemek |
| `.count` | number | A visszaadott vagy érintett sorok száma |
| `.success` | boolean | A művelet sikeres volt-e |

## Példa – Aktív felhasználók kiválasztása

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

A kimenet elérése: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Példa – Profilsor upsert művelete

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

## Kapcsolódó tartalmak

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Supabase hitelesítési adatok hozzáadása
- [Külső integrációk](../reference/integrations.md) – Integrációs hitelesítési adatok beállítása
