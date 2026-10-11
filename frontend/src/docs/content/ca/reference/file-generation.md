# Generació de fitxers

Les Skills poden generar fitxers (PDF, DOCX, CSV, imatges, etc.) durant l'execució. Els fitxers generats s'emmagatzemen automàticament i es posen a disposició per a la seva descàrrega.

## Com funciona

Quan s'executa una skill, Heym crea un directori `_output_files/` a l'entorn d'execució de la skill. La ruta està disponible com a variable d'entorn `_OUTPUT_DIR`.

Qualsevol fitxer escrit en aquest directori (excepte els fitxers que comencen per `_`) es captura un cop finalitza la skill, s'emmagatzema al sistema de fitxers i es genera automàticament un enllaç de descàrrega.

## Escriure fitxers en una skill

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

## Generació de PDF

La biblioteca `reportlab` està disponible per a la generació de PDF:

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

## Generació de DOCX

La biblioteca `python-docx` està disponible:

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

## Diversos fitxers

Les skills poden generar diversos fitxers en una sola execució:

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

## Límits de mida dels fitxers

Els fitxers generats estan subjectes a la configuració `FILE_MAX_SIZE_MB` (per defecte: 99 MB). Els fitxers que superen aquest límit s'ometen silenciosament.

## Enllaços de descàrrega

Després de l'execució, cada fitxer generat obté una URL de descàrrega única. Aquestes URL s'inclouen a la sortida de la skill sota la clau `_generated_files`:

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

El camp `id` és l'UUID del fitxer. Utilitzeu-lo amb el [node Drive](../nodes/drive-node.md) per gestionar el fitxer des de dins del workflow — eliminar-lo, afegir-hi una contrasenya, establir una caducitat o limitar-ne les descàrregues:

```
$agentLabel._generated_files[0].id
```

Aquests enllaços també es poden compartir directament o gestionar-se mitjançant la pestanya [Drive](../reference/drive.md).

Segons la configuració del desplegament, `download_url` pot ser:
- Una URL absoluta (quan `FRONTEND_URL` està configurada per al contenidor del backend).
- Una ruta relativa (per exemple `/api/files/dl/abc123...`), que continua funcionant a la interfície del navegador.

## Tipus MIME admesos

Els tipus de fitxer es detecten automàticament a partir de l'extensió del fitxer. Tipus habituals:

| Extensió | Tipus MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Relacionat

- [Node Drive](../nodes/drive-node.md) - Eliminació programàtica, contrasenya, TTL, límits de descàrrega i compartició/descompartició amb l'equip sobre fitxers generats
- [Drive](../reference/drive.md) - Pestanya Drive del tauler i comportament dels enllaços compartits
- [Pestanya Drive](../tabs/drive-tab.md) - Navegueu i gestioneu fitxers a la interfície