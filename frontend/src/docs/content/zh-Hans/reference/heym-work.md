# Heym Work

**Heym Work** 是面向业务团队的第二套用户界面，构建于 Heym 之上。用户用自己的语言描述任务，回答几个问题，即可获得 Heym 构建并测试完成的 workflow。业务人员在专为其打造的页面上开展工作，处理审批，并能查看带有发起人姓名的每次运行。Heym 在后台执行每项任务。

Heym Work 作为独立容器与 Heym 并行运行，需要获得 Heym 团队提供的独立许可证。访问 [heym.run/enterprise](https://heym.run/enterprise) 了解更多信息并申请试用。观看 [Heym Work 影片](https://youtu.be/5Z2gGo6bcpU) 体验两分钟快速概览。

## 业务团队获得的赋能

| 模块 | 功能说明 |
|------|----------|
| **Chat** | 通过文字或语音描述任务。Heym 收集必要信息，构建 workflow，进行测试并将其标记为已验证。 |
| **Flows** | 编辑者可以通过选项而不是画布构建 flow：触发条件、可选的 AI 草稿以及在 Slack、Google Sheets 和电子邮件中的操作。来自 Slack 的回复将继续运行，批准操作也会在“活动”中等待。请参阅 [Flows](#flows)。 |
| **页面** | 固定组件页面：指标数值、图表、带状态标签的表格、文件上传区及审批卡片。表格中的单行可打开独立的详情页。 |
| **审批** | 来自 [Human-in-the-Loop](./human-in-the-loop.md) 步骤的审核任务会在“活动”与页面中等待处理，支持批准、请求修改和拒绝。 |
| **活动** | 记录每一次运行，并标注启动者与执行该任务的实例。 |
| **角色** | 所有者、编辑者与查看者。用户通过 Heym 已配置的 [单点登录 (SSO)](./sso.md) 完成身份验证。 |
| **行业定制版** | 法律、教育、金融、物流、能源与电商行业版本开箱即用，内置专属页面、样例数据及行业 workflow。 |

## Flows

**Flows** 位于 Heym Work 面向编辑者和所有者的菜单中。Flow 是由选项而非节点构成的，Heym Work 通过 Heym API 代表创建它的人将其另存为常规 Heym 工作流。Heym 的访问规则、编辑历史和触发器同步均按编辑器中的方式适用，每次运行都会像其他运行一样出现在“活动”中。

| 部分 | 选项 |
|---|---|
| **触发条件** | 按需、按计划、在收到 Slack 消息时、当 Google Sheets 标签页更改时（添加、更改或删除行），或当电子邮件到达收件箱时。电子表格和电子邮件触发器每 1、5、15 或 60 分钟检查一次。 |
| **AI 草稿**（可选） | 模型和说明会将启动 flow 的内容转换为后续步骤所需的文本。未从表格或电子邮件启动的 flow 可以首先从频道或会话中读取最近的 Slack 消息。 |
| **接下来发生什么** | 无论由什么启动 flow，都按顺序在三种工具中的任一种中执行操作。**Slack：** 频道消息、私信、表单、带按钮的消息、批准、会话回复、消息更新和最终结果。**Google Sheets：** 添加行，或更新已更改的行。**电子邮件：** 发送电子邮件。 |

- **回复将继续运行。** 批准、按钮或表单会暂停运行，直到有人在 Slack 中回复。批准操作也会在“活动”中等待，在任一位置做出的决定都会从 Slack 消息中删除按钮。后续的 Slack 步骤将保留在第一条消息的会话中。
- **单个“连接”卡片。** 每个 flow 都会显示其读取和发送所用的 Slack 工作区、Google Sheets 账户和收件箱。它们是 Heym 凭据：**Slack Bot**（bot 令牌，`xoxb-…`）、**Google Sheets**、**IMAP** 和 **SMTP**；缺失的凭据可以直接从 flow 本身添加。
- **每个 flow 拥有一个 Slack 应用。** 在 Slack 应用中，将交互请求 URL 设置为 `https://<您的 Heym>/api/slack/interactions/<凭据 id>`，并将事件订阅请求 URL 设置为 `https://<您的 Heym>/api/slack/events/<凭据 id>`。Heym Work 会为所选连接显示两者。该凭据上的所有 flow 共享它们。
- **Slack 触发器选择其监听的内容：** 频道和私信中的消息、发给 bot 的私信、@提及 bot 或单个频道中的消息。Bot 自己的发布绝不会触发 flow。
- **要求。** Flows 需要 Heym 0.0.131 或更高版本。

Flow 构建的步骤与您在画布上可以使用的节点相同：[Slack](../nodes/slack-node.md)、[Slack Trigger](../nodes/slack-trigger-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Google Sheets Trigger](../nodes/google-sheets-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Send Email](../nodes/send-email-node.md) 和 [Cron](../nodes/cron-node.md)。

## 连接 Heym Work

观看 [安装视频](https://youtu.be/zXGfg1HPSLk) 查看从首条命令到主页呈现的完整配置过程。

连接在 **设置 → Heym Work** 中完成配置。此标签页仅对在 `HEYM_ADMIN_EMAILS` 中列出的实例管理员可见。

| 字段 | 功能说明 |
|------|----------|
| **Heym Work 地址** | Heym Work 的运行地址，例如 `https://work.example.com`。登录后将跳转返回此处。点击 **保存**。 |
| **集成密钥** | 点击 **生成密钥** 创建 Heym Work 用于向 Heym 发送每个请求的密钥。密钥仅显示一次并附带复制按钮。Heym 仅存储其哈希值。 |
| **启用 Heym Work** | 开启连接。需要预先填写地址与密钥。 |
| **行业和团队版本** | 面向法律、教育、金融、物流、能源和电子商务的版本，以及面向企业团队的 IT、销售、营销和人力资源版本，均随附专门针对该工作的页面、示例数据和工作流。 |

随后打开 Heym Work 地址并完成后续设置：

1. **许可证**：输入 Heym 团队提供的许可证密钥。
2. **Heym**：输入 Heym 地址及集成密钥。
3. **所有者**：使用被指定为 Heym Work 所有者的账户登录。

主页随即打开，团队即可开始使用。

### 轮换密钥

点击 **轮换密钥** 可替换当前的集成密钥。Heym Work 将暂停响应，直到在其中填入新密钥；同时所有已登录 Heym Work 的用户都将被注销。若密钥可能泄露或知情人员离职，请执行此操作。

### 停用连接

关闭 **启用 Heym Work** 开关即可断开连接。此时 Heym Work 将重新要求提供 Heym 密钥。无论哪种情况，Heym 都会继续正常执行所有 workflow、定时任务及 webhook。

## 安全架构

- **所有变更均由 Heym 处理。** Heym Work 从 Heym 数据库读取展示内容，并通过受密钥保护的通道将所有操作发送至 Heym，由 Heym 应用自身的访问规则。Heym Work 将其专有数据存储在独立的 `heym_work` 架构中。
- **密钥以哈希形式静态存储。** Heym 仅比对传入密钥的哈希值，从不以明文形式持久化存储密钥。
- **登录鉴权由 Heym 托管。** 启用 [SSO](./sso.md) 时，用户通过 Heym 对接的企业身份提供商进行身份认证。
- **全面变更审计。** 保存连接和轮换密钥的操作均会向 [审计日志](./audit.md) 中写入 `work_integration.update` 和 `work_integration.key_rotate` 记录。

## 许可证说明

Heym Work 需要由 Heym 团队颁发的专用许可证密钥。Heym Work 每天会向 heym.run 发送其许可证 ID、安装 ID、过去 30 天内的活跃用户数、成员总数、过去 24 小时内的运行次数以及 Heym 和 Heym Work 的版本号。Workflow 内容、输入、输出和凭据始终完整保留在本地服务器上。

若日常同步连续失败达到 30 天，将进入 14 天的宽限期；宽限期结束后，Heym Work 界面将提示所有者输入密钥。试用期在截止日之前有效，经 Heym 团队延期后可恢复（每个安装实例仅限一次试用）。在此期间 Heym 本身始终保持不间断运行。无外网访问权限的网络环境可通过 enterprise@heym.run 申请离线许可证。

## 视频资源

所有 Heym Work 视频均收录于 [Heym Work 播放列表](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ)。

## 相关文档

- [Enterprise](./enterprise.md)：商业授权与专业技术支持
- [单点登录 (SSO)](./sso.md)：Heym Work 使用的认证体系
- [Human-in-the-Loop](./human-in-the-loop.md)：Heym Work 呈现的人工审核
- [审计日志](./audit.md)：连接变更生成的记录项
- [设置](./user-settings.md)：Heym Work 标签页所在位置
