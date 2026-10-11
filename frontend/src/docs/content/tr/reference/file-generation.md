# Dosya Oluşturma

Skill'ler yürütme sırasında dosyalar (PDF, DOCX, CSV, görseller vb.) oluşturabilir. Oluşturulan dosyalar otomatik olarak saklanır ve indirilmeye hazır hale getirilir.

## Nasıl Çalışır

Bir skill çalıştığında, Heym skill'in yürütme ortamında bir `_output_files/` dizini oluşturur. Bu dizinin yolu `_OUTPUT_DIR` ortam değişkeni olarak kullanılabilir.

Bu dizine yazılan herhangi bir dosya (`_` ile başlayan dosyalar hariç), skill tamamlandıktan sonra yakalanır, dosya sisteminde saklanır ve otomatik olarak bir indirme bağlantısı oluşturulur.

## Bir Skill İçinde Dosya Yazma

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

## PDF Oluşturma

PDF oluşturma için `reportlab` kütüphanesi kullanılabilir:

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

## DOCX Oluşturma

`python-docx` kütüphanesi kullanılabilir:

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

## Birden Fazla Dosya

Skill'ler tek bir yürütmede birden fazla dosya oluşturabilir:

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

## Dosya Boyutu Sınırları

Oluşturulan dosyalar `FILE_MAX_SIZE_MB` yapılandırmasına tabidir (varsayılan: 99 MB). Bu sınırı aşan dosyalar sessizce atlanır.

## İndirme Bağlantıları

Yürütmeden sonra, oluşturulan her dosya benzersiz bir indirme URL'si alır. Bu URL'ler skill'in çıktısında `_generated_files` anahtarı altında yer alır:

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

`id` alanı dosyanın UUID'sidir. Workflow içinden dosyayı yönetmek için [Drive düğümü](../nodes/drive-node.md) ile birlikte kullanın — dosyayı silin, parola ekleyin, son kullanma tarihi belirleyin veya indirmeleri sınırlayın:

```
$agentLabel._generated_files[0].id
```

Bu bağlantılar doğrudan paylaşılabilir veya [Drive](../reference/drive.md) sekmesi üzerinden yönetilebilir.

Dağıtım yapılandırmasına bağlı olarak `download_url` şunlardan biri olabilir:
- Mutlak bir URL (backend container için `FRONTEND_URL` yapılandırıldığında).
- Göreli bir yol (örneğin `/api/files/dl/abc123...`), bu yol tarayıcı arayüzünde yine de çalışır.

## Desteklenen MIME Türleri

Dosya türleri dosya uzantısından otomatik olarak algılanır. Yaygın türler:

| Uzantı | MIME Türü |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## İlgili Konular

- [Drive Düğümü](../nodes/drive-node.md) - Oluşturulan dosyalar üzerinde programatik silme, parola, TTL, indirme sınırları ve ekip paylaşımı/paylaşım kaldırma
- [Drive](../reference/drive.md) - Dashboard Drive sekmesi ve paylaşım bağlantısı davranışı
- [Drive Sekmesi](../tabs/drive-tab.md) - Arayüzde dosyalara göz atma ve yönetme
