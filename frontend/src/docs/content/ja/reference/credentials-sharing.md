# 認証情報の共有

Credentials は他のユーザーと共有でき、そのユーザーの Workflow があなたの API キーを利用できるようになります。概要については [Credentials](./credentials.md) を、Credentials の追加と管理については [Credentials タブ](../tabs/credentials-tab.md) をご参照ください。

## LLM との Credentials の共有

LLM や AI エージェントに API キーを使用させるには、キーを credential として保存し、リクエストを実行するノードにそれをアタッチさせます。モデルは何を呼び出すかを決定し、ノードは実行時にその呼び出しを認証します。

- **シークレットは credential として保存します。** 機密値は保存時に暗号化され、作成後は UI 上でマスクされます。
- **リクエストが実行される箇所で参照します。** [LLM](../nodes/llm-node.md) ノードと [Agent](../nodes/agent-node.md) ノードはモデルの credential を ID で選択し、HTTP リクエストは認証ヘッダーに `$credentials.CredentialName` を設定します。Prompt フィールドにはシークレットを記載しないでください。Prompt 内のすべての内容はテキストとしてモデルプロバイダーに送信されます。
- **エージェントにはキーではなくツールを渡します。** Agent が HTTP ノード、MCP サーバー、またはサブ Workflow をツールとして呼び出す場合、credential はそのツール内部で適用され、モデルはツールの結果を受け取ります。
- **出力はマスクされます。** 7 文字を超える credential 値がノードの出力に現れる場合、先頭 7 文字のみが保持されるため、キーをエコーするレスポンスは結果やトレースにおいてそのプレフィックスのみを表示します。詳細は [出力のマスキング](#output-masking) をご参照ください。
- **アシスタントに credential を作成させます。** [AI アシスタント](./ai-assistant.md#credentials) または Chat タブが credential を作成する際、アシスタントは名前とタイプのみを参照し、シークレットは通常の credential フォームで入力します。
- **同じ方法で他のユーザーと共有できます。** 以下で説明するように credential をユーザーまたはチームと共有すると、そのユーザーの Workflow は自身の LLM ノードおよび Agent ノードを通じてあなたのキーを利用できます。

## 共有モデル

- **CredentialShare** – `credential_id` を `user_id` にリンクします（ペアごとに一意）
- **メールによる共有** – email を指定して `POST /api/credentials/{credential_id}/shares` を実行します。ユーザーが検索され、追加されます
- **取り消し** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Credentials は [Teams](./teams.md) と共有することもできます：

- **CredentialTeamShare** – `credential_id` を `team_id` にリンクします。チームメンバー全員がアクセス権を取得します
- **チームとの共有** – `team_id` を指定して `POST /api/credentials/{credential_id}/team-shares` を実行します
- **チーム共有の取り消し** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

共有された credentials は [Credentials タブ](../tabs/credentials-tab.md) の UI にインジケーターを表示します。

## 広範なスコープを持つ Credentials

Credential を共有すると、その credential が実行できるすべての操作が共有相手に付与されます。ほとんどのインテグレーションでは、これは 1 つのワークスペースまたは 1 つの API キーの権限にスコープされますが、一部の credentials ははるかに広範です。

> **Google Drive の credentials は Drive への完全なアクセス権を付与します。** [Google Drive](../nodes/google-drive-node.md) の credential は、ノードが既に所有しているファイルを操作できるよう `https://www.googleapis.com/auth/drive` スコープで認可されます。これをユーザーまたはチームと共有すると、共有相手の全員が Workflow を通じて **あなたの Google Drive 内のあらゆるものを読み取り、変更し、完全に削除する** ことが可能になります — あなたが想定していたファイルだけではありません。直接的に Drive への完全なアクセス権を付与してもよい相手とのみ共有してください。

露出を制限する必要がある場合は、Workflow が必要とするフォルダのみにアクセスできる専用の Google アカウントを作成し、プライマリアカウントではなくそのアカウントで credential を接続してください。

**Decision Model** の credential は endpoint と、設定されている場合は API キーを保持します。これを共有すると、共有相手は実行可能な任意の Workflow からそのキーに対して消費できます。これは LLM の credential とまったく同じです。

**Model Router** の credential は、ルーティング先のすべてを共有します。共有相手はそのオプションリスト内のすべての credential に対してリクエストを実行でき、それらのリクエストはあなたのキーを消費します。共有相手はキーを読み取ることはできず、それらの credentials は共有相手自身の credential リストには表示されません。

これは OpenAI の credential を直接共有するのと同じ付与であり、ルーターをチームにとって有用なものにする仕組みです。これを望まない場合は、個々の credentials を共有し、各ユーザーにモデルを選択してもらってください。

## Workflow のコラボレーターとの共有

Workflow を共有すると、コラボレーターはそれを開いて実行できますが、あなたの credentials を共有していない限り、それらの credentials を使用することはできません。これはメイン Workflow 内の credentials と、それが呼び出すすべてのサブ Workflow 内の credentials に適用されます。各 credential を、Workflow に招待したのと同じユーザーまたはチームと共有してください。サブ Workflow は、子 Workflow のエディターから別途共有する必要もあります。詳細は [Workflow の整理](./workflow-organization.md#sharing-workflows) をご参照ください。

## 実行コンテキスト

Workflow が実行されると、credentials は **Workflow の所有者**（実行時は現在のユーザー）に対して解決されます。`get_credentials_context()` は以下をマージします：

1. **所有している credentials** – `Credential.owner_id == user_id`
2. **ユーザー共有の credentials** – `CredentialShare.user_id == user_id` である `CredentialShare`
3. **チーム共有の credentials** – ユーザーがチームのメンバーである `CredentialTeamShare`

すべては credential 名をキーとする単一のコンテキスト dict にマージされます。

## Workflow での使用
### 名前による指定（Expression DSL）

Credentials は [Expression DSL](./expression-dsl.md) 内で `$credentials.CredentialName` として公開されます。以下の用途に使用します：

- HTTP ノード（Bearer/Header 認証）
- Telegram ノード
- Slack ノード
- カスタム HTTP リクエストにおける Notion bearer token（内部 token または OAuth アクセス token）
- 認証に式を受け付けるすべてのノード

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### ID による指定（credentialId）

一部のノードは `node.data` に `credentialId`（UUID）を保存します：

| ノードタイプ | フィールド | 説明 |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)、Image Gen | `credentialId` | LLM API credential |
| [Codex](../nodes/codex-node.md) | `credentialId`、`githubCredentialId` | Codex アクセス token credential および GitHub credential |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`、`githubCredentialId` | OpenCode Go gateway credential および GitHub credential |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud の email/API token、または Data Center の username/password credential |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion 内部 token または OAuth workspace credential |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token および任意の base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase プロジェクト URL および API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse 接続情報（host、port、auth、database） |
| [Telegram Trigger](../nodes/telegram-trigger-node.md)、[Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot credential |
| [Discord Trigger](../nodes/discord-trigger-node.md)、[Discord](../nodes/discord-node.md) | `credentialId` | Discord public key または webhook credential |
| Vector Store | `credential_id` | Qdrant または Postgres（pgvector）vector DB。Qdrant、Psql、または Custom Embeddings RAG credential 経由 |
| Evals | `credential_id`、`judge_credential_id` | モデル credential。LLM-as-Judge の judge にはモデルまたは Decision Model credential |
| [Playwright](../nodes/playwright-node.md) AI ステップ | `credentialId` | LLM/Vision モデル（AI ステップおよび [Auto Heal](../nodes/playwright-node.md#ai-auto-heal) 用） |

executor は ID によってデータベースから credential を直接ロードし、config を復号します。

## 出力のマスキング

実行後、`mask_sensitive_output()` が出力内の credential 値をマスキングします。7 文字を超える各 secret については最初の 7 文字を保持し、残りを `**` に置き換えることで、結果や trace に secret が露出しないようにします。

## 関連項目

- [Credentials タブ](../tabs/credentials-tab.md) – credential の追加と共有
- [サードパーティ統合](./integrations.md) – credential タイプごとの詳細なセットアップ
- [Teams](./teams.md) – チームとの共有
- [Expression DSL](./expression-dsl.md) – `$credentials` 構文
- [ノードタイプ](./node-types.md) – credential を使用するノード（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[Playwright](../nodes/playwright-node.md)、[HTTP](../nodes/http-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)）
- [Agent ノード](../nodes/agent-node.md) – LLM に `credentialId` を使用
