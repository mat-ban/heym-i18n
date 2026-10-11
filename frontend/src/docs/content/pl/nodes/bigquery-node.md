# BigQuery

Węzeł **BigQuery** wykonuje zapytania SQL i wstawia wiersze do zbiorów danych Google BigQuery za pośrednictwem BigQuery REST API v2. Służy do odpytywania dużych analitycznych zbiorów danych lub strumieniowego przesyłania wierszy do tabel na podstawie danych z workflow.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | BigQuery (OAuth2) |
| Wyjście | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania BigQuery z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operacja: `query` lub `insertRows` |
| `bqProjectId` | expression | ID projektu Google Cloud (np. `my-gcp-project`) |
| `bqQuery` | expression | Ciąg zapytania SQL. Wymagany dla `query`. |
| `bqMaxResults` | string | Maksymalna liczba wierszy zwracanych przez `query` (domyślnie `1000`). |
| `bqDatasetId` | expression | ID zbioru danych (np. `my_dataset`). Wymagany dla `insertRows`. |
| `bqTableId` | expression | ID tabeli (np. `my_table`). Wymagany dla `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Dla `insertRows`: **Raw** = pełna tablica JSON; **Selective** = pojedynczy wiersz jako pary pole-wartość. |
| `bqRows` | expression | Tablica JSON obiektów wierszy dla trybu raw (np. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Pary klucz-wartość dla trybu selective. Każdy klucz to nazwa kolumny; każda wartość to wyrażenie. |

## Konfiguracja danych logowania

BigQuery korzysta z modelu **OAuth2 „Bring Your Own App"**. Należy dostarczyć własne dane logowania OAuth2 Google Cloud.

**Konfiguracja backendu:** Należy ustawić **`FRONTEND_URL`** w backendzie Heym na publiczny adres URL aplikacji (adres wpisywany w przeglądarce), np. `https://your-heym-domain`. URI przekierowania OAuth to zawsze `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → włącz **BigQuery API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → wybierz **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj dokładnie: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Skopiuj **Client ID** i **Client Secret**.
5. W Heym Dashboard → **Dane logowania** → **New** → wybierz **BigQuery (OAuth2)**.
6. Wprowadź Client ID, Client Secret oraz nazwę, a następnie kliknij **Connect**, aby dokończyć zgodę OAuth2 w oknie popup przeglądarki.

Tokeny odświeżają się automatycznie w tle — ręczne zarządzanie tokenami nie jest wymagane.

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Uruchom zapytanie SQL i zwróć wiersze |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows lub bqMappings | Wstaw jeden lub więcej wierszy przez streamingowe API insertAll |

## Dokumentacja wyjścia

| Operacja | Pole wyjściowe | Typ | Opis |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Tablica obiektów wierszy (nazwa kolumny → wartość) |
| `query` | `.total` | number | Liczba zwróconych wierszy |
| `query` | `.schema` | array | Pola schematu tabeli |
| `insertRows` | `.insertedCount` | number | Liczba pomyślnie wstawionych wierszy |
| `insertRows` | `.errors` | array | Błędy wstawiania dla poszczególnych wierszy (puste przy pełnym powodzeniu) |

## Przykład – uruchomienie zapytania

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

Dostęp do wyjścia: `$getUsers.rows` (tablica obiektów wierszy), `$getUsers.rows[0].email`, `$getUsers.total`.

## Przykład – wstawienie wiersza

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodaj dane logowania BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Podobny wzorzec OAuth2 dla danych arkusza kalkulacyjnego
- [Integracje zewnętrzne](../reference/integrations.md) – Konfiguracja danych logowania integracji
