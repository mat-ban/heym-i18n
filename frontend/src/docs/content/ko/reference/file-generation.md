# 파일 생성

Skill은 실행 중에 파일(PDF, DOCX, CSV, 이미지 등)을 생성할 수 있습니다. 생성된 파일은 자동으로 저장되며 다운로드할 수 있게 제공됩니다.

## 작동 방식

Skill이 실행되면 Heym은 해당 Skill의 실행 환경에 `_output_files/` 디렉터리를 생성합니다. 이 경로는 `_OUTPUT_DIR` 환경 변수로 사용할 수 있습니다.

이 디렉터리에 기록된 모든 파일(`_`로 시작하는 파일 제외)은 Skill 완료 후 캡처되어 파일 시스템에 저장되며, 다운로드 링크가 자동으로 생성됩니다.

## Skill에서 파일 작성하기

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

## PDF 생성

PDF 생성을 위해 `reportlab` 라이브러리를 사용할 수 있습니다:

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

## DOCX 생성

`python-docx` 라이브러리를 사용할 수 있습니다:

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

## 여러 파일 생성

Skill은 단일 실행에서 여러 파일을 생성할 수 있습니다:

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

## 파일 크기 제한

생성된 파일은 `FILE_MAX_SIZE_MB` 구성(기본값: 99 MB)의 적용을 받습니다. 이 제한을 초과하는 파일은 별도의 알림 없이 건너뜁니다.

## 다운로드 링크

실행 후 각 생성된 파일에는 고유한 다운로드 URL이 부여됩니다. 이 URL은 Skill의 출력에서 `_generated_files` 키 아래에 포함됩니다:

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

`id` 필드는 파일 UUID입니다. 이를 [Drive 노드](../nodes/drive-node.md)와 함께 사용하여 Workflow 내에서 파일을 관리할 수 있습니다 — 삭제, 비밀번호 추가, 만료 설정, 다운로드 제한 등이 가능합니다:

```
$agentLabel._generated_files[0].id
```

이 링크는 직접 공유하거나 [Drive](../reference/drive.md) 탭을 통해 관리할 수도 있습니다.

배포 구성에 따라 `download_url`은 다음 중 하나일 수 있습니다:
- 절대 URL (백엔드 컨테이너에 `FRONTEND_URL`이 구성된 경우)
- 상대 경로 (예: `/api/files/dl/abc123...`), 이는 브라우저 UI에서도 여전히 작동합니다.

## 지원되는 MIME 타입

파일 타입은 파일 확장자에서 자동으로 감지됩니다. 일반적인 타입:

| 확장자 | MIME 타입 |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## 관련 항목

- [Drive 노드](../nodes/drive-node.md) - 생성된 파일에 대한 프로그래밍 방식의 삭제, 비밀번호, TTL, 다운로드 제한, 팀 공유/공유 해제
- [Drive](../reference/drive.md) - 대시보드 Drive 탭 및 공유 링크 동작
- [Drive 탭](../tabs/drive-tab.md) - UI에서 파일 탐색 및 관리
