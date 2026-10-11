# Bestandsgeneratie

Skills kunnen tijdens de uitvoering bestanden genereren (PDF, DOCX, CSV, afbeeldingen, enz.). Gegenereerde bestanden worden automatisch opgeslagen en beschikbaar gesteld voor download.

## Hoe het werkt

Wanneer een skill wordt uitgevoerd, maakt Heym een map `_output_files/` aan in de uitvoeringsomgeving van de skill. Het pad is beschikbaar als de omgevingsvariabele `_OUTPUT_DIR`.

Elk bestand dat naar deze map wordt geschreven (met uitzondering van bestanden die beginnen met `_`) wordt vastgelegd nadat de skill is voltooid, opgeslagen in het bestandssysteem en er wordt automatisch een downloadlink gegenereerd.

## Bestanden schrijven in een skill

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

## PDF-generatie

De bibliotheek `reportlab` is beschikbaar voor PDF-generatie:

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

## DOCX-generatie

De bibliotheek `python-docx` is beschikbaar:

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

## Meerdere bestanden

Skills kunnen meerdere bestanden genereren tijdens één uitvoering:

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

## Limieten voor bestandsgrootte

Gegenereerde bestanden zijn onderhevig aan de configuratie `FILE_MAX_SIZE_MB` (standaard: 99 MB). Bestanden die deze limiet overschrijden worden stilzwijgend overgeslagen.

## Downloadlinks

Na uitvoering krijgt elk gegenereerd bestand een unieke download-URL. Deze URL's worden opgenomen in de uitvoer van de skill onder de sleutel `_generated_files`:

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

Het veld `id` is de UUID van het bestand. Gebruik het met de [Drive-node](../nodes/drive-node.md) om het bestand vanuit de workflow te beheren — verwijderen, een wachtwoord toevoegen, een vervaldatum instellen of downloads beperken:

```
$agentLabel._generated_files[0].id
```

Deze links kunnen ook rechtstreeks worden gedeeld of worden beheerd via het tabblad [Drive](../reference/drive.md).

Afhankelijk van de implementatieconfiguratie kan `download_url` het volgende zijn:
- Een absolute URL (wanneer `FRONTEND_URL` is geconfigureerd voor de backend-container).
- Een relatief pad (bijvoorbeeld `/api/files/dl/abc123...`), dat nog steeds werkt in de browser-UI.

## Ondersteunde MIME-typen

Bestandstypen worden automatisch gedetecteerd op basis van de bestandsextensie. Veelvoorkomende typen:

| Extensie | MIME-type |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Gerelateerd

- [Drive-node](../nodes/drive-node.md) - Programmatisch verwijderen, wachtwoord, TTL, downloadlimieten en team share/unshare op gegenereerde bestanden
- [Drive](../reference/drive.md) - Dashboard Drive-tabblad en gedrag van deellinks
- [Drive-tabblad](../tabs/drive-tab.md) - Bladeren door en beheren van bestanden in de UI
