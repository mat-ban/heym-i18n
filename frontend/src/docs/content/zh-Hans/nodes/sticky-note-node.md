# 便签

**便签**节点用于向画布添加富 Markdown 注释。该节点不会被执行——可用于文档说明、操作指引、参考图片或工作流备注。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 0 |
| 输出 | 不适用（不执行） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `stickyTitle` | string | 显示在便签顶部的标题。 |
| `stickyColor` | string | 背景颜色：`yellow`、`sky`、`emerald`、`rose`、`violet` 或 `zinc`。 |
| `note` | string | Markdown 内容。在画布上双击即可编辑。支持链接和图片 Markdown，例如 `![Alt](https://example.com/image.png)`。 |

## 示例

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [工作流组织](../reference/workflow-organization.md) – 组织工作流
