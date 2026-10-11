# Podstawowe koncepcje

## Workflows

Workflow to graf skierowany złożony z [**węzłów**](../reference/node-types.md) połączonych **krawędziami**. Workflow zarządza się w zakładce [Workflows](../tabs/workflows-tab.md). Należy je organizować w [folderach](../reference/workflow-organization.md). Przepływ wykonania przebiega od [węzłów triggerujących](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) przez węzły przetwarzające aż do węzłów [wyjściowych](../nodes/output-node.md). Format JSON opisano w sekcji [Struktura workflow](../reference/workflow-structure.md). Workflow można zapisywać i udostępniać jako [Szablony](../tabs/templates-tab.md), aby wykorzystywać je ponownie w różnych projektach. Workflow mogą być również uruchamiane z poziomu [Tablicy](../tabs/board-tab.md), gdzie karty kanban uruchamiają łańcuch workflow przypisany do kolumny wraz z pełnym kontekstem karty.

## Węzły

Każdy węzeł posiada:

- **Typ** – Określa zachowanie (np. `llm`, `condition`, `http`)
- **Dane** – Konfiguracja (model, prompt, URL itp.)
- **Wejścia/Wyjścia** – Uchwyty do łączenia z innymi węzłami

Pełną listę zawiera sekcja [Typy węzłów](../reference/node-types.md).

## Krawędzie

Krawędzie łączą uchwyt wyjściowy węzła źródłowego z uchwytem wejściowym węzła docelowego. Podczas wykonania dane przepływają wzdłuż krawędzi.

## Przepływ wykonania

1. **Trigger** – Węzeł Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger lub [WebSocket Trigger](../nodes/websocket-trigger-node.md) rozpoczyna wykonanie (zob. [Triggery](../reference/triggers.md))
2. **Przepływ następny** – Każdy węzeł otrzymuje dane wyjściowe z połączonych węzłów poprzedzających; [wykonanie równoległe](../reference/parallel-execution.md) uruchamia niezależne węzły współbieżnie
3. **Wyrażenia** – Węzły odwołują się do danych z węzłów poprzedzających poprzez `$nodeLabel.field`. Zob. [Expression DSL](../reference/expression-dsl.md).
4. **Wyjście** – Węzeł [Output](../nodes/output-node.md) generuje wynik końcowy

## Odwołania w wyrażeniach

Należy używać `$input` dla danych węzła Input oraz `$nodeLabel.field` dla dowolnego węzła poprzedzającego. Przykład: `$llm.text` odwołuje się do pola `text` z węzła o etykiecie „llm”. Pełna składnia: [Expression DSL](../reference/expression-dsl.md). Podczas edycji wyrażeń można korzystać z [Okna ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md), które oferuje większy edytor z podglądem na żywo z backendu.

## Powiązane

- [Szybki start](./quick-start.md) – Zbuduj pierwszy workflow
- [Funkcje canvas](../reference/canvas-features.md) – Przypinanie danych, logi wykonania, włączanie/wyłączanie, wyodrębnianie do pod-workflow
- [Asystent AI](../reference/ai-assistant.md) – Twórz workflow za pomocą języka naturalnego
- [Typy węzłów](../reference/node-types.md) – Wszystkie dostępne węzły
- [Expression DSL](../reference/expression-dsl.md) – Odwoływanie się do danych w wyrażeniach
- [Okno ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem na żywo z backendu
- [Zakładka Workflows](../tabs/workflows-tab.md) – Zarządzanie workflow i folderami
- [Organizacja workflow](../reference/workflow-organization.md) – Foldery i zaplanowane usuwanie
- [Triggery](../reference/triggers.md) – Punkty wejścia workflow
- [Webhooks](../reference/webhooks.md) – Trigger HTTP webhook (TTL, cache, limit szybkości)
- [Wykonanie równoległe](../reference/parallel-execution.md) – Jak węzły działają równolegle
