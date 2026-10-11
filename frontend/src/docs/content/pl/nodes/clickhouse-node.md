# ClickHouse

Węzeł **ClickHouse** wykonuje operacje CRUD, zliczanie oraz surowe zapytania SQL względem zewnętrznej bazy danych [ClickHouse](https://clickhouse.com/) poprzez jej interfejs HTTP. Służy do zapisywania zdarzeń w tabeli ClickHouse z poziomu workflow, odczytywania lub agregowania danych analitycznych bądź uruchamiania dowolnego SQL — bez ręcznego tworzenia żądań HTTP.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | ClickHouse |
| Wyjście | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania ClickHouse z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operacja: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` lub `upsert` |
| `clickhouseTable` | expression | Prosta nazwa tabeli. Wymagana dla każdej operacji poza `query`. |
| `clickhouseQuery` | expression | Surowy SQL dla `query`. Instrukcje `SELECT`/`SHOW`/`DESCRIBE` zwracają wiersze; pozostałe instrukcje są wykonywane jako polecenia. |
| `clickhouseFilter` | expression | Obiekt JSON z filtrami równości, np. `{"status":"active"}`. Używany przez `find`, `count`, `update` i `remove`. Wartości są parametryzowane. |
| `clickhouseLimit` | string | Maksymalna liczba wierszy dla `find` / `getAll` (`0` = bez limitu, brak klauzuli LIMIT). Domyślnie `100`. |
| `clickhouseSort` | expression | Opcjonalne `column` lub `column ASC\|DESC` dla `find` |
| `clickhouseRowId` | expression | Wartość dopasowywana do kolumny `id` tabeli dla `getById` |
| `clickhouseInputMode` | string | Dla `insert`/`upsert`: tryb `raw` (tablica JSON) lub `selective` (tryb pól klucz/wartość) |
| `clickhouseData` | expression | Tablica JSON obiektów wierszy dla `insert`/`upsert` lub obiekt JSON wartości kolumn dla `update` |
| `clickhouseMappings` | array | Pary `{key, value}` używane, gdy `clickhouseInputMode` ma wartość `selective` |

## Konfiguracja danych logowania

Należy utworzyć dane logowania **ClickHouse** w zakładce [Dane logowania](../tabs/credentials-tab.md), podając:

1. **Host** — host HTTP bez schematu, na przykład `your-instance.clickhouse.cloud`
2. **Port** — port interfejsu HTTP (`8443` dla HTTPS, `8123` dla HTTP)
3. **Username** / **Password** — domyślnie `default` z pustym hasłem
4. **Database** — domyślnie `default`
5. **Secure** — włączyć dla HTTPS (ClickHouse Cloud)

Węzeł łączy się za pomocą oficjalnego klienta HTTP `clickhouse-connect`. Przed zapisaniem należy użyć opcji **Test connection** w oknie danych logowania, aby zweryfikować dostępność.

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Uruchamia surowy SQL. `SELECT` zwraca `{rows, count}`; pozostałe instrukcje zwracają `{result}`. |
| `find` | `clickhouseTable` | Odczytuje wiersze z opcjonalnymi filtrami równości, sortowaniem i limitem |
| `getAll` | `clickhouseTable` | Odczytuje wiersze do limitu bez filtra |
| `count` | `clickhouseTable` | Zlicza wiersze, opcjonalnie z filtrem |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Odczytuje pojedynczy wiersz po jego kolumnie `id` |
| `insert` | `clickhouseTable`, `clickhouseData` lub mapowania | Wstawia jeden lub więcej wierszy |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Aktualizuje pasujące wiersze poprzez `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Usuwa pasujące wiersze poprzez `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` lub mapowania | Wstawia wiersze (zakłada tabelę `ReplacingMergeTree`) |

## Składnia filtrów

`clickhouseFilter` to płaski obiekt JSON z warunkami równości kolumn. Wartości są przesyłane jako powiązane parametry zapytania, dzięki czemu są bezpieczne przed wstrzyknięciem.

```json
{ "status": "active", "tenant_id": 42 }
```

Powyższe wyrażenie kompiluje się do `WHERE status = {…:String} AND tenant_id = {…:Int64}`. W kreatorze filtrów obsługiwana jest wyłącznie równość — w przypadku zakresów, złączeń lub agregacji należy użyć operacji `query` z surowym SQL.

## Tryby wejściowe (insert / upsert)

- **Tablica JSON** (`raw`): należy podać tablicę JSON obiektów wierszy w `clickhouseData`. Klucze nieobecne w danym wierszu są wstawiane jako `NULL`. Zbiór kolumn stanowi sumę kluczy ze wszystkich wierszy.
- **Klucz-wartość** (`selective`): po wybraniu danych logowania i tabeli edytor wykrywa kolumny tabeli i tworzy jedno pole wartości na kolumnę. Na każde wykonanie wstawiany jest jeden wiersz; każda wartość obsługuje wyrażenia.

## Mutacje i semantyka ClickHouse

ClickHouse to baza danych OLAP, dlatego operacje zapisu na poziomie wiersza działają inaczej niż w bazie OLTP:

- **`update`** wykonuje `ALTER TABLE … UPDATE`, a **`remove`** wykonuje `DELETE FROM`. Obie operacje są **asynchronicznymi mutacjami** — są stosowane z opóźnieniem i są stosunkowo kosztowne. Zaleca się zapisy wsadowe zamiast częstych mutacji pojedynczych wierszy.
- **`upsert`** wykonuje `INSERT`. Aby uzyskać zachowanie scalania po kluczu, tabela powinna korzystać z silnika `ReplacingMergeTree`.
- **`getById`** zakłada, że tabela posiada kolumnę `id`.
- `update` i `remove` wymagają niepustego `clickhouseFilter`, aby uniknąć mutacji całej tabeli.

## Dokumentacja wyjścia

| Pole wyjściowe | Typ | Opis |
|-------------|------|-------------|
| `.rows` | array | Zwrócone obiekty wierszy (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Liczba wierszy (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Pojedynczy wiersz lub `null` (`getById`) |
| `.result` | string | Podsumowanie polecenia dla `query` innego niż SELECT |
| `.success` | boolean | Czy operacja zakończyła się powodzeniem |
## Przykład – Wstawianie zdarzenia

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Przykład – Zliczanie aktywnych użytkowników

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Dostęp do danych wyjściowych: `$activeCount.count`.

## Przykład – Zapytanie o raport dzienny

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Dostęp do danych wyjściowych: `$dailyReport.rows`, `$dailyReport.count`.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania ClickHouse
- [Integracje zewnętrzne](../reference/integrations.md) – Konfiguracja danych logowania integracji
