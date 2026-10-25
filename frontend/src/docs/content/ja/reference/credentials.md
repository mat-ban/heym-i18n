# Credentials

Credentialsは、Workflowノードで使用されるAPIキーとシークレットを保存します。これらは[Credentialsタブ](../tabs/credentials-tab.md)で追加し、ノード設定で名前を指定して参照します。

## Credentialsとは

- **ユーザーごとに保存** – 各Credentialはユーザーに属し、他のユーザーや[Teams](./teams.md)と[共有](./credentials-sharing.md)できます。
- **保存時に暗号化** – 機密値は暗号化され、作成後はUI上でマスクされます。
- **名前で参照** – ノードは名前（またはID）でCredentialを選択します。実行エンジンは実行時にWorkflow所有者のCredentialを解決します。

## ノードでの使用方法

| ノードタイプ | 一般的なCredential | 用途 |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Evals](../tabs/evals-tab.md) | OpenAI、Google、Custom | モデル用のAPIキー |
| [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md) judge | Decision Model | Decision ModelのEndpointのベースURL、およびオプションのAPIキー |
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults | Model Router (Auto Model) | Decision Modelを使用して、各リクエストを処理するモデルを選択 |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPTサブスクリプションのサインイン（OAuth）またはランナー用のCodexアクセスToken、およびリポジトリ操作用のGitHub PAT |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | ランナー用のOpenCode GoゲートウェイAPIキー（オプションのベースURL）、およびリポジトリ操作用のGitHub PAT |
| [Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md) | GitHub | GitHub API呼び出し、GitHubノード操作、MCP統合用のGitHub personal access token（PAT） |
| [Jira](../nodes/jira-node.md) | Jira | Cloudのメール/API Token、Data Centerのユーザー名/パスワード、または個人アクセストークン、JiraサイトのベースURL、デプロイモード、オプションのREST APIバージョン |
| [Linear](../nodes/linear-node.md) | Linear | チーム、プロジェクト、Issue、コメント用のPersonal APIキーまたはOAuth2 |
| [HTTP](../nodes/http-node.md) | Bearer、Header | リクエストの認証 |
| [Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot TokenおよびオプションのWebhookシークレット |
| [Discord](../nodes/discord-node.md) | Discord | Incoming Webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | 署名検証用のアプリケーション公開鍵 |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、RAG: Custom Embeddings | ベクターストア接続（外部Qdrant、またはpgvector経由のHeym独自のPostgres）、OpenAIまたはOpenAI互換のEmbedding Endpoint |
| [Slack](../nodes/slack-node.md) | Slack | WebhookまたはAPI Token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | 受信メールボックス接続 |
| [Send Email](../nodes/send-email-node.md) | SMTP | メールサーバー |
| [Redis](../nodes/redis-node.md) | Redis | 接続 |
| [Grist](../nodes/grist-node.md) | Grist | APIキー + サーバーURL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2同意 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2同意 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2同意 |
| [Supabase](../nodes/supabase-node.md) | Supabase | プロジェクトURL + APIキー（+ オプションのデフォルトスキーマ） |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | ホスト + ポート + ユーザー名/パスワード + データベース（+ secure） |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration Token、またはPublic integrationのClient ID + Client Secret + OAuth同意 |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth TokenおよびオプションのセルフホストベースURL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | アクセスキー、シークレットキー、リージョン |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

詳細なセットアップ（ホスト、ポート、プロバイダー固有のフィールド）については、[Third-Party Integrations](./integrations.md)を参照してください。Telegram Botのセットアップ、IMAP経由の受信メール、SMTP経由の送信メールも含まれます。

GitHub Credentialsには、GitHub.comではなくGitHub Enterprise Serverを対象とする場合、オプションの`base_url`を含めることもできます。TokenをローテーションするためにGitHub Credentialを編集する際、`base_url`を空のままにすると既存のEnterprise Endpointが保持されます。そのEndpointを変更したい場合にのみ、新しいURLを入力してください。

Jira、Linear、Supabase、Notion、Sentry、ClickHouseのCredentialsでは、Credentialダイアログに**Test Connection**が表示されます。Jiraの場合、チェックはJiraの現在のユーザーEndpointを呼び出します。Linearの場合、チェックは`getViewer`でLinear APIを呼び出し、APIキーまたはOAuth Tokenが有効であることを確認します。編集時、保存されたシークレットがまだ存在する場合は、APIキーを再入力せずにテストできます。Notionの場合、ダイアログで**Internal token**または**OAuth**を選択します。OAuthはNotion Public integrationのClient IDとClient Secretを使用します。Notionのセットアップの詳細については、[Third-Party Integrations](./integrations.md#notion)を参照してください。

## コーディングパッケージの使用状況

[Settings](./user-settings.md) の **AI Defaults** タブには、Codex 認証情報（所有および共有）の残りのコーディングパッケージ使用状況が表示されます。各 Codex 認証情報について、アクティブなレート制限ウィンドウごとに水平バーが表示されます。通常は **5 hours** および／または **Weekly** ウィンドウで、プランによって異なります。残りのクォータの割合とリセットまでのカウントダウンが表示されます。データは Codex バックエンドのレート制限レスポンスヘッダーから取得され、オンデマンドでフェッチされます。

OpenCode Go の認証情報もそこに表示されますが、**「usage unavailable」** とマークされます。OpenCode zen ゲートウェイは残りのクォータデータを公開しないため、バーを表示できません。

## 式での使用

一部のノードでは認証に式を使用できます。[Expression DSL](./expression-dsl.md) と `$credentials.CredentialName` を使用して、式の中で認証情報の解決済みシークレットを参照します。HTTP リクエストで各認証情報タイプに必要なヘッダー行については、[HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials) を参照してください。

Codex 認証情報は意図的に `$credentials` から除外されています。ChatGPT（サブスクリプション、トークンごとの API コストなし）でサインインする場合でも、Codex の `access_token` を貼り付ける場合でも、トークンはローカルの Codex ランナープロセスにのみ渡されます。ChatGPT サインインのトークンは、有効期限が切れると自動的に更新されます。

Jira 認証情報も `$credentials` から除外されています。[Jira ノード](../nodes/jira-node.md) は実行時に `credentialId` で認証情報を読み込みます。Jira ノードでカバーされていないカスタム Jira REST 呼び出しには、[HTTP ノード](../nodes/http-node.md) と Jira Basic Auth（Jira Cloud の場合は `email:api_token`、Data Center / Server の場合は `username:password`）を使用します。例えば `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself` のように指定します。[Header](../nodes/http-node.md) 認証情報と `Authorization: Basic <base64(user:secret)>` を組み合わせて使用することもできます。Jira Data Center / Server の個人アクセストークンの場合は、代わりに `Authorization: Bearer <token>` を送信します。Jira 認証情報自体が **Personal Access Token** 認証モードを通じてこれをサポートしています。

| 認証情報タイプ | `$credentials.Name` に公開される値 |
|-----------------|--------------------------------------|
| Bearer | Bearer トークン文字列 |
| Header | 完全な `header key: header value` 行。cURL の `-H` 引数にそのまま使用できます |
| GitHub | 個人アクセストークン |
| Notion | 内部 `api_token` または OAuth `access_token`（Notion API 呼び出し用の Bearer トークン） |
| Sentry | Sentry 認証トークン |
| Discord / Slack | Webhook URL |

例：

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

ネイティブのデータベース、ページ、ブロック操作には Notion **ノード**を使用してください。カスタム [HTTP](../nodes/http-node.md) リクエストで同じ Notion bearer トークンが必要な場合は `$credentials` を使用します。

## チャットからの認証情報の作成

[AI Assistant](./ai-assistant.md#credentials)、[Chat タブ](../tabs/chat-tab.md)、[Chat with Heym](./chat-with-heym.md) は、Workflow が認証情報を必要とするとき、またはあなたが要求したときに認証情報を作成できます。アシスタントがタイプと名前を提案し、通常の認証情報フォームが会話内で開きます。所有している認証情報の更新を依頼すると、同じフォームがその認証情報上で開き、シークレットはマスクされます。アシスタントは名前とタイプのみを参照します。[MCP](../tabs/mcp-tab.md) 経由の `heym_chat` は、認証情報の作成、更新、選択ができません。

## 関連項目

- [Credentials タブ](../tabs/credentials-tab.md) – 認証情報の追加、編集、削除
- [GitHub ノード](../nodes/github-node.md) – ネイティブ GitHub REST 操作
- [Jira ノード](../nodes/jira-node.md) – Jira プロジェクト、課題、コメント、添付ファイル、ユーザー、通知、トランジションの自動化
- [Linear ノード](../nodes/linear-node.md) – Linear GraphQL ワークスペースと課題の自動化
- [Notion ノード](../nodes/notion-node.md) – Notion コンテンツの検索と管理
- [Sentry ノード](../nodes/sentry-node.md) – Sentry 組織、プロジェクト、チーム、課題、イベント、リリースの自動化
- [Credentials Sharing](./credentials-sharing.md) – ユーザーおよびチームとの共有
- [Third-Party Integrations](./integrations.md) – 認証情報タイプごとのセットアップガイド
- [Expression DSL](./expression-dsl.md) – 式での `$credentials`

## Model Router（Auto Model）

Model Router はキーを保持しません。代わりに **decision model credential**、**model options** のリスト（それぞれ既存の OpenAI、Google、または Custom 認証情報とモデルの組み合わせ）、および各オプションについてそのオプションをいつ使用すべきかを示す自由記述テキストを保持します。

モデルを提供するすべてのピッカーに表示されます。[LLM](../nodes/llm-node.md) ノードと [Agent](../nodes/agent-node.md) ノード、Chat、AI Defaults、Dashboards、式ビルダー、Data Tables などです。その唯一のモデルは **Auto** です。これを選択すると、decision model が各リクエストを読み取ってルーティングします。[Evals](../tabs/evals-tab.md) では除外されます。Eval は特定のモデルを比較するものであり、Router は独自に選択するためです。

Agent はツールループの進行に応じて再ルーティングするため、安価なモデルが初期のターンを担当し、より強力なモデルが必要なターンを担当できます。同一の入力は前回の決定を再利用するため、ループは会話が実際に進展したときにのみ決定のコストを支払います。

### できないこと

Auto Model は **Responses API**、**Batch mode**、**image output** と組み合わせることはできません。これらのトグルは Router が選択されると自動的に無効になり、それぞれ理由が表示されます。Guardrail チェックと human-review policy classifier は固定の単一モデル呼び出しであり、ルーティングされることはありません。

### ルーティングが失敗した場合

1つのオプションに **Use this option when routing fails** を設定しておくと、判断モデルの障害によって実行が停止することはなくなり、フォールバックが使用され、その理由が実行に記録されます。設定していない場合、ノードは推測せずに失敗します。

### リクエストがどこへ送られたかを確認する

Traces にはモデル単体ではなく `Auto Model / GPT-5` と表示され、コストは実際に実行されたモデルに帰属したままになります。キャンバスの Execution Log と Span View にも同じペアが表示され、Span View ではどのターンがどこへ送られたかを一覧で確認できます。
