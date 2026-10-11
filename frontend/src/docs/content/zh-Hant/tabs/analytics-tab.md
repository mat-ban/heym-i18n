# Analytics 分頁

**Analytics** 分頁會顯示您 Workflow 的執行指標與趨勢。您可透過此處監控使用量、效能，並找出瓶頸。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ 觀看 Analytics 示範</a></p>

## 摘要統計

- **Total executions** – 所選期間內 Workflow 執行的次數
- **Success rate** – 成功執行的百分比
- **Average duration** – 平均執行時間
- **Time saved** – 預估節省的總時間：每個 Workflow 設定的每次執行節省分鐘數 × 其成功執行次數，並加總所選期間內的數值
- **Trends** – 與前一期間相比的上升／下降指標

## 時間範圍

- **24h** – 過去 24 小時
- **7d** – 過去 7 天
- **30d** – 過去 30 天
- **All** – 所有可用歷史紀錄

## Workflow 篩選

- 依特定 Workflow 篩選指標
- **All workflows** – 彙總所有 Workflow 的資料

## 表格

有兩個表格會顯示 Workflow 使用情況：**Most Used**（較寬）與 **Most Failed**。

- **Time Saved** – Most Used 會顯示每個 Workflow 的節省時間加總（每次執行節省分鐘數 × 成功執行次數）。**Not Set** 表示缺少預估值；點擊該處即可在該 Workflow 上開啟對應欄位。
- **可排序欄位** – 點擊欄位標題即可依該欄位排序。再次點擊可切換升冪／降冪。箭頭指標會顯示排序方向。
- **行動裝置標籤** – 在小螢幕上，欄位標籤會縮短（例如「Executions」→「Runs」、「Success」→「OK」、「Error」→「Err」），讓表格無需水平捲動即可完整顯示。

## 圖表

- **Execution Volume Over Time** – 各時間區間執行次數的折線圖
- **Success vs Error Rate** – 比較正常與失敗執行的區域圖
- **Average Latency Over Time** – 顯示回應時間變化的折線圖
- **拖曳選取** – 在任何圖表上點擊並拖曳，即可聚焦自訂日期範圍
- **選取模式** – 選取的範圍會重新整理摘要卡片、圖表與 Workflow 表格，而不會變更基礎預設值
- **Clear Selection** – 深入檢視完畢後，返回預設時間範圍

## 自動重新整理

- 啟用自動重新整理，即可讓指標保持更新，無需手動重新載入

## 相關內容

- [Workflows 分頁](./workflows-tab.md) – 受測量的 Workflow
- [Traces 分頁](./traces-tab.md) – 詳細的 Trace 檢視
- [Logs 分頁](./logs-tab.md) – 用於除錯的執行階段日誌
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面指南

當圖表顯示出您希望收到通知、而非持續觀察的趨勢時，請將其轉換為 [alert](./alerts-tab.md)：錯誤計數、執行持續時間、LLM 花費與執行次數，皆可設定時間範圍內的閾值。
