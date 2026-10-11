# BigQuery

**BigQuery** ノードは、BigQuery REST API v2 を介して SQL クエリを実行し、Google BigQuery データセットへ行を挿入します。大規模な分析データセットへのクエリや、Workflow データからテーブルへの行のストリーミング挿入にご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | BigQuery (OAuth2) |
| 出力 | `$nodeLabel.rows`、`$nodeLabel.total`、`$nodeLabel.schema`、`$nodeLabel.insertedCount`、`$nodeLabel.errors` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) の BigQuery credential |
| `bqOperation` | string | 操作: `query` または `insertRows` |
| `bqProjectId` | expression | Google Cloud プロジェクト ID（例: `my-gcp-project`） |
| `bqQuery` | expression | SQL クエリ文字列。`query` の場合に必須です。 |
| `bqMaxResults` | string | `query` で返される最大行数（デフォルト `1000`）。 |
| `bqDatasetId` | expression | データセット ID（例: `my_dataset`）。`insertRows` の場合に必須です。 |
| `bqTableId` | expression | テーブル ID（例: `my_table`）。`insertRows` の場合に必須です。 |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows` の場合: **Raw** = JSON 配列全体、**Selective** = 単一行をキーと値のフィールドペアとして指定。 |
| `bqRows` | expression | raw モード用の行オブジェクトの JSON 配列（例: `[{"col": "$input.value"}]`）。 |
| `bqMappings` | array | selective モード用のキーと値のペア。各キーはカラム名、各値は expression です。 |

## Credential の設定

BigQuery は **OAuth2 の「Bring Your Own App」** モデルを採用しています。お客様自身の Google Cloud OAuth2 認証情報をご用意いただきます。

**バックエンド設定:** Heym バックエンドの **`FRONTEND_URL`** を、アプリの公開 URL（ユーザーがブラウザに入力するアドレス）に設定してください（例: `https://your-heym-domain`）。OAuth リダイレクト URI は常に `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` となります。

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** に移動し、**BigQuery API** を有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** に移動し、**Web application** を選択します。
3. **Authorized redirect URIs** に、正確に `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback` を追加します。
4. **Client ID** と **Client Secret** をコピーします。
5. Heym Dashboard → **Credentials** → **New** に移動し、**BigQuery (OAuth2)** を選択します。
6. Client ID、Client Secret、名前を入力し、**Connect** をクリックしてブラウザのポップアップで OAuth2 の同意を完了します。

Token はバックグラウンドで自動的に更新されます — 手動での Token 管理は不要です。

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|-----------------|-------------|
| `query` | bqProjectId、bqQuery | SQL クエリを実行し、行を返します |
| `insertRows` | bqProjectId、bqDatasetId、bqTableId、bqRows または bqMappings | ストリーミング insertAll API を介して 1 行以上の行を挿入します |

## 出力リファレンス

| 操作 | 出力フィールド | 型 | 説明 |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | 行オブジェクトの配列（カラム名 → 値） |
| `query` | `.total` | number | 返された行数 |
| `query` | `.schema` | array | テーブルスキーマのフィールド |
| `insertRows` | `.insertedCount` | number | 正常に挿入された行数 |
| `insertRows` | `.errors` | array | 行ごとの挿入エラー（完全に成功した場合は空） |

## 例 – クエリの実行

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

出力へのアクセス: `$getUsers.rows`（行オブジェクトの配列）、`$getUsers.rows[0].email`、`$getUsers.total`。

## 例 – 行の挿入

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials Tab](../tabs/credentials-tab.md) – BigQuery OAuth2 credential の追加
- [Google Sheets](./google-sheets-node.md) – スプレッドシートデータ向けの類似した OAuth2 パターン
- [Third-Party Integrations](../reference/integrations.md) – 統合 credential の設定
