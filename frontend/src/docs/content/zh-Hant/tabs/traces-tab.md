# Traces 分頁

**Traces** 分頁顯示 LLM 執行追蹤紀錄。您可以檢視請求/回應的 Payload、時間資訊、工具呼叫，並偵錯 [Agent](../nodes/agent-node.md) 與 [LLM](../reference/node-types.md) 節點的行為，以及檢視任意時間範圍內的彙總指標（呼叫次數、Token 數、成本、延遲、錯誤率）。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ 觀看 Traces 示範</a></p>

## 統計標頭

頁面開啟時，追蹤紀錄清單上方會顯示統計摘要，其計算是根據所選時間範圍與其他作用中的篩選條件：

- **KPI 卡片** – 總呼叫次數、總 Token 數、總成本（USD）、平均延遲、錯誤率 %
- **依模型劃分的 Token** – 各模型 Token 數量的圓餅圖
- **依模型劃分的成本** – 各模型 USD 花費的圓餅圖。沒有定價的模型會顯示「Configure pricing」連結，指向 [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **隨時間變化的呼叫次數** – 每個時間桶（5 分鐘 / 1 小時 / 6 小時 / 1 天，依範圍自動選擇）成功與失敗呼叫的堆疊區域圖
- **未定價模型提示** – 當部分受追蹤的模型沒有定價資料列時，會顯示於圖表下方，並連結至 LLM Cost Table

## 時間範圍

篩選列頂端的單一 **Time range** 選擇器同時驅動統計標頭與追蹤紀錄清單。選項包括：Last 1 hour、Last 24 hours、Last 7 days（預設）、Last 30 days、All time。變更範圍會重設分頁，並同時重新載入圖表與清單。

## 追蹤紀錄清單

- 所選時間範圍內近期追蹤紀錄的分頁清單
- 每筆追蹤紀錄顯示：Workflow、節點、認證、時間戳記、持續時間
- 點擊追蹤紀錄以開啟詳細檢視
- 在詳細資料對話框內使用 **Prev / Next** 即可在追蹤紀錄之間移動，無需關閉對話框

## 篩選

- **Time range** – 1h / 24h / 7d / 30d / All；同時篩選圖表與清單
- **Credential** – 依所使用的認證（API 金鑰）篩選
- **Source** – 依 Workflow 或執行來源篩選
- **Search** – 依模型、Workflow、認證或節點標籤搜尋
- **Refresh** – 重新載入目前頁面的追蹤紀錄

## 追蹤紀錄詳細資料

當您開啟一筆追蹤紀錄時：

- **Steps** – 由上而下的時間軸，將追蹤紀錄視為有序鏈條來閱讀：System → User → Assistant → Tool → Answer。每個步驟皆可摺疊；展開後會顯示可讀的詳細資料（訊息文字，或工具的引數與結果），接著是該步驟的 JSON。每個事件類型中的 JSON 內容——包括 MCP 呼叫與 JSON-RPC Payload——預設會以可展開的樹狀結構開啟，並展開第一層。使用 **Tree / Raw** 在格式化結構與原始文字之間切換。格式錯誤的 JSON 會以純文字顯示。工具步驟會顯示其持續時間，並在適用時顯示 MCP/Skill 徽章，以及當工具呼叫狀態設定時顯示 pending / timeout / cancelled 徽章。Answer 步驟可顯示彙總的 `tool_metrics` 徽章（依狀態劃分的呼叫次數與工具總持續時間）。當追蹤紀錄記錄每次模型呼叫時（例如 Dashboard Chat 訊息與路由的 Agent 會這麼做），**LLM** 步驟會位於其所請求的工具之前，而 **Duration Breakdown** 會將每次模型呼叫、工具與路由決策全部攤在同一條時間軸上。一則 Dashboard Chat 訊息即為單一追蹤紀錄，無論它經過多少輪工具呼叫。沒有訊息鏈的追蹤紀錄（例如圖片生成）會顯示精簡的 Request → Response 時間軸。
- **Request** – 傳送給 LLM 的完整請求 Payload，提供 **Tree / Raw** JSON 檢視
- **Response** – 模型回應，包含工具呼叫（若有），提供 **Tree / Raw** JSON 檢視
- **Tool metrics** – 當回應中出現時，顯示工具呼叫次數的精簡摘要（`success` / `error` / `pending` / `timeout` / `cancelled`）與工具總持續時間
- **Timing breakdown** – 用於效能分析的 `llm_ms`、`tools_ms`、`mcp_list_ms`
- **Tool calls** – 工具名稱、引數、結果、狀態與經過時間
- **Skills included** – 請求中傳遞給模型的 Skills
- **Go to Workflow** – 從追蹤紀錄詳細資料對話框直接跳至相關的 Workflow

## 複製與匯出

- 將請求或回應 JSON 複製到剪貼簿；複製時一律使用完整的原始 Payload，無論目前檢視為何
- 可用於偵錯或與支援團隊分享

## 維護

- **Clear All** – 經確認後刪除所有已儲存的追蹤紀錄
- 分頁控制項會顯示目前可見範圍（例如 `1-25 of 240`）

## 相關內容

- [Why Heym](../getting-started/why-heym.md) – 涵蓋 Agent 生命週期的 LLM 可觀測性
- [Agent Node](../nodes/agent-node.md) – 具備工具呼叫的 Agent 節點
- [Node Types](../reference/node-types.md) – LLM 與 Agent 節點
- [Credentials Tab](./credentials-tab.md) – 追蹤紀錄中使用的認證
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – 針對 Workflow、節點與 Agent 工具 span 的選用 OTel 匯出
- [DataTable Tab](./datatable-tab.md) – 裝載成本圖表所使用的 LLM Cost Table
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard 介面的精簡頁面指南
