# Notion

Węzeł **Notion** zarządza bazami danych, źródłami danych, stronami i blokami poprzez Notion API.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Wewnętrzny token integracji lub Notion OAuth |
| Wersja API | `2026-03-11` |

Kolekcje w stylu bazy danych Notion wykorzystują **identyfikatory źródeł danych** (data source IDs) w bieżących wersjach API. Przed uruchomieniem węzła należy udostępnić integracji każdą stronę lub źródło danych, których wymaga workflow. Pola zasobów akceptują zarówno surowy identyfikator Notion, jak i pełny adres URL Notion. Adresy URL są normalizowane do osadzonego w nich identyfikatora zasobu przed wysłaniem żądania API.

## Operacje

| Operacja | Wymagane pola | Główne wyjście |
|-----------|-----------------|-------------|
| Search | Opcjonalne query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID lub Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, jedno z Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Żądanie utworzenia bazy danych z `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, niepuste żądanie aktualizacji bazy danych | `.database`, `.id`, `.url` |
| Create Data Source | Żądanie utworzenia źródła danych z `parent` i niepustym `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, niepuste żądanie aktualizacji źródła danych | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block lub Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, obiekt aktualizacji bloku | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block lub Page ID, Children | `.results`, `.count` |

Wszystkie operacje zwracają również `.success` oraz `.operation`.

## Pola JSON

Pola Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon oraz Cover akceptują JSON zgodny z Notion API. Wyrażenia wewnątrz ciągów JSON są rozwiązywane przed wysłaniem żądania. Pole może również zawierać jedno samodzielne wyrażenie, które rozwiązuje się bezpośrednio do wymaganego obiektu lub tablicy, takie jak `$input.database`, `$input.properties` lub `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Dla zawartości strony lub bloku pole Children jest tablicą obiektów bloków Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Bazy danych i źródła danych

W bieżącym Notion API **baza danych** (database) jest kontenerem, a **źródło danych** (data source) przechowuje schemat właściwości oraz wiersze podlegające zapytaniom. Operacja Retrieve Database zwraca listę `data_sources` bazy danych; należy użyć jednego z tych identyfikatorów w operacjach Retrieve Data Source lub Query Data Source.

Operacja Create Database przyjmuje kompletny obiekt żądania z endpointu Create a database w Notion API. Musi on zawierać `parent` i może zawierać `title`, `description`, `is_inline`, `initial_data_source`, `icon` oraz `cover`. Na przykład:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Operacja Update Database przyjmuje obiekt żądania z endpointu aktualizacji, w tym `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` oraz `is_locked`. Pola Database ID akceptują surowy identyfikator, pełny adres URL Notion lub wyrażenie.

Operacji **Retrieve Data Source** należy użyć do pobrania schematu `properties` źródła danych przed zbudowaniem obiektu właściwości dla operacji Create Page. Operacja **Create Data Source** wymaga obiektu nadrzędnej bazy danych oraz niepustego schematu `properties`. Operacja **Update Data Source** przyjmuje niepusty obiekt żądania obsługiwany przez odpowiedni endpoint Notion API.

Na przykład utworzenie źródła danych wewnątrz istniejącej bazy danych:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Selektory Data Source oraz Parent Page obsługują wyszukiwanie po stronie serwera z krótkim opóźnieniem (debounce) oraz paginację kursorem **Load more**. Po udostępnieniu nowego zasobu w Notion należy użyć opcji **Refresh**. Aby wprowadzić wyrażenie, surowy identyfikator lub adres URL, należy przełączyć się na **Use expression**.

Filtry wyszukiwania z starszych poradników wykorzystujące
`{"property":"object","value":"database"}` są tłumaczone na bieżącą wartość `data_source`.
Nowe workflow powinny używać bezpośrednio wartości `data_source` lub `page`.

Operacja Append Blocks obsługuje pozycje **Start**, **End** oraz **After Block**. Operacje Create Page i Append Blocks automatycznie dzielą ponad 100 elementów podrzędnych najwyższego poziomu na uporządkowane żądania, aby spełnić limit Notion na jedno żądanie.

Żądania objęte limitem szybkości (`429` lub `529`) są ponawiane do trzech razy. Heym respektuje nagłówek `Retry-After` Notion, ogranicza każde oczekiwanie do 10 sekund i dodaje losowy jitter. Żądania Notion współdzielą ogólnoprocesową pulę połączeń HTTP między stronami i węzłami workflow.
## Limity API Notion

- Pojedyncza wartość rich-text `text.content` może zawierać maksymalnie 2 000 znaków. Dłuższy tekst
  należy podzielić na wiele obiektów rich-text.
- Notion ogranicza liczbę podrzędnych bloków najwyższego poziomu do 100 na żądanie. Heym dzieli
  większe tablice Children na partie, ale każdy pojedynczy blok nadal musi spełniać limity
  payloadu Notion.
- API akceptuje maksymalnie dwa poziomy zagnieżdżonych bloków podrzędnych w jednym żądaniu.
  Głębsze struktury należy tworzyć za pomocą kolejnych operacji Append Blocks.
- Payloady żądań są ograniczone do 1 000 elementów blokowych i 500 KB łącznie.

## Paginacja

Węzły Search, Query Data Source oraz Get Block Children przyjmują rozmiar strony od 1 do 100 oraz
opcjonalny kursor początkowy. Ustawienie rozmiaru strony na `0` powoduje automatyczne podążanie za
kursorami i scalenie wszystkich wyników, aż do bezpiecznego limitu 10 000 wyników dla węzła.

## Konfiguracja danych logowania

W oknie danych logowania należy wybrać jeden z dwóch sposobów konfiguracji (**Internal token** lub
**OAuth**):

- **Internal token:** Utwórz integrację wewnętrzną, skopiuj jej token do Heym, a następnie udostępnij
  integracji każdą wymaganą stronę lub źródło danych. Użyj opcji **Test Connection**, aby zweryfikować
  dostęp.
- **OAuth:** Utwórz publiczną integrację Notion i zarejestruj
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` w Notion. W oknie danych logowania Heym
  wybierz **OAuth**, wprowadź Client ID oraz Client Secret integracji, a następnie kliknij **Connect**,
  aby autoryzować workspace. Sekret jest przechowywany w postaci zaszyfrowanej wraz z danymi
  logowania i nie jest umieszczany w stanie OAuth ani w konfiguracji środowiska. Po autoryzacji dane
  logowania pokazują nazwę połączonego workspace (`connected (Workspace Name)`). Oczekujące dane
  logowania OAuth pokazują `Not connected`.

Pozostawienie pola internal token pustego podczas edycji zachowuje zapisany token.

W przypadku niestandardowych żądań [HTTP](../nodes/http-node.md) wyrażenie
`$credentials.YourNotionCredential` rozwiązuje się do tego samego bearer tokena, którego używa węzeł
Notion (internal token lub OAuth access token).

## Uwagi dotyczące wersji API

Heym przypina żądania Notion do wersji API `2026-03-11`. Ta wersja używa:

- rodziców `data_source_id` oraz endpointów `/data_sources` zamiast starszych ścieżek zapytań do bazy danych
- `in_trash` zamiast `archived` w operacjach przenoszenia stron do kosza i przywracania
- obiektów `position` (`start`, `end`, `after_block`) dla Append Block Children

Podczas migracji starszych przykładów automatyzacji Notion:

- Zastąp odwołania do rodzica bazy danych i zapytań do bazy identyfikatorami źródeł danych z operacji
  **Retrieve Database** lub z selektora źródeł danych w edytorze
- Zastąp `archived: true` wartością `in_trash: true`
- Zastąp parametry `after` w operacji append polem **Append Position** węzła

Filtry wyszukiwania, które nadal używają wartości obiektu `database`, są automatycznie normalizowane
do `data_source`.

## Powiązane

- [Dane logowania](../reference/credentials.md)
- [Integracje zewnętrzne](../reference/integrations.md)
- [Typy węzłów](../reference/node-types.md)
