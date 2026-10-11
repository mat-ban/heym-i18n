# Структура на Workflow

Workflows се съхраняват като JSON с nodes и edges. Вижте [Node Types](./node-types.md) за наличните типове nodes и [Expression DSL](./expression-dsl.md) за синтаксиса на изразите в полетата `data`.

## Обект Workflow

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

## Обект Node

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

### `data` на Agent node (постоянна памет)

[Agent](../nodes/agent-node.md) nodes поддържат незадължителен knowledge graph за всеки canvas node:

| Поле | Тип | Описание |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Когато е `true`, зареденият граф се включва в system prompt и новите факти се обединяват след успешни изпълнения |
| `memoryShares` | array (незадължително) | Предоставя на други агенти достъп до memory графа на този node (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Вижте [Agent Persistent Memory](./agent-persistent-memory.md). |

Пример:

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

Вижте [Agent Persistent Memory](./agent-persistent-memory.md) за API пътища, поведение на редактора и семантика на извличането.

## Обект Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Типове Nodes

Често срещани стойности на `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) и още. Пълен списък: [Node Types](./node-types.md). Nodes на едно и също ниво на изпълнение се изпълняват [паралелно](./parallel-execution.md).

## Оформление на редактора

Всеки node има `position.x` и `position.y` за оформлението на desktop canvas. На екрани под
768px breakpoint редакторът заменя свободния Vue Flow canvas с full-screen дървовидна
структура на workflow с отстъпи. Дървото следва свързаните пътища на изпълнение, маркира
паралелните разклонения и използва същите етикети на nodes, икони и статус на последното
изпълнение като desktop редактора.

Докоснете node, за да го изберете. Ако има записан резултат от изпълнение, неговият full-screen
детайлен изглед се отваря с раздели за вход, изход и грешка. Мобилната долна навигация предоставя
**Nodes**, **Properties**, **Run** и **More**; хедърът запазва действията за запазване, история,
търсене, настройки и споделяне. Desktop продължава да използва свободния Vue Flow canvas и странични панели.

Използвайте **Add node** в мобилния раздел Nodes, за да търсите в библиотеката с nodes. Обикновен node отваря
лист за свързване веднага след добавянето му: изберете anchor node и го поставете **After**,
**Before** или като **Parallel** разклонение. В режим на редактиране докоснете съществуващ обикновен node, за да отворите същия
лист с избрана текуща връзка. Trigger nodes остават независими, тъй като не приемат
обикновен вход. Контролата за редактиране също предоставя действие за премахване на избрания node. Детайлите за изпълнение
включват стрелки за предишен и следващ, когато са налични резултати от съседни
nodes. AI Assistant се отваря над мобилното дърво като bottom sheet, без
да променя активния раздел на редактора.

## Свързани

- [Node Types](./node-types.md) – Всички типове nodes и описания
- [Canvas Features](./canvas-features.md) – Функции на редактора (data pin, execution logs, enable/disable, extract to sub-workflow)
- [Download & Import](./download-import.md) – Експортиране и импортиране на workflows като JSON
- [Agent Node](../nodes/agent-node.md) – Структура на `data` на Agent node
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` и memory graph API
- [Expression DSL](./expression-dsl.md) – Синтаксис за `userMessage`, `condition`, `$vars`, `$global` и др.
- [Parallel Execution](./parallel-execution.md) – Как nodes се изпълняват паралелно
- [Triggers](./triggers.md) – Начални nodes и входни точки
- [Workflows Tab](../tabs/workflows-tab.md) – Създаване и управление на workflows
