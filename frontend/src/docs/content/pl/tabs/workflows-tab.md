# Zakładka Workflows

Zakładka **Workflows** to domyślny widok pulpitu nawigacyjnego. Wyświetla listę workflow, strukturę folderów oraz umożliwia tworzenie, edytowanie i organizowanie workflow.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Obejrzyj demonstrację Workflows</a></p>

## Rozpoczęcie czatu

Nad listą workflow znajduje się pole czatu, które wita użytkownika po imieniu i pyta, co chce zautomatyzować. Należy wpisać prompt, opcjonalnie dołączyć jeden plik oraz wybrać dane logowania i model. Oba menu rozwijane są przeszukiwalne i domyślnie korzystają z [ustawień domyślnych AI](../reference/user-settings.md).

Wysłanie wiadomości tworzy nową rozmowę i otwiera ją w [zakładce Chat](./chat-tab.md), gdzie odpowiedź jest strumieniowana. Obsługiwane załączniki to pliki tekstowe, obrazy i pliki PDF — jeden na wiadomość, tak samo jak w kompozytorze czatu.

Jeśli nie skonfigurowano jeszcze danych logowania LLM, pole wyświetla link do [zakładki Dane logowania](./credentials-tab.md), a wysyłanie pozostaje zablokowane.

Kliknięcie **x** ukrywa pole. Następnie obok nagłówka Workflows pojawia się przycisk **Ask AI**, który przywraca pole. Wybór jest zapamiętywany w przeglądarce.

## Lista workflow

Lista ma widok dwupanelowy: workflow i foldery po lewej stronie, podgląd wybranego workflow po prawej.

- Każdy wiersz wyświetla ikonę workflow, nazwę, opis, datę ostatniej aktualizacji oraz [znacznik statusu](#workflow-status)
- Workflow mogą znajdować się w katalogu głównym lub wewnątrz folderów, a przypięte workflow pojawiają się w osobnej grupie **Pinned** na górze
- **Kliknięcie** wiersza powoduje jego zaznaczenie i załadowanie podglądu po prawej stronie
- **Dwukrotne kliknięcie** wiersza lub naciśnięcie **Enter**, gdy jest aktywny, otwiera go w [edytorze](../getting-started/quick-start.md)
- Użycie **Ctrl+click** (lub **Cmd+click**) otwiera workflow w nowej karcie
- Każdy wiersz ma po prawej stronie akcje edycji, kopiowania, przypinania i usuwania. Na telefonach są one ukryte, aby nazwa zajmowała pełną szerokość; **długie naciśnięcie** wiersza otwiera wtedy arkusz akcji
- Często używane workflow można przypiąć w [Quick Drawer](../reference/quick-drawer.md), aby szybko je uruchamiać z zakładki Workflows i innych stron wewnętrznych

## Podgląd workflow

Wybranie workflow wypełnia panel podglądu obok listy. Na ekranach węższych niż 1280px ten sam panel otwiera się jako arkusz od dołu ekranu.

Panel wyświetla:

- Nazwę workflow, informację kto go utworzył i kiedy oraz datę ostatniej edycji
- **Open Workflow** – otwiera workflow w edytorze
- **Run Now** – otwiera workflow w [Quick Drawer](../reference/quick-drawer.md), gdzie można wypełnić dane wejściowe i rozpocząć uruchomienie bez opuszczania listy
- **Description** – opis workflow
- **Trigger Configuration** – harmonogram dla workflow typu cron lub trigger nasłuchujący dla workflow zdarzeniowego. Workflow wywoływane przez HTTP wyświetlają przycisk **Copy cURL** zamiast surowego endpointu i opisu uwierzytelniania: kopiuje on kompletne żądanie z właściwym URL, nagłówkami, placeholderem uwierzytelniania oraz ciałem zbudowanym z pól wejściowych workflow. Gdy workflow publikuje [portal](../reference/portal.md), pojawia się tu również jego publiczny link do czatu
- **Last Run Details** – wynik i czas trwania ostatniego uruchomienia lub informacja, że workflow nigdy nie został uruchomiony
- **Workflow Steps & Sub-agents** – węzły w kolejności wykonania, każdy z modelem, operacją lub harmonogramem oraz kropką wskazującą, czy jest aktywny. Wybranie kroku otwiera ten węzeł w edytorze z już otwartym panelem właściwości

Panel pozostaje przypięty obok listy podczas przewijania, dzięki czemu pozostaje czytelny przy długiej liście workflow.
## Administracja instancją

Konta wymienione w `HEYM_ADMIN_EMAILS` mogą wyświetlać listę, otwierać, edytować, przeglądać historię wykonań oraz usuwać dowolny workflow w instancji bez udostępniania lub przenoszenia własności. Ustawienie to lista adresów e-mail rozdzielonych przecinkami, dopasowywanych bez rozróżniania wielkości liter. Pusta lista nie przyznaje nikomu tego dostępu. Po zmianie należy ponownie uruchomić backend.

Administratorzy widzą adres e-mail właściciela na liście workflow i mogą wyszukiwać według tego adresu. Aby otworzyć **Instance administration** w podglądzie, należy wybrać workflow:

1. **Pause triggers** jest wyświetlane tylko dla workflow zawierających węzeł Cron. Wyłącza ono węzeł Cron oraz inne automatyczne węzły triggerów workflow poprzez zwykły, wersjonowany zapis. Istniejące wykonania mogą się zakończyć. Wywołania manualne, przez API, portal oraz pod-workflow pozostają dostępne; ta czynność nie jest blokadą wykonywania całego workflow.
2. Przycisk zmienia się na **Resume triggers**, gdy workflow jest wstrzymany, również po odświeżeniu strony. Resume ponownie włącza triggery wstrzymane przez administratora, a triggery już wcześniej wyłączone pozostawia bez zmian. W przypadku starszych wstrzymanych workflow bez zapisanego stanu wstrzymania administracyjnego Resume włącza ich automatyczne triggery.
3. Po ustabilizowaniu się wykonań należy użyć akcji **Delete workflow** w wierszu workflow. Usunięcie zwraca konflikt, dopóki pozostają zadania w trakcie wykonywania, w kolejce lub oczekujące na przegląd. Zaplanowane usunięcie stosuje tę samą kontrolę.

Przed usunięciem należy wstrzymać triggery i pozwolić istniejącym wykonaniom się zakończyć. Trigger już wysłany w momencie wstrzymania może nadal się zakończyć. Usunięcia należy użyć, gdy workflow nie może już być wywoływany.

Sekrety webhooków i ustawienia uwierzytelniania dostępne wyłącznie dla właściciela zachowują dotychczasowe zabezpieczenia. Administracja nie przenosi własności ani nie udostępnia rekordów danych logowania właściciela. Czynności administracyjne wstrzymania, wznowienia, usunięcia i zaplanowania pojawiają się w [audit trail](../reference/audit.md) wraz z działającym administratorem i właścicielem workflow.

## Status workflow

Każdy wiersz zawiera etykietę statusu wynikającą z węzłów triggerów workflow, jego bieżącego stanu wykonania,
a — w przypadku workflow bez węzła triggera — ze sposobu rozpoczęcia ostatniego wykonania:

| Status | Znaczenie |
| --- | --- |
| **Running** | Workflow ma obecnie wykonanie w toku |
| **Scheduled** | Ma aktywny trigger [cron](../nodes/cron-node.md) |
| **Listening** | Ma aktywny trigger zdarzeniowy, taki jak trigger Slack, Telegram, IMAP lub WebSocket |
| **Paused** | Ma węzły triggerów, ale każdy z nich jest dezaktywowany |
| **API** | Nie ma węzłów triggerów, a ostatnie wykonanie zostało uruchomione przez wywołanie HTTP do jego endpointu execute |
| **SubWorker** | Nie ma węzłów triggerów, a ostatnie wykonanie zostało uruchomione jako pod-workflow przez workflow nadrzędny |
| **Portal** | Nie ma węzłów triggerów, a ostatnie wykonanie zostało uruchomione z jego [portalu](../reference/portal.md) |
| **WEB** | Nie ma węzłów triggerów, a jego jedynym terminalem jest [HTML output mapper](../nodes/html-output-mapper-node.md), więc jego wywołanie zwraca wyrenderowaną stronę internetową |
| **Manual** | Nie ma węzłów triggerów i nigdy nie został uruchomiony lub jego ostatnie wykonanie pochodziło z innego miejsca |
| **Remove Scheduled** | Jest [zaplanowany do usunięcia](../reference/workflow-organization.md) |

Etykiety API, SubWorker i Portal odczytują pojedynczy, najnowszy wpis w [historii wykonań](./logs-tab.md) workflow,
więc workflow wywoływany na dwa sposoby pokazuje ten, który wystąpił jako ostatni. **WEB** jest ustalany na podstawie grafu,
więc ma pierwszeństwo przed tymi trzema: workflow serwujący stronę odczytuje WEB nawet po wywołaniu przez HTTP. Węzły triggerów zawsze
mają pierwszeństwo przed nimi wszystkimi: workflow cron, który ktoś wywołuje również przez HTTP, pozostaje **Scheduled**.

Aby wyświetlić tylko jeden status, należy użyć listy rozwijanej **Status** obok pola wyszukiwania. Lista rozwijana pokazuje, ile workflow aktualnie pasuje do każdego statusu. Filtr statusu sięga również do wnętrza folderów: foldery z dopasowaniem są automatycznie rozwijane, a foldery bez dopasowania są ukrywane do momentu wyczyszczenia filtra.

## Aktywne workflow

Na komputerach okrągła plakietka na górnym pasku narzędzi pokazuje, ile workflow jest obecnie
wykonywanych, i odświeża się automatycznie co 10 sekund. Kliknięcie niezerowej plakietki otwiera listę aktywnych
workflow, która pokazuje do czterech wierszy przed przewinięciem. Wybranie nazwy workflow przypina
edytor do widoku na żywo tego wykonania. Zerowa plakietka ma charakter informacyjny i nie można jej otworzyć, a
plakietka jest ukryta na ekranach mobilnych.

## Wyszukiwanie

Aby filtrować workflow według tytułu lub opisu, należy użyć pola wyszukiwania workflow obok **Status** lub nacisnąć **Ctrl+F** (albo **Cmd+F**). Pasujące workflow wewnątrz folderów są wyświetlane z rozwiniętymi gałęziami folderów. Naciśnięcie **Escape** czyści wyszukiwanie.
## Foldery

- Organizuj workflowy w [foldery i podfoldery](../reference/workflow-organization.md)
- Twórz foldery przyciskiem **Nowy folder**, nadając każdemu nazwę oraz opcjonalny opis wyświetlany pod nazwą na liście
- Każdy wiersz folderu pokazuje liczbę przechowywanych workflowów, z uwzględnieniem podfolderów, obok akcji tworzenia podfolderu, zmiany nazwy, zmiany ikony, pobierania jako ZIP i usuwania. Na telefonach wiersz wyświetla pojedynczy przycisk menu
- Przeciągnij workflow nad folder lub podfolder, aby zobaczyć podgląd miejsca docelowego w rozmiarze karty. Podświetlony podgląd pokazuje pełną ścieżkę folderu przed upuszczeniem, a najechanie na zwinięty folder chwilowo go rozwija, umożliwiając dotarcie do zagnieżdżonych folderów.
- Przeciągaj workflowy między folderami lub do katalogu głównego. Przeciągana karta pozostaje widoczna jako duch, a aktywne miejsce docelowe pozostaje podświetlone podczas przewijania.
- Upuszczenie workflowu z powrotem do jego bieżącego folderu jest zablokowane i oznaczone jako **Już w folderze**.
- Zmień nazwę folderu lub jego opis za pomocą akcji zmiany nazwy bądź menu kontekstowego wywoływanego prawym przyciskiem myszy

## Tworzenie workflowów

1. Kliknij **Nowy workflow**
2. Wprowadź nazwę i opcjonalny opis
3. Workflow otworzy się w edytorze

## Import

Przeciągnij i upuść plik JSON workflowu na obszar workflowów, aby utworzyć nowy workflow. Zaimportowane węzły i krawędzie są wykorzystywane do utworzenia workflowu; nazwa pochodzi z pola `name` w pliku JSON lub z nazwy pliku. Format JSON i opcje importu opisano w sekcji [Pobieranie i import](../reference/download-import.md).

## Udostępnianie

Otwórz workflow w edytorze i kliknij **Udostępnij**, aby zaprosić użytkowników przez e-mail lub udostępnić [zespołowi](./teams-tab.md). Dla każdego użytkownika lub zespołu wybierz **Odczyt** (przeglądanie i uruchamianie) albo **Zapis** (również edycja), a następnie zmień uprawnienia w dowolnym momencie z listy rozwijanej obok wpisu. Dane logowania i podworkflowy nie są udostępniane automatycznie; udostępnij je osobno tym samym użytkownikom lub zespołom. Zobacz [Organizacja workflowów](../reference/workflow-organization.md#sharing-workflows) oraz [Udostępnianie danych logowania](../reference/credentials-sharing.md).

## Edycja i usuwanie

- **Edytuj** – Zmień nazwę i opis workflowu za pomocą akcji edycji w wierszu
- **Usuń** – Workflowy są [przeznaczane do usunięcia](../reference/workflow-organization.md); trafiają do obszaru kosza przed trwałym usunięciem

## Równoczesne edycje

Zapis przesyła wersję, na której opierają się wprowadzone zmiany, a serwer odrzuca zapis, jeśli workflow zmienił się w międzyczasie — na przykład dlatego, że zapisał go inny członek zespołu lub ten sam workflow został otwarty w drugiej karcie. Heym wyświetla wówczas okno dialogowe **Wykryto nieaktualny workflow** z dwiema opcjami:

- **Anuluj** – Zachowuje niezapisane zmiany w edytorze, aby można było odświeżyć widok w innej karcie i je uzgodnić
- **Nadpisz** – Zapisuje mimo wszystko, zastępując wersję innej osoby

**Uruchomienie** workflowu najpierw go zapisuje, więc przechodzi tę samą weryfikację. Jeśli workflow zmienił się pod spodem, uruchomienie zatrzymuje się na oknie dialogowym zamiast po cichu nadpisywać dane: **Nadpisz i uruchom** zapisuje daną wersję i rozpoczyna uruchomienie, **Anuluj uruchomienie** porzuca obie operacje i pozostawia zmiany nietknięte.

Weryfikacja jest częścią samego żądania zapisu, więc nie wymaga dodatkowego przesyłania i nie istnieje okno, w którym zapis mógłby ją ominąć. Własne zmiany wprowadzone w innym miejscu aplikacji — zmiana nazwy, zmiana ustawień, przełączenie w panelu właściwości — nigdy nie są traktowane jako konflikt.

## Paleta poleceń

Naciśnij **Ctrl+K** (lub **Cmd+K**), aby otworzyć paletę poleceń. Można:
- Wyszukiwać workflowy po nazwie
- Przejść do dowolnej [karty panelu](./credentials-tab.md)
- Otwierać ostatnie workflowy

## Powiązane

- [Szybki start](../getting-started/quick-start.md) – Zbuduj pierwszy workflow
- [Organizacja workflowów](../reference/workflow-organization.md) – Foldery, podfoldery i zaplanowane usuwanie
- [Struktura workflowu](../reference/workflow-structure.md) – Format JSON dla workflowów
- [Pobieranie i import](../reference/download-import.md) – Eksport i import workflowów jako JSON
- [Portal](../reference/portal.md) – Udostępnianie workflowów jako publicznych interfejsów chat
- [Tablica](./board-tab.md) – Uruchamianie workflowów z kart kanban poprzez łańcuchy kolumn
- [Kluczowe koncepcje](../getting-started/core-concepts.md) – Workflowy, węzły i wykonania
- [Historia wykonań](../reference/execution-history.md) – Przeglądanie poprzednich uruchomień i Bring to Canvas
- [Szybki panel](../reference/quick-drawer.md) – Przypinanie i uruchamianie workflowów z panelu, dokumentacji i innych stron poza edytorem
- [Kontekstowy przewodnik](../reference/contextual-showcase.md) – Krótki przewodnik po powierzchniach panelu
