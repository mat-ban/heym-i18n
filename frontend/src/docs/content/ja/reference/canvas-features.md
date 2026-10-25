# Canvasの機能

Workflowエディタには、ノードのデバッグ、テスト、整理のための機能がいくつか用意されています：**Run to Node**、**ノードの AI**、**Data Pin**、**Execution Logs**、**Enable/Disable**、**Extract to Sub-Workflow**です。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ エディタのデモを見る</a></p>

## Run to Node

付箋（sticky note）以外の任意のノードにカーソルを合わせ、その下の**Run**をクリックします。Heymはそのノードと上流の依存関係を実行し、下流のノードや無関係なブランチには手を付けません。これはキャンバスのテストモードを使用し、ピン留めされた出力とWorkflowの通常のブランチ条件が含まれます。

選択したパスに入力フィールドがある場合、右側の**Run**パネルが開き、最初のフィールドにフォーカスします。値を入力し、**Run to _ノードラベル_**をクリックするか、**Ctrl+Enter**（macOSではCmd+Enter）を押します。汎用bodyモードではJSON bodyエディタにフォーカスします。入力フィールドのないパスは、パネルを開かずにすぐに実行されます。ピン留めされたInputノードは、入力を求めることなくピン留めされた出力を再利用します。

パネルは後続の実行のために選択したターゲットを保持します。ターゲットをクリアするには**Run full workflow**を選択します。実行中はRunボタンが無効になります。ループ内のターゲットは、そのノードに最初に到達したときに実行を停止します。ループ後のノードを選択すると、上流のループ全体が実行されます。

## ノードの AI

付箋以外の任意のノードにカーソルを合わせ、その上にある **AI** をクリックします。[AI Assistant](./ai-assistant.md) がそのノードで開き、**Change this node as ...**、**Fix error in this node ...**、**Other** を提供します。Agent モードでは、アシスタントはそのノードのみを変更します。他のノード、接続、レイアウトはそのまま残ります。[AI Assistant › 単一ノードの変更](./ai-assistant.md#changing-one-node) を参照してください。

このボタンは、表示専用の権限を持つワークフローでは非表示になります。

## Data Pin

Data Pinを使用すると、最後の実行からノードの出力をピン留めできるため、ピン留めしたノードを再実行することなく下流のノードをテストできます。

### 場所

- **Propertiesパネル** – ノードを選択し、**Pinned Data**セクションまでスクロールします
- **ノードバッジ** – データがピン留めされると、ノードにピンアイコンが表示されます

### アクション

| アクション | 説明 |
|--------|-------------|
| **Pin** | ノードの最後の実行出力をピン留めします（実行後に使用可能） |
| **Clear** | ピン留めされたデータを削除します |
| **Edit** | ピン留めされたJSONを直接編集します。Saveをクリックして適用します |

### テストモードの動作

テストモードでWorkflowを実行すると、`pinnedData`を持つノードは実行をスキップし、代わりにピン留めされた出力を使用します。これは以下の用途に使用します：

- 外部APIを呼び出さずに下流のロジックをテストする
- ノードの出力を参照する式をデバッグする
- 固定のサンプルデータでPromptや条件を反復する

エディタの式補完は、利用可能な場合にピン留めされたデータを使用してフィールドを提案します。

## Execution Logs

**Debugパネル**（下部ドロワー）は、Workflow実行中のリアルタイム実行ログを表示します。HistoryダイアログまたはBoardカードから、実行中の本番実行を開くこともできます。エディタはその実行のSSEストリームに接続し、完了したノードの結果を復元し、新しいノードの開始と終了に応じてノードのアニメーションとログを表示し続けます。

### 表示内容

- **ノード結果** – ノードごとのステータス（`success`、`error`、`skipped`、`running`）、実行時間、出力
- **最終出力** – [Output](../nodes/output-node.md)ノードからの集約された出力
- **Agentの進行状況** – [Agent](../nodes/agent-node.md)ノードの場合、ステップごとのツール呼び出しと推論

### アクション

- **Copy as JSON** – 実行ログ全体をクリップボードにコピーします
- **Open in JSON editor** – 検査のためにログをJSON HeroまたはJSON Editor Onlineで開きます
- **Download generated files** – スキルがダウンロード可能なファイル（`_generated_files`）を生成した場合、Downloadボタンが表示されます。単一ファイルは直接ダウンロードされ、複数ファイルは選択ポップアップが開きます。

### Logsタブとの違い

Debugパネルは**Workflow実行**ログ（ノード結果、出力）を表示します。[Logsタブ](../tabs/logs-tab.md)は**Dockerコンテナ**ログ（バックエンド、フロントエンド、データベース）を表示します。 <!-- pragma: allowlist secret -->

## Enable / Disable

ノードを無効化して、実行中にスキップされるようにできます。無効化されたノードは「off」バッジが表示され、暗く表示されます。

### 切り替え方法

| 方法 | 説明 |
|--------|-------------|
| **Propertiesパネル** | ノードを選択 → Powerアイコン（右上） |
| **コンテキストメニュー** | ノードを右クリック → DisableまたはEnable |
| **キーボード** | ノードを選択 → **D**を押す（[Keyboard Shortcuts](./keyboard-shortcuts.md)を参照） |

### 複数選択

複数のノードが選択されている場合、Enable/Disableはそれらすべてに適用されます。コンテキストメニューは、選択されたノードのいずれかが無効化されている場合は「Enable」を、すべてが有効化されている場合は「Disable」を表示します。

### 実行時の動作

`active: false`のノードはスキップされます。下流のノードはスキップされたノードからデータを受け取りません。これは、ノードを削除せずに一時的に除外するために使用します。

手動ではなくWorkflow内からノードをオンまたはオフに切り替えるには、[Disable Node](../nodes/disable-node.md)と[Enable Node](../nodes/enable-node.md)を使用します。

## Agent memory graph

**[persistent memory](./agent-persistent-memory.md)** を有効にした [Agent](../nodes/agent-node.md) ノードには、ノード上にピンク色の **brain** コントロールが表示されます。これをクリックすると memory graph エディタが開きます。エンティティはエンティティタイプごとにクラスタリングされた、アニメーション付きの force-directed graph として描画され、リレーションシップを追加するための検索可能な Source/Target ピッカーと、リンクされたエンティティ間をジャンプするための connections パネルを備えています。同じダイアログには、[cross-agent memory sharing](./agent-persistent-memory.md#sharing-with-other-agents) のための **Share memory with other agents**（workflow → agent → read または read/write）も含まれています。ダイアログが開いている間は、メインキャンバスの undo/redo は保留されるため、graph 編集は独自の履歴を保持します。

**グラフのフィルタリング。** キャンバスの左上には検索コントロールがあり、クリックするか **Ctrl/Cmd+F** を押すまではショートカットボタンに折りたたまれています。これはエンティティの名前、タイプ、すべての属性キーと値、およびリレーションシップのタイプ（`parent_of`）とそのプロパティにマッチします。マッチしたリレーションシップは、その両端のエンティティも一緒に表示されます。空白で区切られたすべての用語がマッチする必要があります。マッチしたエンティティはその近傍全体（関与するすべてのリレーションシップと、それぞれの反対側のエンティティ）を伴って表示されるため、マッチが孤立した点として残ることはありません。マッチしたリレーションシップは、それが結ぶ 2 つのエンティティのみを表示し、そこで止まります。リレーションタイプの検索は、その両端が何に接続されているかではなく、そのリレーション自体に関する問いだからです。それ以外はすべて、キャンバス上および **All edges** リスト内でフェードではなく完全に非表示になり、バッジに全エンティティのうち何件が残っているかが表示されます。ボックス内の **✕** は、まずクエリをクリアし、2 回目の押下でボックスを閉じます。Escape も同じ順序で、最も内側から順に巻き戻します。まずクエリをクリアし、次に検索ボックスを閉じ、次に展開されたキャンバスビューを離れ、それらのいずれも開いていない場合にのみダイアログを閉じます。クリアすると、すべてのエンティティが元の位置に戻り、完全なグラフが復元されます。

**エンティティを手動で配置する。** エンティティをドラッグすると、ドロップした位置に固定されるため、auto-layout はそれを引き戻すのではなく、その周囲でグラフの残りを整えます。選択中のエンティティをドラッグすると、直接接続されたエンティティも一緒に移動し、クラスタの形状が保たれます。それ以外のエンティティをドラッグすると、そのエンティティのみが移動します。**Tidy layout**（wand ボタン）は、固定されたすべてのエンティティを解放し、auto-layout を再実行します。

## Extract to Sub-Workflow

選択したノードを再利用可能な sub-workflow に変換し、それらを [Execute](../nodes/execute-node.md) ノードに置き換えます。

### 使用方法

1. キャンバス上で 1 つ以上のノードを選択します
2. 右クリック → **Extract to Sub-Workflow**
3. 新しい workflow の名前（および任意で説明）を入力します
4. **Extract** をクリックします

### 何が起こるか

- 選択したノードを含む新しい workflow が作成されます
- 外部入力（選択範囲外からのエッジ）は、sub-workflow の [Input](../nodes/input-node.md) フィールドになります
- 外部出力（選択範囲外のノードへのエッジ）は、sub-workflow の [Output](../nodes/output-node.md) にマッピングされます
- 選択したノードは、新しい workflow を呼び出す単一の [Execute](../nodes/execute-node.md) ノードに置き換えられます
- 入力/出力マッピングは自動的に保持されます

### ユースケース

- 複数の workflow 間でノードのシーケンスを再利用する
- 関連するロジックをグループ化して複雑な workflow を簡素化する
- モジュール化された、テスト可能な sub-workflow を作成する

## Run with cURL

エディタツールバー（右上）の **cURL** ボタンをクリックすると、API 経由で workflow をTriggerするための cURL コマンドを構築してコピーするダイアログが開きます。

- workflow のリクエストボディモード（`Defined` または `Generic`）を選択します
- 認証タイプ（Anonymous、JWT、または Header Auth）を設定します
- レスポンスキャッシュとレート制限を構成します
- SSE streaming を切り替え、ノードごとの開始メッセージをカスタマイズします
- リクエストボディを編集します
- Generic モードでは、キャンバスの run パネルは cURL ダイアログと同じ raw JSON ボディを使用します
- **Copy cURL** をクリックして、すぐに実行できるコマンドをコピーします

ダイアログの詳細については [Webhooks](./webhooks.md#run-with-curl-dialog) を、イベントプロトコルについては [SSE Streaming](./sse-streaming.md) を参照してください。

## 関連項目

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – すべてのキャンバスおよびエディタのショートカット
- [Agent Persistent Memory](./agent-persistent-memory.md) – memory graph の動作と API
- [Execute Node](../nodes/execute-node.md) – sub-workflow を呼び出します
- [Expression DSL](./expression-dsl.md) – 参照と固定データ
- [Workflow Structure](./workflow-structure.md) – ノードとエッジのフォーマット
- [Download & Import](./download-import.md) – workflow を JSON としてエクスポートおよびインポート
- [Node Types](./node-types.md) – すべてのノードタイプ
- [Logs Tab](../tabs/logs-tab.md) – Docker コンテナログ
- [Execution History](./execution-history.md) – 過去の実行
- [Templates](../tabs/templates-tab.md) – workflow とノードの保存と再利用
- [Contextual Showcase](./contextual-showcase.md) – エディタで利用可能なコンパクトなページガイド
