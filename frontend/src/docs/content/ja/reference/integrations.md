# サードパーティ連携

Heym は **credential** を通じて外部サービスに接続します。各 credential タイプは 1 つのサービスの接続情報を保存し、複数のノードや Workflow 間で再利用できます。概要については [Credentials](./credentials.md) を参照してください。

credential は [Settings → Credentials](../tabs/credentials-tab.md) で追加します。すべての値は保存時に暗号化されます。credential は他のユーザーや [Teams](./teams.md) と[共有](./credentials-sharing.md)できます。

一部の統合ノードは credential を**必要としません**。[WebSocket Trigger](../nodes/websocket-trigger-node.md) と [WebSocket Send](../nodes/websocket-send-node.md) は、ノード上で直接設定された URL、ヘッダー、サブプロトコルを使用して外部ソケットに接続します。

## Credential タイプ一覧

| タイプ | 使用元 | 主要フィールド |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`、任意の `base_url` |
| **Google** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md) | `api_key`、任意の `base_url` |
| **Jira** | [Jira ノード](../nodes/jira-node.md) | `api_token`、`base_url`、`deployment`、`auth_mode`、`email` (Basic 認証のみ)、任意の `api_version` |
| **Linear** | [Linear ノード](../nodes/linear-node.md) | `api_key`、または `client_id` + `client_secret` の OAuth2 |
| **Sentry** | [Sentry ノード](../nodes/sentry-node.md) | `api_token`、任意の `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key`、`base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md)（LLM-as-Judge ジャッジ） | `base_url`、任意の `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults | decision model の credential、および他の credential を参照するモデルオプション |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `qdrant_host`、`openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `openai_api_key`（ベクトルは pgvector を介して Heym 自身の Postgres に保存されます） |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md)、Vectorstores | `embedding_base_url`、`embedding_model`、`embedding_dimensions`、`db_type`、任意の `embedding_api_key`、および `db_type` が `qdrant` の場合は `qdrant_host` |
| **Grist** | [Grist ノード](../nodes/grist-node.md) | `api_key`、`server_url` |
| **Google Sheets** | [Google Sheets ノード](../nodes/google-sheets-node.md) | `client_id`、`client_secret` + OAuth2 同意 |
| **Google Drive** | [Google Drive ノード](../nodes/google-drive-node.md) | `client_id`、`client_secret` + OAuth2 同意（Drive のフルスコープ） |
| **BigQuery** | [BigQuery ノード](../nodes/bigquery-node.md) | `client_id`、`client_secret` + OAuth2 同意 |
| **Supabase** | [Supabase ノード](../nodes/supabase-node.md) | `supabase_url`、`supabase_key`、任意の `supabase_schema` |
| **ClickHouse** | [ClickHouse ノード](../nodes/clickhouse-node.md) | `host`、`port`、`username`、`password`、`database`、`secure` |
| **Notion** | [Notion ノード](../nodes/notion-node.md) | `api_token`、または `client_id` + `client_secret` の OAuth |
| **Amazon S3** | [Amazon S3 ノード](../nodes/amazon-s3-node.md) | `aws_access_key_id`、`aws_secret_access_key`、`aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`、`port`、`email`、`password` |
| **IMAP** | [IMAP Trigger ノード](../nodes/imap-trigger-node.md) | `imap_host`、`imap_port`、`imap_username`、`imap_password` |
| **Telegram** | [Telegram Trigger ノード](../nodes/telegram-trigger-node.md)、[Telegram ノード](../nodes/telegram-node.md) | `bot_token`、任意の `secret_token` |
| **Discord** | [Discord ノード](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger ノード](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ ノード](../nodes/rabbitmq-node.md) | `rabbitmq_host`、`rabbitmq_username`、`rabbitmq_password` |
| **Redis** | [Redis ノード](../nodes/redis-node.md) | `host`、`port`、`password` |
| **Slack** | [Slack ノード](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger ノード](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP ノード](../nodes/http-node.md) | `token` |
| **Header** | [HTTP ノード](../nodes/http-node.md) | `header_key`、`header_value` |
| **FlareSolverr** | [Crawler ノード](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub credential は GitHub personal access token（PAT）を保存し、Workflow が [GitHub ノード](../nodes/github-node.md) を通じて GitHub REST API を呼び出したり、`@modelcontextprotocol/server-github` などの MCP サーバーに token を渡したり、[HTTP ノード](../nodes/http-node.md) からカスタム REST 呼び出しに使用したりできるようにします。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `api_key` | GitHub personal access token（`github_pat_...` の fine-grained PAT、またはクラシックな `ghp_...` PAT） |
### 任意フィールド

| フィールド | 説明 |
|-------|-------------|
| `base_url` | GitHub Enterprise Server 用の GitHub API ベース URL（例：`https://github.example.com/api/v3`） |

### 注意事項

- 可能な限り、きめ細かい personal access token の使用を推奨します。特定のリポジトリと権限にスコープを限定できるためです。
- GitHub.com の場合は `base_url` を空のままにしてください。GitHub Enterprise Server の場合は、サーバーの Web UI ルート（`https://github.example.com` など）ではなく、`/api/v3` を含む完全な REST API エンドポイント（例：`https://github.example.com/api/v3`）を使用してください。
- この credential は現在、PAT ベースの認証のみをモデル化しています。組織のリポジトリにアクセスするには、必要な組織／リポジトリ権限が付与された PAT を使用してください。
- GitHub App の installation token および GitHub App のセットアップフローは、現時点の Heym UI ではファーストクラスでサポートされていません。
- ネイティブなリポジトリ、ユーザー、issue、pull request、review、release、Actions workflow、traffic、ファイル操作には、[GitHub ノード](../nodes/github-node.md)の使用を推奨します。GitHub ノードがカバーしないエンドポイントや payload が必要な場合にのみ、[HTTP ノード](../nodes/http-node.md)を使用してください。
- MCP で [Agent ノード](../nodes/agent-node.md)を使用する場合は、`$credentials.YourGitHubCredential` を `GITHUB_PERSONAL_ACCESS_TOKEN` などの MCP 接続環境変数に渡してください。
- GitHub の REST API は通常、`Authorization: Bearer <token>` と `Accept: application/vnd.github+json` を要求します。
- GitHub credential を編集する際、GitHub Enterprise の `base_url` を空のままにすると既存のエンドポイントが保持されます。エンドポイントを変更したい場合にのみ、新しい URL を入力してください。

### 使用元

- [GitHub ノード](../nodes/github-node.md)
- [Codex ノード](../nodes/codex-node.md)
- [Agent ノード](../nodes/agent-node.md)
- [HTTP ノード](../nodes/http-node.md)

---

## Decision Model

Decision Model は、状態に関する型付きの質問に回答し、テキストではなく確率を返します。TypeSafe の Jev がリファレンス実装です。同じ `{model, state, questions}` ボディを受け入れるエンドポイントであればどれでも動作し、対応していないエンドポイントに対しては [Decision](../nodes/decision-node.md) ノードで手書きのボディを送信できます。

### 必須フィールド

- `base_url` – エンドポイント（例：`https://api.typesafe.ai`）。Heym は `/v1/systemone` を付加します。

### 任意フィールド

- `api_key` – `Authorization: Bearer` として送信されます。キーが不要なエンドポイントでは空のままにできます。

### 注意事項

- **Test Connection** は、エンドポイントとキーが機能することを確認するために、1 つの小さな質問を送信します。
- credential を編集する際、キーフィールドを空のままにすると保存済みのキーが保持されます。
- プライベートアドレスおよびループバックアドレスへの送信リクエストはデフォルトでブロックされるため、`localhost` やプライベートレンジ上のセルフホストエンドポイントには `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` が必要です。
- これらのモデルは Heym が同期する LLM 価格テーブルに含まれていないため、[Traces](../tabs/traces-tab.md)の Cost 列は空のままになります。Token 数は引き続き記録されます。

### 使用元

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – `LLM-as-Judge` の回答を期待される出力と照合してスコアリングします

## OpenAI Codex

OpenAI Codex credential は [Codex ノード](../nodes/codex-node.md)を認証します。これは LLM、Agent、RAG ノードで使用される OpenAI API key credential とは別のものです。

### 認証モード

| モード | 説明 |
|------|-------------|
| **Sign in with ChatGPT**（推奨） | ChatGPT Plus/Pro サブスクリプションを使用する OAuth（PKCE）サインインで、実行時にトークン単位の API コストを回避できます。Heym は token バンドルを保存し、自動的に更新します。 |
| **Access token** | ローカルの Codex CLI プロセスにのみ渡される ChatGPT/Codex の `access_token`。 |

### 注意事項

- この credential タイプでは API key は拒否されます。
- Codex token は `$credentials.Name` を通じて公開されません。
- Codex ノードは、リポジトリのクローン、ブランチのプッシュ、draft PR の作成のために GitHub credential も必要とします。

### 使用元

- [Codex ノード](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go credential は [OpenCode Go ノード](../nodes/opencode-go-node.md)を認証します。OpenCode Go gateway の API key（[opencode.ai/go](https://opencode.ai/go) から取得）と、任意の gateway ベース URL を保存します。

### フィールド

| フィールド | 説明 |
|-------|-------------|
| **API Key** | OpenCode Go gateway の API key（必須）。 |
| **Gateway Base URL** | 任意。デフォルトは `https://opencode.ai/zen/go/v1`。セルフホストまたはプロキシ経由の gateway の場合にのみ上書きしてください。 |

### 注意事項

- API key は、堅牢化されたコンテナ内の OpenCode CLI プロセスにのみ渡されます。
- OpenCode Go ノードは、リポジトリのクローン、ブランチのプッシュ、pull request の作成のために GitHub credential も必要とします。GitHub token がサンドボックスコンテナ内に配置されることはありません。

### 使用元

- [OpenCode Go ノード](../nodes/opencode-go-node.md)

---

## Linear

Linear credential は、[Linear ノード](../nodes/linear-node.md)に対して personal API key または OAuth2 のいずれかをサポートします。Heym はワークスペースのメタデータ、プロジェクト、issue、コメントのために、ネイティブの GraphQL クエリを Linear に送信します。
### セットアップ

次のいずれかの認証モードを選択してください：

**Personal API key**

1. Linear で **Settings → Security & Access → Personal API keys** を開きます。
2. 自動化したいワークスペースへのアクセス権を持つキーを作成します。
3. そのキーを Heym の Linear credential に貼り付け、**Test Connection** で検証します。

**OAuth2**

1. Linear OAuth アプリケーションを作成します。
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback` をリダイレクト URI として登録します。
3. Heym Dashboard → **Credentials** → **New** → タイプ **Linear** を選択します。
4. **OAuth2** を選択し、Client ID と Client Secret を入力して **Connect** をクリックします。

### 必須フィールド

| モード | フィールド | 説明 |
|------|-------|-------------|
| Personal API key | `api_key` | Linear personal API key。通常は `lin_api_` というプレフィックスが付きます |
| OAuth2 | `client_id` | Linear OAuth アプリケーションの Client ID |
| OAuth2 | `client_secret` | Linear OAuth アプリケーションの Client Secret |

OAuth トークン（`access_token`、`refresh_token`、`token_expiry`）は自動的に保存および更新されます。

### 注意事項

- Personal API key および OAuth トークンは、それを作成または認可した Linear ユーザーとして動作します。
- Linear OAuth は `read,write,issues:create,comments:create` スコープを使用します。
- credential ダイアログの **Test Connection** を使用して、API key または OAuth トークンを Linear API に対して検証してください。
- issue を作成またはフィルタリングする前に、Linear ノードの List Teams および List Projects を使用して UUID を確認してください。
- 更新用の state および assignee の UUID を確認するには、List Workflow States および List Team Members を使用してください。
- API key をローテーションするには、credential を編集して新しい値を入力します。OAuth アプリのシークレットをローテーションした場合は、**Connect** から credential を再接続してください。

### 使用元

- [Linear ノード](../nodes/linear-node.md)

---

## Jira

Jira credential は、[Jira ノード](../nodes/jira-node.md) 用の Jira Basic 認証情報または Data Center 個人アクセストークン、Jira サイトのベース URL、デプロイモード、およびオプションの REST API バージョンを保存します。Jira Cloud には `cloud` を、Jira Data Center / Server には `data_center` を使用してください。

### セットアップ

**Jira Cloud**

1. Atlassian アカウント設定で API トークンを作成します。
2. Heym Dashboard → **Credentials** → **New** → タイプ **Jira** を選択します。
3. Atlassian のメールアドレス、API トークン、および `https://your-domain.atlassian.net` のような Jira サイト URL を入力します。
4. **Test Connection** を使用して credential を検証します。

**Jira Data Center / Server**

1. デプロイとして **Jira Data Center / Server** を選択します。
2. 認証方法を選択します。**ユーザー名とパスワード** は Basic 認証を使用します。**Personal Access Token** は `Authorization: Bearer <token>` を使用し、Jira Data Center / Server 8.14 以降が必要です。Jira の **プロフィール → Personal Access Tokens** でトークンを作成します。
3. Jira のユーザー名とパスワードを入力するか、個人アクセストークンを貼り付けます（ユーザー名は不要です）。
4. Jira サイト URL（例：`https://jira.example.com`）を入力します。
5. **Test Connection** を使用して credential を検証します。

### フィールド

| フィールド | 説明 |
| --- | --- |
| `auth_mode` | `basic` (省略時のデフォルト) または `pat`。`pat` は `data_center` でのみ有効です |
| `email` | Jira Cloud Atlassian アカウントのメールアドレス、または Jira Data Center / Server のユーザー名。`pat` モードでは使用されません |
| `api_token` | Jira Cloud Atlassian API トークン、Basic 認証用の Jira Data Center / Server パスワード、または `pat` モードの Data Center 個人アクセストークン |
| `base_url` | Jira サイトのベース URL |
| `deployment` | Jira Cloud の場合は `cloud`、Jira Data Center / Server の場合は `data_center` |
| `api_version` | REST API バージョン。Jira Cloud ではデフォルトで `3` になります。Data Center / Server は v2 を使用します |

### 注意事項

- Jira ノードは、Jira Cloud REST API v3 向けに issue の説明とコメントを Atlassian Document Format のテキスト
  ドキュメントとして送信します。Data Center / Server の credential はプレーンテキストを送信します。
- Data Center / Server は、ユーザー名/パスワードによる Basic 認証および Bearer スキームを使用した個人アクセストークン (PAT) 認証をサポートしています。PAT 認証には Jira Data Center / Server 8.14 以降が必要です。
- 添付ファイルのアップロードは base64 または data URL コンテンツを受け付け、プラットフォームのファイルサイズ制限（デフォルト 99 MB）が適用されます。添付ファイルのダウンロードは、有効にすると base64 コンテンツを返すことができます。
- ユーザーの作成、削除、および issue 通知には、認証された Jira アカウントが該当する Jira サイトまたは組織の権限を持っている必要があります。
- List Projects、Search Issues、および List Transitions を使用して、プロジェクトキー、issue キー、および transition ID を確認してください。
- Jira ノードでカバーされていないカスタム endpoint については、cURL コマンドで Jira Basic Auth (Cloud の場合は `email:api_token`、Data Center / Server の場合は `username:password`) または PAT Bearer auth (Data Center / Server の場合は `Authorization: Bearer <token>`) を指定した [HTTP ノード](../nodes/http-node.md) を使用してください。または、適切な `Authorization` ヘッダーを持つ Header credential を使用します。

関連項目：

- [Jira ノード](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Sentry credential は、[Sentry ノード](../nodes/sentry-node.md) 用の auth token を保存します。Heym は組織、プロジェクト、チーム、issue、イベント、およびリリースの操作に Sentry の REST API を使用します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `api_token` | 自動化する組織およびプロジェクトへのアクセス権を持つ Sentry auth token |

### オプションフィールド

| フィールド | 説明 |
|-------|-------------|
| `base_url` | セルフホスト型 Sentry 用のオプションのルート URL（例：`https://sentry.example.com`） |

### 注意事項

- Sentry SaaS の場合は `base_url` を空のままにしてください。
- **Test Connection** を使用して、トークンが表示可能な組織を一覧表示できることを確認してください。
- カスタム REST 呼び出しには、bearer token として `$credentials.YourSentryCredential` を使用してください。

### 使用元

- [Sentry ノード](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) は、セマンティック検索および RAG（Retrieval Augmented Generation）に使用されるオープンソースのベクトルデータベースです。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `qdrant_host` | Qdrant インスタンスへの完全な URL（例：`http://localhost:6333` またはクラウドエンドポイント） |
| `openai_api_key` | ドキュメントのインデックス作成および検索時に埋め込みを生成するために使用される OpenAI API key |
### 注意事項

- Qdrant のコレクションは、[Vectorstores](../tabs/vectorstores-tab.md) タブから管理します。各ベクターストアは Qdrant のコレクションにマッピングされます。
- [RAG ノード](../nodes/rag-node.md)はベクターストアを使用します（ベクターストアが Qdrant クレデンシャルを参照します）— RAG ノードがクレデンシャルを直接参照することはありません。
- Qdrant インスタンスで API キーが必要な場合は、`qdrant_host` の値に含めるか、Qdrant 側で適切に設定してください。現在の連携には、Qdrant API キー専用のフィールドはありません。
- セルフホスト型 Qdrant の場合：[公式 Docker イメージ](https://hub.docker.com/r/qdrant/qdrant)を使用し、ポート `6333` を公開してください。

### 使用元

- [RAG ノード](../nodes/rag-node.md)（ベクターストア経由）
- [Vectorstores タブ](../tabs/vectorstores-tab.md)

## カスタム埋め込み（RAG）

デフォルトでは、RAG の埋め込みは OpenAI から取得されます。**RAG: Custom Embeddings** クレデンシャルを使用すると、代わりに任意の OpenAI 互換埋め込み Endpoint — Ollama、vLLM、Text Embeddings Inference、LM Studio、Together、またはホスト型ゲートウェイ — を指定し、書き込み先のベクターストアを指定できます。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `embedding_base_url` | `/v1` パスを含む Endpoint URL（例：`http://localhost:11434/v1`） |
| `embedding_api_key` | 任意。ローカルサーバーでは通常キーは不要です |
| `embedding_model` | Endpoint が期待するモデル名（例：`nomic-embed-text`） |
| `embedding_dimensions` | モデルが返すベクターの次元数（デフォルト `1536`） |
| `embedding_request_dimensions` | 任意。モデル本来の次元数ではなく `embedding_dimensions` を返すよう Endpoint に要求します |
| `db_type` | `qdrant` または `pgvector` |
| `qdrant_host`、`qdrant_port`、`qdrant_api_key` | Qdrant 接続情報。`db_type` が `qdrant` の場合に必須です |

### 注意事項

- **Qdrant は任意の次元数を受け入れます。** 各コレクションはこのクレデンシャルが宣言した次元数で作成されるため、Dimensions フィールドは自由に編集できます。
- **Postgres（pgvector）は正確に 1536 次元を要求します。** カラムが固定の `vector(1536)` であるため、Dimensions フィールドは 1536 に固定され、それ以外の次元数を宣言したクレデンシャルは保存時に拒否されます。
- **pgvector 用の次元数短縮。** ストアが Postgres の場合、ダイアログに *Ask the endpoint to return 1536 dimensions* が表示されます。これは `dimensions` リクエストパラメータを送信するもので、Matryoshka 表現で学習されたモデル（OpenAI `text-embedding-3-*`、`nomic-embed-text-v1.5`、`jina-v3` など）はこれに従い、短縮されつつも意味を保ったベクターを返します。このパラメータをサポートしない Endpoint はリクエストを拒否し、受け入れるが無視する Endpoint は実際に返された次元数を明示する明確なエラーを生成します。Heym 自体がベクターを切り詰めることはありません。非 Matryoshka モデルの出力をスライスすると、検索品質が気付かないうちに劣化するためです。このオプションは、コレクションを任意の次元数に設定できる Qdrant では提供されません。
- ストアを作成する前に、クレデンシャルダイアログの **Test Connection** を使用して、プローブ文字列を埋め込み、モデルが実際に返す次元数を確認してください。
- `dimensions` リクエストパラメータは OpenAI 自体にのみ送信されます。ほとんどの OpenAI 互換サーバーは未知のパラメータを拒否するためです。代わりに、モデル本来の次元数がクレデンシャルに対して検証されます。
- 既存の **RAG: Qdrant + OpenAI** および **RAG: Psql + OpenAI** クレデンシャルは変更されておらず、引き続き動作します。

### 使用元

- [RAG ノード](../nodes/rag-node.md)（ベクターストア経由）
- [Vectorstores タブ](../tabs/vectorstores-tab.md)

## Postgres（pgvector）

Heym は、[pgvector](https://github.com/pgvector/pgvector) 拡張機能を使用して、**自身の Postgres データベース内**にベクターを保存することもできます — 外部のベクターサービスは不要です。**RAG: Psql + OpenAI** クレデンシャルを作成し、ベクターストアの作成時に使用してから、RAG ノードの Database ドロップダウンで **Postgres (pgvector)** を選択してください。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `openai_api_key` | ドキュメントのインデックス作成および検索時に埋め込みを生成するために使用される OpenAI API キー |

### 注意事項

- ホスト/ポートは不要です — ベクターは Heym 自身のデータベースに書き込まれます。Heym が別のデータベースに接続することはありません。
- Qdrant で利用可能なすべての RAG 機能（挿入、検索、メタデータフィルター、Cohere リランキング、クローン、共有）は、Postgres バックエンドでもまったく同じように動作します。
- `vector` 拡張機能が必要です。Heym は公式の `postgres:16` イメージを変更せずに維持し（既存データが一切触れられないようにするため）、**起動時に `postgresql-16-pgvector` パッケージを自動インストールします** — `run.sh`、`deploy.sh`、`run_e2e.sh` のすべてがこれを処理します。インストールは非致命的です。実行できない場合（例：ネットワークがない場合）、Qdrant RAG は引き続き動作し、Postgres バックエンドは非アクティブのままになります（マイグレーションはテーブルを適切にスキップします）。
- 公開されているシングルコンテナイメージ（`ghcr.io/heymrun/heym`）を**独自の外部 Postgres** に対して実行する場合、そのデータベースは `vector` 拡張機能をサポートしている必要があります（Heym は自身が管理していないデータベースにはインストールできません）。これがない場合、Postgres ベクターストアの作成またはアップロード時に明確なメッセージが返され、Qdrant RAG は引き続き動作します。

### 使用元

- [RAG ノード](../nodes/rag-node.md)（ベクターストア経由）
- [Vectorstores タブ](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) は、構造化データと数式をサポートするスプレッドシート/データベースのハイブリッドです。Grist クレデンシャルを使用すると、Heym が Grist ドキュメントを読み書きできます。
### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `api_key` | Grist API key（Grist インスタンスの **Profile → API Key** で確認できます） |
| `server_url` | Grist サーバーのベース URL（例：Grist Cloud の場合は `https://docs.getgrist.com`、またはセルフホストの URL） |

### 備考

- [Grist ノード](../nodes/grist-node.md) の設定には、**Document ID**（Grist ドキュメントの URL から取得）と **Table ID** が必要です。これらは credential には含まれません。
- セルフホストの Grist の場合、`server_url` にはご利用のインスタンスのドメインを設定してください。
- Grist のカラム ID は表示ラベルではなくアンダースコアを使用します（例：`User_Name`）。`listColumns` オペレーションを使用して確認してください。

### 使用元

- [Grist ノード](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets credential は、OAuth2 の「Bring Your Own App」モデルを使用して Heym を Google Sheets API に接続します。Google Cloud の OAuth2 Client ID と Client Secret を指定し、ブラウザのポップアップ経由でアクセスを認可します。Token はバックグラウンドで自動的に更新されます。

### セットアップ

1. [Google Cloud Console](https://console.cloud.google.com) を開き、**APIs & Services** → **Library** に移動して **Google Sheets API** を検索して有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** に移動し、アプリケーションタイプで **Web application** を選択します。
3. **Authorized redirect URIs** に以下を追加します：`https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. 生成された **Client ID** と **Client Secret** をコピーします。
5. Heym Dashboard → **Credentials** → **New** に移動し、タイプで **Google Sheets (OAuth2)** を選択します。
6. Client ID、Client Secret、名前を入力し、**Connect** をクリックして Google の同意ポップアップを開き、アクセスを認可します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `client_id` | Google Cloud Console の OAuth2 Client ID |
| `client_secret` | Google Cloud Console の OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）は自動的に保存および更新されます。直接管理する必要はありません。

### 備考

- OAuth2 の同意画面には spreadsheets スコープ（`https://www.googleapis.com/auth/spreadsheets`）が必要です。
- Heym は refresh token を使用して、access token の有効期限が切れる前に新しいものを取得します（60 秒の安全バッファ）。
- Google Cloud Console で Client Secret をローテーションした場合は、**Connect** ボタンから credential を再接続してください。
- **本番環境：** バックエンドの **`FRONTEND_URL`** を、ユーザーがブラウザで開く正確な公開 URL（スキーム + ホスト、例：`https://heym.example.com`）に設定してください。Heym はこの値のみから Google OAuth リダイレクト URI を構築します。`Origin` や `X-Forwarded-*` ヘッダー（クライアント制御可能）は**信頼しません**。Google Cloud Console に `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` を登録してください。

### 使用元

- [Google Sheets ノード](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive credential は、Google Sheets と同じ OAuth2 の「Bring Your Own App」モデルを使用して Heym を Google Drive API に接続します。Google Cloud の OAuth2 Client ID と Client Secret を指定し、ブラウザのポップアップ経由でアクセスを認可します。Token はバックグラウンドで自動的に更新されます。

### セットアップ

1. [Google Cloud Console](https://console.cloud.google.com) を開き、**APIs & Services** → **Library** に移動して **Google Drive API** を検索して有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** に移動し、アプリケーションタイプで **Web application** を選択します。
3. **Authorized redirect URIs** に以下を追加します：`https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. 生成された **Client ID** と **Client Secret** をコピーします。
5. Heym Dashboard → **Credentials** → **New** に移動し、タイプで **Google Drive (OAuth2)** を選択します。
6. Client ID、Client Secret、名前を入力し、**Connect** をクリックして Google の同意ポップアップを開き、アクセスを認可します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `client_id` | Google Cloud Console の OAuth2 Client ID |
| `client_secret` | Google Cloud Console の OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）は自動的に保存および更新されます。直接管理する必要はありません。

### スコープ

Google Drive は **フル Drive スコープ**（`https://www.googleapis.com/auth/drive`）を要求します。

これは、ノードが既に所有しているファイルを操作するために必要です。より狭い `drive.file` スコープは、OAuth クライアント自身が作成したファイルへのアクセスのみを許可するため、`listFolderFiles`、`updateFile`、`removeFile`、`removeFolder` が既存の Drive の内容を認識できなくなります。

ご自身の Google Cloud プロジェクトの Client ID と Secret を指定するため、このスコープに関する Google のアプリ審査要件は Heym ではなく、お客様のプロジェクトに適用されます。

### 備考

- Heym は refresh token を使用して、access token の有効期限が切れる前に新しいものを取得します（60 秒の安全バッファ）。
- Google Cloud Console で Client Secret をローテーションした場合は、**Connect** ボタンから credential を再接続してください。
- 共有ドライブをサポートしています。ノードはすべての API 呼び出しで `supportsAllDrives` を設定します。
- **本番環境：** バックエンドの **`FRONTEND_URL`** を、ユーザーがブラウザで開く正確な公開 URL に設定してください。Heym はこの値のみから Google OAuth リダイレクト URI を構築します。`Origin` や `X-Forwarded-*` ヘッダーは**信頼しません**。Google Cloud Console に `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` を登録してください。
- この credential をチームで共有する前に、[Credential Sharing](./credentials-sharing.md) をご参照ください。

### 使用元

- [Google Drive ノード](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery credential は、OAuth2 の「Bring Your Own App」モデルを使用して Heym を Google BigQuery API に接続します。Google Cloud の OAuth2 Client ID と Client Secret を指定し、ブラウザのポップアップ経由でアクセスを承認します。Token はバックグラウンドで自動的に更新されます。

### セットアップ

1. [Google Cloud Console](https://console.cloud.google.com) を開き、**APIs & Services** → **Library** へ移動して **BigQuery API** を検索し、有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** へ移動し、アプリケーションタイプとして **Web application** を選択します。
3. **Authorized redirect URIs** に以下を追加します: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. 生成された **Client ID** と **Client Secret** をコピーします。
5. Heym Dashboard → **Credentials** → **New** → タイプ **BigQuery (OAuth2)** を選択します。
6. Client ID、Client Secret、名前を入力し、**Connect** をクリックして Google の同意ポップアップを開き、アクセスを承認します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `client_id` | Google Cloud Console の OAuth2 Client ID |
| `client_secret` | Google Cloud Console の OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）は保存され、自動的に更新されます。

### 注意事項

- OAuth2 の同意画面には BigQuery スコープ（`https://www.googleapis.com/auth/bigquery`）が必要です。
- **本番環境:** バックエンドの **`FRONTEND_URL`** を公開 URL に設定してください。Google Cloud Console に `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` を登録します。

### 使用元

- [BigQuery ノード](../nodes/bigquery-node.md)

---

## Supabase

Supabase credential は、Heym を Supabase プロジェクトの PostgREST API に接続し、Workflow から Postgres ベースのテーブルをクエリおよび変更できるようにします。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `supabase_url` | プロジェクトのベース URL（例: `https://your-project.supabase.co`） |
| `supabase_key` | 対象テーブルにアクセス可能な API key |
| `supabase_schema` | 任意のデフォルト schema（デフォルトは `public`） |

### 注意事項

- [Supabase ノード](../nodes/supabase-node.md) は `/rest/v1/<table>` と通信し、オペレータフィルタ（`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`like`、`ilike`、`is`、`in`、および関連する PostgREST オペレータ）とネストされた `or` / `and` 論理グループをサポートします。
- 書き込み操作には、信頼されたサーバーサイドでの使用を目的とし、必要最小限のテーブル権限を持つ key を推奨します。
- credential でデフォルト schema が定義されていても、ノードはステップごとに schema を上書きできます。

### 使用元

- [Supabase ノード](../nodes/supabase-node.md)

## ClickHouse

ClickHouse credential は、HTTP インターフェース経由で Heym を外部の ClickHouse データベースに接続し、Workflow から OLAP テーブルに対して SQL、CRUD、カウント操作を実行できるようにします。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `host` | スキームなしの HTTP ホスト（例: `your-instance.clickhouse.cloud`） |
| `port` | HTTP インターフェースのポート（HTTPS は `8443`、HTTP は `8123`） |
| `username` | ClickHouse ユーザー（デフォルトは `default`） |
| `password` | ユーザーのパスワード（任意） |
| `database` | 対象データベース（デフォルトは `default`） |
| `secure` | `true` の場合 HTTPS を使用（ClickHouse Cloud では必須） |

### 注意事項

- [ClickHouse ノード](../nodes/clickhouse-node.md) は公式の `clickhouse-connect` HTTP クライアントを使用し、フィルタおよび値のバインディングをパラメータ化します。
- `update` と `remove` は `ALTER TABLE ... UPDATE` および `DELETE FROM` にマッピングされます。これらは ClickHouse の非同期 mutation であり、いずれもフィルタが必要です。
- `upsert` は `INSERT` を実行し、キー単位のマージ動作のために `ReplacingMergeTree` テーブルを前提としています。
- credential ダイアログの **Test connection** を使用して、到達可能性を確認してください。

### 使用元

- [ClickHouse ノード](../nodes/clickhouse-node.md)

## Notion

Notion credential は、internal integration token または public-integration OAuth 接続のいずれかをサポートします。OAuth を使用すると、各ユーザーが手動で token をコピーすることなく、Heym から Notion workspace を承認できます。

### 必須フィールド

| モード | フィールド | 説明 |
|------|-------|-------------|
| Internal token | `api_token` | Internal integration token（`ntn_...`） |
| OAuth | `client_id` | Notion public integration の Client ID |
| OAuth | `client_secret` | Notion public integration の Client Secret |

OAuth callback は `access_token`、`auth_mode`、`workspace_id`、`workspace_name`、`bot_id` を自動的に保存します。OAuth が完了すると、以前の internal `api_token` は削除されます。Notion に以下の redirect URI を登録してください:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`。

### OAuth セットアップフロー

1. credential ダイアログで **OAuth** を選択し、名前、Client ID、Client Secret を入力します。
2. **Connect** をクリックし、Notion のポップアップで workspace を承認します。
   - **新規** credential の場合、**Connect** をクリックした時点で Heym が credential レコードを作成します。
   - ポップアップで承認を完了し、**Save** をクリックして credentials 一覧に戻ります。
3. 接続済みの credential は一覧に `connected (Workspace Name)` と表示されます。承認が完了していない保留中の OAuth credential は `Not connected` と表示されます。

credential ダイアログの **Test Connection** を使用して、internal token または完了した OAuth 承認のいずれかを検証してください。編集時に token フィールドを空のままにすると、保存済みの internal token が保持されます。

internal token と OAuth access token の両方は、Notion bearer token を必要とするカスタム [HTTP](../nodes/http-node.md) 呼び出しのために `$credentials.CredentialName` 経由で利用できます。
### 注記

- 内部統合では、関連するページ、データベース、データソースを共有する必要があります。
- OAuth ユーザーは、Notion の認可時にワークスペース／ページを選択します。
- OAuth アプリケーションの認証情報は Notion credential 内で暗号化されます。コールバックはサーバー側で
  それらを再読み込みします。シークレットは OAuth state に埋め込まれません。
- 接続済みの OAuth credential にはワークスペース名が表示されます。認可が完了するまでの保留中の OAuth credential には
  `Not connected` と表示されます。
- **本番環境:** バックエンドの **`FRONTEND_URL`** を公開ブラウザ URL（スキーム + ホスト、末尾スラッシュなし）に設定してください。
  Notion のリダイレクト URI は完全に一致する必要があります：
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`。
- ノードは API バージョン `2026-03-11` および現在の `data_source` 用語を使用します。旧来の `archived`、`after`、
  またはデータベースクエリの例からの移行ガイダンスについては、
  [Notion ノード](../nodes/notion-node.md#api-version-notes)の記事をご参照ください。
- オブジェクト値 `database` を持つ旧来の検索フィルターは `data_source` に正規化されます。

### 使用元

- [Notion ノード](../nodes/notion-node.md)

---

## SMTP（メール）

SMTP credential は、送信メールを送信するためのメールサーバー接続情報を保存します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `host` | SMTP サーバーのホスト名（例：`smtp.gmail.com`） |
| `port` | SMTP ポート（通常、STARTTLS には `587`、SSL には `465`） |
| `email` | SMTP サーバーがサインインに使用するユーザー名。`from` が空の場合は表示上の送信者にもなります |
| `password` | SMTP パスワードまたはアプリパスワード |

### オプションフィールド

| フィールド | 説明 |
|-------|-------------|
| `from` (`smtp_from`) | 表示される送信元（From）アドレス。`email` として送信する場合は空欄にします。サーバーは引き続き `email` としてサインインするため、そのアカウントにはこのアドレスとしての送信権限が必要です（Gmail の場合は確認済みの **名前を付けてメールを送信** エイリアス）。 |

### 一般的な SMTP プロバイダー

| プロバイダー | ホスト | ポート | 注記 |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | [アプリパスワード](https://support.google.com/accounts/answer/185833)が必要です（2 段階認証を有効にする必要があります） |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Microsoft アカウントの認証情報を使用してください |
| Mailgun | `smtp.mailgun.org` | `587` | ドメイン設定の Mailgun SMTP 認証情報を使用してください |
| SendGrid | `smtp.sendgrid.net` | `587` | ユーザー名に `apikey`、パスワードに API キーを使用してください |
| カスタム / セルフホスト | お使いのドメイン | `587` / `465` | Postfix、Exim など |

### 注記

- Gmail では、2 段階認証プロセスが有効な場合、通常のパスワードの代わりに **アプリパスワード** が必要です。
- ポート `587` は STARTTLS を使用します（平文で開始し、TLS にアップグレードします）。ポート `465` は暗黙的 TLS を使用します（最初から SSL）。

### 使用元

- [Send Email ノード](../nodes/send-email-node.md)

---

## IMAP（受信メール）

IMAP credential は、[IMAP Trigger ノード](../nodes/imap-trigger-node.md)で受信トレイを監視するための接続情報を保存します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `imap_host` | IMAP サーバーのホスト名（例：`imap.gmail.com`） |
| `imap_port` | IMAP ポート（ほとんどのプロバイダーでは SSL/TLS に `993`） |
| `imap_username` | メールボックスのユーザー名または完全なメールアドレス |
| `imap_password` | パスワードまたはプロバイダー固有のアプリパスワード |

### オプションフィールド

| フィールド | 説明 |
|-------|-------------|
| `imap_mailbox` | 監視するメールボックスフォルダー（デフォルト：`INBOX`） |
| `imap_use_ssl` | SSL/TLS を有効化（推奨、デフォルト：`true`） |

### 注記

- IMAP trigger は、最初のポーリング時に現在のメールボックスをベースラインとして記録し、その後は新しいメールのみを処理します。
- Gmail、Microsoft 365、その他のホスト型プロバイダーでは、多くの場合 **アプリパスワード** または同様の IMAP 専用シークレットが必要です。
- 添付ファイルの内容は workflow payload にダウンロードされません。Heym は添付ファイルのメタデータのみを公開します。

### 使用元

- [IMAP Trigger ノード](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md)（workflow trigger としての IMAP）

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) はオープンソースのメッセージブローカーです。RabbitMQ credential は、キューおよび exchange への publish と consume のための接続情報を保存します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `rabbitmq_host` | AMQP 接続 URL（例：`amqp://localhost:5672`） |
| `rabbitmq_username` | RabbitMQ ユーザー名（デフォルト：`guest`） |
| `rabbitmq_password` | RabbitMQ パスワード（デフォルト：`guest`） |

### 仮想ホスト

特定の仮想ホストに接続するには、`rabbitmq_host` URL にそれを含めます：

```
amqp://username:password@hostname:5672/vhost
```

デフォルトの vhost を使用する場合、パス `/` は省略できます。

### 遅延メッセージプラグイン

[RabbitMQ ノード](../nodes/rabbitmq-node.md)は **rabbitmq_delayed_message_exchange** プラグインをサポートしています。このプラグインが RabbitMQ サーバーで有効になっている場合、ノードの `rabbitmqDelayMs` フィールドを使用して、送信メッセージに遅延（ミリ秒単位）を設定できます。

ノードは、publish されたメッセージに `x-delay` ヘッダーを設定します。遅延を有効にするには、exchange タイプが `x-delayed-message` である必要があります。

セルフホストの RabbitMQ インスタンスでプラグインを有効にするには：

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

プラグインがインストールされていない場合、`x-delay` ヘッダーは無視され、メッセージは即座に配信されます。

### 使用元

- [RabbitMQ ノード](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md)（workflow trigger としての RabbitMQ）

---

## Amazon S3

Amazon S3 credential は、Heym を [Amazon S3](https://aws.amazon.com/s3/) に接続します。[Amazon S3 ノード](../nodes/amazon-s3-node.md)と併用して、バケットとフォルダーの管理、オブジェクトのアップロードとダウンロード、キーのコピー、および workflow からのオブジェクトの一覧表示や削除を行えます。
### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `aws_access_key_id` | AWS IAM アクセスキー ID |
| `aws_secret_access_key` | アクセスキー ID とペアになるシークレットアクセスキー |
| `aws_region` | バケットが存在する AWS リージョン（例：`us-east-1`） |

### オプションフィールド

| フィールド | 説明 |
|-------|-------------|
| `aws_session_token` | AWS STS 認証情報を使用する場合の一時セッション Token |

### 備考

- この認証情報は boto3 を介した標準の AWS SigV4 認証を使用します。
- アップロード操作は現在 UTF-8 テキストコンテンツを送信します。ダウンロードはテキスト、またはバイナリオブジェクトの場合は base64 を返すことができます。

### 使用元

- [Amazon S3 ノード](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) は、キャッシュや高速データアクセスに使用されるインメモリのキーバリューストアです。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `host` | Redis サーバーのホスト名または IP（例：`localhost`） |
| `port` | Redis ポート（デフォルト：`6379`） |
| `password` | Redis パスワード（未設定の場合は空のままにします） |

### 使用元

- [Redis ノード](../nodes/redis-node.md)

---

## Slack

Slack 認証情報は、Slack チャンネルにメッセージを投稿するための **Incoming Webhook URL** を保存します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL（Slack アプリの設定から取得） |

### 備考

- [api.slack.com/apps](https://api.slack.com/apps) → 対象のアプリ → **Incoming Webhooks** で Incoming Webhook を作成します。
- 各 Webhook は特定のチャンネルにスコープされます。異なるチャンネル用に複数の認証情報を作成してください。

### 使用元

- [Slack ノード](../nodes/slack-node.md)

---

## Telegram

Telegram 認証情報は、ボットベースの Workflow 用に **Bot Token** と任意の **Webhook Secret Token** を保存します。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `bot_token` | BotFather から取得した Telegram Bot API Token |

### オプションフィールド

| フィールド | 説明 |
|-------|-------------|
| `secret_token` | 受信 Webhook 時に `x-telegram-bot-api-secret-token` と照合される共有シークレット |

### 備考

- [Telegram Trigger](../nodes/telegram-trigger-node.md) と [Telegram](../nodes/telegram-node.md) の両方で同じ認証情報を使用します。
- Telegram Trigger ノードのパネルに表示される URL を使用して、Telegram の `setWebhook` API で Webhook を手動登録します。
- Telegram ノードの `chatId` には、リテラル ID または `$telegramEvent.message.chat.id` のような式を指定できます。

### 使用元

- [Telegram Trigger ノード](../nodes/telegram-trigger-node.md)
- [Telegram ノード](../nodes/telegram-node.md)

---

## HTTP Auth（Bearer および Header）

これらの認証情報は、[HTTP ノード](../nodes/http-node.md) が送信リクエストを認証するために使用されます。

### Bearer

HTTP リクエストに `Authorization: Bearer <token>` ヘッダーを付加します。

| フィールド | 説明 |
|-------|-------------|
| `token` | Bearer Token の値 |

### Header

HTTP リクエストにカスタムヘッダーを付加します。

| フィールド | 説明 |
|-------|-------------|
| `header_key` | ヘッダー名（例：`X-Api-Key`） |
| `header_value` | ヘッダー値 |

どちらのタイプも、式を受け付ける任意のノードで動的に使用するために、[Expression DSL](./expression-dsl.md) 内で `$credentials.CredentialName` を介して参照できます。

### 使用元

- [HTTP ノード](../nodes/http-node.md)

---

## LLM プロバイダー（OpenAI、Google、Custom、Cohere）

これらの認証情報は AI ノードを動作させます。

| タイプ | 説明 |
|------|-------------|
| **OpenAI** | GPT モデルおよび OpenAI 埋め込み用の API キー |
| **Google** | Gemini モデル用の API キー |
| **Custom** | OpenAI 互換 Endpoint（Ollama、vLLM、LM Studio など）用の API キー + ベース URL |
| **Cohere** | Cohere 埋め込み用の API キー |

### OpenAI Prompt キャッシュ

OpenAI はシステム Prompt の静的な（変化しない）プレフィックスを自動的にキャッシュします。追加の設定は不要です。同じシステム Prompt プレフィックスを共有する Workflow の反復実行は、キャッシュされた Token の料金体系の恩恵を受け、コストとレイテンシの両方が削減されます。これは、長く固定された指示があり、実行ごとにユーザーメッセージのみが変わる場合に特に有用です。キャッシュヒット率と Token の節約量は、[Traces タブ](../tabs/traces-tab.md) または OpenAI の使用状況ダッシュボードで監視し、最大限のキャッシュ再利用のために Prompt 構造を最適化してください。

### 使用元

- [LLM ノード](../nodes/llm-node.md)
- [Agent ノード](../nodes/agent-node.md)
- [RAG ノード](../nodes/rag-node.md)（Qdrant 認証情報を介した OpenAI 埋め込み）

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) は、Cloudflare や類似のボット対策チャレンジを回避するためのプロキシサーバーです。

### 必須フィールド

| フィールド | 説明 |
|-------|-------------|
| `flaresolverr_url` | FlareSolverr インスタンスの URL（例：`http://localhost:8191`） |

ここではループバックアドレスおよびプライベートアドレスがサポートされているため、ドキュメントどおりに Heym の隣で FlareSolverr を実行できます。URL はリンクローカルアドレスやクラウドメタデータアドレスに解決されてはなりません。プライベートアドレスが許可されているため、このフィールドを別の内部サービスに向けることもでき、応答はノード出力として返されます。サインイン済みのユーザーであれば誰でもこの認証情報を作成できるため、境界となるのは Workflow を作成できる権限とネットワークルールであり、認証情報の共有ではありません。[Egress Safety](../nodes/crawler-node.md#egress-safety) を参照してください。

### 使用元

- [Crawler ノード](../nodes/crawler-node.md)

---
## 関連項目

- [Credentials](./credentials.md) – Credentials の概要と、ノードによる使用方法
- [Credentials タブ](../tabs/credentials-tab.md) – Credentials の追加と管理
- [Credentials の共有](./credentials-sharing.md) – ユーザーおよびチームとの Credentials の共有
- [セキュリティ](./security.md) – 保存時の暗号化、アクセス制御
- [Expression DSL](./expression-dsl.md) – 動的アクセスのための `$credentials` 構文

---

## Model Router（Auto Model）

各リクエストを、既存のモデル Credentials のいずれかにルーティングします。選択には decision model を使用します。参照のみを保存し、独自のキーは保持しません。

### 必須フィールド

- `decision_credential_id` – アクセス可能な **Decision Model** Credential。
- `decision_model` – ルーティング呼び出しを行うモデル。例：`jev-latest`。
- `options` – 少なくとも 2 つのエントリ。各エントリには名前、所有する OpenAI/Google/Custom Credentials のいずれか、その上のモデル、およびいつ優先されるべきかを示す criteria が含まれます。

### オプションフィールド

- `routing_instructions` – オプション全体をどのように重み付けするか。
- 1 つのオプションを、ルーティング失敗時に使用されるフォールバックとしてマークできます。

### 注意事項

オプション名は decision model が選択する際の対象となるため、それぞれ異なる名前にする必要があります。オプションは別の Model Router を指すことはできません。
