# Workflow 组织

Heym 允许你将 Workflow 组织到文件夹中、创建子文件夹，并为 Workflow 安排删除计划。UI 概览请参见 [Workflows 标签页](../tabs/workflows-tab.md)。

## 文件夹与子文件夹

文件夹构成一棵树。每个文件夹包含：

- **Name** – 显示名称
- **Parent** – `parent_id` 链接到另一个文件夹；`null` 表示根目录
- **Workflows** – Workflow 可通过 `folder_id` 移动到文件夹中

### API

| Endpoint | 用途 |
|----------|---------|
| `GET /folders` | 仅根文件夹 |
| `GET /folders/tree` | 完整树结构（子文件夹 + Workflow） |
| `GET /folders/{id}` | 单个文件夹及其内容 |
| `POST /folders` | 创建文件夹（`parent_id` 可选） |
| `PUT /folders/{id}` | 更新名称或 `parent_id` |
| `DELETE /folders/{id}` | 删除文件夹（级联） |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | 将 Workflow 移动到文件夹中 |
| `DELETE /folders/workflows/{workflow_id}/folder` | 从文件夹中移除 Workflow |
| `GET /folders/{id}/export` | 将文件夹及所有子文件夹下载为 ZIP |

### 树结构

树响应中每个文件夹都包含 `children` 和 `workflows`。共享的 Workflow 可通过 `WorkflowShare.folder_id` 出现在文件夹中。

## 共享 Workflow

在 Workflow 编辑器中打开 **Share**，通过电子邮件邀请用户，或与[团队](./teams.md)共享。每个邀请和每个团队共享都带有一个权限：

| 权限 | 协作者可以执行的操作 |
|------------|------------------------------|
| **Read** | 打开 Workflow、查看其内容、查看执行历史并运行它。编辑器以只读模式打开：Save 被禁用，画布无法更改。 |
| **Write** | 包含 Read 允许的所有操作，此外还可编辑画布、设置、分析文档和 Agent 记忆。 |

权限显示在 Share 对话框中的每个条目旁边，可随时从该下拉菜单中更改，无需移除并重新添加共享。当用户通过多条路径（直接共享以及一个或多个团队）访问某个 Workflow 时，以**最高**权限为准。在引入权限之前就已存在的共享为 **Write**，省略 `permission` 的 API 客户端同样获得 **Write**。

仅限所有者的操作从不依赖于权限：删除 Workflow、还原或清除版本、清除历史记录、管理共享，以及下方的[仅限所有者的设置](#owner-only-settings)，即使对于 **Write** 协作者也仍归所有者所有。**Read** 协作者若通过 API（`PUT /api/workflows/{id}`、分析笔记、Agent 记忆、缓存清除）或通过 AI Assistant 发送编辑，将收到 `403`，并附带 `You have read-only access to this workflow`。

共享 Workflow 会授予对画布、执行历史和分析文档的访问权限。它**不会**自动共享：

- Workflow 中节点引用的 **Credentials**
- 由 [Execute](../nodes/execute-node.md) 节点或 Agent 调用的**子 Workflow**

接收者需要单独向他们共享这些 Credentials 和子 Workflow（相同的用户或团队）。请从 [Credentials 标签页](../tabs/credentials-tab.md)共享 Credentials；参见 [Credentials 共享](./credentials-sharing.md)。请从每个子 Workflow 各自的编辑器共享对话框中共享它。

### 仅限所有者的设置

共享后，整个 **Run with cURL** 配置仍归所有者所有。协作者仍可打开对话框并复制生成的命令，但控件为只读。

非所有者更改以下任何一项都会被拒绝，并返回 `403`：

- **Authentication**（`auth_type`）和 **Header Key**（`auth_header_key`）
- **Request Body** 模式（`webhook_body_mode`）和 **Request Method**（`http_method`）
- **Response Cache**（`cache_ttl_seconds`）和 **Rate Limit**（`rate_limit_requests`、`rate_limit_window_seconds`）
- **SSE Streaming**（`sse_enabled`、`sse_node_config`）

**Header Value**（`auth_header_value`）的行为有所不同：它对协作者完全隐藏，协作者的写入会被忽略而非被拒绝。编辑器将该字段渲染为掩码状态，因此在那里返回 `403` 会破坏普通的保存操作，而不是发出攻击信号。

Authentication 是该配置块仅限所有者的原因：`Anonymous` 允许未经身份验证的调用者运行 Workflow，而在没有已登录调用者的情况下运行，会以**所有者**（而非调用者）的身份解析 Credentials 和全局变量。该配置块的其余部分是已发布的请求契约和所有者的成本控制，因此随之一起保留。

Workflow 级 **Properties** 面板中的 **On error, run workflow**（`error_workflow_id`）出于同样的原因仅限所有者：[错误 Workflow](./features.md#error-workflow) 使用失败运行的 Credentials 和全局变量运行，而对于触发运行和匿名运行，这些都属于所有者。协作者看到该设置为只读，非所有者添加、替换或清除它都会被拒绝，并返回 `403`。

编辑画布、名称和描述不受影响。

### 执行 Token

协作者可以为其被共享的 Workflow 铸造执行 Token。该运行归属于**铸造 Token 的人**，因此使用该用户的 Credentials 和全局变量，而非所有者的。只有真正的匿名调用——`auth_type: anonymous` 且无调用者——才会在所有者的上下文中运行。

## 已安排删除

Workflow 可以被安排删除，而不是立即移除。

- **字段**：`scheduled_for_deletion`（可为空的 datetime）
- **行为**：设置后，Workflow 会移动到 `folder_id = null`，并出现在 "Scheduled for Deletion" 部分中。
### API

| Endpoint | 用途 |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | 设置 `scheduled_for_deletion`，清除 `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | 清除 `scheduled_for_deletion`（恢复） |

### UI

- **拖拽至回收站** – 将 Workflow 拖放到“Scheduled for Deletion”区域以将其加入计划删除
- **恢复** – 从计划中移除
- **立即删除** – 点击垃圾桶图标以永久移除

### 清理逻辑

一个 Cron 任务每天在 **23:59**（配置的时区）运行。仅当满足以下条件时，Workflow 才会被删除：

- **所有起始节点**（没有入边的节点，不包括 sticky/errorHandler）的 `active === false`

如果任一启动节点仍处于活跃状态，该 Workflow 将保留至下一次运行。

## Dashboard UI

- **文件夹行** – 新建文件夹、支持展开/折叠的递归文件夹树。每个文件夹在其名称下方带有
  可选描述，以及一个统计其所含 Workflow 数量（包含子文件夹）的徽章。
- **文件夹操作** – 新建子文件夹、重命名、更改图标、下载为 ZIP 和删除，均内联显示在
  每个文件夹行上；右键上下文菜单提供相同的操作集，手机端则显示单个菜单按钮。
- **主区域** – 根 Workflow（无文件夹、未计划删除）和 Scheduled for Deletion
- **文件夹拖放预览** – 拖拽 Workflow 时会高亮显示确切的文件夹或子文件夹，并在卡片大小的
  预览中显示其完整路径。折叠的文件夹在短暂悬停后会自动展开。
- **稳定的拖拽反馈** – 源卡片使用拖拽幽灵，活动放置目标在滚动或跨越同一文件夹内的控件时
  保持选中状态。
- **目标检查** – 当前文件夹会显示为 **Already in Folder**，并且不接受冗余的移动操作。
- **其他放置区域** – 根区域和“Scheduled for Deletion”在可以接受拖拽的 Workflow 时会高亮显示。
- **ZIP 拖放** – 将 ZIP 文件拖放到 Workflow 区域，可在根层级导入文件夹结构

## 相关

- [Workflows Tab](../tabs/workflows-tab.md) – 创建和管理 Workflow
- [Credentials Sharing](./credentials-sharing.md) – 与 Workflow 协作者共享凭证
- [Teams](./teams.md) – 与团队共享 Workflow 和凭证
- [Core Concepts](../getting-started/core-concepts.md) – Workflow、节点和执行
- [Workflow Structure](./workflow-structure.md) – Workflow 的 JSON 格式
- [Triggers](./triggers.md) – 起始节点和入口点
