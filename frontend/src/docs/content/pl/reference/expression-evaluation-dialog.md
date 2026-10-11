# Okno ewaluacji wyrażeń

Okno ewaluacji wyrażeń to rozszerzony edytor dla pól obsługujących wyrażenia. Otwiera się za pomocą przycisku rozwijania obok pola wyrażenia i zapewnia większą przestrzeń roboczą, autouzupełnianie, podgląd na żywo z backendu oraz przeglądanie wyników w jednym miejscu.

## Otwieranie okna

- Kliknij przycisk rozwijania obok pola wyrażenia w panelu Właściwości.
- Pola wielowierszowe wyświetlają przycisk wewnątrz pola.
- Pola jednowierszowe wyświetlają przycisk po prawej stronie pola.

## Układ okna

- Okno otwiera się jako wyśrodkowany modal o rozmiarze około **80vw × 80vh**.
- Nagłówek wyświetla **Evaluate — {nazwa pola}**, gdy etykieta pola jest znana.
- Edytor zachowuje autouzupełnianie, nawigację między polami oraz standardowe akcje **Apply** / **Cancel**.
- Podgląd odświeża się automatycznie około **300 ms** po zaprzestaniu pisania.
- Naciśnij `Ctrl` / `Cmd` + `Enter`, aby zastosować bieżący tekst w polu i zamknąć okno (tak samo jak **Apply**).

## Sekcja Output

Obszar Output odświeża się automatycznie po zaprzestaniu pisania w edytorze.

### Ewaluacja

| Typ wyrażenia | Wynik |
|---|---|
| Pojedyncze `$expr` (całe pole) | Wartość natywna jest zachowywana |
| Pojedyncza ścieżka kropkowa (całe pole, bez `$`, bez osadzonego znaku nowej linii) | To samo co `$` + ta ścieżka (backend normalizuje na potrzeby ewaluacji) |
| Tekst z osadzonymi `$refs` | Wynik końcowy jest zawsze ciągiem znaków |
| Tekst dosłowny (bez `$`, nie pojedyncza ścieżka kropkowa) | Zwracany bez zmian |

**Przykłady**

| Dane wejściowe | Wynik |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (to samo co `$input.items`, gdy cała wartość to ta ścieżka) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Kontekst ewaluacji budowany jest w następującej kolejności:

- **Dane przypięte** na węzłach poprzedzających
- **Wyniki ostatniego uruchomienia** z canvasu
- `null`, gdy dane z węzłów poprzedzających są niedostępne

Jeśli bieżący węzeł ma zależności poprzedzające, ale żadna z nich nie ma przypiętych danych ani wyniku ostatniego uruchomienia, okno najpierw wykonuje uruchomienie testowe w celu zbudowania kontekstu, a następnie ewaluuje bieżący tekst.

### Selektor ścieżek wyjściowych

Gdy wynik z backendu jest obiektem lub tablicą, obszar Output może wyświetlić interaktywny selektor ścieżek zamiast surowego JSON.

- Kliknij dwukrotnie wiersz, aby dołączyć tę ścieżkę do bieżącego odwołania `$node.path`.
- Kliknij jednokrotnie wiersze rozwijalne, aby otworzyć lub zamknąć gałęzie.
- Skorzystaj z wbudowanego pola wyszukiwania, aby przeszukiwać klucze, wartości i ciągi ścieżek.

## Autouzupełnianie

- Wpisz `$`, aby otworzyć podpowiedzi dla węzłów poprzedzających, elementów wbudowanych i metod.
- Naciśnij `Tab` lub `Enter`, aby wstawić wybraną podpowiedź.
- Użyj `↑` / `↓`, aby poruszać się po liście podpowiedzi.

### Przykładowe odpowiedzi

Gdy kontynuujesz odwołanie `$…` kropką, każdy wiersz podpowiedzi pokazuje odpowiedź, którą ta podpowiedź by wygenerowała, pogrubioną po prawej stronie wiersza.

- Wpisanie `$set.listItems.first().toString().u` wyświetla `upper`, `urlEncode`, `urlDecode` i `unescape`, każdą z jej wyewaluowanym wynikiem — dzięki temu można wybierać na podstawie wyniku, a nie nazwy.
- Wpisanie `$node.text.toJson()` parsuje ciąg JSON do obiektu lub tablicy. Po `.toJson()` autouzupełnianie może zaproponować sparsowane klucze (na przykład `repoUrl`), gdy dostępny jest wynik ostatniego uruchomienia lub dane przypięte.
- Wyniki są ewaluowane na backendzie względem tych samych danych przypiętych i wyników ostatniego uruchomienia, których używa podgląd okna, więc są zgodne z tym, co wygeneruje pole.
- Ewaluowane są tylko podpowiedzi, które są samodzielne: metody bezargumentowe (`upper()`, `first()`, `keys()`, `toJson()`) oraz zwykłe właściwości (`length`, `year`). Podpowiedzi wymagające najpierw argumentów — `map`, `filter`, `sort`, `replace` — pozostają puste.
- Wiersz pozostaje pusty, gdy kandydat nie generuje odpowiedzi: błąd, `null` lub metoda, która nie ma zastosowania do danej wartości.
- Odpowiedzi są skracane do jednej linii. Najedź kursorem na skróconą odpowiedź, aby zobaczyć jej więcej.

## Build with AI

Przycisk **Build with AI** pojawia się w prawym górnym rogu okna ewaluacji, gdy workflow jest załadowany. Otwiera zagnieżdżony modal, w którym można opisać żądane wyrażenie w prostym tekście i zlecić jego wygenerowanie modelowi LLM.

### Jak to działa

1. Kliknij **Build with AI** na pasku narzędzi okna ewaluacji.
2. Wybierz dane logowania LLM oraz model z list rozwijanych.
3. Wpisz opis w prostym tekście, czego oczekujesz — na przykład *„Pobierz nazwę klienta z odpowiedzi API"*.
4. Kliknij **Generate**. Modal wywołuje backend, który korzysta z promptu systemowego [Expression DSL](./expression-dsl.md) oraz wyników ostatniego uruchomienia workflow jako kontekstu, i zwraca pojedynczy ciąg wyrażenia.
5. Wygenerowane wyrażenie jest natychmiast ewaluowane względem tych samych danych z canvasu, dzięki czemu można zobaczyć wynik przed zastosowaniem.
6. Kliknij **Apply**, aby zastąpić zawartość edytora wygenerowanym wyrażeniem, lub **Regenerate**, aby spróbować ponownie.

### Wykorzystywany kontekst

Generator otrzymuje wyniki węzłów z ostatniego uruchomienia testowego na canvasie. Jeśli workflow nie został jeszcze uruchomiony, LLM generuje wyrażenie w miarę możliwości na podstawie etykiet węzłów i konwencji DSL.

### Wymagania

- Dane logowania LLM (OpenAI, Google lub Custom) muszą być skonfigurowane w zakładce [Dane logowania](./credentials.md).
- Workflow musi być otwarty w edytorze.

## Skróty klawiszowe

| Skrót | Akcja |
|---|---|
| Pauza w pisaniu (~300 ms) | Odświeżenie podglądu z backendu |
| `Ctrl` / `Cmd` + `Enter` | Zastosowanie i zamknięcie okna |
| `Escape` | Najpierw zamknięcie autouzupełniania, w przeciwnym razie zamknięcie okna |
## Zagnieżdżone `$` w argumentach metod

W przypadku ewaluacji dialogowej / backendowej można przekazać kolejne odwołanie z zagnieżdżonym `$` wewnątrz wywołań takich jak `.get($other.field)`, gdy potrzebny jest dynamiczny klucz. Można również użyć samej ścieżki wewnątrz `.get(...)` (na przykład `other.field`); backend rozwiązuje ją w ten sam sposób. Zapisane pola workflow powinny nadal być zgodne z regułami [Expression DSL](./expression-dsl.md); API ewaluacji przyjmuje również pełnowierszową ścieżkę z kropkami w postaci samej ścieżki dla wygody (patrz tabela powyżej).

## Nawigacja

Edytory mapowania Set i Execute mogą wyświetlać przyciski **Prev** / **Next**, umożliwiając przechodzenie między polami bez zamykania okna dialogowego.

## Powiązane

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — wymagane dla funkcji Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
