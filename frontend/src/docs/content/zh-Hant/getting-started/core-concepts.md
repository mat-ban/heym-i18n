# 核心概念

## Workflow

Workflow 是由**邊（edge）**連接的[**節點**](../reference/node-types.md)所構成的有向圖。您可以在 [Workflows](../tabs/workflows-tab.md) 分頁中管理 Workflow，並透過[資料夾](../reference/workflow-organization.md)進行組織。執行流程從 [Trigger 節點](../reference/triggers.md)（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）開始，經過處理節點，最終流向[輸出](../nodes/output-node.md)節點。JSON 格式請參閱 [Workflow 結構](../reference/workflow-structure.md)。您可以將 Workflow 儲存並分享為[範本](../tabs/templates-tab.md)，以便在不同專案間重複使用。Workflow 也可以從 [Board](../tabs/board-tab.md) 執行，看板卡片會以卡片的完整上下文來觸發該欄的 Workflow 鏈。

## 節點

每個節點包含：

- **類型** – 決定行為（例如 `llm`、`condition`、`http`）
- **資料** – 設定內容（模型、prompt、URL 等）
- **輸入/輸出** – 用於連接其他節點的連接點

完整清單請參閱[節點類型](../reference/node-types.md)。

## 邊

邊會將來源節點的輸出連接點連接到目標節點的輸入連接點。執行期間，資料會沿著邊流動。

## 執行流程

1. **Trigger** – Input、Cron、Telegram Trigger、Discord Trigger、IMAP Trigger 或 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 節點啟動執行（請參閱 [Trigger](../reference/triggers.md)）
2. **下游** – 每個節點會接收來自相連上游節點的輸出；[平行執行](../reference/parallel-execution.md)會同時執行獨立的節點
3. **表達式** – 節點透過 `$nodeLabel.field` 參照上游資料。請參閱[表達式 DSL](../reference/expression-dsl.md)。
4. **輸出** – [輸出](../nodes/output-node.md)節點產生最終結果

## 表達式參照

使用 `$input` 取得 Input 節點的資料，使用 `$nodeLabel.field` 取得任何上游節點的資料。例如：`$llm.text` 會參照標籤為「llm」之節點的 `text` 欄位。完整語法請參閱[表達式 DSL](../reference/expression-dsl.md)。編輯表達式時，可使用[表達式評估對話框](../reference/expression-evaluation-dialog.md)取得更大的編輯器，並即時預覽後端結果。

## 相關內容

- [快速開始](./quick-start.md) – 建立您的第一個 Workflow
- [畫布功能](../reference/canvas-features.md) – 資料釘選、執行日誌、啟用/停用、擷取為子 Workflow
- [AI 助理](../reference/ai-assistant.md) – 以自然語言建立 Workflow
- [節點類型](../reference/node-types.md) – 所有可用的節點
- [表達式 DSL](../reference/expression-dsl.md) – 在表達式中參照資料
- [表達式評估對話框](../reference/expression-evaluation-dialog.md) – 可展開的編輯器，附即時後端預覽
- [Workflows 分頁](../tabs/workflows-tab.md) – 管理 Workflow 與資料夾
- [Workflow 組織](../reference/workflow-organization.md) – 資料夾與排程刪除
- [Trigger](../reference/triggers.md) – Workflow 的進入點
- [Webhook](../reference/webhooks.md) – HTTP Webhook Trigger（TTL、快取、速率限制）
- [平行執行](../reference/parallel-execution.md) – 節點如何平行執行
