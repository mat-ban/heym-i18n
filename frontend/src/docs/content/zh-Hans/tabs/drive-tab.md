# Drive 标签页

Drive 标签页显示您的 Workflow 中所有由 skill 生成的文件。

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ 观看 Drive 演示</a></p>

## 概述

由 skill 生成的文件（PDF、DOCX、CSV、图片等）会自动存储并列出在 Drive 标签页中。每个文件显示其名称、类型、大小、来源节点、创建日期以及团队共享状态。

## 功能

- **搜索** - 按名称、类型或来源节点筛选文件
- **复制文件 ID** - 将文件 UUID 复制到剪贴板，可直接粘贴到 [Drive](../nodes/drive-node.md) 或 [Converter](../nodes/converter-node.md) 节点中
- **下载** - 对您的文件以及通过团队共享给您的文件进行认证下载
- **共享** - 创建可分享的下载链接，支持可选的密码保护和过期时间，或将文件以只读方式共享给您当前的团队
- **删除** - 移除文件及其共享链接
- **全部清除** - 确认后删除所有文件及其共享链接
- **批量操作** - 使用复选框选择多个文件（Shift 点击选择范围），并一次性对全部选中文件应用相同操作
- **分页** - 浏览大量文件集合，支持每页行数选择器（25 / 50 / 100 / 全部）

## 批量操作

您拥有的文件会在行首显示复选框（通过团队共享给您的文件为只读，不可选择）。选择多行——或使用表头复选框选择整页，**Shift 点击**选择范围——然后使用列表上方出现的批量操作栏：

- **下载 ZIP** 将所有选中文件打包为单个 ZIP 压缩包并下载
- **批量操作** 打开一个对话框，对每个选中文件应用同一设置：
  - 一键 **全部共享给我的团队** / **移除团队共享**
  - **为每个文件创建共享链接**，使用相同的密码、过期时间和最大下载次数设置
- **删除** 确认后移除所有选中文件及其共享链接
- **清除选择** 取消选择所有内容

对话框会报告已应用到多少个文件（不属于您的文件将被跳过）。使用每页行数选择器的 **全部** 选项可在单页加载所有文件，从而在整个 Drive 范围内进行选择。在搜索框中输入会自动将每页行数选择器切换为 **全部**，使搜索覆盖所有文件而非仅当前页；清除搜索后恢复您之前的选择。

## 共享

创建共享链接时可配置：
- **无认证** - 基于 Token 的公开下载 URL
- **Basic Auth** - 密码保护的链接（用户名：`file`）
- **过期时间** - 可选的时间过期设置
- **下载限制** - 可选的最大下载次数

在文件上启用 **共享给我的团队** 可使其对您当前所属的所有团队可见。共享的团队成员获得只读访问权限；管理操作仅限所有者。

## Agent Skill 访问

Agent 节点上的 skill 可以选择读取 Drive 文件。当某个 skill 的 **启用 Drive 文件** 开启时，其 Python 代码可通过生成的 `heym_drive.py` 辅助程序按文件 ID 或精确文件名读取可访问的 Drive 文件。该设置默认关闭。

完整详情请参阅 [Drive 参考](../reference/drive.md)。

## 相关

- [Drive 节点](../nodes/drive-node.md) - 从 Workflow 中列出文件、获取元数据、与团队共享或更改共享约束
- [文件生成](../reference/file-generation.md) - skill 如何生成文件
- [Drive 参考](../reference/drive.md) - 共享链接、Token 和清理
- [Portal](../reference/portal.md) - Portal 聊天回复中的文件链接
