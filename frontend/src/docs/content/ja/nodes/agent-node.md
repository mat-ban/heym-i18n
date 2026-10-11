# Agent ノード

**AI Agent** ノードは、ツール呼び出し機能を備えた LLM ノードです。Python ツールの実行、接続されたキャンバスノードのツールとしての呼び出し、MCP サーバーへの接続、スキルの使用、オーケストレーターとして他の Agent ノードへ委譲する動作（任意）、他の Workflow のツールとしての呼び出し、および[ヒューマンレビュー](../reference/human-in-the-loop.md)のための一時停止が可能です。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1、および HITL 有効時は任意で `review` |
| 出力内容 | `$nodeLabel.text`、`$nodeLabel.fieldName`（JSON 出力有効時）、またはレビュー待機中の保留中 HITL Payload |

## コアパラメータ

### Credential とモデル

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | 設定で登録した LLM Credential（API キー） |
| `model` | string | モデル名（例：`gpt-4o`、`gemini-2.5-flash-lite`） |
| `fallbackCredentialId` | UUID（任意） | プライマリ失敗時のフォールバック Credential |
| `fallbackModel` | string（任意） | プライマリ失敗時のフォールバックモデル |

Credential は [Credentials](../tabs/credentials-tab.md) タブで追加します。モデル一覧は選択した Credential から読み込まれます。プライマリの Credential またはモデルがエラーを返した場合、ノードは失敗する前にフォールバック Credential とモデルで自動的に再試行します。

### Prompt

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `systemInstruction` | string | AI 用のシステム Prompt。[式](../reference/expression-dsl.md)をサポートします。 |
| `userMessage` | string | ユーザーメッセージ／Prompt。デフォルト：`$input.text` |
| `jsonOutputEnabled` | boolean | 構造化 JSON 出力 |
| `jsonOutputSchema` | string | 構造化出力用の JSON Schema |
| `extraBodyEnabled` | boolean | プロバイダー固有のリクエストパラメータを送信します（デフォルト：`false`） |
| `extraBody` | string | Agent が発行するすべての API リクエストにマージされる JSON オブジェクト |

`$input.text`、`$nodeName.field`、その他の [Expression DSL](../reference/expression-dsl.md) 構文を使用できます。

### 推論モデル（o1、o3）

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `temperature` | number | 0.0～2.0（デフォルト：0.7）、標準モデル用 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 推論モデル用の推論深度 |

推論モデル（例：o1、o3）を使用する場合、UI には Temperature の代わりに **Reasoning Effort** が表示されます。標準モデルでは **Temperature** が創造性を制御します。

**JSON 出力の例：** Agent から構造化データ（例：分類、抽出）を取得する必要がある場合は、JSON 出力を有効にして Schema を指定します。Agent は Schema に一致する JSON を返し、ノード出力のフィールド名でアクセスできます。

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

下流のノードでは `$agentLabel.status`、`$agentLabel.reason` などを使用できます。[LLM ノード](../nodes/llm-node.md)の JSON 出力と同じ動作です。

## ヒューマンレビュー（HITL）

Agent が重要なアクションの前に特定のタイミングで承認を必要とする場合は、HITL を使用します。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Agent にヒューマンレビューのチェックポイントを追加します |
| `hitlSummary` | string | ヒューマンレビューが必要なタイミングを Agent に伝える承認ガイドライン |

HITL を有効にすると、Agent は `request_human_review` ツールを受け取ります。システム Prompt とこのガイドラインフィールドを使用して、どのツール呼び出し、サブ Agent、サブ Workflow、MCP アクション、スキル、または副作用に承認が必要かを説明してください。Agent は必要なときにのみこのツールを呼び出すことができ、1 回の実行で複数回呼び出すことも可能です。

公開ページでレビュアーに表示されるサマリーは、実行時に Agent のレビューリクエストから生成されます。Agent がサマリーを明示的に提供しない場合、Heym は Markdown のレビュー本文からサマリーを生成します。

MCP ツールの場合、Heym はモデルに対して、記述された HITL 指示を `always`、`once`、`never` の 3 つのスコープのいずれかとして解釈するよう要求します。つまり、「呼び出しごとに」「1 回だけ」「決して尋ねない」といった自由形式の表現は、実行時のゲーティングが適用される前に正規化されます。

各 HITL チェックポイントは、`/review/{token}` にワンタイムの公開レビューリンクを生成します。レビュアーは以下を実行できます。

- 元の Markdown レビュー本文を**承認**する
- 変更した Markdown で**編集して続行**する
- **拒否**して `text: ""` で続行する

HITL を有効にすると、ノードはキャンバス上に `review` 出力ハンドルも公開します。実行が一時停止した直後にレビュー URL とサマリーをブロードキャストしたい場合は、そのブランチを Slack、メール、その他の通知ノードに接続してください。

レビュアーが応答するまで、実行は `pending` に移行します。レビュー本文は単一の Markdown ボディで、保留中 Payload には外部ハンドオフ用の共有可能なリンクテキストも含まれます。`review` ブランチ上のノードは一時停止が作成された時点で即座に実行され、通常の出力パスは承認後のみ続行します。承認後、Heym は保存された実行スナップショットから再開し、Agent は承認されたコンテキストで処理を続行します。後続のステップでも承認が必要な場合、Agent は別の HITL チェックポイントを作成できます。Payload の形状、レビュー URL の動作、再開のセマンティクスについては、[Human-in-the-Loop](../reference/human-in-the-loop.md) を参照してください。

HITL はテキストモードの Agent 出力でのみ利用可能です。v1 では `jsonOutputEnabled` と組み合わせることはできません。
## Orchestrator モード

有効にすると、エージェントは Workflow 内の他のエージェントノードにタスクを委任できるようになります。**Orchestrator モードが無効**の場合、エージェントはキャンバス上で**エージェント→エージェント間の接続を作成できません**。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `isOrchestrator` | boolean | `true` の場合、エージェントに `call_sub_agent` ツールが付与されます |
| `subAgentLabels` | string[] | この Orchestrator が呼び出せるエージェントノードのラベル |

**サブエージェント**は、Orchestrator の Prompt を受け取るために、User Message 内で `$input.text` を使用する必要があります。

Orchestrator が 1 ターンで複数のサブエージェントを呼び出すと、それらは並列で実行されます。詳細は [Agent Architecture](../reference/agent-architecture.md) を参照してください。

## Sub-Workflows

設定すると、エージェントは他の Workflow を実行するための `call_sub_workflow` ツールを受け取ります。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | このエージェントがツールとして呼び出せる Workflow の ID |

エージェント設定の Sub-Workflows セクションで Workflow を選択します。エージェントは `workflow_id` と `inputs`（対象 Workflow の入力フィールドに対応するオブジェクト）を指定してそれらを呼び出します。最大深度：ネストされたサブ Workflow 呼び出しは 5 階層までです。

## キャンバスノードツール

サポートされている Workflow ノードをエージェントの **tools** ハンドルに接続すると、エージェントは実行時にそのノードを呼び出せるようになります。これにより、Python を書くことなく、既存のキャンバスアクションや変換処理を呼び出し可能なツールに変換できます。

キャンバスノードツールは、認証情報、静的フィールド、Workflow 固有の設定をノード UI に保持したまま、エージェントに設定済みノードの実行タイミングを判断させたい場合に便利です。

### エージェントが提供するフィールド

接続されたツールノード上のフィールドは、ボットアイコンでマークできます。マークされたフィールドは、エージェントがノードを呼び出す際に指定する必要がある必須のツールパラメータになります。マークされていないフィールドは固定され、ノード設定から読み取られます。

例：

- Slack ノードをツールとしてエージェントに接続する
- 認証情報を Slack ノード内に固定する
- `message` をエージェント提供としてマークする
- エージェントは、実行時に message のみを指定する Slack ツールを受け取る

ノードがツールとしてエージェントに接続されていない場合、ボットアイコンは非表示になり、ノードは通常の Workflow ステップとして動作します。

### 実行時の動作

エージェントがキャンバスノードツールを呼び出すと、Heym はエージェント提供の引数を一時的にそのノードのデータにマージし、ノードを実行し、ノードの出力をエージェントに返した後、元のノード設定を復元します。ツールノードは通常のスケジューリングによる通常の Workflow ステップとしては実行されず、エージェントが呼び出したときのみ実行されます。

キャンバスノードツールは、Slack、Telegram、HTTP、Send Email などの連携ノードや、[Set](./set-node.md) などのデータ整形ノードと組み合わせて使用すると便利です。Trigger ノード、制御フローノード、および終端出力マッパー（[JSON output mapper](./json-output-mapper-node.md)、[HTML output mapper](./html-output-mapper-node.md)）は、エージェントツールとして使用できません。

## Python ツール

エージェントが呼び出せるカスタムツールを定義します。各ツールには以下があります：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `name` | string | ツール名（例：`count_characters`） |
| `description` | string | LLM 向けの説明 |
| `parameters` | JSON Schema | OpenAI function-calling スキーマ（オブジェクト形式） |
| `code` | string | Python 関数コード |

**Parameters** は文字列ではなく JSON オブジェクトである必要があります：

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**ツールの例：**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox。** Python ツールは、デフォルトで堅牢化された分離 Docker コンテナ内の信頼できないコードとして実行されます（ネットワークなし、Docker ソケットなし、読み取り専用ファイルシステム、非 root）。インポートは、安全な標準ライブラリモジュールの許可リストに制限されます。設定（`HEYM_PYTHON_TOOL_SANDBOX`）については、[Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) を参照してください。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | ツール実行あたりの最大秒数（デフォルト：30） |
| `requestTimeoutSeconds` | number | タイムアウトするまでに各モデル応答を待機する最大秒数（デフォルト：60）。低速なプロバイダーやセルフホスト型プロバイダー（LiteLLM、vLLM、ローカルモデル）、および長時間のマルチステップ実行では、この値を引き上げてください。 |
## MCP 接続

[Model Context Protocol](https://modelcontextprotocol.io/) サーバーに接続し、そのツールをエージェントに公開します。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | 接続タイプ |
| `timeoutSeconds` | number | この接続のタイムアウト（デフォルト: 30） |
| `label` | string | 任意の表示名 |

**stdio**（ローカルプロセス）:

| フィールド | 説明 |
|-------|-------------|
| `command` | 実行するコマンド（例: `npx`） |
| `args` | JSON 配列（例: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`） |
| `env` | プロセスに注入される環境変数の JSON オブジェクト（例: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`） |

API キーを使用するほとんどの stdio サーバーは、コマンド引数ではなく環境変数を介して認証を行います。接続ごとに `env` を設定することで、ホスト環境に手を加えることなく、各エージェントノードが異なる資格情報を使用できます。

`env` の値は [Expression DSL](../reference/expression-dsl.md) をサポートしているため、シークレットをハードコードする代わりに Workflow の入力を資格情報として渡すことができます:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

式 `$userInput.pat` は、MCP プロセスが起動する前に、Workflow の入力データに対して実行時に解決されます。これにより、Workflow 定義に Token を埋め込むのではなく、Trigger や入力ノードから Token を受け取ることができます。

例 — ハードコードされた Token を使用する GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

例 — Workflow 入力から動的な Token を取得する GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

例 — Heym の GitHub 資格情報を使用する GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

組み込みの GitHub 資格情報は現在、PAT ベースの認証を対象としています。組織へのアクセスが必要な場合は、必要な組織／リポジトリの権限を持つ PAT を使用してください。

例 — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE**（リモートサーバー）:

| フィールド | 説明 |
|-------|-------------|
| `url` | SSE の Endpoint URL。式をサポートします（例: `$userInput.serverUrl`）。 |
| `headers` | 認証／カスタムヘッダー用の JSON オブジェクト。値は式をサポートします。 |

**Streamable HTTP**（リモートサーバー）:

| フィールド | 説明 |
|-------|-------------|
| `url` | MCP の Endpoint URL（例: `https://example.com/mcp`）。式をサポートします。 |
| `headers` | 認証／カスタムヘッダー用の JSON オブジェクト。値は式をサポートします。 |

## Skills

Skills は SKILL.md の指示に加えて、任意の Python ファイルとバンドルされたアセットで構成されます。これらはエージェントのシステムコンテキストを拡張し、Python ツールを追加できます。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `name` | string | Skill 名 |
| `content` | string | SKILL.md の内容（指示） |
| `timeoutSeconds` | number | Skill の Python 実行のタイムアウト（デフォルト: 30） |
| `driveFilesEnabled` | boolean | この Skill に対してランタイムの `heym_drive` ヘルパーを有効化します（デフォルト: false） |
| `files` | array | 任意の `{ path, content, encoding, mimeType }` エントリ（例: `.py` スクリプトや base64 として保存されたバイナリアセット） |

Skills は `.zip` または `.md` ファイルを Skills エリアにドロップすることで追加できます。
Skill カードを展開した後、その Skill に任意のファイルをドロップすると、PDF や画像などのバイナリアセットを含むバンドルファイルを添付または置換できます。
Skill カードのダウンロードボタンを使用すると、その Skill を `.zip` アーカイブとしてエクスポートし、バックアップや別の Workflow での再利用ができます。

Skill の Python コードが Heym Drive からファイルを読み取る必要がある場合にのみ、その Skill で **Drive files** を有効にしてください。有効化された Skill は、ランタイムに生成された `heym_drive.py` ヘルパーを受け取り、Drive のファイル ID または正確なファイル名を指定して `list_drive_files`、`get_drive_file`、`get_drive_file_path`、`read_drive_file`、`read_drive_text`、または `read_drive_base64` を呼び出すことができます。ファイル名の検索では、アクセス可能な最新の一致が使用されます。無効化された Skill はこのヘルパーを受け取りません。

各 Skill カードには、タイトルの下の行に 4 つのアクションがあります:

| ボタン | 説明 |
|--------|-------------|
| **Edit with AI** | Skill Builder を開き、チャットの Prompt から Skill を修正します |
| **Download** | Skill を `.zip` アーカイブとしてエクスポートします |
| **Remove** | このエージェントノードから Skill を削除します |
| **History** | [Edit History](../reference/edit-history.md) から派生した Skill の履歴を開きます |
### スキル履歴

スキル履歴は**個別には**保存されません。これは Workflow の編集履歴スナップショットから導出されます。保存された各 Workflow バージョンには、エージェントノードの `skills` 配列全体が含まれています。

履歴ダイアログからは、以下の操作が可能です：

- **プレビュー** — 過去のスナップショット（SKILL.md およびファイル一覧）を表示します
- **編集** — Workflow 全体を元に戻すことなく、スナップショットをスキルエディターに読み込みます
- **AI ファインチューン** — そのスナップショットを起点として Skill Builder を開きます
- **復元** — 過去のバージョンからこのスキルのみを復元します（他のノードはそのまま維持されます）

履歴は Workflow の編集履歴と同じ 7 日間の保持期間に従います。スキル編集後に Workflow を保存すると、新しい履歴エントリが作成されます。

スキルセクションには **AI Build** も含まれます：

- **AI Build** をクリックすると、チャット Prompt から新しいスキルを作成できます
- 既存のスキルのスパークルボタンをクリックすると、AI でそれを修正できます
- Prompt コンポーザーにファイルをドロップすると、ファインチューンコメントに添付されます。これらのファイルはバンドルされたスキルアセットとしても保存されます
- モーダルはアシスタントのテキストをストリーミングしながら、`SKILL.md` および `.py` ファイルのプレビューをリアルタイムで表示します
- **Download ZIP** は、現在のプレビューをノードに追加することなくエクスポートします
- **Save & Add** は、手動アップロードで使用されるものと同じ ZIP 解析フローを通じて、生成されたファイルを保存します

AI で編集する際、Heym はテキスト形式の `.md` および `.py` スキルファイルのみをビルダーに送信します。バイナリおよびその他の編集不可能な添付ファイルは保持され、パスメタデータとしてビルダーと共有されるため、生成された Python コードが相対ファイル参照を正しく維持できます。
右パネルで添付ファイルを選択し、AI がバンドルされたテンプレートを検査する必要がある場合は **Include this file in AI context** を有効にしてください。テキスト、PDF、DOCX ファイルは可能な場合 Prompt コンテキストに抽出されます。Heym はプラットフォームのリクエストボディ制限を超えて、Skill Builder の添付ファイルサイズに別途上限を適用することはありません。

## Extra Body

一部のプロバイダーは、標準の OpenAI 互換フィールドではカバーされないリクエストパラメータ（モデルの思考モードの無効化など）を受け付けます。ノードプロパティで **Send extra request body** にチェックを入れ、JSON オブジェクトを入力してください。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **デフォルトでは無効です。** チェックボックスがオフの場合、追加のものは何も送信されません。
- 最初のターンだけでなく、ツール呼び出しループ内の**すべての**リクエストに適用され、さらにフォールバックモデルの試行にも適用されます。別のモデルを使用する Guardrail チェックには適用されません。
- JSON **オブジェクト**である必要があります。配列、スカラー、または不正な形式のテキストは、暗黙的に破棄されるのではなく、`Invalid extra body JSON` でノードが失敗します。
- `$` 式は解析前に解決されます。これはテキスト置換であるため、解決された値に二重引用符や改行が含まれていると、無効な JSON が生成されノードが失敗します。

[LLM ノード](./llm-node.md)の Extra Body と同じフィールドおよび動作です。

## Guardrails

ノードプロパティで **Guardrails** を有効にすると、エージェントの実行前に安全でないユーザーメッセージをブロックできます。完全なリファレンスについては [Guardrails](../reference/guardrails.md) を参照してください。

## 永続メモリ（グラフ）

データベースに保存される、オプションの**エージェントノードごとの**ナレッジグラフです。有効にすると、Heym は各実行前に、記憶されたエンティティと関係の Markdown サマリーを **システム指示** に追加します（グラフが空でない場合のみ）。エージェントが**正常に**完了した後、バックグラウンドジョブが会話から新しい永続的な事実を抽出し、グラフにマージします。

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | このキャンバスノードの読み込みとバックグラウンド抽出を有効にします |

**サブエージェント**は、オーケストレーターとは別に、**独自の**グラフ（それぞれのノード ID をキーとする）を保持します。

ノード上のピンク色の **brain** コントロール（メモリがオン、またはモデル行が表示されている場合）を使用して、グラフエディターとオプションの **メモリ共有**（他の Workflow／エージェント）を開きます。完全な動作、REST パス、JSON エクスポートの詳細については、[Agent Persistent Memory](../reference/agent-persistent-memory.md) を参照してください。

## Responses API と推論の継続性

**Use Responses API** チェックボックスは、エージェントのモデル呼び出しを Chat Completions ではなく [Responses API](https://platform.openai.com/docs/api-reference/responses) 経由でルーティングします。デフォルトではオフです。

これは `gpt-5` や `o` シリーズなどの推論モデルで最も重要になります。Responses API は各ツール呼び出しとともにモデルの推論を返し、エージェントは次のターンでそれらの推論項目をフィードバックするため、モデルはツール結果ごとに推論を再導出するのではなく、マルチステップのツールループ全体で思考の連鎖を維持します。ループ全体が同じパスで実行され、[human review](#human-review-hitl) の一時停止と再開、[context compression](#context-compression)、最終回答も含まれます。

会話自体は Heym 内に保持されます。Heym は毎ターン完全な入力を送信し、推論を暗号化された blob として運ぶため、呼び出し間でプロバイダー側に何も保持されません。context compression が要約するスパン内の推論項目は、それとともに破棄されます。暗号化された blob は要約できないためです。

これは OpenAI 認証情報で動作し、またエンドポイントをサポートするゲートウェイを持つカスタム認証情報でも動作します。Google 認証情報では無効のままです。
## コンテキスト圧縮

エージェントが大規模な結果（Web スクレイピング、ドキュメント読み込み、サブ Workflow の出力など）を伴うツール反復を多数実行すると、蓄積されたメッセージ履歴がモデルのコンテキストウィンドウの上限に近づくことがあります。Heym は、コンテキストのオーバーフローを防ぐために、実行途中で会話履歴を自動的に圧縮します。

**仕組み：**

1. 各ツール反復の前に、Heym は現在の Token 数を推定します（約 4 文字 = 1 Token）。
2. 推定値がモデルのコンテキストウィンドウの **80%** を超えると、圧縮がトリガーされます。
3. メッセージ履歴は、保持されるセクションと圧縮されるセクションに分割されます：
   - **保持**：システム Prompt、最初のユーザーメッセージ、直近のユーザーメッセージ
   - **圧縮**：その間にあるすべて（アシスタントの推論ターン、ツール呼び出し、ツール結果）
4. 中間セクションは、**同じモデルと Credential** を使用して要約されます — 追加の設定は不要です。
5. 圧縮された要約は、単一のアシスタントメッセージとして中間セクションを置き換えます。

**可観測性：**

圧縮イベントは、以下の場所に `Context compressed (N messages → summary)` エントリとして表示されます：
- ライブ実行中の **Debug パネル**のツール呼び出しリスト
- **実行履歴**の実行詳細ビュー
- **Traces タブ**の `context.compression` トレースエントリ

圧縮は自動的に行われ、Agent ノードでは常に有効です。LLM ノード、Chat タブ、AI Assistant セッションには適用され**ません**。

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – エージェントが本番環境でどのように実行され、ガバナンスを維持するか
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Agent ノードごとのナレッジグラフ、オプションの共有、API、エディター
- [Agent Architecture](../reference/agent-architecture.md) – サブエージェント、オーケストレーター、スキル、MCP、ツール呼び出し
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 公開レビューページ、保留中の実行、承認／編集／拒否フロー
- [Guardrails](../reference/guardrails.md) – 安全でないコンテンツカテゴリのブロック
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [AI Assistant](../reference/ai-assistant.md) – 自然言語で Workflow を構築するためのチャット UI（Agent ノードとは異なります）
- [Expression DSL](../reference/expression-dsl.md) – Prompt 内でのデータ参照
- [Workflow Structure](../reference/workflow-structure.md) – ノード、エッジ、DSL フォーマット
- [Quick Start](../getting-started/quick-start.md) – LLM と式を使用した基本的な Workflow
- [Credentials Tab](../tabs/credentials-tab.md) – エージェント用の API キーの追加
- [MCP Tab](../tabs/mcp-tab.md) – Workflow ツール用の MCP の設定
