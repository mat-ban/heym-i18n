# 变量

**Variable** 节点用于设置或更新变量，可通过 `$vars.variableName`（工作流本地）或 `$global.variableName`（持久化）从任意节点访问。适用于计数器、累积列表以及工作流中的共享状态。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.value`，或通过 `$vars.variableName` / `$global.variableName` 访问 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `variableName` | string | 变量名（用作 `$vars.variableName` 或 `$global.variableName`）。避免使用[保留名称](../reference/expression-dsl.md)。 |
| `variableValue` | expression | 要设置的值。支持表达式。 |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | 类型强制转换（默认：auto） |
| `isGlobal` | boolean | 当为 `true` 时，存储到 [Global Variable Store](../reference/global-variables.md)（持久化，用户作用域）。当为 `false` 或省略时，为工作流本地（内存中）。 |

## 数组变量

在使用 `.add()` 之前，先在 Variable 节点中使用 `$array()` 或 `$array("a", "b")` 初始化数组：

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

然后添加项（括号内不要使用 `$`）：

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## 关键规则

**切勿在方法括号内使用 `$`：**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – 会破坏表达式

## 示例 – 计数器

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## 相关内容

- [Node Types](../reference/node-types.md) – 所有节点类型概述
- [Loop Node](./loop-node.md) – 在循环体中使用 Variable 收集项
- [Expression DSL](../reference/expression-dsl.md) – `$vars`、`$global`、保留名称
- [Global Variables](../reference/global-variables.md) – 使用 `isGlobal` 的持久化变量
