# Switch

**Switch** 节点根据将值与各 case 进行匹配的结果，将执行路由到不同的路径。支持 N 个 case 外加一个默认分支。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | n（每个 case 一个 + 默认分支） |
| 输出 | 将输入透传至匹配的分支 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `expression` | expression | 要评估的值（例如 `$input.category`） |
| `cases` | string[] | 要匹配的 case 值（例如 `["case1", "case2", "case3"]`） |

## 边连接点

- 每个 case 都有一个源连接点（索引 0、1、2、……）
- 用于未匹配值的默认连接点

## 示例

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

将边的 `sourceHandle` 设置为 case 索引（0、1、2）或用于未匹配值的默认连接点。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [Condition 节点](./condition-node.md) – If/else 分支
- [Expression DSL](../reference/expression-dsl.md) – 表达式语法
