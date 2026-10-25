# 圖表輸出

**Chart Output** 節點是 [dashboard widget](../tabs/dashboard-tab.md) workflow 的終端節點。它會接收上游節點產生的資料列，並將其轉換為標準化的 chart payload，供 dashboard 渲染。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 0（終端） |
| 輸出 | 標準化 chart payload |

將此節點放在 dashboard-widget workflow 的**最後**。其前一個節點應產生資料列物件的陣列，例如：

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

當你只有範例／樣本資料（沒有真實來源）時，請使用 **Set** 節點搭配 `$array(dict(...), dict(...))` 來產生這些資料列——例如 `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`。請**勿**使用 `${...}` 或裸 `{...}` 物件字面值；Heym 僅以 `dict(key=value)` 建立物件。

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `chartType` | string | `pie`、`bar`、`line`、`area`、`table`、`numeric`、`gauge`、`scatter`、`proportion`、`barGauge`、`text` 或 `hitl` |
| `orientation` | string | `vertical` 或 `horizontal`（僅限 bar charts） |
| `dataPath` | string | 上游輸出中資料列陣列所在的點路徑（例如 `data` 或 `result.items`）。留空以自動偵測。 |
| `labelField` | string | 用作類別標籤的資料列鍵（pie/bar/line） |
| `valueField` | string | 用作數值的資料列鍵（pie/bar/line/numeric/gauge） |
| `series` | array | 選用的多系列定義 `[{ "name": "Sent", "field": "sent" }]`，用於 bar/line（會覆寫 `valueField`） |
| `columns` | array | 選用的欄位清單，用於 `table`（預設為第一列的鍵） |
| `statusColumn` | string | 選填的 `table` 欄位，渲染為彩色[狀態標籤](#status-chips)。必須是顯示的欄位之一。 |，使用 `linkColumn` 時還會帶有連結欄位和按鈕文字。
| `statusTones` | object | 選填對應表，將預設未涵蓋的狀態值對應至色調（`success`、`attention`、`failure`、`waiting`、`neutral`） |
| `linkColumn` | string | 選用的 `table` 欄位，其儲存格包含 URL，並顯示為在新分頁中開啟該 URL 的[連結按鈕](#link-buttons)。必須是所顯示欄位之一。 |
| `linkLabel` | string | 連結按鈕的選用文字。留空時，按鈕只顯示連結圖示。 |
| `xField` / `yField` | string | X 與 Y 數值軸的資料列鍵（scatter） |
| `min` / `max` | number | `gauge` 的數值範圍（預設 `0` / `100`） |
| `unit` | string | 選用的單位，顯示於 `numeric` 或 `gauge` 值旁 |
| `text` | string | `text` chart type 的 Markdown 訊息。留空並設定 `valueField`，以渲染從上游資料取得的動態訊息。 |
| `title` | string | 選用的 chart 標題 |
| `hitlWorkflowId` | string | 僅適用於 `hitl`。僅顯示此 Workflow 的審核。留空時，小工具會顯示所有審核。 |
| `hitlNodeId` | string | 僅適用於 `hitl`。將 `hitlWorkflowId` 縮小至單一步驟：具人工審核的 Agent，或 Slack 核准、按鈕或表單步驟。 |

## Chart types

- **bar / line / area / pie** — 由 `labelField` + `valueField` 驅動的分類圖表（或多系列 bar/line/area 使用 `series`）。`area` 是填滿的趨勢圖。
- **table** — 使用 `columns` 將原始資料列渲染為可捲動的表格。其中一欄可渲染為[狀態標籤](#status-chips)，且資料列可開啟[詳細資訊頁面](../tabs/dashboard-tab.md#detail-pages)。
- **numeric** — 來自第一列的單一 KPI 值，可搭配選用的 `unit`。
- **gauge** — 對照 `min`–`max` 範圍顯示的單一值（例如百分比）。使用 `valueField`。
- **scatter** — 由 `xField` 與 `yField` 取得的 X/Y 點，用於相關性圖。 
- **proportion** — 單一水平長條，分割為各佔比並附百分比圖例（例如語言分佈）。使用 `labelField` + `valueField`。
- **barGauge** — 每一列一個水平 gauge，具有紅→綠漸層與數值（例如可用磁碟空間）。使用 `labelField` + `valueField`，可搭配選用的 `unit` 與 `max`（預設為最大的資料列值）。
- **text** — 一段 markdown 訊息（例如狀態備註，如「Last execution at 19:47」）。將 markdown 放入 `text` 以顯示靜態訊息，或將 `text` 留空並設定 `valueField`，以渲染上游產生的字串。支援標題、粗體／斜體、[清單](../nodes/chart-output-node.md#interactive-task-lists)、連結與行內程式碼。
- **hitl** — 你待處理的人工審查的輪播。標頭顯示 `1/n pending`；左箭頭在第一張卡片時停用，右箭頭在最後一張時停用。workflow 名稱會於畫布上開啟該次執行。**Approve**、**Request changes** 與 **Reject** 會解決該項目，而 widget 標題旁的歷史圖示會於同一頁面的歷史對話框中開啟該次執行。此 chart type 會忽略上游資料列，因此 widget workflow 僅有 Chart Output 節點。每位已登入的使用者會看到其所擁有 workflow 的審查項目。 在節點屬性或小工具設定中選擇一個 **Workflow**（若有多個審核步驟，則還需選擇 **Select agent**），即可改為向所有能開啟該 Workflow 的人顯示其審核；請參閱 [HITL 小工具](../tabs/dashboard-tab.md#hitl-widgets)。

### 互動式任務清單

在靜態 `text` 欄位中使用 GitHub 風格的 markdown 任務清單語法：

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

在 [Dashboard](../tabs/dashboard-tab.md) 上，核取方塊會渲染為可點擊的控制項（相容於深色與淺色模式）。切換核取方塊會更新 widget workflow 的 `text` 欄位，並在重新整理後持續保留。

**行內編輯：** 連按兩下任務項目的標籤即可就地編輯。按 Enter 或點擊他處以儲存；按 Escape 以取消。將標籤完全清空即可從清單中移除該項目。

**任務項目中的連結：** 當標籤包含 markdown 連結（`[title](url)`）時，點擊連結會開啟 URL 而不會切換核取方塊。點擊該列的其他位置則可切換。

**僅限靜態文字：** 互動性需要 GFM 任務清單語法（`- [ ]` / `- [x]`）。沒有任務項目的純動態狀態訊息會保持唯讀。當 markdown 來自 `valueField` 時，第一次切換會將其複製到靜態 `text` 欄位，以使變更持續保留。
### 編號清單

Text 元件會以**保留明確行號**的方式渲染 markdown。在每一行前面加上你想要顯示的編號（例如 `9.`、`8.`、`7.`）。Heym 不會替你重新編號。

**為什麼要使用明確編號？** 標準 markdown 有序清單（`1.`、`2.`、`3.`）會變成 HTML `<ol>` 清單，而這種清單只會從第一個數字開始**往上遞增**計數。若寫成 `9.` / `8.` / `7.` 的清單，在一般 markdown 渲染器中會顯示為 `9`、`10`、`11`。在每一行前面加上預期的編號即可避免這個問題。

**遞減清單（例如最新在前）：** 在 workflow 迴圈中建構 markdown，並為每個項目計算顯示編號：

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

典型模式：

1. 取得或建構一個項目陣列（例如 HTTP → `body.videos`）。
2. 對該陣列進行 [Loop](./loop-node.md)；在 body 內使用 [Variable](./variable-node.md) 搭配 `.add()`，在每次迭代中附加一行編號行。
3. 在迴圈的 **done** 分支之後，對累積的陣列（或等效內容）[Set](./set-node.md) `join("\n")`，合併為單一 markdown 字串。
4. 將 **Chart Output** 的 `valueField` 指向該字串（或設定靜態 `text`）。

迴圈內的範例行表達式（label 為 `processVideos`，項目含有 `title` 與 `id`）：

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

產生的 markdown：

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

若只需要從 1 開始的簡單遞增清單，可以在每一行前面加上編號（`1.`、`2.`、`3.`），或使用迴圈搭配 `$loop.index + 1`。當你不需要編號時，請使用[項目符號清單](#interactive-task-lists)（`- item`）。

## 狀態標籤

`table` 可以將其中一欄顯示為彩色標籤（chips）。在節點屬性中將 **Status column**（或 DSL 中的 `statusColumn`）設為欄位名稱。每個值都會獲得五種色調之一，常見字詞無需設定即可自動套用：

| 色調 | 預設字詞 |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | 其他所有值 |

比對時會忽略大小寫、`_` 與 `-`，因此 `IN_PROGRESS` 與 `in-progress` 都會歸類為 `waiting`。可針對其他值新增 **Status tones**；新增的項目會覆寫該值的預設色調：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

伺服器會將每個值解析為其對應色調，因此 Heym 與 Heym Work 會顯示相同的顏色。

## 詳細資訊頁面：`$page.record`

以 `?record=<value>` 開啟的儀表板會將該值作為 `$page.record` 來執行每個小工具的 Workflow。表格資料列連結可開啟此類頁面；請參閱[詳細資訊頁面](../tabs/dashboard-tab.md#detail-pages)。在未帶記錄開啟的儀表板以及運算式對話方塊中，`$page.record` 為 `null`。標籤為 `page` 的節點優先順序高於它。

可用它來擷取該頁面所對應的那筆記錄，例如在 [HTTP](./http-node.md) 節點中：

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` 是所點擊資料列本身的值（例如 `V-1002`），而非包含欄位的物件。若要在 [DataTable](./datatable-node.md) 中尋找該筆記錄，請依該值篩選其記錄欄位：使用 `find` 操作並搭配篩選條件 `{"vendor_id": "$page.record"}`。像 `$page.record.id` 這類路徑不會解析出任何結果，因此由 AI 建立或微調的小工具會捨棄這些欄位，改為直接讀取 `$page.record`。

此值來自任何人都能修改的 URL。儀表板僅接受符合其記錄格式的值（預設為字母、數字、`-`、`_` 與 `.`），但仍請將其視為不可信的輸入：請將它傳遞至節點會自動跳脫值的欄位，例如 HTTP 查詢參數、[DataTable](./datatable-node.md) 或 ClickHouse 篩選值，切勿透過字串串接的方式與它組合出查詢文字。無論是誰開啟頁面，小工具依然會以儀表板擁有者的身分執行。


## 連結按鈕

`table` 可以把一個欄位變成開啟連結的按鈕。請在節點屬性中將 **Link column**（或 DSL 中的 `linkColumn`）設定為儲存格包含 URL 的欄位，並可選擇設定 **Link button text**（`linkLabel`）。每個儲存格都會變成一個在新分頁中開啟其 URL 的按鈕。沒有按鈕文字時，按鈕只顯示連結圖示：

| 儲存格值 | 開啟 |
| ---- | --- |
| `https://jira.example.com/browse/T-1` | 另一個網站（在新分頁中） |
| `/dashboards` | Heym 內部頁面（在新分頁中） |

只有 `http://` 和 `https://` 位址，以及以單一 `/` 開頭的路徑才會變成按鈕。其他任何值，例如 `javascript:` 或 `//host`，仍顯示為純文字，空白儲存格則不顯示任何內容。

此按鈕可與[列連結](../tabs/dashboard-tab.md#detail-pages)並存：點擊按鈕會在新分頁中開啟其連結，點擊該列的其他任何位置仍會開啟詳細資料頁面。

## 資料如何解析

1. 若有設定 `dataPath`，節點會沿著該 dot path 進入上游輸出。
2. 否則它會尋找陣列：頂層清單、`data` 陣列，或第一個值為清單的欄位。
3. 直接來自 [Data Table](./datatable-node.md) 節點的資料列（`{id, data, created_at}`）在讀取時會將各欄位展開於最上層並與 `id` 並列，因此 `labelField`、`valueField` 與 `columns` 可直接指定資料表本身的欄位名稱。
4. 對於 `table`，每一列會使用 `columns`（或第一列的鍵）成為一個表格列。設定 `statusColumn` 時，Payload 也會攜帶該欄位中每個值的色調。
5. 對於 `numeric` 與 `gauge`，數值來自第一列的 `valueField`（或第一個數值欄位）。
6. 對於 `scatter`，每一列會成為一個 `[xField, yField]` 點。
7. 對於 `text`，當有設定時，訊息會取自第一列的 `valueField`，否則取自靜態 `text` 設定（若皆無，則取自第一列的第一個字串欄位）。

## 範例

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge（單一數值 vs. 一個範圍）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter（X/Y 點）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion（以佔比分割的單一長條 + 百分比圖例）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area（填滿的多系列趨勢圖）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge（逐列漸層 gauge 並附數值）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text（靜態 markdown 訊息 — 不需要上游列）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text（動態 — 訊息字串由上游產生，並透過 `valueField` 取得）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## 範例 AI Prompt

使用 **AI** 產生小工具時，這類 Prompt 能明確對應到各類型：

- **Bar** — 「以垂直長條圖顯示過去 6 個月的每月營收，並使用範例資料。」
- **Line** — 「以折線圖繪製過去 14 天的每日活躍使用者數。」
- **Area** — 「以包含兩個數列的區域圖顯示過去 24 小時的記憶體與 CPU 使用率。請使用範例資料。」
- **Pie** — 「以圓餅圖細分執行狀態（成功、錯誤、已取消）。」
- **Table** — 「以可捲動的表格顯示執行次數前 10 名的 Workflow，欄位包含名稱與執行次數。請使用範例資料。」
- **Numeric** — 「以單一 KPI 顯示今日的 Workflow 執行總數，單位為「runs」。請使用範例資料。」
- **Gauge** — 「以 0 到 100 百分比的儀表顯示目前的 CPU 使用率。」
- **Scatter** — 「以散佈圖繪製請求延遲與 Payload 大小的關係，並使用範例資料。」
- **Proportion** — 「以比例長條圖顯示我最常使用的語言：Kotlin 49.64%、JavaScript 23.73%、TypeScript 11.64%、Java 8.92%、Python 6.06%。請使用範例資料。」
- **Bar gauge** — 「以 GB 為單位，使用長條儀表顯示各磁碟區（sda1 至 sda7）的可用磁碟空間。請使用範例資料。」
- **Text** — 「新增一個文字小工具，內容為 markdown 檢查清單（一個已勾選項目、兩個未勾選項目），或依遞減順序列出 5 部最新的教學影片（5. 到 1.），並附上 YouTube 連結 — 每行開頭加上明確的數字（`5. Title`、`4. Title`、……）。」

## 相關內容

- [Dashboard 分頁](../tabs/dashboard-tab.md) — 建立並排列小工具
- [輸出節點](output-node.md) — 一般 Workflow 的終端節點
