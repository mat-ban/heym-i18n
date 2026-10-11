# Drive

Drive 标签页提供了一个集中位置，用于查看、管理和共享由 skill 生成的所有文件。

## 访问 Drive

在仪表板中导航至 **Drive** 标签页。由你的 workflow skill 生成的所有文件都会显示在此处，并按创建日期排序。

## 文件列表

文件列表显示以下信息：

- **Name** - 原始文件名，附带类型专属图标
- **Type** - 文件 MIME 类型（例如 pdf、csv、docx）
- **Size** - 人类可读的文件大小
- **Source** - 生成该文件的节点标签
- **Date** - 文件创建时间
- **Actions** - 下载、共享和删除按钮

## 批量操作

你拥有的每个文件在其行首都有一个复选框。通过团队共享给你的文件为只读，无法被选中。选择多个文件（Shift 点击选择连续范围；表头复选框选择整页），列表上方会显示批量操作栏，然后点击 **Bulk actions** 打开一个对话框，对每个选中的文件应用相同设置：

- **Share all with my teams** / **Remove team sharing** — 一次性切换所有选中文件的团队共享
- **Create share link for each file** — 使用相同的过期时间、密码和最大下载次数为每个选中文件创建共享链接

对话框会报告其应用到的文件数量；你不拥有的文件将被跳过。列表底部的每页行数选择器（25 / 50 / 100 / **All**）允许你在单页加载更多文件，以便在整个 Drive 中进行选择。

## 共享文件

点击 **Share** 图标打开共享对话框。你可以为每个文件创建多个具有不同配置的共享链接，并可选择将文件共享给你当前的团队。

### 公开链接（基于 Token）

创建一个无密码的共享链接。任何拥有该链接的人都可以下载文件。

### 密码保护链接（Basic Auth）

在创建共享时设置密码。下载 URL 使用 HTTP Basic Authentication——浏览器在打开链接时会提示输入用户名（`file`）和密码。

### 链接选项

- **Expires (hours)** - 可选设置过期时间
- **Max downloads** - 可选限制下载次数
- 两者可以组合使用以实现最大控制

### 与我的团队共享

启用 **Share with my teams** 可授予你当前所属的所有团队只读访问权限。团队成员可以从 Drive 查看和下载文件，并使用面向读取的 Drive 节点操作，但只有文件所有者才能删除文件、创建或撤销公开链接，或更改密码/TTL/下载限制。

该设置是文件专属的。如果你之后加入或创建了另一个团队，请再次切换共享，或运行 Drive 节点的 `shareWithMyTeams` 操作来添加该团队。使用 `unshareWithMyTeams` 可在 workflow 中移除文件的团队共享。

### 管理共享

共享对话框显示所有现有的共享链接，包括：
- 当前下载次数
- 过期状态
- 是否启用了 Basic Auth
- 复制和撤销按钮

## 聊天与 Portal 中的文件链接

当 skill 在通过 Portal 聊天或 Quick Drawer 执行 workflow 期间生成文件时，下载链接会自动出现在响应中。用户可以直接点击下载。

## 存储

生成的文件存储在服务器文件系统的 `data/files/` 目录下。在 Docker 部署中，该目录作为卷挂载以实现持久化。

## 从 Workflow 管理文件

[Drive 节点](../nodes/drive-node.md) 允许你在 workflow 中以编程方式管理 Drive 文件。使用它可以：

- **列出**你的文件并返回元数据，如文件名、MIME 类型、大小、来源和下载 URL
- 在文件交付给用户后**删除**文件
- **与你的团队共享或取消共享**，使团队成员仅在团队共享存在期间可以读取和下载文件
- 在下载链接上**设置密码**
- **设置 TTL**，使链接在 N 小时后过期
- **设置最大下载次数**限制

将文件转换为其他格式是 [Converter 节点](../nodes/converter-node.md) 的职责，使用 `conversion: "fileConvert"`。它读取一个 Drive 文件并将转换结果存储为新文件。

通过 skill 输出中的文件 ID 引用文件：`$agentLabel._generated_files[0].id`

有关配置详情，请参阅 [Drive 节点文档](../nodes/drive-node.md)。

## 从 Skill 读取 Drive 文件

Agent skill 可以通过 skill 卡片的 **Enable Drive files** 设置选择启用 Drive 读取。启用后，skill 运行时将包含生成的 `heym_drive.py` 辅助程序。Skill 代码可以导入诸如 `read_drive_text`、`read_drive_file`、`read_drive_base64`、`get_drive_file`、`get_drive_file_path` 和 `list_drive_files` 等辅助函数。

Drive 读取仅限于 workflow 执行者有权访问的文件：拥有的文件以及通过团队共享给执行者的文件。使用文件 ID 进行精确查找，或当用户按名称引用文件时使用精确文件名。文件名查找返回该名称下最新的可访问文件；`list_drive_files(filename="...")` 返回所有匹配项。

## 相关

- [Drive 节点](../nodes/drive-node.md) - Workflow 操作（列出、获取、删除、密码、TTL、最大下载次数、团队共享）
- [Drive 标签页](../tabs/drive-tab.md) - 在仪表板中浏览文件
- [文件生成](./file-generation.md) - `_generated_files` 和下载 URL 是如何生成的

## 清理
过期的共享 Token 每天会自动清理。文件本身会一直保留，直到通过 Drive 标签页手动删除。使用 **Clear All** 可一次性删除所有文件及其共享链接。
