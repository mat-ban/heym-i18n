# エラーハンドラー

**Error Handler** ノードは、Workflow 内の任意のノードから発生したエラーをキャッチします。配置されている場合、いずれかのノードが失敗すると自動的に実行されます。受信接続は不要で、Workflow エンジンによってトリガーされます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0（エラー時にトリガー） |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.error`、`$nodeLabel.errorNode`、`$nodeLabel.errorNodeType`、`$nodeLabel.timestamp` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `message` | expression | 任意。デフォルト: `$error.message` |

## エラーコンテキスト

Error Handler の実行時には、以下のフィールドが利用可能です：

| フィールド | 説明 |
|-------|-------------|
| `$errorHandler.error` | エラーメッセージ文字列 |
| `$errorHandler.errorNode` | 失敗したノードのラベル |
| `$errorHandler.errorNodeType` | 失敗したノードのタイプ |
| `$errorHandler.timestamp` | エラーが発生した時刻 |

## ユースケース

- 失敗時に [Telegram](./telegram-node.md)、[Slack](./slack-node.md)、または [Send Email](./send-email-node.md) の通知を送信する
- 外部システムへエラーをログ記録する
- [Output](./output-node.md) を介してカスタムエラーレスポンスを返す

Error Handler は Workflow ごとに 1 つだけ配置できます。

## 例

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

カスタムエラーレスポンスのために Output へ接続します：
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

または通知のために Slack へ接続します：
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Telegram Node](./telegram-node.md) – エラー時の通知
- [Slack Node](./slack-node.md) – エラー時の通知
- [Send Email Node](./send-email-node.md) – メールアラート
- [Throw Error Node](./throw-error-node.md) – 意図的なエラー
