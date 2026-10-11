# Teams 标签页

**Teams** 标签页用于创建和管理团队，以便与用户群组共享 Workflow、凭据、变量、向量存储和 Drive 文件。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ 观看 Teams 演示</a></p>

## 创建团队

1. 点击 **New Team**
2. 输入名称和可选描述
3. 点击 **Create**

您将自动成为团队创建者和首位成员。

## 管理成员

- **添加成员** – 在团队详情对话框中输入用户邮箱，然后点击 **Add**
- **移除成员** – 点击成员旁的 X（创建者不可被移除）
- **编辑团队** – 创建者可编辑名称和描述
- **删除团队** – 创建者可删除团队；所有团队共享将被移除
- **共享资源** – 团队详情对话框显示与该团队共享的 Workflow、凭据、变量、向量存储、Drive 文件、Workflow 模板和节点模板。点击某个 Workflow 可在编辑器中打开；切换到相应标签页可查看其他资源。

## 与团队共享

可从以下位置与团队共享资源：

- **Workflows** – Workflow 编辑器中的共享对话框
- **Workflow 模板** – 创建/编辑 Workflow 模板时的共享对话框（可见性：Specific users）
- **节点模板** – 创建/编辑节点模板时的共享对话框（可见性：Specific users）
- **凭据** – Credentials 标签页中的共享对话框
- **变量** – Variables 标签页中的共享对话框
- **向量存储** – Vectors 标签页中的共享对话框
- **仪表板** – Dashboard 标签页中的仪表板设置（读取或写入）
- **Drive 文件** – Drive 标签页中的共享对话框，或 Drive 节点的 `shareWithMyTeams` / `unshareWithMyTeams` 操作

与团队共享后，所有团队成员将获得访问权限。详情请参阅 [Teams](../reference/teams.md)。

与团队共享 Workflow 时，请同时将该 Workflow 所依赖的凭据和子 Workflow 共享给同一团队。仅授予 Workflow 访问权限并不会授予凭据或子 Workflow 的访问权限。

## Chat 集成

[Chat 标签页](./chat-tab.md) AI 助手可以列出您的团队。询问“my teams”即可查看您所属的团队。

## 相关内容

- [Teams](../reference/teams.md) – Teams 参考与共享模型
- [凭据共享](../reference/credentials-sharing.md) – 与用户和团队共享凭据
- [Workflow 组织](../reference/workflow-organization.md) – 文件夹与共享
- [上下文展示](../reference/contextual-showcase.md) – 仪表板界面的精简页面指南
