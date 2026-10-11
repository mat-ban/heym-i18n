# Linear

**Linear** ノードは、Workflow を Linear GraphQL API に接続し、Issue およびワークスペースの自動化を実現します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | Linear personal API key または OAuth2 |
| 出力 | `$nodeLabel.*` |

## Credential

[Credentials Tab](../tabs/credentials-tab.md) で **Linear** Credential を作成します。次のいずれかの
認証モードを選択してください。

**Personal API key**

1. Linear で **Settings → Security & Access → Personal API keys** を開きます。
2. 自動化対象のワークスペースにアクセスできるキーを作成します。
3. Heym で新しい Linear Credential にキーを貼り付け、**Test Connection** で検証します。

**OAuth2**

1. Linear OAuth アプリケーションを作成します。
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback` をリダイレクト URI として登録します。
3. Heym で **OAuth2** を選択し、Client ID と Client Secret を入力してから **Connect** をクリックします。

Personal API key および OAuth Token は、それを作成または認可したユーザーとして動作します。

## 操作

| 操作 | 必須フィールド | 出力 |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit、任意で After Cursor | `teams`、`count`、`pageInfo` |
| List Projects | Limit、任意で After Cursor | `projects`、`count`、`pageInfo` |
| List Issues | Limit、任意で Team ID、Project ID、After Cursor | `issues`、`count`、`pageInfo` |
| List Workflow States | Team ID | `states`、`count` |
| List Team Members | Team ID、Limit、任意で After Cursor | `members`、`count`、`pageInfo` |
| Get Issue | Issue ID または `ENG-123` のような識別子 | `issue`、`identifier`、`url` |
| Create Issue | Team ID、Title | `issue`、`identifier`、`url` |
| Update Issue | Issue ID または識別子、および少なくとも 1 つの変更フィールド | `issue`、`identifier`、`url` |
| Delete Issue | Issue ID または識別子 | `deleted` |
| Add Issue Link | Issue ID または識別子、Link URL | `link` |
| Create Comment | Issue ID または識別子、Comment Body | `comment` |
| List Comments | Issue ID または識別子、Limit、任意で After Cursor | `comments`、`count`、`pageInfo` |
| Update Comment | Comment ID、Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`、`entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

すべてのテキストフィールドは [expressions](../reference/expression-dsl.md) をサポートしています。

## Issue フィールド

- **Team ID** および **Project ID** は Linear UUID です。List Teams または List Projects を使用して取得してください。
- **State ID** は、Issue の作成または更新時に使用される workflow-state UUID です。List Workflow States を使用して取得してください。
- **Assignee ID** は Linear ユーザー UUID です。List Team Members を使用して取得してください。
- **Priority** は `0` から `4` を受け付けます。それぞれ no priority、urgent、high、normal、low に対応します。
- 任意の更新フィールドを空のままにすると、現在の値が保持されます。
- 更新フィールドを `null` に設定すると、description、project、assignee、または state がクリアされます。
- **Link URL** は、Issue に外部添付リンクを追加します。
- **Comment ID** は、既存のコメントの Linear UUID です。List Comments を使用して取得してください。
- **Parent Comment ID** は、コメント作成時に既存の Linear コメントへ返信するために使用します。

## ページネーション

List 操作は、1 ページのみを返すか、すべてのページを自動的に取得するかを選択できます。

- **Return All** をオフのままにすると、`Limit` と `After Cursor` を手動で使用します。
- **Return All** をオンにすると、Linear のカーソルをサーバー側で追跡し、最大 10,000 件の結果を取得します。

ページングされた結果は `pageInfo.hasNextPage` および `pageInfo.endCursor` を返します。**Return All** がオフの場合、
次のノード実行時にカーソルを **After Cursor** に渡すことで、次のページを取得できます。

## 例

上流の入力から Issue を作成する：

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

作成した Issue にコメントを追加する：

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: 任意。別のコメントに返信する場合に指定します。

コメントスレッドを解決する：

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Issue に外部リンクを追加する：

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

チームメンバーをページングする：

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `hasNextPage` が true の場合、次回実行時に `$listTeamMembers.pageInfo.endCursor` を指定します

Issue を更新する前に workflow state ID を取得する：

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- その後、`$listStates.states[0].id` を **Update Issue** の **State ID** として使用します

## 出力

すべての成功した操作は次を設定します。

- `$linear.success`
- `$linear.operation`

List 操作はさらに `count` を公開し、該当する場合は `pageInfo` も公開します。Issue 操作は
完全な Linear issue Payload と、`identifier` や `url` などの便利なフィールドを公開します。
Comment のミューテーションは完全な `comment` Payload を公開しますが、Delete Comment のみは
`deleted` と `entityId` を公開します。

## 関連

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
