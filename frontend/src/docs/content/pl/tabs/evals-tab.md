# Zakładka Ewaluacja

Zakładka **Ewaluacja** to osobna strona dostępna pod adresem `/evals`. Umożliwia tworzenie zestawów ewaluacyjnych, definiowanie przypadków testowych oraz uruchamianie ewaluacji względem workflowów [Węzła Agent](../nodes/agent-node.md). [Zestaw agentów](#agent-suites) uruchamia agenta lub odczytuje jego rzeczywiste wykonania i sprawdza wywoływane narzędzia, latencję, koszt w USD, tokeny oraz liczbę wywołań narzędzi.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Obejrzyj demonstrację Ewaluacji</a></p>

## Dostęp

- Kliknij **Ewaluacja** na pasku zakładek dashboardu
- Lub przejdź do `/evals`
- Lub użyj **Ctrl+K** (Cmd+K) i wybierz „Ewaluacja" z palety poleceń

## Zestawy ewaluacyjne

- **Nowy zestaw** – Wybierz **Zestaw promptów**, aby przetestować prompt systemowy w wielu modelach, lub **Zestaw agentów**, aby zweryfikować rzeczywiste wykonania agenta (zobacz [Zestawy agentów](#agent-suites))
- **Wybór zestawu** – Wyświetla zestawy promptów i agentów wraz z typem obok każdej nazwy; zacznij pisać, aby wyszukać
- **Utwórz zestaw** – Zdefiniuj zestaw z nazwą i opisem
- **Wybierz workflow** – Wskaż workflow do ewaluacji
- **Wybierz dane logowania** – Klucz API do uruchomienia workflow
- **Prompt systemowy** – Edytuj prompt systemowy na poziomie zestawu bezpośrednio w lewym panelu
- **Optymalizuj prompt** – Poproś LLM o ulepszenie bieżącego promptu systemowego

## Przypadki testowe

- Dodawaj przypadki testowe z promptami wejściowymi i oczekiwanymi wynikami
- Każdy przypadek może mieć własną oczekiwaną wartość do porównania
- Edytuj lub usuwaj przypadki z zestawu
- **Generuj dane testowe** – Użyj wybranych danych logowania/modelu, aby automatycznie utworzyć przypadki testowe na podstawie promptu zestawu

## Uruchamianie ewaluacji

- **Wybierz jeden lub więcej modeli** – Uruchom ten sam zestaw względem wielu modeli w ramach jednej ewaluacji
- **Metoda oceniania** – Wybierz `Exact Match`, `Contains` lub `LLM-as-Judge`
- **Sędzia** – Dla `LLM-as-Judge` opcjonalnie wybierz dane logowania OpenAI, OpenAI compatible (Custom), Gemini (Google) lub [Model decyzyjny](../nodes/decision-node.md) i wpisz model sędziego (na przykład `gpt-4o-mini` lub `jev-latest`), aby oceniać za pomocą niezależnego sędziego
- **Liczba uruchomień na test** – Powtórz każdy przypadek testowy wielokrotnie w ramach jednego uruchomienia
- **Zapamiętane ustawienia** – Zestaw otwiera się z ustawieniami swojego najnowszego wykonania: dane logowania, modele, metoda oceniania i sędzia, temperatura, wysiłek rozumowania oraz liczba uruchomień na test. Otwarcie wcześniejszego wykonania wczytuje jego ustawienia, dzięki czemu **Uruchom ewaluacje ponownie** powtarza ten sam test
- **Temperatura** – Ustaw temperaturę modelu (`Exact Match` i `Contains`)
- **Reasoning effort** – Ustaw wysiłek rozumowania dla modeli wnioskujących, od Niskiego po Bardzo wysoki i Maks. tak jak w węzłach LLM i Agent (`Exact Match` i `Contains`)

### LLM-as-Judge

Z sędzią każdy model odpowiada na dane wejściowe testu wyłącznie na podstawie promptu zestawu, a następnie sędzia ocenia, jak blisko odpowiedź jest zgodna z oczekiwanym wynikiem, w skali od 0 do 100:

- **Sędzia modelowy** (OpenAI, OpenAI compatible lub Gemini) odczytuje pytanie, oczekiwany wynik i odpowiedź, a następnie zwraca ocenę wraz z jednozdaniowym uzasadnieniem. Działa przy temperaturze `0` lub przy `low` reasoning effort dla modelu rozumującego, dzięki czemu ta sama odpowiedź otrzymuje ten sam werdykt.
- **Sędzia modelu decyzyjnego** ocenia odpowiedź według pięciopoziomowej rubryki, od *Completely off* do *Fully matches*. Ocena to pozycja ważona prawdopodobieństwem na tej rubryce, pochodzi więc z rozkładu obliczonego przez model, a nie z liczby przez niego zapisanej.

Karta po najechaniu na komórkę pokazuje uzasadnienie sędziego, a dla modelu decyzyjnego – poziom, ocenę i jej pewność. Opóźnienie i tokeny opisują testowany model; własne wywołania sędziego pojawiają się w [Wykonaniach](./traces-tab.md) w źródle **Ewaluacja**. Selektor sędziego pomija dane logowania Model Router, ponieważ sędzia musi być jednym stałym modelem. Danymi logowania dla testowanych modeli może być [Model Router](../reference/credentials.md#model-router-auto-model): jego model **Auto** wybiera model dla każdego żądania, dokładnie tak samo jak w workflow.

Bez sędziego każdy model odpowiada i ocenia własną odpowiedź w ramach jednego żądania.

Temperatura i reasoning effort są ukryte w tym trybie, a uruchomienie korzysta ze stałych ustawień: temperatura `0.7` dla modeli standardowych oraz `medium` reasoning effort dla modeli rozumujących (`low`, gdy oceniają własne odpowiedzi).

## Wyniki

- Wyświetlaj wynik zaliczone/niezaliczone dla każdego przypadku testowego
- Sprawdzaj rzeczywiste wyniki względem oczekiwanych
- Porównuj wyniki poszczególnych modeli obok siebie, gdy uruchomienie obejmuje wiele modeli
- Przeglądaj historię uruchomień z poprzednich ewaluacji; uruchomienie `LLM-as-Judge` pokazuje swój model sędziego na liście historii
- Otwieraj historyczne uruchomienia z panelu wyników i sprawdzaj zapisane migawki promptu/wejścia/wyjścia
- Otwarcie poprzedniego uruchomienia ładuje jego metodę oceniania i sędziego do lewego panelu, dzięki czemu **Ponowne uruchomienie ewaluacji** powtarza tę samą ewaluację
- **Eksport** pobiera uruchomienie jako JSON, wraz z `judge_credential_id` i `judge_model`

## Agent Suites

Zestaw agentów weryfikuje węzeł [Agent](../nodes/agent-node.md) na podstawie jego wykonań. Odczytuje je ze [Śladów](./traces-tab.md), gdzie każde wykonanie rejestruje już czas, tokeny, koszt i wywołania narzędzi, a ponadto może uruchomić workflow w Twoim imieniu.

Utwórz zestaw, wybierając **Nowy zestaw** → **Zestaw agentów** i przejdź trzy kroki:

1. **Agent** – Wybierz workflow, a następnie jego węzeł agenta. Wyświetlane są tylko workflow z węzłem agenta; workflow lub agent, który jeszcze nie został uruchomiony, jest widoczny, ale nie można go wybrać. Ustawienia wybranego agenta (model, instrukcje, narzędzia i limity) pojawiają się po prawej stronie, a poniżej wyświetla się kanwa workflow w trybie tylko do odczytu z wyróżnionym agentem.
2. **Baseline** – Ostatnie 10 wykonań agenta: opóźnienie p50 i p95, koszt na wykonanie, tokeny na wykonanie i wywołania narzędzi na wykonanie, jakie narzędzia wywołał i jak często, a także indywidualne wartości każdego wykonania. Wykonania zakończone błędem są wymienione, ale pomijane w baseline.
3. **Weryfikacje** – Oznacz każde narzędzie jako **Must call**, **Must not call** lub **Either**. Każdy rodzaj wywołania jest wymieniony wraz z jego typem: narzędzia Python i węzłów, narzędzia **MCP** wraz z ich serwerem, **podagenci** według etykiety, **podrzędne workflow** według nazwy oraz **skills**. Dodaj narzędzie według rodzaju i nazwy, jeśli jeszcze nie zostało uruchomione, i usuń je za pomocą znaku **X**. Ustaw górne limity dla opóźnienia, kosztu, łącznej liczby tokenów i wywołań narzędzi; każdy startuje 20% powyżej p95 z baseline i może zostać wyłączony.

Zapisany zestaw otwiera się na karcie **Wyniki**, mając obok karty **Baseline** i **Edytuj weryfikacje**:

- **Uruchom workflow** – Wybierz liczbę wykonań (do 20); cztery uruchamiane są jednocześnie. Dane wejściowe są wypełniane na podstawie najnowszego wykonania workflow i mogą być edytowane, a każde wykonanie z nich korzysta. Włącz opcję **Generuj dane wejściowe** (symbol gwiazdki), a następnie wybierz dane logowania i model, aby model przygotował inne dane wejściowe dla każdego uruchomienia. Model odczytuje instrukcje systemowe agenta i trzyma się blisko wprowadzonych wartości: wpisanie nazwy miasta wygeneruje inne nazwy miast. Każde wykonanie przeprowadza cały workflow jak każdy standardowy przebieg i jest rejestrowane w Historii wykonań z triggerem `agent_suite`. Aby pominąć późniejsze kroki, takie jak wysyłanie wiadomości e-mail, otwórz workflow za pomocą opcji **Przejdź do workflow** w panelu i najpierw wyłącz te węzły. **Zatrzymaj** kończy działanie zestawu: żadne nowe wykonania nie zostaną rozpoczęte, a trwające zostaną anulowane. Wykonanie zestawu, którego serwer został zatrzymany (np. podczas restartu), po minucie zostanie oznaczone jako przerwane zamiast pozostawać zablokowane.
- **Wyniki** – Domyślnie oceniane jest najnowsze wykonanie zestawu. Każde wykonanie zestawu jest zachowywane z datą w selektorze wykonań, gdzie można je otworzyć lub usunąć; możesz także przełączyć się na ostatnie 10, 20 lub 50 wykonań agenta, aby uwzględnić inne jego uruchomienia. Zobaczysz wskaźnik powodzenia, częstotliwość zaliczenia każdej weryfikacji, opóźnienie, koszt, tokeny i wywołania narzędzi obok zapisanej baseline, a także każde wykonanie z powodem błędu i linkiem do jego śladu.
- **Przejdź do workflow** otwiera workflow agenta w nowej karcie. W polu nazwy naciśnięcie **Esc** lub kliknięcie **X** czyści tekst.

Jak interpretowane są liczby:

- **Opóźnienie** to czas pracy modelu plus czas wywołań narzędzi w ramach wykonania.
- **Koszt** korzysta z tego samego cennika co Traces. Wykonanie modelu bez zdefiniowanej ceny pomija weryfikację kosztu zamiast kończyć się błędem.
- Wykonanie jest **zaliczone**, gdy zakończyło się bez błędu i wszystkie weryfikacje zakończyły się sukcesem.
- Zestaw odczytuje wyłącznie Twoje własne ślady, zgodnie z zasadą obowiązującą w zakładce Traces.
- **Użyj najnowszych wykonań jako baseline** w sekcji **Edytuj weryfikacje** zastępuje zapisaną baseline najnowszymi wykonaniami agenta.

Baseline zestawu pochodzi z jednego z trzech źródeł. Sekcja **Edytuj weryfikacje** wskazuje aktywne źródło obok etykiety **Zapisana baseline**:

- najnowsze wykonania agenta (domyślnie oraz to, co pobiera opcja **Użyj najnowszych wykonań jako baseline**),
- jedno ukończone wykonanie zestawu,
- wartości wprowadzone ręcznie.

Dwa ostatnie konfiguruje się z poziomu [Chat](./chat-tab.md#working-with-evals) lub przez API:

- `PATCH /api/evals/agent-suites/{id}` przyjmuje `baseline: {"source": "suite_run", "run_id": "…"}` lub `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` przyjmuje `inputs_list`: jeden obiekt danych wejściowych na wykonanie, do 20.

### Z poziomu Chat i MCP

[Chat](./chat-tab.md#working-with-evals) oraz narzędzie MCP `heym_chat` mogą tworzyć, modyfikować i uruchamiać zestawy promptów i agentów:

- Samodzielnie redagują przypadki testowe oraz dane wejściowe dla uruchomień.
- Pytają o dane logowania przed utworzeniem zestawu promptów, chyba że tylko jedne są odpowiednie.
- Linkują każdy zestaw, o którym wspominają na tej stronie.

## Pomysły na macierz benchmarków

Podczas budowania macierzy benchmarków dla workflowów agentowych należy uwzględnić scenariusze HITL jako przypadki pierwszej kategorii, a nie traktować ich jako przypadki brzegowe.

- Pokryj wszystkie trzy decyzje przeglądu: `accepted`, `edited` i `refused`
- Uwzględnij wiele źródeł triggerów, takich jak uruchomienia z edytora, portal, curl/webhook oraz wykonania wyzwalane przez cron
- Dodaj scenariusze wielokrotnego przeglądu, w których jedno uruchomienie agenta zatrzymuje się więcej niż raz
- Zweryfikuj gałęzie powiadomień podłączone do wyjścia `review` agenta
- Sprawdź zachowanie downstream po odmowie, zwłaszcza gdy późniejsze węzły rozgałęziają się na `$agent.decision`

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Ewaluacja jako etap testowy cyklu życia agenta
- [Węzeł Agent](../nodes/agent-node.md) – Workflow poddawane ewaluacji
- [Zakładka Dane logowania](./credentials-tab.md) – Dane logowania do uruchomień ewaluacji
- [Zakładka Wykonania](./traces-tab.md) – Szczegółowa inspekcja wykonania
- [Zakładka Workflows](./workflows-tab.md) – Tworzenie workflowów do ewaluacji
- [Historia wykonań](../reference/execution-history.md) – Przeglądanie poprzednich uruchomień (przycisk Historia w nagłówku)
- [Kontekstowy przewodnik](../reference/contextual-showcase.md) – Kompaktowy przewodnik po stronie dostępny na stronie ewaluacji
