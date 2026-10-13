# 发送电子邮件

**发送邮件**节点通过 SMTP 发送电子邮件。可用于通知、告警和事务性邮件。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.to`、`$nodeLabel.cc`、`$nodeLabel.bcc`、`$nodeLabel.subject`、`$nodeLabel.attachment_count` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自[凭据](../tabs/credentials-tab.md)的 SMTP 凭据 |
| `to` | expression | 收件人。多个收件人用逗号分隔。 |
| `cc` | expression | 抄送收件人。多个收件人用逗号分隔。 |
| `bcc` | expression | 密送收件人。多个收件人用逗号分隔。对其他收件人隐藏。 |
| `subject` | expression | 邮件主题 |
| `emailBody` | expression | 邮件正文内容 |
| `attachments` | expression | 用逗号分隔的 [Drive](./drive-node.md) 文件 ID，用于添加附件。仅可附加工作流所有者拥有或与其所属团队共享的文件。 |

## 附件

通过将一个或多个 Drive 文件 ID 传递给 `attachments` 字段，即可附加来自 [Drive](./drive-node.md) 的文件。使用 `$` 表达式引用上游 Drive 节点的 `id` 输出（例如 `$drive.id`），或用逗号分隔列出静态 ID。每个 ID 均在工作流所有者的范围内解析；无效或无法访问的 ID 会导致节点失败，而不会发送部分邮件。

## 设置

添加包含服务器、端口、邮箱和密码的 SMTP 凭据。可见发件人为凭据中可选的 **From** 字段；若 From 留空，则以用户名作为发件人发送。常见 SMTP 服务器：

- Gmail：`smtp.gmail.com`，端口 587（需要应用专用密码）
- Outlook：`smtp.office365.com`，端口 587

## 示例

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

上述 `attachments` 值引用了标记为 `drive` 的上游 [Drive](./drive-node.md) 节点，附加其生成的文件。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [错误处理器](./error-handler-node.md) – 失败时发送邮件
- [凭据选项卡](../tabs/credentials-tab.md) – 添加 SMTP 凭据
- [第三方集成](../reference/integrations.md#smtp-email) – SMTP 提供商设置（Gmail、Outlook、Mailgun、SendGrid）
