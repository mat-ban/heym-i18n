# 程式碼

**Code** 節點會執行您撰寫的 Python 程式碼，並搭配其專屬的 `requirements.txt`，然後回傳 JSON。每次執行都會取得一個全新的容器，並在執行結束時銷毀，因此一次執行永遠無法看見或影響另一次執行。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.result`（即 `main` 回傳的任何內容），以及 `$nodeLabel.logs` 和 `$nodeLabel.install` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `codeSource` | string | Python 原始碼。必須定義 `main(params)` 並回傳可序列化為 JSON 的值 |
| `codeParameters` | expression | 一個 JSON 物件，將 Workflow 資料接入程式碼。Expression 會在程式碼執行前解析完畢 |
| `codeRequirements` | string | `requirements.txt` 的內容，每行一個套件。留空則略過安裝 |
| `codeAllowNetwork` | boolean | 程式碼本身是否可以存取網路（預設為 `false`） |

## `main` 函式

您的程式碼必須定義一個頂層的 `main`，並接受一個參數：

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

模組層級的陳述式確實會執行，但只有 `main` 回傳的內容會成為節點的輸出。

編輯器會顯示行號，而 **Format** 旁的展開按鈕會開啟一個較大的編輯器，並以 `Esc` 關閉——編輯會隨您輸入即時套用，因此沒有需要儲存的內容。**Format** 按鈕會使用 Ruff 重新格式化您的程式碼，並保留註解。它也會修復貼上時通常造成的縮排損壞：統一的縮排區塊、混用 tab 與空格，以及某一行與其所屬區塊差了一兩個空格的情況，都會被修復而非拒絕。真正的語法錯誤則會連同行與欄的位置一併回報。格式化會在與節點執行時相同的隔離容器中執行——沒有網路、沒有後端環境——因此它與執行一樣需要 Docker。

## 讀取參數

`params` 支援點記法，包括穿透巢狀物件與清單：

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` 可讀取非合法 Python 識別字的鍵
- `params.get("maybe")` 在鍵不存在時回傳 `None`，而非引發錯誤
- `params.to_dict()` 回傳純字典
- 讀取從未提供的鍵會引發錯誤，並指出該鍵的名稱以及列出可用的鍵

## 輸出

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main` 的回傳值。下游節點會讀取 `$nodeLabel.result.message`
- `logs` — 程式碼傳送給 `print` 的所有內容，會個別擷取，因此永遠不會破壞 result
- `install` — 安裝相依套件所使用的工具（`uv`、`pip` 或 `none`）及其輸出

## 相依套件

在 `requirements.txt` 中列出套件，就如同您在本機所列的一樣：

```
requests==2.32.3
feedparser
```

套件會在程式碼執行前，使用 `uv` 安裝到一個用完即丟的目錄中；若 `uv` 無法處理某個套件，Heym 會改用 `pip` 重試。每次執行之間不會快取任何內容，因此笨重的相依套件會為每次執行增加數秒的時間。將 `requirements.txt` 留空會完全略過安裝步驟，並明顯加快速度。

未隨附 wheel 且需要 C 編譯器的套件將會安裝失敗。原因會顯示在 `install.log` 中。

## 網路

| 階段 | 網路 |
|-------|---------|
| 安裝相依套件 | 一律開啟——pip 與 uv 必須連線至 PyPI |
| 執行您的程式碼 | 預設關閉。`codeAllowNetwork` 可將其開啟 |

在 `codeAllowNetwork` 關閉的情況下，諸如 `requests.get(...)` 的對外呼叫會以連線錯誤失敗。這是刻意設計的預設值：大多數 Code 節點所轉換的資料，都是由另一個節點所擷取的。建議改用 **HTTP** 節點擷取，並透過 `codeParameters` 傳入其 body。

## 沙箱與限制

您的程式碼會以非 root 使用者的身分，在一個已捨棄所有 Linux capabilities、設定了 `no-new-privileges`，且根檔案系統為唯讀的容器中執行。它不會取得任何 Docker socket，也無法取得後端的任何機密或環境。

| 限制 | 值 |
|-------|-------|
| 記憶體 | 512 MB |
| CPU | 1 |
| 處理程序 | 256 |
| 相依套件安裝逾時 | 120 秒 |
| 執行逾時 | 60 秒 |

這些是沙箱的固定屬性，並非可設定項目。

> **必須使用 Docker。** 與 Agent Python 工具及 skills 不同，Code 節點沒有本機後援模式，也沒有可放寬此限制的環境變數。若沒有可連線的 Docker daemon，節點會以明確的錯誤失敗，而不會在後端處理程序中執行您的程式碼。在原生 `./run.sh` 開發環境中，請先啟動 Docker 再使用此節點。請參閱 [Security → Code node sandbox](../reference/security.md#code-node-sandbox)。

## 適用時請改用其他節點

| 您想要 | 使用 |
|-------------|-----|
| 解析或建構 CSV、TSV、XML，或對檔案進行 OCR | [Converter](converter-node.md) |
| 呼叫 HTTP API | [HTTP](http-node.md) |
| 對應或重新命名欄位 | [Set](set-node.md) |
| 執行另一個 Workflow | [Execute](execute-node.md) |

當邏輯確實無法以上述節點滿足時——自訂數學運算、特殊解析，或某種演算法——才使用 **Code**。
## 範例

由上游節點產生的評分資料列：

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

將 `codeParameters` 設為 `{ "rows": "$fetchRows.result" }` 後，下游節點即可讀取 `$scoreRows.result.total`。
