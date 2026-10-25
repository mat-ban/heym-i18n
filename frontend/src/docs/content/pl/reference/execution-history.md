# Historia wykonań

Historia wykonań rejestruje uruchomienia workflow: dane wejściowe, dane wyjściowe, wyniki węzłów, status oraz źródło triggera. Służy do obserwowania aktywnego uruchomienia produkcyjnego, przeglądania przeszłych uruchomień, debugowania błędów lub ponownego uruchomienia z tymi samymi danymi wejściowymi za pomocą funkcji **Bring to Canvas**.

## Przegląd

Każde wykonanie przechowuje:

| Pole | Opis |
|-------|-------------|
| **Inputs** | Treść żądania lub dane wejściowe uruchomienia (np. `text` dla węzła wejściowego) |
| **Outputs** | Dane wyjściowe na poziomie workflow |
| **Node results** | Dane wyjściowe, status i czas wykonania dla poszczególnych węzłów |
| **Status** | `success`, `error`, `pending`, `skipped` lub `failed` (zobacz [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Sposób wyzwolenia uruchomienia (zobacz [Triggers](./triggers.md)) |

## Dostęp do historii

| Lokalizacja | Zakres |
|----------|-------|
| Pasek narzędzi **edytora** | Tylko bieżący workflow |
| Nagłówek widoku **Docs** | Tylko bieżący workflow |
| Nagłówek **Dashboard** (zakładka Chat) | Wszystkie workflow + uruchomienia chat/asystenta |
| Nagłówek widoku **Evals** | Wszystkie workflow + uruchomienia chat/asystenta |

Kliknij przycisk **History** (ikona zegara), aby otworzyć okno dialogowe.

## Historia dla pojedynczego workflow a cała historia

- **Dla pojedynczego workflow** (Editor, Docs): Wyświetla uruchomienia dla otwartego workflow. Użyj **Clear history**, aby usunąć uruchomienia tylko dla tego workflow.
- **Cała historia** (Dashboard, Evals): Wyświetla uruchomienia ze wszystkich workflow oraz sesji chat/asystenta. Zakres odpowiada dostępowi do workflow: workflow, których jesteś właścicielem, workflow udostępnione bezpośrednio oraz workflow udostępnione zespołowi, do którego należysz. Użyj **Clear all history**, aby usunąć wszystkie posiadane rekordy. Historia udostępnionych workflow zostanie zachowana.

## Bring to Canvas

**Bring to Canvas** wczytuje dane wejściowe i wyniki węzłów wybranego uruchomienia do bieżącego workflow.

### Co jest wczytywane

- **Inputs** → Panel danych wejściowych uruchomienia (np. `text` dla węzła wejściowego lub pola niestandardowe)
- **Node results** → Panel wyników wykonania pokazuje przeszłe dane wyjściowe dla każdego węzła
- **Execution result** → Status, dane wyjściowe i czasy z uruchomienia

### Zachowanie w zależności od kontekstu

- **W edytorze** (historia dla pojedynczego workflow): Stosuje zmiany natychmiast do otwartego workflow i zamyka okno dialogowe.
- **Z całej historii** (Dashboard/Evals): Przechodzi do edytora workflow, a następnie stosuje dane po załadowaniu edytora. Dostępne tylko dla uruchomień workflow — nie dla uruchomień chat/asystenta.

### Bezpośredni link do wykonania

Otwarcie workflow pod adresem `/workflows/{workflowId}/{executionId}` automatycznie wczytuje to wykonanie na canvas — tak samo jak wybranie uruchomienia i kliknięcie **Bring to Canvas**. Dzięki temu konkretne przeszłe uruchomienie można udostępnić jako URL. Jeśli wykonanie nie zostanie znalezione (nieprawidłowy lub usunięty identyfikator), edytor wczytuje zwykły workflow.

### Przypadki użycia

- Ponowne uruchomienie workflow z tymi samymi danymi wejściowymi
- Debugowanie nieudanego uruchomienia poprzez analizę danych wejściowych i wyników węzłów
- Porównywanie danych wyjściowych między uruchomieniami

## Zapytaj AI

Oba okna dialogowe historii mają przycisk **Zapytaj AI** (ikona iskry) obok tytułu. Otwiera on [zakładkę Chat](../tabs/chat-tab.md#asking-about-a-run) w nowej konwersacji z workflowem i wybranym uruchomieniem dołączonymi jako usuwalne chipy. Zapytaj, dlaczego uruchomienie było powolne, co się nie powiodło, lub poproś Chat o naprawienie workflowu. Chat odczytuje dokładnie to uruchomienie, w tym ślad poszczególnych węzłów i błędy.

W oknie dialogowym All History opcja **Zapytaj AI** pojawia się tylko wtedy, gdy wybrane jest uruchomienie workflowu; uruchomienia chatu i asystenta jej nie wyświetlają.

## Oś czasu uruchomienia

W szczegółach uruchomienia przycisk **Oś czasu** (ikona stopera) obok **Rozwiń wszystko** zamienia listę **Kroki** na oś czasu spanów. Gdy oś czasu jest widoczna, ten sam przycisk ma etykietę **Dzienniki**; kliknij go, aby powrócić do listy. W All History przycisk pojawia się tylko dla uruchomień workflow. Oś czasu rysuje pasek dla każdego węzła w momencie jego rozpoczęcia, dzięki czemu widać, ile trwał dany węzeł i które działały równolegle. Najedź na pasek, aby zobaczyć czas trwania; kliknij go, aby otworzyć ten sam inspektor szczegółów, co w [osi czasu wykonania](#execution-timeline-details) edytora. Wybrany widok pozostaje aktywny tak długo, jak długo otwarte jest okno dialogowe.

Uruchomienia zarejestrowane przed zapisywaniem czasów rozpoczęcia węzłów są rozmieszczane kolejno według czasu trwania.

## Execution Highlights

Po uruchomieniu na żywo — lub po **Bring to Canvas** — w **prawym górnym rogu Canvas** pojawia się możliwe do zamknięcia okno **Execution Highlights**. To szybki sposób na sprawdzenie, *co wygenerował każdy węzeł*, wymienione od góry do dołu w kolejności wykonania. Zamknij je przyciskiem **✕**; otworzy się ponownie przy następnym uruchomieniu.

### Co jest wyświetlane

| Rekord | Źródło | Automatycznie? |
|--------|--------|-------|
| **Input** | Parametry wejściowe uruchomienia (węzeł wejściowy/triggera) | Tak |
| **Output** | Wynik węzła wyjściowego — lub, jeśli go nie ma, komunikat ostatniego węzła | Tak |
| **Agent / LLM** | Dane wyjściowe każdego węzła agenta lub LLM | Tak |
| **Output** | Dowolny inny węzeł z włączoną opcją **Highlight Node Output** | Opcjonalnie |

Węzły już automatycznie wyróżnione (input / output / last / agent / llm) nigdy nie pojawiają się dwukrotnie, nawet jeśli włączysz również przełącznik.

### Każdy rekord

- Wyświetla `Node — message…` z pierwszymi **250 znakami**; kliknij wiersz, aby go rozwinąć i wyrenderować **pełny komunikat jako Markdown**, z przyciskiem **Copy**.
- Węzeł, który uruchomił się wielokrotnie (np. w pętli), wyświetla `Node (N)` z selektorem `‹ i / N ›` — wybierz, które uruchomienie chcesz zobaczyć; selektor każdego węzła jest niezależny.

### Highlight Node Output

Każdy węzeł **z wyjątkiem Agent i LLM** ma pole wyboru **Highlight Node Output** w panelu właściwości (domyślnie wyłączone). Włącz je, aby dodać dane wyjściowe tego węzła do okna. Na węzłach wyróżnionych na canvasie pojawia się mała plakietka ✦. W [workflow DSL](./expression-dsl.md) jest to pole danych węzła `"highlight": true` (domyślnie `false`).

### Na dashboardach

Karty widgetów dashboardu, które uruchomiły workflow, pokazują przycisk ✦ **Execution highlights** w nagłówku karty; kliknij go, aby otworzyć to samo okno dla uruchomienia tego widgetu, z wygenerowanymi danymi wyjściowymi widgetu jako wyróżnionym rekordem.
## Uruchamianie wykonań

Oba okna historii wyświetlają **aktualnie uruchomione wykonania** na początku listy, przed poprzednimi uruchomieniami.

- Obracający się wskaźnik i etykieta **Running** pojawiają się wraz z czasem rozpoczęcia
- Kliknij **Open live**, aby podłączyć edytor do dokładnie tego uruchomienia bez jego restartowania
- Canvas najpierw przywraca węzły, które zostały już ukończone, a następnie odbiera zdarzenia
  `node_start`, `node_complete` oraz końcowe zdarzenie wykonania przez SSE
- Bieżący węzeł pulsuje na canvasie, węzły znajdujące się dalej w przepływie zachowują animację oczekiwania, a
  panel Debug dodaje każdy wynik w miarę jego pojawiania się — tak samo jak przy uruchomieniu z edytora
- Kliknij **Cancel**, aby natychmiast zatrzymać wykonanie
- Anulowanie z dowolnego okna (Editor lub Dashboard) zamyka również aktywny strumień SSE w każdej otwartej karcie canvasu dla danego workflow, dzięki czemu stan edytora resetuje się w sposób czysty
- Po anulowaniu wpis uruchomienia znika przy następnym odświeżeniu; naciśnij **Refresh**, aby zaktualizować listę ręcznie
- Anulowanie uruchomienia, które już się zakończyło, nie przynosi żadnego efektu

Uruchomienia oczekujące na [slot współbieżności](./webhooks.md#concurrency-limit-and-queued-runs) są wymienione w tej samej sekcji z etykietą **Queued 2/5**, miejscem w kolejce oraz rozmiarem kolejki. Nie mają przycisku **Open live**, ponieważ nic jeszcze nie działa; **Cancel** usuwa oczekujące uruchomienie z kolejki i zapisuje je jako `cancelled`. Uruchomienie, które czekało dłużej niż maksymalny czas oczekiwania workflow, jest rejestrowane jako `expired`, a uruchomienie odrzucone z powodu pełnej kolejki jako `queue_full`; oba mają własną odznakę na liście uruchomień.

Adres URL podglądu na żywo to `/workflows/{workflowId}/{executionId}`. Obserwator działa w trybie tylko do odczytu: opuszczenie
edytora jedynie rozłącza daną kartę przeglądarki i nigdy nie zatrzymuje workflow. Aktywne migawki
są współdzielone przez PostgreSQL, więc otwarcie uruchomienia działa nawet wtedy, gdy trigger i żądanie edytora
trafią na różnych workerów backendu.

## Odzyskiwanie po awarii

Jeśli serwer zostanie zrestartowany (wdrożenie, restart kontenera lub awaria) w trakcie działania workflow, worker tego uruchomienia zatrzymuje się w połowie wykonania. Heym automatycznie odzyskuje takie przerwane uruchomienia, zamiast pozostawiać je w stanie **Running**.

- Przy następnym starcie wybrany proces lidera wykrywa osierocone uruchomienia — natychmiast w przypadku łagodnego restartu lub w ciągu około 60 sekund w przypadku twardej awarii (gdy heartbeaty wyraźnie ustaną).
- Odzyskane uruchomienia są **ponownie uruchamiane od początku z tymi samymi danymi wejściowymi** (nie są wznawiane od miejsca zatrzymania), z użyciem bieżącej definicji workflow. Po zakończeniu zapisują standardowy wpis końcowy (np. `success`), więc historia pokazuje uruchomienie jako ukończone.
- Uruchomienie jest ponawiane **jednokrotnie**. Jeśli próba odzyskania również zostanie przerwana — lub workflow został w międzyczasie usunięty — wpis zostaje zapisany jako `failed`.
- Działa to identycznie w przypadku pojedynczego kontenera i wdrożeń z wieloma workerami; tylko lider wykonuje odzyskiwanie, więc uruchomienie nigdy nie jest odzyskiwane dwukrotnie przez różnych workerów.

### Przełącznik automatycznego odzyskiwania

Panel **Execution Log** (uruchomienia) w edytorze zawiera pole wyboru **Auto-recover**, **domyślnie włączone** dla każdego workflow.

- **Włączone**: przerwane uruchomienia tego workflow są ponawiane w sposób opisany powyżej.
- **Wyłączone**: przerwane uruchomienia nie są ponawiane i są zapisywane ze statusem `skipped`.

> Uruchomienia pod-workflow nie są odzyskiwane niezależnie — są ponownie napędzane przez odzyskane uruchomienie nadrzędne. Triggery z własnym mechanizmem ponownego dostarczania (RabbitMQ, harmonogramy/cron, IMAP) mogą również dostarczyć zdarzenie ponownie po restarcie, więc odzyskane uruchomienie może sporadycznie wykonać się dwukrotnie.

## Oczekiwanie na przegląd przez człowieka

Uruchomienia, które zatrzymują się w celu zatwierdzenia w ramach [Human-in-the-Loop](./human-in-the-loop.md), są natychmiast zapisywane w historii ze statusem `pending`.

- Węzeł agenta oczekujący na przegląd przechowuje payload przeglądu zawierający `reviewUrl`, `draftText` oraz `expiresAt`
- Dowolne węzły podłączone do uchwytu `review` agenta mogą również zostać uruchomione przed odpowiedzią człowieka, a ich wyniki są przechowywane w tym samym wpisie historii o statusie pending
- Okna historii wyświetlają link do przeglądu, aby właściciele mogli go skopiować lub otworzyć
- Okna historii oraz panel Debug w edytorze pokazują ostateczną decyzję człowieka po wznowieniu uruchomienia
- Gdy recenzent zaakceptuje, edytuje lub odrzuci szkic, ten sam wpis historii zostaje zaktualizowany o końcowy wynik wykonania
- Jeśli to samo uruchomienie zatrzymuje się w ramach HITL więcej niż raz, wpis historii pozostaje ten sam, a każdy punkt kontrolny otrzymuje własny jednorazowy link do przeglądu

Jest to szczególnie przydatne w przypadku uruchomień portalu oraz długotrwałych workflow, które mogą oczekiwać godzinami lub dniami przed kontynuacją.

## Kopiowanie

Użyj przycisku **Copy** obok sekcji Inputs lub Outputs, aby skopiować JSON do schowka.

## Czyszczenie historii

- **Dla pojedynczego workflow**: W oknie historii edytora kliknij **Clear history**, aby usunąć uruchomienia bieżącego workflow.
- **Cała historia**: W oknie historii Dashboard/Evals kliknij **Clear all history**, aby usunąć wszystkie posiadane rekordy wykonań. Uruchomienia ze współdzielonych workflow są zachowywane. Tej operacji nie można cofnąć.

## Szczegóły osi czasu wykonania

Gdy w edytorze otwarty jest **Execution Log**, kliknij przycisk timera, aby wyświetlić oś czasu wykonania. Wybierz przedział, aby otworzyć wbudowany inspektor szczegółów, który przejmuje obszar wierszy. Pokazuje on status wybranego kroku, czas trwania, liczbę prób, informacje o ponowieniach, błędy, identyfikator trace oraz zwięzły podgląd danych wyjściowych. Dane wyjściowe typu obiekt i tablica korzystają z tego samego podglądu `JsonTree` co reszta panelu Debug; wartości skalarne używają podglądu tekstowego. Gdy krok zwraca obrazy (zrzuty ekranu Playwright, wygenerowane obrazy, pliki graficzne lub obrazy base64 w treści żądania, znalezione w dowolnym miejscu danych wyjściowych), pojawiają się one jako miniatury nad danymi wyjściowymi, a JSON zawiera krótki placeholder w miejscu surowego base64. Kliknij miniaturę, aby otworzyć ją w lightboxie; przyciski strzałek lub klawisze ←/→ przechodzą przez każdy obraz w uruchomieniu, ze licznikiem takim jak `2 / 5`. Użyj **Open trace** dla spanów LLM i Agent, gdy dostępny jest identyfikator trace.
## Szczegóły węzła na urządzeniu mobilnym

Na telefonie edytor wyświetla drzewo workflow na pełnym ekranie zamiast swobodnego canvasu. Należy dotknąć węzła drzewa z zarejestrowanym wynikiem, aby otworzyć jego wykonanie jako szczegóły na pełnym ekranie. Widok udostępnia oddzielne zakładki **Dane wejściowe**, **Dane wyjściowe** oraz **Błędy**. Zakładka danych wyjściowych prezentuje zarejestrowany wynik i oferuje opcję **Kopiuj dane wyjściowe**; zakładka danych wejściowych pokazuje konfigurację wybranego węzła, a zakładka błędów wyświetla zarejestrowany błąd, gdy węzeł zakończył się niepowodzeniem. Aby powrócić do drzewa, należy użyć opcji **Powrót do workflow** lub przycisku zamknięcia.

Okna dialogowe historii canvasu i dashboardu utrzymują elementy sterujące uruchomieniem w jednym wierszu, a dostępne filtry tagów i instancji umieszczają w responsywnej siatce. Ich menu filtrów korzystają z tego samego selektora w aplikacji, dzięki czemu zaznaczony znacznik wyboru ma spójny margines i linię bazową z etykietą każdej opcji.

## Powiązane

- [Triggery](./triggers.md) – Jak uruchamiane są workflow; historia rejestruje `trigger_source` (w tym `board` dla uruchomień rozpoczętych przez przenoszenie kart w [Board](../tabs/board-tab.md) i działania następcze)
- [Human-in-the-Loop](./human-in-the-loop.md) – Adresy URL oczekującego przeglądu i zachowanie przy wznowieniu
- [Historia edycji](./edit-history.md) – Kontrola wersji zapisów workflow (przywracanie, porównywanie)
- [Szybki start](../getting-started/quick-start.md) – Zbuduj i uruchom pierwszy workflow
- [Zakładka Workflows](../tabs/workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
