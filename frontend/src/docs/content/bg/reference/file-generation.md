# Генериране на файлове

Skills могат да генерират файлове (PDF, DOCX, CSV, изображения и др.) по време на изпълнение. Генерираните файлове се съхраняват автоматично и стават достъпни за изтегляне.

## Как работи

Когато даден skill се изпълнява, Heym създава директория `_output_files/` в средата за изпълнение на skill-а. Пътят е достъпен чрез променливата на средата `_OUTPUT_DIR`.

Всеки файл, записан в тази директория (с изключение на файлове, чиито имена започват с `_`), се прихваща след завършване на skill-а, съхранява се във файловата система и автоматично се генерира връзка за изтегляне.

## Записване на файлове в skill

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

## Генериране на PDF

Библиотеката `reportlab` е налична за генериране на PDF:

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

## Генериране на DOCX

Библиотеката `python-docx` е налична:

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

## Множество файлове

Skills могат да генерират множество файлове в рамките на едно изпълнение:

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

## Ограничения за размера на файловете

Генерираните файлове са обект на конфигурацията `FILE_MAX_SIZE_MB` (по подразбиране: 99 MB). Файлове, надвишаващи това ограничение, се пропускат без предупреждение.

## Връзки за изтегляне

След изпълнението всеки генериран файл получава уникален URL за изтегляне. Тези URL адреси се включват в изхода на skill-а под ключа `_generated_files`:

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

Полето `id` е UUID на файла. Използвайте го с [Drive node](../nodes/drive-node.md), за да управлявате файла от workflow-а — да го изтриете, да добавите парола, да зададете срок на валидност или да ограничите изтеглянията:

```
$agentLabel._generated_files[0].id
```

Тези връзки могат също да бъдат споделяни директно или управлявани чрез раздела [Drive](../reference/drive.md).

В зависимост от конфигурацията на внедряването, `download_url` може да бъде:
- Абсолютен URL (когато `FRONTEND_URL` е конфигуриран за backend контейнера).
- Относителен път (например `/api/files/dl/abc123...`), който все още работи в потребителския интерфейс на браузъра.

## Поддържани MIME типове

Типовете файлове се определят автоматично от разширението на файла. Често срещани типове:

| Разширение | MIME тип |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Свързани

- [Drive Node](../nodes/drive-node.md) - Програмно изтриване, парола, TTL, ограничения за изтегляне и споделяне/прекратяване на споделяне с екип за генерирани файлове
- [Drive](../reference/drive.md) - Раздел Drive в таблото за управление и поведение на връзките за споделяне
- [Drive Tab](../tabs/drive-tab.md) - Преглед и управление на файлове в потребителския интерфейс
