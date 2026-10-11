# Plugin

**Plugin** 节点运行由已安装插件提供的自定义操作。插件通过新的节点类型（操作、第三方集成，或任何可用 Python 表达的内容）扩展 Heym，而无需修改核心应用程序。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.<keys returned by the plugin>` |

一个插件**包**（单个 zip）可以包含**多个节点**——操作与 Trigger 的任意组合。每个节点都会以各自的名称和描述出现在 **Plugins** 分类下的节点面板中。将其中一个拖到画布上会创建一个 Plugin 节点，并绑定到该包（`pluginId`）和节点（`pluginNodeKey`）。

## 何时使用

当运维人员安装了能够执行你所需操作的插件时，请使用 Plugin 节点——例如调用私有 API、与内部系统通信，或运行专为你的部署编写的定制逻辑。

关于用于启动工作流的 Trigger 类插件，请参阅 [Plugin Trigger 节点](./plugin-trigger-node.md)。

## 配置

该节点的配置表单由插件的 manifest 生成。插件声明的每个字段（`string`、`number`、`boolean` 或 `select`）都会自动渲染。非机密的 string 字段使用表达式输入，且以 `$` 开头的已保存 string 配置值会在插件 handler 运行前被解析。

机密字段（例如 API keys）在 UI 中会被遮蔽，且绝不会写入日志。

## 插件的运行方式

插件由 Heym 分发并由运维人员安装，因此插件代码是**受信任的**，会像内置节点一样在进程内运行，拥有完整的网络和库访问权限。插件可以声明 pip `dependencies`，这些依赖会在安装时安装到实例中。

安装和移除插件仅限其电子邮件列在 `HEYM_PLUGIN_ADMIN_EMAILS` 中的运维人员执行，且整个子系统由 `HEYM_PLUGINS_ENABLED` 控制（默认禁用）。有关环境变量，请参阅 [运行与部署](../getting-started/running-and-deployment.md)。

## 自定义图标

插件可以附带自定义 SVG 徽标。将 `icon.svg` 放在包根目录可为每个节点设置默认图标，和/或在 manifest 中为某个节点指定其自己的 `"icon": "<file>.svg"`。图标会同时显示在节点面板卡片和画布节点上；没有图标的节点会回退到默认的拼图块图标。

## AI Builder

已安装的插件会呈现给 AI 助手和聊天画布，因此你可以要求 Heym“使用 Acme CRM 插件创建一条记录”，它会生成带有正确 `pluginId` 和 `config` 的 Plugin 节点。

## 编写插件

要构建插件包，请参阅 [插件编写](../reference/plugin-authoring.md)，了解 zip 布局、manifest 字段、handler 签名、图标、依赖项以及运行时信任模型。
