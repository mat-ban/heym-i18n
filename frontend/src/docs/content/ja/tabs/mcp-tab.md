# MCPタブ

**MCP**タブでは、Model Context Protocol（MCP）連携を設定します。MCPを利用すると、AIクライアント（Claude、ChatGPT、Gemini、Cursor、その他MCP互換ツール）からHeymのWorkflowをツールとして呼び出せるようになります。

Heymは2つのモードをサポートしています。すべてのMCP対応Workflowを単一のEndpointで公開する**デフォルトサーバー**と、Workflowの論理的なグループごとに専用のURLとAPIキーを割り当てる**名前付きサーバー**です。

どちらのモードでも、2種類のツールを公開できます。個別の**Workflow**と、**Heymチャットツール**（[Chatタブ](./chat-tab.md)のエンジン全体を単一の`heym_chat`ツールとして提供するもの）です。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCPデモを見る</a></p>

## デフォルトMCPサーバー

デフォルトサーバーは常に`{origin}/api/mcp/sse`で利用できます。MCPを有効にしたすべてのWorkflowが、ここにツールとして表示されます。

### MCP APIキー

- キーはSHA-256ダイジェストとして保存されるため、Heymから既存のキーを表示することはできません。タブにはキーが設定済みかどうかのみが表示され、内容は表示されません。
- **Generate** / **Regenerate** – 新しいキーは作成直後に一度だけ表示されます。そのときにコピーしてください。タブを再読み込みすると完全に非表示になります。
- Claude Desktop、Cursor、その他のMCPクライアントをHeymに接続する際にこのキーを使用します
- キーを紛失した場合は再生成してください。以前のキーは即座に無効になります。

### 接続方法

- **API Key** – プログラムによる接続にはMCP APIキーを使用します。タブではすぐに使えるJSON設定をコピーでき、Cursorをワンクリックでセットアップする**Add to Cursor**ボタンも用意されています。
- **Claude** – タブにはMCPサーバーのURLとClaude向けのセットアップ手順が表示されます。OAuth Client IDとSecretは空欄のままにしてください。Claudeは自動的に登録され、Heym OAuth経由で認証されます。
- **ChatGPT** – タブには ChatGPT アプリ用の MCP サーバー URL とセットアップ手順が表示されます。開発者モード（Developer mode）をオンにし、URL を指定してアプリを作成し、OAuth を選択すると、ChatGPT が自動的に登録されます。
- **Gemini** – タブには Gemini カスタムアプリ用の MCP サーバー URL とセットアップ手順が表示されます。gemini.google.com で **Settings → Connected Apps → Add a custom app** を開き、URL を貼り付けて **Advanced features** は閉じたままにします。Gemini が自動的に登録され、Heym OAuth 経由で認証されます。一度接続すると、Gemini モバイルアプリでも Heym が機能します。

### WorkflowのMCPトグル

各WorkflowはMCPツールとして公開できます。

- **Enable** – そのWorkflowのツールが、デフォルトサーバーに接続しているすべてのクライアントから利用可能になります
- **Disable** – そのWorkflowは公開されません

Workflowカードには説明と入力フィールド名のプレビューが表示されるため、有効化する前に各ツールが何を期待するかを確認できます。


### キューイングされた実行と heym_execution_status

[同時実行制限](../reference/webhooks.md#concurrency-limit-and-queued-runs)が設定された Workflow は、クライアントが呼び出したときにビジー状態になる場合があります。その場合、呼び出しはエラーではない結果を直ちに返します：

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

クライアントはその `execution_id` を指定して `heym_execution_status` ツールをポーリングします。[ステータス URL](../reference/webhooks.md#status-url) と同じボディを返します：現在のキュー位置を示す `queued`、`running`、そして出力を含む `success` または `error` です。同じサーバーが公開している Workflow の実行のみを検索します。このツールは、デフォルトサーバーおよび各名前付きサーバーにおいて、少なくとも1つの Workflow に同時実行制限が設定されている間のみ一覧に表示されます。キューがいっぱいの場合、呼び出しは "Concurrency queue is full" エラーを返します。
## Heymチャットツール

**Heym Capabilities**セクションでは、Chatタブのエンジンを`heym_chat`という単一のMCPツールに変換します。デフォルトサーバー、任意の名前付きサーバー、またはその両方で有効化できます。それぞれのサーフェスが独自のトグルとモデル選択を保持します。

有効にすると、`heym_chat`はWorkflowツールと並んで`tools/list`に表示されます。MCPクライアントが自然言語のメッセージを1つ送信すると、Heymエンジンが以降を処理します。Chatタブと同じ機能を備えています。

- Workflow を構築し、サンプル入力でテスト実行し、修正して、実行が成功したら完了する（[ビルドモード](#build-mode)を参照）
- 既存の Workflow を検査・実行する
- 分析情報、最近の実行、今後のCronスケジュールのレポート
- 1つのWorkflowの実行履歴のレポート：実行回数、ステータス別の件数、実行日時、およびリクエストに応じて単一実行の入力・出力・ノードごとのエラー
- 現在実行中の内容のレポート：アクティブな実行数、Workflow名、各実行の経過時間、現在処理中のノード、ライブ実行へのリンク
- [Boardタブ](./board-tab.md)でのボード一覧、カード作成、カード詳細の読み取り
- データテーブルの列一覧表示、新規作成、および構築するWorkflowへの組み込み
- Heym 専用ページで Credential を作成または更新する（[Credentials](#credentials) を参照）
- チームとグローバル変数の読み取り、およびドキュメントの検索
- 保留中のhuman-in-the-loopレビューの承認、編集、拒否

Chatタブに後から追加された機能は、自動的に`heym_chat`から利用可能になります。機能ごとに同期が必要なトグルはありません。

### ビルドモード

`heym_chat` は常にビルドモード（build mode）で Chat エンジンを実行します。1 回の呼び出しで、アシスタントは新しい Workflow を保存し、現実的なサンプル入力で実行し、実行レポートを読み取り、失敗した箇所を修正して再実行するプロセスを、1 回の呼び出しにつき最大 5 回のテスト実行まで行えます。最新の保存に対する最新の実行が成功すると、1 文の要約で締めくくり、返信の末尾は `Verified: the latest test run of the saved workflow passed.` となります。

呼び出しによって Workflow が作成または編集されると、返信には `https://heym.example.com/workflows/<id>` などの完全なエディタリンク付きで各 Workflow が一覧表示され、アシスタントの回答内のリンクも完全なリンクになります。これらは設定された Heym アドレス (`FRONTEND_URL`) を使用し、Heym にログインしていてその Workflow にアクセスできるユーザー向けに開きます。

- テスト実行は実際の実行です。副作用も実際に発生し、他の実行と同様に Workflow の実行履歴に表示されます。
- 保存はエディターの経路を通ります。グラフを変更すると、以前のグラフは Workflow の **Edit History** に保持されます。
- 以前に構築した Workflow を変更するには、同じ `conversation_id` でスレッドを続行してください。アシスタントは新しい Workflow を作成する代わりにその Workflow を更新し、あなたが編集可能な Workflow のみを変更します。
- 5 回のテスト実行を使い切ると、アシスタントは停止し、何がまだ失敗しているかを説明します。

データテーブルは異なります。テーブルには秘密情報が含まれないため、`heym_chat`はテーブルの一覧表示、Workflowがどのテーブルを使用すべきかの問い合わせ、列を指定した新規テーブルの作成を行えます。行の読み取りや書き込みは行いません。

### Credentials

`heym_chat` は、Chat タブと同様に、自身が所有する Credential および共有された Credential を名前とタイプで認識します。構築する Workflow が Credential を必要とする場合、結果内の質問としてどれを使用するかを尋ねます。同じ `conversation_id` で回答してください。

Credential を追加するか、所有しているものを更新する場合、アシスタントは Heym ページ `/credentials/setup/<id>` で Credential フォームを開きます。そこで Heym にサインインし、キーを入力するかアカウントを接続して保存をクリックします。値は Heym に直接送信されます。MCP クライアントとそのモデルは Credential の名前とタイプのみを認識します。MCP クライアントにキーを貼り付けないでください。代わりにフォームをリクエストしてください。

| クライアント | 動作 |
|------------|------|
| MCP URL エリシテーションに対応 | クライアントが Heym ページを開くよう促します。フォームを入力する間、最大10分間待機し、新しい Credential で処理を続行します。 |
| それ以外 | 結果にリンクが含まれ、`wait_for_credential_form` を指定して再度 `heym_chat` を呼び出すようクライアントに要求します。その呼び出しはフォーム入力中に最大5分間待機し、その後会話を再開します。クライアントが待機しない場合は、フォームを保存してから同じ `conversation_id` で返信してください。次の呼び出しでフォームが保存されたことと作成された Credential が認識されます。 |

ページはリクエストを開始した Heym アカウント専用に開くため、転送されたリンクは他の誰にも使用できません。フォームは24時間有効で、ページから辞退することもできます。保存または辞退すると、Chat タブの会話内のステップに結果が表示されます。


### Credentialとモデル

`heym_chat`はあなたのHeymアカウント上でエンジンを実行するため、専用のLLM Credentialが必要です。

| フィールド | 動作 |
|-------|----------|
| **Credential** | アクセス可能なOpenAI、Google、またはCustomのCredentialを選択します。未選択の場合、[Settings](../reference/user-settings.md)の優先Credentialから事前入力されます。 |
| **Model** | 選択したCredentialから読み込まれます。Credentialが一致する場合、優先モデルから事前入力されます。 |

いずれかが欠けている場合でも、ツールは`tools/list`に表示されますが、各呼び出しはこのタブでセットアップを完了するよう促すエラーを返します。


`heym_chat` が構築する Workflow 内の LLM ノードおよび Agent ノードは、共有 Credential を含め、この Credential とモデルで実行されるため、追加のセットアップ手順なしでテスト実行が機能します。`heym_chat` が Workflow を編集する場合、すでに Credential を持つ LLM ノードおよび Agent ノードは、モデルとともにそれを維持します。
### 引数と履歴

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `message` | はい | 自然言語による指示または質問。 |
| `conversation_id` | いいえ | 以前の`heym_chat`の結果から得た`conversation_id`。そのスレッドを継続するために使用します。 |
| `wait_for_credential_form` | いいえ | `conversation_id` と共に指定：スレッドが開いた Credential フォームをユーザーが保存または辞退するまで待機してから `message` を送信します。 |

すべての呼び出しは、通常の会話として[Chatタブ](./chat-tab.md)の履歴に記録され、会話一覧ではプラグアイコンで示されます。メッセージ、ツールカード、確認のための一時停止は、自分で開始した会話とまったく同じように表示され、スレッドを開いてブラウザ上で会話を続けることもできます。各結果は`conversation_id`を返すため、MCPクライアントは呼び出しごとに新しいスレッドを開くのではなく、同じスレッドを継続できます。

アシスタントが確認を必要とする場合、一時停止してその旨を伝えます。同じ`conversation_id`を使用して回答を返信してください。

## 名前付き MCP サーバー

名前付きサーバーを使用すると、Workflow を分離された MCP Endpoint にセグメント化できます。各サーバーは独自の URL と API Key を持つため、異なる AI クライアント、チーム、ユースケースが、必要な Workflow に正確に接続できます。

### 名前付きサーバーの作成

1. MCP タブの下部にある入力フィールドに名前を入力します（例: **CRM Tools**）
2. **Create** をクリックすると、新しいサーバーカードがすぐに表示されます
3. カードをクリックして展開します

### サーバーごとの設定

各サーバーカードには以下が表示されます：

| 設定 | 説明 |
|---------|-------------|
| **SSE Endpoint** | 一意の URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | 独立したキー。生成時または再生成時に一度だけ表示されます。すぐにコピーしてください。ハッシュ化して保存されるため、後から表示することはできません |
| **How to connect** | **Copy JSON** はすぐに貼り付けられる MCP 設定をコピーします。**Add to Cursor** はワンクリックでインストールします |
| **Heym Capabilities** | このサーバーの `heym_chat` ツールを切り替え、その credential とモデルを選択します |
| **Assigned Workflows** | このサーバーが公開する Workflow を切り替えます |

### Workflow の割り当て

Workflow の割り当てはサーバーごとに行われ、デフォルトサーバーの切り替えとは独立しています。1 つの Workflow をデフォルトサーバーと複数の名前付きサーバーで同時に有効にすることも、どのサーバーでも有効にしないこともできます。

Workflow を切り替えると、その Workflow は割り当てリストの先頭に移動するため、変更した行がスクロールして見えなくなることなく、表示されたままになります。

### 認証

名前付きサーバーは、デフォルトサーバーと同じ認証方式をサポートしています：

- **X-MCP-Key header** – サーバーの API Key を直接渡します（API クライアント、Cursor）。Header のみ：キーは `?key=` クエリパラメータとして受け付けられません。URL はアクセスログ、プロキシログ、ブラウザ履歴に残るためです。
- **Claude、ChatGPT、Gemini の OAuth** – クライアントのコネクタまたはカスタムアプリにサーバー URL を追加します。credential を空のままにすると、クライアントが OAuth 経由で自動的に登録します。bearer token は `?token=` ではなく、`Authorization` header で送信する必要があります。
- **Session token** – SSE ハンドシェイク中に発行されます。特定のサーバーにスコープされるため、ある名前付きサーバーの token が別のサーバーにアクセスすることはできません。この短命な `?session=` パラメータは影響を受けません。

### 名前付きサーバーの削除

サーバーカードのヘッダーにある **X** アイコンをクリックします。削除すると、サーバーとそのすべての Workflow 割り当てが削除されますが、Workflow 自体は影響を受けません。

## SSE Endpoint

| サーバー | Endpoint |
|--------|----------|
| デフォルト | `{origin}/api/mcp/sse` |
| 名前付き | `{origin}/api/mcp/servers/{server-uuid}/sse` |

どちらの Endpoint も SSE トランスポート（GET、MCP 仕様 2024-11-05）と Streamable HTTP トランスポート（POST、MCP 仕様 2025-03-26）をサポートしています。Claude、ChatGPT、Gemini はどちらでも安全なサインインのために OAuth 2.1 / PKCE を使用します。

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – Heym における MCP の第一級プリミティブとしての位置づけ
- [Agent Node](../nodes/agent-node.md) – MCP ツールをサポートする Agent ノード
- [Agent Architecture](../reference/agent-architecture.md) – MCP クライアント、ツールディスパッチ、オーケストレーター
- [Triggers](../reference/triggers.md) – Workflow のエントリーポイントとしての MCP
- [Chat Tab](./chat-tab.md) – `heym_chat` ツールの背後にあるエンジン
- [Workflows Tab](./workflows-tab.md) – Workflow の作成と管理
- [Node Types](../reference/node-types.md) – AI ノードの概要
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面のコンパクトなページガイド
