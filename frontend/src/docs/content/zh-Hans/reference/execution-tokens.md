# 执行 Token

Execution Token 是作用域受限的 JWT，用于授予对单个 Workflow 的 execute 和 stream Endpoint 的访问权限。借助它，你可以从外部系统调用 Workflow，而无需暴露长期有效的用户会话 Token。

## 为什么使用 Execution Token

当 Workflow 的认证方式设置为 **JWT** 时，Endpoint 通常需要有效的用户会话。Execution Token 让你能够：

- 将可调用的 Token 分享给外部脚本、CI 流水线或集成，而无需分享你的账户凭据。
- 限制暴露范围——一个 Token 仅对某一个特定 Workflow 有效。
- 即时撤销访问权限，而无需更改密码或轮换会话 Token。
- 在短期 Token（分钟或小时级）与长期 Token（最长 10 年）之间进行选择。

## 创建 Token

在编辑器中打开 **Run with cURL** 对话框（右上角工具栏）。当 Workflow 认证方式设置为 **JWT Token** 时，对话框会显示 Token 管理器：

1. 选择 **Short-lived** 或 **Long-lived (10yr)**。
2. 对于短期 Token，输入以秒为单位的有效期（最小值为 60）。
3. 点击 **+ New Token**。

Token 会立即创建、添加到列表中，并自动选中，使 cURL 命令更新为包含该 Token。

## Token 列表

每个 Token 行显示：

| 列 | 描述 |
|--------|-------------|
| Created | 创建时间戳 |
| Status | **Expires:** 日期、**Expired** 或 **Revoked** |
| Eye icon | 切换 Token 值的可见性 |
| Revoke button | 将 Token 标记为已撤销（不可逆） |

点击任意有效（未过期、未撤销）的行即可选中它。选中的 Token 会被嵌入到 cURL 命令预览中。

已过期和已撤销的 Token 仍会显示在列表中，但无法被选中。

## 使用 Token

从列表中复制 Token 值（点击眼睛图标以显示它），并将其作为 `Bearer` Token 包含在请求中：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

当你在对话框中选中某个 Token 并使用 **Copy cURL** 时，Token 已经嵌入到命令中——无需手动替换。

## Token 作用域

每个 Token 携带以下 JWT claims：

| Claim | Value |
|-------|-------|
| `sub` | Token 创建者的用户 ID |
| `wid` | Workflow UUID——该 Token 对任何其他 Workflow 都会被拒绝 |
| `scope` | `workflow:execute`——用于将其与用户会话 Token 区分开 |
| `jti` | 用于撤销查找的唯一 Token ID |
| `exp` | 过期时间戳 |

后端会在每次请求时检查所有这些内容：签名有效性、过期时间、`wid` 是否匹配，以及 `jti` 是否已被撤销。

## 撤销

点击 Token 旁边的撤销（圆圈斜杠）按钮即可撤销它。撤销会立即生效——后续使用该 Token 的请求会返回 `401`。该 Token 行仍会显示在列表中，并带有 **Revoked** 标签。

撤销操作不可逆。如果需要恢复访问权限，请创建一个新的 Token。

## API

Token 管理 Endpoint 使用你的常规会话进行认证。

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | 创建一个 Token |
| `GET` | `/api/workflows/{id}/execution-tokens` | 列出你在此 Workflow 下的 Token |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | 撤销一个 Token |

**创建请求体：**

```json
{ "ttl_seconds": 900 }
```

**创建响应：**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` 字段仅在创建时返回一次。请立即保存它；后续的 `GET` 请求会返回同一行，但你也可以随时在 cURL 对话框中显示它。

## 可见性范围

每个用户只能看到自己创建的 Token。对共享 Workflow 具有访问权限的团队成员无法看到彼此的 Token。

## 相关内容

- [Webhook](./webhooks.md) — HTTP Trigger Endpoint 与 cURL 对话框
- [Security](./security.md) — 会话管理与认证概述
- [SSE Streaming](./sse-streaming.md) — 将 Execution Token 与流式 Endpoint 配合使用
