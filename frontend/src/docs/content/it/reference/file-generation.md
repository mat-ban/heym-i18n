# Generazione di file

Le Skills possono generare file (PDF, DOCX, CSV, immagini, ecc.) durante l'esecuzione. I file generati vengono archiviati automaticamente e resi disponibili per il download.

## Come funziona

Quando una skill viene eseguita, Heym crea una directory `_output_files/` nell'ambiente di esecuzione della skill. Il percorso è disponibile tramite la variabile d'ambiente `_OUTPUT_DIR`.

Qualsiasi file scritto in questa directory (eccetto i file che iniziano con `_`) viene acquisito al termine dell'esecuzione della skill, archiviato nel file system e viene generato automaticamente un link per il download.

## Scrittura di file in una skill

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

## Generazione di PDF

La libreria `reportlab` è disponibile per la generazione di PDF:

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

## Generazione di DOCX

La libreria `python-docx` è disponibile:

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

## File multipli

Le skill possono generare più file in una singola esecuzione:

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

## Limiti di dimensione dei file

I file generati sono soggetti alla configurazione `FILE_MAX_SIZE_MB` (valore predefinito: 99 MB). I file che superano questo limite vengono ignorati silenziosamente.

## Link per il download

Al termine dell'esecuzione, ogni file generato ottiene un URL di download univoco. Questi URL sono inclusi nell'output della skill sotto la chiave `_generated_files`:

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

Il campo `id` è l'UUID del file. Lo si utilizzi con il [Nodo Drive](../nodes/drive-node.md) per gestire il file dall'interno del workflow — eliminarlo, aggiungere una password, impostare una scadenza o limitare i download:

```
$agentLabel._generated_files[0].id
```

Questi link possono anche essere condivisi direttamente o gestiti tramite la scheda [Drive](../reference/drive.md).

A seconda della configurazione di deployment, `download_url` può essere:
- Un URL assoluto (quando `FRONTEND_URL` è configurato per il container backend).
- Un percorso relativo (ad esempio `/api/files/dl/abc123...`), che funziona comunque nell'interfaccia browser.

## MIME type supportati

I tipi di file vengono rilevati automaticamente dall'estensione del file. Tipi comuni:

| Estensione | MIME Type |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Correlati

- [Nodo Drive](../nodes/drive-node.md) - Eliminazione programmatica, password, TTL, limiti di download e condivisione/rimozione della condivisione con il team sui file generati
- [Drive](../reference/drive.md) - Scheda Drive della dashboard e comportamento dei link di condivisione
- [Scheda Drive](../tabs/drive-tab.md) - Sfogliare e gestire i file nell'interfaccia