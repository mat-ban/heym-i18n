# Google Drive

**Google Drive** 노드는 OAuth2를 통해 Google Drive의 파일과 폴더를 나열, 다운로드, 업데이트, 삭제합니다. 또한 단일 작업으로 Drive 파일을 [Heym Drive](./drive-node.md)로 바로 복사할 수 있습니다.

> **이 노드는 [Drive](./drive-node.md) 노드가 아닙니다.** 해당 노드는 *Heym Drive* — Heym 자체의 내부 파일 저장소입니다. 이 노드는 Google Drive와 통신합니다. `syncToHeymDrive` 작업은 두 저장소를 연결하는 다리 역할을 합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Drive (OAuth2) |
| Output | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 Google Drive credential |
| `gdOperation` | string | 작업: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | 폴더 ID 또는 전체 Drive 폴더 URL. `listFolderFiles`와 `removeFolder`에서 사용됩니다. 비어 있으면 Drive 루트를 의미합니다. |
| `gdFileId` | expression | 파일 ID 또는 전체 Drive/Docs URL. `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`에서 사용됩니다. |
| `gdMaxResults` | expression | `listFolderFiles`용: 반환할 최대 파일 수(기본값 100). 비어 있거나 `0`이면 페이징을 통해 폴더 전체를 로드합니다. 나열된 각 파일에는 Drive가 크기를 보고할 때 `size_bytes`가 포함됩니다. |
| `gdQuery` | expression | `listFolderFiles`용: 폴더 필터와 AND로 결합되는 추가 Drive 쿼리, 예: `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | `listFolderFiles`용: 휴지통에 있는 파일 포함. 기본값 false. |
| `gdExportFormat` | string | `downloadFile` / `syncToHeymDrive`용: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. 비어 있으면 자동입니다. 일반 파일에서는 무시됩니다. |
| `gdFilename` | expression | `syncToHeymDrive`용: Heym Drive에 저장될 파일명을 재정의합니다. |
| `gdBase64Content` | expression | `updateFile`용: 파일 내용을 대체하는 base64 문자열 또는 `data:` URL. |
| `gdNewName` | expression | `updateFile`용: 새 파일명(이름 변경). |
| `gdNewParentId` | expression | `updateFile`용: 대상 폴더 ID 또는 URL(이동). |
| `gdPermanentDelete` | boolean | `removeFile` / `removeFolder`용: false(기본값)이면 항목이 휴지통으로 이동되어 복구 가능하고, true이면 완전히 삭제됩니다. |

## 파일 및 폴더 ID

`gdFileId`, `gdFolderId`, `gdNewParentId`는 **순수 ID** 또는 **전체 URL**을 모두 허용합니다 — Heym이 ID를 자동으로 추출합니다. 다음 형식이 모두 작동합니다:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets, Slides

Google 네이티브 문서는 **다운로드 가능한 바이트가 없습니다**. 이들은 파일이 아니라 Google 서버 상의 레코드입니다 — 원본 콘텐츠를 요청하면 Drive API가 `403 Only files with binary content can be downloaded`를 반환합니다.

`downloadFile`과 `syncToHeymDrive`는 이를 자동으로 감지하여 대신 **내보내기(export)** 를 수행하므로, 대상이 Google Doc이라는 이유만으로 작업이 실패하지 않습니다:

| 원본 | 기본 내보내기 |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| 기타 Google 네이티브 타입 | PDF |

**Export Format**을 설정하여 대상을 재정의할 수 있습니다. 이 설정은 일반 업로드 파일에서는 무시되며, 항상 원본 그대로 다운로드됩니다.

## 작업

| 작업 | 필수 | 설명 |
|-----------|----------|-------------|
| `listFolderFiles` | — (빈 폴더 = 루트) | 선택적 쿼리 필터와 함께 폴더 내 파일을 나열합니다 |
| `downloadFile` | `gdFileId` | 파일 바이트를 base64로 다운로드하며, 네이티브 문서는 자동으로 내보냅니다 |
| `syncToHeymDrive` | `gdFileId` | Google Drive에서 다운로드하여 결과를 Heym Drive에 저장합니다 |
| `updateFile` | `gdFileId` + content / name / parent 중 최소 하나 | 콘텐츠 교체, 이름 변경, 그리고/또는 이동 |
| `removeFile` | `gdFileId` | 파일을 휴지통으로 이동(기본값) 또는 영구 삭제 |
| `removeFolder` | `gdFolderId` | 폴더와 그 내용을 휴지통으로 이동(기본값) 또는 영구 삭제 |

### 삭제는 기본적으로 복구 가능합니다

`removeFile`과 `removeFolder`는 항목을 **Google Drive 휴지통**으로 이동하며, 여기서 복원할 수 있습니다. 이는 스케줄에 따라 또는 [Loop](./loop-node.md) 내부에서 실행될 수 있는 작업에 대한 안전한 기본값입니다.

**Delete permanently**를 활성화하면 항목이 복구 불가능하게 삭제됩니다. `removeFolder`의 경우 폴더 내부의 모든 항목도 함께 삭제됩니다.

또한 노드는 대상 타입을 확인합니다: `removeFile`은 폴더를 거부하고 `removeFolder`는 파일을 거부하므로, 잘못 입력된 ID가 실수로 다른 항목을 삭제하는 일이 없습니다.

### updateFile은 빈 필드를 그대로 둡니다

`updateFile`은 교체가 아니라 업데이트입니다. 콘텐츠, 새 이름, 새 폴더를 원하는 조합으로 채우십시오 — 비워 둔 항목은 변경되지 않습니다. 세 가지 중 최소 하나는 필수입니다.
## Credential 설정

Google Drive는 **OAuth2 "Bring Your Own App"** 모델을 사용합니다. 사용자가 직접 Google Cloud OAuth2 credential을 제공합니다.

> **이 credential은 전체 Drive 접근 권한을 부여합니다.** Heym은 `https://www.googleapis.com/auth/drive` scope를 요청합니다. 이는 노드가 이미 사용자가 소유한 파일에 대해 작업하기 때문입니다. 더 좁은 `drive.file` scope는 앱 자체가 생성한 파일만 볼 수 있으므로, 기존 파일의 목록 조회, 업데이트, 삭제가 불가능해집니다. 이 credential을 팀과 공유하기 전에 [Credential Sharing](../reference/credentials-sharing.md)을 참조하십시오.

**Backend 설정:** Heym backend의 **`FRONTEND_URL`** 을 앱의 공개 URL로 설정하십시오. OAuth redirect URI는 항상 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback`이며, 이 설정에서만 파생되고 요청 헤더에서는 파생되지 않습니다.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** 로 이동하여 **Google Drive API**를 활성화하십시오.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application**을 선택하십시오.
3. **Authorized redirect URIs** 아래에 정확히 `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`을 추가하십시오.
4. **Client ID**와 **Client Secret**을 복사하십시오.
5. Heym에서: **Dashboard → Credentials → New → Google Drive (OAuth2)** 로 이동하여 두 값을 붙여넣은 다음, **Connect**를 클릭하고 팝업에서 접근을 승인하십시오.

## Output

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes`는 폴더와 Google 네이티브 파일의 경우 `null`이며, 이들은 크기를 보고하지 않습니다.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

일반 파일의 경우 `exported`는 `false`이고 `export_format`은 `null`입니다.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id`는 새로운 **Heym Drive** 파일 ID이며, `google_file_id`와는 다릅니다.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted`는 `"trashed"` 또는 `"permanent"`입니다.

## 예시: Drive 폴더를 Heym Drive로 백업하기

1. **[Cron](./cron-node.md)** — 매일 실행합니다.
2. **Google Drive** — 소스 폴더에 대해 `listFolderFiles`를 실행하며, PDF만 원한다면 `gdQuery`를 `mimeType='application/pdf'`로 설정합니다.
3. **[Loop](./loop-node.md)** — `$ListReports.files`를 반복합니다.
4. **Google Drive** — `gdFileId`를 `$BackupLoop.item.id`로, `gdFilename`을 `$BackupLoop.item.name`으로 설정하여 `syncToHeymDrive`를 실행합니다.
5. **[Slack](./slack-node.md)** — 백업된 내용의 요약을 게시합니다.

## Notes

- 모든 텍스트 필드는 `$` 표현식을 허용하므로, ID와 파일명이 이전 노드에서 올 수 있습니다.
- Shared drive가 지원됩니다 — 노드는 모든 요청에 `supportsAllDrives`를 설정합니다.
- 다운로드는 backend의 `FILE_MAX_SIZE_MB` 설정에 대해 크기가 검사됩니다.
- 이 노드를 [Agent](./agent-node.md) 노드의 tool 입력에 연결하고, 임의의 필드에서 bot 아이콘을 사용하여 에이전트가 런타임에 필드를 채우도록 할 수 있습니다.

## See Also

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
