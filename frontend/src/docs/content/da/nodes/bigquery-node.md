# BigQuery

**BigQuery**-noden udfører SQL-forespørgsler og indsætter rækker i Google BigQuery-datasæt via BigQuery REST API v2. Den kan bruges til at forespørge store analytiske datasæt eller streame rækker ind i tabeller fra workflow-data.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | BigQuery (OAuth2) |
| Output | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operation: `query` eller `insertRows` |
| `bqProjectId` | udtryk | Google Cloud-projekt-ID (f.eks. `my-gcp-project`) |
| `bqQuery` | udtryk | SQL-forespørgselsstreng. Påkrævet for `query`. |
| `bqMaxResults` | string | Maksimalt antal rækker returneret af `query` (standard `1000`). |
| `bqDatasetId` | udtryk | Datasæt-ID (f.eks. `my_dataset`). Påkrævet for `insertRows`. |
| `bqTableId` | udtryk | Tabel-ID (f.eks. `my_table`). Påkrævet for `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | For `insertRows`: **Raw** = fuld JSON-array; **Selective** = enkelt række som nøgle-værdi-felter. |
| `bqRows` | udtryk | JSON-array af rækkeobjekter for raw mode (f.eks. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Nøgle-værdi-par for selective mode. Hver nøgle er en kolonnenavn; hver værdi er et udtryk. |

## Opsætning af Legitimationsoplysninger

BigQuery bruger en **OAuth2 "Bring Your Own App"**-model. Der skal angives egne Google Cloud OAuth2-legitimationsoplysninger.

**Backend-konfiguration:** Sæt **`FRONTEND_URL`** på Heym-backenden til appens offentlige URL (adressen, som brugeren indtaster i browseren), f.eks. `https://your-heym-domain`. OAuth-omdirigerings-URI'en er altid `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Gå til [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiver **BigQuery API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → vælg **Web application**.
3. Under **Authorized redirect URIs**, tilføj præcist: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopier **Client ID** og **Client Secret**.
5. I Heym Dashboard → **Legitimationsoplysninger** → **Ny** → vælg **BigQuery (OAuth2)**.
6. Indtast Client ID, Client Secret og et navn, og klik derefter på **Forbind** for at fuldføre OAuth2-samtykke i en browser-popup.

Tokens opdateres automatisk i baggrunden – ingen manuel tokenhåndtering er nødvendig.

## Operationer

| Operation | Påkrævede Felter | Beskrivelse |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Udfør en SQL-forespørgsel og returner rækker |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows eller bqMappings | Indsæt en eller flere rækker via streaming insertAll API |

## Output-reference

| Operation | Output-felt | Type | Beskrivelse |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array af rækkeobjekter (kolonnenavn → værdi) |
| `query` | `.total` | number | Antal returnerede rækker |
| `query` | `.schema` | array | Tabelskema-felter |
| `insertRows` | `.insertedCount` | number | Antal rækker, der er indsat succesfuldt |
| `insertRows` | `.errors` | array | Indsætningsfejl pr. række (tom ved fuld succes) |

## Eksempel – Udfør en Forespørgsel

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Adgang til output: `$getUsers.rows` (array af rækkeobjekter), `$getUsers.rows[0].email`, `$getUsers.total`.

## Eksempel – Indsæt en Række

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj BigQuery OAuth2-legitimationsoplysninger
- [Google Sheets](./google-sheets-node.md) – Lignende OAuth2-mønster for regnearksdata
- [Tredjepartsintegrationer](../reference/integrations.md) – Opsætning af integrationslegitimationsoplysninger
