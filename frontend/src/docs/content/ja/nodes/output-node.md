# 出力

**Output** ノードは、呼び出し元にレスポンスを返す Workflow のエンドポイントです。必ず前のノードをラベルで参照してください。`$input` は決して使用しないでください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1（任意、非同期の後処理用） |
| Output | 呼び出し元に `message` を返します |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `message` | expression | 出力値。前のノードを参照する**必要があります**: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | true の場合、output より後のノードはレスポンス送信後に非同期で実行されます |

## Agent tool としての使用

Output ノードがキャンバスノードツールとして [Agent Node](./agent-node.md) に接続されている場合、`message` フィールドはボットアイコン付きで **agent-provided** としてマークできます。この場合、agent がツールを呼び出す際に message を提供します。Output ノードが agent tool として接続されていない場合、ボットアイコンは非表示になります。

## 重要なルール

**output ノードでは `$input` を決して使用しないでください。** 必ず前のノードのラベルを使用してください:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"`（`processData` は前のノードのラベル）

## 非同期の後処理

`allowDownstream: true` の場合、レスポンスは即座に返されます。output の後に接続されたノードはバックグラウンドで実行されます（例: Slack 通知、ログ記録）。ダウンストリームの末尾が後から完了する可能性があるため、ダウンストリームの失敗は、早期レスポンスがすでに返された後に記録された実行ステータスを `error` に変更することがあります。最終的な履歴と分析には、その後の結果が反映されます。

## 例

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## 例 – 非同期あり

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

その後、output の後に [Telegram](./telegram-node.md)、[Slack](./slack-node.md)、またはその他のノードを接続して、fire-and-forget 通知を行います。

## 関連

- [JSON output mapper](./json-output-mapper-node.md) – 唯一の終端ノードの場合、`result` でラップされないルート JSON ボディ
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Expression DSL](../reference/expression-dsl.md) – ノード出力の参照
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – message のライブバックエンドプレビュー付き拡張エディタ
- [Workflow Structure](../reference/workflow-structure.md) – JSON フォーマット
