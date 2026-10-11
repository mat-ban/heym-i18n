# Heym

**Heym** 節點會讀取 Heym 自身的資料：你能觸及的 Workflow、單一 Workflow 的結構，以及其執行歷史。這正是你用來建構 meta-workflow 的方式——執行個體清冊、執行摘要，以及關於 Heym 本身的健康狀態報告。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 操作 | `listWorkflows`、`getWorkflow`、`getExecutionHistory` |
| Credential | 不需要 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `heymOperation` | Select | 要執行哪一項讀取 |
| `heymWorkflowId` | UUID | 目標 Workflow。`getWorkflow` 與 `getExecutionHistory` 必填。支援 Expression。 |
| `heymLimit` | String | 要回傳的最大列數。**留空或輸入 `0` 即回傳全部**——這是預設值。支援 Expression。 |
| `heymStatus` | String | `getExecutionHistory` 的選用狀態篩選條件。支援 Expression。 |
| `heymSinceDays` | String | `getExecutionHistory` 的選用回溯天數。支援 Expression。 |

Workflow 選擇器是一個可搜尋的下拉式選單，列出你能觸及的每一個 Workflow。

## 存取範圍

結果的範圍以**此節點所屬 Workflow 的擁有者**為界——而非以啟動該次執行的人為界。可見的集合為：

- 擁有者所擁有的 Workflow，
- 直接分享給擁有者的 Workflow，
- 分享給擁有者所屬團隊的 Workflow。

以擁有者為範圍，正是讓此節點的行為在無論執行是手動啟動、由 cron 啟動、從入口網站啟動，或由平台事件啟動時都保持一致的原因。若以啟動者為範圍，則每一次無人值守的執行都會回傳空結果。這與 Heym 已用於 Credential 與全域變數的規則相同。

你無法觸及的 Workflow 與不存在的 Workflow 會產生相同的錯誤訊息，因此此節點無法被用來探測 Workflow id。

## 操作

### List Workflows

回傳擁有者能觸及的每一個 Workflow，最近更新的排在最前面。

| Expression | 說明 |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow 摘要的陣列 |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow 名稱 |
| `$nodeLabel.workflows[0].description` | 說明，或 `null` |
| `$nodeLabel.workflows[0].active` | Workflow 是否為啟用狀態 |
| `$nodeLabel.workflows[0].folder_id` | 資料夾 UUID，或 `null` |
| `$nodeLabel.workflows[0].updated_at` | 最後一次儲存的 ISO 時間戳 |
| `$nodeLabel.workflows[0].node_count` | Workflow 包含多少個節點 |
| `$nodeLabel.total` | 套用限制**之前**的完整可觸及數量 |

`total` 刻意採用未受限的計數，因此當你限制回傳的列數時，`$inventory.total` 仍會回報真實的規模。清空 **Limit**，或將其設為 `0`，即會回傳每一個 Workflow——這是預設值。

### Get Workflow

回傳單一 Workflow 的身分與結構。

| Expression | 說明 |
|------------|-------------|
| `$nodeLabel.id`、`$nodeLabel.name`、`$nodeLabel.description` | Workflow 身分 |
| `$nodeLabel.active`、`$nodeLabel.folder_id`、`$nodeLabel.updated_at` | Workflow 中繼資料 |
| `$nodeLabel.node_count` | 節點數量 |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }` 的陣列 |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }` 的陣列 |

`data` 是**完整的節點設定**——每一個欄位都與儲存時一模一樣。這正是讓稽核得以實現的關鍵：如果節點拒絕顯示某個欄位，你就無法掃描 Workflow 找出有人貼進欄位裡的 API key。

這並未授予呼叫者原本沒有的任何觸及範圍。此節點的範圍以擁有者本來就能在編輯器中開啟的 Workflow 為界，而儲存的 Credential 機密仍然不在這裡：節點資料只保留 Credential 的 **id**，機密本身則加密存放在 credentials 資料表中。

### 掃描硬編碼的機密

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

將 `$detail.nodes` 交給 agent，並請它標記任何看起來像有效金鑰或 Token 的 `data` 值。值得留意的欄位是自由文字欄位——HTTP 節點上的 `curl`、LLM 與 Agent 節點上的 `userMessage` 與 `systemInstruction`，以及 Python 工具主體——因為 Credential id 是無害的 UUID，但貼上的 `sk-…` 可不是。
### 取得執行歷史記錄

傳回單一 Workflow 的執行歷史記錄項目，最新的排在最前面。

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.executions` | 歷史記錄項目的陣列 |
| `$nodeLabel.executions[0].id` | 執行 UUID |
| `$nodeLabel.executions[0].status` | `success`、`error` 等 |
| `$nodeLabel.executions[0].started_at` | ISO 時間戳記 |
| `$nodeLabel.executions[0].execution_time_ms` | 實際經過時間 |
| `$nodeLabel.executions[0].trigger_source` | 啟動該次執行的來源，例如 `cron` 或 `heym_event` |
| `$nodeLabel.executions[0].recovered` | 該次執行是否在當機後被復原 |
| `$nodeLabel.executions[0].inputs` | 該次執行所接收的內容——Trigger 的 Payload 或呼叫方的輸入 |
| `$nodeLabel.executions[0].outputs` | 該次執行的 Workflow 輸出 |
| `$nodeLabel.workflow_id`、`$nodeLabel.workflow_name` | 此歷史記錄所屬的 Workflow |
| `$nodeLabel.total` | 在限制**之前**符合條件的執行總數 |
| `$nodeLabel.by_status` | 依狀態分類的計數，例如 `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | 時間範圍的起點，若為完整歷史記錄則為 `null` |

歷史記錄項目同時帶有 `inputs` 與 `outputs`——該次執行接收了什麼、回應了什麼——但絕不包含 `node_results`：逐節點的追蹤記錄是資料表中最大的欄位，會讓下游所有內容相形見絀。當你需要完整追蹤記錄時，請透過 API 取得單一執行。

`total` 與 `by_status` 一律描述**整個**符合條件的歷史記錄，即使 **Limit** 限制了傳回的項目數量——因此你可以取出最近五次執行，同時仍能回報準確的失敗次數。

將 **Since (days)** 留空以涵蓋所有內容，**Status filter** 留空以包含所有狀態，**Limit** 留空或設為 `0` 以傳回每一筆項目。

## 範例 Workflow

**每日執行個體摘要**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` 標記為 `inventory`
- **Loop** 逐一處理 `$inventory.workflows`
- **Heym** `getExecutionHistory`，將 `heymWorkflowId` 設為迴圈項目的 `id`、`heymSinceDays` 設為 `1`、`heymLimit` 設為 `5`
- **LLM** 將收集到的執行與狀態計數轉換為易讀的摘要

## 備註

- 不需要 Credential；此節點讀取的是 Heym 執行時所使用的同一個資料庫。
- **Limit** 是兩個清單操作共用的同一個欄位，且在兩者中意義相同：留空或設為 `0` 會傳回所有內容。
- 此節點接受一般輸入，並可掛載至 Agent 節點作為工具，因此 Agent 可以回答關於你的 Heym 執行個體的問題——或對其進行稽核。
- `getWorkflow` 的 Payload 會隨 Workflow 成長：冗長的 Prompt 與 Python 工具內容全都會在 `data` 內傳輸。
- 將其與 [Heym Trigger](./heym-trigger-node.md) 搭配使用，即可在 Workflow 變更發生時立即反應，而不必依排程輪詢。

## 相關內容

- [Heym Trigger](./heym-trigger-node.md) – 從平台事件啟動 Workflow
- [Execute](./execute-node.md) – 執行另一個 Workflow，而非描述它
- [Loop](./loop-node.md) – 逐一處理傳回的 Workflow 清單
