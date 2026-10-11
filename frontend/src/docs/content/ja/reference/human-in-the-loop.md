# Human-in-the-Loop

Human-in-the-Loop（HITL）を使用すると、[Agentノード](../nodes/agent-node.md)が特定のタイミングで承認を要求し、人間の判断を待ってから、同じ実行スナップショットからWorkflowを再開できます。

## 機能概要

- 別途承認用のWorkflowを構築することなく、Agentに明示的な承認チェックポイントを追加します
- `/review/{token}` にワンタイムの公開レビューURLを作成します
- レビュアーが `Accept`、`Edit & Continue`、または `Refuse` を選択できます
- 判断が届くまで実行を `pending` としてマークします
- 一時停止した実行を再開し、承認後にAgentを続行させます
- 同一Agent実行内で複数の連続したHITLチェックポイントをサポートします

## Agentの設定

AgentのプロパティパネルでHITLを有効化します。

| 設定項目 | 説明 |
|---------|-------------|
| `hitlEnabled` | このAgentに対する人間によるレビューを有効化します |
| `hitlSummary` | Agentが人間のレビューを要求すべきタイミングに関する承認ガイドライン |

HITLはAgentに `request_human_review` ツールを追加します。システムPromptと `hitlSummary` ガイドラインを使用して、どのアクションに承認が必要かをAgentに指示してください。Agentがチェックポイントにレビューが必要と判断すると、単一のMarkdownレビューテキストを人間に送信します。レビュアー向けのサマリーは実行時にAgentのリクエストから生成されます。Agentが省略した場合、HeymがMarkdown本文からサマリーを生成します。v1では、HITLはテキストモードのAgent出力のみをサポートするため、`jsonOutputEnabled` と組み合わせることはできません。

MCPツールの場合、Heymはモデルに対して、記述されたHITL指示を次の3つの承認スコープのいずれかに解釈するよう要求します。

- `always`：「always」「on each」「for each」などのフレーズに対応
- `once`：「once」「only one time」などのフレーズに対応
- `never`：「never」「do not ask」「already approved」などのフレーズに対応

この解釈により、繰り返されるMCP呼び出しが再度一時停止するか、一度承認された状態を維持するか、人間のレビューを完全にスキップするかが制御されます。

HITLが有効な場合、Agentは `review` というラベルの付いた2つ目のキャンバス出力ハンドルも公開します。このブランチを使用して、メイン実行が人間の応答を待つ間に、保留中のレビューURLとサマリーをSlack、メール、ログ、その他の通知フローに送信できます。

## レビューフロー

1. Agentが承認が必要なステップに到達し、`request_human_review` を呼び出します
2. Heymが公開レビューリクエストを作成し、レビューURLを返します
3. Agentの `review` ハンドルに接続されたノードが、保留中のHITL Payloadとともに即座に実行されます
4. Workflow実行が `pending` に移行します
5. レビュアーがログインせずに `/review/{token}` を開きます
6. レビュアーが次のいずれかのアクションを選択します：
   - `Accept`：元のMarkdownで続行します
   - `Edit & Continue`：編集されたMarkdownで続行します
   - `Refuse`：`decision: "refused"` で続行し、以降のAgentアクションをスキップします
7. Heymが保存されたスナップショットからWorkflowを再開し、承認されたMarkdownコンテキストでAgentを続行させます
8. 後続のステップでも承認が必要な場合、Agentは再度HITLを呼び出して別の保留中チェックポイントを作成できます

誰も応答しない場合、レビューリンクは168時間後に失効します。

## 公開レビューページ

公開レビューページには以下が表示されます。

- Workflow名とAgentラベル
- Agentのレビューリクエストから自動生成されたレビュアー向けサマリー
- メインコンテンツとして最初に表示されるMarkdownレビューテキスト
- レビュアーが `Edit` をクリックした後にのみ開く編集ボックス
- 編集中のライブMarkdownプレビュー
- `Accept`、`Edit & Continue`、`Refuse` のアクションボタン

判断が送信されると、Tokenはロックされ再利用できなくなります。

## 出力と実行状態

レビューを待機している間、Agent出力には保留中のPayloadが含まれます。

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

レビュアーが応答しWorkflowが再開された後、最終的なAgent出力には判断メタデータが含まれます。

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

下流のノードで `$agentLabel.decision` を使用して、accepted、edited、refused の結果に分岐させることができます。

## キャンバスのレビューブランチ

`review` 出力ハンドルは、Agentで `hitlEnabled` が有効になっている場合にのみ使用できます。

- 人間の判断が届く前に実行されます
- `summary`、`draftText`、`reviewUrl`、`shareText`、`shareMarkdown` を含む保留中のHITL Payloadを受け取ります
- Slack、メール、監査ログなどの通知またはハンドオフステップを目的としています
- HITLチェックポイントごとに1回実行されます
- レビュアーが応答した後は再度実行されません。再開時には通常のAgent出力パスのみが続行されます

## 表示される場所

- [実行履歴](./execution-history.md)では、`pending` の実行が即座に表示され、レビュー URL がノードの結果に保存されます
- [Portal](./portal.md) のチャット応答では、空の回答の代わりに human review リンクが表示されます
- Debug パネルと履歴ダイアログには、最終的な HITL の判断とレビュー済みテキストが表示されます
- Workflow が Cron、cURL、または Portal トラフィックによって Trigger された場合でも、レビュー出力ハンドルは外部チャネルに通知できます
- 複数の HITL チェックポイントは同じ実行履歴エントリを再利用しつつ、一時停止ごとに新しいワンタイムレビューリンクを作成します

## 現在の制限

- HITL は Agent ノードでのみ利用可能です
- HITL は Agent のテキスト出力を使用し、v1 では JSON 出力をサポートしていません
- 一時停止された実行は、最新の編集済み Workflow バージョンではなく、保存された Workflow スナップショットから再開されます
- v1 では、ネストされたサブ Workflow は pending の HITL 状態に入ることができません。呼び出す前に親 Agent からレビューをリクエストしてください

## 関連

- [Agent ノード](../nodes/agent-node.md) - Agent で HITL を設定する
- [Agent アーキテクチャ](./agent-architecture.md) - Agent、ツール、サブ Agent、HITL の関係
- [実行履歴](./execution-history.md) - pending および再開された実行を確認する
- [Board](../tabs/board-tab.md) - Board チェーン実行では、HITL 時にカードが pending（アンバー）状態で一時停止します
- [Portal](./portal.md) - パブリックチャットフローと HITL レビューリンク
