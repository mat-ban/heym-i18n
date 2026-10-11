# LLM

**LLM** 節點使用語言模型處理文字或生成圖像。它支援文字生成、視覺（圖像輸入）、圖像生成、結構化 JSON 輸出，以及針對支援的文字模型使用供應商原生的 **Batch API** 執行。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1，以及啟用批次模式時可選的 `batchStatus` |
| 輸出 | `$nodeLabel.text`（文字）、`$nodeLabel.image`（圖像），或批次結果欄位如 `$nodeLabel.results` |

## 參數

### 認證與模型

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自[認證](../tabs/credentials-tab.md)的 LLM 認證 |
| `model` | string | 模型名稱（例如 `gpt-4o`、`gemini-2.5-flash-lite`、用於圖像的 `nanobanana`） |
| `fallbackCredentialId` | UUID（可選） | 主要認證失敗時使用的備援認證 |
| `fallbackModel` | string（可選） | 主要模型失敗時使用的備援模型 |

若主要認證或模型傳回錯誤，節點會在失敗前自動以備援認證與模型重試。

Heym 也會從所選的認證與模型檢查**批次能力**。批次模式適用於：

- OpenAI 認證
- 自訂 / OpenAI 相容認證，其 Endpoint 暴露所需的 `/v1/files` 與 `/v1/batches` API

若所選的供應商或模型不支援批次執行，Properties 面板會直接顯示該資訊並停用切換開關。

### Prompt（文字模式）

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `systemInstruction` | string | 系統 Prompt。支援[表達式](../reference/expression-dsl.md)。 |
| `userMessage` | string | 使用者訊息。預設：`$input.text` |
| `temperature` | number | 0.0–2.0（預設：0.7） |
| `maxTokens` | number | 回應 Token 上限（可選） |
| `requestTimeoutSeconds` | number | 等待模型回應的最長秒數，逾時即中止（預設：60）。對於緩慢或自架的供應商（LiteLLM、vLLM、本機模型），請調高此值。 |

### 圖像與輸出

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | 文字或圖像生成 |
| `imageInputEnabled` | boolean | 在使用者訊息中包含圖像（視覺） |
| `imageInput` | expression | Base64 資料 URL 或圖像 URL |
| `jsonOutputEnabled` | boolean | 結構化 JSON 輸出 |
| `jsonOutputSchema` | string | 結構化輸出的 JSON Schema |
| `extraBodyEnabled` | boolean | 傳送供應商特定的請求參數（預設：`false`） |
| `extraBody` | string | 合併至 API 請求 body 的 JSON 物件 |

### 推理模型（o1、o3）

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `isReasoningModel` | boolean | 為推理模型啟用 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 推理深度 |

### 批次模式

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | 使用供應商原生的 Batch API，而非單一請求執行 |

批次模式僅適用於 **LLM** 節點。它**不**適用於 [Agent 節點](./agent-node.md)。

啟用批次模式時：

- `outputType` 必須保持為 `text`
- `imageInputEnabled` 必須保持為 `false`
- `userMessage` 必須解析為**陣列**
- 每個陣列項目必須解析為字串或原始值

典型範例：

- `$input.items.map("item.text")`
- `$vars.promptList`

若表達式解析為單一字串而非陣列，執行會在供應商呼叫開始前以驗證錯誤失敗。

## 批次狀態分支

啟用批次模式時，LLM 節點會暴露第二個輸出控制代碼：`batchStatus`。

在批次仍在執行時，使用該分支進行通知、記錄、Slack 訊息或副作用。每當供應商狀態有意義地變更時，該分支便會觸發，包括正規化狀態如：

- `pending`
- `processing`
- `completed`
- `failed`

狀態分支的 Payload 可在下游節點內以 `$input` 取得，並包含：

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

範例邊：

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

範例狀態映射器：

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## 批次結果結構

成功完成時，主要 LLM 輸出包含：

- `$nodeLabel.text` – 串接的成功文字
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – 依原始順序排列的逐項結果
- `$nodeLabel.usage`

`$nodeLabel.results` 中的每個項目包含欄位如：

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

當 **JSON 輸出**與批次模式一併啟用時，Heym 會分別解析每個成功的項目。解析後的物件會依項目暴露，並收集於 `parsedResults`。
## Responses API

**Use Responses API** 核取方塊會將節點的呼叫導向
[Responses API](https://platform.openai.com/docs/api-reference/responses)，而非 Chat
Completions。此選項預設為關閉，且節點在兩種情況下行為一致：相同的 Prompt、
相同的 JSON 輸出結構描述、相同的結果格式。

它可搭配 OpenAI 認證使用，也可搭配其閘道支援該 Endpoint 的自訂認證，因此自架或
代理設定也能使用。搭配 Google 認證時，此選項會保持停用，且無法與 [Batch 模式](#batch-status-branch) 合併使用——節點面板會在你執行任何內容之前，說明特定認證的適用狀況。

若該 Endpoint 在執行時無法使用，節點會以指出原因的訊息失敗，而非悄悄退回，因此
設定為使用 Responses API 的節點一律會在其上執行。若要刻意退回至其他認證或模型，請使用 **Fallback
Credential** 與 **Fallback Model** 欄位；它們會繼承此核取方塊，因此備援認證
也必須支援該 Endpoint。

## 圖片生成

- **Models：** `nanobanana`、`gemini-2.0-flash-exp`
- **Output：** `$nodeLabel.image`（base64 資料 URL）
- 使用 [Input](./input-node.md) 作為 Prompt 時，請在 `userMessage` 中使用 `$userPrompt.body.text`

## JSON 輸出

當 `jsonOutputEnabled` 為 true 時，LLM 會傳回符合結構描述的 JSON。透過 `$nodeLabel.fieldName` 存取欄位。

## Extra Body

部分供應商接受標準 OpenAI 相容欄位未涵蓋的請求參數，例如停用模型的思考模式。
在節點屬性中勾選 **Send extra request body**，並輸入 JSON 物件。它會合併至此節點
發出的每個 API 請求中。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **預設為停用。** 核取方塊關閉時，不會傳送任何額外內容。
- 必須是 JSON **物件**。陣列、純量或格式錯誤的文字會使節點失敗並顯示
  `Invalid extra body JSON`，而非被悄悄捨棄。
- 核取方塊旁的 **Format** 按鈕會重新格式化 JSON，並在文字無法解析時變為紅色並顯示
  `Invalid`。
- 套用於主要完成、備援模型嘗試及 Batch 模式請求。
  **不**套用於圖片生成或 Guardrail 檢查，因為它們使用不同的請求
  格式與個別的模型。
- `$` 表達式會在解析前先行解析，因此 `{"max_tokens": $prev.limit}` 可正常運作。由於
  這是文字替換，解析後的值若包含雙引號或換行，會產生無效的 JSON 並使節點失敗。

## 範例 – 文字

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## 範例 – Batch 文字

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## 範例 – 圖片生成

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

在節點屬性中啟用 **Guardrails**，以在 LLM 呼叫前封鎖不安全的訊息。完整參考請參閱 [Guardrails](../reference/guardrails.md)。

## 相關內容

- [Agent 節點](./agent-node.md) – 具備工具呼叫的 LLM
- [為何選擇 Heym](../getting-started/why-heym.md) – LLM 步驟在 Agent 生命週期中的定位
- [Guardrails](../reference/guardrails.md) – 封鎖不安全的內容類別
- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Expression DSL](../reference/expression-dsl.md) – 在 Prompt 中參照資料
- [表達式評估對話框](../reference/expression-evaluation-dialog.md) – 具備即時後端預覽的可展開編輯器，用於 Prompt
- [認證分頁](../tabs/credentials-tab.md) – 新增 LLM API 金鑰
- [快速開始](../getting-started/quick-start.md) – 基本 LLM Workflow
