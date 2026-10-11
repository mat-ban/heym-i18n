# Plugin 开发

Heym 插件是由运维人员安装的可信 zip 包。一个包可以在不修改核心应用的情况下添加一个或多个自定义 action 或 trigger 节点。

## 包结构

插件 zip 必须在包根目录包含 `plugin.json`，以及由 `entry` 指定的 Python 入口文件（默认为 `handler.py`）。

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` 是可选的，会作为插件的文档页面提供。将 `icon.svg` 放在包根目录可作为默认节点图标，或在 `plugin.json` 中为特定节点设置 `icon` 路径。

## Manifest

当一个包暴露多个节点时，使用多节点 `plugin.json`：

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

也接受旧版的单节点 manifest：省略 `nodes`，并在顶层提供 `kind`、`fields`、`dslHint` 和 `docSlug`。

## Manifest 字段

| 字段 | 说明 |
|-------|-------|
| `id` | 小写包 id，使用字母、数字和连字符。 |
| `name` | 人类可读的包名称。 |
| `version` | 用于显示和 handler 缓存的包版本。 |
| `description` | 在 UI 和助手上下文中显示的简短描述。 |
| `entry` | zip 内的 Python handler 文件路径；默认为 `handler.py`。 |
| `dependencies` | 可选的 pip 依赖，通过 `uv pip install` 安装。 |
| `nodes` | 此包暴露的自定义节点。 |

每个节点需要一个唯一的 `key`、一个 `name`，以及 `kind` 为 `action` 或 `trigger`。如果省略 `function`，action 会调用 `run`，trigger 会调用 `trigger`。

支持的字段类型有 `string`、`number`、`boolean` 和 `select`。Select 字段使用由 `{ "label": "...", "value": "..." }` 对象组成的 `options` 数组。为必填字段设置 `required`，为掩码输入设置 `secret`。Manifest 还接受字段的 `default`、`dynamic` 和 `expression` 元数据；这些会随 manifest 一起存储，但插件节点目前在运行时读取已保存的节点配置，而不会根据默认值自动填充缺失的配置。

非 secret 的字符串字段使用表达式输入 UI 渲染。在运行时，任何以 `$` 开头的已保存字符串配置值都会在调用 handler 之前被解析。

## Handler 函数

Action handler 接收 workflow 输入、已解析的配置以及一个小型上下文：

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger handler 接收已解析的配置和上下文：

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

返回一个字典以暴露具名输出字段。如果 handler 返回其他类型，Heym 会将其包装为 `{ "value": result }`。

## 安装与运行时

插件默认处于禁用状态。运维人员通过 `HEYM_PLUGINS_ENABLED=true` 启用它们，并通过 `HEYM_PLUGIN_ADMIN_EMAILS` 限制管理权限。已安装的插件文件位于 `HEYM_PLUGINS_DIR` 下，在容器部署中应持久化挂载。

插件代码是可信的、由运维人员安装的 Python 代码，与后端在同一进程内运行。它可以访问网络和已安装的库，因此请仅安装你愿意以与 Heym 本身相同信任级别运行的包。
