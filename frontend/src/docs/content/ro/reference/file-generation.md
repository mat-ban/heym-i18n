# Generarea Fișierelor

Competențele pot genera fișiere (PDF, DOCX, CSV, imagini etc.) în timpul execuției. Fișierele generate sunt stocate automat și devin disponibile pentru descărcare.

## Cum Funcționează

Când o competență rulează, Heym creează un director `_output_files/` în mediul de execuție al competenței. Calea este disponibilă prin variabila de mediu `_OUTPUT_DIR`.

Orice fișier scris în acest director (cu excepția fișierelor care încep cu `_`) este capturat după finalizarea competenței, stocat în sistemul de fișiere și i se generează automat un link de descărcare.

## Scrierea Fișierelor într-o Competență

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

## Generarea PDF

Biblioteca `reportlab` este disponibilă pentru generarea PDF:

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

## Generarea DOCX

Biblioteca `python-docx` este disponibilă:

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

## Fișiere Multiple

Competențele pot genera mai multe fișiere într-o singură execuție:

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

## Limite de Dimensiune ale Fișierelor

Fișierele generate sunt supuse configurației `FILE_MAX_SIZE_MB` (implicit: 99 MB). Fișierele care depășesc această limită sunt ignorate în mod silențios.

## Linkuri de Descărcare

După execuție, fiecare fișier generat primește un URL unic de descărcare. Aceste URL-uri sunt incluse în rezultatul competenței sub cheia `_generated_files`:

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

Câmpul `id` reprezintă UUID-ul fișierului. Utilizați-l împreună cu [nodul Drive](../nodes/drive-node.md) pentru a gestiona fișierul din interiorul workflow-ului — ștergeți-l, adăugați o parolă, setați o expirare sau limitați descărcările:

```
$agentLabel._generated_files[0].id
```

Aceste linkuri pot fi, de asemenea, partajate direct sau gestionate prin fila [Drive](../reference/drive.md).

În funcție de configurația implementării, `download_url` poate fi:
- Un URL absolut (când `FRONTEND_URL` este configurat pentru containerul backend).
- O cale relativă (de exemplu `/api/files/dl/abc123...`), care funcționează în continuare în interfața browserului.

## Tipuri MIME Acceptate

Tipurile de fișiere sunt detectate automat din extensia fișierului. Tipuri comune:

| Extensie | Tip MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Resurse Asociate

- [Nodul Drive](../nodes/drive-node.md) - Ștergere programatică, parolă, TTL, limite de descărcare și partajare/anulare partajare în echipă pentru fișierele generate
- [Drive](../reference/drive.md) - Fila Drive din panoul de control și comportamentul linkurilor de partajare
- [Fila Drive](../tabs/drive-tab.md) - Răsfoiți și gestionați fișierele în interfață
