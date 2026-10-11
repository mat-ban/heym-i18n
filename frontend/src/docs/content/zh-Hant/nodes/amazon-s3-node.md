# Amazon S3

Amazon S3 節點會讀取和寫入 [Amazon S3](https://aws.amazon.com/s3/) 中的物件。

## 支援的操作

- `Create Bucket`：在憑證區域中建立 bucket。
- `Delete Bucket`：刪除空的 bucket。
- `List Buckets`：列出憑證可見的 bucket。
- `Create Folder`：建立空資料夾標記（以 `/` 結尾的零位元組 key）。
- `Delete Folder`：刪除資料夾前綴下的所有物件（包含巢狀 key）。
- `Get All in Folder`：列出資料夾前綴下的所有物件中繼資料（伺服器端分頁）。
- `Upload Object`：將文字 payload 寫入 bucket/key。
- `Get Object`：下載物件並回傳解碼後的文字或 base64 內容。
- `Copy Object`：將物件複製到另一個 key 或 bucket。
- `List Objects`：列出前綴下的物件中繼資料（單一頁面，最多 1000 個 key；支援 continuation token）。
- `Delete Object`：依 key 刪除單一物件。

## 憑證設定

在 Credentials 分頁中建立 `Amazon S3` 憑證，並填入：

- Access Key ID
- Secret Access Key
- Region
- 選用的 Session Token（用於臨時 AWS STS 憑證）

## 常用欄位

- `Bucket`：目標 bucket 名稱（複製操作的目標 bucket）。
- `Object Key`：類似路徑的物件 key，例如 `reports/daily.json`。
- `Folder Path`：資料夾操作的前綴（例如 `docs/archive`）。
- `Source Bucket`：複製操作的選用來源 bucket；預設為目標 bucket。
- `Source Object Key`：複製操作的來源 key。
- `Prefix`：用於列表操作以限定結果範圍。
- `Continuation Token`：來自先前列表回應的選用 token，用於取得下一頁。
- `Max Keys`：List Objects 的頁面大小（1–1000）。
- `Include Binary`：在 Get Object 上啟用時，回傳 `body_base64` 而非 `body_text`。
- `Body`：要上傳的文字內容。
- `Content Type`：上傳物件的選用 MIME 類型。

## 輸出範例

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## 備註

- `Upload Object` 目前僅上傳 UTF-8 文字內容。
- `Get Object` 可透過啟用 binary 選項，為二進位檔案回傳 base64。
- `Create Bucket` 使用憑證區域，並需要 `s3:CreateBucket`。
- `Delete Bucket` 要求 bucket 為空，並需要 `s3:DeleteBucket`。
- `List Buckets` 需要 `s3:ListAllMyBuckets`。
- `Create Folder` 會上傳零位元組的標記物件；S3 沒有原生目錄類型。
- `Delete Folder` 會移除所有 key 以資料夾前綴開頭的物件；請謹慎使用。
- `Get All in Folder` 會自動透過前綴分頁，直到回傳所有物件。
- `List Objects` 回傳單一頁面（最多 1000 個 key）。當 `truncated` 為 true 時，請將 `next_continuation_token` 傳入下一次呼叫的 Continuation Token 欄位。
- `Copy Object` 需要來源的 `s3:GetObject` 以及目標的 `s3:PutObject`。

## 相關資訊

- [Node Types](../reference/node-types.md) – 所有節點類型總覽
- [Credentials](../reference/credentials.md) – 憑證類型與使用方式
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3 憑證設定
