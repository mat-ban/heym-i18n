# Geração de Arquivos

As Skills podem gerar arquivos (PDF, DOCX, CSV, imagens, etc.) durante a execução. Os arquivos gerados são armazenados automaticamente e disponibilizados para download.

## Como Funciona

Quando uma skill é executada, o Heym cria um diretório `_output_files/` no ambiente de execução da skill. O caminho fica disponível por meio da variável de ambiente `_OUTPUT_DIR`.

Qualquer arquivo gravado nesse diretório (exceto arquivos que começam com `_`) é capturado após a conclusão da skill, armazenado no sistema de arquivos e um link de download é gerado automaticamente.

## Gravando Arquivos em uma Skill

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

## Geração de PDF

A biblioteca `reportlab` está disponível para geração de PDF:

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

## Geração de DOCX

A biblioteca `python-docx` está disponível:

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

## Múltiplos Arquivos

As Skills podem gerar múltiplos arquivos em uma única execução:

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

## Limites de Tamanho de Arquivo

Os arquivos gerados estão sujeitos à configuração `FILE_MAX_SIZE_MB` (padrão: 99 MB). Arquivos que excedem esse limite são ignorados silenciosamente.

## Links de Download

Após a execução, cada arquivo gerado recebe uma URL de download exclusiva. Essas URLs são incluídas na saída da skill sob a chave `_generated_files`:

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

O campo `id` é o UUID do arquivo. Utilize-o com o [nó Drive](../nodes/drive-node.md) para gerenciar o arquivo de dentro do workflow — excluí-lo, adicionar uma senha, definir uma expiração ou limitar downloads:

```
$agentLabel._generated_files[0].id
```

Esses links também podem ser compartilhados diretamente ou gerenciados por meio da aba [Drive](../reference/drive.md).

Dependendo da configuração de implantação, `download_url` pode ser:
- Uma URL absoluta (quando `FRONTEND_URL` está configurada para o contêiner de backend).
- Um caminho relativo (por exemplo, `/api/files/dl/abc123...`), que ainda funciona na interface do navegador.

## Tipos MIME Suportados

Os tipos de arquivo são detectados automaticamente a partir da extensão do arquivo. Tipos comuns:

| Extensão | Tipo MIME |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## Relacionados

- [Nó Drive](../nodes/drive-node.md) - Exclusão programática, senha, TTL, limites de download e compartilhamento/descompartilhamento em equipe em arquivos gerados
- [Drive](../reference/drive.md) - Aba Drive do dashboard e comportamento de links de compartilhamento
- [Aba Drive](../tabs/drive-tab.md) - Navegue e gerencie arquivos na interface
