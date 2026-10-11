# OpenCode Go

**OpenCode Go** 节点在隔离且强化的 Heym 容器中，针对 GitHub 仓库运行 [OpenCode](https://opencode.ai) CLI (Go)。与 Codex 节点类似，它专为编码任务而设计，例如修复测试、编辑文件、生成补丁或发起 pull request——但它使用的是与提供商无关的 **OpenCode Go** 模型网关，而非 OpenAI Codex。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | OpenCode Go API key + GitHub |
| 输出 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 认证

**OpenCode Go** 凭证存储一个 OpenCode Go 网关 **API key**（来自 [opencode.ai/go](https://opencode.ai/go)）以及一个可选的 **Gateway Base URL**（默认为 `https://opencode.ai/zen/go/v1`；仅在自托管或代理网关时覆盖）。

该节点还需要一个 **GitHub** 凭证，用于克隆私有仓库、推送工作分支以及创建 pull request。GitHub token **绝不会被放入沙箱容器内**——Heym 在宿主机上执行所有 git 和 GitHub 操作，因此生成的代码无法窃取推送凭证。

## 隔离与安全

执行隔离由 `HEYM_OPENCODE_CLI_COMMAND` 选择，与 Codex 节点完全一致：

- **本地开发（`run.sh`）** 将其保留为默认值 `opencode`，因此 OpenCode 作为宿主机子进程针对克隆的工作区运行——无需 Docker，无需额外标志。
- **Docker 部署（`deploy.sh` 和单一 GHCR 镜像）** 将其设置为 `/usr/local/bin/heym-opencode-docker`，这是一个包装器，在共享 OpenCode 工作区命名卷的**强化、一次性同级容器**内运行 `opencode run`。

强化运行器容器会丢弃所有 Linux capabilities，设置 `no-new-privileges`，使用只读根文件系统并挂载 tmpfs `/tmp`，同时应用 pid/内存/CPU 限制。允许网络出口（OpenCode 必须能够访问模型网关）。**GitHub token 绝不会被放入容器内**——所有 git 和 GitHub 操作均在宿主机侧运行，因此容器内仅存在 OpenCode API key 和仓库文件。

OpenCode 仅编辑磁盘上的文件；Heym 负责所有 git/GitHub 操作。

## 模型

OpenCode Go 的模型列表经常变化，因此 **Model** 字段会从网关的模型列表（`GET https://opencode.ai/zen/go/v1/models`）实时填充，并显示为可搜索的下拉菜单。如果实时列表不可用，则使用内置的回退列表。模型 id 使用 `opencode-go/<model>` 形式（例如 `opencode-go/kimi-k3`、`opencode-go/deepseek-v4-pro`、`opencode-go/qwen3.7-max`）——`opencode-go` 是 OpenCode CLI 中用于 Go 网关的提供商 id。将该字段留空以使用运行器默认值（`opencode-go/kimi-k3`）。以旧版 `opencode/<model>` 形式保存的模型 id 会在运行时自动重写。

## 字段

| 字段 | 描述 |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go 凭证（网关 API key） |
| GitHub Credential | 用于仓库访问的 GitHub PAT 凭证 |
| Repository URL | HTTPS GitHub 仓库 URL；支持表达式 |
| Base Branch | OpenCode 运行前克隆的分支，默认 `main` |
| Model | OpenCode Go 模型（实时可搜索下拉菜单，`opencode-go/<model>`）；留空则使用运行器默认值 |
| Reasoning Variant | 可选；映射到 `opencode run --variant`，用于支持推理强度的模型 |
| Task Prompt | 给 OpenCode 的编码任务；支持诸如 `$input.text` 的表达式 |
| Publish Mode | 变更的交付方式（见下表） |
| Branch Name | PR/commit 模式下的工作分支，默认 `opencode/$executionId` |
| Timeout | OpenCode 最大执行时间（秒） |

## 发布模式

| 模式 | 作用 |
|------|--------------|
| `diff_only` | 在本地编辑文件并返回补丁和变更文件。不推送任何内容。 |
| `draft_pr` | 提交到分支、推送该分支，并打开一个草稿 pull request。 |
| `open_pr` | 提交到分支、推送该分支，并打开一个可供审查（非草稿）的 pull request。 |
| `commit_push` | 提交到分支并推送该分支，但不打开 pull request。 |
| `direct_commit` | 直接提交并推送到基础分支（无独立分支或 PR）。 |
| `open_or_update_pr` | 当 agent 存在已打开的 PR 时更新它——即使分支名称不同，运行器也会按作者 + 基础分支找到它——否则打开一个新的 PR。最适合重新运行和“更新已打开的 PR”指令。 |
| `update_existing_pr` | 向现有分支/PR 添加一个提交；如果尚不存在则打开一个。 |
| `patch_artifact` | 将 diff 保存为可下载文件并返回 `patchUrl`。不推送任何内容。 |

## 输出

| 键 | 描述 |
|-----|-------------|
| `status` | 始终为 `completed`（OpenCode Go 节点不会暂停等待输入） |
| `summary` | OpenCode 的最终消息 |
| `validation` | 报告时的验证说明 |
| `diff` | 文件变更时的 Git 补丁 |
| `changedFiles` | 变更的文件路径 |
| `branchName` | 工作分支名称 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr` 和 `update_existing_pr` 模式下的 PR URL |
| `pushedBranch` | commit/PR 模式下被推送的分支 |
| `patchUrl` | `patch_artifact` 模式下 diff 的下载链接 |
## 拉取请求上的 UI 截图

对于 UI/前端任务，OpenCode 应将 PNG 截图保存到已加入 gitignore 的路径下，例如 `frontend/.e2e-artifacts/`（而非源代码目录中）。如果缺少前端依赖，runner prompt 允许进行有针对性的包安装（例如 `bun install`），并短暂启动预览/`bun run dev`，仅用于捕获 UI。Heym 会将这些图片上传到单个共享的 GitHub **prerelease**（`opencode-pr-assets`）中，作为命名为 `<branch>-…` 的资产，然后在**拉取请求打开之前**将它们嵌入 PR 描述中，因此新建的 PR 在创建时便已包含其截图（现有 PR 则就地更新）。

OpenCode 还被指示以一行 `PR_TITLE: …` 结尾，以便 Heym 能够以有意义的主题打开拉取请求，而不是使用诸如 `Done.` 之类的占位符。

OpenCode 有时会在任务中途结束一轮对话（"…Now let me take a screenshot"），这会在截图捕获之前就结束运行。为防止这种情况，runner prompt 要求在最终消息**之前**捕获截图；如果运行仍然在没有可发布摘要的情况下结束，或者存在 UI 变更但没有截图，Heym 会在同一工作区中再运行一次 OpenCode 以完成收尾。如果之后 UI 变更仍然没有截图，则会在 PR 正文中添加一条可见的说明，以确保这一缺口永远不会被无声忽略。

## 发布到 GitHub 的内容

你的 **Task Prompt** 是私有输入，不属于 PR 内容。只有两项内容会被发布：描述代码变更内容的 `## Change Summary`，以及捕获了截图时的 `## Screenshots` 部分。PR 标题仅根据变更摘要生成。

runner prompt 声明了这一策略，Heym 也会在运行结束后强制执行：在提交任何内容或作为拉取请求打开之前，它会从摘要、PR 正文和提交消息中剥离 prompt 回显部分（`## Task`、`## Prompt`、`## Instructions`、`## Original Request`、……）以及任何从任务 prompt 中逐字复制的段落。

Heym 从 agent 的消息中读取 `## Change Summary` 部分，而不是取它最后说的内容，因为 OpenCode 每一步都会发出一条消息，而最后一条通常是运行中途的评论。步骤叙述（`Both pass. Let me do a final review:`）也会被拒绝作为 PR 标题或提交主题。如果运行没有产生可用的变更摘要，拉取请求会退而列出已更改的文件，而不是发布评论。

## 作为 agent 工具

OpenCode Go 节点可以连接到 **AI Agent** 节点的工具句柄上，以便 agent 能够委派编码任务。在节点上配置凭证、GitHub 凭证和仓库，然后用 agent 提供的开关标记 **Task Prompt**（以及可选的 **Repository URL**），以便 agent 在调用时提供它们。

## 示例

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

## 相关

- [Codex 节点](./codex-node.md)
- [GitHub 节点](./github-node.md)
- [Agent 节点](./agent-node.md)
- [凭证](../reference/credentials.md)
- [凭证共享](../reference/credentials-sharing.md)
- [节点类型](../reference/node-types.md)
