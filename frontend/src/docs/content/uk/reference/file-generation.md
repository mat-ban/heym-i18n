# Генерація файлів

Навички (Skills) можуть генерувати файли (PDF, DOCX, CSV, зображення тощо) під час виконання. Згенеровані файли автоматично зберігаються та стають доступними для завантаження.

## Як це працює

Коли навичка запускається, Heym створює каталог `_output_files/` у середовищі виконання навички. Шлях доступний через змінну середовища `_OUTPUT_DIR`.

Будь-який файл, записаний до цього каталогу (за винятком файлів, що починаються з `_`), фіксується після завершення роботи навички, зберігається у файловій системі, а посилання для завантаження генерується автоматично.

## Запис файлів у навичці

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

## Генерація PDF

Для генерації PDF доступна бібліотека `reportlab`:

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

## Генерація DOCX

Доступна бібліотека `python-docx`:

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

## Декілька файлів

Навички можуть генерувати декілька файлів за одне виконання:

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

## Обмеження розміру файлів

На згенеровані файли поширюється конфігурація `FILE_MAX_SIZE_MB` (типове значення: 99 МБ). Файли, що перевищують це обмеження, пропускаються без повідомлення.

## Посилання для завантаження

Після виконання кожен згенерований файл отримує унікальну URL-адресу для завантаження. Ці URL-адреси включаються до виводу навички під ключем `_generated_files`:

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

Поле `id` — це UUID файлу. Використовуйте його разом із [вузлом Drive](../nodes/drive-node.md), щоб керувати файлом безпосередньо з workflow — видаляти його, додавати пароль, встановлювати термін дії або обмежувати кількість завантажень:

```
$agentLabel._generated_files[0].id
```

Цими посиланнями також можна поділитися безпосередньо або керувати ними через вкладку [Drive](../reference/drive.md).

Залежно від конфігурації розгортання `download_url` може бути:
- Абсолютною URL-адресою (коли `FRONTEND_URL` налаштовано для контейнера бекенду).
- Відносним шляхом (наприклад, `/api/files/dl/abc123...`), який усе одно працює в інтерфейсі браузера.

## Підтримувані MIME-типи

Типи файлів визначаються автоматично за розширенням файлу. Поширені типи:

| Розширення | MIME-тип |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Пов'язані розділи

- [Вузол Drive](../nodes/drive-node.md) — програмне видалення, пароль, TTL, обмеження завантажень і надання/скасування спільного доступу команди до згенерованих файлів
- [Drive](../reference/drive.md) — вкладка Drive на панелі керування та поведінка посилань для спільного доступу
- [Вкладка Drive](../tabs/drive-tab.md) — перегляд і керування файлами в інтерфейсі
