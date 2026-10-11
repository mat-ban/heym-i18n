# Credentialsタブ

**Credentials**タブでは、ノードで使用されるAPIキーとシークレットを管理します。ここでCredentialを追加し、Workflowのノード内で名前を指定して参照します。Credentialの概要とノードでの使用方法については、[Credentials](../reference/credentials.md)を参照してください。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentialsデモを見る</a></p>

## Credentialの種類

| 種類 | 用途 |
|------|----------|
| **OpenAI** | LLM、Agent、RAGノード用のOpenAI APIキー |
| **Google** | Google AI（Gemini）APIキー |
| **GitHub** | GitHub API、GitHubノードのWorkflow、MCPサーバー、Agent Workflow用のGitHub personal access token（PAT）。オプションでGitHub Enterpriseの`base_url`も指定可能 |
| **Linear** | チーム、プロジェクト、Issue、コメント用のLinear personal APIキーまたはOAuth2 |
| **Notion** | Internal integration tokenまたはpublic-integration OAuthによるワークスペース認可 |
| **Custom** | カスタムLLM Endpoint |
| **Bearer** | HTTP認証用のBearer Token |
| **Header** | HTTPリクエスト用のカスタムヘッダーキーと値 |
| **Telegram** | Telegram bot TokenとオプションのWebhookシークレット |
| **Slack** | Slack incoming Webhook URL |
| **Discord** | Discord incoming Webhook URL |
| **Discord Trigger** | Discordアプリケーションの公開鍵 |
| **IMAP** | 受信メールボックスのTrigger用Credential |
| **SMTP** | メール送信用Credential |
| **Redis** | Redis接続 |
| **RAG: Qdrant + OpenAI** | 外部Qdrantサーバーをバックエンドとする、RAGノード用のベクトルストア |
| **RAG: Psql + OpenAI** | Heym自身のPostgresデータベース（pgvector）をバックエンドとする、RAGノード用のベクトルストア — 外部サービス不要 |
| **RAG: Custom Embeddings** | OpenAI互換のEmbedding Endpointを使用するRAGノード用ベクトルストア。ストアとしてQdrantまたはPostgres（pgvector）を利用 |
| **Cohere** | Embedding用のCohere API |

## Credentialの追加

1. **Add Credential**をクリックします
2. Credentialの種類を選択します
3. 必要な値（APIキー、URLなど）を入力します
4. ノードで参照するための名前を付けます

GitHubの場合、現在のCredentialフローはPATベースです。Fine-grained PATを推奨します。GitHub Appのインストールフローは、現時点ではUIで正式にサポートされていません。GitHub Enterprise Serverを使用する場合は、`https://github.example.com/api/v3`のようなGitHub APIベースURLをオプションで設定できます。

Linearの場合は、ダイアログで**Personal API key**または**OAuth2**を選択します。Personal APIキーは、Linearの**Settings → Security & Access → Personal API keys**で作成します。OAuth2では、Linear OAuthアプリケーションのClient IDとClient Secretを使用し、リダイレクトURIとして`{FRONTEND_URL}/api/credentials/linear/oauth/callback`を登録します。Credentialは、作成または認可したLinearユーザーの権限で動作します。保存前に、Credentialダイアログの**Test Connection**でAPIキーまたはOAuth Tokenを検証してください。

**Notion**の場合は、ダイアログで**Internal token**または**OAuth**を選択します。OAuthでは、Notion public integrationのClient IDとClient Secretを使用し、Heymはそれらを暗号化してCredentialに保存します。Workflowを保存する前に、**Test Connection**でSupabase、Linear、NotionのCredentialを検証してください。Notionのセットアップ詳細については、[Third-Party Integrations](../reference/integrations.md#notion)を参照してください。

OAuth Credentialは、ポップアップでプロバイダーの認可ページを開きます。ブラウザがブロックした場合は、Connectボタンの下にある**Open the authorization page**リンクを使用してください。接続が完了すると、ダイアログに通知が表示されます。新しいCredentialが接続されると、ボタンに**Connected**と表示されます。

## 編集と削除

- **Edit** – Credentialの値を更新します（機密値はマスクされます）
- **Delete** – Credentialを削除します。使用中のWorkflowでは代替が必要になります

GitHub Enterprise Server上の**GitHub** Credentialを編集する際、オプションの**GitHub API Base URL**を空のままにすると、既存のEnterprise Endpointが保持されます。Endpointを変更したい場合にのみ、新しいURLを入力してください。

## 共有

- [Credentialの共有](../reference/credentials-sharing.md)を、メールアドレスまたは[Teams](../reference/teams.md)で他のユーザーと行えます
- 共有されたCredentialにはインジケーターが表示されます
- Credentialカードのメニューから共有を解除できます

## ノードでの使用

ノード設定では、認証情報を名前で参照します。例：
- [LLMノード](../nodes/llm-node.md) – モデルAPIの認証情報を選択します
- [HTTPノード](../nodes/http-node.md) – 認証にBearerまたはHeader認証情報を使用します
- [Agentノード](../nodes/agent-node.md) – GitHub Tokenを`GITHUB_PERSONAL_ACCESS_TOKEN`などのMCPサーバー環境変数に渡します
- [GitHubノード](../nodes/github-node.md) – GitHubのリポジトリ、ユーザー、Issue、レビュー、リリース、Workflow、トラフィック、ファイル操作をネイティブに実行します
- [Linearノード](../nodes/linear-node.md) – ワークスペースのメタデータを読み取り、LinearのIssueとコメントを自動化します
- [Notionノード](../nodes/notion-node.md) – Notionのデータベース、データソース、ページ、ブロックを管理します
- [RAGノード](../nodes/rag-node.md) – ベクトルストアにQdrantまたはPostgres（pgvector）の認証情報を使用します
- [Telegram Triggerノード](../nodes/telegram-trigger-node.md) – TelegramボットのWebhookを受信します
- [Telegramノード](../nodes/telegram-node.md) – Telegramボットのメッセージを送信します
- [Discord Triggerノード](../nodes/discord-trigger-node.md) – DiscordインタラクションのWebhookを受信します
- [Discordノード](../nodes/discord-node.md) – DiscordのWebhookメッセージを送信します
- [IMAP Triggerノード](../nodes/imap-trigger-node.md) – 共有受信トレイをポーリングして新着メールを取得します

式の中で認証情報に基づく値を参照する方法については、[Expression DSL](../reference/expression-dsl.md)をご覧ください。

## 関連項目

- [サードパーティ統合](../reference/integrations.md) – 各認証情報タイプ（Telegram、Discord、Qdrant、Grist、IMAP、SMTP、RabbitMQ、Redis、Slackなど）の詳細なセットアップガイド
- [認証情報の共有](../reference/credentials-sharing.md) – 他のユーザーと認証情報を共有する
- [セキュリティ](../reference/security.md) – 保存時の暗号化、セッション管理、レート制限
- [ノードタイプ](../reference/node-types.md) – 認証情報を使用するノード（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[GitHub](../nodes/github-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)）
- [Vectorstoresタブ](./vectorstores-tab.md) – QdrantまたはPostgres（pgvector）の認証情報を使用します
- [Chatタブ](./chat-tab.md) – OpenAI/Googleの認証情報を使用します
- [コンテキストショーケース](../reference/contextual-showcase.md) – ダッシュボード画面のコンパクトなページガイド
