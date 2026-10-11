# 全局变量

**全局变量存储**保存持久的、用户范围的键值数据，这些数据可跨工作流执行存活。可将其用于配置、功能标志、计数器或多个工作流所需的共享状态。

> **请勿在此存储机密信息。** 全局变量并非机密保管库：其值以未加密形式存储，会完整返回给任何您共享的对象，且协作者可以编辑它们。API 密钥、密码和 Token 应存放在 [Credentials](./credentials.md) 中，该功能会对其进行静态加密，且绝不会将机密返回给客户端。

## 本地变量与全局变量

| 存储 | 语法 | 作用域 | 持久性 |
|-------|--------|-------|-------------|
| **工作流本地** | `$vars.variableName` | 仅当前执行 | 内存中，执行结束时丢失 |
| **全局** | `$global.variableName` | 该用户的所有工作流 | 持久化于数据库 |

## 创建全局变量

1. **从 Variables 标签页** – [Variables 标签页](../tabs/global-variables-tab.md)：直接创建、编辑和删除变量。
2. **从 Variable 节点** – 在节点属性中启用 **Store in Global Variable Store**（`isGlobal: true`）。工作流运行时，该变量将写入存储。

## 在表达式中使用

使用 `$global.variableName` 访问全局变量：

```
$global.environment
$global.settings.baseUrl
$global.userId
```

使用与工作流本地变量相同的方法（例如 `.upper()`、`.length`、数组的 `.add()`）。

## 值类型

支持的类型：`string`、`number`、`boolean`、`array`、`object`。在创建或编辑变量时选择类型。

## 共享全局变量

您可以将全局变量共享给其他用户或 [Teams](./teams.md)，以便他们在自己的工作流中使用。

- **共享给用户** – 点击所拥有变量旁的共享图标，输入收件人的电子邮件，然后点击 **Share**。收件人将在其 Global Variables 列表中看到该变量，并带有 **Shared** 徽章和“Shared by &lt;your email&gt;”标签。
- **共享给团队** – 在共享对话框中，选择一个团队并点击 **Add**。所有团队成员均可访问。
- **可编辑访问权限** – 收件人可以查看、编辑共享变量，并在其工作流中通过 `$global.variableName` 引用它。只有所有者可以共享、取消共享或删除该变量。
- **名称冲突** – 如果收件人已有同名变量，其自己的变量优先于共享变量。
- **取消共享** – 打开该变量的共享对话框，点击要移除访问权限的用户旁的 **×** 按钮。

## Chat 集成

全局变量可供 [Chat](../tabs/chat-tab.md) 助手使用。LLM 在回答问题或生成内容时可以引用它们。

## 相关

- [Variables 标签页](../tabs/global-variables-tab.md) – 在 UI 中管理全局变量
- [Variable 节点](../nodes/variable-node.md) – 使用 `isGlobal` 设置变量
- [Expression DSL](./expression-dsl.md) – `$global` 语法
