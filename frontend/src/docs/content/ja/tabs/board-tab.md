# Board

**Board**タブはエージェント型カンバンボードです。作業はカラム間を移動し、各カラムはHeym Workflowを実行できます。カードは単なるタスクではなく、コンテキスト、会話履歴、実行状態、出力、Workflow実行を保持する永続的なエージェント型ジョブです。

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## ボードとカラム

- ボードは必要な数だけ作成できます。新しいボードはデフォルトのカラム **Backlog → Planning → Development → Done** で始まります。
- すべてのボードには **Agentic Kanban Model**（credentialとモデル）が必要です。これは必須です — これがないとNew boardダイアログはボードを作成できず、設定されていないボードはアクションが無効のままになります — これは、このモデルが各カードを実行するWorkflowの入力にマッピングし、その出力を読みやすいテキストに戻す役割を担うためです。
- ボードヘッダーの歯車アイコンでボード設定を開きます：名前、説明（ヘッダーの下に表示）、およびAgentic Kanban Modelです。
- カラムは完全に編集可能です：カラム設定から追加、名前変更、色変更、並べ替え、削除ができます（削除するにはカラムが空である必要があります）。
- カードは優先度に従って縦に並びます — ドラッグして並べ替えられます。
- [Chatタブ](./chat-tab.md)から自然言語のリクエストでカードを作成することもできます。Chatは必要に応じてボードの選択を求め、常にそのボードの最初のカラムにカードを追加します。

## ボードの共有

ボード設定では、**ユーザー**（メールアドレス指定）および**チーム**と、`read`または`write`権限でボードを共有できます：

- **read** — ボードとそのカードは表示できますが、何も変更できません：新しいカードの作成、移動、コメント、実行はできません。
- **write** — ボードを完全に使用できます：カード、移動、コメント、実行。
- 歯車と削除ボタンが表示されるのは**オーナー**のみで、ボードの設定、Agentic Kanban Model、共有を変更できるのもオーナーだけです。

共有ボード上のチェーンは常に**オーナー**のcredentialとAgentic Kanban Modelで実行されるため、コラボレーターが自身のものを用意する必要はありません。

## カードの添付ファイル

カードを開き、**Attach file**でファイルを追加します — ボックスにドロップするかボタンで選択し、同じリストから削除できます。添付ファイルは[Drive](./drive-tab.md)に保存されます。

すべての実行は、**Workflowが開始する前に添付ファイルを種類別に解決**します：

- **ドキュメント**（pdf、markdown、csv、json、text）はテキストに抽出され、ファイルごとに20,000文字が上限で、添付ファイルの`text`フィールドに格納されます。
- **画像**は、visionパスが直接読み込む`url`として渡されます（LLMノードの画像入力はそのまま受け取れます）。
- **その他**は、プレーンな参照（`name`、`url`、`mime_type`）として渡されます。

Workflowはこれらを`$input.card.attachments`で読み取ります（また、マッパーが何をマッピングしたかに関わらず、常に`$input.board.attachments`でも読み取れます）。Agentic Kanban Modelも抽出されたテキストと画像URLを参照できるため、Workflowが期待するフィールドに添付ファイルを直接マッピングできます。

## カラムのWorkflowチェーン

各カラムには**順序付きのWorkflowリスト**（チェーン）を設定できます。
チェーンを持つカラムにカードが移動すると：

1. チェーンはバックグラウンドで自動的に開始されます — 移動自体は待機しません。
2. Workflowは**順番に**実行されます。各Workflowの出力は、次のWorkflowが始まる前にカードコンテキストに追加されます。
3. Workflowが失敗すると、チェーンは停止します：残りのリンクはスキップされ、カードは**赤**になります。
4. すべてのリンクが成功すると、カードは**緑**になります。チェーンの実行中はカードが**琥珀色**に点滅します。人間のレビューのために一時停止された実行は、静止した琥珀色の状態を表示します。

実行は`board` Triggerソースとして[Execution History](../reference/execution-history.md)に記録され、各カードはWorkflowごとの出力とエラーを含む独自の実行リストを保持します。Workflowの実行中にカードを開き、実行の横にある**Open live**を選択すると、その正確な実行にエディタを接続できます。同じキャンバスアニメーション、増分Debugログ、最終結果が、2回目の実行を開始することなく表示されます。

## Workflowが受け取るもの

チェーンは標準的なPayloadをWorkflowの入力として渡します。`$input.card.title` などの通常の[式](../reference/expression-dsl.md)で読み取ることができます：

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — カード上のすべてのコメント（古い順）。
- `history` — 完全なアクティビティタイムライン（コメント、移動、出力）。直近200件までに制限されます。
- `previous_outputs` — 以前に完了した実行（以前のカラムおよびフォローアップラウンド）からの出力。
- `chain.previous_workflow_outputs` — *現在の*チェーン内の先行リンクの出力。
- フォローアップラウンドでは、`move` は `null` になり、`rerun` は `true` になります。

## プランニングループ（フォローアップラウンド）

一般的なパターンは、プランニングWorkflowを**2番目のカラム**（デフォルトではPlanningという名前ですが、名前は重要ではなく、スロットの位置が重要です）に配置することです。このWorkflowはカードを拡充し、フォローアップの質問を行います：

1. カードを2番目のカラムに移動します — Workflowは拡充されたプランとその質問を出力としてカードに書き戻します。
2. カードのコメントスレッドで回答します。回答によってカードが解放されます：次のカラムに移動し、そのカラムが回答をコンテキストとして引き継ぎます。2番目のカラムのチェーンは再度実行されません。
3. 代わりにプランをその場で改善するには、**Run follow-up round** を押します。同じチェーンが蓄積されたすべてのコンテキストとともに再度実行され、その後カードはそのカラムで待機し、コメントを追加して解放するまで待ちます。

プランニングゲートは名前ベースではなく位置ベースです：最も左のカラムとそのすぐ右隣のカラムは自動的には先に進みません — チェーンを実行してそこであなたを待ちます（コメントによって2番目のカラムが解放されます）。3番目のカラム以降は、チェーンが成功するとカードは自動的に右へ進み、最後のカラムまで到達します。デフォルトの「Planning」ラベルの名前を変更したり削除したりしても、どのスロットがゲートであるかは変わりません。カードは同時に1つのアクティブな実行のみを持つことができます。

## Human-in-the-LoopとCodexの質問

チェーンのWorkflowが一時停止した場合 — [Human-in-the-Loop](../reference/human-in-the-loop.md)ノード、AgentのHITLツール、または[Codex](../nodes/codex-node.md)ノードがより多くの情報を必要とした場合 — 実行は保留中として永続化され、カードは琥珀色の保留状態を表示します。各一時停止はそれぞれ独自の回答サーフェスを保持します：HITLにはHITLレビューリンク、CodexにはCodexフォローアップ画面です。

回答すると、チェーンは自動的に再開します：一時停止していたWorkflowが完了し、その出力がカードに反映され、そのカラムのチェーンの残りが実行され、カードは通常どおり進みます。再開された実行が失敗した場合、カードは赤くなり、残りのリンクはスキップされます。

## 関連項目

- [Workflow](./workflows-tab.md)
- [実行履歴](../reference/execution-history.md)
- [式DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
