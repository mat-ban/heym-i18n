# Generovanie súborov

Skilly môžu počas vykonávania generovať súbory (PDF, DOCX, CSV, obrázky atď.). Vygenerované súbory sa automaticky ukladajú a sú dostupné na stiahnutie.

## Ako to funguje

Keď sa skill spustí, Heym vytvorí adresár `_output_files/` v prostredí vykonávania skillu. Cesta je dostupná ako premenná prostredia `_OUTPUT_DIR`.

Každý súbor zapísaný do tohto adresára (okrem súborov začínajúcich na `_`) sa po dokončení skillu zachytí, uloží do systému súborov a automaticky sa vygeneruje odkaz na stiahnutie.

## Zapisovanie súborov v skille

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

## Generovanie PDF

Pre generovanie PDF je dostupná knižnica `reportlab`:

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

## Generovanie DOCX

Knižnica `python-docx` je dostupná:

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

## Viacero súborov

Skilly môžu v rámci jedného vykonávania vygenerovať viacero súborov:

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

## Limity veľkosti súborov

Vygenerované súbory podliehajú konfigurácii `FILE_MAX_SIZE_MB` (predvolená hodnota: 99 MB). Súbory presahujúce tento limit sa ticho preskočia.

## Odkazy na stiahnutie

Po vykonaní získa každý vygenerovaný súbor jedinečnú URL adresu na stiahnutie. Tieto URL adresy sú zahrnuté vo výstupe skillu pod kľúčom `_generated_files`:

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

Pole `id` je UUID súboru. Použite ho s [uzlom Drive](../nodes/drive-node.md) na správu súboru v rámci workflowu — vymazanie, pridanie hesla, nastavenie expirácie alebo obmedzenie počtu stiahnutí:

```
$agentLabel._generated_files[0].id
```

Tieto odkazy je možné tiež priamo zdieľať alebo spravovať prostredníctvom karty [Drive](../reference/drive.md).

V závislosti od konfigurácie nasadenia môže byť `download_url` buď:
- Absolútna URL adresa (ak je pre backendový kontajner nakonfigurovaná `FRONTEND_URL`).
- Relatívna cesta (napríklad `/api/files/dl/abc123...`), ktorá však stále funguje v používateľskom rozhraní prehliadača.

## Podporované MIME typy

Typy súborov sa automaticky rozpoznávajú podľa prípony súboru. Bežné typy:

| Prípona | MIME typ |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Súvisiace

- [Uzol Drive](../nodes/drive-node.md) – Programové vymazanie, heslo, TTL, limity sťahovania a zdieľanie/odzdieľanie v rámci tímu pre vygenerované súbory
- [Drive](../reference/drive.md) – Karta Drive v dashboarde a správanie zdieľaných odkazov
- [Karta Drive](../tabs/drive-tab.md) – Prehliadanie a správa súborov v používateľskom rozhraní
