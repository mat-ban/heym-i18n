# 執行 Token

執行 Token 是具範圍限制的 JWT，用於授予對單一 Workflow 的 execute 與 stream 端點的存取權限。它們讓你能從外部系統呼叫 Workflow，而無需暴露你長期有效的使用者 Session Token。

## 為何使用執行 Token

當 Workflow 的驗證設定為 **JWT** 時，該端點通常需要有效的使用者 Session。執行 Token 讓你能夠：

- 將可呼叫的 Token 分享給外部指令碼、CI 流程或整合服務，而無需分享你的帳號憑證。
- 限制暴露範圍 — 一個 Token 僅對一個特定 Workflow 有效。
- 即時撤銷存取權限，而無需變更密碼或輪替 Session Token。
- 在短期 Token（數分鐘或數小時）與長期 Token（最長 10 年）之間選擇。

## 建立 Token

在編輯器中開啟 **Run with cURL** 對話框（右上角工具列）。當 Workflow 驗證設定為 **JWT Token** 時，對話框會顯示 Token 管理器：

1. 選擇 **Short-lived** 或 **Long-lived (10yr)**。
2. 若為短期 Token，請輸入持續時間（秒）（最小值為 60）。
3. 點擊 **+ New Token**。

Token 會立即建立、加入清單，並自動選取，使 cURL 指令更新為包含該 Token。

## Token 清單

每個 Token 列顯示：

| 欄位 | 說明 |
|--------|-------------|
| Created | 建立時間戳記 |
| Status | **Expires:** 日期、**Expired** 或 **Revoked** |
| 眼睛圖示 | 切換 Token 值的可見性 |
| 撤銷按鈕 | 將 Token 標記為已撤銷（不可逆） |

點擊任何有效（未過期、未撤銷）的列以選取它。選取的 Token 會嵌入 cURL 指令預覽中。

已過期與已撤銷的 Token 仍會顯示於清單中，但無法選取。

## 使用 Token

從清單中複製 Token 值（點擊眼睛圖示以顯示），並將其作為 `Bearer` Token 包含在內：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

當你在對話框中選取 Token 後使用 **Copy cURL**，該 Token 已嵌入指令中 — 無需手動替換。

## Token 範圍

每個 Token 帶有以下 JWT 宣告：

| 宣告 | 值 |
|-------|-------|
| `sub` | Token 建立者的使用者 ID |
| `wid` | Workflow UUID — 該 Token 對任何其他 Workflow 都會被拒絕 |
| `scope` | `workflow:execute` — 用以區別於使用者 Session Token |
| `jti` | 用於撤銷查詢的唯一 Token ID |
| `exp` | 到期時間戳記 |

後端會在每次請求時檢查所有這些項目：簽章有效性、到期時間、`wid` 是否相符，以及 `jti` 是否尚未被撤銷。

## 撤銷

點擊 Token 旁的撤銷（圓圈斜線）按鈕以撤銷它。撤銷會立即生效 — 後續使用該 Token 的請求會回傳 `401`。該 Token 列仍會顯示於清單中，並標示 **Revoked**。

撤銷無法復原。若你需要恢復存取權限，請建立新的 Token。

## API

Token 管理端點使用你的常規 Session 進行驗證。

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | 建立 Token |
| `GET` | `/api/workflows/{id}/execution-tokens` | 列出你為此 Workflow 建立的 Token |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | 撤銷 Token |

**建立請求主體：**

```json
{ "ttl_seconds": 900 }
```

**建立回應：**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` 欄位僅在建立時回傳一次。請立即儲存；後續的 `GET` 請求會回傳相同的列，但你也可以隨時在 cURL 對話框中顯示它。

## 可見性範圍

每位使用者僅能看到自己建立的 Token。有權存取共用 Workflow 的團隊成員無法看到彼此的 Token。

## 相關內容

- [Webhooks](./webhooks.md) — HTTP Trigger 端點與 cURL 對話框
- [Security](./security.md) — Session 管理與驗證概觀
- [SSE Streaming](./sse-streaming.md) — 搭配串流端點使用執行 Token
