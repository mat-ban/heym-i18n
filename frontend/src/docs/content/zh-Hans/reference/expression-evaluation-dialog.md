# 表达式评估对话框

表达式求值对话框是支持表达式字段的扩展编辑器。它从表达式输入框旁边的展开按钮打开，为你提供更大的工作区、自动补全、实时后端预览和输出浏览，全部集中在一处。

## 打开对话框

- 在 Properties 面板中，点击表达式字段旁边的展开按钮。
- 多行字段会在输入框内部显示该按钮。
- 单行字段会在输入框右侧显示该按钮。

## 对话框布局

- 对话框以居中模态框的形式打开，尺寸约为 **80vw × 80vh**。
- 当字段标签已知时，标题栏显示 **Evaluate — {field name}**。
- 编辑器保留自动补全、字段间导航以及常规的 **Apply** / **Cancel** 操作。
- 停止输入约 **300 ms** 后，预览会自动刷新。
- 按 `Ctrl` / `Cmd` + `Enter` 可将当前文本应用回字段并关闭对话框（等同于 **Apply**）。

## Output 区域

在编辑器中暂停输入后，Output 区域会自动刷新。

### 求值

| 表达式类型 | 结果 |
|---|---|
| 单个 `$expr`（整个字段） | 保留原生值 |
| 单个裸点路径（整个字段，无 `$`，无嵌入换行符） | 等同于 `$` + 该路径（后端会规范化后求值） |
| 包含嵌入 `$refs` 的文本 | 最终结果始终为字符串 |
| 字面文本（无 `$`，且不是单个点路径） | 按原样返回 |

**示例**

| 输入 | 结果 |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items`（当整个值为此路径时，等同于 `$input.items`） | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

求值上下文按以下顺序构建：

- 上游节点上的 **Pinned data**
- 画布中的 **Last run outputs**
- 当没有可用的上游数据时为 `null`

如果当前节点有上游依赖，但其中没有任何一个具有 pinned data 或最近的运行结果，对话框会先执行一次测试运行以构建上下文，然后再对当前文本求值。

### Output 路径选择器

当后端结果为对象或数组时，Output 区域可以显示交互式路径选择器，而不是原始 JSON。

- 双击某一行，将该路径追加到当前的 `$node.path` 引用中。
- 单击可展开的行，以打开或关闭分支。
- 使用内置查询框搜索键、值和路径字符串。

## 自动补全

- 输入 `$` 可打开上游节点、内置项和方法的建议列表。
- 按 `Tab` 或 `Enter` 插入选中的建议。
- 使用 `↑` / `↓` 在建议列表中移动。

### 示例答案

当你用点继续一个 `$…` 引用时，每个建议行都会在右侧以粗体显示该建议将产生的结果。

- 输入 `$set.listItems.first().toString().u` 会列出 `upper`、`urlEncode`、`urlDecode` 和 `unescape`，每个都带有其求值结果——因此你可以根据结果而非名称来选择。
- 输入 `$node.text.toJson()` 会将 JSON 字符串解析为对象或数组。在 `.toJson()` 之后，当 last-run 或 pinned 输出可用时，自动补全可以提供解析后的键（例如 `repoUrl`）。
- 结果在后端针对对话框预览所使用的相同 pinned data 和 last-run outputs 进行求值，因此它们与字段将产生的结果一致。
- 只有能够独立成立的候选建议才会被求值：零参数方法（`upper()`、`first()`、`keys()`、`toJson()`）和普通属性（`length`、`year`）。需要先提供参数的候选建议——`map`、`filter`、`sort`、`replace`——则留空。
- 当候选建议无法产生答案时，该行保持空白：错误、`null`，或该方法不适用于该值。
- 答案会被缩短为一行。将鼠标悬停在缩短的答案上可查看更多内容。

## Build with AI

当加载了 workflow 时，求值对话框的右上角会显示 **Build with AI** 按钮。它会打开一个嵌套模态框，你可以在其中用纯文本描述想要的表达式，并让 LLM 为你生成。

### 工作原理

1. 在求值对话框工具栏中点击 **Build with AI**。
2. 从下拉列表中选择一个 LLM credential 和模型。
3. 输入你想要内容的纯文本描述——例如，*"Get the customer name from the API response"*。
4. 点击 **Generate**。该模态框会调用后端，后端使用 [Expression DSL](./expression-dsl.md) 系统提示词以及你最近一次 workflow 运行输出作为上下文，并返回单个表达式字符串。
5. 生成的表达式会立即针对相同的画布数据求值，因此你可以在应用之前看到结果。
6. 点击 **Apply** 用生成的表达式替换编辑器内容，或点击 **Regenerate** 重试。

### 使用的上下文

生成器会接收画布上最近一次测试运行的节点输出。如果 workflow 尚未运行，LLM 会根据节点标签和 DSL 约定生成一个尽力而为的表达式。

### 要求

- 必须在 [Credentials](./credentials.md) 标签页中配置一个 LLM credential（OpenAI、Google 或 Custom）。
- 必须在编辑器中打开该 workflow。

## 键盘快捷键

| 快捷键 | 操作 |
|---|---|
| 输入暂停（约 300 ms） | 刷新后端预览 |
| `Ctrl` / `Cmd` + `Enter` | 应用并关闭对话框 |
| `Escape` | 先关闭自动补全，否则关闭对话框 |
## 方法参数中的嵌套 `$`

对于对话框 / 后端求值，当您需要动态键时，可以在 `.get($other.field)` 等调用中传入另一个带有嵌套 `$` 的引用。您也可以在 `.get(...)` 中使用裸路径（例如 `other.field`）；后端会以相同方式解析它。已保存的 Workflow 字段仍应遵循 [Expression DSL](./expression-dsl.md) 规则；为方便起见，evaluate API 也接受整行裸点路径（参见上表）。

## 导航

Set 和 Execute 映射编辑器可以显示 **Prev** / **Next** 按钮，以便您在不关闭对话框的情况下在字段之间移动。

## 相关

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — Build with AI 功能所必需
- [LLM 节点](../nodes/llm-node.md)
- [输出节点](../nodes/output-node.md)
- [Condition 节点](../nodes/condition-node.md)
