# Supabase

De **Supabase**-node leest en muteert tabellen die worden ontsloten door de PostgREST API van een Supabase-project. Gebruik deze wanneer u vanuit een workflow toegang wilt tot SQL-backed app-state zonder handmatig HTTP-verzoeken te schrijven.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Supabase |
| Uitvoer | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Bewerking: `select`, `insert`, `update`, `upsert` of `delete` |
| `supabaseSchema` | expression | Schemanaam. Indien leeg gebruikt de node het standaardschema van de referentie, vervolgens `public`. |
| `supabaseTable` | expression | Eenvoudige tabelnaam om te bevragen of te muteren. Plaats het schema in `supabaseSchema`, niet hier. |
| `supabaseSelectColumns` | expression | Door komma's gescheiden PostgREST-selectlijst voor `select` (standaard `*`) |
| `supabaseFilter` | expression | JSON-filterobject. Ondersteunt exacte overeenkomsten plus operator-objecten en logische groepen, bijvoorbeeld `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` of `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maximaal aantal rijen dat wordt geretourneerd voor `select` (`0` = alle overeenkomende rijen ophalen met server-side paginering, negatieve waarden vallen terug op `100`) |
| `supabaseOrderBy` | expression | Optionele kolom om op te sorteren voor `select` |
| `supabaseAscending` | boolean | Oplopend sorteren bij `true`, aflopend bij `false` |
| `supabaseRowsInputMode` | string | Voor `insert`/`upsert`: `raw` JSON-array-modus of `auto` om de enkele upstream-invoer automatisch te mappen |
| `supabaseDataInputMode` | string | Voor `update`: `raw` JSON-object-modus of `auto` om de enkele upstream-invoer automatisch te mappen |
| `supabaseIgnoredInputFields` | string | Optionele door komma's gescheiden veldnamen om weg te laten tijdens het automatisch mappen van invoergegevens |
| `supabaseRows` | expression | JSON-array van rij-objecten voor `insert` en `upsert` |
| `supabaseOnConflict` | expression | Optionele door komma's gescheiden conflict-doelkolommen voor `upsert`, bijvoorbeeld `id` of `tenant_id,email` |
| `supabaseData` | expression | JSON-object van bijgewerkte kolomwaarden voor `update` |

## Referentie instellen

Maak een **Supabase**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md) met:

1. Uw **Project-URL**, bijvoorbeeld `https://your-project.supabase.co`
2. Een **API-sleutel** met toegang tot de tabellen die deze workflow moet gebruiken
3. Een optioneel **standaardschema** (standaard `public`)

De node communiceert met het Supabase PostgREST-endpoint op `/rest/v1/<table>`.
Gebruik `supabaseTable` alleen voor de tabel, zoals `users` of `profiles`. Geef daar geen `schema.table`, `rpc/...` of andere API-paden door.

Wanneer een geldige Supabase-referentie is geselecteerd, kan de editor ontsloten tabellen en tabelkolommen rechtstreeks ontdekken vanuit de PostgREST OpenAPI-metadata. Gebruik de dropdown **discovered tables** om een tabel te kiezen en de **column chips** onder **Select Columns** om snel een selectlijst op te bouwen.

## Bewerkingen

| Bewerking | Verplichte velden | Beschrijving |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Rijen lezen met optionele exacte-match-filters, limiet en sortering |
| `insert` | `supabaseTable`, `supabaseRows` of auto-map invoer | Een of meer rijen invoegen |
| `update` | `supabaseTable`, `supabaseData` of auto-map invoer, `supabaseFilter` | Rijen bijwerken die overeenkomen met het filter |
| `upsert` | `supabaseTable`, `supabaseRows` of auto-map invoer | Rijen invoegen of samenvoegen met Supabase upsert-semantiek. Gebruik `supabaseOnConflict` wanneer u een expliciet conflict-doel nodig hebt. |
| `delete` | `supabaseTable`, `supabaseFilter` | Rijen verwijderen die overeenkomen met het filter |

## Filtersyntaxis

`supabaseFilter` compileert gestructureerde JSON naar PostgREST-queryparameters.

- Exacte overeenkomst: `{"status":"active"}`
- Vergelijking: `{"created_at":{"gte":"2026-01-01"}}`
- Lidmaatschap: `{"status":{"in":["active","paused"]}}`
- Patroonovereenkomst: `{"email":{"ilike":"*@example.com"}}`
- Logische OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logische AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Gebruik voor meerdere operators op hetzelfde veld bij voorkeur een logische groep:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginering

`select` voert nu echte server-side paginering uit tegen PostgREST.

- `supabaseLimit: "0"` haalt alle overeenkomende rijen pagina voor pagina op
- `supabaseLimit`-waarden boven 1000 worden automatisch verdeeld over meerdere verzoeken
- Resultaten worden samengevoegd tot één `.rows`-array en `.count` blijft het totale aantal overeenkomende rijen

Stel bij het lezen van grote tabellen een stabiele `supabaseOrderBy` in om paginagrenzen voorspelbaar te houden.

## Invoer automatisch mappen

Schakel voor `insert`, `upsert` en `update` de node over naar **Auto-map input** wanneer de enkele
upstream-node al de vorm uitvoert die u wilt wegschrijven.

- Een enkel object wordt één rij of één update-payload
- Een array van objecten wordt meerdere rijen voor `insert` / `upsert`
- Een upstream-object met een `rows`-array hergebruikt die array rechtstreeks
- Met `supabaseIgnoredInputFields` kunt u velden zoals `id`, `created_at` of `success` weglaten
## Uitvoerreferentie

| Uitvoerveld | Type | Beschrijving |
|-------------|------|-------------|
| `.rows` | array | Geretourneerde rij-objecten |
| `.count` | number | Aantal geretourneerde of beïnvloede rijen |
| `.success` | boolean | Of de bewerking is geslaagd |

## Voorbeeld – Actieve gebruikers selecteren

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

Uitvoer openen: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Voorbeeld – Een profielrij upserten

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

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Referenties-tab](../tabs/credentials-tab.md) – Supabase-referenties toevoegen
- [Integraties van derden](../reference/integrations.md) – Referentieconfiguratie voor integraties
