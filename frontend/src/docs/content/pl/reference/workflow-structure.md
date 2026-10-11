# Struktura Workflow

Workflow są przechowywane jako JSON z węzłami i krawędziami. Dostępne typy węzłów opisano w sekcji [Typy węzłów](./node-types.md), a składnię wyrażeń w polach `data` — w sekcji [Expression DSL](./expression-dsl.md).

## Obiekt Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Obiekt węzła

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Pole `data` węzła Agent (pamięć trwała)

Węzły [Agent](../nodes/agent-node.md) obsługują opcjonalny graf wiedzy przypisany do danego węzła na canvasie:

| Pole | Typ | Opis |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Gdy ustawione na `true`, zapisany graf jest wczytywany do system prompt, a nowe fakty są scalane po udanych uruchomieniach |
| `memoryShares` | array (opcjonalne) | Przyznaje innym agentom dostęp do grafu pamięci tego węzła (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Szczegóły w sekcji [Pamięć trwała Agenta](./agent-persistent-memory.md). |

Przykład:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Ścieżki API, zachowanie edytora oraz semantykę ekstrakcji opisano w sekcji [Pamięć trwała Agenta](./agent-persistent-memory.md).

## Obiekt krawędzi

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Typy węzłów

Najczęstsze wartości pola `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) i inne. Pełna lista: [Typy węzłów](./node-types.md). Węzły znajdujące się na tym samym poziomie wykonania uruchamiają się [równolegle](./parallel-execution.md).

## Układ edytora

Każdy węzeł ma pola `position.x` oraz `position.y` określające jego położenie na canvasie w widoku desktopowym. Na ekranach o szerokości poniżej progu 768px edytor zastępuje swobodny canvas Vue Flow pełnoekranowym, wciętym drzewem workflow. Drzewo odwzorowuje połączone ścieżki wykonania, oznacza gałęzie równoległe i korzysta z tych samych etykiet węzłów, ikon oraz statusu ostatniego uruchomienia co edytor desktopowy.

Dotknięcie węzła powoduje jego zaznaczenie. Jeśli węzeł ma zapisany wynik wykonania, otwiera się jego pełnoekranowy widok szczegółowy z zakładkami wejścia, wyjścia i błędów. Dolna nawigacja mobilna udostępnia sekcje **Nodes**, **Properties**, **Run** oraz **More**; nagłówek zachowuje akcje zapisu, historii, wyszukiwania, ustawień i udostępniania. Widok desktopowy nadal korzysta ze swobodnego canvasu Vue Flow oraz paneli bocznych.

Aby wyszukać węzeł w bibliotece, należy użyć opcji **Add node** w mobilnej zakładce Nodes. Zwykły węzeł otwiera arkusz połączeń natychmiast po dodaniu: należy wybrać węzeł kotwiczny i umieścić nowy węzeł **After**, **Before** lub jako gałąź **Parallel**. W trybie edycji dotknięcie istniejącego zwykłego węzła otwiera ten sam arkusz z zaznaczonym bieżącym połączeniem. Węzły trigger pozostają niezależne, ponieważ nie przyjmują zwykłego wejścia. Panel edycji udostępnia również akcję usunięcia zaznaczonego węzła. Szczegóły wykonania zawierają strzałki poprzedni/następny, gdy dostępne są wyniki sąsiednich węzłów. Asystent AI otwiera się nad mobilnym drzewem jako dolny arkusz, bez zmiany aktywnej zakładki edytora.

## Powiązane

- [Typy węzłów](./node-types.md) – Wszystkie typy węzłów i ich opisy
- [Funkcje canvasu](./canvas-features.md) – Funkcje edytora (data pin, logi wykonania, włączanie/wyłączanie, wyodrębnianie do pod-workflow)
- [Pobieranie i import](./download-import.md) – Eksport i import workflow jako JSON
- [Węzeł Agent](../nodes/agent-node.md) – Struktura pola `data` węzła Agent
- [Pamięć trwała Agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` oraz API grafu pamięci
- [Expression DSL](./expression-dsl.md) – Składnia dla `userMessage`, `condition`, `$vars`, `$global` itp.
- [Wykonanie równoległe](./parallel-execution.md) – Jak węzły uruchamiają się równolegle
- [Triggery](./triggers.md) – Węzły startowe i punkty wejścia
- [Zakładka Workflows](../tabs/workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
