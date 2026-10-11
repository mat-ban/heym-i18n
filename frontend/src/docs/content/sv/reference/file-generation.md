# Filgenerering

Skills kan generera filer (PDF, DOCX, CSV, bilder etc.) under körning. Genererade filer lagras automatiskt och görs tillgängliga för nedladdning.

## Hur det fungerar

När en skill körs skapar Heym en katalog `_output_files/` i skillens körningsmiljö. Sökvägen är tillgänglig via miljövariabeln `_OUTPUT_DIR`.

Alla filer som skrivs till denna katalog (förutom filer som börjar med `_`) fångas upp efter att skillen har slutförts, lagras i filsystemet och en nedladdningslänk genereras automatiskt.

## Skriva filer i en skill

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

## PDF-generering

Biblioteket `reportlab` är tillgängligt för PDF-generering:

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

## DOCX-generering

Biblioteket `python-docx` är tillgängligt:

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

## Flera filer

Skills kan generera flera filer i en och samma körning:

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

## Storleksgränser för filer

Genererade filer omfattas av konfigurationen `FILE_MAX_SIZE_MB` (standard: 99 MB). Filer som överskrider denna gräns hoppas tyst över.

## Nedladdningslänkar

Efter körning får varje genererad fil en unik nedladdnings-URL. Dessa URL:er inkluderas i skillens utdata under nyckeln `_generated_files`:

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

Fältet `id` är filens UUID. Det kan användas tillsammans med [Drive-noden](../nodes/drive-node.md) för att hantera filen inifrån workflowet — ta bort den, lägga till ett lösenord, ange en utgångstid eller begränsa antalet nedladdningar:

```
$agentLabel._generated_files[0].id
```

Dessa länkar kan även delas direkt eller hanteras via fliken [Drive](../reference/drive.md).

Beroende på distributionskonfiguration kan `download_url` vara antingen:
- En absolut URL (när `FRONTEND_URL` är konfigurerad för backend-containern).
- En relativ sökväg (till exempel `/api/files/dl/abc123...`), vilket fortfarande fungerar i webbläsargränssnittet.

## MIME-typer som stöds

Filtyper identifieras automatiskt utifrån filändelsen. Vanliga typer:

| Ändelse | MIME-typ |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Relaterat

- [Drive-nod](../nodes/drive-node.md) – Programmatisk borttagning, lösenord, TTL, nedladdningsgränser samt delning/avdelning med team för genererade filer
- [Drive](../reference/drive.md) – Fliken Drive i instrumentpanelen och beteende för delningslänkar
- [Fliken Drive](../tabs/drive-tab.md) – Bläddra bland och hantera filer i gränssnittet
