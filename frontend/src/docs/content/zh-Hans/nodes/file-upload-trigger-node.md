# 文件上传 Trigger

**文件上传 Trigger** 节点是一个零输入入口点，适用于需要**大文件**（音频、视频、归档文件）的工作流，这些文件无法作为 base64 嵌入到 JSON 请求中。调用工作流会返回一个预填充的、一次性使用的 `curl` 上传链接；将文件上传到该链接即可启动运行，并附带该文件。

当调用方——包括在沙箱中运行的 Claude 或 ChatGPT 等 AI Agent——必须将 20 MB 的语音录音或 75 MB 的视频交给 Heym 工作流时，请使用此节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.file.{id,name,mime,size,download_url}`、`$nodeLabel.uploaded_at` |

## 工作原理

该节点分两个阶段运行：

1. **生成（Mint）。** 当工作流通过 HTTP（`POST /api/workflows/{id}/execute`）、作为 MCP 工具或通过画布的 **Run Workflow** 按钮被调用时，运行**不会**执行主体。相反，它会生成一个一次性使用的上传槽位并返回：

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **上传 + 运行。** 调用方使用其文件运行 `curl`。上传 Endpoint 会验证槽位、存储文件、**同步**运行工作流，并在上传响应中返回工作流输出。该链接为**一次性使用**——第二次上传会返回 `409`。

在画布上，**Run Workflow** 会在调试面板中显示生成的 `curl`，并附带一个复制按钮。

## 参数

| 参数 | 类型 | 默认值 | 描述 |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | 上传链接保持有效的时长（1–10080 分钟 / 最长 7 天）。 |
| `maxSizeMb` | number | `100` | 接受的最大文件大小。硬性上限为 **100 MB**。 |
| `allowedTypes` | string | （空） | 可选的逗号分隔 MIME/扩展名允许列表，例如 `audio/*, .wav`。留空则允许任何类型。 |

## 输出字段

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.file.id` | 存储文件的 UUID（一个 Drive 文件）。 |
| `$nodeLabel.file.name` | 原始文件名。 |
| `$nodeLabel.file.mime` | 检测到的内容类型。 |
| `$nodeLabel.file.size` | 大小（以字节为单位）。 |
| `$nodeLabel.file.download_url` | 供下游节点使用的已认证下载 URL。 |
| `$nodeLabel.uploaded_at` | 上传的 ISO 时间戳。 |

## 示例

一个转录工作流：

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. 一个 Agent 调用工作流的 MCP 工具并收到 `curl`。
2. 该 Agent 使用其沙箱中的录音运行 `curl`。
3. 上传会运行工作流，`curl` 响应中包含转录摘要。

## 安全性

- 上传 URL 嵌入了高熵 Token——该 Token **本身**就是能力凭证，因此沙箱化的 Agent 无需 Heym 凭据即可上传。服务器端仅存储 Token 的哈希值。
- 生成（Mint）需要正常的工作流身份验证，因此只有经过授权的调用方才能创建上传链接。
- 每次生成和每次上传尝试（无论被接受还是被拒绝——过期、重放、超大、不允许的类型、未知 Token）都会写入仅追加的审计追踪。
- 上传强制执行一次性使用、受 TTL 限制并设有大小上限；超大上传会被拒绝。

## 注意事项

- 通用的 HTTP、MCP 和画布调用通道仍然仅支持 JSON；此节点是接受 multipart 文件上传的受支持方式。
- 上传的文件会作为普通的 Drive 文件存储，因此任何接受文件引用的下游节点（转录、发送邮件附件等）都可以使用 `$nodeLabel.file`。
