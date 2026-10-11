# 团队

Teams 让你可以一次性将 Workflow、凭据、全局变量、向量存储和 Drive 文件分享给一组用户。

## 概述

- **Team** – 一个具有名称的分组，包含创建者和成员
- **Creator** – 始终是成员；可以编辑 Team、删除 Team、添加成员
- **Member** – 可以添加和移除其他成员（创建者除外）；可以访问分享给该 Team 的资源

## 创建和管理 Teams

从 [Teams 标签页](../tabs/teams-tab.md)创建 Team。通过邮箱添加成员；他们必须拥有账户。创建者无法被移除。删除 Team 会移除所有 Team 分享。

## 分享模型

资源可以分享给：

1. **个人用户** – 通过邮箱（用户对用户分享）
2. **Teams** – 通过选择 Team（Team 分享）

两种模型是叠加的。用户获得访问权限的条件是：

- 被直接分享（用户分享），或
- 是拥有 Team 分享的 Team 的成员

## 可以分享给 Teams 的内容

| 资源 | 分享位置 |
|----------|----------------|
| Workflows | Workflow 编辑器中的分享对话框 |
| Workflow Templates | 创建/编辑 Workflow 模板时的分享对话框 |
| Node Templates | 创建/编辑节点模板时的分享对话框 |
| Credentials | Credentials 标签页中的分享对话框 |
| Global Variables | Variables 标签页中的分享对话框 |
| Vector Stores | Vectors 标签页中的分享对话框 |
| Drive Files | Drive 标签页中的分享对话框，或 Drive 节点的 `shareWithMyTeams` / `unshareWithMyTeams` 操作 |

对于模板，当可见性为 **Specific users** 时，你也可以选择 Teams。所选 Teams 的所有成员都将获得该模板的访问权限。
Drive 文件的 Team 分享对 Team 成员是只读的；文件所有者保留管理权限。

## API Endpoints

- `GET /api/teams` – 列出用户所属的 Teams
- `GET /api/teams/{id}` – 获取 Team 详情及成员
- `GET /api/teams/{id}/shared-entities` – 返回分享给该 Team 的实体（Workflows、Credentials、Global Variables、Vector Stores、Files、Workflow Templates、Node Templates）
- `POST /api/teams` – 创建 Team
- `PATCH /api/teams/{id}` – 更新 Team
- `DELETE /api/teams/{id}` – 删除 Team（仅创建者）
- `POST /api/teams/{id}/members` – 添加成员（body：`{ "email": "..." }`）
- `DELETE /api/teams/{id}/members/{user_id}` – 移除成员

各资源的 Team 分享：

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body 接受 `permission`（`read` 或 `write`，默认 `write`）；对已存在的 Team 再次 POST 会更新其权限
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## 相关

- [Teams 标签页](../tabs/teams-tab.md) – 创建和管理 Teams
- [Templates 标签页](../tabs/templates-tab.md) – 将 Workflow 和节点模板分享给 Teams
- [Credentials 分享](./credentials-sharing.md) – 将 Credentials 分享给用户和 Teams
- [Workflow 组织](./workflow-organization.md) – 文件夹和 Workflow 分享
