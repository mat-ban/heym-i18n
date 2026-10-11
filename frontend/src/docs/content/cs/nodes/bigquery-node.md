# BigQuery

Uzel **BigQuery** spouští SQL dotazy a vkládá řádky do datasetů Google BigQuery prostřednictvím BigQuery REST API v2. Použijte jej k dotazování rozsáhlých analytických datasetů nebo k streamování řádků do tabulek z dat workflow.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | BigQuery (OAuth2) |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje BigQuery z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operace: `query` nebo `insertRows` |
| `bqProjectId` | expression | ID projektu Google Cloud (např. `my-gcp-project`) |
| `bqQuery` | expression | Řetězec SQL dotazu. Vyžadováno pro `query`. |
| `bqMaxResults` | string | Maximální počet řádků vrácených operací `query` (výchozí `1000`). |
| `bqDatasetId` | expression | ID datasetu (např. `my_dataset`). Vyžadováno pro `insertRows`. |
| `bqTableId` | expression | ID tabulky (např. `my_table`). Vyžadováno pro `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Pro `insertRows`: **Raw** = celé pole JSON; **Selective** = jeden řádek jako páry pole-hodnota. |
| `bqRows` | expression | Pole JSON s objekty řádků pro režim raw (např. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Páry klíč-hodnota pro režim selective. Každý klíč je název sloupce; každá hodnota je výraz. |

## Nastavení přihlašovacích údajů

BigQuery používá model **OAuth2 "Bring Your Own App"**. Poskytujete vlastní přihlašovací údaje OAuth2 pro Google Cloud.

**Konfigurace backendu:** Nastavte **`FRONTEND_URL`** na backendu Heym na veřejnou URL aplikace (adresa, kterou uživatelé zadávají do prohlížeče), např. `https://your-heym-domain`. URI přesměrování OAuth je vždy `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Přejděte do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povolte **BigQuery API**.
2. Přejděte do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V části **Authorized redirect URIs** přidejte přesně: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Zkopírujte **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Přihlašovací údaje** → **Nový** → vyberte **BigQuery (OAuth2)**.
6. Zadejte Client ID, Client Secret a název, poté klikněte na **Connect** pro dokončení souhlasu OAuth2 ve vyskakovacím okně prohlížeče.

Tokeny se automaticky obnovují na pozadí — není vyžadována žádná ruční správa tokenů.

## Operace

| Operace | Povinná pole | Popis |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Spustí SQL dotaz a vrátí řádky |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows nebo bqMappings | Vloží jeden nebo více řádků prostřednictvím streamovacího API insertAll |

## Reference výstupu

| Operace | Výstupní pole | Typ | Popis |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Pole objektů řádků (název sloupce → hodnota) |
| `query` | `.total` | number | Počet vrácených řádků |
| `query` | `.schema` | array | Pole schématu tabulky |
| `insertRows` | `.insertedCount` | number | Počet úspěšně vložených řádků |
| `insertRows` | `.errors` | array | Chyby vkládání podle řádků (prázdné při úplném úspěchu) |

## Příklad – Spuštění dotazu

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

Přístup k výstupu: `$getUsers.rows` (pole objektů řádků), `$getUsers.rows[0].email`, `$getUsers.total`.

## Příklad – Vložení řádku

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

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Podobný vzor OAuth2 pro data tabulek
- [Integrace třetích stran](../reference/integrations.md) – Nastavení přihlašovacích údajů integrací
