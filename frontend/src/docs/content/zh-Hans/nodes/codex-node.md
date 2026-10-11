# Codex

**Codex** 节点在隔离的 Heym 工作区中针对 GitHub 仓库运行 OpenAI Codex CLI。它专为编码任务而设计，例如修复测试、编辑文件、生成补丁或创建草稿拉取请求。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1，外加 `question` |
| 凭证 | Codex access token + GitHub |
| 输出 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 认证

**OpenAI Codex** 凭证支持两种认证模式：

| 模式 | 描述 |
|------|-------------|
| **使用 ChatGPT 登录**（推荐） | OAuth (PKCE) 登录，使用你的 ChatGPT Plus/Pro 订阅，因此运行**不会**产生按 token 计费的 API 成本。在凭证对话框中点击 **Sign in with ChatGPT**，在浏览器中授权，然后将 `localhost:1455` 重定向 URL 粘贴回 Heym。Heym 会存储生成的 token 包，并在其过期时自动刷新。 |
| **Access token** | 粘贴一个仅供本地 Codex 运行器使用的 ChatGPT/Codex `access_token`。 |

Codex 凭证不接受 API key。该节点不会提交云端 Codex 任务；它在 Heym 运行时内克隆仓库，将 ChatGPT token 包写入隔离的 `auth.json`（或传递 `CODEX_ACCESS_TOKEN`），仅提供给 Codex 进程，并确保 token 不进入 `$credentials`。

该节点还需要一个 **GitHub** 凭证，用于克隆私有仓库、推送工作分支以及创建草稿拉取请求。

在 Docker 部署中，Heym 从同一个 Heym 镜像（而非单独的 GHCR 镜像）启动一个同级容器来运行 Codex。该容器仅挂载 Codex 工作区卷，并允许 Codex 自带的 bubblewrap 沙箱创建命名空间和全新的 `/proc`。运行器添加了 `SYS_ADMIN`、非限制的 seccomp 和 AppArmor，以及 `systempaths=unconfined`（Docker Engine 25+）。如果没有最后一个标志，每条命令都会在启动前失败，并报错 `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`。

OpenAI 参考：

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## 字段

| 字段 | 描述 |
|-------|-------------|
| Codex Credential | OpenAI Codex 凭证（ChatGPT 登录或 `access_token`） |
| GitHub Credential | 用于仓库访问的 GitHub PAT 凭证 |
| Repository URL | HTTPS GitHub 仓库 URL |
| Base Branch | Codex 运行前克隆的分支，默认 `main` |
| Model | 可选的 Codex 模型（可编辑下拉菜单，例如 `gpt-5.6-sol`、`gpt-5.6-terra`、`gpt-5.6-luna`）；留空则使用 Codex 的默认值 |
| Reasoning Effort | Codex 推理深度：`low`、`medium`、`high`、`xhigh`（Extra High）、`max` 或 `ultra`（默认 `medium`） |
| Task Prompt | 提供给 Codex 的编码任务；支持诸如 `$input.text` 的表达式 |
| Publish Mode | 变更的交付方式（见下表） |
| Branch Name | PR/commit 模式下的工作分支，默认 `codex/$executionId` |
| Timeout | Codex 最长执行时间（秒） |

## 发布模式

| 模式 | 作用 |
|------|--------------|
| `diff_only` | 在本地编辑文件并返回补丁和变更文件。不推送任何内容。 |
| `draft_pr` | 提交到分支、推送该分支，并创建草稿拉取请求。 |
| `open_pr` | 提交到分支、推送该分支，并创建可评审（非草稿）的拉取请求。 |
| `commit_push` | 提交到分支并推送该分支，但不创建拉取请求。 |
| `direct_commit` | 直接提交并推送到基础分支（不创建单独分支或 PR）。 |
| `open_or_update_pr` | 当 agent 已有打开的 PR 时更新它——即使分支名称不同，运行器也会按作者 + 基础分支找到它——否则创建一个新的。最适合重新运行和“更新打开的 PR”指令。 |
| `update_existing_pr` | 向现有分支/PR 添加提交；如果尚不存在则创建一个。 |
| `patch_artifact` | 将 diff 保存为可下载文件并返回 `patchUrl`。不推送任何内容。 |

## 输出

| 键 | 描述 |
|-----|-------------|
| `status` | `completed` 或 `needs_input` |
| `summary` | Codex 的摘要 |
| `validation` | Codex 报告的验证说明、测试或检查 |
| `diff` | 文件变更时的 Git 补丁 |
| `changedFiles` | 变更的文件路径 |
| `threadId` | 可用时的 Codex 线程/会话 id |
| `branchName` | 工作分支名称 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr` 和 `update_existing_pr` 模式下的 PR URL |
| `pushedBranch` | commit/PR 模式下推送的分支 |
| `patchUrl` | `patch_artifact` 模式下 diff 的下载链接 |
| `usage` | 可用时 Codex CLI 报告的使用元数据 |
## 拉取请求中的 UI 截图

对于 UI/前端任务，Codex 应将 PNG 截图保存到 gitignore 的路径下，例如 `frontend/.e2e-artifacts/`（而非源代码目录中）。如果缺少前端依赖，Codex 可以运行 `bun install`（或 npm/pnpm install）并启动一个短时预览/`bun run dev`，仅用于捕获 UI。Heym 会将这些图片上传到单个共享的 GitHub **prerelease**（`codex-pr-assets`）中，作为命名为 `<branch>-…` 的资产，然后在**拉取请求打开之前**将它们嵌入 PR 描述中，因此新建的 PR 在创建时即已包含其截图（现有 PR 则就地更新）。Codex 还必须设置一个有意义的 `pull_request_title`（绝不能使用诸如 `Done.` 之类的占位符）。

Codex 有时会在任务中途结束一轮对话（"…Now let me take a screenshot"），这会在截图捕获之前就结束本次运行。为防止这种情况，runner prompt 要求在最终结果**之前**捕获截图；如果运行仍然在没有可发布摘要的情况下结束，或者有 UI 变更但没有截图，Heym 会在同一工作区中再运行一次 Codex pass 来完成。如果 UI 变更之后仍然没有截图，则会在 PR 正文中添加一条可见的说明，以确保这一缺口永远不会被静默忽略。

## 发布到 GitHub 的内容

你的 **Task Prompt** 是私有输入，不是 PR 内容。只有两项内容会被发布：描述代码变更内容的 `## Change Summary`，以及捕获了截图时的 `## Screenshots` 部分。PR 标题仅从变更摘要中派生。

runner prompt 声明了这一策略，Heym 也会在运行后强制执行：在提交任何内容或作为拉取请求打开之前，它会从摘要、PR 正文和提交消息中剥离 prompt 回显部分（`## Task`、`## Prompt`、`## Instructions`、`## Original Request` 等）以及任何从任务 prompt 中逐字复制的段落。诸如 `Both pass. Let me do a final review:` 之类的步骤叙述也会被拒绝作为 PR 标题或提交主题。

## 后续问题

如果 Codex 需要缺失的需求或产品决策，它会返回 `needs_input`。Heym 会暂停执行并暴露一个 `question` 输出句柄。将该句柄连接到通知分支，例如 Slack 或 Send Email，以将公开的后续链接发送给审查者。

当审查者回答后，Heym 会从保存的工作区元数据中恢复同一执行快照和 Codex 线程。

## 作为 Agent 工具

Codex 节点可以附加到 **AI Agent** 节点的工具句柄上，以便 agent 可以委托编码任务。在节点上配置凭证、GitHub 凭证和仓库，然后将 **Task Prompt**（以及可选的 **Repository URL**）标记为 agent 提供开关，以便 agent 在调用时提供它们。当 Codex 作为工具运行时，`needs_input` 结果会内联返回给 agent，而不是暂停工作流，因此 agent 可以优化请求并再次调用 Codex。

## 示例

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

## 相关

- [GitHub 节点](./github-node.md)
- [Agent 节点](./agent-node.md)
- [凭证](../reference/credentials.md)
- [凭证共享](../reference/credentials-sharing.md)
- [节点类型](../reference/node-types.md)
