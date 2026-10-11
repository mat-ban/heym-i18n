# Supabase

Węzeł **Supabase** odczytuje i modyfikuje tabele udostępniane przez PostgREST API projektu Supabase. Należy go użyć, gdy wymagany jest dostęp workflow do stanu aplikacji opartego na SQL bez ręcznego tworzenia żądań HTTP.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Supabase |
| Wyjście | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Supabase z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operacja: `select`, `insert`, `update`, `upsert` lub `delete` |
| `supabaseSchema` | expression | Nazwa schematu. Jeśli pozostanie pusta, węzeł użyje domyślnego schematu z danych logowania, a następnie `public`. |
| `supabaseTable` | expression | Prosta nazwa tabeli do odczytu lub modyfikacji. Schemat należy podać w `supabaseSchema`, a nie tutaj. |
| `supabaseSelectColumns` | expression | Rozdzielana przecinkami lista kolumn PostgREST dla operacji `select` (domyślnie `*`) |
| `supabaseFilter` | expression | Obiekt filtra JSON. Obsługuje dokładne dopasowania oraz obiekty operatorów i grupy logiczne, np. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` lub `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksymalna liczba wierszy zwracanych dla `select` (`0` = pobierz wszystkie pasujące wiersze z paginacją po stronie serwera, wartości ujemne powodują powrót do `100`) |
| `supabaseOrderBy` | expression | Opcjonalna kolumna do sortowania dla `select` |
| `supabaseAscending` | boolean | Sortowanie rosnące, gdy `true`; malejące, gdy `false` |
| `supabaseRowsInputMode` | string | Dla `insert`/`upsert`: tryb `raw` (tablica JSON) lub `auto` w celu automatycznego mapowania pojedynczego wejścia z węzła poprzedzającego |
| `supabaseDataInputMode` | string | Dla `update`: tryb `raw` (obiekt JSON) lub `auto` w celu automatycznego mapowania pojedynczego wejścia z węzła poprzedzającego |
| `supabaseIgnoredInputFields` | string | Opcjonalna rozdzielana przecinkami lista nazw pól do pominięcia podczas automatycznego mapowania danych wejściowych |
| `supabaseRows` | expression | Tablica JSON obiektów wierszy dla `insert` i `upsert` |
| `supabaseOnConflict` | expression | Opcjonalna rozdzielana przecinkami lista kolumn docelowych konfliktu dla `upsert`, na przykład `id` lub `tenant_id,email` |
| `supabaseData` | expression | Obiekt JSON ze zaktualizowanymi wartościami kolumn dla `update` |

## Konfiguracja danych logowania

Należy utworzyć dane logowania **Supabase** w zakładce [Dane logowania](../tabs/credentials-tab.md), podając:

1. **Project URL**, na przykład `https://your-project.supabase.co`
2. **API key** z dostępem do tabel, których powinien używać ten workflow
3. Opcjonalny **domyślny schemat** (domyślnie `public`)

Węzeł komunikuje się z endpointem Supabase PostgREST pod adresem `/rest/v1/<table>`.
W polu `supabaseTable` należy podać wyłącznie nazwę tabeli, taką jak `users` lub `profiles`. Nie należy tam przekazywać `schema.table`, `rpc/...` ani innych ścieżek API.

Po wybraniu prawidłowych danych logowania Supabase edytor może wykryć udostępnione tabele i ich
kolumny bezpośrednio z metadanych PostgREST OpenAPI. Należy użyć listy rozwijanej **wykrytych tabel**, aby
wybrać tabelę, oraz **chipów kolumn** w sekcji **Select Columns**, aby szybko zbudować listę wyboru.

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Odczyt wierszy z opcjonalnymi filtrami dokładnego dopasowania, limitem i sortowaniem |
| `insert` | `supabaseTable`, `supabaseRows` lub automatyczne mapowanie wejścia | Wstawienie jednego lub wielu wierszy |
| `update` | `supabaseTable`, `supabaseData` lub automatyczne mapowanie wejścia, `supabaseFilter` | Aktualizacja wierszy pasujących do filtra |
| `upsert` | `supabaseTable`, `supabaseRows` lub automatyczne mapowanie wejścia | Wstawienie lub scalenie wierszy zgodnie z semantyką upsert Supabase. Należy użyć `supabaseOnConflict`, gdy wymagane jest jawne wskazanie celu konfliktu. |
| `delete` | `supabaseTable`, `supabaseFilter` | Usunięcie wierszy pasujących do filtra |

## Składnia filtrów

`supabaseFilter` kompiluje ustrukturyzowany JSON do parametrów zapytania PostgREST.

- Dokładne dopasowanie: `{"status":"active"}`
- Porównanie: `{"created_at":{"gte":"2026-01-01"}}`
- Przynależność: `{"status":{"in":["active","paused"]}}`
- Dopasowanie wzorca: `{"email":{"ilike":"*@example.com"}}`
- Logiczne OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logiczne AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

W przypadku wielu operatorów na tym samym polu zaleca się użycie grupy logicznej:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginacja

Operacja `select` wykonuje obecnie prawdziwą paginację po stronie serwera względem PostgREST.

- `supabaseLimit: "0"` pobiera wszystkie pasujące wiersze strona po stronie
- Wartości `supabaseLimit` powyżej 1000 automatycznie rozkładają się na wiele żądań
- Wyniki są scalane z powrotem do jednej tablicy `.rows`, a `.count` pozostaje łączną liczbą pasujących wierszy

Podczas odczytu dużych tabel należy ustawić stabilne `supabaseOrderBy`, aby granice stron pozostały przewidywalne.

## Automatyczne mapowanie wejścia

Dla operacji `insert`, `upsert` i `update` należy przełączyć węzeł w tryb **Auto-map input**, gdy pojedynczy
węzeł poprzedzający zwraca już kształt danych, który ma zostać zapisany.

- Pojedynczy obiekt staje się jednym wierszem lub jednym payloadem aktualizacji
- Tablica obiektów staje się wieloma wierszami dla `insert` / `upsert`
- Obiekt z węzła poprzedzającego zawierający tablicę `rows` wykorzystuje tę tablicę bezpośrednio
- `supabaseIgnoredInputFields` pozwala pominąć pola takie jak `id`, `created_at` lub `success`
## Dokumentacja wyjścia

| Pole wyjściowe | Typ | Opis |
|-------------|------|-------------|
| `.rows` | array | Zwrócone obiekty wierszy |
| `.count` | number | Liczba zwróconych lub zmodyfikowanych wierszy |
| `.success` | boolean | Informacja, czy operacja zakończyła się powodzeniem |

## Przykład – Wybór aktywnych użytkowników

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Dostęp do wyjścia: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Przykład – Upsert wiersza profilu

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania Supabase
- [Integracje zewnętrzne](../reference/integrations.md) – Konfiguracja danych logowania integracji
