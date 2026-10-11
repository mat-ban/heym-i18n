# Δημιουργία Αρχείων

Οι Δεξιότητες μπορούν να δημιουργούν αρχεία (PDF, DOCX, CSV, εικόνες κ.λπ.) κατά την εκτέλεση. Τα παραγόμενα αρχεία αποθηκεύονται αυτόματα και καθίστανται διαθέσιμα για λήψη.

## Πώς Λειτουργεί

Όταν εκτελείται μια Δεξιότητα, το Heym δημιουργεί έναν κατάλογο `_output_files/` στο περιβάλλον εκτέλεσης της Δεξιότητας. Η διαδρομή είναι διαθέσιμη μέσω της μεταβλητής περιβάλλοντος `_OUTPUT_DIR`.

Κάθε αρχείο που εγγράφεται σε αυτόν τον κατάλογο (εκτός από αρχεία που ξεκινούν με `_`) καταγράφεται μετά την ολοκλήρωση της Δεξιότητας, αποθηκεύεται στο σύστημα αρχείων και δημιουργείται αυτόματα ένας σύνδεσμος λήψης.

## Εγγραφή Αρχείων σε μια Δεξιότητα

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

## Δημιουργία PDF

Η βιβλιοθήκη `reportlab` είναι διαθέσιμη για τη δημιουργία PDF:

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

## Δημιουργία DOCX

Η βιβλιοθήκη `python-docx` είναι διαθέσιμη:

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

## Πολλαπλά Αρχεία

Οι Δεξιότητες μπορούν να δημιουργούν πολλαπλά αρχεία σε μία μόνο εκτέλεση:

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

## Όρια Μεγέθους Αρχείων

Τα παραγόμενα αρχεία υπόκεινται στη ρύθμιση `FILE_MAX_SIZE_MB` (προεπιλογή: 99 MB). Τα αρχεία που υπερβαίνουν αυτό το όριο παραλείπονται σιωπηλά.

## Σύνδεσμοι Λήψης

Μετά την εκτέλεση, κάθε παραγόμενο αρχείο λαμβάνει ένα μοναδικό URL λήψης. Αυτά τα URL περιλαμβάνονται στην έξοδο της Δεξιότητας κάτω από το κλειδί `_generated_files`:

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

Το πεδίο `id` είναι το UUID του αρχείου. Χρησιμοποιήστε το με τον [Drive node](../nodes/drive-node.md) για να διαχειριστείτε το αρχείο μέσα από το workflow — διαγράψτε το, προσθέστε κωδικό πρόσβασης, ορίστε ημερομηνία λήξης ή περιορίστε τις λήψεις:

```
$agentLabel._generated_files[0].id
```

Αυτοί οι σύνδεσμοι μπορούν επίσης να κοινοποιηθούν απευθείας ή να διαχειριστούν μέσω της καρτέλας [Drive](../reference/drive.md).

Ανάλογα με τη διαμόρφωση ανάπτυξης, το `download_url` μπορεί να είναι είτε:
- Ένα απόλυτο URL (όταν το `FRONTEND_URL` είναι ρυθμισμένο για το backend container).
- Μια σχετική διαδρομή (για παράδειγμα `/api/files/dl/abc123...`), η οποία εξακολουθεί να λειτουργεί στο UI του browser.

## Υποστηριζόμενοι Τύποι MIME

Οι τύποι αρχείων ανιχνεύονται αυτόματα από την επέκταση αρχείου. Συνήθεις τύποι:

| Επέκταση | Τύπος MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Σχετικά

- [Drive Node](../nodes/drive-node.md) - Προγραμματιστική διαγραφή, κωδικός πρόσβασης, TTL, όρια λήψεων και κοινοποίηση/ακύρωση κοινοποίησης ομάδας σε παραγόμενα αρχεία
- [Drive](../reference/drive.md) - Καρτέλα Drive του Dashboard και συμπεριφορά συνδέσμων κοινοποίησης
- [Drive Tab](../tabs/drive-tab.md) - Περιήγηση και διαχείριση αρχείων στο UI
