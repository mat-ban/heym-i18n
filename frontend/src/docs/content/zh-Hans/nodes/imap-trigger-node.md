# IMAP Trigger

**IMAP Trigger** 节点按固定间隔轮询电子邮件收件箱，每检测到一封新邮件便启动一次工作流。它是一个零输入 Trigger 节点，专为入站电子邮件自动化场景设计，例如支持工单分流、共享邮箱监控和审批邮箱。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.email`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` 凭证，包含服务器、登录信息、邮箱和 SSL 设置 |
| `pollIntervalMinutes` | Integer | Heym 检查邮箱中新邮件的频率 |

## 设置指南

### 1. 创建 `imap` 凭证

1. 前往 **Settings → Credentials → New Credential**
2. 选择类型 **IMAP Email Inbox**
3. 输入：
   - **IMAP Host**（例如 `imap.gmail.com`）
   - **IMAP Port**（大多数提供商使用 `993` 进行 SSL/TLS 连接）
   - **Username / Email**
   - **Password / App Password**
   - 可选的 **Mailbox**（默认：`INBOX`）
4. 保持 **Use SSL / TLS** 启用，除非你的邮件服务器明确要求非 SSL 的 IMAP
5. 保存凭证

### 2. 将节点添加到工作流

1. 将 **IMAP Trigger** 拖到画布上
2. 选中该节点以打开 Properties 面板
3. 选择你的 `imap` 凭证
4. 设置 **Poll Interval (Minutes)**，填入整数值，例如 `1`、`5` 或 `15`

## Trigger 语义

- 首次轮询会建立当前邮箱内容的基线，**不会**重放旧邮件。
- 后续轮询会对每封 IMAP UID 比已保存游标更新的邮件触发一次。
- 如果邮箱的 `UIDVALIDITY` 发生变化，Heym 会重置游标并重新建立基线，以避免重复处理。
- 每封新邮件都会启动一次独立的工作流执行，`trigger_source = "imap"`。

## 输出字段

节点触发后，下游节点可以访问：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.email` | 完整解析后的邮件 Payload |
| `$nodeLabel.email.subject` | 解码后的主题 |
| `$nodeLabel.email.from` | 原始 `From` 标头 |
| `$nodeLabel.email.fromAddresses` | 解析后的发件人列表 |
| `$nodeLabel.email.toAddresses` | 解析后的收件人列表 |
| `$nodeLabel.email.ccAddresses` | 解析后的抄送列表 |
| `$nodeLabel.email.replyToAddresses` | 解析后的回复地址列表 |
| `$nodeLabel.email.text` | 纯文本正文 |
| `$nodeLabel.email.html` | HTML 正文 |
| `$nodeLabel.email.attachments` | 附件元数据数组（`filename`、`content_type`、`size_bytes`） |
| `$nodeLabel.email.headers` | 解码后的标头对象 |
| `$nodeLabel.email.uid` | 用于去重或日志记录的 IMAP UID |
| `$nodeLabel.triggered_by` | Trigger 来源标签（`"imap"`） |
| `$nodeLabel.trigger_node_id` | 检测到该邮件的画布节点 ID |
| `$nodeLabel.triggered_at` | 工作流执行的 ISO 时间戳 |

## 示例工作流

**入站支持邮件 → 摘要 → 路由**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** 标签：`supportInbox`
- **LLM** 用户消息：`"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**：`$supportInbox.email.subject.lower().contains("urgent")`

## 注意事项

- 许多提供商要求使用 **app password** 进行 IMAP 访问，而非你的主账户密码。
- 附件内容不会注入到工作流输入中；仅包含附件元数据。
- 使用下游的 [Send Email](./send-email-node.md)、[Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或 [DataTable](./datatable-node.md) 来路由或记录新邮件。

## 相关

- [Triggers](../reference/triggers.md) – 所有工作流入口点概述
- [Third-Party Integrations](../reference/integrations.md) – IMAP 凭证设置
- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理 `imap` 凭证
- [Send Email](./send-email-node.md) – 回复或转发入站邮件
