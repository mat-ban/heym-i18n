# BigQuery

A **BigQuery** csomópont SQL-lekérdezéseket futtat, és sorokat szúr be Google BigQuery adathalmazokba a BigQuery REST API v2-n keresztül. Használja nagy analitikai adathalmazok lekérdezéséhez vagy sorok streameléséhez táblákba workflow-adatokból.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | BigQuery (OAuth2) |
| Kimenet | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery hitelesítési adatok a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `bqOperation` | string | Művelet: `query` vagy `insertRows` |
| `bqProjectId` | expression | Google Cloud projekt ID (pl. `my-gcp-project`) |
| `bqQuery` | expression | SQL-lekérdezés szövege. A `query` művelethez kötelező. |
| `bqMaxResults` | string | A `query` által visszaadott sorok maximális száma (alapértelmezett `1000`). |
| `bqDatasetId` | expression | Adathalmaz ID (pl. `my_dataset`). Az `insertRows` művelethez kötelező. |
| `bqTableId` | expression | Tábla ID (pl. `my_table`). Az `insertRows` művelethez kötelező. |
| `bqRowsInputMode` | `raw` \| `selective` | Az `insertRows` művelethez: **Raw** = teljes JSON-tömb; **Selective** = egyetlen sor kulcs-érték mezőpárokként. |
| `bqRows` | expression | Sorobjektumok JSON-tömbje raw módhoz (pl. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Kulcs-érték párok selective módhoz. Minden kulcs egy oszlopnév; minden érték egy kifejezés. |

## Hitelesítési adatok beállítása

A BigQuery **OAuth2 "Bring Your Own App"** modellt használ. Ön biztosítja a saját Google Cloud OAuth2 hitelesítési adatait.

**Backend konfiguráció:** Állítsa be a **`FRONTEND_URL`** értéket a Heym backendben az alkalmazás nyilvános URL-jére (arra a címre, amelyet a felhasználók a böngészőben beírnak), pl. `https://your-heym-domain`. Az OAuth átirányítási URI mindig `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Enable APIs** → engedélyezze a **BigQuery API**-t.
2. Nyissa meg a **Credentials** → **Create Credentials** → **OAuth client ID** → válassza a **Web application** lehetőséget.
3. Az **Authorized redirect URIs** alatt pontosan adja hozzá: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Másolja ki a **Client ID** és **Client Secret** értékeket.
5. A Heym Dashboardon → **Credentials** → **New** → válassza a **BigQuery (OAuth2)** lehetőséget.
6. Adja meg a Client ID, Client Secret értékeket és egy nevet, majd kattintson a **Connect** gombra az OAuth2 hozzájárulás böngésző felugró ablakban történő befejezéséhez.

A tokenek automatikusan frissülnek a háttérben — nincs szükség manuális token-kezelésre.

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | SQL-lekérdezés futtatása és sorok visszaadása |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows vagy bqMappings | Egy vagy több sor beszúrása a streaming insertAll API-n keresztül |

## Kimenet referenciája

| Művelet | Kimeneti mező | Típus | Leírás |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Sorobjektumok tömbje (oszlopnév → érték) |
| `query` | `.total` | number | Visszaadott sorok száma |
| `query` | `.schema` | array | Tábla séma mezői |
| `insertRows` | `.insertedCount` | number | Sikeresen beszúrt sorok száma |
| `insertRows` | `.errors` | array | Soronkénti beszúrási hibák (üres teljes siker esetén) |

## Példa – Lekérdezés futtatása

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

Kimenet elérése: `$getUsers.rows` (sorobjektumok tömbje), `$getUsers.rows[0].email`, `$getUsers.total`.

## Példa – Sor beszúrása

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok fül](../tabs/credentials-tab.md) – BigQuery OAuth2 hitelesítési adatok hozzáadása
- [Google Sheets](./google-sheets-node.md) – Hasonló OAuth2 minta táblázatadatokhoz
- [Külső integrációk](../reference/integrations.md) – Integrációs hitelesítési adatok beállítása
