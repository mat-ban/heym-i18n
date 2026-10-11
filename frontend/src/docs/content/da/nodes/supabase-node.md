# Supabase

**Supabase**-noden læser og ændrer tabeller eksponeret af et Supabase-projekts PostgREST API. Noden anvendes, når der er behov for workflow-adgang til SQL-baseret apptilstand uden manuelt at skrive HTTP-anmodninger.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Supabase |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operation: `select`, `insert`, `update`, `upsert` eller `delete` |
| `supabaseSchema` | expression | Skemanavn. Hvis tomt, anvender noden legitimationsoplysningernes standardskema, derefter `public`. |
| `supabaseTable` | expression | Enkelt tabellnavn til forespørgsel eller ændring. Skemaet placeres i `supabaseSchema`, ikke her. |
| `supabaseSelectColumns` | expression | Kommasepareret PostgREST-select-liste til `select` (standard `*`) |
| `supabaseFilter` | expression | JSON-filterobjekt. Understøtter nøjagtige matches samt operatorobjekter og logiske grupper, f.eks. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` eller `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksimalt antal rækker til `select` (`0` = hent alle matchende rækker med server-side paginering, negative værdier falder tilbage til `100`) |
| `supabaseOrderBy` | expression | Valgfri kolonne til sortering for `select` |
| `supabaseAscending` | boolean | Sorter stigende ved `true`, faldende ved `false` |
| `supabaseRowsInputMode` | string | Til `insert`/`upsert`: `raw` JSON-array-tilstand eller `auto` for automatisk at mappe det enkelte upstream-input |
| `supabaseDataInputMode` | string | Til `update`: `raw` JSON-objekt-tilstand eller `auto` for automatisk at mappe det enkelte upstream-input |
| `supabaseIgnoredInputFields` | string | Valgfri kommasepareret liste over feltnavne, der skal udelades under automatisk mapping af inputdata |
| `supabaseRows` | expression | JSON-array med rækkeobjekter til `insert` og `upsert` |
| `supabaseOnConflict` | expression | Valgfri kommasepareret liste over konflikttarget-kolonner til `upsert`, f.eks. `id` eller `tenant_id,email` |
| `supabaseData` | expression | JSON-objekt med opdaterede kolonneværdier til `update` |

## Opsætning af legitimationsoplysninger

Opret **Supabase**-legitimationsoplysninger under fanen [Legitimationsoplysninger](../tabs/credentials-tab.md) med:

1. **Project URL**, f.eks. `https://your-project.supabase.co`
2. En **API-nøgle** med adgang til de tabeller, workflowet skal bruge
3. Et valgfrit **default schema** (standard er `public`)

Noden kommunikerer med Supabase PostgREST-endpointet på `/rest/v1/<table>`.  
Brug `supabaseTable` kun til tabellen, f.eks. `users` eller `profiles`. Undlad at angive `schema.table`, `rpc/...` eller andre API-stier her.

Når der vælges gyldige Supabase-legitimationsoplysninger, kan editoren opdage eksponerede tabeller og tabelkolonner direkte fra PostgREST OpenAPI-metadata. Brug dropdown-menuen **discovered tables** til at vælge en tabel og **column chips** under **Select Columns** til hurtigt at opbygge en select-liste.

## Operationer

| Operation | Påkrævede felter | Beskrivelse |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Læs rækker med valgfrie nøjagtige matches-filtre, grænse og sortering |
| `insert` | `supabaseTable`, `supabaseRows` eller auto-map input | Indsæt en eller flere rækker |
| `update` | `supabaseTable`, `supabaseData` eller auto-map input, `supabaseFilter` | Opdater rækker, der matcher filtret |
| `upsert` | `supabaseTable`, `supabaseRows` eller auto-map input | Indsæt eller flet rækker ved brug af Supabase-upsert-semantik. Brug `supabaseOnConflict`, når der er behov for et eksplicit konflikttarget. |
| `delete` | `supabaseTable`, `supabaseFilter` | Slet rækker, der matcher filtret |

## Filtersyntaks

`supabaseFilter` kompilerer struktureret JSON til PostgREST-forespørgselsparametre.

- Nøjagtigt match: `{"status":"active"}`
- Sammenligning: `{"created_at":{"gte":"2026-01-01"}}`
- Medlemskab: `{"status":{"in":["active","paused"]}}`
- Mønstermatch: `{"email":{"ilike":"*@example.com"}}`
- Logisk OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logisk AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Ved flere operatorer på samme felt foretrækkes en logisk gruppe:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginering

`select` udfører nu ægte server-side paginering mod PostgREST.

- `supabaseLimit: "0"` henter alle matchende rækker side for side
- `supabaseLimit`-værdier over 1000 udvides automatisk til flere anmodninger
- Resultater flettes tilbage til et enkelt `.rows`-array, og `.count` viser det samlede antal matchende rækker

Ved læsning af store tabeller anbefales det at angive en stabil `supabaseOrderBy` for at sikre forudsigelige sidegrænser.

## Automatisk mapping af input

Til `insert`, `upsert` og `update` kan noden skiftes til **Auto-map input**, når den enkelte upstream-node allerede outputter den ønskede struktur.

- Et enkelt objekt bliver til én række eller én opdaterings-payload
- Et array af objekter bliver til flere rækker til `insert` / `upsert`
- Et upstream-objekt med et `rows`-array genbruger dette array direkte
- `supabaseIgnoredInputFields` gør det muligt at udelade felter som `id`, `created_at` eller `success`
## Output Reference

| Output field | Type | Beskrivelse |
|-------------|------|-------------|
| `.rows` | array | Returnerede rækkeobjekter |
| `.count` | number | Antal returnerede eller påvirkede rækker |
| `.success` | boolean | Angiver om operationen lykkedes |

## Eksempel – Vælg Aktive Brugere

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

Adgang til output: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Eksempel – Upsert en Profilrække

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

## Relateret

- [Node Types](../reference/node-types.md) – Oversigt over alle node-typer
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj Supabase-legitimationsoplysninger
- [Third-Party Integrations](../reference/integrations.md) – Opsætning af integrationslegitimationsoplysninger
