# Funkcje Canvas

Edytor workflow oferuje szereg funkcji służących do debugowania, testowania i organizowania węzłów: **Uruchom do węzła**, **AI w węźle**, **Przypięcie danych**, **Dzienniki wykonań**, **Włącz/Wyłącz** oraz **Wyodrębnij do pod-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Obejrzyj demonstrację edytora</a></p>

## Uruchom do węzła

Należy najechać kursorem na dowolny węzeł inny niż notatka sticky i kliknąć **Uruchom** pod nim. Heym wykonuje ten węzeł oraz jego zależności nadrzędne, pozostawiając węzły podrzędne i niepowiązane gałęzie bez zmian. Wykorzystywany jest tryb testowy canvas, obejmujący przypięte dane wyjściowe oraz standardowe warunki gałęzi workflow.

Jeśli wybrana ścieżka zawiera pola wejściowe, otwiera się panel **Uruchom** po prawej stronie i ustawia fokus na pierwszym polu. Należy wprowadzić wartości, a następnie kliknąć **Uruchom do _etykieta węzła_** lub nacisnąć **Ctrl+Enter** (Cmd+Enter w systemie macOS). Tryb ogólnego ciała żądania ustawia fokus na edytorze JSON. Ścieżki bez pól wejściowych uruchamiają się natychmiast bez otwierania panelu. Przypięte węzły wejściowe wykorzystują swoje przypięte dane wyjściowe bez pytania o dane wejściowe.

Panel zachowuje wybrany cel dla kolejnych uruchomień. Aby wyczyścić cel, należy wybrać **Uruchom pełny workflow**. Przyciski uruchamiania są nieaktywne, gdy wykonanie jest w toku. Cel znajdujący się wewnątrz pętli zatrzymuje uruchomienie przy pierwszym osiągnięciu tego węzła; wybranie węzła znajdującego się za pętlą uruchamia pełną pętlę nadrzędną.

## AI w węźle

Najedź kursorem na dowolny węzeł z wyjątkiem notatki i kliknij **AI** powyżej. [AI Assistant](./ai-assistant.md) otworzy się na tym węźle i zaoferuje **Change this node as ...**, **Fix error in this node ...** oraz **Other**. W trybie Agent asystent zmienia tylko ten węzeł; inne węzły, połączenia i układ pozostają bez zmian. Zobacz [AI Assistant › Modyfikowanie pojedynczego węzła](./ai-assistant.md#changing-one-node).

Przycisk jest ukryty w workflowach, do których masz uprawnienia tylko do wyświetlania.

## Przypięcie danych

Przypięcie danych umożliwia przypięcie danych wyjściowych węzła z ostatniego uruchomienia, co pozwala testować węzły podrzędne bez ponownego wykonywania przypiętego węzła.

### Gdzie to znaleźć

- **Panel właściwości** – Należy wybrać węzeł i przewinąć do sekcji **Przypięte dane**
- **Odznaka węzła** – Ikona pinezki pojawia się na węźle, gdy dane są przypięte

### Akcje

| Akcja | Opis |
|--------|-------------|
| **Przypnij** | Przypina dane wyjściowe ostatniego wykonania węzła (dostępne po uruchomieniu) |
| **Wyczyść** | Usuwa przypięte dane |
| **Edytuj** | Umożliwia bezpośrednią edycję przypiętego JSON; kliknięcie Zapisz stosuje zmiany |

### Zachowanie w trybie testowym

Podczas uruchamiania workflow w trybie testowym węzły z `pinnedData` pomijają wykonanie i korzystają z przypiętych danych wyjściowych. Służy to do:

- Testowania logiki podrzędnej bez wywoływania zewnętrznych API
- Debugowania wyrażeń odwołujących się do danych wyjściowych węzła
- Iterowania nad promptami lub warunkami z ustalonymi danymi przykładowymi

Uzupełnianie wyrażeń w edytorze wykorzystuje przypięte dane, gdy są dostępne, do sugerowania pól.

## Dzienniki wykonań

**Panel debugowania** (dolna szuflada) wyświetla dzienniki wykonań w czasie rzeczywistym podczas uruchomień workflow. Można również otworzyć uruchomione wykonanie produkcyjne z okna dialogowego Historia lub karty Board. Edytor dołącza do strumienia SSE tego uruchomienia, przywraca wyniki zakończonych węzłów i kontynuuje wyświetlanie animacji węzłów oraz dzienników w miarę rozpoczynania i kończenia kolejnych węzłów.

### Co jest wyświetlane

- **Wyniki węzłów** – Status poszczególnych węzłów (`success`, `error`, `skipped`, `running`), czas wykonania i dane wyjściowe
- **Wyniki końcowe** – Zagregowane dane wyjściowe z węzłów [Output](../nodes/output-node.md)
- **Postęp agenta** – Dla węzłów [Agent](../nodes/agent-node.md) — krok po kroku wywołania narzędzi i rozumowanie

### Akcje

- **Kopiuj jako JSON** – Kopiuje pełny dziennik wykonania do schowka
- **Otwórz w edytorze JSON** – Otwiera dziennik w JSON Hero lub JSON Editor Online do wglądu
- **Pobierz wygenerowane pliki** – Jeśli skill wygenerował pliki do pobrania (`_generated_files`), pojawia się przycisk Pobierz. Pojedynczy plik pobiera się bezpośrednio; wiele plików otwiera okno wyboru.

### Rozróżnienie od zakładki Logs

Panel debugowania wyświetla dzienniki **wykonania workflow** (wyniki węzłów, dane wyjściowe). [Zakładka Logs](../tabs/logs-tab.md) wyświetla dzienniki **kontenerów Docker** (backend, frontend, baza danych). <!-- pragma: allowlist secret -->

## Włącz / Wyłącz

Węzły można wyłączyć, aby były pomijane podczas wykonywania. Wyłączone węzły wyświetlają odznakę „off" i są przygaszone.

### Jak przełączać

| Metoda | Opis |
|--------|-------------|
| **Panel właściwości** | Wybierz węzeł → ikona zasilania (prawy górny róg) |
| **Menu kontekstowe** | Kliknij prawym przyciskiem myszy węzeł/węzły → Wyłącz lub Włącz |
| **Klawiatura** | Wybierz węzeł/węzły → naciśnij **D** (zobacz [Skróty klawiaturowe](./keyboard-shortcuts.md)) |

### Zaznaczenie wielokrotne

Gdy zaznaczonych jest wiele węzłów, Włącz/Wyłącz dotyczy wszystkich z nich. Menu kontekstowe wyświetla „Włącz", jeśli którykolwiek zaznaczony węzeł jest wyłączony, oraz „Wyłącz", jeśli wszystkie są włączone.

### Zachowanie w czasie wykonywania

Węzły z `active: false` są pomijane. Węzły podrzędne nie otrzymują danych z pominiętych węzłów. Służy to do tymczasowego wykluczenia węzłów bez ich usuwania.

Aby przełączać węzeł z wnętrza workflow zamiast ręcznie, należy użyć [Disable Node](../nodes/disable-node.md) i [Enable Node](../nodes/enable-node.md).
## Graf pamięci agenta

Węzły [Agent](../nodes/agent-node.md) z włączoną **[pamięcią trwałą](./agent-persistent-memory.md)** wyświetlają na węźle różową kontrolkę **mózgu**. Kliknięcie jej otwiera edytor grafu pamięci: encje są renderowane jako animowany graf siłowy grupowany według typu encji, z przeszukiwalnymi selektorami Źródło/Cel do dodawania relacji oraz panelem połączeń umożliwiającym przechodzenie między powiązanymi encjami. To samo okno dialogowe zawiera opcję **Share memory with other agents** (workflow → agent → odczyt lub odczyt/zapis) służącą do [współdzielenia pamięci między agentami](./agent-persistent-memory.md#sharing-with-other-agents). Gdy okno dialogowe jest otwarte, operacje cofnij/ponów na głównym canvasie są wstrzymane, aby edycja grafu zachowała własną historię.

**Filtrowanie grafu.** W lewym górnym rogu canvasa znajduje się kontrolka wyszukiwania, zwinięta do przycisku skrótu, dopóki nie kliknie się jej lub nie naciśnie **Ctrl/Cmd+F**. Dopasowuje ona nazwę encji, jej typ oraz każdy klucz i wartość atrybutu, a także typ relacji (`parent_of`) i jej właściwości; dopasowana relacja pociąga za sobą obie swoje encje. Wszystkie terminy rozdzielone białymi znakami muszą zostać dopasowane. Dopasowana encja pociąga za sobą całe swoje sąsiedztwo — każdą relację, w której uczestniczy, oraz encję po drugiej stronie każdej z nich — dzięki czemu dopasowanie nigdy nie pozostaje niepołączoną kropką. Dopasowana relacja pociąga za sobą wyłącznie dwie encje, które łączy, i na tym poprzestaje, ponieważ wyszukiwanie typu relacji jest pytaniem o tę relację, a nie o wszystko, co jest do niej przyłączone. Wszystko pozostałe jest ukrywane całkowicie — nie wygaszane — na canvasie oraz na liście **All edges**, a plakietka pokazuje, ile z łącznej liczby encji pozostało. Znak **✕** wewnątrz pola najpierw czyści zapytanie, a przy drugim naciśnięciu zamyka pole. Klawisz Escape rozwija tę samą sekwencję, od najbardziej wewnętrznego elementu: najpierw czyści zapytanie, następnie zamyka pole wyszukiwania, potem opuszcza rozwinięty widok canvasa, a okno dialogowe zamyka dopiero wtedy, gdy żaden z tych elementów nie jest otwarty. Wyczyszczenie przywraca pełny graf z każdą encją z powrotem na swoim miejscu.

**Ręczne rozmieszczanie encji.** Przeciągnięcie encji przypina ją w miejscu upuszczenia, dzięki czemu automatyczny układ rozmieszcza resztę grafu wokół niej, zamiast przywracać ją na poprzednie miejsce. Przeciągnięcie zaznaczonej encji przenosi wraz z nią bezpośrednio połączone encje, zachowując kształt klastra; przeciągnięcie dowolnej innej encji przenosi tylko ją. **Tidy layout** (przycisk różdżki) zwalnia każdą przypiętą encję i ponownie uruchamia automatyczny układ.

## Extract to Sub-Workflow

Konwertuje zaznaczone węzły na wielokrotnego użytku pod-workflow i zastępuje je węzłem [Execute](../nodes/execute-node.md).

### Jak używać

1. Zaznacz jeden lub więcej węzłów na canvasie
2. Kliknij prawym przyciskiem → **Extract to Sub-Workflow**
3. Wprowadź nazwę (oraz opcjonalny opis) nowego workflow
4. Kliknij **Extract**

### Co się dzieje

- Tworzony jest nowy workflow z zaznaczonymi węzłami
- Wejścia zewnętrzne (krawędzie spoza zaznaczenia) stają się polami [Input](../nodes/input-node.md) pod-workflow
- Wyjścia zewnętrzne (krawędzie do węzłów spoza zaznaczenia) są mapowane na [Output](../nodes/output-node.md) pod-workflow
- Zaznaczone węzły są zastępowane pojedynczym węzłem [Execute](../nodes/execute-node.md), który wywołuje nowy workflow
- Mapowania wejść/wyjść są zachowywane automatycznie

### Przypadki użycia

- Ponowne wykorzystanie sekwencji węzłów w wielu workflow
- Uproszczenie złożonego workflow poprzez grupowanie powiązanej logiki
- Tworzenie modularnych, testowalnych pod-workflow

## Run with cURL

Przycisk **cURL** na pasku narzędzi edytora (w prawym górnym rogu) otwiera okno dialogowe służące do zbudowania i skopiowania polecenia cURL wyzwalającego workflow przez API.

- Wybierz tryb treści żądania workflow (`Defined` lub `Generic`)
- Ustaw typ uwierzytelniania (Anonymous, JWT lub Header Auth)
- Skonfiguruj buforowanie odpowiedzi i ograniczanie liczby żądań
- Przełącz strumieniowanie SSE i dostosuj komunikaty startowe dla poszczególnych węzłów
- Edytuj treść żądania
- W trybie Generic panel uruchamiania na canvasie używa tej samej surowej treści JSON co okno dialogowe cURL
- Kliknij **Copy cURL**, aby skopiować gotowe do uruchomienia polecenie

Pełne szczegóły okna dialogowego znajdują się w sekcji [Webhooks](./webhooks.md#run-with-curl-dialog), a protokół zdarzeń opisano w [SSE Streaming](./sse-streaming.md).

## Powiązane

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Wszystkie skróty klawiaturowe canvasa i edytora
- [Agent Persistent Memory](./agent-persistent-memory.md) – Działanie grafu pamięci i API
- [Execute Node](../nodes/execute-node.md) – Wywołuje pod-workflow
- [Expression DSL](./expression-dsl.md) – Odwołania i dane przypięte
- [Workflow Structure](./workflow-structure.md) – Format węzłów i krawędzi
- [Download & Import](./download-import.md) – Eksport i import workflow jako JSON
- [Node Types](./node-types.md) – Wszystkie typy węzłów
- [Logs Tab](../tabs/logs-tab.md) – Logi kontenerów Docker
- [Execution History](./execution-history.md) – Minione uruchomienia
- [Templates](../tabs/templates-tab.md) – Zapisuj i wykorzystuj ponownie workflow oraz węzły
- [Contextual Showcase](./contextual-showcase.md) – Kompaktowy przewodnik po stronie dostępny w edytorze

- [Współpraca na canvasie](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
