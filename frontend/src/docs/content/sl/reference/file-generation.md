# Generiranje Datotek

Sposobnosti lahko med izvajanjem generirajo datoteke (PDF, DOCX, CSV, slike itd.). Generirane datoteke se samodejno shranijo in so na voljo za prenos.

## Kako deluje

Ko se sposobnost izvaja, Heym ustvari imenik `_output_files/` v okolju izvajanja sposobnosti. Pot je na voljo kot okoljska spremenljivka `_OUTPUT_DIR`.

Vsaka datoteka, napisana v ta imenik (razen datotek, ki se začnejo z `_`), se zajame po zaključku sposobnosti, shrani v datotečni sistem in samodejno se ustvari povezava za prenos.

## Pisanje Datotek v Sposobnosti

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generiranje CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Ime", "Vrednost"])
    writer.writerow(["Prihodki", args.get("revenue", 0)])
    writer.writerow(["Uporabniki", args.get("users", 0)])

print(json.dumps({"status": "Poročilo generirano"}))
```

## Generiranje PDF

Knjižnica `reportlab` je na voljo za generiranje PDF:

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
c.drawString(100, 750, f"Račun za {args.get('customer', 'Neznan')}")
c.drawString(100, 730, f"Znesek: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Račun generiran"}))
```

## Generiranje DOCX

Knjižnica `python-docx` je na voljo:

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Poročilo"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Dokument generiran"}))
```

## Več Datotek

Sposobnosti lahko generirajo več datotek v eni izvedbi:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generiranje CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Generiranje besedilnega povzetka
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Povzetek obdelave podatkov...")

print(json.dumps({"status": "končano", "files_generated": 2}))
```

## Omejitve Velikosti Datotek

Generirane datoteke so podvržene konfiguraciji `FILE_MAX_SIZE_MB` (privzeto: 99 MB). Datoteke, ki presegajo to omejitev, se tiho preskočijo.

## Povezave za Prenos

Po izvedbi vsaka generirana datoteka dobi edinstveno URL povezavo za prenos. Te povezave so vključene v izhod sposobnosti pod ključem `_generated_files`:

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

Polje `id` je UUID datoteke. Uporabite ga z [Drive vozliščem](../nodes/drive-node.md) za upravljanje datoteke znotraj workflow-a — izbrišite jo, dodajte geslo, nastavite potek ali omejite prenose:

```
$agentLabel._generated_files[0].id
```

Te povezave lahko delite neposredno ali upravljate prek zavihka [Drive](../reference/drive.md).

Glede na konfiguracijo namestitve lahko `download_url` predstavlja bodisi:
- Absolutni URL (ko je `FRONTEND_URL` konfiguriran za backend kontejner).
- Relativna pot (na primer `/api/files/dl/abc123...`), ki še vedno deluje v uporabniškem vmesniku brskalnika.

## Podprti MIME Tipi

Vrste datotek se samodejno zaznajo iz končnice datoteke. Pogoste vrste:

| Končnica | MIME Tip |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Sorodno

- [Drive Vozlišče](../nodes/drive-node.md) - Programatsko brisanje, geslo, TTL, omejitve prenosa in deljenje/ne-deljenje ekipe za generirane datoteke
- [Drive](../reference/drive.md) - Nadzorna plošča zavihka Drive in obnašanje povezav za deljenje
- [Drive Zavihek](../tabs/drive-tab.md) - Brskanje in upravljanje datotek v uporabniškem vmesniku
