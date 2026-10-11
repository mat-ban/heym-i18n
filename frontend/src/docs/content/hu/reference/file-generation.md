# Fájlgenerálás

A skillek végrehajtás közben fájlokat (PDF, DOCX, CSV, képek stb.) generálhatnak. A generált fájlok automatikusan tárolásra kerülnek, és letöltésre elérhetővé válnak.

## Hogyan működik

Amikor egy skill fut, a Heym létrehoz egy `_output_files/` könyvtárat a skill végrehajtási környezetében. Az útvonal a `_OUTPUT_DIR` környezeti változóként érhető el.

Minden ebbe a könyvtárba írt fájl (kivéve az `_` karakterrel kezdődő fájlokat) a skill befejezése után rögzítésre kerül, a fájlrendszerben tárolódik, és automatikusan létrejön egy letöltési hivatkozás.

## Fájlok írása egy skillben

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

## PDF-generálás

A `reportlab` könyvtár elérhető PDF-generáláshoz:

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

## DOCX-generálás

A `python-docx` könyvtár elérhető:

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

## Több fájl

A skillek egyetlen végrehajtás során több fájlt is generálhatnak:

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

## Fájlméret-korlátok

A generált fájlokra a `FILE_MAX_SIZE_MB` konfiguráció vonatkozik (alapértelmezett: 99 MB). Az ezt a korlátot meghaladó fájlok csendben kihagyásra kerülnek.

## Letöltési hivatkozások

A végrehajtás után minden generált fájl egyedi letöltési URL-t kap. Ezek az URL-ek a skill kimenetében a `_generated_files` kulcs alatt találhatók:

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

Az `id` mező a fájl UUID-ja. Használja a [Drive csomóponttal](../nodes/drive-node.md) együtt a fájl workflow-n belüli kezeléséhez — törlés, jelszó hozzáadása, lejárati idő beállítása vagy a letöltések korlátozása:

```
$agentLabel._generated_files[0].id
```

Ezek a hivatkozások közvetlenül is megoszthatók, vagy a [Drive](../reference/drive.md) fülön keresztül kezelhetők.

A telepítési konfigurációtól függően a `download_url` a következő lehet:
- Abszolút URL (amikor a `FRONTEND_URL` be van állítva a backend konténerhez).
- Relatív útvonal (például `/api/files/dl/abc123...`), amely a böngésző felületén továbbra is működik.

## Támogatott MIME-típusok

A fájltípusok automatikusan felismerésre kerülnek a fájlkiterjesztés alapján. Gyakori típusok:

| Kiterjesztés | MIME-típus |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Kapcsolódó

- [Drive csomópont](../nodes/drive-node.md) – Programozott törlés, jelszó, TTL, letöltési korlátok, valamint csapatmegosztás/megosztás visszavonása a generált fájlokon
- [Drive](../reference/drive.md) – Dashboard Drive fül és a megosztási hivatkozás viselkedése
- [Drive fül](../tabs/drive-tab.md) – Fájlok böngészése és kezelése a felületen
