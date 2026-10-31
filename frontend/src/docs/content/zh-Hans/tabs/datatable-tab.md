# DataTable

**DataTable** 标签页让您可以直接在 Heym 中创建和管理结构化数据表。表格可通过 [DataTable 节点](../nodes/datatable-node.md) 在 Workflow 中使用，以进行程序化 CRUD 操作。

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ 观看 DataTable 演示</a></p>

## 创建表格

1. 从仪表盘导航至 DataTable 标签页
2. 点击 **Create DataTable**
3. 输入名称和可选描述
4. 使用列编辑器添加列

## 列

每列包含以下属性：

| 属性 | 描述 |
|----------|-------------|
| Name | 列显示名称 |
| Type | `string`、`number`、`boolean`、`date` 或 `json` |
| Required | 新行是否必须包含此列 |
| Unique | 值是否必须在各行之间唯一 |
| Default Value | 当行省略此列时自动填充 |

可在表格详情视图的头部添加、编辑或删除列。

## 使用 AI 生成列

除了手动添加列之外，您还可以用自然语言描述表格（或粘贴示例 JSON），让 LLM 提出 schema 建议。两个入口打开的是同一个对话框：

- **Generate with AI**（DataTable 列表头部）——根据您的描述创建一个全新的表格。
- **AI columns**（表格详情视图，位于列控件旁边）——为当前打开的表格提出要追加的*新*列建议。

### 工作原理

1. 选择一个 **LLM credential** 和 **model**（默认为您的第一个 LLM credential 及其最新模型）。
2. 输入描述——例如*“一个书籍表格，包含标题、作者、页数以及是否已读”*——或粘贴 JSON 示例/schema。
3. 点击 **Generate**。模型将返回建议的 schema。
4. 在可编辑表单中查看生成的列：修改每列的 **name**、**type**、**default**、**unique** 和 **notEmpty**（必填），删除不需要的列，或手动 **Add column**。对于新表格，您还可以编辑 AI 建议的 **name** 和 **description**。
5. 点击 **Create Table**（新表格）或 **Add Columns**（已有表格）以保存。随时按 **Esc** 关闭对话框。

### 已有表格仅支持追加

为已有表格生成列时，模型会将您当前的列作为上下文，仅提出**新**列建议。已有列及其数据绝不会被修改或删除——生成的列将被追加。重复名称（不区分大小写）会被自动丢弃。

> 需要 LLM credential（OpenAI、Google 或 Custom）。如果您还没有，请先在 Settings 中添加。

## 管理行

- **添加行**：点击添加按钮创建新行
- **内联编辑**：双击任意单元格编辑其值。按 Enter 或点击其他区域保存，按 Escape 取消
- **删除行**：使用行操作菜单删除行
- **分页**：每页显示 25 行，支持页面导航

## CSV 导入/导出

### 导入
1. 在表格详情视图中点击 **Import CSV**
2. 选择要上传的 CSV 文件
3. 预览前 5 行及列映射
4. 绿色列已匹配到现有表格列；黄色列未匹配
5. 点击 Import 批量插入行

### 导出
点击 **Export CSV** 将所有行下载为 CSV 文件。

## 共享

与其他用户或团队共享表格：

1. 从表格详情视图打开共享对话框
2. 按邮箱添加用户，授予 **read** 或 **write** 权限
3. 添加团队，授予 **read** 或 **write** 权限
4. 只读用户可以查看数据；写入用户可以修改行和列。重命名表、更改表描述以及管理共享仍仅限所有者操作。

## 从 AI Assistant 创建表格

Canvas [AI 助手](../reference/ai-assistant.md#data-tables)、[Chat](./chat-tab.md) 以及 [MCP 标签页](./mcp-tab.md)上的 `heym_chat` 工具可以为其构建的 Workflow 选择您的某个表，或创建一个新表。它们会建议名称和列，并在您提交问题卡时创建表。Canvas 助手根据表元数据配置 Workflow 节点。Chat 和 `heym_chat` 还可以检查行、添加或删除列，并直接插入、更新或删除行。向它们提供表名或此标签页的链接即可。写入操作需要所有权或直接/团队**写入**权限。添加列会保留现有数据；删除列会从每行中删除其对应的值。删除列和清除所有行都会要求确认，与此标签页一致。

## 在 Workflow 中使用

[DataTable 节点](../nodes/datatable-node.md) 将表格连接到 Workflow。操作包括 find、getAll、getById、insert、update、remove 和 upsert。无需 credential。

## LLM Cost Table（系统表格）

在您创建的表格上方有一个固定的 **System tables** 区域，其中包含一个条目：**LLM Cost Table**。这是一个固定 schema、按用户可编辑的按模型定价视图，供 [Traces](./traces-tab.md) 成本图表使用。

### 数据来源

Heym 维护一个全局的按模型定价表格，数据来自 Helicone 的公开定价 Endpoint（`https://www.helicone.ai/api/llm-costs`）。同步在您首次打开该表格或 Traces 时在后台运行，并限制为每 24 小时获取一次。点击 **Refresh** 可强制立即重新同步。上游列表中已被 Helicone 移除的条目不会在本地删除，因此历史成本查询保持稳定。

### Schema（只读列）

| 列 | 含义 |
|---|---|
| Provider | `ANTHROPIC`、`OPENAI`、`GOOGLE` 等（信息性，供 Helicone 使用） |
| Model | 与 `trace.model` 匹配的模型标识符 |
| Op | 匹配运算符：`equals`、`startsWith` 或 `includes` |
| Input $/1M | 每 100 万 prompt Token 的美元价格 |
| Output $/1M | 每 100 万 completion Token 的美元价格 |
| Source | `helicone`、`seed` 或 `user` |

### 自定义定价

- **编辑某一行**可覆盖其价格。您的覆盖是按用户生效的，并会标记为 `Customized` 徽章；后续 Helicone 同步不会改动它。
- **重置为默认值**会移除覆盖，并为该行恢复全局值。
- **添加自定义模型**会打开一个对话框，用于创建仅属于该用户的行（例如 Helicone 未列出的私有微调模型）。自定义行会标记为 `User added`，删除它们会将其彻底移除。

### 与 trace 匹配

当 Traces 仪表盘计算成本时，它会将每个 `trace.model` 与以下内容进行匹配：

1. 首先匹配您的覆盖项（按模型名称精确匹配）
2. 否则匹配全局表——`equals` 精确匹配优先于 `startsWith`/`includes`；同一运算符内的并列项按最长匹配的模型前缀/子字符串解决

如果没有行匹配，该模型会列在 Traces 页面上的 **Unpriced models** 提示下；在您添加自定义行或覆盖某一行之前，它的成本贡献为零。

## 相关内容

- [DataTable 节点](../nodes/datatable-node.md) - Workflow 节点参考
- [Traces 标签页](./traces-tab.md) - 使用 LLM Cost Table 生成成本环形图和 KPI 卡片
- [Grist 节点](../nodes/grist-node.md) - 外部电子表格替代方案
- [Variables 标签页](./global-variables-tab.md) - 键值存储替代方案