# 檔案上傳 Trigger

**檔案上傳 Trigger** 節點是工作流程的零輸入進入點，適用於需要**大型檔案**（音訊、視訊、封存檔）且無法以 base64 內嵌於 JSON 請求中的情境。呼叫工作流程時會回傳一個預先填入的單次使用 `curl` 上傳連結；將檔案上傳至該連結後，即會啟動執行並附帶該檔案。

當呼叫方——包括在沙箱中執行的 Claude 或 ChatGPT 等 AI Agent——必須將 20 MB 的語音錄音或 75 MB 的視訊交給 Heym 工作流程時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.file.{id,name,mime,size,download_url}`、`$nodeLabel.uploaded_at` |

## 運作方式

此節點分兩個階段執行：

1. **簽發（Mint）。** 當工作流程透過 HTTP（`POST /api/workflows/{id}/execute`）、作為 MCP 工具，或透過畫布的 **Run Workflow** 按鈕被呼叫時，該次執行**不會**執行主體。取而代之的是，它會簽發一個單次使用的上傳插槽並回傳：

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **上傳 + 執行。** 呼叫方以其檔案執行 `curl`。上傳 Endpoint 會驗證該插槽、儲存檔案、**同步**執行工作流程，並於上傳回應中回傳工作流程輸出。該連結為**單次使用**——第二次上傳會回傳 `409`。

在畫布上，**Run Workflow** 會在除錯面板中顯示簽發的 `curl`，並附有複製按鈕。

## 參數

| 參數 | 類型 | 預設值 | 說明 |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | 上傳連結保持有效的時間（1–10080 分鐘 / 最多 7 天）。 |
| `maxSizeMb` | number | `100` | 可接受的檔案大小上限。硬性上限為 **100 MB**。 |
| `allowedTypes` | string | （空） | 選用的逗號分隔 MIME/副檔名允許清單，例如 `audio/*, .wav`。留空則允許任何類型。 |

## 輸出欄位

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.file.id` | 已儲存檔案的 UUID（一個 Drive 檔案）。 |
| `$nodeLabel.file.name` | 原始檔案名稱。 |
| `$nodeLabel.file.mime` | 偵測到的內容類型。 |
| `$nodeLabel.file.size` | 大小（以位元組為單位）。 |
| `$nodeLabel.file.download_url` | 供下游節點使用的已驗證下載 URL。 |
| `$nodeLabel.uploaded_at` | 上傳的 ISO 時間戳記。 |

## 範例

一個轉錄工作流程：

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. 一個 Agent 呼叫該工作流程的 MCP 工具並收到 `curl`。
2. 該 Agent 以其沙箱中的錄音執行 `curl`。
3. 上傳會執行工作流程，且 `curl` 回應中包含轉錄摘要。

## 安全性

- 上傳 URL 內嵌一個高熵 Token——該 Token **即**權限本身，因此沙箱化的 Agent 不需要 Heym 認證即可上傳。伺服器端僅儲存該 Token 的雜湊值。
- 簽發需要正常的工作流程驗證，因此僅有經授權的呼叫方可以建立上傳連結。
- 每一次簽發與每一次上傳嘗試（無論接受或拒絕——過期、重放、過大、不允許的類型、未知 Token）都會寫入僅可附加的稽核軌跡。
- 上傳強制為單次使用、受 TTL 限制且有大小上限；過大的上傳會被拒絕。

## 備註

- 通用的 HTTP、MCP 與畫布呼叫通道仍僅限 JSON；此節點是接受 multipart 檔案上傳的支援方式。
- 上傳的檔案會儲存為一般的 Drive 檔案，因此任何接受檔案參照的下游節點（轉錄、傳送電子郵件附件等）皆可取用 `$nodeLabel.file`。
