# Grist

**Grist** ノードは、Grist スプレッドシート内のデータを読み取り、書き込み、管理します。CRUD 操作、バッチ更新、スプレッドシートの自動化にご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.records`、`$nodeLabel.record`、`$nodeLabel.success`、`$nodeLabel.id` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) の Grist 認証情報 |
| `gristOperation` | string | 操作: `getRecord`、`getRecords`、`createRecord`、`createRecords`、`updateRecord`、`updateRecords`、`deleteRecord`、`listTables`、`listColumns` |
| `gristDocId` | expression | ドキュメント ID（Grist の URL から取得） |
| `gristTableId` | expression | テーブル ID |
| `gristRecordId` | expression | レコード ID（単一レコード操作） |
| `gristRecordData` | JSON string | 作成／更新時のフィールド値。ラベルではなく**カラム ID**（例: `User_Name`）を使用してください。 |
| `gristRecordsData` | JSON string | バッチ操作用のレコード配列 |
| `gristFilter` | JSON string | フィルター: `{"Column_ID": [values]}` |
| `gristSort` | string | ソート: `Column_ID` または `-Column_ID`（降順） |
| `gristLimit` | number | 最大レコード数（デフォルト: 100） |

## カラム ID とラベル

`gristRecordData` およびフィルターでは、表示ラベルではなく**カラム ID**（アンダースコア形式、例: `User_Name`）を使用してください。カラム ID を確認するには `listColumns` を使用します。

## 例 – レコードの取得

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## 例 – レコードの作成

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials タブ](../tabs/credentials-tab.md) – Grist API キーの追加
- [サードパーティ統合](../reference/integrations.md#grist) – Grist 認証情報の設定
