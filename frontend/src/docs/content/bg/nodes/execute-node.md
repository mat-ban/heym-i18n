# Execute

**Node** Execute извиква друг workflow (sub-workflow) и подава входни данни към него. Използвайте го за многократно използваема логика, а не за трансформация на данни — за това използвайте [Set](./set-node.md).

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `executeWorkflowId` | UUID | ID на workflow, който да бъде изпълнен |
| `executeInput` | expression | Единичен вход (за workflow с едно входно поле) |
| `executeInputMappings` | array | `{ key, value }` за множество входове. `key` = име на входното поле на целевия workflow. |
| `executeDoNotWait` | boolean | Когато е `true`, изпраща sub-workflow във фонов режим без изчакване. Изход: `{ "status": "dispatched", "workflow_id": "..." }`. По подразбиране: `false`. |

## Формат на отговора

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Без изчакване

Когато `executeDoNotWait: true`, node изпраща sub-workflow към фонова нишка и незабавно връща:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Родителският workflow продължава към следващия node без изчакване. Записът за изпълнение на sub-workflow се записва в трасето асинхронно, когато приключи. Използвайте това, когато резултатът от sub-workflow не е необходим надолу по веригата.

## Единичен вход

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Множество входове

Когато целевият workflow има множество входни полета, използвайте `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` трябва да съвпада с ключовете `inputFields` на [Input](./input-node.md) на целевия workflow.

## Свързани

- [Функции на Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow за създаване на Execute nodes от избрани nodes
- [Типове nodes](../reference/node-types.md) – Общ преглед на всички типове nodes
- [Input Node](./input-node.md) – Входни полета на целевия workflow
- [Set Node](./set-node.md) – Трансформация на данни (не за извикване на workflow)
