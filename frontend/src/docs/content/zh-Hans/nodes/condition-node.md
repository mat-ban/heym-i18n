# 条件

**Condition** 节点基于 if/else 表达式对工作流进行分支。根据结果路由到 true 或 false 路径。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 2（true、false） |
| 输出 | 将输入传递到所选分支 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `condition` | expression | 类 JavaScript 表达式（例如 `$input.text.length > 0`） |

## 边句柄

- **源句柄 `true`** – 当条件求值为真值时
- **源句柄 `false`** – 当条件求值为假值时

## 表达式运算符

支持：`==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`、`.length`、`.contains()` 等。参见 [Expression DSL](../reference/expression-dsl.md)。

## 示例

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

使用 `sourceHandle: "true"` 或 `sourceHandle: "false"` 连接边，以路由到不同分支。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [Switch 节点](./switch-node.md) – 按值进行多路路由
- [Expression DSL](../reference/expression-dsl.md) – 条件语法
- [表达式求值对话框](../reference/expression-evaluation-dialog.md) – 带实时后端预览的可展开编辑器，用于条件
