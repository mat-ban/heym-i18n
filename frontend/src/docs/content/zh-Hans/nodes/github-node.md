# GitHub

**GitHub** 节点将原生 GitHub REST 操作添加到工作流中，类似于你可能从 n8n 等工具中了解到的多操作 GitHub 节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | GitHub |
| 输出 | `$nodeLabel.*` |

## 支持的操作

该节点目前提供 40 个操作：

| 资源 | 操作 |
|----------|---------|
| Repository | `Get Repository`、`Get Repository License`、`Get Repository Profile`、`Get Repository Issues`、`Get Repository Pull Requests`、`List Popular Paths for Repository`、`List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`、`List User Repositories`、`Get User Repositories`、`Get User Issues`、`Invite User` |
| Issue | `Create Issue`、`Get Issue`、`List Issues`、`Edit Issue`、`Lock Issue`、`Create Comment` |
| Pull request | `Create Pull Request`、`List Pull Requests` |
| Review | `Create Review`、`Get Review`、`List Reviews`、`Update Review` |
| Release | `Create Release`、`Get Release`、`List Releases`、`Update Release`、`Delete Release` |
| Workflow | `List Workflows`、`Get Workflow`、`Enable Workflow`、`Disable Workflow`、`Get Workflow Usage`、`Dispatch Workflow`、`Dispatch Workflow and Wait` |
| File | `Get File`、`List Files`、`Create or Update File`、`Delete File` |

## 凭证

在[凭证选项卡](../tabs/credentials-tab.md)中创建 **GitHub** 凭证，需要提供：

- 个人访问令牌
- 可选的完整 REST API 基础 URL，用于 GitHub Enterprise Server

对于 GitHub.com，请将基础 URL 留空。建议使用细粒度 PAT。

对于 GitHub Enterprise Server，请输入完整的 REST API Endpoint（包含 `/api/v3`），例如
`https://github.example.com/api/v3`。不要只输入 Web UI 根地址
（`https://github.example.com`）。

如果你使用 GitHub Enterprise Server，之后编辑凭证以轮换 Token 时，将
`base_url` 留空会保留现有的 Enterprise Endpoint。仅当你想要
更改该 Endpoint 时，才输入新的 URL。

## 通用字段

大多数操作使用：

- **Owner** – 仓库所有者、组织名称或用户名
- **Repository** – 仓库名称

`List Organization Repositories` 仅需要 **Owner**（组织名称），不使用仓库字段。

`List User Repositories` 仅需要 **Owner**（用户名），不使用仓库字段。

`Get User Repositories` 对应 n8n 的 User → Get Repositories 操作。`Get User Issues` 默认返回
分配给已认证 GitHub 用户的 Issue。将 **Mentioned Filter** 设置为任意
非空值，则改为返回提及已认证用户的 Issue。它还支持
state、labels、updated-since、sort、direction 和 per-page 过滤器。`Invite User` 需要
组织名称和电子邮件地址，不使用 Owner 或 Repository。

## Repository

Repository 操作包括元数据、检测到的许可证内容、社区健康概况以及
流量洞察。`List Popular Paths for Repository` 和
`List Top Referrers for Repository` 返回 GitHub 最近 14 天的热门流量条目，
需要仓库管理推送权限。

`List Issues` 支持可选的 assignee、creator、mentioned user、逗号分隔的 labels、
updated-since 时间戳、sort 和 direction 过滤器。`List Pull Requests` 支持 state、sort、
direction 和 per-page 控制。

`Get Repository Issues` 和 `Get Repository Pull Requests` 在显式的 n8n 兼容仓库操作名称下，
暴露与其 List 对应项相同的 API。

### Get Repository 元数据

`Get Repository` 将 GitHub 的完整响应存储在 `$github.repository` 中，同时暴露
`$github.full_name`、`$github.default_branch`、`$github.private` 和 `$github.url`。

仓库 Payload 通常包括：

- 身份与所有权：ID、名称、全名、描述、所有者和可见性
- 仓库状态：private、fork、archived、disabled 和默认分支
- URL：GitHub 页面、API、clone、SSH 和 Git URL
- 活动与大小：创建、更新和推送时间戳、大小、stars、watchers、forks、subscribers 和 open issues
- 功能：issues、projects、wiki、Pages、discussions、topics、language 和 homepage
- 许可证、合并设置、调用者权限、安全设置以及 fork 父级/来源元数据（如可用）

某些管理、权限、合并和安全字段取决于凭证的仓库
权限。

示例：

- Owner：`heymrun`
- Repository：`heym`

## Issues

Issue 操作支持 title/body 字段，以及用于 labels 和 assignees 的可选 JSON 数组字段。

`List Issues` 仅返回仓库 Issue。Pull Request 被排除；请使用 `List Pull Requests` 获取 PR 结果。

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue 字段语义

对于 `Edit Issue`，只有你显式设置的字段才会发送到 GitHub：

- **State** – 选择 `Don't change`、`Open` 或 `Closed`。留空以保持当前状态。
- **State Reason** – 可选设置为 `Completed`、`Not Planned`、`Duplicate` 或 `Reopened`。
- **Title / Body** – 留空以保持当前值。
- **Labels / Assignees** – 将字段留空以保持当前值。使用 `[]` 清除所有 labels 或 assignees。使用 JSON 数组（如 `["bug"]`）来替换它们。

`Edit Issue` 在运行时至少需要一个要更改的字段。如果你只提供 Issue 编号，执行将失败，并返回来自 GitHub API 层的验证错误。
## 锁定 Issue

`Lock Issue` 接受一个可选的 **Lock reason**。提供该参数时，其值必须是 GitHub 支持的以下之一：

- `off-topic`
- `too heated`
- `resolved`
- `spam`

将 reason 留空即可在不指定具体原因的情况下锁定。

## Pull Requests

创建 PR 需要：

- Title
- Head branch
- Base branch
- 可选的 body
- 可选的 draft 模式

## Pull Request Reviews

Review 操作与 GitHub 的 pull request review API 保持一致：

| 操作 | 必填字段 | 可选字段 |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number、event | Body、commit ID |
| `Get Review` | Pull request number、review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number、review ID、body | — |

`Create Review` 支持 `Approve`、`Request Changes`、`Comment` 和 `Pending`。
对于 `Request Changes` 和 `Comment`，body 为必填项。当 Commit ID 为空时，GitHub
会审查该 pull request 的最新 commit。

## Releases

| 操作 | 运行时必填字段 | 常见可选字段 |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name（标题）、body、target branch、draft、prerelease |
| `Update Release` | Release ID | Tag name、release name、body、target branch、draft、prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` 可以将 `draft` / `prerelease` 显式设置为 `true` 或 `false`。

## Workflows

Workflow 操作支持：

- 列出仓库的 workflow
- 通过数字 ID 或 workflow 文件名获取某个 workflow
- 启用或禁用某个 workflow
- 按 runner 操作系统读取可计费的 workflow 用量
- 使用 ref 或 branch 以及可选的 JSON inputs 对象来触发 workflow

GitHub 正在逐步关闭 `Get Workflow Usage` endpoint。使用该操作的 workflow 可能需要在
GitHub 移除该 endpoint 时进行迁移。

`Dispatch Workflow` 同时接受 GitHub 的两种响应形式：旧版的 `204 No Content` 以及较新的
`200` 响应（包含 `workflow_run_id`、`run_url` 和 `html_url`）。

`Dispatch Workflow and Wait` 会触发 workflow 并轮询该次运行，直到其状态为
`completed`。以秒为单位配置超时时间和轮询间隔。当 GitHub 返回较新的 `200` 响应时，
Heym 使用 `workflow_run_id`。对于传统的 `204 No Content` 响应，Heym 会发现针对所选
workflow 和 ref 新建的 `workflow_dispatch` 运行，然后等待该次运行。

## File Contents

`Get File` 通过 GitHub 的 contents API 读取仓库文件，并在可用时解码文本内容。二进制文件和非 UTF-8 内容可能返回元数据，而不包含解码后的 `content` 字段。

`List Files` 通过仓库 contents API 返回给定文件夹路径和可选 ref 的目录条目。将 **Directory Path** 留空即可列出仓库根目录。

`Create or Update File` 使用以下内容将文本内容写入仓库路径：

- File path
- Commit message
- File content
- 可选的 branch

`Delete File` 使用 commit message 和可选的 branch 删除仓库路径。如果文件存在，Heym 会在删除前自动获取当前 SHA。

如果文件已存在，Heym 会在更新前自动获取当前 SHA。

## Pagination

`List Issues`、`Get Repository Issues`、`Get User Issues`、`List Pull Requests`、
`Get Repository Pull Requests`、`List Reviews`、`List Releases`、`List Workflows`、
`List Organization Repositories`、`List User Repositories` 和 `Get User Repositories` 支持
**Per Page**（1–100）。Heym 仅请求一页结果；同一操作中没有用于获取更多页面的 `page` 字段。

## Output

具体结构取决于所选操作。常见字段包括：

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

将 `github` 替换为你的节点标签。

## Notes

- 提供 labels 和 assignees 时，它们必须是有效的 JSON 数组。
- 提供 workflow dispatch inputs 时，它必须是有效的 JSON 对象。
- `Edit Issue` 仅在你显式设置 `state` 时才使用它；保持未设置即可维持当前 issue 状态。
- GitHub API 权限取决于你授予的 token scopes 或细粒度仓库权限。

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理 GitHub credentials
- [Third-Party Integrations](../reference/integrations.md) – GitHub credential 设置以及 Enterprise `base_url`
- [Agent Node](./agent-node.md) – 将 GitHub credentials 与 `@modelcontextprotocol/server-github` 配合使用
- [Node Types](../reference/node-types.md) – 完整节点目录
