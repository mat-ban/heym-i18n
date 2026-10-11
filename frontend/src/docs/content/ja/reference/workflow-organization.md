# Workflow の整理

Heym では、Workflow をフォルダーで整理し、サブフォルダーを作成し、Workflow の削除をスケジュールできます。UI の概要については [Workflows タブ](../tabs/workflows-tab.md) を参照してください。

## フォルダーとサブフォルダー

フォルダーはツリーを形成します。各フォルダーには以下があります：

- **Name** – 表示名
- **Parent** – `parent_id` は別のフォルダーにリンクします。`null` はルートを意味します
- **Workflows** – Workflow は `folder_id` を介してフォルダーに移動できます

### API

| Endpoint | 目的 |
|----------|---------|
| `GET /folders` | ルートフォルダーのみ |
| `GET /folders/tree` | ツリー全体（子 + Workflow） |
| `GET /folders/{id}` | 内容を含む単一フォルダー |
| `POST /folders` | フォルダーを作成（`parent_id` は任意） |
| `PUT /folders/{id}` | 名前または `parent_id` を更新 |
| `DELETE /folders/{id}` | フォルダーを削除（カスケード） |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow をフォルダーに移動 |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow をフォルダーから削除 |
| `GET /folders/{id}/export` | フォルダーとすべてのサブフォルダーを ZIP としてダウンロード |

### ツリー構造

ツリーのレスポンスには、フォルダーごとの `children` と `workflows` が含まれます。共有された Workflow は、`WorkflowShare.folder_id` を介してフォルダーに表示されることがあります。

## Workflow の共有

Workflow エディターで **Share** を開き、メールでユーザーを招待するか、[team](./teams.md) と共有します。すべての招待とすべての team 共有には、権限が付随します：

| 権限 | コラボレーターが実行できること |
|------------|------------------------------|
| **Read** | Workflow を開き、検査し、実行履歴を表示し、実行できます。エディターは読み取り専用モードで開きます：Save は無効化され、キャンバスは変更できません。 |
| **Write** | Read で許可されるすべてのことに加えて、キャンバス、設定、分析ドキュメント、エージェントメモリを編集できます。 |

権限は Share ダイアログの各エントリの横に表示され、共有を削除して再追加することなく、そのドロップダウンからいつでも変更できます。ユーザーが複数の経路（直接共有と 1 つ以上の team）で Workflow に到達した場合、**最も高い**権限が優先されます。権限が導入される前に存在していた共有は **Write** となり、`permission` を省略する API クライアントも **Write** を取得します。

オーナー専用のアクションは権限に依存しません：Workflow の削除、バージョンの復元またはクリア、履歴のクリア、共有の管理、および以下の [オーナー専用設定](#owner-only-settings) は、**Write** コラボレーターであってもオーナーに留まります。**Read** コラボレーターが API（`PUT /api/workflows/{id}`、分析ノート、エージェントメモリ、キャッシュクリア）または AI Assistant を介して編集を送信した場合、`You have read-only access to this workflow` とともに `403` を受け取ります。

Workflow を共有すると、キャンバス、実行履歴、分析ドキュメントへのアクセスが付与されます。以下は自動的に共有され **ません**：

- Workflow 内のノードが参照する **Credentials**
- [Execute](../nodes/execute-node.md) ノードまたはエージェントが呼び出す **サブ Workflow**

受信者は、それらの Credentials と子 Workflow を個別に共有してもらう必要があります（同じユーザーまたは team）。Credentials は [Credentials タブ](../tabs/credentials-tab.md) から共有します。[Credentials の共有](./credentials-sharing.md) を参照してください。各サブ Workflow は、それぞれのエディターの共有ダイアログから共有します。

### オーナー専用設定

**Run with cURL** の設定全体は、共有後もオーナーに留まります。コラボレーターは引き続きダイアログを開いて生成されたコマンドをコピーできますが、コントロールは読み取り専用です。

非オーナーとしてこれらのいずれかを変更すると、`403` で拒否されます：

- **Authentication**（`auth_type`）と **Header Key**（`auth_header_key`）
- **Request Body** モード（`webhook_body_mode`）と **Request Method**（`http_method`）
- **Response Cache**（`cache_ttl_seconds`）と **Rate Limit**（`rate_limit_requests`、`rate_limit_window_seconds`）
- **SSE Streaming**（`sse_enabled`、`sse_node_config`）

**Header Value**（`auth_header_value`）は異なる動作をします：コラボレーターからは完全に隠され、コラボレーターの書き込みは拒否されるのではなく無視されます。エディターはこのフィールドをマスクして表示するため、ここで `403` を返すと攻撃を示すのではなく通常の保存を壊してしまいます。

このブロックがオーナー専用である理由は認証にあります：`Anonymous` は未認証の呼び出し元が Workflow を実行できるようにし、サインインした呼び出し元がいない実行では、Credentials とグローバル変数が呼び出し元ではなく **オーナー** として解決されます。ブロックの残りの部分は公開されたリクエスト契約とオーナーのコスト管理であるため、それに伴って移動します。

Workflow レベルの **Properties** パネルにある **On error, run workflow**（`error_workflow_id`）も同じ理由でオーナー専用です：[エラー Workflow](./features.md#error-workflow) は失敗した実行の Credentials とグローバル変数で実行され、トリガーされた実行および匿名実行ではこれらはオーナーのものです。コラボレーターはこの設定を読み取り専用で表示し、非オーナーとして追加、置換、クリアすると `403` で拒否されます。

キャンバス、名前、説明の編集は影響を受けません。

### 実行トークン

コラボレーターは、共有された Workflow の実行トークンを発行できます。実行は **トークンを発行したユーザー** に帰属するため、オーナーではなくそのユーザーの Credentials とグローバル変数を使用します。真に匿名の呼び出し — 呼び出し元のいない `auth_type: anonymous` — のみがオーナーのコンテキストで実行されます。

## 削除のスケジュール

Workflow は、即座に削除する代わりに削除をスケジュールできます。

- **フィールド**：`scheduled_for_deletion`（nullable datetime）
- **動作**：設定されると、Workflow は `folder_id = null` に移動し、「Scheduled for Deletion」セクションに表示されます。
### API

| Endpoint | 目的 |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` を設定し、`folder_id` をクリアします |
| `DELETE /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` をクリアします（復元） |

### UI

- **ゴミ箱へドラッグ** – Workflow を「Scheduled for Deletion」エリアにドロップすると、削除スケジュールに登録されます
- **復元** – スケジュールから削除します
- **即時削除** – ゴミ箱アイコンで完全に削除します

### クリーンアップロジック

Cron ジョブが毎日 **23:59**（設定されたタイムゾーン）に実行されます。Workflow が削除されるのは、以下の条件を満たす場合のみです：

- **すべての開始ノード**（受信エッジを持たないノード。sticky/errorHandler を除く）が `active === false` であること

いずれかの開始ノードがまだアクティブな場合、Workflow は次回の実行まで保持されます。

## ダッシュボード UI

- **フォルダ行** – 新規フォルダ、展開/折りたたみ可能な再帰的フォルダツリー。各フォルダには
  名前の下に任意の説明と、保持する Workflow 数（サブフォルダを含む）を示すバッジが表示されます。
- **フォルダ操作** – サブフォルダの新規作成、名前変更、アイコンの変更、ZIP としてダウンロード、削除が
  各フォルダ行にインラインで表示されます。右クリックのコンテキストメニューでも同じ操作が可能で、スマートフォンでは単一の
  メニューボタンが表示されます。
- **メインエリア** – ルート Workflow（フォルダなし、スケジュールなし）と Scheduled for Deletion
- **フォルダドロッププレビュー** – Workflow をドラッグすると、該当するフォルダまたはサブフォルダがハイライトされ、
  カードサイズのプレビューにフルパスが表示されます。折りたたまれたフォルダは、短時間のホバー後に展開されます。
- **安定したドラッグフィードバック** – ソースカードはドラッグゴーストを使用し、アクティブなドロップターゲットは
  同じフォルダ内でのスクロールやコントロールの横断中も選択状態が維持されます。
- **移動先チェック** – 現在のフォルダは **Already in Folder** として表示され、冗長な移動を受け付けません。
- **その他のドロップゾーン** – ルートおよび「Scheduled for Deletion」は、ドラッグされた Workflow を受け入れ可能な場合にハイライトされます。
- **ZIP ドロップ** – ZIP ファイルを Workflow エリアにドロップすると、ルートレベルでフォルダ構造がインポートされます

## 関連項目

- [Workflows タブ](../tabs/workflows-tab.md) – Workflow の作成と管理
- [Credentials の共有](./credentials-sharing.md) – Workflow の共同作業者と Credentials を共有
- [Teams](./teams.md) – チームと Workflow および Credentials を共有
- [コアコンセプト](../getting-started/core-concepts.md) – Workflow、ノード、実行
- [Workflow 構造](./workflow-structure.md) – Workflow の JSON フォーマット
- [Triggers](./triggers.md) – 開始ノードとエントリーポイント
