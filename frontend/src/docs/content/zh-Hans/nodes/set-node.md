# 赋值

**Set** 节点用于转换和映射输入数据，生成自定义输出。可用于大写转换、子字符串提取、字符串拼接、随机数生成以及任何数据转换——不用于调用工作流（调用工作流请使用 [Execute](./execute-node.md)）。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | 每个映射键对应 `$nodeLabel.keyName` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `mappings` | array | 键值对。每项为：`{ key, value }`，其中 `value` 是一个[表达式](../reference/expression-dsl.md) |

## Agent 工具用法

当 Set 节点作为画布节点工具连接到 [Agent 节点](./agent-node.md) 时，每个映射值都可以通过机器人图标标记为 **agent-provided**（由 Agent 提供）。被标记的映射值将成为工具参数，由 Agent 在运行时填充。未标记的映射则保持节点配置中的固定值。

机器人图标仅在 Set 节点连接到 Agent 的工具句柄时才会显示。独立的 Set 节点不会显示 agent-provided 控件。

## 表达式规则

- 引用之前的节点：`$nodeName.text`、`$nodeName.body.field`
- 使用函数：`$randomInt(1, 10)`、`$range(1, 5)`、`$now.format('HH:mm')`
- `$range(a,b)` 不包含 b；当 `a > b` 时会报错。
- 表达式开头只能有一个 `$`——括号内绝不能出现
- 通过键访问输出：`$setNode.randomNumber`、`$setNode.text`

## 示例

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

下游节点可通过 `$transformData.text`、`$transformData.firstChar`、`$transformData.randomNum`、`$transformData.rangeArr` 进行访问。

## 相关

- [JSON 输出映射器](./json-output-mapper-node.md) – 相同的映射；唯一终端为 Webhook/运行返回根 JSON
- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [Execute 节点](./execute-node.md) – 调用工作流（而非数据转换）
- [表达式 DSL](../reference/expression-dsl.md) – 函数与语法
- [表达式求值对话框](../reference/expression-evaluation-dialog.md) – 可展开编辑器，支持实时后端预览以及映射的上一个/下一个导航
