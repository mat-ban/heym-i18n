# Drive

**Drive** 节点可直接在工作流中管理由技能生成的文件。使用该节点可以检索文件、从外部 URL 下载文件、删除文件、与团队共享或取消共享文件，或以编程方式更新文件的访问约束（密码、过期时间、下载次数限制）。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.files`、`$nodeLabel.status`、`$nodeLabel.file_id`、`$nodeLabel.download_url`（因操作而异） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `driveOperation` | string | 操作类型：`get`、`getAll`、`downloadUrl`、`save`、`delete`、`setPassword`、`setTtl`、`setMaxDownloads`、`shareWithMyTeams`、`unshareWithMyTeams` |
| `driveFileId` | expression / select | 要管理的 Drive 文件的 UUID（除 `getAll`、`downloadUrl` 和 `save` 之外的所有操作均需要） |
| `driveLimit` | number | 返回的最大文件数（仅 `getAll`；留空表示无限制） |
| `driveSourceUrl` | expression | 要获取并存储到 Drive 中的 URL（仅 `downloadUrl`） |
| `driveFilename` | expression | 包含扩展名的完整文件名（仅 `save`，例如 `1.mp3`） |
| `driveBase64Content` | expression | 要解码并存储的原始 base64 字符串或 data URL（仅 `save`） |
| `driveIncludeBinary` | boolean | 在输出中以 base64 形式包含文件内容（仅 `get`） |
| `drivePassword` | expression | 要在访问 Token 上设置的密码（仅 `setPassword`） |
| `driveTtlHours` | number | 下载链接过期前的小时数（仅 `setTtl`） |
| `driveMaxDownloads` | number | 允许的最大下载次数（仅 `setMaxDownloads`） |

## 获取文件 ID

当技能生成文件时，输出中会包含一个 `_generated_files` 数组。每个条目都包含一个 `id` 字段：

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

使用以下方式引用文件 ID：`$agentLabel._generated_files[0].id`

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|----------------|-------------|
| `get` | driveFileId | 从 Drive 中检索文件元数据（以及可选的二进制内容） |
| `getAll` | 无 | 列出拥有的和团队共享的可读 Drive 文件，包含文件名、MIME 类型、大小、来源和下载 URL 等元数据 |
| `downloadUrl` | driveSourceUrl | 从外部 URL 获取文件并存储到 Drive 中 |
| `save` | driveFilename, driveBase64Content | 解码 base64 内容并将其存储为 Drive 文件 |
| `delete` | driveFileId | 从磁盘和数据库中删除该文件及其所有访问 Token |
| `setPassword` | driveFileId, drivePassword | 将默认公共 Token 替换为受密码保护的 Token |
| `setTtl` | driveFileId, driveTtlHours | 将默认公共 Token 替换为 N 小时后过期的 Token |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | 将默认公共 Token 替换为限制下载 N 次的 Token |
| `shareWithMyTeams` | driveFileId | 以只读方式将文件共享给工作流所有者当前所属的所有团队 |
| `unshareWithMyTeams` | driveFileId | 移除该文件的所有团队共享 |

> **注意：** `set*` 操作会删除默认（无约束）公共 Token，并创建一个带指定约束的新 Token。更新后的 `download_url` 会包含在输出中。
> **团队共享：** `shareWithMyTeams` 会为所有者当前所属的团队创建显式共享。除非再次运行该操作，否则未来新增的团队不会自动添加。`unshareWithMyTeams` 会移除该文件的所有团队共享。

## 示例 — 从 URL 下载文件

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

在下游引用存储的文件：`$fetchReport.id`、`$fetchReport.download_url`

文件名取自 `Content-Disposition` 响应头；如果不存在，则从 URL 路径中推导。

## 示例 — 将 Base64 输入保存到 Drive

当文本输入节点（或任何上游节点）提供 base64 文件内容时，可使用此示例：

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

在下游引用存储的文件：`$saveAudio.id`、`$saveAudio.download_url`

`driveBase64Content` 接受原始 base64 字符串或 `data:...;base64,...` data URL。MIME 类型从文件扩展名推断。

## 示例 — 获取文件并在 Vision LLM 中使用二进制内容

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

在下游引用 base64 内容：`$fetchImage.file_base64`

通过 `file_base64` 返回的图像在运行工作流时会在调试面板中内联显示。

## 示例 — 列出 Drive 文件

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

在下游引用返回的第一个文件：`$listFiles.files[0].filename`、`$listFiles.files[0].size_bytes`
## 示例 — 处理后删除文件

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## 示例 — 为生成的文件设置密码

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## 示例 — 设置过期时间（TTL）

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## 示例 — 限制下载次数

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## 示例 — 与我的团队共享

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

团队成员可以从 Drive 查看和下载该文件，并在 Workflow 中使用读取操作。他们无法删除、重新共享或更改公开链接约束。

## 示例 — 取消与我的团队共享

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## 转换文件

格式转换已移至 [Converter](./converter-node.md) 节点。使用 Drive 存储或获取文件，然后将其 id 传递给 converter 节点：

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

原始文件将被保留，转换后的文件将作为新的 Drive 文件存储。

## 输出访问

**get：**
- `$nodeLabel.id` — 文件的 UUID
- `$nodeLabel.filename` — 文件名
- `$nodeLabel.mime_type` — MIME 类型（例如 `image/png`）
- `$nodeLabel.size_bytes` — 文件大小（字节）
- `$nodeLabel.download_url` — 公开下载 URL
- `$nodeLabel.file_base64` — base64 编码的文件内容（仅在启用 **Include binary content** 时）

**getAll：**
- `$nodeLabel.files` — 文件元数据对象数组
- `$nodeLabel.count` — 返回的文件数量
- `$nodeLabel.files[0].id` — 文件的 UUID
- `$nodeLabel.files[0].filename` — 文件名
- `$nodeLabel.files[0].mime_type` — MIME 类型
- `$nodeLabel.files[0].size_bytes` — 文件大小（字节）
- `$nodeLabel.files[0].download_url` — 存在公开 Token 时的公开下载 URL
- `$nodeLabel.files[0].metadata` — 存储的元数据对象
- `$nodeLabel.files[0].created_at` — 文件创建时间戳

**downloadUrl：**
- `$nodeLabel.id` — 新存储文件的 UUID
- `$nodeLabel.filename` — 文件名（来自 `Content-Disposition` 或 URL 路径）
- `$nodeLabel.mime_type` — 从响应或文件扩展名检测到的 MIME 类型
- `$nodeLabel.size_bytes` — 文件大小（字节）
- `$nodeLabel.download_url` — 已存储文件的 Drive 下载 URL

**delete：**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — 已删除文件的 UUID

**setPassword / setTtl / setMaxDownloads：**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — 文件的 UUID
- `$nodeLabel.download_url` — 应用约束后的新访问 Token URL

**shareWithMyTeams：**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 文件的 UUID
- `$nodeLabel.shared_team_count` — 操作后的团队共享数量

**unshareWithMyTeams：**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 文件的 UUID
- `$nodeLabel.shared_team_count` — 操作后为 `0`

## 所有权

仅限所有者操作要求文件属于 Workflow 所有者。读取操作（`get`、`getAll`）也可以访问通过团队与 Workflow 所有者共享的文件。

## 相关

- [文件生成](../reference/file-generation.md) - 技能如何生成文件以及 `_generated_files` 输出
- [Drive 标签页](../reference/drive.md) - 仪表盘中的可视化文件管理
- [Agent 节点](./agent-node.md) - 运行生成文件的技能
- [Converter 节点](./converter-node.md) - 将已存储的文件转换为其他格式，或通过 OCR 转换为文本
- [表达式 DSL](../reference/expression-dsl.md) - 动态值的表达式语法
