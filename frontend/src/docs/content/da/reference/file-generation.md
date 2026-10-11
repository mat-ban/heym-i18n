# Filgenerering

Skills kan generere filer (PDF, DOCX, CSV, billeder osv.) under kørsel. Genererede filer gemmes automatisk og gøres tilgængelige for download.

## Sådan fungerer det

Når en skill kører, opretter Heym en `_output_files/` mappe i skill's eksekveringsmiljø. Stien er tilgængelig som `_OUTPUT_DIR` miljøvariabel.

Enhver fil skrevet til denne mappe (undtagen filer, der starter med `_`) fanges efter skill-afslutning, gemmes i filsystemet, og en download-link genereres automatisk.

## Skrivning af filer i en skill

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generer en CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF-generering

`reportlab`-biblioteket er tilgængeligt til PDF-generering:

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

`python-docx`-biblioteket er tilgængeligt:

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

## Flere filer

Skills kan generere flere filer i en enkelt eksekvering:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generer CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Generer tekstresumé
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## Filstørrelsesbegrænsninger

Genererede filer er underlagt `FILE_MAX_SIZE_MB`-konfigurationen (standard: 99 MB). Filer, der overskrider denne grænse, springes over uden advarsel.

## Download-links

Efter eksekvering får hver genereret fil en unik download-URL. Disse URL'er inkluderes i skill's output under `_generated_files`-nøglen:

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

`id`-feltet er filens UUID. Det kan anvendes med [Drive-node](../nodes/drive-node.md) til at administrere filen fra workflowet - slet den, tilføj en adgangskode, angiv en udløbsdato eller begræns downloads:

```
$agentLabel._generated_files[0].id
```

Disse links kan også deles direkte eller administreres via [Drive](../reference/drive.md)-fanen.

Afhængigt af deploymentskonfiguration kan `download_url` være enten:
- En absolut URL (når `FRONTEND_URL` er konfigureret for backend-containeren).
- En relativ sti (f.eks. `/api/files/dl/abc123...`), som stadig virker i browserens brugergrænseflade.

## Understøttede MIME-typer

Filtyper registreres automatisk fra filendelsen. Almindelige typer:

| Endelse | MIME Type |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Relateret

- [Drive-node](../nodes/drive-node.md) - Programmatisk sletning, adgangskode, TTL, download-begrænsninger og team-deling/afdeling af genererede filer
- [Drive](../reference/drive.md) - Dashboard Drive-fane og delingslink-adfærd
- [Drive-fane](../tabs/drive-tab.md) - Gennemse og administrer filer i brugergrænsefladen
