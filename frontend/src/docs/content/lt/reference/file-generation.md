# Failų Generavimas

Įgūdžiai gali generuoti failus (PDF, DOCX, CSV, vaizdus ir kt.) vykdymo metu. Sugeneruoti failai automatiškai saugomi ir yra prieinami atsisiųsti.

## Kaip Tai Veikia

Kai įgūdis vykdomas, Heym sukuria `_output_files/` katalogą įgūdžio vykdymo aplinkoje. Kelias yra prieinamas kaip `_OUTPUT_DIR` aplinkos kintamasis.

Bet kuris failas, parašytas į šį katalogą (išskyrus failus, prasidedančius nuo `_`), yra užfiksuojamas po to, kai įgūdis baigiasi, saugomas failų sistemoje ir automatiškai sugeneruojamas atsisiuntimo nuoroda.

## Failų Rašymas Įgūdyje

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generuoti CSV
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF Generavimas

`reportlab` biblioteka yra prieinama PDF generavimui:

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

## DOCX Generavimas

`python-docx` biblioteka yra prieinama:

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

## Daugiau Failų

Įgūdžiai gali generuoti kelis failus vieno vykdymo metu:

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# Generuoti CSV
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# Generuoti teksto santrauką
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## Failų Dydžio Apribojimai

Sugeneruoti failai yra ribojami `FILE_MAX_SIZE_MB` konfigūracija (numatytasis: 99 MB). Failai, viršijantys šį limitą, tyliai praleidžiami.

## Atsisiuntimo Nuorodos

Po vykdymo kiekvienas sugeneruotas failas gauna unikalią atsisiuntimo URL. Šios URL yra įtrauktos į įgūdžio išvestį po `_generated_files` raktu:

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

`id` laukas yra failo UUID. Naudokite jį su [Drive node](../nodes/drive-node.md), kad valdytumėte failą iš darbo eigos — ištrinkite jį, pridėkite slaptažodį, nustatykite galiojimo laiką arba apribokite atsisiuntimus:

```
$agentLabel._generated_files[0].id
```

Šios nuorodos taip pat gali būti dalijamos tiesiogiai arba valdytos per [Drive](../reference/drive.md) skirtuką.

Priklausomai nuo diegimo konfigūracijos, `download_url` gali būti:
- Absoliuti URL (kai `FRONTEND_URL` yra sukonfigūruotas backend konteineryje).
- Santykinis kelias (pavyzdžiui, `/api/files/dl/abc123...`), kuris vis tiek veikia naršyklės UI.

## Palaikomi MIME Tipai

Failų tipai automatiškai nustatomi pagal failo plėtinį. Dažniausi tipai:

| Plėtinys | MIME Tipas |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Susiję

- [Drive Node](../nodes/drive-node.md) - Programinis ištrynimas, slaptažodis, TTL, atsisiuntimo apribojimai ir komandos dalijimas/nepateikimas sugeneruotiems failams
- [Drive](../reference/drive.md) - Valdymo pultas Drive skirtuko ir dalijimosi nuorodų elgsena
- [Drive Tab](../tabs/drive-tab.md) - Naršykite ir valdykite failus UI
