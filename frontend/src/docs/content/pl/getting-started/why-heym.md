# Dlaczego Heym

Heym to infrastruktura do uruchamiania i zarządzania agentami AI w środowisku produkcyjnym. Jedno samodzielnie hostowane środowisko uruchomieniowe obejmuje każdy etap cyklu życia agenta.

Prototyp agenta wymaga modelu, promptu i kilku narzędzi. Agent produkcyjny potrzebuje dodatkowo triggerów i ponowień, zapisanego stanu w momencie wstrzymania w oczekiwaniu na osobę, rejestru każdego wywołania modelu i narzędzia, kosztu każdego uruchomienia, testów przed wdrożeniem zmiany oraz jasno określonych granic tego, co agent może robić samodzielnie. Heym przechowuje to wszystko w jednym miejscu, dzięki czemu system zaprojektowany na canvasie jest tym samym systemem, który jest uruchamiany. Buduj systemy agentowe, a następnie uruchamiaj je z pełnym zaufaniem.

## Jedno środowisko uruchomieniowe dla cyklu życia agenta

| Etap | Co oferuje Heym |
|---|---|
| **Budowanie** | Komponuj agentów i deterministyczne kroki na canvasie, generuj je za pomocą [AI Assistant](../reference/ai-assistant.md) lub rozpocznij od [Szablonów](../tabs/templates-tab.md) i przenośnych umiejętności. |
| **Orkiestracja** | Koordynuj agentów, [pod-agentów](../reference/agent-architecture.md), agentów kodujących, RAG, automatyzację przeglądarki i narzędzia z jawnym przepływem danych oraz [równoległym wykonywaniem](../reference/parallel-execution.md). |
| **Uruchamianie** | Uruchamiaj przepływy z [webhooków](../reference/webhooks.md), harmonogramów i [triggerów](../reference/triggers.md) zdarzeń, z ponowieniami na poziomie węzła, [obsługą błędów](../nodes/error-handler-node.md) i [rozłożeniem obciążenia](../reference/cluster.md) między instancjami. |
| **Obserwacja** | Analizuj każde wykonanie poprzez [historię](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), koszt USD na uruchomienie, uruchomienia na żywo na canvasie, [analitykę](../tabs/analytics-tab.md), [alerty](../tabs/alerts-tab.md) oraz eksport [OpenTelemetry](../reference/opentelemetry.md). |
| **Ewaluacja** | Testuj prompty i modele względem oczekiwanych wyników w [Ewaluacjach](../tabs/evals-tab.md), z ocenianiem LLM-as-Judge i porównaniem modeli obok siebie. |
| **Kontrola** | Utrzymuj kontrolę człowieka dzięki [punktom kontrolnym przeglądu](../reference/human-in-the-loop.md) i [guardrails](../reference/guardrails.md), a także zarządzaj dostępem za pomocą szyfrowanych [danych logowania](../reference/credentials.md), [zespołów](../reference/teams.md), [single sign-on](../reference/sso.md) i [dziennika audytu](../reference/audit.md). |
| **Udostępnianie** | Udostępniaj przepływy przez REST i [SSE](../reference/sse-streaming.md), jako narzędzia [MCP](../tabs/mcp-tab.md), jako interfejsy Chat [Portal](../reference/portal.md) oraz jako widżety [dashboardu](../tabs/dashboard-tab.md). |

## Budowanie

### AI Assistant: buduj przepływy za pomocą języka naturalnego

[AI Assistant](../reference/ai-assistant.md) to panel czatu wewnątrz edytora przepływów. Opisz, czego potrzebujesz, na przykład „utwórz przepływ, który przyjmuje dane wejściowe od użytkownika, przeszukuje moją bazę wiedzy i odpowiada za pomocą GPT-4o”, a asystent wygeneruje węzły i krawędzie, które zostaną natychmiast zastosowane na canvasie.

- Wykorzystuje własne dane logowania LLM (dowolny obsługiwany model)
- Obsługuje **wprowadzanie głosowe** w celu projektowania przepływów bez użycia rąk
- Automatycznie stosuje prawidłowy JSON przepływu z odpowiedzi AI na canvasie
- Strumieniuje odpowiedzi w czasie rzeczywistym

Asystent działa bezpośrednio w edytorze i strumieniuje węzły na canvas w czasie rzeczywistym, a wszystko, co generuje, pozostaje edytowalne tak samo jak węzły umieszczone ręcznie.

### System umiejętności

Umiejętności to przenośne pakiety możliwości — plik instrukcji `SKILL.md` oraz opcjonalne skrypty Python — które można przypisać do dowolnego węzła Agent.

- Instrukcje umiejętności są dołączane na początku promptu systemowego agenta
- Pliki Python w umiejętności stają się wywoływalnymi narzędziami
- Umiejętności są wielokrotnego użytku w różnych przepływach i można je udostępniać jako archiwa `.zip`

Jest to analogiczne do przekazania agentowi opisu stanowiska i skrzynki z narzędziami w jednym pakiecie.

### Workflow Analyzer: informacja zwrotna uwzględniająca uruchomienia

Panel [Analizy przepływu](../reference/workflow-analysis.md) to wbudowane w edytor narzędzie do dokumentacji i informacji zwrotnej, świadome uruchomień. Kliknij **Analyze**, wybierz dane logowania LLM i model, a Heym wygeneruje edytowalny raport Markdown dla bieżącego przepływu.

W przeciwieństwie do statycznej notatki analizator najpierw uruchamia przepływ, gdy jest to możliwe, i dołącza wynik wykonania do promptu. Raport obejmuje obszary do poprawy, cel przepływu oraz opis krok po kroku działania węzłów. Gdy raport już istnieje, **Reanalyze** strumieniuje osobny podgląd, dzięki czemu można zaakceptować nową wersję lub zachować bieżący udostępniony dokument.

## Orkiestracja
### Wbudowane węzły LLM i Agent

[Węzeł Agent](../nodes/agent-node.md) w Heym uruchamia ściśle zintegrowaną pętlę wywołań narzędzi z wbudowanymi narzędziami Python, połączeniami MCP oraz przenośnym systemem umiejętności (skills) — wszystko zaprojektowane z myślą o agentach produkcyjnych.

Zwykły [węzeł LLM](../nodes/llm-node.md) w Heym również wykracza poza pojedynczy krok typu prompt-odpowiedź. Dla obsługiwanych endpointów OpenAI oraz endpointów zgodnych z OpenAI może przełączyć się w **tryb Batch API**, dzięki czemu jeden węzeł przesyła tablicę promptów w tańszym, natywnym dla dostawcy żądaniu batchowym. Canvas udostępnia wówczas dedykowaną gałąź `batchStatus`, która jest wyzwalana, gdy batch przechodzi przez stany takie jak `pending`, `processing` i `completed`.

Oznacza to, że węzeł LLM może robić dwie rzeczy jednocześnie:

- Realizować główne żądanie batchowe i zwracać końcowe wyniki dla poszczególnych pozycji na standardowej gałęzi
- Wyzwalać logikę powiadomień lub logowania przy każdej istotnej zmianie statusu batcha, bez zamieniania przepływu w niestandardową pętlę odpytywania

Wykonanie batchowe jest podstawowym elementem workflow LLM, z weryfikacją możliwości dostawcy i modelu w interfejsie węzła.

**Węzeł Agent** stanowi rdzeń orkiestracji agentów w Heym:

- **Wywoływanie narzędzi** – Agent iteruje po wywołaniach narzędzi w pętli, aż wygeneruje ostateczną odpowiedź
- **Narzędzia Python** – Definiuj niestandardowe narzędzia bezpośrednio w pełnym Pythonie; agent wywołuje je w czasie wykonania
- **Połączenia MCP** – Połącz się z dowolnym serwerem [Model Context Protocol](https://modelcontextprotocol.io/) (stdio lub SSE), a agent automatycznie otrzyma wszystkie jego narzędzia
- **Umiejętności (Skills)** – Upuść plik `.zip` lub `.md` na agenta, aby rozszerzyć jego kontekst systemowy i dodać narzędzia Python
- **Wywołania pod-workflow** – Agent może wywoływać inne workflow Heym jako narzędzia, komponując złożone zachowania bez niestandardowego kodu

Pełne informacje można znaleźć w [Węzeł Agent](../nodes/agent-node.md) oraz [Architektura agenta](../reference/agent-architecture.md).

### Orkiestracja wielu agentów

Heym obsługuje **wzorzec orkiestratora** z podstawowymi elementami wizualnymi:

- Jeden agent pełni rolę **orkiestratora** (`isOrchestrator: true`) i otrzymuje narzędzie `call_sub_agent`
- Deleguje zadania do nazwanych **pod-agentów** na tym samym canvasie
- Pod-agenci mogą sami wywoływać innych agentów lub pod-workflow (maksymalna głębokość: 5)
- **Wykonanie równoległe**: Gdy orkiestrator wywołuje wielu pod-agentów w jednej turze, uruchamiają się oni równolegle, co przyspiesza uzyskanie wyników

Umożliwia to architektury takie jak agent planujący, który kieruje pracę do badacza, programisty i podsumowywacza — wszystko połączone wizualnie, bez niestandardowego kodu orkiestracji.

Szczegóły wykonania można znaleźć w [Architektura agenta](../reference/agent-architecture.md).

### Agenci kodujący jako węzły workflow

Heym dostarcza dwa węzły, które uruchamiają prawdziwego agenta kodującego jako krok workflow, a nie uzupełnianie czatu:

- **[Węzeł Codex](../nodes/codex-node.md)** – Uruchamia OpenAI Codex CLI w izolowanym obszarze roboczym Heym na repozytorium GitHub. Obsługuje **Sign in with ChatGPT** (PKCE OAuth na subskrypcji Plus/Pro, bez kosztu API za token) lub token dostępu, klonuje repozytorium, pozwala Codex edytować kod i zwraca `summary`, `diff`, `changedFiles` oraz wersję roboczą `pullRequestUrl`.
- **[Węzeł OpenCode Go](../nodes/opencode-go-node.md)** – Ten sam workflow repozytorium przez niezależny od dostawcy gateway OpenCode (Kimi, DeepSeek, Qwen i inne), wykonywany w **wzmocnionym kontenerze jednorazowym**: wszystkie uprawnienia odebrane, główny system plików tylko do odczytu, limity pid/pamięci/CPU. Token GitHub pozostaje poza sandboxem: Heym wykonuje każdą operację git i GitHub po stronie hosta, więc wygenerowany kod nie może wykraść danych uwierzytelniających do push.

Oznacza to, że workflow może zdiagnozować błąd z webhooka, przekazać repozytorium agentowi kodującemu, poczekać na wersję roboczą PR i opublikować link na Slacku — w pełni automatycznie, z limitami zasobów konfigurowalnymi dla każdego wdrożenia.

### Wbudowany potok RAG

Heym zawiera [węzeł RAG / Vector Store](../nodes/rag-node.md) oraz zarządzaną zakładkę [Magazyny wektorowe](../tabs/vectorstores-tab.md). Można:

- Wybrać backend wektorowy: **Qdrant** (serwer zewnętrzny) lub **Postgres (pgvector)**, który przechowuje wektory w bazie danych Heym bez konieczności uruchamiania dodatkowej usługi
- Wstawiać dokumenty do magazynu wektorowego bezpośrednio z węzła workflow
- Wykonywać wyszukiwanie semantyczne i przekazywać wyniki do węzła LLM lub Agent
- Odwoływać się do wyników za pomocą wyrażeń takich jak `$ragNode.results.map("item.payload.content").join("\n\n")`

W Heym RAG to dwa węzły z pełną kontrolą nad embeddingami i wyszukiwaniem.

### Automatyzacja przeglądarki z Playwright

[Węzeł Playwright](../nodes/playwright-node.md) to automatyzacja przeglądarki pierwszej strony na canvasie.

- **Tryb kroków** – Wizualnie komponuj akcje nawigacji, klikania, wpisywania, wypełniania, zrzutu ekranu, ekstrakcji i przewijania
- **Kroki AI z automatycznym naprawianiem** – Opisz akcję w języku naturalnym, a LLM wygeneruje akcje Playwright; nieudane selektory mogą być naprawiane automatycznie, a wygenerowane kroki można buforować, aby pominąć przyszłe wywołania LLM
- **Tryb Run Code** – Przełącz węzeł na pełny Playwright Python dla złożonych przepływów (domyślnie wyłączony; po włączeniu działa w wzmocnionym sandboxie Heym)
- **Sesje uwierzytelnione** – Przywróć pliki cookie/`storageState` przed uruchomieniem, zweryfikuj logowanie sprawdzeniem selektora i w razie potrzeby użyj skryptowych kroków logowania
- **Przechwytywanie sieci** – Opcjonalnie zbieraj odpowiedzi JSON, nagłówki, pliki cookie i pamięć przeglądarki wraz z wynikami

Heym traktuje przeglądarkę jako zwykły węzeł z tymi samymi wyrażeniami, danymi logowania i obsługą błędów co wszystko inne.
### Expression DSL

[Expression DSL](../reference/expression-dsl.md) w Heym zapewnia przejrzystą i wydajną składnię do odwoływania się do danych z węzłów poprzedzających:

- `$input.text` – dane węzła wejściowego
- `$nodeName.field` – pole wyjściowe dowolnego węzła poprzedzającego
- `$global.variableName` – trwałe zmienne globalne
- Funkcje pomocnicze tablic: `.first()`, `.map("field")`, `.join("\n")`

Wyrażenia działają w każdym polu tekstowym, w tym w promptach, nagłówkach HTTP, warunkach i wartościach ustawianych, dzięki czemu dane przepływają między krokami w sposób jawny. DSL łączy wydajność i czytelność, nie wymagając pełnej znajomości JavaScript.

## Uruchamianie

### Triggery, ponowne próby i ścieżki błędów

Workflow może być uruchomiony z wielu miejsc. Węzły [Input](../nodes/input-node.md) odbierają [webhooki](../reference/webhooks.md) HTTP, węzeł [Cron](../nodes/cron-node.md) działa według harmonogramu, a [triggery](../reference/triggers.md) zdarzeń uruchamiają wykonania z Telegrama, Discorda, Slacka, skrzynek IMAP, strumieni WebSocket, kolejek RabbitMQ, przesłanych plików oraz zdarzeń platformy Heym.

Błędy są obsługiwane wewnątrz grafu. Każdy węzeł może ponowić próbę po niepowodzeniu z określoną liczbą prób i odstępem między nimi; każda próba jest rejestrowana w [historii wykonań](../reference/execution-history.md), a węzeł [Error Handler](../nodes/error-handler-node.md) uruchamia się automatycznie, gdy węzeł zawiedzie — dzięki temu odzyskiwanie jest częścią samego workflow.

### Równoległe wykonywanie DAG

Executor workflow w Heym wykorzystuje scheduler oparty na grafie skierowanym acyklicznym (DAG). Niezależne węzły uruchamiają się równolegle automatycznie, bez konieczności konfiguracji.

- Węzły na tym samym poziomie zależności są wysyłane współbieżnie do puli wątków (`max_workers=8`)
- Gdy tylko dowolny węzeł zakończy działanie, jego węzły następne są planowane
- Węzeł [Merge](../nodes/merge-node.md) łączy wyniki równoległych gałęzi
- Wiele wykonań workflow przebiega współbieżnie; każde wykonanie jest w pełni izolowane

Równoległość jest zachowaniem domyślnym, determinowanym przez strukturę grafu.

Zobacz [Parallel Execution](../reference/parallel-execution.md).

### Skalowanie między instancjami

Wskazanie drugiej instancji Heym na tę samą bazę danych PostgreSQL powoduje, że dołącza ona jako worker. Wykonania w tle są rozdzielane między instancjami według ustalonych wag, jeden wybrany lider utrzymuje harmonogramy, ewaluację alertów i odzyskiwanie po awariach przez cały czas działania failover, a każde wykonanie rejestruje instancję, która je przeprowadziła. Zobacz [Load Distribution](../reference/cluster.md).

### Agentic Kanban Board

[Zakładka Board](../tabs/board-tab.md) to wbudowana tablica Kanban, w której same kolumny wykonują workflow. Karta to trwałe zadanie agentowe, które przenosi kontekst, historię rozmowy, stan wykonania, wyniki i uruchomienia workflow.

- **Łańcuchy workflow kolumn** – przeniesienie karty do kolumny uruchamia łańcuch workflow tej kolumny; **Agentic Kanban Model** (dane logowania + model) mapuje zawartość karty na dane wejściowe workflow i zamienia wyniki z powrotem na czytelny tekst
- **Załączniki kart** – przeciągnij pliki na kartę; dokumenty są ekstrahowane do tekstu, a obrazy przekazywane do modeli obsługujących wizję przed każdym uruchomieniem
- **Podgląd wykonania na żywo** – otwórz aktywne wykonanie wewnątrz karty i obserwuj jego przebieg na rzeczywistym canvasie workflow, węzeł po węźle
- **Udostępnianie zespołowe** – udostępniaj tablice użytkownikom lub zespołom z uprawnieniami odczytu i zapisu; łańcuchy na udostępnionych tablicach działają z danymi logowania właściciela, więc współpracownicy nigdy nie potrzebują własnych
- **Widoczność błędów** – karty z błędami pokazują wskaźnik historii błędów, a kolejne wykonania mogą się zatrzymać w oczekiwaniu na komentarze

Tablica jest natywną powierzchnią platformy: karty, workflow, dane logowania i wykonania na żywo znajdują się w jednym miejscu.

### Heym Drive: wbudowany magazyn plików

[Zakładka Drive](../tabs/drive-tab.md) to magazyn plików wbudowany w platformę. Pliki generowane przez skille i workflow (PDF, DOCX, CSV, obrazy) trafiają tam automatycznie, a załączniki kart tablicy są tam również przechowywane.

- **Linki udostępniania** – publiczne lub chronione hasłem (Basic Auth) linki do pobrania z opcjonalnym terminem ważności i limitem pobrań
- **Udostępnianie zespołowe** – udostępniaj pliki zespołom w trybie tylko do odczytu i usuwaj wszystkie udostępnienia zespołowe jedną akcją
- **Akcje zbiorcze** – wielokrotny wybór z zakresami przez shift-click, pakowanie wyboru do jednego pliku ZIP do pobrania lub zastosowanie jednego ustawienia udostępniania, hasła lub usunięcia do wielu plików naraz
- **Dostęp agentów** – skille mogą wyrazić zgodę na odczyt plików Drive, dzięki czemu agent może pracować na dokumentach utworzonych przez użytkownika lub inne workflow

Wygenerowane artefakty zyskują trwałe, możliwe do udostępnienia miejsce wewnątrz platformy.

## Obserwacja

### LLM Traces

[Zakładka Traces](../tabs/traces-tab.md) zapewnia pełną obserwowalność każdego wywołania LLM:

- Payloady żądań i odpowiedzi
- Czas poszczególnych wywołań: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nazwy wywołań narzędzi, argumenty i wyniki
- Skille przekazane do modelu

System traces jest stworzony specjalnie do debugowania zachowań agentowych, z pełnymi payloadami żądań i odpowiedzi oraz czasami poszczególnych wywołań.
### Śledzenie kosztów tokenów LLM

Każde wywołanie LLM w Heym jest automatycznie rozliczane kosztowo. Zakładka [Wykonania](../tabs/traces-tab.md) pokazuje liczbę tokenów wejściowych i wyjściowych dla każdego wykonania wraz z kosztem w USD obliczanym w czasie rzeczywistym na podstawie zsynchronizowanej tabeli cenowej.

- **Koszt pojedynczego wykonania** – Tokeny wejściowe, tokeny wyjściowe oraz łączny koszt w USD widoczne w każdym wierszu wykonania
- **Analityka kosztów** – Karty KPI oraz wykres kosztów według modelu aktualizują się wraz z wybranym zakresem czasu (1h / 24h / 7d / 30d / Wszystko)
- **Tabela kosztów LLM** – Tabela systemowa w zakładce [Tabele danych](../tabs/datatable-tab.md) jest zasilana z Helicone co 24 godziny; istnieje możliwość nadpisania cen lub dodania własnych wierszy dla modeli jeszcze nieuwzględnionych
- **Ostrzeżenie o brakującej cenie** – Wykonania dla modeli bez wpisu cenowego wyświetlają ostrzeżenie w treści z bezpośrednim linkiem do tabeli kosztów

Każde wykonanie posiada własny koszt w USD, rozbity według modelu.

### Otwieranie produkcyjnych uruchomień na aktywnym Canvas

Workflow produkcyjny pozostaje możliwy do wglądu po uruchomieniu poza edytorem. Wystarczy otworzyć dowolny wpis ze statusem **Running** w jednym z okien Historia lub otworzyć aktywne uruchomienie w karcie Agentic Kanban, a Heym przypisze standardowy edytor workflow do dokładnie tego wykonania.

- Węzły, które już zakończyły działanie, pojawiają się natychmiast wraz ze swoimi wynikami
- Bieżący węzeł oraz oczekujące węzły downstream pozostają pulsujące w miarę postępu wykonania
- Panel Debug otrzymuje te same przyrostowe wyniki węzłów co uruchomienie rozpoczęte z poziomu Canvas
- Końcowy wynik oraz wyróżnienia wykonania pojawiają się bez odpytywania i bez uruchamiania duplikatu
- Zamknięcie edytora jedynie rozłącza obserwatora; nigdy nie anuluje produkcyjnego workflow

Obserwator korzysta z SSE opartego na migawce wykonania współdzielonej między workerami, dzięki czemu działa dla triggerów webhook, harmonogramu, Chat, MCP, integracji oraz Board, nawet gdy uruchomienie należy do innego workera backendu.

### OpenTelemetry, analityka i alerty

Heym emituje spany [OpenTelemetry](../reference/opentelemetry.md) dla każdego uruchomienia workflow, wykonania węzła oraz wywołania narzędzia Agenta, eksportowane przez OTLP/HTTP do Jaeger, Grafana Tempo, Honeycomb, Datadog lub dowolnego innego kompatybilnego backendu.

Zakładka [Analityka](../tabs/analytics-tab.md) śledzi liczbę uruchomień, współczynnik sukcesu, czas trwania oraz trendy dla każdego workflow. [Alerty](../tabs/alerts-tab.md) obserwują liczbę błędów, czas trwania uruchomienia, zużycie tokenów lub wydatki w USD oraz wolumen wykonań w oknie czasowym, a następnie uruchamiają wybrany workflow powiadamiający, dzięki czemu alert trafia do Slack, e-mail, Telegram lub gdziekolwiek indziej, gdzie dociera węzeł.

## Ewaluacja

### Wbudowana ewaluacja

Zakładka [Ewaluacja](../tabs/evals-tab.md) umożliwia definiowanie zestawów testów i uruchamianie ich względem workflow agentowych:

- Tworzenie przypadków testowych z danymi wejściowymi i oczekiwanymi wynikami lub generowanie ich na podstawie promptu zestawu
- Uruchamianie jednego zestawu względem kilku modeli i porównywanie ich wyników obok siebie
- Ocena za pomocą Exact Match, Contains lub LLM-as-Judge z niezależnym modelem sędziowskim
- Przegląd wyników pass/fail, wartości rzeczywistej względem oczekiwanej oraz historii uruchomień

Wystarczy zmienić prompt lub model, ponownie uruchomić zestaw i porównać wyniki, zanim zmiana trafi na produkcję.

## Kontrola

### Human-in-the-Loop (HITL)

Heym posiada wbudowany system [Human-in-the-Loop](../reference/human-in-the-loop.md), który pozwala agentom wstrzymać wykonanie, zażądać przeglądu przez człowieka i wznowić działanie dokładnie od miejsca przerwania.

- **Punkty kontrolne agenta** – Włączenie `hitlEnabled` w dowolnym węźle Agent zapewnia mu narzędzie `request_human_review`. Agent sam decyduje, kiedy decyzja wymaga nadzoru człowieka, i wywołuje narzędzie z podsumowaniem oraz szkicem.
- **Publiczne adresy URL przeglądu** – Każde żądanie przeglądu generuje bezpieczny jednorazowy link pod `/review/{token}` (TTL 168 godzin). Recenzenci mogą **zaakceptować**, **edytować i kontynuować** lub **odrzucić** bez logowania.
- **Migawki wykonania** – Workflow zamraża swój pełny stan (historia konwersacji, zmienne, wyniki narzędzi), dzięki czemu wznawia działanie dokładnie od miejsca wstrzymania po odpowiedzi recenzenta.
- **Gałąź powiadomień** – Opcjonalne wyjście `review` pozwala podłączyć przepływ powiadomień (Slack, e-mail, webhook), uruchamiany w momencie zgłoszenia żądania przeglądu.
- **Zasady zatwierdzania narzędzi MCP** – Pisemne wytyczne HITL są interpretowane na zakresy zatwierdzeń (`always` / `once` / `never`), dzięki czemu agent może automatycznie zatwierdzać narzędzia niskiego ryzyka i eskalować te wysokiego ryzyka.
- **Wiele punktów kontrolnych** – Pojedyncze uruchomienie agenta może zostać wstrzymane do przeglądu wielokrotnie; każdy punkt kontrolny jest niezależny.

Publiczne adresy URL przeglądu, edycja i kontynuacja, rozgałęzianie powiadomień oraz wznawianie na podstawie migawek działają w oparciu o ten sam punkt kontrolny agenta.

Pełne informacje znajdują się w dokumentacji [Human-in-the-Loop](../reference/human-in-the-loop.md).

### Guardrails LLM

Heym posiada wbudowane [Guardrails](../reference/guardrails.md) zarówno w węzłach [LLM](../nodes/llm-node.md), jak i [Agent](../nodes/agent-node.md), dzięki czemu można zablokować niebezpieczne treści, zanim odpowiedź modelu trafi do dalszych kroków.

- **Przełącznik bezpieczeństwa na poziomie węzła** – Włączenie guardrails bezpośrednio w węźle generującym lub przetwarzającym treści skierowane do użytkownika
- **Szerokie pokrycie polityk** – Blokowanie przemocy, mowy nienawiści, treści seksualnych, NSFW/wulgaryzmów, nękania, działalności nielegalnej, żądań danych osobowych oraz prób prompt injection
- **Detekcja wielojęzyczna** – Stosowanie tych samych reguł bezpieczeństwa w językach tureckim, angielskim, arabskim, hiszpańskim i innych
- **Mechanizm awaryjny natywny dla workflow** – Gdy wiadomość zostanie zablokowana, węzeł zgłasza typowany błąd workflow, który można skierować przez [Error Handler](../nodes/error-handler-node.md)

Polityka bezpieczeństwa znajduje się bezpośrednio w konfiguracji LLM i Agent oraz wprost podłącza się do rozgałęziania workflow i obsługi błędów.
### Dostęp, dane logowania i audyt

Agenci działają z użyciem rzeczywistych danych logowania, dlatego dostęp stanowi część zarządzania. [Dane logowania](../reference/credentials.md) są szyfrowane w spoczynku, maskowane po utworzeniu i mogą być udostępniane użytkownikom lub [zespołom](../reference/teams.md), a zespoły współdzielą również workflows, zmienne, magazyny wektorowe i pliki Drive. [Single sign-on](../reference/sso.md) obsługuje dowolnego dostawcę OpenID Connect, w tym Okta, Entra ID, Keycloak, Auth0 i Google. [Ścieżka audytu](../reference/audit.md) rejestruje każdą istotną dla bezpieczeństwa akcję wraz z jej wykonawcą, celem i wynikiem, przesyłaną strumieniowo razem z logami kontenera do kolektora logów lub systemu SIEM, który jest już używany.

### Self-Hosted — dane pozostają w Twojej infrastrukturze

Heym działa na Twojej infrastrukturze. Workflows, dane logowania, historia wykonań i ślady (traces) znajdują się w Twojej własnej bazie danych, a wywołania modeli odbywają się z Twoich serwerów do wybranego dostawcy lub do modelu hostowanego samodzielnie przez Ollama albo vLLM. W przypadku agentów przetwarzających wrażliwe dokumenty, dane klientów lub zastrzeżone bazy wiedzy jest to często wymóg bezwzględny.

Heym jest licencjonowany na warunkach **MIT License z klauzulą Commons Clause**. Kod źródłowy jest dostępny (source-available): można go swobodnie używać, modyfikować i hostować samodzielnie. Klauzula Commons Clause ogranicza sprzedaż oprogramowania, w tym oferowanie płatnego hostingu lub usług konsultingowych/wsparcia, których wartość w istotnej mierze wynika z Heym. W sprawie licencji komercyjnej, wdrożeń enterprise lub profesjonalnego wsparcia należy kontaktować się pod adresem [enterprise@heym.run](mailto:enterprise@heym.run).

## Udostępnianie

### API i streaming

Workflows są wywoływalne przez HTTP pod adresem `/api/workflows/{workflow_id}/execute`, który zwraca JSON, oraz pod adresem `/api/workflows/{workflow_id}/execute/stream`, który strumieniuje zdarzenia węzłów jako Server-Sent Events w trakcie przebiegu. Oba endpointy współdzielą uwierzytelnianie na poziomie workflow, ograniczanie szybkości żądań i buforowanie odpowiedzi. Zobacz [Webhooks](../reference/webhooks.md) oraz [SSE Streaming](../reference/sse-streaming.md).

### Integracja z MCP (Model Context Protocol)

Heym ma natywne wsparcie [MCP](../tabs/mcp-tab.md) po obu stronach:

- **Jako klient**: Węzły agentów łączą się z zewnętrznymi serwerami MCP (Filesystem, Browserbase, narzędzia niestandardowe) przez stdio lub SSE i automatycznie korzystają z ich narzędzi
- **Jako serwer**: Workflows z włączonym MCP stają się narzędziami na domyślnym serwerze pod adresem `/api/mcp/sse` lub na serwerach nazwanych z własnym URL i API key, dzięki czemu Claude Desktop, Cursor i inni klienci MCP mogą wywoływać workflows Heym bezpośrednio

Agenci mogą korzystać z kilku serwerów MCP jednocześnie, a dowolny workflow może stać się narzędziem dla zewnętrznego klienta MCP.

### Portal: publikowanie workflows jako interfejsów Chat

Funkcja [Portal](../reference/portal.md) zamienia dowolny workflow w publiczny interfejs Chat pod adresem `/chat/{slug}`:

- Opcjonalne uwierzytelnianie z danymi logowania dla poszczególnych użytkowników
- Wykonanie strumieniowe (postęp węzłów w czasie rzeczywistym)
- Obsługa przesyłania plików
- Historia konwersacji wieloetapowej

Zespoły dostarczają narzędzia wewnętrzne, chatboty dla klientów i formularze oparte na AI z poziomu workflow i adresu URL, bez konieczności pisania kodu frontendowego.

### Dashboardy oparte na workflows

[Zakładka Dashboard](../tabs/dashboard-tab.md) to powierzchnia raportowa budowana przez użytkownika, w której każdy widget wykresu jest zasilany przez własny, ukryty workflow Heym. Widget może wywoływać API, odpytywać BigQuery, przeszukiwać magazyny RAG/wektorowe, uruchamiać kroki LLM, przekształcać wiersze i kończyć na [węźle Chart Output](../nodes/chart-output-node.md). Widgety można tworzyć ręcznie, generować za pomocą AI, dostrajać później, buforować wyniki i wizualnie przestawiać w siatce.
## Porównanie z narzędziami do automatyzacji Workflow

Wiele zespołów trafia do Heym z narzędzi do automatyzacji Workflow. Poniższa tabela porównuje Heym z n8n, Zapier i Make.com pod kątem możliwości, które mają znaczenie, gdy agenci działają w środowisku produkcyjnym, a przypisy pod nią cytują oficjalną dokumentację stanowiącą podstawę porównania. Aby bliżej przyjrzeć się jednemu narzędziu naraz, należy zapoznać się ze stronami porównawczymi pod adresem [heym.run/compare](https://heym.run/compare).

| Możliwość | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Wbudowany węzeł LLM | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + gałęzie statusu | ✓ | ograniczone¹¹ | –¹¹ | ograniczone¹¹ |
| Wbudowany węzeł Agenta (wywoływanie narzędzi) | ✓ | ✓ | ✓ | ✓ |
| Orkiestracja wielu agentów | ✓ | ✓ | ograniczone | ograniczone |
| Węzły agenta kodującego (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Wbudowany RAG / magazyn wektorowy | ✓ | ✓ | ograniczone¹ | plugin² |
| Odczyt / zapis WebSocket | ✓ | ograniczone¹² | –¹³ | –¹⁴ |
| Kreator Workflow w języku naturalnym | ✓ | ograniczone³ | ✓ | ✓ |
| Analizator Workflow | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Otwarcie uruchomienia w toku na aktywnym canvasie | ✓ | ograniczone¹⁹ | ograniczone¹⁹ | –¹⁹ |
| Panele oparte na Workflow | ✓ | ograniczone¹⁷ | ograniczone¹⁷ | ograniczone¹⁷ |
| Tablica Kanban dla agentów | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| System Skills dla agentów | ✓ | – | – | – |
| Wbudowany dysk plików (linki do udostępniania, zespoły) | ✓ | ograniczone²² | ograniczone²² | –²² |
| Węzeł automatyzacji przeglądarki (Playwright) | ✓ | ograniczone²³ | ograniczone²³ | –²³ |
| Inspekcja śladów LLM | ✓ | ograniczone⁴ | – | ✓ |
| Eksport śledzenia OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Śledzenie kosztów tokenów LLM (USD) | ✓ | –¹⁵ | –¹⁵ | ograniczone¹⁵ |
| Wbudowane ewaluacje dla Workflow AI | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | ograniczone⁶ | ograniczone⁷ |
| Guardrails LLM | ✓ | ✓⁸ | ✓⁸ | ograniczone⁸ |
| Automatyczna kompresja kontekstu | ✓ | – | – | – |
| Równoległe wykonywanie DAG | ✓ | ograniczone⁹ | – | – |
| Możliwość self-hostingu, źródła dostępne | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL wyrażeń dla danych dynamicznych | ✓ | ✓ | ograniczone | ✓ |
> **Przypisy:** ¹ Zapier Knowledge Sources — brak udostępnionego magazynu wektorowego lub kontroli nad embeddingami. ² Make.com posiada moduły Pinecone/Qdrant, ale nie ma natywnego węzła RAG. ³ n8n AI Workflow Builder to funkcja beta dostępna wyłącznie w chmurze, z limitami kredytów. ⁴ n8n pokazuje kroki pośrednie; pełne śledzenie wymaga narzędzi zewnętrznych. ⁵ n8n obsługuje zatwierdzanie wywołań narzędzi AI przez Chat, e-mail i kanały współpracy, ale nie wykonuje snapshotu i wznowienia całego wykonania w sposób, w jaki robi to Heym. ⁶ Zapier Human in the Loop obsługuje zatwierdzenia i zbieranie danych wewnątrz Zapów, ale nie jest systemem checkpointów opartym na publicznej weryfikacji i wznowieniu ze snapshotu. ⁷ Make.com oferuje Human in the Loop jako aplikację Enterprise z żądaniami weryfikacji i wynikami adjusted/approved/canceled, ale pozostaje ona ograniczona planem i mniej natywna dla agentów. ⁸ n8n dostarcza dedykowany węzeł Guardrails, Zapier oferuje AI Guardrails w swoich produktach AI, a Make.com dokumentuje reguły agentów oraz przepływy weryfikacji, ale nie porównywalną, samodzielną funkcję guardrails, dlatego Make oznaczono jako ograniczony. ⁹ n8n domyślnie wykonuje operacje sekwencyjnie; równoległość wymaga obejść z użyciem pod-workflow. ¹⁰ Sustainable Use License — bezpłatny self-hosting do użytku wewnętrznego, komercyjna redystrybucja ograniczona. ¹¹ Na dzień 22 kwietnia 2026 r. oficjalna dokumentacja n8n opisuje grupowanie HTTP oraz wzorce pętli/oczekiwania, a nie natywne rozgałęzienie statusu wsadowego LLM; oficjalna dokumentacja aplikacji ChatGPT w Zapier nie wymienia żadnych triggerów i zawiera jedynie ogólną wersję beta API Request; oficjalna strona integracji OpenAI w Make udostępnia akcje wsadowe, takie jak create/watch completed, ale nie pierwszej klasy węzeł LLM z rozgałęzianiem statusu — dlatego n8n/Make oznaczono jako ograniczone, a Zapier jako niedostępny dla tego konkretnego wzorca workflow. ¹² Oficjalna dokumentacja n8n obejmuje węzły HTTP Webhook i HTTP Request oraz rozszerzalność przez Code/custom/community, ale nie udało się znaleźć firmowego węzła trigger/send WebSocket, dlatego n8n oznaczono jako ograniczony. ¹³ Oficjalna dokumentacja Zapier obejmuje przychodzące Webhooki oraz wychodzące żądania Webhook/API wyłącznie przez HTTP, a nie natywne kroki trigger lub send WebSocket. ¹⁴ Oficjalna dokumentacja Make obejmuje moduły Webhooks oraz moduły żądań HTTP(S), ale nie udało się znaleźć natywnego modułu trigger lub send WebSocket. ¹⁵ n8n nie posiada natywnego śledzenia kosztów tokenów LLM; istnieją społecznościowe workflow obejściowe, ale wymagają ręcznej instalacji i wywołań API po wykonaniu (otwarte zgłoszenie funkcji na maj 2026 r.). Zapier nie udostępnia użytkownikom liczby tokenów ani kosztu w USD na wykonanie; kroki AI zużywają wyłącznie zadania. Panel kredytów Make.com częściowo odzwierciedla zużycie tokenów dla AI hostowanego przez Make (od sierpnia 2025 r.), ale połączenia z kluczami API stron trzecich są rozliczane jako 1 operacja = 1 kredyt, bez zliczania tokenów; brak rozbicia kosztu w USD na wykonanie według modelu. ¹⁶ Heym emituje natywne spany OpenTelemetry (po jednym na uruchomienie workflow oraz po jednym na węzeł) przez OTLP/HTTP do dowolnego kompatybilnego backendu, z propagacją kontekstu śledzenia W3C i bez kodu instrumentacyjnego, konfigurowane przez zmienne środowiskowe `HEYM_OTEL_*` i domyślnie wyłączone. n8n posiada udokumentowaną integrację śledzenia OpenTelemetry dla wykonań workflow i węzłów. Zapier i Make.com nie dokumentują eksportu OpenTelemetry swoich wykonań workflow/scenariuszy na dzień czerwca 2026 r. ¹⁷ n8n dokumentuje panel Insights dla metryk wykonań produkcyjnych, Zapier dokumentuje Zap History oraz Task Usage, a Make.com dokumentuje Scenario History; są to powierzchnie monitorowania/historii, a nie niestandardowe widżety panelu oparte na dowolnej logice workflow, jak zakładka Dashboard w Heym. ¹⁸ Heym Workflow Analyzer uruchamia workflow, gdy jest to możliwe, odczytuje wynik wykonania i generuje współdzielony, edytowalny raport Markdown obejmujący obszary do poprawy, cel oraz zachowanie krok po kroku. n8n dokumentuje AI Workflow Builder do tworzenia/udoskonalania/debugowania workflow, Zapier dokumentuje rozwiązywanie problemów AI dla błędnych uruchomień Zapów, a Make.com dokumentuje historię scenariuszy oraz kroki rozumowania agenta AI, ale ich publiczna dokumentacja nie opisuje tego samego, świadomego uruchomienia, współdzielonego dokumentu analizy workflow. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) wyświetla uruchomione wykonania i może załadować dane z poprzedniego wykonania do edytora, natomiast [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) udostępnia stan running w swoim edytorze. [Make Scenario History](https://help.make.com/scenario-history) dokumentuje szczegóły uruchomienia i logi. Ich publiczna dokumentacja, sprawdzona 18 lipca 2026 r., nie opisuje dokładnego przepływu Heym: otwarcia dowolnego uruchomienia produkcyjnego w toku z Historii lub karty Kanban, przywrócenia jego bieżącego snapshotu węzła i dalszego otrzymywania animacji węzłów oraz logów Debug na tym samym canvas. ²⁰ Węzły [Codex](../nodes/codex-node.md) i [OpenCode Go](../nodes/opencode-go-node.md) w Heym uruchamiają prawdziwe CLI agenta kodującego w izolowanym workspace Heym przeciwko repozytorium GitHub — klonowanie, edycja, tworzenie diffa, wypychanie gałęzi, otwieranie pull requesta — jako krok workflow pierwszej klasy. Na dzień 20 lipca 2026 r. żaden konkurent nie dokumentuje odpowiednika: [węzeł OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) w n8n obejmuje wywołania API chat/assistant, a nie agenta kodującego na poziomie repozytorium, a natywne wsparcie Codex pozostaje prośbą społeczności; blog samego Zapier dokumentuje odwrotny kierunek — [Codex sterujący narzędziami Zapier przez Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — a nie Codex jako krok Zapa; moduły OpenAI w Make.com udostępniają completions/assistants/akcje wsadowe, a nie agenta kodującego, który klonuje repozytoria i otwiera PR-y. ²¹ [Zakładka Board](../tabs/board-tab.md) w Heym to wbudowana agentowa tablica Kanban, której kolumny wykonują workflow, a karty przenoszą kontekst, historię konwersacji, stan wykonania i uruchomienia. n8n ([integracja Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integracje Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) i Make.com ([integracja Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) łączą się wyłącznie z aplikacjami Kanban stron trzecich, takimi jak Kanban Tool, Wekan lub NocoDB; żaden nie dokumentuje wbudowanej tablicy, która uruchamia własne workflow, na dzień 20 lipca 2026 r. ²² n8n przechowuje binarne dane wykonania wewnętrznie (opcjonalnie w [zewnętrznym magazynie zgodnym z S3](https://docs.n8n.io/hosting/scaling/external-storage/)), ale nie dokumentuje dysku plików widocznego dla użytkownika z linkami do udostępniania lub współdzieleniem zespołowym, dlatego oznaczono jako ograniczony. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) przetwarza pliki wyłącznie na czas trwania uruchomienia Zapa, a [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) przechowuje małe wartości tekstowe, dlatego Zapier oznaczono jako ograniczony. [Magazyny danych](https://help.make.com/l6du-data-stores) w Make.com przechowują ustrukturyzowane rekordy, a jego [obsługa plików](https://help.make.com/working-with-files) przekazuje pliki między aplikacjami bez trwałego wbudowanego magazynu, dlatego Make oznaczono jako niedostępny. ²³ [Węzeł Playwright](../nodes/playwright-node.md) w Heym to firmowa automatyzacja przeglądarki z trybem wizualnych kroków, krokami generowanymi przez AI oraz trybem pełnego kodu. n8n oferuje wyłącznie pakiety społecznościowe, takie jak [n8n-playwright](https://github.com/toema/n8n-playwright), z wciąż otwartym [zgłoszeniem funkcji natywnych węzłów automatyzacji przeglądarki](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), dlatego oznaczono jako ograniczony. Zapier Agents mogą [przeglądać i czytać strony przez przeglądanie sieci oraz rozszerzenie Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), ale Zapier nie dokumentuje żadnego kroku skryptowej automatyzacji przeglądarki, dlatego oznaczono jako ograniczony. Make.com dokumentuje moduły HTTP i aplikacje scrapingowe stron trzecich, a nie jakikolwiek natywny moduł automatyzacji przeglądarki, na dzień 20 lipca 2026 r.
## Powiązane

- [Wprowadzenie](./introduction.md) – Przegląd platformy
- [Szybki start](./quick-start.md) – Zbuduj pierwszy workflow
- [Analiza workflow](../reference/workflow-analysis.md) – Generuj współdzielone raporty workflow uwzględniające wykonania oraz informacje zwrotne dotyczące usprawnień
- [Zakładka Dashboard](../tabs/dashboard-tab.md) – Buduj dashboardy oparte na workflow z widżetami wykresów generowanymi przez AI
- [Węzeł Agent](../nodes/agent-node.md) – Węzeł LLM z wywoływaniem narzędzi, MCP i umiejętnościami
- [Architektura agenta](../reference/agent-architecture.md) – Podagenci, orkiestrator i dyspozycja narzędzi
- [Zakładka Board](../tabs/board-tab.md) – Agentowa tablica Kanban z kolumnami wykonującymi workflow
- [Węzeł Codex](../nodes/codex-node.md) – Uruchom agenta kodującego OpenAI Codex na repozytorium GitHub
- [Węzeł OpenCode Go](../nodes/opencode-go-node.md) – Niezależny od dostawcy agent kodujący w wzmocnionym kontenerze
- [Zakładka Drive](../tabs/drive-tab.md) – Wbudowane przechowywanie plików z linkami do udostępniania, zespołami i akcjami masowymi
- [Węzeł Playwright](../nodes/playwright-node.md) – Natywna automatyzacja przeglądarki z krokami AI i trybem kodu
- [Węzeł RAG / Magazyn wektorowy](../nodes/rag-node.md) – Wyszukiwanie wektorowe i wstawianie dokumentów (Qdrant lub Postgres pgvector)
- [Asystent AI](../reference/ai-assistant.md) – Kreator workflow w języku naturalnym
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Punkty kontrolne agenta z publicznymi adresami URL do przeglądu
- [Guardrails](../reference/guardrails.md) – Blokuj niebezpieczne prompty, zanim dotrą do modeli
- [Zakładka Wykonania](../tabs/traces-tab.md) – Obserwowalność wywołań LLM
- [Zakładka Ewaluacja](../tabs/evals-tab.md) – Zestawy testów dla workflow AI
- [Zakładka Alerty](../tabs/alerts-tab.md) – Alerty progowe dotyczące błędów, czasu trwania, kosztów i wolumenu uruchomień
- [Śledzenie OpenTelemetry](../reference/opentelemetry.md) – Eksportuj spany uruchomień, węzłów i narzędzi przez OTLP
- [Dystrybucja obciążenia](../reference/cluster.md) – Współdziel uruchomienia między instancjami z przełączaniem awaryjnym lidera
- [Single Sign-On](../reference/sso.md) – Logowanie przez dowolnego dostawcę OpenID Connect
- [Dziennik audytu](../reference/audit.md) – Działania istotne dla bezpieczeństwa z aktorem, celem i wynikiem
- [Portal](../reference/portal.md) – Publikuj workflow jako publiczne interfejsy czatu
- [Wykonywanie równoległe](../reference/parallel-execution.md) – Współbieżne wykonywanie oparte na DAG
- [Zakładka MCP](../tabs/mcp-tab.md) – Konfiguracja serwera i klienta MCP
