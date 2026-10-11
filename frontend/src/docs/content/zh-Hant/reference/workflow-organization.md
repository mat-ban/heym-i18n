# Workflow 組織

Heym 讓您以資料夾組織 Workflow、建立子資料夾，並排程刪除 Workflow。UI 總覽請參閱 [Workflows 分頁](../tabs/workflows-tab.md)。

## 資料夾與子資料夾

資料夾構成樹狀結構。每個資料夾具有：

- **Name** – 顯示名稱
- **Parent** – `parent_id` 連結至另一個資料夾；`null` 表示根層級
- **Workflows** – Workflow 可透過 `folder_id` 移至資料夾中

### API

| Endpoint | 用途 |
|----------|---------|
| `GET /folders` | 僅根層級資料夾 |
| `GET /folders/tree` | 完整樹狀結構（子資料夾 + Workflow） |
| `GET /folders/{id}` | 單一資料夾及其內容 |
| `POST /folders` | 建立資料夾（`parent_id` 為選填） |
| `PUT /folders/{id}` | 更新名稱或 `parent_id` |
| `DELETE /folders/{id}` | 刪除資料夾（串聯刪除） |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | 將 Workflow 移至資料夾 |
| `DELETE /folders/workflows/{workflow_id}/folder` | 將 Workflow 從資料夾移除 |
| `GET /folders/{id}/export` | 將資料夾及所有子資料夾下載為 ZIP |

### 樹狀結構

樹狀結構回應中，每個資料夾包含 `children` 與 `workflows`。共享的 Workflow 可透過 `WorkflowShare.folder_id` 出現在資料夾中。

## 共享 Workflow

在 Workflow 編輯器中開啟 **Share**，即可透過電子郵件邀請使用者，或與[團隊](./teams.md)共享。每個邀請與每個團隊共享都帶有一項權限：

| 權限 | 協作者可執行的操作 |
|------------|------------------------------|
| **Read** | 開啟 Workflow、檢視內容、查看執行歷史記錄，並執行該 Workflow。編輯器以唯讀模式開啟：Save 已停用，且無法變更畫布。 |
| **Write** | 包含 Read 允許的所有操作，另可編輯畫布、設定、分析文件及 Agent 記憶。 |

權限會顯示在 Share 對話方塊中每個項目的旁邊，且可隨時從該下拉式選單變更，無須移除後重新加入共享。當使用者透過多個路徑（直接共享及一個或多個團隊）觸及某個 Workflow 時，以**最高**權限為準。在權限機制推出前即存在的共享為 **Write**，而未帶 `permission` 的 API 用戶端同樣取得 **Write**。

僅限擁有者的操作一律不受權限影響：刪除 Workflow、還原或清除版本、清除歷史記錄、管理共享，以及下方的[僅限擁有者的設定](#owner-only-settings)，即使對 **Write** 協作者而言仍專屬於擁有者。**Read** 協作者若透過 API（`PUT /api/workflows/{id}`、分析備註、Agent 記憶、清除快取）或透過 AI Assistant 送出編輯，將收到 `403` 及 `You have read-only access to this workflow`。

共享 Workflow 會授予畫布、執行歷史記錄及分析文件的存取權。它**不會**自動共享：

- Workflow 中節點所參照的 **Credentials**
- 由 [Execute](../nodes/execute-node.md) 節點或 Agent 呼叫的**子 Workflow**

接收者需要另行共享這些 Credentials 與子 Workflow（相同的使用者或團隊）。請從 [Credentials 分頁](../tabs/credentials-tab.md)共享 Credentials；請參閱 [Credentials 共享](./credentials-sharing.md)。請從各子 Workflow 自身的編輯器共享對話方塊進行共享。

### 僅限擁有者的設定

共享後，整個 **Run with cURL** 設定仍專屬於擁有者。協作者仍可開啟對話方塊並複製產生的指令，但控制項為唯讀。

非擁有者變更下列任一項時，將以 `403` 拒絕：

- **Authentication**（`auth_type`）與 **Header Key**（`auth_header_key`）
- **Request Body** 模式（`webhook_body_mode`）與 **Request Method**（`http_method`）
- **Response Cache**（`cache_ttl_seconds`）與 **Rate Limit**（`rate_limit_requests`、`rate_limit_window_seconds`）
- **SSE Streaming**（`sse_enabled`、`sse_node_config`）

**Header Value**（`auth_header_value`）的行為不同：它對協作者完全隱藏，且協作者的寫入會被忽略而非遭到拒絕。編輯器會將該欄位呈現為遮蔽狀態，因此在此處回應 `403` 會破壞一般儲存作業，而非做為攻擊的訊號。

Authentication 是此區塊僅限擁有者的原因：`Anonymous` 允許未經驗證的呼叫者執行 Workflow，而在沒有已登入呼叫者的情況下執行時，Credentials 與全域變數會以**擁有者**（而非呼叫者）的身分解析。此區塊的其餘部分則是已發佈的請求契約及擁有者的成本控制，因此隨之移動。

Workflow 層級 **Properties** 面板中的 **On error, run workflow**（`error_workflow_id`）基於相同原因僅限擁有者：該 [error workflow](./features.md#error-workflow) 會以失敗執行的 Credentials 與全域變數執行，而對於觸發及匿名執行而言，這些屬於擁有者。協作者會看到該設定為唯讀，且非擁有者新增、取代或清除它時，將以 `403` 拒絕。

編輯畫布、名稱及描述則不受影響。

### 執行 Token

協作者可為共享給他們的 Workflow 鑄造執行 Token。該次執行會歸屬於**鑄造該 Token 的人**，因此使用該使用者的 Credentials 與全域變數，而非擁有者的。唯有真正匿名的呼叫——`auth_type: anonymous` 且無呼叫者——才會以擁有者的情境執行。

## 排程刪除

Workflow 可排程刪除，而非立即移除。

- **欄位**：`scheduled_for_deletion`（可為 null 的 datetime）
- **行為**：設定後，Workflow 會移至 `folder_id = null`，並出現在「Scheduled for Deletion」區段中。
### API

| Endpoint | 用途 |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | 設定 `scheduled_for_deletion`，清除 `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | 清除 `scheduled_for_deletion`（還原） |

### UI

- **拖曳至垃圾桶** – 將 Workflow 拖放至「Scheduled for Deletion」區域以排程刪除
- **還原** – 從排程中移除
- **立即刪除** – 垃圾桶圖示，用於永久移除

### 清理邏輯

Cron 排程每日於 **23:59**（依設定的時區）執行。Workflow 僅在符合以下條件時才會被刪除：

- **所有起始節點**（無傳入邊的節點，不含 sticky/errorHandler）的 `active === false`

若有任何起始節點仍為啟用狀態，該 Workflow 將保留至下一次執行。

## Dashboard UI

- **資料夾列** – 新增資料夾、可遞迴展開/收合的資料夾樹狀結構。每個資料夾在其名稱下方帶有
  選填的描述，以及一個計算其所含 Workflow 數量（包含子資料夾）的徽章。
- **資料夾操作** – 新增子資料夾、重新命名、變更圖示、以 ZIP 下載及刪除，皆內嵌於
  每個資料夾列上；右鍵內容選單提供相同的操作組合，手機版則顯示單一選單按鈕。
- **主區域** – 根層級 Workflow（無資料夾、未排程）與 Scheduled for Deletion
- **資料夾拖放預覽** – 拖曳 Workflow 時會醒目顯示確切的資料夾或子資料夾，並
  以卡片大小的預覽顯示其完整路徑。收合的資料夾在短暫停留後會自動展開。
- **穩定的拖曳回饋** – 來源卡片使用拖曳幽靈，且作用中的拖放目標在捲動或跨越同一資料夾內的
  控制項時仍保持選取狀態。
- **目的地檢查** – 目前所在的資料夾會顯示為 **Already in Folder**，且不接受
  多餘的移動。
- **其他拖放區域** – 根層級與「Scheduled for Deletion」在可接受拖曳的 Workflow 時會醒目顯示。
- **ZIP 拖放** – 將 ZIP 檔案拖放至 Workflow 區域，即可在根層級匯入資料夾結構

## 相關內容

- [Workflows Tab](../tabs/workflows-tab.md) – 建立與管理 Workflow
- [Credentials Sharing](./credentials-sharing.md) – 與 Workflow 協作者分享 Credential
- [Teams](./teams.md) – 與團隊分享 Workflow 及 Credential
- [Core Concepts](../getting-started/core-concepts.md) – Workflow、節點與執行
- [Workflow Structure](./workflow-structure.md) – Workflow 的 JSON 格式
- [Triggers](./triggers.md) – 起始節點與進入點
