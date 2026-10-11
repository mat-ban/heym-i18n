# Drive

**Drive** 노드는 Workflow 내에서 직접 스킬이 생성한 파일을 관리합니다. 파일을 조회하고, 외부 URL에서 다운로드하고, 삭제하고, 팀과 공유 또는 공유 해제하거나, 접근 제약 조건(비밀번호, 만료, 다운로드 제한)을 프로그래밍 방식으로 갱신하는 데 사용할 수 있습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (작업에 따라 다름) |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `driveOperation` | string | 작업: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | 관리할 Drive 파일의 UUID (`getAll`, `downloadUrl`, `save`를 제외한 모든 작업) |
| `driveLimit` | number | 반환할 최대 파일 수 (`getAll` 전용, 비어 있으면 제한 없음) |
| `driveSourceUrl` | expression | 가져와서 Drive에 저장할 URL (`downloadUrl` 전용) |
| `driveFilename` | expression | 확장자를 포함한 전체 파일명 (`save` 전용, 예: `1.mp3`) |
| `driveBase64Content` | expression | 디코딩하여 저장할 원시 base64 문자열 또는 data URL (`save` 전용) |
| `driveIncludeBinary` | boolean | 출력에 파일 내용을 base64로 포함 (`get` 전용) |
| `drivePassword` | expression | 접근 Token에 설정할 비밀번호 (`setPassword` 전용) |
| `driveTtlHours` | number | 다운로드 링크가 만료되기까지의 시간(시간 단위) (`setTtl` 전용) |
| `driveMaxDownloads` | number | 허용되는 최대 다운로드 횟수 (`setMaxDownloads` 전용) |

## 파일 ID 가져오기

스킬이 파일을 생성하면 출력에 `_generated_files` 배열이 포함됩니다. 각 항목에는 `id` 필드가 있습니다:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

파일 ID는 다음과 같이 참조합니다: `$agentLabel._generated_files[0].id`

## 작업

| 작업 | 필수 필드 | 설명 |
|-----------|----------------|-------------|
| `get` | driveFileId | Drive에서 파일 메타데이터(및 선택적으로 바이너리 내용)를 조회 |
| `getAll` | 없음 | 소유 및 팀 공유된 읽기 가능한 Drive 파일을 파일명, MIME 타입, 크기, 소스, 다운로드 URL 등의 메타데이터와 함께 나열 |
| `downloadUrl` | driveSourceUrl | 외부 URL에서 파일을 가져와 Drive에 저장 |
| `save` | driveFilename, driveBase64Content | base64 내용을 디코딩하여 Drive 파일로 저장 |
| `delete` | driveFileId | 디스크와 데이터베이스에서 파일 및 모든 접근 Token을 삭제 |
| `setPassword` | driveFileId, drivePassword | 기본 공개 Token을 비밀번호로 보호된 Token으로 교체 |
| `setTtl` | driveFileId, driveTtlHours | 기본 공개 Token을 N시간 후 만료되는 Token으로 교체 |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | 기본 공개 Token을 N회 다운로드로 제한된 Token으로 교체 |
| `shareWithMyTeams` | driveFileId | Workflow 소유자가 현재 속한 모든 팀과 읽기 전용으로 파일 공유 |
| `unshareWithMyTeams` | driveFileId | 파일에서 모든 팀 공유를 제거 |

> **참고:** `set*` 작업은 기본(제약 없는) 공개 Token을 삭제하고 지정된 제약 조건을 가진 새 Token을 생성합니다. 갱신된 `download_url`이 출력에 포함됩니다.
> **팀 공유:** `shareWithMyTeams`는 소유자의 현재 팀에 대해 명시적 공유를 생성합니다. 작업을 다시 실행하지 않는 한 향후 팀이 자동으로 추가되지는 않습니다. `unshareWithMyTeams`는 파일에서 모든 팀 공유를 제거합니다.

## 예제 — URL에서 파일 다운로드

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

저장된 파일을 하위 노드에서 참조: `$fetchReport.id`, `$fetchReport.download_url`

파일명은 `Content-Disposition` 응답 헤더에서 가져옵니다. 헤더가 없으면 URL 경로에서 파생됩니다.

## 예제 — Base64 입력을 Drive에 저장

텍스트 입력 노드(또는 임의의 상위 노드)가 base64 파일 내용을 제공하는 경우 사용합니다:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

저장된 파일을 하위 노드에서 참조: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content`는 원시 base64 문자열 또는 `data:...;base64,...` data URL을 허용합니다. MIME 타입은 파일명 확장자에서 추론됩니다.

## 예제 — 파일을 가져와 Vision LLM에서 바이너리 사용

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

base64 내용을 하위 노드에서 참조: `$fetchImage.file_base64`

`file_base64`를 통해 반환된 이미지는 Workflow를 실행할 때 디버그 패널에 인라인으로 표시됩니다.

## 예제 — Drive 파일 나열

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

반환된 첫 번째 파일을 하위 노드에서 참조: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## 예제 — 처리 후 파일 삭제

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## 예제 — 생성된 파일에 비밀번호 설정

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## 예제 — 만료(TTL) 설정

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## 예제 — 다운로드 횟수 제한

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## 예제 — 내 팀과 공유

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

팀 구성원은 Drive에서 파일을 보고 다운로드할 수 있으며, Workflow에서 읽기 작업을 사용할 수 있습니다. 단, 파일을 삭제하거나 재공유하거나 공개 링크 제약 조건을 변경할 수는 없습니다.

## 예제 — 내 팀 공유 해제

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## 파일 변환

형식 변환은 [Converter](./converter-node.md) 노드로 이동되었습니다. Drive로 파일을 저장하거나 가져온 후, 해당 id를 converter 노드에 전달하십시오:

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

원본 파일은 보존되며, 변환된 파일은 새로운 Drive 파일로 저장됩니다.

## 출력 접근

**get:**
- `$nodeLabel.id` — 파일의 UUID
- `$nodeLabel.filename` — 파일 이름
- `$nodeLabel.mime_type` — MIME 타입 (예: `image/png`)
- `$nodeLabel.size_bytes` — 파일 크기(바이트)
- `$nodeLabel.download_url` — 공개 다운로드 URL
- `$nodeLabel.file_base64` — base64로 인코딩된 파일 내용 (**Include binary content**가 활성화된 경우에만)

**getAll:**
- `$nodeLabel.files` — 파일 메타데이터 객체의 배열
- `$nodeLabel.count` — 반환된 파일 수
- `$nodeLabel.files[0].id` — 파일의 UUID
- `$nodeLabel.files[0].filename` — 파일 이름
- `$nodeLabel.files[0].mime_type` — MIME 타입
- `$nodeLabel.files[0].size_bytes` — 파일 크기(바이트)
- `$nodeLabel.files[0].download_url` — 공개 Token이 존재할 때의 공개 다운로드 URL
- `$nodeLabel.files[0].metadata` — 저장된 메타데이터 객체
- `$nodeLabel.files[0].created_at` — 파일 생성 타임스탬프

**downloadUrl:**
- `$nodeLabel.id` — 새로 저장된 파일의 UUID
- `$nodeLabel.filename` — 파일 이름 (`Content-Disposition` 또는 URL 경로에서 가져옴)
- `$nodeLabel.mime_type` — 응답 또는 파일 확장자에서 감지된 MIME 타입
- `$nodeLabel.size_bytes` — 파일 크기(바이트)
- `$nodeLabel.download_url` — 저장된 파일의 Drive 다운로드 URL

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — 삭제된 파일의 UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — 파일의 UUID
- `$nodeLabel.download_url` — 제약 조건이 적용된 새로운 접근 Token URL

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 파일의 UUID
- `$nodeLabel.shared_team_count` — 작업 후 팀 공유 수

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 파일의 UUID
- `$nodeLabel.shared_team_count` — 작업 후 `0`

## 소유권

소유자 전용 작업은 파일이 Workflow 소유자에게 속해 있어야 합니다. 읽기 작업(`get`, `getAll`)은 팀을 통해 Workflow 소유자와 공유된 파일에도 접근할 수 있습니다.

## 관련 항목

- [File Generation](../reference/file-generation.md) - 스킬이 파일을 생성하는 방법과 `_generated_files` 출력
- [Drive Tab](../reference/drive.md) - 대시보드에서의 시각적 파일 관리
- [Agent Node](./agent-node.md) - 파일을 생성하는 스킬을 실행합니다
- [Converter Node](./converter-node.md) - 저장된 파일을 다른 형식으로 변환하거나 텍스트로 OCR합니다
- [Expression DSL](../reference/expression-dsl.md) - 동적 값에 대한 표현식 구문
