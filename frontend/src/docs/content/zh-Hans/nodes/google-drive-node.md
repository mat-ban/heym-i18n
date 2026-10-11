# Google Drive

**Google Drive** 节点通过 OAuth2 列出、下载、更新和删除 Google Drive 中的文件与文件夹。它还可以通过单个操作将 Drive 文件直接复制到 [Heym Drive](./drive-node.md)。

> **这不是 [Drive](./drive-node.md) 节点。** 那个节点是 *Heym Drive* —— Heym 自有的内部文件存储。本节点与 Google Drive 通信。`syncToHeymDrive` 操作是两者之间的桥梁。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | Google Drive (OAuth2) |
| 输出 | `$nodeLabel.files`、`$nodeLabel.content_base64`、`$nodeLabel.download_url`、`$nodeLabel.status` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 Google Drive 凭证 |
| `gdOperation` | string | 操作：`listFolderFiles`、`downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile`、`removeFolder` |
| `gdFolderId` | expression | 文件夹 ID 或完整的 Drive 文件夹 URL。由 `listFolderFiles` 和 `removeFolder` 使用。留空表示 Drive 根目录。 |
| `gdFileId` | expression | 文件 ID 或完整的 Drive/Docs URL。由 `downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile` 使用。 |
| `gdMaxResults` | expression | 用于 `listFolderFiles`：返回的最大文件数（默认 100）。留空或为 `0` 时通过分页加载整个文件夹。当 Drive 报告大小时，每个列出的文件都包含 `size_bytes`。 |
| `gdQuery` | expression | 用于 `listFolderFiles`：与文件夹过滤条件进行 AND 运算的额外 Drive 查询，例如 `mimeType='application/pdf'`。 |
| `gdIncludeTrashed` | boolean | 用于 `listFolderFiles`：包含已放入回收站的文件。默认 false。 |
| `gdExportFormat` | string | 用于 `downloadFile` / `syncToHeymDrive`：`pdf`、`docx`、`xlsx`、`pptx`、`csv`、`txt`。留空表示自动。对常规文件忽略。 |
| `gdFilename` | expression | 用于 `syncToHeymDrive`：覆盖存储在 Heym Drive 中的文件名。 |
| `gdBase64Content` | expression | 用于 `updateFile`：替换文件内容的 base64 字符串或 `data:` URL。 |
| `gdNewName` | expression | 用于 `updateFile`：新文件名（重命名）。 |
| `gdNewParentId` | expression | 用于 `updateFile`：目标文件夹 ID 或 URL（移动）。 |
| `gdPermanentDelete` | boolean | 用于 `removeFile` / `removeFolder`：为 false（默认）时项目被放入回收站且可恢复；为 true 时将被彻底销毁。 |

## 文件和文件夹 ID

`gdFileId`、`gdFolderId` 和 `gdNewParentId` 接受**裸 ID** 或**完整 URL** —— Heym 会自动提取 ID。以下所有形式均可使用：

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs、Sheets 和 Slides

Google 原生文档**没有可下载的字节**。它们是 Google 服务器上的记录，而非文件 —— 如果你请求其原始内容，Drive API 会返回 `403 Only files with binary content can be downloaded`。

`downloadFile` 和 `syncToHeymDrive` 会自动检测这些类型并改为**导出**，因此不会仅仅因为目标是 Google Doc 而导致操作失败：

| 源 | 默认导出 |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| 任何其他 Google 原生类型 | PDF |

设置 **Export Format** 可覆盖目标格式。该设置对常规上传文件忽略，它们始终按原样下载。

## 操作

| 操作 | 必需 | 描述 |
|-----------|----------|-------------|
| `listFolderFiles` | —（空文件夹 = 根目录） | 列出文件夹中的文件，可选查询过滤条件 |
| `downloadFile` | `gdFileId` | 以 base64 下载文件字节，自动导出原生文档 |
| `syncToHeymDrive` | `gdFileId` | 从 Google Drive 下载并将结果存储到 Heym Drive |
| `updateFile` | `gdFileId` + 内容 / 名称 / 父文件夹中至少一项 | 替换内容、重命名和/或移动 |
| `removeFile` | `gdFileId` | 将文件放入回收站（默认）或永久删除 |
| `removeFolder` | `gdFolderId` | 将文件夹及其内容放入回收站（默认）或永久删除 |

### 删除默认可恢复

`removeFile` 和 `removeFolder` 将项目移动到 **Google Drive 回收站**，可在其中恢复。对于可能按计划运行或在 [Loop](./loop-node.md) 内运行的操作，这是安全的默认行为。

启用 **Delete permanently** 将彻底销毁项目且无法恢复。对于 `removeFolder`，这还会销毁文件夹内的所有内容。

该节点还会检查目标类型：`removeFile` 拒绝文件夹，`removeFolder` 拒绝文件，因此输入错误的 ID 不会静默删除错误的对象。

### updateFile 不触碰空白字段

`updateFile` 是更新，而非替换。可填写内容、新名称和新文件夹的任意组合 —— 留空的字段不会被修改。三者中至少需要填写一项。
## 凭据设置

Google Drive 使用 **OAuth2“自带应用”** 模式。您需要提供自己的 Google Cloud OAuth2 凭据。

> **此凭据授予完整的 Drive 访问权限。** Heym 请求 `https://www.googleapis.com/auth/drive` 作用域，因为该节点操作的是您已拥有的文件。较窄的 `drive.file` 作用域只能看到应用自身创建的文件，这将导致无法列出、更新和删除您现有的文件。在将此凭据共享给团队之前，请参阅[凭据共享](../reference/credentials-sharing.md)。

**后端配置：** 将 Heym 后端的 **`FRONTEND_URL`** 设置为应用的公开 URL。OAuth 重定向 URI 始终为 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` —— 它仅由此设置派生，而不来自请求头。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 启用 **Google Drive API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 选择 **Web application**。
3. 在 **Authorized redirect URIs** 下，准确添加 `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`。
4. 复制 **Client ID** 和 **Client Secret**。
5. 在 Heym 中：**Dashboard → Credentials → New → Google Drive (OAuth2)**，粘贴这两个值，然后点击 **Connect** 并在弹窗中批准访问。

## 输出

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

对于文件夹和 Google 原生文件，`size_bytes` 为 `null`，因为它们不报告大小。

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

对于常规文件，`exported` 为 `false`，`export_format` 为 `null`。

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` 是新的 **Heym Drive** 文件 ID，与 `google_file_id` 不同。

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` 为 `"trashed"` 或 `"permanent"`。

## 示例：将 Drive 文件夹备份到 Heym Drive

1. **[Cron](./cron-node.md)** —— 每天运行。
2. **Google Drive** —— 对源文件夹执行 `listFolderFiles`，如果您只需要 PDF，则将 `gdQuery` 设置为 `mimeType='application/pdf'`。
3. **[Loop](./loop-node.md)** —— 遍历 `$ListReports.files`。
4. **Google Drive** —— 执行 `syncToHeymDrive`，将 `gdFileId` 设置为 `$BackupLoop.item.id`，将 `gdFilename` 设置为 `$BackupLoop.item.name`。
5. **[Slack](./slack-node.md)** —— 发布已备份内容的摘要。

## 注意事项

- 每个文本字段都接受 `$` 表达式，因此 ID 和文件名可以来自之前的节点。
- 支持共享驱动器 —— 该节点在每个请求中都会设置 `supportsAllDrives`。
- 下载会根据后端的 `FILE_MAX_SIZE_MB` 设置进行大小检查。
- 将此节点附加到 [Agent](./agent-node.md) 节点的工具输入，并使用任意字段上的机器人图标让 Agent 在运行时填充该字段。

## 另请参阅

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [凭据](../reference/credentials.md)
- [凭据共享](../reference/credentials-sharing.md)
