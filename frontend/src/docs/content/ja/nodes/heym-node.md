# Heym

**Heym** ノードは、Heym 自身のデータを読み取ります。アクセス可能な Workflow、1 つの Workflow の構造、およびその実行履歴です。これはメタ Workflow——インスタンスのインベントリ、実行ダイジェスト、Heym 自体に関するヘルスレポート——を構築するための手段です。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 操作 | `listWorkflows`、`getWorkflow`、`getExecutionHistory` |
| Credential | 不要 |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `heymOperation` | Select | 実行する読み取り操作 |
| `heymWorkflowId` | UUID | 対象の Workflow。`getWorkflow` および `getExecutionHistory` で必須です。式を使用できます。 |
| `heymLimit` | String | 返す最大行数。**空のままにするか `0` を入力すると、すべてを返します**——これがデフォルトです。式を使用できます。 |
| `heymStatus` | String | `getExecutionHistory` の任意のステータスフィルター。式を使用できます。 |
| `heymSinceDays` | String | `getExecutionHistory` の任意の遡及日数。式を使用できます。 |

Workflow ピッカーは、アクセス可能なすべての Workflow を一覧表示する検索可能なドロップダウンです。

## アクセススコープ

結果は、**ノードが属する Workflow の所有者**にスコープされます——実行を開始したユーザーではありません。表示されるセットは次のとおりです：

- 所有者が所有する Workflow、
- 所有者に直接共有された Workflow、
- 所有者が所属するチームに共有された Workflow。

所有者スコープにより、実行が手動、Cron、ポータル、またはプラットフォームイベントのいずれで開始された場合でも、ノードは同一に動作します。実行者スコープでは、無人実行のたびに何も返されません。これは、Heym が Credential およびグローバル変数に対して既に使用しているものと同じルールです。

アクセスできない Workflow と存在しない Workflow は同じエラーメッセージを生成するため、このノードを使用して Workflow ID を探査することはできません。

## 操作

### List Workflows

所有者がアクセス可能なすべての Workflow を、最終更新が新しい順に返します。

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow サマリーの配列 |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow 名 |
| `$nodeLabel.workflows[0].description` | 説明、または `null` |
| `$nodeLabel.workflows[0].active` | Workflow がアクティブかどうか |
| `$nodeLabel.workflows[0].folder_id` | フォルダー UUID、または `null` |
| `$nodeLabel.workflows[0].updated_at` | 最終保存の ISO タイムスタンプ |
| `$nodeLabel.workflows[0].node_count` | Workflow に含まれるノード数 |
| `$nodeLabel.total` | 制限が適用される**前**の、アクセス可能な完全な件数 |

`total` は意図的に無制限の件数とされているため、返される行数を制限しても `$inventory.total` は実際のサイズを報告します。**Limit** をクリアするか `0` に設定すると、すべての Workflow を返します——これがデフォルトです。

### Get Workflow

1 つの Workflow の識別情報と構造を返します。

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.id`、`$nodeLabel.name`、`$nodeLabel.description` | Workflow の識別情報 |
| `$nodeLabel.active`、`$nodeLabel.folder_id`、`$nodeLabel.updated_at` | Workflow のメタデータ |
| `$nodeLabel.node_count` | ノード数 |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }` の配列 |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }` の配列 |

`data` は**完全なノード設定**です——保存されたとおりのすべてのフィールドです。これにより監査が可能になります。ノードがフィールドの表示を拒否する場合、誰かがフィールドに貼り付けた API キーを Workflow からスキャンすることはできません。

これは、呼び出し元が既に持っていないアクセス権を付与するものではありません。このノードは、所有者がエディターで開くことができる Workflow にスコープされており、保存された Credential のシークレットはここには含まれません。ノードデータが保持するのは Credential の **ID** のみであり、シークレット自体は Credential テーブルに暗号化されて保存されています。

### ハードコードされたシークレットのスキャン

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

エージェントに `$detail.nodes` を渡し、有効なキーや Token のように見える `data` 値をフラグ付けするよう依頼します。注意すべきフィールドはフリーテキストのフィールドです——HTTP ノードの `curl`、LLM ノードおよび Agent ノードの `userMessage` と `systemInstruction`、および Python ツールの本体です。Credential ID は無害な UUID ですが、貼り付けられた `sk-…` はそうではないからです。
### 実行履歴の取得

1つの Workflow の実行履歴エントリを、新しい順に返します。

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.executions` | 履歴エントリの配列 |
| `$nodeLabel.executions[0].id` | 実行 UUID |
| `$nodeLabel.executions[0].status` | `success`、`error` など |
| `$nodeLabel.executions[0].started_at` | ISO タイムスタンプ |
| `$nodeLabel.executions[0].execution_time_ms` | 実時間の所要時間 |
| `$nodeLabel.executions[0].trigger_source` | 実行を開始したもの（例：`cron` や `heym_event`） |
| `$nodeLabel.executions[0].recovered` | クラッシュ後に実行が復旧されたかどうか |
| `$nodeLabel.executions[0].inputs` | 実行が受け取った内容 — Trigger の Payload または呼び出し元の入力 |
| `$nodeLabel.executions[0].outputs` | その実行における Workflow の出力 |
| `$nodeLabel.workflow_id`、`$nodeLabel.workflow_name` | 履歴が属する Workflow |
| `$nodeLabel.total` | 制限を適用する**前**の、一致する実行の総数 |
| `$nodeLabel.by_status` | ステータスをキーとした件数（例：`{ "success": 41, "error": 3 }`） |
| `$nodeLabel.since` | 対象期間の開始、または全履歴の場合は `null` |

エントリには `inputs` と `outputs`（実行が受け取った内容と返した内容）の両方が含まれますが、`node_results` は含まれません。ノード単位のトレースはテーブル内で最も大きなカラムであり、下流のすべてを圧倒してしまうためです。完全なトレースが必要な場合は、API を通じて単一の実行を取得してください。

`total` と `by_status` は、**Limit** が返されるエントリを制限している場合でも、常に一致する履歴の**全体**を表します。したがって、直近5件の実行を取得しつつ、正確な失敗件数を報告できます。

**Since (days)** を空にするとすべてが対象となり、**Status filter** を空にするとすべてのステータスが含まれ、**Limit** を空または `0` にするとすべてのエントリが返されます。

## Workflow の例

**日次インスタンスダイジェスト**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** の `listWorkflows` に `inventory` というラベルを付与
- `$inventory.workflows` に対する **Loop**
- **Heym** の `getExecutionHistory` で、`heymWorkflowId` にループ項目の `id`、`heymSinceDays` に `1`、`heymLimit` に `5` を設定
- **LLM** が収集した実行とステータス件数を読みやすいサマリーに変換

## 注意事項

- Credential は不要です。このノードは Heym が動作しているのと同じデータベースを読み取ります。
- **Limit** は両方のリスト操作で同じフィールドであり、意味も同じです。空または `0` を指定するとすべてが返されます。
- このノードは通常の入力を受け取り、Agent ノードにツールとして接続できます。これにより、Agent が Heym インスタンスに関する質問に回答したり、監査したりできます。
- `getWorkflow` の Payload は Workflow とともに大きくなります。長い Prompt や Python ツールの本体はすべて `data` 内を移動します。
- [Heym Trigger](./heym-trigger-node.md) と組み合わせることで、スケジュールでポーリングする代わりに、Workflow の変更が発生した際にリアクションできます。

## 関連項目

- [Heym Trigger](./heym-trigger-node.md) – プラットフォームのイベントから Workflow を開始する
- [Execute](./execute-node.md) – Workflow を説明するのではなく、別の Workflow を実行する
- [Loop](./loop-node.md) – 返された Workflow リストを反復処理する
