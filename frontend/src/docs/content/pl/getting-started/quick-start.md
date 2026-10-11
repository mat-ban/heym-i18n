# Szybki start

Uruchom swój pierwszy workflow w Heym w kilka minut.

Heym nie jest jeszcze uruchomiony? Zobacz [Uruchamianie i wdrażanie](./running-and-deployment.md) lub obejrzyj przewodnik wideo: [Skonfiguruj Heym lokalnie w mniej niż 2 minuty](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Utwórz workflow

1. Przejdź do zakładki [Workflows](../tabs/workflows-tab.md)
2. Kliknij **New Workflow**
3. Nadaj nazwę workflow (np. „Hello World")

## 2. Dodaj węzły

1. Otwórz panel **Nodes** po lewej stronie
2. Przeciągnij węzeł [Input](../nodes/input-node.md) na canvas
3. Przeciągnij węzeł [LLM](../nodes/llm-node.md) i połącz go z węzłem Input
4. Przeciągnij węzeł [Output](../nodes/output-node.md) i połącz go z węzłem LLM

```
[Input] --> [LLM] --> [Output]
```

Wszystkie dostępne węzły opisano w sekcji [Typy węzłów](../reference/node-types.md).

## 3. Skonfiguruj

- **Input**: Ustaw wartość domyślną lub pozostaw pole puste, aby umożliwić wprowadzanie danych przez użytkownika (zobacz [Węzeł Input](../nodes/input-node.md))
- **LLM**: Wybierz [dane logowania](../tabs/credentials-tab.md) oraz model, dodaj instrukcję systemową i ustaw `userMessage` na `$input.text` (zobacz [Węzeł LLM](../nodes/llm-node.md))
- **Output**: Ustaw `message` na `$llm.text`, aby przekazać odpowiedź modelu LLM (zobacz [Węzeł Output](../nodes/output-node.md))

Do odwołań `$input.text` i `$llm.text` stosowana jest składnia [Expression DSL](../reference/expression-dsl.md). Kliknij przycisk rozwijania przy polach wyrażeń, aby otworzyć [Okno ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md) z podglądem działania backendu na żywo.

## 4. Uruchom

Kliknij **Run**, naciśnij `Ctrl + Enter` lub użyj panelu debugowania, aby wykonać workflow. Workflow jest uruchamiany od węzła Input, poprzez połączone węzły, aż do węzła Output. Inne sposoby uruchamiania workflow ([webhook](../reference/webhooks.md), portal, cron itp.) opisano w sekcji [Triggery](../reference/triggers.md).

Poprzednie uruchomienia można przeglądać w **History** (pasek narzędzi) i użyć opcji **Bring to Canvas**, aby ponownie uruchomić workflow z tymi samymi danymi wejściowymi.

Na stronach Docs, Evals i innych wewnętrznych stronach poza canvasem można również skorzystać z [Quick Drawer](../reference/quick-drawer.md), aby wybrać przypięty workflow i uruchomić go bez powrotu do edytora.

Jeśli podczas czytania dokumentacji pojawi się potrzeba wyjaśnienia przed rozpoczęciem budowania, otwórz [Chat with Heym](../reference/chat-with-heym.md) z nagłówka Docs, aby zadać pytania dotyczące bieżącej strony.

Alternatywnie można skorzystać z [Asystenta AI](../reference/ai-assistant.md) w panelu Debug, aby tworzyć workflow za pomocą języka naturalnego — wystarczy opisać oczekiwany rezultat, a AI wygeneruje węzły i połączenia.

Tworzysz już automatyzacje w innym narzędziu? [Migracja do Heym](./migrate-to-heym.md) konwertuje workflow z n8n, Flowise, Dify, Langflow, sim.ai lub Activepieces na workflow w Heym gotowy do zaimportowania.

## Powiązane

- [Kluczowe koncepcje](./core-concepts.md) – Workflows, węzły i przepływ wykonania
- [Migracja do Heym](./migrate-to-heym.md) – Konwertuj workflow z n8n, Flowise, Dify, Langflow, sim.ai lub Activepieces do Heym za pomocą AI
- [Uruchamianie i wdrażanie](./running-and-deployment.md) – Uruchom lokalnie za pomocą `run.sh` lub wdróż za pomocą `deploy.sh`
- [Zmienne środowiskowe](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pełna dokumentacja konfiguracji
- [Ustawienia](../reference/user-settings.md) – Konfiguracja nazwy, User Rules i hasła
- [Funkcje canvasu](../reference/canvas-features.md) – Przypinanie danych, logi wykonania, włączanie/wyłączanie, wyodrębnianie do pod-workflow
- [Skróty klawiaturowe](../reference/keyboard-shortcuts.md) – Skróty dla canvasu i edytora
- [Expression DSL](../reference/expression-dsl.md) – Odwoływanie się do danych w konfiguracji węzłów
- [Okno ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md) – Rozwijany edytor z podglądem działania backendu na żywo
- [Triggery](../reference/triggers.md) – Wszystkie punkty wejścia workflow ([webhook](../reference/webhooks.md), portal, cron itp.)
- [Historia wykonań](../reference/execution-history.md) – Przeglądanie poprzednich uruchomień i Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Uruchamianie przypiętych workflow ze stron poza canvasem
- [Chat with Heym](../reference/chat-with-heym.md) – Zadawanie pytań kontekstowych z nagłówka dokumentacji
- [Zakładka Workflows](../tabs/workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie kluczy API dla węzłów LLM
- [Asystent AI](../reference/ai-assistant.md) – Tworzenie workflow za pomocą języka naturalnego
