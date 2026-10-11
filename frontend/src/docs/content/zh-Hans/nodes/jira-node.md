# Jira

**Jira** 节点将工作流连接到 Jira REST API，用于项目、问题、评论、附件、用户、通知和状态转换的自动化。默认操作为 **Search Issues**。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | Jira（Cloud 邮箱/API token 或 Data Center 用户名/密码、base URL、部署模式、可选的 REST API 版本） |
| 输出 | `$nodeLabel.*` |

## 凭证

在[凭证选项卡](../tabs/credentials-tab.md)中创建 **Jira** 凭证。存储的配置键为 `email`、`api_token`、`base_url`、`deployment` 以及可选的 `api_version`。对于 Jira Cloud，`email` 存储 Atlassian 账户邮箱，`api_token` 存储 Atlassian API token。对于 Jira Data Center / Server，这些相同的键存储 Basic 认证的用户名和密码。设置步骤请参阅[第三方集成](../reference/integrations.md#jira)。

| 字段 | 配置键 | 描述 |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud 的 Atlassian 账户邮箱，或 Jira Data Center / Server 的用户名 |
| API Token / Password | `api_token` | Jira Cloud 的 Atlassian API token，或 Jira Data Center / Server 用于 Basic 认证的密码 |
| Base URL | `base_url` | Jira 站点 URL，例如 `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` 表示 Jira Cloud，`data_center` 表示 Jira Data Center / Server |
| REST API Version | `api_version` | Jira Cloud 默认为 `3`。Data Center / Server 使用 REST API v2 |

Jira 凭证目前尚不支持 Data Center / Server 的个人访问 token 和 Bearer 认证。

使用 **Test Connection** 针对当前 Jira 用户验证凭证。

## 操作

| 操作 | 必填字段 | 输出 |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | 可选的 Limit、Start At | `projects`、`count`、`pagination` |
| Search Issues | 可选的 JQL、Issue Fields、Limit、Next Page Token、Start At | `issues`、`count`、`pagination` |
| Get Issue | Issue Key 或 ID | `issue`、`key` |
| Create Issue | Project Key、Summary | `issue`、`key` |
| Update Issue | Issue Key 或 ID 以及至少一个变更字段 | `issue`、`key` |
| Delete Issue | Issue Key 或 ID | `deleted` |
| Get Issue Changelog | Issue Key 或 ID；可选的 Limit、Start At | `changelog`、`count`、`pagination` |
| Notify Issue | Issue Key 或 ID、Subject、Text Body | `notified` |
| List Comments | Issue Key 或 ID；可选的 Limit、Start At | `comments`、`count`、`pagination` |
| Create Comment | Issue Key 或 ID、Comment Body | `comment` |
| Get Comment | Issue Key 或 ID、Comment ID | `comment` |
| Update Comment | Issue Key 或 ID、Comment ID、Comment Body | `comment` |
| Delete Comment | Issue Key 或 ID、Comment ID | `deleted` |
| Add Attachment | Issue Key 或 ID、Filename、Base64 内容 | `attachments`、`count` |
| Get Attachment | Attachment ID；可选的 Include Binary | `attachment` |
| List Attachments | Issue Key 或 ID；可选的 Limit、Start At、Include Binary | `attachments`、`count`、`pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key 或 ID | `transitions`、`count` |
| Transition Issue | Issue Key 或 ID、Transition ID | `transition`、`issue`、`key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

支持表达式的文本字段支持[表达式](../reference/expression-dsl.md)，例如 `$input.text`。`jiraIncludeBinary` 是布尔开关，不支持表达式，但当 Jira 节点附加到 Agent 工具句柄时，可以标记为 agent-provided。

## 问题和更新字段

- **Project Key** 是简短的项目键，例如 `ENG`。使用 List Projects 来发现键。
- **Issue Key 或 ID** 接受诸如 `ENG-123` 的键或数字问题 ID。使用 Search Issues 或 List Projects 来发现值。
- **Transition ID** 来自 List Transitions。每个 transition 对象都包含一个 `id` 字段。
- **Comment ID** 和 **Attachment ID** 来自 List Comments、List Attachments 或先前的创建/获取响应。
- **Account ID / Username** 是 Jira Cloud 的 `accountId` 值或 Jira Data Center / Server 的用户名。Get Myself 或 Get User 可以帮助你发现它。
- 问题 **description** 和评论 **body** 文本在 REST API v3 上以 Atlassian Document Format 发送；当凭证部署为 Data Center / Server 时，它们以纯文本发送。在 v3 中，换行符会变成单独的段落。
- **Get Issue Changelog** 使用 Jira Cloud 的分页 changelog endpoint。对于 Data Center / Server，它读取展开的问题 changelog 数据，并对返回的历史记录应用配置的 offset/limit。
- 在 **Update Issue** 上，将可选字段留空以保留其当前值。
- 在更新时将 **Description** 或 **Assignee Account ID / Username** 设置为 `null` 以清除这些字段。Labels 无法用 `null` 清除。
- Notify Issue 上的 **Recipients JSON** 在省略时默认为 `{"assignee":true}`。常见键包括 `assignee`、`reporter`、`watchers` 和 `voters`（例如 `{"assignee":true,"watchers":true}`）。
- **Add Attachment** 接受原始 base64 或 data URL 内容，并受平台文件大小设置限制（默认 99 MB）。
## 分页

- **Search Issues** 在 Jira Cloud 上通过 `jiraNextPageToken` 使用游标分页。从上一次运行中读取 `pagination.nextPageToken`，并将其传入下一个 Search Issues 节点。
- **Search Issues** 在 Jira Data Center / Server 上通过 `jiraStartAt` 使用偏移分页。读取 `pagination.startAt`、`pagination.maxResults` 和 `pagination.total` 以计算下一页。
- **List Projects**、**Get Issue Changelog**、**List Comments** 和 **List Attachments** 使用带有 `jiraLimit` 和 `jiraStartAt` 的偏移分页。分页结果会返回 `pagination.startAt`、`pagination.maxResults`、`pagination.total` 和 `pagination.isLast`。
- **List Attachments** 会先获取 issue 中的所有附件，然后在客户端对结果进行切片。分页字段仍描述返回的页面，但大型 issue 可能会产生额外的获取开销。
- **List Transitions** 不支持分页。

## 关键字段

| 字段 | 使用者 | 说明 |
| --- | --- | --- |
| `credentialId` | 所有操作 | 所属 Jira 凭据 UUID |
| `jiraOperation` | 所有操作 | 默认为 `searchIssues` |
| `jiraProjectKey` | Create Issue | 项目键，例如 `ENG` |
| `jiraIssueKey` | Issue、comment、attachment、notification 和 transition 操作 | Issue 键，例如 `ENG-123` 或数字 issue ID |
| `jiraIssueType` | Create Issue | 默认为 `Task` |
| `jiraIssueTypeId` | Create Issue | 可选 issue 类型 ID；设置后会覆盖 `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Create Issue 时必填 |
| `jiraDescription` | Create/Update Issue | 在 REST API v3 上以 ADF 发送，在 REST API v2 上以纯文本发送；更新时使用 `null` 以清除描述 |
| `jiraJql` | Search Issues | 默认为 `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | 可选的 JSON 数组或以逗号分隔的 issue 字段；为空时默认为 `key`、`summary`、`status`、`assignee` 和 `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId 或 Data Center / Server 用户名；更新时使用 `null` 以清除经办人 |
| `jiraLabels` | Create/Update Issue | JSON 数组或以逗号分隔的文本 |
| `jiraCommentBody` | Create/Update Comment | 在 REST API v3 上以 ADF 发送，在 REST API v2 上以纯文本发送 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira 评论 ID |
| `jiraTransitionId` | Transition Issue | 通过 List Transitions 获取 |
| `jiraAttachmentId` | Get/Delete Attachment | Jira 附件 ID |
| `jiraAttachmentFilename` | Add Attachment | 上传的文件名 |
| `jiraAttachmentBase64` | Add Attachment | 原始 base64 或 data URL 内容；受文件大小限制约束 |
| `jiraAttachmentMimeType` | Add Attachment | 可选 MIME 类型；为空时根据文件名推断 |
| `jiraIncludeBinary` | Get/List Attachment | 布尔开关；启用后会添加 `content_base64` |
| `jiraNotifySubject` | Notify Issue | 必填的通知主题 |
| `jiraNotifyTextBody` | Notify Issue | 必填的纯文本通知正文 |
| `jiraNotifyHtmlBody` | Notify Issue | 可选的 HTML 正文 |
| `jiraNotifyTo` | Notify Issue | 收件人 JSON；默认为 `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId 或 Data Center / Server 用户名 |
| `jiraUserEmail` | Create User | 新用户电子邮件地址 |
| `jiraUsername` | Create User | 可选的 Data Center / Server 用户名；回退为 `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | 可选的显示名称 |
| `jiraUserProducts` | Create User | JSON 数组或以逗号分隔的产品键；仅限 Jira Cloud |
| `jiraLimit` | Search Issues、List Projects、Get Issue Changelog、List Comments、List Attachments | 默认为 `50`；范围为 1–100 |
| `jiraStartAt` | Data Center / Server 上的 Search Issues、List Projects、Get Issue Changelog、List Comments、List Attachments | 偏移分页起始索引 |
| `jiraNextPageToken` | Jira Cloud 上的 Search Issues | 来自上一次搜索响应的游标 token |

## 示例

从上游输入创建 issue：

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

更新 issue 并清除经办人：

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

使用自定义字段和游标分页搜索 issue：

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

在 Data Center 上使用偏移分页搜索 issue：

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

在列出可用 transition 后对 issue 执行 transition：

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- 然后使用 Transition ID 运行 **Transition Issue**：`$listTransitions.transitions[0].id`

通知关注者有关 issue 更新的信息：

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## 输出

每个成功操作都会设置：

- `$jira.success`
- `$jira.operation`

**Get Myself** 暴露 `user`。

**分页列表操作** 暴露 `count`、一个集合字段以及 `pagination`：

| 操作 | 集合键 | 分页结构 |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`；Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** 暴露 `transitions` 和 `count`，不包含分页。

**Issue 变更与读取** 暴露 Jira issue payload，并在适用时暴露 `key`。

**Comment** 的获取/创建/更新暴露 `comment`；删除暴露 `deleted`。

**Transition Issue** 暴露 `transition` 为 `{ transitionId }`，以及刷新后的 `issue` 和 `key`。

**Attachment add** 暴露 `attachments` 和 `count`。**Get Attachment** 暴露 `attachment`；**List Attachments** 暴露 `attachments`、`count` 和 `pagination`。当启用 **Include Binary** 时，每个 attachment 对象可能包含 `content_base64`。删除暴露 `deleted`。

**User** 的获取/创建暴露 `user`；删除暴露 `deleted`。

**Notify Issue** 暴露 `notified`。

常见访问模式：

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## 相关

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
