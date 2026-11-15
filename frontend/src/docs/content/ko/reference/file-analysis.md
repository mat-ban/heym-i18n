# 파일 분석

파일 분석을 사용하면 Chat, [Agent 노드](../nodes/agent-node.md) 및 [Code 노드](../nodes/code-node.md)가 격리된 Python 샌드박스에서 [Drive](./drive.md)의 대용량 파일을 열고 분석할 수 있습니다. PDF, 스프레드시트, CSV, DOCX 및 JSON 파일을 먼저 검사한 다음 선택적으로 읽으므로 200페이지 분량의 계약서나 백만 개의 행이 있는 통합 문서를 모델의 컨텍스트에 모두 넣을 필요가 없습니다.

## 작동 방식

모든 호출은 네트워크 액세스가 없는 새로운 컨테이너에서 실행됩니다. 필요한 파일은 읽기 전용으로 복사되고 코드가 실행된 후 컨테이너가 제거됩니다. 동일한 세션의 호출 간에 작은 작업 폴더가 유지되므로 이후 단계에서 이전 단계가 저장한 결과로부터 작업을 이어갈 수 있습니다.

| 경로 | 내용 |
|------|--------|
| `/input` | 이 세션의 Drive 파일, 읽기 전용 |
| `/work` | 세션 동안 유지되는 작업 공간(예: `/work/sales.pkl`) |
| `/work/out` | 여기에 기록된 파일은 호출 후 Drive에 저장되며 링크로 반환됩니다 |

샌드박스에는 pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx 및 langdetect가 사전 설치되어 있으며 [변환기 노드](../nodes/converter-node.md)가 사용하는 Tesseract OCR도 포함되어 있습니다.

## 도구

모델은 3가지 도구와 Chat의 4번째 도구를 함께 사용합니다:

| 도구 | 기능 |
|------|----------|
| `list_files` | 열 수 있는 Drive 파일을 나열합니다: 이름, 유형, 크기, 날짜 |
| `inspect_file` | 짧은 샘플과 함께 파일의 유형, 메타데이터 및 구조를 반환합니다 |
| `run_python` | 지정된 파일에서 Python을 실행하고 콘솔 출력을 반환합니다 |
| `clear_workspace` | Chat 전용: 대화의 작업 폴더를 삭제합니다 |

`inspect_file`은 요약에 필요한 항목만 읽습니다:

| 유형 | 요약 내용 |
|-----|-----------------|
| PDF | 페이지 수, 제목 및 작성자, 텍스트 추출 가능 여부, 언어, 페이지 크기, 첫 페이지 텍스트 및 표. 스캔된 PDF는 OCR로 읽습니다(호출당 최대 5페이지) |
| XLSX / XLS | 행 및 열 수가 포함된 시트, 실제 머리글 행, 유형, 준비된 pandas `read_hint`, 명명된 범위, 첫 행들 |
| CSV / TSV | 인코딩, 구분 기호, 행 수, 유형이 포함된 열, 첫 행들 |
| DOCX | 제목 개요, 표, 단어 및 문자 수, 작성자 및 날짜 |
| JSON | 루트 유형, 키, 배열 길이, 중첩 깊이, 샘플 레코드 |

`run_python` 내에서 `heym_files` 모듈을 사용하여 파일을 엽니다:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chat에서

[Chat 탭](../tabs/chat-tab.md), Heym Work의 Chat 또는 MCP `heym_chat` 도구를 통해 PDF, 스프레드시트, DOCX, CSV 또는 JSON 파일, 이미지(PNG, JPG, GIF, WebP) 또는 일반 텍스트 파일을 첨부하세요. 하나의 메시지에는 최대 10개의 파일이 포함될 수 있습니다. 각 파일은 Drive에 저장되며 메시지에는 이름과 ID만 포함됩니다. Chat은 파일을 검사하고 질문에 필요한 부분을 읽은 후 표나 발췌문으로 답변합니다.

## Workflow에서

실행 시에는 자체 파일만 열립니다: [파일 업로드 Trigger](../nodes/file-upload-trigger-node.md)를 통해 업로드된 파일, 노드가 Drive에 쓴 파일, 동일한 실행에서 [Drive 노드](../nodes/drive-node.md)가 **Get** 단계로 가져온 파일입니다.

- **Agent 노드**: 에이전트의 입력이나 메시지에 실행 파일이 포함되어 있으면 해당 파일에 대해 위의 도구를 자동으로 가져옵니다.
- **Code 노ード**: **Files**를 `$Upload.file.id`와 같은 표현식으로 설정하세요. 파일이 마운트되고 `params.files`에 나열됩니다.

## 제한 사항

| 제한 사항 | 값 |
|-----------|------|
| 호출당 메모리 | 2 GB |
| 호출당 시간 | 120초 |
| 세션당 작업 폴더 | 2 GB |
| 호출당 출력 파일 | 20개, 각각 최대 100 MB |
| 모델에 반환되는 출력 텍스트 | 20,000자 |
| 호출당 파일 수 | 20개 |

## 보안

- 샌드박스는 네트워크가 없으며 Heym 설정이나 시크릿에 액세스할 수 없고 권한이 없는 사용자로 실행됩니다.
- 파일은 샌드박스 내부에서만 구문 분석됩니다.
- Chat에서 액세스는 Drive를 따릅니다: 본인이 소유한 파일과 팀에 공유된 파일을 엽니다.
- Chat에서 파일을 여는 작업은 감사 로그에 기록됩니다.
- 파일 내용은 순수하게 데이터로 처리되며 파일 내부의 지침은 실행되지 않습니다.

## 요구 사항

파일 분석을 사용하려면 Heym 인스턴스에 샌드박스 백엔드(Docker 또는 [Kubernetes](../getting-started/running-and-deployment.md#kubernetes))가 필요합니다.

## 관련 항목

- [Drive](./drive.md)
- [Code 노드](../nodes/code-node.md)
- [Agent 노드](../nodes/agent-node.md)
- [Chat 탭](../tabs/chat-tab.md)
