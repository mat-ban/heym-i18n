# 文件分析

文件分析允许 Chat、[Agent 节点](../nodes/agent-node.md) 和 [Code 节点](../nodes/code-node.md) 在隔离的 Python 沙箱中打开并分析来自 [Drive](./drive.md) 的大型文件。PDF、电子表格、CSV、DOCX 和 JSON 文件会先经过检查，然后选择性地读取，因此一份 200 页的合同或包含一百万行数据的工作簿永远无需完整塞入模型的上下文。

## 工作原理

每次调用都在没有网络访问权限的全新容器中运行。所需文件以只读方式复制进来，代码执行完毕后容器即被销毁。同一个会话的多次调用之间保留一个小型工作文件夹，使得后续步骤可以基于前一步骤保存的结果继续执行。

| 路径 | 内容 |
|------|--------|
| `/input` | 本次会话的 Drive 文件，只读 |
| `/work` | 在会话期间持久保留的工作空间，例如 `/work/sales.pkl` |
| `/work/out` | 写入此处的物理文件在调用后保存到 Drive，并作为链接返回 |

沙箱预装了 pandas、openpyxl、xlrd、pdfplumber、pypdf、python-docx 和 langdetect，以及 [转换器节点](../nodes/converter-node.md) 所使用的 Tesseract OCR。

## 工具

模型与三个工具配合使用，并在 Chat 中提供第四个工具：

| 工具 | 功能 |
|------|----------|
| `list_files` | 列出您可以打开的 Drive 文件：名称、类型、大小、日期 |
| `inspect_file` | 返回文件的类型、元数据和结构，并带有简短示例 |
| `run_python` | 在指定文件上运行 Python 并返回控制台输出 |
| `clear_workspace` | 仅限 Chat：删除对话的工作文件夹 |

`inspect_file` 仅读取摘要所需的内容：

| 类型 | 摘要内容 |
|-----|-----------------|
| PDF | 页数、标题与作者、文本是否可提取、语言、页面大小、首页文本与表格。扫描的 PDF 通过 OCR 读取（每次调用最多 5 页） |
| XLSX / XLS | 包含行数和列数的工作表、真实表头行、类型、就绪的 pandas `read_hint`、命名区域、前几行 |
| CSV / TSV | 编码、分隔符、行数、带类型的列、前几行 |
| DOCX | 标题大纲、表格、字数与字符数、作者与日期 |
| JSON | 根类型、键、数组长度、嵌套深度、示例记录 |

在 `run_python` 内部，使用 `heym_files` 模块打开文件：

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## 在 Chat 中

在 [Chat 标签页](../tabs/chat-tab.md)、Heym Work Chat 或通过 MCP 工具 `heym_chat` 附加 PDF、电子表格、DOCX、CSV 或 JSON 文件、图片（PNG、JPG、GIF、WebP）或纯文本文件。一条消息最多可携带 10 个文件。每个文件都存储在您的 Drive 中；消息中仅包含其名称和 ID。Chat 会检查该文件，读取问题所需的部分，并以表格或摘要回答。

## 在工作流中

运行仅打开属于自己的文件：通过 [文件上传 Trigger](../nodes/file-upload-trigger-node.md) 上传的文件、节点写入 Drive 的文件，以及 [Drive 节点](../nodes/drive-node.md) 在同一运行中通过 **Get** 步骤获取的文件。

- **Agent 节点**：当 agent 的输入或消息包含运行的文件时，它会自动获得针对这些文件的上述工具。
- **Code 节点**：将 **Files** 设置为表达式，例如 `$Upload.file.id`。文件将被挂载并在 `params.files` 中列出。

## 限制

| 限制 | 限制值 |
|-----------|------|
| 每次调用内存 | 2 GB |
| 每次调用时间 | 120 秒 |
| 每个会话工作文件夹 | 2 GB |
| 每次调用输出文件 | 20 个，每个最大 100 MB |
| 返回给模型的打印文本 | 20,000 个字符 |
| 每次调用文件数 | 20 个 |

## 安全性

- 沙箱无网络连接，无法访问 Heym 的设置或机密，并且以非特权用户身份运行。
- 文件仅在沙箱内部进行解析。
- 在 Chat 中，访问权限遵循 Drive：您可以打开自己拥有的文件以及与团队共享的文件。
- 在 Chat 中打开文件会记录在审计日志中。
- 文件内容严格视为纯数据；文件内部编写的指令不会被执行。

## 环境要求

文件分析需要在 Heym 实例上配置沙箱后端（Docker 或 [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)）。

## 相关

- [Drive](./drive.md)
- [Code 节点](../nodes/code-node.md)
- [Agent 节点](../nodes/agent-node.md)
- [Chat 标签页](../tabs/chat-tab.md)
