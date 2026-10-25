# Portal

**Portal** は、Heym の Workflow を公開チャット形式の UI として提供します。エンドユーザーは Heym にログインすることなく、URL 経由で Workflow を実行できます。

## 主な機能

- **公開 URL**: `/chat/{slug}`（例: `/chat/my-workflow`）
- **チャットインターフェース**: ユーザーはチャット UI（メッセージ、入力、応答）を通じて操作します
- **任意の認証**: Portal ユーザーが設定されている場合はログインが必須となり、設定されていない場合は Portal は公開状態となります
- **ストリーミング**: 実行中にノードの進捗をリアルタイム表示します（有効化時）
- **実行中の停止**: ユーザーはチャットフッターから実行中の Portal 実行を停止できます。アクティブな Workflow 実行もサーバー側でキャンセルされます
- **ファイルアップロード**: 入力フィールドごとに任意のファイルアップロード（テキスト、画像など）が可能です
- **Human review handoff**: Agent が承認のために一時停止した際、Portal 実行は [HITL レビューリンク](./human-in-the-loop.md) を表示できます
- **画像表示**: 画像を含む Workflow の出力（LLM による画像生成や Playwright のスクリーンショットなど）は、チャット内にサムネイルとして表示されます。画像をクリックするとフルスクリーンビューアが開き、**Esc** キーまたはデバイスの戻るボタンで閉じることができます

## Workflow の設定

| 設定 | 説明 |
|---------|-------------|
| `portal_enabled` | この Workflow で Portal を有効化します |
| `portal_slug` | URL スラッグ（例: `my-workflow` → `/chat/my-workflow`） |
| `portal_stream_enabled` | ストリーミング実行を使用します |
| `portal_file_upload_enabled` | ファイルアップロードを許可します |
| `portal_file_config` | フィールドごとのファイル設定（種類、上限） |

エディターでの設定: Workflow ヘッダーの **Portal** ボタンをクリックすると、Portal 設定ダイアログが開きます。

## フロー

1. **Info**: `GET /api/portal/{slug}/info` – Workflow のメタデータと入力フィールドを返します（認証不要）
2. **Login**（必要な場合）: `POST /api/portal/{slug}/login` – セッション Token を返します
3. **Execute**: `POST /api/portal/{slug}/execute` – Portal のチャット UI がこれを呼び出します（有効時は内部的にストリーミング版が使用されます）。エンドユーザーは API を直接呼び出すのではなく、チャットインターフェースを通じて操作します。
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – ユーザーがアクティブな Portal 実行中に **Stop** を押した際にリクエストされます

## 同時実行制限

Workflow に[同時実行制限](./webhooks.md#concurrency-limit-and-queued-runs)があり、すべてのスロットが使用中の場合、Portal のメッセージはすぐに実行されず、順番を待機します。実行が開始されるまで、チャットのプログレスラインには **Waiting in queue (2/5)** と表示され、開始後は通常どおり回答が表示されます。ユーザーがページを閉じても実行は継続されます。**Stop** をクリックすると、待機中の実行がキューから削除されます。キューがいっぱいの場合、メッセージは "Concurrency queue is full" で失敗します。キューで待機していた実行は、回答をトークンごとにストリーミングせず、終了時に回答全体が一度に表示されます。

## Portal 実行における HITL

Portal の Workflow が、[Human-in-the-Loop](./human-in-the-loop.md) を有効化した [Agent ノード](../nodes/agent-node.md) に到達した場合、Portal の応答は空になる代わりにレビューリンクを表示します。

- Workflow の実行ステータスが `pending` になります
- Portal チャットにレビュー URL が表示されます
- Agent の `review` 出力ハンドルに接続された任意のノードが、即座に Slack、メール、その他のチャネルへ通知できます
- レビュアーはログインすることなく `/review/{token}` で決定を完了します
- レビュー後、Workflow は保存されたスナップショットから再開されます

これにより、公開チャットフローと非公開の人間による承認ステップを組み合わせることが可能になります。

## 入力フィールド

入力フィールドは [Input](../nodes/input-node.md) ノードから取得されます。API は `textInput` タイプの開始ノードとその `inputFields` を抽出します。実行には通常の実行と同じエンジンが使用され、入力は `body.inputs` として、またマルチターンフローの場合は `conversation_history` として渡されます。

## 認証とセッション

- **WorkflowPortalUser**: Workflow ごとのユーザー名／パスワード（認証が有効な場合）
- **最後のユーザーの削除**: ポータルが有効な場合、最後のポータルユーザーを削除するとポータルが再び公開状態になります。設定ダイアログで最初に確認が求められます
- **PortalSession**: TTL 168 時間のセッション Token
- **レート制限**: ログイン失敗 3 回 → Workflow + IP ごとに 24 時間の BAN
- 期限切れのセッションは Cron ジョブによってクリーンアップされます

## 設定 UI

**WebPortalSettingsDialog** のタブ:

1. **General**: Portal の有効化、スラッグの設定、Portal URL のコピー
2. **Users**: Portal ユーザーの追加／削除（ユーザー名／パスワード）
3. **Options**: ストリームモード、ファイルアップロード、入力フィールドの表示

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – 本番環境における Agent のチャットサーフェスとしての Portal
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow の作成と Portal の有効化
- [Human-in-the-Loop](./human-in-the-loop.md) – 保留中の Agent 出力に対する公開レビューページ
- [Triggers](./triggers.md) – エントリーポイントとしての Portal
- [Node Types](./node-types.md) – Portal 入力用の [Input](../nodes/input-node.md)
- [Workflow Structure](./workflow-structure.md) – ノードとエッジ
