# Variables 标签页

**Variables** 标签页用于管理 **Global Variable Store**——在所有 Workflow 之间共享的持久化键值数据。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ 观看 Variables 演示</a></p>

## 概述

- 创建、编辑和删除全局变量
- 变量以用户为作用域，并在 Workflow 执行之间持久保留
- 通过 `$global.variableName` 在表达式中引用

## 创建变量

1. 点击 **New Variable**
2. 输入 **名称**（用于表达式中）
3. 设置 **值**（字符串、数字、布尔值、数组或对象）
4. 选择 **值类型**（Auto、String、Number、Boolean、Array、Object）

## 编辑与删除

- **编辑** – 点击变量行上的编辑图标
- **删除** – 点击垃圾桶图标；使用该变量的 Workflow 将需要替换
- **批量删除** – 选择多个变量并使用 **Delete selected**

## 在 Workflow 中使用

在任何表达式中引用变量：

```
$global.environment
$global.settings.baseUrl
```

您还可以通过启用 **Store in Global Variable Store**，从 [Variable 节点](../nodes/variable-node.md) 设置全局变量。

## 相关内容

- [Global Variables](../reference/global-variables.md) – 参考指南
- [Variable 节点](../nodes/variable-node.md) – 使用 `isGlobal` 设置变量
- [Expression DSL](../reference/expression-dsl.md) – `$global` 语法
- [Chat 标签页](./chat-tab.md) – Chat 可访问全局变量
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表盘界面的精简页面指南
