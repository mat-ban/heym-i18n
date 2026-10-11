# Tạo tệp

Skill có thể tạo tệp (PDF, DOCX, CSV, hình ảnh, v.v.) trong quá trình thực thi. Các tệp được tạo sẽ tự động được lưu trữ và sẵn sàng để tải xuống.

## Cách hoạt động

Khi một skill chạy, Heym tạo một thư mục `_output_files/` trong môi trường thực thi của skill. Đường dẫn này có sẵn dưới dạng biến môi trường `_OUTPUT_DIR`.

Bất kỳ tệp nào được ghi vào thư mục này (ngoại trừ các tệp bắt đầu bằng `_`) đều được thu thập sau khi skill hoàn tất, lưu trữ trong hệ thống tệp và liên kết tải xuống được tạo tự động.

## Ghi tệp trong một Skill

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Tạo một tệp CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## Tạo PDF

Thư viện `reportlab` có sẵn để tạo PDF:

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

## Tạo DOCX

Thư viện `python-docx` có sẵn:

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

## Nhiều tệp

Skill có thể tạo nhiều tệp trong một lần thực thi:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Tạo CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Tạo tóm tắt văn bản
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## Giới hạn kích thước tệp

Các tệp được tạo phải tuân theo cấu hình `FILE_MAX_SIZE_MB` (mặc định: 99 MB). Các tệp vượt quá giới hạn này sẽ bị bỏ qua một cách âm thầm.

## Liên kết tải xuống

Sau khi thực thi, mỗi tệp được tạo sẽ có một URL tải xuống duy nhất. Các URL này được bao gồm trong đầu ra của skill dưới khóa `_generated_files`:

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

Trường `id` là UUID của tệp. Sử dụng nó với [Node Drive](../nodes/drive-node.md) để quản lý tệp từ bên trong workflow — xóa nó, thêm mật khẩu, đặt thời hạn hoặc giới hạn lượt tải xuống:

```
$agentLabel._generated_files[0].id
```

Các liên kết này cũng có thể được chia sẻ trực tiếp hoặc quản lý thông qua tab [Drive](../reference/drive.md).

Tùy thuộc vào cấu hình triển khai, `download_url` có thể là:
- Một URL tuyệt đối (khi `FRONTEND_URL` được cấu hình cho container backend).
- Một đường dẫn tương đối (ví dụ `/api/files/dl/abc123...`), vẫn hoạt động trong giao diện trình duyệt.

## Các loại MIME được hỗ trợ

Loại tệp được tự động phát hiện từ phần mở rộng tệp. Các loại phổ biến:

| Phần mở rộng | Loại MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Liên quan

- [Node Drive](../nodes/drive-node.md) - Xóa theo lập trình, mật khẩu, TTL, giới hạn tải xuống và chia sẻ/hủy chia sẻ nhóm trên các tệp được tạo
- [Drive](../reference/drive.md) - Tab Drive trên dashboard và hành vi của liên kết chia sẻ
- [Tab Drive](../tabs/drive-tab.md) - Duyệt và quản lý tệp trong giao diện người dùng
