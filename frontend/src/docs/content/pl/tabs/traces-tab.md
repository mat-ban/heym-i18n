# Karta Wykonania

Karta **Wykonania** prezentuje ślady wykonania LLM. Umożliwia inspekcję payloadów żądań i odpowiedzi, czasu wykonania, wywołań narzędzi oraz debugowanie zachowania węzłów [Agent](../nodes/agent-node.md) i [LLM](../reference/node-types.md), a także agregację metryk (wywołania, tokeny, koszt, opóźnienie, współczynnik błędów) w dowolnym przedziale czasowym.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Obejrzyj demonstrację Wykonań</a></p>

## Nagłówek statystyk

Strona otwiera się podsumowaniem statystyk nad listą wykonań, obliczonym dla wybranego zakresu czasowego i pozostałych aktywnych filtrów:

- **Karty KPI** – Łączna liczba wywołań, Łączna liczba tokenów, Łączny koszt (USD), Średnie opóźnienie, % błędów
- **Tokeny według modelu** – Wykres pierścieniowy wolumenu tokenów na model
- **Koszt według modelu** – Wykres pierścieniowy wydatków w USD na model. Modele bez cennika wyświetlają link „Configure pricing" prowadzący do [Tabeli kosztów LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Wywołania w czasie** – Skumulowany wykres obszarowy wywołań zakończonych sukcesem i błędem na przedział (5 min / 1 godz. / 6 godz. / 1 dzień, dobierany automatycznie dla zakresu)
- **Powiadomienie o modelach bez cennika** – Pojawia się pod wykresami, gdy niektóre śledzone modele nie mają wiersza cennika, z linkiem do Tabeli kosztów LLM

## Zakres czasowy

Pojedynczy selektor **Zakres czasowy** u góry paska filtrów steruje zarówno nagłówkiem statystyk, jak i listą wykonań. Dostępne opcje: Ostatnia 1 godzina, Ostatnie 24 godziny, Ostatnie 7 dni (domyślnie), Ostatnie 30 dni, Cały czas. Zmiana zakresu resetuje paginację i przeładowuje wykresy oraz listę jednocześnie.

## Lista wykonań

- Paginowana lista ostatnich wykonań w wybranym zakresie czasowym
- Każde wykonanie prezentuje: workflow, węzeł, dane logowania, znacznik czasu, czas trwania
- Kliknięcie wykonania otwiera widok szczegółów
- Przyciski **Prev / Next** w oknie szczegółów umożliwiają przechodzenie między wykonaniami bez zamykania okna

## Filtrowanie

- **Zakres czasowy** – 1 godz. / 24 godz. / 7 dni / 30 dni / Cały czas; filtruje wykresy i listę jednocześnie
- **Dane logowania** – Filtrowanie według użytych danych logowania (klucz API)
- **Źródło** – Filtrowanie według workflow lub źródła wykonania
- **Wyszukiwanie** – Wyszukiwanie według modelu, workflow, danych logowania lub etykiety węzła
- **Odśwież** – Przeładowanie bieżącej strony wykonań

## Szczegóły wykonania

Po otwarciu wykonania:

- **Kroki** – Oś czasu od góry do dołu, odczytująca wykonanie jako uporządkowany łańcuch: System → User → Assistant → Tool → Answer. Każdy krok można zwinąć; rozwinięcie pokazuje czytelny szczegół (treść wiadomości lub argumenty i wynik narzędzia), a następnie JSON danego kroku. Zawartość JSON w każdym typie zdarzenia — w tym wywołania MCP i payloade JSON-RPC — domyślnie otwiera się w rozwijanym drzewie z rozwiniętym pierwszym poziomem. Przełącznik **Tree / Raw** pozwala zmienić widok między sformatowaną strukturą a oryginalnym tekstem. Nieprawidłowy JSON pozostaje widoczny jako zwykły tekst. Kroki narzędzi prezentują swój czas trwania oraz oznaczenie MCP/Skill, jeśli ma zastosowanie, a także oznaczenia pending / timeout / cancelled, gdy ustawiony jest status wywołania narzędzia. Krok Answer może wyświetlać zagregowane oznaczenia `tool_metrics` (liczby wywołań według statusu i łączny czas narzędzi). Gdy wykonanie rejestruje każde wywołanie modelu — tak jak wiadomość w Chat na Dashboardzie i agent z routingiem — krok **LLM** pojawia się przed narzędziami, których zażądano, a **Podział czasu trwania** przedstawia każde wywołanie modelu, narzędzie i decyzję routingu na jednej osi czasu. Wiadomość w Chat na Dashboardzie to jedno wykonanie, niezależnie od liczby rund narzędzi. Wykonania bez łańcucha wiadomości (na przykład generowanie obrazów) prezentują minimalną oś czasu Request → Response.
- **Request** – Pełny payload żądania wysłanego do LLM, z widokami JSON **Tree / Raw**
- **Response** – Odpowiedź modelu, w tym wywołania narzędzi, jeśli występują, z widokami JSON **Tree / Raw**
- **Metryki narzędzi** – Gdy są obecne w odpowiedzi, zwięzłe podsumowanie liczby wywołań narzędzi (`success` / `error` / `pending` / `timeout` / `cancelled`) oraz łącznego czasu narzędzi
- **Podział czasu** – `llm_ms`, `tools_ms`, `mcp_list_ms` do analizy wydajności
- **Wywołania narzędzi** – Nazwa narzędzia, argumenty, wynik, status i czas upłynięty
- **Uwzględnione umiejętności** – Umiejętności przekazane modelowi w żądaniu
- **Przejdź do Workflow** – Bezpośrednie przejście do powiązanego workflow z okna szczegółów wykonania

## Kopiowanie i eksport

- Kopiowanie JSON żądania lub odpowiedzi do schowka; kopiowanie zawsze używa pełnego surowego payloadu niezależnie od aktywnego widoku
- Przydatne do debugowania lub udostępniania zespołowi wsparcia

## Konserwacja

- **Wyczyść wszystko** – Usunięcie wszystkich zapisanych wykonań po potwierdzeniu
- Kontrolki paginacji pokazują bieżący widoczny zakres (na przykład `1-25 of 240`)

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Obserwowalność LLM w całym cyklu życia agenta
- [Węzeł Agent](../nodes/agent-node.md) – Węzeł Agent z wywoływaniem narzędzi
- [Typy węzłów](../reference/node-types.md) – Węzły LLM i Agent
- [Karta Dane logowania](./credentials-tab.md) – Dane logowania używane w wykonaniach
- [Śledzenie OpenTelemetry](../reference/opentelemetry.md) – Opcjonalny eksport OTel dla spanów workflow, węzłów i narzędzi Agenta
- [Karta Tabele danych](./datatable-tab.md) – Mieści Tabelę kosztów LLM używaną przez wykres kosztów
- [Kontekstowy przewodnik](../reference/contextual-showcase.md) – Zwięzły przewodnik po powierzchniach Dashboardu
