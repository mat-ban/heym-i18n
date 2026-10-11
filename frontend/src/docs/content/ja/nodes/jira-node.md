# Jira

**Jira** ノードは、Workflow を Jira REST API に接続し、プロジェクト、Issue、コメント、添付ファイル、ユーザー、通知、トランジションの自動化を実現します。デフォルトの操作は **Search Issues** です。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | Jira（Cloud のメールアドレス/API Token、または Data Center のユーザー名/パスワード、ベース URL、デプロイモード、任意の REST API バージョン） |
| 出力 | `$nodeLabel.*` |

## Credential

[Credentials Tab](../tabs/credentials-tab.md) で **Jira** Credential を作成します。保存される設定キーは `email`、`api_token`、`base_url`、`deployment`、および任意の `api_version` です。Jira Cloud の場合、`email` には Atlassian アカウントのメールアドレスを、`api_token` には Atlassian API Token を保存します。Jira Data Center / Server の場合、同じキーに Basic 認証のユーザー名とパスワードを保存します。セットアップ手順については [Third-Party Integrations](../reference/integrations.md#jira) を参照してください。

| フィールド | 設定キー | 説明 |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud の Atlassian アカウントのメールアドレス、または Jira Data Center / Server のユーザー名 |
| API Token / Password | `api_token` | Jira Cloud の Atlassian API Token、または Jira Data Center / Server の Basic 認証用パスワード |
| Base URL | `base_url` | Jira サイトの URL（例：`https://your-domain.atlassian.net`） |
| Deployment | `deployment` | Jira Cloud の場合は `cloud`、Jira Data Center / Server の場合は `data_center` |
| REST API Version | `api_version` | Jira Cloud ではデフォルトで `3`。Data Center / Server では REST API v2 を使用します |

Jira Credential は、Data Center / Server のパーソナルアクセストークンおよび Bearer 認証にはまだ対応していません。

**Test Connection** を使用して、現在の Jira ユーザーに対して Credential を検証してください。

## 操作

| 操作 | 必須フィールド | 出力 |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | 任意の Limit、Start At | `projects`、`count`、`pagination` |
| Search Issues | 任意の JQL、Issue Fields、Limit、Next Page Token、Start At | `issues`、`count`、`pagination` |
| Get Issue | Issue Key または ID | `issue`、`key` |
| Create Issue | Project Key、Summary | `issue`、`key` |
| Update Issue | Issue Key または ID、および少なくとも 1 つの変更フィールド | `issue`、`key` |
| Delete Issue | Issue Key または ID | `deleted` |
| Get Issue Changelog | Issue Key または ID、任意の Limit、Start At | `changelog`、`count`、`pagination` |
| Notify Issue | Issue Key または ID、Subject、Text Body | `notified` |
| List Comments | Issue Key または ID、任意の Limit、Start At | `comments`、`count`、`pagination` |
| Create Comment | Issue Key または ID、Comment Body | `comment` |
| Get Comment | Issue Key または ID、Comment ID | `comment` |
| Update Comment | Issue Key または ID、Comment ID、Comment Body | `comment` |
| Delete Comment | Issue Key または ID、Comment ID | `deleted` |
| Add Attachment | Issue Key または ID、Filename、Base64 コンテンツ | `attachments`、`count` |
| Get Attachment | Attachment ID、任意の Include Binary | `attachment` |
| List Attachments | Issue Key または ID、任意の Limit、Start At、Include Binary | `attachments`、`count`、`pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key または ID | `transitions`、`count` |
| Transition Issue | Issue Key または ID、Transition ID | `transition`、`issue`、`key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

式を利用可能なテキストフィールドでは、`$input.text` などの [expressions](../reference/expression-dsl.md) をサポートします。`jiraIncludeBinary` は boolean トグルであり式はサポートしませんが、Jira ノードが Agent ツールハンドルに接続されている場合は、agent-provided としてマークできます。

## Issue および更新フィールド

- **Project Key** は `ENG` のような短いプロジェクトキーです。キーの確認には List Projects を使用してください。
- **Issue Key または ID** は `ENG-123` のようなキー、または数値の Issue ID を受け付けます。値の確認には Search Issues または List Projects を使用してください。
- **Transition ID** は List Transitions から取得します。各 transition オブジェクトには `id` フィールドが含まれます。
- **Comment ID** および **Attachment ID** は、List Comments、List Attachments、または以前の create/get レスポンスから取得します。
- **Account ID / Username** は、Jira Cloud の `accountId` 値、または Jira Data Center / Server のユーザー名です。Get Myself または Get User で確認できます。
- Issue の **description** およびコメントの **body** テキストは、REST API v3 では Atlassian Document Format として送信されます。Credential のデプロイモードが Data Center / Server の場合、プレーンテキストとして送信されます。v3 では、改行文字は個別の段落になります。
- **Get Issue Changelog** は、Jira Cloud のページネーション対応 changelog Endpoint を使用します。Data Center / Server の場合、展開された Issue changelog データを読み取り、設定された offset/limit を返された histories に適用します。
- **Update Issue** では、任意フィールドを空のままにすると現在の値が保持されます。
- 更新時に **Description** または **Assignee Account ID / Username** を `null` に設定すると、それらのフィールドをクリアできます。Labels は `null` でクリアできません。
- Notify Issue の **Recipients JSON** は、省略時は `{"assignee":true}` がデフォルトです。一般的なキーには `assignee`、`reporter`、`watchers`、`voters` があります（例：`{"assignee":true,"watchers":true}`）。
- **Add Attachment** は raw base64 または data URL コンテンツを受け付け、プラットフォームのファイルサイズ設定（デフォルト 99 MB）によって制限されます。
## ページネーション

- **Search Issues** は、Jira Cloud では `jiraNextPageToken` を使用したカーソルページネーションを採用します。前回の実行結果から `pagination.nextPageToken` を読み取り、次の Search Issues ノードに渡してください。
- **Search Issues** は、Jira Data Center / Server では `jiraStartAt` を使用したオフセットページネーションを採用します。`pagination.startAt`、`pagination.maxResults`、`pagination.total` を読み取り、次のページを計算してください。
- **List Projects**、**Get Issue Changelog**、**List Comments**、**List Attachments** は、`jiraLimit` と `jiraStartAt` を使用したオフセットページネーションを採用します。ページングされた結果は `pagination.startAt`、`pagination.maxResults`、`pagination.total`、`pagination.isLast` を返します。
- **List Attachments** は、まず issue からすべての添付ファイルを取得し、その後クライアント側で結果をスライスします。ページネーションフィールドは返されたページを記述しますが、大きな issue では追加の取得コストが発生する場合があります。
- **List Transitions** はページネーションを行いません。

## 主要フィールド

| フィールド | 使用する操作 | 備考 |
| --- | --- | --- |
| `credentialId` | すべての操作 | 所有する Jira 資格情報の UUID |
| `jiraOperation` | すべての操作 | デフォルトは `searchIssues` |
| `jiraProjectKey` | Create Issue | `ENG` などのプロジェクトキー |
| `jiraIssueKey` | Issue、コメント、添付ファイル、通知、トランジションの各操作 | `ENG-123` などの issue キー、または数値の issue ID |
| `jiraIssueType` | Create Issue | デフォルトは `Task` |
| `jiraIssueTypeId` | Create Issue | 任意の issue type ID。設定時は `jiraIssueType` を上書きします |
| `jiraSummary` | Create/Update Issue | Create Issue では必須 |
| `jiraDescription` | Create/Update Issue | REST API v3 では ADF、REST API v2 ではプレーンテキストとして送信されます。更新時に `null` を指定すると説明をクリアできます |
| `jiraJql` | Search Issues | デフォルトは `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | 任意の JSON 配列、またはカンマ区切りの issue フィールド。空の場合は `key`、`summary`、`status`、`assignee`、`issuetype` がデフォルトになります |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud の accountId、または Data Center / Server のユーザー名。更新時に `null` を指定すると担当者をクリアできます |
| `jiraLabels` | Create/Update Issue | JSON 配列、またはカンマ区切りのテキスト |
| `jiraCommentBody` | Create/Update Comment | REST API v3 では ADF、REST API v2 ではプレーンテキストとして送信されます |
| `jiraCommentId` | Get/Update/Delete Comment | Jira のコメント ID |
| `jiraTransitionId` | Transition Issue | List Transitions で取得してください |
| `jiraAttachmentId` | Get/Delete Attachment | Jira の添付ファイル ID |
| `jiraAttachmentFilename` | Add Attachment | アップロードするファイル名 |
| `jiraAttachmentBase64` | Add Attachment | 生の base64、または data URL コンテンツ。ファイルサイズ制限の対象となります |
| `jiraAttachmentMimeType` | Add Attachment | 任意の MIME type。空の場合はファイル名から推測されます |
| `jiraIncludeBinary` | Get/List Attachment | Boolean トグル。有効にすると `content_base64` が追加されます |
| `jiraNotifySubject` | Notify Issue | 必須の通知件名 |
| `jiraNotifyTextBody` | Notify Issue | 必須のプレーンテキスト通知本文 |
| `jiraNotifyHtmlBody` | Notify Issue | 任意の HTML 本文 |
| `jiraNotifyTo` | Notify Issue | 受信者の JSON。デフォルトは `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud の accountId、または Data Center / Server のユーザー名 |
| `jiraUserEmail` | Create User | 新規ユーザーのメールアドレス |
| `jiraUsername` | Create User | 任意の Data Center / Server ユーザー名。省略時は `jiraUserEmail` が使用されます |
| `jiraUserDisplayName` | Create User | 任意の表示名 |
| `jiraUserProducts` | Create User | JSON 配列、またはカンマ区切りのプロダクトキー。Jira Cloud のみ |
| `jiraLimit` | Search Issues、List Projects、Get Issue Changelog、List Comments、List Attachments | デフォルトは `50`。範囲は 1〜100 |
| `jiraStartAt` | Data Center / Server での Search Issues、List Projects、Get Issue Changelog、List Comments、List Attachments | オフセットページネーションの開始インデックス |
| `jiraNextPageToken` | Jira Cloud での Search Issues | 前回の検索レスポンスから取得したカーソルトークン |

## 例

上流の入力から issue を作成する：

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

issue を更新し、担当者をクリアする：

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

カスタムフィールドとカーソルページネーションを使用して issue を検索する：

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Data Center でオフセットページネーションを使用して issue を検索する：

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

利用可能なトランジションを一覧表示した後に issue をトランジションする：

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- その後、Transition ID: `$listTransitions.transitions[0].id` を指定して **Transition Issue** を実行します

issue の更新についてウォッチャーに通知する：

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## 出力

成功したすべての操作は以下を設定します：

- `$jira.success`
- `$jira.operation`

**Get Myself** は `user` を公開します。

**ページネーション付きリスト操作** は `count`、コレクションフィールド、および `pagination` を公開します：

| 操作 | コレクションキー | ページネーション形式 |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`；Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** はページネーションなしで `transitions` と `count` を公開します。

**Issue の変更および読み取り** は Jira issue の payload と、該当する場合は `key` を公開します。

**Comment** の取得／作成／更新は `comment` を公開し、削除は `deleted` を公開します。

**Transition Issue** は `transition` を `{ transitionId }` として公開し、さらに更新された `issue` と `key` を公開します。

**Attachment add** は `attachments` と `count` を公開します。**Get Attachment** は `attachment` を公開し、**List Attachments** は `attachments`、`count`、`pagination` を公開します。**Include Binary** が有効な場合、各 attachment オブジェクトに `content_base64` が含まれることがあります。削除は `deleted` を公開します。

**User** の取得／作成は `user` を公開し、削除は `deleted` を公開します。

**Notify Issue** は `notified` を公開します。

一般的なアクセスパターン：

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## 関連

- [Credentials タブ](../tabs/credentials-tab.md)
- [サードパーティ統合](../reference/integrations.md#jira)
- [ノードタイプ](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
