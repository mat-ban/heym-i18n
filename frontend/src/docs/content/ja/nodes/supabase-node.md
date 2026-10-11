# Supabase

**Supabase** ノードは、Supabase プロジェクトの PostgREST API で公開されているテーブルを読み取り・更新します。HTTP リクエストを手書きすることなく、Workflow から SQL ベースのアプリケーション状態にアクセスしたい場合に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | Supabase |
| 出力 | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) の Supabase credential |
| `supabaseOperation` | string | 操作: `select`、`insert`、`update`、`upsert`、または `delete` |
| `supabaseSchema` | expression | スキーマ名。空欄の場合、ノードは credential のデフォルトスキーマを使用し、次に `public` を使用します。 |
| `supabaseTable` | expression | クエリまたは更新の対象となるシンプルなテーブル名。スキーマはここではなく `supabaseSchema` に指定してください。 |
| `supabaseSelectColumns` | expression | `select` 用のカンマ区切り PostgREST select リスト（デフォルトは `*`） |
| `supabaseFilter` | expression | JSON フィルターオブジェクト。完全一致に加え、演算子オブジェクトや論理グループをサポートします。例: `{"id":123}`、`{"created_at":{"gte":"2026-01-01"}}`、または `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | `select` で返す最大行数（`0` = サーバーサイドページネーションで一致するすべての行を取得、負の値は `100` にフォールバック） |
| `supabaseOrderBy` | expression | `select` で並べ替える省略可能なカラム |
| `supabaseAscending` | boolean | `true` で昇順、`false` で降順に並べ替え |
| `supabaseRowsInputMode` | string | `insert`/`upsert` 用: `raw` JSON 配列モード、または単一の上流入力を自動マッピングする `auto` |
| `supabaseDataInputMode` | string | `update` 用: `raw` JSON オブジェクトモード、または単一の上流入力を自動マッピングする `auto` |
| `supabaseIgnoredInputFields` | string | 入力データの自動マッピング時に省略する省略可能なカンマ区切りフィールド名 |
| `supabaseRows` | expression | `insert` および `upsert` 用の行オブジェクトの JSON 配列 |
| `supabaseOnConflict` | expression | `upsert` 用の省略可能なカンマ区切り競合ターゲットカラム。例: `id` または `tenant_id,email` |
| `supabaseData` | expression | `update` 用の更新するカラム値の JSON オブジェクト |

## Credential の設定

[Credentials タブ](../tabs/credentials-tab.md) で **Supabase** credential を作成し、以下を設定します:

1. **Project URL**（例: `https://your-project.supabase.co`）
2. この Workflow が使用するテーブルにアクセスできる **API key**
3. 省略可能な **デフォルトスキーマ**（デフォルトは `public`）

ノードは `/rest/v1/<table>` の Supabase PostgREST endpoint と通信します。
`supabaseTable` にはテーブル名のみ（例: `users` や `profiles`）を指定してください。`schema.table`、`rpc/...`、その他の API パスを渡さないでください。

有効な Supabase credential が選択されている場合、エディタは PostgREST OpenAPI メタデータから公開されているテーブルとテーブルカラムを直接検出できます。**discovered tables** ドロップダウンでテーブルを選択し、**Select Columns** の下の **column chips** で select リストをすばやく構築できます。

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | 省略可能な完全一致フィルター、limit、並べ替えを指定して行を読み取り |
| `insert` | `supabaseTable`、`supabaseRows` または自動マッピング入力 | 1 つ以上の行を挿入 |
| `update` | `supabaseTable`、`supabaseData` または自動マッピング入力、`supabaseFilter` | フィルターに一致する行を更新 |
| `upsert` | `supabaseTable`、`supabaseRows` または自動マッピング入力 | Supabase の upsert セマンティクスを使用して行を挿入またはマージ。明示的な競合ターゲットが必要な場合は `supabaseOnConflict` を使用します。 |
| `delete` | `supabaseTable`、`supabaseFilter` | フィルターに一致する行を削除 |

## フィルター構文

`supabaseFilter` は構造化 JSON を PostgREST クエリパラメータにコンパイルします。

- 完全一致: `{"status":"active"}`
- 比較: `{"created_at":{"gte":"2026-01-01"}}`
- メンバーシップ: `{"status":{"in":["active","paused"]}}`
- パターンマッチ: `{"email":{"ilike":"*@example.com"}}`
- 論理 OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- 論理 AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

同じフィールドに複数の演算子を適用する場合は、論理グループを使用することを推奨します:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## ページネーション

`select` は PostgREST に対して真のサーバーサイドページネーションを実行するようになりました。

- `supabaseLimit: "0"` は一致するすべての行をページごとに取得します
- 1000 を超える `supabaseLimit` 値は自動的に複数のリクエストに展開されます
- 結果は 1 つの `.rows` 配列にマージされ、`.count` は一致する行の総数を保持します

大きなテーブルを読み取る場合は、安定した `supabaseOrderBy` を設定してページ境界を予測可能に保ってください。

## 入力の自動マッピング

`insert`、`upsert`、`update` では、単一の上流ノードが書き込みたい形状をすでに出力している場合、ノードを **Auto-map input** に切り替えます。

- 単一のオブジェクトは 1 行または 1 つの更新 payload になります
- オブジェクトの配列は `insert` / `upsert` の複数行になります
- `rows` 配列を持つ上流オブジェクトは、その配列を直接再利用します
- `supabaseIgnoredInputFields` を使用すると、`id`、`created_at`、`success` などのフィールドを除外できます
## 出力リファレンス

| 出力フィールド | 型 | 説明 |
|-------------|------|-------------|
| `.rows` | array | 返却された行オブジェクト |
| `.count` | number | 返却または影響を受けた行数 |
| `.success` | boolean | 操作が成功したかどうか |

## 例 – アクティブユーザーの選択

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

出力へのアクセス: `$activeUsers.rows`、`$activeUsers.rows[0].email`、`$activeUsers.count`。

## 例 – プロフィール行の Upsert

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials タブ](../tabs/credentials-tab.md) – Supabase の認証情報を追加する
- [サードパーティ統合](../reference/integrations.md) – 統合の認証情報の設定
