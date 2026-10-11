# Generación de archivos

Las Skills pueden generar archivos (PDF, DOCX, CSV, imágenes, etc.) durante la ejecución. Los archivos generados se almacenan automáticamente y quedan disponibles para su descarga.

## Cómo funciona

Cuando se ejecuta una skill, Heym crea un directorio `_output_files/` en el entorno de ejecución de la skill. La ruta está disponible a través de la variable de entorno `_OUTPUT_DIR`.

Cualquier archivo escrito en este directorio (excepto los archivos que comienzan con `_`) se captura una vez que la skill finaliza, se almacena en el sistema de archivos y se genera automáticamente un enlace de descarga.

## Escritura de archivos en una skill

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

## Generación de PDF

La librería `reportlab` está disponible para la generación de PDF:

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

## Generación de DOCX

La librería `python-docx` está disponible:

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

## Varios archivos

Las skills pueden generar varios archivos en una sola ejecución:

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

## Límites de tamaño de archivo

Los archivos generados están sujetos a la configuración `FILE_MAX_SIZE_MB` (valor predeterminado: 99 MB). Los archivos que superan este límite se omiten de forma silenciosa.

## Enlaces de descarga

Tras la ejecución, cada archivo generado obtiene una URL de descarga única. Estas URL se incluyen en la salida de la skill bajo la clave `_generated_files`:

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

El campo `id` es el UUID del archivo. Utilícelo con el [Nodo Drive](../nodes/drive-node.md) para gestionar el archivo desde el propio workflow: eliminarlo, añadir una contraseña, establecer una caducidad o limitar las descargas:

```
$agentLabel._generated_files[0].id
```

Estos enlaces también se pueden compartir directamente o gestionar a través de la pestaña [Drive](../reference/drive.md).

Según la configuración de despliegue, `download_url` puede ser:
- Una URL absoluta (cuando `FRONTEND_URL` está configurada para el contenedor del backend).
- Una ruta relativa (por ejemplo, `/api/files/dl/abc123...`), que sigue funcionando en la interfaz de usuario del navegador.

## Tipos MIME admitidos

Los tipos de archivo se detectan automáticamente a partir de la extensión del archivo. Tipos comunes:

| Extensión | Tipo MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Relacionado

- [Nodo Drive](../nodes/drive-node.md): eliminación programática, contraseña, TTL, límites de descarga y compartir/dejar de compartir con el equipo en los archivos generados
- [Drive](../reference/drive.md): pestaña Drive del panel y comportamiento de los enlaces para compartir
- [Pestaña Drive](../tabs/drive-tab.md): explorar y gestionar archivos en la interfaz de usuario