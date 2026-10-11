# Sentry

使用 Sentry 节点可在工作流中自动化 Sentry 组织、项目、团队、问题、事件和发布操作。

## 凭证

使用认证 Token 创建 **Sentry** 凭证。对于 Sentry SaaS，将 Base URL 留空；对于自托管的 Sentry 实例，设置根 URL。

## 操作

- `createProject`、`createRelease`、`createTeam`
- `deleteIssue`、`deleteProject`、`deleteRelease`、`deleteTeam`
- `getEvent`、`getIssue`、`getProject`、`getRelease`
- `listEvents`、`listIssues`、`listOrganizations`、`listProjects`、`listReleases`、`listTeams`
- `updateIssue`、`updateOrganization`、`updateProject`、`updateRelease`、`updateTeam`

`createIssue` 和 `createOrganization` 未对外暴露，因为 Sentry 未为其记录公开的 REST Endpoint。

## 通用字段

| 字段 | 描述 |
| --- | --- |
| Credential | 要使用的 Sentry 凭证 |
| Operation | 要运行的 Sentry 操作 |
| Organization Slug | 用于组织更新以及项目、团队、问题、事件和发布操作的 Sentry 组织 slug |
| Project Slug | 用于项目 get/update/delete 和事件操作的项目 slug；用于问题筛选的项目 slug 或 ID |
| Team Slug | 用于项目创建和团队 update/delete 操作的团队 slug |
| Issue ID | 用于问题 get/update/delete 操作的问题 ID |
| Event ID | 用于事件查找操作的事件 ID |
| Release Version | 用于发布 get/update/delete 操作的发布版本 |
| Name | 用于创建操作的项目或团队名称 |
| Slug | 用于创建操作的可选项目或团队 slug |
| Platform | 用于项目创建的可选 Sentry 平台 |
| Status / Assigned To | 问题更新字段。`updateIssue` 至少需要其中一个 |
| Query | Sentry 搜索查询。省略它以获取未解决的问题，或将其设置为空字符串以获取所有问题 |
| Limit | 列表操作的结果限制，最多 1,000 条结果 |
| Release Projects JSON | 用于发布创建的项目 slug 的 JSON 数组 |
| Release Refs JSON | 用于发布创建的仓库/提交对象的 JSON 数组 |
| Payload JSON | 用于更新组织、项目、发布和团队操作的 JSON 对象 |

## 示例

列出未解决的问题：

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

解决一个问题：

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

删除一个问题：

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

创建一个发布：

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

更新一个项目：

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## 输出

列表操作返回 `success`、`operation`、`count` 以及相关集合，例如 `organizations`、`projects`、`teams`、`issues`、`events` 或 `releases`。单资源操作返回 `organization`、`issue`、`event`、`release`、`project` 或 `team`。删除操作返回相关资源键，其中包含 `deleted: true` 和标识字段。
