# 审计日志

Heym 会为每一个与安全相关的操作写入一行审计记录：谁执行了操作、操作对象是什么，以及操作是否成功。这些记录通过 `winston.audit` logger 输出到后端的标准输出，与请求访问日志并列，可从 **Logs** 标签页读取，或使用 `docker logs` 查看。

审计日志**始终开启**。无需启用任何功能，也无需设置任何环境变量。

## 行格式

一个操作恰好产生一行自包含的记录：

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

每一行都包含以下字段：

| 字段 | 描述 |
|-------|-------------|
| `action` | 发生的事件，格式为 `resource.verb` —— 参见下表。 |
| `outcome` | `success`、`failure` 或 `denied`。 |
| `actor_id` | 执行操作的用户 UUID。仅当无人通过身份验证时才缺失。 |
| `actor_email` | 该用户的邮箱。在登录失败时，这是尝试使用的地址，而非已确认的账户。 |
| `target` | 操作对象，格式为 `type:uuid`。 |
| `target_name` | 该对象的可读名称，包含空格时加引号。 |

随后是操作特定的字段 —— 例如 `credential_type`、`imported`、`grantee_email`、`team_name`。包含空格、引号或 `=` 的值会加引号；超过 256 个字符的值会被截断并附加 `...(truncated)` 标记。

## 读取日志

审计 logger 是请求 logger 的子级，因此两者输出到同一流，同时保持可分离：

```bash
# 仅审计行，无访问日志噪音
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# 某个用户执行的所有操作
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# 登录失败和被拒绝的访问
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# 所有涉及某个 credential 的操作
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

在应用中，**Logs** 标签页读取相同的容器输出。它受 `DOCKER_LOGS_ENABLED` 和 `DOCKER_LOGS_ALLOWED_EMAILS` 允许列表控制。

## 记录内容

每一次状态变更都会被记录。读取操作仅在读取本身即为敏感行为时才会被记录 —— 查看 workflow 的运行历史、打开 credential、下载文件。普通的列表和详情读取不会被审计；访问日志已记录请求的发生，而审计每一次 `GET` 会淹没真正重要的记录。

### 身份验证

| 操作 | 说明 |
|--------|-------|
| `auth.register` | 当注册被禁用或密码登录关闭时（`reason=password_login_disabled`）为 `outcome=denied`，当邮箱已被占用时为 `failure`。 |
| `auth.login` | `outcome=failure` 记录尝试的地址以及邮箱未知还是密码错误。 |
| `auth.logout` | actor 从 refresh cookie 解析，因此没有 cookie 的登出会记录为无身份。 |
| `auth.token_refresh` | `outcome=denied` 且 `reason=refresh_token_replayed_or_revoked` —— 这是值得告警的 token 盗用信号。 |
| `auth.password_change` | 当前密码错误时为 `outcome=failure`。 |
| `auth.sso_login` | 单点登录。`outcome=failure` 携带 provider 响应被拒绝的原因；`denied` 携带 `email_not_verified`、`domain_not_allowed` 或 `provisioning_disabled`。 |
| `sso_settings.update` | 管理员更改了 [SSO](./sso.md) 配置。记录 `enabled` 和 `password_login_disabled`，绝不记录 client secret。 |
| `sso_settings.test` | 管理员运行了 SSO 连接测试。 |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

当协作者读取他人的运行历史时，`workflow.history_view` 记录 `owned=false`。当协作者尝试删除时，`workflow.delete` 记录 `outcome=denied` 且 `reason=not_owner`。

### Credentials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` 被审计是因为打开 credential 会对其进行解密。未命中会记录 `outcome=denied`，这正是 credential-id 枚举尝试的表现。
### 其他资源

| 资源 | 操作 |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

批量操作按每次请求记录一行并附带计数，而非按每行记录。一次导入 5,000 行的 CSV 会产生一行 `data_table.import_csv`，其中携带 `imported`、`rejected` 和 `total`。

## 密钥绝不记录

审计行记录标识符、名称和计数。它绝不记录凭据的内容、变量的值、密码或 Token。

有两点对此加以保障。调用点被编写为仅传递安全字段，而审计辅助函数作为兜底进行脱敏：任何名称包含 `password`、`secret`、`token`、`api_key`、`value`、`authorization`、`cookie` 或类似字样的字段，在构建该行之前都会被替换为 `***`。过度脱敏是刻意为之——一行无用的记录总好过泄露的凭据。

当密钥确实与记录相关时，仅记录其形态。文件分享记录 `password_protected=true`，绝不记录密码本身。

## 保留策略

**审计行的存活时间仅与容器的日志输出相同。** 它们不会被写入数据库。重新创建后端容器会丢弃其日志。

如果你需要能够经受重新部署的审计历史，请将容器的 stdout 发送到某个持久化位置——日志驱动、sidecar 收集器或你所在平台的日志聚合——就像你对任何其他容器日志所做的那样。

## 面向贡献者

输出一行审计记录只需一次调用：

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

该辅助函数是同步的，不接触任何数据库，并会吞掉自身的错误，因此审计调用不会导致请求失败或变慢。

添加审计调用时需遵循三条规则：

1. **以 snake_case 将操作命名为 `resource.verb`。** `backend/tests/test_audit_log.py` 会遍历 `app/api/` 下的每一个 `audit()` 调用，并在名称不匹配时使构建失败，同时也会在某个已覆盖资源丢失其全部调用点时使构建失败。

2. **只读取确定存在的属性。** 该辅助函数的 `try/except` 保护的是其自身主体，而非你传递给它的表达式——`target_name=workflow.name` 中的 `AttributeError` 会在调用点、即 `audit()` 运行之前抛出，并会中断请求。请读取 ORM 列和局部变量，而非可选或延迟加载的属性。

3. **在删除之前记录删除操作。** 在 `db.delete(row)` 之后，你想要记录的名称和 id 可能已不复存在。请将该调用置于其上方。
