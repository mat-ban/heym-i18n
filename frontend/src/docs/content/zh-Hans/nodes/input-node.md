# 输入

**Input** 节点是工作流的入口点，用于接收来自用户或 API 调用方的数据。它支持单个或多个输入字段，并暴露请求元数据（headers、query params）。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.body.fieldKey`、`$nodeLabel.headers`、`$nodeLabel.query` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `value` | string | 单个文本输入的默认值（可选） |
| `inputFields` | array | 输入字段定义。每项为：`{ key, defaultValue? }` |

### 输入字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `key` | string | 字段键（例如 `text`、`imageUrl`、`base64`） |
| `defaultValue` | string | 未提供时的默认值（可选） |

## 访问输入数据

**Body 字段**（始终使用 `$nodeLabel.body.fieldKey`）：

- `$userInput.body.text` – 文本字段
- `$userInput.body.imageUrl` – 图片 URL
- `$userInput.body.userId` – 若已配置则使用默认值
- `$userInput.body.event.user.id` – 来自 Generic webhook 模式的嵌套 JSON

**请求元数据**（通过 API 执行时）：

- `$userInput.headers` – 所有 headers（键为小写）
- `$userInput.headers.authorization` – 特定 header
- `$userInput.query` – query 参数
- `$userInput.query.param1` – 特定 query 参数

## 运行面板文件输入

在编辑器的 **Run** 标签页中（Defined webhook 模式），每个输入字段都支持拖放操作以及内联附件控件（位于字段右下角）：

- **文本文件**（`.txt`、`.md`、`.json`、`.csv` 及类似格式）会以纯文本形式读取。
- **图片**（JPEG、PNG、GIF、WebP）会以 `data:` URL（base64）形式存储在字段值中——当下游节点需要图片数据时，请使用 `imageUrl` 或 `base64` 等字段键。
- **PDF** 文件会被转换为提取的文本（文件最大 5 MB，内容最多 100k 字符）。

每个字段仅支持一个文件。文件加载后，你仍可编辑文本区域。Generic webhook 模式（原始 JSON body）不会显示逐字段的文件控件。

## 输入字段与 Generic Webhooks 的对比

`inputFields` 仍用于描述 defined 模式编辑器表单、子工作流映射以及其他由元数据驱动的界面所期望的输入。

当工作流使用 **Generic** webhook body 模式时，传入的 HTTP body 不会根据 `inputFields` 进行重塑。相反，原始 JSON payload 会直接传递到 `$nodeLabel.body`，并且 Input 节点的字段添加/移除控件会在节点面板中隐藏。

## 示例

**单个输入（默认）：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**多个输入：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [Triggers](../reference/triggers.md) – 入口点（Input、Cron、RabbitMQ）
- [表达式 DSL](../reference/expression-dsl.md) – 引用 `$nodeLabel.body`、`$nodeLabel.query`
- [Portal](../reference/portal.md) – 将工作流暴露为聊天 UI
- [Webhooks](../reference/webhooks.md) – 工作流的 HTTP trigger
