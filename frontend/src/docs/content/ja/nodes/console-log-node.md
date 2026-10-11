# コンソールログ

**Console Log** ノードは、バックエンド（サーバー）のコンソールに値をログ出力します。開発中のデバッグや検査にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | 入力をそのまま通過させます |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `logMessage` | expression | ログ出力する値。[式](../reference/expression-dsl.md)をサポートします。 |

## 例

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

出力はサーバーログ（例：`uvicorn` 実行時のターミナル出力）に表示されます。

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Logs タブ](../tabs/logs-tab.md) – アプリケーションログの表示
