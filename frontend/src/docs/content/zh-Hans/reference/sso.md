# 单点登录

Heym 可以基于任何外部 **OpenID Connect** 提供商对用户进行身份验证。管理员在 **Settings → SSO** 下输入 issuer URL，Heym 便会从该提供商的 discovery document 中读取其余所有 endpoint。

没有任何提供商被硬编码。Keycloak、Okta、Entra ID、Auth0、Google 以及任何其他 OIDC 提供商都通过相同的字段接入，因为 Heym 唯一被告知的信息就是 issuer。

密码登录与 SSO 可以并行使用。在 SSO 验证通过后，可以关闭密码登录。

## 开始之前

SSO 设置是实例级别的，因此只有实例管理员可以更改。管理员通过环境变量指定，而非存储在数据库中：

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

空值表示不授予任何人。更改后需重启后端。此列表中的账户还可以在 Settings 中看到 **SSO** 标签页，并且即使密码登录被禁用，仍保留密码访问权限——参见[禁用密码登录](#禁用密码登录)。

## 向您的提供商注册 Heym

在您的身份提供商中，创建一个 **confidential client**（也称为 app registration），配置如下：

| 设置 | 值 |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | 开启——Heym 使用 client secret |
| Redirect URI | Heym 的 SSO 标签页中显示的确切值 |
| Scopes | `openid email profile` |

Heym 根据 `FRONTEND_URL` 计算 redirect URI，并在设置表单中以只读方式显示，附带复制按钮。它始终以 `/api/auth/sso/callback` 结尾。请复制而非手动输入——redirect URI 不匹配是最常见的配置失败原因，且提供商在拒绝时不会给出任何解释。

您的提供商必须返回经过验证的电子邮件地址。参见[账户映射](#账户映射)。

## 配置 Heym

打开 **Settings → SSO**。该标签页仅对 `HEYM_ADMIN_EMAILS` 中的账户可见。

| 字段 | 作用 |
|-------|--------------|
| **Enable single sign-on** | 在登录界面显示登录按钮。 |
| **Issuer URL** | 提供商的 base URL，例如 `https://idp.example.com/realms/your-realm`。Heym 会追加 `/.well-known/openid-configuration` 并从中读取其余信息。 |
| **Client ID** | 来自您提供商的 client identifier。 |
| **Client secret** | 加密存储。留空则保留已存储的值——Heym 绝不会返回其持有的 secret。 |
| **Redirect URI** | 只读。请将其复制到您提供商的 allowlist 中。 |
| **Scopes** | 默认为 `openid email profile`。 |
| **Sign-in button label** | 登录界面按钮上的文本，例如 "Sign in with Okta"。 |
| **Create an account on first sign-in** | 未知用户是否自动获得 Heym 账户。 |
| **Allowed email domains** | 逗号分隔。留空则允许提供商验证的任何域名。 |
| **Disable password sign-in** | 在实例范围内关闭密码身份验证。 |

### 先测试连接

**Test connection** 会获取 discovery document 和提供商的签名密钥，然后报告其找到的 token endpoint。您可以对已输入但尚未保存的 issuer 运行测试，因此错误的 URL 只需一次点击而非一次保存的代价。

仅当测试的 issuer 与已存储的 issuer 一致时，测试才会*记录*通过结果。草稿测试只告知您该 URL 是否可解析；它并不为未保存的配置背书。更改 issuer、client ID、scopes 或 secret 会清除已记录的结果，原因相同。

## 登录流程

1. 用户在登录界面点击登录按钮。
2. Heym 将其重定向到提供商，附带 `state`、`nonce` 和 PKCE challenge。
3. 用户通过提供商进行身份验证。
4. 提供商携带 authorization code 重定向回 Heym 的 callback。
5. Heym 用该 code 换取 tokens，并依据提供商公布的密钥验证 ID token，检查签名、audience、issuer、有效期和 nonce。
6. Heym 解析账户并签发自己的会话，与密码登录完全一致。

第 6 步之后的所有环节均保持不变：相同的 session cookies、相同的 token 生命周期、相同的权限。

## 账户映射

Heym 按以下顺序解析账户：

1. **`(issuer, subject)`** —— 提供商在先前登录中声明的身份。这是权威依据，且在提供商处更改电子邮件后依然有效。
2. **已验证的电子邮件** —— 使用该地址的现有 Heym 账户将被认领，此后提供商 subject 会记录在该账户上。
3. **新账户** —— 如果 **Create an account on first sign-in** 已开启且域名被允许，则创建新账户。

仅当 ID token 携带 `email_verified: true` 时，电子邮件才被视为已验证。如果该 claim 为 `false` 或缺失，登录将被拒绝。凭借提供商不愿背书的地址来认领现有账户——或创建新账户——是一条账户接管路径，因此 Heym 不会这样做。从不发出 `email_verified` 的提供商需要配置为发出该 claim。

以此方式创建的账户没有密码。它们仅通过提供商登录。

## 禁用密码登录

**禁用密码登录**开关在满足以下三个条件之前始终不可用：

1. 已启用 SSO。
2. 连接测试已通过，这样错误的 issuer 就不会把门从里面锁上。
3. `HEYM_ADMIN_EMAILS` 中至少有一个账户确实拥有密码。

当该开关开启时，所有三个签发或接受密码认证的界面都会拒绝密码认证：登录表单、**注册**以及 MCP OAuth 同意页面。注册也算在内，因为它会签发密码；如果放任其开放，任何能访问 `/register` 的人都能绕过该设置。

`HEYM_ADMIN_EMAILS` 中列出的账户不受这三者限制。能编辑环境文件的人本就可以恢复实例，因此这一保证存在于代码中，而非依赖运维人员的记忆。

### 为什么存在第三个条件

如果管理员的 Heym 账户是*通过* SSO 创建的，那么该账户根本没有密码。豁免规则会让他们通过这道门，但他们没有任何可用于登录的凭据——因此一旦身份提供商宕机，实例将无法恢复。Heym 拒绝进入这种状态，并会明确告知。

如果遇到该提示，请通过 SSO 登录，并在您的某个管理员地址上注册一个密码账户（注册之所以仍对管理员地址开放，正是出于这个原因），或者将一个已有密码的地址添加到 `HEYM_ADMIN_EMAILS`。

### 身份提供商宕机时的恢复方法

按优先级排序：

1. **使用应急管理员密码登录。** 当密码登录关闭时，登录界面会隐藏密码表单，因此请点击 SSO 按钮下方的 **改用密码登录** 以显示它。该表单并非绕过手段：`HEYM_ADMIN_EMAILS` 之外的每个地址仍会被拒绝，并被告知原因。
2. **将您自己添加到环境文件中的 `HEYM_ADMIN_EMAILS`**，然后重启后端。已有密码的账户随后即可登录。
3. **直接在数据库中重新开启密码登录**，前提是没有任何管理员拥有密码：

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   无需重启；该设置按请求读取。

Portal 最终用户不受影响。他们针对单独的目录进行认证——参见 [Portal](./portal.md)。

## 登录错误

登录失败会返回登录界面并显示可读的消息。Heym 从不显示身份提供商的原始错误文本。

| 消息 | 原因 |
|---------|-------|
| 该登录尝试已过期 | 该尝试耗时超过十分钟，或浏览器丢弃了事务 cookie。请重试。 |
| 无法访问身份提供商 | Discovery 或 Token 交换失败。请检查 issuer URL，以及后端能否访问该身份提供商。 |
| 无法验证身份提供商的响应 | ID token 未通过签名、audience、issuer、过期时间或 nonce 校验。通常是 client ID 不匹配。 |
| 身份提供商未返回电子邮件地址 | 缺少 `email` scope，或身份提供商未释放该 claim。 |
| 您的电子邮件地址未验证 | 身份提供商发送了 `email_verified: false`，或省略了该 claim。 |
| 您的电子邮件域不被允许 | 该地址不在 **允许的电子邮件域** 范围内。 |
| 不存在与您对应的 Heym 账户 | **首次登录时创建账户** 已关闭，且没有匹配的账户。必须由管理员创建一个。 |
| 未配置单点登录 | SSO 已禁用，或缺少 issuer、client ID 或 secret。 |

## 安全说明

- **client secret 静态加密**，且任何 endpoint 都不会返回它。设置表单仅报告是否已存储。
- **PKCE verifier 从不离开 Heym。** 它保存在短期的 `HttpOnly` cookie 中，而非 `state` 参数中——后者会以明文形式经由身份提供商往返。
- **仅接受非对称签名。** 无论身份提供商声明什么，`none` 和对称算法都会被拒绝。
- **登录后目标地址会经过校验**，必须是同源路径，因此回调无法被用作开放重定向。
- **每次登录都会被审计。** 成功、失败和拒绝都会以 `auth.sso_login` 行记录，配置变更则以 `sso_settings.update` 记录——参见 [审计日志](./audit.md)。

## 不支持的功能

- **SAML。** OIDC 是唯一支持的协议。
- **多个同时使用的身份提供商。** 一个实例只连接一个身份提供商。
- **来自身份提供商 claim 的组或角色映射。**
- **单点登出。** 登出 Heym 不会将您从身份提供商登出。
