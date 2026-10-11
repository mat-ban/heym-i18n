# Generování souborů

Skills mohou během provádění generovat soubory (PDF, DOCX, CSV, obrázky atd.). Vygenerované soubory jsou automaticky uloženy a zpřístupněny ke stažení.

## Jak to funguje

Když se skill spustí, Heym vytvoří v prostředí pro provádění skillu adresář `_output_files/`. Cesta je dostupná jako proměnná prostředí `_OUTPUT_DIR`.

Jakýkoli soubor zapsaný do tohoto adresáře (kromě souborů začínajících znakem `_`) je po dokončení skillu zachycen, uložen do souborového systému a automaticky se vygeneruje odkaz ke stažení.

## Zápis souborů ve skillu

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

## Generování PDF

Pro generování PDF je k dispozici knihovna `reportlab`:

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

## Generování DOCX

Je k dispozici knihovna `python-docx`:

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

## Více souborů

Skills mohou v rámci jednoho spuštění generovat více souborů:

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

## Limity velikosti souborů

Vygenerované soubory podléhají konfiguraci `FILE_MAX_SIZE_MB` (výchozí hodnota: 99 MB). Soubory překračující tento limit jsou tiše přeskočeny.

## Odkazy ke stažení

Po provedení získá každý vygenerovaný soubor jedinečnou URL adresu ke stažení. Tyto URL adresy jsou zahrnuty ve výstupu skillu pod klíčem `_generated_files`:

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

Pole `id` je UUID souboru. Použijte jej s [uzlem Drive](../nodes/drive-node.md) pro správu souboru z prostředí workflow — smazání, přidání hesla, nastavení expirace nebo omezení počtu stažení:

```
$agentLabel._generated_files[0].id
```

Tyto odkazy lze také přímo sdílet nebo spravovat prostřednictvím karty [Drive](../reference/drive.md).

V závislosti na konfiguraci nasazení může být `download_url` buď:
- Absolutní URL adresa (když je pro kontejner backendu nakonfigurována proměnná `FRONTEND_URL`).
- Relativní cesta (například `/api/files/dl/abc123...`), která stále funguje v uživatelském rozhraní prohlížeče.

## Podporované MIME typy

Typy souborů jsou automaticky rozpoznány z přípony souboru. Běžné typy:

| Přípona | MIME typ |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Související

- [Uzel Drive](../nodes/drive-node.md) - Programové mazání, heslo, TTL, limity stahování a sdílení/rušení sdílení s týmem u vygenerovaných souborů
- [Drive](../reference/drive.md) - Karta Drive v dashboardu a chování odkazů pro sdílení
- [Karta Drive](../tabs/drive-tab.md) - Procházení a správa souborů v uživatelském rozhraní
