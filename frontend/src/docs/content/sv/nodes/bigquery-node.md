# BigQuery

**BigQuery**-noden kör SQL-frågor och infogar rader i Google BigQuery-datamängder via BigQuery REST API v2. Den används för att fråga stora analytiska datamängder eller strömma rader till tabeller från workflow-data.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | BigQuery (OAuth2) |
| Utdata | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | BigQuery-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `bqOperation` | string | Åtgärd: `query` eller `insertRows` |
| `bqProjectId` | expression | Google Cloud-projekt-ID (t.ex. `my-gcp-project`) |
| `bqQuery` | expression | SQL-frågesträng. Krävs för `query`. |
| `bqMaxResults` | string | Max antal rader som returneras av `query` (standard `1000`). |
| `bqDatasetId` | expression | Datamängds-ID (t.ex. `my_dataset`). Krävs för `insertRows`. |
| `bqTableId` | expression | Tabell-ID (t.ex. `my_table`). Krävs för `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | För `insertRows`: **Raw** = fullständig JSON-array; **Selective** = en enskild rad som nyckel-värde-fältpar. |
| `bqRows` | expression | JSON-array med radobjekt för raw-läge (t.ex. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Nyckel-värde-par för selective-läge. Varje nyckel är ett kolumnnamn; varje värde är ett uttryck. |

## Konfiguration av autentiseringsuppgifter

BigQuery använder en **OAuth2-modell av typen "Bring Your Own App"**. Egna OAuth2-uppgifter från Google Cloud tillhandahålls.

**Backend-konfiguration:** Ange **`FRONTEND_URL`** på Heym-backenden till appens publika URL (adressen som användare skriver i webbläsaren), t.ex. `https://your-heym-domain`. OAuth-omdirigerings-URI:n är alltid `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Gå till [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktivera **BigQuery API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → välj **Web application**.
3. Under **Authorized redirect URIs**, lägg till exakt: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopiera **Client ID** och **Client Secret**.
5. I Heym Dashboard → **Autentiseringsuppgifter** → **Ny** → välj **BigQuery (OAuth2)**.
6. Ange Client ID, Client Secret och ett namn, klicka sedan på **Connect** för att slutföra OAuth2-samtycket i en webbläsar-popup.

Token förnyas automatiskt i bakgrunden — ingen manuell token-hantering krävs.

## Åtgärder

| Åtgärd | Obligatoriska fält | Beskrivning |
|--------|--------------------|-------------|
| `query` | bqProjectId, bqQuery | Kör en SQL-fråga och returnera rader |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows eller bqMappings | Infoga en eller flera rader via streaming-API:et insertAll |

## Referens för utdata

| Åtgärd | Utdatafält | Typ | Beskrivning |
|--------|------------|-----|-------------|
| `query` | `.rows` | array | Array med radobjekt (kolumnnamn → värde) |
| `query` | `.total` | number | Antal returnerade rader |
| `query` | `.schema` | array | Tabellschemafält |
| `insertRows` | `.insertedCount` | number | Antal rader som infogats korrekt |
| `insertRows` | `.errors` | array | Infogningsfel per rad (tom vid fullständig framgång) |

## Exempel – Kör en fråga

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

Åtkomst till utdata: `$getUsers.rows` (array med radobjekt), `$getUsers.rows[0].email`, `$getUsers.total`.

## Exempel – Infoga en rad

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till BigQuery OAuth2-autentiseringsuppgift
- [Google Sheets](./google-sheets-node.md) – Liknande OAuth2-mönster för kalkylbladsdata
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfiguration av integrationsautentiseringsuppgifter
