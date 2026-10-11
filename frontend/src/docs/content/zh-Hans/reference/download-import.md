# 下载与导入

将工作流或整个文件夹导出为文件，或通过拖放方式导入。可用于备份、共享或在实例之间迁移工作流。

## 下载工作流（JSON）

**位置：** 编辑器工具栏 → **Download** 按钮（在大屏幕上可见）

**导出内容：**
- `nodes` – 画布上的所有节点
- `edges` – 节点之间的所有连接

**文件名：** `{workflow-name}.json`（根据工作流名称生成）

**格式：** 有关 JSON schema，请参阅[工作流结构](./workflow-structure.md)。

## 下载文件夹（ZIP）

**位置：** 仪表板 → Workflows 标签页 → 文件夹三点菜单 → **Download as ZIP**

**导出内容：**
- 文件夹及其所有子文件夹中的所有工作流（递归导出）
- 文件夹层级结构以目录形式保留在 ZIP 内

**ZIP 结构：**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

每个 `.json` 文件包含 `{ name, nodes, edges }`。

## 导入

### 从仪表板（Workflows 标签页）

1. 前往 [Workflows](../tabs/workflows-tab.md) 标签页
2. 将 **JSON** 或 **ZIP** 文件拖放到工作流区域

**JSON 文件：** 将创建一个新的工作流。工作流名称来自 JSON 中的 `name` 字段，如果 `name` 缺失，则使用文件名。

**ZIP 文件：** 整个文件夹结构将在根层级重新创建。ZIP 内的每个 `.json` 文件将成为一个工作流，并放置在对应的文件夹中。当前实例中不存在的凭证和跨工作流引用将被自动清除。如果部分工作流导入失败，将显示成功导入数量的摘要。

### 从画布（编辑器）

1. 在编辑器中打开一个工作流
2. 将 JSON 文件拖放到画布上
3. 如果画布上已有节点或边，将弹出确认对话框，询问是否替换当前工作流
4. 导入的节点和边将替换或合并到当前工作流中

## 文件格式

### JSON（单个工作流）

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – 必填；节点对象数组
- `edges` – 可选；边对象数组（默认为 `[]`）
- `name` – 可选；从仪表板导入创建新工作流时使用

### ZIP（文件夹）

ZIP 归档文件，其目录结构镜像文件夹层级。每个文件都是一个工作流 JSON（见上文）。文件夹名称和工作流名称分别来自目录名称和文件名称。

有关节点和边的格式，请参阅[工作流结构](./workflow-structure.md)。

## 使用场景

- **备份** – 在进行重大更改之前下载工作流或整个文件夹
- **共享** – 导出 JSON 文件并与团队成员共享
- **迁移** – 在 Heym 实例之间移动工作流或文件夹结构
- **版本控制** – 将工作流 JSON 与代码一起存储在 Git 中

## 相关内容

- [工作流结构](./workflow-structure.md) – 节点和边的 JSON 格式
- [Workflows 标签页](../tabs/workflows-tab.md) – 创建工作流并通过拖放导入
- [工作流组织](./workflow-organization.md) – 文件夹和子文件夹
- [画布功能](./canvas-features.md) – 编辑器功能，包括画布导入
