# 入力

**Input** ノードは、ユーザーまたは API 呼び出し元からデータを受け取る Workflow のエントリーポイントです。単一または複数の入力フィールドをサポートし、リクエストメタデータ（headers、query params）を公開します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力 | `$nodeLabel.body.fieldKey`、`$nodeLabel.headers`、`$nodeLabel.query` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `value` | string | 単一テキスト入力のデフォルト値（任意） |
| `inputFields` | array | 入力フィールド定義。各要素：`{ key, defaultValue? }` |

### 入力フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `key` | string | フィールドキー（例：`text`、`imageUrl`、`base64`） |
| `defaultValue` | string | 未指定時のデフォルト値（任意） |

## 入力データへのアクセス

**Body フィールド**（常に `$nodeLabel.body.fieldKey` を使用）：

- `$userInput.body.text` – テキストフィールド
- `$userInput.body.imageUrl` – 画像 URL
- `$userInput.body.userId` – 設定されている場合はデフォルト値付き
- `$userInput.body.event.user.id` – Generic webhook モードからのネストされた JSON

**リクエストメタデータ**（API 経由で実行された場合）：

- `$userInput.headers` – すべての headers（キーは小文字）
- `$userInput.headers.authorization` – 特定の header
- `$userInput.query` – query parameters
- `$userInput.query.param1` – 特定の query param

## Run パネルのファイル入力

エディターの **Run** タブ（Defined webhook モード）では、各入力フィールドがドラッグアンドドロップとインライン添付コントロール（フィールドの右下）をサポートします：

- **テキストファイル**（`.txt`、`.md`、`.json`、`.csv` など）はプレーンテキストとして読み込まれます。
- **画像**（JPEG、PNG、GIF、WebP）は `data:` URL（base64）としてフィールド値に格納されます。下流のノードが画像データを期待する場合は、`imageUrl` や `base64` などのフィールドキーを使用してください。
- **PDF** ファイルは抽出されたテキストに変換されます（最大 5 MB のファイル、10 万文字のコンテンツ）。

1 フィールドにつき 1 ファイルです。ファイルの読み込み後もテキストエリアを編集できます。Generic webhook モード（raw JSON body）では、フィールドごとのファイルコントロールは表示されません。

## 入力フィールドと Generic Webhooks

`inputFields` は、defined モードのエディターフォーム、sub-workflow のマッピング、その他のメタデータ駆動型のサーフェスにおいて、引き続き期待される入力を記述します。

Workflow が **Generic** webhook body モードを使用する場合、受信する HTTP body は `inputFields` から再形成されません。代わりに、raw JSON payload がそのまま `$nodeLabel.body` に渡され、Input ノードのフィールド追加・削除コントロールはノードパネルで非表示になります。

## 例

**単一入力（デフォルト）：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**複数入力：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Triggers](../reference/triggers.md) – エントリーポイント（Input、Cron、RabbitMQ）
- [Expression DSL](../reference/expression-dsl.md) – `$nodeLabel.body`、`$nodeLabel.query` の参照
- [Portal](../reference/portal.md) – Workflow をチャット UI として公開
- [Webhooks](../reference/webhooks.md) – Workflow の HTTP trigger
