# 判定

**Decision** ノードは、実行の現在の状態について Decision モデルに型付きの質問を投げ、確率を返します。テキストは生成しません。分岐の判断材料が必要な Workflow に適しています — ルーティング、トリアージ、ランキング、検証、あるいは取り消しのできないステップのゲートなどです。

Decision モデル（*System One* モデルとも呼ばれます）は、LLM とは異なる種類のモデルです。Prompt もシステム指示も temperature も tool calling もありません。**state** と **questions** のマップを送信すると、各回答は確率分布を伴う数値として返されます。回答はわずか数 Token であるため、[LLM](./llm-node.md) に JSON を生成させてパースする場合と比べて、これらのモデルは高速かつ低コストです。

テキスト生成には [LLM](./llm-node.md) ノードを使用してください。ツールを呼び出すモデルには [Agent Node](./agent-node.md) を使用してください。

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | プロバイダーの応答をそのまま返します — `$nodeLabel.answers.<id>`、`$nodeLabel.model`、`$nodeLabel.usage` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | *Decision Model* の Credential です。LLM の Credential ではありません。 |
| `model` | string | モデル名（例：`jev-latest`） |
| `state` | expression | モデルが読み取る対象（デフォルトは `$input.text`） |
| `questions` | array | 順序付けられた質問行。少なくとも 1 つ必要です |
| `customBodyEnabled` | boolean | フォームの代わりに手書きのリクエストボディを送信します |
| `customBody` | expression (JSON) | トグルがオンのときに送信するボディ |
| `requestTimeoutSeconds` | number | 待機する最大秒数（デフォルト：60） |

### State

**State** は、モデルが判断する対象の状況です。文字列、オブジェクト、または配列を受け付けます。

ちょうど 1 つの式を保持するフィールドは自身の型を維持するため、`$input` はそのテキストではなくオブジェクト自体を送信します。式を内部に含むテンプレート（`Ticket: $input.text`）は文字列に解決されます。各質問には、ソーステキスト、識別情報、関係性、ポリシー、現在の事実など、回答に十分な情報を与えてください。

## Question types

各質問には `id`、`type`、`instructions`、および type に依存する criteria があります。

`id` は Workflow が回答を読み戻すためのキーです。これは**モデルには送信されない**ため、意味のすべてを `instructions` に含める必要があります。`id: is_urgent` と `instructions: "Is it?"` を書いても、モデルには判断材料が何も与えられません。

### Noul

条件が成立するかどうかを判定します。回答が yes である確率を 0 から 1 の範囲で返します。

Criteria は任意です。**Yes means** と **No means** は、それぞれの側が何をカバーするかを記述します。0.5 に近い値は、モデルが yes と no をほぼ同等に確からしいと見なしていることを意味し、「中程度の強度」ではありません。

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

`$triage.answers.is_urgent.noul` で読み取ります。

### Choice

定義した選択肢の集合から 1 つを選びます。選択された選択肢、完全な分布、およびそこから導出された confidence を返します。

何も当てはまらない可能性がある場合は、必ず「none of these」をカバーする選択肢を追加してください — モデルは、あなたが提示していない選択肢を選ぶことはできません。

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

`$triage.answers.department.choice`、`.probabilities.billing`、`.confidence` で読み取ります。

### Score

順序付けられたルーブリックに沿って状態を評価します。レベル**間**の値にもなり得る確率加重値を、legend と分布とともに返します。

レベルは低い順に並べ、最低 2 つ、最大 10 つです。各レベルは具体的な状況を記述し、単独で成立するようにしてください。

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

`$triage.answers.frustration.score`、`.legend`、`.confidence` で読み取ります。

## Generate with AI

**Generate with AI** は、平易な一文を、提案された state テンプレートと一連の質問行に変換します。判断したい内容を記述してください — 例えば「受信したサポートチケットをトリアージする：どれほど緊急か、どのチームが担当すべきか、顧客がどれほど苛立っているか」 — そして返ってきた内容を確認してからノードに追加します。

下書きは LLM によって行われるため、ダイアログは LLM の Credential を要求します。Decision モデルが質問に回答するのは、Workflow が実行される時点です。生成された id は、ノードが既に保持している行に対して重複排除されるため、2 回生成しても既存の回答キーが上書きされることはありません。

各生成は、実行時にノード自身が書き出す `decision.systemone` トレースとともに、[Traces](../tabs/traces-tab.md) タブの **Decision Questions** ソースに記録されます。
## カスタムリクエストボディ

**カスタムリクエストボディ**をオンにすると、フォームの代わりにご自身で記述した JSON を送信できます。フォームが構築するものとは異なる契約を持つ Endpoint に使用してください。

エディターには現在のフォームの内容が初期値として設定され、その中の式はリクエスト送信前に解決されます。トグルがオンの間は、State フィールドと質問行は無視されます。レスポンスはいずれの場合もそのまま渡されるため、異なる契約であれば式が読み取る形状が変わるだけです。

## 出力

ノードはプロバイダーが返したものをそのまま返します。名前の変更やフラット化は行われません。

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## 回答による分岐

[Switch](./switch-node.md) ノードは選択されたオプションでルーティングし、[Condition](./condition-node.md) ノードは信頼度の低いケースを人が確認できる場所へ送ることができます。

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

型付きの回答は形状を保証しますが、真実を保証するものではありません。しきい値は例から数値をコピーするのではなく、ご自身のデータと結果に基づいて選択してください。

## Credential

[Credentials](../tabs/credentials-tab.md) タブで **Decision Model** credential を作成し、以下を設定します。

- **Base URL** — Endpoint です。例えば `https://api.typesafe.ai` です。Heym は `/v1/systemone` を付加します。
- **API Key** — 任意です。キーが不要な Endpoint では空欄のままにできます。

credential を編集する際、キーフィールドを空欄のままにすると保存済みのキーが保持されます。置き換える場合のみ再入力してください。

同じ credential で [Evals](../tabs/evals-tab.md) の実行を判定できます。**LLM-as-Judge** を選択した状態で、これを judge として選択すると、decision model がすべての回答を期待される出力と照らして採点します。

Heym はデフォルトでプライベートアドレスおよびループバックアドレスへの送信リクエストをブロックするため、`localhost` やプライベートレンジでご自身が運用する decision endpoint には `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` が必要です。

Decision model は Heym が同期する LLM 価格テーブルに表示されないため、[Traces](../tabs/traces-tab.md) の **Cost** 列はこれらの呼び出しでは空のままです。Token 数は引き続き記録され、pricing override で独自の価格を追加できます。

## エラー

| 状況 | 発生する内容 |
|-----------|--------------|
| 無効な API key | ノードが失敗し、credential を名指しするメッセージが表示されます |
| 不正な質問 | プロバイダー自身のフィールドレベルのメッセージがノードエラーに引き継がれます |
| レート制限または過負荷 | ノードが失敗し、状態が一時的である旨のメッセージが表示されます — このノードで [retry](../reference/features.md) をオンにすると乗り切れます |
| 重複または空の質問 id | リクエストが送信される前にノードが失敗します |

## 関連

- [LLM Node](./llm-node.md) – 判定の代わりにテキストを生成します
- [Agent Node](./agent-node.md) – ツールで証拠を収集し、ここで判定します
- [Switch Node](./switch-node.md) – 選択されたオプションでルーティングします
- [Condition Node](./condition-node.md) – 信頼度でゲートします
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials](../reference/credentials.md) – credential のタイプとフィールド
- [Traces Tab](../tabs/traces-tab.md) – decision 呼び出しと Token 使用量を確認します
