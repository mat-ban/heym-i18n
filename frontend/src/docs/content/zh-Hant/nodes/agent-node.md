# Agent 節點

**AI Agent** 節點是一個具備工具呼叫能力的 LLM 節點。它可以執行 Python 工具、將已連接的畫布節點作為工具呼叫、連接至 MCP 伺服器、使用技能、選擇性地作為協調器（orchestrator）將任務委派給其他 agent 節點、將其他 Workflow 作為工具呼叫，並暫停以進行[人工審查](../reference/human-in-the-loop.md)。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1，以及啟用 HITL 時可選的 `review` |
| 輸出 | `$nodeLabel.text`、`$nodeLabel.fieldName`（啟用 JSON 輸出時），或等待審查期間的待處理 HITL Payload |

## 核心參數

### Credential 與 Model

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 Settings 的 LLM Credential（API key） |
| `model` | string | 模型名稱（例如 `gpt-4o`、`gemini-2.5-flash-lite`） |
| `fallbackCredentialId` | UUID（選用） | 主要 Credential 失敗時使用的備援 Credential |
| `fallbackModel` | string（選用） | 主要模型失敗時使用的備援模型 |

在 [Credentials](../tabs/credentials-tab.md) 分頁中新增 Credential。模型清單會從所選的 Credential 載入。若主要 Credential 或模型傳回錯誤，節點會在失敗前自動以備援 Credential 與模型重試。

### Prompt

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `systemInstruction` | string | AI 的系統 Prompt。支援[表達式](../reference/expression-dsl.md)。 |
| `userMessage` | string | 使用者訊息／Prompt。預設值：`$input.text` |
| `jsonOutputEnabled` | boolean | 結構化 JSON 輸出 |
| `jsonOutputSchema` | string | 結構化輸出的 JSON Schema |
| `extraBodyEnabled` | boolean | 傳送供應商特定的請求參數（預設值：`false`） |
| `extraBody` | string | 合併至 agent 每次發出之 API 請求的 JSON 物件 |

使用 `$input.text`、`$nodeName.field` 及其他 [Expression DSL](../reference/expression-dsl.md) 語法。

### 推理模型（o1、o3）

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0（預設值：0.7），適用於標準模型 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 推理模型的推理深度 |

使用推理模型（例如 o1、o3）時，UI 會顯示 **Reasoning Effort** 而非 Temperature。對於標準模型，**Temperature** 控制創造力。

**JSON 輸出範例：** 當你需要從 agent 取得結構化資料（例如分類、擷取）時，啟用 JSON 輸出並提供 schema。agent 會傳回符合 schema 的 JSON；可透過節點輸出上的欄位名稱存取欄位：

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

下游節點可使用 `$agentLabel.status`、`$agentLabel.reason` 等。行為與 [LLM 節點](../nodes/llm-node.md)的 JSON 輸出相同。

## 人工審查（HITL）

當 agent 在重要動作前可能需要於特定時刻取得核准時，請使用 HITL。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `hitlEnabled` | boolean | 為 agent 新增人工審查檢查點 |
| `hitlSummary` | string | 核准準則，告知 agent 何時需要人工審查 |

啟用 HITL 時，agent 會收到一個 `request_human_review` 工具。使用系統 Prompt 與此準則欄位來說明哪些工具呼叫、子 agent、子 Workflow、MCP 動作、技能或副作用需要核准。agent 僅在需要時呼叫該工具，且可在單次執行中呼叫多次。

公開頁面上面向審查者的摘要，會在執行階段從 agent 的審查請求產生。若 agent 未明確提供摘要，Heym 會從 Markdown 審查內容推導出一份。

對於 MCP 工具，Heym 會要求模型將你撰寫的 HITL 指示解讀為三種範圍之一：`always`、`once` 或 `never`。這表示諸如「for each call」、「only one time」或「never ask」等自由格式的措辭，會在套用執行階段的閘控之前先行正規化。

每個 HITL 檢查點都會在 `/review/{token}` 建立一次性公開審查連結。審查者可以：

- **Accept** 原始 Markdown 審查文字
- **Edit & Continue** 使用修改後的 Markdown 繼續
- **Refuse** 並以 `text: ""` 繼續

啟用 HITL 時，節點也會在畫布上公開一個 `review` 輸出把手。若你希望在執行暫停時立即廣播審查 URL 與摘要，請將該分支連接至 Slack、電子郵件或其他通知節點。

執行會進入 `pending` 狀態，直到審查者回應為止。審查文字是單一 Markdown 內容，而待處理 Payload 也包含可分享的連結文字，以供外部交接使用。`review` 分支上的節點會在建立暫停時立即執行；正常輸出路徑僅在核准後才會繼續。核准後，Heym 會從儲存的執行快照恢復，agent 會以已核准的內容繼續執行。若後續步驟也需要核准，agent 可建立另一個 HITL 檢查點。關於 Payload 結構、審查 URL 行為與恢復語意，請參閱[Human-in-the-Loop](../reference/human-in-the-loop.md)。

HITL 僅適用於文字模式的 agent 輸出。在 v1 中，它無法與 `jsonOutputEnabled` 合併使用。
## Orchestrator 模式

啟用後，Agent 可將任務委派給 Workflow 中的其他 Agent 節點。若 **Orchestrator 模式已停用**，Agent **無法在畫布中建立 Agent→Agent 連線**。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `isOrchestrator` | boolean | 當設為 `true` 時，Agent 會取得 `call_sub_agent` 工具 |
| `subAgentLabels` | string[] | 此 Orchestrator 可呼叫的 Agent 節點標籤 |

**Sub-agent** 必須在其 User Message 中使用 `$input.text`，以便接收 Orchestrator 的 Prompt。

當 Orchestrator 在單一回合中呼叫多個 Sub-agent 時，它們會平行執行。詳情請參閱 [Agent 架構](../reference/agent-architecture.md)。

## Sub-Workflow

設定後，Agent 會取得 `call_sub_workflow` 工具，用以執行其他 Workflow。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | 此 Agent 可作為工具呼叫的 Workflow ID |

在 Agent 設定的 Sub-Workflows 區段中選取 Workflow。Agent 會以 `workflow_id` 與 `inputs`（符合目標 Workflow 輸入欄位的物件）呼叫它們。最大深度：5 層巢狀 Sub-workflow 呼叫。

## 畫布節點工具

您可以將支援的 Workflow 節點連接到 Agent 的 **tools** 控制點，讓 Agent 能在執行階段呼叫該節點。這可將現有的畫布動作與轉換變成可呼叫的工具，無需撰寫 Python。

當您希望由 Agent 決定何時執行已設定的節點，同時將憑證、靜態欄位與 Workflow 特定設定保留在節點 UI 中時，請使用畫布節點工具。

### Agent 提供的欄位

已連接工具節點上的欄位可標記機器人圖示。被標記的欄位會成為必要的工具參數，Agent 在呼叫該節點時必須提供。未標記的欄位則保持固定，並從節點設定中讀取。

例如：

- 將 Slack 節點作為工具連接到 Agent
- 將憑證固定在 Slack 節點中
- 將 `message` 標記為 Agent 提供
- Agent 會取得一個 Slack 工具，在執行階段僅需提供訊息

若節點未作為工具連接到 Agent，機器人圖示會隱藏，該節點的行為與一般 Workflow 步驟相同。

### 執行階段行為

當 Agent 呼叫畫布節點工具時，Heym 會暫時將 Agent 提供的引數合併至該節點的資料中、執行該節點、將節點輸出回傳給 Agent，然後還原原始節點設定。工具節點不會透過一般排程作為常規 Workflow 步驟執行；它們僅在 Agent 呼叫時執行。

畫布節點工具適用於整合節點，例如 Slack、Telegram、HTTP、Send Email，以及資料塑形節點，例如 [Set](./set-node.md)。Trigger 節點、控制流程節點，以及終端輸出對應器（[JSON 輸出對應器](./json-output-mapper-node.md)、[HTML 輸出對應器](./html-output-mapper-node.md)）無法作為 Agent 工具使用。

## Python 工具

定義 Agent 可呼叫的自訂工具。每個工具包含：

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `name` | string | 工具名稱（例如 `count_characters`） |
| `description` | string | 提供給 LLM 的說明 |
| `parameters` | JSON Schema | OpenAI function-calling schema（物件格式） |
| `code` | string | Python 函式程式碼 |

**Parameters** 必須是 JSON 物件，而非字串：

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**範例工具：**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox。** Python 工具預設會以不受信任的程式碼形式，在強化的隔離 Docker 容器中執行（無網路、無 Docker socket、唯讀檔案系統、非 root）。匯入僅限於安全標準函式庫模組的允許清單。設定方式（`HEYM_PYTHON_TOOL_SANDBOX`）請參閱 [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox)。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | 每次工具執行的最大秒數（預設：30） |
| `requestTimeoutSeconds` | number | 等待每個模型回應的最大秒數，逾時即中止（預設：60）。若使用較慢或自架的供應商（LiteLLM、vLLM、本機模型）以及長時間的多步驟執行，請調高此值。 |
## MCP Connections

連接至 [Model Context Protocol](https://modelcontextprotocol.io/) 伺服器，將其工具暴露給 Agent。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | 連線類型 |
| `timeoutSeconds` | number | 此連線的逾時時間（預設：30） |
| `label` | string | 選用的顯示名稱 |

**stdio**（本機程序）：

| 欄位 | 說明 |
|-------|-------------|
| `command` | 要執行的指令（例如 `npx`） |
| `args` | JSON 陣列（例如 `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`） |
| `env` | 注入至程序的環境變數 JSON 物件（例如 `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`） |

大多數以 API 金鑰驗證的 stdio 伺服器是透過環境變數而非指令參數進行驗證。請依連線設定 `env`，讓每個 Agent 節點可以使用不同的憑證，而無需更動主機環境。

`env` 的值支援 [Expression DSL](../reference/expression-dsl.md)，因此您可以將 Workflow 輸入作為憑證傳入，而不必硬編碼機密資訊：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

表達式 `$userInput.pat` 會在 MCP 程序啟動前，於執行階段根據 Workflow 的輸入資料進行解析。這讓您可以從 Trigger 或輸入節點接收 Token，而不必將其嵌入 Workflow 定義中。

範例 — 使用硬編碼 Token 的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

範例 — 使用來自 Workflow 輸入的動態 Token 的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

範例 — 使用 Heym GitHub 憑證的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

內建的 GitHub 憑證目前採用 PAT 驗證。若您需要組織層級的存取權限，請使用具備所需組織/儲存庫權限的 PAT。

範例 — Slack MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE**（遠端伺服器）：

| 欄位 | 說明 |
|-------|-------------|
| `url` | SSE Endpoint URL。支援表達式（例如 `$userInput.serverUrl`）。 |
| `headers` | 用於驗證/自訂標頭的 JSON 物件。值支援表達式。 |

**Streamable HTTP**（遠端伺服器）：

| 欄位 | 說明 |
|-------|-------------|
| `url` | MCP Endpoint URL（例如 `https://example.com/mcp`）。支援表達式。 |
| `headers` | 用於驗證/自訂標頭的 JSON 物件。值支援表達式。 |

## Skills

Skills 是 SKILL.md 指示，加上選用的 Python 檔案與隨附資源。它們會擴充 Agent 的系統上下文，並可新增 Python 工具。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `name` | string | Skill 名稱 |
| `content` | string | SKILL.md 內容（指示） |
| `timeoutSeconds` | number | Skill Python 執行的逾時時間（預設：30） |
| `driveFilesEnabled` | boolean | 為此 Skill 啟用執行階段的 `heym_drive` 輔助程式（預設：false） |
| `files` | array | 選用的 `{ path, content, encoding, mimeType }` 項目（例如 `.py` 指令碼或以 base64 儲存的二進位資源） |

您可以將 `.zip` 或 `.md` 檔案拖放至 Skills 區域來新增 Skill。
展開 Skill 卡片後，將任何檔案拖放至該 Skill 即可附加或取代隨附檔案，包括 PDF 與圖片等二進位資源。
使用 Skill 卡片上的下載按鈕，可將該 Skill 匯出為 `.zip` 壓縮檔，以供備份或在其他 Workflow 中重複使用。

僅在 Skill 的 Python 程式碼需要從 Heym Drive 讀取檔案時，才啟用 **Drive files**。已啟用的 Skill 會在執行階段收到產生的 `heym_drive.py` 輔助程式，並可使用 Drive 檔案 ID 或確切檔名呼叫 `list_drive_files`、`get_drive_file`、`get_drive_file_path`、`read_drive_file`、`read_drive_text` 或 `read_drive_base64`。檔名查詢會使用最新的可存取相符項目。未啟用的 Skill 不會收到該輔助程式。

每張 Skill 卡片在標題下方的列上有四個動作：

| 按鈕 | 說明 |
|--------|-------------|
| **Edit with AI** | 開啟 Skill Builder，透過聊天 Prompt 修訂 Skill |
| **Download** | 將 Skill 匯出為 `.zip` 壓縮檔 |
| **Remove** | 從此 Agent 節點刪除 Skill |
| **History** | 開啟衍生自 [Edit History](../reference/edit-history.md) 的 Skill 歷史記錄 |
### 技能歷史記錄

技能歷史記錄**不會**單獨儲存。它是從 Workflow 的編輯歷史記錄快照衍生而來：每個已儲存的 Workflow 版本都包含完整的 Agent 節點 `skills` 陣列。

在歷史記錄對話框中，您可以：

- **預覽**過去的快照（SKILL.md 與檔案清單）
- **編輯** — 將快照載入技能編輯器，而不還原整個 Workflow
- **AI 微調** — 以該快照作為起點開啟 Skill Builder
- **還原** — 僅從過去的版本還原此技能（其他節點維持不變）

歷史記錄遵循與 Workflow 編輯歷史記錄相同的 7 天保留期。在技能編輯後儲存 Workflow 會建立新的歷史記錄項目。

技能區段也包含 **AI 建置**：

- 點擊 **AI 建置**以從聊天 Prompt 建立新技能
- 點擊現有技能上的閃爍按鈕以使用 AI 修訂該技能
- 將檔案拖放到 Prompt 撰寫器中，即可將其附加至微調註解；這些檔案也會儲存為綑綁的技能資產
- 此模態視窗會串流顯示助理文字，同時顯示即時的 `SKILL.md` 與 `.py` 檔案預覽
- **下載 ZIP** 會匯出目前的預覽，而不將其新增至節點
- **儲存並新增**會透過與手動上傳相同的 ZIP 解析流程，將產生的檔案儲存回去

使用 AI 編輯時，Heym 僅會將文字 `.md` 與 `.py` 技能檔案傳送給建置器。二進位與其他不可編輯的附件會予以保留，並以路徑中繼資料的形式與建置器共用，以便產生的 Python 程式碼能維持正確的相對檔案參照。
在右側面板中選取附加的檔案，並在 AI 需要檢查綑綁的範本時啟用 **Include this file in AI context**。文字、PDF 與 DOCX 檔案在可能的情況下會擷取至 Prompt 上下文中；除了平台請求主體限制之外，Heym 不會對 Skill Builder 附件套用個別的大小上限。

## Extra Body

部分供應商接受標準 OpenAI 相容欄位未涵蓋的請求參數，例如停用模型的思考模式。在節點屬性中勾選 **Send extra request body**，並輸入 JSON 物件。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **預設為停用。** 核取方塊關閉時，不會傳送任何額外內容。
- 套用於工具呼叫迴圈中的**每一個**請求，而不只是第一輪，另外也套用於備援模型嘗試。不套用於護欄檢查，因為護欄檢查使用不同的模型。
- 必須是 JSON **物件**。陣列、純量或格式錯誤的文字會使節點失敗並顯示 `Invalid extra body JSON`，而不會被無聲捨棄。
- `$` 表達式會在解析前先行解析。由於這是文字替換，解析後的值若包含雙引號或換行，會產生無效的 JSON 並使節點失敗。

欄位與行為和 [LLM 節點](./llm-node.md)的 extra body 相同。

## 護欄

在節點屬性中啟用 **Guardrails**，以在 Agent 執行前封鎖不安全的的使用者訊息。完整參考請參閱 [Guardrails](../reference/guardrails.md)。

## 持久記憶體（圖）

選用的**個別 Agent 節點**知識圖，儲存於資料庫中。啟用後，Heym 會在每次執行前，將已記住的實體與關係的 Markdown 摘要附加至**系統指令**（僅在圖非空時）。在 Agent **成功**完成後，背景作業會從對話中擷取新的持久事實，並將其合併至圖中。

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | 為此畫布節點啟用載入與背景擷取 |

**子 Agent** 會保留其**自己的**圖（以其節點 ID 為鍵），與協調器分開。

使用節點上的粉紅色**大腦**控制項（當記憶體開啟或顯示模型列時）開啟圖編輯器與選用的**記憶體共用**（其他 Workflow/Agent）。完整行為、REST 路徑與 JSON 匯出詳細資訊：[Agent 持久記憶體](../reference/agent-persistent-memory.md)。

## Responses API 與推理連續性

**Use Responses API** 核取方塊會將 Agent 的模型呼叫改經由 [Responses API](https://platform.openai.com/docs/api-reference/responses) 路由，而非 Chat Completions。此選項預設為關閉。

這在推理模型（例如 `gpt-5` 或 `o` 系列）上最為重要。Responses API 會在每次工具呼叫時一併傳回模型的推理，而 Agent 會在下一輪將這些推理項目饋送回，因此模型能在多步驟工具迴圈中保持其思維鏈，而不必在每次工具結果後重新推導。整個迴圈都在同一路徑上執行，包括[人工審查](#human-review-hitl)暫停與繼續、[上下文壓縮](#context-compression)，以及最終答案。

對話本身會保留在 Heym 中。Heym 會在每一輪傳送完整輸入，並以加密 blob 的形式攜帶推理，因此呼叫之間不會在供應商端保留任何內容。上下文壓縮所摘要的範圍內的推理項目會隨之被捨棄，因為加密 blob 無法被摘要。

它可搭配 OpenAI 認證使用，也可搭配其閘道支援該 Endpoint 的自訂認證使用。搭配 Google 認證時則維持停用。
## 上下文壓縮

當 Agent 執行大量工具迭代並產生龐大結果（網頁爬取、文件讀取、子 Workflow 輸出）時，累積的訊息歷史可能逼近模型的上下文視窗上限。Heym 會在執行過程中自動壓縮對話歷史，以防止上下文溢位。

**運作方式：**

1. 在每次工具迭代之前，Heym 會估算當前的 Token 數量（約每 Token 4 個字元）。
2. 若估算值超過模型上下文視窗的 **80%**，即觸發壓縮。
3. 訊息歷史會被拆分為保留區段與壓縮區段：
   - **保留**：system prompt、第一則使用者訊息、最近一則使用者訊息
   - **壓縮**：介於兩者之間的所有內容（assistant 推理回合、工具呼叫、工具結果）
4. 中間區段會使用**相同的模型與 credential** 進行摘要——無需額外設定。
5. 壓縮後的摘要會以單一 assistant 訊息的形式取代中間區段。

**可觀測性：**

壓縮事件會以 `Context compressed (N messages → summary)` 項目顯示於：
- 即時執行期間的 **Debug 面板**工具呼叫清單
- **Execution history** 執行詳細檢視
- **Traces 分頁**中的 `context.compression` trace 項目

壓縮為自動執行，且對 Agent 節點一律啟用。它**不**適用於 LLM 節點、Chat 分頁或 AI Assistant 工作階段。

## 相關內容

- [Why Heym](../getting-started/why-heym.md) – Agent 如何在正式環境中執行並保持受控
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – 每個 Agent 節點的知識圖譜、選用共享、API、編輯器
- [Agent Architecture](../reference/agent-architecture.md) – 子 Agent、協調器、skills、MCP、工具呼叫
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 公開審查頁面、待處理執行、核准/編輯/拒絕流程
- [Guardrails](../reference/guardrails.md) – 封鎖不安全的內容類別
- [Node Types](../reference/node-types.md) – 所有節點類型總覽
- [AI Assistant](../reference/ai-assistant.md) – 以自然語言建構 Workflow 的 Chat UI（與 Agent 節點不同）
- [Expression DSL](../reference/expression-dsl.md) – 在 prompt 中參照資料
- [Workflow Structure](../reference/workflow-structure.md) – 節點、邊與 DSL 格式
- [Quick Start](../getting-started/quick-start.md) – 使用 LLM 與表達式的基礎 Workflow
- [Credentials Tab](../tabs/credentials-tab.md) – 為 Agent 新增 API 金鑰
- [MCP Tab](../tabs/mcp-tab.md) – 為 Workflow 工具設定 MCP
