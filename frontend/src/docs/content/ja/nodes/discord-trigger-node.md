# Discord Trigger

**Discord Trigger** ノードは、Discord Interactions API の Webhook を受信してワークフローを自動的に開始する、入力ゼロのエントリーポイントです。スラッシュコマンド、ボタン、モーダル、その他の Discord アプリケーションインタラクションを、下流の AI ノードや連携ノードへ流したい場合にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.interaction`、`$nodeLabel.type`、`$nodeLabel.data`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | Discord アプリケーションの公開鍵を含む `discord_trigger` 認証情報 |

## セットアップガイド

### 1. `discord_trigger` 認証情報の作成

1. **Settings → Credentials → New Credential** に移動します
2. 種類として **Discord Trigger (Public Key)** を選択します
3. Discord Developer Portal から **Application Public Key** を貼り付けます：
   - **Your application → General Information → Public Key**
4. 認証情報を保存します

### 2. ワークフローへのノード追加

1. **Discord Trigger** をキャンバスにドラッグします
2. ノードを選択して Properties パネルを開きます
3. `discord_trigger` 認証情報を選択します
4. ノードパネルに表示される **Interactions URL** をコピーします

### 3. Discord への Interactions Endpoint の登録

1. [Discord Developer Portal](https://discord.com/developers/applications) を開きます
2. 対象のアプリケーションを選択します
3. **General Information** または **Interactions** に移動します
4. ノードの **Interactions Endpoint URL** をエンドポイント欄に貼り付けます
5. Discord がエンドポイントを検証するために `PING` リクエストを送信し、Heym は署名を検証したうえで自動的に応答します
6. 変更を保存します

## 出力フィールド

ノードがトリガーされた後、下流のノードから以下にアクセスできます：

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.interaction` | Discord インタラクションの完全な Payload |
| `$nodeLabel.type` | インタラクションの種類 |
| `$nodeLabel.data` | コマンド、ボタン、またはモーダルの Payload |
| `$nodeLabel.data.name` | 該当する場合のスラッシュコマンド名 |
| `$nodeLabel.data.options` | スラッシュコマンドのオプション配列 |
| `$nodeLabel.headers` | サニタイズ済みの Webhook ヘッダー |
| `$nodeLabel.triggered_by` | トリガー元のラベル（`"Discord"`） |
| `$nodeLabel.trigger_node_id` | Discord インタラクションを受信したキャンバスノード ID |
| `$nodeLabel.triggered_at` | このワークフロー実行の ISO タイムスタンプ |

## ワークフロー例

**Discord スラッシュコマンド → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** のラベル：`discordEvent`
- **LLM** のユーザーメッセージ：`"Reply to this Discord command: $discordEvent.data.name"`
- **Output** のメッセージ：`$llm.text`

## セキュリティ

- リクエストは、アプリケーションの公開鍵を用いた **Ed25519** によって検証されます
- リプレイ攻撃を軽減するため、**5 分**より古いタイムスタンプは拒否されます
- 機密性の高いヘッダー（`x-signature-ed25519`、`authorization` など）は、データが下流のノードに到達する前に削除されます
- このトリガーには有効な `discord_trigger` 認証情報が必要です。認証情報が欠落しているか無効な場合、リクエストは拒否されます

## 備考

- Heym は Discord に対して遅延レスポンスを即座に返し、バックグラウンドでワークフローを実行します。そして `Output` ノードがコンテンツを生成した際に、最終的なワークフロー出力を Discord のフォローアップメッセージとして投稿します
- Interactions URL はノード ID から生成されるため、ワークフローの名前を変更しても安定したままです
- インタラクションのフォローアップに加えて別途 Webhook 投稿も行いたい場合にのみ、通常の [Discord Node](./discord-node.md) を使用してください
- 通常、`discordTrigger` ノードは 1 つで十分です。異なるインタラクションの種類を振り分けるには、下流で **Switch** または **Condition** を使用してください

## 関連項目

- [Discord Node](./discord-node.md) – 送信方向の Discord メッセージを送信します
- [Triggers](../reference/triggers.md) – すべてのワークフローエントリーポイントの概要
- [Third-Party Integrations](../reference/integrations.md) – Discord 認証情報のセットアップ
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger` 認証情報の追加と管理
