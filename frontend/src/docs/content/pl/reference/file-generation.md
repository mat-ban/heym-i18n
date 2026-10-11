# Generowanie plików

Skills mogą generować pliki (PDF, DOCX, CSV, obrazy itp.) podczas wykonywania. Wygenerowane pliki są automatycznie przechowywane i udostępniane do pobrania.

## Jak to działa

Gdy skill jest uruchamiany, Heym tworzy katalog `_output_files/` w środowisku wykonawczym skilla. Ścieżka jest dostępna jako zmienna środowiskowa `_OUTPUT_DIR`.

Każdy plik zapisany w tym katalogu (z wyjątkiem plików rozpoczynających się od `_`) jest przechwytywany po zakończeniu działania skilla, zapisywany w systemie plików, a link do pobrania jest generowany automatycznie.

## Zapisywanie plików w skillu

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

## Generowanie PDF

Biblioteka `reportlab` jest dostępna do generowania plików PDF:

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

## Generowanie DOCX

Biblioteka `python-docx` jest dostępna:

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

## Wiele plików

Skills mogą generować wiele plików w ramach jednego wykonania:

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

## Limity rozmiaru plików

Wygenerowane pliki podlegają konfiguracji `FILE_MAX_SIZE_MB` (domyślnie: 99 MB). Pliki przekraczające ten limit są po cichu pomijane.

## Linki do pobrania

Po wykonaniu każdy wygenerowany plik otrzymuje unikalny adres URL do pobrania. Adresy te są dołączane do danych wyjściowych skilla pod kluczem `_generated_files`:

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

Pole `id` to UUID pliku. Należy użyć go z [węzłem Drive](../nodes/drive-node.md), aby zarządzać plikiem z poziomu workflow — usunąć go, dodać hasło, ustawić termin wygaśnięcia lub ograniczyć liczbę pobrań:

```
$agentLabel._generated_files[0].id
```

Linki te można również udostępniać bezpośrednio lub zarządzać nimi za pomocą zakładki [Drive](../reference/drive.md).

W zależności od konfiguracji wdrożenia `download_url` może być:
- Bezwzględnym adresem URL (gdy `FRONTEND_URL` jest skonfigurowany dla kontenera backendu).
- Ścieżką względną (na przykład `/api/files/dl/abc123...`), która nadal działa w interfejsie przeglądarki.

## Obsługiwane typy MIME

Typy plików są wykrywane automatycznie na podstawie rozszerzenia pliku. Typowe typy:

| Rozszerzenie | Typ MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Powiązane

- [Węzeł Drive](../nodes/drive-node.md) — Programowe usuwanie, hasło, TTL, limity pobrań oraz udostępnianie/anulowanie udostępniania w zespole dla wygenerowanych plików
- [Drive](../reference/drive.md) — Zakładka Drive w panelu i zachowanie linków udostępniania
- [Zakładka Drive](../tabs/drive-tab.md) — Przeglądanie i zarządzanie plikami w interfejsie
