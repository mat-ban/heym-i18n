# 檔案產生

Skill 可在執行期間產生檔案（PDF、DOCX、CSV、圖片等）。產生的檔案會自動儲存並可供下載。

## 運作方式

當 Skill 執行時，Heym 會在該 Skill 的執行環境中建立一個 `_output_files/` 目錄。該路徑可透過 `_OUTPUT_DIR` 環境變數取得。

任何寫入此目錄的檔案（開頭為 `_` 的檔案除外）都會在 Skill 完成後被擷取、儲存至檔案系統，並自動產生下載連結。

## 在 Skill 中寫入檔案

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# 產生 CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF 產生

`reportlab` 函式庫可用於產生 PDF：

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

## DOCX 產生

`python-docx` 函式庫可供使用：

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

## 多個檔案

Skill 可在單次執行中產生多個檔案：

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# 產生 CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# 產生文字摘要
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## 檔案大小限制

產生的檔案受 `FILE_MAX_SIZE_MB` 設定限制（預設值：99 MB）。超過此限制的檔案會被靜默略過。

## 下載連結

執行完成後，每個產生的檔案都會取得一個專屬的下載 URL。這些 URL 會包含在 Skill 的輸出中，位於 `_generated_files` 鍵之下：

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

`id` 欄位為檔案的 UUID。可搭配 [Drive 節點](../nodes/drive-node.md) 在 Workflow 內管理該檔案——刪除、新增密碼、設定到期時間或限制下載次數：

```
$agentLabel._generated_files[0].id
```

這些連結也可直接分享，或透過 [Drive](../reference/drive.md) 分頁進行管理。

視部署設定而定，`download_url` 可以是：
- 絕對 URL（當後端容器設定了 `FRONTEND_URL` 時）。
- 相對路徑（例如 `/api/files/dl/abc123...`），在瀏覽器 UI 中仍可正常運作。

## 支援的 MIME 類型

檔案類型會依副檔名自動偵測。常見類型如下：

| 副檔名 | MIME 類型 |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## 相關內容

- [Drive 節點](../nodes/drive-node.md) - 以程式化方式對產生的檔案進行刪除、密碼、TTL、下載限制，以及團隊分享/取消分享
- [Drive](../reference/drive.md) - 儀表板 Drive 分頁與分享連結行為
- [Drive 分頁](../tabs/drive-tab.md) - 在 UI 中瀏覽與管理檔案
