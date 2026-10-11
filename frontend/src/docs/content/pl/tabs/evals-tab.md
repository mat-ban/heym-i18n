# Zakładka Ewaluacja

Zakładka **Ewaluacja** to osobna strona dostępna pod adresem `/evals`. Umożliwia tworzenie zestawów ewaluacyjnych, definiowanie przypadków testowych oraz uruchamianie ewaluacji względem workflowów [Węzła Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Obejrzyj demonstrację Ewaluacji</a></p>

## Dostęp

- Kliknij **Ewaluacja** na pasku zakładek dashboardu
- Lub przejdź do `/evals`
- Lub użyj **Ctrl+K** (Cmd+K) i wybierz „Ewaluacja" z palety poleceń

## Zestawy ewaluacyjne

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
- **Temperatura** – Ustaw temperaturę modelu (`Exact Match` i `Contains`)
- **Reasoning effort** – Ustaw reasoning effort dla modeli rozumujących (`Exact Match` i `Contains`)

### LLM-as-Judge

Z sędzią każdy model odpowiada na dane wejściowe testu wyłącznie na podstawie promptu zestawu, a następnie sędzia ocenia, jak blisko odpowiedź jest zgodna z oczekiwanym wynikiem, w skali od 0 do 100:

- **Sędzia modelowy** (OpenAI, OpenAI compatible lub Gemini) odczytuje pytanie, oczekiwany wynik i odpowiedź, a następnie zwraca ocenę wraz z jednozdaniowym uzasadnieniem. Działa przy temperaturze `0` lub przy `low` reasoning effort dla modelu rozumującego, dzięki czemu ta sama odpowiedź otrzymuje ten sam werdykt.
- **Sędzia modelu decyzyjnego** ocenia odpowiedź według pięciopoziomowej rubryki, od *Completely off* do *Fully matches*. Ocena to pozycja ważona prawdopodobieństwem na tej rubryce, pochodzi więc z rozkładu obliczonego przez model, a nie z liczby przez niego zapisanej.

Karta po najechaniu na komórkę pokazuje uzasadnienie sędziego, a dla modelu decyzyjnego – poziom, ocenę i jej pewność. Opóźnienie i tokeny opisują testowany model; własne wywołania sędziego pojawiają się w [Wykonaniach](./traces-tab.md) w źródle **Ewaluacja**. Selektor modeli pomija dane logowania Model Router, ponieważ ewaluacja porównuje konkretne modele.

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
