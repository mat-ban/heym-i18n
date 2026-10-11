# 決策

**Decision** 節點會針對該次執行的當前狀態，向決策模型提出具型別的問題，並回傳機率。它不會產生文字。當 Workflow 需要一項可據以分支的判斷時——例如路由、分流、排序、驗證，或為無法復原的步驟設下關卡——就適合使用它。

決策模型（也稱為 *System One* 模型）是與 LLM 不同類型的模型。它沒有 Prompt、沒有系統指令、沒有 temperature，也不支援工具呼叫。你送出一個 **state** 以及一組 **questions** 對應表，每個答案都會以一個數字回傳，背後帶有機率分布。由於答案只有少數幾個 Token，相較於要求 [LLM](./llm-node.md) 產生 JSON 再進行解析，這類模型既快速又便宜。

若要產生文字，請使用 [LLM](./llm-node.md) 節點。若要使用可呼叫工具的模型，請使用 [Agent Node](./agent-node.md)。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | 供應商回應原文——`$nodeLabel.answers.<id>`、`$nodeLabel.model`、`$nodeLabel.usage` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 一個 *Decision Model* 認證。不是 LLM 認證。 |
| `model` | string | 模型名稱，例如 `jev-latest` |
| `state` | expression | 模型應讀取的內容（預設為 `$input.text`） |
| `questions` | array | 依序排列的問題列；至少一列 |
| `customBodyEnabled` | boolean | 改為送出手寫的請求 body，而非使用表單 |
| `customBody` | expression (JSON) | 切換開關開啟時要送出的 body |
| `requestTimeoutSeconds` | number | 最長等待秒數（預設：60） |

### State

**State** 是模型要判斷的情境。它接受字串、物件或陣列。

若某個欄位恰好只包含一個 expression，則會保留其本身的型別，因此 `$input` 會送出物件本身，而非其文字。若範本內含 expression（例如 `Ticket: $input.text`），則會解析為字串。請為每個問題提供足夠的資訊以供回答：來源文字、身分、關係、政策，以及當前事實。

## 問題類型

每個問題都有一個 `id`、一個 `type`、`instructions`，以及依類型而定的判斷準則。

`id` 是 Workflow 讀回答案的方式。它**永遠不會被送到模型**，因此完整的語意都必須放在 `instructions` 中。若寫成 `id: is_urgent` 搭配 `instructions: "Is it?"`，模型將無從判斷。

### Noul

判斷某個條件是否成立。回傳答案為 yes 的機率，範圍從 0 到 1。

判斷準則為選填：**Yes means** 與 **No means** 用來描述各側涵蓋的範圍。數值接近 0.5 表示模型認為 yes 與 no 的機率大致相同——而非「中等強度」。

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

使用 `$triage.answers.is_urgent.noul` 讀取。

### Choice

從你定義的一組選項中挑選一個。回傳所選選項、完整分布，以及由此推導出的信心值。

當可能沒有任何選項適用時，請加入一個涵蓋「以上皆非」的選項——模型無法選擇你未提供的選項。

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

使用 `$triage.answers.department.choice`、`.probabilities.billing` 與 `.confidence` 讀取。

### Score

依一組有序的評分標準對該狀態評分。回傳一個經機率加權的值，該值可能落在**介於**各等級之間，並附上圖例與分布。

等級由最低排到最高，至少兩個、最多十個。每個等級都應描述一個具體情境，並能獨立成立。

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

使用 `$triage.answers.frustration.score`、`.legend` 與 `.confidence` 讀取。

## Generate with AI

**Generate with AI** 會將一句白話敘述轉換為建議的 state 範本與一組問題列。請描述你想判斷的內容——例如「分流一筆進來的支援工單：它有多緊急、由哪個團隊負責，以及客戶聽起來有多不滿」——並在加入節點之前檢視回傳的結果。

草擬作業由 LLM 完成，因此對話框會要求提供 LLM 認證。決策模型則會在稍後 Workflow 執行時回答這些問題。產生的 id 會與節點中既有的問題列進行去重，因此生成兩次也絕不會覆寫既有的答案鍵。

每次生成都會記錄在 [Traces](../tabs/traces-tab.md) 分頁的 **Decision Questions** 來源之下，與節點本身在執行時寫入的 `decision.systemone` trace 並列。
## 自訂請求主體

開啟 **Custom request body** 以傳送您自行撰寫的 JSON，而非使用表單。當某個 endpoint 的合約與表單所建構的不同時，請使用此選項。

編輯器會以目前的表單內容作為初始值，且其中的表達式會在請求送出前解析完成。當此開關開啟時，State 欄位與問題列會被忽略。無論哪種方式，回應都會原樣傳遞，因此不同的合約只會產生不同形狀的結果，供您的表達式讀取。

## 輸出

該節點會原樣回傳 provider 所回傳的內容。不會重新命名或扁平化任何項目。

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## 依據回答進行分支

[Switch](./switch-node.md) 節點會依據所選選項進行路由，而 [Condition](./condition-node.md) 節點則可將低信心的案例送往人員會看到的地方：

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

有型別的回答保證的是形狀，而非真實性。請依據您自己的資料與後果來選擇閾值，而不是從範例中複製某個數字。

## Credential

在 [Credentials](../tabs/credentials-tab.md) 分頁中建立一個 **Decision Model** credential，包含：

- **Base URL** — 即 endpoint，例如 `https://api.typesafe.ai`。Heym 會附加 `/v1/systemone`。
- **API Key** — 選填。不需要金鑰的 endpoint 可留空。

編輯 credential 時，若金鑰欄位留空，則會保留已儲存的金鑰；僅在要替換金鑰時才需重新輸入。

同一個 credential 可為 [Evals](../tabs/evals-tab.md) 執行進行評判：在選取 **LLM-as-Judge** 後，將其選為 judge，decision model 便會依據預期輸出為每個回答評分。

Heym 預設會封鎖對私有位址與 loopback 位址的對外請求，因此您自行在 `localhost` 或私有網段上執行的 decision endpoint 需要設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。

Decision model 不會出現在 Heym 所同步的 LLM 定價表中，因此這些呼叫在 [Traces](../tabs/traces-tab.md) 中的 **Cost** 欄位會保持空白。Token 數量仍會被記錄，而您可以透過 pricing override 自行新增價格。

## 錯誤

| 情況 | 會發生什麼事 |
|-----------|--------------|
| 無效的 API key | 節點會失敗，並顯示指出該 credential 的訊息 |
| 格式錯誤的問題 | provider 自身的欄位層級訊息會被帶入節點錯誤中 |
| 受到速率限制或超載 | 節點會失敗，並顯示指出該狀況為暫時性的訊息 — 為此節點開啟 [retry](../reference/features.md) 以撐過該狀況 |
| 重複或空的問題 id | 節點會在送出任何請求之前失敗 |

## 相關內容

- [LLM Node](./llm-node.md) – 產生文字而非判斷
- [Agent Node](./agent-node.md) – 使用工具蒐集證據，再於此處進行判斷
- [Switch Node](./switch-node.md) – 依據所選選項進行路由
- [Condition Node](./condition-node.md) – 依據信心進行閘控
- [Node Types](../reference/node-types.md) – 所有節點類型總覽
- [Credentials](../reference/credentials.md) – Credential 類型與欄位
- [Traces Tab](../tabs/traces-tab.md) – 檢視 decision 呼叫與 token 用量
