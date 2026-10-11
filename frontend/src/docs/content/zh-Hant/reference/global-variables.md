# 全域變數

**全域變數儲存區（Global Variable Store）** 用於保存具持久性、以使用者為範圍的鍵值資料，這些資料可跨 Workflow 執行持續存在。可用於組態設定、功能旗標、計數器，或多個 Workflow 需要共用的狀態。

> **請勿在此儲存機密資訊。** 全域變數並非機密保存庫：其值以未加密形式儲存，且會完整回傳給任何您分享的對象，協作者亦可編輯這些變數。API 金鑰、密碼與 Token 應存放於 [Credentials](./credentials.md)，該功能會將其加密保存，且絕不會將機密回傳至用戶端。

## 本機變數與全域變數

| 儲存區 | 語法 | 範圍 | 持久性 |
|-------|--------|-------|-------------|
| **Workflow 本機** | `$vars.variableName` | 僅限當前執行 | 儲存於記憶體，執行結束後遺失 |
| **全域** | `$global.variableName` | 該使用者的所有 Workflow | 持久化於資料庫 |

## 建立全域變數

1. **從 Variables 分頁** – [Variables 分頁](../tabs/global-variables-tab.md)：直接建立、編輯與刪除變數。
2. **從 Variable 節點** – 在節點屬性中啟用 **Store in Global Variable Store**（`isGlobal: true`）。當 Workflow 執行時，該變數會寫入儲存區。

## 於運算式中使用

使用 `$global.variableName` 存取全域變數：

```
$global.environment
$global.settings.baseUrl
$global.userId
```

使用方式與 Workflow 本機變數相同（例如 `.upper()`、`.length`、陣列使用 `.add()`）。

## 值類型

支援的類型：`string`、`number`、`boolean`、`array`、`object`。建立或編輯變數時請選擇類型。

## 分享全域變數

您可以將全域變數分享給其他使用者或 [Teams](./teams.md)，讓他們能在自己的 Workflow 中使用。

- **分享給使用者** – 點擊所擁有變數旁的分享圖示，輸入收件者的電子郵件，然後點擊 **Share**。收件者將在其 Global Variables 清單中看到該變數，並附有 **Shared** 標記與「Shared by &lt;您的電子郵件&gt;」標籤。
- **分享給團隊** – 在分享對話框中選擇團隊，然後點擊 **Add**。所有團隊成員皆可取得存取權。
- **可編輯存取權** – 收件者可以檢視、編輯，並在其 Workflow 中透過 `$global.variableName` 參照該分享變數。僅擁有者可分享、取消分享或刪除該變數。
- **名稱衝突** – 若收件者已有同名變數，其自身變數將優先於分享的變數。
- **取消分享** – 開啟該變數的分享對話框，點擊您欲移除存取權之使用者旁的 **×** 按鈕。

## Chat 整合

[Chat](../tabs/chat-tab.md) 助理可使用全域變數。LLM 在回答問題或生成內容時可參照這些變數。

## 相關內容

- [Variables 分頁](../tabs/global-variables-tab.md) – 於 UI 中管理全域變數
- [Variable 節點](../nodes/variable-node.md) – 使用 `isGlobal` 設定變數
- [Expression DSL](./expression-dsl.md) – `$global` 語法
