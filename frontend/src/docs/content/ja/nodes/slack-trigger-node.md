# Slack Trigger

**Slack Trigger** ノードは、Slack Events API の Webhook を受信して Workflow を自動的に開始する、入力不要のエントリーポイントです。Slack の URL 検証チャレンジを処理し、署名シークレットを使用してリクエストの署名を検証します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.event`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | 署名シークレットを含む `slack_trigger` 認証情報 |

## セットアップガイド

### 1. `slack_trigger` 認証情報の作成

1. **Settings → Credentials → New Credential** に移動します
2. タイプ **Slack Trigger (Signing Secret)** を選択します
3. Slack App の **Signing Secret** を貼り付けます：
   - Slack 内で：**App settings → Basic Information → App Credentials → Signing Secret**
4. 認証情報を保存します

### 2. ノードを Workflow に追加

1. Workflow キャンバスを開きます
2. ノードパネルから **Slack Trigger** をキャンバスにドラッグします
3. ノードをクリックして Properties パネルを開きます
4. `slack_trigger` 認証情報を選択します
5. パネルに表示される **Webhook URL** をコピーします

### 3. Slack App の設定

1. Slack App の設定で **Event Subscriptions** に移動します
2. **Enable Events** をオンに切り替えます
3. **Request URL** フィールドに Webhook URL を貼り付けます
4. Slack が URL 検証チャレンジを送信します — Heym はミリ秒以内に自動応答します
5. フィールドが緑色に変わります：✓ Verified
6. 必要な **Bot Events** を購読します（例：`message.channels`、`reaction_added`）
7. 変更を保存し、必要に応じてアプリをワークスペースに再インストールします

## 出力フィールド

ノードがトリガーされた後、下流のノードから以下にアクセスできます：

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.event` | Slack イベントオブジェクト全体 |
| `$nodeLabel.event.type` | イベントタイプ（例：`"message"`、`"reaction_added"`） |
| `$nodeLabel.event.text` | メッセージ本文（該当する場合） |
| `$nodeLabel.event.user` | イベントをトリガーした Slack ユーザー ID |
| `$nodeLabel.event.channel` | チャンネル ID |
| `$nodeLabel.event.ts` | イベントのタイムスタンプ |
| `$nodeLabel.headers` | Slack からのサニタイズ済み HTTP ヘッダー |
| `$nodeLabel.triggered_by` | Trigger ソースのラベル（`"Slack"`） |
| `$nodeLabel.trigger_node_id` | Slack イベントを受信したキャンバスノード ID |

## Workflow の例

**Slack メッセージ → LLM 返信 → Slack 送信：**

```
slackTrigger → llm → slack
```

- **slackTrigger** ラベル：`slackEvent`
- **LLM** ユーザーメッセージ：`"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** メッセージ：`$llm.text`

## セキュリティ

- リクエストは署名シークレットを使用した **HMAC-SHA256** で検証されます
- **5 分**より古いタイムスタンプは拒否されます（リプレイ攻撃の防止）
- 機密性の高いヘッダー（`x-slack-signature`、`authorization` など）は、下流のノードに到達する前に削除されます
- 認証情報が設定されていない場合、ノードは検証なしで実行されます — ローカルテストのみに推奨されます

## 備考

- Heym は即座に `200 OK` を返し、Workflow をバックグラウンドで実行します — これにより Slack の 3 秒応答要件を満たします
- Webhook URL はノード ID から生成され、Workflow の名前を変更しても変わることはありません
- `slackTrigger` ノードは Workflow ごとに 1 つだけ必要です。異なるイベントタイプをルーティングするには、下流で **Switch** または **Condition** ノードを使用してください
