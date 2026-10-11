# BigQuery

**BigQuery** mezgls izpilda SQL vaicājumus un ievieto rindas Google BigQuery datu kopās, izmantojot BigQuery REST API v2. Izmantojiet to, lai vaicātu lielas analītiskās datu kopas vai straumētu rindas tabulās no workflow datiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | BigQuery (OAuth2) |
| Izvade | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `bqOperation` | string | Darbība: `query` vai `insertRows` |
| `bqProjectId` | expression | Google Cloud projekta ID (piem., `my-gcp-project`) |
| `bqQuery` | expression | SQL vaicājuma virkne. Nepieciešams `query` darbībai. |
| `bqMaxResults` | string | Maksimālais rindu skaits, ko atgriež `query` (noklusējums `1000`). |
| `bqDatasetId` | expression | Datu kopas ID (piem., `my_dataset`). Nepieciešams `insertRows` darbībai. |
| `bqTableId` | expression | Tabulas ID (piem., `my_table`). Nepieciešams `insertRows` darbībai. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows` darbībai: **Raw** = pilns JSON masīvs; **Selective** = viena rinda kā atslēgas-vērtības lauku pāri. |
| `bqRows` | expression | JSON masīvs ar rindas objektiem raw režīmā (piem., `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Atslēgas-vērtības pāri selective režīmam. Katra atslēga ir kolonnas nosaukums; katra vērtība ir izteiksme. |

## Akreditācijas datu iestatīšana

BigQuery izmanto **OAuth2 "Bring Your Own App"** modeli. Jūs nodrošināt savus Google Cloud OAuth2 akreditācijas datus.

**Backend konfigurācija:** Iestatiet **`FRONTEND_URL`** Heym backendā uz lietotnes publisko URL (adrese, ko lietotāji ieraksta pārlūkā), piem., `https://your-heym-domain`. OAuth novirzīšanas URI vienmēr ir `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Dodieties uz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → iespējojiet **BigQuery API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → izvēlieties **Web application**.
3. Sadaļā **Authorized redirect URIs** pievienojiet precīzi: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Nokopējiet **Client ID** un **Client Secret**.
5. Heym Dashboard → **Akreditācijas dati** → **New** → izvēlieties **BigQuery (OAuth2)**.
6. Ievadiet Client ID, Client Secret un nosaukumu, pēc tam noklikšķiniet uz **Connect**, lai pabeigtu OAuth2 piekrišanu pārlūka uznirstošajā logā.

Token atjaunojas automātiski fonā — manuāla token pārvaldība nav nepieciešama.

## Darbības

| Darbība | Nepieciešamie lauki | Apraksts |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Izpilda SQL vaicājumu un atgriež rindas |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows vai bqMappings | Ievieto vienu vai vairākas rindas, izmantojot straumēšanas insertAll API |

## Izvades atsauce

| Darbība | Izvades lauks | Tips | Apraksts |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Rindas objektu masīvs (kolonnas nosaukums → vērtība) |
| `query` | `.total` | number | Atgriezto rindu skaits |
| `query` | `.schema` | array | Tabulas shēmas lauki |
| `insertRows` | `.insertedCount` | number | Veiksmīgi ievietoto rindu skaits |
| `insertRows` | `.errors` | array | Ievietošanas kļūdas katrai rindai (tukšs, ja viss veiksmīgi) |

## Piemērs – Vaicājuma izpilde

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

Piekļuve izvadei: `$getUsers.rows` (rindas objektu masīvs), `$getUsers.rows[0].email`, `$getUsers.total`.

## Piemērs – Rindas ievietošana

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

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet BigQuery OAuth2 akreditācijas datus
- [Google Sheets](./google-sheets-node.md) – Līdzīgs OAuth2 modelis izklājlapu datiem
- [Trešo pušu integrācijas](../reference/integrations.md) – Integrācijas akreditācijas datu iestatīšana
