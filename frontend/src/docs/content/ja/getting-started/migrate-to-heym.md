# Heym への移行

すでに他のツールで Workflow をお持ちですか？ **AI Convert** がそれらを Heym の Workflow に変換します。n8n、Flowise、Dify、Langflow、sim.ai、Activepieces から Workflow を貼り付けるか、実現したい内容を記述するだけで、Heym が同等の Workflow をライブキャンバス上に構築し、ダウンロードしてインポートできるようにします。

**[heym.run/convert](https://heym.run/convert)** で開くか、サイトヘッダーの **✨ AI Convert** ボタンをご利用ください。

## 仕組み

1. **ソースツールを選択**（任意） — n8n、Flowise、Dify、Langflow、sim.ai、Activepieces、または *Auto* のままにします。
2. **Workflow を提供** — 現在お使いのツールからエクスポートした JSON を貼り付けるか、実現したい自動化を平易な英語で記述します。
3. **生成** — Heym が結果をキャンバス上にストリーミングし、生成されるにつれてノードと接続を描画します。
4. 生成された Workflow を JSON として**ダウンロードまたはコピー**します。
5. **Heym にインポート** — [Download & Import](../reference/download-import.md) のフローを使用して JSON をキャンバスに貼り付け、実行します。

変換では、Workflow が Heym によって生成されたことを示す小さな *Sticky Note* もキャンバスに追加されます。不要になったら削除してください。

## 得られるもの

コンバーターはソースの概念をネイティブの Heym ノードにマッピングします — Trigger、[LLM](../nodes/llm-node.md) ステップ、[HTTP](../nodes/http-node.md) 呼び出し、[Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) アクション、[Loop](../nodes/loop-node.md)、[Condition](../nodes/condition-node.md)、[Output](../nodes/output-node.md) などです。キャンバス上で結果を確認し、[Credentials](../reference/credentials.md) を設定し、ソースツールが異なる表現をしていた箇所を調整してください。

> AI Convert は出発点であり、1:1 の完全な移植を保証するものではありません。本番環境で実行する前に、必ず生成された Workflow を確認してください。

## 知っておくと便利なこと

- **AI 搭載:** 変換は大規模言語モデルによって生成されるため、実行ごとに結果が異なる場合があります。最初の結果が期待どおりでない場合は、再生成してください。
- **入力サイズ:** 貼り付けまたは入力する内容は、およそ **25,000 Token** に制限されています。非常に大きなエクスポートは変換前にトリミングしてください。
- **レート制限:** すべてのユーザーがツールを利用できるようにするため、訪問者ごとにリクエストは **1分あたり1回、1時間あたり5回、1日あたり10回** に制限されています。
- **安全性:** リクエストはスクリーニングされ、Workflow 構築に関するリクエストのみが処理されます。

## 次のステップ

- キャンバスが初めてですか？ [Quick Start](./quick-start.md) から始めてください。
- インポートの仕組みについては [Download & Import](../reference/download-import.md) をご覧ください。
- Heym をセルフホストしますか？ 完全な設定リファレンスについては [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) をご覧ください。
- アプリ内の [AI Assistant](../reference/ai-assistant.md) を使用してゼロから構築できます。
