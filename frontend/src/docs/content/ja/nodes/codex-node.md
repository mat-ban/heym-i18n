# Codex

**Codex** ノードは、隔離された Heym ワークスペース内で GitHub リポジトリに対して OpenAI Codex CLI を実行します。テストの修正、ファイルの編集、パッチの生成、ドラフト pull request の作成といったコーディングタスク向けに設計されています。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1、加えて `question` |
| 認証情報 | Codex access token + GitHub |
| 出力 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 認証

**OpenAI Codex** 認証情報は、2 つの認証モードをサポートしています：

| モード | 説明 |
|------|-------------|
| **Sign in with ChatGPT**（推奨） | ChatGPT Plus/Pro サブスクリプションを利用する OAuth（PKCE）サインインです。そのため、実行時にトークン単位の API コストは**発生しません**。認証情報ダイアログで **Sign in with ChatGPT** をクリックし、ブラウザで認証した後、`localhost:1455` のリダイレクト URL を Heym に貼り付けます。Heym は取得した token bundle を保存し、有効期限が切れると自動的に更新します。 |
| **Access token** | ローカルの Codex ランナーのみが使用する ChatGPT/Codex の `access_token` を貼り付けます。 |

Codex 認証情報では API キーは受け付けられません。このノードはクラウド上の Codex タスクを送信するのではなく、Heym ランタイム内でリポジトリをクローンし、ChatGPT token bundle を隔離された `auth.json` に書き込み（または `CODEX_ACCESS_TOKEN` を渡し）、Codex プロセスにのみ提供します。また、token は `$credentials` に含まれないよう保持されます。

このノードは、プライベートリポジトリのクローン、作業ブランチのプッシュ、ドラフト pull request の作成のために、**GitHub** 認証情報も必要とします。

Docker デプロイメントでは、Heym は同一の Heym イメージから生成された兄弟コンテナ内で Codex を実行します（別個の GHCR イメージではありません）。そのコンテナは Codex ワークスペースボリュームのみをマウントし、Codex 自身の bubblewrap サンドボックスが namespace と新しい `/proc` を作成できるようにします。ランナーは `SYS_ADMIN`、unconfined な seccomp と AppArmor、および `systempaths=unconfined`（Docker Engine 25 以降）を追加します。最後のフラグがない場合、すべてのコマンドが起動前に `bwrap: Can't mount proc on /newroot/proc: Operation not permitted` で失敗します。

OpenAI リファレンス：

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## フィールド

| フィールド | 説明 |
|-------|-------------|
| Codex Credential | OpenAI Codex 認証情報（ChatGPT サインインまたは `access_token`） |
| GitHub Credential | リポジトリアクセスに使用する GitHub PAT 認証情報 |
| Repository URL | HTTPS の GitHub リポジトリ URL |
| Base Branch | Codex 実行前にクローンするブランチ。デフォルトは `main` |
| Model | オプションの Codex モデル（編集可能なドロップダウン。例：`gpt-5.6-sol`、`gpt-5.6-terra`、`gpt-5.6-luna`）。空の場合は Codex のデフォルトを使用 |
| Reasoning Effort | Codex の推論深度：`low`、`medium`、`high`、`xhigh`（Extra High）、`max`、または `ultra`（デフォルトは `medium`） |
| Task Prompt | Codex へのコーディングタスク。`$input.text` などの式をサポート |
| Publish Mode | 変更の配信方法（以下の表を参照） |
| Branch Name | PR/commit モードでの作業ブランチ。デフォルトは `codex/$executionId` |
| Timeout | Codex 実行の最大時間（秒） |

## Publish モード

| モード | 動作 |
|------|--------------|
| `diff_only` | ファイルをローカルで編集し、パッチと変更ファイルを返します。何もプッシュされません。 |
| `draft_pr` | ブランチにコミットしてプッシュし、ドラフト pull request を作成します。 |
| `open_pr` | ブランチにコミットしてプッシュし、レビュー可能な（ドラフトではない）pull request を作成します。 |
| `commit_push` | ブランチにコミットしてプッシュしますが、pull request は作成しません。 |
| `direct_commit` | ベースブランチに直接コミットしてプッシュします（別ブランチや PR は作成しません）。 |
| `open_or_update_pr` | エージェントの既存のオープン PR が存在する場合はそれを更新します — ブランチ名が異なっていても、ランナーは author + base で検索します — 存在しない場合は新規に作成します。再実行や「オープン PR を更新する」という指示に最適です。 |
| `update_existing_pr` | 既存のブランチ/PR にコミットを追加します。まだ存在しない場合は新規に作成します。 |
| `patch_artifact` | diff をダウンロード可能なファイルとして保存し、`patchUrl` を返します。何もプッシュされません。 |

## 出力

| キー | 説明 |
|-----|-------------|
| `status` | `completed` または `needs_input` |
| `summary` | Codex のサマリー |
| `validation` | Codex が報告した検証メモ、テスト、またはチェック |
| `diff` | ファイルが変更された場合の Git パッチ |
| `changedFiles` | 変更されたファイルパス |
| `threadId` | 利用可能な場合の Codex thread/session id |
| `branchName` | 作業ブランチ名 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr`、`update_existing_pr` モードでの PR URL |
| `pushedBranch` | commit/PR モードでプッシュされたブランチ |
| `patchUrl` | `patch_artifact` モードでの diff のダウンロードリンク |
| `usage` | 利用可能な場合に Codex CLI が報告する使用状況メタデータ |
## プルリクエストにおける UI スクリーンショット

UI/フロントエンドのタスクでは、Codex は PNG スクリーンショットを `frontend/.e2e-artifacts/` のような gitignore されたパスに保存する必要があります（ソース内には保存しません）。フロントエンドの依存関係が不足している場合、Codex は `bun install`（または npm/pnpm install）を実行し、UI をキャプチャするためだけに短命なプレビュー/`bun run dev` を起動してもかまいません。Heym はそれらの画像を単一の共有 GitHub **prerelease**（`codex-pr-assets`）に `<branch>-…` という名前のアセットとしてアップロードし、**プルリクエストが開かれる前に** PR の説明に埋め込みます。これにより、新しい PR はスクリーンショットを最初から含んだ状態で作成されます（既存の PR はその場で更新されます）。Codex はまた、意味のある `pull_request_title` を設定する必要があります（`Done.` のようなプレースホルダーは決して使用しないでください）。

Codex はタスクの途中でターンを終了することがあります（「…ではスクリーンショットを撮りましょう」）。これはスクリーンショットがキャプチャされる前に実行を確定してしまいます。これを防ぐため、runner prompt は最終結果の**前に**スクリーンショットをキャプチャすることを要求しており、それでも公開可能なサマリーなしで、または UI の変更があるのにスクリーンショットがない状態で実行が終了した場合、Heym は同じワークスペースで Codex をもう一度実行して完了させます。その後も UI の変更にスクリーンショットがない場合、PR 本文に目に見える注記が追加され、このギャップが黙認されることはありません。

## GitHub に公開されるもの

あなたの **Task Prompt** はプライベートな入力であり、PR のコンテンツではありません。公開されるのは 2 つだけです。コード変更が何を行うかを説明する `## Change Summary` と、スクリーンショットがキャプチャされた場合の `## Screenshots` セクションです。PR タイトルは変更サマリーのみから導出されます。

runner prompt はこのポリシーを明記しており、Heym は実行後にもこれを強制します。何かがコミットされたりプルリクエストとして開かれたりする前に、prompt-echo セクション（`## Task`、`## Prompt`、`## Instructions`、`## Original Request` など）と、タスクプロンプトからそのままコピーされた段落を、サマリー、PR 本文、コミットメッセージから除去します。`Both pass. Let me do a final review:` のようなステップのナレーションも、PR タイトルやコミットサブジェクトとして拒否されます。

## フォローアップの質問

Codex が不足している要件や製品上の判断を必要とする場合、`needs_input` を返します。Heym は実行を一時停止し、`question` 出力ハンドルを公開します。そのハンドルを通知ブランチ（たとえば Slack や Send Email）に接続して、レビュアーに公開フォローアップリンクを送信してください。

レビュアーが回答すると、Heym は保存されたワークスペースメタデータから同じ実行スナップショットと Codex スレッドを再開します。

## エージェントツールとして

Codex ノードは **AI Agent** ノードのツールハンドルに接続でき、エージェントがコーディングタスクを委任できるようになります。ノード上で credential、GitHub credential、リポジトリを設定し、**Task Prompt**（および任意で **Repository URL**）をエージェント提供のトグルでマークして、エージェントが呼び出し時にそれらを提供できるようにします。Codex がツールとして実行される場合、`needs_input` の結果はワークフローを一時停止する代わりにエージェントへインラインで返されるため、エージェントはリクエストを改良して Codex を再度呼び出すことができます。

## 例

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## 関連項目

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
