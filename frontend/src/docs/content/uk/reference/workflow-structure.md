# Структура Workflow

Workflow зберігаються як JSON з вузлами та ребрами. Дивіться [Node Types](./node-types.md) для доступних типів вузлів і [Expression DSL](./expression-dsl.md) для синтаксису виразів у полях `data`.

## Об'єкт Workflow

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

## Об'єкт Node

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

### `data` вузла Agent (постійна пам'ять)

Вузли [Agent](../nodes/agent-node.md) підтримують необов'язковий граф знань для кожного вузла полотна:

| Поле | Тип | Опис |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Коли `true`, завантажує збережений граф у system prompt і об'єднує нові факти після успішних запусків |
| `memoryShares` | array (необов'язково) | Надає іншим агентам доступ до графу пам'яті цього вузла (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Дивіться [Agent Persistent Memory](./agent-persistent-memory.md). |

Приклад:

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

Дивіться [Agent Persistent Memory](./agent-persistent-memory.md) для шляхів API, поведінки редактора та семантики вилучення.

## Об'єкт Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Типи вузлів

Поширені значення `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) та інші. Повний список: [Node Types](./node-types.md). Вузли на одному рівні виконання запускаються [паралельно](./parallel-execution.md).

## Компонування редактора

Кожен вузол має `position.x` та `position.y` для компонування на десктопному полотні. На екранах, вужчих за
точку перелому 768px, редактор замінює вільне полотно Vue Flow на повноекранне, відступлене
дерево workflow. Дерево відображає зв'язані шляхи виконання, позначає паралельні гілки та використовує
ті самі мітки вузлів, іконки й статус останнього запуску, що й десктопний редактор.

Торкніться вузла, щоб вибрати його. Якщо він має записаний результат виконання, відкривається його повноекранна
деталізація з вкладками input, output та error. Нижня навігація на мобільному надає **Nodes**, **Properties**,
**Run** та **More**; заголовок зберігає дії збереження, історії, пошуку, налаштувань і поширення.
Десктоп і далі використовує вільне полотно Vue Flow та бічні панелі.

Використовуйте **Add node** на мобільній вкладці Nodes для пошуку в бібліотеці вузлів. Звичайний вузол відкриває
панель з'єднання одразу після додавання: виберіть опорний вузол і розмістіть його **After**,
**Before** або як **Parallel** гілку. У режимі редагування торкніться наявного звичайного вузла, щоб відкрити ту саму
панель із вибраним поточним з'єднанням. Вузли Trigger залишаються незалежними, оскільки вони не приймають
звичайний вхід. Елемент керування редагуванням також надає дію видалення для вибраного вузла. Деталі виконання
включають стрілки попереднього та наступного, коли доступні результати суміжних
вузлів. AI Assistant відкривається над мобільним деревом як нижня панель, не
змінюючи активну вкладку редактора.

## Пов'язане

- [Node Types](./node-types.md) – Усі типи вузлів та описи
- [Canvas Features](./canvas-features.md) – Функції редактора (data pin, журнали виконання, увімкнення/вимкнення, вилучення в під-workflow)
- [Download & Import](./download-import.md) – Експорт та імпорт workflow як JSON
- [Agent Node](../nodes/agent-node.md) – Структура `data` вузла Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` та API графу пам'яті
- [Expression DSL](./expression-dsl.md) – Синтаксис для `userMessage`, `condition`, `$vars`, `$global` тощо
- [Parallel Execution](./parallel-execution.md) – Як вузли виконуються паралельно
- [Triggers](./triggers.md) – Початкові вузли та точки входу
- [Workflows Tab](../tabs/workflows-tab.md) – Створення та керування workflow
