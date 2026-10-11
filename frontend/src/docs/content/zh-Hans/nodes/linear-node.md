# Linear

**Linear** 节点将工作流连接到 Linear GraphQL API，以实现 Issue 与工作区自动化。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | Linear 个人 API key 或 OAuth2 |
| 输出 | `$nodeLabel.*` |

## 凭证

在 [Credentials Tab](../tabs/credentials-tab.md) 中创建 **Linear** 凭证。选择一种
认证模式：

**个人 API key**

1. 在 Linear 中，打开 **Settings → Security & Access → Personal API keys**。
2. 创建一个可访问您想要自动化的工作区的 key。
3. 将该 key 粘贴到 Heym 中新建的 Linear 凭证中，并使用 **Test Connection** 进行验证。

**OAuth2**

1. 创建一个 Linear OAuth 应用。
2. 将 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 注册为 redirect URI。
3. 在 Heym 中，选择 **OAuth2**，输入 Client ID 和 Client Secret，然后点击 **Connect**。

个人 API key 和 OAuth token 以创建或授权它们的用户身份执行操作。

## 操作

| 操作 | 必填字段 | 输出 |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit；可选 After Cursor | `teams`、`count`、`pageInfo` |
| List Projects | Limit；可选 After Cursor | `projects`、`count`、`pageInfo` |
| List Issues | Limit；可选 Team ID、Project ID、After Cursor | `issues`、`count`、`pageInfo` |
| List Workflow States | Team ID | `states`、`count` |
| List Team Members | Team ID、Limit；可选 After Cursor | `members`、`count`、`pageInfo` |
| Get Issue | Issue ID 或标识符，例如 `ENG-123` | `issue`、`identifier`、`url` |
| Create Issue | Team ID、Title | `issue`、`identifier`、`url` |
| Update Issue | Issue ID 或标识符，以及至少一个变更字段 | `issue`、`identifier`、`url` |
| Delete Issue | Issue ID 或标识符 | `deleted` |
| Add Issue Link | Issue ID 或标识符、Link URL | `link` |
| Create Comment | Issue ID 或标识符、Comment Body | `comment` |
| List Comments | Issue ID 或标识符、Limit；可选 After Cursor | `comments`、`count`、`pageInfo` |
| Update Comment | Comment ID、Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`、`entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

所有文本字段均支持 [表达式](../reference/expression-dsl.md)。

## Issue 字段

- **Team ID** 和 **Project ID** 是 Linear UUID。使用 List Teams 或 List Projects 来获取它们。
- **State ID** 是创建或更新 Issue 时使用的 workflow-state UUID。使用 List Workflow States 来获取它。
- **Assignee ID** 是 Linear 用户 UUID。使用 List Team Members 来获取它。
- **Priority** 接受 `0` 到 `4`：无优先级、紧急、高、普通和低。
- 将可选的更新字段留空以保留其当前值。
- 将更新字段设置为 `null` 以清除 description、project、assignee 或 state。
- **Link URL** 为 Issue 添加外部附件链接。
- **Comment ID** 是现有评论的 Linear UUID。使用 List Comments 来获取它。
- **Parent Comment ID** 在创建评论时回复现有的 Linear 评论。

## 分页

List 操作既可以返回单页，也可以自动获取每一页：

- 关闭 **Return All** 以手动使用 `Limit` 和 `After Cursor`。
- 开启 **Return All** 以在服务端跟随 Linear 游标，最多 10,000 条结果。

分页结果会返回 `pageInfo.hasNextPage` 和 `pageInfo.endCursor`。当 **Return All** 关闭时，
在下一次节点运行时将游标传入 **After Cursor** 以获取下一页。

## 示例

从上游输入创建 Issue：

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

为已创建的 Issue 添加评论：

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: 可选，在回复另一条评论时使用

解决评论线程：

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

为 Issue 添加外部链接：

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

对团队成员进行分页：

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: 当 `hasNextPage` 为 true 时，在下一次运行时使用 `$listTeamMembers.pageInfo.endCursor`

在更新 Issue 之前获取 workflow state ID：

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- 然后在 **Update Issue** 中使用 `$listStates.states[0].id` 作为 **State ID**

## 输出

每个成功的操作都会设置：

- `$linear.success`
- `$linear.operation`

List 操作还会暴露 `count`，并在适用时暴露 `pageInfo`。Issue 操作会暴露
完整的 Linear issue payload 以及便捷字段，例如 `identifier` 和 `url`。
Comment 变更操作会暴露完整的 `comment` payload，但 Delete Comment 除外，它暴露
`deleted` 和 `entityId`。

## 相关

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
