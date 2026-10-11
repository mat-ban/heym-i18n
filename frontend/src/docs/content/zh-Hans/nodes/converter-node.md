# 转换器

**Converter** 节点无需编写代码即可在格式之间转换数据和文件。它与技术无关，因此可以随时间推移添加更多格式。它可以在 CSV、JSON 和 XML 数据之间进行双向转换，运行 Tesseract OCR 从图像和 PDF 中提取文本，并以另一种格式重写已存储的文件。

## 概览

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.result`（`csvToJson` / `xmlToJson` 为解析后的数据，`jsonToCsv` / `jsonToXml` 为文本，`imageToText` / `pdfToText` 为提取的文本，`fileConvert` 为新文件元数据） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `conversion` | string | `csvToJson`（CSV 文本 → 行对象数组）、`jsonToCsv`（对象/行数组 → CSV 文本）、`xmlToJson`（XML 文本 → 对象）、`jsonToXml`（对象 → XML 文本）、`imageToText`（对图像进行 OCR）、`pdfToText`（对每个选定的 PDF 页面进行 OCR）或 `fileConvert`（以另一种格式重写已存储的文件） |
| `source` | expression | 要转换的数据。留空则使用节点的第一个输入 |
| `delimiter` | string | 单字符字段分隔符（默认 `,`） |
| `hasHeader` | boolean | 仅 `csvToJson` — 将第一行视为表头（默认 `true`） |
| `trimValues` | boolean | 仅 `csvToJson` — 去除表头名称和单元格值周围的空白（默认 `true`） |
| `includeHeader` | boolean | 仅 `jsonToCsv` — 写入表头行（默认 `true`） |
| `converterColumns` | string | 仅 `jsonToCsv` — 可选的逗号分隔列顺序 |
| `converterFileId` | expression | 文件转换 — 要读取的 Heym Drive 文件，例如 `$Upload.file.id` |
| `converterTargetFormat` | string | 仅 `fileConvert` — 输出格式（`pdf`、`docx`、`html`、`md`、`txt`、`csv`、`epub`、`jpg`、`png`、`bmp`、`webp`） |
| `ocrLanguage` | string | 仅 OCR — `auto`（默认）、Tesseract 代码（如 `tur`）或 `custom` |
| `ocrLanguageCustom` | string | 仅 OCR — 当 `ocrLanguage` 为 `custom` 时使用的语言代码，例如 `eng+tur` |
| `ocrEncoding` | string | 仅 OCR — 文本归一化后的字符集（默认 `utf-8`） |
| `ocrNormalizeUnicode` | boolean | 仅 OCR — 应用 NFC 归一化（默认 `true`） |
| `ocrPsm` | string | 仅 OCR — Tesseract 页面分割模式（默认 `3`） |
| `ocrDpi` | number | 仅 `pdfToText` — 页面栅格化 DPI（默认 `300`） |
| `ocrPageRange` | expression | 仅 `pdfToText` — `3` 或 `2-5`。留空表示每一页 |

## 行为

- **`csvToJson`** 解析源 CSV 文本。当 `hasHeader: true` 时，每一行变为一个以表头值为键的对象；当 `hasHeader: false` 时，每一行变为一个单元格值数组。带引号的字段、内嵌分隔符和内嵌换行符按 RFC 4180 处理。开头的 UTF-8 BOM（在 Excel 导出中常见）会被去除，重复的表头名称会被唯一化，而不会覆盖真实列（`a, a, a_2` → `a`、`a_3`、`a_2`）。将 `delimiter` 设置为 `\t` 以解析制表符分隔的值。
- **`trimValues`**（默认 `true`）去除表头名称和单元格值周围的空白，**包括带引号字段内部的空白**（`" padded "` → `padded`）。RFC 4180 将带引号的空白视为数据，因此设置 `trimValues: false` 可精确保留它。
- **`jsonToCsv`** 从对象（或数组）数组构建 CSV 文本。提供 `converterColumns` 时，列顺序取自它，否则从第一个对象的键推断。包含分隔符、引号或换行符的值会自动加引号。
- **`xmlToJson`** 将 XML 解析为对象。属性使用 `@` 前缀，与属性混合的文本使用 `#text`；重复的兄弟元素变为数组。XML 实体扩展被禁用。
- **`jsonToXml`** 将对象序列化为 XML 文档。该对象必须恰好有一个顶层键，它将成为 XML 根元素。使用与 `xmlToJson` 相同的 `@attribute` 和 `#text` 约定，以在子元素旁生成属性和文本。
- **`imageToText`** 对单张图像（PNG、JPEG、TIFF、WebP、BMP）运行 Tesseract。
- **`pdfToText`** 以 `ocrDpi` 栅格化每个选定的页面并识别它。每一页都会经过 OCR，因此即使数字 PDF 拥有完好的文本层，也仍会从像素重新读取。这使扫描文档和数字文档的行为保持一致，代价是速度，因此对长文件应缩小 `ocrPageRange`。
- **`fileConvert`** 以另一种格式重写源文件，并将结果存储为**新的** Drive 文件。原始文件永远不会被修改。文档通过 pandoc 处理，图像通过 Pillow 处理，JSON 到 CSV 通过 Python csv writer 处理。图像不能变为文档，文档也不能变为图像；要从图像中读取文本，请使用 `imageToText`。

## 获取文件输入

文件转换从 Heym Drive 读取，而不是从路径或 URL 读取，因此文件必须先被存储。三种常见的链路：

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — 将 `converterFileId` 指向 `$Upload.file.id`。
- **[Drive](./drive-node.md)（`downloadUrl`）→ Converter** — 将远程文件获取到 Drive，然后传入 `$Download.id`。
- **[Agent](./agent-node.md) → Converter** — 写入文件的技能将其暴露为 `$reportAgent._generated_files[0].id`。

`converterFileId` 也接受整个文件对象（`$Upload.file`）或 Heym 下载 URL；文件 id 会从两者中提取出来。该文件必须是你拥有的文件，或队友与你共享的文件。
## 语言

`auto`（默认值）会先运行 Tesseract 的方向与文字系统检测，然后为检测到的文字系统选择已安装的最佳模型。诸如 `Latin` 或 `Cyrillic` 之类的文字系统模型可读取以该文字系统书写的所有语言，这正是 auto 无需被告知哪份是土耳其语、哪份是英语，就能同时处理两者的原因。

当你明确知道语言时，指定语言仍然更为准确。使用单个代码（`tur`），或用 `+` 连接多个代码（`eng+tur`）以处理混合文档——语言越多，识别越慢且噪声略增，因此请保持列表简短。代码仅在后台安装了匹配的语言数据时才有效；当你选择了一个缺失的语言时，节点会列出可用的语言。

每个 Heym 镜像都附带 `osd`、英语、土耳其语、德语、法语、西班牙语、意大利语、葡萄牙语、荷兰语、俄语、阿拉伯语、简体中文、日语、韩语，以及 Latin、Cyrillic、Arabic、HanS、Japanese 和 Hangul 文字系统模型。

## 编码

识别出的文本为 UTF-8，并保留 Tesseract 生成的每一个字符。`ocrNormalizeUnicode`（默认开启）会应用 NFC 规范化，因此一个写作 `s` 加上组合变音符号的字母会变成单个 `ş`——建议保持开启，因为这两种形式在比较或数据库查找中并不相等。

`ocrEncoding` 仅在下游无法存储完整 Unicode 范围时才有意义。选择 `cp1254` 或 `iso-8859-9` 可在保证结果适配该字符集的同时保持土耳其语文本完整；`latin-1` 和 `ascii` 范围更窄，会将无法表示的字符替换为 `?`。除非目标系统强制要求，否则请保持为 `utf-8`。

## 输出

`csvToJson`、`jsonToCsv`、`xmlToJson` 和 `jsonToXml` 返回 `$label.result` 和 `$label.conversion`。OCR 转换还会额外添加：

| 字段 | 描述 |
|-------|-------------|
| `$label.result` | 完整提取的文本，各页之间以空行连接 |
| `$label.language` | 实际运行的模型（可用于查看 `auto` 选择了什么） |
| `$label.encoding` | 文本被规范化到的字符集 |
| `$label.page_count` | 已识别的页数 |
| `$label.pages` | 用于逐页处理的 `{ page, text }` 数组 |
| `$label.file` | 源文件的 `{ id, filename, mime_type, size_bytes }` |

`fileConvert` 则返回新文件：

| 字段 | 描述 |
|-------|-------------|
| `$label.id` | 新存储文件的 UUID |
| `$label.filename` | 转换后的文件名，保留基础名称并替换扩展名 |
| `$label.mime_type` | 新文件的 MIME 类型 |
| `$label.size_bytes` | 新文件的大小 |
| `$label.download_url` | 新文件的 Drive 下载 URL |
| `$label.source_file` | 被转换文件的元数据 |

## 示例

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

对于输入 `name,age\nAda,36`，下游节点可通过 `$toRows.result`（`[{ "name": "Ada", "age": "36" }]`）访问解析后的行。

将 XML 转换为 JSON：

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

对于 `<person id="1"><name>Ada</name></person>`，`$xmlToObject.result` 为 `{ "person": { "@id": "1", "name": "Ada" } }`。要创建 XML，请将该对象传递给第二个 Converter 节点，并设置 `conversion: "jsonToXml"`。

读取通过文件上传 Trigger 上传的扫描发票：

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

随后，下游的 [Agent](./agent-node.md) 或 [LLM](./llm-node.md) 节点可以从 `$readInvoice.result` 中提取结构化字段。

将 Agent 的 markdown 报告转换为 PDF：

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

下游节点可读取 `$convertDoc.download_url` 以分享该 PDF，或读取 `$convertDoc.id` 以在 [Drive](./drive-node.md) 中继续使用它。

## 要求

OCR 会调用 `tesseract` 和 poppler 的 `pdftoppm`，文档转换则使用 pandoc。这三者都随每一种运行 Heym 的方式一同提供，包括 `run.sh`、docker-compose 和单一发布镜像，因此无需任何配置。页数限制、超时以及最大 DPI 均为固定的平台值，而非可配置项。

## 相关

- [Set](./set-node.md) – 转换和映射单个字段
- [JSON output mapper](./json-output-mapper-node.md) – 构建 JSON 响应对象
- [File upload trigger](./file-upload-trigger-node.md) – 将文件接收到 Heym Drive
- [Drive](./drive-node.md) – 存储、获取和分享文件
- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Expression DSL](../reference/expression-dsl.md) – 函数与语法
