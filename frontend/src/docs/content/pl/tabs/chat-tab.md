# Zakładka Chat

Zakładka **Chat** udostępnia bezpośredni interfejs czatu z LLM. Służy do testowania modeli, zadawania pytań, uruchamiania istniejących workflow oraz tworzenia nowego workflow na podstawie polecenia w języku naturalnym.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Obejrzyj demonstrację Chat</a></p>

## Konfiguracja

1. Wybierz [dane logowania](./credentials-tab.md) (klucz API dla OpenAI, Google itp.)
2. Wybierz model z listy rozwijanej (modele są ładowane na podstawie wybranych danych logowania)
3. Zacznij pisać, aby wysyłać wiadomości

Rozmowę można również rozpocząć z poziomu pola czatu w zakładce [Workflows](./workflows-tab.md). Wysyła ono pierwszą wiadomość i otwiera nową rozmowę w tym miejscu, z odpowiedzią już strumieniowaną.

## Funkcje

- **Kontekst zmiennych globalnych** – [Zmienne globalne](../reference/global-variables.md) są dostępne dla LLM, dzięki czemu można pytać o zapisane wartości lub się do nich odwoływać
- **Kontekst szablonów przestrzeni roboczej** – Udostępniane szablony workflow i węzłów w przestrzeni roboczej są dołączane jako kontekst, dzięki czemu Chat może odpowiadać na pytania o dostępne szablony
- **Długotrwały agent** – Chat kontynuuje pracę w backendzie nawet po zamknięciu przeglądarki, więc można wrócić z innego urządzenia i kontynuować tę samą rozmowę
- **Tworzenie workflow** – Wystarczy poprosić Chat o utworzenie lub skonfigurowanie workflow, a użyje on tego samego silnika Workflow AI Builder co asystent w edytorze, aby wygenerować i zapisać workflow
- **Tworzenie zadań Kanban** – Wystarczy w naturalny sposób poprosić o dodanie zadania lub utworzenie karty. Chat dodaje ją do pierwszej kolumny wskazanej tablicy; gdy istnieje wiele tablic i żadna nie zostanie wskazana, Chat wyświetla selektor tablic przed utworzeniem karty
- **Kolejkowanie kontynuacji** – Więcej wiadomości można wysyłać, gdy odpowiedź jest strumieniowana. Zakolejkowane wiadomości są utrwalane, można je edytować lub usuwać przed rozpoczęciem, a uruchamiają się w kolejności po zakończeniu aktywnej odpowiedzi
- **Pauzy planowania** – Gdy Chat potrzebuje szczegółów planowania, zadaje pytania doprecyzowujące i wstrzymuje zakolejkowane kontynuacje do czasu udzielenia odpowiedzi. Po zakończeniu odpowiedzi planowania zakolejkowane wiadomości są wznawiane
- **Dane logowania** – Gdy workflow tworzony lub edytowany przez Chat wymaga danych logowania, Chat pyta, których użyć, proponuje utworzenie nowych w rozmowie lub pozwala kontynuować bez nich. Można również poprosić Chat o utworzenie danych logowania lub aktualizację posiadanych; otwiera on formularz danych logowania w rozmowie. Model widzi nazwę i typ danych logowania, nigdy ich wartości, zarówno dla danych logowania należących do użytkownika, jak i udostępnionych mu. Węzły LLM i Agent dodawane przez Chat działają na danych logowania i modelu wybranym dla czatu, w tym na udostępnionych danych logowania; gdy Chat edytuje workflow, jego istniejące węzły LLM i Agent zachowują swoje dane logowania i model. Zobacz [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Tabele danych** – Gdy workflow tworzony lub edytowany przez Chat zapisuje rekordy, Chat pyta, której [tabeli danych](./datatable-tab.md) użyć, lub proponuje utworzenie nowej z kolumnami wymaganymi przez workflow. Może również wyświetlić listę tabel i ich kolumn. Nigdy nie odczytuje ani nie zapisuje wierszy. Zobacz [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Strumieniowanie odpowiedzi** – Odpowiedź modelu jest widoczna w miarę jej strumieniowania
- **Zatrzymanie odpowiedzi** – Bieżącą strumieniowaną odpowiedź można przerwać w dowolnym momencie; zatrzymanie usuwa również zakolejkowane wiadomości dla tej rozmowy
- **Renderowanie Markdown** – Odpowiedzi obsługują formatowanie Markdown, w tym obrazy w tekście
- **Wyświetlanie obrazów** – Obrazy osadzone w odpowiedziach (np. z generowania obrazów przez LLM) pojawiają się w tekście; kliknięcie dowolnego obrazu otwiera go w trybie pełnoekranowym. Naciśnięcie **Esc** lub przycisku wstecz (na urządzeniu mobilnym) zamyka widok pełnoekranowy
- **Kopiowanie wiadomości** – Dowolną wiadomość można skopiować do schowka
- **Czyszczenie czatu** – Rozpoczęcie nowej rozmowy
- **Wprowadzanie głosowe** – Przycisk mikrofonu umożliwia zamianę mowy na tekst (obsługiwane przez przeglądarkę). Po zakończeniu nagrywania Heym może lekko oczyścić transkrypcję przed jej wysłaniem
- **Harmonogramy workflow** – Można pytać, kiedy uruchamiają się workflow cron (dzisiaj, w tym tygodniu, w tym miesiącu lub w niestandardowym zakresie dat). Asystent korzysta z tych samych danych harmonogramu co zakładka [Scheduled](./scheduled-tab.md) i może ograniczyć wyniki do posiadanych workflow lub uwzględnić te udostępnione
- **Historia uruchomień workflow** – Można pytać o konkretny workflow („ile razy uruchomił się raport dzienny?”, „czy zakończył się błędem?”, „kiedy ostatnio został uruchomiony?”). Chat wyszukuje workflow po jego ID i odpowiada na podstawie liczby uruchomień, podziału statusów, czasu pierwszego i ostatniego uruchomienia oraz średniego czasu trwania. Pytanie o przyczynę błędu uruchomienia lub jego wynik powoduje, że Chat otwiera to pojedyncze uruchomienie, aby odczytać jego dane wejściowe, wyjściowe i błędy poszczególnych węzłów
- **Bieżący status uruchomień** – Pytanie o to, co działa teraz, skutkuje odpowiedzią Chatu zawierającą liczbę uruchomień, nazwy workflow, czas trwania każdego uruchomienia, węzeł, na którym się znajduje, oraz bezpośredni link do bieżącego uruchomienia
## Korzystanie z Chat z klienta MCP

Silnik Chat można również uruchamiać spoza przeglądarki. Po włączeniu narzędzia **Heym Chat Tool** w zakładce [MCP](./mcp-tab.md) klienci MCP — Claude, Cursor oraz wszelkie inne narzędzia obsługujące MCP — otrzymują jedno narzędzie `heym_chat`, które uruchamia ten sam silnik wraz z pełnym zestawem jego możliwości.

Takie rozmowy trafiają do historii tej zakładki i są oznaczone ikoną wtyczki na liście rozmów. Wystarczy otworzyć jedną z nich, aby przeczytać, o co pytał klient, zobaczyć karty narzędzi, które zostały wywołane, oraz samodzielnie kontynuować wątek. Odpowiadanie na pytanie doprecyzowujące przebiega identycznie niezależnie od tego, czy tura rozpoczęła się tutaj, czy z klienta MCP.

W trybie MCP Chat nie wyświetla, nie wybiera ani nie tworzy danych logowania. Budowane przez niego workflow pozostawiają pola danych logowania puste, a odpowiedź wskazuje węzły wymagające danych logowania, aby można było ustawić je w edytorze.

Tabele danych działają również przez MCP: Chat wyświetla listę tabel, tworzy nowe i podłącza je do budowanych workflow. Jego pytanie dotyczące tabeli pojawia się jako tekst w wyniku, dlatego należy odpowiedzieć na nie z tym samym `conversation_id`.

## Limit kontekstu

Chat przechowuje w kontekście do 25 ostatnich wiadomości. Starsze wiadomości są usuwane, aby zmieścić się w limitach modelu.

## Tworzenie workflow

Gdy Chat otrzyma polecenie utworzenia, zbudowania, wygenerowania lub skonfigurowania workflow, tworzy nowy zapisany workflow z wygenerowaną nazwą i opisem. Odpowiedź zawiera podgląd canvas w trybie tylko do odczytu z wygenerowanymi węzłami i krawędziami oraz link **Open workflow**, który otwiera edytor workflow w nowej karcie przeglądarki. Aby uruchomić workflow, należy użyć przycisku **Run** na karcie podglądu.

Kolejne uwagi w tej samej rozmowie powodują edycję tego workflow zamiast tworzenia nowego. Na przykład po utworzeniu workflow przez Chat można napisać „add an approval step", „change the output format" lub „şöyle yap", a Chat zaktualizuje zapisany workflow i odświeży podgląd.

Rozwiązanie to sprawdza się najlepiej w przypadku żądań, w których praca ma zostać wykonana jako automatyzacja wielokrotnego użytku, a nie jednorazowa odpowiedź.

## Tworzenie zadań Kanban

Wystarczy zwrócić się do Chat zwykłym językiem, na przykład „Add a task called Fix login bug" lub
„Create a new card Update documentation on the Launch board". Opis można dołączyć w tym samym
żądaniu. Chat zawsze tworzy kartę w pierwszej kolumnie wybranej tablicy.

Jeśli w przestrzeni roboczej znajduje się kilka tablic i żadna nie zostanie wskazana, Chat wstrzymuje
działanie i wyświetla selektor tablicy z pojedynczym wyborem. Należy wybrać tablicę, aby dokończyć
tworzenie karty. Nie jest wymagane żadne polecenie z ukośnikiem ani specjalny format wiadomości.

## Pytania o aktualnie uruchomione elementy

Wystarczy zapytać zwykłym językiem — „what is running?", „how many workflows are active right now?",
„which node is the nightly report on?" — a Chat przedstawi bieżący obraz sytuacji:

- **Ile** wykonań jest w toku, z podziałem na uruchomione oraz oczekujące na przegląd człowieka
- **Do których workflow** należą, według nazwy
- **Jak długo** trwa każde uruchomienie (na przykład `1m 35s`, `3h 25m`)
- **Który węzeł** wykonuje się w danej chwili, według jego etykiety na canvas, oraz ostatni węzeł, który zakończył działanie
- **Link** do każdego aktywnego uruchomienia, który otwiera canvas z odtwarzaniem tego wykonania

Uruchomienia wstrzymane w celu przeglądu [Human-in-the-Loop](../reference/human-in-the-loop.md) lub Codex są raportowane jako
oczekujące na użytkownika, a nie jako uruchomione. Są to te same dane co plakietka aktywnych uruchomień w nagłówku,
dzięki czemu Chat i plakietka nigdy nie są ze sobą sprzeczne. W przypadku uruchomień, które już się zakończyły, należy zapytać
o ostatnie wykonania — są one odczytywane z [Execution History](../reference/execution-history.md).

## Pytania o wykonanie

Wybierz wykonanie Workflow w [Execution History](../reference/execution-history.md#ask-ai), w edytorze lub w All History, i kliknij **Zapytaj AI** obok tytułu okna dialogowego. Chat otwiera nową konwersację z dwoma chipami nad polem wiadomości:

- **Workflow:** nazwę Workflow
- **Execution:** początkowe znaki identyfikatora wybranego wykonania

Usuń chip za pomocą jego **×**, aby go pominąć. Następnie zadaj pytanie, na przykład „dlaczego to wykonanie trwało tak długo?”, „co tutaj zawiodło?” lub „czy możesz to naprawić?”. Pozostałe chipy zostaną dołączone do tej wiadomości z pełnymi identyfikatorami, dzięki czemu Chat bezpośrednio odczyta wejścia, wyjścia i ślad węzłów wykonania zamiast szukać Workflow. Aby naprawić Workflow, Chat zapisuje, testuje i weryfikuje zmianę, jak opisano w [Tworzenie workflow](#tworzenie-workflow).

Wysłana wiadomość wyświetla chipy pod Twoim pytaniem. Należą one wyłącznie do tej wiadomości; kolejne pytania w tej samej konwersacji zachowują kontekst z historii.

## Pytania o alerty

Chat potrafi odpowiadać na pytania dotyczące zdefiniowanych [alertów](./alerts-tab.md):

- **Co istnieje** — „what alerts do I have?", „is there an alert on the invoice workflow?",
  „which alerts are firing right now?"
- **Jak dany alert jest skonfigurowany** — „what is the threshold on the cost alert?", „how is that configured?"
- **Dlaczego i kiedy został wywołany** — „why did the cost alert fire?", „when did this last trigger?"

W przypadku pytania „why did it fire" Chat odczytuje zapis wywołania i podaje rzeczywistą zaobserwowaną
wartość, próg oraz dokładne okno poddane ewaluacji, a także szczegóły przyczyniające się do wyniku:
identyfikatory nieudanych wykonań i komunikaty błędów dla alertów błędów, wydatki według modelu dla alertów kosztowych lub
podział według źródła triggera dla alertów liczby wykonań. Chat raportuje stan z chwili wywołania alertu, zamiast ponownie obliczać okno,
ponieważ okno już minęło, a świeże obliczenie może dać inny wynik.

## Reguły użytkownika

[Reguły użytkownika](../reference/user-settings.md) (konfigurowane w Ustawieniach) są automatycznie wstrzykiwane do każdej rozmowy Chat jako instrukcje na poziomie systemowym. Wystarczy ustawić je raz, aby trwałe preferencje były stosowane do wszystkich żądań w Chat.
## Powiązane

- [Karta MCP](./mcp-tab.md) – Udostępnia ten silnik klientom MCP jako narzędzie `heym_chat`
- [Ustawienia](../reference/user-settings.md) – Konfiguracja reguł użytkownika stosowanych do wszystkich żądań Chat
- [Karta Dane logowania](./credentials-tab.md) – Dodawanie i zarządzanie kluczami API
- [Karta Zmienne](./global-variables-tab.md) – Zmienne globalne dostępne dla Chat
- [Typy węzłów](../reference/node-types.md) – Węzły LLM i Agent dla workflow
- [Węzeł Agent](../nodes/agent-node.md) – Agent AI z wywoływaniem narzędzi
- [Asystent AI](../reference/ai-assistant.md) – Asystent edytora oparty na tym samym DSL budowania workflow
- [Historia wykonań](../reference/execution-history.md) – Podgląd wcześniejszych uruchomień (przycisk Historia w nagłówku)
- [Karta Harmonogramy](./scheduled-tab.md) – Kalendarz nadchodzących uruchomień Cron (te same dane, które Chat może podsumować)
- [Karta Alerty](./alerts-tab.md) – Alerty progowe, które Chat może wyświetlić i wyjaśnić
- [Prezentacja kontekstowa](../reference/contextual-showcase.md) – Zwięzła orientacja w aplikacji dla tej strony
- [Głos w Chat (TTS i STT)](../reference/chat-voice.md) – Odczytywanie wiadomości na głos i rozmowa bez użycia rąk z ElevenLabs

## Wywołania narzędzi i rozmiar kontekstu

Za każdym razem, gdy asystent wywołuje narzędzie (uruchamia workflow, wyświetla listę wykonań, buduje nowy workflow), w rozmowie pojawia się zwijana karta. Karta rozwija się automatycznie w trakcie działania narzędzia, pokazując dokładne argumenty. Po zakończeniu działania narzędzia karta zwija się do jednoliniowego podsumowania z czasem wykonania. Kliknięcie dowolnej karty ponownie rozwija argumenty i podsumowanie odpowiedzi.

Mały wskaźnik pierścieniowy pod polem wprowadzania pokazuje bieżące wykorzystanie kontekstu jako procent okna modelu (np. `12% · ~9.2k`). Po najechaniu na wskaźnik wyświetla się szczegółowy podział: prompt systemowy, AGENTS.md, blok workflow, reguły użytkownika, historia oraz bieżący tekst wprowadzony w polu. Gdy wykorzystanie przekroczy 80%, pierścień zmienia kolor na bursztynowy; przy 95% staje się czerwony.

Jeśli wykorzystanie zbliża się do limitu, Heym automatycznie kompresuje starsze wiadomości do krótkiego podsumowania, korzystając z tego samego mechanizmu, którego używają węzły agenta. W tekście pojawia się karta „Kontekst skompresowany", która pokazuje, co się stało.
