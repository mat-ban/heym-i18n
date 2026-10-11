# Failide genereerimine

Oskused saavad käivitamise ajal genereerida faile (PDF, DOCX, CSV, pildid jne). Genereeritud failid salvestatakse automaatselt ja tehakse allalaadimiseks kättesaadavaks.

## Kuidas see töötab

Kui oskus käivitub, loob Heym oskuse käivituskeskkonnas kataloogi `_output_files/`. Selle tee on kättesaadav keskkonnamuutujana `_OUTPUT_DIR`.

Iga sellesse kataloogi kirjutatud fail (välja arvatud failid, mis algavad `_`-ga) võetakse pärast oskuse lõpetamist üles, salvestatakse failisüsteemi ja allalaadimislink genereeritakse automaatselt.

## Failide kirjutamine oskuses

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

## PDF-i genereerimine

PDF-i genereerimiseks on saadaval teek `reportlab`:

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

## DOCX-i genereerimine

Saadaval on teek `python-docx`:

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

## Mitu faili

Oskused saavad ühe käivitamise jooksul genereerida mitu faili:

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

## Faili suuruse piirangud

Genereeritud failide suhtes kehtib konfiguratsioon `FILE_MAX_SIZE_MB` (vaikeväärtus: 99 MB). Seda piirangut ületavad failid jäetakse vaikselt vahele.

## Allalaadimislingid

Pärast käivitamist saab iga genereeritud fail unikaalse allalaadimis-URL-i. Need URL-id lisatakse oskuse väljundisse võtme `_generated_files` alla:

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

Väli `id` on faili UUID. Kasutage seda koos [Drive node](../nodes/drive-node.md)-iga, et faili workflow'st hallata — kustutada, lisada parool, määrata aegumine või piirata allalaadimisi:

```
$agentLabel._generated_files[0].id
```

Neid linke saab ka otse jagada või hallata vahekaardi [Drive](../reference/drive.md) kaudu.

Sõltuvalt juurutuse konfiguratsioonist võib `download_url` olla kas:
- Absoluutne URL (kui taustarakenduse konteineri jaoks on konfigureeritud `FRONTEND_URL`).
- Suhteline tee (näiteks `/api/files/dl/abc123...`), mis töötab endiselt brauseri kasutajaliideses.

## Toetatud MIME-tüübid

Failitüübid tuvastatakse automaatselt faililaiendi järgi. Levinumad tüübid:

| Laiend | MIME-tüüp |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Seotud

- [Drive Node](../nodes/drive-node.md) – Programmiline kustutamine, parool, TTL, allalaadimispiirangud ning meeskonnaga jagamine/jagamise lõpetamine genereeritud failide puhul
- [Drive](../reference/drive.md) – Töölaua Drive'i vahekaart ja jagamislingi käitumine
- [Drive Tab](../tabs/drive-tab.md) – Failide sirvimine ja haldamine kasutajaliideses
