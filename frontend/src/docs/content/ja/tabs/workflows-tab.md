# Workflowsタブ

**Workflows**タブはデフォルトのダッシュボードビューです。Workflowのリスト、フォルダ構造を表示し、Workflowの作成、編集、整理ができます。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Workflowsデモを見る</a></p>

## チャットを開始する

Workflowリストの上部には、あなたの名前で挨拶し、何を自動化したいかを尋ねるチャットボックスがあります。Promptを入力し、必要に応じてファイルを1つ添付し、使用するcredentialとモデルを選択してください。どちらのドロップダウンも検索可能で、初期値は[AI defaults](../reference/user-settings.md)になっています。

送信すると新しい会話が作成され、[Chatタブ](./chat-tab.md)で開かれ、返信がストリーミング表示されます。対応している添付ファイルはテキストファイル、画像、PDFで、1メッセージにつき1つまで、チャットコンポーザーと同じです。

まだLLM credentialがない場合、ボックスには[Credentialsタブ](./credentials-tab.md)へのリンクが表示され、送信は無効のままです。

**x**をクリックするとボックスを非表示にできます。するとWorkflows見出しの横に**Ask AI**ボタンが表示され、ボックスを元に戻せます。この選択はブラウザに記憶されます。

## Workflowリスト

リストは2ペイン表示です。左側にWorkflowとフォルダ、右側に選択したWorkflowのプレビューが表示されます。

- 各行にはWorkflowのアイコン、名前、説明、最終更新日時、[ステータスチップ](#workflow-status)が表示されます
- Workflowはルートまたはフォルダ内に配置でき、ピン留めされたWorkflowは最上部の専用の**Pinned**グループに表示されます
- 行を**クリック**すると選択され、右側にプレビューが読み込まれます
- 行を**ダブルクリック**するか、フォーカス中に**Enter**を押すと、[エディタ](../getting-started/quick-start.md)で開きます
- **Ctrl+クリック**（または**Cmd+クリック**）で新しいタブで開きます
- 各行の右側には編集、コピー、ピン留め、削除のアクションがあります。スマートフォンでは名前が全幅を保つために非表示になります。その場合は行を**長押し**するとアクションシートが開きます
- よく使うWorkflowを[Quick Drawer](../reference/quick-drawer.md)にピン留めすると、Workflowsタブや他の内部ページからすばやく実行できます

## Workflowプレビュー

Workflowを選択すると、リストの横のプレビューパネルに内容が表示されます。幅1280px未満の画面では、同じパネルが画面下部からのシートとして開きます。

パネルには以下が表示されます：

- Workflowの名前、作成者と作成日時、最終編集日時
- **Open Workflow** – Workflowをエディタで開きます
- **Run Now** – Workflowを[Quick Drawer](../reference/quick-drawer.md)で開きます。リストを離れることなく、入力値を埋めて実行を開始できます
- **Description** – Workflowの説明
- **Trigger Configuration** – cron Workflowのスケジュール、またはイベントWorkflowのリッスンTrigger。HTTP経由で呼び出されるWorkflowでは、生のEndpointと認証の説明の代わりに**Copy cURL**ボタンが表示されます。これをクリックすると、正しいURL、ヘッダー、認証プレースホルダー、およびWorkflowの入力フィールドから構築されたbodyを含む完全なリクエストがコピーされます。Workflowが[portal](../reference/portal.md)を公開している場合、その公開チャットリンクもここに表示されます
- **Last Run Details** – 最新の実行の結果と所要時間、またはWorkflowが一度も実行されていない場合はその旨の注記
- **Workflow Steps & Sub-agents** – 実行順に並んだノード。それぞれにモデル、操作、またはスケジュールと、アクティブかどうかを示すドットが表示されます。ステップを選択すると、そのノードがエディタでプロパティパネルを開いた状態で表示されます

パネルはスクロール中もリストの横に固定されるため、長いWorkflowリストでも読みやすく保たれます。

## インスタンス管理

`HEYM_ADMIN_EMAILS` に記載されたアカウントは、共有や所有権の移譲を行うことなく、インスタンス上の任意の Workflow を一覧表示、オープン、編集、実行履歴の確認、削除できます。この設定はメールアドレスのカンマ区切りリストであり、大文字と小文字を区別せずに照合されます。リストが空の場合、誰にもこのアクセス権は付与されません。変更後はバックエンドを再起動してください。

管理者は Workflow 一覧で所有者のメールアドレスを確認でき、そのアドレスで検索できます。Workflow を選択すると、プレビューに **Instance administration** が表示されます：

1. **Pause triggers** は Cron ノードを含む Workflow にのみ表示されます。通常のバージョン付き保存を通じて、その Workflow の Cron およびその他の自動 Trigger ノードを無効化します。既存の実行は完了できます。手動、API、ポータル、およびサブ Workflow からの呼び出しは引き続き利用可能です。この操作は Workflow 全体の実行ロックではありません。
2. 一時停止中は、ページをリロードした後も含め、ボタンが **Resume triggers** に変わります。Resume は管理者が一時停止した Trigger を再度有効化し、すでに無効化されていた Trigger は変更しません。管理者による一時停止状態が保存されていない古い一時停止済み Workflow の場合、Resume はその自動 Trigger を有効化します。
3. 実行が落ち着いたら、Workflow 行の **Delete workflow** アクションを使用してください。実行中、キュー待ち、またはレビュー待ちの処理が残っている間、削除は競合を返します。スケジュール削除も同じチェックを適用します。

削除する前に Trigger を一時停止し、既存の実行を完了させてください。一時停止時にすでにディスパッチされた Trigger は引き続き完了できます。Workflow を呼び出せないようにする必要がある場合は削除を使用してください。

所有者専用の Webhook シークレットおよび認証設定は、既存の保護を維持します。管理操作によって所有権が移譲されたり、所有者の認証情報レコードが共有されたりすることはありません。管理者による一時停止、再開、削除、スケジュール操作は、実行者である管理者と Workflow 所有者とともに [audit trail](../reference/audit.md) に記録されます。

## Workflow ステータス

各行には、Workflow の Trigger ノード、そのライブ実行状態、および（Trigger ノードを持たない Workflow の場合）直近の実行がどのように開始されたかに基づいて導出されたステータスチップが表示されます：

| ステータス | 意味 |
| --- | --- |
| **Running** | Workflow で現在実行中の処理がある |
| **Scheduled** | アクティブな [cron](../nodes/cron-node.md) Trigger がある |
| **Listening** | Slack、Telegram、IMAP、WebSocket Trigger など、アクティブなイベント Trigger がある |
| **Paused** | Trigger ノードがあるが、そのすべてが無効化されている |
| **API** | Trigger ノードがなく、最後に execute Endpoint への HTTP 呼び出しによって実行された |
| **SubWorker** | Trigger ノードがなく、最後に親 Workflow からサブ Workflow として実行された |
| **Portal** | Trigger ノードがなく、最後に [portal](../reference/portal.md) から実行された |
| **WEB** | Trigger ノードがなく、唯一の終端が [HTML output mapper](../nodes/html-output-mapper-node.md) であるため、呼び出すとレンダリングされた Web ページが返される |
| **Manual** | Trigger ノードがなく、一度も実行されていない、または最後の実行が別の場所から行われた |
| **Remove Scheduled** | [削除がスケジュールされている](../reference/workflow-organization.md) |

API、SubWorker、Portal のチップは、Workflow の [実行履歴](./logs-tab.md) の直近 1 件のエントリを読み取るため、2 通りの方法で呼び出される Workflow は最後に来た方を表示します。**WEB** は代わりにグラフから判定されるため、これら 3 つよりも優先されます。ページを提供する Workflow は、HTTP 経由で呼び出された後でも WEB と表示されます。Trigger ノードは常にこれらすべてよりも優先されます。誰かが HTTP 経由でも呼び出す cron Workflow は **Scheduled** のままです。

検索フィールドの横にある **Status** ドロップダウンを使用すると、1 つのステータスのみを表示できます。ドロップダウンには、現在それぞれに一致する Workflow の数が表示されます。ステータスフィルターはフォルダ内にも及びます。一致するものがあるフォルダは自動的に展開され、一致しないフォルダはフィルターを解除するまで非表示になります。

## アクティブな Workflow

デスクトップでは、上部ツールバーの円形バッジに現在実行中の Workflow の数が表示され、10 秒ごとに自動的に更新されます。ゼロ以外のバッジをクリックするとアクティブな Workflow リストが開き、スクロールする前に最大 4 行が表示されます。Workflow 名を選択すると、エディタがその実行のライブビューに接続されます。ゼロのバッジは情報提供用であり開くことはできず、バッジはモバイル画面では非表示になります。

## 検索

**Status** の横にある Workflow 検索フィールドを使用するか、**Ctrl+F**（または **Cmd+F**）を押して、タイトルまたは説明で Workflow をフィルタリングします。フォルダ内で一致する Workflow は、そのフォルダブランチが展開されて表示されます。**Escape** を押すと検索がクリアされます。

## フォルダ

- Workflow を[フォルダとサブフォルダ](../reference/workflow-organization.md)に整理できます
- **New Folder** ボタンでフォルダを作成し、それぞれに名前と、リスト内で名前の下に表示される任意の説明を設定できます
- 各フォルダの行には、サブフォルダを含めた保持している Workflow の数が表示され、あわせて新規サブフォルダ作成、名前変更、アイコン変更、ZIP としてダウンロード、削除の各アクションが並びます。スマートフォンでは、行には代わりに単一のメニューボタンが表示されます
- Workflow をフォルダまたはサブフォルダの上にドラッグすると、カードサイズのドロップ先プレビューが表示されます。ハイライトされたプレビューにはドロップ前の完全なフォルダパスが表示され、折りたたまれたフォルダにホバーすると一時的に展開されるため、ネストされたフォルダにもアクセスできます
- Workflow はフォルダ間またはルートへドラッグできます。ドラッグ中のカードはゴーストとして表示され続け、スクロール中もアクティブなドロップ先がハイライトされたままになります
- Workflow を現在のフォルダに戻すドロップは無効化され、**Already in Folder** と表示されます
- フォルダの名前変更アクションまたは右クリックのコンテキストメニューから、フォルダの名前や説明を変更できます

## Workflow の作成

1. **New Workflow** をクリックします
2. 名前と任意の説明を入力します
3. Workflow がエディタで開きます

## インポート

JSON Workflow ファイルを Workflow エリアにドラッグ＆ドロップすると、新しい Workflow が作成されます。インポートされたノードとエッジが Workflow の作成に使用され、名前は JSON の `name` フィールドまたはファイル名から取得されます。JSON 形式とインポートオプションについては、[ダウンロードとインポート](../reference/download-import.md)を参照してください。

## 共有

エディタで Workflow を開き、**Share** をクリックしてメールでユーザーを招待するか、[チーム](./teams-tab.md)と共有します。各ユーザーまたはチームに対して **Read**（表示と実行）または **Write**（編集も可能）を選択し、後からエントリの横のドロップダウンで変更できます。Credentials とサブ Workflow は自動的には共有されません。同じユーザーまたはチームと個別に共有してください。詳細は[Workflow の整理](../reference/workflow-organization.md#sharing-workflows)および [Credentials の共有](../reference/credentials-sharing.md)を参照してください。

## 編集と削除

- **Edit** – 行の編集アクションから Workflow の名前と説明を変更します
- **Delete** – Workflow は[削除がスケジュールされ](../reference/workflow-organization.md)、完全に削除される前にゴミ箱エリアへ移動します

## 同時編集

保存時には、編集の基になったリビジョンが送信され、その間に Workflow が変更されていた場合（たとえばチームメイトが保存した、または同じ Workflow を別のタブで開いていた場合など）、サーバーは書き込みを拒否します。その際、Heym は **Stale Workflow Detected** ダイアログを表示し、2 つの選択肢を提示します：

- **Cancel** – 未保存の変更をエディタに保持し、別のタブで再読み込みして調整できます
- **Override** – そのまま保存し、他のユーザーのバージョンを置き換えます

Workflow の**実行**時にはまず保存が行われるため、同じチェックを経由します。背後で Workflow が変更されていた場合、実行はサイレントに上書きされるのではなく、ダイアログで一時停止します：**Override and Run** はあなたのバージョンを保存して実行を開始し、**Cancel Run** は両方を破棄して編集内容をそのまま保持します。

このチェックは保存リクエスト自体の一部であるため、余分なラウンドトリップは発生せず、保存がチェックをすり抜ける余地もありません。アプリ内の他の場所からの自身の変更（名前変更、設定変更、プロパティパネルのトグルなど）は、競合としてカウントされることはありません。

## コマンドパレット

**Ctrl+K**（または **Cmd+K**）を押すと、コマンドパレットが開きます。以下のことができます：
- 名前で Workflow を検索
- 任意の[ダッシュボードタブ](./credentials-tab.md)へジャンプ
- 最近の Workflow を開く

## 関連項目

- [クイックスタート](../getting-started/quick-start.md) – 最初の Workflow を構築する
- [Workflow の整理](../reference/workflow-organization.md) – フォルダ、サブフォルダ、スケジュール削除
- [Workflow の構造](../reference/workflow-structure.md) – Workflow の JSON 形式
- [ダウンロードとインポート](../reference/download-import.md) – Workflow を JSON としてエクスポートおよびインポート
- [ポータル](../reference/portal.md) – Workflow を公開チャット UI として公開
- [ボード](./board-tab.md) – カラムチェーン経由でかんばんカードから Workflow を実行
- [コアコンセプト](../getting-started/core-concepts.md) – Workflow、ノード、実行
- [実行履歴](../reference/execution-history.md) – 過去の実行の表示とキャンバスへの取り込み
- [クイックドロワー](../reference/quick-drawer.md) – ダッシュボード、ドキュメント、その他の非エディタページから Workflow をピン留めして実行
- [コンテキストショーケース](../reference/contextual-showcase.md) – ダッシュボード画面向けの短いページガイド
