# DataTable

**DataTable** ノードは、Heym DataTable 内のデータを読み取り、書き込み、管理します。外部の認証情報を必要とせず、ファーストパーティの構造化ストレージに対する CRUD 操作に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | `$nodeLabel.rows`、`$nodeLabel.row`、`$nodeLabel.success`、`$nodeLabel.id` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `dataTableId` | UUID | [DataTable タブ](../tabs/datatable-tab.md)から選択する DataTable |
| `dataTableOperation` | string | 操作: `find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove`、`upsert` |
| `dataTableRowId` | expression | 行の UUID（getById、update、remove で使用） |
| `dataTableData` | JSON string | 列の値: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | フィルター（find/upsert/count）。`find` と `count` は演算子 `{"age": {"$gt": 18}}` をサポートします。`upsert` は完全一致 `{"column_name": "value"}` を使用します |
| `dataTableSort` | string | ソート対象の列。降順にするには先頭に `-` を付けます |
| `dataTableLimit` | number | 返される行の最大数（デフォルト: 100） |

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|----------------|-------------|
| `find` | dataTableId | オプションの演算子フィルターに一致する行を、オプションのソート/リミット付きで検索します |
| `getAll` | dataTableId | すべての行を、オプションのソート/リミット付きで取得します |
| `count` | dataTableId | オプションの演算子フィルターに一致する行をカウントします（データベース内でカウントされ、数値のみを返します） |
| `getById` | dataTableId, dataTableRowId | UUID で単一の行を取得します |
| `insert` | dataTableId, dataTableData | 新しい行を挿入します |
| `update` | dataTableId, dataTableRowId, dataTableData | 行を更新します（データをマージします） |
| `remove` | dataTableId, dataTableRowId | 行を削除します |
| `upsert` | dataTableId, dataTableFilter, dataTableData | 一致する行が見つかれば更新し、それ以外の場合は挿入します |

## 例 - 行の検索

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## 例 - 行の挿入

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## 例 - 行のカウント

`getAll` → If/Else → Map を使う代わりに、単一のノードで条件に一致する行をカウントします。

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

結果は `$activeAdults.count` として利用できます。フィルターが空または省略されている場合は、すべての行がカウントされます。

### find および count のフィルター演算子

`find` または `count` のフィルターでは、プレーンな値は等価を意味し、オブジェクト値は演算子を適用します。

| 演算子 | 意味 |
|----------|---------|
| `$eq`（またはプレーンな値） | 等しい |
| `$ne` | 等しくない |
| `$gt`、`$gte`、`$lt`、`$lte` | より大きい/以上/より小さい/以下 の比較（`number` 型の列では数値として、それ以外ではテキストとして比較されます） |
| `$contains` | 大文字と小文字を区別しない部分文字列一致 |
| `$in` | 値が指定された配列に含まれる |

複数を組み合わせた例: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`。不明な演算子は無視されます。`upsert` のフィルターは、更新対象の行を見つけるために引き続き完全一致の値を使用します。

行のメタデータ — `id`、`table_id`、`created_at`、`updated_at`、`created_by`、`updated_by` — でもフィルターできます。これらはデータ内ではなく実際の列として保存されています。日付の場合、範囲比較には完全な値を渡すか（例: `{"created_at": {"$gt": "2026-06-04"}}`）、部分的なテキスト一致には `$contains` を使用します（例: `{"created_at": {"$contains": "2026-06-04"}}`）。独自の列がメタデータフィールドと同じ名前である場合、データ列が優先されます。

## 出力へのアクセス

- `$nodeLabel.success` - 成功ステータスの Boolean
- `$nodeLabel.rows` - 行の配列（find、getAll）
- `$nodeLabel.row` - 単一の行オブジェクト（getById、insert、update、upsert）
- `$nodeLabel.row.data.column_name` - 特定の列の値にアクセスします
- `$nodeLabel.count` - 行数（find/getAll では返された行数、count では一致する行の合計）
- `$nodeLabel.id` - 行の UUID（insert、update、remove）
- `$nodeLabel.found` - Boolean（getById）
- `$nodeLabel.operation` - 操作名（例: `count`、upsert の場合は `insert`/`update`）

## 認証情報は不要

外部連携とは異なり、DataTable は Heym の内部データベース上で動作します。ワークフロー所有者のアクセス権限は自動的にチェックされます。

## AI アシスタントによる構築

[AI アシスタント](../reference/ai-assistant.md#data-tables)または[チャット](../tabs/chat-tab.md)がこのノードを構築する際、テーブルを一緒に選択または作成し、テーブルの正確な列名を `dataTableData` と `dataTableFilter` に書き込みます。

## 関連

- [DataTable タブ](../tabs/datatable-tab.md) - テーブルの作成と管理
- [Grist ノード](./grist-node.md) - 外部スプレッドシート連携
- [Expression DSL](../reference/expression-dsl.md) - 動的な値のための式構文
