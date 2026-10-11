# OpenCode Go

**OpenCode Go** ノードは、[OpenCode](https://opencode.ai) CLI（Go）を、GitHub リポジトリに対して隔離された堅牢化済みの Heym コンテナ内で実行します。Codex ノードと同様に、テストの修正、ファイルの編集、パッチの生成、プルリクエストの作成といったコーディングタスク向けに設計されていますが、OpenAI Codex の代わりにプロバイダー非依存の **OpenCode Go** モデルゲートウェイを使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 認証情報 | OpenCode Go API key + GitHub |
| 出力 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 認証

**OpenCode Go** 認証情報には、OpenCode Go ゲートウェイの **API key**（[opencode.ai/go](https://opencode.ai/go) から取得）と、任意の **Gateway Base URL**（デフォルトは `https://opencode.ai/zen/go/v1`。セルフホストまたはプロキシ経由のゲートウェイを使用する場合のみ上書き）を保存します。

また、このノードはプライベートリポジトリのクローン、作業ブランチのプッシュ、プルリクエストの作成のために **GitHub** 認証情報も必要とします。GitHub token は**サンドボックスコンテナ内には一切配置されません**。git および GitHub の操作はすべて Heym がホスト側で実行するため、生成されたコードがプッシュ用の認証情報を外部に持ち出すことはできません。

## 隔離とセキュリティ

実行の隔離は、Codex ノードとまったく同様に `HEYM_OPENCODE_CLI_COMMAND` によって選択されます。

- **ローカル開発（`run.sh`）** ではデフォルトの `opencode` のままとなり、OpenCode はクローンされたワークスペースに対してホストのサブプロセスとして実行されます。Docker は不要で、追加のフラグも必要ありません。
- **Docker デプロイ（`deploy.sh` および単一の GHCR イメージ）** では `/usr/local/bin/heym-opencode-docker` に設定されます。これは、OpenCode ワークスペースの名前付きボリュームを共有する**堅牢化された使い捨ての兄弟コンテナ**内で `opencode run` を実行するラッパーです。

堅牢化されたランナーコンテナは、すべての Linux ケイパビリティを破棄し、`no-new-privileges` を設定し、読み取り専用のルートと tmpfs の `/tmp` を使用し、pid／メモリ／CPU の制限を適用します。ネットワークの外部通信は許可されます（OpenCode はモデルゲートウェイに到達する必要があるため）。**GitHub token はコンテナ内には一切配置されません**。git および GitHub の操作はすべてホスト側で実行されるため、コンテナ内に存在するのは OpenCode API key とリポジトリのファイルのみです。

OpenCode はディスク上のファイルを編集するだけであり、git／GitHub のあらゆる操作は Heym が担います。

## モデル

OpenCode Go のモデルラインナップは頻繁に変わるため、**Model** フィールドはゲートウェイのモデル一覧（`GET https://opencode.ai/zen/go/v1/models`）からリアルタイムに取得され、検索可能なドロップダウンとして表示されます。ライブ一覧が利用できない場合は、組み込みのフォールバック一覧が使用されます。モデル id は `opencode-go/<model>` の形式（例：`opencode-go/kimi-k3`、`opencode-go/deepseek-v4-pro`、`opencode-go/qwen3.7-max`）を使用します。`opencode-go` は Go ゲートウェイに対する OpenCode CLI のプロバイダー id です。ランナーのデフォルト（`opencode-go/kimi-k3`）を使用するには、このフィールドを空のままにしてください。旧形式の `opencode/<model>` で保存されたモデル id は、実行時に自動的に書き換えられます。

## フィールド

| フィールド | 説明 |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go 認証情報（ゲートウェイ API key） |
| GitHub Credential | リポジトリアクセスに使用する GitHub PAT 認証情報 |
| Repository URL | HTTPS 形式の GitHub リポジトリ URL。式をサポート |
| Base Branch | OpenCode 実行前にクローンするブランチ。デフォルトは `main` |
| Model | OpenCode Go モデル（ライブの検索可能ドロップダウン、`opencode-go/<model>`）。空の場合はランナーのデフォルトを使用 |
| Reasoning Variant | 任意。reasoning effort をサポートするモデル向けに `opencode run --variant` へマッピングされます |
| Task Prompt | OpenCode に対するコーディングタスク。`$input.text` などの式をサポート |
| Publish Mode | 変更の配信方法（以下の表を参照） |
| Branch Name | PR／commit モードで使用する作業ブランチ。デフォルトは `opencode/$executionId` |
| Timeout | OpenCode 実行の最大時間（秒） |

## Publish モード

| モード | 動作 |
|------|--------------|
| `diff_only` | ファイルをローカルで編集し、パッチと変更ファイルを返します。何もプッシュされません。 |
| `draft_pr` | ブランチにコミットしてプッシュし、ドラフトプルリクエストを作成します。 |
| `open_pr` | ブランチにコミットしてプッシュし、レビュー可能な（ドラフトではない）プルリクエストを作成します。 |
| `commit_push` | ブランチにコミットしてプッシュしますが、プルリクエストは作成しません。 |
| `direct_commit` | 別ブランチや PR を作成せず、ベースブランチへ直接コミットしてプッシュします。 |
| `open_or_update_pr` | エージェントの既存のオープン PR が存在する場合はそれを更新します（ブランチ名が異なっていても、ランナーは author + base で検出します）。存在しない場合は新規に作成します。再実行や「オープン PR を更新する」という指示に最適です。 |
| `update_existing_pr` | 既存のブランチ／PR にコミットを追加します。まだ存在しない場合は新規に作成します。 |
| `patch_artifact` | diff をダウンロード可能なファイルとして保存し、`patchUrl` を返します。何もプッシュされません。 |

## 出力

| キー | 説明 |
|-----|-------------|
| `status` | 常に `completed`（OpenCode Go ノードは入力を待って一時停止しません） |
| `summary` | OpenCode の最終メッセージ |
| `validation` | 報告された場合の検証ノート |
| `diff` | ファイルが変更された場合の git パッチ |
| `changedFiles` | 変更されたファイルパス |
| `branchName` | 作業ブランチ名 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr`、`update_existing_pr` モードにおける PR URL |
| `pushedBranch` | commit／PR モードでプッシュされたブランチ |
| `patchUrl` | `patch_artifact` モードにおける diff のダウンロードリンク |
## プルリクエストにおける UI スクリーンショット

UI/フロントエンドのタスクでは、OpenCode は PNG スクリーンショットを `frontend/.e2e-artifacts/` のような gitignore 対象のパスに保存する必要があります（ソース内には保存しません）。フロントエンドの依存関係が不足している場合、runner prompt は対象を絞ったパッケージインストール（例：`bun install`）と、UI をキャプチャするためだけの短時間のプレビュー/`bun run dev` を許可します。Heym はそれらの画像を単一の共有 GitHub **prerelease**（`opencode-pr-assets`）に `<branch>-…` という名前のアセットとしてアップロードし、**プルリクエストが開かれる前に** PR の説明に埋め込みます。これにより、新しい PR はスクリーンショットを既に含んだ状態で作成されます（既存の PR はその場で更新されます）。

OpenCode はまた、`PR_TITLE: …` の行で終了するよう指示されており、これにより Heym は `Done.` のようなプレースホルダーではなく意味のある件名でプルリクエストを開くことができます。

OpenCode はタスクの途中でターンを終了することがあり（「…ではスクリーンショットを撮りましょう」）、これによりスクリーンショットがキャプチャされる前に実行が確定してしまいます。これを防ぐため、runner prompt は最終メッセージの**前に**スクリーンショットをキャプチャすることを要求しており、それでも公開可能なサマリーなしで実行が終了した場合、または UI の変更があるのにスクリーンショットがない場合、Heym は同じワークスペースで OpenCode をもう一度実行して完了させます。それでも UI の変更にスクリーンショットがない場合、PR 本文に目に見える注記が追加され、このギャップが黙認されることはありません。

## GitHub に公開されるもの

あなたの **Task Prompt** はプライベートな入力であり、PR の内容ではありません。公開されるのは 2 つだけです。コード変更が何を行うかを説明する `## Change Summary` と、スクリーンショットがキャプチャされた場合の `## Screenshots` セクションです。PR のタイトルは変更サマリーのみから導出されます。

runner prompt はこのポリシーを明記しており、Heym は実行後にもこれを強制します。何かがコミットされたりプルリクエストとして開かれたりする前に、prompt をエコーしたセクション（`## Task`、`## Prompt`、`## Instructions`、`## Original Request` など）や、タスク prompt からそのままコピーされた段落を、サマリー、PR 本文、コミットメッセージから除去します。

Heym はエージェントのメッセージから `## Change Summary` セクションを読み取ります。最後に述べられた内容をそのまま採用するのではなく、OpenCode はステップごとにメッセージを出力し、最後のものは実行途中のコメントであることが多いためです。ステップのナレーション（`Both pass. Let me do a final review:`）も PR タイトルやコミットの件名としては拒否されます。実行が使用可能な変更サマリーを生成しない場合、プルリクエストはコメントを公開する代わりに、変更されたファイルの一覧を表示するようにフォールバックします。

## エージェントツールとして

OpenCode Go ノードは **AI Agent** ノードのツールハンドルに接続でき、エージェントがコーディングタスクを委任できるようになります。ノード上で credential、GitHub credential、リポジトリを設定し、**Task Prompt**（および任意で **Repository URL**）をエージェント提供のトグルでマークして、エージェントが呼び出し時にそれらを提供するようにします。

## 例

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## 関連

- [Codex ノード](./codex-node.md)
- [GitHub ノード](./github-node.md)
- [Agent ノード](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials の共有](../reference/credentials-sharing.md)
- [ノードタイプ](../reference/node-types.md)
