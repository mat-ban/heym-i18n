# Grist

Węzeł **Grist** odczytuje, zapisuje i zarządza danymi w arkuszach kalkulacyjnych Grist. Służy do operacji CRUD, aktualizacji wsadowych oraz automatyzacji arkuszy kalkulacyjnych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Grist z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operacja: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID dokumentu (z adresu URL Grist) |
| `gristTableId` | expression | ID tabeli |
| `gristRecordId` | expression | ID rekordu (operacje na pojedynczym rekordzie) |
| `gristRecordData` | JSON string | Wartości pól dla operacji create/update. Należy używać **ID kolumn** (np. `User_Name`), a nie etykiet. |
| `gristRecordsData` | JSON string | Tablica rekordów dla operacji wsadowych |
| `gristFilter` | JSON string | Filtr: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortowanie: `Column_ID` lub `-Column_ID` (malejąco) |
| `gristLimit` | number | Maksymalna liczba rekordów (domyślnie: 100) |

## ID kolumn a etykiety

W parametrach `gristRecordData` oraz filtrach należy używać **ID kolumn** (z podkreśleniami, np. `User_Name`), a nie etykiet wyświetlanych. Aby poznać ID kolumn, należy użyć operacji `listColumns`.

## Przykład – Pobieranie rekordów

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Przykład – Tworzenie rekordu

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie klucza API Grist
- [Integracje zewnętrzne](../reference/integrations.md#grist) – Konfiguracja danych logowania Grist
