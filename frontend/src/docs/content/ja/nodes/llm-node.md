# LLM

**LLM** ノードは、言語モデルを使用してテキストを処理したり、画像を生成したりします。テキスト生成、vision（画像入力）、画像生成、構造化 JSON 出力、および対応するテキストモデル向けのプロバイダーネイティブな **Batch API** 実行をサポートします。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1、および batch モードが有効な場合はオプションで `batchStatus` |
| 出力内容 | `$nodeLabel.text`（テキスト）、`$nodeLabel.image`（画像）、または `$nodeLabel.results` などの batch 結果フィールド |

## パラメータ

### Credential & Model

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) から取得した LLM credential |
| `model` | string | モデル名（例：`gpt-4o`、`gemini-2.5-flash-lite`、画像用の `nanobanana`） |
| `fallbackCredentialId` | UUID（オプション） | プライマリ失敗時のフォールバック credential |
| `fallbackModel` | string（オプション） | プライマリ失敗時のフォールバックモデル |

プライマリの credential またはモデルがエラーを返した場合、ノードは失敗する前にフォールバック credential とモデルで自動的に再試行します。

Heym はまた、選択された credential とモデルから **batch 機能** を確認します。batch モードは以下で利用可能です：

- OpenAI credential
- 必要な `/v1/files` および `/v1/batches` API を endpoint が公開している Custom / OpenAI 互換 credential

選択されたプロバイダーまたはモデルが batch 実行をサポートしていない場合、Properties パネルにその旨が直接表示され、トグルが無効になります。

### Prompts（テキストモード）

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `systemInstruction` | string | システム Prompt。[式](../reference/expression-dsl.md)をサポートします。 |
| `userMessage` | string | ユーザーメッセージ。デフォルト：`$input.text` |
| `temperature` | number | 0.0～2.0（デフォルト：0.7） |
| `maxTokens` | number | 最大応答 Token 数（オプション） |
| `requestTimeoutSeconds` | number | モデル応答を待機する最大秒数（タイムアウトまで、デフォルト：60）。低速なプロバイダーやセルフホスト型プロバイダー（LiteLLM、vLLM、ローカルモデル）では値を増やしてください。 |

### Image & Output

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | テキストまたは画像生成 |
| `imageInputEnabled` | boolean | ユーザーメッセージに画像を含める（vision） |
| `imageInput` | expression | Base64 データ URL または画像 URL |
| `jsonOutputEnabled` | boolean | 構造化 JSON 出力 |
| `jsonOutputSchema` | string | 構造化出力用の JSON Schema |
| `extraBodyEnabled` | boolean | プロバイダー固有のリクエストパラメータを送信（デフォルト：`false`） |
| `extraBody` | string | API リクエストボディにマージされる JSON オブジェクト |

### Reasoning モデル（o1、o3）

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `isReasoningModel` | boolean | reasoning モデルで有効化 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | reasoning の深さ |

### Batch モード

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | 単一リクエスト実行の代わりにプロバイダーネイティブな Batch API を使用 |

batch モードは **LLM** ノードでのみ利用可能です。[Agent Node](./agent-node.md) には適用され **ません**。

batch モードが有効な場合：

- `outputType` は `text` のままである必要があります
- `imageInputEnabled` は `false` のままである必要があります
- `userMessage` は **配列** に解決される必要があります
- 各配列項目は文字列またはプリミティブ値に解決される必要があります

一般的な例：

- `$input.items.map("item.text")`
- `$vars.promptList`

式が配列ではなく単一の文字列に解決された場合、プロバイダー呼び出しが開始される前に検証エラーで実行が失敗します。

## Batch Status ブランチ

batch モードが有効な場合、LLM ノードは 2 つ目の出力ハンドル `batchStatus` を公開します。

このブランチは、batch の実行中に通知、ログ記録、Slack メッセージ、または副作用のために使用します。このブランチは、プロバイダーのステータスが意味のある変化をしたときに常に発火し、以下のような正規化された状態を含みます：

- `pending`
- `processing`
- `completed`
- `failed`

status ブランチの Payload は、下流のノード内で `$input` として利用でき、以下を含みます：

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

エッジの例：

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

status マッパーの例：

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

## Batch 結果の形状

正常に完了すると、メインの LLM 出力には以下が含まれます：

- `$nodeLabel.text` – 成功したテキストを連結したもの
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – 元の順序での項目ごとの結果
- `$nodeLabel.usage`

`$nodeLabel.results` の各項目には、以下のようなフィールドが含まれます：

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

**JSON 出力** が batch モードとともに有効な場合、Heym は成功した各項目を個別にパースします。パースされたオブジェクトは項目ごとに公開され、`parsedResults` に収集されます。
## Responses API

**Use Responses API** チェックボックスを有効にすると、ノードの呼び出しは Chat Completions ではなく [Responses API](https://platform.openai.com/docs/api-reference/responses) を経由するようになります。デフォルトではオフになっており、どちらの場合でもノードの動作は同じです。同じ Prompt、同じ JSON 出力スキーマ、同じ結果の形状となります。

これは OpenAI 認証情報で動作し、また Endpoint をサポートするゲートウェイを持つカスタム認証情報でも動作するため、セルフホスト環境やプロキシ環境でも利用できます。Google 認証情報では無効のままとなり、[Batch モード](#batch-status-branch) と組み合わせることはできません。特定の認証情報がどちらの状態にあるかは、実行前にノードパネルに表示されます。

実行時に Endpoint が利用できない場合、ノードは暗黙的にフォールバックするのではなく、原因を明示したメッセージとともに失敗します。そのため、Responses API 用に構成されたノードは常にそれを経由して実行されます。意図的に別の認証情報やモデルへフォールバックするには、**Fallback Credential** および **Fallback Model** フィールドを使用してください。これらはこのチェックボックスを継承するため、フォールバック先の認証情報も Endpoint をサポートしている必要があります。

## Image Generation

- **Models:** `nanobanana`、`gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image`（base64 データ URL）
- Prompt に [Input](./input-node.md) を使用する場合は、`userMessage` 内で `$userPrompt.body.text` を使用してください。

## JSON Output

`jsonOutputEnabled` が true の場合、LLM はスキーマに一致する JSON を返します。フィールドには `$nodeLabel.fieldName` でアクセスできます。

## Extra Body

一部のプロバイダーは、標準の OpenAI 互換フィールドではカバーされないリクエストパラメータ（モデルの思考モードの無効化など）を受け付けます。ノードプロパティで **Send extra request body** を有効にし、JSON オブジェクトを入力してください。これはこのノードが行うすべての API リクエストにマージされます。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **デフォルトでは無効です。** チェックボックスがオフの場合、追加のものは送信されません。
- JSON **オブジェクト** である必要があります。配列、スカラー、または不正な形式のテキストは、暗黙的に破棄されるのではなく、`Invalid extra body JSON` でノードが失敗します。
- チェックボックスの隣にある **Format** ボタンは JSON を再フォーマットし、テキストがパースできない場合は赤く `Invalid` と表示されます。
- メインの補完、フォールバックモデルの試行、および Batch モードのリクエストに適用されます。Image Generation や Guardrail チェックには適用されません。これらは異なるリクエスト形状と別のモデルを使用します。
- `$` 式はパース前に解決されるため、`{"max_tokens": $prev.limit}` は機能します。これはテキスト置換であるため、解決された値にダブルクォートや改行が含まれていると不正な JSON となり、ノードが失敗します。

## Example – Text

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

## Example – Batch text

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

## Example – Image generation

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

ノードプロパティで **Guardrails** を有効にすると、LLM 呼び出しの前に安全でないユーザーメッセージをブロックできます。完全なリファレンスについては [Guardrails](../reference/guardrails.md) を参照してください。

## Related

- [Agent Node](./agent-node.md) – ツール呼び出しを伴う LLM
- [Why Heym](../getting-started/why-heym.md) – エージェントライフサイクルにおける LLM ステップの位置づけ
- [Guardrails](../reference/guardrails.md) – 安全でないコンテンツカテゴリのブロック
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Expression DSL](../reference/expression-dsl.md) – Prompt 内でのデータ参照
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Prompt 用のライブバックエンドプレビュー付き拡張エディタ
- [Credentials Tab](../tabs/credentials-tab.md) – LLM API キーの追加
- [Quick Start](../getting-started/quick-start.md) – 基本的な LLM Workflow
