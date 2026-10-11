# Generiranje Datoteka

Vještine mogu generirati datoteke (PDF, DOCX, CSV, slike itd.) tijekom izvršavanja. Generirane datoteke automatski se pohranjuju i omogućuju preuzimanje.

## Kako To Funkcionira

Kada se vještina pokrene, Heym stvara direktorij `_output_files/` u okruženju izvršavanja vještine. Putanja je dostupna kao varijabla okruženja `_OUTPUT_DIR`.

Svaka datoteka napisana u ovaj direktorij (osim datoteka koje počinju s `_`) se bilježi nakon završetka vještine, pohranjuje u datotečni sustav, a poveznica za preuzimanje se automatski generira.

## Pisanje Datoteka u Vještini

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generiranje CSV-a
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Ime", "Vrijednost"])
    writer.writerow(["Prihod", args.get("revenue", 0)])
    writer.writerow(["Korisnici", args.get("users", 0)])

print(json.dumps({"status": "Izvještaj generiran"}))
```

## Generiranje PDF-a

Biblioteka `reportlab` dostupna je za generiranje PDF-a:

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
c.drawString(100, 750, f"Račun za {args.get('customer', 'Nepoznato')}")
c.drawString(100, 730, f"Iznos: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Račun generiran"}))
```

## Generiranje DOCX-a

Biblioteka `python-docx` je dostupna:

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Izvještaj"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Dokument generiran"}))
```

## Više Datoteka

Vještine mogu generirati više datoteka u jednom izvršavanju:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generiranje CSV-a
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["kol1", "kol2"])
    writer.writerow(["val1", "val2"])

# Generiranje sažetka u tekstualnoj datoteci
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Sažetak obrade podataka...")

print(json.dumps({"status": "završeno", "files_generated": 2}))
```

## Ograničenja Veličine Datoteka

Generirane datoteke podliježu konfiguraciji `FILE_MAX_SIZE_MB` (zadano: 99 MB). Datoteke koje premašuju ovu granicu tiho se preskoče.

## Poveznice za Preuzimanje

Nakon izvršavanja, svakoj generiranoj datoteci dodjeljuje se jedinstvena URL poveznica za preuzimanje. Ove URL-ove uključuje izlaz vještine pod ključem `_generated_files`:

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

Polje `id` predstavlja UUID datoteke. Koristite ga s [Drive čvorom](../nodes/drive-node.md) za upravljanje datotekom unutar workflow-a — brisanje, dodavanje lozinke, postavljanje isteka ili ograničavanje preuzimanja:

```
$agentLabel._generated_files[0].id
```

Ove poveznice također se mogu izravno dijeliti ili upravljati putem [Drive](../reference/drive.md) taba.

Ovisno o konfiguraciji implementacije, `download_url` može biti:
- Apsolutna URL adresa (kada je `FRONTEND_URL` konfiguriran za backend kontejner).
- Relativna putanja (na primjer `/api/files/dl/abc123...`), koja i dalje funkcionira u pregledniku.

## Podržani MIME Tipovi

Tipovi datoteka automatski se prepoznaju prema ekstenziji datoteke. Uobičajeni tipovi:

| Ekstenzija | MIME Tip |
|-------------|----------|
| .pdf        | application/pdf |
| .docx      | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv       | text/csv |
| .json      | application/json |
| .txt       | text/plain |
| .png       | image/png |
| .jpg       | image/jpeg |

## Povezano

- [Drive Čvor](../nodes/drive-node.md) - Programatsko brisanje, lozinka, TTL, ograničenja preuzimanja i dijeljenje/ne-dijeljenje timskih datoteka
- [Drive](../reference/drive.md) - Dashboard Drive tab i ponašanje poveznica za dijeljenje
- [Drive Tab](../tabs/drive-tab.md) - Pregledavanje i upravljanje datotekama u UI
