# MCP 調用節點

**MCP Call** 節點會直接呼叫特定的 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 工具，而不需由 LLM 決定要叫用哪個工具。當你確切知道要呼叫哪個工具，並希望以確定性的單一步驟執行時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.result` |

## 使用時機

在下列情況下使用 MCP Call 節點：
- 你在設計階段就確切知道要呼叫哪個 MCP 工具
- 你不需要 LLM 在工具之間做選擇
- 你希望針對單一工具叫用，使用比 agent 節點更輕量、更具確定性的替代方案

當應由 LLM 決定要呼叫哪些工具，或你需要多步驟推理時，請改用 [Agent 節點](./agent-node.md)。

> MCP Call 節點**無法**作為工具連接至 agent 節點。

## 連線設定

此節點會連線至單一 MCP 伺服器。請選擇一種傳輸方式並填入對應欄位。

### SSE / Streamable HTTP

| 欄位 | 說明 |
|-------|-------------|
| `transport` | `sse` 或 `streamable_http` |
| `url` | MCP 伺服器的完整 URL（例如 `https://mcp.example.com/sse`）。支援 DSL 表達式。 |
| `headers` | HTTP 標頭的 JSON 物件（例如 `{"Authorization": "Bearer ..."}`） |
| `timeoutSeconds` | 每次連線的逾時秒數（預設：30） |

### stdio

| 欄位 | 說明 |
|-------|-------------|
| `transport` | `stdio` |
| `command` | 要執行的執行檔（例如 `npx`） |
| `args` | 引數的 JSON 陣列（例如 `["-y", "@modelcontextprotocol/server-filesystem"]`） |
| `env` | 環境變數的 JSON 物件（例如 `{"API_KEY": "..."}`） |
| `timeoutSeconds` | 每次連線的逾時秒數（預設：30） |

## 工具選擇

1. 填入連線欄位。
2. 點擊 **Fetch Tools** — 節點會連線至 MCP 伺服器並列出可用的工具。
3. 從下拉式選單中選擇一個工具。

**必須選擇工具。** 若未選擇工具，節點將不會執行。

## 引數

選擇工具後，節點會針對該工具輸入 schema 中定義的每個引數，呈現一個輸入欄位。每個欄位可接受：
- 靜態值：`10`
- DSL 表達式：`$userInput.body.text`

必填引數會以 `*` 標示。

## 輸出

| 欄位 | 說明 |
|-------|-------------|
| `$nodeLabel.result` | 工具結果。若回應為有效的 JSON，此為解析後的物件。否則為字串。 |

## 範例

在 SSE MCP 伺服器上呼叫 `search` 工具，並傳入使用者的查詢：

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

在下游存取結果：

```
$searchCall.result.items   ← 若 result 為 JSON 物件
$searchCall.result         ← 若 result 為純字串
```

## 備註

- 節點會在呼叫工具之前，解析 `url`、`headers`、`env` 以及所有 `toolArguments` 值中的 DSL 表達式。
- 節點層級的 `timeoutSeconds` 適用於整體執行；`connection.timeoutSeconds` 則適用於 MCP 工作階段本身。
- 若 MCP 伺服器無法使用或傳回錯誤，節點會失敗，且錯誤訊息可在 workflow trace 中取得。
