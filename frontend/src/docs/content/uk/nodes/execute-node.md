# Execute

Вузол **Execute** викликає інший workflow (під-workflow) та передає йому вхідні дані. Використовуйте його для логіки, яку можна повторно застосовувати, а не для перетворення даних — для цього призначено [Set](./set-node.md).

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `executeWorkflowId` | UUID | ID workflow, який потрібно виконати |
| `executeInput` | expression | Єдиний вхід (для workflow з одним вхідним полем) |
| `executeInputMappings` | array | `{ key, value }` для кількох входів. `key` = назва вхідного поля цільового workflow. |
| `executeDoNotWait` | boolean | Якщо `true`, під-workflow запускається у фоновому режимі без очікування. Вихід: `{ "status": "dispatched", "workflow_id": "..." }`. За замовчуванням: `false`. |

## Формат відповіді

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

## Без очікування

Коли встановлено `executeDoNotWait: true`, вузол запускає під-workflow у фоновому потоці та негайно повертає:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Батьківський workflow переходить до наступного вузла, не очікуючи. Запис про виконання під-workflow асинхронно додається до трасування після його завершення. Використовуйте це, коли результат під-workflow не потрібен на наступних етапах.

## Єдиний вхід

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

## Кілька входів

Коли цільовий workflow має кілька вхідних полів, використовуйте `executeInputMappings`:
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

`key` має відповідати ключам `inputFields` вузла [Input](./input-node.md) цільового workflow.

## Пов'язане

- [Можливості Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow для створення вузлів Execute з вибраних вузлів
- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вузол Input](./input-node.md) – Вхідні поля цільового workflow
- [Вузол Set](./set-node.md) – Перетворення даних (а не виклики workflow)
