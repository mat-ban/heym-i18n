# BigQuery

**BigQuery** node käivitab SQL-päringuid ja lisab ridu Google BigQuery andmestikesse BigQuery REST API v2 kaudu. Kasutage seda suurte analüütiliste andmestike pärimiseks või ridade voogedastamiseks tabelitesse workflow'de andmetest.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | BigQuery (OAuth2) |
| Väljund | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `bqOperation` | string | Toiming: `query` või `insertRows` |
| `bqProjectId` | expression | Google Cloud projekti ID (nt `my-gcp-project`) |
| `bqQuery` | expression | SQL-päringu string. Nõutav `query` puhul. |
| `bqMaxResults` | string | Maksimaalne ridade arv, mille `query` tagastab (vaikimisi `1000`). |
| `bqDatasetId` | expression | Andmestiku ID (nt `my_dataset`). Nõutav `insertRows` puhul. |
| `bqTableId` | expression | Tabeli ID (nt `my_table`). Nõutav `insertRows` puhul. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows` puhul: **Raw** = täielik JSON-massiiv; **Selective** = üksik rida võtme-väärtuse väljapaaridena. |
| `bqRows` | expression | Reaobjektide JSON-massiiv raw-režiimis (nt `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Võtme-väärtuse paarid selective-režiimis. Iga võti on veeru nimi; iga väärtus on avaldis. |

## Mandaadi seadistamine

BigQuery kasutab **OAuth2 "Bring Your Own App"** mudelit. Esitate oma Google Cloud OAuth2 mandaadid.

**Backend konfiguratsioon:** Määrake **`FRONTEND_URL`** Heymi backendil rakenduse avalikuks URL-iks (aadress, mille kasutajad brauserisse sisestavad), nt `https://your-heym-domain`. OAuth ümbersuunamise URI on alati `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Minge [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → lubage **BigQuery API**.
2. Minge **Credentials** → **Create Credentials** → **OAuth client ID** → valige **Web application**.
3. Jaotises **Authorized redirect URIs** lisage täpselt: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopeerige **Client ID** ja **Client Secret**.
5. Heymi töölaual → **Mandaadid** → **Uus** → valige **BigQuery (OAuth2)**.
6. Sisestage Client ID, Client Secret ja nimi, seejärel klõpsake **Connect**, et lõpetada OAuth2 nõusolek brauseri hüpikaknas.

Tokenid uuendatakse automaatselt taustal — käsitsi tokenite haldamine pole vajalik.

## Toimingud

| Toiming | Nõutavad väljad | Kirjeldus |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Käivitab SQL-päringu ja tagastab read |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows või bqMappings | Lisab ühe või mitu rida voogedastuse insertAll API kaudu |

## Väljundi viide

| Toiming | Väljundi väli | Tüüp | Kirjeldus |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Reaobjektide massiiv (veeru nimi → väärtus) |
| `query` | `.total` | number | Tagastatud ridade arv |
| `query` | `.schema` | array | Tabeli skeemi väljad |
| `insertRows` | `.insertedCount` | number | Edukalt lisatud ridade arv |
| `insertRows` | `.errors` | array | Lisamise vead rea kohta (tühi täieliku õnnestumise korral) |

## Näide – päringu käivitamine

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

Väljundile juurdepääs: `$getUsers.rows` (reaobjektide massiiv), `$getUsers.rows[0].email`, `$getUsers.total`.

## Näide – rea lisamine

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

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Credentials Tab](../tabs/credentials-tab.md) – BigQuery OAuth2 mandaadi lisamine
- [Google Sheets](./google-sheets-node.md) – Sarnane OAuth2 muster tabeliandmete jaoks
- [Third-Party Integrations](../reference/integrations.md) – Integratsiooni mandaadi seadistamine
