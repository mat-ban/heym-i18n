# Google Sheets

**Google Sheets** 노드는 OAuth2를 통해 Google Sheets 스프레드시트의 데이터를 읽고, 쓰고, 관리합니다. 이를 사용하여 스프레드시트 Workflow를 자동화할 수 있습니다 — 보고서 읽기, 결과 기록, 트래커 업데이트 등.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)에서 가져온 Google Sheets credential |
| `gsOperation` | string | 작업: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | 스프레드시트 ID 또는 전체 Google Sheets URL |
| `gsSheetName` | expression | 시트 탭 이름 (예: `Sheet1`). `getSheetInfo`에는 필요하지 않습니다. |
| `gsStartRow` | expression | `readRange`용: 1부터 시작하는 첫 번째 데이터 행 (`gsHasHeader` 사용 시 행 1은 헤더입니다). |
| `gsMaxRows` | expression | `readRange`용: 최대 데이터 행 수 (0 = 전체). |
| `gsHasHeader` | boolean | `readRange`용: true일 때 행 1을 열 이름으로 취급합니다. |
| `gsUpdateRow` | expression | `updateRange` 전용: 업데이트할 1부터 시작하는 시트 행 번호 (열 A–Z). 설정하지 않으면 `gsStartRow`가 사용됩니다. batchUpdate가 아닌 단일 values API PUT입니다. |
| `gsRange` | expression | A1 표기법 범위 (예: `A1:D100`). 레거시 예시이며, 편집기에서는 읽기/업데이트에 행 필드를 사용합니다. |
| `gsKeepHeader` | boolean | `clearRange` 전용: true일 때 행 1은 유지되고 그 아래 데이터 행이 지워집니다 (열 A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | `appendRows` 전용: **Bottom**은 데이터가 있는 마지막 행 뒤에 추가하고, **Top**은 행 1 바로 아래에 새 행을 삽입합니다 (데이터를 아래로 이동). |
| `gsValuesInputMode` | `raw` \| `selective` | `appendRows` / `updateRange`용: **Raw** = 전체 JSON 배열, **Selective** = 하나의 시트 행, 열 필드만 (A1 레이블 없음). |
| `gsValuesSelectiveCols` | string | Selective 모드: 열 개수 (A–Z). |
| `gsValues` | expression | 값의 JSON 2D 배열 (예: `[["Name","Age"],["Alice",30]]`). `appendRows`, `updateRange`에 필수입니다. |

## 스프레드시트 ID

`gsSpreadsheetId` 필드는 **순수 ID** (Google Sheets URL에서 `/d/`와 `/edit` 사이의 긴 영숫자 문자열) 또는 **전체 URL**을 모두 허용합니다 — Heym이 ID를 자동으로 추출합니다.

## Credential 설정

Google Sheets는 **OAuth2 "Bring Your Own App"** 모델을 사용합니다. 사용자가 직접 Google Cloud OAuth2 credential을 제공합니다.

**백엔드 구성:** Heym 백엔드의 **`FRONTEND_URL`** 을 앱의 공개 URL (사용자가 브라우저에 입력하는 주소)로 설정하십시오. 예: `https://your-heym-domain`. OAuth redirect URI는 항상 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`이며, 이 설정에서만 파생되고 요청 헤더에서는 파생되지 않습니다.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** 로 이동하여 **Google Sheets API**를 활성화합니다.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application**을 선택합니다.
3. **Authorized redirect URIs** 아래에 정확히 다음을 추가합니다: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (예: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. **Client ID**와 **Client Secret**을 복사합니다.
5. Heym Dashboard → **Credentials** → **New** → **Google Sheets (OAuth2)** 를 선택합니다.
6. Client ID, Client Secret, 이름을 입력한 후 **Connect**를 클릭하여 브라우저 팝업에서 OAuth2 동의를 완료합니다.

Token은 백그라운드에서 자동으로 갱신됩니다 — 수동 Token 관리가 필요하지 않습니다.

## 작업

| 작업 | 필수 필드 | 설명 |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | 셀 값 읽기 (A–Z). 레거시 흐름에서는 선택적 `gsRange` 사용 |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | 하단 (`gsAppendPlacement` append) 또는 행 1 아래 (`prepend`)에 행 추가 |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | `gsUpdateRow`부터 행을 덮어쓰기 (A–Z). 다중 행 JSON은 연속된 행에 기록 |
| `clearRange` | gsSpreadsheetId, gsSheetName | 탭의 열 A–Z에 있는 모든 값 지우기. 선택적 `gsKeepHeader`는 첫 번째 행 유지 |
| `getSheetInfo` | gsSpreadsheetId | 스프레드시트 제목과 시트 탭 목록 가져오기 |

## 출력 참조

| 작업 | 출력 필드 | 타입 | 설명 |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | 행 객체: 열 키 (헤더 이름 또는 A, B, …)와 **`rowIndex`** (1부터 시작하는 시트 행) |
| `readRange` | `.total` | number | 반환된 데이터 행 수 |
| `appendRows` | `.updatedRange` | string | 기록된 범위 |
| `appendRows` | `.updates` | number | 추가된 행 수 |
| `updateRange` | `.updatedRange` | string | 기록된 범위 |
| `updateRange` | `.updatedCells` | number | 업데이트된 셀 수 |
| `clearRange` | `.clearedRange` | string | 지워진 범위 |
| `getSheetInfo` | `.title` | string | 스프레드시트 제목 |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` 객체 목록 |

모든 작업은 출력에 `success: true`와 `operation: "<name>"`을 포함합니다.
## 예제 – 범위 읽기

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

출력 접근: `$readReport.rows[0]` (첫 번째 데이터 행 객체), `$readReport.rows[0].Name` (헤더 기준 열), `$readReport.rows[0].rowIndex` (1부터 시작하는 시트 행 번호).

## 예제 – 입력에서 행 추가

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## 관련 항목

- [노드 유형](../reference/node-types.md) – 모든 노드 유형 개요
- [Credentials 탭](../tabs/credentials-tab.md) – Google Sheets OAuth2 credential 추가
- [서드파티 통합](../reference/integrations.md#google-sheets-oauth2) – Google Sheets credential 설정
