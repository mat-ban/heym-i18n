# Guardrails

Guardrails 可讓您在訊息送達 [LLM](../nodes/llm-node.md) 或 [Agent](../nodes/agent-node.md) 節點之前，封鎖不安全或不受歡迎的使用者訊息。當訊息符合遭封鎖的類別時，該節點會擲回錯誤而非執行，您可以透過 [Error Handler](../nodes/error-handler-node.md) 節點攔截此錯誤。

## 啟用 Guardrails

開啟 **LLM** 或 **AI Agent** 節點的 Properties 面板，並捲動至 **Enable Guardrails** 切換開關（盾牌圖示）。勾選此方塊後即會顯示設定區段。

## Guardrail Credential 與 Model

啟用 guardrails 時，您**必須**為內容安全選擇一組 **credential 與 model**。Guardrail 檢查會使用節點中所選的 credential 與 model — 沒有備援機制，也沒有環境變數。請使用 OpenAI 或 Google credential 以獲得可靠的內容過濾，特別是當您的主要 model 使用自訂供應商（例如 Zhipu、GLM）而可能不支援 guardrails 或傳回 API 錯誤（例如 404）時。

在 Guardrail Credential 與 Guardrail Model 皆選取之前，Workflow 無法執行。

## 封鎖類別

選取一個或多個要封鎖的類別。符合任何已勾選類別的訊息將被拒絕。

| 類別 | 封鎖內容 |
|---|---|
| **Violence** | 暴力、威脅或造成身體傷害的內容 |
| **Hate Speech** | 歧視、種族主義或偏執言論 |
| **Sexual Content** | 露骨的性內容或情境 |
| **NSFW / Profanity** | 任何語言中的粗俗用語、褻瀆、露骨侮辱及成人俚語 |
| **Self-Harm** | 自殺、自傷或相關內容 |
| **Harassment** | 人身攻擊、侮辱、霸凌或恐嚇 |
| **Illegal Activity** | 從事非法行為的指示 |
| **Political Extremism** | 極端政治內容或暴力宣傳 |
| **Spam / Phishing** | 垃圾訊息、網路釣魚或社交工程 |
| **Personal Data Request** | 索取私人或個人可識別資訊 |
| **Prompt Injection** | 試圖覆寫系統指示、注入惡意 prompt 或操縱 model 行為 |

## 敏感度

**Sensitivity** 設定可控制違規偵測的嚴格程度：

| 等級 | 行為 |
|---|---|
| **Low** | 即使是邊緣或模稜兩可的案例也會標記 |
| **Medium** *（預設）* | 標記明確的違規；忽略邊緣案例 |
| **High** | 僅標記極端、明確無疑的違規 |

## 偵測運作方式

偵測會使用**所選的 guardrail credential 與 model**：

- **OpenAI credentials** — 針對原生支援的五個類別（Violence、Hate Speech、Sexual Content、Self-Harm、Harassment）使用 [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)（免費、快速、不耗用 token）。其餘類別則使用所選的 guardrail model 透過 LLM 分類呼叫進行檢查。
- **Google／自訂 credentials** — 所有類別皆使用所選的 guardrail credential 與 model，透過 LLM 分類呼叫進行檢查。

當您的主要 model 使用自訂供應商（例如 Zhipu、Cerebras）而可能傳回 404 或其他 API 錯誤時，請為 guardrails 選擇 **OpenAI 或 Google credential**。

## 錯誤格式

當 guardrail 被觸發時，節點會擲回錯誤，訊息如下：

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

節點結果的 `output` 也會包含 `guardrail_violated_categories`（違規類別標籤的陣列），以便 Debug Panel 與 Execution History 能清楚顯示「Blocked by: X, Y」。

使用節點的 **Continue on error** 選項（或 [Error Handler](../nodes/error-handler-node.md)），即可在 guardrails 觸發時將 Workflow 導向備援分支。

## 範例 Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## 備註

- **不重試**：Guardrail 違規屬於刻意封鎖，即使節點已啟用「Retry on failure」，也絕不會重試。
- 無需資料庫遷移 — guardrail 設定會與其他節點資料一併儲存於 Workflow 的節點 JSON 中。
- Guardrails 會檢查解析後的**使用者訊息**（在範本表達式評估之後），而非原始範本。
- 在啟用 guardrails 的情況下設定**無任何類別**，等同於停用 guardrails — 不會執行任何檢查。
- 在 **Low** 嚴重度下，一律會執行 LLM 分類（最佳多語言涵蓋範圍）。OpenAI credentials 會額外執行 Moderation API。
- 在 **Medium/High** 嚴重度下，OpenAI credentials 會針對原生支援的類別使用 Moderation API，其餘則使用 LLM 分類。Google／自訂 credentials 一律使用 LLM 分類。
- LLM 分類**不受語言限制** — 可偵測土耳其語、阿拉伯語、俄語、西班牙語及其他語言中的違規。
