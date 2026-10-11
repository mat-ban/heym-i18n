# 合并

**Merge** 节点等待多个并行输入，并将它们合并为单个输出。当您需要在继续执行之前汇合来自并行分支的结果时，请使用该节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | n（可配置） |
| 输出 | 1 |
| 输出 | `$nodeLabel.merged` – 包含来自各分支输入的对象 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `inputCount` | number | 需要等待的输入数量（默认：2） |

## 何时使用

- 当您需要**合并**或**汇合**来自并行分支的结果时使用
- **不要**用于以独立 [Output](./output-node.md) 节点结束的并行 Workflow
- 每个输入分支都会为合并后的输出提供内容

## 示例

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

将多个分支连接到 Merge 节点。该节点会等待所有输入后再生成输出。

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [并行执行](../reference/parallel-execution.md) – 并行分支如何运行
- [Workflow 结构](../reference/workflow-structure.md) – 边与句柄
