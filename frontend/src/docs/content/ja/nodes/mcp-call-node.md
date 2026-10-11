# MCP 呼び出しノード

**MCP Call** ノードは、LLM にどのツールを呼び出すかを判断させることなく、特定の [Model Context Protocol (MCP)](https://modelcontextprotocol.io) ツールを直接呼び出します。呼び出すツールが明確であり、決定論的な単一ステップの実行を行いたい場合に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | `$nodeLabel.result` |

## 使用する場面

MCP Call ノードは、以下の場合に使用します：
- 設計時に呼び出す MCP ツールが正確に分かっている場合
- ツールの選択に LLM を必要としない場合
- 単一のツール呼び出しに対して、agent ノードの代わりに軽量で決定論的な選択肢を求める場合

LLM にどのツールを呼び出すかを判断させたい場合や、多段階の推論が必要な場合は、代わりに [Agent ノード](./agent-node.md) を使用してください。

> MCP Call ノードは、ツールとして agent ノードに接続することは**できません**。

## 接続設定

このノードは単一の MCP サーバーに接続します。transport を選択し、対応するフィールドを入力してください。

### SSE / Streamable HTTP

| フィールド | 説明 |
|-------|-------------|
| `transport` | `sse` または `streamable_http` |
| `url` | MCP サーバーの完全な URL（例：`https://mcp.example.com/sse`）。DSL 式をサポートします。 |
| `headers` | HTTP ヘッダーの JSON オブジェクト（例：`{"Authorization": "Bearer ..."}`） |
| `timeoutSeconds` | 接続ごとのタイムアウト（秒単位、デフォルト：30） |

### stdio

| フィールド | 説明 |
|-------|-------------|
| `transport` | `stdio` |
| `command` | 実行する実行可能ファイル（例：`npx`） |
| `args` | 引数の JSON 配列（例：`["-y", "@modelcontextprotocol/server-filesystem"]`） |
| `env` | 環境変数の JSON オブジェクト（例：`{"API_KEY": "..."}`） |
| `timeoutSeconds` | 接続ごとのタイムアウト（秒単位、デフォルト：30） |

## ツールの選択

1. 接続フィールドを入力します。
2. **Fetch Tools** をクリックします — ノードが MCP サーバーに接続し、利用可能なツールを一覧表示します。
3. ドロップダウンからツールを選択します。

**ツールの選択は必須です。** ツールが選択されていない場合、ノードは実行されません。

## 引数

ツールを選択すると、ノードはツールの入力スキーマで定義された引数ごとに 1 つの入力フィールドを表示します。各フィールドは以下を受け付けます：
- 静的な値：`10`
- DSL 式：`$userInput.body.text`

必須の引数には `*` が付きます。

## 出力

| フィールド | 説明 |
|-------|-------------|
| `$nodeLabel.result` | ツールの結果。レスポンスが有効な JSON の場合、これはパースされたオブジェクトです。それ以外の場合は文字列です。 |

## 例

SSE MCP サーバー上の `search` ツールを呼び出し、ユーザーのクエリを渡します：

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

後続のステップで結果にアクセスします：

```
$searchCall.result.items   ← result が JSON オブジェクトの場合
$searchCall.result         ← result がプレーンな文字列の場合
```

## 注意事項

- ノードは、ツールを呼び出す前に `url`、`headers`、`env`、およびすべての `toolArguments` の値にある DSL 式を解決します。
- ノードレベルの `timeoutSeconds` は実行全体に適用され、`connection.timeoutSeconds` は MCP セッション自体に適用されます。
- MCP サーバーが利用できないか、エラーを返した場合、ノードは失敗し、エラーメッセージは workflow trace で確認できます。
