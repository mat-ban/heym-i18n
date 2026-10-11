# Failu ģenerēšana

Prasmes izpildes laikā var ģenerēt failus (PDF, DOCX, CSV, attēlus u.c.). Ģenerētie faili tiek automātiski saglabāti un padarīti pieejami lejupielādei.

## Kā tas darbojas

Kad prasme tiek izpildīta, Heym izveido `_output_files/` direktoriju prasmes izpildes vidē. Ceļš ir pieejams kā `_OUTPUT_DIR` vides mainīgais.

Jebkurš fails, kas tiek ierakstīts šajā direktorijā (izņemot failus, kas sākas ar `_`), tiek uztverts pēc prasmes pabeigšanas, saglabāts failu sistēmā, un lejupielādes saite tiek ģenerēta automātiski.

## Failu rakstīšana prasmē

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

## PDF ģenerēšana

PDF ģenerēšanai ir pieejama `reportlab` bibliotēka:

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

## DOCX ģenerēšana

Ir pieejama `python-docx` bibliotēka:

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

## Vairāki faili

Prasmes vienā izpildē var ģenerēt vairākus failus:

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

## Failu izmēra ierobežojumi

Ģenerētajiem failiem tiek piemērota `FILE_MAX_SIZE_MB` konfigurācija (noklusējums: 99 MB). Faili, kas pārsniedz šo ierobežojumu, tiek klusi izlaisti.

## Lejupielādes saites

Pēc izpildes katrs ģenerētais fails iegūst unikālu lejupielādes URL. Šie URL tiek iekļauti prasmes izvadē zem `_generated_files` atslēgas:

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

Lauks `id` ir faila UUID. Izmantojiet to kopā ar [Drive mezglu](../nodes/drive-node.md), lai pārvaldītu failu no workflow ietvaros — dzēstu to, pievienotu paroli, iestatītu derīguma termiņu vai ierobežotu lejupielādes:

```
$agentLabel._generated_files[0].id
```

Šīs saites var arī tieši kopīgot vai pārvaldīt caur cilni [Drive](../reference/drive.md).

Atkarībā no izvietošanas konfigurācijas `download_url` var būt:
- Absolūts URL (kad `FRONTEND_URL` ir konfigurēts backend konteineram).
- Relatīvs ceļš (piemēram, `/api/files/dl/abc123...`), kas joprojām darbojas pārlūka UI.

## Atbalstītie MIME tipi

Failu tipi tiek automātiski noteikti pēc faila paplašinājuma. Biežāk sastopamie tipi:

| Paplašinājums | MIME tips |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Saistītais

- [Drive mezgls](../nodes/drive-node.md) - Programmatiska dzēšana, parole, TTL, lejupielādes ierobežojumi un komandas kopīgošana/atkopīgošana ģenerētajiem failiem
- [Drive](../reference/drive.md) - Informācijas paneļa Drive cilne un kopīgošanas saišu darbība
- [Drive cilne](../tabs/drive-tab.md) - Pārlūkojiet un pārvaldiet failus UI
