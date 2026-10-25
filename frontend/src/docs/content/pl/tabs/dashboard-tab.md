# Dashboard

Zakładka **Dashboard** to przestrzeń w stylu Grafany, w której buduje się siatki widgetów wykresów. Każdy widget jest renderowany na podstawie danych wyjściowych własnego, ukrytego workflow Heym, dzięki czemu dowolne dane możliwe do wytworzenia w workflow — zapytania do bazy danych, wywołania API, wyszukiwania RAG, dane wyjściowe LLM — mogą stać się wykresem. Można prowadzić kilka dashboardów i udostępniać każdy z nich osobom lub zespołom.

## Dashboardy

Każdy użytkownik zaczyna od jednego dashboardu, tworzonego przy pierwszym otwarciu zakładki. Do przełączania między dashboardami służy selektor dashboardów u góry zakładki, a przycisk **+** obok niego tworzy nowy dashboard. Selektor wyświetla najpierw dashboardy własne, a następnie te udostępnione, oznaczone nazwą osoby, która je udostępniła.

Zakładka otwiera ponownie ostatnio używany dashboard, a pasek adresu zawiera identyfikator otwartego dashboardu (`?tab=dashboard&dashboard=<id>`), dzięki czemu link otwiera dokładnie ten dashboard u każdej osoby, która ma do niego dostęp.

Przycisk ustawień (dostępny wyłącznie dla właścicieli) pozwala zmienić nazwę dashboardu, określić, jakie rekordy akceptuje on jako [strona szczegółów](#detail-pages), zarządzać udostępnianiem oraz go usunąć. Usunięcie dashboardu usuwa jego widgety wraz z ich workflow. Zawsze pozostaje co najmniej jeden własny dashboard, dlatego ostatniego nie można usunąć.

## Widgety

Widget to pojedynczy wykres na siatce. Obsługiwane typy wykresów:

- **Bar** (pionowy lub poziomy)
- **Line**
- **Area** (wypełniony trend, obsługuje wiele serii)
- **Pie**
- **Table** (przewijalna; kliknij nagłówek kolumny, aby posortować rosnąco, i kliknij ponownie, aby posortować malejąco. Jedna kolumna może być wyświetlana jako [chipy statusu](../nodes/chart-output-node.md#status-chips), jedna kolumna może zawierać [przyciski linków](../nodes/chart-output-node.md#link-buttons), które otwierają adres URL w nowej karcie, a wiersze mogą otwierać [stronę szczegółów](#strony-szczegolow))
- **Numeric** (pojedyncza wartość KPI z opcjonalną jednostką)
- **Gauge** (pojedyncza wartość w zakresie min–max, np. wartość procentowa)
- **Scatter** (punkty X/Y do wykresów korelacji)
- **Proportion** (jeden słupek podzielony na udziały z legendą procentową, np. podział według języka)
- **Bar gauge** (jeden poziomy wskaźnik w każdym wierszu z gradientem od czerwonego do zielonego i wartością, np. wolne miejsce na dysku)
- **Text** (komunikat w formacie markdown, np. notatka o statusie w rodzaju „Ostatnie wykonanie o 19:47"; obsługuje [interaktywne pola wyboru](../nodes/chart-output-node.md#interactive-task-lists), gdy markdown jest statyczny, oraz [jawne listy numerowane](../nodes/chart-output-node.md#numbered-lists) dla niestandardowej lub malejącej numeracji)
- **HITL** (oczekujące przeglądy wykonywane przez człowieka. Nagłówek wyświetla `1/n pending`. Nazwa workflow otwiera dane wykonanie na canvasie. Przyciski **Approve**, **Request changes** i **Reject** rozstrzygają przegląd. Ikona historii obok tytułu widgetu otwiera to wykonanie w oknie historii na tej stronie. Widget nie korzysta z wierszy źródłowych, a każda osoba widzi własną kolejkę. Może zamiast tego pokazywać weryfikacje pojedynczego Workflow dla każdego, kto ma do niego dostęp; zobacz [Widgety HITL](#widgety-hitl))

Oprócz wykresów widget **Run a workflow** uruchamia jeden z Twoich workflow bezpośrednio z dashboardu: dla upuszczonego pliku, z polami wejściowymi lub za pomocą przycisku Run; zobacz [Widgety uruchamiania](#run-widgets).

Każdy widget ładuje swoje dane asynchronicznie przy otwarciu zakładki, dzięki czemu strona pozostaje responsywna, gdy wykresy się wypełniają.

## Dodawanie widgetu

1. Należy kliknąć **Add widget**, nadać mu tytuł i wybrać typ wykresu. Poniżej selektora okno dialogowe rysuje przykład danego typu wykresu z danymi przykładowymi i podaje nazwy oczekiwanych wierszy, co pozwala porównać typy przed rozpoczęciem budowy.
2. Widget otwiera się w edytorze workflow z grafem startowym: węzeł [Set](../nodes/set-node.md) generujący wiersze połączony z węzłem [Chart Output](../nodes/chart-output-node.md). Węzeł Set należy zastąpić dowolnym źródłem danych. Widget **HITL** to wyłącznie węzeł Chart Output; odczytuje on oczekujące przeglądy i nie wymaga źródła danych.
3. Należy zbudować workflow tak, aby węzeł zasilający **Chart Output** generował tablicę wierszy, a następnie skonfigurować mapowanie pól węzła Chart Output (pole etykiety, pole wartości itd.).
4. Po zapisaniu i powrocie do zakładki Dashboard widget zostanie wyrenderowany.

W przypadku widgetu **Run a workflow** wybierz zamiast tego workflow, który ma być uruchamiany; selektor informuje, w jaki sposób widget uruchomi każdy z nich. Widget jest dodawany bezpośrednio do siatki — nie trzeba budować nowego workflow.

Dwukrotne kliknięcie widgetu (lub użycie jego przycisku edycji) otwiera ponownie jego workflow w dowolnym momencie. Opcja **Clone widget** w nagłówku widgetu duplikuje zarówno widget, jak i jego kompletny workflow. Kopia jest umieszczana poniżej oryginału i oznaczana dopiskiem **(Copy)**, aby można było edytować ją niezależnie.

## Widgety HITL

Nowy widget HITL wyświetla każdą weryfikację oczekującą w Twojej kolejce. Aby wyświetlić tylko weryfikacje jednego Workflow, otwórz **Ustawienia** widgetu:

1. W polu **Workflow** wybierz Workflow. Lista zawiera Workflow, które możesz otworzyć (własne lub udostępnione Tobie lub Twojemu zespołowi), posiadające krok oczekujący na człowieka: Agent z weryfikacją przez człowieka lub krok Slack z zatwierdzeniem, przyciskami lub formularzem. Ikona obok otwiera ten Workflow w nowej karcie.
2. Jeśli Workflow ma dokładnie jeden taki krok, zostanie on wybrany automatycznie. Jeśli ma ich kilka, **Select agent** wyświetli je według nazwy węzła, z **All agents** na początku; kroki Slack są oznaczone jako **(Slack)**.
3. Zapisz. Wskaźnik `1/n pending` w nagłówku zlicza tylko te weryfikacje. Wybierz **Wszystkie workflows**, aby ponownie wyświetlić własną kolejkę.

Ten sam wybór jest dostępny na kanwie, we właściwościach węzła Chart Output. Może go dokonać **Dopracuj za pomocą AI** („pokaż tylko zatwierdzenia faktur”), jak również opis nowego widgetu podający nazwę Workflow. Każda zmiana jest edycją Workflow, więc pojawia się w Edit History.

- **Kto widzi weryfikacje.** Widget przefiltrowany pod kątem danego Workflow wyświetla jego weryfikacje każdemu, kto może otworzyć ten Workflow, i te osoby mogą z poziomu widgetu zatwierdzać, prosić o zmiany lub odrzucać, tak jak mogłyby uruchomić Workflow. Widget niefiltrowany pokazuje każdemu jego własną kolejkę.
- **Kto widzi widget.** Osoba, która nie może otworzyć wybranego Workflow, w ogóle nie widzi tego widgetu, nawet na dashboardzie, który został jej udostępniony. Gdy właściciel dashboardu straci dostęp do Workflow lub Workflow zostanie usunięty, właściciel widzi komunikat „You no longer have access to the workflow this widget shows” i może wybrać inny w **Ustawieniach**.
- **Tylko dostępne opcje.** Workflow, do którego nie masz uprawnień, zostanie odrzucony podczas zapisywania widgetu, niezależnie od tego, czy zapis następuje z ustawień, z kanwy czy przez AI.

## Strony szczegółów

Widget tabeli może łączyć swoje wiersze z innym dashboardem, który działa wówczas jako strona szczegółów: jeden dashboard obsługujący każdego klienta, fakturę czy zgłoszenie.

1. Otwórz **Settings** widgetu tabeli i wybierz dashboard w polu **Row link**.
2. Wprowadź **Record column**, czyli kolumnę, której wartość identyfikuje wiersz (na przykład `id`), oraz opcjonalnie **Label column**, która nadaje mu nazwę (na przykład `name`).
3. Zapisz. Kliknięcie wiersza (lub ustawienie na nim fokusu i naciśnięcie klawisza Enter) otwiera powiązany dashboard z parametrami `?record=<value>&label=<name>`.

Na dashboardzie szczegółów każdy workflow widgetu odczytuje tę wartość jako `$page.record` (zobacz [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), a strona wyświetla nad siatką `Dashboard / <label>` wraz z przyciskiem do wyczyszczenia rekordu. Przycisk Wstecz pozwala wrócić do tabeli źródłowej.

- **Kto może ją otworzyć.** Wiersze są klikalne tylko dla użytkowników, którzy mają dostęp do powiązanego dashboardu. Pozostali widzą tę samą tabelę bez odnośników.
- **Format rekordu.** Rekord pochodzi z adresu URL, dlatego dashboard szczegółów decyduje, jakie wartości akceptuje. W jego ustawieniach opcja **Detail page records** przyjmuje jedną z wartości: identyfikatory ID (litery, cyfry, `-`, `_` oraz `.`, do 128 znaków; wartość domyślna), liczby, identyfikatory UUID lub adresy e-mail. Każda inna wartość jest odrzucana przed uruchomieniem widgetu, a widgety wyświetlają komunikat „This page does not accept that record".
- **Nadal uruchamiane jako właściciel.** Na stronie szczegółów widgety również uruchamiają się z uprawnieniami właściciela dashboardu. Twórcy powinni przekazywać `$page.record` wyłącznie tam, gdzie węzeł odpowiednio go escapuje, nigdy bezpośrednio do tekstu zapytania.
- **Buforowanie.** Każdy widget buforuje swój wykres dla każdego rekordu osobno, przez taki sam czas życia (TTL) jak sam widget, i przechowuje 50 ostatnio używanych rekordów.

## Widgety uruchamiania

Widget **Run a workflow** uruchamia jeden z Twoich workflow i wyświetla wynik: status, czas wykonania oraz dane wyjściowe. To, co wyświetla, zależy od danych wejściowych przyjmowanych przez workflow:

- **Plik.** W przypadku workflow rozpoczynającego się od węzła [File Upload Trigger](../nodes/file-upload-trigger-node.md) upuść na niego plik (lub kliknij, aby go wybrać), a widget prześle go za pomocą jednorazowego linku do przesyłania z triggera. Widget wyświetla akceptowane przez trigger typy oraz rozmiar plików i odrzuca inne przed przesłaniem. Gdy workflow zaczyna się również od węzła Text Input, widget pokazuje jego pola obok strefy upuszczania: wybierz plik, wypełnij pola, a przycisk **Run** wyśle jedno i drugie. Wartości są przesyłane razem z linkiem wygenerowanym przez widget, dzięki czemu udostępniony link do przesyłania nie może ich nadpisać.
- **Pola wejściowe.** W przypadku workflow rozpoczynającego się od węzła Text Input widget wyświetla jego pola z wartościami domyślnymi; przycisk **Run** uruchamia workflow z podanymi wartościami. Wartości dla pól, których workflow nie posiada, są pomijane.
- **Brak danych wejściowych.** Workflow bez danych wejściowych otrzymuje przycisk **Run**.

Przycisk **Wrap** przy wyniku zawija długie wiersze danych wyjściowych wewnątrz pola; wyłącz go, aby czytać układ JSON danych wyjściowych.

- Każdy, kto może otworzyć dashboard, może uruchomić widget — tak samo jak każdy może odświeżyć wykres. Dostęp do workflow zależy od właściciela dashboardu: dodanie widgetu wymaga workflow, który zarówno Ty, jak i właściciel możecie uruchomić, a samo wykonanie korzysta z danych logowania właściciela workflow, podobnie jak każdy link do przesyłania plików.
- Wynik pozostaje na ekranie do momentu opuszczenia strony; inni oglądający nie widzą Twoich plików, wartości ani wyników. Uruchomienie pojawia się w historii wykonań z triggerem `dashboard`.
- Udostępnienie dashboardu nigdy nie daje dostępu do samego workflow. Przycisk **Edit workflow** otwiera go dla osób, które mają już dostęp, a opcja **Fine-tune with AI** nie jest oferowana.
- Uruchomienia z plikami wykonują się na głównej instancji, gdzie przechowywane są przesłane pliki, tak jak każde uruchomienie File Upload Trigger.

## Generowanie widgetu za pomocą AI

Należy kliknąć **AI**, opisać żądaną metrykę (na przykład „wskaźnik sukcesu workflow z ostatnich 30 dni jako wykres słupkowy") i wybrać dane logowania LLM oraz model. Heym generuje kompletny workflow widgetu zakończony węzłem Chart Output i dodaje go do siatki. Przykładowe prompty dla poszczególnych typów wykresów znajdują się w sekcji [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Widget otrzymuje krótki tytuł składający się z jednego lub dwóch słów w języku Twojego zapytania, np. „Otwarte sprawy”. Tytuł nigdy nie zawiera identyfikatora tabeli danych; jeśli model nazwie widget całym zdaniem, Heym zachowa tylko pierwsze słowa.

API widgetów może również utworzyć **kartę licznika** bez użycia AI: widget `text` na tabeli danych (`data_table_id`) z parametrami `count_column` i `count_value` pokazuje, ile wierszy ma daną wartość; tytuł widgetu wskazuje tę wartość. Heym Work poprzedza strony utworzone z tabeli danych jedną kartą licznika dla każdego statusu.

Przycisk **Fine-tune with AI** w widgecie służy do zmodyfikowania istniejącego widgetu nową instrukcją. Każde dostrojenie AI zapisuje poprzedni workflow jako snapshot w **Edit History** widgetu, dzięki czemu zmiany można przejrzeć lub wycofać z edytora workflow.

## Edycja układu

Przełączenie **Edit** włącza tryb edycji, w którym można przeciągać widgety i zmieniać ich rozmiar na siatce 12-kolumnowej. Zmiany układu są zapisywane automatycznie. Tytuły widgetów można edytować bezpośrednio w nagłówku widgetu.

## Buforowanie i odświeżanie

Każdy widget buforuje na serwerze swoje ostatnio obliczone dane przez konfigurowalny czas życia (TTL). Dopóki pamięć podręczna jest świeża, ponowne otwarcie dashboardu zwraca zapisany wynik zamiast ponownego uruchamiania workflow. Pamięć podręczna jest zastępowana w miejscu przy każdym ponownym obliczeniu danych (jedna pamięć podręczna na widget oraz jedna na rekord na [stronie szczegółów](#detail-pages)) i jest automatycznie unieważniana przy edycji workflow widgetu.

Przycisk **Refresh** widgetu (lub **Refresh** na pasku narzędzi) pozwala pominąć pamięć podręczną i natychmiast przeliczyć dane.
## Udostępnianie

Właściciele udostępniają dashboard z poziomu jego ustawień — pojedynczym użytkownikom (za pomocą adresu e-mail) lub dowolnemu [zespołowi](teams-tab.md), do którego należą. Każde udostępnienie ma uprawnienia **Odczyt** lub **Zapis**; gdy dana osoba ma jednocześnie udostępnienie osobiste i zespołowe, obowiązuje to o wyższym poziomie uprawnień.

| Akcja | Właściciel | Zapis | Odczyt |
|--------|:-----:|:-----:|:----:|
| Wyświetlanie widgetów, odświeżanie ich, korzystanie z automatycznego odświeżania | ✓ | ✓ | ✓ |
| Otwieranie stron szczegółów, uruchamianie widgetów uruchamiania | ✓ | ✓ | ✓ |
| Dodawanie, klonowanie, usuwanie, zmiana nazwy i rozmiaru widgetów; generowanie i dostrajanie za pomocą AI; odhaczanie pozycji listy kontrolnej | ✓ | ✓ | |
| Otwieranie workflow widgetu w edytorze | ✓ | ✓ | |
| Zmiana nazwy lub usunięcie dashboardu, ustawianie formatu rekordu, zarządzanie udostępnianiem | ✓ | | |

**Widgety zawsze działają w kontekście właściciela dashboardu.** Niezależnie od tego, kto je przegląda, widget korzysta z danych logowania i zmiennych globalnych właściciela, a jego uruchomienia pojawiają się w historii wykonań i śladach właściciela. Członkowie zespołu widzą zatem te same dane, nie mając dostępu do kont, które za nimi stoją, a każdy przeglądający korzysta z jednego, zbuforowanego wyniku na widget. Widgety dodane lub sklonowane przez współpracownika z uprawnieniami zapisu również należą do właściciela.

Z tego względu **Zapis** wiąże się z takim samym zaufaniem jak udostępnienie workflow do edycji: współpracownik z uprawnieniami zapisu może zmienić to, co jest uruchamiane z danymi logowania właściciela. Należy przyznawać je wyłącznie osobom, którym powierzono by edycję swoich workflow. Uruchomienie testowe rozpoczęte przez współpracownika z edytora workflow korzysta z jego własnych danych logowania, tak jak w przypadku każdego udostępnionego workflow; jedynie sam dashboard działa w kontekście właściciela. **Odczyt** nie przyznaje dostępu do workflow widgetów, a przeglądający z uprawnieniami tylko do odczytu otrzymują sam wykres, ale nie szczegóły wykonania poszczególnych węzłów, które za nim stoją.

Usunięcie udostępnienia lub obniżenie jego poziomu z zapisu do odczytu działa natychmiast.

## Powiązane

- [Węzeł Chart Output](../nodes/chart-output-node.md)
- [Zakładka Analytics](analytics-tab.md) — wbudowane metryki wykonań (odrębne od dashboardów budowanych przez użytkownika)