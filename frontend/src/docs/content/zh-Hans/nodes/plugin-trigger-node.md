# Plugin Trigger

**Plugin Trigger** 节点是 [Plugin 节点](./plugin-node.md) 的 Trigger 类型对应物。它由已安装的插件提供，该插件的 `kind` 为 `trigger`，并生成 Workflow 启动所需的初始数据。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.<keys returned by the plugin>` |

Trigger 插件可以表示任何来源——不同的应用程序、第三方服务或其他技术——只要该插件的 handler 返回 Workflow 应当起始的数据即可。

## 何时使用

当已安装的插件定义了启动 Workflow 的 Trigger 时，请使用 Plugin Trigger 节点。对于在 Workflow 中途执行操作的插件，请改用 [Plugin 节点](./plugin-node.md)。

## 配置

与 Plugin 节点类似，配置表单由插件的 manifest 字段生成。非密钥字符串字段使用表达式输入，密钥字段则被掩码处理。

## 插件的运行方式

插件代码是受信任的（由 Heym 交付、由运维人员安装），并在进程内运行。安装权限仅限于 `HEYM_PLUGIN_ADMIN_EMAILS`，且该子系统由 `HEYM_PLUGINS_ENABLED` 控制。请参阅[运行与部署](../getting-started/running-and-deployment.md)。

## 编写插件

要构建 Trigger 插件包，请参阅[插件编写](../reference/plugin-authoring.md)，了解 zip 布局、manifest 字段、handler 签名、图标、依赖项以及运行时信任模型。
