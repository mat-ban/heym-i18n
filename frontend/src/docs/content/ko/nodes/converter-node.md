# 변환기

**Converter** 노드는 코드를 작성하지 않고도 데이터와 파일을 형식 간에 변환합니다. 기술 중립적으로 설계되어 시간이 지남에 따라 더 많은 형식을 추가할 수 있습니다. CSV, JSON, XML 데이터를 양방향으로 변환하고, Tesseract OCR을 실행하여 이미지와 PDF에서 텍스트를 추출하며, 저장된 파일을 다른 형식으로 다시 작성합니다.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result` (`csvToJson` / `xmlToJson`의 경우 파싱된 데이터, `jsonToCsv` / `jsonToXml`의 경우 텍스트, `imageToText` / `pdfToText`의 경우 추출된 텍스트, `fileConvert`의 경우 새 파일 메타데이터) |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `conversion` | string | `csvToJson` (CSV 텍스트 → 행 객체 배열), `jsonToCsv` (객체/행 배열 → CSV 텍스트), `xmlToJson` (XML 텍스트 → 객체), `jsonToXml` (객체 → XML 텍스트), `imageToText` (이미지 OCR), `pdfToText` (선택한 모든 PDF 페이지 OCR), 또는 `fileConvert` (저장된 파일을 다른 형식으로 다시 작성) |
| `source` | expression | 변환할 데이터입니다. 비워 두면 노드의 첫 번째 입력을 사용합니다 |
| `delimiter` | string | 단일 문자 필드 구분자 (기본값 `,`) |
| `hasHeader` | boolean | `csvToJson` 전용 — 첫 번째 행을 헤더로 처리합니다 (기본값 `true`) |
| `trimValues` | boolean | `csvToJson` 전용 — 헤더 이름과 셀 값 주변의 공백을 제거합니다 (기본값 `true`) |
| `includeHeader` | boolean | `jsonToCsv` 전용 — 헤더 행을 작성합니다 (기본값 `true`) |
| `converterColumns` | string | `jsonToCsv` 전용 — 선택적 쉼표로 구분된 열 순서 |
| `converterFileId` | expression | 파일 변환 — 읽을 Heym Drive 파일, 예: `$Upload.file.id` |
| `converterTargetFormat` | string | `fileConvert` 전용 — 출력 형식 (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | OCR 전용 — `auto` (기본값), `tur`와 같은 Tesseract 코드, 또는 `custom` |
| `ocrLanguageCustom` | string | OCR 전용 — `ocrLanguage`가 `custom`일 때 사용되는 언어 코드, 예: `eng+tur` |
| `ocrEncoding` | string | OCR 전용 — 텍스트가 정규화되는 문자 집합 (기본값 `utf-8`) |
| `ocrNormalizeUnicode` | boolean | OCR 전용 — NFC 정규화를 적용합니다 (기본값 `true`) |
| `ocrPsm` | string | OCR 전용 — Tesseract 페이지 분할 모드 (기본값 `3`) |
| `ocrDpi` | number | `pdfToText` 전용 — 페이지 래스터화 DPI (기본값 `300`) |
| `ocrPageRange` | expression | `pdfToText` 전용 — `3` 또는 `2-5`. 비워 두면 모든 페이지를 의미합니다 |

## Behavior

- **`csvToJson`** 은 소스 CSV 텍스트를 파싱합니다. `hasHeader: true`이면 각 행이 헤더 값으로 키가 지정된 객체가 되고, `hasHeader: false`이면 각 행이 셀 값의 배열이 됩니다. 인용된 필드, 포함된 구분자, 포함된 줄바꿈은 RFC 4180에 따라 처리됩니다. 선행 UTF-8 BOM(Excel 내보내기에서 흔함)은 제거되며, 중복 헤더 이름은 실제 열을 덮어쓰지 않고 고유하게 만듭니다 (`a, a, a_2` → `a`, `a_3`, `a_2`). 탭으로 구분된 값을 파싱하려면 `delimiter`를 `\t`로 설정하십시오.
- **`trimValues`** (기본값 `true`)는 헤더 이름과 셀 값의 주변 공백을 제거하며, **인용된 필드 내부도 포함**합니다 (`" padded "` → `padded`). RFC 4180은 인용된 공백을 데이터로 취급하므로, 이를 정확히 보존하려면 `trimValues: false`로 설정하십시오.
- **`jsonToCsv`** 는 객체(또는 배열)의 배열로부터 CSV 텍스트를 작성합니다. 열 순서는 `converterColumns`가 제공되면 이를 사용하고, 그렇지 않으면 첫 번째 객체의 키에서 추론합니다. 구분자, 따옴표 또는 줄바꿈을 포함하는 값은 자동으로 인용됩니다.
- **`xmlToJson`** 은 XML을 객체로 파싱합니다. 속성은 `@` 접두사를 사용하고, 속성과 혼합된 텍스트는 `#text`를 사용하며, 반복되는 형제 요소는 배열이 됩니다. XML 엔티티 확장은 비활성화됩니다.
- **`jsonToXml`** 은 객체를 XML 문서로 직렬화합니다. 객체는 정확히 하나의 최상위 키를 가져야 하며, 이 키가 XML 루트 요소가 됩니다. `xmlToJson`과 동일한 `@attribute` 및 `#text` 규칙을 사용하여 자식 요소와 함께 속성과 텍스트를 생성하십시오.
- **`imageToText`** 는 단일 이미지(PNG, JPEG, TIFF, WebP, BMP)에 대해 Tesseract를 실행합니다.
- **`pdfToText`** 는 선택한 각 페이지를 `ocrDpi`로 래스터화하고 인식합니다. 모든 페이지가 OCR을 거치므로, 텍스트 레이어가 완벽하게 갖춰진 디지털 PDF도 여전히 픽셀에서 다시 읽힙니다. 이는 스캔 문서와 디지털 문서가 동일하게 동작하도록 유지하지만 속도를 희생하므로, 긴 파일에서는 `ocrPageRange`를 좁게 지정하십시오.
- **`fileConvert`** 는 소스 파일을 다른 형식으로 다시 작성하고 결과를 **새** Drive 파일로 저장합니다. 원본은 절대 수정되지 않습니다. 문서는 pandoc을 거치고, 이미지는 Pillow를 거치며, JSON에서 CSV로의 변환은 Python csv writer를 거칩니다. 이미지는 문서가 될 수 없고 문서는 이미지가 될 수 없습니다. 이미지에서 텍스트를 읽으려면 `imageToText`를 사용하십시오.

## Getting the file in

파일 변환은 경로나 URL이 아닌 Heym Drive에서 읽으므로, 파일이 먼저 저장되어 있어야 합니다. 세 가지 일반적인 체인:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — `converterFileId`를 `$Upload.file.id`로 지정하십시오.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — 원격 파일을 Drive로 가져온 다음 `$Download.id`를 전달하십시오.
- **[Agent](./agent-node.md) → Converter** — 파일을 작성하는 skill은 이를 `$reportAgent._generated_files[0].id`로 노출합니다.

`converterFileId`는 전체 파일 객체(`$Upload.file`) 또는 Heym 다운로드 URL도 허용하며, 어느 쪽에서든 파일 id를 추출합니다. 파일은 본인이 소유한 것이거나 팀원이 공유한 것이어야 합니다.
## Languages

`auto`(기본값)는 먼저 Tesseract의 방향 및 문자 체계 감지를 실행한 다음, 감지된 문자 체계에 가장 적합한 설치된 모델을 선택합니다. `Latin` 또는 `Cyrillic`과 같은 문자 체계 모델은 해당 문자 체계로 작성된 모든 언어를 읽을 수 있으므로, auto가 터키어 인보이스와 영어 인보이스를 어느 것이 어느 것인지 알려주지 않고도 처리할 수 있습니다.

언어를 알고 있다면 명시하는 것이 여전히 더 정확합니다. 단일 코드(`tur`)를 사용하거나, 혼합 문서의 경우 여러 코드를 `+`로 연결(`eng+tur`)하십시오. 언어가 많을수록 인식 속도가 느려지고 약간 더 노이즈가 많아지므로 목록은 짧게 유지하십시오. 코드는 백엔드에 해당 언어 데이터가 설치되어 있을 때만 작동합니다. 누락된 언어를 선택하면 노드가 사용 가능한 언어 목록을 표시합니다.

모든 Heym 이미지에는 `osd`, 영어, 터키어, 독일어, 프랑스어, 스페인어, 이탈리아어, 포르투갈어, 네덜란드어, 러시아어, 아랍어, 중국어 간체, 일본어, 한국어와 Latin, Cyrillic, Arabic, HanS, Japanese, Hangul 문자 체계 모델이 포함되어 있습니다.

## Encoding

인식된 텍스트는 UTF-8이며 Tesseract가 생성한 모든 문자를 유지합니다. `ocrNormalizeUnicode`(기본적으로 켜짐)는 NFC 정규화를 적용하므로, `s`와 결합 세디유(cedilla)로 작성된 문자가 단일 `ş`가 됩니다. 두 형태는 비교나 데이터베이스 조회에서 동일하지 않으므로 켜두는 것이 좋습니다.

`ocrEncoding`은 다운스트림의 무언가가 전체 Unicode 범위를 저장할 수 없을 때만 중요합니다. `cp1254` 또는 `iso-8859-9`를 선택하면 터키어 텍스트를 그대로 유지하면서 결과가 해당 문자 집합에 맞도록 보장합니다. `latin-1`과 `ascii`는 더 좁으며 표현할 수 없는 문자를 `?`로 대체합니다. 대상 시스템이 강제하지 않는 한 `utf-8`로 두십시오.

## Output

`csvToJson`, `jsonToCsv`, `xmlToJson`, `jsonToXml`은 `$label.result`와 `$label.conversion`을 반환합니다. OCR 변환은 다음을 추가합니다:

| Field | Description |
|-------|-------------|
| `$label.result` | 전체 추출 텍스트, 페이지는 빈 줄로 구분 |
| `$label.language` | 실제로 실행된 모델 (`auto`가 무엇을 선택했는지 확인하는 데 유용) |
| `$label.encoding` | 텍스트가 정규화된 문자 집합 |
| `$label.page_count` | 인식된 페이지 수 |
| `$label.pages` | 페이지별 처리를 위한 `{ page, text }` 배열 |
| `$label.file` | 소스 파일의 `{ id, filename, mime_type, size_bytes }` |

`fileConvert`는 대신 새 파일을 반환합니다:

| Field | Description |
|-------|-------------|
| `$label.id` | 새로 저장된 파일의 UUID |
| `$label.filename` | 변환된 파일 이름, 기본 이름은 유지되고 확장자만 교체됨 |
| `$label.mime_type` | 새 파일의 MIME 타입 |
| `$label.size_bytes` | 새 파일의 크기 |
| `$label.download_url` | 새 파일의 Drive 다운로드 URL |
| `$label.source_file` | 변환된 파일의 메타데이터 |

## Example

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

입력 `name,age\nAda,36`의 경우, 다운스트림 노드는 `$toRows.result`(`[{ "name": "Ada", "age": "36" }]`)를 통해 파싱된 행에 접근합니다.

XML을 JSON으로 변환:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

`<person id="1"><name>Ada</name></person>`의 경우, `$xmlToObject.result`는 `{ "person": { "@id": "1", "name": "Ada" } }`입니다. XML을 생성하려면 해당 객체를 `conversion: "jsonToXml"`로 설정한 두 번째 Converter 노드에 전달하십시오.

파일 업로드 Trigger를 통해 업로드된 스캔 인보이스 읽기:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

다운스트림의 [Agent](./agent-node.md) 또는 [LLM](./llm-node.md) 노드가 `$readInvoice.result`에서 구조화된 필드를 추출할 수 있습니다.

에이전트의 markdown 보고서를 PDF로 변환:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

다운스트림 노드는 `$convertDoc.download_url`을 읽어 PDF를 공유하거나, `$convertDoc.id`를 읽어 [Drive](./drive-node.md)에서 계속 작업할 수 있습니다.

## Requirements

OCR은 `tesseract`와 poppler의 `pdftoppm`을 외부 호출하며, 문서 변환은 pandoc을 사용합니다. 세 가지 모두 `run.sh`, docker-compose, 단일 릴리스 이미지를 포함한 모든 Heym 실행 방식에 포함되어 있으므로 구성할 것이 없습니다. 페이지 제한, 타임아웃, 최대 DPI는 설정이 아닌 고정된 플랫폼 값입니다.

## Related

- [Set](./set-node.md) – 개별 필드 변환 및 매핑
- [JSON output mapper](./json-output-mapper-node.md) – JSON 응답 객체 생성
- [File upload trigger](./file-upload-trigger-node.md) – Heym Drive로 파일 받기
- [Drive](./drive-node.md) – 파일 저장, 가져오기, 공유
- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Expression DSL](../reference/expression-dsl.md) – 함수 및 구문
