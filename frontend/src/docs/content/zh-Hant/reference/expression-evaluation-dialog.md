# 表達式評估對話方塊

表達式評估對話框是支援表達式欄位的擴充編輯器。它可從表達式輸入旁的展開按鈕開啟，並在單一位置提供您更大的工作空間、自動完成、即時後端預覽，以及輸出瀏覽功能。

## 開啟對話框

- 在 Properties 面板中，點擊表達式欄位旁的展開按鈕。
- 多行欄位會將按鈕顯示於輸入內容內。
- 單行欄位會將按鈕顯示於輸入內容右側。

## 對話框版面配置

- 對話框會以置中強制回應視窗開啟，大小約為 **80vw × 80vh**。
- 當欄位標籤已知時，標題會顯示 **Evaluate — {field name}**。
- 編輯器會保留自動完成、欄位間導覽，以及常見的 **Apply** / **Cancel** 動作。
- 當您停止輸入約 **300 ms** 後，預覽會自動重新整理。
- 按下 `Ctrl` / `Cmd` + `Enter`，可將目前文字套用回欄位並關閉對話框（與 **Apply** 相同）。

## Output 區段

當您在編輯器中暫停輸入後，Output 區域會自動重新整理。

### 評估

| 表達式類型 | 結果 |
|---|---|
| 單一 `$expr`（整個欄位） | 保留原生值 |
| 單一裸點路徑（整個欄位，無 `$`，且未內嵌換行） | 與 `$` + 該路徑相同（後端會正規化以供評估） |
| 內嵌 `$refs` 的文字 | 最終結果一律為字串 |
| 常值文字（無 `$`，且不是單一點路徑） | 依原樣傳回 |

**範例**

| 輸入 | 結果 |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items`（當整個值就是此路徑時，與 `$input.items` 相同） | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

評估情境會依下列順序建立：

- 上游節點上的 **Pinned data**
- 畫布上的 **Last run outputs**
- 當沒有可用的上游資料時為 `null`

如果目前節點有上游相依項目，但其中沒有任何項目具有 pinned data 或最近的執行結果，對話框會先執行測試運行以建立情境，然後再評估目前文字。

### Output 路徑選擇器

當後端結果是物件或陣列時，Output 區域可以顯示互動式路徑選擇器，而非原始 JSON。

- 連按兩下某一列，將該路徑附加到目前的 `$node.path` 參照。
- 單擊可展開的列，以開啟或關閉分支。
- 使用內建的查詢方塊來搜尋鍵、值與路徑字串。

## 自動完成

- 輸入 `$` 以開啟上游節點、內建項目與方法的建議。
- 按下 `Tab` 或 `Enter` 以插入選取的建議。
- 使用 `↑` / `↓` 在建議清單中移動。

### 範例答案

當您以點號繼續 `$…` 參照時，每個建議列都會在該列右側以粗體顯示該建議會產生的答案。

- 輸入 `$set.listItems.first().toString().u` 會列出 `upper`、`urlEncode`、`urlDecode` 與 `unescape`，並各自附上其評估結果 — 因此您可以依結果而非名稱來挑選。
- 輸入 `$node.text.toJson()` 會將 JSON 字串解析為物件或陣列。在 `.toJson()` 之後，當 last-run 或 pinned output 可用時，自動完成可以提供解析後的鍵（例如 `repoUrl`）。
- 結果會在後端依據對話框預覽所使用的相同 pinned data 與 last-run outputs 進行評估，因此它們會與該欄位將產生的結果相符。
- 只有可獨立成立的建議會被評估：零引數方法（`upper()`、`first()`、`keys()`、`toJson()`）與純屬性（`length`、`year`）。需要先提供引數的建議 — `map`、`filter`、`sort`、`replace` — 會留空。
- 當候選項目未產生任何答案時，該列會保持空白：錯誤、`null`，或是不適用於該值的方法。
- 答案會縮短為一行。將游標停留在縮短後的答案上可查看更多內容。

## 使用 AI 建置

當已載入 Workflow 時，評估對話框右上角會顯示 **Build with AI** 按鈕。它會開啟巢狀強制回應視窗，您可以在其中以純文字描述想要表達式，並讓 LLM 為您產生。

### 運作方式

1. 在評估對話框工具列中點擊 **Build with AI**。
2. 從下拉式選單中選取 LLM 認證與模型。
3. 輸入您想要內容的純文字描述 — 例如 *"Get the customer name from the API response"*。
4. 點擊 **Generate**。此強制回應視窗會呼叫後端，後端會使用 [Expression DSL](./expression-dsl.md) 系統 Prompt 加上您上次 Workflow 執行的輸出作為情境，並傳回單一表達式字串。
5. 產生的表達式會立即依據相同的畫布資料進行評估，因此您可以在套用前先查看結果。
6. 點擊 **Apply** 以用產生的表達式取代編輯器內容，或點擊 **Regenerate** 再試一次。

### 使用的情境

產生器會接收畫布上上次測試運行的節點輸出。如果 Workflow 尚未執行，LLM 會根據節點標籤與 DSL 慣例產生盡力而為的表達式。

### 需求

- 必須在 [Credentials](./credentials.md) 索引標籤中設定 LLM 認證（OpenAI、Google 或 Custom）。
- Workflow 必須在編輯器中開啟。

## 鍵盤快速鍵

| 快速鍵 | 動作 |
|---|---|
| 輸入暫停（約 300 ms） | 重新整理後端預覽 |
| `Ctrl` / `Cmd` + `Enter` | 套用並關閉對話框 |
| `Escape` | 先關閉自動完成，否則關閉對話框 |
## 方法參數中的巢狀 `$`

對於對話框／後端評估，當你需要動態鍵值時，可以在 `.get($other.field)` 這類呼叫中傳入另一個帶有巢狀 `$` 的參照。你也可以在 `.get(...)` 內使用裸路徑（例如 `other.field`）；後端會以相同方式解析。已儲存的 Workflow 欄位仍應遵循 [Expression DSL](./expression-dsl.md) 規則；evaluate API 亦接受整行裸點路徑以提供便利性（請參閱上表）。

## 導覽

Set 與 Execute 對應編輯器可顯示 **Prev** / **Next** 按鈕，讓你能在欄位之間移動，而無需關閉對話框。

## 相關

- [Expression DSL](./expression-dsl.md)
- [節點類型](./node-types.md)
- [Credentials](./credentials.md) — Build with AI 功能所需
- [LLM 節點](../nodes/llm-node.md)
- [輸出節點](../nodes/output-node.md)
- [Condition 節點](../nodes/condition-node.md)
