# BigQuery

De **BigQuery**-node voert SQL-query's uit en voegt rijen in Google BigQuery-datasets in via de BigQuery REST API v2. Gebruik deze node om grote analytische datasets te bevragen of rijen vanuit workflowgegevens naar tabellen te streamen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | BigQuery (OAuth2) |
| Uitvoer | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `bqOperation` | string | Bewerking: `query` of `insertRows` |
| `bqProjectId` | expression | Google Cloud-project-ID (bijv. `my-gcp-project`) |
| `bqQuery` | expression | SQL-queryreeks. Vereist voor `query`. |
| `bqMaxResults` | string | Maximaal aantal rijen dat door `query` wordt geretourneerd (standaard `1000`). |
| `bqDatasetId` | expression | Dataset-ID (bijv. `my_dataset`). Vereist voor `insertRows`. |
| `bqTableId` | expression | Tabel-ID (bijv. `my_table`). Vereist voor `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Voor `insertRows`: **Raw** = volledige JSON-array; **Selective** = één rij als key-value-veldparen. |
| `bqRows` | expression | JSON-array met rij-objecten voor raw-modus (bijv. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Key-value-paren voor selective-modus. Elke key is een kolomnaam; elke value is een expressie. |

## Referentie instellen

BigQuery gebruikt een **OAuth2 "Bring Your Own App"**-model. U levert uw eigen Google Cloud OAuth2-referenties aan.

**Backend-configuratie:** Stel **`FRONTEND_URL`** op de Heym-backend in op de openbare URL van de applicatie (het adres dat gebruikers in de browser invoeren), bijv. `https://your-heym-domain`. De OAuth-redirect-URI is altijd `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Ga naar [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → schakel **BigQuery API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → selecteer **Web application**.
3. Voeg onder **Authorized redirect URIs** exact het volgende toe: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopieer het **Client ID** en **Client Secret**.
5. Ga in het Heym Dashboard naar **Referenties** → **Nieuw** → selecteer **BigQuery (OAuth2)**.
6. Voer het Client ID, Client Secret en een naam in en klik op **Connect** om de OAuth2-toestemming in een browserpop-up te voltooien.

Tokens worden automatisch op de achtergrond vernieuwd — handmatig tokenbeheer is niet nodig.

## Bewerkingen

| Bewerking | Vereiste velden | Beschrijving |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Voer een SQL-query uit en retourneer rijen |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows of bqMappings | Voeg één of meer rijen in via de streaming insertAll API |

## Uitvoerreferentie

| Bewerking | Uitvoerveld | Type | Beschrijving |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array met rij-objecten (kolomnaam → waarde) |
| `query` | `.total` | number | Aantal geretourneerde rijen |
| `query` | `.schema` | array | Velden van het tabelschema |
| `insertRows` | `.insertedCount` | number | Aantal succesvol ingevoegde rijen |
| `insertRows` | `.errors` | array | Invoegfouten per rij (leeg bij volledig succes) |

## Voorbeeld – Een query uitvoeren

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

Toegang tot uitvoer: `$getUsers.rows` (array met rij-objecten), `$getUsers.rows[0].email`, `$getUsers.total`.

## Voorbeeld – Een rij invoegen

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

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Credentials Tab](../tabs/credentials-tab.md) – BigQuery OAuth2-referentie toevoegen
- [Google Sheets](./google-sheets-node.md) – Vergelijkbaar OAuth2-patroon voor spreadsheetgegevens
- [Third-Party Integrations](../reference/integrations.md) – Integratiereferentie instellen
