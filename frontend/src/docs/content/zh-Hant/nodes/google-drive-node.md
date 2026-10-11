# Google Drive

**Google Drive** 節點透過 OAuth2 列出、下載、更新及刪除 Google Drive 中的檔案與資料夾。它也能以單一操作將 Drive 檔案直接複製到 [Heym Drive](./drive-node.md)。

> **這不是 [Drive](./drive-node.md) 節點。** 那個節點是 *Heym Drive* —— Heym 自家的內部檔案儲存空間。本節點則與 Google Drive 溝通。`syncToHeymDrive` 操作是兩者之間的橋樑。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Drive (OAuth2) |
| Output | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 Google Drive 認證 |
| `gdOperation` | string | 操作：`listFolderFiles`、`downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile`、`removeFolder` |
| `gdFolderId` | expression | 資料夾 ID 或完整的 Drive 資料夾 URL。供 `listFolderFiles` 與 `removeFolder` 使用。留空表示 Drive 根目錄。 |
| `gdFileId` | expression | 檔案 ID 或完整的 Drive/Docs URL。供 `downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile` 使用。 |
| `gdMaxResults` | expression | 供 `listFolderFiles` 使用：要回傳的檔案數量上限（預設 100）。留空或設為 `0` 會透過分頁載入整個資料夾。當 Drive 回報大小時，每個列出的檔案會包含 `size_bytes`。 |
| `gdQuery` | expression | 供 `listFolderFiles` 使用：額外的 Drive 查詢，會與資料夾篩選條件以 AND 串接，例如 `mimeType='application/pdf'`。 |
| `gdIncludeTrashed` | boolean | 供 `listFolderFiles` 使用：包含已移至垃圾桶的檔案。預設為 false。 |
| `gdExportFormat` | string | 供 `downloadFile` / `syncToHeymDrive` 使用：`pdf`、`docx`、`xlsx`、`pptx`、`csv`、`txt`。留空表示自動判斷。對一般檔案會被忽略。 |
| `gdFilename` | expression | 供 `syncToHeymDrive` 使用：覆寫儲存於 Heym Drive 的檔案名稱。 |
| `gdBase64Content` | expression | 供 `updateFile` 使用：用來取代檔案內容的 base64 字串或 `data:` URL。 |
| `gdNewName` | expression | 供 `updateFile` 使用：新的檔案名稱（重新命名）。 |
| `gdNewParentId` | expression | 供 `updateFile` 使用：目的資料夾 ID 或 URL（移動）。 |
| `gdPermanentDelete` | boolean | 供 `removeFile` / `removeFolder` 使用：當為 false（預設）時，項目會移至垃圾桶且可還原；當為 true 時，項目會被銷毀。 |

## 檔案與資料夾 ID

`gdFileId`、`gdFolderId` 與 `gdNewParentId` 皆接受**裸 ID** 或**完整 URL** —— Heym 會自動擷取 ID。以下格式皆可使用：

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs、Sheets 與 Slides

Google 原生文件**沒有可下載的位元組**。它們是 Google 伺服器上的記錄，而非檔案 —— 若你要求取得其原始內容，Drive API 會回傳 `403 Only files with binary content can be downloaded`。

`downloadFile` 與 `syncToHeymDrive` 會自動偵測這類文件並改為**匯出**，因此不會僅因目標是 Google Doc 而導致操作失敗：

| 來源 | 預設匯出格式 |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| 任何其他 Google 原生類型 | PDF |

設定 **Export Format** 可覆寫目標格式。此設定對一般上傳的檔案會被忽略，這類檔案一律以原樣下載。

## 操作

| 操作 | 必填 | 說明 |
|-----------|----------|-------------|
| `listFolderFiles` | —（資料夾留空 = 根目錄） | 列出資料夾中的檔案，可選擇性加上查詢篩選條件 |
| `downloadFile` | `gdFileId` | 以 base64 下載檔案位元組，並自動匯出原生文件 |
| `syncToHeymDrive` | `gdFileId` | 從 Google Drive 下載並將結果儲存至 Heym Drive |
| `updateFile` | `gdFileId` + 內容 / 名稱 / 父層至少其一 | 取代內容、重新命名及/或移動 |
| `removeFile` | `gdFileId` | 將檔案移至垃圾桶（預設）或永久刪除 |
| `removeFolder` | `gdFolderId` | 將資料夾及其內容移至垃圾桶（預設）或永久刪除 |

### 刪除預設為可還原

`removeFile` 與 `removeFolder` 會將項目移至 **Google Drive 垃圾桶**，在那裡可以還原。對於可能依排程執行或位於 [Loop](./loop-node.md) 內的操作而言，這是安全的預設值。

啟用 **Delete permanently** 會銷毀項目且無法還原。對 `removeFolder` 而言，這也會銷毀資料夾內的所有內容。

本節點也會檢查目標類型：`removeFile` 會拒絕資料夾，而 `removeFolder` 會拒絕檔案，因此打錯的 ID 不會在無聲無息中刪除錯誤的項目。

### updateFile 不會動到留白的欄位

`updateFile` 是更新，而非取代。你可以任意組合填入內容、新名稱與新資料夾 —— 凡是你留空的欄位都不會被更動。三者之中至少要填寫一項。
## 憑證設定

Google Drive 採用 **OAuth2「Bring Your Own App」** 模式。您需提供自己的 Google Cloud OAuth2 憑證。

> **此憑證會授予完整的 Drive 存取權限。** Heym 請求 `https://www.googleapis.com/auth/drive` 範圍，因為該節點會操作您已擁有的檔案。較窄的 `drive.file` 範圍僅能看到應用程式本身建立的檔案，這將導致無法列出、更新及刪除您現有的檔案。將此憑證分享給團隊之前，請參閱[憑證分享](../reference/credentials-sharing.md)。

**後端設定：** 將 Heym 後端的 **`FRONTEND_URL`** 設為應用程式的公開 URL。OAuth 重新導向 URI 一律為 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — 它僅由此設定推導而來，而非來自請求標頭。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 啟用 **Google Drive API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下，確切加入 `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`。
4. 複製 **Client ID** 與 **Client Secret**。
5. 在 Heym 中：**Dashboard → Credentials → New → Google Drive (OAuth2)**，貼上這兩個值，然後點擊 **Connect** 並在彈出視窗中核准存取。

## 輸出

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

對於資料夾與 Google 原生檔案，`size_bytes` 為 `null`，因為它們不會回報大小。

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

對於一般檔案，`exported` 為 `false`，且 `export_format` 為 `null`。

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

`id` 是新的 **Heym Drive** 檔案 ID，與 `google_file_id` 不同。

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

`deleted` 為 `"trashed"` 或 `"permanent"`。

## 範例：將 Drive 資料夾備份至 Heym Drive

1. **[Cron](./cron-node.md)** — 每日執行。
2. **Google Drive** — 對來源資料夾執行 `listFolderFiles`，若您只想要 PDF，將 `gdQuery` 設為 `mimeType='application/pdf'`。
3. **[Loop](./loop-node.md)** — 迭代 `$ListReports.files`。
4. **Google Drive** — 執行 `syncToHeymDrive`，將 `gdFileId` 設為 `$BackupLoop.item.id`，並將 `gdFilename` 設為 `$BackupLoop.item.name`。
5. **[Slack](./slack-node.md)** — 發布已備份內容的摘要。

## 備註

- 每個文字欄位皆接受 `$` 表達式，因此 ID 與檔案名稱可來自先前的節點。
- 支援共用雲端硬碟 — 該節點會在每個請求上設定 `supportsAllDrives`。
- 下載會依據後端的 `FILE_MAX_SIZE_MB` 設定進行大小檢查。
- 將此節點附加至 [Agent](./agent-node.md) 節點的工具輸入，並使用任何欄位上的機器人圖示，讓 Agent 在執行階段填入該欄位。

## 另請參閱

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
