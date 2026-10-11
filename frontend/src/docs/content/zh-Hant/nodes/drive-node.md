# Drive

**Drive** 節點可直接在工作流程中管理由 skill 產生的檔案。使用此節點可擷取檔案、從外部 URL 下載檔案、刪除檔案、與團隊分享或取消分享，或以程式化方式更新其存取限制（密碼、到期時間、下載次數上限）。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.files`、`$nodeLabel.status`、`$nodeLabel.file_id`、`$nodeLabel.download_url`（依操作而異） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `driveOperation` | string | 操作：`get`、`getAll`、`downloadUrl`、`save`、`delete`、`setPassword`、`setTtl`、`setMaxDownloads`、`shareWithMyTeams`、`unshareWithMyTeams` |
| `driveFileId` | expression / select | 要管理的 Drive 檔案 UUID（適用於除 `getAll`、`downloadUrl` 與 `save` 以外的所有操作） |
| `driveLimit` | number | 要回傳的檔案數量上限（僅限 `getAll`；留空表示無限制） |
| `driveSourceUrl` | expression | 要擷取並儲存至 Drive 的 URL（僅限 `downloadUrl`） |
| `driveFilename` | expression | 包含副檔名的完整檔名（僅限 `save`，例如 `1.mp3`） |
| `driveBase64Content` | expression | 要解碼並儲存的原始 base64 字串或 data URL（僅限 `save`） |
| `driveIncludeBinary` | boolean | 在輸出中包含以 base64 表示的檔案內容（僅限 `get`） |
| `drivePassword` | expression | 要設定於存取 Token 的密碼（僅限 `setPassword`） |
| `driveTtlHours` | number | 下載連結到期前的小時數（僅限 `setTtl`） |
| `driveMaxDownloads` | number | 允許的下載次數上限（僅限 `setMaxDownloads`） |

## 取得檔案 ID

當 skill 產生檔案時，輸出會包含一個 `_generated_files` 陣列。每個項目都包含一個 `id` 欄位：

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

使用以下方式參照檔案 ID：`$agentLabel._generated_files[0].id`

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|----------------|-------------|
| `get` | driveFileId | 從 Drive 擷取檔案中繼資料（以及選擇性的二進位內容） |
| `getAll` | 無 | 列出擁有的及團隊分享的可讀 Drive 檔案，並附上檔名、MIME 類型、大小、來源及下載 URL 等中繼資料 |
| `downloadUrl` | driveSourceUrl | 從外部 URL 擷取檔案並儲存至 Drive |
| `save` | driveFilename、driveBase64Content | 解碼 base64 內容並將其儲存為 Drive 檔案 |
| `delete` | driveFileId | 從磁碟與資料庫中刪除該檔案及其所有存取 Token |
| `setPassword` | driveFileId、drivePassword | 將預設公開 Token 替換為受密碼保護的 Token |
| `setTtl` | driveFileId、driveTtlHours | 將預設公開 Token 替換為 N 小時後到期的 Token |
| `setMaxDownloads` | driveFileId、driveMaxDownloads | 將預設公開 Token 替換為限制 N 次下載的 Token |
| `shareWithMyTeams` | driveFileId | 以唯讀方式將檔案分享給工作流程擁有者目前所屬的所有團隊 |
| `unshareWithMyTeams` | driveFileId | 移除該檔案的所有團隊分享 |

> **注意：** `set*` 操作會刪除預設（無限制）的公開 Token，並建立一個具有指定限制的新 Token。更新後的 `download_url` 會包含在輸出中。
> **團隊分享：** `shareWithMyTeams` 會為擁有者目前的團隊建立明確的分享。除非再次執行該操作，否則未來的團隊不會自動加入。`unshareWithMyTeams` 會移除該檔案的所有團隊分享。

## 範例 — 從 URL 下載檔案

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

在下游參照已儲存的檔案：`$fetchReport.id`、`$fetchReport.download_url`

檔名取自 `Content-Disposition` 回應標頭；若不存在，則從 URL 路徑衍生。

## 範例 — 將 Base64 輸入儲存至 Drive

當文字輸入節點（或任何上游節點）提供 base64 檔案內容時，請使用此方式：

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

在下游參照已儲存的檔案：`$saveAudio.id`、`$saveAudio.download_url`

`driveBase64Content` 接受原始 base64 字串或 `data:...;base64,...` data URL。MIME 類型會從檔名副檔名推斷。

## 範例 — 取得檔案並在 Vision LLM 中使用二進位內容

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

在下游參照 base64 內容：`$fetchImage.file_base64`

透過 `file_base64` 回傳的圖片，會在您執行工作流程時內嵌顯示於除錯面板中。

## 範例 — 列出 Drive 檔案

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

在下游參照第一個回傳的檔案：`$listFiles.files[0].filename`、`$listFiles.files[0].size_bytes`
## 範例 — 處理後刪除檔案

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

## 範例 — 為產生的檔案設定密碼

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

## 範例 — 設定到期時間（TTL）

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

## 範例 — 限制下載次數

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

## 範例 — 與我的團隊分享

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

團隊成員可以從 Drive 檢視與下載檔案，並在 Workflow 中使用讀取操作。他們無法刪除、重新分享或變更公開連結限制。

## 範例 — 取消與我的團隊分享

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

## 轉換檔案

格式轉換已移至 [Converter](./converter-node.md) 節點。使用 Drive 儲存或取得檔案，然後將其 id 交給 converter 節點：

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

原始檔案會被保留，而轉換後的檔案會儲存為新的 Drive 檔案。

## 輸出存取

**get：**
- `$nodeLabel.id` — 檔案的 UUID
- `$nodeLabel.filename` — 檔案名稱
- `$nodeLabel.mime_type` — MIME 類型（例如 `image/png`）
- `$nodeLabel.size_bytes` — 檔案大小（以位元組為單位）
- `$nodeLabel.download_url` — 公開下載 URL
- `$nodeLabel.file_base64` — base64 編碼的檔案內容（僅在啟用 **Include binary content** 時）

**getAll：**
- `$nodeLabel.files` — 檔案中繼資料物件陣列
- `$nodeLabel.count` — 回傳的檔案數量
- `$nodeLabel.files[0].id` — 檔案的 UUID
- `$nodeLabel.files[0].filename` — 檔案名稱
- `$nodeLabel.files[0].mime_type` — MIME 類型
- `$nodeLabel.files[0].size_bytes` — 檔案大小（以位元組為單位）
- `$nodeLabel.files[0].download_url` — 當公開 Token 存在時的公開下載 URL
- `$nodeLabel.files[0].metadata` — 儲存的中繼資料物件
- `$nodeLabel.files[0].created_at` — 檔案建立時間戳記

**downloadUrl：**
- `$nodeLabel.id` — 新儲存檔案的 UUID
- `$nodeLabel.filename` — 檔案名稱（來自 `Content-Disposition` 或 URL 路徑）
- `$nodeLabel.mime_type` — 從回應或副檔名偵測到的 MIME 類型
- `$nodeLabel.size_bytes` — 檔案大小（以位元組為單位）
- `$nodeLabel.download_url` — 所儲存檔案的 Drive 下載 URL

**delete：**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — 已刪除檔案的 UUID

**setPassword / setTtl / setMaxDownloads：**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — 檔案的 UUID
- `$nodeLabel.download_url` — 套用限制後的新存取 Token URL

**shareWithMyTeams：**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 檔案的 UUID
- `$nodeLabel.shared_team_count` — 操作後的團隊分享數量

**unshareWithMyTeams：**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — 檔案的 UUID
- `$nodeLabel.shared_team_count` — 操作後為 `0`

## 擁有權

僅限擁有者的操作要求檔案必須屬於 Workflow 擁有者。讀取操作（`get`、`getAll`）也可以透過團隊存取與 Workflow 擁有者分享的檔案。

## 相關

- [檔案產生](../reference/file-generation.md) - 技能如何產生檔案以及 `_generated_files` 輸出
- [Drive 分頁](../reference/drive.md) - 儀表板中的視覺化檔案管理
- [Agent 節點](./agent-node.md) - 執行會產生檔案的技能
- [Converter 節點](./converter-node.md) - 將儲存的檔案轉換為其他格式，或透過 OCR 轉為文字
- [Expression DSL](../reference/expression-dsl.md) - 動態值的表達式語法
