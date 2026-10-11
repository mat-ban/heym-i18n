# 执行

**Execute** 节点调用另一个工作流（子工作流）并向其传递输入。将其用于可复用的逻辑，而非数据转换——数据转换请使用 [Set](./set-node.md)。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.outputs.output.result`、`$nodeLabel.status`、`$nodeLabel.workflow_id` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `executeWorkflowId` | UUID | 要执行的工作流的 ID |
| `executeInput` | expression | 单一输入（用于只有一个输入字段的工作流） |
| `executeInputMappings` | array | 用于多个输入的 `{ key, value }`。`key` = 目标工作流的输入字段名称。 |
| `executeDoNotWait` | boolean | 当为 `true` 时，在后台派发子工作流而不等待。输出：`{ "status": "dispatched", "workflow_id": "..." }`。默认值：`false`。 |

## 响应格式

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

## 不等待

当 `executeDoNotWait: true` 时，该节点将子工作流派发到后台线程并立即返回：

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

父工作流无需等待即可继续执行下一个节点。子工作流的执行记录会在其完成时异步写入 trace。当下游不需要子工作流的结果时，请使用此选项。

## 单一输入

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

## 多个输入

当目标工作流有多个输入字段时，请使用 `executeInputMappings`：
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

`key` 必须与目标工作流的 [Input](./input-node.md) `inputFields` 键匹配。

## 相关

- [Canvas Features](../reference/canvas-features.md) – 提取为子工作流，以从选定的节点创建 Execute 节点
- [Node Types](../reference/node-types.md) – 所有节点类型的概述
- [Input Node](./input-node.md) – 目标工作流的输入字段
- [Set Node](./set-node.md) – 数据转换（而非工作流调用）
