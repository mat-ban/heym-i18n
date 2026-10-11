# Evalsタブ

**Evals**タブは `/evals` にある独立したページです。評価スイートを作成し、テストケースを定義し、[Agent](../nodes/agent-node.md) Workflowに対して評価を実行できます。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evalsデモを視聴</a></p>

## アクセス

- ダッシュボードのタブバーで **Evals** をクリックします
- または `/evals` に移動します
- または **Ctrl+K**（Cmd+K）を使用し、コマンドパレットから「Evals」を選択します

## Evalスイート

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
- **Temperature** – モデルのTemperatureを設定します（`Exact Match` および `Contains`）
- **Reasoning effort** – 推論モデルのReasoning effortを設定します（`Exact Match` および `Contains`）

### LLM-as-Judge

Judgeを使用する場合、各モデルはスイートPromptのみでテスト入力に回答し、その後Judgeがその回答が期待される出力とどの程度一致するかを0〜100で評価します：

- **モデルJudge**（OpenAI、OpenAI互換、またはGemini）は、質問、期待される出力、回答を読み取り、1行の理由とともにスコアを返します。Temperature `0`、または推論モデルの場合は `low` Reasoning effortで実行されるため、同じ回答には同じ判定が下されます。
- **Decision Node Judge**は、*Completely off* から *Fully matches* までの5段階のルーブリックで回答を評価します。スコアはそのルーブリック上の確率加重位置であるため、モデルが記述した数値ではなく、モデルが計算した分布から導かれます。

セルのホバーカードには、Judgeの理由、またはDecision Nodeの場合はレベル、スコア、その信頼度が表示されます。LatencyとTokenはテスト対象のモデルを表します。Judge自身の呼び出しは、**Evals** ソースの下で[Traces](./traces-tab.md)に表示されます。モデルピッカーにはModel RouterのCredentialは含まれません。これは、Evalが特定のモデルを比較するためです。

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
