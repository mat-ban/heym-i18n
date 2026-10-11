# Guardrails

Guardrails を使用すると、安全でない、または望ましくないユーザーメッセージが [LLM](../nodes/llm-node.md) ノードや [Agent](../nodes/agent-node.md) ノードに到達する前にブロックできます。メッセージがブロック対象のカテゴリに一致した場合、ノードは実行せずにエラーをスローします。このエラーは [Error Handler](../nodes/error-handler-node.md) ノードでキャッチできます。

## Guardrails の有効化

**LLM** ノードまたは **AI Agent** ノードの Properties パネルを開き、**Enable Guardrails** トグル（シールドアイコン）までスクロールします。チェックボックスをオンにすると、設定セクションが表示されます。

## Guardrail Credential と Model

Guardrails を有効にした場合、コンテンツ安全性のために **credential と model** を必ず選択する必要があります。Guardrail チェックはノードで選択された credential と model を使用します — フォールバックや環境変数は使用されません。メインモデルがカスタムプロバイダー（例：Zhipu、GLM）を使用しており、Guardrails をサポートしていない、または API エラー（例：404）を返す可能性がある場合は、信頼性の高いコンテンツフィルタリングのために OpenAI または Google の credential を使用してください。

Guardrail Credential と Guardrail Model の両方が選択されるまで、Workflow は実行できません。

## ブロック対象カテゴリ

ブロックするカテゴリを 1 つ以上選択します。チェックされたカテゴリのいずれかに一致するメッセージは拒否されます。

| カテゴリ | ブロック対象 |
|---|---|
| **Violence** | 暴力的、脅迫的、または身体的危害を伴うコンテンツ |
| **Hate Speech** | 差別、人種差別、または偏狭な内容 |
| **Sexual Content** | 露骨な性的コンテンツまたはシナリオ |
| **NSFW / Profanity** | 下品な言葉遣い、冒涜、露骨な侮辱、あらゆる言語における成人向けスラング |
| **Self-Harm** | 自殺、自傷行為、または関連コンテンツ |
| **Harassment** | 個人攻撃、侮辱、いじめ、または脅迫 |
| **Illegal Activity** | 違法行為の実行手順 |
| **Political Extremism** | 過激な政治コンテンツまたは暴力的なプロパガンダ |
| **Spam / Phishing** | スパム、フィッシング、またはソーシャルエンジニアリング |
| **Personal Data Request** | 個人情報または個人を特定できる情報の要求 |
| **Prompt Injection** | システム指示の上書き、悪意ある Prompt の注入、またはモデルの動作操作の試み |

## Sensitivity

**Sensitivity** 設定は、違反がどの程度厳密に検出されるかを制御します：

| レベル | 動作 |
|---|---|
| **Low** | 境界線上の、または曖昧なケースも検出します |
| **Medium** *(デフォルト)* | 明確な違反を検出します。境界線上のケースは無視します |
| **High** | 極端で明白な違反のみを検出します |

## 検出の仕組み

検出には **選択された guardrail credential と model** が使用されます：

- **OpenAI credentials** — ネイティブで対応する 5 つのカテゴリ（Violence、Hate Speech、Sexual Content、Self-Harm、Harassment）に対して [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)（無料、高速、Token 消費なし）を使用します。残りのカテゴリは、選択された guardrail model を使用した LLM 分類呼び出しでチェックされます。
- **Google / カスタム credentials** — すべてのカテゴリが、選択された guardrail credential と model を使用した LLM 分類呼び出しでチェックされます。

メインモデルが 404 やその他の API エラーを返す可能性のあるカスタムプロバイダー（例：Zhipu、Cerebras）を使用している場合は、Guardrails 用に **OpenAI または Google の credential** を選択してください。

## エラー形式

Guardrail がトリガーされると、ノードは次のメッセージでエラーを発生させます：

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

ノード結果の `output` には `guardrail_violated_categories`（違反したカテゴリラベルの配列）も含まれるため、Debug Panel と Execution History で「Blocked by: X, Y」を明確に表示できます。

Guardrails が発動した際に Workflow をフォールバックブランチへルーティングするには、ノードの **Continue on error** オプション（または [Error Handler](../nodes/error-handler-node.md)）を使用してください。

## Workflow の例

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## 注意事項

- **リトライなし**：Guardrail 違反は意図的なブロックであり、ノードで「Retry on failure」が有効になっていてもリトライされることはありません。
- データベースマイグレーションは不要です — Guardrail 設定は他のノードデータと同様に Workflow のノード JSON に保存されます。
- Guardrails は（テンプレート式が評価された後の）解決済みの **ユーザーメッセージ** をチェックし、生のテンプレートはチェックしません。
- Guardrails が有効な状態で **カテゴリを 1 つも設定しない** 場合、無効化されているのと同等です — チェックは実行されません。
- **Low** の severity では、LLM 分類が常に実行されます（多言語カバレッジが最も優れています）。OpenAI credentials の場合は、さらに Moderation API も実行されます。
- **Medium/High** の severity では、OpenAI credentials はネイティブでサポートされているカテゴリに Moderation API を使用し、残りには LLM 分類を使用します。Google/カスタム credentials は常に LLM 分類を使用します。
- LLM 分類は **言語に依存しません** — トルコ語、アラビア語、ロシア語、スペイン語、その他の言語での違反も検出します。
