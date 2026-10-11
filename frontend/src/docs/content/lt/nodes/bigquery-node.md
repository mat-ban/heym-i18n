# BigQuery

**BigQuery** mazgas vykdo SQL užklausas ir įterpia eiles į Google BigQuery duomenų rinkinius per BigQuery REST API v2. Naudokite jį didelių analitinių duomenų rinkinių užklausoms arba srautui eilių į lenteles iš workflow duomenų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | BigQuery (OAuth2) |
| Išvestis | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | BigQuery kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operacija: `query` arba `insertRows` |
| `bqProjectId` | expression | Google Cloud projekto ID (pvz., `my-gcp-project`) |
| `bqQuery` | expression | SQL užklausos eilutė. Privaloma `query` atveju. |
| `bqMaxResults` | string | Maksimalus eilių skaičius, grąžinamas `query` (numatytasis `1000`). |
| `bqDatasetId` | expression | Duomenų rinkinio ID (pvz., `my_dataset`). Privaloma `insertRows` atveju. |
| `bqTableId` | expression | Lentelės ID (pvz., `my_table`). Privaloma `insertRows` atveju. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows` atveju: **Raw** = visas JSON masyvas; **Selective** = viena eilė kaip raktų-vertės porų. |
| `bqRows` | expression | JSON masyvas su eilių objektais žaliuoju režimu (pvz., `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Raktų-vertės poros selektyviam režimui. Kiekvienas raktas yra stulpelio pavadinimas; kiekviena vertė yra išraiška. |

## Kredencialų Nustatymas

BigQuery naudoja **OAuth2 "Bring Your Own App"** modelį. Jūs pateikiate savo Google Cloud OAuth2 kredencialus.

**Backend konfigūracija:** Nustatykite **`FRONTEND_URL`** Heym backend'e į viešą programos URL (adresą, kurį vartotojai įveda naršyklėje), pvz., `https://your-heym-domain`. OAuth nukreipimo URI visada yra `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Eikite į [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → įgalinkite **BigQuery API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → pasirinkite **Web application**.
3. Po **Authorized redirect URIs** pridėkite tiksliai: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Nukopijuokite **Client ID** ir **Client Secret**.
5. Heym Dashboard → **Credentials** → **New** → pasirinkite **BigQuery (OAuth2)**.
6. Įveskite Client ID, Client Secret ir pavadinimą, tada spustelėkite **Connect**, kad užbaigtumėte OAuth2 sutikimą naršyklės iššokančiame lange.

Tokenai automatiškai atnaujinami fone — nereikia rankiniu būdu valdyti tokenų.

## Operacijos

| Operacija | Privalomi Laukai | Aprašymas |
|-----------|------------------|-----------|
| `query` | bqProjectId, bqQuery | Vykdo SQL užklausą ir grąžina eiles |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows arba bqMappings | Įterpia vieną ar daugiau eilių per srautinį insertAll API |

## Išvesties Nuoroda

| Operacija | Išvesties laukas | Tipas | Aprašymas |
|-----------|------------------|-------|-----------|
| `query` | `.rows` | array | Eilių objektų masyvas (stulpelio pavadinimas → vertė) |
| `query` | `.total` | number | Grąžintų eilių skaičius |
| `query` | `.schema` | array | Lentelės schemos laukai |
| `insertRows` | `.insertedCount` | number | Sėkmingai įterptų eilių skaičius |
| `insertRows` | `.errors` | array | Įterpimo klaidos pagal eilę (tuščia, jei viskas sėkminga) |

## Pavyzdys – Vykdyti Užklausą

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

Prieiga prie išvesties: `$getUsers.rows` (eilių objektų masyvas), `$getUsers.rows[0].email`, `$getUsers.total`.

## Pavyzdys – Įterpti Eilę

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

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Kredencialų Skirtukas](../tabs/credentials-tab.md) – Pridėti BigQuery OAuth2 kredencialą
- [Google Sheets](./google-sheets-node.md) – Panašus OAuth2 modelis skaičiuoklių duomenims
- [Trečiųjų Šalių Integracijos](../reference/integrations.md) – Integracijos kredencialų nustatymas
