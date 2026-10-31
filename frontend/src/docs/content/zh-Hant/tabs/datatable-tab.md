# DataTable

**DataTable** 分頁讓您直接在 Heym 中建立與管理結構化資料表。資料表可透過 [DataTable 節點](../nodes/datatable-node.md) 在 Workflow 中使用，進行程式化的 CRUD 操作。

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ 觀看 DataTable 示範</a></p>

## 建立資料表

1. 從儀表板導覽至 DataTable 分頁
2. 點擊 **Create DataTable**
3. 輸入名稱與選填的描述
4. 使用欄位編輯器新增欄位

## 欄位

每個欄位包含：

| 屬性 | 說明 |
|----------|-------------|
| Name | 欄位顯示名稱 |
| Type | `string`、`number`、`boolean`、`date` 或 `json` |
| Required | 新增資料列時是否必須包含此欄位 |
| Unique | 值在資料列之間是否必須唯一 |
| Default Value | 當資料列省略此欄位時自動填入 |

您可以在資料表詳細檢視的標頭中新增、編輯或移除欄位。

## 使用 AI 產生欄位

除了手動新增欄位，您也可以用自然語言描述資料表（或貼上範例 JSON），讓 LLM 提出 schema。兩個進入點會開啟相同的對話框：

- **Generate with AI**（DataTable 清單標頭）—— 依您的描述建立全新的資料表。
- **AI columns**（資料表詳細檢視，位於欄位控制項旁）—— 提出要附加至您目前開啟之資料表的*新*欄位。

### 運作方式

1. 選擇一個 **LLM credential** 與 **model**（預設為您的第一個 LLM credential 及其最新 model）。
2. 輸入描述 —— 例如*「一個書籍資料表，包含書名、作者、頁數，以及我是否讀過」* —— 或貼上 JSON 範例／schema。
3. 點擊 **Generate**。模型會回傳建議的 schema。
4. 在可編輯的表單中檢閱產生的欄位：變更每個欄位的 **name**、**type**、**default**、**unique** 與 **notEmpty**（必填），刪除不需要的欄位，或手動 **Add column**。若為新資料表，您也可以編輯 AI 建議的 **name** 與 **description**。
5. 點擊 **Create Table**（新資料表）或 **Add Columns**（既有資料表）以儲存。您可隨時按 **Esc** 關閉對話框。

### 既有資料表僅限附加

為既有資料表產生欄位時，模型會將您目前的欄位視為上下文，並僅提出**新**欄位。既有欄位及其資料絕不會被修改或移除 —— 產生的欄位會以附加方式加入。重複的名稱（不分大小寫）會自動捨棄。

> 需要一個 LLM credential（OpenAI、Google 或 Custom）。若您尚未擁有，請先在 Settings 中新增。

## 管理資料列

- **新增資料列**：點擊新增按鈕以建立新資料列
- **行內編輯**：連按兩下任一儲存格以編輯其值。按 Enter 或點擊他處以儲存，按 Escape 以取消
- **刪除資料列**：使用資料列操作選單以移除資料列
- **分頁**：每頁顯示 25 個資料列，並提供頁面導覽

## CSV 匯入／匯出

### 匯入
1. 在資料表詳細檢視中點擊 **Import CSV**
2. 選擇要上傳的 CSV 檔案
3. 預覽前 5 個資料列與欄位對應
4. 綠色欄位會對應至既有資料表欄位；黃色則未對應
5. 點擊 Import 以批次插入資料列

### 匯出
點擊 **Export CSV** 將所有資料列下載為 CSV 檔案。

## 分享

與其他使用者或團隊分享資料表：

1. 從資料表詳細檢視開啟分享對話框
2. 以電子郵件新增使用者，並賦予 **read** 或 **write** 權限
3. 新增團隊，並賦予 **read** 或 **write** 權限
4. 唯讀使用者可以檢視資料；寫入使用者可以修改列與欄位。重新命名資料表、變更其說明以及管理共用仍僅限擁有者操作。

## 從 AI Assistant 建立資料表

Canvas [AI 助理](../reference/ai-assistant.md#data-tables)、[Chat](./chat-tab.md) 以及 [MCP 分頁](./mcp-tab.md)上的 `heym_chat` 工具可以為其建置的 Workflow 選擇您擁有的某個資料表，或建立新資料表。它們會建議名稱和欄位，並在您送出問題卡時建立資料表。Canvas 助理會根據資料表中繼資料設定 Workflow 節點。Chat 和 `heym_chat` 還可以檢查列、新增或刪除欄位，並直接插入、更新或刪除列。只需向它們提供資料表名稱或此分頁的連結即可。寫入操作需要擁有權或直接/團隊**寫入**權限。新增欄位會保留現有資料；刪除欄位會從每一列中刪除其對應的值。刪除欄位和清除所有列都會要求確認，與此分頁一致。

## 在 Workflow 中使用

[DataTable 節點](../nodes/datatable-node.md) 會將資料表連接至 Workflow。操作包括 find、getAll、getById、insert、update、remove 與 upsert。不需要任何 credentials。

## LLM Cost Table（系統資料表）

在使用者建立的資料表上方會顯示一個固定的 **System tables** 區段，其中僅有一個項目：**LLM Cost Table**。這是固定 schema、每位使用者可編輯的檢視，用於呈現 [Traces](./traces-tab.md) 成本圖表所使用的各 model 定價。

### 資料來源

Heym 維護一份全域的各 model 定價資料表，其初始資料來自 Helicone 的公開定價 Endpoint（`https://www.helicone.ai/api/llm-costs`）。同步會在您首次開啟該資料表或 Traces 時於背景執行，並限制為每 24 小時擷取一次。按 **Refresh** 可強制立即重新同步。Helicone 從上游清單中移除的項目不會在本機刪除，因此歷史成本查詢可保持穩定。

### Schema（唯讀欄位）

| 欄位 | 意義 |
|---|---|
| Provider | `ANTHROPIC`、`OPENAI`、`GOOGLE`……（資訊性，供 Helicone 使用） |
| Model | 與 `trace.model` 比對的 model 識別碼 |
| Op | 比對運算子：`equals`、`startsWith` 或 `includes` |
| Input $/1M | 每 100 萬個 prompt Token 的美元價格 |
| Output $/1M | 每 100 萬個 completion Token 的美元價格 |
| Source | `helicone`、`seed` 或 `user` |

### 自訂定價

- **編輯資料列**以覆寫其價格。您的覆寫是依使用者設定，並會標示 `Customized` 標籤；未來的 Helicone 同步不會更動它。
- **重設為預設值**會移除覆寫，並還原該資料列的全域值。
- **新增自訂模型**會開啟對話框，以建立僅限使用者可見的資料列（例如 Helicone 未列出、私有的微調模型）。自訂資料列會標示 `User added`，刪除後即會完全移除。

### 與 trace 的比對

當 Traces 儀表板計算成本時，會將每個 `trace.model` 依下列順序比對：

1. 先比對您的覆寫（以模型名稱精確比對）
2. 否則比對全域表 — `equals` 精確比對優先於 `startsWith`/`includes`；相同運算子內的多筆結果，以符合的模型前綴/子字串最長者為準

若沒有任何資料列符合，該模型會列在 Traces 頁面的 **Unpriced models** 提示中；在您新增自訂資料列或覆寫既有資料列之前，其成本貢獻為零。

## 相關

- [DataTable 節點](../nodes/datatable-node.md) - Workflow 節點參考
- [Traces 分頁](./traces-tab.md) - 使用 LLM Cost Table 產生成本圓餅圖與 KPI 卡片
- [Grist 節點](../nodes/grist-node.md) - 外部試算表替代方案
- [Variables 分頁](./global-variables-tab.md) - 鍵值儲存替代方案