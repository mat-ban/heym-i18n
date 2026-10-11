# Expression DSL

Heym wykorzystuje prosty język wyrażeń do odwoływania się do danych z węzłów poprzedzających. Wyrażenia stosuje się w konfiguracji węzłów, takiej jak `userMessage` w LLM, `condition` w węźle Condition, `message` w węźle Output, mapowania w węźle Set oraz wartości zmiennych. W celu uzyskania większego edytora, podglądu na żywo obsługiwanego przez backend oraz wyboru ścieżek wyjściowych należy skorzystać z [okna ewaluacji wyrażeń](./expression-evaluation-dialog.md).

## Podstawowe odwołania

### Węzeł wejściowy a węzły nazwane

- **`$input`** – Stosuje się wyłącznie wtedy, gdy istnieje pojedynczy węzeł [Input](../nodes/input-node.md) poprzedzający i zachodzi potrzeba odwołania się do jego danych wyjściowych. Przykład: `$input.text`. Jest to skrót oznaczający „dane z podłączonego wejścia".
- **`$nodeLabel.field`** – Służy do odwoływania się do dowolnego węzła poprzedzającego poprzez jego **etykietę** (`label` w danych węzła). Zaleca się stosowanie tej formy w przypadku wielu węzłów lub gdy Asystent AI / workflow DSL oczekuje jawnych etykiet. Przykład: `$userInput.body.text`, `$myLLM.text`.

**Kiedy stosować którą formę:**

| Kontekst | Zalecane | Przykład |
|--------|--------|---------|
| Pojedynczy węzeł wejściowy, prosty przepływ | `$input.text` | Wiadomość wyjściowa z jednego węzła Input |
| Wiele węzłów lub odwołania nazwane | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [Asystent AI](./ai-assistant.md) / JSON workflow | Zawsze `$nodeLabel.field` | Kreator workflow oczekuje etykiet, a nie `$input` |

### Węzeł wejściowy

Aby odwołać się do danych węzła Input w przypadku pojedynczego wejścia poprzedzającego, należy użyć `$input`:

```
$input.text
```

### Węzły nazwane

Odwołania do dowolnego węzła poprzedzającego realizowane są poprzez jego etykietę. Gdy węzeł posiada [przypięte dane](./canvas-features.md#data-pin), uzupełnianie wyrażeń korzysta z nich zamiast z danych wyjściowych wykonania.

```
$llm.text
$httpResponse.body
$condition
```

### Dane logowania

Aby odwołać się do wartości danych logowania (np. kluczy API, tokenów bearer lub tokenów integracji Notion) po nazwie, należy użyć `$credentials.CredentialName`. Zobacz [Udostępnianie danych logowania](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nazwy, które nie są zwykłymi identyfikatorami (zawierają `-`, rozpoczynają się od cyfry lub są słowami zastrzeżonymi), wymagają formy nawiasowej: `$credentials["my-api-key"]`.

### Zmienne globalne

Aby odwołać się do [Zmiennych globalnych](./global-variables.md) – trwałych danych klucz-wartość w zakresie użytkownika, zarządzanych w [zakładce Zmienne](../tabs/global-variables-tab.md) – należy użyć `$global.variableName`.

```
$global.environment
$global.settings.baseUrl
```

### Pola zagnieżdżone

Do obiektów zagnieżdżonych stosuje się notację kropkową:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literały

- **Ciągi znaków**: `"hello"` lub `'hello'`
- **Liczby**: `42`, `3.14`
- **Wartości logiczne**: `true`, `false`
- **Null**: `null`

## Zachowanie typów

Gdy **cała** wartość stanowi pojedyncze wyrażenie `$expr`, backend zachowuje typ natywny:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Gdy wyrażenie stanowi część większego ciągu znaków, wynik końcowy jest zawsze ciągiem znaków:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Węzły [Sticky Note](../nodes/sticky-note-node.md) stanowią dokumentację na canvasie, a nie wykonywalne pola wyrażeń. Ich zawartość `note` jest renderowana jako markdown, dlatego należy stosować zwykłe linki i obrazy markdown zamiast wyrażeń `$...`.

Sticky notes obsługują niestandardowy tytuł wyświetlany oraz sześć zapisanych kolorów tła:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Dozwolone wartości `stickyColor` to `yellow`, `sky`, `emerald`, `rose`, `violet` oraz `zinc`.

## Arytmetyka

Obsługiwane operatory: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Porównania

Stosowane w węzłach [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Kontekst pętli

Wewnątrz węzła [Loop](../nodes/loop-node.md) do odwołania się do bieżącego elementu tablicy służy `item`:

```
item.name
item.value
```

## Zmienne specjalne
- `$now` – Bieżąca data i czas z metodami formatowania
- `$Date()` – Tworzenie/parsowanie daty (np. `$Date("2024-01-15")`)
- `$UUID` – Generowanie 32-znakowego unikalnego identyfikatora (BEZ nawiasów; stosuje się `$UUID`, a nie `$UUID()`)
- `$workflowName` – Nazwa bieżącego workflow
- `$workflowDescription` – Opis bieżącego workflow
- `$workflowPath` – Ścieżka względna workflow, np. `/workflows/<id>`
- `$workflowUrl` – Bezwzględny URL workflow, np. `https://<host>/workflows/<id>`
- `$executionId` – Identyfikator bieżącego wykonania (równy identyfikatorowi wpisu w [Historii wykonań](./execution-history.md), więc `/workflows/<id>/<executionId>` otwiera to uruchomienie na canvasie). **Tylko w czasie wykonania**: pusty w oknie podglądu wyrażeń; wypełniany wyłącznie podczas wykonywania workflow.
- `$vars` – Zmienne lokalne workflow (dostęp przez `$vars.variableName`; aktualizowane przez węzeł `variable`)
- `$global` – Trwały magazyn zmiennych globalnych (dostęp przez `$global.variableName`)

### Zastosowanie $vars
- `$vars.counter` – Dostęp do zmiennej o nazwie `counter`
- `$vars.myArray.add("item")` – Dodanie elementu do zmiennej tablicowej

### Zastosowanie $global
- `$global.environment` – Dostęp do zmiennej globalnej o nazwie `environment`
- `$global.settings.baseUrl` – Dostęp do pól zagnieżdżonych w zmiennej globalnej typu obiektowego
## Kontekst żądania (wykonanie przez API)
Gdy workflow jest wykonywany przez HTTP API, węzły wejściowe otrzymują dodatkowe metadane żądania:
- `$textInputLabel.body` - obiekt treści żądania HTTP (surowy payload JSON)
- `$textInputLabel.headers` - obiekt nagłówków żądania HTTP (wszystkie klucze nagłówków zapisane małymi literami)
- `$textInputLabel.query` - obiekt parametrów zapytania URL

Dostęp do danych żądania odbywa się w następujący sposób:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funkcje konwersji typów
- `str(value)` - Konwersja na ciąg znaków
- `int(value)` - Konwersja na liczbę całkowitą
- `float(value)` - Konwersja na liczbę zmiennoprzecinkową
- `bool(value)` - Konwersja na wartość logiczną
- `list(value)` - Konwersja na listę
- `dict(key=value, ...)` - Utworzenie słownika z argumentami nazwanymi (np. `$dict(name="Ali", age=30)`)

## Funkcje matematyczne
- `len(value)` - Pobranie długości
- `abs(value)` - Wartość bezwzględna
- `min(a, b)` - Wartość minimalna
- `max(a, b)` - Wartość maksymalna
- `round(value)` - Zaokrąglenie liczby
- `sum(list)` - Suma elementów listy
- `sorted(list)` - Sortowanie listy
- `randomInt(min, max)` - Losowa liczba całkowita

## Funkcje tablicowe
- `$array(a, b, c)` - Utworzenie tablicy z argumentów (np. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Utworzenie zakresu liczb całkowitych od `a` do `b` z wyłączeniem `b` (np. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Zwraca błąd, gdy `a > b`
- `notNull(list)` - Usunięcie wartości null z tablicy

## Funkcja budowania ciągów znaków (dla wyrażeń map/filter)
- `concat(a, b, c, ...)` - Łączenie N argumentów
  - Stosowana wewnątrz `.map()` jako ciąg wyrażenia (bez `$` wewnątrz ciągu)
  - Wewnątrz ciągu concat należy używać pojedynczych cudzysłowów:
    - Poprawnie: `concat('prefix', 'item.field', 'suffix')`

## Literały obiektów / słowniki
Obiekty/słowniki tworzy się za pomocą składni nawiasów klamrowych z dowolnymi kluczami tekstowymi:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Klucze dynamiczne
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Zasady literałów obiektów
- Klucze mogą być dowolnym ciągiem znaków (w tym spacjami/znakami specjalnymi)
- Klucze MUSZĄ być ujęte w podwójne cudzysłowy (np. `"key"`)
- Wartościami mogą być ciągi znaków, liczby, wartości logiczne, wyrażenia lub zagnieżdżone obiekty

## Funkcje tekstowe
- `upper(text)` - Konwersja na wielkie litery
- `lower(text)` - Konwersja na małe litery
- `strip(text)` - Usunięcie białych znaków
- `capitalize(text)` - Zamiana pierwszej litery na wielką
- `title(text)` - Zamiana na wielkie litery w stylu tytułu
- `split(text, separator)` - Podział ciągu znaków
- `join(separator, list)` - Łączenie listy
- `replace(text, old, new)` - Zamiana tekstu
- `regexReplace(text, pattern, replacement)` - Zamiana z użyciem wzorca regex
- `base64Encode(text)` - Kodowanie tekstu UTF-8 jako standardowy Base64
- `base64Decode(text)` - Dekodowanie standardowego Base64 na tekst UTF-8
- `toJson(text)` - Parsowanie ciągu JSON na obiekt, tablicę lub wartość

## Metody tekstowe (na wartościach tekstowych)
- `.orEmpty()` - Zwraca wartość tekstową lub `""`, gdy wartość jest null/brak
- `.upper()` / `.lower()` - Konwersja wielkości liter
- `.strip()` - Usunięcie białych znaków
- `.capitalize()` / `.title()` - Zamiana na wielkie litery
- `.length` - Długość ciągu znaków
- `.toString()` - Konwersja na ciąg znaków
- `.substring(start, end)` - Wyodrębnienie podciągu
- `.contains(text)` - Sprawdzenie, czy zawiera podciąg
- `.startswith(prefix)` / `.endswith(suffix)` - Sprawdzenie prefiksu/sufiksu
- `.indexOf(text)` - Znalezienie pozycji (zwraca -1, jeśli nie znaleziono)
- `.replace(old, new)` - Zamiana pierwszego wystąpienia
- `.replaceAll(old, new)` - Zamiana wszystkich wystąpień
- `.regexReplace(pattern, replacement)` - Zamiana z użyciem wzorca regex
- `.hash()` - Skrót MD5 ciągu znaków
- `.base64Encode()` - Kodowanie tekstu UTF-8 jako standardowy Base64
- `.base64Decode()` - Dekodowanie standardowego Base64 na tekst UTF-8
- `.urlEncode()` - Kodowanie ciągu znaków w formacie URL
- `.urlDecode()` - Dekodowanie ciągu znaków z formatu URL
- `.escape()` - Escapowanie ciągu znaków w formacie JSON (konwersja znaków specjalnych do formatu JSON)
- `.unescape()` - Usunięcie escapowania JSON z ciągu znaków (konwersja formatu JSON na oryginalny ciąg)
- `.toJson()` - Parsowanie ciągu JSON na obiekt, tablicę lub wartość

### Przykłady metod tekstowych
- `$profile.nickname.orEmpty()` - Konwersja tekstu null/brakującego na pusty ciąg znaków
- `$text.upper()` - Konwersja na wielkie litery
- `$text.lower()` - Konwersja na małe litery
- `$text.strip()` - Usunięcie białych znaków
- `$text.replace("old", "new")` - Zamiana tekstu
- `$text.replaceAll("a", "b")` - Zamiana wszystkich wystąpień
- `$text.length` - Pobranie długości ciągu znaków
- `$text.escape()` - Escapowanie znaków specjalnych JSON (np. cudzysłowów, znaków nowej linii)
- `$escapedText.unescape()` - Usunięcie escapowania z ciągu w formacie JSON i przywrócenie oryginału
- `$text.toJson()` - Parsowanie ciągu obiektu/tablicy JSON (następnie `$text.toJson().repoUrl`)
- `$toJson($text)` - To samo parsowanie jako funkcja
- `$base64Encode("Héym 🌍")` - Zwraca `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Dekodowanie Base64 na tekst UTF-8
- `$text.urlEncode()` - Kodowanie URL dla parametrów API
- `$encodedText.urlDecode()` - Dekodowanie tekstu zakodowanego w URL
## Metody tablic (dla tablic)
- `.first()` - Pobierz pierwszy element
- `.last()` - Pobierz ostatni element
- `.random()` - Pobierz losowy element
- `.reverse()` - Odwróć tablicę
- `.flat()` - Spłaszcz zagnieżdżone tablice do pojedynczej tablicy
- `.flat(depth)` - Spłaszcz z ograniczeniem głębokości
- `.distinct()` - Usuń duplikaty
- `.distinctBy(expr)` - Usuń duplikaty według wyrażenia (np. `$array.distinctBy("item.id")`)
- `.notNull()` - Usuń wartości null
- `.add(item)` - Dodaj element (zwraca nową tablicę)
- `.contains(item)` - Sprawdź, czy tablica zawiera element (zwraca wartość logiczną)
- `.join(separator)` - Połącz elementy tablicy w ciąg znaków
- `.filter(expr)` - Filtruj tablicę przy użyciu zmiennej `item` (np. `$array.filter("item > 5")`)
- `.map(expr)` - Przekształć każdy element przy użyciu zmiennej `item` (np. `$array.map("item.name")`)
- `.sort(expr, order)` - Sortuj według wyrażenia; kolejność to `"asc"` (domyślnie) lub `"desc"`
- `.take(n)` - Pobierz pierwszych N (wartość dodatnia) lub ostatnich N (wartość ujemna) elementów
- `.length` - Długość tablicy
- `.toString()` - Konwertuj na ciąg JSON

### Przykłady Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metody obiektów/słowników (dla obiektów)
- `.get(key)` - Pobierz wartość według klucza (zwraca null, jeśli nie znaleziono)
- `.get(key, default)` - Pobierz wartość według klucza z wartością domyślną
- `.keys()` - Zwróć listę wszystkich kluczy
- `.values()` - Zwróć listę wszystkich wartości
- `.entries()` - Zwróć listę obiektów `{key, value}` (po jednym na właściwość)
- `.filter(expr)` - Iteruj po wpisach `{key, value}` i zwróć pasujące wpisy jako listę (użyj `item.key` / `item.value` wewnątrz `expr`)
- `.map(expr)` - Iteruj po wpisach `{key, value}` i zwróć listę przekształconych wartości (użyj `item.key` / `item.value` wewnątrz `expr`)
- `.toString()` - Konwertuj na ciąg JSON

### Przykłady iteracji po obiekcie
Podczas iteracji po obiekcie za pomocą `.map()` lub `.filter()` każdy `item` jest parą `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista nazw właściwości, które nie są null

## Data/Czas
- `$now` - Bieżąca data i czas
- `$now.format("YYYY-MM-DD")` - Formatuj datę/czas
- `$now.toISO()` / `.toDate()` / `.toTime()` - Konwertuj formaty
- `$now.addDays(n)` / `.addHours(n)` - Operacje arytmetyczne na datach
- `$Date("2024-01-15")` - Parsuj ciąg daty

## Operacje numeryczne
- Podstawowa matematyka: `+`, `-`, `*`, `/`, `%`
- Porównania: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operatory logiczne: `and`, `or`, `not`

## Warunki logiczne
Dla wartości logicznych należy zapisać wyrażenie bezpośrednio (nie wymuszać `== true`):
- Niepoprawnie: `$nodeName.isValid == true`
- Poprawnie: `$nodeName.isValid`
- Negacja: `not $nodeName.isValid`

## Zasady i lista dozwolonych (krytyczne)
### Zasady umiejscowienia `$`
- Samodzielne wyrażenie zazwyczaj rozpoczyna się od wiodącego `$`.
- Ciągi szablonowe mogą zawierać wiele `$refs`.
- Parametry metod mogą również zawierać zagnieżdżone `$refs`, gdy zachodzi potrzeba przekazania wyniku innego wyrażenia (klucz dynamiczny lub zagnieżdżone rozwiązanie).
  - Poprawnie: `$node.method(other.field)` — `other` jest rozwiązywany z kontekstu jak etykieta najwyższego poziomu (bez `$` wewnątrz argumentu).
  - Poprawnie: `$node.method($other.field)` — zagnieżdżony `$` jest obsługiwany w podglądzie okna dialogowego ewaluacji i przy ocenie warunków.
  - Poprawnie: `$array($a.x, $b.y)`
  - Autouzupełnianie wewnątrz `.get(` wstawia **same** ścieżki `label.field` (bez wiodącego `$`), tak samo jak wewnątrz `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Jeśli cała przesłana wartość jest pojedynczą ścieżką kropkową **bez** wiodącego `$` (na przykład tekst zaznaczony w edytorze, jak `execute.outputs.output.result.today`), backend traktuje ją tak samo jak `$execute.outputs.output.result.today`. Wartości zawierające znak nowej linii lub powrotu karetki po przycięciu nie są przepisywane (co pozwala uniknąć niejednoznacznych wieloliniowych payloadów). Zaleca się zapisywanie `$` w zapisanych polach workflow; przepisywanie służy głównie do inspekcji i narzędzi.
- Wynik `Run` w oknie dialogowym ewaluacji jest źródłem prawdy co do sposobu rozwiązania konkretnego wyrażenia.

### Cytowanie ciągów w tablicach
Podczas tworzenia tablic z wartościami tekstowymi ZAWSZE należy używać podwójnych cudzysłowów:
- Poprawnie: `$array("hello", "world")`
- Niepoprawnie: `$array('hello', 'world')`

### UŻYWAJ WYŁĄCZNIE TYCH FUNKCJI (lista dozwolonych)
Należy używać WYŁĄCZNIE:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- udokumentowane metody dla ciągów znaków/tablic/obiektów

Jeśli funkcja nie została wymieniona powyżej, oznacza to, że nie istnieje.

### Ograniczenia metod tablic / słowników
- Tablice mogą używać WYŁĄCZNIE: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Obiekty/Słowniki mogą używać WYŁĄCZNIE: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Zarezerwowane nazwy etykiet węzłów
Nie należy używać następujących nazw jako etykiet węzłów: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Przykłady

**Warunek**: `$input.text.length > 0`

**Wiadomość użytkownika LLM**: `$input.text`

**Wiadomość wyjściowa**: `$llm.text`

**Wartość zmiennej**: `$input.count + 1`

### Przykład DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Powiązane

- [Okno ewaluacji wyrażeń](./expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem na żywo po stronie backendu i autouzupełnianiem
- [Funkcje canvas](./canvas-features.md) – Data pin do testowania wyrażeń bez ponownego uruchamiania węzłów
- [Typy węzłów](./node-types.md) – Węzły korzystające z wyrażeń ([LLM](../nodes/llm-node.md), [Warunek](../nodes/condition-node.md), [Wyjście](../nodes/output-node.md), [Set](../nodes/set-node.md) itp.)
- [Sticky Note](../nodes/sticky-note-node.md) – Notatki markdown na canvas z edytowalnym tytułem, kolorem i wyświetlaniem obrazów
- [Węzeł agenta](../nodes/agent-node.md) – Korzystanie z wyrażeń w promptach agenta
- [Pamięć trwała agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled` i `memoryShares` w `data` agenta (nie pola wyrażeń)
- [Struktura workflow](./workflow-structure.md) – Pola `data` węzłów, które akceptują wyrażenia
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dane logowania przywoływane przez węzły
- [Udostępnianie danych logowania](./credentials-sharing.md) – Udostępnianie danych logowania i używanie `$credentials` w wyrażeniach
- [Zmienne globalne](./global-variables.md) – Trwałe zmienne z `$global`
