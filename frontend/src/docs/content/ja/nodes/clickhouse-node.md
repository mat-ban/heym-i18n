# ClickHouse

**ClickHouse** ノードは、外部の [ClickHouse](https://clickhouse.com/) データベースに対して、その HTTP インターフェース経由で CRUD、count、および生の SQL 操作を実行します。Workflow から ClickHouse テーブルへイベントを書き込んだり、分析データを読み取ったり集計したり、任意の SQL を実行したりする際に、HTTP リクエストを手書きすることなく利用できます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | ClickHouse |
| 出力 | `$nodeLabel.rows`、`$nodeLabel.count`、`$nodeLabel.row`、`$nodeLabel.success` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) から取得した ClickHouse credential |
| `clickhouseOperation` | string | 操作: `query`、`find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove`、または `upsert` |
| `clickhouseTable` | expression | シンプルなテーブル名。`query` 以外のすべての操作で必須です。 |
| `clickhouseQuery` | expression | `query` 用の生の SQL。`SELECT`/`SHOW`/`DESCRIBE` は行を返し、その他のステートメントはコマンドとして実行されます。 |
| `clickhouseFilter` | expression | 等値フィルタの JSON オブジェクト（例: `{"status":"active"}`）。`find`、`count`、`update`、`remove` で使用されます。値はパラメータ化されます。 |
| `clickhouseLimit` | string | `find` / `getAll` の最大行数（`0` = 無制限、LIMIT 句なし）。デフォルトは `100`。 |
| `clickhouseSort` | expression | `find` 用の任意の `column` または `column ASC\|DESC` |
| `clickhouseRowId` | expression | `getById` でテーブルの `id` カラムと照合される値 |
| `clickhouseInputMode` | string | `insert`/`upsert` 用: `raw` JSON 配列モード、または `selective` キー/値フィールドモード |
| `clickhouseData` | expression | `insert`/`upsert` 用の行オブジェクトの JSON 配列、または `update` 用のカラム値の JSON オブジェクト |
| `clickhouseMappings` | array | `clickhouseInputMode` が `selective` の場合に使用される `{key, value}` ペア |

## Credential の設定

[Credentials タブ](../tabs/credentials-tab.md) で **ClickHouse** credential を作成し、以下を設定します。

1. **Host** — スキームを除いた HTTP ホスト（例: `your-instance.clickhouse.cloud`）
2. **Port** — HTTP インターフェースのポート（HTTPS は `8443`、HTTP は `8123`）
3. **Username** / **Password** — デフォルトは `default`、パスワードは空です
4. **Database** — デフォルトは `default`
5. **Secure** — HTTPS（ClickHouse Cloud）の場合は有効化します

ノードは公式の `clickhouse-connect` HTTP クライアント経由で接続します。保存する前に、credential ダイアログの **Test connection** で到達可能性を確認してください。

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | 生の SQL を実行します。`SELECT` は `{rows, count}` を返し、その他のステートメントは `{result}` を返します。 |
| `find` | `clickhouseTable` | 任意の等値フィルタ、ソート、および limit を指定して行を読み取ります |
| `getAll` | `clickhouseTable` | フィルタなしで、limit までの行を読み取ります |
| `count` | `clickhouseTable` | オプションでフィルタを適用して行をカウントします |
| `getById` | `clickhouseTable`、`clickhouseRowId` | `id` カラムによって単一の行を読み取ります |
| `insert` | `clickhouseTable`、`clickhouseData` または mappings | 1 つ以上の行を挿入します |
| `update` | `clickhouseTable`、`clickhouseData`、`clickhouseFilter` | `ALTER TABLE ... UPDATE` を介して一致する行を更新します |
| `remove` | `clickhouseTable`、`clickhouseFilter` | `DELETE FROM` を介して一致する行を削除します |
| `upsert` | `clickhouseTable`、`clickhouseData` または mappings | 行を挿入します（`ReplacingMergeTree` テーブルを前提とします） |

## フィルタ構文

`clickhouseFilter` は、カラムの等値チェックを行うフラットな JSON オブジェクトです。値はバインドされたクエリパラメータとして送信されるため、インジェクションに対して安全です。

```json
{ "status": "active", "tenant_id": 42 }
```

これは `WHERE status = {…:String} AND tenant_id = {…:Int64}` にコンパイルされます。フィルタビルダーでは等値のみがサポートされています。範囲、join、または集計については、生の SQL を使用した `query` 操作を使用してください。

## 入力モード（insert / upsert）

- **JSON 配列**（`raw`）: `clickhouseData` に行オブジェクトの JSON 配列を指定します。特定の行に存在しないキーは `NULL` として挿入されます。カラムセットは、すべての行のキーの和集合となります。
- **キー/値**（`selective`）: credential とテーブルを選択すると、エディタがテーブルのカラムを検出し、カラムごとに 1 つの値フィールドを作成します。実行ごとに 1 行が挿入され、各値は式をサポートします。

## ミューテーションと ClickHouse のセマンティクス

ClickHouse は OLAP データベースであるため、行レベルの書き込みは OLTP ストアとは異なる動作をします。

- **`update`** は `ALTER TABLE … UPDATE` を発行し、**`remove`** は `DELETE FROM` を発行します。どちらも**非同期ミューテーション**であり、最終的に適用され、比較的コストがかかります。頻繁な単一行ミューテーションよりも、バッチ書き込みを優先してください。
- **`upsert`** は `INSERT` を実行します。キーによるマージ動作を得るには、テーブルのエンジンを `ReplacingMergeTree` にしてください。
- **`getById`** は、テーブルに `id` カラムがあることを前提としています。
- `update` と `remove` は、テーブル全体のミューテーションを避けるため、空でない `clickhouseFilter` を必要とします。

## 出力リファレンス

| 出力フィールド | 型 | 説明 |
|-------------|------|-------------|
| `.rows` | array | 返された行オブジェクト（`query` の SELECT、`find`、`getAll`） |
| `.count` | number | 行数（`find`、`getAll`、`count`、`insert`/`upsert`） |
| `.row` | object | 単一の行、または `null`（`getById`） |
| `.result` | string | SELECT 以外の `query` のコマンドサマリ |
| `.success` | boolean | 操作が成功したかどうか |
## 例 – イベントの挿入

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## 例 – アクティブユーザーのカウント

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

出力へのアクセス: `$activeCount.count`。

## 例 – 日次レポートクエリ

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

出力へのアクセス: `$dailyReport.rows`、`$dailyReport.count`。

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials タブ](../tabs/credentials-tab.md) – ClickHouse の認証情報を追加する
- [サードパーティ統合](../reference/integrations.md) – 統合の認証情報の設定
