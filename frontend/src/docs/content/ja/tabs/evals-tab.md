# Evalsタブ

**Evals**タブは `/evals` にある独立したページです。評価スイートを作成し、テストケースを定義し、[Agent](../nodes/agent-node.md) Workflowに対して評価を実行できます。 [Agentスイート](#agent-suites)はAgentを実行するかその実際の実行結果を読み取り、呼び出されたツール、レイテンシ、USDコスト、トークン、およびツール呼び出し回数を検証します。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evalsデモを視聴</a></p>

## アクセス

- ダッシュボードのタブバーで **Evals** をクリックします
- または `/evals` に移動します
- または **Ctrl+K**（Cmd+K）を使用し、コマンドパレットから「Evals」を選択します

## Evalスイート

- **新規スイート** – モデル間でシステムプロンプトをテストするための **Promptスイート**、またはAgentの実際の実行結果を検証するための **Agentスイート** を選択します（[Agentスイート](#agent-suites)を参照）
- **スイートピッカー** – PromptスイートとAgentスイートをそれぞれの名前の横にタイプを付けて一覧表示します。入力して検索できます
- **スイートの作成** – 名前と説明を指定してスイートを定義します
- **Workflowの選択** – 評価対象のWorkflowを選択します
- **Credentialの選択** – Workflowを実行するためのAPIキー
- **System Prompt** – 左パネルでスイートレベルのSystem Promptを直接編集します
- **Optimize Prompt** – LLMに現在のSystem Promptの改善を依頼します

## テストケース

- 入力Promptと期待される出力を含むテストケースを追加します
- 各ケースには比較用のカスタム期待値を設定できます
- スイートからケースを編集または削除します
- **Generate Test Data** – 選択したCredential/モデルを使用し、スイートPromptからテストケースを自動生成します

## 評価の実行

- **1つ以上のモデルを選択** – 同じスイートを複数のモデルに対して1回の評価で実行します
- **スコアリング方法** – `Exact Match`、`Contains`、または `LLM-as-Judge` を選択します
- **Judge** – `LLM-as-Judge` の場合、任意でOpenAI、OpenAI互換（Custom）、Gemini（Google）、または[Decision Node](../nodes/decision-node.md)のCredentialを選択し、Judgeのモデル（例: `gpt-4o-mini` や `jev-latest`）を入力して、独立したJudgeでスコアリングします
- **テストごとの実行回数** – 各テストケースを1回の実行で複数回繰り返します
- **記憶された設定** – スイートは最新の実行設定で開きます：Credential、モデル、スコアリング方式、Judge、Temperature、Reasoning effort、およびテストごとの実行回数。過去の実行を開くとその設定が読み込まれるため、**評価を再実行** で同じテストを繰り返せます
- **Temperature** – モデルのTemperatureを設定します（`Exact Match` および `Contains`）
- **Reasoning effort** – 推論モデルのReasoning effortを、LLMノードやAgentノードと同様にLowからExtra highおよびMaxまで設定します（`Exact Match` および `Contains`）

### LLM-as-Judge

Judgeを使用する場合、各モデルはスイートPromptのみでテスト入力に回答し、その後Judgeがその回答が期待される出力とどの程度一致するかを0〜100で評価します：

- **モデルJudge**（OpenAI、OpenAI互換、またはGemini）は、質問、期待される出力、回答を読み取り、1行の理由とともにスコアを返します。Temperature `0`、または推論モデルの場合は `low` Reasoning effortで実行されるため、同じ回答には同じ判定が下されます。
- **Decision Node Judge**は、*Completely off* から *Fully matches* までの5段階のルーブリックで回答を評価します。スコアはそのルーブリック上の確率加重位置であるため、モデルが記述した数値ではなく、モデルが計算した分布から導かれます。

セルのホバーカードには、Judgeの理由、またはDecision Nodeの場合はレベル、スコア、その信頼度が表示されます。LatencyとTokenはテスト対象のモデルを表します。Judge自身の呼び出しは、**Evals** ソースの下で[Traces](./traces-tab.md)に表示されます。JudgeピッカーはModel RouterのCredentialを除外します。Judgeは1つの固定されたモデルである必要があるためです。テスト対象モデルのCredentialには[Model Router](../reference/credentials.md#model-router-auto-model)を使用できます。その **Auto** モデルは、Workflow内と同様にリクエストごとにモデルを選択します。

Judgeを使用しない場合、各モデルは1回のリクエストで自身の回答を生成し、スコアリングします。

このモードではTemperatureとReasoning effortは非表示となり、実行には固定設定が使用されます：標準モデルではTemperature `0.7`、推論モデルでは `medium` Reasoning effort（自身の回答をスコアリングする場合は `low`）です。

## 結果

- テストケースごとの合否を表示します
- 実際の出力と期待される出力を検査します
- 1回の実行に複数のモデルが含まれる場合、モデルごとの出力を並べて比較します
- 過去の評価の実行履歴を確認します。`LLM-as-Judge` の実行では、履歴リストにそのJudgeモデルが表示されます
- 結果パネルから過去の実行を開き、保存されたPrompt/入力/出力のスナップショットを検査します
- 過去の実行を開くと、そのスコアリング方法とJudgeが左パネルに読み込まれるため、**Re-Run Evals** で同じ評価を繰り返せます
- **Export** は実行をJSONとしてダウンロードします（`judge_credential_id` と `judge_model` を含む）

## Agent Suites

Agentスイートは、[Agent](../nodes/agent-node.md)ノードを実行履歴に基づいて検証します。[Traces](./traces-tab.md)から実行を読み取り（すべての実行にはすでに所要時間、トークン、コスト、ツール呼び出しが記録されています）、ユーザーに代わってWorkflowを実行することも可能です。

**新規スイート** → **Agentスイート** から作成し、以下の3つのステップに従います：

1. **Agent** – Workflowを選択し、次にそのAgentノードを選択します。Agentノードを持つWorkflowのみが一覧表示されます。まだ実行されていないWorkflowまたはAgentは表示されますが選択できません。選択したAgentの設定（モデル、指示、ツール、制限）が右側に表示され、Agentが強調表示されたWorkflowの読み取り専用キャンバスが下に表示されます。
2. **Baseline** – Agentの過去10回の実行データ：レイテンシp50およびp95、実行ごとのコスト、実行ごとのトークン数、実行ごとのツール呼び出し回数、呼び出されたツールとその頻度、各実行固有の数値。エラーで終了した実行は一覧には表示されますが、Baselineからは除外されます。
3. **検証項目** – 各ツールを **Must call**、**Must not call**、または **Either** として指定します。すべての呼び出しタイプがその種類とともに一覧表示されます：Pythonおよびノードツール、サーバー情報を含む **MCP** ツール、ラベル別の **Sub-Agent**、名前別の **Sub-Workflow**、および **skills**。まだ実行されていないツールは種類と名前を指定して追加でき、**X** ボタンで削除できます。レイテンシ、コスト、総トークン数、ツール呼び出し回数の上限を設定できます。各上限はBaselineのp95より20%高い値から開始し、無効化も可能です。

保存されたスイートは **結果** 画面で開き、隣に **Baseline** と **検証項目の編集** が並びます：

- **Workflowを実行** – 実行回数を選択します（最大20回）。4回ずつ並列で実行されます。入力値はWorkflowの最新の実行から自動入力され、編集可能です。すべての実行でこの入力が使用されます。**入力を生成**（輝きアイコン）をオンにしてCredentialとモデルを選択すると、モデルが実行ごとに異なる入力を自動作成します。モデルはAgentのシステム指示を読み取り、入力された値に近いバリエーションを生成します（都市名を入力すると他の都市名が生成されるなど）。各実行は通常の実行と同様にWorkflow全体を完全に処理し、`agent_suite` トリガーとして実行履歴に記録されます。メール送信などの後続ステップをスキップしたい場合は、パネルの **Workflowへ移動** からWorkflowを開き、それらのノードをあらかじめ無効化してください。**停止** を押すとスイートの実行が終了します。新しい実行は開始されず、進行中の実行はキャンセルされます。サーバー再起動時などに停止したスイート実行は、ハングしたままにならず1分後に中断として表示されます。
- **結果** – デフォルトでは最新のスイート実行がスコアリングされます。すべてのスイート実行は実行ピッカーに日付とともに保持され、開いたり削除したりできます。また、Agentの過去10回、20回、50回の実行に切り替えて、他の通常の実行を検証対象に含めることもできます。保存されたBaselineと並んで合格率、各検証項目の合格頻度、レイテンシ、コスト、トークン、ツール呼び出し回数が表示され、失敗した理由やトレースへのリンクとともに各実行を確認できます。
- **Workflowへ移動** をクリックすると、新しいタブでAgentのWorkflowが開きます。名前フィールドでは **Esc** キーまたは **X** ボタンでテキストを消去できます。

数値の解釈方法：

- **レイテンシ** はモデルの応答時間とその実行のツール呼び出し時間の合計です。
- **コスト** はTracesと同じ単価を使用します。価格が設定されていないモデルの実行は、エラーにならずコストチェックをスキップします。
- エラーなしで終了し、すべての検証項目をクリアした場合にその実行は **合格** と判定されます。
- スイートはTracesタブと同じルールに従い、自身がアクセス可能なトレースのみを読み取ります。
- **検証項目の編集** の **最新の実行をBaselineとして使用** をクリックすると、保存されているBaselineがAgentの最新の実行データに置き換わります。

スイートのBaselineは3つのソースのいずれかから取得されます。**検証項目の編集** では **保存されたBaseline** の横に現在アクティブなソースが表示されます：

- Agentの最新の実行（デフォルト。**最新の実行をBaselineとして使用** が取得する値）、
- 完了した1回のスイート実行、
- 手動で直接入力された数値。

後者の2つは [Chat](./chat-tab.md#working-with-evals) またはAPIから設定します：

- `PATCH /api/evals/agent-suites/{id}` は `baseline: {"source": "suite_run", "run_id": "…"}` または `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}` を受け取ります。
- `POST /api/evals/agent-suites/{id}/runs` は `inputs_list` を受け取ります：実行ごとに1つの入力オブジェクト、最大20個。

### ChatおよびMCPからの利用

[Chat](./chat-tab.md#working-with-evals) とMCP `heym_chat` ツールは、PromptスイートおよびAgentスイートの作成、変更、実行が可能です：

- テストケースや実行入力を自律的に記述します。
- Promptスイートを作成する前に、使用可能なCredentialが1つに絞られない限り、どれを使用するか尋ねます。
- このページで言及したすべてのスイートへのリンクを提示します。

## ベンチマークマトリックスのアイデア

Agent Workflowのベンチマークマトリックスを構築する際は、HITLシナリオをエッジケースとして扱うのではなく、一級のケースとして含めてください。

- 3つのレビュー判定すべてをカバーします：`accepted`、`edited`、`refused`
- エディタ実行、ポータル、curl/Webhook、Cron Triggerによる実行など、複数のTriggerソースを含めます
- 1回のAgent実行が複数回一時停止する、繰り返しレビューのシナリオを追加します
- Agentの `review` 出力に接続された通知ブランチを検証します
- 拒否後の下流の動作を検証します。特に、後続のノードが `$agent.decision` で分岐する場合に重要です

## 関連

- [Why Heym](../getting-started/why-heym.md) – Agentライフサイクルのテスト段階としてのEvals
- [Agent Node](../nodes/agent-node.md) – 評価対象のWorkflow
- [Credentials Tab](./credentials-tab.md) – Eval実行用のCredential
- [Traces Tab](./traces-tab.md) – 詳細なTrace検査
- [Workflows Tab](./workflows-tab.md) – 評価するWorkflowの作成
- [Execution History](../reference/execution-history.md) – 過去の実行を表示（ヘッダーのHistoryボタン）
- [Contextual Showcase](../reference/contextual-showcase.md) – Evalsページで利用可能なコンパクトなページガイド
