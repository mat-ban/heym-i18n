# Supabase

Noden **Supabase** läser och ändrar tabeller som exponeras av ett Supabase-projekts PostgREST-API. Använd den när workflowet behöver åtkomst till SQL-baserat applikationstillstånd utan att HTTP-anrop behöver skrivas för hand.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | Supabase |
| Utdata | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | Supabase-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Åtgärd: `select`, `insert`, `update`, `upsert` eller `delete` |
| `supabaseSchema` | expression | Schemanamn. Om fältet lämnas tomt använder noden autentiseringsuppgiftens standardschema, därefter `public`. |
| `supabaseTable` | expression | Enkelt tabellnamn att läsa från eller ändra. Ange schemat i `supabaseSchema`, inte här. |
| `supabaseSelectColumns` | expression | Kommaseparerad PostgREST-select-lista för `select` (standard `*`) |
| `supabaseFilter` | expression | JSON-filterobjekt. Stöder exakta matchningar samt operatorobjekt och logiska grupper, t.ex. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` eller `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maximalt antal rader att returnera för `select` (`0` = hämta alla matchande rader med server-side-paginering, negativa värden faller tillbaka till `100`) |
| `supabaseOrderBy` | expression | Valfri kolumn att sortera efter för `select` |
| `supabaseAscending` | boolean | Sortera stigande när `true`, fallande när `false` |
| `supabaseRowsInputMode` | string | För `insert`/`upsert`: `raw` JSON-array-läge eller `auto` för att automatiskt mappa den enda uppströms indata |
| `supabaseDataInputMode` | string | För `update`: `raw` JSON-objektläge eller `auto` för att automatiskt mappa den enda uppströms indata |
| `supabaseIgnoredInputFields` | string | Valfria kommaseparerade fältnamn att utelämna vid automatisk mappning av indata |
| `supabaseRows` | expression | JSON-array med radobjekt för `insert` och `upsert` |
| `supabaseOnConflict` | expression | Valfria kommaseparerade konfliktmålkolumner för `upsert`, till exempel `id` eller `tenant_id,email` |
| `supabaseData` | expression | JSON-objekt med uppdaterade kolumnvärden för `update` |

## Konfigurera autentiseringsuppgifter

Skapa en **Supabase**-autentiseringsuppgift i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) med:

1. **Projekt-URL**, till exempel `https://your-project.supabase.co`
2. En **API-nyckel** med åtkomst till de tabeller som workflowet ska använda
3. Ett valfritt **standardschema** (standardvärdet är `public`)

Noden kommunicerar med Supabase PostgREST-endpointen på `/rest/v1/<table>`.
Använd `supabaseTable` för enbart tabellen, till exempel `users` eller `profiles`. Ange inte `schema.table`, `rpc/...` eller andra API-sökvägar där.

När en giltig Supabase-autentiseringsuppgift har valts kan editorn upptäcka exponerade tabeller och tabellkolumner direkt från PostgREST OpenAPI-metadata. Använd listrutan **discovered tables** för att välja en tabell och **column chips** under **Select Columns** för att snabbt bygga en select-lista.

## Åtgärder

| Åtgärd | Obligatoriska fält | Beskrivning |
|--------|--------------------|-------------|
| `select` | `supabaseTable` | Läs rader med valfria exakta filter, limit och sortering |
| `insert` | `supabaseTable`, `supabaseRows` eller auto-mappad indata | Infoga en eller flera rader |
| `update` | `supabaseTable`, `supabaseData` eller auto-mappad indata, `supabaseFilter` | Uppdatera rader som matchar filtret |
| `upsert` | `supabaseTable`, `supabaseRows` eller auto-mappad indata | Infoga eller sammanfoga rader med Supabase upsert-semantik. Använd `supabaseOnConflict` när ett explicit konfliktmål behövs. |
| `delete` | `supabaseTable`, `supabaseFilter` | Ta bort rader som matchar filtret |

## Filtersyntax

`supabaseFilter` kompilerar strukturerad JSON till PostgREST-frågeparametrar.

- Exakt matchning: `{"status":"active"}`
- Jämförelse: `{"created_at":{"gte":"2026-01-01"}}`
- Medlemskap: `{"status":{"in":["active","paused"]}}`
- Mönstermatchning: `{"email":{"ilike":"*@example.com"}}`
- Logiskt OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logiskt AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

För flera operatorer på samma fält bör en logisk grupp föredras:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginering

`select` utför nu äkta server-side-paginering mot PostgREST.

- `supabaseLimit: "0"` hämtar alla matchande rader sida för sida
- `supabaseLimit`-värden över 1000 delas automatiskt upp i flera förfrågningar
- Resultaten slås samman till en enda `.rows`-array och `.count` förblir det totala antalet matchande rader

Vid läsning av stora tabeller bör en stabil `supabaseOrderBy` anges för att hålla sidgränserna förutsägbara.

## Auto-mappa indata

För `insert`, `upsert` och `update` växlar noden till **Auto-map input** när den enda
uppströms noden redan producerar den form som ska skrivas.

- Ett enskilt objekt blir en rad eller en update-payload
- En array av objekt blir många rader för `insert` / `upsert`
- Ett uppströms objekt med en `rows`-array återanvänder den arrayen direkt
- `supabaseIgnoredInputFields` gör det möjligt att utelämna fält som `id`, `created_at` eller `success`
## Utdatareferens

| Utdatofält | Typ | Beskrivning |
|-------------|------|-------------|
| `.rows` | array | Returnerade radobjekt |
| `.count` | number | Antal returnerade eller påverkade rader |
| `.success` | boolean | Huruvida åtgärden lyckades |

## Exempel – Välj aktiva användare

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

Åtkomst till utdata: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exempel – Upsert av en profilrad

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till Supabase-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfiguration av integrationsautentiseringsuppgifter
