# Supabase

**Supabase** mezgls nolasa un modificē tabulas, kas tiek publiskotas caur Supabase projekta PostgREST API. Izmantojiet to, ja vēlaties piekļūt ar SQL atbalstītam lietotnes stāvoklim no workflow, nerakstot HTTP pieprasījumus manuāli.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Supabase |
| Izvade | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase akreditācijas dati no [Akreditācijas datiem](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Darbība: `select`, `insert`, `update`, `upsert` vai `delete` |
| `supabaseSchema` | expression | Shēmas nosaukums. Ja tukšs, mezgls izmanto akreditācijas datu noklusējuma shēmu, pēc tam `public`. |
| `supabaseTable` | expression | Vienkāršs tabulas nosaukums vaicājumam vai modificēšanai. Ievietojiet shēmu `supabaseSchema`, nevis šeit. |
| `supabaseSelectColumns` | expression | Ar komatu atdalīts PostgREST select saraksts darbībai `select` (noklusējums `*`) |
| `supabaseFilter` | expression | JSON filtra objekts. Atbalsta precīzas atbilstības, kā arī operatoru objektus un loģiskās grupas, piem., `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` vai `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksimālais atgriežamo rindu skaits darbībai `select` (`0` = iegūt visas atbilstošās rindas ar servera puses lapošanu, negatīvas vērtības tiek aizstātas ar `100`) |
| `supabaseOrderBy` | expression | Neobligāta kolonna kārtošanai darbībai `select` |
| `supabaseAscending` | boolean | Kārtot augošā secībā, ja `true`, dilstošā secībā, ja `false` |
| `supabaseRowsInputMode` | string | Darbībām `insert`/`upsert`: `raw` JSON masīva režīms vai `auto`, lai automātiski kartētu vienu augšupējo ievadi |
| `supabaseDataInputMode` | string | Darbībai `update`: `raw` JSON objekta režīms vai `auto`, lai automātiski kartētu vienu augšupējo ievadi |
| `supabaseIgnoredInputFields` | string | Neobligāti ar komatu atdalīti lauku nosaukumi, ko izlaist automātiskās ievades datu kartēšanas laikā |
| `supabaseRows` | expression | JSON masīvs ar rindas objektiem darbībām `insert` un `upsert` |
| `supabaseOnConflict` | expression | Neobligātas ar komatu atdalītas konflikta mērķa kolonnas darbībai `upsert`, piemēram, `id` vai `tenant_id,email` |
| `supabaseData` | expression | JSON objekts ar atjauninātajām kolonnu vērtībām darbībai `update` |

## Akreditācijas datu iestatīšana

Izveidojiet **Supabase** akreditācijas datus cilnē [Akreditācijas dati](../tabs/credentials-tab.md) ar:

1. Jūsu **Project URL**, piemēram, `https://your-project.supabase.co`
2. **API atslēgu** ar piekļuvi tabulām, ko šim workflow vajadzētu izmantot
3. Neobligātu **noklusējuma shēmu** (pēc noklusējuma `public`)

Mezgls sazinās ar Supabase PostgREST endpoint vietnē `/rest/v1/<table>`.
Izmantojiet `supabaseTable` tikai tabulai, piemēram, `users` vai `profiles`. Nenorādiet tur `schema.table`, `rpc/...` vai citus API ceļus.

Kad ir atlasīti derīgi Supabase akreditācijas dati, redaktors var atklāt publiskotās tabulas un tabulu
kolonnas tieši no PostgREST OpenAPI metadatiem. Izmantojiet nolaižamo sarakstu **discovered tables**, lai
izvēlētos tabulu, un **column chips** zem **Select Columns**, lai ātri izveidotu select sarakstu.

## Darbības

| Darbība | Nepieciešamie lauki | Apraksts |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lasīt rindas ar neobligātiem precīzas atbilstības filtriem, limitu un kārtošanu |
| `insert` | `supabaseTable`, `supabaseRows` vai automātiskā ievades kartēšana | Ievietot vienu vai vairākas rindas |
| `update` | `supabaseTable`, `supabaseData` vai automātiskā ievades kartēšana, `supabaseFilter` | Atjaunināt rindas, kas atbilst filtram |
| `upsert` | `supabaseTable`, `supabaseRows` vai automātiskā ievades kartēšana | Ievietot vai apvienot rindas, izmantojot Supabase upsert semantiku. Izmantojiet `supabaseOnConflict`, ja nepieciešams skaidrs konflikta mērķis. |
| `delete` | `supabaseTable`, `supabaseFilter` | Dzēst rindas, kas atbilst filtram |

## Filtra sintakse

`supabaseFilter` kompilē strukturētu JSON PostgREST vaicājuma parametros.

- Precīza atbilstība: `{"status":"active"}`
- Salīdzinājums: `{"created_at":{"gte":"2026-01-01"}}`
- Piederība kopai: `{"status":{"in":["active","paused"]}}`
- Šablona atbilstība: `{"email":{"ilike":"*@example.com"}}`
- Loģiskais OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Loģiskais AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Vairākiem operatoriem vienā laukā priekšroku dodiet loģiskajai grupai:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Lapošana

`select` tagad veic īstu servera puses lapošanu pret PostgREST.

- `supabaseLimit: "0"` iegūst visas atbilstošās rindas lapu pa lapai
- `supabaseLimit` vērtības virs 1000 automātiski sadalās vairākos pieprasījumos
- Rezultāti tiek apvienoti atpakaļ vienā `.rows` masīvā, un `.count` paliek kopējais atbilstošo rindu skaits

Lasot lielas tabulas, iestatiet stabilu `supabaseOrderBy`, lai lapu robežas būtu paredzamas.

## Automātiskā ievades kartēšana

Darbībām `insert`, `upsert` un `update` pārslēdziet mezglu uz **Auto-map input**, ja vienīgais
augšupējais mezgls jau izvada tādu formu, kādu vēlaties ierakstīt.

- Viens objekts kļūst par vienu rindu vai vienu atjaunināšanas payload
- Objektu masīvs kļūst par daudzām rindām darbībām `insert` / `upsert`
- Augšupējais objekts ar `rows` masīvu tieši izmanto šo masīvu
- `supabaseIgnoredInputFields` ļauj izlaist laukus, piemēram, `id`, `created_at` vai `success`
## Izvades atsauce

| Izvades lauks | Tips | Apraksts |
|-------------|------|-------------|
| `.rows` | array | Atgrieztie rindas objekti |
| `.count` | number | Atgriezto vai ietekmēto rindu skaits |
| `.success` | boolean | Vai darbība tika veiksmīgi izpildīta |

## Piemērs – Aktīvo lietotāju atlasīšana

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

Piekļuve izvadei: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Piemērs – Profila rindas upsert

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

## Saistītie resursi

- [Node tipi](../reference/node-types.md) – Visu node tipu pārskats
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Supabase akreditācijas datu pievienošana
- [Trešo pušu integrācijas](../reference/integrations.md) – Integrācijas akreditācijas datu iestatīšana
