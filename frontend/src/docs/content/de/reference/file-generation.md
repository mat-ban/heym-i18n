# Dateierstellung

Skills können während der Ausführung Dateien generieren (PDF, DOCX, CSV, Bilder usw.). Generierte Dateien werden automatisch gespeichert und zum Download bereitgestellt.

## Funktionsweise

Wenn ein Skill ausgeführt wird, erstellt Heym ein Verzeichnis `_output_files/` in der Ausführungsumgebung des Skills. Der Pfad ist als Umgebungsvariable `_OUTPUT_DIR` verfügbar.

Jede Datei, die in dieses Verzeichnis geschrieben wird (außer Dateien, die mit `_` beginnen), wird nach Abschluss des Skills erfasst, im Dateisystem gespeichert und ein Download-Link wird automatisch generiert.

## Dateien in einem Skill schreiben

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

## PDF-Generierung

Die Bibliothek `reportlab` ist für die PDF-Generierung verfügbar:

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

## DOCX-Generierung

Die Bibliothek `python-docx` ist verfügbar:

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

## Mehrere Dateien

Skills können mehrere Dateien in einer einzigen Ausführung generieren:

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

## Dateigrößenbeschränkungen

Generierte Dateien unterliegen der Konfiguration `FILE_MAX_SIZE_MB` (Standard: 99 MB). Dateien, die dieses Limit überschreiten, werden stillschweigend übersprungen.

## Download-Links

Nach der Ausführung erhält jede generierte Datei eine eindeutige Download-URL. Diese URLs sind in der Ausgabe des Skills unter dem Schlüssel `_generated_files` enthalten:

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

Das Feld `id` ist die Datei-UUID. Verwende sie mit dem [Drive-Knoten](../nodes/drive-node.md), um die Datei aus dem Workflow heraus zu verwalten — sie zu löschen, ein Passwort hinzuzufügen, ein Ablaufdatum festzulegen oder Downloads zu begrenzen:

```
$agentLabel._generated_files[0].id
```

Diese Links können auch direkt geteilt oder über den Reiter [Drive](../reference/drive.md) verwaltet werden.

Je nach Deployment-Konfiguration kann `download_url` entweder sein:
- Eine absolute URL (wenn `FRONTEND_URL` für den Backend-Container konfiguriert ist).
- Ein relativer Pfad (zum Beispiel `/api/files/dl/abc123...`), der in der Browser-UI weiterhin funktioniert.

## Unterstützte MIME-Typen

Dateitypen werden automatisch anhand der Dateiendung erkannt. Häufige Typen:

| Erweiterung | MIME-Typ |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Verwandte Themen

- [Drive-Knoten](../nodes/drive-node.md) - Programmatisches Löschen, Passwort, TTL, Download-Begrenzungen und Team-Freigabe/Aufhebung der Freigabe für generierte Dateien
- [Drive](../reference/drive.md) - Dashboard-Reiter Drive und Verhalten von Share-Links
- [Drive-Reiter](../tabs/drive-tab.md) - Dateien in der UI durchsuchen und verwalten
