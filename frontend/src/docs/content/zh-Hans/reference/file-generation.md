# 文件生成

Skill 可以在执行过程中生成文件（PDF、DOCX、CSV、图片等）。生成的文件会被自动存储，并可供下载。

## 工作原理

当 Skill 运行时，Heym 会在 Skill 的执行环境中创建一个 `_output_files/` 目录。该路径可通过 `_OUTPUT_DIR` 环境变量获取。

写入此目录的任何文件（以 `_` 开头的文件除外）都会在 Skill 完成后被捕获，存储到文件系统中，并自动生成下载链接。

## 在 Skill 中写入文件

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generate a CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF 生成

可使用 `reportlab` 库进行 PDF 生成：

```python
import os
import json
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

pdf_path = os.path.join(output_dir, "invoice.pdf")
c = canvas.Canvas(pdf_path, pagesize=A4)
c.drawString(100, 750, f"Invoice for {args.get('customer', 'Unknown')}")
c.drawString(100, 730, f"Amount: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Invoice generated"}))
```

## DOCX 生成

可使用 `python-docx` 库：

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Report"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Document generated"}))
```

## 多个文件

Skill 可以在单次执行中生成多个文件：

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generate CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Generate text summary
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## 文件大小限制

生成的文件受 `FILE_MAX_SIZE_MB` 配置约束（默认值：99 MB）。超过此限制的文件会被静默跳过。

## 下载链接

执行完成后，每个生成的文件都会获得一个唯一的下载 URL。这些 URL 会包含在 Skill 输出的 `_generated_files` 键下：

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.csv",
      "mime_type": "text/csv",
      "size_bytes": 1234,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

`id` 字段是文件的 UUID。可将其与 [Drive 节点](../nodes/drive-node.md) 配合使用，在 Workflow 中管理该文件——删除文件、添加密码、设置过期时间或限制下载次数：

```
$agentLabel._generated_files[0].id
```

这些链接也可以直接分享，或通过 [Drive](../reference/drive.md) 标签页进行管理。

根据部署配置的不同，`download_url` 可以是以下两种形式之一：
- 绝对 URL（当为后端容器配置了 `FRONTEND_URL` 时）。
- 相对路径（例如 `/api/files/dl/abc123...`），在浏览器 UI 中仍然可用。

## 支持的 MIME 类型

文件类型会根据文件扩展名自动检测。常见类型：

| 扩展名 | MIME 类型 |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## 相关内容

- [Drive 节点](../nodes/drive-node.md) - 对生成的文件进行编程式删除、密码设置、TTL、下载限制以及团队分享/取消分享
- [Drive](../reference/drive.md) - 仪表盘 Drive 标签页及分享链接行为
- [Drive 标签页](../tabs/drive-tab.md) - 在 UI 中浏览和管理文件
