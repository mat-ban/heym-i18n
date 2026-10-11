# Pembuatan File

Skill dapat menghasilkan file (PDF, DOCX, CSV, gambar, dan lain-lain) selama eksekusi. File yang dihasilkan secara otomatis disimpan dan tersedia untuk diunduh.

## Cara Kerjanya

Saat sebuah skill dijalankan, Heym membuat direktori `_output_files/` di lingkungan eksekusi skill tersebut. Path tersebut tersedia sebagai variabel lingkungan `_OUTPUT_DIR`.

Setiap file yang ditulis ke direktori ini (kecuali file yang diawali dengan `_`) akan ditangkap setelah skill selesai, disimpan di sistem file, dan tautan unduhan akan dibuat secara otomatis.

## Menulis File dalam Skill

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

## Pembuatan PDF

Library `reportlab` tersedia untuk pembuatan PDF:

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

## Pembuatan DOCX

Library `python-docx` tersedia:

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

## Beberapa File

Skill dapat menghasilkan beberapa file dalam satu eksekusi:

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

## Batas Ukuran File

File yang dihasilkan tunduk pada konfigurasi `FILE_MAX_SIZE_MB` (default: 99 MB). File yang melebihi batas ini akan dilewati secara diam-diam.

## Tautan Unduhan

Setelah eksekusi, setiap file yang dihasilkan mendapatkan URL unduhan yang unik. URL ini disertakan dalam output skill di bawah key `_generated_files`:

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

Field `id` adalah UUID file. Gunakan field ini dengan [Node Drive](../nodes/drive-node.md) untuk mengelola file dari dalam workflow — menghapusnya, menambahkan password, menetapkan masa berlaku, atau membatasi unduhan:

```
$agentLabel._generated_files[0].id
```

Tautan ini juga dapat dibagikan secara langsung atau dikelola melalui tab [Drive](../reference/drive.md).

Bergantung pada konfigurasi deployment, `download_url` dapat berupa:
- URL absolut (ketika `FRONTEND_URL` dikonfigurasi untuk container backend).
- Path relatif (misalnya `/api/files/dl/abc123...`), yang tetap berfungsi di UI browser.

## Tipe MIME yang Didukung

Tipe file dideteksi secara otomatis dari ekstensi file. Tipe umum:

| Ekstensi | Tipe MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Terkait

- [Node Drive](../nodes/drive-node.md) - Penghapusan programatik, password, TTL, batas unduhan, dan berbagi/berhenti berbagi tim pada file yang dihasilkan
- [Drive](../reference/drive.md) - Tab Drive dashboard dan perilaku tautan berbagi
- [Tab Drive](../tabs/drive-tab.md) - Menjelajahi dan mengelola file di UI
