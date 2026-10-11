# エラーのスロー

**Throw Error** ノードは、Workflow の実行を直ちに停止し、カスタム HTTP ステータスコードを含むエラーレスポンスを返します。バリデーションの失敗、不正アクセス、その他のエラー条件に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 0 |
| 出力結果 | Workflow が停止し、呼び出し元にエラーレスポンスが返されます |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `errorMessage` | expression | エラーメッセージ（式をサポート） |
| `httpStatusCode` | number | HTTP ステータスコード（例：400、401、403、404、429、500） |

## 一般的なステータスコード

| コード | 用途 |
|------|----------|
| 400 | Bad Request（無効な入力） |
| 401 | Unauthorized（認証が必要） |
| 403 | Forbidden（アクセス拒否） |
| 404 | Not Found（リソースが存在しない） |
| 422 | Unprocessable Entity（バリデーションエラー） |
| 429 | Too Many Requests（レート制限） |
| 500 | Internal Server Error |

## 例

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

[Condition](./condition-node.md) と組み合わせて入力を検証し、無効な場合にのみ Throw Error を実行します：
- Condition が true → Output へ進む
- Condition が false → Throw Error

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Condition Node](./condition-node.md) – 実行前に検証する
- [Error Handler](./error-handler-node.md) – 他のノードからのエラーをキャッチする
