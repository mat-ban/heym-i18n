# Workflows 标签页

**Workflows** 标签页是仪表盘的默认视图。它展示您的 Workflow 列表、文件夹结构，并允许您创建、编辑和整理 Workflow。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ 观看 Workflows 演示</a></p>

## 开始对话

Workflow 列表上方有一个聊天框，会以您的名字向您问候，并询问您想要自动化什么。输入 Prompt，可选择附加一个文件，并选择所需的凭证和模型。两个下拉菜单均支持搜索，并默认使用您的 [AI 默认设置](../reference/user-settings.md)。

发送后将创建新对话并在 [Chat 标签页](./chat-tab.md)中打开，回复会以流式方式呈现。支持的附件包括文本文件、图片和 PDF，每条消息一个，与聊天输入框一致。

如果尚未配置 LLM 凭证，该框会显示一个指向 [Credentials 标签页](./credentials-tab.md)的链接，且发送功能保持禁用。

点击 **x** 可隐藏该框。随后 Workflows 标题旁会出现一个 **Ask AI** 按钮，点击即可恢复。该选择会记录在您的浏览器中。

## Workflow 列表

列表采用双栏视图：左侧为 Workflow 和文件夹，右侧为所选 Workflow 的预览。

- 每行显示 Workflow 图标、名称、描述、最后更新时间以及[状态标签](#workflow-status)
- Workflow 可以位于根目录或文件夹内，已固定的 Workflow 会显示在顶部的 **Pinned** 分组中
- **单击**某一行可选中它并在右侧加载预览
- **双击**某一行，或在聚焦时按 **Enter**，可在[编辑器](../getting-started/quick-start.md)中打开
- 使用 **Ctrl+click**（或 **Cmd+click**）可在新标签页中打开
- 每行右侧均带有编辑、复制、固定和删除操作。在手机上这些操作会被隐藏，以便名称占满整行宽度；此时**长按**某一行可打开操作面板
- 将常用 Workflow 固定到 [Quick Drawer](../reference/quick-drawer.md)，即可从 Workflows 标签页及其他内部页面快速运行

## Workflow 预览

选中某个 Workflow 后，列表旁的预览面板会填充内容。在宽度小于 1280px 的屏幕上，同一面板会以底部弹出的表单形式打开。

该面板显示：

- Workflow 名称、创建者及创建时间、最后编辑时间
- **Open Workflow** – 在编辑器中打开该 Workflow
- **Run Now** – 在 [Quick Drawer](../reference/quick-drawer.md)中打开该 Workflow，您可以在其中填写输入并启动运行，无需离开列表
- **Description** – Workflow 描述
- **Trigger Configuration** – cron Workflow 的调度配置，或事件 Workflow 的监听 Trigger。通过 HTTP 调用的 Workflow 会显示一个 **Copy cURL** 按钮，而非原始 Endpoint 和认证说明：它会复制一个完整的请求，包含正确的 URL、请求头、认证占位符以及根据 Workflow 输入字段构建的请求体。当 Workflow 发布了[门户](../reference/portal.md)时，其公开聊天链接也会显示在此处
- **Last Run Details** – 最近一次运行的结果和耗时，或提示该 Workflow 从未运行过
- **Workflow Steps & Sub-agents** – 按执行顺序排列的节点，每个节点显示其模型、操作或调度信息，以及一个表示是否处于活动状态的圆点。选中某个步骤会在编辑器中打开该节点，并已展开其属性面板

滚动时该面板会固定在列表旁，因此在较长的 Workflow 列表中仍保持可读。

## 实例管理

`HEYM_ADMIN_EMAILS` 中列出的账户无需共享或转移所有权，即可列出、打开、编辑、查看执行历史以及删除实例上的任何 Workflow。该设置为逗号分隔的电子邮件地址列表，匹配时不区分大小写。空列表表示不授予任何人此访问权限。更改后需重启后端。

管理员可在 Workflow 列表中看到所有者的电子邮件地址，并可按该地址进行搜索。选择一个 Workflow 以在其预览中打开 **Instance administration**：

1. **Pause triggers** 仅对包含 Cron 节点的 Workflow 显示。它通过正常的版本化保存来禁用该 Workflow 的 Cron 及其他自动 Trigger 节点。现有运行可以完成。手动、API、portal 及子 Workflow 调用仍然可用；此操作并非 Workflow 范围的执行锁定。
2. 暂停期间按钮变为 **Resume triggers**，页面重新加载后亦然。Resume 会重新启用由管理员暂停的 Trigger，并保持原本已禁用的 Trigger 不变。对于没有保存管理员暂停状态的较旧暂停 Workflow，Resume 会启用其自动 Trigger。
3. 待运行结束后，使用 Workflow 行中的 **Delete workflow** 操作。当仍有运行中、排队中或待审核的工作时，删除会返回冲突。计划删除也应用相同的检查。

先暂停 Trigger 并让现有运行完成，然后再删除。暂停时已派发的 Trigger 仍可完成。当 Workflow 必须不再可调用时，请使用删除。

仅所有者可见的 Webhook 密钥和身份验证设置保持其现有保护。管理操作不会转移所有权，也不会共享所有者的凭据记录。管理员的暂停、恢复、删除及计划操作会记录在[审计跟踪](../reference/audit.md)中，并包含执行操作的管理员和 Workflow 所有者。

## Workflow 状态

每一行都带有一个状态标签，该标签根据 Workflow 的 Trigger 节点、其实时运行状态，以及（对于没有 Trigger 节点的 Workflow）其最近一次运行的启动方式得出：

| 状态 | 含义 |
| --- | --- |
| **Running** | 该 Workflow 当前有正在执行的运行 |
| **Scheduled** | 它具有活动的 [cron](../nodes/cron-node.md) Trigger |
| **Listening** | 它具有活动的事件 Trigger，例如 Slack、Telegram、IMAP 或 WebSocket Trigger |
| **Paused** | 它具有 Trigger 节点，但所有 Trigger 节点均已停用 |
| **API** | 它没有 Trigger 节点，且最近一次运行是通过对其执行 Endpoint 发起 HTTP 调用 |
| **SubWorker** | 它没有 Trigger 节点，且最近一次运行是作为父 Workflow 的子 Workflow |
| **Portal** | 它没有 Trigger 节点，且最近一次运行来自其 [portal](../reference/portal.md) |
| **WEB** | 它没有 Trigger 节点，且其唯一终端是 [HTML 输出映射器](../nodes/html-output-mapper-node.md)，因此调用它会返回渲染后的网页 |
| **Manual** | 它没有 Trigger 节点且从未运行过，或其最近一次运行来自其他方式 |
| **Remove Scheduled** | 它已被[计划删除](../reference/workflow-organization.md) |

API、SubWorker 和 Portal 标签读取 Workflow [执行历史](./logs-tab.md)中最近的一条记录，因此以两种方式调用的 Workflow 会显示最后发生的那一种。**WEB** 则根据图结构判定，因此其优先级高于上述三者：提供页面服务的 Workflow 即使通过 HTTP 被调用后仍显示 WEB。Trigger 节点始终优先于所有这些状态：一个同时被通过 HTTP 调用的 cron Workflow 仍保持 **Scheduled**。

使用搜索字段旁的 **Status** 下拉菜单可仅显示某一种状态。该下拉菜单会列出当前匹配每种状态的数量。状态筛选也会深入文件夹：包含匹配项的文件夹会自动展开，不包含匹配项的文件夹会被隐藏，直到清除筛选。

## 活动 Workflow

在桌面端，顶部工具栏中的圆形徽章显示当前正在运行的 Workflow 数量，并每 10 秒自动刷新。点击非零徽章可打开活动 Workflow 列表，该列表在滚动前最多显示四行。选择 Workflow 名称可将编辑器附加到该运行的实时视图。零徽章仅作信息展示，无法打开，且在移动端屏幕上隐藏。

## 搜索

使用 **Status** 旁的 Workflow 搜索字段，或按 **Ctrl+F**（或 **Cmd+F**），可按标题或描述筛选 Workflow。文件夹内匹配的 Workflow 会连同其文件夹分支一起展开显示。按 **Escape** 清除搜索。

## 文件夹

- 将 Workflow 组织到[文件夹和子文件夹](../reference/workflow-organization.md)中
- 使用 **New Folder** 按钮创建文件夹，为每个文件夹指定名称和可选描述，描述显示在列表中文件夹名称下方
- 每个文件夹行显示其包含的 Workflow 数量（含子文件夹），以及新建子文件夹、重命名、更改图标、下载为 ZIP 和删除操作。在手机上，该行仅显示一个菜单按钮
- 将 Workflow 拖到文件夹或子文件夹上方时，会显示卡片大小的目标预览。高亮预览会在放置前显示完整的文件夹路径，悬停在折叠的文件夹上会短暂展开，以便访问嵌套文件夹。
- 在文件夹之间或拖到根目录来移动 Workflow。被拖动的卡片以幽灵形态保持可见，滚动时活动目标保持高亮。
- 将 Workflow 拖回其当前所在文件夹的操作被禁用，并标记为 **Already in Folder**。
- 通过重命名操作或右键上下文菜单重命名文件夹，或更改其描述

## 创建 Workflow

1. 点击 **New Workflow**
2. 输入名称和可选描述
3. Workflow 在编辑器中打开

## 导入

将 JSON Workflow 文件拖放到 Workflow 区域即可创建新的 Workflow。导入的节点和边用于创建 Workflow；名称来自 JSON 中的 `name` 字段或文件名。有关 JSON 格式和导入选项，请参阅[下载与导入](../reference/download-import.md)。

## 共享

在编辑器中打开 Workflow，点击 **Share** 通过电子邮件邀请用户或与[团队](./teams-tab.md)共享。为每个用户或团队选择 **Read**（查看和运行）或 **Write**（也可编辑），之后可通过条目旁边的下拉菜单更改。Credentials 和子 Workflow 不会自动共享；请使用相同的用户或团队单独共享。请参阅 [Workflow 组织](../reference/workflow-organization.md#sharing-workflows)和 [Credentials 共享](../reference/credentials-sharing.md)。

## 编辑和删除

- **Edit** – 通过行的编辑操作更改 Workflow 名称和描述
- **Delete** – Workflow 会被[安排删除](../reference/workflow-organization.md)；在永久移除之前会移至回收站区域

## 并发编辑

保存时会发送您的编辑所基于的修订版本，如果 Workflow 在此期间发生了更改——例如队友保存了它，或者您在第二个标签页中打开了同一个 Workflow——服务器会拒绝写入。Heym 随后会显示 **Stale Workflow Detected** 对话框，提供两个选项：

- **Cancel** – 将未保存的更改保留在编辑器中，以便在另一个标签页中重新加载并协调
- **Override** – 仍然保存，覆盖他人的版本

**运行** Workflow 时会先保存，因此会经过相同的检查。如果 Workflow 在您操作期间发生了更改，运行会在对话框处暂停，而不是静默覆盖：**Override and Run** 保存您的版本并开始运行，**Cancel Run** 放弃两者并保持您的编辑不变。

该检查是保存请求本身的一部分，因此不会产生额外的往返开销，也不存在保存可能绕过检查的窗口。您从应用其他位置所做的更改——重命名、设置更改、属性面板切换——永远不会被视为冲突。

## 命令面板

按 **Ctrl+K**（或 **Cmd+K**）打开命令面板。您可以：
- 按名称搜索 Workflow
- 跳转到任意[仪表板标签页](./credentials-tab.md)
- 打开最近的 Workflow

## 相关

- [快速开始](../getting-started/quick-start.md) – 构建您的第一个 Workflow
- [Workflow 组织](../reference/workflow-organization.md) – 文件夹、子文件夹和定时删除
- [Workflow 结构](../reference/workflow-structure.md) – Workflow 的 JSON 格式
- [下载与导入](../reference/download-import.md) – 以 JSON 导出和导入 Workflow
- [Portal](../reference/portal.md) – 将 Workflow 暴露为公开聊天 UI
- [Board](./board-tab.md) – 通过列链从看板卡片运行 Workflow
- [核心概念](../getting-started/core-concepts.md) – Workflow、节点和执行
- [执行历史](../reference/execution-history.md) – 查看过去的运行和 Bring to Canvas
- [快速抽屉](../reference/quick-drawer.md) – 从仪表板、文档和其他非编辑器页面固定并运行 Workflow
- [上下文展示](../reference/contextual-showcase.md) – 仪表板界面的简短页面指南
