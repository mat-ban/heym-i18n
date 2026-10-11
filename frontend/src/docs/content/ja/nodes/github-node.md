# GitHub

**GitHub** ノードは、Workflow にネイティブな GitHub REST 操作を追加します。これは、n8n などのツールでご存知かもしれない複数操作対応の GitHub ノードに似ています。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | GitHub |
| 出力 | `$nodeLabel.*` |

## サポートされる操作

このノードは現在 40 のアクションを提供しています：

| リソース | アクション |
|----------|---------|
| Repository | `Get Repository`、`Get Repository License`、`Get Repository Profile`、`Get Repository Issues`、`Get Repository Pull Requests`、`List Popular Paths for Repository`、`List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`、`List User Repositories`、`Get User Repositories`、`Get User Issues`、`Invite User` |
| Issue | `Create Issue`、`Get Issue`、`List Issues`、`Edit Issue`、`Lock Issue`、`Create Comment` |
| Pull request | `Create Pull Request`、`List Pull Requests` |
| Review | `Create Review`、`Get Review`、`List Reviews`、`Update Review` |
| Release | `Create Release`、`Get Release`、`List Releases`、`Update Release`、`Delete Release` |
| Workflow | `List Workflows`、`Get Workflow`、`Enable Workflow`、`Disable Workflow`、`Get Workflow Usage`、`Dispatch Workflow`、`Dispatch Workflow and Wait` |
| File | `Get File`、`List Files`、`Create or Update File`、`Delete File` |

## Credential

[Credentials Tab](../tabs/credentials-tab.md) で **GitHub** Credential を作成し、以下を設定します：

- 個人アクセストークン
- GitHub Enterprise Server 用の任意の完全な REST API ベース URL

GitHub.com の場合はベース URL を空のままにしてください。きめ細かい権限の PAT を推奨します。

GitHub Enterprise Server の場合は、`/api/v3` を含む完全な REST API Endpoint を入力してください。例えば
`https://github.example.com/api/v3` のように指定します。Web UI のルートのみ
（`https://github.example.com`）を入力しないでください。

GitHub Enterprise Server を使用していて、後から Credential を編集して Token をローテーションする場合、
`base_url` を空のままにすると既存の Enterprise Endpoint が保持されます。その Endpoint を変更したい
場合にのみ、新しい URL を入力してください。

## 共通フィールド

ほとんどの操作では以下を使用します：

- **Owner** – リポジトリの所有者、組織名、またはユーザー名
- **Repository** – リポジトリ名

`List Organization Repositories` は **Owner**（組織名）のみを必要とし、リポジトリフィールドは使用しません。

`List User Repositories` は **Owner**（ユーザー名）のみを必要とし、リポジトリフィールドは使用しません。

`Get User Repositories` は n8n の User → Get Repositories アクションを踏襲しています。`Get User Issues` は
デフォルトで認証済み GitHub ユーザーにアサインされた Issue を返します。**Mentioned Filter** に
空でない値を設定すると、代わりに認証済みユーザーに言及している Issue を返します。また、
state、labels、updated-since、sort、direction、per-page フィルターもサポートしています。`Invite User` は
組織とメールアドレスを必要とし、Owner や Repository は使用しません。

## Repository

Repository 操作には、メタデータ、検出されたライセンス内容、コミュニティヘルスプロファイル、および
トラフィックインサイトが含まれます。`List Popular Paths for Repository` と
`List Top Referrers for Repository` は、過去 14 日間の GitHub のトップトラフィックエントリを返し、
リポジトリの管理 push アクセス権限が必要です。

`List Issues` は、任意の assignee、creator、mentioned user、カンマ区切りの labels、
updated-since タイムスタンプ、sort、direction フィルターをサポートしています。`List Pull Requests` は
state、sort、direction、per-page の制御をサポートしています。

`Get Repository Issues` と `Get Repository Pull Requests` は、n8n 互換の明示的なリポジトリアクション名の下で、
それぞれの List 版と同じ API を公開しています。

### Get Repository メタデータ

`Get Repository` は GitHub の完全なレスポンスを `$github.repository` に格納し、さらに
`$github.full_name`、`$github.default_branch`、`$github.private`、`$github.url` を公開します。

リポジトリの Payload には一般に以下が含まれます：

- 識別情報と所有権：ID、名前、フルネーム、説明、所有者、および可視性
- リポジトリの状態：private、fork、archived、disabled、およびデフォルトブランチ
- URL：GitHub ページ、API、clone、SSH、および Git URL
- アクティビティとサイズ：作成、更新、push のタイムスタンプ、サイズ、stars、watchers、forks、subscribers、および open issues
- 機能：issues、projects、wiki、Pages、discussions、topics、language、および homepage
- ライセンス、マージ設定、呼び出し元の権限、セキュリティ設定、および利用可能な場合は fork の parent/source メタデータ

一部の管理、権限、マージ、およびセキュリティフィールドは、Credential のリポジトリ
権限に依存します。

例：

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue 操作は、title/body フィールドと、labels および assignees 用の任意の JSON 配列フィールドをサポートしています。

`List Issues` はリポジトリの Issue のみを返します。Pull Request は除外されます。PR の結果には `List Pull Requests` を使用してください。

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue のフィールドセマンティクス

`Edit Issue` では、明示的に設定したフィールドのみが GitHub に送信されます：

- **State** – `Don't change`、`Open`、または `Closed` を選択します。未設定のままにすると現在の state が保持されます。
- **State Reason** – 任意で `Completed`、`Not Planned`、`Duplicate`、または `Reopened` を設定します。
- **Title / Body** – 空白のままにすると現在の値が保持されます。
- **Labels / Assignees** – フィールドを空のままにすると現在の値が保持されます。`[]` を使用するとすべての labels または assignees をクリアします。`["bug"]` のような JSON 配列を使用すると置き換えます。

`Edit Issue` は実行時に少なくとも 1 つの変更対象フィールドを必要とします。Issue 番号のみを指定した場合、
GitHub API レイヤーからの検証エラーにより実行が失敗します。
## Issue のロック

`Lock Issue` は任意の **Lock reason** を受け付けます。指定する場合は、GitHub がサポートする以下の値のいずれかである必要があります：

- `off-topic`
- `too heated`
- `resolved`
- `spam`

特定の理由を付けずにロックする場合は、reason を空のままにしてください。

## Pull Request

PR の作成には以下が必要です：

- Title
- Head branch
- Base branch
- 任意の body
- 任意の draft モード

## Pull Request レビュー

レビュー操作は GitHub の pull request review API に対応しています：

| 操作 | 必須フィールド | 任意フィールド |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number、event | Body、commit ID |
| `Get Review` | Pull request number、review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number、review ID、body | — |

`Create Review` は `Approve`、`Request Changes`、`Comment`、`Pending` をサポートします。
`Request Changes` と `Comment` では body が必須です。Commit ID が空の場合、GitHub は
pull request の最新コミットをレビューします。

## リリース

| 操作 | 実行時の必須フィールド | 一般的な任意フィールド |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name（title）、body、target branch、draft、prerelease |
| `Update Release` | Release ID | Tag name、release name、body、target branch、draft、prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` では `draft` / `prerelease` を `true` または `false` に明示的に設定できます。

## Workflow

Workflow 操作は以下をサポートします：

- リポジトリの workflow の一覧取得
- 数値 ID または workflow ファイル名による workflow の取得
- workflow の有効化または無効化
- runner のオペレーティングシステム別の課金対象 workflow 使用量の読み取り
- ref または branch と任意の JSON inputs オブジェクトを指定した workflow のディスパッチ

GitHub は `Get Workflow Usage` エンドポイントの廃止を進めています。この操作を使用している
Workflow は、GitHub がエンドポイントを削除した際に移行が必要になる場合があります。

`Dispatch Workflow` は GitHub の両方のレスポンス形式を受け付けます：従来の `204 No Content` と、
`workflow_run_id`、`run_url`、`html_url` を含む新しい `200` レスポンスです。

`Dispatch Workflow and Wait` は workflow をディスパッチし、その run のステータスが
`completed` になるまでポーリングします。タイムアウトとポーリング間隔は秒単位で設定します。Heym は
GitHub が新しい `200` レスポンスを返した場合に `workflow_run_id` を使用します。従来の `204 No
Content` レスポンスの場合は、Heym が選択された workflow と ref に対して新しく作成された
`workflow_dispatch` run を検出し、その run を待機します。

## ファイルコンテンツ

`Get File` は GitHub の contents API を通じてリポジトリのファイルを読み取り、利用可能な場合はテキストコンテンツをデコードします。バイナリファイルや非 UTF-8 コンテンツは、デコードされた `content` フィールドなしでメタデータを返す場合があります。

`List Files` は、指定されたフォルダパスと任意の ref に対して、リポジトリの contents API からディレクトリエントリを返します。リポジトリのルートを一覧表示するには、**Directory Path** を空のままにしてください。

`Create or Update File` は、以下を使用してテキストコンテンツをリポジトリのパスに書き込みます：

- File path
- Commit message
- File content
- 任意の branch

`Delete File` は、commit message と任意の branch を使用してリポジトリのパスを削除します。ファイルが存在する場合、Heym は削除前に現在の SHA を自動的に取得します。

ファイルが既に存在する場合、Heym は更新前に現在の SHA を自動的に取得します。

## ページネーション

`List Issues`、`Get Repository Issues`、`Get User Issues`、`List Pull Requests`、
`Get Repository Pull Requests`、`List Reviews`、`List Releases`、`List Workflows`、
`List Organization Repositories`、`List User Repositories`、`Get User Repositories` は
**Per Page**（1〜100）をサポートします。Heym は結果を 1 ページ分のみリクエストします。同じ操作で
追加ページを取得するための `page` フィールドはありません。

## 出力

正確な形状は選択した操作によって異なります。一般的なフィールドには以下が含まれます：

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

`github` はご自身のノードラベルに置き換えてください。

## 注意事項

- Labels と assignees は、指定する場合は有効な JSON 配列である必要があります。
- Workflow dispatch の inputs は、指定する場合は有効な JSON オブジェクトである必要があります。
- `Edit Issue` は、明示的に設定した場合にのみ `state` を使用します。現在の issue の状態を維持するには未設定のままにしてください。
- GitHub API の権限は、付与する token スコープまたは fine-grained リポジトリ権限によって異なります。

## 関連項目

- [Credentials Tab](../tabs/credentials-tab.md) – GitHub 認証情報の追加と管理
- [Third-Party Integrations](../reference/integrations.md) – GitHub 認証情報の設定と Enterprise の `base_url`
- [Agent Node](./agent-node.md) – `@modelcontextprotocol/server-github` での GitHub 認証情報の使用
- [Node Types](../reference/node-types.md) – ノードの完全なカタログ
