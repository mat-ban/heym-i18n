# BigQuery

Uzol **BigQuery** spúšťa SQL dotazy a vkladá riadky do datasetov Google BigQuery prostredníctvom BigQuery REST API v2. Použite ho na dotazovanie veľkých analytických datasetov alebo na streamovanie riadkov do tabuliek z dát workflowu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | BigQuery (OAuth2) |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje BigQuery z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operácia: `query` alebo `insertRows` |
| `bqProjectId` | expression | ID projektu Google Cloud (napr. `my-gcp-project`) |
| `bqQuery` | expression | Reťazec SQL dotazu. Vyžaduje sa pre `query`. |
| `bqMaxResults` | string | Maximálny počet riadkov vrátených operáciou `query` (predvolené `1000`). |
| `bqDatasetId` | expression | ID datasetu (napr. `my_dataset`). Vyžaduje sa pre `insertRows`. |
| `bqTableId` | expression | ID tabuľky (napr. `my_table`). Vyžaduje sa pre `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Pre `insertRows`: **Raw** = celé JSON pole; **Selective** = jeden riadok ako páry kľúč-hodnota. |
| `bqRows` | expression | JSON pole objektov riadkov pre režim raw (napr. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Páry kľúč-hodnota pre režim selective. Každý kľúč je názov stĺpca; každá hodnota je výraz. |

## Nastavenie prihlasovacích údajov

BigQuery používa model **OAuth2 "Bring Your Own App"**. Poskytujete vlastné prihlasovacie údaje Google Cloud OAuth2.

**Konfigurácia backendu:** Nastavte **`FRONTEND_URL`** na backende Heym na verejnú URL aplikácie (adresa, ktorú používatelia zadávajú do prehliadača), napr. `https://your-heym-domain`. OAuth redirect URI je vždy `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Prejdite do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povoľte **BigQuery API**.
2. Prejdite do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V časti **Authorized redirect URIs** pridajte presne: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Skopírujte **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Prihlasovacie údaje** → **Nové** → vyberte **BigQuery (OAuth2)**.
6. Zadajte Client ID, Client Secret a názov, potom kliknite na **Connect** na dokončenie OAuth2 súhlasu vo vyskakovacom okne prehliadača.

Tokeny sa automaticky obnovujú na pozadí — nie je potrebná manuálna správa tokenov.

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Spustí SQL dotaz a vráti riadky |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows alebo bqMappings | Vloží jeden alebo viac riadkov prostredníctvom streaming API insertAll |

## Referencia výstupu

| Operácia | Výstupné pole | Typ | Popis |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Pole objektov riadkov (názov stĺpca → hodnota) |
| `query` | `.total` | number | Počet vrátených riadkov |
| `query` | `.schema` | array | Polia schémy tabuľky |
| `insertRows` | `.insertedCount` | number | Počet úspešne vložených riadkov |
| `insertRows` | `.errors` | array | Chyby vkladania pre jednotlivé riadky (prázdne pri úplnom úspechu) |

## Príklad – Spustenie dotazu

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

Prístup k výstupu: `$getUsers.rows` (pole objektov riadkov), `$getUsers.rows[0].email`, `$getUsers.total`.

## Príklad – Vloženie riadka

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Podobný OAuth2 vzor pre údaje tabuliek
- [Integrácie tretích strán](../reference/integrations.md) – Nastavenie prihlasovacích údajov integrácie
