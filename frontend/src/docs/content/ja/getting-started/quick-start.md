# クイックスタート

最初の Heym Workflow を数分で実行できます。

まだ Heym を起動していない場合は、[Running & Deployment](./running-and-deployment.md) を参照するか、以下の動画チュートリアルをご覧ください：[Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU)。

## 1. Workflow を作成する

1. [Workflows](../tabs/workflows-tab.md) タブに移動します
2. **New Workflow** をクリックします
3. Workflow に名前を付けます（例：「Hello World」）

## 2. ノードを追加する

1. 左側の **Nodes** パネルを開きます
2. [Input](../nodes/input-node.md) ノードをキャンバスにドラッグします
3. [LLM](../nodes/llm-node.md) ノードをドラッグし、Input に接続します
4. [Output](../nodes/output-node.md) ノードをドラッグし、LLM に接続します

```
[Input] --> [LLM] --> [Output]
```

利用可能なすべてのノードについては、[Node Types](../reference/node-types.md) を参照してください。

## 3. 設定する

- **Input**：デフォルト値を設定するか、ユーザー入力用に空のままにします（[Input Node](../nodes/input-node.md) を参照）
- **LLM**：[credential](../tabs/credentials-tab.md) とモデルを選択し、システム指示を追加して、`userMessage` を `$input.text` に設定します（[LLM Node](../nodes/llm-node.md) を参照）
- **Output**：`message` を `$llm.text` に設定して、LLM の応答をそのまま渡します（[Output Node](../nodes/output-node.md) を参照）

`$input.text` と `$llm.text` には [Expression DSL](../reference/expression-dsl.md) 構文を使用します。式フィールドの展開ボタンをクリックすると、ライブバックエンドプレビュー付きの [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) が開きます。

## 4. 実行する

**Run** をクリックするか、`Ctrl + Enter` を押すか、デバッグパネルを使用して実行します。Workflow は Input ノードから接続されたノードを経由して Output まで実行されます。Workflow を実行するその他の方法（[webhook](../reference/webhooks.md)、ポータル、cron など）については、[Triggers](../reference/triggers.md) を参照してください。

過去の実行は **History**（ツールバー）で確認でき、**Bring to Canvas** を使用すると同じ入力で再実行できます。

Docs、Evals、その他の非キャンバス内部ページでは、[Quick Drawer](../reference/quick-drawer.md) を使用して、エディタに戻ることなくピン留めした Workflow を選択して実行することもできます。

ドキュメントを読みながら構築前に確認したい場合は、Docs ヘッダーから [Chat with Heym](../reference/chat-with-heym.md) を開いて、ページを認識した質問をすることができます。

または、Debug パネルから [AI Assistant](../reference/ai-assistant.md) を使用して、自然言語で Workflow を作成することもできます。希望する内容を説明すると、AI がノードとエッジを生成します。

すでに別のツールで自動化を構築している場合は、[Migrate to Heym](./migrate-to-heym.md) を使用すると、n8n、Flowise、Dify、Langflow、sim.ai、または Activepieces の Workflow をインポート可能な Heym Workflow に変換できます。

## 関連項目

- [Core Concepts](./core-concepts.md) – Workflow、ノード、実行フロー
- [Migrate to Heym](./migrate-to-heym.md) – n8n、Flowise、Dify、Langflow、sim.ai、または Activepieces の Workflow を AI で Heym に変換
- [Running & Deployment](./running-and-deployment.md) – `run.sh` でローカル起動、または `deploy.sh` でデプロイ
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完全な設定リファレンス
- [Settings](../reference/user-settings.md) – 名前、User Rules、パスワードの設定
- [Canvas Features](../reference/canvas-features.md) – データピン、実行ログ、有効化/無効化、サブ Workflow への抽出
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – キャンバスとエディタのショートカット
- [Expression DSL](../reference/expression-dsl.md) – ノード設定でデータを参照する
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – ライブバックエンドプレビュー付きの展開可能なエディタ
- [Triggers](../reference/triggers.md) – すべての Workflow エントリーポイント（[webhook](../reference/webhooks.md)、ポータル、cron など）
- [Execution History](../reference/execution-history.md) – 過去の実行の表示と Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 非キャンバスページからピン留めした Workflow を実行
- [Chat with Heym](../reference/chat-with-heym.md) – Docs ヘッダーからコンテキストに応じた質問をする
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow の作成と管理
- [Credentials Tab](../tabs/credentials-tab.md) – LLM ノード用の API キーを追加
- [AI Assistant](../reference/ai-assistant.md) – 自然言語で Workflow を作成
