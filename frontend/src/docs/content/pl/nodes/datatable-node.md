# DataTable

Węzeł **DataTable** odczytuje, zapisuje i zarządza danymi w Heym DataTables. Służy do operacji CRUD na strukturalnym magazynie danych pierwszej strony bez konieczności używania zewnętrznych danych logowania.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable z [zakładki DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operacja: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID wiersza (dla getById, update, remove) |
| `dataTableData` | JSON string | Wartości kolumn: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtr (find/upsert/count). `find` i `count` obsługują operatory `{"age": {"$gt": 18}}`; `upsert` używa dokładnego dopasowania `{"column_name": "value"}` |
| `dataTableSort` | string | Kolumna sortowania, prefiks `-` dla sortowania malejącego |
| `dataTableLimit` | number | Maksymalna liczba zwracanych wierszy (domyślnie: 100) |

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|----------------|-------------|
| `find` | dataTableId | Znajdź wiersze pasujące do opcjonalnego filtra operatorowego z opcjonalnym sortowaniem/limitem |
| `getAll` | dataTableId | Pobierz wszystkie wiersze z opcjonalnym sortowaniem/limitem |
| `count` | dataTableId | Zlicz wiersze pasujące do opcjonalnego filtra operatorowego (zliczane w bazie danych; zwraca tylko liczbę) |
| `getById` | dataTableId, dataTableRowId | Pobierz pojedynczy wiersz po UUID |
| `insert` | dataTableId, dataTableData | Wstaw nowy wiersz |
| `update` | dataTableId, dataTableRowId, dataTableData | Zaktualizuj wiersz (scala dane) |
| `remove` | dataTableId, dataTableRowId | Usuń wiersz |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Zaktualizuj, jeśli znaleziono dopasowanie, w przeciwnym razie wstaw |

## Przykład - Znajdowanie wierszy

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Przykład - Wstawianie wiersza

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Przykład - Zliczanie wierszy

Zlicz wiersze pasujące do warunku w jednym węźle, zamiast `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Wynik jest dostępny jako `$activeAdults.count`. Pusty lub pominięty filtr zlicza każdy wiersz.

### Operatory filtrów find i count

W filtrze `find` lub `count` zwykła wartość oznacza równość; wartość obiektowa stosuje operator:

| Operator | Znaczenie |
|----------|---------|
| `$eq` (lub zwykła wartość) | Równa się |
| `$ne` | Nie równa się |
| `$gt`, `$gte`, `$lt`, `$lte` | Porównania większe/mniejsze (numeryczne dla kolumn typu `number`, w przeciwnym razie tekstowe) |
| `$contains` | Dopasowanie podciągu bez rozróżniania wielkości liter |
| `$in` | Wartość znajduje się w podanej tablicy |

Przykład łączący kilka: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Nieznane operatory są ignorowane. Filtry `upsert` nadal używają wartości dokładnego dopasowania do znalezienia wiersza do aktualizacji.

Można również filtrować po metadanych wiersza — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — które są przechowywane jako rzeczywiste kolumny, a nie wewnątrz danych. W przypadku dat należy podać pełną wartość dla porównań zakresowych (np. `{"created_at": {"$gt": "2026-06-04"}}`) lub użyć `$contains` dla częściowego dopasowania tekstowego (np. `{"created_at": {"$contains": "2026-06-04"}}`). Jeśli jedna z własnych kolumn ma taką samą nazwę jak pole metadanych, kolumna danych ma pierwszeństwo.

## Dostęp do wyjścia

- `$nodeLabel.success` - Logiczny status powodzenia
- `$nodeLabel.rows` - Tablica wierszy (find, getAll)
- `$nodeLabel.row` - Pojedynczy obiekt wiersza (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Dostęp do wartości konkretnej kolumny
- `$nodeLabel.count` - Liczba wierszy (zwrócone wiersze dla find/getAll; łączna liczba pasujących wierszy dla count)
- `$nodeLabel.id` - UUID wiersza (insert, update, remove)
- `$nodeLabel.found` - Wartość logiczna (getById)
- `$nodeLabel.operation` - Nazwa operacji (np. `count`; `insert`/`update` dla upsert)

## Brak wymaganych danych logowania

W przeciwieństwie do integracji zewnętrznych, DataTable działa na wewnętrznej bazie danych Heym. Uprawnienia dostępu właściciela workflow są sprawdzane automatycznie.

## Zbudowane przez Asystenta AI

Gdy [Asystent AI](../reference/ai-assistant.md#data-tables) lub [Chat](../tabs/chat-tab.md) buduje ten węzeł, wybiera lub tworzy tabelę wraz z użytkownikiem i zapisuje dokładne nazwy kolumn tabeli w `dataTableData` oraz `dataTableFilter`.

## Powiązane

- [Zakładka DataTable](../tabs/datatable-tab.md) - Twórz tabele i zarządzaj nimi
- [Węzeł Grist](./grist-node.md) - Integracja z zewnętrznym arkuszem kalkulacyjnym
- [Expression DSL](../reference/expression-dsl.md) - Składnia wyrażeń dla wartości dynamicznych
