# 循环

**Loop** 节点用于遍历数组，针对每个元素执行下游节点。需要从迭代体中的最后一个节点建立回连以推进迭代。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 2（默认 + loop 回连） |
| 输出 | 2（loop、done） |
| 输出 | `$nodeLabel.item`、`$nodeLabel.index`、`$nodeLabel.total`、`$nodeLabel.isFirst`、`$nodeLabel.isLast` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `arrayExpression` | expression | 解析为数组的表达式（例如 `$input.items`） |

## 边句柄

- **源 `loop`** – 连接到处理每个元素的节点（每次迭代运行时执行）
- **源 `done`** – 连接到所有迭代完成后运行的节点
- **目标 default** – 接收包含数组的初始数据
- **目标 `loop`** – 接收来自迭代体最后一个节点的回连

## Loop 上下文（在迭代体内）

- `$loopNode.item` – 当前元素
- `$loopNode.index` – 从 0 开始的索引
- `$loopNode.total` – 元素总数
- `$loopNode.isFirst` – 布尔值
- `$loopNode.isLast` – 布尔值

## 关键规则

1. **必须建立回连：** 迭代体中的最后一个节点必须连接回 loop 的 `loop` 输入句柄。
2. **迭代体内不可有输出：** 迭代体内禁止使用 [Output](./output-node.md) 节点。请使用 [Set](./set-node.md) 或 [Variable](./variable-node.md) 处理中间结果。
3. **不会自动收集结果：** loop 不会收集结果。请使用 Variable 节点配合 `$array()` 和 `.add()` 进行累积。

## 示例

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

流程：loop → 处理节点 →（回连至 loop）→ loop → done 分支 → output。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [Variable 节点](./variable-node.md) – 在 loop 中收集元素
- [表达式 DSL](../reference/expression-dsl.md) – `item`、`index`、数组方法
