# Dashboard

Zakładka **Dashboard** to przestrzeń w stylu Grafany, w której buduje się siatki widgetów wykresów. Każdy widget jest renderowany na podstawie danych wyjściowych własnego, ukrytego workflow Heym, dzięki czemu dowolne dane możliwe do wytworzenia w workflow — zapytania do bazy danych, wywołania API, wyszukiwania RAG, dane wyjściowe LLM — mogą stać się wykresem. Można prowadzić kilka dashboardów i udostępniać każdy z nich osobom lub zespołom.

## Dashboardy

Każdy użytkownik zaczyna od jednego dashboardu, tworzonego przy pierwszym otwarciu zakładki. Do przełączania między dashboardami służy selektor dashboardów u góry zakładki, a przycisk **+** obok niego tworzy nowy dashboard. Selektor wyświetla najpierw dashboardy własne, a następnie te udostępnione, oznaczone nazwą osoby, która je udostępniła.

Zakładka otwiera ponownie ostatnio używany dashboard, a pasek adresu zawiera identyfikator otwartego dashboardu (`?tab=dashboard&dashboard=<id>`), dzięki czemu link otwiera dokładnie ten dashboard u każdej osoby, która ma do niego dostęp.

Przycisk ustawień (dostępny wyłącznie dla właścicieli) pozwala zmienić nazwę dashboardu, zarządzać udostępnianiem oraz go usunąć. Usunięcie dashboardu usuwa jego widgety wraz z ich workflow. Zawsze pozostaje co najmniej jeden własny dashboard, dlatego ostatniego nie można usunąć.

## Widgety

Widget to pojedynczy wykres na siatce. Obsługiwane typy wykresów:

- **Bar** (pionowy lub poziomy)
- **Line**
- **Area** (wypełniony trend, obsługuje wiele serii)
- **Pie**
- **Table** (przewijana)
- **Numeric** (pojedyncza wartość KPI z opcjonalną jednostką)
- **Gauge** (pojedyncza wartość w zakresie min–max, np. wartość procentowa)
- **Scatter** (punkty X/Y do wykresów korelacji)
- **Proportion** (jeden słupek podzielony na udziały z legendą procentową, np. podział według języka)
- **Bar gauge** (jeden poziomy wskaźnik w każdym wierszu z gradientem od czerwonego do zielonego i wartością, np. wolne miejsce na dysku)
- **Text** (komunikat w formacie markdown, np. notatka o statusie w rodzaju „Ostatnie wykonanie o 19:47"; obsługuje [interaktywne pola wyboru](../nodes/chart-output-node.md#interactive-task-lists), gdy markdown jest statyczny, oraz [jawne listy numerowane](../nodes/chart-output-node.md#numbered-lists) dla niestandardowej lub malejącej numeracji)
- **HITL** (oczekujące przeglądy wykonywane przez człowieka. Nagłówek wyświetla `1/n pending`. Nazwa workflow otwiera dane wykonanie na canvasie. Przyciski **Approve**, **Request changes** i **Reject** rozstrzygają przegląd. Ikona historii obok tytułu widgetu otwiera to wykonanie w oknie historii na tej stronie. Widget nie korzysta z wierszy źródłowych, a każda osoba widzi własną kolejkę)

Każdy widget ładuje swoje dane asynchronicznie przy otwarciu zakładki, dzięki czemu strona pozostaje responsywna, gdy wykresy się wypełniają.

## Dodawanie widgetu

1. Należy kliknąć **Add widget**, nadać mu tytuł i wybrać typ wykresu. Poniżej selektora okno dialogowe rysuje przykład danego typu wykresu z danymi przykładowymi i podaje nazwy oczekiwanych wierszy, co pozwala porównać typy przed rozpoczęciem budowy.
2. Widget otwiera się w edytorze workflow z grafem startowym: węzeł [Set](../nodes/set-node.md) generujący wiersze połączony z węzłem [Chart Output](../nodes/chart-output-node.md). Węzeł Set należy zastąpić dowolnym źródłem danych. Widget **HITL** to wyłącznie węzeł Chart Output; odczytuje on oczekujące przeglądy i nie wymaga źródła danych.
3. Należy zbudować workflow tak, aby węzeł zasilający **Chart Output** generował tablicę wierszy, a następnie skonfigurować mapowanie pól węzła Chart Output (pole etykiety, pole wartości itd.).
4. Po zapisaniu i powrocie do zakładki Dashboard widget zostanie wyrenderowany.

Dwukrotne kliknięcie widgetu (lub użycie jego przycisku edycji) otwiera ponownie jego workflow w dowolnym momencie. Opcja **Clone widget** w nagłówku widgetu duplikuje zarówno widget, jak i jego kompletny workflow. Kopia jest umieszczana poniżej oryginału i oznaczana dopiskiem **(Copy)**, aby można było edytować ją niezależnie.

## Generowanie widgetu za pomocą AI

Należy kliknąć **AI**, opisać żądaną metrykę (na przykład „wskaźnik sukcesu workflow z ostatnich 30 dni jako wykres słupkowy") i wybrać dane logowania LLM oraz model. Heym generuje kompletny workflow widgetu zakończony węzłem Chart Output i dodaje go do siatki. Przykładowe prompty dla poszczególnych typów wykresów znajdują się w sekcji [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Przycisk **Fine-tune with AI** w widgecie służy do zmodyfikowania istniejącego widgetu nową instrukcją. Każde dostrojenie AI zapisuje poprzedni workflow jako snapshot w **Edit History** widgetu, dzięki czemu zmiany można przejrzeć lub wycofać z edytora workflow.

## Edycja układu

Przełączenie **Edit** włącza tryb edycji, w którym można przeciągać widgety i zmieniać ich rozmiar na siatce 12-kolumnowej. Zmiany układu są zapisywane automatycznie. Tytuły widgetów można edytować bezpośrednio w nagłówku widgetu.

## Buforowanie i odświeżanie

Każdy widget buforuje na serwerze swoje ostatnio obliczone dane przez konfigurowalny czas życia (TTL). Dopóki pamięć podręczna jest świeża, ponowne otwarcie dashboardu zwraca zapisany wynik zamiast ponownego uruchamiania workflow. Pamięć podręczna jest zastępowana w miejscu przy każdym ponownym obliczeniu danych (jedna pamięć podręczna na widget) i jest automatycznie unieważniana przy edycji workflow widgetu.

Przycisk **Refresh** widgetu (lub **Refresh** na pasku narzędzi) pozwala pominąć pamięć podręczną i natychmiast przeliczyć dane.
## Udostępnianie

Właściciele udostępniają dashboard z poziomu jego ustawień — pojedynczym użytkownikom (za pomocą adresu e-mail) lub dowolnemu [zespołowi](teams-tab.md), do którego należą. Każde udostępnienie ma uprawnienia **Odczyt** lub **Zapis**; gdy dana osoba ma jednocześnie udostępnienie osobiste i zespołowe, obowiązuje to o wyższym poziomie uprawnień.

| Akcja | Właściciel | Zapis | Odczyt |
|--------|:-----:|:-----:|:----:|
| Wyświetlanie widgetów, odświeżanie ich, korzystanie z automatycznego odświeżania | ✓ | ✓ | ✓ |
| Dodawanie, klonowanie, usuwanie, zmiana nazwy i rozmiaru widgetów; generowanie i dostrajanie za pomocą AI; odhaczanie pozycji listy kontrolnej | ✓ | ✓ | |
| Otwieranie workflow widgetu w edytorze | ✓ | ✓ | |
| Zmiana nazwy lub usunięcie dashboardu, zarządzanie udostępnianiem | ✓ | | |

**Widgety zawsze działają w kontekście właściciela dashboardu.** Niezależnie od tego, kto je przegląda, widget korzysta z danych logowania i zmiennych globalnych właściciela, a jego uruchomienia pojawiają się w historii wykonań i śladach właściciela. Członkowie zespołu widzą zatem te same dane, nie mając dostępu do kont, które za nimi stoją, a każdy przeglądający korzysta z jednego, zbuforowanego wyniku na widget. Widgety dodane lub sklonowane przez współpracownika z uprawnieniami zapisu również należą do właściciela.

Z tego względu **Zapis** wiąże się z takim samym zaufaniem jak udostępnienie workflow do edycji: współpracownik z uprawnieniami zapisu może zmienić to, co jest uruchamiane z danymi logowania właściciela. Należy przyznawać je wyłącznie osobom, którym powierzono by edycję swoich workflow. Uruchomienie testowe rozpoczęte przez współpracownika z edytora workflow korzysta z jego własnych danych logowania, tak jak w przypadku każdego udostępnionego workflow; jedynie sam dashboard działa w kontekście właściciela. **Odczyt** nie przyznaje dostępu do workflow widgetów, a przeglądający z uprawnieniami tylko do odczytu otrzymują sam wykres, ale nie szczegóły wykonania poszczególnych węzłów, które za nim stoją.

Usunięcie udostępnienia lub obniżenie jego poziomu z zapisu do odczytu działa natychmiast.

## Powiązane

- [Węzeł Chart Output](../nodes/chart-output-node.md)
- [Zakładka Analytics](analytics-tab.md) — wbudowane metryki wykonań (odrębne od dashboardów budowanych przez użytkownika)
